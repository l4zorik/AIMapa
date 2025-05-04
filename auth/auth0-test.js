/**
 * Auth0 Test Tool
 * Verze 0.3.8.7
 * 
 * Nástroj pro testování Auth0 endpointů
 * 
 * Použití:
 * node auth/auth0-test.js
 * node auth/auth0-test.js exchange-code KOD
 */

const axios = require('axios');
require('dotenv').config();

// Konfigurace
const config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  callbackUrl: process.env.AUTH0_CALLBACK_URL,
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};

/**
 * Generuje autorizační URL pro přihlášení
 * @returns {string} Autorizační URL
 */
function getAuthorizationUrl() {
  const authUrl = `https://${config.domain}/authorize?` +
    `client_id=${config.clientId}&` +
    `redirect_uri=${encodeURIComponent(config.callbackUrl)}&` +
    `response_type=code&` +
    `scope=openid%20profile%20email&` +
    `audience=${encodeURIComponent(config.audience)}`;
  
  console.log('Autorizační URL:');
  console.log(authUrl);
  return authUrl;
}

/**
 * Vymění autorizační kód za tokeny
 * @param {string} code - Autorizační kód
 * @returns {Promise<Object>} Odpověď s tokeny
 */
async function exchangeCodeForToken(code) {
  try {
    console.log(`Vyměňuji kód za token...`);
    
    const response = await axios.post(`https://${config.domain}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.callbackUrl
    });
    
    console.log('Token response:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Chyba při výměně kódu za token:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

/**
 * Získá informace o uživateli
 * @param {string} accessToken - Access token
 * @returns {Promise<Object>} Informace o uživateli
 */
async function getUserInfo(accessToken) {
  try {
    console.log(`Získávám informace o uživateli...`);
    
    const response = await axios.get(`https://${config.domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    console.log('Informace o uživateli:');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Chyba při získávání informací o uživateli:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

/**
 * Generuje logout URL
 * @param {string} returnTo - URL pro přesměrování po odhlášení
 * @returns {string} Logout URL
 */
function getLogoutUrl(returnTo = config.baseUrl) {
  const logoutUrl = `https://${config.domain}/v2/logout?` +
    `client_id=${config.clientId}&` +
    `returnTo=${encodeURIComponent(returnTo)}`;
  
  console.log('Logout URL:');
  console.log(logoutUrl);
  return logoutUrl;
}

/**
 * Testuje lokální Auth0 endpointy
 * @returns {Promise<void>}
 */
async function testLocalEndpoints() {
  try {
    console.log(`Testuji lokální Auth0 endpointy...`);
    
    // Test /auth/status endpointu
    console.log(`\nTest /auth/status endpointu:`);
    const statusResponse = await axios.get(`${config.baseUrl}/auth/status`);
    console.log(JSON.stringify(statusResponse.data, null, 2));
    
    // Test /api/test endpointu
    console.log(`\nTest /api/test endpointu:`);
    const testResponse = await axios.get(`${config.baseUrl}/api/test`);
    console.log(JSON.stringify(testResponse.data, null, 2));
    
    // Test /health endpointu
    console.log(`\nTest /health endpointu:`);
    const healthResponse = await axios.get(`${config.baseUrl}/health`);
    console.log(JSON.stringify(healthResponse.data, null, 2));
    
  } catch (error) {
    console.error('Chyba při testování lokálních endpointů:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

/**
 * Spustí všechny testy
 * @returns {Promise<void>}
 */
async function runTests() {
  console.log('=== AUTH0 ENDPOINT TESTER ===');
  console.log('Konfigurace:');
  console.log(JSON.stringify({
    domain: config.domain,
    clientId: config.clientId,
    clientSecret: '******',
    audience: config.audience,
    callbackUrl: config.callbackUrl,
    baseUrl: config.baseUrl
  }, null, 2));
  
  // Kontrola konfigurace
  if (!config.domain || !config.clientId || !config.clientSecret) {
    console.error('\nChybí některé povinné konfigurační parametry!');
    console.error('Ujistěte se, že máte správně nastavené proměnné prostředí:');
    console.error('- AUTH0_DOMAIN');
    console.error('- AUTH0_CLIENT_ID');
    console.error('- AUTH0_CLIENT_SECRET');
    console.error('- AUTH0_CALLBACK_URL');
    console.error('- AUTH0_AUDIENCE');
    return;
  }
  
  console.log('\n1. Generování autorizační URL:');
  getAuthorizationUrl();
  
  console.log('\n2. Generování logout URL:');
  getLogoutUrl();
  
  console.log('\n3. Test lokálních endpointů:');
  await testLocalEndpoints();
  
  console.log('\nPro kompletní test přihlášení:');
  console.log('1. Otevřete autorizační URL v prohlížeči');
  console.log('2. Přihlaste se');
  console.log('3. Zkopírujte kód z URL po přesměrování');
  console.log('4. Spusťte: node auth/auth0-test.js exchange-code KOD');
}

// Zpracování argumentů příkazové řádky
const args = process.argv.slice(2);
if (args[0] === 'exchange-code' && args[1]) {
  exchangeCodeForToken(args[1])
    .then(tokenResponse => {
      if (tokenResponse && tokenResponse.access_token) {
        return getUserInfo(tokenResponse.access_token);
      }
    });
} else {
  runTests();
}

module.exports = {
  getAuthorizationUrl,
  exchangeCodeForToken,
  getUserInfo,
  getLogoutUrl,
  testLocalEndpoints,
  runTests
};
