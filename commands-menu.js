/**
 * Modul pro menu příkazů vedle chatu
 * Verze 0.2.9
 */

const CommandsMenu = {
    // Stav menu
    isVisible: false,
    isEnabled: true, // Výchozí hodnota - menu je povoleno

    // Kategorie příkazů
    categories: [
        {
            id: 'map',
            name: 'Mapa',
            icon: '🗺️',
            isOpen: true,
            commands: [
                { id: 'add-point', name: 'Přidat bod', description: 'Přidá nový bod na mapu', icon: '📍', command: 'přidej bod' },
                { id: 'calculate-route', name: 'Vypočítat trasu', description: 'Vypočítá trasu mezi body na mapě', icon: '🚗', command: 'vypočítej trasu' },
                { id: 'focus-point', name: 'Zaměřit bod', description: 'Zaměří a přejde na speciální bod na mapě', icon: '🔎', command: 'zaměřit bod' },
                { id: 'clear-map', name: 'Vymazat mapu', description: 'Odstraní všechny body a trasy z mapy', icon: '🧹', command: 'vymaž mapu' },
                { id: 'measure-distance', name: 'Měření vzdálenosti', description: 'Aktivuje nástroj pro měření vzdálenosti', icon: '📏', command: 'měření vzdálenosti' },
                { id: 'search', name: 'Vyhledat', description: 'Vyhledá místo nebo adresu na mapě', icon: '🔍', command: 'vyhledat' }
            ]
        },
        {
            id: 'tasks',
            name: 'Úkoly',
            icon: '📝',
            isOpen: false,
            commands: [
                { id: 'tasks', name: 'Úkoly a questy', description: 'Zobrazí přehled všech úkolů a denních questů', icon: '📝', command: 'úkoly' },
                { id: 'daily-quest', name: 'Denní quest', description: 'Zobrazí aktuální denní quest', icon: '⭐', command: 'denní quest' },
                { id: 'rent-money', name: 'Peníze na nájem', description: 'Zobrazí úkol na sehnat peníze na nájem', icon: '💰', command: 'nájem' },
                { id: 'car-sales', name: 'Prodej aut', description: 'Zobrazí nabídku aut k prodeji', icon: '🚗', command: 'prodej aut' }
            ]
        },
        {
            id: 'view',
            name: 'Zobrazení',
            icon: '👁️',
            isOpen: false,
            commands: [
                { id: 'fullscreen', name: 'Celá obrazovka', description: 'Přepne aplikaci do režimu celé obrazovky', icon: '⛶', command: 'fullscreen' },
                { id: 'globe', name: 'Glóbus', description: 'Přepne mapu do 3D glóbusu', icon: '🌎', command: 'glóbus' },
                { id: 'constellations', name: 'Souhvězdí', description: 'Zobrazí souhvězdí na obloze v režimu glóbusu', icon: '✨', command: 'souhvězdí' },
                { id: 'weather', name: 'Počasí', description: 'Zobrazí vrstvu s aktuálním počasím na mapě', icon: '☁️', command: 'počasí' },
                { id: 'share-map', name: 'Sdílet mapu', description: 'Vytvoří odkaz pro sdílení aktuálního stavu mapy', icon: '🔗', command: 'sdílet mapu' },
                { id: 'export-data', name: 'Exportovat data', description: 'Exportuje body a trasy do různých formátů', icon: '📤', command: 'exportovat data' }
            ]
        },
        {
            id: 'services',
            name: 'Služby',
            icon: '🏢',
            isOpen: false,
            commands: [
                { id: 'alexa', name: 'Alexa', description: 'Zobrazí informace o nočním klubu Alexa', icon: '💃', command: 'alexa' },
                { id: 'opening-hours', name: 'Otevírací doba', description: 'Zobrazí otevírací doby obchodů v Hodoníně', icon: '🕒', command: 'oteviracidoba' },
                { id: 'transport', name: 'Veřejná doprava', description: 'Vyhledá spojení veřejnou dopravou', icon: '🚌', command: 'veřejná doprava' },
                { id: 'taxi', name: 'Taxi služby', description: 'Zobrazí dostupné taxi služby v okolí', icon: '🚕', command: 'taxi' },
                { id: 'food', name: 'Jídlo a pití', description: 'Vyhledá restaurace a bary v okolí', icon: '🍔', command: 'jídlo' },
                { id: 'pizza', name: 'Pizza', description: 'Zobrazí pizzerie v okolí', icon: '🍕', command: 'pizza' },
                { id: 'doctor', name: 'Lékař', description: 'Vyhledá lékaře v okolí', icon: '👨‍⚕️', command: 'lékař' },
                { id: 'dentist', name: 'Zubař', description: 'Vyhledá zubaře v okolí', icon: '🦷', command: 'zubař' },
                { id: 'pharmacy', name: 'Lékárna', description: 'Vyhledá lékárny v okolí', icon: '💊', command: 'lékárna' },
                { id: 'employment', name: 'Úřad práce', description: 'Informace o úřadu práce', icon: '🏢', command: 'úřad práce' },
                { id: 'energy-drink', name: 'Energy drinky', description: 'Nabídka energy drinků', icon: '🥤', command: 'energy drink' },
                { id: 'meat', name: 'Maso', description: 'Nabídka masa - krkovička', icon: '🥩', command: 'krkovička' }
            ]
        },
        {
            id: 'finance',
            name: 'Finance',
            icon: '💰',
            isOpen: false,
            commands: [
                { id: 'money', name: 'Stav peněz', description: 'Zobrazí aktuální stav peněz a kryptoměn', icon: '💰', command: 'peníze' },
                { id: 'bitcoin', name: 'Bitcoin', description: 'Zobrazí stav bitcoinu a jeho aktuální cenu', icon: '₿', command: 'bitcoin' },
                { id: 'ethereum', name: 'Ethereum', description: 'Zobrazí stav etherea a jeho aktuální cenu', icon: 'Ξ', command: 'ethereum' },
                { id: 'dogecoin', name: 'Dogecoin', description: 'Zobrazí stav dogecoinu a jeho aktuální cenu', icon: '🐶', command: 'dogecoin' },
                { id: 'ripple', name: 'Ripple', description: 'Zobrazí stav ripple a jeho aktuální cenu', icon: 'X', command: 'ripple' }
            ]
        },
        {
            id: 'settings',
            name: 'Nastavení',
            icon: '⚙️',
            isOpen: false,
            commands: [
                { id: 'settings', name: 'Nastavení aplikace', description: 'Otevře dialog nastavení aplikace', icon: '⚙️', command: 'nastavení' },
                { id: 'dark-mode', name: 'Tmavý režim', description: 'Přepne tmavý režim aplikace', icon: '🌙', command: 'tmavý režim' },
                { id: 'updates', name: 'Novinky a aktualizace', description: 'Zobrazí informace o novinkách a aktualizacích', icon: '🔔', command: 'novinky' },
                { id: 'help', name: 'Nápověda', description: 'Zobrazí nápovědu k používání aplikace', icon: '❓', command: 'nápověda' },
                { id: 'premium', name: 'Premium verze', description: 'Zobrazí informace o premium verzi', icon: '⭐', command: 'premium' }
            ]
        },
        {
            id: 'fun',
            name: 'Zábava',
            icon: '🎮',
            isOpen: false,
            commands: [
                { id: 'rap', name: 'Rap', description: 'Spustí rapové akce', icon: '🎤', command: 'rap' },
                { id: 'work', name: 'Jít do práce', description: 'Vytvoří trasu do práce a sleduje úkoly', icon: '💼', command: 'chci jít do práce' }
            ]
        }
    ],

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu menu příkazů...');

        // Načtení nastavení z localStorage
        this.loadSettings();

        // Vytvoření tlačítka pro menu příkazů
        this.createCommandButton();

        // Vytvoření menu příkazů
        this.createCommandsMenu();

        // Přidání event listenerů
        this.setupEventListeners();

        console.log('Modul menu příkazů byl inicializován');
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
        const chatInput = document.querySelector('.chat-input');
        if (chatInput) {
            // Vložení tlačítka před vstupní pole
            chatInput.insertBefore(button, chatInput.firstChild);
        } else {
            console.error('Chat input nebyl nalezen');
        }
    },

    // Přidání tlačítka do plovoucího chatu
    addButtonToFloatingChat(button) {
        // Přidání ID pro rozlišení od hlavního tlačítka
        button.id = 'floatingCommandsButton';

        // Přidání event listeneru
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleCommandsMenu();
        });

        // Přidání tlačítka do plovoucího chatu při jeho vytvoření
        document.addEventListener('floatingChatCreated', () => {
            const floatingChatInput = document.querySelector('.floating-chat-input');
            if (floatingChatInput) {
                floatingChatInput.insertBefore(button, floatingChatInput.firstChild);
            }
        });
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
    },

    // Vytvoření elementu kategorie
    createCategoryElement(category) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'commands-category';
        categoryElement.dataset.category = category.id;

        // Hlavička kategorie
        const header = document.createElement('div');
        header.className = 'commands-category-header';
        header.innerHTML = `
            <span class="commands-category-icon">${category.icon}</span>
            <span class="commands-category-name">${category.name}</span>
            <span class="commands-category-toggle">${category.isOpen ? '▼' : '►'}</span>
        `;

        // Event listener pro rozbalení/sbalení kategorie
        header.addEventListener('click', () => {
            this.toggleCategory(category.id);
        });

        // Seznam příkazů
        const commandsList = document.createElement('div');
        commandsList.className = 'commands-list';
        commandsList.style.display = category.isOpen ? 'flex' : 'none';

        // Přidání příkazů
        category.commands.forEach(command => {
            const commandElement = this.createCommandElement(command);
            commandsList.appendChild(commandElement);
        });

        // Sestavení kategorie
        categoryElement.appendChild(header);
        categoryElement.appendChild(commandsList);

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

    // Přepnutí zobrazení kategorie
    toggleCategory(categoryId) {
        // Najít kategorii v datech
        const category = this.categories.find(cat => cat.id === categoryId);
        if (category) {
            category.isOpen = !category.isOpen;
        }

        // Aktualizace UI
        const categoryElement = document.querySelector(`.commands-category[data-category="${categoryId}"]`);
        if (categoryElement) {
            const commandsList = categoryElement.querySelector('.commands-list');
            const toggle = categoryElement.querySelector('.commands-category-toggle');

            if (commandsList && toggle) {
                if (category.isOpen) {
                    commandsList.style.display = 'flex';
                    toggle.textContent = '▼';
                } else {
                    commandsList.style.display = 'none';
                    toggle.textContent = '►';
                }
            }
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

    // Provedení příkazu
    executeCommand(command) {
        console.log('Provádění příkazu:', command);

        // Skrytí menu
        this.toggleCommandsMenu();

        // Zpracování speciálních příkazů
        if (this.handleSpecialCommand(command)) {
            return;
        }

        // Vložení příkazu do chatu
        const chatInput = document.getElementById('messageInput');
        const floatingChatInput = document.getElementById('floatingMessageInput');

        // Určení, který chat je aktivní
        const isFullscreen = document.body.classList.contains('map-fullscreen');
        const activeInput = isFullscreen ? floatingChatInput : chatInput;

        if (activeInput) {
            activeInput.value = command;
            activeInput.focus();

            // Simulace stisknutí tlačítka odeslat
            const sendButton = isFullscreen ?
                document.getElementById('floatingSendMessage') :
                document.getElementById('sendMessage');

            if (sendButton) {
                sendButton.click();
            }
        }
    },

    // Zpracování speciálních příkazů
    handleSpecialCommand(command) {
        // Příkazy pro mapu
        if (command === 'zaměřit bod') {
            this.showFocusPointDialog();
            return true;
        }
        // Úkoly a questy
        if (command === 'úkoly') {
            if (typeof TaskSystem !== 'undefined') {
                TaskSystem.showTasksDialog();
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zobrazuji přehled úkolů a questů...', false);
                    setTimeout(() => {
                        addMessage('Modul úkolů není dostupný. Zkuste aktualizovat stránku.', false);
                    }, 1000);
                }
            }
            return true;
        }

        if (command === 'denní quest') {
            if (typeof TaskSystem !== 'undefined') {
                const activeQuest = TaskSystem.getActiveDailyQuest();
                if (activeQuest) {
                    TaskSystem.showTasksDialog();
                    // Přepnutí na záložku questů
                    setTimeout(() => {
                        const questTab = document.querySelector('.tasks-dialog-tab[data-tab="quests"]');
                        if (questTab) {
                            questTab.click();
                        }
                    }, 100);
                } else {
                    if (typeof addMessage !== 'undefined') {
                        addMessage('Dnes nemáte žádný aktivní denní quest. Zkuste to znovu zítra.', false);
                    }
                }
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zobrazuji denní quest...', false);
                    setTimeout(() => {
                        addMessage('Modul úkolů není dostupný. Zkuste aktualizovat stránku.', false);
                    }, 1000);
                }
            }
            return true;
        }

        if (command === 'nájem') {
            if (typeof TaskSystem !== 'undefined') {
                const rentTask = TaskSystem.tasks.find(task => task.id === 'rent-money');
                if (rentTask) {
                    TaskSystem.showTasksDialog();
                } else {
                    if (typeof addMessage !== 'undefined') {
                        addMessage('Vytvářím nový úkol: Sehnat peníze na nájem...', false);
                        setTimeout(() => {
                            TaskSystem.addTask({
                                id: 'rent-money',
                                title: 'Sehnat peníze na nájem',
                                description: 'Potřebuješ sehnat 5000 Kč na zaplacení nájmu do 10 dnů.',
                                type: 'main',
                                status: 'active',
                                progress: 0,
                                goal: 5000,
                                reward: {
                                    xp: 500,
                                    questPoints: 100
                                },
                                location: {
                                    lat: 48.8484,
                                    lng: 17.1259,
                                    name: 'Hodonín'
                                },
                                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                                createdAt: new Date().toISOString()
                            });
                            TaskSystem.showTasksDialog();
                        }, 1000);
                    }
                }
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zobrazuji úkol na sehnat peníze na nájem...', false);
                    setTimeout(() => {
                        addMessage('Modul úkolů není dostupný. Zkuste aktualizovat stránku.', false);
                    }, 1000);
                }
            }
            return true;
        }

        if (command === 'prodej aut') {
            if (typeof CarSales !== 'undefined') {
                CarSales.showCarSalesDialog();
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zobrazuji nabídku aut k prodeji...', false);
                    setTimeout(() => {
                        addMessage('Modul prodeje aut není dostupný. Zkuste aktualizovat stránku.', false);
                    }, 1000);
                }
            }
            return true;
        }

        // Finance a kryptoměny
        if (command === 'peníze') {
            this.showFinanceInfo('all');
            return true;
        }

        if (command === 'bitcoin') {
            this.showFinanceInfo('BTC');
            return true;
        }

        if (command === 'ethereum') {
            this.showFinanceInfo('ETH');
            return true;
        }

        if (command === 'dogecoin') {
            this.showFinanceInfo('DOGE');
            return true;
        }

        if (command === 'ripple') {
            this.showFinanceInfo('XRP');
            return true;
        }

        // Služby jídla a pití
        if (command === 'jídlo' && typeof FoodServices !== 'undefined') {
            FoodServices.showService('food');
            return true;
        }

        if (command === 'pizza' && typeof FoodServices !== 'undefined') {
            FoodServices.showService('pizza');
            return true;
        }

        if (command === 'energy drink' && typeof FoodServices !== 'undefined') {
            FoodServices.showService('energyDrink');
            return true;
        }

        if (command === 'krkovička' && typeof FoodServices !== 'undefined') {
            FoodServices.showService('meat');
            return true;
        }

        // Lékařské služby
        if (command === 'lékař' && typeof MedicalServices !== 'undefined') {
            MedicalServices.showService('doctor');
            return true;
        }

        if (command === 'zubař' && typeof MedicalServices !== 'undefined') {
            MedicalServices.showService('dentist');
            return true;
        }

        if (command === 'lékárna' && typeof MedicalServices !== 'undefined') {
            MedicalServices.showService('pharmacy');
            return true;
        }

        // Veřejná doprava
        if (command === 'veřejná doprava' && typeof TransportServices !== 'undefined') {
            TransportServices.showService();
            return true;
        }

        // Ostatní příkazy
        if (command === 'tmavý režim') {
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.checked = !darkModeToggle.checked;
                darkModeToggle.dispatchEvent(new Event('change'));

                // Přidání XP za použití tmavého režimu
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(5, 'Přepnutí tmavého režimu');
                }
            }
            return true;
        }

        if (command === 'nastavení') {
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) {
                settingsModal.style.display = 'block';
            }
            return true;
        }

        if (command === 'fullscreen') {
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            if (fullscreenBtn) {
                fullscreenBtn.click();
            }
            return true;
        }

        if (command === 'glóbus') {
            const globeBtn = document.getElementById('globeBtn');
            if (globeBtn) {
                globeBtn.click();
            }
            return true;
        }

        if (command === 'počasí') {
            if (typeof WeatherLayer !== 'undefined') {
                WeatherLayer.processCommand('počasí');
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zobrazuji aktuální počasí...', false);
                    setTimeout(() => {
                        addMessage('Hodonín: 22°C, polojasno, vítr 5 km/h, vlhkost 65%', false);
                    }, 1000);
                }
            }
            return true;
        }

        if (command === 'souhvězdí') {
            if (typeof DarkSkyEffects !== 'undefined') {
                const result = DarkSkyEffects.toggleGlobeConstellations();
                if (!result) {
                    // Pokud není glóbus režim aktivní, aktivujeme ho
                    if (typeof toggleGlobeMode === 'function') {
                        toggleGlobeMode();
                        // Po aktivaci glóbusu zkusíme znovu aktivovat souhvězdí
                        setTimeout(() => {
                            DarkSkyEffects.toggleGlobeConstellations();
                        }, 1000);
                    }
                }
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Aktivuji souhvězdí na obloze...', false);
                    setTimeout(() => {
                        addMessage('Souhvězdí byla úspěšně aktivována. Nyní můžete vidět hvězdy a souhvězdí na obloze.', false);
                    }, 1000);
                }
            }
            return true;
        }

        if (command === 'novinky') {
            if (typeof UpdatesNotification !== 'undefined') {
                UpdatesNotification.showUpdatesModal();

                // Přidání XP za zobrazení novinek
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(5, 'Zobrazení novinek a aktualizací');
                }
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zobrazuji novinky a aktualizace...', false);
                    setTimeout(() => {
                        addMessage('Modul novinek není dostupný. Zkuste aktualizovat stránku.', false);
                    }, 1000);
                }
            }
            return true;
        }

        if (command === 'sdílet mapu') {
            if (typeof MapSharing !== 'undefined') {
                MapSharing.processCommand('sdílet mapu');
            } else {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Vytvářím odkaz pro sdílení mapy...', false);
                    setTimeout(() => {
                        addMessage('Odkaz pro sdílení mapy byl vytvořen: https://aimapa.cz/share?id=123456', false);
                    }, 1000);
                }
            }
            return true;
        }

        if (command === 'oteviracidoba') {
            if (typeof addMessage !== 'undefined') {
                addMessage('Zobrazuji otevírací doby obchodů v Hodoníně...', false);
                setTimeout(() => {
                    const message = `Otevírací doby v Hodoníně:

Albert: Po-Ne 7:00-21:00
Lidl: Po-Ne 7:00-20:00
Kaufland: Po-Ne 7:00-22:00
Tesco: Po-Ne 6:00-22:00
Billa: Po-Ne 7:00-20:00`;
                    addMessage(message, false);
                }, 1000);
            }
            return true;
        }

        if (command === 'alexa') {
            if (typeof addMessage !== 'undefined') {
                addMessage('Zobrazuji informace o nočním klubu Alexa...', false);
                setTimeout(() => {
                    const message = `Noční klub Alexa:

Adresa: Masarykovo náměstí 5, Hodonín
Otevírací doba: St-So 21:00-5:00
Vstupné: 100 Kč
Dnešní akce: Ladies Night - vstup pro dámy zdarma`;
                    addMessage(message, false);
                }, 1000);
            }
            return true;
        }

        if (command === 'taxi') {
            if (typeof addMessage !== 'undefined') {
                addMessage('Zobrazuji dostupné taxi služby v Hodoníně...', false);
                setTimeout(() => {
                    const message = `Taxi služby v Hodoníně:

City Taxi: 518 321 321
Hodonín Taxi: 518 352 352
Eko Taxi: 777 666 333
Non-stop Taxi: 777 777 777`;
                    addMessage(message, false);
                }, 1000);
            }
            return true;
        }

        if (command === 'úřad práce') {
            if (typeof addMessage !== 'undefined') {
                addMessage('Zobrazuji informace o úřadu práce v Hodoníně...', false);
                setTimeout(() => {
                    const message = `Úřad práce Hodonín:

Adresa: Lipová alej 3846/8, Hodonín
Otevírací doba: Po, St 8:00-17:00, Út, Čt 8:00-13:00, Pá 8:00-13:00
Telefon: 950 115 111
Email: podatelna@ho.mpsv.cz`;
                    addMessage(message, false);
                }, 1000);
            }
            return true;
        }

        if (command === 'rap') {
            if (typeof addMessage !== 'undefined') {
                addMessage('Yo, let me drop some beats for you!', false);
                setTimeout(() => {
                    const message = `AI Map on the mic, I'm mapping your way,
Navigating streets, making your day,
From Hodonín to Hrušky, I know the route,
Got the best locations, without a doubt!`;
                    addMessage(message, false);

                    // Přidání XP za použití rapu
                    if (typeof UserProgress !== 'undefined') {
                        UserProgress.addXP(10, 'Rapová akce');
                    }
                }, 1500);
            }
            return true;
        }

        if (command === 'chci jít do práce') {
            if (typeof addMessage !== 'undefined') {
                addMessage('Vytvářím virtuální cestu do práce...', false);

                // Vytvoření virtuálního dialogu pro poslání sebe do práce
                setTimeout(() => {
                    // Vytvoření dialogu
                    const dialog = document.createElement('div');
                    dialog.className = 'work-dialog';
                    dialog.innerHTML = `
                        <div class="work-dialog-header">
                            <h3>Virtuální cesta do práce</h3>
                            <button class="work-dialog-close">&times;</button>
                        </div>
                        <div class="work-dialog-body">
                            <div class="work-info">
                                <p>Místo toho, abyste šli do práce fyzicky, můžete se tam poslat virtuálně!</p>
                                <div class="work-details">
                                    <div class="work-detail"><span class="work-label">Vzdálenost:</span> <span class="work-value">2.5 km</span></div>
                                    <div class="work-detail"><span class="work-label">Čas cesty:</span> <span class="work-value">10 minut</span></div>
                                    <div class="work-detail"><span class="work-label">Pracovní doba:</span> <span class="work-value">8 hodin</span></div>
                                    <div class="work-detail"><span class="work-label">Odměna:</span> <span class="work-value">1000 Kč</span></div>
                                </div>
                            </div>
                            <div class="work-options">
                                <h4>Vyberte typ práce:</h4>
                                <div class="work-option-list">
                                    <div class="work-option" data-work-type="office" data-work-pay="1000">
                                        <div class="work-option-icon">💼</div>
                                        <div class="work-option-info">
                                            <div class="work-option-title">Kancelářská práce</div>
                                            <div class="work-option-pay">1000 Kč / den</div>
                                        </div>
                                    </div>
                                    <div class="work-option" data-work-type="programming" data-work-pay="1500">
                                        <div class="work-option-icon">💻</div>
                                        <div class="work-option-info">
                                            <div class="work-option-title">Programování</div>
                                            <div class="work-option-pay">1500 Kč / den</div>
                                        </div>
                                    </div>
                                    <div class="work-option" data-work-type="manual" data-work-pay="800">
                                        <div class="work-option-icon">🔨</div>
                                        <div class="work-option-info">
                                            <div class="work-option-title">Manuální práce</div>
                                            <div class="work-option-pay">800 Kč / den</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="work-actions">
                                <button class="work-action-btn work-send-btn" disabled>Poslat se do práce</button>
                                <button class="work-action-btn work-cancel-btn">Zrušit</button>
                            </div>
                        </div>
                    `;

                    // Přidání CSS stylů
                    const workStyles = document.createElement('style');
                    workStyles.textContent = `
                        .work-dialog {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: white;
                            border-radius: 15px;
                            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                            z-index: 1100;
                            width: 90%;
                            max-width: 500px;
                            overflow: hidden;
                            animation: fadeIn 0.3s ease-in-out;
                        }

                        .work-dialog-header {
                            background-color: #3498db;
                            color: white;
                            padding: 15px 20px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }

                        .work-dialog-header h3 {
                            margin: 0;
                            font-size: 20px;
                            font-weight: bold;
                        }

                        .work-dialog-close {
                            background: none;
                            border: none;
                            color: white;
                            font-size: 24px;
                            cursor: pointer;
                        }

                        .work-dialog-body {
                            padding: 20px;
                        }

                        .work-info p {
                            margin-top: 0;
                            font-size: 16px;
                        }

                        .work-details {
                            background-color: #f8f9fa;
                            border-radius: 10px;
                            padding: 15px;
                            margin-bottom: 20px;
                        }

                        .work-detail {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 8px;
                        }

                        .work-label {
                            font-weight: bold;
                            color: #555;
                        }

                        .work-value {
                            color: #333;
                        }

                        .work-options h4 {
                            margin-top: 0;
                            margin-bottom: 10px;
                        }

                        .work-option-list {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                            gap: 15px;
                            margin-bottom: 20px;
                        }

                        .work-option {
                            border: 2px solid #e0e0e0;
                            border-radius: 10px;
                            padding: 15px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            display: flex;
                            align-items: center;
                        }

                        .work-option:hover {
                            border-color: #3498db;
                            background-color: #f0f7fc;
                        }

                        .work-option.selected {
                            border-color: #3498db;
                            background-color: #ebf5fb;
                        }

                        .work-option-icon {
                            font-size: 24px;
                            margin-right: 15px;
                        }

                        .work-option-title {
                            font-weight: bold;
                            margin-bottom: 5px;
                        }

                        .work-option-pay {
                            color: #27ae60;
                            font-size: 14px;
                        }

                        .work-actions {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 20px;
                        }

                        .work-action-btn {
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            font-size: 16px;
                            cursor: pointer;
                            transition: background-color 0.2s;
                        }

                        .work-send-btn {
                            background-color: #3498db;
                            color: white;
                        }

                        .work-send-btn:hover:not(:disabled) {
                            background-color: #2980b9;
                        }

                        .work-send-btn:disabled {
                            background-color: #bdc3c7;
                            cursor: not-allowed;
                        }

                        .work-cancel-btn {
                            background-color: #e0e0e0;
                            color: #333;
                        }

                        .work-cancel-btn:hover {
                            background-color: #bdc3c7;
                        }

                        /* Tmavý režim */
                        body[data-theme="dark"] .work-dialog {
                            background-color: #2c3e50;
                            color: #ecf0f1;
                        }

                        body[data-theme="dark"] .work-dialog-header {
                            background-color: #2980b9;
                        }

                        body[data-theme="dark"] .work-details {
                            background-color: #34495e;
                        }

                        body[data-theme="dark"] .work-label {
                            color: #bdc3c7;
                        }

                        body[data-theme="dark"] .work-value {
                            color: #ecf0f1;
                        }

                        body[data-theme="dark"] .work-option {
                            border-color: #34495e;
                            background-color: #2c3e50;
                        }

                        body[data-theme="dark"] .work-option:hover {
                            border-color: #3498db;
                            background-color: #34495e;
                        }

                        body[data-theme="dark"] .work-option.selected {
                            border-color: #3498db;
                            background-color: #2980b9;
                        }

                        body[data-theme="dark"] .work-option-pay {
                            color: #2ecc71;
                        }

                        body[data-theme="dark"] .work-cancel-btn {
                            background-color: #34495e;
                            color: #ecf0f1;
                        }

                        body[data-theme="dark"] .work-cancel-btn:hover {
                            background-color: #2c3e50;
                        }

                        @keyframes fadeIn {
                            from { opacity: 0; transform: translate(-50%, -60%); }
                            to { opacity: 1; transform: translate(-50%, -50%); }
                        }
                    `;

                    document.head.appendChild(workStyles);
                    document.body.appendChild(dialog);

                    // Přidání event listenerů
                    const closeButton = dialog.querySelector('.work-dialog-close');
                    const cancelButton = dialog.querySelector('.work-cancel-btn');
                    const sendButton = dialog.querySelector('.work-send-btn');
                    const workOptions = dialog.querySelectorAll('.work-option');

                    // Zavření dialogu
                    const closeDialog = () => {
                        dialog.remove();
                        workStyles.remove();
                    };

                    closeButton.addEventListener('click', closeDialog);
                    cancelButton.addEventListener('click', closeDialog);

                    // Výběr typu práce
                    let selectedWorkType = null;
                    let selectedWorkPay = 0;

                    workOptions.forEach(option => {
                        option.addEventListener('click', () => {
                            // Odstranění výběru ze všech možností
                            workOptions.forEach(opt => opt.classList.remove('selected'));

                            // Přidání výběru na kliknutou možnost
                            option.classList.add('selected');

                            // Uložení vybraného typu práce a odměny
                            selectedWorkType = option.dataset.workType;
                            selectedWorkPay = parseInt(option.dataset.workPay);

                            // Povolení tlačítka pro poslání do práce
                            sendButton.disabled = false;
                        });
                    });

                    // Poslání do práce
                    sendButton.addEventListener('click', () => {
                        if (!selectedWorkType) return;

                        // Zavření dialogu
                        closeDialog();

                        // Zobrazení zprávy o odeslání do práce
                        addMessage(`Posílám vás do práce (${selectedWorkType === 'office' ? 'kancelářská práce' : selectedWorkType === 'programming' ? 'programování' : 'manuální práce'})...`, false);

                        // Simulace práce
                        setTimeout(() => {
                            // Přidání peněz
                            if (typeof MoneyIndicator !== 'undefined') {
                                MoneyIndicator.addMoney(selectedWorkPay, `Výdělek z práce (${selectedWorkType === 'office' ? 'kancelářská práce' : selectedWorkType === 'programming' ? 'programování' : 'manuální práce'})`);
                            } else {
                                // Pokud není dostupný MoneyIndicator, přidáme peníze přímo do localStorage
                                const appState = JSON.parse(localStorage.getItem('appState')) || {};
                                const currentMoney = appState.money !== undefined ? appState.money : 500;
                                appState.money = currentMoney + selectedWorkPay;
                                localStorage.setItem('appState', JSON.stringify(appState));
                            }

                            // Přidání XP za práci
                            if (typeof UserProgress !== 'undefined') {
                                UserProgress.addXP(30, `Práce (${selectedWorkType === 'office' ? 'kancelářská práce' : selectedWorkType === 'programming' ? 'programování' : 'manuální práce'})`);
                            }

                            // Zobrazení zprávy o dokončení práce
                            addMessage(`Práce dokončena! Vydělali jste ${selectedWorkPay} Kč.`, false);

                            // Aktualizace úkolu na nájem, pokud existuje
                            if (typeof TaskSystem !== 'undefined') {
                                const rentTask = TaskSystem.tasks.find(task => task.id === 'rent-money' && task.status === 'active');
                                if (rentTask) {
                                    // Vytvoření události přidání peněz pro aktualizaci úkolu
                                    const moneyEvent = new CustomEvent('moneyAdded', { detail: { amount: selectedWorkPay } });
                                    document.dispatchEvent(moneyEvent);

                                    // Zobrazení zprávy o postupu v úkolu
                                    setTimeout(() => {
                                        const updatedTask = TaskSystem.tasks.find(task => task.id === 'rent-money');
                                        if (updatedTask && updatedTask.status === 'active') {
                                            addMessage(`Postup v úkolu "${updatedTask.title}": ${updatedTask.progress} / ${updatedTask.goal} Kč`, false);
                                        } else if (updatedTask && updatedTask.status === 'completed') {
                                            addMessage(`Gratulujeme! Úkol "${updatedTask.title}" byl dokončen!`, false);
                                        }
                                    }, 1000);
                                }
                            }
                        }, 3000);
                    });
                }, 1000);
            }
            return true;
        }

        // Pokud není speciální příkaz, vrátíme false
        return false;
    },

    // Filtrování příkazů podle vyhledávání
    filterCommands(searchText) {
        if (!searchText) {
            // Pokud není zadán žádný text, zobrazíme všechny kategorie
            this.categories.forEach(category => {
                const categoryElement = document.querySelector(`.commands-category[data-category="${category.id}"]`);
                if (categoryElement) {
                    categoryElement.style.display = 'block';
                }
            });
            return;
        }

        searchText = searchText.toLowerCase();

        // Procházení všech kategorií a příkazů
        this.categories.forEach(category => {
            const categoryElement = document.querySelector(`.commands-category[data-category="${category.id}"]`);
            if (!categoryElement) return;

            // Filtrování příkazů v kategorii
            const commandElements = categoryElement.querySelectorAll('.command-item');
            let hasVisibleCommands = false;

            commandElements.forEach(commandElement => {
                const commandText = commandElement.dataset.command.toLowerCase();
                const nameText = commandElement.querySelector('.command-name').textContent.toLowerCase();
                const descriptionText = commandElement.querySelector('.command-description').textContent.toLowerCase();

                // Kontrola, zda příkaz odpovídá vyhledávání
                const matches = commandText.includes(searchText) ||
                                nameText.includes(searchText) ||
                                descriptionText.includes(searchText);

                commandElement.style.display = matches ? 'flex' : 'none';
                if (matches) hasVisibleCommands = true;
            });

            // Zobrazení/skrytí celé kategorie
            categoryElement.style.display = hasVisibleCommands ? 'block' : 'none';

            // Pokud kategorie obsahuje odpovídající příkazy, rozbalíme ji
            if (hasVisibleCommands) {
                const commandsList = categoryElement.querySelector('.commands-list');
                const toggle = categoryElement.querySelector('.commands-category-toggle');
                if (commandsList && toggle) {
                    commandsList.style.display = 'flex';
                    toggle.textContent = '▼';
                }
            }
        });

        // Kontrola, zda existují nějaké výsledky
        const visibleCategories = document.querySelectorAll('.commands-category[style="display: block;"]');
        const noResultsElement = document.querySelector('.no-commands-results');

        if (visibleCategories.length === 0) {
            // Žádné výsledky
            if (!noResultsElement) {
                const scrollContainer = document.querySelector('.commands-menu-scroll-container');
                if (scrollContainer) {
                    const noResults = document.createElement('div');
                    noResults.className = 'no-commands-results';
                    noResults.textContent = 'Žádné příkazy neodpovídají vašemu vyhledávání';
                    scrollContainer.appendChild(noResults);
                }
            }
        } else if (noResultsElement) {
            // Odstranění zprávy o žádných výsledcích
            noResultsElement.remove();
        }
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro zavření menu
        document.addEventListener('click', (e) => {
            if (e.target.matches('.commands-menu-close')) {
                this.toggleCommandsMenu();
            }
        });

        // Event listener pro kliknutí na překrytí
        document.addEventListener('click', (e) => {
            if (e.target.matches('#commandsOverlay')) {
                this.toggleCommandsMenu();
            }
        });

        // Event listener pro vyhledávání
        document.addEventListener('input', (e) => {
            if (e.target.matches('.commands-search-input')) {
                this.filterCommands(e.target.value);
            }
        });

        // Event listener pro klávesové zkratky
        document.addEventListener('keydown', (e) => {
            // Escape pro zavření menu
            if (e.key === 'Escape' && this.isVisible) {
                this.toggleCommandsMenu();
            }
        });

        // Event listener pro změnu nastavení
        window.addEventListener('settingsChanged', () => {
            this.loadSettings();
            this.updateUI();
        });
    },

    // Zobrazení informací o financích
    showFinanceInfo(type = 'all') {
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

        // Formátování peněz
        const formatMoney = (amount) => `${amount.toLocaleString()} Kč`;

        // Formátování kryptoměny
        const formatCrypto = (amount, symbol) => {
            switch (symbol) {
                case 'BTC':
                    return `${amount.toFixed(5)} BTC`;
                case 'ETH':
                    return `${amount.toFixed(4)} ETH`;
                case 'DOGE':
                    return `${amount.toFixed(1)} DOGE`;
                case 'XRP':
                    return `${amount.toFixed(2)} XRP`;
                default:
                    return `${amount.toFixed(5)} ${symbol}`;
            }
        };

        // Formátování ceny kryptoměny
        const formatCryptoPrice = (price, symbol) => {
            if (!price) return '$ --';

            switch (symbol) {
                case 'BTC':
                case 'ETH':
                    return `$ ${Number(price).toLocaleString()}`;
                case 'DOGE':
                case 'XRP':
                    return `$ ${Number(price)}`;
                default:
                    return `$ ${Number(price).toLocaleString()}`;
            }
        };

        // Získání ikony pro kryptoměnu
        const getCryptoIcon = (symbol) => {
            switch (symbol) {
                case 'BTC': return '₿'; // Bitcoin symbol
                case 'ETH': return 'Ξ'; // Ethereum symbol (Xi)
                case 'DOGE': return '🐶'; // Dog emoji
                case 'XRP': return 'X'; // XRP symbol
                default: return '₿';
            }
        };

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'finance-dialog';

        // Vytvoření obsahu dialogu
        let dialogContent = '';

        if (type === 'all') {
            // Zobrazení všech financí
            dialogContent = `
                <div class="finance-dialog-header">
                    <h3>Stav financí</h3>
                    <button class="finance-dialog-close">&times;</button>
                </div>
                <div class="finance-dialog-body">
                    <div class="finance-item money-item">
                        <span class="finance-icon">💰</span>
                        <span class="finance-value">${formatMoney(money)}</span>
                    </div>
                    <div class="finance-item crypto-item" data-crypto="BTC">
                        <span class="finance-icon">${getCryptoIcon('BTC')}</span>
                        <span class="finance-value">${formatCrypto(crypto.BTC, 'BTC')}</span>
                        <span class="finance-price">${formatCryptoPrice(cryptoPrices.BTC, 'BTC')}</span>
                    </div>
                    <div class="finance-item crypto-item" data-crypto="ETH">
                        <span class="finance-icon">${getCryptoIcon('ETH')}</span>
                        <span class="finance-value">${formatCrypto(crypto.ETH, 'ETH')}</span>
                        <span class="finance-price">${formatCryptoPrice(cryptoPrices.ETH, 'ETH')}</span>
                    </div>
                    <div class="finance-item crypto-item" data-crypto="DOGE">
                        <span class="finance-icon">${getCryptoIcon('DOGE')}</span>
                        <span class="finance-value">${formatCrypto(crypto.DOGE, 'DOGE')}</span>
                        <span class="finance-price">${formatCryptoPrice(cryptoPrices.DOGE, 'DOGE')}</span>
                    </div>
                    <div class="finance-item crypto-item" data-crypto="XRP">
                        <span class="finance-icon">${getCryptoIcon('XRP')}</span>
                        <span class="finance-value">${formatCrypto(crypto.XRP, 'XRP')}</span>
                        <span class="finance-price">${formatCryptoPrice(cryptoPrices.XRP, 'XRP')}</span>
                    </div>
                </div>
            `;
        } else {
            // Zobrazení konkrétní kryptoměny
            const cryptoValue = crypto[type] || 0;
            const cryptoPrice = cryptoPrices[type] || 0;

            dialogContent = `
                <div class="finance-dialog-header">
                    <h3>${type === 'BTC' ? 'Bitcoin' : type === 'ETH' ? 'Ethereum' : type === 'DOGE' ? 'Dogecoin' : 'Ripple'}</h3>
                    <button class="finance-dialog-close">&times;</button>
                </div>
                <div class="finance-dialog-body">
                    <div class="finance-item crypto-item large" data-crypto="${type}">
                        <span class="finance-icon">${getCryptoIcon(type)}</span>
                        <span class="finance-value">${formatCrypto(cryptoValue, type)}</span>
                        <span class="finance-price">${formatCryptoPrice(cryptoPrice, type)}</span>
                    </div>
                    <div class="crypto-details">
                        <p>Aktuální cena: <strong>${formatCryptoPrice(cryptoPrice, type)}</strong></p>
                        <p>Hodnota v Kč: <strong>${formatMoney(Math.round(cryptoValue * cryptoPrice * 22.5))}</strong></p>
                        <p>Změna za 24h: <strong>${Math.floor(Math.random() * 20) - 10}%</strong></p>
                    </div>
                </div>
            `;
        }

        dialog.innerHTML = dialogContent;

        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);

        // Přidání event listenerů
        const closeButton = dialog.querySelector('.finance-dialog-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.remove();
            });
        }

        // Přidání CSS stylů
        const financeStyles = document.createElement('style');
        financeStyles.textContent = `
            .finance-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.9);
                color: white;
                border-radius: 15px;
                z-index: 1100;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
                min-width: 400px;
                max-width: 600px;
                overflow: hidden;
                animation: fadeIn 0.3s ease-in-out;
            }

            .finance-dialog-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .finance-dialog-header h3 {
                margin: 0;
                font-size: 22px;
                font-weight: bold;
            }

            .finance-dialog-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }

            .finance-dialog-close:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .finance-dialog-body {
                padding: 20px;
                max-height: 70vh;
                overflow-y: auto;
            }

            .finance-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                margin-bottom: 15px;
                font-size: 20px;
            }

            .finance-item.large {
                font-size: 24px;
                padding: 20px;
            }

            .finance-icon {
                font-size: 1.8em;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                margin-right: 15px;
            }

            .finance-value {
                font-size: 1.2em;
                font-weight: bold;
                flex-grow: 1;
            }

            .finance-price {
                font-size: 1em;
                opacity: 0.9;
                background-color: rgba(255, 255, 255, 0.1);
                padding: 8px 12px;
                border-radius: 8px;
                margin-left: 10px;
            }

            .crypto-details {
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                padding: 15px 20px;
                margin-top: 10px;
                font-size: 18px;
            }

            .crypto-details p {
                margin: 10px 0;
            }

            /* Styly pro různé kryptoměny */
            .crypto-item[data-crypto="BTC"] .finance-icon,
            .crypto-item[data-crypto="BTC"] .finance-value {
                color: #f7931a;
            }

            .crypto-item[data-crypto="ETH"] .finance-icon,
            .crypto-item[data-crypto="ETH"] .finance-value {
                color: #627eea;
            }

            .crypto-item[data-crypto="DOGE"] .finance-icon,
            .crypto-item[data-crypto="DOGE"] .finance-value {
                color: #c3a634;
            }

            .crypto-item[data-crypto="XRP"] .finance-icon,
            .crypto-item[data-crypto="XRP"] .finance-value {
                color: #23292f;
            }

            /* Animace */
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }

            /* Tmavý režim */
            body[data-theme="dark"] .finance-dialog {
                background-color: rgba(30, 30, 30, 0.95);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.7);
            }

            body[data-theme="dark"] .finance-item {
                background-color: rgba(255, 255, 255, 0.07);
            }

            body[data-theme="dark"] .crypto-details {
                background-color: rgba(255, 255, 255, 0.07);
            }
        `;

        document.head.appendChild(financeStyles);

        // Odstranění stylů při zavření dialogu
        dialog.addEventListener('remove', () => {
            financeStyles.remove();
        });

        // Přidání XP za zobrazení financí
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(5, 'Kontrola financí');
        }
    },

    // Aktualizace UI podle nastavení
    updateUI() {
        const commandButton = document.getElementById('commandsButton');
        const floatingCommandButton = document.getElementById('floatingCommandsButton');

        if (this.isEnabled) {
            // Zobrazení tlačítek, pokud neexistují, vytvoříme je
            if (!commandButton) {
                this.createCommandButton();
            } else {
                commandButton.style.display = 'flex';
            }

            if (floatingCommandButton) {
                floatingCommandButton.style.display = 'flex';
            }
        } else {
            // Skrytí tlačítek
            if (commandButton) {
                commandButton.style.display = 'none';
            }

            if (floatingCommandButton) {
                floatingCommandButton.style.display = 'none';
            }

            // Skrytí menu, pokud je zobrazeno
            if (this.isVisible) {
                this.toggleCommandsMenu();
            }
        }
    },

    // Povolení/zakázání menu příkazů
    setEnabled(enabled) {
        this.isEnabled = enabled;
        this.updateUI();
    },

    // Zobrazení dialogu pro zaměření speciálních bodů
    showFocusPointDialog() {
        // Speciální body k zaměření
        const specialPoints = [
            { id: 'home', name: 'Domů', description: 'Váš domov', icon: '🏠', lat: 48.8484, lng: 17.1259 },
            { id: 'work', name: 'Práce', description: 'Vaše pracoviště', icon: '💼', lat: 48.8514, lng: 17.1319 },
            { id: 'rent', name: 'Nájem', description: 'Místo pro zaplacení nájmu', icon: '💰', lat: 48.8464, lng: 17.1279 },
            { id: 'alexa', name: 'Alexa', description: 'Noční klub Alexa', icon: '💃', lat: 48.8534, lng: 17.1289 },
            { id: 'hospital', name: 'Nemocnice', description: 'Nemocnice Hodonín', icon: '🏥', lat: 48.8494, lng: 17.1269 },
            { id: 'station', name: 'Nádraží', description: 'Vlakové nádraží Hodonín', icon: '🚂', lat: 48.8504, lng: 17.1299 },
            { id: 'square', name: 'Náměstí', description: 'Masarykovo náměstí', icon: '🎭', lat: 48.8524, lng: 17.1309 },
            { id: 'park', name: 'Park', description: 'Městský park', icon: '🌳', lat: 48.8544, lng: 17.1329 },
            { id: 'shopping', name: 'Nákupní centrum', description: 'Nákupní centrum Hodonín', icon: '🛍️', lat: 48.8554, lng: 17.1339 },
            { id: 'restaurant', name: 'Restaurace', description: 'Restaurace U Zlatého lva', icon: '🍴', lat: 48.8564, lng: 17.1349 }
        ];

        // Odstranění existujícího dialogu, pokud existuje
        const existingDialog = document.querySelector('.focus-point-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'focus-point-dialog';

        // Vytvoření obsahu dialogu
        dialog.innerHTML = `
            <div class="focus-point-header">
                <h3>Zaměřit speciální bod</h3>
                <button class="focus-point-close">&times;</button>
            </div>
            <div class="focus-point-content">
                <div class="focus-point-search">
                    <input type="text" class="focus-point-search-input" placeholder="Hledat bod...">
                </div>
                <div class="focus-point-tabs">
                    <div class="focus-point-tab active" data-tab="predefined">Předdefinované body</div>
                    <div class="focus-point-tab" data-tab="custom">Vlastní adresa</div>
                </div>
                <div class="focus-point-tab-content" id="predefined-tab" style="display: block;">
                    <div class="focus-point-list">
                        ${specialPoints.map(point => `
                            <div class="focus-point-item" data-point-id="${point.id}" data-lat="${point.lat}" data-lng="${point.lng}">
                                <div class="focus-point-icon">${point.icon}</div>
                                <div class="focus-point-info">
                                    <div class="focus-point-name">${point.name}</div>
                                    <div class="focus-point-description">${point.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="focus-point-tab-content" id="custom-tab" style="display: none;">
                    <div class="custom-address-form">
                        <div class="form-group">
                            <label for="address-input">Zadejte adresu:</label>
                            <input type="text" id="address-input" class="address-input" placeholder="např. Masarykovo náměstí 1, Hodonín">
                        </div>
                        <div class="form-group">
                            <button class="search-address-btn">Vyhledat adresu</button>
                        </div>
                        <div class="address-results" style="display: none;">
                            <h4>Výsledky vyhledávání:</h4>
                            <div class="address-results-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů
        const focusPointStyles = document.createElement('style');
        focusPointStyles.textContent = `
            .focus-point-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                z-index: 1100;
                width: 90%;
                max-width: 500px;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                animation: fadeIn 0.3s ease-in-out;
            }

            .focus-point-header {
                background-color: #3498db;
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .focus-point-header h3 {
                margin: 0;
                font-size: 20px;
                font-weight: bold;
            }

            .focus-point-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }

            .focus-point-content {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .focus-point-search {
                margin-bottom: 15px;
            }

            .focus-point-search-input {
                width: 100%;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }

            .focus-point-tabs {
                display: flex;
                margin-bottom: 15px;
                border-bottom: 1px solid #ddd;
            }

            .focus-point-tab {
                padding: 10px 15px;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .focus-point-tab.active {
                border-bottom-color: #3498db;
                font-weight: bold;
            }

            .focus-point-tab:hover {
                background-color: #f8f9fa;
            }

            .focus-point-tab-content {
                margin-bottom: 15px;
            }

            .focus-point-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .custom-address-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .form-group label {
                font-weight: bold;
                color: #555;
            }

            .address-input {
                width: 100%;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 16px;
            }

            .search-address-btn {
                padding: 10px 15px;
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .search-address-btn:hover {
                background-color: #2980b9;
            }

            .address-results {
                margin-top: 15px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 10px;
            }

            .address-results h4 {
                margin-top: 0;
                margin-bottom: 10px;
                font-size: 16px;
            }

            .address-results-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .address-result-item {
                display: flex;
                align-items: center;
                padding: 10px;
                background-color: white;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .address-result-item:hover {
                background-color: #e9ecef;
            }

            .address-result-icon {
                font-size: 20px;
                margin-right: 10px;
            }

            .address-result-info {
                flex: 1;
            }

            .focus-point-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 10px;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .focus-point-item:hover {
                background-color: #e9ecef;
            }

            .focus-point-icon {
                font-size: 24px;
                margin-right: 15px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #e9ecef;
                border-radius: 50%;
            }

            .focus-point-info {
                flex: 1;
            }

            .focus-point-name {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 5px;
            }

            .focus-point-description {
                color: #6c757d;
                font-size: 14px;
            }

            /* Tmavý režim */
            body[data-theme="dark"] .focus-point-dialog {
                background-color: #2c3e50;
                color: #ecf0f1;
            }

            body[data-theme="dark"] .focus-point-header {
                background-color: #2980b9;
            }

            body[data-theme="dark"] .focus-point-search-input {
                background-color: #34495e;
                border-color: #2c3e50;
                color: #ecf0f1;
            }

            body[data-theme="dark"] .focus-point-item {
                background-color: #34495e;
            }

            body[data-theme="dark"] .focus-point-item:hover {
                background-color: #2c3e50;
            }

            body[data-theme="dark"] .focus-point-icon {
                background-color: #2c3e50;
            }

            body[data-theme="dark"] .focus-point-name {
                color: #ecf0f1;
            }

            body[data-theme="dark"] .focus-point-description {
                color: #bdc3c7;
            }

            body[data-theme="dark"] .focus-point-tabs {
                border-bottom-color: #34495e;
            }

            body[data-theme="dark"] .focus-point-tab:hover {
                background-color: #34495e;
            }

            body[data-theme="dark"] .form-group label {
                color: #bdc3c7;
            }

            body[data-theme="dark"] .address-input {
                background-color: #34495e;
                border-color: #2c3e50;
                color: #ecf0f1;
            }

            body[data-theme="dark"] .address-results {
                background-color: #34495e;
            }

            body[data-theme="dark"] .address-result-item {
                background-color: #2c3e50;
            }

            body[data-theme="dark"] .address-result-item:hover {
                background-color: #233140;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
        `;

        document.head.appendChild(focusPointStyles);
        document.body.appendChild(dialog);

        // Přidání event listenerů
        const closeButton = dialog.querySelector('.focus-point-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.remove();
                focusPointStyles.remove();
            });
        }

        // Přidání event listenerů pro přepínání záložek
        const tabs = dialog.querySelectorAll('.focus-point-tab');
        const tabContents = dialog.querySelectorAll('.focus-point-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech záložek
                tabs.forEach(t => t.classList.remove('active'));

                // Přidání aktivní třídy na kliknutou záložku
                tab.classList.add('active');

                // Skrytí všech obsahů záložek
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });

                // Zobrazení obsahu vybrané záložky
                const tabId = tab.dataset.tab;
                const tabContent = dialog.querySelector(`#${tabId}-tab`);
                if (tabContent) {
                    tabContent.style.display = 'block';
                }
            });
        });

        // Přidání event listenerů pro vyhledávání
        const searchInput = dialog.querySelector('.focus-point-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchText = e.target.value.toLowerCase();
                const pointItems = dialog.querySelectorAll('.focus-point-item');

                pointItems.forEach(item => {
                    const name = item.querySelector('.focus-point-name').textContent.toLowerCase();
                    const description = item.querySelector('.focus-point-description').textContent.toLowerCase();

                    if (name.includes(searchText) || description.includes(searchText)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        // Přidání event listenerů pro vyhledávání adres
        const addressInput = dialog.querySelector('.address-input');
        const searchAddressBtn = dialog.querySelector('.search-address-btn');
        const addressResults = dialog.querySelector('.address-results');
        const addressResultsList = dialog.querySelector('.address-results-list');

        if (searchAddressBtn && addressInput) {
            searchAddressBtn.addEventListener('click', () => {
                const address = addressInput.value.trim();

                if (!address) {
                    if (typeof addMessage !== 'undefined') {
                        addMessage('Zadejte adresu pro vyhledání.', false);
                    }
                    return;
                }

                // Zobrazení zprávy o vyhledávání
                if (typeof addMessage !== 'undefined') {
                    addMessage(`Vyhledávám adresu: ${address}...`, false);
                }

                // Simulace vyhledávání adres (v reálné aplikaci by zde byl API požadavek na geocoding službu)
                setTimeout(() => {
                    // Simulace výsledků vyhledávání
                    const results = [
                        { address: `${address}, Hodonín`, lat: 48.8484 + Math.random() * 0.01, lng: 17.1259 + Math.random() * 0.01 },
                        { address: `${address}, Brno`, lat: 49.1951 + Math.random() * 0.01, lng: 16.6068 + Math.random() * 0.01 },
                        { address: `${address}, Praha`, lat: 50.0755 + Math.random() * 0.01, lng: 14.4378 + Math.random() * 0.01 }
                    ];

                    // Zobrazení výsledků
                    addressResults.style.display = 'block';
                    addressResultsList.innerHTML = '';

                    results.forEach(result => {
                        const resultItem = document.createElement('div');
                        resultItem.className = 'address-result-item';
                        resultItem.innerHTML = `
                            <div class="address-result-icon">📍</div>
                            <div class="address-result-info">${result.address}</div>
                        `;

                        // Přidání event listeneru pro kliknutí na výsledek
                        resultItem.addEventListener('click', () => {
                            // Zavření dialogu
                            dialog.remove();
                            focusPointStyles.remove();

                            // Zaměření bodu na mapě
                            this.focusPointOnMap('custom', result.lat, result.lng, result.address);
                        });

                        addressResultsList.appendChild(resultItem);
                    });

                    // Zobrazení zprávy o dokončení vyhledávání
                    if (typeof addMessage !== 'undefined') {
                        addMessage(`Nalezeno ${results.length} výsledků pro adresu: ${address}`, false);
                    }
                }, 1000);
            });

            // Přidání event listeneru pro stisknutí klávesy Enter v poli pro adresu
            addressInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    searchAddressBtn.click();
                }
            });
        }

        // Přidání event listenerů pro kliknutí na bod
        const pointItems = dialog.querySelectorAll('.focus-point-item');
        pointItems.forEach(item => {
            item.addEventListener('click', () => {
                const pointId = item.dataset.pointId;
                const lat = parseFloat(item.dataset.lat);
                const lng = parseFloat(item.dataset.lng);

                // Zavření dialogu
                dialog.remove();
                focusPointStyles.remove();

                // Zaměření bodu na mapě
                this.focusPointOnMap(pointId, lat, lng);
            });
        });
    },

    // Zaměření bodu na mapě
    focusPointOnMap(pointId, lat, lng, customAddress) {
        // Kontrola, zda existuje korekce pro tento bod v localStorage
        const pointCorrections = JSON.parse(localStorage.getItem('pointCorrections')) || {};
        const pointKey = pointId === 'custom' ? customAddress : pointId;

        // Pokud existuje korekce, použijeme ji
        if (pointCorrections[pointKey]) {
            const correction = pointCorrections[pointKey];
            lat = correction.lat;
            lng = correction.lng;

            if (typeof addMessage !== 'undefined') {
                if (pointId === 'custom' && customAddress) {
                    addMessage(`Zaměřuji opravenou adresu: ${customAddress}...`, false);
                } else {
                    addMessage(`Zaměřuji opravený bod: ${pointId}...`, false);
                }
            }
        } else {
            if (typeof addMessage !== 'undefined') {
                if (pointId === 'custom' && customAddress) {
                    addMessage(`Zaměřuji adresu: ${customAddress}...`, false);
                } else {
                    addMessage(`Zaměřuji bod: ${pointId}...`, false);
                }
            }
        }

        // Pokud existuje MapManager, použijeme ho pro zaměření bodu
        if (typeof MapManager !== 'undefined') {
            // Uložení informací o bodu pro případné pozdější korekce
            const pointKey = pointId === 'custom' ? customAddress : pointId;
            MapManager.currentFocusedPoint = {
                id: pointId,
                key: pointKey,
                lat: lat,
                lng: lng,
                address: customAddress
            };

            // Přidání markeru na mapu s možností korekce
            const markerId = MapManager.addMarker({
                lat: lat,
                lng: lng,
                title: pointId === 'custom' && customAddress ? customAddress : pointId,
                icon: pointId === 'custom' ? 'custom' : 'special',
                draggable: true, // Umožní přesunutí markeru
                popupContent: this.createCorrectionPopup(pointId, customAddress)
            });

            // Přidání event listeneru pro přesunutí markeru
            if (typeof MapManager.addMarkerDragEndListener === 'function') {
                MapManager.addMarkerDragEndListener(markerId, (newLat, newLng) => {
                    this.handleMarkerCorrection(pointId, customAddress, newLat, newLng);
                });
            }

            // Zaměření mapy na bod
            MapManager.setView(lat, lng, 16);

            // Automatické ověření správnosti bodu
            this.verifyPointLocation(pointId, customAddress, lat, lng);

            // Přidání XP za použití funkce zaměření bodu
            if (typeof UserProgress !== 'undefined') {
                if (pointId === 'custom' && customAddress) {
                    UserProgress.addXP(15, `Zaměření adresy: ${customAddress}`);
                } else {
                    UserProgress.addXP(10, `Zaměření bodu: ${pointId}`);
                }
            }
        } else {
            // Pokud MapManager neexistuje, použijeme základní funkce pro zaměření bodu
            if (typeof map !== 'undefined') {
                map.setView([lat, lng], 16);

                // Uložení informací o bodu pro případné pozdější korekce
                const pointKey = pointId === 'custom' ? customAddress : pointId;
                this.currentFocusedPoint = {
                    id: pointId,
                    key: pointKey,
                    lat: lat,
                    lng: lng,
                    address: customAddress
                };

                // Přidání markeru na mapu s možností korekce
                if (typeof L !== 'undefined') {
                    const popupContent = this.createCorrectionPopup(pointId, customAddress);

                    const marker = L.marker([lat, lng], { draggable: true }).addTo(map)
                        .bindPopup(popupContent)
                        .openPopup();

                    // Přidání event listeneru pro přesunutí markeru
                    marker.on('dragend', (event) => {
                        const newLat = event.target.getLatLng().lat;
                        const newLng = event.target.getLatLng().lng;
                        this.handleMarkerCorrection(pointId, customAddress, newLat, newLng);
                    });
                }

                // Automatické ověření správnosti bodu
                this.verifyPointLocation(pointId, customAddress, lat, lng);

                // Přidání XP za použití funkce zaměření bodu
                if (typeof UserProgress !== 'undefined') {
                    if (pointId === 'custom' && customAddress) {
                        UserProgress.addXP(15, `Zaměření adresy: ${customAddress}`);
                    } else {
                        UserProgress.addXP(10, `Zaměření bodu: ${pointId}`);
                    }
                }
            } else {
                if (typeof addMessage !== 'undefined') {
                    if (pointId === 'custom' && customAddress) {
                        addMessage(`Adresa ${customAddress} byla zaměřena na souřadnicích [${lat}, ${lng}].`, false);
                        addMessage('Pro korekci polohy bodu použijte příkaz "opravit bod".', false);
                    } else {
                        addMessage(`Bod ${pointId} byl zaměřen na souřadnicích [${lat}, ${lng}].`, false);
                        addMessage('Pro korekci polohy bodu použijte příkaz "opravit bod".', false);
                    }
                }
            }
        }
    },

    // Vytvoření popup okna pro korekci bodu
    createCorrectionPopup(pointId, customAddress) {
        const title = pointId === 'custom' && customAddress ? customAddress : pointId;
        return `
            <div class="correction-popup">
                <h3>${title}</h3>
                <p>Poloha bodu může být nepřesná. Máte několik možností:</p>
                <div class="correction-options">
                    <div class="correction-option">
                        <h4>Ověřit bod</h4>
                        <p>Automaticky ověří a opraví polohu bodu.</p>
                        <button class="correction-verify-btn" onclick="CommandsMenu.verifyAndSavePoint()">Ověřit bod</button>
                    </div>
                    <div class="correction-option">
                        <h4>Ruční korekce</h4>
                        <p>Přetáhněte marker na správnou pozici a uložte korekci.</p>
                        <div class="correction-manual-actions">
                            <button class="correction-save-btn" onclick="CommandsMenu.saveCurrentCorrection()">Uložit korekci</button>
                            <button class="correction-cancel-btn" onclick="CommandsMenu.cancelCorrection()">Zrušit</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Automatické ověření správnosti bodu
    verifyPointLocation(pointId, customAddress, lat, lng) {
        // Simulace ověření správnosti bodu (v reálné aplikaci by zde byl API požadavek na geocoding službu)
        setTimeout(() => {
            // Simulace náhodného výsledku ověření (v 30% případů bude bod nesprávný)
            const isCorrect = Math.random() > 0.3;

            if (!isCorrect) {
                // Simulace správné polohy (malá odchylka od původní polohy)
                const correctLat = lat + (Math.random() * 0.01 - 0.005);
                const correctLng = lng + (Math.random() * 0.01 - 0.005);

                // Zobrazení zprávy o nesprávné poloze
                if (typeof addMessage !== 'undefined') {
                    if (pointId === 'custom' && customAddress) {
                        addMessage(`Upozornění: Adresa ${customAddress} má pravděpodobně nesprávnou polohu.`, false);
                    } else {
                        addMessage(`Upozornění: Bod ${pointId} má pravděpodobně nesprávnou polohu.`, false);
                    }
                    addMessage('Automaticky přesměrovávám na správnou polohu...', false);
                }

                // Automatické přesměrování na správnou polohu
                setTimeout(() => {
                    // Aktualizace polohy markeru
                    if (typeof MapManager !== 'undefined') {
                        // Aktualizace polohy markeru v MapManager
                        MapManager.updateMarkerPosition(correctLat, correctLng);

                        // Zaměření mapy na novou polohu
                        MapManager.setView(correctLat, correctLng, 16);
                    } else if (typeof map !== 'undefined' && typeof L !== 'undefined') {
                        // Aktualizace polohy markeru v Leaflet
                        const markers = document.querySelectorAll('.leaflet-marker-icon');
                        if (markers.length > 0) {
                            const lastMarker = markers[markers.length - 1];
                            const markerId = lastMarker.getAttribute('data-marker-id');
                            if (markerId) {
                                const marker = map._layers[markerId];
                                if (marker) {
                                    marker.setLatLng([correctLat, correctLng]);
                                }
                            }
                        }

                        // Zaměření mapy na novou polohu
                        map.setView([correctLat, correctLng], 16);
                    }

                    // Zobrazení zprávy o přesměrování
                    if (typeof addMessage !== 'undefined') {
                        addMessage('Přesměrováno na správnou polohu. Můžete bod dále upravit přetáhnutím markeru.', false);
                    }

                    // Aktualizace informací o aktuálním bodu
                    if (typeof MapManager !== 'undefined' && MapManager.currentFocusedPoint) {
                        MapManager.currentFocusedPoint.lat = correctLat;
                        MapManager.currentFocusedPoint.lng = correctLng;
                    } else if (this.currentFocusedPoint) {
                        this.currentFocusedPoint.lat = correctLat;
                        this.currentFocusedPoint.lng = correctLng;
                    }
                }, 1500);
            } else {
                // Zobrazení zprávy o správné poloze
                if (typeof addMessage !== 'undefined') {
                    if (pointId === 'custom' && customAddress) {
                        addMessage(`Adresa ${customAddress} má správnou polohu.`, false);
                    } else {
                        addMessage(`Bod ${pointId} má správnou polohu.`, false);
                    }
                }
            }
        }, 2000);
    },

    // Zpracování korekce markeru
    handleMarkerCorrection(pointId, customAddress, newLat, newLng) {
        // Aktualizace informací o aktuálním bodu
        if (typeof MapManager !== 'undefined' && MapManager.currentFocusedPoint) {
            MapManager.currentFocusedPoint.lat = newLat;
            MapManager.currentFocusedPoint.lng = newLng;
        } else if (this.currentFocusedPoint) {
            this.currentFocusedPoint.lat = newLat;
            this.currentFocusedPoint.lng = newLng;
        }

        // Zobrazení zprávy o přesunutí markeru
        if (typeof addMessage !== 'undefined') {
            if (pointId === 'custom' && customAddress) {
                addMessage(`Marker pro adresu ${customAddress} byl přesunut na novou pozici [${newLat.toFixed(6)}, ${newLng.toFixed(6)}].`, false);
            } else {
                addMessage(`Marker pro bod ${pointId} byl přesunut na novou pozici [${newLat.toFixed(6)}, ${newLng.toFixed(6)}].`, false);
            }
            addMessage('Pro uložení korekce klikněte na tlačítko "Uložit korekci" v popup okně markeru.', false);
        }
    },

    // Uložení aktuální korekce
    saveCurrentCorrection() {
        // Získání informací o aktuálním bodu
        const currentPoint = typeof MapManager !== 'undefined' && MapManager.currentFocusedPoint ?
            MapManager.currentFocusedPoint : this.currentFocusedPoint;

        if (!currentPoint) {
            if (typeof addMessage !== 'undefined') {
                addMessage('Chyba: Nelze uložit korekci, protože není vybrán žádný bod.', false);
            }
            return;
        }

        // Získání existujících korekcí z localStorage
        const pointCorrections = JSON.parse(localStorage.getItem('pointCorrections')) || {};

        // Přidání nové korekce
        pointCorrections[currentPoint.key] = {
            lat: currentPoint.lat,
            lng: currentPoint.lng,
            correctedAt: new Date().toISOString()
        };

        // Uložení korekcí do localStorage
        localStorage.setItem('pointCorrections', JSON.stringify(pointCorrections));

        // Zobrazení zprávy o uložení korekce
        if (typeof addMessage !== 'undefined') {
            if (currentPoint.id === 'custom' && currentPoint.address) {
                addMessage(`Korekce pro adresu ${currentPoint.address} byla uložena. Příště budete automaticky přesměrováni na tuto pozici.`, false);
            } else {
                addMessage(`Korekce pro bod ${currentPoint.id} byla uložena. Příště budete automaticky přesměrováni na tuto pozici.`, false);
            }
        }

        // Přidání XP za uložení korekce
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(20, 'Korekce polohy bodu');
        }

        // Zavření popup okna
        if (typeof MapManager !== 'undefined' && typeof MapManager.closePopup === 'function') {
            MapManager.closePopup();
        } else if (typeof map !== 'undefined') {
            map.closePopup();
        }
    },

    // Zrušení korekce
    cancelCorrection() {
        // Získání informací o aktuálním bodu
        const currentPoint = typeof MapManager !== 'undefined' && MapManager.currentFocusedPoint ?
            MapManager.currentFocusedPoint : this.currentFocusedPoint;

        if (!currentPoint) {
            if (typeof addMessage !== 'undefined') {
                addMessage('Chyba: Nelze zrušit korekci, protože není vybrán žádný bod.', false);
            }
            return;
        }

        // Zobrazení zprávy o zrušení korekce
        if (typeof addMessage !== 'undefined') {
            addMessage('Korekce byla zrušena.', false);
        }

        // Zavření popup okna
        if (typeof MapManager !== 'undefined' && typeof MapManager.closePopup === 'function') {
            MapManager.closePopup();
        } else if (typeof map !== 'undefined') {
            map.closePopup();
        }
    },

    // Ověření a automatické uložení bodu
    verifyAndSavePoint() {
        // Získání informací o aktuálním bodu
        const currentPoint = typeof MapManager !== 'undefined' && MapManager.currentFocusedPoint ?
            MapManager.currentFocusedPoint : this.currentFocusedPoint;

        if (!currentPoint) {
            if (typeof addMessage !== 'undefined') {
                addMessage('Chyba: Nelze ověřit bod, protože není vybrán žádný bod.', false);
            }
            return;
        }

        // Zobrazení zprávy o ověřování bodu
        if (typeof addMessage !== 'undefined') {
            if (currentPoint.id === 'custom' && currentPoint.address) {
                addMessage(`Ověřuji adresu: ${currentPoint.address}...`, false);
            } else {
                addMessage(`Ověřuji bod: ${currentPoint.id}...`, false);
            }
        }

        // Zavření popup okna
        if (typeof MapManager !== 'undefined' && typeof MapManager.closePopup === 'function') {
            MapManager.closePopup();
        } else if (typeof map !== 'undefined') {
            map.closePopup();
        }

        // Simulace ověření bodu (v reálné aplikaci by zde byl API požadavek na geocoding službu)
        setTimeout(() => {
            // Simulace správné polohy (malá odchylka od původní polohy)
            const correctLat = currentPoint.lat + (Math.random() * 0.01 - 0.005);
            const correctLng = currentPoint.lng + (Math.random() * 0.01 - 0.005);

            // Aktualizace polohy markeru
            if (typeof MapManager !== 'undefined') {
                // Aktualizace polohy markeru v MapManager
                MapManager.updateMarkerPosition(correctLat, correctLng);

                // Zaměření mapy na novou polohu
                MapManager.setView(correctLat, correctLng, 16);
            } else if (typeof map !== 'undefined' && typeof L !== 'undefined') {
                // Aktualizace polohy markeru v Leaflet
                const markers = document.querySelectorAll('.leaflet-marker-icon');
                if (markers.length > 0) {
                    const lastMarker = markers[markers.length - 1];
                    const markerId = lastMarker.getAttribute('data-marker-id');
                    if (markerId) {
                        const marker = map._layers[markerId];
                        if (marker) {
                            marker.setLatLng([correctLat, correctLng]);
                        }
                    }
                }

                // Zaměření mapy na novou polohu
                map.setView([correctLat, correctLng], 16);
            }

            // Aktualizace informací o aktuálním bodu
            if (typeof MapManager !== 'undefined' && MapManager.currentFocusedPoint) {
                MapManager.currentFocusedPoint.lat = correctLat;
                MapManager.currentFocusedPoint.lng = correctLng;
            } else if (this.currentFocusedPoint) {
                this.currentFocusedPoint.lat = correctLat;
                this.currentFocusedPoint.lng = correctLng;
            }

            // Zobrazení zprávy o ověření bodu
            if (typeof addMessage !== 'undefined') {
                if (currentPoint.id === 'custom' && currentPoint.address) {
                    addMessage(`Adresa ${currentPoint.address} byla ověřena a opravena.`, false);
                } else {
                    addMessage(`Bod ${currentPoint.id} byl ověřen a opraven.`, false);
                }
            }

            // Automatické uložení korekce
            // Získání existujících korekcí z localStorage
            const pointCorrections = JSON.parse(localStorage.getItem('pointCorrections')) || {};

            // Přidání nové korekce
            pointCorrections[currentPoint.key] = {
                lat: correctLat,
                lng: correctLng,
                correctedAt: new Date().toISOString(),
                autoVerified: true
            };

            // Uložení korekcí do localStorage
            localStorage.setItem('pointCorrections', JSON.stringify(pointCorrections));

            // Zobrazení zprávy o uložení korekce
            if (typeof addMessage !== 'undefined') {
                addMessage('Korekce byla automaticky uložena. Příště budete automaticky přesměrováni na tuto pozici.', false);
            }

            // Přidání XP za ověření a uložení korekce
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(25, 'Ověření a korekce polohy bodu');
            }
        }, 2000);
    }
};

// Přidání CSS stylů pro popup okno korekce
const correctionStyles = document.createElement('style');
correctionStyles.textContent = `
    .correction-popup {
        padding: 15px;
        max-width: 350px;
    }

    .correction-popup h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 18px;
        font-weight: bold;
    }

    .correction-popup p {
        margin-bottom: 10px;
        font-size: 14px;
    }

    .correction-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .correction-option {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 12px;
    }

    .correction-option h4 {
        margin-top: 0;
        margin-bottom: 8px;
        font-size: 16px;
        font-weight: bold;
        color: #2c3e50;
    }

    .correction-option p {
        margin-bottom: 12px;
        font-size: 14px;
        color: #7f8c8d;
    }

    .correction-manual-actions {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .correction-verify-btn, .correction-save-btn, .correction-cancel-btn {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .correction-verify-btn {
        background-color: #2ecc71;
        color: white;
        width: 100%;
    }

    .correction-verify-btn:hover {
        background-color: #27ae60;
    }

    .correction-save-btn {
        background-color: #3498db;
        color: white;
    }

    .correction-save-btn:hover {
        background-color: #2980b9;
    }

    .correction-cancel-btn {
        background-color: #e0e0e0;
        color: #333;
    }

    .correction-cancel-btn:hover {
        background-color: #bdc3c7;
    }

    /* Tmavý režim */
    body[data-theme="dark"] .correction-popup {
        color: #ecf0f1;
    }

    body[data-theme="dark"] .correction-option {
        background-color: #34495e;
    }

    body[data-theme="dark"] .correction-option h4 {
        color: #ecf0f1;
    }

    body[data-theme="dark"] .correction-option p {
        color: #bdc3c7;
    }

    body[data-theme="dark"] .correction-verify-btn {
        background-color: #27ae60;
    }

    body[data-theme="dark"] .correction-verify-btn:hover {
        background-color: #219d54;
    }

    body[data-theme="dark"] .correction-save-btn {
        background-color: #2980b9;
    }

    body[data-theme="dark"] .correction-save-btn:hover {
        background-color: #2471a3;
    }

    body[data-theme="dark"] .correction-cancel-btn {
        background-color: #34495e;
        color: #ecf0f1;
    }

    body[data-theme="dark"] .correction-cancel-btn:hover {
        background-color: #2c3e50;
    }
`;
document.head.appendChild(correctionStyles);

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CommandsMenu.init();
});

// Vytvoření a odeslání události o vytvoření plovoucího chatu
document.addEventListener('DOMContentLoaded', () => {
    // Původní funkce pro vytvoření plovoucího chatu
    const originalCreateFloatingChat = window.createFloatingChat;

    if (originalCreateFloatingChat) {
        // Přepsání funkce
        window.createFloatingChat = function() {
            // Volání původní funkce
            originalCreateFloatingChat.apply(this, arguments);

            // Vytvoření a odeslání události
            const event = new CustomEvent('floatingChatCreated');
            document.dispatchEvent(event);
        };
    }
});
