/**
 * Skript pro spuštění serveru AIMapa
 * Verze 0.3.8.6
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Konfigurace
const PORT = process.env.PORT || 3000;
const SERVER_SCRIPT = 'server.js';
const ENV_FILE = '.env';
const ENV_PRODUCTION_FILE = '.env.production';

// Barvy pro výstup
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

/**
 * Kontrola, zda soubor existuje
 */
function checkFileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}

/**
 * Kontrola konfigurace prostředí
 */
function checkEnvironmentConfig() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA KONFIGURACE PROSTŘEDÍ ===${colors.reset}`);

    const envExists = checkFileExists(ENV_FILE);
    const envProductionExists = checkFileExists(ENV_PRODUCTION_FILE);

    console.log(`${envExists ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Soubor .env ${envExists ? 'existuje' : 'neexistuje'}`);
    console.log(`${envProductionExists ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Soubor .env.production ${envProductionExists ? 'existuje' : 'neexistuje'}`);

    // Kontrola obsahu .env souboru, pokud existuje
    if (envExists) {
        try {
            const envContent = fs.readFileSync(ENV_FILE, 'utf8');
            const envVars = envContent.split('\n')
                .filter(line => line.trim() !== '' && !line.startsWith('#'))
                .map(line => line.split('=')[0]);

            console.log(`\nProměnné prostředí v .env:`);
            const requiredVars = ['AUTH0_SECRET', 'AUTH0_BASE_URL', 'AUTH0_ISSUER_BASE_URL', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'SUPABASE_URL', 'SUPABASE_KEY'];

            requiredVars.forEach(varName => {
                const exists = envVars.includes(varName);
                console.log(`${exists ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}${varName}`);
            });
        } catch (err) {
            console.log(`${colors.red}Chyba při čtení .env souboru: ${err.message}${colors.reset}`);
        }
    }

    console.log('');
}

/**
 * Kontrola konfigurace Auth0
 */
function checkAuth0Config() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA KONFIGURACE AUTH0 ===${colors.reset}`);

    // Kontrola konfigurace Auth0 v .env souboru
    if (checkFileExists(ENV_FILE)) {
        try {
            const envContent = fs.readFileSync(ENV_FILE, 'utf8');
            const auth0Domain = envContent.match(/AUTH0_ISSUER_BASE_URL=(.+)/);
            const auth0ClientId = envContent.match(/AUTH0_CLIENT_ID=(.+)/);

            if (auth0Domain && auth0Domain[1]) {
                console.log(`${colors.green}✓${colors.reset} AUTH0_ISSUER_BASE_URL: ${auth0Domain[1]}`);
            } else {
                console.log(`${colors.red}✗${colors.reset} AUTH0_ISSUER_BASE_URL není nastaveno`);
            }

            if (auth0ClientId && auth0ClientId[1]) {
                console.log(`${colors.green}✓${colors.reset} AUTH0_CLIENT_ID: ${auth0ClientId[1]}`);
            } else {
                console.log(`${colors.red}✗${colors.reset} AUTH0_CLIENT_ID není nastaveno`);
            }
        } catch (err) {
            console.log(`${colors.red}Chyba při čtení .env souboru: ${err.message}${colors.reset}`);
        }
    } else {
        console.log(`${colors.red}✗${colors.reset} Soubor .env neexistuje, nelze zkontrolovat konfiguraci Auth0`);
    }

    console.log('');
}

/**
 * Kontrola konfigurace Supabase
 */
