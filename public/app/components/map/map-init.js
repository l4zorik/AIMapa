// Initialize map and globe
let currentView = 'map';

const btnMap = document.getElementById('btnMap');
const btnGlobe = document.getElementById('btnGlobe');
const mapDiv = document.getElementById('map');
const globeDiv = document.getElementById('simpleGlobeContainer');

// Monetizace - stav
const monetizationState = {
    userSubscription: 'free',
    showAds: true,
    premiumFeaturesEnabled: false,
    balance: 0,
    currency: 'CZK'
};

btnMap.addEventListener('click', () => {
    if (currentView !== 'map') {
        globeDiv.style.display = 'none';
        mapDiv.style.display = 'block';
        btnMap.classList.add('active');
        btnGlobe.classList.remove('active');
        currentView = 'map';
    }
});

btnGlobe.addEventListener('click', async () => {
    if (currentView !== 'globe') {
        mapDiv.style.display = 'none';
        globeDiv.style.display = 'block';
        btnGlobe.classList.add('active');
        btnMap.classList.remove('active');
        currentView = 'globe';

        // Initialize globe if not already initialized
        if (!window.globeInitialized) {
            const success = await window.initSimpleGlobe();
            if (success) {
                window.globeInitialized = true;
                // Example: add some points or routes here or fetch from backend
            }
        }
    }
});

