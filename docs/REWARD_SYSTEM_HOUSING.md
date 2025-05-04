# Rozšíření systému odměn o kategorii bydlení

Tento dokument popisuje implementaci nové kategorie "Bydlení" do systému odměn v aplikaci AIMapa pro verzi 0.3.8.2.

## Přehled funkcionality

Nová kategorie "Bydlení" v systému odměn umožní uživatelům:

1. **Získávat odměny související s bydlením** - Odpočinek doma, vylepšení bydlení, úklid, apod.
2. **Propojení s existující službou bydlení** - Integrace s již implementovaným modulem housing-services.js
3. **Získávání XP za aktivity související s bydlením** - Motivace k využívání služeb bydlení

## Návrh uživatelského rozhraní

### 1. Přidání nové kategorie do filtru odměn

```html
<div class="reward-categories">
    <button class="category-btn active" data-category="all">Všechny</button>
    <button class="category-btn" data-category="money">Peníze</button>
    <button class="category-btn" data-category="experience">Zkušenosti</button>
    <button class="category-btn" data-category="food">Jídlo a pití</button>
    <button class="category-btn" data-category="sweets">Sladkosti</button>
    <button class="category-btn" data-category="gym">Posilovna</button>
    <button class="category-btn" data-category="sleep">Spánek</button>
    <button class="category-btn" data-category="thc">THC-X</button>
    <button class="category-btn" data-category="housing">Bydlení</button>
    <button class="category-btn" data-category="other">Ostatní</button>
</div>
```

### 2. Návrh karet odměn pro kategorii bydlení

![Návrh karet odměn pro kategorii bydlení](housing_rewards_mockup.png)

### 3. Vizuální styl

- Ikona kategorie: 🏠 (domek)
- Barevný kód: #4CAF50 (zelená)
- Styl karet: Konzistentní s ostatními kategoriemi, s tematickými ikonami pro každou odměnu

## Implementace

### 1. Rozšíření konfigurace odměn v reward-system.js

```javascript
// Přidání nové kategorie do konfigurace
const REWARD_CATEGORIES = [
    { id: 'all', name: 'Všechny', icon: '🏆' },
    { id: 'money', name: 'Peníze', icon: '💰' },
    { id: 'experience', name: 'Zkušenosti', icon: '⭐' },
    { id: 'food', name: 'Jídlo a pití', icon: '🍔' },
    { id: 'sweets', name: 'Sladkosti', icon: '🍫' },
    { id: 'gym', name: 'Posilovna', icon: '💪' },
    { id: 'sleep', name: 'Spánek', icon: '😴' },
    { id: 'thc', name: 'THC-X', icon: '🌿' },
    { id: 'housing', name: 'Bydlení', icon: '🏠' },
    { id: 'other', name: 'Ostatní', icon: '📦' }
];

// Přidání nových odměn pro kategorii bydlení
const HOUSING_REWARDS = [
    {
        id: 'home_rest',
        name: 'Odpočinek doma',
        description: 'Dopřejte si kvalitní odpočinek ve svém domově jako odměnu za dobře odvedenou práci.',
        icon: '🛋️',
        category: 'housing',
        xpReward: 30,
        difficulty: 'easy'
    },
    {
        id: 'home_improvement',
        name: 'Vylepšení bydlení',
        description: 'Odměňte se vylepšením svého bydlení - nový nábytek, dekorace nebo drobná rekonstrukce.',
        icon: '🔨',
        category: 'housing',
        xpReward: 50,
        difficulty: 'medium'
    },
    {
        id: 'cleaning_service',
        name: 'Úklidová služba',
        description: 'Dopřejte si profesionální úklid vašeho domova jako odměnu za vaši práci.',
        icon: '🧹',
        category: 'housing',
        xpReward: 40,
        difficulty: 'medium'
    },
    {
        id: 'new_plant',
        name: 'Nová rostlina',
        description: 'Pořiďte si novou rostlinu do vašeho domova pro lepší atmosféru a čistší vzduch.',
        icon: '🌱',
        category: 'housing',
        xpReward: 25,
        difficulty: 'easy'
    },
    {
        id: 'weekend_trip',
        name: 'Víkendový výlet',
        description: 'Odměňte se víkendovým výletem mimo domov - změna prostředí prospěje vaší mysli.',
        icon: '🏕️',
        category: 'housing',
        xpReward: 60,
        difficulty: 'hard'
    }
];

// Přidání nových odměn do hlavního seznamu
REWARDS = [...REWARDS, ...HOUSING_REWARDS];
```

