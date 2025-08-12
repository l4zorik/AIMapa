# Implementace offline režimu v AIMapa

Tento dokument popisuje implementaci offline režimu v aplikaci AIMapa pro verzi 0.3.8.2, který umožňuje používat aplikaci bez připojení k internetu.

## Přehled funkcionality

Offline režim v AIMapa umožňuje:

1. **Používání aplikace bez připojení k internetu**
2. **Ukládání map pro offline použití**
3. **Práci s body, trasami a úkoly offline**
4. **Synchronizaci dat po opětovném připojení**
5. **Optimalizaci pro mobilní zařízení s omezeným datovým připojením**

## Technická implementace

### 1. Ukládání dat pomocí IndexedDB

Pro ukládání dat v offline režimu je použita IndexedDB, která umožňuje ukládat velké množství strukturovaných dat:

```javascript
const OfflineStorage = {
    // Konfigurace
    config: {
        dbName: 'AIMapa_Offline',
        dbVersion: 1,
        stores: {
            maps: { keyPath: 'id' },
            points: { keyPath: 'id' },
            routes: { keyPath: 'id' },
            tasks: { keyPath: 'id' },
            settings: { keyPath: 'id' },
            userProgress: { keyPath: 'id' }
        }
    },
    
    // Reference na databázi
    db: null,
    
    // Inicializace databáze
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.dbName, this.config.dbVersion);
            
            // Vytvoření nebo aktualizace struktury databáze
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Vytvoření stores pro různé typy dat
                for (const [storeName, storeConfig] of Object.entries(this.config.stores)) {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, storeConfig);
                    }
                }
            };
            
            // Úspěšné otevření databáze
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Offline databáze byla úspěšně inicializována');
                resolve();
            };
            
            // Chyba při otevírání databáze
            request.onerror = (event) => {
                console.error('Chyba při inicializaci offline databáze:', event.target.error);
                reject(event.target.error);
            };
        });
    },
    
    // Uložení dat do databáze
    async saveData(storeName, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Databáze není inicializována'));
                return;
            }
            
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    // Načtení dat z databáze
    async getData(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Databáze není inicializována'));
                return;
            }
            
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    // Načtení všech dat z databáze
    async getAllData(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Databáze není inicializována'));
                return;
            }
            
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    // Odstranění dat z databáze
    async deleteData(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Databáze není inicializována'));
                return;
            }
            
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },
    
    // Vymazání všech dat z databáze
    async clearStore(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Databáze není inicializována'));
                return;
            }
            
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};
```

### 2. Ukládání mapových dlaždic pro offline použití

Pro ukládání mapových dlaždic je použita kombinace Service Worker a Cache API:

```javascript
// Service Worker pro ukládání mapových dlaždic
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Zachycení požadavků na mapové dlaždice
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Kontrola, zda se jedná o mapovou dlaždici
    if (url.pathname.includes('/tile/') || url.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(
            caches.open('map-tiles').then((cache) => {
                return cache.match(event.request).then((response) => {
                    // Vrácení dlaždice z cache, pokud existuje
                    if (response) {
                        return response;
                    }
                    
                    // Stažení dlaždice z internetu a uložení do cache
                    return fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(() => {
                        // Vrácení prázdné dlaždice v případě chyby
                        return new Response(null, {
                            status: 404,
                            statusText: 'Not found'
                        });
                    });
                });
            })
        );
    } else {
        // Standardní zpracování ostatních požadavků
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
```

### 3. Správa offline režimu

Modul pro správu offline režimu:

