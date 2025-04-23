/**
 * Modul pro zobrazení a správu peněz
 * Verze 0.2.8.7.8
 */

const MoneyIndicator = {
    // Stav modulu
    isInitialized: false,
    money: 500, // Výchozí hodnota peněz (500 Kč)

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;

        console.log('Inicializace modulu pro zobrazení peněz...');

        // Načtení uložené hodnoty peněz z localStorage
        this.loadMoney();

        // Vytvoření ukazatele peněz
        this.createMoneyIndicator();

        // Přidání event listenerů
        this.setupEventListeners();

        this.isInitialized = true;
        console.log('Modul pro zobrazení peněz byl inicializován');
    },

    // Načtení hodnoty peněz z localStorage
    loadMoney() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            if (appState.money !== undefined) {
                this.money = appState.money;
            }
        } catch (error) {
            console.error('Chyba při načítání hodnoty peněz:', error);
        }
    },

    // Uložení hodnoty peněz do localStorage
    saveMoney() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            appState.money = this.money;
            localStorage.setItem('appState', JSON.stringify(appState));
        } catch (error) {
            console.error('Chyba při ukládání hodnoty peněz:', error);
        }
    },

    // Vytvoření ukazatele peněz
    createMoneyIndicator() {
        // Kontrola, zda ukazatel již existuje
        if (document.getElementById('moneyIndicator')) return;

        // Vytvoření ukazatele pro normální režim
        const moneyIndicator = document.createElement('div');
        moneyIndicator.id = 'moneyIndicator';
        moneyIndicator.className = 'money-indicator';
        moneyIndicator.innerHTML = `
            <span class="money-icon">💰</span>
            <span class="money-value">${this.formatMoney(this.money)}</span>
        `;

        // Přidání ukazatele do dokumentu
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.appendChild(moneyIndicator);
        }

        // Vytvoření ukazatele pro fullscreen režim
        const fsMoneyIndicator = document.createElement('div');
        fsMoneyIndicator.id = 'fsMoneyIndicator';
        fsMoneyIndicator.className = 'fs-money-indicator';
        fsMoneyIndicator.innerHTML = `
            <span class="money-icon">💰</span>
            <span class="money-value">${this.formatMoney(this.money)}</span>
        `;

        // Přidání ukazatele do dokumentu
        document.body.appendChild(fsMoneyIndicator);

        // Aktualizace zobrazení
        this.updateMoneyDisplay();
    },

    // Aktualizace zobrazení peněz
    updateMoneyDisplay() {
        const moneyValue = document.querySelector('#moneyIndicator .money-value');
        const fsMoneyValue = document.querySelector('#fsMoneyIndicator .money-value');

        if (moneyValue) {
            moneyValue.textContent = this.formatMoney(this.money);
        }

        if (fsMoneyValue) {
            fsMoneyValue.textContent = this.formatMoney(this.money);
        }
    },

    // Formátování peněz
    formatMoney(amount) {
        return `${amount.toLocaleString()} Kč`;
    },

    // Přidání peněz
    addMoney(amount, reason) {
        this.money += amount;
        this.updateMoneyDisplay();
        this.saveMoney();

        // Zobrazení zprávy o přidání peněz
        if (typeof addMessage !== 'undefined' && reason) {
            addMessage(`Získali jste ${amount} Kč (${reason}). Aktuální stav: ${this.formatMoney(this.money)}`, false);
        }

        // Přidání XP za získání peněz
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(Math.min(Math.floor(amount / 10), 50), 'Získání peněz');
        }
    },

    // Odebrání peněz
    removeMoney(amount, reason) {
        if (this.money >= amount) {
            this.money -= amount;
            this.updateMoneyDisplay();
            this.saveMoney();

            // Zobrazení zprávy o odebrání peněz
            if (typeof addMessage !== 'undefined' && reason) {
                addMessage(`Utratili jste ${amount} Kč (${reason}). Aktuální stav: ${this.formatMoney(this.money)}`, false);
            }

            return true;
        } else {
            // Nedostatek peněz
            if (typeof addMessage !== 'undefined') {
                addMessage(`Nemáte dostatek peněz. Potřebujete ${amount} Kč, ale máte pouze ${this.formatMoney(this.money)}.`, false);
            }

            return false;
        }
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro přepnutí fullscreen režimu
        document.addEventListener('fullscreenChange', (e) => {
            const isFullscreen = e.detail.isFullscreen;

            // Aktualizace zobrazení ukazatele peněz
            const moneyIndicator = document.getElementById('moneyIndicator');
            const fsMoneyIndicator = document.getElementById('fsMoneyIndicator');

            if (moneyIndicator) {
                moneyIndicator.style.display = isFullscreen ? 'none' : 'flex';
            }

            if (fsMoneyIndicator) {
                fsMoneyIndicator.style.display = isFullscreen ? 'flex' : 'none';
            }
        });
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    MoneyIndicator.init();
});

// Přidání CSS stylů
const moneyIndicatorStyles = document.createElement('style');
moneyIndicatorStyles.textContent = `
.money-indicator {
    position: absolute;
    top: 10px;
    right: 100px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: bold;
    z-index: 500;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.money-indicator:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.fs-money-indicator {
    position: fixed;
    top: 20px;
    right: 150px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 15px;
    border-radius: 25px;
    display: none;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: bold;
    z-index: 1001;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
}

.fs-money-indicator:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6);
}

.money-icon {
    font-size: 1.2em;
}

body[data-theme="dark"] .money-indicator,
body[data-theme="dark"] .fs-money-indicator {
    background-color: rgba(30, 30, 30, 0.8);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
}

body[data-theme="dark"] .money-indicator:hover,
body[data-theme="dark"] .fs-money-indicator:hover {
    background-color: rgba(40, 40, 40, 0.9);
}

.map-fullscreen .money-indicator {
    display: none;
}

.map-fullscreen .fs-money-indicator {
    display: flex;
}
`;

document.head.appendChild(moneyIndicatorStyles);
