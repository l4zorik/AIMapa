/**
 * Vylepšený Supabase klient pro AIMapa
 * Verze 0.3.8.5
 * 
 * Tento modul poskytuje rozhraní pro komunikaci se Supabase databází
 * a integraci s Auth0 autentizací.
 */

const SupabaseClient = {
    // Stav modulu
    state: {
        isInitialized: false,
        isLoggedIn: false,
        currentUser: null,
        client: null,
        authListeners: []
    },

    // Konfigurace
    config: {
        supabaseUrl: 'https://njjhhamwixjbfibywreo.supabase.co',
        supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhoYW13aXhqYmZpYnl3cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzU5MTAsImV4cCI6MjA2MTM1MTkxMH0.8iei6QFMk18dLYoQIkJ63rEbDV_38TtSITmmRGRjoAY',
        debug: true
    },

    /**
     * Inicializace modulu
     */
    init() {
        console.log('Inicializace Supabase klienta...');

        try {
            // Kontrola, zda je Supabase dostupný
            if (typeof supabase === 'undefined') {
                console.log('Supabase není dostupný, načítám skript...');
                this.loadSupabaseScript()
                    .then(() => {
                        this.initClient();
                    })
                    .catch((error) => {
                        console.error('Chyba při načítání Supabase skriptu:', error);
                    });
            } else {
                this.initClient();
            }

            // Nastavení posluchačů událostí
            this.setupEventListeners();

            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Supabase klienta:', error);
            return false;
        }
    },

    /**
     * Načtení Supabase skriptu
     */
    loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.async = true;
            
            script.onload = () => {
                console.log('Supabase skript byl úspěšně načten');
                resolve();
            };
            
            script.onerror = (error) => {
                console.error('Chyba při načítání Supabase skriptu:', error);
                reject(error);
            };
            
            document.head.appendChild(script);
        });
    },

    /**
     * Inicializace Supabase klienta
     */
    initClient() {
        try {
            // Vytvoření Supabase klienta
            this.state.client = supabase.createClient(
                this.config.supabaseUrl,
                this.config.supabaseAnonKey
            );

            console.log('Supabase klient byl úspěšně inicializován');
            this.state.isInitialized = true;

            // Kontrola, zda je uživatel přihlášen
            this.checkCurrentUser();

            // Nastavení posluchače pro změny autentizace
            this.state.client.auth.onAuthStateChange((event, session) => {
                console.log('Supabase auth state change:', event, session);
                
                if (event === 'SIGNED_IN' && session) {
                    this.state.isLoggedIn = true;
                    this.state.currentUser = session.user;
                    this.notifyAuthStateChange();
                } else if (event === 'SIGNED_OUT') {
                    this.state.isLoggedIn = false;
                    this.state.currentUser = null;
                    this.notifyAuthStateChange();
                }
            });

            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Supabase klienta:', error);
            return false;
        }
    },

    /**
     * Nastavení posluchačů událostí
     */
    setupEventListeners() {
        // Posluchač pro změnu stavu autentizace v Auth0
        document.addEventListener('auth0StateChanged', async (event) => {
            console.log('Zachycena událost auth0StateChanged v Supabase klientu:', event.detail);
            
            if (event.detail.isLoggedIn && event.detail.user) {
                // Přihlášení do Supabase pomocí Auth0 tokenu
                await this.signInWithAuth0(event.detail.user);
            } else {
                // Odhlášení ze Supabase
                await this.signOut();
            }
        });
    },

    /**
     * Kontrola, zda je uživatel přihlášen
     */
    async checkCurrentUser() {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Získání aktuální session
            const { data: { session }, error } = await this.state.client.auth.getSession();

            if (error) {
                console.error('Chyba při kontrole přihlášení uživatele:', error);
                this.state.isLoggedIn = false;
                this.state.currentUser = null;
                return { success: false, error: error.message };
            }

            if (session) {
                this.state.isLoggedIn = true;
                this.state.currentUser = session.user;
                console.log('Uživatel je přihlášen v Supabase:', session.user);
                return { success: true, user: session.user };
            } else {
                this.state.isLoggedIn = false;
                this.state.currentUser = null;
                console.log('Uživatel není přihlášen v Supabase');
                return { success: false };
            }
        } catch (error) {
            console.error('Chyba při kontrole přihlášení uživatele:', error);
            this.state.isLoggedIn = false;
            this.state.currentUser = null;
            return { success: false, error: error.message };
        }
    },

    /**
     * Přihlášení pomocí emailu a hesla
     * @param {string} email - Email uživatele
     * @param {string} password - Heslo uživatele
     */
    async signIn(email, password) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Přihlášení pomocí emailu a hesla
            const { data: { user, session }, error } = await this.state.client.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                console.error('Chyba při přihlašování uživatele:', error);
                return { success: false, error: error.message };
            }

            // Aktualizace stavu
            this.state.isLoggedIn = true;
            this.state.currentUser = user;

            // Vyvolání události o změně stavu autentizace
            this.notifyAuthStateChange();

            console.log('Uživatel byl úspěšně přihlášen v Supabase:', user);
            return { success: true, user, session };
        } catch (error) {
            console.error('Chyba při přihlašování uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Přihlášení pomocí Auth0 tokenu
     * @param {object} auth0User - Uživatel z Auth0
     */
    async signInWithAuth0(auth0User) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Kontrola, zda máme Auth0 uživatele
            if (!auth0User || !auth0User.sub) {
                console.error('Chybí Auth0 uživatel');
                return { success: false, error: 'Chybí Auth0 uživatel' };
            }

            // Získání Auth0 tokenu
            let auth0Token = null;
            if (typeof Auth0Auth !== 'undefined') {
                auth0Token = await Auth0Auth.getToken();
            }

            if (!auth0Token) {
                console.error('Nepodařilo se získat Auth0 token');
                return { success: false, error: 'Nepodařilo se získat Auth0 token' };
            }

            // Přihlášení pomocí vlastního JWT tokenu
            const { data: { user, session }, error } = await this.state.client.auth.signInWithIdToken({
                provider: 'auth0',
                token: auth0Token,
                nonce: 'auth0-nonce'
            });

            if (error) {
                console.error('Chyba při přihlašování pomocí Auth0 tokenu:', error);
                
                // Pokud se nepodařilo přihlásit pomocí tokenu, zkusíme vytvořit uživatele v Supabase
                return await this.createUserFromAuth0(auth0User);
            }

            // Aktualizace stavu
            this.state.isLoggedIn = true;
            this.state.currentUser = user;

            // Vyvolání události o změně stavu autentizace
            this.notifyAuthStateChange();

            console.log('Uživatel byl úspěšně přihlášen v Supabase pomocí Auth0:', user);
            return { success: true, user, session };
        } catch (error) {
            console.error('Chyba při přihlašování pomocí Auth0 tokenu:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Vytvoření uživatele v Supabase z Auth0 uživatele
     * @param {object} auth0User - Uživatel z Auth0
     */
    async createUserFromAuth0(auth0User) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Kontrola, zda máme Auth0 uživatele
            if (!auth0User || !auth0User.sub || !auth0User.email) {
                console.error('Chybí Auth0 uživatel nebo email');
                return { success: false, error: 'Chybí Auth0 uživatel nebo email' };
            }

            // Generování náhodného hesla
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);

            // Vytvoření uživatele v Supabase
            const { data: { user, session }, error } = await this.state.client.auth.signUp({
                email: auth0User.email,
                password: randomPassword,
                options: {
                    data: {
                        auth0_id: auth0User.sub,
                        username: auth0User.nickname || auth0User.name || auth0User.email.split('@')[0],
                        avatar_url: auth0User.picture || 'https://via.placeholder.com/150'
                    }
                }
            });

            if (error) {
                console.error('Chyba při vytváření uživatele v Supabase:', error);
                return { success: false, error: error.message };
            }

            // Aktualizace stavu
            this.state.isLoggedIn = true;
            this.state.currentUser = user;

            // Vyvolání události o změně stavu autentizace
            this.notifyAuthStateChange();

            console.log('Uživatel byl úspěšně vytvořen v Supabase z Auth0:', user);
            return { success: true, user, session };
        } catch (error) {
            console.error('Chyba při vytváření uživatele v Supabase z Auth0:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Registrace nového uživatele
     * @param {string} email - Email uživatele
     * @param {string} password - Heslo uživatele
     * @param {string} username - Uživatelské jméno
     * @param {object} metadata - Další metadata uživatele
     */
    async signUp(email, password, username, metadata = {}) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Registrace nového uživatele
            const { data: { user, session }, error } = await this.state.client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        ...metadata
                    }
                }
            });

            if (error) {
                console.error('Chyba při registraci uživatele:', error);
                return { success: false, error: error.message };
            }

            // Aktualizace stavu
            this.state.isLoggedIn = true;
            this.state.currentUser = user;

            // Vyvolání události o změně stavu autentizace
            this.notifyAuthStateChange();

            // Vytvoření záznamu v tabulce users
            const { error: insertError } = await this.state.client
                .from('users')
                .insert([{
                    id: user.id,
                    email: user.email,
                    username: username,
                    level: 1,
                    xp: 0,
                    xp_to_next_level: 100,
                    balance: 500,
                    currency: 'CZK',
                    bitcoin: 0.05,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }]);

            if (insertError) {
                console.error('Chyba při vytváření záznamu v tabulce users:', insertError);
            }

            // Vytvoření záznamu v tabulce user_stats
            const { error: statsError } = await this.state.client
                .from('user_stats')
                .insert([{ user_id: user.id }]);

            if (statsError) {
                console.error('Chyba při vytváření záznamu v tabulce user_stats:', statsError);
            }

            // Vytvoření záznamu v tabulce user_settings
            const { error: settingsError } = await this.state.client
                .from('user_settings')
                .insert([{ user_id: user.id }]);

            if (settingsError) {
                console.error('Chyba při vytváření záznamu v tabulce user_settings:', settingsError);
            }

            console.log('Uživatel byl úspěšně zaregistrován v Supabase:', user);
            return { success: true, user, session };
        } catch (error) {
            console.error('Chyba při registraci uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Odhlášení uživatele
     */
    async signOut() {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Odhlášení uživatele
            const { error } = await this.state.client.auth.signOut();

            if (error) {
                console.error('Chyba při odhlašování uživatele:', error);
                return { success: false, error: error.message };
            }

            // Aktualizace stavu
            this.state.isLoggedIn = false;
            this.state.currentUser = null;

            // Vyvolání události o změně stavu autentizace
            this.notifyAuthStateChange();

            console.log('Uživatel byl úspěšně odhlášen ze Supabase');
            return { success: true };
        } catch (error) {
            console.error('Chyba při odhlašování uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Získání aktuálního uživatele
     */
    async getCurrentUser() {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Získání aktuálního uživatele
            const { data: { user }, error } = await this.state.client.auth.getUser();

            if (error) {
                console.error('Chyba při získávání aktuálního uživatele:', error);
                return { success: false, error: error.message };
            }

            if (user) {
                this.state.isLoggedIn = true;
                this.state.currentUser = user;
                return { success: true, user };
            } else {
                this.state.isLoggedIn = false;
                this.state.currentUser = null;
                return { success: false };
            }
        } catch (error) {
            console.error('Chyba při získávání aktuálního uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Získání profilu uživatele
     * @param {string} userId - ID uživatele
     */
    async getUserProfile(userId) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Získání profilu uživatele
            const { data, error } = await this.state.client
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Chyba při získávání profilu uživatele:', error);
                return { success: false, error: error.message };
            }

            return { success: true, profile: data };
        } catch (error) {
            console.error('Chyba při získávání profilu uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Aktualizace profilu uživatele
     * @param {string} userId - ID uživatele
     * @param {object} profileData - Data profilu
     */
    async updateUserProfile(userId, profileData) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Aktualizace profilu uživatele
            const { data, error } = await this.state.client
                .from('users')
                .update({
                    ...profileData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                console.error('Chyba při aktualizaci profilu uživatele:', error);
                return { success: false, error: error.message };
            }

            return { success: true, profile: data };
        } catch (error) {
            console.error('Chyba při aktualizaci profilu uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Získání statistik uživatele
     * @param {string} userId - ID uživatele
     */
    async getUserStats(userId) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Získání statistik uživatele
            const { data, error } = await this.state.client
                .from('user_stats')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error('Chyba při získávání statistik uživatele:', error);
                return { success: false, error: error.message };
            }

            return { success: true, stats: data };
        } catch (error) {
            console.error('Chyba při získávání statistik uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Aktualizace statistik uživatele
     * @param {string} userId - ID uživatele
     * @param {object} statsData - Data statistik
     */
    async updateUserStats(userId, statsData) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Aktualizace statistik uživatele
            const { data, error } = await this.state.client
                .from('user_stats')
                .update({
                    ...statsData,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (error) {
                console.error('Chyba při aktualizaci statistik uživatele:', error);
                return { success: false, error: error.message };
            }

            return { success: true, stats: data };
        } catch (error) {
            console.error('Chyba při aktualizaci statistik uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Získání nastavení uživatele
     * @param {string} userId - ID uživatele
     */
    async getUserSettings(userId) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Získání nastavení uživatele
            const { data, error } = await this.state.client
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) {
                console.error('Chyba při získávání nastavení uživatele:', error);
                return { success: false, error: error.message };
            }

            return { success: true, settings: data };
        } catch (error) {
            console.error('Chyba při získávání nastavení uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Aktualizace nastavení uživatele
     * @param {string} userId - ID uživatele
     * @param {object} settingsData - Data nastavení
     */
    async updateUserSettings(userId, settingsData) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Aktualizace nastavení uživatele
            const { data, error } = await this.state.client
                .from('user_settings')
                .update({
                    ...settingsData,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (error) {
                console.error('Chyba při aktualizaci nastavení uživatele:', error);
                return { success: false, error: error.message };
            }

            return { success: true, settings: data };
        } catch (error) {
            console.error('Chyba při aktualizaci nastavení uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Získání achievementů uživatele
     * @param {string} userId - ID uživatele
     */
    async getUserAchievements(userId) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Získání achievementů uživatele
            const { data, error } = await this.state.client
                .from('user_achievements')
                .select('*')
                .eq('user_id', userId);

            if (error) {
                console.error('Chyba při získávání achievementů uživatele:', error);
                return { success: false, error: error.message };
            }

            return { success: true, achievements: data };
        } catch (error) {
            console.error('Chyba při získávání achievementů uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Přidání achievementu uživateli
     * @param {string} userId - ID uživatele
     * @param {string} achievementId - ID achievementu
     * @param {string} achievementName - Název achievementu
     * @param {string} achievementDescription - Popis achievementu
     */
    async addUserAchievement(userId, achievementId, achievementName, achievementDescription) {
        try {
            // Kontrola, zda je klient inicializován
            if (!this.state.isInitialized || !this.state.client) {
                console.error('Supabase klient není inicializován');
                return { success: false, error: 'Supabase klient není inicializován' };
            }

            // Přidání achievementu uživateli
            const { data, error } = await this.state.client
                .from('user_achievements')
                .insert([{
                    user_id: userId,
                    achievement_id: achievementId,
                    achievement_name: achievementName,
                    achievement_description: achievementDescription,
                    unlocked_at: new Date().toISOString()
                }]);

            if (error) {
                console.error('Chyba při přidávání achievementu uživateli:', error);
                return { success: false, error: error.message };
            }

            return { success: true, achievement: data };
        } catch (error) {
            console.error('Chyba při přidávání achievementu uživateli:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Oznámení o změně stavu autentizace
     */
    notifyAuthStateChange() {
        document.dispatchEvent(new CustomEvent('supabaseStateChanged', {
            detail: {
                isLoggedIn: this.state.isLoggedIn,
                user: this.state.currentUser
            }
        }));
    },

    /**
     * Získání Supabase klienta
     */
    getClient() {
        return this.state.client;
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace modulu
    SupabaseClient.init();
});

// Export modulu
window.SupabaseClient = SupabaseClient;
