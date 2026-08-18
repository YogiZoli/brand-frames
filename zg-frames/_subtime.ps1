Set-Location $PSScriptRoot
$p = "index.html"
$s = Get-Content $p -Raw

# Minden .sub feliratot annyira hozunk elore, hogy kiolvashato legyen.
# A keplet: 0,5 mp elkapni + 0,4 mp szavankent. A felirat a jelenet CIMKEJE,
# nyugodtan johet koran; nem versenyez a tartalommal, mert kisebb es halvanyabb.
$rx = [regex]'(?s)<section id="(?<id>zg\d+)"[^>]*data-duration="(?<d>[\d.]+)".*?</section>'
$out = $rx.Replace($s, {
  param($m)
  $block = $m.Value
  $d = [double]$m.Groups['d'].Value
  $sub = [regex]::Match($block, '<div class="sub" data-anim="fi" data-at="(?<at>[\d.]+)"[^>]*>(?<t>[^<]*)</div>')
  if (-not $sub.Success) { return $block }
  $words = ($sub.Groups['t'].Value -split '\s+' | Where-Object { $_ }).Count
  $need = 0.5 + 0.4 * $words
  $latest = $d - $need - 0.34
  $at = [Math]::Round([Math]::Max(0.8, [Math]::Min([double]$sub.Groups['at'].Value, $latest)), 1)
  if ($latest -lt 0.8) {
    Write-Host ("MEG MINDIG SZUK {0}: {1} szo, {2:N1} mp kell, a jelenet {3} mp. Roviditeni kell." -f $m.Groups['id'].Value, $words, $need, $d)
  }
  $old = 'data-at="' + $sub.Groups['at'].Value + '"'
  $new = 'data-at="' + $at + '"'
  return $block.Replace($sub.Value, $sub.Value.Replace($old, $new))
})
Set-Content $p $out -NoNewline -Encoding UTF8
Write-Host "Feliratok idozitese ujraszamolva."
