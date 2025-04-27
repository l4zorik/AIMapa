# Integrace Supabase do AIMapa - Část 1: Základní nastavení

Tento dokument popisuje první část implementace integrace Supabase do aplikace AIMapa pro verzi 0.3.8.2, která umožní ukládání dat v cloudu, synchronizaci mezi zařízeními a další pokročilé funkce.

## Přehled Supabase

Supabase je open-source alternativa k Firebase, která poskytuje:
- PostgreSQL databázi
- Autentizaci uživatelů
- Realtime API
- Storage pro soubory
- Serverless funkce

Tyto funkce jsou ideální pro implementaci uživatelských účtů, synchronizace dat a dalších pokročilých funkcí v AIMapa.

## Instalace a základní nastavení

### 1. Instalace Supabase klienta

Pro integraci Supabase do aplikace AIMapa je potřeba nejprve nainstalovat Supabase klienta:

```bash
npm install @supabase/supabase-js
```

### 2. Konfigurace prostředí

Vytvoříme soubor `.env` pro uložení konfiguračních proměnných:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

Pro produkční nasazení je důležité používat veřejné proměnné prostředí:

```
SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Inicializace Supabase klienta

Vytvoříme nový soubor `supabase-client.js` v adresáři `public/app`:

```javascript
/**
 * Supabase klient pro AIMapa
 * Verze 0.3.8.2
 */

// Import Supabase klienta
import { createClient } from '@supabase/supabase-js';

// Konfigurace Supabase
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';

// Vytvoření Supabase klienta
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export Supabase klienta pro použití v jiných modulech
export default supabase;
```

Pro použití bez modulů (pro kompatibilitu se staršími prohlížeči):

```javascript
/**
 * Supabase klient pro AIMapa
 * Verze 0.3.8.2
 */

// Globální objekt Supabase
const SupabaseClient = {
    // Instance Supabase klienta
    client: null,
    
    // Konfigurace
    config: {
        supabaseUrl: 'https://your-project-id.supabase.co',
        supabaseAnonKey: 'your-anon-key'
    },
    
    // Inicializace Supabase klienta
    init() {
        if (this.client) return this.client;
        
        // Kontrola, zda je dostupný Supabase
        if (typeof supabase === 'undefined') {
            console.error('Supabase není dostupný. Ujistěte se, že je načten skript @supabase/supabase-js.');
            return null;
        }
        
        // Vytvoření Supabase klienta
        this.client = supabase.createClient(this.config.supabaseUrl, this.config.supabaseAnonKey);
        
        console.log('Supabase klient byl inicializován');
        
        return this.client;
    },
    
    // Získání instance Supabase klienta
    getClient() {
        return this.client || this.init();
    }
};
```

### 4. Přidání Supabase skriptu do HTML

Pro načtení Supabase klienta přidáme skript do souboru `index.html`:

```html
<!-- Supabase klient -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Inicializace Supabase klienta -->
<script>
    const supabase = supabase.createClient(
        'https://your-project-id.supabase.co',
        'your-anon-key'
    );
</script>

<!-- Ostatní skripty aplikace -->
<script src="app/supabase-client.js"></script>
```

## Vytvoření databázové struktury v Supabase

### 1. Tabulka uživatelů (users)

```sql
CREATE TABLE users (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    username TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    balance DECIMAL DEFAULT 500,
    currency TEXT DEFAULT 'CZK',
    bitcoin DECIMAL DEFAULT 0.05,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (id),
    UNIQUE (username),
    UNIQUE (email)
);

-- Vytvoření RLS (Row Level Security) politiky
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politika pro čtení vlastních dat
CREATE POLICY "Users can view their own data" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- Politika pro úpravu vlastních dat
CREATE POLICY "Users can update their own data" 
ON users FOR UPDATE 
USING (auth.uid() = id);
```

### 2. Tabulka uživatelských statistik (user_stats)

```sql
CREATE TABLE user_stats (
    id UUID REFERENCES users(id) ON DELETE CASCADE,
    routes_calculated INTEGER DEFAULT 0,
    places_visited INTEGER DEFAULT 0,
    stories_read INTEGER DEFAULT 0,
    restaurants_visited INTEGER DEFAULT 0,
    distance_traveled DECIMAL DEFAULT 0,
    days_active INTEGER DEFAULT 0,
    total_work_time INTEGER DEFAULT 0,
    total_earnings DECIMAL DEFAULT 0,
    total_tasks_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (id)
);

-- Vytvoření RLS politiky
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Politika pro čtení vlastních statistik
CREATE POLICY "Users can view their own stats" 
ON user_stats FOR SELECT 
USING (auth.uid() = id);

