/**
 * Modul pro vyhledávání spojení veřejnou dopravou
 * Verze 0.2.8.6.8
 */

const TransportConnections = {
    // Konfigurace
    config: {
        updateInterval: 5 * 60 * 1000, // 5 minut v milisekundách
        locations: {
            'Hodonín': {
                lat: 48.8492,
                lng: 17.1247,
                stations: [
                    { name: 'Hodonín, žel. st.', type: 'train', id: 'U5824Z1' },
                    { name: 'Hodonín, aut. nádr.', type: 'bus', id: 'U5824Z2' }
                ]
            },
            'Hrušky': {
                lat: 48.7833,
                lng: 16.9833,
                stations: [
                    { name: 'Hrušky, žel. st.', type: 'train', id: 'U5825Z1' },
                    { name: 'Hrušky, obecní úřad', type: 'bus', id: 'U5825Z2' }
                ]
            }
        }
    },

    // Aktuální spojení
    connections: {
        train: [],
        bus: []
    },

    // Časovač pro aktualizaci
    updateTimer: null,

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro vyhledávání spojení...');
        
        // Přidání CSS stylů
        this.addStyles();
        
        // Nastavení event listenerů
        this.setupEventListeners();
        
        console.log('Modul pro vyhledávání spojení byl inicializován');
    },
    
    // Přidání CSS stylů
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .transport-connections-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .transport-connections-modal.show {
                opacity: 1;
            }
            
            .transport-connections-modal-content {
                background-color: var(--card-bg);
                border-radius: 10px;
                width: 80%;
                max-width: 800px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .transport-connections-modal.show .transport-connections-modal-content {
                transform: scale(1);
            }
            
            .transport-connections-modal-header {
                background-color: var(--primary-color);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .transport-connections-modal-header h2 {
                margin: 0;
                color: white;
                font-size: 1.5rem;
            }
            
            .transport-connections-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .transport-connections-modal-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }
            
            .transport-connections-tabs {
                display: flex;
                border-bottom: 1px solid #ccc;
                margin-bottom: 20px;
            }
            
            .transport-connections-tab {
                padding: 10px 20px;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
            }
            
            .transport-connections-tab.active {
                border-bottom-color: var(--primary-color);
                font-weight: bold;
            }
            
            .transport-connections-tab-content {
                display: none;
            }
            
            .transport-connections-tab-content.active {
                display: block;
            }
            
            .transport-connection-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .transport-connection-item {
                background-color: var(--card-bg-light);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            .transport-connection-item:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .transport-connection-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }
            
            .transport-connection-time {
                font-weight: bold;
                font-size: 1.2rem;
            }
            
            .transport-connection-duration {
                color: var(--text-color-secondary);
            }
            
            .transport-connection-details {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .transport-connection-route {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .transport-connection-station {
                flex: 1;
            }
            
            .transport-connection-line {
                background-color: var(--primary-color);
                height: 2px;
                flex: 2;
                position: relative;
            }
            
            .transport-connection-line::before,
            .transport-connection-line::after {
                content: '';
                position: absolute;
                width: 8px;
                height: 8px;
                background-color: var(--primary-color);
                border-radius: 50%;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .transport-connection-line::before {
                left: 0;
            }
            
            .transport-connection-line::after {
                right: 0;
            }
            
            .transport-connection-info {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
                color: var(--text-color-secondary);
            }
            
            .transport-connection-price {
                font-weight: bold;
            }
            
            .transport-connection-status {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .transport-connection-status.on-time {
                color: #4CAF50;
            }
            
            .transport-connection-status.delayed {
                color: #FFC107;
            }
            
            .transport-connection-status.cancelled {
                color: #F44336;
            }
            
            .transport-connection-refresh {
                display: flex;
                justify-content: center;
                margin-top: 20px;
            }
            
            .transport-connection-refresh-btn {
                padding: 8px 15px;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: background-color 0.2s ease;
            }
            
            .transport-connection-refresh-btn:hover {
                background-color: var(--primary-color-dark);
            }
            
            .transport-connection-last-update {
                text-align: center;
                font-size: 0.8rem;
                color: var(--text-color-secondary);
                margin-top: 10px;
            }
            
            .transport-connection-empty {
                text-align: center;
                padding: 20px;
                color: var(--text-color-secondary);
            }
            
            .transport-connection-button {
                position: absolute;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                z-index: 100;
            }
            
            .transport-connection-button:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);
    },
    
    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro výpočet trasy
        document.addEventListener('routeCalculated', (e) => {
            // Kontrola, zda trasa vede mezi Hodonínem a Hruškami
            if (this.isHodoninHruskyRoute(e.detail.points)) {
                this.showConnectionButton();
                this.fetchConnections();
            } else {
                this.hideConnectionButton();
            }
        });
    },
    
    // Kontrola, zda trasa vede mezi Hodonínem a Hruškami
    isHodoninHruskyRoute(points) {
        if (!points || points.length < 2) return false;
        
        const locations = this.config.locations;
        const hodonin = locations['Hodonín'];
        const hrusky = locations['Hrušky'];
        
        // Kontrola, zda první bod je blízko Hodonína a poslední bod je blízko Hrušek (nebo naopak)
        const firstPoint = points[0];
        const lastPoint = points[points.length - 1];
        
        const isFirstHodonin = this.isPointNearLocation(firstPoint, hodonin);
        const isFirstHrusky = this.isPointNearLocation(firstPoint, hrusky);
        const isLastHodonin = this.isPointNearLocation(lastPoint, hodonin);
        const isLastHrusky = this.isPointNearLocation(lastPoint, hrusky);
        
        return (isFirstHodonin && isLastHrusky) || (isFirstHrusky && isLastHodonin);
    },
    
    // Kontrola, zda bod je blízko lokace
    isPointNearLocation(point, location) {
        const distance = this.calculateDistance(
            point.lat, point.lng,
            location.lat, location.lng
        );
        
        // Pokud je bod do 5 km od lokace, považujeme ho za blízký
        return distance <= 5;
    },
    
    // Výpočet vzdálenosti mezi dvěma body (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Poloměr Země v km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Vzdálenost v km
        return distance;
    },
    
    // Převod stupňů na radiány
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    },
    
    // Zobrazení tlačítka pro spojení
    showConnectionButton() {
        // Kontrola, zda již tlačítko existuje
        if (document.getElementById('transportConnectionButton')) {
            return;
        }
        
        // Vytvoření tlačítka
        const button = document.createElement('button');
        button.id = 'transportConnectionButton';
        button.className = 'transport-connection-button';
        button.innerHTML = '🚆';
        button.title = 'Zobrazit spojení veřejnou dopravou';
        
        // Přidání event listeneru
        button.addEventListener('click', () => {
            this.showConnectionsModal();
        });
        
        // Přidání tlačítka do dokumentu
        document.body.appendChild(button);
    },
    
    // Skrytí tlačítka pro spojení
    hideConnectionButton() {
        const button = document.getElementById('transportConnectionButton');
        if (button) {
            button.remove();
        }
    },
    
    // Získání spojení
    fetchConnections() {
        console.log('Získávání spojení...');
        
        // Zrušení předchozího časovače
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
        
        // Simulace získání dat z API (v reálné aplikaci by zde byl API call)
        this.simulateFetchConnections();
        
        // Nastavení časovače pro automatickou aktualizaci
        this.updateTimer = setTimeout(() => {
            this.fetchConnections();
        }, this.config.updateInterval);
    },
    
    // Simulace získání dat z API
    simulateFetchConnections() {
        // Aktuální čas
        const now = new Date();
        
        // Simulace vlakových spojení
        this.connections.train = [
            {
                departure: new Date(now.getTime() + 15 * 60000), // za 15 minut
                arrival: new Date(now.getTime() + 35 * 60000), // za 35 minut
                duration: '20 min',
                from: 'Hodonín, žel. st.',
                to: 'Hrušky, žel. st.',
                line: 'R8',
                price: '32 Kč',
                status: 'on-time',
                platform: '1',
                carrier: 'České dráhy'
            },
            {
                departure: new Date(now.getTime() + 75 * 60000), // za 1h 15min
                arrival: new Date(now.getTime() + 95 * 60000), // za 1h 35min
                duration: '20 min',
                from: 'Hodonín, žel. st.',
                to: 'Hrušky, žel. st.',
                line: 'Os 4408',
                price: '32 Kč',
                status: 'on-time',
                platform: '3',
                carrier: 'České dráhy'
            },
            {
                departure: new Date(now.getTime() + 135 * 60000), // za 2h 15min
                arrival: new Date(now.getTime() + 160 * 60000), // za 2h 40min
                duration: '25 min',
                from: 'Hodonín, žel. st.',
                to: 'Hrušky, žel. st.',
                line: 'Os 4410',
                price: '32 Kč',
                status: 'delayed',
                delay: '5 min',
                platform: '1',
                carrier: 'České dráhy'
            }
        ];
        
        // Simulace autobusových spojení
        this.connections.bus = [
            {
                departure: new Date(now.getTime() + 25 * 60000), // za 25 minut
                arrival: new Date(now.getTime() + 55 * 60000), // za 55 minut
                duration: '30 min',
                from: 'Hodonín, aut. nádr.',
                to: 'Hrušky, obecní úřad',
                line: '585',
                price: '28 Kč',
                status: 'on-time',
                platform: '5',
                carrier: 'ČSAD Hodonín'
            },
            {
                departure: new Date(now.getTime() + 85 * 60000), // za 1h 25min
                arrival: new Date(now.getTime() + 115 * 60000), // za 1h 55min
                duration: '30 min',
                from: 'Hodonín, aut. nádr.',
                to: 'Hrušky, obecní úřad',
                line: '585',
                price: '28 Kč',
                status: 'on-time',
                platform: '5',
                carrier: 'ČSAD Hodonín'
            },
            {
                departure: new Date(now.getTime() + 145 * 60000), // za 2h 25min
                arrival: new Date(now.getTime() + 175 * 60000), // za 2h 55min
                duration: '30 min',
                from: 'Hodonín, aut. nádr.',
                to: 'Hrušky, obecní úřad',
                line: '585',
                price: '28 Kč',
                status: 'cancelled',
                platform: '5',
                carrier: 'ČSAD Hodonín'
            }
        ];
        
        console.log('Spojení byla aktualizována');
        
        // Aktualizace modálního okna, pokud je otevřené
        this.updateConnectionsModal();
        
        // Přidání XP za vyhledání spojení, pokud je dostupný modul UserProgress
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(5, 'Vyhledání spojení veřejnou dopravou');
        }
        
        // Přidání XP za vyhledání spojení, pokud je dostupné rozšíření
        if (typeof UserProgressExtensions !== 'undefined') {
            UserProgressExtensions.trackTransportSearch();
        }
    },
    
    // Zobrazení modálního okna se spojeními
    showConnectionsModal() {
        // Kontrola, zda již modální okno existuje
        if (document.getElementById('transportConnectionsModal')) {
            return;
        }
        
        // Vytvoření modálního okna
        const modal = document.createElement('div');
        modal.id = 'transportConnectionsModal';
        modal.className = 'transport-connections-modal';
        
        // Vytvoření obsahu modálního okna
        modal.innerHTML = `
            <div class="transport-connections-modal-content">
                <div class="transport-connections-modal-header">
                    <h2>Spojení Hodonín - Hrušky</h2>
                    <button class="transport-connections-modal-close">&times;</button>
                </div>
                <div class="transport-connections-modal-body">
                    <div class="transport-connections-tabs">
                        <div class="transport-connections-tab active" data-tab="train">Vlaky</div>
                        <div class="transport-connections-tab" data-tab="bus">Autobusy</div>
                    </div>
                    <div class="transport-connections-tab-content active" id="trainConnections">
                        ${this.renderConnectionsList('train')}
                    </div>
                    <div class="transport-connections-tab-content" id="busConnections">
                        ${this.renderConnectionsList('bus')}
                    </div>
                    <div class="transport-connection-refresh">
                        <button class="transport-connection-refresh-btn">
                            <span>Aktualizovat</span>
                            <span>🔄</span>
                        </button>
                    </div>
                    <div class="transport-connection-last-update">
                        Poslední aktualizace: ${new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        `;
        
        // Přidání modálního okna do dokumentu
        document.body.appendChild(modal);
        
        // Zobrazení modálního okna s animací
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Přidání event listenerů
        const closeButton = modal.querySelector('.transport-connections-modal-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Event listener pro přepínání záložek
        const tabs = modal.querySelectorAll('.transport-connections-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech záložek
                tabs.forEach(t => t.classList.remove('active'));
                
                // Přidání aktivní třídy na kliknutou záložku
                tab.classList.add('active');
                
                // Skrytí všech obsahů záložek
                const tabContents = modal.querySelectorAll('.transport-connections-tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Zobrazení obsahu odpovídající záložky
                const tabName = tab.getAttribute('data-tab');
                const tabContent = modal.querySelector(`#${tabName}Connections`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
        
        // Event listener pro tlačítko aktualizace
        const refreshButton = modal.querySelector('.transport-connection-refresh-btn');
        refreshButton.addEventListener('click', () => {
            this.fetchConnections();
        });
        
        // Zavření modálního okna při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    },
    
    // Aktualizace modálního okna se spojeními
    updateConnectionsModal() {
        const modal = document.getElementById('transportConnectionsModal');
        if (!modal) return;
        
        // Aktualizace obsahu záložek
        const trainContent = modal.querySelector('#trainConnections');
        const busContent = modal.querySelector('#busConnections');
        
        if (trainContent) {
            trainContent.innerHTML = this.renderConnectionsList('train');
        }
        
        if (busContent) {
            busContent.innerHTML = this.renderConnectionsList('bus');
        }
        
        // Aktualizace času poslední aktualizace
        const lastUpdateElement = modal.querySelector('.transport-connection-last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Poslední aktualizace: ${new Date().toLocaleTimeString()}`;
        }
    },
    
    // Vykreslení seznamu spojení
    renderConnectionsList(type) {
        const connections = this.connections[type];
        
        if (!connections || connections.length === 0) {
            return `<div class="transport-connection-empty">Žádná spojení nebyla nalezena.</div>`;
        }
        
        return `
            <div class="transport-connection-list">
                ${connections.map(connection => this.renderConnectionItem(connection, type)).join('')}
            </div>
        `;
    },
    
    // Vykreslení položky spojení
    renderConnectionItem(connection, type) {
        // Formátování času
        const departureTime = connection.departure.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const arrivalTime = connection.arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Ikona podle typu dopravy
        const icon = type === 'train' ? '🚆' : '🚌';
        
        // Třída podle stavu spojení
        const statusClass = connection.status;
        
        // Text stavu spojení
        let statusText = '';
        switch (connection.status) {
            case 'on-time':
                statusText = 'Včas';
                break;
            case 'delayed':
                statusText = `Zpoždění ${connection.delay}`;
                break;
            case 'cancelled':
                statusText = 'Zrušeno';
                break;
        }
        
        return `
            <div class="transport-connection-item">
                <div class="transport-connection-header">
                    <div class="transport-connection-time">
                        ${departureTime} → ${arrivalTime}
                    </div>
                    <div class="transport-connection-duration">
                        ${connection.duration}
                    </div>
                </div>
                <div class="transport-connection-details">
                    <div class="transport-connection-route">
                        <div class="transport-connection-station">
                            ${connection.from}
                        </div>
                        <div class="transport-connection-line"></div>
                        <div class="transport-connection-station">
                            ${connection.to}
                        </div>
                    </div>
                </div>
                <div class="transport-connection-info">
                    <div>
                        ${icon} ${connection.line} (${connection.carrier})
                    </div>
                    <div>
                        Nástupiště: ${connection.platform}
                    </div>
                    <div class="transport-connection-price">
                        ${connection.price}
                    </div>
                    <div class="transport-connection-status ${statusClass}">
                        ${statusText}
                    </div>
                </div>
            </div>
        `;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    TransportConnections.init();
});
