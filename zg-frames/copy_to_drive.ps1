# Every finished render lands in Drive automatically (PIPELINE step 8).
# The Drive folder name contains an emoji, so this must NOT live in a .bat file.
$src  = "C:\Users\gdp\HyperFrames\_frames\zg-frames"
$dest = Get-ChildItem "C:\Users\gdp\My Drive" -Directory |
        Where-Object { $_.Name -like "*YouTube*Content*" } | Select-Object -First 1
if (-not $dest) { Write-Host "Drive folder not found"; exit 1 }
$out = Join-Path $dest.FullName "zg-frames"
New-Item -ItemType Directory -Force -Path $out | Out-Null
Get-ChildItem $src -Filter "sampler_v*.mp4" | ForEach-Object {
  Copy-Item $_.FullName -Destination $out -Force
}
Get-ChildItem $src -Filter "_sheet1*.jpg" | ForEach-Object {
  Copy-Item $_.FullName -Destination $out -Force
}
Get-ChildItem $src -Filter "_ring16.jpg","_skitch16.jpg","_lens16.jpg" -ErrorAction SilentlyContinue |
  ForEach-Object { Copy-Item $_.FullName -Destination $out -Force }
if (Test-Path "$src\_regress\regress-report.md") {
  Copy-Item "$src\_regress\regress-report.md" "$out\regress-report.md" -Force
}
Write-Host ""
Write-Host "Fajlok"
Write-Host "  Mappa (local):  $src"
Write-Host "  Mappa (Drive):  $out"
Write-Host "  Megnyitas:      explorer.exe `"$out`""
