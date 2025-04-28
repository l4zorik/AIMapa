/**
 * Testovací skript pro integraci Auth0 s aplikací
 * Verze 0.3.8.5
 */

// Testovací modul pro integraci Auth0 s aplikací
const Auth0IntegrationTest = {
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

        console.log('Spouštím testy integrace Auth0 s aplikací...');
        this.logTestInfo('Spuštění testů integrace Auth0 s aplikací');

        // Test 1: Kontrola načtení Auth0Auth modulu
        await this.testAuth0AuthLoaded();

        // Test 2: Kontrola integrace Auth0 s AuthScreen
        await this.testAuthScreenIntegration();

        // Test 3: Kontrola integrace Auth0 s HybridAuth
        await this.testHybridAuthIntegration();

        // Test 4: Kontrola integrace Auth0 s UserProfile
        await this.testUserProfileIntegration();

        // Zobrazení výsledků
        this.displayResults();

        this.state.isRunning = false;
    },

    // Test 1: Kontrola načtení Auth0Auth modulu
    async testAuth0AuthLoaded() {
        try {
            this.logTestInfo('Test 1: Kontrola načtení Auth0Auth modulu');
            
            if (typeof Auth0Auth === 'undefined') {
                this.logTestFailure('Auth0Auth modul není dostupný');
                return false;
            }
            
            if (!Auth0Auth.state) {
                this.logTestFailure('Auth0Auth.state není dostupný');
                return false;
            }
            
            if (!Auth0Auth.config) {
                this.logTestFailure('Auth0Auth.config není dostupný');
                return false;
            }
            
            if (typeof Auth0Auth.init !== 'function') {
                this.logTestFailure('Auth0Auth.init není funkce');
                return false;
            }
            
            if (typeof Auth0Auth.login !== 'function') {
                this.logTestFailure('Auth0Auth.login není funkce');
                return false;
            }
            
            if (typeof Auth0Auth.logout !== 'function') {
                this.logTestFailure('Auth0Auth.logout není funkce');
                return false;
            }
            
            if (typeof Auth0Auth.checkCurrentUser !== 'function') {
                this.logTestFailure('Auth0Auth.checkCurrentUser není funkce');
                return false;
            }
            
            this.logTestSuccess('Auth0Auth modul je správně načten');
            return true;
        } catch (error) {
            this.logTestError('Test 1: Kontrola načtení Auth0Auth modulu', error);
            return false;
        }
    },

    // Test 2: Kontrola integrace Auth0 s AuthScreen
    async testAuthScreenIntegration() {
        try {
            this.logTestInfo('Test 2: Kontrola integrace Auth0 s AuthScreen');
            
            // Načtení AuthScreen modulu
            await this.loadScript('/app/auth-screen.js');
            
            if (typeof AuthScreen === 'undefined') {
                this.logTestFailure('AuthScreen modul není dostupný');
                return false;
            }
            
            if (typeof AuthScreen.showAuthScreen !== 'function') {
                this.logTestFailure('AuthScreen.showAuthScreen není funkce');
                return false;
            }
            
            if (typeof AuthScreen.addAuth0Button !== 'function') {
                this.logTestFailure('AuthScreen.addAuth0Button není funkce');
                return false;
            }
            
            this.logTestSuccess('AuthScreen modul je správně načten');
            
            // Kontrola integrace s Auth0
            const authScreenCode = await this.fetchFileContent('/app/auth-screen.js');
            
            if (!authScreenCode.includes('Auth0Auth')) {
                this.logTestFailure('AuthScreen modul neobsahuje integraci s Auth0Auth');
                return false;
            }
            
            if (!authScreenCode.includes('Auth0Auth.login')) {
                this.logTestFailure('AuthScreen modul neobsahuje volání Auth0Auth.login');
                return false;
            }
            
            this.logTestSuccess('AuthScreen modul obsahuje integraci s Auth0Auth');
            return true;
        } catch (error) {
            this.logTestError('Test 2: Kontrola integrace Auth0 s AuthScreen', error);
            return false;
        }
    },

    // Test 3: Kontrola integrace Auth0 s HybridAuth
    async testHybridAuthIntegration() {
        try {
            this.logTestInfo('Test 3: Kontrola integrace Auth0 s HybridAuth');
            
            // Načtení HybridAuth modulu
            await this.loadScript('/app/hybrid-auth.js');
            
            if (typeof HybridAuth === 'undefined') {
                this.logTestFailure('HybridAuth modul není dostupný');
                return false;
            }
            
            if (typeof HybridAuth.selectAuthProvider !== 'function') {
                this.logTestFailure('HybridAuth.selectAuthProvider není funkce');
                return false;
            }
            
            this.logTestSuccess('HybridAuth modul je správně načten');
            
            // Kontrola integrace s Auth0
            const hybridAuthCode = await this.fetchFileContent('/app/hybrid-auth.js');
            
            if (!hybridAuthCode.includes('Auth0Auth')) {
                this.logTestFailure('HybridAuth modul neobsahuje integraci s Auth0Auth');
                return false;
            }
            
            if (!hybridAuthCode.includes('window.Auth0Auth')) {
                this.logTestFailure('HybridAuth modul neobsahuje odkaz na window.Auth0Auth');
                return false;
            }
            
            this.logTestSuccess('HybridAuth modul obsahuje integraci s Auth0Auth');
            return true;
        } catch (error) {
            this.logTestError('Test 3: Kontrola integrace Auth0 s HybridAuth', error);
            return false;
        }
    },

    // Test 4: Kontrola integrace Auth0 s UserProfile
    async testUserProfileIntegration() {
        try {
            this.logTestInfo('Test 4: Kontrola integrace Auth0 s UserProfile');
            
            // Načtení UserProfile modulu
            await this.loadScript('/app/user-profile.js');
            
            if (typeof UserProfile === 'undefined') {
                this.logTestFailure('UserProfile modul není dostupný');
                return false;
            }
            
            this.logTestSuccess('UserProfile modul je správně načten');
            
            // Kontrola integrace s Auth0
            const userProfileCode = await this.fetchFileContent('/app/user-profile.js');
            
            if (!userProfileCode.includes('Auth0Auth') && !userProfileCode.includes('HybridAuth')) {
                this.logTestFailure('UserProfile modul neobsahuje integraci s Auth0Auth ani HybridAuth');
                return false;
            }
            
            this.logTestSuccess('UserProfile modul obsahuje integraci s autentizačními moduly');
            return true;
        } catch (error) {
            this.logTestError('Test 4: Kontrola integrace Auth0 s UserProfile', error);
            return false;
        }
    },

    // Načtení skriptu
    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Kontrola, zda již skript není načten
            if (document.querySelector(\`script[src="\${src}"]\`)) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = resolve;
            script.onerror = reject;
            
            document.head.appendChild(script);
        });
    },

    // Načtení obsahu souboru
    async fetchFileContent(path) {
        try {
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(\`Nepodařilo se načíst soubor \${path}\`);
            }
            
            return await response.text();
        } catch (error) {
            console.error(\`Chyba při načítání souboru \${path}:\`, error);
            throw error;
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
        resultsElement.id = 'auth0IntegrationTestResults';
        resultsElement.style.position = 'fixed';
        resultsElement.style.top = '210px';
        resultsElement.style.right = '10px';
        resultsElement.style.width = '400px';
        resultsElement.style.maxHeight = '80vh';
        resultsElement.style.overflowY = 'auto';
        resultsElement.style.backgroundColor = '#f8f9fa';
        resultsElement.style.border = '1px solid #dee2e6';
        resultsElement.style.borderRadius = '4px';
        resultsElement.style.padding = '10px';
        resultsElement.style.zIndex = '9996';
        resultsElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        
        // Vytvoření hlavičky
        const header = document.createElement('div');
        header.style.borderBottom = '1px solid #dee2e6';
        header.style.paddingBottom = '10px';
        header.style.marginBottom = '10px';
        header.style.fontWeight = 'bold';
        header.style.fontSize = '16px';
        header.innerHTML = 'Výsledky testů integrace Auth0 s aplikací';
        
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
    console.log('Načítání testovacího skriptu pro integraci Auth0 s aplikací...');
    
    // Vytvoření tlačítka pro spuštění testů
    const testButton = document.createElement('button');
    testButton.id = 'runAuth0IntegrationTestsButton';
    testButton.textContent = 'Otestovat integraci Auth0';
    testButton.style.position = 'fixed';
    testButton.style.top = '170px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '8px 16px';
    testButton.style.backgroundColor = '#fd7e14';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', () => {
        Auth0IntegrationTest.runTests().catch(error => {
            console.error('Chyba při spouštění testů integrace Auth0 s aplikací:', error);
        });
    });
    
    document.body.appendChild(testButton);
    
    console.log('Testovací skript pro integraci Auth0 s aplikací byl načten');
});

// Export modulu
window.Auth0IntegrationTest = Auth0IntegrationTest;
