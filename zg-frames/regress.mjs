#!/usr/bin/env node
// regress.mjs: the regression test for the zg-frames archetype library.
// Node port of regress.ps1, runs the same on Windows and macOS.
//
// WHY THIS EXISTS
// Zoltan is never the regression test. After any change to zg.css / motion.js /
// icons.js we must know WHICH archetypes changed, before a single video is
// touched. An intended change is fine. An unintended one is a bug, and it must
// surface here, not three videos later.
//
// WHAT IT DOES
// 1. reads the scene table straight out of index.html (id, start, duration, title)
// 2. grabs THREE frames per scene at 25 / 55 / 85% of the scene, so the motion
//    is measured, not only the end state
// 3. compares each with the same scene + phase in baseline/; the scene's RMSE is
//    the WORST of its three phases
// 4. prints a per-archetype verdict, worst first
// 5. recolours the 55% frame of every CHANGED scene to deuteranopia
// 6. for every CHANGED scene builds a 3x3 review board (BASELINE / THIS RENDER /
//    WHAT MOVED rows, 25/55/85% columns) plus a baseline-beside-new motion clip,
//    stacked into review-sheet.png + review-motion.mp4
// 7. writes regress-report.md next to the frames
//
// USAGE
//   node regress.mjs --video sampler_v6.mp4                 compare vs baseline/
//   node regress.mjs --video sampler_v6.mp4 --accept        this render becomes the baseline
//   node regress.mjs --video sampler_v6.mp4 --threshold 1.5
//
// NOTES
// - A scene in the render but not in the baseline is NEW, never a failure.
// - Threshold is RMSE on 0..255. Anti-aliasing noise sits under ~0.8; 2.0 is the
//   default line between "the same" and "look at this".
// - baseline/ holds <scene>_0/1/2.png and baseline.mp4 (the approved render, for
//   the motion clips). A pre-3-phase baseline (single <scene>.png) still works:
//   it compares the 78% frame only and asks for a re-accept.
// - ffmpeg / ffprobe come from $FFMPEG_PATH / $FFPROBE_PATH, else the PATH.
// - Zero tokens. Pure ffmpeg.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH || "ffprobe";
const CRLF = "\r\n";

// ---------- args ----------
const spec = { video: "sampler_2026-08-29_v6.mp4", html: "index.html", baseline: "baseline", out: "_regress", threshold: 2.0, accept: false };
{
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i].replace(/^-+/, "").toLowerCase();
    const key = Object.keys(spec).find((x) => x.toLowerCase() === k);
    if (!key) { console.error(`Unknown option: ${argv[i]}`); process.exit(1); }
    if (typeof spec[key] === "boolean") spec[key] = true;
    else spec[key] = typeof spec[key] === "number" ? Number(argv[++i]) : argv[++i];
  }
}
process.chdir(HERE);
const { video: Video, html: Html, baseline: Baseline, out: Out, threshold: Threshold, accept: Accept } = spec;

const c = { cyan: "\x1b[36m", yellow: "\x1b[33m", red: "\x1b[31m", green: "\x1b[32m", off: "\x1b[0m" };
const say = (s, col) => console.log(col ? `${col}${s}${c.off}` : s);
const warn = (s) => say(`WARNING: ${s}`, c.yellow);
const n1 = (x) => x.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
function psRound(x, d) {
  const p = 10 ** d, v = x * p, fl = Math.floor(v), f = v - fl;
  return (f > 0.5 ? fl + 1 : f < 0.5 ? fl : fl % 2 === 0 ? fl : fl + 1) / p;
}

