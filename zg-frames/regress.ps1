<#
  regress.ps1 — the regression test for the zg-frames archetype library.

  WHY THIS EXISTS
  Zoltan is never the regression test. After any change to zg.css / motion.js /
  icons.js we must know WHICH archetypes changed, before a single video is touched.
  A change we intended is fine. A change we did not intend is a bug, and it must
  surface here — not three videos later.

  WHAT IT DOES
  1. reads the scene table straight out of index.html (id, start, duration, title)
  2. grabs THREE frames per scene from the rendered mp4, at 25 / 55 / 85% of the
     scene — so the motion is measured, not only the end state
  3. compares each frame with the same scene + phase in baseline/; the scene's
     RMSE is the WORST of its three phases
  4. prints a per-archetype verdict (RMSE, which phase was worst, all three),
     sorted worst first
  5. recolours the 55% frame of every CHANGED scene to deuteranopia, so a
     colour-only regression cannot slip through
  6. for every CHANGED scene builds a 3x3 review board (BASELINE / THIS RENDER /
     WHAT MOVED rows, 25/55/85% columns) plus a baseline-beside-new motion clip,
     stacked into review-sheet.png + review-motion.mp4 — approval is a scroll,
     not a fifteen-minute hunt
  7. writes regress-report.md next to the frames

  USAGE
    .\regress.ps1 -Video sampler_v6.mp4              # compare vs baseline\
    .\regress.ps1 -Video sampler_v6.mp4 -Accept      # make this render the new baseline
    .\regress.ps1 -Video sampler_v6.mp4 -Threshold 1.5

  NOTES
  - A scene that exists in the render but not in the baseline is reported as NEW,
    never as a failure. New archetypes are expected.
  - Threshold is RMSE on the 0..255 scale. Anti-aliasing noise sits under ~0.8;
    2.0 is the default line between "the same" and "look at this".
  - baseline/ holds <scene>_0/1/2.png (the three phases) and baseline.mp4 (the
    approved render, for the motion clips). A pre-3-phase baseline (single
    <scene>.png) still works: it compares the 55% frame only and asks for a
    re-accept.
  - Zero tokens. Pure ffmpeg. Run it as often as you like.
#>

