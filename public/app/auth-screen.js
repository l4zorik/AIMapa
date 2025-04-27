/**
 * Přihlašovací obrazovka pro AIMapa
 * Verze 0.3.8.4
 * 
 * Tento modul zobrazí přihlašovací obrazovku před přístupem k aplikaci
 * a zajistí, že uživatel je přihlášen před použitím aplikace.
 */

const AuthScreen = {
    // Stav modulu
    state: {
        isInitialized: false,
        isVisible: false,
        activeTab: 'login' // 'login' nebo 'register'
    },
    
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu AuthScreen...');
        
        // Kontrola, zda je uživatel přihlášen
        this.checkAuthState();
        
        // Nastavení posluchačů událostí
        this.setupEventListeners();
        
        this.state.isInitialized = true;
        console.log('Modul AuthScreen byl inicializován');
    },
    
    // Kontrola stavu přihlášení
    async checkAuthState() {
        console.log('Kontrola stavu přihlášení...');
        
        // Pokud je dostupný SupabaseClient, použijeme ho pro kontrolu přihlášení
        if (typeof SupabaseClient !== 'undefined') {
            try {
                const result = await SupabaseClient.getCurrentUser();
                
                if (result.success && result.user) {
                    console.log('Uživatel je přihlášen:', result.user.email);
                    this.hideAuthScreen();
                    return;
                }
            } catch (error) {
                console.error('Chyba při kontrole stavu přihlášení:', error);
            }
        }
        
        // Pokud je dostupný UserAccounts, použijeme ho pro kontrolu přihlášení
        if (typeof UserAccounts !== 'undefined' && UserAccounts.state.isLoggedIn) {
            console.log('Uživatel je přihlášen přes UserAccounts');
            this.hideAuthScreen();
            return;
        }
        
        // Pokud uživatel není přihlášen, zobrazíme přihlašovací obrazovku
        console.log('Uživatel není přihlášen, zobrazuji přihlašovací obrazovku');
        this.showAuthScreen();
    },
    
    // Zobrazení přihlašovací obrazovky
    showAuthScreen() {
        console.log('Zobrazení přihlašovací obrazovky');
        
        // Kontrola, zda již obrazovka existuje
        if (document.getElementById('authScreen')) {
            document.getElementById('authScreen').style.display = 'flex';
            this.state.isVisible = true;
            return;
        }
        
        // Vytvoření přihlašovací obrazovky
        const authScreen = document.createElement('div');
        authScreen.id = 'authScreen';
        authScreen.className = 'auth-screen';
        
        // Nastavení obsahu
        authScreen.innerHTML = `
            <div class="auth-container">
                <div class="auth-header">
                    <h1>AI Mapa</h1>
                    <p>Pro pokračování se prosím přihlaste nebo zaregistrujte</p>
                </div>
                
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Přihlášení</button>
                    <button class="auth-tab" data-tab="register">Registrace</button>
                </div>
                
                <div class="auth-content">
                    <div class="auth-form login-form active">
                        <div class="form-group">
                            <label for="loginEmail">E-mail</label>
                            <input type="email" id="loginEmail" placeholder="Zadejte e-mail">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Heslo</label>
                            <input type="password" id="loginPassword" placeholder="Zadejte heslo">
                        </div>
                        <div class="form-actions">
                            <button id="loginButton" class="auth-button">Přihlásit se</button>
                        </div>
                        <div class="auth-message" id="loginMessage"></div>
                    </div>
                    
                    <div class="auth-form register-form">
                        <div class="form-group">
                            <label for="registerUsername">Uživatelské jméno</label>
                            <input type="text" id="registerUsername" placeholder="Zadejte uživatelské jméno">
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">E-mail</label>
                            <input type="email" id="registerEmail" placeholder="Zadejte e-mail">
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Heslo</label>
                            <input type="password" id="registerPassword" placeholder="Zadejte heslo">
                        </div>
                        <div class="form-group">
                            <label for="registerPasswordConfirm">Potvrzení hesla</label>
                            <input type="password" id="registerPasswordConfirm" placeholder="Potvrďte heslo">
                        </div>
                        <div class="form-actions">
                            <button id="registerButton" class="auth-button">Zaregistrovat se</button>
                        </div>
                        <div class="auth-message" id="registerMessage"></div>
                    </div>
                </div>
                
                <div class="auth-footer">
                    <p>© 2025 AI Mapa - Všechna práva vyhrazena</p>
                </div>
            </div>
        `;
        
        // Přidání do dokumentu
        document.body.appendChild(authScreen);
        
        // Nastavení posluchačů událostí
        this.setupFormEventListeners();
        
        // Nastavení stavu
        this.state.isVisible = true;
    },
    
    // Skrytí přihlašovací obrazovky
    hideAuthScreen() {
        console.log('Skrytí přihlašovací obrazovky');
        
        const authScreen = document.getElementById('authScreen');
        if (authScreen) {
            authScreen.style.display = 'none';
        }
        
        this.state.isVisible = false;
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
                this.showAuthScreen();
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
        
        // Přihlášení přes Supabase
        if (typeof SupabaseClient !== 'undefined') {
            try {
                const result = await SupabaseClient.signIn(email, password);
                
                if (result.success) {
                    console.log('Uživatel byl úspěšně přihlášen přes Supabase');
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
        
        // Přihlášení přes UserAccounts
        if (typeof UserAccounts !== 'undefined') {
            try {
                const result = UserAccounts.login(email, password);
                
                if (result.success) {
                    console.log('Uživatel byl úspěšně přihlášen přes UserAccounts');
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
        if (typeof SupabaseClient === 'undefined' && typeof UserAccounts === 'undefined') {
            console.error('Není dostupný žádný autentizační systém');
            this.showMessage('loginMessage', 'Není dostupný žádný autentizační systém', 'error');
        }
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
        
        // Registrace přes Supabase
        if (typeof SupabaseClient !== 'undefined') {
            try {
                const result = await SupabaseClient.signUp(email, password, username);
                
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
        if (typeof SupabaseClient === 'undefined' && typeof UserAccounts === 'undefined') {
            console.error('Není dostupný žádný autentizační systém');
            this.showMessage('registerMessage', 'Není dostupný žádný autentizační systém', 'error');
        }
    },
    
    // Zobrazení zprávy
    showMessage(elementId, message, type = 'info') {
        console.log(`Zobrazení zprávy (${type}):`, message);
        
        const messageElement = document.getElementById(elementId);
        if (!messageElement) return;
        
        messageElement.textContent = message;
        messageElement.className = 'auth-message ' + type;
        
        // Automatické skrytí zprávy po 5 sekundách
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'auth-message';
        }, 5000);
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    AuthScreen.init();
});
