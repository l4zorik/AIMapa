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
        // Kontrola autentizace přes Discord
        if (!req.isAuthenticated() || !req.user.roles || !req.user.roles.includes('admin')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const metrics = await supabaseService.getApplicationMetrics();
        res.json(metrics);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint pro získání Discord konfigurace
app.get('/auth/discord/config', (_req, res) => {
    res.json({
        clientId: process.env.DISCORD_CLIENT_ID,
        callbackUrl: process.env.DISCORD_CALLBACK_URL || `${process.env.BASE_URL}/auth/discord/callback`
    });
});

// Debug endpoint pro autentizaci
app.get('/auth/debug', (req, res) => {
    console.log('DEBUG AUTH: /auth/debug endpoint called');
    console.log('DEBUG AUTH: req.user:', req.user);
    console.log('DEBUG AUTH: req.oidc:', req.oidc);
    console.log('DEBUG AUTH: req.isAuthenticated:', req.isAuthenticated ? req.isAuthenticated() : 'undefined');

    res.json({
        authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
        user: req.user || null,
        oidc: req.oidc || null,
        session: req.session || null,
        headers: {
            authorization: req.headers.authorization || null,
            cookie: req.headers.cookie || null
        }
    });
});

// Spuštění serveru
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server běží na portu ${port} v prostředí ${process.env.NODE_ENV}`);
});
