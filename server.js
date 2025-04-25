/**
 * AIMapa - Server
 * Verze 0.3.5.0
 */

// Načtení modulů
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Vytvoření Express aplikace
const app = express();

// Nastavení middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statické soubory - servírujeme přímo z kořenového adresáře
app.use(express.static(path.join(__dirname)));

// API Routes
app.use('/api', require('./routes/api'));

// Hlavní route pro aplikaci
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Nastavení portu
const PORT = process.env.PORT || 3000;

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
