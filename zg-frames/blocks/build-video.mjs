#!/usr/bin/env node
// blocks/build-video.mjs: a scene list becomes the live video's index.html.
// Node port of build-video.ps1. PIPELINE step 5.
//
// Opus writes the scene list (step 4, the 3rd gate) as JSON:
//   {
//     "title": "One Sitting Workflow",
//     "channel": "zoltan-gero",
//     "audio": "assets/vo_bgm.mp3",
//     "scenes": [
//       { "block": "statement", "sent": "S1",
//         "vars": { "kick": "THE PROMISE", "line1": "of this video", "line2": "ONE SITTING" } },
//       { "block": "lead-card", "sent": "S40", "sectionEnd": true, "vars": { ... } }
//     ]
//   }
//   block  an archetype from CATALOG.md
//   sent   the sentence anchor: "S12", a range "S12-S15", or a split "S20#1/3"
//   vars   only the variables you want to change; the rest keep their default
//   hold   optional, seconds to linger after the last sentence (last scene only)
//
// Writes zg-frames/index.html IN PLACE (the project root, so blocks/ and fonts/
// resolve). After this, stamp-timing fills data-start/data-duration from the audio.
//
// USAGE
//   node build-video.mjs --scenes ../../ai-video-workflow/scenes.json
//   node build-video.mjs --scenes scenes.json --out ../video-preview.html

import fs from "node:fs";
import path from "node:path";
import { BLOCKS, REPO, CRLF, readMeta, read, write, psString } from "./_blocks.mjs";

const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.findIndex((x) => new RegExp(`^-+${name}$`, "i").test(x));
  return i >= 0 ? argv[i + 1] : undefined;
};
const scenesArg = opt("scenes");
if (!scenesArg) {
  console.error("Missing required option --scenes");
  process.exit(1);
}
const outRel = opt("out") ?? "../index.html";

const scenesPath = path.resolve(scenesArg);
const plan = JSON.parse(read(scenesPath));
if (!plan.scenes) throw new Error(`no 'scenes' array in ${scenesPath}`);
const scenes = Array.isArray(plan.scenes) ? plan.scenes : [plan.scenes];

const fontFace = read(path.join(BLOCKS, "_fontface.css"));

// validate every block + flag unknown variable keys (PowerShell hashtables are
// case-insensitive, so the check is too)
const known = new Map();
for (const sc of scenes) {
  const b = sc.block;
  if (!known.has(b)) {
    if (!fs.existsSync(path.join(BLOCKS, b, `${b}.src.html`))) throw new Error(`scene uses unknown block '${b}', see blocks/CATALOG.md`);
    const meta = readMeta(b);
    const ids = new Set((meta.variables ?? []).map((v) => String(v.id).toLowerCase()));
    known.set(b, { meta, ids });
  }
  if (sc.vars) {
    for (const k of Object.keys(sc.vars)) {
      if (!known.get(b).ids.has(k.toLowerCase())) {
        console.log(`\x1b[33mWARNING: scene '${b}' (sent ${psString(sc.sent)}): '${k}' is not a variable of block '${b}'.\x1b[0m`);
      }
    }
  }
}

// Each scene gets its own composition file: a copy of the generated block with
// (a) a unique data-composition-id (a repeated id collides) and (b) the scene's
// text/attributes BAKED IN at build time. No runtime variable system: HF's
// per-instance vars only surface through --<id> css props, and it refuses those
// for names like `sub`/`leftLabel`, so we substitute here instead.
const compDir = path.join(REPO, "compositions");
if (fs.existsSync(compDir)) {
  for (const f of fs.readdirSync(compDir)) if (/^s.*\.html$/i.test(f)) fs.rmSync(path.join(compDir, f), { force: true });
}
fs.mkdirSync(compDir, { recursive: true });

