<#
  blocks/add-vars.ps1 — wire a text-variable surface into every block source.

  For a live video, build-video.mjs mounts a block and passes per-scene text via
  data-variable-values. That needs each block to declare the variables and carry
  data-var-text on its text leaves. This does it once, mechanically, from a
  class -> variable-id map. Only clean leaf text elements are auto-wired;
  elements with nested spans are left for hand-wiring. Hand-authored variables
  already in a meta header (lens lensPath, arrow leftIcon) are preserved.

  Idempotent (an element with data-var-text is skipped). Re-run, then build.mjs.
#>
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

$MAP = @(
  @{ cls="kick";    id="kick";       num=$false; label="Kicker" }
  @{ cls="sub";     id="subcap";        num=$false; label="Sub caption" }
  @{ cls="gcap";    id="subcap";        num=$false; label="Caption" }
  @{ cls="title";   id="line";       num=$true;  label="Line" }
  @{ cls="ectitle"; id="line";       num=$true;  label="Title line" }
  @{ cls="qline";   id="line1";      num=$false; label="Question" }
  @{ cls="disp";    id="word";       num=$false; label="Display word" }
  @{ cls="bigw";    id="word2";      num=$false; label="Emphasis word" }
  @{ cls="ptitle";  id="panelTitle"; num=$false; label="Panel title" }
  @{ cls="scl";     id="item";       num=$true;  label="Card text" }
  @{ cls="tl";      id="item";       num=$true;  label="Tile label" }
  @{ cls="rlbl";    id="r";          num=$true;  label="Rail stop" }
  @{ cls="ecpill";  id="line2";      num=$false; label="Pill line" }
  @{ cls="ecbtn";   id="cta";        num=$false; label="CTA button" }
  @{ cls="cpill";   id="line1";      num=$false; label="Pill text" }
  @{ cls="callout"; id="callout";    num=$false; label="Callout" }
  @{ cls="qname";   id="author";     num=$false; label="Author" }
  @{ cls="qrole";   id="authorRole"; num=$false; label="Author role" }
  @{ cls="l3n";     id="name";       num=$false; label="Lower-third name" }
  @{ cls="l3r";     id="role";       num=$false; label="Lower-third role" }
)

function HtmlText([string]$s) { ($s -replace '<[^>]+>','' -replace '\s+',' ').Trim() }

$changed = 0
foreach ($d in Get-ChildItem -Directory) {
  $f = Join-Path $d.FullName "$($d.Name).src.html"
  if (-not (Test-Path $f)) { continue }
  $raw = Get-Content $f -Raw
  $mh = [regex]::Match($raw, '(?s)^<!--zg\s*(?<j>.*?)\s*zg-->\r?\n(?<body>.*)$')
  if (-not $mh.Success) { Write-Warning "$($d.Name): no meta header"; continue }
  $meta = $mh.Groups['j'].Value | ConvertFrom-Json
  $body = $mh.Groups['body'].Value

  $vars = New-Object System.Collections.ArrayList
  $have = @{}
  if ($meta.variables) {
    foreach ($v in $meta.variables) {
      [void]$vars.Add([ordered]@{ id=$v.id; type=$v.type; label=$v.label; default=$v.default })
      $have[$v.id] = $true
    }
  }

  $counts = @{}
  foreach ($mrow in $MAP) {
    $cls = $mrow.cls; $base = $mrow.id; $numbered = $mrow.num; $label = $mrow.label
    # skip elements already carrying a var binding. inner content may be plain
    # text or one level of inline emphasis (<em>/<b>/<i>); anything deeper is skipped.
    $rx = [regex]("(?<open><(?:div|span)\b(?![^>]*data-vars=)[^>]*class=""[^""]*\b" + [regex]::Escape($cls) + "\b[^""]*""[^>]*>)(?<txt>(?:[^<]|</?(?:em|b|i)\b[^>]*>)*?)(?<close></(?:div|span)>)")
    $body = $rx.Replace($body, {
      param($mm)
      $txt = $mm.Groups['txt'].Value
      if ([string]::IsNullOrWhiteSpace($txt)) { return $mm.Value }
      if ($numbered) {
        if (-not $counts.ContainsKey($base)) { $counts[$base] = 0 }
        $counts[$base]++
        $vid = "$base$($counts[$base])"; $lbl = "$label $($counts[$base])"
      } else { $vid = $base; $lbl = $label }
      if (-not $have.ContainsKey($vid)) {
        [void]$vars.Add([ordered]@{ id=$vid; type="string"; label=$lbl; default=(HtmlText $txt) })
        $have[$vid] = $true
      }
      # data-vars text pseudo-attr — set via ZG.applyVars BEFORE any char/word split
      $open = $mm.Groups['open'].Value -replace '>$', (" data-vars='{""text"":""$vid""}'>")
      $open + $txt + $mm.Groups['close'].Value
    })
  }

  $metaObj = [ordered]@{ id=$meta.id; duration=$meta.duration; camClass=$meta.camClass }
  if ($meta.sectionEnd) { $metaObj.sectionEnd = $true }
  $metaObj.variables = $vars.ToArray()
  # one var per line: readable, and no nested-brace trap for the header parser
  $vlines = ($vars | ForEach-Object { "    " + ($_ | ConvertTo-Json -Compress -Depth 4) }) -join ",`n"
  $head = "{ ""id"":""$($meta.id)"", ""duration"":$($meta.duration), ""camClass"":""$($meta.camClass)"""
  if ($meta.sectionEnd) { $head += ", ""sectionEnd"":true" }
  $out = "<!--zg`n$head,`n  ""variables"":[`n$vlines`n  ] }`nzg-->`n" + $body

  if ($out -ne $raw) {
    [System.IO.File]::WriteAllText($f, $out, (New-Object System.Text.UTF8Encoding($false)))
    $changed++
    Write-Host ("{0}: {1} vars" -f $d.Name, $vars.Count)
  }
}
Write-Host ""
Write-Host "$changed block source(s) updated. Now: build.mjs" -ForegroundColor Green
