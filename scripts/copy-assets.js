/**
 * Skript pro kopírování statických souborů do dist složky
 */

const fs = require('fs');
const path = require('path');

// Funkce pro rekurzivní kopírování adresáře
function copyDirRecursive(src, dest) {
  // Vytvoření cílového adresáře, pokud neexistuje
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Načtení obsahu zdrojového adresáře
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // Kopírování každého souboru/adresáře
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Rekurzivní kopírování podadresáře
      copyDirRecursive(srcPath, destPath);
    } else {
      // Kopírování souboru
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Hlavní funkce
function main() {
  console.log('Kopíruji statické soubory do dist složky...');
  
  const rootDir = path.resolve(__dirname, '..');
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(publicDir, 'dist');
  
  // Seznam adresářů, které chceme zkopírovat
  const dirsToCopy = [
    'app',
    'styles',
    'images',
    'components'
  ];
  
  // Kopírování adresářů
  for (const dir of dirsToCopy) {
    const srcDir = path.join(publicDir, dir);
    const destDir = path.join(distDir, dir);
    
    if (fs.existsSync(srcDir)) {
      console.log(`Kopíruji adresář: ${dir}`);
      copyDirRecursive(srcDir, destDir);
    } else {
      console.log(`Adresář ${dir} neexistuje, přeskakuji`);
    }
  }
  
  console.log('Kopírování statických souborů dokončeno');
}

// Spuštění hlavní funkce
main();
