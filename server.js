/**
 * Server pro AIMapa verze 0.2.9.1
 * Jednoduchý Express server pro servírování aplikace
 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');

// Vytvoření Express aplikace
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(compression()); // Komprese odpovědí
app.use(cors()); // Povolení CORS
app.use(express.json()); // Parsování JSON
app.use(express.static(path.join(__dirname, 'public'))); // Statické soubory

// Hlavní route - servírování index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Spuštění serveru
app.listen(PORT, () => {
  console.log(`AIMapa server běží na portu ${PORT}`);
  console.log(`Otevřete aplikaci v prohlížeči: http://localhost:${PORT}`);
});
