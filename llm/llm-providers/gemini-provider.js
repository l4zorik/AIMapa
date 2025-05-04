/**
 * Gemini Provider
 * Verze 0.3.8.7
 * 
 * Implementace Google Gemini API pro LLM Service
 */

const axios = require('axios');

/**
 * Třída pro práci s Google Gemini API
 */
class GeminiProvider {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {string} options.apiKey - Gemini API klíč
   * @param {string} options.model - Název modelu
   * @param {number} options.temperature - Teplota (0.0 - 1.0)
   * @param {number} options.maxTokens - Maximální počet tokenů
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.model = options.model || 'gemini-1.5-flash';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 1000;
    
    if (!this.apiKey) {
      throw new Error('Gemini API klíč je povinný');
    }
    
    // Nastavení základní URL podle modelu
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    
    console.log(`Gemini Provider inicializován s modelem ${this.model}`);
  }
  
  /**
   * Získání odpovědi od Gemini
   * @param {string} prompt - Prompt pro Gemini
   * @returns {Promise<Object>} Odpověď od Gemini
   */
  async getCompletion(prompt) {
    try {
      const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
      
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens
        }
      };
      
      const response = await axios.post(url, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = response.data;
      
      // Extrahování textu z odpovědi
      if (result.candidates && result.candidates.length > 0 && 
          result.candidates[0].content && 
          result.candidates[0].content.parts && 
          result.candidates[0].content.parts.length > 0) {
        
        // Gemini API nevrací počet tokenů přímo, proto odhadujeme
        const inputText = prompt;
        const outputText = result.candidates[0].content.parts[0].text;
        
        // Přibližný odhad počtu tokenů (1 token ~ 4 znaky)
        const promptTokens = Math.ceil(inputText.length / 4);
        const completionTokens = Math.ceil(outputText.length / 4);
        
        return {
          text: outputText,
          model: this.model,
          usage: {
            prompt_tokens: promptTokens,
            completion_tokens: completionTokens,
            total_tokens: promptTokens + completionTokens
          },
          provider: 'gemini'
        };
      } else {
        throw new Error('Neplatná odpověď od Gemini API');
      }
    } catch (error) {
      console.error('Chyba při získávání odpovědi od Gemini:', error.response?.data || error.message);
      throw new Error(`Chyba při komunikaci s Gemini: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  /**
   * Získání informací o dostupných modelech
   * @returns {Promise<Array>} Informace o dostupných modelech
   */
  async getAvailableModels() {
    // Gemini nemá endpoint pro získání dostupných modelů, proto je vrátíme napevno
    return [
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'gemini',
        created: new Date('2024-03-15').getTime() / 1000
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'gemini',
        created: new Date('2024-03-15').getTime() / 1000
      },
      {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'gemini',
        created: new Date('2024-05-01').getTime() / 1000
      },
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'gemini',
        created: new Date('2024-05-01').getTime() / 1000
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
      provider: 'gemini',
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
      'gemini-1.5-flash': 'Gemini 1.5 Flash',
      'gemini-1.5-pro': 'Gemini 1.5 Pro',
      'gemini-2.5-pro': 'Gemini 2.5 Pro',
      'gemini-2.5-flash': 'Gemini 2.5 Flash'
    };
    
    return modelNames[modelId] || modelId;
  }
}

module.exports = GeminiProvider;
