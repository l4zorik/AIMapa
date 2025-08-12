/**
 * Skript pro deploy aplikace AIMapa na Netlify
 * Verze 0.3.8.6
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

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
const NETLIFY_TOML_FILE = 'netlify.toml';
const REQUIRED_FILES = [
    'server.js',
    'public/index.html',
    'public/app/map.js',
    'public/app/globe-simple.js',
    'public/app/auth0-auth.js'
];
const REQUIRED_ENV_VARS = [
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'SUPABASE_URL',
    'SUPABASE_KEY'
];

/**
 * Kontrola, zda je nainstalován Netlify CLI
 */
function checkNetlifyCLI() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA NETLIFY CLI ===${colors.reset}`);
    
    try {
        const output = execSync('netlify --version', { encoding: 'utf8' });
        console.log(`${colors.green}✓${colors.reset} Netlify CLI je nainstalován: ${output.trim()}`);
        return true;
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Netlify CLI není nainstalován`);
        console.log(`${colors.yellow}Pro instalaci Netlify CLI spusťte: npm install -g netlify-cli${colors.reset}`);
        return false;
    }
}

/**
 * Kontrola, zda je uživatel přihlášen k Netlify
 */
function checkNetlifyLogin() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA PŘIHLÁŠENÍ K NETLIFY ===${colors.reset}`);
    
    try {
        const output = execSync('netlify status', { encoding: 'utf8' });
        if (output.includes('Logged in')) {
            console.log(`${colors.green}✓${colors.reset} Uživatel je přihlášen k Netlify`);
            
            // Získání informací o aktuálním projektu
            if (output.includes('Current site:')) {
                const siteMatch = output.match(/Current site:\\s+(.+)/);
                if (siteMatch && siteMatch[1]) {
                    console.log(`${colors.green}✓${colors.reset} Aktuální projekt: ${siteMatch[1]}`);
                }
            }
            
            return true;
        } else {
            console.log(`${colors.red}✗${colors.reset} Uživatel není přihlášen k Netlify`);
            console.log(`${colors.yellow}Pro přihlášení k Netlify spusťte: netlify login${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Nelze zjistit stav přihlášení k Netlify`);
        console.log(`${colors.yellow}Pro přihlášení k Netlify spusťte: netlify login${colors.reset}`);
        return false;
    }
}

/**
 * Kontrola konfiguračních souborů
 */
function checkConfigFiles() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA KONFIGURAČNÍCH SOUBORŮ ===${colors.reset}`);
    
    // Kontrola .env.production
    const envProductionExists = fs.existsSync(ENV_PRODUCTION_FILE);
    console.log(`${envProductionExists ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Soubor ${ENV_PRODUCTION_FILE} ${envProductionExists ? 'existuje' : 'neexistuje'}`);
    
    if (envProductionExists) {
        // Kontrola proměnných prostředí v .env.production
        const envContent = fs.readFileSync(ENV_PRODUCTION_FILE, 'utf8');
        console.log(`\nProměnné prostředí v ${ENV_PRODUCTION_FILE}:`);
        
        REQUIRED_ENV_VARS.forEach(varName => {
            const exists = envContent.includes(varName + '=');
            console.log(`${exists ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}${varName}`);
        });
    } else {
        console.log(`${colors.yellow}⚠${colors.reset} Soubor ${ENV_PRODUCTION_FILE} je vyžadován pro produkční nasazení`);
        console.log(`${colors.yellow}Vytvořte soubor ${ENV_PRODUCTION_FILE} s produkčními proměnnými prostředí${colors.reset}`);
    }
    
    // Kontrola netlify.toml
    const netlifyTomlExists = fs.existsSync(NETLIFY_TOML_FILE);
    console.log(`\n${netlifyTomlExists ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Soubor ${NETLIFY_TOML_FILE} ${netlifyTomlExists ? 'existuje' : 'neexistuje'}`);
    
    if (netlifyTomlExists) {
        // Kontrola obsahu netlify.toml
        const tomlContent = fs.readFileSync(NETLIFY_TOML_FILE, 'utf8');
        
        const hasBuildCommand = tomlContent.includes('command =');
        const hasPublishDir = tomlContent.includes('publish =');
        const hasRedirects = tomlContent.includes('[[redirects]]');
        
        console.log(`${hasBuildCommand ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Build command v ${NETLIFY_TOML_FILE}`);
        console.log(`${hasPublishDir ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Publish directory v ${NETLIFY_TOML_FILE}`);
        console.log(`${hasRedirects ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}Redirects v ${NETLIFY_TOML_FILE}`);
    } else {
        console.log(`${colors.yellow}⚠${colors.reset} Soubor ${NETLIFY_TOML_FILE} je doporučen pro konfiguraci Netlify`);
        console.log(`${colors.yellow}Vytvořte soubor ${NETLIFY_TOML_FILE} s konfigurací pro Netlify${colors.reset}`);
    }
    
    // Kontrola požadovaných souborů
    console.log('\nKontrola požadovaných souborů:');
    let allFilesExist = true;
    
    REQUIRED_FILES.forEach(file => {
        const exists = fs.existsSync(file);
        console.log(`${exists ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}${file}`);
        if (!exists) {
            allFilesExist = false;
        }
    });
    
    return envProductionExists && allFilesExist;
}

