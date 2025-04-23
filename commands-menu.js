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
            if (typeof addMessage !== 'undefined') {
                addMessage('Zobrazuji nabídku aut k prodeji...', false);
                setTimeout(() => {
                    const message = `Nabídka aut k prodeji v Hodoníně:

Škoda Octavia (2018) - 320 000 Kč
Volkswagen Golf (2019) - 350 000 Kč
Hyundai i30 (2020) - 380 000 Kč
Toyota Corolla (2017) - 290 000 Kč

Pro koupi auta použijte příkaz "koupit auto [název]"`;
                    addMessage(message, false);

                    // Přidání XP za zobrazení nabídky aut
                    if (typeof UserProgress !== 'undefined') {
                        UserProgress.addXP(5, 'Prohlížení nabídky aut');
                    }
                }, 1000);
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
                addMessage('Vytvářím trasu do práce...', false);
                setTimeout(() => {
                    const message = `Trasa do práce byla vytvořena.

Vzdálenost: 2.5 km
Čas: 30 minut pěšky / 10 minut autem
Dnešní úkoly:
- Dokončit projekt AI Mapa
- Schůzka s klientem ve 14:00
- Odeslat měsíční report`;
                    addMessage(message, false);

                    // Přidání XP za použití funkce jít do práce
                    if (typeof UserProgress !== 'undefined') {
                        UserProgress.addXP(15, 'Cesta do práce');
                    }
                }, 2000);
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
    }
};

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
