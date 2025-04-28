// Jednoduchá implementace Globe.gl pro AIMapa
// Globální proměnné
let globeContainer = null;
let globeInstance = null;
let globePoints = [];
let globeArcs = [];
let globeRoutes = [];

// Funkce pro inicializaci Globe.gl
function initSimpleGlobe() {
    console.log('Inicializace Globe.gl - začátek');

    try {
        // Kontrola, zda je Globe.gl dostupný
        if (typeof Globe === 'undefined') {
            console.log('Kontrola dostupnosti Globe.gl knihovny...');

            // Pokud není Globe dostupný, zkontrolujeme, zda je dostupný globeGL
            if (typeof window.globe === 'undefined' && typeof window.globeGL === 'undefined') {
                console.error('Globe.gl knihovna není dostupná');
                return false;
            }

            // Pokud je dostupný globeGL, použijeme ho
            if (typeof window.globeGL !== 'undefined') {
                console.log('Použití globeGL místo Globe');
                window.Globe = window.globeGL;
            } else if (typeof window.globe !== 'undefined') {
                console.log('Použití globe místo Globe');
                window.Globe = window.globe;
            }
        }

        // Vytvoření kontejneru pro Globe.gl
        globeContainer = document.getElementById('simpleGlobeContainer');
        if (!globeContainer) {
            console.log('Vytváření kontejneru pro Globe.gl');
            globeContainer = document.createElement('div');
            globeContainer.id = 'simpleGlobeContainer';
            globeContainer.style.width = '100%';
            globeContainer.style.height = '100%';
            globeContainer.style.position = 'absolute';
            globeContainer.style.top = '0';
            globeContainer.style.left = '0';
            globeContainer.style.zIndex = '1000';
            globeContainer.style.display = 'none'; // Skrytí kontejneru při inicializaci

            // Přidání kontejneru do DOM
            document.getElementById('map').appendChild(globeContainer);
        }

        // Vytvoření instance Globe.gl
        console.log('Vytváření instance Globe.gl');
        globeInstance = Globe()
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight)
            .pointOfView({ lat: 49.8, lng: 15.5, altitude: 2.5 }) // Výchozí pohled na ČR
            .showGraticules(true)
            .showAtmosphere(true);

        // Přidání Globe.gl do kontejneru
        globeInstance(globeContainer);

        console.log('Globe.gl inicializován úspěšně');
        return true;
    } catch (error) {
        console.error('Chyba při inicializaci Globe.gl:', error);
        return false;
    }
}

// Funkce pro přidání bodů na Globe.gl
function addPointsToSimpleGlobe(markers) {
    if (!globeInstance || !markers || markers.length === 0) return;

    try {
        console.log('Přidávání bodů na Globe.gl');

        // Převod bodů z Leaflet formátu na formát pro Globe.gl
        globePoints = markers.map((marker, index) => {
            const position = marker.getLatLng();
            let name = `Bod ${index + 1}`;

            // Pokud existují vlastnosti markeru, použijeme je
            if (typeof markerProperties !== 'undefined' && markerProperties[index]) {
                name = markerProperties[index].name || name;
            }

            return {
                lat: position.lat,
                lng: position.lng,
                name: name,
                color: '#8B5CF6',
                size: 0.5,
                altitude: 0.01,
                id: index
            };
        });

        // Přidání bodů na Globe.gl
        globeInstance
            .pointsData(globePoints)
            .pointLabel('name')
            .pointColor('color')
            .pointAltitude('altitude')
            .pointRadius('size')
            .onPointClick(point => {
                // Animace přiblížení na bod
                globeInstance.pointOfView({
                    lat: point.lat,
                    lng: point.lng,
                    altitude: 1.5
                }, 1000);
            });

        console.log(`Přidáno ${globePoints.length} bodů na Globe.gl`);
    } catch (error) {
        console.error('Chyba při přidávání bodů na Globe.gl:', error);
    }
}

