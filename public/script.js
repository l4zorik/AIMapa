/**
 * Hlavní skript aplikace AIMapa verze 0.2.9.1
 * Zjednodušená verze pro Node.js
 */

// Proměnné pro ukládání bodů a tras
let markers = [];
let markerProperties = [];
let route = null;
let routeControl = null;
let isAddingPoints = true;
let isFullscreen = false;
let isGlobeMode = false;
let map = null;

// Inicializace po načtení dokumentu
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializace aplikace...');

    try {
        // Inicializace mapy
        initMap();

        // Nastavení event listenerů
        setupEventListeners();

        console.log('Aplikace byla úspěšně inicializována');
    } catch (error) {
        console.error('Chyba při inicializaci aplikace:', error);
    }
});

// Funkce pro inicializaci mapy
function initMap() {
    // Kontrola, zda je Leaflet dostupný
    if (typeof L === 'undefined') {
        console.error('Leaflet není dostupný');
        return;
    }

    // Vytvoření mapy
    map = L.map('map', {
        center: [50.0755, 14.4378], // Praha
        zoom: 13
    });

    // Přidání základní vrstvy
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Nastavení event listenerů pro mapu
    map.on('click', function(e) {
        if (isAddingPoints) {
            addMarker(e.latlng);
        }
    });

    // Aktualizace souřadnic při pohybu myši
    map.on('mousemove', function(e) {
        const coordinatesElement = document.getElementById('coordinates');
        if (coordinatesElement) {
            coordinatesElement.textContent = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
        }
    });

    console.log('Mapa byla inicializována');
}

// Funkce pro nastavení event listenerů
function setupEventListeners() {
    // Tlačítko pro přidání aktivity
    const addActivityButton = document.getElementById('addActivity');
    if (addActivityButton) {
        addActivityButton.addEventListener('click', function() {
            alert('Přidání aktivity - tato funkce je ve vývoji');
        });
    }

    // Tlačítko pro výpočet trasy
    const calculateRouteButton = document.getElementById('calculateRoute');
    if (calculateRouteButton) {
        calculateRouteButton.addEventListener('click', function() {
            if (markers.length >= 2) {
                calculateRoute();
            } else {
                alert('Pro výpočet trasy potřebujete alespoň dva body na mapě');
            }
        });
    }

    // Tlačítko pro vymazání mapy
    const clearMapButton = document.getElementById('clearMap');
    if (clearMapButton) {
        clearMapButton.addEventListener('click', function() {
            clearMap();
        });
    }

    // Tlačítko pro tisk mapy
    const printMapButton = document.getElementById('printMap');
    if (printMapButton) {
        printMapButton.addEventListener('click', function() {
            alert('Tisk mapy - tato funkce je ve vývoji');
        });
    }

    // Tlačítko pro fullscreen režim
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton) {
        fullscreenButton.addEventListener('click', function() {
            toggleFullscreen();
        });
    }

    // Tlačítko pro glóbus režim
    const toggleGlobeModeButton = document.getElementById('toggleGlobeMode');
    if (toggleGlobeModeButton) {
        toggleGlobeModeButton.addEventListener('click', function() {
            toggleGlobeMode();
        });
    }

    // Tlačítko pro ukončení glóbus režimu
    const exitGlobeModeButton = document.getElementById('exitGlobeMode');
    if (exitGlobeModeButton) {
        exitGlobeModeButton.addEventListener('click', function() {
            toggleGlobeMode();
        });
    }

    // Tlačítko pro nastavení
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeButton = document.querySelector('.close-button');

    if (settingsButton && settingsModal && closeButton) {
        settingsButton.addEventListener('click', function() {
            settingsModal.style.display = 'block';
        });

        closeButton.addEventListener('click', function() {
            settingsModal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    }

    // Tlačítko pro odeslání zprávy
    const sendButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');

    if (sendButton && messageInput) {
        sendButton.addEventListener('click', function() {
            sendMessage();
        });

        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    console.log('Event listenery byly nastaveny');
}

// Funkce pro přidání markeru
function addMarker(latlng, name = '') {
    // Vytvoření markeru
    const marker = L.marker(latlng, {
        draggable: true
    }).addTo(map);

    // Přidání markeru do pole
    markers.push(marker);

    // Vytvoření vlastností markeru
    const markerIndex = markers.length;
    const markerName = name || `Bod ${markerIndex}`;

    // Přidání vlastností do pole
    markerProperties.push({
        name: markerName
    });

    // Nastavení popupu
    marker.bindPopup(`
        <div class="marker-popup">
            <h3>${markerName}</h3>
            <p>Souřadnice: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}</p>
            <button class="popup-btn remove-marker" data-index="${markerIndex - 1}">Odstranit</button>
        </div>
    `);

    // Event listener pro popup
    marker.on('popupopen', function() {
        const removeButton = document.querySelector(`.remove-marker[data-index="${markerIndex - 1}"]`);
        if (removeButton) {
            removeButton.addEventListener('click', function() {
                removeMarker(parseInt(this.getAttribute('data-index')));
            });
        }
    });

    // Event listener pro přetažení markeru
    marker.on('dragend', function() {
        updateRoute();
    });

    // Aktualizace trasy, pokud existuje více než jeden marker
    if (markers.length > 1) {
        updateRoute();
    }

    return marker;
}

// Funkce pro odstranění markeru
function removeMarker(index) {
    // Kontrola, zda index je platný
    if (index < 0 || index >= markers.length) {
        return;
    }

    // Odstranění markeru z mapy
    map.removeLayer(markers[index]);

    // Odstranění markeru z pole
    markers.splice(index, 1);
    markerProperties.splice(index, 1);

    // Aktualizace trasy
    updateRoute();
}

// Funkce pro aktualizaci trasy
function updateRoute() {
    // Kontrola, zda existují alespoň dva markery
    if (markers.length < 2) {
        // Odstranění existující trasy
        if (routeControl) {
            map.removeControl(routeControl);
            routeControl = null;
        }

        return;
    }

    // Získání souřadnic markerů
    const waypoints = markers.map(marker => marker.getLatLng());

    // Odstranění existující trasy
    if (routeControl) {
        map.removeControl(routeControl);
    }

    // Vytvoření nové trasy
    routeControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        showAlternatives: false,
        fitSelectedRoutes: false,
        lineOptions: {
            styles: [
                { color: '#6366F1', opacity: 0.8, weight: 6 },
                { color: 'white', opacity: 0.3, weight: 10 }
            ]
        },
        createMarker: function() {
            return null; // Nezobrazovat markery trasy
        }
    }).addTo(map);

    // Event listener pro změnu trasy
    routeControl.on('routesfound', function(e) {
        const routes = e.routes;
        const summary = routes[0].summary;

        // Aktualizace informací o trase
        updateRouteInfo(summary);
    });
}

