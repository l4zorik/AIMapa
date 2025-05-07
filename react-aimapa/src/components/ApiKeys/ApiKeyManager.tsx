import React, { useState, useEffect } from 'react';
import './ApiKeyManager.css';

// Typy API providerů
export type ApiProviderType = 'openai' | 'google' | 'anthropic' | 'deepseek' | 'mapbox' | 'mapycz' | 'openrouteservice';

// Rozhraní pro API klíč
export interface ApiKey {
  id: string;
  provider: ApiProviderType;
  key: string;
  name: string;
  isActive: boolean;
  usageCount: number;
  usageLimit: number;
  createdAt: Date;
  expiresAt: Date | null;
}

// Rozhraní pro ceník API
export interface ApiPricing {
  provider: ApiProviderType;
  name: string;
  description: string;
  inputPrice: number; // Cena za 1K vstupních tokenů/znaků
  outputPrice: number; // Cena za 1K výstupních tokenů/znaků
  currency: string;
  efficiency: number; // Efektivita v % pro práci s mapou
  features: string[];
}

// Ukázkové API klíče
const sampleApiKeys: ApiKey[] = [
  {
    id: '1',
    provider: 'openai',
    key: 'sk-1234567890abcdefghijklmnopqrstuvwxyz',
    name: 'OpenAI GPT-4',
    isActive: true,
    usageCount: 120,
    usageLimit: 1000,
    createdAt: new Date('2023-12-01'),
    expiresAt: new Date('2024-12-01')
  },
  {
    id: '2',
    provider: 'google',
    key: 'AIza1234567890abcdefghijklmnopqrstuvwxyz',
    name: 'Google Gemini Pro',
    isActive: true,
    usageCount: 45,
    usageLimit: 500,
    createdAt: new Date('2024-01-15'),
    expiresAt: null
  },
  {
    id: '3',
    provider: 'mapbox',
    key: 'pk.1234567890abcdefghijklmnopqrstuvwxyz',
    name: 'Mapbox Standard',
    isActive: true,
    usageCount: 230,
    usageLimit: 1000,
    createdAt: new Date('2023-11-10'),
    expiresAt: new Date('2024-11-10')
  }
];

// Ceníky API
const apiPricings: ApiPricing[] = [
  {
    provider: 'openai',
    name: 'OpenAI GPT-4',
    description: 'Nejpokročilejší jazykový model od OpenAI s vynikajícími schopnostmi pro práci s mapami a navigací.',
    inputPrice: 0.03,
    outputPrice: 0.06,
    currency: 'USD',
    efficiency: 92,
    features: ['Pokročilé vyhledávání míst', 'Detailní navigační instrukce', 'Kontextové porozumění', 'Multimodální vstupy']
  },
  {
    provider: 'google',
    name: 'Google Gemini Pro',
    description: 'Výkonný model od Google s přímou integrací s Google Maps API a vynikající znalostí geografických dat.',
    inputPrice: 0.000125,
    outputPrice: 0.000375,
    currency: 'USD',
    efficiency: 95,
    features: ['Nativní integrace s Google Maps', 'Vynikající geografické znalosti', 'Optimalizovaná spotřeba tokenů', 'Multijazyčná podpora']
  },
  {
    provider: 'anthropic',
    name: 'Anthropic Claude 3',
    description: 'Bezpečný a výkonný model s vynikajícím porozuměním kontextu a schopností zpracovat dlouhé dotazy.',
    inputPrice: 0.025,
    outputPrice: 0.075,
    currency: 'USD',
    efficiency: 88,
    features: ['Dlouhý kontext', 'Přesné geografické porozumění', 'Bezpečnostní funkce', 'Detailní vysvětlení']
  },
  {
    provider: 'deepseek',
    name: 'DeepSeek Coder',
    description: 'Cenově efektivní model s dobrou znalostí geografických dat a programovacích jazyků.',
    inputPrice: 0.0002,
    outputPrice: 0.0006,
    currency: 'USD',
    efficiency: 82,
    features: ['Nízká cena', 'Dobrý poměr cena/výkon', 'Programovací schopnosti', 'Základní geografické znalosti']
  },
  {
    provider: 'mapbox',
    name: 'Mapbox API',
    description: 'Komplexní mapová platforma s pokročilými funkcemi pro vyhledávání a navigaci.',
    inputPrice: 0.00,
    outputPrice: 0.00,
    currency: 'USD',
    efficiency: 98,
    features: ['Detailní mapové podklady', 'Pokročilé vyhledávání', 'Navigace v reálném čase', 'Vlastní styly map']
  },
  {
    provider: 'mapycz',
    name: 'Mapy.cz API',
    description: 'České mapové API s vynikajícím pokrytím střední Evropy a turistickými funkcemi.',
    inputPrice: 0.00,
    outputPrice: 0.00,
    currency: 'CZK',
    efficiency: 96,
    features: ['Detailní pokrytí ČR a SK', 'Turistické trasy', 'Offline mapy', 'Panorama']
  },
  {
    provider: 'openrouteservice',
    name: 'OpenRouteService',
    description: 'Open-source služba pro plánování tras s globálním pokrytím.',
    inputPrice: 0.00,
    outputPrice: 0.00,
    currency: 'EUR',
    efficiency: 85,
    features: ['Globální pokrytí', 'Multimodální navigace', 'Výškový profil', 'Open-source']
  }
];

