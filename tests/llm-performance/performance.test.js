/**
 * Test výkonu a cen LLM
 * Verze 0.3.8.7
 */

const fs = require('fs');
const path = require('path');
const { ChatOpenAI } = require('@langchain/openai');
const { ChatAnthropic } = require('@langchain/anthropic');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

// Poskytovatelé LLM
const openaiProvider = require('../../llm/providers/openai-provider');
const anthropicProvider = require('../../llm/providers/anthropic-provider');
const deepseekProvider = require('../../llm/providers/deepseek-provider');

// Testovací prompty
const prompts = [
  {
    name: 'Krátký dotaz',
    text: 'Jaké je hlavní město České republiky?'
  },
  {
    name: 'Středně dlouhý dotaz',
    text: 'Vysvětli, jak funguje fotosyntéza a proč je důležitá pro život na Zemi. Uveď hlavní kroky procesu a jeho význam pro ekosystém.'
  },
  {
    name: 'Dlouhý dotaz',
    text: 'Napiš podrobný přehled historie umělé inteligence od jejích počátků až po současnost. Zaměř se na klíčové milníky, významné osobnosti a technologické průlomy. Uveď také hlavní aplikace AI v různých odvětvích a diskutuj etické otázky spojené s jejím rozvojem.'
  },
  {
    name: 'Technický dotaz',
    text: 'Vysvětli, jak funguje algoritmus transformeru v kontextu jazykových modelů jako je GPT. Popiš jeho architekturu, mechanismus self-attention a jak se liší od předchozích přístupů jako jsou RNN a LSTM.'
  },
  {
    name: 'Kreativní dotaz',
    text: 'Napiš krátkou povídku o robotovi, který se učí porozumět lidským emocím. Povídka by měla mít zápletku, postavy a pointu.'
  }
];

// Modely k testování
const models = [
  {
    provider: 'openai',
    name: 'gpt-4',
    client: openaiProvider.createClient('gpt-4', 0.7, 1000),
    pricing: openaiProvider.getPricing('gpt-4')
  },
  {
    provider: 'openai',
    name: 'gpt-3.5-turbo',
    client: openaiProvider.createClient('gpt-3.5-turbo', 0.7, 1000),
    pricing: openaiProvider.getPricing('gpt-3.5-turbo')
  },
  {
    provider: 'anthropic',
    name: 'claude-3-opus-20240229',
    client: anthropicProvider.createClient('claude-3-opus-20240229', 0.7, 1000),
    pricing: anthropicProvider.getPricing('claude-3-opus-20240229')
  },
  {
    provider: 'anthropic',
    name: 'claude-3-sonnet-20240229',
    client: anthropicProvider.createClient('claude-3-sonnet-20240229', 0.7, 1000),
    pricing: anthropicProvider.getPricing('claude-3-sonnet-20240229')
  },
  {
    provider: 'anthropic',
    name: 'claude-3-haiku-20240307',
    client: anthropicProvider.createClient('claude-3-haiku-20240307', 0.7, 1000),
    pricing: anthropicProvider.getPricing('claude-3-haiku-20240307')
  },
  {
    provider: 'deepseek',
    name: 'deepseek-coder',
    client: deepseekProvider.createClient('deepseek-coder', 0.7, 1000),
    pricing: deepseekProvider.getPricing('deepseek-coder')
  }
];

/**
 * Odhad počtu tokenů v textu
 * @param {string} text - Text
 * @returns {number} Počet tokenů
 */
function estimateTokens(text) {
  // Přibližný odhad: 1 token = 4 znaky
  return Math.ceil(text.length / 4);
}

/**
 * Výpočet ceny
 * @param {number} inputTokens - Počet vstupních tokenů
 * @param {number} outputTokens - Počet výstupních tokenů
 * @param {Object} pricing - Ceník
 * @returns {number} Cena v USD
 */
function calculateCost(inputTokens, outputTokens, pricing) {
  return (inputTokens * pricing.input / 1000) + (outputTokens * pricing.output / 1000);
}

/**
 * Test výkonu a cen LLM
 */
async function testPerformance() {
  console.log('Testování výkonu a cen LLM...');

  try {
    const results = {};

    for (const model of models) {
      console.log(`Testování modelu ${model.name} od poskytovatele ${model.provider}...`);

      results[`${model.provider}-${model.name}`] = {
        provider: model.provider,
        model: model.name,
        prompts: {}
      };

      for (const prompt of prompts) {
        console.log(`  Testování promptu "${prompt.name}"...`);

        const messages = [
          new SystemMessage('Jsi užitečný asistent.'),
          new HumanMessage(prompt.text)
        ];

        const inputTokens = estimateTokens(prompt.text) + estimateTokens('Jsi užitečný asistent.');

        try {
          // Měření času
          const startTime = Date.now();
          const result = await model.client.invoke(messages);
          const endTime = Date.now();

          const latency = endTime - startTime;
          const outputTokens = estimateTokens(result.content);
          const cost = calculateCost(inputTokens, outputTokens, model.pricing);

          results[`${model.provider}-${model.name}`].prompts[prompt.name] = {
            latency,
            inputTokens,
            outputTokens,
            cost,
            tokensPerSecond: Math.round((inputTokens + outputTokens) / (latency / 1000))
          };

          console.log(`    Latence: ${latency} ms`);
          console.log(`    Vstupní tokeny: ~${inputTokens}`);
          console.log(`    Výstupní tokeny: ~${outputTokens}`);
          console.log(`    Cena: $${cost.toFixed(6)}`);
          console.log(`    Tokeny za sekundu: ~${results[`${model.provider}-${model.name}`].prompts[prompt.name].tokensPerSecond}`);
        } catch (error) {
          console.error(`    Chyba při testování: ${error.message}`);

          results[`${model.provider}-${model.name}`].prompts[prompt.name] = {
            error: error.message
          };
        }
      }

      // Výpočet průměrných hodnot
      const promptResults = Object.values(results[`${model.provider}-${model.name}`].prompts)
        .filter(result => !result.error);

      if (promptResults.length > 0) {
        results[`${model.provider}-${model.name}`].averageLatency =
          promptResults.reduce((sum, result) => sum + result.latency, 0) / promptResults.length;

        results[`${model.provider}-${model.name}`].averageCost =
          promptResults.reduce((sum, result) => sum + result.cost, 0) / promptResults.length;

        results[`${model.provider}-${model.name}`].averageTokensPerSecond =
          promptResults.reduce((sum, result) => sum + result.tokensPerSecond, 0) / promptResults.length;

        console.log(`  Průměrná latence: ${results[`${model.provider}-${model.name}`].averageLatency.toFixed(2)} ms`);
        console.log(`  Průměrná cena: $${results[`${model.provider}-${model.name}`].averageCost.toFixed(6)}`);
        console.log(`  Průměrné tokeny za sekundu: ~${Math.round(results[`${model.provider}-${model.name}`].averageTokensPerSecond)}`);
      }
    }

    // Uložení výsledků do souboru
    const resultsDir = path.resolve(__dirname, '../../reports');

    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const resultsPath = path.join(resultsDir, `llm-performance-${new Date().toISOString().replace(/:/g, '-')}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    console.log(`Výsledky uloženy do souboru: ${resultsPath}`);

    return {
      success: true,
      message: 'Test výkonu a cen LLM dokončen',
      results
    };
  } catch (error) {
    console.error('Test výkonu a cen LLM selhal:', error);

    return {
      success: false,
      message: error.message
    };
  }
}

// Spuštění testu, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  testPerformance().then(result => {
    console.log(JSON.stringify(result, null, 2));

    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = {
  testPerformance
};
