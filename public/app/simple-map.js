/**
 * AIMapa - Jednoduchá inicializace mapy
 * Verze 0.3.8.5
 */

// Globální objekt pro správu mapy
window.SimpleMap = {
    // Inicializace mapy
    init: function() {
        console.log('SimpleMap: Inicializace mapy...');

        // Kontrola, zda existuje element pro mapu
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('SimpleMap: Element pro mapu nebyl nalezen!');

            // Pokus o vytvoření elementu pro mapu
            const mapWrapper = document.querySelector('.map-wrapper');
            if (mapWrapper) {
                console.log('SimpleMap: Vytvářím nový element pro mapu...');
                const newMapElement = document.createElement('div');
                newMapElement.id = 'map';
                newMapElement.style.width = '100%';
                newMapElement.style.height = '500px';
                mapWrapper.innerHTML = ''; // Vyčistit wrapper
                mapWrapper.appendChild(newMapElement);
                console.log('SimpleMap: Element pro mapu byl vytvořen');
            } else {
                console.error('SimpleMap: Kontejner pro mapu nebyl nalezen!');
                return;
            }
        }

        // Kontrola, zda je Leaflet načten
        if (typeof L === 'undefined') {
            console.error('SimpleMap: Leaflet není načten! Načítám Leaflet...');

            // Načtení Leaflet CSS
            const leafletCSS = document.createElement('link');
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(leafletCSS);

            // Načtení Leaflet JS
            const leafletScript = document.createElement('script');
            leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

            // Po načtení Leaflet inicializovat mapu
            leafletScript.onload = function() {
                console.log('SimpleMap: Leaflet byl načten, inicializuji mapu...');
                SimpleMap.createMap();
            };

            document.head.appendChild(leafletScript);
        } else {
            // Leaflet je již načten, inicializovat mapu
            console.log('SimpleMap: Leaflet je již načten, inicializuji mapu...');
            this.createMap();
        }
    },

    // Vytvoření mapy
    createMap: function() {
        // Kontrola, zda existuje element pro mapu
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('SimpleMap: Element pro mapu nebyl nalezen!');
            return;
        }

        // Kontrola, zda je mapa již inicializována
        if (window.map && window.map instanceof L.Map) {
            console.log('SimpleMap: Mapa je již inicializována');
            return;
        }

        try {
            console.log('SimpleMap: Vytvářím novou mapu...');

            // Nastavení stylu mapy
            mapElement.style.width = '100%';
            mapElement.style.height = '500px';
            mapElement.style.border = '1px solid #ccc';
            mapElement.style.borderRadius = '4px';
            mapElement.style.zIndex = '1';

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
            }).setView([49.8175, 15.4730], 7); // Výchozí pohled na ČR

            // Přidání OpenStreetMap podkladu
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                minZoom: 2,
                maxZoom: 18,
                noWrap: true,
                bounds: [[-90, -180], [90, 180]]
            }).addTo(map);

            // Uložení reference na mapu
            window.map = map;

            console.log('SimpleMap: Mapa byla úspěšně vytvořena');

            // Přidání testovacího markeru
            L.marker([49.8175, 15.4730]).addTo(map)
                .bindPopup('Střed České republiky')
                .openPopup();

            // Aktualizace velikosti mapy
            setTimeout(function() {
                if (map && typeof map.invalidateSize === 'function') {
                    map.invalidateSize();
                    console.log('SimpleMap: Velikost mapy byla aktualizována');
                }
            }, 500);

            // Vrácení instance mapy
            return map;
        } catch (error) {
            console.error('SimpleMap: Chyba při vytváření mapy:', error);
            return null;
        }
    },

    // Kontrola a oprava mapy
    fixMap: function() {
        console.log('SimpleMap: Kontrola a oprava mapy...');

        // Kontrola, zda existuje element pro mapu
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            console.error('SimpleMap: Element pro mapu nebyl nalezen!');
            return this.init();
        }

        // Kontrola, zda je mapa inicializována
        if (!window.map || !(window.map instanceof L.Map)) {
            console.error('SimpleMap: Mapa není inicializována!');
            return this.init();
        }

        // Kontrola viditelnosti mapy
        const mapStyle = window.getComputedStyle(mapElement);
        if (mapStyle.display === 'none' || mapStyle.visibility === 'hidden') {
            console.error('SimpleMap: Mapa je skrytá!');
            mapElement.style.display = 'block';
            mapElement.style.visibility = 'visible';
        }

        // Kontrola velikosti mapy
        if (mapElement.offsetWidth === 0 || mapElement.offsetHeight === 0) {
            console.error('SimpleMap: Mapa má nulovou velikost!');
            mapElement.style.width = '100%';
            mapElement.style.height = '500px';
        }

        // Aktualizace velikosti mapy
        if (window.map && typeof window.map.invalidateSize === 'function') {
            window.map.invalidateSize();
            console.log('SimpleMap: Velikost mapy byla aktualizována');
        } else {
            console.error('SimpleMap: Nelze aktualizovat velikost mapy!');
        }

        console.log('SimpleMap: Kontrola a oprava mapy dokončena');
    }
};

// Počkat na načtení dokumentu
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - inicializace SimpleMap...');

    // Inicializace mapy s malým zpožděním pro jistotu
    setTimeout(function() {
        SimpleMap.init();
    }, 500);
});

// Opakovaná kontrola mapy po načtení stránky
window.addEventListener('load', function() {
    console.log('Window load - kontrola SimpleMap...');

    // Kontrola a oprava mapy
    setTimeout(function() {
        SimpleMap.fixMap();
    }, 1000);
});
