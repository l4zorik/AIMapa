/**
 * LLM Logger
 * Verze 0.3.8.7
 * 
 * Modul pro logování komunikace s LLM API
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

/**
 * Třída pro logování komunikace s LLM API
 */
class LLMLogger {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {boolean} options.logToConsole - Zda logovat do konzole
   * @param {boolean} options.logToFile - Zda logovat do souboru
   * @param {boolean} options.logToSupabase - Zda logovat do Supabase
   * @param {string} options.logDir - Adresář pro ukládání logů
   * @param {string} options.logLevel - Úroveň logování ('debug', 'info', 'warn', 'error')
   * @param {boolean} options.logPrompts - Zda logovat celé prompty
   * @param {boolean} options.logResponses - Zda logovat celé odpovědi
   */
  constructor(options = {}) {
    this.options = {
      logToConsole: true,
      logToFile: true,
      logToSupabase: true,
      logDir: path.join(process.cwd(), 'logs'),
      logLevel: 'info',
      logPrompts: true,
      logResponses: true,
      ...options
    };
    
    // Inicializace Supabase klienta, pokud je povoleno logování do Supabase
    if (this.options.logToSupabase) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );
    }
    
    // Vytvoření adresáře pro logy, pokud neexistuje
    if (this.options.logToFile) {
      if (!fs.existsSync(this.options.logDir)) {
        fs.mkdirSync(this.options.logDir, { recursive: true });
      }
    }
    
    // Inicializace souboru pro logy
    this.logFile = path.join(this.options.logDir, `llm-api-${new Date().toISOString().split('T')[0]}.log`);
  }
  
  /**
   * Logování požadavku na LLM API
   * @param {Object} requestData - Data požadavku
   * @param {string} requestData.provider - Název poskytovatele API
   * @param {string} requestData.model - Název modelu
   * @param {string} requestData.prompt - Prompt odeslaný na API
   * @param {Object} requestData.options - Další možnosti požadavku
   * @param {string} requestData.userId - ID uživatele
   * @param {string} requestData.conversationId - ID konverzace
   * @returns {string} ID požadavku pro pozdější spárování s odpovědí
   */
  logRequest(requestData) {
    const requestId = this.generateRequestId();
    const timestamp = new Date().toISOString();
    
    const logData = {
      request_id: requestId,
      timestamp,
      type: 'request',
      provider: requestData.provider,
      model: requestData.model,
      user_id: requestData.userId || null,
      conversation_id: requestData.conversationId || null,
      prompt: this.options.logPrompts ? requestData.prompt : this.truncateText(requestData.prompt, 100),
      prompt_length: requestData.prompt.length,
      options: requestData.options || {}
    };
    
    // Logování do konzole
    if (this.options.logToConsole) {
      console.log(`[LLM-REQUEST] ${timestamp} | ${requestId} | ${requestData.provider} | ${requestData.model} | Prompt délka: ${requestData.prompt.length}`);
      if (this.options.logLevel === 'debug' && this.options.logPrompts) {
        console.log(`Prompt: ${requestData.prompt}`);
      }
    }
    
    // Logování do souboru
    if (this.options.logToFile) {
      this.appendToLogFile(logData);
    }
    
    // Logování do Supabase
    if (this.options.logToSupabase) {
      this.logToSupabase({
        ...logData,
        prompt: this.options.logPrompts ? requestData.prompt : this.truncateText(requestData.prompt, 500)
      });
    }
    
    return requestId;
  }
  
  /**
   * Logování odpovědi z LLM API
   * @param {Object} responseData - Data odpovědi
   * @param {string} responseData.requestId - ID požadavku
   * @param {string} responseData.provider - Název poskytovatele API
   * @param {string} responseData.model - Název modelu
   * @param {string} responseData.response - Odpověď z API
   * @param {Object} responseData.usage - Informace o využití tokenů
   * @param {number} responseData.latency - Doba odezvy v ms
   * @param {number} responseData.cost - Cena požadavku
   * @param {boolean} responseData.fromCache - Zda byla odpověď získána z cache
   * @param {string} responseData.userId - ID uživatele
   * @param {string} responseData.conversationId - ID konverzace
   */
  logResponse(responseData) {
    const timestamp = new Date().toISOString();
    
    const logData = {
      request_id: responseData.requestId,
      timestamp,
      type: 'response',
      provider: responseData.provider,
      model: responseData.model,
      user_id: responseData.userId || null,
      conversation_id: responseData.conversationId || null,
      response: this.options.logResponses ? responseData.response : this.truncateText(responseData.response, 100),
      response_length: responseData.response.length,
      usage: responseData.usage || {},
      latency: responseData.latency || 0,
      cost: responseData.cost || 0,
      from_cache: responseData.fromCache || false,
      error: responseData.error || null
    };
    
    // Logování do konzole
    if (this.options.logToConsole) {
      console.log(`[LLM-RESPONSE] ${timestamp} | ${responseData.requestId} | ${responseData.provider} | ${responseData.model} | Latence: ${logData.latency}ms | Cena: ${logData.cost.toFixed(6)} Kč | Tokeny: ${logData.usage.total_tokens || 'N/A'} | Cache: ${logData.from_cache}`);
      if (this.options.logLevel === 'debug' && this.options.logResponses) {
        console.log(`Odpověď: ${responseData.response}`);
      }
    }
    
    // Logování do souboru
    if (this.options.logToFile) {
      this.appendToLogFile(logData);
    }
    
    // Logování do Supabase
    if (this.options.logToSupabase) {
      this.logToSupabase({
        ...logData,
        response: this.options.logResponses ? responseData.response : this.truncateText(responseData.response, 500)
      });
    }
  }
  
  /**
   * Logování chyby při komunikaci s LLM API
   * @param {Object} errorData - Data chyby
   * @param {string} errorData.requestId - ID požadavku
   * @param {string} errorData.provider - Název poskytovatele API
   * @param {string} errorData.model - Název modelu
   * @param {Error} errorData.error - Objekt chyby
   * @param {string} errorData.userId - ID uživatele
   * @param {string} errorData.conversationId - ID konverzace
   */
  logError(errorData) {
    const timestamp = new Date().toISOString();
    
    const logData = {
      request_id: errorData.requestId,
      timestamp,
      type: 'error',
      provider: errorData.provider,
      model: errorData.model,
      user_id: errorData.userId || null,
      conversation_id: errorData.conversationId || null,
      error_message: errorData.error.message,
      error_stack: errorData.error.stack,
      error_code: errorData.error.code || null
    };
    
    // Logování do konzole
    if (this.options.logToConsole) {
      console.error(`[LLM-ERROR] ${timestamp} | ${errorData.requestId} | ${errorData.provider} | ${errorData.model} | Chyba: ${errorData.error.message}`);
      if (this.options.logLevel === 'debug') {
        console.error(errorData.error.stack);
      }
    }
    
    // Logování do souboru
    if (this.options.logToFile) {
      this.appendToLogFile(logData);
    }
    
    // Logování do Supabase
    if (this.options.logToSupabase) {
      this.logToSupabase(logData);
    }
  }
  
  /**
   * Přidání záznamu do logovacího souboru
   * @param {Object} logData - Data pro logování
   * @private
   */
  appendToLogFile(logData) {
    try {
      const logEntry = JSON.stringify(logData) + '\n';
      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Chyba při zápisu do logovacího souboru:', error);
    }
  }
  
  /**
   * Logování do Supabase
   * @param {Object} logData - Data pro logování
   * @private
   */
  async logToSupabase(logData) {
    try {
      const { error } = await this.supabase
        .from('llm_api_logs')
        .insert([logData]);
      
      if (error) {
        console.error('Chyba při ukládání logu do Supabase:', error);
      }
    } catch (error) {
      console.error('Chyba při logování do Supabase:', error);
    }
  }
  
  /**
   * Generování ID požadavku
   * @returns {string} ID požadavku
   * @private
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
  
  /**
   * Zkrácení textu na určitou délku
   * @param {string} text - Text k zkrácení
   * @param {number} maxLength - Maximální délka
   * @returns {string} Zkrácený text
   * @private
   */
  truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Získání cesty k aktuálnímu logovacímu souboru
   * @returns {string} Cesta k logovacímu souboru
   */
  getLogFilePath() {
    return this.logFile;
  }
  
  /**
   * Získání všech logů z aktuálního logovacího souboru
   * @returns {Array<Object>} Pole logů
   */
  getLogsFromFile() {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }
      
      const fileContent = fs.readFileSync(this.logFile, 'utf8');
      const logs = fileContent.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => JSON.parse(line));
      
      return logs;
    } catch (error) {
      console.error('Chyba při čtení logovacího souboru:', error);
      return [];
    }
  }
  
  /**
   * Získání statistik z logů
   * @returns {Object} Statistiky
   */
  getStats() {
    const logs = this.getLogsFromFile();
    
    const stats = {
      totalRequests: 0,
      totalResponses: 0,
      totalErrors: 0,
      totalCost: 0,
      averageLatency: 0,
      totalTokens: 0,
      byProvider: {},
      byModel: {}
    };
    
    // Zpracování logů
    logs.forEach(log => {
      if (log.type === 'request') {
        stats.totalRequests++;
      } else if (log.type === 'response') {
        stats.totalResponses++;
        stats.totalCost += log.cost || 0;
        stats.averageLatency += log.latency || 0;
        stats.totalTokens += (log.usage?.total_tokens || 0);
        
        // Statistiky podle poskytovatele
        if (!stats.byProvider[log.provider]) {
          stats.byProvider[log.provider] = {
            requests: 0,
            responses: 0,
            errors: 0,
            cost: 0,
            tokens: 0
          };
        }
        stats.byProvider[log.provider].responses++;
        stats.byProvider[log.provider].cost += log.cost || 0;
        stats.byProvider[log.provider].tokens += (log.usage?.total_tokens || 0);
        
        // Statistiky podle modelu
        if (!stats.byModel[log.model]) {
          stats.byModel[log.model] = {
            requests: 0,
            responses: 0,
            errors: 0,
            cost: 0,
            tokens: 0
          };
        }
        stats.byModel[log.model].responses++;
        stats.byModel[log.model].cost += log.cost || 0;
        stats.byModel[log.model].tokens += (log.usage?.total_tokens || 0);
      } else if (log.type === 'error') {
        stats.totalErrors++;
        
        // Statistiky podle poskytovatele
        if (!stats.byProvider[log.provider]) {
          stats.byProvider[log.provider] = {
            requests: 0,
            responses: 0,
            errors: 0,
            cost: 0,
            tokens: 0
          };
        }
        stats.byProvider[log.provider].errors++;
        
        // Statistiky podle modelu
        if (!stats.byModel[log.model]) {
          stats.byModel[log.model] = {
            requests: 0,
            responses: 0,
            errors: 0,
            cost: 0,
            tokens: 0
          };
        }
        stats.byModel[log.model].errors++;
      }
    });
    
    // Výpočet průměrné latence
    if (stats.totalResponses > 0) {
      stats.averageLatency = stats.averageLatency / stats.totalResponses;
    }
    
    return stats;
  }
}

module.exports = LLMLogger;