function ff(args) {
  const r = spawnSync(FFMPEG, args, { encoding: "utf8", maxBuffer: 1 << 28 });
  if (r.error) throw new Error(`ffmpeg not found (${FFMPEG}). ffmpeg and ffprobe are both required.`);
  return { code: r.status, log: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

// ---------- preflight ----------
for (const [exe, bin] of [["ffmpeg", FFMPEG], ["ffprobe", FFPROBE]]) {
  const r = spawnSync(bin, ["-version"], { stdio: "ignore" });
  if (r.error) { console.error(`${exe} not found (${bin}). ffmpeg and ffprobe are both required.`); process.exit(1); }
}
if (!fs.existsSync(Video)) { console.error(`Render not found: ${Video}. Render the sampler first.`); process.exit(1); }
if (!fs.existsSync(Html)) { console.error(`Composition not found: ${Html}`); process.exit(1); }

// ---------- 1. the scene table, read from the composition itself ----------
// Two shapes: the mount host (one <div data-composition-src> slot per archetype
// block) and the old monolith (<section class="clip"> with a .kick label).
const src = fs.readFileSync(Html, "utf8").replace(/^\uFEFF/, "");
let scenes = [];
for (const m of src.matchAll(/<div\b[^>]*\bdata-composition-src="[^"]*"[^>]*>/g)) {
  const tag = m[0];
  const id = /data-composition-id="([^"]+)"/.exec(tag)?.[1];
  const st = /data-start="([\d.]+)"/.exec(tag)?.[1];
  const du = /data-duration="([\d.]+)"/.exec(tag)?.[1];
  if (id && st && du) scenes.push({ id, start: Number(st), dur: Number(du), title: id });
}
if (scenes.length === 0) {
  const rx = /<section id="([^"]+)"[^>]*data-start="([\d.]+)"[^>]*data-duration="([\d.]+)"[\s\S]*?class="kick"[^>]*>([\s\S]*?)<\/div>/g;
  for (const m of src.matchAll(rx)) {
    const title = m[4].replace(/&middot;/gi, "\u00b7").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ");
    scenes.push({ id: m[1], start: Number(m[2]), dur: Number(m[3]), title: title.trim() });
  }
}
if (scenes.length === 0) { console.error(`No scenes parsed from ${Html}, has the markup shape changed?`); process.exit(1); }
say(`Scene table: ${scenes.length} archetypes.`);

// sanity: the render must be at least as long as the table claims
const probe = spawnSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", Video], { encoding: "utf8" });
const len = Number(String(probe.stdout).trim());
const needLen = Math.max(...scenes.map((s) => s.start + s.dur));
if (len < needLen - 0.5) warn(`Render is ${n1(len)}s but the scene table needs ${n1(needLen)}s. Did the render finish?`);

// ---------- 2. THREE frames per scene: 25 / 55 / 85% ----------
const pcts = [0.25, 0.55, 0.85];
const phaseName = ["25%", "55%", "85%"];
const J = (...p) => path.join(...p);
const base3 = fs.existsSync(J(Baseline, `${scenes[0].id}_0.png`));
const baseLegacy = !base3 && fs.existsSync(J(Baseline, `${scenes[0].id}.png`));

fs.mkdirSync(Out, { recursive: true });
(function clean(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = J(dir, e.name);
    if (e.isDirectory()) clean(p);
    else if (/\.(png|mp4|txt)$/i.test(e.name)) fs.rmSync(p, { force: true });
  }
})(Out);

const grab = (t, file) => ff(["-y", "-v", "error", "-ss", String(t), "-i", Video, "-frames:v", "1", "-vf", "scale=960:-1", file]);
for (const s of scenes) {
  for (let i = 0; i < 3; i++) {
    let t = s.start + s.dur * pcts[i];
    if (t > len) t = Math.max(0, len - 0.05);
    grab(t, J(Out, `${s.id}_${i}.png`));
  }
  if (baseLegacy && !Accept) {
    let tl = s.start + s.dur * 0.78;
    if (tl > len) tl = Math.max(0, len - 0.05);
    grab(tl, J(Out, `${s.id}_L.png`));
  }
}
say(`Frames grabbed: ${scenes.length} scenes x 3 phases.`);

// ---------- accept mode: this render becomes the truth ----------
if (Accept) {
  fs.mkdirSync(Baseline, { recursive: true });
  for (const f of fs.readdirSync(Baseline)) if (/\.png$/i.test(f)) fs.rmSync(J(Baseline, f), { force: true });
  for (const f of fs.readdirSync(Out)) if (/^.*_.\.png$/i.test(f)) fs.copyFileSync(J(Out, f), J(Baseline, f));
  // keep the approved render itself, so a future regression can show MOTION
  ff(["-y", "-v", "error", "-i", Video, "-an", "-c:v", "libx264", "-crf", "30", "-preset", "veryfast", "-vf", "scale=1280:-2", J(Baseline, "baseline.mp4")]);
  const d = new Date(), p2 = (x) => String(x).padStart(2, "0");
  const stamp = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
  fs.writeFileSync(J(Baseline, "APPROVED.txt"), `${stamp} \u00b7 ${Video} \u00b7 ${scenes.length} archetypes \u00b7 3-phase (25/55/85)${CRLF}`, "utf8");
  say("Baseline accepted. This render is now the reference (3-phase stills + baseline.mp4).", c.green);
  process.exit(0);
}

