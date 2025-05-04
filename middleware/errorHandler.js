/**
 * Centrální správce chyb pro AIMapa
 * Verze 0.3.8.5
 */

class AppError extends Error {
    constructor(statusCode, message, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
    }
}

const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });

    // Pokud je to naše vlastní chyba, použijeme její statusCode
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            details: err.details,
            timestamp: err.timestamp,
            path: req.path
        });
    }

    // Auth0 specifické chyby
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Neautorizovaný přístup',
            details: err.message,
            timestamp: new Date().toISOString(),
            path: req.path
        });
    }

    // Supabase specifické chyby
    if (err.code && err.code.startsWith('PGRST')) {
        return res.status(400).json({
            error: 'Chyba databáze',
            details: err.message,
            code: err.code,
            timestamp: new Date().toISOString(),
            path: req.path
        });
    }

    // Obecné chyby
    res.status(500).json({
        error: 'Interní chyba serveru',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Něco se pokazilo',
        timestamp: new Date().toISOString(),
        path: req.path
    });
};

module.exports = {
    AppError,
    errorHandler
};