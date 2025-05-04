/**
 * Supabase Integration
 * Verze 0.3.8.7
 * 
 * Modul pro integraci Auth0 a Supabase
 */

const { createClient } = require('@supabase/supabase-js');

/**
 * Třída pro integraci Auth0 a Supabase
 */
class SupabaseIntegration {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {string} options.supabaseUrl - URL Supabase projektu
   * @param {string} options.supabaseKey - Anonymní klíč Supabase projektu
   * @param {string} options.supabaseServiceKey - Servisní klíč Supabase projektu
   */
  constructor(options = {}) {
    this.supabaseUrl = options.supabaseUrl || process.env.SUPABASE_URL;
    this.supabaseKey = options.supabaseKey || process.env.SUPABASE_KEY;
    this.supabaseServiceKey = options.supabaseServiceKey || process.env.SUPABASE_SERVICE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL a klíč jsou povinné');
    }
    
    // Inicializace Supabase klienta
    this.client = createClient(this.supabaseUrl, this.supabaseKey);
    
    // Inicializace Supabase admin klienta (pokud je k dispozici servisní klíč)
    if (this.supabaseServiceKey) {
      this.adminClient = createClient(this.supabaseUrl, this.supabaseServiceKey);
    }
  }
  
  /**
   * Získání Supabase klienta
   * @returns {Object} Supabase klient
   */
  getClient() {
    return this.client;
  }
  
  /**
   * Získání Supabase admin klienta
   * @returns {Object} Supabase admin klient
   */
  getAdminClient() {
    if (!this.adminClient) {
      throw new Error('Supabase admin klient není k dispozici - chybí servisní klíč');
    }
    return this.adminClient;
  }
  
  /**
   * Vytvoření nebo aktualizace uživatele v Supabase
   * @param {Object} user - Uživatelský objekt z Auth0
   * @returns {Promise<Object>} Vytvořený nebo aktualizovaný uživatel
   */
  async upsertUser(user) {
    try {
      if (!user || !user.sub) {
        throw new Error('Neplatný uživatelský objekt');
      }
      
      // Kontrola, zda uživatel již existuje
      const { data: existingUser, error: existingError } = await this.client
        .from('users')
        .select('*')
        .eq('id', user.sub)
        .single();
      
      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError;
      }
      
      if (existingUser) {
        // Aktualizace existujícího uživatele
        const { data, error } = await this.client
          .from('users')
          .update({
            username: user.nickname || user.name,
            email: user.email,
            avatar_url: user.picture,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.sub)
          .select();
        
        if (error) throw error;
        
        return data[0];
      } else {
        // Vytvoření nového uživatele
        const { data, error } = await this.client
          .from('users')
          .insert([
            {
              id: user.sub,
              username: user.nickname || user.name,
              email: user.email,
              avatar_url: user.picture,
              level: 1,
              xp: 0,
              xp_to_next_level: 100,
              balance: 500,
              currency: 'CZK',
              bitcoin: 0.05
            }
          ])
          .select();
        
        if (error) throw error;
        
        // Vytvoření záznamu v tabulce user_stats
        await this.client
          .from('user_stats')
          .insert([{ id: user.sub }]);
        
        // Vytvoření záznamu v tabulce user_settings
        await this.client
          .from('user_settings')
          .insert([{ id: user.sub }]);
        
        return data[0];
      }
    } catch (error) {
      console.error('Chyba při vytváření nebo aktualizaci uživatele v Supabase:', error);
      throw error;
    }
  }
  
  /**
   * Získání dat uživatele z Supabase
   * @param {string} userId - ID uživatele
   * @returns {Promise<Object>} Data uživatele
   */
  async getUserData(userId) {
    try {
      // Získání dat uživatele z tabulky users
      const { data: userData, error: userError } = await this.client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      // Získání statistik uživatele
      const { data: statsData, error: statsError } = await this.client
        .from('user_stats')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (statsError && statsError.code !== 'PGRST116') throw statsError;
      
      // Získání nastavení uživatele
      const { data: settingsData, error: settingsError } = await this.client
        .from('user_settings')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      return {
        ...userData,
        stats: statsData || {},
        settings: settingsData || {}
      };
    } catch (error) {
      console.error('Chyba při získávání dat uživatele z Supabase:', error);
      throw error;
    }
  }
  
  /**
   * Aktualizace dat uživatele v Supabase
   * @param {string} userId - ID uživatele
   * @param {Object} userData - Data uživatele k aktualizaci
   * @returns {Promise<Object>} Aktualizovaná data uživatele
   */
  async updateUserData(userId, userData) {
    try {
      if (!userId) {
        throw new Error('ID uživatele je povinné');
      }
      
      // Extrakce dat pro jednotlivé tabulky
      const { stats, settings, ...userInfo } = userData;
      
      // Aktualizace dat uživatele v tabulce users
      if (Object.keys(userInfo).length > 0) {
        const { error: userError } = await this.client
          .from('users')
          .update({
            ...userInfo,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (userError) throw userError;
      }
      
      // Aktualizace statistik uživatele
      if (stats && Object.keys(stats).length > 0) {
        const { error: statsError } = await this.client
          .from('user_stats')
          .update({
            ...stats,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (statsError) throw statsError;
      }
      
      // Aktualizace nastavení uživatele
      if (settings && Object.keys(settings).length > 0) {
        const { error: settingsError } = await this.client
          .from('user_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (settingsError) throw settingsError;
      }
      
      // Získání aktualizovaných dat uživatele
      return await this.getUserData(userId);
    } catch (error) {
      console.error('Chyba při aktualizaci dat uživatele v Supabase:', error);
      throw error;
    }
  }
  
  /**
   * Smazání uživatele z Supabase
   * @param {string} userId - ID uživatele
   * @returns {Promise<boolean>} True, pokud byl uživatel úspěšně smazán
   */
  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new Error('ID uživatele je povinné');
      }
      
      // Smazání uživatele z tabulky users
      // Díky CASCADE se automaticky smažou i záznamy v ostatních tabulkách
      const { error } = await this.client
        .from('users')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Chyba při mazání uživatele z Supabase:', error);
      throw error;
    }
  }
  
  /**
   * Middleware pro přidání Supabase klienta do req objektu
   * @returns {Function} Express middleware
   */
  middleware() {
    return (req, res, next) => {
      req.supabaseClient = this.client;
      
      // Pokud je k dispozici admin klient, přidáme ho také
      if (this.adminClient) {
        req.supabaseAdminClient = this.adminClient;
      }
      
      next();
    };
  }
}

module.exports = SupabaseIntegration;
