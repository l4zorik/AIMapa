/**
 * Auth0 klient pro klientskou část aplikace
 * Verze 0.3.8.7
 */

// Auth0 konfigurace
let auth0Config = null;

// Inicializace Auth0 klienta
async function initAuth0Client() {
  try {
    // Získání konfigurace z API
    const response = await fetch('/auth/config');
    
    if (!response.ok) {
      throw new Error('Nepodařilo se získat konfiguraci Auth0');
    }
    
    auth0Config = await response.json();
    
    console.log('Auth0 klient byl inicializován');
    
    return auth0Config;
  } catch (error) {
    console.error('Chyba při inicializaci Auth0 klienta:', error);
    throw error;
  }
}

// Kontrola, zda je uživatel přihlášen
async function isAuthenticated() {
  try {
    const response = await fetch('/auth/status');
    
    if (!response.ok) {
      return false;
    }
    
    const status = await response.json();
    
    return status.isAuthenticated;
  } catch (error) {
    console.error('Chyba při kontrole přihlášení:', error);
    return false;
  }
}

// Přihlášení uživatele
function login(returnTo = window.location.pathname) {
  window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
}

// Odhlášení uživatele
function logout(returnTo = window.location.origin) {
  window.location.href = `/logout?returnTo=${encodeURIComponent(returnTo)}`;
}

// Získání profilu uživatele
async function getUserProfile() {
  try {
    const response = await fetch('/api/user/profile');
    
    if (!response.ok) {
      throw new Error('Nepodařilo se získat profil uživatele');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Chyba při získávání profilu uživatele:', error);
    throw error;
  }
}

// Export funkcí
const Auth0Client = {
  initAuth0Client,
  isAuthenticated,
  login,
  logout,
  getUserProfile
};
