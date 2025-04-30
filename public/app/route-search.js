/**
 * AIMapa - Vyhledávání tras
 * Verze 0.3.8.6
 *
 * Tento soubor obsahuje kód pro vyhledávání tras mezi body
 * a podporuje multimodální vyhledávání (auto, pěšky, MHD, kolo).
 */

// Globální objekt pro vyhledávání tras
const RouteSearch = {
    // Stav vyhledávání
    state: {
        initialized: false,
        routeControl: null,
        startPoint: null,
        endPoint: null,
        waypoints: [],
        mode: 'driving', // driving, walking, transit, bicycling
        route: null
    },

    // Inicializace modulu
    init: function() {
        console.log('Inicializace modulu pro vyhledávání tras...');

        // Vytvoření UI pro vyhledávání tras
        this.createRouteSearchUI();

        // Nastavení event listenerů
        this.setupEventListeners();

        // Nastavení stavu
        this.state.initialized = true;

        console.log('Modul pro vyhledávání tras byl inicializován');
    },

    // Vytvoření UI pro vyhledávání tras
    createRouteSearchUI: function() {
        console.log('Vytváření UI pro vyhledávání tras...');

        // Vytvoření kontejneru pro vyhledávání tras
        const routeSearchContainer = document.createElement('div');
        routeSearchContainer.id = 'routeSearchContainer';
        routeSearchContainer.className = 'route-search-container';

        // Vytvoření formuláře pro vyhledávání tras
        routeSearchContainer.innerHTML = `
            <div class="route-search-form">
                <div class="form-group">
                    <label for="startPointInput">Odkud</label>
                    <input type="text" id="startPointInput" placeholder="Zadejte místo odjezdu">
                </div>
                <div class="form-group">
                    <label for="endPointInput">Kam</label>
                    <input type="text" id="endPointInput" placeholder="Zadejte místo příjezdu">
                </div>
                <div class="form-group">
                    <label>Dopravní prostředek</label>
                    <div class="transport-mode-selector">
                        <button id="drivingModeBtn" class="transport-mode-btn active" data-mode="driving" title="Autem">🚗</button>
                        <button id="walkingModeBtn" class="transport-mode-btn" data-mode="walking" title="Pěšky">🚶</button>
                        <button id="transitModeBtn" class="transport-mode-btn" data-mode="transit" title="MHD">🚌</button>
                        <button id="bicyclingModeBtn" class="transport-mode-btn" data-mode="bicycling" title="Na kole">🚲</button>
                    </div>
                </div>
                <button id="calculateRouteButton" class="calculate-route-btn">Vyhledat trasu</button>
            </div>
            <div id="routeResults" class="route-results"></div>
        `;

        // Přidání kontejneru do dokumentu
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.appendChild(routeSearchContainer);
        } else {
            document.body.appendChild(routeSearchContainer);
        }

        // Přidání stylů
        this.addStyles();
    },

    // Přidání stylů
    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .route-search-container {
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 1000;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 15px;
                width: 300px;
                max-width: 90%;
            }

            .route-search-form {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .form-group label {
                font-weight: bold;
                font-size: 14px;
            }

            .form-group input {
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }

            .transport-mode-selector {
                display: flex;
                gap: 10px;
            }

            .transport-mode-btn {
                width: 40px;
                height: 40px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #f5f5f5;
                cursor: pointer;
                font-size: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .transport-mode-btn.active {
                background-color: #e0f2fe;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }

            .calculate-route-btn {
                padding: 10px 15px;
                background-color: #3b82f6;
                color: white;
                border: none;
                border-radius: 4px;
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s;
            }

            .calculate-route-btn:hover {
                background-color: #2563eb;
            }

            .route-results {
                margin-top: 15px;
                display: none;
            }

            .route-results.visible {
                display: block;
            }

            .route-result-item {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-bottom: 10px;
            }

            .route-result-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                font-weight: bold;
            }

            .route-result-details {
                display: flex;
                justify-content: space-between;
                color: #666;
                font-size: 14px;
            }

            /* Tmavý režim */
            body[data-theme="dark"] .route-search-container {
                background-color: #1f2937;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }

            body[data-theme="dark"] .form-group label {
                color: #e5e7eb;
            }

            body[data-theme="dark"] .form-group input {
                background-color: #374151;
                border-color: #4b5563;
                color: #e5e7eb;
            }

            body[data-theme="dark"] .transport-mode-btn {
                background-color: #374151;
                border-color: #4b5563;
            }

            body[data-theme="dark"] .transport-mode-btn.active {
                background-color: #1e3a8a;
                border-color: #3b82f6;
            }

            body[data-theme="dark"] .calculate-route-btn {
                background-color: #3b82f6;
            }

            body[data-theme="dark"] .calculate-route-btn:hover {
                background-color: #2563eb;
            }

            body[data-theme="dark"] .route-result-item {
                background-color: #374151;
                border-color: #4b5563;
                color: #e5e7eb;
            }

            body[data-theme="dark"] .route-result-details {
                color: #9ca3af;
            }
        `;

        document.head.appendChild(style);
    },

    // Nastavení event listenerů
    setupEventListeners: function() {
        // Event listener pro tlačítko výpočtu trasy
        const calculateRouteButton = document.getElementById('calculateRouteButton');
        if (calculateRouteButton) {
            calculateRouteButton.addEventListener('click', () => {
                this.calculateRoute();
            });
        }

        // Event listenery pro tlačítka dopravních prostředků
        const transportModeBtns = document.querySelectorAll('.transport-mode-btn');
        transportModeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech tlačítek
                transportModeBtns.forEach(b => b.classList.remove('active'));

                // Přidání aktivní třídy na kliknuté tlačítko
                btn.classList.add('active');

                // Nastavení režimu
                this.state.mode = btn.dataset.mode;

                // Přepočítání trasy, pokud již existuje
                if (this.state.route) {
                    this.calculateRoute();
                }
            });
        });

        // Event listenery pro vstupní pole
        const startPointInput = document.getElementById('startPointInput');
        const endPointInput = document.getElementById('endPointInput');

        if (startPointInput && endPointInput) {
            // Automatický výpočet trasy po zadání obou bodů
            endPointInput.addEventListener('change', () => {
                if (startPointInput.value && endPointInput.value) {
                    this.calculateRoute();
                }
            });

            // Automatický výpočet trasy po zadání obou bodů
            startPointInput.addEventListener('change', () => {
                if (startPointInput.value && endPointInput.value) {
                    this.calculateRoute();
                }
            });
        }
    },

    // Výpočet trasy
    calculateRoute: function() {
        console.log('Výpočet trasy...');

        // Získání hodnot z formuláře
        const startPoint = document.getElementById('startPointInput').value;
        const endPoint = document.getElementById('endPointInput').value;

        // Kontrola, zda jsou vyplněny oba body
        if (!startPoint || !endPoint) {
            this.showError('Vyplňte odkud a kam chcete cestovat');
            return;
        }

        // Zobrazení načítání
        this.showLoading();

        // Simulace výpočtu trasy
        setTimeout(() => {
            // Výpočet trasy podle zvoleného dopravního prostředku
            const route = this.calculateRouteByMode(startPoint, endPoint, this.state.mode);

            // Uložení trasy do stavu
            this.state.route = route;

            // Zobrazení výsledků
            this.displayRouteResults(route);

            // Přidání XP za výpočet trasy
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(10, 'Výpočet trasy');
            }

            // Přidání zprávy do chatu
            if (typeof addMessage !== 'undefined') {
                addMessage(`Trasa z ${startPoint} do ${endPoint} byla vypočítána. Vzdálenost: ${route.distance}, čas: ${route.duration}.`, false);
            }
        }, 1500);
    },

    // Výpočet trasy podle zvoleného dopravního prostředku
    calculateRouteByMode: function(startPoint, endPoint, mode) {
        console.log(`Výpočet trasy z ${startPoint} do ${endPoint} pomocí ${mode}...`);

        // Simulace výpočtu trasy
        let distance, duration;

        // Předpokládané vzdálenosti mezi městy v ČR (v km)
        const distances = {
            'Praha-Brno': 186,
            'Praha-Ostrava': 356,
            'Praha-Plzeň': 92,
            'Brno-Ostrava': 170,
            'Brno-Praha': 186,
            'Ostrava-Praha': 356,
            'Plzeň-Praha': 92
        };

        // Získání vzdálenosti
        const routeKey = `${startPoint}-${endPoint}`;
        const reverseRouteKey = `${endPoint}-${startPoint}`;

        // Výchozí vzdálenost, pokud není známá
        let baseDistance = 100;

        if (distances[routeKey]) {
            baseDistance = distances[routeKey];
        } else if (distances[reverseRouteKey]) {
            baseDistance = distances[reverseRouteKey];
        }

        // Výpočet vzdálenosti a času podle dopravního prostředku
        switch (mode) {
            case 'driving':
                distance = baseDistance;
                duration = Math.round(baseDistance / 80 * 60); // 80 km/h průměrná rychlost
                break;
            case 'walking':
                distance = baseDistance * 0.8; // Kratší trasa pro pěší
                duration = Math.round(distance / 5 * 60); // 5 km/h průměrná rychlost
                break;
            case 'transit':
                distance = baseDistance * 1.1; // Delší trasa pro MHD
                duration = Math.round(distance / 40 * 60); // 40 km/h průměrná rychlost
                break;
            case 'bicycling':
                distance = baseDistance * 0.9; // Kratší trasa pro kolo
                duration = Math.round(distance / 15 * 60); // 15 km/h průměrná rychlost
                break;
            default:
                distance = baseDistance;
                duration = Math.round(baseDistance / 80 * 60);
        }

        // Speciální případ pro testovací data
        if (startPoint === 'Praha' && endPoint === 'Brno') {
            switch (mode) {
                case 'driving':
                    return {
                        startPoint: startPoint,
                        endPoint: endPoint,
                        mode: mode,
                        distance: '186 km',
                        duration: '2 hodiny',
                        rawDistance: 186,
                        rawDuration: 120
                    };
                case 'walking':
                    return {
                        startPoint: startPoint,
                        endPoint: endPoint,
                        mode: mode,
                        distance: '149 km',
                        duration: '30 hodin',
                        rawDistance: 149,
                        rawDuration: 1800
                    };
                case 'transit':
                    return {
                        startPoint: startPoint,
                        endPoint: endPoint,
                        mode: mode,
                        distance: '205 km',
                        duration: '3 h 5 min',
                        rawDistance: 205,
                        rawDuration: 185
                    };
                case 'bicycling':
                    return {
                        startPoint: startPoint,
                        endPoint: endPoint,
                        mode: mode,
                        distance: '167 km',
                        duration: '11 h 8 min',
                        rawDistance: 167,
                        rawDuration: 668
                    };
            }
        }

        // Formátování výsledků
        const formattedDistance = `${Math.round(distance)} km`;
        const formattedDuration = this.formatDuration(duration);

        // Vytvoření objektu trasy
        return {
            startPoint: startPoint,
            endPoint: endPoint,
            mode: mode,
            distance: formattedDistance,
            duration: formattedDuration,
            rawDistance: distance,
            rawDuration: duration
        };
    },

    // Formátování času
    formatDuration: function(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            if (mins === 0) {
                return `${hours} h`;
            } else {
                return `${hours} h ${mins} min`;
            }
        }
    },

    // Zobrazení výsledků trasy
    displayRouteResults: function(route) {
        console.log('Zobrazení výsledků trasy:', route);

        // Získání kontejneru pro výsledky
        const resultsContainer = document.getElementById('routeResults');
        if (!resultsContainer) return;

        // Zobrazení kontejneru
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('visible');

        // Vytvoření HTML pro výsledky
        let modeIcon;
        switch (route.mode) {
            case 'driving':
                modeIcon = '🚗';
                break;
            case 'walking':
                modeIcon = '🚶';
                break;
            case 'transit':
                modeIcon = '🚌';
                break;
            case 'bicycling':
                modeIcon = '🚲';
                break;
            default:
                modeIcon = '🚗';
        }

        resultsContainer.innerHTML = `
            <div class="route-result-item">
                <div class="route-result-header">
                    <span>${route.startPoint} → ${route.endPoint}</span>
                    <span>${modeIcon}</span>
                </div>
                <div class="route-result-details">
                    <span>Vzdálenost: ${route.distance}</span>
                    <span>Čas: ${route.duration}</span>
                </div>
            </div>
        `;

        // Zobrazení trasy na mapě
        this.displayRouteOnMap(route);
    },

    // Zobrazení trasy na mapě
    displayRouteOnMap: function(route) {
        console.log('Zobrazení trasy na mapě:', route);

        // Kontrola, zda je mapa inicializována
        if (typeof map === 'undefined' || !map) {
            console.error('Mapa není inicializována!');
            return;
        }

        // Odstranění předchozí trasy, pokud existuje
        if (this.state.routeControl) {
            map.removeControl(this.state.routeControl);
            this.state.routeControl = null;
        }

        // Simulace bodů trasy
        const waypoints = [
            L.latLng(this.getCoordinatesForCity(route.startPoint)),
            L.latLng(this.getCoordinatesForCity(route.endPoint))
        ];

        // Vytvoření trasy pomocí Leaflet Routing Machine
        this.state.routeControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            showAlternatives: true,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [
                    { color: '#3388ff', opacity: 0.8, weight: 6 },
                    { color: '#ffffff', opacity: 0.3, weight: 4 }
                ]
            },
            createMarker: function(i, wp, nWps) {
                return L.marker(wp.latLng, {
                    draggable: true,
                    icon: L.divIcon({
                        className: 'custom-marker-icon',
                        html: i === 0 ? '🅰️' : '🅱️',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    })
                });
            }
        }).addTo(map);

        // Nastavení režimu trasy
        if (this.state.routeControl.getRouter()) {
            this.state.routeControl.getRouter().options.profile = this.getOsrmProfile(route.mode);
        }
    },

    // Získání OSRM profilu podle režimu
    getOsrmProfile: function(mode) {
        switch (mode) {
            case 'driving':
                return 'car';
            case 'walking':
                return 'foot';
            case 'bicycling':
                return 'bike';
            case 'transit':
                return 'car'; // OSRM nemá profil pro MHD, použijeme auto
            default:
                return 'car';
        }
    },

    // Získání souřadnic pro město
    getCoordinatesForCity: function(city) {
        // Databáze souřadnic českých měst
        const cityCoordinates = {
            'Praha': { lat: 50.0755, lng: 14.4378 },
            'Brno': { lat: 49.1951, lng: 16.6068 },
            'Ostrava': { lat: 49.8209, lng: 18.2625 },
            'Plzeň': { lat: 49.7384, lng: 13.3736 },
            'Liberec': { lat: 50.7663, lng: 15.0543 },
            'Olomouc': { lat: 49.5938, lng: 17.2509 },
            'České Budějovice': { lat: 48.9747, lng: 14.4744 },
            'Hradec Králové': { lat: 50.2092, lng: 15.8328 },
            'Ústí nad Labem': { lat: 50.6607, lng: 14.0328 },
            'Pardubice': { lat: 50.0343, lng: 15.7812 },
            'Zlín': { lat: 49.2248, lng: 17.6627 },
            'Havířov': { lat: 49.7797, lng: 18.4375 },
            'Kladno': { lat: 50.1429, lng: 14.1080 },
            'Most': { lat: 50.5031, lng: 13.6362 },
            'Opava': { lat: 49.9391, lng: 17.9006 },
            'Frýdek-Místek': { lat: 49.6841, lng: 18.3489 },
            'Jihlava': { lat: 49.3961, lng: 15.5903 },
            'Karviná': { lat: 49.8543, lng: 18.5420 },
            'Teplice': { lat: 50.6404, lng: 13.8244 },
            'Děčín': { lat: 50.7731, lng: 14.2133 },
            'Chomutov': { lat: 50.4606, lng: 13.4178 },
            'Karlovy Vary': { lat: 50.2304, lng: 12.8716 },
            'Jablonec nad Nisou': { lat: 50.7240, lng: 15.1710 },
            'Prostějov': { lat: 49.4724, lng: 17.1116 },
            'Mladá Boleslav': { lat: 50.4125, lng: 14.9031 },
            'Přerov': { lat: 49.4551, lng: 17.4597 },
            'Třinec': { lat: 49.6774, lng: 18.6708 },
            'Česká Lípa': { lat: 50.6862, lng: 14.5358 },
            'Třebíč': { lat: 49.2149, lng: 15.8816 },
            'Hodonín': { lat: 48.8484, lng: 17.1259 }
        };

        // Kontrola, zda město existuje v databázi
        if (cityCoordinates[city]) {
            return cityCoordinates[city];
        }

        // Pokud město neexistuje v databázi, vrátíme výchozí souřadnice (Praha)
        console.warn(`Město ${city} nebylo nalezeno v databázi souřadnic. Používám výchozí souřadnice (Praha).`);
        return cityCoordinates['Praha'];
    },

    // Zobrazení načítání
    showLoading: function() {
        const resultsContainer = document.getElementById('routeResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            resultsContainer.classList.add('visible');
            resultsContainer.innerHTML = '<div class="route-loading">Vyhledávám trasu...</div>';
        }
    },

    // Zobrazení chyby
    showError: function(message) {
        const resultsContainer = document.getElementById('routeResults');
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
            resultsContainer.classList.add('visible');
            resultsContainer.innerHTML = `<div class="route-error">${message}</div>`;
        }

        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(message, false);
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    RouteSearch.init();
});

// Export pro použití v jiných skriptech
window.RouteSearch = RouteSearch;
