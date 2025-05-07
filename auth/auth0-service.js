/**
 * Auth0 Service
 * Verze 0.3.8.7
 *
 * Centralizovaná služba pro práci s Auth0 autentizací
 */

const { auth } = require('express-openid-connect');

class Auth0Service {
  /**
   * Vytvoří novou instanci Auth0Service
   * @param {Object} config - Konfigurace Auth0
   */
  constructor(config = {}) {
    this.config = {
      authRequired: false,
      auth0Logout: true,
      baseURL: config.baseURL || process.env.BASE_URL || 'http://localhost:3000',
      clientID: config.clientID || process.env.AUTH0_CLIENT_ID,
      issuerBaseURL: config.issuerBaseURL || `https://${process.env.AUTH0_DOMAIN}`,
      secret: config.secret || process.env.AUTH0_CLIENT_SECRET,
      clientSecret: config.clientSecret || process.env.AUTH0_CLIENT_SECRET,
      authorizationParams: {
        response_type: 'code',
        scope: config.scope || process.env.AUTH0_SCOPE || 'openid profile email',
        audience: config.audience || process.env.AUTH0_AUDIENCE
      },
      routes: {
        login: config.routes && config.routes.login !== undefined ? config.routes.login : '/login',
        logout: config.routes && config.routes.logout !== undefined ? config.routes.logout : '/logout',
        callback: config.routes && config.routes.callback !== undefined ? config.routes.callback : '/callback'
      },
      idpLogout: config.idpLogout !== false
    };

    // Nastavení callback URL
    if (process.env.AUTH0_CALLBACK_URL) {
      this.config.routes.callback = false; // Vypneme automatický callback, použijeme vlastní
    }

    // Vytvoření Auth0 middleware
    this.middleware = auth(this.config);

    // Logování konfigurace je vypnuto
  }

  /**
   * Vrátí Auth0 middleware pro Express
   * @returns {Function} Express middleware
   */
  getMiddleware() {
    return this.middleware;
  }

  /**
   * Zkontroluje, zda je uživatel přihlášen
   * @param {Object} req - Express request objekt
   * @returns {boolean} True pokud je uživatel přihlášen
   */
  isAuthenticated(req) {
    return req.oidc && req.oidc.isAuthenticated();
  }

  /**
   * Získá profil přihlášeného uživatele
   * @param {Object} req - Express request objekt
   * @returns {Object|null} Profil uživatele nebo null
   */
  getUserProfile(req) {
    return this.isAuthenticated(req) ? req.oidc.user : null;
  }

  /**
   * Získá ID přihlášeného uživatele
   * @param {Object} req - Express request objekt
   * @returns {string|null} ID uživatele nebo null
   */
  getUserId(req) {
    return this.isAuthenticated(req) ? req.oidc.user.sub : null;
  }

  /**
   * Získá access token přihlášeného uživatele
   * @param {Object} req - Express request objekt
   * @returns {string|null} Access token nebo null
   */
  getAccessToken(req) {
    return req.oidc && req.oidc.accessToken ? req.oidc.accessToken.access_token : null;
  }

  /**
   * Vytvoří URL pro přihlášení
   * @param {string} returnTo - URL pro přesměrování po přihlášení
   * @returns {string} URL pro přihlášení
   */
  getLoginUrl(returnTo) {
    const params = new URLSearchParams({
      client_id: this.config.clientID,
      redirect_uri: process.env.AUTH0_CALLBACK_URL || `${this.config.baseURL}/callback`,
      response_type: 'code',
      scope: this.config.authorizationParams.scope,
      audience: this.config.authorizationParams.audience
    });

    if (returnTo) {
      params.append('state', JSON.stringify({ returnTo }));
    }

    return `${this.config.issuerBaseURL}/authorize?${params.toString()}`;
  }

  /**
   * Vytvoří URL pro odhlášení
   * @param {string} returnTo - URL pro přesměrování po odhlášení
   * @returns {string} URL pro odhlášení
   */
  getLogoutUrl(returnTo) {
    const params = new URLSearchParams({
      client_id: this.config.clientID,
      returnTo: returnTo || this.config.baseURL
    });

    return `${this.config.issuerBaseURL}/v2/logout?${params.toString()}`;
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
      if (req.oidc && typeof req.oidc.login === 'function') {
        return req.oidc.login({ returnTo });
      } else {
        return res.redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      }
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
      // Nejprve zkontrolujeme, zda je uživatel přihlášen
      if (!this.isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Přihlášení je vyžadováno' });
      }

      // Získání rolí uživatele
      const userRoles = req.oidc.user['https://aimapa.cz/roles'] || [];

      // Kontrola, zda má uživatel požadovanou roli
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

      if (hasRequiredRole) {
        return next();
      } else {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Nemáte oprávnění k přístupu k tomuto zdroji',
          requiredRoles,
          userRoles
        });
      }
    };
  }

  /**
   * Vytvoří middleware pro kontrolu vlastnictví záznamu
   * @param {string} resourceType - Typ zdroje (např. 'routes', 'profiles')
   * @param {Function} getResourceOwner - Funkce pro získání vlastníka zdroje
   * @returns {Function} Express middleware
   */
  requireOwnership(resourceType, getResourceOwner) {
    return async (req, res, next) => {
      // Nejprve zkontrolujeme, zda je uživatel přihlášen
      if (!this.isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized', message: 'Přihlášení je vyžadováno' });
      }

      try {
        // Získání ID uživatele
        const userId = this.getUserId(req);

        // Získání vlastníka zdroje
        const resourceOwner = await getResourceOwner(req);

        // Kontrola, zda je uživatel vlastníkem zdroje
        if (userId === resourceOwner) {
          return next();
        }

        // Kontrola, zda je uživatel admin
        const userRoles = req.oidc.user['https://aimapa.cz/roles'] || [];
        if (userRoles.includes('admin')) {
          return next();
        }

        // Uživatel není vlastníkem ani adminem
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Nemáte oprávnění k přístupu k tomuto zdroji',
          resourceType,
          resourceId: req.params.id
        });
      } catch (error) {
        console.error(`Chyba při kontrole vlastnictví ${resourceType}:`, error);
        return res.status(500).json({
          error: 'Internal Server Error',
          message: 'Chyba při kontrole vlastnictví zdroje'
        });
      }
    };
  }

  /**
   * Vytvoří diagnostický objekt s informacemi o Auth0 konfiguraci
   * @param {Object} req - Express request objekt
   * @returns {Object} Diagnostický objekt
   */
  getDiagnostics(req) {
    return {
      isConfigured: !!(process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_CLIENT_SECRET),
      domain: process.env.AUTH0_DOMAIN,
      clientIdConfigured: !!process.env.AUTH0_CLIENT_ID,
      clientSecretConfigured: !!process.env.AUTH0_CLIENT_SECRET,
      callbackUrl: process.env.AUTH0_CALLBACK_URL,
      logoutUrl: process.env.AUTH0_LOGOUT_URL,
      audience: process.env.AUTH0_AUDIENCE,
      isAuthenticated: this.isAuthenticated(req),
      authLibraryVersion: require('express-openid-connect/package.json').version,
      expressVersion: require('express/package.json').version,
      nodeVersion: process.version,
      oidcObject: {
        isAvailable: !!req.oidc,
        hasLoginMethod: req.oidc ? typeof req.oidc.login === 'function' : false,
        hasLogoutMethod: req.oidc ? typeof req.oidc.logout === 'function' : false
      }
    };
  }
}

module.exports = Auth0Service;
