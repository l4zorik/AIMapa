/**
 * Vylepšený modul pro zobrazení a správu peněz a kryptoměn
 * Verze 0.3.0.4
 */

const MoneyIndicatorEnhanced = {
    // Stav modulu
    isInitialized: false,
    
    // Inicializace modulu
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializace vylepšeného modulu pro zobrazení peněz...');
        
        // Přidání CSS stylů
        this.loadStyles();
        
        // Vylepšení existujícího indikátoru peněz
        this.enhanceMoneyIndicator();
        
        // Přidání event listenerů
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Vylepšený modul pro zobrazení peněz byl inicializován');
    },
    
    // Načtení CSS stylů
    loadStyles() {
        // Kontrola, zda již existuje odkaz na styly
        if (document.getElementById('money-indicator-enhanced-styles')) {
            return;
        }
        
        // Vytvoření odkazu na styly
        const link = document.createElement('link');
        link.id = 'money-indicator-enhanced-styles';
        link.rel = 'stylesheet';
        link.href = 'money-indicator-enhanced.css';
        
        // Přidání odkazu do hlavičky
        document.head.appendChild(link);
    },
    
    // Vylepšení existujícího indikátoru peněz
    enhanceMoneyIndicator() {
        // Kontrola, zda existuje původní indikátor
        const originalIndicator = document.getElementById('moneyIndicator');
        const fullscreenIndicator = document.getElementById('fullscreenMoneyIndicator');
        
        if (originalIndicator) {
            // Přidání ikony dolaru
            const moneyValue = originalIndicator.querySelector('.money-value');
            
            if (moneyValue) {
                // Vytvoření ikony dolaru
                const moneyIcon = document.createElement('div');
                moneyIcon.className = 'money-icon';
                moneyIcon.innerHTML = '$';
                
                // Přidání ikony před hodnotu
                originalIndicator.insertBefore(moneyIcon, moneyValue);
                
                // Přidání event listeneru pro zobrazení rozšířeného panelu
                moneyIcon.addEventListener('click', () => {
                    this.toggleFinancePanel();
                });
            }
        }
        
        if (fullscreenIndicator) {
            // Přidání ikony dolaru do fullscreen indikátoru
            const fsMoneyValue = fullscreenIndicator.querySelector('.fs-money-value');
            
            if (fsMoneyValue) {
                // Vytvoření ikony dolaru
                const fsMoneyIcon = document.createElement('div');
                fsMoneyIcon.className = 'money-icon';
                fsMoneyIcon.innerHTML = '$';
                
                // Přidání ikony před hodnotu
                fullscreenIndicator.insertBefore(fsMoneyIcon, fsMoneyValue);
                
                // Přidání event listeneru pro zobrazení rozšířeného panelu
                fsMoneyIcon.addEventListener('click', () => {
                    this.toggleFinancePanel();
                });
            }
        }
        
        // Vytvoření rozšířeného finančního panelu
        this.createFinancePanel();
    },
    
    // Vytvoření rozšířeného finančního panelu
    createFinancePanel() {
        // Kontrola, zda již existuje panel
        if (document.getElementById('finance-panel')) {
            return;
        }
        
        // Načtení dat z localStorage
        const appState = JSON.parse(localStorage.getItem('appState')) || {};
        const money = appState.money !== undefined ? appState.money : 500;
        const crypto = appState.crypto || {
            BTC: 0.05,
            ETH: 0.5,
            DOGE: 1000,
            XRP: 100
        };
        
        // Simulace získání cen kryptoměn
        const cryptoPrices = {
            BTC: Math.floor(50000 + Math.random() * 10000), // Cena BTC mezi 50000-60000 USD
            ETH: Math.floor(3000 + Math.random() * 1000),   // Cena ETH mezi 3000-4000 USD
            DOGE: (0.1 + Math.random() * 0.2).toFixed(4),   // Cena DOGE mezi 0.1-0.3 USD
            XRP: (0.5 + Math.random() * 0.5).toFixed(4)     // Cena XRP mezi 0.5-1.0 USD
        };
        
        // Vytvoření panelu
        const panel = document.createElement('div');
        panel.id = 'finance-panel';
        panel.className = 'finance-panel';
        
        // Vytvoření obsahu panelu
        panel.innerHTML = `
            <div class="finance-panel-header">
                <h3>Finance</h3>
                <button class="finance-panel-close">&times;</button>
            </div>
            <div class="finance-panel-content">
                <div class="finance-item money-item">
                    <div class="finance-icon" style="background: linear-gradient(135deg, #2ecc71, #27ae60);">💰</div>
                    <div class="finance-details">
                        <div class="finance-name">Hotovost</div>
                        <div class="finance-value">${this.formatMoney(money)}</div>
                    </div>
                </div>
                <div class="finance-item crypto-item" data-crypto="BTC">
                    <div class="finance-icon" style="background: linear-gradient(135deg, #f39c12, #e67e22);">₿</div>
                    <div class="finance-details">
                        <div class="finance-name">Bitcoin</div>
                        <div class="finance-value">${this.formatCrypto(crypto.BTC, 'BTC')}</div>
                        <div class="finance-secondary">${this.formatCryptoPrice(cryptoPrices.BTC, 'BTC')}</div>
                    </div>
                </div>
                <div class="finance-item crypto-item" data-crypto="ETH">
                    <div class="finance-icon" style="background: linear-gradient(135deg, #3498db, #2980b9);">Ξ</div>
                    <div class="finance-details">
                        <div class="finance-name">Ethereum</div>
                        <div class="finance-value">${this.formatCrypto(crypto.ETH, 'ETH')}</div>
                        <div class="finance-secondary">${this.formatCryptoPrice(cryptoPrices.ETH, 'ETH')}</div>
                    </div>
                </div>
                <div class="finance-item crypto-item" data-crypto="DOGE">
                    <div class="finance-icon" style="background: linear-gradient(135deg, #f1c40f, #f39c12);">🐶</div>
                    <div class="finance-details">
                        <div class="finance-name">Dogecoin</div>
                        <div class="finance-value">${this.formatCrypto(crypto.DOGE, 'DOGE')}</div>
                        <div class="finance-secondary">${this.formatCryptoPrice(cryptoPrices.DOGE, 'DOGE')}</div>
                    </div>
                </div>
                <div class="finance-item crypto-item" data-crypto="XRP">
                    <div class="finance-icon" style="background: linear-gradient(135deg, #34495e, #2c3e50);">X</div>
                    <div class="finance-details">
                        <div class="finance-name">Ripple</div>
                        <div class="finance-value">${this.formatCrypto(crypto.XRP, 'XRP')}</div>
                        <div class="finance-secondary">${this.formatCryptoPrice(cryptoPrices.XRP, 'XRP')}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Přidání panelu do stránky
        document.body.appendChild(panel);
        
        // Přidání event listeneru pro zavření panelu
        const closeBtn = panel.querySelector('.finance-panel-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.style.display = 'none';
            });
        }
        
        // Přidání event listenerů pro položky kryptoměn
        const cryptoItems = panel.querySelectorAll('.crypto-item');
        cryptoItems.forEach(item => {
            item.addEventListener('click', () => {
                const cryptoType = item.dataset.crypto;
                this.showCryptoDetails(cryptoType);
            });
        });
    },
    
    // Zobrazení/skrytí rozšířeného finančního panelu
    toggleFinancePanel() {
        const panel = document.getElementById('finance-panel');
        
        if (panel) {
            panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
            
            // Aktualizace dat v panelu
            if (panel.style.display === 'block') {
                this.updateFinancePanel();
                
                // Přidání XP za zobrazení finančního panelu
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(2, 'Zobrazení finančního přehledu');
                }
            }
        }
    },
    
    // Aktualizace dat v rozšířeném finančním panelu
    updateFinancePanel() {
        const panel = document.getElementById('finance-panel');
        
        if (!panel) return;
        
        // Načtení dat z localStorage
        const appState = JSON.parse(localStorage.getItem('appState')) || {};
        const money = appState.money !== undefined ? appState.money : 500;
        const crypto = appState.crypto || {
            BTC: 0.05,
            ETH: 0.5,
            DOGE: 1000,
            XRP: 100
        };
        
        // Simulace získání cen kryptoměn
        const cryptoPrices = {
            BTC: Math.floor(50000 + Math.random() * 10000),
            ETH: Math.floor(3000 + Math.random() * 1000),
            DOGE: (0.1 + Math.random() * 0.2).toFixed(4),
            XRP: (0.5 + Math.random() * 0.5).toFixed(4)
        };
        
        // Aktualizace hodnoty peněz
        const moneyValue = panel.querySelector('.money-item .finance-value');
        if (moneyValue) {
            moneyValue.textContent = this.formatMoney(money);
        }
        
        // Aktualizace hodnot kryptoměn
        Object.entries(crypto).forEach(([symbol, amount]) => {
            const cryptoItem = panel.querySelector(`.crypto-item[data-crypto="${symbol}"]`);
            
            if (cryptoItem) {
                const valueElement = cryptoItem.querySelector('.finance-value');
                const priceElement = cryptoItem.querySelector('.finance-secondary');
                
                if (valueElement) {
                    valueElement.textContent = this.formatCrypto(amount, symbol);
                }
                
                if (priceElement) {
                    priceElement.textContent = this.formatCryptoPrice(cryptoPrices[symbol], symbol);
                }
            }
        });
    },
    
    // Zobrazení detailů kryptoměny
    showCryptoDetails(cryptoType) {
        // Načtení dat z localStorage
        const appState = JSON.parse(localStorage.getItem('appState')) || {};
        const crypto = appState.crypto || {
            BTC: 0.05,
            ETH: 0.5,
            DOGE: 1000,
            XRP: 100
        };
        
        // Simulace získání cen kryptoměn
        const cryptoPrices = {
            BTC: Math.floor(50000 + Math.random() * 10000),
            ETH: Math.floor(3000 + Math.random() * 1000),
            DOGE: (0.1 + Math.random() * 0.2).toFixed(4),
            XRP: (0.5 + Math.random() * 0.5).toFixed(4)
        };
        
        // Získání hodnoty a ceny kryptoměny
        const cryptoValue = crypto[cryptoType] || 0;
        const cryptoPrice = cryptoPrices[cryptoType] || 0;
        
        // Vytvoření zprávy pro chat
        let message = '';
        
        switch (cryptoType) {
            case 'BTC':
                message = `₿ Bitcoin (BTC)\n`;
                break;
            case 'ETH':
                message = `Ξ Ethereum (ETH)\n`;
                break;
            case 'DOGE':
                message = `🐶 Dogecoin (DOGE)\n`;
                break;
            case 'XRP':
                message = `X Ripple (XRP)\n`;
                break;
            default:
                message = `${cryptoType}\n`;
        }
        
        message += `Aktuální stav: ${this.formatCrypto(cryptoValue, cryptoType)}\n`;
        message += `Aktuální cena: ${this.formatCryptoPrice(cryptoPrice, cryptoType)}\n`;
        message += `Hodnota v Kč: ${this.formatMoney(Math.round(cryptoValue * cryptoPrice * 22.5))}\n\n`;
        
        // Přidání informací o vývoji ceny (simulace)
        const changePercent = (Math.random() * 10 - 5).toFixed(2);
        const changeDirection = changePercent >= 0 ? '📈' : '📉';
        
        message += `Změna za 24h: ${changeDirection} ${changePercent}%\n`;
        message += `Tržní kapitalizace: ${this.formatMoney(Math.round(cryptoPrice * (cryptoType === 'BTC' ? 19000000 : cryptoType === 'ETH' ? 120000000 : cryptoType === 'DOGE' ? 132000000000 : 100000000000) * 22.5))}\n`;
        
        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(message, false);
        }
        
        // Přidání XP za zobrazení detailů kryptoměny
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(5, `Zobrazení detailů ${cryptoType}`);
        }
    },
    
    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro aktualizaci indikátoru při změně peněz
        document.addEventListener('moneyAdded', (e) => {
            // Přidání třídy pro animaci
            const moneyValue = document.querySelector('.money-value');
            const fsMoneyValue = document.querySelector('.fs-money-value');
            
            if (moneyValue) {
                moneyValue.classList.remove('money-added');
                void moneyValue.offsetWidth; // Trigger reflow
                moneyValue.classList.add('money-added');
            }
            
            if (fsMoneyValue) {
                fsMoneyValue.classList.remove('money-added');
                void fsMoneyValue.offsetWidth; // Trigger reflow
                fsMoneyValue.classList.add('money-added');
            }
            
            // Aktualizace rozšířeného panelu
            this.updateFinancePanel();
        });
        
        document.addEventListener('moneyRemoved', (e) => {
            // Přidání třídy pro animaci
            const moneyValue = document.querySelector('.money-value');
            const fsMoneyValue = document.querySelector('.fs-money-value');
            
            if (moneyValue) {
                moneyValue.classList.remove('money-removed');
                void moneyValue.offsetWidth; // Trigger reflow
                moneyValue.classList.add('money-removed');
            }
            
            if (fsMoneyValue) {
                fsMoneyValue.classList.remove('money-removed');
                void fsMoneyValue.offsetWidth; // Trigger reflow
                fsMoneyValue.classList.add('money-removed');
            }
            
            // Aktualizace rozšířeného panelu
            this.updateFinancePanel();
        });
    },
    
    // Pomocné funkce pro formátování
    formatMoney(amount) {
        return `${amount.toLocaleString()} Kč`;
    },
    
    formatCrypto(amount, symbol) {
        if (symbol === 'BTC' || symbol === 'ETH') {
            return amount.toFixed(5) + ' ' + symbol;
        } else {
            return amount.toLocaleString() + ' ' + symbol;
        }
    },
    
    formatCryptoPrice(price, symbol) {
        if (symbol === 'BTC' || symbol === 'ETH') {
            return '$' + price.toLocaleString();
        } else {
            return '$' + price;
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda existuje původní indikátor peněz
    if (typeof MoneyIndicator !== 'undefined') {
        // Čekání na inicializaci původního indikátoru
        const initInterval = setInterval(() => {
            if (document.getElementById('moneyIndicator')) {
                clearInterval(initInterval);
                MoneyIndicatorEnhanced.init();
            }
        }, 500);
    } else {
        // Pokud neexistuje původní indikátor, inicializujeme vylepšený modul přímo
        setTimeout(() => {
            MoneyIndicatorEnhanced.init();
        }, 1000);
    }
});
