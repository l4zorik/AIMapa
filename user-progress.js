/**
 * Modul pro sledování postupu uživatele, XP a achievementů
 * Verze 0.2.8.6.3
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
    
    // Inicializace modulu
    init() {
        // Načtení uložených dat
        this.loadProgress();
        
        // Zobrazení aktuálního postupu
        this.updateProgressDisplay();
        
        // Přidání tlačítka pro zobrazení profilu
        this.addProfileButton();
        
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
            achievements: this.achievements
        };
        
        // Uložení dat do localStorage
        localStorage.setItem('userProgress', JSON.stringify(data));
    },
    
    // Přidání XP
    addExperience(amount, reason) {
        // Přidání XP
        this.experience += amount;
        
        // Kontrola, zda uživatel dosáhl nové úrovně
        this.checkLevelUp();
        
        // Uložení dat
        this.saveProgress();
        
        // Aktualizace zobrazení
        this.updateProgressDisplay();
        
        // Zobrazení informace o získání XP
        this.showXPNotification(amount, reason);
        
        console.log(`Added ${amount} XP for: ${reason}`);
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
        
        // Přidání achievementu
        this.achievements[id] = {
            title,
            description,
            date: new Date().toISOString()
        };
        
        // Uložení dat
        this.saveProgress();
        
        // Zobrazení informace o získání achievementu
        this.showAchievementNotification(title);
        
        console.log(`Achievement unlocked: ${title}`);
        
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
        
        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="user-profile-modal-content">
                <div class="user-profile-modal-header">
                    <h2>Profil uživatele</h2>
                    <button class="user-profile-modal-close">&times;</button>
                </div>
                <div class="user-profile-modal-body">
                    <div class="user-profile-info">
                        <div class="user-profile-level">Úroveň ${this.level}</div>
                        <div class="user-profile-xp-bar">
                            <div class="user-profile-xp-fill" style="width: ${(this.experience / this.nextLevelXP) * 100}%"></div>
                        </div>
                        <div class="user-profile-xp-text">${this.experience}/${this.nextLevelXP} XP</div>
                    </div>
                    
                    <h3>Achievementy</h3>
                    <div class="user-profile-achievements">
                        ${achievementsList.length > 0 ? achievementsList : '<div class="user-profile-no-achievements">Zatím nemáte žádné achievementy.</div>'}
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
            'collector': '🏆'
        };
        
        // Vrácení ikony pro daný typ achievementu nebo výchozí ikonu
        return icons[id] || '🏆';
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    UserProgress.init();
});
