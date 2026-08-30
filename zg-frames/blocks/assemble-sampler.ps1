<#
  blocks/assemble-sampler.ps1 — regenerate ../index.html as a mount host.

  The sampler stops being a 471-line monolith. It becomes a thin host that
  mounts all 39 archetype blocks as sub-compositions, back to back, in the
  canonical order. Each block's duration comes from its own meta header, so
  the timeline is derived, never hand-kept.

  The first run copies the existing monolith to ../index.monolith.html (backup).

  USAGE
    .\assemble-sampler.ps1
    .\assemble-sampler.ps1 -Out ../sampler-blocks.html   # write elsewhere, keep index.html
#>
param([string]$Out = "../index.html")

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
$repo = Split-Path $PSScriptRoot -Parent

$order = @(
  "statement","display-word","hero","step-card","arrow","rail","proportion-bars","split",
  "state-flip","tiles","panel-list","countup-bars","line-chart","lens","form","contact-record",
  "progress-ring","pulse-ring","keyword-pill","end-card","overlay-lower-third","overlay-callout",
  "overlay-quote","device-footage","short-scene","library-card","highlighter","skitch-markers",
  "signature-move","branch","funnel","cycle","gauge","quote","question","before-after",
  "grid","command","lead-card"
)

$outPath = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot $Out))
# The pre-refactor monolith lives in git history (commit 417ab8e:zg-frames/index.html);
# no in-tree backup — a stray second root *.html trips the runtime's
# multiple_root_compositions check.

$t = 0.0
$slots = New-Object System.Text.StringBuilder
foreach ($name in $order) {
  $srcMeta = Join-Path $PSScriptRoot "$name/$name.src.html"
  $html    = Join-Path $PSScriptRoot "$name/$name.html"
  if (-not (Test-Path $html)) { throw "missing $html — run extract.ps1 then build.ps1" }
  $m = [regex]::Match((Get-Content $srcMeta -Raw), '(?s)<!--zg\s*(?<j>.*?)\s*zg-->')
  $meta = $m.Groups['j'].Value | ConvertFrom-Json
  $id = if ($meta.id) { $meta.id } else { $name }
  $dur = [double]$meta.duration

  [void]$slots.AppendLine(("  <div id=""s-$name"" data-composition-id=""$id"" data-composition-src=""blocks/$name/$name.html""" +
    " data-start=""$t"" data-duration=""$dur"" data-track-index=""1"" data-width=""1920"" data-height=""1080""></div>"))
  $t = [math]::Round($t + $dur, 3)
}

$fontFace = Get-Content (Join-Path $PSScriptRoot "_fontface.css") -Raw
if (-not $fontFace) { throw "_fontface.css missing — run make-fontface.ps1" }

$total = $t
$doc = @"
<!doctype html>
<html lang="en" data-resolution="landscape">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1920, height=1080"/>
<title>zg-frames motion sampler (mounted blocks)</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
$fontFace
  body{margin:0;background:#0b0f14;font-family:"Open Sans",system-ui,sans-serif}
  #root{position:relative;width:1920px;height:1080px;overflow:hidden}
  [data-composition-id="main"] > div[data-composition-src]{position:absolute;inset:0}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="$total">
$($slots.ToString().TrimEnd())
</div>
<script>
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = gsap.timeline({ paused: true });
</script>
</body>
</html>
"@

$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outPath, $doc, $utf8)
Write-Host ("wrote {0}  ({1} slots, {2}s total)" -f $outPath, $order.Count, $total) -ForegroundColor Green
