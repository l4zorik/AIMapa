/**
 * Debugovací skript pro mapu
 * Verze 0.3.8.4
 */

// Funkce pro kontrolu načtení Leaflet.js
function checkLeaflet() {
    console.log('Kontrola načtení Leaflet.js...');

    if (typeof L === 'undefined') {
        console.error('CHYBA: Leaflet.js není načten!');

        // Pokus o načtení Leaflet.js
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = function() {
            console.log('Leaflet.js byl úspěšně načten dodatečně!');
            checkMapElement();
        };
        script.onerror = function() {
            console.error('CHYBA: Nepodařilo se načíst Leaflet.js dodatečně!');
        };
        document.head.appendChild(script);

        // Pokus o načtení Leaflet.css
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        return false;
    } else {
        console.log('OK: Leaflet.js je načten.');
        return true;
    }
}

// Funkce pro kontrolu existence elementu pro mapu
function checkMapElement() {
    console.log('Kontrola existence elementu pro mapu...');

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('CHYBA: Element pro mapu nebyl nalezen!');

        // Pokus o vytvoření elementu pro mapu
        const mapContainer = document.querySelector('.map-wrapper');
        if (mapContainer) {
            console.log('Nalezen kontejner pro mapu, vytvářím element pro mapu...');
            const newMapElement = document.createElement('div');
            newMapElement.id = 'map';
            newMapElement.style.width = '100%';
            newMapElement.style.height = '100%';
            mapContainer.prepend(newMapElement);
            console.log('Element pro mapu byl vytvořen.');
            return true;
        } else {
            console.error('CHYBA: Kontejner pro mapu nebyl nalezen!');
            return false;
        }
    } else {
        console.log('OK: Element pro mapu existuje.');
        return true;
    }
}

// Funkce pro kontrolu inicializace mapy
function checkMapInitialization() {
    console.log('Kontrola inicializace mapy...');

    if (!window.map && !window.L) {
        console.error('CHYBA: Mapa není inicializována a Leaflet.js není načten!');
        return false;
    } else if (!window.map) {
        console.error('CHYBA: Mapa není inicializována!');

        // Pokus o inicializaci mapy
        try {
            console.log('Pokus o inicializaci mapy...');
            window.map = L.map('map', {
                zoomAnimation: true,
                markerZoomAnimation: true,
                fadeAnimation: true,
                zoomSnap: 0.5,
                wheelPxPerZoomLevel: 120,
                minZoom: 2,
                maxZoom: 18,
                maxBounds: [[-90, -180], [90, 180]],
                maxBoundsViscosity: 1.0
            }).setView([49.8175, 15.4730], 7);

            // Přidání OpenStreetMap podkladu
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                minZoom: 2,
                maxZoom: 18,
                noWrap: true,
                bounds: [[-90, -180], [90, 180]]
            }).addTo(window.map);

            console.log('Mapa byla úspěšně inicializována!');
            return true;
        } catch (error) {
            console.error('CHYBA při inicializaci mapy:', error);
            return false;
        }
    } else {
        console.log('OK: Mapa je inicializována.');
        return true;
    }
}

// Funkce pro kontrolu viditelnosti mapy
function checkMapVisibility() {
    console.log('Kontrola viditelnosti mapy...');

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('CHYBA: Element pro mapu nebyl nalezen!');
        return false;
    }

    const mapStyle = window.getComputedStyle(mapElement);
    if (mapStyle.display === 'none') {
        console.error('CHYBA: Mapa je skrytá (display: none)!');
        mapElement.style.display = 'block';
        return false;
    }

    if (mapStyle.visibility === 'hidden') {
        console.error('CHYBA: Mapa je skrytá (visibility: hidden)!');
        mapElement.style.visibility = 'visible';
        return false;
    }

    if (mapElement.offsetWidth === 0 || mapElement.offsetHeight === 0) {
        console.error('CHYBA: Mapa má nulovou velikost!');
        mapElement.style.width = '100%';
        mapElement.style.height = '400px';
        return false;
    }

    console.log('OK: Mapa je viditelná.');
    console.log('Rozměry mapy:', mapElement.offsetWidth, 'x', mapElement.offsetHeight);
    return true;
}

