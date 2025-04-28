/**
 * Rozšíření modulu pro správu předplatného v AIMapa - Stripe integrace
 * Verze 0.3.8.5
 * 
 * Tento soubor obsahuje metody pro integraci Stripe platební brány
 * do modulu pro správu předplatného.
 */

// Rozšíření SubscriptionService o metody pro Stripe
Object.assign(SubscriptionService, {
    /**
     * Výběr plánu předplatného
     * @param {string} planId - ID plánu
     */
    selectPlan(planId) {
        // Kontrola, zda je uživatel přihlášen
        if (!this.isUserLoggedIn()) {
            // Zobrazení přihlašovací obrazovky
            if (typeof AuthService !== 'undefined') {
                this.hideSubscriptionModal();
                
                // Přesměrování na přihlašovací stránku
                AuthService.login();
                
                return;
            }
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

    /**
     * Zobrazení platební sekce
     * @param {string} planId - ID plánu
     */
    async showPaymentSection(planId) {
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

        // Inicializace Stripe Elements
        await this.initStripeElements();
    },

    /**
     * Inicializace Stripe Elements
     */
    async initStripeElements() {
        try {
            // Kontrola, zda je Stripe inicializován
            if (!this.state.stripeInitialized) {
                await this.initStripe();
            }

            // Kontrola, zda je Stripe inicializován po pokusu o inicializaci
            if (!this.state.stripeInitialized) {
                console.error('Stripe není inicializován, nelze vytvořit platební formulář');
                return false;
            }

            // Kontrola, zda již existují Stripe Elements
            if (this.state.stripeElements && this.state.stripeCardElement) {
                // Vyčištění existujícího elementu
                const cardElement = document.getElementById('cardElement');
                cardElement.innerHTML = '';
                
                // Přidání elementu do DOM
                cardElement.appendChild(this.state.stripeCardElement);
                
                return true;
            }

            // Vytvoření Stripe Elements
            const elements = this.state.stripe.elements(this.config.stripe.elementsOptions);
            
            // Vytvoření Card elementu
            const cardElement = elements.create('card', {
                style: {
                    base: {
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                }
            });
            
            // Přidání Card elementu do DOM
            cardElement.mount('#cardElement');
            
            // Uložení referencí
            this.state.stripeElements = elements;
            this.state.stripeCardElement = cardElement;
            
            // Přidání posluchače událostí pro změny
            cardElement.addEventListener('change', (event) => {
                const displayError = document.getElementById('cardErrors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
            
            console.log('Stripe Elements byly úspěšně inicializovány');
            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Stripe Elements:', error);
            return false;
        }
    },

    /**
     * Skrytí platební sekce
     */
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

        // Vyčištění chybových hlášek
        const cardErrors = document.getElementById('cardErrors');
        if (cardErrors) {
            cardErrors.textContent = '';
        }
    },

    /**
     * Zpracování platby
     */
    async processPayment() {
        // Kontrola, zda je vybrán plán
        if (!this.state.selectedPlan) {
            console.error('Není vybrán žádný plán předplatného');
            return;
        }

        // Kontrola, zda je uživatel přihlášen
        if (!this.isUserLoggedIn()) {
            alert('Pro dokončení platby se musíte přihlásit');
            return;
        }

        // Kontrola, zda jsou inicializovány Stripe Elements
        if (!this.state.stripeElements || !this.state.stripeCardElement) {
            console.error('Stripe Elements nejsou inicializovány');
            return;
        }

        // Získání jména držitele karty
        const cardholderName = document.getElementById('cardholderName').value;
        if (!cardholderName) {
            alert('Vyplňte prosím jméno držitele karty');
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
            // Získání aktuálního uživatele
            const user = AuthService.getCurrentUser().user;
            if (!user) {
                throw new Error('Uživatel není přihlášen');
            }

            // Získání vybraného plánu
            const plan = this.config.plans[this.state.selectedPlan];
            if (!plan) {
                throw new Error('Neplatný plán předplatného');
            }

            // Vytvoření platebního záměru na serveru
            const response = await fetch(`${this.config.stripe.apiUrl}/create-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AuthService.getToken()}`
                },
                body: JSON.stringify({
                    planId: plan.id,
                    priceId: plan.stripePriceId,
                    userId: user.id || user.sub,
                    customerEmail: user.email
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Chyba při vytváření předplatného');
            }

            const { clientSecret, subscriptionId } = await response.json();

            // Potvrzení platby
            const { error, paymentIntent } = await this.state.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: this.state.stripeCardElement,
                    billing_details: {
                        name: cardholderName,
                        email: user.email
                    }
                }
            });

            if (error) {
                throw new Error(error.message || 'Chyba při zpracování platby');
            }

            // Aktualizace předplatného
            await this.updateSubscription(this.state.selectedPlan, {
                stripeSubscriptionId: subscriptionId,
                paymentIntentId: paymentIntent.id
            });

            // Skrytí platební sekce
            this.hidePaymentSection();

            // Zobrazení zprávy o úspěšné platbě
            alert('Platba byla úspěšně zpracována. Vaše předplatné bylo aktivováno.');
        } catch (error) {
            console.error('Chyba při zpracování platby:', error);
            alert(`Při zpracování platby došlo k chybě: ${error.message}`);
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

    /**
     * Aktualizace předplatného
     * @param {string} planId - ID plánu
     * @param {object} paymentData - Data o platbě
     */
    async updateSubscription(planId, paymentData = {}) {
        // Kontrola, zda je plán platný
        if (!this.config.plans[planId]) {
            console.error('Neplatný plán předplatného:', planId);
            return { success: false, error: 'Neplatný plán předplatného' };
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
                status: 'active',
                autoRenew: true,
                ...paymentData
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

            // Aktualizace předplatného v Supabase
            if (typeof SupabaseClient !== 'undefined') {
                const user = AuthService.getCurrentUser().user;
                if (user) {
                    // Kontrola, zda již existuje předplatné
                    const { data: existingSubscriptions, error: fetchError } = await SupabaseClient.getClient()
                        .from('subscriptions')
                        .select('*')
                        .eq('user_id', user.id || user.sub)
                        .eq('status', 'active');

                    if (fetchError) {
                        console.error('Chyba při kontrole existujícího předplatného:', fetchError);
                    } else if (existingSubscriptions && existingSubscriptions.length > 0) {
                        // Aktualizace existujícího předplatného
                        const { error: updateError } = await SupabaseClient.getClient()
                            .from('subscriptions')
                            .update({
                                plan_id: planId,
                                start_date: now.toISOString(),
                                end_date: endDate.toISOString(),
                                status: 'active',
                                auto_renew: true,
                                stripe_subscription_id: paymentData.stripeSubscriptionId,
                                stripe_payment_intent_id: paymentData.paymentIntentId,
                                updated_at: now.toISOString()
                            })
                            .eq('id', existingSubscriptions[0].id);

                        if (updateError) {
                            console.error('Chyba při aktualizaci předplatného v Supabase:', updateError);
                        } else {
                            console.log('Předplatné bylo úspěšně aktualizováno v Supabase');
                        }
                    } else {
                        // Vytvoření nového předplatného
                        const { error: insertError } = await SupabaseClient.getClient()
                            .from('subscriptions')
                            .insert([{
                                user_id: user.id || user.sub,
                                plan_id: planId,
                                start_date: now.toISOString(),
                                end_date: endDate.toISOString(),
                                status: 'active',
                                auto_renew: true,
                                stripe_subscription_id: paymentData.stripeSubscriptionId,
                                stripe_payment_intent_id: paymentData.paymentIntentId,
                                created_at: now.toISOString(),
                                updated_at: now.toISOString()
                            }]);

                        if (insertError) {
                            console.error('Chyba při vytváření předplatného v Supabase:', insertError);
                        } else {
                            console.log('Předplatné bylo úspěšně vytvořeno v Supabase');
                        }
                    }

                    // Aktualizace profilu uživatele
                    if (typeof UserProfileService !== 'undefined') {
                        await UserProfileService.updateProfile({
                            subscription_plan: planId,
                            subscription_start_date: now.toISOString(),
                            subscription_end_date: endDate.toISOString(),
                            subscription_auto_renew: true
                        });
                    }
                }
            }

            // Vyvolání události o změně předplatného
            this.notifySubscriptionChanged();

            console.log('Předplatné bylo aktualizováno na:', planId);
            return { success: true };
        } catch (error) {
            console.error('Chyba při aktualizaci předplatného:', error);
            return { success: false, error: error.message || 'Chyba při aktualizaci předplatného' };
        }
    },

    /**
     * Zrušení předplatného
     */
    async cancelSubscription() {
        // Potvrzení zrušení
        const confirmed = confirm('Opravdu chcete zrušit své předplatné? Přijdete o přístup k prémiovým funkcím.');
        if (!confirmed) return;

        try {
            // Kontrola, zda je uživatel přihlášen
            if (!this.isUserLoggedIn()) {
                throw new Error('Pro zrušení předplatného se musíte přihlásit');
            }

            // Kontrola, zda existuje aktivní předplatné
            if (!this.state.subscriptionData || !this.state.subscriptionData.stripeSubscriptionId) {
                // Pokud nemáme Stripe ID předplatného, jednoduše přepneme na free plán
                await this.updateSubscription('free');
                alert('Vaše předplatné bylo úspěšně zrušeno. Můžete nadále používat základní verzi AIMapa zdarma.');
                return { success: true };
            }

            // Zrušení předplatného ve Stripe
            const response = await fetch(`${this.config.stripe.apiUrl}/cancel-subscription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await AuthService.getToken()}`
                },
                body: JSON.stringify({
                    subscriptionId: this.state.subscriptionData.stripeSubscriptionId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Chyba při rušení předplatného');
            }

            // Aktualizace předplatného na free
            await this.updateSubscription('free');

            // Aktualizace předplatného v Supabase
            if (typeof SupabaseClient !== 'undefined') {
                const user = AuthService.getCurrentUser().user;
                if (user) {
                    const { error } = await SupabaseClient.getClient()
                        .from('subscriptions')
                        .update({
                            status: 'canceled',
                            auto_renew: false,
                            updated_at: new Date().toISOString()
                        })
                        .eq('stripe_subscription_id', this.state.subscriptionData.stripeSubscriptionId);

                    if (error) {
                        console.error('Chyba při aktualizaci předplatného v Supabase:', error);
                    }
                }
            }

            // Zobrazení zprávy o úspěšném zrušení
            alert('Vaše předplatné bylo úspěšně zrušeno. Můžete nadále používat základní verzi AIMapa zdarma.');
            return { success: true };
        } catch (error) {
            console.error('Chyba při rušení předplatného:', error);
            alert(`Při rušení předplatného došlo k chybě: ${error.message}`);
            return { success: false, error: error.message || 'Chyba při rušení předplatného' };
        }
    },

    /**
     * Kontrola, zda je uživatel přihlášen
     */
    isUserLoggedIn() {
        // Kontrola přes AuthService
        if (typeof AuthService !== 'undefined') {
            return AuthService.getCurrentUser().isLoggedIn;
        }

        // Fallback na localStorage
        return localStorage.getItem('aiMapaLoggedIn') === 'true';
    },

    /**
     * Kontrola, zda má uživatel přístup k funkci
     * @param {string} feature - Název funkce
     */
    hasAccess(feature) {
        // Získání limitů aktuálního plánu
        const plan = this.config.plans[this.state.currentPlan];
        if (!plan) return false;

        // Kontrola, zda plán obsahuje požadovanou funkci
        return plan.limits[feature] === true ||
               (typeof plan.limits[feature] === 'number' && plan.limits[feature] > 0);
    },

    /**
     * Získání limitu pro funkci
     * @param {string} feature - Název funkce
     */
    getLimit(feature) {
        // Získání limitů aktuálního plánu
        const plan = this.config.plans[this.state.currentPlan];
        if (!plan) return 0;

        // Vrácení limitu pro požadovanou funkci
        return plan.limits[feature] || 0;
    },

    /**
     * Oznámení o změně předplatného
     */
    notifySubscriptionChanged() {
        document.dispatchEvent(new CustomEvent('subscriptionChanged', {
            detail: {
                plan: this.state.currentPlan,
                data: this.state.subscriptionData
            }
        }));
    }
});

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Inicializace modulu
    SubscriptionService.init();
});

// Export modulu
window.SubscriptionService = SubscriptionService;
