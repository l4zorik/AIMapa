// Inicializace mapy
const map = L.map('map', {
    zoomAnimation: true, // Povolit animaci zoomu
    markerZoomAnimation: true, // Povolit animaci markerů při zoomu
    fadeAnimation: true, // Povolit animaci přechodů
    zoomSnap: 0.5, // Jemnější zoom
    wheelPxPerZoomLevel: 120, // Jemnější zoom kolečkem myši
    minZoom: 2, // Minimální úroveň zoomu - zabrání příliš velkému oddálení
    maxZoom: 18, // Maximální úroveň zoomu
    maxBounds: [[-90, -180], [90, 180]], // Omezení pohybu mapy na celý svět
    maxBoundsViscosity: 1.0 // Zajistí, že mapa nebude moci být posunuta mimo hranice
}).setView([49.8175, 15.4730], 7); // Výchozí pohled na ČR

// Přidání OpenStreetMap podkladu
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    minZoom: 2, // Minimální úroveň zoomu pro dlaždice
    maxZoom: 18, // Maximální úroveň zoomu pro dlaždice
    noWrap: true, // Zabrání opakování dlaždic horizontálně
    bounds: [[-90, -180], [90, 180]] // Omezení dlaždic na celý svět
}).addTo(map);

// Inicializace ukazatele souřadnic
const coordinatesDisplay = document.getElementById('coordinates');

// Přidání event listeneru pro pohyb myši na mapě
map.on('mousemove', function(e) {
    // Získání souřadnic
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    // Zobrazení souřadnic
    coordinatesDisplay.innerHTML = `Lat: ${lat} | Lng: ${lng}`;
});

// Skrytí ukazatele souřadnic, když myš opustí mapu
map.on('mouseout', function() {
    coordinatesDisplay.innerHTML = '';
});

// Proměnné pro ukládání bodů a tras
let markers = [];
let route = null;
let routeControl = null; // Pro Leaflet Routing Machine
let isAddingPoints = true; // Výchozí stav - přidávání bodů je aktivní
let isFullscreen = false;
let is3DMode = false; // Výchozí stav - 3D režim je deaktivovaný
let isGlobeMode = false; // Výchozí stav - glóbus režim je deaktivovaný
let osmb = null; // Proměnná pro OSM Buildings
let cesiumViewer = null; // Proměnná pro Cesium Viewer
let globeMarkers = []; // Proměnná pro markery na glóbusu

// Three.js globální proměnné
let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let threeControls = null;
let threeGlobe = null;
let threeMarkers = [];
let threeRoutes = [];
let threeAnimationFrame = null;

// Inicializace globálních proměnných pro Three.js glóbus, pokud ještě nejsou definovány
if (typeof threeScene === 'undefined') threeScene = null;
if (typeof threeCamera === 'undefined') threeCamera = null;
if (typeof threeRenderer === 'undefined') threeRenderer = null;
if (typeof threeControls === 'undefined') threeControls = null;
if (typeof threeGlobe === 'undefined') threeGlobe = null;
if (typeof threeMarkers === 'undefined') threeMarkers = [];
if (typeof threeRoutes === 'undefined') threeRoutes = [];
if (typeof threeAnimationFrame === 'undefined') threeAnimationFrame = null;

// Globální proměnná pro ukládání event listenerů
let eventListeners = [];

// Pomocná funkce pro přidání event listeneru s automatickým sledováním
function addTrackedEventListener(element, eventType, handler, options) {
    if (!element) {
        console.warn('Pokus o přidání event listeneru na neexistující element');
        return;
    }

    // Přidání event listeneru
    element.addEventListener(eventType, handler, options);

    // Uložení reference pro pozdější odstranění
    eventListeners.push({
        element: element,
        eventType: eventType,
        handler: handler
    });

    return handler; // Vrátíme handler pro případ, že ho budeme potřebovat jinde
}

// Funkce pro odstranění všech event listenerů pro daný element
function removeAllEventListeners(element) {
    if (!element) return;

    // Najdeme všechny event listenery pro daný element a odstraníme je
    const listenersToRemove = eventListeners.filter(listener => listener.element === element);

    listenersToRemove.forEach(listener => {
        listener.element.removeEventListener(listener.eventType, listener.handler);
    });

    // Aktualizujeme globální pole event listenerů
    eventListeners = eventListeners.filter(listener => listener.element !== element);
}

// Funkce pro odstranění konkrétního event listeneru
function removeTrackedEventListener(element, eventType, handler) {
    if (!element) return;

    // Odstraníme event listener
    element.removeEventListener(eventType, handler);

    // Aktualizujeme globální pole event listenerů
    eventListeners = eventListeners.filter(listener =>
        !(listener.element === element &&
          listener.eventType === eventType &&
          listener.handler === handler));
}

// Konfigurace pro Leaflet Routing Machine
const routingOptions = {
    router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving', // Možnosti: driving, walking, cycling
        timeout: 5000, // Časový limit pro API požadavek (5 sekund)
        geometryOnly: false, // Optimalizace pro získání pouze geometrie trasy
        urlParameters: {
            alternatives: false, // Nezobrazovat alternativní trasy
            steps: false, // Nezobrazovat kroky trasy
            overview: 'full' // Získat plnou geometrii trasy
        }
    }),
    lineOptions: {
        styles: [
            {color: 'blue', opacity: 0.9, weight: 5}
        ],
        addWaypoints: false,
        extendToWaypoints: true,
        missingRouteTolerance: 0,
        smoothFactor: 1 // Vyhlazení trasy pro lepší vzhled
    },
    show: false, // Nezobrazovat instrukce pro trasu
    showAlternatives: false,
    fitSelectedRoutes: false,
    draggableWaypoints: false,
    createMarker: function() { return null; }, // Nepoužívat výchozí markery
    routeWhileDragging: false, // Zabrání přepočítávání trasy při přesouvní mapy
    useZoomParameter: false, // Zabrání přepočítávání trasy při změně zoomu
    addWaypoints: false, // Nezobrazovat průjezdní body
    waypointMode: 'connect', // Pouze propojit body bez možnosti přidávání nových
    autoRoute: true, // Automaticky vypočítat trasu
    routeDragInterval: 500, // Interval pro přepočet trasy při přesouvní (vyšší hodnota = méně časté přepočty)
    collapsible: true // Možnost sbalit panel s instrukcemi
};

// Reference na HTML elementy pro informace o trase
const routeDistanceElement = document.getElementById('routeDistance');
const routeTimeElement = document.getElementById('routeTime');

// Proměnná pro ukládání vlastností markerů
let markerProperties = [];

// Proměnná pro ukládání smazaných bodů a jejich příkazů
let deletedMarkerCommands = [];

// Proměnná pro ukládání intervalů pro odpočet
let countdownIntervals = {};