param(
  [string]$Video     = "sampler_2026-08-29_v6.mp4",
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
# Two shapes: the old monolith (<section class="clip"> with a .kick label) and
# the mount host (one <div data-composition-src> slot per archetype block).
$src = Get-Content $Html -Raw
$scenes = @()
# mount host: any <div ...> carrying data-composition-src. Attribute order is not
# fixed (the runtime injects data-hf-id), so match the tag then pull each attr.
foreach ($m in [regex]::Matches($src, '<div\b[^>]*\bdata-composition-src="[^"]*"[^>]*>')) {
  $tag = $m.Value
  $id = [regex]::Match($tag, 'data-composition-id="([^"]+)"').Groups[1].Value
  $st = [regex]::Match($tag, 'data-start="([\d.]+)"').Groups[1].Value
  $du = [regex]::Match($tag, 'data-duration="([\d.]+)"').Groups[1].Value
  if ($id -and $st -and $du) {
    $scenes += [pscustomobject]@{ Id = $id; Start = [double]$st; Dur = [double]$du; Title = $id }
  }
}
if ($scenes.Count -eq 0) {
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
}
if ($scenes.Count -eq 0) { throw "No scenes parsed from $Html — has the markup shape changed?" }
Write-Host ("Scene table: {0} archetypes." -f $scenes.Count)

# sanity: the render must be at least as long as the table claims
$len = [double](ffprobe -v error -show_entries format=duration -of csv=p=0 $Video)
$need = ($scenes | ForEach-Object { $_.Start + $_.Dur } | Measure-Object -Maximum).Maximum
if ($len -lt $need - 0.5) {
  Write-Warning ("Render is {0:N1}s but the scene table needs {1:N1}s. Did the render finish?" -f $len, $need)
}

# ---------- 2. THREE frames per scene: 25 / 55 / 85% ----------
# One frame at 78% only measured the end state — a scene could animate wrong and
# still land right. Three frames catch the motion. The verdict is the worst of
# the three. Baseline stores the same three.
$pcts   = @(0.25, 0.55, 0.85)
$phaseName = @('25%','55%','85%')

# 3-phase baseline present, or an old single-frame (78%) one?
$base3      = Test-Path (Join-Path $Baseline "$($scenes[0].Id)_0.png")
$baseLegacy = -not $base3 -and (Test-Path (Join-Path $Baseline "$($scenes[0].Id).png"))

New-Item -ItemType Directory -Force -Path $Out | Out-Null
Get-ChildItem $Out -Include *.png,*.mp4,*.txt -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue
foreach ($s in $scenes) {
  for ($i = 0; $i -lt 3; $i++) {
    $t = $s.Start + $s.Dur * $pcts[$i]
    if ($t -gt $len) { $t = [math]::Max(0, $len - 0.05) }
    ffmpeg -y -v error -ss $t -i $Video -frames:v 1 -vf "scale=960:-1" (Join-Path $Out "$($s.Id)_$i.png")
  }
  if ($baseLegacy -and -not $Accept) {
    $tl = $s.Start + $s.Dur * 0.78
    if ($tl -gt $len) { $tl = [math]::Max(0, $len - 0.05) }
    ffmpeg -y -v error -ss $tl -i $Video -frames:v 1 -vf "scale=960:-1" (Join-Path $Out "$($s.Id)_L.png")
  }
}
Write-Host ("Frames grabbed: {0} scenes x 3 phases." -f $scenes.Count)

# ---------- accept mode: this render becomes the truth ----------
if ($Accept) {
  New-Item -ItemType Directory -Force -Path $Baseline | Out-Null
  Get-ChildItem $Baseline -Filter *.png -ErrorAction SilentlyContinue | Remove-Item -Force   # drop old single- or three-frame set
  Get-ChildItem $Out -Filter "*_?.png" | Copy-Item -Destination $Baseline -Force
  # Keep the approved render itself, so a future regression can show MOTION
  # (baseline clip beside the new clip), not only a still. Re-encoded small.
  cmd /c "ffmpeg -y -v error -i ""$Video"" -an -c:v libx264 -crf 30 -preset veryfast -vf scale=1280:-2 ""$(Join-Path $Baseline 'baseline.mp4')"" 2>&1" | Out-String | Out-Null
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  "$stamp · $Video · $($scenes.Count) archetypes · 3-phase (25/55/85)" | Set-Content (Join-Path $Baseline "APPROVED.txt")
  Write-Host "Baseline accepted. This render is now the reference (3-phase stills + baseline.mp4)." -ForegroundColor Green
  exit 0
}

# ---------- 3. compare — all three phases, worst one wins ----------
function FrameRmse($now, $ref) {
  if (-not (Test-Path $now) -or -not (Test-Path $ref)) { return $null }
  # psnr prints "average:<dB>" or "average:inf" (bit-identical). Convert to RMSE:
  #     RMSE = 255 / 10^(PSNR/20)      inf -> 0
  # Through cmd on purpose: ffmpeg's banner goes to stderr and Stop mode would kill us.
  $log = cmd /c "ffmpeg -v info -i ""$now"" -i ""$ref"" -lavfi psnr -f null - 2>&1" | Out-String
  if ($log -match 'average:inf')        { return 0.0 }
  if ($log -match 'average:([\d.]+)')   { return 255.0 / [math]::Pow(10, ([double]$Matches[1]) / 20.0) }
  return $null
}

if ($baseLegacy) {
  Write-Host "Baseline is single-frame (pre 3-phase). Comparing the 78% frame only, as before." -ForegroundColor Yellow
  Write-Host "Run  .\regress.ps1 -Video <approved>.mp4 -Accept  once to enable the 3-phase test." -ForegroundColor Yellow
}

$rows = @()
foreach ($s in $scenes) {
  $hasRef = if ($base3) { Test-Path (Join-Path $Baseline "$($s.Id)_0.png") }
            elseif ($baseLegacy) { Test-Path (Join-Path $Baseline "$($s.Id).png") }
            else { $false }
  if (-not $hasRef) {
    $rows += [pscustomobject]@{ Id=$s.Id; Title=$s.Title; Rmse=$null; Worst=$null; Phases=$null; Verdict="NEW" }
    continue
  }
  $phaseR = @($null, $null, $null)
  $broke = $false
  if ($base3) {
    for ($i = 0; $i -lt 3; $i++) {
      if (($s.Start + $s.Dur * $pcts[$i]) -gt $len + 0.25) { $broke = $true; break }
      $r = FrameRmse (Join-Path $Out "$($s.Id)_$i.png") (Join-Path $Baseline "$($s.Id)_$i.png")
      if ($null -eq $r) { $broke = $true; break }
      $phaseR[$i] = [math]::Round($r, 2)
    }
  } else {
    # legacy: the render's 78% frame vs the one old baseline frame
    if (($s.Start + $s.Dur * 0.78) -gt $len + 0.25) { $broke = $true }
    else {
      $r = FrameRmse (Join-Path $Out "$($s.Id)_L.png") (Join-Path $Baseline "$($s.Id).png")
      if ($null -eq $r) { $broke = $true } else { $phaseR[1] = [math]::Round($r, 2) }
    }
  }
  if ($broke) {
    $rows += [pscustomobject]@{ Id=$s.Id; Title=$s.Title; Rmse=$null; Worst=$null; Phases=$null; Verdict="NINCS A RENDERBEN" }
    continue
  }
  $measured = $phaseR | Where-Object { $null -ne $_ }
  $worst = ($measured | Measure-Object -Maximum).Maximum
  $wi = [array]::IndexOf($phaseR, $worst)
  $v = if ($worst -lt 0.8) { "same" } elseif ($worst -lt $Threshold) { "noise" } else { "CHANGED" }
  $phaseTxt  = if ($base3) { ($phaseR | ForEach-Object { if ($null -eq $_) { '-' } else { $_ } }) -join ' / ' } else { "$($phaseR[1]) (78% only)" }
  $worstName = if ($base3) { $phaseName[$wi] } else { '78%' }
  $rows += [pscustomobject]@{ Id=$s.Id; Title=$s.Title; Rmse=$worst; Worst=$worstName; Phases=$phaseTxt; Verdict=$v }
}

# ---------- 4. verdict, worst first ----------
$sorted  = $rows | Sort-Object -Property @{Expression={ if ($null -eq $_.Rmse) { 9999 } else { $_.Rmse } }} -Descending
$changed = $rows | Where-Object { $_.Verdict -eq "CHANGED" }
$new     = $rows | Where-Object { $_.Verdict -eq "NEW" }

Write-Host ""
Write-Host "=== REGRESSION vs $Baseline  (RMSE = worst of 25/55/85%) ===" -ForegroundColor Cyan
$sorted | Format-Table Id, @{n="RMSE";e={$_.Rmse}}, @{n="worst@";e={$_.Worst}}, @{n="25/55/85";e={$_.Phases}}, Verdict, Title -AutoSize | Out-String | Write-Host
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

# ---------- 5. the CHANGED-scene review pack ----------
# Goal (Zoltan, 2026-08-30): see the change BEFORE the preview, and see it
# thoroughly, not as one end-state still. For every CHANGED scene this builds:
#
#   _card_<id>.png   a 3x3 board — three moments of the scene (25/55/85% of its
#                    duration) as BASELINE row, THIS RENDER row, and a WHAT MOVED
#                    difference row, so the eye lands straight on what shifted.
#   _move_<id>.mp4   the baseline scene playing beside the new scene, in sync.
#   <id>_cvd.png     deuteranopia check (55% frame).
#
# Then everything stacks: review-sheet.png (all boards) and review-motion.mp4
# (all clips back to back, each labelled). Zero tokens, pure ffmpeg. Every label
# goes through textfile= so a title with a slash or middot never breaks a filter.
#
# If baseline.mp4 is missing (a baseline accepted before this change), it falls
# back to the old single still: baseline left, this render right.
$cvd    = "colorchannelmixer=.625:.375:0:0:.7:.3:0:0:0:.3:.7"
$baseVid = Join-Path $Baseline "baseline.mp4"
$haveBaseVid = Test-Path $baseVid
$reviewSheet  = $null
$reviewMotion = $null

if ($changed.Count -gt 0) {
  $utf8  = New-Object System.Text.UTF8Encoding($false)
  $fontB = "C\:/Windows/Fonts/arialbd.ttf"
  $fontR = "C\:/Windows/Fonts/arial.ttf"
  if (-not (Test-Path "C:\Windows\Fonts\arialbd.ttf")) { $fontB = "C\:/Windows/Fonts/arial.ttf" }
  if (-not (Test-Path "C:\Windows\Fonts\arial.ttf"))   { $fontB = $fontR = "" }
  function FfLabel([string]$s) {
    $p = Join-Path $Out ("_lbl_" + [guid]::NewGuid().ToString("N").Substring(0,8) + ".txt")
    [System.IO.File]::WriteAllText($p, $s, $utf8)
    ($p -replace '\\','/') -replace '^([A-Za-z]):','$1\:'
  }
  $cards   = @()
  $clips   = @()
  foreach ($c in $changed) {
    $s = $scenes | Where-Object Id -eq $c.Id | Select-Object -First 1
    if (-not $s) { continue }
    $rmseTxt = if ($null -eq $c.Rmse) { "n/a" } else { "$($c.Rmse)  worst at $(($c.Worst) -replace '%',' pct')" }
    $dur = [math]::Min($s.Dur, [math]::Max(0.6, $len - $s.Start - 0.05))

    # --- deuteranopia still: recolour the 55% frame we already have ---
    if (Test-Path (Join-Path $Out "$($c.Id)_1.png")) {
      cmd /c "ffmpeg -y -v error -i ""$(Join-Path $Out "$($c.Id)_1.png")"" -vf ""$cvd"" -frames:v 1 -update 1 ""$(Join-Path $Out "$($c.Id)_cvd.png")"" 2>&1" | Out-String | Out-Null
    }

    $card = Join-Path $Out "_card_$($c.Id).png"
    $lblFf = FfLabel "$($c.Id)    $($c.Title)    RMSE $rmseTxt"

    if ($base3) {
      # --- the 3 phases we already grabbed: baseline row, this-render row, diff row ---
      $bs = @(); $ns = @(); $ds = @()
      for ($i = 0; $i -lt 3; $i++) {
        $bf = Join-Path $Baseline "$($c.Id)_$i.png"
        $nf = Join-Path $Out      "$($c.Id)_$i.png"
        $df = Join-Path $Out "_d_$($c.Id)_$i.png"
        cmd /c "ffmpeg -y -v error -i ""$bf"" -i ""$nf"" -filter_complex ""[0:v]scale=560:-2[a];[1:v]scale=560:-2[b];[a][b]blend=all_mode=difference,format=gray,eq=contrast=2.4:brightness=0.02"" -frames:v 1 -update 1 ""$df"" 2>&1" | Out-String | Out-Null
        $bs += $bf; $ns += $nf; $ds += $df
      }
      $frm = $bs + $ns + $ds
      if (($frm | Where-Object { Test-Path $_ }).Count -eq 9) {
        # rows are the arcs; columns are 25/55/85%.  frm = [b0 b1 b2 n0 n1 n2 d0 d1 d2]
        $rb = FfLabel "BASELINE  (25 / 55 / 85 pct)"; $rn = FfLabel "THIS RENDER  (25 / 55 / 85 pct)"; $rd = FfLabel "WHAT MOVED  (bright = changed)"
        $fc = @"
[0:v]scale=560:-2[p0];[1:v]scale=560:-2[p1];[2:v]scale=560:-2[p2];
[3:v]scale=560:-2[p3];[4:v]scale=560:-2[p4];[5:v]scale=560:-2[p5];
[6:v]scale=560:-2[p6];[7:v]scale=560:-2[p7];[8:v]scale=560:-2[p8];
[p0][p1][p2]hstack=inputs=3[rb];[p3][p4][p5]hstack=inputs=3[rn];[p6][p7][p8]hstack=inputs=3[rd];
color=c=0x141210:s=1680x96:d=1[bar];
[bar]drawtext=fontfile='$fontB':textfile='$lblFf':x=26:y=28:fontsize=34:fontcolor=0xF5F1E8[bar2];
[rb]drawtext=fontfile='$fontR':textfile='$rb':x=16:y=14:fontsize=26:fontcolor=0x1B6CF0:box=1:boxcolor=0xF5F1E8@0.85:boxborderw=8[rb2];
[rn]drawtext=fontfile='$fontR':textfile='$rn':x=16:y=14:fontsize=26:fontcolor=0x1B6CF0:box=1:boxcolor=0xF5F1E8@0.85:boxborderw=8[rn2];
[rd]drawtext=fontfile='$fontR':textfile='$rd':x=16:y=14:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.85:boxborderw=8[rd2];
[bar2][rb2][rn2][rd2]vstack=inputs=4[out]
"@ -replace "`r`n"," " -replace "`n"," "
        $frmIns = ($frm | ForEach-Object { '-i "' + $_ + '"' }) -join ' '
        $cerr = cmd /c "ffmpeg -y -v error $frmIns -filter_complex ""$fc"" -map ""[out]"" -frames:v 1 -update 1 ""$card"" 2>&1" | Out-String
        if (-not (Test-Path $card) -and $cerr.Trim()) { Write-Warning ("card $($c.Id): " + $cerr.Trim()) }
      }
    }
    else {
      # fallback: single still, legacy baseline frame beside this render's 55% frame
      $ref = Join-Path $Baseline "$($c.Id).png"; $now = Join-Path $Out "$($c.Id)_1.png"
      if ((Test-Path $ref) -and (Test-Path $now)) {
        $fc = @"
[0:v]scale=880:-1[a];[1:v]scale=880:-1[b];[a][b]hstack=inputs=2[pair];
color=c=0x141210:s=1760x108:d=1[bar];
[bar]drawtext=fontfile='$fontB':textfile='$lblFf':x=24:y=18:fontsize=34:fontcolor=0xF5F1E8[b1];
[b1]drawtext=fontfile='$fontR':text='BASELINE':x=24:y=70:fontsize=24:fontcolor=0x9AA0A6,drawtext=fontfile='$fontR':text='THIS RENDER (55 pct)':x=904:y=70:fontsize=24:fontcolor=0x9AA0A6[top];
[top][pair]vstack=inputs=2[out]
"@ -replace "`r`n"," " -replace "`n"," "
        cmd /c "ffmpeg -y -v error -i ""$ref"" -i ""$now"" -filter_complex ""$fc"" -map ""[out]"" -frames:v 1 -update 1 ""$card"" 2>&1" | Out-String | Out-Null
      }
    }

    if ($haveBaseVid) {
      # --- motion clip: baseline scene | new scene, in sync, labelled ---
      $mv = Join-Path $Out "_move_$($c.Id).mp4"
      $mlbl = FfLabel "$($c.Id)  $($c.Title)"
      $mfc = @"
[0:v]scale=920:-2,setpts=PTS-STARTPTS,drawtext=fontfile='$fontR':text='BASELINE':x=20:y=18:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.6:boxborderw=8[l];
[1:v]scale=920:-2,setpts=PTS-STARTPTS,drawtext=fontfile='$fontR':text='THIS RENDER':x=20:y=18:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.6:boxborderw=8[r];
[l][r]hstack=inputs=2,drawtext=fontfile='$fontB':textfile='$mlbl':x=20:y=h-46:fontsize=26:fontcolor=0xF5F1E8:box=1:boxcolor=0x141210@0.6:boxborderw=10,fps=30,format=yuv420p[out]
"@ -replace "`r`n"," " -replace "`n"," "
      $merr = cmd /c "ffmpeg -y -v error -ss $($s.Start) -t $dur -i ""$baseVid"" -ss $($s.Start) -t $dur -i ""$Video"" -filter_complex ""$mfc"" -map ""[out]"" -c:v libx264 -crf 26 -preset veryfast -an ""$mv"" 2>&1" | Out-String
      if (Test-Path $mv) { $clips += $mv } elseif ($merr.Trim()) { Write-Warning ("clip $($c.Id): " + $merr.Trim()) }
    }
    if (Test-Path $card) { $cards += $card }
  }

  # --- stack every board into one scroll ---
  if ($cards.Count -gt 0) {
    $reviewSheet = Join-Path $Out "review-sheet.png"
    if ($cards.Count -eq 1) {
      Copy-Item $cards[0] $reviewSheet -Force
    } else {
      $ins = ($cards | ForEach-Object { '-i "' + $_ + '"' }) -join " "
      $lab = (0..($cards.Count-1) | ForEach-Object { "[$($_):v]" }) -join ""
      $serr = cmd /c "ffmpeg -y -v error $ins -filter_complex ""$($lab)vstack=inputs=$($cards.Count)[out]"" -map ""[out]"" -frames:v 1 -update 1 ""$reviewSheet"" 2>&1" | Out-String
      if (-not (Test-Path $reviewSheet) -and $serr.Trim()) { Write-Warning ("review sheet: " + $serr.Trim()) }
    }
    if (Test-Path $reviewSheet) {
      Write-Host ""
      Write-Host ("Review sheet: {0}  ({1} changed scene{2})" -f `
        $reviewSheet, $cards.Count, $(if ($cards.Count -eq 1) { "" } else { "s" })) -ForegroundColor Cyan
    }
  }

  # --- concat every motion clip into one file to play ---
  if ($clips.Count -gt 0) {
    $reviewMotion = Join-Path $Out "review-motion.mp4"
    $listPath = Join-Path $Out "_motion_list.txt"
    ($clips | ForEach-Object { "file '" + ([System.IO.Path]::GetFullPath($_) -replace '\\','/') + "'" }) -join "`n" |
      Set-Content $listPath -Encoding ASCII
    $lerr = cmd /c "ffmpeg -y -v error -f concat -safe 0 -i ""$listPath"" -c copy ""$reviewMotion"" 2>&1" | Out-String
    if (-not (Test-Path $reviewMotion) -and $lerr.Trim()) { Write-Warning ("review motion: " + $lerr.Trim()) }
    if (Test-Path $reviewMotion) {
      Write-Host ("Review motion: {0}  ({1} clip{2}, baseline beside this render)" -f `
        $reviewMotion, $clips.Count, $(if ($clips.Count -eq 1) { "" } else { "s" })) -ForegroundColor Cyan
    }
  }

  if (-not $haveBaseVid) {
    Write-Host "baseline.mp4 not present — cards are single stills, no motion clips." -ForegroundColor Yellow
    Write-Host "Run once with -Accept to store it, then future runs get the full pack." -ForegroundColor Yellow
  }
  Write-Host ("Deuteranopia frames written for {0} changed scenes." -f $changed.Count)

  # tidy the per-frame intermediates; keep _card_*, _move_*, review-*, zg*.png
  Get-ChildItem $Out -Include _b_*.png,_n_*.png,_d_*.png,_lbl_*.txt,_motion_list.txt -Recurse -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue
}

# ---------- 6. the report ----------
$md = New-Object System.Text.StringBuilder
[void]$md.AppendLine("# Regression report")
[void]$md.AppendLine("")
[void]$md.AppendLine("**Render:** ``$Video`` · **Baseline:** ``$Baseline`` · **Threshold:** RMSE $Threshold")
[void]$md.AppendLine("**Run:** " + (Get-Date -Format "yyyy-MM-dd HH:mm"))
[void]$md.AppendLine("")
[void]$md.AppendLine("RMSE is the worst of three frames per scene, sampled at 25 / 55 / 85% of the scene.")
[void]$md.AppendLine("")
[void]$md.AppendLine("| scene | RMSE | worst@ | 25 / 55 / 85 | verdict | archetype |")
[void]$md.AppendLine("|---|---:|:--:|:--:|---|---|")
foreach ($r in $sorted) {
  # NOTE: build the string FIRST. AppendLine("..." -f a,b) makes PowerShell bind the
  # array to the overload resolver instead of to -f, and the format call blows up.
  $rmseTxt = if ($null -eq $r.Rmse) { "n/a" } else { [string]$r.Rmse }
  $wTxt = if ($r.Worst) { $r.Worst } else { "-" }
  $pTxt = if ($r.Phases) { $r.Phases } else { "-" }
  $line = "| " + $r.Id + " | " + $rmseTxt + " | " + $wTxt + " | " + $pTxt + " | " + $r.Verdict + " | " + $r.Title + " |"
  [void]$md.AppendLine($line)
}
[void]$md.AppendLine("")
[void]$md.AppendLine("CHANGED: $($changed.Count) · NEW: $($new.Count) · unchanged: $($rows.Count - $changed.Count - $new.Count)")
[void]$md.AppendLine("")
[void]$md.AppendLine("Frames: ``$Out\<scene>_0/1/2.png`` (25/55/85%) · deuteranopia: ``$Out\<scene>_cvd.png``")
if ($reviewSheet -and (Test-Path $reviewSheet)) {
  [void]$md.AppendLine("")
  [void]$md.AppendLine("**Review sheet:** ``$reviewSheet`` — one 3x3 board per CHANGED scene (BASELINE / THIS RENDER / WHAT MOVED, at 25/55/85% of the scene). Per-scene boards: ``$Out\_card_<scene>.png``.")
}
if ($reviewMotion -and (Test-Path $reviewMotion)) {
  [void]$md.AppendLine("**Review motion:** ``$reviewMotion`` — every CHANGED scene, baseline playing beside this render. Per-scene clips: ``$Out\_move_<scene>.mp4``.")
}
[void]$md.AppendLine("Accept this render as the new truth: ``.\regress.ps1 -Video $Video -Accept``")
$md.ToString() | Set-Content (Join-Path $Out "regress-report.md") -Encoding UTF8
Write-Host ("Report: {0}\regress-report.md" -f $Out)
