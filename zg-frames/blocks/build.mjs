#!/usr/bin/env node
// blocks/build.mjs: generate mountable archetype blocks from one source of truth.
// Node port of build.ps1.
//
// Every archetype's canonical markup lives in blocks/<name>/<name>.src.html. The
// build inlines the shared zg.css + type.js + icons.js + motion.js around it and
// writes blocks/<name>/<name>.html: a HyperFrames sub-composition the sampler AND
// every live video mount via data-composition-src. Same bytes everywhere.
//
// A .src.html starts with a meta header:
//   <!--zg
//   { "id":"lens", "duration":6, "camClass":"cam dense",
//     "variables":[ {"id":"caption","type":"string","label":"Sub caption","default":"..."} ] }
//   zg-->
// followed by the markup that sits inside <div class="cam"> in the sampler.
//
// USAGE
//   node build.mjs                 rebuild every block
//   node build.mjs lens funnel     rebuild only these
//   node build.mjs --nomirror      skip the _frames/blocks/ promoted copy
//
// Re-run after ANY edit to zg.css / motion.js / icons.js / type.js / a .src.html.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url)); // blocks/
const repo = path.dirname(here);                            // zg-frames/
const mirror = path.join(path.dirname(repo), "blocks");     // _frames/blocks/

const read = (p) => fs.readFileSync(p, "utf8").replace(/^﻿/, "");

// Windows PowerShell 5.1 ConvertTo-Json escapes these four; the value lands in a
// single-quoted HTML attribute, so the apostrophe escape is load-bearing.
const psJson = (v) => JSON.stringify(v).replace(/[<>&']/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));

const args = process.argv.slice(2);
const noMirror = args.some((x) => /^-+nomirror$/i.test(x));
const only = args.filter((x) => !x.startsWith("-"));

let css = read(path.join(repo, "zg.css"));
// Swap zg.css's path-based @font-face for base64 data: URIs (_fontface.css,
// from make-fontface). A mounted sub-comp renders isolated, so a relative
// url("fonts/...") does not reach it reliably.
const fontFace = read(path.join(here, "_fontface.css"));
css = css.replace(/^@font-face\{[^}]*\}\r?\n?/gm, "");
css = fontFace + "\n" + css;

// a literal </script inside inlined JS would close the HTML tag, so break it
const inlineJs = (p) => read(p).split("</script").join("<\\/script");
const typeJs = inlineJs(path.join(repo, "type.js"));
const iconsJs = inlineJs(path.join(repo, "icons.js"));
const motionJs = inlineJs(path.join(repo, "motion.js"));

let dirs = fs.readdirSync(here, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(here, d.name, `${d.name}.src.html`)))
  .map((d) => d.name)
  .sort((x, y) => x.localeCompare(y, "en", { sensitivity: "base" }));
if (only.length) dirs = dirs.filter((n) => only.includes(n));
if (dirs.length === 0) {
  console.error(`No matching block sources under ${here}`);
  process.exit(1);
}

const built = [];
for (const name of dirs) {
  const src = read(path.join(here, name, `${name}.src.html`));
  const m = /<!--zg\s*([\s\S]*?)\s*zg-->/.exec(src);
  if (!m) throw new Error(`${name}.src.html: missing <!--zg { ... } zg--> meta header`);
  const meta = JSON.parse(m[1]);
  const markup = src.slice(m.index + m[0].length).trim();

  const id = meta.id || name;
  const dur = Number(meta.duration);
  const cam = meta.camClass || "cam";
  const secEnd = meta.sectionEnd ? " data-section-end" : "";
  let varsJson = "[]";
  if (meta.variables) varsJson = psJson(Array.isArray(meta.variables) ? meta.variables : [meta.variables]);

  // <template> transport shape (references/sub-compositions.md). Known trade-off:
  // a mounted block composites ~3-4% larger than the same scene inline in the
  // monolith; uniform across all 39, approved once. See STATUS.md.
  const html = `<!doctype html>
<html lang="en" data-resolution="landscape" data-composition-variables='${varsJson}'>
<head><meta charset="UTF-8"/></head>
<body>
<template>
<style>
${css}
#root{position:absolute;inset:0;font-family:"Open Sans",system-ui,sans-serif}
</style>
<div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" data-start="0" data-duration="600">
<div class="g1" data-layout-allow-overflow></div><div class="g2" data-layout-allow-overflow></div><div class="grid"></div>
<section id="${id}-sc" class="clip" data-start="0" data-duration="600" data-scene-dur="${dur}" data-track-index="1"${secEnd}><div class="${cam}">
${markup}
</div></section>
</div>
<script>
${typeJs}
</script>
<script>
${iconsJs}
</script>
<script>
${motionJs}
</script>
<script>
(function(){
  /* THIS instance's root, not the first on the page — a live video mounts the
     same archetype many times, and document.querySelector would give them all
     instance 1's DOM. currentScript.closest walks up to our own subtree. */
  var s = document.currentScript;
  var root = (s && s.closest && s.closest('[data-composition-id="${id}"]'))
    || document.querySelector('[data-composition-id="${id}"]');
  window.ZG.buildIn(root, "${id}");
})();
</script>
</template>
</body>
</html>`;

  fs.writeFileSync(path.join(here, name, `${name}.html`), html, "utf8"); // no BOM: DOMParser chokes on it
  if (!noMirror) {
    const mDir = path.join(mirror, name);
    fs.mkdirSync(mDir, { recursive: true });
    fs.copyFileSync(path.join(here, name, `${name}.src.html`), path.join(mDir, `${name}.src.html`));
    fs.writeFileSync(path.join(mDir, `${name}.html`), html, "utf8");
  }
  built.push(name);
  const nv = meta.variables ? (Array.isArray(meta.variables) ? meta.variables.length : 1) : 0;
  console.log(`built  ${name}  (id=${id}, ${dur}s, ${nv} vars)`);
}

console.log("");
console.log(`\x1b[32m${built.length} block(s) generated: ${built.join(", ")}\x1b[0m`);
if (!noMirror) console.log(`\x1b[90mmirrored to ${mirror}\x1b[0m`);
