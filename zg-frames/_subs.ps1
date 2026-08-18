Set-Location $PSScriptRoot
$p = "index.html"
$s = Get-Content $p -Raw

# Az olvasasi ido audit 28 feliratot bukott meg. A javitas NEM a jelenetek
# nyujtasa, hanem a felirat rovidebbre irasa: a sajat szabalyunk is azt mondja,
# hogy legfeljebb hat szo kerulhet a kepre. A felirat korabban is jon be.
$fix = @(
  @('data-at="2.2">Navy sets it up, blue lands it.',        'data-at="1.5">Navy sets up. Blue lands.'),
  @('data-at="3.2">Starts blurry, finishes sharp. One per film.','data-at="2.6">Blurry in. Sharp out.'),
  @('data-at="2.4">Per-character rise, then the rule draws.', 'data-at="1.9">Letters rise. Rule draws.'),
  @('data-at="2.1">Chapter marker between sections.',        'data-at="1.5">A chapter marker.'),
  @('data-at="3.4">Icon, then the line fills, then both pulse.','data-at="2.6">Icon. Line. Pulse.'),
  @('data-at="3.6">Fills step by step. Last stop turns green and pulses.','data-at="2.8">Step by step. Last one lands.'),
  @('data-at="2.6">Width carries the ratio.',                'data-at="1.9">Width is the ratio.'),
  @('data-at="3.4">One by one, then the last one grows.',    'data-at="2.6">One by one. Last one grows.'),
  @('data-at="3.4">Rows arrive one by one. The hot row is green.','data-at="2.6">Rows arrive one by one.'),
  @('data-at="3.9">Dots land as the line arrives. Green end point.','data-at="3.0">Dots land with the line.'),
  @('data-at="4.6">The glass goes blank while it travels. It never shows a word it is not standing on.','data-at="3.6">Blank while it travels.'),
  @('data-at="3.5">A real record. Rows never all appear at once.','data-at="2.7">A real record, row by row.'),
  @('data-at="4.2">Zero to full, then it stops. No spinning.','data-at="3.4">Zero to full. Then it stops.'),
  @('data-at="2.6">The ring matches the circle. It only breathes.','data-at="1.9">Same size. It only breathes.'),
  @('data-at="3.4">HF renders this with alpha. The footage never re-encodes.','data-at="2.6">Your footage never re-encodes.'),
  @('data-at="2">Approve the motion once. Every video inherits it.','data-at="1.6">Approve once. Every video inherits.'),
  @('data-at="2.6">The band swipes in like a marker pen.','data-at="2.0">Swipes in like a marker.'),
  @('data-at="3.2">Drawn glyphs on the same grid as every icon. Never a font character.','data-at="2.4">Drawn glyphs. Never a font.'),
  @('data-at="2.6">The ring closes. One per section end &mdash; the house gesture.','data-at="2.2">The ring closes. The house gesture.'),
  @('data-at="3.6">One line splits. Only the taken path stays bright.','data-at="2.8">Only the taken path stays bright.'),
  @('data-at="3.4">Width is the number. The last stage is the one that pays.','data-at="2.6">The last stage is the one that pays.'),
  @('data-at="3.8">It draws once round, then stops. A loop is not a spinner.','data-at="3.0">Once round. A loop is not a spinner.'),
  @('data-at="3.6">The needle and the number move together, then settle.','data-at="2.8">Needle and number move together.'),
  @('data-at="3.4">One wipe carries the whole comparison.','data-at="2.4">One wipe carries the comparison.'),
  @('data-at="3.8">Exactly what you type. Never a screenshot of a terminal.','data-at="3.0">Exactly what you type.'),
  @('data-at="3.6">A number on a list is not a person. This is.','data-at="2.8">Not a number. A person.')
)
$hit = 0
foreach ($f in $fix) {
  if ($s.Contains($f[0])) { $s = $s.Replace($f[0], $f[1]); $hit++ }
  else { Write-Host ("NEM TALALT: " + $f[0].Substring(0, [Math]::Min(60, $f[0].Length))) }
}

# zg34 idezet es zg35 kerdes: ezek nem feliratok, hanem a jelenet TARTALMA.
# Ott nem roviditeni kell, hanem idot adni. Ket jelenet fel masodperccel hosszabb.
$s = $s.Replace('id="zg34" class="clip" data-start="162" data-duration="5"','id="zg34" class="clip" data-start="162" data-duration="6"')
$s = $s.Replace('id="zg35" class="clip" data-start="167" data-duration="4.5"','id="zg35" class="clip" data-start="168" data-duration="5.5"')
$s = $s.Replace('id="zg36" class="clip" data-start="171.5"','id="zg36" class="clip" data-start="173.5"')
$s = $s.Replace('id="zg37" class="clip" data-start="176.5"','id="zg37" class="clip" data-start="178.5"')
$s = $s.Replace('id="zg38" class="clip" data-start="181.5"','id="zg38" class="clip" data-start="183.5"')
$s = $s.Replace('id="zg39" class="clip" data-start="187"','id="zg39" class="clip" data-start="189"')
$s = $s.Replace('data-duration="192"','data-duration="194"')

# kontraszt: zold szoveg feher lapon a -700 fokozatot kapja, nem az -500-at
$s = $s.Replace('data-suffix="s" style="color:var(--green)"','data-suffix="s" style="color:var(--green-700)"')

Set-Content $p $s -NoNewline -Encoding UTF8
Write-Host ("Felirat javitva: {0} / {1}" -f $hit, $fix.Count)
