/**
 * Modul pro služby bydlení
 * Verze 0.3.6.5
 */

const HousingServices = {
    // Stav modulu
    isInitialized: false,
    activeService: null,

    // Dostupné služby
    services: {
        rent: {
            name: 'Pronájem',
            icon: '🏠',
            description: 'Nabídky pronájmů bytů a domů',
            properties: [
                {
                    id: 'rent1',
                    name: 'Byt 2+1, 55m²',
                    address: 'Masarykovo náměstí 15, Hodonín',
                    price: '12 000 Kč/měsíc',
                    description: 'Moderní byt v centru města, po rekonstrukci, částečně zařízený.',
                    image: 'https://via.placeholder.com/300x200?text=Byt+2+1',
                    features: ['Balkon', 'Sklep', 'Výtah', 'Internet'],
                    available: 'Ihned'
                },
                {
                    id: 'rent2',
                    name: 'Byt 3+kk, 70m²',
                    address: 'Národní třída 8, Hodonín',
                    price: '15 000 Kč/měsíc',
                    description: 'Prostorný byt s výhledem na park, kompletně zařízený.',
                    image: 'https://via.placeholder.com/300x200?text=Byt+3+kk',
                    features: ['Terasa', 'Parkovací místo', 'Výtah', 'Internet', 'Klimatizace'],
                    available: 'Od 1.7.2025'
                },
                {
                    id: 'rent3',
                    name: 'Rodinný dům 4+1, 120m²',
                    address: 'Lipová 23, Hodonín',
                    price: '18 000 Kč/měsíc',
                    description: 'Samostatný rodinný dům se zahradou v klidné části města.',
                    image: 'https://via.placeholder.com/300x200?text=Dum+4+1',
                    features: ['Zahrada', 'Garáž', 'Terasa', 'Sklep', 'Internet'],
                    available: 'Od 15.7.2025'
                },
                {
                    id: 'rent4',
                    name: 'Byt 1+kk, 35m²',
                    address: 'Havlíčkova 5, Hodonín',
                    price: '8 000 Kč/měsíc',
                    description: 'Menší byt vhodný pro jednotlivce, po kompletní rekonstrukci.',
                    image: 'https://via.placeholder.com/300x200?text=Byt+1+kk',
                    features: ['Výtah', 'Internet', 'Pračka', 'Lednice'],
                    available: 'Ihned'
                },
                {
                    id: 'rent5',
                    name: 'Byt 4+1, 90m²',
                    address: 'Brněnská 42, Hodonín',
                    price: '17 000 Kč/měsíc',
                    description: 'Velký rodinný byt s balkonem v klidné lokalitě.',
                    image: 'https://via.placeholder.com/300x200?text=Byt+4+1',
                    features: ['Balkon', 'Sklep', 'Výtah', 'Internet', 'Parkovací místo'],
                    available: 'Od 1.8.2025'
                }
            ]
        },
        sale: {
            name: 'Prodej',
            icon: '🏘️',
            description: 'Nabídky prodeje bytů a domů',
            properties: [
                {
                    id: 'sale1',
                    name: 'Byt 3+1, 75m²',
                    address: 'Komenského 18, Hodonín',
                    price: '3 200 000 Kč',
                    description: 'Prostorný byt v cihlovém domě, po částečné rekonstrukci.',
                    image: 'https://via.placeholder.com/300x200?text=Byt+3+1+Prodej',
                    features: ['Balkon', 'Sklep', 'Výtah', 'Cihlový dům'],
                    available: 'Ihned'
                },
                {
                    id: 'sale2',
                    name: 'Rodinný dům 5+1, 150m²',
                    address: 'Slunečná 7, Hodonín',
                    price: '5 500 000 Kč',
                    description: 'Samostatný rodinný dům s velkou zahradou a bazénem.',
                    image: 'https://via.placeholder.com/300x200?text=Dum+5+1+Prodej',
                    features: ['Zahrada 800m²', 'Garáž', 'Bazén', 'Terasa', 'Sklep'],
                    available: 'Ihned'
                },
                {
                    id: 'sale3',
                    name: 'Byt 2+kk, 50m²',
                    address: 'Národní třída 12, Hodonín',
                    price: '2 400 000 Kč',
                    description: 'Moderní byt v novostavbě s výhledem na město.',
                    image: 'https://via.placeholder.com/300x200?text=Byt+2+kk+Prodej',
                    features: ['Balkon', 'Parkovací místo', 'Výtah', 'Novostavba'],
                    available: 'Od 1.9.2025'
                },
                {
                    id: 'sale4',
                    name: 'Stavební pozemek, 800m²',
                    address: 'Okružní, Hodonín',
                    price: '1 800 000 Kč',
                    description: 'Stavební pozemek v klidné lokalitě, všechny sítě na hranici pozemku.',
                    image: 'https://via.placeholder.com/300x200?text=Pozemek',
                    features: ['Elektřina', 'Voda', 'Kanalizace', 'Plyn', 'Příjezdová cesta'],
                    available: 'Ihned'
                },
                {
                    id: 'sale5',
                    name: 'Chata 2+kk, 40m²',
                    address: 'Rekreační oblast Písečné, Hodonín',
                    price: '950 000 Kč',
                    description: 'Udržovaná chata s pozemkem v rekreační oblasti u lesa.',
                    image: 'https://via.placeholder.com/300x200?text=Chata',
                    features: ['Pozemek 350m²', 'Elektřina', 'Voda', 'Krb', 'Terasa'],
                    available: 'Ihned'
                }
            ]
        },
        roommates: {
            name: 'Spolubydlení',
            icon: '👥',
            description: 'Nabídky a poptávky spolubydlení',
            properties: [
                {
                    id: 'roommate1',
                    name: 'Pokoj v bytě 3+1',
                    address: 'Masarykovo náměstí 8, Hodonín',
                    price: '5 000 Kč/měsíc',
                    description: 'Nabízím pokoj v bytě, který sdílím s jednou osobou. Hledám nekuřáka/nekuřačku.',
                    image: 'https://via.placeholder.com/300x200?text=Pokoj+v+byte',
                    features: ['Internet', 'Pračka', 'Plně vybavená kuchyň', 'Nekuřácký byt'],
                    available: 'Ihned',
                    contact: 'Jan, 28 let, tel: 777 123 456'
                },
                {
                    id: 'roommate2',
                    name: 'Pokoj v rodinném domě',
                    address: 'Lipová 15, Hodonín',
                    price: '6 000 Kč/měsíc',
                    description: 'Nabízím pokoj v rodinném domě se zahradou. Preferuji studenta/studentku.',
                    image: 'https://via.placeholder.com/300x200?text=Pokoj+v+dome',
                    features: ['Zahrada', 'Internet', 'Pračka', 'Parkování', 'Vlastní koupelna'],
                    available: 'Od 1.7.2025',
                    contact: 'Rodina Novákových, tel: 777 987 654'
                },
                {
                    id: 'roommate3',
                    name: 'Hledám spolubydlícího',
                    address: 'Brněnská 30, Hodonín',
                    price: '4 500 Kč/měsíc',
                    description: 'Hledám spolubydlícího do bytu 2+1, společné náklady na energie.',
                    image: 'https://via.placeholder.com/300x200?text=Hledam+spolubydliciho',
                    features: ['Internet', 'Pračka', 'Balkon', 'Nekuřácký byt'],
                    available: 'Ihned',
                    contact: 'Petr, 25 let, tel: 777 456 789'
                }
            ]
        }
    },

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;

        console.log('Inicializace modulu služeb bydlení...');

        // Vytvoření HTML struktury pro služby
        this.createServiceContainers();

        // Přidání event listenerů
        this.setupEventListeners();

        // Přidání do menu příkazů
        this.addToCommandsMenu();

        this.isInitialized = true;
        console.log('Modul služeb bydlení byl inicializován');
    },

    // Přidání do menu příkazů
    addToCommandsMenu() {
        // Kontrola, zda existuje objekt CommandsMenu
        if (typeof CommandsMenu !== 'undefined') {
            // Najdeme kategorii "Služby"
            const servicesCategory = CommandsMenu.categories.find(cat => cat.id === 'services');

            if (servicesCategory) {
                // Přidání příkazu pro služby bydlení
                servicesCategory.commands.push({
                    id: 'housing',
                    name: 'Bydlení',
                    description: 'Nabídky pronájmů, prodejů a spolubydlení',
                    icon: '🏠',
                    command: 'bydlení'
                });

                // Obnovení menu příkazů
                if (typeof CommandsMenu.refreshMenu === 'function') {
                    CommandsMenu.refreshMenu();
                }

                console.log('Příkaz pro služby bydlení byl přidán do menu příkazů');
            }
        }
    },

    // Vytvoření HTML struktury pro služby
    createServiceContainers() {
        // Vytvoření kontejnerů pro všechny služby
        Object.keys(this.services).forEach(serviceId => {
            this.createServiceContainer(serviceId);
        });
    },

    // Vytvoření HTML struktury pro jednu službu
    createServiceContainer(serviceId) {
        const service = this.services[serviceId];

        // Kontrola, zda služba existuje
        if (!service) return;

        // Kontrola, zda kontejner již existuje
        if (document.getElementById(`${serviceId}-service-container`)) return;

        // Vytvoření kontejneru
        const container = document.createElement('div');
        container.id = `${serviceId}-service-container`;
        container.className = 'housing-service-container';
        container.style.display = 'none';

        // Vytvoření obsahu
        container.innerHTML = `
            <div class="housing-service-header">
                <div class="housing-service-title">
                    <span class="housing-service-icon">${service.icon}</span>
                    <h2>${service.name}</h2>
                </div>
                <button class="housing-service-close">&times;</button>
            </div>
            <div class="housing-service-content">
                <div class="housing-search-bar">
                    <input type="text" class="housing-search-input" placeholder="Vyhledat...">
                </div>
                <div class="housing-properties-list">
                    ${service.properties.map(property => `
                        <div class="housing-property-item" data-id="${property.id}">
                            <div class="property-image">
                                <img src="${property.image}" alt="${property.name}">
                            </div>
                            <div class="property-info">
                                <h3 class="property-name">${property.name}</h3>
                                <p class="property-address">${property.address}</p>
                                <p class="property-price">${property.price}</p>
                                <p class="property-description">${property.description}</p>
                                <div class="property-features">
                                    ${property.features.map(feature => `<span class="property-feature">${feature}</span>`).join('')}
                                </div>
                                <p class="property-available">Dostupné: ${property.available}</p>
                                ${property.contact ? `<p class="property-contact">Kontakt: ${property.contact}</p>` : ''}
                                <div class="property-actions">
                                    <button class="property-contact-btn" data-id="${property.id}">Kontaktovat</button>
                                    <button class="property-favorite-btn" data-id="${property.id}">Přidat do oblíbených</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Přidání kontejneru do stránky
        document.body.appendChild(container);
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro zavření služby
        document.addEventListener('click', (e) => {
            if (e.target.matches('.housing-service-close')) {
                this.hideService();
            }
        });

        // Event listener pro vyhledávání
        document.addEventListener('input', (e) => {
            if (e.target.matches('.housing-search-input')) {
                const searchText = e.target.value;
                this.filterProperties(searchText);
            }
        });

        // Event listener pro kontaktování
        document.addEventListener('click', (e) => {
            if (e.target.matches('.property-contact-btn')) {
                const propertyId = e.target.dataset.id;
                this.contactProperty(propertyId);
            }
        });

        // Event listener pro přidání do oblíbených
        document.addEventListener('click', (e) => {
            if (e.target.matches('.property-favorite-btn')) {
                const propertyId = e.target.dataset.id;
                this.addToFavorites(propertyId);
            }
        });
    },

    // Zobrazení služby
    showService(serviceId) {
        if (!this.services[serviceId]) {
            console.error(`Služba ${serviceId} neexistuje`);
            return;
        }

        // Skrytí všech služeb
        document.querySelectorAll('.housing-service-container').forEach(container => {
            container.style.display = 'none';
        });

        // Zobrazení požadované služby
        const container = document.getElementById(`${serviceId}-service-container`);
        if (container) {
            container.style.display = 'flex';
            this.activeService = serviceId;

            // Přidání XP za použití služby
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(5, 'Použití služby ' + this.services[serviceId].name);
            }

            // Přidání zprávy do chatu
            if (typeof addMessage !== 'undefined') {
                addMessage(`Zobrazuji nabídky: ${this.services[serviceId].name}`, false);
            }

            // Zaměření vyhledávacího pole
            const searchInput = container.querySelector('.housing-search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    },

    // Skrytí služby
    hideService() {
        document.querySelectorAll('.housing-service-container').forEach(container => {
            container.style.display = 'none';
        });

        this.activeService = null;
    },

    // Filtrování nemovitostí
    filterProperties(searchText) {
        if (!this.activeService) return;

        searchText = searchText.toLowerCase();

        // Nalezení kontejneru
        const container = document.getElementById(`${this.activeService}-service-container`);
        const properties = container.querySelectorAll('.housing-property-item');

        properties.forEach(property => {
            const name = property.querySelector('.property-name').textContent.toLowerCase();
            const address = property.querySelector('.property-address').textContent.toLowerCase();
            const description = property.querySelector('.property-description').textContent.toLowerCase();

            if (name.includes(searchText) || address.includes(searchText) || description.includes(searchText)) {
                property.style.display = 'flex';
            } else {
                property.style.display = 'none';
            }
        });
    },

    // Kontaktování ohledně nemovitosti
    contactProperty(propertyId) {
        if (!this.activeService) return;

        const service = this.services[this.activeService];
        const property = service.properties.find(p => p.id === propertyId);

        if (!property) return;

        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(`Mám zájem o nemovitost: ${property.name}, ${property.address}`, true);

            // Simulace odpovědi
            setTimeout(() => {
                addMessage(`Děkujeme za váš zájem o nemovitost ${property.name}. Kontaktní údaje byly odeslány na váš e-mail. Realitní makléř vás bude kontaktovat do 24 hodin.`, false);
            }, 1500);
        }

        // Přidání XP za kontaktování
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(10, 'Kontaktování ohledně nemovitosti');
        }
    },

    // Přidání do oblíbených
    addToFavorites(propertyId) {
        if (!this.activeService) return;

        const service = this.services[this.activeService];
        const property = service.properties.find(p => p.id === propertyId);

        if (!property) return;

        // Uložení do localStorage
        const favorites = JSON.parse(localStorage.getItem('housingFavorites') || '[]');

        // Kontrola, zda již nemovitost není v oblíbených
        const existingIndex = favorites.findIndex(fav => fav.id === propertyId);

        if (existingIndex !== -1) {
            // Nemovitost již je v oblíbených
            if (typeof addMessage !== 'undefined') {
                addMessage(`Nemovitost ${property.name} již je v oblíbených.`, false);
            }
            return;
        }

        // Přidání do oblíbených
        favorites.push({
            id: propertyId,
            serviceId: this.activeService,
            name: property.name,
            address: property.address,
            price: property.price,
            date: new Date().toISOString()
        });

        // Uložení do localStorage
        localStorage.setItem('housingFavorites', JSON.stringify(favorites));

        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(`Nemovitost ${property.name} byla přidána do oblíbených.`, false);
        }

        // Přidání XP za přidání do oblíbených
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(5, 'Přidání nemovitosti do oblíbených');
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda již existuje objekt CommandsMenu
    if (typeof CommandsMenu !== 'undefined') {
        HousingServices.init();
    } else {
        // Pokud ještě neexistuje, počkáme na jeho vytvoření
        document.addEventListener('commandsMenuInitialized', () => {
            HousingServices.init();
        });
    }
});

