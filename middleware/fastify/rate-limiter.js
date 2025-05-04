/**
 * Fastify Rate Limiter Middleware
 * Verze 0.3.8.7
 */

const redis = require('../../config/redis');

/**
 * Rate limiter middleware pro Fastify
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Možnosti
 * @param {Function} done - Callback
 */
async function rateLimiter(fastify, options, done) {
  // Dekorátor pro rate limiting
  fastify.decorate('rateLimit', (opts = {}) => {
    const {
      max = 100,
      timeWindow = 60 * 1000,
      keyGenerator = (request) => request.ip,
      errorMessage = 'Rate limit překročen. Zkuste to znovu za chvíli.'
    } = opts;
    
    return async (request, reply) => {
      try {
        // Generování klíče
        const key = `ratelimit:${keyGenerator(request)}`;
        
        // Inkrementace počítadla
        const current = await redis.incr(key);
        
        // Nastavení TTL, pokud ještě neexistuje
        if (current === 1) {
          await redis.expire(key, Math.floor(timeWindow / 1000));
        }
        
        // Nastavení hlaviček
        reply.header('X-RateLimit-Limit', max);
        reply.header('X-RateLimit-Remaining', Math.max(0, max - current));
        
        // Získání TTL
        const ttl = await redis.ttl(key);
        reply.header('X-RateLimit-Reset', ttl);
        
        // Kontrola, zda nebyl překročen limit
        if (current > max) {
          return reply.code(429).send({
            success: false,
            error: errorMessage
          });
        }
        
        return;
      } catch (error) {
        fastify.log.error(error);
        
        // V případě chyby pokračujeme dál
        return;
      }
    };
  });
  
  // Globální rate limiter
  fastify.addHook('onRequest', fastify.rateLimit({
    max: 1000,
    timeWindow: 60 * 1000,
    keyGenerator: (request) => {
      // Pokud je uživatel přihlášen, použijeme jeho ID, jinak IP adresu
      return request.user ? request.user.sub : request.ip;
    }
  }));
  
  done();
}

module.exports = rateLimiter;
