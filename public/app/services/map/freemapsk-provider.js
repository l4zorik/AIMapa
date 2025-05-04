/**
 * FreemapSlovakia Provider
 * Verze 0.3.8.7
 * 
 * Implementace poskytovatele mapových služeb Freemap Slovakia
 * Dokumentace API: https://github.com/FreemapSlovakia/freemap-v3-react/wiki/API
 */

const FreemapSlovakiaProvider = {
    name: 'Freemap Slovakia',
    description: 'Otevřená mapová služba pro Slovensko s turistickými mapami',
    countries: ['SK'],
    attribution: '© Freemap Slovakia, © OpenStreetMap contributors, CC-BY-SA',
    website: 'https://www.freemap.sk/',
    apiKey: '', // API klíč pro Freemap Slovakia
    
    // Inicializace poskytovatele
    init: function(apiKey = '') {
        this.apiKey = apiKey;
        return Promise.resolve();
    },
    
    // Získání mapových dlaždic
    getTileLayer: function() {
        return {
            url: 'https://tile.freemap.sk/{z}/{x}/{y}.jpeg',
            options: {
                attribution: this.attribution,
                maxZoom: 19,
                minZoom: 8
            }
        };
    },
    
    // Získání turistických mapových dlaždic
    getTouristTileLayer: function() {
        return {
            url: 'https://outdoor.tiles.freemap.sk/{z}/{x}/{y}',
            options: {
                attribution: this.attribution,
                maxZoom: 19,
                minZoom: 8
            }
        };
    },
    
    // Získání cyklistických mapových dlaždic
    getCycleTileLayer: function() {
        return {
            url: 'https://bike.tiles.freemap.sk/{z}/{x}/{y}',
            options: {
                attribution: this.attribution,
                maxZoom: 19,
                minZoom: 8
            }
        };
    },
    
    // Vyhledání místa podle názvu
    searchPlace: async function(query, options = {}) {
        try {
            const params = new URLSearchParams({
                text: query,
                limit: options.limit || 10,
                lang: options.language || 'sk'
            });
            
            // Omezení na Slovensko
            params.append('bbox', '16.8,47.7,22.6,49.7');
            
            const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}&format=json`, {
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
    
    // Získání trasy mezi dvěma body
    getRoute: async function(start, end, options = {}) {
        try {
            // Nastavení profilu trasy
            const profile = options.profile || 'car';
            
            // Mapování profilů na Freemap Slovakia profily
            const profileMap = {
                'car': 'car_full',
                'foot': 'foot',
                'bike': 'bicycle',
                'driving': 'car_full',
                'walking': 'foot',
                'cycling': 'bicycle',
                'hiking': 'hiking'
            };
            
            const mappedProfile = profileMap[profile] || profile;
            
            const params = new URLSearchParams({
                start: `${start[1]},${start[0]}`,
                finish: `${end[1]},${end[0]}`,
                type: mappedProfile,
                weighting: options.weighting || 'fastest'
            });
            
            const response = await fetch(`https://routing.epsilon.sk/route/v1/full?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání trasy: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.coordinates || data.coordinates.length === 0) {
                throw new Error('Trasa nenalezena');
            }
            
            // Převod na GeoJSON
            const coordinates = data.coordinates.map(coord => [coord[0], coord[1]]);
            
            // Vytvoření instrukcí
            const instructions = data.instructions.map(instruction => ({
                distance: instruction.distance,
                duration: instruction.duration,
                text: instruction.text,
                type: instruction.type,
                time: instruction.time,
                street_name: instruction.street_name,
                direction: instruction.direction,
                exit_number: instruction.exit_number,
                turn_angle: instruction.turn_angle
            }));
            
            return {
                distance: data.distance, // v metrech
                duration: data.duration, // v sekundách
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                },
                legs: [{
                    distance: data.distance,
                    duration: data.duration,
                    steps: instructions
                }],
                summary: `${(data.distance / 1000).toFixed(1)} km, ${Math.round(data.duration / 60)} min`
            };
        } catch (error) {
            console.error('Chyba při získávání trasy:', error);
            throw error;
        }
    },
    
    // Získání informací o místě
    getPlaceInfo: async function(coordinates) {
        try {
            const params = new URLSearchParams({
                lat: coordinates[0],
                lon: coordinates[1],
                format: 'json',
                addressdetails: 1,
                zoom: 18
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
    
    // Získání nadmořské výšky pro bod
    getElevation: async function(coordinates) {
        try {
            const response = await fetch(`https://api.freemap.sk/elevation/${coordinates[0]}/${coordinates[1]}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání nadmořské výšky: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            return {
                elevation: data.ele,
                coordinates: coordinates
            };
        } catch (error) {
            console.error('Chyba při získávání nadmořské výšky:', error);
            throw error;
        }
    },
    
    // Získání turistických tras v okolí
    getHikingTrails: async function(bounds) {
        try {
            const params = new URLSearchParams({
                bbox: `${bounds[0][1]},${bounds[0][0]},${bounds[1][1]},${bounds[1][0]}`,
                zoom: 12
            });
            
            const response = await fetch(`https://api.freemap.sk/hiking/trails?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání turistických tras: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.features || data.features.length === 0) {
                return [];
            }
            
            return data.features.map(feature => ({
                id: feature.id,
                geometry: feature.geometry,
                properties: feature.properties,
                color: feature.properties.color,
                name: feature.properties.name,
                type: feature.properties.type,
                difficulty: feature.properties.difficulty
            }));
        } catch (error) {
            console.error('Chyba při získávání turistických tras:', error);
            throw error;
        }
    },
    
    // Získání cyklistických tras v okolí
    getCycleTrails: async function(bounds) {
        try {
            const params = new URLSearchParams({
                bbox: `${bounds[0][1]},${bounds[0][0]},${bounds[1][1]},${bounds[1][0]}`,
                zoom: 12
            });
            
            const response = await fetch(`https://api.freemap.sk/cycling/trails?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání cyklistických tras: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.features || data.features.length === 0) {
                return [];
            }
            
            return data.features.map(feature => ({
                id: feature.id,
                geometry: feature.geometry,
                properties: feature.properties,
                color: feature.properties.color,
                name: feature.properties.name,
                type: feature.properties.type,
                difficulty: feature.properties.difficulty
            }));
        } catch (error) {
            console.error('Chyba při získávání cyklistických tras:', error);
            throw error;
        }
    },
    
    // Získání bodů zájmu v okolí
    getPOIs: async function(coordinates, radius, categories = []) {
        try {
            // Výpočet hranic oblasti
            const lat = coordinates[0];
            const lon = coordinates[1];
            const latDelta = radius / 111320; // přibližně 1 stupeň = 111.32 km
            const lonDelta = radius / (111320 * Math.cos(lat * Math.PI / 180));
            
            const bounds = [
                [lat - latDelta, lon - lonDelta],
                [lat + latDelta, lon + lonDelta]
            ];
            
            const params = new URLSearchParams({
                bbox: `${bounds[0][1]},${bounds[0][0]},${bounds[1][1]},${bounds[1][0]}`,
                zoom: 15
            });
            
            // Přidání kategorií
            if (categories.length > 0) {
                params.append('categories', categories.join(','));
            }
            
            const response = await fetch(`https://api.freemap.sk/poi/search?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání bodů zájmu: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.features || data.features.length === 0) {
                return [];
            }
            
            return data.features.map(feature => ({
                id: feature.id,
                coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
                properties: feature.properties,
                name: feature.properties.name,
                type: feature.properties.type,
                category: feature.properties.category
            }));
        } catch (error) {
            console.error('Chyba při získávání bodů zájmu:', error);
            throw error;
        }
    },
    
    // Získání fotografií v okolí
    getPhotos: async function(bounds) {
        try {
            const params = new URLSearchParams({
                bbox: `${bounds[0][1]},${bounds[0][0]},${bounds[1][1]},${bounds[1][0]}`,
                zoom: 12
            });
            
            const response = await fetch(`https://api.freemap.sk/photos/pictures?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání fotografií: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.features || data.features.length === 0) {
                return [];
            }
            
            return data.features.map(feature => ({
                id: feature.id,
                coordinates: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
                properties: feature.properties,
                title: feature.properties.title,
                description: feature.properties.description,
                url: feature.properties.url,
                author: feature.properties.author,
                takenAt: feature.properties.takenAt,
                rating: feature.properties.rating
            }));
        } catch (error) {
            console.error('Chyba při získávání fotografií:', error);
            throw error;
        }
    },
    
    // Získání offline mapových dlaždic pro oblast
    getOfflineTiles: async function(bounds, zoomLevels) {
        try {
            // Výpočet dlaždic pro stažení
            const tiles = [];
            
            for (const zoom of zoomLevels) {
                // Výpočet rozsahu dlaždic pro daný zoom
                const topLeftTile = this.latLonToTile(bounds[0][0], bounds[0][1], zoom);
                const bottomRightTile = this.latLonToTile(bounds[1][0], bounds[1][1], zoom);
                
                // Procházení všech dlaždic v rozsahu
                for (let x = topLeftTile.x; x <= bottomRightTile.x; x++) {
                    for (let y = topLeftTile.y; y <= bottomRightTile.y; y++) {
                        tiles.push({
                            url: `https://tile.freemap.sk/${zoom}/${x}/${y}.jpeg`,
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
    },
    
    // Převod zeměpisných souřadnic na dlaždice
    latLonToTile: function(lat, lon, zoom) {
        const n = Math.pow(2, zoom);
        const x = Math.floor((lon + 180) / 360 * n);
        const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
        
        return { x, y };
    }
};

// Export poskytovatele
window.FreemapSlovakiaProvider = FreemapSlovakiaProvider;
