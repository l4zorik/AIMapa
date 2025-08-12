/**
 * Modul pro zobrazení stavu financí s kryptoměnami
 * Verze 0.3.8.0
 */

const CryptoFinances = {
    // Stav kryptoměn
    cryptoState: {
        BTC: {
            amount: 0.05000,
            price: 55464,
            symbol: '₿',
            icon: '₿',
            name: 'Bitcoin'
        },
        ETH: {
            amount: 0.5000,
            price: 3370,
            symbol: 'Ξ',
            icon: 'Ξ',
            name: 'Ethereum'
        },
        DOGE: {
            amount: 1000.0,
            price: 0.1968,
            symbol: 'Ð',
            icon: '🐕',
            name: 'Dogecoin'
        },
        XRP: {
            amount: 100.00,
            price: 0.5714,
            symbol: 'XRP',
            icon: '✘',
            name: 'XRP'
        }
    },

    // Konfigurace
    config: {
        updateInterval: 60000, // Interval aktualizace cen v milisekundách (1 minuta)
        priceFluctuation: 0.02, // Maximální fluktuace ceny (2%)
        xpReward: 5 // XP odměna za zobrazení stavu financí
    },

    // Stav modulu
    state: {
        updateTimer: null,
        financeWindowShown: false,
        firstView: true // Pro udělení XP při prvním zobrazení
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu kryptoměn...');

        // Přidání tlačítka pro zobrazení stavu financí
        this.addFinanceButton();

        // Spuštění časovače pro aktualizaci cen
        this.startPriceUpdates();

        console.log('Modul kryptoměn byl inicializován');
    },

    // Přidání tlačítka pro zobrazení stavu financí
    addFinanceButton() {
        // Kontrola, zda již tlačítko existuje
        let financeButton = document.getElementById('financeButton');

        // Pokud tlačítko neexistuje, vytvoříme ho
        if (!financeButton) {
            financeButton = document.createElement('button');
            financeButton.id = 'financeButton';
            financeButton.className = 'finance-button';
            financeButton.innerHTML = '<span class="finance-button-icon">💰</span>';
            document.body.appendChild(financeButton);

            // Přidání event listeneru
            financeButton.addEventListener('click', () => {
                this.toggleFinanceWindow();
            });
        }
    },

    // Zobrazení/skrytí okna s financemi
    toggleFinanceWindow() {
        if (this.state.financeWindowShown) {
            this.hideFinanceWindow();
        } else {
            this.showFinanceWindow();
        }
    },

    // Zobrazení okna s financemi
    showFinanceWindow() {
        // Kontrola, zda již okno existuje
        if (document.getElementById('financeWindow')) {
            return;
        }

        // Kontrola, zda má uživatel přístup ke kryptoměnám
        if (typeof SubscriptionService !== 'undefined' && !SubscriptionService.hasAccess('cryptoAccess')) {
            // Zobrazení modálního okna s informací o nutnosti předplatného
            alert('Pro přístup ke kryptoměnám je nutné mít aktivní předplatné. Přejděte do sekce Předplatné a vyberte si plán.');

            // Zobrazení modálního okna předplatného
            if (typeof SubscriptionService.showSubscriptionModal === 'function') {
                SubscriptionService.showSubscriptionModal();
            }
            return;
        }

        // Nastavení příznaku zobrazení okna
        this.state.financeWindowShown = true;

        // Vytvoření elementu pro okno
        const financeWindow = document.createElement('div');
        financeWindow.id = 'financeWindow';
        financeWindow.className = 'finance-window';

        // Nastavení obsahu okna
        financeWindow.innerHTML = `
            <div class="finance-window-header">
                <div class="finance-window-title">
                    <i class="icon">💰</i> Stav financí
                </div>
                <div class="finance-window-controls">
                    <button class="finance-window-close">&times;</button>
                </div>
            </div>
            <div class="finance-window-content">
                <div class="finance-item">
                    <div class="finance-icon">
                        <i class="icon">💵</i>
                    </div>
                    <div class="finance-info">
                        <div class="finance-name">Hotovost</div>
                        <div class="finance-amount">${MoneyIndicator ? MoneyIndicator.money : 500} Kč</div>
                    </div>
                </div>
                ${Object.entries(this.cryptoState).map(([symbol, crypto]) => `
                    <div class="finance-item crypto-item">
                        <div class="finance-icon crypto-icon">
                            <i class="icon">${crypto.icon}</i>
                        </div>
                        <div class="finance-info">
                            <div class="finance-name">${crypto.amount} ${symbol}</div>
                            <div class="finance-amount">$ ${this.formatNumber(crypto.amount * crypto.price)}</div>
                        </div>
                    </div>
                `).join('')}
                <div class="finance-total">
                    <div class="finance-total-label">Celková hodnota:</div>
                    <div class="finance-total-amount">
                        ${this.formatNumber(this.calculateTotalValue())} Kč
                    </div>
                </div>
            </div>
        `;

        // Přidání okna do dokumentu
        document.body.appendChild(financeWindow);

        // Animace zobrazení
        setTimeout(() => {
            financeWindow.classList.add('show');
        }, 100);

        // Přidání event listeneru pro zavření
        const closeButton = financeWindow.querySelector('.finance-window-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideFinanceWindow();
            });
        }

        // Přidání možnosti přesouvání okna
        this.makeWindowDraggable(financeWindow);

        // Přidání XP za první zobrazení stavu financí
        if (this.state.firstView && typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(this.config.xpReward, 'Zobrazení stavu financí', 'finance');
            this.state.firstView = false;

            // Kontrola achievementu za zobrazení stavu kryptoměn
            UserProgress.addAchievement('crypto-beginner', 'Krypto začátečník', 'Zobrazili jste si stav kryptoměn');
        }
    },

    // Skrytí okna s financemi
    hideFinanceWindow() {
        const financeWindow = document.getElementById('financeWindow');
        if (financeWindow) {
            financeWindow.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                financeWindow.remove();
            }, 300);
        }

        // Resetování příznaku zobrazení okna
        this.state.financeWindowShown = false;
    },

    // Spuštění časovače pro aktualizaci cen
    startPriceUpdates() {
        // Zrušení existujícího časovače
        if (this.state.updateTimer) {
            clearInterval(this.state.updateTimer);
        }

        // Vytvoření nového časovače
        this.state.updateTimer = setInterval(() => {
            this.updateCryptoPrices();
        }, this.config.updateInterval);
    },

    // Aktualizace cen kryptoměn
    updateCryptoPrices() {
        // Aktualizace cen pro každou kryptoměnu
        Object.keys(this.cryptoState).forEach(symbol => {
            const crypto = this.cryptoState[symbol];

            // Výpočet náhodné změny ceny
            const priceChange = (Math.random() * 2 - 1) * this.config.priceFluctuation;

            // Aktualizace ceny
            crypto.price = crypto.price * (1 + priceChange);

            // Zaokrouhlení ceny na 2 desetinná místa
            crypto.price = Math.round(crypto.price * 100) / 100;
        });

        // Aktualizace zobrazení, pokud je okno otevřené
        if (this.state.financeWindowShown) {
            this.updateFinanceWindow();
        }
    },

    // Aktualizace obsahu okna s financemi
    updateFinanceWindow() {
        const financeWindow = document.getElementById('financeWindow');
        if (!financeWindow) return;

        // Aktualizace hodnot kryptoměn
        Object.entries(this.cryptoState).forEach(([symbol, crypto]) => {
            const cryptoItem = financeWindow.querySelector(`.crypto-item:nth-of-type(${Object.keys(this.cryptoState).indexOf(symbol) + 2})`);
            if (cryptoItem) {
                const amountElement = cryptoItem.querySelector('.finance-amount');
                if (amountElement) {
                    amountElement.textContent = `$ ${this.formatNumber(crypto.amount * crypto.price)}`;
                }
            }
        });

        // Aktualizace celkové hodnoty
        const totalElement = financeWindow.querySelector('.finance-total-amount');
        if (totalElement) {
            totalElement.textContent = `${this.formatNumber(this.calculateTotalValue())} Kč`;
        }
    },

    // Výpočet celkové hodnoty
    calculateTotalValue() {
        // Základní hodnota v Kč
        let totalValue = MoneyIndicator ? MoneyIndicator.money : 500;

        // Přidání hodnoty kryptoměn
        Object.values(this.cryptoState).forEach(crypto => {
            // Převod z USD na Kč (přibližný kurz 1 USD = 22 Kč)
            totalValue += crypto.amount * crypto.price * 22;
        });

        return totalValue;
    },

    // Formátování čísla
    formatNumber(number) {
        return number.toLocaleString('cs-CZ', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    // Přidání možnosti přesouvání okna
    makeWindowDraggable(element) {
        const header = element.querySelector('.finance-window-header');
        if (!header) return;

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();

            // Získání počáteční pozice kurzoru
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // Výpočet nové pozice
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Nastavení nové pozice elementu
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Zastavení přesouvání
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    if (typeof CryptoFinances !== 'undefined') {
        console.log('Inicializace CryptoFinances...');
        CryptoFinances.init();
    } else {
        console.error('CryptoFinances modul nebyl nalezen!');
    }
});
