<#
  regress.ps1 — the regression test for the zg-frames archetype library.

  WHY THIS EXISTS
  Zoltan is never the regression test. After any change to zg.css / motion.js /
  icons.js we must know WHICH archetypes changed, before a single video is touched.
  A change we intended is fine. A change we did not intend is a bug, and it must
  surface here — not three videos later.

  WHAT IT DOES
  1. reads the scene table straight out of index.html (id, start, duration, title)
  2. grabs ONE representative frame per scene from the rendered mp4
     (at start + 78% of the duration — after the motion has landed, before the exit)
  3. compares each frame with the same scene's frame in baseline/
  4. prints a per-archetype verdict, sorted worst first
  5. renders a deuteranopia simulation of every CHANGED scene, so a colour-only
     regression cannot slip through
  6. writes regress-report.md next to the frames

  USAGE
    .\regress.ps1 -Video sampler_v1.6.mp4              # compare vs baseline\
    .\regress.ps1 -Video sampler_v1.6.mp4 -Accept      # make this render the new baseline
    .\regress.ps1 -Video sampler_v1.6.mp4 -Threshold 1.5

  NOTES
  - A scene that exists in the render but not in the baseline is reported as NEW,
    never as a failure. New archetypes are expected.
  - Threshold is RMSE on the 0..255 scale. Anti-aliasing noise sits under ~0.8;
    2.0 is the default line between "the same" and "look at this".
  - Zero tokens. Pure ffmpeg. Run it as often as you like.
#>

