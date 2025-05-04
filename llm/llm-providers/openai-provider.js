/**
 * OpenAI Provider
 * Verze 0.3.8.7
 * 
 * Implementace OpenAI API pro LLM Service
 */

const axios = require('axios');

/**
 * Třída pro práci s OpenAI API
 */
class OpenAIProvider {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {string} options.apiKey - OpenAI API klíč
   * @param {string} options.model - Název modelu
   * @param {number} options.temperature - Teplota (0.0 - 1.0)
   * @param {number} options.maxTokens - Maximální počet tokenů
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.model = options.model || 'gpt-4';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 1000;
    
    if (!this.apiKey) {
      throw new Error('OpenAI API klíč je povinný');
    }
    
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`OpenAI Provider inicializován s modelem ${this.model}`);
  }
  
  /**
   * Získání odpovědi od OpenAI
   * @param {string} prompt - Prompt pro OpenAI
   * @returns {Promise<Object>} Odpověď od OpenAI
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
        provider: 'openai'
      };
    } catch (error) {
      console.error('Chyba při získávání odpovědi od OpenAI:', error.response?.data || error.message);
      throw new Error(`Chyba při komunikaci s OpenAI: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  /**
   * Získání informací o dostupných modelech
   * @returns {Promise<Array>} Informace o dostupných modelech
   */
  async getAvailableModels() {
    try {
      const response = await this.client.get('/models');
      
      // Filtrujeme pouze GPT modely
      const gptModels = response.data.data.filter(model => 
        model.id.includes('gpt')
      );
      
      return gptModels.map(model => ({
        id: model.id,
        name: model.id,
        provider: 'openai',
        created: model.created
      }));
    } catch (error) {
      console.error('Chyba při získávání informací o dostupných modelech:', error.response?.data || error.message);
      throw new Error(`Chyba při komunikaci s OpenAI: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  /**
   * Získání informací o aktuálním modelu
   * @returns {Object} Informace o aktuálním modelu
   */
  getModelInfo() {
    return {
      id: this.model,
      name: this.model,
      provider: 'openai',
      temperature: this.temperature,
      maxTokens: this.maxTokens
    };
  }
}

module.exports = OpenAIProvider;
