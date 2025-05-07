/**
 * Middleware pro zabezpečení API
 * Verze 0.3.8.5
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { AppError } = require('./errorHandler');

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minut
    max: 100, // limit 100 požadavků na IP
    message: {
        error: 'Příliš mnoho požadavků z této IP adresy, zkuste to prosím později',
        retryAfter: '15 minut'
    }
});

// Přísnější limit pro autentizační endpointy
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hodina
    max: 5, // limit 5 pokusů na IP
    message: {
        error: 'Příliš mnoho pokusů o přihlášení, zkuste to prosím později',
        retryAfter: '60 minut'
    }
});

// Kontrola oprávnění
const checkPermissions = (requiredPermissions) => {
    return (req, res, next) => {
        try {
            if (!req.isAuthenticated()) {
                throw new AppError(401, 'Nepřihlášený uživatel');
            }

            const userPermissions = req.user.permissions || [];
            const hasAllPermissions = requiredPermissions.every(
                permission => userPermissions.includes(permission)
            );

            if (!hasAllPermissions) {
                throw new AppError(403, 'Nedostatečná oprávnění');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Konfigurace Helmet pro zabezpečení hlaviček
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.quicksoft.fun'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'https://*.quicksoft.fun', 'https://*.supabase.co'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", 'https://*.quicksoft.fun']
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

module.exports = {
    apiLimiter,
    authLimiter,
    checkPermissions,
    helmetConfig
};