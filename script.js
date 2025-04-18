// Inicializace mapy
const map = L.map('map', {
    zoomAnimation: true, // Povolit animaci zoomu
    markerZoomAnimation: true, // Povolit animaci markerů při zoomu
    fadeAnimation: true, // Povolit animaci přechodů
    zoomSnap: 0.5, // Jemnější zoom
    wheelPxPerZoomLevel: 120 // Jemnější zoom kolečkem myši
}).setView([49.8175, 15.4730], 7); // Výchozí pohled na ČR

// Přidání OpenStreetMap podkladu
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
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
        missingRouteTolerance: 0
    },
    show: false, // Nezobrazovat instrukce pro trasu
    showAlternatives: false,
    fitSelectedRoutes: false,
    draggableWaypoints: false,
    createMarker: function() { return null; } // Nepoužívat výchozí markery
};

// Reference na HTML elementy pro informace o trase
const routeDistanceElement = document.getElementById('routeDistance');
const routeTimeElement = document.getElementById('routeTime');

// Proměnná pro ukládání vlastností markerů
let markerProperties = [];

// Proměnná pro ukládání intervalů pro odpočet
let countdownIntervals = {};

// Funkce pro vytvoření popup obsahu s formulářem
function createPopupContent(marker, index) {
    const markerProp = markerProperties[index] || {
        name: `Bod ${index + 1}`,
        command: `bod${index + 1}`,
        lat: marker.getLatLng().lat.toFixed(4),
        lng: marker.getLatLng().lng.toFixed(4)
    };

    // Vytvoření unikátního ID pro odpočet
    const countdownId = `countdown-${index}-${Date.now()}`;

    return `
        <div class="popup-content">
            <div class="popup-header">
                <div class="popup-title">Bod ${index + 1}</div>
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
                    <button class="popup-btn save-btn" onclick="saveMarkerProperties(${index})">Uložit</button>
                    <button class="popup-btn delete-btn" onclick="removeMarker(${index})">Odstranit bod</button>
                </div>
            </div>
        </div>
    `;
}

// Funkce pro spuštění odpočtu
function startCountdown(elementId, seconds) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;

    // Zrušení předchozího intervalu, pokud existuje
    if (countdownIntervals[elementId]) {
        clearInterval(countdownIntervals[elementId]);
    }

    let remainingSeconds = seconds;

    // Aktualizace odpočtu každou sekundu
    countdownIntervals[elementId] = setInterval(() => {
        remainingSeconds--;

        if (countdownElement) {
            countdownElement.textContent = `${remainingSeconds}s`;

            // Změna barvy při nízkém čase
            if (remainingSeconds <= 10) {
                countdownElement.classList.add('countdown-warning');
            }
            if (remainingSeconds <= 5) {
                countdownElement.classList.add('countdown-danger');
            }
        }

        // Ukončení intervalu po vypršení času
        if (remainingSeconds <= 0) {
            clearInterval(countdownIntervals[elementId]);
            delete countdownIntervals[elementId];
        }
    }, 1000);
}

// Funkce pro uložení vlastností markeru
function saveMarkerProperties(index) {
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
            lng: latlng.lng.toFixed(4)
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

        // Zavření popup po uložení
        marker.closePopup();

        // Uložení stavu aplikace po změně vlastností markeru
        saveAppState();
    }
}