// TODO: Implement handlers for add point, create route, search, offline mode buttons
document.getElementById('btnAddPoint').addEventListener('click', () => {
    alert('Funkce přidání bodu bude implementována.');
});
document.getElementById('btnCreateRoute').addEventListener('click', () => {
    alert('Funkce vytvoření trasy bude implementována.');
});
document.getElementById('btnOffline').addEventListener('click', () => {
    alert('Offline režim bude implementován.');
});
document.getElementById('btnFullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// Search functionality implementation
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
let searchTimeout = null;
let map; // Assuming map object is initialized elsewhere in this file
let searchMarkers = [];

function clearSearchResults() {
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    // Remove existing markers from map
    searchMarkers.forEach(marker => {
        if (map && map.removeLayer) {
            map.removeLayer(marker);
        }
    });
    searchMarkers = [];
}

function createMarker(lat, lng, name) {
    if (!map || !L) return null;
    const marker = L.marker([lat, lng]).addTo(map).bindPopup(name);
    return marker;
}

function panToLocation(lat, lng) {
    if (map && map.setView) {
        map.setView([lat, lng], 15);
    }
}

async function performSearch(query) {
    if (!query || query.length < 2) {
        clearSearchResults();
        return;
    }
    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}&limit=10`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        clearSearchResults();
        if (data.results && data.results.length > 0) {
            data.results.forEach(place => {
                const item = document.createElement('div');
                item.textContent = `${place.name} - ${place.address}`;
                item.style.padding = '5px';
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    panToLocation(place.lat, place.lng);
                    clearSearchResults();
                    const marker = createMarker(place.lat, place.lng, place.name);
                    if (marker) searchMarkers.push(marker);
                });
                searchResults.appendChild(item);
            });
            searchResults.style.display = 'block';
        } else {
            const noResult = document.createElement('div');
            noResult.textContent = 'Žádné výsledky';
            noResult.style.padding = '5px';
            searchResults.appendChild(noResult);
            searchResults.style.display = 'block';
        }
    } catch (error) {
        console.error('Search error:', error);
        clearSearchResults();
    }
}

searchInput.addEventListener('input', () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(searchInput.value.trim());
    }, 300);
});

// Hide search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
        clearSearchResults();
    }
});

// Chat panel logic
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');

function appendMessage(message, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message', sender);
    msgDiv.textContent = message;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    appendMessage(message, 'user');
    chatInput.value = '';

    // TODO: Call LLM API with message and get response
    // For now, simulate response
    appendMessage('Odpověď AI bude zde...', 'bot');
}

chatSendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Monetizace - funkce pro kontrolu předplatného uživatele
function checkUserSubscription() {
    console.log('Kontrola předplatného uživatele...');

    // Pokud existuje modul pro předplatné, získáme aktuální předplatné
    if (typeof SubscriptionService !== 'undefined' && SubscriptionService.getCurrentPlan) {
        const currentPlan = SubscriptionService.getCurrentPlan();
        if (currentPlan) {
            monetizationState.userSubscription = currentPlan.id;
            monetizationState.showAds = currentPlan.id === 'free' || currentPlan.id === 'basic';
            monetizationState.premiumFeaturesEnabled = currentPlan.id !== 'free';
            console.log(`Zjištěno předplatné uživatele: ${currentPlan.id}`);
        }
    } else if (typeof UserAccounts !== 'undefined' && UserAccounts.state && UserAccounts.state.currentUser) {
        // Alternativně zkusíme získat předplatné z uživatelského účtu
        const user = UserAccounts.state.currentUser;
        monetizationState.userSubscription = user.subscription || 'free';
        monetizationState.showAds = monetizationState.userSubscription === 'free' || monetizationState.userSubscription === 'basic';
        monetizationState.premiumFeaturesEnabled = monetizationState.userSubscription !== 'free';
        monetizationState.balance = user.balance || 0;
        monetizationState.currency = user.currency || 'CZK';
        console.log(`Zjištěno předplatné uživatele z účtu: ${monetizationState.userSubscription}`);
    } else {
        console.log('Předplatné uživatele nebylo zjištěno, používám výchozí: free');
    }

    // Aktualizace UI podle předplatného
    updateUIBasedOnSubscription();
}

// Aktualizace UI podle předplatného
function updateUIBasedOnSubscription() {
    // Zobrazení/skrytí prémiových funkcí
    const premiumFeatures = document.querySelectorAll('.premium-feature');
    premiumFeatures.forEach(feature => {
        if (monetizationState.premiumFeaturesEnabled) {
            feature.classList.remove('disabled');
            feature.removeAttribute('disabled');
        } else {
            feature.classList.add('disabled');
            if (feature.tagName === 'BUTTON') {
                feature.setAttribute('disabled', 'disabled');
            }
        }
    });

    // Zobrazení/skrytí reklam
    if (typeof AdvertisementModule !== 'undefined') {
        if (monetizationState.showAds) {
            AdvertisementModule.showAds();
        } else {
            AdvertisementModule.hideAds();
        }
    }

    // Aktualizace zobrazení zůstatku
    updateBalanceDisplay();
}

// Aktualizace zobrazení zůstatku
function updateBalanceDisplay() {
    const balanceElement = document.getElementById('userBalance');
    if (balanceElement) {
        balanceElement.textContent = `${monetizationState.balance} ${monetizationState.currency}`;
    }
}

// Inicializace monetizace
function initMonetization() {
    console.log('Inicializace monetizace...');

    // Kontrola předplatného
    checkUserSubscription();

    // Přidání posluchačů událostí pro změny předplatného
    document.addEventListener('subscriptionChanged', () => {
        checkUserSubscription();
    });

    // Přidání tlačítek pro mikrotransakce
    addMicrotransactionButtons();

    console.log('Monetizace byla inicializována');
}

// Přidání tlačítek pro mikrotransakce
function addMicrotransactionButtons() {
    // Přidání tlačítka pro prémiové mapy
    const mapControlsContainer = document.querySelector('.map-controls');
    if (mapControlsContainer) {
        const premiumMapsButton = document.createElement('button');
        premiumMapsButton.id = 'btnPremiumMaps';
        premiumMapsButton.className = 'map-control-button';
        premiumMapsButton.innerHTML = '<i class="fas fa-map-marked-alt"></i>';
        premiumMapsButton.title = 'Prémiové mapy';

        premiumMapsButton.addEventListener('click', () => {
            showPremiumMapsDialog();
        });

        mapControlsContainer.appendChild(premiumMapsButton);
    }
}

// Zobrazení dialogu s prémiovými mapami
function showPremiumMapsDialog() {
    // Kontrola, zda uživatel má prémiové funkce
    if (monetizationState.premiumFeaturesEnabled) {
        alert('Máte přístup ke všem prémiovým mapám!');
        return;
    }

    // Vytvoření dialogu
    const dialog = document.createElement('div');
    dialog.className = 'premium-maps-dialog';
    dialog.innerHTML = `
        <div class="premium-maps-content">
            <h2>Prémiové mapy</h2>
            <p>Získejte přístup k prémiovým mapám s detailními podklady a offline režimem.</p>

            <div class="premium-maps-options">
                <div class="premium-map-option">
                    <h3>Turistické mapy</h3>
                    <p>Detailní turistické mapy s vrstevnicemi a turistickými trasami.</p>
                    <button class="buy-map-button" data-map="tourist" data-price="49">Koupit za 49 ${monetizationState.currency}</button>
                </div>

                <div class="premium-map-option">
                    <h3>Satelitní mapy</h3>
                    <p>Vysoce kvalitní satelitní snímky s možností přiblížení.</p>
                    <button class="buy-map-button" data-map="satellite" data-price="79">Koupit za 79 ${monetizationState.currency}</button>
                </div>

                <div class="premium-map-option">
                    <h3>Offline balíček</h3>
                    <p>Stáhněte si mapy pro offline použití.</p>
                    <button class="buy-map-button" data-map="offline" data-price="99">Koupit za 99 ${monetizationState.currency}</button>
                </div>
            </div>

            <div class="premium-maps-subscription">
                <p>Nebo získejte všechny mapy s předplatným:</p>
                <button id="show-subscription-button">Zobrazit předplatné</button>
            </div>

            <button class="close-dialog-button">Zavřít</button>
        </div>
    `;

    // Přidání dialogu do dokumentu
    document.body.appendChild(dialog);

    // Přidání posluchačů událostí
    dialog.querySelector('.close-dialog-button').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });

    dialog.querySelector('#show-subscription-button').addEventListener('click', () => {
        document.body.removeChild(dialog);
        if (typeof SubscriptionService !== 'undefined') {
            SubscriptionService.showSubscriptionPlans();
        } else {
            alert('Služba předplatného není k dispozici.');
        }
    });

    // Přidání posluchačů pro tlačítka nákupu
    const buyButtons = dialog.querySelectorAll('.buy-map-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mapType = button.getAttribute('data-map');
            const price = parseInt(button.getAttribute('data-price'));

            processMicrotransaction(mapType, price);
        });
    });
}

// Zpracování mikrotransakce
function processMicrotransaction(itemType, price) {
    console.log(`Zpracování mikrotransakce: ${itemType}, cena: ${price} ${monetizationState.currency}`);

    // Kontrola, zda má uživatel dostatek prostředků
    if (monetizationState.balance < price) {
        alert(`Nemáte dostatek prostředků. Váš zůstatek: ${monetizationState.balance} ${monetizationState.currency}`);
        return;
    }

    // Potvrzení nákupu
    if (!confirm(`Opravdu chcete zakoupit ${itemType} za ${price} ${monetizationState.currency}?`)) {
        return;
    }

    // Odečtení částky z účtu
    monetizationState.balance -= price;

    // Aktualizace zůstatku v uživatelském účtu
    if (typeof UserAccounts !== 'undefined' && UserAccounts.state && UserAccounts.state.currentUser) {
        UserAccounts.state.currentUser.balance = monetizationState.balance;
        UserAccounts.saveUserData();
    }

    // Aktualizace zobrazení zůstatku
    updateBalanceDisplay();

    // Aktivace zakoupené funkce
    activatePurchasedFeature(itemType);

    // Zobrazení potvrzení
    alert(`Úspěšně jste zakoupili ${itemType}!`);
}

// Aktivace zakoupené funkce
function activatePurchasedFeature(featureType) {
    console.log(`Aktivace funkce: ${featureType}`);

    switch (featureType) {
        case 'tourist':
            // Aktivace turistických map
            if (typeof MapService !== 'undefined') {
                MapService.enableTouristMaps();
            }
            break;
        case 'satellite':
            // Aktivace satelitních map
            if (typeof MapService !== 'undefined') {
                MapService.enableSatelliteMaps();
            }
            break;
        case 'offline':
            // Aktivace offline map
            if (typeof MapService !== 'undefined') {
                MapService.enableOfflineMaps();
            }
            break;
        default:
            console.log(`Neznámý typ funkce: ${featureType}`);
    }

    // Uložení informace o zakoupené funkci
    const purchasedFeatures = JSON.parse(localStorage.getItem('aiMapaPurchasedFeatures') || '{}');
    purchasedFeatures[featureType] = {
        purchased: true,
        purchaseDate: new Date().toISOString()
    };
    localStorage.setItem('aiMapaPurchasedFeatures', JSON.stringify(purchasedFeatures));
}

// Inicializace monetizace po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Inicializace monetizace
    initMonetization();
});
