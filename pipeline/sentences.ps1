<#
  sentences.ps1 — PIPELINE step 3: the sentence table.

  WHY THIS EXISTS
  Every scene used to carry a hand-typed data-start / data-duration magic number.
  The sentence table already knows where every sentence begins and ends, from the
  locked audio. So the scene timing must be DERIVED from it, never typed. This
  script builds that table. stamp-timing.ps1 then reads it and fills the numbers.

  INPUT (one of)
    -Stt  <file>   ElevenLabs word-level STT json  { words:[{text,start,end,type}] }
                   This is the gold source. It is also what vo.srt is generated
                   from, so prefer it whenever it exists.
    -Srt  <file>   a plain .srt. Cues are word-groups, not sentences, so the split
                   time inside a cue is interpolated by character position.

  OUTPUT (next to the input unless -OutDir given)
    sentences.json   [ { id:"S1", start, end, dur, text, words }, ... ]
    sentences.md     a table a human reads at the step-3 gate

  RULES
  - A sentence ends on . ? ! optionally followed by a closing quote/bracket, then
    whitespace or end of stream. "..." mid-thought does NOT end a sentence.
  - A short abbreviation set (e.g. i.e. Mr. Dr. vs. etc. No.) does not end one.
  - sentence.start = first word.start   sentence.end = last word.end
  - Zero tokens. Pure text.

  USAGE
    .\sentences.ps1 -Stt ..\..\..\pipeline\aivw_stt.json -OutDir .\_sample
    .\sentences.ps1 -Srt ..\..\ai-video-workflow\assets\vo.srt
#>

param(
  [string]$Stt,
  [string]$Srt,
  [string]$OutDir
)

$ErrorActionPreference = "Stop"

if (-not $Stt -and -not $Srt) { throw "Give -Stt <word-json> or -Srt <file>." }
$srcPath = if ($Stt) { $Stt } else { $Srt }
if (-not (Test-Path $srcPath)) { throw "Not found: $srcPath" }
if (-not $OutDir) { $OutDir = Split-Path -Parent (Resolve-Path $srcPath) }
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

# a token is an abbreviation only if it IS one of these (not merely ends with it —
# "last." must not read as the "st." abbreviation).
$ABBR = @('e.g.','i.e.','mr.','mrs.','ms.','dr.','vs.','etc.','no.','st.','inc.','fig.','approx.','dept.','vol.')

# ---------- 1. a flat word list: text + start + end ----------
$words = @()
if ($Stt) {
  $j = Get-Content $srcPath -Raw | ConvertFrom-Json
  foreach ($w in $j.words) {
    if ($w.type -and $w.type -ne 'word') { continue }
    $t = ("" + $w.text).Trim()
    if ($t -eq '') { continue }
    $words += [pscustomobject]@{ text=$t; start=[double]$w.start; end=[double]$w.end }
  }
} else {
  # SRT: parse cues, then spread the cue's words across [cue.start, cue.end] by
  # character length so an in-cue sentence break lands at a believable time.
  $raw = Get-Content $srcPath -Raw
  $raw = $raw -replace "`r`n","`n"
  $blocks = [regex]::Split($raw.Trim(), "`n`n+")
  function ParseTC([string]$s) {
    if ($s -match '(\d+):(\d+):(\d+)[,\.](\d+)') {
      return [double]$Matches[1]*3600 + [double]$Matches[2]*60 + [double]$Matches[3] + [double]$Matches[4]/1000
    }
    return $null
  }
  foreach ($b in $blocks) {
    $lines = $b -split "`n"
    $tcLine = $lines | Where-Object { $_ -match '-->' } | Select-Object -First 1
    if (-not $tcLine) { continue }
    $parts = $tcLine -split '-->'
    $cs = ParseTC $parts[0]; $ce = ParseTC $parts[1]
    if ($null -eq $cs -or $null -eq $ce) { continue }
    $textLines = $lines | Where-Object { $_ -notmatch '-->' -and $_ -notmatch '^\s*\d+\s*$' }
    $ctext = ($textLines -join ' ').Trim()
    if ($ctext -eq '') { continue }
    $toks = $ctext -split '\s+'
    $total = ($toks | Measure-Object -Property Length -Sum).Sum + [Math]::Max(0, $toks.Count - 1)
    if ($total -le 0) { continue }
    $span = $ce - $cs
    $acc = 0
    foreach ($tok in $toks) {
      $ws = $cs + $span * ($acc / $total)
      $acc += $tok.Length + 1
      $we = $cs + $span * ([Math]::Min($acc, $total) / $total)
      $words += [pscustomobject]@{ text=$tok; start=[double]$ws; end=[double]$we }
    }
  }
}
if ($words.Count -eq 0) { throw "No words parsed from $srcPath." }

