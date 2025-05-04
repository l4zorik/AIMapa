/**
 * Skript pro kontrolu a aktualizaci Auth0 konfigurace
 * Verze 0.4.1
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
 * Kontrola Auth0 konfigurace
 */
function checkAuth0Config() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA AUTH0 KONFIGURACE ===${colors.reset}`);
    
    // Načtení proměnných prostředí
    const envVars = loadEnvFile(ENV_FILE);
    const prodEnvVars = loadEnvFile(ENV_PRODUCTION_FILE);
    
    // Kontrola Auth0 konfigurace
    console.log(`\n${colors.cyan}Kontrola Auth0 konfigurace:${colors.reset}`);
    
    // Kontrola domény
    const auth0Domain = envVars.AUTH0_DOMAIN || prodEnvVars.AUTH0_DOMAIN;
    console.log(`${auth0Domain ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}AUTH0_DOMAIN: ${auth0Domain || 'Není nastaveno'}`);
    
    // Kontrola Client ID
    const auth0ClientId = envVars.AUTH0_CLIENT_ID || prodEnvVars.AUTH0_CLIENT_ID;
    console.log(`${auth0ClientId ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}AUTH0_CLIENT_ID: ${auth0ClientId ? auth0ClientId : 'Není nastaveno'}`);
    
    // Kontrola Client Secret
    const auth0ClientSecret = envVars.AUTH0_CLIENT_SECRET || prodEnvVars.AUTH0_CLIENT_SECRET;
    console.log(`${auth0ClientSecret ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}AUTH0_CLIENT_SECRET: ${auth0ClientSecret ? 'Nastaveno' : 'Není nastaveno'}`);
    
    // Kontrola Callback URL
    const auth0CallbackUrl = envVars.AUTH0_CALLBACK_URL || prodEnvVars.AUTH0_CALLBACK_URL;
    console.log(`${auth0CallbackUrl ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}AUTH0_CALLBACK_URL: ${auth0CallbackUrl || 'Není nastaveno'}`);
    
    // Kontrola Logout URL
    const auth0LogoutUrl = envVars.AUTH0_LOGOUT_URL || prodEnvVars.AUTH0_LOGOUT_URL;
    console.log(`${auth0LogoutUrl ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}AUTH0_LOGOUT_URL: ${auth0LogoutUrl || 'Není nastaveno'}`);
    
    // Kontrola Audience
    const auth0Audience = envVars.AUTH0_AUDIENCE || prodEnvVars.AUTH0_AUDIENCE;
    console.log(`${auth0Audience ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}AUTH0_AUDIENCE: ${auth0Audience || 'Není nastaveno'}`);
    
    // Kontrola Scope
    const auth0Scope = envVars.AUTH0_SCOPE || prodEnvVars.AUTH0_SCOPE;
    console.log(`${auth0Scope ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}AUTH0_SCOPE: ${auth0Scope || 'Není nastaveno'}`);
    
    // Kontrola BASE_URL
    const baseUrl = envVars.BASE_URL || prodEnvVars.BASE_URL;
    console.log(`${baseUrl ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}BASE_URL: ${baseUrl || 'Není nastaveno'}`);
    
    // Kontrola NODE_ENV
    const nodeEnv = envVars.NODE_ENV || prodEnvVars.NODE_ENV;
    console.log(`${nodeEnv ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}NODE_ENV: ${nodeEnv || 'Není nastaveno'}`);
    
    // Kontrola, zda jsou všechny potřebné proměnné nastaveny
    const isConfigComplete = auth0Domain && auth0ClientId && auth0ClientSecret && 
                            auth0CallbackUrl && auth0LogoutUrl && auth0Audience && 
                            auth0Scope && baseUrl;
    
    console.log(`\n${isConfigComplete ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Auth0 konfigurace je ${isConfigComplete ? 'kompletní' : 'nekompletní'}`);
    
    // Doporučení pro Auth0 dashboard
    console.log(`\n${colors.cyan}Doporučení pro Auth0 dashboard:${colors.reset}`);
    console.log(`1. Přihlaste se do Auth0 dashboardu: https://${auth0Domain}/dashboard/`);
    console.log(`2. Otevřete aplikaci s Client ID: ${auth0ClientId}`);
    console.log(`3. V sekci "Settings" zkontrolujte následující nastavení:`);
    console.log(`   - Application Type: Regular Web Application`);
    console.log(`   - Allowed Callback URLs: ${auth0CallbackUrl}`);
    console.log(`   - Allowed Logout URLs: ${auth0LogoutUrl}`);
    console.log(`   - Allowed Web Origins: ${baseUrl}`);
    console.log(`   - Token Endpoint Authentication Method: Post`);
    console.log(`   - ID Token Expiration: 36000 (10 hodin)`);
    console.log(`   - Refresh Token Rotation: Enabled`);
    console.log(`   - Refresh Token Expiration: 2592000 (30 dní)`);
    
    return isConfigComplete;
}

/**
 * Hlavní funkce
 */
function main() {
    console.log(`${colors.bright}${colors.magenta}=== AUTH0 KONFIGURACE CHECKER ===${colors.reset}`);
    console.log(`Verze: 0.4.1`);
    console.log(`Datum: ${new Date().toISOString()}`);
    console.log('');
    
    // Kontrola Auth0 konfigurace
    const isConfigOk = checkAuth0Config();
    
    if (isConfigOk) {
        console.log(`\n${colors.green}${colors.bright}Auth0 konfigurace je v pořádku${colors.reset}`);
    } else {
        console.log(`\n${colors.red}${colors.bright}Auth0 konfigurace není kompletní${colors.reset}`);
        console.log(`${colors.yellow}Zkontrolujte výše uvedená doporučení a opravte konfiguraci${colors.reset}`);
    }
}

// Spuštění hlavní funkce
main();
