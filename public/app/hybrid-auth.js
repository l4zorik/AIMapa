/**
 * Hybridní autentizační modul pro AIMapa
 * Verze 0.3.8.5
 *
 * Tento modul poskytuje hybridní autentizaci pro AIMapa, která automaticky přepíná
 * mezi lokální autentizací a Supabase autentizací podle prostředí, ve kterém aplikace běží.
 */

const HybridAuth = {
    // Stav modulu
    state: {
        isInitialized: false,
        isNetlify: false,
        authProvider: null,
        authListeners: []
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace hybridního autentizačního modulu...');

        // Detekce prostředí
        this.detectEnvironment();

        // Výběr poskytovatele autentizace
        this.selectAuthProvider();

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        this.state.isInitialized = true;
        console.log(`Hybridní autentizační modul byl inicializován (prostředí: ${this.state.isNetlify ? 'Netlify' : 'Lokální'})`);
    },

    // Detekce prostředí
    detectEnvironment() {
        // Kontrola, zda je aplikace spuštěna na Netlify
        if (typeof window !== 'undefined') {
            // Kontrola, zda je v URL parametr netlify=true nebo zda je doména *.netlify.app
            const isNetlifyParam = new URLSearchParams(window.location.search).get('netlify') === 'true';
            const isNetlifyDomain = window.location.hostname.endsWith('.netlify.app');

            this.state.isNetlify = isNetlifyParam || isNetlifyDomain;

            console.log('Detekce Netlify prostředí:', this.state.isNetlify ? 'Ano' : 'Ne');
        } else {
            this.state.isNetlify = false;
            console.log('Detekce Netlify prostředí: Ne (window není definováno)');
        }
    },

    // Výběr poskytovatele autentizace
    selectAuthProvider() {
        if (this.state.isNetlify) {
            // Kontrola, zda je dostupný Supabase modul
            if (typeof window.SupabaseAuth !== 'undefined') {
                console.log('Používám Supabase autentizaci');
                this.state.authProvider = window.SupabaseAuth;
            } else {
                console.error('Supabase autentizace není dostupná, přepínám na lokální autentizaci');
                this.state.authProvider = window.LocalAuth;
            }
        } else {
            // Kontrola, zda je dostupný lokální autentizační modul
            if (typeof window.LocalAuth !== 'undefined') {
                console.log('Používám lokální autentizaci');
                this.state.authProvider = window.LocalAuth;
            } else {
                console.error('Lokální autentizace není dostupná, přepínám na Supabase autentizaci');
                this.state.authProvider = window.SupabaseAuth;
            }
        }

        // Kontrola, zda byl vybrán poskytovatel autentizace
        if (!this.state.authProvider) {
            console.error('Nebyl nalezen žádný poskytovatel autentizace!');
        }
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Přidání posluchače změn stavu autentizace
        if (this.state.authProvider) {
            this.state.authProvider.onAuthStateChange((event) => {
                this.notifyAuthStateChange(event);
            });
        }
    },

    // Registrace nového uživatele
    async signUp(email, password, metadata = {}) {
        console.log('Registrace nového uživatele přes hybridní autentizaci:', email);

        if (!this.state.authProvider) {
            console.error('Není dostupný žádný poskytovatel autentizace');
            return { error: { message: 'Není dostupný žádný poskytovatel autentizace' } };
        }

        return this.state.authProvider.signUp(email, password, metadata);
    },

    // Přihlášení uživatele
    async signIn(email, password) {
        console.log('Přihlašování uživatele přes hybridní autentizaci:', email);

        if (!this.state.authProvider) {
            console.error('Není dostupný žádný poskytovatel autentizace');
            return { error: { message: 'Není dostupný žádný poskytovatel autentizace' } };
        }

        return this.state.authProvider.signIn(email, password);
    },

    // Odhlášení uživatele
    async signOut() {
        console.log('Odhlašování uživatele přes hybridní autentizaci');

        if (!this.state.authProvider) {
            console.error('Není dostupný žádný poskytovatel autentizace');
            return { error: { message: 'Není dostupný žádný poskytovatel autentizace' } };
        }

        return this.state.authProvider.signOut();
    },

    // Získání aktuálního uživatele
    async getUser() {
        if (!this.state.authProvider) {
            console.error('Není dostupný žádný poskytovatel autentizace');
            return { data: { user: null } };
        }

        return this.state.authProvider.getUser();
    },

    // Resetování hesla
    async resetPassword(email) {
        console.log('Resetování hesla pro uživatele přes hybridní autentizaci:', email);

        if (!this.state.authProvider) {
            console.error('Není dostupný žádný poskytovatel autentizace');
            return { error: { message: 'Není dostupný žádný poskytovatel autentizace' } };
        }

        return this.state.authProvider.resetPassword(email);
    },

    // Aktualizace uživatelských dat
    async updateUser(userData) {
        if (!this.state.authProvider) {
            console.error('Není dostupný žádný poskytovatel autentizace');
            return { error: { message: 'Není dostupný žádný poskytovatel autentizace' } };
        }

        return this.state.authProvider.updateUser(userData);
    },

    // Přidání posluchače změn stavu autentizace
    onAuthStateChange(callback) {
        console.log('Přidání posluchače změn stavu autentizace přes hybridní autentizaci');

        // Přidání callbacku do seznamu posluchačů
        this.state.authListeners.push(callback);

        // Vrácení funkce pro odstranění posluchače
        return {
            data: {
                subscription: {
                    unsubscribe: () => {
                        console.log('Odstranění posluchače změn stavu autentizace');
                        const index = this.state.authListeners.indexOf(callback);
                        if (index !== -1) {
                            this.state.authListeners.splice(index, 1);
                        }
                    }
                }
            }
        };
    },

    // Oznámení o změně stavu autentizace
    notifyAuthStateChange(event) {
        console.log('Změna stavu autentizace přes hybridní autentizaci:', event);

        // Volání všech posluchačů
        this.state.authListeners.forEach(callback => {
            try {
                callback(event);
            } catch (error) {
                console.error('Chyba při volání posluchače změn stavu autentizace:', error);
            }
        });
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    HybridAuth.init();
});

// Export modulu
window.HybridAuth = HybridAuth;
