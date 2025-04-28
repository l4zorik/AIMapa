/**
 * Vylepšený testovací skript pro Auth0 přihlašování
 * Verze 0.3.8.5
 */

// Testovací modul pro Auth0
const Auth0Test = {
    // Stav modulu
    state: {
        isRunning: false,
        testResults: [],
        startTime: null
    },

    // Spuštění testů
    async runTests() {
        if (this.state.isRunning) {
            console.log('Testy již běží');
            return;
        }

        this.state.isRunning = true;
        this.state.testResults = [];
        this.state.startTime = new Date();

        console.log('Spouštím testy Auth0 přihlašování...');
        this.logTestInfo('Spuštění testů Auth0 přihlašování');

        // Test 1: Kontrola načtení Auth0 SDK
        await this.testAuth0SdkLoaded();

        // Test 2: Kontrola inicializace Auth0 klienta
        await this.testAuth0ClientInitialization();

        // Test 3: Kontrola přihlašovacího URL
        await this.testLoginUrl();

        // Test 4: Kontrola zpracování callbacku
        await this.testCallbackHandling();

        // Test 5: Kontrola přihlášení uživatele
        await this.testUserAuthentication();

        // Zobrazení výsledků
        this.displayResults();

        this.state.isRunning = false;
    },

    // Test 1: Kontrola načtení Auth0 SDK
    async testAuth0SdkLoaded() {
        try {
            this.logTestInfo('Test 1: Kontrola načtení Auth0 SDK');
            
            if (typeof createAuth0Client !== 'undefined') {
                this.logTestSuccess('Auth0 SDK je načten');
                return true;
            } else {
                this.logTestFailure('Auth0 SDK není načten');
                return false;
            }
        } catch (error) {
            this.logTestError('Test 1: Kontrola načtení Auth0 SDK', error);
            return false;
        }
    },

    // Test 2: Kontrola inicializace Auth0 klienta
    async testAuth0ClientInitialization() {
        try {
            this.logTestInfo('Test 2: Kontrola inicializace Auth0 klienta');
            
            if (typeof Auth0Auth === 'undefined') {
                this.logTestFailure('Auth0Auth modul není dostupný');
                return false;
            }
            
            if (!Auth0Auth.state.auth0Client) {
                this.logTestInfo('Auth0 klient není inicializován, pokouším se ho inicializovat...');
                
                const success = await Auth0Auth.loadAuth0Client();
                
                if (success) {
                    this.logTestSuccess('Auth0 klient byl úspěšně inicializován');
                    return true;
                } else {
                    this.logTestFailure('Nepodařilo se inicializovat Auth0 klienta');
                    return false;
                }
            } else {
                this.logTestSuccess('Auth0 klient je již inicializován');
                return true;
            }
        } catch (error) {
            this.logTestError('Test 2: Kontrola inicializace Auth0 klienta', error);
            return false;
        }
    },

    // Test 3: Kontrola přihlašovacího URL
    async testLoginUrl() {
        try {
            this.logTestInfo('Test 3: Kontrola přihlašovacího URL');
            
            if (typeof Auth0Auth === 'undefined') {
                this.logTestFailure('Auth0Auth modul není dostupný');
                return false;
            }
            
            // Určení správné URL pro přesměrování
            let redirectUri = Auth0Auth.config.redirectUri;
            
            // Kontrola, zda jsme na vývojové verzi na Netlify
            if (window.location.href.includes('devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app')) {
                redirectUri = Auth0Auth.config.netlifyDevRedirectUri;
            } 
            // Kontrola, zda jsme na localhost:3000
            else if (window.location.href.includes('localhost:3000')) {
                redirectUri = Auth0Auth.config.localDevRedirectUri;
            }
            
            // Vytvoření kompletní URL pro přesměrování
            const authUrl = \`https://\${Auth0Auth.config.domain}/authorize?\` +
                \`client_id=\${Auth0Auth.config.clientId}&\` +
                \`redirect_uri=\${encodeURIComponent(redirectUri)}&\` +
                \`response_type=code&\` +
                \`scope=\${encodeURIComponent(Auth0Auth.config.scope)}\`;
            
            this.logTestInfo('Přihlašovací URL: ' + authUrl);
            
            if (authUrl.includes(Auth0Auth.config.domain) && 
                authUrl.includes(Auth0Auth.config.clientId) && 
                authUrl.includes(encodeURIComponent(redirectUri))) {
                this.logTestSuccess('Přihlašovací URL je správně sestavena');
                return true;
            } else {
                this.logTestFailure('Přihlašovací URL není správně sestavena');
                return false;
            }
        } catch (error) {
            this.logTestError('Test 3: Kontrola přihlašovacího URL', error);
            return false;
        }
    },

    // Test 4: Kontrola zpracování callbacku
    async testCallbackHandling() {
        try {
            this.logTestInfo('Test 4: Kontrola zpracování callbacku');
            
            if (typeof Auth0Auth === 'undefined') {
                this.logTestFailure('Auth0Auth modul není dostupný');
                return false;
            }
            
            // Kontrola, zda je v URL autorizační kód
            const query = window.location.search;
            const hasAuthCode = query.includes('code=') && query.includes('state=');
            
            if (hasAuthCode) {
                this.logTestInfo('Detekován autorizační kód v URL, kontroluji zpracování callbacku...');
                
                // Kontrola, zda je uživatel přihlášen
                const isLoggedIn = await Auth0Auth.checkCurrentUser();
                
                if (isLoggedIn) {
                    this.logTestSuccess('Callback byl úspěšně zpracován a uživatel je přihlášen');
                    return true;
                } else {
                    this.logTestFailure('Callback byl zpracován, ale uživatel není přihlášen');
                    return false;
                }
            } else {
                this.logTestInfo('V URL není autorizační kód, test přeskočen');
                return true;
            }
        } catch (error) {
            this.logTestError('Test 4: Kontrola zpracování callbacku', error);
            return false;
        }
    },

    // Test 5: Kontrola přihlášení uživatele
    async testUserAuthentication() {
        try {
            this.logTestInfo('Test 5: Kontrola přihlášení uživatele');
            
            if (typeof Auth0Auth === 'undefined') {
                this.logTestFailure('Auth0Auth modul není dostupný');
                return false;
            }
            
            // Kontrola, zda je uživatel přihlášen
            const isLoggedIn = await Auth0Auth.checkCurrentUser();
            
            if (isLoggedIn) {
                const user = Auth0Auth.state.currentUser;
                this.logTestSuccess('Uživatel je přihlášen: ' + (user.email || user.name || 'auth0user'));
                return true;
            } else {
                this.logTestInfo('Uživatel není přihlášen, pokouším se ho přihlásit...');
                
                // Vytvoření testovacího tlačítka pro přihlášení
                const loginButton = document.createElement('button');
                loginButton.id = 'auth0TestLoginButton';
                loginButton.textContent = 'Přihlásit se pro test';
                loginButton.style.position = 'fixed';
                loginButton.style.top = '50px';
                loginButton.style.right = '10px';
                loginButton.style.zIndex = '9999';
                loginButton.style.padding = '8px 16px';
                loginButton.style.backgroundColor = '#4CAF50';
                loginButton.style.color = 'white';
                loginButton.style.border = 'none';
                loginButton.style.borderRadius = '4px';
                loginButton.style.cursor = 'pointer';
                
                loginButton.addEventListener('click', () => {
                    Auth0Auth.login().catch(error => {
                        console.error('Chyba při přihlašování přes Auth0:', error);
                    });
                });
                
                document.body.appendChild(loginButton);
                
                this.logTestInfo('Pro dokončení testu klikněte na tlačítko "Přihlásit se pro test"');
                return false;
            }
        } catch (error) {
            this.logTestError('Test 5: Kontrola přihlášení uživatele', error);
            return false;
        }
    },

    // Logování informací o testu
    logTestInfo(message) {
        console.log('%c[INFO] ' + message, 'color: blue');
        this.state.testResults.push({ type: 'info', message });
    },

    // Logování úspěšného testu
    logTestSuccess(message) {
        console.log('%c[SUCCESS] ' + message, 'color: green');
        this.state.testResults.push({ type: 'success', message });
    },

    // Logování neúspěšného testu
    logTestFailure(message) {
        console.log('%c[FAILURE] ' + message, 'color: red');
        this.state.testResults.push({ type: 'failure', message });
    },

    // Logování chyby testu
    logTestError(testName, error) {
        console.error('[ERROR] ' + testName, error);
        this.state.testResults.push({ 
            type: 'error', 
            message: testName + ': ' + (error.message || 'Neznámá chyba'),
            error
        });
    },

    // Zobrazení výsledků testů
    displayResults() {
        // Výpočet doby trvání testů
        const duration = new Date() - this.state.startTime;
        
        // Počet úspěšných a neúspěšných testů
        const successCount = this.state.testResults.filter(r => r.type === 'success').length;
        const failureCount = this.state.testResults.filter(r => r.type === 'failure').length;
        const errorCount = this.state.testResults.filter(r => r.type === 'error').length;
        
        // Vytvoření elementu pro zobrazení výsledků
        const resultsElement = document.createElement('div');
        resultsElement.id = 'auth0TestResults';
        resultsElement.style.position = 'fixed';
        resultsElement.style.top = '100px';
        resultsElement.style.right = '10px';
        resultsElement.style.width = '400px';
        resultsElement.style.maxHeight = '80vh';
        resultsElement.style.overflowY = 'auto';
        resultsElement.style.backgroundColor = '#f8f9fa';
        resultsElement.style.border = '1px solid #dee2e6';
        resultsElement.style.borderRadius = '4px';
        resultsElement.style.padding = '10px';
        resultsElement.style.zIndex = '9998';
        resultsElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        
        // Vytvoření hlavičky
        const header = document.createElement('div');
        header.style.borderBottom = '1px solid #dee2e6';
        header.style.paddingBottom = '10px';
        header.style.marginBottom = '10px';
        header.style.fontWeight = 'bold';
        header.style.fontSize = '16px';
        header.innerHTML = 'Výsledky testů Auth0 přihlašování';
        
        // Vytvoření souhrnu
        const summary = document.createElement('div');
        summary.style.marginBottom = '10px';
        summary.innerHTML = \`
            <div>Doba trvání: \${duration}ms</div>
            <div style="color: green">Úspěšné testy: \${successCount}</div>
            <div style="color: red">Neúspěšné testy: \${failureCount}</div>
            <div style="color: red">Chyby: \${errorCount}</div>
        \`;
        
        // Vytvoření seznamu výsledků
        const list = document.createElement('div');
        
        this.state.testResults.forEach((result, index) => {
            const item = document.createElement('div');
            item.style.marginBottom = '5px';
            item.style.padding = '5px';
            item.style.borderRadius = '4px';
            
            switch (result.type) {
                case 'info':
                    item.style.backgroundColor = '#e3f2fd';
                    item.style.color = '#0d47a1';
                    break;
                case 'success':
                    item.style.backgroundColor = '#e8f5e9';
                    item.style.color = '#1b5e20';
                    break;
                case 'failure':
                    item.style.backgroundColor = '#ffebee';
                    item.style.color = '#b71c1c';
                    break;
                case 'error':
                    item.style.backgroundColor = '#ffebee';
                    item.style.color = '#b71c1c';
                    break;
            }
            
            item.textContent = \`\${index + 1}. \${result.message}\`;
            
            list.appendChild(item);
        });
        
        // Přidání tlačítka pro zavření
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Zavřít';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#6c757d';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        
        closeButton.addEventListener('click', () => {
            document.body.removeChild(resultsElement);
        });
        
        // Sestavení elementu
        resultsElement.appendChild(header);
        resultsElement.appendChild(summary);
        resultsElement.appendChild(list);
        resultsElement.appendChild(closeButton);
        
        // Přidání elementu do dokumentu
        document.body.appendChild(resultsElement);
    }
};

// Spuštění testů po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    console.log('Načítání testovacího skriptu pro Auth0 přihlašování...');
    
    // Vytvoření tlačítka pro spuštění testů
    const testButton = document.createElement('button');
    testButton.id = 'runAuth0TestsButton';
    testButton.textContent = 'Spustit testy Auth0';
    testButton.style.position = 'fixed';
    testButton.style.top = '90px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '8px 16px';
    testButton.style.backgroundColor = '#007bff';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', () => {
        Auth0Test.runTests().catch(error => {
            console.error('Chyba při spouštění testů Auth0:', error);
        });
    });
    
    document.body.appendChild(testButton);
    
    console.log('Testovací skript pro Auth0 přihlašování byl načten');
});

// Export modulu
window.Auth0Test = Auth0Test;