// ---------- 3. compare: all three phases, worst one wins ----------
// psnr prints "average:<dB>" or "average:inf" (bit-identical). RMSE = 255 / 10^(PSNR/20).
function frameRmse(now, ref) {
  if (!fs.existsSync(now) || !fs.existsSync(ref)) return null;
  const { log } = ff(["-v", "info", "-i", now, "-i", ref, "-lavfi", "psnr", "-f", "null", "-"]);
  if (/average:inf/i.test(log)) return 0;
  const m = /average:([\d.]+)/i.exec(log);
  return m ? 255 / 10 ** (Number(m[1]) / 20) : null;
}

if (baseLegacy) {
  say("Baseline is single-frame (pre 3-phase). Comparing the 78% frame only, as before.", c.yellow);
  say("Run  node regress.mjs --video <approved>.mp4 --accept  once to enable the 3-phase test.", c.yellow);
}

const rows = [];
for (const s of scenes) {
  const hasRef = base3 ? fs.existsSync(J(Baseline, `${s.id}_0.png`)) : baseLegacy ? fs.existsSync(J(Baseline, `${s.id}.png`)) : false;
  if (!hasRef) { rows.push({ id: s.id, title: s.title, rmse: null, worst: null, phases: null, verdict: "NEW" }); continue; }
  const phaseR = [null, null, null];
  let broke = false;
  if (base3) {
    for (let i = 0; i < 3; i++) {
      if (s.start + s.dur * pcts[i] > len + 0.25) { broke = true; break; }
      const r = frameRmse(J(Out, `${s.id}_${i}.png`), J(Baseline, `${s.id}_${i}.png`));
      if (r === null) { broke = true; break; }
      phaseR[i] = psRound(r, 2);
    }
  } else if (s.start + s.dur * 0.78 > len + 0.25) {
    broke = true;
  } else {
    const r = frameRmse(J(Out, `${s.id}_L.png`), J(Baseline, `${s.id}.png`));
    if (r === null) broke = true; else phaseR[1] = psRound(r, 2);
  }
  if (broke) { rows.push({ id: s.id, title: s.title, rmse: null, worst: null, phases: null, verdict: "NINCS A RENDERBEN" }); continue; }
  const measured = phaseR.filter((x) => x !== null);
  const worst = Math.max(...measured);
  const wi = phaseR.indexOf(worst);
  const verdict = worst < 0.8 ? "same" : worst < Threshold ? "noise" : "CHANGED";
  const phases = base3 ? phaseR.map((x) => (x === null ? "-" : String(x))).join(" / ") : `${phaseR[1]} (78% only)`;
  rows.push({ id: s.id, title: s.title, rmse: worst, worst: base3 ? phaseName[wi] : "78%", phases, verdict });
}

// ---------- 4. verdict, worst first ----------
const sorted = [...rows].sort((a, b) => (b.rmse ?? 9999) - (a.rmse ?? 9999));
const changed = rows.filter((r) => r.verdict === "CHANGED");
const fresh = rows.filter((r) => r.verdict === "NEW");
const missing = rows.filter((r) => r.verdict === "NINCS A RENDERBEN");
const same = rows.filter((r) => r.verdict === "same" || r.verdict === "noise");

say("");
say(`=== REGRESSION vs ${Baseline}  (RMSE = worst of 25/55/85%) ===`, c.cyan);
{
  const head = ["Id", "RMSE", "worst@", "25/55/85", "Verdict", "Title"];
  const tab = sorted.map((r) => [r.id, r.rmse === null ? "" : String(r.rmse), r.worst ?? "", r.phases ?? "", r.verdict, r.title]);
  const w = head.map((h, i) => Math.max(h.length, ...tab.map((t) => t[i].length)));
  const line = (t) => t.map((x, i) => (i === 1 ? x.padStart(w[i]) : x.padEnd(w[i]))).join(" ").trimEnd();
  say(line(head)); say(line(w.map((n) => "-".repeat(n)))); tab.forEach((t) => say(line(t))); say("");
}
if (missing.length > 0) say(`${missing.length} jelenet nincs benne ebben a renderben. Regi rendert nezel.`, c.yellow);
say(`VALTOZOTT: ${changed.length}   UJ: ${fresh.length}   valtozatlan: ${same.length}   nem merheto: 0`);
if (changed.length > 0) say("Ask one question about each CHANGED archetype: did I mean to change this?", c.yellow);

