/**
 * Modul pro zobrazení a správu peněz a kryptoměn
 * Verze 0.2.9.5
 */

const MoneyIndicator = {
    // Stav modulu
    isInitialized: false,
    money: 500, // Výchozí hodnota peněz (500 Kč)
    crypto: {
        BTC: 0.05, // Výchozí hodnota bitcoinu (0.05 BTC)
        ETH: 0.5, // Výchozí hodnota etherea (0.5 ETH)
        DOGE: 1000, // Výchozí hodnota dogecoinu (1000 DOGE)
        XRP: 100 // Výchozí hodnota ripple (100 XRP)
    },
    cryptoPrices: {
        BTC: 0, // Aktuální cena bitcoinu v USD
        ETH: 0, // Aktuální cena etherea v USD
        DOGE: 0, // Aktuální cena dogecoinu v USD
        XRP: 0 // Aktuální cena ripple v USD
    },
    activeCrypto: 'BTC', // Aktuálně zobrazená kryptoměna

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

    // Načtení hodnoty peněz a kryptoměn z localStorage
    loadMoney() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            if (appState.money !== undefined) {
                this.money = appState.money;
            }

            // Zpětná kompatibilita pro bitcoin
            if (appState.bitcoin !== undefined && !appState.crypto) {
                this.crypto.BTC = appState.bitcoin;
            }

            // Načtení všech kryptoměn
            if (appState.crypto) {
                this.crypto = appState.crypto;
            }

            // Načtení aktivní kryptoměny
            if (appState.activeCrypto) {
                this.activeCrypto = appState.activeCrypto;
            }

            // Načtení cen kryptoměn
            this.fetchCryptoPrices();
        } catch (error) {
            console.error('Chyba při načítání hodnoty peněz nebo kryptoměn:', error);
        }
    },

    // Uložení hodnoty peněz a kryptoměn do localStorage
    saveMoney() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            appState.money = this.money;
            appState.crypto = this.crypto;
            appState.activeCrypto = this.activeCrypto;
            localStorage.setItem('appState', JSON.stringify(appState));
        } catch (error) {
            console.error('Chyba při ukládání hodnoty peněz nebo kryptoměn:', error);
        }
    },

    // Získání aktuálních cen kryptoměn
    fetchCryptoPrices() {
        // Simulace získání cen kryptoměn (v reálné aplikaci by se použil API call)
        this.cryptoPrices = {
            BTC: Math.floor(50000 + Math.random() * 10000), // Cena BTC mezi 50000-60000 USD
            ETH: Math.floor(3000 + Math.random() * 1000),   // Cena ETH mezi 3000-4000 USD
            DOGE: (0.1 + Math.random() * 0.2).toFixed(4),   // Cena DOGE mezi 0.1-0.3 USD
            XRP: (0.5 + Math.random() * 0.5).toFixed(4)     // Cena XRP mezi 0.5-1.0 USD
        };

        // Aktualizace zobrazení
        this.updateMoneyDisplay();
    },

    // Vytvoření ukazatele peněz a kryptoměn
    createMoneyIndicator() {
        // Kontrola, zda ukazatel již existuje
        if (document.getElementById('moneyIndicator')) return;

        // Vytvoření ukazatele pro normální režim
        const moneyIndicator = document.createElement('div');
        moneyIndicator.id = 'moneyIndicator';
        moneyIndicator.className = 'money-indicator';
        moneyIndicator.innerHTML = `
            <div class="money-header">
                <div class="money-drag-handle">⋮⋮</div>
                <div class="money-controls">
                    <button class="money-control-btn minimize-btn" title="Minimalizovat">−</button>
                </div>
            </div>
            <div class="currency-wrapper">
                <div class="money-container">
                    <span class="money-icon">💰</span>
                    <span class="money-value">${this.formatMoney(this.money)}</span>
                </div>
                <div class="crypto-container">
                    <span class="crypto-icon">${this.getCryptoIcon(this.activeCrypto)}</span>
                    <span class="crypto-value">${this.formatCrypto(this.crypto[this.activeCrypto], this.activeCrypto)}</span>
                    <button class="crypto-switch-btn" title="Přepnout kryptoměnu">↻</button>
                </div>
                <div class="crypto-price">
                    <span class="price-value">${this.formatCryptoPrice(this.cryptoPrices[this.activeCrypto], this.activeCrypto)}</span>
                </div>
            </div>
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
            <div class="money-header">
                <div class="money-drag-handle">⋮⋮</div>
                <div class="money-controls">
                    <button class="money-control-btn minimize-btn" title="Minimalizovat">−</button>
                </div>
            </div>
            <div class="currency-wrapper">
                <div class="money-container">
                    <span class="money-icon">💰</span>
                    <span class="money-value">${this.formatMoney(this.money)}</span>
                </div>
                <div class="crypto-container">
                    <span class="crypto-icon">${this.getCryptoIcon(this.activeCrypto)}</span>
                    <span class="crypto-value">${this.formatCrypto(this.crypto[this.activeCrypto], this.activeCrypto)}</span>
                    <button class="crypto-switch-btn" title="Přepnout kryptoměnu">↻</button>
                </div>
                <div class="crypto-price">
                    <span class="price-value">${this.formatCryptoPrice(this.cryptoPrices[this.activeCrypto], this.activeCrypto)}</span>
                </div>
            </div>
        `;

        // Přidání ukazatele do dokumentu
        document.body.appendChild(fsMoneyIndicator);

        // Aktualizace zobrazení
        this.updateMoneyDisplay();

        // Přidání možnosti přesouvat ukazatele
        if (typeof DraggableElements !== 'undefined') {
            const moneyHeader = moneyIndicator.querySelector('.money-header');
            const fsMoneyHeader = fsMoneyIndicator.querySelector('.money-header');

            DraggableElements.makeDraggable(moneyIndicator, moneyHeader, 'moneyIndicator');
            DraggableElements.makeDraggable(fsMoneyIndicator, fsMoneyHeader, 'fsMoneyIndicator');

            // Nastavení přesouvatelnosti pro oba režimy
            DraggableElements.setElementDraggable(moneyIndicator, true);
            DraggableElements.setElementDraggable(fsMoneyIndicator, true);
        }

        // Přidání event listenerů pro tlačítka
        const minimizeBtn = moneyIndicator.querySelector('.minimize-btn');
        const fsMinimizeBtn = fsMoneyIndicator.querySelector('.minimize-btn');
        const cryptoSwitchBtn = moneyIndicator.querySelector('.crypto-switch-btn');
        const fsCryptoSwitchBtn = fsMoneyIndicator.querySelector('.crypto-switch-btn');

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.toggleMinimize('moneyIndicator'));
        }

        if (fsMinimizeBtn) {
            fsMinimizeBtn.addEventListener('click', () => this.toggleMinimize('fsMoneyIndicator'));
        }

        if (cryptoSwitchBtn) {
            cryptoSwitchBtn.addEventListener('click', () => this.switchCrypto());
        }

        if (fsCryptoSwitchBtn) {
            fsCryptoSwitchBtn.addEventListener('click', () => this.switchCrypto());
        }

        // Aktualizace cen kryptoměn každých 30 sekund
        setInterval(() => this.fetchCryptoPrices(), 30000);
    },

    // Aktualizace zobrazení peněz a kryptoměn
    updateMoneyDisplay() {
        const moneyValue = document.querySelector('#moneyIndicator .money-value');
        const fsMoneyValue = document.querySelector('#fsMoneyIndicator .money-value');
        const cryptoValue = document.querySelector('#moneyIndicator .crypto-value');
        const fsCryptoValue = document.querySelector('#fsMoneyIndicator .crypto-value');
        const cryptoIcon = document.querySelector('#moneyIndicator .crypto-icon');
        const fsCryptoIcon = document.querySelector('#fsMoneyIndicator .crypto-icon');
        const priceValue = document.querySelector('#moneyIndicator .price-value');
        const fsPriceValue = document.querySelector('#fsMoneyIndicator .price-value');
        const cryptoContainer = document.querySelector('#moneyIndicator .crypto-container');
        const fsCryptoContainer = document.querySelector('#fsMoneyIndicator .crypto-container');

        if (moneyValue) {
            moneyValue.textContent = this.formatMoney(this.money);
        }

        if (fsMoneyValue) {
            fsMoneyValue.textContent = this.formatMoney(this.money);
        }

        if (cryptoValue) {
            cryptoValue.textContent = this.formatCrypto(this.crypto[this.activeCrypto], this.activeCrypto);
        }

        if (fsCryptoValue) {
            fsCryptoValue.textContent = this.formatCrypto(this.crypto[this.activeCrypto], this.activeCrypto);
        }

        if (cryptoIcon) {
            cryptoIcon.textContent = this.getCryptoIcon(this.activeCrypto);
        }

        if (fsCryptoIcon) {
            fsCryptoIcon.textContent = this.getCryptoIcon(this.activeCrypto);
        }

        if (priceValue) {
            priceValue.textContent = this.formatCryptoPrice(this.cryptoPrices[this.activeCrypto], this.activeCrypto);
        }

        if (fsPriceValue) {
            fsPriceValue.textContent = this.formatCryptoPrice(this.cryptoPrices[this.activeCrypto], this.activeCrypto);
        }

        // Aktualizace data atributu pro stylování
        if (cryptoContainer) {
            cryptoContainer.setAttribute('data-crypto', this.activeCrypto);
        }

        if (fsCryptoContainer) {
            fsCryptoContainer.setAttribute('data-crypto', this.activeCrypto);
        }
    },

    // Formátování peněz
    formatMoney(amount) {
        return `${amount.toLocaleString()} Kč`;
    },

    // Formátování kryptoměny
    formatCrypto(amount, symbol) {
        switch (symbol) {
            case 'BTC':
                return `${amount.toFixed(5)} BTC`;
            case 'ETH':
                return `${amount.toFixed(4)} ETH`;
            case 'DOGE':
                return `${amount.toFixed(1)} DOGE`;
            case 'XRP':
                return `${amount.toFixed(2)} XRP`;
            default:
                return `${amount.toFixed(5)} ${symbol}`;
        }
    },

    // Formátování ceny kryptoměny
    formatCryptoPrice(price, symbol) {
        if (!price) return '$ --';

        switch (symbol) {
            case 'BTC':
                return `$ ${Number(price).toLocaleString()}`;
            case 'ETH':
                return `$ ${Number(price).toLocaleString()}`;
            case 'DOGE':
            case 'XRP':
                return `$ ${Number(price)}`;
            default:
                return `$ ${Number(price).toLocaleString()}`;
        }
    },

    // Získání ikony pro kryptoměnu
    getCryptoIcon(symbol) {
        switch (symbol) {
            case 'BTC': return '₿'; // Bitcoin symbol
            case 'ETH': return 'Ξ'; // Ethereum symbol (Xi)
            case 'DOGE': return '🐶'; // Dog emoji
            case 'XRP': return 'X'; // XRP symbol
            default: return '₿';
        }
    },

    // Přepnutí aktivní kryptoměny
    switchCrypto() {
        const cryptoSymbols = Object.keys(this.crypto);
        const currentIndex = cryptoSymbols.indexOf(this.activeCrypto);
        const nextIndex = (currentIndex + 1) % cryptoSymbols.length;
        this.activeCrypto = cryptoSymbols[nextIndex];

        // Aktualizace zobrazení
        this.updateMoneyDisplay();

        // Uložení nastavení
        this.saveMoney();

        // Zobrazení zprávy o přepnutí kryptoměny
        if (typeof addMessage !== 'undefined') {
            addMessage(`Přepnuto na kryptoměnu ${this.activeCrypto}. Aktuální stav: ${this.formatCrypto(this.crypto[this.activeCrypto], this.activeCrypto)}`, false);
        }
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

    // Přidání kryptoměny
    addCrypto(amount, symbol = 'BTC', reason) {
        if (!this.crypto[symbol]) {
            this.crypto[symbol] = 0;
        }

        this.crypto[symbol] += amount;
        this.updateMoneyDisplay();
        this.saveMoney();

        // Zobrazení zprávy o přidání kryptoměny
        if (typeof addMessage !== 'undefined' && reason) {
            addMessage(`Získali jste ${this.formatCrypto(amount, symbol)} (${reason}). Aktuální stav: ${this.formatCrypto(this.crypto[symbol], symbol)}`, false);
        }

        // Přidání XP za získání kryptoměny
        if (typeof UserProgress !== 'undefined') {
            let xpAmount = 0;
            switch (symbol) {
                case 'BTC':
                    xpAmount = Math.min(Math.floor(amount * 1000), 100);
                    break;
                case 'ETH':
                    xpAmount = Math.min(Math.floor(amount * 100), 80);
                    break;
                case 'DOGE':
                    xpAmount = Math.min(Math.floor(amount / 10), 50);
                    break;
                case 'XRP':
                    xpAmount = Math.min(Math.floor(amount), 60);
                    break;
                default:
                    xpAmount = Math.min(Math.floor(amount * 100), 50);
            }
            UserProgress.addXP(xpAmount, `Získání ${symbol}`);
        }
    },

    // Odebrání kryptoměny
    removeCrypto(amount, symbol = 'BTC', reason) {
        if (!this.crypto[symbol]) {
            this.crypto[symbol] = 0;
        }

        if (this.crypto[symbol] >= amount) {
            this.crypto[symbol] -= amount;
            this.updateMoneyDisplay();
            this.saveMoney();

            // Zobrazení zprávy o odebrání kryptoměny
            if (typeof addMessage !== 'undefined' && reason) {
                addMessage(`Utratili jste ${this.formatCrypto(amount, symbol)} (${reason}). Aktuální stav: ${this.formatCrypto(this.crypto[symbol], symbol)}`, false);
            }

            return true;
        } else {
            // Nedostatek kryptoměny
            if (typeof addMessage !== 'undefined') {
                addMessage(`Nemáte dostatek ${symbol}. Potřebujete ${this.formatCrypto(amount, symbol)}, ale máte pouze ${this.formatCrypto(this.crypto[symbol], symbol)}.`, false);
            }

            return false;
        }
    },

    // Zpětná kompatibilita pro bitcoin
    addBitcoin(amount, reason) {
        return this.addCrypto(amount, 'BTC', reason);
    },

    // Zpětná kompatibilita pro bitcoin
    removeBitcoin(amount, reason) {
        return this.removeCrypto(amount, 'BTC', reason);
    },

    // Přepínání minimalizace ukazatele
    toggleMinimize(indicatorId) {
        const indicator = document.getElementById(indicatorId);
        if (!indicator) return;

        const currencyWrapper = indicator.querySelector('.currency-wrapper');
        const minimizeBtn = indicator.querySelector('.minimize-btn');

        if (currencyWrapper.style.display === 'none') {
            // Maximalizovat
            currencyWrapper.style.display = 'flex';
            minimizeBtn.textContent = '−';
            minimizeBtn.title = 'Minimalizovat';
            indicator.classList.remove('minimized');
        } else {
            // Minimalizovat
            currencyWrapper.style.display = 'none';
            minimizeBtn.textContent = '+';
            minimizeBtn.title = 'Maximalizovat';
            indicator.classList.add('minimized');
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
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    font-size: 20px;
    font-weight: bold;
    z-index: 500;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
    overflow: hidden;
    min-width: 380px;
    cursor: move;
}

.money-indicator:hover {
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.fs-money-indicator {
    position: fixed;
    top: 20px;
    right: 150px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    border-radius: 15px;
    display: none;
    flex-direction: column;
    font-size: 22px;
    font-weight: bold;
    z-index: 1001;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    overflow: hidden;
    min-width: 420px;
    cursor: move;
}

.money-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 18px;
    background-color: rgba(0, 0, 0, 0.3);
    cursor: move;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.money-drag-handle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    cursor: move;
}

.money-controls {
    display: flex;
    gap: 5px;
}

.money-control-btn {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.money-control-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.currency-wrapper {
    display: flex;
    align-items: center;
    gap: 25px;
    padding: 15px 20px;
    background-color: rgba(0, 0, 0, 0.2);
}

.money-container, .crypto-container {
    display: flex;
    align-items: center;
    gap: 8px;
}

.money-icon, .crypto-icon {
    font-size: 1.8em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    margin-right: 10px;
}

.crypto-icon {
    font-weight: bold;
    text-align: center;
}

.crypto-value {
    white-space: nowrap;
    font-size: 1.3em;
}

.money-value {
    white-space: nowrap;
    font-size: 1.3em;
}

/* Styly pro různé kryptoměny */
.crypto-container[data-crypto="BTC"] .crypto-icon,
.crypto-container[data-crypto="BTC"] .crypto-value {
    color: #f7931a;
}

.crypto-container[data-crypto="ETH"] .crypto-icon,
.crypto-container[data-crypto="ETH"] .crypto-value {
    color: #627eea;
}

.crypto-container[data-crypto="DOGE"] .crypto-icon,
.crypto-container[data-crypto="DOGE"] .crypto-value {
    color: #c3a634;
}

.crypto-container[data-crypto="XRP"] .crypto-icon,
.crypto-container[data-crypto="XRP"] .crypto-value {
    color: #23292f;
}

.crypto-price {
    font-size: 1em;
    opacity: 0.9;
    margin-left: 12px;
    white-space: nowrap;
    background-color: rgba(255, 255, 255, 0.15);
    padding: 6px 10px;
    border-radius: 12px;
}

.crypto-switch-btn {
    background: rgba(255, 255, 255, 0.15);
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
    padding: 0;
    margin-left: 10px;
}

.crypto-switch-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
}

.money-indicator.minimized,
.fs-money-indicator.minimized {
    width: auto;
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
