/**
 * Discord Authentication Service
 * Verze 0.4.0
 *
 * Centralizovaná služba pro práci s Discord autentizací
 */

const passport = require('passport');
const { Strategy: DiscordStrategy } = require('passport-discord');
const session = require('express-session');

class DiscordService {
  /**
   * Vytvoří novou instanci DiscordService
   * @param {Object} config - Konfigurace Discord
   */
  constructor(config = {}) {
    this.config = {
      clientID: config.clientID || process.env.DISCORD_CLIENT_ID,
      clientSecret: config.clientSecret || process.env.DISCORD_CLIENT_SECRET,
      callbackURL: config.callbackURL || process.env.DISCORD_CALLBACK_URL || `${process.env.BASE_URL}/auth/discord/callback`,
      scope: config.scope || ['identify', 'email'],
      prompt: config.prompt || 'consent'
    };

    // Inicializace Passport.js
    this.initializePassport();

    // Logování konfigurace
    console.log('DiscordService: Inicializováno');
    console.log('Discord Client ID:', this.config.clientID ? 'Nastaveno' : 'Chybí');
    console.log('Discord Client Secret:', this.config.clientSecret ? 'Nastaveno' : 'Chybí');
    console.log('Discord Callback URL:', this.config.callbackURL);
  }

  /**
   * Inicializuje Passport.js s Discord strategií
   */
  initializePassport() {
    // Serializace a deserializace uživatele
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    // Konfigurace Discord strategie
    passport.use(new DiscordStrategy({
      clientID: this.config.clientID,
      clientSecret: this.config.clientSecret,
      callbackURL: this.config.callbackURL,
      scope: this.config.scope,
      prompt: this.config.prompt
    }, (accessToken, refreshToken, profile, done) => {
      // Uložení tokenu do profilu pro pozdější použití
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      
      // Vrácení profilu
      return done(null, profile);
    }));
  }

  /**
   * Vrátí Express middleware pro session
   * @returns {Function} Express middleware
   */
  getSessionMiddleware() {
    return session({
      secret: process.env.SESSION_SECRET || process.env.DISCORD_CLIENT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hodin
      }
    });
  }

  /**
   * Vrátí Express middleware pro Passport.js
   * @returns {Array<Function>} Express middleware
   */
  getMiddleware() {
    return [
      this.getSessionMiddleware(),
      passport.initialize(),
      passport.session()
    ];
  }

  /**
   * Zkontroluje, zda je uživatel přihlášen
   * @param {Object} req - Express request objekt
   * @returns {boolean} True pokud je uživatel přihlášen
   */
  isAuthenticated(req) {
    return req.isAuthenticated && req.isAuthenticated();
  }

  /**
   * Získá profil přihlášeného uživatele
   * @param {Object} req - Express request objekt
   * @returns {Object|null} Profil uživatele nebo null
   */
  getUserProfile(req) {
    if (!this.isAuthenticated(req)) {
      return null;
    }

    return req.user;
  }

  /**
   * Vytvoří middleware pro ochranu endpointů
   * @returns {Function} Express middleware
   */
  requireAuth() {
    return (req, res, next) => {
      if (this.isAuthenticated(req)) {
        return next();
      }

      // Uložení původní URL pro přesměrování po přihlášení
      const returnTo = req.originalUrl || req.url;

      // Přesměrování na přihlašovací stránku
      return res.redirect(`/auth/discord/login?returnTo=${encodeURIComponent(returnTo)}`);
    };
  }

  /**
   * Vytvoří middleware pro kontrolu role uživatele
   * @param {string|string[]} roles - Role nebo pole rolí
   * @returns {Function} Express middleware
   */
  requireRole(roles) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    return (req, res, next) => {
      // Kontrola, zda je uživatel přihlášen
      if (!this.isAuthenticated(req)) {
        return res.redirect('/auth/discord/login');
      }

      // Získání rolí uživatele
      const userRoles = req.user.roles || [];

      // Kontrola, zda má uživatel požadovanou roli
      const hasRole = requiredRoles.some(role => userRoles.includes(role));

      if (hasRole) {
        return next();
      }

      // Uživatel nemá požadovanou roli
      return res.status(403).json({
        error: 'Přístup odepřen',
        message: 'Nemáte dostatečná oprávnění pro přístup k tomuto zdroji'
      });
    };
  }

  /**
   * Vytvoří diagnostický objekt s informacemi o Discord konfiguraci
   * @param {Object} req - Express request objekt
   * @returns {Object} Diagnostický objekt
   */
  getDiagnostics(req) {
    return {
      isConfigured: !!(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET),
      clientIdConfigured: !!process.env.DISCORD_CLIENT_ID,
      clientSecretConfigured: !!process.env.DISCORD_CLIENT_SECRET,
      callbackUrl: this.config.callbackURL,
      isAuthenticated: this.isAuthenticated(req),
      passportVersion: require('passport/package.json').version,
      discordStrategyVersion: require('passport-discord/package.json').version,
      expressVersion: require('express/package.json').version,
      nodeVersion: process.version
    };
  }
}

module.exports = DiscordService;
