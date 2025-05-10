import React, { useState, useEffect } from 'react';
import './PricingCalculator.css';

// Definice typu pro model API
interface ApiModel {
  id: string;
  name: string;
  provider: string;
  inputPrice: number; // USD za 1K tokenů
  outputPrice: number; // USD za 1K tokenů
  tokensPerChar: number;
  contextWindow: number;
}

// Definice typu pro výpočet ceny
interface PriceCalculation {
  inputTokens: number;
  outputTokens: number;
  inputCostUSD: number;
  outputCostUSD: number;
  totalCostUSD: number;
  totalCostCZK: number;
  totalCostWithMarginCZK: number;
  margin: number;
}

// Rozhraní pro vlastnosti komponenty
interface PricingCalculatorProps {
  defaultMargin?: number;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ defaultMargin = 50 }) => {
  // Stav pro vstupní hodnoty
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-flash');
  const [margin, setMargin] = useState<number>(defaultMargin);
  const [exchangeRate, setExchangeRate] = useState<number>(22.5); // USD/CZK
  
  // Stav pro výpočet ceny
  const [calculation, setCalculation] = useState<PriceCalculation | null>(null);
  
  // Seznam dostupných modelů
  const models: ApiModel[] = [
    {
      id: 'gemini-1.5-flash',
      name: 'Gemini 1.5 Flash',
      provider: 'Google',
      inputPrice: 0.00005,
      outputPrice: 0.00015,
      tokensPerChar: 0.33,
      contextWindow: 1000000
    },
    {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      inputPrice: 0.00005,
      outputPrice: 0.00015,
      tokensPerChar: 0.33,
      contextWindow: 128000
    },
    {
      id: 'gpt-4o-mini',
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      inputPrice: 0.00001,
      outputPrice: 0.00003,
      tokensPerChar: 0.33,
      contextWindow: 128000
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      inputPrice: 0.015,
      outputPrice: 0.075,
      tokensPerChar: 0.33,
      contextWindow: 200000
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      inputPrice: 0.003,
      outputPrice: 0.015,
      tokensPerChar: 0.33,
      contextWindow: 200000
    },
    {
      id: 'claude-3-haiku',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      inputPrice: 0.00025,
      outputPrice: 0.00125,
      tokensPerChar: 0.33,
      contextWindow: 200000
    }
  ];

  // Efekt pro výpočet ceny při změně vstupů
  useEffect(() => {
    calculatePrice();
  }, [inputText, outputText, selectedModel, margin, exchangeRate]);

  // Funkce pro výpočet ceny
  const calculatePrice = () => {
    if (!inputText && !outputText) {
      setCalculation(null);
      return;
    }

    const model = models.find(m => m.id === selectedModel);
    if (!model) return;

    // Výpočet počtu tokenů
    const inputTokens = Math.ceil(inputText.length * model.tokensPerChar);
    const outputTokens = Math.ceil(outputText.length * model.tokensPerChar);

    // Výpočet ceny v USD
    const inputCostUSD = (inputTokens / 1000) * model.inputPrice;
    const outputCostUSD = (outputTokens / 1000) * model.outputPrice;
    const totalCostUSD = inputCostUSD + outputCostUSD;

    // Výpočet ceny v CZK
    const totalCostCZK = totalCostUSD * exchangeRate;
    
    // Výpočet ceny s marží
    const marginMultiplier = 1 + (margin / 100);
    const totalCostWithMarginCZK = totalCostCZK * marginMultiplier;

    setCalculation({
      inputTokens,
      outputTokens,
      inputCostUSD,
      outputCostUSD,
      totalCostUSD,
      totalCostCZK,
      totalCostWithMarginCZK,
      margin
    });
  };

  // Funkce pro formátování ceny
  const formatPrice = (price: number, currency: string = 'CZK', decimals: number = 4) => {
    return `${price.toFixed(decimals)} ${currency}`;
  };

  return (
    <div className="pricing-calculator">
      <h2 className="calculator-title">Kalkulačka cen API</h2>
      <p className="calculator-subtitle">
        Vypočítejte si náklady a ceny pro různé modely AI
      </p>

      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="model-select">Model AI:</label>
          <select 
            id="model-select" 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="input-text">Vstupní text:</label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Zadejte vstupní text pro výpočet ceny..."
            rows={4}
          />
          {calculation && (
            <div className="token-count">
              Počet tokenů: {calculation.inputTokens} 
              ({formatPrice(calculation.inputCostUSD, 'USD')})
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="output-text">Výstupní text:</label>
          <textarea
            id="output-text"
            value={outputText}
            onChange={(e) => setOutputText(e.target.value)}
            placeholder="Zadejte výstupní text pro výpočet ceny..."
            rows={4}
          />
          {calculation && (
            <div className="token-count">
              Počet tokenů: {calculation.outputTokens} 
              ({formatPrice(calculation.outputCostUSD, 'USD')})
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="margin">Marže (%):</label>
            <input
              id="margin"
              type="number"
              min="0"
              max="500"
              value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="exchange-rate">Kurz USD/CZK:</label>
            <input
              id="exchange-rate"
              type="number"
              min="1"
              step="0.1"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {calculation && (
        <div className="calculation-results">
          <h3>Výsledky výpočtu</h3>
          
          <div className="result-grid">
            <div className="result-item">
              <div className="result-label">Náklady (USD):</div>
              <div className="result-value">{formatPrice(calculation.totalCostUSD, 'USD')}</div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Náklady (CZK):</div>
              <div className="result-value">{formatPrice(calculation.totalCostCZK, 'CZK')}</div>
            </div>
            
            <div className="result-item">
              <div className="result-label">Marže ({calculation.margin}%):</div>
              <div className="result-value">{formatPrice(calculation.totalCostWithMarginCZK - calculation.totalCostCZK, 'CZK')}</div>
            </div>
            
            <div className="result-item highlight">
              <div className="result-label">Celková cena s marží:</div>
              <div className="result-value">{formatPrice(calculation.totalCostWithMarginCZK, 'CZK', 2)}</div>
            </div>
          </div>
          
          <div className="pricing-recommendations">
            <h4>Doporučení pro nastavení cen:</h4>
            <ul>
              <li>Minimální cena za požadavek: {formatPrice(Math.max(0.10, calculation.totalCostWithMarginCZK * 2), 'CZK', 2)}</li>
              <li>Doporučená cena za požadavek: {formatPrice(Math.max(0.50, calculation.totalCostWithMarginCZK * 5), 'CZK', 2)}</li>
              <li>Prémiová cena za požadavek: {formatPrice(Math.max(1.00, calculation.totalCostWithMarginCZK * 10), 'CZK', 2)}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;