// Funkce pro vytvoření popup obsahu s formulářem
function createPopupContent(marker, index) {
    const markerProp = markerProperties[index] || {
        name: `Bod ${index + 1}`,
        command: `bod${index + 1}`,
        lat: marker.getLatLng().lat.toFixed(4),
        lng: marker.getLatLng().lng.toFixed(4),
        saved: false // Přidání příznak, zda je bod uložený
    };

    // Vytvoření unikátního ID pro odpočet - použijeme fixní ID pro každý marker
    const countdownId = `countdown-${index}`;

    // Kontrola, zda je bod uložený nebo nově vytvořený
    if (markerProp.saved) {
        // Verze pro uložený bod - režim prohlížení s možností úpravy
        return `
            <div class="popup-content saved-marker">
                <div class="popup-header">
                    <div class="popup-title">${markerProp.name}</div>
                    <div class="popup-countdown" id="${countdownId}">35s</div>
                </div>
                <div class="popup-info">
                    <div class="info-row">
                        <div class="info-icon"><i class="icon">📍</i></div>
                        <div class="info-content"><strong>Název:</strong> ${markerProp.name}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-icon"><i class="icon">💬</i></div>
                        <div class="info-content"><strong>Příkaz:</strong> ${markerProp.command}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-icon"><i class="icon">📍</i></div>
                        <div class="info-content"><strong>Souřadnice:</strong> ${markerProp.lat}, ${markerProp.lng}</div>
                    </div>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn edit-btn" onclick="editMarker(${index}, event)">Upravit</button>
                    <button class="popup-btn delete-btn" onclick="removeMarker(${index}, event)">Odstranit</button>
                </div>
            </div>
        `;
    } else {
        // Verze pro nově vytvořený bod - formulář pro zadání údajů
        return `
            <div class="popup-content new-marker">
                <div class="popup-header">
                    <div class="popup-title">${markerProp.name}</div>
                    <div class="popup-countdown" id="${countdownId}">35s</div>
                </div>
                <div class="popup-form">
                    <div class="form-group">
                        <label for="markerName${index}">Název bodu:</label>
                        <input type="text" id="markerName${index}" value="${markerProp.name}" class="popup-input">
                    </div>
                    <div class="form-group">
                        <label for="markerCommand${index}">Příkaz pro chat:</label>
                        <input type="text" id="markerCommand${index}" value="${markerProp.command}" class="popup-input">
                    </div>
                    <p class="coordinates">Souřadnice: ${markerProp.lat}, ${markerProp.lng}</p>
                    <div class="popup-actions">
                        <button class="popup-btn save-btn" onclick="saveMarkerProperties(${index}, event)">Uložit</button>
                        <button class="popup-btn delete-btn" onclick="removeMarker(${index}, event)">Odstranit bod</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Funkce pro spuštění odpočtu
function startCountdown(elementId, seconds) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) {
        console.error('Countdown element not found in startCountdown:', elementId);
        return;
    }

    // Zrušení předchozího intervalu, pokud existuje
    if (countdownIntervals[elementId]) {
        clearInterval(countdownIntervals[elementId]);
    }

    let remainingSeconds = seconds;

    // Aktualizace počátečního zobrazení - skrytý odpočet
    countdownElement.textContent = `${remainingSeconds}s`;
    // countdownElement.style.display = 'none'; // Skryjeme odpočet
    countdownElement.classList.remove('countdown-warning', 'countdown-danger'); // Reset tříd

    // Získání indexu markeru z ID elementu
    const idParts = elementId.split('-');
    const markerIndex = parseInt(idParts[1]);

    console.log(`Starting countdown for marker ${markerIndex}, element ID: ${elementId}, seconds: ${seconds}`);

    // Aktualizace odpočtu každou sekundu
    countdownIntervals[elementId] = setInterval(() => {
        remainingSeconds--;

        // Kontrola, zda element stále existuje v DOM
        const updatedElement = document.getElementById(elementId);
        if (updatedElement) {
            updatedElement.textContent = `${remainingSeconds}s`;

            // Skryté změny barvy při nízkém čase - pouze pro ladění
            // if (remainingSeconds <= 10) {
            //     updatedElement.classList.add('countdown-warning');
            // }
            // if (remainingSeconds <= 5) {
            //     updatedElement.classList.add('countdown-danger');
            // }
        } else {
            console.error('Countdown element disappeared during countdown');
            clearInterval(countdownIntervals[elementId]);
            delete countdownIntervals[elementId];
            return;
        }

        // Ukončení intervalu a zavření popup okna po vypršení času
        if (remainingSeconds <= 0) {
            clearInterval(countdownIntervals[elementId]);
            delete countdownIntervals[elementId];

            // Zavření popup okna, pokud je index markeru platný
            if (!isNaN(markerIndex) && markerIndex < markers.length) {
                const marker = markers[markerIndex];
                if (marker && marker.isPopupOpen()) {
                    console.log(`Closing popup for marker ${markerIndex} after countdown`);
                    marker.closePopup();
                }

                // Zrušení časovače pro popup okno
                if (popupTimers[markerIndex]) {
                    clearTimeout(popupTimers[markerIndex]);
                    delete popupTimers[markerIndex];
                }
            }
        }
    }, 1000);

    // Uložení intervalu do globální proměnné
    return countdownIntervals[elementId];
}

// Funkce pro uložení vlastností markeru
function saveMarkerProperties(index, event) {
    // Zastavení propagace události, aby se nezavřelo popup okno
    if (event) {
        event.stopPropagation();
    }

    const nameInput = document.getElementById(`markerName${index}`);
    const commandInput = document.getElementById(`markerCommand${index}`);

    if (nameInput && commandInput && index < markers.length) {
        const marker = markers[index];
        const latlng = marker.getLatLng();

        // Uložení vlastností
        markerProperties[index] = {
            name: nameInput.value || `Bod ${index + 1}`,
            command: commandInput.value || `bod${index + 1}`,
            lat: latlng.lat.toFixed(4),
            lng: latlng.lng.toFixed(4),
            saved: true // Nastavení příznaku, že bod byl uložen
        };

        // Zrušení časovače pro popup okno
        if (popupTimers[index]) {
            clearTimeout(popupTimers[index]);
            delete popupTimers[index];
        }

        // Zrušení všech intervalů pro odpočet
        Object.keys(countdownIntervals).forEach(key => {
            if (key.startsWith(`countdown-${index}-`)) {
                clearInterval(countdownIntervals[key]);
                delete countdownIntervals[key];
            }
        });

        // Informace pro uživatele
        addMessage(`Bod "${markerProperties[index].name}" byl uložen. Pro navigaci na tento bod napište "${markerProperties[index].command}" do chatu.`, false);

        // Aktualizace popup obsahu - přepnutí do prohlížecího režimu
        marker.setPopupContent(createPopupContent(marker, index));

        // Uložení stavu aplikace po změně vlastností markeru
        saveAppState();
    }
}

// Funkce pro přepnutí markeru do režimu úprav
function editMarker(index, event) {
    // Zastavení propagace události, aby se nezavřelo popup okno
    if (event) {
        event.stopPropagation();
    }

    if (index < markers.length) {
        const marker = markers[index];

        // Dočasně nastavíme příznak saved na false, aby se zobrazil formulář
        const tempProperties = {...markerProperties[index], saved: false};
        markerProperties[index] = tempProperties;

        // Aktualizace popup obsahu
        marker.setPopupContent(createPopupContent(marker, index));

        // Znovu otevřeme popup, pokud bylo zavřeno
        if (!marker.isPopupOpen()) {
            marker.openPopup();
        }

        // Informace pro uživatele
        addMessage(`Bod "${tempProperties.name}" je nyní v režimu úprav.`, false);
    }
}

// Funkce pro odstranění markeru
function removeMarker(index, event) {
    // Zastavení propagace události, aby se nezavřelo popup okno předčasně
    if (event) {
        event.stopPropagation();
    }

    if (index < markers.length) {
        const marker = markers[index];
        const markerName = markerProperties[index]?.name || `Bod ${index + 1}`;
        const markerCommand = markerProperties[index]?.command;
        const markerLat = markerProperties[index]?.lat;
        const markerLng = markerProperties[index]?.lng;

        // Uložení příkazu a vlastností smazaného bodu pro pozdější použití
        if (markerCommand && markerLat && markerLng) {
            deletedMarkerCommands.push({
                command: markerCommand,
                name: markerName,
                lat: markerLat,
                lng: markerLng
            });
            addMessage(`Příkaz "${markerCommand}" zůstává aktivní i po smazání bodu.`, false);
        }

        // Zrušení časovače pro popup okno
        if (popupTimers[index]) {
            clearTimeout(popupTimers[index]);
            delete popupTimers[index];
        }

        // Zrušení všech intervalů pro odpočet
        Object.keys(countdownIntervals).forEach(key => {
            if (key.startsWith(`countdown-${index}-`)) {
                clearInterval(countdownIntervals[key]);
                delete countdownIntervals[key];
            }
        });

        // Odstranění markeru z mapy
        map.removeLayer(marker);

        // Odstranění markeru a jeho vlastností z polí
        markers.splice(index, 1);
        markerProperties.splice(index, 1);

        // Aktualizace časovačů pro zbývající markery
        const oldPopupTimers = {...popupTimers};
        popupTimers = {};

        // Přečíslovat časovače
        Object.keys(oldPopupTimers).forEach(key => {
            const keyIndex = parseInt(key);
            if (!isNaN(keyIndex)) {
                if (keyIndex > index) {
                    popupTimers[keyIndex - 1] = oldPopupTimers[key];
                } else if (keyIndex < index) {
                    popupTimers[keyIndex] = oldPopupTimers[key];
                }
            }
        });

        // Aktualizace vlastností zbývajících markerů (přečíslovat)
        for (let i = index; i < markers.length; i++) {
            if (!markerProperties[i]) {
                markerProperties[i] = { name: `Bod ${i + 1}`, command: `bod${i + 1}` };
            }
            markers[i].setPopupContent(createPopupContent(markers[i], i));
        }

        // Informace pro uživatele
        addMessage(`Bod "${markerName}" byl odstraněn.`, false);

        // Přepočítání trasy, pokud máme alespoň dva body
        if (markers.length >= 2) {
            calculateRouteFunction();
        } else if (routeControl) {
            // Odstranění trasy, pokud nemáme dostatek bodů
            map.removeControl(routeControl);
            routeControl = null;

            // Reset informací o trase
            routeDistanceElement.textContent = '-';
            routeTimeElement.textContent = '-';
        }

        // Uložení stavu aplikace po odstranění markeru
        saveAppState();
    }
}

// Proměnná pro ukládání časovačů popup oken
let popupTimers = {};

// Globální nastavení pro markery
let markerStyle = 'circle'; // Výchozí styl: circle, square, diamond, pin, star
let markerEffectsEnabled = true; // Výchozí nastavení: efekty povoleny

// Funkce pro vytvoření vlastního HTML markeru s číslem a pokročilými efekty
function createCustomMarkerIcon(number, colorIndex) {
    // Omezení barevných tříd na 1-5
    const colorClass = `color-${(colorIndex % 5) + 1}`;

    // Získání aktuálního stylu markeru
    const styleClass = markerStyle || 'circle';

    // Získání třídy pro efekty
    const effectsClass = markerEffectsEnabled ? 'with-effects' : 'no-effects';

    // Vytvoření HTML pro různé styly markerů
    let markerHtml = '';

    switch(styleClass) {
        case 'square':
            markerHtml = `<div class="custom-marker ${colorClass} ${effectsClass} square-style"><span>${number}</span></div>`;
            break;
        case 'diamond':
            markerHtml = `<div class="custom-marker ${colorClass} ${effectsClass} diamond-style"><span>${number}</span></div>`;
            break;
        case 'pin':
            markerHtml = `<div class="custom-marker ${colorClass} ${effectsClass} pin-style"><span>${number}</span></div>`;
            break;
        case 'star':
            markerHtml = `<div class="custom-marker ${colorClass} ${effectsClass} star-style"><span>${number}</span></div>`;
            break;
        default: // circle
            markerHtml = `<div class="custom-marker ${colorClass} ${effectsClass}"><span>${number}</span></div>`;
    }

    // Vytvoření HTML elementu pro marker s pokročilými efekty
    const icon = L.divIcon({
        className: 'custom-marker-container', // Kontejner pro marker
        html: markerHtml,
        iconSize: [32, 32], // Zmenšeno z 40x40 na 32x32
        iconAnchor: [16, 16] // Upraveno podle nové velikosti
    });

    return icon;
}

// Funkce pro přidání bodu na mapu
function addMarkerToMap(latlng) {
    // Získání indexu pro nový marker
    const markerIndex = markers.length;

    // Vytvoření vlastního markeru s číslem
    const customIcon = createCustomMarkerIcon(markerIndex + 1, markerIndex);

    const marker = L.marker(latlng, {
        draggable: true, // Umožní přesouvat marker tažením
        title: `Bod ${markerIndex + 1}`, // Popisek při najetí myší
        icon: customIcon // Použití vlastního ikony
    }).addTo(map);

    // Přidání markeru do pole
    markers.push(marker);

    // Vytvoření výchozích vlastností pro marker
    markerProperties[markerIndex] = {
        name: `Bod ${markerIndex + 1}`,
        command: `bod${markerIndex + 1}`,
        lat: latlng.lat.toFixed(4),
        lng: latlng.lng.toFixed(4)
    };

    // Přidání popup s formulářem
    marker.bindPopup(createPopupContent(marker, markerIndex), {
        className: 'marker-popup',
        maxWidth: 350,
        minWidth: 250,
        autoPan: true,
        autoPanPadding: [50, 50],
        closeOnClick: true, // Zavřít při kliknutí mimo popup
        autoClose: true // Automaticky zavřít při kliknutí mimo popup
    });

    // Přidání zprávy do chatu
    addMessage(`Přidán bod "${markerProperties[markerIndex].name}" na souřadnicích [${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}]. Klikněte na bod pro úpravu.`, false);

    // Přidání event listeneru pro přesunutí markeru
    marker.on('dragend', function() {
        const newPos = marker.getLatLng();

        // Aktualizace souřadnic v properties
        if (markerProperties[markerIndex]) {
            markerProperties[markerIndex].lat = newPos.lat.toFixed(4);
            markerProperties[markerIndex].lng = newPos.lng.toFixed(4);
        }

        // Aktualizace popup obsahu
        marker.setPopupContent(createPopupContent(marker, markerIndex));

        // Vylepšený efekt při přesunutí - změna velikosti, záření a animace
        const markerElement = marker.getElement().querySelector('.custom-marker');
        if (markerElement) {
            // Přidání třídy 'selected' pro speciální efekty
            markerElement.classList.add('selected');

            // Pokročilé efekty pro přesunutý marker
            markerElement.style.transform = 'scale(1.5) translateY(-10px)';
            markerElement.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 1), 0 20px 60px rgba(139, 92, 246, 0.6)';
            markerElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // Vytvoření efektu stínu pod markerem
            const shadow = document.createElement('div');
            shadow.style.position = 'absolute';
            shadow.style.bottom = '-15px';
            shadow.style.left = '50%';
            shadow.style.transform = 'translateX(-50%)';
            shadow.style.width = '30px';
            shadow.style.height = '10px';
            shadow.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            shadow.style.borderRadius = '50%';
            shadow.style.filter = 'blur(5px)';
            shadow.style.zIndex = '-1';
            shadow.style.opacity = '0.7';
            shadow.style.transition = 'all 0.5s ease';
            shadow.style.pointerEvents = 'none';

            // Přidání stínu do kontejneru markeru
            const container = marker.getElement();
            if (container) {
                container.appendChild(shadow);
            }

            // Animace stínu
            setTimeout(() => {
                shadow.style.width = '40px';
                shadow.style.opacity = '0.5';
            }, 50);

            // Efekt dokončení přesunutí - návrat do původního stavu s jemným odskočením
            setTimeout(() => {
                markerElement.style.transform = 'scale(1.2) translateY(-5px)';
                markerElement.style.boxShadow = '0 5px 15px rgba(139, 92, 246, 0.8), 0 10px 30px rgba(139, 92, 246, 0.4)';

                if (shadow && container && container.contains(shadow)) {
                    shadow.style.width = '25px';
                    shadow.style.opacity = '0.6';
                }
            }, 500);

            // Konečný návrat do původního stavu
            setTimeout(() => {
                markerElement.classList.remove('selected');
                markerElement.style.transform = '';
                markerElement.style.boxShadow = '';

                if (shadow && container && container.contains(shadow)) {
                    container.removeChild(shadow);
                }
            }, 800);
        }

        // Pokud máme alespoň dva body, přepočítáme trasu
        if (markers.length >= 2) {
            calculateRouteFunction();
        }
    });

    // Přidání event listeneru pro kliknutí na marker
    marker.on('click', function() {
        // Zrušení předchozího časovače, pokud existuje
        if (popupTimers[markerIndex]) {
            clearTimeout(popupTimers[markerIndex]);
        }

        // Pokročilý efekt při kliknutí - rotace, záření a pulzování
        const markerElement = marker.getElement().querySelector('.custom-marker');
        if (markerElement) {
            // Přidání třídy 'active' pro aktivaci speciálních efektů
            markerElement.classList.add('active');

            // Přidání pokročilých stylů pro rotaci a záření - mírnější efekt
            markerElement.style.transform = 'scale(1.3) rotate(360deg)'; // Zmenšeno z 1.4
            markerElement.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.9), 0 0 30px rgba(139, 92, 246, 0.6)';
            markerElement.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            markerElement.style.borderColor = '#FFD700'; // Zlatý okraj pro zvýraznění aktivního bodu

            // Vytvoření efektu záblesku
            const flash = document.createElement('div');
            flash.style.position = 'absolute';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.right = '0';
            flash.style.bottom = '0';
            flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            flash.style.borderRadius = '50%';
            flash.style.opacity = '0.8';
            flash.style.zIndex = '1';
            flash.style.pointerEvents = 'none';
            markerElement.appendChild(flash);

            // Animace záblesku
            setTimeout(() => {
                flash.style.opacity = '0';
                flash.style.transition = 'opacity 0.5s ease';
            }, 50);

            // Odstranění záblesku po dokončení animace
            setTimeout(() => {
                if (markerElement.contains(flash)) {
                    markerElement.removeChild(flash);
                }
            }, 550);

            // Návrat do původního stavu po animaci
            setTimeout(() => {
                markerElement.classList.remove('active');
                markerElement.style.transform = '';
                markerElement.style.boxShadow = '';
                markerElement.style.borderColor = '';
            }, 800);
        }

        // Nastavení nového časovače - nyní se o to stará funkce startCountdown
        // Není potřeba zde nastavovat časovač, protože to dělá funkce startCountdown
    });

    // Přidání event listeneru pro otevření popup okna
    marker.on('popupopen', function() {
        console.log(`Popup opened for marker ${markerIndex}`);

        // Zrušení všech předchozích intervalů pro odpočet
        Object.keys(countdownIntervals).forEach(key => {
            clearInterval(countdownIntervals[key]);
            delete countdownIntervals[key];
        });

        // Spuštění odpočtu - počkáme na vykreslení DOM
        setTimeout(() => {
            // Použijeme přímý selektor pro nalezení elementu odpočtu v aktuálním popup okně
            const popupElement = marker.getPopup().getElement();
            if (popupElement) {
                const countdownElement = popupElement.querySelector('.popup-countdown');
                if (countdownElement) {
                    // Nastavíme ID pro element odpočtu
                    const countdownId = `countdown-${markerIndex}`;
                    countdownElement.id = countdownId;

                    // Spuštění odpočtu
                    console.log(`Starting countdown for marker ${markerIndex} with element:`, countdownElement);
                    startCountdown(countdownId, 35);
                } else {
                    console.error('Countdown element not found in popup');
                }
            } else {
                console.error('Popup element not found');
            }
        }, 300); // Počkáme 300ms na vykreslení DOM
    });

    // Přidání event listeneru pro zavření popup okna
    marker.on('popupclose', function() {
        // Zrušení časovače při manuálním zavření popup okna
        if (popupTimers[markerIndex]) {
            clearTimeout(popupTimers[markerIndex]);
            delete popupTimers[markerIndex];
        }

        // Zrušení všech intervalů pro odpočet
        Object.keys(countdownIntervals).forEach(key => {
            if (key.startsWith(`countdown-${markerIndex}-`)) {
                clearInterval(countdownIntervals[key]);
                delete countdownIntervals[key];
            }
        });
    });

    // Pokud máme právě dva nebo více bodů, automaticky vypočítáme trasu
    if (markers.length >= 2) {
        calculateRouteFunction();
    }

    // Aktualizace glóbusu, pokud je aktivní
    if (isGlobeMode && cesiumViewer) {
        addMarkersToGlobe();
        addRoutesToGlobe();
    }

    // Uložení stavu aplikace po přidání nového bodu
    saveAppState();

    return marker;
}

// Event listener pro dvojklik na mapu
map.on('dblclick', (e) => {
    if (isAddingPoints) {
        addMarkerToMap(e.latlng);
    }
});

// Deaktivace standardního chování dvojkliku (zoom)
map.doubleClickZoom.disable();

// Přidání event listeneru pro kliknutí na mapu - zavře všechna popup okna
map.on('click', (e) => {
    // Kontrola, zda kliknutí nebylo na popup okno nebo jeho obsah
    const clickedElement = e.originalEvent.target;
    const isPopupClick = clickedElement.closest('.leaflet-popup') ||
                        clickedElement.closest('.popup-content') ||
                        clickedElement.closest('.popup-actions') ||
                        clickedElement.closest('.popup-btn');

    // Zavření všech popup oken při kliknutí na mapu (mimo popup okno)
    if (!isPopupClick) {
        map.closePopup();
    }
});

// Event listener pro zoom, aby se popup okna a trasy lépe chovaly při zoomu
map.on('zoomstart', () => {
    // Přidání třídy pro animaci při zoomu
    document.querySelectorAll('.leaflet-popup').forEach(popup => {
        popup.classList.add('zooming');
    });

    // Optimalizace trasy při zoomu
    const routingPane = document.querySelector('.leaflet-overlay-pane');
    if (routingPane) {
        routingPane.classList.add('zooming');
    }

    // Pozastavení animací pro lepší výkon při zoomu
    document.body.classList.add('map-zooming');
});

map.on('zoomend', () => {
    // Odstranění třídy po dokončení zoomu
    setTimeout(() => {
        document.querySelectorAll('.leaflet-popup').forEach(popup => {
            popup.classList.remove('zooming');
        });

        // Obnovení trasy po dokončení zoomu
        const routingPane = document.querySelector('.leaflet-overlay-pane');
        if (routingPane) {
            routingPane.classList.remove('zooming');
        }

        // Obnovení animací po dokončení zoomu
        document.body.classList.remove('map-zooming');

        // Aktualizace velikosti mapy pro správné vykreslení trasy
        map.invalidateSize();
    }, 300);
});

// Event listenery pro pohyb mapy, aby se popup okna a trasy lépe chovaly při pohybu mapy
map.on('movestart', () => {
    // Přidání třídy pro animaci při pohybu mapy
    document.querySelectorAll('.leaflet-popup').forEach(popup => {
        popup.classList.add('moving');
    });

    // Optimalizace trasy při pohybu mapy
    const routingPane = document.querySelector('.leaflet-overlay-pane');
    if (routingPane) {
        routingPane.classList.add('moving');
    }

    // Pozastavení animací pro lepší výkon při pohybu mapy
    document.body.classList.add('map-moving');
});

map.on('moveend', () => {
    // Odstranění třídy po dokončení pohybu mapy
    setTimeout(() => {
        document.querySelectorAll('.leaflet-popup').forEach(popup => {
            popup.classList.remove('moving');
        });

        // Obnovení trasy po dokončení pohybu mapy
        const routingPane = document.querySelector('.leaflet-overlay-pane');
        if (routingPane) {
            routingPane.classList.remove('moving');
        }

        // Obnovení animací po dokončení pohybu mapy
        document.body.classList.remove('map-moving');
    }, 100);
});

// Event listeners pro tlačítka
document.getElementById('addActivity').addEventListener('click', () => {
    const addActivityBtn = document.getElementById('addActivity');
    isAddingPoints = !isAddingPoints;

    if (isAddingPoints) {
        addActivityBtn.classList.add('active');
        addMessage('Režim přidávání bodů je aktivní. Dvojklikněte na mapu pro přidání bodu.', false);
    } else {
        addActivityBtn.classList.remove('active');
        addMessage('Režim přidávání bodů byl deaktivován.', false);
    }
});

// Event listenery pro tlačítka 3D a glóbus režimu jsou nyní pouze ve fullscreen módu

// Funkce pro výpočet trasy s použitím Leaflet Routing Machine
function calculateRouteFunction() {
    if (markers.length < 2) {
        addMessage('Pro výpočet trasy jsou potřeba alespoň 2 body', false);
        return;
    }

    // Získání bodů pro výpočet trasy
    const points = markers.map(marker => marker.getLatLng());

    // Odstranění předchozí trasy, pokud existuje
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }

    // Odstranění přímé trasy, pokud existuje
    if (route) {
        map.removeLayer(route);
        route = null;
    }

    // Optimalizace pro rychlejší výpočet trasy
    document.body.classList.remove('map-zooming', 'map-moving');
    const routingPane = document.querySelector('.leaflet-overlay-pane');
    if (routingPane) {
        routingPane.classList.remove('zooming', 'moving');
    }

    // Použití přímého volání OSRM API pro rychlejší výpočet trasy
    // Toto je rychlejší než použití Leaflet Routing Machine
    const fetchDirectRoute = async () => {
        try {
            // Vytvoření URL pro OSRM API
            const coordinates = points.map(p => `${p.lng},${p.lat}`).join(';');
            const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=polyline&steps=false&alternatives=false`;

            // Nastavení časového limitu pro fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            // Provedení požadavku na API
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            const data = await response.json();

            if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
                throw new Error('No route found');
            }

            // Získání trasy z odpovědi
            const routeData = data.routes[0];

            // Dekódování polyline
            const decodedRoute = L.Polyline.fromEncoded(routeData.geometry).getLatLngs();

            // Vytvoření trasy na mapě
            if (route) {
                map.removeLayer(route);
            }

            route = L.polyline(decodedRoute, {
                color: 'blue',
                weight: 5,
                opacity: 0.9,
                smoothFactor: 1
            }).addTo(map);

            // Výpočet vzdálenosti a času
            const distanceKm = (routeData.distance / 1000).toFixed(2);
            const totalTimeSeconds = routeData.duration;
            const hours = Math.floor(totalTimeSeconds / 3600);
            const minutes = Math.round((totalTimeSeconds % 3600) / 60);

            const timeString = hours > 0 ?
                `${hours} h ${minutes} min` :
                `${minutes} min`;

            // Aktualizace informací o trase v panelu
            routeDistanceElement.textContent = `${distanceKm} km`;
            routeTimeElement.textContent = timeString;

            // Přidání zprávy do chatu s informacemi o trase
            addMessage(`Trasa vypočítána po skutečných silnicích. Celková vzdálenost: ${distanceKm} km, čas cesty: ${timeString}`, false);

            // Přizpůsobení mapy, aby zobrazovala celou trasu
            map.fitBounds(route.getBounds(), {padding: [50, 50]});

            // Uložení stavu aplikace po výpočtu trasy
            saveAppState();

            return true;
        } catch (error) {
            console.error('Chyba při přímém volání OSRM API:', error);
            return false;
        }
    };

    // Nejprve zkusíme přímé volání API pro rychlejší výsledek
    fetchDirectRoute().then(success => {
        if (!success) {
            // Pokud přímé volání selhá, použijeme Leaflet Routing Machine jako zálohu
            console.log('Používám Leaflet Routing Machine jako zálohu');

            // Vytvoření nové trasy s optimalizovanými nastaveními
            routeControl = L.Routing.control({
                ...routingOptions,
                waypoints: points
            }).addTo(map);

            // Pozastavení animací při vytváření trasy pro lepší výkon
            const routingLayer = document.querySelector('.leaflet-routing-layer');
            if (routingLayer) {
                routingLayer.style.transition = 'none';
                routingLayer.style.willChange = 'transform';
            }

            // Nastavení časového limitu pro získání trasy
            const routeTimeout = setTimeout(() => {
                // Pokud se trasa nezobrazí do 2 sekund, vytvoříme přímou trasu
                if (routeControl && !route) {
                    addMessage('Výpočet přesné trasy trvá déle. Zobrazuji dočasnou přímou trasu.', false);

                    // Vytvoření přímé trasy mezi body jako dočasné řešení
                    route = L.polyline(points, {
                        color: 'red',
                        weight: 4,
                        opacity: 0.8,
                        dashArray: '5, 10'
                    }).addTo(map);

                    // Výpočet přibližné vzdálenosti přímé trasy
                    let distance = 0;
                    for (let i = 0; i < points.length - 1; i++) {
                        distance += points[i].distanceTo(points[i+1]);
                    }

                    // Převod na kilometry
                    const distanceKm = (distance / 1000).toFixed(2);

                    // Výpočet přibližného času cesty (průměrná rychlost 50 km/h)
                    const averageSpeedKmh = 50;
                    const timeHours = distanceKm / averageSpeedKmh;

                    // Převod na hodiny a minuty
                    const hours = Math.floor(timeHours);
                    const minutes = Math.round((timeHours - hours) * 60);
                    const timeString = hours > 0 ?
                        `${hours} h ${minutes} min` :
                        `${minutes} min`;

                    // Aktualizace informací o trase v panelu s přímou trasou
                    routeDistanceElement.textContent = `${distanceKm} km (přímá trasa)`;
                    routeTimeElement.textContent = timeString;

                    // Přizpůsobení mapy, aby zobrazovala celou trasu
                    map.fitBounds(route.getBounds(), {padding: [50, 50]});
                }
            }, 2000);

            // Poslech na událost 'routesfound' pro získání informací o trase
            routeControl.on('routesfound', function(e) {
                // Zrušení časového limitu
                clearTimeout(routeTimeout);

                // Odstranění přímé trasy, pokud byla vytvořena
                if (route) {
                    map.removeLayer(route);
                    route = null;
                }

                const routes = e.routes;
                const summary = routes[0].summary;

                // Získání vzdálenosti v kilometrech
                const distanceKm = (summary.totalDistance / 1000).toFixed(2);

                // Získání času v sekundách a převod na hodiny a minuty
                const totalTimeSeconds = summary.totalTime;
                const hours = Math.floor(totalTimeSeconds / 3600);
                const minutes = Math.round((totalTimeSeconds % 3600) / 60);

                const timeString = hours > 0 ?
                    `${hours} h ${minutes} min` :
                    `${minutes} min`;

                // Aktualizace informací o trase v panelu
                routeDistanceElement.textContent = `${distanceKm} km`;
                routeTimeElement.textContent = timeString;

                // Přidání zprávy do chatu s informacemi o trase
                addMessage(`Trasa vypočítána po skutečných silnicích. Celková vzdálenost: ${distanceKm} km, čas cesty: ${timeString}`, false);

                // Přizpůsobení mapy, aby zobrazovala celou trasu
                if (routes[0].coordinates && routes[0].coordinates.length > 0) {
                    map.fitBounds(L.latLngBounds(routes[0].coordinates), {padding: [50, 50]});
                }

                // Uložení stavu aplikace po výpočtu trasy
                saveAppState();
            });

            // Poslech na událost 'routingerror' pro případ chyby při výpočtu trasy
            routeControl.on('routingerror', function(e) {
                // Zrušení časového limitu
                clearTimeout(routeTimeout);

                console.error('Chyba při výpočtu trasy:', e.error);

                // Pokud se nepodaří získat trasu přes API, použijeme záložní metodu s přímou čárou
                addMessage('Nepodařilo se získat přesnou trasu po silnicích. Zobrazuji přímou trasu.', false);

                // Vytvoření přímé trasy mezi body jako záložní řešení
                if (route) {
                    map.removeLayer(route);
                }

                route = L.polyline(points, {
                    color: 'red',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '5, 10'
                }).addTo(map);

                // Výpočet přibližné vzdálenosti přímé trasy
                let distance = 0;
                for (let i = 0; i < points.length - 1; i++) {
                    distance += points[i].distanceTo(points[i+1]);
                }

                // Převod na kilometry
                const distanceKm = (distance / 1000).toFixed(2);

                // Výpočet přibližného času cesty (průměrná rychlost 50 km/h)
                const averageSpeedKmh = 50;
                const timeHours = distanceKm / averageSpeedKmh;

                // Převod na hodiny a minuty
                const hours = Math.floor(timeHours);
                const minutes = Math.round((timeHours - hours) * 60);
                const timeString = hours > 0 ?
                    `${hours} h ${minutes} min` :
                    `${minutes} min`;

                // Aktualizace informací o trase v panelu
                routeDistanceElement.textContent = `${distanceKm} km (přímá trasa)`;
                routeTimeElement.textContent = timeString;

                // Přizpůsobení mapy, aby zobrazovala celou trasu
                map.fitBounds(route.getBounds(), {padding: [50, 50]});

                // Uložení stavu aplikace po výpočtu trasy
                saveAppState();
            });
        }
    });
}

