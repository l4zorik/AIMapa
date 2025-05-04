/**
 * AIMapa - Mapové ovládací prvky
 * Verze 0.3.8.6
 * 
 * Tento soubor obsahuje kód pro ovládací prvky mapy
 * včetně přepínání mapových podkladů a glóbus režimu.
 */

// Globální objekt pro mapové ovládací prvky
const MapControls = {
    // Stav ovládacích prvků
    state: {
        initialized: false,
        mapType: 'roadmap', // roadmap, satellite, hybrid, terrain
        globeMode: false
    },
    
    // Inicializace modulu
    init: function() {
        console.log('Inicializace modulu pro mapové ovládací prvky...');
        
        // Vytvoření UI pro mapové ovládací prvky
        this.createMapControlsUI();
        
        // Nastavení event listenerů
        this.setupEventListeners();
        
        // Nastavení stavu
        this.state.initialized = true;
        
        console.log('Modul pro mapové ovládací prvky byl inicializován');
    },
    
    // Vytvoření UI pro mapové ovládací prvky
    createMapControlsUI: function() {
        console.log('Vytváření UI pro mapové ovládací prvky...');
        
        // Vytvoření kontejneru pro mapové ovládací prvky
        const mapControlsContainer = document.createElement('div');
        mapControlsContainer.id = 'mapControlsContainer';
        mapControlsContainer.className = 'map-controls-container';
        
        // Vytvoření ovládacích prvků
        mapControlsContainer.innerHTML = `
            <div class="map-controls">
                <div class="map-type-control" id="mapTypeControl">
                    <button id="roadmapBtn" class="map-type-btn active" data-type="roadmap" title="Základní mapa">🗺️</button>
                    <button id="satelliteBtn" class="map-type-btn" data-type="satellite" title="Satelitní mapa">🛰️</button>
                    <button id="hybridBtn" class="map-type-btn" data-type="hybrid" title="Hybridní mapa">🏙️</button>
                    <button id="terrainBtn" class="map-type-btn" data-type="terrain" title="Terénní mapa">⛰️</button>
                </div>
                <div class="globe-mode-control">
                    <button id="globeModeToggle" class="globe-mode-btn" title="Přepnout glóbus režim">🌐</button>
                </div>
            </div>
        `;
        
        // Přidání kontejneru do dokumentu
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            mapContainer.appendChild(mapControlsContainer);
        } else {
            document.body.appendChild(mapControlsContainer);
        }
        
        // Přidání stylů
        this.addStyles();
    },
    
    // Přidání stylů
    addStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .map-controls-container {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1000;
            }
            
            .map-controls {
                display: flex;
                flex-direction: column;
                gap: 10px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 10px;
            }
            
            .map-type-control {
                display: flex;
                gap: 5px;
            }
            
            .map-type-btn {
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
            
            .map-type-btn.active {
                background-color: #e0f2fe;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }
            
            .globe-mode-btn {
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
            
            .globe-mode-btn.active {
                background-color: #e0f2fe;
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
            }
            
            /* Tmavý režim */
            body[data-theme="dark"] .map-controls {
                background-color: #1f2937;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }
            
            body[data-theme="dark"] .map-type-btn {
                background-color: #374151;
                border-color: #4b5563;
            }
            
            body[data-theme="dark"] .map-type-btn.active {
                background-color: #1e3a8a;
                border-color: #3b82f6;
            }
            
            body[data-theme="dark"] .globe-mode-btn {
                background-color: #374151;
                border-color: #4b5563;
            }
            
            body[data-theme="dark"] .globe-mode-btn.active {
                background-color: #1e3a8a;
                border-color: #3b82f6;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Nastavení event listenerů
    setupEventListeners: function() {
        // Event listenery pro tlačítka typů map
        const mapTypeBtns = document.querySelectorAll('.map-type-btn');
        mapTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech tlačítek
                mapTypeBtns.forEach(b => b.classList.remove('active'));
                
                // Přidání aktivní třídy na kliknuté tlačítko
                btn.classList.add('active');
                
                // Nastavení typu mapy
                this.changeMapType(btn.dataset.type);
            });
        });
        
        // Event listener pro tlačítko glóbus režimu
        const globeModeBtn = document.getElementById('globeModeToggle');
        if (globeModeBtn) {
            globeModeBtn.addEventListener('click', () => {
                // Přepnutí glóbus režimu
                this.toggleGlobeMode();
                
                // Přepnutí aktivní třídy
                globeModeBtn.classList.toggle('active', this.state.globeMode);
            });
        }
    },
    
    // Změna typu mapy
    changeMapType: function(type) {
        console.log(`Změna typu mapy na ${type}...`);
        
        // Uložení typu mapy do stavu
        this.state.mapType = type;
        
        // Kontrola, zda je mapa inicializována
        if (typeof map === 'undefined' || !map) {
            console.error('Mapa není inicializována!');
            return;
        }
        
        // Odstranění všech vrstev
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        
        // Přidání nové vrstvy podle typu
        switch (type) {
            case 'roadmap':
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    minZoom: 2,
                    maxZoom: 18
                }).addTo(map);
                break;
            case 'satellite':
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                    minZoom: 2,
                    maxZoom: 18
                }).addTo(map);
                break;
            case 'hybrid':
                // Nejprve přidáme satelitní vrstvu
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                    minZoom: 2,
                    maxZoom: 18
                }).addTo(map);
                
                // Poté přidáme vrstvu s popisky
                L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}{r}.png', {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    subdomains: 'abcd',
                    minZoom: 2,
                    maxZoom: 18
                }).addTo(map);
                break;
            case 'terrain':
                L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    subdomains: 'abcd',
                    minZoom: 2,
                    maxZoom: 18
                }).addTo(map);
                break;
            default:
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    minZoom: 2,
                    maxZoom: 18
                }).addTo(map);
        }
        
        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(`Typ mapy byl změněn na ${this.getMapTypeName(type)}.`, false);
        }
        
        // Přidání XP za změnu typu mapy
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(5, 'Změna typu mapy');
        }
    },
    
    // Získání názvu typu mapy
    getMapTypeName: function(type) {
        switch (type) {
            case 'roadmap':
                return 'základní';
            case 'satellite':
                return 'satelitní';
            case 'hybrid':
                return 'hybridní';
            case 'terrain':
                return 'terénní';
            default:
                return type;
        }
    },
    
    // Přepnutí glóbus režimu
    toggleGlobeMode: function() {
        console.log('Přepnutí glóbus režimu...');
        
        // Přepnutí stavu
        this.state.globeMode = !this.state.globeMode;
        
        // Kontrola, zda je mapa inicializována
        if (typeof map === 'undefined' || !map) {
            console.error('Mapa není inicializována!');
            return;
        }
        
        // Přepnutí glóbus režimu
        if (this.state.globeMode) {
            // Aktivace glóbus režimu
            this.activateGlobeMode();
        } else {
            // Deaktivace glóbus režimu
            this.deactivateGlobeMode();
        }
        
        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            const message = this.state.globeMode ? 
                'Glóbus režim byl aktivován. Nyní vidíte Zemi jako 3D glóbus.' : 
                'Glóbus režim byl deaktivován. Nyní vidíte standardní 2D mapu.';
            
            addMessage(message, false);
        }
        
        // Přidání XP za přepnutí glóbus režimu
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(10, 'Přepnutí glóbus režimu');
        }
    },
    
    // Aktivace glóbus režimu
    activateGlobeMode: function() {
        console.log('Aktivace glóbus režimu...');
        
        // Kontrola, zda je dostupný modul pro glóbus
        if (typeof GlobeSimple !== 'undefined' && typeof GlobeSimple.init === 'function') {
            // Skrytí standardní mapy
            document.getElementById('map').style.display = 'none';
            
            // Vytvoření kontejneru pro glóbus
            const globeContainer = document.createElement('div');
            globeContainer.id = 'globeContainer';
            globeContainer.style.width = '100%';
            globeContainer.style.height = '100%';
            globeContainer.style.position = 'absolute';
            globeContainer.style.top = '0';
            globeContainer.style.left = '0';
            
            // Přidání kontejneru do dokumentu
            const mapContainer = document.getElementById('map-container');
            if (mapContainer) {
                mapContainer.appendChild(globeContainer);
            } else {
                document.body.appendChild(globeContainer);
            }
            
            // Inicializace glóbusu
            GlobeSimple.init('globeContainer');
        } else {
            console.error('Modul pro glóbus není dostupný!');
            
            // Přidání zprávy do chatu
            if (typeof addMessage !== 'undefined') {
                addMessage('Glóbus režim není dostupný. Zkontrolujte, zda je načten modul pro glóbus.', false);
            }
            
            // Resetování stavu
            this.state.globeMode = false;
            
            // Resetování tlačítka
            const globeModeBtn = document.getElementById('globeModeToggle');
            if (globeModeBtn) {
                globeModeBtn.classList.remove('active');
            }
        }
    },
    
    // Deaktivace glóbus režimu
    deactivateGlobeMode: function() {
        console.log('Deaktivace glóbus režimu...');
        
        // Odstranění kontejneru pro glóbus
        const globeContainer = document.getElementById('globeContainer');
        if (globeContainer) {
            globeContainer.remove();
        }
        
        // Zobrazení standardní mapy
        document.getElementById('map').style.display = 'block';
        
        // Aktualizace velikosti mapy
        if (typeof map !== 'undefined' && map) {
            map.invalidateSize();
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    MapControls.init();
});

// Export pro použití v jiných skriptech
window.MapControls = MapControls;
