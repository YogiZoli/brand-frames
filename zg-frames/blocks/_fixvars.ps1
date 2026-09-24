# _fixvars.ps1 — one-off: hand-wire the data-vars that add-vars.ps1's leaf-only
# regex cannot reach (elements with nested icon/emphasis spans). Per-block
# literal substitutions + variable declarations. Run once, then build.mjs.
Set-Location $PSScriptRoot

# each entry: block, @( @{find=..; repl=..}, ... ), @( "id|label|default", ... )
$JOBS = @(
  @{ b="keyword-pill"
     subs=@(
       @{f='<div class="cpill" data-anim="pop" data-at=".35" data-pulse="2.2"><span class="cpic"></span>Comment the keyword</div>';
         r='<div class="cpill" data-anim="pop" data-at=".35" data-pulse="2.2" data-vars=''{"text":"prompt"}''><span class="cpic"></span>Comment the keyword</div>'}
       @{f='<span class="ico" data-icon="script"></span></span>Comment <i>GUIDE</i> below</div>';
         r='<span class="ico" data-icon="script"></span></span><span data-vars=''{"text":"opt1"}''>Comment GUIDE below</span></div>'}
       @{f='<span class="ico" data-icon="visuals"></span></span>Comment <i>COURSE</i> below</div>';
         r='<span class="ico" data-icon="visuals"></span></span><span data-vars=''{"text":"opt2"}''>Comment COURSE below</span></div>'}
       @{f='<span class="ico" data-icon="tag"></span></span>Comment <i>TRIGGER</i> below</div>';
         r='<span class="ico" data-icon="tag"></span></span><span data-vars=''{"text":"opt3"}''>Comment TRIGGER below</span></div>'}
     )
     vars=@("prompt|Pill prompt|Comment the keyword","opt1|Route 1|Comment GUIDE below","opt2|Route 2|Comment COURSE below","opt3|Route 3|Comment TRIGGER below") }

  @{ b="funnel"
     subs=@(
       @{f='<span class="fnl-l">Watched the video</span><span class="fnl-r">100%</span>'; r='<span class="fnl-l" data-vars=''{"text":"s1l"}''>Watched the video</span><span class="fnl-r" data-vars=''{"text":"s1r"}''>100%</span>'}
       @{f='<span class="fnl-l">Left a comment</span><span class="fnl-r">18%</span>'; r='<span class="fnl-l" data-vars=''{"text":"s2l"}''>Left a comment</span><span class="fnl-r" data-vars=''{"text":"s2r"}''>18%</span>'}
       @{f='<span class="fnl-l">Opened the guide</span><span class="fnl-r">11%</span>'; r='<span class="fnl-l" data-vars=''{"text":"s3l"}''>Opened the guide</span><span class="fnl-r" data-vars=''{"text":"s3r"}''>11%</span>'}
       @{f='<span class="fnl-l">On the list</span><span class="fnl-r">9%</span>'; r='<span class="fnl-l" data-vars=''{"text":"s4l"}''>On the list</span><span class="fnl-r" data-vars=''{"text":"s4r"}''>9%</span>'}
     )
     vars=@("s1l|Stage 1|Watched the video","s1r|Stage 1 value|100%","s2l|Stage 2|Left a comment","s2r|Stage 2 value|18%","s3l|Stage 3|Opened the guide","s3r|Stage 3 value|11%","s4l|Stage 4|On the list","s4r|Stage 4 value|9%") }

  @{ b="proportion-bars"
     subs=@(
       @{f='<span class="fl">NARRATION</span><span class="fr">leads</span>'; r='<span class="fl" data-vars=''{"text":"bar1"}''>NARRATION</span><span class="fr" data-vars=''{"text":"bar1r"}''>leads</span>'}
       @{f='<span class="fl">MUSIC</span><span class="fr">quiet</span>'; r='<span class="fl" data-vars=''{"text":"bar2"}''>MUSIC</span><span class="fr" data-vars=''{"text":"bar2r"}''>quiet</span>'}
     )
     vars=@("bar1|Wide bar label|NARRATION","bar1r|Wide bar note|leads","bar2|Narrow bar label|MUSIC","bar2r|Narrow bar note|quiet") }

  @{ b="countup-bars"
     subs=@(
       @{f='<div class="blbl">Video length</div>'; r='<div class="blbl" data-vars=''{"text":"lbl1"}''>Video length</div>'}
       @{f='<span class="bbadge ongreen" data-anim="pop" data-at="3.2" data-pulse="3.6">measured</span>'; r='<span class="bbadge ongreen" data-anim="pop" data-at="3.2" data-pulse="3.6" data-vars=''{"text":"badge"}''>measured</span>'}
       @{f='<div class="blbl">Machine time</div>'; r='<div class="blbl" data-vars=''{"text":"lbl2"}''>Machine time</div>'}
       @{f='data-val="30" data-suffix="s"'; r='data-val="30" data-suffix="s" data-vars=''{"data-val":"v1","data-suffix":"suf1"}'''}
       @{f='data-val="54" data-suffix="s"'; r='data-val="54" data-suffix="s" data-vars=''{"data-val":"v2","data-suffix":"suf2"}'''}
     )
     vars=@("lbl1|Left bar label|Video length","lbl2|Right bar label|Machine time","badge|Badge on right bar|measured","v1|Left value|30","suf1|Left suffix|s","v2|Right value|54","suf2|Right suffix|s") }

  @{ b="contact-record"
     subs=@(
       @{f='<div class="recn">Alex Rivers</div><div class="recr">new lead</div>'; r='<div class="recn" data-vars=''{"text":"name"}''>Alex Rivers</div><div class="recr" data-vars=''{"text":"status"}''>new lead</div>'}
       @{f='<div class="recpill">ACTIVE</div>'; r='<div class="recpill" data-vars=''{"text":"pill"}''>ACTIVE</div>'}
       @{f='<div class="reck">Email</div><div class="recv">alex@example.com</div>'; r='<div class="reck" data-vars=''{"text":"k1"}''>Email</div><div class="recv" data-vars=''{"text":"v1"}''>alex@example.com</div>'}
       @{f='<div class="reck">Source</div><div class="recv">Comment · GUIDE</div>'; r='<div class="reck" data-vars=''{"text":"k2"}''>Source</div><div class="recv" data-vars=''{"text":"v2"}''>Comment · GUIDE</div>'}
       @{f='<div class="reck">Temperature</div><div class="recv">Warm to hot</div>'; r='<div class="reck" data-vars=''{"text":"k3"}''>Temperature</div><div class="recv" data-vars=''{"text":"v3"}''>Warm to hot</div>'}
     )
     vars=@("name|Record name|Alex Rivers","status|Record status|new lead","pill|Header pill|ACTIVE","k1|Row 1 key|Email","v1|Row 1 value|alex@example.com","k2|Row 2 key|Source","v2|Row 2 value|Comment · GUIDE","k3|Row 3 key|Temperature","v3|Row 3 value|Warm to hot") }

  @{ b="branch"
     subs=@(
       @{f='<div class="brroot">A comment arrives</div>'; r='<div class="brroot" data-vars=''{"text":"root"}''>A comment arrives</div>'}
       @{f='<span class="ico" data-glyph="check"></span></span>Keyword matched &rarr; guide sent</div>'; r='<span class="ico" data-glyph="check"></span></span><span data-vars=''{"text":"win"}''>Keyword matched &rarr; guide sent</span></div>'}
       @{f='<span class="ico" data-glyph="dash"></span></span>No keyword &rarr; simple reply</div>'; r='<span class="ico" data-glyph="dash"></span></span><span data-vars=''{"text":"lose"}''>No keyword &rarr; simple reply</span></div>'}
     )
     vars=@("root|Branch root|A comment arrives","win|Taken path|Keyword matched, guide sent","lose|Other path|No keyword, simple reply") }

  @{ b="cycle"
     subs=@(
       @{f='<span class="t">The flywheel</span><span class="s">no start, no end</span>'; r='<span class="t" data-vars=''{"text":"centre"}''>The flywheel</span><span class="s" data-vars=''{"text":"centreSub"}''>no start, no end</span>'}
       @{f='<span class="cyclbl" style="left:470px;top:14px">Publish</span>'; r='<span class="cyclbl" style="left:470px;top:14px" data-vars=''{"text":"n1"}''>Publish</span>'}
       @{f='<span class="cyclbl" style="left:566px;top:436px">Comment</span>'; r='<span class="cyclbl" style="left:566px;top:436px" data-vars=''{"text":"n2"}''>Comment</span>'}
       @{f='<span class="cyclbl" style="left:76px;top:436px">Guide sent</span>'; r='<span class="cyclbl" style="left:76px;top:436px" data-vars=''{"text":"n3"}''>Guide sent</span>'}
       @{f='<span class="cyclbl" style="left:60px;top:14px">Next topic</span>'; r='<span class="cyclbl" style="left:60px;top:14px" data-vars=''{"text":"n4"}''>Next topic</span>'}
     )
     vars=@("centre|Centre label|The flywheel","centreSub|Centre sub|no start, no end","n1|Node 1|Publish","n2|Node 2|Comment","n3|Node 3|Guide sent","n4|Node 4|Next topic") }

  @{ b="gauge"
     subs=@(
       @{f='data-pct="72">'; r='data-pct="72" data-vars=''{"data-pct":"pct"}''>'}
       @{f='<div class="gnum" data-val="72" data-suffix="%">0</div>'; r='<div class="gnum" data-val="72" data-suffix="%" data-vars=''{"data-val":"pct"}''>0</div>'}
     )
     vars=@("pct|Percent (0-100)|72") }

  @{ b="command"
     subs=@(
       @{f='<span class="cmdttl">terminal</span>'; r='<span class="cmdttl" data-vars=''{"text":"title"}''>terminal</span>'}
       @{f='<span class="cmdk">hyperframes</span> check</div>'; r='<span class="cmdk">hyperframes</span> <span data-vars=''{"text":"cmd1"}''>check</span></div>'}
       @{f='<div class="cmdline cmdout" data-anim="fi" data-at="1.6">0 errors &middot; 0 warnings</div>'; r='<div class="cmdline cmdout" data-anim="fi" data-at="1.6" data-vars=''{"text":"out1"}''>0 errors &middot; 0 warnings</div>'}
     )
     vars=@("title|Terminal title|terminal","cmd1|First command args|check","out1|Output line|0 errors, 0 warnings") }

  @{ b="grid"
     subs=@()
     vars=@() }

  @{ b="line-chart"
     subs=@(
       @{f='<text class="cx" x="30" y="462">month 1</text>'; r='<text class="cx" x="30" y="462" data-vars=''{"text":"xStart"}''>month 1</text>'}
       @{f='<text class="cx" x="1440" y="462">month 12</text>'; r='<text class="cx" x="1440" y="462" data-vars=''{"text":"xEnd"}''>month 12</text>'}
     )
     vars=@("xStart|X axis start|month 1","xEnd|X axis end|month 12") }

  @{ b="lead-card"
     subs=@(
       @{f='<div class="leadn" data-anim="fi" data-at=".7">Alex Rivers</div>'; r='<div class="leadn" data-anim="fi" data-at=".7" data-vars=''{"text":"name"}''>Alex Rivers</div>'}
       @{f='<div class="leadr" data-anim="fi" data-at=".95">Course creator &middot; 4 months in</div>'; r='<div class="leadr" data-anim="fi" data-at=".95" data-vars=''{"text":"role"}''>Course creator &middot; 4 months in</div>'}
       @{f='<span class="ltag">commented GUIDE</span>'; r='<span class="ltag" data-vars=''{"text":"tag1"}''>commented GUIDE</span>'}
       @{f='<span class="ltag">opened twice</span>'; r='<span class="ltag" data-vars=''{"text":"tag2"}''>opened twice</span>'}
       @{f='<span class="ltag g">replied</span>'; r='<span class="ltag g" data-vars=''{"text":"tag3"}''>replied</span>'}
       @{f='data-val="86">0</div>'; r='data-val="86" data-vars=''{"data-val":"score"}''>0</div>'}
       @{f='<div class="k">ready</div>'; r='<div class="k" data-vars=''{"text":"scoreLabel"}''>ready</div>'}
     )
     vars=@("name|Person name|Alex Rivers","role|Person role|Course creator, 4 months in","tag1|Tag 1|commented GUIDE","tag2|Tag 2|opened twice","tag3|Tag 3|replied","score|Score number|86","scoreLabel|Score label|ready") }

  @{ b="form"
     subs=@(
       @{f='<div class="fh">Get the guide</div>'; r='<div class="fh" data-vars=''{"text":"heading"}''>Get the guide</div>'}
       @{f='<div class="fhs">Enter your details and it arrives in a minute.</div>'; r='<div class="fhs" data-vars=''{"text":"subheading"}''>Enter your details and it arrives in a minute.</div>'}
       @{f='data-val="Alex Rivers"'; r='data-val="Alex Rivers" data-vars=''{"data-val":"field1"}'''}
       @{f='data-val="alex@example.com"'; r='data-val="alex@example.com" data-vars=''{"data-val":"field2"}'''}
       @{f='<div class="fbtn" data-pulse="4.4">Send it to me</div>'; r='<div class="fbtn" data-pulse="4.4" data-vars=''{"text":"button"}''>Send it to me</div>'}
     )
     vars=@("heading|Form heading|Get the guide","subheading|Form subheading|Enter your details and it arrives in a minute.","field1|Name field value|Alex Rivers","field2|Email field value|alex@example.com","button|Submit button|Send it to me") }

  @{ b="progress-ring"
     subs=@(
       @{f='<div class="ringface"><span class="ico" data-icon="clock"></span></div></div><div class="plbl">Time</div>'; r='<div class="ringface"><span class="ico" data-icon="clock"></span></div></div><div class="plbl" data-vars=''{"text":"lbl1"}''>Time</div>'}
       @{f='<div class="ringface"><span class="ico" data-icon="money"></span></div></div><div class="plbl">Money</div>'; r='<div class="ringface"><span class="ico" data-icon="money"></span></div></div><div class="plbl" data-vars=''{"text":"lbl2"}''>Money</div>'}
       @{f='<div class="ringface"><span class="ico" data-icon="place"></span></div></div><div class="plbl">Location</div>'; r='<div class="ringface"><span class="ico" data-icon="place"></span></div></div><div class="plbl" data-vars=''{"text":"lbl3"}''>Location</div>'}
     )
     vars=@("lbl1|Ring 1 label|Time","lbl2|Ring 2 label|Money","lbl3|Ring 3 label|Location") }

  @{ b="pulse-ring"
     subs=@(
       @{f='<span class="ico" data-icon="clock"></span><span class="prsame" data-anim="pring" data-at=".9" data-dur="2.4"></span></div><div class="ilbl">Waiting</div>'; r='<span class="ico" data-icon="clock"></span><span class="prsame" data-anim="pring" data-at=".9" data-dur="2.4"></span></div><div class="ilbl" data-vars=''{"text":"lbl1"}''>Waiting</div>'}
       @{f='<span class="ico" data-icon="spark"></span><span class="prsame" data-anim="pring" data-at="1.3" data-dur="2"></span></div><div class="ilbl">Active</div>'; r='<span class="ico" data-icon="spark"></span><span class="prsame" data-anim="pring" data-at="1.3" data-dur="2"></span></div><div class="ilbl" data-vars=''{"text":"lbl2"}''>Active</div>'}
     )
     vars=@("lbl1|Left label|Waiting","lbl2|Right label|Active") }

  @{ b="skitch-markers"
     subs=@(
       @{f='<div class="skcap">wrong</div>'; r='<div class="skcap" data-vars=''{"text":"c1"}''>wrong</div>'}
       @{f='<div class="skcap">question</div>'; r='<div class="skcap" data-vars=''{"text":"c2"}''>question</div>'}
       @{f='<div class="skcap">watch out</div>'; r='<div class="skcap" data-vars=''{"text":"c3"}''>watch out</div>'}
       @{f='<div class="skcap">approved</div>'; r='<div class="skcap" data-vars=''{"text":"c4"}''>approved</div>'}
       @{f='<div class="skcap">loved</div>'; r='<div class="skcap" data-vars=''{"text":"c5"}''>loved</div>'}
     )
     vars=@("c1|Marker 1|wrong","c2|Marker 2|question","c3|Marker 3|watch out","c4|Marker 4|approved","c5|Marker 5|loved") }

  @{ b="state-flip"
     subs=@(
       @{f='font-size:50px;opacity:0">YES</div>'; r='font-size:50px;opacity:0" data-vars=''{"text":"flipTo"}''>YES</div>'}
     )
     vars=@("flipTo|Flipped state text|YES") }

  @{ b="overlay-callout"
     subs=@(
       @{f='data-anim="fadewords" data-at=".5" data-dur="1.6">Move approval in front of execution</div>'; r='data-anim="fadewords" data-at=".5" data-dur="1.6" data-vars=''{"text":"headline"}''>Move approval in front of execution</div>'}
     )
     vars=@("headline|Overlay headline|Move approval in front of execution") }

  @{ b="overlay-quote"
     subs=@(
       @{f='data-anim="fadewords" data-at=".5" data-dur="2">"The judgment is mine. What changed is <b>when it arrives</b>."</div>'; r='data-anim="fadewords" data-at=".5" data-dur="2" data-vars=''{"text":"quote"}''>"The judgment is mine. What changed is when it arrives."</div>'}
     )
     vars=@("quote|Pull quote|The judgment is mine. What changed is when it arrives.") }

  @{ b="overlay-lower-third"
     subs=@()
     vars=@() }
)

