<#
  image-audio-lint.ps1 — does the picture show a word the narration does not say?

  WHAT THIS IS
  A cheap pre-Opus filter. It takes every scene's on-screen text and the words
  actually spoken in that scene's time window, and flags a scene that puts a
  word on screen which the narration never says there. It catches the trivial
  slips: a scene that slid one sentence, a leftover word from a copy-paste, a
  number that does not match ("25" on screen while the voice is still three
  sentences away from "twenty-five").

  WHAT THIS IS NOT
  It is NOT the 3rd gate. It does not judge whether the archetype is right or
  whether the picture is a good picture. It only checks word overlap, leniently.
  A clean run means "no obvious slip", not "approved".

  INPUT
    -Html   <index.html>   scenes with data-start / data-duration already stamped
                           (run stamp-timing.ps1 first)
    -Words  <words.json>   the flat word list from sentences.ps1
    -Lead   1.0            seconds a visual may appear BEFORE its phrase
    -Lag    0.8            seconds a visual may linger AFTER its phrase
    -Strict               exit 1 if anything is flagged

  Zero tokens. Pure text.

  USAGE
    .\image-audio-lint.ps1 -Html ..\..\ai-video-workflow\index.html -Words .\_sample\words.json
#>

param(
  [Parameter(Mandatory)][string]$Html,
  [Parameter(Mandatory)][string]$Words,
  [double]$Lead = 1.0,
  [double]$Lag  = 0.8,
  [switch]$Strict
)

$ErrorActionPreference = "Stop"
if (-not (Test-Path $Html))  { throw "Composition not found: $Html" }
if (-not (Test-Path $Words)) { throw "Word list not found: $Words (run sentences.ps1)" }

$STOP = @'
the a an of to in on for and or but with is are was were be been being it its this that these those
you your yours i me my we us our ours they them their he she his her as at by from into over under
not no nor so if then than too very can will would could should do does did has have had a s t
'@ -split '\s+' | Where-Object { $_ }

$ONES = @{ zero=0;one=1;two=2;three=3;four=4;five=5;six=6;seven=7;eight=8;nine=9;ten=10;eleven=11;twelve=12;
  thirteen=13;fourteen=14;fifteen=15;sixteen=16;seventeen=17;eighteen=18;nineteen=19 }
$TENS = @{ twenty=20;thirty=30;forty=40;fifty=50;sixty=60;seventy=70;eighty=80;ninety=90 }
# ordinals collapse to their cardinal so "02" on screen matches "second" spoken
$ORD  = @{ first='one';second='two';third='three';fourth='four';fifth='five';sixth='six';seventh='seven';
  eighth='eight';ninth='nine';tenth='ten';eleventh='eleven';twelfth='twelve' }

function DigitsToWords([string]$n) {
  $v = 0; if (-not [int]::TryParse($n, [ref]$v)) { return $n }
  if ($v -lt 0 -or $v -gt 999) { return $n }
  $w = @()
  if ($v -ge 100) { $w += ($ONES.GetEnumerator() | Where-Object { $_.Value -eq [math]::Floor($v/100) }).Key; $w += 'hundred'; $v = $v % 100 }
  if ($v -ge 20) { $w += ($TENS.GetEnumerator() | Where-Object { $_.Value -eq ([math]::Floor($v/10)*10) }).Key; $v = $v % 10 }
  if ($v -ge 1) {
    $k = ($ONES.GetEnumerator() | Where-Object { $_.Value -eq $v }).Key
    if ($k) { $w += $k }
  }
  if ($w.Count -eq 0) { return $n }
  $w -join ' '
}

# turn a blob of text into a set of meaningful tokens
function Tokenize([string]$text) {
  if (-not $text) { return @() }
  $t = $text.ToLowerInvariant() -replace '&#\d+;', ' ' -replace '&[a-z]+;', ' '
  # expand standalone digit runs to words so "25" matches "twenty five"
  $t = [regex]::Replace($t, '\b\d{1,3}\b', { param($m) DigitsToWords $m.Value })
  $toks = $t -split '[^a-z0-9]+' | Where-Object { $_ -ne '' }
  $out = @()
  foreach ($tok in $toks) {
    $tk = if ($ORD.ContainsKey($tok)) { $ORD[$tok] } else { $tok }
    foreach ($piece in ($tk -split ' ')) {
      if ($piece -eq '') { continue }
      if ($STOP -contains $piece) { continue }
      if ($piece.Length -lt 3 -and $piece -notmatch '^\d') { continue }
      $out += $piece
    }
  }
  $out
}

