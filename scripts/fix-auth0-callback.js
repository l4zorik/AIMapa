/**
 * Skript pro automatickou opravu problémů s Auth0 callback URL
 * 
 * Tento skript kontroluje a opravuje běžné problémy s Auth0 callback URL:
 * 1. Chybějící explicitní nastavení redirect_uri
 * 2. Nesprávná cesta pro callback
 * 3. Nesprávné nastavení v .env souborech
 * 4. Nesprávné přesměrování v netlify.toml
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

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
 * Hlavní funkce
 */
async function main() {
    console.log(`${colors.bright}${colors.magenta}=== AUTH0 CALLBACK URL FIXER ===${colors.reset}`);
    console.log(`Verze: 1.0.0`);
    console.log(`Datum: ${new Date().toISOString()}`);
    console.log('');
    
    // Kontrola a oprava server.js
    await fixServerJs();
    
    // Kontrola a oprava .env souborů
    await fixEnvFiles();
    
    // Kontrola a oprava netlify.toml
    await fixNetlifyToml();
    
    console.log('');
    console.log(`${colors.green}${colors.bright}Oprava dokončena${colors.reset}`);
}

/**
 * Kontrola a oprava server.js
 */
async function fixServerJs() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA SERVER.JS ===${colors.reset}`);
    
    const serverJsPath = path.join(__dirname, '..', 'server.js');
    
    if (!fs.existsSync(serverJsPath)) {
        console.log(`${colors.red}✗${colors.reset} Soubor server.js neexistuje`);
        return;
    }
    
    let serverJs = fs.readFileSync(serverJsPath, 'utf8');
    let modified = false;
    
    // Kontrola, zda server.js obsahuje Auth0 konfiguraci
    if (!serverJs.includes('auth0Config')) {
        console.log(`${colors.red}✗${colors.reset} server.js neobsahuje Auth0 konfiguraci`);
        return;
    }
    
    console.log(`${colors.green}✓${colors.reset} server.js obsahuje Auth0 konfiguraci`);
    
    // Kontrola, zda server.js obsahuje explicitní nastavení redirect_uri
    if (!serverJs.includes('authorizationParams') || !serverJs.includes('redirect_uri')) {
        console.log(`${colors.yellow}⚠${colors.reset} server.js neobsahuje explicitní nastavení redirect_uri, přidávám...`);
        
        // Najít konec auth0Config objektu
        const configRegex = /const auth0Config = \{([\s\S]*?)\};/;
        const configMatch = serverJs.match(configRegex);
        
        if (configMatch) {
            const configContent = configMatch[1];
            const configEnd = configMatch[0].lastIndexOf('}');
            
            // Kontrola, zda již obsahuje authorizationParams
            if (configContent.includes('authorizationParams')) {
                console.log(`${colors.yellow}⚠${colors.reset} server.js již obsahuje authorizationParams, ale ne redirect_uri`);
                
                // Najít konec authorizationParams objektu
                const paramsRegex = /authorizationParams: \{([\s\S]*?)\}/;
                const paramsMatch = configContent.match(paramsRegex);
                
                if (paramsMatch) {
                    const paramsContent = paramsMatch[1];
                    const paramsEnd = paramsMatch[0].lastIndexOf('}');
                    
                    // Přidat redirect_uri do authorizationParams
                    const newParamsContent = paramsContent + `\n    redirect_uri: process.env.AUTH0_CALLBACK_URL || 'https://www.quicksoft.fun/callback',`;
                    const newParams = paramsMatch[0].substring(0, paramsEnd) + newParamsContent + paramsMatch[0].substring(paramsEnd);
                    
                    serverJs = serverJs.replace(paramsMatch[0], newParams);
                    modified = true;
                }
            } else {
                // Přidat authorizationParams do auth0Config
                const newConfigContent = configContent + `\n  authorizationParams: {
    response_type: 'code',
    redirect_uri: process.env.AUTH0_CALLBACK_URL || 'https://www.quicksoft.fun/callback',
    scope: process.env.AUTH0_SCOPE || 'openid profile email'
  },`;
                
                const newConfig = configMatch[0].substring(0, configEnd) + newConfigContent + configMatch[0].substring(configEnd);
                
                serverJs = serverJs.replace(configMatch[0], newConfig);
                modified = true;
            }
        }
    } else {
        console.log(`${colors.green}✓${colors.reset} server.js obsahuje explicitní nastavení redirect_uri`);
    }
    
    // Kontrola, zda server.js obsahuje správnou cestu pro callback
    if (!serverJs.includes('routes') || !serverJs.includes('callback')) {
        console.log(`${colors.yellow}⚠${colors.reset} server.js neobsahuje nastavení cesty pro callback, přidávám...`);
        
        // Najít konec auth0Config objektu
        const configRegex = /const auth0Config = \{([\s\S]*?)\};/;
        const configMatch = serverJs.match(configRegex);
        
        if (configMatch) {
            const configContent = configMatch[1];
            const configEnd = configMatch[0].lastIndexOf('}');
            
            // Kontrola, zda již obsahuje routes
            if (configContent.includes('routes')) {
                console.log(`${colors.yellow}⚠${colors.reset} server.js již obsahuje routes, ale ne callback`);
                
                // Najít konec routes objektu
                const routesRegex = /routes: \{([\s\S]*?)\}/;
                const routesMatch = configContent.match(routesRegex);
                
                if (routesMatch) {
                    const routesContent = routesMatch[1];
                    const routesEnd = routesMatch[0].lastIndexOf('}');
                    
                    // Přidat callback do routes
                    const newRoutesContent = routesContent + `\n    callback: '/callback',`;
                    const newRoutes = routesMatch[0].substring(0, routesEnd) + newRoutesContent + routesMatch[0].substring(routesEnd);
                    
                    serverJs = serverJs.replace(routesMatch[0], newRoutes);
                    modified = true;
                }
            } else {
                // Přidat routes do auth0Config
                const newConfigContent = configContent + `\n  routes: {
    callback: '/callback'
  },`;
                
                const newConfig = configMatch[0].substring(0, configEnd) + newConfigContent + configMatch[0].substring(configEnd);
                
                serverJs = serverJs.replace(configMatch[0], newConfig);
                modified = true;
            }
        }
    } else {
        console.log(`${colors.green}✓${colors.reset} server.js obsahuje nastavení cesty pro callback`);
    }
    
    // Uložit změny
    if (modified) {
        fs.writeFileSync(serverJsPath, serverJs);
        console.log(`${colors.green}✓${colors.reset} server.js byl úspěšně aktualizován`);
    } else {
        console.log(`${colors.green}✓${colors.reset} server.js je již správně nakonfigurován`);
    }
}

/**
 * Kontrola a oprava .env souborů
 */
async function fixEnvFiles() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA .ENV SOUBORŮ ===${colors.reset}`);
    
    // Kontrola .env
    const envPath = path.join(__dirname, '..', '.env');
    
    if (fs.existsSync(envPath)) {
        console.log(`${colors.cyan}Kontrola .env...${colors.reset}`);
        
        let envContent = fs.readFileSync(envPath, 'utf8');
        let modified = false;
        
        // Načtení proměnných prostředí
        const env = dotenv.parse(envContent);
        
        // Kontrola BASE_URL
        if (!env.BASE_URL) {
            console.log(`${colors.yellow}⚠${colors.reset} .env neobsahuje BASE_URL, přidávám...`);
            
            envContent += '\nBASE_URL=http://localhost:3000';
            modified = true;
        } else {
            console.log(`${colors.green}✓${colors.reset} .env obsahuje BASE_URL: ${env.BASE_URL}`);
        }
        
        // Kontrola AUTH0_CALLBACK_URL
        if (!env.AUTH0_CALLBACK_URL) {
            console.log(`${colors.yellow}⚠${colors.reset} .env neobsahuje AUTH0_CALLBACK_URL, přidávám...`);
            
            envContent += '\nAUTH0_CALLBACK_URL=http://localhost:3000/callback';
            modified = true;
        } else if (!env.AUTH0_CALLBACK_URL.endsWith('/callback')) {
            console.log(`${colors.yellow}⚠${colors.reset} .env obsahuje nesprávnou AUTH0_CALLBACK_URL, opravuji...`);
            
            envContent = envContent.replace(
                `AUTH0_CALLBACK_URL=${env.AUTH0_CALLBACK_URL}`,
                `AUTH0_CALLBACK_URL=http://localhost:3000/callback`
            );
            modified = true;
        } else {
            console.log(`${colors.green}✓${colors.reset} .env obsahuje správnou AUTH0_CALLBACK_URL: ${env.AUTH0_CALLBACK_URL}`);
        }
        
        // Kontrola AUTH0_SECRET
        if (!env.AUTH0_SECRET) {
            console.log(`${colors.yellow}⚠${colors.reset} .env neobsahuje AUTH0_SECRET, přidávám...`);
            
            if (env.AUTH0_CLIENT_SECRET) {
                envContent += `\nAUTH0_SECRET=${env.AUTH0_CLIENT_SECRET}`;
            } else {
                envContent += '\nAUTH0_SECRET=a-long-random-string-for-auth0-secret';
            }
            modified = true;
        } else {
            console.log(`${colors.green}✓${colors.reset} .env obsahuje AUTH0_SECRET`);
        }
        
        // Uložit změny
        if (modified) {
            fs.writeFileSync(envPath, envContent);
            console.log(`${colors.green}✓${colors.reset} .env byl úspěšně aktualizován`);
        } else {
            console.log(`${colors.green}✓${colors.reset} .env je již správně nakonfigurován`);
        }
    } else {
        console.log(`${colors.yellow}⚠${colors.reset} Soubor .env neexistuje`);
    }
    
    // Kontrola .env.production
    const envProdPath = path.join(__dirname, '..', '.env.production');
    
    if (fs.existsSync(envProdPath)) {
        console.log(`${colors.cyan}Kontrola .env.production...${colors.reset}`);
        
        let envProdContent = fs.readFileSync(envProdPath, 'utf8');
        let modified = false;
        
        // Načtení proměnných prostředí
        const envProd = dotenv.parse(envProdContent);
        
        // Kontrola BASE_URL
        if (!envProd.BASE_URL) {
            console.log(`${colors.yellow}⚠${colors.reset} .env.production neobsahuje BASE_URL, přidávám...`);
            
            envProdContent += '\nBASE_URL=https://www.quicksoft.fun';
            modified = true;
        } else {
            console.log(`${colors.green}✓${colors.reset} .env.production obsahuje BASE_URL: ${envProd.BASE_URL}`);
        }
        
        // Kontrola AUTH0_CALLBACK_URL
        if (!envProd.AUTH0_CALLBACK_URL) {
            console.log(`${colors.yellow}⚠${colors.reset} .env.production neobsahuje AUTH0_CALLBACK_URL, přidávám...`);
            
            envProdContent += '\nAUTH0_CALLBACK_URL=https://www.quicksoft.fun/callback';
            modified = true;
        } else if (!envProd.AUTH0_CALLBACK_URL.endsWith('/callback')) {
            console.log(`${colors.yellow}⚠${colors.reset} .env.production obsahuje nesprávnou AUTH0_CALLBACK_URL, opravuji...`);
            
            envProdContent = envProdContent.replace(
                `AUTH0_CALLBACK_URL=${envProd.AUTH0_CALLBACK_URL}`,
                `AUTH0_CALLBACK_URL=https://www.quicksoft.fun/callback`
            );
            modified = true;
        } else {
            console.log(`${colors.green}✓${colors.reset} .env.production obsahuje správnou AUTH0_CALLBACK_URL: ${envProd.AUTH0_CALLBACK_URL}`);
        }
        
        // Kontrola AUTH0_SECRET
        if (!envProd.AUTH0_SECRET) {
            console.log(`${colors.yellow}⚠${colors.reset} .env.production neobsahuje AUTH0_SECRET, přidávám...`);
            
            if (envProd.AUTH0_CLIENT_SECRET) {
                envProdContent += `\nAUTH0_SECRET=${envProd.AUTH0_CLIENT_SECRET}`;
            } else {
                envProdContent += '\nAUTH0_SECRET=a-long-random-string-for-auth0-secret';
            }
            modified = true;
        } else {
            console.log(`${colors.green}✓${colors.reset} .env.production obsahuje AUTH0_SECRET`);
        }
        
        // Uložit změny
        if (modified) {
            fs.writeFileSync(envProdPath, envProdContent);
            console.log(`${colors.green}✓${colors.reset} .env.production byl úspěšně aktualizován`);
        } else {
            console.log(`${colors.green}✓${colors.reset} .env.production je již správně nakonfigurován`);
        }
    } else {
        console.log(`${colors.yellow}⚠${colors.reset} Soubor .env.production neexistuje`);
    }
}