// Event listener pro tlačítko výpočtu trasy
document.getElementById('calculateRoute').addEventListener('click', calculateRouteFunction);

// Tlačítko pro vymazání mapy
document.getElementById('clearMap').addEventListener('click', () => {
    // Vymazání všech bodů
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Reset vlastností markerů
    markerProperties = [];

    // Vymazání trasy vytvořené pomocí Leaflet Routing Machine
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }

    // Vymazání záložní trasy (přímá čára), pokud existuje
    if (route) {
        map.removeLayer(route);
        route = null;
    }

    // Reset informací o trase
    routeDistanceElement.textContent = '-';
    routeTimeElement.textContent = '-';

    // Informace pro uživatele
    addMessage('Mapa byla vyčištěna. Všechny body a trasy byly odstraněny.', false);

    // Uložení stavu aplikace po vymazání mapy
    saveAppState();
});

// Tlačítko pro tisk mapy
document.getElementById('printMap').addEventListener('click', () => {
    // Simulace tisku mapy
    addMessage('Připravuji mapu pro tisk...', false);

    setTimeout(() => {
        window.print();
        addMessage('Mapa připravena k tisku', false);
    }, 1000);
});

// Fullscreen režim pro mapu
const fullscreenButton = document.getElementById('fullscreenButton');
const mapWrapper = document.querySelector('.map-wrapper');
const fullscreenOverlay = document.querySelector('.fullscreen-overlay');

// Funkce pro přepnutí fullscreen režimu
function toggleFullscreen() {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
        mapWrapper.classList.add('map-fullscreen');
        fullscreenButton.innerHTML = '<i class="icon">⛵</i>'; // Symbol pro exit fullscreen
        document.body.style.overflow = 'hidden'; // Zabrání scrollování stránky

        // Přidání třídy pro lepší zobrazení mapy
        document.body.classList.add('fullscreen-mode');

        // Přidání tlačítka pro rychlý návrat z fullscreen režimu
        const exitFullscreenButton = document.createElement('button');
        exitFullscreenButton.id = 'exitFullscreenButton';
        exitFullscreenButton.className = 'exit-fullscreen-btn';
        exitFullscreenButton.innerHTML = 'Zavřít celou obrazovku <i class="icon">⛵</i>';
        exitFullscreenButton.addEventListener('click', toggleFullscreen);
        mapWrapper.appendChild(exitFullscreenButton);

        // Přidání ovládacích tlačítek do fullscreen režimu
        const fullscreenControls = document.createElement('div');
        fullscreenControls.id = 'fullscreenControls';
        fullscreenControls.className = 'fullscreen-controls';

        // Tlačítko pro přidání aktivity
        const addActivityFsBtn = document.createElement('button');
        addActivityFsBtn.className = 'fs-btn';
        addActivityFsBtn.innerHTML = '<i class="icon">📍</i> Přidat aktivitu';
        addActivityFsBtn.addEventListener('click', () => {
            isAddingPoints = !isAddingPoints;
            if (isAddingPoints) {
                addActivityFsBtn.classList.add('active');
                addMessage('Režim přidávání bodů je aktivní. Dvojklikněte na mapu pro přidání bodu.', false);
            } else {
                addActivityFsBtn.classList.remove('active');
                addMessage('Režim přidávání bodů byl deaktivován.', false);
            }

            // Synchronizace s hlavním tlačítkem
            const mainAddActivityBtn = document.getElementById('addActivity');
            if (isAddingPoints) {
                mainAddActivityBtn.classList.add('active');
            } else {
                mainAddActivityBtn.classList.remove('active');
            }
        });

        // Tlačítko pro vymazání mapy
        const clearMapFsBtn = document.createElement('button');
        clearMapFsBtn.className = 'fs-btn';
        clearMapFsBtn.innerHTML = '<i class="icon">🗑️</i> Vymazat mapu';
        clearMapFsBtn.addEventListener('click', () => {
            // Vymazání všech bodů
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];

            // Reset vlastností markerů
            markerProperties = [];

            // Vymazání trasy vytvořené pomocí Leaflet Routing Machine
            if (routeControl) {
                map.removeControl(routeControl);
                routeControl = null;
            }

            // Vymazání záložní trasy (přímá čára), pokud existuje
            if (route) {
                map.removeLayer(route);
                route = null;
            }

            // Reset informací o trase
            routeDistanceElement.textContent = '-';
            routeTimeElement.textContent = '-';

            // Informace pro uživatele
            addMessage('Mapa byla vyčištěna. Všechny body a trasy byly odstraněny.', false);

            // Uložení stavu aplikace po vymazání mapy
            saveAppState();
        });

        // Tlačítko pro 3D režim
        const toggle3DFsBtn = document.createElement('button');
        toggle3DFsBtn.className = 'fs-btn';
        toggle3DFsBtn.innerHTML = '<i class="icon">🏘️</i> 3D režim';
        toggle3DFsBtn.addEventListener('click', toggle3DMode);

        // Nastavení aktivního stavu tlačítka pro 3D režim podle aktuálního stavu
        if (is3DMode) {
            toggle3DFsBtn.classList.add('active');
        }

        // Tlačítko pro glóbus režim
        const toggleGlobeFsBtn = document.createElement('button');
        toggleGlobeFsBtn.className = 'fs-btn';
        toggleGlobeFsBtn.innerHTML = '<i class="icon">🌎</i> Glóbus';
        toggleGlobeFsBtn.addEventListener('click', toggleGlobeMode);

        // Nastavení aktivního stavu tlačítka pro glóbus režim podle aktuálního stavu
        if (isGlobeMode) {
            toggleGlobeFsBtn.classList.add('active');
        }

        // Přidání tlačítek do kontejneru
        fullscreenControls.appendChild(addActivityFsBtn);
        fullscreenControls.appendChild(clearMapFsBtn);
        fullscreenControls.appendChild(toggle3DFsBtn);
        fullscreenControls.appendChild(toggleGlobeFsBtn);

        // Přidání kontejneru do mapy
        mapWrapper.appendChild(fullscreenControls);

        // Přidání plovoucího chatu do fullscreen režimu
        createFloatingChat();

        // Zobrazení informace o fullscreen režimu
        addMessage('Mapa je nyní v režimu celé obrazovky. Pro návrat stiskněte klávesu ESC nebo klikněte na tlačítko v pravém horním rohu.', false);

        // Nastavení aktivního stavu tlačítka pro přidávání bodů podle aktuálního stavu
        if (isAddingPoints) {
            addActivityFsBtn.classList.add('active');
        }
    } else {
        mapWrapper.classList.remove('map-fullscreen');
        fullscreenButton.innerHTML = '<i class="icon">⛶</i>'; // Symbol pro fullscreen
        document.body.style.overflow = ''; // Obnovení scrollování

        // Odstranění třídy pro lepší zobrazení mapy
        document.body.classList.remove('fullscreen-mode');

        // Odstranění tlačítka pro rychlý návrat z fullscreen režimu
        const exitFullscreenButton = document.getElementById('exitFullscreenButton');
        if (exitFullscreenButton) {
            exitFullscreenButton.remove();
        }

        // Odstranění ovládacích tlačítek z fullscreen režimu
        const fullscreenControls = document.getElementById('fullscreenControls');
        if (fullscreenControls) {
            fullscreenControls.remove();
        }

        // Odstranění plovoucího chatu
        removeFloatingChat();
    }

    // Aktualizace velikosti mapy po změně režimu
    setTimeout(() => {
        map.invalidateSize();
        if (route) {
            map.fitBounds(route.getBounds(), {padding: [50, 50]});
        }
    }, 300); // Zvýšení času pro lepší přechod
}

// Přidání event listeneru pro tlačítko fullscreen
fullscreenButton.addEventListener('click', toggleFullscreen);

// Přidání event listeneru pro klávesu ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
    }
});

// Přidání event listeneru pro overlay (kliknutí mimo mapu)
fullscreenOverlay.addEventListener('click', () => {
    if (isFullscreen) {
        toggleFullscreen();
    }
});

// Funkce pro vytvoření plovoucího chatu v režimu celé obrazovky
function createFloatingChat() {
    // Získání reference na originální chat
    const originalChatMessages = document.getElementById('chatMessages');

    // Vytvoření kontejneru pro plovoucí chat
    const floatingChatContainer = document.createElement('div');
    floatingChatContainer.id = 'floatingChatContainer';
    floatingChatContainer.className = 'floating-chat-container';

    // Vytvoření hlavičky chatu s možností minimalizace
    const chatHeader = document.createElement('div');
    chatHeader.className = 'floating-chat-header';
    chatHeader.innerHTML = `
        <div class="chat-title">AI Asistent</div>
        <div class="chat-controls">
            <button id="minimizeChat" class="chat-control-btn minimize-btn" title="Minimalizovat chat">−</button>
            <button id="toggleChatPosition" class="chat-control-btn position-btn" title="Přesunout chat">⇅</button>
        </div>
    `;

    // Vytvoření obsahu chatu
    const chatContent = document.createElement('div');
    chatContent.className = 'floating-chat-content';

    // Vytvoření kontejneru pro zprávy
    const chatMessages = document.createElement('div');
    chatMessages.id = 'floatingChatMessages';
    chatMessages.className = 'floating-chat-messages';

    // Zkopírování zpráv z originálního chatu
    chatMessages.innerHTML = originalChatMessages.innerHTML;

    // Vytvoření vstupního pole pro chat
    const chatInputContainer = document.createElement('div');
    chatInputContainer.className = 'floating-chat-input';
    chatInputContainer.innerHTML = `
        <input type="text" id="floatingMessageInput" placeholder="Napište zprávu...">
        <button class="floating-send-btn" id="floatingSendMessage">➞</button>
    `;

    // Přidání všech částí do kontejneru
    chatContent.appendChild(chatMessages);
    chatContent.appendChild(chatInputContainer);

    floatingChatContainer.appendChild(chatHeader);
    floatingChatContainer.appendChild(chatContent);

    // Přidání kontejneru do mapy
    mapWrapper.appendChild(floatingChatContainer);

    // Přidání event listenerů pro ovládací prvky chatu
    document.getElementById('minimizeChat').addEventListener('click', toggleChatMinimize);
    document.getElementById('toggleChatPosition').addEventListener('click', toggleChatPosition);
    document.getElementById('floatingSendMessage').addEventListener('click', sendFloatingChatMessage);
    document.getElementById('floatingMessageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendFloatingChatMessage();
        }
    });

    // Přidání možnosti přesouvat chat
    makeChatDraggable(floatingChatContainer, chatHeader);
}

