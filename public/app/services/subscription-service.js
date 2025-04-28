/**
 * Modul pro správu předplatného v AIMapa
 * Verze 0.3.8.5
 * 
 * Tento modul poskytuje funkce pro správu předplatného uživatelů
 * s integrací Stripe jako platební brány.
 */

const SubscriptionService = {
    // Stav modulu
    state: {
        isInitialized: false,
        currentPlan: 'free', // free, basic, premium, ultimate
        subscriptionData: null,
        subscriptionWindowShown: false,
        paymentProcessing: false,
        stripeInitialized: false,
        stripeElements: null,
        stripeCardElement: null
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
                stripePriceId: 'price_1OXYZabcdefghijklmnopqrs',
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
                stripePriceId: 'price_2OXYZabcdefghijklmnopqrs',
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
                stripePriceId: 'price_3OXYZabcdefghijklmnopqrs',
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

        // Nastavení Stripe
        stripe: {
            publishableKey: 'pk_test_51OXYZabcdefghijklmnopqrs',
            apiUrl: '/api/stripe',
            elementsOptions: {
                locale: 'cs',
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#4a90e2',
                        colorBackground: '#ffffff',
                        colorText: '#32325d',
                        colorDanger: '#ff5252',
                        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '4px'
                    }
                }
            }
        }
    },

    /**
     * Inicializace modulu
     */
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

        // Inicializace Stripe
        this.initStripe();

        this.state.isInitialized = true;
        console.log('Modul předplatného byl inicializován');
    },

    /**
     * Inicializace Stripe
     */
    async initStripe() {
        try {
            // Kontrola, zda je Stripe dostupný
            if (typeof Stripe === 'undefined') {
                console.log('Stripe není dostupný, načítám skript...');
                await this.loadStripeScript();
            }

            // Kontrola, zda je Stripe dostupný po načtení skriptu
            if (typeof Stripe === 'undefined') {
                console.error('Stripe není dostupný ani po načtení skriptu');
                return false;
            }

            // Inicializace Stripe
            const stripe = Stripe(this.config.stripe.publishableKey);
            this.state.stripe = stripe;

            console.log('Stripe byl úspěšně inicializován');
            this.state.stripeInitialized = true;
            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Stripe:', error);
            return false;
        }
    },

    /**
     * Načtení Stripe skriptu
     */
    loadStripeScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            
            script.onload = () => {
                console.log('Stripe skript byl úspěšně načten');
                resolve();
            };
            
            script.onerror = (error) => {
                console.error('Chyba při načítání Stripe skriptu:', error);
                reject(error);
            };
            
            document.head.appendChild(script);
        });
    },

    /**
     * Přidání tlačítka pro zobrazení předplatného
     */
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

    /**
     * Vytvoření modálního okna pro předplatné
     */
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
                                <label for="cardholderName">Jméno na kartě</label>
                                <input type="text" id="cardholderName" placeholder="Jan Novák">
                            </div>
                            <div class="form-group">
                                <label for="cardElement">Platební karta</label>
                                <div id="cardElement" class="card-element"></div>
                                <div id="cardErrors" class="card-errors" role="alert"></div>
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
    },

    /**
     * Nastavení posluchačů událostí
     */
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

        // Posluchač pro načtení kompletních dat uživatele
        document.addEventListener('userProfileLoaded', (event) => {
            if (event.detail.profile) {
                // Načtení předplatného z profilu uživatele
                this.loadUserSubscriptionFromProfile(event.detail.profile);
            }
        });
    },

    /**
     * Načtení stavu předplatného
     */
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

    /**
     * Uložení stavu předplatného
     */
    saveSubscriptionState() {
        const stateToSave = {
            currentPlan: this.state.currentPlan,
            subscriptionData: this.state.subscriptionData
        };
        localStorage.setItem('aiMapaSubscription', JSON.stringify(stateToSave));
    },

    /**
     * Načtení předplatného uživatele
     * @param {object} user - Uživatel z autentizačního systému
     */
    async loadUserSubscription(user) {
        if (!user) return;

        try {
            // Načtení předplatného ze Supabase
            if (typeof SupabaseClient !== 'undefined') {
                const { data, error } = await SupabaseClient.getClient()
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id || user.sub)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error('Chyba při načítání předplatného ze Supabase:', error);
                    return;
                }

                if (data && data.length > 0) {
                    const subscription = data[0];
                    
                    // Kontrola, zda je předplatné aktivní
                    const now = new Date();
                    const endDate = new Date(subscription.end_date);
                    
                    if (endDate > now && subscription.status === 'active') {
                        // Aktualizace stavu předplatného
                        this.state.currentPlan = subscription.plan_id;
                        this.state.subscriptionData = {
                            id: subscription.id,
                            startDate: subscription.start_date,
                            endDate: subscription.end_date,
                            status: subscription.status,
                            stripeSubscriptionId: subscription.stripe_subscription_id,
                            autoRenew: subscription.auto_renew
                        };
                        
                        console.log('Načteno aktivní předplatné uživatele:', this.state.currentPlan);
                    } else {
                        console.log('Předplatné uživatele vypršelo nebo není aktivní');
                        this.state.currentPlan = 'free';
                        this.state.subscriptionData = null;
                    }
                } else {
                    console.log('Uživatel nemá žádné předplatné');
                    this.state.currentPlan = 'free';
                    this.state.subscriptionData = null;
                }
                
                // Uložení stavu předplatného
                this.saveSubscriptionState();
                
                // Aktualizace UI
                this.updateSubscriptionButton();
                
                // Vyvolání události o změně předplatného
                this.notifySubscriptionChanged();
            }
        } catch (error) {
            console.error('Chyba při načítání předplatného uživatele:', error);
        }
    },

    /**
     * Načtení předplatného z profilu uživatele
     * @param {object} profile - Profil uživatele
     */
    loadUserSubscriptionFromProfile(profile) {
        if (!profile) return;

        try {
            // Kontrola, zda profil obsahuje informace o předplatném
            if (profile.subscription_plan) {
                // Aktualizace stavu předplatného
                this.state.currentPlan = profile.subscription_plan;
                
                // Pokud jsou k dispozici další informace o předplatném
                if (profile.subscription_end_date) {
                    const endDate = new Date(profile.subscription_end_date);
                    const now = new Date();
                    
                    if (endDate > now) {
                        this.state.subscriptionData = {
                            startDate: profile.subscription_start_date,
                            endDate: profile.subscription_end_date,
                            status: 'active',
                            autoRenew: profile.subscription_auto_renew
                        };
                        
                        console.log('Načteno aktivní předplatné z profilu uživatele:', this.state.currentPlan);
                    } else {
                        console.log('Předplatné z profilu uživatele vypršelo');
                        this.state.currentPlan = 'free';
                        this.state.subscriptionData = null;
                    }
                }
                
                // Uložení stavu předplatného
                this.saveSubscriptionState();
                
                // Aktualizace UI
                this.updateSubscriptionButton();
                
                // Vyvolání události o změně předplatného
                this.notifySubscriptionChanged();
            }
        } catch (error) {
            console.error('Chyba při načítání předplatného z profilu uživatele:', error);
        }
    },

    /**
     * Reset předplatného
     */
    resetSubscription() {
        this.state.currentPlan = 'free';
        this.state.subscriptionData = null;
        this.saveSubscriptionState();
        this.updateSubscriptionButton();
    },

    /**
     * Aktualizace tlačítka předplatného
     */
    updateSubscriptionButton() {
        const button = document.getElementById('subscriptionButton');
        if (!button) return;

        // Aktualizace vzhledu tlačítka podle plánu
        button.className = `subscription-button plan-${this.state.currentPlan}`;

        // Aktualizace titulku
        const planName = this.config.plans[this.state.currentPlan]?.name || 'Zdarma';
        button.title = `Předplatné: ${planName}`;
    },

    /**
     * Zobrazení/skrytí modálního okna předplatného
     */
    toggleSubscriptionModal() {
        const modal = document.getElementById('subscriptionModal');
        if (!modal) return;

        if (this.state.subscriptionWindowShown) {
            this.hideSubscriptionModal();
        } else {
            this.showSubscriptionModal();
        }
    },

    /**
     * Zobrazení modálního okna předplatného
     */
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

    /**
     * Skrytí modálního okna předplatného
     */
    hideSubscriptionModal() {
        const modal = document.getElementById('subscriptionModal');
        if (!modal) return;

        // Skrytí platební sekce
        this.hidePaymentSection();

        // Skrytí modálního okna
        modal.style.display = 'none';
        this.state.subscriptionWindowShown = false;
    },

    /**
     * Aktualizace seznamu plánů předplatného
     */
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

    /**
     * Aktualizace informací o aktuálním předplatném
     */
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
    }
};

// Pokračování v dalším souboru...
