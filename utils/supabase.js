const { createClient } = require('@supabase/supabase-js');

// Inicializace Supabase klienta
const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Kontrola, zda jsou k dispozici potřebné proměnné prostředí
if (!supabaseUrl || !supabaseKey) {
  console.error('Chybí proměnné prostředí pro Supabase:');
  console.error('supabaseUrl:', supabaseUrl);
  console.error('supabaseKey:', supabaseKey ? 'Nastaveno' : 'Chybí');
  throw new Error('Supabase environment variables are missing');
}

// Vytvoření Supabase klienta
const supabase = createClient(supabaseUrl, supabaseKey);

// Kontrola, zda byl klient správně inicializován
if (!supabase) {
  throw new Error('Failed to initialize Supabase client');
}

module.exports = supabase;
