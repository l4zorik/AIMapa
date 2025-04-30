/**
 * Modul pro denní odměny v AIMapa
 * Verze 0.3.8.6
 */

const DailyReward = {
    // Stav modulu
    state: {
        initialized: false,
        rewardShown: false
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu DailyReward...');

        // Kontrola, zda již byl modul inicializován
        if (this.state.initialized) {
            return this;
        }

        // Přidání posluchače události pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            console.log('DailyReward: Změna stavu přihlášení:', event.detail.isLoggedIn);
            if (event.detail.isLoggedIn) {
                // Kontrola denní odměny po přihlášení
                setTimeout(() => {
                    this.checkDailyReward();
                }, 1500);
            }
        });

        // Kontrola, zda jsme se právě přihlásili
        const justLoggedIn = sessionStorage.getItem('aiMapaJustLoggedIn') === 'true';
        if (justLoggedIn) {
            console.log('DailyReward: Uživatel se právě přihlásil');
            // Odstranění příznaku
            sessionStorage.removeItem('aiMapaJustLoggedIn');
            // Kontrola denní odměny
            setTimeout(() => {
                this.checkDailyReward();
            }, 1500);
        }

        // Aktualizace stavu
        this.state.initialized = true;

        return this;
    },

    // Kontrola, zda má být zobrazena denní odměna
    checkDailyReward() {
        console.log('DailyReward: Kontroluji denní odměnu...');

        // Kontrola, zda je uživatel přihlášen
        const isLoggedIn = localStorage.getItem('aiMapaLoggedIn') === 'true';
        if (!isLoggedIn) {
            console.log('DailyReward: Uživatel není přihlášen, odměna nebude zobrazena');
            return;
        }

        // Kontrola, zda již byla odměna vyzvednuta
        const today = new Date().toISOString().split('T')[0];
        const lastClaimed = localStorage.getItem('aiMapaDailyRewardClaimed');

        if (lastClaimed === today) {
            console.log('DailyReward: Odměna již byla dnes vyzvednuta');
            return;
        }

        // Kontrola, zda již byla odměna zobrazena
        if (this.state.rewardShown) {
            console.log('DailyReward: Odměna již byla zobrazena');
            return;
        }

        // Zobrazení odměny
        this.showDailyReward();
    },

    // Zobrazení denní odměny
    showDailyReward() {
        console.log('DailyReward: Zobrazuji denní odměnu...');

        // Aktualizace stavu
        this.state.rewardShown = true;

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

        // Automatické odstranění notifikace po 30 sekundách
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slide-out-right 0.5s ease-in forwards';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 30000);
    }
};

// Přidání animace pro odchod notifikace
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-out-right {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    // Inicializace modulu
    DailyReward.init();
});
