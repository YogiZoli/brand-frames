#!/usr/bin/env node
// avatar-composite.mjs: KANON avatar composite. Node port of avatar_composite.ps1.
//
// Puts the HeyGen native transparent webm avatar on the background with the
// recipe fixed in PIPELINE.md. No colorkey, chromakey, blur, denoise, median,
// mask, circle or stretch. The native VP9 alpha works, it only needs the explicit
// decoder (-c:v libvpx-vp9) on input.
//
// TWO MODES
//   --mode segments  (default) the avatar only on the given time islands.
//                    Cheap: only the seconds actually generated are paid for.
//   --mode full      one avatar in the corner for the whole video.
//
// USAGE
//   node avatar-composite.mjs --mode full --background bg.mp4 --avatar a.webm --out done.mp4
//   node avatar-composite.mjs --background bg.mp4 --segments "a1.webm=0,a2.webm=270" --out done.mp4
//   node avatar-composite.mjs --background bg.mp4 --segments "a1.webm=0:7.3,a2.webm=270:278.4" --out done.mp4
//   --audio vo_bgm.mp3   separate audio track (the live pipeline uses this)
//   --checkonly          only run the alpha check, no composite
//   --dryrun             print the ffmpeg arguments, do not run them
//
// The ffmpeg binary comes from $FFMPEG_PATH if set (the packaged app sets it to
// its bundled sidecar), else from the PATH.
//
// KANON CONSTANTS (PIPELINE.md)
//   scale=800:-2            proportional downscale (HeyGen's smallest output is 720p)
//   overlay=W-w-40:H-h-40   bottom-right corner, 40px margin

import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { parseArgs, color, run } from "./lib.mjs";

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";

function assertFile(p, label) {
  if (!fs.existsSync(p)) throw new Error(`${label} nem talalhato: ${p}`);
}

// Alpha self-check: never misdiagnose the alpha. Real alpha gives YMIN=0
// (transparent background) and YMAX=255 (subject) somewhere in the clip.
function testAlpha(webm) {
  assertFile(webm, "Avatar webm");
  console.log(color.gray(`  Alfa-ellenorzes: ${webm}`));
  const r = spawnSync(FFMPEG, ["-c:v", "libvpx-vp9", "-i", webm, "-vf", "format=yuva420p,alphaextract,signalstats,metadata=print", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 30 });
  if (r.error) throw new Error(`ffmpeg nem indult (${FFMPEG}): ${r.error.message}`);
  const log = `${r.stdout}${r.stderr}`;
  const ymins = [...log.matchAll(/YMIN=(\d+)/g)].map((m) => Number(m[1]));
  const ymaxs = [...log.matchAll(/YMAX=(\d+)/g)].map((m) => Number(m[1]));
  if (ymins.length === 0 || ymaxs.length === 0) {
    throw new Error(`Nem sikerult kiolvasni az alfa statisztikat (${webm}). Az ffmpeg nem adott signalstats-ot. Van egyaltalan alfa csatorna a fajlban?`);
  }
  const ymin = Math.min(...ymins), ymax = Math.max(...ymaxs);
  if (ymin >= 250) throw new Error(`HIBAS ALFA (${webm}): YMIN=${ymin} (kb. mindenhol atlatszo). Ne composite-olj vele.`);
  if (ymax <= 5) throw new Error(`HIBAS ALFA (${webm}): YMAX=${ymax} (sehol sincs subject). Ne composite-olj vele.`);
  console.log(color.green(`    OK  (YMIN=${ymin}, YMAX=${ymax}) valodi alfa`));
}

