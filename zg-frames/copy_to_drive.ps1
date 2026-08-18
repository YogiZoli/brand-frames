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
if (Test-Path "$src\_sheet15.jpg") { Copy-Item "$src\_sheet15.jpg" "$out\kontaktlap_v1.5.jpg" -Force }
Write-Host "copied to $out"