// Funkce pro kontrolu CSS stylů mapy
function checkMapStyles() {
    console.log('Kontrola CSS stylů mapy...');

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('CHYBA: Element pro mapu nebyl nalezen!');
        return false;
    }

    const mapStyle = window.getComputedStyle(mapElement);
    console.log('CSS styly mapy:', {
        width: mapStyle.width,
        height: mapStyle.height,
        position: mapStyle.position,
        display: mapStyle.display,
        visibility: mapStyle.visibility,
        zIndex: mapStyle.zIndex
    });

    // Kontrola, zda jsou načteny CSS styly pro Leaflet
    const leafletCss = document.querySelector('link[href*="leaflet.css"]');
    if (!leafletCss) {
        console.error('CHYBA: CSS styly pro Leaflet.js nejsou načteny!');

        // Pokus o načtení CSS stylů pro Leaflet
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        return false;
    } else {
        console.log('OK: CSS styly pro Leaflet.js jsou načteny.');
    }

    return true;
}

// Funkce pro kontrolu chyb v konzoli
function checkConsoleErrors() {
    console.log('Kontrola chyb v konzoli...');

    // Tato funkce nemůže přímo přistupovat k chybám v konzoli,
    // ale můžeme nastavit vlastní handler pro zachycení chyb

    window.onerror = function(message, source, lineno, colno, error) {
        console.error('Zachycena chyba:', message, 'na řádku', lineno, 'v souboru', source);
        return false;
    };

    console.log('OK: Handler pro zachycení chyb byl nastaven.');
    return true;
}

// Funkce pro kontrolu načtení dlaždic mapy
function checkMapTiles() {
    console.log('Kontrola načtení dlaždic mapy...');

    if (!window.map) {
        console.error('CHYBA: Mapa není inicializována!');

        // Pokus o inicializaci mapy pomocí SimpleMap
        if (window.SimpleMap && typeof window.SimpleMap.init === 'function') {
            console.log('Pokus o inicializaci mapy pomocí SimpleMap...');
            window.SimpleMap.init();
        }

        return false;
    }

    // Kontrola, zda je mapa instance Leaflet.Map
    if (typeof L !== 'undefined' && !(window.map instanceof L.Map)) {
        console.error('CHYBA: Objekt window.map není instance Leaflet.Map!');

        // Pokus o reinicializaci mapy pomocí SimpleMap
        if (window.SimpleMap && typeof window.SimpleMap.init === 'function') {
            console.log('Pokus o reinicializaci mapy pomocí SimpleMap...');
            window.SimpleMap.init();
        }

        return false;
    }

    // Kontrola, zda jsou viditelné dlaždice mapy
    const tiles = document.querySelectorAll('.leaflet-tile');
    if (tiles.length === 0) {
        console.error('CHYBA: Dlaždice mapy nejsou načteny!');

        // Pokus o vynucení překreslení mapy
        if (window.map && typeof window.map.invalidateSize === 'function') {
            try {
                window.map.invalidateSize();
                console.log('Velikost mapy byla aktualizována');
            } catch (error) {
                console.error('Chyba při aktualizaci velikosti mapy:', error);

                // Pokus o opravu mapy pomocí SimpleMap
                if (window.SimpleMap && typeof window.SimpleMap.fixMap === 'function') {
                    console.log('Pokus o opravu mapy pomocí SimpleMap...');
                    window.SimpleMap.fixMap();
                }
            }
        } else {
            console.error('Metoda invalidateSize není dostupná!');

            // Pokus o opravu mapy pomocí SimpleMap
            if (window.SimpleMap && typeof window.SimpleMap.init === 'function') {
                console.log('Pokus o reinicializaci mapy pomocí SimpleMap...');
                window.SimpleMap.init();
            }
        }

        return false;
    } else {
        console.log('OK: Dlaždice mapy jsou načteny (počet:', tiles.length, ').');
    }

    return true;
}