/**
 * Kontrola a oprava netlify.toml
 */
async function fixNetlifyToml() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA NETLIFY.TOML ===${colors.reset}`);
    
    const netlifyTomlPath = path.join(__dirname, '..', 'netlify.toml');
    
    if (!fs.existsSync(netlifyTomlPath)) {
        console.log(`${colors.red}✗${colors.reset} Soubor netlify.toml neexistuje`);
        return;
    }
    
    let netlifyToml = fs.readFileSync(netlifyTomlPath, 'utf8');
    let modified = false;
    
    // Kontrola, zda netlify.toml obsahuje správné přesměrování pro callback
    if (!netlifyToml.includes('from = "/callback"')) {
        console.log(`${colors.yellow}⚠${colors.reset} netlify.toml neobsahuje správné přesměrování pro callback, přidávám...`);
        
        // Kontrola, zda obsahuje přesměrování pro /auth/callback
        if (netlifyToml.includes('from = "/auth/callback"')) {
            console.log(`${colors.yellow}⚠${colors.reset} netlify.toml obsahuje přesměrování pro /auth/callback, měním na /callback...`);
            
            netlifyToml = netlifyToml.replace(
                'from = "/auth/callback"',
                'from = "/callback"'
            );
        } else {
            // Přidat přesměrování pro /callback
            const redirectsSection = netlifyToml.includes('[[redirects]]') ? '' : '[[redirects]]\n';
            const callbackRedirect = `${redirectsSection}  from = "/callback"\n  to = "/index.html"\n  status = 200\n\n`;
            
            // Najít vhodné místo pro vložení
            if (netlifyToml.includes('[build]')) {
                const buildSectionEnd = netlifyToml.indexOf('[build]') + netlifyToml.substring(netlifyToml.indexOf('[build]')).indexOf('\n\n');
                
                netlifyToml = netlifyToml.substring(0, buildSectionEnd + 2) + callbackRedirect + netlifyToml.substring(buildSectionEnd + 2);
            } else {
                netlifyToml = callbackRedirect + netlifyToml;
            }
        }
        
        modified = true;
    } else {
        console.log(`${colors.green}✓${colors.reset} netlify.toml obsahuje správné přesměrování pro callback`);
    }
    
    // Kontrola, zda netlify.toml obsahuje správné přesměrování pro SPA
    if (!netlifyToml.includes('from = "/*"')) {
        console.log(`${colors.yellow}⚠${colors.reset} netlify.toml neobsahuje správné přesměrování pro SPA, přidávám...`);
        
        // Přidat přesměrování pro /*
        const redirectsSection = netlifyToml.includes('[[redirects]]') ? '' : '[[redirects]]\n';
        const spaRedirect = `${redirectsSection}  from = "/*"\n  to = "/index.html"\n  status = 200\n\n`;
        
        // Najít vhodné místo pro vložení
        if (netlifyToml.includes('[[redirects]]')) {
            const lastRedirectEnd = netlifyToml.lastIndexOf('[[redirects]]');
            const nextSection = netlifyToml.indexOf('[[', lastRedirectEnd + 1);
            
            if (nextSection !== -1) {
                netlifyToml = netlifyToml.substring(0, nextSection) + spaRedirect + netlifyToml.substring(nextSection);
            } else {
                netlifyToml += spaRedirect;
            }
        } else {
            netlifyToml += spaRedirect;
        }
        
        modified = true;
    } else {
        console.log(`${colors.green}✓${colors.reset} netlify.toml obsahuje správné přesměrování pro SPA`);
    }
    
    // Uložit změny
    if (modified) {
        fs.writeFileSync(netlifyTomlPath, netlifyToml);
        console.log(`${colors.green}✓${colors.reset} netlify.toml byl úspěšně aktualizován`);
    } else {
        console.log(`${colors.green}✓${colors.reset} netlify.toml je již správně nakonfigurován`);
    }
}

// Spuštění hlavní funkce
main().catch(error => {
    console.error(`${colors.red}Chyba:${colors.reset}`, error);
    process.exit(1);
});
