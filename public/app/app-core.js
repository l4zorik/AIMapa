/**
 * AIMapa - Optimalizovaný hlavní modul aplikace
 * Verze 0.3.8.6 - Optimalizace a VoiceBot integrace
 * 
 * Tento modul obsahuje základní funkcionalitu aplikace
 * optimalizovanou pro lepší výkon a integraci s VoiceBot
 */

class AIMapa {
    constructor() {
        this.isInitialized = false;
        this.map = null;
        this.modules = new Map();
        this.settings = {
            darkMode: false,
            fullscreen: false,
            globeMode: false,
            voiceBotEnabled: true
        };
        
        // Výchozí souřadnice (Praha)
        this.defaultCoords = {
            lat: 50.0755,
            lng: 14.4378,
            zoom: 13
        };
    }

    /**
     * Inicializace aplikace
     */
    async init() {
        if (this.isInitialized) return;

        console.log('🚀 Inicializace AIMapa aplikace...');

        try {
            // Načtení nastavení
            this.loadSettings();
            
            // Inicializace mapy
            await this.initMap();
            
            // Inicializace modulů
            await this.initModules();
            
            // Nastavení event listenerů
            this.setupEventListeners();
            
            // Aplikace nastavení
            this.applySettings();
            
            this.isInitialized = true;
            console.log('✅ AIMapa aplikace byla úspěšně inicializována');
            
            // Notifikace o úspěšné inicializaci
            this.showNotification('AIMapa je připravena k použití!', 'success');
            
        } catch (error) {
            console.error('❌ Chyba při inicializaci aplikace:', error);
            this.showNotification('Chyba při načítání aplikace: ' + error.message, 'error');
        }
    }

