/**
 * Jednoduchý testovací server pro ověření funkčnosti Express
 */

const express = require('express');
const app = express();
const port = 3001;

// Middleware pro parsování JSON
app.use(express.json());

// Základní route
app.get('/', (req, res) => {
    res.json({ message: 'Server funguje!' });
});

// Testovací route pro POST
app.post('/test', (req, res) => {
    res.json({ 
        message: 'POST požadavek přijat',
        body: req.body
    });
});

// Spuštění serveru
app.listen(port, () => {
    console.log(`Testovací server běží na http://localhost:${port}`);
});
