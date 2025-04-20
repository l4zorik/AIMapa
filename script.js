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

// Konfigurace pro Leaflet Routing Machine
const routingOptions = {
    router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving' // Možnosti: driving, walking, cycling
    }),
    lineOptions: {
        styles: [
            {color: 'blue', opacity: 0.8, weight: 5}
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
    useZoomParameter: false // Zabrání přepočítávání trasy při změně zoomu
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
    console.log(`Creating popup content for marker ${index}`);
    try {
        // Získání vlastností markeru nebo vytvoření výchozích hodnot
        let markerProp;
        try {
            const latLng = marker.getLatLng();
            markerProp = markerProperties[index] || {
                name: `Bod ${index + 1}`,
                command: `bod${index + 1}`,
                lat: latLng.lat.toFixed(4),
                lng: latLng.lng.toFixed(4),
                saved: false // Přidání příznak, zda je bod uložený
            };
        } catch (propError) {
            console.error(`Error getting marker properties for index ${index}:`, propError);
            // Použijí výchozích hodnot v případě chyby
            markerProp = {
                name: `Bod ${index + 1}`,
                command: `bod${index + 1}`,
                lat: '0.0000',
                lng: '0.0000',
                saved: false
            };
        }

        // Vytvoření unikátního ID pro odpočet - použijeme fixní ID pro každý marker
        const countdownId = `countdown-${index}`;
        console.log(`Countdown ID for marker ${index}: ${countdownId}`);

        // Kontrola, zda je bod uložený nebo nově vytvořený
        if (markerProp.saved) {
            console.log(`Creating view mode popup for saved marker ${index}`);
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
            console.log(`Creating edit mode popup for marker ${index}`);
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
    } catch (error) {
        console.error(`Error creating popup content for marker ${index}:`, error);
        // Vrácení záložního obsahu v případě chyby
        return `
            <div class="popup-content error-marker">
                <div class="popup-header">
                    <div class="popup-title">Bod ${index + 1}</div>
                </div>
                <div class="popup-info">
                    <p>Došlo k chybě při načítání informací o bodu.</p>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn delete-btn" onclick="removeMarker(${index}, event)">Odstranit bod</button>
                </div>
            </div>
        `;
    }
}

// Funkce pro spuštění odpočtu
function startCountdown(elementId, seconds) {
    console.log(`Starting countdown for element ID: ${elementId}, seconds: ${seconds}`);
    try {
        const countdownElement = document.getElementById(elementId);
        if (!countdownElement) {
            console.error('Countdown element not found in startCountdown:', elementId);
            return null;
        }

        // Zrušení předchozího intervalu, pokud existuje
        if (countdownIntervals[elementId]) {
            try {
                clearInterval(countdownIntervals[elementId]);
                console.log(`Previous interval for ${elementId} cleared`);
            } catch (clearError) {
                console.error(`Error clearing previous interval for ${elementId}:`, clearError);
            }
        }

        let remainingSeconds = seconds;

        // Aktualizace počátečního zobrazení
        countdownElement.textContent = `${remainingSeconds}s`;
        countdownElement.classList.remove('countdown-warning', 'countdown-danger'); // Reset tříd

        // Získání indexu markeru z ID elementu
        let markerIndex = -1;
        try {
            const idParts = elementId.split('-');
            if (idParts.length >= 2) {
                markerIndex = parseInt(idParts[1]);
                console.log(`Extracted marker index: ${markerIndex} from element ID: ${elementId}`);
            }
        } catch (parseError) {
            console.error(`Error parsing marker index from ${elementId}:`, parseError);
        }

        // Aktualizace odpočtu každou sekundu
        try {
            countdownIntervals[elementId] = setInterval(() => {
                try {
                    remainingSeconds--;

                    // Kontrola, zda element stále existuje v DOM
                    const updatedElement = document.getElementById(elementId);
                    if (updatedElement) {
                        updatedElement.textContent = `${remainingSeconds}s`;

                        // Změny barvy při nízkém čase
                        if (remainingSeconds <= 10) {
                            updatedElement.classList.add('countdown-warning');
                        }
                        if (remainingSeconds <= 5) {
                            updatedElement.classList.add('countdown-danger');
                        }
                    } else {
                        console.warn(`Countdown element ${elementId} disappeared during countdown`);
                        clearInterval(countdownIntervals[elementId]);
                        delete countdownIntervals[elementId];
                        return;
                    }

                    // Ukončení intervalu a zavření popup okna po vypršení času
                    if (remainingSeconds <= 0) {
                        clearInterval(countdownIntervals[elementId]);
                        delete countdownIntervals[elementId];
                        console.log(`Countdown for ${elementId} finished`);

                        // Zavření popup okna, pokud je index markeru platný
                        if (!isNaN(markerIndex) && markerIndex >= 0 && markerIndex < markers.length) {
                            try {
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
                            } catch (markerError) {
                                console.error(`Error closing popup for marker ${markerIndex}:`, markerError);
                            }
                        }
                    }
                } catch (intervalError) {
                    console.error(`Error in countdown interval for ${elementId}:`, intervalError);
                    clearInterval(countdownIntervals[elementId]);
                    delete countdownIntervals[elementId];
                }
            }, 1000);

            console.log(`Countdown interval created for ${elementId}`);
            return countdownIntervals[elementId];
        } catch (setIntervalError) {
            console.error(`Error creating interval for ${elementId}:`, setIntervalError);
            return null;
        }
    } catch (error) {
        console.error(`Unexpected error in startCountdown for ${elementId}:`, error);
        return null;
    }
}

// Funkce pro uložení vlastností markeru
function saveMarkerProperties(index, event) {
    // Zastavení propagace události, aby se nezavřelo popup okno
    if (event) {
        event.stopPropagation();
    }

    console.log('Saving marker properties for index:', index);

    const nameInput = document.getElementById(`markerName${index}`);
    const commandInput = document.getElementById(`markerCommand${index}`);

    console.log('Inputs found:', nameInput, commandInput);

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

        console.log('Marker properties saved:', markerProperties[index]);

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
        try {
            const newContent = createPopupContent(marker, index);
            console.log('New popup content created');
            marker.setPopupContent(newContent);
            console.log('Popup content updated');
        } catch (error) {
            console.error('Error updating popup content:', error);
        }

        // Uložení stavu aplikace po změně vlastností markeru
        try {
            saveAppState();
            console.log('App state saved');
        } catch (error) {
            console.error('Error saving app state:', error);
        }
    } else {
        console.error('Cannot save marker properties - inputs not found or invalid index');
    }
}

// Funkce pro přepnutí markeru do režimu úprav
function editMarker(index, event) {
    console.log(`Editing marker ${index}`);
    try {
        // Zastavení propagace události, aby se nezavřelo popup okno
        if (event) {
            event.stopPropagation();
        }

        if (index < markers.length) {
            const marker = markers[index];
            if (!marker) {
                console.error(`Marker at index ${index} is undefined`);
                return;
            }

            // Získání aktuálních vlastností markeru
            const currentProperties = markerProperties[index] || {
                name: `Bod ${index + 1}`,
                command: `bod${index + 1}`,
                lat: marker.getLatLng().lat.toFixed(4),
                lng: marker.getLatLng().lng.toFixed(4),
                saved: true
            };

            // Dočasně nastavíme příznak saved na false, aby se zobrazil formulář
            const tempProperties = {...currentProperties, saved: false};
            markerProperties[index] = tempProperties;
            console.log(`Marker ${index} properties set to edit mode:`, tempProperties);

            // Aktualizace popup obsahu
            try {
                const newContent = createPopupContent(marker, index);
                marker.setPopupContent(newContent);
                console.log(`Popup content updated for marker ${index}`);
            } catch (popupError) {
                console.error(`Error updating popup content for marker ${index}:`, popupError);
            }

            // Znovu otevřeme popup, pokud bylo zavřeno
            if (!marker.isPopupOpen()) {
                try {
                    marker.openPopup();
                    console.log(`Popup opened for marker ${index}`);
                } catch (openError) {
                    console.error(`Error opening popup for marker ${index}:`, openError);
                }
            }

            // Zrušení předchozího časovače, pokud existuje
            if (popupTimers[index]) {
                try {
                    clearTimeout(popupTimers[index]);
                    delete popupTimers[index];
                    console.log(`Popup timer cleared for marker ${index}`);
                } catch (timerError) {
                    console.error(`Error clearing popup timer for marker ${index}:`, timerError);
                }
            }

            // Nastavení nového časovače pro automatické zavření popup okna
            popupTimers[index] = setTimeout(() => {
                if (marker.isPopupOpen()) {
                    marker.closePopup();
                    console.log(`Popup automatically closed for marker ${index} after timeout`);
                }
                delete popupTimers[index];
            }, 35000); // 35 sekund

            // Informace pro uživatele
            addMessage(`Bod "${tempProperties.name}" je nyní v režimu úprav.`, false);
        } else {
            console.error(`Invalid marker index: ${index}, markers length: ${markers.length}`);
        }
    } catch (error) {
        console.error(`Unexpected error editing marker ${index}:`, error);
    }
}

// Funkce pro odstranění markeru
function removeMarker(index, event) {
    console.log(`Removing marker ${index}`);
    try {
        // Zastavení propagace události, aby se nezavřelo popup okno předčasně
        if (event) {
            event.stopPropagation();
        }

        if (index < markers.length) {
            const marker = markers[index];
            if (!marker) {
                console.error(`Marker at index ${index} is undefined`);
                return;
            }

            // Získání informací o markeru před jeho odstraněním
            const markerName = markerProperties[index]?.name || `Bod ${index + 1}`;
            const markerCommand = markerProperties[index]?.command;
            const markerLat = markerProperties[index]?.lat;
            const markerLng = markerProperties[index]?.lng;

            console.log(`Removing marker: ${markerName}, command: ${markerCommand}, position: [${markerLat}, ${markerLng}]`);

            // Uložení příkazu a vlastností smazaného bodu pro pozdější použití
            if (markerCommand && markerLat && markerLng) {
                try {
                    deletedMarkerCommands.push({
                        command: markerCommand,
                        name: markerName,
                        lat: markerLat,
                        lng: markerLng
                    });
                    console.log(`Command "${markerCommand}" saved to deleted commands list`);
                    addMessage(`Příkaz "${markerCommand}" zůstává aktivní i po smazání bodu.`, false);
                } catch (commandError) {
                    console.error(`Error saving deleted command for marker ${index}:`, commandError);
                }
            }

            // Zrušení časovače pro popup okno
            if (popupTimers[index]) {
                try {
                    clearTimeout(popupTimers[index]);
                    delete popupTimers[index];
                    console.log(`Popup timer cleared for marker ${index}`);
                } catch (timerError) {
                    console.error(`Error clearing popup timer for marker ${index}:`, timerError);
                }
            }

            // Zrušení všech intervalů pro odpočet
            try {
                Object.keys(countdownIntervals).forEach(key => {
                    if (key.startsWith(`countdown-${index}-`)) {
                        clearInterval(countdownIntervals[key]);
                        delete countdownIntervals[key];
                        console.log(`Countdown interval cleared: ${key}`);
                    }
                });
            } catch (intervalError) {
                console.error(`Error clearing countdown intervals for marker ${index}:`, intervalError);
            }

            // Odstranění markeru z mapy
            try {
                map.removeLayer(marker);
                console.log(`Marker ${index} removed from map`);
            } catch (removeError) {
                console.error(`Error removing marker ${index} from map:`, removeError);
            }

            // Odstranění markeru a jeho vlastností z polí
            try {
                markers.splice(index, 1);
                markerProperties.splice(index, 1);
                console.log(`Marker ${index} removed from arrays, new markers length: ${markers.length}`);
            } catch (spliceError) {
                console.error(`Error removing marker ${index} from arrays:`, spliceError);
            }

            // Aktualizace časovačů pro zbývající markery
            try {
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
                console.log('Popup timers renumbered');
            } catch (timerRenumberError) {
                console.error('Error renumbering popup timers:', timerRenumberError);
            }

            // Aktualizace vlastností zbývajících markerů (přečíslovat)
            try {
                for (let i = index; i < markers.length; i++) {
                    if (!markerProperties[i]) {
                        markerProperties[i] = { name: `Bod ${i + 1}`, command: `bod${i + 1}` };
                    }

                    try {
                        const newContent = createPopupContent(markers[i], i);
                        markers[i].setPopupContent(newContent);
                        console.log(`Popup content updated for marker ${i}`);
                    } catch (popupError) {
                        console.error(`Error updating popup content for marker ${i}:`, popupError);
                    }
                }
                console.log('Remaining markers renumbered');
            } catch (markerRenumberError) {
                console.error('Error renumbering remaining markers:', markerRenumberError);
            }

            // Informace pro uživatele
            addMessage(`Bod "${markerName}" byl odstraněn.`, false);

            // Přepočítání trasy, pokud máme alespoň dva body
            if (markers.length >= 2) {
                try {
                    calculateRouteFunction();
                    console.log('Route recalculated after marker removal');
                } catch (routeError) {
                    console.error('Error recalculating route after marker removal:', routeError);
                }
            } else {
                // Odstranění trasy, pokud nemáme dostatek bodů
                try {
                    // Odstranění trasy vytvořené pomocí Leaflet Routing Machine
                    if (routeControl) {
                        map.removeControl(routeControl);
                        routeControl = null;
                        console.log('Route control removed');
                    }

                    // Odstranění přímé trasy, pokud existuje
                    if (route) {
                        map.removeLayer(route);
                        route = null;
                        console.log('Direct route removed');
                    }

                    // Reset informací o trase
                    routeDistanceElement.textContent = '-';
                    routeTimeElement.textContent = '-';
                    console.log('Route information reset');
                } catch (routeRemoveError) {
                    console.error('Error removing route:', routeRemoveError);
                }
            }

            // Uložení stavu aplikace po odstranění markeru
            try {
                saveAppState();
                console.log('Application state saved after marker removal');
            } catch (saveError) {
                console.error('Error saving application state after marker removal:', saveError);
            }

            return true;
        } else {
            console.error(`Invalid marker index: ${index}, markers length: ${markers.length}`);
            return false;
        }
    } catch (error) {
        console.error(`Unexpected error removing marker ${index}:`, error);
        return false;
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

    // Přidání event listeneru pro otevření popup okna s robustním ošetřením chyb
    marker.on('popupopen', function() {
        try {
            console.log(`Popup opened for marker ${markerIndex}`);

            // Zrušení všech předchozích intervalů pro odpočet
            try {
                const intervalKeys = Object.keys(countdownIntervals);
                if (intervalKeys && intervalKeys.length > 0) {
                    intervalKeys.forEach(key => {
                        try {
                            clearInterval(countdownIntervals[key]);
                            delete countdownIntervals[key];
                            console.log(`Cleared interval: ${key}`);
                        } catch (clearError) {
                            console.error(`Error clearing interval ${key}:`, clearError);
                        }
                    });
                }
            } catch (intervalsError) {
                console.error('Error clearing countdown intervals:', intervalsError);
            }

            // Spuštění odpočtu - počkáme na vykreslení DOM
            setTimeout(() => {
                try {
                    // Kontrola, zda marker stále existuje
                    if (!marker || !markers.includes(marker)) {
                        console.warn(`Marker ${markerIndex} no longer exists, aborting countdown`);
                        return;
                    }

                    // Kontrola, zda je popup stále otevřený
                    if (!marker.isPopupOpen()) {
                        console.warn(`Popup for marker ${markerIndex} is no longer open, aborting countdown`);
                        return;
                    }

                    // Použijeme přímý selektor pro nalezení elementu odpočtu v aktuálním popup okně
                    const popup = marker.getPopup();
                    if (!popup) {
                        console.error(`Popup for marker ${markerIndex} is undefined`);
                        return;
                    }

                    const popupElement = popup.getElement();
                    if (!popupElement) {
                        console.error(`Popup element for marker ${markerIndex} is undefined`);
                        return;
                    }

                    const countdownElement = popupElement.querySelector('.popup-countdown');
                    if (!countdownElement) {
                        console.error(`Countdown element for marker ${markerIndex} not found in popup`);
                        return;
                    }

                    // Nastavíme ID pro element odpočtu
                    const countdownId = `countdown-${markerIndex}`;
                    countdownElement.id = countdownId;

                    // Spuštění odpočtu
                    console.log(`Starting countdown for marker ${markerIndex} with element:`, countdownId);
                    startCountdown(countdownId, 35);
                } catch (timeoutError) {
                    console.error(`Error in popupopen timeout for marker ${markerIndex}:`, timeoutError);
                }
            }, 300); // Počkáme 300ms na vykreslení DOM
        } catch (popupOpenError) {
            console.error(`Error in popupopen event for marker ${markerIndex}:`, popupOpenError);
        }
    });

    // Přidání event listeneru pro zavření popup okna s robustním ošetřením chyb
    marker.on('popupclose', function() {
        try {
            console.log(`Popup closed for marker ${markerIndex}`);

            // Zrušení časovače při manuálním zavření popup okna
            try {
                if (popupTimers && popupTimers[markerIndex]) {
                    clearTimeout(popupTimers[markerIndex]);
                    delete popupTimers[markerIndex];
                    console.log(`Popup timer cleared for marker ${markerIndex}`);
                }
            } catch (timerError) {
                console.error(`Error clearing popup timer for marker ${markerIndex}:`, timerError);
            }

            // Zrušení všech intervalů pro odpočet
            try {
                const intervalKeys = Object.keys(countdownIntervals);
                if (intervalKeys && intervalKeys.length > 0) {
                    intervalKeys.forEach(key => {
                        if (key.startsWith(`countdown-${markerIndex}`)) {
                            try {
                                clearInterval(countdownIntervals[key]);
                                delete countdownIntervals[key];
                                console.log(`Cleared interval: ${key}`);
                            } catch (clearError) {
                                console.error(`Error clearing interval ${key}:`, clearError);
                            }
                        }
                    });
                }
            } catch (intervalsError) {
                console.error(`Error clearing countdown intervals for marker ${markerIndex}:`, intervalsError);
            }
        } catch (popupCloseError) {
            console.error(`Error in popupclose event for marker ${markerIndex}:`, popupCloseError);
        }
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

// Event listener pro dvojklik na mapu s robustním ošetřením chyb
try {
    // Deaktivace standardního chování dvojkliku (zoom)
    map.doubleClickZoom.disable();
    console.log('Double click zoom disabled');

    // Přidání event listeneru pro dvojklik
    map.on('dblclick', (e) => {
        try {
            console.log('Double click detected at:', e.latlng);

            // Kontrola, zda je aktivní režim přidávání bodů
            if (isAddingPoints) {
                console.log('Adding points mode is active, creating marker');

                // Kontrola platnosti souřadnic
                if (e.latlng && typeof e.latlng.lat === 'number' && typeof e.latlng.lng === 'number') {
                    // Použití setTimeout pro lepší odezvu UI
                    setTimeout(() => {
                        try {
                            // Přidání markeru na mapu
                            const marker = addMarkerToMap(e.latlng);
                            console.log('Marker added successfully:', marker ? 'yes' : 'no');
                        } catch (addError) {
                            console.error('Error adding marker:', addError);
                            addMessage('Došlo k chybě při přidávání bodu. Zkuste to prosím znovu.', true);
                        }
                    }, 50);
                } else {
                    console.error('Invalid coordinates:', e.latlng);
                    addMessage('Neplatné souřadnice. Zkuste kliknout na jiné místo.', true);
                }
            } else {
                console.log('Adding points mode is not active, ignoring double click');
            }
        } catch (error) {
            console.error('Error in dblclick event handler:', error);
            addMessage('Došlo k chybě při zpracování dvojkliku. Zkuste to prosím znovu.', true);
        }
    });
    console.log('Double click event listener added');
} catch (setupError) {
    console.error('Error setting up double click handler:', setupError);
}

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
    try {
        // Přidání třídy pro animaci při pohybu mapy
        const popups = document.querySelectorAll('.leaflet-popup');
        if (popups && popups.length > 0) {
            popups.forEach(popup => {
                if (popup) {
                    popup.classList.add('moving');
                }
            });
        }

        // Optimalizace trasy při pohybu mapy
        const routingPane = document.querySelector('.leaflet-overlay-pane');
        if (routingPane) {
            routingPane.classList.add('moving');
        }

        // Pozastavení animací pro lepší výkon při pohybu mapy
        console.log('Map movement started, optimizations applied');
    } catch (error) {
        console.error('Error in movestart event handler:', error);
    }
    document.body.classList.add('map-moving');
});

map.on('moveend', () => {
    try {
        // Odstranění třídy po dokončení pohybu mapy
        setTimeout(() => {
            try {
                const popups = document.querySelectorAll('.leaflet-popup');
                if (popups && popups.length > 0) {
                    popups.forEach(popup => {
                        if (popup) {
                            popup.classList.remove('moving');
                        }
                    });
                }

                // Obnovení trasy po dokončení pohybu mapy
                const routingPane = document.querySelector('.leaflet-overlay-pane');
                if (routingPane) {
                    routingPane.classList.remove('moving');
                }

                // Obnovení animací po dokončení pohybu mapy
                document.body.classList.remove('map-moving');

                // Aktualizace velikosti mapy pro správné vykreslení trasy
                try {
                    map.invalidateSize();
                    console.log('Map size invalidated after movement');
                } catch (invalidateError) {
                    console.error('Error invalidating map size:', invalidateError);
                }

                console.log('Map movement ended, optimizations removed');
            } catch (timeoutError) {
                console.error('Error in moveend timeout handler:', timeoutError);
                // Záložní mechanismus pro případ chyby
                document.body.classList.remove('map-moving');
            }
        }, 100);
    } catch (error) {
        console.error('Error in moveend event handler:', error);
        // Záložní mechanismus pro případ chyby
        document.body.classList.remove('map-moving');
    }
});

// Event listeners pro tlačítka s robustním ošetřením chyb
try {
    const addActivityBtn = document.getElementById('addActivity');
    if (addActivityBtn) {
        // Odstranění všech existujících event listenerů pro prevenci duplicit
        const newAddActivityBtn = addActivityBtn.cloneNode(true);
        addActivityBtn.parentNode.replaceChild(newAddActivityBtn, addActivityBtn);

        // Přidání nového event listeneru
        newAddActivityBtn.addEventListener('click', (event) => {
            try {
                console.log('Add activity button clicked');
                // Zastavení propagace události
                event.preventDefault();
                event.stopPropagation();

                isAddingPoints = !isAddingPoints;
                console.log('Adding points mode:', isAddingPoints);

                if (isAddingPoints) {
                    newAddActivityBtn.classList.add('active');
                    addMessage('Režim přidávání bodů je aktivní. Dvojklikněte na mapu pro přidání bodu.', false);
                } else {
                    newAddActivityBtn.classList.remove('active');
                    addMessage('Režim přidávání bodů byl deaktivován.', false);
                }
            } catch (error) {
                console.error('Error in addActivity click handler:', error);
                // Záložní mechanismus pro případ chyby
                isAddingPoints = true;
                try {
                    newAddActivityBtn.classList.add('active');
                    addMessage('Došlo k chybě, režim přidávání bodů byl obnoven.', false);
                } catch (fallbackError) {
                    console.error('Error in addActivity fallback:', fallbackError);
                }
            }
        });
        console.log('Add activity button event listener added');
    } else {
        console.error('Add activity button not found');
    }
} catch (setupError) {
    console.error('Error setting up addActivity button:', setupError);
}

// Přidání tlačítka pro glóbus režim do hlavního dokumentu
const globeButton = document.createElement('button');
globeButton.id = 'toggleGlobeMode';
globeButton.className = 'map-control-btn globe-btn';
globeButton.innerHTML = '<i class="icon">🌎</i>';
globeButton.title = 'Glóbus režim';
globeButton.addEventListener('click', toggleGlobeMode);

// Přidání tlačítka do mapy
mapWrapper.appendChild(globeButton);

// Nastavení aktivního stavu tlačítka podle aktuálního stavu
if (isGlobeMode) {
    globeButton.classList.add('active');
}

// Funkce pro výpočet trasy s použitím Leaflet Routing Machine - kompletně přepracována pro maximální stabilitu
function calculateRouteFunction() {
    console.log('Calculating route...');

    try {
        // Kontrola počtu markerů
        if (!markers || !Array.isArray(markers)) {
            console.error('Markers array is not properly initialized');
            addMessage('Došlo k chybě při výpočtu trasy - markery nejsou správně inicializovány.', true);
            return null;
        }

        console.log('Number of markers:', markers.length);

        // Kontrola, zda máme dostatek bodů pro výpočet trasy
        if (markers.length < 2) {
            addMessage('Pro výpočet trasy jsou potřeba alespoň 2 body', false);
            return null;
        }

        // Získání bodů pro výpočet trasy s ošetřením chyb
        const points = [];
        try {
            for (let i = 0; i < markers.length; i++) {
                const marker = markers[i];
                if (marker) {
                    try {
                        const latLng = marker.getLatLng();
                        if (latLng && typeof latLng.lat === 'number' && typeof latLng.lng === 'number') {
                            points.push(latLng);
                        } else {
                            console.warn(`Invalid coordinates for marker ${i}, skipping`);
                        }
                    } catch (markerError) {
                        console.error(`Error getting coordinates for marker ${i}:`, markerError);
                    }
                }
            }
        } catch (pointsError) {
            console.error('Error collecting route points:', pointsError);
        }

        console.log('Route points collected:', points.length);

        // Kontrola, zda máme dostatek platných bodů
        if (points.length < 2) {
            addMessage('Pro výpočet trasy jsou potřeba alespoň 2 platné body', false);
            return null;
        }

        // Odstranění předchozí trasy, pokud existuje
        try {
            if (routeControl) {
                try {
                    map.removeControl(routeControl);
                    console.log('Previous route control removed');
                } catch (error) {
                    console.error('Error removing previous route control:', error);
                } finally {
                    routeControl = null;
                }
            }
        } catch (routeControlError) {
            console.error('Error handling route control:', routeControlError);
            routeControl = null;
        }

        // Odstranění přímé trasy, pokud existuje
        try {
            if (route) {
                try {
                    map.removeLayer(route);
                    console.log('Previous direct route removed');
                } catch (error) {
                    console.error('Error removing previous direct route:', error);
                } finally {
                    route = null;
                }
            }
        } catch (routeError) {
            console.error('Error handling direct route:', routeError);
            route = null;
        }

        // Odstranění tříd pro optimalizaci před vytvořením nové trasy
        try {
            document.body.classList.remove('map-zooming', 'map-moving');
            const routingPane = document.querySelector('.leaflet-overlay-pane');
            if (routingPane) {
                routingPane.classList.remove('zooming', 'moving');
            }
        } catch (classError) {
            console.error('Error removing optimization classes:', classError);
        }

        // Vytvoření nové trasy s přímou čárou
        try {
            console.log('Creating direct route with points:', points.length);

            // Vytvoření polyline s ošetřením chyb
            try {
                route = L.polyline(points, {
                    color: 'blue',
                    weight: 4,
                    opacity: 0.8,
                    dashArray: '5, 10'
                });

                // Přidání trasy na mapu
                route.addTo(map);
                console.log('Direct route created and added to map');
            } catch (polylineError) {
                console.error('Error creating polyline:', polylineError);
                addMessage('Došlo k chybě při vytváření trasy. Zkuste to prosím znovu.', true);
                return null;
            }

            // Výpočet přibližné vzdálenosti přímé trasy
            let distance = 0;
            try {
                for (let i = 0; i < points.length - 1; i++) {
                    distance += points[i].distanceTo(points[i+1]);
                }
                console.log('Route distance calculated:', distance);
            } catch (distanceError) {
                console.error('Error calculating distance:', distanceError);
                distance = 0; // Použití výchozí hodnoty v případě chyby
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
            try {
                if (routeDistanceElement) routeDistanceElement.textContent = `${distanceKm} km (přímá trasa)`;
                if (routeTimeElement) routeTimeElement.textContent = timeString;
                console.log('Route info updated in panel');
            } catch (infoError) {
                console.error('Error updating route info in panel:', infoError);
            }

            // Přidání zprávy do chatu s informacemi o trase
            addMessage(`Trasa vypočítána. Celková vzdálenost: ${distanceKm} km, přibližný čas cesty: ${timeString}`, false);

            // Přizpůsobení mapy, aby zobrazovala celou trasu
            try {
                const bounds = route.getBounds();
                if (bounds) {
                    map.fitBounds(bounds, {padding: [50, 50]});
                    console.log('Map fitted to route bounds');
                }
            } catch (boundsError) {
                console.error('Error fitting map to route bounds:', boundsError);
            }

            // Uložení stavu aplikace po výpočtu trasy
            try {
                saveAppState();
                console.log('App state saved after route calculation');
            } catch (saveError) {
                console.error('Error saving app state after route calculation:', saveError);
            }

            // Aktualizace glóbusu, pokud je aktivní
            try {
                if (isGlobeMode && cesiumViewer) {
                    addRoutesToGlobe();
                    console.log('Globe routes updated');
                }
            } catch (globeError) {
                console.error('Error updating globe routes:', globeError);
            }

            console.log('Route calculation completed successfully');
            return route;
        } catch (routeCreationError) {
            console.error('Error in route creation process:', routeCreationError);
            addMessage('Došlo k chybě při vytváření trasy. Zkuste to prosím znovu.', true);
            return null;
        }
    } catch (error) {
        console.error('Critical error in route calculation:', error);
        addMessage('Kritická chyba při výpočtu trasy. Zkuste to prosím znovu.', true);
        return null;
    }
}

// Event listener pro tlačítko výpočtu trasy s robustním ošetřením chyb
try {
    const calculateRouteBtn = document.getElementById('calculateRoute');
    if (calculateRouteBtn) {
        // Odstranění všech existujících event listenerů pro prevenci duplicit
        const newCalculateRouteBtn = calculateRouteBtn.cloneNode(true);
        calculateRouteBtn.parentNode.replaceChild(newCalculateRouteBtn, calculateRouteBtn);

        // Přidání nového event listeneru
        newCalculateRouteBtn.addEventListener('click', (event) => {
            try {
                console.log('Calculate route button clicked');
                // Zastavení propagace události
                event.preventDefault();
                event.stopPropagation();

                // Zobrazení informace o výpočtu trasy
                addMessage('Probíhá výpočet trasy...', false);

                // Použití setTimeout pro lepší odezvu UI
                setTimeout(() => {
                    try {
                        // Vyvolání funkce pro výpočet trasy
                        const result = calculateRouteFunction();
                        console.log('Route calculation result:', result ? 'success' : 'failed');
                    } catch (calcError) {
                        console.error('Error calculating route:', calcError);
                        addMessage('Došlo k chybě při výpočtu trasy. Zkuste to prosím znovu.', true);
                    }
                }, 100);
            } catch (error) {
                console.error('Error in calculateRoute click handler:', error);
                addMessage('Došlo k chybě při výpočtu trasy. Zkuste to prosím znovu.', true);
            }
        });
        console.log('Calculate route button event listener added');
    } else {
        console.error('Calculate route button not found');
    }
} catch (setupError) {
    console.error('Error setting up calculateRoute button:', setupError);
}

// Tlačítko pro vymazání mapy s robustním ošetřením chyb
try {
    const clearMapBtn = document.getElementById('clearMap');
    if (clearMapBtn) {
        // Odstranění všech existujících event listenerů pro prevenci duplicit
        const newClearMapBtn = clearMapBtn.cloneNode(true);
        clearMapBtn.parentNode.replaceChild(newClearMapBtn, clearMapBtn);

        // Přidání nového event listeneru
        newClearMapBtn.addEventListener('click', (event) => {
            try {
                console.log('Clear map button clicked');
                // Zastavení propagace události
                event.preventDefault();
                event.stopPropagation();

                // Vymazání všech bodů s ošetřením chyb
                try {
                    if (markers && Array.isArray(markers)) {
                        markers.forEach(marker => {
                            try {
                                if (marker) {
                                    map.removeLayer(marker);
                                }
                            } catch (removeError) {
                                console.error('Error removing marker:', removeError);
                            }
                        });
                    }
                    markers = [];
                    console.log('All markers removed');
                } catch (markersError) {
                    console.error('Error clearing markers:', markersError);
                    markers = [];
                }

                // Reset vlastností markerů
                try {
                    markerProperties = [];
                    console.log('Marker properties reset');
                } catch (propertiesError) {
                    console.error('Error resetting marker properties:', propertiesError);
                    markerProperties = [];
                }

                // Vymazání trasy vytvořené pomocí Leaflet Routing Machine
                try {
                    if (routeControl) {
                        map.removeControl(routeControl);
                        routeControl = null;
                        console.log('Route control removed');
                    }
                } catch (routeControlError) {
                    console.error('Error removing route control:', routeControlError);
                    routeControl = null;
                }

                // Vymazání záložní trasy (přímá čára), pokud existuje
                try {
                    if (route) {
                        map.removeLayer(route);
                        route = null;
                        console.log('Direct route removed');
                    }
                } catch (routeError) {
                    console.error('Error removing direct route:', routeError);
                    route = null;
                }

                // Reset informací o trase
                try {
                    if (routeDistanceElement) routeDistanceElement.textContent = '-';
                    if (routeTimeElement) routeTimeElement.textContent = '-';
                    console.log('Route info reset');
                } catch (infoError) {
                    console.error('Error resetting route info:', infoError);
                }

                // Informace pro uživatele
                addMessage('Mapa byla vyčištěna. Všechny body a trasy byly odstraněny.', false);

                // Uložení stavu aplikace po vymazání mapy
                try {
                    saveAppState();
                    console.log('App state saved after clearing map');
                } catch (saveError) {
                    console.error('Error saving app state after clearing map:', saveError);
                }
            } catch (error) {
                console.error('Error in clearMap click handler:', error);
                addMessage('Došlo k chybě při čištění mapy. Zkuste to prosím znovu.', true);
            }
        });
        console.log('Clear map button event listener added');
    } else {
        console.error('Clear map button not found');
    }
} catch (setupError) {
    console.error('Error setting up clearMap button:', setupError);
}

// Tlačítko pro tisk mapy s robustním ošetřením chyb
try {
    const printMapBtn = document.getElementById('printMap');
    if (printMapBtn) {
        // Odstranění všech existujících event listenerů pro prevenci duplicit
        const newPrintMapBtn = printMapBtn.cloneNode(true);
        printMapBtn.parentNode.replaceChild(newPrintMapBtn, printMapBtn);

        // Přidání nového event listeneru
        newPrintMapBtn.addEventListener('click', (event) => {
            try {
                console.log('Print map button clicked');
                // Zastavení propagace události
                event.preventDefault();
                event.stopPropagation();

                // Informace pro uživatele
                addMessage('Připravuji mapu pro tisk...', false);

                // Použití setTimeout pro lepší odezvu UI
                setTimeout(() => {
                    try {
                        // Pokus o tisk
                        window.print();
                        console.log('Print dialog opened');
                        addMessage('Mapa připravena k tisku', false);
                    } catch (printError) {
                        console.error('Error printing map:', printError);
                        addMessage('Došlo k chybě při tisku mapy. Zkuste to prosím znovu.', true);
                    }
                }, 1000);
            } catch (error) {
                console.error('Error in printMap click handler:', error);
                addMessage('Došlo k chybě při přípravě tisku. Zkuste to prosím znovu.', true);
            }
        });
        console.log('Print map button event listener added');
    } else {
        console.error('Print map button not found');
    }
} catch (setupError) {
    console.error('Error setting up printMap button:', setupError);
}

// Fullscreen režim pro mapu
const fullscreenButton = document.getElementById('fullscreenButton');
const mapWrapper = document.querySelector('.map-wrapper');
const fullscreenOverlay = document.querySelector('.fullscreen-overlay');

// Funkce pro přepnutí fullscreen režimu
function toggleFullscreen() {
    console.log('Toggling fullscreen mode');
    isFullscreen = !isFullscreen;
    console.log('Fullscreen mode:', isFullscreen);

    if (isFullscreen) {
        try {
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
            console.log('Exit fullscreen button added');

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
            console.log('Add activity button created');
        } catch (error) {
            console.error('Error setting up fullscreen mode:', error);
        }

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

        // 3D režim byl odstraněn v verzi 0.2.5

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
        try {
            mapWrapper.classList.remove('map-fullscreen');
            fullscreenButton.innerHTML = '<i class="icon">⛶</i>'; // Symbol pro fullscreen
            document.body.style.overflow = ''; // Obnovení scrollování

            // Odstranění třídy pro lepší zobrazení mapy
            document.body.classList.remove('fullscreen-mode');

            // Odstranění tlačítka pro rychlý návrat z fullscreen režimu
            const exitFullscreenButton = document.getElementById('exitFullscreenButton');
            if (exitFullscreenButton) {
                exitFullscreenButton.remove();
                console.log('Exit fullscreen button removed');
            }

            // Odstranění ovládacích tlačítek z fullscreen režimu
            const fullscreenControls = document.getElementById('fullscreenControls');
            if (fullscreenControls) {
                fullscreenControls.remove();
                console.log('Fullscreen controls removed');
            }

            // Odstranění plovoucího chatu
            removeFloatingChat();
            console.log('Floating chat removed');
        } catch (error) {
            console.error('Error exiting fullscreen mode:', error);
        }
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

// Funkce pro 3D režim byly odstraněny v verzi 0.2.5

// Funkce pro přepnutí glóbus režimu
function toggleGlobeMode() {
    const toggleGlobeBtn = document.getElementById('toggleGlobeMode');

    isGlobeMode = !isGlobeMode;

    if (isGlobeMode) {
        console.log('Aktivace glóbus režimu');

        // Aktivace glóbus režimu
        toggleGlobeBtn.classList.add('active');

        // Přidání třídy pro glóbus režim
        document.getElementById('map').classList.add('map-globe-mode');

        // Uložení aktuálního středu mapy
        const center = map.getCenter();
        console.log('Střed mapy:', center);

        try {
            console.log('Inicializace Cesium Vieweru');

            // Nastavení přístupového tokenu pro Cesium ion
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjg0MTU3Mn0.XcKpgANiY22ZtIiqSWFmj2XlPQd5HGDA-9N2FAB_5_4';

            // Odstranění předchozího Cesium Vieweru, pokud existuje
            if (cesiumViewer) {
                try {
                    cesiumViewer.destroy();
                } catch (e) {
                    console.error('Chyba při odstranění předchozího Cesium Vieweru:', e);
                }
                cesiumViewer = null;
                console.log('Předchozí Cesium Viewer byl odstraněn');
            }

            // Získání reference na Cesium kontejner
            const cesiumContainer = document.getElementById('cesiumContainer');

            // Ujistíme se, že kontejner je prázdný
            cesiumContainer.innerHTML = '';

            // Nastavení stylu kontejneru
            cesiumContainer.style.display = 'block';
            cesiumContainer.style.width = '100%';
            cesiumContainer.style.height = '100%';
            cesiumContainer.style.position = 'absolute';
            cesiumContainer.style.top = '0';
            cesiumContainer.style.left = '0';
            cesiumContainer.style.zIndex = '1000';

            // Vytvoření nového Cesium Vieweru s optimalizovaným nastavením
            cesiumViewer = new Cesium.Viewer('cesiumContainer', {
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
                navigationInstructionsInitiallyVisible: false,
                imageryProvider: new Cesium.IonImageryProvider({ assetId: 3 }),
                terrainProvider: Cesium.createWorldTerrain(),
                requestRenderMode: true,
                maximumRenderTimeChange: 0,
                targetFrameRate: 60,
                useBrowserRecommendedResolution: true
            });

            console.log('Cesium Viewer byl vytvořen');

            // Nastavení scény pro lepší vzhled
            cesiumViewer.scene.globe.enableLighting = true;
            cesiumViewer.scene.skyAtmosphere.show = true;
            cesiumViewer.scene.fog.enabled = false;
            cesiumViewer.scene.globe.depthTestAgainstTerrain = true;
            cesiumViewer.scene.globe.showGroundAtmosphere = true;
            cesiumViewer.scene.globe.maximumScreenSpaceError = 2.0; // Lepší kvalita terénu
            cesiumViewer.scene.highDynamicRange = true; // Lepší vizualní kvalita

            // Odstranění výchozího loga Cesium
            cesiumViewer.cesiumWidget.creditContainer.style.display = 'none';

            // Nastavení výchozího pohledu
            cesiumViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 2000000),
                orientation: {
                    heading: 0.0,
                    pitch: -0.5,
                    roll: 0.0
                },
                duration: 1.0,
                complete: function() {
                    // Po dokončení animace přidáme markery a trasy
                    try {
                        // Přidání markerů na glóbus
                        addMarkersToGlobe();
                        console.log('Markery byly přidány na glóbus');

                        // Přidání tras mezi body na glóbusu
                        addRoutesToGlobe();
                        console.log('Trasy byly přidány na glóbus');

                        // Vynucení překreslení scény
                        if (cesiumViewer && cesiumViewer.scene) {
                            cesiumViewer.scene.requestRender();
                            console.log('Scéna byla překreslena');
                        }
                    } catch (error) {
                        console.error('Chyba při přidávání obsahu na glóbus:', error);
                    }
                }
            });

            console.log('Výchozí pohled byl nastaven');

            // Přidání ovládacích prvků pro glóbus
            addGlobeControls();
            console.log('Ovládací prvky byly přidány');

        } catch (error) {
            console.error('Chyba při inicializaci Cesium Vieweru:', error);
            addMessage('Nepodařilo se inicializovat 3D glóbus. Zkuste to prosím znovu.', true);
            isGlobeMode = false;
            toggleGlobeBtn.classList.remove('active');
            document.getElementById('map').classList.remove('map-globe-mode');
            return;
        }

        // Informace pro uživatele
        addMessage('Glóbus režim byl aktivován. Nyní můžete vidět Zemi jako 3D kouli. Použijte ovládací prvky pro rotaci a přiblížení.', false);
    } else {
        console.log('Deaktivace glóbus režimu');

        // Deaktivace glóbus režimu
        toggleGlobeBtn.classList.remove('active');

        // Odstranění třídy pro glóbus režim
        document.getElementById('map').classList.remove('map-globe-mode');

        try {
            // Odstranění ovládacích prvků pro glóbus
            removeGlobeControls();

            // Vyčištění markerů na glóbusu
            if (cesiumViewer) {
                try {
                    cesiumViewer.entities.removeAll();
                    console.log('Všechny entity byly odstraněny');
                } catch (e) {
                    console.error('Chyba při odstraňování entit:', e);
                }
            }

            // Skrytí Cesium kontejneru
            const cesiumContainer = document.getElementById('cesiumContainer');
            if (cesiumContainer) {
                cesiumContainer.style.display = 'none';
                console.log('Cesium kontejner byl skryt');
            }

            // Zobrazení Leaflet mapy
            const leafletContainer = document.querySelector('.leaflet-container');
            if (leafletContainer) {
                leafletContainer.style.display = 'block';
                console.log('Leaflet mapa byla zobrazena');
            }

            // Aktualizace velikosti mapy
            setTimeout(() => {
                map.invalidateSize();
                console.log('Velikost mapy byla aktualizována');
            }, 100);

            // Reset globálních proměnných
            globeMarkers = [];
        } catch (error) {
            console.error('Chyba při deaktivaci glóbus režimu:', error);
        }

        // Informace pro uživatele
        addMessage('Glóbus režim byl deaktivován. Mapa je nyní v klasickém 2D zobrazení.', false);
    }
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

            // Získání barvy podle indexu (stejné barvy jako na 2D mapě)
            const colorIndex = (index % 5) + 1;
            let markerColor;
            switch(colorIndex) {
                case 1: markerColor = Cesium.Color.fromCssColorString('#8B5CF6'); break; // Fialová
                case 2: markerColor = Cesium.Color.fromCssColorString('#EC4899'); break; // Růžová
                case 3: markerColor = Cesium.Color.fromCssColorString('#10B981'); break; // Zelená
                case 4: markerColor = Cesium.Color.fromCssColorString('#F59E0B'); break; // Oranžová
                case 5: markerColor = Cesium.Color.fromCssColorString('#3B82F6'); break; // Modrá
                default: markerColor = Cesium.Color.fromCssColorString('#8B5CF6'); break; // Výchozí fialová
            }

            // Vytvoření entity pro marker s vylepšeným vzhledem
            const globeMarker = cesiumViewer.entities.add({
                name: markerName,
                position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 0),
                point: {
                    pixelSize: 20,
                    color: markerColor,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY // Vždy viditelné
                },
                label: {
                    text: `${index + 1}`,
                    font: '16px sans-serif',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    showBackground: false,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY, // Vždy viditelné
                    pixelOffset: new Cesium.Cartesian2(0, 0)
                },
                // Přidání popup informací při kliknutí
                description: `<h3>${markerName}</h3><p>Souřadnice: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}</p>`
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
                duration: 1.5,
                complete: function() {
                    // Vynucení překreslení scény po dokončení animace
                    if (cesiumViewer && cesiumViewer.scene) {
                        cesiumViewer.scene.requestRender();
                    }
                }
            });
        }
    } catch (error) {
        console.error('Chyba při přidávání markerů na glóbus:', error);
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

        // Vytvoření entity pro trasu s vylepšeným vzhledem
        const routeEntity = cesiumViewer.entities.add({
            name: 'Trasa',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
                width: 5,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: Cesium.Color.fromCssColorString('#8B5CF6'), // Fialová barva odpovídající tématu
                    taperPower: 0.5 // Efekt zúžení na koncích
                }),
                clampToGround: true,
                classificationType: Cesium.ClassificationType.TERRAIN, // Trasa sleduje terén
                arcType: Cesium.ArcType.GEODESIC, // Geodetická křivka (nejkratší cesta po povrchu koule)
                zIndex: 100 // Zajistí, že trasa bude nad terénem
            }
        });

        // Přidání entity do pole markerů
        globeMarkers.push(routeEntity);

        // Přidání bodů na trase pro lepší vizualizaci
        for (let i = 0; i < markers.length - 1; i++) {
            const startPos = markers[i].getLatLng();
            const endPos = markers[i + 1].getLatLng();

            // Vytvoření entity pro úsek trasy s popiskem vzdálenosti
            const distance = startPos.distanceTo(endPos) / 1000; // Vzdálenost v km
            const midLat = (startPos.lat + endPos.lat) / 2;
            const midLng = (startPos.lng + endPos.lng) / 2;

            // Přidání popisku vzdálenosti na střed úseku
            const distanceLabel = cesiumViewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(midLng, midLat, 1000), // Mírně nad povrchem
                label: {
                    text: `${distance.toFixed(1)} km`,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    pixelOffset: new Cesium.Cartesian2(0, -10),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY, // Vždy viditelné
                    showBackground: true,
                    backgroundColor: Cesium.Color.fromCssColorString('rgba(139, 92, 246, 0.7)') // Poloprůhledná fialová
                }
            });

            // Přidání entity do pole markerů
            globeMarkers.push(distanceLabel);
        }

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
    console.log('Saving application state...');
    try {
        // Kontrola dostupnosti localStorage
        if (!window.localStorage) {
            console.error('localStorage is not available');
            return false;
        }

        // Uložení markerů a jejich vlastností
        const markersData = [];

        // Kontrola existence pole markerů
        if (!markers || !Array.isArray(markers)) {
            console.warn('Markers array is not properly initialized');
            // Vytvoření prázdného pole pro markery
            markers = [];
        }

        // Zpracování markerů s robustním ošetřením chyb
        for (let i = 0; i < markers.length; i++) {
            try {
                const marker = markers[i];
                if (!marker) {
                    console.warn(`Marker at index ${i} is undefined, skipping`);
                    continue;
                }

                // Získání vlastností markeru nebo vytvoření výchozích hodnot
                let props;
                try {
                    props = markerProperties[i] || { name: `Bod ${i + 1}`, command: `bod${i + 1}` };
                } catch (propsError) {
                    console.warn(`Error getting marker properties for index ${i}, using defaults:`, propsError);
                    props = { name: `Bod ${i + 1}`, command: `bod${i + 1}` };
                }

                // Získání souřadnic markeru
                let lat, lng;
                try {
                    const latLng = marker.getLatLng();
                    lat = latLng.lat;
                    lng = latLng.lng;
                } catch (latLngError) {
                    console.warn(`Error getting marker coordinates for index ${i}, using defaults:`, latLngError);
                    lat = 0;
                    lng = 0;
                }

                // Přidání dat markeru do pole
                markersData.push({
                    lat: lat,
                    lng: lng,
                    properties: props
                });
            } catch (markerError) {
                console.error(`Error processing marker at index ${i}:`, markerError);
            }
        }
        console.log(`Processed ${markersData.length} markers for saving`);

        // Uložení nastavení aplikace
        let settings = {};
        try {
            const darkModeToggle = document.getElementById('darkModeToggle');
            const activeColorOption = document.querySelector('.color-option.active');

            settings = {
                darkMode: darkModeToggle ? darkModeToggle.checked : false,
                colorScheme: activeColorOption ? activeColorOption.getAttribute('data-color') : 'blue',
                markerStyle: markerStyle || 'circle',
                markerEffectsEnabled: markerEffectsEnabled !== undefined ? markerEffectsEnabled : true
            };
            console.log('Settings prepared for saving:', settings);
        } catch (settingsError) {
            console.error('Error preparing settings for saving:', settingsError);
            // Použij výchozí nastavení v případě chyby
            settings = {
                darkMode: false,
                colorScheme: 'blue',
                markerStyle: 'circle',
                markerEffectsEnabled: true
            };
        }

        // Uložení stavu mapy
        let mapState = {};
        try {
            mapState = {
                center: {
                    lat: map.getCenter().lat,
                    lng: map.getCenter().lng
                },
                zoom: map.getZoom()
            };
            console.log('Map state prepared for saving:', mapState);
        } catch (mapStateError) {
            console.error('Error preparing map state for saving:', mapStateError);
            // Použij výchozí stav mapy v případě chyby
            mapState = {
                center: {
                    lat: 49.1951,
                    lng: 16.6068
                },
                zoom: 13
            };
        }

        // Vytvoření objektu s kompletním stavem aplikace
        const appState = {
            markers: markersData,
            settings: settings,
            mapState: mapState,
            deletedMarkerCommands: deletedMarkerCommands || [],
            lastSaved: new Date().toISOString()
        };

        // Uložení do localStorage s kompresí dat a ošetřením chyb
        try {
            // Kontrola velikosti dat před uložením
            const stateJson = JSON.stringify(appState);
            const stateSize = new Blob([stateJson]).size;
            console.log(`Application state size: ${stateSize} bytes`);

            // Kontrola, zda velikost nepřekračuje limit localStorage (obvykle 5-10 MB)
            if (stateSize > 4 * 1024 * 1024) { // 4 MB jako bezpeční limit
                console.warn('Application state is too large, trying to compress');
                // Zjednodušení stavu - odstranění nepotřebných dat
                const simplifiedState = {
                    markers: markersData.map(m => ({
                        lat: parseFloat(m.lat.toFixed(6)), // Snížení přesnosti souřadnic
                        lng: parseFloat(m.lng.toFixed(6)),
                        properties: {
                            name: m.properties.name,
                            command: m.properties.command,
                            saved: m.properties.saved
                        }
                    })),
                    settings: settings,
                    mapState: appState.mapState,
                    lastSaved: new Date().toISOString()
                };

                // Pokus o uložení zjednodušeného stavu
                const simplifiedJson = JSON.stringify(simplifiedState);
                localStorage.setItem('aiMapAppState', simplifiedJson);
                console.log('Compressed application state saved successfully');
                return true;
            } else {
                // Standardní uložení, pokud je velikost v pořádku
                localStorage.setItem('aiMapAppState', stateJson);
                console.log('Application state successfully saved');
                return true;
            }
        } catch (storageError) {
            console.error('Error saving to localStorage:', storageError);

            // Pokus o uložení minimálního stavu v případě chyby
            try {
                // Vytvoření extrémně zjednodušeného stavu
                const minimalState = {
                    markers: markersData.map(m => ({ lat: parseFloat(m.lat.toFixed(4)), lng: parseFloat(m.lng.toFixed(4)) })),
                    settings: {
                        darkMode: settings.darkMode,
                        colorScheme: settings.colorScheme
                    },
                    lastSaved: new Date().toISOString()
                };

                // Pokus o uložení minimálního stavu
                localStorage.setItem('aiMapAppState', JSON.stringify(minimalState));
                console.log('Minimal application state saved as fallback');
                return true;
            } catch (fallbackError) {
                console.error('Failed to save even minimal state:', fallbackError);

                // Poslední pokus - vyčistít localStorage a uložit pouze nastavení
                try {
                    localStorage.removeItem('aiMapAppState');
                    localStorage.setItem('aiMapAppState', JSON.stringify({ settings: { darkMode: settings.darkMode } }));
                    console.log('Only basic settings saved as last resort');
                    return true;
                } catch (lastResortError) {
                    console.error('All attempts to save state failed:', lastResortError);
                    return false;
                }
            }
        }
    } catch (error) {
        console.error('Unexpected error in saveAppState:', error);
        return false;
    }
}

