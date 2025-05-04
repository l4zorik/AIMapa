/**
 * Stripe API Routes pro AIMapa
 * Verze 0.3.8.5
 */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Inicializace Supabase klienta
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Middleware pro ověření autentizace
const authenticateUser = async (req, res, next) => {
    try {
        // Získání tokenu z hlavičky
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Chybí autorizační token' });
        }

        const token = authHeader.split(' ')[1];

        // Ověření tokenu v Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Neplatný autorizační token' });
        }

        // Uložení uživatele do požadavku
        req.user = user;
        next();
    } catch (error) {
        console.error('Chyba při ověřování autentizace:', error);
        res.status(500).json({ error: 'Interní chyba serveru' });
    }
};

/**
 * Vytvoření předplatného
 * POST /api/stripe/create-subscription
 */
router.post('/create-subscription', authenticateUser, async (req, res) => {
    try {
        const { planId, priceId, userId, customerEmail } = req.body;

        if (!planId || !priceId || !userId || !customerEmail) {
            return res.status(400).json({ error: 'Chybí povinné parametry' });
        }

        // Kontrola, zda uživatel již existuje jako zákazník ve Stripe
        let customerId;
        const { data: customers, error: searchError } = await supabase
            .from('stripe_customers')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .limit(1);

        if (searchError) {
            console.error('Chyba při hledání zákazníka v Supabase:', searchError);
            return res.status(500).json({ error: 'Chyba při hledání zákazníka' });
        }

        if (customers && customers.length > 0) {
            // Zákazník již existuje
            customerId = customers[0].stripe_customer_id;
        } else {
            // Vytvoření nového zákazníka ve Stripe
            const customer = await stripe.customers.create({
                email: customerEmail,
                metadata: {
                    userId: userId
                }
            });

            customerId = customer.id;

            // Uložení zákazníka do Supabase
            const { error: insertError } = await supabase
                .from('stripe_customers')
                .insert([{
                    user_id: userId,
                    stripe_customer_id: customerId,
                    email: customerEmail,
                    created_at: new Date().toISOString()
                }]);

            if (insertError) {
                console.error('Chyba při ukládání zákazníka do Supabase:', insertError);
            }
        }

        // Vytvoření předplatného ve Stripe
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent']
        });

        // Vrácení client secret pro potvrzení platby
        res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret
        });
    } catch (error) {
        console.error('Chyba při vytváření předplatného:', error);
        res.status(500).json({ error: error.message || 'Chyba při vytváření předplatného' });
    }
});

/**
 * Zrušení předplatného
 * POST /api/stripe/cancel-subscription
 */
router.post('/cancel-subscription', authenticateUser, async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({ error: 'Chybí ID předplatného' });
        }

        // Zrušení předplatného ve Stripe
        const subscription = await stripe.subscriptions.cancel(subscriptionId);

        res.json({ success: true, subscription });
    } catch (error) {
        console.error('Chyba při rušení předplatného:', error);
        res.status(500).json({ error: error.message || 'Chyba při rušení předplatného' });
    }
});

/**
 * Webhook pro zpracování událostí ze Stripe
 * POST /api/stripe/webhook
 */
router.post('/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Zpracování události
    try {
        switch (event.type) {
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error(`Error processing webhook: ${error.message}`);
        res.status(500).json({ error: 'Error processing webhook' });
    }
});

/**
 * Zpracování události úspěšné platby faktury
 * @param {object} invoice - Faktura ze Stripe
 */
async function handleInvoicePaymentSucceeded(invoice) {
    try {
        // Získání předplatného
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

        // Získání zákazníka
        const customer = await stripe.customers.retrieve(invoice.customer);

        // Získání uživatele z Supabase
        const { data: customers, error: searchError } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('stripe_customer_id', invoice.customer)
            .limit(1);

        if (searchError || !customers || customers.length === 0) {
            console.error('Chyba při hledání uživatele v Supabase:', searchError);
            return;
        }

        const userId = customers[0].user_id;

        // Aktualizace předplatného v Supabase
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                status: 'active',
                updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription);

        if (updateError) {
            console.error('Chyba při aktualizaci předplatného v Supabase:', updateError);
        }

        // Přidání platby do historie plateb
        const { error: insertError } = await supabase
            .from('payment_history')
            .insert([{
                user_id: userId,
                stripe_invoice_id: invoice.id,
                stripe_payment_intent_id: invoice.payment_intent,
                amount: invoice.amount_paid / 100, // Převod z centů na základní měnu
                currency: invoice.currency,
                status: 'succeeded',
                created_at: new Date().toISOString()
            }]);

        if (insertError) {
            console.error('Chyba při ukládání platby do Supabase:', insertError);
        }
    } catch (error) {
        console.error('Chyba při zpracování události úspěšné platby faktury:', error);
    }
}