# ---------- 2. group words into sentences ----------
function EndsSentence([string]$tok) {
  $low = $tok.ToLowerInvariant()
  if ($ABBR -contains $low) { return $false }
  if ($tok -match '\.\.\.+["'')\]]?$') { return $false }          # ellipsis, keep going
  if ($tok -match '[.?!]+["'')\]]?$') {
    # a lone capital initial like "J." is not a sentence end
    if ($tok -match '^[A-Z]\.$') { return $false }
    return $true
  }
  return $false
}

$sentences = @()
$cur = @()
foreach ($w in $words) {
  $cur += $w
  if (EndsSentence $w.text) {
    $sentences += ,@($cur)
    $cur = @()
  }
}
if ($cur.Count -gt 0) { $sentences += ,@($cur) }   # trailing fragment, no final stop

# ---------- 3. shape + write ----------
$rows = @()
$n = 1
foreach ($grp in $sentences) {
  $txt = (($grp | ForEach-Object { $_.text }) -join ' ')
  $st  = [math]::Round([double]$grp[0].start, 3)
  $en  = [math]::Round([double]$grp[-1].end, 3)
  $rows += [pscustomobject]@{
    id    = "S$n"
    start = $st
    end   = $en
    dur   = [math]::Round($en - $st, 3)
    words = $grp.Count
    text  = $txt
  }
  $n++
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$jsonPath = Join-Path $OutDir "sentences.json"
[System.IO.File]::WriteAllText($jsonPath, (($rows | ConvertTo-Json -Depth 4) + "`n"), $utf8)

# a flat word list too, for image-audio-lint.ps1 (needs per-word times)
$wjson = $words | ForEach-Object { [pscustomobject]@{ text=$_.text; start=[math]::Round([double]$_.start,3); end=[math]::Round([double]$_.end,3) } }
$wordsPath = Join-Path $OutDir "words.json"
[System.IO.File]::WriteAllText($wordsPath, (($wjson | ConvertTo-Json -Depth 3) + "`n"), $utf8)

$md = New-Object System.Text.StringBuilder
[void]$md.AppendLine("# Sentence table")
[void]$md.AppendLine("")
[void]$md.AppendLine("Source: ``$([System.IO.Path]::GetFileName($srcPath))`` · $($rows.Count) sentences · audio ends $([math]::Round($rows[-1].end,2))s")
[void]$md.AppendLine("Generated $(Get-Date -Format 'yyyy-MM-dd HH:mm') by sentences.ps1. Do not hand-edit; regenerate.")
[void]$md.AppendLine("")
[void]$md.AppendLine("| id | start | end | dur | sentence |")
[void]$md.AppendLine("|---|---:|---:|---:|---|")
foreach ($r in $rows) {
  $line = "| " + $r.id + " | " + ('{0:N2}' -f $r.start) + " | " + ('{0:N2}' -f $r.end) + " | " + ('{0:N2}' -f $r.dur) + " | " + ($r.text -replace '\|','\|') + " |"
  [void]$md.AppendLine($line)
}
$mdPath = Join-Path $OutDir "sentences.md"
[System.IO.File]::WriteAllText($mdPath, $md.ToString(), $utf8)

Write-Host ("Sentences: {0}  ({1:N2}s audio)" -f $rows.Count, $rows[-1].end) -ForegroundColor Cyan
Write-Host ("  $jsonPath")
Write-Host ("  $mdPath")
