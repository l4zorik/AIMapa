/**
 * Bezpečnostní utility pro AIMapa
 * Verze 0.3.8.4
 */

const SecurityUtils = {
    // Stav modulu
    state: {
        isInitialized: false,
        csrfToken: null,
        loginAttempts: {},
        securitySettings: {
            maxLoginAttempts: 5,
            lockoutTime: 15 * 60 * 1000, // 15 minut v milisekundách
            passwordMinLength: 8,
            passwordRequireUppercase: true,
            passwordRequireLowercase: true,
            passwordRequireNumbers: true,
            passwordRequireSpecial: true,
            sessionTimeout: 60 * 60 * 1000, // 1 hodina v milisekundách
            encryptLocalStorage: true
        }
    },
    
    // Inicializace modulu
    init() {
        console.log('Inicializace bezpečnostních utilit...');
        
        // Generování CSRF tokenu
        this.generateCsrfToken();
        
        // Načtení bezpečnostních nastavení
        this.loadSecuritySettings();
        
        // Nastavení posluchačů událostí
        this.setupEventListeners();
        
        // Kontrola session timeoutu
        this.checkSessionTimeout();
        
        // Nastavení bezpečnostních hlaviček
        this.setupSecurityHeaders();
        
        this.state.isInitialized = true;
        console.log('Bezpečnostní utility byly inicializovány');
    },
    
    // Generování CSRF tokenu
    generateCsrfToken() {
        // Generování náhodného tokenu
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        this.state.csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        
        // Uložení tokenu do localStorage
        this.secureLocalStorageSet('csrfToken', this.state.csrfToken);
        
        console.log('CSRF token byl vygenerován');
    },
    
    // Získání CSRF tokenu
    getCsrfToken() {
        return this.state.csrfToken;
    },
    
    // Validace CSRF tokenu
    validateCsrfToken(token) {
        return token === this.state.csrfToken;
    },
    
    // Načtení bezpečnostních nastavení
    loadSecuritySettings() {
        const savedSettings = this.secureLocalStorageGet('securitySettings');
        if (savedSettings) {
            this.state.securitySettings = { ...this.state.securitySettings, ...savedSettings };
        }
    },
    
    // Uložení bezpečnostních nastavení
    saveSecuritySettings(settings) {
        this.state.securitySettings = { ...this.state.securitySettings, ...settings };
        this.secureLocalStorageSet('securitySettings', this.state.securitySettings);
    },
    
    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Posluchač pro přihlášení
        document.addEventListener('authStateChanged', (event) => {
            if (event.detail.isLoggedIn) {
                // Reset počtu pokusů o přihlášení
                this.resetLoginAttempts(event.detail.user.email);
                
                // Nastavení časovače pro session timeout
                this.setupSessionTimeout();
            }
        });
        
        // Posluchač pro aktivitu uživatele
        ['click', 'keypress', 'scroll', 'mousemove'].forEach(eventType => {
            document.addEventListener(eventType, this.handleUserActivity.bind(this));
        });
    },
    
    // Zpracování aktivity uživatele
    handleUserActivity() {
        // Obnovení časovače pro session timeout
        this.setupSessionTimeout();
    },
    
    // Nastavení časovače pro session timeout
    setupSessionTimeout() {
        // Zrušení předchozího časovače
        if (this.sessionTimeoutTimer) {
            clearTimeout(this.sessionTimeoutTimer);
        }
        
        // Nastavení nového časovače
        this.sessionTimeoutTimer = setTimeout(() => {
            // Kontrola, zda je uživatel přihlášen
            if (typeof SupabaseAuth !== 'undefined' && SupabaseAuth.state.isLoggedIn) {
                console.log('Session timeout - odhlašuji uživatele');
                SupabaseAuth.logout();
                
                // Zobrazení notifikace
                if (typeof SupabaseAuth.showNotification === 'function') {
                    SupabaseAuth.showNotification('Byli jste odhlášeni z důvodu neaktivity', 'info');
                }
            }
        }, this.state.securitySettings.sessionTimeout);
        
        // Uložení času poslední aktivity
        this.secureLocalStorageSet('lastActivity', Date.now());
    },
    
    // Kontrola session timeoutu při načtení stránky
    checkSessionTimeout() {
        const lastActivity = this.secureLocalStorageGet('lastActivity');
        if (lastActivity) {
            const now = Date.now();
            const elapsed = now - lastActivity;
            
            // Pokud uplynul čas pro session timeout, odhlásíme uživatele
            if (elapsed > this.state.securitySettings.sessionTimeout) {
                console.log('Session timeout při načtení stránky - odhlašuji uživatele');
                
                // Odhlášení uživatele
                if (typeof SupabaseAuth !== 'undefined' && SupabaseAuth.state.isLoggedIn) {
                    SupabaseAuth.logout();
                }
                
                // Odstranění informací o poslední aktivitě
                this.secureLocalStorageRemove('lastActivity');
            } else {
                // Obnovení časovače
                this.setupSessionTimeout();
            }
        }
    },
    
    // Nastavení bezpečnostních hlaviček
    setupSecurityHeaders() {
        // Tato funkce je pouze informativní, skutečné hlavičky musí být nastaveny na serveru
        console.log('Bezpečnostní hlavičky by měly být nastaveny na serveru');
    },
    
    // Validace hesla
    validatePassword(password) {
        const settings = this.state.securitySettings;
        const errors = [];
        
        // Kontrola délky hesla
        if (password.length < settings.passwordMinLength) {
            errors.push(`Heslo musí mít alespoň ${settings.passwordMinLength} znaků`);
        }
        
        // Kontrola velkých písmen
        if (settings.passwordRequireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Heslo musí obsahovat alespoň jedno velké písmeno');
        }
        
        // Kontrola malých písmen
        if (settings.passwordRequireLowercase && !/[a-z]/.test(password)) {
            errors.push('Heslo musí obsahovat alespoň jedno malé písmeno');
        }
        
        // Kontrola čísel
        if (settings.passwordRequireNumbers && !/[0-9]/.test(password)) {
            errors.push('Heslo musí obsahovat alespoň jedno číslo');
        }
        
        // Kontrola speciálních znaků
        if (settings.passwordRequireSpecial && !/[^A-Za-z0-9]/.test(password)) {
            errors.push('Heslo musí obsahovat alespoň jeden speciální znak');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    // Přidání pokusu o přihlášení
    addLoginAttempt(email) {
        if (!email) return;
        
        // Inicializace počtu pokusů pro daný email
        if (!this.state.loginAttempts[email]) {
            this.state.loginAttempts[email] = {
                count: 0,
                lastAttempt: Date.now(),
                lockedUntil: null
            };
        }
        
        const attempts = this.state.loginAttempts[email];
        
        // Kontrola, zda je účet uzamčen
        if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
            const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
            return {
                locked: true,
                remainingTime: remainingTime,
                message: `Účet je uzamčen. Zkuste to znovu za ${remainingTime} minut.`
            };
        }
        
        // Přidání pokusu
        attempts.count++;
        attempts.lastAttempt = Date.now();
        
        // Kontrola, zda je překročen maximální počet pokusů
        if (attempts.count >= this.state.securitySettings.maxLoginAttempts) {
            attempts.lockedUntil = Date.now() + this.state.securitySettings.lockoutTime;
            const remainingTime = Math.ceil(this.state.securitySettings.lockoutTime / 1000 / 60);
            
            console.log(`Účet ${email} byl uzamčen na ${remainingTime} minut`);
            
            return {
                locked: true,
                remainingTime: remainingTime,
                message: `Překročen maximální počet pokusů o přihlášení. Účet je uzamčen na ${remainingTime} minut.`
            };
        }
        
        return {
            locked: false,
            remainingAttempts: this.state.securitySettings.maxLoginAttempts - attempts.count,
            message: `Zbývá ${this.state.securitySettings.maxLoginAttempts - attempts.count} pokusů o přihlášení.`
        };
    },
    
    // Reset počtu pokusů o přihlášení
    resetLoginAttempts(email) {
        if (!email) return;
        
        if (this.state.loginAttempts[email]) {
            this.state.loginAttempts[email] = {
                count: 0,
                lastAttempt: null,
                lockedUntil: null
            };
        }
    },
    
    // Kontrola, zda je účet uzamčen
    isAccountLocked(email) {
        if (!email || !this.state.loginAttempts[email]) return false;
        
        const attempts = this.state.loginAttempts[email];
        
        // Kontrola, zda je účet uzamčen
        if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
            const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
            return {
                locked: true,
                remainingTime: remainingTime,
                message: `Účet je uzamčen. Zkuste to znovu za ${remainingTime} minut.`
            };
        }
        
        return {
            locked: false
        };
    },
    
    // Bezpečné uložení do localStorage s šifrováním
    secureLocalStorageSet(key, value) {
        try {
            // Převod hodnoty na řetězec
            const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
            
            // Šifrování hodnoty, pokud je povoleno
            if (this.state.securitySettings.encryptLocalStorage) {
                // Generování náhodného klíče pro šifrování
                const encryptionKey = this.getEncryptionKey();
                
                // Šifrování hodnoty
                const encryptedValue = this.encrypt(valueStr, encryptionKey);
                
                // Uložení šifrované hodnoty
                localStorage.setItem(`secure_${key}`, encryptedValue);
            } else {
                // Uložení hodnoty bez šifrování
                localStorage.setItem(key, valueStr);
            }
        } catch (error) {
            console.error('Chyba při ukládání do localStorage:', error);
        }
    },
    
    // Bezpečné načtení z localStorage s dešifrováním
    secureLocalStorageGet(key) {
        try {
            // Načtení hodnoty
            let value;
            
            // Pokud je povoleno šifrování, načteme šifrovanou hodnotu
            if (this.state.securitySettings.encryptLocalStorage) {
                const encryptedValue = localStorage.getItem(`secure_${key}`);
                
                if (!encryptedValue) return null;
                
                // Získání klíče pro dešifrování
                const encryptionKey = this.getEncryptionKey();
                
                // Dešifrování hodnoty
                value = this.decrypt(encryptedValue, encryptionKey);
            } else {
                value = localStorage.getItem(key);
            }
            
            if (!value) return null;
            
            // Pokus o parsování JSON
            try {
                return JSON.parse(value);
            } catch (e) {
                // Pokud nejde o JSON, vrátíme hodnotu jako řetězec
                return value;
            }
        } catch (error) {
            console.error('Chyba při načítání z localStorage:', error);
            return null;
        }
    },
    
    // Bezpečné odstranění z localStorage
    secureLocalStorageRemove(key) {
        try {
            // Odstranění hodnoty
            if (this.state.securitySettings.encryptLocalStorage) {
                localStorage.removeItem(`secure_${key}`);
            } else {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.error('Chyba při odstraňování z localStorage:', error);
        }
    },
    
    // Získání klíče pro šifrování
    getEncryptionKey() {
        // Použití CSRF tokenu jako klíče pro šifrování
        return this.state.csrfToken || 'default-encryption-key';
    },
    
    // Šifrování hodnoty
    encrypt(text, key) {
        // Jednoduchá implementace šifrování pro demonstrační účely
        // V produkčním prostředí by měla být použita silnější metoda
        
        // Převod klíče na číslo
        let keySum = 0;
        for (let i = 0; i < key.length; i++) {
            keySum += key.charCodeAt(i);
        }
        
        // Šifrování textu
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const encryptedCharCode = charCode + (keySum % 128);
            result += String.fromCharCode(encryptedCharCode);
        }
        
        // Převod na base64
        return btoa(result);
    },
    
    // Dešifrování hodnoty
    decrypt(encryptedText, key) {
        try {
            // Převod z base64
            const text = atob(encryptedText);
            
            // Převod klíče na číslo
            let keySum = 0;
            for (let i = 0; i < key.length; i++) {
                keySum += key.charCodeAt(i);
            }
            
            // Dešifrování textu
            let result = '';
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i);
                const decryptedCharCode = charCode - (keySum % 128);
                result += String.fromCharCode(decryptedCharCode);
            }
            
            return result;
        } catch (error) {
            console.error('Chyba při dešifrování:', error);
            return null;
        }
    },
    
    // Sanitizace vstupu
    sanitizeInput(input) {
        if (!input) return '';
        
        // Odstranění HTML tagů
        const sanitized = input.replace(/<[^>]*>/g, '');
        
        // Escapování speciálních znaků
        return sanitized
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },
    
    // Generování bezpečného hesla
    generateSecurePassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let password = '';
        
        // Generování náhodného hesla
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        return password;
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    SecurityUtils.init();
});
