/**
 * Test Anthropic API
 * Verze 0.3.8.7
 * 
 * Testovací skript pro Anthropic API
 */

require('dotenv').config();
const AnthropicProvider = require('./llm-providers/anthropic-provider');

// Kontrola, zda je k dispozici API klíč
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Chyba: ANTHROPIC_API_KEY není nastaven v .env souboru');
  process.exit(1);
}

// Kontrola, zda je k dispozici prompt
const prompt = process.argv[2];
if (!prompt) {
  console.error('Použití: node test-anthropic.js "Váš prompt"');
  process.exit(1);
}

// Inicializace Anthropic providera
const anthropic = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.ANTHROPIC_MODEL || 'claude-3-opus-20240229',
  temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '1000')
});

// Testování Anthropic API
async function testAnthropic() {
  try {
    console.log(`Testování Anthropic API s promptem: "${prompt}"`);
    console.log('Čekejte na odpověď...');
    
    const startTime = Date.now();
    const response = await anthropic.getCompletion(prompt);
    const endTime = Date.now();
    
    console.log('\nOdpověď od Anthropic:');
    console.log('---------------------');
    console.log(response.text);
    console.log('---------------------');
    
    console.log('\nInformace o odpovědi:');
    console.log(`Model: ${response.model}`);
    console.log(`Počet tokenů v promptu: ${response.usage.prompt_tokens}`);
    console.log(`Počet tokenů v odpovědi: ${response.usage.completion_tokens}`);
    console.log(`Celkový počet tokenů: ${response.usage.total_tokens}`);
    console.log(`Doba zpracování: ${(endTime - startTime) / 1000} sekund`);
    
    // Výpočet ceny (přibližně)
    let promptCost, completionCost;
    
    if (response.model.includes('opus')) {
      promptCost = response.usage.prompt_tokens * 0.000015; // $15 / 1M tokenů
      completionCost = response.usage.completion_tokens * 0.000075; // $75 / 1M tokenů
    } else if (response.model.includes('sonnet')) {
      promptCost = response.usage.prompt_tokens * 0.000003; // $3 / 1M tokenů
      completionCost = response.usage.completion_tokens * 0.000015; // $15 / 1M tokenů
    } else if (response.model.includes('haiku')) {
      promptCost = response.usage.prompt_tokens * 0.00000025; // $0.25 / 1M tokenů
      completionCost = response.usage.completion_tokens * 0.00000125; // $1.25 / 1M tokenů
    } else {
      promptCost = 0;
      completionCost = 0;
    }
    
    const totalCost = promptCost + completionCost;
    
    console.log(`Přibližná cena: $${totalCost.toFixed(6)}`);
  } catch (error) {
    console.error('Chyba při testování Anthropic API:', error);
  }
}

// Spuštění testu
testAnthropic();
