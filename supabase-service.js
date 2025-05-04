/**
 * Supabase Service pro AIMapa
 * Verze 0.3.8.5
 */

require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');
const { AppError } = require('./middleware/errorHandler');

// Supabase konfigurace
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Kontrola konfigurace
if (!supabaseKey || !supabaseServiceKey) {
    console.error('VAROVÁNÍ: Chybí Supabase konfigurační klíče!');
}

// Vytvoření Supabase klientů
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Service objekt
const supabaseService = {
    // Získání klienta
    getClient() {
        return supabase;
    },

    // Získání admin klienta
    getAdminClient() {
        return supabaseAdmin;
    },

    // Synchronizace uživatele z Auth0 do Supabase
    async syncUserToSupabase(auth0User) {
        try {
            if (!auth0User?.sub) {
                throw new AppError(400, 'Chybí Auth0 ID uživatele');
            }

            // Kontrola existence uživatele
            const { data: existingUser, error: fetchError } = await supabaseAdmin
                .from('users')
                .select('*')
                .eq('auth0_id', auth0User.sub)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw new AppError(500, 'Chyba při kontrole uživatele', fetchError);
            }

            const userData = {
                auth0_id: auth0User.sub,
                email: auth0User.email,
                name: auth0User.name || auth0User.nickname,
                picture: auth0User.picture,
                last_login: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (!existingUser) {
                // Vytvoření nového uživatele
                const { data, error } = await supabaseAdmin
                    .from('users')
                    .insert([{ ...userData, created_at: new Date().toISOString() }])
                    .select()
                    .single();

                if (error) throw new AppError(500, 'Chyba při vytváření uživatele', error);
                return data;
            } else {
                // Aktualizace existujícího uživatele
                const { data, error } = await supabaseAdmin
                    .from('users')
                    .update(userData)
                    .eq('auth0_id', auth0User.sub)
                    .select()
                    .single();

                if (error) throw new AppError(500, 'Chyba při aktualizaci uživatele', error);
                return data;
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při synchronizaci uživatele', error);
        }
    },

    // Získání uživatele ze Supabase
    async getUserFromSupabase(auth0Id) {
        try {
            if (!auth0Id) throw new AppError(400, 'Chybí Auth0 ID');

            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('auth0_id', auth0Id)
                .single();

            if (error) throw new AppError(500, 'Chyba při získávání uživatele', error);
            return data;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při získávání uživatele', error);
        }
    },

    // Získání uživatelských preferencí
    async getUserPreferences(auth0Id) {
        try {
            if (!auth0Id) throw new AppError(400, 'Chybí Auth0 ID');

            const { data, error } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('user_id', auth0Id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw new AppError(500, 'Chyba při získávání preferencí', error);
            }

            return data || { theme: 'light', language: 'cs' };
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při získávání preferencí', error);
        }
    },

    // Získání metrik aplikace
    async getApplicationMetrics() {
        try {
            const [userMetrics, apiMetrics, routeMetrics] = await Promise.all([
                // Uživatelské metriky
                supabaseAdmin.from('api_metrics')
                    .select('*')
                    .order('time_bucket', { ascending: false })
                    .limit(24),

                // API metriky
                supabaseAdmin.from('api_logs')
                    .select('*')
                    .order('timestamp', { ascending: false })
                    .limit(100),

                // Metriky tras
                supabaseAdmin.from('routes')
                    .select('count(*)', { count: 'exact' })
            ]);

            // Zpracování chyb
            if (userMetrics.error) throw new AppError(500, 'Chyba při získávání uživatelských metrik', userMetrics.error);
            if (apiMetrics.error) throw new AppError(500, 'Chyba při získávání API metrik', apiMetrics.error);
            if (routeMetrics.error) throw new AppError(500, 'Chyba při získávání metrik tras', routeMetrics.error);

            // Agregace metrik
            const aggregatedMetrics = {
                api: {
                    totalRequests: apiMetrics.data.length,
                    avgResponseTime: this.calculateAverageResponseTime(apiMetrics.data),
                    errorRate: this.calculateErrorRate(apiMetrics.data),
                    popularEndpoints: this.getPopularEndpoints(apiMetrics.data)
                },
                users: {
                    activeUsers: this.countUniqueUsers(apiMetrics.data),
                    userActivity: this.aggregateUserActivity(userMetrics.data)
                },
                routes: {
                    totalRoutes: routeMetrics.count,
                    recentActivity: this.getRecentRouteActivity(apiMetrics.data)
                }
            };

            return aggregatedMetrics;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při získávání metrik', error);
        }
    },

    // Pomocné funkce pro metriky
    calculateAverageResponseTime(logs) {
        if (!logs.length) return 0;
        const sum = logs.reduce((acc, log) => acc + (log.response_time || 0), 0);
        return Math.round(sum / logs.length);
    },

    calculateErrorRate(logs) {
        if (!logs.length) return 0;
        const errors = logs.filter(log => log.status_code >= 400).length;
        return (errors / logs.length * 100).toFixed(2);
    },

    getPopularEndpoints(logs) {
        const endpoints = {};
        logs.forEach(log => {
            const endpoint = log.path;
            endpoints[endpoint] = (endpoints[endpoint] || 0) + 1;
        });
        return Object.entries(endpoints)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .reduce((obj, [key, value]) => ({
                ...obj,
                [key]: value
            }), {});
    },

    countUniqueUsers(logs) {
        return new Set(logs.map(log => log.user_id).filter(Boolean)).size;
    },

    aggregateUserActivity(metrics) {
        return metrics.reduce((acc, metric) => ({
            ...acc,
            [metric.time_bucket]: {
                requests: metric.request_count,
                uniqueUsers: metric.unique_users
            }
        }), {});
    },

    getRecentRouteActivity(logs) {
        return logs
            .filter(log => log.path.includes('/routes'))
            .slice(0, 10)
            .map(log => ({
                timestamp: log.timestamp,
                method: log.method,
                path: log.path,
                userId: log.user_id
            }));
    },

    // Nové metody pro optimalizované metriky
    async getDashboardMetrics(timeRange = '24 hours') {
        try {
            const { data, error } = await supabaseAdmin
                .rpc('get_dashboard_metrics', { time_range: timeRange });

            if (error) throw new AppError(500, 'Chyba při získávání metrik dashboardu', error);

            // Převod pole metrik na objekt
            return data.reduce((acc, { metric_name, metric_value }) => ({
                ...acc,
                [metric_name]: metric_value
            }), {});
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při získávání metrik dashboardu', error);
        }
    },

    async getApiPerformance() {
        try {
            const { data, error } = await supabaseAdmin
                .from('api_performance')
                .select('*')
                .order('calls', { ascending: false });

            if (error) throw new AppError(500, 'Chyba při získávání výkonu API', error);
            return data;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při získávání výkonu API', error);
        }
    },

    async getUserActivityTimeline(days = 7) {
        try {
            const { data, error } = await supabaseAdmin
                .from('user_activity_daily')
                .select('*')
                .order('day', { ascending: false })
                .limit(days);

            if (error) throw new AppError(500, 'Chyba při získávání uživatelské aktivity', error);
            return data;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při získávání uživatelské aktivity', error);
        }
    },

    async getRouteMetrics(userId = null) {
        try {
            let query = supabaseAdmin
                .from('route_metrics')
                .select('*');

            if (userId) {
                query = query.eq('user_id', userId);
            }

            const { data, error } = await query;

            if (error) throw new AppError(500, 'Chyba při získávání metrik tras', error);
            return data;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(500, 'Neočekávaná chyba při získávání metrik tras', error);
        }
    }
};

module.exports = supabaseService;