// ---------- 5. the CHANGED-scene review pack ----------
// For every CHANGED scene: _card_<id>.png (3x3 board), _move_<id>.mp4 (baseline
// beside the new scene, in sync), <id>_cvd.png (deuteranopia, 55% frame). Then
// review-sheet.png stacks every board and review-motion.mp4 every clip. Every
// label goes through textfile= so a title with a slash or middot never breaks
// a filter. Without baseline.mp4 it falls back to a single still pair.
const cvd = "colorchannelmixer=.625:.375:0:0:.7:.3:0:0:0:.3:.7";
const baseVid = J(Baseline, "baseline.mp4");
const haveBaseVid = fs.existsSync(baseVid);
let reviewSheet = null, reviewMotion = null;

// ffmpeg filter paths: forward slashes, and the drive colon escaped (C\:/...)
const ffPath = (p) => path.resolve(p).replace(/\\/g, "/").replace(/^([A-Za-z]):/, "$1\\:");
function pickFont(bold) {
  const cands = process.platform === "win32"
    ? [`C:/Windows/Fonts/${bold ? "arialbd" : "arial"}.ttf`, "C:/Windows/Fonts/arial.ttf"]
    : process.platform === "darwin"
      ? [`/System/Library/Fonts/Supplemental/${bold ? "Arial Bold" : "Arial"}.ttf`, "/System/Library/Fonts/Supplemental/Arial.ttf", "/Library/Fonts/Arial.ttf", "/System/Library/Fonts/Helvetica.ttc"]
      : [`/usr/share/fonts/truetype/dejavu/DejaVuSans${bold ? "-Bold" : ""}.ttf`, "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"];
  const f = cands.find((x) => fs.existsSync(x));
  return f ? ffPath(f) : "";
}