// Funkce pro odstranění markeru
function removeMarker(index) {
    if (index < markers.length) {
        const marker = markers[index];
        const markerName = markerProperties[index]?.name || `Bod ${index + 1}`;

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

// Funkce pro přidání bodu na mapu
function addMarkerToMap(latlng) {
    const marker = L.marker(latlng, {
        draggable: true, // Umožní přesouvat marker tažením
        title: `Bod ${markers.length + 1}` // Popisek při najetí myší
    }).addTo(map);

    // Přidání markeru do pole
    const markerIndex = markers.length;
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
        closeOnClick: false,
        autoClose: false
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

    // Pokud máme právě dva nebo více bodů, automaticky vypočítáme trasu
    if (markers.length >= 2) {
        calculateRouteFunction();
    }

    // Uložení stavu aplikace po přidání nového bodu
    saveAppState();

    return marker;
}

// Event listener pro kliknutí na mapu
map.on('click', (e) => {
    if (isAddingPoints) {
        addMarkerToMap(e.latlng);
    }
});

// Event listener pro zoom, aby se popup okna lépe chovaly při zoomu
map.on('zoomstart', () => {
    // Přidání třídy pro animaci při zoomu
    document.querySelectorAll('.leaflet-popup').forEach(popup => {
        popup.classList.add('zooming');
    });
});

map.on('zoomend', () => {
    // Odstranění třídy po dokončení zoomu
    setTimeout(() => {
        document.querySelectorAll('.leaflet-popup').forEach(popup => {
            popup.classList.remove('zooming');
        });
    }, 300);
});

// Event listenery pro pohyb mapy, aby se popup okna lépe chovaly při pohybu mapy
map.on('movestart', () => {
    // Přidání třídy pro animaci při pohybu mapy
    document.querySelectorAll('.leaflet-popup').forEach(popup => {
        popup.classList.add('moving');
    });
});

map.on('moveend', () => {
    // Odstranění třídy po dokončení pohybu mapy
    setTimeout(() => {
        document.querySelectorAll('.leaflet-popup').forEach(popup => {
            popup.classList.remove('moving');
        });
    }, 100);
});

// Event listeners pro tlačítka
document.getElementById('addActivity').addEventListener('click', () => {
    const addActivityBtn = document.getElementById('addActivity');
    isAddingPoints = !isAddingPoints;

    if (isAddingPoints) {
        addActivityBtn.classList.add('active');
        addMessage('Režim přidávání bodů je aktivní. Klikněte na mapu pro přidání bodu.', false);
    } else {
        addActivityBtn.classList.remove('active');
        addMessage('Režim přidávání bodů byl deaktivován.', false);
    }
});

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

    // Vytvoření nové trasy s použitím Leaflet Routing Machine
    // Toto používá OSRM (Open Source Routing Machine) pro výpočet trasy po skutečných silnicích
    routeControl = L.Routing.control({
        ...routingOptions,
        waypoints: points
    }).addTo(map);

    // Poslech na událost 'routesfound' pro získání informací o trase
    routeControl.on('routesfound', function(e) {
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
        console.error('Chyba při výpočtu trasy:', e.error);

        // Pokud se nepodaří získat trasu přes API, použijeme záložní metodu s přímou čárou
        addMessage('Nepodařilo se získat přesnou trasu po silnicích. Zobrazuji přímou trasu.', false);

        // Vytvoření přímé trasy mezi body
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
    });

    return routeControl;
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

fullscreenButton.addEventListener('click', () => {
    isFullscreen = !isFullscreen;

    if (isFullscreen) {
        mapWrapper.classList.add('map-fullscreen');
        fullscreenButton.innerHTML = '<i class="icon">⛵</i>'; // Symbol pro exit fullscreen
        document.body.style.overflow = 'hidden'; // Zabrání scrollování stránky
    } else {
        mapWrapper.classList.remove('map-fullscreen');
        fullscreenButton.innerHTML = '<i class="icon">⛶</i>'; // Symbol pro fullscreen
        document.body.style.overflow = ''; // Obnovení scrollování
    }

    // Aktualizace velikosti mapy po změně režimu
    setTimeout(() => {
        map.invalidateSize();
        if (route) {
            map.fitBounds(route.getBounds(), {padding: [50, 50]});
        }
    }, 100);
});

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
        addMessage(message, true);
        messageInput.value = '';

        // Simulace odpovědi AI
        setTimeout(() => {
            const response = processUserInput(message);
            addMessage(response);
        }, 500);
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
        colorScheme: document.querySelector('.color-option.active').getAttribute('data-color'),
        design: document.getElementById('designSelect').value
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
        lastSaved: new Date().toISOString()
    };

    // Uložení do localStorage
    try {
        localStorage.setItem('aiMapAppState', JSON.stringify(appState));
        console.log('Stav aplikace byl úspěšně uložen:', appState);
        return true;
    } catch (error) {
        console.error('Chyba při ukládání stavu aplikace:', error);
        return false;
    }
}

