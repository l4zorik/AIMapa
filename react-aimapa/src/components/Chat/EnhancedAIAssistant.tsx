import React, { useState, useEffect, useRef } from 'react';
import './EnhancedAIAssistant.css';

interface Location {
  lat: number;
  lng: number;
  name?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
  locations?: Location[];
}

interface ApiStatus {
  isConnected: boolean;
  provider?: string;
  model?: string;
  errorMessage?: string;
  remainingCredits?: number;
  maxCredits?: number;
}

interface EnhancedAIAssistantProps {
  apiKey?: string;
  onLocationSelect?: (location: Location) => void;
  onRouteSelect?: (routeData: {
    start: Location;
    end: Location;
    waypoints?: Location[];
  }) => void;
  onPlanCreate?: (plan: any) => void;
  onApiStatusChange?: (status: ApiStatus) => void;
}

const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({
  apiKey,
  onLocationSelect,
  onRouteSelect,
  onPlanCreate,
  onApiStatusChange
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Vítejte v AI Mapě! Jak vám mohu pomoci s navigací, plánováním nebo vyhledáváním míst?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isConnected: !!apiKey,
    provider: apiKey ? 'google' : undefined,
    model: apiKey ? 'Gemini 1.5 Flash' : undefined,
    remainingCredits: 100,
    maxCredits: 100
  });

  // Automatické scrollování na konec zpráv
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Aktualizace stavu API při změně API klíče
  useEffect(() => {
    setApiStatus(prev => ({
      ...prev,
      isConnected: !!apiKey,
      provider: apiKey ? 'google' : undefined,
      model: apiKey ? 'Gemini 1.5 Flash' : undefined
    }));

    if (onApiStatusChange && apiKey) {
      onApiStatusChange({
        isConnected: true,
        provider: 'google',
        model: 'Gemini 1.5 Flash',
        remainingCredits: 100,
        maxCredits: 100
      });
    }
  }, [apiKey, onApiStatusChange]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Formátování času
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Přidání zprávy uživatele
  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  // Přidání zprávy asistenta
  const addAssistantMessage = (content: string, locations?: Location[]) => {
    const newMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
      locations
    };

    setMessages(prev => [...prev, newMessage]);
  };

  // Přidání chybové zprávy
  const addErrorMessage = (content: string) => {
    const newMessage: Message = {
      id: `error-${Date.now()}`,
      role: 'error',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  // Přepínání zobrazení služeb
  const toggleServices = () => {
    setShowServices(prev => !prev);
  };

  // Zpracování odeslání zprávy
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    addUserMessage(userMessage);

    setIsLoading(true);

    try {
      // Simulace odpovědi AI s rozpoznáváním lokací
      const response = await simulateAIResponse(userMessage);
      addAssistantMessage(response.text, response.locations);

      // Pokud byly rozpoznány lokace, nabídneme je uživateli
      if (response.locations && response.locations.length > 0 && onLocationSelect) {
        response.locations.forEach(location => {
          if (location.name) {
            // Automaticky zobrazíme lokaci na mapě
            onLocationSelect(location);
          }
        });
      }

      // Pokud byla rozpoznána trasa, nabídneme ji uživateli
      if (response.route && onRouteSelect) {
        // Vytvoříme objekt s trasou a přidáme waypoints pouze pokud existují
        const routeData = {
          start: response.route.start,
          end: response.route.end
        };

        // Přidáme waypoints pouze pokud existují v response.route
        if ('waypoints' in response.route) {
          Object.assign(routeData, { waypoints: response.route.waypoints });
        }

        onRouteSelect(routeData);
      }

      // Pokud byl rozpoznán plán, vytvoříme ho
      if (response.plan && onPlanCreate) {
        onPlanCreate(response.plan);
      }

    } catch (error) {
      console.error('Chyba při odesílání zprávy:', error);
      addErrorMessage(`Chyba při komunikaci s API: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulace odpovědi AI s rozpoznáváním lokací a tras
  const simulateAIResponse = async (userMessage: string) => {
    // Simulace zpoždění odpovědi
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulace spotřeby kreditů
    const usedCredits = Math.floor(Math.random() * 5) + 1;
    setApiStatus(prev => ({
      ...prev,
      remainingCredits: Math.max(0, (prev.remainingCredits || 100) - usedCredits)
    }));

    if (onApiStatusChange) {
      onApiStatusChange({
        ...apiStatus,
        remainingCredits: Math.max(0, (apiStatus.remainingCredits || 100) - usedCredits)
      });
    }

    // Detekce lokací v textu
    const locationRegex = /(Praha|Brno|Ostrava|Plzeň|Liberec|Olomouc|Hradec Králové|České Budějovice|Ústí nad Labem|Pardubice)/gi;
    const matches = userMessage.match(locationRegex);

    const locations: Location[] = [];

    if (matches) {
      matches.forEach(match => {
        // Simulace souřadnic pro rozpoznaná města
        const cityCoordinates: {[key: string]: {lat: number, lng: number}} = {
          'praha': {lat: 50.0755, lng: 14.4378},
          'brno': {lat: 49.1951, lng: 16.6068},
          'ostrava': {lat: 49.8209, lng: 18.2625},
          'plzeň': {lat: 49.7384, lng: 13.3736},
          'liberec': {lat: 50.7663, lng: 15.0543},
          'olomouc': {lat: 49.5938, lng: 17.2508},
          'hradec králové': {lat: 50.2092, lng: 15.8328},
          'české budějovice': {lat: 48.9747, lng: 14.4744},
          'ústí nad labem': {lat: 50.6607, lng: 14.0328},
          'pardubice': {lat: 50.0343, lng: 15.7812}
        };

        const cityKey = match.toLowerCase();
        if (cityCoordinates[cityKey]) {
          locations.push({
            lat: cityCoordinates[cityKey].lat,
            lng: cityCoordinates[cityKey].lng,
            name: match
          });
        }
      });
    }

    // Detekce požadavku na trasu
    let route = null;
    if (userMessage.toLowerCase().includes('trasa') ||
        userMessage.toLowerCase().includes('cesta') ||
        userMessage.toLowerCase().includes('jak se dostanu')) {

      // Pokud máme dvě nebo více lokací, použijeme první jako start a poslední jako cíl
      if (locations.length >= 2) {
        route = {
          start: locations[0],
          end: locations[locations.length - 1],
          mode: userMessage.toLowerCase().includes('autem') ? 'car' :
                userMessage.toLowerCase().includes('pěšky') ? 'walk' :
                userMessage.toLowerCase().includes('mhd') ? 'transit' : 'car'
        };
      }
    }

    // Detekce požadavku na vytvoření plánu
    let plan = null;
    if (userMessage.toLowerCase().includes('plán') ||
        userMessage.toLowerCase().includes('naplánuj') ||
        userMessage.toLowerCase().includes('vytvoř plán')) {

      // Vytvoření jednoduchého plánu s lokacemi
      if (locations.length > 0) {
        plan = {
          title: `Plán: ${locations.map(loc => loc.name).join(' - ')}`,
          description: `Plán vytvořený z chatu: ${userMessage}`,
          items: locations.map((loc, index) => ({
            id: `task-${Date.now()}-${index}`,
            title: `Navštívit ${loc.name}`,
            description: `Úkol vytvořený z chatu`,
            location: loc,
            completed: false,
            createdAt: new Date()
          }))
        };
      }
    }

    // Vytvoření odpovědi
    let responseText = '';

    if (locations.length > 0) {
      responseText += `Našel jsem tyto lokace: ${locations.map(loc => loc.name).join(', ')}. `;

      if (route) {
        responseText += `Mohu vám ukázat trasu z ${route.start.name} do ${route.end.name} ${route.mode === 'car' ? 'autem' : route.mode === 'walk' ? 'pěšky' : 'veřejnou dopravou'}. `;
      }

      if (plan) {
        responseText += `Vytvořil jsem pro vás plán s ${plan.items.length} úkoly. `;
      }
    } else {
      responseText = `Rozumím vašemu dotazu "${userMessage}". Jak vám mohu dále pomoci s mapou nebo plánováním?`;
    }

    return {
      text: responseText,
      locations,
      route,
      plan
    };
  };

  return (
    <div className="enhanced-ai-assistant">
      <div className="chat-header">
        <h2>AI Asistent</h2>
        <div className="api-status">
          {apiStatus.isConnected ? (
            <div className="api-connected">
              <i className="fas fa-check-circle"></i>
              <span>Připojeno: {apiStatus.model}</span>
            </div>
          ) : (
            <div className="api-disconnected">
              <i className="fas fa-times-circle"></i>
              <span>Nepřipojeno</span>
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Vítejte v AI Mapě! Jak vám mohu pomoci s navigací nebo hledáním míst?</p>
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className={`chat-message ${message.role}`}>
              <div className="message-header">
                <span className="message-role">
                  {message.role === 'user' ? 'Vy' :
                   message.role === 'assistant' ? 'AI Asistent' :
                   message.role === 'system' ? 'Systém' : 'Chyba'}
                </span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-content">{message.content}</div>
              {message.locations && message.locations.length > 0 && (
                <div className="message-locations">
                  {message.locations.map((location, index) => (
                    <div
                      key={`loc-${index}`}
                      className="location-chip"
                      onClick={() => onLocationSelect && onLocationSelect(location)}
                    >
                      <i className="fas fa-map-marker-alt"></i>
                      {location.name || `Lokace ${index + 1}`}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Napište zprávu... (např. 'Kde je Praha?' nebo 'Jak se dostanu z Prahy do Brna?')"
          disabled={!apiStatus.isConnected || isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <div className="chat-actions">
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !apiStatus.isConnected || isLoading}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>

      {apiStatus.remainingCredits !== undefined && apiStatus.maxCredits !== undefined && (
        <div className="credit-bar">
          <div className="credit-progress-container">
            <div
              className="credit-progress"
              style={{ width: `${(apiStatus.remainingCredits / apiStatus.maxCredits) * 100}%` }}
            ></div>
          </div>
          <div className="credit-text">
            <span>Zbývající kredit: {apiStatus.remainingCredits} Kč</span>
            <span>Max: {apiStatus.maxCredits} Kč</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAIAssistant;
