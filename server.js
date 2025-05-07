/**
 * AIMapa - Server
 * Verze 0.4.0
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const supabaseService = require('./supabase-service');
const Auth0Service = require('./auth/auth0-service');
const createAuth0Routes = require('./auth/auth0-routes');
const DiscordService = require('./auth/discord-service');
const createDiscordRoutes = require('./auth/discord-routes');

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

// Kontrola načtení proměnných prostředí je vypnuta

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
    audience: process.env.AUTH0_AUDIENCE || 'https://dev-zxj8pir0moo4pdk7.us.quicksoft.fun/api/v2/',
    loginRoute: false,  // Vypneme automatické routy, použijeme vlastní
    logoutRoute: false,
    callbackRoute: false,
    idpLogout: true
});

// Auth0 konfigurace podle doporučení Auth0 dashboardu
const { auth } = require('express-openid-connect');

const auth0Config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a long, randomly-generated string stored in env',
  baseURL: process.env.BASE_URL || 'https://www.quicksoft.fun',
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  routes: {
    callback: false  // Vypneme automatický callback, použijeme vlastní
  },
  authorizationParams: {
    response_type: 'code',
    redirect_uri: process.env.AUTH0_CALLBACK_URL || 'https://www.quicksoft.fun/callback',
    scope: process.env.AUTH0_SCOPE || 'openid profile email'
  },
  clientAuthMethod: 'client_secret_basic'
};

// Auth0 middleware - přímá konfigurace podle doporučení Auth0
app.use(auth(auth0Config));

// Import requiresAuth middleware
const { requiresAuth } = require('express-openid-connect');

// Endpoint pro zobrazení profilu uživatele
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

// Endpoint pro kontrolu stavu přihlášení
app.get('/auth/status', (req, res) => {
  res.json({
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.isAuthenticated() ? req.oidc.user : null
  });
});

// Auth0 routes - pouze na /auth cestě pro lepší organizaci
app.use('/auth', createAuth0Routes(auth0Service));

// Inicializace Discord service
const discordService = new DiscordService({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || `${process.env.BASE_URL}/auth/discord/callback`,
    scope: ['identify', 'email']
});

// Aplikace Discord middleware
discordService.getMiddleware().forEach(middleware => {
    app.use(middleware);
});

// Discord routes - na /auth cestě pro lepší organizaci
app.use('/auth', createDiscordRoutes(discordService));

// Supabase middleware - přidání klienta do req objektu
app.use((req, res, next) => {
    req.supabaseClient = supabaseService.getClient();
    next();
});

// API Routes s rate limitingem
app.use('/api', require('./routes/api'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stripe', require('./routes/stripe'));

// Statické soubory
app.use(express.static(path.join(__dirname, 'public')));

// Discord login stránka
app.get('/discord-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'discord-login.html'));
});

// Error handling middleware
app.use(errorHandler);

// Zdravotní stav aplikace
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: process.env.npm_package_version,
        environment: process.env.NODE_ENV
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

// Endpoint pro získání Discord konfigurace
app.get('/auth/discord/config', (_req, res) => {
    res.json({
        clientId: process.env.DISCORD_CLIENT_ID,
        callbackUrl: process.env.DISCORD_CALLBACK_URL || `${process.env.BASE_URL}/auth/discord/callback`
    });
});

// Spuštění serveru
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server běží na portu ${port} v prostředí ${process.env.NODE_ENV}`);
});
