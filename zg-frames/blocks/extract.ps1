<#
  blocks/extract.ps1 — one-shot: lift every sampler <section> into blocks/<name>/<name>.src.html

  Reads ../index.html (the monolithic sampler), splits it into its 39 archetype
  sections, and writes one blocks/<name>/<name>.src.html per section: the meta
  header (id, duration, camClass, sectionEnd) plus the section's .cam inner markup
  VERBATIM. No variables are added here — the three hand-authored pilot blocks
  (arrow, funnel, lens) already carry their variable surface and are skipped;
  every other archetype gets an empty variables array, and data-var-text hooks
  are added per archetype later, when a live video needs them.

  Run once. After this, blocks/<name>/<name>.src.html is the source of truth and
  ../index.html is regenerated as a mount host by assemble-sampler.ps1.

  USAGE
    .\extract.ps1              # write every missing block source
    .\extract.ps1 -Force       # overwrite existing sources too (except pilot 3)
#>
param([switch]$Force)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
$repo = Split-Path $PSScriptRoot -Parent

# sampler section id  ->  block name (kebab, from the archetype family)
$map = [ordered]@{
  zg01="statement";      zg02="display-word";   zg03="hero";           zg04="step-card"
  zg05="arrow";          zg06="rail";           zg07="proportion-bars"; zg08="split"
  zg09="state-flip";     zg10="tiles";          zg11="panel-list";     zg12="countup-bars"
  zg13="line-chart";     zg14="lens";           zg15="form";           zg16="contact-record"
  zg17="progress-ring";  zg18="pulse-ring";     zg19="keyword-pill";   zg20="end-card"
  zg21="overlay-lower-third"; zg22="overlay-callout"; zg23="overlay-quote"; zg24="device-footage"
  zg25="short-scene";    zg26="library-card";   zg27="highlighter";    zg28="skitch-markers"
  zg29="signature-move"; zg30="branch";         zg31="funnel";         zg32="cycle"
  zg33="gauge";          zg34="quote";          zg35="question";       zg36="before-after"
  zg37="grid";           zg38="command";        zg39="lead-card"
}
$pilot = @("arrow","funnel","lens")

$src = Get-Content (Join-Path $repo "index.html") -Raw
$rx = [regex]'(?s)<section id="(?<id>zg\d+)"[^>]*?data-duration="(?<dur>[\d.]+)"(?<attrs>[^>]*)>\s*<div class="(?<cam>cam[^"]*)">(?<body>.*?)</div></section>'

$done = @()
foreach ($m in $rx.Matches($src)) {
  $sid = $m.Groups['id'].Value
  if (-not $map.Contains($sid)) { Write-Warning "unmapped section $sid — skipped"; continue }
  $name = $map[$sid]
  if ($pilot -contains $name) { continue }

  $dir = Join-Path $PSScriptRoot $name
  $out = Join-Path $dir "$name.src.html"
  if ((Test-Path $out) -and -not $Force) { $done += "$name (exists)"; continue }

  $dur        = $m.Groups['dur'].Value
  $cam        = $m.Groups['cam'].Value
  $sectionEnd = $m.Groups['attrs'].Value -match 'data-section-end'
  $body       = $m.Groups['body'].Value.Trim()

  $meta = [ordered]@{ id = $name; duration = [double]$dur; camClass = $cam; variables = @() }
  if ($sectionEnd) { $meta.sectionEnd = $true }
  $metaJson = ($meta | ConvertTo-Json -Depth 5)

  $file = "<!--zg`n$metaJson`nzg-->`n$body`n"
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($out, $file, $utf8)
  $done += "$name  ($sid, ${dur}s$(if($sectionEnd){', section-end'}))"
}

Write-Host ("{0} block source(s):" -f $done.Count) -ForegroundColor Green
$done | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "Next: build.ps1  then  assemble-sampler.ps1" -ForegroundColor DarkGray
