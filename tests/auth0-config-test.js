/**
 * Testovací skript pro kontrolu konfigurace Auth0
 * Verze 0.3.8.5
 */

// Testovací modul pro kontrolu konfigurace Auth0
const Auth0ConfigTest = {
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

        console.log('Spouštím testy konfigurace Auth0...');
        this.logTestInfo('Spuštění testů konfigurace Auth0');

        // Test 1: Kontrola konfigurace v auth_config.json
        await this.testAuthConfigJson();

        // Test 2: Kontrola konfigurace v .env souboru
        await this.testEnvConfig();

        // Test 3: Kontrola konfigurace v Auth0Auth modulu
        await this.testAuth0AuthConfig();

        // Test 4: Kontrola konfigurace v Auth0 dashboardu
        await this.testAuth0Dashboard();

        // Zobrazení výsledků
        this.displayResults();

        this.state.isRunning = false;
    },

    // Test 1: Kontrola konfigurace v auth_config.json
    async testAuthConfigJson() {
        try {
            this.logTestInfo('Test 1: Kontrola konfigurace v auth_config.json');
            
            // Načtení konfigurace z auth_config.json
            const response = await fetch('/auth_config.json');
            
            if (!response.ok) {
                this.logTestFailure('Nepodařilo se načíst auth_config.json');
                return false;
            }
            
            const config = await response.json();
            
            // Kontrola konfigurace
            if (!config.domain) {
                this.logTestFailure('V auth_config.json chybí domain');
                return false;
            }
            
            if (!config.clientId) {
                this.logTestFailure('V auth_config.json chybí clientId');
                return false;
            }
            
            this.logTestSuccess('auth_config.json obsahuje správnou konfiguraci');
            this.logTestInfo('Domain: ' + config.domain);
            this.logTestInfo('ClientId: ' + config.clientId);
            
            return true;
        } catch (error) {
            this.logTestError('Test 1: Kontrola konfigurace v auth_config.json', error);
            return false;
        }
    },

    // Test 2: Kontrola konfigurace v .env souboru
    async testEnvConfig() {
        try {
            this.logTestInfo('Test 2: Kontrola konfigurace v .env souboru');
            
            // Načtení konfigurace ze serveru
            const response = await fetch('/auth/config');
            
            if (!response.ok) {
                this.logTestFailure('Nepodařilo se načíst konfiguraci ze serveru');
                return false;
            }
            
            const config = await response.json();
            
            // Kontrola konfigurace
            if (!config.domain) {
                this.logTestFailure('V konfiguraci ze serveru chybí domain');
                return false;
            }
            
            if (!config.clientId) {
                this.logTestFailure('V konfiguraci ze serveru chybí clientId');
                return false;
            }
            
            if (!config.audience) {
                this.logTestFailure('V konfiguraci ze serveru chybí audience');
                return false;
            }
            
            if (!config.scope) {
                this.logTestFailure('V konfiguraci ze serveru chybí scope');
                return false;
            }
            
            this.logTestSuccess('Konfigurace ze serveru obsahuje správnou konfiguraci');
            this.logTestInfo('Domain: ' + config.domain);
            this.logTestInfo('ClientId: ' + config.clientId);
            this.logTestInfo('Audience: ' + config.audience);
            this.logTestInfo('Scope: ' + config.scope);
            
            return true;
        } catch (error) {
            this.logTestError('Test 2: Kontrola konfigurace v .env souboru', error);
            return false;
        }
    },

    // Test 3: Kontrola konfigurace v Auth0Auth modulu
    async testAuth0AuthConfig() {
        try {
            this.logTestInfo('Test 3: Kontrola konfigurace v Auth0Auth modulu');
            
            if (typeof Auth0Auth === 'undefined') {
                this.logTestFailure('Auth0Auth modul není dostupný');
                return false;
            }
            
            // Kontrola konfigurace
            if (!Auth0Auth.config.domain) {
                this.logTestFailure('V Auth0Auth.config chybí domain');
                return false;
            }
            
            if (!Auth0Auth.config.clientId) {
                this.logTestFailure('V Auth0Auth.config chybí clientId');
                return false;
            }
            
            if (!Auth0Auth.config.redirectUri) {
                this.logTestFailure('V Auth0Auth.config chybí redirectUri');
                return false;
            }
            
            if (!Auth0Auth.config.audience) {
                this.logTestFailure('V Auth0Auth.config chybí audience');
                return false;
            }
            
            if (!Auth0Auth.config.scope) {
                this.logTestFailure('V Auth0Auth.config chybí scope');
                return false;
            }
            
            this.logTestSuccess('Auth0Auth.config obsahuje správnou konfiguraci');
            this.logTestInfo('Domain: ' + Auth0Auth.config.domain);
            this.logTestInfo('ClientId: ' + Auth0Auth.config.clientId);
            this.logTestInfo('RedirectUri: ' + Auth0Auth.config.redirectUri);
            this.logTestInfo('NetlifyDevRedirectUri: ' + Auth0Auth.config.netlifyDevRedirectUri);
            this.logTestInfo('LocalDevRedirectUri: ' + Auth0Auth.config.localDevRedirectUri);
            this.logTestInfo('Audience: ' + Auth0Auth.config.audience);
            this.logTestInfo('Scope: ' + Auth0Auth.config.scope);
            
            return true;
        } catch (error) {
            this.logTestError('Test 3: Kontrola konfigurace v Auth0Auth modulu', error);
            return false;
        }
    },

    // Test 4: Kontrola konfigurace v Auth0 dashboardu
    async testAuth0Dashboard() {
        try {
            this.logTestInfo('Test 4: Kontrola konfigurace v Auth0 dashboardu');
            
            // Vytvoření testovacího tlačítka pro otevření Auth0 dashboardu
            const dashboardButton = document.createElement('button');
            dashboardButton.id = 'auth0DashboardButton';
            dashboardButton.textContent = 'Otevřít Auth0 Dashboard';
            dashboardButton.style.position = 'fixed';
            dashboardButton.style.top = '130px';
            dashboardButton.style.right = '10px';
            dashboardButton.style.zIndex = '9999';
            dashboardButton.style.padding = '8px 16px';
            dashboardButton.style.backgroundColor = '#6610f2';
            dashboardButton.style.color = 'white';
            dashboardButton.style.border = 'none';
            dashboardButton.style.borderRadius = '4px';
            dashboardButton.style.cursor = 'pointer';
            
            dashboardButton.addEventListener('click', () => {
                window.open('https://manage.auth0.com/dashboard/us/dev-zxj8pir0moo4pdk7/applications/TKzCgYPmkETVCBjC3418MgKDJY60rppl/settings', '_blank');
            });
            
            document.body.appendChild(dashboardButton);
            
            this.logTestInfo('Pro kontrolu konfigurace v Auth0 dashboardu klikněte na tlačítko "Otevřít Auth0 Dashboard"');
            this.logTestInfo('Zkontrolujte následující nastavení:');
            this.logTestInfo('1. Application Type: Single Page Application');
            this.logTestInfo('2. Token Endpoint Authentication Method: None');
            this.logTestInfo('3. Allowed Callback URLs: http://localhost:3000, https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app');
            this.logTestInfo('4. Allowed Logout URLs: http://localhost:3000, https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app');
            this.logTestInfo('5. Allowed Web Origins: http://localhost:3000, https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app');
            
            return true;
        } catch (error) {
            this.logTestError('Test 4: Kontrola konfigurace v Auth0 dashboardu', error);
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
        resultsElement.id = 'auth0ConfigTestResults';
        resultsElement.style.position = 'fixed';
        resultsElement.style.top = '170px';
        resultsElement.style.right = '10px';
        resultsElement.style.width = '400px';
        resultsElement.style.maxHeight = '80vh';
        resultsElement.style.overflowY = 'auto';
        resultsElement.style.backgroundColor = '#f8f9fa';
        resultsElement.style.border = '1px solid #dee2e6';
        resultsElement.style.borderRadius = '4px';
        resultsElement.style.padding = '10px';
        resultsElement.style.zIndex = '9997';
        resultsElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        
        // Vytvoření hlavičky
        const header = document.createElement('div');
        header.style.borderBottom = '1px solid #dee2e6';
        header.style.paddingBottom = '10px';
        header.style.marginBottom = '10px';
        header.style.fontWeight = 'bold';
        header.style.fontSize = '16px';
        header.innerHTML = 'Výsledky testů konfigurace Auth0';
        
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
    console.log('Načítání testovacího skriptu pro kontrolu konfigurace Auth0...');
    
    // Vytvoření tlačítka pro spuštění testů
    const testButton = document.createElement('button');
    testButton.id = 'runAuth0ConfigTestsButton';
    testButton.textContent = 'Zkontrolovat konfiguraci Auth0';
    testButton.style.position = 'fixed';
    testButton.style.top = '130px';
    testButton.style.right = '10px';
    testButton.style.zIndex = '9999';
    testButton.style.padding = '8px 16px';
    testButton.style.backgroundColor = '#17a2b8';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', () => {
        Auth0ConfigTest.runTests().catch(error => {
            console.error('Chyba při spouštění testů konfigurace Auth0:', error);
        });
    });
    
    document.body.appendChild(testButton);
    
    console.log('Testovací skript pro kontrolu konfigurace Auth0 byl načten');
});

// Export modulu
window.Auth0ConfigTest = Auth0ConfigTest;
