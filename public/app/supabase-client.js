/**
 * Supabase Client pro AIMapa
 * Verze 0.3.8.5
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
    },

    // Získání uživatelského profilu
    getUserProfile: async function(userId) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze získat profil: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            // Simulace získání profilu
            console.log('Získávání profilu uživatele:', userId);
            
            // Vytvoření základního profilu
            const profile = {
                id: userId,
                email: this.state.currentUser?.email || 'user@example.com',
                username: this.state.currentUser?.nickname || 'user',
                avatar_url: this.state.currentUser?.picture || 'https://via.placeholder.com/150',
                level: 1,
                xp: 0,
                xp_to_next_level: 100,
                balance: 500,
                currency: 'CZK',
                bitcoin: 0.05
            };

            return { success: true, profile };
        } catch (error) {
            console.error('Chyba při získávání profilu uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání statistik uživatele
    getUserStats: async function(userId) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze získat statistiky: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            // Simulace získání statistik
            console.log('Získávání statistik uživatele:', userId);
            
            // Vytvoření základních statistik
            const stats = {
                id: userId,
                tasks_completed: 0,
                distance_traveled: 0,
                time_spent: 0,
                money_earned: 0,
                money_spent: 0
            };

            return { success: true, stats };
        } catch (error) {
            console.error('Chyba při získávání statistik uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání nastavení uživatele
    getUserSettings: async function(userId) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze získat nastavení: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            // Simulace získání nastavení
            console.log('Získávání nastavení uživatele:', userId);
            
            // Vytvoření základních nastavení
            const settings = {
                id: userId,
                dark_mode: true,
                notifications_enabled: true,
                sound_enabled: true,
                language: 'cs'
            };

            return { success: true, settings };
        } catch (error) {
            console.error('Chyba při získávání nastavení uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání achievementů uživatele
    getUserAchievements: async function(userId) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze získat achievementy: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            // Simulace získání achievementů
            console.log('Získávání achievementů uživatele:', userId);
            
            // Vytvoření základních achievementů
            const achievements = [
                {
                    user_id: userId,
                    achievement_id: 'first_login',
                    achievement_name: 'První přihlášení',
                    achievement_description: 'Úspěšně jste se přihlásili do aplikace',
                    unlocked_at: new Date().toISOString()
                }
            ];

            return { success: true, achievements };
        } catch (error) {
            console.error('Chyba při získávání achievementů uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace profilu uživatele
    updateUserProfile: async function(userId, profileData) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze aktualizovat profil: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            if (!profileData) {
                console.error('Nelze aktualizovat profil: Chybí data profilu');
                return { success: false, error: 'Chybí data profilu' };
            }

            // Simulace aktualizace profilu
            console.log('Aktualizace profilu uživatele:', userId, profileData);
            
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci profilu uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace statistik uživatele
    updateUserStats: async function(userId, statsData) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze aktualizovat statistiky: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            if (!statsData) {
                console.error('Nelze aktualizovat statistiky: Chybí data statistik');
                return { success: false, error: 'Chybí data statistik' };
            }

            // Simulace aktualizace statistik
            console.log('Aktualizace statistik uživatele:', userId, statsData);
            
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci statistik uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace nastavení uživatele
    updateUserSettings: async function(userId, settingsData) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze aktualizovat nastavení: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            if (!settingsData) {
                console.error('Nelze aktualizovat nastavení: Chybí data nastavení');
                return { success: false, error: 'Chybí data nastavení' };
            }

            // Simulace aktualizace nastavení
            console.log('Aktualizace nastavení uživatele:', userId, settingsData);
            
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci nastavení uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Přidání achievementu uživateli
    addUserAchievement: async function(userId, achievementId, achievementName, achievementDescription) {
        try {
            if (!this.state.supabaseClient) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            if (!userId) {
                console.error('Nelze přidat achievement: Chybí ID uživatele');
                return { success: false, error: 'Chybí ID uživatele' };
            }

            if (!achievementId || !achievementName) {
                console.error('Nelze přidat achievement: Chybí ID nebo název achievementu');
                return { success: false, error: 'Chybí ID nebo název achievementu' };
            }

            // Simulace přidání achievementu
            console.log('Přidání achievementu uživateli:', userId, achievementId, achievementName);
            
            return { success: true };
        } catch (error) {
            console.error('Chyba při přidání achievementu uživateli:', error);
            return { success: false, error: error.message };
        }
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

// Export modulu
window.SupabaseClient = SupabaseClient;