if (changed.length > 0) {
  const fontB = pickFont(true), fontR = pickFont(false);
  const ft = (f) => (f ? `fontfile='${f}':` : "");
  const label = (s) => {
    const p = J(Out, `_lbl_${crypto.randomBytes(4).toString("hex")}.txt`);
    fs.writeFileSync(p, s, "utf8");
    return ffPath(p);
  };
  const oneLine = (s) => s.replace(/\r?\n/g, " ");
  const cards = [], clips = [];

  for (const ch of changed) {
    const s = scenes.find((x) => x.id === ch.id);
    if (!s) continue;
    const rmseTxt = ch.rmse === null ? "n/a" : `${ch.rmse}  worst at ${String(ch.worst).replace(/%/g, " pct")}`;
    const dur = Math.min(s.dur, Math.max(0.6, len - s.start - 0.05));

    if (fs.existsSync(J(Out, `${ch.id}_1.png`))) {
      ff(["-y", "-v", "error", "-i", J(Out, `${ch.id}_1.png`), "-vf", cvd, "-frames:v", "1", "-update", "1", J(Out, `${ch.id}_cvd.png`)]);
    }

    const card = J(Out, `_card_${ch.id}.png`);
    const lbl = label(`${ch.id}    ${ch.title}    RMSE ${rmseTxt}`);

    if (base3) {
      const bs = [], ns = [], ds = [];
      for (let i = 0; i < 3; i++) {
        const bf = J(Baseline, `${ch.id}_${i}.png`), nf = J(Out, `${ch.id}_${i}.png`), df = J(Out, `_d_${ch.id}_${i}.png`);
        ff(["-y", "-v", "error", "-i", bf, "-i", nf, "-filter_complex", "[0:v]scale=560:-2[a];[1:v]scale=560:-2[b];[a][b]blend=all_mode=difference,format=gray,eq=contrast=2.4:brightness=0.02", "-frames:v", "1", "-update", "1", df]);
        bs.push(bf); ns.push(nf); ds.push(df);
      }
      const frm = [...bs, ...ns, ...ds];
      if (frm.every((f) => fs.existsSync(f))) {
        const rb = label("BASELINE  (25 / 55 / 85 pct)"), rn = label("THIS RENDER  (25 / 55 / 85 pct)"), rd = label("WHAT MOVED  (bright = changed)");
        const fc = oneLine(`[0:v]scale=560:-2[p0];[1:v]scale=560:-2[p1];[2:v]scale=560:-2[p2];
[3:v]scale=560:-2[p3];[4:v]scale=560:-2[p4];[5:v]scale=560:-2[p5];
[6:v]scale=560:-2[p6];[7:v]scale=560:-2[p7];[8:v]scale=560:-2[p8];
[p0][p1][p2]hstack=inputs=3[rb];[p3][p4][p5]hstack=inputs=3[rn];[p6][p7][p8]hstack=inputs=3[rd];
color=c=0x141210:s=1680x96:d=1[bar];
[bar]drawtext=${ft(fontB)}textfile='${lbl}':x=26:y=28:fontsize=34:fontcolor=0xF5F1E8[bar2];
[rb]drawtext=${ft(fontR)}textfile='${rb}':x=16:y=14:fontsize=26:fontcolor=0x1B6CF0:box=1:boxcolor=0xF5F1E8@0.85:boxborderw=8[rb2];
[rn]drawtext=${ft(fontR)}textfile='${rn}':x=16:y=14:fontsize=26:fontcolor=0x1B6CF0:box=1:boxcolor=0xF5F1E8@0.85:boxborderw=8[rn2];
[rd]drawtext=${ft(fontR)}textfile='${rd}':x=16:y=14:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.85:boxborderw=8[rd2];
[bar2][rb2][rn2][rd2]vstack=inputs=4[out]`);
        const r = ff(["-y", "-v", "error", ...frm.flatMap((f) => ["-i", f]), "-filter_complex", fc, "-map", "[out]", "-frames:v", "1", "-update", "1", card]);
        if (!fs.existsSync(card) && r.log.trim()) warn(`card ${ch.id}: ${r.log.trim()}`);
      }
    } else {
      // fallback: legacy baseline frame beside this render's 55% frame
      const ref = J(Baseline, `${ch.id}.png`), now = J(Out, `${ch.id}_1.png`);
      if (fs.existsSync(ref) && fs.existsSync(now)) {
        const fc = oneLine(`[0:v]scale=880:-1[a];[1:v]scale=880:-1[b];[a][b]hstack=inputs=2[pair];
color=c=0x141210:s=1760x108:d=1[bar];
[bar]drawtext=${ft(fontB)}textfile='${lbl}':x=24:y=18:fontsize=34:fontcolor=0xF5F1E8[b1];
[b1]drawtext=${ft(fontR)}text='BASELINE':x=24:y=70:fontsize=24:fontcolor=0x9AA0A6,drawtext=${ft(fontR)}text='THIS RENDER (55 pct)':x=904:y=70:fontsize=24:fontcolor=0x9AA0A6[top];
[top][pair]vstack=inputs=2[out]`);
        ff(["-y", "-v", "error", "-i", ref, "-i", now, "-filter_complex", fc, "-map", "[out]", "-frames:v", "1", "-update", "1", card]);
      }
    }

    if (haveBaseVid) {
      const mv = J(Out, `_move_${ch.id}.mp4`);
      const mlbl = label(`${ch.id}  ${ch.title}`);
      const mfc = oneLine(`[0:v]scale=920:-2,setpts=PTS-STARTPTS,drawtext=${ft(fontR)}text='BASELINE':x=20:y=18:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.6:boxborderw=8[l];
[1:v]scale=920:-2,setpts=PTS-STARTPTS,drawtext=${ft(fontR)}text='THIS RENDER':x=20:y=18:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.6:boxborderw=8[r];
[l][r]hstack=inputs=2,drawtext=${ft(fontB)}textfile='${mlbl}':x=20:y=h-46:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.6:boxborderw=10,fps=30,format=yuv420p[out]`);
      const r = ff(["-y", "-v", "error", "-ss", String(s.start), "-t", String(dur), "-i", baseVid, "-ss", String(s.start), "-t", String(dur), "-i", Video, "-filter_complex", mfc, "-map", "[out]", "-c:v", "libx264", "-crf", "26", "-preset", "veryfast", "-an", mv]);
      if (fs.existsSync(mv)) clips.push(mv); else if (r.log.trim()) warn(`clip ${ch.id}: ${r.log.trim()}`);
    }
    if (fs.existsSync(card)) cards.push(card);
  }

  if (cards.length > 0) {
    reviewSheet = J(Out, "review-sheet.png");
    if (cards.length === 1) fs.copyFileSync(cards[0], reviewSheet);
    else {
      const lab = cards.map((_, i) => `[${i}:v]`).join("");
      const r = ff(["-y", "-v", "error", ...cards.flatMap((f) => ["-i", f]), "-filter_complex", `${lab}vstack=inputs=${cards.length}[out]`, "-map", "[out]", "-frames:v", "1", "-update", "1", reviewSheet]);
      if (!fs.existsSync(reviewSheet) && r.log.trim()) warn(`review sheet: ${r.log.trim()}`);
    }
    if (fs.existsSync(reviewSheet)) { say(""); say(`Review sheet: ${reviewSheet}  (${cards.length} changed scene${cards.length === 1 ? "" : "s"})`, c.cyan); }
  }

  if (clips.length > 0) {
    reviewMotion = J(Out, "review-motion.mp4");
    const listPath = J(Out, "_motion_list.txt");
    fs.writeFileSync(listPath, clips.map((f) => `file '${path.resolve(f).replace(/\\/g, "/")}'`).join("\n") + "\n", "ascii");
    const r = ff(["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", listPath, "-c", "copy", reviewMotion]);
    if (!fs.existsSync(reviewMotion) && r.log.trim()) warn(`review motion: ${r.log.trim()}`);
    if (fs.existsSync(reviewMotion)) say(`Review motion: ${reviewMotion}  (${clips.length} clip${clips.length === 1 ? "" : "s"}, baseline beside this render)`, c.cyan);
  }

  if (!haveBaseVid) {
    say("baseline.mp4 not present, cards are single stills, no motion clips.", c.yellow);
    say("Run once with --accept to store it, then future runs get the full pack.", c.yellow);
  }
  say(`Deuteranopia frames written for ${changed.length} changed scenes.`);

  // tidy the intermediates; keep _card_*, _move_*, review-*, <scene>*.png
  for (const f of fs.readdirSync(Out)) {
    if (/^(_b_.*\.png|_n_.*\.png|_d_.*\.png|_lbl_.*\.txt|_motion_list\.txt)$/i.test(f)) fs.rmSync(J(Out, f), { force: true });
  }
}

