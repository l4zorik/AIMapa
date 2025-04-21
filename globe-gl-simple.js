// Jednoduchá implementace Globe.GL pro AIMapa
// Založeno na knihovně Globe.GL (https://github.com/vasturiano/globe.gl)

// Globální proměnné
let globeGl;
let globeContainer;
let globePoints = [];
let globeArcs = [];

// Inicializace Globe.GL
function initGlobeGL() {
    console.log('Inicializace Globe.GL - začátek');

    try {
        // Kontrola, zda je Globe.GL dostupný
        if (typeof Globe === 'undefined') {
            console.warn('Globe.GL knihovna není načtena, pokusíme se ji načíst dynamicky');
            loadGlobeGLLibrary();
            return false;
        }
        
        // Kontrola, zda existuje kontejner
        globeContainer = document.getElementById('globeGlContainer');
        if (!globeContainer) {
            console.warn('Kontejner globeGlContainer nebyl nalezen, vytváříme ho');
            createGlobeContainer();
        }
        
        // Vytvoření instance Globe.GL
        globeGl = Globe()
            .globeImageUrl('https://unpkg.com/three-globe@2.28.0/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('https://unpkg.com/three-globe@2.28.0/example/img/night-sky.png')
            .width(globeContainer.clientWidth)
            .height(globeContainer.clientHeight)
            .pointOfView({ lat: 49.8, lng: 15.5, altitude: 2.5 }) // Výchozí pohled na ČR
            .onGlobeClick(onGlobeClick);
            
        // Přidání Globe.GL do kontejneru
        globeGl(globeContainer);
        
        console.log('Globe.GL inicializován úspěšně');
        return true;
    } catch (error) {
        console.error('Chyba při inicializaci Globe.GL:', error);
        return false;
    }
}

// Vytvoření kontejneru pro Globe.GL, pokud neexistuje
function createGlobeContainer() {
    globeContainer = document.createElement('div');
    globeContainer.id = 'globeGlContainer';
    globeContainer.className = 'globe-gl-container';
    globeContainer.style.width = '100%';
    globeContainer.style.height = '100%';
    globeContainer.style.position = 'absolute';
    globeContainer.style.top = '0';
    globeContainer.style.left = '0';
    globeContainer.style.display = 'none';
    
    // Přidání kontejneru do DOM
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.parentNode.appendChild(globeContainer);
        console.log('Vytvořen kontejner pro Globe.GL');
    } else {
        console.error('Nelze najít mapový kontejner pro přidání Globe.GL');
    }
}

// Dynamické načtení Globe.GL knihovny
function loadGlobeGLLibrary() {
    console.log('Načítání Globe.GL knihovny...');
    
    // Vytvoření script tagu pro načtení knihovny
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/globe.gl@2.28.0/dist/globe.gl.min.js';
    script.async = true;
    script.onload = function() {
        console.log('Globe.GL knihovna úspěšně načtena');
        // Zkusíme inicializovat po načtení
        setTimeout(initGlobeGL, 500);
    };
    script.onerror = function() {
        console.error('Nepodařilo se načíst Globe.GL knihovnu');
    };
    
    // Přidání scriptu do hlavičky
    document.head.appendChild(script);
}

// Přidání bodů na glóbus
function addPointsToGlobe(points) {
    if (!globeGl) return;
    
    try {
        // Převod bodů z Leaflet formátu na Globe.GL formát
        globePoints = points.map((marker, index) => {
            const position = marker.getLatLng();
            let name = `Bod ${index + 1}`;
            
            // Pokud existují vlastnosti markeru, použijeme je
            if (window.markerProperties && window.markerProperties[index]) {
                name = window.markerProperties[index].name || name;
            }
            
            return {
                lat: position.lat,
                lng: position.lng,
                name: name,
                color: '#8B5CF6',
                size: 0.5
            };
        });
        
        // Přidání bodů na glóbus
        globeGl.pointsData(globePoints)
            .pointLabel('name')
            .pointColor('color')
            .pointAltitude(0.01)
            .pointRadius('size');
            
        console.log(`Přidáno ${globePoints.length} bodů na glóbus`);
    } catch (error) {
        console.error('Chyba při přidávání bodů na glóbus:', error);
    }
}

// Přidání tras mezi body na glóbus
function addArcsToGlobe(points) {
    if (!globeGl || points.length < 2) return;
    
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
                color: '#8B5CF6'
            });
        }
        
        // Přidání tras na glóbus
        globeGl.arcsData(globeArcs)
            .arcColor('color')
            .arcDashLength(0.4)
            .arcDashGap(0.2)
            .arcDashAnimateTime(1000)
            .arcStroke(0.5);
            
        console.log(`Přidáno ${globeArcs.length} tras na glóbus`);
    } catch (error) {
        console.error('Chyba při přidávání tras na glóbus:', error);
    }
}

// Vyčištění glóbusu
function clearGlobe() {
    if (!globeGl) return;
    
    try {
        // Odstranění všech dat
        globeGl.pointsData([])
            .arcsData([]);
            
        globePoints = [];
        globeArcs = [];
        
        console.log('Glóbus byl vyčištěn');
    } catch (error) {
        console.error('Chyba při čištění glóbusu:', error);
    }
}

// Událost kliknutí na glóbus
function onGlobeClick(point, event) {
    console.log('Kliknuto na glóbus:', point);
    
    // Zde můžeme implementovat přidání bodu na glóbus
    // a synchronizaci s Leaflet mapou
}

// Export funkcí do globálního prostoru
window.initGlobeGL = initGlobeGL;
window.addPointsToGlobe = addPointsToGlobe;
window.addArcsToGlobe = addArcsToGlobe;
window.clearGlobe = clearGlobe;
