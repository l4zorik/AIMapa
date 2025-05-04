/**
 * LLM Routes
 * Verze 0.3.8.7
 * 
 * Express routy pro LLM API
 */

const express = require('express');

/**
 * Vytvoření Express router pro LLM API
 * @param {Object} llmService - Instance LLM Service
 * @param {Object} auth0Service - Instance Auth0 Service
 * @returns {Object} Express router
 */
function createLLMRoutes(llmService, auth0Service) {
  const router = express.Router();
  
  /**
   * Middleware pro rate limiting
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next
   */
  const rateLimiter = (req, res, next) => {
    // Zde by byla implementace rate limitingu
    // V reálné aplikaci by zde byla sofistikovanější implementace
    
    // Prozatím povolíme všechny požadavky
    next();
  };
  
  /**
   * Middleware pro kontrolu API klíče
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next
   */
  const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    // Zde by byla implementace kontroly API klíče
    // V reálné aplikaci by zde byla sofistikovanější implementace
    
    // Prozatím povolíme všechny požadavky
    next();
  };
  
  /**
   * GET /api/llm/models
   * Získání dostupných modelů
   */
  router.get('/models', auth0Service.requireAuth(), async (req, res) => {
    try {
      const models = await llmService.getAvailableModels();
      
      res.json({
        success: true,
        models
      });
    } catch (error) {
      console.error('Chyba při získávání dostupných modelů:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * GET /api/llm/model
   * Získání informací o aktuálním modelu
   */
  router.get('/model', auth0Service.requireAuth(), (req, res) => {
    try {
      const modelInfo = llmService.getModelInfo();
      
      res.json({
        success: true,
        model: modelInfo
      });
    } catch (error) {
      console.error('Chyba při získávání informací o aktuálním modelu:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * POST /api/llm/completion
   * Získání odpovědi od LLM
   */
  router.post('/completion', auth0Service.requireAuth(), rateLimiter, async (req, res) => {
    try {
      const { prompt, context } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: 'Prompt je povinný'
        });
      }
      
      // Získání ID uživatele a konverzace
      const userId = req.oidc.user.sub;
      const conversationId = req.body.conversationId || null;
      
      // Získání odpovědi od LLM
      const response = await llmService.getCompletion({
        prompt,
        userId,
        conversationId,
        context
      });
      
      res.json({
        success: true,
        response
      });
    } catch (error) {
      console.error('Chyba při získávání odpovědi od LLM:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * POST /api/llm/completion/public
   * Získání odpovědi od LLM bez autentizace (s API klíčem)
   */
  router.post('/completion/public', apiKeyAuth, rateLimiter, async (req, res) => {
    try {
      const { prompt, context } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          success: false,
          error: 'Prompt je povinný'
        });
      }
      
      // Získání odpovědi od LLM
      const response = await llmService.getCompletion({
        prompt,
        context
      });
      
      res.json({
        success: true,
        response
      });
    } catch (error) {
      console.error('Chyba při získávání odpovědi od LLM:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * GET /api/llm/conversations
   * Získání historie konverzací pro uživatele
   */
  router.get('/conversations', auth0Service.requireAuth(), async (req, res) => {
    try {
      const userId = req.oidc.user.sub;
      const conversationId = req.query.conversationId || null;
      
      const conversations = await llmService.getConversationHistory(userId, conversationId);
      
      res.json({
        success: true,
        conversations
      });
    } catch (error) {
      console.error('Chyba při získávání historie konverzací:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * DELETE /api/llm/conversations
   * Smazání historie konverzací pro uživatele
   */
  router.delete('/conversations', auth0Service.requireAuth(), async (req, res) => {
    try {
      const userId = req.oidc.user.sub;
      const conversationId = req.query.conversationId || null;
      
      await llmService.deleteConversationHistory(userId, conversationId);
      
      res.json({
        success: true
      });
    } catch (error) {
      console.error('Chyba při mazání historie konverzací:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * POST /api/llm/model
   * Změna modelu
   */
  router.post('/model', auth0Service.requireAuth(), auth0Service.requireRole('admin'), async (req, res) => {
    try {
      const { model } = req.body;
      
      if (!model) {
        return res.status(400).json({
          success: false,
          error: 'Model je povinný'
        });
      }
      
      llmService.setModel(model);
      
      res.json({
        success: true,
        model: llmService.getModelInfo()
      });
    } catch (error) {
      console.error('Chyba při změně modelu:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * POST /api/llm/provider
   * Změna providera
   */
  router.post('/provider', auth0Service.requireAuth(), auth0Service.requireRole('admin'), async (req, res) => {
    try {
      const { provider, apiKey } = req.body;
      
      if (!provider) {
        return res.status(400).json({
          success: false,
          error: 'Provider je povinný'
        });
      }
      
      llmService.setProvider(provider, apiKey);
      
      res.json({
        success: true,
        model: llmService.getModelInfo()
      });
    } catch (error) {
      console.error('Chyba při změně providera:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * GET /api/llm/cache/stats
   * Získání statistik cache
   */
  router.get('/cache/stats', auth0Service.requireAuth(), auth0Service.requireRole('admin'), (req, res) => {
    try {
      if (!llmService.cache) {
        return res.status(404).json({
          success: false,
          error: 'Cache není k dispozici'
        });
      }
      
      const stats = llmService.cache.getStats();
      
      res.json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Chyba při získávání statistik cache:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  /**
   * DELETE /api/llm/cache
   * Vyčištění cache
   */
  router.delete('/cache', auth0Service.requireAuth(), auth0Service.requireRole('admin'), async (req, res) => {
    try {
      if (!llmService.cache) {
        return res.status(404).json({
          success: false,
          error: 'Cache není k dispozici'
        });
      }
      
      await llmService.cache.clear();
      
      res.json({
        success: true
      });
    } catch (error) {
      console.error('Chyba při čištění cache:', error);
      
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });
  
  return router;
}

module.exports = createLLMRoutes;
