/**
 * AIMapa - Inicializace mapy
 * Verze 0.3.8.5
 * 
 * Tento soubor obsahuje kód pro spolehlivou inicializaci mapy
 * a řeší problémy s načítáním Leaflet.js a zobrazením mapy.
 */

// Globální objekt pro správu mapy
const MapManager = {
    // Stav mapy
    state: {
        initialized: false,
        leafletLoaded: false,
        mapElement: null,
        map: null,
        markers: [],
        route: null,
        isFullscreen: false,
        is3DMode: false,
        isGlobeMode: false
    },

    // Inicializace mapy
    init: function() {
        console.log('MapManager: Inicializace...');
        
        // Kontrola, zda je Leaflet.js načten
        if (typeof L === 'undefined') {
            console.log('MapManager: Leaflet.js není načten, načítám...');
            this.loadLeaflet();
            return;
        }
        
        this.state.leafletLoaded = true;
        
        // Kontrola, zda existuje element pro mapu
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('MapManager: Element pro mapu nebyl nalezen!');
            return;
        }
        
        this.state.mapElement = mapElement;
        
        // Kontrola, zda je mapa již inicializována
        if (this.state.initialized || window.map) {
            console.log('MapManager: Mapa je již inicializována');
            return;
        }
        
        // Inicializace mapy
        try {
            console.log('MapManager: Vytvářím mapu...');
            
            // Vytvoření mapy
            const map = L.map('map', {
                zoomAnimation: true,
                markerZoomAnimation: true,
                fadeAnimation: true,
                zoomSnap: 0.5,
                wheelPxPerZoomLevel: 120,
                minZoom: 2,
                maxZoom: 18,
                maxBounds: [[-90, -180], [90, 180]],
                maxBoundsViscosity: 1.0
            }).setView([49.8175, 15.4730], 7);
            
            // Přidání OpenStreetMap podkladu
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                minZoom: 2,
                maxZoom: 18,
                noWrap: true,
                bounds: [[-90, -180], [90, 180]]
            }).addTo(map);
            
            // Uložení reference na mapu
            this.state.map = map;
            window.map = map;
            
            // Inicializace ukazatele souřadnic
            this.initCoordinatesDisplay(map);
            
            // Nastavení stavu
            this.state.initialized = true;
            
            console.log('MapManager: Mapa byla úspěšně inicializována');
            
            // Vyvolání události o inicializaci mapy
            document.dispatchEvent(new CustomEvent('mapInitialized', { detail: { map: map } }));
            
            // Kontrola viditelnosti mapy
            this.checkMapVisibility();
            
            return map;
        } catch (error) {
            console.error('MapManager: Chyba při inicializaci mapy:', error);
            return null;
        }
    },
    
    // Načtení Leaflet.js
    loadLeaflet: function() {
        console.log('MapManager: Načítání Leaflet.js...');
        
        // Vytvoření skriptu pro načtení Leaflet.js
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        
        // Vytvoření CSS pro Leaflet.js
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        
        // Přidání CSS do hlavičky
        document.head.appendChild(link);
        
        // Nastavení callbacků pro načtení skriptu
        script.onload = () => {
            console.log('MapManager: Leaflet.js byl úspěšně načten');
            this.state.leafletLoaded = true;
            
            // Inicializace mapy po načtení Leaflet.js
            setTimeout(() => this.init(), 500);
        };
        
        script.onerror = () => {
            console.error('MapManager: Chyba při načítání Leaflet.js');
            
            // Zkusíme alternativní CDN
            const alternativeScript = document.createElement('script');
            alternativeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
            
            alternativeScript.onload = () => {
                console.log('MapManager: Leaflet.js byl úspěšně načten z alternativního CDN');
                this.state.leafletLoaded = true;
                
                // Inicializace mapy po načtení Leaflet.js
                setTimeout(() => this.init(), 500);
            };
            
            alternativeScript.onerror = () => {
                console.error('MapManager: Chyba při načítání Leaflet.js z alternativního CDN');
            };
            
            document.head.appendChild(alternativeScript);
        };
        
        // Přidání skriptu do hlavičky
        document.head.appendChild(script);
    },
    
    // Inicializace ukazatele souřadnic
    initCoordinatesDisplay: function(map) {
        const coordinatesDisplay = document.getElementById('coordinates');
        if (!coordinatesDisplay) {
            console.error('MapManager: Element pro zobrazení souřadnic nebyl nalezen!');
            return;
        }
        
        // Přidání event listeneru pro pohyb myši na mapě
        map.on('mousemove', function(e) {
            // Získání souřadnic
            const lat = e.latlng.lat.toFixed(6);
            const lng = e.latlng.lng.toFixed(6);
            
            // Zobrazení souřadnic
            coordinatesDisplay.innerHTML = `Lat: ${lat} | Lng: ${lng}`;
        });
        
        // Skrytí ukazatele souřadnic, když myš opustí mapu
        map.on('mouseout', function() {
            coordinatesDisplay.innerHTML = '';
        });
    },
    
    // Kontrola viditelnosti mapy
    checkMapVisibility: function() {
        console.log('MapManager: Kontrola viditelnosti mapy...');
        
        if (!this.state.mapElement) {
            console.error('MapManager: Element pro mapu není definován!');
            return false;
        }
        
        const mapStyle = window.getComputedStyle(this.state.mapElement);
        
        // Kontrola, zda je mapa viditelná
        if (mapStyle.display === 'none') {
            console.error('MapManager: Mapa je skrytá (display: none)!');
            this.state.mapElement.style.display = 'block';
        }
        
        if (mapStyle.visibility === 'hidden') {
            console.error('MapManager: Mapa je skrytá (visibility: hidden)!');
            this.state.mapElement.style.visibility = 'visible';
        }
        
        // Kontrola rozměrů mapy
        if (this.state.mapElement.offsetWidth === 0 || this.state.mapElement.offsetHeight === 0) {
            console.error('MapManager: Mapa má nulovou velikost!');
            this.state.mapElement.style.width = '100%';
            this.state.mapElement.style.height = '500px';
            
            // Překreslení mapy
            if (this.state.map) {
                setTimeout(() => this.state.map.invalidateSize(), 100);
            }
        }
        
        console.log('MapManager: Rozměry mapy:', this.state.mapElement.offsetWidth, 'x', this.state.mapElement.offsetHeight);
        
        // Překreslení mapy pro jistotu
        if (this.state.map) {
            setTimeout(() => this.state.map.invalidateSize(), 100);
        }
        
        return true;
    },
    
    // Přepnutí do fullscreen režimu
    toggleFullscreen: function() {
        if (!this.state.map) {
            console.error('MapManager: Mapa není inicializována!');
            return;
        }
        
        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) {
            console.error('MapManager: Kontejner mapy nebyl nalezen!');
            return;
        }
        
        if (this.state.isFullscreen) {
            // Vypnutí fullscreen režimu
            mapContainer.classList.remove('map-fullscreen');
            this.state.isFullscreen = false;
        } else {
            // Zapnutí fullscreen režimu
            mapContainer.classList.add('map-fullscreen');
            this.state.isFullscreen = true;
        }
        
        // Překreslení mapy
        setTimeout(() => this.state.map.invalidateSize(), 100);
    },
    
    // Získání instance mapy
    getMap: function() {
        return this.state.map;
    },
    
    // Přidání markeru na mapu
    addMarker: function(lat, lng, options = {}) {
        if (!this.state.map) {
            console.error('MapManager: Mapa není inicializována!');
            return null;
        }
        
        // Vytvoření markeru
        const marker = L.marker([lat, lng], options).addTo(this.state.map);
        
        // Přidání markeru do pole
        this.state.markers.push(marker);
        
        return marker;
    },
    
    // Vymazání všech markerů
    clearMarkers: function() {
        if (!this.state.map) {
            console.error('MapManager: Mapa není inicializována!');
            return;
        }
        
        // Odstranění všech markerů z mapy
        this.state.markers.forEach(marker => {
            this.state.map.removeLayer(marker);
        });
        
        // Vyčištění pole markerů
        this.state.markers = [];
    }
};

// Inicializace mapy po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - inicializace MapManager...');
    
    // Inicializace mapy s malým zpožděním pro jistotu
    setTimeout(() => {
        MapManager.init();
    }, 500);
});

// Opakovaná kontrola mapy po načtení stránky
window.addEventListener('load', function() {
    console.log('Window load - kontrola MapManager...');
    
    // Kontrola, zda je mapa inicializována
    if (!MapManager.state.initialized) {
        console.log('MapManager není inicializován, inicializuji...');
        MapManager.init();
    }
    
    // Kontrola viditelnosti mapy
    setTimeout(() => {
        MapManager.checkMapVisibility();
    }, 1000);
});
