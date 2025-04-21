/**
 * Modul pro zobrazení stavu aplikace a aktualizací pro AIMapa verze 0.2.9.1
 */

// Objekt pro správu stavu aplikace
const AppStatus = {
    // Aktuální verze aplikace
    currentVersion: '0.2.9.2',

    // Informace o aktualizacích
    updates: [
        {
            version: '0.2.9.1',
            date: '2024-04-21',
            title: 'Stabilizace a přechod na Node.js',
            description: 'Tato verze přináší stabilnější běh aplikace díky přechodu na Node.js platformu.',
            changes: [
                'Přechod na Node.js platformu',
                'Oprava inicializace mapy',
                'Vylepšení uživatelského rozhraní',
                'Odstranění nepotřebných souborů',
                'Lepší ošetření chyb'
            ]
        },
        {
            version: '0.2.9.0',
            date: '2024-04-18',
            title: 'Nové funkce a vylepšení',
            description: 'Tato verze přináší několik nových funkcí a vylepšení uživatelského rozhraní.',
            changes: [
                'Přidán glóbus režim pro 3D zobrazení světa',
                'Vylepšení chatu v režimu celé obrazovky',
                'Přidán systém uživatelských účtů',
                'Přidán systém achievementů a levelů',
                'Vylepšení výpočtu tras'
            ]
        },
        {
            version: '0.2.8.0',
            date: '2024-04-10',
            title: 'Základní funkce',
            description: 'První verze aplikace s základními funkcemi.',
            changes: [
                'Základní mapové funkce',
                'Přidávání bodů na mapu',
                'Výpočet trasy mezi body',
                'Základní chat s AI asistentem',
                'Režim celé obrazovky'
            ]
        }
    ],

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu stavu aplikace...');

        // Vytvoření ikony stavu aplikace
        this.createStatusIcon();

        // Kontrola, zda je potřeba zobrazit informace o aktualizaci
        this.checkForUpdateNotification();

        console.log('Modul stavu aplikace byl inicializován');
    },

    // Vytvoření ikony stavu aplikace
    createStatusIcon() {
        // Kontrola, zda již ikona neexistuje
        if (document.getElementById('appStatusIcon')) {
            return;
        }

        // Vytvoření ikony
        const statusIcon = document.createElement('div');
        statusIcon.id = 'appStatusIcon';
        statusIcon.className = 'app-status-icon';
        statusIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
        statusIcon.title = `AIMapa v${this.currentVersion}`;

        // Přidání ikony do dokumentu
        document.body.appendChild(statusIcon);

        // Přidání event listeneru
        statusIcon.addEventListener('click', () => {
            this.showStatusModal();
        });
    },

    // Kontrola, zda je potřeba zobrazit informace o aktualizaci
    checkForUpdateNotification() {
        // Získání poslední zobrazené verze z localStorage
        const lastShownVersion = localStorage.getItem('aiMapaLastShownVersion');

        // Pokud je aktuální verze novější než poslední zobrazená, zobrazíme informace o aktualizaci
        if (!lastShownVersion || this.compareVersions(this.currentVersion, lastShownVersion) > 0) {
            // Zobrazení informací o aktualizaci
            this.showUpdateNotification();

            // Uložení aktuální verze jako poslední zobrazené
            localStorage.setItem('aiMapaLastShownVersion', this.currentVersion);
        }
    },

    // Zobrazení informací o aktualizaci
    showUpdateNotification() {
        // Získání informací o aktuální verzi
        const currentVersionInfo = this.updates.find(update => update.version === this.currentVersion);

        if (!currentVersionInfo) {
            return;
        }

        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'update-notification';

        notification.innerHTML = `
            <div class="update-notification-header">
                <div class="update-notification-title">
                    <i class="fas fa-rocket"></i> Nová verze ${currentVersionInfo.version}
                </div>
                <button class="update-notification-close">&times;</button>
            </div>
            <div class="update-notification-content">
                <h3>${currentVersionInfo.title}</h3>
                <p>${currentVersionInfo.description}</p>
                <ul>
                    ${currentVersionInfo.changes.map(change => `<li>${change}</li>`).join('')}
                </ul>
                <button class="update-notification-details">Zobrazit všechny aktualizace</button>
            </div>
        `;

        // Přidání oznámení do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 1000);

        // Přidání event listenerů
        const closeButton = notification.querySelector('.update-notification-close');
        const detailsButton = notification.querySelector('.update-notification-details');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
        }

        if (detailsButton) {
            detailsButton.addEventListener('click', () => {
                // Zobrazení modalu se všemi aktualizacemi
                this.showStatusModal();

                // Zavření oznámení
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
        }
    },

    // Zobrazení modalu se stavem aplikace
    showStatusModal() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('appStatusModal')) {
            return;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'appStatusModal';
        modal.className = 'app-status-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="app-status-modal-content">
                <div class="app-status-modal-header">
                    <h2>Stav aplikace</h2>
                    <button class="app-status-modal-close">&times;</button>
                </div>
                <div class="app-status-modal-body">
                    <div class="app-status-info">
                        <div class="app-status-version">
                            <strong>Verze:</strong> ${this.currentVersion}
                        </div>
                        <div class="app-status-status">
                            <strong>Stav:</strong> <span class="status-online">Online</span>
                        </div>
                    </div>

                    <div class="app-status-updates">
                        <h3>Historie aktualizací</h3>
                        <div class="updates-list">
                            ${this.updates.map(update => `
                                <div class="update-item">
                                    <div class="update-header">
                                        <div class="update-version">v${update.version}</div>
                                        <div class="update-date">${update.date}</div>
                                    </div>
                                    <div class="update-title">${update.title}</div>
                                    <div class="update-description">${update.description}</div>
                                    <ul class="update-changes">
                                        ${update.changes.map(change => `<li>${change}</li>`).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Přidání modalu do dokumentu
        document.body.appendChild(modal);

        // Animace zobrazení
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.app-status-modal-close');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    },

    // Porovnání verzí
    compareVersions(version1, version2) {
        const parts1 = version1.split('.').map(Number);
        const parts2 = version2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;

            if (part1 > part2) {
                return 1;
            } else if (part1 < part2) {
                return -1;
            }
        }

        return 0;
    }
};

// Export objektu pro použití v jiných souborech
window.AppStatus = AppStatus;

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    AppStatus.init();
});