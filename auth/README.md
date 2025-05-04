# Auth0 Integrace

Tato složka obsahuje soubory pro integraci Auth0 autentizace do aplikace AIMapa.

## Obsah složky

- **auth0-service.js** - Hlavní třída pro práci s Auth0 autentizací
- **auth0-routes.js** - Express routy pro Auth0 endpointy
- **auth0-test.js** - Testovací nástroj pro Auth0 endpointy
- **auth0-endpoints.md** - Dokumentace všech Auth0 endpointů

## Použití

### Inicializace Auth0 Service

```javascript
const Auth0Service = require('./auth/auth0-service');

// Inicializace Auth0 service
const auth0Service = new Auth0Service({
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    secret: process.env.AUTH0_CLIENT_SECRET,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: process.env.AUTH0_SCOPE || 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE
});

// Použití Auth0 middleware
app.use(auth0Service.getMiddleware());
```

### Registrace Auth0 Routes

```javascript
const createAuth0Routes = require('./auth/auth0-routes');

// Registrace Auth0 routes
app.use('/', createAuth0Routes(auth0Service));
app.use('/auth', createAuth0Routes(auth0Service));
```

### Ochrana endpointů

```javascript
// Ochrana endpointu - vyžaduje přihlášení
app.get('/profile', auth0Service.requireAuth(), (req, res) => {
    res.json(auth0Service.getUserProfile(req));
});

// Ochrana endpointu - vyžaduje roli
app.get('/admin', auth0Service.requireRole('admin'), (req, res) => {
    res.json({ message: 'Admin dashboard' });
});

// Ochrana endpointu - vyžaduje vlastnictví záznamu
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

## Testování

Pro testování Auth0 endpointů můžete použít nástroj `auth0-test.js`:

```bash
# Zobrazení všech testů
node auth/auth0-test.js

# Výměna autorizačního kódu za token
node auth/auth0-test.js exchange-code KOD
```

## Konfigurace

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

## Diagnostika

Pro diagnostiku Auth0 integrace můžete použít endpoint `/auth/debug`:

```bash
curl http://localhost:3000/auth/debug
```

Tento endpoint vrátí detailní informace o Auth0 konfiguraci a stavu autentizace.
