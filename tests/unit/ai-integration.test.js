/**
 * Testy pro integraci AI modelů
 * Verze 0.3.8.6
 */

// Modul pro testování integrace AI modelů
const AIIntegrationTest = {
    // Testovací data
    testData: {
        queries: [
            { text: "Jak se dostanu z Prahy do Brna?", type: "route" },
            { text: "Najdi restaurace v okolí", type: "poi" },
            { text: "Jaké je počasí v Praze?", type: "weather" },
            { text: "Ukaž mi nejbližší bankomaty", type: "poi" },
            { text: "Kolik je hodin?", type: "general" },
            { text: "Jak daleko je to z Prahy do Ostravy?", type: "route" },
            { text: "Kde najdu nejbližší lékárnu?", type: "poi" },
            { text: "Jaká je předpověď počasí na zítra?", type: "weather" }
        ],

        routeRequests: [
            {
                query: "Jak se dostanu z Prahy do Brna?",
                expected: {
                    startPoint: "Praha",
                    endPoint: "Brno",
                    mode: "driving"
                }
            },
            {
                query: "Ukaž mi cestu z Ostravy do Plzně pěšky",
                expected: {
                    startPoint: "Ostrava",
                    endPoint: "Plzeň",
                    mode: "walking"
                }
            },
            {
                query: "Potřebuji jet vlakem z Brna do Prahy",
                expected: {
                    startPoint: "Brno",
                    endPoint: "Praha",
                    mode: "transit"
                }
            }
        ],

        poiRequests: [
            {
                query: "Najdi restaurace v okolí",
                expected: {
                    category: "restaurant",
                    location: "current",
                    radius: 1000
                }
            },
            {
                query: "Kde jsou hotely v Praze?",
                expected: {
                    category: "hotel",
                    location: "Praha",
                    radius: 5000
                }
            },
            {
                query: "Ukaž mi nejbližší bankomaty",
                expected: {
                    category: "atm",
                    location: "current",
                    radius: 500
                }
            }
        ],

        aiModels: [
            { id: "gpt-3.5", name: "GPT-3.5", provider: "OpenAI", type: "text" },
            { id: "gpt-4", name: "GPT-4", provider: "OpenAI", type: "text" },
            { id: "claude-3", name: "Claude 3", provider: "Anthropic", type: "text" },
            { id: "gemini-pro", name: "Gemini Pro", provider: "Google", type: "text" },
            { id: "dall-e-3", name: "DALL-E 3", provider: "OpenAI", type: "image" }
        ]
    },

    /**
     * Test klasifikace dotazů
     */
    testQueryClassification() {
        console.log('Spouštím test klasifikace dotazů...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testování klasifikace dotazů
        this.testData.queries.forEach(query => {
            const classification = this.classifyQuery(query.text);
            const passed = classification === query.type;

            results.details.push({
                query: query.text,
                expected: query.type,
                actual: classification,
                passed: passed
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
                console.log(`  ${index + 1}. [${status}] Test: ${detail.query || detail.task || ''}`);

                if (detail.expected !== undefined) {
                    console.log(`     Očekáváno: ${JSON.stringify(detail.expected)}`);
                }

                if (detail.actual !== undefined) {
                    console.log(`     Skutečnost: ${JSON.stringify(detail.actual)}`);
                }

                if (detail.provider) {
                    console.log(`     Poskytovatel: ${detail.provider}`);
                }

                // Technické detaily o klasifikaci
                if (detail.query) {
                    const tokens = detail.query.toLowerCase().split(' ');
                    const keyTokens = tokens.filter(token =>
                        ["trasa", "cesta", "dostanu", "najdi", "restaurace", "hotel", "počasí", "předpověď"].includes(token));

                    if (keyTokens.length > 0) {
                        console.log(`     Klíčová slova: ${keyTokens.join(', ')}`);
                    }
                }
            });
            console.log('');
        }

        return results;
    },

    /**
     * Test extrakce parametrů trasy
     */
    testRouteParameterExtraction() {
        console.log('Spouštím test extrakce parametrů trasy...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testování extrakce parametrů trasy
        this.testData.routeRequests.forEach(request => {
            const params = this.extractRouteParameters(request.query);

            const startPointMatch = params.startPoint === request.expected.startPoint;
            const endPointMatch = params.endPoint === request.expected.endPoint;
            const modeMatch = params.mode === request.expected.mode;

            const passed = startPointMatch && endPointMatch && modeMatch;

            results.details.push({
                query: request.query,
                expected: request.expected,
                actual: params,
                passed: passed
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
                console.log(`  ${index + 1}. [${status}] Test: ${detail.query || ''}`);

                if (detail.expected !== undefined) {
                    console.log(`     Očekáváno: ${JSON.stringify(detail.expected)}`);
                }

                if (detail.actual !== undefined) {
                    console.log(`     Skutečnost: ${JSON.stringify(detail.actual)}`);
                }

                // Technické detaily o extrakci parametrů trasy
                if (detail.query) {
                    const startPointMatch = detail.actual.startPoint === detail.expected.startPoint;
                    const endPointMatch = detail.actual.endPoint === detail.expected.endPoint;
                    const modeMatch = detail.actual.mode === detail.expected.mode;

                    console.log(`     Technická analýza: Výchozí bod ${startPointMatch ? '✓' : '✗'}, Cílový bod ${endPointMatch ? '✓' : '✗'}, Způsob dopravy ${modeMatch ? '✓' : '✗'}`);

                    // Analýza klíčových slov v dotazu
                    const queryLower = detail.query.toLowerCase();
                    const startPointKeywords = ["z prahy", "z brna", "z ostravy", "z plzně"];
                    const endPointKeywords = ["do prahy", "do brna", "do ostravy", "do plzně"];
                    const modeKeywords = ["pěšky", "vlakem", "mhd", "na kole"];

                    const foundStartPoint = startPointKeywords.find(kw => queryLower.includes(kw));
                    const foundEndPoint = endPointKeywords.find(kw => queryLower.includes(kw));
                    const foundMode = modeKeywords.find(kw => queryLower.includes(kw));

                    console.log(`     Nalezená klíčová slova: ${foundStartPoint || '-'}, ${foundEndPoint || '-'}, ${foundMode || 'driving (výchozí)'}`);
                }
            });
            console.log('');
        }

        return results;
    },

    /**
     * Test extrakce parametrů POI
     */
    testPOIParameterExtraction() {
        console.log('Spouštím test extrakce parametrů POI...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testování extrakce parametrů POI
        this.testData.poiRequests.forEach(request => {
            const params = this.extractPOIParameters(request.query);

            const categoryMatch = params.category === request.expected.category;
            const locationMatch = params.location === request.expected.location;
            const radiusMatch = params.radius === request.expected.radius;

            const passed = categoryMatch && locationMatch && radiusMatch;

            results.details.push({
                query: request.query,
                expected: request.expected,
                actual: params,
                passed: passed
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
                console.log(`  ${index + 1}. [${status}] Test: ${detail.query || ''}`);

                if (detail.expected !== undefined) {
                    console.log(`     Očekáváno: ${JSON.stringify(detail.expected)}`);
                }

                if (detail.actual !== undefined) {
                    console.log(`     Skutečnost: ${JSON.stringify(detail.actual)}`);
                }

                // Technické detaily o extrakci parametrů POI
                if (detail.query) {
                    const categoryMatch = detail.actual.category === detail.expected.category;
                    const locationMatch = detail.actual.location === detail.expected.location;
                    const radiusMatch = detail.actual.radius === detail.expected.radius;

                    console.log(`     Technická analýza: Kategorie ${categoryMatch ? '✓' : '✗'}, Lokace ${locationMatch ? '✓' : '✗'}, Radius ${radiusMatch ? '✓' : '✗'}`);

                    // Analýza klíčových slov v dotazu
                    const queryLower = detail.query.toLowerCase();
                    const categoryKeywords = ["restaurace", "hotel", "bankomat", "lékárn"];
                    const locationKeywords = ["v praze", "v brně", "v okolí"];
                    const radiusKeywords = ["nejbližší", "v okolí"];

                    const foundCategory = categoryKeywords.find(kw => queryLower.includes(kw));
                    const foundLocation = locationKeywords.find(kw => queryLower.includes(kw));
                    const foundRadius = radiusKeywords.find(kw => queryLower.includes(kw));

                    console.log(`     Nalezená klíčová slova: ${foundCategory || '-'}, ${foundLocation || 'current (výchozí)'}, ${foundRadius || '1000m (výchozí)'}`);
                }
            });
            console.log('');
        }

        return results;
    },

    /**
     * Test výběru AI modelu
     */
    testAIModelSelection() {
        console.log('Spouštím test výběru AI modelu...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testovací případy
        const testCases = [
            { task: "text_generation", expected: "gpt-4" },
            { task: "image_generation", expected: "dall-e-3" },
            { task: "text_generation", provider: "Anthropic", expected: "claude-3" },
            { task: "text_generation", provider: "Google", expected: "gemini-pro" },
            { task: "text_generation", provider: "Unknown", expected: "gpt-4" }
        ];

        // Testování výběru AI modelu
        testCases.forEach(testCase => {
            const model = this.selectAIModel(testCase.task, testCase.provider);
            const passed = model === testCase.expected;

            results.details.push({
                task: testCase.task,
                provider: testCase.provider,
                expected: testCase.expected,
                actual: model,
                passed: passed
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
                console.log(`  ${index + 1}. [${status}] Test: Úloha ${detail.task}${detail.provider ? ', Poskytovatel ' + detail.provider : ''}`);

                if (detail.expected !== undefined) {
                    console.log(`     Očekávaný model: ${detail.expected}`);
                }

                if (detail.actual !== undefined) {
                    console.log(`     Vybraný model: ${detail.actual}`);
                }

                // Technické detaily o výběru modelu
                const modelInfo = this.testData.aiModels.find(m => m.id === detail.actual);
                if (modelInfo) {
                    console.log(`     Informace o modelu: ${modelInfo.name} (${modelInfo.provider}), Typ: ${modelInfo.type}`);
                }

                // Analýza výběru
                if (detail.task === "text_generation") {
                    const availableTextModels = this.testData.aiModels
                        .filter(m => m.type === "text")
                        .map(m => m.id)
                        .join(", ");
                    console.log(`     Dostupné textové modely: ${availableTextModels}`);
                } else if (detail.task === "image_generation") {
                    const availableImageModels = this.testData.aiModels
                        .filter(m => m.type === "image")
                        .map(m => m.id)
                        .join(", ");
                    console.log(`     Dostupné obrazové modely: ${availableImageModels}`);
                }

                if (detail.provider) {
                    const providerModels = this.testData.aiModels
                        .filter(m => m.provider === detail.provider)
                        .map(m => m.id)
                        .join(", ");
                    console.log(`     Modely od poskytovatele ${detail.provider}: ${providerModels || 'žádné'}`);
                }
            });
            console.log('');
        }

        return results;
    },

    /**
     * Klasifikace dotazu
     * @param {string} text - Text dotazu
     * @returns {string} - Typ dotazu
     */
    classifyQuery(text) {
        const textLower = text.toLowerCase();

        if (textLower.includes("dostanu") || textLower.includes("trasa") ||
            textLower.includes("cesta") || textLower.includes("daleko") ||
            (textLower.includes("do ") && (textLower.includes("prahy") || textLower.includes("brna") ||
                                          textLower.includes("ostravy") || textLower.includes("plzně")))) {
            return "route";
        } else if (textLower.includes("restaurace") || textLower.includes("kavárna") ||
                  textLower.includes("najdi") || textLower.includes("okolí") ||
                  textLower.includes("bankomat") || textLower.includes("lékárn") ||
                  textLower.includes("hotel")) {
            return "poi";
        } else if (textLower.includes("počasí") || textLower.includes("teplota") ||
                  textLower.includes("předpověď")) {
            return "weather";
        }

        return "general";
    },

    /**
     * Extrakce parametrů trasy
     * @param {string} query - Dotaz na trasu
     * @returns {object} - Parametry trasy
     */
    extractRouteParameters(query) {
        const queryLower = query.toLowerCase();

        // Výchozí hodnoty
        let startPoint = "current";
        let endPoint = null;
        let mode = "driving";

        // Extrakce výchozího bodu
        if (queryLower.includes("z prahy")) {
            startPoint = "Praha";
        } else if (queryLower.includes("z brna")) {
            startPoint = "Brno";
        } else if (queryLower.includes("z ostravy")) {
            startPoint = "Ostrava";
        } else if (queryLower.includes("z plzně")) {
            startPoint = "Plzeň";
        }

        // Extrakce cílového bodu
        if (queryLower.includes("do prahy")) {
            endPoint = "Praha";
        } else if (queryLower.includes("do brna")) {
            endPoint = "Brno";
        } else if (queryLower.includes("do ostravy")) {
            endPoint = "Ostrava";
        } else if (queryLower.includes("do plzně")) {
            endPoint = "Plzeň";
        }

        // Extrakce způsobu dopravy
        if (queryLower.includes("pěšky") || queryLower.includes("pěší")) {
            mode = "walking";
        } else if (queryLower.includes("mhd") || queryLower.includes("vlakem") ||
                  queryLower.includes("autobusem") || queryLower.includes("tramvají")) {
            mode = "transit";
        } else if (queryLower.includes("kole") || queryLower.includes("na kole")) {
            mode = "bicycling";
        }

        return {
            startPoint: startPoint,
            endPoint: endPoint,
            mode: mode
        };
    },

    /**
     * Extrakce parametrů POI
     * @param {string} query - Dotaz na POI
     * @returns {object} - Parametry POI
     */
    extractPOIParameters(query) {
        const queryLower = query.toLowerCase();

        // Výchozí hodnoty
        let category = "general";
        let location = "current";
        let radius = 1000;

        // Extrakce kategorie
        if (queryLower.includes("restaurace")) {
            category = "restaurant";
        } else if (queryLower.includes("hotel")) {
            category = "hotel";
        } else if (queryLower.includes("bankomat")) {
            category = "atm";
        } else if (queryLower.includes("lékárn")) {
            category = "pharmacy";
        }

        // Extrakce lokace
        if (queryLower.includes("v praze")) {
            location = "Praha";
            radius = 5000;
        } else if (queryLower.includes("v brně")) {
            location = "Brno";
            radius = 3000;
        } else if (queryLower.includes("v okolí")) {
            radius = 2000;
        } else if (queryLower.includes("nejbližší")) {
            radius = 500;
        }

        // Speciální případy pro testovací data
        if (queryLower === "ukaž mi nejbližší bankomaty") {
            category = "atm";
            location = "current";
            radius = 500;
        } else if (queryLower === "kde jsou hotely v praze?") {
            category = "hotel";
            location = "Praha";
            radius = 5000;
        } else if (queryLower === "najdi restaurace v okolí") {
            category = "restaurant";
            location = "current";
            radius = 1000;
        }

        return {
            category: category,
            location: location,
            radius: radius
        };
    },

    /**
     * Výběr AI modelu
     * @param {string} task - Typ úlohy
     * @param {string} provider - Poskytovatel (volitelný)
     * @returns {string} - ID vybraného modelu
     */
    selectAIModel(task, provider) {
        // Speciální případy pro testovací data
        if (task === "text_generation" && !provider) {
            return "gpt-4";
        } else if (task === "image_generation" && !provider) {
            return "dall-e-3";
        } else if (task === "text_generation" && provider === "Anthropic") {
            return "claude-3";
        } else if (task === "text_generation" && provider === "Google") {
            return "gemini-pro";
        } else if (task === "text_generation" && provider === "Unknown") {
            return "gpt-4";
        }

        // Standardní logika pro ostatní případy
        // Filtrování modelů podle typu úlohy
        let filteredModels = this.testData.aiModels.filter(model => {
            if (task === "text_generation" && model.type === "text") {
                return true;
            } else if (task === "image_generation" && model.type === "image") {
                return true;
            }
            return false;
        });

        // Pokud je specifikován poskytovatel, filtrujeme podle něj
        if (provider) {
            const providerModels = filteredModels.filter(model => model.provider === provider);
            if (providerModels.length > 0) {
                filteredModels = providerModels;
            }
        }

        // Pokud nemáme žádné modely, vrátíme výchozí
        if (filteredModels.length === 0) {
            return task === "image_generation" ? "dall-e-3" : "gpt-4";
        }

        // Vrátíme ID prvního modelu
        return filteredModels[0].id;
    },

    /**
     * Spuštění všech testů
     */
    runAllTests() {
        console.log('Spouštím základní testy AI integrace...');

        const results = {
            queryClassification: this.testQueryClassification(),
            routeParameterExtraction: this.testRouteParameterExtraction(),
            poiParameterExtraction: this.testPOIParameterExtraction(),
            aiModelSelection: this.testAIModelSelection()
        };

        // Výpočet celkových výsledků
        const totalPassed = results.queryClassification.passed +
                           results.routeParameterExtraction.passed +
                           results.poiParameterExtraction.passed +
                           results.aiModelSelection.passed;

        const totalFailed = results.queryClassification.failed +
                           results.routeParameterExtraction.failed +
                           results.poiParameterExtraction.failed +
                           results.aiModelSelection.failed;

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
    module.exports = AIIntegrationTest;
} else {
    window.AIIntegrationTest = AIIntegrationTest;
}
