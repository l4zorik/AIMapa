# Auth0 Endpointy - Dokumentace

Tento dokument obsahuje přehled všech Auth0 endpointů používaných v aplikaci AIMapa.

## Auth0 API Endpointy

### 1. Autorizační endpoint
- **URL**: `https://{tenant}.auth0.com/authorize`
- **Metoda**: GET
- **Parametry**:
  - `client_id`: ID vaší aplikace
  - `redirect_uri`: URL pro přesměrování po přihlášení
  - `response_type`: typ odpovědi (code, token)
  - `scope`: požadované scopes (openid profile email)
  - `audience`: API audience
  - `state`: náhodný řetězec pro ochranu proti CSRF
- **Použití**: Zahájení přihlašovacího procesu
- **Příklad**:
  ```
  https://dev-zxj8pir0moo4pdk7.us.auth0.com/authorize?
  client_id=your-client-id&
  redirect_uri=http://localhost:3000/callback&
  response_type=code&
  scope=openid%20profile%20email&
  audience=https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/
  ```

### 2. Token endpoint
- **URL**: `https://{tenant}.auth0.com/oauth/token`
- **Metoda**: POST
- **Parametry**:
  - `grant_type`: typ grantu (authorization_code, refresh_token)
  - `client_id`: ID vaší aplikace
  - `client_secret`: Secret vaší aplikace
  - `code`: autorizační kód (při grant_type=authorization_code)
  - `redirect_uri`: URL pro přesměrování
- **Použití**: Výměna autorizačního kódu za tokeny
- **Příklad**:
  ```json
  {
    "grant_type": "authorization_code",
    "client_id": "your-client-id",
    "client_secret": "your-client-secret",
    "code": "authorization-code",
    "redirect_uri": "http://localhost:3000/callback"
  }
  ```

### 3. Userinfo endpoint
- **URL**: `https://{tenant}.auth0.com/userinfo`
- **Metoda**: GET
- **Hlavičky**:
  - `Authorization`: Bearer {access_token}
- **Použití**: Získání informací o přihlášeném uživateli
- **Příklad**:
  ```
  GET https://dev-zxj8pir0moo4pdk7.us.auth0.com/userinfo
  Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

### 4. Logout endpoint
- **URL**: `https://{tenant}.auth0.com/v2/logout`
- **Metoda**: GET
- **Parametry**:
  - `client_id`: ID vaší aplikace
  - `returnTo`: URL pro přesměrování po odhlášení
- **Použití**: Odhlášení uživatele
- **Příklad**:
  ```
  https://dev-zxj8pir0moo4pdk7.us.auth0.com/v2/logout?
  client_id=your-client-id&
  returnTo=http://localhost:3000
  ```

## Aplikační Endpointy

### 1. Login endpoint
- **URL**: `/login`
- **Metoda**: GET
- **Implementace**: Přesměrování na Auth0 autorizační endpoint
- **Použití**: Zahájení přihlašovacího procesu
- **Kód**:
  ```javascript
  app.get('/login', (req, res) => {
    res.oidc.login({ returnTo: '/' });
  });
  ```

### 2. Callback endpoint
- **URL**: `/callback`
- **Metoda**: GET
- **Parametry**:
  - `code`: autorizační kód
  - `state`: stav pro ověření CSRF
- **Implementace**: Zpracování odpovědi z Auth0
- **Použití**: Zpracování odpovědi po přihlášení
- **Poznámka**: Tento endpoint je automaticky zpracován Auth0 middlewarem

### 3. Logout endpoint
- **URL**: `/logout`
- **Metoda**: GET
- **Implementace**: Přesměrování na Auth0 logout endpoint
- **Použití**: Odhlášení uživatele
- **Kód**:
  ```javascript
  app.get('/logout', (req, res) => {
    res.oidc.logout({ returnTo: '/' });
  });
  ```

### 4. Auth Status endpoint
- **URL**: `/auth/status`
- **Metoda**: GET
- **Implementace**: Vrací informace o stavu autentizace
- **Použití**: Diagnostika Auth0 konfigurace
- **Kód**:
  ```javascript
  app.get('/auth/status', (req, res) => {
    res.json({
      isAuthenticated: req.oidc?.isAuthenticated() || false,
      user: req.oidc?.user || null,
      authLibraryVersion: require('express-openid-connect/package.json').version
    });
  });
  ```

### 5. Auth Debug endpoint
- **URL**: `/auth/debug`
- **Metoda**: GET
- **Implementace**: Vrací detailní informace o autentizaci
- **Použití**: Pokročilá diagnostika Auth0
- **Kód**:
  ```javascript
  app.get('/auth/debug', (req, res) => {
    res.json({
      isAuthenticated: req.oidc?.isAuthenticated() || false,
      user: req.oidc?.user || null,
      idToken: req.oidc?.idToken,
      accessToken: req.oidc?.accessToken?.access_token ? 'Přítomen' : 'Nepřítomen',
      idTokenClaims: req.oidc?.idTokenClaims,
      authorizationParams: req.oidc?.authorizationParams,
      isExpired: req.oidc?.accessToken?.isExpired() || false,
      expiresAt: req.oidc?.accessToken?.claims?.exp ? 
        new Date(req.oidc.accessToken.claims.exp * 1000).toISOString() : null
    });
  });
  ```

## Konfigurace Auth0

### Auth0 Dashboard Nastavení
- **Application Login URI**: `https://remarkable-cajeta-76cfd9.netlify.app/login`
- **Allowed Callback URLs**: 
  ```
  http://localhost:3000/callback,
  https://remarkable-cajeta-76cfd9.netlify.app/map.html/callback
  ```
- **Allowed Logout URLs**: 
  ```
  http://localhost:3000,
  http://remarkable-cajeta-76cfd9.netlify.app,
  https://remarkable-cajeta-76cfd9.netlify.app/map.html,
  https://remarkable-cajeta-76cfd9.netlify.app/netlify/functions/server/logout
  ```
- **Allowed Web Origins**: 
  ```
  http://localhost:3000,
  https://remarkable-cajeta-76cfd9.netlify.app
  ```

### Proměnné prostředí
- `AUTH0_DOMAIN`: Doména vašeho Auth0 tenantu
- `AUTH0_CLIENT_ID`: Client ID vaší Auth0 aplikace
- `AUTH0_CLIENT_SECRET`: Client Secret vaší Auth0 aplikace
- `AUTH0_CALLBACK_URL`: URL pro přesměrování po přihlášení
- `AUTH0_LOGOUT_URL`: URL pro přesměrování po odhlášení
- `AUTH0_AUDIENCE`: API audience
- `AUTH0_SCOPE`: Požadované scopes
