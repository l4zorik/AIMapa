/**
 * Modul pro správu achievementů
 * Verze 0.3.7.0
 */

const Achievements = {
    // Stav modulu
    isInitialized: false,

    // Seznam achievementů
    achievements: [
        {
            id: 'point_collector',
            name: 'Sběratel bodů',
            description: 'Přidejte 10 bodů na mapu',
            icon: '📍',
            category: 'mapa',
            requirement: 10,
            progress: 0,
            completed: false,
            reward: {
                xp: 100
            },
            dateCompleted: null
        },
        {
            id: 'route_master',
            name: 'Mistr tras',
            description: 'Vypočítejte 5 tras mezi body',
            icon: '🚗',
            category: 'mapa',
            requirement: 5,
            progress: 0,
            completed: false,
            reward: {
                xp: 150
            },
            dateCompleted: null
        },
        {
            id: 'work_enthusiast',
            name: 'Pracovní nadšenec',
            description: 'Dokončete 3 virtuální práce',
            icon: '💼',
            category: 'práce',
            requirement: 3,
            progress: 0,
            completed: false,
            reward: {
                xp: 200,
                money: 500
            },
            dateCompleted: null
        },
        {
            id: 'reward_collector',
            name: 'Sběratel odměn',
            description: 'Získejte 5 odměn v odměňovacím systému',
            icon: '🏆',
            category: 'odměny',
            requirement: 5,
            progress: 0,
            completed: false,
            reward: {
                xp: 100
            },
            dateCompleted: null
        },
        {
            id: 'housing_explorer',
            name: 'Průzkumník bydlení',
            description: 'Prohlédněte si 10 nabídek bydlení',
            icon: '🏠',
            category: 'služby',
            requirement: 10,
            progress: 0,
            completed: false,
            reward: {
                xp: 120
            },
            dateCompleted: null
        },
        {
            id: 'night_owl',
            name: 'Noční sova',
            description: 'Používejte aplikaci v tmavém režimu po dobu 10 minut',
            icon: '🌙',
            category: 'nastavení',
            requirement: 10,
            progress: 0,
            completed: false,
            reward: {
                xp: 80
            },
            dateCompleted: null
        },
        {
            id: 'globe_trotter',
            name: 'Světoběžník',
            description: 'Použijte glóbus režim a prozkoumejte 5 různých míst',
            icon: '🌎',
            category: 'zobrazení',
            requirement: 5,
            progress: 0,
            completed: false,
            reward: {
                xp: 150
            },
            dateCompleted: null
        },
        {
            id: 'task_master',
            name: 'Mistr úkolů',
            description: 'Dokončete 5 úkolů v systému úkolů',
            icon: '📝',
            category: 'úkoly',
            requirement: 5,
            progress: 0,
            completed: false,
            reward: {
                xp: 200,
                questPoints: 50
            },
            dateCompleted: null
        },
        {
            id: 'crypto_investor',
            name: 'Krypto investor',
            description: 'Získejte celkem 0.1 BTC',
            icon: '₿',
            category: 'finance',
            requirement: 0.1,
            progress: 0,
            completed: false,
            reward: {
                xp: 250
            },
            dateCompleted: null
        },
        {
            id: 'level_up',
            name: 'Postup v úrovních',
            description: 'Dosáhněte úrovně 5',
            icon: '⭐',
            category: 'postup',
            requirement: 5,
            progress: 0,
            completed: false,
            reward: {
                xp: 300
            },
            dateCompleted: null
        }
    ],

    // Kategorie achievementů
    categories: [
        { id: 'all', name: 'Všechny', icon: '🏆' },
        { id: 'mapa', name: 'Mapa', icon: '🗺️' },
        { id: 'práce', name: 'Práce', icon: '💼' },
        { id: 'odměny', name: 'Odměny', icon: '🎁' },
        { id: 'služby', name: 'Služby', icon: '🏢' },
        { id: 'nastavení', name: 'Nastavení', icon: '⚙️' },
        { id: 'zobrazení', name: 'Zobrazení', icon: '👁️' },
        { id: 'úkoly', name: 'Úkoly', icon: '📝' },
        { id: 'finance', name: 'Finance', icon: '💰' },
        { id: 'postup', name: 'Postup', icon: '📈' }
    ],

    // Aktivní filtr kategorie
    activeCategory: 'all',

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;

        console.log('Inicializace modulu achievementů...');

        // Načtení achievementů z localStorage
        this.loadAchievements();

        // Přidání do menu příkazů
        this.addToCommandsMenu();

        // Nastavení event listenerů
        this.setupEventListeners();

        this.isInitialized = true;
        console.log('Modul achievementů byl inicializován');
    },

    // Načtení achievementů z localStorage
    loadAchievements() {
        try {
            const savedAchievements = localStorage.getItem('achievements');
            if (savedAchievements) {
                const parsedAchievements = JSON.parse(savedAchievements);

                // Aktualizace pouze existujících achievementů
                this.achievements.forEach((achievement, index) => {
                    const savedAchievement = parsedAchievements.find(a => a.id === achievement.id);
                    if (savedAchievement) {
                        this.achievements[index].progress = savedAchievement.progress;
                        this.achievements[index].completed = savedAchievement.completed;
                        this.achievements[index].dateCompleted = savedAchievement.dateCompleted;
                    }
                });

                console.log('Achievementy načteny z localStorage');
            }
        } catch (error) {
            console.error('Chyba při načítání achievementů:', error);
        }
    },

    // Uložení achievementů do localStorage
    saveAchievements() {
        try {
            localStorage.setItem('achievements', JSON.stringify(this.achievements));
            console.log('Achievementy uloženy do localStorage');
        } catch (error) {
            console.error('Chyba při ukládání achievementů:', error);
        }
    },

    // Přidání do menu příkazů
    addToCommandsMenu() {
        // Kontrola, zda existuje objekt CommandsMenu
        if (typeof CommandsMenu !== 'undefined') {
            // Najdeme kategorii "Služby"
            const servicesCategory = CommandsMenu.categories.find(cat => cat.id === 'services');

            if (servicesCategory) {
                // Přidání příkazu pro achievementy
                servicesCategory.commands.push({
                    id: 'achievements',
                    name: 'Achievementy',
                    description: 'Zobrazí přehled dosažených achievementů',
                    icon: '🏆',
                    command: 'achievementy'
                });

                // Obnovení menu příkazů
                if (typeof CommandsMenu.refreshMenu === 'function') {
                    CommandsMenu.refreshMenu();
                }

                console.log('Příkaz pro achievementy byl přidán do menu příkazů');
            }
        }
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro zavření dialogu achievementů
        document.addEventListener('click', (e) => {
            if (e.target.matches('.achievements-dialog-close')) {
                this.hideAchievementsDialog();
            }
        });

        // Event listener pro přepínání kategorií
        document.addEventListener('click', (e) => {
            if (e.target.matches('.achievements-category-item')) {
                const categoryId = e.target.dataset.category;
                this.filterByCategory(categoryId);
            }
        });
    },

    // Aktualizace progressu achievementu
    updateProgress(achievementId, progress) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        // Pokud je achievement již dokončen, nic neděláme
        if (achievement.completed) return;

        // Aktualizace progressu
        achievement.progress = progress;

        // Kontrola, zda byl achievement dokončen
        if (achievement.progress >= achievement.requirement && !achievement.completed) {
            achievement.completed = true;
            achievement.dateCompleted = new Date().toISOString();

            // Přidání XP za dokončení achievementu
            if (typeof UserProgress !== 'undefined' && achievement.reward.xp) {
                UserProgress.addXP(achievement.reward.xp, `Dokončení achievementu: ${achievement.name}`);
            }

            // Přidání peněz za dokončení achievementu
            if (typeof updateMoney !== 'undefined' && achievement.reward.money) {
                updateMoney(achievement.reward.money);

                // Přidání zprávy do chatu
                if (typeof addMessage !== 'undefined') {
                    addMessage(`Získali jste ${achievement.reward.money} Kč za dokončení achievementu: ${achievement.name}`, false);
                }
            }

            // Přidání quest bodů za dokončení achievementu
            if (typeof TaskSystem !== 'undefined' && achievement.reward.questPoints) {
                TaskSystem.addQuestPoints(achievement.reward.questPoints);
            }

            // Zobrazení notifikace o dokončení achievementu
            this.showAchievementNotification(achievement);
        }

        // Uložení achievementů
        this.saveAchievements();
    },

    // Testovací funkce pro dokončení achievementu (pouze pro demonstraci)
    completeAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        // Nastavení progressu na požadovanou hodnotu
        this.updateProgress(achievementId, achievement.requirement);

        // Obnovení seznamu achievementů v UI
        const achievementsList = document.querySelector('.achievements-list');
        if (achievementsList) {
            achievementsList.innerHTML = this.getFilteredAchievements().map(achievement => this.renderAchievementItem(achievement)).join('');
        }
    },

    // Zobrazení notifikace o dokončení achievementu
    showAchievementNotification(achievement) {
        // Odstranění existující notifikace, pokud existuje
        const existingNotification = document.querySelector('.achievement-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';

        notification.innerHTML = `
            <div class="achievement-notification-header">
                <div class="achievement-notification-title">
                    <i class="icon">${achievement.icon}</i> Achievement odemčen!
                </div>
                <button class="achievement-notification-close">&times;</button>
            </div>
            <div class="achievement-notification-content">
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
                <div class="achievement-notification-reward">
                    <p>Odměna:</p>
                    <ul>
                        ${achievement.reward.xp ? `<li>${achievement.reward.xp} XP</li>` : ''}
                        ${achievement.reward.money ? `<li>${achievement.reward.money} Kč</li>` : ''}
                        ${achievement.reward.questPoints ? `<li>${achievement.reward.questPoints} bodů</li>` : ''}
                    </ul>
                </div>
                <button class="achievement-notification-details">Zobrazit všechny achievementy</button>
            </div>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = notification.querySelector('.achievement-notification-close');
        const detailsButton = notification.querySelector('.achievement-notification-details');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
        }

        if (detailsButton) {
            detailsButton.addEventListener('click', () => {
                // Zobrazení dialogu achievementů
                this.showAchievementsDialog();

                // Zavření notifikace
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
        }

        // Automatické zavření notifikace po 10 sekundách
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 500);
            }
        }, 10000);
    },

    // Zobrazení dialogu achievementů
    showAchievementsDialog() {
        // Odstranění existujícího dialogu, pokud existuje
        const existingDialog = document.querySelector('.achievements-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Získání statistik
        const completedCount = this.getCompletedCount();
        const totalCount = this.getTotalCount();
        const completionPercentage = this.getCompletionPercentage();

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'achievements-dialog';

        // Vytvoření obsahu dialogu
        dialog.innerHTML = `
            <div class="achievements-dialog-header">
                <h2>Achievementy</h2>
                <div class="achievements-stats">
                    <span class="achievements-stats-item">Dokončeno: ${completedCount}/${totalCount}</span>
                    <span class="achievements-stats-item">Postup: ${completionPercentage}%</span>
                </div>
                <button class="achievements-dialog-close">&times;</button>
            </div>
            <div class="achievements-dialog-content">
                <div class="achievements-categories">
                    ${this.categories.map(category => `
                        <div class="achievements-category-item ${category.id === this.activeCategory ? 'active' : ''}" data-category="${category.id}">
                            <span class="achievements-category-icon">${category.icon}</span>
                            <span class="achievements-category-name">${category.name}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="achievements-list">
                    ${this.getFilteredAchievements().map(achievement => this.renderAchievementItem(achievement)).join('')}
                </div>
            </div>
        `;

        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);

        // Animace zobrazení
        setTimeout(() => {
            dialog.classList.add('show');
        }, 100);

        // Přidání event listeneru pro testovací tlačítko (pouze pro demonstraci)
        setTimeout(() => {
            const achievementItems = document.querySelectorAll('.achievement-item');
            achievementItems.forEach(item => {
                item.addEventListener('dblclick', () => {
                    const achievementId = item.querySelector('.achievement-name').textContent.trim();
                    const achievement = this.achievements.find(a => a.name === achievementId);
                    if (achievement && !achievement.completed) {
                        this.completeAchievement(achievement.id);
                    }
                });
            });
        }, 500);
    },

    // Skrytí dialogu achievementů
    hideAchievementsDialog() {
        const dialog = document.querySelector('.achievements-dialog');
        if (dialog) {
            dialog.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                dialog.remove();
            }, 500);
        }
    },

    // Filtrování achievementů podle kategorie
    filterByCategory(categoryId) {
        this.activeCategory = categoryId;

        // Aktualizace aktivní kategorie v UI
        const categoryItems = document.querySelectorAll('.achievements-category-item');
        categoryItems.forEach(item => {
            if (item.dataset.category === categoryId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Aktualizace seznamu achievementů
        const achievementsList = document.querySelector('.achievements-list');
        if (achievementsList) {
            achievementsList.innerHTML = this.getFilteredAchievements().map(achievement => this.renderAchievementItem(achievement)).join('');
        }
    },

    // Získání filtrovaných achievementů podle aktivní kategorie
    getFilteredAchievements() {
        if (this.activeCategory === 'all') {
            return this.achievements;
        } else {
            return this.achievements.filter(achievement => achievement.category === this.activeCategory);
        }
    },

    // Vykreslení položky achievementu
    renderAchievementItem(achievement) {
        const progressPercent = Math.min(100, Math.round((achievement.progress / achievement.requirement) * 100));
        const statusText = achievement.completed ? 'DOKONČENO' : `POSTUP: ${progressPercent}%`;

        return `
            <div class="achievement-item ${achievement.completed ? 'completed' : ''}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-progress-container">
                        <div class="achievement-progress-bar">
                            <div class="achievement-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="achievement-progress-text">${achievement.progress}/${achievement.requirement} (${statusText})</div>
                    </div>
                    ${achievement.completed ? `
                        <div class="achievement-completed">
                            <span class="achievement-completed-icon">✓</span>
                            <span class="achievement-completed-text">Dokončeno: ${this.formatDate(achievement.dateCompleted)}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="achievement-reward">
                    <div class="achievement-reward-title">Odměna za splnění</div>
                    <ul class="achievement-reward-list">
                        ${achievement.reward.xp ? `<li>${achievement.reward.xp} XP</li>` : ''}
                        ${achievement.reward.money ? `<li>${achievement.reward.money} Kč</li>` : ''}
                        ${achievement.reward.questPoints ? `<li>${achievement.reward.questPoints} quest bodů</li>` : ''}
                    </ul>
                </div>
            </div>
        `;
    },

    // Formátování data
    formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        return date.toLocaleDateString('cs-CZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Získání počtu dokončených achievementů
    getCompletedCount() {
        return this.achievements.filter(a => a.completed).length;
    },

    // Získání celkového počtu achievementů
    getTotalCount() {
        return this.achievements.length;
    },

    // Získání procenta dokončení všech achievementů
    getCompletionPercentage() {
        return Math.round((this.getCompletedCount() / this.getTotalCount()) * 100);
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda již existuje objekt CommandsMenu
    if (typeof CommandsMenu !== 'undefined') {
        Achievements.init();
    } else {
        // Pokud ještě neexistuje, počkáme na jeho vytvoření
        document.addEventListener('commandsMenuInitialized', () => {
            Achievements.init();
        });
    }
});

// Přidání zpracování příkazu "achievementy" do existující funkce processCommand
if (typeof window.processCommand === 'function') {
    const originalProcessCommand = window.processCommand;

    window.processCommand = function(command) {
        // Kontrola, zda příkaz patří tomuto modulu
        if (command.toLowerCase() === 'achievementy') {
            // Inicializace modulu, pokud ještě nebyl inicializován
            if (!Achievements.isInitialized) {
                Achievements.init();
            }

            // Zobrazení dialogu achievementů
            Achievements.showAchievementsDialog();
            return true;
        }

        // Pokud příkaz nepatří tomuto modulu, předáme ho původní funkci
        return originalProcessCommand(command);
    };
}
