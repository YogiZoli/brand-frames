#!/usr/bin/env node
// image-audio-lint.mjs: does the picture show a word the narration does not say?
// Node only: the old image-audio-lint.ps1 was removed on 2026-09-24.
//
// A cheap pre-Opus filter. For every scene it compares the on-screen words with
// the words actually spoken in that scene's time window, and flags a word that
// is shown but never said there: a scene that slid one sentence, a copy-paste
// leftover, "25" on screen while the voice is three sentences from "twenty-five".
//
// It is NOT the 3rd gate. A clean run means "no obvious slip", not "approved".
//
// Two scene shapes, in document order:
//   - inline clip   <section class="clip" data-start data-duration>: the words
//                   come from the section itself (unchanged since the port).
//   - mounted slot  <div data-composition-src="compositions/x.html" data-start
//                   data-duration>: what build-video.mjs writes since 2026-08-31.
//                   Timing from the slot div, words from the <section class="clip">
//                   inside the referenced file (path relative to the index.html).
//
// INPUT
//   --html  <index.html>   scenes already stamped (run stamp-timing.mjs first)
//   --words <words.json>   flat word list from sentences.mjs
//   --lead  1.0            seconds a visual may appear BEFORE its phrase
//   --lag   0.8            seconds a visual may linger AFTER its phrase
//   --strict               exit 1 if anything is flagged
//
// USAGE
//   node image-audio-lint.mjs --html index.html --words _sample/words.json

import fs from "node:fs";
import path from "node:path";
import { parseArgs, n1, readText, color, run } from "./lib.mjs";

const STOP = new Set(`the a an of to in on for and or but with is are was were be been being it its this that these those
you your yours i me my we us our ours they them their he she his her as at by from into over under
not no nor so if then than too very can will would could should do does did has have had a s t`.split(/\s+/).filter(Boolean));

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = { 2: "twenty", 3: "thirty", 4: "forty", 5: "fifty", 6: "sixty", 7: "seventy", 8: "eighty", 9: "ninety" };
// ordinals collapse to their cardinal so "02" on screen matches "second" spoken
const ORD = { first: "one", second: "two", third: "three", fourth: "four", fifth: "five", sixth: "six", seventh: "seven",
  eighth: "eight", ninth: "nine", tenth: "ten", eleventh: "eleven", twelfth: "twelve" };

function digitsToWords(n) {
  let v = Number.parseInt(n, 10);
  if (Number.isNaN(v) || v < 0 || v > 999) return n;
  const w = [];
  if (v >= 100) { w.push(ONES[Math.floor(v / 100)], "hundred"); v %= 100; }
  if (v >= 20) { w.push(TENS[Math.floor(v / 10)]); v %= 10; }
  if (v >= 1) w.push(ONES[v]);
  return w.length === 0 ? n : w.join(" ");
}

