/**
 * Samostatný odměňovací systém
 * Verze 0.3.5.2
 */

class RewardSystemClass {
    constructor() {
        // Základní nastavení
        this.isInitialized = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        // Dostupné odměny
        this.availableRewards = [
            // Finanční odměny
            {
                id: 'money-small',
                name: 'Malá finanční odměna',
                type: 'money',
                icon: '💰',
                value: 500,
                description: 'Získáte 500 Kč na drobné výdaje.',
                cost: 'Nízká'
            },
            {
                id: 'money-medium',
                name: 'Střední finanční odměna',
                type: 'money',
                icon: '💰💰',
                value: 1000,
                description: 'Získáte 1000 Kč na běžné výdaje.',
                cost: 'Střední'
            },
            {
                id: 'money-large',
                name: 'Velká finanční odměna',
                type: 'money',
                icon: '💰💰💰',
                value: 2000,
                description: 'Získáte 2000 Kč na větší výdaje.',
                cost: 'Vysoká'
            },

            // XP odměny
            {
                id: 'xp-small',
                name: 'Malá XP odměna',
                type: 'xp',
                icon: '⭐',
                value: 50,
                description: 'Získáte 50 XP pro rychlejší postup na další úroveň.',
                cost: 'Nízká'
            },
            {
                id: 'xp-medium',
                name: 'Střední XP odměna',
                type: 'xp',
                icon: '⭐⭐',
                value: 100,
                description: 'Získáte 100 XP pro rychlejší postup na další úroveň.',
                cost: 'Střední'
            },
            {
                id: 'xp-large',
                name: 'Velká XP odměna',
                type: 'xp',
                icon: '⭐⭐⭐',
                value: 200,
                description: 'Získáte 200 XP pro rychlejší postup na další úroveň.',
                cost: 'Vysoká'
            },

            // Ostatní odměny
            {
                id: 'time-save',
                name: 'Úspora času',
                type: 'time',
                icon: '⏱️',
                value: 30,
                description: 'Příští práce bude trvat o 30% kratší dobu.',
                cost: 'Střední'
            },
            {
                id: 'bitcoin-small',
                name: 'Bitcoin odměna',
                type: 'bitcoin',
                icon: '₿',
                value: 0.001,
                description: 'Získáte 0.001 BTC do své digitální peněženky.',
                cost: 'Vysoká'
            },

            // Jídlo a pití
            {
                id: 'coffee',
                name: 'Káva',
                type: 'food',
                icon: '☕',
                value: 'Káva',
                description: 'Dopřejte si šálek kvalitní kávy jako odměnu za svou práci.',
                cost: 'Nízká'
            },
            {
                id: 'cake',
                name: 'Dort',
                type: 'food',
                icon: '🍰',
                value: 'Dort',
                description: 'Odměňte se kouskem lahodného dortu.',
                cost: 'Nízká'
            },
            {
                id: 'pizza',
                name: 'Pizza',
                type: 'food',
                icon: '🍕',
                value: 'Pizza',
                description: 'Dopřejte si pizzu jako odměnu za dobře odvedenou práci.',
                cost: 'Střední'
            },
            {
                id: 'beer',
                name: 'Pivo',
                type: 'food',
                icon: '🍺',
                value: 'Pivo',
                description: 'Zajděte si na jedno pivo jako odměnu za svou práci.',
                cost: 'Nízká'
            },
            {
                id: 'wine',
                name: 'Víno',
                type: 'food',
                icon: '🍷',
                value: 'Víno',
                description: 'Dopřejte si sklenku dobrého vína jako odměnu.',
                cost: 'Střední'
            },
            {
                id: 'dinner',
                name: 'Večeře v restauraci',
                type: 'food',
                icon: '🍽️',
                value: 'Večeře',
                description: 'Zajděte si na večeři do oblíbené restaurace jako odměnu za svou práci.',
                cost: 'Vysoká'
            }
        ];
    }

    /**
     * Inicializace modulu
     */
    init() {
        if (this.isInitialized) return;

        // Načtení CSS
        this.loadStyles();

        // Označení jako inicializovaný
        this.isInitialized = true;
        console.log('RewardSystem: Modul byl inicializován');
    }

