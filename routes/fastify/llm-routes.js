/**
 * Fastify LLM Routes
 * Verze 0.3.8.7
 */

const redis = require('../../config/redis');

/**
 * LLM routes pro Fastify
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Možnosti
 * @param {Function} done - Callback
 */
async function routes(fastify, options, done) {
  // Schéma pro získání odpovědi od LLM
  const getCompletionSchema = {
    schema: {
      body: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: { type: 'string', minLength: 1 },
          conversationId: { type: 'string' },
          context: { 
            type: 'object',
            properties: {
              location: { type: 'string' },
              destination: { type: 'string' },
              transportMode: { type: 'string' },
              preferences: { type: 'string' }
            }
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            response: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                model: { type: 'string' },
                usage: {
                  type: 'object',
                  properties: {
                    prompt_tokens: { type: 'integer' },
                    completion_tokens: { type: 'integer' },
                    total_tokens: { type: 'integer' }
                  }
                },
                provider: { type: 'string' }
              }
            },
            cached: { type: 'boolean' }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  };
  
  // Získání odpovědi od LLM
  fastify.post('/completion', {
    ...getCompletionSchema,
    preHandler: fastify.auth([fastify.verifyJWT])
  }, async (request, reply) => {
    try {
      const { prompt, conversationId, context } = request.body;
      
      // Vytvoření klíče pro cache
      const contextString = context ? JSON.stringify(context) : '';
      const cacheKey = `llm:${prompt}:${contextString}`;
      
      // Pokus o získání odpovědi z cache
      const cachedResponse = await redis.get(cacheKey);
      
      if (cachedResponse) {
        return {
          success: true,
          response: JSON.parse(cachedResponse),
          cached: true
        };
      }
      
      // Získání ID uživatele
      const userId = request.user.sub;
      
      // Kontrola rate limitu
      const rateLimitKey = `ratelimit:llm:${userId}`;
      const currentRequests = await redis.incr(rateLimitKey);
      
      // Nastavení TTL pro rate limit, pokud ještě neexistuje
      if (currentRequests === 1) {
        await redis.expire(rateLimitKey, 60); // 60 sekund
      }
      
      // Kontrola, zda uživatel nepřekročil limit
      const rateLimit = 10; // 10 požadavků za minutu
      
      if (currentRequests > rateLimit) {
        return reply.code(429).send({
          success: false,
          error: 'Rate limit překročen. Zkuste to znovu za chvíli.'
        });
      }
      
      // Získání odpovědi od LLM
      // Toto je pouze ukázka, v reálné aplikaci by zde byl kód pro získání odpovědi od LLM
      const response = {
        text: `Toto je ukázková odpověď na prompt: "${prompt}"`,
        model: 'gpt-4',
        usage: {
          prompt_tokens: prompt.length / 4,
          completion_tokens: 50,
          total_tokens: prompt.length / 4 + 50
        },
        provider: 'openai'
      };
      
      // Uložení odpovědi do cache
      await redis.set(cacheKey, JSON.stringify(response), 3600); // TTL 1 hodina
      
      // Uložení konverzace do historie, pokud je k dispozici conversationId
      if (conversationId) {
        const historyKey = `llm:history:${userId}:${conversationId}`;
        const history = JSON.parse(await redis.get(historyKey) || '[]');
        
        history.push({
          role: 'user',
          content: prompt,
          timestamp: new Date().toISOString()
        });
        
        history.push({
          role: 'assistant',
          content: response.text,
          timestamp: new Date().toISOString(),
          model: response.model
        });
        
        await redis.set(historyKey, JSON.stringify(history), 86400 * 30); // TTL 30 dní
      }
      
      return {
        success: true,
        response,
        cached: false
      };
    } catch (error) {
      fastify.log.error(error);
      
      return reply.code(500).send({
        success: false,
        error: 'Chyba při získávání odpovědi od LLM'
      });
    }
  });
  
  // Schéma pro získání historie konverzací
  const getConversationHistorySchema = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          conversationId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            conversations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  messages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        role: { type: 'string' },
                        content: { type: 'string' },
                        timestamp: { type: 'string' },
                        model: { type: 'string' }
                      }
                    }
                  },
                  model: { type: 'string' },
                  updated_at: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  };
  
  // Získání historie konverzací
  fastify.get('/conversations', {
    ...getConversationHistorySchema,
    preHandler: fastify.auth([fastify.verifyJWT])
  }, async (request, reply) => {
    try {
      const { conversationId } = request.query;
      const userId = request.user.sub;
      
      if (conversationId) {
        // Získání konkrétní konverzace
        const historyKey = `llm:history:${userId}:${conversationId}`;
        const history = JSON.parse(await redis.get(historyKey) || '[]');
        
        return {
          success: true,
          conversations: [
            {
              id: conversationId,
              messages: history,
              model: 'gpt-4',
              updated_at: new Date().toISOString()
            }
          ]
        };
      } else {
        // Získání všech konverzací
        const keys = await redis.keys(`llm:history:${userId}:*`);
        const conversations = [];
        
        for (const key of keys) {
          const conversationId = key.split(':')[3];
          const history = JSON.parse(await redis.get(key) || '[]');
          
          if (history.length > 0) {
            conversations.push({
              id: conversationId,
              messages: history,
              model: 'gpt-4',
              updated_at: history[history.length - 1].timestamp
            });
          }
        }
        
        // Seřazení podle času aktualizace (nejnovější první)
        conversations.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        return {
          success: true,
          conversations
        };
      }
    } catch (error) {
      fastify.log.error(error);
      
      return reply.code(500).send({
        success: false,
        error: 'Chyba při získávání historie konverzací'
      });
    }
  });
  
  // Schéma pro smazání historie konverzací
  const deleteConversationHistorySchema = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          conversationId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        }
      }
    }
  };
  
  // Smazání historie konverzací
  fastify.delete('/conversations', {
    ...deleteConversationHistorySchema,
    preHandler: fastify.auth([fastify.verifyJWT])
  }, async (request, reply) => {
    try {
      const { conversationId } = request.query;
      const userId = request.user.sub;
      
      if (conversationId) {
        // Smazání konkrétní konverzace
        const historyKey = `llm:history:${userId}:${conversationId}`;
        await redis.del(historyKey);
      } else {
        // Smazání všech konverzací
        const keys = await redis.keys(`llm:history:${userId}:*`);
        
        for (const key of keys) {
          await redis.del(key);
        }
      }
      
      return {
        success: true
      };
    } catch (error) {
      fastify.log.error(error);
      
      return reply.code(500).send({
        success: false,
        error: 'Chyba při mazání historie konverzací'
      });
    }
  });
  
  done();
}

module.exports = routes;
