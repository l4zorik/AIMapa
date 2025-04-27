/**
 * Supabase autentizace pro AIMapa
 * Verze 0.3.8.4
 */

// Modul pro autentizaci uživatelů pomocí Supabase
const SupabaseAuth = {
    // Stav modulu
    state: {
        isInitialized: false,
        isLoggedIn: false,
        currentUser: null,
        authWindowShown: false
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu Supabase autentizace...');

        // Kontrola, zda je dostupný SupabaseClient
        if (typeof SupabaseClient === 'undefined') {
            console.error('SupabaseClient není dostupný. Ujistěte se, že je načten skript supabase-client.js.');
            return;
        }

        // Přidání tlačítka pro přihlášení/registraci
        this.addAuthButton();

        // Kontrola, zda je uživatel přihlášen
        this.checkCurrentUser();

        // Nastavení posluchačů událostí pro změny autentizace
        this.setupAuthListeners();

        this.state.isInitialized = true;
        console.log('Modul Supabase autentizace byl inicializován');
    },

    // Kontrola aktuálně přihlášeného uživatele
    async checkCurrentUser() {
        try {
            const result = await SupabaseClient.getCurrentUser();

            if (result.success && result.user) {
                this.state.isLoggedIn = true;
                this.state.currentUser = result.user;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Načtení profilu uživatele
                this.loadUserProfile();

                console.log('Uživatel je přihlášen:', result.user.email);
            } else {
                this.state.isLoggedIn = false;
                this.state.currentUser = null;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                console.log('Žádný uživatel není přihlášen');
            }
        } catch (error) {
            console.error('Chyba při kontrole aktuálního uživatele:', error);
            this.state.isLoggedIn = false;
            this.state.currentUser = null;

            // Aktualizace tlačítka autentizace
            this.updateAuthButton();
        }
    },

    // Načtení profilu uživatele
    async loadUserProfile() {
        if (!this.state.currentUser) return;

        try {
            const result = await SupabaseClient.getUserProfile(this.state.currentUser.id);

            if (result.success && result.profile) {
                // Aktualizace lokálních dat uživatele
                if (typeof UserAccounts !== 'undefined') {
                    // Převod dat z Supabase na formát UserAccounts
                    const userData = {
                        id: result.profile.id,
                        username: result.profile.username,
                        email: result.profile.email,
                        avatar: result.profile.avatar_url,
                        balance: result.profile.balance,
                        currency: result.profile.currency,
                        level: result.profile.level,
                        xp: result.profile.xp,
                        xpToNextLevel: result.profile.xp_to_next_level,
                        registrationDate: result.profile.created_at,
                        lastActivity: result.profile.updated_at,
                        achievements: [],
                        stats: {},
                        settings: {}
                    };

                    // Načtení statistik
                    const statsResult = await SupabaseClient.getUserStats(result.profile.id);
                    if (statsResult.success && statsResult.stats) {
                        userData.stats = {
                            totalEarnings: statsResult.stats.total_earnings,
                            totalTasks: statsResult.stats.total_tasks,
                            totalWorkTime: statsResult.stats.total_work_time,
                            totalLogins: statsResult.stats.total_logins
                        };
                    }

                    // Načtení nastavení
                    const settingsResult = await SupabaseClient.getUserSettings(result.profile.id);
                    if (settingsResult.success && settingsResult.settings) {
                        userData.settings = {
                            notifications: settingsResult.settings.notifications_enabled,
                            darkMode: settingsResult.settings.dark_mode,
                            language: settingsResult.settings.language
                        };
                    }

                    // Načtení achievementů
                    const achievementsResult = await SupabaseClient.getUserAchievements(result.profile.id);
                    if (achievementsResult.success && achievementsResult.achievements) {
                        userData.achievements = achievementsResult.achievements.map(achievement => ({
                            id: achievement.achievement_id,
                            name: achievement.achievement_name,
                            description: achievement.achievement_description,
                            date: achievement.unlocked_at
                        }));
                    }

                    // Aktualizace dat v UserAccounts
                    UserAccounts.state.currentUser = userData;
                    UserAccounts.state.isLoggedIn = true;
                    UserAccounts.saveUserData();

                    console.log('Profil uživatele byl načten a synchronizován s UserAccounts');
                } else {
                    console.log('Profil uživatele byl načten, ale UserAccounts není dostupný pro synchronizaci');
                }
            } else {
                console.error('Nepodařilo se načíst profil uživatele');
            }
        } catch (error) {
            console.error('Chyba při načítání profilu uživatele:', error);
        }
    },

    // Nastavení posluchačů událostí pro změny autentizace
    setupAuthListeners() {
        // Kontrola, zda je dostupný SupabaseClient
        if (typeof SupabaseClient === 'undefined' || !SupabaseClient.getClient()) return;

        const client = SupabaseClient.getClient();

        // Posluchač pro změny autentizace
        client.auth.onAuthStateChange((event, session) => {
            console.log('Změna stavu autentizace:', event);

            if (event === 'SIGNED_IN' && session) {
                this.state.isLoggedIn = true;
                this.state.currentUser = session.user;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Načtení profilu uživatele
                this.loadUserProfile();

                console.log('Uživatel byl přihlášen:', session.user.email);
            } else if (event === 'SIGNED_OUT') {
                this.state.isLoggedIn = false;
                this.state.currentUser = null;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Resetování dat v UserAccounts
                if (typeof UserAccounts !== 'undefined') {
                    UserAccounts.createDefaultUser();
                    console.log('Data UserAccounts byla resetována po odhlášení');
                }

                console.log('Uživatel byl odhlášen');
            }
        });
    },

    // Přidání tlačítka pro přihlášení/registraci
    addAuthButton() {
        // Kontrola, zda již tlačítko existuje
        let authButton = document.getElementById('supabaseAuthButton');

        // Pokud tlačítko neexistuje, vytvoříme ho
        if (!authButton) {
            authButton = document.createElement('button');
            authButton.id = 'supabaseAuthButton';
            authButton.className = 'supabase-auth-button';
            document.body.appendChild(authButton);

            // Přidání event listeneru
            authButton.addEventListener('click', () => {
                this.toggleAuthWindow();
            });
        }

        // Aktualizace textu tlačítka podle stavu přihlášení
        this.updateAuthButton();
    },

    // Aktualizace tlačítka autentizace
    updateAuthButton() {
        const authButton = document.getElementById('supabaseAuthButton');
        if (!authButton) return;

        if (this.state.isLoggedIn && this.state.currentUser) {
            authButton.innerHTML = '<span class="auth-button-icon">👤</span>';
            authButton.title = 'Přihlášen jako ' + (this.state.currentUser.email || 'uživatel');
            authButton.classList.add('logged-in');
        } else {
            authButton.innerHTML = '<span class="auth-button-icon">🔑</span>';
            authButton.title = 'Přihlásit se / Registrovat se';
            authButton.classList.remove('logged-in');
        }
    },

    // Zobrazení/skrytí okna s autentizací
    toggleAuthWindow() {
        if (this.state.authWindowShown) {
            this.hideAuthWindow();
        } else {
            this.showAuthWindow();
        }
    },

    // Zobrazení okna s autentizací
    showAuthWindow() {
        // Kontrola, zda již okno existuje
        let authWindow = document.getElementById('supabaseAuthWindow');

        // Pokud okno neexistuje, vytvoříme ho
        if (!authWindow) {
            authWindow = document.createElement('div');
            authWindow.id = 'supabaseAuthWindow';
            authWindow.className = 'supabase-auth-window';
            document.body.appendChild(authWindow);
        }

        // Nastavení obsahu okna podle stavu přihlášení
        if (this.state.isLoggedIn && this.state.currentUser) {
            this.showUserProfileWindow(authWindow);
        } else {
            this.showLoginWindow(authWindow);
        }

        // Zobrazení okna
        setTimeout(() => {
            authWindow.classList.add('show');
        }, 10);

        // Nastavení příznaku zobrazení okna
        this.state.authWindowShown = true;
    },

    // Zobrazení okna s profilem uživatele
    showUserProfileWindow(authWindow) {
        // Získání dat uživatele
        const user = this.state.currentUser;

        // Nastavení obsahu okna
        authWindow.innerHTML = `
            <div class="auth-window-header">
                <div class="auth-window-title">
                    <i class="icon">👤</i> Váš účet
                </div>
                <div class="auth-window-controls">
                    <button class="auth-window-close">&times;</button>
                </div>
            </div>
            <div class="auth-window-content">
                <div class="auth-profile">
                    <div class="auth-email">${user.email}</div>
                    <div class="auth-actions">
                        <button class="auth-logout-button">Odhlásit se</button>
                    </div>
                </div>
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="profile">Profil</button>
                    <button class="auth-tab" data-tab="settings">Nastavení</button>
                    <button class="auth-tab" data-tab="sync">Synchronizace</button>
                </div>
                <div class="auth-tab-content">
                    <div class="auth-tab-pane active" id="profile-tab">
                        <h3>Váš profil</h3>
                        <p>Zde budou zobrazeny informace o vašem profilu.</p>
                    </div>
                    <div class="auth-tab-pane" id="settings-tab">
                        <h3>Nastavení účtu</h3>
                        <p>Zde budete moci upravit nastavení svého účtu.</p>
                    </div>
                    <div class="auth-tab-pane" id="sync-tab">
                        <h3>Synchronizace dat</h3>
                        <p>Zde budete moci synchronizovat svá data mezi zařízeními.</p>
                        <button class="auth-sync-button">Synchronizovat data</button>
                    </div>
                </div>
            </div>
        `;

        // Přidání event listenerů
        const closeButton = authWindow.querySelector('.auth-window-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideAuthWindow();
            });
        }

        const logoutButton = authWindow.querySelector('.auth-logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.logout();
            });
        }

        const syncButton = authWindow.querySelector('.auth-sync-button');
        if (syncButton) {
            syncButton.addEventListener('click', () => {
                this.synchronizeData();
            });
        }

        const tabs = authWindow.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech záložek
                tabs.forEach(t => t.classList.remove('active'));

                // Přidání aktivní třídy na kliknutou záložku
                tab.classList.add('active');

                // Zobrazení odpovídajícího obsahu
                const tabName = tab.getAttribute('data-tab');
                const tabPanes = authWindow.querySelectorAll('.auth-tab-pane');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                });

                const activePane = authWindow.querySelector(`#${tabName}-tab`);
                if (activePane) {
                    activePane.classList.add('active');
                }
            });
        });
    },

    // Zobrazení okna pro přihlášení/registraci
    showLoginWindow(authWindow) {
        // Nastavení obsahu okna
        authWindow.innerHTML = `
            <div class="auth-window-header">
                <div class="auth-window-title">
                    <i class="icon">🔑</i> Přihlášení / Registrace
                </div>
                <div class="auth-window-controls">
                    <button class="auth-window-close">&times;</button>
                </div>
            </div>
            <div class="auth-window-content">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Přihlášení</button>
                    <button class="auth-tab" data-tab="register">Registrace</button>
                </div>
                <div class="auth-tab-content">
                    <div class="auth-tab-pane active" id="login-tab">
                        <form id="loginForm">
                            <div class="auth-form-group">
                                <label for="loginEmail">E-mail</label>
                                <input type="email" id="loginEmail" name="email" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="loginPassword">Heslo</label>
                                <input type="password" id="loginPassword" name="password" required>
                            </div>
                            <div class="auth-form-actions">
                                <button type="submit" class="auth-submit-button">Přihlásit se</button>
                            </div>
                            <div class="auth-form-message" id="loginMessage"></div>
                        </form>
                    </div>
                    <div class="auth-tab-pane" id="register-tab">
                        <form id="registerForm">
                            <div class="auth-form-group">
                                <label for="registerUsername">Uživatelské jméno</label>
                                <input type="text" id="registerUsername" name="username" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="registerEmail">E-mail</label>
                                <input type="email" id="registerEmail" name="email" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="registerPassword">Heslo</label>
                                <input type="password" id="registerPassword" name="password" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="registerPasswordConfirm">Potvrzení hesla</label>
                                <input type="password" id="registerPasswordConfirm" name="passwordConfirm" required>
                            </div>
                            <div class="auth-form-actions">
                                <button type="submit" class="auth-submit-button">Registrovat se</button>
                            </div>
                            <div class="auth-form-message" id="registerMessage"></div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Přidání event listenerů
        const closeButton = authWindow.querySelector('.auth-window-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideAuthWindow();
            });
        }

        const tabs = authWindow.querySelectorAll('.auth-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech záložek
                tabs.forEach(t => t.classList.remove('active'));

                // Přidání aktivní třídy na kliknutou záložku
                tab.classList.add('active');

                // Zobrazení odpovídajícího obsahu
                const tabName = tab.getAttribute('data-tab');
                const tabPanes = authWindow.querySelectorAll('.auth-tab-pane');
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                });

                const activePane = authWindow.querySelector(`#${tabName}-tab`);
                if (activePane) {
                    activePane.classList.add('active');
                }
            });
        });

        const loginForm = authWindow.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const email = loginForm.querySelector('#loginEmail').value;
                const password = loginForm.querySelector('#loginPassword').value;

                this.login(email, password);
            });
        }

        const registerForm = authWindow.querySelector('#registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (event) => {
                event.preventDefault();

                const username = registerForm.querySelector('#registerUsername').value;
                const email = registerForm.querySelector('#registerEmail').value;
                const password = registerForm.querySelector('#registerPassword').value;
                const passwordConfirm = registerForm.querySelector('#registerPasswordConfirm').value;

                if (password !== passwordConfirm) {
                    this.showMessage('registerMessage', 'Hesla se neshodují', 'error');
                    return;
                }

                this.register(email, password, username);
            });
        }
    },

    // Zobrazení zprávy v okně autentizace
    showMessage(elementId, message, type = 'info') {
        const messageElement = document.getElementById(elementId);
        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.className = 'auth-form-message ' + type;

        // Automatické skrytí zprávy po 5 sekundách
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'auth-form-message';
        }, 5000);
    },

    // Skrytí okna s autentizací
    hideAuthWindow() {
        const authWindow = document.getElementById('supabaseAuthWindow');
        if (authWindow) {
            authWindow.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                authWindow.remove();
            }, 300);
        }

        // Resetování příznaku zobrazení okna
        this.state.authWindowShown = false;
    },

    // Přihlášení uživatele
    async login(email, password) {
        try {
            const result = await SupabaseClient.signIn(email, password);

            if (result.success) {
                this.state.isLoggedIn = true;
                this.state.currentUser = result.user;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Načtení profilu uživatele
                this.loadUserProfile();

                // Skrytí okna s autentizací
                this.hideAuthWindow();

                // Zobrazení notifikace o úspěšném přihlášení
                this.showNotification('Přihlášení bylo úspěšné', 'success');

                console.log('Uživatel byl úspěšně přihlášen:', result.user.email);
            } else {
                this.showMessage('loginMessage', result.error || 'Přihlášení se nezdařilo', 'error');
                console.error('Chyba při přihlašování uživatele:', result.error);
            }
        } catch (error) {
            this.showMessage('loginMessage', error.message || 'Přihlášení se nezdařilo', 'error');
            console.error('Chyba při přihlašování uživatele:', error);
        }
    },

    // Registrace uživatele
    async register(email, password, username) {
        try {
            const result = await SupabaseClient.signUp(email, password, username);

            if (result.success) {
                // Zobrazení zprávy o úspěšné registraci
                this.showMessage('registerMessage', 'Registrace byla úspěšná. Nyní se můžete přihlásit.', 'success');

                // Přepnutí na záložku přihlášení
                const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                if (loginTab) {
                    loginTab.click();
                }

                console.log('Uživatel byl úspěšně zaregistrován:', email);
            } else {
                this.showMessage('registerMessage', result.error || 'Registrace se nezdařila', 'error');
                console.error('Chyba při registraci uživatele:', result.error);
            }
        } catch (error) {
            this.showMessage('registerMessage', error.message || 'Registrace se nezdařila', 'error');
            console.error('Chyba při registraci uživatele:', error);
        }
    },

    // Odhlášení uživatele
    async logout() {
        try {
            const result = await SupabaseClient.signOut();

            if (result.success) {
                this.state.isLoggedIn = false;
                this.state.currentUser = null;

                // Aktualizace tlačítka autentizace
                this.updateAuthButton();

                // Skrytí okna s autentizací
                this.hideAuthWindow();

                // Zobrazení notifikace o úspěšném odhlášení
                this.showNotification('Odhlášení bylo úspěšné', 'info');

                // Resetování dat v UserAccounts
                if (typeof UserAccounts !== 'undefined') {
                    UserAccounts.createDefaultUser();
                    console.log('Data UserAccounts byla resetována po odhlášení');
                }

                console.log('Uživatel byl úspěšně odhlášen');
            } else {
                this.showNotification('Odhlášení se nezdařilo', 'error');
                console.error('Chyba při odhlašování uživatele:', result.error);
            }
        } catch (error) {
            this.showNotification('Odhlášení se nezdařilo', 'error');
            console.error('Chyba při odhlašování uživatele:', error);
        }
    },

    // Synchronizace dat mezi lokálním úložištěm a Supabase
    async synchronizeData() {
        if (!this.state.isLoggedIn || !this.state.currentUser) {
            this.showNotification('Pro synchronizaci dat musíte být přihlášeni', 'error');
            return;
        }

        try {
            // Zobrazení notifikace o zahájení synchronizace
            this.showNotification('Synchronizace dat byla zahájena', 'info');

            // Synchronizace dat z UserAccounts do Supabase
            if (typeof UserAccounts !== 'undefined' && UserAccounts.state.currentUser) {
                const userData = UserAccounts.state.currentUser;

                // Aktualizace profilu uživatele
                await SupabaseClient.updateUserProfile(this.state.currentUser.id, {
                    username: userData.username,
                    email: userData.email,
                    avatar_url: userData.avatar,
                    level: userData.level,
                    xp: userData.xp,
                    xp_to_next_level: userData.xpToNextLevel,
                    balance: userData.balance,
                    currency: userData.currency,
                    updated_at: new Date().toISOString()
                });

                // Aktualizace statistik uživatele
                await SupabaseClient.updateUserStats(this.state.currentUser.id, {
                    total_earnings: userData.stats.totalEarnings,
                    total_tasks: userData.stats.totalTasks,
                    total_work_time: userData.stats.totalWorkTime,
                    total_logins: userData.stats.totalLogins,
                    updated_at: new Date().toISOString()
                });

                // Aktualizace nastavení uživatele
                await SupabaseClient.updateUserSettings(this.state.currentUser.id, {
                    dark_mode: userData.settings.darkMode,
                    notifications_enabled: userData.settings.notifications,
                    language: userData.settings.language,
                    updated_at: new Date().toISOString()
                });

                // Synchronizace achievementů
                if (userData.achievements && userData.achievements.length > 0) {
                    // Získání existujících achievementů
                    const existingAchievements = await SupabaseClient.getUserAchievements(this.state.currentUser.id);

                    if (existingAchievements.success) {
                        // Vytvoření mapy existujících achievementů
                        const existingMap = {};
                        existingAchievements.achievements.forEach(achievement => {
                            existingMap[achievement.achievement_id] = true;
                        });

                        // Přidání nových achievementů
                        for (const achievement of userData.achievements) {
                            if (!existingMap[achievement.id]) {
                                await SupabaseClient.addUserAchievement(
                                    this.state.currentUser.id,
                                    achievement.id,
                                    achievement.name,
                                    achievement.description
                                );
                            }
                        }
                    }
                }

                // Synchronizace virtuální práce
                // Zde by byla implementace synchronizace virtuální práce

                // Synchronizace odměn
                // Zde by byla implementace synchronizace odměn

                // Synchronizace bodů na mapě
                // Zde by byla implementace synchronizace bodů na mapě

                // Synchronizace úkolů
                // Zde by byla implementace synchronizace úkolů
            }

            // Zobrazení notifikace o úspěšné synchronizaci
            this.showNotification('Synchronizace dat byla úspěšně dokončena', 'success');

            console.log('Data byla úspěšně synchronizována');
        } catch (error) {
            this.showNotification('Synchronizace dat se nezdařila', 'error');
            console.error('Chyba při synchronizaci dat:', error);
        }
    },

    // Zobrazení notifikace
    showNotification(message, type = 'info') {
        // Kontrola, zda existuje funkce pro zobrazení notifikace
        if (typeof addMessage === 'function') {
            addMessage(message, type === 'error');
        } else {
            // Vytvoření vlastní notifikace
            const notification = document.createElement('div');
            notification.className = 'supabase-notification ' + type;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Zobrazení notifikace
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            // Automatické skrytí notifikace po 3 sekundách
            setTimeout(() => {
                notification.classList.remove('show');

                // Odstranění notifikace po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Kontrola, zda je dostupný SupabaseClient
    if (typeof SupabaseClient !== 'undefined') {
        // Inicializace modulu
        SupabaseAuth.init();
    } else {
        console.error('SupabaseClient není dostupný. Ujistěte se, že je načten skript supabase-client.js.');

        // Pokus o načtení SupabaseClient
        const script = document.createElement('script');
        script.src = 'app/supabase-client.js';
        script.onload = function() {
            console.log('SupabaseClient byl úspěšně načten');
            SupabaseAuth.init();
        };
        script.onerror = function() {
            console.error('Chyba při načítání SupabaseClient');
        };
        document.head.appendChild(script);
    }
});