// Přidání zpracování příkazů do existující funkce processCommand
const originalProcessCommand = window.processCommand || function() { return false; };

window.processCommand = function(command) {
    // Kontrola, zda příkaz patří tomuto modulu
    if (command.toLowerCase() === 'bydlení') {
        // Inicializace modulu, pokud ještě nebyl inicializován
        if (!HousingServices.isInitialized) {
            HousingServices.init();
        }

        // Zobrazení hlavní služby (pronájem)
        HousingServices.showService('rent');
        return true;
    }

    // Kontrola dalších příkazů
    if (command.toLowerCase() === 'pronájem') {
        if (!HousingServices.isInitialized) {
            HousingServices.init();
        }
        HousingServices.showService('rent');
        return true;
    }

    if (command.toLowerCase() === 'prodej nemovitostí' || command.toLowerCase() === 'prodej') {
        if (!HousingServices.isInitialized) {
            HousingServices.init();
        }
        HousingServices.showService('sale');
        return true;
    }

    if (command.toLowerCase() === 'spolubydlení') {
        if (!HousingServices.isInitialized) {
            HousingServices.init();
        }
        HousingServices.showService('roommates');
        return true;
    }

    // Pokud příkaz nepatří tomuto modulu, předáme ho původní funkci
    return originalProcessCommand(command);
};
