#!/bin/bash

# Skript pro aktualizaci na verzi 0.3.8.7
# Tento skript provede zálohu původního server.js a nahradí ho novou verzí

# Kontrola, zda existuje server.js
if [ ! -f "server.js" ]; then
    echo "Soubor server.js nebyl nalezen!"
    exit 1
fi

# Vytvoření zálohy původního server.js
echo "Vytvářím zálohu původního server.js..."
cp server.js server.js.backup

# Nahrazení server.js novou verzí
echo "Nahrazuji server.js novou verzí..."
cp server.js.new server.js

# Kontrola, zda existuje složka auth
if [ ! -d "auth" ]; then
    echo "Složka auth nebyla nalezena! Vytvářím..."
    mkdir -p auth
fi

echo "Aktualizace na verzi 0.3.8.7 byla dokončena!"
echo "Původní server.js byl zálohován jako server.js.backup"
echo ""
echo "Pro spuštění nové verze použijte:"
echo "node server.js"
echo ""
echo "Pro testování Auth0 endpointů použijte:"
echo "node auth/auth0-test.js"
echo ""
echo "Pro více informací si přečtěte:"
echo "- AUTH0-GUIDE.md - Průvodce pro práci s Auth0 autentizací"
echo "- auth/auth0-endpoints.md - Dokumentace všech Auth0 endpointů"
echo "- CHANGELOG.md - Historie změn v aplikaci"