// Funkce pro odstranění plovoucího chatu
function removeFloatingChat() {
    const floatingChatContainer = document.getElementById('floatingChatContainer');
    if (floatingChatContainer) {
        floatingChatContainer.remove();
    }
}

// Funkce pro přepnutí minimalizace chatu
function toggleChatMinimize() {
    const floatingChatContainer = document.getElementById('floatingChatContainer');
    const chatContent = floatingChatContainer.querySelector('.floating-chat-content');
    const minimizeBtn = document.getElementById('minimizeChat');

    if (chatContent.style.display === 'none') {
        // Maximalzovat chat
        chatContent.style.display = 'flex';
        minimizeBtn.textContent = '−'; // Symbol minus
        floatingChatContainer.classList.remove('minimized');
    } else {
        // Minimalizovat chat
        chatContent.style.display = 'none';
        minimizeBtn.textContent = '+'; // Symbol plus
        floatingChatContainer.classList.add('minimized');
    }
}

// Funkce pro přepnutí pozice chatu (vlevo/vpravo)
function toggleChatPosition() {
    const floatingChatContainer = document.getElementById('floatingChatContainer');

    if (floatingChatContainer.classList.contains('chat-right')) {
        floatingChatContainer.classList.remove('chat-right');
        floatingChatContainer.classList.add('chat-left');
    } else if (floatingChatContainer.classList.contains('chat-left')) {
        floatingChatContainer.classList.remove('chat-left');
        floatingChatContainer.classList.add('chat-right');
    } else {
        // Výchozí pozice je vpravo
        floatingChatContainer.classList.add('chat-right');
    }
}

// Funkce pro zpracování zprávy z chatu
function processMessage(message) {
    // Přidání zprávy uživatele do chatu
    addMessage(message, true);

    // Simulace odpovědi AI
    setTimeout(() => {
        const response = processUserInput(message);
        addMessage(response);
    }, 500);
}

// Funkce pro odeslání zprávy z plovoucího chatu
function sendFloatingChatMessage() {
    const floatingMessageInput = document.getElementById('floatingMessageInput');
    const messageText = floatingMessageInput.value.trim();

    if (messageText) {
        // Použití existující funkce pro zpracování zprávy
        processMessage(messageText);

        // Vyčištění vstupního pole
        floatingMessageInput.value = '';
    }
}

// Funkce pro přidání možnosti přesouvat chat
function makeChatDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        // Získání pozice kurzoru při spuštění
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Volat funkci při pohybu myši
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        // Výpočet nové pozice
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Nastavení nové pozice elementu
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";

        // Odstranění tříd pro pozici, pokud jsou přítomny
        element.classList.remove('chat-left', 'chat-right');
    }

    function closeDragElement() {
        // Zastavení pohybu při uvolnění tlačítka myši
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Funkce pro AI chat
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendMessage');

function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Aktualizace plovoucího chatu, pokud existuje
    updateFloatingChat();
}

// Funkce pro aktualizaci obsahu plovoucího chatu
function updateFloatingChat() {
    const floatingChatMessages = document.getElementById('floatingChatMessages');
    if (floatingChatMessages && isFullscreen) {
        floatingChatMessages.innerHTML = chatMessages.innerHTML;
        floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
    }
}

// Funkce pro přepnutí 3D režimu
function toggle3DMode() {
    const toggle3DBtn = document.getElementById('toggle3DMode');
    is3DMode = !is3DMode;

    if (is3DMode) {
        // Aktivace 3D režimu
        toggle3DBtn.classList.add('active');

        // Přidání třídy pro 3D režim
        document.getElementById('map').classList.add('map-3d-mode');

        // Inicializace OSM Buildings, pokud ještě nebyla vytvořena
        if (!osmb) {
            osmb = new OSMBuildings(map);
            osmb.load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');
        } else {
            // Pokud již existuje, přidáme ji zpět na mapu
            osmb.load('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json');
        }

        // Přidání ovládacích prvků pro 3D režim
        add3DControls();

        // Nastavení výchozího úhlu pohledu
        osmb.setRotation(10); // Mírné natočení
        osmb.setTilt(45); // Mírný sklon

        // Informace pro uživatele
        addMessage('3D režim byl aktivován. Nyní můžete vidět budovy ve 3D. Použijte ovládací prvky pro rotaci a náklon.', false);
    } else {
        // Deaktivace 3D režimu
        toggle3DBtn.classList.remove('active');

        // Odstranění třídy pro 3D režim
        document.getElementById('map').classList.remove('map-3d-mode');

        // Odstranění OSM Buildings z mapy
        if (osmb) {
            osmb.unload();
        }

        // Odstranění ovládacích prvků pro 3D režim
        remove3DControls();

        // Informace pro uživatele
        addMessage('3D režim byl deaktivován. Mapa je nyní v klasickém 2D zobrazení.', false);
    }

    // Aktualizace velikosti mapy po změně režimu
    setTimeout(() => {
        map.invalidateSize();
    }, 300);
}

// Funkce pro přidání ovládacích prvků pro 3D režim
function add3DControls() {
    // Odstranění existujících ovládacích prvků, pokud existují
    remove3DControls();

    // Vytvoření kontejneru pro ovládací prvky
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'map3DControls';
    controlsContainer.className = 'map-3d-controls';

    // Tlačítko pro rotaci doleva
    const rotateLeftBtn = document.createElement('button');
    rotateLeftBtn.className = 'map-3d-control-btn';
    rotateLeftBtn.innerHTML = '↶';
    rotateLeftBtn.title = 'Rotovat doleva';
    rotateLeftBtn.addEventListener('click', () => {
        if (osmb) {
            const currentRotation = osmb.getRotation() || 0;
            osmb.setRotation(currentRotation - 10);
        }
    });

    // Tlačítko pro rotaci doprava
    const rotateRightBtn = document.createElement('button');
    rotateRightBtn.className = 'map-3d-control-btn';
    rotateRightBtn.innerHTML = '↷';
    rotateRightBtn.title = 'Rotovat doprava';
    rotateRightBtn.addEventListener('click', () => {
        if (osmb) {
            const currentRotation = osmb.getRotation() || 0;
            osmb.setRotation(currentRotation + 10);
        }
    });

    // Tlačítko pro zvýšení náklonu
    const tiltUpBtn = document.createElement('button');
    tiltUpBtn.className = 'map-3d-control-btn';
    tiltUpBtn.innerHTML = '↑';
    tiltUpBtn.title = 'Zvýšit náklon';
    tiltUpBtn.addEventListener('click', () => {
        if (osmb) {
            const currentTilt = osmb.getTilt() || 0;
            osmb.setTilt(Math.min(currentTilt + 10, 60)); // Maximum 60 stupňů
        }
    });

    // Tlačítko pro snížení náklonu
    const tiltDownBtn = document.createElement('button');
    tiltDownBtn.className = 'map-3d-control-btn';
    tiltDownBtn.innerHTML = '↓';
    tiltDownBtn.title = 'Snížit náklon';
    tiltDownBtn.addEventListener('click', () => {
        if (osmb) {
            const currentTilt = osmb.getTilt() || 0;
            osmb.setTilt(Math.max(currentTilt - 10, 0)); // Minimum 0 stupňů
        }
    });

    // Tlačítko pro reset pohledu
    const resetViewBtn = document.createElement('button');
    resetViewBtn.className = 'map-3d-control-btn';
    resetViewBtn.innerHTML = '⟲';
    resetViewBtn.title = 'Resetovat pohled';
    resetViewBtn.addEventListener('click', () => {
        if (osmb) {
            osmb.setRotation(0);
            osmb.setTilt(0);
        }
    });

    // Přidání tlačítek do kontejneru
    controlsContainer.appendChild(rotateLeftBtn);
    controlsContainer.appendChild(rotateRightBtn);
    controlsContainer.appendChild(tiltUpBtn);
    controlsContainer.appendChild(tiltDownBtn);
    controlsContainer.appendChild(resetViewBtn);

    // Přidání kontejneru do mapy
    document.getElementById('map').appendChild(controlsContainer);
}

// Funkce pro odstranění ovládacích prvků pro 3D režim
function remove3DControls() {
    const controlsContainer = document.getElementById('map3DControls');
    if (controlsContainer) {
        controlsContainer.remove();
    }
}

// Funkce pro přepnutí glóbus režimu s Globe.GL
function toggleGlobeMode() {
    const toggleGlobeBtn = document.getElementById('toggleGlobeMode');
    const exitGlobeBtn = document.getElementById('exitGlobeMode');

    // Pokud je aktivní 3D režim, nejprve ho deaktivujeme
    if (is3DMode) {
        toggle3DMode();
    }

    isGlobeMode = !isGlobeMode;

    if (isGlobeMode) {
        console.log('Aktivace glóbus režimu s Globe.GL');

        // Aktivace glóbus režimu
        toggleGlobeBtn.classList.add('active');

        // Skrytí tlačítka pro glóbus režim a zobrazení tlačítka pro návrat na mapu
        toggleGlobeBtn.style.display = 'none';
        exitGlobeBtn.style.display = 'flex'; // Použití flex místo block pro lepší zarovnání

        // Zajištění, že tlačítko pro návrat bude vždy nad ostatními prvky
        exitGlobeBtn.style.zIndex = '2000';

        // Přidání třídy pro glóbus režim
        document.getElementById('map').classList.add('map-globe-mode');

        // Uložení aktuálního středu mapy
        const center = map.getCenter();
        console.log('Střed mapy:', center);

        try {
            // Kontrola, zda je Globe.GL dostupný
            if (typeof Globe === 'undefined') {
                console.error('Globe.GL knihovna není dostupná');
                console.log('Dostupné globální objekty:', Object.keys(window));
                // Pokus o načtení Globe.gl z CDN
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/globe.gl';
                script.async = true;
                script.onload = function() {
                    console.log('Globe.gl knihovna byla načtena z CDN');
                    toggleGlobeMode(); // Zkusíme znovu aktivovat glóbus režim
                };
                script.onerror = function() {
                    console.error('Nepodařilo se načíst Globe.gl knihovnu z CDN');
                    addMessage('Nepodařilo se načíst Globe.gl knihovnu. Zkontrolujte připojení k internetu.', true);
                };
                document.head.appendChild(script);
                return;
            }

            // Inicializace jednoduchého glóbusu
            if (typeof initSimpleGlobe === 'function') {
                console.log('Inicializace jednoduchého glóbusu');
                const success = initSimpleGlobe();
                if (!success) {
                    throw new Error('Inicializace jednoduchého glóbusu selhala');
                }
                console.log('Jednoduchý glóbus byl úspěšně inicializován');

                // Zobrazení kontejneru pro glóbus
                const container = document.getElementById('simpleGlobeContainer');
                if (container) {
                    container.style.display = 'block';
                    container.style.width = '100%';
                    container.style.height = '100%';
                    console.log('Kontejner pro glóbus byl zobrazen');

                    // Aktualizace velikosti glóbusu po zobrazení
                    setTimeout(() => {
                        if (typeof window.resizeGlobe === 'function') {
                            window.resizeGlobe();
                            console.log('Velikost glóbusu byla aktualizována');
                        }
                    }, 100);
                }

                // Přidání bodů na glóbus
                if (markers.length > 0 && typeof addPointsToSimpleGlobe === 'function') {
                    addPointsToSimpleGlobe(markers);
                    console.log('Body byly přidány na glóbus');

                    // Přidání tras mezi body
                    if (markers.length > 1 && typeof addArcsToSimpleGlobe === 'function') {
                        addArcsToSimpleGlobe(markers);
                        console.log('Trasy byly přidány na glóbus');
                    }
                }
            } else {
                throw new Error('Funkce initSimpleGlobe není dostupná');
            }

            // Přidání ovládacích prvků pro glóbus
            addGlobeControls();
            console.log('Ovládací prvky byly přidány');

            // Poznámka: Neaktivujeme automaticky fullscreen režim
            // Uživatel si může aktivovat fullscreen režim samostatně

        } catch (error) {
            console.error('Chyba při inicializaci jednoduchého glóbusu:', error);
            addMessage('Nepodařilo se inicializovat glóbus. Chyba: ' + error.message, true);
            isGlobeMode = false;
            toggleGlobeBtn.classList.remove('active');
            document.getElementById('map').classList.remove('map-globe-mode');
            return;
        }

        // Informace pro uživatele
        addMessage('Glóbus režim byl aktivován. Nyní můžete vidět Zemi jako interaktivní kouli. Použijte ovládací prvky pro rotaci a přiblížení.', false);
    } else {
        console.log('Deaktivace glóbus režimu');

        // Deaktivace glóbus režimu
        toggleGlobeBtn.classList.remove('active');

        // Zobrazení tlačítka pro glóbus režim a skrytí tlačítka pro návrat na mapu
        toggleGlobeBtn.style.display = 'block';
        exitGlobeBtn.style.display = 'none';

        // Odstranění třídy pro glóbus režim
        document.getElementById('map').classList.remove('map-globe-mode');

        try {
            // Vyčištění glóbusu
            if (typeof clearSimpleGlobe === 'function') {
                clearSimpleGlobe();
                console.log('Všechny objekty byly odstraněny z glóbusu');
            }

            // Odstranění ovládacích prvků pro glóbus
            removeGlobeControls();

            // Skrytí kontejneru
            const container = document.getElementById('simpleGlobeContainer');
            if (container) {
                container.style.display = 'none';
            }

            // Aktualizace velikosti mapy
            map.invalidateSize();
            console.log('Velikost mapy byla aktualizována');
        } catch (error) {
            console.error('Chyba při deaktivaci glóbus režimu:', error);
        }

        // Informace pro uživatele
        addMessage('Glóbus režim byl deaktivován. Mapa je nyní v klasickém 2D zobrazení.', false);
    }

    // Uložení stavu aplikace
    saveAppState();
}

// Funkce pro přidání markerů na glóbus
function addMarkersToGlobe() {
    if (!cesiumViewer) {
        console.error('Cesium Viewer není inicializován');
        return;
    }

    try {
        console.log('Přidávání markerů na glóbus');

        // Vyčištění všech entit
        cesiumViewer.entities.removeAll();
        globeMarkers = [];

        // Kontrola, zda existují markery k přidání
        if (markers.length === 0) {
            console.log('Nejsou žádné markery k přidání na glóbus');
            return;
        }

        // Přidání markerů z Leaflet mapy na glóbus
        markers.forEach((marker, index) => {
            const position = marker.getLatLng();

            // Získání názvu markeru
            const markerName = markerProperties[index] && markerProperties[index].name ?
                markerProperties[index].name : `Bod ${index + 1}`;

            // Vytvoření entity pro marker
            const globeMarker = cesiumViewer.entities.add({
                name: markerName,
                position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 0),
                billboard: {
                    image: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
                    width: 25,
                    height: 41,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: `${index + 1}`,
                    font: '14pt sans-serif',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -42),
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    showBackground: true,
                    backgroundColor: new Cesium.Color(0, 0, 0, 0.7),
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });

            // Přidání entity do pole markerů
            globeMarkers.push(globeMarker);
        });

        console.log(`Přidáno ${globeMarkers.length} markerů na glóbus`);

        // Pokud existují markery, přiblížíme kameru k prvnímu z nich
        if (markers.length > 0) {
            const firstPosition = markers[0].getLatLng();
            cesiumViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(firstPosition.lng, firstPosition.lat, 500000),
                orientation: {
                    heading: 0.0,
                    pitch: -0.5,
                    roll: 0.0
                },
                duration: 1.5
            });
        }
    } catch (error) {
        console.error('Chyba při přidávání markerů na glóbus:', error);
    }
}

// Funkce pro volání Three.js funkcí
function addMarkersToThreeGlobe() {
    if (typeof window.addMarkersToThreeGlobe === 'function') {
        // Použití funkce z three-globe.js
        window.addMarkersToThreeGlobe();
    } else {
        console.error('Funkce addMarkersToThreeGlobe není dostupná');
    }
}

function addRoutesToThreeGlobe() {
    if (typeof window.addRoutesToThreeGlobe === 'function') {
        // Použití funkce z three-globe.js
        window.addRoutesToThreeGlobe();
    } else {
        console.error('Funkce addRoutesToThreeGlobe není dostupná');
    }
}

