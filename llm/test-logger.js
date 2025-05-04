/**
 * Test LLM Logger
 * Verze 0.3.8.7
 * 
 * Testovací skript pro demonstraci logování LLM API
 */

require('dotenv').config();
const LLMService = require('./llm-service');

// Zpracování argumentů příkazové řádky
const args = process.argv.slice(2);
const prompt = args[0] || 'Popiš mi, co je to AIMapa a jaké jsou její hlavní funkce.';
const provider = args[1] || process.env.LLM_PROVIDER || 'openai';
const model = args[2] || process.env.LLM_MODEL || null;

// Inicializace LLM Service s logováním
const llmService = new LLMService({
  provider,
  model,
  logToConsole: true,
  logToFile: true,
  logToSupabase: process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY,
  logLevel: 'debug',
  logPrompts: true,
  logResponses: true
});

// Testování LLM API s logováním
async function testLLMWithLogging() {
  try {
    console.log(`Testování ${provider} API s promptem: "${prompt}"`);
    console.log('Čekejte na odpověď...');
    
    const startTime = Date.now();
    
    // Získání odpovědi od LLM
    const response = await llmService.getCompletion({
      prompt,
      userId: 'test-user',
      conversationId: 'test-conversation'
    });
    
    const endTime = Date.now();
    
    console.log('\nOdpověď od LLM:');
    console.log('----------------');
    console.log(response.text);
    console.log('----------------');
    console.log(`Doba odezvy: ${endTime - startTime} ms`);
    
    if (response.usage) {
      console.log(`Počet tokenů: ${response.usage.total_tokens} (vstup: ${response.usage.prompt_tokens}, výstup: ${response.usage.completion_tokens})`);
    }
    
    // Získání statistik z loggeru
    const stats = llmService.logger.getStats();
    console.log('\nStatistiky logování:');
    console.log('-------------------');
    console.log(`Celkem požadavků: ${stats.totalRequests}`);
    console.log(`Celkem odpovědí: ${stats.totalResponses}`);
    console.log(`Celkem chyb: ${stats.totalErrors}`);
    console.log(`Celková cena: ${stats.totalCost.toFixed(6)} Kč`);
    console.log(`Průměrná latence: ${stats.averageLatency.toFixed(2)} ms`);
    console.log(`Celkem tokenů: ${stats.totalTokens}`);
    
    // Zobrazení cesty k logovacímu souboru
    console.log(`\nLogy jsou uloženy v souboru: ${llmService.logger.getLogFilePath()}`);
    
  } catch (error) {
    console.error('Chyba při testování LLM API:', error);
  }
}

// Spuštění testu
testLLMWithLogging();
