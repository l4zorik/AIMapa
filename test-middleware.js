/**
 * Testovací skript pro middleware roleAuth
 */

const { checkPermission, checkRole, checkOwnership } = require('./middleware/roleAuth');

// Testovací funkce
function testMiddleware() {
    console.log('Testování middleware roleAuth...');
    
    // Test checkPermission
    console.log('checkPermission je typu:', typeof checkPermission);
    const permissionMiddleware = checkPermission('write:content');
    console.log('permissionMiddleware je typu:', typeof permissionMiddleware);
    
    // Test checkRole
    console.log('checkRole je typu:', typeof checkRole);
    const roleMiddleware = checkRole('admin');
    console.log('roleMiddleware je typu:', typeof roleMiddleware);
    
    // Test checkOwnership
    console.log('checkOwnership je typu:', typeof checkOwnership);
    const ownershipMiddleware = checkOwnership('routes');
    console.log('ownershipMiddleware je typu:', typeof ownershipMiddleware);
}

// Spuštění testu
testMiddleware();