// Funkce pro přidání ovládacích prvků pro glóbus
function addGlobeControls() {
    // Odstranění existujících ovládacích prvků, pokud existují
    removeGlobeControls();

    // Vytvoření kontejneru pro ovládací prvky
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'mapGlobeControls';
    controlsContainer.className = 'map-globe-controls';

    // Tlačítko pro zvětšení (zoom in)
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'map-globe-control-btn';
    zoomInBtn.innerHTML = '+';
    zoomInBtn.title = 'Přiblížit';
    zoomInBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            // Získání aktuální pozice kamery
            const cameraPosition = cesiumViewer.camera.position;
            const cameraHeight = Cesium.Cartographic.fromCartesian(cameraPosition).height;

            // Přiblížení kamery (zmenšení výšky)
            cesiumViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromRadians(
                    Cesium.Cartographic.fromCartesian(cameraPosition).longitude,
                    Cesium.Cartographic.fromCartesian(cameraPosition).latitude,
                    cameraHeight * 0.6 // Přiblížení o 40%
                ),
                duration: 0.5
            });
        }
    });

    // Tlačítko pro zmenšení (zoom out)
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'map-globe-control-btn';
    zoomOutBtn.innerHTML = '-';
    zoomOutBtn.title = 'Oddálit';
    zoomOutBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            // Získání aktuální pozice kamery
            const cameraPosition = cesiumViewer.camera.position;
            const cameraHeight = Cesium.Cartographic.fromCartesian(cameraPosition).height;

            // Oddálení kamery (zvětšení výšky)
            cesiumViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromRadians(
                    Cesium.Cartographic.fromCartesian(cameraPosition).longitude,
                    Cesium.Cartographic.fromCartesian(cameraPosition).latitude,
                    cameraHeight * 1.6 // Oddálení o 60%
                ),
                duration: 0.5
            });
        }
    });

    // Tlačítko pro rotaci doleva
    const rotateLeftBtn = document.createElement('button');
    rotateLeftBtn.className = 'map-globe-control-btn';
    rotateLeftBtn.innerHTML = '↶';
    rotateLeftBtn.title = 'Rotovat doleva';
    rotateLeftBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            // Rotace kamery doleva o 15 stupňů
            cesiumViewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(15));
        }
    });

    // Tlačítko pro rotaci doprava
    const rotateRightBtn = document.createElement('button');
    rotateRightBtn.className = 'map-globe-control-btn';
    rotateRightBtn.innerHTML = '↷';
    rotateRightBtn.title = 'Rotovat doprava';
    rotateRightBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            // Rotace kamery doprava o 15 stupňů
            cesiumViewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, Cesium.Math.toRadians(-15));
        }
    });

    // Tlačítko pro náklon nahoru
    const tiltUpBtn = document.createElement('button');
    tiltUpBtn.className = 'map-globe-control-btn';
    tiltUpBtn.innerHTML = '↑';
    tiltUpBtn.title = 'Náklon nahoru';
    tiltUpBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            // Náklon kamery nahoru o 10 stupňů
            cesiumViewer.camera.rotate(cesiumViewer.camera.right, Cesium.Math.toRadians(10));
        }
    });

    // Tlačítko pro náklon dolů
    const tiltDownBtn = document.createElement('button');
    tiltDownBtn.className = 'map-globe-control-btn';
    tiltDownBtn.innerHTML = '↓';
    tiltDownBtn.title = 'Náklon dolů';
    tiltDownBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            // Náklon kamery dolů o 10 stupňů
            cesiumViewer.camera.rotate(cesiumViewer.camera.right, Cesium.Math.toRadians(-10));
        }
    });

    // Tlačítko pro reset pohledu
    const resetViewBtn = document.createElement('button');
    resetViewBtn.className = 'map-globe-control-btn';
    resetViewBtn.innerHTML = '⟲';
    resetViewBtn.title = 'Resetovat pohled';
    resetViewBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            // Získání středu Leaflet mapy
            const center = map.getCenter();

            // Reset pohledu na výchozí pozici
            cesiumViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 1000000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0
                },
                duration: 1.5
            });
        }
    });

    // Přidání tlačítek do kontejneru
    controlsContainer.appendChild(zoomInBtn);
    controlsContainer.appendChild(zoomOutBtn);
    controlsContainer.appendChild(rotateLeftBtn);
    controlsContainer.appendChild(rotateRightBtn);
    controlsContainer.appendChild(tiltUpBtn);
    controlsContainer.appendChild(tiltDownBtn);
    controlsContainer.appendChild(resetViewBtn);

    // Přidání kontejneru do mapy
    document.getElementById('map').appendChild(controlsContainer);
}

// Funkce pro odstranění ovládacích prvků pro glóbus
function removeGlobeControls() {
    const controlsContainer = document.getElementById('mapGlobeControls');
    if (controlsContainer) {
        controlsContainer.remove();
    }
}

// Funkce pro přidání tras mezi body na glóbusu
function addRoutesToGlobe() {
    if (!cesiumViewer) {
        console.error('Cesium Viewer není inicializován');
        return;
    }

    try {
        console.log('Přidávání tras na glóbus');

        // Pokud nemáme alespoň dva body, nemůžeme vytvořit trasu
        if (markers.length < 2) {
            console.log('Není dostatek bodů pro vytvoření trasy');
            return;
        }

        // Vytvoření pole souřadnic pro trasu
        const positions = [];
        markers.forEach(marker => {
            const position = marker.getLatLng();
            positions.push(position.lng, position.lat, 0);
        });

        // Vytvoření entity pro trasu
        const routeEntity = cesiumViewer.entities.add({
            name: 'Trasa',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
                width: 5,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: Cesium.Color.BLUE
                }),
                clampToGround: true
            }
        });

        // Přidání entity do pole markerů
        globeMarkers.push(routeEntity);

        console.log('Trasa byla úspěšně přidána na glóbus');
    } catch (error) {
        console.error('Chyba při přidávání trasy na glóbus:', error);
    }
}

// Funkce pro zpracování uživatelského vstupu
function processUserInput(input) {
    // Jednoduchá simulace AI odpovědí
    const lowercaseInput = input.toLowerCase();

    // Kontrola příkazu "alexa"
    if (lowercaseInput === 'alexa') {
        return showRohatecClub();
    }

    // Kontrola příkazu "oteviracidoba"
    if (lowercaseInput === 'oteviracidoba' || lowercaseInput.includes('otevíraci doba') || lowercaseInput.includes('oteviraci doba')) {
        return showOpeningHours();
    }

    // Kontrola příkazů pro body
    for (let i = 0; i < markerProperties.length; i++) {
        if (markerProperties[i] && lowercaseInput === markerProperties[i].command.toLowerCase()) {
            return navigateToMarker(i);
        }
    }

    // Kontrola příkazů pro smazané body
    for (let i = 0; i < deletedMarkerCommands.length; i++) {
        if (lowercaseInput === deletedMarkerCommands[i].command.toLowerCase()) {
            return navigateToDeletedMarker(i);
        }
    }

    // Kontrola obecných příkazů
    if (lowercaseInput.includes('ahoj') || lowercaseInput.includes('čau') || lowercaseInput.includes('dobrý den')) {
        return 'Dobrý den! Jak vám mohu pomoci s plánováním vašich aktivit?';
    } else if (lowercaseInput.includes('trasa') || lowercaseInput.includes('cesta')) {
        return 'Pro výpočet trasy přidejte alespoň dva body na mapu a klikněte na tlačítko "Vypočítat trasu".';
    } else if (lowercaseInput.includes('aktivita') || lowercaseInput.includes('bod')) {
        return 'Pro přidání aktivity klikněte na tlačítko "Přidat aktivitu" a poté klikněte na místo na mapě.';
    } else if (lowercaseInput.includes('tisk') || lowercaseInput.includes('vytisknout')) {
        return 'Pro tisk mapy klikněte na tlačítko "Vytisknout mapu".';
    } else if (lowercaseInput.includes('vymazat') || lowercaseInput.includes('smazat') || lowercaseInput.includes('reset')) {
        // Vymazání všech bodů a tras
        markers.forEach(marker => map.removeLayer(marker));
        if (route) {
            map.removeLayer(route);
        }

        // Vymazání trasy vytvořené pomocí Leaflet Routing Machine
        if (routeControl) {
            map.removeControl(routeControl);
            routeControl = null;
        }

        markers = [];
        markerProperties = [];
        route = null;

        // Reset informací o trase
        routeDistanceElement.textContent = '-';
        routeTimeElement.textContent = '-';

        // Uložení stavu aplikace po vymazání mapy
        saveAppState();

        return 'Mapa byla vyčištěna.';
    } else if (lowercaseInput.includes('seznam bodů') || lowercaseInput.includes('ukaž body')) {
        if (markers.length === 0) {
            return 'Na mapě nejsou žádné body.';
        }

        let response = 'Seznam bodů na mapě:\n';
        markerProperties.forEach((prop, index) => {
            response += `${index + 1}. ${prop.name} - příkaz: "${prop.command}"\n`;
        });
        return response;
    } else {
        return 'Omlouvám se, nerozumím vašemu požadavku. Můžete se zeptat na přidání aktivit, výpočet trasy nebo tisk mapy.';
    }
}

sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        processMessage(message);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Nastavení aplikace
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeButton = document.querySelector('.close-button');
const saveSettingsButton = document.getElementById('saveSettings');
const cancelSettingsButton = document.getElementById('cancelSettings');
const darkModeToggle = document.getElementById('darkModeToggle');
const colorOptions = document.querySelectorAll('.color-option');
const designSelect = document.getElementById('designSelect');
const apiOptions = document.querySelectorAll('input[name="apiOption"]');
const apiKeyInput = document.getElementById('apiKey');
const showApiKeyButton = document.getElementById('showApiKey');
const saveApiKeyCheckbox = document.getElementById('saveApiKey');

// Otevření modálního okna s nastavením
settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'block';
});

// Zavření modálního okna
closeButton.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Zavření modálního okna kliknutím mimo obsah
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});

// Přepínání barevného schématu
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Odstranění aktivní třídy ze všech možností
        colorOptions.forEach(opt => opt.classList.remove('active'));
        // Přidání aktivní třídy na vybranou možnost
        option.classList.add('active');

        // Změna primární barvy
        const color = option.getAttribute('data-color');
        let colorValue;

        switch(color) {
            case 'blue':
                colorValue = '#8B5CF6';
                break;
            case 'purple':
                colorValue = '#9333EA';
                break;
            case 'green':
                colorValue = '#10B981';
                break;
            case 'orange':
                colorValue = '#F59E0B';
                break;
            default:
                colorValue = '#8B5CF6';
        }

        document.documentElement.style.setProperty('--primary-color', colorValue);

        // Uložení stavu aplikace po změně barevného schématu
        saveAppState();
    });
});

// Přepínání tmavého režimu
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        // Zapnutí tmavého režimu
        document.documentElement.style.setProperty('--dark-bg', '#1a1b26');
        document.documentElement.style.setProperty('--card-bg', '#1F2937');
        document.documentElement.style.setProperty('--text-color', '#fff');
        document.body.setAttribute('data-theme', 'dark');
    } else {
        // Vypnutí tmavého režimu
        document.documentElement.style.setProperty('--dark-bg', '#f3f4f6');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#1F2937');
        document.body.removeAttribute('data-theme');
    }

    // Aktualizace mapy po změně režimu
    setTimeout(() => {
        map.invalidateSize();

        // Uložení stavu aplikace po změně tmavého režimu
        saveAppState();
    }, 100);
});

// Zobrazení/skrytí API klíče
showApiKeyButton.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        showApiKeyButton.textContent = 'Skrýt';
    } else {
        apiKeyInput.type = 'password';
        showApiKeyButton.textContent = 'Zobrazit';
    }
});

// Uložení nastavení
saveSettingsButton.addEventListener('click', () => {
    // Uložení stavu aplikace včetně nastavení
    const saved = saveAppState();

    // Přidání zprávy do chatu o uložení nastavení
    if (saved) {
        addMessage('Nastavení byla úspěšně uložena.');
    } else {
        addMessage('Při ukládání nastavení došlo k chybě. Zkuste to prosím znovu.');
    }

    // Zavření modálního okna
    settingsModal.style.display = 'none';
});

// Zrušení nastavení
cancelSettingsButton.addEventListener('click', () => {
    // Zde by bylo obnovení původních nastavení

    // Zavření modálního okna
    settingsModal.style.display = 'none';
});

// Funkce pro uložení stavu aplikace do localStorage
function saveAppState() {
    // Uložení markerů a jejich vlastností
    const markersData = [];
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const props = markerProperties[i] || { name: `Bod ${i + 1}`, command: `bod${i + 1}` };
        markersData.push({
            lat: marker.getLatLng().lat,
            lng: marker.getLatLng().lng,
            properties: props
        });
    }

    // Uložení nastavení aplikace
    const settings = {
        darkMode: document.getElementById('darkModeToggle').checked,
        colorScheme: document.querySelector('.color-option.active')?.getAttribute('data-color') || 'blue',
        markerStyle: markerStyle,
        markerEffectsEnabled: markerEffectsEnabled
    };

    // Uložení stavu mapy
    const mapState = {
        center: {
            lat: map.getCenter().lat,
            lng: map.getCenter().lng
        },
        zoom: map.getZoom()
    };

    // Vytvoření objektu s kompletním stavem aplikace
    const appState = {
        markers: markersData,
        settings: settings,
        mapState: mapState,
        deletedMarkerCommands: deletedMarkerCommands,
        lastSaved: new Date().toISOString(),
        version: '0.2.4.2' // Přidání verze pro lepší správu kompatibility
    };

    // Uložení do localStorage s kompresí pro úsporu místa
    try {
        // Rozdělení dat na menší části, pokud jsou příliš velká
        const jsonString = JSON.stringify(appState);

        // Kontrola velikosti dat
        if (jsonString.length > 4000000) { // Pokud je velikost větší než 4MB
            console.warn('Data jsou příliš velká pro localStorage, bude provedena optimalizace.');

            // Optimalizace dat - omezení počtu markerů
            if (markersData.length > 100) {
                appState.markers = markersData.slice(0, 100);
                console.warn(`Počet markerů byl omezen na 100 z původních ${markersData.length}.`);
            }

            // Pokud jsou data stále příliš velká, zkusíme je rozdělit
            const optimizedJsonString = JSON.stringify(appState);
            if (optimizedJsonString.length > 5000000) {
                // Rozdělení dat na části
                const chunkSize = 1000000; // 1MB na část
                const chunks = [];

                for (let i = 0; i < optimizedJsonString.length; i += chunkSize) {
                    chunks.push(optimizedJsonString.slice(i, i + chunkSize));
                }

                // Uložení počtu částí
                localStorage.setItem('aiMapAppState_chunks', chunks.length.toString());

                // Uložení jednotlivých částí
                chunks.forEach((chunk, index) => {
                    localStorage.setItem(`aiMapAppState_chunk_${index}`, chunk);
                });

                console.log(`Stav aplikace byl rozdělen na ${chunks.length} částí a úspěšně uložen.`);
            } else {
                localStorage.setItem('aiMapAppState', optimizedJsonString);
                localStorage.removeItem('aiMapAppState_chunks'); // Odstranění předchozího rozdělení, pokud existovalo
                console.log('Optimalizovaný stav aplikace byl úspěšně uložen.');
            }
        } else {
            localStorage.setItem('aiMapAppState', jsonString);
            localStorage.removeItem('aiMapAppState_chunks'); // Odstranění předchozího rozdělení, pokud existovalo
            console.log('Stav aplikace byl úspěšně uložen.');
        }

        return true;
    } catch (error) {
        console.error('Chyba při ukládání stavu aplikace:', error);

        // Pokus o záchranu - uložení pouze základních dat
        try {
            const minimalState = {
                mapState: mapState,
                settings: settings,
                version: '0.2.4.2',
                lastSaved: new Date().toISOString(),
                error: 'Kompletní data nemohla být uložena kvůli překročení limitu localStorage.'
            };

            localStorage.setItem('aiMapAppState_minimal', JSON.stringify(minimalState));
            console.log('Uložena minimální verze stavu aplikace.');

            // Informace pro uživatele
            addMessage('Nepodařilo se uložit všechna data aplikace. Některá data mohou být ztracena.', false);

            return false;
        } catch (backupError) {
            console.error('Selhal i záložní pokus o uložení:', backupError);
            return false;
        }
    }
}

