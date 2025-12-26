# Gemini Eyes - Start Script (Windows Native)
# Avvia server locale per applicazione Gemini Eyes

Write-Host "[Gemini Eyes] Verifica dipendenze..." -ForegroundColor Cyan

# Verifica Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js non trovato. Installa Node.js da https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verifica npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm non trovato" -ForegroundColor Red
    exit 1
}

# Verifica serve
if (-not (Get-Command serve -ErrorAction SilentlyContinue)) {
    Write-Host "[INFO] Installo serve globalmente..." -ForegroundColor Yellow
    npm install -g serve
}

Write-Host "[Gemini Eyes] Avvio server su http://localhost:3000" -ForegroundColor Green
Write-Host "[INFO] Premi Ctrl+C per fermare il server" -ForegroundColor Yellow

# Avvia server
Set-Location $PSScriptRoot
serve . -p 3000

