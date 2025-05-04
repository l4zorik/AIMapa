# Průvodce nastavením Auth0 Callback URL

## Obsah
1. [Úvod](#úvod)
2. [Typy URL v Auth0](#typy-url-v-auth0)
3. [Časté chyby s Callback URL](#časté-chyby-s-callback-url)
4. [Řešení problémů](#řešení-problémů)
5. [Problémy s Content Security Policy (CSP)](#problémy-s-content-security-policy-csp)
6. [Automatická oprava](#automatická-oprava)
7. [Příklady konfigurace](#příklady-konfigurace)

## Úvod

Správné nastavení callback URL je klíčové pro fungování Auth0 autentizace. Callback URL je adresa, na kterou Auth0 přesměruje uživatele po úspěšné autentizaci. Pokud tato URL není správně nakonfigurována, autentizace selže a uživatel se nebude moci přihlásit.

## Typy URL v Auth0

V Auth0 je potřeba nastavit několik typů URL:

### 1. Allowed Callback URLs
```
http://localhost:3000/callback, https://www.quicksoft.fun/callback
```
- Adresy, na které Auth0 přesměruje uživatele po úspěšné autentizaci
- Musí být přesně specifikovány včetně protokolu (http:// nebo https://)
- Více URL lze oddělit čárkami
- Typicky končí `/callback` nebo `/auth/callback`

### 2. Allowed Logout URLs
```
http://localhost:3000, https://www.quicksoft.fun
```
- Adresy, na které Auth0 přesměruje uživatele po odhlášení
- Obvykle se jedná o hlavní stránku aplikace

### 3. Allowed Web Origins
```
http://localhost:3000, https://www.quicksoft.fun
```
- Domény, ze kterých je povoleno volat Auth0 API
- Důležité pro Cross-Origin Authentication
- Obvykle stejné jako domény aplikace, ale bez cest

## Časté chyby s Callback URL

### 1. Callback URL mismatch
```json
{
  "error": {
    "message": "Callback URL mismatch. https://www.quicksoft.fun is not in the list of allowed callback URLs",
    "oauthError": "Callback URL mismatch. https://www.quicksoft.fun is not in the list of allowed callback URLs. Please go to 'https://manage.auth0.com/#/applications/H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ/settings' and make sure you are sending the same callback url from your application.",
    "payload": {
      "authorized": [
        "http://localhost:3000/auth/callback",
        "https://www.quicksoft.fun/auth/callback"
      ],
      "attempt": "https://www.quicksoft.fun"
    }
  }
}
```

**Příčina**: Aplikace se pokouší použít URL, která není v seznamu povolených callback URL v Auth0 dashboardu.

**Řešení**:
1. Přidat chybějící URL do seznamu povolených callback URL v Auth0 dashboardu, nebo
2. Upravit aplikaci, aby používala správnou callback URL

### 2. Chybějící protokol
```
Callback URL mismatch. www.quicksoft.fun/callback is not in the list of allowed callback URLs
```

**Příčina**: URL neobsahuje protokol (http:// nebo https://).

**Řešení**: Vždy používat kompletní URL včetně protokolu.

### 3. Chybějící cesta /callback
```
Callback URL mismatch. https://www.quicksoft.fun is not in the list of allowed callback URLs
```

**Příčina**: Aplikace používá hlavní doménu místo specifické callback cesty.

**Řešení**: Upravit aplikaci, aby používala správnou cestu (např. `/callback` nebo `/auth/callback`).

### 4. Nesprávný port
```
Callback URL mismatch. http://localhost:8080/callback is not in the list of allowed callback URLs
```

**Příčina**: Aplikace běží na jiném portu, než je nakonfigurováno v Auth0.

**Řešení**: Aktualizovat port v Auth0 dashboardu nebo změnit port aplikace.

## Řešení problémů

### 1. Kontrola konfigurace v Auth0 dashboardu
- Přejděte do Auth0 dashboardu > Applications > [Vaše aplikace] > Settings
- Zkontrolujte sekci "Application URIs"
- Ujistěte se, že všechny potřebné URL jsou v seznamu povolených

### 2. Kontrola konfigurace v aplikaci
- Zkontrolujte nastavení Auth0 v souboru `.env` nebo `.env.production`
- Ujistěte se, že proměnná `AUTH0_CALLBACK_URL` obsahuje správnou hodnotu
- Zkontrolujte, zda aplikace používá tuto proměnnou při inicializaci Auth0

### 3. Explicitní nastavení redirect_uri
V některých případech je potřeba explicitně nastavit `redirect_uri` v konfiguraci Auth0:

```javascript
const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  routes: {
    callback: '/callback'
  },
  authorizationParams: {
    response_type: 'code',
    redirect_uri: process.env.AUTH0_CALLBACK_URL,
    scope: process.env.AUTH0_SCOPE
  }
};
```

### 4. Kontrola přesměrování v Netlify
Pokud používáte Netlify, ujistěte se, že máte správně nakonfigurované přesměrování v souboru `netlify.toml`:

```toml
[[redirects]]
  from = "/callback"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Problémy s Content Security Policy (CSP)

Content Security Policy (CSP) je bezpečnostní mechanismus, který pomáhá předcházet útokům typu Cross-Site Scripting (XSS) a dalším útokům na webové stránky. CSP definuje, které zdroje obsahu (skripty, styly, obrázky atd.) může prohlížeč načíst.

### Časté chyby s CSP

#### 1. Blokování externích skriptů

```
Refused to load the script 'https://cdn.jsdelivr.net/npm/chart.js' because it violates the following Content Security Policy directive: "script-src 'self' 'unsafe-inline' https://*.auth0.com".
```

**Příčina**: CSP povoluje načítání skriptů pouze z domén uvedených v direktivě `script-src`.

**Řešení**: Přidat doménu do direktivy `script-src` v hlavičce CSP.

#### 2. Blokování API volání

```
Refused to connect to 'https://api.example.com' because it violates the following Content Security Policy directive: "connect-src 'self' https://*.auth0.com".
```

**Příčina**: CSP povoluje připojení pouze k doménám uvedeným v direktivě `connect-src`.

**Řešení**: Přidat doménu do direktivy `connect-src` v hlavičce CSP.

### Řešení problémů s CSP v Netlify

V souboru `netlify.toml` je CSP definována v sekci `[[headers]]`. Zde je příklad správné konfigurace CSP, která povoluje načítání obsahu z Auth0, Supabase a dalších běžně používaných zdrojů:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self' https://*.auth0.com https://*.supabase.co; script-src 'self' 'unsafe-inline' https://*.auth0.com https://cdn.jsdelivr.net https://api.mapy.cz; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.auth0.com; connect-src 'self' https://*.auth0.com https://*.supabase.co https://api.mapy.cz;"
```

### Běžné zdroje, které je potřeba povolit

- **Auth0**: `https://*.auth0.com`
- **Supabase**: `https://*.supabase.co`
- **CDN pro knihovny**: `https://cdn.jsdelivr.net`, `https://unpkg.com`
- **Mapové API**: `https://api.mapy.cz`, `https://api.openrouteservice.org`
- **Google služby**: `https://*.googleapis.com`, `https://*.gstatic.com`

### Testování CSP

Pro testování CSP můžete použít nástroj [CSP Evaluator](https://csp-evaluator.withgoogle.com/) od Google, který vám pomůže identifikovat potenciální bezpečnostní problémy ve vaší CSP konfiguraci.

### Dočasné vypnutí CSP pro vývoj

Během vývoje můžete CSP dočasně vypnout nebo zmírnit, abyste mohli snáze identifikovat problémy:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';"
```

**VAROVÁNÍ**: Toto nastavení je velmi permisivní a mělo by být použito pouze pro vývoj, nikdy ne v produkčním prostředí!

## Automatická oprava

Zde je skript, který můžete použít pro automatickou opravu problémů s callback URL:

```javascript
/**
 * Automatická oprava problémů s Auth0 callback URL
 */
function fixAuth0CallbackIssues() {
  // Získání aktuální konfigurace
  const auth0Config = getAuth0Config();

  // Kontrola, zda je explicitně nastavena redirect_uri
  if (!auth0Config.authorizationParams || !auth0Config.authorizationParams.redirect_uri) {
    console.log('Chybí explicitní nastavení redirect_uri, přidávám...');

    // Přidání authorizationParams, pokud neexistuje
    if (!auth0Config.authorizationParams) {
      auth0Config.authorizationParams = {};
    }

    // Nastavení redirect_uri
    auth0Config.authorizationParams.redirect_uri = process.env.AUTH0_CALLBACK_URL ||
      `${process.env.BASE_URL}/callback`;

    console.log(`Nastavena redirect_uri: ${auth0Config.authorizationParams.redirect_uri}`);
  }

  // Kontrola, zda je správně nastavena cesta pro callback
  if (!auth0Config.routes || !auth0Config.routes.callback) {
    console.log('Chybí nastavení cesty pro callback, přidávám...');

    // Přidání routes, pokud neexistuje
    if (!auth0Config.routes) {
      auth0Config.routes = {};
    }

    // Nastavení callback cesty
    auth0Config.routes.callback = '/callback';

    console.log(`Nastavena callback cesta: ${auth0Config.routes.callback}`);
  }

  // Uložení aktualizované konfigurace
  saveAuth0Config(auth0Config);

  console.log('Auth0 konfigurace byla úspěšně aktualizována');
}
```

## Příklady konfigurace

### Express.js s express-openid-connect

```javascript
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  routes: {
    callback: '/callback'
  },
  authorizationParams: {
    response_type: 'code',
    redirect_uri: process.env.AUTH0_CALLBACK_URL,
    scope: 'openid profile email'
  }
};

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// Endpoint pro zobrazení profilu uživatele
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});
```

### Soubor .env pro lokální vývoj

```
# Auth0 konfigurace
AUTH0_DOMAIN=dev-zxj8pir0moo4pdk7.us.auth0.com
AUTH0_CLIENT_ID=H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ
AUTH0_CLIENT_SECRET=e4uncVy8-5pqixbck29RKi1V61BT-B6G5L65dCkLR_pW_TIA8WRhVcfULycOibSW
AUTH0_SECRET=e4uncVy8-5pqixbck29RKi1V61BT-B6G5L65dCkLR_pW_TIA8WRhVcfULycOibSW
BASE_URL=http://localhost:3000
AUTH0_CALLBACK_URL=http://localhost:3000/callback
AUTH0_LOGOUT_URL=http://localhost:3000
AUTH0_SCOPE="openid profile email read:users read:user_idp_tokens"
AUTH0_AUDIENCE=https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/
```

### Soubor .env.production pro produkční prostředí

```
# Auth0 konfigurace
AUTH0_DOMAIN=dev-zxj8pir0moo4pdk7.us.auth0.com
AUTH0_CLIENT_ID=H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ
AUTH0_CLIENT_SECRET=e4uncVy8-5pqixbck29RKi1V61BT-B6G5L65dCkLR_pW_TIA8WRhVcfULycOibSW
AUTH0_SECRET=e4uncVy8-5pqixbck29RKi1V61BT-B6G5L65dCkLR_pW_TIA8WRhVcfULycOibSW
BASE_URL=https://www.quicksoft.fun
AUTH0_CALLBACK_URL=https://www.quicksoft.fun/callback
AUTH0_LOGOUT_URL=https://www.quicksoft.fun
AUTH0_SCOPE="openid profile email read:users read:user_idp_tokens"
AUTH0_AUDIENCE=https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/
```

### Netlify.toml

```toml
[build]
  command = "npm run build:netlify"
  publish = "public/dist"

[[redirects]]
  from = "/callback"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self' https://*.auth0.com https://*.supabase.co; script-src 'self' 'unsafe-inline' https://*.auth0.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.auth0.com; connect-src 'self' https://*.auth0.com https://*.supabase.co;"
```

---

Tento dokument by měl sloužit jako komplexní průvodce pro řešení problémů s Auth0 callback URL. Pokud narazíte na další problémy, neváhejte tento dokument aktualizovat o nové poznatky a řešení.