// Funkce pro načtení stavu aplikace z localStorage
function loadAppState() {
    try {
        // Nejprve zkontrolujeme, zda existuje rozdělený stav
        const chunksCount = localStorage.getItem('aiMapAppState_chunks');
        let savedStateJson = null;

        if (chunksCount) {
            // Načtení rozděleného stavu
            console.log(`Načítám stav aplikace rozdělený na ${chunksCount} částí.`);

            try {
                // Spojení všech částí
                let combinedState = '';
                for (let i = 0; i < parseInt(chunksCount); i++) {
                    const chunk = localStorage.getItem(`aiMapAppState_chunk_${i}`);
                    if (chunk) {
                        combinedState += chunk;
                    } else {
                        throw new Error(`Chybí část ${i} stavu aplikace.`);
                    }
                }

                savedStateJson = combinedState;
                console.log('Stav aplikace byl úspěšně sestaven z částí.');
            } catch (chunkError) {
                console.error('Chyba při načítání rozděleného stavu:', chunkError);

                // Pokus o načtení běžného stavu jako zálohy
                savedStateJson = localStorage.getItem('aiMapAppState');
                if (!savedStateJson) {
                    // Pokus o načtení minimálního stavu jako zálohy
                    const minimalState = localStorage.getItem('aiMapAppState_minimal');
                    if (minimalState) {
                        console.log('Načítám minimální stav aplikace jako zálohu.');
                        savedStateJson = minimalState;
                    } else {
                        console.log('Nenalezen žádný uložený stav aplikace.');
                        return false;
                    }
                }
            }
        } else {
            // Načtení běžného stavu
            savedStateJson = localStorage.getItem('aiMapAppState');

            if (!savedStateJson) {
                // Pokus o načtení minimálního stavu jako zálohy
                const minimalState = localStorage.getItem('aiMapAppState_minimal');
                if (minimalState) {
                    console.log('Načítám minimální stav aplikace.');
                    savedStateJson = minimalState;
                } else {
                    console.log('Nenalezen žádný uložený stav aplikace.');
                    return false;
                }
            }
        }

        // Parsování JSON
        const appState = JSON.parse(savedStateJson);
        console.log('Načten stav aplikace:', appState);

        // Kontrola verze pro zajištění kompatibility
        if (appState.version && appState.version !== '0.2.4.2') {
            console.log(`Načten stav z jiné verze aplikace (${appState.version}). Probíhá konverze...`);
            // Zde by mohla být logika pro konverzi dat mezi verzemi, pokud by bylo potřeba
        }

        // Kontrola, zda se jedná o minimální stav
        if (appState.error) {
            console.warn('Načten minimální stav aplikace s chybou:', appState.error);
            addMessage('Některá data aplikace nemohla být načtena. Některé body mohou chybět.', false);
        }

        // Načtení nastavení aplikace
        if (appState.settings) {
            // Nastavení tmavého režimu
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (darkModeToggle) {
                darkModeToggle.checked = appState.settings.darkMode;
                // Aplikace nastavení tmavého režimu
                if (appState.settings.darkMode) {
                    document.documentElement.style.setProperty('--dark-bg', '#1a1b26');
                    document.documentElement.style.setProperty('--card-bg', '#1F2937');
                    document.documentElement.style.setProperty('--text-color', '#fff');
                    document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.style.setProperty('--dark-bg', '#f3f4f6');
                    document.documentElement.style.setProperty('--card-bg', '#ffffff');
                    document.documentElement.style.setProperty('--text-color', '#1F2937');
                    document.body.removeAttribute('data-theme');
                }
            }

            // Nastavení barevného schématu
            if (appState.settings.colorScheme) {
                const colorOptions = document.querySelectorAll('.color-option');
                colorOptions.forEach(option => {
                    option.classList.remove('active');
                    if (option.getAttribute('data-color') === appState.settings.colorScheme) {
                        option.classList.add('active');
                        // Aplikace barevného schématu
                        let colorValue;
                        switch(appState.settings.colorScheme) {
                            case 'blue':
                                colorValue = '#8B5CF6';
                                break;
                            case 'purple':
                                colorValue = '#9333EA';
                                break;
                            case 'green':
                                colorValue = '#10B981';
                                break;
                            case 'orange':
                                colorValue = '#F59E0B';
                                break;
                            default:
                                colorValue = '#8B5CF6';
                        }
                        document.documentElement.style.setProperty('--primary-color', colorValue);
                    }
                });
            }



            // Nastavení stylu markerů
            if (appState.settings.markerStyle) {
                markerStyle = appState.settings.markerStyle;

                // Aktualizace aktivního stylu v UI
                const markerStyleOptions = document.querySelectorAll('.marker-style-option');
                markerStyleOptions.forEach(option => {
                    option.classList.remove('active');
                    if (option.getAttribute('data-marker-style') === markerStyle) {
                        option.classList.add('active');
                    }
                });
            }

            // Nastavení efektů markerů
            if (appState.settings.markerEffectsEnabled !== undefined) {
                markerEffectsEnabled = appState.settings.markerEffectsEnabled;

                // Aktualizace přepínače v UI
                const markerEffectsToggle = document.getElementById('markerEffectsToggle');
                if (markerEffectsToggle) {
                    markerEffectsToggle.checked = markerEffectsEnabled;
                }
            }
        }

        // Načtení stavu mapy
        if (appState.mapState) {
            try {
                // Validace souřadnic
                const lat = parseFloat(appState.mapState.center.lat);
                const lng = parseFloat(appState.mapState.center.lng);
                const zoom = parseFloat(appState.mapState.zoom);

                if (isNaN(lat) || isNaN(lng) || isNaN(zoom) ||
                    lat < -90 || lat > 90 || lng < -180 || lng > 180 ||
                    zoom < 1 || zoom > 20) {
                    console.warn('Neplatné souřadnice nebo zoom, použiji výchozí hodnoty.');
                    map.setView([49.8175, 15.4730], 7); // Výchozí pohled na ČR
                } else {
                    map.setView([lat, lng], zoom);
                }
            } catch (mapError) {
                console.error('Chyba při nastavení pohledu mapy:', mapError);
                map.setView([49.8175, 15.4730], 7); // Výchozí pohled na ČR
            }
        }

        // Načtení smazaných příkazů
        if (appState.deletedMarkerCommands && Array.isArray(appState.deletedMarkerCommands)) {
            try {
                // Validace smazaných příkazů
                const validCommands = appState.deletedMarkerCommands.filter(cmd => {
                    // Kontrola, zda má všechny potřebné vlastnosti
                    return cmd && cmd.name && cmd.command &&
                           typeof cmd.lat === 'number' && !isNaN(cmd.lat) &&
                           typeof cmd.lng === 'number' && !isNaN(cmd.lng) &&
                           cmd.lat >= -90 && cmd.lat <= 90 &&
                           cmd.lng >= -180 && cmd.lng <= 180;
                });

                deletedMarkerCommands = validCommands;
                console.log('Načteno ' + deletedMarkerCommands.length + ' smazaných příkazů.');

                if (validCommands.length < appState.deletedMarkerCommands.length) {
                    console.warn(`${appState.deletedMarkerCommands.length - validCommands.length} neplatných smazaných příkazů bylo ignorováno.`);
                }
            } catch (commandsError) {
                console.error('Chyba při načítání smazaných příkazů:', commandsError);
                deletedMarkerCommands = [];
            }
        }

        // Načtení markerů
        if (appState.markers && Array.isArray(appState.markers) && appState.markers.length > 0) {
            // Odstranění všech stávajících markerů
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            markerProperties = [];

            // Přidání uložených markerů s validací
            let validMarkersCount = 0;
            let invalidMarkersCount = 0;

            appState.markers.forEach(markerData => {
                try {
                    // Validace dat markeru
                    if (!markerData.lat || !markerData.lng ||
                        isNaN(parseFloat(markerData.lat)) || isNaN(parseFloat(markerData.lng)) ||
                        parseFloat(markerData.lat) < -90 || parseFloat(markerData.lat) > 90 ||
                        parseFloat(markerData.lng) < -180 || parseFloat(markerData.lng) > 180) {
                        console.warn('Neplatné souřadnice markeru:', markerData);
                        invalidMarkersCount++;
                        return; // Přeskočení neplatného markeru
                    }

                    const markerIndex = markers.length;

                    // Vytvoření vlastního markeru s číslem
                    const customIcon = createCustomMarkerIcon(markerIndex + 1, markerIndex);

                    const marker = L.marker([markerData.lat, markerData.lng], {
                        draggable: true,
                        title: markerData.properties?.name || `Bod ${markerIndex + 1}`,
                        icon: customIcon // Použití vlastního ikony
                    }).addTo(map);

                    markers.push(marker);

                    // Validace vlastností markeru
                    if (!markerData.properties) {
                        markerData.properties = { name: `Bod ${markerIndex + 1}`, command: `bod${markerIndex + 1}` };
                    } else {
                        // Kontrola povinných vlastností
                        if (!markerData.properties.name) {
                            markerData.properties.name = `Bod ${markerIndex + 1}`;
                        }
                        if (!markerData.properties.command) {
                            markerData.properties.command = `bod${markerIndex + 1}`;
                        }
                    }

                    markerProperties[markerIndex] = markerData.properties;

                    // Nastavení příznaku saved na true pro načtené body (pro zpětnou kompatibilitu)
                    if (markerProperties[markerIndex].saved === undefined) {
                        markerProperties[markerIndex].saved = true;
                    }

                    // Přidání popup s formulářem
                    marker.bindPopup(createPopupContent(marker, markerIndex), {
                        className: 'marker-popup',
                        maxWidth: 350,
                        minWidth: 250,
                        autoPan: true,
                        autoPanPadding: [50, 50],
                        closeOnClick: false,
                        autoClose: false
                    });

                    // Přidání event listenerů pro marker
                    setupMarkerEventListeners(marker, markerIndex);

                    validMarkersCount++;
                } catch (markerError) {
                    console.error('Chyba při vytváření markeru:', markerError, markerData);
                    invalidMarkersCount++;
                }
            });

            // Pokud máme alespoň dva body, vypočítáme trasu
            if (markers.length >= 2) {
                calculateRouteFunction();
            }

            // Informace pro uživatele
            if (invalidMarkersCount > 0) {
                addMessage(`Načteno ${validMarkersCount} bodů z předchozího sezení. ${invalidMarkersCount} bodů nebylo možné načíst kvůli chybě.`, false);
            } else {
                addMessage(`Načteno ${validMarkersCount} bodů z předchozího sezení.`, false);
            }
        }

        return true;
    } catch (error) {
        console.error('Chyba při načítání stavu aplikace:', error);

        // Pokus o obnovení základního stavu
        try {
            // Nastavení výchozího pohledu mapy
            map.setView([49.8175, 15.4730], 7);

            // Odstranění všech markerů
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            markerProperties = [];

            addMessage('Došlo k chybě při načítání stavu aplikace. Aplikace byla resetována do výchozího stavu.', false);
        } catch (recoveryError) {
            console.error('Chyba při obnově základního stavu:', recoveryError);
        }

        return false;
    }
}

// Funkce pro nastavení event listenerů pro marker
function setupMarkerEventListeners(marker, markerIndex) {
    // Přidání event listeneru pro přesunutí markeru
    marker.on('dragend', function() {
        const newPos = marker.getLatLng();

        // Aktualizace souřadnic v properties
        if (markerProperties[markerIndex]) {
            markerProperties[markerIndex].lat = newPos.lat.toFixed(4);
            markerProperties[markerIndex].lng = newPos.lng.toFixed(4);
        }

        // Aktualizace popup obsahu
        marker.setPopupContent(createPopupContent(marker, markerIndex));

        // Pokud máme alespoň dva body, přepočítáme trasu
        if (markers.length >= 2) {
            calculateRouteFunction();
        }

        // Aktualizace glóbusu, pokud je aktivní
        if (isGlobeMode && cesiumViewer) {
            addMarkersToGlobe();
            addRoutesToGlobe();
        }

        // Uložení stavu aplikace po přesunutí markeru
        saveAppState();
    });

    // Přidání event listeneru pro kliknutí na marker
    marker.on('click', function() {
        // Zrušení předchozího časovače, pokud existuje
        if (popupTimers[markerIndex]) {
            clearTimeout(popupTimers[markerIndex]);
        }

        // Nastavení nového časovače
        popupTimers[markerIndex] = setTimeout(() => {
            if (marker.isPopupOpen()) {
                marker.closePopup();
            }
            delete popupTimers[markerIndex];
        }, 35000); // 35 sekund
    });

    // Přidání event listeneru pro otevření popup okna
    marker.on('popupopen', function() {
        // Zrušení všech předchozích intervalů pro odpočet
        Object.keys(countdownIntervals).forEach(key => {
            if (key.startsWith(`countdown-${markerIndex}-`)) {
                clearInterval(countdownIntervals[key]);
                delete countdownIntervals[key];
            }
        });

        // Spuštění odpočtu
        const countdownId = `countdown-${markerIndex}-${Date.now()}`;
        const countdownElement = document.getElementById(countdownId);
        if (countdownElement) {
            startCountdown(countdownId, 35);
        }
    });

    // Přidání event listeneru pro zavření popup okna
    marker.on('popupclose', function() {
        // Zrušení časovače při manuálním zavření popup okna
        if (popupTimers[markerIndex]) {
            clearTimeout(popupTimers[markerIndex]);
            delete popupTimers[markerIndex];
        }

        // Zrušení všech intervalů pro odpočet
        Object.keys(countdownIntervals).forEach(key => {
            if (key.startsWith(`countdown-${markerIndex}-`)) {
                clearInterval(countdownIntervals[key]);
                delete countdownIntervals[key];
            }
        });
    });
}

// Event listenery pro nastavení markerů
function setupMarkerStyleOptions() {
    // Získání všech možností stylů markerů
    const markerStyleOptions = document.querySelectorAll('.marker-style-option');

    // Přidání event listenerů pro každou možnost
    markerStyleOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Odstranění aktivní třídy ze všech možností
            markerStyleOptions.forEach(opt => opt.classList.remove('active'));

            // Přidání aktivní třídy na vybranou možnost
            option.classList.add('active');

            // Získání vybraného stylu
            const selectedStyle = option.getAttribute('data-marker-style');

            // Aktualizace globálního nastavení
            markerStyle = selectedStyle;

            // Aktualizace všech existujících markerů
            updateAllMarkers();

            // Uložení stavu aplikace
            saveAppState();

            // Informace pro uživatele
            addMessage(`Styl bodů na mapě byl změněn na "${selectedStyle}".`, false);
        });
    });

    // Přidání event listeneru pro přepínač efektů
    const markerEffectsToggle = document.getElementById('markerEffectsToggle');
    if (markerEffectsToggle) {
        markerEffectsToggle.addEventListener('change', () => {
            // Aktualizace globálního nastavení
            markerEffectsEnabled = markerEffectsToggle.checked;

            // Aktualizace všech existujících markerů
            updateAllMarkers();

            // Uložení stavu aplikace
            saveAppState();

            // Informace pro uživatele
            const message = markerEffectsEnabled ?
                'Efekty bodů na mapě byly zapnuty.' :
                'Efekty bodů na mapě byly vypnuty.';
            addMessage(message, false);
        });
    }
}

// Funkce pro aktualizaci všech markerů na mapě
function updateAllMarkers() {
    markers.forEach((marker, index) => {
        // Vytvoření nového ikony s aktuálním stylem
        const newIcon = createCustomMarkerIcon(index + 1, index);

        // Aktualizace ikony markeru
        marker.setIcon(newIcon);
    });
}

// Inicializace chatu
window.addEventListener('load', () => {
    // Vyčištění předem definovaných zpráv
    chatMessages.innerHTML = '';

    // Přidání uvítací zprávy
    addMessage('Vítejte v AI Map - Časovém Manažeru! Můžete přidávat aktivity na mapu, vypočítat trasu mezi nimi a vytisknout mapu. Jak vám mohu pomoci?');

    // Pokus o načtení stavu aplikace
    const stateLoaded = loadAppState();

    if (!stateLoaded) {
        // Pokud se nepodařilo načíst stav, aktivujeme režim přidávání bodů
        document.getElementById('addActivity').classList.add('active');
        addMessage('Režim přidávání bodů je aktivní. Klikněte na mapu pro přidání bodu.', false);
    } else {
        // Pokud se podařilo načíst stav, informujeme uživatele
        addMessage('Stav aplikace byl úspěšně načten z předchozího sezení.', false);
    }

    // Nastavení výchozího data pro rezervaci tanečnice
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('dancerReservationDate').value = tomorrow.toISOString().split('T')[0];

    // Event listenery pro modální okno rezervace tanečnice
    setupDancerReservationModal();

    // Nastavení event listenerů pro styly markerů
    setupMarkerStyleOptions();

    // Přidání event listeneru pro tlačítko glóbus režimu
    const toggleGlobeBtn = document.getElementById('toggleGlobeMode');
    if (toggleGlobeBtn) {
        toggleGlobeBtn.addEventListener('click', toggleGlobeMode);
    }

    // Přidání event listeneru pro tlačítko návratu z glóbus režimu
    const exitGlobeBtn = document.getElementById('exitGlobeMode');
    if (exitGlobeBtn) {
        exitGlobeBtn.addEventListener('click', toggleGlobeMode);
    }

    // Nastavení automatického ukládání stavu aplikace při změnách
    map.on('moveend', saveAppState); // Ukládání při posunu mapy
    map.on('zoomend', saveAppState); // Ukládání při změně zoomu
});

