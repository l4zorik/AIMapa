/**
 * Testovací skript pro ověření Content Security Policy v AIMapa
 * Verze 0.3.8.5
 */

// Funkce pro testování načítání externích zdrojů
function testExternalResources() {
    console.log('Testování načítání externích zdrojů...');
    
    const resources = [
        { type: 'script', url: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js', id: 'test-leaflet-script' },
        { type: 'script', url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', id: 'test-unpkg-script' },
        { type: 'script', url: 'https://code.jquery.com/jquery-3.6.0.min.js', id: 'test-jquery-script' },
        { type: 'script', url: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js', id: 'test-cdnjs-script' },
        { type: 'style', url: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css', id: 'test-leaflet-style' },
        { type: 'style', url: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', id: 'test-unpkg-style' },
        { type: 'style', url: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css', id: 'test-cdnjs-style' }
    ];
    
    const results = [];
    const promises = [];
    
    resources.forEach(resource => {
        const promise = new Promise(resolve => {
            // Odstranění existujícího elementu, pokud existuje
            const existingElement = document.getElementById(resource.id);
            if (existingElement) {
                existingElement.remove();
            }
            
            // Vytvoření nového elementu
            let element;
            if (resource.type === 'script') {
                element = document.createElement('script');
                element.src = resource.url;
                element.id = resource.id;
            } else if (resource.type === 'style') {
                element = document.createElement('link');
                element.rel = 'stylesheet';
                element.href = resource.url;
                element.id = resource.id;
            }
            
            // Nastavení událostí
            element.onload = () => {
                results.push({
                    resource: resource,
                    success: true,
                    error: null
                });
                resolve();
            };
            
            element.onerror = (error) => {
                results.push({
                    resource: resource,
                    success: false,
                    error: error
                });
                resolve();
            };
            
            // Přidání elementu do dokumentu
            document.head.appendChild(element);
        });
        
        promises.push(promise);
    });
    
    return Promise.all(promises).then(() => {
        console.log('Výsledky testování načítání externích zdrojů:', results);
        
        const successCount = results.filter(result => result.success).length;
        const failCount = results.filter(result => !result.success).length;
        
        console.log(`Úspěšně načteno ${successCount} z ${results.length} zdrojů`);
        
        if (failCount > 0) {
            console.warn(`Nepodařilo se načíst ${failCount} zdrojů:`);
            results.filter(result => !result.success).forEach(result => {
                console.warn(`- ${result.resource.type}: ${result.resource.url}`);
            });
        }
        
        return {
            totalResources: results.length,
            successCount: successCount,
            failCount: failCount,
            results: results
        };
    });
}

// Funkce pro testování eval v JavaScriptu
function testEval() {
    console.log('Testování použití eval v JavaScriptu...');
    
    try {
        const testCode = 'return 1 + 1;';
        const result = new Function(testCode)();
        
        console.log('Eval test úspěšný, výsledek:', result);
        
        return {
            success: true,
            result: result
        };
    } catch (error) {
        console.error('Eval test selhal:', error);
        
        return {
            success: false,
            error: error
        };
    }
}

// Funkce pro testování inline JavaScriptu
function testInlineScript() {
    console.log('Testování inline JavaScriptu...');
    
    try {
        // Vytvoření testovacího elementu
        const testElement = document.createElement('div');
        testElement.id = 'test-inline-script';
        document.body.appendChild(testElement);
        
        // Přidání inline skriptu
        const scriptElement = document.createElement('script');
        scriptElement.innerHTML = `
            document.getElementById('test-inline-script').innerHTML = 'Inline script test successful';
        `;
        document.body.appendChild(scriptElement);
        
        // Kontrola, zda byl skript proveden
        const result = document.getElementById('test-inline-script').innerHTML;
        const success = result === 'Inline script test successful';
        
        console.log('Inline script test:', success ? 'úspěšný' : 'neúspěšný', 'výsledek:', result);
        
        // Odstranění testovacích elementů
        testElement.remove();
        scriptElement.remove();
        
        return {
            success: success,
            result: result
        };
    } catch (error) {
        console.error('Inline script test selhal:', error);
        
        return {
            success: false,
            error: error
        };
    }
}

// Funkce pro testování fetch požadavků
function testFetchRequests() {
    console.log('Testování fetch požadavků...');
    
    const urls = [
        { url: 'https://njjhhamwixjbfibywreo.supabase.co/rest/v1/tasks?select=*', name: 'Supabase API' },
        { url: 'https://api.openrouteservice.org/v2/directions/driving-car?api_key=YOUR_API_KEY', name: 'OpenRouteService API' },
        { url: 'https://a.tile.openstreetmap.org/0/0/0.png', name: 'OpenStreetMap Tile' }
    ];
    
    const results = [];
    const promises = [];
    
    urls.forEach(urlInfo => {
        const promise = fetch(urlInfo.url, { method: 'HEAD' })
            .then(response => {
                results.push({
                    url: urlInfo,
                    success: response.ok,
                    status: response.status,
                    error: null
                });
            })
            .catch(error => {
                results.push({
                    url: urlInfo,
                    success: false,
                    status: null,
                    error: error
                });
            });
        
        promises.push(promise);
    });
    
    return Promise.all(promises).then(() => {
        console.log('Výsledky testování fetch požadavků:', results);
        
        const successCount = results.filter(result => result.success).length;
        const failCount = results.filter(result => !result.success).length;
        
        console.log(`Úspěšně provedeno ${successCount} z ${results.length} požadavků`);
        
        if (failCount > 0) {
            console.warn(`Nepodařilo se provést ${failCount} požadavků:`);
            results.filter(result => !result.success).forEach(result => {
                console.warn(`- ${result.url.name}: ${result.url.url} (${result.error})`);
            });
        }
        
        return {
            totalRequests: results.length,
            successCount: successCount,
            failCount: failCount,
            results: results
        };
    });
}

// Funkce pro spuštění všech testů
async function runAllTests() {
    console.log('Spouštění všech testů Content Security Policy...');
    
    // Test načítání externích zdrojů
    const externalResourcesResult = await testExternalResources();
    
    // Test eval v JavaScriptu
    const evalResult = testEval();
    
    // Test inline JavaScriptu
    const inlineScriptResult = testInlineScript();
    
    // Test fetch požadavků
    const fetchRequestsResult = await testFetchRequests();
    
    console.log('Všechny testy byly dokončeny');
    
    // Vrácení výsledků testů
    return {
        externalResourcesResult,
        evalResult,
        inlineScriptResult,
        fetchRequestsResult
    };
}

// Export funkcí pro použití v konzoli prohlížeče
window.CSPTest = {
    testExternalResources,
    testEval,
    testInlineScript,
    testFetchRequests,
    runAllTests
};

console.log('Testovací skript pro Content Security Policy byl načten. Použijte CSPTest.runAllTests() pro spuštění všech testů.');
