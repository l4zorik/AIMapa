@echo off
REM Skript pro spuštění testů AIMapa v prostředí Windows
REM Verze 0.3.8.6

setlocal enabledelayedexpansion

REM Barvy pro výstup
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set NC=[0m

REM Funkce pro zobrazení nápovědy
:show_help
echo %BLUE%AIMapa Test Runner%NC%
echo Verze 0.3.8.6
echo.
echo Použití: %0 [MOŽNOSTI]
echo.
echo Možnosti:
echo   -a, --all         Spustit všechny testy
echo   -u, --unit        Spustit unit testy
echo   -i, --integration Spustit integrační testy
echo   -e, --e2e         Spustit end-to-end testy
echo   -m, --ai-model    Spustit testy AI modelu
echo   -h, --help        Zobrazit tuto nápovědu
echo.
echo Příklady:
echo   %0 --all          # Spustit všechny testy
echo   %0 -u -i          # Spustit unit a integrační testy
goto :eof

REM Kontrola, zda je Node.js nainstalován
:check_node
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %RED%Chyba: Node.js není nainstalován%NC%
    echo Nainstalujte Node.js a zkuste to znovu
    exit /b 1
)
goto :eof

REM Kontrola, zda jsou nainstalovány potřebné balíčky
:check_dependencies
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %RED%Chyba: npm není nainstalován%NC%
    echo Nainstalujte npm a zkuste to znovu
    exit /b 1
)

REM Kontrola, zda je nainstalován modul jest
npm list -g jest >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo %YELLOW%Varování: Jest není nainstalován globálně%NC%
    echo Instaluji Jest...
    npm install -g jest
)
goto :eof

REM Spuštění unit testů
:run_unit_tests
echo %BLUE%=== SPOUŠTÍM UNIT TESTY ===%NC%
node -e "const MapUtilsTest = require('./unit/map-utils.test'); const results = MapUtilsTest.runAllTests(); console.log(JSON.stringify(results, null, 2));"

if %ERRORLEVEL% equ 0 (
    echo %GREEN%Unit testy dokončeny úspěšně%NC%
) else (
    echo %RED%Unit testy selhaly%NC%
)
goto :eof

REM Spuštění integračních testů
:run_integration_tests
echo %BLUE%=== SPOUŠTÍM INTEGRAČNÍ TESTY ===%NC%
node -e "const MapApiTest = require('./integration/map-api.test'); MapApiTest.runAllTests().then(results => console.log(JSON.stringify(results, null, 2)));"

if %ERRORLEVEL% equ 0 (
    echo %GREEN%Integrační testy dokončeny úspěšně%NC%
) else (
    echo %RED%Integrační testy selhaly%NC%
)
goto :eof

REM Spuštění end-to-end testů
:run_e2e_tests
echo %BLUE%=== SPOUŠTÍM END-TO-END TESTY ===%NC%
node -e "const MapWorkflowTest = require('./e2e/map-workflow.test'); MapWorkflowTest.runAllScenarios().then(results => console.log(JSON.stringify(results, null, 2)));"

if %ERRORLEVEL% equ 0 (
    echo %GREEN%End-to-end testy dokončeny úspěšně%NC%
) else (
    echo %RED%End-to-end testy selhaly%NC%
)
goto :eof

REM Spuštění testů AI modelu
:run_ai_model_tests
echo %BLUE%=== SPOUŠTÍM TESTY AI MODELU ===%NC%
node -e "const AIModelTest = require('./ai/model-evaluation.test'); const results = AIModelTest.runAllTests(); console.log(JSON.stringify(results, null, 2));"

if %ERRORLEVEL% equ 0 (
    echo %GREEN%Testy AI modelu dokončeny úspěšně%NC%
) else (
    echo %RED%Testy AI modelu selhaly%NC%
)
goto :eof

REM Spuštění všech testů
:run_all_tests
echo %BLUE%=== SPOUŠTÍM VŠECHNY TESTY ===%NC%
node run-tests.js

if %ERRORLEVEL% equ 0 (
    echo %GREEN%Všechny testy dokončeny úspěšně%NC%
) else (
    echo %RED%Některé testy selhaly%NC%
)
goto :eof

REM Hlavní funkce
:main
REM Kontrola Node.js a závislostí
call :check_node
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

call :check_dependencies
if %ERRORLEVEL% neq 0 exit /b %ERRORLEVEL%

REM Pokud nejsou zadány žádné parametry, zobrazit nápovědu
if "%~1"=="" (
    call :show_help
    exit /b 0
)

REM Zpracování parametrů
set RUN_UNIT=false
set RUN_INTEGRATION=false
set RUN_E2E=false
set RUN_AI_MODEL=false
set RUN_ALL=false

:parse_args
if "%~1"=="" goto :execute_tests

if /i "%~1"=="-a" set RUN_ALL=true
if /i "%~1"=="--all" set RUN_ALL=true
if /i "%~1"=="-u" set RUN_UNIT=true
if /i "%~1"=="--unit" set RUN_UNIT=true
if /i "%~1"=="-i" set RUN_INTEGRATION=true
if /i "%~1"=="--integration" set RUN_INTEGRATION=true
if /i "%~1"=="-e" set RUN_E2E=true
if /i "%~1"=="--e2e" set RUN_E2E=true
if /i "%~1"=="-m" set RUN_AI_MODEL=true
if /i "%~1"=="--ai-model" set RUN_AI_MODEL=true

if /i "%~1"=="-h" (
    call :show_help
    exit /b 0
)
if /i "%~1"=="--help" (
    call :show_help
    exit /b 0
)

shift
goto :parse_args

:execute_tests
REM Spuštění testů
if "%RUN_ALL%"=="true" (
    call :run_all_tests
) else (
    if "%RUN_UNIT%"=="true" (
        call :run_unit_tests
    )
    
    if "%RUN_INTEGRATION%"=="true" (
        call :run_integration_tests
    )
    
    if "%RUN_E2E%"=="true" (
        call :run_e2e_tests
    )
    
    if "%RUN_AI_MODEL%"=="true" (
        call :run_ai_model_tests
    )
)

exit /b 0

REM Spuštění hlavní funkce
:start
call :main %*
