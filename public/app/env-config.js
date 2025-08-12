/**
 * Konfigurace prostředí pro AIMapa
 * Načítá proměnné prostředí z .env souboru a zpřístupňuje je v prohlížeči
 * Verze 0.3.8.5
 */

// Globální objekt pro proměnné prostředí
window.ENV = window.ENV || {};

// Funkce pro načtení konfigurace ze serveru
async function loadEnvConfig() {
    try {
        console.log('Načítám konfiguraci prostředí...');

        // Pokus o načtení konfigurace z endpointu /env-config
        const response = await fetch('/env-config.json');

        if (!response.ok) {
            throw new Error(`Nepodařilo se načíst konfiguraci prostředí: ${response.status} ${response.statusText}`);
        }

        const config = await response.json();
        console.log('Konfigurace prostředí úspěšně načtena');

        // Uložení konfigurace do globálního objektu
        window.ENV = { ...window.ENV, ...config };

        // Vyvolání události o načtení konfigurace
        document.dispatchEvent(new CustomEvent('envConfigLoaded', { detail: config }));

        return config;
    } catch (error) {
        console.error('Chyba při načítání konfigurace prostředí:', error);

        // Nastavení výchozích hodnot pro Auth0
        window.ENV = {
            ...window.ENV,
            AUTH0_DOMAIN: 'dev-zxj8pir0moo4pdk7.us.auth0.com',
            AUTH0_CLIENT_ID: 'H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ',
            AUTH0_AUDIENCE: 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/',
            AUTH0_SCOPE: 'openid profile email read:users read:user_idp_tokens'
        };

        // Vyvolání události o chybě při načítání konfigurace
        document.dispatchEvent(new CustomEvent('envConfigError', { detail: error }));

        return window.ENV;
    }
}

// Načtení konfigurace při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    loadEnvConfig().then(config => {
        console.log('Konfigurace prostředí je připravena:', Object.keys(config).join(', '));
    });
});

// Export funkce pro načtení konfigurace
window.loadEnvConfig = loadEnvConfig;
