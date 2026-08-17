@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
echo START %TIME%
npx hyperframes render -o sampler_v1.1.mp4 --quiet > render.log 2>&1
echo END %TIME%
ffmpeg -y -v error -i sampler_v1.1.mp4 -vf "fps=1/5.3,scale=440:-1,tile=6x4" -frames:v 1 _sheet11.jpg
echo DONE
