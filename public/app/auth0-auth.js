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

    // Metoda pro inicializaci modulu
    init: async function() {
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
            if (!this.state.isLoggedIn) {
                console.log('Uživatel není přihlášen, automaticky přesměrovávám na Auth0 přihlášení...');
                setTimeout(() => {
                    this.login();
                }, 1000);
            }

            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Auth0 autentizace:', error);
            return false;
        }
    },

    // Metoda pro přihlášení uživatele
    login: async function() {
        try {
            console.log('Zahajuji přihlášení přes Auth0...');

            // Určení správné URL pro přesměrování
            let redirectUri = window.location.origin;

            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                console.log('Jsme na vývojové verzi na Netlify, používám speciální URL pro přesměrování');
                redirectUri = 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app';
            }
            // Kontrola, zda jsme na localhost:3000
            else if (window.location.href.includes('localhost:3000')) {
                console.log('Jsme na lokálním vývojovém prostředí, používám localhost URL pro přesměrování');
                redirectUri = 'http://localhost:3000';
            }

            console.log('Přesměrování na Auth0 přihlašovací stránku s URL:', redirectUri);

            // Použití Auth0 Universal Login
            const authUrl = `https://${this.config.domain}/authorize?` +
                `client_id=${this.config.clientId}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=token id_token&` +
                `nonce=${Math.random().toString(36).substring(2, 15)}&` +
                `scope=openid profile email&` +
                `state=${Math.random().toString(36).substring(2, 15)}`;

            console.log('Kompletní Auth0 URL:', authUrl);

            // Přímé přesměrování na Auth0 přihlašovací stránku
            console.log('Přesměrovávám na Auth0 přihlašovací stránku...');
            window.location.href = authUrl;
            return { success: true };
        } catch (error) {
            console.error('Chyba při přihlašování přes Auth0:', error);
            console.error('Detail chyby:', error.message);
            console.error('Stack trace:', error.stack);

            // Pokus o přímé přesměrování v případě chyby
            try {
                console.log('Pokouším se o přímé přesměrování po chybě...');

                // Určení správné URL pro přesměrování
                let redirectUri = window.location.origin;

                // Kontrola, zda jsme na vývojové verzi na Netlify
                if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                    redirectUri = 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app';
                }
                // Kontrola, zda jsme na localhost:3000
                else if (window.location.href.includes('localhost:3000')) {
                    redirectUri = 'http://localhost:3000';
                }

                // Použití Auth0 Universal Login
                const authUrl = `https://${this.config.domain}/authorize?` +
                    `client_id=${this.config.clientId}&` +
                    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                    `response_type=token id_token&` +
                    `nonce=${Math.random().toString(36).substring(2, 15)}&` +
                    `scope=openid profile email&` +
                    `state=${Math.random().toString(36).substring(2, 15)}`;

                console.log('Přímé přesměrování na Auth0 URL po chybě:', authUrl);
                window.location.href = authUrl;
                return { success: true };
            } catch (redirectError) {
                console.error('Chyba i při pokusu o přímé přesměrování:', redirectError);
                return { error: error.message || 'Přihlášení se nezdařilo' };
            }
        }
    },

    // Konfigurace
    config: {
        domain: 'dev-zxj8pir0moo4pdk7.us.auth0.com',
        clientId: 'TKzCgYPmkETVCBjC3418MgKDJY60rppl',
        redirectUri: window.location.origin,
        // Přidání podpory pro vývojovou verzi na Netlify
        netlifyDevRedirectUri: 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app',
        // Lokální vývojové prostředí
        localDevRedirectUri: 'http://localhost:3000',
        audience: 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/',
        scope: 'openid profile email read:users read:user_idp_tokens',
        // Nastavení pro SPA aplikaci
        authorizationParams: {
            response_type: 'code',
            audience: 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/'
        }
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

    // Inicializace modulu - tato metoda je nyní definována výše
    // Ponecháváme zde pouze prázdnou implementaci pro zpětnou kompatibilitu
    async _legacyInit() {
        console.log('Používám novou implementaci init()');
        return true;
    },

    // Načtení Auth0 klienta
    async loadAuth0Client() {
        try {
            console.log('Začínám načítat Auth0 klienta...');

            // Kontrola, zda je dostupná Auth0 knihovna
            if (typeof window.createAuth0Client === 'undefined') {
                console.error('Auth0 knihovna není dostupná. Ujistěte se, že je načten skript auth0-spa-js.');

                // Pokus o načtení Auth0 knihovny z CDN
                console.log('Pokouším se načíst Auth0 knihovnu z CDN...');
                await this.loadAuth0Script();

                // Čekání na načtení knihovny
                await new Promise(resolve => setTimeout(resolve, 500));

                if (typeof window.createAuth0Client === 'undefined') {
                    console.error('Nepodařilo se načíst Auth0 knihovnu z CDN.');

                    // Pokus o přímé vytvoření Auth0 klienta pomocí alternativního přístupu
                    console.log('Pokouším se vytvořit Auth0 klienta alternativním způsobem...');

                    // Načtení konfigurace ze serveru
                    await this.loadConfig();

                    // Určení správné URL pro přesměrování
                    let redirectUri = this.config.redirectUri;

                    // Kontrola, zda jsme na vývojové verzi na Netlify
                    if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                        redirectUri = this.config.netlifyDevRedirectUri;
                    }
                    // Kontrola, zda jsme na localhost:3000
                    else if (window.location.href.includes('localhost:3000')) {
                        redirectUri = this.config.localDevRedirectUri;
                    }

                    // Vytvoření jednoduchého objektu pro simulaci Auth0 klienta
                    this.state.auth0Client = {
                        loginWithRedirect: async () => {
                            // Přímé přesměrování na Auth0 přihlašovací stránku
                            const authUrl = `https://${this.config.domain}/authorize?` +
                                `client_id=${this.config.clientId}&` +
                                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                                `response_type=code&` +
                                `scope=${encodeURIComponent(this.config.scope)}`;

                            console.log('Přímé přesměrování na Auth0 URL:', authUrl);
                            window.location.href = authUrl;
                        },
                        handleRedirectCallback: async () => {
                            console.log('Simulace zpracování callbacku');
                            return {};
                        },
                        isAuthenticated: async () => {
                            // Kontrola, zda je uživatel přihlášen podle localStorage
                            return localStorage.getItem('aiMapaLoggedIn') === 'true';
                        },
                        getUser: async () => {
                            // Vrácení jednoduchého objektu uživatele
                            return {
                                email: localStorage.getItem('aiMapaUserEmail') || 'auth0user',
                                name: localStorage.getItem('aiMapaUserEmail') || 'Auth0 User'
                            };
                        },
                        logout: async (options) => {
                            // Přímé přesměrování na Auth0 odhlašovací stránku
                            const logoutUrl = `https://${this.config.domain}/v2/logout?` +
                                `client_id=${this.config.clientId}&` +
                                `returnTo=${encodeURIComponent(options?.logoutParams?.returnTo || redirectUri)}`;

                            // Odstranění stavu přihlášení z localStorage
                            localStorage.removeItem('aiMapaLoggedIn');
                            localStorage.removeItem('aiMapaUserEmail');

                            console.log('Přímé přesměrování na Auth0 odhlašovací URL:', logoutUrl);
                            window.location.href = logoutUrl;
                        }
                    };

                    console.log('Auth0 klient byl vytvořen alternativním způsobem');
                    return true;
                }
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
            // Kontrola, zda jsme na localhost:3000
            else if (window.location.href.includes('localhost:3000')) {
                console.log('Jsme na lokálním vývojovém prostředí, používám localhost URL pro přesměrování');
                redirectUri = this.config.localDevRedirectUri;
            }

            console.log('Inicializace Auth0 klienta s URL pro přesměrování:', redirectUri);
            console.log('Auth0 konfigurace:', {
                domain: this.config.domain,
                clientId: this.config.clientId,
                redirectUri: redirectUri
            });

            try {
                // Vytvoření instance Auth0 klienta
                this.state.auth0Client = await window.createAuth0Client({
                    domain: this.config.domain,
                    clientId: this.config.clientId,
                    authorizationParams: {
                        redirect_uri: redirectUri,
                        audience: this.config.audience,
                        scope: this.config.scope,
                        response_type: 'code'
                    },
                    useRefreshTokens: true,
                    cacheLocation: 'localstorage'
                });

                console.log('Auth0 klient byl úspěšně načten');
                return true;
            } catch (clientError) {
                console.error('Chyba při vytváření Auth0 klienta:', clientError);

                // Pokus o vytvoření Auth0 klienta s minimální konfigurací
                try {
                    console.log('Pokouším se vytvořit Auth0 klienta s minimální konfigurací...');

                    this.state.auth0Client = await window.createAuth0Client({
                        domain: this.config.domain,
                        clientId: this.config.clientId,
                        authorizationParams: {
                            redirect_uri: redirectUri
                        }
                    });

                    console.log('Auth0 klient byl úspěšně načten s minimální konfigurací');
                    return true;
                } catch (minimalError) {
                    console.error('Chyba při vytváření Auth0 klienta s minimální konfigurací:', minimalError);

                    // Vytvoření jednoduchého objektu pro simulaci Auth0 klienta
                    console.log('Vytvářím simulovaný Auth0 klient...');

                    this.state.auth0Client = {
                        loginWithRedirect: async () => {
                            // Přímé přesměrování na Auth0 přihlašovací stránku
                            const authUrl = `https://${this.config.domain}/authorize?` +
                                `client_id=${this.config.clientId}&` +
                                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                                `response_type=code&` +
                                `scope=${encodeURIComponent(this.config.scope)}`;

                            console.log('Přímé přesměrování na Auth0 URL:', authUrl);
                            window.location.href = authUrl;
                        },
                        handleRedirectCallback: async () => {
                            console.log('Simulace zpracování callbacku');
                            return {};
                        },
                        isAuthenticated: async () => {
                            // Kontrola, zda je uživatel přihlášen podle localStorage
                            return localStorage.getItem('aiMapaLoggedIn') === 'true';
                        },
                        getUser: async () => {
                            // Vrácení jednoduchého objektu uživatele
                            return {
                                email: localStorage.getItem('aiMapaUserEmail') || 'auth0user',
                                name: localStorage.getItem('aiMapaUserEmail') || 'Auth0 User'
                            };
                        },
                        logout: async (options) => {
                            // Přímé přesměrování na Auth0 odhlašovací stránku
                            const logoutUrl = `https://${this.config.domain}/v2/logout?` +
                                `client_id=${this.config.clientId}&` +
                                `returnTo=${encodeURIComponent(options?.logoutParams?.returnTo || redirectUri)}`;

                            // Odstranění stavu přihlášení z localStorage
                            localStorage.removeItem('aiMapaLoggedIn');
                            localStorage.removeItem('aiMapaUserEmail');

                            console.log('Přímé přesměrování na Auth0 odhlašovací URL:', logoutUrl);
                            window.location.href = logoutUrl;
                        }
                    };

                    console.log('Simulovaný Auth0 klient byl vytvořen');
                    return true;
                }
            }
        } catch (error) {
            console.error('Chyba při načítání Auth0 klienta:', error);
            console.error('Detail chyby:', error.message);
            console.error('Stack trace:', error.stack);

            // Vytvoření jednoduchého objektu pro simulaci Auth0 klienta
            console.log('Vytvářím simulovaný Auth0 klient po chybě...');

            // Načtení konfigurace ze serveru
            await this.loadConfig();

            // Určení správné URL pro přesměrování
            let redirectUri = this.config.redirectUri;

            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                redirectUri = this.config.netlifyDevRedirectUri;
            }
            // Kontrola, zda jsme na localhost:3000
            else if (window.location.href.includes('localhost:3000')) {
                redirectUri = this.config.localDevRedirectUri;
            }

            this.state.auth0Client = {
                loginWithRedirect: async () => {
                    // Přímé přesměrování na Auth0 přihlašovací stránku
                    const authUrl = `https://${this.config.domain}/authorize?` +
                        `client_id=${this.config.clientId}&` +
                        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                        `response_type=code&` +
                        `scope=${encodeURIComponent(this.config.scope)}`;

                    console.log('Přímé přesměrování na Auth0 URL:', authUrl);
                    window.location.href = authUrl;
                },
                handleRedirectCallback: async () => {
                    console.log('Simulace zpracování callbacku');
                    return {};
                },
                isAuthenticated: async () => {
                    // Kontrola, zda je uživatel přihlášen podle localStorage
                    return localStorage.getItem('aiMapaLoggedIn') === 'true';
                },
                getUser: async () => {
                    // Vrácení jednoduchého objektu uživatele
                    return {
                        email: localStorage.getItem('aiMapaUserEmail') || 'auth0user',
                        name: localStorage.getItem('aiMapaUserEmail') || 'Auth0 User'
                    };
                },
                logout: async (options) => {
                    // Přímé přesměrování na Auth0 odhlašovací stránku
                    const logoutUrl = `https://${this.config.domain}/v2/logout?` +
                        `client_id=${this.config.clientId}&` +
                        `returnTo=${encodeURIComponent(options?.logoutParams?.returnTo || redirectUri)}`;

                    // Odstranění stavu přihlášení z localStorage
                    localStorage.removeItem('aiMapaLoggedIn');
                    localStorage.removeItem('aiMapaUserEmail');

                    console.log('Přímé přesměrování na Auth0 odhlašovací URL:', logoutUrl);
                    window.location.href = logoutUrl;
                }
            };

            console.log('Simulovaný Auth0 klient byl vytvořen po chybě');
            return true;
        }
    },

    // Vytvoření simulovaného Auth0 klienta
    createSimulatedAuth0Client() {
        console.log('Vytvářím simulovaného Auth0 klienta...');

        // Určení správné URL pro přesměrování
        let redirectUri = this.config.redirectUri;

        // Kontrola, zda jsme na vývojové verzi na Netlify
        if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
            redirectUri = this.config.netlifyDevRedirectUri;
        }
        // Kontrola, zda jsme na localhost:3000
        else if (window.location.href.includes('localhost:3000')) {
            redirectUri = this.config.localDevRedirectUri;
        }

        // Vytvoření jednoduchého objektu pro simulaci Auth0 klienta
        this.state.auth0Client = {
            loginWithRedirect: async () => {
                // Přímé přesměrování na Auth0 přihlašovací stránku
                const authUrl = `https://${this.config.domain}/authorize?` +
                    `client_id=${this.config.clientId}&` +
                    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                    `response_type=code&` +
                    `scope=${encodeURIComponent(this.config.scope)}`;

                console.log('Přímé přesměrování na Auth0 URL (simulovaný klient):', authUrl);
                window.location.href = authUrl;
            },
            handleRedirectCallback: async () => {
                console.log('Simulace zpracování callbacku (simulovaný klient)');
                return {};
            },
            isAuthenticated: async () => {
                // Kontrola, zda je uživatel přihlášen podle localStorage
                const isLoggedIn = localStorage.getItem('aiMapaLoggedIn') === 'true';
                console.log('Kontrola přihlášení (simulovaný klient):', isLoggedIn ? 'Přihlášen' : 'Nepřihlášen');
                return isLoggedIn;
            },
            getUser: async () => {
                // Vrácení jednoduchého objektu uživatele
                const email = localStorage.getItem('aiMapaUserEmail') || 'auth0user';
                console.log('Získání uživatele (simulovaný klient):', email);
                return {
                    email: email,
                    name: email,
                    sub: 'simulated-user-id',
                    picture: null
                };
            },
            logout: async (options) => {
                // Přímé přesměrování na Auth0 odhlašovací stránku
                const logoutUrl = `https://${this.config.domain}/v2/logout?` +
                    `client_id=${this.config.clientId}&` +
                    `returnTo=${encodeURIComponent(options?.logoutParams?.returnTo || redirectUri)}`;

                // Odstranění stavu přihlášení z localStorage
                localStorage.removeItem('aiMapaLoggedIn');
                localStorage.removeItem('aiMapaUserEmail');

                console.log('Přímé přesměrování na Auth0 odhlašovací URL (simulovaný klient):', logoutUrl);
                window.location.href = logoutUrl;
            }
        };

        console.log('Simulovaný Auth0 klient byl úspěšně vytvořen');
        return true;
    },

    // Načtení Auth0 skriptu z CDN
    loadAuth0Script() {
        return new Promise((resolve, reject) => {
            // Kontrola, zda již skript není načten
            if (document.querySelector('script[src*="auth0-spa-js"]')) {
                console.log('Auth0 skript je již načten, čekám na jeho inicializaci...');

                // Kontrola, zda je createAuth0Client definován každých 100ms po dobu 5 sekund
                let attempts = 0;
                const maxAttempts = 50; // 5 sekund

                const checkInterval = setInterval(() => {
                    attempts++;

                    if (typeof window.createAuth0Client !== 'undefined') {
                        clearInterval(checkInterval);
                        console.log('Auth0 knihovna je nyní dostupná (window.createAuth0Client)');
                        resolve();
                        return;
                    } else if (typeof createAuth0Client !== 'undefined') {
                        // Pokud je createAuth0Client definováno jako lokální proměnná, přiřadíme ji do window
                        window.createAuth0Client = createAuth0Client;
                        clearInterval(checkInterval);
                        console.log('Auth0 knihovna je nyní dostupná (createAuth0Client přiřazeno do window)');
                        resolve();
                        return;
                    } else if (attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        console.error('Nepodařilo se načíst Auth0 knihovnu ani po opakovaných pokusech');

                        // Pokus o opětovné načtení skriptu
                        console.log('Pokouším se znovu načíst Auth0 skript...');

                        // Odstranění existujícího skriptu
                        const existingScript = document.querySelector('script[src*="auth0-spa-js"]');
                        if (existingScript) {
                            existingScript.remove();
                        }

                        // Načtení alternativního zdroje
                        const alternativeScript = document.createElement('script');
                        alternativeScript.src = 'https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2.0/dist/auth0-spa-js.production.js';
                        alternativeScript.async = false;
                        alternativeScript.type = 'text/javascript';

                        alternativeScript.onload = () => {
                            console.log('Auth0 skript byl úspěšně načten z alternativního zdroje');

                            // Kontrola, zda je createAuth0Client definováno
                            if (typeof window.createAuth0Client !== 'undefined') {
                                console.log('createAuth0Client je definováno po načtení alternativního skriptu');
                                resolve();
                            } else if (typeof createAuth0Client !== 'undefined') {
                                window.createAuth0Client = createAuth0Client;
                                console.log('createAuth0Client přiřazeno do window po načtení alternativního skriptu');
                                resolve();
                            } else {
                                console.log('createAuth0Client stále není definováno po načtení alternativního skriptu, používám simulovaného klienta');

                                // Vytvoření simulovaného Auth0 klienta
                                this.createSimulatedAuth0Client();

                                // Úspěšné vyřešení promise, i když jsme museli použít simulovaného klienta
                                resolve();
                            }
                        };

                        alternativeScript.onerror = (alternativeError) => {
                            console.error('Chyba při načítání Auth0 skriptu z alternativního zdroje:', alternativeError);
                            reject(alternativeError);
                        };

                        document.head.appendChild(alternativeScript);
                    }
                }, 100);

                return;
            }

            console.log('Načítám Auth0 skript z CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdn.auth0.com/js/auth0-spa-js/2.0/auth0-spa-js.production.js';
            script.async = false; // Synchronní načtení pro zajištění dostupnosti před dalším kódem
            script.type = 'text/javascript';

            script.onload = () => {
                console.log('Auth0 skript byl úspěšně načten z CDN');

                // Kontrola, zda je createAuth0Client definováno
                if (typeof window.createAuth0Client !== 'undefined') {
                    console.log('createAuth0Client je definováno po načtení skriptu (window.createAuth0Client)');
                } else if (typeof createAuth0Client !== 'undefined') {
                    window.createAuth0Client = createAuth0Client;
                    console.log('createAuth0Client přiřazeno do window po načtení skriptu');
                } else {
                    console.warn('createAuth0Client není definováno po načtení skriptu, čekám na jeho inicializaci...');

                    // Čekání na inicializaci knihovny
                    let attempts = 0;
                    const maxAttempts = 30; // 3 sekundy

                    const checkInterval = setInterval(() => {
                        attempts++;

                        if (typeof window.createAuth0Client !== 'undefined') {
                            clearInterval(checkInterval);
                            console.log('Auth0 knihovna je nyní dostupná (window.createAuth0Client)');
                            resolve();
                            return;
                        } else if (typeof createAuth0Client !== 'undefined') {
                            window.createAuth0Client = createAuth0Client;
                            clearInterval(checkInterval);
                            console.log('Auth0 knihovna je nyní dostupná (createAuth0Client přiřazeno do window)');
                            resolve();
                            return;
                        } else if (attempts >= maxAttempts) {
                            clearInterval(checkInterval);
                            console.error('Nepodařilo se načíst Auth0 knihovnu ani po opakovaných pokusech');

                            // Pokus o načtení alternativního zdroje
                            console.log('Pokouším se načíst Auth0 skript z alternativního zdroje...');

                            const alternativeScript = document.createElement('script');
                            alternativeScript.src = 'https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2.0/dist/auth0-spa-js.production.js';
                            alternativeScript.async = false;
                            alternativeScript.type = 'text/javascript';

                            alternativeScript.onload = () => {
                                console.log('Auth0 skript byl úspěšně načten z alternativního zdroje');

                                // Kontrola, zda je createAuth0Client definováno
                                if (typeof window.createAuth0Client !== 'undefined') {
                                    console.log('createAuth0Client je definováno po načtení alternativního skriptu');
                                    resolve();
                                } else if (typeof createAuth0Client !== 'undefined') {
                                    window.createAuth0Client = createAuth0Client;
                                    console.log('createAuth0Client přiřazeno do window po načtení alternativního skriptu');
                                    resolve();
                                } else {
                                    console.log('createAuth0Client stále není definováno po načtení alternativního skriptu, používám simulovaného klienta');

                                    // Vytvoření simulovaného Auth0 klienta
                                    this.createSimulatedAuth0Client();

                                    // Úspěšné vyřešení promise, i když jsme museli použít simulovaného klienta
                                    resolve();
                                }
                            };

                            alternativeScript.onerror = (alternativeError) => {
                                console.error('Chyba při načítání Auth0 skriptu z alternativního zdroje:', alternativeError);
                                reject(alternativeError);
                            };

                            document.head.appendChild(alternativeScript);
                        }
                    }, 100);
                }

                resolve();
            };

            script.onerror = (error) => {
                console.error('Chyba při načítání Auth0 skriptu z CDN:', error);

                // Pokus o načtení alternativního zdroje
                console.log('Pokouším se načíst Auth0 skript z alternativního zdroje po chybě...');

                const alternativeScript = document.createElement('script');
                alternativeScript.src = 'https://cdn.jsdelivr.net/npm/@auth0/auth0-spa-js@2.0/dist/auth0-spa-js.production.js';
                alternativeScript.async = false;
                alternativeScript.type = 'text/javascript';

                alternativeScript.onload = () => {
                    console.log('Auth0 skript byl úspěšně načten z alternativního zdroje');

                    // Kontrola, zda je createAuth0Client definováno
                    if (typeof window.createAuth0Client !== 'undefined') {
                        console.log('createAuth0Client je definováno po načtení alternativního skriptu');
                        resolve();
                    } else if (typeof createAuth0Client !== 'undefined') {
                        window.createAuth0Client = createAuth0Client;
                        console.log('createAuth0Client přiřazeno do window po načtení alternativního skriptu');
                        resolve();
                    } else {
                        console.log('createAuth0Client stále není definováno po načtení alternativního skriptu, používám simulovaného klienta');

                        // Vytvoření simulovaného Auth0 klienta
                        this.createSimulatedAuth0Client();

                        // Úspěšné vyřešení promise, i když jsme museli použít simulovaného klienta
                        resolve();
                    }
                };

                alternativeScript.onerror = (alternativeError) => {
                    console.error('Chyba při načítání Auth0 skriptu z alternativního zdroje:', alternativeError);
                    reject(alternativeError);
                };

                document.head.appendChild(alternativeScript);
            };

            document.head.appendChild(script);
        });
    },

    // Kontrola, zda je uživatel přihlášen
    async checkCurrentUser() {
        try {
            console.log('Kontrola přihlášení uživatele...');

            // Kontrola, zda je v URL hash s tokeny z Auth0
            const hash = window.location.hash;
            const hasAuthTokens = hash.includes('access_token=') && hash.includes('id_token=');

            if (hasAuthTokens) {
                console.log('Detekovány tokeny v URL hash, zpracovávám callback...');

                try {
                    // Parsování tokenů z URL hash
                    const hashParams = {};
                    hash.substring(1).split('&').forEach(pair => {
                        const [key, value] = pair.split('=');
                        hashParams[key] = decodeURIComponent(value);
                    });

                    // Získání tokenů
                    const accessToken = hashParams['access_token'];
                    const idToken = hashParams['id_token'];

                    if (accessToken && idToken) {
                        console.log('Tokeny byly úspěšně získány');

                        // Dekódování ID tokenu pro získání informací o uživateli
                        const userInfo = this.parseJwt(idToken);
                        console.log('Získány informace o uživateli z ID tokenu:', userInfo);

                        // Nastavení stavu přihlášení
                        this.state.isLoggedIn = true;
                        this.state.currentUser = userInfo;

                        // Uložení tokenů do localStorage
                        localStorage.setItem('aiMapaAccessToken', accessToken);
                        localStorage.setItem('aiMapaIdToken', idToken);
                        localStorage.setItem('aiMapaLoggedIn', 'true');
                        localStorage.setItem('aiMapaUserEmail', userInfo.email || userInfo.name || userInfo.sub || 'auth0user');

                        // Aktualizace tlačítka autentizace
                        this.updateAuthButton();

                        // Vyvolání události o změně stavu přihlášení
                        document.dispatchEvent(new CustomEvent('authStateChanged', {
                            detail: { isLoggedIn: true, user: userInfo }
                        }));

                        // Odstranění hash z URL
                        window.history.replaceState({}, document.title, window.location.pathname);

                        console.log('Uživatel je přihlášen:', userInfo.email || userInfo.name || userInfo.sub);
                        return true;
                    }
                } catch (callbackError) {
                    console.error('Chyba při zpracování callbacku:', callbackError);
                }

                // Odstranění hash z URL i v případě chyby
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // Kontrola, zda jsou tokeny v localStorage
            const accessToken = localStorage.getItem('aiMapaAccessToken');
            const idToken = localStorage.getItem('aiMapaIdToken');

            if (accessToken && idToken) {
                try {
                    // Dekódování ID tokenu pro získání informací o uživateli
                    const userInfo = this.parseJwt(idToken);

                    // Kontrola expirace tokenu
                    const currentTime = Math.floor(Date.now() / 1000);
                    if (userInfo.exp && userInfo.exp > currentTime) {
                        // Token je stále platný
                        this.state.isLoggedIn = true;
                        this.state.currentUser = userInfo;

                        // Aktualizace tlačítka autentizace
                        this.updateAuthButton();

                        console.log('Uživatel je přihlášen (z localStorage):', userInfo.email || userInfo.name || userInfo.sub);
                        return true;
                    } else {
                        // Token vypršel, odstraníme ho
                        localStorage.removeItem('aiMapaAccessToken');
                        localStorage.removeItem('aiMapaIdToken');
                        localStorage.removeItem('aiMapaLoggedIn');
                        localStorage.removeItem('aiMapaUserEmail');
                    }
                } catch (tokenError) {
                    console.error('Chyba při dekódování tokenu:', tokenError);
                    // Odstraníme neplatné tokeny
                    localStorage.removeItem('aiMapaAccessToken');
                    localStorage.removeItem('aiMapaIdToken');
                    localStorage.removeItem('aiMapaLoggedIn');
                    localStorage.removeItem('aiMapaUserEmail');
                }
            }

            // Pokud máme inicializovaný Auth0 klient, zkusíme standardní kontrolu
            if (this.state.auth0Client) {
                try {
                    const isAuthenticated = await this.state.auth0Client.isAuthenticated();
                    if (isAuthenticated) {
                        const user = await this.state.auth0Client.getUser();
                        if (user) {
                            console.log('Uživatel je přihlášen přes Auth0 klienta:', user.email || user.name || 'auth0user');

                            // Aktualizace stavu
                            this.state.isLoggedIn = true;
                            this.state.currentUser = user;

                            // Uložení stavu přihlášení
                            localStorage.setItem('aiMapaLoggedIn', 'true');
                            localStorage.setItem('aiMapaUserEmail', user.email || user.name || 'auth0user');

                            // Aktualizace tlačítka autentizace
                            this.updateAuthButton();

                            return true;
                        }
                    }
                } catch (authError) {
                    console.warn('Chyba při kontrole přihlášení přes Auth0 klienta:', authError);
                }
            }

            // Uživatel není přihlášen
            this.state.isLoggedIn = false;
            this.state.currentUser = null;

            // Aktualizace tlačítka autentizace
            this.updateAuthButton();

            console.log('Uživatel není přihlášen');
            return false;
        } catch (error) {
            console.error('Chyba při kontrole přihlášení uživatele:', error);
            console.error('Detail chyby:', error.message);
            console.error('Stack trace:', error.stack);

            this.state.isLoggedIn = false;
            this.state.currentUser = null;

            // Aktualizace tlačítka autentizace
            this.updateAuthButton();

            return false;
        }
    },

    // Pomocná metoda pro dekódování JWT tokenu
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Chyba při dekódování JWT tokenu:', error);
            return {};
        }
    },

    // Přidání tlačítka pro autentizaci
    addAuthButton() {
        console.log('Přidávání Auth0 tlačítka...');

        // Kontrola, zda již tlačítko existuje
        if (this.state.authButtonShown || document.getElementById('auth0AuthButton')) {
            console.log('Auth0 tlačítko již existuje, pouze aktualizuji');
            this.updateAuthButton();
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
            console.log('Kliknuto na Auth0 tlačítko');

            if (this.state.isLoggedIn) {
                // Pokud je uživatel přihlášen, zobrazíme profil
                if (typeof UserProfile !== 'undefined' && typeof UserProfile.toggleProfileModal === 'function') {
                    console.log('Zobrazuji profil přes UserProfile modul');
                    UserProfile.toggleProfileModal();
                } else {
                    console.log('UserProfile modul není dostupný, odhlašuji uživatele');
                    this.logout();
                }
            } else {
                console.log('Uživatel není přihlášen, přihlašuji');
                this.login();
            }
        });

        // Přidání tlačítka do dokumentu
        document.body.appendChild(authButton);

        // Přidání posluchače události pro tlačítko v hlavičce
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            console.log('Přidávám posluchač události pro tlačítko přihlášení v hlavičce');
            loginButton.addEventListener('click', () => {
                console.log('Kliknuto na tlačítko přihlášení v hlavičce');

                if (this.state.isLoggedIn) {
                    // Pokud je uživatel přihlášen, zobrazíme profil
                    if (typeof UserProfile !== 'undefined' && typeof UserProfile.toggleProfileModal === 'function') {
                        console.log('Zobrazuji profil přes UserProfile modul');
                        UserProfile.toggleProfileModal();
                    } else {
                        console.log('UserProfile modul není dostupný, odhlašuji uživatele');
                        this.logout();
                    }
                } else {
                    console.log('Uživatel není přihlášen, přihlašuji');
                    this.login();
                }
            });
        } else {
            console.warn('Tlačítko přihlášení v hlavičce nebylo nalezeno');
        }

        // Zajištění načtení Font Awesome ikon
        this.loadFontAwesome();

        // Aktualizace stavu tlačítka
        this.updateAuthButton();

        this.state.authButtonShown = true;
        console.log('Tlačítko pro Auth0 autentizaci bylo přidáno');
    },

    // Načtení Font Awesome ikon
    loadFontAwesome() {
        // Kontrola, zda již Font Awesome není načten
        if (document.querySelector('link[href*="font-awesome"]')) {
            console.log('Font Awesome je již načten');
            return;
        }

        console.log('Načítám Font Awesome ikony...');

        // Vytvoření odkazu na CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        link.integrity = 'sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==';
        link.crossOrigin = 'anonymous';

        // Přidání odkazu do hlavičky dokumentu
        document.head.appendChild(link);

        console.log('Font Awesome ikony byly načteny');
    },

    // Aktualizace tlačítka autentizace
    updateAuthButton() {
        console.log('Aktualizace Auth0 tlačítka, stav přihlášení:', this.state.isLoggedIn);

        // Aktualizace plovoucího tlačítka
        const authButton = document.getElementById('auth0AuthButton');
        if (authButton) {
            if (this.state.isLoggedIn) {
                authButton.classList.add('logged-in');
                authButton.title = 'Klikněte pro zobrazení profilu (přihlášen přes Auth0)';
                authButton.innerHTML = '<i class="fas fa-user-check"></i>';

                // Přidání textu "Auth0" vedle tlačítka
                if (!document.getElementById('auth0-login-status')) {
                    const statusIndicator = document.createElement('div');
                    statusIndicator.id = 'auth0-login-status';
                    statusIndicator.className = 'auth0-login-status';
                    statusIndicator.textContent = 'Auth0';

                    // Vložení indikátoru vedle tlačítka
                    authButton.parentNode.insertBefore(statusIndicator, authButton.nextSibling);

                    // Přidání stylu pro indikátor
                    const style = document.createElement('style');
                    style.textContent = `
                        .auth0-login-status {
                            position: fixed;
                            top: 65px;
                            right: 120px;
                            background-color: #ff4f1f;
                            color: white;
                            padding: 3px 8px;
                            border-radius: 10px;
                            font-size: 12px;
                            font-weight: bold;
                            z-index: 899;
                            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        }
                    `;
                    document.head.appendChild(style);
                }

                // Změna funkce tlačítka - při kliknutí zobrazit profil místo odhlášení
                authButton.onclick = () => {
                    console.log('Kliknuto na Auth0 tlačítko v přihlášeném stavu');

                    // Pokud je dostupný UserProfile modul, použijeme ho pro zobrazení profilu
                    if (typeof UserProfile !== 'undefined' && typeof UserProfile.toggleProfileModal === 'function') {
                        console.log('Zobrazuji profil přes UserProfile modul');
                        UserProfile.toggleProfileModal();
                    } else {
                        console.log('UserProfile modul není dostupný, zobrazuji základní informace');
                        // Zobrazení základních informací o přihlášení
                        alert(`Přihlášen jako: ${this.state.currentUser.email || this.state.currentUser.name || 'Auth0 uživatel'}`);
                    }
                };
            } else {
                authButton.classList.remove('logged-in');
                authButton.title = 'Přihlásit se přes Auth0';
                authButton.innerHTML = '<i class="fas fa-lock"></i>';

                // Odstranění textu "Auth0" pokud existuje
                const statusIndicator = document.getElementById('auth0-login-status');
                if (statusIndicator) {
                    statusIndicator.remove();
                }

                // Obnovení původní funkce tlačítka - přihlášení
                authButton.onclick = () => {
                    console.log('Kliknuto na Auth0 tlačítko v odhlášeném stavu');
                    this.login();
                };
            }
        }

        // Aktualizace tlačítka v hlavičce
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            if (this.state.isLoggedIn) {
                loginButton.classList.add('logged-in');
                loginButton.innerHTML = '<i class="icon">👤</i> Profil';
                loginButton.title = 'Zobrazit profil (přihlášen přes Auth0)';

                // Změna funkce tlačítka - při kliknutí zobrazit profil místo odhlášení
                loginButton.onclick = () => {
                    console.log('Kliknuto na tlačítko přihlášení v hlavičce v přihlášeném stavu');

                    // Pokud je dostupný UserProfile modul, použijeme ho pro zobrazení profilu
                    if (typeof UserProfile !== 'undefined' && typeof UserProfile.toggleProfileModal === 'function') {
                        console.log('Zobrazuji profil přes UserProfile modul');
                        UserProfile.toggleProfileModal();
                    } else {
                        console.log('UserProfile modul není dostupný, zobrazuji základní informace');
                        // Zobrazení základních informací o přihlášení
                        alert(`Přihlášen jako: ${this.state.currentUser.email || this.state.currentUser.name || 'Auth0 uživatel'}`);
                    }
                };
            } else {
                loginButton.classList.remove('logged-in');
                loginButton.innerHTML = '<i class="icon">👤</i> Přihlásit';
                loginButton.title = 'Přihlásit se přes Auth0';

                // Obnovení původní funkce tlačítka - přihlášení
                loginButton.onclick = () => {
                    console.log('Kliknuto na tlačítko přihlášení v hlavičce v odhlášeném stavu');
                    this.login();
                };
            }
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
                    console.error('Nepodařilo se inicializovat Auth0 klienta, používám přímé přesměrování...');

                    // Určení správné URL pro přesměrování
                    let redirectUri = this.config.redirectUri;

                    // Kontrola, zda jsme na vývojové verzi na Netlify
                    if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                        redirectUri = this.config.netlifyDevRedirectUri;
                    }
                    // Kontrola, zda jsme na localhost:3000
                    else if (window.location.href.includes('localhost:3000')) {
                        redirectUri = this.config.localDevRedirectUri;
                    }

                    // Vytvoření kompletní URL pro přesměrování
                    const authUrl = `https://${this.config.domain}/authorize?` +
                        `client_id=${this.config.clientId}&` +
                        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                        `response_type=code&` +
                        `scope=${encodeURIComponent(this.config.scope)}`;

                    console.log('Přímé přesměrování na Auth0 URL:', authUrl);
                    window.location.href = authUrl;
                    return { success: true };
                }
            }

            // Určení správné URL pro přesměrování
            let redirectUri = this.config.redirectUri;

            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                console.log('Jsme na vývojové verzi na Netlify, používám speciální URL pro přesměrování');
                redirectUri = this.config.netlifyDevRedirectUri;
            }
            // Kontrola, zda jsme na localhost:3000
            else if (window.location.href.includes('localhost:3000')) {
                console.log('Jsme na lokálním vývojovém prostředí, používám localhost URL pro přesměrování');
                redirectUri = this.config.localDevRedirectUri;
            }

            console.log('Přesměrování na Auth0 přihlašovací stránku s URL:', redirectUri);

            // Vytvoření kompletní URL pro přesměrování (pro debugování)
            const authUrl = `https://${this.config.domain}/authorize?` +
                `client_id=${this.config.clientId}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `response_type=code&` +
                `scope=${encodeURIComponent(this.config.scope)}`;

            console.log('Kompletní Auth0 URL:', authUrl);

            // Vždy používáme přímé přesměrování pro zajištění spolehlivosti
            console.log('Používám přímé přesměrování na Auth0...');
            window.location.href = authUrl;
            return { success: true };

            /* Zakomentováno pro spolehlivější fungování
            // Standardní přesměrování přes Auth0 SDK
            console.log('Používám Auth0 SDK pro přesměrování...');
            await this.state.auth0Client.loginWithRedirect({
                authorizationParams: {
                    redirect_uri: redirectUri,
                    response_type: 'code',
                    scope: this.config.scope
                }
            });
            */
        } catch (error) {
            console.error('Chyba při přihlašování přes Auth0:', error);
            console.error('Detail chyby:', error.message);
            console.error('Stack trace:', error.stack);

            // Pokus o přímé přesměrování v případě chyby
            try {
                console.log('Pokouším se o přímé přesměrování po chybě...');

                // Určení správné URL pro přesměrování
                let redirectUri = this.config.redirectUri;

                // Kontrola, zda jsme na vývojové verzi na Netlify
                if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                    redirectUri = this.config.netlifyDevRedirectUri;
                }
                // Kontrola, zda jsme na localhost:3000
                else if (window.location.href.includes('localhost:3000')) {
                    redirectUri = this.config.localDevRedirectUri;
                }

                // Vytvoření kompletní URL pro přesměrování
                const authUrl = `https://${this.config.domain}/authorize?` +
                    `client_id=${this.config.clientId}&` +
                    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                    `response_type=code&` +
                    `scope=${encodeURIComponent(this.config.scope)}`;

                console.log('Přímé přesměrování na Auth0 URL po chybě:', authUrl);
                window.location.href = authUrl;
                return { success: true };
            } catch (redirectError) {
                console.error('Chyba i při pokusu o přímé přesměrování:', redirectError);
                return { error: error.message || 'Přihlášení se nezdařilo' };
            }
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
            console.log('Odhlašování uživatele...');

            // Určení správné URL pro přesměrování po odhlášení
            let returnTo = window.location.origin;

            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                console.log('Jsme na vývojové verzi na Netlify, používám speciální URL pro přesměrování po odhlášení');
                returnTo = 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app';
            }
            // Kontrola, zda jsme na localhost:3000
            else if (window.location.href.includes('localhost:3000')) {
                console.log('Jsme na lokálním vývojovém prostředí, používám localhost URL pro přesměrování po odhlášení');
                returnTo = 'http://localhost:3000';
            }

            console.log('Odhlášení z Auth0 s URL pro přesměrování:', returnTo);

            // Odstranění tokenů a stavu přihlášení z localStorage
            localStorage.removeItem('aiMapaAccessToken');
            localStorage.removeItem('aiMapaIdToken');
            localStorage.removeItem('aiMapaLoggedIn');
            localStorage.removeItem('aiMapaUserEmail');

            // Aktualizace stavu
            this.state.isLoggedIn = false;
            this.state.currentUser = null;

            // Aktualizace tlačítka autentizace
            this.updateAuthButton();

            // Vyvolání události o změně stavu přihlášení
            document.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { isLoggedIn: false }
            }));

            // Přesměrování na Auth0 odhlašovací stránku
            const logoutUrl = `https://${this.config.domain}/v2/logout?` +
                `client_id=${this.config.clientId}&` +
                `returnTo=${encodeURIComponent(returnTo)}`;

            console.log('Přesměrování na Auth0 odhlašovací stránku:', logoutUrl);
            window.location.href = logoutUrl;

            return { success: true };
        } catch (error) {
            console.error('Chyba při odhlašování z Auth0:', error);
            console.error('Detail chyby:', error.message);
            console.error('Stack trace:', error.stack);

            // Pokus o přímé odhlášení i v případě chyby
            try {
                // Odstranění tokenů a stavu přihlášení z localStorage
                localStorage.removeItem('aiMapaAccessToken');
                localStorage.removeItem('aiMapaIdToken');
                localStorage.removeItem('aiMapaLoggedIn');
                localStorage.removeItem('aiMapaUserEmail');

                // Aktualizace stavu
                this.state.isLoggedIn = false;
                this.state.currentUser = null;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Vyvolání události o změně stavu přihlášení
                document.dispatchEvent(new CustomEvent('authStateChanged', {
                    detail: { isLoggedIn: false }
                }));

                // Přesměrování na Auth0 odhlašovací stránku
                const returnTo = window.location.origin;
                const logoutUrl = `https://${this.config.domain}/v2/logout?` +
                    `client_id=${this.config.clientId}&` +
                    `returnTo=${encodeURIComponent(returnTo)}`;

                console.log('Přesměrování na Auth0 odhlašovací stránku po chybě:', logoutUrl);
                window.location.href = logoutUrl;

                return { success: true };
            } catch (logoutError) {
                console.error('Chyba i při pokusu o přímé odhlášení:', logoutError);
                return { error: error.message || 'Odhlášení se nezdařilo' };
            }
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

    // Kontrola, zda je v URL autorizační kód z Auth0
    const query = window.location.search;
    const hasAuthCode = query.includes('code=') && query.includes('state=');

    if (hasAuthCode) {
        console.log('Detekován autorizační kód v URL, prioritně inicializuji Auth0...');

        // Pokus o inicializaci Auth0 klienta
        Auth0Auth.loadAuth0Client().then(success => {
            if (success) {
                console.log('Auth0 klient byl úspěšně inicializován, zpracovávám callback...');
                Auth0Auth.checkCurrentUser().then(isLoggedIn => {
                    console.log('Kontrola přihlášení uživatele po zpracování callbacku:', isLoggedIn ? 'Přihlášen' : 'Nepřihlášen');
                });
            } else {
                console.error('Nepodařilo se inicializovat Auth0 klienta pro zpracování callbacku');
            }
        }).catch(error => {
            console.error('Chyba při inicializaci Auth0 klienta pro zpracování callbacku:', error);
        });

        return;
    }

    // Kontrola, zda je dostupná Auth0 knihovna
    if (typeof createAuth0Client !== 'undefined') {
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
        script.async = false; // Synchronní načtení pro zajištění dostupnosti před dalším kódem

        script.onload = function() {
            console.log('Auth0 knihovna byla úspěšně načtena');

            // Krátká pauza pro zajištění, že knihovna je plně inicializována
            setTimeout(() => {
                Auth0Auth.init().catch(error => {
                    console.error('Chyba při inicializaci Auth0Auth po načtení knihovny:', error);
                });
            }, 100);
        };

        script.onerror = function(error) {
            console.error('Chyba při načítání Auth0 knihovny:', error);
        };

        document.head.appendChild(script);
    }
});

// Export modulu
window.Auth0Auth = Auth0Auth;
