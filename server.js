/**
 * AIMapa - Server
 * Verze 0.3.8.4
 *
 * Server s podporou Supabase integrace, opravou glóbus režimu a povinným přihlašováním
 */

// Načtení modulů
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

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

// API Routes
app.use('/api', require('./routes/api'));

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

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
    console.log(`Aplikace je dostupná na http://localhost:${PORT}`);
});
