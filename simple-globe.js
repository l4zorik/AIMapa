// Jednoduchá implementace glóbus režimu pro AIMapa s využitím Globe.GL

// Globální proměnné
let globeContainer;
let globeInstance;
let globePoints = [];
let globeArcs = [];

// Inicializace glóbusu s využitím Globe.GL
function initSimpleGlobe() {
    console.log('Inicializace glóbusu s Globe.GL - začátek');

    try {
        // Kontrola, zda je Globe.GL dostupný
        if (typeof Globe === 'undefined') {
            console.error('Globe.GL knihovna není dostupná');
            console.log('Dostupné globální objekty:', Object.keys(window));
            return false;
        }
        console.log('Globe.GL knihovna je dostupná:', typeof Globe);

        // Kontrola, zda existuje kontejner
        globeContainer = document.getElementById('simpleGlobeContainer');
        if (!globeContainer) {
            console.warn('Kontejner simpleGlobeContainer nebyl nalezen, vytváříme ho');
            createGlobeContainer();
        }

        // Vytvoření instance Globe.GL
        globeInstance = Globe()
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight)
            .pointOfView({ lat: 49.8, lng: 15.5, altitude: 2.5 }) // Výchozí pohled na ČR
            .showGraticules(true)
            .showAtmosphere(true);

        // Přidání Globe.GL do kontejneru
        globeInstance(globeContainer);

        console.log('Globe.GL glóbus inicializován úspěšně');
        return true;
    } catch (error) {
        console.error('Chyba při inicializaci Globe.GL glóbusu:', error);
        return false;
    }
}

// Vytvoření kontejneru pro glóbus, pokud neexistuje
function createGlobeContainer() {
    globeContainer = document.createElement('div');
    globeContainer.id = 'simpleGlobeContainer';
    globeContainer.className = 'simple-globe-container';

    // Přidání kontejneru do DOM
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.parentNode.appendChild(globeContainer);
        console.log('Vytvořen kontejner pro Globe.GL glóbus');
    } else {
        console.error('Nelze najít mapový kontejner pro přidání Globe.GL glóbusu');
    }
}

// Přidání bodů na glóbus
function addPointsToSimpleGlobe(points) {
    if (!globeInstance || !points || points.length === 0) return;

    try {
        // Převod bodů z Leaflet formátu na formát pro Globe.GL
        globePoints = points.map((marker, index) => {
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

        // Přidání bodů na glóbus
        globeInstance
            .pointsData(globePoints)
            .pointLabel('name')
            .pointColor('color')
            .pointAltitude('altitude')
            .pointRadius('size')
            .onPointClick(point => {
                // Zobrazení informací o bodu při kliknutí
                console.log('Kliknuto na bod:', point);
                // Animace přiblížení na bod
                globeInstance.pointOfView({
                    lat: point.lat,
                    lng: point.lng,
                    altitude: 1.5
                }, 1000);
            });

        console.log(`Přidáno ${globePoints.length} bodů na glóbus`);
    } catch (error) {
        console.error('Chyba při přidávání bodů na glóbus:', error);
    }
}

// Přidání tras mezi body na glóbus
function addArcsToSimpleGlobe(points) {
    if (!globeInstance || !points || points.length < 2) return;

    try {
        // Vytvoření tras mezi body
        globeArcs = [];
        for (let i = 0; i < points.length - 1; i++) {
            const startPos = points[i].getLatLng();
            const endPos = points[i + 1].getLatLng();

            globeArcs.push({
                startLat: startPos.lat,
                startLng: startPos.lng,
                endLat: endPos.lat,
                endLng: endPos.lng,
                color: '#8B5CF6',
                stroke: 0.5
            });
        }

        // Přidání tras na glóbus
        globeInstance
            .arcsData(globeArcs)
            .arcColor('color')
            .arcStroke('stroke')
            .arcDashLength(0.4)
            .arcDashGap(0.2)
            .arcDashAnimateTime(1000);

        console.log(`Přidáno ${globeArcs.length} tras na glóbus`);
    } catch (error) {
        console.error('Chyba při přidávání tras na glóbus:', error);
    }
}

// Vyčištění glóbusu
function clearSimpleGlobe() {
    if (!globeInstance) return;

    try {
        // Odstranění všech dat
        globeInstance
            .pointsData([])
            .arcsData([]);

        globePoints = [];
        globeArcs = [];

        console.log('Glóbus byl vyčištěn');
    } catch (error) {
        console.error('Chyba při čištění glóbusu:', error);
    }
}

// Export funkcí do globálního prostoru
window.initSimpleGlobe = initSimpleGlobe;
window.addPointsToSimpleGlobe = addPointsToSimpleGlobe;
window.addArcsToSimpleGlobe = addArcsToSimpleGlobe;
window.clearSimpleGlobe = clearSimpleGlobe;


