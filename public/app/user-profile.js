/**
 * Modul pro zobrazení a správu uživatelského profilu
 * Verze 0.3.8.5
 */

const UserProfile = {
    // Stav modulu
    state: {
        isInitialized: false,
        isVisible: false,
        currentUser: null,
        userMetadata: null
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu uživatelského profilu...');

        // Přidání tlačítka pro zobrazení profilu
        this.addProfileButton();

        // Vytvoření modálního okna pro profil
        this.createProfileModal();

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        this.state.isInitialized = true;
        console.log('Modul uživatelského profilu byl inicializován');
    },

    // Přidání tlačítka pro zobrazení profilu
    addProfileButton() {
        // Kontrola, zda již tlačítko existuje
        if (document.getElementById('userProfileButton')) {
            return;
        }

        // Vytvoření tlačítka
        const profileButton = document.createElement('button');
        profileButton.id = 'userProfileButton';
        profileButton.className = 'user-profile-button';
        profileButton.title = 'Uživatelský profil';
        profileButton.innerHTML = '<i class="fas fa-user"></i>';

        // Přidání posluchače události
        profileButton.addEventListener('click', () => {
            this.toggleProfileModal();
        });

        // Přidání tlačítka do dokumentu
        document.body.appendChild(profileButton);
    },

    // Vytvoření modálního okna pro profil
    createProfileModal() {
        // Kontrola, zda již modální okno existuje
        if (document.getElementById('userProfileModal')) {
            return;
        }

        // Vytvoření modálního okna
        const modal = document.createElement('div');
        modal.id = 'userProfileModal';
        modal.className = 'user-profile-modal';
        modal.style.display = 'none';

        // Vytvoření obsahu modálního okna
        modal.innerHTML = `
            <div class="user-profile-content">
                <div class="user-profile-header">
                    <h2>Uživatelský profil Auth0</h2>
                    <button class="close-button" id="closeProfileModal">&times;</button>
                </div>
                <div class="user-profile-body">
                    <div class="user-profile-info">
                        <div class="user-profile-avatar">
                            <img id="userProfileAvatar" src="app/img/default-avatar.png" alt="Avatar">
                        </div>
                        <div class="user-profile-details">
                            <h3 id="userProfileName">Jméno uživatele</h3>
                            <p id="userProfileEmail">email@example.com</p>
                            <p id="userProfileId" class="user-profile-id">ID: -</p>
                        </div>
                    </div>
                    <div class="user-profile-auth-info">
                        <h4>Informace o autentizaci</h4>
                        <div class="auth-provider">
                            <span class="auth-provider-label">Poskytovatel:</span>
                            <span class="auth-provider-value">Auth0</span>
                        </div>
                        <div class="auth-status">
                            <span class="auth-status-label">Stav:</span>
                            <span class="auth-status-value auth-status-active">Aktivní</span>
                        </div>
                        <div class="auth-last-login">
                            <span class="auth-last-login-label">Poslední přihlášení:</span>
                            <span id="userProfileLastLogin" class="auth-last-login-value">-</span>
                        </div>
                    </div>
                    <div class="user-profile-metadata">
                        <h4>Uživatelská data</h4>
                        <div id="userProfileMetadata">
                            <p>Načítání dat...</p>
                        </div>
                    </div>
                    <div class="user-profile-subscription">
                        <h4>Předplatné</h4>
                        <div id="userProfileSubscription">
                            <p>Načítání informací o předplatném...</p>
                        </div>
                        <button id="manageSubscriptionButton" class="profile-action-button subscription-button">Spravovat předplatné</button>
                    </div>
                    <div class="user-profile-actions">
                        <button id="updateProfileButton" class="profile-action-button">Aktualizovat profil</button>
                        <button id="logoutButton" class="profile-action-button">Odhlásit se</button>
                    </div>
                </div>
            </div>
        `;

        // Přidání modálního okna do dokumentu
        document.body.appendChild(modal);

        // Přidání posluchačů událostí
        document.getElementById('closeProfileModal').addEventListener('click', () => {
            this.hideProfileModal();
        });

        document.getElementById('updateProfileButton').addEventListener('click', () => {
            this.updateProfile();
        });

        document.getElementById('logoutButton').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('manageSubscriptionButton').addEventListener('click', () => {
            this.manageSubscription();
        });

        // Zavření modálního okna při kliknutí mimo něj
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.hideProfileModal();
            }
        });
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        console.log('Nastavení posluchačů událostí pro UserProfile');

        // Posluchač pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            console.log('Zachycena událost authStateChanged:', event.detail);

            if (event.detail.isLoggedIn) {
                this.state.currentUser = event.detail.user;
                this.updateProfileButton(true);
                console.log('Uživatel je přihlášen, aktualizuji tlačítko profilu');
            } else {
                this.state.currentUser = null;
                this.updateProfileButton(false);
                this.hideProfileModal();
                console.log('Uživatel je odhlášen, aktualizuji tlačítko profilu');
            }
        });

        // Kontrola stavu přihlášení při inicializaci
        if (typeof Auth0Auth !== 'undefined') {
            console.log('Kontrola stavu přihlášení přes Auth0');

            // Pokud je uživatel přihlášen přes Auth0, aktualizujeme tlačítko
            if (Auth0Auth.state.isLoggedIn && Auth0Auth.state.currentUser) {
                console.log('Uživatel je přihlášen přes Auth0, aktualizuji tlačítko profilu');
                this.state.currentUser = Auth0Auth.state.currentUser;
                this.updateProfileButton(true);
            }

            // Přidání posluchače pro kliknutí na Auth0 tlačítko
            const auth0Button = document.getElementById('auth0AuthButton');
            if (auth0Button) {
                console.log('Přidávám posluchač události pro Auth0 tlačítko');

                auth0Button.addEventListener('click', () => {
                    console.log('Kliknuto na Auth0 tlačítko');

                    // Pokud je uživatel přihlášen, zobrazíme profil
                    if (Auth0Auth.state.isLoggedIn) {
                        console.log('Uživatel je přihlášen, zobrazuji profil');
                        this.toggleProfileModal();
                    }
                });
            }
        }
    },

    // Aktualizace tlačítka profilu
    updateProfileButton(isLoggedIn) {
        console.log('Aktualizace tlačítka profilu, stav přihlášení:', isLoggedIn);

        const profileButton = document.getElementById('userProfileButton');
        if (!profileButton) {
            console.error('Tlačítko profilu nebylo nalezeno');
            return;
        }

        if (isLoggedIn) {
            profileButton.classList.add('logged-in');
            profileButton.title = 'Zobrazit uživatelský profil (přihlášen přes Auth0)';
            profileButton.innerHTML = '<i class="fas fa-user-check"></i>';

            // Přidání textu "Přihlášen" vedle tlačítka
            if (!document.getElementById('profile-login-status')) {
                const statusIndicator = document.createElement('div');
                statusIndicator.id = 'profile-login-status';
                statusIndicator.className = 'profile-login-status';
                statusIndicator.textContent = 'Přihlášen';

                // Vložení indikátoru vedle tlačítka
                profileButton.parentNode.insertBefore(statusIndicator, profileButton.nextSibling);

                // Přidání stylu pro indikátor
                const style = document.createElement('style');
                style.textContent = `
                    .profile-login-status {
                        position: fixed;
                        top: 65px;
                        right: 170px;
                        background-color: #4CAF50;
                        color: white;
                        padding: 3px 8px;
                        border-radius: 10px;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 899;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            profileButton.classList.remove('logged-in');
            profileButton.title = 'Přihlaste se pro zobrazení profilu';
            profileButton.innerHTML = '<i class="fas fa-user"></i>';

            // Odstranění textu "Přihlášen" pokud existuje
            const statusIndicator = document.getElementById('profile-login-status');
            if (statusIndicator) {
                statusIndicator.remove();
            }
        }
    },

    // Zobrazení/skrytí modálního okna profilu
    toggleProfileModal() {
        console.log('Přepínání modálního okna profilu');

        // Kontrola, zda je uživatel přihlášen přes Auth0
        if (typeof Auth0Auth !== 'undefined' && Auth0Auth.state.isLoggedIn) {
            console.log('Uživatel je přihlášen přes Auth0, zobrazuji profil');
            this.state.currentUser = Auth0Auth.state.currentUser;
        } else if (!this.state.currentUser) {
            console.log('Uživatel není přihlášen, zobrazuji přihlašovací obrazovku');
            // Pokud uživatel není přihlášen, zobrazíme přihlašovací obrazovku
            if (typeof AuthScreen !== 'undefined') {
                AuthScreen.showAuthScreen();
            } else if (typeof Auth0Auth !== 'undefined') {
                // Pokud není dostupný AuthScreen, použijeme přímé přihlášení přes Auth0
                Auth0Auth.login();
            }
            return;
        }

        const modal = document.getElementById('userProfileModal');
        if (!modal) {
            console.error('Modální okno profilu nebylo nalezeno, vytvářím nové');
            this.createProfileModal();
            const newModal = document.getElementById('userProfileModal');
            if (!newModal) {
                console.error('Nepodařilo se vytvořit modální okno profilu');
                return;
            }

            if (this.state.isVisible) {
                this.hideProfileModal();
            } else {
                this.showProfileModal();
            }
        } else {
            if (this.state.isVisible) {
                this.hideProfileModal();
            } else {
                this.showProfileModal();
            }
        }
    },

    // Zobrazení modálního okna profilu
    async showProfileModal() {
        const modal = document.getElementById('userProfileModal');
        if (!modal) return;

        // Aktualizace dat profilu
        await this.loadUserProfile();

        // Zobrazení modálního okna
        modal.style.display = 'flex';
        this.state.isVisible = true;
    },

    // Skrytí modálního okna profilu
    hideProfileModal() {
        const modal = document.getElementById('userProfileModal');
        if (!modal) return;

        modal.style.display = 'none';
        this.state.isVisible = false;
    },

    // Načtení dat uživatelského profilu
    async loadUserProfile() {
        console.log('Načítání dat uživatelského profilu');

        // Kontrola, zda je uživatel přihlášen přes Auth0
        if (typeof Auth0Auth !== 'undefined' && Auth0Auth.state.isLoggedIn) {
            console.log('Uživatel je přihlášen přes Auth0, používám Auth0 data');
            this.state.currentUser = Auth0Auth.state.currentUser;
        }

        if (!this.state.currentUser) {
            console.error('Nelze načíst profil: Uživatel není přihlášen');
            return;
        }

        console.log('Aktualizace základních informací profilu pro uživatele:', this.state.currentUser);

        // Aktualizace základních informací
        const nameElement = document.getElementById('userProfileName');
        const emailElement = document.getElementById('userProfileEmail');
        const avatarElement = document.getElementById('userProfileAvatar');
        const idElement = document.getElementById('userProfileId');
        const lastLoginElement = document.getElementById('userProfileLastLogin');

        if (nameElement) {
            nameElement.textContent = this.state.currentUser.name || this.state.currentUser.nickname || 'Uživatel';
        }

        if (emailElement) {
            emailElement.textContent = this.state.currentUser.email || '';
        }

        // Aktualizace ID uživatele
        if (idElement && this.state.currentUser.sub) {
            idElement.textContent = `ID: ${this.state.currentUser.sub}`;
        }

        // Aktualizace času posledního přihlášení
        if (lastLoginElement && this.state.currentUser.updated_at) {
            const lastLoginDate = new Date(this.state.currentUser.updated_at);
            lastLoginElement.textContent = lastLoginDate.toLocaleString('cs-CZ');
        }

        // Aktualizace avataru
        if (avatarElement && this.state.currentUser.picture) {
            avatarElement.src = this.state.currentUser.picture;
        }

        // Přidání informace o poskytovateli autentizace
        const metadataContainer = document.getElementById('userProfileMetadata');
        if (metadataContainer) {
            // Zobrazení všech dostupných informací o uživateli
            let metadataHtml = '<div class="metadata-list">';

            // Procházení všech vlastností uživatelského objektu
            for (const [key, value] of Object.entries(this.state.currentUser)) {
                // Přeskočení již zobrazených vlastností
                if (['name', 'email', 'picture', 'sub', 'updated_at'].includes(key)) continue;

                // Přeskočení prázdných hodnot
                if (value === null || value === undefined || value === '') continue;

                // Formátování hodnoty
                let formattedValue = value;
                if (typeof value === 'object') {
                    formattedValue = JSON.stringify(value);
                } else if (key.includes('date') || key.includes('time') || key.includes('at')) {
                    // Pokus o formátování data
                    try {
                        formattedValue = new Date(value).toLocaleString('cs-CZ');
                    } catch (e) {
                        // Ponecháme původní hodnotu
                    }
                }

                metadataHtml += `<div class="metadata-item">
                    <span class="metadata-key">${key}:</span>
                    <span class="metadata-value">${formattedValue}</span>
                </div>`;
            }

            metadataHtml += '</div>';
            metadataContainer.innerHTML = metadataHtml;

            // Načtení uživatelských metadat z Auth0
            if (typeof Auth0Auth !== 'undefined' && typeof Auth0Auth.getUserInfo === 'function') {
                try {
                    console.log('Načítání rozšířených dat z Auth0');

                    // Získání informací o uživateli z Auth0 API
                    const result = await Auth0Auth.getUserInfo();

                    if (result && !result.error) {
                        console.log('Úspěšně načtena rozšířená data z Auth0:', result.data);

                        // Uložení metadat
                        this.state.userMetadata = result.data?.user_metadata || {};

                        // Zobrazení metadat
                        if (Object.keys(this.state.userMetadata).length > 0) {
                            let userMetadataHtml = '<h5>Uživatelská metadata:</h5><div class="metadata-list">';

                            for (const [key, value] of Object.entries(this.state.userMetadata)) {
                                // Přeskočení předplatného, které zobrazujeme zvlášť
                                if (key === 'subscription') continue;

                                userMetadataHtml += `<div class="metadata-item">
                                    <span class="metadata-key">${key}:</span>
                                    <span class="metadata-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
                                </div>`;
                            }

                            userMetadataHtml += '</div>';
                            metadataContainer.innerHTML += userMetadataHtml;
                        }

                        // Načtení informací o předplatném
                        this.loadSubscriptionInfo(result.data);
                    }
                } catch (error) {
                    console.error('Chyba při načítání uživatelských metadat:', error);
                }
            }
        } else {
            console.error('Kontejner pro metadata nebyl nalezen');
        }

        // Aktualizace informací o předplatném
        const subscriptionContainer = document.getElementById('userProfileSubscription');
        if (subscriptionContainer) {
            // Základní informace o předplatném
            subscriptionContainer.innerHTML = `
                <div class="subscription-info">
                    <p>Používáte základní verzi aplikace.</p>
                    <p>Přihlášeni přes Auth0.</p>
                </div>
            `;
        }
    },

    // Načtení informací o předplatném
    loadSubscriptionInfo(userData) {
        const subscriptionContainer = document.getElementById('userProfileSubscription');
        if (!subscriptionContainer) return;

        try {
            // Získání informací o předplatném z metadat uživatele
            const subscription = userData && userData.user_metadata && userData.user_metadata.subscription;

            if (!subscription) {
                // Pokud uživatel nemá předplatné, zobrazíme základní informace
                subscriptionContainer.innerHTML = `
                    <div class="subscription-info">
                        <p>Nemáte aktivní předplatné. Používáte základní verzi zdarma.</p>
                        <p>Pro přístup k pokročilým funkcím si můžete zakoupit předplatné.</p>
                    </div>
                `;
                return;
            }

            // Získání informací o plánu
            let planName = 'Neznámý plán';
            let planPrice = '';
            let planFeatures = [];

            // Pokud je dostupný modul předplatného, získáme z něj informace o plánu
            if (typeof SubscriptionService !== 'undefined' && SubscriptionService.config.plans[subscription.plan]) {
                const plan = SubscriptionService.config.plans[subscription.plan];
                planName = plan.name;
                planPrice = `${plan.price} ${plan.currency}/${plan.interval}`;
                planFeatures = plan.features;
            } else {
                // Jinak použijeme základní informace z předplatného
                planName = subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1);
                if (subscription.plan !== 'free') {
                    planPrice = 'Placený plán';
                }
            }

            // Formátování data konce předplatného
            let endDate = 'Neomezeno';
            if (subscription.endDate) {
                const date = new Date(subscription.endDate);
                endDate = date.toLocaleDateString('cs-CZ');
            }

            // Vytvoření HTML pro zobrazení předplatného
            let subscriptionHtml = `
                <div class="subscription-info">
                    <div class="subscription-header">
                        <span class="subscription-plan-name">${planName}</span>
                        ${planPrice ? `<span class="subscription-plan-price">${planPrice}</span>` : ''}
                    </div>
                    <div class="subscription-details">
                        <p>Aktivní do: ${endDate}</p>
                        <p>Automatické obnovení: ${subscription.autoRenew ? 'Ano' : 'Ne'}</p>
                    </div>
            `;

            // Přidání funkcí plánu, pokud jsou dostupné
            if (planFeatures && planFeatures.length > 0) {
                subscriptionHtml += `
                    <div class="subscription-features">
                        <h5>Funkce plánu:</h5>
                        <ul>
                            ${planFeatures.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            subscriptionHtml += '</div>';

            // Nastavení HTML do kontejneru
            subscriptionContainer.innerHTML = subscriptionHtml;

        } catch (error) {
            console.error('Chyba při načítání informací o předplatném:', error);
            subscriptionContainer.innerHTML = '<p>Nepodařilo se načíst informace o předplatném</p>';
        }
    },

    // Aktualizace profilu
    async updateProfile() {
        if (!this.state.currentUser) return;

        // Zde by bylo možné implementovat formulář pro aktualizaci profilu
        // Pro jednoduchost pouze zobrazíme zprávu
        alert('Funkce pro aktualizaci profilu bude implementována v další verzi.');
    },

    // Správa předplatného
    manageSubscription() {
        // Skrytí modálního okna profilu
        this.hideProfileModal();

        // Zobrazení modálního okna předplatného
        if (typeof SubscriptionService !== 'undefined' && typeof SubscriptionService.showSubscriptionModal === 'function') {
            setTimeout(() => {
                SubscriptionService.showSubscriptionModal();
            }, 300); // Krátké zpoždění pro lepší UX
        } else {
            alert('Modul pro správu předplatného není dostupný.');
        }
    },

    // Odhlášení uživatele
    async logout() {
        // Kontrola, zda je dostupný Auth0Auth
        if (typeof Auth0Auth !== 'undefined') {
            await Auth0Auth.logout();
        } else if (typeof HybridAuth !== 'undefined') {
            await HybridAuth.logout();
        } else if (typeof SupabaseAuth !== 'undefined') {
            await SupabaseAuth.logout();
        } else if (typeof LocalAuth !== 'undefined') {
            await LocalAuth.logout();
        } else if (typeof UserAccounts !== 'undefined') {
            await UserAccounts.logout();
        }

        // Skrytí modálního okna
        this.hideProfileModal();
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace modulu
    UserProfile.init();
});