// Funkce pro načtení stavu aplikace z localStorage
function loadAppState() {
    try {
        const savedState = localStorage.getItem('aiMapAppState');
        if (!savedState) {
            console.log('Nenalezen žádný uložený stav aplikace.');
            return false;
        }

        const appState = JSON.parse(savedState);
        console.log('Načten stav aplikace:', appState);

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

            // Nastavení designu
            if (appState.settings.design) {
                const designSelect = document.getElementById('designSelect');
                if (designSelect) {
                    designSelect.value = appState.settings.design;
                }
            }
        }

        // Načtení stavu mapy
        if (appState.mapState) {
            map.setView(
                [appState.mapState.center.lat, appState.mapState.center.lng],
                appState.mapState.zoom
            );
        }

        // Načtení markerů
        if (appState.markers && appState.markers.length > 0) {
            // Odstranění všech stávajících markerů
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];
            markerProperties = [];

            // Přidání uložených markerů
            appState.markers.forEach(markerData => {
                const marker = L.marker([markerData.lat, markerData.lng], {
                    draggable: true,
                    title: markerData.properties.name
                }).addTo(map);

                const markerIndex = markers.length;
                markers.push(marker);
                markerProperties[markerIndex] = markerData.properties;

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
            });

            // Pokud máme alespoň dva body, vypočítáme trasu
            if (markers.length >= 2) {
                calculateRouteFunction();
            }

            addMessage(`Načteno ${markers.length} bodů z předchozího sezení.`, false);
        }

        return true;
    } catch (error) {
        console.error('Chyba při načítání stavu aplikace:', error);
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
            marker.openPopup();

            // Nastavení časovače pro automatické zavření popup okna po 35 sekundách
            if (popupTimers[index]) {
                clearTimeout(popupTimers[index]);
            }

            popupTimers[index] = setTimeout(() => {
                if (marker.isPopupOpen()) {
                    marker.closePopup();
                }
                delete popupTimers[index];
            }, 35000); // 35 sekund
        }, 500);

        return `Navigace na bod "${markerName}".`;
    }
    return 'Bod nebyl nalezen.';
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
            </div>
            <div class="club-image-container">
                <img src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop" alt="Klub Alexa" class="club-image" loading="lazy">
            </div>
            <div class="place-info">
                <p><strong>Hodnocení:</strong> 4.9/5 <span class="rating-stars">★★★★★</span></p>
                <p><strong>Otevíraci doba:</strong> 20:00 - 05:00</p>
                <p><strong>Adresa:</strong> Na Kopci 1055/54, 696 01 Rohatec</p>
                <p>Exkluzivní noční klub s VIP servisem a profesionálními tanečnicemi.</p>
            </div>
            <div class="popup-actions club-actions">
                <button class="popup-btn reserve-dancer-btn" onclick="showDancerReservationModal()">Zarezervovat tanečnici</button>
            </div>
        </div>
    `;

    // Vytvoření popup okna přímo na markeru
    clubMarker.bindPopup(popupContent, {
        autoPan: true, // Zapneme autoPan, aby se mapa posouvala při otevření popup
        keepInView: true,
        className: 'club-popup',
        closeButton: true,
        closeOnClick: false,
        autoClose: false,
        maxWidth: 350,
        minWidth: 320
    });

    // Přiblížení mapy na oblast kolem klubu a vycentrování popup okna uprostřed mapy
    map.setView(rohatecLocation, 14, {
        animate: true,
        duration: 1
    });

    // Počkáme na dokončení animace a pak otevřeme popup
    setTimeout(() => {
        // Otevřeme popup
        clubMarker.openPopup();

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

    return `Nalezen Klub Alexa v Rohatci. Otevíraci doba: 20:00 - 05:00. Klikněte na tlačítko "Zarezervovat tanečnici" pro rezervaci.`;
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
    } else if (lowercaseInput.includes('přidat bod') || lowercaseInput.includes('přidat aktivitu')) {
        isAddingPoints = true;
        document.getElementById('addActivity').classList.add('active');
        return 'Režim přidávání bodů je aktivní. Klikněte na mapu pro přidání bodu.';
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
