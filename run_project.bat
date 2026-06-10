@echo off
title Anique - Dev Server
cd /d "%~dp0"
echo ==============================================
echo   Starting Anique Antique Marketplace...
echo   Connected Database: MySQL (antiques_db)
echo ==============================================
npm run dev
pause
