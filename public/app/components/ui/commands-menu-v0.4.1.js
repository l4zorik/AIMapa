/**
 * Menu příkazů pro AIMapa
 * Verze 0.4.1
 * 
 * Tento modul implementuje menu příkazů s designem z verze 0.3.1
 * a funkcionalitou z verze 0.4.1
 */

const CommandsMenu = {
    // Stav modulu
    isVisible: false,
    isEnabled: true,
    
    // Kategorie příkazů
    categories: [
        {
            id: 'map',
            name: 'Mapa',
            icon: '🗺️',
            isOpen: true,
            commands: [
                { id: 'search', name: 'Vyhledat místo', description: 'Vyhledá místo na mapě', icon: '🔍', command: 'vyhledat' },
                { id: 'route', name: 'Naplánovat trasu', description: 'Naplánuje trasu mezi dvěma body', icon: '🧭', command: 'trasa' },
                { id: 'clear', name: 'Vyčistit mapu', description: 'Odstraní všechny značky z mapy', icon: '🧹', command: 'vyčistit mapu' },
                { id: 'locate', name: 'Moje poloha', description: 'Zobrazí vaši aktuální polohu', icon: '📍', command: 'moje poloha' }
            ]
        },
        {
            id: 'tools',
            name: 'Nástroje',
            icon: '🛠️',
            isOpen: false,
            commands: [
                { id: 'weather', name: 'Počasí', description: 'Zobrazí předpověď počasí', icon: '🌤️', command: 'počasí' },
                { id: 'measure', name: 'Měření vzdálenosti', description: 'Změří vzdálenost mezi body', icon: '📏', command: 'měření' },
                { id: 'share', name: 'Sdílet mapu', description: 'Vytvoří odkaz pro sdílení aktuálního pohledu', icon: '📤', command: 'sdílet' },
                { id: 'print', name: 'Tisk mapy', description: 'Připraví mapu pro tisk', icon: '🖨️', command: 'tisk' }
            ]
        },
        {
            id: 'virtual',
            name: 'Virtuální práce',
            icon: '💼',
            isOpen: false,
            commands: [
                { id: 'virtual-work', name: 'Virtuální práce', description: 'Otevře dialog virtuální práce', icon: '💻', command: 'virtuální práce' },
                { id: 'track-points', name: 'Sledování bodů', description: 'Zobrazí body získané virtuální prací', icon: '📊', command: 'body' },
                { id: 'achievements', name: 'Úspěchy', description: 'Zobrazí získané úspěchy', icon: '🏆', command: 'úspěchy' }
            ]
        },
        {
            id: 'settings',
            name: 'Nastavení',
            icon: '⚙️',
            isOpen: false,
            commands: [
                { id: 'theme', name: 'Změnit téma', description: 'Přepne mezi světlým a tmavým tématem', icon: '🌓', command: 'téma' },
                { id: 'language', name: 'Jazyk', description: 'Změní jazyk aplikace', icon: '🌐', command: 'jazyk' },
                { id: 'account', name: 'Můj účet', description: 'Správa uživatelského účtu', icon: '👤', command: 'účet' },
                { id: 'refresh-menu', name: 'Obnovit menu', description: 'Obnoví menu příkazů', icon: '🔄', command: 'obnovit menu' }
            ]
        },
        {
            id: 'api',
            name: 'API Vyhledávání',
            icon: '🔌',
            isOpen: false,
            commands: [
                { id: 'api-search', name: 'API Vyhledávání', description: 'Vyhledávání pomocí API', icon: '🔍', command: 'api vyhledávání' },
                { id: 'api-settings', name: 'Nastavení API', description: 'Nastavení API klíčů a parametrů', icon: '🔑', command: 'api nastavení' },
                { id: 'api-history', name: 'Historie vyhledávání', description: 'Zobrazí historii vyhledávání', icon: '📜', command: 'api historie' }
            ]
        },
        {
            id: 'fun',
            name: 'Zábava',
            icon: '🎮',
            isOpen: false,
            commands: [
                { id: 'reward-system', name: 'Systém odměn', description: 'Otevře dialog odměňovacího systému', icon: '🐱', command: 'odměňovací systém' }
            ]
        }
    ],

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu menu příkazů v0.4.1...');

        // Načtení nastavení z localStorage
        this.loadSettings();

        // Vytvoření tlačítka pro menu příkazů
        this.createCommandButton();

        // Vytvoření menu příkazů
        this.createCommandsMenu();

        // Přidání event listenerů
        this.setupEventListeners();

        // Vytvoření a odeslání události o inicializaci menu příkazů
        const event = new CustomEvent('commandsMenuInitialized');
        document.dispatchEvent(event);

        console.log('Modul menu příkazů v0.4.1 byl inicializován');
    },

    // Načtení nastavení
    loadSettings() {
        try {
            // Načtení nastavení z localStorage
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            const settings = appState.settings || {};

            // Nastavení povolení menu příkazů
            this.isEnabled = settings.commandsMenuEnabled !== undefined ? settings.commandsMenuEnabled : true;

            console.log('Načteno nastavení menu příkazů:', this.isEnabled ? 'povoleno' : 'zakázáno');
        } catch (error) {
            console.error('Chyba při načítání nastavení menu příkazů:', error);
            this.isEnabled = true; // Výchozí hodnota
        }
    },

    // Vytvoření tlačítka pro menu příkazů
    createCommandButton() {
        // Kontrola, zda je menu povoleno
        if (!this.isEnabled) {
            console.log('Menu příkazů je zakázáno, tlačítko nebude vytvořeno');
            return;
        }

        // Vytvoření tlačítka
        const commandButton = document.createElement('button');
        commandButton.id = 'commandsButton';
        commandButton.className = 'commands-button';
        commandButton.title = 'Menu příkazů';
        commandButton.innerHTML = '<span class="icon">⌘</span>';

        // Přidání event listeneru
        commandButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCommandsMenu();
        });

        // Přidání tlačítka do chatu
        this.addButtonToChat(commandButton);
        this.addButtonToFloatingChat(commandButton.cloneNode(true));
    },

    // Přidání tlačítka do chatu
    addButtonToChat(button) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            const chatInputContainer = chatInput.parentElement;
            if (chatInputContainer) {
                button.id = 'commandsButton';
                chatInputContainer.insertBefore(button, chatInput);
            }
        }
    },

    // Přidání tlačítka do plovoucího chatu
    addButtonToFloatingChat(button) {
        const floatingChatInput = document.getElementById('floatingChatInput');
        if (floatingChatInput) {
            const floatingChatInputContainer = floatingChatInput.parentElement;
            if (floatingChatInputContainer) {
                button.id = 'floatingCommandsButton';
                floatingChatInputContainer.insertBefore(button, floatingChatInput);
            }
        }
    },

    // Vytvoření menu příkazů
    createCommandsMenu() {
        // Vytvoření překrytí
        const overlay = document.createElement('div');
        overlay.id = 'commandsOverlay';
        overlay.className = 'commands-overlay';
        document.body.appendChild(overlay);

        // Vytvoření menu
        const menu = document.createElement('div');
        menu.id = 'commandsMenu';
        menu.className = 'commands-menu';

        // Vytvoření hlavičky menu
        const header = document.createElement('div');
        header.className = 'commands-menu-header';
        header.innerHTML = `
            <div class="commands-menu-drag-handle">⋮⋮</div>
            <h3>Menu příkazů</h3>
            <button class="commands-menu-close">&times;</button>
        `;

        // Vytvoření vyhledávacího pole
        const search = document.createElement('div');
        search.className = 'commands-menu-search';
        search.innerHTML = `
            <input type="text" class="commands-search-input" placeholder="Hledat příkaz...">
        `;

        // Vytvoření těla menu s podporou scrollování
        const body = document.createElement('div');
        body.className = 'commands-menu-body';

        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'commands-menu-scroll-container';
        body.appendChild(scrollContainer);

        // Přidání kategorií a příkazů
        this.categories.forEach(category => {
            const categoryElement = this.createCategoryElement(category);
            scrollContainer.appendChild(categoryElement);
        });

        // Sestavení menu
        menu.appendChild(header);
        menu.appendChild(search);
        menu.appendChild(body);

        // Přidání menu do dokumentu
        document.body.appendChild(menu);

        // Přidání event listenerů
        this.addMenuEventListeners(menu, overlay);

        // Přidání podpory pro přesouvání menu
        this.makeDraggable(menu, header);

        // Přidání podpory pro vyhledávání
        this.setupSearch(menu);
    },

    // Vytvoření elementu kategorie
    createCategoryElement(category) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'commands-category';
        categoryElement.dataset.category = category.id;

        // Vytvoření hlavičky kategorie
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <span class="category-icon">${category.icon}</span>
            <span class="category-name">${category.name}</span>
            <span class="category-toggle">${category.isOpen ? '▼' : '▶'}</span>
        `;

        // Vytvoření těla kategorie
        const categoryBody = document.createElement('div');
        categoryBody.className = 'category-body';
        categoryBody.style.display = category.isOpen ? 'block' : 'none';

        // Přidání příkazů do kategorie
        category.commands.forEach(command => {
            const commandElement = this.createCommandElement(command);
            categoryBody.appendChild(commandElement);
        });

        // Přidání event listeneru pro rozbalení/sbalení kategorie
        categoryHeader.addEventListener('click', () => {
            const isOpen = categoryBody.style.display === 'block';
            categoryBody.style.display = isOpen ? 'none' : 'block';
            categoryHeader.querySelector('.category-toggle').textContent = isOpen ? '▶' : '▼';

            // Aktualizace stavu kategorie
            category.isOpen = !isOpen;
        });

        // Sestavení kategorie
        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(categoryBody);

        return categoryElement;
    },

    // Vytvoření elementu příkazu
    createCommandElement(command) {
        const commandElement = document.createElement('div');
        commandElement.className = 'command-item';
        commandElement.dataset.command = command.command;
        commandElement.innerHTML = `
            <span class="command-icon">${command.icon}</span>
            <div class="command-info">
                <div class="command-name">${command.name}</div>
                <div class="command-description">${command.description}</div>
            </div>
        `;

        // Event listener pro kliknutí na příkaz
        commandElement.addEventListener('click', () => {
            this.executeCommand(command.command);
        });

        return commandElement;
    },

    // Přidání event listenerů pro menu
    addMenuEventListeners(menu, overlay) {
        // Zavření menu po kliknutí na tlačítko zavřít
        const closeButton = menu.querySelector('.commands-menu-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.toggleCommandsMenu();
            });
        }

        // Zavření menu po kliknutí na překrytí
        overlay.addEventListener('click', () => {
            this.toggleCommandsMenu();
        });

        // Zavření menu po stisknutí klávesy Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.toggleCommandsMenu();
            }
        });
    },

    // Nastavení vyhledávání
    setupSearch(menu) {
        const searchInput = menu.querySelector('.commands-search-input');
        if (!searchInput) return;

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase().trim();
            this.filterCommands(query);
        });
    },

    // Filtrování příkazů podle vyhledávacího dotazu
    filterCommands(query) {
        const categories = document.querySelectorAll('.commands-category');
        
        categories.forEach(category => {
            const commands = category.querySelectorAll('.command-item');
            let hasVisibleCommands = false;

            commands.forEach(command => {
                const name = command.querySelector('.command-name').textContent.toLowerCase();
                const description = command.querySelector('.command-description').textContent.toLowerCase();
                const isMatch = name.includes(query) || description.includes(query);

                command.style.display = isMatch ? 'flex' : 'none';
                if (isMatch) hasVisibleCommands = true;
            });

            // Zobrazení/skrytí kategorie podle toho, zda obsahuje viditelné příkazy
            category.style.display = hasVisibleCommands ? 'block' : 'none';

            // Rozbalení kategorie, pokud obsahuje viditelné příkazy a je vyhledávání
            if (hasVisibleCommands && query) {
                const categoryBody = category.querySelector('.category-body');
                const categoryToggle = category.querySelector('.category-toggle');
                
                if (categoryBody) categoryBody.style.display = 'block';
                if (categoryToggle) categoryToggle.textContent = '▼';
            }
        });
    },

    // Přidání podpory pro přesouvání menu
    makeDraggable(element, handle) {
        let isDragging = false;
        let offsetX, offsetY;

        // Funkce pro zahájení přesouvání
        const startDrag = (e) => {
            // Zabránění výchozímu chování
            e.preventDefault();

            // Nastavení příznaku přesouvání
            isDragging = true;

            // Výpočet offsetu
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // Přidání třídy pro přesouvání
            element.classList.add('dragging');
        };

        // Funkce pro přesouvání
        const drag = (e) => {
            if (!isDragging) return;

            // Výpočet nové pozice
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // Nastavení nové pozice
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.transform = 'none';
        };

        // Funkce pro ukončení přesouvání
        const endDrag = () => {
            if (!isDragging) return;

            // Odstranění příznaku přesouvání
            isDragging = false;

            // Odstranění třídy pro přesouvání
            element.classList.remove('dragging');

            // Uložení pozice do localStorage
            const rect = element.getBoundingClientRect();
            const position = {
                left: rect.left,
                top: rect.top
            };

            try {
                const appState = JSON.parse(localStorage.getItem('appState')) || {};
                appState.commandsMenuPosition = position;
                localStorage.setItem('appState', JSON.stringify(appState));
            } catch (error) {
                console.error('Chyba při ukládání pozice menu příkazů:', error);
            }
        };

        // Přidání event listenerů
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        // Načtení uložené pozice
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            const position = appState.commandsMenuPosition;

            if (position) {
                // Odstranění transformace pro přesné pozicování
                element.style.transform = 'none';
                element.style.top = position.top + 'px';
                element.style.left = position.left + 'px';
            }
        } catch (error) {
            console.error('Chyba při načítání pozice menu příkazů:', error);
        }
    },

    // Zobrazení/skrytí menu příkazů
    toggleCommandsMenu() {
        // Kontrola, zda je menu povoleno
        if (!this.isEnabled) {
            console.log('Menu příkazů je zakázáno');
            return;
        }

        const overlay = document.getElementById('commandsOverlay');
        const menu = document.getElementById('commandsMenu');

        if (overlay && menu) {
            if (this.isVisible) {
                // Skrytí menu
                overlay.classList.remove('show');
                menu.classList.remove('show');
                menu.style.display = 'none';
            } else {
                // Zobrazení menu
                menu.style.display = 'flex';
                setTimeout(() => {
                    overlay.classList.add('show');
                    menu.classList.add('show');
                }, 10);

                // Zaměření vyhledávacího pole
                const searchInput = menu.querySelector('.commands-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            this.isVisible = !this.isVisible;
        }
    },

    // Nastavení povolení menu příkazů
    setEnabled(enabled) {
        this.isEnabled = enabled;

        // Odstranění nebo vytvoření tlačítka podle nastavení
        const commandButton = document.getElementById('commandsButton');
        const floatingCommandButton = document.getElementById('floatingCommandsButton');

        if (enabled) {
            // Pokud je menu povoleno a tlačítko neexistuje, vytvoříme ho
            if (!commandButton || !floatingCommandButton) {
                this.createCommandButton();
            }
        } else {
            // Pokud je menu zakázáno a tlačítko existuje, odstraníme ho
            if (commandButton) {
                commandButton.remove();
            }

            if (floatingCommandButton) {
                floatingCommandButton.remove();
            }

            // Skrytí menu, pokud je zobrazeno
            if (this.isVisible) {
                this.toggleCommandsMenu();
            }
        }
    },

    // Provedení příkazu
    executeCommand(command) {
        console.log(`Provádění příkazu: ${command}`);

        // Skrytí menu
        this.toggleCommandsMenu();

        // Zpracování příkazu
        switch (command) {
            case 'vyhledat':
                // Zaměření vyhledávacího pole
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
                break;
            case 'trasa':
                // Aktivace režimu plánování trasy
                if (typeof activateRouteMode === 'function') {
                    activateRouteMode();
                }
                break;
            case 'vyčistit mapu':
                // Vyčištění mapy
                if (typeof clearMap === 'function') {
                    clearMap();
                }
                break;
            case 'moje poloha':
                // Zobrazení aktuální polohy
                if (typeof showMyLocation === 'function') {
                    showMyLocation();
                }
                break;
            case 'počasí':
                // Zobrazení počasí
                if (typeof showWeather === 'function') {
                    showWeather();
                }
                break;
            case 'měření':
                // Aktivace režimu měření vzdálenosti
                if (typeof activateMeasureMode === 'function') {
                    activateMeasureMode();
                }
                break;
            case 'sdílet':
                // Sdílení mapy
                if (typeof shareMap === 'function') {
                    shareMap();
                }
                break;
            case 'tisk':
                // Tisk mapy
                if (typeof printMap === 'function') {
                    printMap();
                }
                break;
            case 'virtuální práce':
                // Otevření dialogu virtuální práce
                if (typeof VirtualWork !== 'undefined' && VirtualWork.openWorkDialog) {
                    VirtualWork.openWorkDialog();
                }
                break;
            case 'body':
                // Zobrazení bodů získaných virtuální prací
                if (typeof VirtualWork !== 'undefined' && VirtualWork.openTrackPointsDialog) {
                    VirtualWork.openTrackPointsDialog();
                }
                break;
            case 'úspěchy':
                // Zobrazení úspěchů
                if (typeof Achievements !== 'undefined' && Achievements.showAchievements) {
                    Achievements.showAchievements();
                }
                break;
            case 'téma':
                // Přepnutí tématu
                if (typeof toggleTheme === 'function') {
                    toggleTheme();
                }
                break;
            case 'jazyk':
                // Změna jazyka
                if (typeof changeLanguage === 'function') {
                    changeLanguage();
                }
                break;
            case 'účet':
                // Správa účtu
                if (typeof showAccountSettings === 'function') {
                    showAccountSettings();
                }
                break;
            case 'obnovit menu':
                // Obnovení menu
                this.refreshMenu();
                break;
            case 'api vyhledávání':
                // Otevření API vyhledávání
                if (typeof ApiSearch !== 'undefined' && ApiSearch.openSearchDialog) {
                    ApiSearch.openSearchDialog();
                }
                break;
            case 'api nastavení':
                // Otevření nastavení API
                if (typeof ApiSearch !== 'undefined' && ApiSearch.openSettingsDialog) {
                    ApiSearch.openSettingsDialog();
                }
                break;
            case 'api historie':
                // Zobrazení historie vyhledávání
                if (typeof ApiSearch !== 'undefined' && ApiSearch.showSearchHistory) {
                    ApiSearch.showSearchHistory();
                }
                break;
            case 'odměňovací systém':
                // Otevření dialogu odměňovacího systému
                if (typeof RewardSystem !== 'undefined' && RewardSystem.openRewardDialog) {
                    RewardSystem.openRewardDialog();
                }
                break;
            default:
                // Pokud je příkaz neznámý, zkusíme ho zpracovat pomocí funkce processCommand
                if (typeof processCommand === 'function') {
                    processCommand(command);
                } else {
                    console.warn(`Neznámý příkaz: ${command}`);
                }
        }
    },

    // Obnovení menu příkazů
    refreshMenu() {
        console.log('Obnovuji menu příkazů...');

        // Odstranění starého menu
        const oldOverlay = document.getElementById('commandsOverlay');
        const oldMenu = document.getElementById('commandsMenu');

        if (oldOverlay) {
            oldOverlay.remove();
        }

        if (oldMenu) {
            oldMenu.remove();
        }

        // Otevření kategorie Zábava
        const funCategory = this.categories.find(cat => cat.id === 'fun');
        if (funCategory) {
            funCategory.isOpen = true;
        }

        // Vytvoření nového menu
        this.createCommandsMenu();

        // Zobrazení menu
        this.toggleCommandsMenu();

        // Zobrazení zprávy o obnovení
        if (typeof addMessage !== 'undefined') {
            addMessage('Menu příkazů bylo obnoveno. Kategorie Zábava byla otevřena.', false);
        }

        console.log('Menu příkazů bylo obnoveno');
    },

    // Přidání event listenerů
    setupEventListeners() {
        // Event listener pro změnu nastavení
        window.addEventListener('settingsChanged', () => {
            this.loadSettings();
        });
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CommandsMenu.init();
});
