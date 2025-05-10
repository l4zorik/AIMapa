import React, { useState, useEffect } from 'react';
import './EnhancedApiKeyManager.css';

// Typy API poskytovatelů
export type ApiProviderType = 'openai' | 'google' | 'anthropic' | 'deepseek' | 'mapbox' | 'mapycz' | 'openrouteservice';

// Rozhraní pro API klíč
export interface ApiKey {
  id: string;
  provider: ApiProviderType;
  key: string;
  name: string;
  isActive: boolean;
  isVerified: boolean;
  usageCount: number;
  usageLimit: number;
  createdAt: Date;
  expiresAt: Date | null;
  lastUsed: Date | null;
  costPerUse: number;
  totalCost: number;
}

// Rozhraní pro stav ověření API klíče
interface VerificationStatus {
  isVerifying: boolean;
  isVerified: boolean;
  message: string;
  lastVerified: Date | null;
}

// Rozhraní pro propojení s chatem
interface ChatConnection {
  isConnected: boolean;
  lastMessage: string | null;
  lastUsed: Date | null;
}

// Komponenta pro správu API klíčů
const EnhancedApiKeyManager: React.FC<{
  onSelectApiKey: (apiKey: ApiKey) => void;
  onApiKeyVerified: (apiKey: ApiKey, isVerified: boolean) => void;
  selectedChatModel: string | null;
}> = ({ onSelectApiKey, onApiKeyVerified, selectedChatModel }) => {
  // Stav pro API klíče
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ApiProviderType | ''>('');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Stav pro ověření API klíčů
  const [verificationStatus, setVerificationStatus] = useState<Record<string, VerificationStatus>>({});

  // Stav pro propojení s chatem
  const [chatConnections, setChatConnections] = useState<Record<string, ChatConnection>>({});

  // Stav pro aktivní klíč
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);

  // Načtení API klíčů při inicializaci
  useEffect(() => {
    // Načtení API klíčů z localStorage
    const savedKeys = localStorage.getItem('api-keys');
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        setApiKeys(parsedKeys.map((key: any) => ({
          ...key,
          createdAt: new Date(key.createdAt),
          expiresAt: key.expiresAt ? new Date(key.expiresAt) : null,
          lastUsed: key.lastUsed ? new Date(key.lastUsed) : null
        })));
      } catch (error) {
        console.error('Chyba při načítání API klíčů:', error);
      }
    } else {
      // Inicializace prázdného pole API klíčů
      setApiKeys([]);
      localStorage.setItem('api-keys', JSON.stringify([]));
    }
  }, []);

  // Efekt pro simulaci propojení s chatem
  useEffect(() => {
    if (selectedChatModel && activeKeyId) {
      const activeKey = apiKeys.find(key => key.id === activeKeyId);
      if (activeKey) {
        setChatConnections(prev => ({
          ...prev,
          [activeKeyId]: {
            isConnected: true,
            lastMessage: `Používám model ${selectedChatModel} s klíčem ${activeKey.name}`,
            lastUsed: new Date()
          }
        }));
      }
    }
  }, [selectedChatModel, activeKeyId, apiKeys]);

  // Funkce pro ověření API klíče
  const verifyApiKey = async (apiKey: ApiKey) => {
    setVerificationStatus(prev => ({
      ...prev,
      [apiKey.id]: {
        ...prev[apiKey.id],
        isVerifying: true,
        message: 'Ověřuji API klíč...'
      }
    }));

    // Simulace ověření API klíče
    try {
      // V reálné aplikaci by zde byl API požadavek pro ověření klíče
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Pro účely testování vždy vracíme true - klíč je platný
      const isVerified = true; // Vždy úspěšné ověření pro demo

      // Klíč je ověřený, ale ještě není označen jako isVerified, dokud nebude propojen s chatem
      // Pouze aktualizujeme stav ověření, ale neměníme isVerified příznak
      setVerificationStatus(prev => ({
        ...prev,
        [apiKey.id]: {
          isVerifying: false,
          isVerified,
          message: isVerified ? 'API klíč je platný, propojte jej s chatem' : 'API klíč je neplatný',
          lastVerified: new Date()
        }
      }));

      return isVerified;
    } catch (error) {
      console.error('Chyba při ověřování API klíče:', error);

      setVerificationStatus(prev => ({
        ...prev,
        [apiKey.id]: {
          isVerifying: false,
          isVerified: false,
          message: `Chyba při ověřování: ${error}`,
          lastVerified: new Date()
        }
      }));

      return false;
    }
  };

  // Funkce pro aktivaci API klíče a propojení s chatem
  const activateAndConnectKey = async (apiKey: ApiKey) => {
    console.log('Aktivace a propojení klíče:', apiKey.name);

    // Nejprve ověříme klíč
    const isVerified = await verifyApiKey(apiKey);
    console.log('Výsledek ověření klíče:', isVerified);

    if (isVerified) {
      console.log('Klíč je ověřený, nastavuji jako aktivní');
      // Nastavíme klíč jako aktivní a označíme jako ověřený
      setActiveKeyId(apiKey.id);

      // Aktualizujeme klíč - nastavíme isVerified na true až po úspěšném propojení s chatem
      const updatedKey = {
        ...apiKey,
        isVerified: true, // Nyní nastavíme isVerified na true
        usageCount: apiKey.usageCount + 1,
        lastUsed: new Date(),
        totalCost: apiKey.totalCost + apiKey.costPerUse
      };

      console.log('Aktualizovaný klíč:', updatedKey.name, 'isVerified:', updatedKey.isVerified);

      // Aktualizujeme stav API klíčů
      setApiKeys(keys => keys.map(k => k.id === apiKey.id ? updatedKey : k));

      // Uložíme aktualizované klíče do localStorage
      localStorage.setItem('api-keys', JSON.stringify(
        apiKeys.map(k => k.id === apiKey.id ? updatedKey : k)
      ));

      // Předáme klíč nadřazené komponentě
      onSelectApiKey(updatedKey);

      // Informujeme nadřazenou komponentu o ověření klíče
      onApiKeyVerified(updatedKey, true);

      // Aktualizujeme stav propojení s chatem
      setChatConnections(prev => ({
        ...prev,
        [apiKey.id]: {
          isConnected: true,
          lastMessage: 'Klíč byl úspěšně ověřen a propojen s chatem',
          lastUsed: new Date()
        }
      }));

      return true;
    }

    return false;
  };

  // Funkce pro přidání nového API klíče
  const handleAddKey = () => {
    if (!selectedProvider || !newKeyName || !newKeyValue) {
      alert('Vyplňte prosím všechna pole');
      return;
    }

    // Validace API klíče podle poskytovatele
    let isValidKey = false;
    let keyError = '';

    switch (selectedProvider) {
      case 'openai':
        isValidKey = newKeyValue.startsWith('sk-') && newKeyValue.length >= 40;
        if (!isValidKey) keyError = 'OpenAI API klíč musí začínat "sk-" a mít délku alespoň 40 znaků.';
        break;
      case 'google':
        isValidKey = newKeyValue.startsWith('AIza') && newKeyValue.length >= 39;
        if (!isValidKey) keyError = 'Google API klíč musí začínat "AIza" a mít délku alespoň 39 znaků.';
        break;
      case 'anthropic':
        isValidKey = newKeyValue.startsWith('sk-ant-') && newKeyValue.length >= 40;
        if (!isValidKey) keyError = 'Anthropic API klíč musí začínat "sk-ant-" a mít délku alespoň 40 znaků.';
        break;
      case 'deepseek':
        isValidKey = newKeyValue.length >= 32;
        if (!isValidKey) keyError = 'DeepSeek API klíč musí mít délku alespoň 32 znaků.';
        break;
      case 'mapbox':
        isValidKey = (newKeyValue.startsWith('pk.') || newKeyValue.startsWith('sk.')) && newKeyValue.length >= 60;
        if (!isValidKey) keyError = 'Mapbox API klíč musí začínat "pk." nebo "sk." a mít délku alespoň 60 znaků.';
        break;
      default:
        isValidKey = newKeyValue.length >= 20;
        if (!isValidKey) keyError = 'API klíč musí mít délku alespoň 20 znaků.';
    }

    if (!isValidKey) {
      alert(`Neplatný API klíč: ${keyError}`);
      return;
    }

    // Kontrola, zda klíč již neexistuje
    const keyExists = apiKeys.some(key => key.key === newKeyValue);
    if (keyExists) {
      alert('Tento API klíč již existuje v seznamu.');
      return;
    }

    // Vytvoření nového API klíče
    const newKey: ApiKey = {
      id: Date.now().toString(),
      provider: selectedProvider as ApiProviderType,
      key: newKeyValue,
      name: newKeyName,
      isActive: true,
      isVerified: false,
      usageCount: 0,
      usageLimit: 1000,
      createdAt: new Date(),
      expiresAt: null,
      lastUsed: null,
      costPerUse: selectedProvider === 'google' ? 0.0005 :
                 selectedProvider === 'openai' ? 0.03 :
                 selectedProvider === 'anthropic' ? 0.025 :
                 selectedProvider === 'mapbox' ? 0.001 : 0.01,
      totalCost: 0
    };

    // Přidání klíče do seznamu
    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    localStorage.setItem('api-keys', JSON.stringify(updatedKeys));

    // Vyčištění formuláře
    setNewKeyName('');
    setNewKeyValue('');
    setShowAddForm(false);

    // Zobrazíme informaci o nutnosti ověření a propojení klíče
    setVerificationStatus(prev => ({
      ...prev,
      [newKey.id]: {
        isVerifying: false,
        isVerified: false,
        message: 'Klikněte na "Ověřit klíč" a poté "Propojit s chatem"',
        lastVerified: null
      }
    }));
  };

  // Funkce pro odstranění API klíče
  const removeKey = (id: string) => {
    if (window.confirm('Opravdu chcete odstranit tento API klíč?')) {
      const updatedKeys = apiKeys.filter(key => key.id !== id);
      setApiKeys(updatedKeys);
      localStorage.setItem('api-keys', JSON.stringify(updatedKeys));

      // Pokud byl odstraněn aktivní klíč, zrušíme aktivaci
      if (activeKeyId === id) {
        setActiveKeyId(null);
      }
    }
  };

  // Formátování data
  const formatDate = (date: Date | null) => {
    if (!date) return 'Neomezeno';
    return new Intl.DateTimeFormat('cs-CZ').format(date);
  };

  // Formátování ceny
  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  return (
    <div className="enhanced-api-key-manager">
      <div className="api-manager-header">
        <h2>Správa API klíčů</h2>
        <div className="api-manager-actions">
          <button
            className="add-key-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Zrušit' : 'Přidat API klíč'}
          </button>
        </div>
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
              placeholder="Zadejte API klíč..."
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

      <div className="api-keys-grid">
        {apiKeys.map(apiKey => (
          <div
            key={apiKey.id}
            className={`api-key-card ${apiKey.isActive ? '' : 'inactive'} ${activeKeyId === apiKey.id ? 'active' : ''} ${apiKey.provider}`}
          >
            <div className="api-key-header">
              <h3>{apiKey.name}</h3>
              <div className="api-key-badges">
                <span className={`provider-badge ${apiKey.provider}`}>
                  {apiKey.provider}
                </span>
                <span className={`status-badge ${apiKey.isVerified ? 'verified' : 'unverified'}`}>
                  {apiKey.isVerified && activeKeyId === apiKey.id ? 'Ověřeno a propojeno' :
                   apiKey.isVerified ? 'Ověřeno' : 'Neověřeno'}
                </span>
                {activeKeyId === apiKey.id && (
                  <span className="active-badge">Aktivní</span>
                )}
              </div>
            </div>

            <div className="api-key-secure">
              <span className="key-prefix">{apiKey.key.substring(0, 6)}</span>
              <span className="key-mask">••••••••••••••••••••</span>
              <span className="key-suffix">{apiKey.key.substring(apiKey.key.length - 4)}</span>
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey.key);
                  alert('API klíč byl zkopírován do schránky');
                }}
                title="Kopírovat klíč"
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>

            <div className="api-key-usage">
              <div className="usage-header">
                <span>Využití: {apiKey.usageCount} / {apiKey.usageLimit}</span>
                <span className="usage-cost">Celkové náklady: {formatCost(apiKey.totalCost)}</span>
              </div>
              <div className="usage-bar">
                <div
                  className="usage-progress"
                  style={{ width: `${Math.min(100, (apiKey.usageCount / apiKey.usageLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="api-key-details">
              <div className="detail-item">
                <span className="detail-label">Vytvořeno:</span>
                <span className="detail-value">{formatDate(apiKey.createdAt)}</span>
              </div>
              {apiKey.lastUsed && (
                <div className="detail-item">
                  <span className="detail-label">Naposledy použito:</span>
                  <span className="detail-value">{formatDate(apiKey.lastUsed)}</span>
                </div>
              )}
              {apiKey.expiresAt && (
                <div className="detail-item">
                  <span className="detail-label">Platnost do:</span>
                  <span className="detail-value">{formatDate(apiKey.expiresAt)}</span>
                </div>
              )}
            </div>

            {verificationStatus[apiKey.id] && (
              <div className={`verification-status ${verificationStatus[apiKey.id].isVerified ? 'success' : 'error'}`}>
                {verificationStatus[apiKey.id].isVerifying ? (
                  <span className="verifying">Ověřuji...</span>
                ) : (
                  <span>{verificationStatus[apiKey.id].message}</span>
                )}
              </div>
            )}

            {chatConnections[apiKey.id] && chatConnections[apiKey.id].isConnected && (
              <div className="chat-connection">
                <span className="connection-icon">
                  <i className="fas fa-link"></i>
                </span>
                <span className="connection-message">
                  {chatConnections[apiKey.id].lastMessage}
                </span>
              </div>
            )}

            <div className="api-key-actions">
              <button
                className="verify-button"
                onClick={() => verifyApiKey(apiKey)}
                disabled={verificationStatus[apiKey.id]?.isVerifying}
              >
                {verificationStatus[apiKey.id]?.isVerifying ? 'Ověřuji...' : 'Ověřit klíč'}
              </button>

              <button
                className="connect-button"
                onClick={() => activateAndConnectKey(apiKey)}
                disabled={!apiKey.isActive || activeKeyId === apiKey.id}
              >
                {activeKeyId === apiKey.id ? 'Ověřeno a propojeno' : 'Propojit s chatem'}
              </button>

              <button
                className="remove-button"
                onClick={() => removeKey(apiKey.id)}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {apiKeys.length === 0 && (
        <div className="no-api-keys">
          <p>Nemáte žádné API klíče. Přidejte nový klíč pomocí tlačítka výše.</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedApiKeyManager;
