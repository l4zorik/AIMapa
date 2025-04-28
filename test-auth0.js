/**
 * AIMapa - Test Auth0 funkcí
 *
 * Tento skript testuje funkčnost Auth0 integrace v aplikaci AIMapa.
 * Spustí sérii testů pro ověření, zda je Auth0 správně nakonfigurováno a funkční.
 */

// Načtení modulů
const fs = require('fs');
const path = require('path');
const http = require('http');
const { exec } = require('child_process');

// Načtení proměnných prostředí z .env souboru
require('dotenv').config();

// Barvy pro konzoli
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        crimson: '\x1b[38m'
    },

    bg: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        crimson: '\x1b[48m'
    }
};

// Funkce pro výpis zpráv
function log(message, type = 'info') {
    const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);

    switch (type) {
        case 'success':
            console.log(`${colors.fg.green}[${timestamp}] ✓ ${message}${colors.reset}`);
            break;
        case 'error':
            console.error(`${colors.fg.red}[${timestamp}] ✗ ${message}${colors.reset}`);
            break;
        case 'warning':
            console.warn(`${colors.fg.yellow}[${timestamp}] ⚠ ${message}${colors.reset}`);
            break;
        case 'info':
        default:
            console.log(`${colors.fg.cyan}[${timestamp}] ℹ ${message}${colors.reset}`);
            break;
    }
}

// Funkce pro kontrolu Auth0 konfigurace
function checkAuth0Config() {
    log('Kontrola Auth0 konfigurace...');

    const requiredVars = [
        'AUTH0_DOMAIN',
        'AUTH0_CLIENT_ID',
        'AUTH0_CLIENT_SECRET',
        'AUTH0_CALLBACK_URL',
        'AUTH0_LOGOUT_URL',
        'AUTH0_AUDIENCE',
        'AUTH0_SCOPE'
    ];

    let allVarsPresent = true;

    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            log(`Chybí proměnná prostředí ${varName}`, 'error');
            allVarsPresent = false;
        } else {
            log(`Proměnná prostředí ${varName} je nastavena`, 'success');
        }
    });

    return allVarsPresent;
}

// Funkce pro kontrolu souborů Auth0
function checkAuth0Files() {
    log('Kontrola souborů Auth0...');

    const requiredFiles = [
        'public/app/auth0-auth.js',
        'public/auth0-test.html'
    ];

    let allFilesPresent = true;

    requiredFiles.forEach(filePath => {
        if (!fs.existsSync(path.join(__dirname, filePath))) {
            log(`Chybí soubor ${filePath}`, 'error');
            allFilesPresent = false;
        } else {
            log(`Soubor ${filePath} existuje`, 'success');
        }
    });

    return allFilesPresent;
}

// Funkce pro kontrolu obsahu souborů Auth0
function checkAuth0FileContents() {
    log('Kontrola obsahu souborů Auth0...');

    const auth0JsPath = path.join(__dirname, 'public/app/auth0-auth.js');

    if (!fs.existsSync(auth0JsPath)) {
        log('Soubor auth0-auth.js neexistuje, nelze zkontrolovat obsah', 'error');
        return false;
    }

    try {
        const auth0JsContent = fs.readFileSync(auth0JsPath, 'utf8');

        // Kontrola, zda soubor obsahuje klíčové funkce
        const requiredFunctions = [
            { name: 'init', present: auth0JsContent.includes('init:') || auth0JsContent.includes('init: async function') || auth0JsContent.includes('init: function') || auth0JsContent.includes('async init()') },
            { name: 'login', present: auth0JsContent.includes('login:') || auth0JsContent.includes('login: async function') || auth0JsContent.includes('login: function') || auth0JsContent.includes('async login()') },
            { name: 'logout', present: auth0JsContent.includes('logout:') || auth0JsContent.includes('logout: async function') || auth0JsContent.includes('logout: function') || auth0JsContent.includes('async logout()') },
            { name: 'checkCurrentUser', present: auth0JsContent.includes('checkCurrentUser') },
            { name: 'loadAuth0Client', present: auth0JsContent.includes('loadAuth0Client') },
            { name: 'loadAuth0Script', present: auth0JsContent.includes('loadAuth0Script') }
        ];

        let allFunctionsPresent = true;

        requiredFunctions.forEach(func => {
            if (func.present) {
                log(`Funkce ${func.name} nalezena v auth0-auth.js`, 'success');
            } else {
                log(`Funkce ${func.name} chybí v auth0-auth.js`, 'error');
                allFunctionsPresent = false;
            }
        });

        return allFunctionsPresent;
    } catch (error) {
        log(`Chyba při čtení souboru auth0-auth.js: ${error.message}`, 'error');
        return false;
    }
}