const htmlEnc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attrEnc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function bakeVars(html, vars) {
  if (!vars) return html;
  for (const [vid, raw] of Object.entries(vars)) {
    const val = psString(raw);
    // every wired element carries data-vars='{...}' mapping attr -> varId;
    // read each map and apply this var wherever it appears
    html = html.replace(/(<[a-z]+\b[^>]*\bdata-vars='(\{[^']*\})'[^>]*>)([^<]*)(<\/)/g, (whole, openTag, mapJson, innerText, tail) => {
      const map = JSON.parse(mapJson);
      let open = openTag;
      let inner = innerText;
      for (const [attr, target] of Object.entries(map)) {
        if (psString(target).toLowerCase() !== vid.toLowerCase()) continue; // PowerShell -ne is case-insensitive
        if (attr.toLowerCase() === "text") {
          inner = htmlEnc(val);
        } else {
          // attribute swap on the same tag (data-icon, data-path, data-words, data-val...)
          const an = reEsc(attr);
          if (new RegExp(`\\s${an}="`, "i").test(open)) {
            open = open.replace(new RegExp(`(\\s${an}=")[^"]*(")`, "g"), (_, p1, p2) => p1 + attrEnc(val) + p2);
          } else {
            open = open.replace(/>$/i, () => ` ${attr}="${attrEnc(val)}">`);
          }
        }
      }
      return open + inner + tail;
    });
  }
  // values are baked in now; strip data-vars so ZG.applyVars cannot re-apply a
  // (default) --css value over them at render time
  return html.replace(/\s+data-vars='[^']*'/g, "");
}

const slots = [];
scenes.forEach((sc, k) => {
  const i = k + 1;
  const b = sc.block;
  const sid = `s${String(i).padStart(3, "0")}-${b}`;
  const blockHtml = read(path.join(BLOCKS, b, `${b}.html`));
  let inst = blockHtml.split(`data-composition-id="${b}"`).join(`data-composition-id="${sid}"`).split(`"${b}")`).join(`"${sid}")`);
  inst = bakeVars(inst, sc.vars);
  write(path.join(compDir, `${sid}.html`), inst);

  const secEnd = sc.sectionEnd || known.get(b).meta.sectionEnd ? " data-section-end" : "";
  const hold = sc.hold ? ` data-hold="${psString(sc.hold)}"` : "";
  if (!sc.sent) throw new Error(`scene ${i} (${b}) has no 'sent' anchor`);
  slots.push(`  <div id="${sid}" data-composition-id="${sid}" data-composition-src="compositions/${sid}.html" data-sent="${psString(sc.sent)}" data-track-index="1" data-width="1920" data-height="1080"${secEnd}${hold}></div>`);
});

const audioTag = plan.audio ? `  <audio id="vo" src="${psString(plan.audio)}" data-start="0" data-track-index="10" data-volume="1"></audio>` : "";
const title = plan.title ? psString(plan.title) : "zg-frames video";

const doc = `<!doctype html>
<html lang="en" data-resolution="landscape">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1920, height=1080"/>
<title>${title}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
${fontFace}
  body{margin:0;background:#0b0f14;font-family:"Open Sans",system-ui,sans-serif}
  #root{position:relative;width:1920px;height:1080px;overflow:hidden}
  [data-composition-id="main"] > div[data-composition-src]{position:absolute;inset:0}
</style>
</head>
<body>
<!-- generated by build-video.ps1 from ${path.basename(scenesPath)}.
     data-start / data-duration are filled by pipeline/stamp-timing.ps1 from the audio. -->
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="1">
${slots.join(CRLF)}
${audioTag}
</div>
<script>
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = gsap.timeline({ paused: true });
</script>
</body>
</html>`;

const outPath = path.join(BLOCKS, outRel);
write(outPath, doc);
console.log(`\x1b[32mwrote ${outPath}  (${scenes.length} scenes)\x1b[0m`);
console.log("\x1b[90mnext: node ../../pipeline/stamp-timing.mjs --html index.html --sentences <sentences.json>\x1b[0m");