// Nastavení event listenerů pro modální okno rezervace tanečnice
function setupDancerReservationModal() {
    const dancerReservationModal = document.getElementById('dancerReservationModal');
    const dancerCloseButton = document.querySelector('.dancer-close-button');
    const confirmDancerReservationButton = document.getElementById('confirmDancerReservation');
    const cancelDancerReservationButton = document.getElementById('cancelDancerReservation');
    const dancerCards = document.querySelectorAll('.dancer-card');

    // Zavření modálního okna kliknutím na křížek
    dancerCloseButton.addEventListener('click', () => {
        dancerReservationModal.style.display = 'none';
    });

    // Zavření modálního okna kliknutím mimo obsah
    window.addEventListener('click', (e) => {
        if (e.target === dancerReservationModal) {
            dancerReservationModal.style.display = 'none';
        }
    });

    // Potvrzení rezervace
    confirmDancerReservationButton.addEventListener('click', () => {
        processDancerReservation();
    });

    // Zrušení rezervace
    cancelDancerReservationButton.addEventListener('click', () => {
        dancerReservationModal.style.display = 'none';
    });

    // Výběr tanečnice
    dancerCards.forEach(card => {
        card.addEventListener('click', () => {
            // Odstranění aktivní třídy ze všech karet
            dancerCards.forEach(c => c.classList.remove('selected'));
            // Přidání aktivní třídy na vybranou kartu
            card.classList.add('selected');
        });
    });

    // Výchozí výběr první tanečnice
    if (dancerCards.length > 0) {
        dancerCards[0].classList.add('selected');
    }
};

// Funkce pro navigaci na bod
function navigateToMarker(index) {
    if (index < markers.length) {
        const marker = markers[index];
        const markerName = markerProperties[index]?.name || `Bod ${index + 1}`;
        const markerLocation = marker.getLatLng();

        // Přiblížení mapy na bod s offsetem, aby popup nebyl přímo ve středu
        const offsetPoint = map.project(markerLocation).add([100, 0]);  // Offset doprava
        const offsetLatLng = map.unproject(offsetPoint);

        map.setView(offsetLatLng, 15, {
            animate: true,
            duration: 1
        });

        // Počkáme na dokončení animace a pak otevřeme popup
        setTimeout(() => {
            // Zrušení všech předchozích intervalů pro odpočet
            Object.keys(countdownIntervals).forEach(key => {
                clearInterval(countdownIntervals[key]);
                delete countdownIntervals[key];
            });

            // Otevření popup okna
            marker.openPopup();

            // Zrušení předchozího časovače, pokud existuje
            if (popupTimers[index]) {
                clearTimeout(popupTimers[index]);
            }

            // Odpočet se spustí automaticky při otevření popup okna díky event listeneru 'popupopen'
        }, 500);

        return `Navigace na bod "${markerName}".`;
    }
    return 'Bod nebyl nalezen.';
}

