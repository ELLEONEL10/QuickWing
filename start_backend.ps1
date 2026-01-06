Set-Location -Path "backend"
.\venv\Scripts\Activate.ps1
$env:PYTHONPATH="src"
Write-Host "Starting Backend..."
python -m uvicorn app.main:app --reload --port 8000
