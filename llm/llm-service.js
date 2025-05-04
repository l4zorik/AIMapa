/**
 * LLM Service
 * Verze 0.3.8.7
 *
 * Hlavní třída pro práci s LLM API
 */

const OpenAIProvider = require('./llm-providers/openai-provider');
const AnthropicProvider = require('./llm-providers/anthropic-provider');
const CohereProvider = require('./llm-providers/cohere-provider');
const GeminiProvider = require('./llm-providers/gemini-provider');
const LLMCache = require('./llm-cache');
const LLMContext = require('./llm-context');
const LLMLogger = require('./llm-logger');

/**
 * Třída pro práci s LLM API
 */
class LLMService {
  /**
   * Konstruktor
   * @param {Object} options - Konfigurační objekt
   * @param {string} options.provider - Název providera ('openai', 'anthropic', 'cohere')
   * @param {string} options.apiKey - API klíč pro daného providera
   * @param {string} options.model - Název modelu
   * @param {number} options.temperature - Teplota (0.0 - 1.0)
   * @param {number} options.maxTokens - Maximální počet tokenů
   * @param {boolean} options.cache - Zda používat cache
   * @param {number} options.cacheExpiration - Doba platnosti cache v sekundách
   */
  constructor(options = {}) {
    this.provider = options.provider || process.env.LLM_PROVIDER || 'openai';
    this.apiKey = options.apiKey || this.getApiKeyForProvider(this.provider);
    this.model = options.model || process.env.LLM_MODEL || this.getDefaultModelForProvider(this.provider);
    this.temperature = options.temperature || parseFloat(process.env.LLM_TEMPERATURE || '0.7');
    this.maxTokens = options.maxTokens || parseInt(process.env.LLM_MAX_TOKENS || '1000');

    // Inicializace cache, pokud je povolena
    const cacheEnabled = options.cache !== undefined ? options.cache : (process.env.LLM_CACHE_ENABLED === 'true');
    if (cacheEnabled) {
      const cacheExpiration = options.cacheExpiration || parseInt(process.env.LLM_CACHE_EXPIRATION || '3600');
      this.cache = new LLMCache({ expiration: cacheExpiration });
    }

    // Inicializace kontextového vyhledávání
    this.context = new LLMContext();

    // Inicializace loggeru
    this.logger = new LLMLogger({
      logToConsole: options.logToConsole !== undefined ? options.logToConsole : true,
      logToFile: options.logToFile !== undefined ? options.logToFile : true,
      logToSupabase: options.logToSupabase !== undefined ? options.logToSupabase : true,
      logLevel: options.logLevel || process.env.LLM_LOG_LEVEL || 'info',
      logPrompts: options.logPrompts !== undefined ? options.logPrompts : (process.env.LLM_LOG_PROMPTS === 'true'),
      logResponses: options.logResponses !== undefined ? options.logResponses : (process.env.LLM_LOG_RESPONSES === 'true')
    });

    // Inicializace providera
    this.initProvider();

    console.log(`LLM Service inicializován s providerem ${this.provider} a modelem ${this.model}`);
  }

  /**
   * Inicializace providera
   * @private
   */
  initProvider() {
    switch (this.provider.toLowerCase()) {
      case 'openai':
        this.llmProvider = new OpenAIProvider({
          apiKey: this.apiKey,
          model: this.model,
          temperature: this.temperature,
          maxTokens: this.maxTokens
        });
        break;
      case 'anthropic':
        this.llmProvider = new AnthropicProvider({
          apiKey: this.apiKey,
          model: this.model,
          temperature: this.temperature,
          maxTokens: this.maxTokens
        });
        break;
      case 'cohere':
        this.llmProvider = new CohereProvider({
          apiKey: this.apiKey,
          model: this.model,
          temperature: this.temperature,
          maxTokens: this.maxTokens
        });
        break;
      case 'gemini':
        this.llmProvider = new GeminiProvider({
          apiKey: this.apiKey,
          model: this.model,
          temperature: this.temperature,
          maxTokens: this.maxTokens
        });
        break;
      default:
        throw new Error(`Nepodporovaný provider: ${this.provider}`);
    }
  }

