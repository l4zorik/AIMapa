/**
 * Globe-simple.js - Jednoduchá implementace Globe.gl pro AIMapa verze 0.2.9.1
 * Tento soubor poskytuje základní funkcionalitu pro 3D glóbus
 */

// Globální proměnné pro glóbus
let globeInstance = null;
let globeMarkers = [];
let globeArcs = [];

// Funkce pro inicializaci glóbusu
function initSimpleGlobe() {
    try {
        console.log('Inicializace glóbusu...');

        // Kontrola, zda je Globe.gl dostupný
        if (typeof Globe === 'undefined') {
            console.error('Globe.gl knihovna není dostupná');
            return false;
        }

        // Získání kontejneru pro glóbus
        const globeContainer = document.getElementById('threeGlobeContainer');
        if (!globeContainer) {
            console.error('Kontejner pro glóbus nebyl nalezen');
            return false;
        }

        // Vytvoření instance glóbusu
        console.log('Vytváření nové instance glóbusu');
        globeInstance = Globe()
            .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight)
            .pointOfView({ lat: 49.8, lng: 15.5, altitude: 2.5 }) // Výchozí pohled na ČR
            .showGraticules(true)
            .showAtmosphere(true);

        // Přidání glóbusu do kontejneru
        globeInstance(globeContainer);

        // Přidání bodů na glóbus
        addPointsToGlobe();

        console.log('Glóbus byl úspěšně inicializován');
        return true;
    } catch (error) {
        console.error('Chyba při inicializaci glóbusu:', error);
        return false;
    }
}

// Funkce pro přidání bodů na glóbus
function addPointsToGlobe() {
    // Kontrola, zda je glóbus inicializován
    if (!globeInstance) {
        console.error('Glóbus není inicializován');
        return;
    }

    // Získání bodů z mapy
    const points = [];

    // Pokud existují markery v mapě, přidáme je na glóbus
    if (typeof window.markers !== 'undefined' && window.markers.length > 0) {
        window.markers.forEach((marker, index) => {
            const latlng = marker.getLatLng();
            const name = window.markerProperties[index]?.name || `Bod ${index + 1}`;

            points.push({
                lat: latlng.lat,
                lng: latlng.lng,
                name: name,
                color: getRandomColor(),
                size: 0.5
            });
        });
    } else {
        // Přidání několika výchozích bodů
        points.push(
            { lat: 50.0755, lng: 14.4378, name: 'Praha', color: 'red', size: 0.5 },
            { lat: 49.1951, lng: 16.6068, name: 'Brno', color: 'green', size: 0.5 },
            { lat: 49.8175, lng: 18.2625, name: 'Ostrava', color: 'blue', size: 0.5 }
        );
    }

    // Přidání bodů na glóbus
    globeInstance
        .pointsData(points)
        .pointColor('color')
        .pointAltitude(0.1)
        .pointRadius('size')
        .pointLabel('name');

    // Uložení bodů do globální proměnné
    globeMarkers = points;

    // Přidání tras mezi body, pokud existují alespoň dva body
    if (points.length >= 2) {
        addArcsToGlobe(points);
    }
}

// Funkce pro přidání tras mezi body na glóbus
function addArcsToGlobe(points) {
    // Kontrola, zda je glóbus inicializován
    if (!globeInstance) {
        console.error('Glóbus není inicializován');
        return;
    }

    // Vytvoření tras mezi body
    const arcs = [];

    // Propojení bodů v pořadí, v jakém byly přidány
    for (let i = 0; i < points.length - 1; i++) {
        arcs.push({
            startLat: points[i].lat,
            startLng: points[i].lng,
            endLat: points[i + 1].lat,
            endLng: points[i + 1].lng,
            color: getRandomColor()
        });
    }

    // Přidání tras na glóbus
    globeInstance
        .arcsData(arcs)
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500)
        .arcStroke(0.5);

    // Uložení tras do globální proměnné
    globeArcs = arcs;
}

// Pomocná funkce pro generování náhodné barvy
function getRandomColor() {
    const colors = ['red', 'green', 'blue', 'orange', 'purple', 'yellow', 'cyan', 'magenta'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Funkce pro aktualizaci velikosti glóbusu při změně velikosti okna
window.addEventListener('resize', () => {
    if (globeInstance) {
        const globeContainer = document.getElementById('threeGlobeContainer');
        if (globeContainer) {
            globeInstance
                .width(globeContainer.clientWidth)
                .height(globeContainer.clientHeight);
        }
    }
});

// Export funkcí pro použití v jiných souborech
window.initSimpleGlobe = initSimpleGlobe;
window.addPointsToGlobe = addPointsToGlobe;