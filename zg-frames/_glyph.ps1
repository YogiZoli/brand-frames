Set-Location $PSScriptRoot
$p = "index.html"
$s = Get-Content $p -Raw

# "Ikon, nem betu" a jelentest hordozo JELEKRE is. Ami maradt: a panel-lista
# figyelmezteto zaszloi es az allapotvalto kerdojele.
$s = $s.Replace('<span class="pflag">!</span>', '<span class="pflag"><span class="ico" data-glyph="bang"></span></span>')
$s = $s.Replace('<span class="pflag">&#10003;</span>', '<span class="pflag ok"><span class="ico" data-glyph="check"></span></span>')
$s = $s.Replace('font-size:78px">?</div>', 'font-size:78px"><span class="ico" data-glyph="query"></span></div>')

Set-Content $p $s -NoNewline -Encoding UTF8
$left = (Select-String -Path $p -Pattern '&#\d+;' -AllMatches | Measure-Object).Count
Write-Host ("Font-karakter jelek maradtak: {0} sorban" -f $left)
Select-String -Path $p -Pattern '&#\d+;' -AllMatches | ForEach-Object { Write-Host ("  sor " + $PSItem.LineNumber) }
