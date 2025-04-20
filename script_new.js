// Minimalistická verze skriptu pro AIMapa
// Vytvořeno jako nouzové řešení pro zajištění základní funkčnosti

// Globální proměnné
let map;
let markers = [];
let markerProperties = [];
let route = null;
let isAddingPoints = true;

// Inicializace mapy po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializace nové verze skriptu...');
    
    try {
        // Inicializace mapy
        map = L.map('map', {
            minZoom: 2,
            maxZoom: 18
        }).setView([49.8175, 15.4730], 7); // Výchozí pohled na ČR
        
        // Přidání OpenStreetMap podkladu
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        console.log('Mapa byla úspěšně inicializována');
        
        // Inicializace ukazatele souřadnic
        const coordinatesDisplay = document.getElementById('coordinates');
        if (coordinatesDisplay) {
            map.on('mousemove', function(e) {
                const lat = e.latlng.lat.toFixed(6);
                const lng = e.latlng.lng.toFixed(6);
                coordinatesDisplay.innerHTML = `Lat: ${lat} | Lng: ${lng}`;
            });
            
            map.on('mouseout', function() {
                coordinatesDisplay.innerHTML = '';
            });
        }
        
        // Deaktivace standardního chování dvojkliku (zoom)
        map.doubleClickZoom.disable();
        
        // Přidání event listeneru pro dvojklik na mapu
        map.on('dblclick', function(e) {
            if (isAddingPoints) {
                addMarker(e.latlng);
            }
        });
        
        // Přidání event listenerů pro tlačítka
        setupButtonListeners();
        
        // Vyčištění chat okna a přidání uvítací zprávy
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            addMessage('Vítejte v aplikaci AIMapa! Aplikace byla restartována pro zajištění stability.', false);
            addMessage('Pro přidání bodu dvojklikněte na mapu. Pro výpočet trasy klikněte na tlačítko "Vypočítat trasu".', false);
        }
        
        // Nastavení statusu
        const statusBar = document.querySelector('.status-bar');
        if (statusBar) {
            statusBar.innerHTML = '<span class="status-icon" style="color: #6ee7b7;">✓</span> Aplikace byla restartována a je připravena k použití';
            statusBar.style.backgroundColor = '#064e3b';
        }
        
    } catch (error) {
        console.error('Kritická chyba při inicializaci aplikace:', error);
        alert('Došlo k chybě při inicializaci aplikace. Zkuste obnovit stránku.');
    }
});

// Funkce pro přidání markeru na mapu
function addMarker(latlng) {
    try {
        console.log('Přidávání markeru na souřadnice:', latlng);
        
        // Vytvoření markeru
        const marker = L.marker(latlng, {
            draggable: true,
            title: `Bod ${markers.length + 1}`
        }).addTo(map);
        
        // Přidání markeru do pole
        markers.push(marker);
        
        // Vytvoření vlastností pro marker
        const markerIndex = markers.length - 1;
        markerProperties[markerIndex] = {
            name: `Bod ${markerIndex + 1}`,
            command: `bod${markerIndex + 1}`,
            lat: latlng.lat.toFixed(4),
            lng: latlng.lng.toFixed(4)
        };
        
        // Přidání popup s informacemi
        marker.bindPopup(
            `<div class="popup-content">
                <div class="popup-header">
                    <div class="popup-title">${markerProperties[markerIndex].name}</div>
                </div>
                <div class="popup-info">
                    <p>Souřadnice: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}</p>
                </div>
                <div class="popup-actions">
                    <button class="popup-btn delete-btn" onclick="removeMarker(${markerIndex})">Odstranit</button>
                </div>
            </div>`
        );
        
        // Event listener pro přesunutí markeru
        marker.on('dragend', function() {
            const newPos = marker.getLatLng();
            markerProperties[markerIndex].lat = newPos.lat.toFixed(4);
            markerProperties[markerIndex].lng = newPos.lng.toFixed(4);
            
            // Aktualizace popup obsahu
            marker.setPopupContent(
                `<div class="popup-content">
                    <div class="popup-header">
                        <div class="popup-title">${markerProperties[markerIndex].name}</div>
                    </div>
                    <div class="popup-info">
                        <p>Souřadnice: ${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}</p>
                    </div>
                    <div class="popup-actions">
                        <button class="popup-btn delete-btn" onclick="removeMarker(${markerIndex})">Odstranit</button>
                    </div>
                </div>`
            );
            
            // Pokud máme alespoň dva body, přepočítáme trasu
            if (markers.length >= 2) {
                calculateRoute();
            }
        });
        
        // Přidání zprávy do chatu
        addMessage(`Přidán bod "${markerProperties[markerIndex].name}" na souřadnicích [${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}]`, false);
        
        // Pokud máme alespoň dva body, automaticky vypočítáme trasu
        if (markers.length >= 2) {
            calculateRoute();
        }
        
        return marker;
    } catch (error) {
        console.error('Chyba při přidávání markeru:', error);
        addMessage('Došlo k chybě při přidávání bodu. Zkuste to prosím znovu.', true);
        return null;
    }
}

