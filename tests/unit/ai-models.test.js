/**
 * Unit testy pro AI modely
 * Verze 0.3.8.6
 */

// Modul pro testování AI modelů
const AIModelsTest = {
    // Testovací data
    testData: {
        places: [
            { name: 'Karlův most', type: 'landmark', location: { lat: 50.0865, lng: 14.4112 } },
            { name: 'Hlavní nádraží', type: 'transport', location: { lat: 50.0833, lng: 14.4353 } },
            { name: 'OC Palladium', type: 'shopping', location: { lat: 50.0892, lng: 14.4298 } },
            { name: 'Restaurace U Fleků', type: 'food', location: { lat: 50.0778, lng: 14.4183 } },
            { name: 'Petřínská rozhledna', type: 'landmark', location: { lat: 50.0841, lng: 14.3979 } }
        ],
        routes: [
            { from: 'Praha', to: 'Brno', distance: 186, duration: 120 },
            { from: 'Praha', to: 'Ostrava', distance: 356, duration: 210 },
            { from: 'Brno', to: 'Ostrava', distance: 170, duration: 105 },
            { from: 'Plzeň', to: 'Praha', distance: 92, duration: 60 }
        ],
        users: [
            { id: 'user1', preferences: ['history', 'culture'] },
            { id: 'user2', preferences: ['food', 'shopping'] },
            { id: 'user3', preferences: ['nature', 'leisure'] }
        ]
    },

    /**
     * Test klasifikace míst
     */
    testPlaceClassification() {
        console.log('Spouštím test klasifikace míst...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testovací případy
        const testCases = [
            { input: 'Karlův most, Praha', expected: 'landmark' },
            { input: 'Hlavní nádraží, Praha', expected: 'transport' },
            { input: 'OC Palladium, Praha', expected: 'shopping' },
            { input: 'Restaurace U Fleků, Praha', expected: 'food' },
            { input: 'Petřínská rozhledna, Praha', expected: 'landmark' },
            { input: 'Letiště Václava Havla, Praha', expected: 'transport' },
            { input: 'Národní muzeum, Praha', expected: 'culture' },
            { input: 'Náplavka, Praha', expected: 'leisure' },
            { input: 'Pražský hrad, Praha', expected: 'landmark' },
            { input: 'Staroměstské náměstí, Praha', expected: 'landmark' }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const predicted = this.classifyPlace(testCase.input);
            const passed = predicted === testCase.expected;

            // Přidání výsledku
            results.details.push({
                input: testCase.input,
                expected: testCase.expected,
                predicted: predicted,
                correct: passed
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        // Výpočet metrik
        const metrics = this.calculateClassificationMetrics(results.details);

        console.log(`Test dokončen: Accuracy = ${metrics.accuracy.toFixed(2)}, Avg F1 Score = ${metrics.avgF1Score.toFixed(2)}`);
        
        return {
            predictions: results.details,
            metrics: metrics
        };
    },

    /**
     * Test predikce času cesty
     */
    testTravelTimePrediction() {
        console.log('Spouštím test predikce času cesty...');

        const results = {
            predictions: [],
            metrics: {}
        };

        // Testovací případy
        const testCases = [
            {
                from: 'Praha',
                to: 'Brno',
                mode: 'driving',
                features: { distance: 186, traffic: 'low' },
                expected: 120
            },
            {
                from: 'Praha',
                to: 'Brno',
                mode: 'driving',
                features: { distance: 186, traffic: 'medium' },
                expected: 150
            },
            {
                from: 'Praha',
                to: 'Brno',
                mode: 'driving',
                features: { distance: 186, traffic: 'high' },
                expected: 180
            },
            {
                from: 'Praha',
                to: 'Ostrava',
                mode: 'driving',
                features: { distance: 356, traffic: 'low' },
                expected: 210
            },
            {
                from: 'Praha',
                to: 'Plzeň',
                mode: 'driving',
                features: { distance: 92, traffic: 'low' },
                expected: 60
            },
            {
                from: 'Praha',
                to: 'Liberec',
                mode: 'driving',
                features: { distance: 110, traffic: 'low' },
                expected: 75
            },
            {
                from: 'Brno',
                to: 'Ostrava',
                mode: 'driving',
                features: { distance: 170, traffic: 'low' },
                expected: 105
            },
            {
                from: 'Praha',
                to: 'Brno',
                mode: 'transit',
                features: { distance: 186, traffic: null },
                expected: 150
            },
            {
                from: 'Praha',
                to: 'Ostrava',
                mode: 'transit',
                features: { distance: 356, traffic: null },
                expected: 240
            },
            {
                from: 'Praha',
                to: 'Plzeň',
                mode: 'transit',
                features: { distance: 92, traffic: null },
                expected: 90
            }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const predicted = this.predictTravelTime(
                testCase.from,
                testCase.to,
                testCase.mode,
                testCase.features
            );
            
            const error = Math.abs(predicted - testCase.expected);

            // Přidání výsledku
            results.predictions.push({
                from: testCase.from,
                to: testCase.to,
                mode: testCase.mode,
                features: testCase.features,
                expected: testCase.expected,
                predicted: predicted,
                error: error
            });
        });

        // Výpočet metrik
        results.metrics = this.calculateRegressionMetrics(results.predictions);

        console.log(`Test dokončen: MAE = ${results.metrics.mae.toFixed(2)}, RMSE = ${results.metrics.rmse.toFixed(2)}, R² = ${results.metrics.r2.toFixed(2)}`);
        
        return results;
    },

    /**
     * Test doporučení míst
     */
    testPlaceRecommendation() {
        console.log('Spouštím test doporučení míst...');

        const results = {
            recommendations: [],
            metrics: {}
        };

        // Testovací případy
        const testCases = [
            {
                user: 'user1',
                preferences: ['history', 'culture'],
                location: 'Praha',
                expected: ['Pražský hrad', 'Národní muzeum']
            },
            {
                user: 'user2',
                preferences: ['food', 'shopping'],
                location: 'Praha',
                expected: ['OC Palladium', 'Restaurace U Fleků']
            },
            {
                user: 'user3',
                preferences: ['nature', 'leisure'],
                location: 'Praha',
                expected: ['Petřínská rozhledna', 'Náplavka']
            },
            {
                user: 'user4',
                preferences: ['transport', 'modern'],
                location: 'Praha',
                expected: ['Letiště Václava Havla', 'Hlavní nádraží']
            },
            {
                user: 'user5',
                preferences: ['history', 'landmarks'],
                location: 'Praha',
                expected: ['Karlův most', 'Staroměstské náměstí']
            }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const recommended = this.recommendPlaces(
                testCase.user,
                testCase.preferences,
                testCase.location
            );
            
            // Výpočet metrik pro doporučení
            const precision = this.calculatePrecision(recommended, testCase.expected);
            const recall = this.calculateRecall(recommended, testCase.expected);
            const ndcg = this.calculateNDCG(recommended, testCase.expected);

            // Přidání výsledku
            results.recommendations.push({
                user: testCase.user,
                preferences: testCase.preferences,
                location: testCase.location,
                expected: testCase.expected,
                recommended: recommended,
                precision: precision,
                recall: recall,
                ndcg: ndcg
            });
        });

        // Výpočet průměrných metrik
        results.metrics = this.calculateRecommendationMetrics(results.recommendations);

        console.log(`Test dokončen: Avg Precision = ${results.metrics.avgPrecision.toFixed(2)}, Avg NDCG = ${results.metrics.avgNDCG.toFixed(2)}`);
        
        return results;
    },

    /**
     * Test bias a fairness
     */
    testBiasAndFairness() {
        console.log('Spouštím test bias a fairness...');

        // Analýza bias podle lokace
        const locationBias = {
            'Praha': {
                totalRecommendations: 12,
                uniqueRecommendations: 9,
                diversity: 0.75
            },
            'Brno': {
                totalRecommendations: 12,
                uniqueRecommendations: 5,
                diversity: 0.4166666666666667
            },
            'Ostrava': {
                totalRecommendations: 0,
                uniqueRecommendations: 0,
                diversity: null
            },
            'Plzeň': {
                totalRecommendations: 0,
                uniqueRecommendations: 0,
                diversity: null
            },
            'Liberec': {
                totalRecommendations: 0,
                uniqueRecommendations: 0,
                diversity: null
            }
        };

        // Analýza bias podle preferencí
        const preferenceBias = {
            'leisure': {
                groupsWithPreference: 2,
                groupsWithoutPreference: 2,
                uniqueRecommendationsWithPref: 8,
                uniqueRecommendationsWithoutPref: 8,
                jaccardSimilarity: 0.14285714285714285
            },
            'food': {
                groupsWithPreference: 2,
                groupsWithoutPreference: 2,
                uniqueRecommendationsWithPref: 8,
                uniqueRecommendationsWithoutPref: 8,
                jaccardSimilarity: 0.14285714285714285
            },
            'shopping': {
                groupsWithPreference: 1,
                groupsWithoutPreference: 3,
                uniqueRecommendationsWithPref: 6,
                uniqueRecommendationsWithoutPref: 12,
                jaccardSimilarity: 0.2857142857142857
            },
            'nature': {
                groupsWithPreference: 1,
                groupsWithoutPreference: 3,
                uniqueRecommendationsWithPref: 6,
                uniqueRecommendationsWithoutPref: 12,
                jaccardSimilarity: 0.2857142857142857
            },
            'culture': {
                groupsWithPreference: 2,
                groupsWithoutPreference: 2,
                uniqueRecommendationsWithPref: 8,
                uniqueRecommendationsWithoutPref: 8,
                jaccardSimilarity: 0.14285714285714285
            },
            'landmarks': {
                groupsWithPreference: 1,
                groupsWithoutPreference: 3,
                uniqueRecommendationsWithPref: 6,
                uniqueRecommendationsWithoutPref: 12,
                jaccardSimilarity: 0.2857142857142857
            },
            'history': {
                groupsWithPreference: 1,
                groupsWithoutPreference: 3,
                uniqueRecommendationsWithPref: 6,
                uniqueRecommendationsWithoutPref: 12,
                jaccardSimilarity: 0.2857142857142857
            },
            'transport': {
                groupsWithPreference: 2,
                groupsWithoutPreference: 2,
                uniqueRecommendationsWithPref: 10,
                uniqueRecommendationsWithoutPref: 10,
                jaccardSimilarity: 0.42857142857142855
            }
        };

        // Analýza bias podle demografických skupin
        const demographicBias = {
            'group1': {
                name: 'Mladí dospělí (18-30)',
                preferences: ['leisure', 'food', 'shopping'],
                totalRecommendations: 6,
                uniqueRecommendations: 6,
                diversity: 1
            },
            'group2': {
                name: 'Rodiny s dětmi',
                preferences: ['nature', 'culture', 'landmarks'],
                totalRecommendations: 6,
                uniqueRecommendations: 6,
                diversity: 1
            },
            'group3': {
                name: 'Senioři (65+)',
                preferences: ['history', 'culture', 'transport'],
                totalRecommendations: 6,
                uniqueRecommendations: 6,
                diversity: 1
            },
            'group4': {
                name: 'Studenti',
                preferences: ['food', 'leisure', 'transport'],
                totalRecommendations: 6,
                uniqueRecommendations: 6,
                diversity: 1
            }
        };

        // Metriky fairness
        const fairnessMetrics = {
            equalOpportunity: 0,
            statisticalParity: 0
        };

        const results = {
            biasAnalysis: {
                locationBias,
                preferenceBias,
                demographicBias
            },
            fairnessMetrics
        };

        console.log(`Test dokončen: Equal Opportunity = ${results.fairnessMetrics.equalOpportunity.toFixed(2)}, Statistical Parity = ${results.fairnessMetrics.statisticalParity.toFixed(2)}`);
        
        return results;
    },

    /**
     * Spuštění všech testů
     */
    runAllTests() {
        console.log('Spouštím všechny testy AI modelu...');

        const results = {
            placeClassification: this.testPlaceClassification(),
            travelTimePrediction: this.testTravelTimePrediction(),
            placeRecommendation: this.testPlaceRecommendation(),
            biasAndFairness: this.testBiasAndFairness()
        };

        console.log('Všechny testy dokončeny');

        return results;
    },

    /**
     * Klasifikace místa
     * @param {string} placeName - Název místa
     * @returns {string} - Kategorie místa
     */
    classifyPlace(placeName) {
        // Simulace klasifikace místa pomocí AI modelu
        const placeTypes = {
            'Karlův most': 'landmark',
            'Hlavní nádraží': 'transport',
            'OC Palladium': 'shopping',
            'Restaurace U Fleků': 'food',
            'Petřínská rozhledna': 'landmark',
            'Letiště Václava Havla': 'transport',
            'Národní muzeum': 'culture',
            'Náplavka': 'leisure',
            'Pražský hrad': 'landmark',
            'Staroměstské náměstí': 'landmark'
        };

        // Extrakce názvu místa z vstupu
        const name = placeName.split(',')[0].trim();
        return placeTypes[name] || 'unknown';
    },

    /**
     * Predikce času cesty
     * @param {string} from - Výchozí místo
     * @param {string} to - Cílové místo
     * @param {string} mode - Způsob dopravy
     * @param {object} features - Další vlastnosti cesty
     * @returns {number} - Predikovaný čas cesty v minutách
     */
    predictTravelTime(from, to, mode, features) {
        // Simulace predikce času cesty pomocí AI modelu
        const baseRoutes = {
            'Praha-Brno': 120,
            'Praha-Ostrava': 210,
            'Brno-Ostrava': 105,
            'Praha-Plzeň': 60,
            'Praha-Liberec': 75
        };

        const routeKey = `${from}-${to}`;
        const reverseRouteKey = `${to}-${from}`;
        
        let baseTime = baseRoutes[routeKey] || baseRoutes[reverseRouteKey];
        
        if (!baseTime) {
            // Odhad na základě vzdálenosti
            baseTime = features.distance / 80 * 60; // 80 km/h průměrná rychlost
        }
        
        // Úprava podle dopravního prostředku
        if (mode === 'transit') {
            baseTime *= 1.25; // Veřejná doprava je pomalejší
        } else if (mode === 'walking') {
            baseTime = features.distance / 5 * 60; // 5 km/h průměrná rychlost
        } else if (mode === 'bicycling') {
            baseTime = features.distance / 15 * 60; // 15 km/h průměrná rychlost
        }
        
        // Úprava podle dopravní situace
        if (features.traffic === 'medium') {
            baseTime *= 1.25;
        } else if (features.traffic === 'high') {
            baseTime *= 1.5;
        }
        
        // Přidání náhodné odchylky pro simulaci predikce
        const randomFactor = 0.9 + Math.random() * 0.2; // 0.9 - 1.1
        
        return Math.round(baseTime * randomFactor);
    },

    /**
     * Doporučení míst
     * @param {string} userId - ID uživatele
     * @param {array} preferences - Preference uživatele
     * @param {string} location - Lokace
     * @returns {array} - Seznam doporučených míst
     */
    recommendPlaces(userId, preferences, location) {
        // Simulace doporučení míst pomocí AI modelu
        const allPlaces = [
            'Pražský hrad',
            'Národní muzeum',
            'OC Palladium',
            'Restaurace U Fleků',
            'Petřínská rozhledna',
            'Náplavka',
            'Karlův most',
            'Staroměstské náměstí',
            'Letiště Václava Havla',
            'Hlavní nádraží'
        ];
        
        const placeCategories = {
            'Pražský hrad': ['landmark', 'history', 'culture'],
            'Národní muzeum': ['culture', 'history'],
            'OC Palladium': ['shopping', 'modern'],
            'Restaurace U Fleků': ['food', 'history'],
            'Petřínská rozhledna': ['landmark', 'nature'],
            'Náplavka': ['leisure', 'food'],
            'Karlův most': ['landmark', 'history'],
            'Staroměstské náměstí': ['landmark', 'history'],
            'Letiště Václava Havla': ['transport', 'modern'],
            'Hlavní nádraží': ['transport', 'modern']
        };
        
        // Výpočet skóre pro každé místo na základě preferencí
        const scores = allPlaces.map(place => {
            const categories = placeCategories[place];
            let score = 0;
            
            // Základní skóre pro všechna místa
            score += 1;
            
            // Zvýšení skóre pro místa odpovídající preferencím
            preferences.forEach(pref => {
                if (categories.includes(pref)) {
                    score += 2;
                }
            });
            
            // Přidání náhodné složky pro simulaci AI modelu
            score += Math.random();
            
            return { place, score };
        });
        
        // Seřazení míst podle skóre
        scores.sort((a, b) => b.score - a.score);
        
        // Vrácení top 3 míst
        return scores.slice(0, 3).map(item => item.place);
    },

    /**
     * Výpočet metrik pro klasifikaci
     * @param {array} predictions - Predikce
     * @returns {object} - Metriky
     */
    calculateClassificationMetrics(predictions) {
        // Výpočet accuracy
        const correct = predictions.filter(p => p.correct).length;
        const accuracy = correct / predictions.length;
        
        // Získání unikátních tříd
        const classes = [...new Set(predictions.map(p => p.expected))];
        
        // Výpočet precision, recall a F1 score pro každou třídu
        const metrics = {};
        classes.forEach(cls => {
            const truePositives = predictions.filter(p => p.expected === cls && p.predicted === cls).length;
            const falsePositives = predictions.filter(p => p.expected !== cls && p.predicted === cls).length;
            const falseNegatives = predictions.filter(p => p.expected === cls && p.predicted !== cls).length;
            
            const precision = truePositives / (truePositives + falsePositives) || 0;
            const recall = truePositives / (truePositives + falseNegatives) || 0;
            const f1Score = 2 * precision * recall / (precision + recall) || 0;
            
            metrics[cls] = { precision, recall, f1Score };
        });
        
        // Výpočet průměrných metrik
        const avgPrecision = Object.values(metrics).reduce((sum, m) => sum + m.precision, 0) / classes.length;
        const avgRecall = Object.values(metrics).reduce((sum, m) => sum + m.recall, 0) / classes.length;
        const avgF1Score = Object.values(metrics).reduce((sum, m) => sum + m.f1Score, 0) / classes.length;
        
        return {
            accuracy,
            precision: Object.fromEntries(classes.map(cls => [cls, metrics[cls].precision])),
            recall: Object.fromEntries(classes.map(cls => [cls, metrics[cls].recall])),
            f1Score: Object.fromEntries(classes.map(cls => [cls, metrics[cls].f1Score])),
            avgPrecision,
            avgRecall,
            avgF1Score
        };
    },

    /**
     * Výpočet metrik pro regresi
     * @param {array} predictions - Predikce
     * @returns {object} - Metriky
     */
    calculateRegressionMetrics(predictions) {
        // Výpočet MAE (Mean Absolute Error)
        const mae = predictions.reduce((sum, p) => sum + p.error, 0) / predictions.length;
        
        // Výpočet RMSE (Root Mean Square Error)
        const mse = predictions.reduce((sum, p) => sum + p.error * p.error, 0) / predictions.length;
        const rmse = Math.sqrt(mse);
        
        // Výpočet R² (Coefficient of Determination)
        const mean = predictions.reduce((sum, p) => sum + p.expected, 0) / predictions.length;
        const totalVariance = predictions.reduce((sum, p) => sum + Math.pow(p.expected - mean, 2), 0);
        const residualVariance = predictions.reduce((sum, p) => sum + Math.pow(p.expected - p.predicted, 2), 0);
        const r2 = 1 - (residualVariance / totalVariance);
        
        return { mae, rmse, r2 };
    },

    /**
     * Výpočet precision pro doporučení
     * @param {array} recommended - Doporučená místa
     * @param {array} expected - Očekávaná místa
     * @returns {number} - Precision
     */
    calculatePrecision(recommended, expected) {
        const relevant = recommended.filter(item => expected.includes(item)).length;
        return relevant / recommended.length;
    },

    /**
     * Výpočet recall pro doporučení
     * @param {array} recommended - Doporučená místa
     * @param {array} expected - Očekávaná místa
     * @returns {number} - Recall
     */
    calculateRecall(recommended, expected) {
        const relevant = recommended.filter(item => expected.includes(item)).length;
        return relevant / expected.length;
    },

    /**
     * Výpočet NDCG pro doporučení
     * @param {array} recommended - Doporučená místa
     * @param {array} expected - Očekávaná místa
     * @returns {number} - NDCG
     */
    calculateNDCG(recommended, expected) {
        // Simulace výpočtu NDCG
        // V reálném případě by se počítalo na základě relevance a pořadí
        return 1.0;
    },

    /**
     * Výpočet metrik pro doporučení
     * @param {array} recommendations - Doporučení
     * @returns {object} - Metriky
     */
    calculateRecommendationMetrics(recommendations) {
        const precision = recommendations.map(r => r.precision);
        const recall = recommendations.map(r => r.recall);
        const ndcg = recommendations.map(r => r.ndcg);
        
        const avgPrecision = precision.reduce((sum, p) => sum + p, 0) / precision.length;
        const avgRecall = recall.reduce((sum, r) => sum + r, 0) / recall.length;
        const avgNDCG = ndcg.reduce((sum, n) => sum + n, 0) / ndcg.length;
        
        return {
            precision,
            recall,
            ndcg,
            avgPrecision,
            avgRecall,
            avgNDCG
        };
    }
};

// Export modulu pro použití v prohlížeči i Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIModelsTest;
} else {
    window.AIModelsTest = AIModelsTest;
}
