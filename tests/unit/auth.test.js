/**
 * Unit testy pro autentizaci
 * Verze 0.3.8.6
 */

// Modul pro testování autentizace
const AuthTest = {
    // Testovací data
    testData: {
        users: [
            { id: 'auth0|123456789', email: 'test@example.com', name: 'Test User', picture: 'https://example.com/avatar.jpg' },
            { id: 'auth0|987654321', email: 'admin@example.com', name: 'Admin User', picture: 'https://example.com/admin.jpg' }
        ],
        tokens: {
            valid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHwxMjM0NTY3ODkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
            expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHwxMjM0NTY3ODkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiZXhwIjoxNTE2MjM5MDIyLCJpYXQiOjE1MTYyMzkwMjJ9.7Tq_VJiI9rQzXGMWSgA-qCi5NTwGaEZv_6u8EDv0vWo',
            invalid: 'invalid.token.format'
        }
    },

    /**
     * Test ověření platnosti tokenu
     */
    testTokenValidation() {
        console.log('Spouštím test ověření platnosti tokenu...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testovací případy
        const testCases = [
            { token: this.testData.tokens.valid, expected: true },
            { token: this.testData.tokens.expired, expected: false },
            { token: this.testData.tokens.invalid, expected: false },
            { token: null, expected: false },
            { token: '', expected: false }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const isValid = this.validateToken(testCase.token);
            const passed = isValid === testCase.expected;

            // Přidání výsledku
            results.details.push({
                token: testCase.token ? `${testCase.token.substring(0, 10)}...` : testCase.token,
                expected: testCase.expected,
                actual: isValid,
                passed: passed
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        return results;
    },

    /**
     * Test získání uživatelského profilu
     */
    testGetUserProfile() {
        console.log('Spouštím test získání uživatelského profilu...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testovací případy
        const testCases = [
            { userId: 'auth0|123456789', expected: this.testData.users[0] },
            { userId: 'auth0|987654321', expected: this.testData.users[1] },
            { userId: 'auth0|nonexistent', expected: null },
            { userId: null, expected: null },
            { userId: '', expected: null }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const profile = this.getUserProfile(testCase.userId);
            
            let passed = false;
            if (testCase.expected === null) {
                passed = profile === null;
            } else if (profile !== null) {
                passed = profile.id === testCase.expected.id &&
                         profile.email === testCase.expected.email &&
                         profile.name === testCase.expected.name;
            }

            // Přidání výsledku
            results.details.push({
                userId: testCase.userId,
                expected: testCase.expected ? testCase.expected.name : null,
                actual: profile ? profile.name : null,
                passed: passed
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        return results;
    },

    /**
     * Test ověření oprávnění uživatele
     */
    testCheckUserPermissions() {
        console.log('Spouštím test ověření oprávnění uživatele...');

        const results = {
            passed: 0,
            failed: 0,
            details: []
        };

        // Testovací případy
        const testCases = [
            { userId: 'auth0|123456789', permission: 'read:map', expected: true },
            { userId: 'auth0|123456789', permission: 'write:map', expected: false },
            { userId: 'auth0|987654321', permission: 'read:map', expected: true },
            { userId: 'auth0|987654321', permission: 'write:map', expected: true },
            { userId: 'auth0|987654321', permission: 'admin', expected: true },
            { userId: 'auth0|123456789', permission: 'admin', expected: false },
            { userId: 'auth0|nonexistent', permission: 'read:map', expected: false },
            { userId: null, permission: 'read:map', expected: false }
        ];

        // Testování všech případů
        testCases.forEach(testCase => {
            const hasPermission = this.checkUserPermission(testCase.userId, testCase.permission);
            const passed = hasPermission === testCase.expected;

            // Přidání výsledku
            results.details.push({
                userId: testCase.userId,
                permission: testCase.permission,
                expected: testCase.expected,
                actual: hasPermission,
                passed: passed
            });

            if (passed) {
                results.passed++;
            } else {
                results.failed++;
            }
        });

        console.log(`Test dokončen: ${results.passed} úspěšných, ${results.failed} neúspěšných`);
        return results;
    },

    /**
     * Spuštění všech testů
     */
    runAllTests() {
        console.log('Spouštím všechny testy autentizace...');

        const results = {
            tokenValidation: this.testTokenValidation(),
            userProfile: this.testGetUserProfile(),
            userPermissions: this.testCheckUserPermissions()
        };

        // Výpočet celkových výsledků
        const totalPassed = results.tokenValidation.passed +
                           results.userProfile.passed +
                           results.userPermissions.passed;

        const totalFailed = results.tokenValidation.failed +
                           results.userProfile.failed +
                           results.userPermissions.failed;

        console.log(`Všechny testy dokončeny: ${totalPassed} úspěšných, ${totalFailed} neúspěšných`);

        return {
            results: results,
            summary: {
                passed: totalPassed,
                failed: totalFailed,
                total: totalPassed + totalFailed
            }
        };
    },

    /**
     * Ověření platnosti tokenu
     * @param {string} token - JWT token k ověření
     * @returns {boolean} - True pokud je token platný
     */
    validateToken(token) {
        if (!token) {
            return false;
        }

        try {
            // Simulace ověření tokenu
            const parts = token.split('.');
            if (parts.length !== 3) {
                return false;
            }

            // Dekódování payloadu
            const payload = JSON.parse(atob(parts[1]));
            
            // Kontrola expirace
            if (payload.exp && payload.exp < Date.now() / 1000) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Získání uživatelského profilu
     * @param {string} userId - ID uživatele
     * @returns {object|null} - Uživatelský profil nebo null
     */
    getUserProfile(userId) {
        if (!userId) {
            return null;
        }

        // Simulace získání profilu z databáze
        const user = this.testData.users.find(u => u.id === userId);
        return user || null;
    },

    /**
     * Ověření oprávnění uživatele
     * @param {string} userId - ID uživatele
     * @param {string} permission - Požadované oprávnění
     * @returns {boolean} - True pokud má uživatel oprávnění
     */
    checkUserPermission(userId, permission) {
        if (!userId) {
            return false;
        }

        // Simulace ověření oprávnění
        const user = this.getUserProfile(userId);
        if (!user) {
            return false;
        }

        // Simulace rolí a oprávnění
        const isAdmin = user.id === 'auth0|987654321';
        
        // Základní oprávnění pro všechny uživatele
        if (permission === 'read:map') {
            return true;
        }

        // Oprávnění pouze pro adminy
        if (isAdmin) {
            return true;
        }

        return false;
    },

    /**
     * Pomocná funkce pro dekódování Base64
     * @param {string} str - Base64 řetězec
     * @returns {string} - Dekódovaný řetězec
     */
    atob(str) {
        try {
            // Pro Node.js
            if (typeof Buffer !== 'undefined') {
                return Buffer.from(str, 'base64').toString('binary');
            }
            // Pro prohlížeč
            else if (typeof window !== 'undefined' && window.atob) {
                return window.atob(str);
            }
            // Fallback implementace
            else {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                let output = '';
                str = String(str).replace(/=+$/, '');
                
                if (str.length % 4 === 1) {
                    throw new Error('Neplatný Base64 řetězec');
                }
                
                for (
                    let bc = 0, bs = 0, buffer, i = 0;
                    buffer = str.charAt(i++);
                    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
                ) {
                    buffer = chars.indexOf(buffer);
                }
                
                return output;
            }
        } catch (error) {
            console.error('Chyba při dekódování Base64:', error);
            return '';
        }
    }
};

// Export modulu pro použití v prohlížeči i Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthTest;
} else {
    window.AuthTest = AuthTest;
}
