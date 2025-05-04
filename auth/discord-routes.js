/**
 * Discord Authentication Routes
 * Verze 0.4.0
 *
 * Express routy pro Discord autentizaci
 */

const express = require('express');
const passport = require('passport');

/**
 * Vytvoří router s Discord endpointy
 * @param {Object} discordService - Instance DiscordService
 * @returns {Object} Express router
 */
function createDiscordRoutes(discordService) {
  const router = express.Router();

  /**
   * Endpoint pro přihlášení
   * Přesměruje na Discord přihlašovací stránku
   */
  router.get('/discord/login', (req, res, next) => {
    try {
      // Získání returnTo parametru z query
      const returnTo = req.query.returnTo || '/';

      // Uložení returnTo do session
      req.session.returnTo = returnTo;

      // Přesměrování na Discord přihlašovací stránku
      passport.authenticate('discord')(req, res, next);
    } catch (error) {
      console.error('Chyba v /discord/login endpointu:', error);
      res.status(500).json({
        error: 'Chyba při přihlašování přes Discord',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  /**
   * Callback endpoint pro Discord autentizaci
   * Zpracuje odpověď z Discord přihlašovací stránky
   */
  router.get('/discord/callback',
    passport.authenticate('discord', {
      failureRedirect: '/login-failed'
    }),
    (req, res) => {
      try {
        // Získání returnTo z session
        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo;

        // Přesměrování na původní stránku
        res.redirect(returnTo);
      } catch (error) {
        console.error('Chyba v /discord/callback endpointu:', error);
        res.status(500).json({
          error: 'Chyba při zpracování Discord callbacku',
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      }
    }
  );

  /**
   * Endpoint pro odhlášení
   * Odhlásí uživatele a přesměruje na hlavní stránku
   */
  router.get('/discord/logout', (req, res) => {
    try {
      // Získání returnTo parametru z query
      const returnTo = req.query.returnTo || '/';

      // Odhlášení uživatele
      req.logout(function(err) {
        if (err) {
          console.error('Chyba při odhlašování:', err);
          return res.status(500).json({
            error: 'Chyba při odhlašování',
            message: err.message
          });
        }
        
        // Přesměrování na hlavní stránku
        res.redirect(returnTo);
      });
    } catch (error) {
      console.error('Chyba v /discord/logout endpointu:', error);
      res.status(500).json({
        error: 'Chyba při odhlašování',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  /**
   * Endpoint pro získání stavu autentizace
   * Vrací informace o přihlášeném uživateli
   */
  router.get('/discord/status', (req, res) => {
    try {
      res.json({
        message: 'Discord status',
        isAuthenticated: discordService.isAuthenticated(req),
        discordClientId: process.env.DISCORD_CLIENT_ID ? 'Nastaveno' : 'Chybí',
        discordClientSecret: process.env.DISCORD_CLIENT_SECRET ? 'Nastaveno' : 'Chybí',
        user: discordService.getUserProfile(req)
      });
    } catch (error) {
      console.error('Chyba v /discord/status endpointu:', error);
      res.status(500).json({
        error: 'Chyba při získávání Discord statusu',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  /**
   * Endpoint pro diagnostiku Discord
   * Vrací detailní informace o Discord konfiguraci a stavu
   */
  router.get('/discord/debug', (req, res) => {
    try {
      const diagnostics = discordService.getDiagnostics(req);

      // Přidání informací o uživateli, pokud je přihlášen
      if (discordService.isAuthenticated(req)) {
        diagnostics.user = {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          // Neukládáme citlivé údaje
        };
      }

      res.json(diagnostics);
    } catch (error) {
      console.error('Chyba v /discord/debug endpointu:', error);
      res.status(500).json({
        error: 'Chyba při získávání Discord diagnostiky',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  return router;
}

module.exports = createDiscordRoutes;
