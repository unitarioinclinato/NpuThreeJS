# HP_Victory_Day.ps1
# Final eradication script assuming blocked Windows Updates for drivers

Write-Host "⚔️ STARTING FINAL PURGE (FIXED) ⚔️" -ForegroundColor Magenta

# 1. Driver Removal Loop
$drivers = pnputil /enum-drivers | Select-String "HP Inc." -Context 5
$infs = @()
foreach ($match in $drivers) {
    if ($match.Context.PreContext -match "oem(\d+)\.inf") {
        $infs += "oem$($matches[1]).inf"
    }
    if ($match.Line -match "oem(\d+)\.inf") {
        $infs += "oem$($matches[1]).inf"
    }
}
$infs = $infs | Select-Object -Unique

if ($infs.Count -gt 0) {
    Write-Host "Found stubborn drivers: $($infs -join ', ')" -ForegroundColor Yellow
    foreach ($inf in $infs) {
        Write-Host "🔥 Nuking $inf..." -NoNewline
        $proc = Start-Process pnputil -ArgumentList "/delete-driver $inf /uninstall /force" -NoNewWindow -PassThru -Wait
        if ($proc.ExitCode -eq 0) { Write-Host " [OK]" -ForegroundColor Green }
        else { Write-Host " [FAILED - Access Denied?]" -ForegroundColor Red }
    }
} else {
    Write-Host "No HP drivers found in the store! (Good sign)" -ForegroundColor Green
}

# 2. Service Assassination
$serviceName = "HpTouchpointAnalyticsService"
$service = Get-Service $serviceName -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "💀 Killing Service: $serviceName" -ForegroundColor Red
    
    # Method 1: SC delete
    sc.exe delete $serviceName
    
    # Method 2: Registry Nuke (Direct) - Requires Admin
    Remove-Item "HKLM:\SYSTEM\CurrentControlSet\Services\$serviceName" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Method 3: Stop force
    Stop-Service $serviceName -Force -ErrorAction SilentlyContinue
} else {
    Write-Host "Service $serviceName not found (or already dead)." -ForegroundColor Cyan
}

# 3. Phantom Service Creation (The "Tombstone")
if (!(Get-Service $serviceName -ErrorAction SilentlyContinue)) {
    Write-Host "⚰️ Erecting Tombstone (Phantom Service)..." -ForegroundColor Cyan
    sc.exe create $serviceName binPath= "C:\Windows\System32\svchost.exe -k LocalService" start= disabled displayname= "HP Analytics (DEFEATED)"
    sc.exe description $serviceName "This service is a placeholder to prevent HP spyware re-installation."
}

# 4. Cleanup Files
$paths = @(
    "C:\ProgramData\HP\HP Touchpoint Analytics Client",
    "C:\Windows\System32\DriverStore\FileRepository\hpanalytics*"
)

foreach ($p in $paths) {
    if (Test-Path $p) {
        Write-Host "🗑️ Cleaning path: $p"
        Remove-Item $p -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "⚔️ PURGE COMPLETE ⚔️" -ForegroundColor Magenta
