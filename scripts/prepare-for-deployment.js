/**
 * Skript pro přípravu projektu na deployment
 * Verze 0.3.8.7
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cesty k adresářům
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'public', 'dist');
const deployDir = path.join(rootDir, 'deploy');

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
 * Kontrola, zda jsou všechny potřebné soubory přítomny
 */
function checkRequiredFiles() {
  console.log('Kontrola potřebných souborů...');
  
  const requiredFiles = [
    'webpack.config.js',
    'package.json',
    'server.js',
    'fastify-server.js',
    '.env.example'
  ];
  
  for (const file of requiredFiles) {
    const filePath = path.join(rootDir, file);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Soubor ${file} neexistuje`);
    }
  }
  
  console.log('Všechny potřebné soubory jsou přítomny');
}

/**
 * Kontrola, zda jsou všechny potřebné závislosti nainstalovány
 */
function checkDependencies() {
  console.log('Kontrola závislostí...');
  
  try {
    execSync('npm ls --prod --depth=0', { stdio: 'ignore' });
    console.log('Všechny produkční závislosti jsou nainstalovány');
  } catch (error) {
    console.warn('Některé produkční závislosti chybí, instaluji...');
    execSync('npm install --production', { stdio: 'inherit' });
  }
}

/**
 * Vytvoření produkčního buildu
 */
function createProductionBuild() {
  console.log('Vytváření produkčního buildu...');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('Produkční build byl úspěšně vytvořen');
  } catch (error) {
    throw new Error(`Chyba při vytváření produkčního buildu: ${error.message}`);
  }
}

/**
 * Vytvoření deployment balíčku
 */
function createDeploymentPackage() {
  console.log('Vytváření deployment balíčku...');
  
  // Vytvoření deployment adresáře
  createDirIfNotExists(deployDir);
  
  // Kopírování potřebných souborů
  const filesToCopy = [
    'package.json',
    'package-lock.json',
    'server.js',
    'fastify-server.js',
    'start-servers.js',
    '.env.example'
  ];
  
  for (const file of filesToCopy) {
    const sourcePath = path.join(rootDir, file);
    const destPath = path.join(deployDir, file);
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Zkopírován soubor: ${file}`);
    } else {
      console.warn(`Soubor ${file} neexistuje, přeskakuji`);
    }
  }
  
  // Kopírování adresářů
  const dirsToCopy = [
    'public',
    'config',
    'routes',
    'middleware',
    'auth',
    'llm'
  ];
  
  for (const dir of dirsToCopy) {
    const sourceDir = path.join(rootDir, dir);
    const destDir = path.join(deployDir, dir);
    
    if (fs.existsSync(sourceDir)) {
      // Rekurzivní kopírování adresáře
      copyDirRecursive(sourceDir, destDir);
      console.log(`Zkopírován adresář: ${dir}`);
    } else {
      console.warn(`Adresář ${dir} neexistuje, přeskakuji`);
    }
  }
  
  // Vytvoření .env souboru z .env.example
  const envExamplePath = path.join(rootDir, '.env.example');
  const envPath = path.join(deployDir, '.env');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('Vytvořen .env soubor z .env.example');
  }
  
  // Vytvoření README.md pro deployment
  const readmePath = path.join(deployDir, 'README.md');
  const readmeContent = `# AIMapa Deployment

Toto je produkční build aplikace AIMapa.

## Instalace

\`\`\`bash
# Instalace závislostí
npm install --production

# Nastavení proměnných prostředí
# Upravte soubor .env podle vašich potřeb
\`\`\`

## Spuštění

\`\`\`bash
# Spuštění obou serverů
npm run start:all

# Nebo spuštění jednotlivých serverů
npm run start        # Express server
npm run start:fastify # Fastify server
\`\`\`

## Porty

- Express server: port 3000 (nebo PORT z .env)
- Fastify server: port 3002 (nebo FASTIFY_PORT z .env)

## Verze

Verze: 0.3.8.7
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('Vytvořen README.md pro deployment');
  
  console.log('Deployment balíček byl úspěšně vytvořen v adresáři deploy');
}

/**
 * Rekurzivní kopírování adresáře
 * @param {string} source - Zdrojový adresář
 * @param {string} destination - Cílový adresář
 */
function copyDirRecursive(source, destination) {
  // Vytvoření cílového adresáře
  createDirIfNotExists(destination);
  
  // Získání seznamu souborů a adresářů
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    // Přeskočení node_modules a .git
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Rekurzivní kopírování adresáře
      copyDirRecursive(sourcePath, destPath);
    } else {
      // Kopírování souboru
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

/**
 * Vytvoření .dockerignore souboru
 */
function createDockerignore() {
  console.log('Vytváření .dockerignore souboru...');
  
  const dockerignorePath = path.join(rootDir, '.dockerignore');
  const dockerignoreContent = `# Node.js
