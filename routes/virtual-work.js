/**
 * AIMapa - Virtuální práce API Routes
 * Verze 0.3.5.7
 */

const express = require('express');
const router = express.Router();

// Získání seznamu pracovišť
router.get('/workplaces', (req, res) => {
    // Zde bude v budoucnu načítání z databáze
    const workplaces = [
        {
            id: 'office1',
            name: 'Kancelářská práce',
            type: 'office',
            icon: '💼',
            pay: 1000,
            description: 'Standardní kancelářská práce s počítačem.',
            difficulty: 'easy',
            xp: 20,
            duration: 3
        },
        {
            id: 'tech1',
            name: 'Programování',
            type: 'programming',
            icon: '💻',
            pay: 1500,
            description: 'Vývoj softwaru a webových aplikací.',
            difficulty: 'medium',
            xp: 30,
            duration: 4
        },
        {
            id: 'factory1',
            name: 'Manuální práce',
            type: 'manual',
            icon: '🔨',
            pay: 800,
            description: 'Fyzická práce ve výrobě nebo skladu.',
            difficulty: 'easy',
            xp: 15,
            duration: 2
        },
        {
            id: 'design1',
            name: 'Grafický design',
            type: 'creative',
            icon: '🎨',
            pay: 1200,
            description: 'Tvorba grafiky a vizuálních materiálů.',
            difficulty: 'medium',
            xp: 25,
            duration: 3
        },
        {
            id: 'teaching1',
            name: 'Výuka a školení',
            type: 'education',
            icon: '👨‍🏫',
            pay: 1100,
            description: 'Vzdělávání a předávání znalostí.',
            difficulty: 'medium',
            xp: 25,
            duration: 3
        },
        {
            id: 'medical1',
            name: 'Zdravotnictví',
            type: 'healthcare',
            icon: '⚕️',
            pay: 1800,
            description: 'Práce ve zdravotnictví a péče o pacienty.',
            difficulty: 'hard',
            xp: 40,
            duration: 5
        }
    ];

    res.json(workplaces);
});

// Uložení záznamu o práci
router.post('/work-history', (req, res) => {
    const workRecord = req.body;

    // Kontrola povinných polí
    if (!workRecord.workplace || !workRecord.name || !workRecord.pay) {
        return res.status(400).json({ error: 'Chybí povinná pole' });
    }

    // Přidání ID a data, pokud chybí
    workRecord.id = workRecord.id || Date.now();
    workRecord.date = workRecord.date || new Date().toISOString();

    // Načtení existující historie
    let workHistory = [];
    try {
        const fs = require('fs');
        const path = require('path');
        const historyPath = path.join(__dirname, '../data/work-history.json');

        // Kontrola, zda existuje adresář data
        if (!fs.existsSync(path.join(__dirname, '../data'))) {
            fs.mkdirSync(path.join(__dirname, '../data'));
        }

        // Kontrola, zda existuje soubor s historií
        if (fs.existsSync(historyPath)) {
            const historyData = fs.readFileSync(historyPath, 'utf8');
            workHistory = JSON.parse(historyData);
        }

        // Přidání nového záznamu
        workHistory.push(workRecord);

        // Uložení aktualizované historie
        fs.writeFileSync(historyPath, JSON.stringify(workHistory, null, 2));

        console.log(`Uložen nový záznam práce: ${workRecord.name}`);
    } catch (error) {
        console.error('Chyba při ukládání záznamu práce:', error);
        return res.status(500).json({ error: 'Chyba při ukládání záznamu práce' });
    }

    res.status(201).json(workRecord);
});

// Získání historie práce
router.get('/work-history', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const historyPath = path.join(__dirname, '../data/work-history.json');

        // Kontrola, zda existuje soubor s historií
        if (fs.existsSync(historyPath)) {
            const historyData = fs.readFileSync(historyPath, 'utf8');
            const workHistory = JSON.parse(historyData);
            return res.json(workHistory);
        }

        // Pokud soubor neexistuje, vrátíme prázdné pole
        return res.json([]);
    } catch (error) {
        console.error('Chyba při načítání historie práce:', error);
        return res.status(500).json({ error: 'Chyba při načítání historie práce' });
    }
});

// Získání detailu záznamu práce podle ID
router.get('/work-history/:id', (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const historyPath = path.join(__dirname, '../data/work-history.json');

        // Kontrola, zda existuje soubor s historií
        if (fs.existsSync(historyPath)) {
            const historyData = fs.readFileSync(historyPath, 'utf8');
            const workHistory = JSON.parse(historyData);

            // Hledání záznamu podle ID
            const workRecord = workHistory.find(record => record.id === parseInt(req.params.id));

            if (workRecord) {
                return res.json(workRecord);
            } else {
                return res.status(404).json({ error: 'Záznam nebyl nalezen' });
            }
        }

        // Pokud soubor neexistuje, vrátíme chybu
        return res.status(404).json({ error: 'Historie práce neexistuje' });
    } catch (error) {
        console.error('Chyba při načítání detailu záznamu práce:', error);
        return res.status(500).json({ error: 'Chyba při načítání detailu záznamu práce' });
    }
});

// Export routeru
module.exports = router;
