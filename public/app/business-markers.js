/**
 * Modul pro zobrazení firem a podniků na mapě
 * Verze 0.3.0.4
 */

const BusinessMarkers = {
    // Stav modulu
    isInitialized: false,
    businessMarkers: [], // Pole pro ukládání markerů firem

    // Typy firem
    businessTypes: {
        shop: { icon: '🛒', name: 'Obchod', color: '#3498db' },
        restaurant: { icon: '🍽️', name: 'Restaurace', color: '#e74c3c' },
        bank: { icon: '🏦', name: 'Banka', color: '#2ecc71' },
        office: { icon: '🏢', name: 'Kancelář', color: '#9b59b6' },
        factory: { icon: '🏭', name: 'Továrna', color: '#f39c12' },
        gas: { icon: '⛽', name: 'Čerpací stanice', color: '#e67e22' },
        hotel: { icon: '🏨', name: 'Hotel', color: '#1abc9c' },
        hospital: { icon: '🏥', name: 'Nemocnice', color: '#c0392b' }
    },

    // Seznam firem
    businesses: [
        {
            id: 'bank1',
            name: 'Česká spořitelna',
            type: 'bank',
            lat: 48.8484,
            lng: 17.1259,
            address: 'Národní třída 3832/5, 695 01 Hodonín',
            description: 'Pobočka České spořitelny v centru Hodonína',
            openHours: 'Po-Pá: 9:00-17:00',
            services: ['Bankovní účty', 'Půjčky', 'Hypotéky', 'Investice'],
            rating: 4.2,
            website: 'https://www.csas.cz'
        },
        {
            id: 'shop1',
            name: 'Kaufland',
            type: 'shop',
            lat: 48.8553,
            lng: 17.1225,
            address: 'Dvořákova 4115/6, 695 01 Hodonín',
            description: 'Supermarket s širokou nabídkou potravin a spotřebního zboží',
            openHours: 'Po-Ne: 7:00-22:00',
            services: ['Potraviny', 'Drogerie', 'Pekárna', 'Řeznictví'],
            rating: 4.0,
            website: 'https://www.kaufland.cz'
        },
        {
            id: 'restaurant1',
            name: 'Restaurace U Radnice',
            type: 'restaurant',
            lat: 48.8489,
            lng: 17.1256,
            address: 'Masarykovo nám. 53/1, 695 01 Hodonín',
            description: 'Tradiční česká restaurace v centru města',
            openHours: 'Po-Ne: 11:00-23:00',
            services: ['Obědy', 'Večeře', 'Catering', 'Rozvoz jídla'],
            rating: 4.5,
            website: 'https://www.restauraceuradnice.cz'
        },
        {
            id: 'office1',
            name: 'IT Solutions',
            type: 'office',
            lat: 48.8514,
            lng: 17.1319,
            address: 'Štefánikova 28, 695 01 Hodonín',
            description: 'IT společnost specializující se na vývoj software',
            openHours: 'Po-Pá: 8:00-16:30',
            services: ['Vývoj software', 'IT konzultace', 'Webové stránky', 'Mobilní aplikace'],
            rating: 4.8,
            website: 'https://www.itsolutions.cz'
        },
        {
            id: 'factory1',
            name: 'MND',
            type: 'factory',
            lat: 48.8483,
            lng: 17.1356,
            address: 'Úprkova 807/6, 695 01 Hodonín',
            description: 'Moravské naftové doly - těžba a zpracování ropy a zemního plynu',
            openHours: 'Nepřetržitý provoz',
            services: ['Těžba ropy', 'Těžba zemního plynu', 'Energetika'],
            rating: 4.1,
            website: 'https://www.mnd.cz'
        },
        {
            id: 'gas1',
            name: 'MOL',
            type: 'gas',
            lat: 48.8512,
            lng: 17.1298,
            address: 'Brněnská 3854, 695 01 Hodonín',
            description: 'Čerpací stanice MOL s mycí linkou a občerstvením',
            openHours: 'Po-Ne: 0:00-24:00',
            services: ['Pohonné hmoty', 'Mycí linka', 'Občerstvení', 'Shop'],
            rating: 4.3,
            website: 'https://www.molcesko.cz'
        },
        {
            id: 'hotel1',
            name: 'Hotel Panon',
            type: 'hotel',
            lat: 48.8494,
            lng: 17.1269,
            address: 'Koupelní 4, 695 01 Hodonín',
            description: 'Komfortní hotel v centru města s restaurací a wellness',
            openHours: 'Po-Ne: 0:00-24:00',
            services: ['Ubytování', 'Restaurace', 'Wellness', 'Konferenční prostory'],
            rating: 4.6,
            website: 'https://www.hotelpanon.cz'
        },
        {
            id: 'hospital1',
            name: 'Nemocnice TGM Hodonín',
            type: 'hospital',
            lat: 48.8464,
            lng: 17.1279,
            address: 'Purkyňova 2731/11, 695 01 Hodonín',
            description: 'Nemocnice T. G. Masaryka poskytující komplexní zdravotní péči',
            openHours: 'Nepřetržitý provoz',
            services: ['Ambulantní péče', 'Lůžková péče', 'Pohotovost', 'Specializované ambulance'],
            rating: 4.0,
            website: 'https://www.nemho.cz'
        }
    ],

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;

        console.log('Inicializace modulu pro zobrazení firem na mapě...');

        // Odstranění filtru firem, pokud existuje
        this.removeBusinessFilter();

        // Přidání CSS stylů
        this.addStyles();

        // Přidání firem na mapu
        this.addBusinessesToMap();

        // Přidání event listenerů
        this.setupEventListeners();

        this.isInitialized = true;
        console.log('Modul pro zobrazení firem na mapě byl inicializován');
    },

    // Přidání CSS stylů
    addStyles() {
        const styleElement = document.createElement('style');
        styleElement.id = 'business-markers-styles';
        styleElement.textContent = `
            .business-marker {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: white;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                border: 3px solid var(--marker-color);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 500;
                position: relative;
                overflow: hidden;
                font-size: 20px;
            }

            .business-marker:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }

            .business-marker::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 10px;
                height: 10px;
                background: var(--marker-color);
                clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
            }

            .business-popup {
                padding: 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                max-width: 350px;
            }

            .business-popup .leaflet-popup-content-wrapper {
                padding: 0;
                border-radius: 12px;
                background: white;
            }

            .business-popup .leaflet-popup-content {
                margin: 0;
                width: 100% !important;
            }

            .business-popup .leaflet-popup-tip {
                background: white;
            }

            .business-popup-header {
                background: var(--marker-color);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .business-popup-icon {
                font-size: 24px;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .business-popup-title {
                flex-grow: 1;
            }

            .business-popup-title h3 {
                margin: 0 0 5px 0;
                font-size: 18px;
                font-weight: 600;
            }

            .business-popup-title p {
                margin: 0;
                font-size: 14px;
                opacity: 0.9;
            }

            .business-popup-content {
                padding: 15px;
            }

            .business-popup-info {
                margin-bottom: 15px;
            }

            .business-popup-info p {
                margin: 8px 0;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
            }

            .business-popup-info p i {
                color: var(--marker-color);
                width: 20px;
                text-align: center;
            }

            .business-popup-services {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 15px;
            }

            .business-service-tag {
                background: #f8f9fa;
                color: #495057;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }

            .business-popup-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }

            .business-popup-btn {
                flex: 1;
                padding: 8px 15px;
                border: none;
                border-radius: 8px;
                background: var(--marker-color);
                color: white;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                transition: all 0.2s;
            }

            .business-popup-btn:hover {
                filter: brightness(1.1);
            }

            .business-popup-btn.secondary {
                background: #f8f9fa;
                color: #495057;
            }

            .business-rating {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-top: 10px;
            }

            .business-rating-stars {
                color: #f39c12;
                font-size: 14px;
            }

            .business-rating-value {
                font-weight: 600;
                font-size: 14px;
            }

            /* Styly pro filtr firem byly odstraněny */
        `;

        document.head.appendChild(styleElement);
    },

    // Přidání firem na mapu
    addBusinessesToMap() {
        // Kontrola, zda existuje mapa a Leaflet
        if (typeof map === 'undefined') {
            console.error('Mapa není inicializována');
            // Zkusíme znovu za 2 sekundy
            setTimeout(() => this.addBusinessesToMap(), 2000);
            return;
        }

        // Kontrola, zda je Leaflet načten
        if (typeof L === 'undefined') {
            console.error('Leaflet není načten');
            // Zkusíme znovu za 2 sekundy
            setTimeout(() => this.addBusinessesToMap(), 2000);
            return;
        }

        // Vyčištění existujících markerů
        this.clearBusinessMarkers();

        // Přidání firem na mapu
        this.businesses.forEach(business => {
            this.addBusinessToMap(business);
        });

        // Filtr firem byl odstraněn
    },

    // Přidání jedné firmy na mapu
    addBusinessToMap(business) {
        // Kontrola, zda je Leaflet načten
        if (typeof L === 'undefined') {
            console.error('Leaflet není načten při přidávání firmy na mapu');
            // Zkusíme znovu za 2 sekundy
            setTimeout(() => this.addBusinessToMap(business), 2000);
            return;
        }

        // Získání typu firmy
        const businessType = this.businessTypes[business.type] || { icon: '🏢', name: 'Firma', color: '#7f8c8d' };

        // Vytvoření markeru
        const markerHtml = `
            <div class="business-marker" style="--marker-color: ${businessType.color}">
                ${businessType.icon}
            </div>
        `;

        // Vytvoření ikony pro marker
        const icon = L.divIcon({
            className: 'business-marker-container',
            html: markerHtml,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        // Vytvoření markeru
        const marker = L.marker([business.lat, business.lng], {
            icon: icon,
            title: business.name,
            alt: `${businessType.name}: ${business.name}`
        }).addTo(map);

        // Přidání popup okna
        marker.bindPopup(this.createBusinessPopup(business), {
            className: 'business-popup',
            closeButton: true,
            closeOnClick: false,
            autoClose: false,
            minWidth: 300,
            maxWidth: 350
        });

        // Přidání event listeneru pro otevření popup okna
        marker.on('click', () => {
            // Přidání XP za zobrazení informací o firmě
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(2, `Zobrazení informací o firmě ${business.name}`);
            }
        });

        // Přidání markeru do pole
        this.businessMarkers.push({
            id: business.id,
            marker: marker,
            business: business
        });
    },

    // Vytvoření obsahu popup okna pro firmu
    createBusinessPopup(business) {
        // Získání typu firmy
        const businessType = this.businessTypes[business.type] || { icon: '🏢', name: 'Firma', color: '#7f8c8d' };

        // Vytvoření hvězdiček pro hodnocení
        const rating = business.rating || 0;
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let starsHtml = '';
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            starsHtml += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star"></i>';
        }

        // Vytvoření tagů pro služby
        let servicesHtml = '';
        if (business.services && business.services.length > 0) {
            business.services.forEach(service => {
                servicesHtml += `<div class="business-service-tag">${service}</div>`;
            });
        }

        // Vytvoření obsahu popup okna
        return `
            <div class="business-popup-container" style="--marker-color: ${businessType.color}">
                <div class="business-popup-header">
                    <div class="business-popup-icon">${businessType.icon}</div>
                    <div class="business-popup-title">
                        <h3>${business.name}</h3>
                        <p>${businessType.name}</p>
                    </div>
                </div>
                <div class="business-popup-content">
                    <div class="business-popup-info">
                        <p><i class="fas fa-map-marker-alt"></i> ${business.address}</p>
                        <p><i class="fas fa-clock"></i> ${business.openHours}</p>
                        <div class="business-rating">
                            <div class="business-rating-stars">${starsHtml}</div>
                            <div class="business-rating-value">${rating.toFixed(1)}</div>
                        </div>
                    </div>
                    <p>${business.description}</p>
                    <div class="business-popup-services">
                        ${servicesHtml}
                    </div>
                    <div class="business-popup-actions">
                        <button class="business-popup-btn" onclick="BusinessMarkers.showBusinessDetails('${business.id}')">
                            <i class="fas fa-info-circle"></i> Detaily
                        </button>
                        <button class="business-popup-btn secondary" onclick="BusinessMarkers.showBusinessOnMap('${business.id}')">
                            <i class="fas fa-map"></i> Navigovat
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Odstranění filtru firem, pokud existuje
    removeBusinessFilter() {
        const filterElement = document.getElementById('business-filter');
        if (filterElement) {
            filterElement.remove();
        }
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro přidání XP při interakci s firmami
        document.addEventListener('click', (e) => {
            if (e.target.matches('.business-popup-btn') || e.target.closest('.business-popup-btn')) {
                // Přidání XP za interakci s firmou
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(5, 'Interakce s firmou');
                }
            }
        });
    },

    // Zobrazení detailů firmy
    showBusinessDetails(businessId) {
        // Nalezení firmy podle ID
        const businessItem = this.businessMarkers.find(item => item.business.id === businessId);

        if (!businessItem) {
            console.error(`Firma s ID ${businessId} nebyla nalezena`);
            return;
        }

        const business = businessItem.business;
        const businessType = this.businessTypes[business.type] || { icon: '🏢', name: 'Firma', color: '#7f8c8d' };

        // Vytvoření zprávy pro chat
        let message = `${businessType.icon} ${business.name}\n`;
        message += `Typ: ${businessType.name}\n`;
        message += `Adresa: ${business.address}\n`;
        message += `Otevírací doba: ${business.openHours}\n`;
        message += `Hodnocení: ${business.rating.toFixed(1)}/5.0\n\n`;
        message += `${business.description}\n\n`;

        if (business.services && business.services.length > 0) {
            message += `Služby: ${business.services.join(', ')}\n\n`;
        }

        if (business.website) {
            message += `Web: ${business.website}`;
        }

        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(message, false);
        }

        // Přidání XP za zobrazení detailů firmy
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(10, `Zobrazení detailů firmy ${business.name}`);
        }
    },

    // Zobrazení firmy na mapě (navigace)
    showBusinessOnMap(businessId) {
        // Nalezení firmy podle ID
        const businessItem = this.businessMarkers.find(item => item.business.id === businessId);

        if (!businessItem) {
            console.error(`Firma s ID ${businessId} nebyla nalezena`);
            return;
        }

        const business = businessItem.business;

        // Přiblížení mapy na firmu
        map.setView([business.lat, business.lng], 16, {
            animate: true,
            duration: 1
        });

        // Otevření popup okna
        businessItem.marker.openPopup();

        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(`Navigace k: ${business.name}\nAdresa: ${business.address}`, false);
        }

        // Přidání XP za navigaci k firmě
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(5, `Navigace k firmě ${business.name}`);
        }
    },

    // Vyčištění markerů firem
    clearBusinessMarkers() {
        // Odstranění markerů z mapy
        this.businessMarkers.forEach(item => {
            map.removeLayer(item.marker);
        });

        // Vyčištění pole markerů
        this.businessMarkers = [];
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda existuje mapa
    if (typeof map !== 'undefined') {
        // Inicializace modulu
        BusinessMarkers.init();
    } else {
        // Čekání na inicializaci mapy
        const mapInitInterval = setInterval(() => {
            if (typeof map !== 'undefined') {
                clearInterval(mapInitInterval);
                BusinessMarkers.init();
            }
        }, 500);
    }
});
