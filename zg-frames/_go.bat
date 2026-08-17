@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
echo START %TIME%
npx hyperframes render -o sampler_v1.5.mp4 --quiet > render.log 2>&1
echo RENDERED %TIME%
ffmpeg -y -v error -i sampler_v1.5.mp4 -vf "fps=1/4.87,scale=380:-1,tile=7x5" -frames:v 1 _sheet15.jpg
ffmpeg -y -v error -ss 65 -i sampler_v1.5.mp4 -frames:v 1 -vf "scale=1100:-1" _zoom15.jpg
ffmpeg -y -v error -ss 20 -i sampler_v1.5.mp4 -frames:v 1 -vf "scale=1100:-1" _icons15.jpg
copy /Y sampler_v1.5.mp4 "C:\Users\gdp\My Drive\📺 YouTube & Content\zg-frames\" >nul
copy /Y _sheet15.jpg "C:\Users\gdp\My Drive\📺 YouTube & Content\zg-frames\kontaktlap_v1.5.jpg" >nul
echo DONE %TIME%
