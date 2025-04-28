/**
 * Auth0 autentizace pro AIMapa
 * Verze 0.3.8.5
 */

// Modul pro autentizaci uživatelů pomocí Auth0
const Auth0Auth = {
    // Stav modulu
    state: {
        isInitialized: false,
        isLoggedIn: false,
        currentUser: null,
        auth0Client: null,
        authButtonShown: false
    },

    // Konfigurace
    config: {
        domain: 'dev-zxj8pir0moo4pdk7.us.auth0.com',
        clientId: 'TKzCgYPmkETVCBjC3418MgKDJY60rppl',
        redirectUri: window.location.origin,
        // Přidání podpory pro vývojovou verzi na Netlify
        netlifyDevRedirectUri: 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app',
        audience: 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/',
        scope: 'openid profile email read:users read:user_idp_tokens'
    },

    // Logování pro debugování
    debug: true,

    // Logování konfigurace
    logConfig() {
        console.log('Auth0 konfigurace:');
        console.log('Domain:', this.config.domain);
        console.log('ClientId:', this.config.clientId);
        console.log('RedirectUri:', this.config.redirectUri);
        console.log('NetlifyDevRedirectUri:', this.config.netlifyDevRedirectUri);
        console.log('Audience:', this.config.audience);
        console.log('Scope:', this.config.scope);
        console.log('Window location:', window.location.href);
    },

    // Načtení konfigurace ze serveru
    async loadConfig() {
        try {
            const response = await fetch('/auth/config');
            if (!response.ok) {
                throw new Error('Nepodařilo se načíst konfiguraci Auth0');
            }

            const config = await response.json();

            // Aktualizace konfigurace
            this.config.domain = config.domain || this.config.domain;
            this.config.clientId = config.clientId || this.config.clientId;
            this.config.audience = config.audience || this.config.audience;
            this.config.scope = config.scope || this.config.scope;

            console.log('Auth0 konfigurace byla načtena ze serveru');
            return true;
        } catch (error) {
            console.error('Chyba při načítání konfigurace Auth0:', error);
            console.log('Používám výchozí konfiguraci Auth0');
            return false;
        }
    },

    // Inicializace modulu
    async init() {
        console.log('Inicializace modulu Auth0 autentizace...');

        try {
            // Logování konfigurace pro debugování
            this.logConfig();

            // Načtení Auth0 klienta
            await this.loadAuth0Client();

            // Přidání tlačítka pro přihlášení/registraci
            this.addAuthButton();

            // Kontrola, zda je uživatel přihlášen
            await this.checkCurrentUser();

            // Nastavení posluchačů událostí pro změny autentizace
            this.setupAuthListeners();

            this.state.isInitialized = true;
            console.log('Modul Auth0 autentizace byl inicializován');

            // Automatické přihlášení, pokud uživatel není přihlášen
            if (!this.state.isLoggedIn && this.debug) {
                console.log('Uživatel není přihlášen, automaticky přesměrovávám na Auth0 přihlášení...');
                setTimeout(() => {
                    this.login();
                }, 1000);
            }
        } catch (error) {
            console.error('Chyba při inicializaci Auth0 autentizace:', error);
        }
    },

    // Načtení Auth0 klienta
    async loadAuth0Client() {
        try {
            // Kontrola, zda je dostupná Auth0 knihovna
            if (typeof auth0 === 'undefined') {
                console.error('Auth0 knihovna není dostupná. Ujistěte se, že je načten skript auth0-spa-js.');
                return false;
            }

            // Načtení konfigurace ze serveru
            await this.loadConfig();

            // Určení správné URL pro přesměrování
            let redirectUri = this.config.redirectUri;

            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                console.log('Jsme na vývojové verzi na Netlify, používám speciální URL pro přesměrování');
                redirectUri = this.config.netlifyDevRedirectUri;
            }

            console.log('Inicializace Auth0 klienta s URL pro přesměrování:', redirectUri);

            // Vytvoření instance Auth0 klienta
            this.state.auth0Client = await auth0.createAuth0Client({
                domain: this.config.domain,
                clientId: this.config.clientId,
                authorizationParams: {
                    redirect_uri: redirectUri,
                    audience: this.config.audience,
                    scope: this.config.scope
                }
            });

            console.log('Auth0 klient byl úspěšně načten');
            return true;
        } catch (error) {
            console.error('Chyba při načítání Auth0 klienta:', error);
            return false;
        }
    },

    // Kontrola, zda je uživatel přihlášen
    async checkCurrentUser() {
        try {
            if (!this.state.auth0Client) {
                console.error('Auth0 klient není inicializován');
                return false;
            }

            // Kontrola, zda je uživatel přihlášen
            const isAuthenticated = await this.state.auth0Client.isAuthenticated();

            if (isAuthenticated) {
                // Získání informací o uživateli
                const user = await this.state.auth0Client.getUser();
                this.state.isLoggedIn = true;
                this.state.currentUser = user;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Vyvolání události o změně stavu přihlášení
                document.dispatchEvent(new CustomEvent('authStateChanged', {
                    detail: { isLoggedIn: true, user: user }
                }));

                console.log('Uživatel je přihlášen přes Auth0:', user.email);
                return true;
            } else {
                // Kontrola, zda je v URL autentizační kód
                const query = window.location.search;
                if (query.includes('code=') && query.includes('state=')) {
                    // Zpracování autentizačního kódu
                    await this.state.auth0Client.handleRedirectCallback();

                    // Odstranění autentizačních parametrů z URL
                    window.history.replaceState({}, document.title, window.location.pathname);

                    // Opětovná kontrola přihlášení
                    return await this.checkCurrentUser();
                }
            }

            return false;
        } catch (error) {
            console.error('Chyba při kontrole přihlášení uživatele:', error);
            return false;
        }
    },

    // Přidání tlačítka pro autentizaci
    addAuthButton() {
        // Kontrola, zda již tlačítko existuje
        if (this.state.authButtonShown || document.getElementById('auth0AuthButton')) {
            return;
        }

        // Vytvoření tlačítka
        const authButton = document.createElement('button');
        authButton.id = 'auth0AuthButton';
        authButton.className = 'auth0-auth-button';
        authButton.title = 'Přihlásit se přes Auth0';
        authButton.innerHTML = '<i class="fas fa-lock"></i>';

        // Přidání posluchače události
        authButton.addEventListener('click', () => {
            if (this.state.isLoggedIn) {
                this.logout();
            } else {
                this.login();
            }
        });

        // Přidání tlačítka do dokumentu
        document.body.appendChild(authButton);

        // Aktualizace stavu tlačítka
        this.updateAuthButton();

        this.state.authButtonShown = true;
        console.log('Tlačítko pro Auth0 autentizaci bylo přidáno');
    },

    // Aktualizace tlačítka autentizace
    updateAuthButton() {
        const authButton = document.getElementById('auth0AuthButton');
        if (!authButton) return;

        if (this.state.isLoggedIn) {
            authButton.classList.add('logged-in');
            authButton.title = 'Odhlásit se';
            authButton.innerHTML = '<i class="fas fa-user-check"></i>';
        } else {
            authButton.classList.remove('logged-in');
            authButton.title = 'Přihlásit se přes Auth0';
            authButton.innerHTML = '<i class="fas fa-lock"></i>';
        }
    },

    // Nastavení posluchačů událostí
    setupAuthListeners() {
        // Posluchač pro změnu stavu přihlášení
        window.addEventListener('auth0:login', async () => {
            await this.checkCurrentUser();
        });

        window.addEventListener('auth0:logout', () => {
            this.state.isLoggedIn = false;
            this.state.currentUser = null;
            this.updateAuthButton();
        });
    },

    // Přihlášení uživatele
    async login() {
        try {
            console.log('Zahajuji přihlášení přes Auth0...');

            if (!this.state.auth0Client) {
                console.error('Auth0 klient není inicializován');

                // Pokus o opětovnou inicializaci Auth0 klienta
                console.log('Pokouším se znovu inicializovat Auth0 klienta...');
                await this.loadAuth0Client();

                if (!this.state.auth0Client) {
                    return { error: 'Auth0 klient není inicializován ani po opětovném pokusu' };
                }
            }

            // Určení správné URL pro přesměrování
            let redirectUri = this.config.redirectUri;

            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                console.log('Jsme na vývojové verzi na Netlify, používám speciální URL pro přesměrování');
                redirectUri = this.config.netlifyDevRedirectUri;
            }

            console.log('Přesměrování na Auth0 přihlašovací stránku s URL:', redirectUri);

            // Vytvoření kompletní URL pro přesměrování (pro debugování)
            const authUrl = `https://${this.config.domain}/authorize?` +
                `client_id=${this.config.clientId}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=code&` +
                `scope=${encodeURIComponent(this.config.scope)}`;

            console.log('Kompletní Auth0 URL:', authUrl);

            // Možnost přímého přesměrování pro debugování
            if (this.debug) {
                console.log('Používám přímé přesměrování pro debugování...');
                window.location.href = authUrl;
                return { success: true };
            }

            // Standardní přesměrování přes Auth0 SDK
            console.log('Používám Auth0 SDK pro přesměrování...');
            await this.state.auth0Client.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: redirectUri
                }
            });

            return { success: true };
        } catch (error) {
            console.error('Chyba při přihlašování přes Auth0:', error);
            return { error: error.message || 'Přihlášení se nezdařilo' };
        }
    },

    // Přihlášení uživatele s popup oknem
    async loginWithPopup() {
        try {
            if (!this.state.auth0Client) {
                console.error('Auth0 klient není inicializován');
                return { error: 'Auth0 klient není inicializován' };
            }

            // Zobrazení popup okna pro přihlášení
            await this.state.auth0Client.loginWithPopup();

            // Kontrola, zda je uživatel přihlášen
            const isAuthenticated = await this.state.auth0Client.isAuthenticated();
            if (isAuthenticated) {
                // Získání informací o uživateli
                const user = await this.state.auth0Client.getUser();
                this.state.isLoggedIn = true;
                this.state.currentUser = user;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Uložení stavu přihlášení
                localStorage.setItem('aiMapaLoggedIn', 'true');
                localStorage.setItem('aiMapaUserEmail', user.email);

                // Vyvolání události o změně stavu přihlášení
                document.dispatchEvent(new CustomEvent('authStateChanged', {
                    detail: { isLoggedIn: true, user: user }
                }));

                console.log('Uživatel byl úspěšně přihlášen přes Auth0:', user.email);
                return { success: true, user: user };
            } else {
                return { error: 'Přihlášení se nezdařilo' };
            }
        } catch (error) {
            console.error('Chyba při přihlašování přes Auth0 popup:', error);
            return { error: error.message || 'Přihlášení se nezdařilo' };
        }
    },

    // Odhlášení uživatele
    async logout() {
        try {
            if (!this.state.auth0Client) {
                console.error('Auth0 klient není inicializován');
                return { error: 'Auth0 klient není inicializován' };
            }

            // Určení správné URL pro přesměrování po odhlášení
            let returnTo = this.config.redirectUri;

            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                console.log('Jsme na vývojové verzi na Netlify, používám speciální URL pro přesměrování po odhlášení');
                returnTo = this.config.netlifyDevRedirectUri;
            }

            console.log('Odhlášení z Auth0 s URL pro přesměrování:', returnTo);

            // Odhlášení uživatele
            await this.state.auth0Client.logout({
                logoutParams: {
                    returnTo: returnTo
                }
            });

            // Aktualizace stavu
            this.state.isLoggedIn = false;
            this.state.currentUser = null;

            // Aktualizace tlačítka autentizace
            this.updateAuthButton();

            // Odstranění stavu přihlášení z localStorage
            localStorage.removeItem('aiMapaLoggedIn');
            localStorage.removeItem('aiMapaUserEmail');

            // Vyvolání události o změně stavu přihlášení
            document.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { isLoggedIn: false }
            }));

            console.log('Uživatel byl úspěšně odhlášen z Auth0');
            return { success: true };
        } catch (error) {
            console.error('Chyba při odhlašování z Auth0:', error);
            return { error: error.message || 'Odhlášení se nezdařilo' };
        }
    },

    // Získání aktuálního uživatele
    async getUser() {
        try {
            if (!this.state.auth0Client) {
                console.error('Auth0 klient není inicializován');
                return { error: 'Auth0 klient není inicializován' };
            }

            // Kontrola, zda je uživatel přihlášen
            const isAuthenticated = await this.state.auth0Client.isAuthenticated();
            if (isAuthenticated) {
                // Získání základních informací o uživateli
                const user = await this.state.auth0Client.getUser();

                // Získání dalších informací o uživateli z Auth0 Management API
                try {
                    const userInfo = await this.getUserInfo(user.sub);

                    // Sloučení dat z obou zdrojů
                    const enrichedUser = {
                        ...user,
                        metadata: userInfo.data ? userInfo.data.user_metadata || {} : {}
                    };

                    // Aktualizace stavu
                    this.state.currentUser = enrichedUser;

                    // Vyvolání události o získání kompletních dat uživatele
                    document.dispatchEvent(new CustomEvent('auth0UserDataLoaded', {
                        detail: { user: enrichedUser }
                    }));

                    return { data: { user: enrichedUser, isLoggedIn: true } };
                } catch (apiError) {
                    console.warn('Nepodařilo se získat rozšířená data uživatele:', apiError);
                    // Pokračujeme s běžnými daty
                    return { data: { user, isLoggedIn: true } };
                }
            } else {
                return { data: { isLoggedIn: false } };
            }
        } catch (error) {
            console.error('Chyba při získávání uživatele z Auth0:', error);
            return { error: error.message || 'Získání uživatele se nezdařilo' };
        }
    },

    // Získání přístupového tokenu
    async getToken() {
        try {
            if (!this.state.auth0Client) {
                console.error('Auth0 klient není inicializován');
                return { error: 'Auth0 klient není inicializován' };
            }

            // Kontrola, zda je uživatel přihlášen
            const isAuthenticated = await this.state.auth0Client.isAuthenticated();
            if (isAuthenticated) {
                // Získání tokenu
                const token = await this.state.auth0Client.getTokenSilently();
                return { data: { token } };
            } else {
                return { error: 'Uživatel není přihlášen' };
            }
        } catch (error) {
            console.error('Chyba při získávání tokenu z Auth0:', error);
            return { error: error.message || 'Získání tokenu se nezdařilo' };
        }
    },

    // Přidání Auth0 přihlašovacího tlačítka do přihlašovacího formuláře
    addLoginButton(container) {
        if (!container) return;

        // Vytvoření tlačítka
        const loginButton = document.createElement('button');
        loginButton.className = 'auth0-login-button';
        loginButton.innerHTML = '<i class="fas fa-lock"></i> Přihlásit se přes Auth0';

        // Přidání posluchače události
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.loginWithPopup();
        });

        // Přidání tlačítka do kontejneru
        container.appendChild(loginButton);
    },

    // Získání Management API tokenu ze serveru
    async getManagementToken() {
        try {
            // Volání endpointu pro získání tokenu
            const response = await fetch('/auth/management-token');

            if (!response.ok) {
                throw new Error('Nepodařilo se získat Management API token');
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Chyba při získávání Management API tokenu:', error);
            throw error;
        }
    },

    // Volání Auth0 Management API
    async callAuth0Api(endpoint, method = 'GET', data = null) {
        try {
            if (!this.state.auth0Client) {
                console.error('Auth0 klient není inicializován');
                return { error: 'Auth0 klient není inicializován' };
            }

            // Získání Management API tokenu ze serveru
            let token;
            try {
                token = await this.getManagementToken();
            } catch (tokenError) {
                console.error('Nepodařilo se získat Management API token:', tokenError);

                // Pokud se nepodaří získat token ze serveru, zkusíme použít uživatelský token
                const tokenResult = await this.getToken();
                if (tokenResult.error) {
                    return { error: tokenResult.error };
                }
                token = tokenResult.data.token;
            }

            const apiUrl = `https://${this.config.domain}/api/v2/${endpoint}`;

            // Nastavení hlaviček
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Nastavení možností požadavku
            const options = {
                method: method,
                headers: headers
            };

            // Přidání dat pro POST, PUT, PATCH požadavky
            if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
                options.body = JSON.stringify(data);
            }

            // Odeslání požadavku
            const response = await fetch(apiUrl, options);

            // Zpracování odpovědi
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Chyba při volání Auth0 API:', errorData);
                return { error: errorData };
            }

            // Vrácení dat
            const responseData = await response.json();
            return { data: responseData };
        } catch (error) {
            console.error('Chyba při volání Auth0 API:', error);
            return { error: error.message || 'Volání Auth0 API se nezdařilo' };
        }
    },

    // Získání informací o uživateli z Auth0 Management API
    async getUserInfo(userId) {
        if (!userId) {
            // Pokud není zadáno ID uživatele, použijeme aktuálního uživatele
            if (!this.state.currentUser || !this.state.currentUser.sub) {
                return { error: 'Uživatel není přihlášen nebo nemá ID' };
            }
            userId = this.state.currentUser.sub;
        }

        // Volání Auth0 API pro získání informací o uživateli
        return await this.callAuth0Api(`users/${userId}`);
    },

    // Aktualizace informací o uživateli v Auth0 Management API
    async updateUserInfo(userId, userData) {
        if (!userId) {
            // Pokud není zadáno ID uživatele, použijeme aktuálního uživatele
            if (!this.state.currentUser || !this.state.currentUser.sub) {
                return { error: 'Uživatel není přihlášen nebo nemá ID' };
            }
            userId = this.state.currentUser.sub;
        }

        // Volání Auth0 API pro aktualizaci informací o uživateli
        return await this.callAuth0Api(`users/${userId}`, 'PATCH', userData);
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializace Auth0Auth...');

    // Kontrola, zda jsme na vývojové verzi na Netlify
    if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
        console.log('Jsme na vývojové verzi na Netlify');
    }

    // Kontrola, zda je dostupná Auth0 knihovna
    if (typeof auth0 !== 'undefined') {
        // Inicializace modulu
        console.log('Auth0 knihovna je dostupná, inicializuji Auth0Auth');
        Auth0Auth.init().catch(error => {
            console.error('Chyba při inicializaci Auth0Auth:', error);
        });
    } else {
        console.error('Auth0 knihovna není dostupná. Ujistěte se, že je načten skript auth0-spa-js.');

        // Pokus o načtení Auth0 knihovny
        console.log('Pokouším se načíst Auth0 knihovnu...');
        const script = document.createElement('script');
        script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js';
        script.onload = function() {
            console.log('Auth0 knihovna byla úspěšně načtena');
            Auth0Auth.init().catch(error => {
                console.error('Chyba při inicializaci Auth0Auth po načtení knihovny:', error);
            });
        };
        script.onerror = function() {
            console.error('Chyba při načítání Auth0 knihovny');
        };
        document.head.appendChild(script);
    }
});
