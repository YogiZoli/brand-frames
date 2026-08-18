Set-Location $PSScriptRoot
Write-Host ("Most: " + (Get-Date -Format 'HH:mm:ss'))
$log = Get-Item render.log -ErrorAction SilentlyContinue
if ($log) { Write-Host ("render.log utolso irasa: " + $log.LastWriteTime.ToString('HH:mm:ss')) }
Write-Host "--- render.log utolso sora ---"
Get-Content render.log -Tail 1 -ErrorAction SilentlyContinue
$mp = Get-Item sampler_v1.7.mp4 -ErrorAction SilentlyContinue
if ($mp) { Write-Host ("sampler_v1.7.mp4: " + [Math]::Round($mp.Length/1MB,1) + " MB") }
else { Write-Host "sampler_v1.7.mp4: meg nincs (render fut)" }
