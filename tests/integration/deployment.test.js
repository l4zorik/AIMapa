/**
 * Testy pro ověření správného nastavení pro nasazení
 * Verze 0.3.8.6
 */

const fs = require('fs');
const path = require('path');

const DeploymentTest = {
    // Testovací data
    testData: {
        netlify: {
            productionUrl: 'https://remarkable-cajeta-76cfd9.netlify.app/',
            devServerUrl: 'https://devserver-v0-3-8-5--remarkable-cajeta-76cfd9.netlify.app/index.html',
            requiredFiles: [
                'netlify.toml',
                '.env.production',
                'server.js',
                'public/index.html',
                'public/app/map.js',
                'public/app/globe-simple.js',
                'public/app/auth0-auth.js'
            ],
            netlifyTomlRequirements: [
                'publish = "public"',
                'functions = "functions"',
                'from = "/*"',
                'to = "/index.html"',
                'X-Frame-Options = "DENY"',
                'Content-Security-Policy',
                'auth0.com'
            ]
        },
        auth0: {
            requiredEnvVars: [
                'AUTH0_SECRET',
                'AUTH0_BASE_URL',
                'AUTH0_ISSUER_BASE_URL',
                'AUTH0_CLIENT_ID',
                'AUTH0_CLIENT_SECRET'
            ],
            callbackUrls: [
                'http://localhost:3000/callback',
                'https://remarkable-cajeta-76cfd9.netlify.app/callback'
            ],
            logoutUrls: [
                'http://localhost:3000',
                'https://remarkable-cajeta-76cfd9.netlify.app'
            ]
        },
        supabase: {
            requiredEnvVars: [
                'SUPABASE_URL',
                'SUPABASE_KEY'
            ]
        }
    },

    /**
     * Test ověření souborů pro nasazení
     */
    testDeploymentFiles() {
        console.log('Spouštím test ověření souborů pro nasazení...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testování existence požadovaných souborů
        this.testData.netlify.requiredFiles.forEach(file => {
            const exists = fs.existsSync(file);
            
            results.details.push({
                scenario: `Ověření existence souboru ${file}`,
                expected: true,
                actual: exists,
                passed: exists,
                technicalDetails: `Soubor ${file} je vyžadován pro nasazení na Netlify`
            });

            if (exists) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        // Kontrola obsahu netlify.toml
        if (fs.existsSync('netlify.toml')) {
            const netlifyTomlContent = fs.readFileSync('netlify.toml', 'utf8');
            
            this.testData.netlify.netlifyTomlRequirements.forEach(requirement => {
                const containsRequirement = netlifyTomlContent.includes(requirement);
                
                results.details.push({
                    scenario: `Ověření požadavku v netlify.toml: ${requirement.substring(0, 30)}${requirement.length > 30 ? '...' : ''}`,
                    expected: true,
                    actual: containsRequirement,
                    passed: containsRequirement,
                    technicalDetails: `Požadavek ${requirement.substring(0, 30)}${requirement.length > 30 ? '...' : ''} je vyžadován v netlify.toml`
                });

                if (containsRequirement) {
                    results.passed++;
                } else {
                    results.failed++;
                }
            });
        }

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
     * Test ověření proměnných prostředí pro nasazení
     */
    testEnvironmentVariables() {
        console.log('Spouštím test ověření proměnných prostředí pro nasazení...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Kontrola existence .env.production
        const envProductionExists = fs.existsSync('.env.production');
        
        results.details.push({
            scenario: 'Ověření existence souboru .env.production',
            expected: true,
            actual: envProductionExists,
            passed: envProductionExists,
            technicalDetails: 'Soubor .env.production je vyžadován pro nasazení na Netlify'
        });

        if (envProductionExists) {
            results.passed++;
            
            // Kontrola obsahu .env.production
            const envProductionContent = fs.readFileSync('.env.production', 'utf8');
            
            // Kontrola Auth0 proměnných
            this.testData.auth0.requiredEnvVars.forEach(envVar => {
                const containsEnvVar = envProductionContent.includes(envVar + '=');
                
                results.details.push({
                    scenario: `Ověření proměnné prostředí v .env.production: ${envVar}`,
                    expected: true,
                    actual: containsEnvVar,
                    passed: containsEnvVar,
                    technicalDetails: `Proměnná prostředí ${envVar} je vyžadována v .env.production pro Auth0`
                });

                if (containsEnvVar) {
                    results.passed++;
                } else {
                    results.failed++;
                }
            });
            
            // Kontrola Supabase proměnných
            this.testData.supabase.requiredEnvVars.forEach(envVar => {
                const containsEnvVar = envProductionContent.includes(envVar + '=');
                
                results.details.push({
                    scenario: `Ověření proměnné prostředí v .env.production: ${envVar}`,
                    expected: true,
                    actual: containsEnvVar,
                    passed: containsEnvVar,
                    technicalDetails: `Proměnná prostředí ${envVar} je vyžadována v .env.production pro Supabase`
                });

                if (containsEnvVar) {
                    results.passed++;
                } else {
                    results.failed++;
                }
            });
            
            // Kontrola produkčních URL v proměnných prostředí
            const auth0BaseUrl = envProductionContent.match(/AUTH0_BASE_URL=(.+)/);
            if (auth0BaseUrl && auth0BaseUrl[1]) {
                const containsNetlifyUrl = auth0BaseUrl[1].includes('netlify.app');
                
                results.details.push({
                    scenario: 'Ověření produkční URL v AUTH0_BASE_URL',
                    expected: true,
                    actual: containsNetlifyUrl,
                    passed: containsNetlifyUrl,
                    technicalDetails: 'AUTH0_BASE_URL musí obsahovat produkční URL (netlify.app)'
                });

                if (containsNetlifyUrl) {
                    results.passed++;
                } else {
                    results.failed++;
                }
            }
        } else {
            results.failed++;
        }

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
     * Test ověření URL adres
     */
    testUrlConfiguration() {
        console.log('Spouštím test ověření URL adres...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Kontrola existence .env.production
        if (fs.existsSync('.env.production')) {
            const envProductionContent = fs.readFileSync('.env.production', 'utf8');
            
            // Kontrola Auth0 callback URL
            const auth0CallbackUrl = envProductionContent.match(/AUTH0_CALLBACK_URL=(.+)/);
            if (auth0CallbackUrl && auth0CallbackUrl[1]) {
                this.testData.auth0.callbackUrls.forEach(url => {
                    const containsUrl = auth0CallbackUrl[1].includes(url);
                    
                    results.details.push({
                        scenario: `Ověření callback URL v AUTH0_CALLBACK_URL: ${url}`,
                        expected: true,
                        actual: containsUrl,
                        passed: containsUrl,
                        technicalDetails: `Callback URL ${url} je vyžadována v AUTH0_CALLBACK_URL`
                    });

                    if (containsUrl) {
                        results.passed++;
                    } else {
                        results.failed++;
                    }
                });
            } else {
                results.details.push({
                    scenario: 'Ověření existence AUTH0_CALLBACK_URL',
                    expected: true,
                    actual: false,
                    passed: false,
                    technicalDetails: 'AUTH0_CALLBACK_URL je vyžadována v .env.production'
                });
                results.failed++;
            }
            
            // Kontrola Auth0 logout URL
            const auth0LogoutUrl = envProductionContent.match(/AUTH0_LOGOUT_URL=(.+)/);
            if (auth0LogoutUrl && auth0LogoutUrl[1]) {
                this.testData.auth0.logoutUrls.forEach(url => {
                    const containsUrl = auth0LogoutUrl[1].includes(url);
                    
                    results.details.push({
                        scenario: `Ověření logout URL v AUTH0_LOGOUT_URL: ${url}`,
                        expected: true,
                        actual: containsUrl,
                        passed: containsUrl,
                        technicalDetails: `Logout URL ${url} je vyžadována v AUTH0_LOGOUT_URL`
                    });

                    if (containsUrl) {
                        results.passed++;
                    } else {
                        results.failed++;
                    }
                });
            } else {
                results.details.push({
                    scenario: 'Ověření existence AUTH0_LOGOUT_URL',
                    expected: true,
                    actual: false,
                    passed: false,
                    technicalDetails: 'AUTH0_LOGOUT_URL je vyžadována v .env.production'
                });
                results.failed++;
            }
        } else {
            results.details.push({
                scenario: 'Ověření existence souboru .env.production pro kontrolu URL',
                expected: true,
                actual: false,
                passed: false,
                technicalDetails: 'Soubor .env.production je vyžadován pro kontrolu URL adres'
            });
            results.failed++;
        }

        // Kontrola URL v netlify.toml
        if (fs.existsSync('netlify.toml')) {
            const netlifyTomlContent = fs.readFileSync('netlify.toml', 'utf8');
            
            // Kontrola přesměrování pro callback
            const hasCallbackRedirect = netlifyTomlContent.includes('from = "/callback"');
            
            results.details.push({
                scenario: 'Ověření přesměrování pro callback v netlify.toml',
                expected: true,
                actual: hasCallbackRedirect,
                passed: hasCallbackRedirect,
                technicalDetails: 'Přesměrování pro /callback je vyžadováno v netlify.toml'
            });

            if (hasCallbackRedirect) {
                results.passed++;
            } else {
                results.failed++;
            }
            
            // Kontrola přesměrování pro SPA
            const hasSpaRedirect = netlifyTomlContent.includes('from = "/*"') && 
                                  netlifyTomlContent.includes('to = "/index.html"');
            
            results.details.push({
                scenario: 'Ověření přesměrování pro SPA v netlify.toml',
                expected: true,
                actual: hasSpaRedirect,
                passed: hasSpaRedirect,
                technicalDetails: 'Přesměrování pro /* na /index.html je vyžadováno v netlify.toml pro SPA'
            });

            if (hasSpaRedirect) {
                results.passed++;
            } else {
                results.failed++;
            }
        } else {
            results.details.push({
                scenario: 'Ověření existence souboru netlify.toml pro kontrolu URL',
                expected: true,
                actual: false,
                passed: false,
                technicalDetails: 'Soubor netlify.toml je vyžadován pro kontrolu URL adres'
            });
            results.failed++;
        }

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
     * Spuštění všech testů
     */
    runAllTests() {
        console.log('Spouštím testy nasazení...');

        const results = {
            deploymentFiles: this.testDeploymentFiles(),
            environmentVariables: this.testEnvironmentVariables(),
            urlConfiguration: this.testUrlConfiguration()
        };

        // Výpočet celkových výsledků
        const totalPassed = results.deploymentFiles.passed +
                           results.environmentVariables.passed +
                           results.urlConfiguration.passed;

        const totalFailed = results.deploymentFiles.failed +
                           results.environmentVariables.failed +
                           results.urlConfiguration.failed;

        console.log(`Všechny testy dokončeny: ${totalPassed} úspěšných, ${totalFailed} neúspěšných`);

        return {
            results: results,
            summary: {
                passed: totalPassed,
                failed: totalFailed,
                total: totalPassed + totalFailed
            }
        };
    }
};

// Export modulu pro použití v prohlížeči i Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeploymentTest;
} else {
    window.DeploymentTest = DeploymentTest;
}
