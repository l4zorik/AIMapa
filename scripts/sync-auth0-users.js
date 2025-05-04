/**
 * Skript pro synchronizaci uživatelů z Auth0 do Supabase
 * Verze 0.4.1
 */

require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const colors = require('colors');

// Konfigurace Auth0
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.AUTH0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
const auth0Audience = process.env.AUTH0_AUDIENCE || `https://${auth0Domain}/api/v2/`;

// Konfigurace Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

// Kontrola konfigurace
if (!auth0Domain || !auth0ClientId || !auth0ClientSecret) {
  console.error(colors.red('Chybí Auth0 konfigurace. Nastavte proměnné prostředí AUTH0_DOMAIN, AUTH0_CLIENT_ID a AUTH0_CLIENT_SECRET.'));
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error(colors.red('Chybí Supabase konfigurace. Nastavte proměnné prostředí SUPABASE_URL a SUPABASE_SERVICE_KEY.'));
  process.exit(1);
}

// Vytvoření Supabase klienta
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Získá Auth0 Management API token
 * @returns {Promise<string>} Auth0 token
 */
async function getAuth0Token() {
  try {
    console.log(colors.cyan('Získávání Auth0 Management API tokenu...'));
    
    const response = await axios.post(`https://${auth0Domain}/oauth/token`, {
      client_id: auth0ClientId,
      client_secret: auth0ClientSecret,
      audience: auth0Audience,
      grant_type: 'client_credentials'
    });
    
    console.log(colors.green('Auth0 token úspěšně získán.'));
    return response.data.access_token;
  } catch (error) {
    console.error(colors.red(`Chyba při získávání Auth0 tokenu: ${error.message}`));
    if (error.response) {
      console.error(colors.red(`Status: ${error.response.status}`));
      console.error(colors.red(`Data: ${JSON.stringify(error.response.data)}`));
    }
    process.exit(1);
  }
}

/**
 * Získá uživatele z Auth0
 * @param {string} token - Auth0 Management API token
 * @returns {Promise<Array>} Seznam uživatelů
 */
async function getAuth0Users(token) {
  try {
    console.log(colors.cyan('Získávání uživatelů z Auth0...'));
    
    const response = await axios.get(`https://${auth0Domain}/api/v2/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        per_page: 100,
        include_totals: true
      }
    });
    
    const users = response.data.users;
    const total = response.data.total;
    
    console.log(colors.green(`Získáno ${users.length} z ${total} uživatelů z Auth0.`));
    
    // Pokud je více než 100 uživatelů, je potřeba stránkování
    if (total > 100) {
      console.log(colors.yellow(`Pozor: Celkový počet uživatelů (${total}) přesahuje limit stránky (100). Implementujte stránkování pro získání všech uživatelů.`));
    }
    
    return users;
  } catch (error) {
    console.error(colors.red(`Chyba při získávání uživatelů z Auth0: ${error.message}`));
    if (error.response) {
      console.error(colors.red(`Status: ${error.response.status}`));
      console.error(colors.red(`Data: ${JSON.stringify(error.response.data)}`));
    }
    process.exit(1);
  }
}

/**
 * Synchronizuje uživatele z Auth0 do Supabase
 * @param {Array} auth0Users - Seznam uživatelů z Auth0
 * @returns {Promise<void>}
 */
async function syncUsersToSupabase(auth0Users) {
  try {
    console.log(colors.cyan(`Synchronizace ${auth0Users.length} uživatelů do Supabase...`));
    
    let created = 0;
    let updated = 0;
    let errors = 0;
    
    for (const user of auth0Users) {
      try {
        // Kontrola, zda uživatel již existuje
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('auth0_id', user.user_id)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
          console.error(colors.red(`Chyba při hledání uživatele ${user.user_id}: ${fetchError.message}`));
          errors++;
          continue;
        }
        
        const userData = {
          auth0_id: user.user_id,
          email: user.email,
          name: user.name || user.nickname || user.email,
          picture: user.picture,
          email_verified: user.email_verified,
          last_login: user.last_login ? new Date(user.last_login).toISOString() : new Date().toISOString(),
          user_metadata: user.user_metadata || {},
          app_metadata: user.app_metadata || {}
        };
        
        if (existingUser) {
          // Aktualizace existujícího uživatele
          userData.updated_at = new Date().toISOString();
          
          const { error: updateError } = await supabase
            .from('users')
            .update(userData)
            .eq('auth0_id', user.user_id);
          
          if (updateError) {
            console.error(colors.red(`Chyba při aktualizaci uživatele ${user.user_id}: ${updateError.message}`));
            errors++;
          } else {
            console.log(colors.green(`Uživatel ${user.user_id} byl aktualizován.`));
            updated++;
          }
        } else {
          // Vytvoření nového uživatele
          userData.created_at = new Date().toISOString();
          userData.updated_at = new Date().toISOString();
          
          const { error: insertError } = await supabase
            .from('users')
            .insert([userData]);
          
          if (insertError) {
            console.error(colors.red(`Chyba při vytváření uživatele ${user.user_id}: ${insertError.message}`));
            errors++;
          } else {
            console.log(colors.green(`Uživatel ${user.user_id} byl vytvořen.`));
            created++;
          }
        }
      } catch (error) {
        console.error(colors.red(`Neočekávaná chyba při synchronizaci uživatele ${user.user_id}: ${error.message}`));
        errors++;
      }
    }
    
    console.log(colors.cyan('Synchronizace dokončena.'));
    console.log(colors.green(`Vytvořeno: ${created}`));
    console.log(colors.green(`Aktualizováno: ${updated}`));
    console.log(colors.red(`Chyby: ${errors}`));
  } catch (error) {
    console.error(colors.red(`Neočekávaná chyba při synchronizaci uživatelů: ${error.message}`));
    process.exit(1);
  }
}

/**
 * Hlavní funkce
 */
async function main() {
  try {
    console.log(colors.cyan('=== SYNCHRONIZACE UŽIVATELŮ Z AUTH0 DO SUPABASE ==='));
    console.log(colors.cyan(`Auth0 Domain: ${auth0Domain}`));
    console.log(colors.cyan(`Supabase URL: ${supabaseUrl}`));
    
    // Získání Auth0 tokenu
    const token = await getAuth0Token();
    
    // Získání uživatelů z Auth0
    const auth0Users = await getAuth0Users(token);
    
    // Synchronizace uživatelů do Supabase
    await syncUsersToSupabase(auth0Users);
    
    console.log(colors.green('Synchronizace úspěšně dokončena.'));
    process.exit(0);
  } catch (error) {
    console.error(colors.red(`Neočekávaná chyba: ${error.message}`));
    process.exit(1);
  }
}

// Spuštění hlavní funkce
main();