// Funkce pro odstranění markeru
function removeMarker(index) {
    try {
        console.log('Odstraňování markeru s indexem:', index);
        
        if (index >= 0 && index < markers.length) {
            // Odstranění markeru z mapy
            map.removeLayer(markers[index]);
            
            // Odstranění markeru z pole
            markers.splice(index, 1);
            markerProperties.splice(index, 1);
            
            // Přejmenování zbývajících markerů
            for (let i = 0; i < markers.length; i++) {
                markerProperties[i].name = `Bod ${i + 1}`;
                markerProperties[i].command = `bod${i + 1}`;
                
                // Aktualizace popup obsahu
                markers[i].setPopupContent(
                    `<div class="popup-content">
                        <div class="popup-header">
                            <div class="popup-title">${markerProperties[i].name}</div>
                        </div>
                        <div class="popup-info">
                            <p>Souřadnice: ${markerProperties[i].lat}, ${markerProperties[i].lng}</p>
                        </div>
                        <div class="popup-actions">
                            <button class="popup-btn delete-btn" onclick="removeMarker(${i})">Odstranit</button>
                        </div>
                    </div>`
                );
            }
            
            // Přepočítání trasy, pokud máme alespoň dva body
            if (markers.length >= 2) {
                calculateRoute();
            } else {
                // Odstranění trasy, pokud nemáme dostatek bodů
                if (route) {
                    map.removeLayer(route);
                    route = null;
                    
                    // Reset informací o trase
                    const routeDistanceElement = document.getElementById('routeDistance');
                    const routeTimeElement = document.getElementById('routeTime');
                    if (routeDistanceElement) routeDistanceElement.textContent = '-';
                    if (routeTimeElement) routeTimeElement.textContent = '-';
                }
            }
            
            addMessage('Bod byl úspěšně odstraněn.', false);
        }
    } catch (error) {
        console.error('Chyba při odstraňování markeru:', error);
        addMessage('Došlo k chybě při odstraňování bodu. Zkuste to prosím znovu.', true);
    }
}

