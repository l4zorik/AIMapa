/**
 * Rozšíření pro modul UserProgress
 * Verze 0.2.8.6.6
 */

// Rozšíření pro denní bonusy a statistiky
const UserProgressExtensions = {
    // Inicializace rozšíření
    init() {
        // Kontrola denního bonusu
        this.checkDailyBonus();

        // Aktualizace statistik aktivních dnů
        this.updateActiveDay();

        // Kontrola achievementů za aktivitu
        this.checkActivityAchievements();

        // Resetování časových statistik XP, pokud je to potřeba
        this.resetTimeframeStats();

        console.log('UserProgress extensions initialized');
    },

    // Resetování časových statistik XP
    resetTimeframeStats() {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

        // Kontrola, zda je potřeba resetovat denní statistiky
        if (!UserProgress.stats.lastStatsReset || UserProgress.stats.lastStatsReset.daily !== todayStr) {
            // Resetování denních statistik
            UserProgress.xpStats.byTimeframe.today = 0;

            // Uložení data posledního resetu
            if (!UserProgress.stats.lastStatsReset) {
                UserProgress.stats.lastStatsReset = {};
            }
            UserProgress.stats.lastStatsReset.daily = todayStr;
        }

        // Získání čísla týdne v roce
        const getWeekNumber = (date) => {
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        };

        const currentWeek = `${today.getFullYear()}-W${getWeekNumber(today)}`;

        // Kontrola, zda je potřeba resetovat týdenní statistiky
        if (!UserProgress.stats.lastStatsReset || UserProgress.stats.lastStatsReset.weekly !== currentWeek) {
            // Resetování týdenních statistik
            UserProgress.xpStats.byTimeframe.thisWeek = 0;

            // Uložení data posledního resetu
            if (!UserProgress.stats.lastStatsReset) {
                UserProgress.stats.lastStatsReset = {};
            }
            UserProgress.stats.lastStatsReset.weekly = currentWeek;
        }

        // Kontrola, zda je potřeba resetovat měsíční statistiky
        const currentMonth = `${today.getFullYear()}-${today.getMonth() + 1}`;

        if (!UserProgress.stats.lastStatsReset || UserProgress.stats.lastStatsReset.monthly !== currentMonth) {
            // Resetování měsíčních statistik
            UserProgress.xpStats.byTimeframe.thisMonth = 0;

            // Uložení data posledního resetu
            if (!UserProgress.stats.lastStatsReset) {
                UserProgress.stats.lastStatsReset = {};
            }
            UserProgress.stats.lastStatsReset.monthly = currentMonth;
        }

        // Uložení změn
        UserProgress.saveProgress();
    },

    // Kontrola denního bonusu
    checkDailyBonus() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Pokud je to první návštěva vůbec
        if (!UserProgress.dailyBonus.lastClaimDate) {
            UserProgress.dailyBonus.lastClaimDate = today;
            UserProgress.dailyBonus.streak = 1;
            UserProgress.dailyBonus.claimed = true;
            UserProgress.saveProgress();
            this.showDailyBonusNotification(1, 5);
            UserProgress.addExperience(5, 'První přihlášení');
            return;
        }

        // Pokud je to nový den
        if (today !== UserProgress.dailyBonus.lastClaimDate) {
            // Kontrola, zda je to následující den (pro streak)
            const lastDate = new Date(UserProgress.dailyBonus.lastClaimDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Následující den - zvýšení streaku
                UserProgress.dailyBonus.streak += 1;
            } else if (diffDays > 1) {
                // Přerušení streaku
                UserProgress.dailyBonus.streak = 1;
            }

            // Aktualizace data a nastavení bonusu
            UserProgress.dailyBonus.lastClaimDate = today;
            UserProgress.dailyBonus.claimed = true;

            // Výpočet bonusu (základních 5 XP + 1 XP za každý den streaku, max 25 XP)
            const bonusXP = Math.min(5 + UserProgress.dailyBonus.streak, 25);

            // Zobrazení notifikace a přidání XP
            this.showDailyBonusNotification(UserProgress.dailyBonus.streak, bonusXP);
            UserProgress.addExperience(bonusXP, `Denní bonus (${UserProgress.dailyBonus.streak} dní v řadě)`, 'daily');

            // Uložení změn
            UserProgress.saveProgress();
        }
    },

    // Aktualizace statistik aktivních dnů
    updateActiveDay() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Pokud je to první návštěva nebo nový den
        if (!UserProgress.stats.lastActiveDate || today !== UserProgress.stats.lastActiveDate) {
            // Aktualizace počtu aktivních dnů
            UserProgress.stats.daysActive += 1;
            UserProgress.stats.lastActiveDate = today;

            // Uložení změn
            UserProgress.saveProgress();
        }
    },

    // Kontrola achievementů za aktivitu
    checkActivityAchievements() {
        // Achievement za 3 dny aktivity
        if (UserProgress.stats.daysActive >= 3 && !UserProgress.achievements['loyal-bronze']) {
            UserProgress.addAchievement('loyal-bronze');
        }

        // Achievement za 7 dní aktivity
        if (UserProgress.stats.daysActive >= 7 && !UserProgress.achievements['loyal-silver']) {
            UserProgress.addAchievement('loyal-silver');
        }

        // Achievement za 30 dní aktivity
        if (UserProgress.stats.daysActive >= 30 && !UserProgress.achievements['loyal-gold']) {
            UserProgress.addAchievement('loyal-gold');
        }
    },

    // Zobrazení notifikace o denním bonusu
    showDailyBonusNotification(streak, bonusXP) {
        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'user-progress-notification daily-bonus-notification';
        notification.innerHTML = `
            <div class="user-progress-notification-icon">🎉</div>
            <div class="user-progress-notification-content">
                <div class="user-progress-notification-title">Denní bonus!</div>
                <div class="user-progress-notification-text">Získáváte ${bonusXP} XP za ${streak} ${this.getDayString(streak)}</div>
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

    // Pomocná funkce pro správný tvar slova "den"
    getDayString(count) {
        if (count === 1) {
            return 'den';
        } else if (count >= 2 && count <= 4) {
            return 'dny';
        } else {
            return 'dní';
        }
    },

    // Aktualizace statistik tras
    updateRouteStats(distanceKm) {
        // Zvýšení počtu vypočítaných tras
        UserProgress.stats.routesCalculated += 1;

        // Přidání ujeté vzdálenosti
        const distance = parseFloat(distanceKm);
        UserProgress.stats.distanceTraveled += distance;

        // Přidání XP za výpočet trasy (1 XP za každý km, max 20 XP)
        const routeXP = Math.min(Math.ceil(distance), 20);
        if (routeXP > 0) {
            UserProgress.addExperience(routeXP, `Výpočet trasy: ${distance.toFixed(1)} km`, 'routes');
        }

        // Kontrola achievementů za ujetou vzdálenost
        this.checkTravelAchievements();

        // Uložení změn
        UserProgress.saveProgress();
    },

    // Kontrola achievementů za ujetou vzdálenost
    checkTravelAchievements() {
        const distance = UserProgress.stats.distanceTraveled;

        // Achievement za 100 km
        if (distance >= 100 && !UserProgress.achievements['traveler-bronze']) {
            UserProgress.addAchievement('traveler-bronze');
        }

        // Achievement za 500 km
        if (distance >= 500 && !UserProgress.achievements['traveler-silver']) {
            UserProgress.addAchievement('traveler-silver');
        }

        // Achievement za 1000 km
        if (distance >= 1000 && !UserProgress.achievements['traveler-gold']) {
            UserProgress.addAchievement('traveler-gold');
        }

        // Achievement za 5000 km
        if (distance >= 5000 && !UserProgress.achievements['traveler-platinum']) {
            UserProgress.addAchievement('traveler-platinum');
        }
    },

    // Sledování interakcí s mapou
    trackMapInteraction(interactionType, details = {}) {
        // Inicializace statistik map, pokud neexistují
        if (!UserProgress.stats.mapInteractions) {
            UserProgress.stats.mapInteractions = {
                globeMode: 0,
                threeDMode: 0,
                routesCalculated: UserProgress.stats.routesCalculated || 0,
                pointsAdded: 0,
                mapModes: []
            };
        }

        // Aktualizace statistik podle typu interakce
        switch (interactionType) {
            case 'globeMode':
                UserProgress.stats.mapInteractions.globeMode++;
                if (!UserProgress.stats.mapInteractions.mapModes.includes('globe')) {
                    UserProgress.stats.mapInteractions.mapModes.push('globe');
                }
                // Přidání XP za použití glóbusu
                UserProgress.addExperience(5, 'Použití režimu glóbusu', 'map');
                // Kontrola achievementu
                if (!UserProgress.achievements['globe-trotter']) {
                    UserProgress.addAchievement('globe-trotter');
                }
                break;

            case 'threeDMode':
                UserProgress.stats.mapInteractions.threeDMode++;
                if (!UserProgress.stats.mapInteractions.mapModes.includes('3d')) {
                    UserProgress.stats.mapInteractions.mapModes.push('3d');
                }
                // Přidání XP za použití 3D režimu
                UserProgress.addExperience(5, 'Použití 3D režimu mapy', 'map');
                // Kontrola achievementu
                if (!UserProgress.achievements['dimension-hopper']) {
                    UserProgress.addAchievement('dimension-hopper');
                }
                break;

            case 'addPoint':
                UserProgress.stats.mapInteractions.pointsAdded++;
                // Přidání XP za přidání bodu
                UserProgress.addExperience(3, 'Přidání bodu na mapu', 'map');
                // Kontrola achievementu za přidání bodů
                this.checkPointsAchievements();
                break;

            case 'calculateRoute':
                // Aktualizace počtu vypočítaných tras
                UserProgress.stats.routesCalculated++;
                UserProgress.stats.mapInteractions.routesCalculated = UserProgress.stats.routesCalculated;
                // Kontrola achievementu za vypočítané trasy
                this.checkRoutesAchievements();
                break;

            case 'standardMode':
                if (!UserProgress.stats.mapInteractions.mapModes.includes('standard')) {
                    UserProgress.stats.mapInteractions.mapModes.push('standard');
                }
                // Přidání XP za použití standardního režimu
                UserProgress.addExperience(2, 'Použití standardního režimu mapy', 'map');
                break;
        }

        // Kontrola achievementu za použití všech režimů mapy
        if (UserProgress.stats.mapInteractions.mapModes.length >= 3 && !UserProgress.achievements['map-master']) {
            UserProgress.addAchievement('map-master');
        }

        // Uložení změn
        UserProgress.saveProgress();
    },

    // Kontrola achievementů za přidání bodů
    checkPointsAchievements() {
        const pointsAdded = UserProgress.stats.mapInteractions.pointsAdded;

        // Achievement za přidání 20 bodů
        if (pointsAdded >= 20 && !UserProgress.achievements['point-collector']) {
            UserProgress.addAchievement('point-collector');
        }
    },

    // Kontrola achievementů za vypočítané trasy
    checkRoutesAchievements() {
        const routesCalculated = UserProgress.stats.routesCalculated;

        // Achievement za vypočítání 10 tras
        if (routesCalculated >= 10 && !UserProgress.achievements['route-planner']) {
            UserProgress.addAchievement('route-planner');
        }
    },

    // Sledování vyhledávání spojení veřejnou dopravou
    trackTransportSearch() {
        // Inicializace statistik vyhledávání spojení, pokud neexistují
        if (!UserProgress.stats.transportSearch) {
            UserProgress.stats.transportSearch = {
                count: 0,
                lastSearch: null
            };
        }

        // Aktualizace statistik
        UserProgress.stats.transportSearch.count++;
        UserProgress.stats.transportSearch.lastSearch = new Date().toISOString();

        // Přidání XP za vyhledávání spojení
        UserProgress.addExperience(5, 'Vyhledávání spojení veřejnou dopravou', 'transport');

        // Kontrola achievementů za vyhledávání spojení
        this.checkTransportAchievements();

        // Uložení změn
        UserProgress.saveProgress();
    },

    // Kontrola achievementů za vyhledávání spojení
    checkTransportAchievements() {
        const searchCount = UserProgress.stats.transportSearch?.count || 0;

        // Achievement za první vyhledání spojení
        if (searchCount >= 1 && !UserProgress.achievements['transport-user']) {
            UserProgress.addAchievement('transport-user');
        }

        // Achievement za 5 vyhledání spojení
        if (searchCount >= 5 && !UserProgress.achievements['transport-regular']) {
            UserProgress.addAchievement('transport-regular');
        }

        // Achievement za 20 vyhledání spojení
        if (searchCount >= 20 && !UserProgress.achievements['transport-expert']) {
            UserProgress.addAchievement('transport-expert');
        }
    },

    // Sledování nákupů a přidělování achievementů
    trackPurchase(shopType, items, totalAmount) {
        // Inicializace statistik nákupů, pokud neexistují
        if (!UserProgress.stats.purchases) {
            UserProgress.stats.purchases = {
                totalSpent: 0,
                energyDrinks: {
                    count: 0,
                    totalSpent: 0,
                    uniqueItems: []
                },
                meat: {
                    count: 0,
                    totalSpent: 0,
                    uniqueItems: []
                }
            };
        }

        // Aktualizace celkových statistik
        UserProgress.stats.purchases.totalSpent += totalAmount;

        // Aktualizace statistik podle typu obchodu
        if (shopType === 'energy-drinks') {
            // Aktualizace statistik energetických nápojů
            UserProgress.stats.purchases.energyDrinks.count += items.length;
            UserProgress.stats.purchases.energyDrinks.totalSpent += totalAmount;

            // Sledování unikátních položek
            items.forEach(item => {
                if (!UserProgress.stats.purchases.energyDrinks.uniqueItems.includes(item.name)) {
                    UserProgress.stats.purchases.energyDrinks.uniqueItems.push(item.name);
                }
            });

            // Kontrola achievementů za nákup energetických nápojů
            this.checkEnergyDrinkAchievements();
        }
        else if (shopType === 'krkovicka') {
            // Aktualizace statistik masa
            UserProgress.stats.purchases.meat.count += items.length;
            UserProgress.stats.purchases.meat.totalSpent += totalAmount;

            // Sledování unikátních položek
            items.forEach(item => {
                if (!UserProgress.stats.purchases.meat.uniqueItems.includes(item.name)) {
                    UserProgress.stats.purchases.meat.uniqueItems.push(item.name);
                }
            });

            // Kontrola achievementů za nákup masa
            this.checkMeatAchievements();
        }

        // Uložení změn
        UserProgress.saveProgress();

        // Přidání XP za nákup
        const purchaseXP = Math.min(Math.ceil(totalAmount / 50), 30); // Maximum 30 XP
        return UserProgress.addExperience(purchaseXP, `Nákup v hodnotě ${totalAmount} Kč`, 'purchases');
    },

    // Kontrola achievementů za nákup energetických nápojů
    checkEnergyDrinkAchievements() {
        const stats = UserProgress.stats.purchases.energyDrinks;

        // Základní achievement za nákup energetických nápojů
        if (stats.count > 0 && !UserProgress.achievements['energy-buyer']) {
            UserProgress.addAchievement('energy-buyer');
        }

        // Achievement za nákup 5 různých energetických nápojů
        if (stats.uniqueItems.length >= 5 && !UserProgress.achievements['energy-collector']) {
            UserProgress.addAchievement('energy-collector');
        }

        // Achievement za nákup energetických nápojů v hodnotě přes 500 Kč
        if (stats.totalSpent >= 500 && !UserProgress.achievements['energy-addict']) {
            UserProgress.addAchievement('energy-addict');
        }
    },

    // Kontrola achievementů za nákup masa
    checkMeatAchievements() {
        const stats = UserProgress.stats.purchases.meat;

        // Základní achievement za nákup masa
        if (stats.count > 0 && !UserProgress.achievements['meat-lover']) {
            UserProgress.addAchievement('meat-lover');
        }

        // Achievement za nákup krkovičky a marinády
        const hasKrkovicka = stats.uniqueItems.some(item => item.toLowerCase().includes('krkovička'));
        const hasMarinade = stats.uniqueItems.some(item => item.toLowerCase().includes('marináda'));

        if (hasKrkovicka && hasMarinade && !UserProgress.achievements['grill-master']) {
            UserProgress.addAchievement('grill-master');
        }

        // Achievement za nákup masa v hodnotě přes 500 Kč
        if (stats.totalSpent >= 500 && !UserProgress.achievements['meat-connoisseur']) {
            UserProgress.addAchievement('meat-connoisseur');
        }
    },

    // Sledování hledání práce
    trackJobSearch(action, jobDetails = {}) {
        // Inicializace statistik hledání práce, pokud neexistují
        if (!UserProgress.stats.jobSearch) {
            UserProgress.stats.jobSearch = {
                viewCount: 0,
                applicationCount: 0,
                jobsViewed: [],
                jobsApplied: [],
                jobsAccepted: 0
            };
        }

        // Aktualizace statistik podle typu akce
        switch (action) {
            case 'view':
                // Zvýšení počtu zobrazení nabídek práce
                UserProgress.stats.jobSearch.viewCount++;

                // Přidání ID nabídky do seznamu zobrazených, pokud je k dispozici a ještě nebyla zobrazena
                if (jobDetails.id && !UserProgress.stats.jobSearch.jobsViewed.includes(jobDetails.id)) {
                    UserProgress.stats.jobSearch.jobsViewed.push(jobDetails.id);
                }

                // Přidání XP za zobrazení nabídek práce
                UserProgress.addExperience(3, 'Prohlížení nabídek práce', 'jobs');

                // Kontrola achievementu za zobrazení nabídek práce
                if (!UserProgress.achievements['job-seeker']) {
                    UserProgress.addAchievement('job-seeker');
                }
                break;

            case 'apply':
                // Zvýšení počtu žádostí o práci
                UserProgress.stats.jobSearch.applicationCount++;

                // Přidání ID nabídky do seznamu, na které bylo reagováno
                if (jobDetails.id && !UserProgress.stats.jobSearch.jobsApplied.includes(jobDetails.id)) {
                    UserProgress.stats.jobSearch.jobsApplied.push(jobDetails.id);
                }

                // Přidání XP za reakci na nabídku práce
                UserProgress.addExperience(10, 'Reakce na nabídku práce', 'jobs');

                // Kontrola achievementu za reakci na 5 nabídek práce
                if (UserProgress.stats.jobSearch.applicationCount >= 5 && !UserProgress.achievements['career-builder']) {
                    UserProgress.addAchievement('career-builder');
                }
                break;

            case 'accept':
                // Zvýšení počtu přijatých nabídek práce
                UserProgress.stats.jobSearch.jobsAccepted++;

                // Přidání XP za získání práce
                UserProgress.addExperience(50, 'Získání práce', 'jobs');

                // Kontrola achievementu za získání práce
                if (!UserProgress.achievements['professional']) {
                    UserProgress.addAchievement('professional');
                }
                break;
        }

        // Uložení změn
        UserProgress.saveProgress();

        return true;
    }
};

// Inicializace rozšíření po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    // Počkáme na inicializaci základního modulu UserProgress
    setTimeout(() => {
        UserProgressExtensions.init();
    }, 100);
});
