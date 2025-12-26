# Verifica funzionamento Gemini Eyes
Write-Host "[Gemini Eyes] Verifica server..." -ForegroundColor Cyan

$response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -ErrorAction SilentlyContinue

if ($response.StatusCode -eq 200) {
    Write-Host "[OK] Server attivo su http://localhost:3000" -ForegroundColor Green
    Write-Host "[INFO] Apri http://localhost:3000 nel browser" -ForegroundColor Yellow
    
    # Verifica contenuto HTML
    if ($response.Content -match "GEMINI EYES") {
        Write-Host "[OK] HTML caricato correttamente" -ForegroundColor Green
    } else {
        Write-Host "[WARN] HTML potrebbe non essere corretto" -ForegroundColor Yellow
    }
} else {
    Write-Host "[ERROR] Server non risponde" -ForegroundColor Red
}

