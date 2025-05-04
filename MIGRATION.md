# Migrace na nový technologický stack

Tento dokument popisuje kroky potřebné pro migraci projektu AIMapa na nový technologický stack definovaný v kategorii "Krátkodobý plán".

## Přehled změn

### Frontend
- **JavaScript**: Přechod z Vanilla JS na ES6+ a moduly
- **CSS**: Přechod z vlastního CSS na SASS a CSS Modules
- **Bundler**: Implementace Webpack
- **PWA**: Základní implementace PWA funkcí

### Backend
- **Framework**: Přidání Fastify vedle Express
- **Databáze**: Přidání Redis pro cachování

## Kroky migrace

### 1. Instalace závislostí

```bash
# Instalace závislostí pro frontend
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev babel-loader @babel/core @babel/preset-env core-js
npm install --save-dev sass sass-loader css-loader style-loader
npm install --save-dev mini-css-extract-plugin html-webpack-plugin
npm install --save-dev workbox-webpack-plugin file-loader
npm install --save-dev eslint eslint-config-airbnb-base eslint-plugin-import

# Instalace závislostí pro backend
npm install --save fastify @fastify/cors @fastify/helmet @fastify/auth
npm install --save ioredis redis redis-mock
npm install --save-dev concurrently
```

### 2. Konfigurace Webpack

Vytvořte soubor `webpack.config.js` v kořenovém adresáři projektu:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    'auth0-bundle': './public/app/auth0-bundle.js',
    main: './public/js/main.js',
    auth: './public/js/auth0-client.js',
    supabase: './public/js/supabase-client.js',
    sync: './public/js/sync-manager.js',
    chat: './public/js/chat-client.js'
  },
  output: {
    filename: isProduction ? 'js/[name].[contenthash].min.js' : 'js/[name].js',
    path: path.resolve(__dirname, 'public/dist'),
    clean: true,
  },
  // ... další konfigurace
};
```

### 3. Konfigurace Babel

Vytvořte soubor `.babelrc` v kořenovém adresáři projektu:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": [
            "last 2 versions",
            "not dead",
            "> 0.5%"
          ]
        },
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
  "plugins": []
}
```

### 4. Konfigurace ESLint

Vytvořte soubor `.eslintrc.js` v kořenovém adresáři projektu:

```javascript
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { code: 120 }],
    'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
    }],
    'no-param-reassign': ['error', { props: false }],
    'no-underscore-dangle': 'off',
  },
};
```

### 5. Migrace CSS na SASS

1. Vytvořte adresář `public/scss`
2. Vytvořte soubory `variables.scss`, `mixins.scss` a `main.scss`
3. Vytvořte adresář `public/scss/components` pro komponenty
4. Migrujte existující CSS do SASS souborů

### 6. Implementace PWA

1. Vytvořte soubor `public/js/service-worker.js`
2. Vytvořte soubor `public/manifest.json`
3. Aktualizujte HTML soubory o odkazy na manifest a service worker

### 7. Konfigurace Redis

1. Vytvořte soubor `config/redis.js`
2. Aktualizujte `.env.example` o Redis konfiguraci
3. Implementujte cachování v API endpointech

### 8. Implementace Fastify serveru

1. Vytvořte soubor `fastify-server.js`
2. Vytvořte adresáře `routes/fastify` a `middleware/fastify`
3. Implementujte Fastify routes a middleware
4. Vytvořte skript pro spuštění obou serverů současně

### 9. Aktualizace package.json

Aktualizujte skripty v `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "start:fastify": "node fastify-server.js",
  "start:all": "node start-servers.js",
  "dev": "nodemon server.js",
  "dev:fastify": "nodemon fastify-server.js",
  "dev:client": "webpack serve --mode development",
  "dev:all": "concurrently \"npm run dev\" \"npm run dev:fastify\" \"npm run dev:client\"",
  "build": "NODE_ENV=production webpack",
  "build:dev": "webpack",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
}
```

## Testování migrace

### 1. Spuštění vývojového prostředí

```bash
# Instalace závislostí
npm install

# Spuštění vývojového prostředí
npm run dev:all
```

### 2. Testování buildu

```bash
# Build pro produkci
npm run build

# Spuštění produkčního serveru
npm run start:all
```

### 3. Testování PWA

1. Otevřete aplikaci v prohlížeči
2. Zkontrolujte, zda je Service Worker registrován
3. Zkontrolujte, zda je aplikace dostupná offline

### 4. Testování Fastify API

```bash
# Testování Fastify API
curl -v http://localhost:3002/health
curl -v http://localhost:3002/api/version
```

## Řešení problémů

### CORS chyby

Pokud se objeví CORS chyby, zkontrolujte nastavení CORS v Express a Fastify serverech:

```javascript
// Express
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// Fastify
fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
});
```

### Webpack chyby

Pokud se objeví chyby při buildu s Webpack, zkontrolujte konfiguraci a závislosti:

```bash
# Kontrola Webpack verze
npm list webpack

# Vyčištění cache
npm cache clean --force

# Reinstalace závislostí
rm -rf node_modules
npm install
```

### Redis chyby

Pokud se objeví chyby při připojení k Redis, zkontrolujte, zda je Redis server spuštěn:

```bash
# Kontrola, zda je Redis server spuštěn
redis-cli ping

# Spuštění Redis serveru
redis-server
```

## Další kroky

Po úspěšné migraci na nový technologický stack můžete pokračovat v implementaci dalších funkcí definovaných v krátkodobém plánu:

1. Implementace offline režimu
2. Optimalizace nákladů na LLM API
3. Rozšíření podporovaných modelů
4. Implementace mapových funkcí
5. Optimalizace pro mobilní zařízení
