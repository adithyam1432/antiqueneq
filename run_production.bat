@echo off
echo =========================================
echo Antiques Marketplace - Production Mode
echo =========================================
echo.
echo Step 1: Building the application...
call npm run build

echo.
echo Step 2: Starting the production server...
echo The website will be available at http://localhost:3000
call npm run start

pause
