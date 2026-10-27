# PowerShell script to run EchoVault locally

Write-Host "=========================================" -ForegroundColor Gold
Write-Host " Starting EchoVault Local-First Archive  " -ForegroundColor Gold
Write-Host "=========================================" -ForegroundColor Gold

# Check backend venv
if (-not (Test-Path "backend\venv")) {
    Write-Host "Creating Python virtual environment in backend\venv..." -ForegroundColor Cyan
    python -m venv backend\venv
    .\backend\venv\Scripts\pip install -r backend\requirements.txt
}

# Start backend in new process
Write-Host "Starting FastAPI Backend at http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Start frontend
Write-Host "Starting Next.js Frontend at http://localhost:3000..." -ForegroundColor Green
cd frontend
npm run dev
