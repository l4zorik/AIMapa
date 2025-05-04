/**
 * Pravidla pro synchronizaci rolí mezi Auth0 a Supabase
 * @param {object} user - Auth0 uživatelský objekt
 * @param {object} context - Kontext autentizace
 * @param {function} callback - Callback funkce
 */
function syncRolesRule(user, context, callback) {
    // Konfigurace
    const NAMESPACE = 'https://aimapa.cz';
    const SUPABASE_URL = configuration.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = configuration.SUPABASE_SERVICE_KEY;

    // Pokud nemáme Supabase konfiguraci, pokračujeme bez synchronizace
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.log('Chybí Supabase konfigurace');
        return callback(null, user, context);
    }

    // Přidání role do tokenu
    if (!context.accessToken[NAMESPACE]) {
        context.accessToken[NAMESPACE] = {};
    }

    // Získání rolí uživatele
    const roles = user.app_metadata.roles || ['user'];
    context.accessToken[NAMESPACE + '/roles'] = roles;

    // Získání oprávnění pro role
    const allPermissions = new Set();
    roles.forEach(role => {
        const rolePermissions = configuration.roles[role]?.permissions || [];
        rolePermissions.forEach(permission => allPermissions.add(permission));
    });
    context.accessToken[NAMESPACE + '/permissions'] = Array.from(allPermissions);

    // Synchronizace s Supabase
    const request = require('request');
    const supabaseHeaders = {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
    };

    const userData = {
        auth0_id: user.user_id,
        email: user.email,
        roles: roles,
        permissions: Array.from(allPermissions),
        last_login: new Date().toISOString()
    };

    request.post({
        url: `${SUPABASE_URL}/rest/v1/user_roles`,
        headers: supabaseHeaders,
        body: JSON.stringify(userData)
    }, (error, response, body) => {
        if (error) {
            console.log('Chyba při synchronizaci rolí se Supabase:', error);
        } else {
            console.log('Role úspěšně synchronizovány se Supabase');
        }
        callback(null, user, context);
    });
}