/**
 * Supabase Test
 * Verze 0.3.8.7
 * 
 * Testovací nástroj pro integraci Auth0 a Supabase
 */

const axios = require('axios');
const chalk = require('chalk');
const figlet = require('figlet');
const open = require('open');
const { createClient } = require('@supabase/supabase-js');

// Konfigurace
const config = {
  supabaseUrl: process.env.SUPABASE_URL || 'https://njjhhamwixjbfibywreo.supabase.co',
  supabaseKey: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhoYW13aXhqYmZpYnl3cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzU5MTAsImV4cCI6MjA2MTM1MTkxMH0.8iei6QFMk18dLYoQIkJ63rEbDV_38TtSITmmRGRjoAY',
  auth0Domain: process.env.AUTH0_DOMAIN || 'dev-zxj8pir0moo4pdk7.us.auth0.com',
  auth0ClientId: process.env.AUTH0_CLIENT_ID || 'H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ',
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET || 'e4uncVy8-5pqixbck29RKi1V61BT-B6G5L65dCkLR_pW_TIA8WRhVcfULycOibSW',
  serverUrl: process.env.SERVER_URL || 'http://localhost:3000'
};

// Inicializace Supabase klienta
const supabase = createClient(config.supabaseUrl, config.supabaseKey);

// Zobrazení hlavičky
console.log(chalk.blue(figlet.textSync('Supabase Test', { horizontalLayout: 'full' })));
console.log(chalk.yellow('Testovací nástroj pro integraci Auth0 a Supabase'));
console.log(chalk.yellow('Verze 0.3.8.7'));
console.log('');

// Funkce pro testování připojení k Supabase
async function testSupabaseConnection() {
  try {
    console.log(chalk.cyan('Testování připojení k Supabase...'));
    
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log(chalk.red('❌ Chyba při připojení k Supabase:'));
      console.log(chalk.red(error.message));
      return false;
    }
    
    console.log(chalk.green('✅ Připojení k Supabase je funkční'));
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Chyba při připojení k Supabase:'));
    console.log(chalk.red(error.message));
    return false;
  }
}

// Funkce pro testování Auth0 statusu
async function testAuth0Status() {
  try {
    console.log(chalk.cyan('Testování Auth0 statusu...'));
    
    const response = await axios.get(`${config.serverUrl}/auth/status`);
    
    console.log(chalk.green('✅ Auth0 status:'));
    console.log(JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.log(chalk.red('❌ Chyba při získávání Auth0 statusu:'));
    console.log(chalk.red(error.message));
    return null;
  }
}

// Funkce pro testování synchronizace dat mezi Auth0 a Supabase
async function testDataSync(userId) {
  try {
    console.log(chalk.cyan(`Testování synchronizace dat pro uživatele ${userId}...`));
    
    // Získání dat uživatele z Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.log(chalk.red('❌ Chyba při získávání dat uživatele z Supabase:'));
      console.log(chalk.red(error.message));
      return false;
    }
    
    if (!data) {
      console.log(chalk.yellow('⚠️ Uživatel nebyl nalezen v Supabase'));
      return false;
    }
    
    console.log(chalk.green('✅ Data uživatele v Supabase:'));
    console.log(JSON.stringify(data, null, 2));
    
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Chyba při testování synchronizace dat:'));
    console.log(chalk.red(error.message));
    return false;
  }
}

// Funkce pro testování vytvoření uživatele v Supabase
async function testCreateUser(userId, userData) {
  try {
    console.log(chalk.cyan(`Testování vytvoření uživatele ${userId} v Supabase...`));
    
    // Kontrola, zda uživatel již existuje
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!existingError && existingUser) {
      console.log(chalk.yellow('⚠️ Uživatel již existuje v Supabase'));
      return existingUser;
    }
    
    // Vytvoření uživatele v Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          username: userData.username || 'test-user',
          email: userData.email || 'test@example.com',
          avatar_url: userData.picture || 'https://via.placeholder.com/150',
          level: 1,
          xp: 0,
          xp_to_next_level: 100,
          balance: 500,
          currency: 'CZK',
          bitcoin: 0.05
        }
      ])
      .select();
    
    if (error) {
      console.log(chalk.red('❌ Chyba při vytváření uživatele v Supabase:'));
      console.log(chalk.red(error.message));
      return null;
    }
    
    console.log(chalk.green('✅ Uživatel byl vytvořen v Supabase:'));
    console.log(JSON.stringify(data[0], null, 2));
    
    return data[0];
  } catch (error) {
    console.log(chalk.red('❌ Chyba při vytváření uživatele:'));
    console.log(chalk.red(error.message));
    return null;
  }
}