// Funkce pro spuštění testovacího serveru
function startTestServer() {
    return new Promise((resolve) => {
        log('Spouštím testovací server...');

        const server = http.createServer((req, res) => {
            if (req.url === '/auth0-test') {
                res.writeHead(200, { 'Content-Type': 'text/html' });

                try {
                    const testHtmlPath = path.join(__dirname, 'public/auth0-test.html');
                    const testHtml = fs.readFileSync(testHtmlPath, 'utf8');
                    res.end(testHtml);
                } catch (error) {
                    res.end(`<html><body><h1>Chyba</h1><p>Nepodařilo se načíst testovací stránku: ${error.message}</p></body></html>`);
                }
            } else {
                res.writeHead(302, { 'Location': '/auth0-test' });
                res.end();
            }
        });

        const testPort = 3001;

        server.listen(testPort, () => {
            log(`Testovací server běží na http://localhost:${testPort}/auth0-test`, 'success');
            resolve({ server, port: testPort });
        });
    });
}

// Hlavní funkce
async function main() {
    console.log('\n');
    log('=== Test Auth0 funkcí ===', 'info');
    console.log('\n');

    // Kontrola Auth0 konfigurace
    const configOk = checkAuth0Config();
    console.log('\n');

    // Kontrola souborů Auth0
    const filesOk = checkAuth0Files();
    console.log('\n');

    // Kontrola obsahu souborů Auth0
    const contentsOk = checkAuth0FileContents();
    console.log('\n');

    // Výsledek základních kontrol
    if (configOk && filesOk && contentsOk) {
        log('Základní kontroly proběhly úspěšně', 'success');
    } else {
        log('Některé základní kontroly selhaly', 'error');
    }
    console.log('\n');

    // Spuštění testovacího serveru
    const { server, port } = await startTestServer();

    // Otevření testovací stránky v prohlížeči
    log('Otevírám testovací stránku v prohlížeči...');
    const url = `http://localhost:${port}/auth0-test`;

    // Otevření URL v prohlížeči podle platformy
    const platform = process.platform;
    let command;

    if (platform === 'win32') {
        command = `start ${url}`;
    } else if (platform === 'darwin') {
        command = `open ${url}`;
    } else {
        command = `xdg-open ${url}`;
    }

    exec(command, (error) => {
        if (error) {
            log(`Nepodařilo se otevřít prohlížeč: ${error.message}`, 'error');
        } else {
            log(`Testovací stránka byla otevřena na adrese ${url}`, 'success');
        }
    });

    log('Testovací stránka byla otevřena v prohlížeči. Po dokončení testů stiskněte Ctrl+C pro ukončení.', 'info');

    // Čekání na ukončení
    process.on('SIGINT', () => {
        log('Ukončuji testovací server...', 'info');
        server.close(() => {
            log('Testovací server byl ukončen', 'success');
            process.exit(0);
        });
    });
}

// Spuštění hlavní funkce
main().catch(error => {
    log(`Chyba: ${error.message}`, 'error');
    process.exit(1);
});
