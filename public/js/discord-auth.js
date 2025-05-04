/**
 * Discord Authentication Client
 * Verze 0.4.0
 */

// Discord Auth klient
const DiscordAuth = {
    // Konfigurace
    config: {
        clientId: null,
        callbackUrl: null,
        baseUrl: window.location.origin
    },

    // Stav autentizace
    state: {
        isAuthenticated: false,
        user: null,
        isLoading: true,
        error: null
    },

    // Inicializace
    async init() {
        try {
            console.log('Inicializace Discord Auth klienta...');
            
            // Načtení konfigurace ze serveru
            await this.loadConfig();
            
            // Kontrola stavu autentizace
            await this.checkAuthStatus();
            
            console.log('Discord Auth klient byl inicializován');
            
            // Vyvolání události o inicializaci
            document.dispatchEvent(new CustomEvent('discordAuthInitialized'));
            
            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Discord Auth klienta:', error);
            this.state.error = error.message;
            this.state.isLoading = false;
            
            // Vyvolání události o chybě
            document.dispatchEvent(new CustomEvent('discordAuthError', { detail: error }));
            
            return false;
        }
    },

    // Načtení konfigurace ze serveru
    async loadConfig() {
        try {
            const response = await fetch('/auth/discord/config');
            
            if (!response.ok) {
                throw new Error(`Chyba při načítání konfigurace: ${response.status} ${response.statusText}`);
            }
            
            const config = await response.json();
            
            // Uložení konfigurace
            this.config.clientId = config.clientId;
            this.config.callbackUrl = config.callbackUrl;
            
            console.log('Discord konfigurace úspěšně načtena');
            
            return config;
        } catch (error) {
            console.error('Chyba při načítání Discord konfigurace:', error);
            throw error;
        }
    },

    // Kontrola stavu autentizace
    async checkAuthStatus() {
        try {
            const response = await fetch('/auth/discord/status');
            
            if (!response.ok) {
                throw new Error(`Chyba při kontrole stavu autentizace: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Uložení stavu autentizace
            this.state.isAuthenticated = data.isAuthenticated;
            this.state.user = data.user;
            this.state.isLoading = false;
            
            console.log('Stav autentizace:', this.state.isAuthenticated ? 'Přihlášen' : 'Nepřihlášen');
            
            // Vyvolání události o změně stavu autentizace
            document.dispatchEvent(new CustomEvent('discordAuthStateChanged', { 
                detail: { 
                    isAuthenticated: this.state.isAuthenticated,
                    user: this.state.user
                } 
            }));
            
            return data;
        } catch (error) {
            console.error('Chyba při kontrole stavu autentizace:', error);
            this.state.isLoading = false;
            this.state.error = error.message;
            
            // Vyvolání události o chybě
            document.dispatchEvent(new CustomEvent('discordAuthError', { detail: error }));
            
            throw error;
        }
    },

    // Přihlášení
    login(returnTo = window.location.pathname) {
        // Přesměrování na Discord přihlašovací stránku
        window.location.href = `/auth/discord/login?returnTo=${encodeURIComponent(returnTo)}`;
    },

    // Odhlášení
    logout(returnTo = window.location.pathname) {
        // Přesměrování na odhlašovací endpoint
        window.location.href = `/auth/discord/logout?returnTo=${encodeURIComponent(returnTo)}`;
    },

    // Získání uživatelského profilu
    getUserProfile() {
        return this.state.user;
    },

    // Kontrola, zda je uživatel přihlášen
    isAuthenticated() {
        return this.state.isAuthenticated;
    },

    // Kontrola, zda má uživatel požadovanou roli
    hasRole(role) {
        if (!this.state.isAuthenticated || !this.state.user) {
            return false;
        }
        
        const userRoles = this.state.user.roles || [];
        return userRoles.includes(role);
    }
};

// Automatická inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    DiscordAuth.init();
});

// Export pro použití v jiných modulech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscordAuth;
} else {
    window.DiscordAuth = DiscordAuth;
}
