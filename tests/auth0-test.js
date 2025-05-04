/**
 * Test pro ověření Auth0 konfigurace
 * Verze 0.4.1
 */

const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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

// Načtení proměnných prostředí - vždy používáme produkční prostředí pro testy s doménou
dotenv.config({ path: '.env.production' });
console.log('Načteny produkční proměnné prostředí z .env.production');

/**
 * Test Auth0 konfigurace
 */
async function testAuth0Config() {
    console.log(`${colors.bright}${colors.blue}=== TEST AUTH0 KONFIGURACE ===${colors.reset}`);

    // Kontrola proměnných prostředí
    const requiredEnvVars = [
        'AUTH0_DOMAIN',
        'AUTH0_CLIENT_ID',
        'AUTH0_CLIENT_SECRET',
        'AUTH0_SECRET',
        'AUTH0_CALLBACK_URL',
        'AUTH0_LOGOUT_URL',
        'AUTH0_SCOPE',
        'AUTH0_AUDIENCE'
    ];

    let missingVars = [];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missingVars.push(envVar);
        }
    }

    if (missingVars.length > 0) {
        console.log(`${colors.red}✗${colors.reset} Chybí následující proměnné prostředí: ${missingVars.join(', ')}`);
        return false;
    }

    console.log(`${colors.green}✓${colors.reset} Všechny požadované proměnné prostředí jsou nastaveny`);

    // Kontrola Auth0 domény
    try {
        console.log(`${colors.cyan}Kontrola Auth0 domény ${process.env.AUTH0_DOMAIN}...${colors.reset}`);

        const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/.well-known/openid-configuration`);

        if (response.status === 200) {
            console.log(`${colors.green}✓${colors.reset} Auth0 doména je dostupná`);

            // Kontrola, zda odpověď obsahuje očekávané endpointy
            const requiredEndpoints = [
                'authorization_endpoint',
                'token_endpoint',
                'userinfo_endpoint',
                'jwks_uri'
            ];

            const missingEndpoints = [];

            for (const endpoint of requiredEndpoints) {
                if (!response.data[endpoint]) {
                    missingEndpoints.push(endpoint);
                }
            }

            if (missingEndpoints.length > 0) {
                console.log(`${colors.red}✗${colors.reset} Chybí následující endpointy: ${missingEndpoints.join(', ')}`);
                return false;
            }

            console.log(`${colors.green}✓${colors.reset} Všechny požadované endpointy jsou dostupné`);

            // Výpis důležitých endpointů
            console.log(`${colors.cyan}Důležité endpointy:${colors.reset}`);
            console.log(`- Authorization: ${response.data.authorization_endpoint}`);
            console.log(`- Token: ${response.data.token_endpoint}`);
            console.log(`- UserInfo: ${response.data.userinfo_endpoint}`);
            console.log(`- JWKS: ${response.data.jwks_uri}`);
        } else {
            console.log(`${colors.red}✗${colors.reset} Auth0 doména není dostupná (status: ${response.status})`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Chyba při kontrole Auth0 domény: ${error.message}`);
        return false;
    }

    // Kontrola callback URL
    const callbackUrl = process.env.AUTH0_CALLBACK_URL;
    console.log(`${colors.cyan}Kontrola callback URL ${callbackUrl}...${colors.reset}`);

    // Kontrola, zda callback URL obsahuje správný protokol
    if (!callbackUrl.startsWith('http://') && !callbackUrl.startsWith('https://')) {
        console.log(`${colors.red}✗${colors.reset} Callback URL neobsahuje správný protokol (http:// nebo https://)`);
        return false;
    }

    console.log(`${colors.green}✓${colors.reset} Callback URL obsahuje správný protokol`);

    // Kontrola, zda callback URL obsahuje správnou cestu
    if (!callbackUrl.endsWith('/callback')) {
        console.log(`${colors.red}✗${colors.reset} Callback URL neobsahuje správnou cestu (/callback)`);
        return false;
    }

    console.log(`${colors.green}✓${colors.reset} Callback URL obsahuje správnou cestu`);

    // Kontrola netlify.toml
    try {
        console.log(`${colors.cyan}Kontrola netlify.toml...${colors.reset}`);

        const netlifyTomlPath = path.join(__dirname, '..', 'netlify.toml');

        if (!fs.existsSync(netlifyTomlPath)) {
            console.log(`${colors.red}✗${colors.reset} Soubor netlify.toml neexistuje`);
            return false;
        }

        const netlifyToml = fs.readFileSync(netlifyTomlPath, 'utf8');

        // Kontrola, zda netlify.toml obsahuje správné přesměrování pro callback
        if (!netlifyToml.includes('from = "/callback"') && !netlifyToml.includes('from = "/auth/callback"')) {
            console.log(`${colors.red}✗${colors.reset} netlify.toml neobsahuje správné přesměrování pro callback`);
            return false;
        }

        console.log(`${colors.green}✓${colors.reset} netlify.toml obsahuje správné přesměrování pro callback`);

        // Kontrola, zda netlify.toml obsahuje správné přesměrování pro SPA
        if (!netlifyToml.includes('from = "/*"') || !netlifyToml.includes('to = "/index.html"')) {
            console.log(`${colors.red}✗${colors.reset} netlify.toml neobsahuje správné přesměrování pro SPA`);
            return false;
        }

        console.log(`${colors.green}✓${colors.reset} netlify.toml obsahuje správné přesměrování pro SPA`);
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Chyba při kontrole netlify.toml: ${error.message}`);
        return false;
    }

    // Kontrola server.js
    try {
        console.log(`${colors.cyan}Kontrola server.js...${colors.reset}`);

        const serverJsPath = path.join(__dirname, '..', 'server.js');

        if (!fs.existsSync(serverJsPath)) {
            console.log(`${colors.red}✗${colors.reset} Soubor server.js neexistuje`);
            return false;
        }

        const serverJs = fs.readFileSync(serverJsPath, 'utf8');

        // Kontrola, zda server.js obsahuje správnou konfiguraci Auth0
        if (!serverJs.includes('auth0Config') || !serverJs.includes('app.use(auth(auth0Config))')) {
            console.log(`${colors.red}✗${colors.reset} server.js neobsahuje správnou konfiguraci Auth0`);
            return false;
        }

        console.log(`${colors.green}✓${colors.reset} server.js obsahuje správnou konfiguraci Auth0`);

        // Kontrola, zda server.js obsahuje explicitní nastavení redirect_uri
        if (!serverJs.includes('authorizationParams') || !serverJs.includes('redirect_uri')) {
            console.log(`${colors.red}✗${colors.reset} server.js neobsahuje explicitní nastavení redirect_uri`);
            return false;
        }

        console.log(`${colors.green}✓${colors.reset} server.js obsahuje explicitní nastavení redirect_uri`);
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Chyba při kontrole server.js: ${error.message}`);
        return false;
    }

    console.log(`${colors.green}${colors.bright}=== AUTH0 KONFIGURACE JE SPRÁVNÁ ===${colors.reset}`);
    return true;
}