// Funkce pro aktualizaci informací o trase
function updateRouteInfo(summary) {
    const routeDistance = document.getElementById('routeDistance');
    const routeTime = document.getElementById('routeTime');

    if (routeDistance && routeTime) {
        if (summary) {
            // Převod vzdálenosti na kilometry
            const distance = summary.totalDistance / 1000;
            routeDistance.textContent = `${distance.toFixed(1)} km`;

            // Převod času na hodiny a minuty
            const hours = Math.floor(summary.totalTime / 3600);
            const minutes = Math.floor((summary.totalTime % 3600) / 60);

            if (hours > 0) {
                routeTime.textContent = `${hours} h ${minutes} min`;
            } else {
                routeTime.textContent = `${minutes} min`;
            }
        } else {
            routeDistance.textContent = '-';
            routeTime.textContent = '-';
        }
    }
}

// Funkce pro výpočet trasy
function calculateRoute() {
    // Kontrola, zda existují alespoň dva markery
    if (markers.length < 2) {
        alert('Pro výpočet trasy potřebujete alespoň dva body na mapě');
        return;
    }

    // Aktualizace trasy
    updateRoute();

    // Zobrazení informací o trase
    const routeInfo = document.getElementById('routeInfo');
    if (routeInfo) {
        routeInfo.style.display = 'block';
    }
}

// Funkce pro vymazání mapy
function clearMap() {
    // Odstranění všech markerů
    markers.forEach(marker => {
        map.removeLayer(marker);
    });

    // Vyčištění polí
    markers = [];
    markerProperties = [];

    // Odstranění trasy
    if (routeControl) {
        map.removeControl(routeControl);
        routeControl = null;
    }

    // Aktualizace informací o trase
    updateRouteInfo(null);

    // Skrytí informací o trase
    const routeInfo = document.getElementById('routeInfo');
    if (routeInfo) {
        routeInfo.style.display = 'none';
    }
}

