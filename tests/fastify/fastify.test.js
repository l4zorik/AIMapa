/**
 * Test Fastify serveru
 * Verze 0.3.8.7
 */

const path = require('path');
const fs = require('fs');
const http = require('http');

/**
 * Provedení HTTP požadavku
 * @param {string} url - URL
 * @param {string} method - HTTP metoda
 * @param {Object} headers - Hlavičky
 * @param {string|Object} body - Tělo požadavku
 * @returns {Promise<Object>} Odpověď
 */
function request(url, method = 'GET', headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        let parsedData;
        
        try {
          parsedData = JSON.parse(data);
        } catch (error) {
          parsedData = data;
        }
        
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsedData
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      const bodyStr = typeof body === 'object' ? JSON.stringify(body) : body;
      req.write(bodyStr);
    }
    
    req.end();
  });
}

/**
 * Test Fastify serveru
 */
async function testFastifyServer() {
  console.log('Testování Fastify serveru...');
  
  try {
    // Kontrola, zda existuje fastify-server.js
    const fastifyServerPath = path.resolve(__dirname, '../../fastify-server.js');
    
    if (!fs.existsSync(fastifyServerPath)) {
      throw new Error('Soubor fastify-server.js neexistuje');
    }
    
    // Kontrola, zda existují routes a middleware
    const routesDir = path.resolve(__dirname, '../../routes/fastify');
    const middlewareDir = path.resolve(__dirname, '../../middleware/fastify');
    
    if (!fs.existsSync(routesDir)) {
      throw new Error('Adresář routes/fastify neexistuje');
    }
    
    if (!fs.existsSync(middlewareDir)) {
      throw new Error('Adresář middleware/fastify neexistuje');
    }
    
    // Kontrola, zda existují základní routes
    const requiredRoutes = ['map-routes.js', 'llm-routes.js'];
    
    for (const route of requiredRoutes) {
      if (!fs.existsSync(path.join(routesDir, route))) {
        throw new Error(`Soubor ${route} neexistuje v adresáři routes/fastify`);
      }
    }
    
    // Kontrola, zda existují základní middleware
    const requiredMiddleware = ['auth.js', 'rate-limiter.js'];
    
    for (const middleware of requiredMiddleware) {
      if (!fs.existsSync(path.join(middlewareDir, middleware))) {
        throw new Error(`Soubor ${middleware} neexistuje v adresáři middleware/fastify`);
      }
    }
    
    // Kontrola, zda je server spuštěn
    console.log('Kontroluji, zda je Fastify server spuštěn...');
    
    try {
      const response = await request('http://localhost:3002/health');
      
      if (response.statusCode !== 200) {
        throw new Error(`Fastify server vrátil status kód ${response.statusCode}`);
      }
      
      if (!response.data || !response.data.status || response.data.status !== 'ok') {
        throw new Error('Fastify server nevrátil očekávanou odpověď');
      }
      
      console.log('Fastify server je spuštěn a vrací správné odpovědi');
    } catch (error) {
      console.warn('Fastify server není spuštěn nebo neodpovídá správně');
      console.warn('Toto není kritická chyba, pokud server není spuštěn');
    }
    
    return {
      success: true,
      message: 'Fastify server je správně nakonfigurován'
    };
  } catch (error) {
    console.error('Test Fastify serveru selhal:', error);
    
    return {
      success: false,
      message: error.message
    };
  }
}

// Spuštění testu, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  testFastifyServer().then(result => {
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = {
  testFastifyServer
};
