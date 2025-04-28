/**
 * Testovací skript pro ověření autentizace v AIMapa
 * Verze 0.3.8.5
 */

// Testovací data
const testUsers = [
    {
        email: 'test@example.com',
        password: 'Test1234!',
        username: 'TestUser'
    },
    {
        email: 'admin@example.com',
        password: 'Admin1234!',
        username: 'AdminUser'
    }
];

// Funkce pro testování registrace
async function testRegistration(user) {
    console.log(`Testování registrace uživatele: ${user.email}`);
    
    try {
        // Simulace registrace přes LocalAuth
        if (typeof LocalAuth !== 'undefined') {
            const result = await LocalAuth.signUp(user.email, user.password, { username: user.username });
            console.log('Výsledek registrace (LocalAuth):', result);
            return result;
        }
        
        // Simulace registrace přes HybridAuth
        if (typeof HybridAuth !== 'undefined') {
            const result = await HybridAuth.signUp(user.email, user.password, { username: user.username });
            console.log('Výsledek registrace (HybridAuth):', result);
            return result;
        }
        
        // Simulace registrace přes Supabase
        if (typeof SupabaseClient !== 'undefined') {
            const result = await SupabaseClient.signUp(user.email, user.password, { username: user.username });
            console.log('Výsledek registrace (Supabase):', result);
            return result;
        }
        
        console.error('Není dostupný žádný autentizační systém');
        return { error: { message: 'Není dostupný žádný autentizační systém' } };
    } catch (error) {
        console.error('Chyba při testování registrace:', error);
        return { error };
    }
}

// Funkce pro testování přihlášení
async function testLogin(user) {
    console.log(`Testování přihlášení uživatele: ${user.email}`);
    
    try {
        // Simulace přihlášení přes LocalAuth
        if (typeof LocalAuth !== 'undefined') {
            const result = await LocalAuth.signIn(user.email, user.password);
            console.log('Výsledek přihlášení (LocalAuth):', result);
            return result;
        }
        
        // Simulace přihlášení přes HybridAuth
        if (typeof HybridAuth !== 'undefined') {
            const result = await HybridAuth.signIn(user.email, user.password);
            console.log('Výsledek přihlášení (HybridAuth):', result);
            return result;
        }
        
        // Simulace přihlášení přes Supabase
        if (typeof SupabaseClient !== 'undefined') {
            const result = await SupabaseClient.signIn(user.email, user.password);
            console.log('Výsledek přihlášení (Supabase):', result);
            return result;
        }
        
        console.error('Není dostupný žádný autentizační systém');
        return { error: { message: 'Není dostupný žádný autentizační systém' } };
    } catch (error) {
        console.error('Chyba při testování přihlášení:', error);
        return { error };
    }
}

// Funkce pro testování odhlášení
async function testLogout() {
    console.log('Testování odhlášení uživatele');
    
    try {
        // Simulace odhlášení přes LocalAuth
        if (typeof LocalAuth !== 'undefined') {
            const result = await LocalAuth.signOut();
            console.log('Výsledek odhlášení (LocalAuth):', result);
            return result;
        }
        
        // Simulace odhlášení přes HybridAuth
        if (typeof HybridAuth !== 'undefined') {
            const result = await HybridAuth.signOut();
            console.log('Výsledek odhlášení (HybridAuth):', result);
            return result;
        }
        
        // Simulace odhlášení přes Supabase
        if (typeof SupabaseClient !== 'undefined') {
            const result = await SupabaseClient.signOut();
            console.log('Výsledek odhlášení (Supabase):', result);
            return result;
        }
        
        console.error('Není dostupný žádný autentizační systém');
        return { error: { message: 'Není dostupný žádný autentizační systém' } };
    } catch (error) {
        console.error('Chyba při testování odhlášení:', error);
        return { error };
    }
}

// Funkce pro spuštění všech testů
async function runAllTests() {
    console.log('Spouštění všech testů autentizace...');
    
    // Test registrace prvního uživatele
    const registrationResult1 = await testRegistration(testUsers[0]);
    
    // Test přihlášení prvního uživatele
    const loginResult1 = await testLogin(testUsers[0]);
    
    // Test odhlášení
    const logoutResult = await testLogout();
    
    // Test registrace druhého uživatele
    const registrationResult2 = await testRegistration(testUsers[1]);
    
    // Test přihlášení druhého uživatele
    const loginResult2 = await testLogin(testUsers[1]);
    
    console.log('Všechny testy byly dokončeny');
    
    // Vrácení výsledků testů
    return {
        registrationResult1,
        loginResult1,
        logoutResult,
        registrationResult2,
        loginResult2
    };
}

// Export funkcí pro použití v konzoli prohlížeče
window.AuthTest = {
    testRegistration,
    testLogin,
    testLogout,
    runAllTests,
    testUsers
};

console.log('Testovací skript pro autentizaci byl načten. Použijte AuthTest.runAllTests() pro spuštění všech testů.');
