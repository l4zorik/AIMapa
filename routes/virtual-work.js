/**
 * AIMapa - Virtuální práce API Routes
 * Verze 0.3.0.16
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
    // Zde bude v budoucnu ukládání do databáze
    const workRecord = req.body;
    
    // Kontrola povinných polí
    if (!workRecord.workplace || !workRecord.name || !workRecord.pay) {
        return res.status(400).json({ error: 'Chybí povinná pole' });
    }
    
    // Přidání ID a data, pokud chybí
    workRecord.id = workRecord.id || Date.now();
    workRecord.date = workRecord.date || new Date().toISOString();
    
    // V budoucnu zde bude ukládání do databáze
    
    res.status(201).json(workRecord);
});

// Získání historie práce
router.get('/work-history', (req, res) => {
    // Zde bude v budoucnu načítání z databáze
    const workHistory = [];
    
    res.json(workHistory);
});

// Export routeru
module.exports = router;
