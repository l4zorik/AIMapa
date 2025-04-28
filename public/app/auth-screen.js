/**
 * Přihlašovací obrazovka pro AIMapa
 * Verze 0.3.8.5
 *
 * Tento modul zobrazí přihlašovací obrazovku před přístupem k aplikaci
 * a zajistí, že uživatel je přihlášen před použitím aplikace.
 * Podporuje hybridní autentizaci pro lokální i Netlify prostředí.
 */

const AuthScreen = {
    // Stav modulu
    state: {
        isInitialized: false,
        isVisible: false,
        activeTab: 'login' // 'login' nebo 'register'
    },

    // Inicializace modulu
    async init() {
        console.log('Inicializace modulu AuthScreen...');

        // Kontrola, zda je uživatel přihlášen
        await this.checkAuthState();

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        this.state.isInitialized = true;
        console.log('Modul AuthScreen byl inicializován');
    },

    // Kontrola stavu přihlášení
    async checkAuthState() {
        console.log('Kontrola stavu přihlášení...');

        // Kontrola, zda jsme na testovací stránce
        const isTestPage = window.location.href.includes('/tests/');
        if (isTestPage) {
            console.log('Jsme na testovací stránce, přeskakuji kontrolu přihlášení');
            this.hideAuthScreen();

            // Nastavení stavu přihlášení pro testovací stránku
            localStorage.setItem('aiMapaLoggedIn', 'true');

            // Vyvolání události o změně stavu přihlášení
            document.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { isLoggedIn: true, user: { email: 'test@example.com' } }
            }));

            return;
        }

        // Kontrola, zda je uživatel již přihlášen v localStorage
        const isLoggedIn = localStorage.getItem('aiMapaLoggedIn') === 'true';
        if (isLoggedIn) {
            console.log('Uživatel je již přihlášen podle localStorage');
            this.hideAuthScreen();

            // Vyvolání události o změně stavu přihlášení
            document.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { isLoggedIn: true, user: { email: localStorage.getItem('aiMapaUserEmail') || 'unknown@example.com' } }
            }));

            return;
        }

        // Vždy používáme Auth0 pro kontrolu přihlášení
        if (typeof Auth0Auth !== 'undefined') {
            try {
                // Kontrola, zda je Auth0Auth inicializován
                if (!Auth0Auth.state.isInitialized) {
                    console.log('Auth0Auth není inicializován, inicializuji ho...');
                    await Auth0Auth.init();
                }

                // Kontrola, zda je uživatel přihlášen přes Auth0
                if (Auth0Auth.state.isLoggedIn && Auth0Auth.state.currentUser) {
                    console.log('Uživatel je přihlášen přes Auth0:', Auth0Auth.state.currentUser.email || Auth0Auth.state.currentUser.name);
                    this.hideAuthScreen();

                    // Uložení stavu přihlášení
                    localStorage.setItem('aiMapaLoggedIn', 'true');
                    localStorage.setItem('aiMapaUserEmail', Auth0Auth.state.currentUser.email || Auth0Auth.state.currentUser.name);

                    // Vyvolání události o změně stavu přihlášení
                    document.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { isLoggedIn: true, user: Auth0Auth.state.currentUser }
                    }));

                    return;
                }
            } catch (error) {
                console.error('Chyba při kontrole stavu přihlášení přes Auth0:', error);
            }
        }

        // Pokud uživatel není přihlášen, zobrazíme přihlašovací obrazovku
        console.log('Uživatel není přihlášen, zobrazuji přihlašovací obrazovku');
        await this.showAuthScreen();
    },

    // Zobrazení přihlašovací obrazovky
    async showAuthScreen() {
        console.log('Zobrazení přihlašovací obrazovky');

        // Vždy používáme pouze Auth0 pro přihlašování
        if (typeof Auth0Auth !== 'undefined') {
            console.log('Auth0Auth je dostupný, používám Auth0 přihlášení...');

            // Kontrola, zda je Auth0Auth inicializován
            if (!Auth0Auth.state.isInitialized) {
                console.log('Auth0Auth není inicializován, inicializuji ho...');
                try {
                    await Auth0Auth.init();
                } catch (error) {
                    console.error('Chyba při inicializaci Auth0Auth:', error);
                }
            }

            if (Auth0Auth.state.isInitialized) {
                console.log('Auth0Auth je inicializován, přesměrovávám na Auth0 přihlášení...');

                // Přesměrování na Auth0 přihlášení
                try {
                    const result = await Auth0Auth.login();
                    console.log('Výsledek přihlášení přes Auth0:', result);

                    if (result.error) {
                        console.error('Chyba při přihlašování přes Auth0:', result.error);
                    }
                } catch (error) {
                    console.error('Chyba při volání Auth0Auth.login():', error);
                }
                return;
            } else {
                console.error('Auth0Auth se nepodařilo inicializovat!');
            }
        } else {
            console.error('Auth0Auth není dostupný! Přesměrovávám na Auth0 přihlášení pomocí přímého přesměrování...');

            // Přímé přesměrování na Auth0 přihlašovací stránku
            const redirectUri = window.location.origin;
            const authUrl = 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/authorize?' +
                'client_id=TKzCgYPmkETVCBjC3418MgKDJY60rppl&' +
                'redirect_uri=' + encodeURIComponent(redirectUri) + '&' +
                'response_type=code&' +
                'scope=openid%20profile%20email&' +
                'connection=Username-Password-Authentication&' + // Specifikace připojení
                'prompt=login'; // Vždy zobrazit přihlašovací obrazovku

            console.log('Přesměrovávám na Auth0 URL:', authUrl);
            window.location.href = authUrl;
            return;
        }
    },

    // Skrytí přihlašovací obrazovky
    hideAuthScreen() {
        console.log('Skrytí přihlašovací obrazovky');

        const authScreen = document.getElementById('authScreen');
        if (authScreen) {
            authScreen.style.display = 'none';
        }

        this.state.isVisible = false;

        // Zobrazení obsahu aplikace
        this.showAppContent();
    },

    // Skrytí obsahu aplikace
    hideAppContent() {
        console.log('Skrytí obsahu aplikace');

        // Skrytí hlavního obsahu
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.display = 'none';
        }

        // Skrytí hlavičky
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'none';
        }
    },

    // Zobrazení obsahu aplikace
    showAppContent() {
        console.log('Zobrazení obsahu aplikace');

        // Zobrazení hlavního obsahu
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.style.display = 'flex';
        }

        // Zobrazení hlavičky
        const header = document.querySelector('header');
        if (header) {
            header.style.display = 'flex';
        }
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        console.log('Nastavení posluchačů událostí');

        // Posluchač pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            console.log('Událost authStateChanged:', event.detail);

            if (event.detail.isLoggedIn) {
                this.hideAuthScreen();
            } else {
                this.showAuthScreen().catch(error => {
                    console.error('Chyba při zobrazení přihlašovací obrazovky:', error);
                });
            }
        });
    },

    // Nastavení posluchačů událostí pro formuláře
    setupFormEventListeners() {
        console.log('Nastavení posluchačů událostí pro formuláře');

        // Přepínání mezi záložkami
        const tabs = document.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech záložek
                tabs.forEach(t => t.classList.remove('active'));

                // Přidání aktivní třídy na kliknutou záložku
                tab.classList.add('active');

                // Nastavení aktivní záložky
                this.state.activeTab = tab.getAttribute('data-tab');

                // Zobrazení odpovídajícího formuláře
                const forms = document.querySelectorAll('.auth-form');
                forms.forEach(form => form.classList.remove('active'));

                const activeForm = document.querySelector(`.${this.state.activeTab}-form`);
                if (activeForm) {
                    activeForm.classList.add('active');
                }
            });
        });

        // Přihlášení
        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.login();
            });
        }

        // Registrace
        const registerButton = document.getElementById('registerButton');
        if (registerButton) {
            registerButton.addEventListener('click', () => {
                this.register();
            });
        }
    },

    // Přihlášení uživatele
    async login() {
        console.log('Přihlášení uživatele');

        // Získání hodnot z formuláře
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Validace
        if (!email || !password) {
            this.showMessage('loginMessage', 'Vyplňte prosím všechna pole', 'error');
            return;
        }

        // Sanitizace vstupu
        const sanitizedEmail = typeof SecurityUtils !== 'undefined' ?
            SecurityUtils.sanitizeInput(email) : email;

        // Kontrola uzamčení účtu
        if (typeof SecurityUtils !== 'undefined') {
            const lockStatus = SecurityUtils.isAccountLocked(sanitizedEmail);
            if (lockStatus.locked) {
                this.showMessage('loginMessage', lockStatus.message, 'error');
                return;
            }

            // Přidání pokusu o přihlášení
            const attemptResult = SecurityUtils.addLoginAttempt(sanitizedEmail);
            if (attemptResult.locked) {
                this.showMessage('loginMessage', attemptResult.message, 'error');
                return;
            }
        }

        // Pro testovací účely - přihlášení bez autentizačního systému
        if (email === 'test@example.com' && password === 'test123') {
            console.log('Testovací přihlášení bylo úspěšné');

            // Uložení stavu přihlášení
            localStorage.setItem('aiMapaLoggedIn', 'true');
            localStorage.setItem('aiMapaUserEmail', email);

            // Skrytí přihlašovací obrazovky
            this.hideAuthScreen();

            // Vyvolání události o změně stavu přihlášení
            document.dispatchEvent(new CustomEvent('authStateChanged', {
                detail: { isLoggedIn: true, user: { email: email } }
            }));

            return;
        }

        // Přihlášení přes HybridAuth (preferovaná metoda)
        if (typeof HybridAuth !== 'undefined') {
            try {
                const result = await HybridAuth.signIn(sanitizedEmail, password);

                if (result.data && result.data.user) {
                    console.log('Uživatel byl úspěšně přihlášen přes HybridAuth');

                    // Reset počtu pokusů o přihlášení
                    if (typeof SecurityUtils !== 'undefined') {
                        SecurityUtils.resetLoginAttempts(sanitizedEmail);
                    }

                    // Uložení stavu přihlášení
                    localStorage.setItem('aiMapaLoggedIn', 'true');
                    localStorage.setItem('aiMapaUserEmail', result.data.user.email || sanitizedEmail);

                    this.hideAuthScreen();

                    // Vyvolání události o změně stavu přihlášení
                    document.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { isLoggedIn: true, user: result.data.user }
                    }));

                    return;
                } else if (result.error) {
                    this.showMessage('loginMessage', result.error.message || 'Přihlášení se nezdařilo', 'error');
                }
            } catch (error) {
                console.error('Chyba při přihlašování přes HybridAuth:', error);
                this.showMessage('loginMessage', error.message || 'Přihlášení se nezdařilo', 'error');
            }
        }

        // Přihlášení přes Supabase
        if (typeof SupabaseClient !== 'undefined') {
            try {
                // Přidání CSRF tokenu do požadavku
                const csrfToken = typeof SecurityUtils !== 'undefined' ?
                    SecurityUtils.getCsrfToken() : null;

                const result = await SupabaseClient.signIn(sanitizedEmail, password, csrfToken);

                if (result.success) {
                    console.log('Uživatel byl úspěšně přihlášen přes Supabase');

                    // Reset počtu pokusů o přihlášení
                    if (typeof SecurityUtils !== 'undefined') {
                        SecurityUtils.resetLoginAttempts(sanitizedEmail);
                    }

                    // Uložení stavu přihlášení
                    localStorage.setItem('aiMapaLoggedIn', 'true');
                    localStorage.setItem('aiMapaUserEmail', result.user.email || sanitizedEmail);

                    this.hideAuthScreen();

                    // Vyvolání události o změně stavu přihlášení
                    document.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { isLoggedIn: true, user: result.user }
                    }));

                    return;
                } else {
                    this.showMessage('loginMessage', result.error || 'Přihlášení se nezdařilo', 'error');
                }
            } catch (error) {
                console.error('Chyba při přihlašování přes Supabase:', error);
                this.showMessage('loginMessage', error.message || 'Přihlášení se nezdařilo', 'error');
            }
        }

        // Přihlášení přes LocalAuth
        if (typeof LocalAuth !== 'undefined') {
            try {
                const result = await LocalAuth.signIn(sanitizedEmail, password);

                if (result.data && result.data.user) {
                    console.log('Uživatel byl úspěšně přihlášen přes LocalAuth');

                    // Reset počtu pokusů o přihlášení
                    if (typeof SecurityUtils !== 'undefined') {
                        SecurityUtils.resetLoginAttempts(sanitizedEmail);
                    }

                    // Uložení stavu přihlášení
                    localStorage.setItem('aiMapaLoggedIn', 'true');
                    localStorage.setItem('aiMapaUserEmail', result.data.user.email || sanitizedEmail);

                    this.hideAuthScreen();

                    // Vyvolání události o změně stavu přihlášení
                    document.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { isLoggedIn: true, user: result.data.user }
                    }));

                    return;
                } else if (result.error) {
                    this.showMessage('loginMessage', result.error.message || 'Přihlášení se nezdařilo', 'error');
                }
            } catch (error) {
                console.error('Chyba při přihlašování přes LocalAuth:', error);
                this.showMessage('loginMessage', error.message || 'Přihlášení se nezdařilo', 'error');
            }
        }

        // Přihlášení přes UserAccounts
        if (typeof UserAccounts !== 'undefined') {
            try {
                const result = UserAccounts.login(email, password);

                if (result.success) {
                    console.log('Uživatel byl úspěšně přihlášen přes UserAccounts');

                    // Uložení stavu přihlášení
                    localStorage.setItem('aiMapaLoggedIn', 'true');
                    localStorage.setItem('aiMapaUserEmail', UserAccounts.state.currentUser?.email || email);

                    this.hideAuthScreen();

                    // Vyvolání události o změně stavu přihlášení
                    document.dispatchEvent(new CustomEvent('authStateChanged', {
                        detail: { isLoggedIn: true, user: UserAccounts.state.currentUser }
                    }));

                    return;
                } else {
                    this.showMessage('loginMessage', result.error || 'Přihlášení se nezdařilo', 'error');
                }
            } catch (error) {
                console.error('Chyba při přihlašování přes UserAccounts:', error);
                this.showMessage('loginMessage', error.message || 'Přihlášení se nezdařilo', 'error');
            }
        }

        // Pokud není dostupný žádný autentizační systém
        if (typeof Auth0Auth === 'undefined' && typeof HybridAuth === 'undefined' &&
            typeof SupabaseClient === 'undefined' && typeof LocalAuth === 'undefined' &&
            typeof UserAccounts === 'undefined') {
            console.error('Není dostupný žádný autentizační systém');
            this.showMessage('loginMessage', 'Není dostupný žádný autentizační systém', 'error');
        }
    },

    // Přidání Auth0 tlačítka do přihlašovacího formuláře
    addAuth0Button() {
        // Kontrola, zda je dostupný Auth0Auth
        if (typeof Auth0Auth === 'undefined') {
            console.log('Auth0Auth není dostupný, tlačítko nebude přidáno');
            return;
        }

        // Získání kontejneru pro sociální tlačítka
        const socialButtonsContainer = document.getElementById('socialLoginButtons');
        if (!socialButtonsContainer) {
            console.error('Kontejner pro sociální tlačítka nebyl nalezen');
            return;
        }

        // Přidání Auth0 tlačítka
        Auth0Auth.addLoginButton(socialButtonsContainer);
        console.log('Auth0 tlačítko bylo přidáno do přihlašovacího formuláře');
    },

    // Registrace uživatele
    async register() {
        console.log('Registrace uživatele');

        // Získání hodnot z formuláře
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        // Validace
        if (!username || !email || !password || !passwordConfirm) {
            this.showMessage('registerMessage', 'Vyplňte prosím všechna pole', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            this.showMessage('registerMessage', 'Hesla se neshodují', 'error');
            return;
        }

        // Sanitizace vstupu
        const sanitizedUsername = typeof SecurityUtils !== 'undefined' ?
            SecurityUtils.sanitizeInput(username) : username;
        const sanitizedEmail = typeof SecurityUtils !== 'undefined' ?
            SecurityUtils.sanitizeInput(email) : email;

        // Validace síly hesla
        if (typeof SecurityUtils !== 'undefined') {
            const passwordValidation = SecurityUtils.validatePassword(password);
            if (!passwordValidation.valid) {
                this.showMessage('registerMessage', passwordValidation.errors.join('<br>'), 'error');
                return;
            }
        }

        // Metadata pro registraci
        const metadata = { username: sanitizedUsername };

        // Registrace přes HybridAuth (preferovaná metoda)
        if (typeof HybridAuth !== 'undefined') {
            try {
                const result = await HybridAuth.signUp(sanitizedEmail, password, metadata);

                if (result.data && result.data.user) {
                    console.log('Uživatel byl úspěšně zaregistrován přes HybridAuth');
                    this.showMessage('registerMessage', 'Registrace byla úspěšná. Nyní se můžete přihlásit.', 'success');

                    // Přepnutí na záložku přihlášení
                    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                    if (loginTab) {
                        loginTab.click();
                    }

                    return;
                } else if (result.error) {
                    this.showMessage('registerMessage', result.error.message || 'Registrace se nezdařila', 'error');
                }
            } catch (error) {
                console.error('Chyba při registraci přes HybridAuth:', error);
                this.showMessage('registerMessage', error.message || 'Registrace se nezdařila', 'error');
            }
        }

        // Registrace přes Supabase
        if (typeof SupabaseClient !== 'undefined') {
            try {
                // Přidání CSRF tokenu do požadavku
                const csrfToken = typeof SecurityUtils !== 'undefined' ?
                    SecurityUtils.getCsrfToken() : null;

                const result = await SupabaseClient.signUp(sanitizedEmail, password, sanitizedUsername, csrfToken);

                if (result.success) {
                    console.log('Uživatel byl úspěšně zaregistrován přes Supabase');
                    this.showMessage('registerMessage', 'Registrace byla úspěšná. Nyní se můžete přihlásit.', 'success');

                    // Přepnutí na záložku přihlášení
                    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                    if (loginTab) {
                        loginTab.click();
                    }

                    return;
                } else {
                    this.showMessage('registerMessage', result.error || 'Registrace se nezdařila', 'error');
                }
            } catch (error) {
                console.error('Chyba při registraci přes Supabase:', error);
                this.showMessage('registerMessage', error.message || 'Registrace se nezdařila', 'error');
            }
        }

        // Registrace přes LocalAuth
        if (typeof LocalAuth !== 'undefined') {
            try {
                const result = await LocalAuth.signUp(sanitizedEmail, password, metadata);

                if (result.data && result.data.user) {
                    console.log('Uživatel byl úspěšně zaregistrován přes LocalAuth');
                    this.showMessage('registerMessage', 'Registrace byla úspěšná. Nyní se můžete přihlásit.', 'success');

                    // Přepnutí na záložku přihlášení
                    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                    if (loginTab) {
                        loginTab.click();
                    }

                    return;
                } else if (result.error) {
                    this.showMessage('registerMessage', result.error.message || 'Registrace se nezdařila', 'error');
                }
            } catch (error) {
                console.error('Chyba při registraci přes LocalAuth:', error);
                this.showMessage('registerMessage', error.message || 'Registrace se nezdařila', 'error');
            }
        }

        // Registrace přes UserAccounts
        if (typeof UserAccounts !== 'undefined') {
            try {
                const result = UserAccounts.register(username, email, password);

                if (result.success) {
                    console.log('Uživatel byl úspěšně zaregistrován přes UserAccounts');
                    this.showMessage('registerMessage', 'Registrace byla úspěšná. Nyní se můžete přihlásit.', 'success');

                    // Přepnutí na záložku přihlášení
                    const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                    if (loginTab) {
                        loginTab.click();
                    }

                    return;
                } else {
                    this.showMessage('registerMessage', result.error || 'Registrace se nezdařila', 'error');
                }
            } catch (error) {
                console.error('Chyba při registraci přes UserAccounts:', error);
                this.showMessage('registerMessage', error.message || 'Registrace se nezdařila', 'error');
            }
        }

        // Pokud není dostupný žádný autentizační systém
        if (typeof HybridAuth === 'undefined' && typeof SupabaseClient === 'undefined' &&
            typeof LocalAuth === 'undefined' && typeof UserAccounts === 'undefined') {
            console.error('Není dostupný žádný autentizační systém');
            this.showMessage('registerMessage', 'Není dostupný žádný autentizační systém', 'error');
        }
    },

    // Zobrazení zprávy
    showMessage(elementId, message, type = 'info') {
        console.log(`Zobrazení zprávy (${type}):`, message);

        const messageElement = document.getElementById(elementId);
        if (!messageElement) return;

        messageElement.innerHTML = message; // Použití innerHTML pro podporu HTML formátování
        messageElement.className = 'auth-message ' + type;

        // Automatické skrytí zprávy po 5 sekundách
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'auth-message';
        }, 5000);
    },

    // Kontrola síly hesla
    checkPasswordStrength() {
        const password = document.getElementById('registerPassword').value;
        const strengthBar = document.getElementById('passwordStrengthBar');
        const strengthText = document.getElementById('passwordStrengthText');

        if (!password) {
            strengthBar.className = 'password-strength-meter-bar';
            strengthBar.style.width = '0%';
            strengthText.textContent = '';
            return;
        }

        // Výpočet síly hesla
        let strength = 0;
        let feedback = [];

        // Délka hesla
        if (password.length >= 12) {
            strength += 25;
        } else if (password.length >= 8) {
            strength += 15;
        } else if (password.length >= 6) {
            strength += 5;
        }

        // Velká písmena
        if (/[A-Z]/.test(password)) {
            strength += 15;
        } else {
            feedback.push('Přidejte velké písmeno');
        }

        // Malá písmena
        if (/[a-z]/.test(password)) {
            strength += 15;
        } else {
            feedback.push('Přidejte malé písmeno');
        }

        // Čísla
        if (/[0-9]/.test(password)) {
            strength += 15;
        } else {
            feedback.push('Přidejte číslo');
        }

        // Speciální znaky
        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 20;
        } else {
            feedback.push('Přidejte speciální znak');
        }

        // Různorodost znaků
        const uniqueChars = new Set(password.split('')).size;
        const uniqueRatio = uniqueChars / password.length;
        strength += Math.round(uniqueRatio * 10);

        // Nastavení třídy a textu podle síly hesla
        let strengthClass = '';
        let strengthMessage = '';

        if (strength >= 80) {
            strengthClass = 'very-strong';
            strengthMessage = 'Velmi silné heslo';
        } else if (strength >= 60) {
            strengthClass = 'strong';
            strengthMessage = 'Silné heslo';
        } else if (strength >= 40) {
            strengthClass = 'medium';
            strengthMessage = 'Středně silné heslo';
        } else if (strength >= 20) {
            strengthClass = 'weak';
            strengthMessage = 'Slabé heslo';
        } else {
            strengthClass = 'very-weak';
            strengthMessage = 'Velmi slabé heslo';
        }

        // Aktualizace UI
        strengthBar.className = 'password-strength-meter-bar ' + strengthClass;
        strengthBar.style.width = strength + '%';

        if (feedback.length > 0 && strength < 60) {
            strengthText.textContent = `${strengthMessage} - ${feedback.join(', ')}`;
        } else {
            strengthText.textContent = strengthMessage;
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Počkáme na inicializaci Auth0Auth, pokud je dostupný
    if (typeof Auth0Auth !== 'undefined') {
        // Kontrola, zda je Auth0Auth již inicializován
        if (Auth0Auth.state.isInitialized) {
            console.log('Auth0Auth je již inicializován, inicializuji AuthScreen');
            AuthScreen.init().catch(error => {
                console.error('Chyba při inicializaci AuthScreen:', error);
            });
        } else {
            console.log('Čekám na inicializaci Auth0Auth...');
            // Vytvoření posluchače události pro inicializaci Auth0Auth
            const checkAuth0Init = setInterval(function() {
                if (Auth0Auth.state.isInitialized) {
                    console.log('Auth0Auth byl inicializován, inicializuji AuthScreen');
                    clearInterval(checkAuth0Init);
                    AuthScreen.init().catch(error => {
                        console.error('Chyba při inicializaci AuthScreen:', error);
                    });
                }
            }, 100); // Kontrola každých 100ms

            // Záložní časovač pro případ, že by se Auth0Auth neinicializoval
            setTimeout(function() {
                if (!AuthScreen.state.isInitialized) {
                    console.log('Vypršel časový limit pro inicializaci Auth0Auth, inicializuji AuthScreen bez něj');
                    clearInterval(checkAuth0Init);
                    AuthScreen.init().catch(error => {
                        console.error('Chyba při inicializaci AuthScreen:', error);
                    });
                }
            }, 5000); // Počkáme maximálně 5 sekund
        }
    } else {
        // Auth0Auth není dostupný, inicializujeme AuthScreen přímo
        console.log('Auth0Auth není dostupný, inicializuji AuthScreen přímo');
        AuthScreen.init().catch(error => {
            console.error('Chyba při inicializaci AuthScreen:', error);
        });
    }
});
