#!/usr/bin/env node
// stamp-timing.mjs: PIPELINE step 5, derive scene timing from the sentence table.
// Node port of stamp-timing.ps1.
//
// The author writes ONE thing per scene, which sentence(s) it sits on, as
// data-sent. This script fills data-start / data-duration from sentences.json.
//
// THE data-sent CONTRACT (on every <section class="clip"> or mounted block slot)
//   data-sent="S12"        the scene sits on sentence 12
//   data-sent="S12-S15"    covers sentences 12 through 15 (anchor S12)
//   data-sent="S20#1/3"    sentence 20 split across 3 scenes, this is part 1
// Escape hatches, use sparingly and say why in a comment:
//   data-sent-shift="0.20"   nudge this scene's start (negative allowed)
//   data-hold="0.5"          last scene only: hold past the last word
//
// HOW TIMING FALLS OUT
//   start[i]       = anchor sentence start (+ shift), kept after start[i-1]
//   duration[i]    = start[i+1] - start[i]   (contiguous, no gaps)
//   duration[last] = audioEnd + hold - start[last]
//   #root data-duration = audioEnd + hold
//
// Zero tokens. Writes <html>.bak once, then rewrites in place.
//
// USAGE
//   node stamp-timing.mjs --html index.html --sentences sentences.json
//   node stamp-timing.mjs --html in.html --sentences s.json --whatif    # show only
//   node stamp-timing.mjs --html in.html --sentences s.json --strict    # warning = error

import fs from "node:fs";
import path from "node:path";
import { parseArgs, psRound, n2, readText, writeText, color, run } from "./lib.mjs";

