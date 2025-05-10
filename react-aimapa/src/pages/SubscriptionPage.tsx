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

  // Efekt pro kontrolu přihlášení uživatele
  useEffect(() => {
    // Zde by byla kontrola přihlášení uživatele
    // Pro účely ukázky nastavíme isLoggedIn na true, aby uživatel byl přihlášen
    setIsLoggedIn(true);
  }, []);

  // Funkce pro výběr plánu předplatného
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    console.log('Vybrán plán:', plan);
    // Zde by byla logika pro zpracování výběru plánu
    // Pro účely ukázky pouze vypíšeme do konzole

    // Pokud by uživatel byl přihlášen, mohli bychom aktualizovat jeho plán
    if (isLoggedIn) {
      setCurrentPlan(plan.id);
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
              <span>Přihlášen jako: <strong>uživatel@example.com</strong></span>
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
