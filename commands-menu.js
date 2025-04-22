/**
 * Modul pro menu příkazů vedle chatu
 * Verze 0.2.8.6.3
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

// Inicializace menu příkazů po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CommandsMenu.init();
});