// Funkce pro načtení stavu aplikace z localStorage
function loadAppState() {
    console.log('Loading application state...');
    try {
        // Kontrola dostupnosti localStorage
        if (!window.localStorage) {
            console.error('localStorage is not available');
            return false;
        }

        // Pokus o získání uloženého stavu
        let savedState;
        try {
            savedState = localStorage.getItem('aiMapAppState');
        } catch (storageError) {
            console.error('Error accessing localStorage:', storageError);
            return false;
        }

        // Kontrola existence uloženého stavu
        if (!savedState) {
            console.log('No saved application state found.');
            return false;
        }

        // Parsování JSON
        let appState;
        try {
            appState = JSON.parse(savedState);
            console.log('Application state loaded successfully');

            // Validace načteného stavu
            if (!appState || typeof appState !== 'object') {
                console.error('Invalid application state format');
                return false;
            }
        } catch (parseError) {
            console.error('Error parsing saved state:', parseError);
            return false;
        }

        // Načtení nastavení aplikace
        if (appState.settings) {
            try {
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
                    console.log('Dark mode setting applied:', appState.settings.darkMode);
                }

                // Nastavení barevného schématu
                if (appState.settings.colorScheme) {
                    const colorOptions = document.querySelectorAll('.color-option');
                    let colorApplied = false;

                    colorOptions.forEach(option => {
                        option.classList.remove('active');
                        if (option.getAttribute('data-color') === appState.settings.colorScheme) {
                            option.classList.add('active');
                            colorApplied = true;

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

                    if (!colorApplied && colorOptions.length > 0) {
                        // Pokud není nalezena odpovídající barva, použij první dostupnou
                        colorOptions[0].classList.add('active');
                        document.documentElement.style.setProperty('--primary-color', '#8B5CF6');
                    }

                    console.log('Color scheme applied:', appState.settings.colorScheme);
                }

                // Nastavení stylu markerů
                if (appState.settings.markerStyle) {
                    markerStyle = appState.settings.markerStyle;

                    // Aktualizace aktivního stylu v UI
                    const markerStyleOptions = document.querySelectorAll('.marker-style-option');
                    let styleApplied = false;

                    markerStyleOptions.forEach(option => {
                        option.classList.remove('active');
                        if (option.getAttribute('data-marker-style') === markerStyle) {
                            option.classList.add('active');
                            styleApplied = true;
                        }
                    });

                    if (!styleApplied && markerStyleOptions.length > 0) {
                        // Pokud není nalezen odpovídající styl, použij první dostupný
                        markerStyleOptions[0].classList.add('active');
                        markerStyle = markerStyleOptions[0].getAttribute('data-marker-style') || 'circle';
                    }

                    console.log('Marker style applied:', markerStyle);
                }

                // Nastavení efektů markerů
                if (appState.settings.markerEffectsEnabled !== undefined) {
                    markerEffectsEnabled = appState.settings.markerEffectsEnabled;

                    // Aktualizace přepínače v UI
                    const markerEffectsToggle = document.getElementById('markerEffectsToggle');
                    if (markerEffectsToggle) {
                        markerEffectsToggle.checked = markerEffectsEnabled;
                    }
                    console.log('Marker effects setting applied:', markerEffectsEnabled);
                }
            } catch (settingsError) {
                console.error('Error applying settings:', settingsError);
            }
        }

        // Načtení stavu mapy
        if (appState.mapState) {
            try {
                map.setView(
                    [appState.mapState.center.lat, appState.mapState.center.lng],
                    appState.mapState.zoom
                );
                console.log('Map state applied');
            } catch (mapError) {
                console.error('Error applying map state:', mapError);
            }
        }

        // Načtení smazaných příkazů
        if (appState.deletedMarkerCommands && Array.isArray(appState.deletedMarkerCommands)) {
            try {
                deletedMarkerCommands = appState.deletedMarkerCommands;
                console.log(`Loaded ${deletedMarkerCommands.length} deleted marker commands`);
            } catch (commandsError) {
                console.error('Error loading deleted commands:', commandsError);
                deletedMarkerCommands = [];
            }
        }

        // Načtení markerů
        if (appState.markers && Array.isArray(appState.markers) && appState.markers.length > 0) {
            try {
                // Odstranění všech stávajících markerů
                markers.forEach(marker => {
                    try {
                        map.removeLayer(marker);
                    } catch (removeError) {
                        console.error('Error removing existing marker:', removeError);
                    }
                });
                markers = [];
                markerProperties = [];
                console.log('Existing markers cleared');

                // Přidání uložených markerů
                let successfullyLoadedMarkers = 0;

                for (let i = 0; i < appState.markers.length; i++) {
                    try {
                        const markerData = appState.markers[i];
                        if (!markerData || !markerData.lat || !markerData.lng) {
                            console.warn(`Invalid marker data at index ${i}, skipping`);
                            continue;
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

                        // Kontrola a oprava vlastností markeru
                        if (!markerData.properties) {
                            markerData.properties = {
                                name: `Bod ${markerIndex + 1}`,
                                command: `bod${markerIndex + 1}`,
                                saved: true
                            };
                        }

                        markerProperties[markerIndex] = markerData.properties;

                        // Nastavení příznaku saved na true pro načtené body (pro zpětnou kompatibilitu)
                        if (markerProperties[markerIndex].saved === undefined) {
                            markerProperties[markerIndex].saved = true;
                        }

                        // Přidání popup s formulářem
                        try {
                            marker.bindPopup(createPopupContent(marker, markerIndex), {
                                className: 'marker-popup',
                                maxWidth: 350,
                                minWidth: 250,
                                autoPan: true,
                                autoPanPadding: [50, 50],
                                closeOnClick: false,
                                autoClose: false
                            });
                        } catch (popupError) {
                            console.error(`Error binding popup for marker ${markerIndex}:`, popupError);
                        }

                        // Přidání event listenerů pro marker
                        try {
                            setupMarkerEventListeners(marker, markerIndex);
                        } catch (listenerError) {
                            console.error(`Error setting up listeners for marker ${markerIndex}:`, listenerError);
                        }

                        successfullyLoadedMarkers++;
                    } catch (markerError) {
                        console.error(`Error loading marker at index ${i}:`, markerError);
                    }
                }

                console.log(`Successfully loaded ${successfullyLoadedMarkers} of ${appState.markers.length} markers`);

                // Pokud máme alespoň dva body, vypočítáme trasu
                if (markers.length >= 2) {
                    try {
                        calculateRouteFunction();
                    } catch (routeError) {
                        console.error('Error calculating route:', routeError);
                    }
                }

                addMessage(`Načteno ${successfullyLoadedMarkers} bodů z předchozího sezení.`, false);
            } catch (markersError) {
                console.error('Error loading markers:', markersError);
            }
        }

        return true;
    } catch (error) {
        console.error('Unexpected error loading application state:', error);
        return false;
    }
}

// Funkce pro nastavení event listenerů pro marker
function setupMarkerEventListeners(marker, markerIndex) {
    console.log(`Setting up event listeners for marker ${markerIndex}`);
    try {
        // Přidání event listeneru pro přesunutí markeru
        marker.on('dragend', function() {
            console.log(`Marker ${markerIndex} dragged`);
            try {
                const newPos = marker.getLatLng();
                console.log(`New position for marker ${markerIndex}: [${newPos.lat}, ${newPos.lng}]`);

                // Aktualizace souřadnic v properties
                if (markerProperties[markerIndex]) {
                    markerProperties[markerIndex].lat = newPos.lat.toFixed(4);
                    markerProperties[markerIndex].lng = newPos.lng.toFixed(4);
                    console.log(`Updated coordinates in properties for marker ${markerIndex}`);
                }

                // Aktualizace popup obsahu
                try {
                    const newContent = createPopupContent(marker, markerIndex);
                    marker.setPopupContent(newContent);
                    console.log(`Popup content updated for marker ${markerIndex} after drag`);
                } catch (popupError) {
                    console.error(`Error updating popup content for marker ${markerIndex} after drag:`, popupError);
                }

                // Pokud máme alespoň dva body, přepočítáme trasu
                if (markers.length >= 2) {
                    try {
                        calculateRouteFunction();
                        console.log('Route recalculated after marker drag');
                    } catch (routeError) {
                        console.error('Error recalculating route after marker drag:', routeError);
                    }
                }

                // Aktualizace glóbusu, pokud je aktivní
                if (isGlobeMode && cesiumViewer) {
                    try {
                        addMarkersToGlobe();
                        addRoutesToGlobe();
                        console.log('Globe updated after marker drag');
                    } catch (globeError) {
                        console.error('Error updating globe after marker drag:', globeError);
                    }
                }

                // Uložení stavu aplikace po přesunutí markeru
                try {
                    saveAppState();
                    console.log('Application state saved after marker drag');
                } catch (saveError) {
                    console.error('Error saving application state after marker drag:', saveError);
                }
            } catch (dragError) {
                console.error(`Error handling drag event for marker ${markerIndex}:`, dragError);
            }
        });

        // Přidání event listeneru pro kliknutí na marker
        marker.on('click', function() {
            console.log(`Marker ${markerIndex} clicked`);
            try {
                // Zrušení předchozího časovače, pokud existuje
                if (popupTimers[markerIndex]) {
                    try {
                        clearTimeout(popupTimers[markerIndex]);
                        console.log(`Previous popup timer cleared for marker ${markerIndex}`);
                    } catch (clearError) {
                        console.error(`Error clearing previous popup timer for marker ${markerIndex}:`, clearError);
                    }
                }

                // Nastavení nového časovače
                popupTimers[markerIndex] = setTimeout(() => {
                    try {
                        if (marker.isPopupOpen()) {
                            marker.closePopup();
                            console.log(`Popup automatically closed for marker ${markerIndex} after timeout`);
                        }
                        delete popupTimers[markerIndex];
                    } catch (closeError) {
                        console.error(`Error closing popup for marker ${markerIndex} after timeout:`, closeError);
                    }
                }, 35000); // 35 sekund
                console.log(`New popup timer set for marker ${markerIndex}`);
            } catch (clickError) {
                console.error(`Error handling click event for marker ${markerIndex}:`, clickError);
            }
        });

        // Přidání event listeneru pro otevření popup okna
        marker.on('popupopen', function() {
            console.log(`Popup opened for marker ${markerIndex}`);
            try {
                // Zrušení všech předchozích intervalů pro odpočet
                try {
                    Object.keys(countdownIntervals).forEach(key => {
                        if (key.startsWith(`countdown-${markerIndex}-`)) {
                            clearInterval(countdownIntervals[key]);
                            delete countdownIntervals[key];
                            console.log(`Previous countdown interval cleared: ${key}`);
                        }
                    });
                } catch (intervalError) {
                    console.error(`Error clearing countdown intervals for marker ${markerIndex}:`, intervalError);
                }

                // Spuštění odpočtu
                try {
                    const countdownId = `countdown-${markerIndex}`;
                    const countdownElement = document.getElementById(countdownId);
                    if (countdownElement) {
                        startCountdown(countdownId, 35);
                        console.log(`Countdown started for marker ${markerIndex} with ID: ${countdownId}`);
                    } else {
                        console.warn(`Countdown element not found for marker ${markerIndex} with ID: ${countdownId}`);
                    }
                } catch (countdownError) {
                    console.error(`Error starting countdown for marker ${markerIndex}:`, countdownError);
                }
            } catch (popupOpenError) {
                console.error(`Error handling popupopen event for marker ${markerIndex}:`, popupOpenError);
            }
        });

        // Přidání event listeneru pro zavření popup okna
        marker.on('popupclose', function() {
            console.log(`Popup closed for marker ${markerIndex}`);
            try {
                // Zrušení časovače při manuálním zavření popup okna
                if (popupTimers[markerIndex]) {
                    try {
                        clearTimeout(popupTimers[markerIndex]);
                        delete popupTimers[markerIndex];
                        console.log(`Popup timer cleared for marker ${markerIndex} on popup close`);
                    } catch (timerError) {
                        console.error(`Error clearing popup timer for marker ${markerIndex} on popup close:`, timerError);
                    }
                }

                // Zrušení všech intervalů pro odpočet
                try {
                    Object.keys(countdownIntervals).forEach(key => {
                        if (key.startsWith(`countdown-${markerIndex}-`)) {
                            clearInterval(countdownIntervals[key]);
                            delete countdownIntervals[key];
                            console.log(`Countdown interval cleared on popup close: ${key}`);
                        }
                    });
                } catch (intervalError) {
                    console.error(`Error clearing countdown intervals for marker ${markerIndex} on popup close:`, intervalError);
                }
            } catch (popupCloseError) {
                console.error(`Error handling popupclose event for marker ${markerIndex}:`, popupCloseError);
            }
        });

        console.log(`Event listeners successfully set up for marker ${markerIndex}`);
    } catch (error) {
        console.error(`Unexpected error setting up event listeners for marker ${markerIndex}:`, error);
    }
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
        // 3D režim byl odstraněn v verzi 0.2.5
        return 'Funkce 3D režimu byla odstraněna. Použijte prosím glóbus režim pro 3D zobrazení.';
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

// Funkce pro bezpečnou inicializaci aplikace - rozšířená verze s důkladným ošetřením chyb
function initializeApp() {
    console.log('Initializing application...');
    try {
        // Kontrola, zda jsou všechny potřebné DOM elementy načteny
        const requiredElements = ['map', 'chatMessages', 'messageInput', 'sendMessage', 'coordinates', 'routeDistance', 'routeTime'];
        const missingElements = [];

        for (const elementId of requiredElements) {
            if (!document.getElementById(elementId)) {
                missingElements.push(elementId);
            }
        }

        if (missingElements.length > 0) {
            console.error('Missing required DOM elements:', missingElements.join(', '));
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }

        // Kontrola a inicializace globálních proměnných
        window.markers = window.markers || [];
        window.markerProperties = window.markerProperties || [];
        window.popupTimers = window.popupTimers || {};
        window.countdownIntervals = window.countdownIntervals || {};
        window.deletedMarkerCommands = window.deletedMarkerCommands || [];
        window.isAddingPoints = typeof window.isAddingPoints === 'boolean' ? window.isAddingPoints : true;
        window.isFullscreen = typeof window.isFullscreen === 'boolean' ? window.isFullscreen : false;
        window.isGlobeMode = typeof window.isGlobeMode === 'boolean' ? window.isGlobeMode : false;

        console.log('Global variables initialized');

        // Inicializace stavu tlačítek
        try {
            const addActivityBtn = document.getElementById('addActivity');
            if (addActivityBtn) {
                if (isAddingPoints) {
                    addActivityBtn.classList.add('active');
                } else {
                    addActivityBtn.classList.remove('active');
                }
            }

            const globeButton = document.getElementById('toggleGlobeMode');
            if (globeButton) {
                if (isGlobeMode) {
                    globeButton.classList.add('active');
                } else {
                    globeButton.classList.remove('active');
                }
            }

            console.log('Button states initialized');
        } catch (buttonError) {
            console.error('Error initializing button states:', buttonError);
        }

        // Načtení uloženého stavu aplikace
        try {
            const stateLoaded = loadAppState();
            console.log('Application state loaded:', stateLoaded ? 'successfully' : 'no saved state found');

            // Pokud se nepodařilo načíst stav, přidáme výchozí zprávu do chatu
            if (!stateLoaded) {
                // Vyčištění chat okna od výchozích zpráv
                try {
                    const chatMessages = document.getElementById('chatMessages');
                    if (chatMessages) {
                        chatMessages.innerHTML = '';
                        addMessage('Vítejte v aplikaci AIMapa! Jak vám mohu pomoci?', false);
                    }
                } catch (chatError) {
                    console.error('Error initializing chat:', chatError);
                }
            }
        } catch (loadError) {
            console.error('Error loading application state:', loadError);
            // Pokračujeme i při chybě načtení stavu

            // Vyčištění chat okna od výchozích zpráv
            try {
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.innerHTML = '';
                    addMessage('Vítejte v aplikaci AIMapa! Jak vám mohu pomoci?', false);
                    addMessage('Došlo k chybě při načítání uloženého stavu. Začínáme s novou mapou.', true);
                }
            } catch (chatError) {
                console.error('Error initializing chat after state load failure:', chatError);
            }
        }

        // Inicializace event listenerů pro tlačítka
        try {
            // Reinicializace všech event listenerů pro tlačítka
            // Toto je řešeno v samostatných částech kódu pro každé tlačítko
            console.log('Button event listeners will be initialized separately');
        } catch (eventError) {
            console.error('Error setting up event listeners:', eventError);
        }

        // Aktualizace stavu aplikace
        try {
            // Invalidace velikosti mapy pro správné vykreslení
            setTimeout(() => {
                try {
                    map.invalidateSize();
                    console.log('Map size invalidated');

                    // Pokud existuje trasa, přizpůsobíme mapu, aby ji zobrazovala
                    if (route) {
                        try {
                            const bounds = route.getBounds();
                            if (bounds) {
                                map.fitBounds(bounds, {padding: [50, 50]});
                                console.log('Map fitted to route bounds');
                            }
                        } catch (boundsError) {
                            console.error('Error fitting map to route bounds:', boundsError);
                        }
                    }
                } catch (invalidateError) {
                    console.error('Error invalidating map size:', invalidateError);
                }
            }, 500);
        } catch (updateError) {
            console.error('Error updating application state:', updateError);
        }

        // Nastavení statusu aplikace
        try {
            const statusBar = document.querySelector('.status-bar');
            if (statusBar) {
                statusBar.style.backgroundColor = '#064e3b';
                statusBar.innerHTML = '<span class="status-icon" style="color: #6ee7b7;">✓</span> Aplikace je připravena k použití';

                // Automatické skrytí statusu po 5 sekundách
                setTimeout(() => {
                    try {
                        statusBar.style.opacity = '0';
                        statusBar.style.transition = 'opacity 1s ease';

                        // Úplné skrytí po dokončení animace
                        setTimeout(() => {
                            statusBar.style.display = 'none';
                        }, 1000);
                    } catch (hideError) {
                        console.error('Error hiding status bar:', hideError);
                    }
                }, 5000);
            }
        } catch (statusError) {
            console.error('Error updating status bar:', statusError);
        }

        console.log('Application initialized successfully');
        return true;
    } catch (error) {
        console.error('Critical error during application initialization:', error);
        // Zobrazení chybové hlášky uživateli
        try {
            const statusBar = document.querySelector('.status-bar');
            if (statusBar) {
                statusBar.style.backgroundColor = '#7f1d1d';
                statusBar.style.opacity = '1';
                statusBar.style.display = 'flex';
                statusBar.innerHTML = '<span class="status-icon" style="color: #f87171;">✗</span> Došlo k chybě při inicializaci aplikace. Zkuste obnovit stránku.';
            }

            // Pokus o záchranu aplikace
            try {
                // Vyčištění chat okna od výchozích zpráv
                const chatMessages = document.getElementById('chatMessages');
                if (chatMessages) {
                    chatMessages.innerHTML = '';
                    addMessage('Došlo k chybě při inicializaci aplikace. Některé funkce nemusí fungovat správně.', true);
                    addMessage('Zkuste obnovit stránku nebo kontaktujte správce aplikace.', true);
                }

                // Základní inicializace globálních proměnných
                window.markers = [];
                window.markerProperties = [];
                window.popupTimers = {};
                window.countdownIntervals = {};
                window.deletedMarkerCommands = [];
                window.isAddingPoints = true;
                window.isFullscreen = false;
                window.isGlobeMode = false;

                console.log('Basic recovery initialization completed');
            } catch (recoveryError) {
                console.error('Error during recovery initialization:', recoveryError);
            }
        } catch (statusError) {
            console.error('Error updating status bar:', statusError);
        }
        return false;
    }
}

// Spuštění inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM content loaded, initializing application...');
        setTimeout(() => {
            try {
                initializeApp();
            } catch (initError) {
                console.error('Error during delayed initialization:', initError);
            }
        }, 500); // Zpoždění inicializace pro lepší stabilitu
    } catch (error) {
        console.error('Critical error in DOMContentLoaded handler:', error);
    }
});
