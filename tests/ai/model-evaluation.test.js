/**
 * Testy pro evaluaci AI modelu
 * Verze 0.3.8.6
 */

// Modul pro testování a evaluaci AI modelu
const AIModelTest = {
    // Testovací data
    testData: {
        // Testovací dataset pro klasifikaci míst
        placeClassification: [
            { input: 'Karlův most, Praha', expected: 'landmark', features: { popularity: 0.95, historical: true } },
            { input: 'Hlavní nádraží, Praha', expected: 'transport', features: { popularity: 0.8, historical: false } },
            { input: 'OC Palladium, Praha', expected: 'shopping', features: { popularity: 0.75, historical: false } },
            { input: 'Restaurace U Fleků, Praha', expected: 'food', features: { popularity: 0.7, historical: true } },
            { input: 'Petřínská rozhledna, Praha', expected: 'landmark', features: { popularity: 0.85, historical: true } },
            { input: 'Letiště Václava Havla, Praha', expected: 'transport', features: { popularity: 0.9, historical: false } },
            { input: 'Národní muzeum, Praha', expected: 'culture', features: { popularity: 0.8, historical: true } },
            { input: 'Náplavka, Praha', expected: 'leisure', features: { popularity: 0.7, historical: false } },
            { input: 'Pražský hrad, Praha', expected: 'landmark', features: { popularity: 0.95, historical: true } },
            { input: 'Staroměstské náměstí, Praha', expected: 'landmark', features: { popularity: 0.9, historical: true } }
        ],
        
        // Testovací dataset pro predikci času cesty
        travelTimePrediction: [
            { from: 'Praha', to: 'Brno', mode: 'driving', expected: 120, features: { distance: 186, traffic: 'low' } },
            { from: 'Praha', to: 'Brno', mode: 'driving', expected: 150, features: { distance: 186, traffic: 'medium' } },
            { from: 'Praha', to: 'Brno', mode: 'driving', expected: 180, features: { distance: 186, traffic: 'high' } },
            { from: 'Praha', to: 'Ostrava', mode: 'driving', expected: 210, features: { distance: 356, traffic: 'low' } },
            { from: 'Praha', to: 'Plzeň', mode: 'driving', expected: 60, features: { distance: 92, traffic: 'low' } },
            { from: 'Praha', to: 'Liberec', mode: 'driving', expected: 75, features: { distance: 110, traffic: 'low' } },
            { from: 'Brno', to: 'Ostrava', mode: 'driving', expected: 105, features: { distance: 170, traffic: 'low' } },
            { from: 'Praha', to: 'Brno', mode: 'transit', expected: 150, features: { distance: 186, traffic: null } },
            { from: 'Praha', to: 'Ostrava', mode: 'transit', expected: 240, features: { distance: 356, traffic: null } },
            { from: 'Praha', to: 'Plzeň', mode: 'transit', expected: 90, features: { distance: 92, traffic: null } }
        ],
        
        // Testovací dataset pro doporučení míst
        placeRecommendation: [
            { user: 'user1', preferences: ['history', 'culture'], location: 'Praha', expected: ['Pražský hrad', 'Národní muzeum'] },
            { user: 'user2', preferences: ['food', 'shopping'], location: 'Praha', expected: ['OC Palladium', 'Restaurace U Fleků'] },
            { user: 'user3', preferences: ['nature', 'leisure'], location: 'Praha', expected: ['Petřínská rozhledna', 'Náplavka'] },
            { user: 'user4', preferences: ['transport', 'modern'], location: 'Praha', expected: ['Letiště Václava Havla', 'Hlavní nádraží'] },
            { user: 'user5', preferences: ['history', 'landmarks'], location: 'Praha', expected: ['Karlův most', 'Staroměstské náměstí'] }
        ]
    },

    // Simulace AI modelu
    model: {
        // Klasifikace míst
        classifyPlace: function(input) {
            // Jednoduchá simulace klasifikace na základě klíčových slov
            const keywords = {
                landmark: ['most', 'hrad', 'náměstí', 'rozhledna'],
                transport: ['nádraží', 'letiště', 'stanice', 'zastávka'],
                shopping: ['obchodní', 'centrum', 'palladium', 'nákupní'],
                food: ['restaurace', 'hospoda', 'kavárna', 'fleků'],
                culture: ['muzeum', 'divadlo', 'galerie', 'knihovna'],
                leisure: ['park', 'náplavka', 'zahrada', 'ostrov']
            };
            
            const inputLower = input.toLowerCase();
            
            for (const [category, words] of Object.entries(keywords)) {
                for (const word of words) {
                    if (inputLower.includes(word)) {
                        return category;
                    }
                }
            }
            
            return 'unknown';
        },
        
        // Predikce času cesty
        predictTravelTime: function(from, to, mode, features) {
            // Jednoduchá simulace predikce času cesty
            const baseSpeed = {
                driving: 90, // km/h
                transit: 70, // km/h
                walking: 5,  // km/h
                bicycling: 15 // km/h
            };
            
            const trafficFactor = {
                low: 1.0,
                medium: 1.25,
                high: 1.5,
                null: 1.0
            };
            
            const distance = features.distance;
            const speed = baseSpeed[mode] || baseSpeed.driving;
            const factor = trafficFactor[features.traffic] || trafficFactor.low;
            
            // Čas v minutách
            return Math.round((distance / speed) * 60 * factor);
        },
        
        // Doporučení míst
        recommendPlaces: function(user, preferences, location) {
            // Jednoduchá simulace doporučení míst
            const places = {
                'Praha': [
                    { name: 'Pražský hrad', categories: ['landmark', 'history', 'culture'] },
                    { name: 'Karlův most', categories: ['landmark', 'history', 'landmarks'] },
                    { name: 'Staroměstské náměstí', categories: ['landmark', 'history', 'landmarks'] },
                    { name: 'Národní muzeum', categories: ['culture', 'history', 'indoor'] },
                    { name: 'Petřínská rozhledna', categories: ['landmark', 'nature', 'outdoor'] },
                    { name: 'Letiště Václava Havla', categories: ['transport', 'modern', 'services'] },
                    { name: 'Hlavní nádraží', categories: ['transport', 'modern', 'services'] },
                    { name: 'OC Palladium', categories: ['shopping', 'modern', 'indoor'] },
                    { name: 'Restaurace U Fleků', categories: ['food', 'history', 'indoor'] },
                    { name: 'Náplavka', categories: ['leisure', 'nature', 'outdoor'] }
                ],
                'Brno': [
                    { name: 'Špilberk', categories: ['landmark', 'history', 'culture'] },
                    { name: 'Katedrála sv. Petra a Pavla', categories: ['landmark', 'history', 'culture'] },
                    { name: 'Náměstí Svobody', categories: ['landmark', 'modern', 'landmarks'] },
                    { name: 'Moravské zemské muzeum', categories: ['culture', 'history', 'indoor'] },
                    { name: 'Brněnská přehrada', categories: ['nature', 'leisure', 'outdoor'] }
                ]
            };
            
            const locationPlaces = places[location] || [];
            
            // Skóre pro každé místo na základě preferencí uživatele
            const scoredPlaces = locationPlaces.map(place => {
                let score = 0;
                for (const pref of preferences) {
                    if (place.categories.includes(pref)) {
                        score += 1;
                    }
                }
                return { name: place.name, score };
            });
            
            // Seřazení míst podle skóre
            scoredPlaces.sort((a, b) => b.score - a.score);
            
            // Vrácení názvů míst
            return scoredPlaces.slice(0, 3).map(place => place.name);
        }
    },

    /**
     * Test klasifikace míst
     */
    testPlaceClassification() {
        console.log('Spouštím test klasifikace míst...');
        
        const results = {
            predictions: [],
            metrics: {
                accuracy: 0,
                precision: {},
                recall: {},
                f1Score: {}
            }
        };
        
        // Matice záměn pro výpočet metrik
        const confusionMatrix = {};
        const categories = new Set();
        
        // Predikce pro každý vstup
        for (const sample of this.testData.placeClassification) {
            const predicted = this.model.classifyPlace(sample.input);
            const expected = sample.expected;
            
            categories.add(expected);
            
            results.predictions.push({
                input: sample.input,
                expected: expected,
                predicted: predicted,
                correct: predicted === expected
            });
            
            // Aktualizace matice záměn
            if (!confusionMatrix[expected]) {
                confusionMatrix[expected] = {};
            }
            
            if (!confusionMatrix[expected][predicted]) {
                confusionMatrix[expected][predicted] = 0;
            }
            
            confusionMatrix[expected][predicted]++;
        }
        
        // Výpočet metrik
        let totalCorrect = 0;
        const categoriesArray = Array.from(categories);
        
        for (const prediction of results.predictions) {
            if (prediction.correct) {
                totalCorrect++;
            }
        }
        
        // Accuracy
        results.metrics.accuracy = totalCorrect / results.predictions.length;
        
        // Precision, Recall, F1 Score pro každou kategorii
        for (const category of categoriesArray) {
            let truePositives = 0;
            let falsePositives = 0;
            let falseNegatives = 0;
            
            for (const prediction of results.predictions) {
                if (prediction.predicted === category && prediction.expected === category) {
                    truePositives++;
                } else if (prediction.predicted === category && prediction.expected !== category) {
                    falsePositives++;
                } else if (prediction.predicted !== category && prediction.expected === category) {
                    falseNegatives++;
                }
            }
            
            const precision = truePositives / (truePositives + falsePositives) || 0;
            const recall = truePositives / (truePositives + falseNegatives) || 0;
            const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
            
            results.metrics.precision[category] = precision;
            results.metrics.recall[category] = recall;
            results.metrics.f1Score[category] = f1Score;
        }
        
        // Průměrné metriky
        results.metrics.avgPrecision = Object.values(results.metrics.precision).reduce((a, b) => a + b, 0) / categoriesArray.length;
        results.metrics.avgRecall = Object.values(results.metrics.recall).reduce((a, b) => a + b, 0) / categoriesArray.length;
        results.metrics.avgF1Score = Object.values(results.metrics.f1Score).reduce((a, b) => a + b, 0) / categoriesArray.length;
        
        console.log(`Test dokončen: Accuracy = ${results.metrics.accuracy.toFixed(2)}, Avg F1 Score = ${results.metrics.avgF1Score.toFixed(2)}`);
        return results;
    },

    /**
     * Test predikce času cesty
     */
    testTravelTimePrediction() {
        console.log('Spouštím test predikce času cesty...');
        
        const results = {
            predictions: [],
            metrics: {
                mae: 0,
                rmse: 0,
                r2: 0
            }
        };
        
        // Predikce pro každý vstup
        let sumError = 0;
        let sumSquaredError = 0;
        let sumExpected = 0;
        let sumSquaredDiff = 0;
        
        for (const sample of this.testData.travelTimePrediction) {
            const predicted = this.model.predictTravelTime(
                sample.from, 
                sample.to, 
                sample.mode, 
                sample.features
            );
            
            const expected = sample.expected;
            const error = Math.abs(predicted - expected);
            const squaredError = Math.pow(error, 2);
            
            results.predictions.push({
                from: sample.from,
                to: sample.to,
                mode: sample.mode,
                features: sample.features,
                expected: expected,
                predicted: predicted,
                error: error
            });
            
            sumError += error;
            sumSquaredError += squaredError;
            sumExpected += expected;
        }
        
        // Výpočet metrik
        const n = results.predictions.length;
        const meanExpected = sumExpected / n;
        
        // Výpočet celkové sumy čtverců
        for (const sample of this.testData.travelTimePrediction) {
            sumSquaredDiff += Math.pow(sample.expected - meanExpected, 2);
        }
        
        // Mean Absolute Error
        results.metrics.mae = sumError / n;
        
        // Root Mean Squared Error
        results.metrics.rmse = Math.sqrt(sumSquaredError / n);
        
        // R-squared
        results.metrics.r2 = 1 - (sumSquaredError / sumSquaredDiff);
        
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
            metrics: {
                precision: [],
                recall: [],
                ndcg: []
            }
        };
        
        // Doporučení pro každého uživatele
        for (const sample of this.testData.placeRecommendation) {
            const recommended = this.model.recommendPlaces(
                sample.user, 
                sample.preferences, 
                sample.location
            );
            
            const expected = sample.expected;
            
            // Výpočet Precision@k a Recall@k
            const k = recommended.length;
            let relevantCount = 0;
            
            for (const place of recommended) {
                if (expected.includes(place)) {
                    relevantCount++;
                }
            }
            
            const precision = relevantCount / k;
            const recall = relevantCount / expected.length;
            
            // Výpočet NDCG
            let dcg = 0;
            let idcg = 0;
            
            for (let i = 0; i < k; i++) {
                // Relevance: 1 pokud je místo v očekávaných, jinak 0
                const relevance = expected.includes(recommended[i]) ? 1 : 0;
                dcg += (Math.pow(2, relevance) - 1) / Math.log2(i + 2);
            }
            
            // Ideální DCG
            const idealRelevances = expected.slice(0, k).map(() => 1);
            for (let i = 0; i < idealRelevances.length; i++) {
                idcg += (Math.pow(2, idealRelevances[i]) - 1) / Math.log2(i + 2);
            }
            
            const ndcg = idcg === 0 ? 0 : dcg / idcg;
            
            results.recommendations.push({
                user: sample.user,
                preferences: sample.preferences,
                location: sample.location,
                expected: expected,
                recommended: recommended,
                precision: precision,
                recall: recall,
                ndcg: ndcg
            });
            
            results.metrics.precision.push(precision);
            results.metrics.recall.push(recall);
            results.metrics.ndcg.push(ndcg);
        }
        
        // Průměrné metriky
        results.metrics.avgPrecision = results.metrics.precision.reduce((a, b) => a + b, 0) / results.metrics.precision.length;
        results.metrics.avgRecall = results.metrics.recall.reduce((a, b) => a + b, 0) / results.metrics.recall.length;
        results.metrics.avgNDCG = results.metrics.ndcg.reduce((a, b) => a + b, 0) / results.metrics.ndcg.length;
        
        console.log(`Test dokončen: Avg Precision = ${results.metrics.avgPrecision.toFixed(2)}, Avg NDCG = ${results.metrics.avgNDCG.toFixed(2)}`);
        return results;
    },

    /**
     * Test bias a fairness
     */
    testBiasAndFairness() {
        console.log('Spouštím test bias a fairness...');
        
        const results = {
            biasAnalysis: {
                locationBias: {},
                preferenceBias: {},
                demographicBias: {}
            },
            fairnessMetrics: {
                equalOpportunity: 0,
                statisticalParity: 0
            }
        };
        
        // Simulace různých demografických skupin
        const demographicGroups = [
            { id: 'group1', name: 'Mladí dospělí (18-30)', preferences: ['leisure', 'food', 'shopping'] },
            { id: 'group2', name: 'Rodiny s dětmi', preferences: ['nature', 'culture', 'landmarks'] },
            { id: 'group3', name: 'Senioři (65+)', preferences: ['history', 'culture', 'transport'] },
            { id: 'group4', name: 'Studenti', preferences: ['food', 'leisure', 'transport'] }
        ];
        
        // Simulace různých lokací
        const locations = ['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Liberec'];
        
        // Analýza bias podle lokace
        for (const location of locations) {
            const recommendations = [];
            
            for (const group of demographicGroups) {
                const recommended = this.model.recommendPlaces(
                    group.id, 
                    group.preferences, 
                    location
                );
                
                recommendations.push({
                    group: group.id,
                    recommended: recommended
                });
            }
            
            // Výpočet rozmanitosti doporučení pro tuto lokaci
            const allRecommendations = recommendations.flatMap(r => r.recommended);
            const uniqueRecommendations = new Set(allRecommendations);
            
            results.biasAnalysis.locationBias[location] = {
                totalRecommendations: allRecommendations.length,
                uniqueRecommendations: uniqueRecommendations.size,
                diversity: uniqueRecommendations.size / allRecommendations.length
            };
        }
        
        // Analýza bias podle preferencí
        const allPreferences = demographicGroups.flatMap(g => g.preferences);
        const uniquePreferences = [...new Set(allPreferences)];
        
        for (const preference of uniquePreferences) {
            const groupsWithPreference = demographicGroups.filter(g => g.preferences.includes(preference));
            const groupsWithoutPreference = demographicGroups.filter(g => !g.preferences.includes(preference));
            
            const recommendationsWithPref = [];
            const recommendationsWithoutPref = [];
            
            // Doporučení pro skupiny s preferencí
            for (const group of groupsWithPreference) {
                for (const location of locations) {
                    const recommended = this.model.recommendPlaces(
                        group.id, 
                        group.preferences, 
                        location
                    );
                    
                    recommendationsWithPref.push(...recommended);
                }
            }
            
            // Doporučení pro skupiny bez preference
            for (const group of groupsWithoutPreference) {
                for (const location of locations) {
                    const recommended = this.model.recommendPlaces(
                        group.id, 
                        group.preferences, 
                        location
                    );
                    
                    recommendationsWithoutPref.push(...recommended);
                }
            }
            
            // Výpočet rozdílu v doporučeních
            const uniqueWithPref = new Set(recommendationsWithPref);
            const uniqueWithoutPref = new Set(recommendationsWithoutPref);
            
            // Jaccard similarity
            const intersection = new Set([...uniqueWithPref].filter(x => uniqueWithoutPref.has(x)));
            const union = new Set([...uniqueWithPref, ...uniqueWithoutPref]);
            
            const similarity = intersection.size / union.size;
            
            results.biasAnalysis.preferenceBias[preference] = {
                groupsWithPreference: groupsWithPreference.length,
                groupsWithoutPreference: groupsWithoutPreference.length,
                uniqueRecommendationsWithPref: uniqueWithPref.size,
                uniqueRecommendationsWithoutPref: uniqueWithoutPref.size,
                jaccardSimilarity: similarity
            };
        }
        
        // Analýza demografického bias
        for (const group of demographicGroups) {
            const recommendations = [];
            
            for (const location of locations) {
                const recommended = this.model.recommendPlaces(
                    group.id, 
                    group.preferences, 
                    location
                );
                
                recommendations.push({
                    location: location,
                    recommended: recommended
                });
            }
            
            // Výpočet rozmanitosti doporučení pro tuto skupinu
            const allRecommendations = recommendations.flatMap(r => r.recommended);
            const uniqueRecommendations = new Set(allRecommendations);
            
            results.biasAnalysis.demographicBias[group.id] = {
                name: group.name,
                preferences: group.preferences,
                totalRecommendations: allRecommendations.length,
                uniqueRecommendations: uniqueRecommendations.size,
                diversity: uniqueRecommendations.size / allRecommendations.length
            };
        }
        
        // Výpočet metrik fairness
        
        // Equal Opportunity - rozdíl v recall mezi demografickými skupinami
        const recalls = [];
        
        for (const group of demographicGroups) {
            let relevantCount = 0;
            let totalExpected = 0;
            
            for (const sample of this.testData.placeRecommendation) {
                // Simulace, že vzorek patří této skupině
                const recommended = this.model.recommendPlaces(
                    group.id, 
                    group.preferences, 
                    sample.location
                );
                
                const expected = sample.expected;
                totalExpected += expected.length;
                
                for (const place of recommended) {
                    if (expected.includes(place)) {
                        relevantCount++;
                    }
                }
            }
            
            const recall = relevantCount / totalExpected;
            recalls.push(recall);
        }
        
        // Equal Opportunity - rozdíl mezi nejvyšším a nejnižším recall
        results.fairnessMetrics.equalOpportunity = Math.max(...recalls) - Math.min(...recalls);
        
        // Statistical Parity - rozdíl v počtu doporučení mezi demografickými skupinami
        const recommendationCounts = [];
        
        for (const group of demographicGroups) {
            let totalRecommendations = 0;
            
            for (const location of locations) {
                const recommended = this.model.recommendPlaces(
                    group.id, 
                    group.preferences, 
                    location
                );
                
                totalRecommendations += recommended.length;
            }
            
            recommendationCounts.push(totalRecommendations / locations.length);
        }
        
        // Statistical Parity - rozdíl mezi nejvyšším a nejnižším počtem doporučení
        results.fairnessMetrics.statisticalParity = Math.max(...recommendationCounts) - Math.min(...recommendationCounts);
        
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
    }
};

// Export modulu pro použití v prohlížeči i Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIModelTest;
} else {
    window.AIModelTest = AIModelTest;
}
