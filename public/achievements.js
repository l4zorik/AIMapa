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
            icon: '🎥',
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
            xp: 5,
            unlocked: false
        }
    ],

    // Inicializace achievementů
    init() {
        console.log('Inicializace systému achievementů...');

        // Načtení uložených achievementů
        this.loadAchievements();

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        console.log('Systém achievementů byl inicializován');
    },

    // Načtení uložených achievementů
    loadAchievements() {
        const savedAchievements = localStorage.getItem('aiMapaAchievements');

        if (savedAchievements) {
            const parsedAchievements = JSON.parse(savedAchievements);

            // Aktualizace stavu achievementů
            this.achievementsList.forEach(achievement => {
                const savedAchievement = parsedAchievements.find(a => a.id === achievement.id);
                if (savedAchievement) {
                    achievement.unlocked = savedAchievement.unlocked;
                }
            });
        }
    },

    // Uložení achievementů
    saveAchievements() {
        localStorage.setItem('aiMapaAchievements', JSON.stringify(this.achievementsList));
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

        // Uložit achievementy
        this.saveAchievements();

        return true;
    },

    // Zobrazení oznámení o novém achievementu
    showAchievementNotification(achievement) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';

        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
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

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    },

    // Získání seznamu odemčených achievementů
    getUnlockedAchievements() {
        return this.achievementsList.filter(a => a.unlocked);
    },

    // Získání seznamu zamčených achievementů
    getLockedAchievements() {
        return this.achievementsList.filter(a => !a.unlocked);
    },

    // Získání celkového počtu XP
    getTotalXP() {
        return this.getUnlockedAchievements().reduce((total, a) => total + a.xp, 0);
    }
};

// Export objektu pro použití v jiných souborech
window.Achievements = Achievements;