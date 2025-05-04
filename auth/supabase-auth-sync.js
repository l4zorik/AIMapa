/**
 * Supabase Auth Sync
 * Verze 0.4.1
 * 
 * Synchronizace uživatelů mezi Auth0 a Supabase
 */

const { createClient } = require('@supabase/supabase-js');

class SupabaseAuthSync {
  /**
   * Vytvoří novou instanci SupabaseAuthSync
   * @param {Object} config - Konfigurace Supabase
   */
  constructor(config = {}) {
    this.supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL;
    this.supabaseKey = config.supabaseKey || process.env.SUPABASE_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Chybí Supabase URL nebo API klíč');
    }
    
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    
    console.log('SupabaseAuthSync: Inicializováno');
    console.log('Supabase URL:', this.supabaseUrl);
  }
  
  /**
   * Synchronizuje uživatele z Auth0 do Supabase
   * @param {Object} user - Uživatelský profil z Auth0
   * @returns {Object} Vytvořený nebo aktualizovaný uživatel v Supabase
   */
  async syncUser(user) {
    if (!user || !user.sub) {
      throw new Error('Neplatný uživatelský profil');
    }
    
    try {
      // Kontrola, zda uživatel již existuje
      const { data: existingUser, error: fetchError } = await this.supabase
        .from('users')
        .select('*')
        .eq('auth0_id', user.sub)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error('Chyba při hledání uživatele:', fetchError);
        throw fetchError;
      }
      
      const userData = {
        auth0_id: user.sub,
        email: user.email,
        name: user.name || user.nickname || user.email,
        picture: user.picture,
        email_verified: user.email_verified,
        last_login: new Date().toISOString(),
        user_metadata: user.user_metadata || {},
        app_metadata: user.app_metadata || {}
      };
      
      let result;
      
      if (existingUser) {
        // Aktualizace existujícího uživatele
        const { data, error } = await this.supabase
          .from('users')
          .update(userData)
          .eq('auth0_id', user.sub)
          .select()
          .single();
        
        if (error) {
          console.error('Chyba při aktualizaci uživatele:', error);
          throw error;
        }
        
        result = data;
        console.log('Uživatel byl aktualizován v Supabase:', user.sub);
      } else {
        // Vytvoření nového uživatele
        userData.created_at = new Date().toISOString();
        
        const { data, error } = await this.supabase
          .from('users')
          .insert([userData])
          .select()
          .single();
        
        if (error) {
          console.error('Chyba při vytváření uživatele:', error);
          throw error;
        }
        
        result = data;
        console.log('Uživatel byl vytvořen v Supabase:', user.sub);
      }
      
      return result;
    } catch (error) {
      console.error('Chyba při synchronizaci uživatele:', error);
      throw error;
    }
  }
  
  /**
   * Získá uživatele z Supabase podle Auth0 ID
   * @param {string} auth0Id - Auth0 ID uživatele
   * @returns {Object} Uživatel z Supabase
   */
  async getUserByAuth0Id(auth0Id) {
    if (!auth0Id) {
      throw new Error('Chybí Auth0 ID');
    }
    
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('auth0_id', auth0Id)
        .single();
      
      if (error) {
        console.error('Chyba při získávání uživatele:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Chyba při získávání uživatele:', error);
      throw error;
    }
  }
  
  /**
   * Aktualizuje uživatelská metadata v Supabase
   * @param {string} auth0Id - Auth0 ID uživatele
   * @param {Object} metadata - Metadata k aktualizaci
   * @returns {Object} Aktualizovaný uživatel
   */
  async updateUserMetadata(auth0Id, metadata) {
    if (!auth0Id) {
      throw new Error('Chybí Auth0 ID');
    }
    
    try {
      const { data, error } = await this.supabase
        .from('users')
        .update({
          user_metadata: metadata,
          updated_at: new Date().toISOString()
        })
        .eq('auth0_id', auth0Id)
        .select()
        .single();
      
      if (error) {
        console.error('Chyba při aktualizaci metadat:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Chyba při aktualizaci metadat:', error);
      throw error;
    }
  }
  
  /**
   * Vytvoří middleware pro synchronizaci uživatelů
   * @returns {Function} Express middleware
   */
  createSyncMiddleware() {
    return async (req, res, next) => {
      if (req.oidc && req.oidc.isAuthenticated() && req.oidc.user) {
        try {
          // Synchronizace uživatele do Supabase
          const supabaseUser = await this.syncUser(req.oidc.user);
          
          // Přidání Supabase uživatele do req objektu
          req.supabaseUser = supabaseUser;
        } catch (error) {
          console.error('Chyba při synchronizaci uživatele v middleware:', error);
          // Pokračujeme dál i v případě chyby
        }
      }
      
      next();
    };
  }
}

module.exports = SupabaseAuthSync;
