/**
 * Skript pro automatickou migraci existujícího kódu na nový technologický stack
 * Verze 0.3.8.7
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cesty k adresářům
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const jsDir = path.join(publicDir, 'js');
const cssDir = path.join(publicDir, 'css');
const scssDir = path.join(publicDir, 'scss');

/**
 * Vytvoření adresáře, pokud neexistuje
 * @param {string} dir - Cesta k adresáři
 */
function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Vytvořen adresář: ${dir}`);
  }
}

/**
 * Migrace CSS na SASS
 */
function migrateCssToSass() {
  console.log('Migrace CSS na SASS...');
  
  // Kontrola, zda existuje adresář scss
  createDirIfNotExists(scssDir);
  createDirIfNotExists(path.join(scssDir, 'components'));
  
  // Získání seznamu CSS souborů
  const cssFiles = fs.readdirSync(cssDir)
    .filter(file => file.endsWith('.css'));
  
  if (cssFiles.length === 0) {
    console.log('Žádné CSS soubory k migraci');
    return;
  }
  
  // Migrace každého CSS souboru
  for (const cssFile of cssFiles) {
    const cssPath = path.join(cssDir, cssFile);
    const scssFile = cssFile.replace('.css', '.scss');
    const scssPath = path.join(scssDir, 'components', `_${scssFile}`);
    
    // Přečtení obsahu CSS souboru
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Úprava obsahu pro SASS
    // - Přidání importu proměnných a mixinů
    cssContent = `@import '../variables';\n@import '../mixins';\n\n${cssContent}`;
    
    // - Nahrazení barev proměnnými
    cssContent = cssContent.replace(/#4285f4/g, '$primary-color');
    cssContent = cssContent.replace(/#34a853/g, '$secondary-color');
    cssContent = cssContent.replace(/#ea4335/g, '$accent-color');
    cssContent = cssContent.replace(/#333/g, '$text-color');
    cssContent = cssContent.replace(/#666/g, '$light-text-color');
    cssContent = cssContent.replace(/#fff/g, '$bg-color');
    cssContent = cssContent.replace(/#f5f5f5/g, '$light-bg-color');
    cssContent = cssContent.replace(/#ddd/g, '$border-color');
    
    // - Nahrazení opakujících se vlastností mixiny
    cssContent = cssContent.replace(/display: flex;[\s\n]*flex-direction: row;[\s\n]*justify-content: ([^;]+);[\s\n]*align-items: ([^;]+);/g, '@include flex(row, $1, $2);');
    cssContent = cssContent.replace(/display: flex;[\s\n]*flex-direction: column;[\s\n]*justify-content: ([^;]+);[\s\n]*align-items: ([^;]+);/g, '@include flex(column, $1, $2);');
    
    // Uložení SASS souboru
    fs.writeFileSync(scssPath, cssContent);
    console.log(`Migrován soubor: ${cssFile} -> _${scssFile}`);
    
    // Přidání importu do main.scss
    const mainScssPath = path.join(scssDir, 'main.scss');
    
    if (fs.existsSync(mainScssPath)) {
      let mainScssContent = fs.readFileSync(mainScssPath, 'utf8');
      
      if (!mainScssContent.includes(`@import 'components/${scssFile.replace('.scss', '')}';`)) {
        mainScssContent = mainScssContent.replace(/\/\* Import dalších modulů \*\//, `/* Import dalších modulů */\n@import 'components/${scssFile.replace('.scss', '')}';`);
        fs.writeFileSync(mainScssPath, mainScssContent);
      }
    }
  }
  
  console.log('Migrace CSS na SASS dokončena');
}

/**
 * Migrace JavaScript na ES6+
 */
function migrateJsToEs6() {
  console.log('Migrace JavaScript na ES6+...');
  
  // Získání seznamu JS souborů
  const jsFiles = [];
  
  function findJsFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findJsFiles(filePath);
      } else if (file.endsWith('.js')) {
        jsFiles.push(filePath);
      }
    }
  }
  
  findJsFiles(jsDir);
  
  if (jsFiles.length === 0) {
    console.log('Žádné JS soubory k migraci');
    return;
  }
  
  // Migrace každého JS souboru
  for (const jsFile of jsFiles) {
    // Přečtení obsahu JS souboru
    let jsContent = fs.readFileSync(jsFile, 'utf8');
    
    // Úprava obsahu pro ES6+
    // - Nahrazení var na let/const
    jsContent = jsContent.replace(/var /g, 'let ');
    
    // - Nahrazení function() na arrow funkce
    jsContent = jsContent.replace(/function\s*\(([^)]*)\)\s*{/g, '($1) => {');
    
    // - Nahrazení concatenation na template literals
    jsContent = jsContent.replace(/(['"])([^'"]*)\1\s*\+\s*([^+;]+)(\s*\+\s*['"])?/g, '`$2${$3}`');
    
    // Uložení ES6+ souboru
    fs.writeFileSync(jsFile, jsContent);
    console.log(`Migrován soubor: ${path.relative(rootDir, jsFile)}`);
  }
  
  console.log('Migrace JavaScript na ES6+ dokončena');
}

/**
 * Migrace HTML na PWA
 */
function migrateHtmlToPwa() {
  console.log('Migrace HTML na PWA...');
  
  // Získání seznamu HTML souborů
  const htmlFiles = fs.readdirSync(publicDir)
    .filter(file => file.endsWith('.html'));
  
  if (htmlFiles.length === 0) {
    console.log('Žádné HTML soubory k migraci');
    return;
  }
  
  // Migrace každého HTML souboru
  for (const htmlFile of htmlFiles) {
    const htmlPath = path.join(publicDir, htmlFile);
    
    // Přečtení obsahu HTML souboru
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Úprava obsahu pro PWA
    // - Přidání odkazu na manifest
    if (!htmlContent.includes('<link rel="manifest"')) {
      htmlContent = htmlContent.replace('</head>', '  <link rel="manifest" href="/manifest.json">\n</head>');
    }
    
    // - Přidání meta tagů pro PWA
    if (!htmlContent.includes('<meta name="theme-color"')) {
      htmlContent = htmlContent.replace('</head>', '  <meta name="theme-color" content="#4285f4">\n</head>');
    }
    
    if (!htmlContent.includes('<meta name="apple-mobile-web-app-capable"')) {
      htmlContent = htmlContent.replace('</head>', '  <meta name="apple-mobile-web-app-capable" content="yes">\n</head>');
    }
    
    // - Přidání registrace service workeru
    if (!htmlContent.includes('serviceWorker')) {
      const serviceWorkerScript = `
  <!-- Service Worker -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('Service Worker registrován:', registration);
          })
          .catch(error => {
            console.error('Chyba při registraci Service Workeru:', error);
          });
      });
    }
  </script>`;
      
      htmlContent = htmlContent.replace('</body>', `${serviceWorkerScript}\n</body>`);
    }
    
    // Uložení PWA HTML souboru
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`Migrován soubor: ${htmlFile}`);
  }
  
  console.log('Migrace HTML na PWA dokončena');
}

/**
 * Spuštění migrace
 */
async function runMigration() {
  console.log('Spouštím migraci na nový technologický stack...');
  console.log('=====================================================');
  
  try {
    // Migrace CSS na SASS
    migrateCssToSass();
    
    // Migrace JavaScript na ES6+
    migrateJsToEs6();
    
    // Migrace HTML na PWA
    migrateHtmlToPwa();
    
    // Instalace závislostí
    console.log('Instalace závislostí...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Spuštění testů migrace
    console.log('Spouštění testů migrace...');
    execSync('npm run test:migration', { stdio: 'inherit' });
    
    console.log('=====================================================');
    console.log('Migrace na nový technologický stack dokončena');
    console.log('Nyní můžete spustit aplikaci pomocí:');
    console.log('npm run dev:all');
  } catch (error) {
    console.error('Chyba při migraci:', error);
    process.exit(1);
  }
}

// Spuštění migrace, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  runMigration();
}

module.exports = {
  runMigration
};