/**
 * Zpracování události neúspěšné platby faktury
 * @param {object} invoice - Faktura ze Stripe
 */
async function handleInvoicePaymentFailed(invoice) {
    try {
        // Získání předplatného
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);

        // Získání zákazníka
        const customer = await stripe.customers.retrieve(invoice.customer);

        // Získání uživatele z Supabase
        const { data: customers, error: searchError } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('stripe_customer_id', invoice.customer)
            .limit(1);

        if (searchError || !customers || customers.length === 0) {
            console.error('Chyba při hledání uživatele v Supabase:', searchError);
            return;
        }

        const userId = customers[0].user_id;

        // Aktualizace předplatného v Supabase
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                status: 'past_due',
                updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', invoice.subscription);

        if (updateError) {
            console.error('Chyba při aktualizaci předplatného v Supabase:', updateError);
        }

        // Přidání platby do historie plateb
        const { error: insertError } = await supabase
            .from('payment_history')
            .insert([{
                user_id: userId,
                stripe_invoice_id: invoice.id,
                stripe_payment_intent_id: invoice.payment_intent,
                amount: invoice.amount_due / 100, // Převod z centů na základní měnu
                currency: invoice.currency,
                status: 'failed',
                created_at: new Date().toISOString()
            }]);

        if (insertError) {
            console.error('Chyba při ukládání platby do Supabase:', insertError);
        }
    } catch (error) {
        console.error('Chyba při zpracování události neúspěšné platby faktury:', error);
    }
}

/**
 * Zpracování události aktualizace předplatného
 * @param {object} subscription - Předplatné ze Stripe
 */
async function handleSubscriptionUpdated(subscription) {
    try {
        // Získání zákazníka
        const customer = await stripe.customers.retrieve(subscription.customer);

        // Získání uživatele z Supabase
        const { data: customers, error: searchError } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('stripe_customer_id', subscription.customer)
            .limit(1);

        if (searchError || !customers || customers.length === 0) {
            console.error('Chyba při hledání uživatele v Supabase:', searchError);
            return;
        }

        const userId = customers[0].user_id;

        // Aktualizace předplatného v Supabase
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                status: subscription.status,
                end_date: new Date(subscription.current_period_end * 1000).toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
            console.error('Chyba při aktualizaci předplatného v Supabase:', updateError);
        }
    } catch (error) {
        console.error('Chyba při zpracování události aktualizace předplatného:', error);
    }
}

/**
 * Zpracování události smazání předplatného
 * @param {object} subscription - Předplatné ze Stripe
 */
async function handleSubscriptionDeleted(subscription) {
    try {
        // Získání zákazníka
        const customer = await stripe.customers.retrieve(subscription.customer);

        // Získání uživatele z Supabase
        const { data: customers, error: searchError } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('stripe_customer_id', subscription.customer)
            .limit(1);

        if (searchError || !customers || customers.length === 0) {
            console.error('Chyba při hledání uživatele v Supabase:', searchError);
            return;
        }

        const userId = customers[0].user_id;

        // Aktualizace předplatného v Supabase
        const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
                status: 'canceled',
                auto_renew: false,
                updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);

        if (updateError) {
            console.error('Chyba při aktualizaci předplatného v Supabase:', updateError);
        }

        // Aktualizace profilu uživatele
        const { error: profileError } = await supabase
            .from('users')
            .update({
                subscription_plan: 'free',
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (profileError) {
            console.error('Chyba při aktualizaci profilu uživatele v Supabase:', profileError);
        }
    } catch (error) {
        console.error('Chyba při zpracování události smazání předplatného:', error);
    }
}

module.exports = router;
