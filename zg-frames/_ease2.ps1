Set-Location $PSScriptRoot
$p = "motion.js"
$s = Get-Content $p -Raw
$s = $s.Replace('ease: "power1.out"', 'ease: E_FILL')
Set-Content $p $s -NoNewline -Encoding UTF8
$m = Select-String -Path $p -Pattern 'ease:\s*(E\.\w+|E_FILL|"[^"]+")' -AllMatches
$m.Matches | ForEach-Object { $_.Groups[1].Value } | Group-Object |
  Sort-Object Count -Descending | Format-Table Count, Name -AutoSize
