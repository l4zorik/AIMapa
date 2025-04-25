/**
 * Modul pro služby veřejné dopravy
 * Verze 0.2.8.7.8
 */

const TransportServices = {
    // Stav modulu
    isInitialized: false,
    
    // Inicializace modulu
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializace modulu služeb veřejné dopravy...');
        
        // Vytvoření HTML struktury pro služby
        this.createServiceContainer();
        
        // Přidání event listenerů
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Modul služeb veřejné dopravy byl inicializován');
    },
    
    // Vytvoření HTML struktury pro služby
    createServiceContainer() {
        // Kontrola, zda kontejner již existuje
        if (document.getElementById('transport-service-container')) return;
        
        // Vytvoření kontejneru
        const container = document.createElement('div');
        container.id = 'transport-service-container';
        container.className = 'transport-service-container';
        container.style.display = 'none';
        
        // Vytvoření hlavičky
        const header = document.createElement('div');
        header.className = 'transport-service-header';
        header.innerHTML = `
            <div class="transport-service-title">
                <span class="transport-service-icon">🚌</span>
                <h3>Veřejná doprava</h3>
            </div>
            <button class="transport-service-close">&times;</button>
        `;
        
        // Vytvoření obsahu
        const content = document.createElement('div');
        content.className = 'transport-service-content';
        
        // Vytvoření formuláře pro vyhledávání spojení
        const searchForm = document.createElement('div');
        searchForm.className = 'transport-search-form';
        searchForm.innerHTML = `
            <div class="form-group">
                <label for="transport-from">Odkud</label>
                <input type="text" id="transport-from" placeholder="Zadejte místo odjezdu" value="Hodonín">
            </div>
            <div class="form-group">
                <label for="transport-to">Kam</label>
                <input type="text" id="transport-to" placeholder="Zadejte místo příjezdu" value="Hrušky">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="transport-date">Datum</label>
                    <input type="date" id="transport-date" value="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="transport-time">Čas</label>
                    <input type="time" id="transport-time" value="${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}">
                </div>
            </div>
            <div class="form-group">
                <label>Typ dopravy</label>
                <div class="transport-type-options">
                    <label class="transport-type-option">
                        <input type="checkbox" id="transport-type-bus" checked>
                        <span>Autobus</span>
                    </label>
                    <label class="transport-type-option">
                        <input type="checkbox" id="transport-type-train" checked>
                        <span>Vlak</span>
                    </label>
                </div>
            </div>
            <button id="transport-search-btn" class="transport-search-btn">Vyhledat spojení</button>
        `;
        
        content.appendChild(searchForm);
        
        // Vytvoření kontejneru pro výsledky
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'transport-results-container';
        resultsContainer.innerHTML = `
            <div class="transport-results-header">
                <h4>Nalezená spojení</h4>
                <button id="transport-refresh-btn" class="transport-refresh-btn">Obnovit</button>
            </div>
            <div id="transport-results" class="transport-results">
                <div class="transport-no-results">Zadejte odkud a kam chcete cestovat a klikněte na tlačítko Vyhledat spojení.</div>
            </div>
        `;
        
        content.appendChild(resultsContainer);
        
        // Sestavení kontejneru
        container.appendChild(header);
        container.appendChild(content);
        
        // Přidání do dokumentu
        document.body.appendChild(container);
    },
    
    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro zavření služby
        document.addEventListener('click', (e) => {
            if (e.target.matches('.transport-service-close')) {
                this.hideService();
            }
        });
        
        // Event listener pro vyhledání spojení
        document.addEventListener('click', (e) => {
            if (e.target.matches('#transport-search-btn')) {
                this.searchConnections();
            }
        });
        
        // Event listener pro obnovení spojení
        document.addEventListener('click', (e) => {
            if (e.target.matches('#transport-refresh-btn')) {
                this.searchConnections();
            }
        });
    },
    
    // Zobrazení služby
    showService() {
        // Skrytí všech služeb
        document.querySelectorAll('.transport-service-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Zobrazení požadované služby
        const container = document.getElementById('transport-service-container');
        if (container) {
            container.style.display = 'flex';
            
            // Přidání XP za použití služby
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(5, 'Použití služby veřejné dopravy');
            }
            
            // Přidání zprávy do chatu
            if (typeof addMessage !== 'undefined') {
                addMessage('Zobrazuji vyhledávání spojení veřejnou dopravou', false);
            }
        }
    },
    
    // Skrytí služby
    hideService() {
        document.querySelectorAll('.transport-service-container').forEach(container => {
            container.style.display = 'none';
        });
    },
    
    // Vyhledání spojení
    searchConnections() {
        // Získání hodnot z formuláře
        const from = document.getElementById('transport-from').value;
        const to = document.getElementById('transport-to').value;
        const date = document.getElementById('transport-date').value;
        const time = document.getElementById('transport-time').value;
        const busEnabled = document.getElementById('transport-type-bus').checked;
        const trainEnabled = document.getElementById('transport-type-train').checked;
        
        // Kontrola, zda jsou vyplněny povinné údaje
        if (!from || !to) {
            alert('Vyplňte odkud a kam chcete cestovat');
            return;
        }
        
        // Zobrazení načítání
        const resultsContainer = document.getElementById('transport-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="transport-loading">Vyhledávám spojení...</div>';
        }
        
        // Simulace vyhledávání spojení
        setTimeout(() => {
            this.displayResults(from, to, date, time, busEnabled, trainEnabled);
            
            // Přidání XP za vyhledání spojení
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(10, 'Vyhledání spojení veřejnou dopravou');
            }
        }, 1500);
    },
    
    // Zobrazení výsledků
    displayResults(from, to, date, time, busEnabled, trainEnabled) {
        const resultsContainer = document.getElementById('transport-results');
        if (!resultsContainer) return;
        
        // Vytvoření ukázkových spojení
        const connections = [
            {
                type: 'train',
                departure: '08:15',
                arrival: '08:45',
                from: from,
                to: to,
                platform: '1',
                carrier: 'České dráhy',
                price: '45 Kč',
                delay: 0
            },
            {
                type: 'bus',
                departure: '08:30',
                arrival: '09:10',
                from: from,
                to: to,
                platform: 'A',
                carrier: 'ČSAD Hodonín',
                price: '40 Kč',
                delay: 5
            },
            {
                type: 'train',
                departure: '09:15',
                arrival: '09:45',
                from: from,
                to: to,
                platform: '2',
                carrier: 'RegioJet',
                price: '50 Kč',
                delay: 0
            },
            {
                type: 'bus',
                departure: '09:30',
                arrival: '10:10',
                from: from,
                to: to,
                platform: 'B',
                carrier: 'FlixBus',
                price: '55 Kč',
                delay: 0
            },
            {
                type: 'train',
                departure: '10:15',
                arrival: '10:45',
                from: from,
                to: to,
                platform: '1',
                carrier: 'České dráhy',
                price: '45 Kč',
                delay: 10
            }
        ];
        
        // Filtrování spojení podle typu dopravy
        const filteredConnections = connections.filter(conn => {
            if (conn.type === 'train' && !trainEnabled) return false;
            if (conn.type === 'bus' && !busEnabled) return false;
            return true;
        });
        
        // Zobrazení výsledků
        if (filteredConnections.length === 0) {
            resultsContainer.innerHTML = '<div class="transport-no-results">Nebyla nalezena žádná spojení odpovídající vašim kritériím.</div>';
            return;
        }
        
        let html = '';
        
        filteredConnections.forEach(conn => {
            const delayText = conn.delay > 0 ? `<span class="transport-delay">+${conn.delay} min</span>` : '<span class="transport-on-time">Včas</span>';
            
            html += `
                <div class="transport-connection ${conn.type}">
                    <div class="connection-header">
                        <div class="connection-type">${conn.type === 'train' ? '🚆 Vlak' : '🚌 Autobus'}</div>
                        <div class="connection-carrier">${conn.carrier}</div>
                    </div>
                    <div class="connection-times">
                        <div class="connection-departure">
                            <div class="connection-time">${conn.departure}</div>
                            <div class="connection-station">${conn.from}</div>
                        </div>
                        <div class="connection-duration">
                            <div class="connection-arrow">→</div>
                            <div class="connection-duration-time">30 min</div>
                        </div>
                        <div class="connection-arrival">
                            <div class="connection-time">${conn.arrival}</div>
                            <div class="connection-station">${conn.to}</div>
                        </div>
                    </div>
                    <div class="connection-details">
                        <div class="connection-platform">Nástupiště: ${conn.platform}</div>
                        <div class="connection-status">Stav: ${delayText}</div>
                        <div class="connection-price">Cena: ${conn.price}</div>
                    </div>
                    <button class="connection-buy-btn" data-id="${conn.type}-${conn.departure}">Koupit jízdenku</button>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
        
        // Přidání event listenerů pro tlačítka koupit jízdenku
        document.querySelectorAll('.connection-buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const connectionId = e.target.dataset.id;
                this.buyTicket(connectionId);
            });
        });
    },
    
    // Nákup jízdenky
    buyTicket(connectionId) {
        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(`Kupuji jízdenku pro spojení ${connectionId}...`, true);
            
            setTimeout(() => {
                const message = `Jízdenka byla úspěšně zakoupena!
                
Číslo jízdenky: ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
Platnost: ${new Date().toLocaleDateString()}
Cena: ${Math.floor(Math.random() * 50) + 30} Kč

Jízdenka byla odeslána na váš e-mail.`;
                
                addMessage(message, false);
                
                // Přidání XP za nákup jízdenky
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(15, 'Nákup jízdenky na veřejnou dopravu');
                }
            }, 1500);
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    TransportServices.init();
});

// Přidání CSS stylů
const transportServicesStyles = document.createElement('style');
transportServicesStyles.textContent = `
.transport-service-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    background-color: var(--card-bg);
    border-radius: 10px;
    z-index: 1001;
    display: none;
    flex-direction: column;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.transport-service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
}

.transport-service-title {
    display: flex;
    align-items: center;
}

.transport-service-icon {
    margin-right: 10px;
    font-size: 24px;
}

.transport-service-title h3 {
    margin: 0;
    font-size: 18px;
    color: var(--text-color);
}

.transport-service-close {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.transport-service-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 20px;
}

.transport-search-form {
    margin-bottom: 20px;
    padding: 15px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

.form-row {
    display: flex;
    gap: 15px;
}

.form-row .form-group {
    flex: 1;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
}

.form-group input, .form-group select {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg-dark);
    color: var(--text-color);
    font-size: 14px;
}

.transport-type-options {
    display: flex;
    gap: 15px;
}

.transport-type-option {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.transport-type-option input {
    margin-right: 5px;
    width: auto;
}

.transport-search-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-weight: bold;
    width: 100%;
}

.transport-search-btn:hover {
    background-color: var(--primary-color-dark);
}

.transport-results-container {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.transport-results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.transport-results-header h4 {
    margin: 0;
    font-size: 16px;
}

.transport-refresh-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-size: 12px;
}

.transport-refresh-btn:hover {
    background-color: var(--primary-color-dark);
}

.transport-results {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.transport-no-results, .transport-loading {
    padding: 20px;
    text-align: center;
    color: var(--text-color);
    opacity: 0.7;
}

.transport-connection {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 15px;
    transition: transform 0.2s ease;
}

.transport-connection:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.transport-connection.train {
    border-left: 4px solid #3B82F6;
}

.transport-connection.bus {
    border-left: 4px solid #10B981;
}

.connection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.connection-type {
    font-weight: bold;
    font-size: 14px;
}

.connection-carrier {
    font-size: 14px;
    opacity: 0.8;
}

.connection-times {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.connection-departure, .connection-arrival {
    text-align: center;
}

.connection-time {
    font-weight: bold;
    font-size: 18px;
}

.connection-station {
    font-size: 14px;
    opacity: 0.8;
}

.connection-duration {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.connection-arrow {
    font-size: 20px;
    opacity: 0.5;
}

.connection-duration-time {
    font-size: 12px;
    opacity: 0.7;
}

.connection-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    opacity: 0.8;
}

.connection-delay {
    color: #EF4444;
}

.connection-on-time {
    color: #10B981;
}

.connection-buy-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
}

.connection-buy-btn:hover {
    background-color: var(--primary-color-dark);
}
`;

document.head.appendChild(transportServicesStyles);
