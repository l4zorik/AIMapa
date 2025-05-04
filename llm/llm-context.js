/**
 * LLM Context
 * Verze 0.3.8.7
 * 
 * Implementace kontextového vyhledávání pro LLM Service
 */

/**
 * Třída pro kontextové vyhledávání pro LLM
 */
class LLMContext {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {number} options.maxContextLength - Maximální délka kontextu v počtu znaků (výchozí: 2000)
   */
  constructor(options = {}) {
    this.maxContextLength = options.maxContextLength || 2000;
    
    console.log(`LLM Context inicializován s maximální délkou kontextu ${this.maxContextLength} znaků`);
  }
  
  /**
   * Získání relevantního kontextu pro prompt
   * @param {string} prompt - Prompt pro LLM
   * @param {Object} context - Kontext pro LLM
   * @returns {Promise<string|null>} Relevantní kontext nebo null, pokud není k dispozici
   */
  async getRelevantContext(prompt, context) {
    try {
      if (!context || Object.keys(context).length === 0) {
        return null;
      }
      
      // Převedení kontextu na string
      let contextString = '';
      
      // Zpracování různých typů kontextu
      if (context.location) {
        contextString += `Aktuální lokace: ${context.location}\n`;
      }
      
      if (context.destination) {
        contextString += `Cílová destinace: ${context.destination}\n`;
      }
      
      if (context.transportMode) {
        contextString += `Způsob dopravy: ${context.transportMode}\n`;
      }
      
      if (context.userPreferences) {
        contextString += 'Preference uživatele:\n';
        for (const [key, value] of Object.entries(context.userPreferences)) {
          contextString += `- ${key}: ${value}\n`;
        }
      }
      
      if (context.mapData) {
        contextString += 'Data z mapy:\n';
        if (context.mapData.points) {
          contextString += '- Body na mapě:\n';
          for (const point of context.mapData.points) {
            contextString += `  - ${point.name} (${point.lat}, ${point.lng}): ${point.description || 'Bez popisu'}\n`;
          }
        }
        
        if (context.mapData.routes) {
          contextString += '- Trasy na mapě:\n';
          for (const route of context.mapData.routes) {
            contextString += `  - ${route.name}: ${route.description || 'Bez popisu'}\n`;
          }
        }
      }
      
      if (context.conversationHistory) {
        contextString += 'Historie konverzace:\n';
        for (const message of context.conversationHistory) {
          contextString += `- ${message.role}: ${message.content}\n`;
        }
      }
      
      // Přidání vlastních dat kontextu
      for (const [key, value] of Object.entries(context)) {
        if (!['location', 'destination', 'transportMode', 'userPreferences', 'mapData', 'conversationHistory'].includes(key)) {
          if (typeof value === 'object') {
            contextString += `${key}:\n${JSON.stringify(value, null, 2)}\n`;
          } else {
            contextString += `${key}: ${value}\n`;
          }
        }
      }
      
      // Oříznutí kontextu na maximální délku
      if (contextString.length > this.maxContextLength) {
        contextString = contextString.substring(0, this.maxContextLength) + '...';
      }
      
      return contextString.trim() || null;
    } catch (error) {
      console.error('Chyba při získávání relevantního kontextu:', error);
      return null;
    }
  }
  
  /**
   * Extrakce klíčových slov z promptu
   * @param {string} prompt - Prompt pro LLM
   * @returns {Promise<Array<string>>} Klíčová slova
   * @private
   */
  async extractKeywords(prompt) {
    try {
      // Jednoduchá implementace extrakce klíčových slov
      // V reálné aplikaci by zde byla sofistikovanější implementace
      
      // Odstranění interpunkce a převedení na malá písmena
      const cleanPrompt = prompt.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
      
      // Rozdělení na slova
      const words = cleanPrompt.split(/\s+/);
      
      // Odstranění stop slov
      const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'to', 'of', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
      const keywords = words.filter(word => !stopWords.includes(word) && word.length > 2);
      
      // Odstranění duplicit
      return [...new Set(keywords)];
    } catch (error) {
      console.error('Chyba při extrakci klíčových slov:', error);
      return [];
    }
  }
  
  /**
   * Získání relevantních dat z databáze
   * @param {Array<string>} keywords - Klíčová slova
   * @returns {Promise<Object|null>} Relevantní data nebo null, pokud nejsou k dispozici
   * @private
   */
  async getRelevantData(keywords) {
    try {
      // Zde by byla implementace získání relevantních dat z databáze
      // V reálné aplikaci by zde byla sofistikovanější implementace
      
      // Prozatím vrátíme prázdný objekt
      return {};
    } catch (error) {
      console.error('Chyba při získávání relevantních dat:', error);
      return null;
    }
  }
}

module.exports = LLMContext;
