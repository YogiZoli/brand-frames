@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
echo START %TIME%
call npx hyperframes render -o sampler_v1.6.mp4 --quiet > render.log 2>&1
echo RENDERED %TIME%
ffmpeg -y -v error -i sampler_v1.6.mp4 -vf "fps=1/4.93,scale=380:-1,tile=8x5" -frames:v 1 _sheet16.jpg
ffmpeg -y -v error -ss 82.2 -i sampler_v1.6.mp4 -frames:v 1 -vf "scale=1100:-1" _ring16.jpg
ffmpeg -y -v error -ss 134.5 -i sampler_v1.6.mp4 -frames:v 1 -vf "scale=1100:-1" _skitch16.jpg
ffmpeg -y -v error -ss 65.6 -i sampler_v1.6.mp4 -frames:v 1 -vf "scale=1100:-1" _lens16.jpg
echo REGRESSION %TIME%
powershell -NoProfile -ExecutionPolicy Bypass -File regress.ps1 -Video sampler_v1.6.mp4
powershell -NoProfile -ExecutionPolicy Bypass -File copy_to_drive.ps1
echo DONE %TIME%
