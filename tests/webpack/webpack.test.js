/**
 * Test Webpack konfigurace
 * Verze 0.3.8.7
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const webpackConfig = require('../../webpack.config.js');

/**
 * Test Webpack konfigurace
 */
async function testWebpackConfig() {
  console.log('Testování Webpack konfigurace...');
  
  try {
    // Kontrola, zda existuje webpack.config.js
    if (!fs.existsSync(path.resolve(__dirname, '../../webpack.config.js'))) {
      throw new Error('webpack.config.js neexistuje');
    }
    
    // Kontrola, zda je webpackConfig objekt
    if (typeof webpackConfig !== 'object') {
      throw new Error('webpack.config.js neexportuje objekt');
    }
    
    // Kontrola, zda má webpackConfig požadované vlastnosti
    const requiredProperties = ['entry', 'output', 'module', 'plugins'];
    
    for (const prop of requiredProperties) {
      if (!webpackConfig[prop]) {
        throw new Error(`webpack.config.js neobsahuje vlastnost ${prop}`);
      }
    }
    
    // Kontrola, zda má webpackConfig správné entry pointy
    const requiredEntries = ['auth0-bundle', 'main', 'auth', 'supabase', 'sync', 'chat'];
    
    for (const entry of requiredEntries) {
      if (!webpackConfig.entry[entry]) {
        throw new Error(`webpack.config.js neobsahuje entry point ${entry}`);
      }
    }
    
    // Kontrola, zda má webpackConfig správné loadery
    const rules = webpackConfig.module.rules;
    
    if (!Array.isArray(rules)) {
      throw new Error('webpack.config.js neobsahuje pravidla pro moduly');
    }
    
    const requiredLoaders = ['babel-loader', 'css-loader', 'sass-loader'];
    const loaders = rules.map(rule => {
      if (typeof rule.use === 'object' && rule.use.loader) {
        return rule.use.loader;
      } else if (Array.isArray(rule.use)) {
        return rule.use.map(u => typeof u === 'object' ? u.loader : u);
      } else if (typeof rule.use === 'string') {
        return rule.use;
      }
      return null;
    }).flat().filter(Boolean);
    
    for (const loader of requiredLoaders) {
      if (!loaders.some(l => l.includes(loader))) {
        throw new Error(`webpack.config.js neobsahuje loader ${loader}`);
      }
    }
    
    // Kontrola, zda má webpackConfig správné pluginy
    const plugins = webpackConfig.plugins;
    
    if (!Array.isArray(plugins)) {
      throw new Error('webpack.config.js neobsahuje pluginy');
    }
    
    const pluginNames = plugins.map(plugin => plugin.constructor.name);
    const requiredPlugins = ['HtmlWebpackPlugin', 'MiniCssExtractPlugin'];
    
    for (const plugin of requiredPlugins) {
      if (!pluginNames.includes(plugin)) {
        throw new Error(`webpack.config.js neobsahuje plugin ${plugin}`);
      }
    }
    
    // Zkušební build
    console.log('Spouštím zkušební Webpack build...');
    
    const compiler = webpack(webpackConfig);
    
    const stats = await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        
        resolve(stats);
      });
    });
    
    if (stats.hasErrors()) {
      throw new Error(`Webpack build selhal: ${stats.toString()}`);
    }
    
    console.log('Webpack build úspěšný');
    
    return {
      success: true,
      message: 'Webpack konfigurace je správná'
    };
  } catch (error) {
    console.error('Test Webpack konfigurace selhal:', error);
    
    return {
      success: false,
      message: error.message
    };
  }
}

// Spuštění testu, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  testWebpackConfig().then(result => {
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = {
  testWebpackConfig
};
