<#
  blocks/build-video.ps1 — a scene list becomes the live video's index.html.

  PIPELINE step 5. Opus writes the scene list (step 4, the 3rd gate) as JSON:

    {
      "title": "One Sitting Workflow",
      "channel": "zoltan-gero",
      "audio": "assets/vo_bgm.mp3",
      "scenes": [
        { "block": "statement", "sent": "S1",
          "vars": { "kick": "THE PROMISE", "line1": "of this video", "line2": "ONE SITTING" } },
        { "block": "arrow", "sent": "S2-S3",
          "vars": { "leftLabel": "One idea", "rightLabel": "Published",
                    "leftIcon": "spark", "rightIcon": "visuals", "caption": "Not a draft" } },
        { "block": "lead-card", "sent": "S40", "sectionEnd": true, "vars": { ... } }
      ]
    }

  - `block`  — an archetype from CATALOG.md
  - `sent`   — the sentence anchor: "S12", a range "S12-S15", or a split "S20#1/3"
  - `vars`   — only the variables you want to change; the rest keep their default
  - `hold`   — optional, seconds to linger after the last sentence (last scene only)

  This writes zg-frames/index.html IN PLACE (the project root, so blocks/ and
  fonts/ resolve). The sampler is regenerable any time with assemble-sampler.ps1.
  After this: stamp-timing.ps1 fills data-start/data-duration from the audio.

  USAGE
    .\build-video.ps1 -Scenes ..\..\ai-video-workflow\scenes.json
    .\build-video.ps1 -Scenes scenes.json -Out ..\video-preview.html   # elsewhere
#>
param(
  [Parameter(Mandatory = $true)][string]$Scenes,
  [string]$Out = "../index.html"
)
$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
$repo = Split-Path $PSScriptRoot -Parent

$scenesPath = Resolve-Path $Scenes
$plan = Get-Content $scenesPath -Raw | ConvertFrom-Json
if (-not $plan.scenes) { throw "no 'scenes' array in $scenesPath" }

$fontFace = Get-Content (Join-Path $PSScriptRoot "_fontface.css") -Raw

# validate every block + flag unknown variable keys
$known = @{}
foreach ($sc in $plan.scenes) {
  $b = $sc.block
  if (-not $known.ContainsKey($b)) {
    $bf = Join-Path $PSScriptRoot "$b/$b.src.html"
    if (-not (Test-Path $bf)) { throw "scene uses unknown block '$b' — see blocks/CATALOG.md" }
    $m = [regex]::Match((Get-Content $bf -Raw), '(?s)<!--zg\s*(?<j>.*?)\s*zg-->')
    $meta = $m.Groups['j'].Value | ConvertFrom-Json
    $ids = @{}
    if ($meta.variables) { foreach ($v in $meta.variables) { $ids[$v.id] = $true } }
    $known[$b] = @{ meta = $meta; ids = $ids }
  }
  if ($sc.vars) {
    foreach ($k in $sc.vars.PSObject.Properties.Name) {
      if (-not $known[$b].ids.ContainsKey($k)) {
        Write-Warning ("scene '{0}' (sent {1}): '{2}' is not a variable of block '{0}'." -f $b, $sc.sent, $k)
      }
    }
  }
}

# Every mounted instance needs a UNIQUE data-composition-id: the runtime keys
# per-instance variables (and --css props) by it, and a repeated id makes them
# collide and fall back to defaults. So each scene gets its own composition file
# under compositions/, a byte copy of the generated block with only its id
# swapped. blocks/<name>/<name>.html stays the single source; this is a stamp.
$compDir = Join-Path $repo "compositions"
if (Test-Path $compDir) { Get-ChildItem $compDir -Filter "s*.html" | Remove-Item -Force }
New-Item -ItemType Directory -Force -Path $compDir | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)

$slots = New-Object System.Text.StringBuilder
$i = 0
foreach ($sc in $plan.scenes) {
  $i++
  $b = $sc.block
  $sid = ("s{0:d3}-{1}" -f $i, $b)
  $blockHtml = Get-Content (Join-Path $PSScriptRoot "$b/$b.html") -Raw
  $inst = $blockHtml.Replace("data-composition-id=""$b""", "data-composition-id=""$sid""").Replace("""$b"")", """$sid"")")
  [System.IO.File]::WriteAllText((Join-Path $compDir "$sid.html"), $inst, $utf8)

  $vv = if ($sc.vars) { ($sc.vars | ConvertTo-Json -Compress -Depth 6) } else { "{}" }
  $vv = $vv -replace "'", "&#39;"
  $secEnd = if ($sc.sectionEnd -or $known[$b].meta.sectionEnd) { " data-section-end" } else { "" }
  $hold = if ($sc.hold) { " data-hold=""$($sc.hold)""" } else { "" }
  $sent = if ($sc.sent) { $sc.sent } else { throw "scene $i ($b) has no 'sent' anchor" }
  [void]$slots.AppendLine(("  <div id=""$sid"" data-composition-id=""$sid"" data-composition-src=""compositions/$sid.html""" +
    " data-sent=""$sent"" data-track-index=""1"" data-width=""1920"" data-height=""1080""$secEnd$hold" +
    " data-variable-values='$vv'></div>"))
}

$audioTag = ""
if ($plan.audio) {
  $audioTag = "  <audio id=""vo"" src=""$($plan.audio)"" data-start=""0"" data-track-index=""10"" data-volume=""1""></audio>"
}

$title = if ($plan.title) { $plan.title } else { "zg-frames video" }
$doc = @"
<!doctype html>
<html lang="en" data-resolution="landscape">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=1920, height=1080"/>
<title>$title</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
$fontFace
  body{margin:0;background:#0b0f14;font-family:"Open Sans",system-ui,sans-serif}
  #root{position:relative;width:1920px;height:1080px;overflow:hidden}
  [data-composition-id="main"] > div[data-composition-src]{position:absolute;inset:0}
</style>
</head>
<body>
<!-- generated by build-video.ps1 from $($scenesPath.Path | Split-Path -Leaf).
     data-start / data-duration are filled by pipeline/stamp-timing.ps1 from the audio. -->
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="1">
$($slots.ToString().TrimEnd())
$audioTag
</div>
<script>
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = gsap.timeline({ paused: true });
</script>
</body>
</html>
"@

$outPath = Join-Path $PSScriptRoot $Out
[System.IO.File]::WriteAllText($outPath, $doc, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("wrote {0}  ({1} scenes)" -f $outPath, $plan.scenes.Count) -ForegroundColor Green
Write-Host "next: pipeline\stamp-timing.ps1 -Html index.html -Sentences <sentences.json>" -ForegroundColor DarkGray