    /**
     * Načtení CSS stylů
     */
    loadStyles() {
        // Kontrola, zda již styly existují
        if (document.getElementById('reward-system-styles')) return;

        // Vytvoření stylu pro odměňovací systém
        const style = document.createElement('style');
        style.id = 'reward-system-styles';
        style.textContent = `
            /* Hlavní dialog */
            .reward-system-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
                z-index: 1100;
                width: 95%;
                max-width: 900px;
                overflow: hidden;
                resize: both;
                min-width: 700px;
                min-height: 500px;
                transition: all 0.3s ease;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }

            .reward-system-dialog:hover {
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25), 0 1px 5px rgba(0, 0, 0, 0.15);
            }

            /* Hlavička dialogu */
            .reward-system-header {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                padding: 12px 18px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            .reward-system-header h2 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
            }

            .reward-system-header h2::before {
                content: '🐱';
                margin-right: 8px;
                font-size: 20px;
            }

            .reward-system-close {
                background: none;
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .reward-system-close:hover {
                background-color: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }

            /* Obsah dialogu */
            .reward-system-content {
                padding: 20px;
                overflow-y: auto;
                max-height: 550px;
                background-color: #f9f9f9;
                width: 100%;
                box-sizing: border-box;
            }

            /* Kategorie odměn */
            .reward-categories {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }

            .category-btn {
                padding: 8px 15px;
                border: 1px solid #e0e0e0;
                border-radius: 20px;
                background-color: white;
                color: #555;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 14px;
            }

            .category-btn:hover {
                background-color: #f5f5f5;
                transform: translateY(-2px);
            }

            .category-btn.active {
                background-color: #e74c3c;
                color: white;
                border-color: #e74c3c;
            }

            /* Seznam odměn */
            .reward-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }

            .reward-item {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                height: 200px;
            }

            .reward-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
            }

            .reward-item.selected {
                border: 2px solid #e74c3c;
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }

            .reward-item.selected::before {
                content: "✓";
                position: absolute;
                top: 10px;
                right: 10px;
                width: 25px;
                height: 25px;
                background-color: #e74c3c;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .reward-icon {
                font-size: 32px;
                margin-bottom: 15px;
                text-align: center;
            }

            .reward-name {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
                color: #333;
            }

            .reward-value {
                font-size: 22px;
                font-weight: bold;
                color: #e74c3c;
                margin-bottom: 10px;
            }

            .reward-description {
                font-size: 14px;
                color: #777;
                line-height: 1.4;
                flex-grow: 1;
            }

            .reward-cost {
                margin-top: 10px;
                font-size: 14px;
                font-weight: bold;
                color: #333;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }

            .reward-cost::before {
                content: 'Náročnost: ';
                font-weight: normal;
                margin-right: 5px;
                color: #777;
            }

            /* Tlačítka */
            .reward-system-actions {
                padding: 15px 20px;
                border-top: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                background-color: white;
            }

            .reward-system-btn {
                padding: 10px 18px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .reward-system-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .reward-system-btn.primary {
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
            }

            .reward-system-btn.primary:hover:not(:disabled) {
                background: linear-gradient(135deg, #c0392b, #a93226);
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }

            .reward-system-btn.primary:active:not(:disabled) {
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .reward-system-btn.secondary {
                background-color: #f0f0f0;
                color: #333;
                border: 1px solid #e0e0e0;
            }

            .reward-system-btn.secondary:hover:not(:disabled) {
                background-color: #e0e0e0;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .reward-system-btn.secondary:active:not(:disabled) {
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            /* Výsledek odměny */
            .reward-result {
                text-align: center;
                padding: 25px 0;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
                margin: 10px 0;
            }

            .reward-result-icon {
                font-size: 48px;
                margin-bottom: 15px;
                animation: pulse 1.5s infinite alternate;
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }

            .reward-result-amount {
                font-size: 28px;
                font-weight: bold;
                color: #e74c3c;
                margin: 15px 0 5px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: slideUp 0.5s ease-out;
            }

            .reward-result-xp {
                font-size: 22px;
                font-weight: bold;
                color: #f39c12;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: slideUp 0.5s ease-out 0.2s;
                animation-fill-mode: both;
            }

            @keyframes slideUp {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }

            .reward-result h3 {
                font-size: 22px;
                margin-bottom: 10px;
                color: #333;
            }

            .reward-result p {
                color: #666;
                margin-bottom: 15px;
                font-size: 15px;
            }

            /* Tmavý režim */
            body[data-theme="dark"] .reward-system-dialog {
                background-color: #1a2530;
                border-color: #34495e;
            }

            body[data-theme="dark"] .reward-system-content {
                background-color: #2c3e50;
            }

            body[data-theme="dark"] .reward-system-actions {
                background-color: #1a2530;
                border-top-color: #34495e;
            }

            body[data-theme="dark"] .reward-item {
                background-color: #34495e;
            }

            body[data-theme="dark"] .reward-name {
                color: #ecf0f1;
            }

            body[data-theme="dark"] .reward-description {
                color: #bdc3c7;
            }

            body[data-theme="dark"] .reward-cost {
                color: #ecf0f1;
            }

            body[data-theme="dark"] .reward-cost::before {
                color: #bdc3c7;
            }

            body[data-theme="dark"] .category-btn {
                background-color: #34495e;
                border-color: #2c3e50;
                color: #ecf0f1;
            }

            body[data-theme="dark"] .category-btn:hover {
                background-color: #2c3e50;
            }

            body[data-theme="dark"] .reward-system-btn.secondary {
                background-color: #34495e;
                color: #ecf0f1;
                border-color: #2c3e50;
            }

            body[data-theme="dark"] .reward-result {
                background-color: #34495e;
            }

            body[data-theme="dark"] .reward-result h3 {
                color: #ecf0f1;
            }

            body[data-theme="dark"] .reward-result p {
                color: #bdc3c7;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Otevření dialogu odměňovacího systému
     */
    openRewardSystemDialog() {
        // Kontrola, zda je modul inicializován
        if (!this.isInitialized) {
            this.init();
        }

        // Kontrola, zda již dialog existuje
        let dialog = document.querySelector('.reward-system-dialog');
        if (dialog) {
            // Dialog již existuje, pouze ho zobrazíme
            dialog.style.display = 'block';
            return;
        }

        // Vytvoření dialogu
        dialog = this.createDialog();

        // Zobrazení seznamu odměn
        this.showRewardsList(dialog);
    }

    /**
     * Vytvoření dialogu
     */
    createDialog() {
        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'reward-system-dialog';
        dialog.innerHTML = `
            <div class="reward-system-header">
                <h2>Systém odměn</h2>
                <button class="reward-system-close">&times;</button>
            </div>
            <div class="reward-system-content"></div>
            <div class="reward-system-actions"></div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Přidání event listeneru pro zavření dialogu
        const closeBtn = dialog.querySelector('.reward-system-close');
        closeBtn.addEventListener('click', () => this.closeDialog(dialog));

        // Přidání event listenerů pro přesouvání dialogu
        this.setupDraggable(dialog);

        return dialog;
    }

