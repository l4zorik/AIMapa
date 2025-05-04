/**
 * OpenAI Provider pro LangChain
 * Verze 0.3.8.7
 */

const { ChatOpenAI } = require('@langchain/openai');

/**
 * Vytvoření OpenAI klienta
 * @param {string} model - Model LLM
 * @param {number} temperature - Teplota
 * @param {number} maxTokens - Maximální počet tokenů
 * @returns {ChatOpenAI} OpenAI klient
 */
function createClient(model = 'gpt-4', temperature = 0.7, maxTokens = 1000) {
  return new ChatOpenAI({
    modelName: model,
    temperature: temperature,
    maxTokens: maxTokens,
    openAIApiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Získání dostupných modelů
 * @returns {Array<string>} Seznam dostupných modelů
 */
function getAvailableModels() {
  return [
    'gpt-4',
    'gpt-4-turbo',
    'gpt-4-vision',
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k'
  ];
}

/**
 * Získání ceny za 1000 tokenů
 * @param {string} model - Model LLM
 * @returns {Object} Cena za 1000 tokenů
 */
function getPricing(model = 'gpt-4') {
  const pricing = {
    'gpt-4': {
      input: 0.03,
      output: 0.06
    },
    'gpt-4-turbo': {
      input: 0.01,
      output: 0.03
    },
    'gpt-4-vision': {
      input: 0.01,
      output: 0.03
    },
    'gpt-3.5-turbo': {
      input: 0.0015,
      output: 0.002
    },
    'gpt-3.5-turbo-16k': {
      input: 0.003,
      output: 0.004
    }
  };
  
  return pricing[model] || pricing['gpt-4'];
}

module.exports = {
  createClient,
  getAvailableModels,
  getPricing
};