// Funkce pro přidání tras mezi body na Globe.gl
function addArcsToSimpleGlobe(markers) {
    if (!globeInstance || !markers || markers.length < 2) return;

    try {
        console.log('Přidávání tras na Globe.gl');

        // Vytvoření tras mezi body
        globeArcs = [];
        for (let i = 0; i < markers.length - 1; i++) {
            const startPos = markers[i].getLatLng();
            const endPos = markers[i + 1].getLatLng();

            globeArcs.push({
                startLat: startPos.lat,
                startLng: startPos.lng,
                endLat: endPos.lat,
                endLng: endPos.lng,
                color: '#8B5CF6',
                stroke: 0.5
            });
        }

        // Přidání tras na Globe.gl
        globeInstance
            .arcsData(globeArcs)
            .arcColor('color')
            .arcStroke('stroke')
            .arcDashLength(0.4)
            .arcDashGap(0.2)
            .arcDashAnimateTime(1000);

        console.log(`Přidáno ${globeArcs.length} tras na Globe.gl`);
    } catch (error) {
        console.error('Chyba při přidávání tras na Globe.gl:', error);
    }
}

// Funkce pro přidání trasy z klasické mapy na Globe.gl
function addRouteToGlobe(routeLayer) {
    if (!globeInstance || !routeLayer) return;

    try {
        console.log('Přidávání trasy z klasické mapy na Globe.gl');

        // Získání souřadnic trasy z Leaflet polyline
        let routeCoordinates = [];

        // Kontrola typu trasy (přímá trasa nebo trasa z Leaflet Routing Machine)
        if (routeLayer instanceof L.Polyline) {
            // Přímá trasa (polyline)
            routeCoordinates = routeLayer.getLatLngs();
        } else if (routeLayer._routes && routeLayer._routes.length > 0) {
            // Trasa z Leaflet Routing Machine
            routeCoordinates = routeLayer._routes[0].coordinates;
        } else {
            console.error('Nepodporovaný typ trasy');
            return;
        }

        console.log(`Získáno ${routeCoordinates.length} bodů trasy`);

        // Optimalizace pro dlouhé trasy - omezení počtu bodů
        const MAX_ROUTE_POINTS = 100; // Maximální počet bodů pro optimalizaci
        let optimizedCoordinates = routeCoordinates;

        if (routeCoordinates.length > MAX_ROUTE_POINTS) {
            console.log(`Trasa je příliš dlouhá (${routeCoordinates.length} bodů), probíhá optimalizace...`);

            // Vzorkování bodů pro dlouhé trasy
            optimizedCoordinates = sampleRoutePoints(routeCoordinates, MAX_ROUTE_POINTS);
            console.log(`Trasa byla optimalizována na ${optimizedCoordinates.length} bodů`);
        }

        // Vytvoření tras mezi body
        globeRoutes = [];

        // Kontrola, zda trasa nepřekračuje 180. poledník (problém s dlouhými trasami)
        const crossesDateLine = checkIfCrossesDateLine(optimizedCoordinates);

        // Rozdělení trasy na segmenty pro lepší vizualizaci
        for (let i = 0; i < optimizedCoordinates.length - 1; i++) {
            const startPos = optimizedCoordinates[i];
            const endPos = optimizedCoordinates[i + 1];

            // Kontrola vzdálenosti mezi body - příliš vzdálené body mohou způsobit problémy
            const distance = calculateDistance(startPos.lat, startPos.lng, endPos.lat, endPos.lng);

            // Pokud je vzdálenost příliš velká, rozdělíme segment na menší části
            if (distance > 2000) { // 2000 km jako hranice pro rozdělení
                const segments = splitLongSegment(startPos, endPos);
                segments.forEach(segment => {
                    globeRoutes.push({
                        startLat: segment.startLat,
                        startLng: segment.startLng,
                        endLat: segment.endLat,
                        endLng: segment.endLng,
                        color: '#FF5733', // Odlišná barva pro trasu
                        stroke: 0.8 // Silnější čára pro trasu
                    });
                });
            } else {
                // Standardní přidání segmentu
                globeRoutes.push({
                    startLat: startPos.lat,
                    startLng: startPos.lng,
                    endLat: endPos.lat,
                    endLng: endPos.lng,
                    color: '#FF5733', // Odlišná barva pro trasu
                    stroke: 0.8 // Silnější čára pro trasu
                });
            }
        }

        // Pokud trasa překračuje 180. poledník, rozdělíme ji na dvě části
        if (crossesDateLine) {
            console.log('Trasa překračuje 180. poledník, probíhá speciální zpracování...');
            globeRoutes = handleDateLineCrossing(globeRoutes);
        }

        // Postupné přidávání tras na Globe.gl pro lepší výkon
        const BATCH_SIZE = 50; // Počet segmentů v jedné dávce

        if (globeRoutes.length > BATCH_SIZE) {
            console.log(`Trasa obsahuje ${globeRoutes.length} segmentů, probíhá postupné přidávání...`);

            // Nejprve přidáme jen část trasy pro rychlejší odezvu
            const initialBatch = globeRoutes.slice(0, BATCH_SIZE);
            globeInstance
                .arcsData([...globeArcs, ...initialBatch])
                .arcColor('color')
                .arcStroke('stroke')
                .arcDashLength(0.4)
                .arcDashGap(0.2)
                .arcDashAnimateTime(1000);

            // Postupné přidávání zbývajících segmentů
            setTimeout(() => {
                addRemainingSegments(BATCH_SIZE);
            }, 500);
        } else {
            // Přidání všech tras najednou pro kratší trasy
            globeInstance
                .arcsData([...globeArcs, ...globeRoutes])
                .arcColor('color')
                .arcStroke('stroke')
                .arcDashLength(0.4)
                .arcDashGap(0.2)
                .arcDashAnimateTime(1000);
        }

        console.log(`Přidáno ${globeRoutes.length} segmentů trasy na Globe.gl`);
    } catch (error) {
        console.error('Chyba při přidávání trasy na Globe.gl:', error);
    }
}

