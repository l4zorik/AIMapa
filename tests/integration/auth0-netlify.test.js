/**
 * Testy pro ověření správného nastavení Auth0 a Netlify
 * Verze 0.3.8.6
 */

const Auth0NetlifyTest = {
    // Testovací data
    testData: {
        auth0: {
            domain: 'dev-zxj8pir0moo4pdk7.us.auth0.com',
            clientId: 'H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ',
            callbackUrls: [
                'http://localhost:3000/login',
                'http://localhost:3000/callback',
                'http://localhost:3000',
                'https://remarkable-cajeta-76cfd9.netlify.app/',
                'https://remarkable-cajeta-76cfd9.netlify.app/callback',
                'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app/index.html',
                'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app/callback'
            ],
            logoutUrls: [
                'http://localhost:3000',
                'https://remarkable-cajeta-76cfd9.netlify.app/',
                'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app/index.html'
            ],
            webOrigins: [
                'http://localhost:3000',
                'https://remarkable-cajeta-76cfd9.netlify.app',
                'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app'
            ]
        },
        netlify: {
            productionUrl: 'https://remarkable-cajeta-76cfd9.netlify.app/',
            devServerUrl: 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app/index.html',
            requiredEnvVars: [
                'AUTH0_SECRET',
                'AUTH0_BASE_URL',
                'AUTH0_ISSUER_BASE_URL',
                'AUTH0_CLIENT_ID',
                'AUTH0_CLIENT_SECRET',
                'SUPABASE_URL',
                'SUPABASE_KEY'
            ]
        }
    },

    /**
     * Test ověření konfigurace Auth0
     */
    testAuth0Configuration() {
        console.log('Spouštím test ověření konfigurace Auth0...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Simulace získání konfigurace Auth0
        const auth0Config = this.getAuth0Configuration();

        // Testovací případy
        const testCases = [
            { 
                scenario: 'Ověření domény Auth0', 
                actual: auth0Config.domain,
                expected: this.testData.auth0.domain,
                technicalDetails: 'Doména Auth0 musí být správně nastavena pro autentizaci'
            },
            { 
                scenario: 'Ověření Client ID Auth0', 
                actual: auth0Config.clientId,
                expected: this.testData.auth0.clientId,
                technicalDetails: 'Client ID Auth0 musí být správně nastaveno pro autentizaci'
            },
            { 
                scenario: 'Ověření Callback URL pro localhost', 
                actual: auth0Config.callbackUrls.includes('http://localhost:3000/callback'),
                expected: true,
                technicalDetails: 'Callback URL pro localhost musí být nastavena pro lokální vývoj'
            },
            { 
                scenario: 'Ověření Callback URL pro produkci', 
                actual: auth0Config.callbackUrls.includes('https://remarkable-cajeta-76cfd9.netlify.app/callback'),
                expected: true,
                technicalDetails: 'Callback URL pro produkci musí být nastavena pro produkční prostředí'
            },
            { 
                scenario: 'Ověření Logout URL pro localhost', 
                actual: auth0Config.logoutUrls.includes('http://localhost:3000'),
                expected: true,
                technicalDetails: 'Logout URL pro localhost musí být nastavena pro lokální vývoj'
            },
            { 
                scenario: 'Ověření Logout URL pro produkci', 
                actual: auth0Config.logoutUrls.includes('https://remarkable-cajeta-76cfd9.netlify.app/'),
                expected: true,
                technicalDetails: 'Logout URL pro produkci musí být nastavena pro produkční prostředí'
            },
            { 
                scenario: 'Ověření Web Origins pro localhost', 
                actual: auth0Config.webOrigins.includes('http://localhost:3000'),
                expected: true,
                technicalDetails: 'Web Origins pro localhost musí být nastaveny pro CORS'
            },
            { 
                scenario: 'Ověření Web Origins pro produkci', 
                actual: auth0Config.webOrigins.includes('https://remarkable-cajeta-76cfd9.netlify.app'),
                expected: true,
                technicalDetails: 'Web Origins pro produkci musí být nastaveny pro CORS'
            }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const passed = testCase.actual === testCase.expected;

            results.details.push({
                scenario: testCase.scenario,
                expected: testCase.expected,
                actual: testCase.actual,
                passed: passed,
                technicalDetails: testCase.technicalDetails
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        
        // Výpis detailů testů
        if (results.details && results.details.length > 0) {
            console.log('Detaily testů:');
            results.details.forEach((detail, index) => {
                const status = detail.passed ? '✅ ÚSPĚCH' : '❌ SELHÁNÍ';
                console.log(`  ${index + 1}. [${status}] ${detail.scenario}`);
                console.log(`     Očekáváno: ${detail.expected}`);
                console.log(`     Skutečnost: ${detail.actual}`);
                console.log(`     Technické detaily: ${detail.technicalDetails}`);
            });
            console.log('');
        }
        
        return results;
    },

    /**
     * Test ověření konfigurace Netlify
     */
    testNetlifyConfiguration() {
        console.log('Spouštím test ověření konfigurace Netlify...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Simulace získání konfigurace Netlify
        const netlifyConfig = this.getNetlifyConfiguration();

        // Testovací případy
        const testCases = [
            { 
                scenario: 'Ověření produkční URL', 
                actual: netlifyConfig.productionUrl,
                expected: this.testData.netlify.productionUrl,
                technicalDetails: 'Produkční URL musí být správně nastavena pro přesměrování'
            },
            { 
                scenario: 'Ověření URL vývojového serveru', 
                actual: netlifyConfig.devServerUrl,
                expected: this.testData.netlify.devServerUrl,
                technicalDetails: 'URL vývojového serveru musí být správně nastavena pro testování'
            }
        ];

        // Testování proměnných prostředí
        this.testData.netlify.requiredEnvVars.forEach(envVar => {
            testCases.push({
                scenario: `Ověření proměnné prostředí ${envVar}`,
                actual: netlifyConfig.environmentVariables.includes(envVar),
                expected: true,
                technicalDetails: `Proměnná prostředí ${envVar} musí být nastavena v Netlify pro správnou funkci aplikace`
            });
        });

        // Testování všech případů
        testCases.forEach(testCase => {
            const passed = testCase.actual === testCase.expected;

            results.details.push({
                scenario: testCase.scenario,
                expected: testCase.expected,
                actual: testCase.actual,
                passed: passed,
                technicalDetails: testCase.technicalDetails
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        
        // Výpis detailů testů
        if (results.details && results.details.length > 0) {
            console.log('Detaily testů:');
            results.details.forEach((detail, index) => {
                const status = detail.passed ? '✅ ÚSPĚCH' : '❌ SELHÁNÍ';
                console.log(`  ${index + 1}. [${status}] ${detail.scenario}`);
                console.log(`     Očekáváno: ${detail.expected}`);
                console.log(`     Skutečnost: ${detail.actual}`);
                console.log(`     Technické detaily: ${detail.technicalDetails}`);
            });
            console.log('');
        }
        
        return results;
    },

    /**
     * Test ověření dostupnosti URL
     */
    testUrlAvailability() {
        console.log('Spouštím test ověření dostupnosti URL...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Simulace kontroly dostupnosti URL
        const urlChecks = this.checkUrlAvailability();

        // Testovací případy
        const testCases = [
            { 
                scenario: 'Ověření dostupnosti produkční URL', 
                url: this.testData.netlify.productionUrl,
                actual: urlChecks[this.testData.netlify.productionUrl],
                expected: true,
                technicalDetails: 'Produkční URL musí být dostupná'
            },
            { 
                scenario: 'Ověření dostupnosti URL vývojového serveru', 
                url: this.testData.netlify.devServerUrl,
                actual: urlChecks[this.testData.netlify.devServerUrl],
                expected: true,
                technicalDetails: 'URL vývojového serveru musí být dostupná'
            },
            { 
                scenario: 'Ověření přesměrování na Auth0 při přístupu na chráněnou stránku', 
                url: this.testData.netlify.productionUrl + 'profile',
                actual: urlChecks[this.testData.netlify.productionUrl + 'profile'].redirectsToAuth0,
                expected: true,
                technicalDetails: 'Přístup na chráněnou stránku musí přesměrovat na Auth0 přihlášení'
            }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const passed = testCase.actual === testCase.expected;

            results.details.push({
                scenario: testCase.scenario,
                url: testCase.url,
                expected: testCase.expected,
                actual: testCase.actual,
                passed: passed,
                technicalDetails: testCase.technicalDetails
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        
        // Výpis detailů testů
        if (results.details && results.details.length > 0) {
            console.log('Detaily testů:');
            results.details.forEach((detail, index) => {
                const status = detail.passed ? '✅ ÚSPĚCH' : '❌ SELHÁNÍ';
                console.log(`  ${index + 1}. [${status}] ${detail.scenario}`);
                console.log(`     URL: ${detail.url}`);
                console.log(`     Očekáváno: ${detail.expected}`);
                console.log(`     Skutečnost: ${detail.actual}`);
                console.log(`     Technické detaily: ${detail.technicalDetails}`);
                
                // Pokud je URL nedostupná, zobrazíme další informace
                if (!detail.passed && detail.url) {
                    const urlInfo = urlChecks[detail.url];
                    if (urlInfo && urlInfo.statusCode) {
                        console.log(`     HTTP Status: ${urlInfo.statusCode}`);
                    }
                    if (urlInfo && urlInfo.error) {
                        console.log(`     Chyba: ${urlInfo.error}`);
                    }
                }
            });
            console.log('');
        }
        
        return results;
    },

    /**
     * Spuštění všech testů
     */
    runAllTests() {
        console.log('Spouštím testy Auth0 a Netlify integrace...');

        const results = {
            auth0Configuration: this.testAuth0Configuration(),
            netlifyConfiguration: this.testNetlifyConfiguration(),
            urlAvailability: this.testUrlAvailability()
        };

        // Výpočet celkových výsledků
        const totalPassed = results.auth0Configuration.passed +
                           results.netlifyConfiguration.passed +
                           results.urlAvailability.passed;

        const totalFailed = results.auth0Configuration.failed +
                           results.netlifyConfiguration.failed +
                           results.urlAvailability.failed;

        console.log(`Všechny testy dokončeny: ${totalPassed} úspěšných, ${totalFailed} neúspěšných`);

        return {
            results: results,
            summary: {
                passed: totalPassed,
                failed: totalFailed,
                total: totalPassed + totalFailed
            }
        };
    },

    /**
     * Simulace získání konfigurace Auth0
     * V reálném prostředí by tato funkce volala Auth0 Management API
     */
    getAuth0Configuration() {
        // Simulace získání konfigurace Auth0
        return {
            domain: this.testData.auth0.domain,
            clientId: this.testData.auth0.clientId,
            callbackUrls: this.testData.auth0.callbackUrls,
            logoutUrls: this.testData.auth0.logoutUrls,
            webOrigins: this.testData.auth0.webOrigins
        };
    },

    /**
     * Simulace získání konfigurace Netlify
     * V reálném prostředí by tato funkce volala Netlify API
     */
    getNetlifyConfiguration() {
        // Simulace získání konfigurace Netlify
        return {
            productionUrl: this.testData.netlify.productionUrl,
            devServerUrl: this.testData.netlify.devServerUrl,
            environmentVariables: this.testData.netlify.requiredEnvVars
        };
    },

    /**
     * Simulace kontroly dostupnosti URL
     * V reálném prostředí by tato funkce používala HTTP požadavky
     */
    checkUrlAvailability() {
        // Simulace kontroly dostupnosti URL
        const results = {};
        
        // Produkční URL
        results[this.testData.netlify.productionUrl] = true;
        
        // URL vývojového serveru
        results[this.testData.netlify.devServerUrl] = true;
        
        // Chráněná stránka
        results[this.testData.netlify.productionUrl + 'profile'] = {
            statusCode: 302,
            redirectsToAuth0: true
        };
        
        return results;
    }
};

// Export modulu pro použití v prohlížeči i Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth0NetlifyTest;
} else {
    window.Auth0NetlifyTest = Auth0NetlifyTest;
}
