/**
 * Mapy.cz Provider
 * Verze 0.3.8.7
 * 
 * Implementace poskytovatele mapových služeb Mapy.cz
 * Dokumentace API: https://developer.mapy.cz/
 */

const MapyCzProvider = {
    name: 'Mapy.cz',
    description: 'Nejpopulárnější mapová služba v České republice a na Slovensku',
    countries: ['CZ', 'SK'],
    attribution: '© Seznam.cz, a.s., © OpenStreetMap, © NASA',
    website: 'https://mapy.cz/',
    apiKey: '', // API klíč pro Mapy.cz (pro některé funkce)
    
    // Inicializace poskytovatele
    init: function(apiKey = '') {
        this.apiKey = apiKey;
        
        // Načtení Mapy.cz API, pokud ještě není načteno
        if (typeof SMap === 'undefined') {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://api.mapy.cz/loader.js';
                script.async = true;
                
                script.onload = () => {
                    // Inicializace Mapy.cz API
                    Loader.load(null, { suggest: true, poi: true, geocode: true, route: true }, () => {
                        console.log('Mapy.cz API bylo úspěšně načteno');
                        resolve();
                    });
                };
                
                script.onerror = () => {
                    console.error('Chyba při načítání Mapy.cz API');
                    reject(new Error('Chyba při načítání Mapy.cz API'));
                };
                
                document.head.appendChild(script);
            });
        }
        
        return Promise.resolve();
    },
    
    // Získání mapových dlaždic
    getTileLayer: function() {
        return {
            url: 'https://mapserver.mapy.cz/base-m/{z}-{x}-{y}',
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
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined' || typeof SMap.Suggest === 'undefined') {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                const suggest = new SMap.Suggest(document.createElement('input'));
                
                // Nastavení filtru podle země
                if (options.countryCode) {
                    suggest.setCountry(options.countryCode);
                }
                
                // Nastavení limitu výsledků
                const limit = options.limit || 10;
                
                suggest.request(query, (suggestions) => {
                    const results = suggestions.slice(0, limit).map(item => ({
                        id: item.data.id,
                        name: item.data.text,
                        coordinates: [item.data.latitude, item.data.longitude],
                        type: item.data.type,
                        address: {
                            country: item.data.country,
                            county: item.data.county,
                            municipality: item.data.municipality,
                            street: item.data.street,
                            house_number: item.data.house_number
                        }
                    }));
                    
                    resolve(results);
                });
            });
        } catch (error) {
            console.error('Chyba při vyhledávání místa:', error);
            throw error;
        }
    },
    
    // Získání trasy mezi dvěma body
    getRoute: async function(start, end, options = {}) {
        try {
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined' || typeof SMap.Route === 'undefined') {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                // Nastavení profilu trasy
                const profile = options.profile || 'car';
                let routeType;
                
                switch (profile) {
                    case 'car':
                        routeType = SMap.Route.TYPE_FASTEST;
                        break;
                    case 'foot':
                        routeType = SMap.Route.TYPE_PEDESTRIAN;
                        break;
                    case 'bike':
                        routeType = SMap.Route.TYPE_BIKE;
                        break;
                    default:
                        routeType = SMap.Route.TYPE_FASTEST;
                }
                
                // Vytvoření trasy
                const route = new SMap.Route([
                    SMap.Coords.fromWGS84(start[1], start[0]),
                    SMap.Coords.fromWGS84(end[1], end[0])
                ], (route) => {
                    if (!route) {
                        reject(new Error('Trasa nenalezena'));
                        return;
                    }
                    
                    const geometry = route.getGeometry();
                    const coordinates = [];
                    
                    // Převod geometrie na GeoJSON
                    for (let i = 0; i < geometry.length; i++) {
                        const coords = SMap.Coords.fromPixel(geometry[i], 0);
                        const wgs = coords.toWGS84();
                        coordinates.push([wgs[1], wgs[0]]);
                    }
                    
                    // Získání instrukcí
                    const instructions = route.getResults().instructions.map(instruction => ({
                        distance: instruction.distance,
                        duration: instruction.duration,
                        text: instruction.text,
                        type: instruction.type
                    }));
                    
                    resolve({
                        distance: route.getResults().length, // v metrech
                        duration: route.getResults().duration, // v sekundách
                        geometry: {
                            type: 'LineString',
                            coordinates: coordinates
                        },
                        legs: [{
                            distance: route.getResults().length,
                            duration: route.getResults().duration,
                            steps: instructions
                        }],
                        summary: route.getResults().summary
                    });
                }, { criterion: routeType });
            });
        } catch (error) {
            console.error('Chyba při získávání trasy:', error);
            throw error;
        }
    },
    
    // Získání informací o místě
    getPlaceInfo: async function(coordinates) {
        try {
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined' || typeof SMap.Geocoder === 'undefined') {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                // Vytvoření geocoderu
                const geocoder = new SMap.Geocoder.Reverse(SMap.Coords.fromWGS84(coordinates[1], coordinates[0]));
                
                geocoder.getResults((geocoder) => {
                    const results = geocoder.getResults();
                    
                    if (!results || results.length === 0) {
                        reject(new Error('Informace o místě nenalezeny'));
                        return;
                    }
                    
                    const result = results[0];
                    
                    resolve({
                        id: result.id,
                        name: result.label,
                        coordinates: [result.coords.y, result.coords.x],
                        type: result.type,
                        address: {
                            country: result.country,
                            county: result.county,
                            municipality: result.municipality,
                            street: result.street,
                            house_number: result.house_number
                        }
                    });
                });
            });
        } catch (error) {
            console.error('Chyba při získávání informací o místě:', error);
            throw error;
        }
    },
    
    // Získání bodů zájmu v okolí
    getPOIs: async function(coordinates, radius, categories = []) {
        try {
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined' || typeof SMap.POI === 'undefined') {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                // Vytvoření POI manageru
                const poiManager = new SMap.POI.Manager();
                
                // Nastavení filtru podle kategorií
                let filter = null;
                if (categories.length > 0) {
                    filter = (poi) => categories.includes(poi.getType());
                }
                
                // Získání POI v okolí
                poiManager.findInRadius(
                    SMap.Coords.fromWGS84(coordinates[1], coordinates[0]),
                    radius,
                    (pois) => {
                        if (!pois || pois.length === 0) {
                            resolve([]);
                            return;
                        }
                        
                        const results = pois.map(poi => {
                            const coords = poi.getCoords().toWGS84();
                            
                            return {
                                id: poi.getId(),
                                name: poi.getTitle(),
                                coordinates: [coords[1], coords[0]],
                                type: poi.getType(),
                                description: poi.getDescription(),
                                url: poi.getUrl()
                            };
                        });
                        
                        resolve(results);
                    },
                    { filter }
                );
            });
        } catch (error) {
            console.error('Chyba při získávání bodů zájmu:', error);
            throw error;
        }
    },
    
    // Získání panoramatického pohledu pro bod
    getPanorama: async function(coordinates) {
        try {
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined' || typeof SMap.Pano === 'undefined') {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                // Vytvoření Pano manageru
                const panoManager = new SMap.Pano.Manager();
                
                // Získání nejbližšího panoramatu
                panoManager.getBest(
                    SMap.Coords.fromWGS84(coordinates[1], coordinates[0]),
                    (pano) => {
                        if (!pano) {
                            reject(new Error('Panorama nenalezeno'));
                            return;
                        }
                        
                        const coords = pano.getCoords().toWGS84();
                        
                        resolve({
                            id: pano.getId(),
                            coordinates: [coords[1], coords[0]],
                            url: pano.getUrl(),
                            date: pano.getDate()
                        });
                    }
                );
            });
        } catch (error) {
            console.error('Chyba při získávání panoramatu:', error);
            throw error;
        }
    },
    
    // Získání dopravních informací
    getTrafficInfo: async function(bounds) {
        try {
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined' || typeof SMap.Traffic === 'undefined') {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                // Vytvoření Traffic manageru
                const trafficManager = new SMap.Traffic.Manager();
                
                // Získání dopravních informací
                trafficManager.getAll((traffic) => {
                    if (!traffic || traffic.length === 0) {
                        resolve([]);
                        return;
                    }
                    
                    // Filtrování podle hranic
                    const filteredTraffic = traffic.filter(item => {
                        const coords = item.getCoords().toWGS84();
                        const lat = coords[1];
                        const lon = coords[0];
                        
                        return lat >= bounds[0][0] && lat <= bounds[1][0] && lon >= bounds[0][1] && lon <= bounds[1][1];
                    });
                    
                    const results = filteredTraffic.map(item => {
                        const coords = item.getCoords().toWGS84();
                        
                        return {
                            id: item.getId(),
                            title: item.getTitle(),
                            description: item.getDescription(),
                            coordinates: [coords[1], coords[0]],
                            type: item.getType(),
                            severity: item.getSeverity(),
                            start: item.getStart(),
                            end: item.getEnd()
                        };
                    });
                    
                    resolve(results);
                });
            });
        } catch (error) {
            console.error('Chyba při získávání dopravních informací:', error);
            throw error;
        }
    },
    
    // Získání veřejné dopravy
    getPublicTransport: async function(coordinates, radius) {
        try {
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined' || typeof SMap.POI === 'undefined') {
                await this.init();
            }
            
            return new Promise((resolve, reject) => {
                // Vytvoření POI manageru
                const poiManager = new SMap.POI.Manager();
                
                // Nastavení filtru pro veřejnou dopravu
                const filter = (poi) => {
                    const type = poi.getType();
                    return type === 'bus_stop' || type === 'tram_stop' || type === 'subway_entrance' || type === 'train_station';
                };
                
                // Získání zastávek v okolí
                poiManager.findInRadius(
                    SMap.Coords.fromWGS84(coordinates[1], coordinates[0]),
                    radius,
                    (pois) => {
                        if (!pois || pois.length === 0) {
                            resolve([]);
                            return;
                        }
                        
                        const results = pois.map(poi => {
                            const coords = poi.getCoords().toWGS84();
                            
                            return {
                                id: poi.getId(),
                                name: poi.getTitle(),
                                coordinates: [coords[1], coords[0]],
                                type: poi.getType(),
                                description: poi.getDescription(),
                                url: poi.getUrl()
                            };
                        });
                        
                        resolve(results);
                    },
                    { filter }
                );
            });
        } catch (error) {
            console.error('Chyba při získávání veřejné dopravy:', error);
            throw error;
        }
    },
    
    // Získání offline mapových dlaždic pro oblast
    getOfflineTiles: async function(bounds, zoomLevels) {
        try {
            // Kontrola, zda je API načteno
            if (typeof SMap === 'undefined') {
                await this.init();
            }
            
            // Výpočet dlaždic pro stažení
            const tiles = [];
            
            for (const zoom of zoomLevels) {
                // Výpočet rozsahu dlaždic pro daný zoom
                const topLeft = SMap.Coords.fromWGS84(bounds[0][1], bounds[0][0]);
                const bottomRight = SMap.Coords.fromWGS84(bounds[1][1], bounds[1][0]);
                
                const topLeftTile = SMap.Coords.tileFromCoords(topLeft, zoom);
                const bottomRightTile = SMap.Coords.tileFromCoords(bottomRight, zoom);
                
                // Procházení všech dlaždic v rozsahu
                for (let x = topLeftTile[0]; x <= bottomRightTile[0]; x++) {
                    for (let y = topLeftTile[1]; y <= bottomRightTile[1]; y++) {
                        tiles.push({
                            url: `https://mapserver.mapy.cz/base-m/${zoom}-${x}-${y}`,
                            x,
                            y,
                            zoom
                        });
                    }
                }
            }
            
            return tiles;
        } catch (error) {
            console.error('Chyba při získávání offline dlaždic:', error);
            throw error;
        }
    }
};

// Export poskytovatele
window.MapyCzProvider = MapyCzProvider;
