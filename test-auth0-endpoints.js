/**
 * Nástroj pro testování Auth0 endpointů
 */

const axios = require('axios');
require('dotenv').config();

// Základní URL vaší aplikace
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// Funkce pro testování dostupnosti endpointů
async function testEndpoints() {
  console.log('=== TESTOVÁNÍ AUTH0 ENDPOINTŮ ===');
  
  // Seznam endpointů k otestování
  const endpoints = [
    { path: '/login', name: 'Přihlášení' },
    { path: '/logout', name: 'Odhlášení' },
    { path: '/callback', name: 'Callback' },
    { path: '/api', name: 'API' },
    { path: '/auth/config', name: 'Auth0 konfigurace' },
    { path: '/health', name: 'Zdravotní stav aplikace' }
  ];
  
  // Testování každého endpointu
  for (const endpoint of endpoints) {
    try {
      console.log(`Testování: ${endpoint.name} (${endpoint.path})...`);
      
      // Pokus o získání informací o endpointu (pouze HEAD request)
      const response = await axios.head(`${baseUrl}${endpoint.path}`, {
        validateStatus: () => true // Akceptuje jakýkoliv status kód
      });
      
      // Výpis výsledku
      console.log(`  Status: ${response.status} ${getStatusText(response.status)}`);
      console.log(`  Endpoint je ${response.status < 500 ? 'dostupný' : 'nedostupný'}`);
      
      if (response.status === 302) {
        console.log('  Endpoint provádí přesměrování (typické pro Auth0 endpointy)');
      }
      
    } catch (error) {
      console.error(`  Chyba při testování ${endpoint.path}: ${error.message}`);
    }
    
    console.log('---');
  }
  
  console.log('=== TESTOVÁNÍ DOKONČENO ===');
}

// Pomocná funkce pro získání textového popisu HTTP status kódu
function getStatusText(status) {
  const statusTexts = {
    200: 'OK',
    301: 'Moved Permanently',
    302: 'Found (Redirect)',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
  };
  
  return statusTexts[status] || '';
}

// Spuštění testů
testEndpoints().catch(error => {
  console.error('Chyba při testování endpointů:', error);
});