-- Politika pro úpravu vlastních statistik
CREATE POLICY "Users can update their own stats" 
ON user_stats FOR UPDATE 
USING (auth.uid() = id);
```

### 3. Tabulka uživatelských nastavení (user_settings)

```sql
CREATE TABLE user_settings (
    id UUID REFERENCES users(id) ON DELETE CASCADE,
    dark_mode BOOLEAN DEFAULT true,
    notifications_enabled BOOLEAN DEFAULT true,
    auto_sync_enabled BOOLEAN DEFAULT true,
    sync_interval INTEGER DEFAULT 60000,
    language TEXT DEFAULT 'cs',
    map_style TEXT DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (id)
);

-- Vytvoření RLS politiky
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Politika pro čtení vlastních nastavení
CREATE POLICY "Users can view their own settings" 
ON user_settings FOR SELECT 
USING (auth.uid() = id);

-- Politika pro úpravu vlastních nastavení
CREATE POLICY "Users can update their own settings" 
ON user_settings FOR UPDATE 
USING (auth.uid() = id);
```

## Základní operace s Supabase

### 1. Registrace uživatele

```javascript
/**
 * Registrace nového uživatele
 * @param {string} email - E-mail uživatele
 * @param {string} password - Heslo uživatele
 * @param {string} username - Uživatelské jméno
 * @returns {Promise} - Promise s výsledkem registrace
 */
async function registerUser(email, password, username) {
    try {
        // Registrace uživatele pomocí Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });
        
        if (authError) throw authError;
        
        // Vytvoření záznamu v tabulce users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    username,
                    email,
                    avatar_url: 'https://via.placeholder.com/150',
                    level: 1,
                    xp: 0,
                    xp_to_next_level: 100,
                    balance: 500,
                    currency: 'CZK',
                    bitcoin: 0.05
                }
            ]);
        
        if (userError) throw userError;
        
        // Vytvoření záznamu v tabulce user_stats
        const { error: statsError } = await supabase
            .from('user_stats')
            .insert([{ id: authData.user.id }]);
        
        if (statsError) throw statsError;
        
        // Vytvoření záznamu v tabulce user_settings
        const { error: settingsError } = await supabase
            .from('user_settings')
            .insert([{ id: authData.user.id }]);
        
        if (settingsError) throw settingsError;
        
        return { success: true, user: authData.user };
    } catch (error) {
        console.error('Chyba při registraci uživatele:', error);
        return { success: false, error };
    }
}
```

### 2. Přihlášení uživatele

```javascript
/**
 * Přihlášení uživatele
 * @param {string} email - E-mail uživatele
 * @param {string} password - Heslo uživatele
 * @returns {Promise} - Promise s výsledkem přihlášení
 */
async function loginUser(email, password) {
    try {
        // Přihlášení uživatele pomocí Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        return { success: true, user: data.user, session: data.session };
    } catch (error) {
        console.error('Chyba při přihlášení uživatele:', error);
        return { success: false, error };
    }
}
```

### 3. Odhlášení uživatele

```javascript
/**
 * Odhlášení uživatele
 * @returns {Promise} - Promise s výsledkem odhlášení
 */
async function logoutUser() {
    try {
        const { error } = await supabase.auth.signOut();
        
        if (error) throw error;
        
        return { success: true };
    } catch (error) {
        console.error('Chyba při odhlášení uživatele:', error);
        return { success: false, error };
    }
}
```

### 4. Získání dat uživatele

```javascript
/**
 * Získání dat přihlášeného uživatele
 * @returns {Promise} - Promise s daty uživatele
 */
async function getCurrentUser() {
    try {
        // Získání aktuálního uživatele
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) return { success: false, error: 'Uživatel není přihlášen' };
        
        // Získání dat uživatele z tabulky users
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (userError) throw userError;
        
        // Získání statistik uživatele
        const { data: statsData, error: statsError } = await supabase
            .from('user_stats')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (statsError) throw statsError;
        
        // Získání nastavení uživatele
        const { data: settingsData, error: settingsError } = await supabase
            .from('user_settings')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (settingsError) throw settingsError;
        
        return {
            success: true,
            user: {
                ...userData,
                stats: statsData,
                settings: settingsData
            }
        };
    } catch (error) {
        console.error('Chyba při získávání dat uživatele:', error);
        return { success: false, error };
    }
}
```

## Další kroky implementace

V dalších částech implementace se zaměříme na:

1. **Část 2**: Implementace synchronizace uživatelských dat mezi zařízeními
2. **Část 3**: Implementace ukládání bodů, tras a dalších mapových dat
3. **Část 4**: Implementace ukládání achievementů a historie aktivit
4. **Část 5**: Implementace realtime funkcí pro spolupráci více uživatelů

---

*Poslední aktualizace: 2025-07-08*
