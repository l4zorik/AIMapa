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
                    <h2>Uživatelský profil</h2>
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
        // Posluchač pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            if (event.detail.isLoggedIn) {
                this.state.currentUser = event.detail.user;
                this.updateProfileButton(true);
            } else {
                this.state.currentUser = null;
                this.updateProfileButton(false);
                this.hideProfileModal();
            }
        });
    },

    // Aktualizace tlačítka profilu
    updateProfileButton(isLoggedIn) {
        const profileButton = document.getElementById('userProfileButton');
        if (!profileButton) return;

        if (isLoggedIn) {
            profileButton.classList.add('logged-in');
            profileButton.title = 'Zobrazit uživatelský profil';
        } else {
            profileButton.classList.remove('logged-in');
            profileButton.title = 'Přihlaste se pro zobrazení profilu';
        }
    },

    // Zobrazení/skrytí modálního okna profilu
    toggleProfileModal() {
        if (!this.state.currentUser) {
            // Pokud uživatel není přihlášen, zobrazíme přihlašovací obrazovku
            if (typeof AuthScreen !== 'undefined') {
                AuthScreen.showAuthScreen();
            }
            return;
        }

        const modal = document.getElementById('userProfileModal');
        if (!modal) return;

        if (this.state.isVisible) {
            this.hideProfileModal();
        } else {
            this.showProfileModal();
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
        if (!this.state.currentUser) return;

        // Aktualizace základních informací
        document.getElementById('userProfileName').textContent = this.state.currentUser.name || this.state.currentUser.nickname || 'Uživatel';
        document.getElementById('userProfileEmail').textContent = this.state.currentUser.email || '';

        // Aktualizace avataru
        if (this.state.currentUser.picture) {
            document.getElementById('userProfileAvatar').src = this.state.currentUser.picture;
        }

        // Načtení uživatelských metadat z Auth0
        if (typeof Auth0Auth !== 'undefined') {
            try {
                const metadataContainer = document.getElementById('userProfileMetadata');
                metadataContainer.innerHTML = '<p>Načítání dat...</p>';

                // Získání informací o uživateli z Auth0 API
                const result = await Auth0Auth.getUserInfo();

                if (result.error) {
                    console.error('Chyba při načítání uživatelských metadat:', result.error);
                    metadataContainer.innerHTML = '<p>Nepodařilo se načíst uživatelská data</p>';
                    return;
                }

                // Uložení metadat
                this.state.userMetadata = result.data.user_metadata || {};

                // Zobrazení metadat
                if (Object.keys(this.state.userMetadata).length === 0) {
                    metadataContainer.innerHTML = '<p>Žádná uživatelská data</p>';
                } else {
                    let metadataHtml = '';
                    for (const [key, value] of Object.entries(this.state.userMetadata)) {
                        // Přeskočení předplatného, které zobrazujeme zvlášť
                        if (key === 'subscription') continue;

                        metadataHtml += `<div class="metadata-item">
                            <span class="metadata-key">${key}:</span>
                            <span class="metadata-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
                        </div>`;
                    }

                    if (metadataHtml === '') {
                        metadataContainer.innerHTML = '<p>Žádná uživatelská data</p>';
                    } else {
                        metadataContainer.innerHTML = metadataHtml;
                    }
                }

                // Načtení informací o předplatném
                this.loadSubscriptionInfo(result.data);

            } catch (error) {
                console.error('Chyba při načítání uživatelských metadat:', error);
                document.getElementById('userProfileMetadata').innerHTML = '<p>Nepodařilo se načíst uživatelská data</p>';
            }
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