// a blob of text -> meaningful tokens
function tokenize(text) {
  if (!text) return [];
  let t = text.toLowerCase().replace(/&#\d+;/gi, " ").replace(/&[a-z]+;/gi, " ");
  t = t.replace(/\b\d{1,3}\b/g, (m) => digitsToWords(m)); // "25" -> "twenty five"
  const out = [];
  for (const tok of t.split(/[^a-z0-9]+/i).filter((x) => x !== "")) {
    const tk = ORD[tok] ?? tok;
    for (const piece of tk.split(" ")) {
      if (piece === "" || STOP.has(piece)) continue;
      if (piece.length < 3 && !/^\d/.test(piece)) continue;
      out.push(piece);
    }
  }
  return out;
}

// lenient: exact, or a shared stem (publish / published), either way
function heard(w, spokenSet, spokenList) {
  if (spokenSet.has(w)) return true;
  if (w.length >= 3) {
    const stem3 = w.slice(0, 3);
    for (const sp of spokenList) {
      if (sp.length >= 3 && (sp.startsWith(stem3) || w.startsWith(sp.slice(0, Math.min(4, sp.length))))) return true;
    }
  }
  return false;
}

run(() => {
  const a = parseArgs(process.argv.slice(2), {
    html: { type: "string", required: true },
    words: { type: "string", required: true },
    lead: { type: "number", default: 1.0 },
    lag: { type: "number", default: 0.8 },
    strict: { type: "switch", default: false },
  });
  if (!fs.existsSync(a.html)) throw new Error(`Composition not found: ${a.html}`);
  if (!fs.existsSync(a.words)) throw new Error(`Word list not found: ${a.words} (run sentences.mjs)`);

  let wl = JSON.parse(readText(a.words));
  if (!Array.isArray(wl)) wl = [wl];
  // "twenty-five" is two spoken words: split on hyphens, each part keeps the word timing
  wl = wl.flatMap((w) => {
    const parts = String(w.text).toLowerCase().replace(/-/g, " ").split(/\s+/).map((p) => p.replace(/[^a-z0-9']/g, ""));
    const kept = parts.filter(Boolean);
    return (kept.length ? kept : [""]).map((text) => ({ text, start: Number(w.start), end: Number(w.end) }));
  });

  const src = readText(a.html);
  // drop scaffold text that is never spoken: labels, captions, plate tags
  const dropScaffold = (s) => s.replace(/<(\w+)[^>]*class="[^"]*\b(kick|sub|plateTag|kicker|ilbl|blbl|plbl|cx)\b[^"]*"[^>]*>[\s\S]*?<\/\1>/g, " ");
  const rxClip = /<section\b[^>]*\bclass="[^"]*\bclip\b[^"]*"[^>]*>([\s\S]*?)<\/section>/g;
  const clean = dropScaffold(src);

  // inline clips: the section carries its own words
  const scenes = [...clean.matchAll(rxClip)].map((m) => ({
    at: m.index, open: /<section\b[^>]*>/.exec(m[0])[0], inner: () => m[1],
  }));
  // mounted slots: the words live in the referenced composition file
  const baseDir = path.dirname(path.resolve(a.html));
  for (const m of clean.matchAll(/<div\b[^>]*\bdata-composition-src="([^"]+)"[^>]*>/g)) {
    scenes.push({ at: m.index, open: m[0], inner: () => slotText(path.resolve(baseDir, m[1])) });
  }
  scenes.sort((x, y) => x.at - y.at);
  if (scenes.length === 0) throw new Error(`No <section class="clip"> or <div data-composition-src> found in ${a.html}.`);

  // the composition's own <section class="clip"> blocks, scripts and styles
  // removed first (motion.js has a <section class="clip"> in a comment)
  function slotText(file) {
    if (!fs.existsSync(file)) return null;
    const comp = dropScaffold(readText(file)
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " "));
    const secs = [...comp.matchAll(rxClip)].map((m) => m[1]);
    return secs.length > 0 ? secs.join(" ") : comp.replace(/<head\b[\s\S]*?<\/head>/i, " ");
  }

  let flagged = 0, cleanScenes = 0, unstamped = 0, missing = 0;
  console.log(color.cyan(`=== image vs audio  (${scenes.length} scenes) ===`));

  for (const sc of scenes) {
    const open = sc.open;
    const id = /id="([^"]+)"/i.exec(open)?.[1] ?? "?";
    const stM = /data-start="([\d.]+)"/i.exec(open);
    const duM = /data-duration="([\d.]+)"/i.exec(open);
    if (!stM || !duM) {
      console.log(color.yellow(`  ${id}  no data-start/duration, run stamp-timing.mjs first`));
      unstamped++;
      continue;
    }
    const st = Number(stM[1]), du = Number(duM[1]);

    const body = sc.inner();
    if (body === null) {
      console.log(color.yellow(`  ${id}  composition file not found: ${/data-composition-src="([^"]+)"/.exec(open)[1]}`));
      missing++;
      continue;
    }
    const inner = body.replace(/<[^>]+>/g, " ");
    const screen = [...new Set(tokenize(inner))];
    if (screen.length === 0) { cleanScenes++; continue; }

    const w0 = st - a.lead, w1 = st + du + a.lag;
    const spokenRaw = wl.filter((x) => x.end >= w0 && x.start <= w1).map((x) => x.text);
    const spokenList = tokenize(spokenRaw.join(" "));
    const spokenSet = new Set(spokenList);

    const miss = screen.filter((w) => !heard(w, spokenSet, spokenList));
    if (miss.length > 0) {
      flagged++;
      console.log(color.red(`  ${id}  t=${n1(st)}-${n1(st + du)}   shows: ${miss.join(", ")}`));
      console.log(color.gray(`        heard [${n1(w0)}-${n1(w1)}]: ${spokenRaw.slice(0, 14).join(" ")}`));
    } else {
      cleanScenes++;
    }
  }

  console.log("");
  console.log(`clean: ${cleanScenes}   flagged: ${flagged}   unstamped: ${unstamped}` + (missing > 0 ? `   missing: ${missing}` : ""));
  console.log("This is a slip filter, not the 3rd gate. A clean run is not approval.");
  if (a.strict && (flagged > 0 || unstamped > 0 || missing > 0)) return 1;
});
