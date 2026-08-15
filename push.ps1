Set-Location "C:\Users\gdp\HyperFrames\_frames"
Remove-Item -Force mkrepo.ps1, diag.ps1, tok.ps1 -ErrorAction SilentlyContinue
"snapshots/`n*.mp4`n" | Out-File -FilePath .gitignore -Encoding ascii
git init -b main 2>&1 | Out-Null
git add -A
git -c user.name="Zoltan Gero" -c user.email="humorketing@gmail.com" commit -m "Brand frames: Capsule (Zoltan Gero) + Blue Professional (VoxFlow)" 2>&1 | Select-Object -Last 3
git remote remove origin 2>$null
git remote add origin https://github.com/YogiZoli/brand-frames.git
git push -u origin main 2>&1 | Select-Object -Last 5
Write-Output "--- files ---"
git ls-files
