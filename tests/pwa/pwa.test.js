/**
 * Test PWA funkcionality
 * Verze 0.3.8.7
 */

const path = require('path');
const fs = require('fs');

/**
 * Test PWA funkcionality
 */
async function testPwaFunctionality() {
  console.log('Testování PWA funkcionality...');
  
  try {
    // Kontrola, zda existuje service worker
    const serviceWorkerPath = path.resolve(__dirname, '../../public/js/service-worker.js');
    
    if (!fs.existsSync(serviceWorkerPath)) {
      throw new Error('Soubor service-worker.js neexistuje v adresáři public/js');
    }
    
    // Kontrola, zda existuje manifest
    const manifestPath = path.resolve(__dirname, '../../public/manifest.json');
    
    if (!fs.existsSync(manifestPath)) {
      throw new Error('Soubor manifest.json neexistuje v adresáři public');
    }
    
    // Kontrola obsahu manifestu
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    const requiredProperties = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
    
    for (const prop of requiredProperties) {
      if (!manifest[prop]) {
        throw new Error(`manifest.json neobsahuje vlastnost ${prop}`);
      }
    }
    
    // Kontrola ikon
    if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
      throw new Error('manifest.json neobsahuje žádné ikony');
    }
    
    // Kontrola, zda existuje workbox plugin v webpack konfiguraci
    const webpackConfigPath = path.resolve(__dirname, '../../webpack.config.js');
    
    if (!fs.existsSync(webpackConfigPath)) {
      throw new Error('webpack.config.js neexistuje');
    }
    
    const webpackConfig = require(webpackConfigPath);
    
    if (!webpackConfig.plugins) {
      throw new Error('webpack.config.js neobsahuje pluginy');
    }
    
    const hasWorkboxPlugin = webpackConfig.plugins.some(plugin => 
      plugin.constructor && plugin.constructor.name === 'GenerateSW'
    );
    
    if (!hasWorkboxPlugin) {
      throw new Error('webpack.config.js neobsahuje Workbox plugin');
    }
    
    // Kontrola, zda HTML soubory obsahují odkazy na manifest
    const htmlFiles = ['index.html', 'chat.html'].map(file => 
      path.resolve(__dirname, '../../public', file)
    );
    
    for (const htmlFile of htmlFiles) {
      if (!fs.existsSync(htmlFile)) {
        console.warn(`Soubor ${htmlFile} neexistuje`);
        continue;
      }
      
      const html = fs.readFileSync(htmlFile, 'utf8');
      
      if (!html.includes('<link rel="manifest"')) {
        throw new Error(`Soubor ${htmlFile} neobsahuje odkaz na manifest`);
      }
    }
    
    return {
      success: true,
      message: 'PWA funkcionalita je správně nastavena'
    };
  } catch (error) {
    console.error('Test PWA funkcionality selhal:', error);
    
    return {
      success: false,
      message: error.message
    };
  }
}

// Spuštění testu, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  testPwaFunctionality().then(result => {
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = {
  testPwaFunctionality
};
