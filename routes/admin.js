/**
 * Admin Routes pro AIMapa
 * Verze 0.3.8.5
 */

const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const { checkRole } = require('../middleware/roleAuth');
const { validateRequest } = require('../middleware/requestValidator');
const { AppError } = require('../middleware/errorHandler');
const supabaseService = require('../supabase-service');

// Schémata pro validaci
const timeRangeSchema = {
    query: {
        timeRange: { type: 'string', pattern: '^\\d+\\s+(hours|days|weeks|months)$' }
    }
};

const userRoleSchema = {
    body: {
        role: { type: 'string', enum: ['admin', 'moderator', 'user'] }
    }
};

// Middleware pro kontrolu admin přístupu
router.use(requiresAuth(), checkRole('admin'));

// Dashboard metriky
router.get('/metrics', async (req, res, next) => {
    try {
        const metrics = await supabaseService.getDashboardMetrics(
            req.query.timeRange || '24 hours'
        );
        res.json(metrics);
    } catch (error) {
        next(error);
    }
});

// API Performance
router.get('/performance', async (req, res, next) => {
    try {
        const performance = await supabaseService.getApiPerformance();
        res.json(performance);
    } catch (error) {
        next(error);
    }
});

// Uživatelská aktivita
router.get('/user-activity', async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const activity = await supabaseService.getUserActivityTimeline(days);
        res.json(activity);
    } catch (error) {
        next(error);
    }
});

// Route metriky
router.get('/route-metrics', async (req, res, next) => {
    try {
        const metrics = await supabaseService.getRouteMetrics(req.query.userId);
        res.json(metrics);
    } catch (error) {
        next(error);
    }
});

// Export logů
router.get('/logs/export', async (req, res, next) => {
    try {
        const { data, error } = await supabaseService.getAdminClient()
            .from('api_logs')
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) throw new AppError(500, 'Chyba při exportu logů', error);

        // Převod na CSV
        const fields = Object.keys(data[0]);
        const csv = [
            fields.join(','), // Header
            ...data.map(row => 
                fields.map(field => 
                    JSON.stringify(row[field] || '')
                ).join(',')
            )
        ].join('\n');

        // Nastavení hlaviček pro stažení
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=aimapa-logs-${new Date().toISOString()}.csv`);
        
        res.send(csv);
    } catch (error) {
        next(error);
    }
});

// Správa uživatelů
router.get('/users', async (req, res, next) => {
    try {
        const { data, error } = await supabaseService.getAdminClient()
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw new AppError(500, 'Chyba při získávání uživatelů', error);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

// Změna role uživatele
router.put('/users/:userId/role', 
    validateRequest(userRoleSchema),
    async (req, res, next) => {
        try {
            const { userId } = req.params;
            const { role } = req.body;

            // Kontrola, zda uživatel existuje
            const { data: user, error: userError } = await supabaseService.getAdminClient()
                .from('users')
                .select('*')
                .eq('auth0_id', userId)
                .single();

            if (userError) throw new AppError(404, 'Uživatel nenalezen');

            // Aktualizace role v Auth0
            await updateAuth0UserRole(userId, role);

            // Aktualizace role v Supabase
            const { error: updateError } = await supabaseService.getAdminClient()
                .from('user_roles')
                .upsert({
                    auth0_id: userId,
                    roles: [role],
                    updated_at: new Date().toISOString()
                });

            if (updateError) throw new AppError(500, 'Chyba při aktualizaci role', updateError);

            res.json({ message: 'Role byla úspěšně aktualizována' });
        } catch (error) {
            next(error);
        }
    }
);

// Pomocná funkce pro aktualizaci role v Auth0
async function updateAuth0UserRole(userId, role) {
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const auth0Token = await getAuth0ManagementToken();

    const response = await fetch(`https://${auth0Domain}/api/v2/users/${userId}/roles`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${auth0Token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roles: [role]
        })
    });

    if (!response.ok) {
        throw new AppError(500, 'Chyba při aktualizaci role v Auth0');
    }
}

// Pomocná funkce pro získání Auth0 Management API tokenu
async function getAuth0ManagementToken() {
    const auth0Domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;

    const response = await fetch(`https://${auth0Domain}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            audience: `https://${auth0Domain}/api/v2/`,
            grant_type: 'client_credentials'
        })
    });

    if (!response.ok) {
        throw new AppError(500, 'Chyba při získávání Auth0 tokenu');
    }

    const data = await response.json();
    return data.access_token;
}

module.exports = router;