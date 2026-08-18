Set-Location $PSScriptRoot
$terms = @('tabular-nums','text-wrap','oklch','hanging-punctuation','balance','font-weight:700','font-weight:600')
Write-Host "=== zg.css ==="
foreach ($t in $terms) {
  $n = (Select-String -Path zg.css -Pattern $t -SimpleMatch -AllMatches | Measure-Object).Count
  Write-Host ("{0,-24} {1}" -f $t, $n)
}
Write-Host ""
Write-Host "=== easing tokenek a motion.js-ben ==="
$m = Select-String -Path motion.js -Pattern 'ease:\s*"([^"]+)"' -AllMatches
$m.Matches | ForEach-Object { $_.Groups[1].Value } | Group-Object |
  Sort-Object Count -Descending | Format-Table Count, Name -AutoSize
Write-Host "=== readable anim hasznalatban? ==="
(Select-String -Path index.html -Pattern 'readable' -SimpleMatch -AllMatches | Measure-Object).Count
