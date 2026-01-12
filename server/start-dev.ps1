# TaskFlow Backend - Development Mode
# Bu script backend'i development modunda başlatır ve hataları gösterir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TaskFlow Backend Server" -ForegroundColor Green
Write-Host "Development Mode" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Environment variable ayarla
$env:NODE_ENV = "development"

# Backend'i başlat
Write-Host "Starting server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

node src/server.js