function checkSupabaseConfig() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA KONFIGURACE SUPABASE ===${colors.reset}`);

    // Kontrola konfigurace Supabase v .env souboru
    if (checkFileExists(ENV_FILE)) {
        try {
            const envContent = fs.readFileSync(ENV_FILE, 'utf8');
            const supabaseUrl = envContent.match(/SUPABASE_URL=(.+)/);
            const supabaseKey = envContent.match(/SUPABASE_KEY=(.+)/);

            if (supabaseUrl && supabaseUrl[1]) {
                console.log(`${colors.green}✓${colors.reset} SUPABASE_URL: ${supabaseUrl[1]}`);
            } else {
                console.log(`${colors.red}✗${colors.reset} SUPABASE_URL není nastaveno`);
            }

            if (supabaseKey && supabaseKey[1]) {
                console.log(`${colors.green}✓${colors.reset} SUPABASE_KEY: ${supabaseKey[1].substring(0, 5)}...`);
            } else {
                console.log(`${colors.red}✗${colors.reset} SUPABASE_KEY není nastaveno`);
            }
        } catch (err) {
            console.log(`${colors.red}Chyba při čtení .env souboru: ${err.message}${colors.reset}`);
        }
    } else {
        console.log(`${colors.red}✗${colors.reset} Soubor .env neexistuje, nelze zkontrolovat konfiguraci Supabase`);
    }

    console.log('');
}

/**
 * Kontrola dostupnosti serveru
 */
function checkServerAvailability(callback) {
    setTimeout(() => {
        http.get(`http://localhost:${PORT}`, (res) => {
            const { statusCode } = res;

            // Status kód 200 (OK) nebo 302 (přesměrování na Auth0) jsou v pořádku
            if (statusCode === 200 || statusCode === 302) {
                console.log(`${colors.green}✓${colors.reset} Server je dostupný na http://localhost:${PORT}`);
                if (statusCode === 302) {
                    console.log(`${colors.cyan}ℹ${colors.reset} Server přesměrovává na Auth0 přihlášení (status kód 302), což je očekávané chování`);
                }
                callback(true);
            } else {
                console.log(`${colors.yellow}⚠${colors.reset} Server vrátil neočekávaný status kód ${statusCode}`);
                callback(false);
            }
        }).on('error', (err) => {
            console.log(`${colors.red}✗${colors.reset} Server není dostupný: ${err.message}`);
            callback(false);
        });
    }, 2000); // Počkáme 2 sekundy, než se server spustí
}

/**
 * Spuštění serveru
 */
function startServer() {
    console.log(`${colors.bright}${colors.blue}=== SPOUŠTĚNÍ SERVERU ===${colors.reset}`);

    // Kontrola, zda existuje server.js
    if (!checkFileExists(SERVER_SCRIPT)) {
        console.log(`${colors.red}✗${colors.reset} Soubor ${SERVER_SCRIPT} neexistuje`);
        return;
    }

    console.log(`${colors.green}✓${colors.reset} Soubor ${SERVER_SCRIPT} existuje`);
    console.log(`${colors.cyan}Spouštím server na portu ${PORT}...${colors.reset}`);

    // Spuštění serveru
    const server = spawn('node', [SERVER_SCRIPT], {
        env: { ...process.env, PORT: PORT },
        stdio: 'inherit'
    });

    server.on('error', (err) => {
        console.log(`${colors.red}Chyba při spuštění serveru: ${err.message}${colors.reset}`);
    });

    server.on('exit', (code, signal) => {
        if (code) {
            console.log(`${colors.red}Server ukončen s kódem ${code}${colors.reset}`);
        } else if (signal) {
            console.log(`${colors.yellow}Server ukončen signálem ${signal}${colors.reset}`);
        } else {
            console.log(`${colors.green}Server ukončen${colors.reset}`);
        }
    });

    // Kontrola dostupnosti serveru
    checkServerAvailability((available) => {
        if (available) {
            console.log(`${colors.bright}${colors.green}=== SERVER ÚSPĚŠNĚ SPUŠTĚN ===${colors.reset}`);
            console.log(`${colors.cyan}Server běží na adrese: ${colors.bright}http://localhost:${PORT}${colors.reset}`);
            console.log(`${colors.cyan}Pro ukončení serveru stiskněte Ctrl+C${colors.reset}`);

            // Otevření prohlížeče
            console.log(`${colors.cyan}Otevírám prohlížeč...${colors.reset}`);
            const { exec } = require('child_process');
            const command = process.platform === 'win32' ?
                `start http://localhost:${PORT}` :
                (process.platform === 'darwin' ?
                    `open http://localhost:${PORT}` :
                    `xdg-open http://localhost:${PORT}`);

            exec(command);
        } else {
            console.log(`${colors.red}${colors.bright}=== NEPODAŘILO SE SPUSTIT SERVER ===${colors.reset}`);
            console.log(`${colors.yellow}Zkontrolujte, zda není port ${PORT} již používán jiným procesem${colors.reset}`);
            process.exit(1);
        }
    });
}

// Hlavní funkce
function main() {
    console.log(`${colors.bright}${colors.magenta}=== AIMAPA STARTER ===${colors.reset}`);
    console.log(`Verze: 0.3.8.6`);
    console.log(`Datum: ${new Date().toISOString()}`);
    console.log('');

    // Kontrola konfigurace
    checkEnvironmentConfig();
    checkAuth0Config();
    checkSupabaseConfig();

    // Spuštění serveru
    startServer();
}

// Spuštění hlavní funkce
main();