interface ApiKeyManagerProps {
  onSelectApiKey?: (apiKey: ApiKey) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onSelectApiKey }) => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(sampleApiKeys);
  const [selectedProvider, setSelectedProvider] = useState<ApiProviderType | ''>('');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [activeTab, setActiveTab] = useState<'keys' | 'pricing'>('keys');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filtrované API klíče podle vybraného poskytovatele
  const filteredApiKeys = selectedProvider 
    ? apiKeys.filter(key => key.provider === selectedProvider)
    : apiKeys;

  // Přidání nového API klíče
  const handleAddKey = () => {
    if (!selectedProvider || !newKeyName || !newKeyValue) {
      alert('Vyplňte prosím všechna pole');
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      provider: selectedProvider as ApiProviderType,
      key: newKeyValue,
      name: newKeyName,
      isActive: true,
      usageCount: 0,
      usageLimit: 1000,
      createdAt: new Date(),
      expiresAt: null
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setNewKeyValue('');
    setShowAddForm(false);
  };

  // Aktivace/deaktivace API klíče
  const toggleKeyStatus = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, isActive: !key.isActive } : key
    ));
  };

  // Odstranění API klíče
  const removeKey = (id: string) => {
    if (window.confirm('Opravdu chcete odstranit tento API klíč?')) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  };

  // Výběr API klíče pro použití
  const selectApiKey = (apiKey: ApiKey) => {
    if (onSelectApiKey) {
      onSelectApiKey(apiKey);
    }
  };

  // Formátování data
  const formatDate = (date: Date | null) => {
    if (!date) return 'Neomezeno';
    return new Intl.DateTimeFormat('cs-CZ').format(date);
  };

  return (
    <div className="api-key-manager">
      <div className="api-manager-tabs">
        <button 
          className={activeTab === 'keys' ? 'active' : ''} 
          onClick={() => setActiveTab('keys')}
        >
          Moje API klíče
        </button>
        <button 
          className={activeTab === 'pricing' ? 'active' : ''} 
          onClick={() => setActiveTab('pricing')}
        >
          Ceníky a efektivita
        </button>
      </div>

      {activeTab === 'keys' && (
        <div className="api-keys-section">
          <div className="api-keys-header">
            <div className="filter-container">
              <label htmlFor="provider-filter">Filtrovat podle poskytovatele:</label>
              <select 
                id="provider-filter" 
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value as ApiProviderType | '')}
              >
                <option value="">Všichni poskytovatelé</option>
                <option value="openai">OpenAI</option>
                <option value="google">Google</option>
                <option value="anthropic">Anthropic</option>
                <option value="deepseek">DeepSeek</option>
                <option value="mapbox">Mapbox</option>
                <option value="mapycz">Mapy.cz</option>
                <option value="openrouteservice">OpenRouteService</option>
              </select>
            </div>
            <button 
              className="add-key-button"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Zrušit' : 'Přidat API klíč'}
            </button>
          </div>

          {showAddForm && (
            <div className="add-key-form">
              <h3>Přidat nový API klíč</h3>
              <div className="form-group">
                <label htmlFor="provider-select">Poskytovatel:</label>
                <select 
                  id="provider-select" 
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value as ApiProviderType)}
                  required
                >
                  <option value="">Vyberte poskytovatele</option>
                  <option value="openai">OpenAI</option>
                  <option value="google">Google</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="mapbox">Mapbox</option>
                  <option value="mapycz">Mapy.cz</option>
                  <option value="openrouteservice">OpenRouteService</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="key-name">Název klíče:</label>
                <input 
                  type="text" 
                  id="key-name" 
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Např. Můj OpenAI klíč"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="key-value">API klíč:</label>
                <input 
                  type="text" 
                  id="key-value" 
                  value={newKeyValue}
                  onChange={(e) => setNewKeyValue(e.target.value)}
                  placeholder="sk-..."
                  required
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddForm(false)}
                >
                  Zrušit
                </button>
                <button 
                  type="button" 
                  className="submit-button"
                  onClick={handleAddKey}
                >
                  Přidat klíč
                </button>
              </div>
            </div>
          )}

          <div className="api-keys-list">
            {filteredApiKeys.length > 0 ? (
              filteredApiKeys.map(apiKey => (
                <div key={apiKey.id} className={`api-key-card ${!apiKey.isActive ? 'inactive' : ''}`}>
                  <div className="api-key-header">
                    <h3>{apiKey.name}</h3>
                    <span className={`api-key-status ${apiKey.isActive ? 'active' : 'inactive'}`}>
                      {apiKey.isActive ? 'Aktivní' : 'Neaktivní'}
                    </span>
                  </div>
                  <div className="api-key-provider">
                    <span className="provider-label">Poskytovatel:</span>
                    <span className="provider-value">{apiKey.provider}</span>
                  </div>
                  <div className="api-key-value">
                    <span className="key-label">Klíč:</span>
                    <span className="key-value">
                      {apiKey.key.substring(0, 6)}...{apiKey.key.substring(apiKey.key.length - 4)}
                      <button 
                        className="copy-button"
                        onClick={() => navigator.clipboard.writeText(apiKey.key)}
                        title="Kopírovat klíč"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </span>
                  </div>
                  <div className="api-key-details">
                    <div className="api-key-usage">
                      <span className="usage-label">Využití:</span>
                      <span className="usage-value">
                        {apiKey.usageCount} / {apiKey.usageLimit}
                      </span>
                      <div className="usage-bar">
                        <div 
                          className="usage-progress" 
                          style={{ width: `${(apiKey.usageCount / apiKey.usageLimit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="api-key-dates">
                      <div className="created-date">
                        <span className="date-label">Vytvořeno:</span>
                        <span className="date-value">{formatDate(apiKey.createdAt)}</span>
                      </div>
                      <div className="expires-date">
                        <span className="date-label">Platnost do:</span>
                        <span className="date-value">{formatDate(apiKey.expiresAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="api-key-actions">
                    <button 
                      className="toggle-button"
                      onClick={() => toggleKeyStatus(apiKey.id)}
                    >
                      {apiKey.isActive ? 'Deaktivovat' : 'Aktivovat'}
                    </button>
                    <button 
                      className="select-button"
                      onClick={() => selectApiKey(apiKey)}
                      disabled={!apiKey.isActive}
                    >
                      Použít
                    </button>
                    <button 
                      className="remove-button"
                      onClick={() => removeKey(apiKey.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-api-keys">
                <p>Nemáte žádné API klíče. Přidejte nový klíč pomocí tlačítka výše.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="api-pricing-section">
          <h2>Ceníky a efektivita API</h2>
          <p className="pricing-intro">
            Porovnání cen a efektivity různých API poskytovatelů pro práci s mapou a AI asistenty.
          </p>
          
          <div className="pricing-cards">
            {apiPricings.map(pricing => (
              <div key={pricing.provider} className="pricing-card">
                <div className="pricing-header">
                  <h3>{pricing.name}</h3>
                  <div className="efficiency-badge">
                    <span className="efficiency-value">{pricing.efficiency}%</span>
                    <span className="efficiency-label">Efektivita</span>
                  </div>
                </div>
                
                <p className="pricing-description">{pricing.description}</p>
                
                <div className="pricing-details">
                  <div className="pricing-rates">
                    <div className="rate-item">
                      <span className="rate-label">Vstupní cena:</span>
                      <span className="rate-value">
                        {pricing.inputPrice === 0 ? 'Zdarma' : `${pricing.inputPrice} ${pricing.currency}/1K tokenů`}
                      </span>
                    </div>
                    <div className="rate-item">
                      <span className="rate-label">Výstupní cena:</span>
                      <span className="rate-value">
                        {pricing.outputPrice === 0 ? 'Zdarma' : `${pricing.outputPrice} ${pricing.currency}/1K tokenů`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pricing-features">
                    <h4>Klíčové funkce</h4>
                    <ul>
                      {pricing.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pricing-actions">
                  <button className="add-key-action">
                    Přidat klíč
                  </button>
                  <button className="learn-more-action">
                    Více informací
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