// Funkce pro výpočet trasy
function calculateRoute() {
    try {
        console.log('Výpočet trasy...');
        
        if (markers.length < 2) {
            addMessage('Pro výpočet trasy jsou potřeba alespoň 2 body', false);
            return;
        }
        
        // Získání bodů pro výpočet trasy
        const points = markers.map(marker => marker.getLatLng());
        
        // Odstranění předchozí trasy, pokud existuje
        if (route) {
            map.removeLayer(route);
            route = null;
        }
        
        // Vytvoření nové trasy s přímou čárou
        route = L.polyline(points, {
            color: 'blue',
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
        const timeString = hours > 0 ? `${hours} h ${minutes} min` : `${minutes} min`;
        
        // Aktualizace informací o trase v panelu
        const routeDistanceElement = document.getElementById('routeDistance');
        const routeTimeElement = document.getElementById('routeTime');
        if (routeDistanceElement) routeDistanceElement.textContent = `${distanceKm} km (přímá trasa)`;
        if (routeTimeElement) routeTimeElement.textContent = timeString;
        
        // Přidání zprávy do chatu s informacemi o trase
        addMessage(`Trasa vypočítána. Celková vzdálenost: ${distanceKm} km, přibližný čas cesty: ${timeString}`, false);
        
        // Přizpůsobení mapy, aby zobrazovala celou trasu
        map.fitBounds(route.getBounds(), {padding: [50, 50]});
        
        console.log('Výpočet trasy dokončen');
        return route;
    } catch (error) {
        console.error('Chyba při výpočtu trasy:', error);
        addMessage('Nepodařilo se vypočítat trasu. Zkuste to prosím znovu.', true);
        return null;
    }
}

// Funkce pro přidání zprávy do chatu
function addMessage(text, isUser = false) {
    try {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user' : 'message ai';
        messageDiv.textContent = text;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        console.error('Chyba při přidávání zprávy do chatu:', error);
    }
}

// Funkce pro nastavení event listenerů pro tlačítka
function setupButtonListeners() {
    try {
        // Tlačítko pro přidání aktivity
        const addActivityBtn = document.getElementById('addActivity');
        if (addActivityBtn) {
            addActivityBtn.onclick = function() {
                isAddingPoints = !isAddingPoints;
                
                if (isAddingPoints) {
                    addActivityBtn.classList.add('active');
                    addMessage('Režim přidávání bodů je aktivní. Dvojklikněte na mapu pro přidání bodu.', false);
                } else {
                    addActivityBtn.classList.remove('active');
                    addMessage('Režim přidávání bodů byl deaktivován.', false);
                }
            };
        }
        
        // Tlačítko pro výpočet trasy
        const calculateRouteBtn = document.getElementById('calculateRoute');
        if (calculateRouteBtn) {
            calculateRouteBtn.onclick = function() {
                addMessage('Probíhá výpočet trasy...', false);
                setTimeout(calculateRoute, 100);
            };
        }
        
        // Tlačítko pro vymazání mapy
        const clearMapBtn = document.getElementById('clearMap');
        if (clearMapBtn) {
            clearMapBtn.onclick = function() {
                try {
                    // Vymazání všech bodů
                    for (const marker of markers) {
                        map.removeLayer(marker);
                    }
                    markers = [];
                    markerProperties = [];
                    
                    // Vymazání trasy
                    if (route) {
                        map.removeLayer(route);
                        route = null;
                    }
                    
                    // Reset informací o trase
                    const routeDistanceElement = document.getElementById('routeDistance');
                    const routeTimeElement = document.getElementById('routeTime');
                    if (routeDistanceElement) routeDistanceElement.textContent = '-';
                    if (routeTimeElement) routeTimeElement.textContent = '-';
                    
                    addMessage('Mapa byla vyčištěna. Všechny body a trasy byly odstraněny.', false);
                } catch (error) {
                    console.error('Chyba při čištění mapy:', error);
                    addMessage('Došlo k chybě při čištění mapy. Zkuste to prosím znovu.', true);
                }
            };
        }
        
        // Tlačítko pro tisk mapy
        const printMapBtn = document.getElementById('printMap');
        if (printMapBtn) {
            printMapBtn.onclick = function() {
                addMessage('Připravuji mapu pro tisk...', false);
                setTimeout(function() {
                    window.print();
                    addMessage('Mapa připravena k tisku', false);
                }, 1000);
            };
        }
        
        // Tlačítko pro fullscreen režim
        const fullscreenButton = document.getElementById('fullscreenButton');
        if (fullscreenButton) {
            fullscreenButton.onclick = function() {
                const mapWrapper = document.querySelector('.map-wrapper');
                if (mapWrapper) {
                    if (mapWrapper.classList.contains('map-fullscreen')) {
                        mapWrapper.classList.remove('map-fullscreen');
                        fullscreenButton.innerHTML = '<i class="icon">⛶</i>';
                        document.body.style.overflow = '';
                    } else {
                        mapWrapper.classList.add('map-fullscreen');
                        fullscreenButton.innerHTML = '<i class="icon">⛵</i>';
                        document.body.style.overflow = 'hidden';
                    }
                    
                    // Aktualizace velikosti mapy po změně režimu
                    setTimeout(function() {
                        map.invalidateSize();
                        if (route) {
                            map.fitBounds(route.getBounds(), {padding: [50, 50]});
                        }
                    }, 300);
                }
            };
        }
        
        // Tlačítko pro odeslání zprávy
        const sendMessageBtn = document.getElementById('sendMessage');
        const messageInput = document.getElementById('messageInput');
        if (sendMessageBtn && messageInput) {
            sendMessageBtn.onclick = function() {
                const message = messageInput.value.trim();
                if (message) {
                    addMessage(message, true);
                    messageInput.value = '';
                    
                    // Jednoduchá odpověď
                    setTimeout(function() {
                        addMessage('Omlouvám se, ale v této zjednodušené verzi aplikace není AI asistent plně funkční.', false);
                    }, 500);
                }
            };
            
            // Přidání event listeneru pro klávesu Enter
            messageInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    sendMessageBtn.click();
                }
            };
        }
        
        console.log('Event listenery pro tlačítka byly úspěšně nastaveny');
    } catch (error) {
        console.error('Chyba při nastavování event listenerů pro tlačítka:', error);
    }
}
