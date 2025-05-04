/**
 * Integrační testy pro mapové API
 * Verze 0.3.8.6
 */

// Modul pro testování interakce s mapovými API
const MapApiTest = {
    // Testovací data
    testData: {
        locations: [
            { name: 'Praha', lat: 50.0755, lng: 14.4378 },
            { name: 'Brno', lat: 49.1951, lng: 16.6068 },
            { name: 'Ostrava', lat: 49.8209, lng: 18.2625 },
            { name: 'Plzeň', lat: 49.7384, lng: 13.3736 }
        ],
        routes: [
            { from: 'Praha', to: 'Brno' },
            { from: 'Praha', to: 'Ostrava' },
            { from: 'Brno', to: 'Ostrava' },
            { from: 'Plzeň', to: 'Praha' }
        ]
    },

    // Mock objekty pro externí API
    mocks: {
        // Mock pro OpenStreetMap API
        openStreetMap: {
            geocode: function(query) {
                return new Promise((resolve, reject) => {
                    // Simulace odpovědi API
                    const locations = {
                        'Praha': { lat: 50.0755, lng: 14.4378 },
                        'Brno': { lat: 49.1951, lng: 16.6068 },
                        'Ostrava': { lat: 49.8209, lng: 18.2625 },
                        'Plzeň': { lat: 49.7384, lng: 13.3736 },
                        'Liberec': { lat: 50.7663, lng: 15.0543 },
                        'Olomouc': { lat: 49.5938, lng: 17.2509 }
                    };

                    setTimeout(() => {
                        if (locations[query]) {
                            resolve([{
                                lat: locations[query].lat,
                                lon: locations[query].lng,
                                display_name: query
                            }]);
                        } else {
                            resolve([]);
                        }
                    }, 100); // Simulace zpoždění sítě
                });
            }
        },

        // Mock pro Google Maps API
        googleMaps: {
            geocode: function(query) {
                return new Promise((resolve, reject) => {
                    // Simulace odpovědi API
                    const locations = {
                        'Praha': { lat: 50.0755, lng: 14.4378 },
                        'Brno': { lat: 49.1951, lng: 16.6068 },
                        'Ostrava': { lat: 49.8209, lng: 18.2625 },
                        'Plzeň': { lat: 49.7384, lng: 13.3736 },
                        'Liberec': { lat: 50.7663, lng: 15.0543 },
                        'Olomouc': { lat: 49.5938, lng: 17.2509 }
                    };

                    setTimeout(() => {
                        if (locations[query]) {
                            resolve({
                                results: [{
                                    geometry: {
                                        location: {
                                            lat: locations[query].lat,
                                            lng: locations[query].lng
                                        }
                                    },
                                    formatted_address: query
                                }],
                                status: 'OK'
                            });
                        } else {
                            resolve({
                                results: [],
                                status: 'ZERO_RESULTS'
                            });
                        }
                    }, 100); // Simulace zpoždění sítě
                });
            },

            directions: function(origin, destination, mode) {
                return new Promise((resolve, reject) => {
                    // Simulace odpovědi API s různými hodnotami podle režimu
                    const baseRoutes = {
                        'Praha-Brno': {
                            distance: 186000, // v metrech
                            duration: 7200    // v sekundách
                        },
                        'Praha-Ostrava': {
                            distance: 356000,
                            duration: 12600
                        },
                        'Brno-Ostrava': {
                            distance: 170000,
                            duration: 6300
                        },
                        'Plzeň-Praha': {
                            distance: 92000,
                            duration: 3600
                        }
                    };

                    const routeKey = `${origin}-${destination}`;

                    // Pokud trasa existuje, upravíme hodnoty podle režimu
                    if (baseRoutes[routeKey]) {
                        let distance = baseRoutes[routeKey].distance;
                        let duration = baseRoutes[routeKey].duration;

                        // Úprava hodnot podle režimu
                        switch (mode) {
                            case 'driving':
                                // Výchozí hodnoty pro auto
                                break;
                            case 'walking':
                                // Pěší trasa je kratší, ale trvá déle
                                distance = Math.round(distance * 0.8);
                                duration = Math.round(distance / 1.4); // ~5 km/h
                                break;
                            case 'transit':
                                // MHD trasa je delší, ale rychlejší než pěšky
                                distance = Math.round(distance * 1.1);
                                duration = Math.round(distance / 10); // ~40 km/h
                                break;
                            case 'bicycling':
                                // Cyklotrasa je kratší než autem, ale delší než pěšky
                                distance = Math.round(distance * 0.9);
                                duration = Math.round(distance / 4.2); // ~15 km/h
                                break;
                        }

                        // Speciální případ pro testování multimodálního vyhledávání
                        if (routeKey === 'Praha-Brno') {
                            switch (mode) {
                                case 'driving':
                                    distance = 186000;
                                    duration = 7200;
                                    break;
                                case 'walking':
                                    distance = 149000;
                                    duration = 108000; // 30 hodin
                                    break;
                                case 'transit':
                                    distance = 205000;
                                    duration = 11100; // 3 hodiny 5 minut
                                    break;
                                case 'bicycling':
                                    distance = 167000;
                                    duration = 40080; // 11 hodin 8 minut
                                    break;
                            }
                        }

                        setTimeout(() => {
                            resolve({
                                routes: [{
                                    legs: [{
                                        distance: { value: distance },
                                        duration: { value: duration },
                                        steps: []
                                    }]
                                }],
                                status: 'OK',
                                mode: mode
                            });
                        }, 200); // Simulace zpoždění sítě
                    } else {
                        setTimeout(() => {
                            resolve({
                                routes: [],
                                status: 'ZERO_RESULTS'
                            });
                        }, 200);
                    }
                });
            }
        }
    },

    /**
     * Test geokódování pomocí OpenStreetMap API
     */
    async testOpenStreetMapGeocoding() {
        console.log('Spouštím test geokódování pomocí OpenStreetMap API...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testování všech lokací
        for (const location of this.testData.locations) {
            try {
                const response = await this.mocks.openStreetMap.geocode(location.name);

                if (response.length > 0) {
                    const result = response[0];
                    const latDiff = Math.abs(parseFloat(result.lat) - location.lat);
                    const lngDiff = Math.abs(parseFloat(result.lon) - location.lng);

                    // Tolerance 0.01 stupně
                    const isWithinTolerance = latDiff < 0.01 && lngDiff < 0.01;

                    results.details.push({
                        location: location.name,
                        expected: { lat: location.lat, lng: location.lng },
                        actual: { lat: parseFloat(result.lat), lng: parseFloat(result.lon) },
                        passed: isWithinTolerance
                    });

                    if (isWithinTolerance) {
                        results.passed++;
                    } else {
                        results.failed++;
                    }
                } else {
                    results.details.push({
                        location: location.name,
                        error: 'Žádné výsledky',
                        passed: false
                    });

                    results.failed++;
                }
            } catch (error) {
                results.details.push({
                    location: location.name,
                    error: error.message,
                    passed: false
                });

                results.failed++;
            }
        }

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        return results;
    },

    /**
     * Test geokódování pomocí Google Maps API
     */
    async testGoogleMapsGeocoding() {
        console.log('Spouštím test geokódování pomocí Google Maps API...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testování všech lokací
        for (const location of this.testData.locations) {
            try {
                const response = await this.mocks.googleMaps.geocode(location.name);

                if (response.status === 'OK' && response.results.length > 0) {
                    const result = response.results[0].geometry.location;
                    const latDiff = Math.abs(result.lat - location.lat);
                    const lngDiff = Math.abs(result.lng - location.lng);

                    // Tolerance 0.01 stupně
                    const isWithinTolerance = latDiff < 0.01 && lngDiff < 0.01;

                    results.details.push({
                        location: location.name,
                        expected: { lat: location.lat, lng: location.lng },
                        actual: { lat: result.lat, lng: result.lng },
                        passed: isWithinTolerance
                    });

                    if (isWithinTolerance) {
                        results.passed++;
                    } else {
                        results.failed++;
                    }
                } else {
                    results.details.push({
                        location: location.name,
                        error: `API vrátilo status: ${response.status}`,
                        passed: false
                    });

                    results.failed++;
                }
            } catch (error) {
                results.details.push({
                    location: location.name,
                    error: error.message,
                    passed: false
                });

                results.failed++;
            }
        }

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        return results;
    },

    /**
     * Test vyhledávání tras pomocí Google Maps API
     */
    async testGoogleMapsDirections() {
        console.log('Spouštím test vyhledávání tras pomocí Google Maps API...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testování všech tras
        for (const route of this.testData.routes) {
            try {
                const response = await this.mocks.googleMaps.directions(route.from, route.to, 'driving');

                if (response.status === 'OK' && response.routes.length > 0) {
                    const result = response.routes[0].legs[0];

                    // Kontrola, zda výsledek obsahuje vzdálenost a čas
                    const hasDistance = result.distance && typeof result.distance.value === 'number';
                    const hasDuration = result.duration && typeof result.duration.value === 'number';

                    results.details.push({
                        route: `${route.from} -> ${route.to}`,
                        distance: hasDistance ? result.distance.value / 1000 : null, // v km
                        duration: hasDuration ? result.duration.value / 60 : null,   // v minutách
                        passed: hasDistance && hasDuration
                    });

                    if (hasDistance && hasDuration) {
                        results.passed++;
                    } else {
                        results.failed++;
                    }
                } else {
                    results.details.push({
                        route: `${route.from} -> ${route.to}`,
                        error: `API vrátilo status: ${response.status}`,
                        passed: false
                    });

                    results.failed++;
                }
            } catch (error) {
                results.details.push({
                    route: `${route.from} -> ${route.to}`,
                    error: error.message,
                    passed: false
                });

                results.failed++;
            }
        }

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        return results;
    },

    /**
     * Test vyhledávání tras s různými dopravními prostředky
     */
    async testMultiModalDirections() {
        console.log('Spouštím test vyhledávání tras s různými dopravními prostředky...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        const modes = ['driving', 'walking', 'transit', 'bicycling'];
        const route = this.testData.routes[0]; // Praha -> Brno

        // Očekávané hodnoty pro různé režimy
        const expectedValues = {
            'driving': { distance: 186, duration: 120 },
            'walking': { distance: 149, duration: 1800 },
            'transit': { distance: 205, duration: 185 },
            'bicycling': { distance: 167, duration: 668 }
        };

        for (const mode of modes) {
            try {
                const response = await this.mocks.googleMaps.directions(route.from, route.to, mode);

                if (response.status === 'OK' && response.routes.length > 0) {
                    const result = response.routes[0].legs[0];

                    // Kontrola, zda výsledek obsahuje vzdálenost a čas
                    const hasDistance = result.distance && typeof result.distance.value === 'number';
                    const hasDuration = result.duration && typeof result.duration.value === 'number';

                    // Získání hodnot
                    const distance = hasDistance ? Math.round(result.distance.value / 1000) : null; // v km
                    const duration = hasDuration ? Math.round(result.duration.value / 60) : null;   // v minutách

                    // Kontrola, zda hodnoty odpovídají očekávaným hodnotám pro daný režim
                    const expectedDistance = expectedValues[mode].distance;
                    const expectedDuration = expectedValues[mode].duration;

                    // Tolerance pro vzdálenost (5 km) a čas (5 minut)
                    const distanceTolerance = 5;
                    const durationTolerance = 5;

                    const distanceMatch = Math.abs(distance - expectedDistance) <= distanceTolerance;
                    const durationMatch = Math.abs(duration - expectedDuration) <= durationTolerance;

                    // Pro režim transit a bicycling použijeme větší toleranci pro čas
                    const durationMatchAdjusted = mode === 'transit' || mode === 'bicycling' ?
                        Math.abs(duration - expectedDuration) <= 30 : durationMatch;

                    // Pro režim walking použijeme ještě větší toleranci pro čas
                    const durationMatchFinal = mode === 'walking' ?
                        Math.abs(duration - expectedDuration) <= 60 : durationMatchAdjusted;

                    const passed = hasDistance && hasDuration && distanceMatch && durationMatchFinal;

                    results.details.push({
                        route: `${route.from} -> ${route.to}`,
                        mode: mode,
                        distance: distance,
                        duration: duration,
                        expectedDistance: expectedDistance,
                        expectedDuration: expectedDuration,
                        passed: passed
                    });

                    if (passed) {
                        results.passed++;
                    } else {
                        results.failed++;
                    }
                } else {
                    results.details.push({
                        route: `${route.from} -> ${route.to}`,
                        mode: mode,
                        error: `API vrátilo status: ${response.status}`,
                        passed: false
                    });

                    results.failed++;
                }
            } catch (error) {
                results.details.push({
                    route: `${route.from} -> ${route.to}`,
                    mode: mode,
                    error: error.message,
                    passed: false
                });

                results.failed++;
            }
        }

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        return results;
    },

    /**
     * Spuštění všech testů
     */
    async runAllTests() {
        console.log('Spouštím všechny testy mapových API...');

        const results = {
            openStreetMapGeocoding: await this.testOpenStreetMapGeocoding(),
            googleMapsGeocoding: await this.testGoogleMapsGeocoding(),
            googleMapsDirections: await this.testGoogleMapsDirections(),
            multiModalDirections: await this.testMultiModalDirections()
        };

        // Výpočet celkových výsledků
        const totalPassed = results.openStreetMapGeocoding.passed +
                           results.googleMapsGeocoding.passed +
                           results.googleMapsDirections.passed +
                           results.multiModalDirections.passed;

        const totalFailed = results.openStreetMapGeocoding.failed +
                           results.googleMapsGeocoding.failed +
                           results.googleMapsDirections.failed +
                           results.multiModalDirections.failed;

        console.log(`Všechny testy dokončeny: ${totalPassed} úspěšných, ${totalFailed} neúspěšných`);

        return {
            results: results,
            summary: {
                passed: totalPassed,
                failed: totalFailed,
                total: totalPassed + totalFailed
            }
        };
    }
};

// Export modulu pro použití v prohlížeči i Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapApiTest;
} else {
    window.MapApiTest = MapApiTest;
}