node_modules
npm-debug.log
yarn-debug.log
yarn-error.log

# Vývojové soubory
.git
.github
.vscode
.idea
*.md
!README.md
!CHANGELOG.md

# Testy
tests
coverage

# Dočasné soubory
tmp
temp
.DS_Store
Thumbs.db

# Deployment
deploy

# Logy
logs
*.log

# Skripty
scripts
`;
  
  fs.writeFileSync(dockerignorePath, dockerignoreContent);
  console.log('Vytvořen .dockerignore soubor');
}

/**
 * Vytvoření Dockerfile
 */
function createDockerfile() {
  console.log('Vytváření Dockerfile...');
  
  const dockerfilePath = path.join(rootDir, 'Dockerfile');
  const dockerfileContent = `# Základní image
FROM node:18-alpine

# Pracovní adresář
WORKDIR /app

# Kopírování package.json a package-lock.json
COPY package*.json ./

# Instalace závislostí
RUN npm install --production

# Kopírování zbytku aplikace
COPY . .

# Nastavení proměnných prostředí
ENV NODE_ENV=production
ENV PORT=3000
ENV FASTIFY_PORT=3002

# Expozice portů
EXPOSE 3000
EXPOSE 3002

# Spuštění aplikace
CMD ["node", "start-servers.js"]
`;
  
  fs.writeFileSync(dockerfilePath, dockerfileContent);
  console.log('Vytvořen Dockerfile');
}

/**
 * Vytvoření docker-compose.yml souboru
 */
function createDockerCompose() {
  console.log('Vytváření docker-compose.yml souboru...');
  
  const dockerComposePath = path.join(rootDir, 'docker-compose.yml');
  const dockerComposeContent = `version: '3'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - FASTIFY_PORT=3002
      - REDIS_ENABLED=true
      - REDIS_HOST=redis
    depends_on:
      - redis
    restart: always

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: always

volumes:
  redis-data:
`;
  
  fs.writeFileSync(dockerComposePath, dockerComposeContent);
  console.log('Vytvořen docker-compose.yml soubor');
}

/**
 * Spuštění přípravy na deployment
 */
async function prepareForDeployment() {
  console.log('Příprava projektu na deployment...');
  console.log('=====================================================');
  
  try {
    // Kontrola potřebných souborů
    checkRequiredFiles();
    
    // Kontrola závislostí
    checkDependencies();
    
    // Vytvoření produkčního buildu
    createProductionBuild();
    
    // Vytvoření deployment balíčku
    createDeploymentPackage();
    
    // Vytvoření Docker souborů
    createDockerignore();
    createDockerfile();
    createDockerCompose();
    
    console.log('=====================================================');
    console.log('Příprava projektu na deployment dokončena');
    console.log('Deployment balíček je připraven v adresáři deploy');
    console.log('Docker soubory jsou připraveny v kořenovém adresáři');
    console.log('Pro nasazení pomocí Docker použijte:');
    console.log('docker-compose up -d');
  } catch (error) {
    console.error('Chyba při přípravě projektu na deployment:', error);
    process.exit(1);
  }
}

// Spuštění přípravy na deployment, pokud je tento soubor spuštěn přímo
if (require.main === module) {
  prepareForDeployment();
}

module.exports = {
  prepareForDeployment
};
