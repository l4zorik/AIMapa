/**
 * API Logger Middleware
 * Verze 0.3.8.7
 */

const { createClient } = require('@supabase/supabase-js');

class APILogger {
    constructor(config = {}) {
        this.config = {
            logToConsole: true,
            logToSupabase: true,
            excludePaths: ['/health', '/metrics'],
            excludeMethods: ['OPTIONS'],
            ...config
        };

        if (this.config.logToSupabase) {
            this.supabase = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_SERVICE_KEY
            );
        }
    }

    async logToSupabase(logData) {
        try {
            const { error } = await this.supabase
                .from('api_logs')
                .insert([logData]);

            if (error) {
                console.error('Chyba při ukládání logu do Supabase:', error);
            }
        } catch (error) {
            console.error('Chyba při logování do Supabase:', error);
        }
    }

    middleware() {
        return async (req, res, next) => {
            // Přeskočení vyloučených cest a metod
            if (this.config.excludePaths.includes(req.path) ||
                this.config.excludeMethods.includes(req.method)) {
                return next();
            }

            const startTime = Date.now();
            const logData = {
                timestamp: new Date().toISOString(),
                method: req.method,
                path: req.path,
                query: req.query,
                headers: this.sanitizeHeaders(req.headers),
                user_id: req.oidc?.user?.sub || null,
                ip: this.getClientIP(req),
                user_agent: req.headers['user-agent']
            };

            // Zachycení response
            const originalSend = res.send;
            res.send = function(body) {
                const endTime = Date.now();
                logData.response_time = endTime - startTime;
                logData.status_code = res.statusCode;
                logData.response_size = body ? Buffer.byteLength(body) : 0;

                // Logování do konzole
                if (this.config.logToConsole) {
                    console.log({
                        timestamp: logData.timestamp,
                        method: logData.method,
                        path: logData.path,
                        status: logData.status_code,
                        time: `${logData.response_time}ms`,
                        size: `${logData.response_size}B`,
                        user: logData.user_id
                    });
                }

                // Logování do Supabase
                if (this.config.logToSupabase) {
                    this.logToSupabase(logData);
                }

                return originalSend.call(res, body);
            }.bind(this);

            next();
        };
    }

    sanitizeHeaders(headers) {
        const sanitized = { ...headers };
        // Odstranění citlivých dat
        delete sanitized.authorization;
        delete sanitized.cookie;
        return sanitized;
    }

    getClientIP(req) {
        return req.headers['x-forwarded-for']?.split(',')[0] ||
               req.connection.remoteAddress;
    }
}

module.exports = APILogger;