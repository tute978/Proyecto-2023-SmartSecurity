cd C:/AppServ/www/Proyecto-2023-SmartSecurity/RTSP-HLS-SERVER

:: Obtener el archivo más reciente en el directorio
for /f "delims=" %%i in ('dir /b /od ruta\del\directorio') do set archivo_mas_reciente=%%i

:: Copiar el archivo más reciente al directorio de destino
copy "C:/AppServ/www/Proyecto-2023-SmartSecurity/RTSP-HLS-SERVER/%archivo_mas_reciente%" C:/AppServ/www/Proyecto-2023-SmartSecurity

pause