```javascript
const OfflineMode = {
    // Konfigurace
    config: {
        maxOfflineMapSize: 100 * 1024 * 1024, // 100 MB
        autoSyncInterval: 60000, // 1 minuta
        offlineMapAreas: []
    },
    
    // Stav modulu
    state: {
        isOfflineMode: false,
        isInitialized: false,
        pendingChanges: [],
        lastSyncTime: null,
        autoSyncTimer: null,
        offlineMapSize: 0
    },
    
    // Inicializace modulu
    async init() {
        if (this.state.isInitialized) return;
        
        console.log('Inicializace offline režimu...');
        
        // Inicializace offline úložiště
        await OfflineStorage.init();
        
        // Načtení konfigurace
        await this.loadConfig();
        
        // Registrace service workeru
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/offline-worker.js');
                console.log('Service Worker byl úspěšně registrován:', registration.scope);
            } catch (error) {
                console.error('Chyba při registraci Service Workeru:', error);
            }
        }
        
        // Detekce stavu připojení
        this.setupConnectionDetection();
        
        // Nastavení automatické synchronizace
        this.setupAutoSync();
        
        this.state.isInitialized = true;
        console.log('Offline režim byl inicializován');
    },
    
    // Načtení konfigurace
    async loadConfig() {
        try {
            const config = await OfflineStorage.getData('settings', 'offlineConfig');
            if (config) {
                this.config = { ...this.config, ...config };
                console.log('Konfigurace offline režimu byla načtena');
            }
        } catch (error) {
            console.error('Chyba při načítání konfigurace offline režimu:', error);
        }
    },
    
    // Uložení konfigurace
    async saveConfig() {
        try {
            await OfflineStorage.saveData('settings', {
                id: 'offlineConfig',
                ...this.config
            });
            console.log('Konfigurace offline režimu byla uložena');
        } catch (error) {
            console.error('Chyba při ukládání konfigurace offline režimu:', error);
        }
    },
    
    // Nastavení detekce připojení
    setupConnectionDetection() {
        // Detekce změny stavu připojení
        window.addEventListener('online', () => {
            console.log('Připojení k internetu bylo obnoveno');
            this.state.isOfflineMode = false;
            
            // Synchronizace dat po obnovení připojení
            this.syncData();
            
            // Informace pro uživatele
            if (typeof addMessage !== 'undefined') {
                addMessage('Připojení k internetu bylo obnoveno. Probíhá synchronizace dat...', false);
            }
        });
        
        window.addEventListener('offline', () => {
            console.log('Připojení k internetu bylo ztraceno');
            this.state.isOfflineMode = true;
            
            // Informace pro uživatele
            if (typeof addMessage !== 'undefined') {
                addMessage('Připojení k internetu bylo ztraceno. Aplikace přechází do offline režimu.', false);
            }
        });
        
        // Počáteční stav
        this.state.isOfflineMode = !navigator.onLine;
    },
    
    // Nastavení automatické synchronizace
    setupAutoSync() {
        // Zrušení existujícího časovače
        if (this.state.autoSyncTimer) {
            clearInterval(this.state.autoSyncTimer);
        }
        
        // Nastavení nového časovače
        this.state.autoSyncTimer = setInterval(() => {
            if (navigator.onLine && this.state.pendingChanges.length > 0) {
                this.syncData();
            }
        }, this.config.autoSyncInterval);
    },
    
    // Přidání oblasti pro offline mapu
    async addOfflineMapArea(bounds, zoomLevels = [13, 14, 15]) {
        const area = {
            id: 'area_' + Date.now(),
            bounds,
            zoomLevels,
            timestamp: Date.now()
        };
        
        // Přidání oblasti do konfigurace
        this.config.offlineMapAreas.push(area);
        await this.saveConfig();
        
        // Stažení mapových dlaždic pro offline použití
        await this.downloadMapTiles(area);
        
        return area;
    },
    
    // Stažení mapových dlaždic pro offline použití
    async downloadMapTiles(area) {
        const { bounds, zoomLevels } = area;
        const tilesToDownload = [];
        
        // Výpočet dlaždic pro stažení
        for (const zoom of zoomLevels) {
            const minTileX = Math.floor((bounds.west + 180) / 360 * Math.pow(2, zoom));
            const maxTileX = Math.floor((bounds.east + 180) / 360 * Math.pow(2, zoom));
            const minTileY = Math.floor((1 - Math.log(Math.tan(bounds.north * Math.PI / 180) + 1 / Math.cos(bounds.north * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
            const maxTileY = Math.floor((1 - Math.log(Math.tan(bounds.south * Math.PI / 180) + 1 / Math.cos(bounds.south * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
            
            for (let x = minTileX; x <= maxTileX; x++) {
                for (let y = minTileY; y <= maxTileY; y++) {
                    tilesToDownload.push({
                        url: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
                        x, y, zoom
                    });
                }
            }
        }
        
        // Informace pro uživatele
        if (typeof addMessage !== 'undefined') {
            addMessage(`Stahování ${tilesToDownload.length} mapových dlaždic pro offline použití...`, false);
        }
        
        // Stažení dlaždic
        const cache = await caches.open('map-tiles');
        let downloadedSize = 0;
        
        for (let i = 0; i < tilesToDownload.length; i++) {
            const tile = tilesToDownload[i];
            try {
                const response = await fetch(tile.url);
                await cache.put(tile.url, response.clone());
                
                // Aktualizace velikosti stažených dat
                const blob = await response.blob();
                downloadedSize += blob.size;
                
                // Kontrola maximální velikosti
                if (downloadedSize + this.state.offlineMapSize > this.config.maxOfflineMapSize) {
                    if (typeof addMessage !== 'undefined') {
                        addMessage('Dosažen limit velikosti offline map. Stahování bylo přerušeno.', false);
                    }
                    break;
                }
                
                // Aktualizace průběhu
                if (i % 10 === 0 && typeof addMessage !== 'undefined') {
                    addMessage(`Stahování map: ${Math.round((i / tilesToDownload.length) * 100)}%`, false, null, true);
                }
            } catch (error) {
                console.error(`Chyba při stahování dlaždice ${tile.url}:`, error);
            }
        }
        
        // Aktualizace velikosti offline map
        this.state.offlineMapSize += downloadedSize;
        
        // Informace pro uživatele
        if (typeof addMessage !== 'undefined') {
            addMessage(`Stahování map dokončeno. Staženo ${(downloadedSize / 1024 / 1024).toFixed(2)} MB.`, false);
        }
        
        // Přidání achievementu za stažení offline map
        if (typeof Achievements !== 'undefined' && tilesToDownload.length > 0) {
            Achievements.updateProgress('data-saver', 1);
        }
    },
    
    // Odstranění oblasti offline mapy
    async removeOfflineMapArea(areaId) {
        // Nalezení oblasti
        const areaIndex = this.config.offlineMapAreas.findIndex(area => area.id === areaId);
        if (areaIndex === -1) return false;
        
        const area = this.config.offlineMapAreas[areaIndex];
        
        // Odstranění oblasti z konfigurace
        this.config.offlineMapAreas.splice(areaIndex, 1);
        await this.saveConfig();
        
        // Odstranění mapových dlaždic z cache
        try {
            const cache = await caches.open('map-tiles');
            const keys = await cache.keys();
            
            for (const key of keys) {
                const url = new URL(key.url);
                const parts = url.pathname.split('/');
                
                if (parts.length >= 4) {
                    const zoom = parseInt(parts[1]);
                    const x = parseInt(parts[2]);
                    const y = parseInt(parts[3]);
                    
                    // Kontrola, zda dlaždice patří do odstraňované oblasti
                    if (area.zoomLevels.includes(zoom)) {
                        const lon = (x / Math.pow(2, zoom)) * 360 - 180;
                        const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / Math.pow(2, zoom)))) * 180 / Math.PI;
                        
                        if (
                            lon >= area.bounds.west &&
                            lon <= area.bounds.east &&
                            lat >= area.bounds.south &&
                            lat <= area.bounds.north
                        ) {
                            await cache.delete(key);
                        }
                    }
                }
            }
            
            // Informace pro uživatele
            if (typeof addMessage !== 'undefined') {
                addMessage('Oblast offline mapy byla úspěšně odstraněna.', false);
            }
            
            return true;
        } catch (error) {
            console.error('Chyba při odstraňování offline mapy:', error);
            return false;
        }
    },
    
    // Přidání změny do fronty pro synchronizaci
    addPendingChange(change) {
        change.timestamp = Date.now();
        this.state.pendingChanges.push(change);
        
        // Uložení změn do offline úložiště
        this.savePendingChanges();
    },
    
    // Uložení čekajících změn do offline úložiště
    async savePendingChanges() {
        try {
            await OfflineStorage.saveData('settings', {
                id: 'pendingChanges',
                changes: this.state.pendingChanges
            });
        } catch (error) {
            console.error('Chyba při ukládání čekajících změn:', error);
        }
    },
    
    // Načtení čekajících změn z offline úložiště
    async loadPendingChanges() {
        try {
            const data = await OfflineStorage.getData('settings', 'pendingChanges');
            if (data && data.changes) {
                this.state.pendingChanges = data.changes;
                console.log(`Načteno ${this.state.pendingChanges.length} čekajících změn`);
            }
        } catch (error) {
            console.error('Chyba při načítání čekajících změn:', error);
        }
    },
    
    // Synchronizace dat s online verzí
    async syncData() {
        if (!navigator.onLine || this.state.pendingChanges.length === 0) return;
        
        console.log(`Synchronizace ${this.state.pendingChanges.length} změn...`);
        
        // Informace pro uživatele
        if (typeof addMessage !== 'undefined') {
            addMessage(`Synchronizace ${this.state.pendingChanges.length} změn...`, false);
        }
        
        // Zpracování změn
        const successfulChanges = [];
        
        for (const change of this.state.pendingChanges) {
            try {
                switch (change.type) {
                    case 'addPoint':
                        // Implementace synchronizace přidání bodu
                        await this.syncAddPoint(change);
                        successfulChanges.push(change);
                        break;
                    
                    case 'updatePoint':
                        // Implementace synchronizace aktualizace bodu
                        await this.syncUpdatePoint(change);
                        successfulChanges.push(change);
                        break;
                    
                    case 'deletePoint':
                        // Implementace synchronizace odstranění bodu
                        await this.syncDeletePoint(change);
                        successfulChanges.push(change);
                        break;
                    
                    case 'addRoute':
                        // Implementace synchronizace přidání trasy
                        await this.syncAddRoute(change);
                        successfulChanges.push(change);
                        break;
                    
                    // Další typy změn...
                    
                    default:
                        console.warn(`Neznámý typ změny: ${change.type}`);
                }
            } catch (error) {
                console.error(`Chyba při synchronizaci změny ${change.type}:`, error);
            }
        }
        
        // Odstranění úspěšně synchronizovaných změn
        this.state.pendingChanges = this.state.pendingChanges.filter(
            change => !successfulChanges.includes(change)
        );
        
        // Uložení zbývajících změn
        await this.savePendingChanges();
        
        // Aktualizace času poslední synchronizace
        this.state.lastSyncTime = Date.now();
        
        // Informace pro uživatele
        if (typeof addMessage !== 'undefined') {
            addMessage(`Synchronizace dokončena. Synchronizováno ${successfulChanges.length} změn.`, false);
        }
        
        console.log(`Synchronizace dokončena. Synchronizováno ${successfulChanges.length} změn.`);
    },
    
    // Implementace synchronizace přidání bodu
    async syncAddPoint(change) {
        // Implementace podle konkrétní aplikace
        // Například:
        if (typeof addMarker !== 'undefined') {
            const { lat, lng, title, description } = change.data;
            await addMarker(lat, lng, title, description, true); // true = skipOfflineQueue
        }
    },
    
    // Implementace synchronizace aktualizace bodu
    async syncUpdatePoint(change) {
        // Implementace podle konkrétní aplikace
    },
    
    // Implementace synchronizace odstranění bodu
    async syncDeletePoint(change) {
        // Implementace podle konkrétní aplikace
    },
    
    // Implementace synchronizace přidání trasy
    async syncAddRoute(change) {
        // Implementace podle konkrétní aplikace
    }
};
```

