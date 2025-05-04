/**
 * LLM Cache
 * Verze 0.3.8.7
 * 
 * Implementace cachování odpovědí pro LLM Service
 */

/**
 * Třída pro cachování odpovědí od LLM
 */
class LLMCache {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {number} options.expiration - Doba platnosti cache v sekundách (výchozí: 3600 = 1 hodina)
   * @param {number} options.maxSize - Maximální počet položek v cache (výchozí: 1000)
   */
  constructor(options = {}) {
    this.expiration = options.expiration || 3600; // 1 hodina
    this.maxSize = options.maxSize || 1000;
    this.cache = new Map();
    
    console.log(`LLM Cache inicializována s expirací ${this.expiration} sekund a maximální velikostí ${this.maxSize} položek`);
    
    // Pravidelné čištění cache
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Každou minutu
  }
  
  /**
   * Získání položky z cache
   * @param {string} key - Klíč položky
   * @returns {Promise<Object|null>} Položka z cache nebo null, pokud položka neexistuje nebo vypršela
   */
  async get(key) {
    try {
      const item = this.cache.get(key);
      
      if (!item) {
        return null;
      }
      
      // Kontrola expirace
      if (Date.now() > item.expiration) {
        this.cache.delete(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Chyba při získávání položky z cache:', error);
      return null;
    }
  }
  
  /**
   * Uložení položky do cache
   * @param {string} key - Klíč položky
   * @param {Object} value - Hodnota položky
   * @param {number} expiration - Doba platnosti v sekundách (volitelné, výchozí: this.expiration)
   * @returns {Promise<void>}
   */
  async set(key, value, expiration = this.expiration) {
    try {
      // Kontrola velikosti cache
      if (this.cache.size >= this.maxSize) {
        this.removeOldest();
      }
      
      this.cache.set(key, {
        value,
        expiration: Date.now() + (expiration * 1000),
        created: Date.now()
      });
    } catch (error) {
      console.error('Chyba při ukládání položky do cache:', error);
    }
  }
  
  /**
   * Odstranění položky z cache
   * @param {string} key - Klíč položky
   * @returns {Promise<boolean>} true, pokud položka byla odstraněna, jinak false
   */
  async delete(key) {
    try {
      return this.cache.delete(key);
    } catch (error) {
      console.error('Chyba při odstraňování položky z cache:', error);
      return false;
    }
  }
  
  /**
   * Vyčištění celé cache
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      this.cache.clear();
    } catch (error) {
      console.error('Chyba při čištění cache:', error);
    }
  }
  
  /**
   * Odstranění nejstarší položky z cache
   * @private
   */
  removeOldest() {
    try {
      let oldestKey = null;
      let oldestTime = Infinity;
      
      for (const [key, item] of this.cache.entries()) {
        if (item.created < oldestTime) {
          oldestTime = item.created;
          oldestKey = key;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    } catch (error) {
      console.error('Chyba při odstraňování nejstarší položky z cache:', error);
    }
  }
  
  /**
   * Čištění expirovaných položek z cache
   * @private
   */
  cleanup() {
    try {
      const now = Date.now();
      
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiration) {
          this.cache.delete(key);
        }
      }
    } catch (error) {
      console.error('Chyba při čištění expirovaných položek z cache:', error);
    }
  }
  
  /**
   * Získání statistik cache
   * @returns {Object} Statistiky cache
   */
  getStats() {
    try {
      const now = Date.now();
      let expiredCount = 0;
      
      for (const item of this.cache.values()) {
        if (now > item.expiration) {
          expiredCount++;
        }
      }
      
      return {
        size: this.cache.size,
        maxSize: this.maxSize,
        expiredCount,
        expiration: this.expiration
      };
    } catch (error) {
      console.error('Chyba při získávání statistik cache:', error);
      return {
        size: 0,
        maxSize: this.maxSize,
        expiredCount: 0,
        expiration: this.expiration
      };
    }
  }
  
  /**
   * Destruktor - vyčištění intervalu
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

module.exports = LLMCache;
