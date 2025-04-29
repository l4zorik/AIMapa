/**
 * Supabase Client pro AIMapa
 * Verze 0.3.8.2
 * 
 * Klientská část pro integraci Supabase s Auth0 autentizací
 */

const SupabaseClient = {
    // Stav modulu
    state: {
        isInitialized: false,
        supabaseUrl: null,
        supabaseKey: null,
        supabaseClient: null,
        currentUser: null
    },

    // Inicializace modulu
    init: async function() {
        console.log('Inicializace Supabase klienta...');

        try {
            // Načtení konfigurace
            await this.loadConfig();

            // Vytvoření Supabase klienta
            this.createClient();

            // Nastavení posluchačů událostí pro autentizaci
            this.setupAuthListeners();

            this.state.isInitialized = true;
            console.log('Supabase klient byl úspěšně inicializován');

            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Supabase klienta:', error);
            return false;
        }
    },

    // Načtení konfigurace
    loadConfig: async function() {
        try {
            // Pokus o načtení konfigurace z window.ENV
            if (window.ENV && window.ENV.SUPABASE_URL && window.ENV.SUPABASE_KEY) {
                this.state.supabaseUrl = window.ENV.SUPABASE_URL;
                this.state.supabaseKey = window.ENV.SUPABASE_KEY;
                console.log('Supabase konfigurace načtena z window.ENV');
                return true;
            }

            // Pokus o načtení konfigurace ze serveru
            const response = await fetch('/env-config.json');
            if (!response.ok) {
                throw new Error('Nepodařilo se načíst konfiguraci ze serveru');
            }

            const config = await response.json();
            
            if (!config.SUPABASE_URL || !config.SUPABASE_KEY) {
                throw new Error('Chybí Supabase konfigurace v odpovědi serveru');
            }

            this.state.supabaseUrl = config.SUPABASE_URL;
            this.state.supabaseKey = config.SUPABASE_KEY;
            console.log('Supabase konfigurace načtena ze serveru');

            return true;
        } catch (error) {
            console.error('Chyba při načítání Supabase konfigurace:', error);
            
            // Použití výchozích hodnot
            this.state.supabaseUrl = 'https://njjhhamwixjbfibywreo.supabase.co';
            this.state.supabaseKey = null; // Veřejný klíč musí být poskytnut
            
            console.warn('Používám výchozí Supabase URL, ale chybí API klíč');
            return false;
        }
    },

    // Vytvoření Supabase klienta
    createClient: function() {
        try {
            if (!this.state.supabaseUrl || !this.state.supabaseKey) {
                console.error('Nelze vytvořit Supabase klienta: Chybí URL nebo API klíč');
                return false;
            }

            // Kontrola, zda je dostupná Supabase knihovna
            if (typeof supabase === 'undefined') {
                console.error('Supabase knihovna není dostupná. Ujistěte se, že je načten skript @supabase/supabase-js.');
                return false;
            }

            // Vytvoření klienta
            this.state.supabaseClient = supabase.createClient(
                this.state.supabaseUrl,
                this.state.supabaseKey
            );

            console.log('Supabase klient byl úspěšně vytvořen');
            return true;
        } catch (error) {
            console.error('Chyba při vytváření Supabase klienta:', error);
            return false;
        }
    },

    // Nastavení posluchačů událostí pro autentizaci
    setupAuthListeners: function() {
        // Posluchač pro změnu stavu autentizace
        document.addEventListener('authStateChanged', async (event) => {
            const { isLoggedIn, user } = event.detail;
            
            if (isLoggedIn && user) {
                console.log('Uživatel přihlášen, synchronizuji s Supabase...');
                await this.syncUserWithSupabase(user);
            } else {
                console.log('Uživatel odhlášen, resetuji stav Supabase klienta');
                this.state.currentUser = null;
            }
        });

        console.log('Posluchače událostí pro autentizaci byly nastaveny');
    },

    // Synchronizace uživatele s Supabase
    syncUserWithSupabase: async function(auth0User) {
        try {
            if (!auth0User || !auth0User.sub) {
                console.error('Nelze synchronizovat uživatele s Supabase: Chybí Auth0 uživatelský objekt nebo sub ID');
                return null;
            }

            console.log('Synchronizace uživatele s Supabase:', auth0User.sub);

            // Volání API endpointu pro synchronizaci
            const response = await fetch('/auth/sync-user');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Nepodařilo se synchronizovat uživatele s Supabase');
            }

            const data = await response.json();
            this.state.currentUser = data.supabase;

            console.log('Uživatel byl úspěšně synchronizován s Supabase:', this.state.currentUser);
            return this.state.currentUser;
        } catch (error) {
            console.error('Chyba při synchronizaci uživatele s Supabase:', error);
            return null;
        }
    },

    // Získání aktuálního uživatele
    getCurrentUser: async function() {
        try {
            // Pokud již máme uživatele, vrátíme ho
            if (this.state.currentUser) {
                return this.state.currentUser;
            }

            // Jinak se pokusíme získat uživatele ze serveru
            const response = await fetch('/api/user-data');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Nepodařilo se získat uživatelská data');
            }

            const userData = await response.json();
            this.state.currentUser = userData;

            return userData;
        } catch (error) {
            console.error('Chyba při získávání aktuálního uživatele:', error);
            return null;
        }
    },

    // Uložení uživatelských dat
    saveUserData: async function(userData) {
        try {
            if (!userData) {
                console.error('Nelze uložit uživatelská data: Chybí data');
                return false;
            }

            // Volání API endpointu pro uložení dat
            const response = await fetch('/api/user-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Nepodařilo se uložit uživatelská data');
            }

            const result = await response.json();
            
            // Aktualizace lokálního stavu
            if (result.success && this.state.currentUser) {
                this.state.currentUser = { ...this.state.currentUser, ...userData };
            }

            return result.success;
        } catch (error) {
            console.error('Chyba při ukládání uživatelských dat:', error);
            return false;
        }
    },

    // Přímý přístup k Supabase klientovi (pro pokročilé použití)
    getClient: function() {
        if (!this.state.supabaseClient) {
            console.error('Supabase klient není inicializován');
            return null;
        }

        return this.state.supabaseClient;
    }
};

// Automatická inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Automatická inicializace Supabase klienta...');
    await SupabaseClient.init();
});
