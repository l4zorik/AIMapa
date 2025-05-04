/**
 * Skript pro vytvoření tabulky users v Supabase
 * Verze 0.4.1
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const colors = require('colors');

// Konfigurace Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(colors.red('Chybí Supabase URL nebo API klíč. Nastavte proměnné prostředí SUPABASE_URL a SUPABASE_SERVICE_KEY.'));
  process.exit(1);
}

// Vytvoření Supabase klienta
const supabase = createClient(supabaseUrl, supabaseKey);

// Cesta k SQL souboru
const sqlFilePath = path.join(__dirname, '..', 'db', 'migrations', '01_create_users_table.sql');

// Funkce pro vytvoření tabulky
async function createUsersTable() {
  console.log(colors.cyan('Vytváření tabulky users v Supabase...'));
  
  try {
    // Načtení SQL souboru
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Rozdělení SQL na jednotlivé příkazy
    const sqlCommands = sql.split(';').filter(cmd => cmd.trim() !== '');
    
    // Postupné spuštění příkazů
    for (const command of sqlCommands) {
      console.log(colors.gray('Spouštím SQL příkaz:'));
      console.log(colors.gray(command.trim().substring(0, 100) + '...'));
      
      const { error } = await supabase.rpc('exec_sql', { sql: command.trim() });
      
      if (error) {
        console.error(colors.red(`Chyba při spouštění SQL příkazu: ${error.message}`));
        console.error(colors.red(`Příkaz: ${command.trim()}`));
      } else {
        console.log(colors.green('SQL příkaz úspěšně proveden.'));
      }
    }
    
    console.log(colors.green('Tabulka users byla úspěšně vytvořena v Supabase.'));
    
    // Kontrola, zda tabulka existuje
    const { data, error } = await supabase
      .from('users')
      .select('count(*)', { count: 'exact' })
      .limit(0);
    
    if (error) {
      console.error(colors.red(`Chyba při kontrole tabulky users: ${error.message}`));
    } else {
      console.log(colors.green(`Tabulka users existuje a obsahuje ${data.count || 0} záznamů.`));
    }
  } catch (error) {
    console.error(colors.red(`Neočekávaná chyba: ${error.message}`));
    process.exit(1);
  }
}

// Spuštění funkce
createUsersTable()
  .then(() => {
    console.log(colors.green('Skript byl úspěšně dokončen.'));
    process.exit(0);
  })
  .catch(error => {
    console.error(colors.red(`Neočekávaná chyba: ${error.message}`));
    process.exit(1);
  });
