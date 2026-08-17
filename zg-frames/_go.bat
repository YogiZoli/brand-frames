@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
echo START %TIME%
npx hyperframes render -o sampler_v1.3.mp4 --quiet > render.log 2>&1
echo END %TIME%
ffmpeg -y -v error -i sampler_v1.3.mp4 -vf "fps=1/4.87,scale=380:-1,tile=7x4" -frames:v 1 _sheet13.jpg
ffmpeg -y -v error -ss 129.5 -i sampler_v1.3.mp4 -frames:v 1 -vf "scale=1100:-1" _hl13.jpg
ffmpeg -y -v error -ss 34.5 -i sampler_v1.3.mp4 -frames:v 1 -vf "colorchannelmixer=.625:.375:0:0:.7:.3:0:0:0:.3:.7,scale=900:-1" _cvd13.jpg
echo DONE