// Funkce pro postupné přidávání zbývajících segmentů trasy
function addRemainingSegments(startIndex) {
    const BATCH_SIZE = 50;
    const nextBatch = globeRoutes.slice(startIndex, startIndex + BATCH_SIZE);

    if (nextBatch.length === 0) {
        console.log('Všechny segmenty trasy byly přidány');
        return;
    }

    // Přidání další dávky segmentů
    const currentArcs = globeInstance.arcsData();
    globeInstance.arcsData([...currentArcs, ...nextBatch]);

    console.log(`Přidána dávka segmentů ${startIndex} až ${startIndex + nextBatch.length}`);

    // Pokračování s další dávkou
    if (startIndex + BATCH_SIZE < globeRoutes.length) {
        setTimeout(() => {
            addRemainingSegments(startIndex + BATCH_SIZE);
        }, 300);
    }
}

// Funkce pro vzorkování bodů trasy (redukce počtu bodů)
function sampleRoutePoints(points, maxPoints) {
    if (points.length <= maxPoints) return points;

    const result = [];

    // Vždy zachováme první a poslední bod
    result.push(points[0]);

    // Vzorkování středních bodů
    const step = Math.max(1, Math.floor(points.length / (maxPoints - 2)));
    for (let i = step; i < points.length - 1; i += step) {
        result.push(points[i]);
    }

    // Přidání posledního bodu
    result.push(points[points.length - 1]);

    return result;
}

// Funkce pro výpočet vzdálenosti mezi dvěma body (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Poloměr Země v km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Vzdálenost v km
}

// Funkce pro rozdělení dlouhého segmentu na menší části
function splitLongSegment(startPos, endPos) {
    const segments = [];
    const numSegments = 5; // Počet segmentů, na které rozdělíme dlouhý segment

    for (let i = 0; i < numSegments; i++) {
        const ratio = i / numSegments;
        const nextRatio = (i + 1) / numSegments;

        // Interpolace mezi počátečním a koncovým bodem
        const startLat = startPos.lat + ratio * (endPos.lat - startPos.lat);
        const startLng = startPos.lng + ratio * (endPos.lng - startPos.lng);
        const endLat = startPos.lat + nextRatio * (endPos.lat - startPos.lat);
        const endLng = startPos.lng + nextRatio * (endPos.lng - startPos.lng);

        segments.push({
            startLat: startLat,
            startLng: startLng,
            endLat: endLat,
            endLng: endLng
        });
    }

    return segments;
}

