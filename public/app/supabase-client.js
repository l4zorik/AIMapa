/**
 * Supabase klient pro AIMapa
 * Verze 0.3.8.4
 */

// Globální objekt Supabase
const SupabaseClient = {
    // Instance Supabase klienta
    client: null,

    // Konfigurace
    config: {
        supabaseUrl: '',
        supabaseAnonKey: ''
    },

    // Inicializace Supabase klienta
    init() {
        console.log('Inicializace Supabase klienta...');

        // Pokud je klient již inicializován, vrátíme ho
        if (this.client) return this.client;

        try {
            // Načtení konfigurace z proměnných prostředí nebo z localStorage
            this.loadConfig();

            // Kontrola, zda je dostupný Supabase
            if (typeof supabase === 'undefined') {
                console.error('Supabase není dostupný. Ujistěte se, že je načten skript @supabase/supabase-js.');
                return null;
            }

            // Vytvoření Supabase klienta
            this.client = supabase.createClient(this.config.supabaseUrl, this.config.supabaseAnonKey);

            console.log('Supabase klient byl úspěšně inicializován');

            return this.client;
        } catch (error) {
            console.error('Chyba při inicializaci Supabase klienta:', error);
            return null;
        }
    },

    // Načtení konfigurace
    loadConfig() {
        // Pokus o načtení konfigurace z localStorage (pro vývoj)
        const savedConfig = localStorage.getItem('aiMapaSupabaseConfig');
        if (savedConfig) {
            try {
                const parsedConfig = JSON.parse(savedConfig);
                this.config.supabaseUrl = parsedConfig.supabaseUrl;
                this.config.supabaseAnonKey = parsedConfig.supabaseAnonKey;
                console.log('Konfigurace Supabase načtena z localStorage');
                return;
            } catch (error) {
                console.error('Chyba při načítání konfigurace z localStorage:', error);
            }
        }

        // Načtení konfigurace z proměnných prostředí (pro produkci)
        // V prohlížeči budou tyto proměnné dostupné, pokud je Netlify správně nastaví
        if (typeof process !== 'undefined' && process.env) {
            this.config.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
            this.config.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
            console.log('Konfigurace Supabase načtena z proměnných prostředí');
            return;
        }

        // Hodnoty pro produkci
        this.config.supabaseUrl = 'https://njjhhamwixjbfibywreo.supabase.co';
        this.config.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhoYW13aXhqYmZpYnl3cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzU5MTAsImV4cCI6MjA2MTM1MTkxMH0.8iei6QFMk18dLYoQIkJ63rEbDV_38TtSITmmRGRjoAY';
        console.log('Použity výchozí hodnoty konfigurace Supabase');
    },

    // Získání instance Supabase klienta
    getClient() {
        return this.client || this.init();
    },

    // Autentizace uživatele pomocí emailu a hesla
    async signIn(email, password, csrfToken = null) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            // Přidání CSRF tokenu do hlaviček
            const options = {};
            if (csrfToken) {
                options.headers = {
                    'X-CSRF-Token': csrfToken
                };
            }

            const { data, error } = await client.auth.signInWithPassword({
                email,
                password
            }, options);

            if (error) throw error;

            console.log('Uživatel byl úspěšně přihlášen:', data.user.email);

            // Uložení informace o přihlášení do localStorage
            if (typeof SecurityUtils !== 'undefined') {
                SecurityUtils.secureLocalStorageSet('lastLogin', Date.now());
                SecurityUtils.secureLocalStorageSet('userEmail', email);
            } else {
                localStorage.setItem('lastLogin', Date.now());
                localStorage.setItem('userEmail', email);
            }

            return { success: true, user: data.user, session: data.session };
        } catch (error) {
            console.error('Chyba při přihlašování uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Registrace nového uživatele
    async signUp(email, password, username, csrfToken = null) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            // Přidání CSRF tokenu do hlaviček
            const options = {};
            if (csrfToken) {
                options.headers = {
                    'X-CSRF-Token': csrfToken
                };
            }

            // Registrace uživatele
            const { data: authData, error: authError } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        security_level: 1 // Základní úroveň zabezpečení
                    }
                }
            }, options);

            if (authError) throw authError;

            // Pokud je uživatel úspěšně zaregistrován, vytvoříme záznam v tabulce users
            if (authData.user) {
                const { error: profileError } = await client
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

                if (profileError) throw profileError;

                // Vytvoření záznamu v tabulce user_stats
                const { error: statsError } = await client
                    .from('user_stats')
                    .insert([{ id: authData.user.id }]);

                if (statsError) throw statsError;

                // Vytvoření záznamu v tabulce user_settings
                const { error: settingsError } = await client
                    .from('user_settings')
                    .insert([{ id: authData.user.id }]);

                if (settingsError) throw settingsError;
            }

            console.log('Uživatel byl úspěšně zaregistrován:', email);

            // Vytvoření záznamu v tabulce security_logs
            if (authData.user) {
                try {
                    const { error: logError } = await client
                        .from('security_logs')
                        .insert([{
                            user_id: authData.user.id,
                            action: 'registration',
                            ip_address: 'unknown', // V prohlížeči nemáme přístup k IP adrese
                            user_agent: navigator.userAgent,
                            timestamp: new Date().toISOString()
                        }]);

                    if (logError) {
                        console.error('Chyba při vytváření bezpečnostního logu:', logError);
                    }
                } catch (logError) {
                    console.error('Chyba při vytváření bezpečnostního logu:', logError);
                }
            }

            return { success: true, user: authData.user };
        } catch (error) {
            console.error('Chyba při registraci uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Odhlášení uživatele
    async signOut() {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { error } = await client.auth.signOut();

            if (error) throw error;

            console.log('Uživatel byl úspěšně odhlášen');
            return { success: true };
        } catch (error) {
            console.error('Chyba při odhlašování uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání aktuálně přihlášeného uživatele
    async getCurrentUser() {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data: { user }, error } = await client.auth.getUser();

            if (error) throw error;

            if (!user) {
                console.log('Žádný uživatel není přihlášen');
                return { success: false, error: 'Žádný uživatel není přihlášen' };
            }

            console.log('Získán aktuální uživatel:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('Chyba při získávání aktuálního uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání dat uživatele z tabulky users
    async getUserProfile(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            console.log('Získán profil uživatele:', data.username);
            return { success: true, profile: data };
        } catch (error) {
            console.error('Chyba při získávání profilu uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace profilu uživatele
    async updateUserProfile(userId, profileData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('users')
                .update(profileData)
                .eq('id', userId);

            if (error) throw error;

            console.log('Profil uživatele byl aktualizován');
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci profilu uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání nastavení uživatele
    async getUserSettings(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('user_settings')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            console.log('Získána nastavení uživatele');
            return { success: true, settings: data };
        } catch (error) {
            console.error('Chyba při získávání nastavení uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace nastavení uživatele
    async updateUserSettings(userId, settingsData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('user_settings')
                .update(settingsData)
                .eq('id', userId);

            if (error) throw error;

            console.log('Nastavení uživatele byla aktualizována');
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci nastavení uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání statistik uživatele
    async getUserStats(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('user_stats')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            console.log('Získány statistiky uživatele');
            return { success: true, stats: data };
        } catch (error) {
            console.error('Chyba při získávání statistik uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace statistik uživatele
    async updateUserStats(userId, statsData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('user_stats')
                .update(statsData)
                .eq('id', userId);

            if (error) throw error;

            console.log('Statistiky uživatele byly aktualizovány');
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci statistik uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání achievementů uživatele
    async getUserAchievements(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('user_achievements')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            console.log('Získány achievementy uživatele, počet:', data.length);
            return { success: true, achievements: data };
        } catch (error) {
            console.error('Chyba při získávání achievementů uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Přidání achievementu uživateli
    async addUserAchievement(userId, achievementId, achievementName, achievementDescription) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('user_achievements')
                .insert([
                    {
                        user_id: userId,
                        achievement_id: achievementId,
                        achievement_name: achievementName,
                        achievement_description: achievementDescription
                    }
                ]);

            if (error) throw error;

            console.log('Achievement byl přidán uživateli:', achievementName);
            return { success: true };
        } catch (error) {
            console.error('Chyba při přidávání achievementu uživateli:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání virtuální práce uživatele
    async getUserVirtualWork(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('virtual_work')
                .select('*')
                .eq('user_id', userId)
                .order('start_time', { ascending: false });

            if (error) throw error;

            console.log('Získána virtuální práce uživatele, počet:', data.length);
            return { success: true, virtualWork: data };
        } catch (error) {
            console.error('Chyba při získávání virtuální práce uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Přidání virtuální práce uživateli
    async addUserVirtualWork(userId, workData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('virtual_work')
                .insert([
                    {
                        user_id: userId,
                        ...workData
                    }
                ]);

            if (error) throw error;

            console.log('Virtuální práce byla přidána uživateli');
            return { success: true };
        } catch (error) {
            console.error('Chyba při přidávání virtuální práce uživateli:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace virtuální práce uživatele
    async updateUserVirtualWork(workId, workData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('virtual_work')
                .update(workData)
                .eq('id', workId);

            if (error) throw error;

            console.log('Virtuální práce byla aktualizována');
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci virtuální práce:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání odměn uživatele
    async getUserRewards(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('rewards')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            console.log('Získány odměny uživatele, počet:', data.length);
            return { success: true, rewards: data };
        } catch (error) {
            console.error('Chyba při získávání odměn uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Přidání odměny uživateli
    async addUserReward(userId, rewardData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('rewards')
                .insert([
                    {
                        user_id: userId,
                        ...rewardData
                    }
                ]);

            if (error) throw error;

            console.log('Odměna byla přidána uživateli');
            return { success: true };
        } catch (error) {
            console.error('Chyba při přidávání odměny uživateli:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání bodů na mapě uživatele
    async getUserMapPoints(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('map_points')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            console.log('Získány body na mapě uživatele, počet:', data.length);
            return { success: true, mapPoints: data };
        } catch (error) {
            console.error('Chyba při získávání bodů na mapě uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Přidání bodu na mapě uživateli
    async addUserMapPoint(userId, pointData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('map_points')
                .insert([
                    {
                        user_id: userId,
                        ...pointData
                    }
                ]);

            if (error) throw error;

            console.log('Bod na mapě byl přidán uživateli');
            return { success: true };
        } catch (error) {
            console.error('Chyba při přidávání bodu na mapě uživateli:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace bodu na mapě
    async updateUserMapPoint(pointId, pointData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('map_points')
                .update(pointData)
                .eq('id', pointId);

            if (error) throw error;

            console.log('Bod na mapě byl aktualizován');
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci bodu na mapě:', error);
            return { success: false, error: error.message };
        }
    },

    // Odstranění bodu na mapě
    async deleteUserMapPoint(pointId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('map_points')
                .delete()
                .eq('id', pointId);

            if (error) throw error;

            console.log('Bod na mapě byl odstraněn');
            return { success: true };
        } catch (error) {
            console.error('Chyba při odstraňování bodu na mapě:', error);
            return { success: false, error: error.message };
        }
    },

    // Získání úkolů uživatele
    async getUserTasks(userId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('tasks')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;

            console.log('Získány úkoly uživatele, počet:', data.length);
            return { success: true, tasks: data };
        } catch (error) {
            console.error('Chyba při získávání úkolů uživatele:', error);
            return { success: false, error: error.message };
        }
    },

    // Přidání úkolu uživateli
    async addUserTask(userId, taskData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('tasks')
                .insert([
                    {
                        user_id: userId,
                        ...taskData
                    }
                ]);

            if (error) throw error;

            console.log('Úkol byl přidán uživateli');
            return { success: true };
        } catch (error) {
            console.error('Chyba při přidávání úkolu uživateli:', error);
            return { success: false, error: error.message };
        }
    },

    // Aktualizace úkolu
    async updateUserTask(taskId, taskData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('tasks')
                .update(taskData)
                .eq('id', taskId);

            if (error) throw error;

            console.log('Úkol byl aktualizován');
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci úkolu:', error);
            return { success: false, error: error.message };
        }
    },

    // Odstranění úkolu
    async deleteUserTask(taskId) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase klient není inicializován');

            const { data, error } = await client
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;

            console.log('Úkol byl odstraněn');
            return { success: true };
        } catch (error) {
            console.error('Chyba při odstraňování úkolu:', error);
            return { success: false, error: error.message };
        }
    }
};

// Inicializace Supabase klienta po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Načtení Supabase skriptu, pokud ještě není načten
    if (typeof supabase === 'undefined') {
        console.log('Načítání Supabase skriptu...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.onload = function() {
            console.log('Supabase skript byl úspěšně načten');
            SupabaseClient.init();
        };
        script.onerror = function() {
            console.error('Chyba při načítání Supabase skriptu');
        };
        document.head.appendChild(script);
    } else {
        SupabaseClient.init();
    }
});