function buildArgs({ mode, background, avatar, segments, audio, out, width, margin }) {
  const scale = `scale=${width}:-2`;
  const overlay = `overlay=W-w-${margin}:H-h-${margin}`;
  const tail = ["-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", out];
  if (mode === "full") {
    const inputs = ["-y", "-i", background, "-c:v", "libvpx-vp9", "-i", avatar];
    let amap = "1:a?";
    if (audio) { inputs.push("-i", audio); amap = "2:a"; }
    return [...inputs, "-filter_complex", `[1:v]${scale}[av];[0:v][av]${overlay}[v]`, "-map", "[v]", "-map", amap, ...tail];
  }
  // segments: every avatar is read with libvpx-vp9, shifted to its own start with
  // setpts, and only shown inside between(). Audio comes from the background.
  const inputs = ["-y", "-i", background];
  const chains = [];
  let prev = "[0:v]";
  segments.forEach((seg, k) => {
    const i = k + 1;
    inputs.push("-c:v", "libvpx-vp9", "-i", seg.file);
    const endExpr = seg.end ?? 999999; // no explicit end: the clip's own length
    chains.push(`[${i}:v]${scale},setpts=PTS+${seg.start}/TB[a${i}]`);
    const outLbl = i === segments.length ? "[v]" : `[t${i}]`;
    chains.push(`${prev}[a${i}]${overlay}:enable='between(t,${seg.start},${endExpr})'${outLbl}`);
    prev = outLbl;
  });
  let amap = "0:a?";
  if (audio) { inputs.push("-i", audio); amap = `${segments.length + 1}:a`; }
  return [...inputs, "-filter_complex", chains.join(";"), "-map", "[v]", "-map", amap, ...tail];
}

run(() => {
  const a = parseArgs(process.argv.slice(2), {
    mode: { type: "string", default: "segments" },
    background: { type: "string", required: true },
    avatar: { type: "string" },
    segments: { type: "string" },
    out: { type: "string", required: true },
    audio: { type: "string" },
    width: { type: "number", default: 800 },
    margin: { type: "number", default: 40 },
    checkOnly: { type: "switch", default: false },
    dryRun: { type: "switch", default: false },
  });
  const mode = a.mode.toLowerCase();
  if (mode !== "segments" && mode !== "full") throw new Error(`--mode: segments vagy full, nem '${a.mode}'.`);

  assertFile(a.background, "Hatter video");
  let segments = [];
  if (mode === "full") {
    if (!a.avatar) throw new Error("Full mod: add meg az --avatar webm-et.");
    if (!a.dryRun) testAlpha(a.avatar);
  } else {
    if (!a.segments) throw new Error("Segments mod: add meg a --segments listat (pl. 'a1.webm=0,a2.webm=270').");
    for (const s of a.segments.split(",").map((x) => x.trim()).filter(Boolean)) {
      const m = /^(.*?)=([\d.]+)(?::([\d.]+))?$/.exec(s);
      if (!m) throw new Error(`Rossz szegmens formatum: '${s}'. Varva: 'webm=start' vagy 'webm=start:end'.`);
      const seg = { file: m[1], start: Number(m[2]), end: m[3] ? Number(m[3]) : null };
      if (!a.dryRun) testAlpha(seg.file);
      segments.push(seg);
    }
  }

  if (a.checkOnly) {
    console.log(color.cyan("CheckOnly: az alfa rendben, composite kihagyva."));
    return 0;
  }
  if (a.audio) assertFile(a.audio, "Hangsav");

  const args = buildArgs({ mode, background: a.background, avatar: a.avatar, segments, audio: a.audio, out: a.out, width: a.width, margin: a.margin });
  if (a.dryRun) {
    console.log(JSON.stringify(args));
    return 0;
  }

  console.log(color.cyan(`Composite (${mode}) -> ${a.out}`));
  const r = spawnSync(FFMPEG, args, { stdio: "ignore" });
  if (r.error) throw new Error(`ffmpeg nem indult (${FFMPEG}): ${r.error.message}`);
  if (r.status !== 0) throw new Error(`ffmpeg hiba (exit ${r.status}).`);
  assertFile(a.out, "Kimenet");
  const mb = Math.round((fs.statSync(a.out).size / 1048576) * 10) / 10;
  console.log(color.green(`KESZ: ${a.out} (${mb} MB)`));
});
