/**
 * Modul pro správu uživatelského profilu v AIMapa
 * Verze 0.3.8.5
 * 
 * Tento modul poskytuje funkce pro správu uživatelského profilu,
 * včetně načítání, aktualizace a synchronizace dat mezi Auth0 a Supabase.
 */

const UserProfileService = {
    // Stav modulu
    state: {
        isInitialized: false,
        profile: null,
        stats: null,
        settings: null,
        achievements: [],
        loadingProfile: false,
        updatingProfile: false
    },

    /**
     * Inicializace modulu
     */
    init() {
        console.log('Inicializace modulu pro správu uživatelského profilu...');

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        this.state.isInitialized = true;
        console.log('Modul pro správu uživatelského profilu byl inicializován');
    },

    /**
     * Nastavení posluchačů událostí
     */
    setupEventListeners() {
        // Posluchač pro změnu stavu autentizace
        document.addEventListener('authStateChanged', (event) => {
            console.log('Zachycena událost authStateChanged:', event.detail);
            
            if (event.detail.isLoggedIn && event.detail.user) {
                // Načtení profilu uživatele
                this.loadUserProfile(event.detail.user);
            } else {
                // Reset profilu
                this.resetProfile();
            }
        });
    },

    /**
     * Načtení profilu uživatele
     * @param {object} user - Uživatel z autentizačního systému
     */
    async loadUserProfile(user) {
        if (!user) {
            console.error('Nelze načíst profil: Chybí data uživatele');
            return false;
        }

        // Kontrola, zda již probíhá načítání
        if (this.state.loadingProfile) {
            console.warn('Načítání profilu již probíhá');
            return false;
        }

        this.state.loadingProfile = true;
        console.log('Načítání profilu uživatele:', user.email || user.sub);

        try {
            // Získání ID uživatele
            const userId = user.id || user.sub;
            
            // Načtení profilu ze Supabase
            if (typeof SupabaseClient !== 'undefined') {
                // Načtení základního profilu
                const profileResult = await SupabaseClient.getUserProfile(userId);
                
                if (profileResult.success) {
                    this.state.profile = profileResult.profile;
                    console.log('Profil uživatele byl načten ze Supabase');
                } else {
                    console.error('Chyba při načítání profilu ze Supabase:', profileResult.error);
                }

                // Načtení statistik
                const statsResult = await SupabaseClient.getUserStats(userId);
                
                if (statsResult.success) {
                    this.state.stats = statsResult.stats;
                    console.log('Statistiky uživatele byly načteny ze Supabase');
                } else {
                    console.error('Chyba při načítání statistik ze Supabase:', statsResult.error);
                }

                // Načtení nastavení
                const settingsResult = await SupabaseClient.getUserSettings(userId);
                
                if (settingsResult.success) {
                    this.state.settings = settingsResult.settings;
                    console.log('Nastavení uživatele byla načtena ze Supabase');
                } else {
                    console.error('Chyba při načítání nastavení ze Supabase:', settingsResult.error);
                }

                // Načtení achievementů
                const achievementsResult = await SupabaseClient.getUserAchievements(userId);
                
                if (achievementsResult.success) {
                    this.state.achievements = achievementsResult.achievements;
                    console.log('Achievementy uživatele byly načteny ze Supabase');
                } else {
                    console.error('Chyba při načítání achievementů ze Supabase:', achievementsResult.error);
                }
            } else {
                // Fallback na data z Auth0
                if (typeof Auth0Auth !== 'undefined') {
                    const userInfoResult = await Auth0Auth.getUserInfo();
                    
                    if (userInfoResult.success) {
                        // Vytvoření základního profilu z Auth0 dat
                        this.state.profile = {
                            id: userInfoResult.data.sub,
                            email: userInfoResult.data.email,
                            username: userInfoResult.data.nickname || userInfoResult.data.name || userInfoResult.data.email.split('@')[0],
                            avatar_url: userInfoResult.data.picture || 'https://via.placeholder.com/150',
                            level: 1,
                            xp: 0,
                            xp_to_next_level: 100,
                            balance: 500,
                            currency: 'CZK',
                            bitcoin: 0.05
                        };
                        
                        // Vytvoření základních statistik
                        this.state.stats = {
                            id: userInfoResult.data.sub,
                            tasks_completed: 0,
                            distance_traveled: 0,
                            time_spent: 0,
                            money_earned: 0,
                            money_spent: 0
                        };
                        
                        // Vytvoření základních nastavení
                        this.state.settings = {
                            id: userInfoResult.data.sub,
                            dark_mode: true,
                            notifications_enabled: true,
                            sound_enabled: true,
                            language: 'cs'
                        };
                        
                        console.log('Základní profil uživatele byl vytvořen z Auth0 dat');
                    } else {
                        console.error('Chyba při načítání dat uživatele z Auth0:', userInfoResult.error);
                    }
                } else {
                    console.error('Žádný poskytovatel dat není dostupný');
                }
            }

            // Vyvolání události o načtení profilu
            this.notifyProfileLoaded();

            this.state.loadingProfile = false;
            return true;
        } catch (error) {
            console.error('Chyba při načítání profilu uživatele:', error);
            this.state.loadingProfile = false;
            return false;
        }
    },

    /**
     * Reset profilu
     */
    resetProfile() {
        this.state.profile = null;
        this.state.stats = null;
        this.state.settings = null;
        this.state.achievements = [];
        
        // Vyvolání události o resetu profilu
        this.notifyProfileReset();
        
        console.log('Profil uživatele byl resetován');
    },

    /**
     * Aktualizace profilu uživatele
     * @param {object} profileData - Nová data profilu
     */
    async updateProfile(profileData) {
        if (!this.state.profile) {
            console.error('Nelze aktualizovat profil: Profil není načten');
            return { success: false, error: 'Profil není načten' };
        }

        // Kontrola, zda již probíhá aktualizace
        if (this.state.updatingProfile) {
            console.warn('Aktualizace profilu již probíhá');
            return { success: false, error: 'Aktualizace profilu již probíhá' };
        }

        this.state.updatingProfile = true;
        console.log('Aktualizace profilu uživatele:', profileData);

        try {
            // Aktualizace profilu v Supabase
            if (typeof SupabaseClient !== 'undefined') {
                const result = await SupabaseClient.updateUserProfile(this.state.profile.id, profileData);
                
                if (result.success) {
                    // Aktualizace lokálního stavu
                    this.state.profile = { ...this.state.profile, ...profileData };
                    console.log('Profil uživatele byl aktualizován v Supabase');
                    
                    // Vyvolání události o aktualizaci profilu
                    this.notifyProfileUpdated();
                    
                    this.state.updatingProfile = false;
                    return { success: true };
                } else {
                    console.error('Chyba při aktualizaci profilu v Supabase:', result.error);
                    this.state.updatingProfile = false;
                    return result;
                }
            } else {
                // Fallback na lokální aktualizaci
                this.state.profile = { ...this.state.profile, ...profileData };
                console.log('Profil uživatele byl aktualizován pouze lokálně');
                
                // Vyvolání události o aktualizaci profilu
                this.notifyProfileUpdated();
                
                this.state.updatingProfile = false;
                return { success: true };
            }
        } catch (error) {
            console.error('Chyba při aktualizaci profilu uživatele:', error);
            this.state.updatingProfile = false;
            return { success: false, error: error.message || 'Chyba při aktualizaci profilu' };
        }
    },

    /**
     * Aktualizace nastavení uživatele
     * @param {object} settingsData - Nová data nastavení
     */
    async updateSettings(settingsData) {
        if (!this.state.settings) {
            console.error('Nelze aktualizovat nastavení: Nastavení není načteno');
            return { success: false, error: 'Nastavení není načteno' };
        }

        console.log('Aktualizace nastavení uživatele:', settingsData);

        try {
            // Aktualizace nastavení v Supabase
            if (typeof SupabaseClient !== 'undefined') {
                const result = await SupabaseClient.updateUserSettings(this.state.profile.id, settingsData);
                
                if (result.success) {
                    // Aktualizace lokálního stavu
                    this.state.settings = { ...this.state.settings, ...settingsData };
                    console.log('Nastavení uživatele bylo aktualizováno v Supabase');
                    
                    // Vyvolání události o aktualizaci nastavení
                    this.notifySettingsUpdated();
                    
                    return { success: true };
                } else {
                    console.error('Chyba při aktualizaci nastavení v Supabase:', result.error);
                    return result;
                }
            } else {
                // Fallback na lokální aktualizaci
                this.state.settings = { ...this.state.settings, ...settingsData };
                console.log('Nastavení uživatele bylo aktualizováno pouze lokálně');
                
                // Vyvolání události o aktualizaci nastavení
                this.notifySettingsUpdated();
                
                return { success: true };
            }
        } catch (error) {
            console.error('Chyba při aktualizaci nastavení uživatele:', error);
            return { success: false, error: error.message || 'Chyba při aktualizaci nastavení' };
        }
    },

    /**
     * Aktualizace statistik uživatele
     * @param {object} statsData - Nová data statistik
     */
    async updateStats(statsData) {
        if (!this.state.stats) {
            console.error('Nelze aktualizovat statistiky: Statistiky nejsou načteny');
            return { success: false, error: 'Statistiky nejsou načteny' };
        }

        console.log('Aktualizace statistik uživatele:', statsData);

        try {
            // Aktualizace statistik v Supabase
            if (typeof SupabaseClient !== 'undefined') {
                const result = await SupabaseClient.updateUserStats(this.state.profile.id, statsData);
                
                if (result.success) {
                    // Aktualizace lokálního stavu
                    this.state.stats = { ...this.state.stats, ...statsData };
                    console.log('Statistiky uživatele byly aktualizovány v Supabase');
                    
                    // Vyvolání události o aktualizaci statistik
                    this.notifyStatsUpdated();
                    
                    return { success: true };
                } else {
                    console.error('Chyba při aktualizaci statistik v Supabase:', result.error);
                    return result;
                }
            } else {
                // Fallback na lokální aktualizaci
                this.state.stats = { ...this.state.stats, ...statsData };
                console.log('Statistiky uživatele byly aktualizovány pouze lokálně');
                
                // Vyvolání události o aktualizaci statistik
                this.notifyStatsUpdated();
                
                return { success: true };
            }
        } catch (error) {
            console.error('Chyba při aktualizaci statistik uživatele:', error);
            return { success: false, error: error.message || 'Chyba při aktualizaci statistik' };
        }
    },

    /**
     * Přidání achievementu uživateli
     * @param {string} achievementId - ID achievementu
     * @param {string} achievementName - Název achievementu
     * @param {string} achievementDescription - Popis achievementu
     */
    async addAchievement(achievementId, achievementName, achievementDescription) {
        if (!this.state.profile) {
            console.error('Nelze přidat achievement: Profil není načten');
            return { success: false, error: 'Profil není načten' };
        }

        // Kontrola, zda uživatel již má tento achievement
        const existingAchievement = this.state.achievements.find(a => a.achievement_id === achievementId);
        if (existingAchievement) {
            console.log('Uživatel již má tento achievement:', achievementName);
            return { success: true, alreadyExists: true };
        }

        console.log('Přidání achievementu uživateli:', achievementName);

        try {
            // Přidání achievementu v Supabase
            if (typeof SupabaseClient !== 'undefined') {
                const result = await SupabaseClient.addUserAchievement(
                    this.state.profile.id,
                    achievementId,
                    achievementName,
                    achievementDescription
                );
                
                if (result.success) {
                    // Aktualizace lokálního stavu
                    this.state.achievements.push({
                        user_id: this.state.profile.id,
                        achievement_id: achievementId,
                        achievement_name: achievementName,
                        achievement_description: achievementDescription,
                        unlocked_at: new Date().toISOString()
                    });
                    
                    console.log('Achievement byl přidán uživateli v Supabase');
                    
                    // Vyvolání události o přidání achievementu
                    this.notifyAchievementAdded(achievementId, achievementName);
                    
                    return { success: true };
                } else {
                    console.error('Chyba při přidání achievementu v Supabase:', result.error);
                    return result;
                }
            } else {
                // Fallback na lokální přidání
                this.state.achievements.push({
                    user_id: this.state.profile.id,
                    achievement_id: achievementId,
                    achievement_name: achievementName,
                    achievement_description: achievementDescription,
                    unlocked_at: new Date().toISOString()
                });
                
                console.log('Achievement byl přidán uživateli pouze lokálně');
                
                // Vyvolání události o přidání achievementu
                this.notifyAchievementAdded(achievementId, achievementName);
                
                return { success: true };
            }
        } catch (error) {
            console.error('Chyba při přidání achievementu uživateli:', error);
            return { success: false, error: error.message || 'Chyba při přidání achievementu' };
        }
    },

    /**
     * Přidání XP uživateli
     * @param {number} xpAmount - Množství XP k přidání
     * @param {string} source - Zdroj XP (např. 'task', 'achievement', 'login')
     */
    async addXP(xpAmount, source = 'unknown') {
        if (!this.state.profile) {
            console.error('Nelze přidat XP: Profil není načten');
            return { success: false, error: 'Profil není načten' };
        }

        console.log(`Přidání ${xpAmount} XP uživateli (zdroj: ${source})`);

        try {
            // Výpočet nových hodnot
            const currentXP = this.state.profile.xp || 0;
            const currentLevel = this.state.profile.level || 1;
            const currentXPToNextLevel = this.state.profile.xp_to_next_level || 100;
            
            let newXP = currentXP + xpAmount;
            let newLevel = currentLevel;
            let newXPToNextLevel = currentXPToNextLevel;
            let leveledUp = false;
            
            // Kontrola, zda uživatel postoupil na další úroveň
            while (newXP >= newXPToNextLevel) {
                newXP -= newXPToNextLevel;
                newLevel++;
                newXPToNextLevel = Math.floor(newXPToNextLevel * 1.5); // Každá další úroveň vyžaduje o 50% více XP
                leveledUp = true;
            }
            
            // Aktualizace profilu
            const profileData = {
                xp: newXP,
                level: newLevel,
                xp_to_next_level: newXPToNextLevel
            };
            
            const result = await this.updateProfile(profileData);
            
            if (result.success) {
                // Vyvolání události o přidání XP
                this.notifyXPAdded(xpAmount, source);
                
                // Vyvolání události o postupu na další úroveň
                if (leveledUp) {
                    this.notifyLevelUp(newLevel);
                }
                
                return { success: true, leveledUp, newLevel };
            } else {
                return result;
            }
        } catch (error) {
            console.error('Chyba při přidání XP uživateli:', error);
            return { success: false, error: error.message || 'Chyba při přidání XP' };
        }
    },

    /**
     * Přidání peněz uživateli
     * @param {number} amount - Množství peněz k přidání
     * @param {string} source - Zdroj peněz (např. 'task', 'achievement', 'work')
     */
    async addMoney(amount, source = 'unknown') {
        if (!this.state.profile) {
            console.error('Nelze přidat peníze: Profil není načten');
            return { success: false, error: 'Profil není načten' };
        }

        console.log(`Přidání ${amount} ${this.state.profile.currency} uživateli (zdroj: ${source})`);

        try {
            // Výpočet nové hodnoty
            const currentBalance = this.state.profile.balance || 0;
            const newBalance = currentBalance + amount;
            
            // Aktualizace profilu
            const profileData = {
                balance: newBalance
            };
            
            const result = await this.updateProfile(profileData);
            
            if (result.success) {
                // Aktualizace statistik
                if (this.state.stats) {
                    const statsData = {};
                    
                    if (amount > 0) {
                        statsData.money_earned = (this.state.stats.money_earned || 0) + amount;
                    } else {
                        statsData.money_spent = (this.state.stats.money_spent || 0) - amount;
                    }
                    
                    await this.updateStats(statsData);
                }
                
                // Vyvolání události o přidání peněz
                this.notifyMoneyChanged(amount, source);
                
                return { success: true, newBalance };
            } else {
                return result;
            }
        } catch (error) {
            console.error('Chyba při přidání peněz uživateli:', error);
            return { success: false, error: error.message || 'Chyba při přidání peněz' };
        }
    },

    /**
     * Oznámení o načtení profilu
     */
    notifyProfileLoaded() {
        document.dispatchEvent(new CustomEvent('userProfileLoaded', {
            detail: {
                profile: this.state.profile,
                stats: this.state.stats,
                settings: this.state.settings,
                achievements: this.state.achievements
            }
        }));
    },

    /**
     * Oznámení o resetu profilu
     */
    notifyProfileReset() {
        document.dispatchEvent(new CustomEvent('userProfileReset'));
    },

    /**
     * Oznámení o aktualizaci profilu
     */
    notifyProfileUpdated() {
        document.dispatchEvent(new CustomEvent('userProfileUpdated', {
            detail: {
                profile: this.state.profile
            }
        }));
    },

    /**
     * Oznámení o aktualizaci nastavení
     */
    notifySettingsUpdated() {
        document.dispatchEvent(new CustomEvent('userSettingsUpdated', {
            detail: {
                settings: this.state.settings
            }
        }));
    },

    /**
     * Oznámení o aktualizaci statistik
     */
    notifyStatsUpdated() {
        document.dispatchEvent(new CustomEvent('userStatsUpdated', {
            detail: {
                stats: this.state.stats
            }
        }));
    },

    /**
     * Oznámení o přidání achievementu
     * @param {string} achievementId - ID achievementu
     * @param {string} achievementName - Název achievementu
     */
    notifyAchievementAdded(achievementId, achievementName) {
        document.dispatchEvent(new CustomEvent('userAchievementAdded', {
            detail: {
                achievementId,
                achievementName
            }
        }));
    },

    /**
     * Oznámení o přidání XP
     * @param {number} amount - Množství přidaných XP
     * @param {string} source - Zdroj XP
     */
    notifyXPAdded(amount, source) {
        document.dispatchEvent(new CustomEvent('userXPAdded', {
            detail: {
                amount,
                source
            }
        }));
    },

    /**
     * Oznámení o postupu na další úroveň
     * @param {number} newLevel - Nová úroveň
     */
    notifyLevelUp(newLevel) {
        document.dispatchEvent(new CustomEvent('userLevelUp', {
            detail: {
                newLevel
            }
        }));
    },

    /**
     * Oznámení o změně peněz
     * @param {number} amount - Množství změněných peněz
     * @param {string} source - Zdroj změny
     */
    notifyMoneyChanged(amount, source) {
        document.dispatchEvent(new CustomEvent('userMoneyChanged', {
            detail: {
                amount,
                source
            }
        }));
    },

    /**
     * Získání profilu uživatele
     */
    getProfile() {
        return this.state.profile;
    },

    /**
     * Získání statistik uživatele
     */
    getStats() {
        return this.state.stats;
    },

    /**
     * Získání nastavení uživatele
     */
    getSettings() {
        return this.state.settings;
    },

    /**
     * Získání achievementů uživatele
     */
    getAchievements() {
        return this.state.achievements;
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace modulu
    UserProfileService.init();
});

// Export modulu
window.UserProfileService = UserProfileService;
