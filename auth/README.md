# Auth0 a Supabase Integrace

Tato složka obsahuje soubory pro integraci Auth0 autentizace a Supabase databáze do aplikace AIMapa.

## Obsah složky

- **auth0-service.js** - Hlavní třída pro práci s Auth0 autentizací
- **auth0-routes.js** - Express routy pro Auth0 endpointy
- **auth0-test.js** - Testovací nástroj pro Auth0 endpointy
- **auth0-endpoints.md** - Dokumentace všech Auth0 endpointů
- **supabase-auth-sync.js** - Třída pro synchronizaci uživatelů mezi Auth0 a Supabase

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

## Synchronizace s Supabase

Pro synchronizaci uživatelů mezi Auth0 a Supabase použijte třídu `SupabaseAuthSync`:

```javascript
const SupabaseAuthSync = require('./auth/supabase-auth-sync');

// Inicializace Supabase Auth Sync
const supabaseAuthSync = new SupabaseAuthSync({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
});

// Middleware pro synchronizaci uživatelů mezi Auth0 a Supabase
app.use(supabaseAuthSync.createSyncMiddleware());
```

### API endpointy pro uživatelská data

Pro práci s uživatelskými daty jsou k dispozici následující API endpointy:

- `GET /api/user/profile` - Získá profil přihlášeného uživatele
- `PUT /api/user/profile` - Aktualizuje profil přihlášeného uživatele
- `GET /api/user/settings` - Získá uživatelská nastavení
- `PUT /api/user/settings` - Aktualizuje uživatelská nastavení

## Konfigurace

Pro správnou funkci Auth0 a Supabase integrace je potřeba nastavit následující proměnné prostředí:

```
# Auth0 konfigurace
AUTH0_DOMAIN=vas-tenant.auth0.com
AUTH0_CLIENT_ID=vase-client-id
AUTH0_CLIENT_SECRET=vase-client-secret
AUTH0_CALLBACK_URL=http://localhost:3000/callback
AUTH0_LOGOUT_URL=http://localhost:3000
AUTH0_AUDIENCE=https://vas-tenant.auth0.com/api/v2/
AUTH0_SCOPE=openid profile email read:users read:user_idp_tokens

# Supabase konfigurace
SUPABASE_URL=https://vas-projekt.supabase.co
SUPABASE_KEY=vase-anon-key
SUPABASE_SERVICE_KEY=vase-service-role-key
```

## Diagnostika

Pro diagnostiku Auth0 integrace můžete použít endpoint `/auth/debug`:

```bash
curl http://localhost:3000/auth/debug
```

Tento endpoint vrátí detailní informace o Auth0 konfiguraci a stavu autentizace.

## Skripty pro správu

Pro správu uživatelů a tabulek v Supabase jsou k dispozici následující skripty:

```bash
# Vytvoření tabulky users v Supabase
npm run db:create-users

# Synchronizace uživatelů z Auth0 do Supabase
npm run db:sync-auth0
```

## Další dokumentace

Podrobnější dokumentace je k dispozici v souboru `docs/auth0-supabase-integration.md`.
