<#
  avatar_composite.ps1  --  KANON avatar composite wrapper (2026-08-24)

  A HeyGen natativ atlathato webm avatart teszi a hatterre, a PIPELINE.md-ben
  rogzitett vegleges recepttel. Nincs colorkey / chromakey / blur / denoise /
  median / maszk / kor / stretch. A natativ VP9 alfa mukodik, csak explicit
  dekoderrel (-c:v libvpx-vp9) kell beolvasni.

  KET MOD:
    -Mode Segments  (ALAP)  az avatar CSAK a megadott idoszigetekre kerul.
                            Olcso: csak a valoban generalt masodpercek fogynak.
    -Mode Full              egyetlen avatar vegig a sarokban. Dragabb.

  HASZNALAT

    # Full mod (egyetlen webm vegig):
    .\avatar_composite.ps1 -Mode Full -Background hatter.mp4 `
        -Avatar avatar.webm -Out kesz.mp4

    # Segments mod (tobb klip, mindegyik a sajat kezdoidejere masodpercben):
    .\avatar_composite.ps1 -Mode Segments -Background hatter.mp4 `
        -Segments "avatar1.webm=0","avatar2.webm=270" -Out kesz.mp4

    # Segments mod explicit veggel (webm=start:end), ha nem a klip sajat hosszat akarod:
    .\avatar_composite.ps1 -Mode Segments -Background hatter.mp4 `
        -Segments "avatar1.webm=0:7.3","avatar2.webm=270:278.4" -Out kesz.mp4

  KANON KONSTANSOK (PIPELINE.md):
    scale=800:-2            aranyos kicsinyites (HeyGen legkisebb kimenete 720p)
    overlay=W-w-40:H-h-40   jobb also sarok, 40px margo
#>

param(
  [ValidateSet('Segments','Full')]
  [string]$Mode = 'Segments',

  [Parameter(Mandatory=$true)]
  [string]$Background,

  # Full mod: egyetlen webm
  [string]$Avatar,

  # Segments mod: "webm=start" vagy "webm=start:end" elemek listaja (start/end masodpercben)
  [string[]]$Segments,

  [Parameter(Mandatory=$true)]
  [string]$Out,

  # Opcionalis kulon hangsav (pl. a VO+BGM mp3). Ha nincs megadva, a hatter
  # hangja jon (ha van), kulonben nema. Eles pipeline-ban ide a vo_bgm.mp3 megy.
  [string]$Audio,

  # A sarok-avatar celszelessege pixelben (magassag aranyos: -2)
  [int]$Width = 800,

  # Margo a jobb also sarokban, pixel
  [int]$Margin = 40,

  # Ha megadva, csak az alfa-ellenorzes fut le, composite nem
  [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'

function Assert-File($path, $label) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "$label nem talalhato: $path"
  }
}

# --- Alfa-onellenorzes: soha ne diagnosztizaljuk felre az alfat -----------
# Valodi alfa eseten a filtergraf YMIN=0 (atlatszo hatter) es YMAX=255 (subject).
# Ha YMIN=255 (mindenutt atlatszo) vagy YMAX=0 (sehol), a webm hibas.
function Test-Alpha($webm) {
  Assert-File $webm "Avatar webm"
  Write-Host "  Alfa-ellenorzes: $webm" -ForegroundColor DarkGray
  $prevEA = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  $log = & ffmpeg -c:v libvpx-vp9 -i $webm `
    -vf "format=yuva420p,alphaextract,signalstats,metadata=print" `
    -f null - 2>&1 | Out-String
  $ErrorActionPreference = $prevEA

  # A signalstats kockankent ir YMIN/YMAX-ot (a metadata=print teszi lathatova).
  # A legkisebb YMIN es a legnagyobb YMAX szamit: van-e valahol atlatszo es subject.
  $yminAll = [regex]::Matches($log, 'YMIN=(\d+)') | ForEach-Object { [int]$_.Groups[1].Value }
  $ymaxAll = [regex]::Matches($log, 'YMAX=(\d+)') | ForEach-Object { [int]$_.Groups[1].Value }
  $ymin = if ($yminAll) { ($yminAll | Measure-Object -Minimum).Minimum } else { $null }
  $ymax = if ($ymaxAll) { ($ymaxAll | Measure-Object -Maximum).Maximum } else { $null }

  if ($null -eq $ymin -or $null -eq $ymax) {
    throw "Nem sikerult kiolvasni az alfa statisztikat ($webm). Az ffmpeg nem adott signalstats-ot. Van egyaltalan alfa csatorna a fajlban?"
  }
  if ($ymin -ge 250) {
    throw "HIBAS ALFA ($webm): YMIN=$ymin (kb. mindenhol atlatszo). Ne composite-olj vele."
  }
  if ($ymax -le 5) {
    throw "HIBAS ALFA ($webm): YMAX=$ymax (sehol sincs subject). Ne composite-olj vele."
  }
  Write-Host "    OK  (YMIN=$ymin, YMAX=$ymax) valodi alfa" -ForegroundColor Green
}

# --- Bemenet-ellenorzes ---------------------------------------------------
Assert-File $Background "Hatter video"

if ($Mode -eq 'Full') {
  if (-not $Avatar) { throw "Full mod: add meg a -Avatar webm-et." }
  Test-Alpha $Avatar
}
else {
  if (-not $Segments -or $Segments.Count -eq 0) {
    throw "Segments mod: add meg a -Segments listat (pl. 'a1.webm=0','a2.webm=270')."
  }
  # Parse-oljuk a szegmenseket
  $parsed = @()
  foreach ($s in $Segments) {
    if ($s -notmatch '^(.*?)=([\d\.]+)(?::([\d\.]+))?$') {
      throw "Rossz szegmens formatum: '$s'. Varva: 'webm=start' vagy 'webm=start:end'."
    }
    $file  = $Matches[1]
    $start = [double]$Matches[2]
    $end   = if ($Matches[3]) { [double]$Matches[3] } else { $null }
    Test-Alpha $file
    $parsed += [pscustomobject]@{ File=$file; Start=$start; End=$end }
  }
}

if ($CheckOnly) {
  Write-Host "CheckOnly: az alfa rendben, composite kihagyva." -ForegroundColor Cyan
  return
}

# --- Filtergraf felepitese ------------------------------------------------
$scale   = "scale=$Width`:-2"
$overlay = "overlay=W-w-$Margin`:H-h-$Margin"