/**
 * Kontrola konfigurace Auth0 pro produkci
 */
function checkAuth0ProductionConfig() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA KONFIGURACE AUTH0 PRO PRODUKCI ===${colors.reset}`);
    
    if (!fs.existsSync(ENV_PRODUCTION_FILE)) {
        console.log(`${colors.red}✗${colors.reset} Soubor ${ENV_PRODUCTION_FILE} neexistuje, nelze zkontrolovat konfiguraci Auth0`);
        return false;
    }
    
    const envContent = fs.readFileSync(ENV_PRODUCTION_FILE, 'utf8');
    
    // Kontrola Auth0 konfigurace
    const auth0Domain = envContent.match(/AUTH0_ISSUER_BASE_URL=(.+)/);
    const auth0ClientId = envContent.match(/AUTH0_CLIENT_ID=(.+)/);
    const auth0BaseUrl = envContent.match(/AUTH0_BASE_URL=(.+)/);
    
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
    
    if (auth0BaseUrl && auth0BaseUrl[1]) {
        console.log(`${colors.green}✓${colors.reset} AUTH0_BASE_URL: ${auth0BaseUrl[1]}`);
        
        // Kontrola, zda AUTH0_BASE_URL obsahuje produkční URL
        if (auth0BaseUrl[1].includes('netlify.app')) {
            console.log(`${colors.green}✓${colors.reset} AUTH0_BASE_URL obsahuje produkční URL`);
        } else {
            console.log(`${colors.yellow}⚠${colors.reset} AUTH0_BASE_URL neobsahuje produkční URL (netlify.app)`);
        }
    } else {
        console.log(`${colors.red}✗${colors.reset} AUTH0_BASE_URL není nastaveno`);
    }
    
    return auth0Domain && auth0ClientId && auth0BaseUrl;
}

/**
 * Kontrola konfigurace Supabase pro produkci
 */
function checkSupabaseProductionConfig() {
    console.log(`${colors.bright}${colors.blue}=== KONTROLA KONFIGURACE SUPABASE PRO PRODUKCI ===${colors.reset}`);
    
    if (!fs.existsSync(ENV_PRODUCTION_FILE)) {
        console.log(`${colors.red}✗${colors.reset} Soubor ${ENV_PRODUCTION_FILE} neexistuje, nelze zkontrolovat konfiguraci Supabase`);
        return false;
    }
    
    const envContent = fs.readFileSync(ENV_PRODUCTION_FILE, 'utf8');
    
    // Kontrola Supabase konfigurace
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
    
    return supabaseUrl && supabaseKey;
}

/**
 * Příprava souborů pro nasazení
 */
function prepareFilesForDeploy() {
    console.log(`${colors.bright}${colors.blue}=== PŘÍPRAVA SOUBORŮ PRO NASAZENÍ ===${colors.reset}`);
    
    // Kontrola, zda existuje složka pro build
    const buildDir = 'dist';
    if (!fs.existsSync(buildDir)) {
        console.log(`${colors.yellow}⚠${colors.reset} Složka ${buildDir} neexistuje, vytvářím...`);
        fs.mkdirSync(buildDir);
    } else {
        console.log(`${colors.green}✓${colors.reset} Složka ${buildDir} existuje`);
    }
    
    // Kopírování souborů do build složky
    console.log(`${colors.cyan}Kopíruji soubory do složky ${buildDir}...${colors.reset}`);
    
    // Kopírování server.js
    fs.copyFileSync('server.js', path.join(buildDir, 'server.js'));
    console.log(`${colors.green}✓${colors.reset} Zkopírován soubor server.js`);
    
    // Kopírování package.json
    if (fs.existsSync('package.json')) {
        fs.copyFileSync('package.json', path.join(buildDir, 'package.json'));
        console.log(`${colors.green}✓${colors.reset} Zkopírován soubor package.json`);
    }
    
    // Kopírování .env.production jako .env
    if (fs.existsSync(ENV_PRODUCTION_FILE)) {
        fs.copyFileSync(ENV_PRODUCTION_FILE, path.join(buildDir, '.env'));
        console.log(`${colors.green}✓${colors.reset} Zkopírován soubor ${ENV_PRODUCTION_FILE} jako .env`);
    }
    
    // Kopírování netlify.toml
    if (fs.existsSync(NETLIFY_TOML_FILE)) {
        fs.copyFileSync(NETLIFY_TOML_FILE, path.join(buildDir, NETLIFY_TOML_FILE));
        console.log(`${colors.green}✓${colors.reset} Zkopírován soubor ${NETLIFY_TOML_FILE}`);
    }
    
    // Kopírování složky public
    if (fs.existsSync('public')) {
        copyFolderRecursiveSync('public', buildDir);
        console.log(`${colors.green}✓${colors.reset} Zkopírována složka public`);
    }
    
    console.log(`${colors.green}✓${colors.reset} Soubory připraveny pro nasazení`);
    return true;
}

/**
 * Rekurzivní kopírování složky
 */
function copyFolderRecursiveSync(source, target) {
    const targetFolder = path.join(target, path.basename(source));
    
    // Vytvoření cílové složky, pokud neexistuje
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
    }
    
    // Kopírování souborů
    if (fs.lstatSync(source).isDirectory()) {
        const files = fs.readdirSync(source);
        files.forEach(file => {
            const curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                fs.copyFileSync(curSource, path.join(targetFolder, file));
            }
        });
    }
}

/**
 * Nasazení na Netlify
 */
function deployToNetlify() {
    console.log(`${colors.bright}${colors.blue}=== NASAZENÍ NA NETLIFY ===${colors.reset}`);
    
    // Kontrola, zda existuje složka dist
    if (!fs.existsSync('dist')) {
        console.log(`${colors.red}✗${colors.reset} Složka dist neexistuje, nelze nasadit na Netlify`);
        return false;
    }
    
    console.log(`${colors.cyan}Spouštím nasazení na Netlify...${colors.reset}`);
    
    try {
        // Spuštění příkazu netlify deploy
        const deployProcess = spawn('netlify', ['deploy', '--dir=dist', '--prod'], {
            stdio: 'inherit',
            shell: true
        });
        
        return new Promise((resolve) => {
            deployProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(`${colors.green}${colors.bright}=== NASAZENÍ NA NETLIFY ÚSPĚŠNÉ ===${colors.reset}`);
                    resolve(true);
                } else {
                    console.log(`${colors.red}${colors.bright}=== NASAZENÍ NA NETLIFY SELHALO (kód ${code}) ===${colors.reset}`);
                    resolve(false);
                }
            });
        });
    } catch (error) {
        console.log(`${colors.red}✗${colors.reset} Chyba při nasazení na Netlify: ${error.message}`);
        return false;
    }
}

/**
 * Hlavní funkce
 */
async function main() {
    console.log(`${colors.bright}${colors.magenta}=== AIMAPA NETLIFY DEPLOY ===${colors.reset}`);
    console.log(`Verze: 0.3.8.6`);
    console.log(`Datum: ${new Date().toISOString()}`);
    console.log('');
    
    // Kontrola Netlify CLI
    if (!checkNetlifyCLI()) {
        return;
    }
    
    // Kontrola přihlášení k Netlify
    if (!checkNetlifyLogin()) {
        return;
    }
    
    // Kontrola konfiguračních souborů
    if (!checkConfigFiles()) {
        console.log(`${colors.yellow}⚠${colors.reset} Některé konfigurační soubory chybí nebo jsou neúplné`);
        
        // Zeptat se uživatele, zda chce pokračovat
        console.log(`${colors.yellow}Chcete pokračovat s nasazením? (y/n)${colors.reset}`);
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
            readline.question('', resolve);
        });
        
        readline.close();
        
        if (answer.toLowerCase() !== 'y') {
            console.log(`${colors.red}Nasazení zrušeno${colors.reset}`);
            return;
        }
    }
    
    // Kontrola konfigurace Auth0 pro produkci
    checkAuth0ProductionConfig();
    
    // Kontrola konfigurace Supabase pro produkci
    checkSupabaseProductionConfig();
    
    // Příprava souborů pro nasazení
    if (!prepareFilesForDeploy()) {
        console.log(`${colors.red}✗${colors.reset} Nepodařilo se připravit soubory pro nasazení`);
        return;
    }
    
    // Nasazení na Netlify
    const deploySuccess = await deployToNetlify();
    
    if (deploySuccess) {
        console.log(`${colors.green}${colors.bright}Aplikace byla úspěšně nasazena na Netlify${colors.reset}`);
        console.log(`${colors.cyan}Zkontrolujte stav nasazení na https://app.netlify.com${colors.reset}`);
    } else {
        console.log(`${colors.red}${colors.bright}Nasazení na Netlify selhalo${colors.reset}`);
        console.log(`${colors.yellow}Zkontrolujte chyby a zkuste to znovu${colors.reset}`);
    }
}

// Spuštění hlavní funkce
main().catch(error => {
    console.error(`${colors.red}Chyba: ${error.message}${colors.reset}`);
    process.exit(1);
});
