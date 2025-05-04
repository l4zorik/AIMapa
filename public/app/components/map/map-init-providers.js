/**
 * Inicializace mapových poskytovatelů
 * Verze 0.3.8.7
 * 
 * Tento soubor inicializuje mapové poskytovatele a integruje je do aplikace AIMapa
 */

// Inicializace mapových poskytovatelů po načtení stránky
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Inicializace mapových poskytovatelů...');
    
    try {
        // Inicializace hlavního modulu mapových poskytovatelů
        await MapProviders.init('openstreetmap');
        
        // Inicializace jednotlivých poskytovatelů s API klíči
        // Poznámka: V produkčním prostředí by API klíče měly být získány z bezpečného úložiště
        
        // Mapy.cz - nepotřebuje API klíč pro základní funkce
        if (typeof MapyCzProvider !== 'undefined') {
            await MapyCzProvider.init();
        }
        
        // OpenRouteService - vyžaduje API klíč
        if (typeof OpenRouteServiceProvider !== 'undefined') {
            // API klíč by měl být získán z bezpečného úložiště
            const openRouteServiceApiKey = localStorage.getItem('openRouteServiceApiKey') || '';
            await OpenRouteServiceProvider.init(openRouteServiceApiKey);
        }
        
        // Windy - vyžaduje API klíč
        if (typeof WindyProvider !== 'undefined') {
            // API klíč by měl být získán z bezpečného úložiště
            const windyApiKey = localStorage.getItem('windyApiKey') || '';
            await WindyProvider.init(windyApiKey);
        }
        
        // Freemap Slovakia - nepotřebuje API klíč pro základní funkce
        if (typeof FreemapSlovakiaProvider !== 'undefined') {
            await FreemapSlovakiaProvider.init();
        }
        
        // Nastavení poskytovatele podle geolokace
        await setProviderByGeolocation();
        
        // Přidání posluchačů událostí
        setupEventListeners();
        
        console.log('Mapové poskytovatele byly úspěšně inicializovány');
    } catch (error) {
        console.error('Chyba při inicializaci mapových poskytovatelů:', error);
    }
});

// Nastavení poskytovatele podle geolokace
async function setProviderByGeolocation() {
    try {
        // Kontrola, zda je k dispozici geolokace
        if (!navigator.geolocation) {
            console.log('Geolokace není podporována, používám výchozího poskytovatele');
            return;
        }
        
        // Získání aktuální polohy
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });
        
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        console.log(`Získána geolokace: ${lat}, ${lon}`);
        
        // Získání informací o místě
        const placeInfo = await MapProviders.getPlaceInfo([lat, lon]);
        
        // Získání kódu země
        const countryCode = placeInfo.address.country_code?.toUpperCase() || 
                           placeInfo.address.country?.substring(0, 2).toUpperCase();
        
        if (!countryCode) {
            console.log('Nepodařilo se získat kód země, používám výchozího poskytovatele');
            return;
        }
        
        console.log(`Zjištěn kód země: ${countryCode}`);
        
        // Získání nejlepšího poskytovatele pro danou zemi
        const bestProvider = MapProviders.getBestProviderForCountry(countryCode);
        
        // Nastavení poskytovatele
        MapProviders.setProvider(bestProvider);
        
        console.log(`Nastaven poskytovatel pro zemi ${countryCode}: ${bestProvider}`);
    } catch (error) {
        console.error('Chyba při nastavení poskytovatele podle geolokace:', error);
        console.log('Používám výchozího poskytovatele');
    }
}

// Nastavení posluchačů událostí
function setupEventListeners() {
    // Posluchač události pro změnu poskytovatele
    document.addEventListener('mapProviderChanged', (event) => {
        const providerId = event.detail.provider;
        console.log(`Změna poskytovatele na: ${providerId}`);
        
        // Aktualizace UI
        updateProviderUI(providerId);
        
        // Aktualizace mapy
        updateMap();
    });
    
    // Přidání posluchačů událostí pro tlačítka poskytovatelů
    const providerButtons = document.querySelectorAll('.provider-button');
    providerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const providerId = button.getAttribute('data-provider');
            MapProviders.setProvider(providerId);
        });
    });
}

// Aktualizace UI podle poskytovatele
function updateProviderUI(providerId) {
    // Aktualizace aktivního tlačítka
    const providerButtons = document.querySelectorAll('.provider-button');
    providerButtons.forEach(button => {
        if (button.getAttribute('data-provider') === providerId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Aktualizace informací o poskytovateli
    const provider = MapProviders.providers[providerId];
    
    if (!provider) {
        return;
    }
    
    const providerInfoElement = document.getElementById('provider-info');
    if (providerInfoElement) {
        providerInfoElement.innerHTML = `
            <h3>${provider.name}</h3>
            <p>${provider.description}</p>
            <p class="attribution">${provider.attribution}</p>
            <a href="${provider.website}" target="_blank" rel="noopener noreferrer">Webová stránka poskytovatele</a>
        `;
    }
}

// Aktualizace mapy
function updateMap() {
    // Získání instance mapy
    const map = window.map;
    
    if (!map) {
        console.error('Mapa není inicializována');
        return;
    }
    
    // Získání aktuálního poskytovatele
    const provider = MapProviders.getCurrentProvider();
    
    if (!provider) {
        console.error('Poskytovatel není inicializován');
        return;
    }
    
    // Získání mapových dlaždic
    const tileLayer = provider.getTileLayer();
    
    // Odstranění stávající vrstvy
    map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });
    
    // Přidání nové vrstvy
    L.tileLayer(tileLayer.url, tileLayer.options).addTo(map);
}

// Export funkcí
window.MapInitProviders = {
    setProviderByGeolocation,
    updateProviderUI,
    updateMap
};