// Funkce pro navigaci na smazaný bod
function navigateToDeletedMarker(index) {
    if (index < deletedMarkerCommands.length) {
        const deletedMarker = deletedMarkerCommands[index];
        const markerName = deletedMarker.name;
        const markerLocation = L.latLng(deletedMarker.lat, deletedMarker.lng);

        // Vytvoření speciálního markeru pro smazaný bod s pokročilými efekty
        const tempIcon = L.divIcon({
            className: 'custom-marker-container',
            html: `
                <div class="custom-marker color-4" style="position: relative;">
                    <span style="font-size: 18px;">?</span>
                    <div class="marker-ring" style="
                        position: absolute;
                        top: -5px;
                        left: -5px;
                        right: -5px;
                        bottom: -5px;
                        border: 2px dashed rgba(255, 255, 255, 0.8);
                        border-radius: 50%;
                        animation: rotate 10s linear infinite;
                    "></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const tempMarker = L.marker(markerLocation, {
            icon: tempIcon
        }).addTo(map);

        // Přidání pokročilých efektů pro zvýraznění smazaného bodu
        setTimeout(() => {
            const markerElement = tempMarker.getElement().querySelector('.custom-marker');
            if (markerElement) {
                // Přidání speciálních efektů pro smazaný bod
                markerElement.style.animation = 'pulse 1.5s infinite, float 3s ease-in-out infinite';
                markerElement.style.backgroundColor = '#EF4444'; // Červená barva pro smazaný bod
                markerElement.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.4)';

                // Přidání efektu záblesku při zobrazení
                const flash = document.createElement('div');
                flash.style.position = 'absolute';
                flash.style.top = '0';
                flash.style.left = '0';
                flash.style.right = '0';
                flash.style.bottom = '0';
                flash.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                flash.style.borderRadius = '50%';
                flash.style.opacity = '0.8';
                flash.style.zIndex = '1';
                flash.style.pointerEvents = 'none';
                markerElement.appendChild(flash);

                // Animace záblesku
                setTimeout(() => {
                    flash.style.opacity = '0';
                    flash.style.transition = 'opacity 0.8s ease';
                }, 50);

                // Odstranění záblesku po dokončení animace
                setTimeout(() => {
                    if (markerElement.contains(flash)) {
                        markerElement.removeChild(flash);
                    }
                }, 850);
            }

            // Přidání CSS animace pro rotaci
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleElement);
        }, 100);

        // Přiblížení mapy na bod
        map.setView(markerLocation, 15, {
            animate: true,
            duration: 1
        });

        // Vytvoření popup obsahu
        const popupContent = `
            <div class="temp-marker-popup">
                <h3>${markerName}</h3>
                <p>Tento bod byl smazán, ale příkaz "${deletedMarker.command}" zůstává aktivní.</p>
                <p>Souřadnice: [${deletedMarker.lat}, ${deletedMarker.lng}]</p>
                <div class="popup-actions">
                    <button class="popup-btn" onclick="recreateMarker(${index})">Obnovit bod</button>
                </div>
            </div>
        `;

        // Přidání popup k dočasnému markeru
        tempMarker.bindPopup(popupContent, {
            className: 'temp-marker-popup',
            maxWidth: 300,
            minWidth: 250
        }).openPopup();

        // Odstranění dočasného markeru po 35 sekundách
        setTimeout(() => {
            if (map.hasLayer(tempMarker)) {
                map.removeLayer(tempMarker);
            }
        }, 35000);

        return `Navigace na původní pozici bodu "${markerName}".`;
    }
    return 'Smazaný bod nebyl nalezen.';
}

// Funkce pro obnovení smazaného bodu
function recreateMarker(index) {
    if (index < deletedMarkerCommands.length) {
        const deletedMarker = deletedMarkerCommands[index];
        const markerLocation = L.latLng(deletedMarker.lat, deletedMarker.lng);

        // Vytvoření nového markeru na původní pozici
        const newMarker = addMarkerToMap(markerLocation);
        const newMarkerIndex = markers.length - 1;

        // Nastavení původních vlastností
        markerProperties[newMarkerIndex] = {
            name: deletedMarker.name,
            command: deletedMarker.command,
            lat: deletedMarker.lat,
            lng: deletedMarker.lng,
            saved: true // Nastavení příznaku, že bod byl uložen
        };

        // Aktualizace popup obsahu
        newMarker.setPopupContent(createPopupContent(newMarker, newMarkerIndex));

        // Odstranění záznamu ze smazaných příkazů
        deletedMarkerCommands.splice(index, 1);

        // Informace pro uživatele
        addMessage(`Bod "${deletedMarker.name}" byl obnoven.`, false);

        // Uložení stavu aplikace po obnovení bodu
        saveAppState();

        // Zavření všech popup oken
        map.closePopup();

        // Otevření popup nového markeru
        setTimeout(() => {
            newMarker.openPopup();
        }, 300);
    }
}

// Funkce pro zobrazení nočního klubu v Rohatci
function showRohatecClub() {
    // Přesné souřadnice nočního klubu Alexa v Rohatci (ulice Na Kopci 1055/54)
    const rohatecLocation = L.latLng(48.8871713, 17.1931988);

    // Vytvoření markeru pro klub
    const clubMarker = L.marker(rohatecLocation, {
        icon: L.divIcon({
            className: 'club-marker',
            html: `<div class="place-icon club"><i class="icon">🕺</i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);

    // Vytvoření unikátního ID pro popup
    const popupId = `club-popup-${Date.now()}`;

    // Vytvoření popup obsahu s informacemi o klubu - stručnější verze
    const popupContent = `
        <div class="popup-content place-popup" id="${popupId}">
            <div class="popup-header">
                <div class="popup-title">Klub Alexa</div>
                <div class="club-badge">VIP</div>
                <div class="custom-close-button" onclick="map.closePopup()">×</div>
            </div>
            <div class="club-image-container">
                <img src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600&auto=format&fit=crop" alt="Klub Alexa" class="club-image" loading="lazy">
            </div>
            <div class="place-info">
                <div class="info-row">
                    <div class="info-icon">⭐</div>
                    <div class="info-content"><strong>Hodnocení:</strong> <span class="rating-value">4.9</span></div>
                </div>
                <div class="info-row">
                    <div class="info-icon">🕒</div>
                    <div class="info-content"><strong>Otevřeno:</strong> <span class="opening-hours">20:00-05:00</span></div>
                </div>
                <div class="info-row">
                    <div class="info-icon">📍</div>
                    <div class="info-content"><strong>Adresa:</strong> <span class="address">Na Kopci 1055, Rohatec</span></div>
                </div>
            </div>
            <div class="popup-actions club-actions">
                <button class="popup-btn reserve-dancer-btn" onclick="showDancerReservationModal()">Rezervovat</button>
            </div>
        </div>
    `;

    // Vytvoření popup okna přímo na markeru
    clubMarker.bindPopup(popupContent, {
        autoPan: true, // Zapneme autoPan, aby se mapa posouvala při otevření popup
        keepInView: true,
        className: 'club-popup',
        closeButton: false, // Vypneme standardní tlačítko pro zavření, použijeme vlastní
        closeOnClick: false,
        autoClose: false,
        maxWidth: 280,
        minWidth: 280
    });

    // Přiblížení mapy na oblast kolem klubu a vycentrování popup okna uprostřed mapy
    // Vytvoření offsetu pro lepší vycentrování popup okna
    const offsetPoint = map.project(rohatecLocation).subtract([0, 100]);  // Offset nahoru pro lepší vycentrování
    const offsetLatLng = map.unproject(offsetPoint);

    map.setView(offsetLatLng, 14, {
        animate: true,
        duration: 1
    });

    // Počkáme na dokončení animace a pak otevřeme popup
    setTimeout(() => {
        // Otevřeme popup
        clubMarker.openPopup();

        // Upravit pozici popup okna pro lepší vycentrování
        const popup = clubMarker.getPopup();
        if (popup && popup._container) {
            // Aplikujeme CSS transform pro lepší pozici
            popup._container.style.transform = popup._container.style.transform + ' translateY(-20px)';
        }

        // Skryjeme marker, aby byl vidět pouze popup
        clubMarker.setOpacity(0);

        // Přidáme listener na zavření popupu, aby se marker znovu zobrazil
        map.on('popupclose', function() {
            clubMarker.setOpacity(1);
        });

        // Přidáme event listener pro zavření popup
        map.once('popupclose', function() {
            // Odstraníme marker po zavření popup, pokud uživatel nechce s klubem dále pracovat
            setTimeout(() => {
                if (!clubMarker.isPopupOpen()) {
                    map.removeLayer(clubMarker);
                }
            }, 500);
        });

        // Přidáme event listener pro kliknutí na marker
        clubMarker.on('click', function() {
            // Otevřeme popup přímo u markeru
            clubMarker.openPopup();
        });
    }, 500);

    return `Nalezen Klub Alexa v Rohatci. Otevíraci doba: 20:00 - 05:00.`;
}

// Funkce pro zpracování rezervace
function makeReservation(placeName) {
    const date = document.getElementById('reservationDate')?.value || 'dnes';
    const time = document.getElementById('reservationTime')?.value || '22:00';
    const people = document.getElementById('reservationPeople')?.value || '2';
    const name = document.getElementById('reservationName')?.value || 'Anonym';
    const contact = document.getElementById('reservationContact')?.value || '-';
    const note = document.getElementById('reservationNote')?.value || '-';

    // Zavření všech popup oken
    map.closePopup();

    // Informace pro uživatele
    let message = `Vaše rezervace v ${placeName} byla úspěšně vytvořena.\n`;
    message += `Datum: ${date}\n`;
    message += `Čas: ${time}\n`;
    message += `Počet osob: ${people}\n`;
    message += `Jméno: ${name}\n`;
    message += `Kontakt: ${contact}`;

    if (note && note !== '-') {
        message += `\nPoznámka: ${note}`;
    }

    if (placeName === 'Klub Alexa') {
        message += `\n\nVaše VIP rezervace byla potvrzena. Těšíme se na Vaši návštěvu!`;
    }

    addMessage(message, false);

    return true;
}

// Funkce pro zobrazení otevíracích dob obchodů v Hodoníně
function showOpeningHours() {
    // Data o obchodech
    const stores = [
        {
            name: "Kaufland Hodonín, Dvořákova",
            address: "Dvořákova 4115/6, 695 01 Hodonín",
            location: L.latLng(48.8553, 17.1225),
            regularHours: "7:00 - 22:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 11:30",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        },
        {
            name: "Kaufland Hodonín, Konečná",
            address: "Konečná 4010/4, 695 01 Hodonín",
            location: L.latLng(48.8483, 17.1356),
            regularHours: "7:00 - 22:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 11:30",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        },
        {
            name: "Albert Hypermarket Hodonín, Krátká",
            address: "Krátká 4088/2, 695 01 Hodonín",
            location: L.latLng(48.8512, 17.1298),
            regularHours: "7:00 - 21:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 12:00",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        },
        {
            name: "Albert Supermarket Hodonín, Masarykovo nám.",
            address: "Masarykovo nám. 257/16, 695 85 Hodonín",
            location: L.latLng(48.8489, 17.1256),
            regularHours: "7:00 - 20:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 11:30",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        }
    ];

    // Vytvoření popup okna s výběrem obchodů
    const storeSelectionContent = `
        <div class="popup-content store-selection-popup">
            <div class="popup-header">
                <div class="popup-title">Otevírací doba obchodů v Hodoníně</div>
            </div>
            <div class="store-list">
                ${stores.map((store, index) => `
                    <div class="store-item" onclick="showStoreDetails(${index})">
                        <div class="store-name">${store.name}</div>
                        <div class="store-address">${store.address}</div>
                        <div class="store-hours">Běžná otevírací doba: ${store.regularHours}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Vytvoření popup okna ve středu mapy s lepším nastavením
    L.popup({
        className: 'store-popup',
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
        maxWidth: 400,
        minWidth: 300,
        autoPan: true,
        autoPanPadding: [50, 50],
        keepInView: true
    })
    .setLatLng(map.getCenter())
    .setContent(storeSelectionContent)
    .openOn(map);

    // Vytvoření zprávy v chatu
    let message = "Otevírací doba obchodů v Hodoníně:\n\n";
    stores.forEach(store => {
        message += `${store.name}\n`;
        message += `Adresa: ${store.address}\n`;
        message += `Běžná otevírací doba: ${store.regularHours}\n\n`;
    });
    message += "Pro zobrazení podrobných informací o otevírací době včetně svátků klikněte na obchod v popup okně.";

    return message;
}

// Funkce pro zobrazení detailů o otevírací době konkrétního obchodu
function showStoreDetails(storeIndex) {
    // Data o obchodech (stejná jako ve funkci showOpeningHours)
    const stores = [
        {
            name: "Kaufland Hodonín, Dvořákova",
            address: "Dvořákova 4115/6, 695 01 Hodonín",
            location: L.latLng(48.8553, 17.1225),
            regularHours: "7:00 - 22:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 11:30",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        },
        {
            name: "Kaufland Hodonín, Konečná",
            address: "Konečná 4010/4, 695 01 Hodonín",
            location: L.latLng(48.8483, 17.1356),
            regularHours: "7:00 - 22:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 11:30",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        },
        {
            name: "Albert Hypermarket Hodonín, Krátká",
            address: "Krátká 4088/2, 695 01 Hodonín",
            location: L.latLng(48.8512, 17.1298),
            regularHours: "7:00 - 21:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 12:00",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        },
        {
            name: "Albert Supermarket Hodonín, Masarykovo nám.",
            address: "Masarykovo nám. 257/16, 695 85 Hodonín",
            location: L.latLng(48.8489, 17.1256),
            regularHours: "7:00 - 20:00",
            holidayHours: {
                "1.1.2025": "zavřeno",
                "10.4.2025": "zavřeno", // Velký pátek
                "13.4.2025": "zavřeno", // Velikonoční pondělí
                "1.5.2025": "zavřeno",
                "8.5.2025": "zavřeno",
                "5.7.2025": "zavřeno",
                "6.7.2025": "zavřeno",
                "28.9.2025": "zavřeno",
                "28.10.2025": "zavřeno",
                "17.11.2025": "zavřeno",
                "24.12.2025": "7:00 - 11:30",
                "25.12.2025": "zavřeno",
                "26.12.2025": "zavřeno"
            }
        }
    ];

    // Získání vybraného obchodu
    const store = stores[storeIndex];

    // Vytvoření obsahu popup okna s detaily o otevírací době
    const storeDetailsContent = `
        <div class="popup-content store-details-popup">
            <div class="popup-header">
                <div class="popup-title">${store.name}</div>
                <button class="back-button" onclick="showOpeningHours()">Zpět</button>
            </div>
            <div class="store-details">
                <div class="store-address">${store.address}</div>
                <div class="store-hours-section">
                    <h4>Běžná otevírací doba:</h4>
                    <div class="regular-hours">${store.regularHours}</div>

                    <h4>Otevírací doba o svátcích 2025:</h4>
                    <div class="holiday-hours">
                        <table class="hours-table">
                            <tr><th>Datum</th><th>Otevírací doba</th></tr>
                            ${Object.entries(store.holidayHours).map(([date, hours]) => `
                                <tr>
                                    <td>${date}</td>
                                    <td>${hours}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                </div>
            </div>
            <div class="store-actions">
                <button class="popup-btn show-on-map-btn" onclick="showStoreOnMap(${storeIndex})">Zobrazit na mapě</button>
            </div>
        </div>
    `;

    // Aktualizace obsahu popup okna s lepším nastavením
    L.popup({
        className: 'store-popup store-details-popup',
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
        maxWidth: 450,
        minWidth: 320,
        autoPan: true,
        autoPanPadding: [50, 50],
        keepInView: true
    })
    .setLatLng(map.getCenter())
    .setContent(storeDetailsContent)
    .openOn(map);

    // Vytvoření zprávy v chatu
    let message = `Otevírací doba: ${store.name}\n`;
    message += `Adresa: ${store.address}\n`;
    message += `Běžná otevírací doba: ${store.regularHours}\n\n`;
    message += "Otevírací doba o svátcích 2025:\n";

    Object.entries(store.holidayHours).forEach(([date, hours]) => {
        message += `${date}: ${hours}\n`;
    });

    message += "\nPro zobrazení obchodu na mapě klikněte na tlačítko 'Zobrazit na mapě' v popup okně.";

    addMessage(message, false);
}

// Funkce pro zobrazení obchodu na mapě
function showStoreOnMap(storeIndex) {
    // Data o obchodech (stejná jako ve funkci showOpeningHours)
    const stores = [
        {
            name: "Kaufland Hodonín, Dvořákova",
            address: "Dvořákova 4115/6, 695 01 Hodonín",
            location: L.latLng(48.8553, 17.1225),
            regularHours: "7:00 - 22:00",
            holidayHours: {/* ... */}
        },
        {
            name: "Kaufland Hodonín, Konečná",
            address: "Konečná 4010/4, 695 01 Hodonín",
            location: L.latLng(48.8483, 17.1356),
            regularHours: "7:00 - 22:00",
            holidayHours: {/* ... */}
        },
        {
            name: "Albert Hypermarket Hodonín, Krátká",
            address: "Krátká 4088/2, 695 01 Hodonín",
            location: L.latLng(48.8512, 17.1298),
            regularHours: "7:00 - 21:00",
            holidayHours: {/* ... */}
        },
        {
            name: "Albert Supermarket Hodonín, Masarykovo nám.",
            address: "Masarykovo nám. 257/16, 695 85 Hodonín",
            location: L.latLng(48.8489, 17.1256),
            regularHours: "7:00 - 20:00",
            holidayHours: {/* ... */}
        }
    ];

    // Získání vybraného obchodu
    const store = stores[storeIndex];

    // Vytvoření markeru pro obchod
    const storeMarker = L.marker(store.location, {
        icon: L.divIcon({
            className: 'store-marker',
            html: `<div class="place-icon store"><i class="icon">🛍️</i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);

    // Vytvoření obsahu popup okna pro marker
    const markerPopupContent = `
        <div class="popup-content store-marker-popup">
            <div class="popup-header">
                <div class="popup-title">${store.name}</div>
            </div>
            <div class="store-details">
                <div class="store-address">${store.address}</div>
                <div class="store-hours">Běžná otevírací doba: ${store.regularHours}</div>
            </div>
            <div class="store-actions">
                <button class="popup-btn details-btn" onclick="showStoreDetails(${storeIndex})">Zobrazit detaily</button>
            </div>
        </div>
    `;

    // Přidání popup k markeru s lepším nastavením
    storeMarker.bindPopup(markerPopupContent, {
        className: 'store-marker-popup',
        maxWidth: 350,
        minWidth: 250,
        autoPan: true,
        autoPanPadding: [50, 50],
        closeOnClick: false
    }).openPopup();

    // Přidání event listeneru pro zoom
    storeMarker.on('popupopen', () => {
        // Aktualizace velikosti popup okna při otevření
        const popupContent = storeMarker.getPopup().getContent();
        storeMarker.setPopupContent(popupContent);
    });

    // Přiblížení mapy na obchod s offsetem
    const offsetPoint = map.project(store.location).add([100, 0]);
    const offsetLatLng = map.unproject(offsetPoint);

    map.setView(offsetLatLng, 15, {
        animate: true,
        duration: 1
    });

    // Zavření předchozího popup okna
    map.closePopup();

    // Informace pro uživatele
    addMessage(`Zobrazen obchod: ${store.name}\nAdresa: ${store.address}\nBěžná otevírací doba: ${store.regularHours}`, false);
}

// Funkce pro zobrazení modálního okna pro rezervaci tanečnice
function showDancerReservationModal() {
    const dancerReservationModal = document.getElementById('dancerReservationModal');
    dancerReservationModal.style.display = 'block';

    // Nastavení výchozího data na zítřek, pokud není nastavené
    const dateInput = document.getElementById('dancerReservationDate');
    if (!dateInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
}

// Funkce pro zpracování rezervace tanečnice
function processDancerReservation() {
    // Získání vybrané tanečnice
    const selectedDancer = document.querySelector('.dancer-card.selected');
    const dancerName = selectedDancer ? selectedDancer.getAttribute('data-dancer') : 'Nevybráno';

    // Získání hodnot z formuláře
    const date = document.getElementById('dancerReservationDate')?.value || 'dnes';
    const time = document.getElementById('dancerReservationTime')?.value || '22:00';
    const hoursSelect = document.getElementById('dancerReservationHours');
    const hours = hoursSelect.options[hoursSelect.selectedIndex].text;
    const name = document.getElementById('dancerReservationName')?.value || 'Anonym';
    const contact = document.getElementById('dancerReservationContact')?.value || '-';
    const note = document.getElementById('dancerReservationNote')?.value || '-';

    // Zavření modálního okna
    document.getElementById('dancerReservationModal').style.display = 'none';

    // Informace pro uživatele
    let message = `Vaše rezervace tanečnice byla úspěšně vytvořena.\n`;
    message += `Tanečnice: ${dancerName}\n`;
    message += `Datum: ${date}\n`;
    message += `Čas: ${time}\n`;
    message += `Doba: ${hours}\n`;
    message += `Jméno: ${name}\n`;
    message += `Kontakt: ${contact}`;

    if (note && note !== '-') {
        message += `\nPoznámka: ${note}`;
    }

    message += `\n\nVaše VIP rezervace v klubu Alexa byla potvrzena. Těšíme se na Vaši návštěvu!`;

    addMessage(message, false);

    return true;
}

// Funkce pro vyhledání zajímavých míst
function searchPlaceOfInterest(placeType, location = null) {
    // Pokud není zadána lokace, použijeme střed mapy
    const searchLocation = location || map.getCenter();

    // Simulace vyhledávání míst - v reálné aplikaci by zde bylo API volání
    // např. na Google Places, Foursquare, OpenStreetMap Overpass API, atd.

    // Simulovaná data pro různé typy míst
    const placeData = {
        'restaurace': {
            name: 'Restaurace U Zlatého Lva',
            lat: searchLocation.lat + 0.005,
            lng: searchLocation.lng + 0.003,
            rating: 4.5,
            description: 'Tradiční česká kuchyně s příjemným prostředím.',
            openHours: '11:00 - 22:00',
            type: 'restaurace'
        },
        'hotel': {
            name: 'Grand Hotel',
            lat: searchLocation.lat - 0.004,
            lng: searchLocation.lng + 0.002,
            rating: 4.2,
            description: 'Luxusní ubytování v centru města.',
            openHours: 'Non-stop',
            type: 'hotel'
        },
        'kavárna': {
            name: 'Café Central',
            lat: searchLocation.lat + 0.002,
            lng: searchLocation.lng - 0.003,
            rating: 4.7,
            description: 'Kvalitní káva a domácí zákusky.',
            openHours: '9:00 - 20:00',
            type: 'kavárna'
        },
        'atrakce': {
            name: 'Městské muzeum',
            lat: searchLocation.lat - 0.003,
            lng: searchLocation.lng - 0.002,
            rating: 4.0,
            description: 'Historické exponenty a výstavy.',
            openHours: '10:00 - 18:00',
            type: 'atrakce'
        }
    };

    // Získání dat pro požadovaný typ místa
    const place = placeData[placeType] || placeData['restaurace'];

    // Vytvoření markeru pro nalezené místo
    const placeLocation = L.latLng(place.lat, place.lng);
    const placeMarker = L.marker(placeLocation, {
        icon: L.divIcon({
            className: 'place-marker',
            html: `<div class="place-icon ${place.type}"><i class="icon">🍔</i></div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);

    // Vytvoření popup obsahu s rezervačním formulářem
    const popupContent = `
        <div class="popup-content place-popup">
            <h3>${place.name}</h3>
            <div class="place-info">
                <p><strong>Hodnocení:</strong> ${place.rating}/5</p>
                <p><strong>Otevíraci doba:</strong> ${place.openHours}</p>
                <p>${place.description}</p>
            </div>
            <div class="reservation-form">
                <h4>Rezervace</h4>
                <div class="form-group">
                    <label for="reservationDate">Datum:</label>
                    <input type="date" id="reservationDate" class="popup-input" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="reservationTime">Hodina:</label>
                    <input type="time" id="reservationTime" class="popup-input" value="19:00">
                </div>
                <div class="form-group">
                    <label for="reservationPeople">Počet osob:</label>
                    <input type="number" id="reservationPeople" class="popup-input" value="2" min="1" max="10">
                </div>
                <div class="form-group">
                    <label for="reservationName">Jméno:</label>
                    <input type="text" id="reservationName" class="popup-input" placeholder="Vaše jméno">
                </div>
                <div class="form-group">
                    <label for="reservationContact">Kontakt:</label>
                    <input type="text" id="reservationContact" class="popup-input" placeholder="Telefon nebo email">
                </div>
                <div class="popup-actions">
                    <button class="popup-btn save-btn" onclick="makeReservation('${place.name}')">Rezervovat</button>
                </div>
            </div>
        </div>
    `;

    // Přidání popup k markeru
    placeMarker.bindPopup(popupContent, { minWidth: 300 }).openPopup();

    // Přiblížení mapy na nalezené místo
    map.setView(placeLocation, 16);

    // Přidání zprávy do chatu
    return `Nalezeno: ${place.name}. ${place.description} Otevíraci doba: ${place.openHours}`;
}

// Funkce pro zpracování rezervace
function makeReservation(placeName) {
    const date = document.getElementById('reservationDate')?.value || 'dnes';
    const time = document.getElementById('reservationTime')?.value || '19:00';
    const people = document.getElementById('reservationPeople')?.value || '2';
    const name = document.getElementById('reservationName')?.value || 'Anonym';

    // Zavření všech popup oken
    map.closePopup();

    // Informace pro uživatele
    addMessage(`Vaše rezervace v ${placeName} byla úspěšně vytvořena.\nDatum: ${date}\nČas: ${time}\nPočet osob: ${people}\nJméno: ${name}`, false);

    return true;
}

// Rozšíření funkce pro zpracování uživatelského vstupu o nastavení a navigaci
const originalProcessUserInput = processUserInput;
processUserInput = function(input) {
    const lowercaseInput = input.toLowerCase().trim();

    // Kontrola příkazů pro navigaci na body
    for (let i = 0; i < markerProperties.length; i++) {
        if (markerProperties[i] && lowercaseInput === markerProperties[i].command.toLowerCase()) {
            return navigateToMarker(i);
        }
    }

    // Kontrola obecných příkazů
    if (lowercaseInput === 'alexa') {
        return showRohatecClub();
    } else if (lowercaseInput.includes('nastavení') || lowercaseInput.includes('settings')) {
        settingsModal.style.display = 'block';
        return 'Otevírám nastavení aplikace.';
    } else if (lowercaseInput.includes('barva') || lowercaseInput.includes('schéma')) {
        return 'Barevné schéma můžete změnit v nastavení aplikace. Klikněte na ikonu ozubeného kola v pravém horním rohu.';
    } else if (lowercaseInput.includes('tmavý') || lowercaseInput.includes('světlý') || lowercaseInput.includes('režim')) {
        return 'Tmavý režim můžete přepnout v nastavení aplikace. Klikněte na ikonu ozubeného kola v pravém horním rohu.';
    } else if (lowercaseInput.includes('api') || lowercaseInput.includes('klíč')) {
        return 'API nastavení můžete změnit v nastavení aplikace. Klikněte na ikonu ozubeného kola v pravém horním rohu.';
    } else if (lowercaseInput.includes('fullscreen') || lowercaseInput.includes('celá obrazovka')) {
        isFullscreen = !isFullscreen;
        fullscreenButton.click();
        return isFullscreen ? 'Přepínám mapu do režimu celé obrazovky.' : 'Vracím mapu do normálního režimu.';
    } else if (lowercaseInput.includes('3d') || lowercaseInput.includes('3d režim') || lowercaseInput.includes('budovy')) {
        toggle3DMode();
        return is3DMode ? 'Aktivuji 3D režim s budovami. Použijte ovládací prvky pro rotaci a náklon.' : 'Deaktivuji 3D režim a vracím se do 2D zobrazení.';
    } else if (lowercaseInput.includes('glóbus') || lowercaseInput.includes('koule') || lowercaseInput.includes('země') || lowercaseInput.includes('planeta')) {
        toggleGlobeMode();
        return isGlobeMode ? 'Aktivuji režim glóbusu. Nyní můžete vidět Zemi jako 3D kouli. Použijte ovládací prvky pro rotaci a přiblížení.' : 'Deaktivuji režim glóbusu a vracím se do 2D zobrazení.';
    } else if (lowercaseInput.includes('přidat bod') || lowercaseInput.includes('přidat aktivitu')) {
        isAddingPoints = true;
        document.getElementById('addActivity').classList.add('active');
        return 'Režim přidávání bodů je aktivní. Dvojklikněte na mapu pro přidání bodu.';
    } else if (lowercaseInput.includes('vzdálenost') || lowercaseInput.includes('čas cesty')) {
        if (markers.length < 2) {
            return 'Pro výpočet vzdálenosti a času cesty potřebuji alespoň dva body na mapě.';
        } else {
            calculateRouteFunction();
            return `Trasa byla vypočítána. Vzdálenost: ${routeDistanceElement.textContent}, čas cesty: ${routeTimeElement.textContent}`;
        }
    } else if (lowercaseInput.includes('seznam bodů') || lowercaseInput.includes('ukaž body')) {
        if (markers.length === 0) {
            return 'Na mapě nejsou žádné body.';
        }

        let response = 'Seznam bodů na mapě:\n';
        markerProperties.forEach((prop, index) => {
            response += `${index + 1}. ${prop.name} - příkaz: "${prop.command}"\n`;
        });
        return response;
    }
    // Vyhledávání zajímavých míst
    else if (lowercaseInput.includes('najdi') || lowercaseInput.includes('vyhledej') || lowercaseInput.includes('hledej')) {
        // Kontrola typu místa
        let placeType = 'restaurace'; // Výchozí typ

        if (lowercaseInput.includes('restauraci') || lowercaseInput.includes('restaurace') || lowercaseInput.includes('jídlo')) {
            placeType = 'restaurace';
        } else if (lowercaseInput.includes('hotel') || lowercaseInput.includes('ubytování')) {
            placeType = 'hotel';
        } else if (lowercaseInput.includes('kavárnu') || lowercaseInput.includes('kavárna') || lowercaseInput.includes('káva')) {
            placeType = 'kavárna';
        } else if (lowercaseInput.includes('atrakci') || lowercaseInput.includes('atrakce') || lowercaseInput.includes('muzeum') || lowercaseInput.includes('památka')) {
            placeType = 'atrakce';
        }

        return searchPlaceOfInterest(placeType);
    }

    return originalProcessUserInput(input);
};
