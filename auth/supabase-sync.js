/**
 * Supabase Sync
 * Verze 0.3.8.7
 * 
 * Modul pro synchronizaci dat mezi Auth0 a Supabase
 */

/**
 * Třída pro synchronizaci dat mezi Auth0 a Supabase
 */
class SupabaseSync {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {Object} options.supabaseIntegration - Instance SupabaseIntegration
   * @param {Object} options.auth0Service - Instance Auth0Service
   */
  constructor(options = {}) {
    this.supabaseIntegration = options.supabaseIntegration;
    this.auth0Service = options.auth0Service;
    
    if (!this.supabaseIntegration) {
      throw new Error('SupabaseIntegration je povinný');
    }
    
    if (!this.auth0Service) {
      throw new Error('Auth0Service je povinný');
    }
  }
  
  /**
   * Synchronizace dat uživatele po přihlášení
   * @param {Object} req - Express request objekt
   * @param {Object} res - Express response objekt
   * @param {Function} next - Express next funkce
   */
  syncUserOnLogin() {
    return async (req, res, next) => {
      try {
        // Kontrola, zda je uživatel přihlášen
        if (!this.auth0Service.isAuthenticated(req)) {
          return next();
        }
        
        // Získání profilu uživatele z Auth0
        const userProfile = this.auth0Service.getUserProfile(req);
        
        if (!userProfile || !userProfile.sub) {
          return next();
        }
        
        // Vytvoření nebo aktualizace uživatele v Supabase
        await this.supabaseIntegration.upsertUser(userProfile);
        
        next();
      } catch (error) {
        console.error('Chyba při synchronizaci dat uživatele po přihlášení:', error);
        next(error);
      }
    };
  }
  
  /**
   * Synchronizace dat uživatele před odhlášením
   * @param {Object} req - Express request objekt
   * @param {Object} res - Express response objekt
   * @param {Function} next - Express next funkce
   */
  syncUserBeforeLogout() {
    return async (req, res, next) => {
      try {
        // Kontrola, zda je uživatel přihlášen
        if (!this.auth0Service.isAuthenticated(req)) {
          return next();
        }
        
        // Získání ID uživatele z Auth0
        const userId = this.auth0Service.getUserId(req);
        
        if (!userId) {
          return next();
        }
        
        // Zde by mohla být logika pro synchronizaci dat před odhlášením
        // Například uložení aktuálního stavu aplikace
        
        next();
      } catch (error) {
        console.error('Chyba při synchronizaci dat uživatele před odhlášením:', error);
        next(error);
      }
    };
  }
  
  /**
   * Middleware pro automatickou synchronizaci dat uživatele
   * @returns {Function} Express middleware
   */
  autoSync() {
    return async (req, res, next) => {
      try {
        // Kontrola, zda je uživatel přihlášen
        if (!this.auth0Service.isAuthenticated(req)) {
          return next();
        }
        
        // Získání ID uživatele z Auth0
        const userId = this.auth0Service.getUserId(req);
        
        if (!userId) {
          return next();
        }
        
        // Přidání metody pro synchronizaci dat do req objektu
        req.syncUserData = async (userData) => {
          try {
            return await this.supabaseIntegration.updateUserData(userId, userData);
          } catch (error) {
            console.error('Chyba při synchronizaci dat uživatele:', error);
            throw error;
          }
        };
        
        // Přidání metody pro získání dat uživatele do req objektu
        req.getUserData = async () => {
          try {
            return await this.supabaseIntegration.getUserData(userId);
          } catch (error) {
            console.error('Chyba při získávání dat uživatele:', error);
            throw error;
          }
        };
        
        next();
      } catch (error) {
        console.error('Chyba v autoSync middleware:', error);
        next(error);
      }
    };
  }
  
  /**
   * Synchronizace dat uživatele mezi Auth0 a Supabase
   * @param {string} userId - ID uživatele
   * @returns {Promise<Object>} Synchronizovaná data uživatele
   */
  async syncUserData(userId) {
    try {
      if (!userId) {
        throw new Error('ID uživatele je povinné');
      }
      
      // Získání dat uživatele z Auth0
      const auth0User = await this.auth0Service.getUserById(userId);
      
      if (!auth0User) {
        throw new Error('Uživatel nebyl nalezen v Auth0');
      }
      
      // Vytvoření nebo aktualizace uživatele v Supabase
      const supabaseUser = await this.supabaseIntegration.upsertUser(auth0User);
      
      return {
        auth0User,
        supabaseUser
      };
    } catch (error) {
      console.error('Chyba při synchronizaci dat uživatele:', error);
      throw error;
    }
  }
  
  /**
   * Synchronizace všech uživatelů mezi Auth0 a Supabase
   * @returns {Promise<Object>} Výsledek synchronizace
   */
  async syncAllUsers() {
    try {
      // Získání všech uživatelů z Auth0
      const auth0Users = await this.auth0Service.getAllUsers();
      
      if (!auth0Users || !Array.isArray(auth0Users)) {
        throw new Error('Nepodařilo se získat uživatele z Auth0');
      }
      
      const results = {
        total: auth0Users.length,
        success: 0,
        failed: 0,
        errors: []
      };
      
      // Synchronizace každého uživatele
      for (const user of auth0Users) {
        try {
          await this.supabaseIntegration.upsertUser(user);
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            userId: user.user_id,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Chyba při synchronizaci všech uživatelů:', error);
      throw error;
    }
  }
}

module.exports = SupabaseSync;
