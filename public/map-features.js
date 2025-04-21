/**
 * Rozšířené mapové funkce pro AIMapa verze 0.2.9.2
 * Implementace pokročilých mapových funkcí a nástrojů
 */

// Objekt pro správu mapových funkcí
const MapFeatures = {
    // Reference na mapu
    map: null,

    // Vrstvy mapy
    layers: {
        base: null,
        satellite: null,
        terrain: null,
        traffic: null,
        buildings: null
    },

    // Aktivní vrstva
    activeBaseLayer: 'standard',

    // Inicializace mapových funkcí
    init(mapInstance) {
        console.log('Inicializace mapových funkcí...');

        // Uložení reference na mapu
        this.map = mapInstance;

        // Inicializace vrstev
        this.initLayers();

        // Inicializace ovládacích prvků
        this.initControls();

        // Nastavení event listenerů
        this.setupEventListeners();

        console.log('Mapové funkce byly inicializovány');
    },

    // Inicializace vrstev mapy
    initLayers() {
        if (!this.map) return;

        // Základní vrstva (OpenStreetMap)
        this.layers.base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Satelitní vrstva
        this.layers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        });

        // Terénní vrstva
        this.layers.terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        });

        // Dopravní vrstva
        this.layers.traffic = L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6170aad10dfd42a38d4d8c709a536f38', {
            attribution: 'Maps &copy; <a href="http://www.thunderforest.com">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        });
    },

    // Inicializace ovládacích prvků
    initControls() {
        if (!this.map) return;

        // Přidání měřítka
        L.control.scale({
            imperial: false,
            metric: true,
            position: 'bottomleft'
        }).addTo(this.map);

        // Vytvoření přepínače vrstev
        this.createLayerSwitcher();
    },

    // Vytvoření přepínače vrstev
    createLayerSwitcher() {
        // Kontrola, zda již přepínač neexistuje
        if (document.getElementById('layerSwitcher')) {
            return;
        }

        // Vytvoření kontejneru pro přepínač
        const layerSwitcher = document.createElement('div');
        layerSwitcher.id = 'layerSwitcher';
        layerSwitcher.className = 'layer-switcher';

        // Vytvoření obsahu přepínače
        layerSwitcher.innerHTML = `
            <button class="layer-button ${this.activeBaseLayer === 'standard' ? 'active' : ''}" data-layer="standard">
                <i class="fas fa-map"></i>
                <span>Standard</span>
            </button>
            <button class="layer-button ${this.activeBaseLayer === 'satellite' ? 'active' : ''}" data-layer="satellite">
                <i class="fas fa-satellite"></i>
                <span>Satelit</span>
            </button>
            <button class="layer-button ${this.activeBaseLayer === 'terrain' ? 'active' : ''}" data-layer="terrain">
                <i class="fas fa-mountain"></i>
                <span>Terén</span>
            </button>
            <button class="layer-button ${this.activeBaseLayer === 'traffic' ? 'active' : ''}" data-layer="traffic">
                <i class="fas fa-road"></i>
                <span>Doprava</span>
            </button>
        `;

        // Přidání přepínače do dokumentu
        document.querySelector('.map-wrapper').appendChild(layerSwitcher);

        // Přidání event listenerů
        const buttons = layerSwitcher.querySelectorAll('.layer-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const layerType = button.getAttribute('data-layer');
                this.switchBaseLayer(layerType);

                // Aktualizace aktivního tlačítka
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    },

    // Přepnutí základní vrstvy
    switchBaseLayer(layerType) {
        if (!this.map) return;

        // Odstranění všech základních vrstev
        Object.values(this.layers).forEach(layer => {
            if (layer) {
                this.map.removeLayer(layer);
            }
        });

        // Přidání vybrané vrstvy
        switch (layerType) {
            case 'satellite':
                this.layers.satellite.addTo(this.map);
                break;

            case 'terrain':
                this.layers.terrain.addTo(this.map);
                break;

            case 'traffic':
                this.layers.traffic.addTo(this.map);
                break;

            case 'standard':
            default:
                this.layers.base.addTo(this.map);
                break;
        }

        // Uložení aktivní vrstvy
        this.activeBaseLayer = layerType;

        // Uložení preference do localStorage
        localStorage.setItem('aiMapaActiveLayer', layerType);
    },

    // Nastavení event listenerů
    setupEventListeners() {
        if (!this.map) return;

        // Posluchač pro kliknutí na mapu
        this.map.on('click', (e) => {
            // Vytvoření události pro přidání bodu
            const event = new CustomEvent('mapClicked', {
                detail: {
                    latlng: e.latlng
                }
            });

            // Vyslání události
            document.dispatchEvent(event);
        });

        // Posluchač pro změnu zoomu
        this.map.on('zoomend', () => {
            // Vytvoření události pro změnu zoomu
            const event = new CustomEvent('mapZoomChanged', {
                detail: {
                    zoom: this.map.getZoom()
                }
            });

            // Vyslání události
            document.dispatchEvent(event);
        });

        // Posluchač pro změnu středu mapy
        this.map.on('moveend', () => {
            // Vytvoření události pro změnu středu mapy
            const event = new CustomEvent('mapMoved', {
                detail: {
                    center: this.map.getCenter()
                }
            });

            // Vyslání události
            document.dispatchEvent(event);
        });
    },

    // Funkce pro přidání vlastního bodu na mapu
    addCustomMarker(latlng, options = {}) {
        if (!this.map) return null;

        // Výchozí nastavení
        const defaultOptions = {
            title: 'Vlastní bod',
            description: '',
            icon: null,
            draggable: true,
            color: '#6366F1'
        };

        // Sloučení výchozího nastavení s uživatelským
        const markerOptions = { ...defaultOptions, ...options };

        // Vytvoření ikony, pokud není zadána
        if (!markerOptions.icon) {
            markerOptions.icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin" style="background-color: ${markerOptions.color};"></div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });
        }

        // Vytvoření markeru
        const marker = L.marker(latlng, {
            icon: markerOptions.icon,
            draggable: markerOptions.draggable,
            title: markerOptions.title
        }).addTo(this.map);

        // Přidání popupu
        if (markerOptions.title || markerOptions.description) {
            marker.bindPopup(`
                <div class="custom-popup">
                    ${markerOptions.title ? `<h3>${markerOptions.title}</h3>` : ''}
                    ${markerOptions.description ? `<p>${markerOptions.description}</p>` : ''}
                </div>
            `);
        }

        return marker;
    },

    // Funkce pro vytvoření trasy mezi body
    createRoute(waypoints, options = {}) {
        if (!this.map) return null;

        // Výchozí nastavení
        const defaultOptions = {
            color: '#6366F1',
            weight: 6,
            opacity: 0.8,
            fitBounds: true
        };

        // Sloučení výchozího nastavení s uživatelským
        const routeOptions = { ...defaultOptions, ...options };

        // Vytvoření trasy
        const routeControl = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: true,
            showAlternatives: false,
            fitSelectedRoutes: routeOptions.fitBounds,
            lineOptions: {
                styles: [
                    { color: routeOptions.color, opacity: routeOptions.opacity, weight: routeOptions.weight },
                    { color: 'white', opacity: 0.3, weight: routeOptions.weight + 4 }
                ]
            },
            createMarker: function() {
                return null; // Nezobrazovat markery trasy
            }
        }).addTo(this.map);

        return routeControl;
    },

    // Funkce pro přidání oblasti na mapu
    addArea(latlngs, options = {}) {
        if (!this.map) return null;

        // Výchozí nastavení
        const defaultOptions = {
            color: '#6366F1',
            fillColor: '#6366F1',
            fillOpacity: 0.2,
            weight: 2
        };

        // Sloučení výchozího nastavení s uživatelským
        const areaOptions = { ...defaultOptions, ...options };

        // Vytvoření polygonu
        const polygon = L.polygon(latlngs, areaOptions).addTo(this.map);

        return polygon;
    },

    // Funkce pro přidání kruhu na mapu
    addCircle(latlng, radius, options = {}) {
        if (!this.map) return null;

        // Výchozí nastavení
        const defaultOptions = {
            color: '#6366F1',
            fillColor: '#6366F1',
            fillOpacity: 0.2,
            weight: 2
        };

        // Sloučení výchozího nastavení s uživatelským
        const circleOptions = { ...defaultOptions, ...options };

        // Vytvoření kruhu
        const circle = L.circle(latlng, {
            radius: radius,
            ...circleOptions
        }).addTo(this.map);

        return circle;
    },

    // Funkce pro přidání popisku na mapu
    addLabel(latlng, text, options = {}) {
        if (!this.map) return null;

        // Výchozí nastavení
        const defaultOptions = {
            className: 'map-label',
            permanent: true,
            direction: 'center',
            offset: [0, 0]
        };

        // Sloučení výchozího nastavení s uživatelským
        const labelOptions = { ...defaultOptions, ...options };

        // Vytvoření popisku
        const label = L.marker(latlng, {
            icon: L.divIcon({
                className: labelOptions.className,
                html: `<div>${text}</div>`,
                iconSize: null
            }),
            interactive: false,
            ...labelOptions
        }).addTo(this.map);

        return label;
    },

    // Funkce pro přiblížení na oblast
    fitBounds(bounds, options = {}) {
        if (!this.map) return;

        // Výchozí nastavení
        const defaultOptions = {
            padding: [50, 50],
            maxZoom: 16,
            animate: true,
            duration: 0.5
        };

        // Sloučení výchozího nastavení s uživatelským
        const fitOptions = { ...defaultOptions, ...options };

        // Přiblížení na oblast
        this.map.fitBounds(bounds, fitOptions);
    },

    // Funkce pro získání aktuálního středu mapy
    getCenter() {
        return this.map ? this.map.getCenter() : null;
    },

    // Funkce pro získání aktuálního zoomu mapy
    getZoom() {
        return this.map ? this.map.getZoom() : null;
    },

    // Funkce pro získání aktuálního ohraničení mapy
    getBounds() {
        return this.map ? this.map.getBounds() : null;
    }
};

// Export objektu pro použití v jiných souborech
window.MapFeatures = MapFeatures;