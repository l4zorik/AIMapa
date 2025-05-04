/**
 * Anthropic Provider
 * Verze 0.3.8.7
 * 
 * Implementace Anthropic API pro LLM Service
 */

const axios = require('axios');

/**
 * Třída pro práci s Anthropic API
 */
class AnthropicProvider {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {string} options.apiKey - Anthropic API klíč
   * @param {string} options.model - Název modelu
   * @param {number} options.temperature - Teplota (0.0 - 1.0)
   * @param {number} options.maxTokens - Maximální počet tokenů
   */
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.model = options.model || 'claude-3-opus-20240229';
    this.temperature = options.temperature || 0.7;
    this.maxTokens = options.maxTokens || 1000;
    
    if (!this.apiKey) {
      throw new Error('Anthropic API klíč je povinný');
    }
    
    this.client = axios.create({
      baseURL: 'https://api.anthropic.com/v1',
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Anthropic Provider inicializován s modelem ${this.model}`);
  }
  
  /**
   * Získání odpovědi od Anthropic
   * @param {string} prompt - Prompt pro Anthropic
   * @returns {Promise<Object>} Odpověď od Anthropic
   */
  async getCompletion(prompt) {
    try {
      const response = await this.client.post('/messages', {
        model: this.model,
        messages: [
          { role: 'user', content: prompt }
        ],
        system: 'Jsi užitečný asistent pro aplikaci AIMapa, která pomáhá uživatelům s navigací a poskytuje informace o místech.',
        temperature: this.temperature,
        max_tokens: this.maxTokens
      });
      
      const result = response.data;
      
      return {
        text: result.content[0].text,
        model: result.model,
        usage: {
          prompt_tokens: result.usage.input_tokens,
          completion_tokens: result.usage.output_tokens,
          total_tokens: result.usage.input_tokens + result.usage.output_tokens
        },
        provider: 'anthropic'
      };
    } catch (error) {
      console.error('Chyba při získávání odpovědi od Anthropic:', error.response?.data || error.message);
      throw new Error(`Chyba při komunikaci s Anthropic: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  /**
   * Získání informací o dostupných modelech
   * @returns {Promise<Array>} Informace o dostupných modelech
   */
  async getAvailableModels() {
    // Anthropic nemá endpoint pro získání dostupných modelů, proto je vrátíme napevno
    return [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        created: new Date('2024-02-29').getTime() / 1000
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        created: new Date('2024-02-29').getTime() / 1000
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        created: new Date('2024-03-07').getTime() / 1000
      },
      {
        id: 'claude-2.1',
        name: 'Claude 2.1',
        provider: 'anthropic',
        created: new Date('2023-11-21').getTime() / 1000
      },
      {
        id: 'claude-2.0',
        name: 'Claude 2.0',
        provider: 'anthropic',
        created: new Date('2023-07-11').getTime() / 1000
      },
      {
        id: 'claude-instant-1.2',
        name: 'Claude Instant 1.2',
        provider: 'anthropic',
        created: new Date('2023-03-14').getTime() / 1000
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
      provider: 'anthropic',
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
      'claude-3-opus-20240229': 'Claude 3 Opus',
      'claude-3-sonnet-20240229': 'Claude 3 Sonnet',
      'claude-3-haiku-20240307': 'Claude 3 Haiku',
      'claude-2.1': 'Claude 2.1',
      'claude-2.0': 'Claude 2.0',
      'claude-instant-1.2': 'Claude Instant 1.2'
    };
    
    return modelNames[modelId] || modelId;
  }
}

module.exports = AnthropicProvider;