/**
 * Test dostupnosti domény
 */
async function testDomainAvailability() {
    console.log(`${colors.bright}${colors.blue}=== TEST DOSTUPNOSTI DOMÉNY ===${colors.reset}`);

    const domain = 'https://www.quicksoft.fun';

    try {
        console.log(`${colors.cyan}Kontrola dostupnosti domény ${domain}...${colors.reset}`);

        const response = await axios.get(domain);

        if (response.status === 200) {
            console.log(`${colors.green}✓${colors.reset} Doména je dostupná (status: ${response.status})`);
            return true;
        } else {
            console.log(`${colors.red}✗${colors.reset} Doména není dostupná (status: ${response.status})`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Chyba při kontrole dostupnosti domény: ${error.message}`);
        return false;
    }
}

/**
 * Test Auth0 přihlašovací stránky
 */
async function testAuth0LoginPage() {
    console.log(`${colors.bright}${colors.blue}=== TEST AUTH0 PŘIHLAŠOVACÍ STRÁNKY ===${colors.reset}`);

    const domain = 'https://www.quicksoft.fun';
    const loginUrl = `${domain}/login`;

    try {
        console.log(`${colors.cyan}Kontrola dostupnosti přihlašovací stránky ${loginUrl}...${colors.reset}`);

        const response = await axios.get(loginUrl, {
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // Akceptujeme i přesměrování
            }
        });

        if (response.status === 200) {
            console.log(`${colors.green}✓${colors.reset} Přihlašovací stránka je dostupná (status: ${response.status})`);
            return true;
        } else {
            console.log(`${colors.yellow}⚠${colors.reset} Přihlašovací stránka vrací status: ${response.status}`);

            if (response.headers.location && response.headers.location.includes('auth0.com')) {
                console.log(`${colors.green}✓${colors.reset} Přesměrování na Auth0 funguje správně`);
                console.log(`${colors.cyan}Přesměrování na: ${response.headers.location}${colors.reset}`);
                return true;
            } else {
                console.log(`${colors.red}✗${colors.reset} Přesměrování na Auth0 nefunguje správně`);
                return false;
            }
        }
    } catch (error) {
        // Pokud dostaneme chybu přesměrování, je to vlastně dobré znamení
        if (error.response && error.response.status === 302 && error.response.headers.location && error.response.headers.location.includes('auth0.com')) {
            console.log(`${colors.green}✓${colors.reset} Přesměrování na Auth0 funguje správně (status: 302)`);
            console.log(`${colors.cyan}Přesměrování na: ${error.response.headers.location}${colors.reset}`);
            return true;
        }

        console.log(`${colors.red}✗${colors.reset} Chyba při kontrole přihlašovací stránky: ${error.message}`);
        return false;
    }
}

/**
 * Hlavní funkce
 */
async function main() {
    console.log(`${colors.bright}${colors.magenta}=== AUTH0 TEST PRO DOMÉNU QUICKSOFT.FUN ===${colors.reset}`);
    console.log(`Verze: 0.4.1`);
    console.log(`Datum: ${new Date().toISOString()}`);
    console.log('');

    // Test konfigurace
    const isConfigOk = await testAuth0Config();

    if (!isConfigOk) {
        console.log(`${colors.red}${colors.bright}Test konfigurace selhal, ukončuji testy${colors.reset}`);
        process.exit(1);
    }

    // Test dostupnosti domény
    const isDomainAvailable = await testDomainAvailability();

    if (!isDomainAvailable) {
        console.log(`${colors.red}${colors.bright}Test dostupnosti domény selhal, ukončuji testy${colors.reset}`);
        process.exit(1);
    }

    // Test Auth0 přihlašovací stránky
    const isLoginPageOk = await testAuth0LoginPage();

    if (!isLoginPageOk) {
        console.log(`${colors.red}${colors.bright}Test Auth0 přihlašovací stránky selhal${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.green}${colors.bright}Všechny testy proběhly úspěšně${colors.reset}`);
    process.exit(0);
}

// Spuštění hlavní funkce
main().catch(error => {
    console.error(`${colors.red}Chyba:${colors.reset}`, error);
    process.exit(1);
});
