/**
 * Uživatelské profily a personalizace pro verzi 0.2.9.0
 * Implementace uživatelských profilů, ukládání oblíbených míst a tras
 */

// Objekt pro správu uživatelských profilů
const UserProfiles = {
    // Aktuální uživatel
    currentUser: null,
    
    // Inicializace uživatelských profilů
    init() {
        this.loadUserProfile();
        this.setupProfileUI();
        this.setupEventListeners();
    },
    
    // Načtení uživatelského profilu
    loadUserProfile() {
        const savedProfile = localStorage.getItem('aiMapaUserProfile');
        
        if (savedProfile) {
            this.currentUser = JSON.parse(savedProfile);
        } else {
            // Vytvoření výchozího profilu
            this.currentUser = {
                username: 'Host',
                email: '',
                avatar: '',
                theme: 'dark',
                mapSettings: {
                    defaultView: {
                        lat: 50.0755,
                        lng: 14.4378,
                        zoom: 13
                    },
                    preferredBaseLayer: 'OpenStreetMap',
                    showOverlays: []
                },
                favorites: {
                    places: [],
                    routes: []
                },
                history: {
                    places: [],
                    routes: []
                },
                achievements: []
            };
            
            this.saveUserProfile();
        }
    },
    
    // Uložení uživatelského profilu
    saveUserProfile() {
        localStorage.setItem('aiMapaUserProfile', JSON.stringify(this.currentUser));
    },
    
    // Nastavení uživatelského rozhraní profilu
    setupProfileUI() {
        // TODO: Implementace uživatelského rozhraní profilu
    },
    
    // Nastavení posluchačů událostí
    setupEventListeners() {
        // TODO: Implementace posluchačů událostí
    },
    
    // Přidání oblíbeného místa
    addFavoritePlace(place) {
        this.currentUser.favorites.places.push(place);
        this.saveUserProfile();
    },
    
    // Přidání oblíbené trasy
    addFavoriteRoute(route) {
        this.currentUser.favorites.routes.push(route);
        this.saveUserProfile();
    },
    
    // Přidání místa do historie
    addPlaceToHistory(place) {
        this.currentUser.history.places.unshift(place);
        
        // Omezení počtu míst v historii
        if (this.currentUser.history.places.length > 20) {
            this.currentUser.history.places.pop();
        }
        
        this.saveUserProfile();
    },
    
    // Přidání trasy do historie
    addRouteToHistory(route) {
        this.currentUser.history.routes.unshift(route);
        
        // Omezení počtu tras v historii
        if (this.currentUser.history.routes.length > 10) {
            this.currentUser.history.routes.pop();
        }
        
        this.saveUserProfile();
    },
    
    // Přidání úspěchu
    addAchievement(achievement) {
        // Kontrola, zda úspěch již existuje
        if (!this.currentUser.achievements.some(a => a.id === achievement.id)) {
            this.currentUser.achievements.push(achievement);
            this.saveUserProfile();
            
            // Zobrazení oznámení o novém úspěchu
            this.showAchievementNotification(achievement);
        }
    },
    
    // Zobrazení oznámení o novém úspěchu
    showAchievementNotification(achievement) {
        // TODO: Implementace oznámení o novém úspěchu
    },
    
    // Aktualizace nastavení mapy
    updateMapSettings(settings) {
        this.currentUser.mapSettings = {
            ...this.currentUser.mapSettings,
            ...settings
        };
        
        this.saveUserProfile();
    },
    
    // Změna tématu
    changeTheme(theme) {
        this.currentUser.theme = theme;
        this.saveUserProfile();
        
        // Aplikace tématu
        document.body.className = theme === 'dark' ? 'dark-mode' : '';
    },
    
    // Export uživatelských dat
    exportUserData() {
        const dataStr = JSON.stringify(this.currentUser, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'aimapa-user-data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    },
    
    // Import uživatelských dat
    importUserData(jsonData) {
        try {
            const userData = JSON.parse(jsonData);
            
            // Kontrola, zda data obsahují potřebné vlastnosti
            if (userData.username && userData.mapSettings && userData.favorites) {
                this.currentUser = userData;
                this.saveUserProfile();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Chyba při importu uživatelských dat:', error);
            return false;
        }
    }
};

// Inicializace uživatelských profilů po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    UserProfiles.init();
});

// Export objektu pro použití v jiných souborech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserProfiles;
}
