call npm run build

set folder="D:\Work\Workspace\Expense-Tracker\expense-tracker-be\src\main\resources\static\"
cd /d %folder%
for /F "delims=" %%i in ('dir /b') do (rmdir "%%i" /s/q || del "%%i" /s/q)

xcopy /s "D:\Work\Workspace\Expense-Tracker\expense-tracker-ui\dist\expense-tracker-ui\*" "D:\Work\Workspace\Expense-Tracker\expense-tracker-be\src\main\resources\static\"

REM cd D:\Work\expense-tracker-be
REM call C:\Softwares\Gradle\gradle-7.6.1\bin\gradle clean
REM pause
REM call C:\Softwares\Gradle\gradle-7.6.1\bin\gradle build