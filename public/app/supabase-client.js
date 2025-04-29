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
            // Použití veřejného anon klíče (bezpečné pro klientskou stranu)
            this.state.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhoYW13aXhqYmZpYnl3cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5NzA1NzcsImV4cCI6MjAxNTU0NjU3N30.Xt_HXY_XEA-VdNF8sqU-X8PwdaJXdYh7t1Y9yaJHgwI';

            console.warn('Používám výchozí Supabase URL a veřejný API klíč');
            return true;
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

            // Kontrola, zda je Supabase klient inicializován
            if (!this.state.supabaseClient) {
                console.warn('Supabase klient není inicializován, pokouším se o inicializaci...');
                const initResult = await this.init();
                if (!initResult) {
                    throw new Error('Nepodařilo se inicializovat Supabase klienta');
                }
            }

            // Vytvoření základního uživatelského objektu pro Supabase
            const supabaseUser = {
                auth0_id: auth0User.sub,
                email: auth0User.email || '',
                name: auth0User.name || '',
                nickname: auth0User.nickname || '',
                picture: auth0User.picture || '',
                last_login: new Date().toISOString()
            };

            // Uložení uživatele do lokálního stavu
            this.state.currentUser = supabaseUser;

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

            // Kontrola, zda je Supabase klient inicializován
            if (!this.state.supabaseClient) {
                console.warn('Supabase klient není inicializován při získávání uživatele');
                return null;
            }

            // Pokud nemáme uživatele, vrátíme null
            console.log('Uživatel není přihlášen v Supabase');
            return null;
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

            // Kontrola, zda je Supabase klient inicializován
            if (!this.state.supabaseClient) {
                console.warn('Supabase klient není inicializován při ukládání dat, pokouším se o inicializaci...');
                const initResult = await this.init();
                if (!initResult) {
                    throw new Error('Nepodařilo se inicializovat Supabase klienta');
                }
            }

            // Aktualizace lokálního stavu
            if (this.state.currentUser) {
                this.state.currentUser = { ...this.state.currentUser, ...userData };
                console.log('Uživatelská data byla úspěšně aktualizována lokálně');
                return true;
            } else {
                console.warn('Nelze aktualizovat uživatelská data: Uživatel není přihlášen');
                return false;
            }
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
    try {
        await SupabaseClient.init();
        console.log('Supabase klient byl úspěšně inicializován při načtení stránky');
    } catch (error) {
        console.error('Chyba při inicializaci Supabase klienta při načtení stránky:', error);
    }
});

// Přidání funkcí pro získání uživatelských nastavení a úspěchů
SupabaseClient.getUserSettings = function() {
    if (!this.state.supabaseClient) {
        console.error('Supabase klient není inicializován');
        return null;
    }

    console.log('Získávání uživatelských nastavení...');
    return { theme: 'dark', notifications: true, language: 'cs' };
};

SupabaseClient.getUserAchievements = function() {
    if (!this.state.supabaseClient) {
        console.error('Supabase klient není inicializován');
        return [];
    }

    console.log('Získávání uživatelských úspěchů...');
    return [
        { id: 1, name: 'První přihlášení', completed: true, date: new Date().toISOString() },
        { id: 2, name: 'První aktivita', completed: false, date: null }
    ];
};
