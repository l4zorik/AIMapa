import React, { useState, useEffect } from 'react';
import './SubscriptionPlans.css';

import SubscriptionService from '../../services/SubscriptionService'; // Import the service
// Use the SubscriptionPlan interface from the service
import { SubscriptionPlan } from '../../services/SubscriptionService';

// Definice typu pro plán předplatného
// export interface SubscriptionPlan { // This definition will be removed to use the one from the service
//   id: string;
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
//   isPopular?: boolean;
//   stripeProductId: string; // Added in previous step, ensure it's here
//   stripePriceId: string;   // Added in previous step, ensure it's here
// }

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
    const fetchPlans = async () => {
      try {
        // Using the getSubscriptionPlans method from the service
        const fetchedPlans = await SubscriptionService.getSubscriptionPlans();
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Failed to fetch subscription plans:", error);
        // Optionally, set some error state to display to the user
      }
    };

    fetchPlans();
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
