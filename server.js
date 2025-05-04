/**
 * AIMapa - Server
 * Verze 0.3.8.7
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { auth } = require('express-openid-connect');
const supabaseService = require('./supabase-service');
const Auth0Service = require('./auth/auth0-service');
const createAuth0Routes = require('./auth/auth0-routes');
const SupabaseAuthSync = require('./auth/supabase-auth-sync');

// Middleware imports
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter, authLimiter, helmetConfig } = require('./middleware/security');
const APILogger = require('./middleware/apiLogger');

// Načtení .env souboru
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
    console.log('Načteny produkční proměnné prostředí z .env.production');
} else {
    require('dotenv').config();
    console.log('Načteny vývojové proměnné prostředí z .env');
}

// Kontrola načtení proměnných prostředí
console.log('Kontrola načtení proměnných prostředí:');
console.log('AUTH0_DOMAIN:', process.env.AUTH0_DOMAIN ? 'Načteno' : 'Chybí');
console.log('AUTH0_CLIENT_ID:', process.env.AUTH0_CLIENT_ID ? 'Načteno' : 'Chybí');
console.log('AUTH0_CLIENT_SECRET:', process.env.AUTH0_CLIENT_SECRET ? 'Načteno' : 'Chybí');
console.log('AUTH0_AUDIENCE:', process.env.AUTH0_AUDIENCE ? 'Načteno' : 'Chybí');
console.log('AUTH0_CALLBACK_URL:', process.env.AUTH0_CALLBACK_URL ? 'Načteno' : 'Chybí');
console.log('AUTH0_LOGOUT_URL:', process.env.AUTH0_LOGOUT_URL ? 'Načteno' : 'Chybí');
console.log('AUTH0_SCOPE:', process.env.AUTH0_SCOPE ? 'Načteno' : 'Chybí');

const app = express();

// Základní middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmetConfig);

// API Logger
const apiLogger = new APILogger({
    logToConsole: process.env.NODE_ENV !== 'production',
    logToSupabase: true,
    excludePaths: ['/health', '/metrics', '/_next', '/static', '/auth/status', '/auth/debug']
});
app.use(apiLogger.middleware());

// Rate limiting
app.use('/api/', apiLimiter);
app.use(['/login', '/callback', '/register'], authLimiter);

// Inicializace Auth0 service
const auth0Service = new Auth0Service({
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    secret: process.env.AUTH0_CLIENT_SECRET,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    scope: process.env.AUTH0_SCOPE || 'openid profile email read:users read:user_idp_tokens',
    audience: process.env.AUTH0_AUDIENCE || 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/',
    routes: {
        login: '/login',
        logout: '/logout',
        callback: '/callback'
    },
    idpLogout: true
});

// Auth0 konfigurace podle doporučení Auth0 dashboardu

const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a long, randomly-generated string stored in env',
  baseURL: process.env.BASE_URL || 'https://www.quicksoft.fun',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  authorizationParams: {
    response_type: 'code',
    redirect_uri: process.env.AUTH0_CALLBACK_URL || 'https://www.quicksoft.fun/callback',
    scope: process.env.AUTH0_SCOPE || 'openid profile email'
  }
};

// Auth0 middleware - přímá konfigurace podle doporučení Auth0
app.use(auth(auth0Config));

// Import requiresAuth middleware
const { requiresAuth } = require('express-openid-connect');

// Endpoint pro zobrazení profilu uživatele
app.get('/profile', requiresAuth(), async (req, res) => {
  try {
    // Synchronizace uživatele s Supabase
    const supabaseUser = await supabaseAuthSync.syncUser(req.oidc.user);

    // Kombinace Auth0 a Supabase dat
    const profile = {
      auth0: req.oidc.user,
      supabase: supabaseUser
    };

    res.send(JSON.stringify(profile, null, 2));
  } catch (error) {
    console.error('Chyba při získávání profilu:', error);
    res.status(500).json({
      error: 'Chyba při získávání profilu',
      message: error.message
    });
  }
});

// Endpoint pro kontrolu stavu přihlášení
app.get('/auth/status', async (req, res) => {
  try {
    const isAuthenticated = req.oidc.isAuthenticated();
    let userData = null;

    if (isAuthenticated) {
      // Získání Supabase uživatele, pokud je přihlášen
      try {
        const supabaseUser = await supabaseAuthSync.getUserByAuth0Id(req.oidc.user.sub);
        userData = {
          auth0: req.oidc.user,
          supabase: supabaseUser
        };
      } catch (error) {
        console.error('Chyba při získávání Supabase uživatele:', error);
        userData = {
          auth0: req.oidc.user,
          supabase: null,
          error: 'Nepodařilo se získat Supabase uživatele'
        };
      }
    }

    res.json({
      isAuthenticated,
      user: userData
    });
  } catch (error) {
    console.error('Chyba při kontrole stavu přihlášení:', error);
    res.status(500).json({
      error: 'Chyba při kontrole stavu přihlášení',
      message: error.message
    });
  }
});

// Auth0 routes - pouze na /auth cestě pro lepší organizaci
app.use('/auth', createAuth0Routes(auth0Service));

// Inicializace Supabase Auth Sync
const supabaseAuthSync = new SupabaseAuthSync({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
});

// Supabase middleware - přidání klienta do req objektu
app.use((req, res, next) => {
    req.supabaseClient = supabaseService.getClient();
    next();
});

// Middleware pro synchronizaci uživatelů mezi Auth0 a Supabase
app.use(supabaseAuthSync.createSyncMiddleware());

// API Routes s rate limitingem
app.use('/api', require('./routes/api'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stripe', require('./routes/stripe'));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use(errorHandler);

// Zdravotní stav aplikace
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: process.env.npm_package_version || '0.4.1',
        environment: process.env.NODE_ENV,
        auth0: {
            configured: !!(process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET),
            domain: process.env.AUTH0_DOMAIN
        },
        supabase: {
            configured: !!(process.env.SUPABASE_URL && (process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY)),
            url: process.env.SUPABASE_URL
        }
    });
});

// Metriky aplikace (pouze pro adminy)
app.get('/metrics', async (req, res) => {
    try {
        if (!req.oidc.isAuthenticated() ||
            !req.oidc.user['https://aimapa.cz/roles'].includes('admin')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const metrics = await supabaseService.getApplicationMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint pro získání Auth0 konfigurace (pouze clientId a domain pro klienta)
app.get('/auth/config', (_req, res) => {
    // Určení správné URL pro přesměrování na základě prostředí
    let callbackUrl = process.env.AUTH0_CALLBACK_URL || '';
    res.json({
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        audience: process.env.AUTH0_AUDIENCE,
        scope: process.env.AUTH0_SCOPE,
        callbackUrl: callbackUrl,
        logoutUrl: process.env.AUTH0_LOGOUT_URL
    });
});

// Spuštění serveru
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server běží na portu ${port}`);
    console.log('Prostředí:', process.env.NODE_ENV);
    console.log('Auth0 Domain:', process.env.AUTH0_DOMAIN);
    console.log('Supabase URL:', process.env.SUPABASE_URL);
});
