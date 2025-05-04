/**
 * Test SASS kompilace
 * Verze 0.3.8.7
 */

const path = require('path');
const fs = require('fs');
const sass = require('sass');

/**
 * Test SASS kompilace
 */
async function testSassCompilation() {
  console.log('Testování SASS kompilace...');
  
  try {
    // Kontrola, zda existují SASS soubory
    const sassDir = path.resolve(__dirname, '../../public/scss');
    
    if (!fs.existsSync(sassDir)) {
      throw new Error('Adresář public/scss neexistuje');
    }
    
    // Kontrola, zda existují základní SASS soubory
    const requiredFiles = ['variables.scss', 'mixins.scss', 'main.scss'];
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(path.join(sassDir, file))) {
        throw new Error(`Soubor ${file} neexistuje v adresáři public/scss`);
      }
    }
    
    // Kontrola, zda existuje adresář components
    const componentsDir = path.join(sassDir, 'components');
    
    if (!fs.existsSync(componentsDir)) {
      throw new Error('Adresář public/scss/components neexistuje');
    }
    
    // Zkušební kompilace main.scss
    console.log('Kompiluji main.scss...');
    
    const result = sass.compile(path.join(sassDir, 'main.scss'), {
      loadPaths: [sassDir]
    });
    
    if (!result.css) {
      throw new Error('Kompilace main.scss selhala');
    }
    
    console.log('Kompilace main.scss úspěšná');
    
    // Zkušební kompilace všech SASS souborů v components
    const componentFiles = fs.readdirSync(componentsDir)
      .filter(file => file.endsWith('.scss'));
    
    if (componentFiles.length === 0) {
      throw new Error('Adresář public/scss/components neobsahuje žádné SASS soubory');
    }
    
    console.log(`Kompiluji ${componentFiles.length} komponentových SASS souborů...`);
    
    for (const file of componentFiles) {
      const componentResult = sass.compile(path.join(componentsDir, file), {
        loadPaths: [sassDir]
      });
      
      if (!componentResult.css) {
        throw new Error(`Kompilace ${file} selhala`);
      }
    }
    
    console.log('Kompilace všech komponentových SASS souborů úspěšná');
    
    return {
      success: true,
      message: 'SASS kompilace je funkční'
    };
  } catch (error) {
    console.error('Test SASS kompilace selhal:', error);
    
    return {
      success: false,
      message: error.message
    };
  }
}

// Spuštění testu, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  testSassCompilation().then(result => {
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = {
  testSassCompilation
};