// Funkce pro kontrolu, zda trasa překračuje 180. poledník
function checkIfCrossesDateLine(coordinates) {
    for (let i = 0; i < coordinates.length - 1; i++) {
        const lon1 = coordinates[i].lng;
        const lon2 = coordinates[i + 1].lng;

        // Pokud rozdíl zeměpisných délek je větší než 180 stupňů, trasa pravděpodobně překračuje 180. poledník
        if (Math.abs(lon2 - lon1) > 180) {
            return true;
        }
    }
    return false;
}

// Funkce pro zpracování trasy překračující 180. poledník
function handleDateLineCrossing(routes) {
    const processedRoutes = [];

    routes.forEach(route => {
        // Kontrola, zda segment překračuje 180. poledník
        if (Math.abs(route.endLng - route.startLng) > 180) {
            // Rozdělení segmentu na dva - jeden končí na 180° a druhý začíná na -180°
            const midLat = (route.startLat + route.endLat) / 2;

            // První část segmentu (k 180. poledníku)
            if (route.startLng < 0 && route.endLng > 0) {
                processedRoutes.push({
                    startLat: route.startLat,
                    startLng: route.startLng,
                    endLat: midLat,
                    endLng: 180,
                    color: route.color,
                    stroke: route.stroke
                });

                processedRoutes.push({
                    startLat: midLat,
                    startLng: -180,
                    endLat: route.endLat,
                    endLng: route.endLng,
                    color: route.color,
                    stroke: route.stroke
                });
            } else {
                processedRoutes.push({
                    startLat: route.startLat,
                    startLng: route.startLng,
                    endLat: midLat,
                    endLng: -180,
                    color: route.color,
                    stroke: route.stroke
                });

                processedRoutes.push({
                    startLat: midLat,
                    startLng: 180,
                    endLat: route.endLat,
                    endLng: route.endLng,
                    color: route.color,
                    stroke: route.stroke
                });
            }
        } else {
            // Segment nepřekračuje 180. poledník, přidáme ho beze změny
            processedRoutes.push(route);
        }
    });

    return processedRoutes;
}

// Funkce pro vyčištění Globe.gl
function clearSimpleGlobe() {
    if (!globeInstance) return;

    try {
        console.log('Čištění Globe.gl');

        // Odstranění všech dat
        globeInstance
            .pointsData([])
            .arcsData([]);

        globePoints = [];
        globeArcs = [];
        globeRoutes = [];

        console.log('Globe.gl byl vyčištěn');
    } catch (error) {
        console.error('Chyba při čištění Globe.gl:', error);
    }
}

// Funkce pro aktualizaci velikosti Globe.gl
function resizeGlobe() {
    if (!globeInstance || !globeContainer) {
        console.error('Nelze aktualizovat velikost Globe.gl - chybí instance nebo kontejner');
        return false;
    }

    try {
        console.log('Aktualizace velikosti Globe.gl');

        // Aktualizace velikosti Globe.gl
        globeInstance
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight);

        console.log('Velikost Globe.gl byla aktualizována');
        return true;
    } catch (error) {
        console.error('Chyba při aktualizaci velikosti Globe.gl:', error);
        return false;
    }
}

// Export funkcí do globálního prostoru
window.initSimpleGlobe = initSimpleGlobe;
window.addPointsToSimpleGlobe = addPointsToSimpleGlobe;
window.addArcsToSimpleGlobe = addArcsToSimpleGlobe;
window.addRouteToGlobe = addRouteToGlobe;
window.clearSimpleGlobe = clearSimpleGlobe;
window.resizeGlobe = resizeGlobe;

console.log('Globe.gl jednoduchý skript byl načten');
