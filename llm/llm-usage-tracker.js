/**
 * LLM Usage Tracker
 * Verze 0.3.8.7
 * 
 * Sledování využití LLM a ukládání statistik do Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Vytvoření Supabase klienta
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// IMPORTANT: Regarding the 'cost' parameter for trackUsage:
// It is STRONGLY RECOMMENDED that the final cost calculation (including any margins or specific pricing logic
// as defined in docs/PRICING_MODEL.md) is handled authoritatively by the Supabase Edge Function 'llm-usage-tracker'.
// This Node.js backend function should ideally pass `cost: null` or `cost: baseProviderCost` to the Edge Function.
// The Edge Function would then be responsible for fetching the base cost if needed and applying all pricing rules.
// This ensures pricing consistency and centralizes the pricing logic.
/**
 * Sledování využití LLM
 * @param {Object} options - Možnosti
 * @param {string} options.provider - Poskytovatel LLM
 * @param {string} options.model - Model LLM
 * @param {number} options.inputTokens - Počet vstupních tokenů
 * @param {number} options.outputTokens - Počet výstupních tokenů
 * @param {number} options.latency - Latence v ms
 * @param {number} options.cost - Cena v USD
 * @param {string} options.userId - ID uživatele
 * @returns {Promise<Object>} Výsledek
 */
async function trackUsage(options) {
  try {
    const { provider, model, inputTokens, outputTokens, latency, cost, userId } = options;
    
    // Kontrola, zda jsou k dispozici všechny potřebné údaje
    if (!provider || !model || !inputTokens || !outputTokens) {
      throw new Error('Chybějící povinné parametry');
    }
    
    // Volání Supabase Edge Function pro sledování využití LLM
    const { data, error } = await supabase.functions.invoke('llm-usage-tracker', {
      body: {
        provider,
        model,
        inputTokens,
        outputTokens,
        latency,
        cost,
        userId
      }
    });
    
    if (error) {
      console.error('Chyba při sledování využití LLM:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Chyba při sledování využití LLM:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Získání statistik využití LLM
 * @param {Object} options - Možnosti
 * @param {string} options.userId - ID uživatele
 * @param {string} options.provider - Poskytovatel LLM (volitelné)
 * @param {string} options.model - Model LLM (volitelné)
 * @param {string} options.startDate - Počáteční datum (YYYY-MM-DD) (volitelné)
 * @param {string} options.endDate - Koncové datum (YYYY-MM-DD) (volitelné)
 * @returns {Promise<Object>} Statistiky využití
 */
async function getUsageStats(options) {
  try {
    const { userId, provider, model, startDate, endDate } = options;
    
    // Kontrola, zda je k dispozici ID uživatele
    if (!userId) {
      throw new Error('Chybějící ID uživatele');
    }
    
    // Vytvoření dotazu
    let query = supabase
      .from('llm_usage_stats')
      .select('*')
      .eq('user_id', userId);
    
    // Filtrování podle poskytovatele
    if (provider) {
      query = query.eq('provider', provider);
    }
    
    // Filtrování podle modelu
    if (model) {
      query = query.eq('model', model);
    }
    
    // Filtrování podle data
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    // Seřazení podle data (nejnovější první)
    query = query.order('date', { ascending: false });
    
    // Provedení dotazu
    const { data, error } = await query;
    
    if (error) {
      console.error('Chyba při získávání statistik využití LLM:', error);
      return { success: false, error };
    }
    
    // Zpracování výsledků
    const stats = {
      totalRequests: 0,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      totalCost: 0,
      byProvider: {},
      byModel: {},
      byDate: {}
    };
    
    // Zpracování statistik
    for (const record of data) {
      // Celkové statistiky
      stats.totalRequests += record.request_count;
      stats.totalInputTokens += record.input_tokens;
      stats.totalOutputTokens += record.output_tokens;
      stats.totalTokens += record.total_tokens;
      stats.totalCost += parseFloat(record.total_cost);
      
      // Statistiky podle poskytovatele
      if (!stats.byProvider[record.provider]) {
        stats.byProvider[record.provider] = {
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          cost: 0
        };
      }
      
      stats.byProvider[record.provider].requests += record.request_count;
      stats.byProvider[record.provider].inputTokens += record.input_tokens;
      stats.byProvider[record.provider].outputTokens += record.output_tokens;
      stats.byProvider[record.provider].totalTokens += record.total_tokens;
      stats.byProvider[record.provider].cost += parseFloat(record.total_cost);
      
      // Statistiky podle modelu
      const modelKey = `${record.provider}-${record.model}`;
      
      if (!stats.byModel[modelKey]) {
        stats.byModel[modelKey] = {
          provider: record.provider,
          model: record.model,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          cost: 0
        };
      }
      
      stats.byModel[modelKey].requests += record.request_count;
      stats.byModel[modelKey].inputTokens += record.input_tokens;
      stats.byModel[modelKey].outputTokens += record.output_tokens;
      stats.byModel[modelKey].totalTokens += record.total_tokens;
      stats.byModel[modelKey].cost += parseFloat(record.total_cost);
      
      // Statistiky podle data
      if (!stats.byDate[record.date]) {
        stats.byDate[record.date] = {
          date: record.date,
          requests: 0,
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          cost: 0
        };
      }
      
      stats.byDate[record.date].requests += record.request_count;
      stats.byDate[record.date].inputTokens += record.input_tokens;
      stats.byDate[record.date].outputTokens += record.output_tokens;
      stats.byDate[record.date].totalTokens += record.total_tokens;
      stats.byDate[record.date].cost += parseFloat(record.total_cost);
    }
    
    return { success: true, stats };
  } catch (error) {
    console.error('Chyba při získávání statistik využití LLM:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  trackUsage,
  getUsageStats
};
