Set-Location $PSScriptRoot
$p = "motion.js"
$s = Get-Content $p -Raw

# A 13 easingbol 4 lesz. A tolteset (E_FILL) mar kezzel beallitottuk a ring/gauge/cycle
# fuggvenyekben, azokat nem bantjuk: ott a "power1.out" szandekos muszer, nem stilus.
$map = @{
  'ease: "power4.out"'   = 'ease: E.enter'
  'ease: "power3.out"'   = 'ease: E.enter'
  'ease: "power2.out"'   = 'ease: E.enter'
  'ease: "power2.in"'    = 'ease: E.exit'
  'ease: "power2.inOut"' = 'ease: E.move'
  'ease: "power1.inOut"' = 'ease: E.move'
  'ease: "sine.inOut"'   = 'ease: E.move'
  'ease: "sine.out"'     = 'ease: E.enter'
  'ease: "back.out(1.8)"'= 'ease: E.pop'
  'ease: "back.out(1.7)"'= 'ease: E.pop'
  'ease: "back.out(1.6)"'= 'ease: E.pop'
  'ease: "back.out(1.5)"'= 'ease: E.pop'
}
foreach ($k in $map.Keys) { $s = $s.Replace($k, $map[$k]) }

# a toltes visszaallitasa a muszer-easingre, ott ahol szandekos
$s = $s.Replace('duration: d || 2.2, ease: E.enter }, at);', 'duration: d || 2.2, ease: E_FILL }, at);')
$s = $s.Replace('duration: d || 1.8, ease: E.enter }, at);', 'duration: d || 1.8, ease: E_FILL }, at);')

Set-Content $p $s -NoNewline -Encoding UTF8
Write-Host "kesz"
$m = Select-String -Path $p -Pattern 'ease:\s*(E\.\w+|E_FILL|"[^"]+")' -AllMatches
$m.Matches | ForEach-Object { $_.Groups[1].Value } | Group-Object |
  Sort-Object Count -Descending | Format-Table Count, Name -AutoSize
