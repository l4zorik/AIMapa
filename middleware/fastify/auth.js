/**
 * Fastify Auth Middleware
 * Verze 0.3.8.7
 */

const jwt = require('jsonwebtoken');
const redis = require('../../config/redis');

/**
 * Autentizační middleware pro Fastify
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Možnosti
 * @param {Function} done - Callback
 */
async function auth(fastify, options, done) {
  // Dekorátor pro ověření JWT
  fastify.decorate('verifyJWT', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Chybí autorizační token');
      }
      
      const token = authHeader.split(' ')[1];
      
      // Kontrola, zda token není na blacklistu
      const isBlacklisted = await redis.exists(`token:blacklist:${token}`);
      
      if (isBlacklisted) {
        throw new Error('Token je neplatný');
      }
      
      // Ověření tokenu
      const decoded = jwt.verify(token, process.env.AUTH0_CLIENT_SECRET, {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`
      });
      
      // Uložení informací o uživateli do requestu
      request.user = decoded;
      
      return;
    } catch (error) {
      reply.code(401).send({
        success: false,
        error: 'Neautorizovaný přístup'
      });
      
      return;
    }
  });
  
  // Dekorátor pro ověření role
  fastify.decorate('verifyRole', (role) => {
    return async (request, reply) => {
      try {
        // Kontrola, zda je uživatel přihlášen
        if (!request.user) {
          throw new Error('Uživatel není přihlášen');
        }
        
        // Kontrola, zda má uživatel požadovanou roli
        const roles = request.user.permissions || [];
        
        if (!roles.includes(`role:${role}`)) {
          throw new Error(`Uživatel nemá roli ${role}`);
        }
        
        return;
      } catch (error) {
        reply.code(403).send({
          success: false,
          error: 'Přístup odepřen'
        });
        
        return;
      }
    };
  });
  
  // Dekorátor pro ověření vlastnictví
  fastify.decorate('verifyOwnership', (resource, getOwnerId) => {
    return async (request, reply) => {
      try {
        // Kontrola, zda je uživatel přihlášen
        if (!request.user) {
          throw new Error('Uživatel není přihlášen');
        }
        
        // Získání ID vlastníka
        const ownerId = await getOwnerId(request);
        
        // Kontrola, zda je uživatel vlastníkem
        if (ownerId !== request.user.sub) {
          throw new Error(`Uživatel není vlastníkem ${resource}`);
        }
        
        return;
      } catch (error) {
        reply.code(403).send({
          success: false,
          error: 'Přístup odepřen'
        });
        
        return;
      }
    };
  });
  
  // Registrace autentizačního pluginu
  fastify.register(require('@fastify/auth'));
  
  done();
}

module.exports = auth;
