/**
 * Test DeepSeek API
 * Verze 0.3.8.7
 * 
 * Testovací skript pro DeepSeek API
 */

require('dotenv').config();
const DeepSeekProvider = require('./llm-providers/deepseek-provider');

// Kontrola, zda je k dispozici API klíč
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('Chyba: DEEPSEEK_API_KEY není nastaven v .env souboru');
  process.exit(1);
}

// Kontrola, zda je k dispozici prompt
const prompt = process.argv[2];
if (!prompt) {
  console.error('Použití: node test-deepseek.js "Váš prompt"');
  process.exit(1);
}

// Inicializace DeepSeek providera
const deepseek = new DeepSeekProvider({
  apiKey: process.env.DEEPSEEK_API_KEY,
  model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '1000')
});

// Testování DeepSeek API
async function testDeepSeek() {
  try {
    console.log(`Testování DeepSeek API s promptem: "${prompt}"`);
    console.log('Čekejte na odpověď...');
    
    const startTime = Date.now();
    const response = await deepseek.getCompletion(prompt);
    const endTime = Date.now();
    
    console.log('\nOdpověď od DeepSeek:');
    console.log('--------------------');
    console.log(response.text);
    console.log('--------------------');
    
    console.log('\nInformace o odpovědi:');
    console.log(`Model: ${response.model}`);
    console.log(`Počet tokenů v promptu: ${response.usage.prompt_tokens}`);
    console.log(`Počet tokenů v odpovědi: ${response.usage.completion_tokens}`);
    console.log(`Celkový počet tokenů: ${response.usage.total_tokens}`);
    console.log(`Doba zpracování: ${(endTime - startTime) / 1000} sekund`);
    
    // Výpočet ceny (přibližně)
    // DeepSeek má nižší ceny než OpenAI a Anthropic
    const promptCost = response.usage.prompt_tokens * 0.0000005; // $0.5 / 1M tokenů
    const completionCost = response.usage.completion_tokens * 0.0000015; // $1.5 / 1M tokenů
    const totalCost = promptCost + completionCost;
    
    console.log(`Přibližná cena: $${totalCost.toFixed(6)}`);
  } catch (error) {
    console.error('Chyba při testování DeepSeek API:', error);
  }
}

// Spuštění testu
testDeepSeek();
