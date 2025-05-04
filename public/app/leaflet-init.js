/**
 * Modul pro inicializaci Leaflet.js
 * Verze 0.3.8.2
 * 
 * Tento modul zajišťuje správnou inicializaci Leaflet.js a řeší problém s chybějícím souborem leaflet_js.js
 */

const LeafletInit = {
    // Stav inicializace
    initialized: false,
    
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro Leaflet.js...');
        
        // Kontrola, zda je Leaflet.js načten
        if (typeof L === 'undefined') {
            console.error('Leaflet.js není načten! Pokus o načtení z CDN...');
            this.loadLeafletFromCDN();
        } else {
            console.log('Leaflet.js je již načten.');
            this.initialized = true;
        }
    },
    
    // Načtení Leaflet.js z CDN
    loadLeafletFromCDN() {
        // Vytvoření skriptu pro načtení Leaflet.js
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        
        // Přidání event listenerů pro načtení a chybu
        script.onload = () => {
            console.log('Leaflet.js byl úspěšně načten z CDN.');
            this.initialized = true;
            
            // Vytvoření a vyvolání události pro informování ostatních modulů
            const event = new CustomEvent('leafletInitialized');
            document.dispatchEvent(event);
        };
        
        script.onerror = (error) => {
            console.error('Chyba při načítání Leaflet.js z CDN:', error);
            this.showErrorMessage();
        };
        
        // Přidání skriptu do dokumentu
        document.head.appendChild(script);
        
        // Načtení CSS pro Leaflet.js
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
    },
    
    // Zobrazení chybové zprávy
    showErrorMessage() {
        // Vytvoření elementu pro chybovou zprávu
        const errorMessage = document.createElement('div');
        errorMessage.className = 'leaflet-error-message';
        errorMessage.innerHTML = `
            <div class="leaflet-error-content">
                <h2>Chyba při načítání mapy</h2>
                <p>Nepodařilo se načíst knihovnu Leaflet.js, která je nezbytná pro zobrazení mapy.</p>
                <p>Možné příčiny:</p>
                <ul>
                    <li>Problém s připojením k internetu</li>
                    <li>Blokování skriptů v prohlížeči</li>
                    <li>Dočasný výpadek CDN serveru</li>
                </ul>
                <button id="leaflet-retry-button">Zkusit znovu</button>
            </div>
        `;
        
        // Přidání stylů pro chybovou zprávu
        const style = document.createElement('style');
        style.textContent = `
            .leaflet-error-message {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .leaflet-error-content {
                background-color: white;
                padding: 20px;
                border-radius: 10px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            }
            
            .leaflet-error-content h2 {
                color: #e74c3c;
                margin-top: 0;
            }
            
            .leaflet-error-content ul {
                text-align: left;
                margin: 15px 0;
            }
            
            #leaflet-retry-button {
                background-color: #3498db;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.2s;
            }
            
            #leaflet-retry-button:hover {
                background-color: #2980b9;
            }
            
            /* Tmavý režim */
            body[data-theme="dark"] .leaflet-error-content {
                background-color: #2d3748;
                color: #f7fafc;
            }
            
            body[data-theme="dark"] .leaflet-error-content h2 {
                color: #f56565;
            }
            
            body[data-theme="dark"] #leaflet-retry-button {
                background-color: #4299e1;
            }
            
            body[data-theme="dark"] #leaflet-retry-button:hover {
                background-color: #3182ce;
            }
        `;
        
        // Přidání elementů do dokumentu
        document.head.appendChild(style);
        document.body.appendChild(errorMessage);
        
        // Přidání event listeneru pro tlačítko "Zkusit znovu"
        document.getElementById('leaflet-retry-button').addEventListener('click', () => {
            errorMessage.remove();
            this.loadLeafletFromCDN();
        });
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    LeafletInit.init();
});
