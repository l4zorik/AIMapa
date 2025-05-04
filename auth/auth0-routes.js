/**
 * Auth0 Routes
 * Verze 0.3.8.7
 *
 * Express routy pro Auth0 autentizaci
 */

const express = require('express');

/**
 * Vytvoří router s Auth0 endpointy
 * @param {Object} auth0Service - Instance Auth0Service
 * @returns {Object} Express router
 */
function createAuth0Routes(auth0Service) {
  const router = express.Router();

  /**
   * Endpoint pro přihlášení
   * Přesměruje na Auth0 přihlašovací stránku
   */
  router.get('/login', (req, res) => {
    try {
      // Získání returnTo parametru z query
      const returnTo = req.query.returnTo || '/';

      // V development módu bez Auth0 konfigurace zobrazíme testovací přihlašovací stránku
      if (process.env.NODE_ENV === 'development' && !process.env.AUTH0_CLIENT_SECRET) {
        res.send(`
          <html>
            <head>
              <title>Testovací přihlášení</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .container { max-width: 600px; margin: 0 auto; }
                .form-group { margin-bottom: 15px; }
                label { display: block; margin-bottom: 5px; }
                input { width: 100%; padding: 8px; box-sizing: border-box; }
                button { padding: 10px 15px; background: #4CAF50; color: white; border: none; cursor: pointer; }
                .note { margin-top: 20px; padding: 10px; background: #f8f9fa; border-left: 4px solid #28a745; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Testovací přihlášení</h1>
                <p>Toto je testovací přihlašovací stránka pro vývojové prostředí.</p>

                <form action="/callback" method="GET">
                  <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="test@example.com" required>
                  </div>
                  <div class="form-group">
                    <label for="password">Heslo:</label>
                    <input type="password" id="password" name="password" value="password123" required>
                  </div>
                  <input type="hidden" name="returnTo" value="${returnTo}">
                  <button type="submit">Přihlásit se</button>
                </form>

                <div class="note">
                  <p><strong>Poznámka:</strong> Toto je pouze pro testování. V produkčním prostředí by se použil skutečný Auth0 login.</p>
                  <p>Pro nastavení skutečného Auth0 přihlášení je potřeba:</p>
                  <ol>
                    <li>Vytvořit Auth0 účet a aplikaci</li>
                    <li>Nastavit správné hodnoty v .env souboru</li>
                    <li>Nakonfigurovat Callback URL v Auth0 dashboardu</li>
                  </ol>
                </div>
              </div>
            </body>
          </html>
        `);
      } else {
        // Pokud máme Auth0 konfiguraci, použijeme standardní Auth0 přihlášení
        try {
          if (res.oidc && typeof res.oidc.login === 'function') {
            res.oidc.login({ returnTo });
          } else if (req.oidc && typeof req.oidc.login === 'function') {
            req.oidc.login({ returnTo });
          } else {
            // Fallback - přesměrování na Auth0 univerzální login
            const loginUrl = auth0Service.getLoginUrl(returnTo);
            res.redirect(loginUrl);
          }
        } catch (error) {
          console.error('Chyba při přihlašování:', error);
          res.status(500).json({
            error: 'Chyba při přihlašování',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
        }
      }
    } catch (error) {
      console.error('Chyba v /login endpointu:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Chyba při zpracování přihlášení',
        details: error.message
      });
    }
  });

  /**
   * Endpoint pro odhlášení
   * Odhlásí uživatele a přesměruje na domovskou stránku
   */
  router.get('/logout', (req, res) => {
    try {
      // Získání returnTo parametru z query
      const returnTo = req.query.returnTo || '/';

      // V development módu bez Auth0 konfigurace pouze přesměrujeme na hlavní stránku
      if (process.env.NODE_ENV === 'development' && !process.env.AUTH0_CLIENT_SECRET) {
        res.send(`
          <html>
            <head>
              <title>Odhlášení</title>
              <meta http-equiv="refresh" content="2;url=${returnTo}">
              <style>
                body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
                .container { max-width: 600px; margin: 0 auto; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Odhlášení úspěšné</h1>
                <p>Byli jste úspěšně odhlášeni. Budete přesměrováni za 2 sekundy...</p>
                <p><a href="${returnTo}">Klikněte zde, pokud nebudete automaticky přesměrováni</a></p>
              </div>
            </body>
          </html>
        `);
      } else {
        // Pokud máme Auth0 konfiguraci, použijeme standardní Auth0 odhlášení
        try {
          if (res.oidc && typeof res.oidc.logout === 'function') {
            res.oidc.logout({ returnTo });
          } else if (req.oidc && typeof req.oidc.logout === 'function') {
            req.oidc.logout({ returnTo });
          } else {
            // Fallback - přesměrování na Auth0 logout endpoint
            const logoutUrl = auth0Service.getLogoutUrl(returnTo);
            res.redirect(logoutUrl);
          }
        } catch (error) {
          console.error('Chyba při odhlašování:', error);
          res.status(500).json({
            error: 'Chyba při odhlašování',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
          });
        }
      }
    } catch (error) {
      console.error('Chyba v /logout endpointu:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Chyba při zpracování odhlášení',
        details: error.message
      });
    }
  });

  /**
   * Endpoint pro callback
   * Zpracovává odpověď z Auth0 po přihlášení
   */
  router.get('/callback', (req, res) => {
    try {
      // Získání returnTo parametru
      let returnTo = '/';

      // Pokus o získání returnTo z state parametru
      if (req.query.state) {
        try {
          const state = JSON.parse(req.query.state);
          if (state.returnTo) {
            returnTo = state.returnTo;
          }
        } catch (e) {
          console.error('Chyba při parsování state parametru:', e);
        }
      }

      // V development módu bez Auth0 konfigurace simulujeme úspěšné přihlášení
      if (process.env.NODE_ENV === 'development' && !process.env.AUTH0_CLIENT_SECRET) {
        // Simulace přihlášení - v reálné aplikaci by zde byl kód pro zpracování Auth0 odpovědi
        console.log('Simulace úspěšného přihlášení v development módu');

        // Přesměrování na returnTo URL nebo domovskou stránku
        res.redirect(returnTo || '/');
      } else {
        // V produkčním prostředí by tento endpoint byl zpracován Auth0 middlewarem
        // Pokud se dostaneme sem, znamená to, že middleware nezpracoval callback
        console.log('Auth0 callback zpracován - přesměrování na:', returnTo || '/');

        // Logování informací o požadavku pro diagnostiku
        console.log('Callback URL:', req.originalUrl);
        console.log('Query parametry:', req.query);
        console.log('Auth0 stav:', req.oidc ? 'Dostupný' : 'Nedostupný');

        // Přesměrování na returnTo URL nebo domovskou stránku
        res.redirect(returnTo || '/');
      }
    } catch (error) {
      console.error('Chyba v /callback endpointu:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Chyba při zpracování callback',
        details: error.message
      });
    }
  });

  /**
   * Endpoint pro získání stavu autentizace
   * Vrací informace o přihlášeném uživateli
   */
  router.get('/status', (req, res) => {
    try {
      res.json({
        message: 'Auth0 status',
        isAuthenticated: auth0Service.isAuthenticated(req),
        auth0Domain: process.env.AUTH0_DOMAIN,
        auth0ClientId: process.env.AUTH0_CLIENT_ID ? 'Nastaveno' : 'Chybí',
        auth0Secret: process.env.AUTH0_CLIENT_SECRET ? 'Nastaveno' : 'Chybí',
        user: auth0Service.getUserProfile(req)
      });
    } catch (error) {
      console.error('Chyba v /auth/status endpointu:', error);
      res.status(500).json({
        error: 'Chyba při získávání Auth0 statusu',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  /**
   * Endpoint pro diagnostiku Auth0
   * Vrací detailní informace o Auth0 konfiguraci a stavu
   */
  router.get('/debug', (req, res) => {
    try {
      const diagnostics = auth0Service.getDiagnostics(req);

      // Přidání informací o uživateli, pokud je přihlášen
      if (auth0Service.isAuthenticated(req)) {
        diagnostics.user = {
          sub: req.oidc.user.sub,
          email: req.oidc.user.email,
          name: req.oidc.user.name,
          // Neukládáme citlivé údaje
        };
      }

      res.json(diagnostics);
    } catch (error) {
      console.error('Chyba v /auth/debug endpointu:', error);
      res.status(500).json({
        error: 'Chyba při získávání Auth0 diagnostiky',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  return router;
}

module.exports = createAuth0Routes;
