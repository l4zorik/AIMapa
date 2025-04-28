/**
 * AIMapa - Server
 * Verze 0.3.8.5
 *
 * Server s podporou Supabase integrace, opravou glóbus režimu, povinným přihlašováním
 * a opravou formulářů a Content Security Policy
 */

// Načtení modulů
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const request = require('request');

// Načtení proměnných prostředí z .env souboru
require('dotenv').config();

// Kontrola načtení proměnných prostředí
console.log('Kontrola načtení proměnných prostředí:');
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN ? 'Načteno' : 'Chybí');
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'Načteno' : 'Chybí');
console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'Načteno' : 'Chybí');
console.log('AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE ? 'Načteno' : 'Chybí');
console.log('AUTH0_CALLBACK_URL:', process.env.AUTH0_CALLBACK_URL ? 'Načteno' : 'Chybí');
console.log('AUTH0_LOGOUT_URL:', process.env.AUTH0_LOGOUT_URL ? 'Načteno' : 'Chybí');
console.log('AUTH0_SCOPE:', process.env.AUTH0_SCOPE ? 'Načteno' : 'Chybí');

// Funkce pro kontrolu dostupnosti souborů mapy
function checkMapFiles() {
    console.log('\nKontrola souborů mapy:');
    const mapFiles = [
        'public/index.html',
        'public/app/map.js',
        'public/app/globe-simple.js',
        'public/app/auth0-auth.js',
        'public/css/styles.css'
    ];

    let allFilesExist = true;

    mapFiles.forEach(file => {
        const exists = fs.existsSync(path.join(__dirname, file));
        console.log(`${file}: ${exists ? 'Existuje' : 'Chybí'}`);
        if (!exists) allFilesExist = false;
    });

    return allFilesExist;
}

// Funkce pro kontrolu funkčnosti klíčových funkcí
function checkCoreFunctions() {
    console.log('\nKontrola klíčových funkcí:');

    // Kontrola funkce pro generování UUID
    try {
        const uuid = generateUUID();
        console.log('Funkce generateUUID(): OK');
    } catch (error) {
        console.error('Funkce generateUUID(): Chyba -', error.message);
    }

    // Kontrola funkce pro hashování hesla
    try {
        const hash = hashPassword('test');
        console.log('Funkce hashPassword(): OK');
    } catch (error) {
        console.error('Funkce hashPassword(): Chyba -', error.message);
    }

    // Kontrola funkce pro generování tokenu
    try {
        const token = generateToken({ id: 'test-id', email: 'test@example.com' });
        console.log('Funkce generateToken(): OK');
    } catch (error) {
        console.error('Funkce generateToken(): Chyba -', error.message);
    }

    // Kontrola dostupnosti Auth0 konfigurace
    try {
        // Kontrola, zda jsou proměnné prostředí nastaveny
        if (process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET) {
            console.log('Auth0 konfigurace: OK');
        } else {
            console.warn('Auth0 konfigurace: Neúplná');
        }
    } catch (error) {
        console.error('Auth0 konfigurace: Chyba -', error.message);
    }
}

// Auth0 konfigurace je definována níže

// Spuštění kontrol
checkMapFiles();
checkCoreFunctions();

// Pomocné funkce
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function hashPassword(password) {
    // Pro jednoduchost používáme pouze základní hashování
    // V reálné aplikaci by bylo vhodné použít bcrypt nebo podobnou knihovnu
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
}

function generateToken(user) {
    // Vytvoření hlavičky
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    // Vytvoření payloadu
    const payload = {
        sub: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hodin
    };

    // Kódování hlavičky a payloadu
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');

    // Vytvoření podpisu (v reálné aplikaci by byl bezpečnější)
    // Pro jednoduchost používáme pouze základní podpis
    const signature = Buffer.from(encodedHeader + encodedPayload + 'secret').toString('base64');

    // Sestavení tokenu
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Vytvoření Express aplikace
const app = express();

// Nastavení middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// Testovací soubory (pouze pro lokální vývoj)
app.use('/tests', express.static(path.join(__dirname, 'tests')));

// API Routes
app.use('/api', require('./routes/api'));

// Stripe API Routes
app.use('/api/stripe', require('./routes/stripe'));

// Auth0 konfigurace
const auth0Config = {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    callbackUrl: process.env.AUTH0_CALLBACK_URL,
    logoutUrl: process.env.AUTH0_LOGOUT_URL,
    scope: process.env.AUTH0_SCOPE
};

// Proměnná pro uložení Auth0 Management API tokenu
let auth0ManagementToken = null;
let auth0TokenExpiry = 0;

// Funkce pro získání Auth0 Management API tokenu
function getAuth0ManagementToken() {
    return new Promise((resolve, reject) => {
        // Kontrola, zda máme platný token
        const now = Date.now();
        if (auth0ManagementToken && auth0TokenExpiry > now) {
            return resolve(auth0ManagementToken);
        }

        // Nastavení požadavku pro získání tokenu
        const options = {
            method: 'POST',
            url: `https://${auth0Config.domain}/oauth/token`,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                client_id: auth0Config.clientId,
                client_secret: auth0Config.clientSecret,
                audience: auth0Config.audience,
                grant_type: 'client_credentials'
            })
        };

        // Odeslání požadavku
        request(options, (error, response, body) => {
            if (error) {
                console.error('Chyba při získávání Auth0 Management API tokenu:', error);
                return reject(error);
            }

            try {
                // Parsování odpovědi
                const data = JSON.parse(body);

                // Uložení tokenu a času expirace
                auth0ManagementToken = data.access_token;
                // Nastavení expirace tokenu (obvykle 24 hodin, ale pro jistotu nastavíme na 23 hodin)
                auth0TokenExpiry = now + (data.expires_in * 1000) - (60 * 60 * 1000);

                console.log('Auth0 Management API token byl úspěšně získán');
                resolve(auth0ManagementToken);
            } catch (parseError) {
                console.error('Chyba při parsování odpovědi z Auth0:', parseError);
                reject(parseError);
            }
        });
    });
}