foreach ($j in $JOBS) {
  $f = Join-Path $PSScriptRoot "$($j.b)/$($j.b).src.html"
  if (-not (Test-Path $f)) { Write-Warning "no $($j.b)"; continue }
  $s = Get-Content $f -Raw
  $orig = $s
  foreach ($sub in $j.subs) {
    if ($s.Contains($sub.f)) { $s = $s.Replace($sub.f, $sub.r) }
    else { Write-Warning "$($j.b): pattern not found: $($sub.f.Substring(0,[Math]::Min(50,$sub.f.Length)))" }
  }
  # merge vars into meta header
  if ($j.vars.Count) {
    $mh = [regex]::Match($s, '(?s)^<!--zg\s*(?<j>.*?)\s*zg-->\r?\n(?<body>.*)$')
    $meta = $mh.Groups['j'].Value | ConvertFrom-Json
    $have = @{}; $arr = New-Object System.Collections.ArrayList
    if ($meta.variables) { foreach ($v in $meta.variables) { $have[$v.id]=$true; [void]$arr.Add([ordered]@{id=$v.id;type=$v.type;label=$v.label;default=$v.default}) } }
    foreach ($spec in $j.vars) {
      $p = $spec -split '\|'
      if (-not $have.ContainsKey($p[0])) { [void]$arr.Add([ordered]@{id=$p[0];type="string";label=$p[1];default=$p[2]}); $have[$p[0]]=$true }
    }
    $vlines = ($arr | ForEach-Object { "    " + ($_ | ConvertTo-Json -Compress -Depth 4) }) -join ",`n"
    $head = "{ ""id"":""$($meta.id)"", ""duration"":$($meta.duration), ""camClass"":""$($meta.camClass)"""
    if ($meta.sectionEnd) { $head += ", ""sectionEnd"":true" }
    $s = "<!--zg`n$head,`n  ""variables"":[`n$vlines`n  ] }`nzg-->`n" + $mh.Groups['body'].Value
  }
  if ($s -ne $orig) {
    [System.IO.File]::WriteAllText($f, $s, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "fixed $($j.b)"
  }
}
Write-Host "`ndone. run build.mjs"