### 2. Rozšíření funkcí pro zpracování odměn

```javascript
/**
 * Zpracování výběru odměny z kategorie bydlení
 * @param {Object} reward - Vybraná odměna
 */
function processHousingReward(reward) {
    // Přidání XP
    if (typeof UserProgress !== 'undefined') {
        UserProgress.addExperience(reward.xpReward, `Odměna: ${reward.name}`, 'housing');
    }
    
    // Uložení do historie odměn
    saveRewardToHistory(reward);
    
    // Zobrazení potvrzení
    showRewardConfirmation(reward);
    
    // Propojení se službou bydlení, pokud je dostupná
    if (typeof HousingServices !== 'undefined') {
        // Podle typu odměny provedeme specifickou akci
        switch (reward.id) {
            case 'home_improvement':
                // Otevření sekce vylepšení bydlení
                HousingServices.showHomeImprovementOptions();
                break;
            case 'cleaning_service':
                // Otevření sekce úklidových služeb
                HousingServices.showCleaningServices();
                break;
            case 'weekend_trip':
                // Otevření sekce víkendových pobytů
                HousingServices.showWeekendTrips();
                break;
            default:
                // Obecné otevření služby bydlení
                HousingServices.showService('general');
                break;
        }
    }
    
    // Přidání achievementu za první odměnu z kategorie bydlení
    if (typeof Achievements !== 'undefined') {
        Achievements.updateProgress('housing_enthusiast', 1);
    }
}

/**
 * Uložení odměny do historie
 * @param {Object} reward - Vybraná odměna
 */
function saveRewardToHistory(reward) {
    // Získání existující historie
    let rewardHistory = JSON.parse(localStorage.getItem('aiMapaRewardHistory') || '[]');
    
    // Přidání nové odměny
    rewardHistory.push({
        id: reward.id,
        name: reward.name,
        category: reward.category,
        timestamp: Date.now(),
        xpReward: reward.xpReward
    });
    
    // Omezení velikosti historie (uchováváme posledních 100 odměn)
    if (rewardHistory.length > 100) {
        rewardHistory = rewardHistory.slice(-100);
    }
    
    // Uložení aktualizované historie
    localStorage.setItem('aiMapaRewardHistory', JSON.stringify(rewardHistory));
}
```

### 3. Propojení s modulem housing-services.js