    /**
     * Nastavení přesouvání dialogu
     */
    setupDraggable(dialog) {
        const header = dialog.querySelector('.reward-system-header');

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.reward-system-close')) return;

            this.isDragging = true;
            const rect = dialog.getBoundingClientRect();
            this.dragOffset = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            dialog.style.transition = 'none';
            dialog.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            const x = e.clientX - this.dragOffset.x;
            const y = e.clientY - this.dragOffset.y;

            dialog.style.left = `${x}px`;
            dialog.style.top = `${y}px`;
            dialog.style.transform = 'none';
        });

        document.addEventListener('mouseup', () => {
            if (!this.isDragging) return;

            this.isDragging = false;
            dialog.style.cursor = 'auto';
            dialog.style.transition = 'all 0.3s ease';
        });
    }

    /**
     * Zavření dialogu
     */
    closeDialog(dialog) {
        dialog.remove();
    }

    /**
     * Zobrazení seznamu odměn
     */
    showRewardsList(dialog) {
        // Filtrování odměn podle kategorie
        const filteredRewards = this.availableRewards;

        // Zobrazení seznamu odměn
        dialog.querySelector('.reward-system-content').innerHTML = `
            <div class="reward-container">
                <h3>Vyberte si svoji odměnu</h3>
                <p>Odměňte se za svoji práci a úsilí! Vyberte si jednu z následujících odměn:</p>

                <div class="reward-categories">
                    <button class="category-btn active" data-category="all">Všechny</button>
                    <button class="category-btn" data-category="money">Peníze</button>
                    <button class="category-btn" data-category="xp">Zkušenosti</button>
                    <button class="category-btn" data-category="food">Jídlo a pití</button>
                    <button class="category-btn" data-category="other">Ostatní</button>
                </div>

                <div class="reward-list">
                    ${filteredRewards.map(reward => `
                        <div class="reward-item" data-id="${reward.id}" data-type="${reward.type}">
                            <div class="reward-icon">${reward.icon}</div>
                            <div class="reward-name">${reward.name}</div>
                            <div class="reward-value">${this.formatRewardValue(reward)}</div>
                            <div class="reward-description">${reward.description}</div>
                            <div class="reward-cost">${reward.cost}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Přidání tlačítek pro ovládání
        const actionsContainer = dialog.querySelector('.reward-system-actions');
        actionsContainer.innerHTML = `
            <button class="reward-system-btn secondary" id="close-rewards-btn">Zavřít</button>
            <button class="reward-system-btn primary" id="claim-reward-btn" disabled>Získat odměnu</button>
        `;

        // Přidání event listenerů pro výběr kategorie
        const categoryButtons = dialog.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech tlačítek
                categoryButtons.forEach(btn => btn.classList.remove('active'));

                // Přidání aktivní třídy na kliknuté tlačítko
                button.classList.add('active');

                // Filtrování odměn podle kategorie
                const category = button.dataset.category;
                const rewardItems = dialog.querySelectorAll('.reward-item');

                rewardItems.forEach(item => {
                    if (category === 'all' || item.dataset.type === category ||
                        (category === 'other' && item.dataset.type !== 'money' && item.dataset.type !== 'xp')) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Přidání event listenerů pro výběr odměny
        const rewardItems = dialog.querySelectorAll('.reward-item');
        const claimBtn = dialog.querySelector('#claim-reward-btn');

        rewardItems.forEach(item => {
            item.addEventListener('click', () => {
                // Odstranění výběru ze všech odměn
                rewardItems.forEach(reward => reward.classList.remove('selected'));

                // Přidání výběru na kliknutou odměnu
                item.classList.add('selected');

                // Povolení tlačítka pro získání odměny
                claimBtn.disabled = false;
            });
        });

        // Event listener pro tlačítko zavřít
        const closeBtn = dialog.querySelector('#close-rewards-btn');
        closeBtn.addEventListener('click', () => {
            this.closeDialog(dialog);
        });

        // Event listener pro tlačítko získat odměnu
        claimBtn.addEventListener('click', () => {
            // Získání vybrané odměny
            const selectedItem = dialog.querySelector('.reward-item.selected');
            if (!selectedItem) return;

            const rewardId = selectedItem.dataset.id;
            const reward = this.availableRewards.find(r => r.id === rewardId);

            if (reward) {
                this.claimReward(dialog, reward);
            }
        });
    }

    /**
     * Formátování hodnoty odměny
     */
    formatRewardValue(reward) {
        switch (reward.type) {
            case 'money':
                return `${reward.value} Kč`;
            case 'xp':
                return `${reward.value} XP`;
            case 'time':
                return `-${reward.value}% času`;
            case 'bitcoin':
                return `${reward.value} BTC`;
            case 'food':
                return `${reward.value} (+25 XP)`;
            default:
                return reward.value;
        }
    }

    /**
     * Získání odměny
     */
    claimReward(dialog, reward) {
        // Zobrazení výsledku získání odměny
        dialog.querySelector('.reward-system-content').innerHTML = `
            <div class="reward-result">
                <div class="reward-result-icon">${reward.icon}</div>
                <h3>Odměna získána!</h3>
                <p>Úspěšně jste získali odměnu: ${reward.name}</p>

                <div class="reward-result-amount">
                    ${this.formatRewardValue(reward)}
                </div>

                <p>${reward.description}</p>
            </div>
        `;

        // Přidání tlačítek pro ovládání výsledku
        const actionsContainer = dialog.querySelector('.reward-system-actions');
        actionsContainer.innerHTML = `
            <button class="reward-system-btn secondary" id="close-result-btn">Zavřít</button>
            <button class="reward-system-btn primary" id="new-reward-btn">Vybrat další odměnu</button>
        `;

        // Přidání event listenerů pro tlačítka
        const closeBtn = dialog.querySelector('#close-result-btn');
        closeBtn.addEventListener('click', () => {
            this.closeDialog(dialog);
        });

        // Přidání event listeneru pro tlačítko "Vybrat další odměnu"
        dialog.querySelector('#new-reward-btn').addEventListener('click', () => {
            this.showRewardsList(dialog);
        });

        // Přidání odměny podle typu
        switch (reward.type) {
            case 'money':
                if (window.addMoney) {
                    window.addMoney(reward.value, 'Odměňovací systém');
                }
                break;
            case 'xp':
                if (window.addXP) {
                    window.addXP(reward.value, 'Odměňovací systém');
                }
                break;
            case 'time':
                localStorage.setItem('aiMapaTimeBonus', JSON.stringify({
                    percent: reward.value
                }));
                break;
            case 'bitcoin':
                if (window.BitcoinIndicator && window.BitcoinIndicator.addBitcoin) {
                    window.BitcoinIndicator.addBitcoin(reward.value, 'Odměňovací systém');
                }
                break;
            case 'food':
                // Pro jídlo a pití pouze zobrazíme zprávu a přidáme XP
                if (window.addXP) {
                    window.addXP(25, `Odměna: ${reward.value}`);
                }

                // Uložíme do localStorage informaci o získané odměně
                const foodRewards = JSON.parse(localStorage.getItem('aiMapaFoodRewards') || '[]');
                foodRewards.push({
                    name: reward.name,
                    value: reward.value,
                    icon: reward.icon,
                    date: new Date().toISOString()
                });
                localStorage.setItem('aiMapaFoodRewards', JSON.stringify(foodRewards));
                break;
        }

        // Zobrazení zprávy o získání odměny
        if (typeof addMessage !== 'undefined') {
            addMessage(`Získali jste odměnu: ${reward.name} (${this.formatRewardValue(reward)})`, false);
        }
    }
}

// Vytvoření instance třídy
const RewardSystem = new RewardSystemClass();

// Inicializace modulu při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    RewardSystem.init();
});
