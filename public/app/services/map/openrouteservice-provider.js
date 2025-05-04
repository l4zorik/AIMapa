/**
 * OpenRouteService Provider
 * Verze 0.3.8.7
 * 
 * Implementace poskytovatele mapových služeb OpenRouteService
 * Dokumentace API: https://openrouteservice.org/dev/#/api-docs
 */

const OpenRouteServiceProvider = {
    name: 'OpenRouteService',
    description: 'Služba pro plánování tras založená na OpenStreetMap s pokročilými funkcemi',
    countries: ['CZ', 'SK', 'AT', 'DE', 'PL', 'WORLD'],
    attribution: '© OpenStreetMap contributors, © OpenRouteService',
    website: 'https://openrouteservice.org/',
    apiKey: '', // API klíč pro OpenRouteService
    
    // Inicializace poskytovatele
    init: function(apiKey = '') {
        this.apiKey = apiKey;
        return Promise.resolve();
    },
    
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
    
    // Vyhledání místa podle názvu
    searchPlace: async function(query, options = {}) {
        try {
            // Použijeme Nominatim API, protože OpenRouteService nemá vlastní geocoding API
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
    
    // Získání trasy mezi dvěma body
    getRoute: async function(start, end, options = {}) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro OpenRouteService není nastaven');
            }
            
            // Nastavení profilu trasy
            const profile = options.profile || 'driving-car';
            
            // Mapování profilů na OpenRouteService profily
            const profileMap = {
                'car': 'driving-car',
                'foot': 'foot-walking',
                'bike': 'cycling-regular',
                'driving': 'driving-car',
                'walking': 'foot-walking',
                'cycling': 'cycling-regular',
                'hiking': 'foot-hiking',
                'wheelchair': 'wheelchair'
            };
            
            const mappedProfile = profileMap[profile] || profile;
            
            // Vytvoření těla požadavku
            const body = {
                coordinates: [
                    [start[1], start[0]],
                    [end[1], end[0]]
                ],
                instructions: options.instructions !== false,
                elevation: options.elevation === true,
                geometry_format: 'geojson',
                format: 'json',
                units: options.units || 'km',
                language: options.language || 'cs'
            };
            
            // Přidání dalších možností
            if (options.avoid) {
                body.options = {
                    avoid_features: options.avoid
                };
            }
            
            if (options.preference) {
                body.preference = options.preference;
            }
            
            const response = await fetch(`https://api.openrouteservice.org/v2/directions/${mappedProfile}/geojson`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiKey
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání trasy: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.features || data.features.length === 0) {
                throw new Error('Trasa nenalezena');
            }
            
            const route = data.features[0];
            const properties = route.properties;
            const segments = properties.segments;
            
            // Převod na jednotný formát
            return {
                distance: properties.summary.distance * 1000, // převod na metry
                duration: properties.summary.duration, // v sekundách
                geometry: route.geometry,
                legs: segments.map(segment => ({
                    distance: segment.distance * 1000, // převod na metry
                    duration: segment.duration, // v sekundách
                    steps: segment.steps.map(step => ({
                        distance: step.distance * 1000, // převod na metry
                        duration: step.duration, // v sekundách
                        instruction: step.instruction,
                        name: step.name,
                        type: step.type,
                        way_points: step.way_points
                    }))
                })),
                summary: `${properties.summary.distance.toFixed(1)} km, ${Math.round(properties.summary.duration / 60)} min`
            };
        } catch (error) {
            console.error('Chyba při získávání trasy:', error);
            throw error;
        }
    },
    
    // Získání informací o místě
    getPlaceInfo: async function(coordinates) {
        try {
            // Použijeme Nominatim API, protože OpenRouteService nemá vlastní reverse geocoding API
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
    
    // Získání nadmořské výšky pro bod
    getElevation: async function(coordinates) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro OpenRouteService není nastaven');
            }
            
            const response = await fetch('https://api.openrouteservice.org/elevation/point', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiKey
                },
                body: JSON.stringify({
                    format_in: 'point',
                    format_out: 'point',
                    geometry: [coordinates[1], coordinates[0]]
                })
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání nadmořské výšky: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.geometry || !data.geometry.coordinates) {
                throw new Error('Nadmořská výška nenalezena');
            }
            
            return {
                elevation: data.geometry.coordinates[2],
                coordinates: [data.geometry.coordinates[1], data.geometry.coordinates[0]]
            };
        } catch (error) {
            console.error('Chyba při získávání nadmořské výšky:', error);
            throw error;
        }
    },
    
    // Získání isochrony (oblasti dosažitelné v určitém čase)
    getIsochrones: async function(coordinates, options = {}) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro OpenRouteService není nastaven');
            }
            
            // Nastavení profilu
            const profile = options.profile || 'driving-car';
            
            // Mapování profilů na OpenRouteService profily
            const profileMap = {
                'car': 'driving-car',
                'foot': 'foot-walking',
                'bike': 'cycling-regular',
                'driving': 'driving-car',
                'walking': 'foot-walking',
                'cycling': 'cycling-regular',
                'hiking': 'foot-hiking',
                'wheelchair': 'wheelchair'
            };
            
            const mappedProfile = profileMap[profile] || profile;
            
            // Nastavení rozsahu
            const range = options.range || [300, 600, 900]; // v sekundách
            const rangeType = options.rangeType || 'time'; // 'time' nebo 'distance'
            
            // Vytvoření těla požadavku
            const body = {
                locations: [[coordinates[1], coordinates[0]]],
                range: range,
                range_type: rangeType,
                attributes: ['area', 'reachfactor', 'total_pop'],
                intersections: false,
                units: options.units || 'km',
                location_type: 'start',
                area_units: 'km2'
            };
            
            // Přidání dalších možností
            if (options.avoid) {
                body.options = {
                    avoid_features: options.avoid
                };
            }
            
            const response = await fetch(`https://api.openrouteservice.org/v2/isochrones/${mappedProfile}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiKey
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání isochrony: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.features || data.features.length === 0) {
                throw new Error('Isochrona nenalezena');
            }
            
            return data.features.map(feature => ({
                geometry: feature.geometry,
                properties: feature.properties,
                range: feature.properties.value,
                rangeType: rangeType,
                area: feature.properties.area,
                population: feature.properties.total_pop
            }));
        } catch (error) {
            console.error('Chyba při získávání isochrony:', error);
            throw error;
        }
    },
    
    // Získání matice vzdáleností a časů mezi více body
    getMatrix: async function(locations, options = {}) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro OpenRouteService není nastaven');
            }
            
            // Nastavení profilu
            const profile = options.profile || 'driving-car';
            
            // Mapování profilů na OpenRouteService profily
            const profileMap = {
                'car': 'driving-car',
                'foot': 'foot-walking',
                'bike': 'cycling-regular',
                'driving': 'driving-car',
                'walking': 'foot-walking',
                'cycling': 'cycling-regular',
                'hiking': 'foot-hiking',
                'wheelchair': 'wheelchair'
            };
            
            const mappedProfile = profileMap[profile] || profile;
            
            // Převod souřadnic na formát OpenRouteService
            const coordinates = locations.map(location => [location[1], location[0]]);
            
            // Vytvoření těla požadavku
            const body = {
                locations: coordinates,
                metrics: options.metrics || ['distance', 'duration'],
                units: options.units || 'km'
            };
            
            // Přidání dalších možností
            if (options.sources) {
                body.sources = options.sources;
            }
            
            if (options.destinations) {
                body.destinations = options.destinations;
            }
            
            const response = await fetch(`https://api.openrouteservice.org/v2/matrix/${mappedProfile}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiKey
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při získávání matice: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.durations || !data.distances) {
                throw new Error('Matice nenalezena');
            }
            
            return {
                durations: data.durations, // v sekundách
                distances: data.distances.map(row => row.map(distance => distance * 1000)), // převod na metry
                sources: data.sources,
                destinations: data.destinations
            };
        } catch (error) {
            console.error('Chyba při získávání matice:', error);
            throw error;
        }
    },
    
    // Optimalizace trasy (problém obchodního cestujícího)
    optimizeRoute: async function(locations, options = {}) {
        try {
            if (!this.apiKey) {
                throw new Error('API klíč pro OpenRouteService není nastaven');
            }
            
            // Nastavení profilu
            const profile = options.profile || 'driving-car';
            
            // Mapování profilů na OpenRouteService profily
            const profileMap = {
                'car': 'driving-car',
                'foot': 'foot-walking',
                'bike': 'cycling-regular',
                'driving': 'driving-car',
                'walking': 'foot-walking',
                'cycling': 'cycling-regular',
                'hiking': 'foot-hiking',
                'wheelchair': 'wheelchair'
            };
            
            const mappedProfile = profileMap[profile] || profile;
            
            // Převod souřadnic na formát OpenRouteService
            const coordinates = locations.map(location => [location[1], location[0]]);
            
            // Vytvoření těla požadavku
            const body = {
                coordinates: coordinates,
                geometry: true,
                instructions: options.instructions !== false,
                elevation: options.elevation === true,
                geometry_format: 'geojson',
                format: 'json',
                units: options.units || 'km',
                language: options.language || 'cs'
            };
            
            // Přidání dalších možností
            if (options.avoid) {
                body.options = {
                    avoid_features: options.avoid
                };
            }
            
            const response = await fetch(`https://api.openrouteservice.org/v2/optimization`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiKey
                },
                body: JSON.stringify(body)
            });
            
            if (!response.ok) {
                throw new Error(`Chyba při optimalizaci trasy: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.routes || data.routes.length === 0) {
                throw new Error('Optimalizovaná trasa nenalezena');
            }
            
            const route = data.routes[0];
            
            return {
                distance: route.summary.distance * 1000, // převod na metry
                duration: route.summary.duration, // v sekundách
                geometry: route.geometry,
                waypoints: data.waypoints.map(waypoint => ({
                    location: [waypoint.location[1], waypoint.location[0]],
                    name: waypoint.name,
                    originalIndex: waypoint.waypoint_index
                })),
                legs: route.legs.map(leg => ({
                    distance: leg.distance * 1000, // převod na metry
                    duration: leg.duration, // v sekundách
                    steps: leg.steps.map(step => ({
                        distance: step.distance * 1000, // převod na metry
                        duration: step.duration, // v sekundách
                        instruction: step.instruction,
                        name: step.name,
                        type: step.type,
                        way_points: step.way_points
                    }))
                })),
                summary: `${route.summary.distance.toFixed(1)} km, ${Math.round(route.summary.duration / 60)} min`
            };
        } catch (error) {
            console.error('Chyba při optimalizaci trasy:', error);
            throw error;
        }
    }
};

// Export poskytovatele
window.OpenRouteServiceProvider = OpenRouteServiceProvider;
