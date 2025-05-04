# Průvodce Auth0 endpointy v Express aplikaci

Tento dokument vysvětluje, jak pracovat s Auth0 endpointy ve vaší Express aplikaci.

## Základní Auth0 endpointy

Když integrujete Auth0 do vaší Express aplikace pomocí knihovny `express-openid-connect`, automaticky se vytvoří následující endpointy:

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/login` | GET | Přesměruje uživatele na Auth0 přihlašovací stránku |
| `/logout` | GET | Odhlásí uživatele a přesměruje na nastavenou URL |
| `/callback` | GET | Endpoint, kam Auth0 přesměruje po úspěšné autentizaci |

## Jak testovat endpointy

### 1. Pomocí webového prohlížeče

Nejjednodušší způsob, jak otestovat Auth0 endpointy, je navštívit je ve webovém prohlížeči:

- `http://localhost:3000/login` - mělo by vás přesměrovat na Auth0 přihlašovací stránku
- `http://localhost:3000/logout` - mělo by vás odhlásit a přesměrovat na domovskou stránku

### 2. Pomocí curl v terminálu

```bash
# Test přihlašovacího endpointu (vrátí přesměrování)
curl -v http://localhost:3000/login

# Test API endpointu (pokud je chráněný, vrátí 401 Unauthorized)
curl -v http://localhost:3000/api/protected

# Test veřejného API endpointu
curl -v http://localhost:3000/api/public
```

### 3. Pomocí nástroje pro výpis cest

Můžete použít přiložený skript `list-routes.js` pro výpis všech dostupných endpointů:

```bash
node list-routes.js
```

### 4. Pomocí nástroje pro testování endpointů

Můžete použít přiložený skript `test-auth0-endpoints.js` pro testování dostupnosti Auth0 endpointů:

```bash
node test-auth0-endpoints.js
```

## Přizpůsobení Auth0 endpointů

V souboru `server.js` můžete přizpůsobit cesty Auth0 endpointů:

```javascript
// Auth0 konfigurace
const auth0Config = {
  // ...
  routes: {
    login: '/prihlaseni',      // Vlastní cesta pro přihlášení
    logout: '/odhlaseni',      // Vlastní cesta pro odhlášení
    callback: '/auth-callback' // Vlastní cesta pro callback
  }
  // ...
};

// Auth router
app.use(auth(auth0Config));
```

## Zabezpečení API endpointů

Pro zabezpečení API endpointů můžete použít middleware `requiresAuth()`:

```javascript
const { requiresAuth } = require('express-openid-connect');

// Veřejný endpoint
app.get('/api/public', (req, res) => {
  res.json({ message: 'Toto je veřejný endpoint' });
});

// Chráněný endpoint
app.get('/api/protected', requiresAuth(), (req, res) => {
  res.json({ 
    message: 'Toto je chráněný endpoint',
    user: req.oidc.user
  });
});
```

## Kontrola stavu autentizace

V šablonách nebo API odpovědích můžete kontrolovat, zda je uživatel přihlášen:

```javascript
app.get('/', (req, res) => {
  res.json({
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.isAuthenticated() ? req.oidc.user : null
  });
});
```