### 4. Uživatelské rozhraní pro správu offline režimu

```html
<div class="settings-section">
    <h3>Offline režim</h3>
    
    <div class="toggle-container">
        <span>Vypnuto</span>
        <label class="switch">
            <input type="checkbox" id="offlineModeToggle">
            <span class="slider round"></span>
        </label>
        <span>Zapnuto</span>
    </div>
    
    <div class="settings-subsection offline-mode-settings">
        <h4>Nastavení offline režimu</h4>
        
        <div class="setting-item">
            <label for="offlineMapSize">Maximální velikost offline map:</label>
            <select id="offlineMapSize">
                <option value="50">50 MB</option>
                <option value="100" selected>100 MB</option>
                <option value="200">200 MB</option>
                <option value="500">500 MB</option>
                <option value="1000">1 GB</option>
            </select>
        </div>
        
        <div class="setting-item">
            <label for="offlineAutoSync">Automatická synchronizace:</label>
            <select id="offlineAutoSync">
                <option value="0">Vypnuto</option>
                <option value="60000" selected>Každou minutu</option>
                <option value="300000">Každých 5 minut</option>
                <option value="900000">Každých 15 minut</option>
                <option value="3600000">Každou hodinu</option>
            </select>
        </div>
        
        <div class="setting-item">
            <button id="addOfflineMapArea" class="btn btn-primary">Přidat oblast pro offline mapu</button>
        </div>
        
        <div class="offline-map-areas">
            <h5>Uložené oblasti</h5>
            <div id="offlineMapAreasList" class="offline-map-areas-list">
                <!-- Seznam oblastí bude dynamicky generován -->
            </div>
        </div>
        
        <div class="offline-stats">
            <div class="offline-stat-item">
                <div class="offline-stat-label">Využité místo:</div>
                <div class="offline-stat-value" id="offlineUsedSpace">0 MB</div>
            </div>
            <div class="offline-stat-item">
                <div class="offline-stat-label">Čekající změny:</div>
                <div class="offline-stat-value" id="offlinePendingChanges">0</div>
            </div>
            <div class="offline-stat-item">
                <div class="offline-stat-label">Poslední synchronizace:</div>
                <div class="offline-stat-value" id="offlineLastSync">Nikdy</div>
            </div>
        </div>
        
        <div class="setting-item">
            <button id="syncOfflineData" class="btn btn-secondary">Synchronizovat nyní</button>
            <button id="clearOfflineData" class="btn btn-danger">Vymazat offline data</button>
        </div>
    </div>
</div>
```