// Funkce pro testování aktualizace uživatele v Supabase
async function testUpdateUser(userId, userData) {
  try {
    console.log(chalk.cyan(`Testování aktualizace uživatele ${userId} v Supabase...`));
    
    // Aktualizace uživatele v Supabase
    const { data, error } = await supabase
      .from('users')
      .update({
        username: userData.username || 'updated-user',
        email: userData.email || 'updated@example.com',
        avatar_url: userData.picture || 'https://via.placeholder.com/150',
        level: userData.level || 2,
        xp: userData.xp || 50,
        xp_to_next_level: userData.xp_to_next_level || 150,
        balance: userData.balance || 600,
        currency: userData.currency || 'CZK',
        bitcoin: userData.bitcoin || 0.1
      })
      .eq('id', userId)
      .select();
    
    if (error) {
      console.log(chalk.red('❌ Chyba při aktualizaci uživatele v Supabase:'));
      console.log(chalk.red(error.message));
      return null;
    }
    
    console.log(chalk.green('✅ Uživatel byl aktualizován v Supabase:'));
    console.log(JSON.stringify(data[0], null, 2));
    
    return data[0];
  } catch (error) {
    console.log(chalk.red('❌ Chyba při aktualizaci uživatele:'));
    console.log(chalk.red(error.message));
    return null;
  }
}

// Funkce pro testování smazání uživatele v Supabase
async function testDeleteUser(userId) {
  try {
    console.log(chalk.cyan(`Testování smazání uživatele ${userId} v Supabase...`));
    
    // Smazání uživatele v Supabase
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.log(chalk.red('❌ Chyba při mazání uživatele v Supabase:'));
      console.log(chalk.red(error.message));
      return false;
    }
    
    console.log(chalk.green('✅ Uživatel byl smazán v Supabase'));
    
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Chyba při mazání uživatele:'));
    console.log(chalk.red(error.message));
    return false;
  }
}

// Hlavní funkce
async function main() {
  // Testování připojení k Supabase
  const isConnected = await testSupabaseConnection();
  
  if (!isConnected) {
    console.log(chalk.red('❌ Nelze pokračovat v testování bez připojení k Supabase'));
    return;
  }
  
  // Testování Auth0 statusu
  const auth0Status = await testAuth0Status();
  
  if (!auth0Status) {
    console.log(chalk.red('❌ Nelze pokračovat v testování bez Auth0 statusu'));
    return;
  }
  
  // Testování vytvoření testovacího uživatele
  const testUserId = 'auth0|test-user-123';
  const testUserData = {
    username: 'test-user',
    email: 'test@example.com',
    picture: 'https://via.placeholder.com/150'
  };
  
  const createdUser = await testCreateUser(testUserId, testUserData);
  
  if (!createdUser) {
    console.log(chalk.red('❌ Nelze pokračovat v testování bez vytvoření uživatele'));
    return;
  }
  
  // Testování aktualizace uživatele
  const updatedUserData = {
    username: 'updated-user',
    email: 'updated@example.com',
    picture: 'https://via.placeholder.com/150',
    level: 2,
    xp: 50,
    xp_to_next_level: 150,
    balance: 600,
    currency: 'CZK',
    bitcoin: 0.1
  };
  
  const updatedUser = await testUpdateUser(testUserId, updatedUserData);
  
  if (!updatedUser) {
    console.log(chalk.red('❌ Nelze pokračovat v testování bez aktualizace uživatele'));
    return;
  }
  
  // Testování synchronizace dat
  const isSynced = await testDataSync(testUserId);
  
  if (!isSynced) {
    console.log(chalk.red('❌ Nelze pokračovat v testování bez synchronizace dat'));
    return;
  }
  
  // Testování smazání uživatele
  const isDeleted = await testDeleteUser(testUserId);
  
  if (!isDeleted) {
    console.log(chalk.red('❌ Nelze dokončit testování bez smazání uživatele'));
    return;
  }
  
  console.log('');
  console.log(chalk.green('✅ Všechny testy byly úspěšně dokončeny'));
}

// Spuštění hlavní funkce
main().catch(error => {
  console.log(chalk.red('❌ Chyba při spuštění testů:'));
  console.log(chalk.red(error.message));
});
