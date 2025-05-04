/**
 * Test OpenAI API
 * Verze 0.3.8.7
 * 
 * Testovací skript pro OpenAI API
 */

require('dotenv').config();
const OpenAIProvider = require('./llm-providers/openai-provider');

// Kontrola, zda je k dispozici API klíč
if (!process.env.OPENAI_API_KEY) {
  console.error('Chyba: OPENAI_API_KEY není nastaven v .env souboru');
  process.exit(1);
}

// Kontrola, zda je k dispozici prompt
const prompt = process.argv[2];
if (!prompt) {
  console.error('Použití: node test-openai.js "Váš prompt"');
  process.exit(1);
}

// Inicializace OpenAI providera
const openai = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4',
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '1000')
});

// Testování OpenAI API
async function testOpenAI() {
  try {
    console.log(`Testování OpenAI API s promptem: "${prompt}"`);
    console.log('Čekejte na odpověď...');
    
    const startTime = Date.now();
    const response = await openai.getCompletion(prompt);
    const endTime = Date.now();
    
    console.log('\nOdpověď od OpenAI:');
    console.log('-------------------');
    console.log(response.text);
    console.log('-------------------');
    
    console.log('\nInformace o odpovědi:');
    console.log(`Model: ${response.model}`);
    console.log(`Počet tokenů v promptu: ${response.usage.prompt_tokens}`);
    console.log(`Počet tokenů v odpovědi: ${response.usage.completion_tokens}`);
    console.log(`Celkový počet tokenů: ${response.usage.total_tokens}`);
    console.log(`Doba zpracování: ${(endTime - startTime) / 1000} sekund`);
    
    // Výpočet ceny (přibližně)
    const promptCost = response.usage.prompt_tokens * 0.00003; // $0.03 / 1K tokenů
    const completionCost = response.usage.completion_tokens * 0.00006; // $0.06 / 1K tokenů
    const totalCost = promptCost + completionCost;
    
    console.log(`Přibližná cena: $${totalCost.toFixed(6)}`);
  } catch (error) {
    console.error('Chyba při testování OpenAI API:', error);
  }
}

// Spuštění testu
testOpenAI();