// Funkce pro přepnutí fullscreen režimu
function toggleFullscreen() {
    isFullscreen = !isFullscreen;

    const mapContainer = document.querySelector('.map-container');

    if (isFullscreen) {
        document.body.classList.add('fullscreen-mode');

        // Vytvoření plovoucího chatu
        createFloatingChat();
    } else {
        document.body.classList.remove('fullscreen-mode');

        // Odstranění plovoucího chatu
        const floatingChat = document.querySelector('.floating-chat');
        if (floatingChat) {
            floatingChat.remove();
        }
    }

    // Aktualizace velikosti mapy
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

// Funkce pro přepnutí glóbus režimu
function toggleGlobeMode() {
    isGlobeMode = !isGlobeMode;

    const mapElement = document.getElementById('map');
    const threeGlobeContainer = document.getElementById('threeGlobeContainer');
    const toggleGlobeModeButton = document.getElementById('toggleGlobeMode');
    const exitGlobeModeButton = document.getElementById('exitGlobeMode');

    if (isGlobeMode) {
        document.body.classList.add('globe-mode');

        mapElement.style.display = 'none';
        threeGlobeContainer.style.display = 'block';

        toggleGlobeModeButton.style.display = 'none';
        exitGlobeModeButton.style.display = 'block';
    } else {
        document.body.classList.remove('globe-mode');

        mapElement.style.display = 'block';
        threeGlobeContainer.style.display = 'none';

        toggleGlobeModeButton.style.display = 'block';
        exitGlobeModeButton.style.display = 'none';
    }
}

// Funkce pro odeslání zprávy
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');

    if (messageInput && chatMessages) {
        const message = messageInput.value.trim();

        if (message) {
            // Přidání zprávy uživatele
            const userMessageElement = document.createElement('div');
            userMessageElement.className = 'message user';
            userMessageElement.textContent = message;
            chatMessages.appendChild(userMessageElement);

            // Vymazání vstupu
            messageInput.value = '';

            // Scrollování na konec
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulace odpovědi AI
            setTimeout(() => {
                const aiMessageElement = document.createElement('div');
                aiMessageElement.className = 'message ai';
                aiMessageElement.textContent = 'Tato funkce je ve vývoji. Zkuste použít tlačítka pod mapou pro interakci s aplikací.';
                chatMessages.appendChild(aiMessageElement);

                // Scrollování na konec
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500);
        }
    }
}

// Funkce pro vytvoření plovoucího chatu
function createFloatingChat() {
    // Kontrola, zda již existuje
    if (document.querySelector('.floating-chat')) {
        return;
    }

    // Vytvoření elementu pro plovoucí chat
    const floatingChat = document.createElement('div');
    floatingChat.className = 'floating-chat';

    floatingChat.innerHTML = `
        <div class="floating-chat-header">
            <div class="floating-chat-title">AI Asistent</div>
            <div class="floating-chat-controls">
                <button id="toggleChatPosition" class="floating-chat-control" title="Přesunout chat">⇄</button>
                <button id="minimizeChat" class="floating-chat-control" title="Minimalizovat">_</button>
            </div>
        </div>
        <div class="floating-chat-messages"></div>
        <div class="floating-chat-input">
            <input type="text" id="floatingMessageInput" placeholder="Napište zprávu...">
            <button id="floatingSendMessage">➞</button>
        </div>
    `;

    // Přidání chatu do dokumentu
    document.body.appendChild(floatingChat);

    // Kopírování zpráv z hlavního chatu
    const chatMessages = document.getElementById('chatMessages');
    const floatingChatMessages = floatingChat.querySelector('.floating-chat-messages');

    if (chatMessages && floatingChatMessages) {
        chatMessages.querySelectorAll('.message').forEach(message => {
            const clone = message.cloneNode(true);
            floatingChatMessages.appendChild(clone);
        });

        // Scrollování na konec
        floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
    }

    // Nastavení event listenerů
    const minimizeButton = document.getElementById('minimizeChat');
    const togglePositionButton = document.getElementById('toggleChatPosition');
    const floatingSendButton = document.getElementById('floatingSendMessage');
    const floatingMessageInput = document.getElementById('floatingMessageInput');

    if (minimizeButton) {
        minimizeButton.addEventListener('click', () => {
            floatingChat.classList.toggle('minimized');

            // Změna textu tlačítka
            if (floatingChat.classList.contains('minimized')) {
                minimizeButton.textContent = '□';
                minimizeButton.title = 'Maximalizovat';
            } else {
                minimizeButton.textContent = '_';
                minimizeButton.title = 'Minimalizovat';
            }
        });
    }

    if (togglePositionButton) {
        togglePositionButton.addEventListener('click', () => {
            // Přepínání mezi pravou a levou stranou
            if (floatingChat.style.right === '20px' || floatingChat.style.right === '') {
                floatingChat.style.right = 'auto';
                floatingChat.style.left = '20px';
            } else {
                floatingChat.style.right = '20px';
                floatingChat.style.left = 'auto';
            }
        });
    }

    if (floatingSendButton && floatingMessageInput) {
        floatingSendButton.addEventListener('click', () => {
            const message = floatingMessageInput.value.trim();

            if (message) {
                // Přidání zprávy uživatele do plovoucího chatu
                const userMessageElement = document.createElement('div');
                userMessageElement.className = 'message user';
                userMessageElement.textContent = message;
                floatingChatMessages.appendChild(userMessageElement);

                // Vymazání vstupu
                floatingMessageInput.value = '';

                // Scrollování na konec
                floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;

                // Simulace odpovědi AI
                setTimeout(() => {
                    const aiMessageElement = document.createElement('div');
                    aiMessageElement.className = 'message ai';
                    aiMessageElement.textContent = 'Tato funkce je ve vývoji. Zkuste použít tlačítka pod mapou pro interakci s aplikací.';
                    floatingChatMessages.appendChild(aiMessageElement);

                    // Scrollování na konec
                    floatingChatMessages.scrollTop = floatingChatMessages.scrollHeight;
                }, 500);
            }
        });

        floatingMessageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                floatingSendButton.click();
            }
        });
    }
}