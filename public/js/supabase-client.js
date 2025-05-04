/**
 * Supabase klient pro klientskou část aplikace
 * Verze 0.3.8.7
 */

// Supabase konfigurace
let supabaseConfig = {
  url: 'https://njjhhamwixjbfibywreo.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhoYW13aXhqYmZpYnl3cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzU5MTAsImV4cCI6MjA2MTM1MTkxMH0.8iei6QFMk18dLYoQIkJ63rEbDV_38TtSITmmRGRjoAY'
};

// Supabase klient
let supabaseClient = null;

// Inicializace Supabase klienta
async function initSupabaseClient() {
  try {
    // Kontrola, zda je dostupný Supabase
    if (typeof supabase === 'undefined') {
      throw new Error('Supabase není dostupný. Ujistěte se, že je načten skript @supabase/supabase-js.');
    }
    
    // Vytvoření Supabase klienta
    supabaseClient = supabase.createClient(supabaseConfig.url, supabaseConfig.key);
    
    console.log('Supabase klient byl inicializován');
    
    return supabaseClient;
  } catch (error) {
    console.error('Chyba při inicializaci Supabase klienta:', error);
    throw error;
  }
}

// Získání Supabase klienta
function getSupabaseClient() {
  if (!supabaseClient) {
    throw new Error('Supabase klient nebyl inicializován. Zavolejte nejprve initSupabaseClient().');
  }
  
  return supabaseClient;
}

// Synchronizace dat s Supabase
async function syncData(userId, data, table) {
  try {
    if (!supabaseClient) {
      await initSupabaseClient();
    }
    
    const { data: result, error } = await supabaseClient
      .from(table)
      .upsert({
        id: userId,
        ...data,
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    return result[0];
  } catch (error) {
    console.error(`Chyba při synchronizaci dat s tabulkou ${table}:`, error);
    throw error;
  }
}

// Získání dat z Supabase
async function getData(userId, table) {
  try {
    if (!supabaseClient) {
      await initSupabaseClient();
    }
    
    const { data, error } = await supabaseClient
      .from(table)
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error(`Chyba při získávání dat z tabulky ${table}:`, error);
    throw error;
  }
}

// Export funkcí
const SupabaseClient = {
  initSupabaseClient,
  getSupabaseClient,
  syncData,
  getData
};
