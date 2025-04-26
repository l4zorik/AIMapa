/**
 * Modul pro správu uživatelských účtů ve stylu PocketOption.com
 * Verze 0.3.8.0
 */

const UserAccounts = {
    // Konfigurace
    config: {
        defaultAvatar: 'https://via.placeholder.com/150',
        defaultBalance: 500,
        defaultCurrency: 'CZK',
        achievementXP: 10,
        loginBonusXP: 5,
        dailyBonusXP: 15
    },

    // Stav modulu
    state: {
        isLoggedIn: false,
        currentUser: null,
        accountWindowShown: false,
        lastLoginDate: null,
        loginStreak: 0
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu uživatelských účtů...');

        // Načtení uživatelských dat z localStorage
        this.loadUserData();

        // Přidání tlačítka pro zobrazení účtu
        this.addAccountButton();

        // Kontrola denního přihlášení
        this.checkDailyLogin();

        console.log('Modul uživatelských účtů byl inicializován');
    },

    // Načtení uživatelských dat z localStorage
    loadUserData() {
        try {
            const userData = localStorage.getItem('aiMapaUserAccount');
            if (userData) {
                this.state.currentUser = JSON.parse(userData);
                this.state.isLoggedIn = true;
                this.state.lastLoginDate = localStorage.getItem('aiMapaLastLogin') || null;
                this.state.loginStreak = parseInt(localStorage.getItem('aiMapaLoginStreak') || '0');
                console.log('Uživatelská data byla načtena:', this.state.currentUser.username);
            } else {
                // Vytvoření výchozího uživatele, pokud neexistuje
                this.createDefaultUser();
            }
        } catch (error) {
            console.error('Chyba při načítání uživatelských dat:', error);
            // Vytvoření výchozího uživatele v případě chyby
            this.createDefaultUser();
        }
    },

    // Vytvoření výchozího uživatele
    createDefaultUser() {
        const defaultUser = {
            id: 'user_' + Date.now(),
            username: 'Uživatel',
            email: '',
            avatar: this.config.defaultAvatar,
            balance: this.config.defaultBalance,
            currency: this.config.defaultCurrency,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            registrationDate: new Date().toISOString(),
            lastActivity: new Date().toISOString(),
            achievements: [],
            stats: {
                totalEarnings: 0,
                totalTasks: 0,
                totalWorkTime: 0,
                totalLogins: 1
            },
            settings: {
                notifications: true,
                darkMode: true,
                language: 'cs'
            }
        };

        this.state.currentUser = defaultUser;
        this.state.isLoggedIn = true;
        this.saveUserData();
        console.log('Vytvořen výchozí uživatel');
    },

    // Uložení uživatelských dat do localStorage
    saveUserData() {
        try {
            localStorage.setItem('aiMapaUserAccount', JSON.stringify(this.state.currentUser));
            localStorage.setItem('aiMapaLastLogin', this.state.lastLoginDate);
            localStorage.setItem('aiMapaLoginStreak', this.state.loginStreak.toString());
            console.log('Uživatelská data byla uložena');
        } catch (error) {
            console.error('Chyba při ukládání uživatelských dat:', error);
        }
    },

    // Přidání tlačítka pro zobrazení účtu
    addAccountButton() {
        // Kontrola, zda již tlačítko existuje
        let accountButton = document.getElementById('accountButton');

        // Pokud tlačítko neexistuje, vytvoříme ho
        if (!accountButton) {
            accountButton = document.createElement('button');
            accountButton.id = 'accountButton';
            accountButton.className = 'account-button';
            accountButton.innerHTML = '<span class="account-button-icon">👤</span>';
            document.body.appendChild(accountButton);

            // Přidání event listeneru
            accountButton.addEventListener('click', () => {
                this.toggleAccountWindow();
            });
        }
    },

    // Zobrazení/skrytí okna s účtem
    toggleAccountWindow() {
        if (this.state.accountWindowShown) {
            this.hideAccountWindow();
        } else {
            this.showAccountWindow();
        }
    },

    // Zobrazení okna s účtem
    showAccountWindow() {
        // Kontrola, zda již okno existuje
        if (document.getElementById('accountWindow')) {
            return;
        }

        // Nastavení příznaku zobrazení okna
        this.state.accountWindowShown = true;

        // Vytvoření elementu pro okno
        const accountWindow = document.createElement('div');
        accountWindow.id = 'accountWindow';
        accountWindow.className = 'account-window';

        // Výpočet XP procent
        const xpPercent = this.state.currentUser.xp / this.state.currentUser.xpToNextLevel * 100;

        // Nastavení obsahu okna
        accountWindow.innerHTML = `
            <div class="account-window-header">
                <div class="account-window-title">
                    <i class="icon">👤</i> Váš účet
                </div>
                <div class="account-window-controls">
                    <button class="account-window-close">&times;</button>
                </div>
            </div>
            <div class="account-window-content">
                <div class="account-profile">
                    <div class="account-avatar">
                        <img src="${this.state.currentUser.avatar}" alt="Avatar">
                        <div class="account-level">${this.state.currentUser.level}</div>
                    </div>
                    <div class="account-info">
                        <div class="account-username">${this.state.currentUser.username}</div>
                        <div class="account-xp-bar">
                            <div class="account-xp-fill" style="width: ${xpPercent}%"></div>
                            <div class="account-xp-text">${this.state.currentUser.xp} / ${this.state.currentUser.xpToNextLevel} XP</div>
                        </div>
                        <div class="account-balance">${this.state.currentUser.balance} ${this.state.currentUser.currency}</div>
                    </div>
                </div>
                
                <div class="account-tabs">
                    <button class="account-tab active" data-tab="stats">Statistiky</button>
                    <button class="account-tab" data-tab="achievements">Achievementy</button>
                    <button class="account-tab" data-tab="settings">Nastavení</button>
                </div>
                
                <div class="account-tab-content active" data-tab-content="stats">
                    <div class="account-stats">
                        <div class="account-stat-item">
                            <div class="account-stat-icon">💰</div>
                            <div class="account-stat-info">
                                <div class="account-stat-value">${this.state.currentUser.stats.totalEarnings} ${this.state.currentUser.currency}</div>
                                <div class="account-stat-label">Celkový výdělek</div>
                            </div>
                        </div>
                        <div class="account-stat-item">
                            <div class="account-stat-icon">📋</div>
                            <div class="account-stat-info">
                                <div class="account-stat-value">${this.state.currentUser.stats.totalTasks}</div>
                                <div class="account-stat-label">Dokončené úkoly</div>
                            </div>
                        </div>
                        <div class="account-stat-item">
                            <div class="account-stat-icon">⏱️</div>
                            <div class="account-stat-info">
                                <div class="account-stat-value">${this.formatTime(this.state.currentUser.stats.totalWorkTime)}</div>
                                <div class="account-stat-label">Celkový čas práce</div>
                            </div>
                        </div>
                        <div class="account-stat-item">
                            <div class="account-stat-icon">🔄</div>
                            <div class="account-stat-info">
                                <div class="account-stat-value">${this.state.currentUser.stats.totalLogins}</div>
                                <div class="account-stat-label">Počet přihlášení</div>
                            </div>
                        </div>
                        <div class="account-stat-item">
                            <div class="account-stat-icon">🔥</div>
                            <div class="account-stat-info">
                                <div class="account-stat-value">${this.state.loginStreak}</div>
                                <div class="account-stat-label">Přihlašovací streak</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="account-activity">
                        <h3>Poslední aktivita</h3>
                        <div class="account-activity-date">
                            ${this.formatDate(this.state.currentUser.lastActivity)}
                        </div>
                    </div>
                </div>
                
                <div class="account-tab-content" data-tab-content="achievements">
                    <div class="account-achievements">
                        ${this.renderAchievements()}
                    </div>
                </div>
                
                <div class="account-tab-content" data-tab-content="settings">
                    <div class="account-settings">
                        <div class="account-setting-item">
                            <label for="account-username">Uživatelské jméno</label>
                            <input type="text" id="account-username" value="${this.state.currentUser.username}">
                        </div>
                        <div class="account-setting-item">
                            <label for="account-email">E-mail</label>
                            <input type="email" id="account-email" value="${this.state.currentUser.email}">
                        </div>
                        <div class="account-setting-item">
                            <label for="account-avatar">Avatar URL</label>
                            <input type="text" id="account-avatar" value="${this.state.currentUser.avatar}">
                        </div>
                        <div class="account-setting-item">
                            <label for="account-notifications">Notifikace</label>
                            <div class="account-toggle">
                                <input type="checkbox" id="account-notifications" ${this.state.currentUser.settings.notifications ? 'checked' : ''}>
                                <label for="account-notifications" class="account-toggle-label"></label>
                            </div>
                        </div>
                        <div class="account-setting-item">
                            <label for="account-language">Jazyk</label>
                            <select id="account-language">
                                <option value="cs" ${this.state.currentUser.settings.language === 'cs' ? 'selected' : ''}>Čeština</option>
                                <option value="en" ${this.state.currentUser.settings.language === 'en' ? 'selected' : ''}>English</option>
                            </select>
                        </div>
                        <div class="account-setting-actions">
                            <button id="account-save-settings" class="account-save-button">Uložit nastavení</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Přidání okna do dokumentu
        document.body.appendChild(accountWindow);

        // Animace zobrazení
        setTimeout(() => {
            accountWindow.classList.add('show');
        }, 100);

        // Přidání event listenerů
        this.addAccountWindowEventListeners(accountWindow);

        // Přidání možnosti přesouvání okna
        this.makeWindowDraggable(accountWindow);
    },

    // Přidání event listenerů pro okno s účtem
    addAccountWindowEventListeners(accountWindow) {
        // Event listener pro zavření okna
        const closeButton = accountWindow.querySelector('.account-window-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideAccountWindow();
            });
        }

        // Event listenery pro záložky
        const tabs = accountWindow.querySelectorAll('.account-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech záložek
                tabs.forEach(t => t.classList.remove('active'));
                
                // Přidání aktivní třídy na kliknutou záložku
                tab.classList.add('active');
                
                // Zobrazení odpovídajícího obsahu
                const tabName = tab.getAttribute('data-tab');
                const tabContents = accountWindow.querySelectorAll('.account-tab-content');
                
                tabContents.forEach(content => {
                    if (content.getAttribute('data-tab-content') === tabName) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });

        // Event listener pro uložení nastavení
        const saveButton = accountWindow.querySelector('#account-save-settings');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveSettings(accountWindow);
            });
        }
    },

    // Uložení nastavení
    saveSettings(accountWindow) {
        // Získání hodnot z formuláře
        const username = accountWindow.querySelector('#account-username').value;
        const email = accountWindow.querySelector('#account-email').value;
        const avatar = accountWindow.querySelector('#account-avatar').value;
        const notifications = accountWindow.querySelector('#account-notifications').checked;
        const language = accountWindow.querySelector('#account-language').value;

        // Aktualizace uživatelských dat
        this.state.currentUser.username = username;
        this.state.currentUser.email = email;
        this.state.currentUser.avatar = avatar || this.config.defaultAvatar;
        this.state.currentUser.settings.notifications = notifications;
        this.state.currentUser.settings.language = language;

        // Uložení dat
        this.saveUserData();

        // Zobrazení potvrzení
        this.showNotification('Nastavení bylo uloženo', 'success');

        // Aktualizace zobrazení
        this.hideAccountWindow();
        setTimeout(() => {
            this.showAccountWindow();
        }, 300);
    },

    // Skrytí okna s účtem
    hideAccountWindow() {
        const accountWindow = document.getElementById('accountWindow');
        if (accountWindow) {
            accountWindow.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                accountWindow.remove();
            }, 300);
        }

        // Resetování příznaku zobrazení okna
        this.state.accountWindowShown = false;
    },

    // Přidání možnosti přesouvání okna
    makeWindowDraggable(element) {
        const header = element.querySelector('.account-window-header');
        if (!header) return;

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Získání počáteční pozice kurzoru
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            
            // Výpočet nové pozice
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            // Nastavení nové pozice elementu
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // Zastavení přesouvání
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },

    // Kontrola denního přihlášení
    checkDailyLogin() {
        const today = new Date().toDateString();
        
        if (this.state.lastLoginDate !== today) {
            // Aktualizace data posledního přihlášení
            this.state.lastLoginDate = today;
            
            // Zvýšení počtu přihlášení
            this.state.currentUser.stats.totalLogins++;
            
            // Kontrola přihlašovacího streaku
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();
            
            if (this.state.lastLoginDate === yesterdayString) {
                // Pokračování streaku
                this.state.loginStreak++;
                
                // Přidání XP za pokračování streaku
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addExperience(this.config.loginBonusXP * this.state.loginStreak, 'Přihlašovací streak', 'login');
                }
                
                // Zobrazení oznámení o streaku
                this.showNotification(`Přihlašovací streak: ${this.state.loginStreak} dní! +${this.config.loginBonusXP * this.state.loginStreak} XP`, 'success');
            } else {
                // Resetování streaku
                this.state.loginStreak = 1;
                
                // Přidání XP za přihlášení
                if (typeof UserProgress !== 'undefined') {
                    UserProgress.addExperience(this.config.loginBonusXP, 'Denní přihlášení', 'login');
                }
                
                // Zobrazení oznámení o přihlášení
                this.showNotification(`Vítejte zpět! +${this.config.loginBonusXP} XP za denní přihlášení`, 'info');
            }
            
            // Uložení dat
            this.saveUserData();
        }
    },

    // Přidání XP uživateli
    addExperience(amount, reason) {
        if (!this.state.currentUser) return;
        
        // Přidání XP
        this.state.currentUser.xp += amount;
        
        // Kontrola, zda uživatel dosáhl nové úrovně
        if (this.state.currentUser.xp >= this.state.currentUser.xpToNextLevel) {
            this.levelUp();
        }
        
        // Uložení dat
        this.saveUserData();
        
        // Zobrazení oznámení
        this.showNotification(`+${amount} XP: ${reason}`, 'success');
    },

    // Zvýšení úrovně uživatele
    levelUp() {
        // Zvýšení úrovně
        this.state.currentUser.level++;
        
        // Výpočet XP pro další úroveň (exponenciální růst)
        const xpOverflow = this.state.currentUser.xp - this.state.currentUser.xpToNextLevel;
        this.state.currentUser.xpToNextLevel = Math.floor(this.state.currentUser.xpToNextLevel * 1.5);
        this.state.currentUser.xp = xpOverflow;
        
        // Zobrazení oznámení o nové úrovni
        this.showNotification(`Gratulujeme! Dosáhli jste úrovně ${this.state.currentUser.level}`, 'success');
        
        // Přidání achievementu za dosažení úrovně
        if (this.state.currentUser.level === 5) {
            this.addAchievement('level-5', 'Pokročilý', 'Dosáhli jste úrovně 5');
        } else if (this.state.currentUser.level === 10) {
            this.addAchievement('level-10', 'Expert', 'Dosáhli jste úrovně 10');
        } else if (this.state.currentUser.level === 25) {
            this.addAchievement('level-25', 'Mistr', 'Dosáhli jste úrovně 25');
        } else if (this.state.currentUser.level === 50) {
            this.addAchievement('level-50', 'Legenda', 'Dosáhli jste úrovně 50');
        }
    },

    // Přidání peněz uživateli
    addMoney(amount, reason) {
        if (!this.state.currentUser) return;
        
        // Přidání peněz
        this.state.currentUser.balance += amount;
        
        // Aktualizace statistik
        this.state.currentUser.stats.totalEarnings += amount;
        
        // Uložení dat
        this.saveUserData();
        
        // Zobrazení oznámení
        this.showNotification(`+${amount} ${this.state.currentUser.currency}: ${reason}`, 'success');
    },

    // Přidání achievementu
    addAchievement(id, name, description) {
        if (!this.state.currentUser) return;
        
        // Kontrola, zda uživatel již má tento achievement
        if (this.state.currentUser.achievements.some(a => a.id === id)) {
            return;
        }
        
        // Přidání achievementu
        this.state.currentUser.achievements.push({
            id,
            name,
            description,
            date: new Date().toISOString()
        });
        
        // Přidání XP za achievement
        this.addExperience(this.config.achievementXP, `Achievement: ${name}`);
        
        // Uložení dat
        this.saveUserData();
        
        // Zobrazení oznámení
        this.showNotification(`Nový achievement: ${name}`, 'achievement');
    },

    // Vykreslení achievementů
    renderAchievements() {
        if (!this.state.currentUser || !this.state.currentUser.achievements.length) {
            return '<div class="account-no-achievements">Zatím nemáte žádné achievementy</div>';
        }
        
        return this.state.currentUser.achievements.map(achievement => `
            <div class="account-achievement">
                <div class="account-achievement-icon">🏆</div>
                <div class="account-achievement-info">
                    <div class="account-achievement-name">${achievement.name}</div>
                    <div class="account-achievement-description">${achievement.description}</div>
                    <div class="account-achievement-date">${this.formatDate(achievement.date)}</div>
                </div>
            </div>
        `).join('');
    },

    // Zobrazení oznámení
    showNotification(message, type = 'info') {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = `account-notification account-notification-${type}`;
        
        // Nastavení ikony podle typu
        let icon = '💬';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'warning') icon = '⚠️';
        if (type === 'achievement') icon = '🏆';
        
        // Nastavení obsahu oznámení
        notification.innerHTML = `
            <div class="account-notification-icon">${icon}</div>
            <div class="account-notification-message">${message}</div>
            <button class="account-notification-close">&times;</button>
        `;
        
        // Přidání oznámení do dokumentu
        document.body.appendChild(notification);
        
        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Přidání event listeneru pro zavření
        const closeButton = notification.querySelector('.account-notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('show');
                
                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Automatické zavření po 5 sekundách
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                
                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    },

    // Formátování data
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Formátování času
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        if (hours === 0) {
            return `${mins} min`;
        } else {
            return `${hours} h ${mins} min`;
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    if (typeof UserAccounts !== 'undefined') {
        console.log('Inicializace UserAccounts...');
        UserAccounts.init();
    } else {
        console.error('UserAccounts modul nebyl nalezen!');
    }
});
