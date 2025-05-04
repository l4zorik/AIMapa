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

// Načtení proměnných prostředí
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
    console.log('Načteny produkční proměnné prostředí z .env.production');
} else {
    dotenv.config();
    console.log('Načteny vývojové proměnné prostředí z .env');
}

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
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Chyba při kontrole server.js: ${error.message}`);
        return false;
    }
    
    console.log(`${colors.green}${colors.bright}=== AUTH0 KONFIGURACE JE SPRÁVNÁ ===${colors.reset}`);
    return true;
}

/**
 * Hlavní funkce
 */
async function main() {
    console.log(`${colors.bright}${colors.magenta}=== AUTH0 TEST ===${colors.reset}`);
    console.log(`Verze: 0.4.1`);
    console.log(`Datum: ${new Date().toISOString()}`);
    console.log('');
    
    const isConfigOk = await testAuth0Config();
    
    if (isConfigOk) {
        console.log(`${colors.green}${colors.bright}Všechny testy proběhly úspěšně${colors.reset}`);
        process.exit(0);
    } else {
        console.log(`${colors.red}${colors.bright}Některé testy selhaly${colors.reset}`);
        process.exit(1);
    }
}

// Spuštění hlavní funkce
main().catch(error => {
    console.error(`${colors.red}Chyba:${colors.reset}`, error);
    process.exit(1);
});