```javascript
/**
 * Rozšíření modulu HousingServices o nové funkce pro odměny
 */
if (typeof HousingServices !== 'undefined') {
    // Přidání nových funkcí do modulu HousingServices
    
    /**
     * Zobrazení možností vylepšení bydlení
     */
    HousingServices.showHomeImprovementOptions = function() {
        // Implementace zobrazení možností vylepšení bydlení
        const dialog = document.createElement('div');
        dialog.className = 'housing-dialog';
        dialog.innerHTML = `
            <div class="housing-dialog-header">
                <h2>Vylepšení bydlení</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="housing-dialog-content">
                <p>Vyberte si z následujících možností vylepšení vašeho bydlení:</p>
                <div class="improvement-options">
                    <div class="improvement-option">
                        <img src="app/images/housing/furniture.jpg" alt="Nábytek">
                        <h3>Nový nábytek</h3>
                        <p>Obnovte svůj interiér novým nábytkem.</p>
                        <button class="btn btn-primary">Zobrazit nabídku</button>
                    </div>
                    <div class="improvement-option">
                        <img src="app/images/housing/decoration.jpg" alt="Dekorace">
                        <h3>Dekorace</h3>
                        <p>Oživte svůj domov novými dekoracemi.</p>
                        <button class="btn btn-primary">Zobrazit nabídku</button>
                    </div>
                    <div class="improvement-option">
                        <img src="app/images/housing/renovation.jpg" alt="Rekonstrukce">
                        <h3>Drobné rekonstrukce</h3>
                        <p>Vylepšete svůj domov drobnými rekonstrukcemi.</p>
                        <button class="btn btn-primary">Zobrazit nabídku</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Přidání event listenerů
        dialog.querySelector('.close-btn').addEventListener('click', () => {
            dialog.remove();
        });
        
        // Přidání XP za zobrazení možností vylepšení bydlení
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(5, 'Zobrazení možností vylepšení bydlení', 'housing');
        }
    };
    
    /**
     * Zobrazení úklidových služeb
     */
    HousingServices.showCleaningServices = function() {
        // Implementace zobrazení úklidových služeb
        // Podobná struktura jako u showHomeImprovementOptions
    };
    
    /**
     * Zobrazení víkendových pobytů
     */
    HousingServices.showWeekendTrips = function() {
        // Implementace zobrazení víkendových pobytů
        // Podobná struktura jako u showHomeImprovementOptions
    };
}
```

### 4. Přidání nových CSS stylů

```css
/* Styly pro kategorii bydlení v systému odměn */
.category-btn[data-category="housing"] {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
    border: 1px solid #4CAF50;
}

.category-btn[data-category="housing"].active {
    background-color: #4CAF50;
    color: white;
}

.reward-card[data-category="housing"] {
    border-left: 4px solid #4CAF50;
}

.reward-card[data-category="housing"] .reward-icon {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4CAF50;
}

/* Styly pro dialogy vylepšení bydlení */
.housing-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
}

.housing-dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #4CAF50;
    color: white;
}

.housing-dialog-header h2 {
    margin: 0;
    font-size: 1.5rem;
}

.housing-dialog-header .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

.housing-dialog-content {
    padding: 20px;
    overflow-y: auto;
    max-height: calc(80vh - 60px);
}

