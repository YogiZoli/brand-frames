#!/usr/bin/env node
// sentences.mjs: PIPELINE step 3, the sentence table. Node port of sentences.ps1.
//
// Every scene's timing is DERIVED from the locked audio, never typed. This script
// builds the table; stamp-timing.mjs reads it and fills the numbers.
//
// INPUT (one of)
//   --stt <file>   ElevenLabs word-level STT json { words:[{text,start,end,type}] }
//                  The gold source; vo.srt is generated from it. Prefer it.
//   --srt <file>   a plain .srt. Cues are word-groups, so the split time inside
//                  a cue is interpolated by character position.
//
// OUTPUT (next to the input unless --outdir given)
//   sentences.json  [ { id:"S1", start, end, dur, words, text }, ... ]
//   words.json      flat word list, for image-audio-lint.mjs
//   sentences.md    the table a human reads at the step-3 gate
//
// RULES
//   A sentence ends on . ? ! optionally followed by a closing quote/bracket.
//   "..." mid-thought does NOT end a sentence. A short abbreviation list and a
//   lone initial ("J.") do not end one either. Zero tokens, pure text.
//
// USAGE
//   node sentences.mjs --stt ../../pipeline/aivw_stt.json --outdir ./_sample
//   node sentences.mjs --srt ../../ai-video-workflow/assets/vo.srt

import fs from "node:fs";
import path from "node:path";
import { parseArgs, psRound, n2, readText, writeText, color, run } from "./lib.mjs";

const ABBR = ["e.g.", "i.e.", "mr.", "mrs.", "ms.", "dr.", "vs.", "etc.", "no.", "st.", "inc.", "fig.", "approx.", "dept.", "vol."];

function parseTC(s) {
  const m = /(\d+):(\d+):(\d+)[,.](\d+)/.exec(s);
  if (!m) return null;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
}

function wordsFromStt(src) {
  const j = JSON.parse(readText(src));
  const words = [];
  for (const w of j.words ?? []) {
    if (w.type && w.type !== "word") continue;
    const t = String(w.text ?? "").trim();
    if (t === "") continue;
    words.push({ text: t, start: Number(w.start), end: Number(w.end) });
  }
  return words;
}

function wordsFromSrt(src) {
  const raw = readText(src).replace(/\r\n/g, "\n");
  const blocks = raw.trim().split(/\n\n+/);
  const words = [];
  for (const b of blocks) {
    const lines = b.split("\n");
    const tcLine = lines.find((l) => l.includes("-->"));
    if (!tcLine) continue;
    const parts = tcLine.split("-->");
    const cs = parseTC(parts[0]);
    const ce = parseTC(parts[1]);
    if (cs === null || ce === null) continue;
    const ctext = lines.filter((l) => !l.includes("-->") && !/^\s*\d+\s*$/.test(l)).join(" ").trim();
    if (ctext === "") continue;
    const toks = ctext.split(/\s+/);
    const total = toks.reduce((a, t) => a + t.length, 0) + Math.max(0, toks.length - 1);
    if (total <= 0) continue;
    const span = ce - cs;
    let acc = 0;
    for (const tok of toks) {
      const ws = cs + span * (acc / total);
      acc += tok.length + 1;
      const we = cs + span * (Math.min(acc, total) / total);
      words.push({ text: tok, start: ws, end: we });
    }
  }
  return words;
}

// Case-insensitive, like PowerShell -match.
function endsSentence(tok) {
  if (ABBR.includes(tok.toLowerCase())) return false;
  if (/\.\.\.+["')\]]?$/i.test(tok)) return false; // ellipsis, keep going
  if (/[.?!]+["')\]]?$/i.test(tok)) {
    if (/^[A-Z]\.$/i.test(tok)) return false; // a lone initial
    return true;
  }
  return false;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

run(() => {
  const a = parseArgs(process.argv.slice(2), {
    stt: { type: "string" },
    srt: { type: "string" },
    outDir: { type: "string" },
  });
  if (!a.stt && !a.srt) throw new Error("Give --stt <word-json> or --srt <file>.");
  const src = a.stt || a.srt;
  if (!fs.existsSync(src)) throw new Error(`Not found: ${src}`);
  const outDir = a.outDir || path.dirname(path.resolve(src));
  fs.mkdirSync(outDir, { recursive: true });

  const words = a.stt ? wordsFromStt(src) : wordsFromSrt(src);
  if (words.length === 0) throw new Error(`No words parsed from ${src}.`);

  const groups = [];
  let cur = [];
  for (const w of words) {
    cur.push(w);
    if (endsSentence(w.text)) {
      groups.push(cur);
      cur = [];
    }
  }
  if (cur.length > 0) groups.push(cur); // trailing fragment, no final stop

  const rows = groups.map((g, i) => {
    const st = psRound(g[0].start, 3);
    const en = psRound(g[g.length - 1].end, 3);
    return { id: `S${i + 1}`, start: st, end: en, dur: psRound(en - st, 3), words: g.length, text: g.map((w) => w.text).join(" ") };
  });

  const jsonPath = path.join(outDir, "sentences.json");
  writeText(jsonPath, JSON.stringify(rows, null, 2) + "\n");

  const wjson = words.map((w) => ({ text: w.text, start: psRound(w.start, 3), end: psRound(w.end, 3) }));
  writeText(path.join(outDir, "words.json"), JSON.stringify(wjson, null, 2) + "\n");

  const d = new Date();
  const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const last = rows[rows.length - 1];
  const md = [
    "# Sentence table",
    "",
    `Source: \`${path.basename(src)}\` · ${rows.length} sentences · audio ends ${psRound(last.end, 2)}s`,
    `Generated ${stamp} by sentences.mjs. Do not hand-edit; regenerate.`,
    "",
    "| id | start | end | dur | sentence |",
    "|---|---:|---:|---:|---|",
    ...rows.map((r) => `| ${r.id} | ${n2(r.start)} | ${n2(r.end)} | ${n2(r.dur)} | ${r.text.replace(/\|/g, "\\|")} |`),
    "",
  ].join("\n");
  const mdPath = path.join(outDir, "sentences.md");
  writeText(mdPath, md);

  console.log(color.cyan(`Sentences: ${rows.length}  (${n2(last.end)}s audio)`));
  console.log(`  ${jsonPath}`);
  console.log(`  ${mdPath}`);
});
