/**
 * Anthropic Provider pro LangChain
 * Verze 0.3.8.7
 */

const { ChatAnthropic } = require('@langchain/anthropic');

/**
 * Vytvoření Anthropic klienta
 * @param {string} model - Model LLM
 * @param {number} temperature - Teplota
 * @param {number} maxTokens - Maximální počet tokenů
 * @returns {ChatAnthropic} Anthropic klient
 */
function createClient(model = 'claude-3-opus-20240229', temperature = 0.7, maxTokens = 1000) {
  return new ChatAnthropic({
    modelName: model,
    temperature: temperature,
    maxTokens: maxTokens,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY
  });
}

/**
 * Získání dostupných modelů
 * @returns {Array<string>} Seznam dostupných modelů
 */
function getAvailableModels() {
  return [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
    'claude-instant-1.2'
  ];
}

/**
 * Získání ceny za 1000 tokenů
 * @param {string} model - Model LLM
 * @returns {Object} Cena za 1000 tokenů
 */
function getPricing(model = 'claude-3-opus-20240229') {
  const pricing = {
    'claude-3-opus-20240229': {
      input: 0.015,
      output: 0.075
    },
    'claude-3-sonnet-20240229': {
      input: 0.003,
      output: 0.015
    },
    'claude-3-haiku-20240307': {
      input: 0.00025,
      output: 0.00125
    },
    'claude-2.1': {
      input: 0.008,
      output: 0.024
    },
    'claude-2.0': {
      input: 0.008,
      output: 0.024
    },
    'claude-instant-1.2': {
      input: 0.0008,
      output: 0.0024
    }
  };
  
  return pricing[model] || pricing['claude-3-opus-20240229'];
}

module.exports = {
  createClient,
  getAvailableModels,
  getPricing
};
