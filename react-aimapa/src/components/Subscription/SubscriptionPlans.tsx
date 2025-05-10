import React, { useState, useEffect } from 'react';
import './SubscriptionPlans.css';

// Definice typu pro plán předplatného
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  apiLimits: {
    requestsPerDay: number;
    tokensPerMonth: number;
    maxCostPerRequest: number;
  };
  mapFeatures: {
    offlineAccess: boolean;
    customMarkers: boolean;
    routeOptimization: boolean;
    maxSavedLocations: number;
  };
  aiFeatures: {
    models: string[];
    maxContextLength: number;
    priorityProcessing: boolean;
  };
  isPopular?: boolean;
}

// Rozhraní pro vlastnosti komponenty
interface SubscriptionPlansProps {
  currentPlan: string | null;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isLoggedIn: boolean;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  currentPlan,
  onSelectPlan,
  isLoggedIn
}) => {
  // Stav pro plány předplatného
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(currentPlan);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);

  // Načtení plánů předplatného
  useEffect(() => {
    // V reálné aplikaci by se plány načítaly z API
    const subscriptionPlans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: 'Zdarma',
        price: 0,
        currency: 'CZK',
        interval: 'měsíčně',
        features: [
          'Základní funkce mapy',
          'Omezený počet API požadavků (10/den)',
          'Základní modely AI',
          'Maximálně 10 uložených míst',
          'Obsahuje reklamy'
        ],
        apiLimits: {
          requestsPerDay: 10,
          tokensPerMonth: 10000,
          maxCostPerRequest: 0.05
        },
        mapFeatures: {
          offlineAccess: false,
          customMarkers: false,
          routeOptimization: false,
          maxSavedLocations: 10
        },
        aiFeatures: {
          models: ['Gemini 1.5 Flash'],
          maxContextLength: 2000,
          priorityProcessing: false
        }
      },
      {
        id: 'basic',
        name: 'Základní',
        price: 99,
        currency: 'CZK',
        interval: 'měsíčně',
        features: [
          'Rozšířené funkce mapy',
          'Více API požadavků (50/den)',
          'Standardní modely AI',
          'Maximálně 50 uložených míst',
          'Méně reklam'
        ],
        apiLimits: {
          requestsPerDay: 50,
          tokensPerMonth: 50000,
          maxCostPerRequest: 0.20
        },
        mapFeatures: {
          offlineAccess: false,
          customMarkers: true,
          routeOptimization: false,
          maxSavedLocations: 50
        },
        aiFeatures: {
          models: ['Gemini 1.5 Flash', 'GPT-4o-mini'],
          maxContextLength: 4000,
          priorityProcessing: false
        },
        isPopular: true
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 199,
        currency: 'CZK',
        interval: 'měsíčně',
        features: [
          'Pokročilé funkce mapy včetně offline přístupu',
          'Vysoký počet API požadavků (200/den)',
          'Prémiové modely AI',
          'Neomezený počet uložených míst',
          'Bez reklam'
        ],
        apiLimits: {
          requestsPerDay: 200,
          tokensPerMonth: 200000,
          maxCostPerRequest: 0.50
        },
        mapFeatures: {
          offlineAccess: true,
          customMarkers: true,
          routeOptimization: true,
          maxSavedLocations: 500
        },
        aiFeatures: {
          models: ['Gemini 1.5 Flash', 'GPT-4o', 'Claude 3'],
          maxContextLength: 8000,
          priorityProcessing: true
        }
      },
      {
        id: 'ultimate',
        name: 'Ultimate',
        price: 499,
        currency: 'CZK',
        interval: 'měsíčně',
        features: [
          'Všechny funkce mapy bez omezení',
          'Neomezený počet API požadavků',
          'Všechny dostupné modely AI',
          'Neomezený počet uložených míst',
          'Prioritní podpora',
          'Bez reklam'
        ],
        apiLimits: {
          requestsPerDay: 1000,
          tokensPerMonth: 1000000,
          maxCostPerRequest: 2.00
        },
        mapFeatures: {
          offlineAccess: true,
          customMarkers: true,
          routeOptimization: true,
          maxSavedLocations: 9999
        },
        aiFeatures: {
          models: ['Gemini 1.5 Flash', 'GPT-4o', 'Claude 3', 'DeepSeek'],
          maxContextLength: 16000,
          priorityProcessing: true
        }
      }
    ];

    setPlans(subscriptionPlans);
  }, []);

  // Funkce pro výběr plánu
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    // Vždy umožníme výběr plánu, i když uživatel není přihlášen
    // Pokud není přihlášen, zobrazíme výzvu k přihlášení
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      // Přesto nastavíme vybraný plán, aby byl vizuálně označen
      setSelectedPlan(plan.id);
      return;
    }

    setSelectedPlan(plan.id);
    onSelectPlan(plan);

    // Zobrazíme potvrzení o výběru plánu
    alert(`Plán "${plan.name}" byl úspěšně vybrán!`);
  };

  return (
    <div className="subscription-plans-container">
      <h2 className="subscription-title">Vyberte si plán předplatného</h2>
      <p className="subscription-subtitle">
        Získejte přístup k pokročilým funkcím a API klíčům s našimi plány předplatného
      </p>

      <div className="subscription-plans-grid">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`subscription-plan-card ${plan.id === selectedPlan ? 'selected' : ''} ${plan.isPopular ? 'popular' : ''}`}
          >
            {plan.isPopular && <div className="popular-badge">Nejoblíbenější</div>}
            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="currency">{plan.currency}</span>
                <span className="interval">/{plan.interval}</span>
              </div>
            </div>

            <div className="plan-features">
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="plan-api-limits">
              <h4>API limity:</h4>
              <p>Požadavky: {plan.apiLimits.requestsPerDay}/den</p>
              <p>Tokeny: {(plan.apiLimits.tokensPerMonth / 1000).toFixed(0)}K/měsíc</p>
              <p>Max. cena/požadavek: {plan.apiLimits.maxCostPerRequest.toFixed(2)} CZK</p>
            </div>

            <button
              className={`select-plan-button ${plan.id === currentPlan ? 'current' : ''}`}
              onClick={() => handleSelectPlan(plan)}
              disabled={false} // Nikdy nezakážeme tlačítko, aby uživatel mohl vždy vybrat plán
            >
              {plan.id === currentPlan ? 'Aktuální plán' : 'Vybrat plán'}
            </button>
          </div>
        ))}
      </div>

      {showLoginPrompt && (
        <div className="login-prompt">
          <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}></div>
          <div className="login-prompt-content">
            <h3>Přihlášení vyžadováno</h3>
            <p>Pro aktivaci předplatného se prosím nejprve přihlaste.</p>
            <p className="info-text">Váš výběr byl zaznamenán a bude aktivován po přihlášení.</p>
            <div className="login-prompt-actions">
              <button className="login-button" onClick={() => {
                // Simulace přihlášení
                alert('Přihlášení bylo úspěšné!');
                setShowLoginPrompt(false);
              }}>Přihlásit se</button>
              <button className="cancel-button" onClick={() => setShowLoginPrompt(false)}>Zrušit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;
