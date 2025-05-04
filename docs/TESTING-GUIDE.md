# Průvodce testováním implementace nového technologického stacku

Tento dokument popisuje, jak testovat implementaci nového technologického stacku v aplikaci AIMapa.

## Obsah

1. [Přehled testů](#přehled-testů)
2. [Spuštění testů](#spuštění-testů)
3. [Automatická migrace](#automatická-migrace)
4. [Manuální testování](#manuální-testování)
5. [Řešení problémů](#řešení-problémů)

## Přehled testů

Implementace nového technologického stacku je testována pomocí následujících testů:

1. **Webpack test** - Testuje správnost konfigurace Webpack a zkušební build
2. **SASS test** - Testuje kompilaci SASS souborů
3. **PWA test** - Testuje funkcionalitu Progressive Web App
4. **Fastify test** - Testuje konfiguraci Fastify serveru
5. **Redis test** - Testuje konfiguraci Redis

## Spuštění testů

### Spuštění všech testů

Pro spuštění všech testů najednou použijte následující příkaz:

```bash
npm run test:migration
```

Tento příkaz spustí všechny testy a zobrazí výsledky.

### Spuštění jednotlivých testů

Pro spuštění jednotlivých testů můžete použít následující příkazy:

```bash
# Test Webpack konfigurace
node tests/webpack/webpack.test.js

# Test SASS kompilace
node tests/sass/sass.test.js

# Test PWA funkcionality
node tests/pwa/pwa.test.js

# Test Fastify serveru
node tests/fastify/fastify.test.js

# Test Redis konfigurace
node tests/redis/redis.test.js
```

## Automatická migrace

Pro automatickou migraci existujícího kódu na nový technologický stack použijte následující příkaz:

```bash
npm run migrate
```

Tento příkaz provede následující kroky:

1. Migrace CSS na SASS
2. Migrace JavaScript na ES6+
3. Migrace HTML na PWA
4. Instalace závislostí
5. Spuštění testů migrace

## Manuální testování

Po úspěšné migraci a spuštění automatických testů je vhodné provést také manuální testování:

### 1. Spuštění vývojového prostředí

```bash
npm run dev:all
```

Tento příkaz spustí Express server, Fastify server a Webpack dev server.

### 2. Testování frontendu

Otevřete prohlížeč a přejděte na adresu:

```
http://localhost:3000
```

Zkontrolujte následující:

- Stránka se správně načte
- Styly jsou správně aplikovány
- JavaScript funkce fungují správně
- Service Worker je registrován (zkontrolujte v DevTools -> Application -> Service Workers)
- Manifest je načten (zkontrolujte v DevTools -> Application -> Manifest)

### 3. Testování backendu

#### Express API

```bash
curl -v http://localhost:3000/api/version
```

#### Fastify API

```bash
curl -v http://localhost:3002/health
curl -v http://localhost:3002/api/version
```

### 4. Testování PWA

1. Otevřete Chrome DevTools
2. Přejděte na záložku Application
3. V sekci Service Workers zkontrolujte, zda je Service Worker registrován
4. Klikněte na "Offline" a obnovte stránku
5. Zkontrolujte, zda je stránka dostupná offline

### 5. Testování buildu

```bash
npm run build
```

Zkontrolujte, zda build proběhl úspěšně a zda byly vygenerovány soubory v adresáři `public/dist`.

## Řešení problémů

### Webpack chyby

Pokud se objeví chyby při buildu s Webpack, zkontrolujte:

1. Zda jsou nainstalovány všechny závislosti:

```bash
npm install
```

2. Zda je správně nakonfigurován Webpack:

```bash
cat webpack.config.js
```

3. Zda jsou správně nakonfigurované entry pointy:

```bash
ls -la public/js
```

### SASS chyby

Pokud se objeví chyby při kompilaci SASS, zkontrolujte:

1. Zda jsou správně nainstalovány SASS závislosti:

```bash
npm list sass sass-loader
```

2. Zda jsou správně nakonfigurované SASS soubory:

```bash
ls -la public/scss
```

### PWA chyby

Pokud se objeví chyby při testování PWA, zkontrolujte:

1. Zda je správně nakonfigurován Service Worker:

```bash
cat public/js/service-worker.js
```

2. Zda je správně nakonfigurován manifest:

```bash
cat public/manifest.json
```

3. Zda jsou v HTML souborech správně přidány odkazy na manifest a registrace Service Workeru:

```bash
grep -r "manifest" public/*.html
grep -r "serviceWorker" public/*.html
```

### Fastify chyby

Pokud se objeví chyby při testování Fastify serveru, zkontrolujte:

1. Zda je správně nakonfigurován Fastify server:

```bash
cat fastify-server.js
```

2. Zda jsou správně nakonfigurované routes:

```bash
ls -la routes/fastify
```

3. Zda jsou správně nakonfigurované middleware:

```bash
ls -la middleware/fastify
```

### Redis chyby

Pokud se objeví chyby při testování Redis, zkontrolujte:

1. Zda je správně nakonfigurován Redis:

```bash
cat config/redis.js
```

2. Zda je Redis server spuštěn (pokud používáte reálný Redis server):

```bash
redis-cli ping
```

3. Zda jsou správně nastavené proměnné prostředí:

```bash
cat .env | grep REDIS
```
