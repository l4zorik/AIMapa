# Vylepšení uživatelského profilu - Část 1: Základní struktura

Tento dokument popisuje první část implementace vylepšeného uživatelského profilu v aplikaci AIMapa pro verzi 0.3.8.2.

## Přehled změn

Vylepšený uživatelský profil bude obsahovat:

1. Modernější a přehlednější design
2. Více informací o uživateli a jeho aktivitách
3. Detailnější statistiky a grafy
4. Lepší organizaci dat pomocí záložek
5. Možnost přizpůsobení profilu

## Základní struktura HTML

```html
<div id="userProfileContainer" class="user-profile-container">
    <div class="user-profile-header">
        <div class="user-profile-avatar-container">
            <img id="userProfileAvatar" src="app/images/default-avatar.png" alt="Avatar" class="user-profile-avatar">
            <div class="user-profile-level">5</div>
            <div class="user-profile-avatar-change">
                <i class="fas fa-camera"></i>
            </div>
        </div>
        
        <div class="user-profile-info">
            <h2 id="userProfileName" class="user-profile-name">Uživatel</h2>
            <div class="user-profile-xp-container">
                <div class="user-profile-xp-bar">
                    <div class="user-profile-xp-fill" style="width: 45%"></div>
                </div>
                <div class="user-profile-xp-text">450 / 1000 XP</div>
            </div>
            <div class="user-profile-stats-summary">
                <div class="user-profile-stat">
                    <i class="fas fa-coins"></i>
                    <span>1250 Kč</span>
                </div>
                <div class="user-profile-stat">
                    <i class="fas fa-bitcoin"></i>
                    <span>0.05 BTC</span>
                </div>
                <div class="user-profile-stat">
                    <i class="fas fa-trophy"></i>
                    <span>12 achievementů</span>
                </div>
            </div>
        </div>
        
        <button class="user-profile-close">&times;</button>
    </div>
    
    <div class="user-profile-tabs">
        <button class="user-profile-tab active" data-tab="overview">Přehled</button>
        <button class="user-profile-tab" data-tab="statistics">Statistiky</button>
        <button class="user-profile-tab" data-tab="achievements">Achievementy</button>
        <button class="user-profile-tab" data-tab="history">Historie</button>
        <button class="user-profile-tab" data-tab="settings">Nastavení</button>
    </div>
    
    <div class="user-profile-content">
        <!-- Obsah záložek bude dynamicky generován -->
        <div class="user-profile-tab-content active" data-tab-content="overview">
            <!-- Obsah záložky Přehled -->
        </div>
        
        <div class="user-profile-tab-content" data-tab-content="statistics">
            <!-- Obsah záložky Statistiky -->
        </div>
        
        <div class="user-profile-tab-content" data-tab-content="achievements">
            <!-- Obsah záložky Achievementy -->
        </div>
        
        <div class="user-profile-tab-content" data-tab-content="history">
            <!-- Obsah záložky Historie -->
        </div>
        
        <div class="user-profile-tab-content" data-tab-content="settings">
            <!-- Obsah záložky Nastavení -->
        </div>
    </div>
</div>
```

## Základní CSS styly

```css
/* Základní styly pro uživatelský profil */
.user-profile-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Hlavička profilu */
.user-profile-header {
    display: flex;
    padding: 20px;
    background: linear-gradient(135deg, #4a80f5, #9370DB);
    color: white;
    position: relative;
}

.user-profile-avatar-container {
    position: relative;
    margin-right: 20px;
}

.user-profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid white;
    object-fit: cover;
    background-color: #f0f0f0;
}

.user-profile-level {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 30px;
    height: 30px;
    background-color: #FFD700;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border: 2px solid white;
}

.user-profile-avatar-change {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
    cursor: pointer;
}

.user-profile-avatar-change:hover {
    opacity: 1;
}

.user-profile-info {
    flex: 1;
}

.user-profile-name {
    margin: 0 0 10px 0;
    font-size: 1.8rem;
}

.user-profile-xp-container {
    margin-bottom: 15px;
}

.user-profile-xp-bar {
    height: 10px;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 5px;
}

.user-profile-xp-fill {
    height: 100%;
    background-color: #FFD700;
    border-radius: 5px;
}

.user-profile-xp-text {
    font-size: 0.9rem;
    text-align: right;
}

.user-profile-stats-summary {
    display: flex;
    gap: 15px;
}

.user-profile-stat {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
}

.user-profile-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

/* Záložky */
.user-profile-tabs {
    display: flex;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.user-profile-tab {
    padding: 15px 20px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    flex: 1;
    text-align: center;
}

.user-profile-tab:hover {
    background-color: #e9e9e9;
}

.user-profile-tab.active {
    border-bottom-color: #4a80f5;
    color: #4a80f5;
}

/* Obsah záložek */
.user-profile-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.user-profile-tab-content {
    display: none;
}

.user-profile-tab-content.active {
    display: block;
}

/* Tmavý režim */
[data-theme="dark"] .user-profile-container {
    background-color: #1F2937;
    color: white;
}

[data-theme="dark"] .user-profile-tabs {
    background-color: #111827;
    border-bottom-color: #374151;
}

[data-theme="dark"] .user-profile-tab {
    color: #e5e7eb;
}

[data-theme="dark"] .user-profile-tab:hover {
    background-color: #374151;
}

[data-theme="dark"] .user-profile-tab.active {
    color: #60a5fa;
    border-bottom-color: #60a5fa;
}
```

