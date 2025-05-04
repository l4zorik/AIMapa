/**
 * DeepSeek Provider pro LangChain
 * Verze 0.3.8.7
 */

const { ChatOpenAI } = require('@langchain/openai');

/**
 * Vytvoření DeepSeek klienta
 * @param {string} model - Model LLM
 * @param {number} temperature - Teplota
 * @param {number} maxTokens - Maximální počet tokenů
 * @returns {ChatOpenAI} DeepSeek klient (používá OpenAI kompatibilní API)
 */
function createClient(model = 'deepseek-coder', temperature = 0.7, maxTokens = 1000) {
  return new ChatOpenAI({
    modelName: model,
    temperature: temperature,
    maxTokens: maxTokens,
    openAIApiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
      baseURL: 'https://api.deepseek.com/v1'
    }
  });
}

/**
 * Získání dostupných modelů
 * @returns {Array<string>} Seznam dostupných modelů
 */
function getAvailableModels() {
  return [
    'deepseek-coder',
    'deepseek-chat',
    'deepseek-llm-67b-chat'
  ];
}

/**
 * Získání ceny za 1000 tokenů
 * @param {string} model - Model LLM
 * @returns {Object} Cena za 1000 tokenů
 */
function getPricing(model = 'deepseek-coder') {
  const pricing = {
    'deepseek-coder': {
      input: 0.0005,
      output: 0.0015
    },
    'deepseek-chat': {
      input: 0.0005,
      output: 0.0015
    },
    'deepseek-llm-67b-chat': {
      input: 0.0003,
      output: 0.0009
    }
  };
  
  return pricing[model] || pricing['deepseek-coder'];
}

module.exports = {
  createClient,
  getAvailableModels,
  getPricing
};
