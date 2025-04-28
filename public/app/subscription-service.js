/**
 * Modul pro správu předplatného v AIMapa
 * Verze 0.3.8.5
 */

const SubscriptionService = {
    // Stav modulu
    state: {
        isInitialized: false,
        currentPlan: 'free', // free, basic, premium, ultimate
        subscriptionData: null,
        subscriptionWindowShown: false,
        paymentProcessing: false
    },

    // Konfigurace
    config: {
        plans: {
            free: {
                id: 'free',
                name: 'Zdarma',
                price: 0,
                currency: 'CZK',
                interval: 'měsíčně',
                features: [
                    'Základní funkce mapy',
                    'Omezený počet bodů na mapě (10)',
                    'Základní virtuální práce',
                    'Základní statistiky'
                ],
                limits: {
                    mapPoints: 10,
                    virtualWorkProjects: 3,
                    cryptoAccess: false,
                    customThemes: false,
                    aiAssistant: false
                }
            },
            basic: {
                id: 'basic',
                name: 'Základní',
                price: 99,
                currency: 'CZK',
                interval: 'měsíčně',
                features: [
                    'Neomezený počet bodů na mapě',
                    'Rozšířená virtuální práce',
                    'Základní kryptoměny',
                    'Detailní statistiky',
                    'Bez reklam'
                ],
                limits: {
                    mapPoints: 100,
                    virtualWorkProjects: 10,
                    cryptoAccess: true,
                    customThemes: false,
                    aiAssistant: false
                }
            },
            premium: {
                id: 'premium',
                name: 'Premium',
                price: 199,
                currency: 'CZK',
                interval: 'měsíčně',
                features: [
                    'Všechny funkce Základního plánu',
                    'Pokročilé statistiky a grafy',
                    'Vlastní motivy a barvy',
                    'Prioritní podpora',
                    'Rozšířené kryptoměny'
                ],
                limits: {
                    mapPoints: 500,
                    virtualWorkProjects: 50,
                    cryptoAccess: true,
                    customThemes: true,
                    aiAssistant: false
                }
            },
            ultimate: {
                id: 'ultimate',
                name: 'Ultimate',
                price: 399,
                currency: 'CZK',
                interval: 'měsíčně',
                features: [
                    'Všechny funkce Premium plánu',
                    'Neomezené body na mapě',
                    'Neomezené projekty virtuální práce',
                    'AI asistent pro plánování',
                    'Přednostní přístup k novým funkcím',
                    'VIP podpora'
                ],
                limits: {
                    mapPoints: Infinity,
                    virtualWorkProjects: Infinity,
                    cryptoAccess: true,
                    customThemes: true,
                    aiAssistant: true
                }
            }
        },

        // Nastavení Auth0
        auth0: {
            domain: 'dev-zxj8pir0moo4pdk7.us.auth0.com',
            clientId: 'Yd9Hn9RxJXQJcwRqPiXqZbCm5FNzYmJZ',
            audience: 'https://dev-zxj8pir0moo4pdk7.us.auth0.com/api/v2/'
        }
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu předplatného...');

        // Přidání tlačítka pro zobrazení předplatného
        this.addSubscriptionButton();

        // Vytvoření modálního okna pro předplatné
        this.createSubscriptionModal();

        // Nastavení posluchačů událostí
        this.setupEventListeners();

        // Načtení stavu předplatného
        this.loadSubscriptionState();

        this.state.isInitialized = true;
        console.log('Modul předplatného byl inicializován');
    },

    // Přidání tlačítka pro zobrazení předplatného
    addSubscriptionButton() {
        // Kontrola, zda již tlačítko existuje
        if (document.getElementById('subscriptionButton')) {
            return;
        }

        // Vytvoření tlačítka
        const subscriptionButton = document.createElement('button');
        subscriptionButton.id = 'subscriptionButton';
        subscriptionButton.className = 'subscription-button';
        subscriptionButton.title = 'Předplatné';
        subscriptionButton.innerHTML = '<i class="fas fa-crown"></i>';

        // Přidání posluchače události
        subscriptionButton.addEventListener('click', () => {
            this.toggleSubscriptionModal();
        });

        // Přidání tlačítka do dokumentu
        document.body.appendChild(subscriptionButton);
    },

    // Vytvoření modálního okna pro předplatné
    createSubscriptionModal() {
        // Kontrola, zda již modální okno existuje
        if (document.getElementById('subscriptionModal')) {
            return;
        }

        // Vytvoření modálního okna
        const modal = document.createElement('div');
        modal.id = 'subscriptionModal';
        modal.className = 'subscription-modal';
        modal.style.display = 'none';

        // Vytvoření obsahu modálního okna
        modal.innerHTML = `
            <div class="subscription-content">
                <div class="subscription-header">
                    <h2>Předplatné AIMapa</h2>
                    <button class="close-button" id="closeSubscriptionModal">&times;</button>
                </div>
                <div class="subscription-body">
                    <div class="subscription-info">
                        <p>Vyberte si plán, který vám vyhovuje:</p>
                    </div>
                    <div class="subscription-plans" id="subscriptionPlans">
                        <!-- Plány předplatného budou vloženy dynamicky -->
                    </div>
                    <div class="subscription-current" id="currentSubscription">
                        <!-- Aktuální předplatné bude vloženo dynamicky -->
                    </div>
                    <div class="subscription-payment" id="paymentSection" style="display: none;">
                        <h3>Platební údaje</h3>
                        <form id="paymentForm">
                            <div class="form-group">
                                <label for="cardNumber">Číslo karty</label>
                                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cardExpiry">Platnost (MM/RR)</label>
                                    <input type="text" id="cardExpiry" placeholder="MM/RR" maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label for="cardCvc">CVC</label>
                                    <input type="text" id="cardCvc" placeholder="123" maxlength="3">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="cardName">Jméno na kartě</label>
                                <input type="text" id="cardName" placeholder="Jan Novák">
                            </div>
                            <div class="form-actions">
                                <button type="button" id="cancelPayment" class="cancel-button">Zrušit</button>
                                <button type="button" id="processPayment" class="payment-button">Zaplatit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Přidání modálního okna do dokumentu
        document.body.appendChild(modal);

        // Přidání posluchačů událostí
        document.getElementById('closeSubscriptionModal').addEventListener('click', () => {
            this.hideSubscriptionModal();
        });

        document.getElementById('cancelPayment').addEventListener('click', () => {
            this.hidePaymentSection();
        });

        document.getElementById('processPayment').addEventListener('click', () => {
            this.processPayment();
        });

        // Zavření modálního okna při kliknutí mimo něj
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                this.hideSubscriptionModal();
            }
        });

        // Formátování vstupu pro číslo karty
        const cardNumberInput = document.getElementById('cardNumber');
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });

        // Formátování vstupu pro platnost karty
        const cardExpiryInput = document.getElementById('cardExpiry');
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // Formátování vstupu pro CVC
        const cardCvcInput = document.getElementById('cardCvc');
        cardCvcInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Posluchač pro změnu stavu přihlášení
        document.addEventListener('authStateChanged', (event) => {
            if (event.detail.isLoggedIn) {
                // Načtení předplatného uživatele
                this.loadUserSubscription(event.detail.user);
            } else {
                // Reset předplatného
                this.resetSubscription();
            }
        });

        // Posluchač pro načtení kompletních dat uživatele z Auth0
        document.addEventListener('auth0UserDataLoaded', (event) => {
            if (event.detail.user) {
                // Načtení předplatného z kompletních dat uživatele
                this.loadUserSubscriptionFromMetadata(event.detail.user);
            }
        });
    },

    // Načtení stavu předplatného
    loadSubscriptionState() {
        // Načtení stavu z localStorage
        const savedState = localStorage.getItem('aiMapaSubscription');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                this.state.currentPlan = parsedState.currentPlan || 'free';
                this.state.subscriptionData = parsedState.subscriptionData || null;
                console.log('Načten stav předplatného:', this.state.currentPlan);
            } catch (error) {
                console.error('Chyba při načítání stavu předplatného:', error);
                this.state.currentPlan = 'free';
                this.state.subscriptionData = null;
            }
        } else {
            this.state.currentPlan = 'free';
            this.state.subscriptionData = null;
        }

        // Aktualizace UI
        this.updateSubscriptionButton();
    },

    // Uložení stavu předplatného
    saveSubscriptionState() {
        const stateToSave = {
            currentPlan: this.state.currentPlan,
            subscriptionData: this.state.subscriptionData
        };
        localStorage.setItem('aiMapaSubscription', JSON.stringify(stateToSave));
    },

    // Načtení předplatného uživatele z Auth0
    async loadUserSubscription(user) {
        if (!user) return;

        try {
            // Kontrola, zda je dostupný Auth0Auth
            if (typeof Auth0Auth === 'undefined') {
                console.error('Auth0Auth není dostupný');
                return;
            }

            // Získání metadat uživatele z Auth0
            const result = await Auth0Auth.getUserInfo();

            if (result.error) {
                console.error('Chyba při načítání uživatelských metadat:', result.error);
                return;
            }

            // Načtení předplatného z metadat
            this.loadUserSubscriptionFromMetadata(result.data);
        } catch (error) {
            console.error('Chyba při načítání předplatného uživatele:', error);
        }
    },

    // Načtení předplatného z metadat uživatele
    loadUserSubscriptionFromMetadata(userData) {
        if (!userData) return;

        try {
            // Získání předplatného z metadat
            const userMetadata = userData.user_metadata || {};
            const subscription = userMetadata.subscription || { plan: 'free' };

            // Aktualizace stavu předplatného
            this.state.currentPlan = subscription.plan;
            this.state.subscriptionData = subscription;

            // Uložení stavu předplatného
            this.saveSubscriptionState();

            // Aktualizace UI
            this.updateSubscriptionButton();

            console.log('Načteno předplatné uživatele:', this.state.currentPlan);

            // Vyvolání události o změně předplatného
            document.dispatchEvent(new CustomEvent('subscriptionChanged', {
                detail: { plan: this.state.currentPlan, data: this.state.subscriptionData }
            }));
        } catch (error) {
            console.error('Chyba při zpracování předplatného z metadat:', error);
        }
    },

    // Reset předplatného
    resetSubscription() {
        this.state.currentPlan = 'free';
        this.state.subscriptionData = null;
        this.saveSubscriptionState();
        this.updateSubscriptionButton();
    },

    // Aktualizace tlačítka předplatného
    updateSubscriptionButton() {
        const button = document.getElementById('subscriptionButton');
        if (!button) return;

        // Aktualizace vzhledu tlačítka podle plánu
        button.className = `subscription-button plan-${this.state.currentPlan}`;

        // Aktualizace titulku
        const planName = this.config.plans[this.state.currentPlan]?.name || 'Zdarma';
        button.title = `Předplatné: ${planName}`;
    },

    // Zobrazení/skrytí modálního okna předplatného
    toggleSubscriptionModal() {
        const modal = document.getElementById('subscriptionModal');
        if (!modal) return;

        if (this.state.subscriptionWindowShown) {
            this.hideSubscriptionModal();
        } else {
            this.showSubscriptionModal();
        }
    },

    // Zobrazení modálního okna předplatného
    showSubscriptionModal() {
        const modal = document.getElementById('subscriptionModal');
        if (!modal) return;

        // Aktualizace obsahu modálního okna
        this.updateSubscriptionPlans();
        this.updateCurrentSubscription();

        // Zobrazení modálního okna
        modal.style.display = 'flex';
        this.state.subscriptionWindowShown = true;
    },

    // Skrytí modálního okna předplatného
    hideSubscriptionModal() {
        const modal = document.getElementById('subscriptionModal');
        if (!modal) return;

        // Skrytí platební sekce
        this.hidePaymentSection();

        // Skrytí modálního okna
        modal.style.display = 'none';
        this.state.subscriptionWindowShown = false;
    },

    // Aktualizace seznamu plánů předplatného
    updateSubscriptionPlans() {
        const plansContainer = document.getElementById('subscriptionPlans');
        if (!plansContainer) return;

        // Vyčištění kontejneru
        plansContainer.innerHTML = '';

        // Přidání plánů
        Object.values(this.config.plans).forEach(plan => {
            const planElement = document.createElement('div');
            planElement.className = `subscription-plan ${plan.id === this.state.currentPlan ? 'active' : ''}`;
            planElement.dataset.plan = plan.id;

            // Vytvoření obsahu plánu
            planElement.innerHTML = `
                <div class="plan-header">
                    <h3>${plan.name}</h3>
                    <div class="plan-price">
                        <span class="price">${plan.price}</span>
                        <span class="currency">${plan.currency}</span>
                        <span class="interval">/${plan.interval}</span>
                    </div>
                </div>
                <div class="plan-features">
                    <ul>
                        ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="plan-action">
                    ${plan.id === this.state.currentPlan
                        ? '<button class="current-plan-button" disabled>Aktuální plán</button>'
                        : `<button class="select-plan-button" data-plan="${plan.id}">Vybrat plán</button>`}
                </div>
            `;

            // Přidání plánu do kontejneru
            plansContainer.appendChild(planElement);
        });

        // Přidání posluchačů událostí pro tlačítka
        const selectButtons = plansContainer.querySelectorAll('.select-plan-button');
        selectButtons.forEach(button => {
            button.addEventListener('click', () => {
                const planId = button.dataset.plan;
                this.selectPlan(planId);
            });
        });
    },

    // Aktualizace informací o aktuálním předplatném
    updateCurrentSubscription() {
        const currentSubscriptionContainer = document.getElementById('currentSubscription');
        if (!currentSubscriptionContainer) return;

        // Získání aktuálního plánu
        const currentPlan = this.config.plans[this.state.currentPlan];

        // Vytvoření obsahu
        if (this.state.currentPlan === 'free') {
            currentSubscriptionContainer.innerHTML = `
                <div class="current-subscription-info">
                    <h3>Aktuální předplatné: ${currentPlan.name}</h3>
                    <p>Používáte základní verzi AIMapa zdarma. Pro přístup k pokročilým funkcím si vyberte některý z placených plánů.</p>
                </div>
            `;
        } else {
            // Získání data konce předplatného
            const endDate = this.state.subscriptionData?.endDate
                ? new Date(this.state.subscriptionData.endDate).toLocaleDateString('cs-CZ')
                : 'Neznámé';

            currentSubscriptionContainer.innerHTML = `
                <div class="current-subscription-info">
                    <h3>Aktuální předplatné: ${currentPlan.name}</h3>
                    <p>Vaše předplatné je aktivní do: ${endDate}</p>
                    <p>Cena: ${currentPlan.price} ${currentPlan.currency}/${currentPlan.interval}</p>
                    <button id="cancelSubscription" class="cancel-subscription-button">Zrušit předplatné</button>
                </div>
            `;

            // Přidání posluchače události pro tlačítko zrušení předplatného
            document.getElementById('cancelSubscription').addEventListener('click', () => {
                this.cancelSubscription();
            });
        }
    },

    // Výběr plánu předplatného
    selectPlan(planId) {
        // Kontrola, zda je uživatel přihlášen
        if (!this.isUserLoggedIn()) {
            // Zobrazení přihlašovací obrazovky
            if (typeof AuthScreen !== 'undefined') {
                this.hideSubscriptionModal();
                AuthScreen.showAuthScreen();

                // Přidání jednorázového posluchače pro zobrazení předplatného po přihlášení
                const authListener = (event) => {
                    if (event.detail.isLoggedIn) {
                        setTimeout(() => {
                            this.showSubscriptionModal();
                            document.removeEventListener('authStateChanged', authListener);
                        }, 500);
                    }
                };
                document.addEventListener('authStateChanged', authListener);
            }
            return;
        }

        // Kontrola, zda je plán platný
        if (!this.config.plans[planId]) {
            console.error('Neplatný plán předplatného:', planId);
            return;
        }

        // Pokud je vybrán aktuální plán, nic neděláme
        if (planId === this.state.currentPlan) {
            return;
        }

        // Pokud je vybrán plán zdarma, rovnou ho nastavíme
        if (planId === 'free') {
            this.updateSubscription(planId);
            return;
        }

        // Zobrazení platební sekce
        this.showPaymentSection(planId);
    },

    // Zobrazení platební sekce
    showPaymentSection(planId) {
        const paymentSection = document.getElementById('paymentSection');
        if (!paymentSection) return;

        // Uložení vybraného plánu
        this.state.selectedPlan = planId;

        // Aktualizace textu tlačítka
        const plan = this.config.plans[planId];
        const paymentButton = document.getElementById('processPayment');
        if (paymentButton) {
            paymentButton.textContent = `Zaplatit ${plan.price} ${plan.currency}`;
        }

        // Zobrazení platební sekce
        paymentSection.style.display = 'block';

        // Skrytí seznamu plánů
        const plansContainer = document.getElementById('subscriptionPlans');
        if (plansContainer) {
            plansContainer.style.display = 'none';
        }

        // Skrytí aktuálního předplatného
        const currentSubscriptionContainer = document.getElementById('currentSubscription');
        if (currentSubscriptionContainer) {
            currentSubscriptionContainer.style.display = 'none';
        }
    },

    // Skrytí platební sekce
    hidePaymentSection() {
        const paymentSection = document.getElementById('paymentSection');
        if (!paymentSection) return;

        // Skrytí platební sekce
        paymentSection.style.display = 'none';

        // Zobrazení seznamu plánů
        const plansContainer = document.getElementById('subscriptionPlans');
        if (plansContainer) {
            plansContainer.style.display = 'grid';
        }

        // Zobrazení aktuálního předplatného
        const currentSubscriptionContainer = document.getElementById('currentSubscription');
        if (currentSubscriptionContainer) {
            currentSubscriptionContainer.style.display = 'block';
        }

        // Reset formuláře
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.reset();
        }
    },

    // Zpracování platby
    async processPayment() {
        // Kontrola, zda je vybrán plán
        if (!this.state.selectedPlan) {
            console.error('Není vybrán žádný plán předplatného');
            return;
        }

        // Kontrola, zda jsou vyplněny všechny údaje
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvc = document.getElementById('cardCvc').value;
        const cardName = document.getElementById('cardName').value;

        if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
            alert('Vyplňte prosím všechny údaje o platební kartě');
            return;
        }

        // Kontrola formátu údajů
        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            alert('Neplatné číslo karty');
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
            alert('Neplatná platnost karty (použijte formát MM/RR)');
            return;
        }

        if (cardCvc.length !== 3 || !/^\d+$/.test(cardCvc)) {
            alert('Neplatný CVC kód');
            return;
        }

        // Nastavení stavu zpracování platby
        this.state.paymentProcessing = true;
        const paymentButton = document.getElementById('processPayment');
        if (paymentButton) {
            paymentButton.disabled = true;
            paymentButton.textContent = 'Zpracování platby...';
        }

        try {
            // Simulace zpracování platby
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Aktualizace předplatného
            this.updateSubscription(this.state.selectedPlan);

            // Skrytí platební sekce
            this.hidePaymentSection();

            // Zobrazení zprávy o úspěšné platbě
            alert('Platba byla úspěšně zpracována. Vaše předplatné bylo aktivováno.');
        } catch (error) {
            console.error('Chyba při zpracování platby:', error);
            alert('Při zpracování platby došlo k chybě. Zkuste to prosím znovu.');
        } finally {
            // Reset stavu zpracování platby
            this.state.paymentProcessing = false;
            if (paymentButton) {
                paymentButton.disabled = false;
                const plan = this.config.plans[this.state.selectedPlan];
                paymentButton.textContent = `Zaplatit ${plan.price} ${plan.currency}`;
            }
        }
    },

    // Aktualizace předplatného
    async updateSubscription(planId) {
        // Kontrola, zda je plán platný
        if (!this.config.plans[planId]) {
            console.error('Neplatný plán předplatného:', planId);
            return;
        }

        try {
            // Vytvoření dat předplatného
            const now = new Date();
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // Předplatné na 1 měsíc

            const subscriptionData = {
                plan: planId,
                startDate: now.toISOString(),
                endDate: endDate.toISOString(),
                active: true,
                autoRenew: true
            };

            // Aktualizace stavu předplatného
            this.state.currentPlan = planId;
            this.state.subscriptionData = subscriptionData;

            // Uložení stavu předplatného
            this.saveSubscriptionState();

            // Aktualizace UI
            this.updateSubscriptionButton();
            this.updateSubscriptionPlans();
            this.updateCurrentSubscription();

            // Aktualizace metadat uživatele v Auth0
            if (typeof Auth0Auth !== 'undefined') {
                const userId = Auth0Auth.state.currentUser?.sub;
                if (userId) {
                    const userData = {
                        user_metadata: {
                            subscription: subscriptionData
                        }
                    };

                    const result = await Auth0Auth.updateUserInfo(userId, userData);
                    if (result.error) {
                        console.error('Chyba při aktualizaci metadat uživatele:', result.error);
                    } else {
                        console.log('Metadata uživatele byla úspěšně aktualizována');
                    }
                }
            }

            // Vyvolání události o změně předplatného
            document.dispatchEvent(new CustomEvent('subscriptionChanged', {
                detail: { plan: planId, data: subscriptionData }
            }));

            console.log('Předplatné bylo aktualizováno na:', planId);
        } catch (error) {
            console.error('Chyba při aktualizaci předplatného:', error);
        }
    },

    // Zrušení předplatného
    async cancelSubscription() {
        // Potvrzení zrušení
        const confirmed = confirm('Opravdu chcete zrušit své předplatné? Přijdete o přístup k prémiovým funkcím.');
        if (!confirmed) return;

        try {
            // Aktualizace předplatného na free
            await this.updateSubscription('free');

            // Zobrazení zprávy o úspěšném zrušení
            alert('Vaše předplatné bylo úspěšně zrušeno. Můžete nadále používat základní verzi AIMapa zdarma.');
        } catch (error) {
            console.error('Chyba při rušení předplatného:', error);
            alert('Při rušení předplatného došlo k chybě. Zkuste to prosím znovu.');
        }
    },

    // Kontrola, zda je uživatel přihlášen
    isUserLoggedIn() {
        // Kontrola přes Auth0
        if (typeof Auth0Auth !== 'undefined' && Auth0Auth.state.isLoggedIn) {
            return true;
        }

        // Kontrola přes localStorage
        return localStorage.getItem('aiMapaLoggedIn') === 'true';
    },

    // Kontrola, zda má uživatel přístup k funkci
    hasAccess(feature) {
        // Získání limitů aktuálního plánu
        const plan = this.config.plans[this.state.currentPlan];
        if (!plan) return false;

        // Kontrola, zda plán obsahuje požadovanou funkci
        return plan.limits[feature] === true ||
               (typeof plan.limits[feature] === 'number' && plan.limits[feature] > 0);
    },

    // Získání limitu pro funkci
    getLimit(feature) {
        // Získání limitů aktuálního plánu
        const plan = this.config.plans[this.state.currentPlan];
        if (!plan) return 0;

        // Vrácení limitu pro požadovanou funkci
        return plan.limits[feature] || 0;
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace modulu
    SubscriptionService.init();
});
