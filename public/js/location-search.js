/**
 * Modul pro vyhledávání míst a adres
 * Verze 0.2.8.6.2
 */

const LocationSearch = {
    // Stav vyhledávání
    searching: false,
    
    // Výsledky vyhledávání
    searchResults: [],
    
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro vyhledávání míst...');
        
        // Vytvoření vyhledávacího pole
        this.createSearchBox();
        
        console.log('Modul pro vyhledávání míst byl inicializován');
    },
    
    // Vytvoření vyhledávacího pole
    createSearchBox() {
        // Kontrola, zda již vyhledávací pole neexistuje
        if (document.getElementById('searchBox')) {
            return;
        }
        
        // Vytvoření kontejneru pro vyhledávací pole
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        // Vytvoření vyhledávacího pole
        const searchBox = document.createElement('div');
        searchBox.id = 'searchBox';
        searchBox.className = 'search-box';
        
        // Vytvoření inputu
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'searchInput';
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Vyhledat místo nebo adresu...';
        
        // Vytvoření tlačítka pro vyhledávání
        const searchButton = document.createElement('button');
        searchButton.id = 'searchButton';
        searchButton.className = 'search-button';
        searchButton.innerHTML = '<i class="icon">🔍</i>';
        
        // Vytvoření kontejneru pro výsledky
        const searchResults = document.createElement('div');
        searchResults.id = 'searchResults';
        searchResults.className = 'search-results';
        
        // Sestavení vyhledávacího pole
        searchBox.appendChild(searchInput);
        searchBox.appendChild(searchButton);
        searchContainer.appendChild(searchBox);
        searchContainer.appendChild(searchResults);
        
        // Přidání vyhledávacího pole do mapy
        const mapControls = document.querySelector('.leaflet-top.leaflet-right');
        if (mapControls) {
            const controlContainer = document.createElement('div');
            controlContainer.className = 'leaflet-control-search leaflet-bar leaflet-control';
            controlContainer.appendChild(searchContainer);
            mapControls.appendChild(controlContainer);
        }
        
        // Přidání event listenerů
        searchButton.addEventListener('click', () => {
            this.searchLocation(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchLocation(searchInput.value);
            }
        });
        
        // Event listener pro zobrazení/skrytí výsledků při kliknutí na input
        searchInput.addEventListener('focus', () => {
            if (this.searchResults.length > 0) {
                searchResults.style.display = 'block';
            }
        });
        
        // Event listener pro skrytí výsledků při kliknutí mimo vyhledávací pole
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    },
    
    // Vyhledání lokace
    searchLocation(query) {
        if (!query || query.trim() === '') {
            return;
        }
        
        // Zobrazení informace o vyhledávání
        addMessage(`Vyhledávám: "${query}"...`, false);
        
        // Zobrazení načítání
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '<div class="search-loading">Vyhledávám...</div>';
        searchResults.style.display = 'block';
        
        // Použití Nominatim API pro vyhledávání
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.displaySearchResults(data);
            })
            .catch(error => {
                console.error('Chyba při vyhledávání:', error);
                searchResults.innerHTML = '<div class="search-error">Chyba při vyhledávání. Zkuste to prosím znovu.</div>';
                addMessage('Chyba při vyhledávání. Zkuste to prosím znovu.', false);
            });
    },
    
    // Zobrazení výsledků vyhledávání
    displaySearchResults(results) {
        const searchResults = document.getElementById('searchResults');
        
        // Uložení výsledků
        this.searchResults = results;
        
        // Pokud nejsou žádné výsledky
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">Žádné výsledky nenalezeny.</div>';
            addMessage('Žádné výsledky nenalezeny.', false);
            return;
        }
        
        // Vytvoření seznamu výsledků
        let html = '<ul class="search-results-list">';
        
        results.forEach((result, index) => {
            html += `
                <li class="search-result-item" data-index="${index}">
                    <div class="search-result-icon">📍</div>
                    <div class="search-result-info">
                        <div class="search-result-name">${result.display_name.split(',')[0]}</div>
                        <div class="search-result-address">${result.display_name}</div>
                    </div>
                </li>
            `;
        });
        
        html += '</ul>';
        
        // Zobrazení výsledků
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
        
        // Přidání event listenerů pro položky výsledků
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.getAttribute('data-index'));
                this.selectSearchResult(index);
            });
        });
        
        // Zobrazení informace o počtu nalezených výsledků
        addMessage(`Nalezeno ${results.length} výsledků.`, false);
    },
    
    // Výběr výsledku vyhledávání
    selectSearchResult(index) {
        const result = this.searchResults[index];
        
        if (!result) {
            return;
        }
        
        // Přesun mapy na vybranou lokaci
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        
        if (isNaN(lat) || isNaN(lon)) {
            return;
        }
        
        // Přesun mapy
        map.setView([lat, lon], 16);
        
        // Vytvoření markeru
        const marker = L.marker([lat, lon], {
            icon: L.divIcon({
                className: 'search-marker',
                html: '<div class="search-marker-inner">📍</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            })
        }).addTo(map);
        
        // Vytvoření popup okna
        marker.bindPopup(`
            <div class="search-popup">
                <h3>${result.display_name.split(',')[0]}</h3>
                <p>${result.display_name}</p>
                <div class="search-popup-actions">
                    <button class="search-popup-add-point">Přidat jako bod</button>
                    <button class="search-popup-directions">Navigovat sem</button>
                </div>
            </div>
        `).openPopup();
        
        // Přidání event listenerů pro tlačítka v popup okně
        marker.on('popupopen', () => {
            const addPointButton = document.querySelector('.search-popup-add-point');
            const directionsButton = document.querySelector('.search-popup-directions');
            
            if (addPointButton) {
                addPointButton.addEventListener('click', () => {
                    // Přidání bodu na mapu
                    if (typeof addMarker === 'function') {
                        addMarker(lat, lon, result.display_name.split(',')[0]);
                        marker.closePopup();
                        map.removeLayer(marker);
                    }
                });
            }
            
            if (directionsButton) {
                directionsButton.addEventListener('click', () => {
                    // Navigace na toto místo
                    if (typeof calculateRoute === 'function' && markers.length > 0) {
                        // Vytvoření dočasného cíle
                        const tempMarker = {
                            getLatLng: () => L.latLng(lat, lon)
                        };
                        
                        // Výpočet trasy z posledního bodu na mapě
                        calculateRouteFromTo(markers[markers.length - 1], tempMarker);
                        marker.closePopup();
                        map.removeLayer(marker);
                    } else {
                        addMessage('Pro navigaci potřebujete mít na mapě alespoň jeden bod.', false);
                    }
                });
            }
        });
        
        // Skrytí výsledků vyhledávání
        const searchResults = document.getElementById('searchResults');
        searchResults.style.display = 'none';
        
        // Zobrazení informace o vybraném výsledku
        addMessage(`Přesunuto na: ${result.display_name}`, false);
    },
    
    // Zpracování příkazu z chatu
    processCommand(text) {
        // Kontrola, zda text obsahuje příkaz pro vyhledávání
        const searchCommands = ['vyhledat', 'najít', 'najdi', 'hledat', 'hledej', 'kde je'];
        
        for (const command of searchCommands) {
            if (text.toLowerCase().startsWith(command.toLowerCase() + ' ')) {
                // Extrakce dotazu
                const query = text.substring(command.length).trim();
                
                if (query) {
                    // Vyhledání lokace
                    this.searchLocation(query);
                    return true;
                }
            }
        }
        
        return false;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    LocationSearch.init();
});
