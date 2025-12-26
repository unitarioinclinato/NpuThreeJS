# NpuThreeJS - Auto-Install Dependencies (Windows Native)
# PowerShell script per installazione automatica dipendenze

Write-Host "[NpuThreeJS] Verifica ambiente Node.js..." -ForegroundColor Cyan

# Verifica Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js non trovato. Installa Node.js da https://nodejs.org/" -ForegroundColor Red
    exit 1
}

$nodeVersion = node --version
Write-Host "[OK] Node.js $nodeVersion trovato" -ForegroundColor Green

# Verifica npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm non trovato" -ForegroundColor Red
    exit 1
}

$npmVersion = npm --version
Write-Host "[OK] npm $npmVersion trovato" -ForegroundColor Green

# Installa dipendenze
Write-Host "[NpuThreeJS] Installazione dipendenze..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Dipendenze installate con successo" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Errore durante installazione dipendenze" -ForegroundColor Red
    exit 1
}

Write-Host "[NpuThreeJS] Setup completato" -ForegroundColor Green

