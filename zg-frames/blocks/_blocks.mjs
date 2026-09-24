// _blocks.mjs: shared helpers for the blocks/ build scripts (Node ports of the .ps1).
//
// A few PowerShell behaviours are reproduced on purpose so the regenerated files
// stay byte-identical to what the .ps1 scripts wrote before:
//   - StringBuilder.AppendLine writes CRLF.
//   - [math]::Round rounds half to even.
//   - [string] of a JSON value: true -> "True", an array -> space-joined.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const BLOCKS = path.dirname(fileURLToPath(import.meta.url)); // blocks/
export const REPO = path.dirname(BLOCKS);                           // zg-frames/
export const CRLF = "\r\n";

// The canonical order of the 39 archetypes (sampler, catalog).
export const ORDER = [
  "statement", "display-word", "hero", "step-card", "arrow", "rail", "proportion-bars", "split",
  "state-flip", "tiles", "panel-list", "countup-bars", "line-chart", "lens", "form", "contact-record",
  "progress-ring", "pulse-ring", "keyword-pill", "end-card", "overlay-lower-third", "overlay-callout",
  "overlay-quote", "device-footage", "short-scene", "library-card", "highlighter", "skitch-markers",
  "signature-move", "branch", "funnel", "cycle", "gauge", "quote", "question", "before-after",
  "grid", "command", "lead-card",
];

export const read = (p) => fs.readFileSync(p, "utf8").replace(/^﻿/, "");
export const write = (p, s) => fs.writeFileSync(p, s, "utf8"); // UTF-8, no BOM

export function readMeta(name) {
  const f = path.join(BLOCKS, name, `${name}.src.html`);
  const m = /<!--zg\s*([\s\S]*?)\s*zg-->/.exec(read(f));
  if (!m) throw new Error(`${name}.src.html: missing <!--zg { ... } zg--> meta header`);
  const meta = JSON.parse(m[1]);
  if (meta.variables && !Array.isArray(meta.variables)) meta.variables = [meta.variables];
  return meta;
}

export function psRound(x, digits = 0) {
  const p = 10 ** digits;
  const v = x * p;
  const fl = Math.floor(v);
  const d = v - fl;
  const r = d > 0.5 ? fl + 1 : d < 0.5 ? fl : fl % 2 === 0 ? fl : fl + 1;
  return r / p;
}

export function psString(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (Array.isArray(v)) return v.map(psString).join(" ");
  return String(v);
}
