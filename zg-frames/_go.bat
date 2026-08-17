@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
powershell -NoProfile -Command "$p='zg.css'; $s=Get-Content $p -Raw; $s=$s.Replace('.cx{font-size:24px;font-weight:700;letter-spacing:2px;fill:var(--label)','.cx{font-size:24px;font-weight:700;letter-spacing:2px;fill:var(--muted)'); $s=$s.Replace('.fr{font-size:34px;font-weight:600;color:rgba(255,255,255,.9)}','.fr{font-size:34px;font-weight:600;color:#fff}'); Set-Content $p $s -NoNewline"
echo START %TIME%
npx hyperframes render -o sampler_v1.0_baseline.mp4 --quiet > render.log 2>&1
echo END %TIME%
dir /b *.mp4
