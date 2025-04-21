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
            console.error('Globe.gl knihovna není dostupná');
            return false;
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

        // Vytvoření tras mezi body
        globeRoutes = [];

        // Rozdělení trasy na segmenty pro lepší vizualizaci
        for (let i = 0; i < routeCoordinates.length - 1; i++) {
            const startPos = routeCoordinates[i];
            const endPos = routeCoordinates[i + 1];

            globeRoutes.push({
                startLat: startPos.lat,
                startLng: startPos.lng,
                endLat: endPos.lat,
                endLng: endPos.lng,
                color: '#FF5733', // Odlišná barva pro trasu
                stroke: 0.8 // Silnější čára pro trasu
            });
        }

        // Přidání tras na Globe.gl
        globeInstance
            .arcsData([...globeArcs, ...globeRoutes])
            .arcColor('color')
            .arcStroke('stroke')
            .arcDashLength(0.4)
            .arcDashGap(0.2)
            .arcDashAnimateTime(1000);

        console.log(`Přidáno ${globeRoutes.length} segmentů trasy na Globe.gl`);
    } catch (error) {
        console.error('Chyba při přidávání trasy na Globe.gl:', error);
    }
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
