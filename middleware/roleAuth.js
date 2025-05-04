/**
 * Middleware pro ověřování rolí a oprávnění
 * Verze 0.3.8.5
 */

const { AppError } = require('./errorHandler');

// Výchozí role a jejich oprávnění
const roles = {
    admin: ['read:all', 'write:all', 'delete:all', 'manage:users'],
    moderator: ['read:all', 'write:content', 'manage:content'],
    user: ['read:content', 'write:own', 'delete:own'],
    guest: ['read:public']
};

// Middleware pro kontrolu rolí
const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            if (!req.oidc.isAuthenticated()) {
                throw new AppError(401, 'Nepřihlášený uživatel');
            }

            const userRoles = req.oidc.user['https://aimapa.cz/roles'] || ['guest'];
            
            if (!userRoles.includes(requiredRole) && !userRoles.includes('admin')) {
                throw new AppError(403, 'Nedostatečné oprávnění pro tuto akci');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Middleware pro kontrolu oprávnění
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.oidc.isAuthenticated()) {
                throw new AppError(401, 'Nepřihlášený uživatel');
            }

            const userRoles = req.oidc.user['https://aimapa.cz/roles'] || ['guest'];
            const userPermissions = userRoles.reduce((perms, role) => {
                return [...perms, ...(roles[role] || [])];
            }, []);

            if (!userPermissions.includes(requiredPermission) && !userPermissions.includes('write:all')) {
                throw new AppError(403, 'Nedostatečné oprávnění pro tuto akci');
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Middleware pro vlastníka zdroje
const checkOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            if (!req.oidc.isAuthenticated()) {
                throw new AppError(401, 'Nepřihlášený uživatel');
            }

            const userId = req.oidc.user.sub;
            const resourceId = req.params.id;

            // Získání zdroje ze Supabase
            const { data: resource, error } = await req.supabaseClient
                .from(resourceType)
                .select('user_id')
                .eq('id', resourceId)
                .single();

            if (error) {
                throw new AppError(500, 'Chyba při ověřování vlastnictví');
            }

            if (!resource) {
                throw new AppError(404, 'Zdroj nenalezen');
            }

            if (resource.user_id !== userId) {
                const userRoles = req.oidc.user['https://aimapa.cz/roles'] || ['guest'];
                if (!userRoles.includes('admin') && !userRoles.includes('moderator')) {
                    throw new AppError(403, 'Nemáte oprávnění k tomuto zdroji');
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = {
    checkRole,
    checkPermission,
    checkOwnership,
    roles
};