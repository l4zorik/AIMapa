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
            console.log('DEBUG AUTH: checkRole middleware called for role:', requiredRole);

            // Kontrola, zda existuje req.oidc
            if (!req.oidc) {
                console.log('DEBUG AUTH: req.oidc neexistuje, vytvářím dočasný');
                req.oidc = {
                    user: {
                        sub: 'temp-user-id',
                        'https://aimapa.cz/roles': ['user']
                    },
                    isAuthenticated: () => true
                };
            }

            if (!req.oidc.isAuthenticated()) {
                console.log('DEBUG AUTH: Uživatel není přihlášen');
                throw new AppError(401, 'Nepřihlášený uživatel');
            }

            const userRoles = req.oidc.user['https://aimapa.cz/roles'] || ['guest'];
            console.log('DEBUG AUTH: User roles:', userRoles);

            if (!userRoles.includes(requiredRole) && !userRoles.includes('admin')) {
                console.log('DEBUG AUTH: Nedostatečné oprávnění, požadováno:', requiredRole);
                throw new AppError(403, 'Nedostatečné oprávnění pro tuto akci');
            }

            console.log('DEBUG AUTH: Role check passed');
            next();
        } catch (error) {
            console.log('DEBUG AUTH: Error in checkRole:', error.message);
            next(error);
        }
    };
};

// Middleware pro kontrolu oprávnění
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            console.log('DEBUG AUTH: checkPermission middleware called for permission:', requiredPermission);

            // Kontrola, zda existuje req.oidc
            if (!req.oidc) {
                console.log('DEBUG AUTH: req.oidc neexistuje, vytvářím dočasný');
                req.oidc = {
                    user: {
                        sub: 'temp-user-id',
                        'https://aimapa.cz/roles': ['user']
                    },
                    isAuthenticated: () => true
                };
            }

            if (!req.oidc.isAuthenticated()) {
                console.log('DEBUG AUTH: Uživatel není přihlášen');
                throw new AppError(401, 'Nepřihlášený uživatel');
            }

            const userRoles = req.oidc.user['https://aimapa.cz/roles'] || ['guest'];
            console.log('DEBUG AUTH: User roles for permissions:', userRoles);

            const userPermissions = userRoles.reduce((perms, role) => {
                return [...perms, ...(roles[role] || [])];
            }, []);
            console.log('DEBUG AUTH: User permissions:', userPermissions);

            if (!userPermissions.includes(requiredPermission) && !userPermissions.includes('write:all')) {
                console.log('DEBUG AUTH: Nedostatečné oprávnění, požadováno:', requiredPermission);
                throw new AppError(403, 'Nedostatečné oprávnění pro tuto akci');
            }

            console.log('DEBUG AUTH: Permission check passed');
            next();
        } catch (error) {
            console.log('DEBUG AUTH: Error in checkPermission:', error.message);
            next(error);
        }
    };
};

// Middleware pro vlastníka zdroje
const checkOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            console.log('DEBUG AUTH: checkOwnership middleware called for resource type:', resourceType);

            // Kontrola, zda existuje req.oidc
            if (!req.oidc) {
                console.log('DEBUG AUTH: req.oidc neexistuje, vytvářím dočasný');
                req.oidc = {
                    user: {
                        sub: 'temp-user-id',
                        'https://aimapa.cz/roles': ['user']
                    },
                    isAuthenticated: () => true
                };
            }

            if (!req.oidc.isAuthenticated()) {
                console.log('DEBUG AUTH: Uživatel není přihlášen');
                throw new AppError(401, 'Nepřihlášený uživatel');
            }

            const userId = req.oidc.user.sub;
            const resourceId = req.params.id;
            console.log('DEBUG AUTH: Kontrola vlastnictví pro uživatele:', userId, 'a zdroj:', resourceId);

            // Získání zdroje ze Supabase
            const { data: resource, error } = await req.supabaseClient
                .from(resourceType)
                .select('user_id')
                .eq('id', resourceId)
                .single();

            if (error) {
                console.log('DEBUG AUTH: Chyba při získávání zdroje:', error);
                throw new AppError(500, 'Chyba při ověřování vlastnictví');
            }

            if (!resource) {
                console.log('DEBUG AUTH: Zdroj nenalezen');
                throw new AppError(404, 'Zdroj nenalezen');
            }

            console.log('DEBUG AUTH: Zdroj patří uživateli:', resource.user_id);

            if (resource.user_id !== userId) {
                const userRoles = req.oidc.user['https://aimapa.cz/roles'] || ['guest'];
                console.log('DEBUG AUTH: Uživatel není vlastníkem, kontrola rolí:', userRoles);

                if (!userRoles.includes('admin') && !userRoles.includes('moderator')) {
                    console.log('DEBUG AUTH: Uživatel nemá dostatečná oprávnění');
                    throw new AppError(403, 'Nemáte oprávnění k tomuto zdroji');
                }
            }

            console.log('DEBUG AUTH: Ownership check passed');
            next();
        } catch (error) {
            console.log('DEBUG AUTH: Error in checkOwnership:', error.message);
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