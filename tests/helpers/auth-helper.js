/**
 * Helper pro autentizaci v testech
 */

const { ManagementClient } = require('auth0');
const { createClient } = require('@supabase/supabase-js');

const auth0 = new ManagementClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Pole pro sledování vytvořených testovacích uživatelů
const testUsers = [];

/**
 * Vytvoří testovacího uživatele v Auth0 a Supabase
 */
async function createTestUser({ email, role = 'user', permissions = [] }) {
    try {
        // Vytvoření uživatele v Auth0
        const auth0User = await auth0.createUser({
            email,
            password: 'TestPassword123!',
            connection: 'Username-Password-Authentication',
            email_verified: true
        });

        // Přidání role v Auth0
        await auth0.assignRolestoUser(
            { id: auth0User.user_id },
            { roles: [role] }
        );

        // Vytvoření uživatele v Supabase
        const { data: supabaseUser, error } = await supabase
            .from('user_roles')
            .insert({
                auth0_id: auth0User.user_id,
                roles: [role],
                permissions,
                created_at: new Date().toISOString()
            })
            .single();

        if (error) {
            throw error;
        }

        // Uložení uživatele pro pozdější cleanup
        testUsers.push(auth0User);

        // Získání ID tokenu
        const token = await getTestUserToken(auth0User);

        return {
            ...auth0User,
            supabaseData: supabaseUser,
            getIdToken: () => token,
            uid: auth0User.user_id
        };
    } catch (error) {
        console.error('Chyba při vytváření testovacího uživatele:', error);
        throw error;
    }
}

/**
 * Získá token pro testovacího uživatele
 */
async function getTestUserToken(user) {
    try {
        const token = await auth0.getAccessTokenForUser(user.user_id);
        return token;
    } catch (error) {
        console.error('Chyba při získávání tokenu:', error);
        throw error;
    }
}

/**
 * Vymaže všechny vytvořené testovací uživatele
 */
async function cleanupTestUsers() {
    try {
        // Vymazání uživatelů z Auth0
        await Promise.all(
            testUsers.map(user =>
                auth0.deleteUser({ id: user.user_id })
            )
        );

        // Vymazání uživatelů ze Supabase
        await supabase
            .from('user_roles')
            .delete()
            .in('auth0_id', testUsers.map(u => u.user_id));

        // Vyčištění pole testovacích uživatelů
        testUsers.length = 0;
    } catch (error) {
        console.error('Chyba při mazání testovacích uživatelů:', error);
        throw error;
    }
}

module.exports = {
    createTestUser,
    cleanupTestUsers,
    getTestUserToken
};