/**
 * Fastify server
 * Verze 0.3.8.7
 *
 * Tento server běží vedle Express serveru a poskytuje rychlejší API endpointy
 */

require('dotenv').config();
const fastify = require('fastify')({
  logger: process.env.NODE_ENV !== 'production'
});
const cors = require('@fastify/cors');
const helmet = require('@fastify/helmet');
const redis = require('./config/redis');

// Registrace pluginů
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
});

fastify.register(helmet, {
  contentSecurityPolicy: false
});

// Zdravotní endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API verze
fastify.get('/api/version', async (request, reply) => {
  return { version: '0.3.8.7', engine: 'fastify' };
});

// Registrace API routes
fastify.register(require('./routes/fastify/map-routes'), { prefix: '/api/map' });
fastify.register(require('./routes/fastify/llm-routes'), { prefix: '/api/llm' });

// Middleware pro rate limiting
fastify.register(require('./middleware/fastify/rate-limiter'));

// Middleware pro autentizaci
fastify.register(require('./middleware/fastify/auth'));

// Dekorátor pro Redis
fastify.decorateRequest('redis', {
  getter: () => redis
});

// Spuštění serveru
const start = async () => {
  try {
    await fastify.listen({
      port: process.env.FASTIFY_PORT || 3002,
      host: '0.0.0.0'
    });
    console.log(`Fastify server běží na portu ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Zpracování ukončení
process.on('SIGINT', async () => {
  console.log('Ukončuji Fastify server...');
  await fastify.close();
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Ukončuji Fastify server...');
  await fastify.close();
  await redis.quit();
  process.exit(0);
});

// Spuštění serveru, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  start();
}

module.exports = { fastify, start };
