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
AUTH0_CALLBACK_URL=http://localhost:3000/callback
AUTH0_LOGOUT_URL=http://localhost:3000
AUTH0_AUDIENCE=https://vas-tenant.auth0.com/api/v2/
AUTH0_SCOPE=openid profile email read:users read:user_idp_tokens
```

### Auth0 Dashboard

V Auth0 dashboardu je potřeba nastavit:

1. **Application Login URI**: `https://remarkable-cajeta-76cfd9.netlify.app/login`
2. **Allowed Callback URLs**: 
   ```
   http://localhost:3000/callback,
   https://remarkable-cajeta-76cfd9.netlify.app/map.html/callback
   ```
3. **Allowed Logout URLs**: 
   ```
   http://localhost:3000,
   http://remarkable-cajeta-76cfd9.netlify.app,
   https://remarkable-cajeta-76cfd9.netlify.app/map.html,
   https://remarkable-cajeta-76cfd9.netlify.app/netlify/functions/server/logout
   ```
4. **Allowed Web Origins**: 
   ```
   http://localhost:3000,
   https://remarkable-cajeta-76cfd9.netlify.app
   ```

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
   - Problém: Callback URL v požadavku neodpovídá URL registrované v Auth0 dashboardu
   - Řešení: Ujistěte se, že `AUTH0_CALLBACK_URL` odpovídá URL registrované v Auth0 dashboardu

4. **Chyba "invalid_client: Client authentication failed"**
   - Problém: Nesprávné Client ID nebo Client Secret
   - Řešení: Zkontrolujte, že `AUTH0_CLIENT_ID` a `AUTH0_CLIENT_SECRET` jsou správně nastaveny

### Další zdroje

- [Auth0 dokumentace](https://auth0.com/docs/)
- [express-openid-connect dokumentace](https://github.com/auth0/express-openid-connect)
- [Auth0 Community](https://community.auth0.com/)
