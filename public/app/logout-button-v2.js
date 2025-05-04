/**
 * Vylepšený modul pro odhlašovací tlačítko v AIMapa
 * Verze 0.3.8.6
 */

const LogoutButtonV2 = {
    // Stav modulu
    state: {
        buttonAdded: false,
        isLoggedIn: false
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu LogoutButtonV2...');

        // Načtení CSS
        this.loadStyles();

        // Přidání tlačítka
        this.addLogoutButton();

        // Přidání posluchače události pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            console.log('LogoutButtonV2: Změna stavu přihlášení:', event.detail.isLoggedIn);
            this.state.isLoggedIn = event.detail.isLoggedIn;
            this.updateButtonVisibility();
        });

        // Kontrola aktuálního stavu přihlášení
        this.checkLoginState();

        return this;
    },

    // Načtení CSS stylů
    loadStyles() {
        // Přidání inline stylů pro lepší viditelnost
        const style = document.createElement('style');
        style.textContent = `
            .logout-button-v2 {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 140px;
                height: 44px;
                border-radius: 20px;
                background-color: #ff3b30;
                color: white;
                border: 3px solid rgba(255, 255, 255, 0.5);
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                transition: all 0.3s ease;
                font-size: 16px;
                font-weight: 800;
                letter-spacing: 0.5px;
                overflow: hidden;
                animation: pulse-red-v2 2s infinite;
            }

            .logout-button-v2 i {
                margin-right: 8px;
            }

            .logout-button-v2:hover {
                transform: scale(1.05);
                background-color: #c0392b;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
            }

            @keyframes pulse-red-v2 {
                0% {
                    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.8);
                    transform: scale(1);
                }
                50% {
                    box-shadow: 0 0 0 15px rgba(255, 59, 48, 0);
                }
                70% {
                    transform: scale(1.05);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
                    transform: scale(1);
                }
            }

            .logout-notification-v2 {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }

            .logout-notification-content-v2 {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .logout-spinner-v2 {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #e74c3c;
                border-radius: 50%;
                animation: spin-v2 1s linear infinite;
                margin-bottom: 20px;
            }

            @keyframes spin-v2 {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    },

    // Přidání odhlašovacího tlačítka
    addLogoutButton() {
        // Kontrola, zda již tlačítko existuje
        if (this.state.buttonAdded || document.getElementById('logoutButtonV2')) {
            return;
        }

        // Vytvoření tlačítka
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutButtonV2';
        logoutButton.className = 'logout-button-v2';
        logoutButton.title = 'Odhlásit se z aplikace';
        logoutButton.innerHTML = '<i class="fas fa-sign-out-alt"></i> ODHLÁSIT SE';

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
        const logoutButton = document.getElementById('logoutButtonV2');
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
        notification.className = 'logout-notification-v2';
        notification.innerHTML = `
            <div class="logout-notification-content-v2">
                <div class="logout-spinner-v2"></div>
                <p style="font-size: 18px; margin-bottom: 10px;">Probíhá odhlašování...</p>
                <p style="font-size: 14px; color: #666;">Budete přesměrováni na přihlašovací stránku</p>
            </div>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda je Auth0Auth modul načten
    if (typeof Auth0Auth !== 'undefined') {
        LogoutButtonV2.init();
    } else {
        // Pokud není Auth0Auth modul načten, počkáme na jeho inicializaci
        document.addEventListener('auth0Initialized', () => {
            LogoutButtonV2.init();
        });
    }

    // Kontrola, zda jsme se právě přihlásili
    const isLoggedIn = localStorage.getItem('aiMapaLoggedIn') === 'true';
    if (isLoggedIn) {
        // Inicializace tlačítka
        setTimeout(() => {
            LogoutButtonV2.init();
        }, 500);
    }
});
