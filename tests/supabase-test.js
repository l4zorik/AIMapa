/**
 * Testovací skript pro ověření integrace se Supabase v AIMapa
 * Verze 0.3.8.5
 */

// Testovací data
const testData = {
    user: {
        id: 'test-user-id',
        email: 'test@example.com',
        username: 'TestUser'
    },
    task: {
        id: 'test-task-id',
        title: 'Testovací úkol',
        description: 'Popis testovacího úkolu',
        completed: false,
        created_at: new Date().toISOString()
    }
};

// Funkce pro testování připojení k Supabase
async function testConnection() {
    console.log('Testování připojení k Supabase...');
    
    try {
        if (typeof SupabaseClient === 'undefined') {
            console.error('SupabaseClient není definován');
            return { error: { message: 'SupabaseClient není definován' } };
        }
        
        const result = await SupabaseClient.testConnection();
        console.log('Výsledek testu připojení:', result);
        return result;
    } catch (error) {
        console.error('Chyba při testování připojení:', error);
        return { error };
    }
}

// Funkce pro testování ukládání dat
async function testDataSaving() {
    console.log('Testování ukládání dat do Supabase...');
    
    try {
        if (typeof SupabaseClient === 'undefined') {
            console.error('SupabaseClient není definován');
            return { error: { message: 'SupabaseClient není definován' } };
        }
        
        // Testování ukládání úkolu
        const result = await SupabaseClient.saveTask(testData.task);
        console.log('Výsledek ukládání dat:', result);
        return result;
    } catch (error) {
        console.error('Chyba při testování ukládání dat:', error);
        return { error };
    }
}

// Funkce pro testování načítání dat
async function testDataLoading() {
    console.log('Testování načítání dat ze Supabase...');
    
    try {
        if (typeof SupabaseClient === 'undefined') {
            console.error('SupabaseClient není definován');
            return { error: { message: 'SupabaseClient není definován' } };
        }
        
        // Testování načítání úkolů
        const result = await SupabaseClient.getTasks();
        console.log('Výsledek načítání dat:', result);
        return result;
    } catch (error) {
        console.error('Chyba při testování načítání dat:', error);
        return { error };
    }
}

// Funkce pro testování aktualizace dat
async function testDataUpdating() {
    console.log('Testování aktualizace dat v Supabase...');
    
    try {
        if (typeof SupabaseClient === 'undefined') {
            console.error('SupabaseClient není definován');
            return { error: { message: 'SupabaseClient není definován' } };
        }
        
        // Aktualizace testovacího úkolu
        const updatedTask = { ...testData.task, completed: true };
        
        // Testování aktualizace úkolu
        const result = await SupabaseClient.updateTask(updatedTask);
        console.log('Výsledek aktualizace dat:', result);
        return result;
    } catch (error) {
        console.error('Chyba při testování aktualizace dat:', error);
        return { error };
    }
}

// Funkce pro testování mazání dat
async function testDataDeleting() {
    console.log('Testování mazání dat v Supabase...');
    
    try {
        if (typeof SupabaseClient === 'undefined') {
            console.error('SupabaseClient není definován');
            return { error: { message: 'SupabaseClient není definován' } };
        }
        
        // Testování mazání úkolu
        const result = await SupabaseClient.deleteTask(testData.task.id);
        console.log('Výsledek mazání dat:', result);
        return result;
    } catch (error) {
        console.error('Chyba při testování mazání dat:', error);
        return { error };
    }
}

// Funkce pro spuštění všech testů
async function runAllTests() {
    console.log('Spouštění všech testů Supabase integrace...');
    
    // Test připojení
    const connectionResult = await testConnection();
    
    // Test ukládání dat
    const savingResult = await testDataSaving();
    
    // Test načítání dat
    const loadingResult = await testDataLoading();
    
    // Test aktualizace dat
    const updatingResult = await testDataUpdating();
    
    // Test mazání dat
    const deletingResult = await testDataDeleting();
    
    console.log('Všechny testy byly dokončeny');
    
    // Vrácení výsledků testů
    return {
        connectionResult,
        savingResult,
        loadingResult,
        updatingResult,
        deletingResult
    };
}

// Export funkcí pro použití v konzoli prohlížeče
window.SupabaseTest = {
    testConnection,
    testDataSaving,
    testDataLoading,
    testDataUpdating,
    testDataDeleting,
    runAllTests,
    testData
};

console.log('Testovací skript pro Supabase integraci byl načten. Použijte SupabaseTest.runAllTests() pro spuštění všech testů.');