// Funkce pro kontrolu a opravu mapy
function fixMap() {
    console.log('Spouštím diagnostiku a opravu mapy...');

    // Kontrola, zda je Leaflet načten
    if (typeof L === 'undefined') {
        console.error('CHYBA: Leaflet.js není načten! Pokus o načtení...');

        // Načtení Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        // Načtení Leaflet JS
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

        // Po načtení Leaflet inicializovat mapu
        leafletScript.onload = function() {
            console.log('Leaflet.js byl úspěšně načten, inicializuji mapu...');

            // Pokus o inicializaci mapy pomocí SimpleMap
            if (window.SimpleMap && typeof window.SimpleMap.init === 'function') {
                console.log('Pokus o inicializaci mapy pomocí SimpleMap...');
                window.SimpleMap.init();

                // Počkáme chvíli a pak provedeme diagnostiku
                setTimeout(function() {
                    runDiagnostics();
                }, 1000);
            } else {
                // Pokud SimpleMap není dostupný, provedeme standardní diagnostiku
                runDiagnostics();
            }
        };

        leafletScript.onerror = function() {
            console.error('CHYBA: Nepodařilo se načíst Leaflet.js!');
        };

        document.head.appendChild(leafletScript);
        return;
    }

    // Pokus o opravu mapy pomocí SimpleMap, pokud je dostupný
    if (window.SimpleMap && typeof window.SimpleMap.fixMap === 'function') {
        console.log('Pokus o opravu mapy pomocí SimpleMap...');
        window.SimpleMap.fixMap();

        // Počkáme chvíli a pak provedeme diagnostiku
        setTimeout(function() {
            runDiagnostics();
        }, 500);

        return;
    }

    // Pokud SimpleMap není dostupný, provedeme standardní diagnostiku
    runDiagnostics();
}

// Funkce pro provedení diagnostiky mapy
function runDiagnostics() {
    console.log('Spouštím diagnostiku mapy...');

    // Kontrola načtení Leaflet.js
    if (typeof L === 'undefined') {
        console.error('CHYBA: Leaflet.js není načten! Pokus o načtení...');

        // Načtení Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        // Načtení Leaflet JS
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

        // Po načtení Leaflet inicializovat mapu
        leafletScript.onload = function() {
            console.log('Leaflet.js byl úspěšně načten, inicializuji mapu...');

            // Pokus o inicializaci mapy pomocí SimpleMap
            if (window.SimpleMap && typeof window.SimpleMap.init === 'function') {
                console.log('Pokus o inicializaci mapy pomocí SimpleMap...');
                window.SimpleMap.init();

                // Počkáme chvíli a pak provedeme diagnostiku znovu
                setTimeout(function() {
                    runDiagnostics();
                }, 1000);
            } else {
                // Pokud SimpleMap není dostupný, pokračujeme v diagnostice
                continueDiagnostics();
            }
        };

        leafletScript.onerror = function() {
            console.error('CHYBA: Nepodařilo se načíst Leaflet.js!');
        };

        document.head.appendChild(leafletScript);
        return;
    }

    // Pokračování v diagnostice, když je Leaflet načten
    continueDiagnostics();
}

// Pokračování diagnostiky po kontrole Leaflet
function continueDiagnostics() {
    // Kontrola načtení Leaflet.js
    const leafletLoaded = checkLeaflet();

    // Kontrola existence elementu pro mapu
    const mapElementExists = checkMapElement();

    // Kontrola inicializace mapy
    const mapInitialized = checkMapInitialization();

    // Kontrola viditelnosti mapy
    const mapVisible = checkMapVisibility();

    // Kontrola CSS stylů mapy
    const mapStylesOk = checkMapStyles();

    // Kontrola chyb v konzoli
    const consoleErrorsHandled = checkConsoleErrors();

    // Kontrola načtení dlaždic mapy
    const mapTilesLoaded = checkMapTiles();

    // Výsledek diagnostiky
    const diagnosticResult = {
        leafletLoaded,
        mapElementExists,
        mapInitialized,
        mapVisible,
        mapStylesOk,
        consoleErrorsHandled,
        mapTilesLoaded
    };

    console.log('Výsledek diagnostiky mapy:', diagnosticResult);

    // Pokud je vše v pořádku, vrátíme true
    if (leafletLoaded && mapElementExists && mapInitialized && mapVisible && mapStylesOk && consoleErrorsHandled && mapTilesLoaded) {
        console.log('Mapa je v pořádku!');
        return true;
    }

    // Pokud není vše v pořádku, pokusíme se o opravu
    console.log('Pokus o opravu mapy...');

    // Pokud SimpleMap je dostupný, použijeme ho pro opravu
    if (window.SimpleMap && typeof window.SimpleMap.init === 'function') {
        console.log('Pokus o inicializaci mapy pomocí SimpleMap...');
        window.SimpleMap.init();

        // Počkáme chvíli a pak zkontrolujeme, zda je mapa inicializována
        setTimeout(function() {
            if (!window.map || !(window.map instanceof L.Map)) {
                console.error('CHYBA: Mapa nebyla inicializována pomocí SimpleMap!');
                attemptManualMapInitialization();
            }
        }, 1000);

        return;
    }

    // Pokud SimpleMap není dostupný, pokusíme se o standardní opravu
    attemptManualMapInitialization();
}

