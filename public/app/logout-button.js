/**
 * Modul pro odhlašovací tlačítko v AIMapa
 * Verze 0.3.8.5
 */

const LogoutButton = {
    // Stav modulu
    state: {
        buttonAdded: false,
        isLoggedIn: false
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu LogoutButton...');

        // Načtení CSS
        this.loadStyles();

        // Přidání tlačítka
        this.addLogoutButton();

        // Přidání posluchače události pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            console.log('LogoutButton: Změna stavu přihlášení:', event.detail.isLoggedIn);
            this.state.isLoggedIn = event.detail.isLoggedIn;
            this.updateButtonVisibility();
        });

        // Kontrola aktuálního stavu přihlášení
        this.checkLoginState();

        return this;
    },

    // Načtení CSS stylů
    loadStyles() {
        // Kontrola, zda již styly existují
        if (document.getElementById('logout-button-styles')) {
            return;
        }

        // Vytvoření odkazu na CSS soubor
        const link = document.createElement('link');
        link.id = 'logout-button-styles';
        link.rel = 'stylesheet';
        link.href = 'app/logout-button.css';
        document.head.appendChild(link);
    },

    // Přidání odhlašovacího tlačítka
    addLogoutButton() {
        // Kontrola, zda již tlačítko existuje
        if (this.state.buttonAdded || document.getElementById('logoutButton')) {
            return;
        }

        // Vytvoření tlačítka
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutButton';
        logoutButton.className = 'logout-button';
        logoutButton.title = 'Odhlásit se';
        logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i>';

        // Přidání posluchače události
        logoutButton.addEventListener('click', () => {
            this.logout();
        });

        // Přidání tlačítka do dokumentu
        document.body.appendChild(logoutButton);

        // Aktualizace stavu
        this.state.buttonAdded = true;

        // Aktualizace viditelnosti tlačítka
        this.updateButtonVisibility();
    },

    // Aktualizace viditelnosti tlačítka
    updateButtonVisibility() {
        const logoutButton = document.getElementById('logoutButton');
        if (!logoutButton) return;

        if (this.state.isLoggedIn) {
            logoutButton.style.display = 'flex';
        } else {
            logoutButton.style.display = 'none';
        }
    },

    // Kontrola stavu přihlášení
    checkLoginState() {
        // Kontrola, zda je Auth0Auth modul dostupný
        if (typeof Auth0Auth !== 'undefined') {
            this.state.isLoggedIn = Auth0Auth.state.isLoggedIn;
        } else {
            // Fallback - kontrola localStorage
            this.state.isLoggedIn = localStorage.getItem('aiMapaLoggedIn') === 'true';
        }

        // Aktualizace viditelnosti tlačítka
        this.updateButtonVisibility();
    },

    // Odhlášení uživatele
    logout() {
        // Zobrazení potvrzovacího dialogu
        if (!confirm('Opravdu se chcete odhlásit z aplikace?')) {
            console.log('Odhlášení zrušeno uživatelem');
            return;
        }

        // Zobrazení informace o odhlašování
        this.showLogoutNotification();

        // Kontrola, zda je Auth0Auth modul dostupný
        if (typeof Auth0Auth !== 'undefined' && typeof Auth0Auth.logout === 'function') {
            console.log('Odhlašování přes Auth0Auth...');

            // Nastavení příznaku pro přesměrování na přihlašovací stránku
            localStorage.setItem('aiMapaRedirectToLogin', 'true');

            // Odhlášení přes Auth0
            Auth0Auth.logout({
                logoutParams: {
                    returnTo: window.location.origin + '/login.html'
                }
            });
        } else {
            console.log('Auth0Auth není dostupný, provádím základní odhlášení');

            // Odstranění informací o přihlášení z localStorage
            localStorage.removeItem('aiMapaLoggedIn');
            localStorage.removeItem('aiMapaUserEmail');
            localStorage.removeItem('aiMapaUserProfile');
            localStorage.removeItem('aiMapaAccessToken');
            localStorage.removeItem('aiMapaIdToken');
            localStorage.removeItem('aiMapaAuthOverlayRemoved');

            // Přesměrování na přihlašovací stránku
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1000);
        }
    },

    // Zobrazení notifikace o odhlašování
    showLogoutNotification() {
        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'logout-notification';
        notification.innerHTML = `
            <div class="logout-notification-content">
                <div class="logout-spinner"></div>
                <p>Probíhá odhlašování...</p>
            </div>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);
    },

    // Zobrazení denní odměny
    showDailyReward() {
        console.log('Zobrazuji denní odměnu...');

        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'daily-reward-notification';
        notification.innerHTML = `
            <div class="daily-reward-title">Denní odměna!</div>
            <div class="daily-reward-icon">🎁</div>
            <div class="daily-reward-message">Vyzvedněte si svou dnešní odměnu za přihlášení.</div>
            <button class="daily-reward-button">Vyzvednout odměnu</button>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);

        // Přidání posluchače události pro tlačítko
        const button = notification.querySelector('.daily-reward-button');
        if (button) {
            button.addEventListener('click', () => {
                // Odstranění notifikace
                notification.remove();

                // Otevření profilu uživatele
                if (typeof UserProfile !== 'undefined' && typeof UserProfile.toggleProfileModal === 'function') {
                    UserProfile.toggleProfileModal();
                }

                // Uložení informace o vyzvednutí odměny
                const today = new Date().toISOString().split('T')[0];
                localStorage.setItem('aiMapaDailyRewardClaimed', today);
            });
        }
    },

    // Kontrola, zda má být zobrazena denní odměna
    checkDailyReward() {
        console.log('Kontroluji denní odměnu...');

        // Kontrola, zda je uživatel přihlášen
        if (!this.state.isLoggedIn) {
            return;
        }

        // Kontrola, zda již byla odměna vyzvednuta
        const today = new Date().toISOString().split('T')[0];
        const lastClaimed = localStorage.getItem('aiMapaDailyRewardClaimed');

        if (lastClaimed !== today) {
            // Zobrazení odměny po krátké prodlevě
            setTimeout(() => {
                this.showDailyReward();
            }, 1500);
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda je Auth0Auth modul načten
    if (typeof Auth0Auth !== 'undefined') {
        LogoutButton.init();

        // Přidání posluchače události pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            if (event.detail.isLoggedIn) {
                // Kontrola denní odměny po přihlášení
                setTimeout(() => {
                    LogoutButton.checkDailyReward();
                }, 1000);
            }
        });
    } else {
        // Pokud není Auth0Auth modul načten, počkáme na jeho inicializaci
        document.addEventListener('auth0Initialized', () => {
            LogoutButton.init();

            // Přidání posluchače události pro změnu stavu přihlášení
            document.addEventListener('authStateChanged', (event) => {
                if (event.detail.isLoggedIn) {
                    // Kontrola denní odměny po přihlášení
                    setTimeout(() => {
                        LogoutButton.checkDailyReward();
                    }, 1000);
                }
            });
        });
    }

    // Kontrola, zda jsme se právě přihlásili
    const isLoggedIn = localStorage.getItem('aiMapaLoggedIn') === 'true';
    const justLoggedIn = sessionStorage.getItem('aiMapaJustLoggedIn') === 'true';

    if (isLoggedIn && justLoggedIn) {
        // Odstranění příznaku
        sessionStorage.removeItem('aiMapaJustLoggedIn');

        // Kontrola denní odměny
        setTimeout(() => {
            LogoutButton.checkDailyReward();
        }, 1000);
    }
});
