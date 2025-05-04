/**
 * Windy Provider
 * Verze 0.3.8.7
 * 
 * Implementace poskytovatele mapových služeb Windy pro počasí a předpovědi
 * Dokumentace API: https://api.windy.com/
 */

const WindyProvider = {
    name: 'Windy',
    description: 'Služba pro zobrazení počasí a předpovědi s pokročilými funkcemi',
    countries: ['CZ', 'SK', 'AT', 'DE', 'PL', 'WORLD'],
    attribution: '© Windy.com, © OpenStreetMap contributors',
    website: 'https://www.windy.com/',
    apiKey: '', // API klíč pro Windy
    
    // Inicializace poskytovatele
    init: function(apiKey = '') {
        this.apiKey = apiKey;
        
        // Načtení Windy API, pokud ještě není načteno
        if (typeof W === 'undefined' && typeof windyInit === 'undefined') {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://api.windy.com/assets/map-forecast/libBoot.js';
                script.async = true;
                
                script.onload = () => {
                    console.log('Windy API bylo úspěšně načteno');
                    resolve();
                };
                
                script.onerror = () => {
                    console.error('Chyba při načítání Windy API');
                    reject(new Error('Chyba při načítání Windy API'));
                };
                
                document.head.appendChild(script);
            });
        }
        
        return Promise.resolve();
    },
    
    // Získání mapových dlaždic
    getTileLayer: function() {
        return {
            url: 'https://tiles.windy.com/tiles/v9.0/darkmap/{z}/{x}/{y}.png',
            options: {
                attribution: this.attribution,
                maxZoom: 19,
                minZoom: 2
            }
        };
    },
    
    // Vyhledání místa podle názvu
    searchPlace: async function(query, options = {}) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro Windy není nastaven');
            }
            
            const params = new URLSearchParams({
                q: query,
                limit: options.limit || 10,
                key: this.apiKey
            });
            
            const response = await fetch(`https://api.windy.com/api/geocoding/v1/search?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při vyhledávání: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                return [];
            }
            
            return data.results.map(item => ({
                id: item.id,
                name: item.name,
                coordinates: [item.lat, item.lon],
                type: item.type,
                address: {
                    country: item.country,
                    state: item.state,
                    city: item.city
                },
                population: item.population
            }));
        } catch (error) {
            console.error('Chyba při vyhledávání místa:', error);
            throw error;
        }
    },
    
    // Získání počasí pro bod
    getWeather: async function(coordinates) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro Windy není nastaven');
            }
            
            const params = new URLSearchParams({
                lat: coordinates[0],
                lon: coordinates[1],
                model: 'ecmwf', // Evropský model předpovědi počasí
                key: this.apiKey
            });
            
            const response = await fetch(`https://api.windy.com/api/point-forecast/v2?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání počasí: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.ts) {
                throw new Error('Počasí nenalezeno');
            }
            
            // Zpracování dat
            const forecasts = [];
            
            for (let i = 0; i < data.ts.length; i++) {
                const timestamp = data.ts[i] * 1000; // převod na milisekundy
                const date = new Date(timestamp);
                
                forecasts.push({
                    date: date,
                    timestamp: timestamp,
                    temperature: data.temperature && data.temperature[i] !== null ? data.temperature[i] : null,
                    dewPoint: data.dewpoint && data.dewpoint[i] !== null ? data.dewpoint[i] : null,
                    precipitation: data.precip && data.precip[i] !== null ? data.precip[i] : null,
                    windSpeed: data.wind && data.wind[i] !== null ? data.wind[i] : null,
                    windDirection: data.windDir && data.windDir[i] !== null ? data.windDir[i] : null,
                    pressure: data.pressure && data.pressure[i] !== null ? data.pressure[i] : null,
                    clouds: data.clouds && data.clouds[i] !== null ? data.clouds[i] : null,
                    humidity: data.rh && data.rh[i] !== null ? data.rh[i] : null,
                    snowDepth: data.snowDepth && data.snowDepth[i] !== null ? data.snowDepth[i] : null,
                    visibility: data.visibility && data.visibility[i] !== null ? data.visibility[i] : null
                });
            }
            
            // Získání aktuálního počasí (první položka v předpovědi)
            const current = forecasts[0];
            
            return {
                current: {
                    date: current.date,
                    temperature: current.temperature,
                    dewPoint: current.dewPoint,
                    precipitation: current.precipitation,
                    windSpeed: current.windSpeed,
                    windDirection: current.windDirection,
                    pressure: current.pressure,
                    clouds: current.clouds,
                    humidity: current.humidity,
                    snowDepth: current.snowDepth,
                    visibility: current.visibility
                },
                forecasts: forecasts,
                coordinates: coordinates,
                units: {
                    temperature: '°C',
                    windSpeed: 'm/s',
                    pressure: 'hPa',
                    precipitation: 'mm',
                    snowDepth: 'm',
                    visibility: 'm'
                },
                source: 'Windy.com (ECMWF)'
            };
        } catch (error) {
            console.error('Chyba při získávání počasí:', error);
            throw error;
        }
    },
    
    // Získání předpovědi počasí pro bod
    getForecast: async function(coordinates, options = {}) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro Windy není nastaven');
            }
            
            const params = new URLSearchParams({
                lat: coordinates[0],
                lon: coordinates[1],
                model: options.model || 'ecmwf', // Evropský model předpovědi počasí
                parameters: options.parameters || 'wind,temperature,pressure,clouds,rh,precip',
                levels: options.levels || 'surface',
                key: this.apiKey
            });
            
            const response = await fetch(`https://api.windy.com/api/point-forecast/v2?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání předpovědi: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.ts) {
                throw new Error('Předpověď nenalezena');
            }
            
            // Zpracování dat
            const forecasts = [];
            
            for (let i = 0; i < data.ts.length; i++) {
                const timestamp = data.ts[i] * 1000; // převod na milisekundy
                const date = new Date(timestamp);
                
                forecasts.push({
                    date: date,
                    timestamp: timestamp,
                    temperature: data.temperature && data.temperature[i] !== null ? data.temperature[i] : null,
                    dewPoint: data.dewpoint && data.dewpoint[i] !== null ? data.dewpoint[i] : null,
                    precipitation: data.precip && data.precip[i] !== null ? data.precip[i] : null,
                    windSpeed: data.wind && data.wind[i] !== null ? data.wind[i] : null,
                    windDirection: data.windDir && data.windDir[i] !== null ? data.windDir[i] : null,
                    pressure: data.pressure && data.pressure[i] !== null ? data.pressure[i] : null,
                    clouds: data.clouds && data.clouds[i] !== null ? data.clouds[i] : null,
                    humidity: data.rh && data.rh[i] !== null ? data.rh[i] : null,
                    snowDepth: data.snowDepth && data.snowDepth[i] !== null ? data.snowDepth[i] : null,
                    visibility: data.visibility && data.visibility[i] !== null ? data.visibility[i] : null
                });
            }
            
            return {
                forecasts: forecasts,
                coordinates: coordinates,
                units: {
                    temperature: '°C',
                    windSpeed: 'm/s',
                    pressure: 'hPa',
                    precipitation: 'mm',
                    snowDepth: 'm',
                    visibility: 'm'
                },
                source: `Windy.com (${data.modelName || options.model})`
            };
        } catch (error) {
            console.error('Chyba při získávání předpovědi:', error);
            throw error;
        }
    },
    
    // Získání radarových dat pro oblast
    getRadar: async function(bounds, options = {}) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro Windy není nastaven');
            }
            
            // Kontrola, zda je API načteno
            if (typeof W === 'undefined' && typeof windyInit === 'undefined') {
                await this.init();
            }
            
            // Vytvoření elementu pro mapu
            const mapElement = document.createElement('div');
            mapElement.id = 'windy-map-container';
            mapElement.style.width = '1px';
            mapElement.style.height = '1px';
            mapElement.style.position = 'absolute';
            mapElement.style.left = '-1000px';
            mapElement.style.top = '-1000px';
            
            document.body.appendChild(mapElement);
            
            return new Promise((resolve, reject) => {
                // Inicializace Windy mapy
                windyInit({
                    key: this.apiKey,
                    lat: (bounds[0][0] + bounds[1][0]) / 2,
                    lon: (bounds[0][1] + bounds[1][1]) / 2,
                    zoom: 8
                }, windyAPI => {
                    try {
                        const { map, store, overlays } = windyAPI;
                        
                        // Nastavení vrstvy
                        const layer = options.layer || 'radar';
                        store.set('overlay', layer);
                        
                        // Nastavení modelu
                        const model = options.model || 'ecmwf';
                        store.set('model', model);
                        
                        // Získání URL radarových dlaždic
                        const tileLayer = overlays.radar || overlays[layer];
                        
                        if (!tileLayer) {
                            reject(new Error(`Vrstva ${layer} není k dispozici`));
                            return;
                        }
                        
                        const tileUrl = tileLayer._url;
                        const tileOptions = {
                            attribution: this.attribution,
                            maxZoom: tileLayer.options.maxZoom,
                            minZoom: tileLayer.options.minZoom,
                            opacity: tileLayer.options.opacity
                        };
                        
                        // Odstranění dočasného elementu
                        document.body.removeChild(mapElement);
                        
                        resolve({
                            url: tileUrl,
                            options: tileOptions,
                            bounds: bounds,
                            layer: layer,
                            model: model,
                            timestamp: Date.now()
                        });
                    } catch (error) {
                        // Odstranění dočasného elementu
                        document.body.removeChild(mapElement);
                        
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error('Chyba při získávání radarových dat:', error);
            throw error;
        }
    },
    
    // Získání URL pro zobrazení Windy mapy
    getMapUrl: function(coordinates, options = {}) {
        const params = new URLSearchParams({
            lat: coordinates[0],
            lon: coordinates[1],
            zoom: options.zoom || 8,
            overlay: options.overlay || 'wind',
            level: options.level || 'surface',
            timestamp: options.timestamp || 'now'
        });
        
        return `https://www.windy.com/?${params.toString()}`;
    },
    
    // Získání URL pro vložení Windy mapy do iframe
    getEmbedUrl: function(coordinates, options = {}) {
        const params = new URLSearchParams({
            lat: coordinates[0],
            lon: coordinates[1],
            zoom: options.zoom || 8,
            overlay: options.overlay || 'wind',
            level: options.level || 'surface',
            timestamp: options.timestamp || 'now',
            key: this.apiKey
        });
        
        return `https://embed.windy.com/embed2.html?${params.toString()}`;
    }
};

// Export poskytovatele
window.WindyProvider = WindyProvider;
