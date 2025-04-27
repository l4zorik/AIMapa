/**
 * Netlify integrace pro AIMapa
 * Verze 0.3.8.4
 */

// Modul pro integraci s Netlify
const NetlifyIntegration = {
    // Stav modulu
    state: {
        isInitialized: false,
        isNetlifyEnvironment: false,
        environmentVariables: {}
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu Netlify integrace...');

        // Detekce Netlify prostředí
        this.detectNetlifyEnvironment();

        // Načtení proměnných prostředí
        this.loadEnvironmentVariables();

        this.state.isInitialized = true;
        console.log('Modul Netlify integrace byl inicializován');
    },

    // Detekce Netlify prostředí
    detectNetlifyEnvironment() {
        // Kontrola, zda je aplikace spuštěna na Netlify
        if (typeof window !== 'undefined') {
            // Kontrola, zda je v URL parametr netlify=true nebo zda je doména *.netlify.app
            const isNetlifyParam = new URLSearchParams(window.location.search).get('netlify') === 'true';
            const isNetlifyDomain = window.location.hostname.endsWith('.netlify.app');

            this.state.isNetlifyEnvironment = isNetlifyParam || isNetlifyDomain;

            console.log('Detekce Netlify prostředí:', this.state.isNetlifyEnvironment ? 'Ano' : 'Ne');
        } else {
            this.state.isNetlifyEnvironment = false;
            console.log('Detekce Netlify prostředí: Ne (window není definováno)');
        }
    },

    // Načtení proměnných prostředí
    loadEnvironmentVariables() {
        // Kontrola, zda je aplikace spuštěna na Netlify
        if (!this.state.isNetlifyEnvironment) {
            console.log('Aplikace není spuštěna na Netlify, proměnné prostředí nebudou načteny');
            return;
        }

        // Načtení proměnných prostředí z window.ENV (pokud existuje)
        if (typeof window !== 'undefined' && window.ENV) {
            this.state.environmentVariables = window.ENV;
            console.log('Proměnné prostředí byly načteny z window.ENV');
        } else if (typeof process !== 'undefined' && process.env) {
            // Načtení proměnných prostředí z process.env (pro Node.js)
            this.state.environmentVariables = {
                SUPABASE_URL: process.env.SUPABASE_DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL,
                SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
                SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET
            };
            console.log('Proměnné prostředí byly načteny z process.env');
        } else {
            console.log('Proměnné prostředí nebyly nalezeny');
        }
    },

    // Získání proměnné prostředí
    getEnvironmentVariable(name) {
        return this.state.environmentVariables[name] || null;
    },

    // Kontrola, zda je aplikace spuštěna na Netlify
    isNetlify() {
        return this.state.isNetlifyEnvironment;
    },

    // Získání URL pro Netlify funkce
    getNetlifyFunctionUrl(functionName) {
        if (!this.state.isNetlifyEnvironment) {
            console.log('Aplikace není spuštěna na Netlify, URL pro funkci nebude vygenerováno');
            return null;
        }

        // Vytvoření URL pro Netlify funkci
        const baseUrl = window.location.origin;
        return `${baseUrl}/.netlify/functions/${functionName}`;
    },

    // Volání Netlify funkce
    async callNetlifyFunction(functionName, data = {}) {
        try {
            const functionUrl = this.getNetlifyFunctionUrl(functionName);

            if (!functionUrl) {
                throw new Error('URL pro Netlify funkci nebylo vygenerováno');
            }

            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Chyba při volání Netlify funkce: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            console.log(`Netlify funkce ${functionName} byla úspěšně volána:`, result);

            return { success: true, data: result };
        } catch (error) {
            console.error(`Chyba při volání Netlify funkce ${functionName}:`, error);
            return { success: false, error: error.message };
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    NetlifyIntegration.init();
});
