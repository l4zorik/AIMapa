/**
 * Modul pro integraci různých mapových API poskytovatelů
 * Verze 0.3.8.7
 * 
 * Tento modul poskytuje jednotné rozhraní pro práci s různými mapovými API
 * se zaměřením na bezplatné a lokální poskytovatele pro střední Evropu
 */

// Hlavní objekt pro správu mapových poskytovatelů
const MapProviders = {
    // Aktuálně vybraný poskytovatel
    currentProvider: null,
    
    // Seznam dostupných poskytovatelů
    providers: {},
    
    // Inicializace modulu
    init: function(defaultProvider = 'openstreetmap') {
        console.log('Inicializace modulu mapových poskytovatelů...');
        
        // Registrace dostupných poskytovatelů
        this.registerProviders();
        
        // Nastavení výchozího poskytovatele
        this.setProvider(defaultProvider);
        
        console.log(`Modul mapových poskytovatelů byl inicializován s poskytovatelem ${this.currentProvider}`);
        return this;
    },
    
    // Registrace všech dostupných poskytovatelů
    registerProviders: function() {
        // Základní poskytovatelé
        this.registerProvider('openstreetmap', OpenStreetMapProvider);
        
        // Lokální poskytovatelé pro střední Evropu
        if (typeof MapyCzProvider !== 'undefined') {
            this.registerProvider('mapycz', MapyCzProvider);
        }
        
        if (typeof OpenRouteServiceProvider !== 'undefined') {
            this.registerProvider('openrouteservice', OpenRouteServiceProvider);
        }
        
        if (typeof WindyProvider !== 'undefined') {
            this.registerProvider('windy', WindyProvider);
        }
        
        if (typeof GeoportalProvider !== 'undefined') {
            this.registerProvider('geoportal', GeoportalProvider);
        }
        
        if (typeof FreemapSlovakiaProvider !== 'undefined') {
            this.registerProvider('freemapsk', FreemapSlovakiaProvider);
        }
        
        if (typeof BASemapProvider !== 'undefined') {
            this.registerProvider('basemap', BASemapProvider); // Rakousko
        }
        
        if (typeof GeoportalPolandProvider !== 'undefined') {
            this.registerProvider('geoportalpl', GeoportalPolandProvider);
        }
        
        if (typeof GeoDataBavaria !== 'undefined') {
            this.registerProvider('geodatabavaria', GeoDataBavaria); // Bavorsko
        }
        
        console.log(`Registrováno ${Object.keys(this.providers).length} mapových poskytovatelů`);
    },
    
    // Registrace nového poskytovatele
    registerProvider: function(id, provider) {
        if (!provider) {
            console.error(`Nelze registrovat poskytovatele ${id}: Poskytovatel není definován`);
            return false;
        }
        
        this.providers[id] = provider;
        console.log(`Registrován poskytovatel ${id}`);
        return true;
    },
    
    // Nastavení aktivního poskytovatele
    setProvider: function(providerId) {
        if (!this.providers[providerId]) {
            console.error(`Poskytovatel ${providerId} není registrován`);
            return false;
        }
        
        this.currentProvider = providerId;
        console.log(`Nastaven poskytovatel ${providerId}`);
        
        // Vyvolání události změny poskytovatele
        document.dispatchEvent(new CustomEvent('mapProviderChanged', { 
            detail: { provider: providerId } 
        }));
        
        return true;
    },
    
    // Získání instance aktuálního poskytovatele
    getCurrentProvider: function() {
        return this.providers[this.currentProvider];
    },
    
    // Získání seznamu dostupných poskytovatelů
    getAvailableProviders: function() {
        return Object.keys(this.providers).map(id => ({
            id,
            name: this.providers[id].name,
            description: this.providers[id].description,
            countries: this.providers[id].countries,
            attribution: this.providers[id].attribution,
            website: this.providers[id].website
        }));
    },
    
    // Získání poskytovatele podle země
    getProvidersByCountry: function(countryCode) {
        return Object.keys(this.providers)
            .filter(id => this.providers[id].countries.includes(countryCode))
            .map(id => ({
                id,
                name: this.providers[id].name,
                description: this.providers[id].description,
                attribution: this.providers[id].attribution,
                website: this.providers[id].website
            }));
    },
    
    // Získání nejlepšího poskytovatele pro danou zemi
    getBestProviderForCountry: function(countryCode) {
        const providers = this.getProvidersByCountry(countryCode);
        
        if (providers.length === 0) {
            return 'openstreetmap'; // Výchozí poskytovatel, pokud není nalezen žádný pro danou zemi
        }
        
        // Priorita poskytovatelů pro jednotlivé země
        const countryPriorities = {
            'CZ': ['mapycz', 'openrouteservice', 'openstreetmap'],
            'SK': ['freemapsk', 'mapycz', 'openrouteservice', 'openstreetmap'],
            'AT': ['basemap', 'openrouteservice', 'openstreetmap'],
            'DE': ['geodatabavaria', 'openrouteservice', 'openstreetmap'],
            'PL': ['geoportalpl', 'openrouteservice', 'openstreetmap']
        };
        
        // Pokud existuje prioritní seznam pro danou zemi
        if (countryPriorities[countryCode]) {
            // Procházíme prioritní seznam a vracíme první dostupný poskytovatel
            for (const providerId of countryPriorities[countryCode]) {
                if (this.providers[providerId]) {
                    return providerId;
                }
            }
        }
        
        // Pokud není nalezen žádný prioritní poskytovatel, vrátíme první dostupný
        return providers[0].id;
    },
    
    // Získání mapových dlaždic
    getTileLayer: function() {
        return this.getCurrentProvider().getTileLayer();
    },
    
    // Vyhledání místa podle názvu
    searchPlace: function(query, options = {}) {
        return this.getCurrentProvider().searchPlace(query, options);
    },
    
    // Získání trasy mezi dvěma body
    getRoute: function(start, end, options = {}) {
        return this.getCurrentProvider().getRoute(start, end, options);
    },
    
    // Získání informací o místě
    getPlaceInfo: function(coordinates) {
        return this.getCurrentProvider().getPlaceInfo(coordinates);
    },
    
    // Získání nadmořské výšky pro bod
    getElevation: function(coordinates) {
        return this.getCurrentProvider().getElevation(coordinates);
    },
    
    // Získání počasí pro bod
    getWeather: function(coordinates) {
        // Pokud aktuální poskytovatel nepodporuje počasí, použijeme Windy API
        if (typeof this.getCurrentProvider().getWeather !== 'function' && this.providers['windy']) {
            return this.providers['windy'].getWeather(coordinates);
        }
        
        return this.getCurrentProvider().getWeather(coordinates);
    },
    
    // Získání panoramatického pohledu pro bod
    getPanorama: function(coordinates) {
        return this.getCurrentProvider().getPanorama(coordinates);
    },
    
    // Získání bodů zájmu v okolí
    getPOIs: function(coordinates, radius, categories = []) {
        return this.getCurrentProvider().getPOIs(coordinates, radius, categories);
    },
    
    // Získání hranic administrativních celků
    getAdminBoundaries: function(coordinates, adminLevel = 8) {
        return this.getCurrentProvider().getAdminBoundaries(coordinates, adminLevel);
    },
    
    // Získání dopravních informací
    getTrafficInfo: function(bounds) {
        return this.getCurrentProvider().getTrafficInfo(bounds);
    },
    
    // Získání veřejné dopravy
    getPublicTransport: function(coordinates, radius) {
        return this.getCurrentProvider().getPublicTransport(coordinates, radius);
    },
    
    // Získání offline mapových dlaždic pro oblast
    getOfflineTiles: function(bounds, zoomLevels) {
        return this.getCurrentProvider().getOfflineTiles(bounds, zoomLevels);
    }
};

