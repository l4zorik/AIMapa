/**
 * Modul pro prodej aut
 * Verze 0.2.9.5
 */

const CarSales = {
    // Stav modulu
    isInitialized: false,
    
    // Auta k prodeji
    cars: [
        {
            id: 'skoda-octavia-2018',
            brand: 'Škoda',
            model: 'Octavia',
            year: 2018,
            price: 320000,
            mileage: 85000,
            fuel: 'diesel',
            transmission: 'manual',
            power: 110,
            color: 'modrá',
            description: 'Škoda Octavia 2018 v perfektním stavu. Pravidelně servisovaná, nehavarovaná, první majitel. Vůz má bohatou výbavu včetně navigace, vyhřívaných sedadel, parkovacích senzorů a automatické klimatizace.',
            images: [
                'https://cdn.pixabay.com/photo/2018/04/09/22/08/skoda-3305881_1280.jpg',
                'https://cdn.pixabay.com/photo/2018/02/04/15/45/car-3130111_1280.jpg',
                'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg'
            ],
            specs: {
                'Motor': '2.0 TDI',
                'Výkon': '110 kW',
                'Převodovka': 'Manuální, 6 stupňů',
                'Pohon': 'Přední',
                'Spotřeba': '4.9 l/100 km',
                'Emise CO2': '129 g/km',
                'Objem kufru': '590 l',
                'Počet míst': '5',
                'Barva': 'Modrá Race metalíza'
            },
            features: ['Navigace', 'Vyhřívaná sedadla', 'Parkovací senzory', 'Automatická klimatizace', 'Tempomat', 'Bluetooth', 'USB', 'Mlhovky', 'Elektrická okna', 'Elektrická zrcátka']
        },
        {
            id: 'vw-golf-2019',
            brand: 'Volkswagen',
            model: 'Golf',
            year: 2019,
            price: 350000,
            mileage: 65000,
            fuel: 'petrol',
            transmission: 'automatic',
            power: 96,
            color: 'bílá',
            description: 'Volkswagen Golf 2019 v perfektním stavu. Pravidelně servisovaný, nehavarovaný, první majitel. Vůz má bohatou výbavu včetně navigace, vyhřívaných sedadel, parkovacích senzorů a automatické klimatizace.',
            images: [
                'https://cdn.pixabay.com/photo/2017/01/19/13/22/car-1992539_1280.jpg',
                'https://cdn.pixabay.com/photo/2016/11/18/12/51/automobile-1834274_1280.jpg',
                'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg'
            ],
            specs: {
                'Motor': '1.5 TSI',
                'Výkon': '96 kW',
                'Převodovka': 'Automatická DSG, 7 stupňů',
                'Pohon': 'Přední',
                'Spotřeba': '5.2 l/100 km',
                'Emise CO2': '119 g/km',
                'Objem kufru': '380 l',
                'Počet míst': '5',
                'Barva': 'Bílá Pure'
            },
            features: ['Navigace', 'Vyhřívaná sedadla', 'Parkovací senzory', 'Automatická klimatizace', 'Adaptivní tempomat', 'Bluetooth', 'USB', 'LED světlomety', 'Elektrická okna', 'Elektrická zrcátka']
        },
        {
            id: 'hyundai-i30-2020',
            brand: 'Hyundai',
            model: 'i30',
            year: 2020,
            price: 380000,
            mileage: 45000,
            fuel: 'petrol',
            transmission: 'manual',
            power: 88,
            color: 'červená',
            description: 'Hyundai i30 2020 v perfektním stavu. Pravidelně servisovaný, nehavarovaný, první majitel. Vůz má bohatou výbavu včetně navigace, vyhřívaných sedadel, parkovacích senzorů a automatické klimatizace.',
            images: [
                'https://cdn.pixabay.com/photo/2017/06/12/17/02/hyundai-2396064_1280.jpg',
                'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg',
                'https://cdn.pixabay.com/photo/2016/11/18/12/51/automobile-1834274_1280.jpg'
            ],
            specs: {
                'Motor': '1.4 T-GDI',
                'Výkon': '88 kW',
                'Převodovka': 'Manuální, 6 stupňů',
                'Pohon': 'Přední',
                'Spotřeba': '5.5 l/100 km',
                'Emise CO2': '125 g/km',
                'Objem kufru': '395 l',
                'Počet míst': '5',
                'Barva': 'Červená Engine'
            },
            features: ['Navigace', 'Vyhřívaná sedadla', 'Parkovací senzory', 'Automatická klimatizace', 'Tempomat', 'Bluetooth', 'USB', 'LED světlomety', 'Elektrická okna', 'Elektrická zrcátka']
        },
        {
            id: 'toyota-corolla-2017',
            brand: 'Toyota',
            model: 'Corolla',
            year: 2017,
            price: 290000,
            mileage: 95000,
            fuel: 'hybrid',
            transmission: 'automatic',
            power: 90,
            color: 'stříbrná',
            description: 'Toyota Corolla 2017 v perfektním stavu. Pravidelně servisovaná, nehavarovaná, první majitel. Vůz má bohatou výbavu včetně navigace, vyhřívaných sedadel, parkovacích senzorů a automatické klimatizace.',
            images: [
                'https://cdn.pixabay.com/photo/2014/09/07/22/34/car-438467_1280.jpg',
                'https://cdn.pixabay.com/photo/2016/11/18/12/51/automobile-1834274_1280.jpg',
                'https://cdn.pixabay.com/photo/2017/03/27/14/56/auto-2179220_1280.jpg'
            ],
            specs: {
                'Motor': '1.8 Hybrid',
                'Výkon': '90 kW',
                'Převodovka': 'Automatická e-CVT',
                'Pohon': 'Přední',
                'Spotřeba': '3.9 l/100 km',
                'Emise CO2': '89 g/km',
                'Objem kufru': '360 l',
                'Počet míst': '5',
                'Barva': 'Stříbrná Celestial'
            },
            features: ['Navigace', 'Vyhřívaná sedadla', 'Parkovací senzory', 'Automatická klimatizace', 'Adaptivní tempomat', 'Bluetooth', 'USB', 'LED světlomety', 'Elektrická okna', 'Elektrická zrcátka']
        }
    ],
    
    // Inicializace modulu
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializace modulu pro prodej aut...');
        
        // Přidání CSS stylů
        this.addStyles();
        
        this.isInitialized = true;
        console.log('Modul pro prodej aut byl inicializován');
    },
    
    // Přidání CSS stylů
    addStyles() {
        if (!document.querySelector('link[href="car-sales.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'car-sales.css';
            document.head.appendChild(link);
        }
    },
    
    // Zobrazení okna prodeje aut
    showCarSalesDialog() {
        // Odstranění existujícího dialogu, pokud existuje
        const existingDialog = document.querySelector('.car-sales-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'car-sales-dialog';
        
        // Vytvoření obsahu dialogu
        dialog.innerHTML = `
            <div class="car-sales-header">
                <h2>Prodej aut v Hodoníně</h2>
                <button class="car-sales-close">&times;</button>
            </div>
            <div class="car-sales-content">
                <div class="car-sales-filters">
                    <div class="car-filter">
                        <label for="brand-filter">Značka:</label>
                        <select id="brand-filter">
                            <option value="all">Všechny</option>
                            <option value="Škoda">Škoda</option>
                            <option value="Volkswagen">Volkswagen</option>
                            <option value="Hyundai">Hyundai</option>
                            <option value="Toyota">Toyota</option>
                        </select>
                    </div>
                    <div class="car-filter">
                        <label for="price-filter">Cena do:</label>
                        <select id="price-filter">
                            <option value="all">Všechny</option>
                            <option value="300000">300 000 Kč</option>
                            <option value="350000">350 000 Kč</option>
                            <option value="400000">400 000 Kč</option>
                        </select>
                    </div>
                    <div class="car-filter">
                        <label for="fuel-filter">Palivo:</label>
                        <select id="fuel-filter">
                            <option value="all">Všechny</option>
                            <option value="petrol">Benzín</option>
                            <option value="diesel">Diesel</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                </div>
                <div class="car-grid">
                    ${this.renderCarCards()}
                </div>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Přidání event listenerů
        const closeButton = dialog.querySelector('.car-sales-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.remove();
            });
        }
        
        // Přidání event listenerů pro filtry
        const brandFilter = dialog.querySelector('#brand-filter');
        const priceFilter = dialog.querySelector('#price-filter');
        const fuelFilter = dialog.querySelector('#fuel-filter');
        
        if (brandFilter && priceFilter && fuelFilter) {
            const filters = [brandFilter, priceFilter, fuelFilter];
            filters.forEach(filter => {
                filter.addEventListener('change', () => {
                    this.filterCars(dialog);
                });
            });
        }
        
        // Přidání event listenerů pro karty aut
        const carCards = dialog.querySelectorAll('.car-card');
        carCards.forEach(card => {
            card.addEventListener('click', () => {
                const carId = card.getAttribute('data-car-id');
                this.showCarDetail(carId);
            });
        });
        
        // Přidání XP za zobrazení prodeje aut
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(5, 'Prohlížení nabídky aut');
        }
    },
    
    // Vykreslení karet aut
    renderCarCards() {
        return this.cars.map(car => `
            <div class="car-card" data-car-id="${car.id}">
                <div class="car-image-container">
                    <img src="${car.images[0]}" alt="${car.brand} ${car.model}" class="car-image">
                    ${car.year >= 2019 ? '<div class="car-badge">Novinka</div>' : ''}
                </div>
                <div class="car-info">
                    <h3 class="car-title">${car.brand} ${car.model} (${car.year})</h3>
                    <div class="car-price">${this.formatPrice(car.price)} Kč</div>
                    <div class="car-details">
                        <div class="car-detail"><i>🛣️</i> ${this.formatNumber(car.mileage)} km</div>
                        <div class="car-detail"><i>⛽</i> ${this.getFuelType(car.fuel)}</div>
                        <div class="car-detail"><i>🔄</i> ${this.getTransmissionType(car.transmission)}</div>
                    </div>
                    <div class="car-actions">
                        <button class="car-btn car-btn-primary">Zobrazit detail</button>
                        <button class="car-btn car-btn-secondary">Rezervovat</button>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Filtrování aut
    filterCars(dialog) {
        const brandFilter = dialog.querySelector('#brand-filter').value;
        const priceFilter = dialog.querySelector('#price-filter').value;
        const fuelFilter = dialog.querySelector('#fuel-filter').value;
        
        const carGrid = dialog.querySelector('.car-grid');
        
        // Filtrování aut
        const filteredCars = this.cars.filter(car => {
            const brandMatch = brandFilter === 'all' || car.brand === brandFilter;
            const priceMatch = priceFilter === 'all' || car.price <= parseInt(priceFilter);
            const fuelMatch = fuelFilter === 'all' || car.fuel === fuelFilter;
            
            return brandMatch && priceMatch && fuelMatch;
        });
        
        // Vykreslení filtrovaných aut
        carGrid.innerHTML = filteredCars.length > 0 ? 
            filteredCars.map(car => `
                <div class="car-card" data-car-id="${car.id}">
                    <div class="car-image-container">
                        <img src="${car.images[0]}" alt="${car.brand} ${car.model}" class="car-image">
                        ${car.year >= 2019 ? '<div class="car-badge">Novinka</div>' : ''}
                    </div>
                    <div class="car-info">
                        <h3 class="car-title">${car.brand} ${car.model} (${car.year})</h3>
                        <div class="car-price">${this.formatPrice(car.price)} Kč</div>
                        <div class="car-details">
                            <div class="car-detail"><i>🛣️</i> ${this.formatNumber(car.mileage)} km</div>
                            <div class="car-detail"><i>⛽</i> ${this.getFuelType(car.fuel)}</div>
                            <div class="car-detail"><i>🔄</i> ${this.getTransmissionType(car.transmission)}</div>
                        </div>
                        <div class="car-actions">
                            <button class="car-btn car-btn-primary">Zobrazit detail</button>
                            <button class="car-btn car-btn-secondary">Rezervovat</button>
                        </div>
                    </div>
                </div>
            `).join('') : 
            '<div class="no-cars-message">Žádná auta neodpovídají vybraným filtrům.</div>';
        
        // Přidání event listenerů pro karty aut
        const carCards = dialog.querySelectorAll('.car-card');
        carCards.forEach(card => {
            card.addEventListener('click', () => {
                const carId = card.getAttribute('data-car-id');
                this.showCarDetail(carId);
            });
        });
    },
    
    // Zobrazení detailu auta
    showCarDetail(carId) {
        // Nalezení auta podle ID
        const car = this.cars.find(car => car.id === carId);
        
        if (!car) return;
        
        // Odstranění existujícího modalu, pokud existuje
        const existingModal = document.querySelector('.car-detail-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.className = 'car-detail-modal';
        
        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="car-detail-header">
                <h2>${car.brand} ${car.model} (${car.year})</h2>
                <button class="car-detail-close">&times;</button>
            </div>
            <div class="car-detail-content">
                <div class="car-detail-gallery">
                    <div class="car-detail-main-image">
                        <img src="${car.images[0]}" alt="${car.brand} ${car.model}" id="main-car-image">
                    </div>
                    <div class="car-detail-thumbnails">
                        ${car.images.map((image, index) => `
                            <div class="car-thumbnail ${index === 0 ? 'active' : ''}" data-image="${image}">
                                <img src="${image}" alt="${car.brand} ${car.model} - obrázek ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="car-detail-info">
                    <div class="car-detail-main-info">
                        <div class="car-detail-price">${this.formatPrice(car.price)} Kč</div>
                        <div class="car-detail-description">${car.description}</div>
                        <div class="car-detail-features">
                            <h3>Výbava</h3>
                            <div class="car-features-list">
                                ${car.features.map(feature => `<div class="car-feature">${feature}</div>`).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="car-detail-specs">
                        <h3>Technické údaje</h3>
                        ${Object.entries(car.specs).map(([key, value]) => `
                            <div class="car-spec">
                                <div class="car-spec-label">${key}</div>
                                <div class="car-spec-value">${value}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="car-detail-actions">
                    <button class="car-detail-action-btn car-detail-buy-btn">Koupit</button>
                    <button class="car-detail-action-btn car-detail-test-btn">Objednat testovací jízdu</button>
                    <button class="car-detail-action-btn car-detail-contact-btn">Kontaktovat prodejce</button>
                </div>
            </div>
        `;
        
        // Přidání modalu do dokumentu
        document.body.appendChild(modal);
        
        // Přidání event listenerů
        const closeButton = modal.querySelector('.car-detail-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.remove();
            });
        }
        
        // Přidání event listenerů pro miniatury
        const thumbnails = modal.querySelectorAll('.car-thumbnail');
        const mainImage = modal.querySelector('#main-car-image');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech miniatur
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Přidání aktivní třídy na kliknutou miniaturu
                thumbnail.classList.add('active');
                
                // Změna hlavního obrázku
                const imageUrl = thumbnail.getAttribute('data-image');
                mainImage.src = imageUrl;
            });
        });
        
        // Přidání event listenerů pro tlačítka
        const buyButton = modal.querySelector('.car-detail-buy-btn');
        const testButton = modal.querySelector('.car-detail-test-btn');
        const contactButton = modal.querySelector('.car-detail-contact-btn');
        
        if (buyButton) {
            buyButton.addEventListener('click', () => {
                this.buyCar(car);
            });
        }
        
        if (testButton) {
            testButton.addEventListener('click', () => {
                this.orderTestDrive(car);
            });
        }
        
        if (contactButton) {
            contactButton.addEventListener('click', () => {
                this.contactSeller(car);
            });
        }
        
        // Přidání XP za zobrazení detailu auta
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(10, `Prohlížení detailu auta ${car.brand} ${car.model}`);
        }
    },
    
    // Koupení auta
    buyCar(car) {
        // Kontrola, zda má uživatel dostatek peněz
        const appState = JSON.parse(localStorage.getItem('appState')) || {};
        const money = appState.money !== undefined ? appState.money : 500;
        
        if (money < car.price) {
            if (typeof addMessage !== 'undefined') {
                addMessage(`Nemáte dostatek peněz na koupi auta ${car.brand} ${car.model}. Potřebujete ještě ${this.formatPrice(car.price - money)} Kč.`, false);
            }
            return;
        }
        
        // Odečtení peněz
        if (typeof MoneyIndicator !== 'undefined') {
            MoneyIndicator.removeMoney(car.price, `Koupě auta ${car.brand} ${car.model}`);
        } else {
            appState.money = money - car.price;
            localStorage.setItem('appState', JSON.stringify(appState));
        }
        
        // Zobrazení zprávy
        if (typeof addMessage !== 'undefined') {
            addMessage(`Gratulujeme k nákupu auta ${car.brand} ${car.model}! Auto bude připraveno k vyzvednutí za 2 dny.`, false);
        }
        
        // Přidání XP za koupi auta
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(100, `Koupě auta ${car.brand} ${car.model}`);
        }
        
        // Zavření modalu
        const modal = document.querySelector('.car-detail-modal');
        if (modal) {
            modal.remove();
        }
        
        // Zavření dialogu
        const dialog = document.querySelector('.car-sales-dialog');
        if (dialog) {
            dialog.remove();
        }
    },
    
    // Objednání testovací jízdy
    orderTestDrive(car) {
        if (typeof addMessage !== 'undefined') {
            addMessage(`Objednali jste testovací jízdu s vozem ${car.brand} ${car.model}. Prodejce vás bude kontaktovat pro domluvení termínu.`, false);
        }
        
        // Přidání XP za objednání testovací jízdy
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(20, `Objednání testovací jízdy s vozem ${car.brand} ${car.model}`);
        }
        
        // Zavření modalu
        const modal = document.querySelector('.car-detail-modal');
        if (modal) {
            modal.remove();
        }
    },
    
    // Kontaktování prodejce
    contactSeller(car) {
        if (typeof addMessage !== 'undefined') {
            addMessage(`Kontaktní údaje na prodejce vozu ${car.brand} ${car.model}:
            
Autobazar Hodonín
Brněnská 123, Hodonín
Tel: +420 123 456 789
Email: info@autobazar-hodonin.cz
Otevírací doba: Po-Pá 9:00-17:00, So 9:00-12:00`, false);
        }
        
        // Přidání XP za kontaktování prodejce
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(5, `Kontaktování prodejce vozu ${car.brand} ${car.model}`);
        }
    },
    
    // Pomocné funkce
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    
    formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    
    getFuelType(fuel) {
        switch (fuel) {
            case 'petrol': return 'Benzín';
            case 'diesel': return 'Diesel';
            case 'hybrid': return 'Hybrid';
            case 'electric': return 'Elektro';
            default: return fuel;
        }
    },
    
    getTransmissionType(transmission) {
        switch (transmission) {
            case 'manual': return 'Manuální';
            case 'automatic': return 'Automatická';
            default: return transmission;
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CarSales.init();
});
