/**
 * Fastify Map Routes
 * Verze 0.3.8.7
 */

const redis = require('../../config/redis');

/**
 * Mapové routes pro Fastify
 * @param {Object} fastify - Fastify instance
 * @param {Object} options - Možnosti
 * @param {Function} done - Callback
 */
async function routes(fastify, options, done) {
  // Schéma pro získání mapových dlaždic
  const getTileSchema = {
    schema: {
      params: {
        type: 'object',
        required: ['z', 'x', 'y'],
        properties: {
          z: { type: 'integer', minimum: 0, maximum: 20 },
          x: { type: 'integer', minimum: 0 },
          y: { type: 'integer', minimum: 0 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            tile: { type: 'string' },
            cached: { type: 'boolean' }
          }
        }
      }
    }
  };
  
  // Získání mapové dlaždice
  fastify.get('/tile/:z/:x/:y', getTileSchema, async (request, reply) => {
    const { z, x, y } = request.params;
    const cacheKey = `tile:${z}:${x}:${y}`;
    
    // Pokus o získání dlaždice z cache
    const cachedTile = await redis.get(cacheKey);
    
    if (cachedTile) {
      return { tile: cachedTile, cached: true };
    }
    
    // Získání dlaždice z externího zdroje
    // Toto je pouze ukázka, v reálné aplikaci by zde byl kód pro získání dlaždice
    const tile = `Dlaždice pro z=${z}, x=${x}, y=${y}`;
    
    // Uložení dlaždice do cache
    await redis.set(cacheKey, tile, 86400); // TTL 24 hodin
    
    return { tile, cached: false };
  });
  
  // Schéma pro vyhledávání míst
  const searchPlacesSchema = {
    schema: {
      querystring: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string', minLength: 2 },
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 10 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  address: { type: 'string' },
                  lat: { type: 'number' },
                  lng: { type: 'number' },
                  type: { type: 'string' }
                }
              }
            },
            cached: { type: 'boolean' }
          }
        }
      }
    }
  };
  
  // Vyhledávání míst
  fastify.get('/search', searchPlacesSchema, async (request, reply) => {
    const { query, limit } = request.query;
    const cacheKey = `search:${query}:${limit}`;
    
    // Pokus o získání výsledků z cache
    const cachedResults = await redis.get(cacheKey);
    
    if (cachedResults) {
      return { results: JSON.parse(cachedResults), cached: true };
    }
    
    // Vyhledávání míst
    // TODO: Implement real search logic here, e.g., query database or external geocoding API
    // For demonstration, return filtered example places based on query substring match (case-insensitive)
    const examplePlaces = [
      {
        id: '1',
        name: 'Příklad místa 1',
        address: 'Příklad adresy 1',
        lat: 50.0755,
        lng: 14.4378,
        type: 'poi'
      },
      {
        id: '2',
        name: 'Příklad místa 2',
        address: 'Příklad adresy 2',
        lat: 50.0822,
        lng: 14.4231,
        type: 'poi'
      },
      {
        id: '3',
        name: 'Náměstí Republiky',
        address: 'Praha 1, Česká republika',
        lat: 50.08804,
        lng: 14.42076,
        type: 'square'
      },
      {
        id: '4',
        name: 'Karlův most',
        address: 'Praha 1, Česká republika',
        lat: 50.08645,
        lng: 14.41139,
        type: 'bridge'
      }
    ];
    const filteredResults = examplePlaces.filter(place =>
      place.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
    
    // Uložení výsledků do cache
    await redis.set(cacheKey, JSON.stringify(filteredResults), 3600); // TTL 1 hodina
    
    return { results: filteredResults, cached: false };
  });
  
  // Schéma pro získání trasy
  const getRouteSchema = {
    schema: {
      querystring: {
        type: 'object',
        required: ['from', 'to'],
        properties: {
          from: { 
            type: 'string',
            pattern: '^[0-9]+\\.[0-9]+,[0-9]+\\.[0-9]+$'
          },
          to: { 
            type: 'string',
            pattern: '^[0-9]+\\.[0-9]+,[0-9]+\\.[0-9]+$'
          },
          mode: { 
            type: 'string',
            enum: ['car', 'walk', 'bike', 'transit'],
            default: 'car'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            route: {
              type: 'object',
              properties: {
                distance: { type: 'number' },
                duration: { type: 'number' },
                geometry: { type: 'string' },
                steps: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      distance: { type: 'number' },
                      duration: { type: 'number' },
                      instruction: { type: 'string' },
                      type: { type: 'string' }
                    }
                  }
                }
              }
            },
            cached: { type: 'boolean' }
          }
        }
      }
    }
  };
  
  // Získání trasy
  fastify.get('/route', getRouteSchema, async (request, reply) => {
    const { from, to, mode } = request.query;
    const cacheKey = `route:${from}:${to}:${mode}`;
    
    // Pokus o získání trasy z cache
    const cachedRoute = await redis.get(cacheKey);
    
    if (cachedRoute) {
      return { route: JSON.parse(cachedRoute), cached: true };
    }
    
    // Získání trasy
    // Toto je pouze ukázka, v reálné aplikaci by zde byl kód pro získání trasy
    const route = {
      distance: 10500,
      duration: 1200,
      geometry: 'encoded_polyline_here',
      steps: [
        {
          distance: 500,
          duration: 60,
          instruction: 'Jeďte rovně',
          type: 'straight'
        },
        {
          distance: 200,
          duration: 30,
          instruction: 'Odbočte doprava',
          type: 'right'
        }
      ]
    };
    
    // Uložení trasy do cache
    await redis.set(cacheKey, JSON.stringify(route), 3600); // TTL 1 hodina
    
    return { route, cached: false };
  });
  
  done();
}

module.exports = routes;
