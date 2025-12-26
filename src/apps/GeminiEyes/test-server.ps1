# Test server Gemini Eyes
Write-Host "[Gemini Eyes] Test server..." -ForegroundColor Cyan

Start-Sleep -Seconds 2

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/src/apps/GeminiEyes/index.html" -UseBasicParsing -ErrorAction Stop
    
    if ($response.StatusCode -eq 200) {
        Write-Host "[OK] Server attivo - Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "[INFO] URL: http://localhost:3000/src/apps/GeminiEyes/index.html" -ForegroundColor Yellow
        
        if ($response.Content -match "GEMINI EYES") {
            Write-Host "[OK] HTML contiene 'GEMINI EYES'" -ForegroundColor Green
        }
        
        Write-Host "[INFO] Apri il browser su: http://localhost:3000/src/apps/GeminiEyes/index.html" -ForegroundColor Cyan
    }
} catch {
    Write-Host "[ERROR] Server non raggiungibile: $_" -ForegroundColor Red
    Write-Host "[INFO] Verifica che il server sia avviato con: npx serve . -p 3000" -ForegroundColor Yellow
}

