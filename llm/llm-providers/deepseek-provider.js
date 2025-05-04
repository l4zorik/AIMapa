/**
 * DeepSeek Provider
 * Verze 0.3.8.7
 * 
 * Implementace DeepSeek API pro LLM Service
 */

const axios = require('axios');

/**
 * Třída pro práci s DeepSeek API
 */
class DeepSeekProvider {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {string} options.apiKey - DeepSeek API klíč
   * @param {string} options.model - Název modelu
   * @param {number} options.temperature - Teplota (0.0 - 1.0)
   * @param {number} options.maxTokens - Maximální počet tokenů
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.model = options.model || 'deepseek-chat';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 1000;
    
    if (!this.apiKey) {
      throw new Error('DeepSeek API klíč je povinný');
    }
    
    this.client = axios.create({
      baseURL: 'https://api.deepseek.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`DeepSeek Provider inicializován s modelem ${this.model}`);
  }
  
  /**
   * Získání odpovědi od DeepSeek
   * @param {string} prompt - Prompt pro DeepSeek
   * @returns {Promise<Object>} Odpověď od DeepSeek
   */
  async getCompletion(prompt) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'Jsi užitečný asistent pro aplikaci AIMapa, která pomáhá uživatelům s navigací a poskytuje informace o místech.' },
          { role: 'user', content: prompt }
        ],
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });
      
      const result = response.data;
      
      return {
        text: result.choices[0].message.content,
        model: result.model,
        usage: result.usage,
        provider: 'deepseek'
      };
    } catch (error) {
      console.error('Chyba při získávání odpovědi od DeepSeek:', error.response?.data || error.message);
      throw new Error(`Chyba při komunikaci s DeepSeek: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  /**
   * Získání informací o dostupných modelech
   * @returns {Promise<Array>} Informace o dostupných modelech
   */
  async getAvailableModels() {
    // DeepSeek nemá endpoint pro získání dostupných modelů, proto je vrátíme napevno
    return [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'deepseek',
        created: new Date('2023-11-15').getTime() / 1000
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        provider: 'deepseek',
        created: new Date('2023-11-15').getTime() / 1000
      }
    ];
  }
  
  /**
   * Získání informací o aktuálním modelu
   * @returns {Object} Informace o aktuálním modelu
   */
  getModelInfo() {
    return {
      id: this.model,
      name: this.getModelName(this.model),
      provider: 'deepseek',
      temperature: this.temperature,
      maxTokens: this.maxTokens
    };
  }
  
  /**
   * Získání názvu modelu
   * @param {string} modelId - ID modelu
   * @returns {string} Název modelu
   * @private
   */
  getModelName(modelId) {
    const modelNames = {
      'deepseek-chat': 'DeepSeek Chat',
      'deepseek-coder': 'DeepSeek Coder'
    };
    
    return modelNames[modelId] || modelId;
  }
}

module.exports = DeepSeekProvider;
