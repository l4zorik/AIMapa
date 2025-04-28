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
require('dotenv').config();

// Konfigurace Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://njjhhamwixjbfibywreo.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
const POSTGRES_CONNECTION = process.env.POSTGRES_CONNECTION || 'postgresql://postgres:[YOUR-PASSWORD]@db.njjhhamwixjbfibywreo.supabase.co:5432/postgres';

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

// Endpoint pro Supabase konfiguraci
app.get('/api/supabase-config', (req, res) => {
    // Vrátíme pouze URL, ne klíč (ten se zadává v UI)
    res.json({
        url: SUPABASE_URL,
        // Maskujeme connection string pro bezpečnost
        connectionString: POSTGRES_CONNECTION.replace(/postgres:.*@/, 'postgres:[PASSWORD]@')
    });
});

// Hlavní route pro aplikaci
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Nastavení portu
const PORT = process.env.PORT || 3000;

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
    console.log(`Aplikace je dostupná na http://localhost:${PORT}`);
});