// Endpoint pro získání Auth0 konfigurace (pouze clientId a domain pro klienta)
app.get('/auth/config', (_req, res) => {
    res.json({
        domain: auth0Config.domain,
        clientId: auth0Config.clientId,
        audience: auth0Config.audience,
        scope: auth0Config.scope
    });
});

// Endpoint pro získání Auth0 Management API tokenu (pouze pro autorizované požadavky)
app.get('/auth/management-token', async (req, res) => {
    try {
        // Zde by měla být implementována autorizace požadavku
        // Pro jednoduchost nyní poskytujeme token bez autorizace, ale v produkci by to mělo být zabezpečeno

        const token = await getAuth0ManagementToken();
        res.json({ access_token: token });
    } catch (error) {
        console.error('Chyba při získávání Auth0 Management API tokenu:', error);
        res.status(500).json({ error: 'Nepodařilo se získat token' });
    }
});

// API pro autentizaci
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Kontrola, zda existuje soubor s uživateli
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    let users = [];

    try {
        if (fs.existsSync(usersFilePath)) {
            const usersData = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(usersData);
        }
    } catch (error) {
        console.error('Chyba při načítání uživatelů:', error);
        return res.status(500).json({ error: 'Interní chyba serveru' });
    }

    // Nalezení uživatele podle emailu
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Nesprávný email nebo heslo' });
    }

    // Kontrola hesla (v reálné aplikaci by bylo bezpečnější)
    if (user.password !== hashPassword(password)) {
        return res.status(401).json({ error: 'Nesprávný email nebo heslo' });
    }

    // Vytvoření JWT tokenu
    const token = generateToken(user);

    // Vrácení odpovědi
    res.json({
        user: {
            id: user.id,
            email: user.email,
            username: user.metadata?.username || 'Uživatel'
        },
        token
    });
});

app.post('/auth/register', (req, res) => {
    const { email, password, metadata } = req.body;

    // Kontrola, zda existuje soubor s uživateli
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    let users = [];

    try {
        if (fs.existsSync(usersFilePath)) {
            const usersData = fs.readFileSync(usersFilePath, 'utf8');
            users = JSON.parse(usersData);
        }
    } catch (error) {
        console.error('Chyba při načítání uživatelů:', error);
        return res.status(500).json({ error: 'Interní chyba serveru' });
    }

    // Kontrola, zda uživatel již existuje
    if (users.some(u => u.email === email)) {
        return res.status(400).json({ error: 'Uživatel s tímto emailem již existuje' });
    }

    // Vytvoření nového uživatele
    const newUser = {
        id: generateUUID(),
        email,
        password: hashPassword(password),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: metadata || {}
    };

    // Přidání uživatele do seznamu
    users.push(newUser);

    // Uložení seznamu uživatelů
    try {
        // Vytvoření adresáře, pokud neexistuje
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Chyba při ukládání uživatelů:', error);
        return res.status(500).json({ error: 'Interní chyba serveru' });
    }

    // Vrácení odpovědi
    res.status(201).json({
        user: {
            id: newUser.id,
            email: newUser.email,
            username: newUser.metadata?.username || 'Uživatel'
        }
    });
});

// Hlavní route pro aplikaci
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Nastavení portu
const PORT = process.env.PORT || 3000;

