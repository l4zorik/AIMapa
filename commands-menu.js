/**
 * Modul pro menu příkazů vedle chatu
 * Verze 0.2.8.6
 */

const CommandsMenu = {
    // Seznam dostupných příkazů
    commands: [
        {
            id: 'add-point',
            name: 'Přidat bod',
            description: 'Přidá nový bod na mapu',
            icon: '📍',
            examples: ['Přidej bod', 'Nový bod', 'Přidat místo']
        },
        {
            id: 'calculate-route',
            name: 'Vypočítat trasu',
            description: 'Vypočítá trasu mezi body na mapě',
            icon: '🗺️',
            examples: ['Vypočítej trasu', 'Najdi cestu', 'Plánovat trasu']
        },
        {
            id: 'clear-map',
            name: 'Vymazat mapu',
            description: 'Odebere všechny body a trasy z mapy',
            icon: '🗑️',
            examples: ['Vymaž mapu', 'Smaž vše', 'Vyčisti mapu']
        },
        {
            id: 'fullscreen',
            name: 'Fullscreen režim',
            description: 'Přepne aplikaci do režimu celé obrazovky',
            icon: '⛶',
            examples: ['Celá obrazovka', 'Fullscreen', 'Maximální zobrazení']
        },
        {
            id: 'globe-mode',
            name: 'Glóbus režim',
            description: 'Přepne mapu do 3D glóbusu',
            icon: '🌎',
            examples: ['Glóbus', '3D mapa', 'Zobrazit glóbus']
        },
        {
            id: 'settings',
            name: 'Nastavení',
            description: 'Otevře dialog nastavení aplikace',
            icon: '⚙️',
            examples: ['Nastavení', 'Konfigurace', 'Možnosti']
        },
        {
            id: 'help',
            name: 'Nápověda',
            description: 'Zobrazí nápovědu k používání aplikace',
            icon: '❓',
            examples: ['Nápověda', 'Pomoc', 'Jak používat']
        }
    ],
    
    // Inicializace menu příkazů
    init() {
        console.log('Inicializace menu příkazů...');
        
        // Přidání tlačítka pro zobrazení menu příkazů
        this.createCommandsButton();
        
        // Přidání menu příkazů vedle chatu
        this.createCommandsMenu();
        
        // Nastavení event listenerů
        this.setupEventListeners();
        
        console.log('Menu příkazů bylo inicializováno');
    },
    
    // Vytvoření tlačítka pro zobrazení menu příkazů
    createCommandsButton() {
        // Kontrola, zda již tlačítko neexistuje
        if (document.getElementById('commandsButton')) {
            return;
        }
        
        // Vytvoření tlačítka
        const commandsButton = document.createElement('button');
        commandsButton.id = 'commandsButton';
        commandsButton.className = 'commands-button';
        commandsButton.innerHTML = '<i class="icon">📋</i>';
        commandsButton.title = 'Menu příkazů';
        
        // Přidání tlačítka do chatu
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            chatInput.appendChild(commandsButton);
        }
    },
    
    // Vytvoření menu příkazů vedle chatu
    createCommandsMenu() {
        // Kontrola, zda již menu neexistuje
        if (document.getElementById('commandsMenu')) {
            return;
        }
        
        // Vytvoření menu
        const commandsMenu = document.createElement('div');
        commandsMenu.id = 'commandsMenu';
        commandsMenu.className = 'commands-menu';
        
        // Vytvoření obsahu menu
        commandsMenu.innerHTML = `
            <div class="commands-menu-header">
                <h3>Dostupné příkazy</h3>
                <button class="commands-menu-close">&times;</button>
            </div>
            <div class="commands-menu-body">
                <div class="commands-list">
                    ${this.commands.map(command => `
                        <div class="command-item" data-command-id="${command.id}">
                            <div class="command-icon">${command.icon}</div>
                            <div class="command-info">
                                <div class="command-name">${command.name}</div>
                                <div class="command-description">${command.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Přidání menu do dokumentu
        const aiAssistant = document.querySelector('.ai-assistant');
        if (aiAssistant) {
            aiAssistant.appendChild(commandsMenu);
        }
        
        // Skrytí menu na začátku
        commandsMenu.style.display = 'none';
    },
    
    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro tlačítko menu příkazů
        const commandsButton = document.getElementById('commandsButton');
        if (commandsButton) {
            commandsButton.addEventListener('click', () => {
                this.toggleCommandsMenu();
            });
        }
        
        // Event listener pro zavření menu
        const closeButton = document.querySelector('.commands-menu-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideCommandsMenu();
            });
        }
        
        // Event listener pro položky menu
        const commandItems = document.querySelectorAll('.command-item');
        commandItems.forEach(item => {
            item.addEventListener('click', () => {
                const commandId = item.getAttribute('data-command-id');
                this.executeCommand(commandId);
                this.hideCommandsMenu();
            });
        });
        
        // Event listener pro fullscreen režim
        document.addEventListener('fullscreenChange', () => {
            // Aktualizace menu příkazů ve fullscreen režimu
            this.updateFullscreenMenu();
        });
    },
    
    // Zobrazení/skrytí menu příkazů
    toggleCommandsMenu() {
        const commandsMenu = document.getElementById('commandsMenu');
        if (commandsMenu) {
            if (commandsMenu.style.display === 'none') {
                this.showCommandsMenu();
            } else {
                this.hideCommandsMenu();
            }
        }
    },
    
    // Zobrazení menu příkazů
    showCommandsMenu() {
        const commandsMenu = document.getElementById('commandsMenu');
        if (commandsMenu) {
            commandsMenu.style.display = 'block';
            
            // Animace zobrazení
            setTimeout(() => {
                commandsMenu.classList.add('show');
            }, 10);
        }
    },
    
    // Skrytí menu příkazů
    hideCommandsMenu() {
        const commandsMenu = document.getElementById('commandsMenu');
        if (commandsMenu) {
            commandsMenu.classList.remove('show');
            
            // Skrytí menu po dokončení animace
            setTimeout(() => {
                commandsMenu.style.display = 'none';
            }, 300);
        }
    },
    
    // Aktualizace menu příkazů ve fullscreen režimu
    updateFullscreenMenu() {
        const isFullscreen = document.fullscreenElement !== null;
        const commandsMenu = document.getElementById('commandsMenu');
        const commandsButton = document.getElementById('commandsButton');
        
        if (isFullscreen) {
            // Přesunout menu a tlačítko do fullscreen kontejneru
            const fullscreenChat = document.querySelector('.fullscreen-chat');
            if (fullscreenChat && commandsMenu && commandsButton) {
                fullscreenChat.appendChild(commandsMenu);
                fullscreenChat.querySelector('.chat-input').appendChild(commandsButton);
            }
        } else {
            // Vrátit menu a tlačítko zpět do normálního chatu
            const aiAssistant = document.querySelector('.ai-assistant');
            const chatInput = document.querySelector('.ai-assistant .chat-input');
            if (aiAssistant && chatInput && commandsMenu && commandsButton) {
                aiAssistant.appendChild(commandsMenu);
                chatInput.appendChild(commandsButton);
            }
        }
    },
    
    // Provedení příkazu
    executeCommand(commandId) {
        switch (commandId) {
            case 'add-point':
                if (typeof addActivity === 'function') {
                    addActivity();
                }
                break;
                
            case 'calculate-route':
                if (typeof calculateRoute === 'function') {
                    calculateRoute();
                }
                break;
                
            case 'clear-map':
                if (typeof clearMap === 'function') {
                    clearMap();
                }
                break;
                
            case 'fullscreen':
                if (typeof toggleFullscreen === 'function') {
                    toggleFullscreen();
                }
                break;
                
            case 'globe-mode':
                if (typeof toggleGlobeMode === 'function') {
                    toggleGlobeMode();
                }
                break;
                
            case 'settings':
                const settingsModal = document.getElementById('settingsModal');
                if (settingsModal) {
                    settingsModal.style.display = 'block';
                }
                break;
                
            case 'help':
                this.showHelpModal();
                break;
                
            default:
                console.log('Neznámý příkaz:', commandId);
                break;
        }
    },
    
    // Zobrazení modalu s nápovědou
    showHelpModal() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('helpModal')) {
            return;
        }
        
        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'helpModal';
        modal.className = 'help-modal';
        
        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <h2>Nápověda</h2>
                    <button class="help-modal-close">&times;</button>
                </div>
                <div class="help-modal-body">
                    <h3>Dostupné příkazy</h3>
                    <div class="help-commands-list">
                        ${this.commands.map(command => `
                            <div class="help-command-item">
                                <div class="help-command-header">
                                    <div class="help-command-icon">${command.icon}</div>
                                    <div class="help-command-name">${command.name}</div>
                                </div>
                                <div class="help-command-description">${command.description}</div>
                                <div class="help-command-examples">
                                    <strong>Příklady:</strong> ${command.examples.join(', ')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <h3>Jak používat aplikaci</h3>
                    <ol>
                        <li>Přidejte body na mapu pomocí tlačítka "Přidat aktivitu" nebo kliknutím na mapu.</li>
                        <li>Vypočítejte trasu mezi body pomocí tlačítka "Vypočítat trasu".</li>
                        <li>Použijte AI asistenta pro pomoc s plánováním trasy nebo pro získání informací.</li>
                        <li>Přepněte do režimu celé obrazovky pro lepší zobrazení mapy.</li>
                        <li>Vyzkoušejte glóbus režim pro 3D zobrazení světa.</li>
                    </ol>
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
        const closeButton = modal.querySelector('.help-modal-close');
        
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
    
    // Zpracování příkazu z chatu
    processCommand(text) {
        // Kontrola, zda text obsahuje nějaký příkaz
        for (const command of this.commands) {
            for (const example of command.examples) {
                if (text.toLowerCase().includes(example.toLowerCase())) {
                    // Nalezen příkaz, provedeme odpovídající akci
                    this.executeCommand(command.id);
                    return true;
                }
            }
        }
        
        // Žádný příkaz nebyl nalezen
        return false;
    }
};

// Inicializace menu příkazů po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CommandsMenu.init();
});