// Základní implementace OpenStreetMap poskytovatele
const OpenStreetMapProvider = {
    name: 'OpenStreetMap',
    description: 'Otevřená mapová data pro celý svět',
    countries: ['CZ', 'SK', 'AT', 'DE', 'PL', 'WORLD'],
    attribution: '© OpenStreetMap contributors',
    website: 'https://www.openstreetmap.org/',
    
    // Získání mapových dlaždic
    getTileLayer: function() {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options: {
                attribution: this.attribution,
                maxZoom: 19
            }
        };
    },
    
    // Vyhledání místa podle názvu pomocí Nominatim API
    searchPlace: async function(query, options = {}) {
        try {
            const params = new URLSearchParams({
                q: query,
                format: 'json',
                limit: options.limit || 10,
                addressdetails: 1
            });
            
            if (options.countryCode) {
                params.append('countrycodes', options.countryCode);
            }
            
            if (options.bounds) {
                params.append('viewbox', options.bounds.join(','));
                params.append('bounded', '1');
            }
            
            const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
                headers: {
                    'User-Agent': 'AIMapa/0.3.8.7'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při vyhledávání: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            return data.map(item => ({
                id: item.place_id,
                name: item.display_name,
                coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
                type: item.type,
                address: item.address,
                boundingBox: item.boundingbox ? item.boundingbox.map(parseFloat) : null
            }));
        } catch (error) {
            console.error('Chyba při vyhledávání místa:', error);
            throw error;
        }
    },
    
    // Získání trasy mezi dvěma body pomocí OSRM API
    getRoute: async function(start, end, options = {}) {
        try {
            const profile = options.profile || 'driving';
            const coordinates = `${start[1]},${start[0]};${end[1]},${end[0]}`;
            
            const params = new URLSearchParams({
                overview: options.overview || 'full',
                geometries: 'geojson',
                steps: options.steps ? 'true' : 'false',
                annotations: options.annotations ? 'true' : 'false'
            });
            
            const response = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coordinates}?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání trasy: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error('Trasa nenalezena');
            }
            
            const route = data.routes[0];
            
            return {
                distance: route.distance, // v metrech
                duration: route.duration, // v sekundách
                geometry: route.geometry,
                legs: route.legs,
                summary: route.summary
            };
        } catch (error) {
            console.error('Chyba při získávání trasy:', error);
            throw error;
        }
    },
    
    // Získání informací o místě pomocí Nominatim API
    getPlaceInfo: async function(coordinates) {
        try {
            const params = new URLSearchParams({
                lat: coordinates[0],
                lon: coordinates[1],
                format: 'json',
                addressdetails: 1
            });
            
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
                headers: {
                    'User-Agent': 'AIMapa/0.3.8.7'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání informací o místě: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            return {
                id: data.place_id,
                name: data.display_name,
                coordinates: [parseFloat(data.lat), parseFloat(data.lon)],
                type: data.type,
                address: data.address,
                boundingBox: data.boundingbox ? data.boundingbox.map(parseFloat) : null
            };
        } catch (error) {
            console.error('Chyba při získávání informací o místě:', error);
            throw error;
        }
    },
    
    // Získání nadmořské výšky pro bod pomocí Open-Elevation API
    getElevation: async function(coordinates) {
        try {
            const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    locations: [
                        {
                            latitude: coordinates[0],
                            longitude: coordinates[1]
                        }
                    ]
                })
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání nadmořské výšky: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                throw new Error('Nadmořská výška nenalezena');
            }
            
            return {
                elevation: data.results[0].elevation,
                coordinates: [data.results[0].latitude, data.results[0].longitude]
            };
        } catch (error) {
            console.error('Chyba při získávání nadmořské výšky:', error);
            throw error;
        }
    },
    
    // Získání bodů zájmu v okolí pomocí Overpass API
    getPOIs: async function(coordinates, radius, categories = []) {
        try {
            // Vytvoření Overpass QL dotazu
            let query = `
                [out:json];
                (
                    node(around:${radius},${coordinates[0]},${coordinates[1]});
                );
                out body;
                >;
                out skel qt;
            `;
            
            // Pokud jsou specifikovány kategorie, upravíme dotaz
            if (categories.length > 0) {
                query = `
                    [out:json];
                    (
                        ${categories.map(category => `
                            node["${category}"](around:${radius},${coordinates[0]},${coordinates[1]});
                        `).join('')}
                    );
                    out body;
                    >;
                    out skel qt;
                `;
            }
            
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `data=${encodeURIComponent(query)}`
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání bodů zájmu: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            return data.elements.filter(element => element.type === 'node').map(node => ({
                id: node.id,
                coordinates: [node.lat, node.lon],
                tags: node.tags,
                name: node.tags.name,
                type: node.tags.amenity || node.tags.shop || node.tags.tourism || node.tags.leisure
            }));
        } catch (error) {
            console.error('Chyba při získávání bodů zájmu:', error);
            throw error;
        }
    }
};

// Export modulu
window.MapProviders = MapProviders;