run(() => {
  const a = parseArgs(process.argv.slice(2), {
    html: { type: "string", required: true },
    sentences: { type: "string", required: true },
    audioEnd: { type: "number", default: 0 },
    strict: { type: "switch", default: false },
    whatIf: { type: "switch", default: false },
  });
  if (!fs.existsSync(a.html)) throw new Error(`Composition not found: ${a.html}`);
  if (!fs.existsSync(a.sentences)) throw new Error(`Sentence table not found: ${a.sentences}`);

  let warn = 0;
  const Warn = (m) => {
    warn++;
    console.log(color.yellow(`  warn  ${m}`));
  };

  // ---------- sentence lookup ----------
  let sList = JSON.parse(readText(a.sentences));
  if (!Array.isArray(sList)) sList = [sList]; // PowerShell writes a lone row as an object
  const S = new Map();
  sList.forEach((row, idx) => S.set(row.id, { start: Number(row.start), end: Number(row.end), idx, text: row.text }));
  let audioEnd = a.audioEnd;
  if (!(audioEnd > 0)) audioEnd = Math.max(...sList.map((r) => Number(r.end)));

  // ---------- scenes, in document order ----------
  // A scene is an inline clip (<section class="clip">) or a mounted archetype
  // block slot (<div data-composition-src>). Both carry data-sent.
  const src = readText(a.html);
  const rxSection = /<section\b[^>]*\bclass="[^"]*\bclip\b[^"]*"[^>]*>|<div\b[^>]*\bdata-composition-src="[^"]*"[^>]*>/g;
  const matches = [...src.matchAll(rxSection)];
  if (matches.length === 0) throw new Error(`No <section class="clip"> or <div data-composition-src> found in ${a.html}.`);

  const scenes = matches.map((m) => {
    const tag = m[0];
    const id = /id="([^"]+)"/i.exec(tag)?.[1] ?? "?";
    const sent = /data-sent="([^"]+)"/i.exec(tag)?.[1];
    if (!sent) throw new Error(`Scene '${id}' has no data-sent. Every clip needs one (see the contract at the top of this script).`);
    const shiftM = /data-sent-shift="([-\d.]+)"/i.exec(tag);
    const holdM = /data-hold="([\d.]+)"/i.exec(tag);
    return {
      id, sent, tag, index: m.index, length: tag.length,
      shift: shiftM ? Number(shiftM[1]) : 0,
      hold: holdM ? Number(holdM[1]) : 0,
      nominalStart: null, start: null, duration: null, covers: [],
    };
  });

  const need = (sc, sid) => {
    if (!S.has(sid)) throw new Error(`Scene '${sc.id}': sentence '${sid}' is not in the table.`);
    return S.get(sid);
  };

  // ---------- nominal start + coverage ----------
  const splitGroups = new Map();
  for (const sc of scenes) {
    const v = sc.sent;
    let m;
    if ((m = /^(S\d+)#(\d+)\/(\d+)$/i.exec(v))) {
      const [, sid, ks, ns] = m;
      const k = Number(ks), nn = Number(ns);
      const s = need(sc, sid);
      sc.nominalStart = s.start + (s.end - s.start) * ((k - 1) / nn) + sc.shift;
      sc.covers = [s.idx];
      if (!splitGroups.has(sid)) splitGroups.set(sid, []);
      splitGroups.get(sid).push(k);
      if (k < 1 || k > nn) Warn(`${sc.id}: part ${k} of ${nn} is out of range`);
    } else if ((m = /^(S\d+)-(S\d+)$/i.exec(v))) {
      const sa = need(sc, m[1]), sb = need(sc, m[2]);
      if (sb.idx < sa.idx) throw new Error(`Scene '${sc.id}': range ${m[1]}-${m[2]} runs backwards.`);
      sc.nominalStart = sa.start + sc.shift;
      sc.covers = [];
      for (let i = sa.idx; i <= sb.idx; i++) sc.covers.push(i);
    } else if (/^(S\d+)$/i.test(v)) {
      const s = need(sc, v);
      sc.nominalStart = s.start + sc.shift;
      sc.covers = [s.idx];
    } else {
      throw new Error(`Scene '${sc.id}': cannot read data-sent="${v}". See the contract.`);
    }
  }

  // split groups must be complete: parts 1..n each once
  for (const [sid, parts] of splitGroups) {
    const got = [...parts].sort((x, y) => x - y);
    const first = scenes.find((s) => new RegExp(`^${sid}#\\d+/(\\d+)$`, "i").test(s.sent));
    const nn = Number(first.sent.replace(/.*\//, ""));
    const want = Array.from({ length: nn }, (_, i) => i + 1);
    if (got.join(",") !== want.join(",")) Warn(`${sid} is split ${nn} ways but the parts present are: ${got.join(",")}`);
  }

  // ---------- timeline: monotonic + contiguous ----------
  const MINDUR = 0.6;
  scenes.forEach((sc, i) => {
    let st = sc.nominalStart;
    if (i > 0) {
      const prev = scenes[i - 1].start;
      if (st < prev + MINDUR) {
        Warn(`${sc.id}: anchor start ${psRound(st, 2)}s is before the previous scene ends; pushed to ${psRound(prev + MINDUR, 2)}s. Check the data-sent order.`);
        st = prev + MINDUR;
      }
    }
    sc.start = psRound(st, 3);
  });
  scenes.forEach((sc, i) => {
    sc.duration = i < scenes.length - 1
      ? psRound(scenes[i + 1].start - sc.start, 3)
      : psRound(audioEnd + sc.hold - sc.start, 3);
  });

  // ---------- sanity ----------
  const rootDur = psRound(audioEnd + scenes[scenes.length - 1].hold, 3);
  for (const sc of scenes) {
    if (sc.duration < 0.8) Warn(`${sc.id}: only ${sc.duration}s on screen, probably a wrong anchor`);
    if (sc.duration > 12) Warn(`${sc.id}: ${sc.duration}s on screen, probably a missing next anchor`);
  }
  // coverage gaps between the first and last covered sentence, capped at 10
  const allCov = [...new Set(scenes.flatMap((s) => s.covers))].sort((x, y) => x - y);
  if (allCov.length > 0) {
    const covSet = new Set(allCov);
    const gap = [];
    for (let k = allCov[0]; k <= allCov[allCov.length - 1]; k++) if (!covSet.has(k)) gap.push(k);
    for (const k of gap.slice(0, 10)) Warn(`sentence ${sList[k].id} ("${sList[k].text.slice(0, 40)}...") is shown by no scene`);
    if (gap.length > 10) Warn(`... and ${gap.length - 10} more sentences shown by no scene`);
  }

  // ---------- resolved table ----------
  console.log("");
  console.log(color.cyan(`=== resolved timing  (${scenes.length} scenes, audio ${n2(audioEnd)}s) ===`));
  const rows = scenes.map((sc) => {
    const t = sList[sc.covers[0]]?.text ?? "";
    return [sc.id, sc.sent, n2(sc.start), n2(sc.duration), t.length > 54 ? t.slice(0, 54) + "..." : t];
  });
  const head = ["scene", "sent", "start", "dur", "sentence"];
  const w = head.map((h, c) => Math.max(h.length, ...rows.map((r) => r[c].length)));
  const line = (r) => r.map((x, c) => (c === 2 || c === 3 ? x.padStart(w[c]) : x.padEnd(w[c]))).join(" ").trimEnd();
  console.log(line(head));
  console.log(line(w.map((n) => "-".repeat(n))));
  rows.forEach((r) => console.log(line(r)));
  console.log("");
  console.log(`#root data-duration = ${n2(rootDur)}`);
  console.log(`warnings: ${warn}`);
  if (a.strict && warn > 0) throw new Error(`strict mode: ${warn} warning(s).`);

  if (a.whatIf) {
    console.log(color.yellow("\n--whatif: nothing written."));
    return 0;
  }

  // ---------- rewrite the composition, back to front ----------
  if (!fs.existsSync(`${a.html}.bak`)) fs.copyFileSync(a.html, `${a.html}.bak`);
  let out = src;
  for (let i = scenes.length - 1; i >= 0; i--) {
    const sc = scenes[i];
    let tag = sc.tag.replace(/\s+data-start="[^"]*"/gi, "").replace(/\s+data-duration="[^"]*"/gi, "");
    const inject = ` data-start="${sc.start}" data-duration="${sc.duration}"`;
    tag = /data-sent="[^"]*"/i.test(tag)
      ? tag.replace(/(data-sent="[^"]*")/gi, (m0) => m0 + inject)
      : tag.replace(/(<section\b)/gi, (m0) => m0 + inject);
    out = out.slice(0, sc.index) + tag + out.slice(sc.index + sc.length);
  }
  out = out.replace(/(<div\b[^>]*\bid="root"[^>]*\bdata-duration=")[^"]*(")/g, (_, p1, p2) => p1 + rootDur + p2);

  writeText(a.html, out);
  console.log(color.green(`\nStamped ${path.basename(a.html)}  (original at ${path.basename(a.html)}.bak)`));
});