    /**
     * Inicializace mapy
     */
    async initMap() {
        console.log('🗺️ Inicializace mapy...');

        // Kontrola dostupnosti Leaflet
        if (typeof L === 'undefined') {
            await this.loadLeaflet();
        }

        // Kontrola existence map elementu
        const mapElement = document.getElementById('map');
        if (!mapElement) {
            throw new Error('Map element not found');
        }

        // Vytvoření mapy s optimalizovanými nastaveními
        this.map = L.map('map', {
            center: [this.defaultCoords.lat, this.defaultCoords.lng],
            zoom: this.defaultCoords.zoom,
            zoomAnimation: true,
            markerZoomAnimation: true,
            fadeAnimation: true,
            zoomSnap: 0.5,
            wheelPxPerZoomLevel: 120,
            minZoom: 2,
            maxZoom: 18,
            maxBounds: [[-90, -180], [90, 180]],
            preferCanvas: true // Lepší výkon pro velké množství markerů
        });

        // Přidání základní vrstvy
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            tileSize: 256,
            zoomOffset: 0
        }).addTo(this.map);

        // Globální reference pro zpětnou kompatibilitu
        window.map = this.map;

        console.log('✅ Mapa byla úspěšně inicializována');
    }

    /**
     * Načtení Leaflet knihovny
     */
    async loadLeaflet() {
        return new Promise((resolve, reject) => {
            if (typeof L !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';

            script.onload = () => {
                console.log('✅ Leaflet byl úspěšně načten');
                resolve();
            };

            script.onerror = () => {
                reject(new Error('Nepodařilo se načíst Leaflet'));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Inicializace modulů
     */
    async initModules() {
        console.log('🔧 Inicializace modulů...');

        const moduleList = [
            { name: 'UserProgress', required: false },
            { name: 'VirtualWork', required: false },
            { name: 'TaskSystem', required: false },
            { name: 'Achievements', required: false },
            { name: 'RewardSystem', required: false },
            { name: 'CommandsMenu', required: false },
            { name: 'UpdatesNotification', required: false },
            { name: 'VoiceBot', required: false }
        ];

        for (const moduleInfo of moduleList) {
            try {
                await this.initModule(moduleInfo.name, moduleInfo.required);
            } catch (error) {
                console.warn(`⚠️ Modul ${moduleInfo.name} se nepodařilo inicializovat:`, error);
                if (moduleInfo.required) {
                    throw error;
                }
            }
        }

        console.log('✅ Moduly byly inicializovány');
    }

    /**
     * Inicializace jednotlivého modulu
     */
    async initModule(moduleName, required = false) {
        try {
            const moduleObject = window[moduleName];
            
            if (!moduleObject) {
                if (required) {
                    throw new Error(`Požadovaný modul ${moduleName} není dostupný`);
                }
                return;
            }

            // Inicializace modulu pokud má init metodu
            if (typeof moduleObject.init === 'function') {
                await moduleObject.init();
                this.modules.set(moduleName, moduleObject);
                console.log(`✅ Modul ${moduleName} inicializován`);
            }

        } catch (error) {
            console.error(`❌ Chyba při inicializaci modulu ${moduleName}:`, error);
            if (required) {
                throw error;
            }
        }
    }

    /**
     * Nastavení event listenerů
     */
    setupEventListeners() {
        // Resize event pro přepočítání velikosti mapy
        window.addEventListener('resize', () => {
            if (this.map) {
                setTimeout(() => {
                    this.map.invalidateSize();
                }, 100);
            }
        });

        // Klávesové zkratky
        document.addEventListener('keydown', (event) => {
            this.handleKeyboardShortcuts(event);
        });

        // Visibility change pro optimalizaci výkonu
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });
    }

    /**
     * Zpracování klávesových zkratek
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + klávesa
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'f':
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'g':
                    event.preventDefault();
                    this.toggleGlobe();
                    break;
                case 'd':
                    event.preventDefault();
                    this.toggleDarkMode();
                    break;
                case 'v':
                    event.preventDefault();
                    this.toggleVoiceBot();
                    break;
            }
        }

        // Escape klávesa
        if (event.key === 'Escape') {
            this.closeAllDialogs();
        }
    }

    /**
     * Zpracování změny viditelnosti stránky
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Stránka není viditelná - pozastavíme náročné operace
            this.pauseHeavyOperations();
        } else {
            // Stránka je viditelná - obnovíme operace
            this.resumeHeavyOperations();
        }
    }

    /**
     * Pozastavení náročných operací
     */
    pauseHeavyOperations() {
        // Pozastavení animací, aktualizací atd.
        console.log('🔄 Pozastavuji náročné operace');
    }

    /**
     * Obnovení náročných operací
     */
    resumeHeavyOperations() {
        // Obnovení animací, aktualizací atd.
        console.log('▶️ Obnovuji náročné operace');
    }

    /**
     * Přepnutí fullscreen režimu
     */
    toggleFullscreen() {
        this.settings.fullscreen = !this.settings.fullscreen;
        
        if (this.settings.fullscreen) {
            document.body.classList.add('map-fullscreen');
        } else {
            document.body.classList.remove('map-fullscreen');
        }
        
        // Přepočítání velikosti mapy
        setTimeout(() => {
            if (this.map) {
                this.map.invalidateSize();
            }
        }, 100);
        
        this.saveSettings();
        this.showNotification(
            this.settings.fullscreen ? 'Fullscreen režim zapnut' : 'Fullscreen režim vypnut',
            'info'
        );
    }

    /**
     * Přepnutí tmavého režimu
     */
    toggleDarkMode() {
        this.settings.darkMode = !this.settings.darkMode;
        
        if (this.settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        this.saveSettings();
        this.showNotification(
            this.settings.darkMode ? 'Tmavý režim zapnut' : 'Světlý režim zapnut',
            'info'
        );
    }

    /**
     * Přepnutí glóbus režimu
     */
    toggleGlobe() {
        this.settings.globeMode = !this.settings.globeMode;
        
        // Implementace přepnutí na glóbus bude přidána později
        this.showNotification(
            this.settings.globeMode ? 'Glóbus režim zapnut' : 'Mapa režim zapnut',
            'info'
        );
        
        this.saveSettings();
    }

    /**
     * Přepnutí VoiceBot
     */
    toggleVoiceBot() {
        this.settings.voiceBotEnabled = !this.settings.voiceBotEnabled;
        
        const voiceBotContainer = document.getElementById('voicebot-container');
        if (voiceBotContainer) {
            voiceBotContainer.style.display = this.settings.voiceBotEnabled ? 'block' : 'none';
        }
        
        this.saveSettings();
        this.showNotification(
            this.settings.voiceBotEnabled ? 'VoiceBot zapnut' : 'VoiceBot vypnut',
            'info'
        );
    }

    /**
     * Zavření všech dialogů
     */
    closeAllDialogs() {
        const dialogs = document.querySelectorAll('.dialog, .modal, .popup');
        dialogs.forEach(dialog => {
            if (dialog.style.display !== 'none') {
                dialog.style.display = 'none';
            }
        });
    }

    /**
     * Načtení nastavení
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('aimapa-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.settings = { ...this.settings, ...settings };
            }
        } catch (error) {
            console.error('Chyba při načítání nastavení:', error);
        }
    }

    /**
     * Uložení nastavení
     */
    saveSettings() {
        try {
            localStorage.setItem('aimapa-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Chyba při ukládání nastavení:', error);
        }
    }

    /**
     * Aplikace nastavení
     */
    applySettings() {
        // Tmavý režim
        if (this.settings.darkMode) {
            document.body.setAttribute('data-theme', 'dark');
        }

        // Fullscreen
        if (this.settings.fullscreen) {
            document.body.classList.add('map-fullscreen');
        }

        // VoiceBot
        if (!this.settings.voiceBotEnabled) {
            const voiceBotContainer = document.getElementById('voicebot-container');
            if (voiceBotContainer) {
                voiceBotContainer.style.display = 'none';
            }
        }
    }

    /**
     * Zobrazení notifikace
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styly pro notifikaci
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10001',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        // Barvy podle typu
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;

        // Přidání do DOM
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Automatické odstranění
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    /**
     * Získání instance modulu
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Kontrola, zda je modul dostupný
     */
    hasModule(name) {
        return this.modules.has(name);
    }
}

// Vytvoření globální instance
window.AIMapa = new AIMapa();

// Automatická inicializace
document.addEventListener('DOMContentLoaded', () => {
    window.AIMapa.init();
});

// Export pro zpětnou kompatibilitu
window.toggleFullscreen = () => window.AIMapa.toggleFullscreen();
window.toggleDarkMode = () => window.AIMapa.toggleDarkMode();
window.toggleGlobe = () => window.AIMapa.toggleGlobe();
