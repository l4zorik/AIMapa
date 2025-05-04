# AIMapa

Interaktivní mapa s integrací Auth0 a Supabase.

## Novinky ve verzi 0.3.8.7

- Vylepšená integrace Auth0 s centralizovanou správou autentizace
- Nová dokumentace Auth0 endpointů v `auth/auth0-endpoints.md`
- Přidán testovací nástroj pro Auth0 v `auth/auth0-test.js`
- Vytvořen průvodce pro vývojáře v `AUTH0-GUIDE.md`

## Konfigurace prostředí

Aplikace používá následující soubory pro konfiguraci prostředí:

### `.env`

Tento soubor obsahuje konfiguraci pro lokální vývojové prostředí. Obsahuje citlivé údaje a **není** součástí repozitáře (je v `.gitignore`).

### `.env.example`

Tento soubor slouží jako šablona pro vytvoření `.env` souboru. Obsahuje všechny potřebné proměnné prostředí, ale s zástupnými hodnotami. Tento soubor **je** součástí repozitáře.

### `.env.production`

Tento soubor obsahuje konfiguraci pro produkční prostředí. Neobsahuje citlivé údaje, protože ty jsou nastaveny přímo v Netlify. Slouží jako dokumentace pro produkční nastavení. Tento soubor **je** součástí repozitáře.

## Jak používat konfigurační soubory

1. Pro lokální vývoj zkopírujte `.env.example` do `.env` a vyplňte skutečné hodnoty.
2. Pro nasazení do produkce nastavte proměnné prostředí přímo v Netlify.
3. Při spuštění aplikace v produkčním prostředí (NODE_ENV=production) se automaticky načte `.env.production`.

## Důležité proměnné prostředí

### Supabase

- `SUPABASE_URL` - URL adresa Supabase projektu
- `SUPABASE_KEY` - Veřejný API klíč pro Supabase
- `SUPABASE_SERVICE_KEY` - Servisní klíč pro Supabase (pouze pro server)

### Auth0

- `AUTH0_DOMAIN` - Doména Auth0 aplikace
- `AUTH0_CLIENT_ID` - ID klienta Auth0 aplikace
- `AUTH0_CLIENT_SECRET` - Tajný klíč klienta Auth0 aplikace
- `AUTH0_CALLBACK_URL` - URL pro přesměrování po přihlášení
- `AUTH0_LOGOUT_URL` - URL pro přesměrování po odhlášení
- `AUTH0_SCOPE` - Rozsah oprávnění pro Auth0
- `AUTH0_AUDIENCE` - Cílová audience pro Auth0 tokeny
- `AUTH0_AUTH_REQUIRED` - Zda je vyžadována autentizace pro všechny routy

### Stripe

- `STRIPE_SECRET_KEY` - Tajný klíč pro Stripe
- `STRIPE_PUBLISHABLE_KEY` - Veřejný klíč pro Stripe
- `STRIPE_WEBHOOK_SECRET` - Tajný klíč pro Stripe webhooky

## Spuštění aplikace

### Lokální vývoj

```bash
# Spuštění serveru
node server.js
```

### Testování Auth0 endpointů

```bash
# Zobrazení všech testů
node auth/auth0-test.js

# Výměna autorizačního kódu za token
node auth/auth0-test.js exchange-code KOD
```

### Použití Docker

Aplikace je připravena pro spuštění v Dockeru. Pro použití Dockeru postupujte následovně:

#### Spuštění pomocí docker-compose (doporučeno)

```bash
# Sestavení a spuštění kontejneru
docker-compose up

# Spuštění na pozadí
docker-compose up -d

# Zastavení kontejneru
docker-compose down
```

#### Ruční sestavení a spuštění Docker kontejneru

```bash
# Sestavení Docker image
docker build -t aimapa .

# Spuštění kontejneru
docker run -p 3000:3000 --env-file .env aimapa
```

### Produkční prostředí

```bash
# Spuštění serveru v produkčním režimu
NODE_ENV=production node server.js

# Nebo pomocí Dockeru
NODE_ENV=production docker-compose up
```

## Nasazení

Aplikace je nasazena na Netlify. Při nasazení je důležité nastavit všechny potřebné proměnné prostředí v Netlify dashboardu.

## Dokumentace

- [Auth0 Průvodce](AUTH0-GUIDE.md) - Podrobný průvodce pro práci s Auth0 autentizací
- [Auth0 Endpointy](auth/auth0-endpoints.md) - Dokumentace všech Auth0 endpointů
- [Changelog](CHANGELOG.md) - Historie změn v aplikaci
