/**
 * User Profile Management
 * Verze 0.4.1
 * 
 * Skript pro správu uživatelského profilu a synchronizaci s Supabase
 */

// Inicializace modulu
const UserProfile = (function() {
  // Privátní proměnné
  let currentUser = null;
  let userSettings = {};
  
  // Události
  const events = {
    profileLoaded: new CustomEvent('userProfileLoaded'),
    profileUpdated: new CustomEvent('userProfileUpdated'),
    settingsLoaded: new CustomEvent('userSettingsLoaded'),
    settingsUpdated: new CustomEvent('userSettingsUpdated'),
    error: (message) => new CustomEvent('userProfileError', { detail: { message } })
  };
  
  /**
   * Načte uživatelský profil ze serveru
   * @returns {Promise<Object>} Uživatelský profil
   */
  async function loadProfile() {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Chyba při načítání profilu:', error);
        document.dispatchEvent(events.error(`Chyba při načítání profilu: ${error.message || 'Neznámá chyba'}`));
        return null;
      }
      
      currentUser = await response.json();
      console.log('Profil načten:', currentUser);
      document.dispatchEvent(events.profileLoaded);
      
      return currentUser;
    } catch (error) {
      console.error('Neočekávaná chyba při načítání profilu:', error);
      document.dispatchEvent(events.error(`Neočekávaná chyba při načítání profilu: ${error.message}`));
      return null;
    }
  }
  
  /**
   * Aktualizuje uživatelský profil
   * @param {Object} profileData - Data profilu k aktualizaci
   * @returns {Promise<Object>} Aktualizovaný profil
   */
  async function updateProfile(profileData) {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Chyba při aktualizaci profilu:', error);
        document.dispatchEvent(events.error(`Chyba při aktualizaci profilu: ${error.message || 'Neznámá chyba'}`));
        return null;
      }
      
      currentUser = await response.json();
      console.log('Profil aktualizován:', currentUser);
      document.dispatchEvent(events.profileUpdated);
      
      return currentUser;
    } catch (error) {
      console.error('Neočekávaná chyba při aktualizaci profilu:', error);
      document.dispatchEvent(events.error(`Neočekávaná chyba při aktualizaci profilu: ${error.message}`));
      return null;
    }
  }
  
  /**
   * Načte uživatelská nastavení
   * @returns {Promise<Object>} Uživatelská nastavení
   */
  async function loadSettings() {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Chyba při načítání nastavení:', error);
        document.dispatchEvent(events.error(`Chyba při načítání nastavení: ${error.message || 'Neznámá chyba'}`));
        return null;
      }
      
      userSettings = await response.json();
      console.log('Nastavení načtena:', userSettings);
      document.dispatchEvent(events.settingsLoaded);
      
      return userSettings;
    } catch (error) {
      console.error('Neočekávaná chyba při načítání nastavení:', error);
      document.dispatchEvent(events.error(`Neočekávaná chyba při načítání nastavení: ${error.message}`));
      return null;
    }
  }
  
  /**
   * Aktualizuje uživatelská nastavení
   * @param {Object} settingsData - Nastavení k aktualizaci
   * @returns {Promise<Object>} Aktualizovaná nastavení
   */
  async function updateSettings(settingsData) {
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(settingsData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Chyba při aktualizaci nastavení:', error);
        document.dispatchEvent(events.error(`Chyba při aktualizaci nastavení: ${error.message || 'Neznámá chyba'}`));
        return null;
      }
      
      userSettings = await response.json();
      console.log('Nastavení aktualizována:', userSettings);
      document.dispatchEvent(events.settingsUpdated);
      
      return userSettings;
    } catch (error) {
      console.error('Neočekávaná chyba při aktualizaci nastavení:', error);
      document.dispatchEvent(events.error(`Neočekávaná chyba při aktualizaci nastavení: ${error.message}`));
      return null;
    }
  }
  
  /**
   * Získá aktuální uživatelský profil
   * @returns {Object} Uživatelský profil
   */
  function getCurrentUser() {
    return currentUser;
  }
  
  /**
   * Získá aktuální uživatelská nastavení
   * @returns {Object} Uživatelská nastavení
   */
  function getUserSettings() {
    return userSettings;
  }
  
  /**
   * Získá hodnotu nastavení podle klíče
   * @param {string} key - Klíč nastavení
   * @param {*} defaultValue - Výchozí hodnota, pokud nastavení neexistuje
   * @returns {*} Hodnota nastavení nebo výchozí hodnota
   */
  function getSetting(key, defaultValue = null) {
    return userSettings && userSettings[key] !== undefined ? userSettings[key] : defaultValue;
  }
  
  /**
   * Nastaví hodnotu nastavení
   * @param {string} key - Klíč nastavení
   * @param {*} value - Hodnota nastavení
   * @returns {Promise<Object>} Aktualizovaná nastavení
   */
  async function setSetting(key, value) {
    const newSettings = { ...userSettings, [key]: value };
    return await updateSettings({ [key]: value });
  }
  
  /**
   * Inicializuje modul
   * @returns {Promise<void>}
   */
  async function init() {
    // Kontrola, zda je uživatel přihlášen
    try {
      const authResponse = await fetch('/auth/status');
      const authData = await authResponse.json();
      
      if (authData.isAuthenticated) {
        // Načtení profilu a nastavení
        await loadProfile();
        await loadSettings();
      } else {
        console.log('Uživatel není přihlášen, nelze načíst profil');
      }
    } catch (error) {
      console.error('Chyba při inicializaci UserProfile:', error);
    }
  }
  
  // Veřejné API
  return {
    init,
    loadProfile,
    updateProfile,
    loadSettings,
    updateSettings,
    getCurrentUser,
    getUserSettings,
    getSetting,
    setSetting
  };
})();

// Automatická inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
  // Kontrola, zda je k dispozici Auth0
  if (window.Auth0Client) {
    // Počkáme na inicializaci Auth0
    document.addEventListener('auth0Initialized', () => {
      // Inicializace UserProfile
      UserProfile.init();
    });
  } else {
    // Přímá inicializace
    UserProfile.init();
  }
});

// Export modulu
window.UserProfile = UserProfile;