param(
  [string]$Video     = "sampler_v1.6.mp4",
  [string]$Html      = "index.html",
  [string]$Baseline  = "baseline",
  [string]$Out       = "_regress",
  [double]$Threshold = 2.0,
  [switch]$Accept
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

function Need($exe) {
  if (-not (Get-Command $exe -ErrorAction SilentlyContinue)) {
    throw "$exe not found on PATH. ffmpeg and ffprobe are both required."
  }
}
Need ffmpeg; Need ffprobe

if (-not (Test-Path $Video)) { throw "Render not found: $Video. Run _go.bat first." }
if (-not (Test-Path $Html))  { throw "Composition not found: $Html" }

# ---------- 1. the scene table, read from the composition itself ----------
$src = Get-Content $Html -Raw
$scenes = @()
$rx = [regex]'(?s)<section id="(?<id>[^"]+)"[^>]*data-start="(?<s>[\d.]+)"[^>]*data-duration="(?<d>[\d.]+)".*?class="kick"[^>]*>(?<t>.*?)</div>'
foreach ($m in $rx.Matches($src)) {
  $title = $m.Groups['t'].Value -replace '&middot;','·' -replace '&[a-z]+;',' ' -replace '\s+',' '
  $scenes += [pscustomobject]@{
    Id    = $m.Groups['id'].Value
    Start = [double]$m.Groups['s'].Value
    Dur   = [double]$m.Groups['d'].Value
    Title = $title.Trim()
  }
}
if ($scenes.Count -eq 0) { throw "No scenes parsed from $Html — has the markup shape changed?" }
Write-Host ("Scene table: {0} archetypes." -f $scenes.Count)

# sanity: the render must be at least as long as the table claims
$len = [double](ffprobe -v error -show_entries format=duration -of csv=p=0 $Video)
$need = ($scenes | ForEach-Object { $_.Start + $_.Dur } | Measure-Object -Maximum).Maximum
if ($len -lt $need - 0.5) {
  Write-Warning ("Render is {0:N1}s but the scene table needs {1:N1}s. Did the render finish?" -f $len, $need)
}

# ---------- 2. one representative frame per scene ----------
New-Item -ItemType Directory -Force -Path $Out | Out-Null
Get-ChildItem $Out -Filter *.png -ErrorAction SilentlyContinue | Remove-Item -Force
foreach ($s in $scenes) {
  $t = $s.Start + $s.Dur * 0.78
  ffmpeg -y -v error -ss $t -i $Video -frames:v 1 -vf "scale=960:-1" (Join-Path $Out "$($s.Id).png")
}
Write-Host ("Frames grabbed: {0}." -f $scenes.Count)

# ---------- accept mode: this render becomes the truth ----------
if ($Accept) {
  New-Item -ItemType Directory -Force -Path $Baseline | Out-Null
  Get-ChildItem $Out -Filter *.png | Copy-Item -Destination $Baseline -Force
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  "$stamp · $Video · $($scenes.Count) archetypes" | Set-Content (Join-Path $Baseline "APPROVED.txt")
  Write-Host "Baseline accepted. This render is now the reference." -ForegroundColor Green
  exit 0
}

# ---------- 3. compare ----------
$rows = @()
foreach ($s in $scenes) {
  $now  = Join-Path $Out "$($s.Id).png"
  $ref  = Join-Path $Baseline "$($s.Id).png"
  if (-not (Test-Path $ref)) {
    $rows += [pscustomobject]@{ Id=$s.Id; Title=$s.Title; Rmse=$null; Verdict="NEW" }
    continue
  }
  # The scene exists in the table but the render is shorter than the table needs.
  # This is not a library problem and not a test problem: it is an OLD RENDER.
  if (-not (Test-Path $now) -or ($s.Start + $s.Dur * 0.78) -gt $len) {
    $rows += [pscustomobject]@{ Id=$s.Id; Title=$s.Title; Rmse=$null; Verdict="NINCS A RENDERBEN" }
    continue
  }
  # ffmpeg's psnr filter prints ONE number we can rely on: "average:<dB>", or
  # "average:inf" when the two frames are bit-identical. It does NOT print mse_avg
  # unless a stats file is requested, so we convert from dB ourselves:
  #     RMSE = 255 / 10^(PSNR/20)      inf dB -> RMSE 0
  # Routed through cmd on purpose: ffmpeg writes its banner to stderr, and with
  # $ErrorActionPreference = Stop PowerShell treats that as a fatal error.
  $log = cmd /c "ffmpeg -v info -i ""$now"" -i ""$ref"" -lavfi psnr -f null - 2>&1" | Out-String
  $rmse = $null
  if ($log -match 'average:inf') {
    $rmse = 0.0
  } elseif ($log -match 'average:([\d.]+)') {
    $psnr = [double]$Matches[1]
    $rmse = 255.0 / [math]::Pow(10, $psnr / 20.0)
  }
  if ($null -eq $rmse) {
    $rows += [pscustomobject]@{ Id=$s.Id; Title=$s.Title; Rmse=$null; Verdict="NEM OSSZEHASONLITHATO" }
    continue
  }
  $v = if ($rmse -lt 0.8) { "same" } elseif ($rmse -lt $Threshold) { "noise" } else { "CHANGED" }
  $rows += [pscustomobject]@{ Id=$s.Id; Title=$s.Title; Rmse=[math]::Round($rmse,2); Verdict=$v }
}

# ---------- 4. verdict, worst first ----------
$sorted  = $rows | Sort-Object -Property @{Expression={ if ($null -eq $_.Rmse) { 9999 } else { $_.Rmse } }} -Descending
$changed = $rows | Where-Object { $_.Verdict -eq "CHANGED" }
$new     = $rows | Where-Object { $_.Verdict -eq "NEW" }

Write-Host ""
Write-Host "=== REGRESSION vs $Baseline ===" -ForegroundColor Cyan
$sorted | Format-Table Id, @{n="RMSE";e={$_.Rmse}}, Verdict, Title -AutoSize | Out-String | Write-Host
$broken = $rows | Where-Object { $_.Verdict -eq "NEM OSSZEHASONLITHATO" }
$missing = $rows | Where-Object { $_.Verdict -eq "NINCS A RENDERBEN" }
if ($missing.Count -gt 0) {
  Write-Host ("{0} jelenet nincs benne ebben a renderben. Regi rendert nezel." -f $missing.Count) -ForegroundColor Yellow
}
$same   = $rows | Where-Object { $_.Verdict -eq "same" -or $_.Verdict -eq "noise" }
Write-Host ("VALTOZOTT: {0}   UJ: {1}   valtozatlan: {2}   nem merheto: {3}" -f `
  $changed.Count, $new.Count, $same.Count, $broken.Count)
if ($broken.Count -gt 0) {
  Write-Host "Van nem merheto jelenet. Az MAGA a teszt hibaja, nem a konyvtare." -ForegroundColor Red
}
if ($changed.Count -gt 0) {
  Write-Host "Ask one question about each CHANGED archetype: did I mean to change this?" -ForegroundColor Yellow
}

# ---------- 5. colour-vision proof on the changed scenes ----------
# deuteranopia matrix (Brettel/Vienot, approximated for the colorchannelmixer filter)
$cvd = "colorchannelmixer=.625:.375:0:0:.7:.3:0:0:0:.3:.7"
foreach ($c in $changed) {
  $s = $scenes | Where-Object Id -eq $c.Id
  $t = $s.Start + $s.Dur * 0.78
  ffmpeg -y -v error -ss $t -i $Video -frames:v 1 -vf "$cvd,scale=960:-1" (Join-Path $Out "$($c.Id)_cvd.png")
}
if ($changed.Count -gt 0) { Write-Host ("Deuteranopia frames written for {0} changed scenes." -f $changed.Count) }

# ---------- 6. the report ----------
$md = New-Object System.Text.StringBuilder
[void]$md.AppendLine("# Regression report")
[void]$md.AppendLine("")
[void]$md.AppendLine("**Render:** ``$Video`` · **Baseline:** ``$Baseline`` · **Threshold:** RMSE $Threshold")
[void]$md.AppendLine("**Run:** " + (Get-Date -Format "yyyy-MM-dd HH:mm"))
[void]$md.AppendLine("")
[void]$md.AppendLine("| scene | RMSE | verdict | archetype |")
[void]$md.AppendLine("|---|---:|---|---|")
foreach ($r in $sorted) {
  # NOTE: build the string FIRST. AppendLine("..." -f a,b) makes PowerShell bind the
  # array to the overload resolver instead of to -f, and the format call blows up.
  $rmseTxt = if ($null -eq $r.Rmse) { "n/a" } else { [string]$r.Rmse }
  $line = "| " + $r.Id + " | " + $rmseTxt + " | " + $r.Verdict + " | " + $r.Title + " |"
  [void]$md.AppendLine($line)
}
[void]$md.AppendLine("")
[void]$md.AppendLine("CHANGED: $($changed.Count) · NEW: $($new.Count) · unchanged: $($rows.Count - $changed.Count - $new.Count)")
[void]$md.AppendLine("")
[void]$md.AppendLine("Frames: ``$Out\<scene>.png`` · deuteranopia: ``$Out\<scene>_cvd.png``")
[void]$md.AppendLine("Accept this render as the new truth: ``.\regress.ps1 -Video $Video -Accept``")
$md.ToString() | Set-Content (Join-Path $Out "regress-report.md") -Encoding UTF8
Write-Host ("Report: {0}\regress-report.md" -f $Out)
