@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
call npx hyperframes snapshot --no-end -o _snap17b --at 34.5,48,96,134.5,164,193
rem SZURKEARNYALATOS PROBA: ha itt is olvashato, akkor barmilyen szinlatassal olvashato.
ffmpeg -y -v error -i _snap17b\frame-00-at-34.5s.png -vf "format=gray,scale=960:-1" _gray_split.png
ffmpeg -y -v error -i _snap17b\frame-01-at-48s.png   -vf "format=gray,scale=960:-1" _gray_panel.png
ffmpeg -y -v error -i _snap17b\frame-03-at-134.5s.png -vf "format=gray,scale=960:-1" _gray_skitch.png
rem DEUTERANOPIA PROBA
ffmpeg -y -v error -i _snap17b\frame-00-at-34.5s.png -vf "colorchannelmixer=.625:.375:0:0:.7:.3:0:0:0:.3:.7,scale=960:-1" _cvd_split17.png
ffmpeg -y -v error -i _snap17b\frame-03-at-134.5s.png -vf "colorchannelmixer=.625:.375:0:0:.7:.3:0:0:0:.3:.7,scale=960:-1" _cvd_skitch17.png
echo KESZ
