cd C:\AppServ\www\Proyecto-2023-SmartSecurity\ffmpeg-6.0-essentials_build\bin
FOR /F "delims=" %%I IN ('DIR "C:\AppServ\www\Proyecto-2023-SmartSecurity\RTSP-HLS-SERVER\*.ts" /A-D /B /O:D') DO SET "NewestFile=%%I"

SET NewestFileMp4=%NewestFile:.ts=.mp4%
ffmpeg -i C:\AppServ\www\Proyecto-2023-SmartSecurity\RTSP-HLS-SERVER\%NewestFile% -c:v libx264 C:\AppServ\www\Proyecto-2023-SmartSecurity\CameraFiles\%NewestFileMp4%