  /**
   * Získání API klíče pro daného providera
   * @param {string} provider - Název providera
   * @returns {string} API klíč
   * @private
   */
  getApiKeyForProvider(provider) {
    switch (provider.toLowerCase()) {
      case 'openai':
        return process.env.OPENAI_API_KEY;
      case 'anthropic':
        return process.env.ANTHROPIC_API_KEY;
      case 'cohere':
        return process.env.COHERE_API_KEY;
      case 'gemini':
        return process.env.GEMINI_API_KEY;
      default:
        throw new Error(`Nepodporovaný provider: ${provider}`);
    }
  }

  /**
   * Získání výchozího modelu pro daného providera
   * @param {string} provider - Název providera
   * @returns {string} Název modelu
   * @private
   */
  getDefaultModelForProvider(provider) {
    switch (provider.toLowerCase()) {
      case 'openai':
        return 'gpt-4';
      case 'anthropic':
        return 'claude-3-opus-20240229';
      case 'cohere':
        return 'command-r';
      case 'gemini':
        return 'gemini-1.5-flash';
      default:
        throw new Error(`Nepodporovaný provider: ${provider}`);
    }
  }

  /**
   * Získání odpovědi od LLM
   * @param {Object} options - Konfigurační objekt
   * @param {string} options.prompt - Prompt pro LLM
   * @param {string} options.userId - ID uživatele
   * @param {string} options.conversationId - ID konverzace
   * @param {Object} options.context - Kontext pro LLM
   * @returns {Promise<Object>} Odpověď od LLM
   */
  async getCompletion(options = {}) {
    const startTime = Date.now();
    let requestId = null;

    try {
      const { prompt, userId, conversationId, context } = options;

      if (!prompt) {
        throw new Error('Prompt je povinný');
      }

      // Logování požadavku
      requestId = this.logger.logRequest({
        provider: this.provider,
        model: this.model,
        prompt,
        options: {
          temperature: this.temperature,
          maxTokens: this.maxTokens,
          context: context ? true : false
        },
        userId,
        conversationId
      });

      // Kontrola, zda je k dispozici cache a zda je v ní odpověď
      if (this.cache) {
        const cacheKey = this.getCacheKey(prompt, userId, conversationId, context);
        const cachedResponse = await this.cache.get(cacheKey);

        if (cachedResponse) {
          // Logování odpovědi z cache
          this.logger.logResponse({
            requestId,
            provider: this.provider,
            model: this.model,
            response: cachedResponse.text,
            usage: cachedResponse.usage,
            latency: Date.now() - startTime,
            cost: 0, // Z cache je zdarma
            fromCache: true,
            userId,
            conversationId
          });

          return cachedResponse;
        }
      }

      // Získání relevantního kontextu
      let enhancedPrompt = prompt;
      if (context) {
        const relevantContext = await this.context.getRelevantContext(prompt, context);
        if (relevantContext) {
          enhancedPrompt = `${relevantContext}\n\n${prompt}`;
        }
      }

      // Získání odpovědi od providera
      const response = await this.llmProvider.getCompletion(enhancedPrompt);

      // Výpočet ceny požadavku (zjednodušený odhad)
      const cost = this.estimateRequestCost(enhancedPrompt.length, response.text.length);

      // Logování odpovědi
      this.logger.logResponse({
        requestId,
        provider: this.provider,
        model: this.model,
        response: response.text,
        usage: response.usage,
        latency: Date.now() - startTime,
        cost,
        fromCache: false,
        userId,
        conversationId
      });

      // Uložení odpovědi do cache, pokud je k dispozici
      if (this.cache) {
        const cacheKey = this.getCacheKey(prompt, userId, conversationId, context);
        await this.cache.set(cacheKey, response);
      }

      // Uložení konverzace do historie, pokud je k dispozici userId a conversationId
      if (userId && conversationId) {
        await this.saveConversation(userId, conversationId, prompt, response.text);
      }

      return response;
    } catch (error) {
      // Logování chyby
      if (requestId) {
        this.logger.logError({
          requestId,
          provider: this.provider,
          model: this.model,
          error,
          userId: options.userId,
          conversationId: options.conversationId
        });
      }

      console.error('Chyba při získávání odpovědi od LLM:', error);
      throw error;
    }
  }

