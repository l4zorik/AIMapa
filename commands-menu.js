/**
 * Modul pro menu příkazů vedle chatu
 * Verze 0.2.8.7.4
 */

const CommandsMenu = {
    // Seznam dostupných příkazů
    commands: [
        // Kategorie: Asistenti a služby
        {
            id: 'alexa',
            name: 'Alexa',
            description: 'Aktivuje hlasového asistenta Alexa pro hlasové ovládání aplikace',
            icon: '🎤',
            category: 'assistants',
            examples: ['Alexa', 'Hlasový asistent', 'Hlasové ovládání']
        },
        {
            id: 'opening-hours',
            name: 'Otevírací doba',
            description: 'Zobrazí otevírací dobu obchodů a služeb v okolí',
            icon: '🕐',
            category: 'assistants',
            examples: ['Otevírací doba', 'Kdy má otevřeno', 'Otevíraci doba']
        },
        {
            id: 'job-search',
            name: 'Hledání práce',
            description: 'Zobrazí nabídky práce v okolí s možností reakce',
            icon: '💼',
            category: 'assistants',
            examples: ['Hledání práce', 'Nabídky práce', 'Zaměstnání']
        },
        {
            id: 'go-to-work',
            name: 'Chci jít do práce',
            description: 'Vytvoří trasu do práce a zobrazí úkoly a výdělek',
            icon: '💰',
            category: 'assistants',
            examples: ['Chci jít do práce', 'Jít do práce', 'Pracovat']
        },
        {
            id: 'taxi',
            name: 'Taxi služba',
            description: 'Objednání taxi s výběrem typu vozidla a odhad ceny',
            icon: '🚖',
            category: 'assistants',
            examples: ['Taxi', 'Objednat taxi', 'Odvoz']
        },
        {
            id: 'dentist',
            name: 'Zubař',
            description: 'Vyhledání zubaře v okolí a objednání termínu',
            icon: '🦷',
            category: 'assistants',
            examples: ['Zubař', 'Zubař', 'Zubní lékař']
        },
        {
            id: 'doctor',
            name: 'Lékař',
            description: 'Vyhledání lékaře v okolí a objednání termínu',
            icon: '💉',
            category: 'assistants',
            examples: ['Lékař', 'Doktor', 'Praktický lékař']
        },
        {
            id: 'labor-office',
            name: 'Úřad práce',
            description: 'Informace o úřadu práce, otevírací době a rezervace termínu',
            icon: '🏢',
            category: 'assistants',
            examples: ['Úřad práce', 'Pracovní úřad', 'Evidence uchazečů']
        },
        {
            id: 'rap-action',
            name: 'Rapové akce',
            description: 'Zobrazí seznam rapových akcí v okolí a možnost rezervace vstupenek',
            icon: '🎤',
            category: 'assistants',
            examples: ['Rap', 'Rapové akce', 'Hip hop koncerty']
        },

        // Kategorie: Nákupy
        {
            id: 'energy-drinks',
            name: 'Energetické nápoje',
            description: 'Zobrazí nabídku nejlepších energetických nápojů s možností objednávky',
            icon: '⚡',
            category: 'shopping',
            examples: ['Energeťáky', 'Energy drinky', 'Energetické nápoje']
        },
        {
            id: 'krkovicka',
            name: 'Krkovička',
            description: 'Zobrazí nabídku krkovičky a dalších mas s možností objednávky',
            icon: '🥩',
            category: 'shopping',
            examples: ['Krkovička', 'Maso', 'Gril']
        },
        {
            id: 'pizza-delivery',
            name: 'Rozvážka pizzy',
            description: 'Zobrazí nabídku pizzerií v okolí s možností objednávky a doručení',
            icon: '🍕',
            category: 'shopping',
            examples: ['Pizza', 'Rozvážka pizzy', 'Objednat pizzu']
        },
        // Kategorie: Mapové nástroje
        {
            id: 'add-point',
            name: 'Přidat bod',
            description: 'Přidá nový bod na mapu',
            icon: '📍',
            category: 'map-tools',
            examples: ['Přidej bod', 'Nový bod', 'Přidat místo']
        },
        {
            id: 'calculate-route',
            name: 'Vypočítat trasu',
            description: 'Vypočítá trasu mezi body na mapě',
            icon: '🗺️',
            category: 'map-tools',
            examples: ['Vypočítej trasu', 'Najdi cestu', 'Plánovat trasu']
        },
        {
            id: 'clear-map',
            name: 'Vymazat mapu',
            description: 'Odebere všechny body a trasy z mapy',
            icon: '🗑️',
            category: 'map-tools',
            examples: ['Vymaž mapu', 'Smaž vše', 'Vyčisti mapu']
        },
        {
            id: 'measure-distance',
            name: 'Měření vzdálenosti',
            description: 'Nástroj pro měření vzdálenosti mezi body na mapě',
            icon: '📍',
            category: 'map-tools',
            examples: ['Měření', 'Vzdálenost', 'Změřit']
        },
        {
            id: 'share-location',
            name: 'Sdílet polohu',
            description: 'Vytvoří odkaz pro sdílení aktuální polohy nebo trasy',
            icon: '🔗',
            category: 'map-tools',
            examples: ['Sdílet', 'Odkaz', 'Poslat polohu']
        },

        // Kategorie: Zobrazení mapy
        {
            id: 'night-mode',
            name: 'Noční režim',
            description: 'Přepne mapu do nočního režimu s tmavým pozadím a zvýrazněnými cestami',
            icon: '🌙',
            category: 'map-display',
            examples: ['Noční režim', 'Tmavá mapa', 'Noční mapa']
        },
        {
            id: 'fullscreen',
            name: 'Fullscreen režim',
            description: 'Přepne aplikaci do režimu celé obrazovky',
            icon: '⛶',
            category: 'map-display',
            examples: ['Celá obrazovka', 'Fullscreen', 'Maximální zobrazení']
        },
        {
            id: 'globe-mode',
            name: 'Glóbus režim',
            description: 'Přepne mapu do 3D glóbusu',
            icon: '🌎',
            category: 'map-display',
            examples: ['Glóbus', '3D mapa', 'Zobrazit glóbus']
        },

        // Kategorie: Informace a vrstvy
        {
            id: 'weather-overlay',
            name: 'Počasí na mapě',
            description: 'Zobrazí aktuální počasí a předpověď na mapě',
            icon: '☀️',
            category: 'info-layers',
            examples: ['Počasí', 'Předpověď', 'Teplota']
        },
        {
            id: 'points-of-interest',
            name: 'Zajímavá místa',
            description: 'Zobrazí zajímavá místa v okolí - restaurace, hotely, památky',
            icon: '🏰',
            category: 'info-layers',
            examples: ['Zajímavá místa', 'Atrakce', 'Co navštívit']
        },
        {
            id: 'traffic-info',
            name: 'Dopravní situace',
            description: 'Zobrazí aktuální dopravní situaci, zácpy a uzavírky',
            icon: '🚗',
            category: 'info-layers',
            examples: ['Doprava', 'Zácpy', 'Dopravní info']
        },
        {
            id: 'hiking-trails',
            name: 'Turistické trasy',
            description: 'Zobrazí turistické a cyklistické trasy v okolí',
            icon: '🚶',
            category: 'info-layers',
            examples: ['Turistika', 'Cyklotrasy', 'Pěší trasy']
        },

        // Kategorie: Místní informace
        {
            id: 'local-stories',
            name: 'Příběhy z oblasti',
            description: 'Zobrazí zajímavé příběhy a legendy z aktuální oblasti',
            icon: '📜',
            category: 'local-info',
            examples: ['Příběhy', 'Legendy', 'Historie místa']
        },
        {
            id: 'local-food',
            name: 'Místní speciality',
            description: 'Zobrazí tipy na nejlepší jídlo a pití z aktuální oblasti',
            icon: '🍽️',
            category: 'local-info',
            examples: ['Jídlo', 'Speciality', 'Gastronomie']
        },
        {
            id: 'nearby-shops',
            name: 'Obchody v okolí',
            description: 'Zobrazí obchody v okolí s možností online nákupu',
            icon: '🛍️',
            category: 'local-info',
            examples: ['Obchody', 'Nákupy', 'Kde nakoupit']
        },

        // Kategorie: Nastavení a nápověda
        {
            id: 'premium',
            name: 'Premium verze',
            description: 'Získejte přístup k premium funkcím aplikace',
            icon: '⭐',
            category: 'settings',
            examples: ['Premium', 'Upgrade', 'Rozšířené funkce']
        },
        {
            id: 'settings',
            name: 'Nastavení',
            description: 'Otevře dialog nastavení aplikace',
            icon: '⚙️',
            category: 'settings',
            examples: ['Nastavení', 'Konfigurace', 'Možnosti']
        },
        {
            id: 'help',
            name: 'Nápověda',
            description: 'Zobrazí nápovědu k používání aplikace',
            icon: '❓',
            category: 'settings',
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
        console.log('Vytvářím tlačítko pro menu příkazů...');

        // Kontrola, zda již tlačítko neexistuje
        const existingButton = document.getElementById('commandsButton');
        if (existingButton) {
            console.log('Tlačítko již existuje, přeskakuji vytvoření');
            // Ujistíme se, že tlačítko má správné event listenery
            existingButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('Kliknuto na existující tlačítko menu příkazů');
                this.toggleCommandsMenu();
            });
            return;
        }

        // Vytvoření tlačítka
        const commandsButton = document.createElement('button');
        commandsButton.id = 'commandsButton';
        commandsButton.className = 'commands-button';
        commandsButton.innerHTML = '<i class="icon">📋</i>';
        commandsButton.title = 'Menu příkazů';

        // Přidání tlačítka do chatu - zkusíme více způsobů
        let chatInputFound = false;

        // 1. Zkusíme najít .chat-input v .ai-assistant
        const aiAssistant = document.querySelector('.ai-assistant');
        if (aiAssistant) {
            const chatInput = aiAssistant.querySelector('.chat-input');
            if (chatInput) {
                console.log('Nalezen element .chat-input v .ai-assistant, přidávám tlačítko');
                // Vložíme tlačítko před input pole
                const inputField = chatInput.querySelector('input');
                if (inputField) {
                    chatInput.insertBefore(commandsButton, inputField);
                    console.log('Tlačítko přidáno před input pole');
                } else {
                    chatInput.appendChild(commandsButton);
                    console.log('Input pole nenalezeno, tlačítko přidáno na konec');
                }
                chatInputFound = true;
            }
        }

        // 2. Pokud se nepodařilo najít v .ai-assistant, zkusíme globální vyhledání
        if (!chatInputFound) {
            const chatInputs = document.querySelectorAll('.chat-input');
            if (chatInputs.length > 0) {
                console.log(`Nalezeno ${chatInputs.length} elementů .chat-input, použiji první`);
                const chatInput = chatInputs[0];
                // Vložíme tlačítko před input pole
                const inputField = chatInput.querySelector('input');
                if (inputField) {
                    chatInput.insertBefore(commandsButton, inputField);
                    console.log('Tlačítko přidáno před input pole');
                } else {
                    chatInput.appendChild(commandsButton);
                    console.log('Input pole nenalezeno, tlačítko přidáno na konec');
                }
                chatInputFound = true;
            }
        }

        // 3. Pokud se stále nepodařilo najít, vytvoříme nový .chat-input
        if (!chatInputFound) {
            console.error('Element .chat-input nebyl nalezen!');
            // Záložní řešení - přidáme tlačítko přímo do body
            console.log('Používám záložní řešení - přidávám tlačítko do body');
            const chatInputDiv = document.createElement('div');
            chatInputDiv.className = 'chat-input';
            chatInputDiv.style.position = 'fixed';
            chatInputDiv.style.bottom = '20px';
            chatInputDiv.style.right = '20px';
            chatInputDiv.style.zIndex = '1000';
            chatInputDiv.appendChild(commandsButton);
            document.body.appendChild(chatInputDiv);
        }
    },

    // Vytvoření menu příkazů vedle chatu
    createCommandsMenu() {
        console.log('Vytvářím menu příkazů...');

        // Kontrola, zda již menu neexistuje
        if (document.getElementById('commandsMenu')) {
            console.log('Menu příkazů již existuje, přeskakuji vytvoření');
            return;
        }

        // Vytvoření překrytí
        const overlay = document.createElement('div');
        overlay.id = 'commandsOverlay';
        overlay.className = 'commands-overlay';
        document.body.appendChild(overlay);
        console.log('Překrytí pro menu příkazů vytvořeno');

        // Přidání event listeneru pro zavření menu při kliknutí na překrytí
        overlay.addEventListener('click', () => {
            this.hideCommandsMenu();
        });

        // Vytvoření menu
        const commandsMenu = document.createElement('div');
        commandsMenu.id = 'commandsMenu';
        commandsMenu.className = 'commands-menu';

        // Definice kategorií
        const categories = {
            'assistants': { name: 'Asistenti a služby', icon: '💬' },
            'shopping': { name: 'Nákupy', icon: '🛍️' },
            'map-tools': { name: 'Mapové nástroje', icon: '🗺️' },
            'map-display': { name: 'Zobrazení mapy', icon: '💻' },
            'info-layers': { name: 'Informace a vrstvy', icon: '📈' },
            'local-info': { name: 'Místní informace', icon: '🏠' },
            'settings': { name: 'Nastavení a nápověda', icon: '⚙️' }
        };

        // Seskupení příkazů podle kategorií
        const commandsByCategory = {};
        this.commands.forEach(command => {
            const category = command.category || 'settings';
            if (!commandsByCategory[category]) {
                commandsByCategory[category] = [];
            }
            commandsByCategory[category].push(command);
        });

        // Vytvoření obsahu menu
        commandsMenu.innerHTML = `
            <div class="commands-menu-header">
                <h3>Dostupné příkazy</h3>
                <button class="commands-menu-close">&times;</button>
            </div>
            <div class="commands-menu-search">
                <input type="text" id="commandsSearch" placeholder="Hledat příkazy..." class="commands-search-input">
            </div>
            <div class="commands-menu-body">
                <div class="commands-menu-scroll-container">
                    ${Object.keys(categories).map(categoryId => `
                        <div class="commands-category expanded" data-category="${categoryId}">
                            <div class="commands-category-header">
                                <div class="commands-category-icon">${categories[categoryId].icon}</div>
                                <div class="commands-category-name">${categories[categoryId].name}</div>
                                <div class="commands-category-toggle">▼</div>
                            </div>
                            <div class="commands-list" style="display: flex;">
                                ${(commandsByCategory[categoryId] || []).map(command => `
                                    <div class="command-item" data-command-id="${command.id}" data-category="${categoryId}">
                                        <div class="command-icon">${command.icon}</div>
                                        <div class="command-info">
                                            <div class="command-name">${command.name}</div>
                                            <div class="command-description">${command.description}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Přidání menu do dokumentu - nejprve zkusíme přidat do body
        console.log('Přidávám menu příkazů do dokumentu...');
        document.body.appendChild(commandsMenu);
        console.log('Menu příkazů přidáno do body');

        // Skrytí menu na začátku
        commandsMenu.style.display = 'none';
        console.log('Menu příkazů vytvořeno a skryto');
    },

    // Nastavení event listenerů
    setupEventListeners() {
        console.log('Nastavuji event listenery pro CommandsMenu...');

        // Event listener pro tlačítko menu příkazů
        const commandsButton = document.getElementById('commandsButton');
        if (commandsButton) {
            console.log('Tlačítko menu příkazů nalezeno, přidávám event listener');
            commandsButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                console.log('Kliknuto na tlačítko menu příkazů');
                this.toggleCommandsMenu();
            });
        } else {
            console.error('Tlačítko menu příkazů nebylo nalezeno!');
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

        // Event listener pro přepínání kategorií
        const categoryHeaders = document.querySelectorAll('.commands-category-header');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const category = header.closest('.commands-category');
                const commandsList = category.querySelector('.commands-list');
                const toggle = header.querySelector('.commands-category-toggle');

                // Přepnutí zobrazení seznamu příkazů
                if (commandsList.style.display === 'none') {
                    commandsList.style.display = 'flex';
                    toggle.textContent = '▼'; // ▼ = ▼
                    category.classList.add('expanded');
                } else {
                    commandsList.style.display = 'none';
                    toggle.textContent = '▶'; // ▶ = ▶
                    category.classList.remove('expanded');
                }
            });
        });

        // Event listener pro vyhledávání příkazů
        const searchInput = document.getElementById('commandsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const searchText = searchInput.value.toLowerCase();
                const commandItems = document.querySelectorAll('.command-item');
                const categories = document.querySelectorAll('.commands-category');

                // Pokud je vyhledávací pole prázdné, zobrazit všechny kategorie
                if (searchText === '') {
                    categories.forEach(category => {
                        category.style.display = 'block';
                        const commandsList = category.querySelector('.commands-list');
                        const commandItems = category.querySelectorAll('.command-item');
                        commandItems.forEach(item => item.style.display = 'flex');

                        // Pokud byla kategorie před vyhledáváním rozbalená, zůstane rozbalená
                        if (category.classList.contains('expanded')) {
                            commandsList.style.display = 'flex';
                        } else {
                            commandsList.style.display = 'none';
                        }
                    });
                    return;
                }

                // Vyhledávání příkazů
                let hasVisibleCommands = false;
                categories.forEach(category => {
                    let categoryHasVisibleCommands = false;
                    const commandItems = category.querySelectorAll('.command-item');

                    commandItems.forEach(item => {
                        const commandName = item.querySelector('.command-name').textContent.toLowerCase();
                        const commandDesc = item.querySelector('.command-description').textContent.toLowerCase();

                        if (commandName.includes(searchText) || commandDesc.includes(searchText)) {
                            item.style.display = 'flex';
                            categoryHasVisibleCommands = true;
                            hasVisibleCommands = true;
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    // Zobrazit/skrýt kategorii podle toho, zda obsahuje odpovídající příkazy
                    if (categoryHasVisibleCommands) {
                        category.style.display = 'block';
                        category.querySelector('.commands-list').style.display = 'flex';
                    } else {
                        category.style.display = 'none';
                    }
                });

                // Pokud není nalezen žádný příkaz, zobrazit zprávu
                const noResultsMessage = document.getElementById('noCommandsResults');
                if (!hasVisibleCommands) {
                    if (!noResultsMessage) {
                        const message = document.createElement('div');
                        message.id = 'noCommandsResults';
                        message.className = 'no-commands-results';
                        message.textContent = 'Nebyly nalezeny žádné příkazy';
                        document.querySelector('.commands-menu-body').appendChild(message);
                    }
                } else if (noResultsMessage) {
                    noResultsMessage.remove();
                }
            });
        }

        // Event listenery pro fullscreen režim
        document.addEventListener('fullscreenchange', () => {
            console.log('Fullscreen změna detekovaná');
            // Aktualizace menu příkazů ve fullscreen režimu
            this.updateFullscreenMenu();
        });

        // Sledování změn tříd na body elementu pro detekci fullscreen režimu
        const bodyObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const fullscreenModeAdded = document.body.classList.contains('fullscreen-mode');
                    console.log('Změna tříd na body, fullscreen-mode:', fullscreenModeAdded);
                    this.updateFullscreenMenu();
                }
            });
        });

        bodyObserver.observe(document.body, { attributes: true });
    },

    // Zobrazení/skrytí menu příkazů
    toggleCommandsMenu() {
        console.log('toggleCommandsMenu vyvoláno');
        let commandsMenu = document.getElementById('commandsMenu');

        // Pokud menu neexistuje, vytvoříme ho
        if (!commandsMenu) {
            console.log('Menu příkazů nebylo nalezeno, vytvářím nové');
            this.createCommandsMenu();
            commandsMenu = document.getElementById('commandsMenu');

            if (!commandsMenu) {
                console.error('Nepodařilo se vytvořit menu příkazů!');
                return;
            }
        }

        console.log('Aktuální stav menu:', commandsMenu.style.display);
        if (commandsMenu.style.display === 'none' || commandsMenu.style.display === '') {
            console.log('Zobrazuji menu příkazů');
            this.showCommandsMenu();
        } else {
            console.log('Skrývám menu příkazů');
            this.hideCommandsMenu();
        }
    },

    // Zobrazení menu příkazů
    showCommandsMenu() {
        console.log('showCommandsMenu vyvoláno');
        const commandsMenu = document.getElementById('commandsMenu');
        const overlay = document.getElementById('commandsOverlay');

        if (commandsMenu) {
            // Nejprve nastavíme display: flex, aby menu bylo viditelné
            commandsMenu.style.display = 'flex';
            console.log('Menu příkazů nastaveno na display: flex');

            // Animace zobrazení - přidáme třídu show po krátkém zpoždění
            setTimeout(() => {
                commandsMenu.classList.add('show');
                console.log('Přidána třída show k menu příkazů');

                // Zobrazíme také překrytí
                if (overlay) {
                    overlay.classList.add('show');
                    console.log('Přidána třída show k překrytí');
                }
            }, 10);
        } else {
            console.error('Menu příkazů nebylo nalezeno při pokusu o zobrazení!');
        }
    },

    // Skrytí menu příkazů
    hideCommandsMenu() {
        console.log('hideCommandsMenu vyvoláno');
        const commandsMenu = document.getElementById('commandsMenu');
        const overlay = document.getElementById('commandsOverlay');

        if (commandsMenu) {
            // Nejprve odebrat třídu show pro animaci
            commandsMenu.classList.remove('show');
            console.log('Odebrána třída show z menu příkazů');

            // Skryjeme také překrytí
            if (overlay) {
                overlay.classList.remove('show');
                console.log('Odebrána třída show z překrytí');
            }

            // Skrytí menu po dokončení animace
            setTimeout(() => {
                commandsMenu.style.display = 'none';
                console.log('Menu příkazů nastaveno na display: none');
            }, 300);
        } else {
            console.error('Menu příkazů nebylo nalezeno při pokusu o skrytí!');
        }
    },

    // Aktualizace menu příkazů ve fullscreen režimu
    updateFullscreenMenu() {
        console.log('Aktualizace menu příkazů ve fullscreen režimu');

        // Kontrola, zda jsme ve fullscreen režimu
        const isFullscreen = document.body.classList.contains('fullscreen-mode') || document.fullscreenElement !== null;
        console.log('Fullscreen režim:', isFullscreen);

        const commandsMenu = document.getElementById('commandsMenu');
        const commandsButton = document.getElementById('commandsButton');
        const floatingCommandsButton = document.getElementById('floatingCommandsButton');

        if (!commandsMenu) {
            console.log('Menu příkazů neexistuje, vytvářím nové');
            this.createCommandsMenu();
        }

        if (isFullscreen) {
            console.log('Jsme ve fullscreen režimu, aktualizuji menu');

            // Pokud existuje plovoucí tlačítko, přidáme mu event listener
            if (floatingCommandsButton) {
                console.log('Nalezeno plovoucí tlačítko pro menu příkazů');

                // Odstraníme původní event listenery
                const newBtn = floatingCommandsButton.cloneNode(true);
                floatingCommandsButton.parentNode.replaceChild(newBtn, floatingCommandsButton);

                // Přidáme nový event listener
                newBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('Kliknuto na plovoucí tlačítko menu příkazů');
                    this.toggleCommandsMenu();
                });
            } else {
                console.log('Plovoucí tlačítko pro menu příkazů nebylo nalezeno');
            }
        } else {
            console.log('Nejsme ve fullscreen režimu');
        }
    },

    // Provedení příkazu
    executeCommand(commandId) {
        switch (commandId) {
            case 'alexa':
                this.activateAlexa();
                break;

            case 'opening-hours':
                this.showOpeningHours();
                break;

            case 'job-search':
                this.showJobSearch();
                break;

            case 'go-to-work':
                this.showGoToWork();
                break;

            case 'taxi':
                this.showTaxiService();
                break;

            case 'dentist':
                this.showDentistSearch();
                break;

            case 'doctor':
                this.showDoctorSearch();
                break;

            case 'labor-office':
                this.showLaborOffice();
                break;

            case 'rap-action':
                this.showRapActions();
                break;

            case 'energy-drinks':
                this.showEnergyDrinksShop();
                break;

            case 'krkovicka':
                this.showKrkovickaShop();
                break;

            case 'pizza-delivery':
                this.showPizzaDelivery();
                break;

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

            case 'night-mode':
                this.toggleNightMode();
                break;

            case 'weather-overlay':
                this.toggleWeatherOverlay();
                break;

            case 'points-of-interest':
                this.showPointsOfInterest();
                break;

            case 'measure-distance':
                this.toggleDistanceMeasurement();
                break;

            case 'share-location':
                this.shareLocation();
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

            case 'local-stories':
                this.showLocalStories();
                break;

            case 'local-food':
                this.showLocalFood();
                break;

            case 'nearby-shops':
                this.showNearbyShops();
                break;

            case 'traffic-info':
                this.toggleTrafficInfo();
                break;

            case 'hiking-trails':
                this.toggleHikingTrails();
                break;

            case 'premium':
                this.showPremiumModal();
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

    // Zobrazení otevírací doby
    showOpeningHours() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('openingHoursModal')) {
            return;
        }

        // Vytvoření modalu pro otevírací dobu
        const modal = document.createElement('div');
        modal.id = 'openingHoursModal';
        modal.className = 'opening-hours-modal';
        document.body.appendChild(modal);

        // Definice míst s otevírací dobou
        const places = [
            {
                name: 'Klub Alexa',
                category: 'Zábava',
                address: 'Masarykovo náměstí 25, Hodonín',
                phone: '+420 123 456 789',
                website: 'www.klub-alexa.cz',
                hours: {
                    monday: '20:00 - 04:00',
                    tuesday: '20:00 - 04:00',
                    wednesday: '20:00 - 04:00',
                    thursday: '20:00 - 04:00',
                    friday: '20:00 - 06:00',
                    saturday: '20:00 - 06:00',
                    sunday: 'Zavřeno'
                },
                icon: '🕺'
            },
            {
                name: 'Restaurace U Zlatého lva',
                category: 'Restaurace',
                address: 'Hlavní 42, Hodonín',
                phone: '+420 987 654 321',
                website: 'www.zlatylev.cz',
                hours: {
                    monday: '11:00 - 22:00',
                    tuesday: '11:00 - 22:00',
                    wednesday: '11:00 - 22:00',
                    thursday: '11:00 - 22:00',
                    friday: '11:00 - 23:00',
                    saturday: '12:00 - 23:00',
                    sunday: '12:00 - 21:00'
                },
                icon: '🍽️'
            },
            {
                name: 'Supermarket Globus',
                category: 'Nákupní centrum',
                address: 'Nákupní 123, Hodonín',
                phone: '+420 111 222 333',
                website: 'www.globus.cz',
                hours: {
                    monday: '08:00 - 21:00',
                    tuesday: '08:00 - 21:00',
                    wednesday: '08:00 - 21:00',
                    thursday: '08:00 - 21:00',
                    friday: '08:00 - 21:00',
                    saturday: '08:00 - 21:00',
                    sunday: '08:00 - 20:00'
                },
                icon: '🛍️'
            },
            {
                name: 'Fitness centrum Power',
                category: 'Sport',
                address: 'Sportovní 78, Hodonín',
                phone: '+420 444 555 666',
                website: 'www.powerfit.cz',
                hours: {
                    monday: '06:00 - 22:00',
                    tuesday: '06:00 - 22:00',
                    wednesday: '06:00 - 22:00',
                    thursday: '06:00 - 22:00',
                    friday: '06:00 - 22:00',
                    saturday: '08:00 - 20:00',
                    sunday: '08:00 - 20:00'
                },
                icon: '🏋️'
            },
            {
                name: 'Lékárna U Nemocnice',
                category: 'Zdravotnictví',
                address: 'Nemocniční 15, Hodonín',
                phone: '+420 777 888 999',
                website: 'www.lekarna-nemocnice.cz',
                hours: {
                    monday: '08:00 - 18:00',
                    tuesday: '08:00 - 18:00',
                    wednesday: '08:00 - 18:00',
                    thursday: '08:00 - 18:00',
                    friday: '08:00 - 18:00',
                    saturday: '09:00 - 13:00',
                    sunday: 'Zavřeno'
                },
                icon: '💊'
            },
            {
                name: 'Kavárna Moka',
                category: 'Kavárna',
                address: 'Náměstí 5, Hodonín',
                phone: '+420 333 444 555',
                website: 'www.mokacafe.cz',
                hours: {
                    monday: '08:00 - 20:00',
                    tuesday: '08:00 - 20:00',
                    wednesday: '08:00 - 20:00',
                    thursday: '08:00 - 20:00',
                    friday: '08:00 - 22:00',
                    saturday: '09:00 - 22:00',
                    sunday: '10:00 - 18:00'
                },
                icon: '☕'
            }
        ];

        // Získání aktuálního dne v týdnu
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[new Date().getDay()];

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="opening-hours-modal-content">
                <div class="opening-hours-modal-header">
                    <h2>Otevírací doba</h2>
                    <button class="opening-hours-modal-close">&times;</button>
                </div>
                <div class="opening-hours-modal-search">
                    <input type="text" id="openingHoursSearch" placeholder="Hledat místo..." class="opening-hours-search-input">
                    <div class="opening-hours-filter">
                        <select id="openingHoursFilter" class="opening-hours-filter-select">
                            <option value="all">Všechny kategorie</option>
                            <option value="Zábava">Zábava</option>
                            <option value="Restaurace">Restaurace</option>
                            <option value="Nákupní centrum">Nákupní centra</option>
                            <option value="Sport">Sport</option>
                            <option value="Zdravotnictví">Zdravotnictví</option>
                            <option value="Kavárna">Kavárny</option>
                        </select>
                    </div>
                </div>
                <div class="opening-hours-modal-body">
                    <div class="opening-hours-places">
                        ${places.map(place => `
                            <div class="opening-hours-place" data-category="${place.category}">
                                <div class="opening-hours-place-header">
                                    <div class="opening-hours-place-icon">${place.icon}</div>
                                    <div class="opening-hours-place-name">${place.name}</div>
                                    <div class="opening-hours-place-status ${this.isOpenNow(place.hours) ? 'open' : 'closed'}">
                                        ${this.isOpenNow(place.hours) ? 'Otevřeno' : 'Zavřeno'}
                                    </div>
                                </div>
                                <div class="opening-hours-place-info">
                                    <div class="opening-hours-place-category">${place.category}</div>
                                    <div class="opening-hours-place-address">
                                        <i class="opening-hours-icon">📍</i> ${place.address}
                                    </div>
                                    <div class="opening-hours-place-phone">
                                        <i class="opening-hours-icon">📞</i> ${place.phone}
                                    </div>
                                    <div class="opening-hours-place-website">
                                        <i class="opening-hours-icon">🌐</i> ${place.website}
                                    </div>
                                </div>
                                <div class="opening-hours-place-hours">
                                    <div class="opening-hours-place-hours-header">
                                        <i class="opening-hours-icon">🕐</i> Otevírací doba
                                    </div>
                                    <div class="opening-hours-place-hours-list">
                                        <div class="opening-hours-place-hours-item ${today === 'monday' ? 'today' : ''}">
                                            <div class="opening-hours-day">Pondělí:</div>
                                            <div class="opening-hours-time">${place.hours.monday}</div>
                                        </div>
                                        <div class="opening-hours-place-hours-item ${today === 'tuesday' ? 'today' : ''}">
                                            <div class="opening-hours-day">Úterý:</div>
                                            <div class="opening-hours-time">${place.hours.tuesday}</div>
                                        </div>
                                        <div class="opening-hours-place-hours-item ${today === 'wednesday' ? 'today' : ''}">
                                            <div class="opening-hours-day">Středa:</div>
                                            <div class="opening-hours-time">${place.hours.wednesday}</div>
                                        </div>
                                        <div class="opening-hours-place-hours-item ${today === 'thursday' ? 'today' : ''}">
                                            <div class="opening-hours-day">Čtvrtek:</div>
                                            <div class="opening-hours-time">${place.hours.thursday}</div>
                                        </div>
                                        <div class="opening-hours-place-hours-item ${today === 'friday' ? 'today' : ''}">
                                            <div class="opening-hours-day">Pátek:</div>
                                            <div class="opening-hours-time">${place.hours.friday}</div>
                                        </div>
                                        <div class="opening-hours-place-hours-item ${today === 'saturday' ? 'today' : ''}">
                                            <div class="opening-hours-day">Sobota:</div>
                                            <div class="opening-hours-time">${place.hours.saturday}</div>
                                        </div>
                                        <div class="opening-hours-place-hours-item ${today === 'sunday' ? 'today' : ''}">
                                            <div class="opening-hours-day">Neděle:</div>
                                            <div class="opening-hours-time">${place.hours.sunday}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .opening-hours-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .opening-hours-modal.show {
                opacity: 1;
            }

            .opening-hours-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .opening-hours-modal.show .opening-hours-modal-content {
                transform: scale(1);
            }

            .opening-hours-modal-header {
                background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .opening-hours-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }

            .opening-hours-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .opening-hours-modal-search {
                padding: 15px 20px;
                background-color: rgba(0, 0, 0, 0.1);
                display: flex;
                gap: 10px;
            }

            .opening-hours-search-input {
                flex: 1;
                padding: 10px 15px;
                border: none;
                border-radius: 25px;
                background-color: rgba(255, 255, 255, 0.1);
                color: var(--text-color);
                font-size: 1rem;
            }

            .opening-hours-search-input:focus {
                outline: none;
                background-color: rgba(255, 255, 255, 0.2);
            }

            .opening-hours-filter-select {
                padding: 10px 15px;
                border: none;
                border-radius: 25px;
                background-color: rgba(255, 255, 255, 0.1);
                color: var(--text-color);
                font-size: 1rem;
                cursor: pointer;
            }

            .opening-hours-filter-select:focus {
                outline: none;
                background-color: rgba(255, 255, 255, 0.2);
            }

            .opening-hours-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .opening-hours-places {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 20px;
            }

            .opening-hours-place {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
                overflow: hidden;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .opening-hours-place:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }

            .opening-hours-place-header {
                padding: 15px;
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%);
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .opening-hours-place-icon {
                font-size: 24px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
            }

            .opening-hours-place-name {
                flex: 1;
                font-weight: bold;
                font-size: 1.1rem;
                color: var(--text-color);
            }

            .opening-hours-place-status {
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
            }

            .opening-hours-place-status.open {
                background-color: #4CAF50;
                color: white;
            }

            .opening-hours-place-status.closed {
                background-color: #F44336;
                color: white;
            }

            .opening-hours-place-info {
                padding: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .opening-hours-place-category {
                display: inline-block;
                padding: 3px 8px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                font-size: 0.8rem;
                margin-bottom: 10px;
                color: var(--text-color-dark);
            }

            .opening-hours-place-address,
            .opening-hours-place-phone,
            .opening-hours-place-website {
                margin-bottom: 5px;
                color: var(--text-color-dark);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .opening-hours-icon {
                font-style: normal;
                opacity: 0.7;
            }

            .opening-hours-place-hours {
                padding: 15px;
            }

            .opening-hours-place-hours-header {
                margin-bottom: 10px;
                font-weight: bold;
                color: var(--text-color);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .opening-hours-place-hours-list {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .opening-hours-place-hours-item {
                display: flex;
                justify-content: space-between;
                color: var(--text-color-dark);
                padding: 3px 0;
            }

            .opening-hours-place-hours-item.today {
                background-color: rgba(76, 175, 80, 0.2);
                border-radius: 5px;
                padding: 3px 8px;
                font-weight: bold;
                color: var(--text-color);
            }

            .opening-hours-day {
                flex: 1;
            }

            .opening-hours-time {
                font-weight: bold;
            }

            @media (max-width: 768px) {
                .opening-hours-places {
                    grid-template-columns: 1fr;
                }

                .opening-hours-modal-search {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);

        // Zobrazení modalu s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.opening-hours-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Event listener pro vyhledávání
        const searchInput = document.getElementById('openingHoursSearch');
        const filterSelect = document.getElementById('openingHoursFilter');
        const placeElements = document.querySelectorAll('.opening-hours-place');

        const filterPlaces = () => {
            const searchText = searchInput.value.toLowerCase();
            const filterValue = filterSelect.value;

            placeElements.forEach(place => {
                const placeName = place.querySelector('.opening-hours-place-name').textContent.toLowerCase();
                const placeAddress = place.querySelector('.opening-hours-place-address').textContent.toLowerCase();
                const placeCategory = place.getAttribute('data-category');

                const matchesSearch = placeName.includes(searchText) || placeAddress.includes(searchText);
                const matchesFilter = filterValue === 'all' || placeCategory === filterValue;

                if (matchesSearch && matchesFilter) {
                    place.style.display = 'block';
                } else {
                    place.style.display = 'none';
                }
            });
        };

        searchInput.addEventListener('input', filterPlaces);
        filterSelect.addEventListener('change', filterPlaces);

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });

        // Přidání XP za zobrazení otevírací doby
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Zobrazení otevírací doby', 'assistants');
        }
    },

    // Kontrola, zda je místo aktuálně otevřeno
    isOpenNow(hours) {
        // Získání aktuálního dne a času
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = days[new Date().getDay()];
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Získání otevírací doby pro dnešní den
        const todayHours = hours[today];

        // Pokud je zavřeno, vrátíme false
        if (todayHours === 'Zavřeno') {
            return false;
        }

        // Parsování otevírací doby
        const [openTime, closeTime] = todayHours.split(' - ');
        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);

        // Vytvoření Date objektů pro otevírací a zavírací čas
        const openDate = new Date();
        openDate.setHours(openHour, openMinute, 0, 0);

        const closeDate = new Date();
        closeDate.setHours(closeHour, closeMinute, 0, 0);

        // Pokud je zavírací čas menší než otevírací, znamená to, že zavírá až další den
        if (closeDate < openDate) {
            closeDate.setDate(closeDate.getDate() + 1);
        }

        // Kontrola, zda je aktuální čas mezi otevíracím a zavíracím časem
        return now >= openDate && now <= closeDate;
    },

    // Zobrazení služby taxi
    showTaxiService() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('taxiModal')) {
            return;
        }

        // Vytvoření modalu pro taxi službu
        const modal = document.createElement('div');
        modal.id = 'taxiModal';
        modal.className = 'taxi-modal';
        document.body.appendChild(modal);

        // Definice typů vozidel
        const vehicleTypes = [
            {
                id: 'standard',
                name: 'Standard',
                description: 'Běžné osobní vozidlo pro až 4 osoby',
                icon: '🚕',
                pricePerKm: 20,
                basePrice: 40
            },
            {
                id: 'comfort',
                name: 'Comfort',
                description: 'Pohodlné vozidlo s klimatizací a větším prostorem',
                icon: '🚘',
                pricePerKm: 25,
                basePrice: 50
            },
            {
                id: 'premium',
                name: 'Premium',
                description: 'Luxusní vozidlo s nadstandardními službami',
                icon: '🚙',
                pricePerKm: 35,
                basePrice: 70
            },
            {
                id: 'van',
                name: 'Minivan',
                description: 'Větší vozidlo pro až 8 osob nebo objemná zavazadla',
                icon: '🚜',
                pricePerKm: 30,
                basePrice: 60
            }
        ];

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="taxi-modal-content">
                <div class="taxi-modal-header">
                    <h2>Objednání taxi</h2>
                    <button class="taxi-modal-close">&times;</button>
                </div>
                <div class="taxi-modal-body">
                    <div class="taxi-form">
                        <div class="taxi-form-group">
                            <label for="taxiPickupLocation">Místo vyzvednutí:</label>
                            <input type="text" id="taxiPickupLocation" class="taxi-input" placeholder="Zadejte adresu vyzvednutí" value="Hodonín, náměstí">
                        </div>
                        <div class="taxi-form-group">
                            <label for="taxiDestination">Cíl:</label>
                            <input type="text" id="taxiDestination" class="taxi-input" placeholder="Zadejte cílovou adresu" value="Hodonín, nádraží">
                        </div>
                        <div class="taxi-form-group">
                            <label for="taxiTime">Datum a čas:</label>
                            <input type="datetime-local" id="taxiTime" class="taxi-input">
                        </div>
                        <div class="taxi-form-group">
                            <label for="taxiPassengers">Počet osob:</label>
                            <select id="taxiPassengers" class="taxi-select">
                                <option value="1">1 osoba</option>
                                <option value="2">2 osoby</option>
                                <option value="3">3 osoby</option>
                                <option value="4" selected>4 osoby</option>
                                <option value="5">5 osob</option>
                                <option value="6">6 osob</option>
                                <option value="7">7 osob</option>
                                <option value="8">8 osob</option>
                            </select>
                        </div>
                    </div>

                    <div class="taxi-vehicle-types">
                        <h3>Vyberte typ vozidla:</h3>
                        <div class="taxi-vehicle-list">
                            ${vehicleTypes.map(vehicle => `
                                <div class="taxi-vehicle-item" data-vehicle-id="${vehicle.id}">
                                    <div class="taxi-vehicle-icon">${vehicle.icon}</div>
                                    <div class="taxi-vehicle-info">
                                        <div class="taxi-vehicle-name">${vehicle.name}</div>
                                        <div class="taxi-vehicle-description">${vehicle.description}</div>
                                    </div>
                                    <div class="taxi-vehicle-price">
                                        <div class="taxi-price-estimate">Odhad: <span class="taxi-price-value">150-200 Kč</span></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="taxi-payment-methods">
                        <h3>Způsob platby:</h3>
                        <div class="taxi-payment-options">
                            <label class="taxi-payment-option">
                                <input type="radio" name="taxiPayment" value="cash" checked>
                                <span class="taxi-payment-icon">💵</span>
                                <span class="taxi-payment-label">Hotovost</span>
                            </label>
                            <label class="taxi-payment-option">
                                <input type="radio" name="taxiPayment" value="card">
                                <span class="taxi-payment-icon">💳</span>
                                <span class="taxi-payment-label">Platba kartou</span>
                            </label>
                            <label class="taxi-payment-option">
                                <input type="radio" name="taxiPayment" value="app">
                                <span class="taxi-payment-icon">📱</span>
                                <span class="taxi-payment-label">Platba přes aplikaci</span>
                            </label>
                        </div>
                    </div>

                    <div class="taxi-notes">
                        <label for="taxiNotes">Poznámky pro řidiče:</label>
                        <textarea id="taxiNotes" class="taxi-textarea" placeholder="Např. potřebuji pomoc se zavazadly, mám psa, apod."></textarea>
                    </div>

                    <div class="taxi-actions">
                        <button id="taxiOrderButton" class="taxi-order-button">Objednat taxi</button>
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .taxi-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .taxi-modal.show {
                opacity: 1;
            }

            .taxi-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .taxi-modal.show .taxi-modal-content {
                transform: scale(1);
            }

            .taxi-modal-header {
                background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .taxi-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            .taxi-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .taxi-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .taxi-form {
                margin-bottom: 20px;
            }

            .taxi-form-group {
                margin-bottom: 15px;
            }

            .taxi-form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: var(--text-color);
            }

            .taxi-input, .taxi-select, .taxi-textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 5px;
                background-color: rgba(0, 0, 0, 0.2);
                color: var(--text-color);
                font-size: 1rem;
            }

            .taxi-input:focus, .taxi-select:focus, .taxi-textarea:focus {
                outline: none;
                border-color: #FFC107;
                box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.2);
            }

            .taxi-textarea {
                min-height: 80px;
                resize: vertical;
            }

            .taxi-vehicle-types {
                margin-bottom: 20px;
            }

            .taxi-vehicle-types h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--text-color);
                font-size: 1.1rem;
            }

            .taxi-vehicle-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .taxi-vehicle-item {
                display: flex;
                align-items: center;
                padding: 12px;
                border-radius: 8px;
                background-color: rgba(0, 0, 0, 0.2);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .taxi-vehicle-item:hover {
                background-color: rgba(0, 0, 0, 0.3);
                transform: translateY(-2px);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
            }

            .taxi-vehicle-item.selected {
                background-color: rgba(255, 193, 7, 0.2);
                border: 1px solid #FFC107;
            }

            .taxi-vehicle-icon {
                font-size: 24px;
                margin-right: 15px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
            }

            .taxi-vehicle-info {
                flex: 1;
            }

            .taxi-vehicle-name {
                font-weight: bold;
                margin-bottom: 5px;
                color: var(--text-color);
            }

            .taxi-vehicle-description {
                font-size: 0.9rem;
                color: var(--text-color-dark);
            }

            .taxi-vehicle-price {
                text-align: right;
                padding-left: 10px;
            }

            .taxi-price-estimate {
                font-size: 0.9rem;
                color: var(--text-color-dark);
            }

            .taxi-price-value {
                font-weight: bold;
                color: #FFC107;
            }

            .taxi-payment-methods {
                margin-bottom: 20px;
            }

            .taxi-payment-methods h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--text-color);
                font-size: 1.1rem;
            }

            .taxi-payment-options {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
            }

            .taxi-payment-option {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                border-radius: 5px;
                background-color: rgba(0, 0, 0, 0.2);
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .taxi-payment-option:hover {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .taxi-payment-option input {
                margin-right: 8px;
            }

            .taxi-payment-icon {
                margin-right: 8px;
                font-size: 18px;
            }

            .taxi-payment-label {
                color: var(--text-color);
            }

            .taxi-notes {
                margin-bottom: 20px;
            }

            .taxi-notes label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: var(--text-color);
            }

            .taxi-actions {
                display: flex;
                justify-content: center;
            }

            .taxi-order-button {
                padding: 12px 30px;
                background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(255, 152, 0, 0.3);
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            .taxi-order-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(255, 152, 0, 0.4);
                background: linear-gradient(135deg, #FFD54F 0%, #FFA726 100%);
            }

            @media (max-width: 768px) {
                .taxi-payment-options {
                    flex-direction: column;
                    gap: 10px;
                }
            }
        `;
        document.head.appendChild(style);

        // Zobrazení modalu s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Nastavení výchozího data a času (za 15 minut)
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        const dateTimeString = now.toISOString().slice(0, 16);
        document.getElementById('taxiTime').value = dateTimeString;

        // Přidání event listenerů
        const closeButton = modal.querySelector('.taxi-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Výběr typu vozidla
        const vehicleItems = modal.querySelectorAll('.taxi-vehicle-item');
        vehicleItems.forEach(item => {
            item.addEventListener('click', () => {
                // Odstranění třídy selected ze všech položek
                vehicleItems.forEach(i => i.classList.remove('selected'));

                // Přidání třídy selected na vybranou položku
                item.classList.add('selected');

                // Aktualizace odhadu ceny
                const vehicleId = item.getAttribute('data-vehicle-id');
                const vehicle = vehicleTypes.find(v => v.id === vehicleId);

                if (vehicle) {
                    // Získání vzdálenosti mezi místy (simulace)
                    const distance = Math.floor(Math.random() * 5) + 3; // 3-7 km

                    // Výpočet ceny
                    const minPrice = Math.round((vehicle.basePrice + vehicle.pricePerKm * distance) * 0.9);
                    const maxPrice = Math.round((vehicle.basePrice + vehicle.pricePerKm * distance) * 1.1);

                    // Aktualizace zobrazené ceny
                    const priceElement = item.querySelector('.taxi-price-value');
                    priceElement.textContent = `${minPrice}-${maxPrice} Kč`;
                }
            });
        });

        // Automatický výběr prvního vozidla
        if (vehicleItems.length > 0) {
            vehicleItems[0].click();
        }

        // Objednání taxi
        const orderButton = document.getElementById('taxiOrderButton');
        orderButton.addEventListener('click', () => {
            // Získání hodnot z formuláře
            const pickupLocation = document.getElementById('taxiPickupLocation').value;
            const destination = document.getElementById('taxiDestination').value;
            const time = document.getElementById('taxiTime').value;
            const passengers = document.getElementById('taxiPassengers').value;
            const notes = document.getElementById('taxiNotes').value;
            const paymentMethod = document.querySelector('input[name="taxiPayment"]:checked').value;

            // Získání vybraného vozidla
            const selectedVehicle = document.querySelector('.taxi-vehicle-item.selected');
            const vehicleId = selectedVehicle ? selectedVehicle.getAttribute('data-vehicle-id') : null;

            if (!pickupLocation || !destination || !time || !vehicleId) {
                alert('Vyplňte prosím všechny povinné údaje.');
                return;
            }

            // Simulace objednání taxi
            const vehicle = vehicleTypes.find(v => v.id === vehicleId);
            const vehicleName = vehicle ? vehicle.name : 'Standard';

            // Zobrazení potvrzovací zprávy
            modal.innerHTML = `
                <div class="taxi-modal-content">
                    <div class="taxi-modal-header">
                        <h2>Objednávka potvrzena</h2>
                        <button class="taxi-modal-close">&times;</button>
                    </div>
                    <div class="taxi-modal-body">
                        <div class="taxi-confirmation">
                            <div class="taxi-confirmation-icon">✅</div>
                            <h3>Vaše taxi bylo úspěšně objednáno!</h3>
                            <div class="taxi-confirmation-details">
                                <p><strong>Místo vyzvednutí:</strong> ${pickupLocation}</p>
                                <p><strong>Cíl:</strong> ${destination}</p>
                                <p><strong>Čas:</strong> ${new Date(time).toLocaleString()}</p>
                                <p><strong>Typ vozidla:</strong> ${vehicleName}</p>
                                <p><strong>Počet osob:</strong> ${passengers}</p>
                                <p><strong>Způsob platby:</strong> ${{
                                    'cash': 'Hotovost',
                                    'card': 'Platba kartou',
                                    'app': 'Platba přes aplikaci'
                                }[paymentMethod] || 'Hotovost'}</p>
                                ${notes ? `<p><strong>Poznámky:</strong> ${notes}</p>` : ''}
                            </div>
                            <div class="taxi-confirmation-info">
                                <p>Očekávejte SMS s informacemi o vašem řidiči.</p>
                                <p>Taxi dorazí na místo vyzvednutí v čase: <strong>${new Date(time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong></p>
                            </div>
                            <button class="taxi-close-button">Zavřít</button>
                        </div>
                    </div>
                </div>
            `;

            // Přidání CSS stylů pro potvrzovací zprávu
            const confirmationStyle = `
                .taxi-confirmation {
                    text-align: center;
                    padding: 20px 0;
                }

                .taxi-confirmation-icon {
                    font-size: 48px;
                    margin-bottom: 20px;
                }

                .taxi-confirmation h3 {
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: var(--text-color);
                }

                .taxi-confirmation-details {
                    text-align: left;
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                }

                .taxi-confirmation-details p {
                    margin: 8px 0;
                    color: var(--text-color-dark);
                }

                .taxi-confirmation-info {
                    margin-bottom: 20px;
                    color: var(--text-color-dark);
                }

                .taxi-close-button {
                    padding: 10px 25px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
                }

                .taxi-close-button:hover {
                    background-color: #388E3C;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(76, 175, 80, 0.4);
                }
            `;
            style.textContent += confirmationStyle;

            // Přidání event listenerů pro potvrzovací zprávu
            const newCloseButton = modal.querySelector('.taxi-modal-close');
            const closeConfirmationButton = modal.querySelector('.taxi-close-button');

            const closeModal = () => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            };

            if (newCloseButton) {
                newCloseButton.addEventListener('click', closeModal);
            }

            if (closeConfirmationButton) {
                closeConfirmationButton.addEventListener('click', closeModal);
            }

            // Přidání XP za objednání taxi
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addExperience(10, 'Objednání taxi', 'assistants');
            }
        });

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });

        // Přidání XP za otevření služby taxi
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Zobrazení služby taxi', 'assistants');
        }
    },

    // Vyhledání zubaře
    showDentistSearch() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('dentistModal')) {
            return;
        }

        // Vytvoření modalu pro vyhledání zubaře
        const modal = document.createElement('div');
        modal.id = 'dentistModal';
        modal.className = 'dentist-modal';
        document.body.appendChild(modal);

        // Definice zubařů v okolí
        const dentists = [
            {
                name: 'MUDr. Jana Nováková',
                address: 'Masarykovo náměstí 35, Hodonín',
                phone: '+420 518 123 456',
                rating: 4.8,
                acceptingPatients: true,
                nextAvailable: '2025-05-05T10:00:00'
            },
            {
                name: 'MUDr. Petr Svoboda',
                address: 'Dolní valy 15, Hodonín',
                phone: '+420 518 234 567',
                rating: 4.5,
                acceptingPatients: true,
                nextAvailable: '2025-05-03T14:30:00'
            },
            {
                name: 'MUDr. Lucie Veselá',
                address: 'Nádražní 8, Hodonín',
                phone: '+420 518 345 678',
                rating: 4.9,
                acceptingPatients: false,
                nextAvailable: null
            },
            {
                name: 'MUDr. Martin Horák',
                address: 'Brněnská 55, Hodonín',
                phone: '+420 518 456 789',
                rating: 4.3,
                acceptingPatients: true,
                nextAvailable: '2025-05-10T09:15:00'
            }
        ];

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="dentist-modal-content">
                <div class="dentist-modal-header">
                    <h2>Vyhledání zubaře</h2>
                    <button class="dentist-modal-close">&times;</button>
                </div>
                <div class="dentist-modal-body">
                    <div class="dentist-search">
                        <input type="text" id="dentistSearch" placeholder="Hledat zubaře..." class="dentist-search-input">
                    </div>

                    <div class="dentist-list">
                        ${dentists.map(dentist => `
                            <div class="dentist-item">
                                <div class="dentist-info">
                                    <div class="dentist-name">${dentist.name}</div>
                                    <div class="dentist-address">${dentist.address}</div>
                                    <div class="dentist-phone">${dentist.phone}</div>
                                    <div class="dentist-rating">
                                        ${'⭐'.repeat(Math.floor(dentist.rating))}${dentist.rating % 1 >= 0.5 ? '⭐' : ''}
                                        <span class="dentist-rating-value">${dentist.rating}/5</span>
                                    </div>
                                </div>
                                <div class="dentist-availability">
                                    ${dentist.acceptingPatients ?
                                        `<div class="dentist-status accepting">Přijímá nové pacienty</div>
                                         <button class="dentist-book-button">Objednat se</button>` :
                                        `<div class="dentist-status not-accepting">Nepřijímá nové pacienty</div>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .dentist-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .dentist-modal.show {
                opacity: 1;
            }

            .dentist-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .dentist-modal.show .dentist-modal-content {
                transform: scale(1);
            }

            .dentist-modal-header {
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .dentist-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }

            .dentist-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .dentist-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .dentist-search {
                margin-bottom: 20px;
            }

            .dentist-search-input {
                width: 100%;
                padding: 10px 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 25px;
                background-color: rgba(0, 0, 0, 0.2);
                color: var(--text-color);
                font-size: 1rem;
            }

            .dentist-search-input:focus {
                outline: none;
                border-color: #2196F3;
                box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
            }

            .dentist-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .dentist-item {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .dentist-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }

            .dentist-info {
                flex: 1;
            }

            .dentist-name {
                font-weight: bold;
                font-size: 1.1rem;
                margin-bottom: 5px;
                color: var(--text-color);
            }

            .dentist-address, .dentist-phone {
                color: var(--text-color-dark);
                margin-bottom: 3px;
                font-size: 0.9rem;
            }

            .dentist-rating {
                margin-top: 5px;
                color: #FFC107;
            }

            .dentist-rating-value {
                color: var(--text-color-dark);
                margin-left: 5px;
                font-size: 0.9rem;
            }

            .dentist-availability {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                gap: 10px;
                min-width: 150px;
            }

            .dentist-status {
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                text-align: center;
            }

            .dentist-status.accepting {
                background-color: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
            }

            .dentist-status.not-accepting {
                background-color: rgba(244, 67, 54, 0.2);
                color: #F44336;
            }

            .dentist-book-button {
                padding: 8px 15px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            .dentist-book-button:hover {
                background-color: #1976D2;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);

        // Zobrazení modalu s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.dentist-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Vyhledávání zubařů
        const searchInput = document.getElementById('dentistSearch');
        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.toLowerCase();
            const dentistItems = document.querySelectorAll('.dentist-item');

            dentistItems.forEach(item => {
                const name = item.querySelector('.dentist-name').textContent.toLowerCase();
                const address = item.querySelector('.dentist-address').textContent.toLowerCase();

                if (name.includes(searchText) || address.includes(searchText)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Objednání k zubaři
        const bookButtons = document.querySelectorAll('.dentist-book-button');
        bookButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const dentist = dentists[index];

                // Zobrazení formuláře pro objednání
                modal.querySelector('.dentist-modal-body').innerHTML = `
                    <div class="dentist-booking">
                        <h3>Objednání k zubaři</h3>
                        <div class="dentist-booking-info">
                            <p><strong>Zubař:</strong> ${dentist.name}</p>
                            <p><strong>Adresa:</strong> ${dentist.address}</p>
                            <p><strong>Nejbližší volný termín:</strong> ${new Date(dentist.nextAvailable).toLocaleString()}</p>
                        </div>
                        <div class="dentist-booking-form">
                            <div class="dentist-form-group">
                                <label for="dentistName">Vaše jméno:</label>
                                <input type="text" id="dentistName" class="dentist-input" placeholder="Zadejte vaše jméno">
                            </div>
                            <div class="dentist-form-group">
                                <label for="dentistPhone">Telefon:</label>
                                <input type="text" id="dentistPhone" class="dentist-input" placeholder="Zadejte váš telefon">
                            </div>
                            <div class="dentist-form-group">
                                <label for="dentistReason">Důvod návštěvy:</label>
                                <select id="dentistReason" class="dentist-select">
                                    <option value="checkup">Preventivní prohlídka</option>
                                    <option value="pain">Bolest zubu</option>
                                    <option value="filling">Výplň</option>
                                    <option value="extraction">Vytrhnutí zubu</option>
                                    <option value="other">Jiný důvod</option>
                                </select>
                            </div>
                            <div class="dentist-form-group">
                                <label for="dentistNote">Poznámka:</label>
                                <textarea id="dentistNote" class="dentist-textarea" placeholder="Další informace pro zubaře"></textarea>
                            </div>
                        </div>
                        <div class="dentist-booking-actions">
                            <button id="dentistConfirmButton" class="dentist-confirm-button">Potvrdit objednání</button>
                            <button id="dentistBackButton" class="dentist-back-button">Zpět</button>
                        </div>
                    </div>
                `;

                // Přidání CSS stylů pro formulář
                const bookingStyle = `
                    .dentist-booking {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }

                    .dentist-booking h3 {
                        margin: 0;
                        color: var(--text-color);
                        font-size: 1.3rem;
                    }

                    .dentist-booking-info {
                        background-color: rgba(0, 0, 0, 0.2);
                        border-radius: 8px;
                        padding: 15px;
                    }

                    .dentist-booking-info p {
                        margin: 8px 0;
                        color: var(--text-color-dark);
                    }

                    .dentist-booking-form {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }

                    .dentist-form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                    }

                    .dentist-form-group label {
                        font-weight: bold;
                        color: var(--text-color);
                    }

                    .dentist-input, .dentist-select, .dentist-textarea {
                        padding: 10px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 5px;
                        background-color: rgba(0, 0, 0, 0.2);
                        color: var(--text-color);
                    }

                    .dentist-input:focus, .dentist-select:focus, .dentist-textarea:focus {
                        outline: none;
                        border-color: #2196F3;
                        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
                    }

                    .dentist-textarea {
                        min-height: 80px;
                        resize: vertical;
                    }

                    .dentist-booking-actions {
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        margin-top: 10px;
                    }

                    .dentist-confirm-button {
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.3s ease, transform 0.3s ease;
                    }

                    .dentist-confirm-button:hover {
                        background-color: #388E3C;
                        transform: translateY(-2px);
                    }

                    .dentist-back-button {
                        padding: 10px 20px;
                        background-color: rgba(0, 0, 0, 0.3);
                        color: var(--text-color);
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.3s ease;
                    }

                    .dentist-back-button:hover {
                        background-color: rgba(0, 0, 0, 0.4);
                    }
                `;
                style.textContent += bookingStyle;

                // Přidání event listenerů pro formulář
                const confirmButton = document.getElementById('dentistConfirmButton');
                const backButton = document.getElementById('dentistBackButton');

                confirmButton.addEventListener('click', () => {
                    const name = document.getElementById('dentistName').value;
                    const phone = document.getElementById('dentistPhone').value;

                    if (!name || !phone) {
                        alert('Vyplňte prosím všechny povinné údaje.');
                        return;
                    }

                    // Zobrazení potvrzovací zprávy
                    modal.querySelector('.dentist-modal-body').innerHTML = `
                        <div class="dentist-confirmation">
                            <div class="dentist-confirmation-icon">✅</div>
                            <h3>Objednání bylo úspěšně vytvořeno!</h3>
                            <div class="dentist-confirmation-details">
                                <p><strong>Zubař:</strong> ${dentist.name}</p>
                                <p><strong>Adresa:</strong> ${dentist.address}</p>
                                <p><strong>Termín:</strong> ${new Date(dentist.nextAvailable).toLocaleString()}</p>
                            </div>
                            <p class="dentist-confirmation-message">Na vaše telefonní číslo vám byla odeslána SMS s potvrzením.</p>
                            <button class="dentist-close-button">Zavřít</button>
                        </div>
                    `;

                    // Přidání CSS stylů pro potvrzovací zprávu
                    const confirmationStyle = `
                        .dentist-confirmation {
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 15px;
                        }

                        .dentist-confirmation-icon {
                            font-size: 48px;
                            margin-bottom: 10px;
                        }

                        .dentist-confirmation h3 {
                            margin: 0;
                            color: var(--text-color);
                        }

                        .dentist-confirmation-details {
                            background-color: rgba(0, 0, 0, 0.2);
                            border-radius: 8px;
                            padding: 15px;
                            width: 100%;
                            text-align: left;
                        }

                        .dentist-confirmation-details p {
                            margin: 8px 0;
                            color: var(--text-color-dark);
                        }

                        .dentist-confirmation-message {
                            color: var(--text-color-dark);
                            margin: 10px 0;
                        }

                        .dentist-close-button {
                            padding: 10px 25px;
                            background-color: #2196F3;
                            color: white;
                            border: none;
                            border-radius: 25px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: background-color 0.3s ease, transform 0.3s ease;
                            margin-top: 10px;
                        }

                        .dentist-close-button:hover {
                            background-color: #1976D2;
                            transform: translateY(-2px);
                        }
                    `;
                    style.textContent += confirmationStyle;

                    // Přidání event listeneru pro tlačítko zavřít
                    document.querySelector('.dentist-close-button').addEventListener('click', () => {
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.remove();
                            style.remove();
                        }, 300);
                    });

                    // Přidání XP za objednání k zubaři
                    if (typeof UserProgress !== 'undefined') {
                        UserProgress.addExperience(15, 'Objednání k zubaři', 'assistants');
                    }
                });

                backButton.addEventListener('click', () => {
                    // Návrat na seznam zubařů
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                        style.remove();
                        // Znovu otevřít modal se seznamem zubařů
                        this.showDentistSearch();
                    }, 300);
                });
            });
        });

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });

        // Přidání XP za zobrazení vyhledávání zubaře
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Vyhledávání zubaře', 'assistants');
        }
    },

    // Vyhledání lékaře
    showDoctorSearch() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('doctorModal')) {
            return;
        }

        // Vytvoření modalu pro vyhledání lékaře
        const modal = document.createElement('div');
        modal.id = 'doctorModal';
        modal.className = 'doctor-modal';
        document.body.appendChild(modal);

        // Definice lékařů v okolí
        const doctors = [
            {
                name: 'MUDr. Tomáš Novotný',
                specialization: 'Praktický lékař',
                address: 'Masarykovo náměstí 38, Hodonín',
                phone: '+420 518 321 654',
                rating: 4.7,
                acceptingPatients: true,
                nextAvailable: '2025-05-02T09:30:00'
            },
            {
                name: 'MUDr. Lenka Malá',
                specialization: 'Internista',
                address: 'Dolní valy 18, Hodonín',
                phone: '+420 518 432 765',
                rating: 4.9,
                acceptingPatients: true,
                nextAvailable: '2025-05-04T11:00:00'
            },
            {
                name: 'MUDr. Jiří Svoboda',
                specialization: 'Kardiolog',
                address: 'Nádražní 12, Hodonín',
                phone: '+420 518 543 876',
                rating: 4.8,
                acceptingPatients: false,
                nextAvailable: null
            },
            {
                name: 'MUDr. Hana Procházková',
                specialization: 'Praktický lékař',
                address: 'Brněnská 60, Hodonín',
                phone: '+420 518 654 987',
                rating: 4.5,
                acceptingPatients: true,
                nextAvailable: '2025-05-01T14:15:00'
            }
        ];

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="doctor-modal-content">
                <div class="doctor-modal-header">
                    <h2>Vyhledání lékaře</h2>
                    <button class="doctor-modal-close">&times;</button>
                </div>
                <div class="doctor-modal-body">
                    <div class="doctor-search">
                        <input type="text" id="doctorSearch" placeholder="Hledat lékaře..." class="doctor-search-input">
                        <select id="doctorSpecialization" class="doctor-specialization-select">
                            <option value="all">Všechny specializace</option>
                            <option value="Praktický lékař">Praktický lékař</option>
                            <option value="Internista">Internista</option>
                            <option value="Kardiolog">Kardiolog</option>
                        </select>
                    </div>

                    <div class="doctor-list">
                        ${doctors.map(doctor => `
                            <div class="doctor-item" data-specialization="${doctor.specialization}">
                                <div class="doctor-info">
                                    <div class="doctor-name">${doctor.name}</div>
                                    <div class="doctor-specialization">${doctor.specialization}</div>
                                    <div class="doctor-address">${doctor.address}</div>
                                    <div class="doctor-phone">${doctor.phone}</div>
                                    <div class="doctor-rating">
                                        ${'⭐'.repeat(Math.floor(doctor.rating))}${doctor.rating % 1 >= 0.5 ? '⭐' : ''}
                                        <span class="doctor-rating-value">${doctor.rating}/5</span>
                                    </div>
                                </div>
                                <div class="doctor-availability">
                                    ${doctor.acceptingPatients ?
                                        `<div class="doctor-status accepting">Přijímá nové pacienty</div>
                                         <button class="doctor-book-button">Objednat se</button>` :
                                        `<div class="doctor-status not-accepting">Nepřijímá nové pacienty</div>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .doctor-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .doctor-modal.show {
                opacity: 1;
            }

            .doctor-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .doctor-modal.show .doctor-modal-content {
                transform: scale(1);
            }

            .doctor-modal-header {
                background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .doctor-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }

            .doctor-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .doctor-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .doctor-search {
                margin-bottom: 20px;
                display: flex;
                gap: 10px;
            }

            .doctor-search-input {
                flex: 1;
                padding: 10px 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 25px;
                background-color: rgba(0, 0, 0, 0.2);
                color: var(--text-color);
                font-size: 1rem;
            }

            .doctor-search-input:focus {
                outline: none;
                border-color: #4CAF50;
                box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
            }

            .doctor-specialization-select {
                padding: 10px 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 25px;
                background-color: rgba(0, 0, 0, 0.2);
                color: var(--text-color);
                font-size: 1rem;
                min-width: 180px;
            }

            .doctor-specialization-select:focus {
                outline: none;
                border-color: #4CAF50;
                box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
            }

            .doctor-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .doctor-item {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                padding: 15px;
                display: flex;
                justify-content: space-between;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .doctor-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }

            .doctor-info {
                flex: 1;
            }

            .doctor-name {
                font-weight: bold;
                font-size: 1.1rem;
                margin-bottom: 5px;
                color: var(--text-color);
            }

            .doctor-specialization {
                display: inline-block;
                background-color: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                margin-bottom: 5px;
                font-weight: bold;
            }

            .doctor-address, .doctor-phone {
                color: var(--text-color-dark);
                margin-bottom: 3px;
                font-size: 0.9rem;
            }

            .doctor-rating {
                margin-top: 5px;
                color: #FFC107;
            }

            .doctor-rating-value {
                color: var(--text-color-dark);
                margin-left: 5px;
                font-size: 0.9rem;
            }

            .doctor-availability {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
                gap: 10px;
                min-width: 150px;
            }

            .doctor-status {
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                text-align: center;
            }

            .doctor-status.accepting {
                background-color: rgba(76, 175, 80, 0.2);
                color: #4CAF50;
            }

            .doctor-status.not-accepting {
                background-color: rgba(244, 67, 54, 0.2);
                color: #F44336;
            }

            .doctor-book-button {
                padding: 8px 15px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            .doctor-book-button:hover {
                background-color: #388E3C;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);

        // Zobrazení modalu s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.doctor-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Vyhledávání a filtrování lékařů
        const searchInput = document.getElementById('doctorSearch');
        const specializationSelect = document.getElementById('doctorSpecialization');

        const filterDoctors = () => {
            const searchText = searchInput.value.toLowerCase();
            const specialization = specializationSelect.value;
            const doctorItems = document.querySelectorAll('.doctor-item');

            doctorItems.forEach(item => {
                const name = item.querySelector('.doctor-name').textContent.toLowerCase();
                const address = item.querySelector('.doctor-address').textContent.toLowerCase();
                const doctorSpecialization = item.getAttribute('data-specialization');

                const matchesSearch = name.includes(searchText) || address.includes(searchText);
                const matchesSpecialization = specialization === 'all' || doctorSpecialization === specialization;

                if (matchesSearch && matchesSpecialization) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        };

        searchInput.addEventListener('input', filterDoctors);
        specializationSelect.addEventListener('change', filterDoctors);

        // Objednání k lékaři
        const bookButtons = document.querySelectorAll('.doctor-book-button');
        bookButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const doctor = doctors[index];

                // Zobrazení formuláře pro objednání
                modal.querySelector('.doctor-modal-body').innerHTML = `
                    <div class="doctor-booking">
                        <h3>Objednání k lékaři</h3>
                        <div class="doctor-booking-info">
                            <p><strong>Lékař:</strong> ${doctor.name}</p>
                            <p><strong>Specializace:</strong> ${doctor.specialization}</p>
                            <p><strong>Adresa:</strong> ${doctor.address}</p>
                            <p><strong>Nejbližší volný termín:</strong> ${new Date(doctor.nextAvailable).toLocaleString()}</p>
                        </div>
                        <div class="doctor-booking-form">
                            <div class="doctor-form-group">
                                <label for="doctorPatientName">Vaše jméno:</label>
                                <input type="text" id="doctorPatientName" class="doctor-input" placeholder="Zadejte vaše jméno">
                            </div>
                            <div class="doctor-form-group">
                                <label for="doctorPatientPhone">Telefon:</label>
                                <input type="text" id="doctorPatientPhone" class="doctor-input" placeholder="Zadejte váš telefon">
                            </div>
                            <div class="doctor-form-group">
                                <label for="doctorReason">Důvod návštěvy:</label>
                                <select id="doctorReason" class="doctor-select">
                                    <option value="checkup">Preventivní prohlídka</option>
                                    <option value="illness">Nemoc</option>
                                    <option value="prescription">Předpis léků</option>
                                    <option value="results">Výsledky vyšetření</option>
                                    <option value="other">Jiný důvod</option>
                                </select>
                            </div>
                            <div class="doctor-form-group">
                                <label for="doctorNote">Poznámka:</label>
                                <textarea id="doctorNote" class="doctor-textarea" placeholder="Další informace pro lékaře"></textarea>
                            </div>
                        </div>
                        <div class="doctor-booking-actions">
                            <button id="doctorConfirmButton" class="doctor-confirm-button">Potvrdit objednání</button>
                            <button id="doctorBackButton" class="doctor-back-button">Zpět</button>
                        </div>
                    </div>
                `;

                // Přidání CSS stylů pro formulář
                const bookingStyle = `
                    .doctor-booking {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }

                    .doctor-booking h3 {
                        margin: 0;
                        color: var(--text-color);
                        font-size: 1.3rem;
                    }

                    .doctor-booking-info {
                        background-color: rgba(0, 0, 0, 0.2);
                        border-radius: 8px;
                        padding: 15px;
                    }

                    .doctor-booking-info p {
                        margin: 8px 0;
                        color: var(--text-color-dark);
                    }

                    .doctor-booking-form {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }

                    .doctor-form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                    }

                    .doctor-form-group label {
                        font-weight: bold;
                        color: var(--text-color);
                    }

                    .doctor-input, .doctor-select, .doctor-textarea {
                        padding: 10px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 5px;
                        background-color: rgba(0, 0, 0, 0.2);
                        color: var(--text-color);
                    }

                    .doctor-input:focus, .doctor-select:focus, .doctor-textarea:focus {
                        outline: none;
                        border-color: #4CAF50;
                        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
                    }

                    .doctor-textarea {
                        min-height: 80px;
                        resize: vertical;
                    }

                    .doctor-booking-actions {
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        margin-top: 10px;
                    }

                    .doctor-confirm-button {
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.3s ease, transform 0.3s ease;
                    }

                    .doctor-confirm-button:hover {
                        background-color: #388E3C;
                        transform: translateY(-2px);
                    }

                    .doctor-back-button {
                        padding: 10px 20px;
                        background-color: rgba(0, 0, 0, 0.3);
                        color: var(--text-color);
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.3s ease;
                    }

                    .doctor-back-button:hover {
                        background-color: rgba(0, 0, 0, 0.4);
                    }
                `;
                style.textContent += bookingStyle;

                // Přidání event listenerů pro formulář
                const confirmButton = document.getElementById('doctorConfirmButton');
                const backButton = document.getElementById('doctorBackButton');

                confirmButton.addEventListener('click', () => {
                    const name = document.getElementById('doctorPatientName').value;
                    const phone = document.getElementById('doctorPatientPhone').value;

                    if (!name || !phone) {
                        alert('Vyplňte prosím všechny povinné údaje.');
                        return;
                    }

                    // Zobrazení potvrzovací zprávy
                    modal.querySelector('.doctor-modal-body').innerHTML = `
                        <div class="doctor-confirmation">
                            <div class="doctor-confirmation-icon">✅</div>
                            <h3>Objednání bylo úspěšně vytvořeno!</h3>
                            <div class="doctor-confirmation-details">
                                <p><strong>Lékař:</strong> ${doctor.name}</p>
                                <p><strong>Specializace:</strong> ${doctor.specialization}</p>
                                <p><strong>Adresa:</strong> ${doctor.address}</p>
                                <p><strong>Termín:</strong> ${new Date(doctor.nextAvailable).toLocaleString()}</p>
                            </div>
                            <p class="doctor-confirmation-message">Na vaše telefonní číslo vám byla odeslána SMS s potvrzením.</p>
                            <button class="doctor-close-button">Zavřít</button>
                        </div>
                    `;

                    // Přidání CSS stylů pro potvrzovací zprávu
                    const confirmationStyle = `
                        .doctor-confirmation {
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 15px;
                        }

                        .doctor-confirmation-icon {
                            font-size: 48px;
                            margin-bottom: 10px;
                        }

                        .doctor-confirmation h3 {
                            margin: 0;
                            color: var(--text-color);
                        }

                        .doctor-confirmation-details {
                            background-color: rgba(0, 0, 0, 0.2);
                            border-radius: 8px;
                            padding: 15px;
                            width: 100%;
                            text-align: left;
                        }

                        .doctor-confirmation-details p {
                            margin: 8px 0;
                            color: var(--text-color-dark);
                        }

                        .doctor-confirmation-message {
                            color: var(--text-color-dark);
                            margin: 10px 0;
                        }

                        .doctor-close-button {
                            padding: 10px 25px;
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 25px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: background-color 0.3s ease, transform 0.3s ease;
                            margin-top: 10px;
                        }

                        .doctor-close-button:hover {
                            background-color: #388E3C;
                            transform: translateY(-2px);
                        }
                    `;
                    style.textContent += confirmationStyle;

                    // Přidání event listeneru pro tlačítko zavřít
                    document.querySelector('.doctor-close-button').addEventListener('click', () => {
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.remove();
                            style.remove();
                        }, 300);
                    });

                    // Přidání XP za objednání k lékaři
                    if (typeof UserProgress !== 'undefined') {
                        UserProgress.addExperience(15, 'Objednání k lékaři', 'assistants');
                    }
                });

                backButton.addEventListener('click', () => {
                    // Návrat na seznam lékařů
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                        style.remove();
                        // Znovu otevřít modal se seznamem lékařů
                        this.showDoctorSearch();
                    }, 300);
                });
            });
        });

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });

        // Přidání XP za zobrazení vyhledávání lékaře
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Vyhledávání lékaře', 'assistants');
        }
    },

    // Funkce "Chci jít do práce"
    showGoToWork() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('goToWorkModal')) {
            return;
        }

        // Získání aktuální polohy (simulace)
        const currentLocation = {
            lat: 48.8492,
            lng: 17.1247,
            name: 'Aktuální poloha'
        };

        // Simulace údajů o práci
        const workData = {
            location: {
                lat: 48.8592,
                lng: 17.1347,
                name: 'Firma XYZ'
            },
            tasks: [
                { name: 'Kontrola e-mailů', completed: false, reward: 50 },
                { name: 'Schůzka s klienty', completed: false, reward: 200 },
                { name: 'Aktualizace databáze', completed: false, reward: 150 }
            ],
            balance: 12500
        };

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'goToWorkModal';
        modal.className = 'go-to-work-modal';
        document.body.appendChild(modal);

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="go-to-work-modal-content">
                <div class="go-to-work-modal-header">
                    <h2>Chci jít do práce</h2>
                    <button class="go-to-work-modal-close">&times;</button>
                </div>
                <div class="go-to-work-modal-body">
                    <div class="go-to-work-info">
                        <div class="go-to-work-balance">
                            <div class="go-to-work-balance-label">Zůstatek:</div>
                            <div class="go-to-work-balance-value">${workData.balance} Kč</div>
                        </div>
                        <div class="go-to-work-location">
                            <div class="go-to-work-current-location">
                                <div class="go-to-work-location-icon">📍</div>
                                <div class="go-to-work-location-name">${currentLocation.name}</div>
                            </div>
                            <div class="go-to-work-location-arrow">→</div>
                            <div class="go-to-work-work-location">
                                <div class="go-to-work-location-icon">🏢</div>
                                <div class="go-to-work-location-name">${workData.location.name}</div>
                            </div>
                        </div>
                    </div>

                    <div class="go-to-work-tasks">
                        <h3>Dnešní úkoly</h3>
                        <div class="go-to-work-tasks-list">
                            ${workData.tasks.map((task, index) => `
                                <div class="go-to-work-task" data-task-id="${index}">
                                    <div class="go-to-work-task-checkbox">
                                        <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''}>
                                        <label for="task-${index}"></label>
                                    </div>
                                    <div class="go-to-work-task-name">${task.name}</div>
                                    <div class="go-to-work-task-reward">+${task.reward} Kč</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="go-to-work-actions">
                        <button id="calculateRouteButton" class="go-to-work-route-button">Vypočítat trasu do práce</button>
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .go-to-work-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .go-to-work-modal.show {
                opacity: 1;
            }

            .go-to-work-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .go-to-work-modal.show .go-to-work-modal-content {
                transform: scale(1);
            }

            .go-to-work-modal-header {
                background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .go-to-work-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }

            .go-to-work-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .go-to-work-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .go-to-work-info {
                margin-bottom: 20px;
            }

            .go-to-work-balance {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.2);
                padding: 10px 15px;
                border-radius: 8px;
                margin-bottom: 15px;
            }

            .go-to-work-balance-label {
                font-weight: bold;
                color: var(--text-color);
            }

            .go-to-work-balance-value {
                font-size: 1.2rem;
                font-weight: bold;
                color: #4CAF50;
            }

            .go-to-work-location {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: rgba(0, 0, 0, 0.2);
                padding: 15px;
                border-radius: 8px;
            }

            .go-to-work-current-location,
            .go-to-work-work-location {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .go-to-work-location-icon {
                font-size: 24px;
            }

            .go-to-work-location-name {
                font-weight: bold;
                color: var(--text-color);
            }

            .go-to-work-location-arrow {
                font-size: 24px;
                color: var(--text-color-dark);
            }

            .go-to-work-tasks {
                margin-bottom: 20px;
            }

            .go-to-work-tasks h3 {
                margin-top: 0;
                margin-bottom: 15px;
                color: var(--text-color);
                font-size: 1.2rem;
            }

            .go-to-work-tasks-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .go-to-work-task {
                display: flex;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.2);
                padding: 12px 15px;
                border-radius: 8px;
                transition: background-color 0.3s ease;
            }

            .go-to-work-task:hover {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .go-to-work-task-checkbox {
                margin-right: 15px;
            }

            .go-to-work-task-checkbox input[type="checkbox"] {
                display: none;
            }

            .go-to-work-task-checkbox label {
                display: inline-block;
                width: 20px;
                height: 20px;
                background-color: rgba(255, 255, 255, 0.1);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                cursor: pointer;
                position: relative;
            }

            .go-to-work-task-checkbox input[type="checkbox"]:checked + label::after {
                content: '\2714';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #4CAF50;
                font-size: 14px;
            }

            .go-to-work-task-name {
                flex: 1;
                color: var(--text-color);
            }

            .go-to-work-task-reward {
                font-weight: bold;
                color: #4CAF50;
            }

            .go-to-work-actions {
                display: flex;
                justify-content: center;
            }

            .go-to-work-route-button {
                padding: 12px 25px;
                background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 10px rgba(255, 152, 0, 0.3);
            }

            .go-to-work-route-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 15px rgba(255, 152, 0, 0.4);
            }
        `;
        document.head.appendChild(style);

        // Zobrazení modalu s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.go-to-work-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Event listener pro zaškrtávání úkolů
        const taskCheckboxes = modal.querySelectorAll('.go-to-work-task-checkbox input[type="checkbox"]');
        taskCheckboxes.forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                workData.tasks[index].completed = checkbox.checked;

                // Přidání XP za splnění úkolu
                if (checkbox.checked && typeof UserProgress !== 'undefined') {
                    UserProgress.addExperience(10, `Splnění pracovního úkolu: ${workData.tasks[index].name}`, 'work');
                }
            });
        });

        // Event listener pro tlačítko vypočítat trasu
        const routeButton = document.getElementById('calculateRouteButton');
        routeButton.addEventListener('click', () => {
            // Zavření modalu
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);

            // Simulace vypočtení trasy (v reálné aplikaci by se volala funkce pro vypočtení trasy)
            if (typeof calculateRoute === 'function') {
                // Zde by se volala funkce pro vypočtení trasy mezi aktuální polohou a prací
                console.log('Vypočítávám trasu do práce...');
            }

            // Přidání XP za vyhledání trasy do práce
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addExperience(5, 'Vyhledání trasy do práce', 'work');
            }
        });

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });

        // Přidání XP za zobrazení funkce "Chci jít do práce"
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Zobrazení funkce "Chci jít do práce"', 'work');
        }
    },

    // Zobrazení rapových akcí
    showRapActions() {
        // Jednoduchá implementace - pouze základní modal
        alert('Funkce Rapové akce bude implementována v další verzi.');

        // Přidání XP za zobrazení rapových akcí
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Zobrazení rapových akcí', 'entertainment');
        }
    },

    // Zobrazení nabídek práce
    showJobSearch() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('jobSearchModal')) {
            return;
        }

        // Vytvoření modalu pro nabídky práce
        const modal = document.createElement('div');
        modal.id = 'jobSearchModal';
        modal.className = 'job-search-modal';
        document.body.appendChild(modal);

        // Definice nabídek práce
        const jobOffers = [
            {
                id: 1,
                title: 'Vývojář webových aplikací',
                company: 'TechSolutions s.r.o.',
                location: 'Hodonín',
                salary: '45 000 - 65 000 Kč',
                description: 'Hledáme zkušeného vývojáře webových aplikací se znalostí JavaScript, React a Node.js. Nabízíme práci na zajímavých projektech a flexibilní pracovní dobu.',
                requirements: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git'],
                benefits: ['Flexibilní pracovní doba', 'Home office', 'Stravenky', 'Vzdělávací kurzy', 'Firemní akce']
            },
            {
                id: 2,
                title: 'Marketingový specialista',
                company: 'MarketPro a.s.',
                location: 'Brno',
                salary: '35 000 - 45 000 Kč',
                description: 'Pro naši společnost hledáme marketingového specialistu se zaměřením na digitální marketing. Budete zodpovědný za správu sociálních sítí a PPC kampaní.',
                requirements: ['Zkušenosti s digitálním marketingem', 'Znalost Google Analytics', 'Kreativní myšlení'],
                benefits: ['Mladý kolektiv', 'Firemní notebook', 'Multisport karta', 'Občerstvení na pracovišti']
            },
            {
                id: 3,
                title: 'Skladník',
                company: 'LogiTrans s.r.o.',
                location: 'Hodonín',
                salary: '25 000 - 30 000 Kč',
                description: 'Hledáme skladníka pro naše logistické centrum. Náplň práce zahrnuje příjem a výdej zboží, kontrolu kvality a práci s vysokozdvižným vozíkem.',
                requirements: ['Průkaz na VZV výhodou', 'Fyzická zdatnost', 'Spolehlivost', 'Ochota pracovat na směny'],
                benefits: ['Příspěvek na dopravu', 'Stravenky', 'Stabilní zaměstnání', 'Kvártalní bonusy']
            },
            {
                id: 4,
                title: 'Asistent/ka ředitele',
                company: 'Business Solutions a.s.',
                location: 'Brno',
                salary: '30 000 - 35 000 Kč',
                description: 'Pro našeho klienta hledáme asistenta/ku ředitele. Budete zodpovědný/á za organizaci schůzek, komunikaci s klienty a administrativní podporu.',
                requirements: ['Vynikající organizační schopnosti', 'Znalost MS Office', 'Komunikační dovednosti', 'Angličtina na úrovni B2'],
                benefits: ['5 týdnů dovolené', 'Sick days', 'Jazykové kurzy', 'Mobilní telefon']
            },
            {
                id: 5,
                title: 'Kuchař/ka',
                company: 'Restaurant Grand',
                location: 'Hodonín',
                salary: '28 000 - 35 000 Kč',
                description: 'Do naší restaurace hledáme kuchaře/ku s praxí. Nabízíme práci v příjemném prostředí a možnost profesního růstu.',
                requirements: ['Praxe v oboru min. 2 roky', 'Znalost české i mezinárodní kuchyně', 'Samostatnost', 'Kreativita'],
                benefits: ['Strava zdarma', 'Flexibilní rozvrh směn', 'Profesní vzdělávání', 'Spřátelený kolektiv']
            }
        ];

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="job-search-modal-content">
                <div class="job-search-modal-header">
                    <h2>Nabídky práce</h2>
                    <button class="job-search-modal-close">&times;</button>
                </div>
                <div class="job-search-modal-body">
                    <div class="job-search-filters">
                        <input type="text" id="jobSearchInput" placeholder="Hledat nabídky..." class="job-search-input">
                        <select id="jobLocationFilter" class="job-location-filter">
                            <option value="all">Všechny lokality</option>
                            <option value="Hodonín">Hodonín</option>
                            <option value="Brno">Brno</option>
                        </select>
                    </div>
                    <div class="job-offers-list">
                        ${jobOffers.map(job => `
                            <div class="job-offer-item" data-job-id="${job.id}" data-location="${job.location}">
                                <div class="job-offer-header">
                                    <h3 class="job-title">${job.title}</h3>
                                    <span class="job-salary">${job.salary}</span>
                                </div>
                                <div class="job-company-info">
                                    <span class="job-company">${job.company}</span>
                                    <span class="job-location">${job.location}</span>
                                </div>
                                <div class="job-description">${job.description}</div>
                                <div class="job-requirements">
                                    <h4>Požadavky:</h4>
                                    <ul>
                                        ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="job-benefits">
                                    <h4>Benefity:</h4>
                                    <ul>
                                        ${job.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="job-actions">
                                    <button class="job-apply-btn" data-job-id="${job.id}">Reagovat na nabídku</button>
                                    <button class="job-save-btn" data-job-id="${job.id}">Uložit nabídku</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .job-search-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .job-search-modal.show {
                opacity: 1;
            }

            .job-search-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 80%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .job-search-modal.show .job-search-modal-content {
                transform: scale(1);
            }

            .job-search-modal-header {
                background-color: var(--primary-color);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .job-search-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }

            .job-search-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .job-search-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .job-search-filters {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }

            .job-search-input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 14px;
            }

            .job-location-filter {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 14px;
                min-width: 150px;
            }

            .job-offers-list {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .job-offer-item {
                background-color: var(--card-bg-light);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .job-offer-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }

            .job-offer-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .job-title {
                margin: 0;
                font-size: 1.2rem;
                color: var(--primary-color);
            }

            .job-salary {
                font-weight: bold;
                color: #4CAF50;
            }

            .job-company-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                font-size: 0.9rem;
                color: var(--text-color-secondary);
            }

            .job-description {
                margin-bottom: 15px;
                line-height: 1.5;
            }

            .job-requirements, .job-benefits {
                margin-bottom: 15px;
            }

            .job-requirements h4, .job-benefits h4 {
                margin: 0 0 5px 0;
                font-size: 1rem;
                color: var(--text-color);
            }

            .job-requirements ul, .job-benefits ul {
                margin: 0;
                padding-left: 20px;
            }

            .job-requirements li, .job-benefits li {
                margin-bottom: 3px;
            }

            .job-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }

            .job-apply-btn, .job-save-btn {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s ease;
            }

            .job-apply-btn {
                background-color: var(--primary-color);
                color: white;
            }

            .job-apply-btn:hover {
                background-color: var(--primary-color-dark);
            }

            .job-save-btn {
                background-color: #f0f0f0;
                color: #333;
            }

            .job-save-btn:hover {
                background-color: #e0e0e0;
            }
        `;
        document.head.appendChild(style);

        // Zobrazení modalu s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.job-search-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Filtrování nabídek podle lokality
        const locationFilter = modal.querySelector('#jobLocationFilter');
        locationFilter.addEventListener('change', () => {
            const selectedLocation = locationFilter.value;
            const jobItems = modal.querySelectorAll('.job-offer-item');

            jobItems.forEach(item => {
                const jobLocation = item.getAttribute('data-location');
                if (selectedLocation === 'all' || jobLocation === selectedLocation) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Vyhledávání v nabídkách
        const searchInput = modal.querySelector('#jobSearchInput');
        searchInput.addEventListener('input', () => {
            const searchText = searchInput.value.toLowerCase();
            const jobItems = modal.querySelectorAll('.job-offer-item');

            jobItems.forEach(item => {
                const jobTitle = item.querySelector('.job-title').textContent.toLowerCase();
                const jobCompany = item.querySelector('.job-company').textContent.toLowerCase();
                const jobDescription = item.querySelector('.job-description').textContent.toLowerCase();

                if (jobTitle.includes(searchText) || jobCompany.includes(searchText) || jobDescription.includes(searchText)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });

        // Reakce na nabídku práce
        const applyButtons = modal.querySelectorAll('.job-apply-btn');
        applyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const jobId = button.getAttribute('data-job-id');
                const jobItem = modal.querySelector(`.job-offer-item[data-job-id="${jobId}"]`);
                const jobTitle = jobItem.querySelector('.job-title').textContent;
                const jobCompany = jobItem.querySelector('.job-company').textContent;

                // Zobrazení zprávy o úspěšné reakci
                addMessage(`Reagovali jste na nabídku práce "${jobTitle}" ve společnosti ${jobCompany}. Vaše žádost byla odeslána.`, false);

                // Přidání XP za reakci na nabídku práce
                if (typeof UserProgressExtensions !== 'undefined') {
                    UserProgressExtensions.trackJobSearch('apply', { id: jobId });
                }

                // Zavření modalu
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            });
        });

        // Uložení nabídky práce
        const saveButtons = modal.querySelectorAll('.job-save-btn');
        saveButtons.forEach(button => {
            button.addEventListener('click', () => {
                const jobId = button.getAttribute('data-job-id');
                const jobItem = modal.querySelector(`.job-offer-item[data-job-id="${jobId}"]`);
                const jobTitle = jobItem.querySelector('.job-title').textContent;

                // Zobrazení zprávy o uložení nabídky
                addMessage(`Nabídka práce "${jobTitle}" byla uložena do vašich oblíbených.`, false);

                // Změna textu tlačítka
                button.textContent = 'Uloženo';
                button.disabled = true;
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
            });
        });

        // Přidání XP za zobrazení nabídek práce
        if (typeof UserProgressExtensions !== 'undefined') {
            UserProgressExtensions.trackJobSearch('view');
        }

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });
    },

    // Aktivace hlasového asistenta Alexa
    activateAlexa() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('alexaModal')) {
            return;
        }

        // Vytvoření modalu pro Alexu
        const modal = document.createElement('div');
        modal.id = 'alexaModal';
        modal.className = 'alexa-modal';
        document.body.appendChild(modal);

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="alexa-modal-content">
                <div class="alexa-modal-header">
                    <h2>Alexa - Hlasový asistent</h2>
                    <button class="alexa-modal-close">&times;</button>
                </div>
                <div class="alexa-modal-body">
                    <div class="alexa-icon-container">
                        <div class="alexa-icon">
                            <div class="alexa-ring"></div>
                            <div class="alexa-circle"></div>
                        </div>
                    </div>
                    <div class="alexa-status">Alexa je připravena...</div>
                    <div class="alexa-instructions">
                        <p>Klikněte na ikonu Alexy a začněte mluvit, nebo použijte následující příkazy:</p>
                        <ul class="alexa-commands-list">
                            <li><strong>"Alexa, najdi cestu do Brna"</strong> - vypočítá trasu do Brna</li>
                            <li><strong>"Alexa, přidej bod na mapu"</strong> - přidá nový bod na mapu</li>
                            <li><strong>"Alexa, zobraz počasí"</strong> - zobrazí aktuální počasí</li>
                            <li><strong>"Alexa, zapni noční režim"</strong> - aktivuje noční režim mapy</li>
                            <li><strong>"Alexa, najdi restaurace v okolí"</strong> - zobrazí restaurace v okolí</li>
                        </ul>
                    </div>
                    <div class="alexa-controls">
                        <button class="alexa-start-btn">Aktivovat Alexu</button>
                        <button class="alexa-stop-btn" disabled>Zastavit poslech</button>
                    </div>
                    <div class="alexa-transcript">
                        <h3>Historie příkazů</h3>
                        <div class="alexa-transcript-content"></div>
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .alexa-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .alexa-modal.show {
                opacity: 1;
            }

            .alexa-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .alexa-modal.show .alexa-modal-content {
                transform: scale(1);
            }

            .alexa-modal-header {
                background: linear-gradient(135deg, #00CAFF 0%, #0091FF 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .alexa-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }

            .alexa-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .alexa-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .alexa-icon-container {
                margin: 20px 0;
                cursor: pointer;
            }

            .alexa-icon {
                position: relative;
                width: 100px;
                height: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .alexa-ring {
                position: absolute;
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00CAFF 0%, #0091FF 100%);
                opacity: 0.3;
                transform: scale(0.8);
                transition: transform 0.3s ease, opacity 0.3s ease;
            }

            .alexa-circle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00CAFF 0%, #0091FF 100%);
                z-index: 1;
                transition: transform 0.3s ease;
            }

            .alexa-icon-container:hover .alexa-ring {
                transform: scale(1);
                opacity: 0.5;
            }

            .alexa-icon-container:hover .alexa-circle {
                transform: scale(1.1);
            }

            .alexa-icon-container.listening .alexa-ring {
                animation: pulse 1.5s infinite;
                opacity: 0.7;
            }

            @keyframes pulse {
                0% {
                    transform: scale(0.8);
                    opacity: 0.7;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.5;
                }
                100% {
                    transform: scale(0.8);
                    opacity: 0.7;
                }
            }

            .alexa-status {
                font-size: 1.2rem;
                margin-bottom: 20px;
                color: var(--text-color);
                font-weight: bold;
            }

            .alexa-instructions {
                width: 100%;
                margin-bottom: 20px;
            }

            .alexa-instructions p {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--text-color);
            }

            .alexa-commands-list {
                padding-left: 20px;
                margin: 0;
            }

            .alexa-commands-list li {
                margin-bottom: 8px;
                color: var(--text-color-dark);
            }

            .alexa-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }

            .alexa-start-btn, .alexa-stop-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }

            .alexa-start-btn {
                background: linear-gradient(135deg, #00CAFF 0%, #0091FF 100%);
                color: white;
            }

            .alexa-start-btn:hover {
                background: linear-gradient(135deg, #0091FF 0%, #0078D7 100%);
            }

            .alexa-stop-btn {
                background-color: #f44336;
                color: white;
                opacity: 0.7;
            }

            .alexa-stop-btn:not([disabled]):hover {
                background-color: #d32f2f;
                opacity: 1;
            }

            .alexa-stop-btn[disabled] {
                background-color: #ccc;
                cursor: not-allowed;
                opacity: 0.5;
            }

            .alexa-transcript {
                width: 100%;
                margin-top: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding-top: 20px;
            }

            .alexa-transcript h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--text-color);
                font-size: 1.1rem;
            }

            .alexa-transcript-content {
                max-height: 150px;
                overflow-y: auto;
                padding: 10px;
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 5px;
                color: var(--text-color-dark);
            }

            .alexa-transcript-item {
                margin-bottom: 8px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .alexa-transcript-item:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }

            .alexa-transcript-user {
                color: #00CAFF;
                font-weight: bold;
            }

            .alexa-transcript-response {
                color: #4CAF50;
            }
        `;
        document.head.appendChild(style);

        // Zobrazení modalu s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.alexa-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Simulace funkce hlasového asistenta
        const alexaIcon = modal.querySelector('.alexa-icon-container');
        const alexaStatus = modal.querySelector('.alexa-status');
        const startButton = modal.querySelector('.alexa-start-btn');
        const stopButton = modal.querySelector('.alexa-stop-btn');
        const transcriptContent = modal.querySelector('.alexa-transcript-content');

        // Funkce pro přidání záznamu do historie
        const addTranscriptItem = (text, type) => {
            const item = document.createElement('div');
            item.className = 'alexa-transcript-item';

            if (type === 'user') {
                item.innerHTML = `<span class="alexa-transcript-user">Vy:</span> ${text}`;
            } else if (type === 'response') {
                item.innerHTML = `<span class="alexa-transcript-response">Alexa:</span> ${text}`;
            } else {
                item.textContent = text;
            }

            transcriptContent.appendChild(item);
            transcriptContent.scrollTop = transcriptContent.scrollHeight;
        };

        // Funkce pro zpracování příkazu
        const processCommand = (command) => {
            // Přidání příkazu do historie
            addTranscriptItem(command, 'user');

            // Simulace zpracování příkazu
            setTimeout(() => {
                let response = '';
                let action = null;

                // Rozpoznání příkazu
                if (command.toLowerCase().includes('najdi cestu') || command.toLowerCase().includes('trasa')) {
                    const destination = command.toLowerCase().includes('do ') ?
                        command.split('do ')[1].split(' ')[0] : 'cíle';
                    response = `Vypočítávám trasu do ${destination}...`;
                    action = () => {
                        if (typeof calculateRoute === 'function') {
                            calculateRoute();
                        }
                    };
                } else if (command.toLowerCase().includes('přidej bod')) {
                    response = 'Přidávám nový bod na mapu...';
                    action = () => {
                        if (typeof addActivity === 'function') {
                            addActivity();
                        }
                    };
                } else if (command.toLowerCase().includes('počasí')) {
                    response = 'Zobrazuji aktuální počasí...';
                    action = () => {
                        if (typeof CommandsMenu.toggleWeatherOverlay === 'function') {
                            CommandsMenu.toggleWeatherOverlay();
                        }
                    };
                } else if (command.toLowerCase().includes('noční režim')) {
                    response = 'Aktivuji noční režim mapy...';
                    action = () => {
                        if (typeof CommandsMenu.toggleNightMode === 'function') {
                            CommandsMenu.toggleNightMode();
                        }
                    };
                } else if (command.toLowerCase().includes('restaurace') || command.toLowerCase().includes('jídlo')) {
                    response = 'Hledám restaurace v okolí...';
                    action = () => {
                        if (typeof CommandsMenu.showLocalFood === 'function') {
                            CommandsMenu.showLocalFood();
                        }
                    };
                } else {
                    response = 'Omlouvám se, tomuto příkazu nerozumím. Zkuste některý z příkazů ze seznamu.';
                }

                // Přidání odpovědi do historie
                addTranscriptItem(response, 'response');

                // Provedení akce, pokud existuje
                if (action) {
                    setTimeout(action, 1000);
                }

                // Přidání XP za použití Alexy
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addExperience(5, 'Použití hlasového asistenta Alexa', 'assistants');
                }
            }, 1500);
        };

        // Simulace rozpoznávání řeči
        let isListening = false;
        let recognitionTimeout;

        const startListening = () => {
            isListening = true;
            alexaIcon.classList.add('listening');
            alexaStatus.textContent = 'Poslouchám...';
            startButton.disabled = true;
            stopButton.disabled = false;

            // Simulace ukončení poslechu po 10 sekundách
            recognitionTimeout = setTimeout(() => {
                stopListening();
                alexaStatus.textContent = 'Čas vypršel. Zkuste to znovu.';
            }, 10000);
        };

        const stopListening = () => {
            isListening = false;
            alexaIcon.classList.remove('listening');
            alexaStatus.textContent = 'Alexa je připravena...';
            startButton.disabled = false;
            stopButton.disabled = true;

            clearTimeout(recognitionTimeout);
        };

        // Event listenery pro tlačítka
        startButton.addEventListener('click', () => {
            startListening();

            // Simulace rozpoznání řeči po 3 sekundách
            setTimeout(() => {
                if (isListening) {
                    stopListening();

                    // Náhodný výběr příkazu pro simulaci
                    const commands = [
                        'Alexa, najdi cestu do Brna',
                        'Alexa, přidej bod na mapu',
                        'Alexa, zobraz počasí',
                        'Alexa, zapni noční režim',
                        'Alexa, najdi restaurace v okolí'
                    ];
                    const randomCommand = commands[Math.floor(Math.random() * commands.length)];

                    alexaStatus.textContent = `Rozpoznáno: "${randomCommand}"`;
                    processCommand(randomCommand);
                }
            }, 3000);
        });

        stopButton.addEventListener('click', stopListening);

        alexaIcon.addEventListener('click', () => {
            if (!isListening) {
                startListening();

                // Simulace rozpoznání řeči po 3 sekundách
                setTimeout(() => {
                    if (isListening) {
                        stopListening();

                        // Náhodný výběr příkazu pro simulaci
                        const commands = [
                            'Alexa, najdi cestu do Brna',
                            'Alexa, přidej bod na mapu',
                            'Alexa, zobraz počasí',
                            'Alexa, zapni noční režim',
                            'Alexa, najdi restaurace v okolí'
                        ];
                        const randomCommand = commands[Math.floor(Math.random() * commands.length)];

                        alexaStatus.textContent = `Rozpoznáno: "${randomCommand}"`;
                        processCommand(randomCommand);
                    }
                }, 3000);
            } else {
                stopListening();
            }
        });

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });

        // Přidání XP za otevření Alexy
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Otevření hlasového asistenta Alexa', 'assistants');
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

    // Přepnutí vrstvy s počasím
    toggleWeatherOverlay() {
        // Kontrola, zda je vrstva s počasím aktivní
        if (this.weatherLayer) {
            // Odstranění vrstvy s počasím
            map.removeLayer(this.weatherLayer);
            this.weatherLayer = null;

            // Odstranění widgetu s počasím
            const weatherWidget = document.getElementById('weatherWidget');
            if (weatherWidget) {
                weatherWidget.remove();
            }

            // Zobrazení informace o vypnutí vrstvy s počasím
            addMessage('Vrstva s počasím byla vypnuta.', false);
        } else {
            // Zobrazení informace o načítání dat o počasí
            addMessage('Načítám data o počasí...', false);

            // Získání aktuální polohy
            const center = map.getCenter();

            // Vytvoření URL pro API požadavek
            const apiKey = '9de243494c0b295cca9337e1e96b00e2'; // Veřejný API klíč pro demonstrační účely
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${center.lat}&lon=${center.lng}&units=metric&appid=${apiKey}`;

            // Odeslání požadavku
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Přidání vrstvy s počasím
                    this.weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
                        maxZoom: 18,
                        opacity: 0.7
                    }).addTo(map);

                    // Vytvoření widgetu s počasím
                    this.createWeatherWidget(data);

                    // Zobrazení informace o počasí v chatu
                    this.displayWeatherInfo(data);
                })
                .catch(error => {
                    console.error('Chyba při získávání dat o počasí:', error);
                    addMessage('Nepodařilo se získat data o počasí. Zkuste to prosím znovu.', false);
                });
        }
    },

    // Vytvoření widgetu s počasím
    createWeatherWidget(weatherData) {
        // Kontrola dat
        if (!weatherData || !weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
            return;
        }

        // Odstranění existujícího widgetu
        const existingWidget = document.getElementById('weatherWidget');
        if (existingWidget) {
            existingWidget.remove();
        }

        // Vytvoření widgetu
        const widget = document.createElement('div');
        widget.id = 'weatherWidget';
        widget.className = 'weather-widget';

        // Získání ikony počasí
        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Formátování dat
        const temp = Math.round(weatherData.main.temp);
        const feelsLike = Math.round(weatherData.main.feels_like);
        const description = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const windSpeed = Math.round(weatherData.wind.speed * 3.6); // m/s na km/h
        const pressure = weatherData.main.pressure;
        const cityName = weatherData.name;

        // Vytvoření obsahu widgetu
        widget.innerHTML = `
            <div class="weather-widget-header">
                <h3>${cityName}</h3>
                <button class="weather-widget-close">&times;</button>
            </div>
            <div class="weather-widget-body">
                <div class="weather-widget-main">
                    <img src="${iconUrl}" alt="${description}" class="weather-widget-icon">
                    <div class="weather-widget-temp">${temp}°C</div>
                </div>
                <div class="weather-widget-description">${description}</div>
                <div class="weather-widget-details">
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Pocitově:</span>
                        <span class="weather-widget-detail-value">${feelsLike}°C</span>
                    </div>
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Vlhkost:</span>
                        <span class="weather-widget-detail-value">${humidity}%</span>
                    </div>
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Vítr:</span>
                        <span class="weather-widget-detail-value">${windSpeed} km/h</span>
                    </div>
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Tlak:</span>
                        <span class="weather-widget-detail-value">${pressure} hPa</span>
                    </div>
                </div>
            </div>
        `;

        // Přidání widgetu do dokumentu
        document.body.appendChild(widget);

        // Přidání event listenerů
        const closeButton = widget.querySelector('.weather-widget-close');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                // Odstranění vrstvy s počasím
                if (this.weatherLayer) {
                    map.removeLayer(this.weatherLayer);
                    this.weatherLayer = null;
                }

                // Odstranění widgetu
                widget.remove();

                // Zobrazení informace o vypnutí vrstvy s počasím
                addMessage('Vrstva s počasím byla vypnuta.', false);
            });
        }
    },

    // Zobrazení zajímavých míst v okolí
    showPointsOfInterest() {
        // Zobrazení informace o načítání zajímavých míst
        addMessage('Vyhledávám zajímavá místa v okolí...', false);

        // Získání aktuální polohy
        const center = map.getCenter();

        // Vytvoření URL pro API požadavek (použití Overpass API pro OpenStreetMap)
        const radius = 2000; // 2 km radius
        const overpassUrl = 'https://overpass-api.de/api/interpreter';

        // Vytvoření dotazu pro Overpass API
        const query = `
            [out:json];
            (
                node["tourism"](around:${radius},${center.lat},${center.lng});
                node["amenity"="restaurant"](around:${radius},${center.lat},${center.lng});
                node["amenity"="cafe"](around:${radius},${center.lat},${center.lng});
                node["historic"](around:${radius},${center.lat},${center.lng});
                node["leisure"="park"](around:${radius},${center.lat},${center.lng});
            );
            out body;
        `;

        // Odeslání požadavku
        fetch(overpassUrl, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Odstranění existujících markerů zajímavých míst
            if (this.poiMarkers) {
                this.poiMarkers.forEach(marker => map.removeLayer(marker));
            }

            // Vytvoření nového pole pro markery
            this.poiMarkers = [];

            // Kontrola, zda byla nalezena nějaká místa
            if (!data.elements || data.elements.length === 0) {
                addMessage('V okolí nebyla nalezena žádná zajímavá místa.', false);
                return;
            }

            // Vytvoření markerů pro každé místo
            data.elements.forEach(element => {
                // Kontrola, zda má element souřadnice
                if (!element.lat || !element.lon) {
                    return;
                }

                // Získání informací o místě
                const name = element.tags.name || 'Neznámé místo';
                const type = this.getPoiType(element.tags);
                const icon = this.getPoiIcon(type);

                // Vytvoření markeru
                const marker = L.marker([element.lat, element.lon], {
                    icon: L.divIcon({
                        className: 'poi-marker',
                        html: `<div class="poi-marker-inner">${icon}</div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    })
                }).addTo(map);

                // Vytvoření popup okna
                marker.bindPopup(`
                    <div class="poi-popup">
                        <h3>${name}</h3>
                        <p>${type}</p>
                        ${element.tags.description ? `<p>${element.tags.description}</p>` : ''}
                        ${element.tags.website ? `<p><a href="${element.tags.website}" target="_blank">Webové stránky</a></p>` : ''}
                    </div>
                `);

                // Přidání markeru do pole
                this.poiMarkers.push(marker);
            });

            // Zobrazení informace o počtu nalezených míst
            addMessage(`Nalezeno ${this.poiMarkers.length} zajímavých míst v okolí.`, false);

            // Přidání tlačítka pro skrytí zajímavých míst
            this.addHidePoiButton();
        })
        .catch(error => {
            console.error('Chyba při získávání zajímavých míst:', error);
            addMessage('Nepodařilo se získat zajímavá místa. Zkuste to prosím znovu.', false);
        });
    },

    // Získání typu zajímavého místa
    getPoiType(tags) {
        if (tags.tourism === 'attraction') return 'Turistická atrakce';
        if (tags.tourism === 'museum') return 'Muzeum';
        if (tags.tourism === 'hotel') return 'Hotel';
        if (tags.amenity === 'restaurant') return 'Restaurace';
        if (tags.amenity === 'cafe') return 'Kavárna';
        if (tags.historic) return 'Historické místo';
        if (tags.leisure === 'park') return 'Park';
        return 'Zajímavé místo';
    },

    // Získání ikony pro typ zajímavého místa
    getPoiIcon(type) {
        switch (type) {
            case 'Turistická atrakce': return '🌎';
            case 'Muzeum': return '🏛️';
            case 'Hotel': return '🏨';
            case 'Restaurace': return '🍴';
            case 'Kavárna': return '☕';
            case 'Historické místo': return '🏛️';
            case 'Park': return '🌳';
            default: return '📍';
        }
    },

    // Přepnutí nástroje pro měření vzdálenosti
    toggleDistanceMeasurement() {
        // Kontrola, zda je měření vzdálenosti aktivní
        if (this.measuringDistance) {
            // Vypnutí měření vzdálenosti
            this.stopDistanceMeasurement();
        } else {
            // Zapnutí měření vzdálenosti
            this.startDistanceMeasurement();
        }
    },

    // Spuštění měření vzdálenosti
    startDistanceMeasurement() {
        // Nastavení příznaku měření vzdálenosti
        this.measuringDistance = true;

        // Inicializace pole pro body měření
        this.measurePoints = [];

        // Inicializace pole pro markery měření
        this.measureMarkers = [];

        // Přidání event listeneru pro kliknutí na mapu
        map.on('click', this.handleMapClickForMeasurement, this);

        // Změna kurzoru
        document.querySelector('.leaflet-container').style.cursor = 'crosshair';

        // Zobrazení informace o zahájení měření
        addMessage('Měření vzdálenosti zahájeno. Klikněte na mapu pro přidání bodů měření. Pro ukončení měření klikněte znovu na tlačítko měření.', false);

        // Přidání tlačítka pro ukončení měření
        this.addStopMeasurementButton();
    },

    // Ukončení měření vzdálenosti
    stopDistanceMeasurement() {
        // Odstranění příznaku měření vzdálenosti
        this.measuringDistance = false;

        // Odstranění event listeneru
        map.off('click', this.handleMapClickForMeasurement, this);

        // Obnovení kurzoru
        document.querySelector('.leaflet-container').style.cursor = '';

        // Vyčištění bodů měření
        this.clearMeasurement();

        // Odstranění tlačítka pro ukončení měření
        const stopButton = document.getElementById('stopMeasurementButton');
        if (stopButton) {
            stopButton.remove();
        }

        // Zobrazení informace o ukončení měření
        addMessage('Měření vzdálenosti ukončeno.', false);
    },

    // Zpracování kliknutí na mapu pro měření vzdálenosti
    handleMapClickForMeasurement(e) {
        // Přidání bodu do seznamu
        this.measurePoints.push(e.latlng);

        // Vytvoření markeru pro bod
        const marker = L.marker(e.latlng, {
            icon: L.divIcon({
                className: 'measure-point',
                html: `<div class="measure-point-inner"></div>`,
                iconSize: [10, 10]
            })
        }).addTo(map);

        // Přidání markeru do seznamu
        this.measureMarkers.push(marker);

        // Aktualizace linie měření
        this.updateMeasureLine();
    },

    // Aktualizace linie měření
    updateMeasureLine() {
        // Odstranění existující linie
        if (this.measureLine) {
            map.removeLayer(this.measureLine);
        }

        // Odstranění existujícího markeru vzdálenosti
        if (this.distanceMarker) {
            map.removeLayer(this.distanceMarker);
        }

        // Pokud máme alespoň dva body, vytvoříme linii
        if (this.measurePoints.length >= 2) {
            // Vytvoření linie
            this.measureLine = L.polyline(this.measurePoints, {
                color: '#FF4500',
                weight: 3,
                opacity: 0.7,
                dashArray: '5, 10'
            }).addTo(map);

            // Výpočet celkové vzdálenosti
            let totalDistance = 0;
            for (let i = 1; i < this.measurePoints.length; i++) {
                totalDistance += this.measurePoints[i-1].distanceTo(this.measurePoints[i]);
            }

            // Formátování vzdálenosti
            let distanceText = '';
            if (totalDistance < 1000) {
                distanceText = `${Math.round(totalDistance)} m`;
            } else {
                distanceText = `${(totalDistance / 1000).toFixed(2)} km`;
            }

            // Vytvoření markeru pro zobrazení vzdálenosti
            const midPoint = this.getMidPoint();
            this.distanceMarker = L.marker(midPoint, {
                icon: L.divIcon({
                    className: 'distance-marker',
                    html: `<div class="distance-marker-inner">${distanceText}</div>`,
                    iconSize: [80, 30]
                })
            }).addTo(map);

            // Zobrazení informace o vzdálenosti v chatu
            addMessage(`Naměřená vzdálenost: ${distanceText} (${this.measurePoints.length} bodů)`, false);
        }
    },

    // Získání středového bodu pro zobrazení vzdálenosti
    getMidPoint() {
        if (this.measurePoints.length < 2) {
            return null;
        }

        // Pro dva body vrátíme střed mezi nimi
        if (this.measurePoints.length === 2) {
            const p1 = this.measurePoints[0];
            const p2 = this.measurePoints[1];
            return L.latLng(
                (p1.lat + p2.lat) / 2,
                (p1.lng + p2.lng) / 2
            );
        }

        // Pro více bodů vrátíme střed mezi prvním a posledním bodem
        const p1 = this.measurePoints[0];
        const p2 = this.measurePoints[this.measurePoints.length - 1];
        return L.latLng(
            (p1.lat + p2.lat) / 2,
            (p1.lng + p2.lng) / 2
        );
    },

    // Vyčištění měření
    clearMeasurement() {
        // Odstranění bodů
        if (this.measureMarkers) {
            this.measureMarkers.forEach(marker => {
                map.removeLayer(marker);
            });
            this.measureMarkers = [];
        }

        // Odstranění linie
        if (this.measureLine) {
            map.removeLayer(this.measureLine);
            this.measureLine = null;
        }

        // Odstranění markeru vzdálenosti
        if (this.distanceMarker) {
            map.removeLayer(this.distanceMarker);
            this.distanceMarker = null;
        }

        // Vyčištění bodů měření
        this.measurePoints = [];
    },

    // Přidání tlačítka pro ukončení měření
    addStopMeasurementButton() {
        // Odstranění existujícího tlačítka
        const existingButton = document.getElementById('stopMeasurementButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'stopMeasurementButton';
        button.className = 'stop-measurement-button';
        button.innerHTML = 'Ukončit měření';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);

        // Přidání event listeneru
        button.addEventListener('click', () => {
            this.stopDistanceMeasurement();
        });
    },

    // Přidání tlačítka pro skrytí zajímavých míst
    addHidePoiButton() {
        // Odstranění existujícího tlačítka
        const existingButton = document.getElementById('hidePoiButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'hidePoiButton';
        button.className = 'hide-poi-button';
        button.innerHTML = 'Skrýt zajímavá místa';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);

        // Přidání event listeneru
        button.addEventListener('click', () => {
            // Odstranění markerů zajímavých míst
            if (this.poiMarkers) {
                this.poiMarkers.forEach(marker => map.removeLayer(marker));
                this.poiMarkers = [];
            }

            // Odstranění tlačítka
            button.remove();

            // Zobrazení informace o skrytí zajímavých míst
            addMessage('Zajímavá místa byla skryta.', false);
        });
    },

    // Sdílení aktuální polohy nebo trasy
    shareLocation() {
        // Zobrazení modalu pro sdílení polohy
        this.showShareLocationModal();
    },

    // Zobrazení modalu pro sdílení polohy
    showShareLocationModal() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('shareLocationModal')) {
            return;
        }

        // Získání aktuální polohy
        const center = map.getCenter();
        const zoom = map.getZoom();

        // Vytvoření URL pro sdílení polohy
        const locationUrl = `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}&zoom=${zoom}`;

        // Vytvoření URL pro sdílení trasy (pokud existuje)
        let routeUrl = '';
        if (markers && markers.length >= 2) {
            routeUrl = 'https://www.openstreetmap.org/directions?';

            // Přidání výchozího bodu
            const start = markers[0].getLatLng();
            routeUrl += `engine=graphhopper_foot&route=${start.lat},${start.lng}`;

            // Přidání cílového bodu
            const end = markers[markers.length - 1].getLatLng();
            routeUrl += `;${end.lat},${end.lng}`;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'shareLocationModal';
        modal.className = 'share-location-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="share-location-modal-content">
                <div class="share-location-modal-header">
                    <h2>Sdílet polohu</h2>
                    <button class="share-location-modal-close">&times;</button>
                </div>
                <div class="share-location-modal-body">
                    <div class="share-location-option">
                        <h3>Sdílet aktuální polohu</h3>
                        <div class="share-location-url-container">
                            <input type="text" class="share-location-url" value="${locationUrl}" readonly>
                            <button class="copy-location-url" data-url="${locationUrl}">Kopírovat</button>
                        </div>
                        <div class="share-location-buttons">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(locationUrl)}" target="_blank" class="share-location-button facebook">Facebook</a>
                            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(locationUrl)}&text=Moje poloha na mapě:" target="_blank" class="share-location-button twitter">Twitter</a>
                            <a href="mailto:?subject=Moje poloha na mapě&body=${encodeURIComponent(locationUrl)}" class="share-location-button email">E-mail</a>
                            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent('Moje poloha na mapě: ' + locationUrl)}" target="_blank" class="share-location-button whatsapp">WhatsApp</a>
                        </div>
                    </div>

                    ${routeUrl ? `
                    <div class="share-location-option">
                        <h3>Sdílet trasu</h3>
                        <div class="share-location-url-container">
                            <input type="text" class="share-location-url" value="${routeUrl}" readonly>
                            <button class="copy-location-url" data-url="${routeUrl}">Kopírovat</button>
                        </div>
                        <div class="share-location-buttons">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(routeUrl)}" target="_blank" class="share-location-button facebook">Facebook</a>
                            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(routeUrl)}&text=Moje trasa na mapě:" target="_blank" class="share-location-button twitter">Twitter</a>
                            <a href="mailto:?subject=Moje trasa na mapě&body=${encodeURIComponent(routeUrl)}" class="share-location-button email">E-mail</a>
                            <a href="https://api.whatsapp.com/send?text=${encodeURIComponent('Moje trasa na mapě: ' + routeUrl)}" target="_blank" class="share-location-button whatsapp">WhatsApp</a>
                        </div>
                    </div>
                    ` : ''}

                    <div class="share-location-qr-code">
                        <h3>QR kód pro sdílení polohy</h3>
                        <div class="share-location-qr-code-image">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(locationUrl)}" alt="QR kód pro sdílení polohy">
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
        const closeButton = modal.querySelector('.share-location-modal-close');
        const copyButtons = modal.querySelectorAll('.copy-location-url');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        if (copyButtons) {
            copyButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Získání URL ze atributu data-url
                    const url = button.getAttribute('data-url');

                    // Kopírování URL do schránky
                    navigator.clipboard.writeText(url)
                        .then(() => {
                            // Změna textu tlačítka na potvrzení
                            button.textContent = 'Zkopírováno!';
                            button.classList.add('copied');

                            // Obnovení textu tlačítka po 2 sekundách
                            setTimeout(() => {
                                button.textContent = 'Kopírovat';
                                button.classList.remove('copied');
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Chyba při kopírování do schránky:', err);
                            alert('Nepodařilo se zkopírovat URL do schránky. Zkuste to prosím znovu.');
                        });
                });
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

        // Zobrazení informace o vytvoření odkazu
        addMessage('Odkaz pro sdílení polohy byl vytvořen.', false);
    },

    // Získání ikony pro typ obchodu
    getShopIcon(type) {
        switch (type) {
            case 'supermarket': return '🛒';
            case 'convenience': return '🛍️';
            case 'clothes': return '👕';
            case 'shoes': return '👟';
            case 'electronics': return '📱';
            case 'hardware': return '🔧';
            case 'furniture': return '🛋️';
            case 'bakery': return '🍞';
            case 'butcher': return '🥩';
            case 'books': return '📚';
            case 'jewelry': return '💍';
            case 'toys': return '🎁';
            case 'sports': return '⚽';
            case 'alcohol': return '🍷';
            case 'florist': return '🌷';
            case 'optician': return '👓';
            case 'chemist': return '💊';
            case 'department_store': return '🏬';
            case 'mall': return '🛍️';
            case 'beauty': return '💄';
            case 'hairdresser': return '✂️';
            default: return '🛍️';
        }
    },

    // Získání názvu typu obchodu
    getShopTypeName(type) {
        switch (type) {
            case 'supermarket': return 'Supermarket';
            case 'convenience': return 'Potravinový obchod';
            case 'clothes': return 'Obchod s oblečením';
            case 'shoes': return 'Obchod s obuví';
            case 'electronics': return 'Elektro';
            case 'hardware': return 'Železnářství';
            case 'furniture': return 'Nábytek';
            case 'bakery': return 'Pekařství';
            case 'butcher': return 'Řeznictví';
            case 'books': return 'Knihkupectví';
            case 'jewelry': return 'Klenotnictví';
            case 'toys': return 'Hračkářství';
            case 'sports': return 'Sportovní potřeby';
            case 'alcohol': return 'Vinotéka/Lihoviny';
            case 'florist': return 'Květinový obchod';
            case 'optician': return 'Optika';
            case 'chemist': return 'Drogerie';
            case 'department_store': return 'Obchodní dům';
            case 'mall': return 'Nákupní centrum';
            case 'beauty': return 'Kosmetika';
            case 'hairdresser': return 'Kadeřnictví';
            default: return 'Obchod';
        }
    },

    // Přidání tlačítka pro skrytí obchodů
    addHideShopsButton() {
        // Odstranění existujícího tlačítka
        const existingButton = document.getElementById('hideShopsButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'hideShopsButton';
        button.className = 'hide-shops-button';
        button.innerHTML = 'Skrýt obchody';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);

        // Přidání event listeneru
        button.addEventListener('click', () => {
            // Odstranění markerů obchodů
            if (this.shopMarkers) {
                this.shopMarkers.forEach(marker => map.removeLayer(marker));
                this.shopMarkers = [];
            }

            // Odstranění tlačítka
            button.remove();

            // Zobrazení informace o skrytí obchodů
            addMessage('Obchody byly skryty.', false);
        });
    },

    // Zobrazení obchodu s energetickými nápoji
    showEnergyDrinksShop() {
        // Zobrazení informace o načítání obchodu
        addMessage('Načítám nabídku energetických nápojů z eshopu podpultovky.cz...', false);

        // Získání produktů pro energetické nápoje
        const products = this.getShopProducts('energy-drinks');

        // Zobrazení obchodu s produkty
        this.showSpecialShop('Energetické nápoje - Podpultovky.cz', products, 'energy-drinks');

        // Přidání XP za návštěvu obchodu
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(5, 'Návštěva obchodu s energetickými nápoji');
        }
    },

    // Zobrazení obchodu s krkovičkou
    showKrkovickaShop() {
        // Zobrazení informace o načítání obchodu
        addMessage('Načítám nabídku krkovičky a dalších mas z eshopu podpultovky.cz...', false);

        // Získání produktů pro krkovičku
        const products = this.getShopProducts('krkovicka');

        // Zobrazení obchodu s produkty
        this.showSpecialShop('Krkovička a maso - Podpultovky.cz', products, 'krkovicka');

        // Přidání XP za návštěvu obchodu
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(5, 'Návštěva obchodu s krkovičkou');
        }
    },

    // Zobrazení rozvážky pizzy
    showPizzaDelivery() {
        // Zobrazení informace o načítání pizzerií
        addMessage('Načítám nabídku pizzerií v okolí...', false);

        // Simulace načítání dat
        const pizzerias = [
            {
                id: 'presto',
                name: 'Pizza Presto',
                rating: 4.8,
                deliveryTime: '30-45 min',
                minOrder: 199,
                deliveryFee: 49,
                image: 'https://via.placeholder.com/300x200?text=Pizza+Presto',
                menu: [
                    { name: 'Margherita', price: 159, ingredients: 'rajčatový základ, mozzarella, bazalka' },
                    { name: 'Prosciutto', price: 189, ingredients: 'rajčatový základ, mozzarella, šunka' },
                    { name: 'Salami', price: 199, ingredients: 'rajčatový základ, mozzarella, salám' },
                    { name: 'Quattro Formaggi', price: 219, ingredients: 'smetanový základ, mozzarella, gorgonzola, parmesan, eidam' }
                ]
            },
            {
                id: 'mammamia',
                name: 'Pizzerie Mamma Mia',
                rating: 4.5,
                deliveryTime: '40-55 min',
                minOrder: 249,
                deliveryFee: 0,
                image: 'https://via.placeholder.com/300x200?text=Mamma+Mia',
                menu: [
                    { name: 'Margherita', price: 149, ingredients: 'rajčatový základ, mozzarella, bazalka' },
                    { name: 'Capricciosa', price: 199, ingredients: 'rajčatový základ, mozzarella, šunka, žampiony, olivy' },
                    { name: 'Diavola', price: 209, ingredients: 'rajčatový základ, mozzarella, pikantni salám, chilli' },
                    { name: 'Hawai', price: 189, ingredients: 'rajčatový základ, mozzarella, šunka, ananas' }
                ]
            },
            {
                id: 'dongiovanni',
                name: 'Don Giovanni Pizza',
                rating: 4.9,
                deliveryTime: '35-50 min',
                minOrder: 299,
                deliveryFee: 39,
                image: 'https://via.placeholder.com/300x200?text=Don+Giovanni',
                menu: [
                    { name: 'Margherita', price: 169, ingredients: 'rajčatový základ, mozzarella, bazalka' },
                    { name: 'Funghi', price: 189, ingredients: 'rajčatový základ, mozzarella, žampiony' },
                    { name: 'Quattro Stagioni', price: 229, ingredients: 'rajčatový základ, mozzarella, šunka, žampiony, artyčoky, olivy' },
                    { name: 'Tonno', price: 219, ingredients: 'rajčatový základ, mozzarella, tuňák, cibule' }
                ]
            }
        ];

        // Vytvoření modalu pro výběr pizzerie
        const modal = document.createElement('div');
        modal.id = 'pizzaDeliveryModal';
        modal.className = 'pizza-delivery-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="pizza-delivery-modal-content">
                <div class="pizza-delivery-modal-header">
                    <h2>🍕 Rozvážka pizzy</h2>
                    <button class="pizza-delivery-modal-close">&times;</button>
                </div>
                <div class="pizza-delivery-modal-body">
                    <div class="pizza-delivery-description">
                        <p>Vyberte si z nabídky nejlepších pizzerií v okolí s doručením až k vám domů.</p>
                    </div>
                    <div class="pizza-delivery-list">
                        ${pizzerias.map(pizzeria => `
                            <div class="pizza-delivery-item" data-pizzeria-id="${pizzeria.id}">
                                <div class="pizza-delivery-item-image" style="background-image: url('${pizzeria.image}')"></div>
                                <div class="pizza-delivery-item-info">
                                    <h3>${pizzeria.name}</h3>
                                    <div class="pizza-delivery-item-rating">
                                        ${'⭐'.repeat(Math.floor(pizzeria.rating))}${pizzeria.rating % 1 >= 0.5 ? '⭐' : ''} ${pizzeria.rating.toFixed(1)}
                                    </div>
                                    <div class="pizza-delivery-item-details">
                                        <span>Doručení: ${pizzeria.deliveryTime}</span>
                                        <span>Min. objednávka: ${pizzeria.minOrder} Kč</span>
                                        <span>Doprava: ${pizzeria.deliveryFee > 0 ? `${pizzeria.deliveryFee} Kč` : 'Zdarma'}</span>
                                    </div>
                                </div>
                                <button class="pizza-delivery-item-button">Zobrazit menu</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro modal
        const style = document.createElement('style');
        style.textContent = `
            .pizza-delivery-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .pizza-delivery-modal.show {
                opacity: 1;
            }

            .pizza-delivery-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }

            .pizza-delivery-modal.show .pizza-delivery-modal-content {
                transform: scale(1);
            }

            .pizza-delivery-modal-header {
                background: linear-gradient(135deg, #FF5722 0%, #FF9800 100%);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .pizza-delivery-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }

            .pizza-delivery-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .pizza-delivery-modal-body {
                padding: 20px;
                overflow-y: auto;
                max-height: calc(90vh - 60px);
            }

            .pizza-delivery-description {
                margin-bottom: 20px;
                color: var(--text-color);
            }

            .pizza-delivery-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .pizza-delivery-item {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .pizza-delivery-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }

            .pizza-delivery-item-image {
                height: 150px;
                background-size: cover;
                background-position: center;
            }

            .pizza-delivery-item-info {
                padding: 15px;
            }

            .pizza-delivery-item-info h3 {
                margin: 0 0 10px 0;
                color: var(--text-color);
                font-size: 1.2rem;
            }

            .pizza-delivery-item-rating {
                color: #FFD700;
                margin-bottom: 10px;
            }

            .pizza-delivery-item-details {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                color: var(--text-color-dark);
                font-size: 0.9rem;
            }

            .pizza-delivery-item-details span {
                background-color: rgba(0, 0, 0, 0.1);
                padding: 5px 10px;
                border-radius: 15px;
            }

            .pizza-delivery-item-button {
                margin: 0 15px 15px 15px;
                padding: 10px;
                background-color: #FF5722;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }

            .pizza-delivery-item-button:hover {
                background-color: #E64A19;
            }

            /* Styly pro menu pizzerie */
            .pizza-menu {
                margin-top: 20px;
            }

            .pizza-menu-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }

            .pizza-menu-header h3 {
                margin: 0;
                color: var(--text-color);
            }

            .pizza-menu-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .pizza-menu-item {
                background-color: rgba(0, 0, 0, 0.1);
                padding: 15px;
                border-radius: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .pizza-menu-item-info {
                flex: 1;
            }

            .pizza-menu-item-name {
                font-weight: bold;
                color: var(--text-color);
                margin-bottom: 5px;
            }

            .pizza-menu-item-ingredients {
                color: var(--text-color-dark);
                font-size: 0.9rem;
            }

            .pizza-menu-item-price {
                font-weight: bold;
                color: #FF5722;
                margin-left: 15px;
            }

            .pizza-menu-item-add {
                background-color: #FF5722;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 8px 12px;
                cursor: pointer;
                margin-left: 15px;
                transition: background-color 0.3s ease;
            }

            .pizza-menu-item-add:hover {
                background-color: #E64A19;
            }

            .pizza-back-button {
                background-color: rgba(0, 0, 0, 0.2);
                color: var(--text-color);
                border: none;
                border-radius: 5px;
                padding: 10px 15px;
                cursor: pointer;
                margin-top: 20px;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: background-color 0.3s ease;
            }

            .pizza-back-button:hover {
                background-color: rgba(0, 0, 0, 0.3);
            }

            .pizza-order-button {
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                padding: 12px 20px;
                cursor: pointer;
                margin-top: 20px;
                font-weight: bold;
                width: 100%;
                transition: background-color 0.3s ease;
            }

            .pizza-order-button:hover {
                background-color: #388E3C;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Animace zobrazení
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.pizza-delivery-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        });

        // Event listenery pro tlačítka pizzerií
        const pizzeriaButtons = modal.querySelectorAll('.pizza-delivery-item-button');
        pizzeriaButtons.forEach(button => {
            button.addEventListener('click', () => {
                const pizzeriaItem = button.closest('.pizza-delivery-item');
                const pizzeriaId = pizzeriaItem.getAttribute('data-pizzeria-id');
                const pizzeria = pizzerias.find(p => p.id === pizzeriaId);

                // Zobrazení menu vybrané pizzerie
                const modalBody = modal.querySelector('.pizza-delivery-modal-body');
                modalBody.innerHTML = `
                    <div class="pizza-delivery-description">
                        <button class="pizza-back-button">&#8592; Zpět na seznam pizzerií</button>
                    </div>
                    <div class="pizza-delivery-item">
                        <div class="pizza-delivery-item-image" style="background-image: url('${pizzeria.image}')"></div>
                        <div class="pizza-delivery-item-info">
                            <h3>${pizzeria.name}</h3>
                            <div class="pizza-delivery-item-rating">
                                ${'⭐'.repeat(Math.floor(pizzeria.rating))}${pizzeria.rating % 1 >= 0.5 ? '⭐' : ''} ${pizzeria.rating.toFixed(1)}
                            </div>
                            <div class="pizza-delivery-item-details">
                                <span>Doručení: ${pizzeria.deliveryTime}</span>
                                <span>Min. objednávka: ${pizzeria.minOrder} Kč</span>
                                <span>Doprava: ${pizzeria.deliveryFee > 0 ? `${pizzeria.deliveryFee} Kč` : 'Zdarma'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="pizza-menu">
                        <div class="pizza-menu-header">
                            <h3>Menu</h3>
                        </div>
                        <div class="pizza-menu-list">
                            ${pizzeria.menu.map(item => `
                                <div class="pizza-menu-item">
                                    <div class="pizza-menu-item-info">
                                        <div class="pizza-menu-item-name">${item.name}</div>
                                        <div class="pizza-menu-item-ingredients">${item.ingredients}</div>
                                    </div>
                                    <div class="pizza-menu-item-price">${item.price} Kč</div>
                                    <button class="pizza-menu-item-add" data-pizza-name="${item.name}" data-pizza-price="${item.price}">Přidat</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button class="pizza-order-button">Objednat</button>
                `;

                // Event listener pro tlačítko zpět
                const backButton = modalBody.querySelector('.pizza-back-button');
                backButton.addEventListener('click', () => {
                    // Obnovení původního obsahu modalu
                    this.showPizzaDelivery();
                });

                // Event listenery pro tlačítka přidání pizzy
                const addButtons = modalBody.querySelectorAll('.pizza-menu-item-add');
                addButtons.forEach(addButton => {
                    addButton.addEventListener('click', () => {
                        const pizzaName = addButton.getAttribute('data-pizza-name');
                        const pizzaPrice = addButton.getAttribute('data-pizza-price');

                        // Simulace přidání do košíku
                        addButton.textContent = 'Přidáno';
                        addButton.disabled = true;
                        addButton.style.backgroundColor = '#4CAF50';

                        // Zobrazení informace o přidání do košíku
                        addMessage(`Pizza ${pizzaName} byla přidána do košíku.`, false);
                    });
                });

                // Event listener pro tlačítko objednat
                const orderButton = modalBody.querySelector('.pizza-order-button');
                orderButton.addEventListener('click', () => {
                    // Simulace objednávky
                    modalBody.innerHTML = `
                        <div class="pizza-order-confirmation">
                            <div class="pizza-order-confirmation-icon">✅</div>
                            <h3>Vaše objednávka byla přijata!</h3>
                            <p>Objednávka z ${pizzeria.name} bude doručena za ${pizzeria.deliveryTime}.</p>
                            <p>Děkujeme za vaši objednávku!</p>
                            <button class="pizza-close-button">Zavřít</button>
                        </div>
                    `;

                    // Přidání CSS stylů pro potvrzení objednávky
                    style.textContent += `
                        .pizza-order-confirmation {
                            text-align: center;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 15px;
                        }

                        .pizza-order-confirmation-icon {
                            font-size: 48px;
                            margin-bottom: 10px;
                        }

                        .pizza-order-confirmation h3 {
                            margin: 0;
                            color: var(--text-color);
                            font-size: 1.5rem;
                        }

                        .pizza-order-confirmation p {
                            margin: 5px 0;
                            color: var(--text-color-dark);
                        }

                        .pizza-close-button {
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 5px;
                            padding: 12px 25px;
                            cursor: pointer;
                            font-weight: bold;
                            margin-top: 20px;
                            transition: background-color 0.3s ease;
                        }

                        .pizza-close-button:hover {
                            background-color: #388E3C;
                        }
                    `;

                    // Event listener pro tlačítko zavřít
                    const closeButton = modalBody.querySelector('.pizza-close-button');
                    closeButton.addEventListener('click', () => {
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.remove();
                            style.remove();
                        }, 300);
                    });

                    // Přidání XP za objednání pizzy
                    if (typeof UserProgress !== 'undefined') {
                        UserProgress.addExperience(10, 'Objednání pizzy');
                    }
                });
            });
        });

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove();
                }, 300);
            }
        });

        // Přidání XP za zobrazení rozvážky pizzy
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(3, 'Zobrazení rozvážky pizzy');
        }
    },

    // Zobrazení speciálního obchodu s detailními produkty
    showSpecialShop(shopName, products, shopType) {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('specialShopModal')) {
            return;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'specialShopModal';
        modal.className = 'special-shop-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="special-shop-modal-content">
                <div class="special-shop-modal-header">
                    <h2>${shopName}</h2>
                    <button class="special-shop-modal-close">&times;</button>
                </div>
                <div class="special-shop-modal-body">
                    <div class="special-shop-products-list">
                        ${products.map(product => `
                            <div class="special-shop-product">
                                <div class="special-shop-product-header">
                                    <div class="special-shop-product-icon">${product.icon}</div>
                                    <div class="special-shop-product-name">${product.name}</div>
                                    <div class="special-shop-product-price">${product.price} Kč</div>
                                </div>
                                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="special-shop-product-image">` : ''}
                                <div class="special-shop-product-description">${product.description || ''}</div>
                                <button class="special-shop-product-add-to-cart" data-product="${product.name}" data-price="${product.price}">Přidat do košíku</button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="special-shop-cart">
                        <h3>Nákupní košík</h3>
                        <div class="special-shop-cart-items" id="specialShopCartItems">
                            <div class="special-shop-cart-empty">Košík je prázdný</div>
                        </div>
                        <div class="special-shop-cart-total">
                            <span>Celkem:</span>
                            <span id="specialShopCartTotal">0 Kč</span>
                        </div>
                        <button class="special-shop-cart-checkout" id="specialShopCartCheckout">Objednat</button>
                    </div>
                </div>
            </div>
        `;

        // Přidání CSS stylů pro speciální obchod
        const style = document.createElement('style');
        style.textContent = `
            .special-shop-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .special-shop-modal.show {
                opacity: 1;
            }

            .special-shop-modal-content {
                background-color: white;
                border-radius: 10px;
                width: 90%;
                max-width: 1200px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                display: flex;
                flex-direction: column;
            }

            .special-shop-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
                position: sticky;
                top: 0;
                background-color: white;
                z-index: 10;
            }

            .special-shop-modal-header h2 {
                margin: 0;
                color: #333;
            }

            .special-shop-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }

            .special-shop-modal-body {
                padding: 20px;
                display: flex;
                flex-direction: row;
                gap: 20px;
            }

            .special-shop-products-list {
                flex: 3;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }

            .special-shop-product {
                border: 1px solid #eee;
                border-radius: 8px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                transition: transform 0.2s, box-shadow 0.2s;
            }

            .special-shop-product:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }

            .special-shop-product-header {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .special-shop-product-icon {
                font-size: 24px;
            }

            .special-shop-product-name {
                font-weight: bold;
                flex: 1;
            }

            .special-shop-product-price {
                font-weight: bold;
                color: #e74c3c;
            }

            .special-shop-product-image {
                width: 100%;
                height: 200px;
                object-fit: contain;
                border-radius: 4px;
            }

            .special-shop-product-description {
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }

            .special-shop-product-add-to-cart {
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.2s;
            }

            .special-shop-product-add-to-cart:hover {
                background-color: #2980b9;
            }

            .special-shop-product-add-to-cart.added {
                background-color: #2ecc71;
            }

            .special-shop-cart {
                flex: 1;
                background-color: #f9f9f9;
                border-radius: 8px;
                padding: 15px;
                position: sticky;
                top: 80px;
                max-height: calc(90vh - 100px);
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .special-shop-cart h3 {
                margin: 0 0 10px 0;
                color: #333;
            }

            .special-shop-cart-items {
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex: 1;
            }

            .special-shop-cart-empty {
                color: #999;
                font-style: italic;
                text-align: center;
                padding: 20px 0;
            }

            .special-shop-cart-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #eee;
            }

            .special-shop-cart-item-name {
                flex: 1;
            }

            .special-shop-cart-item-price {
                font-weight: bold;
                margin: 0 10px;
            }

            .special-shop-cart-item-remove {
                background: none;
                border: none;
                color: #e74c3c;
                cursor: pointer;
                font-size: 18px;
            }

            .special-shop-cart-total {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                padding: 10px 0;
                border-top: 2px solid #ddd;
                margin-top: auto;
            }

            .special-shop-cart-checkout {
                background-color: #2ecc71;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 10px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.2s;
            }

            .special-shop-cart-checkout:hover {
                background-color: #27ae60;
            }

            @media (max-width: 768px) {
                .special-shop-modal-body {
                    flex-direction: column;
                }

                .special-shop-products-list {
                    grid-template-columns: 1fr;
                }

                .special-shop-cart {
                    position: static;
                    max-height: none;
                }
            }

            /* Tmavý režim */
            body[data-theme="dark"] .special-shop-modal-content,
            body[data-theme="dark"] .special-shop-modal-header {
                background-color: #333;
                color: #fff;
            }

            body[data-theme="dark"] .special-shop-modal-header h2 {
                color: #fff;
            }

            body[data-theme="dark"] .special-shop-product {
                background-color: #444;
                border-color: #555;
                color: #fff;
            }

            body[data-theme="dark"] .special-shop-product-description {
                color: #ccc;
            }

            body[data-theme="dark"] .special-shop-cart {
                background-color: #444;
                color: #fff;
            }

            body[data-theme="dark"] .special-shop-cart h3 {
                color: #fff;
            }

            body[data-theme="dark"] .special-shop-cart-item {
                border-bottom-color: #555;
            }

            body[data-theme="dark"] .special-shop-cart-empty {
                color: #aaa;
            }
        `;

        document.head.appendChild(style);

        // Přidání modalu do dokumentu
        document.body.appendChild(modal);

        // Animace zobrazení
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.special-shop-modal-close');
        const addToCartButtons = modal.querySelectorAll('.special-shop-product-add-to-cart');
        const checkoutButton = modal.querySelector('#specialShopCartCheckout');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                    style.remove(); // Odstranění CSS stylů
                }, 300);
            });
        }

        // Košík
        const cart = [];

        // Přidání event listenerů pro tlačítka "Přidat do košíku"
        if (addToCartButtons) {
            addToCartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productName = button.getAttribute('data-product');
                    const productPrice = parseInt(button.getAttribute('data-price'));

                    // Přidání produktu do košíku
                    cart.push({
                        name: productName,
                        price: productPrice
                    });

                    // Aktualizace zobrazení košíku
                    this.updateSpecialCartDisplay(cart);

                    // Animace tlačítka
                    button.classList.add('added');
                    button.textContent = 'Přidáno do košíku';
                    setTimeout(() => {
                        button.classList.remove('added');
                        button.textContent = 'Přidat do košíku';
                    }, 1000);
                });
            });
        }

        // Přidání event listeneru pro tlačítko "Objednat"
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Košík je prázdný. Přidejte prosím nějaké produkty.');
                    return;
                }

                // Výpočet celkové ceny
                const total = cart.reduce((sum, item) => sum + item.price, 0);

                // Přidání XP a sledování nákupu
                if (typeof UserProgress !== 'undefined' && typeof UserProgressExtensions !== 'undefined') {
                    // Použití rozšířené funkce pro sledování nákupů
                    UserProgressExtensions.trackPurchase(shopType, cart, total);
                } else if (typeof UserProgress !== 'undefined') {
                    // Záložní pro případ, že rozšíření není dostupné
                    const purchaseXP = Math.min(Math.ceil(total / 50), 30); // Maximum 30 XP
                    UserProgress.addExperience(purchaseXP, `Nákup v obchodě ${shopName}`);

                    // Základní achievementy za nákup
                    if (shopType === 'energy-drinks') {
                        UserProgress.addAchievement('energy-buyer');
                    } else if (shopType === 'krkovicka') {
                        UserProgress.addAchievement('meat-lover');
                    }
                }

                // Zobrazení potvrzovací zprávy
                alert(`Děkujeme za objednávku! Celková cena: ${total} Kč. Objednávka bude doručena do 30 minut.`);

                // Zavření modalu
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                    style.remove(); // Odstranění CSS stylů
                }, 300);

                // Zobrazení informace o objednávce v chatu
                addMessage(`Objednávka z obchodu ${shopName} byla úspěšně odeslana. Celková cena: ${total} Kč.`, false);
            });
        }

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                    style.remove(); // Odstranění CSS stylů
                }, 300);
            }
        });
    },

    // Aktualizace zobrazení košíku pro speciální obchod
    updateSpecialCartDisplay(cart) {
        const cartItemsElement = document.getElementById('specialShopCartItems');
        const cartTotalElement = document.getElementById('specialShopCartTotal');

        if (!cartItemsElement || !cartTotalElement) {
            return;
        }

        // Vyprázdnění košíku
        cartItemsElement.innerHTML = '';

        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="special-shop-cart-empty">Košík je prázdný</div>';
            cartTotalElement.textContent = '0 Kč';
            return;
        }

        // Vytvoření položek košíku
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'special-shop-cart-item';
            itemElement.innerHTML = `
                <div class="special-shop-cart-item-name">${item.name}</div>
                <div class="special-shop-cart-item-price">${item.price} Kč</div>
                <button class="special-shop-cart-item-remove" data-index="${index}">&times;</button>
            `;

            cartItemsElement.appendChild(itemElement);

            // Přidání event listeneru pro tlačítko odstranění
            const removeButton = itemElement.querySelector('.special-shop-cart-item-remove');
            if (removeButton) {
                removeButton.addEventListener('click', () => {
                    // Odstranění položky z košíku
                    cart.splice(index, 1);

                    // Aktualizace zobrazení košíku
                    this.updateSpecialCartDisplay(cart);
                });
            }
        });

        // Výpočet celkové ceny
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalElement.textContent = `${total} Kč`;
    },

    // Zobrazení produktů obchodu (původní implementace)
    showShopProducts(shopName, shopType) {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('shopProductsModal')) {
            return;
        }

        // Získání produktů podle typu obchodu
        const products = this.getShopProducts(shopType);

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'shopProductsModal';
        modal.className = 'shop-products-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="shop-products-modal-content">
                <div class="shop-products-modal-header">
                    <h2>${shopName}</h2>
                    <button class="shop-products-modal-close">&times;</button>
                </div>
                <div class="shop-products-modal-body">
                    <h3>Dostupné produkty</h3>
                    <div class="shop-products-list">
                        ${products.map(product => `
                            <div class="shop-product">
                                <div class="shop-product-image">${product.icon}</div>
                                <div class="shop-product-info">
                                    <div class="shop-product-name">${product.name}</div>
                                    <div class="shop-product-price">${product.price} Kč</div>
                                </div>
                                <button class="shop-product-add-to-cart" data-product="${product.name}" data-price="${product.price}">Přidat do košíku</button>
                            </div>
                        `).join('')}
                    </div>

                    <div class="shop-cart">
                        <h3>Nákupní košík</h3>
                        <div class="shop-cart-items" id="shopCartItems">
                            <div class="shop-cart-empty">Košík je prázdný</div>
                        </div>
                        <div class="shop-cart-total">
                            <span>Celkem:</span>
                            <span id="shopCartTotal">0 Kč</span>
                        </div>
                        <button class="shop-cart-checkout" id="shopCartCheckout">Objednat</button>
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
        const closeButton = modal.querySelector('.shop-products-modal-close');
        const addToCartButtons = modal.querySelectorAll('.shop-product-add-to-cart');
        const checkoutButton = modal.querySelector('#shopCartCheckout');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        // Košík
        const cart = [];

        // Přidání event listenerů pro tlačítka "Přidat do košíku"
        if (addToCartButtons) {
            addToCartButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const productName = button.getAttribute('data-product');
                    const productPrice = parseInt(button.getAttribute('data-price'));

                    // Přidání produktu do košíku
                    cart.push({
                        name: productName,
                        price: productPrice
                    });

                    // Aktualizace zobrazení košíku
                    this.updateCartDisplay(cart);

                    // Animace tlačítka
                    button.classList.add('added');
                    setTimeout(() => {
                        button.classList.remove('added');
                    }, 500);
                });
            });
        }

        // Přidání event listeneru pro tlačítko "Objednat"
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Košík je prázdný. Přidejte prosím nějaké produkty.');
                    return;
                }

                // Výpočet celkové ceny
                const total = cart.reduce((sum, item) => sum + item.price, 0);

                // Zobrazení potvrzovací zprávy
                alert(`Děkujeme za objednávku! Celková cena: ${total} Kč. Objednávka bude doručena do 30 minut.`);

                // Zavření modalu
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);

                // Zobrazení informace o objednávce v chatu
                addMessage(`Objednávka z obchodu ${shopName} byla úspěšně odeslana. Celková cena: ${total} Kč.`, false);
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

    // Aktualizace zobrazení košíku
    updateCartDisplay(cart) {
        const cartItemsElement = document.getElementById('shopCartItems');
        const cartTotalElement = document.getElementById('shopCartTotal');

        if (!cartItemsElement || !cartTotalElement) {
            return;
        }

        // Vyprázdnění košíku
        cartItemsElement.innerHTML = '';

        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<div class="shop-cart-empty">Košík je prázdný</div>';
            cartTotalElement.textContent = '0 Kč';
            return;
        }

        // Vytvoření položek košíku
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-cart-item';
            itemElement.innerHTML = `
                <div class="shop-cart-item-name">${item.name}</div>
                <div class="shop-cart-item-price">${item.price} Kč</div>
                <button class="shop-cart-item-remove" data-index="${index}">&times;</button>
            `;

            cartItemsElement.appendChild(itemElement);

            // Přidání event listeneru pro tlačítko odstranění
            const removeButton = itemElement.querySelector('.shop-cart-item-remove');
            if (removeButton) {
                removeButton.addEventListener('click', () => {
                    // Odstranění položky z košíku
                    cart.splice(index, 1);

                    // Aktualizace zobrazení košíku
                    this.updateCartDisplay(cart);
                });
            }
        });

        // Výpočet celkové ceny
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotalElement.textContent = `${total} Kč`;
    },

    // Zobrazení příběhů z oblasti
    showLocalStories() {
        // Zobrazení informace o načítání příběhů
        addMessage('Hledám zajímavé příběhy z této oblasti...', false);

        // Získání aktuální polohy
        const center = map.getCenter();

        // Získání názvu oblasti
        this.getLocationName(center.lat, center.lng)
            .then(locationName => {
                // Získání příběhů pro danou oblast
                const stories = this.getStoriesForLocation(locationName);

                // Zobrazení modalu s příběhy
                this.showStoriesModal(locationName, stories);

                // Přidání markerů příběhů na mapu
                this.addStoryMarkers(stories);

                // Zobrazení informace o počtu nalezených příběhů
                addMessage(`Nalezeno ${stories.length} příběhů z oblasti ${locationName}.`, false);

                // Přidání XP za objevení příběhů
                if (stories.length > 0 && typeof UserProgress !== 'undefined') {
                    UserProgress.addExperience(10 * stories.length, `Objevení ${stories.length} příběhů z oblasti ${locationName}`);
                }
            })
            .catch(error => {
                console.error('Chyba při získávání názvu oblasti:', error);
                addMessage('Nepodařilo se získat příběhy z této oblasti. Zkuste to prosím znovu.', false);
            });
    },

    // Získání názvu oblasti podle souřadnic
    getLocationName(lat, lng) {
        return new Promise((resolve, reject) => {
            // Použití Nominatim API pro získání názvu oblasti
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    let locationName = 'Neznámá oblast';

                    if (data && data.address) {
                        // Pokus o získání názvu města nebo obce
                        if (data.address.city) {
                            locationName = data.address.city;
                        } else if (data.address.town) {
                            locationName = data.address.town;
                        } else if (data.address.village) {
                            locationName = data.address.village;
                        } else if (data.address.county) {
                            locationName = data.address.county;
                        } else if (data.address.state) {
                            locationName = data.address.state;
                        }
                    }

                    resolve(locationName);
                })
                .catch(error => {
                    console.error('Chyba při získávání názvu oblasti:', error);
                    reject(error);
                });
        });
    },

    // Získání příběhů pro danou oblast
    getStoriesForLocation(locationName) {
        // Slovník příběhů pro různé oblasti
        const storiesByLocation = {
            'Praha': [
                {
                    title: 'Golem rabbiho Löwa',
                    content: 'Podle legendy vytvořil rabbi Löw v 16. století umělého člověka z hlíny - Golema, který měl chránit židovskou komunitu. Golem byl oživen tím, že mu rabbi vložil do úst pergamen se šémem (Božím jménem). Když Golem začal být nebezpečný, rabbi mu pergamen vyjmul a Golem se rozpadl na prach. Říká se, že pozůstatky Golema jsou dodnes ukryty na půdě Staronové synagogy.',
                    location: { lat: 50.0902, lng: 14.4195 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Staronova_synagoga2.jpg/320px-Staronova_synagoga2.jpg'
                },
                {
                    title: 'Bruncvíkův meč',
                    content: 'Podle pověsti je pod Karlým mostem ukrytý meč bájného knížete Bruncvíka. Až bude českému národu nejhůře, přijde sv. Václav v čele vojska blanických rytířů, vyzvedne Bruncvíkův meč a zachrání český národ před nepřáteli.',
                    location: { lat: 50.0865, lng: 14.4115 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Charles_Bridge_Prague_from_Petrin_Tower_7343.jpg/320px-Charles_Bridge_Prague_from_Petrin_Tower_7343.jpg'
                },
                {
                    title: 'Faustuv dům',
                    content: 'V domě na Karlově náměstí č. 40 žil podle pověsti doktor Faust, který upsal svou duši ďáblu. Jednoho dne si pro něj ďábel přišel a odnesl ho dírou ve stropě přímo do pekla. Tato díra se prý nikdy nedala opravit a vždy se znovu objevila.',
                    location: { lat: 50.0785, lng: 14.4205 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Faust_house_Prague_CZ_001.jpg/320px-Faust_house_Prague_CZ_001.jpg'
                }
            ],
            'Brno': [
                {
                    title: 'Brněnský drak',
                    content: 'V Brně na radnici visí vycpaný krokodýl, kterému se říká brněnský drak. Podle legendy terárizoval město a jeho okolí, až ho nakonec přemohl odvážný řezník, který mu podstrčil voličí kůži naplněnou vápnem. Když drak kůži sežral a napil se vody, vápno začalo reagovat a drak pukl.',
                    location: { lat: 49.1951, lng: 16.6068 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Brno-Krokodyl.jpg/320px-Brno-Krokodyl.jpg'
                },
                {
                    title: 'Proč zvoní poledne v Brně v 11 hodin',
                    content: 'Během třicetileté války obléhali Brno Švédové. Jejich velitel prohlásil, že pokud se mu nepodaří dobýt město do poledne, odtáhne. Brňané se rozhodli zazvonit poledne už v 11 hodin, čímž Švédy oklamali. Ti skutečně odtáhli a od té doby zvoní v Brně poledne už v 11 hodin.',
                    location: { lat: 49.1944, lng: 16.6080 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Brno%2C_Petrov%2C_katedr%C3%A1la_01.jpg/320px-Brno%2C_Petrov%2C_katedr%C3%A1la_01.jpg'
                }
            ],
            'Olomouc': [
                {
                    title: 'Sloup Nejsvětější Trojice',
                    content: 'Monumentální barokní sloup byl postaven na počest víry během morové epidemie v letech 1714-1716. Podle legendy, když byl sloup dokončen, mor ve městě ustal. Sloup je zapsán na seznamu UNESCO a obsahuje 18 soch světců.',
                    location: { lat: 49.5938, lng: 17.2509 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Olomouc_-_Holy_Trinity_Column_1.jpg/320px-Olomouc_-_Holy_Trinity_Column_1.jpg'
                }
            ],
            'Plzeň': [
                {
                    title: 'Andělíček v katedrále sv. Bartoloměje',
                    content: 'Na jednom z pilířů katedrály sv. Bartoloměje je umístěna soška andělíčka. Podle pověsti, pokud se ho dotknete, splní se vám tajné přání. Především v lásce. Proto je andělíček oblíbeným cílem zamilovaných párů.',
                    location: { lat: 49.7475, lng: 13.3775 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Plze%C5%88%2C_katedr%C3%A1la_sv._Bartolom%C4%9Bje%2C_and%C4%9Bl%C3%AD%C4%8Dek.jpg/320px-Plze%C5%88%2C_katedr%C3%A1la_sv._Bartolom%C4%9Bje%2C_and%C4%9Bl%C3%AD%C4%8Dek.jpg'
                }
            ],
            'Český Krumlov': [
                {
                    title: 'Bílá paní na zámku',
                    content: 'Podle legendy se na zámku v Českém Krumlově zjevuje duch Perchty z Rožmberka, známé jako Bílá paní. Perchta byla provdána proti své vůli a její manžel s ní špatně zacházel. Na smrtelné posteli jí odmítl odpustit, a tak jeho duše nenašla klid. Nyní se zjevuje jako ochránkyně rodu Rožmberků a přináší dobré zprávy, když se objeví s úsměvem, a špatné, když se mračí.',
                    location: { lat: 48.8127, lng: 14.3152 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Cesky_Krumlov_Castle_view_from_bridge.jpg/320px-Cesky_Krumlov_Castle_view_from_bridge.jpg'
                }
            ]
        };

        // Pokud existují příběhy pro danou oblast, vrátíme je
        if (storiesByLocation[locationName]) {
            return storiesByLocation[locationName];
        }

        // Pokud neexistují příběhy pro konkrétní oblast, vrátíme obecné příběhy
        return [
            {
                title: 'Tajemný poklad',
                content: `Podle místní legendy je v oblasti ${locationName} ukrytý poklad, který zde zanechal bohatý šlechtic před mnoha staletími. Mnoho lidí se ho pokoušelo najít, ale zatím bez úspěchu. Říká se, že poklad může najít pouze člověk s čistým srdcem, který ho nebude chtít pro sebe, ale pro dobro ostatních.`,
                location: { lat: lat, lng: lng },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Treasure_chest_illustration.jpg/320px-Treasure_chest_illustration.jpg'
            },
            {
                title: 'Zjevení v mlze',
                content: `Místní obyvatelé oblasti ${locationName} vyprávějí o podivném zjevení, které se objevuje za mlhavých nocí. Někteří tvrdí, že jde o ducha dávného obyvatele, jiní věří, že jde o ochránce místa. Ti, kteří ho spatřili, popisují postavu v bílém rouchu, která se vznáší nad zemí a mizí, když se k ní někdo přiblíží.`,
                location: { lat: lat + 0.01, lng: lng + 0.01 },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Fog_1.jpg/320px-Fog_1.jpg'
            },
            {
                title: 'Strom přání',
                content: `V oblasti ${locationName} roste podle pověsti strom, který dokáže plnit přání. Musíte k němu přijít o úplňku, třikrát ho obejít proti směru hodinových ručiček a potichu vyslovit své přání. Pokud je vaše přání čisté a nesobecké, do roka a do dne se splní.`,
                location: { lat: lat - 0.01, lng: lng - 0.01 },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Wishing_tree%2C_Argyll%2C_Scotland.jpg/320px-Wishing_tree%2C_Argyll%2C_Scotland.jpg'
            }
        ];
    },

    // Zobrazení modalu s příběhy
    showStoriesModal(locationName, stories) {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('storiesModal')) {
            return;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'storiesModal';
        modal.className = 'stories-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="stories-modal-content">
                <div class="stories-modal-header">
                    <h2>Příběhy z oblasti ${locationName}</h2>
                    <button class="stories-modal-close">&times;</button>
                </div>
                <div class="stories-modal-body">
                    ${stories.length > 0 ? `
                        <div class="stories-list">
                            ${stories.map((story, index) => `
                                <div class="story-item" data-index="${index}">
                                    <div class="story-item-header">
                                        <h3>${story.title}</h3>
                                        <button class="story-item-toggle">+</button>
                                    </div>
                                    <div class="story-item-content">
                                        ${story.image ? `<img src="${story.image}" alt="${story.title}" class="story-image">` : ''}
                                        <p>${story.content}</p>
                                        <button class="story-item-show-on-map" data-lat="${story.location.lat}" data-lng="${story.location.lng}">Ukázat na mapě</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="stories-empty">Pro tuto oblast nebyly nalezeny žádné příběhy.</div>
                    `}
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
        const closeButton = modal.querySelector('.stories-modal-close');
        const storyItems = modal.querySelectorAll('.story-item');
        const showOnMapButtons = modal.querySelectorAll('.story-item-show-on-map');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        // Přidání event listenerů pro přepínání zobrazení příběhů
        if (storyItems) {
            storyItems.forEach(item => {
                const toggleButton = item.querySelector('.story-item-toggle');
                const content = item.querySelector('.story-item-content');

                if (toggleButton && content) {
                    toggleButton.addEventListener('click', () => {
                        // Přepínání zobrazení obsahu
                        if (content.style.display === 'block') {
                            content.style.display = 'none';
                            toggleButton.textContent = '+';
                        } else {
                            content.style.display = 'block';
                            toggleButton.textContent = '-';
                        }
                    });
                }
            });
        }

        // Přidání event listenerů pro tlačítka "Ukázat na mapě"
        if (showOnMapButtons) {
            showOnMapButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const lat = parseFloat(button.getAttribute('data-lat'));
                    const lng = parseFloat(button.getAttribute('data-lng'));

                    if (!isNaN(lat) && !isNaN(lng)) {
                        // Přesun mapy na danou lokaci
                        map.setView([lat, lng], 16);

                        // Zavření modalu
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.remove();
                        }, 300);
                    }
                });
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

    // Přidání markerů příběhů na mapu
    addStoryMarkers(stories) {
        // Odstranění existujících markerů příběhů
        if (this.storyMarkers) {
            this.storyMarkers.forEach(marker => map.removeLayer(marker));
        }

        // Vytvoření nového pole pro markery
        this.storyMarkers = [];

        // Přidání markerů pro každý příběh
        stories.forEach(story => {
            // Vytvoření markeru
            const marker = L.marker([story.location.lat, story.location.lng], {
                icon: L.divIcon({
                    className: 'story-marker',
                    html: `<div class="story-marker-inner">📜</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                })
            }).addTo(map);

            // Vytvoření popup okna
            marker.bindPopup(`
                <div class="story-popup">
                    <h3>${story.title}</h3>
                    <p>${story.content.substring(0, 100)}...</p>
                    <button class="story-popup-read-more" onclick="CommandsMenu.showStoryDetails('${story.title}', '${story.content.replace(/'/g, "\\'")}'${story.image ? `, '${story.image}'` : ''})">Přečíst celý příběh</button>
                </div>
            `);

            // Přidání markeru do pole
            this.storyMarkers.push(marker);
        });

        // Přidání tlačítka pro skrytí markerů příběhů
        this.addHideStoriesButton();
    },

    // Zobrazení místních specialit
    showLocalFood() {
        // Zobrazení informace o načítání místních specialit
        addMessage('Hledám místní speciality...', false);

        // Získání aktuální polohy
        const center = map.getCenter();

        // Získání názvu oblasti
        this.getLocationName(center.lat, center.lng)
            .then(locationName => {
                // Získání specialit pro danou oblast
                const specialities = this.getFoodForLocation(locationName);

                // Zobrazení modalu s místními specialitami
                this.showFoodModal(locationName, specialities);

                // Přidání markerů restaurací na mapu
                this.addRestaurantMarkers(specialities);

                // Zobrazení informace o počtu nalezených specialit
                addMessage(`Nalezeno ${specialities.length} místních specialit z oblasti ${locationName}.`, false);

                // Přidání XP za objevení místních specialit
                if (specialities.length > 0 && typeof UserProgress !== 'undefined') {
                    UserProgress.addExperience(8 * specialities.length, `Objevení ${specialities.length} místních specialit z oblasti ${locationName}`);
                }
            })
            .catch(error => {
                console.error('Chyba při získávání názvu oblasti:', error);
                addMessage('Nepodařilo se získat místní speciality z této oblasti. Zkuste to prosím znovu.', false);
            });
    },

    // Získání specialit pro danou oblast
    getFoodForLocation(locationName) {
        // Slovník specialit pro různé oblasti
        const foodByLocation = {
            'Praha': [
                {
                    name: 'Svičková na smetaně',
                    description: 'Tradiční české jídlo z hovězího masa s krémovou omáčkou ze zeleniny a zakysané smetany, podávané s houskovým knedlíkem, brusinkami a šlehačkou.',
                    type: 'main',
                    price: '189 Kč',
                    restaurant: 'U Fleku',
                    address: 'Křemencova 11, Praha 1',
                    location: { lat: 50.0813, lng: 14.4179 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Svickova_na_smetane.JPG/320px-Svickova_na_smetane.JPG'
                },
                {
                    name: 'Trdelník',
                    description: 'Sladké pečivo z kynutého těsta, které se peče na válci nad žhavými uhlíky a posypává směsí cukru a skořice. Oblíbená turistická pochoutka v centru Prahy.',
                    type: 'dessert',
                    price: '90 Kč',
                    restaurant: 'Trdlo',
                    address: 'Karlova 42, Praha 1',
                    location: { lat: 50.0858, lng: 14.4185 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/K%C3%BCrt%C5%91skal%C3%A1cs_in_Prague.jpg/320px-K%C3%BCrt%C5%91skal%C3%A1cs_in_Prague.jpg'
                },
                {
                    name: 'Pilsner Urquell',
                    description: 'Světoznámý český ležák, který se začal vařit v Plzni v roce 1842. Jde o světlý ležák plné chuti s výraznou hořkostí.',
                    type: 'drink',
                    price: '55 Kč',
                    restaurant: 'Lokál Dlouhá',
                    address: 'Dlouhá 33, Praha 1',
                    location: { lat: 50.0905, lng: 14.4248 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Pilsner_Urquell_mug.jpg/320px-Pilsner_Urquell_mug.jpg'
                }
            ],
            'Brno': [
                {
                    name: 'Bramborák',
                    description: 'Smažené bramborové placky s česnekem a majoránkou. V Brně se často podávají jako příloha k masům nebo samostatně s kyselým zelím.',
                    type: 'main',
                    price: '85 Kč',
                    restaurant: 'Pegas',
                    address: 'Jakubské náměstí 4, Brno',
                    location: { lat: 49.1969, lng: 16.6082 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Kartoffelpuffer.jpg/320px-Kartoffelpuffer.jpg'
                },
                {
                    name: 'Starobrno',
                    description: 'Místní brněnské pivo s historií sahající do roku 1325. Jde o světlý ležák s jemnou hořkostí a sladkým dozvukem.',
                    type: 'drink',
                    price: '45 Kč',
                    restaurant: 'Starobrno Brewery',
                    address: 'Mendlovo náměstí 20, Brno',
                    location: { lat: 49.1905, lng: 16.5958 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Starobrno_logo.svg/320px-Starobrno_logo.svg.png'
                }
            ],
            'Plzeň': [
                {
                    name: 'Plzeňský Prazdroj',
                    description: 'Originální plzeňský ležák přímo z místa jeho vzniku. Nejlépe chutná čerstvě natočený v pivovaru Plzeňský Prazdroj.',
                    type: 'drink',
                    price: '50 Kč',
                    restaurant: 'Na Parkánu',
                    address: 'Veleslavínova 4, Plzeň',
                    location: { lat: 49.7477, lng: 13.3755 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Pilsner_Urquell_logo.svg/320px-Pilsner_Urquell_logo.svg.png'
                },
                {
                    name: 'Plzeňské vdolky',
                    description: 'Tradiční sladké pečivo z kynutého těsta, které se plní tvarohem a povidly a zdobí šlehačkou.',
                    type: 'dessert',
                    price: '65 Kč',
                    restaurant: 'Cukrárna Romance',
                    address: 'Americká 8, Plzeň',
                    location: { lat: 49.7456, lng: 13.3772 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Moravsk%C3%A9_kolace.jpg/320px-Moravsk%C3%A9_kolace.jpg'
                }
            ],
            'Český Krumlov': [
                {
                    name: 'Krumlovský medový dort',
                    description: 'Specialita Českého Krumlova - dort s medovými plásty, ořechy a šlehačkou. Recept je tajný a předává se z generace na generaci.',
                    type: 'dessert',
                    price: '95 Kč',
                    restaurant: 'Cukrárna pod zámkem',
                    address: 'Radniční 29, Český Krumlov',
                    location: { lat: 48.8110, lng: 14.3155 },
                    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Medovnik.jpg/320px-Medovnik.jpg'
                }
            ]
        };

        // Pokud existují speciality pro danou oblast, vrátíme je
        if (foodByLocation[locationName]) {
            return foodByLocation[locationName];
        }

        // Pokud neexistují speciality pro konkrétní oblast, vrátíme obecné české speciality
        return [
            {
                name: 'Guláš s knedlíkem',
                description: `Tradiční český guláš z hovězího masa s cibulí a paprikou, podávaný s houskovým knedlíkem. Oblíbené jídlo v oblasti ${locationName}.`,
                type: 'main',
                price: '165 Kč',
                restaurant: `Restaurace U Zlatého lva`,
                address: `Hlavní náměstí, ${locationName}`,
                location: { lat: center.lat + 0.002, lng: center.lng + 0.002 },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Guly%C3%A1s.jpg/320px-Guly%C3%A1s.jpg'
            },
            {
                name: 'Smažený sýr',
                description: `Obalovaný a smažený sýr eidam nebo hermelín, podávaný s hranolky a tatarskou omáčkou. Velmi populární jídlo v celé České republice, včetně oblasti ${locationName}.`,
                type: 'main',
                price: '155 Kč',
                restaurant: `Hospoda Na Rozcestí`,
                address: `Nádražní 15, ${locationName}`,
                location: { lat: center.lat - 0.002, lng: center.lng - 0.002 },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Sma%C5%BEen%C3%BD_s%C3%BDr%2C_hranolky%2C_tatarka_1.jpg/320px-Sma%C5%BEen%C3%BD_s%C3%BDr%2C_hranolky%2C_tatarka_1.jpg'
            },
            {
                name: 'Kozel',
                description: `Oblíbené české pivo, které se často čepuje v oblasti ${locationName}. Jde o světlý ležák s jemnou hořkostí a plnou chutí.`,
                type: 'drink',
                price: '45 Kč',
                restaurant: `Pivnice U Černého orla`,
                address: `Dolní 8, ${locationName}`,
                location: { lat: center.lat + 0.001, lng: center.lng - 0.001 },
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Velkopopovick%C3%BD_Kozel_logo.svg/320px-Velkopopovick%C3%BD_Kozel_logo.svg.png'
            }
        ];
    },

    // Zobrazení modalu s místními specialitami
    showFoodModal(locationName, specialities) {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('foodModal')) {
            return;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'foodModal';
        modal.className = 'food-modal';

        // Rozdělení specialit podle typu
        const mainDishes = specialities.filter(item => item.type === 'main');
        const desserts = specialities.filter(item => item.type === 'dessert');
        const drinks = specialities.filter(item => item.type === 'drink');

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="food-modal-content">
                <div class="food-modal-header">
                    <h2>Místní speciality z oblasti ${locationName}</h2>
                    <button class="food-modal-close">&times;</button>
                </div>
                <div class="food-modal-body">
                    ${specialities.length > 0 ? `
                        <div class="food-categories">
                            ${mainDishes.length > 0 ? `
                                <div class="food-category">
                                    <h3>Hlavní jídla</h3>
                                    <div class="food-items">
                                        ${mainDishes.map(item => this.createFoodItemHTML(item)).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            ${desserts.length > 0 ? `
                                <div class="food-category">
                                    <h3>Dezerty</h3>
                                    <div class="food-items">
                                        ${desserts.map(item => this.createFoodItemHTML(item)).join('')}
                                    </div>
                                </div>
                            ` : ''}

                            ${drinks.length > 0 ? `
                                <div class="food-category">
                                    <h3>Nápoje</h3>
                                    <div class="food-items">
                                        ${drinks.map(item => this.createFoodItemHTML(item)).join('')}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    ` : `
                        <div class="food-empty">Pro tuto oblast nebyly nalezeny žádné místní speciality.</div>
                    `}
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
        const closeButton = modal.querySelector('.food-modal-close');
        const showOnMapButtons = modal.querySelectorAll('.food-item-show-on-map');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        // Přidání event listenerů pro tlačítka "Ukázat na mapě"
        if (showOnMapButtons) {
            showOnMapButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const lat = parseFloat(button.getAttribute('data-lat'));
                    const lng = parseFloat(button.getAttribute('data-lng'));

                    if (!isNaN(lat) && !isNaN(lng)) {
                        // Přesun mapy na danou lokaci
                        map.setView([lat, lng], 16);

                        // Zavření modalu
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.remove();
                        }, 300);
                    }
                });
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

    // Vytvoření HTML pro položku jídla
    createFoodItemHTML(item) {
        return `
            <div class="food-item">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="food-image">` : ''}
                <div class="food-item-info">
                    <h4>${item.name}</h4>
                    <p class="food-item-description">${item.description}</p>
                    <p class="food-item-price"><strong>Cena:</strong> ${item.price}</p>
                    <p class="food-item-restaurant"><strong>Kde ochutnat:</strong> ${item.restaurant}, ${item.address}</p>
                    <button class="food-item-show-on-map" data-lat="${item.location.lat}" data-lng="${item.location.lng}">Ukázat restauraci na mapě</button>
                </div>
            </div>
        `;
    },

    // Přidání markerů restaurací na mapu
    addRestaurantMarkers(specialities) {
        // Odstranění existujících markerů restaurací
        if (this.restaurantMarkers) {
            this.restaurantMarkers.forEach(marker => map.removeLayer(marker));
        }

        // Vytvoření nového pole pro markery
        this.restaurantMarkers = [];

        // Získání unikátních restaurací (odstranění duplicit)
        const uniqueRestaurants = [];
        const restaurantNames = new Set();

        specialities.forEach(item => {
            if (!restaurantNames.has(item.restaurant)) {
                restaurantNames.add(item.restaurant);
                uniqueRestaurants.push({
                    name: item.restaurant,
                    address: item.address,
                    location: item.location,
                    specialities: [item]
                });
            } else {
                // Přidání speciality k existující restauraci
                const restaurant = uniqueRestaurants.find(r => r.name === item.restaurant);
                if (restaurant) {
                    restaurant.specialities.push(item);
                }
            }
        });

        // Přidání markerů pro každou restauraci
        uniqueRestaurants.forEach(restaurant => {
            // Vytvoření markeru
            const marker = L.marker([restaurant.location.lat, restaurant.location.lng], {
                icon: L.divIcon({
                    className: 'restaurant-marker',
                    html: `<div class="restaurant-marker-inner">🍽️</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                })
            }).addTo(map);

            // Vytvoření popup okna
            marker.bindPopup(`
                <div class="restaurant-popup">
                    <h3>${restaurant.name}</h3>
                    <p>${restaurant.address}</p>
                    <h4>Speciality:</h4>
                    <ul>
                        ${restaurant.specialities.map(item => `<li>${item.name} (${item.price})</li>`).join('')}
                    </ul>
                    <button class="restaurant-popup-details" onclick="CommandsMenu.showRestaurantDetails('${restaurant.name}', '${restaurant.address}', ${JSON.stringify(restaurant.specialities).replace(/'/g, "\\'")}, ${restaurant.location.lat}, ${restaurant.location.lng})">Zobrazit detaily</button>
                </div>
            `);

            // Přidání markeru do pole
            this.restaurantMarkers.push(marker);
        });

        // Přidání tlačítka pro skrytí markerů restaurací
        this.addHideRestaurantsButton();
    },

    // Přidání tlačítka pro skrytí markerů restaurací
    addHideRestaurantsButton() {
        // Odstranění existujícího tlačítka
        const existingButton = document.getElementById('hideRestaurantsButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'hideRestaurantsButton';
        button.className = 'hide-restaurants-button';
        button.innerHTML = 'Skrýt restaurace';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);

        // Přidání event listeneru
        button.addEventListener('click', () => {
            // Odstranění markerů restaurací
            if (this.restaurantMarkers) {
                this.restaurantMarkers.forEach(marker => map.removeLayer(marker));
                this.restaurantMarkers = [];
            }

            // Odstranění tlačítka
            button.remove();

            // Zobrazení informace o skrytí restaurací
            addMessage('Restaurace byly skryty.', false);
        });
    },

    // Přidání tlačítka pro skrytí markerů příběhů
    addHideStoriesButton() {
        // Odstranění existujícího tlačítka
        const existingButton = document.getElementById('hideStoriesButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'hideStoriesButton';
        button.className = 'hide-stories-button';
        button.innerHTML = 'Skrýt příběhy';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);

        // Přidání event listeneru
        button.addEventListener('click', () => {
            // Odstranění markerů příběhů
            if (this.storyMarkers) {
                this.storyMarkers.forEach(marker => map.removeLayer(marker));
                this.storyMarkers = [];
            }

            // Odstranění tlačítka
            button.remove();

            // Zobrazení informace o skrytí příběhů
            addMessage('Příběhy byly skryty.', false);
        });
    },

    // Získání produktů podle typu obchodu
    getShopProducts(shopType) {
        switch (shopType) {
            case 'energy-drinks':
                return [
                    {
                        name: 'Monster Energy Ultra',
                        price: 49,
                        icon: '⚡',
                        description: 'Nulový obsah cukru, plná dávka kofeinu a taurin pro maximální výkon. Svěží citrusová příchuť.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/monster-ultra-paradise-500ml.png'
                    },
                    {
                        name: 'Red Bull Energy Drink',
                        price: 45,
                        icon: '⚡',
                        description: 'Originální energetický nápoj, který ti dává křídla. Obsahuje taurin, kofein a vitaminy skupiny B.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/red-bull-energy-drink-250ml.png'
                    },
                    {
                        name: 'Prime Energy Drink',
                        price: 89,
                        icon: '⚡',
                        description: 'Limitovaná edice energetického nápoje od Logan Paula a KSI. Obsahuje BCAA, elektrolyty a 200mg kofeinu.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/prime-energy-drink-tropical-punch-355ml.png'
                    },
                    {
                        name: 'Bang Energy',
                        price: 69,
                        icon: '⚡',
                        description: 'Super silný energetický nápoj s 300mg kofeinu, BCAA a CoQ10. Bez cukru a kalorií.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/bang-energy-rainbow-unicorn-500ml.png'
                    },
                    {
                        name: 'Reign Total Body Fuel',
                        price: 59,
                        icon: '⚡',
                        description: 'Fitness energetický nápoj s BCAA, L-argininem a 300mg kofeinu. Ideální před tréninkem.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/reign-total-body-fuel-melon-mania-500ml.png'
                    },
                    {
                        name: 'Monster Energy Pipeline Punch',
                        price: 55,
                        icon: '⚡',
                        description: 'Ovocný energetický nápoj s příchutí marakuji, broskve a ananasu. Plná dávka energie.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/monster-energy-pipeline-punch-500ml.png'
                    },
                    {
                        name: 'Rockstar Energy Original',
                        price: 39,
                        icon: '⚡',
                        description: 'Klasický energetický nápoj s vysokou dávkou kofeinu a taurinu. Pro všechny, kdo jedou na plný plyn.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/rockstar-energy-original-500ml.png'
                    },
                    {
                        name: 'Hell Energy Classic',
                        price: 35,
                        icon: '⚡',
                        description: 'Cenově dostupný energetický nápoj s klasickou příchutí. Obsahuje kofein, taurin a vitaminy.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/hell-energy-classic-250ml.png'
                    },
                    {
                        name: 'Monster Energy Mega Pack',
                        price: 249,
                        icon: '⚡',
                        description: 'Balíček 6 plechovek Monster Energy. Ideální pro herní maraton nebo dlouhé noční programování.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/monster-energy-mega-pack-6x500ml.png'
                    },
                    {
                        name: 'Energetický shot 5-Hour Energy',
                        price: 79,
                        icon: '⚡',
                        description: 'Koncentrovaný energetický shot s dlouhotrvajícím účinkem. Bez cukru, pouze 4 kalorie.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/5-hour-energy-extra-strength-berry-57ml.png'
                    }
                ];
            case 'krkovicka':
                return [
                    {
                        name: 'Vepřová krkovička bez kosti (1kg)',
                        price: 199,
                        icon: '🥩',
                        description: 'Kvalitní česká vepřová krkovička bez kosti. Ideální na gril nebo pečení. Šťavnatá a plna chuti.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/veprova-krkovicka-bez-kosti-1kg.png'
                    },
                    {
                        name: 'Marináda na krkovičku - česneková',
                        price: 59,
                        icon: '🌿',
                        description: 'Domácí česneková marináda s bylinkami. Dodá vaší krkovičce nezaměnitelné aroma a chuť.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/marinada-na-krkovicku-cesnekova-250ml.png'
                    },
                    {
                        name: 'Marináda na krkovičku - BBQ',
                        price: 59,
                        icon: '🌿',
                        description: 'Sladká a kořeněná BBQ marináda. Ideální pro grilovaní krkovičky v americkém stylu.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/marinada-na-krkovicku-bbq-250ml.png'
                    },
                    {
                        name: 'Krkovička na grilu - hotové jídlo',
                        price: 159,
                        icon: '🍖',
                        description: 'Hotová grilovaná krkovička s přílohou. Stačí ohřát a můžete servírovat.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/krkovicka-na-grilu-hotove-jidlo-400g.png'
                    },
                    {
                        name: 'Krkovička s kostí (1kg)',
                        price: 179,
                        icon: '🥩',
                        description: 'Tradiční vepřová krkovička s kostí. Perfektní pro pečení v troubě nebo na grilu.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/veprova-krkovicka-s-kosti-1kg.png'
                    },
                    {
                        name: 'Krkovička plněná sýrem a šunkou (500g)',
                        price: 149,
                        icon: '🥩',
                        description: 'Speciální krkovička plněná sýrem a šunkou. Lahodná kombinace chutí pro speciální příležitosti.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/krkovicka-plnena-syrem-a-sunkou-500g.png'
                    },
                    {
                        name: 'Grilovací balíček - krkovička a kuřecí',
                        price: 299,
                        icon: '🍗',
                        description: 'Mix krkovičky a kuřecího masa na gril. Ideální pro rodinné grilování.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/grilovaci-balicek-krkovicka-a-kureci-1kg.png'
                    },
                    {
                        name: 'Koření na krkovičku',
                        price: 49,
                        icon: '🌿',
                        description: 'Speciální směs koření pro přípravu dokonalé krkovičky. Obsahuje papriku, česnek, kmín a další bylinky.',
                        image: 'https://www.podpultovky.cz/wp-content/uploads/2023/05/koreni-na-krkovicku-50g.png'
                    }
                ];
            case 'supermarket':
                return [
                    { name: 'Chléb', price: 35, icon: '🍞' },
                    { name: 'Mléko', price: 25, icon: '🥛' },
                    { name: 'Vejce (10ks)', price: 60, icon: '🥚' },
                    { name: 'Sýr', price: 89, icon: '🧀' },
                    { name: 'Jablka (1kg)', price: 45, icon: '🍎' },
                    { name: 'Banány (1kg)', price: 39, icon: '🍌' },
                    { name: 'Kuřecí maso (1kg)', price: 159, icon: '🍗' },
                    { name: 'Těstoviny', price: 29, icon: '🍝' },
                    { name: 'Rýže (1kg)', price: 49, icon: '🍚' },
                    { name: 'Brambory (2kg)', price: 39, icon: '🥔' }
                ];
            case 'bakery':
                return [
                    { name: 'Chléb', price: 35, icon: '🍞' },
                    { name: 'Rohlík', price: 3, icon: '🍞' },
                    { name: 'Croissant', price: 25, icon: '🥐' },
                    { name: 'Kobliha', price: 20, icon: '🍩' },
                    { name: 'Koláč', price: 30, icon: '🥧' },
                    { name: 'Bageta', price: 40, icon: '🍞' },
                    { name: 'Muffin', price: 35, icon: '🥮' },
                    { name: 'Dort', price: 250, icon: '🎂' }
                ];
            case 'butcher':
                return [
                    { name: 'Kuřecí prsa (1kg)', price: 159, icon: '🍗' },
                    { name: 'Vepřová kotleta (1kg)', price: 189, icon: '🍖' },
                    { name: 'Hovězí mleté (1kg)', price: 199, icon: '🍖' },
                    { name: 'Kuřecí křídla (1kg)', price: 99, icon: '🍗' },
                    { name: 'Šunka (100g)', price: 29, icon: '🍖' },
                    { name: 'Salám (100g)', price: 25, icon: '🍖' },
                    { name: 'Párky (10ks)', price: 69, icon: '🌭' }
                ];
            case 'electronics':
                return [
                    { name: 'Smartphone', price: 5999, icon: '📱' },
                    { name: 'Sluchátka', price: 999, icon: '🎧' },
                    { name: 'Nabíječka', price: 499, icon: '🔌' },
                    { name: 'USB flash disk', price: 299, icon: '💾' },
                    { name: 'Powerbank', price: 799, icon: '🔋' },
                    { name: 'Tablet', price: 4999, icon: '💻' },
                    { name: 'Bluetooth reproduktor', price: 1299, icon: '🔊' }
                ];
            case 'clothes':
                return [
                    { name: 'Tričko', price: 299, icon: '👕' },
                    { name: 'Kalhoty', price: 699, icon: '👖' },
                    { name: 'Mikina', price: 799, icon: '🧥' },
                    { name: 'Šaty', price: 999, icon: '👗' },
                    { name: 'Bunda', price: 1499, icon: '🥼' },
                    { name: 'Ponožky', price: 99, icon: '🧦' },
                    { name: 'Čepice', price: 249, icon: '🧤' }
                ];
            default:
                return [
                    { name: 'Produkt 1', price: 99, icon: '🛍️' },
                    { name: 'Produkt 2', price: 199, icon: '🛍️' },
                    { name: 'Produkt 3', price: 299, icon: '🛍️' },
                    { name: 'Produkt 4', price: 399, icon: '🛍️' },
                    { name: 'Produkt 5', price: 499, icon: '🛍️' }
                ];
        }
    },

    // Zobrazení obchodů v okolí s možností online nákupu
    showNearbyShops() {
        // Zobrazení informace o vyhledávání obchodů
        addMessage('Vyhledávám obchody v okolí...', false);

        // Získání aktuální polohy
        const center = map.getCenter();

        // Vytvoření URL pro API požadavek (použití Overpass API pro OpenStreetMap)
        const radius = 2000; // 2 km radius
        const overpassUrl = 'https://overpass-api.de/api/interpreter';

        // Vytvoření dotazu pro Overpass API
        const query = `
            [out:json];
            (
                node["shop"](around:${radius},${center.lat},${center.lng});
                way["shop"](around:${radius},${center.lat},${center.lng});
                relation["shop"](around:${radius},${center.lat},${center.lng});
            );
            out body;
            >;
            out skel qt;
        `;

        // Odeslání požadavku
        fetch(overpassUrl, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => response.json())
        .then(data => {
            // Odstranění existujících markerů obchodů
            if (this.shopMarkers) {
                this.shopMarkers.forEach(marker => map.removeLayer(marker));
            }

            // Vytvoření nového pole pro markery
            this.shopMarkers = [];

            // Kontrola, zda byly nalezeny nějaké obchody
            if (!data.elements || data.elements.length === 0) {
                addMessage('V okolí nebyly nalezeny žádné obchody.', false);
                return;
            }

            // Vytvoření markerů pro každý obchod
            const shops = data.elements.filter(element => element.tags && element.tags.shop);

            shops.forEach(shop => {
                // Kontrola, zda má obchod souřadnice
                if (!shop.lat || !shop.lon) {
                    return;
                }

                // Získání informací o obchodu
                const name = shop.tags.name || 'Neznámý obchod';
                const type = shop.tags.shop || 'obchod';
                const icon = this.getShopIcon(type);

                // Vytvoření markeru
                const marker = L.marker([shop.lat, shop.lon], {
                    icon: L.divIcon({
                        className: 'shop-marker',
                        html: `<div class="shop-marker-inner">${icon}</div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    })
                }).addTo(map);

                // Vytvoření popup okna
                marker.bindPopup(`
                    <div class="shop-popup">
                        <h3>${name}</h3>
                        <p>${this.getShopTypeName(type)}</p>
                        ${shop.tags.opening_hours ? `<p><strong>Otevíraci doba:</strong> ${shop.tags.opening_hours}</p>` : ''}
                        ${shop.tags.phone ? `<p><strong>Telefon:</strong> ${shop.tags.phone}</p>` : ''}
                        ${shop.tags.website ? `<p><a href="${shop.tags.website}" target="_blank">Webové stránky</a></p>` : ''}
                        <button class="shop-popup-button" onclick="CommandsMenu.showShopProducts('${name}', '${type}')">Zobrazit produkty</button>
                    </div>
                `);

                // Přidání markeru do pole
                this.shopMarkers.push(marker);
            });

            // Zobrazení informace o počtu nalezených obchodů
            addMessage(`Nalezeno ${this.shopMarkers.length} obchodů v okolí.`, false);

            // Přidání tlačítka pro skrytí obchodů
            this.addHideShopsButton();
        })
        .catch(error => {
            console.error('Chyba při získávání obchodů:', error);
            addMessage('Nepodařilo se získat obchody v okolí. Zkuste to prosím znovu.', false);
        });
    },

    // Přepnutí vrstvy s dopravními informacemi
    toggleTrafficInfo() {
        // Kontrola, zda je vrstva s dopravními informacemi aktivní
        if (this.trafficLayer) {
            // Odstranění vrstvy s dopravními informacemi
            map.removeLayer(this.trafficLayer);
            this.trafficLayer = null;

            // Zobrazení informace o vypnutí vrstvy s dopravními informacemi
            addMessage('Vrstva s dopravními informacemi byla vypnuta.', false);
        } else {
            // Zobrazení informace o načítání dopravních informací
            addMessage('Načítám dopravní informace...', false);

            // Přidání vrstvy s dopravními informacemi (použití Thunderforest Transport mapy)
            const apiKey = '13b858e4c2a14d2dba1f379e62322adf'; // Veřejný API klíč pro demonstrační účely
            this.trafficLayer = L.tileLayer(`https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=${apiKey}`, {
                maxZoom: 18,
                attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Zobrazení informace o zapnutí vrstvy s dopravními informacemi
            addMessage('Vrstva s dopravními informacemi byla aktivována. Nyní vidíte aktuální dopravní situaci, včetně MHD, vlaků a dalších dopravních prostředků.', false);

            // Přidání tlačítka pro vypnutí vrstvy s dopravními informacemi
            this.addHideTrafficButton();
        }
    },

    // Přidání tlačítka pro vypnutí vrstvy s dopravními informacemi
    addHideTrafficButton() {
        // Odstranění existujícího tlačítka
        const existingButton = document.getElementById('hideTrafficButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'hideTrafficButton';
        button.className = 'hide-traffic-button';
        button.innerHTML = 'Skrýt dopravní informace';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);

        // Přidání event listeneru
        button.addEventListener('click', () => {
            // Odstranění vrstvy s dopravními informacemi
            if (this.trafficLayer) {
                map.removeLayer(this.trafficLayer);
                this.trafficLayer = null;
            }

            // Odstranění tlačítka
            button.remove();

            // Zobrazení informace o vypnutí vrstvy s dopravními informacemi
            addMessage('Vrstva s dopravními informacemi byla vypnuta.', false);
        });
    },

    // Přepnutí vrstvy s turistickými trasami
    toggleHikingTrails() {
        // Kontrola, zda je vrstva s turistickými trasami aktivní
        if (this.hikingLayer) {
            // Odstranění vrstvy s turistickými trasami
            map.removeLayer(this.hikingLayer);
            this.hikingLayer = null;

            // Zobrazení informace o vypnutí vrstvy s turistickými trasami
            addMessage('Vrstva s turistickými trasami byla vypnuta.', false);
        } else {
            // Zobrazení informace o načítání turistických tras
            addMessage('Načítám turistické trasy...', false);

            // Přidání vrstvy s turistickými trasami (použití Thunderforest Outdoors mapy)
            const apiKey = '13b858e4c2a14d2dba1f379e62322adf'; // Veřejný API klíč pro demonstrační účely
            this.hikingLayer = L.tileLayer(`https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=${apiKey}`, {
                maxZoom: 18,
                attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Zobrazení informace o zapnutí vrstvy s turistickými trasami
            addMessage('Vrstva s turistickými trasami byla aktivována. Nyní vidíte turistické a cyklistické trasy v okolí.', false);

            // Přidání tlačítka pro vypnutí vrstvy s turistickými trasami
            this.addHideHikingButton();
        }
    },

    // Přidání tlačítka pro vypnutí vrstvy s turistickými trasami
    addHideHikingButton() {
        // Odstranění existujícího tlačítka
        const existingButton = document.getElementById('hideHikingButton');
        if (existingButton) {
            existingButton.remove();
        }

        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'hideHikingButton';
        button.className = 'hide-hiking-button';
        button.innerHTML = 'Skrýt turistické trasy';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);

        // Přidání event listeneru
        button.addEventListener('click', () => {
            // Odstranění vrstvy s turistickými trasami
            if (this.hikingLayer) {
                map.removeLayer(this.hikingLayer);
                this.hikingLayer = null;
            }

            // Odstranění tlačítka
            button.remove();

            // Zobrazení informace o vypnutí vrstvy s turistickými trasami
            addMessage('Vrstva s turistickými trasami byla vypnuta.', false);
        });
    },

    // Zobrazení informací o počasí v chatu
    displayWeatherInfo(weatherData) {
        // Kontrola dat
        if (!weatherData || !weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
            return;
        }

        // Formátování dat
        const temp = Math.round(weatherData.main.temp);
        const description = weatherData.weather[0].description;
        const cityName = weatherData.name;

        // Zobrazení informace v chatu
        addMessage(`Aktuální počasí v ${cityName}: ${temp}°C, ${description}`, false);
    },

    // Přepnutí nočního režimu mapy
    toggleNightMode() {
        // Kontrola, zda je noční režim aktivní
        const body = document.body;
        const isNightMode = body.getAttribute('data-map-night-mode') === 'true';

        if (isNightMode) {
            // Vypnutí nočního režimu
            body.setAttribute('data-map-night-mode', 'false');

            // Změna stylu mapy na denní
            if (map) {
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19
                }).addTo(map);
            }

            // Odstranění CSS filtru
            const mapContainer = document.querySelector('.leaflet-container');
            if (mapContainer) {
                mapContainer.style.filter = 'none';
            }

            // Zobrazení informace o vypnutí nočního režimu
            addMessage('Noční režim byl vypnut.', false);
        } else {
            // Zapnutí nočního režimu
            body.setAttribute('data-map-night-mode', 'true');

            // Změna stylu mapy na noční
            if (map) {
                L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
                    maxZoom: 19
                }).addTo(map);

                // Přidání CSS filtru pro tmavší vzhled
                const mapContainer = document.querySelector('.leaflet-container');
                if (mapContainer) {
                    mapContainer.style.filter = 'brightness(0.8) invert(1) contrast(1.2) hue-rotate(180deg) saturate(0.8)';
                }
            }

            // Zobrazení informace o zapnutí nočního režimu
            addMessage('Noční režim byl aktivován. Mapa je nyní optimalizována pro použití v noci.', false);
        }
    },

    // Zobrazení modalu s premium nabídkou
    showPremiumModal() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('premiumModal')) {
            return;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'premiumModal';
        modal.className = 'premium-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="premium-modal-content">
                <div class="premium-modal-header">
                    <h2>Premium verze</h2>
                    <button class="premium-modal-close">&times;</button>
                </div>
                <div class="premium-modal-body">
                    <div class="premium-icon">⭐</div>
                    <h3>Získejte více s Premium verzí</h3>
                    <p>Odemkněte všechny funkce a vylepšete svůj zážitek s mapou.</p>

                    <div class="premium-features">
                        <div class="premium-feature">
                            <div class="premium-feature-icon">🔄</div>
                            <div class="premium-feature-text">Neomezené trasy a body</div>
                        </div>
                        <div class="premium-feature">
                            <div class="premium-feature-icon">🌙</div>
                            <div class="premium-feature-text">Speciální tmavý režim</div>
                        </div>
                        <div class="premium-feature">
                            <div class="premium-feature-icon">🔔</div>
                            <div class="premium-feature-text">Upozornění a připomínky</div>
                        </div>
                        <div class="premium-feature">
                            <div class="premium-feature-icon">📊</div>
                            <div class="premium-feature-text">Pokročilé statistiky</div>
                        </div>
                    </div>

                    <button class="premium-upgrade-button">Upgradovat na Premium</button>
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
        const closeButton = modal.querySelector('.premium-modal-close');
        const upgradeButton = modal.querySelector('.premium-upgrade-button');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        if (upgradeButton) {
            upgradeButton.addEventListener('click', () => {
                alert('Děkujeme za zájem o Premium verzi! Tato funkce bude brzy k dispozici.');
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

// Statická metoda pro získání instance
CommandsMenu.getInstance = function() {
    return CommandsMenu;
};

// Statická metoda pro přístup k funkci showShopProducts z HTML
CommandsMenu.showShopProducts = function(shopName, shopType) {
    const instance = CommandsMenu.getInstance();
    if (instance) {
        instance.showShopProducts(shopName, shopType);
    }
};

// Statická metoda pro zobrazení detailů příběhu
CommandsMenu.showStoryDetails = function(title, content, image) {
    // Kontrola, zda již modal neexistuje
    if (document.getElementById('storyDetailsModal')) {
        return;
    }

    // Vytvoření modalu
    const modal = document.createElement('div');
    modal.id = 'storyDetailsModal';
    modal.className = 'story-details-modal';

    // Vytvoření obsahu modalu
    modal.innerHTML = `
        <div class="story-details-modal-content">
            <div class="story-details-modal-header">
                <h2>${title}</h2>
                <button class="story-details-modal-close">&times;</button>
            </div>
            <div class="story-details-modal-body">
                ${image ? `<img src="${image}" alt="${title}" class="story-details-image">` : ''}
                <p>${content}</p>
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
    const closeButton = modal.querySelector('.story-details-modal-close');

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

    // Přidání XP za přečtení příběhu
    if (typeof UserProgress !== 'undefined') {
        UserProgress.addExperience(5, `Přečtení příběhu: ${title}`);
    }
};

// Statická metoda pro zobrazení detailů restaurace
CommandsMenu.showRestaurantDetails = function(name, address, specialities, lat, lng) {
    // Kontrola, zda již modal neexistuje
    if (document.getElementById('restaurantDetailsModal')) {
        return;
    }

    // Vytvoření modalu
    const modal = document.createElement('div');
    modal.id = 'restaurantDetailsModal';
    modal.className = 'restaurant-details-modal';

    // Vytvoření obsahu modalu
    modal.innerHTML = `
        <div class="restaurant-details-modal-content">
            <div class="restaurant-details-modal-header">
                <h2>${name}</h2>
                <button class="restaurant-details-modal-close">&times;</button>
            </div>
            <div class="restaurant-details-modal-body">
                <p class="restaurant-details-address"><strong>Adresa:</strong> ${address}</p>

                <h3>Speciality:</h3>
                <div class="restaurant-details-specialities">
                    ${specialities.map(item => `
                        <div class="restaurant-details-speciality">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="restaurant-details-speciality-image">` : ''}
                            <div class="restaurant-details-speciality-info">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                                <p class="restaurant-details-speciality-price"><strong>Cena:</strong> ${item.price}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="restaurant-details-actions">
                    <button class="restaurant-details-navigate" data-lat="${lat}" data-lng="${lng}">Navigovat</button>
                    <button class="restaurant-details-visit">Označit jako navštívené</button>
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
    const closeButton = modal.querySelector('.restaurant-details-modal-close');
    const navigateButton = modal.querySelector('.restaurant-details-navigate');
    const visitButton = modal.querySelector('.restaurant-details-visit');

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }

    if (navigateButton) {
        navigateButton.addEventListener('click', () => {
            // Přesun mapy na danou lokaci
            map.setView([lat, lng], 16);

            // Zavření modalu
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }

    if (visitButton) {
        visitButton.addEventListener('click', () => {
            // Přidání XP za navštívení restaurace
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addExperience(15, `Navštívení restaurace: ${name}`);
                UserProgress.addAchievement('foodie', `Gurmán`, `Navštívili jste restauraci ${name}`);
            }

            // Zobrazení informace o navštívení restaurace
            addMessage(`Restaurace ${name} byla označena jako navštívená. Získáváte 15 XP!`, false);

            // Zavření modalu
            modal.classList.remove('show');
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
};

// Inicializace menu příkazů po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CommandsMenu.init();
});
