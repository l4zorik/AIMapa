/**
 * Skript pro aktualizaci Auth0 konfigurace
 * Verze 0.4.1
 *
 * Tento skript používá Auth0 Management API k aktualizaci konfigurace aplikace
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

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

// Konfigurace
const ENV_PRODUCTION_FILE = '.env.production';
const ENV_FILE = '.env';

/**
 * Načte proměnné prostředí ze souboru
 * @param {string} filePath - Cesta k souboru
 * @returns {Object} Objekt s proměnnými prostředí
 */
function loadEnvFile(filePath) {
    try {
        const envContent = fs.readFileSync(filePath, 'utf8');
        const envVars = {};

        envContent.split('\n').forEach(line => {
            // Přeskočení komentářů a prázdných řádků
            if (line.trim().startsWith('#') || line.trim() === '') {
                return;
            }

            // Rozdělení řádku na klíč a hodnotu
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();

                // Odstranění uvozovek, pokud existují
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }

                envVars[key] = value;
            }
        });

        return envVars;
    } catch (error) {
        console.error(`${colors.red}Chyba při načítání souboru ${filePath}:${colors.reset}`, error.message);
        return {};
    }
}

/**
 * Získá Management API token
 * @param {Object} config - Konfigurace Auth0
 * @returns {Promise<string>} Management API token
 */
async function getManagementApiToken(config) {
    try {
        console.log(`Získávání tokenu pro doménu: ${config.domain}`);
        console.log(`Client ID: ${config.clientId}`);
        console.log(`Client Secret: ${config.clientSecret ? 'Nastaveno' : 'Chybí'}`);

        const response = await axios.post(`https://${config.domain}/oauth/token`, {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            audience: `https://${config.domain}/api/v2/`,
            grant_type: 'client_credentials'
        });

        if (response.data && response.data.access_token) {
            return response.data.access_token;
        } else {
            console.error(`${colors.red}Chyba: Token nebyl vrácen v odpovědi${colors.reset}`);
            console.log('Odpověď:', JSON.stringify(response.data, null, 2));
            throw new Error('Token nebyl vrácen v odpovědi');
        }
    } catch (error) {
        console.error(`${colors.red}Chyba při získávání Management API tokenu:${colors.reset}`, error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

/**
 * Aktualizuje konfiguraci aplikace v Auth0
 * @param {Object} config - Konfigurace Auth0
 * @param {string} token - Management API token
 * @returns {Promise<Object>} Aktualizovaná konfigurace aplikace
 */
async function updateApplicationConfig(config, token) {
    try {
        const response = await axios.patch(
            `https://${config.domain}/api/v2/clients/${config.clientId}`,
            {
                callbacks: [config.callbackUrl],
                allowed_logout_urls: [config.logoutUrl],
                web_origins: [config.baseUrl],
                jwt_configuration: {
                    lifetime_in_seconds: 36000,
                    alg: 'RS256'
                },
                refresh_token: {
                    rotation_type: 'rotating',
                    expiration_type: 'expiring',
                    leeway: 0,
                    token_lifetime: 2592000,
                    infinite_token_lifetime: false,
                    idle_token_lifetime: 1296000,
                    infinite_idle_token_lifetime: false
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`${colors.red}Chyba při aktualizaci konfigurace aplikace:${colors.reset}`, error.response?.data || error.message);
        throw error;
    }
}

/**
 * Hlavní funkce
 */
async function main() {
    console.log(`${colors.bright}${colors.magenta}=== AUTH0 KONFIGURACE UPDATER ===${colors.reset}`);
    console.log(`Verze: 0.4.1`);
    console.log(`Datum: ${new Date().toISOString()}`);
    console.log('');

    // Načtení proměnných prostředí
    const envVars = loadEnvFile(ENV_FILE);
    const prodEnvVars = loadEnvFile(ENV_PRODUCTION_FILE);

    // Konfigurace Auth0
    const config = {
        domain: prodEnvVars.AUTH0_DOMAIN || envVars.AUTH0_DOMAIN,
        clientId: prodEnvVars.AUTH0_CLIENT_ID || envVars.AUTH0_CLIENT_ID,
        clientSecret: prodEnvVars.AUTH0_CLIENT_SECRET || envVars.AUTH0_CLIENT_SECRET,
        callbackUrl: prodEnvVars.AUTH0_CALLBACK_URL || envVars.AUTH0_CALLBACK_URL,
        logoutUrl: prodEnvVars.AUTH0_LOGOUT_URL || envVars.AUTH0_LOGOUT_URL,
        baseUrl: prodEnvVars.BASE_URL || envVars.BASE_URL
    };

    // Kontrola konfigurace
    const missingConfig = Object.entries(config)
        .filter(([key, value]) => !value)
        .map(([key]) => key);

    if (missingConfig.length > 0) {
        console.error(`${colors.red}Chybí následující konfigurace:${colors.reset}`, missingConfig.join(', '));
        process.exit(1);
    }

    try {
        // Získání Management API tokenu
        console.log(`${colors.cyan}Získávání Management API tokenu...${colors.reset}`);
        const token = await getManagementApiToken(config);
        console.log(`${colors.green}✓${colors.reset} Management API token získán`);

        // Aktualizace konfigurace aplikace
        console.log(`${colors.cyan}Aktualizace konfigurace aplikace...${colors.reset}`);
        const updatedConfig = await updateApplicationConfig(config, token);
        console.log(`${colors.green}✓${colors.reset} Konfigurace aplikace aktualizována`);

        // Výpis aktualizované konfigurace
        console.log(`\n${colors.cyan}Aktualizovaná konfigurace:${colors.reset}`);
        console.log(`- Allowed Callback URLs: ${updatedConfig.callbacks.join(', ')}`);
        console.log(`- Allowed Logout URLs: ${updatedConfig.allowed_logout_urls.join(', ')}`);
        console.log(`- Allowed Web Origins: ${updatedConfig.web_origins.join(', ')}`);
        console.log(`- Token Lifetime: ${updatedConfig.jwt_configuration.lifetime_in_seconds} sekund`);
        console.log(`- Refresh Token Rotation: ${updatedConfig.refresh_token.rotation_type === 'rotating' ? 'Enabled' : 'Disabled'}`);
        console.log(`- Refresh Token Lifetime: ${updatedConfig.refresh_token.token_lifetime} sekund`);

        console.log(`\n${colors.green}${colors.bright}Auth0 konfigurace byla úspěšně aktualizována${colors.reset}`);
    } catch (error) {
        console.error(`\n${colors.red}${colors.bright}Chyba při aktualizaci Auth0 konfigurace${colors.reset}`);
        process.exit(1);
    }
}

// Spuštění hlavní funkce
main().catch(error => {
    console.error(`${colors.red}Chyba:${colors.reset}`, error);
    process.exit(1);
});
