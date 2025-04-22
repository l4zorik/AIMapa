/**
 * Modul pro zobrazení novinek a aktualizací v pravém horním rohu
 * Verze 0.2.8.6.3
 */

const UpdatesNotification = {
    // Aktuální verze aplikace
    currentVersion: '0.2.8.6.3',

    // Informace o aktualizacích
    updates: [
        {
            version: '0.2.8.6.3',
            date: '2024-04-23',
            title: 'Nové funkce pro mapu a chat',
            description: 'Přidáno 7 nových užitečných funkcí pro mapu',
            changes: [
                'Přidán noční režim mapy s tmavým pozadím a zvýrazněnými cestami',
                'Implementována vrstva s počasím na mapě a widget s aktuálními informacemi',
                'Přidána funkce pro zobrazení zajímavých míst v okolí',
                'Implementován nástroj pro měření vzdálenosti mezi body na mapě',
                'Přidána funkce pro sdílení aktuální polohy nebo trasy přes URL a QR kód'
            ]
        },
        {
            version: '0.2.8.6.1',
            date: '2024-04-22',
            title: 'Vylepšení menu příkazů',
            description: 'Vylepšení zobrazení menu příkazů a přidání premium nabídky',
            changes: [
                'Vylepšeno zobrazení menu příkazů - nyní se zobrazuje uprostřed obrazovky',
                'Přidány animace pro plynulé zobrazení a skrytí menu',
                'Přidána nová položka "Premium verze" do menu příkazů',
                'Implementován modal s nabídkou premium funkcí',
                'Zajištěno správné fungování ve fullscreen režimu'
            ]
        },
        {
            version: '0.2.8.6',
            date: '2024-04-21',
            title: 'Menu příkazů vedle chatu',
            description: 'Přidáno menu příkazů a informace o novinkách',
            changes: [
                'Implementováno nové menu příkazů vedle chatu',
                'Přidáno tlačítko pro zobrazení/skrytí menu příkazů',
                'Přidána ikona v pravém horním rohu pro zobrazení informací o aktualizacích',
                'Vytvořen systém pro správu a zobrazení oznámení o aktualizacích',
                'Optimalizováno zobrazení ve fullscreen režimu'
            ]
        },
        {
            version: '0.2.8.5',
            date: '2024-04-20',
            title: 'Oprava inicializace aplikace',
            description: 'Opravy chyb a stabilizace aplikace',
            changes: [
                'Opraven problém s inicializací aplikace',
                'Implementován robustní systém pro zajištění správného pořadí inicializace',
                'Optimalizována práce s DOM elementy pro lepší výkon',
                'Vylepšena správa event listenerů pro prevenci memory leaks',
                'Vylepšena kompatibilita s různými prohlížeči a zařízeními'
            ]
        },
        {
            version: '0.2.8.4',
            date: '2024-04-20',
            title: 'Optimalizace výpočtu tras a vylepšení systému příkazů',
            description: 'Pokročilé algoritmy pro výpočet tras a inteligentní systém příkazů',
            changes: [
                'Implementace algoritmu Contraction Hierarchies pro rychlejší výpočet tras',
                'Podpora více typů dopravy s optimalizací pro každý typ',
                'Vyhledávání alternativních tras s různými parametry',
                'Implementace pokročilého NLP pro lepší porozumění přirozenému jazyku',
                'Kategorizované menu příkazů s možností rychlého přístupu'
            ]
        },
        {
            version: '0.2.7.4',
            date: '2024-04-20',
            title: 'Vylepšení AI chatu s návrhy dalších akcí',
            description: 'Přidány návrhy dalších akcí v chatovacím rozhraní',
            changes: [
                'Implementovány klikatelné návrhy akcí pod každou zprávou AI asistenta',
                'Návrhy akcí se dynamicky mění podle kontextu konverzace',
                'Vylepšen design chatovacího rozhraní pro lepší přehlednost',
                'Optimalizováno zobrazení návrhů akcí v plovoucím chatu ve fullscreen režimu',
                'Vylepšena uvítací zpráva s návrhy nejpoužívanějších akcí'
            ]
        },
        {
            version: '0.2.7.0',
            date: '2024-04-20',
            title: 'Vylepšení glóbus režimu',
            description: 'Přidáno tlačítko pro návrat z glóbus režimu',
            changes: [
                'Přidáno tlačítko pro návrat z glóbus režimu zpět na 2D mapu',
                'Vylepšeny CSS styly pro tlačítka glóbus režimu',
                'Optimalizováno přepínání mezi glóbus režimem a 2D mapou',
                'Zobrazení trasy z klasické mapy na glóbusu',
                'Optimalizace dlouhých tras na glóbusu'
            ]
        },
        {
            version: '0.2.5.0',
            date: '2024-04-21',
            title: 'Zjednodušený glóbus režim',
            description: 'Experimentální implementace glóbus režimu',
            changes: [
                'Implementace interaktivního 3D glóbusu s využitím knihovny Three.js',
                'Vytvoření základního rozhraní pro 3D glóbus',
                'Implementace základních funkcí pro rotaci a animaci glóbusu',
                'Přidání hvězdného pozadí pro lepší vizualizaci',
                'Integrace knihovny Globe.gl pro lepší zobrazení'
            ]
        },
        {
            version: '0.1.0',
            date: '2024-04-18',
            title: 'Omezení zoomu mapy a fullscreen režim',
            description: 'Vylepšení zobrazení mapy a implementace fullscreen režimu',
            changes: [
                'Implementováno omezení zoomu mapy pro zabránění příliš velkému oddálení',
                'Nastavení hranic mapy pro konzistentní uživatelský zážitek',
                'Přidán plovoucí chat do fullscreen režimu',
                'Přidáno tlačítko pro rychlý návrat z fullscreen režimu',
                'Optimalizace ovládacích prvků v režimu celé obrazovky'
            ]
        },
        {
            version: '0.0.9',
            date: '2024-04-18',
            title: 'Nový design bodů na mapě',
            description: 'Zcela přepracovaný design bodů na mapě',
            changes: [
                'Nový design bodů na mapě s čísly a barevným rozlišením',
                'Pokročilé vizualizace bodů s 3D efekty, stíny a gradientovým pozadím',
                'Animace vznesení (floating) pro všechny body na mapě',
                'Nová sekce v nastavení pro výběr stylu bodů na mapě',
                '5 různých stylů bodů: kruh, čtverec, diamant, pin a hvězda'
            ]
        },
        {
            version: '0.0.1',
            date: '2024-04-18',
            title: 'První verze aplikace',
            description: 'Základní funkce pro práci s mapou a body',
            changes: [
                'Základní mapové rozhraní s využitím Leaflet.js',
                'Možnost přidávat body na mapu kliknutím',
                'Automatické propojení bodů s výpočtem vzdálenosti a času cesty',
                'Chatovací rozhraní pro interakci s mapou',
                'Příkazy v chatu pro navigaci na body'
            ]
        }
    ],

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu novinek...');

        // Vytvoření ikony novinek
        this.createUpdatesIcon();

        // Kontrola, zda je potřeba zobrazit informace o aktualizaci
        this.checkForUpdateNotification();

        console.log('Modul novinek byl inicializován');
    },

    // Vytvoření ikony novinek
    createUpdatesIcon() {
        // Kontrola, zda již ikona neexistuje
        if (document.getElementById('updatesIcon')) {
            return;
        }

        // Vytvoření ikony
        const updatesIcon = document.createElement('div');
        updatesIcon.id = 'updatesIcon';
        updatesIcon.className = 'updates-icon';
        updatesIcon.innerHTML = '<i class="icon">🔔</i>';
        updatesIcon.title = `AIMapa v${this.currentVersion}`;

        // Přidání ikony do dokumentu
        document.body.appendChild(updatesIcon);

        // Přidání event listeneru
        updatesIcon.addEventListener('click', () => {
            this.showUpdatesModal();
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
                    <i class="icon">🚀</i> Nová verze ${currentVersionInfo.version}
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
                this.showUpdatesModal();

                // Zavření oznámení
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
        }
    },

    // Zobrazení modalu s aktualizacemi
    showUpdatesModal() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('updatesModal')) {
            return;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'updatesModal';
        modal.className = 'updates-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="updates-modal-content">
                <div class="updates-modal-header">
                    <h2>Novinky a aktualizace</h2>
                    <button class="updates-modal-close">&times;</button>
                </div>
                <div class="updates-modal-body">
                    <div class="updates-info">
                        <div class="updates-version">
                            <strong>Aktuální verze:</strong> ${this.currentVersion}
                        </div>
                    </div>

                    <div class="updates-list">
                        <h3>Historie aktualizací</h3>
                        <div class="updates-items">
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
        const closeButton = modal.querySelector('.updates-modal-close');

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

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    UpdatesNotification.init();
});
