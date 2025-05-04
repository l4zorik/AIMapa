/**
 * Test synchronizace Auth0 a Supabase
 * Verze 0.4.1
 */

require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Konfigurace
const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE || `https://${process.env.AUTH0_DOMAIN}/api/v2/`
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
  }
};

// Vytvoření Supabase klienta
const supabase = createClient(config.supabase.url, config.supabase.key);

/**
 * Získá Auth0 Management API token
 * @returns {Promise<string>} Auth0 token
 */
async function getAuth0Token() {
  try {
    console.log('Získávání Auth0 Management API tokenu...');
    
    const response = await axios.post(`https://${config.auth0.domain}/oauth/token`, {
      client_id: config.auth0.clientId,
      client_secret: config.auth0.clientSecret,
      audience: config.auth0.audience,
      grant_type: 'client_credentials'
    });
    
    console.log('Auth0 token úspěšně získán.');
    return response.data.access_token;
  } catch (error) {
    console.error(`Chyba při získávání Auth0 tokenu: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * Získá uživatele z Auth0
 * @param {string} token - Auth0 Management API token
 * @returns {Promise<Array>} Seznam uživatelů
 */
async function getAuth0Users(token) {
  try {
    console.log('Získávání uživatelů z Auth0...');
    
    const response = await axios.get(`https://${config.auth0.domain}/api/v2/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        per_page: 10,
        include_totals: true
      }
    });
    
    const users = response.data.users;
    const total = response.data.total;
    
    console.log(`Získáno ${users.length} z ${total} uživatelů z Auth0.`);
    return users;
  } catch (error) {
    console.error(`Chyba při získávání uživatelů z Auth0: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

/**
 * Získá uživatele z Supabase
 * @returns {Promise<Array>} Seznam uživatelů
 */
async function getSupabaseUsers() {
  try {
    console.log('Získávání uživatelů z Supabase...');
    
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' });
    
    if (error) {
      throw error;
    }
    
    console.log(`Získáno ${data.length} uživatelů z Supabase.`);
    return data;
  } catch (error) {
    console.error(`Chyba při získávání uživatelů z Supabase: ${error.message}`);
    throw error;
  }
}

/**
 * Kontrola synchronizace uživatelů
 * @param {Array} auth0Users - Seznam uživatelů z Auth0
 * @param {Array} supabaseUsers - Seznam uživatelů z Supabase
 * @returns {Object} Výsledek kontroly
 */
function checkUserSync(auth0Users, supabaseUsers) {
  const results = {
    total: auth0Users.length,
    synced: 0,
    missing: [],
    mismatched: []
  };
  
  for (const auth0User of auth0Users) {
    const supabaseUser = supabaseUsers.find(user => user.auth0_id === auth0User.user_id);
    
    if (!supabaseUser) {
      results.missing.push(auth0User.user_id);
      continue;
    }
    
    // Kontrola základních údajů
    const mismatches = [];
    
    if (supabaseUser.email !== auth0User.email) {
      mismatches.push('email');
    }
    
    if (supabaseUser.name !== (auth0User.name || auth0User.nickname || auth0User.email)) {
      mismatches.push('name');
    }
    
    if (supabaseUser.email_verified !== auth0User.email_verified) {
      mismatches.push('email_verified');
    }
    
    if (mismatches.length > 0) {
      results.mismatched.push({
        auth0_id: auth0User.user_id,
        mismatches
      });
    } else {
      results.synced++;
    }
  }
  
  return results;
}

/**
 * Spustí test synchronizace
 * @returns {Promise<Object>} Výsledek testu
 */
async function runSyncTest() {
  try {
    console.log('=== TEST SYNCHRONIZACE AUTH0 A SUPABASE ===');
    console.log(`Auth0 Domain: ${config.auth0.domain}`);
    console.log(`Supabase URL: ${config.supabase.url}`);
    
    // Kontrola konfigurace
    if (!config.auth0.domain || !config.auth0.clientId || !config.auth0.clientSecret) {
      throw new Error('Chybí Auth0 konfigurace. Nastavte proměnné prostředí AUTH0_DOMAIN, AUTH0_CLIENT_ID a AUTH0_CLIENT_SECRET.');
    }
    
    if (!config.supabase.url || !config.supabase.key) {
      throw new Error('Chybí Supabase konfigurace. Nastavte proměnné prostředí SUPABASE_URL a SUPABASE_SERVICE_KEY.');
    }
    
    // Získání Auth0 tokenu
    const token = await getAuth0Token();
    
    // Získání uživatelů z Auth0
    const auth0Users = await getAuth0Users(token);
    
    // Získání uživatelů z Supabase
    const supabaseUsers = await getSupabaseUsers();
    
    // Kontrola synchronizace
    const results = checkUserSync(auth0Users, supabaseUsers);
    
    console.log('=== VÝSLEDKY TESTU ===');
    console.log(`Celkem uživatelů v Auth0: ${results.total}`);
    console.log(`Synchronizováno: ${results.synced}`);
    console.log(`Chybějící uživatelé: ${results.missing.length}`);
    console.log(`Nesynchronizovaní uživatelé: ${results.mismatched.length}`);
    
    if (results.missing.length > 0) {
      console.log('Chybějící uživatelé:');
      results.missing.forEach(id => console.log(`- ${id}`));
    }
    
    if (results.mismatched.length > 0) {
      console.log('Nesynchronizovaní uživatelé:');
      results.mismatched.forEach(item => {
        console.log(`- ${item.auth0_id}: ${item.mismatches.join(', ')}`);
      });
    }
    
    return {
      success: results.synced === results.total,
      results
    };
  } catch (error) {
    console.error(`Neočekávaná chyba: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export funkcí pro použití v jiných testech
module.exports = {
  runSyncTest,
  getAuth0Token,
  getAuth0Users,
  getSupabaseUsers,
  checkUserSync
};

// Spuštění testu, pokud je soubor spuštěn přímo
if (require.main === module) {
  runSyncTest()
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error(`Neočekávaná chyba: ${error.message}`);
      process.exit(1);
    });
}
