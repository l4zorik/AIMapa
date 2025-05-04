/**
 * Test migrace na nový technologický stack
 * Verze 0.3.8.7
 */

const { testWebpackConfig } = require('./webpack/webpack.test');
const { testSassCompilation } = require('./sass/sass.test');
const { testPwaFunctionality } = require('./pwa/pwa.test');
const { testFastifyServer } = require('./fastify/fastify.test');
const { testRedisConfig } = require('./redis/redis.test');

/**
 * Spuštění všech testů
 */
async function runAllTests() {
  console.log('Spouštím testy migrace na nový technologický stack...');
  console.log('=====================================================');
  
  const results = {
    webpack: await testWebpackConfig(),
    sass: await testSassCompilation(),
    pwa: await testPwaFunctionality(),
    fastify: await testFastifyServer(),
    redis: await testRedisConfig()
  };
  
  console.log('=====================================================');
  console.log('Výsledky testů:');
  
  let allSuccess = true;
  
  for (const [test, result] of Object.entries(results)) {
    console.log(`${test}: ${result.success ? '✅ ÚSPĚCH' : '❌ SELHÁNÍ'} - ${result.message}`);
    
    if (!result.success) {
      allSuccess = false;
    }
  }
  
  console.log('=====================================================');
  console.log(`Celkový výsledek: ${allSuccess ? '✅ ÚSPĚCH' : '❌ SELHÁNÍ'}`);
  
  return {
    success: allSuccess,
    results
  };
}

// Spuštění testů, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  runAllTests().then(result => {
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = {
  runAllTests
};
