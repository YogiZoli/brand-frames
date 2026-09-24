// lib.mjs: shared helpers for the Node pipeline scripts.
//
// The .mjs scripts replace the PowerShell ones (sentences, stamp-timing,
// avatar_composite; all the .ps1 originals are deleted) so the pipeline runs the same on
// Windows and macOS. Two PowerShell behaviours are reproduced on purpose, so the
// output matches the .ps1 byte for byte where it matters:
//   - [math]::Round(x, n) rounds half to even ("banker's rounding").
//   - '{0:N2}' prints two decimals with a thousands separator, en-US style.

import fs from "node:fs";
import path from "node:path";

export function psRound(x, digits = 0) {
  const p = 10 ** digits;
  const v = x * p;
  const fl = Math.floor(v);
  const diff = v - fl;
  let r;
  if (diff > 0.5) r = fl + 1;
  else if (diff < 0.5) r = fl;
  else r = fl % 2 === 0 ? fl : fl + 1;
  return r / p;
}

export function n2(x) {
  return Number(x).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function n1(x) {
  return Number(x).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Minimal "--flag value" / "--switch" parser. Flags are case-insensitive, and the
// PowerShell spelling (-Stt, -OutDir) is accepted too, so old notes still work.
export function parseArgs(argv, spec) {
  const out = {};
  for (const [k, def] of Object.entries(spec)) out[k] = def.default;
  const byLower = Object.fromEntries(Object.keys(spec).map((k) => [k.toLowerCase(), k]));
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("-")) throw new Error(`Unexpected argument: ${a}`);
    const key = byLower[a.replace(/^-+/, "").toLowerCase()];
    if (!key) throw new Error(`Unknown option: ${a}`);
    const def = spec[key];
    if (def.type === "switch") out[key] = true;
    else {
      const v = argv[++i];
      if (v === undefined) throw new Error(`Missing value for ${a}`);
      out[key] = def.type === "number" ? Number(v) : v;
    }
  }
  for (const [k, def] of Object.entries(spec)) {
    if (def.required && (out[k] === undefined || out[k] === "")) throw new Error(`Missing required option --${k}`);
  }
  return out;
}

export function readText(p) {
  // PowerShell's Get-Content -Raw strips a UTF-8 BOM; do the same.
  return fs.readFileSync(p, "utf8").replace(/^﻿/, "");
}

export function writeText(p, s) {
  fs.mkdirSync(path.dirname(path.resolve(p)), { recursive: true });
  fs.writeFileSync(p, s, "utf8"); // UTF-8, no BOM, like the .ps1 scripts
}

export const color = {
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  gray: (s) => `\x1b[90m${s}\x1b[0m`,
};

export function run(main) {
  try {
    const code = main();
    if (typeof code === "number") process.exitCode = code;
  } catch (e) {
    console.error(color.red(e.message));
    process.exitCode = 1;
  }
}