// ---------- 6. the report ----------
const d = new Date(), p2 = (x) => String(x).padStart(2, "0");
const run = `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
const md = [
  "# Regression report",
  "",
  `**Render:** \`${Video}\` \u00b7 **Baseline:** \`${Baseline}\` \u00b7 **Threshold:** RMSE ${Threshold}`,
  `**Run:** ${run}`,
  "",
  "RMSE is the worst of three frames per scene, sampled at 25 / 55 / 85% of the scene.",
  "",
  "| scene | RMSE | worst@ | 25 / 55 / 85 | verdict | archetype |",
  "|---|---:|:--:|:--:|---|---|",
  ...sorted.map((r) => `| ${r.id} | ${r.rmse === null ? "n/a" : String(r.rmse)} | ${r.worst || "-"} | ${r.phases || "-"} | ${r.verdict} | ${r.title} |`),
  "",
  `CHANGED: ${changed.length} \u00b7 NEW: ${fresh.length} \u00b7 unchanged: ${rows.length - changed.length - fresh.length}`,
  "",
  `Frames: \`${Out}/<scene>_0/1/2.png\` (25/55/85%) \u00b7 deuteranopia: \`${Out}/<scene>_cvd.png\``,
];
if (reviewSheet && fs.existsSync(reviewSheet)) {
  md.push("", `**Review sheet:** \`${reviewSheet}\`, one 3x3 board per CHANGED scene (BASELINE / THIS RENDER / WHAT MOVED, at 25/55/85% of the scene). Per-scene boards: \`${Out}/_card_<scene>.png\`.`);
}
if (reviewMotion && fs.existsSync(reviewMotion)) {
  md.push(`**Review motion:** \`${reviewMotion}\`, every CHANGED scene, baseline playing beside this render. Per-scene clips: \`${Out}/_move_<scene>.mp4\`.`);
}
md.push(`Accept this render as the new truth: \`node regress.mjs --video ${Video} --accept\``);
fs.writeFileSync(J(Out, "regress-report.md"), "\uFEFF" + md.join(CRLF) + CRLF, "utf8");
say(`Report: ${Out}/regress-report.md`);
