/**
 * Systém úspěchů a achievementů pro AIMapa verze 0.2.9.1
 * Implementace achievementů, levelů a odměn
 */

// Objekt pro správu achievementů
const Achievements = {
    // Seznam všech dostupných achievementů
    achievementsList: [
        {
            id: 'first_point',
            name: 'První bod na mapě',
            description: 'Přidali jste svůj první bod na mapu',
            icon: '🎯',
            xp: 10,
            unlocked: false
        },
        {
            id: 'five_points',
            name: 'Průzkumník',
            description: 'Přidali jste 5 bodů na mapu',
            icon: '🧭',
            xp: 25,
            unlocked: false
        },
        {
            id: 'first_route',
            name: 'Cestovatel',
            description: 'Vytvořili jste svou první trasu',
            icon: '🛣️',
            xp: 15,
            unlocked: false
        },
        {
            id: 'fullscreen_mode',
            name: 'Celá obrazovka',
            description: 'Vyzkoušeli jste režim celé obrazovky',
            icon: '🖥️',
            xp: 5,
            unlocked: false
        },
        {
            id: 'globe_mode',
            name: 'Světoběžník',
            description: 'Vyzkoušeli jste glóbus režim',
            icon: '🌎',
            xp: 20,
            unlocked: false
        },
        {
            id: 'dentist_appointment',
            name: 'Zdravý úsměv',
            description: 'Naplánovali jste návštěvu zubaře',
            icon: '🦷',
            xp: 15,
            unlocked: false
        },
        {
            id: 'job_office_visit',
            name: 'Pracovní příležitost',
            description: 'Naplánovali jste návštěvu úřadu práce',
            icon: '📋',
            xp: 15,
            unlocked: false
        },
        {
            id: 'shopping_list',
            name: 'Nákupčí',
            description: 'Vytvořili jste svůj první nákupní seznam',
            icon: '🛒',
            xp: 10,
            unlocked: false
        },
        {
            id: 'night_explorer',
            name: 'Noční průzkumník',
            description: 'Použili jste aplikaci po 22:00',
            icon: '🌙',
            xp: 10,
            unlocked: false
        },
        {
            id: 'early_bird',
            name: 'Ranní ptáče',
            description: 'Použili jste aplikaci před 6:00',
            icon: '🐦',
            xp: 15,
            unlocked: false
        }
    ],
    
    // Úrovně uživatele
    levels: [
        { level: 1, xpRequired: 0, reward: 'Základní uživatel' },
        { level: 2, xpRequired: 30, reward: 'Možnost změny barvy bodů' },
        { level: 3, xpRequired: 60, reward: 'Odemčení speciálních efektů' },
        { level: 4, xpRequired: 100, reward: 'Nové styly bodů' },
        { level: 5, xpRequired: 150, reward: 'Vlastní pozadí mapy' },
        { level: 6, xpRequired: 210, reward: 'Pokročilé animace' },
        { level: 7, xpRequired: 280, reward: 'VIP status' },
        { level: 8, xpRequired: 360, reward: 'Prémiové funkce' },
        { level: 9, xpRequired: 450, reward: 'Experimentální funkce' },
        { level: 10, xpRequired: 550, reward: 'Mistrovský status' }
    ],
    
    // Inicializace systému achievementů
    init() {
        this.checkTimeBasedAchievements();
        this.setupEventListeners();
    },
    
    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Posluchač pro přidání bodu
        document.addEventListener('pointAdded', (e) => {
            const pointsCount = e.detail.count;
            
            if (pointsCount === 1) {
                this.unlockAchievement('first_point');
            } else if (pointsCount === 5) {
                this.unlockAchievement('five_points');
            }
        });
        
        // Posluchač pro vytvoření trasy
        document.addEventListener('routeCreated', () => {
            this.unlockAchievement('first_route');
        });
        
        // Posluchač pro fullscreen režim
        document.addEventListener('fullscreenToggled', (e) => {
            if (e.detail.isFullscreen) {
                this.unlockAchievement('fullscreen_mode');
            }
        });
        
        // Posluchač pro glóbus režim
        document.addEventListener('globeModeToggled', (e) => {
            if (e.detail.isGlobeMode) {
                this.unlockAchievement('globe_mode');
            }
        });
    },
    
    // Kontrola achievementů založených na čase
    checkTimeBasedAchievements() {
        const currentHour = new Date().getHours();
        
        if (currentHour >= 22 || currentHour < 4) {
            this.unlockAchievement('night_explorer');
        }
        
        if (currentHour >= 4 && currentHour < 6) {
            this.unlockAchievement('early_bird');
        }
    },
    
    // Odemknutí achievementu
    unlockAchievement(achievementId) {
        // Najít achievement podle ID
        const achievement = this.achievementsList.find(a => a.id === achievementId);
        
        if (!achievement || achievement.unlocked) {
            return false;
        }
        
        // Označit achievement jako odemčený
        achievement.unlocked = true;
        
        // Přidat XP uživateli
        if (typeof UserProfiles !== 'undefined') {
            UserProfiles.addExperience(achievement.xp);
            
            // Přidat achievement do profilu uživatele
            UserProfiles.addAchievement({
                id: achievement.id,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                dateUnlocked: new Date().toISOString()
            });
        }
        
        // Zobrazit oznámení o novém achievementu
        this.showAchievementNotification(achievement);
        
        return true;
    },
    
    // Zobrazení oznámení o novém achievementu
    showAchievementNotification(achievement) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h3>Nový úspěch odemčen!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <div class="achievement-xp">+${achievement.xp} XP</div>
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
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    },
    
    // Získání aktuální úrovně uživatele
    getUserLevel(xp) {
        let userLevel = 1;
        
        for (let i = 1; i < this.levels.length; i++) {
            if (xp >= this.levels[i].xpRequired) {
                userLevel = this.levels[i].level;
            } else {
                break;
            }
        }
        
        return userLevel;
    },
    
    // Získání informací o další úrovni
    getNextLevelInfo(xp) {
        const currentLevel = this.getUserLevel(xp);
        const nextLevelIndex = currentLevel;
        
        if (nextLevelIndex >= this.levels.length) {
            return null; // Uživatel je na maximální úrovni
        }
        
        const nextLevel = this.levels[nextLevelIndex];
        const currentLevelXP = this.levels[nextLevelIndex - 1].xpRequired;
        const xpForNextLevel = nextLevel.xpRequired - currentLevelXP;
        const xpProgress = xp - currentLevelXP;
        const progressPercentage = Math.min(100, Math.floor((xpProgress / xpForNextLevel) * 100));
        
        return {
            currentLevel,
            nextLevel: nextLevel.level,
            xpForNextLevel,
            xpProgress,
            progressPercentage,
            reward: nextLevel.reward
        };
    },
    
    // Zobrazení oznámení o nové úrovni
    showLevelUpNotification(oldLevel, newLevel, reward) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-icon">🏆</div>
            <div class="level-up-content">
                <h3>Nová úroveň dosažena!</h3>
                <h4>Úroveň ${newLevel}</h4>
                <p>Odemčeno: ${reward}</p>
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
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    },
    
    // Získání všech odemčených achievementů
    getUnlockedAchievements() {
        return this.achievementsList.filter(a => a.unlocked);
    },
    
    // Získání všech zamčených achievementů
    getLockedAchievements() {
        return this.achievementsList.filter(a => !a.unlocked);
    },
    
    // Získání celkového počtu XP z odemčených achievementů
    getTotalXP() {
        return this.getUnlockedAchievements().reduce((total, a) => total + a.xp, 0);
    }
};

// Inicializace systému achievementů po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    Achievements.init();
});

// Export objektu pro použití v jiných souborech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Achievements;
}