## Omezení offline režimu

Některé funkce aplikace mají v offline režimu omezení:

1. **Vyhledávání spojení veřejnou dopravou** - Vyžaduje připojení k internetu pro získání aktuálních dat
2. **Aktualizace kurzů kryptoměn** - Není dostupná v offline režimu
3. **Načítání reálných dat podniků** - Vyžaduje připojení k internetu
4. **Některé achievementy** - Nelze získat v offline režimu

## Testování offline režimu

Pro testování offline režimu byly použity následující metody:

1. **Režim letadlo** - Testování na mobilních zařízeních v režimu letadlo
2. **Odpojení od sítě** - Testování na desktopových zařízeních odpojením od sítě
3. **Simulace offline režimu** - Použití vývojářských nástrojů prohlížeče pro simulaci offline režimu
4. **Testování v terénu** - Testování v oblastech s omezeným nebo žádným připojením k internetu

## Závěr

Implementace offline režimu v aplikaci AIMapa umožňuje uživatelům používat aplikaci i bez připojení k internetu. Díky ukládání mapových dlaždic, bodů, tras a dalších dat do lokálního úložiště mohou uživatelé pracovat s aplikací i v oblastech s omezeným nebo žádným připojením k internetu. Po obnovení připojení se data automaticky synchronizují s online verzí aplikace.

---

*Poslední aktualizace: 2025-07-08*