if ($Mode -eq 'Full') {
  $inputs = @('-y','-i',$Background,'-c:v','libvpx-vp9','-i',$Avatar)
  # Hang: kulon -Audio ha van (input 2), kulonben az avatar sajat hangja (1:a?).
  if ($Audio) {
    Assert-File $Audio "Hangsav"
    $inputs += @('-i',$Audio)
    $amap = '2:a'
  } else {
    $amap = '1:a?'
  }
  $args = $inputs + @(
    '-filter_complex', "[1:v]$scale[av];[0:v][av]$overlay[v]",
    '-map','[v]','-map',$amap,
    '-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-shortest',
    $Out
  )
}
else {
  # Segments: minden avatart libvpx-vp9-cel olvasunk be, setpts-szel a sajat
  # idejere toljuk, es between-nel csak akkor mutatjuk. A hang a hatterrol jon.
  $inputs = @('-y','-i',$Background)
  $chains = @()
  $prev   = '[0:v]'
  $i = 1
  foreach ($seg in $parsed) {
    $inputs += @('-c:v','libvpx-vp9','-i',$seg.File)
    $lbl = "a$i"
    # Ha nincs explicit veg, a klip sajat hosszaig mutatjuk (nagy felso hatar).
    $endExpr = if ($null -ne $seg.End) { $seg.End } else { 999999 }
    $chains += "[$i`:v]$scale,setpts=PTS+$($seg.Start)/TB[$lbl]"
    $outLbl = if ($i -eq $parsed.Count) { '[v]' } else { "[t$i]" }
    $chains += "$prev[$lbl]$overlay`:enable='between(t,$($seg.Start),$endExpr)'$outLbl"
    $prev = $outLbl
    $i++
  }
  $filter = ($chains -join ';')
  # Hang: kulon -Audio ha van (a szegmensek utani input), kulonben a hatter
  # hangja, ha van (0:a?). Ha egyik sincs, a video nema lesz.
  if ($Audio) {
    Assert-File $Audio "Hangsav"
    $inputs += @('-i',$Audio)
    $amap = "$($parsed.Count + 1):a"
  } else {
    $amap = '0:a?'
  }
  $args = $inputs + @(
    '-filter_complex', $filter,
    '-map','[v]','-map',$amap,
    '-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-shortest',
    $Out
  )
}

Write-Host "Composite ($Mode) -> $Out" -ForegroundColor Cyan
$prevEA = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
& ffmpeg @args 2>&1 | ForEach-Object { "$_" } | Out-Null
$code = $LASTEXITCODE
$ErrorActionPreference = $prevEA
if ($code -ne 0) { throw "ffmpeg hiba (exit $code)." }

Assert-File $Out "Kimenet"
$size = [math]::Round((Get-Item -LiteralPath $Out).Length / 1MB, 1)
Write-Host "KESZ: $Out ($size MB)" -ForegroundColor Green
