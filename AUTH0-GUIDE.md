# Auth0 Integrace - Průvodce pro vývojáře

Tento dokument popisuje, jak pracovat s Auth0 autentizací v aplikaci AIMapa.

## Obsah

1. [Úvod](#úvod)
2. [Konfigurace](#konfigurace)
3. [Přihlášení a odhlášení](#přihlášení-a-odhlášení)
4. [Ochrana endpointů](#ochrana-endpointů)
5. [Získání informací o uživateli](#získání-informací-o-uživateli)
6. [Testování](#testování)
7. [Řešení problémů](#řešení-problémů)

## Úvod

AIMapa používá Auth0 pro autentizaci uživatelů. Auth0 je služba, která poskytuje autentizaci a autorizaci jako službu. Umožňuje přihlašování pomocí různých poskytovatelů identity (Google, Facebook, atd.) a poskytuje jednotné API pro práci s uživateli.

V aplikaci AIMapa je Auth0 integrace implementována pomocí knihovny `express-openid-connect` a vlastní `Auth0Service` třídy, která poskytuje jednoduché API pro práci s Auth0.

## Konfigurace

### Proměnné prostředí

Pro správnou funkci Auth0 integrace je potřeba nastavit následující proměnné prostředí:

```
AUTH0_DOMAIN=vas-tenant.auth0.com
AUTH0_CLIENT_ID=vase-client-id
AUTH0_CLIENT_SECRET=vase-client-secret
AUTH0_DOMAIN=vas-tenant.auth0.com
AUTH0_CLIENT_ID=vase-client-id
AUTH0_CLIENT_SECRET=vase-client-secret
# Toto je PLNÁ URL adresa, na kterou Auth0 přesměruje uživatele po úspěšném přihlášení.
# Musí PŘESNĚ odpovídat jedné z URL nakonfigurovaných v Auth0 dashboardu v sekci "Allowed Callback URLs".
# Aplikace interně používá cestu /callback, takže tato URL by měla být BASE_URL + /callback.
# Příklad: http://localhost:3000/callback nebo https://vasa-aplikace.com/callback
AUTH0_CALLBACK_URL=http://localhost:3000/callback

# Toto je PLNÁ URL adresa, na kterou Auth0 může přesměrovat uživatele po úspěšném odhlášení.
# Musí PŘESNĚ odpovídat jedné z URL nakonfigurovaných v Auth0 dashboardu v sekci "Allowed Logout URLs".
# Příklad: http://localhost:3000 nebo https://vasa-aplikace.com
AUTH0_LOGOUT_URL=http://localhost:3000

AUTH0_AUDIENCE=https://vas-tenant.auth0.com/api/v2/
# Rozsah oprávnění, která vaše aplikace požaduje.
# 'openid profile email' jsou standardní. Další můžete přidat podle potřeby API.
AUTH0_SCOPE=openid profile email read:users read:user_idp_tokens

# Základní URL vaší aplikace. Používá se pro konstrukci callback a logout URL, pokud nejsou plně specifikovány jinde.
# V produkci by to měla být vaše veřejná URL, např. https://remarkable-cajeta-76cfd9.netlify.app
BASE_URL=http://localhost:3000
AUTH0_SCOPE=openid profile email read:users read:user_idp_tokens
```

### Auth0 Dashboard

V Auth0 dashboardu je potřeba nastavit následující hodnoty, které musí být synchronizovány s konfigurací vaší aplikace (proměnné prostředí a `auth0-service.js`):

1.  **Application Login URI**:
    *   Toto je URL ve vaší aplikaci, kam Auth0 může přesměrovat uživatele k zahájení přihlašovacího procesu (např. při IdP-initiated login).
    *   Příklad z konfigurace: `https://remarkable-cajeta-76cfd9.netlify.app/login` (pokud máte takovou stránku).
    *   `auth0-service.js` primárně spoléhá na `baseURL` a `routes.login` (`/login` ve výchozím nastavení) pro generování přihlašovacích URL.

2.  **Allowed Callback URLs**:
    *   Toto je **kriticky důležité** nastavení pro bezpečnost. Auth0 povolí přesměrování **pouze** na URL uvedené v tomto seznamu.
    *   Aplikace AIMapa, po úpravě `auth0-service.js`, konzistentně používá callback cestu `/callback`.
    *   Proto zde musíte uvést PLNÉ callback URL, které odpovídají vašim prostředím:
        *   Pro lokální vývoj (za předpokladu `BASE_URL=http://localhost:3000`): `http://localhost:3000/callback`
        *   Pro produkční prostředí (např. Netlify): `https://remarkable-cajeta-76cfd9.netlify.app/callback`
    *   **Odstraňte nestandardní URL jako `https://remarkable-cajeta-76cfd9.netlify.app/map.html/callback`**, pokud to není specifický a oddělený OAuth tok s vlastní konfigurací. Pro hlavní tok přihlášení použijte standardní `/callback`.
    *   Ujistěte se, že hodnota proměnné prostředí `AUTH0_CALLBACK_URL` přesně odpovídá jedné z těchto URL.

3.  **Allowed Logout URLs**:
    *   Sem patří všechny URL, na které může být uživatel přesměrován po odhlášení z Auth0.
    *   Knihovna `express-openid-connect` standardně přesměruje na `baseURL` aplikace, pokud není specifikováno jinak.
    *   Doporučené hodnoty (musí odpovídat `AUTH0_LOGOUT_URL` a vašim prostředím):
        *   Pro lokální vývoj: `http://localhost:3000`
        *   Pro produkci: `https://remarkable-cajeta-76cfd9.netlify.app`
    *   Můžete přidat i další specifické stránky, např. `https://remarkable-cajeta-76cfd9.netlify.app/logged-out`.
    *   **Zkontrolujte a případně zjednodušte seznam:** URL jako `https://remarkable-cajeta-76cfd9.netlify.app/map.html` nebo `https://remarkable-cajeta-76cfd9.netlify.app/netlify/functions/server/logout` by měly být zahrnuty pouze pokud jsou to skutečně zamýšlené cíle po odhlášení.

4.  **Allowed Web Origins**:
    *   URL, ze kterých jsou povoleny požadavky na Auth0 (typicky pro Cross-Origin Authentication).
    *   Příklady:
        *   `http://localhost:3000`
        *   `https://remarkable-cajeta-76cfd9.netlify.app`

**Důležitá poznámka k `BASE_URL` vs `AUTH0_CALLBACK_URL` a `AUTH0_LOGOUT_URL`:**
*   `BASE_URL` (nebo `process.env.BASE_URL` v `auth0-service.js`) je základní adresa vaší aplikace (např. `http://localhost:3000`).
*   `auth0-service.js` používá `baseURL` a nakonfigurovanou cestu pro callback (`/callback`) k sestavení úplné URL pro `redirect_uri` při přihlašování. Tato sestavená URL se musí shodovat s jednou z "Allowed Callback URLs" v Auth0.
*   Proměnná prostředí `AUTH0_CALLBACK_URL` by měla být nastavena na *přesně tu samou úplnou URL*, která je registrována v Auth0 a kterou aplikace používá. Slouží spíše jako explicitní záznam a pro diagnostiku.
*   Podobně `AUTH0_LOGOUT_URL` je pro explicitní záznam a pro registraci v Auth0. Skutečné přesměrování po odhlášení řídí `express-openid-connect` (často na `baseURL`).

## Přihlášení a odhlášení

### Přihlášení uživatele

Pro přihlášení uživatele stačí přesměrovat na `/login` endpoint:

```javascript
// V klientském kódu
function login() {
  window.location.href = '/login';
}
```

### Odhlášení uživatele

Pro odhlášení uživatele přesměrujte na `/logout` endpoint:

```javascript
// V klientském kódu
function logout() {
  window.location.href = '/logout';
}
```

## Ochrana endpointů

### Vyžadování přihlášení

Pro ochranu endpointu, který vyžaduje přihlášení, použijte middleware `requireAuth()`:

```javascript
const auth0Service = require('./auth/auth0-service');

app.get('/profile', auth0Service.requireAuth(), (req, res) => {
  res.json(auth0Service.getUserProfile(req));
});
```

### Vyžadování role

Pro ochranu endpointu, který vyžaduje určitou roli, použijte middleware `requireRole()`:

```javascript
app.get('/admin', auth0Service.requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin dashboard' });
});
```

### Vyžadování vlastnictví záznamu

Pro ochranu endpointu, který vyžaduje vlastnictví záznamu, použijte middleware `requireOwnership()`:

```javascript
app.put('/routes/:id', auth0Service.requireOwnership('routes', 
  async (req) => {
    const { data } = await req.supabaseClient
      .from('routes')
      .select('user_id')
      .eq('id', req.params.id)
      .single();
    return data?.user_id;
  }
), async (req, res) => {
  // Aktualizace trasy
});
```

## Získání informací o uživateli

### Kontrola, zda je uživatel přihlášen

```javascript
const isAuthenticated = auth0Service.isAuthenticated(req);
```

### Získání profilu uživatele

```javascript
const userProfile = auth0Service.getUserProfile(req);
```

### Získání ID uživatele

```javascript
const userId = auth0Service.getUserId(req);
```

### Získání access tokenu

```javascript
const accessToken = auth0Service.getAccessToken(req);
```

## Testování

### Testování pomocí auth0-test.js

Pro testování Auth0 endpointů můžete použít nástroj `auth0-test.js`:

```bash
# Zobrazení všech testů
node auth/auth0-test.js

# Výměna autorizačního kódu za token
node auth/auth0-test.js exchange-code KOD
```

### Testování pomocí curl

```bash
# Test přihlašovacího endpointu
curl -v http://localhost:3000/login

# Test API endpointu
curl -v http://localhost:3000/api/test

# Test Auth0 statusu
curl -v http://localhost:3000/auth/status

# Test Auth0 diagnostiky
curl -v http://localhost:3000/auth/debug
```

## Řešení problémů

### Diagnostika Auth0 konfigurace

Pro diagnostiku Auth0 konfigurace můžete použít endpoint `/auth/debug`:

```bash
curl http://localhost:3000/auth/debug
```

### Časté problémy

1. **Chyba "req.oidc.login is not a function"**
   - Problém: Používáte starší verzi express-openid-connect
   - Řešení: Použijte `res.oidc.login()` místo `req.oidc.login()`

2. **Chyba "Object didn't pass validation for format absolute-https-uri-or-empty"**
   - Problém: Application Login URI musí být HTTPS URL nebo prázdné
   - Řešení: Použijte HTTPS URL nebo nechte pole prázdné

3. **Chyba "invalid_request: The redirect_uri MUST match the registered callback URL"**
   - Problém: Callback URL použitá v požadavku na Auth0 (typicky `BASE_URL` + `/callback`) neodpovídá žádné z URL registrovaných v sekci "Allowed Callback URLs" v Auth0 dashboardu.
   - Řešení: Ujistěte se, že vaše "Allowed Callback URLs" v Auth0 dashboardu PŘESNĚ obsahují URL, kterou vaše aplikace používá (např. `http://localhost:3000/callback` pro lokální vývoj a `https://VASE_PRODUKCNI_URL/callback` pro produkci). Zkontrolujte také hodnotu `BASE_URL` (nebo `AUTH0_CALLBACK_URL`, pokud ji používáte k ověření) ve vaší konfiguraci.

4. **Chyba "invalid_client: Client authentication failed"**
   - Problém: Nesprávné Client ID nebo Client Secret
   - Řešení: Zkontrolujte, že `AUTH0_CLIENT_ID` a `AUTH0_CLIENT_SECRET` jsou správně nastaveny

### Další zdroje

- [Auth0 dokumentace](https://auth0.com/docs/)
- [express-openid-connect dokumentace](https://github.com/auth0/express-openid-connect)
- [Auth0 Community](https://community.auth0.com/)
