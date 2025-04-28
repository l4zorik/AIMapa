/**
 * Jednotný autentizační modul pro AIMapa
 * Verze 0.3.8.5
 *
 * Tento modul poskytuje jednotné rozhraní pro autentizaci uživatelů
 * s podporou Auth0 a Supabase. Automaticky synchronizuje uživatelská data
 * mezi oběma systémy.
 */

const AuthService = {
    // Stav modulu
    state: {
        isInitialized: false,
        isLoggedIn: false,
        currentUser: null,
        authProvider: null,
        authListeners: [],
        loginInProgress: false,
        registrationInProgress: false
    },

    // Konfigurace
    config: {
        // Auth0 konfigurace
        auth0: {
            domain: 'dev-zxj8pir0moo4pdk7.us.auth0.com',
            clientId: 'TKzCgYPmkETVCBjC3418MgKDJY60rppl',
            redirectUri: window.location.origin,
            // Přidání podpory pro vývojovou verzi na Netlify
            netlifyDevRedirectUri: 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app',
            // Lokální vývojové prostředí
            localDevRedirectUri: 'http://localhost:3000',
            audience: 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/',
            scope: 'openid profile email read:users read:user_idp_tokens'
        },

        // Supabase konfigurace
        supabase: {
            url: 'https://njjhhamwixjbfibywreo.supabase.co',
            anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhoYW13aXhqYmZpYnl3cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzU5MTAsImV4cCI6MjA2MTM1MTkxMH0.8iei6QFMk18dLYoQIkJ63rEbDV_38TtSITmmRGRjoAY'
        },

        // Obecná konfigurace
        preferredProvider: 'auth0', // 'auth0' nebo 'supabase'
        debug: true,
        autoLogin: false
    },

    /**
     * Inicializace modulu
     */
    async init() {
        console.log('Inicializace jednotného autentizačního modulu...');

        try {
            // Načtení konfigurace ze serveru
            await this.loadConfig();

            // Inicializace poskytovatelů autentizace
            await this.initAuthProviders();

            // Kontrola, zda je uživatel přihlášen
            await this.checkCurrentUser();

            // Nastavení posluchačů událostí
            this.setupEventListeners();

            this.state.isInitialized = true;
            console.log('Jednotný autentizační modul byl úspěšně inicializován');

            // Automatické přihlášení, pokud je povoleno
            if (this.config.autoLogin && !this.state.isLoggedIn) {
                console.log('Automatické přihlášení je povoleno, přesměrovávám na přihlašovací stránku...');
                setTimeout(() => {
                    this.login();
                }, 1000);
            }

            return true;
        } catch (error) {
            console.error('Chyba při inicializaci jednotného autentizačního modulu:', error);
            return false;
        }
    },

    /**
     * Načtení konfigurace ze serveru
     */
    async loadConfig() {
        try {
            const response = await fetch('/auth/config');
            if (!response.ok) {
                console.warn('Nepodařilo se načíst konfiguraci autentizace ze serveru, používám výchozí hodnoty');
                return false;
            }

            const config = await response.json();

            // Aktualizace Auth0 konfigurace
            if (config.auth0) {
                this.config.auth0.domain = config.auth0.domain || this.config.auth0.domain;
                this.config.auth0.clientId = config.auth0.clientId || this.config.auth0.clientId;
                this.config.auth0.audience = config.auth0.audience || this.config.auth0.audience;
                this.config.auth0.scope = config.auth0.scope || this.config.auth0.scope;
            }

            // Aktualizace Supabase konfigurace
            if (config.supabase) {
                this.config.supabase.url = config.supabase.url || this.config.supabase.url;
                this.config.supabase.anonKey = config.supabase.anonKey || this.config.supabase.anonKey;
            }

            // Aktualizace obecné konfigurace
            if (config.preferredProvider) {
                this.config.preferredProvider = config.preferredProvider;
            }

            console.log('Konfigurace autentizace byla načtena ze serveru');
            return true;
        } catch (error) {
            console.error('Chyba při načítání konfigurace autentizace:', error);
            return false;
        }
    },

    /**
     * Inicializace poskytovatelů autentizace
     */
    async initAuthProviders() {
        // Inicializace Auth0
        if (typeof Auth0Auth !== 'undefined') {
            console.log('Inicializace Auth0 poskytovatele...');
            try {
                // Předání konfigurace do Auth0Auth
                Auth0Auth.config.domain = this.config.auth0.domain;
                Auth0Auth.config.clientId = this.config.auth0.clientId;
                Auth0Auth.config.audience = this.config.auth0.audience;
                Auth0Auth.config.scope = this.config.auth0.scope;

                // Inicializace Auth0Auth
                await Auth0Auth.init();
                console.log('Auth0 poskytovatel byl úspěšně inicializován');
            } catch (error) {
                console.error('Chyba při inicializaci Auth0 poskytovatele:', error);
            }
        } else {
            console.warn('Auth0Auth není dostupný');
        }

        // Inicializace Supabase
        if (typeof SupabaseClient !== 'undefined') {
            console.log('Inicializace Supabase poskytovatele...');
            try {
                // Předání konfigurace do SupabaseClient
                SupabaseClient.config.supabaseUrl = this.config.supabase.url;
                SupabaseClient.config.supabaseAnonKey = this.config.supabase.anonKey;

                // Inicializace SupabaseClient
                SupabaseClient.init();
                console.log('Supabase poskytovatel byl úspěšně inicializován');
            } catch (error) {
                console.error('Chyba při inicializaci Supabase poskytovatele:', error);
            }
        } else {
            console.warn('SupabaseClient není dostupný');
        }

        // Výběr preferovaného poskytovatele
        this.selectPreferredProvider();
    },

    /**
     * Výběr preferovaného poskytovatele autentizace
     */
    selectPreferredProvider() {
        if (this.config.preferredProvider === 'auth0' && typeof Auth0Auth !== 'undefined') {
            this.state.authProvider = Auth0Auth;
            console.log('Vybrán Auth0 jako preferovaný poskytovatel autentizace');
        } else if (this.config.preferredProvider === 'supabase' && typeof SupabaseClient !== 'undefined') {
            this.state.authProvider = SupabaseClient;
            console.log('Vybrán Supabase jako preferovaný poskytovatel autentizace');
        } else {
            // Fallback na dostupného poskytovatele
            if (typeof Auth0Auth !== 'undefined') {
                this.state.authProvider = Auth0Auth;
                console.log('Vybrán Auth0 jako fallback poskytovatel autentizace');
            } else if (typeof SupabaseClient !== 'undefined') {
                this.state.authProvider = SupabaseClient;
                console.log('Vybrán Supabase jako fallback poskytovatel autentizace');
            } else {
                console.error('Žádný poskytovatel autentizace není dostupný!');
                this.state.authProvider = null;
            }
        }
    },

    /**
     * Nastavení posluchačů událostí
     */
    setupEventListeners() {
        // Posluchač pro Auth0 změny stavu autentizace
        if (typeof Auth0Auth !== 'undefined') {
            document.addEventListener('auth0StateChanged', (event) => {
                console.log('Zachycena událost auth0StateChanged:', event.detail);
                this.handleAuthStateChange('auth0', event.detail);
            });
        }

        // Posluchač pro Supabase změny stavu autentizace
        if (typeof SupabaseClient !== 'undefined' && typeof SupabaseAuth !== 'undefined') {
            document.addEventListener('supabaseStateChanged', (event) => {
                console.log('Zachycena událost supabaseStateChanged:', event.detail);
                this.handleAuthStateChange('supabase', event.detail);
            });
        }
    },

    /**
     * Zpracování změny stavu autentizace
     * @param {string} provider - Poskytovatel autentizace ('auth0' nebo 'supabase')
     * @param {object} authState - Stav autentizace
     */
    async handleAuthStateChange(provider, authState) {
        console.log(`Zpracování změny stavu autentizace od poskytovatele ${provider}:`, authState);

        // Aktualizace stavu přihlášení
        const wasLoggedIn = this.state.isLoggedIn;
        this.state.isLoggedIn = authState.isLoggedIn;

        // Aktualizace uživatele
        if (authState.isLoggedIn && authState.user) {
            this.state.currentUser = authState.user;

            // Synchronizace uživatelských dat mezi poskytovateli
            if (provider === 'auth0' && typeof SupabaseClient !== 'undefined') {
                await this.syncUserToSupabase(authState.user);
            } else if (provider === 'supabase' && typeof Auth0Auth !== 'undefined') {
                await this.syncUserToAuth0(authState.user);
            }
        } else if (!authState.isLoggedIn) {
            this.state.currentUser = null;
        }

        // Vyvolání události o změně stavu autentizace
        if (wasLoggedIn !== this.state.isLoggedIn || authState.isLoggedIn) {
            this.notifyAuthStateChange();
        }
    },

    /**
     * Kontrola, zda je uživatel přihlášen
     */
    async checkCurrentUser() {
        console.log('Kontrola přihlášení uživatele...');

        try {
            // Kontrola přes preferovaného poskytovatele
            if (this.state.authProvider) {
                let isLoggedIn = false;
                let user = null;

                if (this.state.authProvider === Auth0Auth) {
                    // Kontrola přes Auth0
                    await Auth0Auth.checkCurrentUser();
                    isLoggedIn = Auth0Auth.state.isLoggedIn;
                    user = Auth0Auth.state.currentUser;
                } else if (this.state.authProvider === SupabaseClient) {
                    // Kontrola přes Supabase
                    const result = await SupabaseClient.getCurrentUser();
                    isLoggedIn = result.success;
                    user = result.user;
                }

                // Aktualizace stavu
                this.state.isLoggedIn = isLoggedIn;
                this.state.currentUser = user;

                // Vyvolání události o změně stavu autentizace
                this.notifyAuthStateChange();

                console.log('Kontrola přihlášení uživatele:', isLoggedIn ? 'Přihlášen' : 'Nepřihlášen');
                return isLoggedIn;
            } else {
                console.error('Žádný poskytovatel autentizace není dostupný');
                return false;
            }
        } catch (error) {
            console.error('Chyba při kontrole přihlášení uživatele:', error);
            return false;
        }
    },

    /**
     * Přihlášení uživatele
     * @param {string} email - E-mail uživatele (volitelné pro Auth0)
     * @param {string} password - Heslo uživatele (volitelné pro Auth0)
     */
    async login(email, password) {
        console.log('Přihlašování uživatele...');

        // Kontrola, zda již probíhá přihlašování
        if (this.state.loginInProgress) {
            console.warn('Přihlašování již probíhá');
            return { success: false, error: 'Přihlašování již probíhá' };
        }

        this.state.loginInProgress = true;

        try {
            // Přihlášení přes preferovaného poskytovatele
            if (this.state.authProvider === Auth0Auth) {
                // Přihlášení přes Auth0
                const result = await Auth0Auth.login();
                this.state.loginInProgress = false;
                return result;
            } else if (this.state.authProvider === SupabaseClient) {
                // Přihlášení přes Supabase
                if (!email || !password) {
                    console.error('Pro přihlášení přes Supabase je potřeba e-mail a heslo');
                    this.state.loginInProgress = false;
                    return { success: false, error: 'Pro přihlášení je potřeba e-mail a heslo' };
                }

                const result = await SupabaseClient.signIn(email, password);
                this.state.loginInProgress = false;
                return result;
            } else {
                console.error('Žádný poskytovatel autentizace není dostupný');
                this.state.loginInProgress = false;
                return { success: false, error: 'Žádný poskytovatel autentizace není dostupný' };
            }
        } catch (error) {
            console.error('Chyba při přihlašování uživatele:', error);
            this.state.loginInProgress = false;
            return { success: false, error: error.message || 'Chyba při přihlašování' };
        }
    },

    /**
     * Odhlášení uživatele
     */
    async logout() {
        console.log('Odhlašování uživatele...');

        try {
            // Odhlášení z obou poskytovatelů
            let auth0Result = { success: true };
            let supabaseResult = { success: true };

            // Odhlášení z Auth0
            if (typeof Auth0Auth !== 'undefined') {
                auth0Result = await Auth0Auth.logout();
            }

            // Odhlášení ze Supabase
            if (typeof SupabaseClient !== 'undefined') {
                supabaseResult = await SupabaseClient.signOut();
            }

            // Kontrola výsledků
            if (!auth0Result.success || !supabaseResult.success) {
                console.error('Chyba při odhlašování uživatele:', auth0Result.error || supabaseResult.error);
                return { success: false, error: auth0Result.error || supabaseResult.error };
            }

            // Reset stavu
            this.state.isLoggedIn = false;
            this.state.currentUser = null;

            // Vyvolání události o změně stavu autentizace
            this.notifyAuthStateChange();

            console.log('Uživatel byl úspěšně odhlášen');
            return { success: true };
        } catch (error) {
            console.error('Chyba při odhlašování uživatele:', error);
            return { success: false, error: error.message || 'Chyba při odhlašování' };
        }
    },

    /**
     * Registrace nového uživatele
     * @param {string} email - E-mail uživatele
     * @param {string} password - Heslo uživatele
     * @param {string} username - Uživatelské jméno
     * @param {object} metadata - Další metadata uživatele
     */
    async register(email, password, username, metadata = {}) {
        console.log('Registrace nového uživatele:', email);

        // Kontrola, zda již probíhá registrace
        if (this.state.registrationInProgress) {
            console.warn('Registrace již probíhá');
            return { success: false, error: 'Registrace již probíhá' };
        }

        // Kontrola vstupních parametrů
        if (!email || !password || !username) {
            console.error('Pro registraci jsou potřeba e-mail, heslo a uživatelské jméno');
            return { success: false, error: 'Pro registraci jsou potřeba e-mail, heslo a uživatelské jméno' };
        }

        this.state.registrationInProgress = true;

        try {
            // Registrace přes Supabase (primární úložiště uživatelů)
            if (typeof SupabaseClient !== 'undefined') {
                const supabaseResult = await SupabaseClient.signUp(email, password, username, metadata);

                if (!supabaseResult.success) {
                    console.error('Chyba při registraci uživatele v Supabase:', supabaseResult.error);
                    this.state.registrationInProgress = false;
                    return supabaseResult;
                }

                // Pokud je registrace v Supabase úspěšná, vytvoříme uživatele i v Auth0
                if (typeof Auth0Auth !== 'undefined') {
                    // Vytvoření uživatele v Auth0 proběhne při prvním přihlášení
                    console.log('Uživatel byl úspěšně zaregistrován v Supabase, Auth0 účet bude vytvořen při prvním přihlášení');
                }

                this.state.registrationInProgress = false;
                return supabaseResult;
            } else if (typeof Auth0Auth !== 'undefined') {
                // Fallback na Auth0, pokud Supabase není dostupný
                console.warn('Supabase není dostupný, používám Auth0 pro registraci');

                // Auth0 nemá přímou metodu pro registraci, použijeme přihlášení s parametrem screen_hint=signup
                const auth0Result = await Auth0Auth.login({ screen_hint: 'signup' });

                this.state.registrationInProgress = false;
                return auth0Result;
            } else {
                console.error('Žádný poskytovatel autentizace není dostupný');
                this.state.registrationInProgress = false;
                return { success: false, error: 'Žádný poskytovatel autentizace není dostupný' };
            }
        } catch (error) {
            console.error('Chyba při registraci uživatele:', error);
            this.state.registrationInProgress = false;
            return { success: false, error: error.message || 'Chyba při registraci' };
        }
    },

    /**
     * Synchronizace uživatele z Auth0 do Supabase
     * @param {object} auth0User - Uživatel z Auth0
     */
    async syncUserToSupabase(auth0User) {
        if (!auth0User || !auth0User.sub) {
            console.error('Nelze synchronizovat uživatele do Supabase: Chybí data uživatele');
            return false;
        }

        try {
            console.log('Synchronizace uživatele z Auth0 do Supabase:', auth0User.email);

            // Kontrola, zda je uživatel již v Supabase
            const { data: existingUsers, error: searchError } = await SupabaseClient.getClient()
                .from('users')
                .select('*')
                .eq('auth0_id', auth0User.sub)
                .limit(1);

            if (searchError) {
                console.error('Chyba při hledání uživatele v Supabase:', searchError);
                return false;
            }

            if (existingUsers && existingUsers.length > 0) {
                // Uživatel již existuje, aktualizujeme jeho data
                console.log('Uživatel již existuje v Supabase, aktualizuji data');

                const { error: updateError } = await SupabaseClient.getClient()
                    .from('users')
                    .update({
                        email: auth0User.email,
                        username: auth0User.nickname || auth0User.name || auth0User.email.split('@')[0],
                        avatar_url: auth0User.picture || 'https://via.placeholder.com/150',
                        updated_at: new Date().toISOString()
                    })
                    .eq('auth0_id', auth0User.sub);

                if (updateError) {
                    console.error('Chyba při aktualizaci uživatele v Supabase:', updateError);
                    return false;
                }

                console.log('Uživatel byl úspěšně aktualizován v Supabase');
                return true;
            } else {
                // Uživatel neexistuje, vytvoříme ho
                console.log('Uživatel neexistuje v Supabase, vytvářím nový záznam');

                const { error: insertError } = await SupabaseClient.getClient()
                    .from('users')
                    .insert([
                        {
                            auth0_id: auth0User.sub,
                            email: auth0User.email,
                            username: auth0User.nickname || auth0User.name || auth0User.email.split('@')[0],
                            avatar_url: auth0User.picture || 'https://via.placeholder.com/150',
                            level: 1,
                            xp: 0,
                            xp_to_next_level: 100,
                            balance: 500,
                            currency: 'CZK',
                            bitcoin: 0.05,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                    ]);

                if (insertError) {
                    console.error('Chyba při vytváření uživatele v Supabase:', insertError);
                    return false;
                }

                // Vytvoření záznamu v tabulce user_stats
                const { error: statsError } = await SupabaseClient.getClient()
                    .from('user_stats')
                    .insert([{ auth0_id: auth0User.sub }]);

                if (statsError) {
                    console.error('Chyba při vytváření statistik uživatele v Supabase:', statsError);
                }

                // Vytvoření záznamu v tabulce user_settings
                const { error: settingsError } = await SupabaseClient.getClient()
                    .from('user_settings')
                    .insert([{ auth0_id: auth0User.sub }]);

                if (settingsError) {
                    console.error('Chyba při vytváření nastavení uživatele v Supabase:', settingsError);
                }

                console.log('Uživatel byl úspěšně vytvořen v Supabase');
                return true;
            }
        } catch (error) {
            console.error('Chyba při synchronizaci uživatele do Supabase:', error);
            return false;
        }
    },

    /**
     * Synchronizace uživatele ze Supabase do Auth0
     * @param {object} supabaseUser - Uživatel ze Supabase
     */
    async syncUserToAuth0(supabaseUser) {
        // Tato funkce je složitější, protože Auth0 Management API vyžaduje token
        // a není běžně dostupné z klientské strany. V reálné aplikaci by toto
        // mělo být řešeno serverovou částí.

        console.log('Synchronizace uživatele ze Supabase do Auth0 není implementována na klientské straně');
        return false;
    },

    /**
     * Oznámení o změně stavu autentizace
     */
    notifyAuthStateChange() {
        // Vyvolání události o změně stavu autentizace
        document.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: {
                isLoggedIn: this.state.isLoggedIn,
                user: this.state.currentUser
            }
        }));
    },

    /**
     * Získání aktuálního uživatele
     */
    getCurrentUser() {
        return {
            isLoggedIn: this.state.isLoggedIn,
            user: this.state.currentUser
        };
    },

    /**
     * Získání aktuálního poskytovatele autentizace
     */
    getAuthProvider() {
        if (this.state.authProvider === Auth0Auth) {
            return 'auth0';
        } else if (this.state.authProvider === SupabaseClient) {
            return 'supabase';
        } else {
            return 'none';
        }
    },

    /**
     * Získání tokenu pro API volání
     */
    async getToken() {
        try {
            if (this.state.authProvider === Auth0Auth) {
                // Získání tokenu z Auth0
                return await Auth0Auth.getToken();
            } else if (this.state.authProvider === SupabaseClient) {
                // Získání tokenu ze Supabase
                const { data, error } = await SupabaseClient.getClient().auth.getSession();
                if (error) throw error;
                return data.session?.access_token || null;
            } else {
                console.error('Žádný poskytovatel autentizace není dostupný');
                return null;
            }
        } catch (error) {
            console.error('Chyba při získávání tokenu:', error);
            return null;
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace modulu
    AuthService.init();
});

// Export modulu
window.AuthService = AuthService;