## Základní JavaScript pro ovládání profilu

```javascript
/**
 * Modul pro správu uživatelského profilu
 */
const UserProfileManager = {
    // Stav modulu
    state: {
        isInitialized: false,
        isVisible: false,
        activeTab: 'overview'
    },
    
    // Inicializace modulu
    init() {
        if (this.state.isInitialized) return;
        
        console.log('Inicializace modulu uživatelského profilu...');
        
        // Vytvoření HTML struktury
        this.createProfileHTML();
        
        // Přidání event listenerů
        this.setupEventListeners();
        
        // Načtení dat uživatele
        this.loadUserData();
        
        this.state.isInitialized = true;
        console.log('Modul uživatelského profilu byl inicializován');
    },
    
    // Vytvoření HTML struktury profilu
    createProfileHTML() {
        // Implementace vytvoření HTML struktury profilu
        // (Použití HTML struktury definované výše)
    },
    
    // Přidání event listenerů
    setupEventListeners() {
        const container = document.getElementById('userProfileContainer');
        if (!container) return;
        
        // Event listener pro zavření profilu
        container.querySelector('.user-profile-close').addEventListener('click', () => {
            this.hideProfile();
        });
        
        // Event listenery pro záložky
        container.querySelectorAll('.user-profile-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Event listener pro změnu avataru
        container.querySelector('.user-profile-avatar-change').addEventListener('click', () => {
            this.changeAvatar();
        });
    },
    
    // Načtení dat uživatele
    loadUserData() {
        // Implementace načtení dat uživatele
        // (Načtení dat z localStorage nebo z API)
    },
    
    // Zobrazení profilu
    showProfile() {
        const container = document.getElementById('userProfileContainer');
        if (!container) return;
        
        container.style.display = 'flex';
        this.state.isVisible = true;
        
        // Aktualizace dat profilu
        this.updateProfileData();
    },
    
    // Skrytí profilu
    hideProfile() {
        const container = document.getElementById('userProfileContainer');
        if (!container) return;
        
        container.style.display = 'none';
        this.state.isVisible = false;
    },
    
    // Přepnutí záložky
    switchTab(tabId) {
        const container = document.getElementById('userProfileContainer');
        if (!container) return;
        
        // Deaktivace všech záložek
        container.querySelectorAll('.user-profile-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Aktivace vybrané záložky
        container.querySelector(`.user-profile-tab[data-tab="${tabId}"]`).classList.add('active');
        
        // Deaktivace všech obsahů záložek
        container.querySelectorAll('.user-profile-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Aktivace obsahu vybrané záložky
        container.querySelector(`.user-profile-tab-content[data-tab-content="${tabId}"]`).classList.add('active');
        
        // Aktualizace stavu
        this.state.activeTab = tabId;
        
        // Aktualizace obsahu záložky
        this.updateTabContent(tabId);
    },
    
    // Aktualizace obsahu záložky
    updateTabContent(tabId) {
        // Implementace aktualizace obsahu záložky podle ID
    },
    
    // Aktualizace dat profilu
    updateProfileData() {
        // Implementace aktualizace dat profilu
    },
    
    // Změna avataru
    changeAvatar() {
        // Implementace změny avataru
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    UserProfileManager.init();
});
```

## Další kroky implementace

V dalších částech implementace se zaměříme na:

1. **Část 2**: Implementace záložky "Přehled" s detailními informacemi o uživateli
2. **Část 3**: Implementace záložky "Statistiky" s grafy a detailními statistikami
3. **Část 4**: Implementace záložky "Achievementy" s přehledem získaných a dostupných achievementů
4. **Část 5**: Implementace záložek "Historie" a "Nastavení" pro kompletní funkcionalitu profilu

---

*Poslední aktualizace: 2025-07-08*