.improvement-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.improvement-option {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.improvement-option:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.improvement-option img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.improvement-option h3 {
    margin: 15px 15px 10px;
    font-size: 1.2rem;
}

.improvement-option p {
    margin: 0 15px 15px;
    color: #666;
}

.improvement-option button {
    margin: 0 15px 15px;
    width: calc(100% - 30px);
}

/* Tmavý režim */
[data-theme="dark"] .housing-dialog {
    background-color: #1F2937;
    color: white;
}

[data-theme="dark"] .improvement-option {
    border-color: #374151;
    background-color: #111827;
}

[data-theme="dark"] .improvement-option h3 {
    color: white;
}

[data-theme="dark"] .improvement-option p {
    color: #9CA3AF;
}
```

### 5. Přidání nových achievementů

```javascript
// Přidání nových achievementů souvisejících s bydlením
const HOUSING_ACHIEVEMENTS = [
    {
        id: 'housing_enthusiast',
        name: 'Nadšenec do bydlení',
        description: 'Získejte 3 odměny z kategorie bydlení',
        icon: '🏠',
        category: 'odměny',
        requirement: 3,
        progress: 0,
        completed: false,
        reward: {
            xp: 100
        }
    },
    {
        id: 'home_improvement_master',
        name: 'Mistr vylepšení domova',
        description: 'Získejte odměnu "Vylepšení bydlení" 5krát',
        icon: '🔨',
        category: 'odměny',
        requirement: 5,
        progress: 0,
        completed: false,
        reward: {
            xp: 150
        }
    },
    {
        id: 'housing_explorer',
        name: 'Průzkumník bydlení',
        description: 'Vyzkoušejte všechny typy odměn z kategorie bydlení',
        icon: '🔍',
        category: 'odměny',
        requirement: 5, // Počet různých typů odměn v kategorii bydlení
        progress: 0,
        completed: false,
        reward: {
            xp: 200,
            money: 300
        }
    }
];

// Přidání nových achievementů do hlavního seznamu
if (typeof Achievements !== 'undefined') {
    Achievements.achievements = [...Achievements.achievements, ...HOUSING_ACHIEVEMENTS];
}
```

## Integrace s AI asistentem

Pro lepší uživatelský zážitek bude AI asistent schopen doporučovat odměny z kategorie bydlení na základě uživatelských preferencí a aktivit:

```javascript
/**
 * Rozšíření AI asistenta o doporučování odměn z kategorie bydlení
 */
if (typeof AIAssistant !== 'undefined') {
    // Přidání nových frází pro doporučení odměn z kategorie bydlení
    AIAssistant.housingRewardPhrases = [
        "Po takové práci by vám prospěl odpočinek doma. Co říkáte na odměnu 'Odpočinek doma'?",
        "Váš domov by si zasloužil nějaké vylepšení jako odměnu za vaši práci. Co zkusit odměnu 'Vylepšení bydlení'?",
        "Pracujete tvrdě, možná by se vám hodila úklidová služba jako odměna. Mám vám ukázat tuto možnost?",
        "Nová rostlina by mohla oživit váš domov a zlepšit vaši náladu. Co říkáte na tuto odměnu?",
        "Změna prostředí by vám mohla prospět. Co takhle víkendový výlet jako odměna za vaši práci?"
    ];
    
    /**
     * Doporučení odměny z kategorie bydlení
     * @returns {string} Doporučující fráze
     */
    AIAssistant.recommendHousingReward = function() {
        // Výběr náhodné fráze
        const randomIndex = Math.floor(Math.random() * this.housingRewardPhrases.length);
        return this.housingRewardPhrases[randomIndex];
    };
    
    /**
     * Rozšíření funkce pro zpracování zpráv o doporučování odměn z kategorie bydlení
     */
    const originalProcessMessage = AIAssistant.processMessage;
    AIAssistant.processMessage = function(message) {
        // Kontrola, zda zpráva obsahuje klíčová slova související s bydlením
        const housingKeywords = ['domov', 'bydlení', 'byt', 'dům', 'nábytek', 'dekorace', 'úklid', 'odpočinek'];
        
        if (housingKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            // 30% šance na doporučení odměny z kategorie bydlení
            if (Math.random() < 0.3) {
                const response = originalProcessMessage.call(this, message);
                return response + "\n\n" + this.recommendHousingReward();
            }
        }
        
        // Původní zpracování zprávy
        return originalProcessMessage.call(this, message);
    };
}
```

## Testování

Pro ověření správné implementace kategorie bydlení v systému odměn je potřeba provést následující testy:

1. **Zobrazení kategorie** - Ověřit, že se kategorie "Bydlení" správně zobrazuje ve filtru odměn
2. **Filtrování odměn** - Ověřit, že filtrování podle kategorie "Bydlení" zobrazuje pouze relevantní odměny
3. **Výběr odměny** - Ověřit, že výběr odměny z kategorie "Bydlení" správně funguje a přidává XP
4. **Propojení se službou bydlení** - Ověřit, že po výběru odměny se správně otevírá příslušná sekce služby bydlení
5. **Achievementy** - Ověřit, že se správně aktualizuje postup v achievementech souvisejících s bydlením
6. **AI asistent** - Ověřit, že AI asistent správně doporučuje odměny z kategorie bydlení

## Závěr

Implementace kategorie "Bydlení" do systému odměn rozšiřuje možnosti odměňování uživatelů a vytváří propojení s existující službou bydlení. Toto rozšíření přispívá k větší komplexnosti aplikace a poskytuje uživatelům další motivaci k používání aplikace a služeb bydlení.

---

*Poslední aktualizace: 2025-07-08*
