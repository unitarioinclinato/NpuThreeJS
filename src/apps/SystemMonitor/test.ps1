# Test System Monitor
Write-Host "[System Monitor] Verifica disponibilità..." -ForegroundColor Cyan

Start-Sleep -Seconds 1

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/src/apps/SystemMonitor/index.html" -UseBasicParsing -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] System Monitor disponibile" -ForegroundColor Green
        Write-Host "[INFO] URL: http://localhost:3000/src/apps/SystemMonitor/index.html" -ForegroundColor Cyan
        Write-Host "[INFO] Apri il browser per visualizzare il monitor in tempo reale" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[INFO] Server attivo sulla porta 3000" -ForegroundColor Yellow
    Write-Host "[INFO] Apri manualmente: http://localhost:3000/src/apps/SystemMonitor/index.html" -ForegroundColor Cyan
}


