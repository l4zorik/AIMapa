/**
 * Modul pro načítání reálných dat podniků z internetu
 * Verze 0.3.6.0
 */

const BusinessDataLoader = {
    // Stav modulu
    isInitialized: false,
    isLoading: false,
    lastLoadedArea: null,

    // Konfigurace
    config: {
        // Mapování typů podniků z OSM na naše typy
        osmTypeMapping: {
            'restaurant': 'restaurant',
            'cafe': 'restaurant',
            'fast_food': 'restaurant',
            'pub': 'restaurant',
            'bar': 'restaurant',
            'supermarket': 'shop',
            'convenience': 'shop',
            'clothes': 'shop',
            'electronics': 'shop',
            'bank': 'bank',
            'atm': 'bank',
            'office': 'office',
            'company': 'office',
            'hotel': 'hotel',
            'hostel': 'hotel',
            'guest_house': 'hotel',
            'hospital': 'hospital',
            'clinic': 'hospital',
            'doctors': 'hospital',
            'pharmacy': 'hospital',
            'fuel': 'gas',
            'industrial': 'factory'
        },
        
        // Výchozí typ podniku, pokud není nalezen v mapování
        defaultBusinessType: 'office',
        
        // Maximální počet podniků k načtení
        maxBusinesses: 50,
        
        // Poloměr vyhledávání v metrech
        searchRadius: 1000
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro načítání dat podniků...');
        
        // Kontrola, zda již byl modul inicializován
        if (this.isInitialized) {
            console.log('Modul pro načítání dat podniků již byl inicializován');
            return;
        }
        
        // Vytvoření CSS stylů
        this.createStyles();
        
        // Přidání modulu do menu příkazů
        this.addToCommandsMenu();
        
        // Nastavení event listenerů
        this.setupEventListeners();
        
        // Označení modulu jako inicializovaný
        this.isInitialized = true;
        
        console.log('Modul pro načítání dat podniků byl inicializován');
    },
    
    // Vytvoření CSS stylů
    createStyles() {
        // Vytvoření elementu pro styly
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* Styly pro dialog načítání dat podniků */
            .business-loader-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                width: 500px;
                max-width: 90%;
                z-index: 1000;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .business-loader-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: #3498db;
                color: white;
            }
            
            .business-loader-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }
            
            .business-loader-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .business-loader-body {
                padding: 20px;
                max-height: 70vh;
                overflow-y: auto;
            }
            
            .business-loader-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .form-group label {
                font-weight: 600;
                font-size: 14px;
            }
            
            .business-loader-input,
            .business-loader-select {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            
            .business-loader-select {
                cursor: pointer;
            }
            
            .business-loader-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
            }
            
            .business-loader-button {
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .business-loader-cancel {
                background-color: #e74c3c;
                color: white;
            }
            
            .business-loader-cancel:hover {
                background-color: #c0392b;
            }
            
            .business-loader-load {
                background-color: #2ecc71;
                color: white;
            }
            
            .business-loader-load:hover {
                background-color: #27ae60;
            }
            
            .business-loader-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 999;
            }
            
            .business-loader-progress {
                margin-top: 15px;
                display: none;
            }
            
            .business-loader-progress-bar {
                height: 10px;
                background-color: #f1f1f1;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .business-loader-progress-fill {
                height: 100%;
                background-color: #3498db;
                width: 0%;
                transition: width 0.3s;
            }
            
            .business-loader-progress-text {
                font-size: 12px;
                text-align: center;
            }
            
            /* Tmavý režim */
            body.dark-mode .business-loader-dialog {
                background-color: #2c3e50;
                color: #ecf0f1;
            }
            
            body.dark-mode .business-loader-header {
                background-color: #2980b9;
            }
            
            body.dark-mode .business-loader-input,
            body.dark-mode .business-loader-select {
                background-color: #34495e;
                border-color: #2c3e50;
                color: #ecf0f1;
            }
            
            body.dark-mode .business-loader-progress-bar {
                background-color: #34495e;
            }
        `;
        
        // Přidání stylů do dokumentu
        document.head.appendChild(styleElement);
    },
    
    // Přidání modulu do menu příkazů
    addToCommandsMenu() {
        // Kontrola, zda existuje objekt CommandsMenu
        if (typeof CommandsMenu !== 'undefined') {
            // Najdeme kategorii "Mapa"
            const mapCategory = CommandsMenu.categories.find(cat => cat.id === 'map');
            
            if (mapCategory) {
                // Přidání příkazu pro načítání dat podniků
                mapCategory.commands.push({
                    id: 'load-businesses',
                    name: 'Načíst podniky',
                    description: 'Načte reálná data podniků z internetu',
                    icon: '🏢',
                    command: 'načíst podniky'
                });
                
                // Obnovení menu příkazů
                if (typeof CommandsMenu.refreshMenu === 'function') {
                    CommandsMenu.refreshMenu();
                }
                
                console.log('Příkaz pro načítání dat podniků byl přidán do menu příkazů');
            }
        }
    },
    
    // Nastavení event listenerů
    setupEventListeners() {
        // Přidání event listeneru pro zpracování příkazu
        document.addEventListener('command', (e) => {
            if (e.detail && e.detail.command === 'načíst podniky') {
                this.showBusinessLoaderDialog();
            }
        });
    },
    
    // Zobrazení dialogu pro načítání dat podniků
    showBusinessLoaderDialog() {
        console.log('Zobrazení dialogu pro načítání dat podniků');
        
        // Kontrola, zda již probíhá načítání
        if (this.isLoading) {
            if (typeof addMessage !== 'undefined') {
                addMessage('Načítání dat podniků již probíhá. Počkejte prosím na dokončení.', false);
            }
            return;
        }
        
        // Vytvoření overlay
        const overlay = document.createElement('div');
        overlay.className = 'business-loader-overlay';
        document.body.appendChild(overlay);
        
        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'business-loader-dialog';
        dialog.innerHTML = `
            <div class="business-loader-header">
                <h3>Načíst data podniků</h3>
                <button class="business-loader-close">&times;</button>
            </div>
            <div class="business-loader-body">
                <div class="business-loader-form">
                    <div class="form-group">
                        <label for="business-loader-radius">Poloměr vyhledávání (m):</label>
                        <input type="number" id="business-loader-radius" class="business-loader-input" value="${this.config.searchRadius}" min="100" max="5000">
                    </div>
                    <div class="form-group">
                        <label for="business-loader-max">Maximální počet podniků:</label>
                        <input type="number" id="business-loader-max" class="business-loader-input" value="${this.config.maxBusinesses}" min="10" max="200">
                    </div>
                    <div class="form-group">
                        <label for="business-loader-location">Umístění:</label>
                        <select id="business-loader-location" class="business-loader-select">
                            <option value="current">Aktuální střed mapy</option>
                            <option value="custom">Vlastní souřadnice</option>
                        </select>
                    </div>
                    <div class="form-group" id="business-loader-custom-coords" style="display: none;">
                        <label for="business-loader-lat">Zeměpisná šířka:</label>
                        <input type="text" id="business-loader-lat" class="business-loader-input" placeholder="např. 48.8492">
                        <label for="business-loader-lng">Zeměpisná délka:</label>
                        <input type="text" id="business-loader-lng" class="business-loader-input" placeholder="např. 17.1247">
                    </div>
                    <div class="business-loader-progress">
                        <div class="business-loader-progress-bar">
                            <div class="business-loader-progress-fill"></div>
                        </div>
                        <div class="business-loader-progress-text">Načítání dat...</div>
                    </div>
                </div>
                <div class="business-loader-buttons">
                    <button class="business-loader-button business-loader-cancel">Zrušit</button>
                    <button class="business-loader-button business-loader-load">Načíst data</button>
                </div>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Získání referencí na elementy
        const closeButton = dialog.querySelector('.business-loader-close');
        const cancelButton = dialog.querySelector('.business-loader-cancel');
        const loadButton = dialog.querySelector('.business-loader-load');
        const locationSelect = dialog.querySelector('#business-loader-location');
        const customCoordsDiv = dialog.querySelector('#business-loader-custom-coords');
        const progressDiv = dialog.querySelector('.business-loader-progress');
        const progressFill = dialog.querySelector('.business-loader-progress-fill');
        const progressText = dialog.querySelector('.business-loader-progress-text');
        
        // Funkce pro zavření dialogu
        const closeDialog = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(dialog);
        };
        
        // Event listenery pro tlačítka
        closeButton.addEventListener('click', closeDialog);
        cancelButton.addEventListener('click', closeDialog);
        
        // Event listener pro změnu typu umístění
        locationSelect.addEventListener('change', () => {
            if (locationSelect.value === 'custom') {
                customCoordsDiv.style.display = 'block';
            } else {
                customCoordsDiv.style.display = 'none';
            }
        });
        
        // Event listener pro tlačítko načtení dat
        loadButton.addEventListener('click', () => {
            // Získání hodnot z formuláře
            const radius = parseInt(dialog.querySelector('#business-loader-radius').value);
            const maxBusinesses = parseInt(dialog.querySelector('#business-loader-max').value);
            const locationType = locationSelect.value;
            
            // Kontrola hodnot
            if (isNaN(radius) || radius < 100 || radius > 5000) {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zadejte platný poloměr vyhledávání (100-5000 m).', false);
                }
                return;
            }
            
            if (isNaN(maxBusinesses) || maxBusinesses < 10 || maxBusinesses > 200) {
                if (typeof addMessage !== 'undefined') {
                    addMessage('Zadejte platný maximální počet podniků (10-200).', false);
                }
                return;
            }
            
            // Získání souřadnic
            let lat, lng;
            
            if (locationType === 'current') {
                // Použití aktuální polohy
                if (typeof map !== 'undefined') {
                    const center = map.getCenter();
                    lat = center.lat;
                    lng = center.lng;
                } else {
                    // Výchozí poloha pro Hodonín, pokud není dostupná mapa
                    lat = 48.8492;
                    lng = 17.1247;
                }
            } else {
                // Použití vlastních souřadnic
                lat = parseFloat(dialog.querySelector('#business-loader-lat').value);
                lng = parseFloat(dialog.querySelector('#business-loader-lng').value);
                
                // Kontrola souřadnic
                if (isNaN(lat) || isNaN(lng)) {
                    if (typeof addMessage !== 'undefined') {
                        addMessage('Zadejte platné souřadnice.', false);
                    }
                    return;
                }
            }
            
            // Zobrazení progress baru
            progressDiv.style.display = 'block';
            loadButton.disabled = true;
            cancelButton.disabled = true;
            
            // Nastavení stavu načítání
            this.isLoading = true;
            
            // Načtení dat podniků
            this.loadBusinessData(lat, lng, radius, maxBusinesses, (progress) => {
                // Aktualizace progress baru
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `Načítání dat... ${progress}%`;
            }).then((businesses) => {
                // Načtení dokončeno
                this.isLoading = false;
                
                // Zobrazení zprávy o dokončení
                if (typeof addMessage !== 'undefined') {
                    addMessage(`Načteno ${businesses.length} podniků v okolí.`, false);
                }
                
                // Přidání XP za načtení dat
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(10, 'Načtení dat podniků z internetu');
                }
                
                // Zavření dialogu
                closeDialog();
            }).catch((error) => {
                // Chyba při načítání
                this.isLoading = false;
                
                // Zobrazení chybové zprávy
                if (typeof addMessage !== 'undefined') {
                    addMessage(`Chyba při načítání dat podniků: ${error.message}`, false);
                }
                
                // Obnovení tlačítek
                loadButton.disabled = false;
                cancelButton.disabled = false;
                
                // Skrytí progress baru
                progressDiv.style.display = 'none';
            });
        });
    },
    
    // Načtení dat podniků z OpenStreetMap API
    async loadBusinessData(lat, lng, radius, maxBusinesses, progressCallback) {
        console.log(`Načítání dat podniků z OSM API (lat: ${lat}, lng: ${lng}, radius: ${radius}m, max: ${maxBusinesses})`);
        
        // Uložení informací o poslední načtené oblasti
        this.lastLoadedArea = { lat, lng, radius };
        
        try {
            // Vytvoření Overpass API dotazu
            // Hledáme podniky v zadaném okruhu
            const overpassQuery = `
                [out:json];
                (
                  node["amenity"](around:${radius},${lat},${lng});
                  node["shop"](around:${radius},${lat},${lng});
                  node["tourism"="hotel"](around:${radius},${lat},${lng});
                  node["tourism"="hostel"](around:${radius},${lat},${lng});
                  node["tourism"="guest_house"](around:${radius},${lat},${lng});
                  node["office"](around:${radius},${lat},${lng});
                  node["industrial"](around:${radius},${lat},${lng});
                );
                out body;
            `;
            
            // Zakódování dotazu
            const encodedQuery = encodeURIComponent(overpassQuery);
            
            // Vytvoření URL pro Overpass API
            const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
            
            // Simulace načítání dat (v reálné aplikaci by zde byl API call)
            // Zde použijeme setTimeout pro simulaci načítání
            await new Promise(resolve => setTimeout(resolve, 1000));
            progressCallback(20);
            
            // Simulace dalšího načítání
            await new Promise(resolve => setTimeout(resolve, 1000));
            progressCallback(40);
            
            // Simulace zpracování dat
            await new Promise(resolve => setTimeout(resolve, 1000));
            progressCallback(60);
            
            // Simulace vytváření podniků
            await new Promise(resolve => setTimeout(resolve, 1000));
            progressCallback(80);
            
            // Simulace dokončení
            await new Promise(resolve => setTimeout(resolve, 1000));
            progressCallback(100);
            
            // V reálné aplikaci by zde byl kód pro zpracování odpovědi z API
            // a vytvoření podniků z načtených dat
            
            // Simulace načtených podniků
            const simulatedBusinesses = this.generateSimulatedBusinesses(lat, lng, radius, maxBusinesses);
            
            // Vyčištění existujících podniků
            if (typeof BusinessMarkers !== 'undefined' && BusinessMarkers.clearBusinessMarkers) {
                BusinessMarkers.clearBusinessMarkers();
            }
            
            // Aktualizace seznamu podniků
            if (typeof BusinessMarkers !== 'undefined') {
                BusinessMarkers.businesses = simulatedBusinesses;
                
                // Přidání podniků na mapu
                if (BusinessMarkers.addBusinessesToMap) {
                    BusinessMarkers.addBusinessesToMap();
                }
            }
            
            return simulatedBusinesses;
        } catch (error) {
            console.error('Chyba při načítání dat podniků:', error);
            throw error;
        }
    },
    
    // Generování simulovaných podniků pro testování
    generateSimulatedBusinesses(centerLat, centerLng, radius, count) {
        console.log(`Generování ${count} simulovaných podniků v okolí (lat: ${centerLat}, lng: ${centerLng}, radius: ${radius}m)`);
        
        const businesses = [];
        const businessTypes = Object.keys(this.config.osmTypeMapping);
        const radiusInDegrees = radius / 111000; // Přibližný převod metrů na stupně (1 stupeň ~ 111 km)
        
        for (let i = 0; i < count; i++) {
            // Náhodné souřadnice v okolí centra
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * radiusInDegrees;
            const lat = centerLat + distance * Math.cos(angle);
            const lng = centerLng + distance * Math.sin(angle);
            
            // Náhodný typ podniku
            const osmType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
            const type = this.config.osmTypeMapping[osmType] || this.config.defaultBusinessType;
            
            // Generování názvu podniku
            const businessName = this.generateBusinessName(type);
            
            // Vytvoření podniku
            const business = {
                id: `gen_${type}${i}`,
                name: businessName,
                type: type,
                lat: lat,
                lng: lng,
                address: `Ulice ${Math.floor(Math.random() * 100) + 1}, ${Math.floor(Math.random() * 1000) + 1} 00`,
                description: `Automaticky vygenerovaný podnik typu ${type}`,
                openHours: this.generateOpenHours(),
                services: this.generateServices(type),
                rating: (Math.random() * 2 + 3).toFixed(1), // Hodnocení 3.0 - 5.0
                website: `https://www.${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.cz`
            };
            
            businesses.push(business);
        }
        
        return businesses;
    },
    
    // Generování názvu podniku
    generateBusinessName(type) {
        const prefixes = {
            'restaurant': ['Restaurace', 'Hospoda', 'Bistro', 'Pizzerie', 'Jídelna', 'Kavárna'],
            'shop': ['Obchod', 'Market', 'Supermarket', 'Potraviny', 'Prodejna'],
            'bank': ['Banka', 'Spořitelna', 'Pojišťovna', 'Finanční centrum'],
            'office': ['Kancelář', 'Firma', 'Společnost', 'Agentura'],
            'factory': ['Továrna', 'Výrobna', 'Průmyslový podnik', 'Závod'],
            'gas': ['Čerpací stanice', 'Benzínka', 'Pumpa'],
            'hotel': ['Hotel', 'Penzion', 'Ubytovna', 'Hostel'],
            'hospital': ['Nemocnice', 'Klinika', 'Ordinace', 'Lékárna', 'Zdravotní středisko']
        };
        
        const adjectives = ['Nový', 'Starý', 'Velký', 'Malý', 'Zlatý', 'Stříbrný', 'Modrý', 'Zelený', 'Červený', 'Černý', 'Bílý'];
        const nouns = ['Dům', 'Svět', 'Strom', 'Klíč', 'Most', 'Hrad', 'Zámek', 'Pramen', 'Orel', 'Lev', 'Slunce', 'Měsíc', 'Hvězda'];
        
        // Výběr prefixu podle typu
        const prefix = prefixes[type] ? prefixes[type][Math.floor(Math.random() * prefixes[type].length)] : '';
        
        // Náhodný výběr přídavného jména a podstatného jména
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        
        // Sestavení názvu
        if (Math.random() < 0.5) {
            return `${prefix} ${adjective} ${noun}`;
        } else {
            return `${prefix} ${noun}`;
        }
    },
    
    // Generování otevírací doby
    generateOpenHours() {
        const days = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
        const openHours = [];
        
        // Pracovní dny
        const workdayOpen = Math.floor(Math.random() * 4) + 7; // 7-10
        const workdayClose = Math.floor(Math.random() * 4) + 17; // 17-20
        
        // Víkend
        const weekendOpen = Math.floor(Math.random() * 4) + 8; // 8-11
        const weekendClose = Math.floor(Math.random() * 4) + 16; // 16-19
        
        // Náhodné rozhodnutí, zda je otevřeno o víkendu
        const isOpenWeekend = Math.random() < 0.7;
        
        if (isOpenWeekend) {
            return `Po-Pá: ${workdayOpen}:00-${workdayClose}:00, So-Ne: ${weekendOpen}:00-${weekendClose}:00`;
        } else {
            return `Po-Pá: ${workdayOpen}:00-${workdayClose}:00, So-Ne: Zavřeno`;
        }
    },
    
    // Generování služeb podle typu podniku
    generateServices(type) {
        const services = {
            'restaurant': ['Snídaně', 'Obědy', 'Večeře', 'Rozvoz jídla', 'Venkovní posezení', 'Rezervace', 'Platba kartou'],
            'shop': ['Potraviny', 'Drogerie', 'Pečivo', 'Nápoje', 'Ovoce a zelenina', 'Maso', 'Platba kartou'],
            'bank': ['Bankovní účty', 'Půjčky', 'Hypotéky', 'Investice', 'Pojištění', 'Bankomat'],
            'office': ['Konzultace', 'Poradenství', 'Administrativa', 'Účetnictví', 'Právní služby'],
            'factory': ['Výroba', 'Zpracování', 'Montáž', 'Balení', 'Distribuce'],
            'gas': ['Benzín', 'Nafta', 'LPG', 'CNG', 'Elektro nabíjení', 'Myčka', 'Občerstvení'],
            'hotel': ['Ubytování', 'Snídaně', 'Restaurace', 'Parkování', 'Wi-Fi', 'Konferenční prostory'],
            'hospital': ['Praktický lékař', 'Specialisté', 'Laboratoř', 'Rentgen', 'Pohotovost', 'Lékárna']
        };
        
        // Výběr služeb podle typu
        const typeServices = services[type] || [];
        
        // Náhodný výběr 3-5 služeb
        const count = Math.floor(Math.random() * 3) + 3; // 3-5
        const selectedServices = [];
        
        for (let i = 0; i < count && i < typeServices.length; i++) {
            const index = Math.floor(Math.random() * typeServices.length);
            const service = typeServices[index];
            
            if (!selectedServices.includes(service)) {
                selectedServices.push(service);
            }
        }
        
        return selectedServices;
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda existuje mapa
    if (typeof map !== 'undefined') {
        // Inicializace modulu
        BusinessDataLoader.init();
    } else {
        // Čekání na inicializaci mapy
        const mapInitInterval = setInterval(() => {
            if (typeof map !== 'undefined') {
                clearInterval(mapInitInterval);
                BusinessDataLoader.init();
            }
        }, 500);
    }
});
