<#
  stamp-timing.ps1 — PIPELINE step 5: derive scene timing from the sentence table.

  WHY THIS EXISTS
  No scene carries a hand-typed data-start / data-duration any more. The author
  writes ONE thing per scene — which sentence(s) it sits on — as data-sent, and
  this script fills data-start / data-duration from sentences.json (the locked
  audio). Change the script, re-run this, timing is correct. Nobody counts
  seconds by hand again.

  THE data-sent CONTRACT  (on every <section class="clip">)
    data-sent="S12"        the scene sits on sentence 12
    data-sent="S12-S15"    the scene covers sentences 12 through 15 (anchor S12)
    data-sent="S20#1/3"    sentence 20 is split across 3 scenes; this is part 1
    data-sent="S20#2/3"    ... part 2   (equal thirds of S20's span)
    data-sent="S20#3/3"    ... part 3
  Optional escape hatch, use sparingly and say why in a comment:
    data-sent-shift="0.20"    nudge this scene's start +0.20s (negative allowed)
    data-hold="0.5"           last scene only: hold 0.5s past the last word

  HOW TIMING FALLS OUT
    start[i]     = the anchor sentence's start (plus any shift), forced to stay
                   after start[i-1] (a warning fires if it had to move)
    duration[i]  = start[i+1] - start[i]                 (contiguous, no gaps)
    duration[last] = audioEnd + hold - start[last]
    #root data-duration = audioEnd + hold

  Zero tokens. Pure text. Writes <html>.bak once, then rewrites in place.

  USAGE
    .\stamp-timing.ps1 -Html ..\..\ai-video-workflow\index.html -Sentences .\_sample\sentences.json
    .\stamp-timing.ps1 -Html in.html -Sentences s.json -WhatIf     # show, do not write
#>

param(
  [Parameter(Mandatory)][string]$Html,
  [Parameter(Mandatory)][string]$Sentences,
  [double]$AudioEnd = 0,
  [switch]$Strict,
  [switch]$WhatIf
)

$ErrorActionPreference = "Stop"
if (-not (Test-Path $Html))      { throw "Composition not found: $Html" }
if (-not (Test-Path $Sentences)) { throw "Sentence table not found: $Sentences" }

$warn = 0
function Warn($m) { $script:warn++; Write-Host "  warn  $m" -ForegroundColor Yellow }

# ---------- sentence lookup ----------
$sRaw = Get-Content $Sentences -Raw
$sList = $sRaw | ConvertFrom-Json
$S = @{}
$idx = 0
foreach ($row in $sList) { $S[$row.id] = [pscustomobject]@{ start=[double]$row.start; end=[double]$row.end; idx=$idx; text=$row.text }; $idx++ }
$maxEnd = ($sList | ForEach-Object { [double]$_.end } | Measure-Object -Maximum).Maximum
if ($AudioEnd -le 0) { $AudioEnd = $maxEnd }

# ---------- pull the scenes out of the composition, in document order ----------
$src = Get-Content $Html -Raw
$rxSection = [regex]'<section\b[^>]*\bclass="[^"]*\bclip\b[^"]*"[^>]*>'
$mm = $rxSection.Matches($src)
if ($mm.Count -eq 0) { throw "No <section class=""clip""> found in $Html." }

$scenes = @()
foreach ($m in $mm) {
  $tag = $m.Value
  $id  = if ($tag -match 'id="([^"]+)"') { $Matches[1] } else { "?" }
  if ($tag -notmatch 'data-sent="([^"]+)"') {
    throw "Scene '$id' has no data-sent. Every clip needs one (see the contract at the top of this script)."
  }
  $sent  = $Matches[1]
  $shift = if ($tag -match 'data-sent-shift="([-\d.]+)"') { [double]$Matches[1] } else { 0 }
  $hold  = if ($tag -match 'data-hold="([\d.]+)"') { [double]$Matches[1] } else { 0 }
  $scenes += [pscustomobject]@{
    Id=$id; Sent=$sent; Shift=$shift; Hold=$hold
    Index=$m.Index; Length=$m.Length; Tag=$tag
    NominalStart=$null; Start=$null; Duration=$null; Covers=@()
  }
}

# ---------- resolve each scene's nominal start + coverage ----------
$splitGroups = @{}
foreach ($sc in $scenes) {
  $v = $sc.Sent
  if ($v -match '^(S\d+)#(\d+)/(\d+)$') {
    $sid=$Matches[1]; $k=[int]$Matches[2]; $nn=[int]$Matches[3]
    if (-not $S.ContainsKey($sid)) { throw "Scene '$($sc.Id)': sentence '$sid' is not in the table." }
    $span = $S[$sid].end - $S[$sid].start
    $sc.NominalStart = $S[$sid].start + $span * (($k-1)/$nn) + $sc.Shift
    $sc.Covers = @($S[$sid].idx)
    if (-not $splitGroups.ContainsKey($sid)) { $splitGroups[$sid] = @() }
    $splitGroups[$sid] += $k
    if ($k -lt 1 -or $k -gt $nn) { Warn "$($sc.Id): part $k of $nn is out of range" }
  }
  elseif ($v -match '^(S\d+)-(S\d+)$') {
    $a=$Matches[1]; $b=$Matches[2]
    if (-not $S.ContainsKey($a)) { throw "Scene '$($sc.Id)': sentence '$a' is not in the table." }
    if (-not $S.ContainsKey($b)) { throw "Scene '$($sc.Id)': sentence '$b' is not in the table." }
    if ($S[$b].idx -lt $S[$a].idx) { throw "Scene '$($sc.Id)': range $a-$b runs backwards." }
    $sc.NominalStart = $S[$a].start + $sc.Shift
    $sc.Covers = @($S[$a].idx..$S[$b].idx)
  }
  elseif ($v -match '^(S\d+)$') {
    if (-not $S.ContainsKey($v)) { throw "Scene '$($sc.Id)': sentence '$v' is not in the table." }
    $sc.NominalStart = $S[$v].start + $sc.Shift
    $sc.Covers = @($S[$v].idx)
  }
  else { throw "Scene '$($sc.Id)': cannot read data-sent=""$v"". See the contract." }
}

# split groups must be complete: parts 1..n each once
foreach ($sid in $splitGroups.Keys) {
  $got = $splitGroups[$sid] | Sort-Object
  $nn  = ($scenes | Where-Object { $_.Sent -match "^$sid#\d+/(\d+)$" } | ForEach-Object { [int]($_.Sent -replace '.*/','') } | Select-Object -First 1)
  $want = 1..$nn
  if (($got -join ',') -ne ($want -join ',')) { Warn "$sid is split $nn ways but the parts present are: $($got -join ',')" }
}

# ---------- lay the scenes on the timeline: monotonic + contiguous ----------
$MINDUR = 0.6
for ($i=0; $i -lt $scenes.Count; $i++) {
  $sc = $scenes[$i]
  $st = [double]$sc.NominalStart
  if ($i -gt 0) {
    $prev = $scenes[$i-1].Start
    if ($st -lt $prev + $MINDUR) {
      Warn "$($sc.Id): anchor start $([math]::Round($st,2))s is before the previous scene ends; pushed to $([math]::Round($prev+$MINDUR,2))s. Check the data-sent order."
      $st = $prev + $MINDUR
    }
  }
  $sc.Start = [math]::Round($st, 3)
}
for ($i=0; $i -lt $scenes.Count; $i++) {
  if ($i -lt $scenes.Count - 1) {
    $scenes[$i].Duration = [math]::Round($scenes[$i+1].Start - $scenes[$i].Start, 3)
  } else {
    $endAt = $AudioEnd + $scenes[$i].Hold
    $scenes[$i].Duration = [math]::Round($endAt - $scenes[$i].Start, 3)
  }
}

# ---------- sanity ----------
$rootDur = [math]::Round($AudioEnd + ($scenes[-1].Hold), 3)
foreach ($sc in $scenes) {
  if ($sc.Duration -lt 0.8)  { Warn "$($sc.Id): only $($sc.Duration)s on screen — probably a wrong anchor" }
  if ($sc.Duration -gt 12)   { Warn "$($sc.Id): $($sc.Duration)s on screen — probably a missing next anchor" }
}
# coverage: any sentence between the first and last covered that no scene shows.
# Capped, so a partial composition does not bury the real warnings.
$allCov = ($scenes | ForEach-Object { $_.Covers } | Sort-Object -Unique)
if ($allCov.Count -gt 0) {
  $gap = @()
  for ($k = $allCov[0]; $k -le $allCov[-1]; $k++) { if ($allCov -notcontains $k) { $gap += $k } }
  $show = $gap | Select-Object -First 10
  foreach ($k in $show) { Warn "sentence $($sList[$k].id) (`"$($sList[$k].text.Substring(0,[Math]::Min(40,$sList[$k].text.Length)))...`") is shown by no scene" }
  if ($gap.Count -gt $show.Count) { Warn "... and $($gap.Count - $show.Count) more sentences shown by no scene" }
}

# ---------- print the resolved table ----------
Write-Host ""
Write-Host ("=== resolved timing  ({0} scenes, audio {1:N2}s) ===" -f $scenes.Count, $AudioEnd) -ForegroundColor Cyan
$scenes | ForEach-Object {
  $sidx = $_.Covers[0]
  $prev = if ($sList[$sidx]) { $sList[$sidx].text } else { "" }
  [pscustomobject]@{
    scene   = $_.Id
    sent    = $_.Sent
    start   = ('{0:N2}' -f $_.Start)
    dur     = ('{0:N2}' -f $_.Duration)
    sentence= if ($prev.Length -gt 54) { $prev.Substring(0,54) + "..." } else { $prev }
  }
} | Format-Table -AutoSize | Out-String | Write-Host
Write-Host ("#root data-duration = {0:N2}" -f $rootDur)
Write-Host ("warnings: {0}" -f $warn)
if ($Strict -and $warn -gt 0) { throw "strict mode: $warn warning(s)." }

if ($WhatIf) { Write-Host "`n-WhatIf: nothing written." -ForegroundColor Yellow; exit 0 }

# ---------- rewrite the composition ----------
if (-not (Test-Path "$Html.bak")) { Copy-Item $Html "$Html.bak" }
# work back-to-front so earlier indices stay valid
$out = $src
for ($i = $scenes.Count - 1; $i -ge 0; $i--) {
  $sc = $scenes[$i]
  $newTag = $sc.Tag
  $newTag = $newTag -replace '\s+data-start="[^"]*"', ''
  $newTag = $newTag -replace '\s+data-duration="[^"]*"', ''
  $inject = (' data-start="{0}" data-duration="{1}"' -f $sc.Start, $sc.Duration)
  if ($newTag -match 'data-sent="[^"]*"') {
    $newTag = $newTag -replace '(data-sent="[^"]*")', ('$1' + $inject)
  } else {
    $newTag = $newTag -replace '(<section\b)', ('$1' + $inject)
  }
  $out = $out.Substring(0, $sc.Index) + $newTag + $out.Substring($sc.Index + $sc.Length)
}
# #root duration
$out = [regex]::Replace($out, '(<div\b[^>]*\bid="root"[^>]*\bdata-duration=")[^"]*(")', ('${1}' + $rootDur + '${2}'))

[System.IO.File]::WriteAllText($Html, $out, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "`nStamped $([System.IO.Path]::GetFileName($Html))  (original at $([System.IO.Path]::GetFileName($Html)).bak)" -ForegroundColor Green
