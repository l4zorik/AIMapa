# Nahrání verze 0.2.8.7.8 na GitHub

Write-Host "===================================================" -ForegroundColor Green
Write-Host "= Nahrání verze 0.2.8.7.8 na GitHub =" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Kontrola, zda je Git nainstalován..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "Git je nainstalován: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git není nainstalován nebo není v PATH." -ForegroundColor Red
    Write-Host "Nainstalujte Git z https://git-scm.com/downloads" -ForegroundColor Red
    Read-Host "Stiskněte Enter pro ukončení"
    exit 1
}

Write-Host ""
Write-Host "Aktuální adresář: $PWD" -ForegroundColor Yellow
Write-Host ""

Write-Host "Kontrola, zda je aktuální adresář Git repozitář..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "Aktuální adresář není Git repozitář." -ForegroundColor Red
    Write-Host "Spusťte tento skript z kořenového adresáře projektu AIMapa." -ForegroundColor Red
    Read-Host "Stiskněte Enter pro ukončení"
    exit 1
}

Write-Host "Aktuální adresář je Git repozitář." -ForegroundColor Green
Write-Host ""

Write-Host "Zobrazení aktuálního stavu repozitáře..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "Přidání všech změn..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "Vytvoření commitu..." -ForegroundColor Yellow
git commit -m "Version 0.2.8.7.8 - Funkční panel možností vedle chatu"
Write-Host ""

Write-Host "Vytvoření nové větve v0.2.8.7.8..." -ForegroundColor Yellow
git checkout -b v0.2.8.7.8
Write-Host ""

Write-Host "Push na GitHub..." -ForegroundColor Yellow
git push -u origin v0.2.8.7.8
Write-Host ""

Write-Host "Vytvoření tagu v0.2.8.7.8..." -ForegroundColor Yellow
git tag v0.2.8.7.8
Write-Host ""

Write-Host "Push tagu na GitHub..." -ForegroundColor Yellow
git push origin v0.2.8.7.8
Write-Host ""

Write-Host "===================================================" -ForegroundColor Green
Write-Host "= Nahrání verze 0.2.8.7.8 na GitHub dokončeno =" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

Read-Host "Stiskněte Enter pro ukončení"
