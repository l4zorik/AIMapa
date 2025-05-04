/**
 * Synchronizační modul pro klientskou část aplikace
 * Verze 0.3.8.7
 */

// Konfigurace
let syncConfig = {
  enabled: true,
  interval: 60000, // 1 minuta
  autoSync: true,
  lastSync: null
};

// Interval pro automatickou synchronizaci
let syncInterval = null;

// Inicializace synchronizačního modulu
async function initSyncManager() {
  try {
    // Načtení konfigurace z lokálního úložiště
    const storedConfig = localStorage.getItem('syncConfig');
    
    if (storedConfig) {
      syncConfig = JSON.parse(storedConfig);
    }
    
    // Načtení konfigurace z API, pokud je uživatel přihlášen
    if (await Auth0Client.isAuthenticated()) {
      const userSettings = await fetch('/api/user/settings').then(res => res.json());
      
      syncConfig.enabled = true;
      syncConfig.autoSync = userSettings.auto_sync_enabled;
      syncConfig.interval = userSettings.sync_interval;
    }
    
    // Uložení konfigurace do lokálního úložiště
    localStorage.setItem('syncConfig', JSON.stringify(syncConfig));
    
    // Spuštění automatické synchronizace, pokud je povolena
    if (syncConfig.autoSync) {
      startAutoSync();
    }
    
    console.log('Synchronizační modul byl inicializován');
    
    return syncConfig;
  } catch (error) {
    console.error('Chyba při inicializaci synchronizačního modulu:', error);
    throw error;
  }
}

// Spuštění automatické synchronizace
function startAutoSync() {
  // Zastavení předchozího intervalu, pokud existuje
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  
  // Spuštění nového intervalu
  syncInterval = setInterval(async () => {
    if (syncConfig.enabled && syncConfig.autoSync) {
      await syncAllData();
    }
  }, syncConfig.interval);
  
  console.log(`Automatická synchronizace spuštěna s intervalem ${syncConfig.interval} ms`);
}

// Zastavení automatické synchronizace
function stopAutoSync() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    
    console.log('Automatická synchronizace zastavena');
  }
}

// Synchronizace všech dat
async function syncAllData() {
  try {
    // Kontrola, zda je uživatel přihlášen
    if (!await Auth0Client.isAuthenticated()) {
      console.log('Uživatel není přihlášen, synchronizace přeskočena');
      return;
    }
    
    console.log('Synchronizace dat...');
    
    // Získání ID uživatele
    const userProfile = await Auth0Client.getUserProfile();
    const userId = userProfile.sub;
    
    // Synchronizace nastavení
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    await SupabaseClient.syncData(userId, settings, 'user_settings');
    
    // Synchronizace statistik
    const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
    await SupabaseClient.syncData(userId, stats, 'user_stats');
    
    // Aktualizace času poslední synchronizace
    syncConfig.lastSync = new Date().toISOString();
    localStorage.setItem('syncConfig', JSON.stringify(syncConfig));
    
    console.log('Synchronizace dat dokončena');
    
    // Vyvolání události o dokončení synchronizace
    window.dispatchEvent(new CustomEvent('sync-completed', {
      detail: {
        timestamp: syncConfig.lastSync
      }
    }));
    
    return true;
  } catch (error) {
    console.error('Chyba při synchronizaci dat:', error);
    
    // Vyvolání události o chybě synchronizace
    window.dispatchEvent(new CustomEvent('sync-error', {
      detail: {
        error: error.message
      }
    }));
    
    throw error;
  }
}

// Export funkcí
const SyncManager = {
  initSyncManager,
  startAutoSync,
  stopAutoSync,
  syncAllData,
  getConfig: () => syncConfig
};
