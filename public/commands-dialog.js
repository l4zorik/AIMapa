/**
 * Dialog dostupných příkazů pro AIMapa verze 0.2.9.2
 * Tento soubor poskytuje přehled dostupných příkazů a nápovědu
 */

// Objekt pro správu dialogu příkazů
const CommandsDialog = {
    // Seznam dostupných příkazů
    commands: [
        {
            name: 'Přidat bod',
            description: 'Přidá nový bod na mapu',
            icon: 'fa-map-pin',
            examples: ['Přidej bod', 'Nový bod', 'Přidat místo']
        },
        {
            name: 'Vypočítat trasu',
            description: 'Vypočítá trasu mezi body na mapě',
            icon: 'fa-route',
            examples: ['Vypočítej trasu', 'Najdi cestu', 'Plánovat trasu']
        },
        {
            name: 'Vymazat mapu',
            description: 'Odebere všechny body a trasy z mapy',
            icon: 'fa-trash',
            examples: ['Vymaž mapu', 'Smaž vše', 'Vyčisti mapu']
        },
        {
            name: 'Fullscreen režim',
            description: 'Přepne aplikaci do režimu celé obrazovky',
            icon: 'fa-expand',
            examples: ['Celá obrazovka', 'Fullscreen', 'Maximální zobrazení']
        },
        {
            name: 'Glóbus režim',
            description: 'Přepne mapu do 3D glóbusu',
            icon: 'fa-globe',
            examples: ['Glóbus', '3D mapa', 'Zobrazit glóbus']
        },
        {
            name: 'Nastavení',
            description: 'Otevře dialog nastavení aplikace',
            icon: 'fa-cog',
            examples: ['Nastavení', 'Konfigurace', 'Možnosti']
        },
        {
            name: 'Nápověda',
            description: 'Zobrazí nápovědu k používání aplikace',
            icon: 'fa-question-circle',
            examples: ['Nápověda', 'Pomoc', 'Jak používat']
        }
    ],

    // Inicializace dialogu příkazů
    init() {
        console.log('Inicializace dialogu příkazů...');

        // Přidání tlačítka pro zobrazení nápovědy
        this.createHelpButton();

        console.log('Dialog příkazů byl inicializován');
    },

    // Vytvoření tlačítka pro zobrazení nápovědy
    createHelpButton() {
        // Kontrola, zda již tlačítko neexistuje
        if (document.getElementById('helpButton')) {
            return;
        }

        // Vytvoření tlačítka
        const helpButton = document.createElement('button');
        helpButton.id = 'helpButton';
        helpButton.className = 'help-button';
        helpButton.innerHTML = '<i class="fas fa-question-circle"></i>';
        helpButton.title = 'Nápověda';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(helpButton);

        // Přidání event listeneru
        helpButton.addEventListener('click', () => {
            this.showCommandsDialog();
        });
    },

    // Zobrazení dialogu příkazů
    showCommandsDialog() {
        // Kontrola, zda již dialog neexistuje
        if (document.getElementById('commandsDialog')) {
            return;
        }

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.id = 'commandsDialog';
        dialog.className = 'commands-dialog';

        // Vytvoření obsahu dialogu
        dialog.innerHTML = `
            <div class="commands-dialog-content">
                <div class="commands-dialog-header">
                    <h2>Dostupné příkazy</h2>
                    <button class="commands-dialog-close">&times;</button>
                </div>
                <div class="commands-dialog-body">
                    <p class="commands-dialog-intro">Zde je seznam dostupných příkazů, které můžete použít v aplikaci:</p>
                    <div class="commands-list">
                        ${this.commands.map(command => `
                            <div class="command-item">
                                <div class="command-icon">
                                    <i class="fas ${command.icon}"></i>
                                </div>
                                <div class="command-info">
                                    <div class="command-name">${command.name}</div>
                                    <div class="command-description">${command.description}</div>
                                    <div class="command-examples">
                                        <span>Příklady:</span> ${command.examples.join(', ')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="commands-dialog-footer">
                    <p>Pro použití příkazu jej napište do chatu nebo klikněte na odpovídající tlačítko v aplikaci.</p>
                </div>
            </div>
        `;

        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);

        // Animace zobrazení
        setTimeout(() => {
            dialog.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = dialog.querySelector('.commands-dialog-close');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
        }

        // Zavření dialogu při kliknutí mimo obsah
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            }
        });
    },

    // Zpracování příkazu z chatu
    processCommand(text) {
        // Kontrola, zda text obsahuje nějaký příkaz
        for (const command of this.commands) {
            for (const example of command.examples) {
                if (text.toLowerCase().includes(example.toLowerCase())) {
                    // Nalezen příkaz, provedeme odpovídající akci
                    this.executeCommand(command.name);
                    return true;
                }
            }
        }

        // Žádný příkaz nebyl nalezen
        return false;
    },

    // Provedení příkazu
    executeCommand(commandName) {
        switch (commandName) {
            case 'Přidat bod':
                if (typeof showAddActivityDialog === 'function') {
                    showAddActivityDialog();
                }
                break;

            case 'Vypočítat trasu':
                if (typeof calculateRoute === 'function') {
                    calculateRoute();
                }
                break;

            case 'Vymazat mapu':
                if (typeof clearMap === 'function') {
                    clearMap();
                }
                break;

            case 'Fullscreen režim':
                if (typeof toggleFullscreen === 'function') {
                    toggleFullscreen();
                }
                break;

            case 'Glóbus režim':
                if (typeof toggleGlobeMode === 'function') {
                    toggleGlobeMode();
                }
                break;

            case 'Nastavení':
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal) {
                    settingsModal.style.display = 'block';
                }
                break;

            case 'Nápověda':
                this.showCommandsDialog();
                break;

            default:
                console.log('Neznámý příkaz:', commandName);
                break;
        }
    }
};

// Export objektu pro použití v jiných souborech
window.CommandsDialog = CommandsDialog;

// Inicializace dialogu příkazů po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CommandsDialog.init();
});