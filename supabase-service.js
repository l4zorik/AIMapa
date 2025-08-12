/**
 * Supabase Service pro AIMapa
 * Verze 0.3.8.2
 *
 * Služba pro integraci Supabase s Auth0 autentizací
 */

const { createClient } = require('@supabase/supabase-js');
// Načtení proměnných prostředí již proběhlo v server.js

// Načtení proměnných prostředí
const supabaseUrl = process.env.SUPABASE_URL || 'https://njjhhamwixjbfibywreo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Kontrola, zda jsou nastaveny potřebné proměnné prostředí
if (!supabaseKey) {
    console.error('VAROVÁNÍ: SUPABASE_KEY není nastaveno v .env souboru!');
}

if (!supabaseServiceKey) {
    console.error('VAROVÁNÍ: SUPABASE_SERVICE_KEY není nastaveno v .env souboru!');
}

// Vytvoření Supabase klienta
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Funkce pro synchronizaci uživatele z Auth0 do Supabase
async function syncUserToSupabase(auth0User) {
    try {
        if (!auth0User || !auth0User.sub) {
            console.error('Nelze synchronizovat uživatele do Supabase: Chybí Auth0 uživatelský objekt nebo sub ID');
            return null;
        }

        console.log('Synchronizace uživatele do Supabase:', auth0User.sub);

        // Kontrola, zda uživatel již existuje v Supabase
        const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('auth0_id', auth0User.sub)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
            console.error('Chyba při hledání uživatele v Supabase:', fetchError);
            return null;
        }

        // Příprava dat uživatele
        const userData = {
            auth0_id: auth0User.sub,
            email: auth0User.email,
            name: auth0User.name || auth0User.nickname || auth0User.email?.split('@')[0] || 'Uživatel',
            avatar_url: auth0User.picture,
            updated_at: new Date().toISOString()
        };

        let result;

        // Aktualizace nebo vytvoření uživatele
        if (existingUser) {
            console.log('Aktualizace existujícího uživatele v Supabase:', existingUser.id);

            const { data, error } = await supabaseAdmin
                .from('users')
                .update(userData)
                .eq('auth0_id', auth0User.sub)
                .select()
                .single();

            if (error) {
                console.error('Chyba při aktualizaci uživatele v Supabase:', error);
                return null;
            }

            result = data;
        } else {
            console.log('Vytváření nového uživatele v Supabase');

            // Přidání data vytvoření pro nového uživatele
            userData.created_at = new Date().toISOString();

            const { data, error } = await supabaseAdmin
                .from('users')
                .insert([userData])
                .select()
                .single();

            if (error) {
                console.error('Chyba při vytváření uživatele v Supabase:', error);
                return null;
            }

            result = data;
        }

        console.log('Uživatel byl úspěšně synchronizován do Supabase:', result.id);
        return result;
    } catch (error) {
        console.error('Neočekávaná chyba při synchronizaci uživatele do Supabase:', error);
        return null;
    }
}

// Funkce pro získání uživatelských dat ze Supabase
async function getUserFromSupabase(auth0Id) {
    try {
        if (!auth0Id) {
            console.error('Nelze získat uživatele ze Supabase: Chybí Auth0 ID');
            return null;
        }

        console.log('Získávání uživatele ze Supabase podle Auth0 ID:', auth0Id);

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('auth0_id', auth0Id)
            .single();

        if (error) {
            console.error('Chyba při získávání uživatele ze Supabase:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Neočekávaná chyba při získávání uživatele ze Supabase:', error);
        return null;
    }
}

// Funkce pro uložení uživatelských dat do Supabase
async function saveUserData(auth0Id, userData) {
    try {
        if (!auth0Id) {
            console.error('Nelze uložit uživatelská data do Supabase: Chybí Auth0 ID');
            return false;
        }

        console.log('Ukládání uživatelských dat do Supabase pro uživatele:', auth0Id);

        // Přidání časového razítka aktualizace
        userData.updated_at = new Date().toISOString();

        const { error } = await supabase
            .from('users')
            .update(userData)
            .eq('auth0_id', auth0Id);

        if (error) {
            console.error('Chyba při ukládání uživatelských dat do Supabase:', error);
            return false;
        }

        console.log('Uživatelská data byla úspěšně uložena do Supabase');
        return true;
    } catch (error) {
        console.error('Neočekávaná chyba při ukládání uživatelských dat do Supabase:', error);
        return false;
    }
}

// Funkce pro získání uživatelských preferencí ze Supabase
async function getUserPreferences(auth0Id) {
    try {
        if (!auth0Id) {
            console.error('Nelze získat uživatelské preference ze Supabase: Chybí Auth0 ID');
            return null;
        }

        console.log('Získávání uživatelských preferencí ze Supabase pro uživatele:', auth0Id);

        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', auth0Id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
            console.error('Chyba při získávání uživatelských preferencí ze Supabase:', error);
            return null;
        }

        // Pokud neexistují preference, vytvoříme výchozí
        if (!data) {
            const defaultPreferences = {
                user_id: auth0Id,
                theme: 'light',
                language: 'cs',
                notifications_enabled: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { data: newPrefs, error: insertError } = await supabase
                .from('user_preferences')
                .insert([defaultPreferences])
                .select()
                .single();

            if (insertError) {
                console.error('Chyba při vytváření výchozích uživatelských preferencí v Supabase:', insertError);
                return defaultPreferences; // Vrátíme alespoň výchozí hodnoty, i když se nepodařilo uložit
            }

            return newPrefs;
        }

        return data;
    } catch (error) {
        console.error('Neočekávaná chyba při získávání uživatelských preferencí ze Supabase:', error);
        return null;
    }
}

// Funkce pro uložení uživatelských preferencí do Supabase
async function saveUserPreferences(auth0Id, preferences) {
    try {
        if (!auth0Id) {
            console.error('Nelze uložit uživatelské preference do Supabase: Chybí Auth0 ID');
            return false;
        }

        console.log('Ukládání uživatelských preferencí do Supabase pro uživatele:', auth0Id);

        // Přidání časového razítka aktualizace
        preferences.updated_at = new Date().toISOString();
        preferences.user_id = auth0Id;

        // Kontrola, zda preference již existují
        const { data: existingPrefs, error: fetchError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', auth0Id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
            console.error('Chyba při kontrole existujících preferencí v Supabase:', fetchError);
            return false;
        }

        let result;

        if (existingPrefs) {
            // Aktualizace existujících preferencí
            const { error } = await supabase
                .from('user_preferences')
                .update(preferences)
                .eq('user_id', auth0Id);

            if (error) {
                console.error('Chyba při aktualizaci uživatelských preferencí v Supabase:', error);
                return false;
            }
        } else {
            // Vytvoření nových preferencí
            preferences.created_at = new Date().toISOString();

            const { error } = await supabase
                .from('user_preferences')
                .insert([preferences]);

            if (error) {
                console.error('Chyba při vytváření uživatelských preferencí v Supabase:', error);
                return false;
            }
        }

        console.log('Uživatelské preference byly úspěšně uloženy do Supabase');
        return true;
    } catch (error) {
        console.error('Neočekávaná chyba při ukládání uživatelských preferencí do Supabase:', error);
        return false;
    }
}

// Export funkcí a klientů
module.exports = {
    supabase,
    supabaseAdmin,
    syncUserToSupabase,
    getUserFromSupabase,
    saveUserData,
    getUserPreferences,
    saveUserPreferences
};