// Pokus o ruční inicializaci mapy
function attemptManualMapInitialization() {
    console.log('Pokus o ruční inicializaci mapy...');

    // Kontrola, zda existuje element pro mapu
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('CHYBA: Element pro mapu nebyl nalezen!');

        // Pokus o vytvoření elementu pro mapu
        const mapWrapper = document.querySelector('.map-wrapper');
        if (mapWrapper) {
            console.log('Vytvářím nový element pro mapu...');
            const newMapElement = document.createElement('div');
            newMapElement.id = 'map';
            newMapElement.style.width = '100%';
            newMapElement.style.height = '500px';
            mapWrapper.innerHTML = ''; // Vyčistit wrapper
            mapWrapper.appendChild(newMapElement);
            console.log('Element pro mapu byl vytvořen');
        } else {
            console.error('CHYBA: Kontejner pro mapu nebyl nalezen!');
            return;
        }
    }

    // Kontrola, zda je Leaflet načten
    if (typeof L === 'undefined') {
        console.error('CHYBA: Leaflet.js není načten!');
        return;
    }

    // Pokus o inicializaci mapy
    try {
        console.log('Pokus o inicializaci mapy...');
        window.map = L.map('map', {
            zoomAnimation: true,
            markerZoomAnimation: true,
            fadeAnimation: true,
            zoomSnap: 0.5,
            wheelPxPerZoomLevel: 120,
            minZoom: 2,
            maxZoom: 18,
            maxBounds: [[-90, -180], [90, 180]],
            maxBoundsViscosity: 1.0
        }).setView([49.8175, 15.4730], 7);

        // Přidání OpenStreetMap podkladu
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            minZoom: 2,
            maxZoom: 18,
            noWrap: true,
            bounds: [[-90, -180], [90, 180]]
        }).addTo(window.map);

        console.log('Mapa byla úspěšně inicializována!');

        // Aktualizace velikosti mapy
        setTimeout(function() {
            if (window.map && typeof window.map.invalidateSize === 'function') {
                window.map.invalidateSize();
                console.log('Velikost mapy byla aktualizována');
            }
        }, 500);
    } catch (error) {
        console.error('CHYBA při inicializaci mapy:', error);
    }

    // Kontrola viditelnosti mapy
    const mapStyle = window.getComputedStyle(mapElement);
    if (mapStyle.display === 'none' || mapStyle.visibility === 'hidden') {
        console.error('CHYBA: Mapa je skrytá!');
        mapElement.style.display = 'block';
        mapElement.style.visibility = 'visible';
    }

    // Kontrola velikosti mapy
    if (mapElement.offsetWidth === 0 || mapElement.offsetHeight === 0) {
        console.error('CHYBA: Mapa má nulovou velikost!');
        mapElement.style.width = '100%';
        mapElement.style.height = '500px';
    }

    console.log('Oprava mapy dokončena.');
}

// Spuštění diagnostiky a opravy mapy po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - spouštím diagnostiku mapy...');

    // Spustíme diagnostiku a opravu mapy po 2 sekundách
    setTimeout(function() {
        fixMap();
    }, 2000);

    // Spustíme diagnostiku a opravu mapy znovu po 5 sekundách
    setTimeout(function() {
        fixMap();
    }, 5000);

    // Spustíme diagnostiku a opravu mapy znovu po 10 sekundách
    setTimeout(function() {
        fixMap();
    }, 10000);

    // Spustíme diagnostiku a opravu mapy znovu po 15 sekundách
    setTimeout(function() {
        fixMap();
    }, 15000);
});

// Spuštění diagnostiky a opravy mapy po kompletním načtení stránky
window.addEventListener('load', function() {
    console.log('Window load - spouštím diagnostiku mapy...');

    // Spustíme diagnostiku a opravu mapy po 1 sekundě
    setTimeout(function() {
        fixMap();
    }, 1000);

    // Spustíme diagnostiku a opravu mapy znovu po 3 sekundách
    setTimeout(function() {
        fixMap();
    }, 3000);

    // Spustíme diagnostiku a opravu mapy znovu po 7 sekundách
    setTimeout(function() {
        fixMap();
    }, 7000);
});
