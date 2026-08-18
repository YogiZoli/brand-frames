@echo off
cd /d C:\Users\gdp\HyperFrames\_frames\zg-frames
call npx hyperframes check > _check.log 2>&1
findstr /C:"console_warning" /C:"error(s)" /C:"OLVASHATATLAN" /C:"SZUK" /C:"need 3:1" /C:"Check passed" /C:"Check failed" _check.log
