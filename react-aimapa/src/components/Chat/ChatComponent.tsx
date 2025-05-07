import React, { useState, useRef, useEffect } from 'react';
import { ApiKey, ApiProviderType } from '../ApiKeys/ApiKeyManager';
import './ChatComponent.css';

// Rozhraní pro zprávu
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  route?: {
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  };
}

// Rozhraní pro model
interface Model {
  id: string;
  name: string;
  provider: ApiProviderType;
  description: string;
  contextLength: number;
  isAvailable: boolean;
}

interface ChatComponentProps {
  apiKey?: ApiKey;
  onLocationSelect?: (location: { lat: number; lng: number; name?: string }) => void;
  onRouteSelect?: (route: { 
    start: { lat: number; lng: number; name?: string }; 
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  }) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ 
  apiKey, 
  onLocationSelect,
  onRouteSelect
}) => {
  // Dostupné modely
  const availableModels: Model[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      description: 'Nejpokročilejší model od OpenAI',
      contextLength: 8192,
      isAvailable: !!apiKey && apiKey.provider === 'openai'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google',
      description: 'Výkonný model od Google',
      contextLength: 32768,
      isAvailable: !!apiKey && apiKey.provider === 'google'
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      provider: 'anthropic',
      description: 'Bezpečný a výkonný model od Anthropic',
      contextLength: 100000,
      isAvailable: !!apiKey && apiKey.provider === 'anthropic'
    },
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      provider: 'deepseek',
      description: 'Cenově efektivní model',
      contextLength: 16384,
      isAvailable: !!apiKey && apiKey.provider === 'deepseek'
    }
  ];

  // Stav
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: 'Vítejte v AI Mapě! Jak vám mohu pomoci s navigací nebo vyhledáváním míst?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [isCostEstimationEnabled, setIsCostEstimationEnabled] = useState(false);
  const [maxCostLimit, setMaxCostLimit] = useState<number>(0.05);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Efekt pro scrollování na konec chatu
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efekt pro aktualizaci dostupných modelů při změně API klíče
  useEffect(() => {
    if (apiKey) {
      // Najít první dostupný model pro daného poskytovatele
      const availableModel = availableModels.find(model => model.provider === apiKey.provider);
      if (availableModel) {
        setSelectedModel(availableModel.id);
      }
    }
  }, [apiKey]);

  // Funkce pro scrollování na konec chatu
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Zpracování změny vstupu
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Odhad ceny
    if (isCostEstimationEnabled) {
      const inputChars = e.target.value.length;
      // Průměrná délka odpovědi je přibližně 3x délka dotazu
      const estimatedOutputChars = inputChars * 3;
      
      // Ceny za 1K znaků (příklad pro Gemini Pro)
      const inputPrice = 0.000125;
      const outputPrice = 0.000375;
      
      const estimatedInputCost = (inputChars / 1000) * inputPrice;
      const estimatedOutputCost = (estimatedOutputChars / 1000) * outputPrice;
      
      setEstimatedCost(estimatedInputCost + estimatedOutputCost);
    }
  };

  // Zpracování změny modelu
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  // Zpracování odeslání zprávy
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Kontrola limitu nákladů
    if (isCostEstimationEnabled && estimatedCost > maxCostLimit) {
      alert(`Odhadovaná cena (${estimatedCost.toFixed(4)} USD) překračuje váš limit (${maxCostLimit} USD).`);
      return;
    }

    // Přidání zprávy uživatele
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulace odpovědi asistenta
    handleAssistantResponse(inputValue);
  };

  // Simulace odpovědi asistenta
  const handleAssistantResponse = (userInput: string) => {
    setIsTyping(true);
    
    // Simulace zpoždění
    setTimeout(() => {
      setIsTyping(false);
      
      // Analýza vstupu pro detekci lokací a tras
      const locationMatch = userInput.match(/najdi|ukaž|kde je|zobraz|vyhledej|najít|ukázat|vyhledat/i);
      const routeMatch = userInput.match(/trasa|cesta|jak se dostat|navigace|naviguj|naplánuj cestu/i);
      
      let response: Message;
      
      if (routeMatch) {
        // Simulace nalezení trasy
        const route = {
          start: { lat: 50.0755, lng: 14.4378, name: 'Praha' },
          end: { lat: 49.1951, lng: 16.6068, name: 'Brno' }
        };
        
        response = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: `Našel jsem trasu z Prahy do Brna. Cesta je dlouhá přibližně 205 km a trvá asi 2 hodiny jízdy autem. Chcete zobrazit podrobnosti?`,
          timestamp: new Date(),
          route
        };
        
        // Volání callbacku pro zobrazení trasy na mapě
        if (onRouteSelect) {
          onRouteSelect(route);
        }
      } else if (locationMatch) {
        // Simulace nalezení místa
        const location = { lat: 50.0811, lng: 14.4280, name: 'Václavské náměstí, Praha' };
        
        response = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: `Našel jsem Václavské náměstí v Praze. Je to jedno z nejznámějších a nejrušnějších míst v Praze, které se nachází v centru města. Chcete zobrazit další informace o tomto místě?`,
          timestamp: new Date(),
          location
        };
        
        // Volání callbacku pro zobrazení místa na mapě
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      } else {
        // Obecná odpověď
        response = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: `Rozumím vašemu dotazu "${userInput}". Mohu vám pomoci s vyhledáváním míst nebo plánováním tras. Zkuste se mě zeptat například "Kde je Václavské náměstí?" nebo "Jak se dostanu z Prahy do Brna?".`,
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, response]);
      
      // Aktualizace celkových nákladů
      if (isCostEstimationEnabled) {
        setTotalCost(prev => prev + estimatedCost);
        setEstimatedCost(0);
      }
    }, 1500);
  };

  // Zpracování klávesy Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Formátování zprávy s odkazy na místa a trasy
  const formatMessage = (message: Message) => {
    let formattedContent = message.content;
    
    // Přidání odkazů na místa
    if (message.location) {
      formattedContent += ` <a href="#" class="location-link" data-lat="${message.location.lat}" data-lng="${message.location.lng}">Zobrazit na mapě</a>`;
    }
    
    // Přidání odkazů na trasy
    if (message.route) {
      formattedContent += ` <a href="#" class="route-link" data-start-lat="${message.route.start.lat}" data-start-lng="${message.route.start.lng}" data-end-lat="${message.route.end.lat}" data-end-lng="${message.route.end.lng}">Zobrazit trasu</a>`;
    }
    
    return { __html: formattedContent };
  };

  // Získání aktuálního modelu
  const getCurrentModel = () => {
    return availableModels.find(model => model.id === selectedModel) || availableModels[0];
  };

  return (
    <div className="chat-component" ref={chatContainerRef}>
      <div className="chat-header">
        <h2>AI Asistent</h2>
        <div className="model-selector">
          <select 
            id="model-selector" 
            value={selectedModel} 
            onChange={handleModelChange}
          >
            {availableModels.map(model => (
              <option 
                key={model.id} 
                value={model.id}
                disabled={!model.isAvailable}
              >
                {model.name} {!model.isAvailable ? '(Nedostupný)' : ''}
              </option>
            ))}
          </select>
          <div className="model-info">
            <span className="model-provider">{getCurrentModel().provider}</span>
            <span className="model-context">{getCurrentModel().contextLength.toLocaleString()} znaků</span>
          </div>
        </div>
      </div>
      
      <div className="chat-settings">
        <div className="cost-estimation">
          <label htmlFor="cost-estimation-toggle">
            <input 
              type="checkbox" 
              id="cost-estimation-toggle"
              checked={isCostEstimationEnabled}
              onChange={() => setIsCostEstimationEnabled(!isCostEstimationEnabled)}
            />
            Povolit odhad nákladů
          </label>
          
          {isCostEstimationEnabled && (
            <div className="cost-limit-container">
              <label htmlFor="cost-limit">
                Max. limit na dotaz:
                <input 
                  type="number" 
                  id="cost-limit"
                  min="0.01"
                  step="0.01"
                  value={maxCostLimit}
                  onChange={(e) => setMaxCostLimit(parseFloat(e.target.value))}
                />
                USD
              </label>
              
              <div className="cost-display">
                <div className="estimated-cost">
                  <span className="cost-label">Odhadovaná cena:</span>
                  <span className="cost-value">${estimatedCost.toFixed(4)}</span>
                </div>
                <div className="total-cost">
                  <span className="cost-label">Celkové náklady:</span>
                  <span className="cost-value">${totalCost.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="chat-messages" id="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content" dangerouslySetInnerHTML={formatMessage(message)} />
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message assistant typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-input" onSubmit={handleSubmit}>
        <textarea 
          id="user-input" 
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Napište zprávu... (např. 'Kde je Václavské náměstí?' nebo 'Jak se dostanu z Prahy do Brna?')" 
          rows={2}
        />
        <button type="submit" id="send-button" disabled={!inputValue.trim() || (isCostEstimationEnabled && estimatedCost > maxCostLimit)}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
      
      {isCostEstimationEnabled && estimatedCost > maxCostLimit && (
        <div className="cost-warning">
          Upozornění: Odhadovaná cena překračuje váš limit.
        </div>
      )}
      
      {!apiKey && (
        <div className="no-api-key-warning">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Nemáte nastavený žádný API klíč. Přidejte API klíč v nastavení pro plnou funkčnost.</p>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