# lenient match: exact, or a shared 4-char stem (publish / published), either way
function Heard([string]$w, $spokenSet, $spokenList) {
  if ($spokenSet.Contains($w)) { return $true }
  if ($w.Length -ge 3) {
    $stem3 = $w.Substring(0, 3)
    foreach ($sp in $spokenList) {
      if ($sp.Length -ge 3 -and ($sp.StartsWith($stem3) -or $w.StartsWith($sp.Substring(0, [Math]::Min(4, $sp.Length))))) { return $true }
    }
  }
  return $false
}

# ---------- words ----------
$wl = (Get-Content $Words -Raw | ConvertFrom-Json) | ForEach-Object {
  [pscustomobject]@{ text = ($_.text.ToLowerInvariant() -replace '[^a-z0-9'']',''); start=[double]$_.start; end=[double]$_.end }
}

# ---------- scenes ----------
$src = Get-Content $Html -Raw
# drop scaffold text nodes that are never spoken: .kick label, .sub caption, .plateTag
$clean = [regex]::Replace($src, '(?s)<(\w+)[^>]*class="[^"]*\b(kick|sub|plateTag|kicker|ilbl|blbl|plbl|cx)\b[^"]*"[^>]*>.*?</\1>', ' ')

$rx = [regex]'(?s)<section\b[^>]*\bclass="[^"]*\bclip\b[^"]*"[^>]*>(.*?)</section>'
$openRx = [regex]'<section\b[^>]*>'
$mm = $rx.Matches($clean)
if ($mm.Count -eq 0) { throw "No <section class=""clip""> found in $Html." }

$flagged = 0; $cleanScenes = 0; $unstamped = 0
Write-Host ("=== image vs audio  ({0} scenes) ===" -f $mm.Count) -ForegroundColor Cyan

foreach ($m in $mm) {
  $open = $openRx.Match($m.Value).Value
  $id = if ($open -match 'id="([^"]+)"') { $Matches[1] } else { "?" }
  $st = if ($open -match 'data-start="([\d.]+)"') { [double]$Matches[1] } else { $null }
  $du = if ($open -match 'data-duration="([\d.]+)"') { [double]$Matches[1] } else { $null }
  if ($null -eq $st -or $null -eq $du) {
    Write-Host ("  {0}  no data-start/duration — run stamp-timing.ps1 first" -f $id) -ForegroundColor Yellow
    $unstamped++; continue
  }

  $inner = $m.Groups[1].Value -replace '(?s)<[^>]+>', ' '
  $screen = Tokenize $inner | Select-Object -Unique
  if ($screen.Count -eq 0) { $cleanScenes++; continue }

  $w0 = $st - $Lead; $w1 = $st + $du + $Lag
  $spokenRaw = $wl | Where-Object { $_.end -ge $w0 -and $_.start -le $w1 } | ForEach-Object { $_.text }
  $spokenList = @(Tokenize (($spokenRaw -join ' ')))
  $spokenSet = [System.Collections.Generic.HashSet[string]]::new()
  foreach ($x in $spokenList) { [void]$spokenSet.Add($x) }

  $miss = @()
  foreach ($w in $screen) { if (-not (Heard $w $spokenSet $spokenList)) { $miss += $w } }

  if ($miss.Count -gt 0) {
    $flagged++
    Write-Host ("  {0}  t={1:N1}-{2:N1}   shows: {3}" -f $id, $st, ($st+$du), ($miss -join ', ')) -ForegroundColor Red
    $heardPreview = ($spokenRaw | Select-Object -First 14) -join ' '
    Write-Host ("        heard [{0:N1}-{1:N1}]: {2}" -f $w0, $w1, $heardPreview) -ForegroundColor DarkGray
  } else {
    $cleanScenes++
  }
}

Write-Host ""
Write-Host ("clean: {0}   flagged: {1}   unstamped: {2}" -f $cleanScenes, $flagged, $unstamped)
Write-Host "This is a slip filter, not the 3rd gate. A clean run is not approval."
if ($Strict -and ($flagged -gt 0 -or $unstamped -gt 0)) { exit 1 }
