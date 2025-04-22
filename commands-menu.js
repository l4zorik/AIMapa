/**
 * Modul pro menu příkazů vedle chatu
 * Verze 0.2.8.6.5
 */

const CommandsMenu = {
    // Seznam dostupných příkazů
    commands: [
        {
            id: 'job-search',
            name: 'Hledání práce',
            description: 'Zobrazí nabídky práce v okolí s možností reakce',
            icon: '💼',
            examples: ['Hledání práce', 'Nabídky práce', 'Zaměstnání']
        },
        {
            id: 'energy-drinks',
            name: 'Energetické nápoje',
            description: 'Zobrazí nabídku nejlepších energetických nápojů s možností objednávky',
            icon: '⚡',
            examples: ['Energeťáky', 'Energy drinky', 'Energetické nápoje']
        },
        {
            id: 'krkovicka',
            name: 'Krkovička',
            description: 'Zobrazí nabídku krkovičky a dalších mas s možností objednávky',
            icon: '🥩',
            examples: ['Krkovička', 'Maso', 'Gril']
        },
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
            id: 'night-mode',
            name: 'Noční režim',
            description: 'Přepne mapu do nočního režimu s tmavým pozadím a zvýrazněnými cestami',
            icon: '🌙',
            examples: ['Noční režim', 'Tmavá mapa', 'Noční mapa']
        },
        {
            id: 'weather-overlay',
            name: 'Počasí na mapě',
            description: 'Zobrazí aktuální počasí a předpověď na mapě',
            icon: '☀️',
            examples: ['Počasí', 'Předpověď', 'Teplota']
        },
        {
            id: 'points-of-interest',
            name: 'Zajímavá místa',
            description: 'Zobrazí zajímavá místa v okolí - restaurace, hotely, památky',
            icon: '🏰',
            examples: ['Zajímavá místa', 'Atrakce', 'Co navštívit']
        },
        {
            id: 'measure-distance',
            name: 'Měření vzdálenosti',
            description: 'Nástroj pro měření vzdálenosti mezi body na mapě',
            icon: '📍',
            examples: ['Měření', 'Vzdálenost', 'Změřit']
        },
        {
            id: 'share-location',
            name: 'Sdílet polohu',
            description: 'Vytvoří odkaz pro sdílení aktuální polohy nebo trasy',
            icon: '🔗',
            examples: ['Sdílet', 'Odkaz', 'Poslat polohu']
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
            id: 'local-stories',
            name: 'Příběhy z oblasti',
            description: 'Zobrazí zajímavé příběhy a legendy z aktuální oblasti',
            icon: '📜',
            examples: ['Příběhy', 'Legendy', 'Historie místa']
        },
        {
            id: 'local-food',
            name: 'Místní speciality',
            description: 'Zobrazí tipy na nejlepší jídlo a pití z aktuální oblasti',
            icon: '🍽️',
            examples: ['Jídlo', 'Speciality', 'Gastronomie']
        },
        {
            id: 'nearby-shops',
            name: 'Obchody v okolí',
            description: 'Zobrazí obchody v okolí s možností online nákupu',
            icon: '🛍️',
            examples: ['Obchody', 'Nákupy', 'Kde nakoupit']
        },
        {
            id: 'traffic-info',
            name: 'Dopravní situace',
            description: 'Zobrazí aktuální dopravní situaci, zácpy a uzavírky',
            icon: '🚗',
            examples: ['Doprava', 'Zácpy', 'Dopravní info']
        },
        {
            id: 'hiking-trails',
            name: 'Turistické trasy',
            description: 'Zobrazí turistické a cyklistické trasy v okolí',
            icon: '🚶',
            examples: ['Turistika', 'Cyklotrasy', 'Pěší trasy']
        },
        {
            id: 'premium',
            name: 'Premium verze',
            description: 'Získejte přístup k premium funkcím aplikace',
            icon: '⭐',
            examples: ['Premium', 'Upgrade', 'Rozšířené funkce']
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
                commandsMenu.style.transform = 'translate(-50%, -50%) scale(1)';
                commandsMenu.style.opacity = '1';
            }, 10);
        }
    },

    // Skrytí menu příkazů
    hideCommandsMenu() {
        const commandsMenu = document.getElementById('commandsMenu');
        if (commandsMenu) {
            commandsMenu.classList.remove('show');
            commandsMenu.style.transform = 'translate(-50%, -50%) scale(0.95)';
            commandsMenu.style.opacity = '0';

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
            case 'job-search':
                this.showJobSearch();
                break;

            case 'energy-drinks':
                this.showEnergyDrinksShop();
                break;

            case 'krkovicka':
                this.showKrkovickaShop();
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
