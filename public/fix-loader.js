/**
 * Fix-loader.js - Oprava načítání pro AIMapa verze 0.2.9.1
 * Tento soubor zajišťuje správné načtení všech potřebných komponent a knihoven
 */

// Objekt pro správu načítání a oprav
const FixLoader = {
    // Seznam potřebných knihoven a jejich URL
    libraries: {
        'leaflet': 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        'leaflet-css': 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        'leaflet-routing': 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js',
        'leaflet-routing-css': 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css',
        'globe-gl': 'https://unpkg.com/globe.gl@2.32.1/dist/globe.gl.min.js',
        'three': 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
        'font-awesome': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    },

    // Seznam potřebných interních skriptů
    scripts: [
        'globe-simple.js',
        'map-features.js',
        'user-profiles.js',
        'achievements.js',
        'features.js',
        'app-status.js',
        'commands-dialog.js',
        'script.js'
    ],

    // Inicializace opravného nástroje
    init() {
        console.log('Inicializace opravného nástroje...');
        this.showLoadingOverlay();
        this.checkLibraries()
            .then(() => this.checkScripts())
            .then(() => this.initializeApplication())
            .catch(error => {
                console.error('Chyba při inicializaci:', error);
                this.showErrorMessage('Došlo k chybě při inicializaci aplikace. Zkuste obnovit stránku.');
            });
    },

    // Zobrazení překryvné vrstvy s načítáním
    showLoadingOverlay() {
        // Kontrola, zda již existuje
        if (document.getElementById('loadingOverlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';

        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.border = '5px solid rgba(255, 255, 255, 0.3)';
        spinner.style.borderRadius = '50%';
        spinner.style.borderTop = '5px solid #8B5CF6';
        spinner.style.animation = 'spin 1s linear infinite';

        const message = document.createElement('div');
        message.id = 'loadingMessage';
        message.textContent = 'Načítání aplikace...';
        message.style.color = 'white';
        message.style.marginTop = '20px';
        message.style.fontSize = '18px';

        // Přidání stylu pro animaci
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(style);
        overlay.appendChild(spinner);
        overlay.appendChild(message);
        document.body.appendChild(overlay);
    },

    // Skrytí překryvné vrstvy s načítáním
    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }
    },

    // Aktualizace zprávy o načítání
    updateLoadingMessage(message) {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
    },

    // Zobrazení chybové zprávy
    showErrorMessage(message) {
        this.updateLoadingMessage(message);

        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            const spinner = overlay.querySelector('.loading-spinner');
            if (spinner) {
                spinner.style.borderTop = '5px solid #EF4444';
            }

            const retryButton = document.createElement('button');
            retryButton.textContent = 'Zkusit znovu';
            retryButton.style.marginTop = '20px';
            retryButton.style.padding = '10px 20px';
            retryButton.style.backgroundColor = '#8B5CF6';
            retryButton.style.color = 'white';
            retryButton.style.border = 'none';
            retryButton.style.borderRadius = '5px';
            retryButton.style.cursor = 'pointer';

            retryButton.addEventListener('click', () => {
                window.location.reload();
            });

            overlay.appendChild(retryButton);
        }
    },

    // Kontrola dostupnosti knihoven
    async checkLibraries() {
        this.updateLoadingMessage('Kontrola knihoven...');

        // Kontrola, zda jsou knihovny načteny
        for (const [name, url] of Object.entries(this.libraries)) {
            if (name.endsWith('-css')) {
                // Kontrola CSS
                if (!this.isStylesheetLoaded(url)) {
                    console.log(`Načítání CSS: ${name}`);
                    await this.loadStylesheet(url);
                }
            } else {
                // Kontrola JS
                if (!this.isLibraryLoaded(name)) {
                    console.log(`Načítání knihovny: ${name}`);
                    await this.loadScript(url);
                }
            }
        }

        console.log('Všechny knihovny jsou načteny');
    },

    // Kontrola, zda je knihovna načtena
    isLibraryLoaded(name) {
        switch (name) {
            case 'leaflet':
                return typeof L !== 'undefined';
            case 'leaflet-routing':
                return typeof L !== 'undefined' && typeof L.Routing !== 'undefined';
            case 'osm-buildings':
                return typeof OSMBuildings !== 'undefined';
            case 'globe-gl':
                return typeof Globe !== 'undefined';
            case 'three':
                return typeof THREE !== 'undefined';
            case 'three-controls':
                return typeof THREE !== 'undefined' && typeof THREE.OrbitControls !== 'undefined';
            case 'three-loader':
                return typeof THREE !== 'undefined' && typeof THREE.GLTFLoader !== 'undefined';
            default:
                return false;
        }
    },

    // Kontrola, zda je CSS načten
    isStylesheetLoaded(url) {
        const links = document.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].href === url) {
                return true;
            }
        }
        return false;
    },

    // Načtení CSS
    loadStylesheet(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            link.onload = () => {
                console.log(`CSS načten: ${url}`);
                resolve();
            };

            link.onerror = () => {
                console.error(`Chyba při načítání CSS: ${url}`);
                reject(new Error(`Nepodařilo se načíst CSS: ${url}`));
            };

            document.head.appendChild(link);
        });
    },

    // Načtení skriptu
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;

            script.onload = () => {
                console.log(`Skript načten: ${url}`);
                resolve();
            };

            script.onerror = () => {
                console.error(`Chyba při načítání skriptu: ${url}`);
                reject(new Error(`Nepodařilo se načíst skript: ${url}`));
            };

            document.head.appendChild(script);
        });
    },

    // Kontrola interních skriptů
    async checkScripts() {
        this.updateLoadingMessage('Kontrola interních skriptů...');

        for (const script of this.scripts) {
            if (!this.isScriptLoaded(script)) {
                console.log(`Načítání interního skriptu: ${script}`);
                await this.loadScript(script);
            }
        }

        console.log('Všechny interní skripty jsou načteny');
    },

    // Kontrola, zda je interní skript načten
    isScriptLoaded(scriptName) {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src.endsWith(scriptName)) {
                return true;
            }
        }
        return false;
    },

    // Inicializace aplikace
    initializeApplication() {
        this.updateLoadingMessage('Inicializace aplikace...');

        // Kontrola, zda jsou všechny potřebné objekty definovány
        if (typeof L === 'undefined') {
            throw new Error('Leaflet není definován');
        }

        // Inicializace mapy, pokud ještě není inicializována
        if (typeof window.map === 'undefined' || window.map === null) {
            console.log('Inicializace mapy...');
            this.initMap();
        }

        // Inicializace komponent v správném pořadí
        this.initializeComponents();

        // Skrytí překryvné vrstvy
        setTimeout(() => {
            this.hideLoadingOverlay();
        }, 1000);

        console.log('Aplikace byla úspěšně inicializována');
    },

    // Inicializace mapy
    initMap() {
        try {
            // Kontrola, zda existuje element pro mapu
            const mapElement = document.getElementById('map');
            if (!mapElement) {
                throw new Error('Element mapy nebyl nalezen');
            }

            // Kontrola, zda je Leaflet dostupný
            if (typeof L === 'undefined') {
                throw new Error('Leaflet není dostupný');
            }

            // Vytvoření mapy
            window.map = L.map('map', {
                center: [50.0755, 14.4378], // Praha
                zoom: 13,
                zoomControl: true,
                attributionControl: true
            });

            // Přidání základní vrstvy
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(window.map);

            // Nastavení event listenerů pro mapu
            window.map.on('click', function(e) {
                if (typeof addMarker === 'function' && window.isAddingPoints) {
                    addMarker(e.latlng);
                }
            });

            // Aktualizace souřadnic při pohybu myši
            window.map.on('mousemove', function(e) {
                const coordinatesElement = document.getElementById('coordinates');
                if (coordinatesElement) {
                    coordinatesElement.textContent = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
                }
            });

            console.log('Mapa byla úspěšně inicializována');
            return true;
        } catch (error) {
            console.error('Chyba při inicializaci mapy:', error);
            this.showErrorMessage(`Došlo k chybě při inicializaci mapy: ${error.message}. Zkuste obnovit stránku.`);
            return false;
        }
    },

    // Inicializace komponent
    initializeComponents() {
        try {
            console.log('Inicializace komponent...');

            // 1. Inicializace MapFeatures
            if (typeof MapFeatures !== 'undefined') {
                console.log('Inicializace MapFeatures...');
                MapFeatures.init(window.map);
            }

            // 2. Inicializace UserProfiles
            if (typeof UserProfiles !== 'undefined') {
                console.log('Inicializace UserProfiles...');
                UserProfiles.init();
            }

            // 3. Inicializace Achievements
            if (typeof Achievements !== 'undefined') {
                console.log('Inicializace Achievements...');
                Achievements.init();
            }

            // 4. Inicializace Features
            if (typeof Features !== 'undefined') {
                console.log('Inicializace Features...');
                Features.init();
            }

            // 5. Inicializace AppStatus
            if (typeof AppStatus !== 'undefined') {
                console.log('Inicializace AppStatus...');
                AppStatus.init();
            }

            // 6. Inicializace Globe.gl
            if (typeof window.initSimpleGlobe === 'function') {
                console.log('Inicializace Globe.gl...');
                window.initSimpleGlobe();
            }

            console.log('Všechny komponenty byly inicializovány');

            // Přidání uvítací zprávy
            if (typeof addMessage === 'function') {
                addMessage('Vítejte v AI Map - Časovém Manažeru! Můžete přidávat aktivity na mapu, vypočítat trasu mezi nimi a vytisknout mapu. Jak vám mohu pomoci?', false, ['Přidat aktivitu', 'Vypočítat trasu', 'Profil', 'Nová schůzka']);
            }

            // Nastavení event listenerů pro tlačítka
            this.setupEventListeners();

            return true;
        } catch (error) {
            console.error('Chyba při inicializaci komponent:', error);
            throw error;
        }
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Fullscreen tlačítko
        const fullscreenButton = document.getElementById('fullscreenButton');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                if (typeof toggleFullscreen === 'function') {
                    toggleFullscreen();
                }
            });
        }

        // Glóbus režim
        const toggleGlobeModeButton = document.getElementById('toggleGlobeMode');
        if (toggleGlobeModeButton) {
            toggleGlobeModeButton.addEventListener('click', () => {
                if (typeof toggleGlobeMode === 'function') {
                    toggleGlobeMode();
                }
            });
        }

        // Tlačítko pro přidání aktivity
        const addActivityButton = document.getElementById('addActivity');
        if (addActivityButton) {
            addActivityButton.addEventListener('click', () => {
                if (typeof showAddActivityDialog === 'function') {
                    showAddActivityDialog();
                }
            });
        }

        // Tlačítko pro výpočet trasy
        const calculateRouteButton = document.getElementById('calculateRoute');
        if (calculateRouteButton) {
            calculateRouteButton.addEventListener('click', () => {
                if (typeof calculateRoute === 'function') {
                    calculateRoute();
                }
            });
        }

        // Tlačítko pro vymazání mapy
        const clearMapButton = document.getElementById('clearMap');
        if (clearMapButton) {
            clearMapButton.addEventListener('click', () => {
                if (typeof clearMap === 'function') {
                    clearMap();
                }
            });
        }

        // Tlačítko pro tisk mapy
        const printMapButton = document.getElementById('printMap');
        if (printMapButton) {
            printMapButton.addEventListener('click', () => {
                if (typeof printMap === 'function') {
                    printMap();
                }
            });
        }

        console.log('Event listenery byly nastaveny');
    }
};

// Inicializace opravného nástroje po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    FixLoader.init();
});

// Pokud se stránka načte s chybou, zkusíme opravit
window.addEventListener('error', (event) => {
    console.error('Zachycena chyba:', event.error);

    // Pokud již existuje FixLoader, neinicializujeme znovu
    if (typeof FixLoader !== 'undefined' && !document.getElementById('loadingOverlay')) {
        FixLoader.init();
    }
});
