/**
 * Test Gemini API
 * 
 * Jednoduchý skript pro testování Gemini API
 * 
 * Použití:
 * node llm/test-gemini.js "Jak se dostanu z Prahy do Brna?"
 */

// Načtení .env souboru
require('dotenv').config();

const GeminiProvider = require('./llm-providers/gemini-provider');

// Kontrola, zda byl zadán prompt
if (process.argv.length < 3) {
  console.error('Chybí prompt. Použití: node llm/test-gemini.js "Váš prompt"');
  process.exit(1);
}

// Získání promptu z argumentů příkazové řádky
const prompt = process.argv[2];

// Inicializace Gemini providera
const geminiProvider = new GeminiProvider({
  apiKey: process.env.GEMINI_API_KEY,
  model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '1000')
});

// Funkce pro testování Gemini API
async function testGeminiApi() {
  console.log('Test Gemini API');
  console.log('---------------');
  console.log(`Prompt: ${prompt}`);
  console.log('');
  
  try {
    console.log('Odesílám požadavek na Gemini API...');
    const startTime = Date.now();
    
    const response = await geminiProvider.getCompletion(prompt);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log('');
    console.log('Odpověď:');
    console.log('--------');
    console.log(response.text);
    console.log('');
    console.log('Metadata:');
    console.log('--------');
    console.log(`Model: ${response.model}`);
    console.log(`Provider: ${response.provider}`);
    console.log(`Doba zpracování: ${duration.toFixed(2)} s`);
    console.log(`Počet tokenů: ${response.usage.total_tokens} (vstup: ${response.usage.prompt_tokens}, výstup: ${response.usage.completion_tokens})`);
    
    // Odhad ceny
    const inputPrice = 0.000125; // USD za 1K tokenů vstupu
    const outputPrice = 0.000375; // USD za 1K tokenů výstupu
    const exchangeRate = 22; // Kurz USD/CZK
    
    const inputCost = (response.usage.prompt_tokens / 1000) * inputPrice * exchangeRate;
    const outputCost = (response.usage.completion_tokens / 1000) * outputPrice * exchangeRate;
    const totalCost = inputCost + outputCost;
    
    console.log(`Odhadovaná cena: ${totalCost.toFixed(4)} Kč (vstup: ${inputCost.toFixed(4)} Kč, výstup: ${outputCost.toFixed(4)} Kč)`);
  } catch (error) {
    console.error('Chyba při volání Gemini API:');
    console.error(error.message);
    process.exit(1);
  }
}

// Spuštění testu
testGeminiApi();