  /**
   * Odhad ceny požadavku
   * @param {number} promptLength - Délka promptu
   * @param {number} responseLength - Délka odpovědi
   * @returns {number} Odhadovaná cena v Kč
   * @private
   */
  estimateRequestCost(promptLength, responseLength) {
    // Zjednodušený odhad ceny podle délky promptu a odpovědi
    // V reálné implementaci by se použily přesnější výpočty podle počtu tokenů a aktuálních cen

    // Přibližný počet tokenů (1 token ~ 4 znaky)
    const promptTokens = Math.ceil(promptLength / 4);
    const responseTokens = Math.ceil(responseLength / 4);

    // Ceny za 1000 tokenů v Kč (zjednodušené)
    let inputPrice = 0;
    let outputPrice = 0;

    switch (this.provider) {
      case 'openai':
        if (this.model.includes('gpt-4')) {
          inputPrice = 0.03;
          outputPrice = 0.06;
        } else {
          inputPrice = 0.01;
          outputPrice = 0.02;
        }
        break;
      case 'anthropic':
        if (this.model.includes('opus')) {
          inputPrice = 0.04;
          outputPrice = 0.08;
        } else if (this.model.includes('sonnet')) {
          inputPrice = 0.02;
          outputPrice = 0.04;
        } else {
          inputPrice = 0.01;
          outputPrice = 0.02;
        }
        break;
      case 'cohere':
        inputPrice = 0.01;
        outputPrice = 0.02;
        break;
      case 'gemini':
        if (this.model.includes('2.5-pro')) {
          inputPrice = 0.003; // Přibližná cena v Kč za 1K tokenů
          outputPrice = 0.008;
        } else if (this.model.includes('1.5-pro')) {
          inputPrice = 0.002;
          outputPrice = 0.006;
        } else {
          // Gemini 1.5 Flash a 2.5 Flash
          inputPrice = 0.001;
          outputPrice = 0.003;
        }
        break;
      default:
        inputPrice = 0.02;
        outputPrice = 0.04;
    }

    // Výpočet ceny
    const promptCost = (promptTokens / 1000) * inputPrice;
    const responseCost = (responseTokens / 1000) * outputPrice;

    return promptCost + responseCost;
  }

  /**
   * Získání klíče pro cache
   * @param {string} prompt - Prompt pro LLM
   * @param {string} userId - ID uživatele
   * @param {string} conversationId - ID konverzace
   * @param {Object} context - Kontext pro LLM
   * @returns {string} Klíč pro cache
   * @private
   */
  getCacheKey(prompt, userId, conversationId, context) {
    const contextString = context ? JSON.stringify(context) : '';
    return `${this.provider}:${this.model}:${userId || 'anonymous'}:${conversationId || 'none'}:${prompt}:${contextString}`;
  }

  /**
   * Uložení konverzace do historie
   * @param {string} userId - ID uživatele
   * @param {string} conversationId - ID konverzace
   * @param {string} prompt - Prompt pro LLM
   * @param {string} response - Odpověď od LLM
   * @returns {Promise<void>}
   * @private
   */
  async saveConversation(userId, conversationId, prompt, response) {
    try {
      // Zde by byla implementace ukládání konverzace do databáze
      // Například do Supabase
      console.log(`Ukládání konverzace pro uživatele ${userId} a konverzaci ${conversationId}`);

      // Příklad implementace s Supabase
      /*
      const { error } = await this.supabaseClient
        .from('conversations')
        .insert([
          {
            user_id: userId,
            conversation_id: conversationId,
            prompt,
            response,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      */
    } catch (error) {
      console.error('Chyba při ukládání konverzace:', error);
      // Nebudeme propagovat chybu dále, aby to neovlivnilo hlavní funkcionalitu
    }
  }

