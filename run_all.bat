@echo off
echo =========================================================================
echo 🌱 SIH 2026: Air Pollution-Weather Coupled Forecasting System (Delhi NCR)
echo =========================================================================
echo Starting VayuDrishti AI services...

cd /d "%~dp0"

echo [1/2] Training ML models and initializing backend data...
python backend/train_models.py

echo [2/2] Launching React Vite Frontend Dev Server...
start "VayuDrishti Frontend" cmd /k "cd frontend && npm run dev"

echo [INFO] Web App active at: http://localhost:3000/
echo =========================================================================
pause
