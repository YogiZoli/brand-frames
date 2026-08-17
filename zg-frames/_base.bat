@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
if not exist baseline mkdir baseline
ffmpeg -y -v error -i sampler_v1.0_baseline.mp4 -vf "fps=1/4.75,scale=440:-1,tile=6x4" -frames:v 1 _sheet.jpg
for %%T in (3.4 7.2 11.5 15.5 21.0 26.5 30.5 35.0 40.5 44.5 50.0 55.0 59.5 65.5 70.0 74.5 79.0 84.0 89.0 94.0 99.0 105.0 109.0 113.0) do (
  ffmpeg -y -v error -ss %%T -i sampler_v1.0_baseline.mp4 -frames:v 1 baseline\at_%%T.png
)
dir /b baseline | find /c ".png"
echo DONE
