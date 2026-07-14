$backend = Start-Process python -ArgumentList "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000" -PassThru
try {
  Set-Location frontend
  npm run dev
} finally {
  Stop-Process -Id $backend.Id -ErrorAction SilentlyContinue
}
