/**
 * Lokální autentizační modul pro AIMapa
 * Verze 0.3.8.5
 *
 * Tento modul poskytuje lokální autentizaci pro AIMapa při spuštění na lokálním Node.js serveru.
 * Funguje jako alternativa k Supabase autentizaci, když aplikace běží lokálně.
 */

const LocalAuth = {
    // Stav modulu
    state: {
        isInitialized: false,
        isAuthenticated: false,
        currentUser: null,
        users: [],
        authListeners: []
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu lokální autentizace...');

        // Načtení uživatelů z localStorage
        this.loadUsers();

        // Kontrola, zda je uživatel přihlášen
        this.checkAuthState();

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        this.state.isInitialized = true;
        console.log('Modul lokální autentizace byl inicializován');

        // Oznámení o změně stavu autentizace
        this.notifyAuthStateChange('INITIAL_SESSION');
    },

    // Načtení uživatelů z localStorage
    loadUsers() {
        const savedUsers = localStorage.getItem('localAuthUsers');
        if (savedUsers) {
            try {
                this.state.users = JSON.parse(savedUsers);
                console.log(`Načteno ${this.state.users.length} uživatelů z localStorage`);
            } catch (error) {
                console.error('Chyba při načítání uživatelů z localStorage:', error);
                this.state.users = [];
            }
        } else {
            console.log('Žádní uživatelé nebyli nalezeni v localStorage');
            this.state.users = [];
        }
    },

    // Uložení uživatelů do localStorage
    saveUsers() {
        try {
            localStorage.setItem('localAuthUsers', JSON.stringify(this.state.users));
            console.log(`Uloženo ${this.state.users.length} uživatelů do localStorage`);
        } catch (error) {
            console.error('Chyba při ukládání uživatelů do localStorage:', error);
        }
    },

    // Kontrola, zda je uživatel přihlášen
    checkAuthState() {
        const authToken = localStorage.getItem('localAuthToken');
        if (authToken) {
            try {
                const userData = JSON.parse(atob(authToken.split('.')[1]));
                const user = this.state.users.find(u => u.id === userData.sub);

                if (user) {
                    this.state.isAuthenticated = true;
                    this.state.currentUser = user;
                    console.log('Uživatel je přihlášen:', user.email);
                } else {
                    console.log('Uživatel s ID z tokenu nebyl nalezen');
                    this.state.isAuthenticated = false;
                    this.state.currentUser = null;
                    localStorage.removeItem('localAuthToken');
                }
            } catch (error) {
                console.error('Chyba při kontrole stavu autentizace:', error);
                this.state.isAuthenticated = false;
                this.state.currentUser = null;
                localStorage.removeItem('localAuthToken');
            }
        } else {
            console.log('Žádný autentizační token nebyl nalezen');
            this.state.isAuthenticated = false;
            this.state.currentUser = null;
        }
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Zde můžeme přidat posluchače událostí, pokud budou potřeba
        console.log('Nastavení posluchačů událostí pro lokální autentizaci');
    },

    // Registrace nového uživatele
    async signUp(email, password, metadata = {}) {
        console.log('Registrace nového uživatele:', email);

        // Kontrola, zda uživatel již existuje
        const existingUser = this.state.users.find(u => u.email === email);
        if (existingUser) {
            console.error('Uživatel s tímto emailem již existuje');
            return { error: { message: 'Uživatel s tímto emailem již existuje' } };
        }

        // Vytvoření nového uživatele
        const newUser = {
            id: this.generateUUID(),
            email,
            password: this.hashPassword(password),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            metadata: metadata
        };

        // Přidání uživatele do seznamu
        this.state.users.push(newUser);

        // Uložení uživatelů do localStorage
        this.saveUsers();

        // Automatické přihlášení po registraci
        return this.signIn(email, password);
    },

    // Přihlášení uživatele
    async signIn(email, password) {
        console.log('Přihlašování uživatele:', email);

        // Nalezení uživatele podle emailu
        const user = this.state.users.find(u => u.email === email);
        if (!user) {
            console.error('Uživatel s tímto emailem nebyl nalezen');
            return { error: { message: 'Nesprávný email nebo heslo' } };
        }

        // Kontrola hesla
        if (user.password !== this.hashPassword(password)) {
            console.error('Nesprávné heslo');
            return { error: { message: 'Nesprávný email nebo heslo' } };
        }

        // Vytvoření JWT tokenu
        const token = this.generateToken(user);

        // Uložení tokenu do localStorage
        localStorage.setItem('localAuthToken', token);

        // Aktualizace stavu
        this.state.isAuthenticated = true;
        this.state.currentUser = user;

        // Oznámení o změně stavu autentizace
        this.notifyAuthStateChange('SIGNED_IN');

        return {
            data: {
                user: this.sanitizeUser(user),
                session: {
                    access_token: token
                }
            }
        };
    },

    // Odhlášení uživatele
    async signOut() {
        console.log('Odhlašování uživatele');

        // Odstranění tokenu z localStorage
        localStorage.removeItem('localAuthToken');

        // Aktualizace stavu
        this.state.isAuthenticated = false;
        this.state.currentUser = null;

        // Oznámení o změně stavu autentizace
        this.notifyAuthStateChange('SIGNED_OUT');

        return { data: { user: null } };
    },

    // Získání aktuálního uživatele
    async getUser() {
        if (this.state.isAuthenticated && this.state.currentUser) {
            return {
                data: {
                    user: this.sanitizeUser(this.state.currentUser)
                }
            };
        } else {
            return { data: { user: null } };
        }
    },

    // Resetování hesla
    async resetPassword(email) {
        console.log('Resetování hesla pro uživatele:', email);

        // V lokálním prostředí pouze simulujeme reset hesla
        const user = this.state.users.find(u => u.email === email);
        if (!user) {
            console.error('Uživatel s tímto emailem nebyl nalezen');
            return { error: { message: 'Uživatel s tímto emailem nebyl nalezen' } };
        }

        // V reálné aplikaci bychom zde poslali email s odkazem na reset hesla
        // Pro lokální prostředí pouze vypíšeme zprávu do konzole
        console.log(`Simulace odeslání emailu pro reset hesla na adresu ${email}`);

        return { data: { message: 'Email pro reset hesla byl odeslán' } };
    },

    // Aktualizace uživatelských dat
    async updateUser(userData) {
        if (!this.state.isAuthenticated || !this.state.currentUser) {
            console.error('Uživatel není přihlášen');
            return { error: { message: 'Uživatel není přihlášen' } };
        }

        console.log('Aktualizace uživatelských dat');

        // Nalezení uživatele v seznamu
        const userIndex = this.state.users.findIndex(u => u.id === this.state.currentUser.id);
        if (userIndex === -1) {
            console.error('Uživatel nebyl nalezen v seznamu');
            return { error: { message: 'Uživatel nebyl nalezen' } };
        }

        // Aktualizace uživatelských dat
        const updatedUser = {
            ...this.state.users[userIndex],
            ...userData,
            updated_at: new Date().toISOString()
        };

        // Aktualizace seznamu uživatelů
        this.state.users[userIndex] = updatedUser;

        // Aktualizace aktuálního uživatele
        this.state.currentUser = updatedUser;

        // Uložení uživatelů do localStorage
        this.saveUsers();

        return { data: { user: this.sanitizeUser(updatedUser) } };
    },

    // Přidání posluchače změn stavu autentizace
    onAuthStateChange(callback) {
        console.log('Přidání posluchače změn stavu autentizace');

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
        console.log('Změna stavu autentizace:', event);

        // Vytvoření objektu s daty o události
        const eventData = {
            event,
            session: this.state.isAuthenticated ? {
                user: this.sanitizeUser(this.state.currentUser)
            } : null
        };

        // Volání všech posluchačů
        this.state.authListeners.forEach(callback => {
            try {
                callback(eventData);
            } catch (error) {
                console.error('Chyba při volání posluchače změn stavu autentizace:', error);
            }
        });
    },

    // Pomocné metody

    // Generování UUID
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    // Hashování hesla (v reálné aplikaci by bylo bezpečnější)
    hashPassword(password) {
        // Pro jednoduchost používáme pouze základní hashování
        // V reálné aplikaci by bylo vhodné použít bcrypt nebo podobnou knihovnu
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    },

    // Generování JWT tokenu
    generateToken(user) {
        // Vytvoření hlavičky
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // Vytvoření payloadu
        const payload = {
            sub: user.id,
            email: user.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hodin
        };

        // Kódování hlavičky a payloadu
        const encodedHeader = btoa(JSON.stringify(header));
        const encodedPayload = btoa(JSON.stringify(payload));

        // Vytvoření podpisu (v reálné aplikaci by byl bezpečnější)
        // Pro jednoduchost používáme pouze základní podpis
        const signature = btoa(encodedHeader + encodedPayload + 'secret');

        // Sestavení tokenu
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    },

    // Odstranění citlivých dat z uživatelského objektu
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    LocalAuth.init();
});

// Export modulu
window.LocalAuth = LocalAuth;