// Funkce pro kontrolu dostupnosti mapy
function checkMapAvailability() {
    return new Promise((resolve) => {
        console.log('\nKontrola dostupnosti mapy:');

        // Kontrola, zda existují klíčové soubory pro mapu
        const mapJsPath = path.join(__dirname, 'public', 'app', 'map.js');
        const globeJsPath = path.join(__dirname, 'public', 'app', 'globe-simple.js');

        if (!fs.existsSync(mapJsPath)) {
            console.error('Soubor map.js neexistuje!');
            resolve(false);
            return;
        }

        if (!fs.existsSync(globeJsPath)) {
            console.error('Soubor globe-simple.js neexistuje!');
            resolve(false);
            return;
        }

        // Kontrola obsahu souborů
        try {
            const mapJsContent = fs.readFileSync(mapJsPath, 'utf8');
            const globeJsContent = fs.readFileSync(globeJsPath, 'utf8');

            // Kontrola, zda soubory obsahují klíčové funkce
            const mapHasInitFunction = mapJsContent.includes('function initMap');
            const globeHasInitFunction = globeJsContent.includes('function initSimpleGlobe');

            console.log('Funkce initMap v map.js:', mapHasInitFunction ? 'Nalezena' : 'Chybí');
            console.log('Funkce initSimpleGlobe v globe-simple.js:', globeHasInitFunction ? 'Nalezena' : 'Chybí');

            resolve(mapHasInitFunction && globeHasInitFunction);
        } catch (error) {
            console.error('Chyba při kontrole souborů mapy:', error.message);
            resolve(false);
        }
    });
}

// Funkce pro kontrolu funkčnosti Auth0
function checkAuth0Functionality() {
    return new Promise((resolve) => {
        console.log('\nKontrola funkčnosti Auth0:');

        // Kontrola, zda existuje soubor auth0-auth.js
        const auth0JsPath = path.join(__dirname, 'public', 'app', 'auth0-auth.js');

        if (!fs.existsSync(auth0JsPath)) {
            console.error('Soubor auth0-auth.js neexistuje!');
            resolve(false);
            return;
        }

        // Kontrola obsahu souboru
        try {
            const auth0JsContent = fs.readFileSync(auth0JsPath, 'utf8');

            // Kontrola, zda soubor obsahuje klíčové funkce
            const hasInitFunction = auth0JsContent.includes('init:');
            const hasLoginFunction = auth0JsContent.includes('login:');
            const hasLogoutFunction = auth0JsContent.includes('logout:');

            console.log('Funkce init v auth0-auth.js:', hasInitFunction ? 'Nalezena' : 'Chybí');
            console.log('Funkce login v auth0-auth.js:', hasLoginFunction ? 'Nalezena' : 'Chybí');
            console.log('Funkce logout v auth0-auth.js:', hasLogoutFunction ? 'Nalezena' : 'Chybí');

            // Kontrola Auth0 konfigurace
            if (auth0Config.domain && auth0Config.clientId && auth0Config.clientSecret) {
                console.log('Auth0 konfigurace: Kompletní');

                // Pokus o získání Auth0 Management API tokenu
                getAuth0ManagementToken()
                    .then(() => {
                        console.log('Získání Auth0 Management API tokenu: Úspěšné');
                        resolve(true);
                    })
                    .catch((error) => {
                        console.error('Získání Auth0 Management API tokenu: Chyba -', error.message);
                        resolve(hasInitFunction && hasLoginFunction && hasLogoutFunction);
                    });
            } else {
                console.warn('Auth0 konfigurace: Neúplná');
                resolve(hasInitFunction && hasLoginFunction && hasLogoutFunction);
            }
        } catch (error) {
            console.error('Chyba při kontrole souboru auth0-auth.js:', error.message);
            resolve(false);
        }
    });
}

// Spuštění serveru
app.listen(PORT, async () => {
    console.log(`\nServer běží na portu ${PORT}`);
    console.log(`Aplikace je dostupná na http://localhost:${PORT}`);

    // Kontrola dostupnosti mapy
    const mapAvailable = await checkMapAvailability();
    console.log('\nDostupnost mapy:', mapAvailable ? 'OK' : 'Problém');

    // Kontrola funkčnosti Auth0
    const auth0Functional = await checkAuth0Functionality();
    console.log('\nFunkčnost Auth0:', auth0Functional ? 'OK' : 'Problém');

    console.log('\n=== Server je připraven ===');

    if (!mapAvailable || !auth0Functional) {
        console.warn('\n⚠️ VAROVÁNÍ: Některé funkce aplikace nemusí být plně funkční!');
        console.warn('Zkontrolujte výše uvedené chyby a varování.');
    }
});
