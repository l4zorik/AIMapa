import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionPlans, { SubscriptionPlan } from '../components/Subscription/SubscriptionPlans';
import PricingCalculator from '../components/Subscription/PricingCalculator';
import './SubscriptionPage.css';

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  // Stav pro přihlášení uživatele
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // Stav pro aktuální plán předplatného
  const [currentPlan, setCurrentPlan] = useState<string | null>('free');
  // Stav pro zobrazení kalkulačky
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  // Stav pro zobrazení informací o API
  const [showApiInfo, setShowApiInfo] = useState<boolean>(false);
  
  // Nové stavy pro Stripe integraci
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Nový stav pro LLM statistiky využití
  const [llmUsageData, setLlmUsageData] = useState<any | null>(null); // Consider defining a more specific type for stats
  const [llmUsageError, setLlmUsageError] = useState<string | null>(null);
  const [isLoadingLlmUsage, setIsLoadingLlmUsage] = useState<boolean>(false);

  // Simulovaná uživatelská data (v reálné aplikaci by přišla z Auth0 nebo jiného auth kontextu)
  const simulatedUserId = 'user_simulated_123abc'; 
  const simulatedUserEmail = 'user@example.com';

  // Efekt pro kontrolu přihlášení uživatele
  useEffect(() => {
    // Zde by byla kontrola přihlášení uživatele z auth kontextu
    // Pro účely ukázky nastavíme isLoggedIn na true
    setIsLoggedIn(true); 
    // Pokud by uživatel nebyl přihlášen, mohlo by se zobrazit upozornění nebo přesměrování
    // if (!auth.isAuthenticated) { navigate('/login'); }
    // a userId a email by se nastavily z auth.user

    // Načtení LLM statistik využití, pokud je uživatel přihlášen
    if (isLoggedIn) {
      setIsLoadingLlmUsage(true);
      setLlmUsageError(null);
      fetch('/api/usage/llm') // Předpokládáme, že Auth token je automaticky připojen (např. cookies nebo interceptor)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setLlmUsageData(data);
          setIsLoadingLlmUsage(false);
        })
        .catch(error => {
          console.error("Error fetching LLM usage stats:", error);
          setLlmUsageError(error.message || "Failed to fetch LLM usage data.");
          setIsLoadingLlmUsage(false);
        });
    }
  }, [isLoggedIn]); // Znovu se spustí, pokud se změní stav přihlášení

  // Funkce pro výběr plánu předplatného
  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    setApiError(null);
    setStripeClientSecret(null);
    setStripeSubscriptionId(null);

    if (!isLoggedIn) {
      // V reálné aplikaci by se zde mohlo zobrazit dialogové okno pro přihlášení
      // nebo přesměrování na přihlašovací stránku.
      alert('Pro výběr plánu se prosím přihlaste.');
      console.log('Uživatel není přihlášen, nelze pokračovat s výběrem plánu.');
      return;
    }

    // Kontrola, zda plán má potřebné Stripe ID (pro jiné než 'free' plány)
    if (plan.id !== 'free' && (!plan.stripePriceId || plan.stripePriceId.startsWith('price_placeholder_'))) {
        alert(`Konfigurace pro plán "${plan.name}" není kompletní. Chybí platné Stripe Price ID.`);
        console.error('Chybí stripePriceId pro placený plán:', plan);
        setApiError(`Konfigurace pro plán "${plan.name}" není kompletní.`);
        return;
    }
    
    // "Free" plán se typicky nespravuje přes Stripe payment flow, ale aplikačně
    if (plan.id === 'free') {
      console.log('Vybrán bezplatný plán:', plan);
      setCurrentPlan(plan.id);
      // Zde by mohla být logika pro aktualizaci stavu uživatele v DB na "free" plán,
      // pokud to není řešeno jinak (např. defaultní stav).
      alert('Bezplatný plán aktivován.');
      return;
    }

    setIsLoading(true);
    console.log(`Pokus o vytvoření předplatného pro plán: ${plan.name} (ID: ${plan.id}, Stripe Price ID: ${plan.stripePriceId})`);
    console.log(`Simulovaná uživatelská data: User ID - ${simulatedUserId}, Email - ${simulatedUserEmail}`);


    try {
      const response = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // V reálné aplikaci by zde byl Authorization header s JWT tokenem uživatele
          // 'Authorization': `Bearer ${accessToken}`, 
        },
        body: JSON.stringify({
          planId: plan.id, // Aplikační ID plánu (např. "basic", "premium")
          priceId: plan.stripePriceId, // Stripe Price ID
          userId: simulatedUserId, 
          customerEmail: simulatedUserEmail,
        }),
      });

      setIsLoading(false);
      const data = await response.json();

      if (!response.ok) {
        console.error('Chyba API při vytváření předplatného:', data);
        setApiError(data.error || `Chyba serveru: ${response.status}`);
        alert(`Nepodařilo se vytvořit předplatné: ${data.error || response.statusText}`);
        return;
      }

      console.log('Předplatné úspěšně zažádáno:', data);
      setStripeClientSecret(data.clientSecret);
      setStripeSubscriptionId(data.subscriptionId);
      setCurrentPlan(plan.id); // Aktualizujeme aktuální plán v UI

      // Zde by následovala integrace Stripe Payment Elementu
      // pomocí data.clientSecret pro potvrzení platby na klientovi.
      // Například:
      // 1. Načíst Stripe.js (pokud ještě není)
      // 2. Inicializovat Stripe s publishable klíčem
      // 3. Vytvořit Payment Element s clientSecret
      // 4. Zobrazit formulář pro platební údaje
      // 5. Odeslat platbu pomocí stripe.confirmPayment()
      alert(`Předplatné pro plán "${plan.name}" bylo úspěšně zažádáno! Nyní by následoval platební krok (Stripe Element). Client Secret: ${data.clientSecret}`);

    } catch (error) {
      setIsLoading(false);
      console.error('Síťová nebo jiná chyba při volání API:', error);
      setApiError('Nepodařilo se kontaktovat server. Zkuste to prosím později.');
      alert('Došlo k chybě při komunikaci se serverem.');
    }
  };

  // Funkce pro přihlášení uživatele
  const handleLogin = () => {
    // Zde by byla logika pro přihlášení uživatele
    setIsLoggedIn(true);
  };

  // Funkce pro odhlášení uživatele
  const handleLogout = () => {
    // Zde by byla logika pro odhlášení uživatele
    setIsLoggedIn(false);
  };

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <div className="header-actions">
          <button className="back-to-map-button" onClick={() => navigate('/map')}>
            <i className="fas fa-arrow-left"></i> Zpět na mapu
          </button>
        </div>

        <h1>Předplatné a API klíče</h1>
        <p>
          Získejte přístup k pokročilým funkcím a API klíčům s našimi plány předplatného.
          Vyberte si plán, který nejlépe vyhovuje vašim potřebám.
        </p>

        <div className="auth-status">
          {isLoggedIn ? (
            <div className="user-info">
              <span>Přihlášen jako: <strong>{simulatedUserEmail}</strong> (ID: {simulatedUserId})</span>
              <button className="logout-button" onClick={handleLogout}>Odhlásit se</button>
            </div>
          ) : (
            <div className="login-prompt">
              <span>Pro správu předplatného se prosím přihlaste</span>
              <button className="login-button" onClick={handleLogin}>Přihlásit se</button>
            </div>
          )}
        </div>
      </div>

      <div className="subscription-content">
        <div className="subscription-section">
          <SubscriptionPlans
            currentPlan={currentPlan}
            onSelectPlan={handleSelectPlan}
            isLoggedIn={isLoggedIn}
          />
          {isLoading && <div className="loading-overlay">Probíhá komunikace se serverem...</div>}
          {apiError && <div className="api-error-message">Chyba: {apiError}</div>}

          <div className="llm-usage-section">
            <h3>Přehled využití AI API</h3>
            {isLoadingLlmUsage && <p>Načítání statistik využití...</p>}
            {llmUsageError && <p className="api-error-message">Chyba při načítání statistik: {llmUsageError}</p>}
            {llmUsageData && !isLoadingLlmUsage && !llmUsageError && (
              <div>
                <p>Celkový počet požadavků: {llmUsageData.totalRequests !== undefined ? llmUsageData.totalRequests : 'N/A'}</p>
                <p>Celkový počet tokenů: {llmUsageData.totalTokens !== undefined ? llmUsageData.totalTokens : 'N/A'}</p>
                <p>Celkové náklady: {llmUsageData.totalCost !== undefined ? llmUsageData.totalCost.toFixed(2) + ' CZK' : 'N/A'}</p>
                {/* 
                  Zde by se zobrazily další detaily, např. porovnání s limity plánu:
                  const currentPlanDetails = SubscriptionService.getPlanById(currentPlan); // Hypotetická funkce
                  if (currentPlanDetails && currentPlanDetails.apiLimits) {
                    <p>Tokeny tento měsíc: {llmUsageData.totalTokens} / {currentPlanDetails.apiLimits.tokensPerMonth}</p>
                  }
                */}
              </div>
            )}
          </div>
          
          {stripeClientSecret && stripeSubscriptionId && (
            <div className="stripe-payment-section">
              <h3>Dokončete platbu</h3>
              <p>Subscription ID: {stripeSubscriptionId}</p>
              <p>Client Secret obdržen. Zde by se zobrazil Stripe Payment Element pro zadání platebních údajů.</p>
              {/* 
                Příklad, jak by se zde integroval Stripe Payment Element:
                1. Vytvořit <Elements stripe={stripePromise} options={{ clientSecret }}> komponentu
                2. Uvnitř <PaymentElement /> a tlačítko pro odeslání platby.
                const stripe = useStripe();
                const elements = useElements();
                const handleSubmit = async (event) => {
                  event.preventDefault();
                  if (!stripe || !elements) return;
                  const result = await stripe.confirmPayment({
                    elements,
                    confirmParams: { return_url: window.location.origin + '/payment-success' },
                  });
                  if (result.error) console.error(result.error.message);
                };
              */}
            </div>
          )}
        </div>

        <div className="subscription-tools">
          <div className="tools-header">
            <h2>Nástroje pro vývojáře</h2>
            <p>Využijte naše nástroje pro výpočet cen a správu API klíčů</p>
          </div>

          <div className="tools-buttons">
            <button
              className={`tool-button ${showCalculator ? 'active' : ''}`}
              onClick={() => {
                setShowCalculator(!showCalculator);
                if (!showCalculator) setShowApiInfo(false);
              }}
            >
              <i className="fas fa-calculator"></i>
              <span>Kalkulačka cen API</span>
            </button>

            <button
              className={`tool-button ${showApiInfo ? 'active' : ''}`}
              onClick={() => {
                setShowApiInfo(!showApiInfo);
                if (!showApiInfo) setShowCalculator(false);
              }}
            >
              <i className="fas fa-info-circle"></i>
              <span>Informace o API</span>
            </button>
          </div>

          {showCalculator && (
            <div className="tool-content">
              <PricingCalculator defaultMargin={50} />
            </div>
          )}

          {showApiInfo && (
            <div className="tool-content">
              <div className="api-info">
                <h3>Informace o API a cenách</h3>

                <div className="api-info-section">
                  <h4>Podporované API</h4>
                  <ul className="api-list">
                    <li>
                      <div className="api-provider">
                        <i className="fas fa-robot"></i>
                        <span>Google Gemini API</span>
                      </div>
                      <p>Výkonné AI modely od Google s podporou pro multimodální vstupy.</p>
                    </li>
                    <li>
                      <div className="api-provider">
                        <i className="fas fa-brain"></i>
                        <span>OpenAI API</span>
                      </div>
                      <p>Pokročilé jazykové modely včetně GPT-4o a GPT-4o-mini.</p>
                    </li>
                    <li>
                      <div className="api-provider">
                        <i className="fas fa-comment-dots"></i>
                        <span>Anthropic Claude API</span>
                      </div>
                      <p>Modely Claude 3 s vynikajícím porozuměním a bezpečností.</p>
                    </li>
                  </ul>
                </div>

                <div className="api-info-section">
                  <h4>Jak funguje účtování</h4>
                  <p>
                    Ceny jsou založeny na počtu tokenů ve vstupním a výstupním textu.
                    Token je přibližně 4 znaky textu (závisí na konkrétním modelu).
                  </p>
                  <p>
                    Každý plán předplatného má stanovený limit na počet tokenů a požadavků.
                    Po překročení limitu budou další požadavky zpoplatněny podle ceníku.
                  </p>
                </div>

                <div className="api-info-section">
                  <h4>Tipy pro optimalizaci nákladů</h4>
                  <ul>
                    <li>Používejte kratší prompty pro snížení počtu vstupních tokenů</li>
                    <li>Omezte délku odpovědí pomocí parametru max_tokens</li>
                    <li>Používejte efektivnější modely pro běžné úkoly</li>
                    <li>Využívejte cachování odpovědí pro opakované dotazy</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