  /**
   * Získání historie konverzací pro uživatele
   * @param {string} userId - ID uživatele
   * @param {string} conversationId - ID konverzace (volitelné)
   * @returns {Promise<Array>} Historie konverzací
   */
  async getConversationHistory(userId, conversationId = null) {
    try {
      if (!userId) {
        throw new Error('ID uživatele je povinné');
      }

      // Zde by byla implementace získání historie konverzací z databáze
      // Například z Supabase
      console.log(`Získávání historie konverzací pro uživatele ${userId}${conversationId ? ` a konverzaci ${conversationId}` : ''}`);

      // Příklad implementace s Supabase
      /*
      let query = this.supabaseClient
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
      */

      // Prozatím vrátíme prázdné pole
      return [];
    } catch (error) {
      console.error('Chyba při získávání historie konverzací:', error);
      throw error;
    }
  }

  /**
   * Smazání historie konverzací pro uživatele
   * @param {string} userId - ID uživatele
   * @param {string} conversationId - ID konverzace (volitelné)
   * @returns {Promise<void>}
   */
  async deleteConversationHistory(userId, conversationId = null) {
    try {
      if (!userId) {
        throw new Error('ID uživatele je povinné');
      }

      // Zde by byla implementace smazání historie konverzací z databáze
      // Například z Supabase
      console.log(`Mazání historie konverzací pro uživatele ${userId}${conversationId ? ` a konverzaci ${conversationId}` : ''}`);

      // Příklad implementace s Supabase
      /*
      let query = this.supabaseClient
        .from('conversations')
        .delete()
        .eq('user_id', userId);

      if (conversationId) {
        query = query.eq('conversation_id', conversationId);
      }

      const { error } = await query;

      if (error) throw error;
      */
    } catch (error) {
      console.error('Chyba při mazání historie konverzací:', error);
      throw error;
    }
  }

  /**
   * Získání informací o dostupných modelech
   * @returns {Promise<Array>} Informace o dostupných modelech
   */
  async getAvailableModels() {
    try {
      return await this.llmProvider.getAvailableModels();
    } catch (error) {
      console.error('Chyba při získávání informací o dostupných modelech:', error);
      throw error;
    }
  }

  /**
   * Získání informací o aktuálním modelu
   * @returns {Object} Informace o aktuálním modelu
   */
  getModelInfo() {
    return {
      provider: this.provider,
      model: this.model,
      temperature: this.temperature,
      maxTokens: this.maxTokens
    };
  }

  /**
   * Změna modelu
   * @param {string} model - Název modelu
   * @returns {void}
   */
  setModel(model) {
    this.model = model;
    this.initProvider();
  }

  /**
   * Změna teploty
   * @param {number} temperature - Teplota (0.0 - 1.0)
   * @returns {void}
   */
  setTemperature(temperature) {
    this.temperature = temperature;
    this.initProvider();
  }

  /**
   * Změna maximálního počtu tokenů
   * @param {number} maxTokens - Maximální počet tokenů
   * @returns {void}
   */
  setMaxTokens(maxTokens) {
    this.maxTokens = maxTokens;
    this.initProvider();
  }

  /**
   * Změna providera
   * @param {string} provider - Název providera
   * @param {string} apiKey - API klíč pro daného providera
   * @returns {void}
   */
  setProvider(provider, apiKey = null) {
    this.provider = provider;
    this.apiKey = apiKey || this.getApiKeyForProvider(provider);
    this.model = this.getDefaultModelForProvider(provider);
    this.initProvider();
  }
}

module.exports = LLMService;
