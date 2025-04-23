@echo off
echo ===================================================
echo = Nahrání verze 0.2.8.7.8 na GitHub =
echo ===================================================
echo.

echo Kontrola, zda je Git nainstalován...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Git není nainstalován nebo není v PATH.
    echo Nainstalujte Git z https://git-scm.com/downloads
    pause
    exit /b 1
)

echo Git je nainstalován.
echo.

echo Aktuální adresář: %CD%
echo.

echo Kontrola, zda je aktuální adresář Git repozitář...
if not exist .git (
    echo Aktuální adresář není Git repozitář.
    echo Spusťte tento skript z kořenového adresáře projektu AIMapa.
    pause
    exit /b 1
)

echo Aktuální adresář je Git repozitář.
echo.

echo Zobrazení aktuálního stavu repozitáře...
git status
echo.

echo Přidání všech změn...
git add .
echo.

echo Vytvoření commitu...
git commit -m "Version 0.2.8.7.8 - Funkční panel možností vedle chatu"
echo.

echo Vytvoření nové větve v0.2.8.7.8...
git checkout -b v0.2.8.7.8
echo.

echo Push na GitHub...
git push -u origin v0.2.8.7.8
echo.

echo Vytvoření tagu v0.2.8.7.8...
git tag v0.2.8.7.8
echo.

echo Push tagu na GitHub...
git push origin v0.2.8.7.8
echo.

echo ===================================================
echo = Nahrání verze 0.2.8.7.8 na GitHub dokončeno =
echo ===================================================
echo.

pause
