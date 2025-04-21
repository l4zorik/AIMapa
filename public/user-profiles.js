/**
 * Systém uživatelských profilů pro AIMapa verze 0.2.9.1
 * Implementace uživatelských účtů, levelů a statistik
 */

// Objekt pro správu uživatelských profilů
const UserProfiles = {
    // Aktuální uživatel
    currentUser: null,

    // Definice levelů
    levels: [
        { level: 1, xpRequired: 0, title: 'Začátečník' },
        { level: 2, xpRequired: 50, title: 'Průzkumník' },
        { level: 3, xpRequired: 150, title: 'Cestovatel' },
        { level: 4, xpRequired: 300, title: 'Dobrodruh' },
        { level: 5, xpRequired: 500, title: 'Kartograf' },
        { level: 6, xpRequired: 750, title: 'Navigace' },
        { level: 7, xpRequired: 1000, title: 'Mistr map' },
        { level: 8, xpRequired: 1500, title: 'Světoběžník' },
        { level: 9, xpRequired: 2000, title: 'Legenda' },
        { level: 10, xpRequired: 3000, title: 'Kartografický génius' }
    ],

    // Inicializace uživatelských profilů
    init() {
        console.log('Inicializace systému uživatelských profilů...');

        // Načtení uživatele
        this.loadUser();

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        console.log('Systém uživatelských profilů byl inicializován');
    },

    // Načtení uživatele
    loadUser() {
        const savedUser = localStorage.getItem('aiMapaUser');

        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            console.log('Uživatel načten:', this.currentUser.username);
        } else {
            // Vytvoření výchozího uživatele
            this.createDefaultUser();
        }

        // Aktualizace UI
        this.updateUserUI();
    },

    // Vytvoření výchozího uživatele
    createDefaultUser() {
        this.currentUser = {
            username: 'Uživatel',
            email: '',
            experience: 0,
            level: 1,
            achievements: [],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            settings: {
                theme: 'dark',
                mapStyle: 'standard',
                notifications: true
            },
            statistics: {
                pointsAdded: 0,
                routesCreated: 0,
                distancePlanned: 0,
                sessionsCount: 1
            }
        };

        // Uložení uživatele
        this.saveUser();
        console.log('Vytvořen výchozí uživatel');
    },

    // Uložení uživatele
    saveUser() {
        if (this.currentUser) {
            localStorage.setItem('aiMapaUser', JSON.stringify(this.currentUser));
        }
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Posluchač pro přidání bodu
        document.addEventListener('pointAdded', () => {
            if (this.currentUser) {
                this.currentUser.statistics.pointsAdded++;
                this.saveUser();
            }
        });

        // Posluchač pro vytvoření trasy
        document.addEventListener('routeCreated', (e) => {
            if (this.currentUser && e.detail && e.detail.distance) {
                this.currentUser.statistics.routesCreated++;
                this.currentUser.statistics.distancePlanned += e.detail.distance;
                this.saveUser();
            }
        });

        // Posluchač pro změnu nastavení
        document.addEventListener('settingsChanged', (e) => {
            if (this.currentUser && e.detail) {
                this.currentUser.settings = { ...this.currentUser.settings, ...e.detail };
                this.saveUser();

                // Aktualizace UI
                this.updateUserUI();
            }
        });
    },

    // Aktualizace uživatelského rozhraní
    updateUserUI() {
        // Aktualizace jména uživatele
        const usernameElements = document.querySelectorAll('.user-username');
        usernameElements.forEach(element => {
            element.textContent = this.currentUser.username;
        });

        // Aktualizace levelu
        const levelElements = document.querySelectorAll('.user-level');
        levelElements.forEach(element => {
            element.textContent = `Úroveň ${this.currentUser.level}`;
        });

        // Aktualizace titulu
        const titleElements = document.querySelectorAll('.user-title');
        const levelInfo = this.getLevelInfo(this.currentUser.level);
        titleElements.forEach(element => {
            element.textContent = levelInfo.title;
        });

        // Aktualizace progress baru
        this.updateProgressBar();
    },

    // Aktualizace progress baru
    updateProgressBar() {
        const progressBarElements = document.querySelectorAll('.xp-progress-bar');
        const progressTextElements = document.querySelectorAll('.xp-progress-text');

        const currentLevel = this.getLevelInfo(this.currentUser.level);
        const nextLevel = this.getLevelInfo(this.currentUser.level + 1);

        if (currentLevel && nextLevel) {
            const currentXP = this.currentUser.experience;
            const requiredXP = nextLevel.xpRequired - currentLevel.xpRequired;
            const earnedXP = currentXP - currentLevel.xpRequired;
            const progressPercentage = Math.min(100, Math.floor((earnedXP / requiredXP) * 100));

            progressBarElements.forEach(element => {
                element.style.width = `${progressPercentage}%`;
            });

            progressTextElements.forEach(element => {
                element.textContent = `${earnedXP}/${requiredXP} XP`;
            });
        }
    },

    // Přidání zkušeností uživateli
    addExperience(xp) {
        if (!this.currentUser) return;

        // Přidání XP
        this.currentUser.experience += xp;

        // Kontrola, zda uživatel dosáhl nového levelu
        const newLevel = this.calculateLevel(this.currentUser.experience);
        const leveledUp = newLevel > this.currentUser.level;

        if (leveledUp) {
            // Aktualizace levelu
            const oldLevel = this.currentUser.level;
            this.currentUser.level = newLevel;

            // Zobrazení oznámení o novém levelu
            this.showLevelUpNotification(oldLevel, newLevel);
        }

        // Uložení uživatele
        this.saveUser();

        // Aktualizace UI
        this.updateUserUI();

        return leveledUp;
    },

    // Přidání achievementu uživateli
    addAchievement(achievement) {
        if (!this.currentUser) return;

        // Kontrola, zda uživatel již nemá tento achievement
        const existingAchievement = this.currentUser.achievements.find(a => a.id === achievement.id);

        if (!existingAchievement) {
            // Přidání achievementu
            this.currentUser.achievements.push(achievement);

            // Uložení uživatele
            this.saveUser();

            return true;
        }

        return false;
    },

    // Výpočet levelu na základě XP
    calculateLevel(xp) {
        let level = 1;

        for (let i = 1; i < this.levels.length; i++) {
            if (xp >= this.levels[i].xpRequired) {
                level = this.levels[i].level;
            } else {
                break;
            }
        }

        return level;
    },

    // Získání informací o levelu
    getLevelInfo(level) {
        return this.levels.find(l => l.level === level) || null;
    },

    // Zobrazení oznámení o novém levelu
    showLevelUpNotification(oldLevel, newLevel) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';

        const newLevelInfo = this.getLevelInfo(newLevel);

        notification.innerHTML = `
            <div class="level-up-icon">🌟</div>
            <div class="level-up-info">
                <div class="level-up-title">Nová úroveň!</div>
                <div class="level-up-description">Dosáhli jste úrovně ${newLevel}: ${newLevelInfo.title}</div>
            </div>
        `;

        // Přidání oznámení do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Automatické skrytí po 5 sekundách
        setTimeout(() => {
            notification.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    },

    // Aktualizace uživatelského jména
    updateUsername(username) {
        if (!this.currentUser) return false;

        this.currentUser.username = username;
        this.saveUser();
        this.updateUserUI();

        return true;
    },

    // Aktualizace e-mailu
    updateEmail(email) {
        if (!this.currentUser) return false;

        this.currentUser.email = email;
        this.saveUser();

        return true;
    },

    // Aktualizace nastavení
    updateSettings(settings) {
        if (!this.currentUser) return false;

        this.currentUser.settings = { ...this.currentUser.settings, ...settings };
        this.saveUser();

        // Aktualizace UI
        this.updateUserUI();

        return true;
    },

    // Získání statistik uživatele
    getStatistics() {
        return this.currentUser ? this.currentUser.statistics : null;
    },

    // Získání achievementů uživatele
    getAchievements() {
        return this.currentUser ? this.currentUser.achievements : [];
    }
};

// Export objektu pro použití v jiných souborech
window.UserProfiles = UserProfiles;