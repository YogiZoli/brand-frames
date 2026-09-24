<#
  blocks/verify-vs-v6.ps1 — one-time: is the mounted sampler visually identical
  to the approved monolith render?

  The archetype baseline (baseline/<id>_N.png) is keyed by the old section ids
  (zg01..zg39); the mount host names scenes by block (statement, arrow, ...), so
  a normal regress run would call all 39 "NEW". This script sidesteps that: it
  renders ../index.html (the mount host), then compares it phase-by-phase
  straight against a reference video (default sampler_2026-08-29_v6.mp4), using
  the mount host's own slot table for timing. If every scene is "same", the
  refactor changed nothing on screen and the new baseline is a formality.

  USAGE
    .\verify-vs-v6.ps1
    .\verify-vs-v6.ps1 -Ref ..\sampler_2026-08-29_v6.mp4 -NewRender ..\sampler_blocks.mp4 -SkipRender
#>
param(
  [string]$Ref       = "..\sampler_2026-08-29_v6.mp4",
  [string]$NewRender  = "..\sampler_blocks.mp4",
  [string]$Host_      = "..\index.html",
  [double]$Threshold  = 2.0,
  [switch]$SkipRender
)
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
$repo = Split-Path $PSScriptRoot -Parent
foreach ($e in "ffmpeg","ffprobe") { if (-not (Get-Command $e -ErrorAction SilentlyContinue)) { throw "$e not on PATH" } }

$refP = Join-Path $PSScriptRoot $Ref
$newP = Join-Path $PSScriptRoot $NewRender
if (-not (Test-Path $refP)) { throw "reference render not found: $refP" }

if (-not $SkipRender) {
  Write-Host "rendering the mount host -> $NewRender ..." -ForegroundColor Cyan
  Push-Location $repo
  cmd /c "npx hyperframes render -o ""$([System.IO.Path]::GetFileName($newP))"" --quiet" | Out-Null
  Pop-Location
}
if (-not (Test-Path $newP)) { throw "new render not found: $newP (drop -SkipRender)" }

$src = Get-Content (Join-Path $PSScriptRoot $Host_) -Raw
$rx = [regex]'<div\s+id="s-[^"]*"\s+data-composition-id="(?<id>[^"]+)"\s+data-composition-src="[^"]*"\s+data-start="(?<s>[\d.]+)"\s+data-duration="(?<d>[\d.]+)"'
$scenes = @()
foreach ($m in $rx.Matches($src)) {
  $scenes += [pscustomobject]@{ Id=$m.Groups['id'].Value; Start=[double]$m.Groups['s'].Value; Dur=[double]$m.Groups['d'].Value }
}
if (-not $scenes) { throw "no mount slots parsed from $Host_" }
Write-Host ("{0} scenes." -f $scenes.Count)

$out = Join-Path $PSScriptRoot "_verify"
New-Item -ItemType Directory -Force -Path $out | Out-Null
Get-ChildItem $out -Filter *.png -ErrorAction SilentlyContinue | Remove-Item -Force
$pcts = @(0.25,0.55,0.85)
$lenNew = [double](ffprobe -v error -show_entries format=duration -of csv=p=0 $newP)

function Rmse($a,$b) {
  $log = cmd /c "ffmpeg -v info -i ""$a"" -i ""$b"" -lavfi psnr -f null - 2>&1" | Out-String
  if ($log -match 'average:inf') { return 0.0 }
  if ($log -match 'average:([\d.]+)') { return [math]::Round(255.0/[math]::Pow(10,([double]$Matches[1])/20.0),2) }
  return $null
}

$rows = @()
foreach ($s in $scenes) {
  $worst = 0.0; $phase = @()
  for ($i=0; $i -lt 3; $i++) {
    $t = [math]::Min($s.Start + $s.Dur*$pcts[$i], $lenNew-0.05)
    $na = Join-Path $out "$($s.Id)_$i`_new.png"; $rb = Join-Path $out "$($s.Id)_$i`_ref.png"
    ffmpeg -y -v error -ss $t -i $newP -frames:v 1 -vf "scale=960:-1" $na
    ffmpeg -y -v error -ss $t -i $refP -frames:v 1 -vf "scale=960:-1" $rb
    $r = Rmse $na $rb; $phase += $r
    if ($r -ne $null -and $r -gt $worst) { $worst = $r }
  }
  $v = if ($worst -lt 0.8) { "same" } elseif ($worst -lt $Threshold) { "noise" } else { "CHANGED" }
  $rows += [pscustomobject]@{ Id=$s.Id; RMSE=$worst; Phases=($phase -join " / "); Verdict=$v }
}

$rows | Sort-Object RMSE -Descending | Format-Table Id,RMSE,Phases,Verdict -AutoSize | Out-String | Write-Host
$changed = $rows | Where-Object Verdict -eq "CHANGED"
Write-Host ("CHANGED: {0}   noise: {1}   same: {2}" -f `
  $changed.Count, ($rows|?{$_.Verdict -eq 'noise'}).Count, ($rows|?{$_.Verdict -eq 'same'}).Count) `
  -ForegroundColor $(if ($changed.Count) { "Yellow" } else { "Green" })

if ($changed.Count) {
  $cards = @()
  foreach ($c in $changed) {
    $mid = Join-Path $out "_cmp_$($c.Id).png"
    $n1 = Join-Path $out "$($c.Id)_1_new.png"; $r1 = Join-Path $out "$($c.Id)_1_ref.png"
    cmd /c "ffmpeg -y -v error -i ""$r1"" -i ""$n1"" -filter_complex ""[0:v]scale=680:-2[a];[1:v]scale=680:-2[b];[a][b]hstack,drawtext=text='$($c.Id)  v6 ^| blocks':x=16:y=12:fontsize=26:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=8"" -frames:v 1 -update 1 ""$mid"" 2>&1" | Out-Null
    if (Test-Path $mid) { $cards += $mid }
  }
  if ($cards.Count) {
    $sheet = Join-Path $out "verify-sheet.png"
    $ins = ($cards | ForEach-Object { '-i "' + $_ + '"' }) -join " "
    $lab = (0..($cards.Count-1) | ForEach-Object { "[$($_):v]" }) -join ""
    cmd /c "ffmpeg -y -v error $ins -filter_complex ""$($lab)vstack=inputs=$($cards.Count)[o]"" -map ""[o]"" -frames:v 1 -update 1 ""$sheet"" 2>&1" | Out-Null
    if (Test-Path $sheet) { Write-Host "diff sheet: $sheet" -ForegroundColor Cyan }
  }
}
Write-Host ""
Write-Host "If every scene is same/noise: Zoltan re-approves motion, then" -ForegroundColor DarkGray
Write-Host "  node ../regress.mjs --video $([System.IO.Path]::GetFileName($newP)) --accept   (writes the new block-keyed baseline)" -ForegroundColor DarkGray
