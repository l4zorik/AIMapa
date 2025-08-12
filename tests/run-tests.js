/**
 * Hlavní testovací skript pro AIMapa
 * Verze 0.3.8.6
 *
 * Tento skript spouští všechny testy pro aplikaci AIMapa.
 */

// Načtení testovacích modulů
const MapUtilsTest = require('./unit/map-utils.test');
const MapApiTest = require('./integration/map-api.test');
const MapWorkflowTest = require('./e2e/map-workflow.test');
const AIModelTest = require('./ai/model-evaluation.test');
const AuthTest = require('./unit/auth.test');
const MonetizationTest = require('./unit/monetization.test');
const AIIntegrationTest = require('./unit/ai-integration.test');
const Auth0NetlifyTest = require('./integration/auth0-netlify.test');
const DeploymentTest = require('./integration/deployment.test');

// Funkce pro formátování výsledků testů
function formatResults(results) {
    return JSON.stringify(results, null, 2);
}

// Funkce pro spuštění všech testů
async function runAllTests() {
    console.log('=== SPOUŠTÍM VŠECHNY TESTY AIMAPA ===');
    console.log('Verze: 0.3.8.6');
    console.log('Datum: ' + new Date().toISOString());
    console.log('');

    try {
        // Unit testy
        console.log('=== UNIT TESTY ===');
        const unitResults = MapUtilsTest.runAllTests();
        console.log('Výsledky unit testů:');
        console.log(`Celkem: ${unitResults.summary.total}, Úspěšné: ${unitResults.summary.passed}, Neúspěšné: ${unitResults.summary.failed}`);
        console.log('');

        // Integrační testy
        console.log('=== INTEGRAČNÍ TESTY ===');
        const integrationResults = await MapApiTest.runAllTests();
        console.log('Výsledky integračních testů:');
        console.log(`Celkem: ${integrationResults.summary.total}, Úspěšné: ${integrationResults.summary.passed}, Neúspěšné: ${integrationResults.summary.failed}`);
        console.log('');

        // End-to-end testy
        console.log('=== END-TO-END TESTY ===');
        const e2eResults = await MapWorkflowTest.runAllScenarios();
        console.log('Výsledky end-to-end testů:');
        console.log(`Celkem: ${e2eResults.summary.total}, Úspěšné: ${e2eResults.summary.passed}, Neúspěšné: ${e2eResults.summary.failed}`);
        console.log('');

        // AI model testy
        console.log('=== AI MODEL TESTY ===');
        const aiResults = AIModelTest.runAllTests();
        console.log('Výsledky AI model testů:');
        console.log('Klasifikace míst - Accuracy: ' + aiResults.placeClassification.metrics.accuracy.toFixed(2));
        console.log('Predikce času cesty - RMSE: ' + aiResults.travelTimePrediction.metrics.rmse.toFixed(2));
        console.log('Doporučení míst - Avg NDCG: ' + aiResults.placeRecommendation.metrics.avgNDCG.toFixed(2));
        console.log('Bias a fairness - Equal Opportunity: ' + aiResults.biasAndFairness.fairnessMetrics.equalOpportunity.toFixed(2));
        console.log('');

        // Autentizační testy
        console.log('=== AUTENTIZAČNÍ TESTY ===');
        const authResults = AuthTest.runAllTests();
        console.log('Výsledky autentizačních testů:');
        console.log(`Celkem: ${authResults.summary.total}, Úspěšné: ${authResults.summary.passed}, Neúspěšné: ${authResults.summary.failed}`);
        console.log('');

        // Monetizační testy
        console.log('=== MONETIZAČNÍ TESTY ===');
        const monetizationResults = MonetizationTest.runAllTests();
        console.log('Výsledky monetizačních testů:');
        console.log(`Celkem: ${monetizationResults.summary.total}, Úspěšné: ${monetizationResults.summary.passed}, Neúspěšné: ${monetizationResults.summary.failed}`);
        console.log('');

        // AI integrace testy
        console.log('=== AI INTEGRACE TESTY ===');
        const aiIntegrationResults = AIIntegrationTest.runAllTests();
        console.log('Výsledky testů AI integrace:');
        console.log(`Celkem: ${aiIntegrationResults.summary.total}, Úspěšné: ${aiIntegrationResults.summary.passed}, Neúspěšné: ${aiIntegrationResults.summary.failed}`);
        console.log('');

        // Auth0 a Netlify integrace testy
        console.log('=== AUTH0 A NETLIFY INTEGRACE TESTY ===');
        const auth0NetlifyResults = Auth0NetlifyTest.runAllTests();
        console.log('Výsledky testů Auth0 a Netlify integrace:');
        console.log(`Celkem: ${auth0NetlifyResults.summary.total}, Úspěšné: ${auth0NetlifyResults.summary.passed}, Neúspěšné: ${auth0NetlifyResults.summary.failed}`);
        console.log('');

        // Testy nasazení
        console.log('=== TESTY NASAZENÍ ===');
        const deploymentResults = DeploymentTest.runAllTests();
        console.log('Výsledky testů nasazení:');
        console.log(`Celkem: ${deploymentResults.summary.total}, Úspěšné: ${deploymentResults.summary.passed}, Neúspěšné: ${deploymentResults.summary.failed}`);
        console.log('');

        // Celkové výsledky
        const totalTests = unitResults.summary.total +
                          integrationResults.summary.total +
                          e2eResults.summary.total +
                          authResults.summary.total +
                          monetizationResults.summary.total +
                          aiIntegrationResults.summary.total +
                          auth0NetlifyResults.summary.total +
                          deploymentResults.summary.total;

        const passedTests = unitResults.summary.passed +
                           integrationResults.summary.passed +
                           e2eResults.summary.passed +
                           authResults.summary.passed +
                           monetizationResults.summary.passed +
                           aiIntegrationResults.summary.passed +
                           auth0NetlifyResults.summary.passed +
                           deploymentResults.summary.passed;

        const failedTests = unitResults.summary.failed +
                           integrationResults.summary.failed +
                           e2eResults.summary.failed +
                           authResults.summary.failed +
                           monetizationResults.summary.failed +
                           aiIntegrationResults.summary.failed +
                           auth0NetlifyResults.summary.failed +
                           deploymentResults.summary.failed;

        console.log('=== CELKOVÉ VÝSLEDKY ===');
        console.log(`Celkem testů: ${totalTests}`);
        console.log(`Úspěšné testy: ${passedTests}`);
        console.log(`Neúspěšné testy: ${failedTests}`);
        console.log(`Úspěšnost: ${(passedTests / totalTests * 100).toFixed(2)}%`);

        // Uložení výsledků do souboru
        const fs = require('fs');
        const path = require('path');
        const resultsDir = path.join(__dirname, 'results');

        // Vytvoření adresáře pro výsledky, pokud neexistuje
        if (!fs.existsSync(resultsDir)) {
            fs.mkdirSync(resultsDir);
        }

        const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
        const resultsFile = path.join(resultsDir, `test-results-${timestamp}.json`);

        const allResults = {
            timestamp: new Date().toISOString(),
            version: '0.3.8.6',
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: passedTests / totalTests
            },
            unitTests: unitResults,
            integrationTests: integrationResults,
            e2eTests: e2eResults,
            aiModelTests: aiResults,
            authTests: authResults,
            monetizationTests: monetizationResults,
            aiIntegrationTests: aiIntegrationResults,
            auth0NetlifyTests: auth0NetlifyResults,
            deploymentTests: deploymentResults
        };

        fs.writeFileSync(resultsFile, JSON.stringify(allResults, null, 2));
        console.log(`Výsledky testů byly uloženy do souboru: ${resultsFile}`);

        return allResults;
    } catch (error) {
        console.error('Chyba při spouštění testů:', error);
        return { error: error.message };
    }
}

// Spuštění testů při přímém spuštění skriptu
if (require.main === module) {
    runAllTests().then(() => {
        console.log('Testování dokončeno');
    }).catch(error => {
        console.error('Chyba při spouštění testů:', error);
        process.exit(1);
    });
}

// Export funkce pro spuštění testů
module.exports = {
    runAllTests
};
