/**
 * Modul pro sledování postupu uživatele, XP a achievementů
 * Verze 0.2.8.6.6
 */

const UserProgress = {
    // Aktuální úroveň uživatele
    level: 0,

    // Aktuální počet XP
    experience: 0,

    // XP potřebné pro další úroveň
    nextLevelXP: 100,

    // Získané achievementy
    achievements: {},

    // Statistiky uživatele
    stats: {
        routesCalculated: 0,
        placesVisited: 0,
        storiesRead: 0,
        restaurantsVisited: 0,
        distanceTraveled: 0,
        daysActive: 0,
        lastActiveDate: null
    },

    // Denní bonusy
    dailyBonus: {
        lastClaimDate: null,
        streak: 0,
        claimed: false
    },

    // Historie získaných XP
    xpHistory: [],

    // Statistiky XP podle kategorií
    xpStats: {
        total: 0,
        byCategory: {
            daily: 0,      // Denní bonusy
            routes: 0,     // Výpočet tras
            places: 0,     // Navštívení míst
            achievements: 0, // Achievementy
            purchases: 0,  // Nákupy
            decisions: 0,  // Rozhodnutí v chatu
            map: 0,        // Interakce s mapou
            jobs: 0,       // Hledání práce
            transport: 0,  // Vyhledávání spojení
            work: 0,       // Práce a úkoly
            assistants: 0, // Asistenti a služby
            entertainment: 0, // Zábava
            other: 0       // Ostatní
        },
        byTimeframe: {
            today: 0,
            thisWeek: 0,
            thisMonth: 0,
            allTime: 0
        }
    },

    // Definice achievementů
    achievementDefinitions: {
        // Navigátor - za výpočet tras
        'navigator-bronze': { title: 'Navigátor (bronz)', description: 'Vypočítali jste svou první trasu', icon: '🧭', xpReward: 10 },
        'navigator-silver': { title: 'Navigátor (stříbro)', description: 'Vypočítali jste trasu delší než 50 km', icon: '🧭', xpReward: 25 },
        'navigator-gold': { title: 'Navigátor (zlato)', description: 'Vypočítali jste trasu delší než 200 km', icon: '🧭', xpReward: 50 },
        'navigator-platinum': { title: 'Navigátor (platina)', description: 'Vypočítali jste 10 různých tras', icon: '🧭', xpReward: 100 },

        // Průzkumník - za navštívení míst
        'explorer-bronze': { title: 'Průzkumník (bronz)', description: 'Navštívili jste své první místo', icon: '🏔️', xpReward: 10 },
        'explorer-silver': { title: 'Průzkumník (stříbro)', description: 'Navštívili jste 5 různých míst', icon: '🏔️', xpReward: 25 },
        'explorer-gold': { title: 'Průzkumník (zlato)', description: 'Navštívili jste 20 různých míst', icon: '🏔️', xpReward: 50 },
        'explorer-platinum': { title: 'Průzkumník (platina)', description: 'Navštívili jste 50 různých míst', icon: '🏔️', xpReward: 100 },

        // Gurmán - za navštívení restaurací
        'foodie-bronze': { title: 'Gurmán (bronz)', description: 'Navštívili jste svou první restauraci', icon: '🍽️', xpReward: 10 },
        'foodie-silver': { title: 'Gurmán (stříbro)', description: 'Navštívili jste 5 různých restaurací', icon: '🍽️', xpReward: 25 },
        'foodie-gold': { title: 'Gurmán (zlato)', description: 'Navštívili jste 15 různých restaurací', icon: '🍽️', xpReward: 50 },

        // Knihomol - za čtení příběhů
        'storyteller-bronze': { title: 'Knihomol (bronz)', description: 'Přečetli jste svůj první příběh', icon: '📜', xpReward: 10 },
        'storyteller-silver': { title: 'Knihomol (stříbro)', description: 'Přečetli jste 5 různých příběhů', icon: '📜', xpReward: 25 },
        'storyteller-gold': { title: 'Knihomol (zlato)', description: 'Přečetli jste 15 různých příběhů', icon: '📜', xpReward: 50 },

        // Cestovatel - za ujetou vzdálenost
        'traveler-bronze': { title: 'Cestovatel (bronz)', description: 'Ujeli jste celkem 100 km', icon: '✈️', xpReward: 15 },
        'traveler-silver': { title: 'Cestovatel (stříbro)', description: 'Ujeli jste celkem 500 km', icon: '✈️', xpReward: 30 },
        'traveler-gold': { title: 'Cestovatel (zlato)', description: 'Ujeli jste celkem 1000 km', icon: '✈️', xpReward: 60 },
        'traveler-platinum': { title: 'Cestovatel (platina)', description: 'Ujeli jste celkem 5000 km', icon: '✈️', xpReward: 120 },

        // Věrný uživatel - za aktivitu
        'loyal-bronze': { title: 'Věrný uživatel (bronz)', description: 'Používali jste aplikaci 3 dny', icon: '🔔', xpReward: 15 },
        'loyal-silver': { title: 'Věrný uživatel (stříbro)', description: 'Používali jste aplikaci 7 dní', icon: '🔔', xpReward: 30 },
        'loyal-gold': { title: 'Věrný uživatel (zlato)', description: 'Používali jste aplikaci 30 dní', icon: '🔔', xpReward: 100 },

        // Speciální achievementy
        'night-owl': { title: 'Noční sova', description: 'Použili jste noční režim mapy', icon: '🦉', xpReward: 10 },
        'weather-watcher': { title: 'Meteorolog', description: 'Zkontrolovali jste počasí v oblasti', icon: '☀️', xpReward: 10 },
        'shopper': { title: 'Nákupní maniák', description: 'Provedli jste online nákup', icon: '🛍️', xpReward: 15 },

        // Achievementy za nákup energetických nápojů
        'energy-buyer': { title: 'Energetický nadšenec', description: 'Zakoupili jste energetické nápoje', icon: '⚡', xpReward: 15 },
        'energy-collector': { title: 'Sběratel energeťáků', description: 'Zakoupili jste 5 různých energetických nápojů', icon: '⚡', xpReward: 30 },
        'energy-addict': { title: 'Závislý na kofeinu', description: 'Zakoupili jste energetické nápoje v hodnotě přes 500 Kč', icon: '⚡', xpReward: 50 },

        // Achievementy za nákup krkovičky
        'meat-lover': { title: 'Milovník masa', description: 'Zakoupili jste krkovičku nebo jiné maso', icon: '🥩', xpReward: 15 },
        'grill-master': { title: 'Mistr grilu', description: 'Zakoupili jste krkovičku a marinádu', icon: '🥩', xpReward: 30 },
        'meat-connoisseur': { title: 'Gurmán', description: 'Zakoupili jste maso v hodnotě přes 500 Kč', icon: '🥩', xpReward: 50 },

        // Achievementy za používání mapy
        'globe-trotter': { title: 'Světoběžník', description: 'Použili jste režim glóbusu', icon: '🌎', xpReward: 15 },
        'dimension-hopper': { title: 'Cestovatel dimenzemi', description: 'Použili jste 3D režim mapy', icon: '💫', xpReward: 15 },
        'map-master': { title: 'Mistr map', description: 'Použili jste všechny režimy zobrazení mapy', icon: '🗺️', xpReward: 30 },
        'route-planner': { title: 'Plánovač cest', description: 'Vypočítali jste 10 různých tras', icon: '🚗', xpReward: 20 },
        'point-collector': { title: 'Sběratel bodů', description: 'Přidali jste 20 bodů na mapu', icon: '📍', xpReward: 25 },

        // Achievementy za hledání práce
        'job-seeker': { title: 'Uchazeč o práci', description: 'Prohlédli jste si nabídky práce', icon: '💼', xpReward: 15 },
        'career-builder': { title: 'Budovatel kariéry', description: 'Reagovali jste na 5 nabídek práce', icon: '💼', xpReward: 30 },
        'professional': { title: 'Profesionál', description: 'Získali jste práci', icon: '💼', xpReward: 50 },

        // Achievementy za vyhledávání spojení veřejnou dopravou
        'transport-user': { title: 'Cestovatel', description: 'Vyhledali jste spojení veřejnou dopravou', icon: '🚏', xpReward: 15 },
        'transport-regular': { title: 'Pravidelný cestující', description: 'Vyhledali jste spojení veřejnou dopravou 5krát', icon: '🚆', xpReward: 30 },
        'transport-expert': { title: 'Expert na jízdní řády', description: 'Vyhledali jste spojení veřejnou dopravou 20krát', icon: '🚇', xpReward: 50 }
    },

    // Inicializace modulu
    init() {
        // Načtení uložených dat
        this.loadProgress();

        // Kontrola denního bonusu
        this.checkDailyBonus();

        // Aktualizace statistik aktivních dnů
        this.updateActiveDay();

        // Zobrazení aktuálního postupu
        this.updateProgressDisplay();

        // Přidání tlačítka pro zobrazení profilu
        this.addProfileButton();

        // Kontrola achievementů za aktivitu
        this.checkActivityAchievements();

        console.log('UserProgress initialized');
    },

    // Načtení uložených dat
    loadProgress() {
        // Pokus o načtení dat z localStorage
        const savedData = localStorage.getItem('userProgress');

        if (savedData) {
            try {
                const data = JSON.parse(savedData);

                // Načtení dat
                this.level = data.level || 0;
                this.experience = data.experience || 0;
                this.nextLevelXP = data.nextLevelXP || 100;
                this.achievements = data.achievements || {};
                this.stats = data.stats || {
                    routesCalculated: 0,
                    placesVisited: 0,
                    storiesRead: 0,
                    restaurantsVisited: 0,
                    distanceTraveled: 0,
                    daysActive: 0,
                    lastActiveDate: null
                };
                this.dailyBonus = data.dailyBonus || {
                    lastClaimDate: null,
                    streak: 0,
                    claimed: false
                };
                this.xpHistory = data.xpHistory || [];
                this.xpStats = data.xpStats || {
                    total: this.experience,
                    byCategory: {
                        daily: 0,
                        routes: 0,
                        places: 0,
                        achievements: 0,
                        purchases: 0,
                        other: 0
                    },
                    byTimeframe: {
                        today: 0,
                        thisWeek: 0,
                        thisMonth: 0,
                        allTime: this.experience
                    }
                };

                // Aktualizace celkového XP ve statistikách, pokud není správné
                if (this.xpStats.total !== this.experience) {
                    this.xpStats.total = this.experience;
                    this.xpStats.byTimeframe.allTime = this.experience;
                }

                console.log('User progress loaded:', this.level, this.experience, this.nextLevelXP);
            } catch (error) {
                console.error('Error loading user progress:', error);
            }
        }
    },

    // Uložení dat
    saveProgress() {
        // Vytvoření objektu s daty
        const data = {
            level: this.level,
            experience: this.experience,
            nextLevelXP: this.nextLevelXP,
            achievements: this.achievements,
            stats: this.stats,
            dailyBonus: this.dailyBonus,
            xpHistory: this.xpHistory,
            xpStats: this.xpStats
        };

        // Uložení dat do localStorage s optimalizací pro výkon
        try {
            localStorage.setItem('userProgress', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving user progress:', error);

            // Pokus o uložení bez historie a statistik v případě překročení limitu localStorage
            if (error.name === 'QuotaExceededError') {
                try {
                    // Nejprve zkusíme uložit bez historie XP
                    const dataWithoutHistory = {
                        level: this.level,
                        experience: this.experience,
                        nextLevelXP: this.nextLevelXP,
                        achievements: this.achievements,
                        stats: this.stats,
                        dailyBonus: this.dailyBonus,
                        xpStats: this.xpStats
                    };
                    localStorage.setItem('userProgress', JSON.stringify(dataWithoutHistory));
                } catch (error2) {
                    // Pokud to stále nefunguje, uložíme jen základní data
                    const minimalData = {
                        level: this.level,
                        experience: this.experience,
                        nextLevelXP: this.nextLevelXP
                    };
                    localStorage.setItem('userProgress', JSON.stringify(minimalData));
                }
            }
        }
    },

    // Přidání XP
    addExperience(amount, reason, category = 'other') {
        // Aplikace multiplikátoru XP na základě denního bonusu
        let finalAmount = amount;

        // Bonus za streak (každý den přidává 5% bonus, maximum 50%)
        const streakBonus = Math.min(this.dailyBonus.streak * 0.05, 0.5);
        if (streakBonus > 0) {
            const bonusXP = Math.round(amount * streakBonus);
            finalAmount += bonusXP;
            console.log(`Streak bonus: +${bonusXP} XP (${streakBonus * 100}%)`);
        }

        // Přidání XP
        this.experience += finalAmount;

        // Aktualizace statistik XP
        this.updateXPStats(finalAmount, category);

        // Přidání záznamu do historie XP
        this.addXPHistoryEntry(finalAmount, reason, category);

        // Kontrola, zda uživatel dosáhl nové úrovně
        this.checkLevelUp();

        // Uložení dat
        this.saveProgress();

        // Aktualizace zobrazení
        this.updateProgressDisplay();

        // Zobrazení informace o získání XP
        if (streakBonus > 0) {
            this.showXPNotification(finalAmount, `${reason} (+${Math.round(streakBonus * 100)}% bonus za ${this.dailyBonus.streak} dní aktivitu)`);
        } else {
            this.showXPNotification(finalAmount, reason);
        }

        console.log(`Added ${finalAmount} XP for: ${reason} (category: ${category})`);
        return finalAmount;
    },

    // Aktualizace statistik XP
    updateXPStats(amount, category) {
        // Aktualizace celkového XP
        this.xpStats.total += amount;

        // Aktualizace XP podle kategorie
        if (this.xpStats.byCategory[category] !== undefined) {
            this.xpStats.byCategory[category] += amount;
        } else {
            this.xpStats.byCategory.other += amount;
        }

        // Aktualizace XP podle časového období
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

        // Dnešní XP
        this.xpStats.byTimeframe.today += amount;

        // Týdenní XP
        this.xpStats.byTimeframe.thisWeek += amount;

        // Měsíční XP
        this.xpStats.byTimeframe.thisMonth += amount;

        // Celkové XP
        this.xpStats.byTimeframe.allTime += amount;
    },

    // Přidání záznamu do historie XP
    addXPHistoryEntry(amount, reason, category) {
        // Omezení velikosti historie (max 100 záznamů)
        if (this.xpHistory.length >= 100) {
            this.xpHistory.pop(); // Odstranění nejstaršího záznamu
        }

        // Přidání nového záznamu na začátek pole
        this.xpHistory.unshift({
            amount: amount,
            reason: reason,
            category: category,
            timestamp: new Date().toISOString()
        });
    },

    // Kontrola, zda uživatel dosáhl nové úrovně
    checkLevelUp() {
        while (this.experience >= this.nextLevelXP) {
            // Zvýšení úrovně
            this.level++;

            // Odečtení XP potřebných pro tuto úroveň
            this.experience -= this.nextLevelXP;

            // Zvýšení XP potřebných pro další úroveň
            this.nextLevelXP = Math.floor(this.nextLevelXP * 1.5);

            // Zobrazení informace o nové úrovni
            this.showLevelUpNotification();
        }
    },

    // Přidání achievementu
    addAchievement(id, title, description) {
        // Kontrola, zda uživatel již má tento achievement
        if (this.achievements[id]) {
            return false;
        }

        // Získání definice achievementu
        const achievementDef = this.achievementDefinitions[id] || {
            title: title || 'Achievement',
            description: description || 'Odemkli jste achievement',
            icon: '🏆',
            xpReward: 10
        };

        // Přidání achievementu
        this.achievements[id] = {
            title: title || achievementDef.title,
            description: description || achievementDef.description,
            icon: achievementDef.icon,
            date: new Date().toISOString()
        };

        // Uložení dat
        this.saveProgress();

        // Zobrazení informace o získání achievementu
        this.showAchievementNotification(this.achievements[id].title);

        // Přidání XP odměny za achievement
        if (achievementDef.xpReward) {
            this.addExperience(achievementDef.xpReward, `Odměna za achievement: ${this.achievements[id].title}`, 'achievements');
        }

        console.log(`Achievement unlocked: ${this.achievements[id].title}`);

        return true;
    },

    // Aktualizace zobrazení postupu
    updateProgressDisplay() {
        // Kontrola, zda existuje element pro zobrazení postupu
        let progressElement = document.getElementById('userProgressDisplay');

        // Pokud element neexistuje, vytvoříme ho
        if (!progressElement) {
            progressElement = document.createElement('div');
            progressElement.id = 'userProgressDisplay';
            progressElement.className = 'user-progress-display';
            document.body.appendChild(progressElement);
        }

        // Aktualizace obsahu
        progressElement.innerHTML = `
            <div class="user-progress-level">Úroveň ${this.level}</div>
            <div class="user-progress-xp-bar">
                <div class="user-progress-xp-fill" style="width: ${(this.experience / this.nextLevelXP) * 100}%"></div>
            </div>
            <div class="user-progress-xp-text">${this.experience}/${this.nextLevelXP} XP</div>
        `;
    },

    // Přidání tlačítka pro zobrazení profilu
    addProfileButton() {
        // Kontrola, zda již tlačítko existuje
        let profileButton = document.getElementById('userProfileButton');

        // Pokud tlačítko neexistuje, vytvoříme ho
        if (!profileButton) {
            profileButton = document.createElement('button');
            profileButton.id = 'userProfileButton';
            profileButton.className = 'user-profile-button';
            profileButton.innerHTML = '<span class="user-profile-button-icon">👤</span>';
            document.body.appendChild(profileButton);

            // Přidání event listeneru
            profileButton.addEventListener('click', () => {
                this.showProfileModal();
            });
        }

        // Přidání event listeneru na ukazatel úrovně
        const progressDisplay = document.getElementById('userProgressDisplay');
        if (progressDisplay) {
            // Odstranění předchozích event listenerů (pro jistotu)
            const newProgressDisplay = progressDisplay.cloneNode(true);
            progressDisplay.parentNode.replaceChild(newProgressDisplay, progressDisplay);

            // Přidání nového event listeneru
            newProgressDisplay.addEventListener('click', () => {
                this.showProfileModal();
            });

            // Změna kurzoru pro indikaci, že je to klikatelné
            newProgressDisplay.style.cursor = 'pointer';
        }
    },

    // Zobrazení modalu s profilem uživatele
    showProfileModal() {
        // Kontrola, zda již modal existuje
        if (document.getElementById('userProfileModal')) {
            return;
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'userProfileModal';
        modal.className = 'user-profile-modal';

        // Získání seznamu achievementů
        const achievementsList = Object.entries(this.achievements).map(([id, achievement]) => `
            <div class="user-profile-achievement">
                <div class="user-profile-achievement-icon">${this.getAchievementIcon(id)}</div>
                <div class="user-profile-achievement-info">
                    <div class="user-profile-achievement-title">${achievement.title}</div>
                    <div class="user-profile-achievement-description">${achievement.description}</div>
                    <div class="user-profile-achievement-date">Získáno: ${new Date(achievement.date).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');

        // Získání seznamu nedosažených achievementů
        const unlockedAchievementIds = Object.keys(this.achievements);
        const lockedAchievementsList = Object.entries(this.achievementDefinitions)
            .filter(([id]) => !unlockedAchievementIds.includes(id))
            .map(([id, achievement]) => `
                <div class="user-profile-achievement locked">
                    <div class="user-profile-achievement-icon">?</div>
                    <div class="user-profile-achievement-info">
                        <div class="user-profile-achievement-title">${achievement.title}</div>
                        <div class="user-profile-achievement-description">${achievement.description}</div>
                        <div class="user-profile-achievement-reward">Odměna: ${achievement.xpReward} XP</div>
                    </div>
                </div>
            `).join('');

        // Získání historie XP
        const xpHistoryList = this.xpHistory.map(entry => `
            <div class="user-profile-xp-history-item">
                <div class="user-profile-xp-history-amount">+${entry.amount} XP</div>
                <div class="user-profile-xp-history-info">
                    <div class="user-profile-xp-history-reason">${entry.reason}</div>
                    <div class="user-profile-xp-history-date">${new Date(entry.timestamp).toLocaleString()}</div>
                </div>
                <div class="user-profile-xp-history-category">${this.getCategoryName(entry.category)}</div>
            </div>
        `).join('');

        // Příprava dat pro grafy
        const categoryData = Object.entries(this.xpStats.byCategory).map(([category, value]) => {
            return { category: this.getCategoryName(category), value };
        });

        const timeframeData = Object.entries(this.xpStats.byTimeframe).map(([timeframe, value]) => {
            return { timeframe: this.getTimeframeName(timeframe), value };
        });

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="user-profile-modal-content">
                <div class="user-profile-modal-header">
                    <h2>Profil uživatele</h2>
                    <button class="user-profile-modal-close">&times;</button>
                </div>
                <div class="user-profile-modal-tabs">
                    <button class="user-profile-tab-button active" data-tab="overview">Přehled</button>
                    <button class="user-profile-tab-button" data-tab="stats">Statistiky</button>
                    <button class="user-profile-tab-button" data-tab="achievements">Achievementy</button>
                    <button class="user-profile-tab-button" data-tab="xp-history">Historie XP</button>
                </div>
                <div class="user-profile-modal-body">
                    <!-- Přehled -->
                    <div class="user-profile-tab-content active" id="overview-tab">
                        <div class="user-profile-info">
                            <div class="user-profile-level-container">
                                <div class="user-profile-level-circle">
                                    <span class="user-profile-level-number">${this.level}</span>
                                </div>
                                <div class="user-profile-level-text">Úroveň</div>
                            </div>

                            <div class="user-profile-progress">
                                <div class="user-profile-xp-info">
                                    <div>Postup k další úrovni:</div>
                                    <div>${this.experience}/${this.nextLevelXP} XP</div>
                                </div>
                                <div class="user-profile-xp-bar">
                                    <div class="user-profile-xp-fill" style="width: ${(this.experience / this.nextLevelXP) * 100}%"></div>
                                </div>
                                <div class="user-profile-xp-percentage">${Math.round((this.experience / this.nextLevelXP) * 100)}%</div>
                            </div>
                        </div>

                        <div class="user-profile-stats-summary">
                            <div class="user-profile-stats-card">
                                <div class="user-profile-stats-card-title">Celkem XP</div>
                                <div class="user-profile-stats-card-value">${this.xpStats.total}</div>
                            </div>
                            <div class="user-profile-stats-card">
                                <div class="user-profile-stats-card-title">Dnes získáno</div>
                                <div class="user-profile-stats-card-value">${this.xpStats.byTimeframe.today}</div>
                            </div>
                            <div class="user-profile-stats-card">
                                <div class="user-profile-stats-card-title">Tento týden</div>
                                <div class="user-profile-stats-card-value">${this.xpStats.byTimeframe.thisWeek}</div>
                            </div>
                            <div class="user-profile-stats-card">
                                <div class="user-profile-stats-card-title">Achievementy</div>
                                <div class="user-profile-stats-card-value">${Object.keys(this.achievements).length}</div>
                            </div>
                        </div>

                        <div class="user-profile-activity">
                            <h3>Aktivita</h3>
                            <div class="user-profile-activity-stats">
                                <div class="user-profile-activity-item">
                                    <div class="user-profile-activity-icon">📅</div>
                                    <div class="user-profile-activity-info">
                                        <div class="user-profile-activity-title">Aktivních dnů</div>
                                        <div class="user-profile-activity-value">${this.stats.daysActive}</div>
                                    </div>
                                </div>
                                <div class="user-profile-activity-item">
                                    <div class="user-profile-activity-icon">🔥</div>
                                    <div class="user-profile-activity-info">
                                        <div class="user-profile-activity-title">Denní streak</div>
                                        <div class="user-profile-activity-value">${this.dailyBonus.streak} dní</div>
                                    </div>
                                </div>
                                <div class="user-profile-activity-item">
                                    <div class="user-profile-activity-icon">📍</div>
                                    <div class="user-profile-activity-info">
                                        <div class="user-profile-activity-title">Navštívených míst</div>
                                        <div class="user-profile-activity-value">${this.stats.placesVisited}</div>
                                    </div>
                                </div>
                                <div class="user-profile-activity-item">
                                    <div class="user-profile-activity-icon">🚗</div>
                                    <div class="user-profile-activity-info">
                                        <div class="user-profile-activity-title">Vypočítaných tras</div>
                                        <div class="user-profile-activity-value">${this.stats.routesCalculated}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="user-profile-recent-xp">
                            <h3>Poslední získané XP</h3>
                            <div class="user-profile-recent-xp-list">
                                ${this.xpHistory.slice(0, 5).map(entry => `
                                    <div class="user-profile-recent-xp-item">
                                        <div class="user-profile-recent-xp-amount">+${entry.amount} XP</div>
                                        <div class="user-profile-recent-xp-reason">${entry.reason}</div>
                                        <div class="user-profile-recent-xp-time">${this.getTimeAgo(entry.timestamp)}</div>
                                    </div>
                                `).join('') || '<div class="user-profile-no-xp">Zatím nemáte žádnou historii XP.</div>'}
                            </div>
                        </div>
                    </div>

                    <!-- Statistiky -->
                    <div class="user-profile-tab-content" id="stats-tab">
                        <div class="user-profile-stats-section">
                            <h3>Získávání XP podle kategorií</h3>
                            <div class="user-profile-stats-chart">
                                <div class="user-profile-stats-chart-container" id="category-chart">
                                    ${this.generateBarChart(categoryData, 'category', 'value')}
                                </div>
                            </div>
                            <div class="user-profile-stats-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Kategorie</th>
                                            <th>Získané XP</th>
                                            <th>Podíl</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${Object.entries(this.xpStats.byCategory).map(([category, value]) => `
                                            <tr>
                                                <td>${this.getCategoryName(category)}</td>
                                                <td>${value} XP</td>
                                                <td>${this.xpStats.total > 0 ? Math.round((value / this.xpStats.total) * 100) : 0}%</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="user-profile-stats-section">
                            <h3>Časové statistiky</h3>
                            <div class="user-profile-stats-chart">
                                <div class="user-profile-stats-chart-container" id="timeframe-chart">
                                    ${this.generateBarChart(timeframeData, 'timeframe', 'value')}
                                </div>
                            </div>
                            <div class="user-profile-stats-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Časové období</th>
                                            <th>Získané XP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${Object.entries(this.xpStats.byTimeframe).map(([timeframe, value]) => `
                                            <tr>
                                                <td>${this.getTimeframeName(timeframe)}</td>
                                                <td>${value} XP</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="user-profile-stats-section">
                            <h3>Herní statistiky</h3>
                            <div class="user-profile-stats-grid">
                                <div class="user-profile-stats-grid-item">
                                    <div class="user-profile-stats-grid-title">Ujetá vzdálenost</div>
                                    <div class="user-profile-stats-grid-value">${this.stats.distanceTraveled.toFixed(1)} km</div>
                                </div>
                                <div class="user-profile-stats-grid-item">
                                    <div class="user-profile-stats-grid-title">Vypočítané trasy</div>
                                    <div class="user-profile-stats-grid-value">${this.stats.routesCalculated}</div>
                                </div>
                                <div class="user-profile-stats-grid-item">
                                    <div class="user-profile-stats-grid-title">Navštívená místa</div>
                                    <div class="user-profile-stats-grid-value">${this.stats.placesVisited}</div>
                                </div>
                                <div class="user-profile-stats-grid-item">
                                    <div class="user-profile-stats-grid-title">Přečtené příběhy</div>
                                    <div class="user-profile-stats-grid-value">${this.stats.storiesRead}</div>
                                </div>
                                <div class="user-profile-stats-grid-item">
                                    <div class="user-profile-stats-grid-title">Navštívené restaurace</div>
                                    <div class="user-profile-stats-grid-value">${this.stats.restaurantsVisited}</div>
                                </div>
                                <div class="user-profile-stats-grid-item">
                                    <div class="user-profile-stats-grid-title">Aktivních dnů</div>
                                    <div class="user-profile-stats-grid-value">${this.stats.daysActive}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Achievementy -->
                    <div class="user-profile-tab-content" id="achievements-tab">
                        <div class="user-profile-achievements-summary">
                            <div class="user-profile-achievements-count">
                                <div class="user-profile-achievements-count-value">${Object.keys(this.achievements).length}</div>
                                <div class="user-profile-achievements-count-label">Získaných achievementů</div>
                            </div>
                            <div class="user-profile-achievements-progress">
                                <div class="user-profile-achievements-progress-bar">
                                    <div class="user-profile-achievements-progress-fill" style="width: ${(Object.keys(this.achievements).length / Object.keys(this.achievementDefinitions).length) * 100}%"></div>
                                </div>
                                <div class="user-profile-achievements-progress-text">
                                    ${Object.keys(this.achievements).length}/${Object.keys(this.achievementDefinitions).length} (${Math.round((Object.keys(this.achievements).length / Object.keys(this.achievementDefinitions).length) * 100)}%)
                                </div>
                            </div>
                        </div>

                        <div class="user-profile-achievements-tabs">
                            <button class="user-profile-achievements-tab-button active" data-achievements-tab="unlocked">Získané</button>
                            <button class="user-profile-achievements-tab-button" data-achievements-tab="locked">Nedosažené</button>
                        </div>

                        <div class="user-profile-achievements-tab-content active" id="unlocked-achievements-tab">
                            <div class="user-profile-achievements">
                                ${achievementsList.length > 0 ? achievementsList : '<div class="user-profile-no-achievements">Zatím nemáte žádné achievementy.</div>'}
                            </div>
                        </div>

                        <div class="user-profile-achievements-tab-content" id="locked-achievements-tab">
                            <div class="user-profile-achievements">
                                ${lockedAchievementsList.length > 0 ? lockedAchievementsList : '<div class="user-profile-no-achievements">Všechny achievementy jsou již odemknuty!</div>'}
                            </div>
                        </div>
                    </div>

                    <!-- Historie XP -->
                    <div class="user-profile-tab-content" id="xp-history-tab">
                        <div class="user-profile-xp-history-filters">
                            <div class="user-profile-xp-history-filter">
                                <label for="xp-history-category-filter">Filtrovat podle kategorie:</label>
                                <select id="xp-history-category-filter">
                                    <option value="all">Všechny kategorie</option>
                                    <option value="daily">Denní bonusy</option>
                                    <option value="routes">Výpočet tras</option>
                                    <option value="places">Navštívení míst</option>
                                    <option value="achievements">Achievementy</option>
                                    <option value="purchases">Nákupy</option>
                                    <option value="other">Ostatní</option>
                                </select>
                            </div>
                        </div>

                        <div class="user-profile-xp-history">
                            ${xpHistoryList.length > 0 ? xpHistoryList : '<div class="user-profile-no-xp-history">Zatím nemáte žádnou historii XP.</div>'}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Přidání modalu do dokumentu
        document.body.appendChild(modal);

        // Animace zobrazení
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.user-profile-modal-close');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        // Přidání event listenerů pro záložky
        const tabButtons = modal.querySelectorAll('.user-profile-tab-button');
        const tabContents = modal.querySelectorAll('.user-profile-tab-content');

        if (tabButtons) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Odstranění aktivní třídy ze všech tlačítek
                    tabButtons.forEach(btn => btn.classList.remove('active'));

                    // Přidání aktivní třídy na kliknuté tlačítko
                    button.classList.add('active');

                    // Skrytí všech obsahů záložek
                    tabContents.forEach(content => content.classList.remove('active'));

                    // Zobrazení obsahu odpovídající záložky
                    const tabId = button.getAttribute('data-tab');
                    const tabContent = modal.querySelector(`#${tabId}-tab`);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                });
            });
        }

        // Přidání event listenerů pro záložky achievementů
        const achievementsTabButtons = modal.querySelectorAll('.user-profile-achievements-tab-button');
        const achievementsTabContents = modal.querySelectorAll('.user-profile-achievements-tab-content');

        if (achievementsTabButtons) {
            achievementsTabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Odstranění aktivní třídy ze všech tlačítek
                    achievementsTabButtons.forEach(btn => btn.classList.remove('active'));

                    // Přidání aktivní třídy na kliknuté tlačítko
                    button.classList.add('active');

                    // Skrytí všech obsahů záložek
                    achievementsTabContents.forEach(content => content.classList.remove('active'));

                    // Zobrazení obsahu odpovídající záložky
                    const tabId = button.getAttribute('data-achievements-tab');
                    const tabContent = modal.querySelector(`#${tabId}-achievements-tab`);
                    if (tabContent) {
                        tabContent.classList.add('active');
                    }
                });
            });
        }

        // Přidání event listeneru pro filtr historie XP
        const categoryFilter = modal.querySelector('#xp-history-category-filter');
        const xpHistoryItems = modal.querySelectorAll('.user-profile-xp-history-item');

        if (categoryFilter && xpHistoryItems.length > 0) {
            categoryFilter.addEventListener('change', () => {
                const selectedCategory = categoryFilter.value;

                xpHistoryItems.forEach(item => {
                    const itemCategory = item.querySelector('.user-profile-xp-history-category').textContent;

                    if (selectedCategory === 'all' || this.getCategoryName(selectedCategory) === itemCategory) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    },

    // Zobrazení notifikace o získání XP
    showXPNotification(amount, reason) {
        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'user-progress-notification xp-notification';
        notification.innerHTML = `
            <div class="user-progress-notification-icon">✨</div>
            <div class="user-progress-notification-content">
                <div class="user-progress-notification-title">+${amount} XP</div>
                <div class="user-progress-notification-text">${reason}</div>
            </div>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Automatické skrytí notifikace po 3 sekundách
        setTimeout(() => {
            notification.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    },

    // Zobrazení notifikace o nové úrovni
    showLevelUpNotification() {
        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'user-progress-notification level-up-notification';
        notification.innerHTML = `
            <div class="user-progress-notification-icon">🎉</div>
            <div class="user-progress-notification-content">
                <div class="user-progress-notification-title">Nová úroveň!</div>
                <div class="user-progress-notification-text">Dosáhli jste úrovně ${this.level}</div>
            </div>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Automatické skrytí notifikace po 5 sekundách
        setTimeout(() => {
            notification.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    },

    // Zobrazení notifikace o získání achievementu
    showAchievementNotification(title) {
        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'user-progress-notification achievement-notification';
        notification.innerHTML = `
            <div class="user-progress-notification-icon">🏆</div>
            <div class="user-progress-notification-content">
                <div class="user-progress-notification-title">Achievement odemčen!</div>
                <div class="user-progress-notification-text">${title}</div>
            </div>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Automatické skrytí notifikace po 5 sekundách
        setTimeout(() => {
            notification.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    },

    // Získání ikony pro achievement
    getAchievementIcon(id) {
        // Slovník ikon pro různé typy achievementů
        const icons = {
            'explorer': '🧭',
            'traveler': '✈️',
            'foodie': '🍽️',
            'storyteller': '📚',
            'photographer': '📷',
            'navigator': '🗺️',
            'weather': '☀️',
            'shopper': '🛒',
            'social': '👥',
            'collector': '🏆',
            'energy-buyer': '⚡',
            'energy-collector': '⚡',
            'energy-addict': '⚡',
            'meat-lover': '🥩',
            'grill-master': '🥩',
            'meat-connoisseur': '🥩'
        };

        // Vrácení ikony pro daný typ achievementu nebo výchozí ikonu
        return icons[id] || '🏆';
    },

    // Získání názvu kategorie XP
    getCategoryName(category) {
        const categoryNames = {
            'daily': 'Denní bonusy',
            'routes': 'Výpočet tras',
            'places': 'Navštívení míst',
            'achievements': 'Achievementy',
            'purchases': 'Nákupy',
            'decisions': 'Rozhodnutí v chatu',
            'map': 'Interakce s mapou',
            'jobs': 'Hledání práce',
            'transport': 'Vyhledávání spojení',
            'work': 'Práce a úkoly',
            'assistants': 'Asistenti a služby',
            'entertainment': 'Zábava',
            'other': 'Ostatní'
        };

        return categoryNames[category] || 'Ostatní';
    },

    // Získání názvu časového období
    getTimeframeName(timeframe) {
        const timeframeNames = {
            'today': 'Dnes',
            'thisWeek': 'Tento týden',
            'thisMonth': 'Tento měsíc',
            'allTime': 'Celkem'
        };

        return timeframeNames[timeframe] || timeframe;
    },

    // Získání času uplynulého od daného data
    getTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) {
            return 'Právě teď';
        } else if (diffMin < 60) {
            return `Před ${diffMin} ${this.getMinutesString(diffMin)}`;
        } else if (diffHour < 24) {
            return `Před ${diffHour} ${this.getHoursString(diffHour)}`;
        } else if (diffDay < 7) {
            return `Před ${diffDay} ${this.getDaysString(diffDay)}`;
        } else {
            return date.toLocaleDateString();
        }
    },

    // Pomocná funkce pro správný tvar slova "minuta"
    getMinutesString(count) {
        if (count === 1) {
            return 'minutou';
        } else if (count >= 2 && count <= 4) {
            return 'minutami';
        } else {
            return 'minutami';
        }
    },

    // Pomocná funkce pro správný tvar slova "hodina"
    getHoursString(count) {
        if (count === 1) {
            return 'hodinou';
        } else if (count >= 2 && count <= 4) {
            return 'hodinami';
        } else {
            return 'hodinami';
        }
    },

    // Pomocná funkce pro správný tvar slova "den"
    getDaysString(count) {
        if (count === 1) {
            return 'dnem';
        } else {
            return 'dny';
        }
    },

    // Generování sloupcového grafu
    generateBarChart(data, labelKey, valueKey) {
        if (!data || data.length === 0) {
            return '<div class="user-profile-no-data">Nejsou k dispozici žádná data pro zobrazení grafu.</div>';
        }

        // Nalezení maximální hodnoty pro škálování
        const maxValue = Math.max(...data.map(item => item[valueKey]));

        // Generování HTML pro graf
        return `
            <div class="user-profile-bar-chart">
                ${data.map(item => {
                    const percentage = maxValue > 0 ? (item[valueKey] / maxValue) * 100 : 0;
                    return `
                        <div class="user-profile-bar-chart-item">
                            <div class="user-profile-bar-chart-label">${item[labelKey]}</div>
                            <div class="user-profile-bar-chart-bar-container">
                                <div class="user-profile-bar-chart-bar" style="height: ${percentage}%"></div>
                                <div class="user-profile-bar-chart-value">${item[valueKey]}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    UserProgress.init();
});
