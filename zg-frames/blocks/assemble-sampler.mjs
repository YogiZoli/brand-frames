#!/usr/bin/env node
// blocks/assemble-sampler.mjs: regenerate ../index.html as a mount host.
// Node port of assemble-sampler.ps1.
//
// The sampler is a thin host that mounts all 39 archetype blocks as
// sub-compositions, back to back, in the canonical order. Each block's duration
// comes from its own meta header, so the timeline is derived, never hand-kept.
// The pre-refactor monolith lives in git history (417ab8e:zg-frames/index.html).
//
// USAGE
//   node assemble-sampler.mjs
//   node assemble-sampler.mjs --out ../sampler-blocks.html   # elsewhere, keep index.html

import fs from "node:fs";
import path from "node:path";
import { BLOCKS, ORDER, CRLF, readMeta, read, write, psRound } from "./_blocks.mjs";

const argv = process.argv.slice(2);
const oi = argv.findIndex((x) => /^-+out$/i.test(x));
const outRel = oi >= 0 ? argv[oi + 1] : "../index.html";
const outPath = path.resolve(BLOCKS, outRel);

let t = 0;
const slots = [];
for (const name of ORDER) {
  if (!fs.existsSync(path.join(BLOCKS, name, `${name}.html`))) throw new Error(`missing ${name}/${name}.html, run extract then build.mjs`);
  const meta = readMeta(name);
  const id = meta.id || name;
  const dur = Number(meta.duration);
  slots.push(`  <div id="s-${name}" data-composition-id="${id}" data-composition-src="blocks/${name}/${name}.html" data-start="${t}" data-duration="${dur}" data-track-index="1" data-width="1920" data-height="1080"></div>`);
  t = psRound(t + dur, 3);
}

const fontFace = read(path.join(BLOCKS, "_fontface.css"));
if (!fontFace) throw new Error("_fontface.css missing, run make-fontface");

const doc = `<!doctype html>
<html lang="en" data-resolution="landscape">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1920, height=1080"/>
<title>zg-frames motion sampler (mounted blocks)</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
${fontFace}
  body{margin:0;background:#0b0f14;font-family:"Open Sans",system-ui,sans-serif}
  #root{position:relative;width:1920px;height:1080px;overflow:hidden}
  [data-composition-id="main"] > div[data-composition-src]{position:absolute;inset:0}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="${t}">
${slots.join(CRLF)}
</div>
<script>
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = gsap.timeline({ paused: true });
</script>
</body>
</html>`;

// assemble-sampler.ps1 is saved with CRLF, so its here-string wrote CRLF throughout
write(outPath, doc.split("\r\n").join("\n").split("\n").join(CRLF));
console.log(`\x1b[32mwrote ${outPath}  (${ORDER.length} slots, ${t}s total)\x1b[0m`);
