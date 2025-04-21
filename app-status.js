/**
 * Stavový systém pro AIMapa verze 0.2.9.1
 * Zobrazuje informace o stavu aplikace, aktualizacích a novinkách
 */

// Objekt pro správu stavu aplikace
const AppStatus = {
    // Aktuální verze aplikace
    version: '0.2.9.1',

    // Datum poslední aktualizace
    lastUpdate: '2025-05-10',

    // Seznam novinek v aktuální verzi
    newFeatures: [
        {
            title: 'Uživatelské profily',
            description: 'Přidán systém uživatelských účtů a profilů',
            icon: '👤'
        },
        {
            title: 'Achievementy a odměny',
            description: 'Implementován systém achievementů a odměn za používání aplikace',
            icon: '🏆'
        },
        {
            title: 'Schůzky a nákupní seznamy',
            description: 'Přidány nové užitečné funkce pro plánování schůzek a vytváření nákupních seznamů',
            icon: '📅'
        },
        {
            title: 'Vylepšený chat',
            description: 'Vylepšené návrhy v chatu s ikonami a novými funkcemi',
            icon: '💬'
        },
        {
            title: 'Vizuální efekty',
            description: 'Přidány vizuální efekty pro fullscreen režim (padající hvězdy)',
            icon: '✨'
        }
    ],

    // Seznam známých problémů
    knownIssues: [
        {
            title: 'Inicializace glóbus režimu',
            description: 'Občasné problémy s inicializací glóbus režimu na některých zařízeních',
            severity: 'medium'
        },
        {
            title: 'Kompatibilita s Safari',
            description: 'Některé vizuální efekty nemusí správně fungovat v prohlížeči Safari',
            severity: 'low'
        }
    ],

    // Inicializace stavového systému
    init() {
        this.createStatusIcon();
        this.setupEventListeners();
        this.checkForFirstRun();
    },

    // Vytvoření stavové ikony
    createStatusIcon() {
        // Kontrola, zda ikona již neexistuje
        if (document.getElementById('appStatusIcon')) {
            return;
        }

        // Vytvoření ikony
        const statusIcon = document.createElement('div');
        statusIcon.id = 'appStatusIcon';
        statusIcon.className = 'app-status-icon';
        statusIcon.innerHTML = `
            <div class="status-icon-inner">
                <span class="status-version">${this.version}</span>
                <i class="status-indicator"></i>
            </div>
        `;

        // Přidání ikony do dokumentu
        document.body.appendChild(statusIcon);

        // Nastavení barvy indikátoru podle stavu aplikace
        const indicator = statusIcon.querySelector('.status-indicator');

        if (this.knownIssues.some(issue => issue.severity === 'high')) {
            indicator.classList.add('status-critical');
        } else if (this.knownIssues.some(issue => issue.severity === 'medium')) {
            indicator.classList.add('status-warning');
        } else {
            indicator.classList.add('status-ok');
        }

        console.log('Stavová ikona byla vytvořena');
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Přidání posluchače pro kliknutí na ikonu
        const statusIcon = document.getElementById('appStatusIcon');
        if (statusIcon) {
            statusIcon.addEventListener('click', () => {
                this.showStatusDialog();
            });
        }
    },

    // Kontrola, zda je aplikace spuštěna poprvé po aktualizaci
    checkForFirstRun() {
        // Získání poslední zobrazené verze z localStorage
        const lastShownVersion = localStorage.getItem('lastShownVersion');

        // Pokud je aktuální verze novější než poslední zobrazená, zobrazíme dialog s novinkami
        if (!lastShownVersion || lastShownVersion !== this.version) {
            // Zobrazení dialogu s novinkami po krátké prodlevě
            setTimeout(() => {
                this.showWhatsNewDialog();

                // Uložení aktuální verze do localStorage
                localStorage.setItem('lastShownVersion', this.version);
            }, 2000);
        }
    },

    // Zobrazení dialogu se stavem aplikace
    showStatusDialog() {
        // Kontrola, zda dialog již neexistuje
        if (document.querySelector('.status-dialog')) {
            return;
        }

        // Vytvoření elementu pro dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog status-dialog';

        // Vytvoření HTML pro známé problémy
        let issuesHtml = '';
        if (this.knownIssues.length === 0) {
            issuesHtml = '<p class="text-center">Nejsou známy žádné problémy.</p>';
        } else {
            issuesHtml = this.knownIssues.map(issue => `
                <div class="issue-item severity-${issue.severity}">
                    <div class="issue-title">${issue.title}</div>
                    <div class="issue-description">${issue.description}</div>
                </div>
            `).join('');
        }

        console.log('Zobrazení dialogu se stavem aplikace');

        // Vytvoření HTML pro novinky
        const featuresHtml = this.newFeatures.map(feature => `
            <div class="feature-item">
                <div class="feature-icon">${feature.icon}</div>
                <div class="feature-details">
                    <div class="feature-title">${feature.title}</div>
                    <div class="feature-description">${feature.description}</div>
                </div>
            </div>
        `).join('');

        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Stav aplikace</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="app-info">
                        <div class="app-version">Verze: ${this.version}</div>
                        <div class="app-update">Poslední aktualizace: ${this.lastUpdate}</div>
                    </div>

                    <div class="status-section">
                        <h4>Novinky v této verzi</h4>
                        <div class="features-container">
                            ${featuresHtml}
                        </div>
                    </div>

                    <div class="status-section">
                        <h4>Známé problémy</h4>
                        <div class="issues-container">
                            ${issuesHtml}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="showWhatsNew" class="btn btn-outline">Zobrazit novinky</button>
                    <button id="closeStatusDialog" class="btn btn-primary">Zavřít</button>
                </div>
            </div>
        `;

        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);

        // Nastavení posluchačů událostí
        const closeButton = dialog.querySelector('.close-button');
        const closeDialogButton = dialog.querySelector('#closeStatusDialog');
        const showWhatsNewButton = dialog.querySelector('#showWhatsNew');

        closeButton.addEventListener('click', () => {
            dialog.remove();
        });

        closeDialogButton.addEventListener('click', () => {
            dialog.remove();
        });

        showWhatsNewButton.addEventListener('click', () => {
            dialog.remove();
            this.showWhatsNewDialog();
        });
    },

    // Zobrazení dialogu s novinkami
    showWhatsNewDialog() {
        // Kontrola, zda dialog již neexistuje
        if (document.querySelector('.whats-new-dialog')) {
            return;
        }

        // Vytvoření elementu pro dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog whats-new-dialog';

        // Vytvoření HTML pro novinky
        const featuresHtml = this.newFeatures.map(feature => `
            <div class="feature-item animate-slideInUp">
                <div class="feature-icon">${feature.icon}</div>
                <div class="feature-details">
                    <div class="feature-title">${feature.title}</div>
                    <div class="feature-description">${feature.description}</div>
                </div>
            </div>
        `).join('');

        console.log('Zobrazení dialogu s novinkami');

        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Novinky ve verzi ${this.version}</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="welcome-message">
                        <p>Vítejte v nové verzi aplikace AIMapa! Přidali jsme několik nových funkcí a vylepšení, které vám pomohou lépe plánovat vaše aktivity.</p>
                    </div>

                    <div class="features-container">
                        ${featuresHtml}
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="closeWhatsNewDialog" class="btn btn-primary">Rozumím</button>
                </div>
            </div>
        `;

        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);

        // Nastavení posluchačů událostí
        const closeButton = dialog.querySelector('.close-button');
        const closeDialogButton = dialog.querySelector('#closeWhatsNewDialog');

        closeButton.addEventListener('click', () => {
            dialog.remove();
        });

        closeDialogButton.addEventListener('click', () => {
            dialog.remove();
        });

        // Postupné zobrazení jednotlivých novinek s animací
        const featureItems = dialog.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });
    }
};

// Inicializace stavového systému po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    AppStatus.init();
});

// Přidání objektu do globálního kontextu
window.AppStatus = AppStatus;
