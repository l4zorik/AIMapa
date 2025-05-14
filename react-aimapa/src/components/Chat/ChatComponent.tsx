import React, { useState, useRef, useEffect } from 'react';
import { ApiKey, ApiProviderType } from '../ApiKeys/ApiKeyManager';
import routingService from '../../services/RoutingService';
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

  // Vylepšená odpověď asistenta s podporou pro plány a mapu
  const handleAssistantResponse = async (userInput: string) => {
    setIsTyping(true);

    // Simulace zpoždění
    setTimeout(() => {
      setIsTyping(false);

      // Rozšířená analýza vstupu pro detekci lokací, tras a plánů
      const locationMatch = userInput.match(/najdi|ukaž|kde je|zobraz|vyhledej|najít|ukázat|vyhledat|místo|lokace|lokaci|bod/i);
      const routeMatch = userInput.match(/trasa|cesta|jak se dostat|navigace|naviguj|naplánuj cestu|trasu|cestu/i);
      const planMatch = userInput.match(/plán|naplánuj|vytvoř plán|přidej plán|nový plán|plánování|úkol|úkoly/i);

      // Detekce požadavků na přidání lokace k úkolu
      const taskLocationMatch = userInput.match(/přidej\s+(?:lokaci|místo|lokalitu)?\s*([a-zá-žA-ZÁ-Ž\s]+)\s+(?:k|do)\s+(?:úkolu|úkol|tasku)/i) ||
                               userInput.match(/přidej\s+(?:k|do)\s+(?:úkolu|úkol|tasku).*(?:lokaci|místo|lokalitu)/i) ||
                               userInput.match(/dej tam jakoukoliv lokalitu/i) ||
                               userInput.match(/přidej jakoukoliv lokaci/i) ||
                               userInput.match(/přidej místo k úkolu/i);

      // Detekce konkrétních míst nebo tras
      const pragueMention = userInput.match(/prah[auy]|prague/i);
      const brnoMention = userInput.match(/brn[oau]/i);
      const ostravaMention = userInput.match(/ostrav[auy]/i);
      const plzenMention = userInput.match(/plz[eě]ň|pilsen/i);
      const hradecMention = userInput.match(/hradec/i);
      const hodoninMention = userInput.match(/hodon[ií]n/i);
      const rohatecMention = userInput.match(/rohatec/i);

      let response: Message;

      // Zpracování dotazu na plán
      if (planMatch) {
        console.log('Detekován požadavek na vytvoření plánu:', userInput);

        // Nejprve přidáme zprávu o vytváření plánu
        response = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: `Vytvářím plán na základě vašeho požadavku "${userInput}". Plán bude obsahovat automaticky vygenerované úkoly a lokace. Můžete ho pak dále upravovat v sekci plánování.`,
          timestamp: new Date()
        };

        // Aktualizace zpráv
        setMessages(prev => [...prev, response]);

        // Resetujeme příznak trvalého odstranění plánů, pokud existuje
        // Toto zajistí, že plány budou moci být vytvořeny i po předchozím odstranění
        try {
          // Použijeme centralizovanou službu pro resetování příznaku
          const planStorageService = (await import('../../services/PlanStorageService')).default;
          if (planStorageService.werePlansRemoved()) {
            console.log('Resetuji příznak trvalého odstranění plánů před vytvořením nového plánu');
            planStorageService.resetPlansRemovedFlag();
          }
        } catch (error) {
          console.error('Chyba při resetování příznaku trvalého odstranění plánů:', error);
        }

        // Vytvoření události pro vytvoření plánu
        const planEvent = new CustomEvent('createPlanFromChat', {
          detail: {
            query: userInput,
            source: 'chat'
          }
        });

        // Vyvolání události pro vytvoření plánu
        console.log('Vyvolávám událost createPlanFromChat');
        window.dispatchEvent(planEvent);

        // Vynucené překreslení seznamu plánů po krátké prodlevě
        // Použijeme delší timeout, abychom zajistili, že plán bude vytvořen a uložen
        setTimeout(() => {
          console.log('Kontroluji vytvoření plánu v localStorage');
          // Načtení aktuálních plánů z localStorage
          const savedPlans = localStorage.getItem('plans');
          if (savedPlans) {
            try {
              const parsedPlans = JSON.parse(savedPlans);
              console.log('Načteno plánů z localStorage:', parsedPlans.length);

              // Najdeme nejnovější plán (předpokládáme, že byl právě vytvořen)
              if (parsedPlans.length > 0) {
                // Seřadíme plány podle data vytvoření (nejnovější první)
                const sortedPlans = [...parsedPlans].sort((a, b) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                const newestPlan = sortedPlans[0];
                console.log('Nejnovější plán:', newestPlan.title, 'ID:', newestPlan.id);

                // Vyvolání události pro aktualizaci UI s ID nového plánu
                const plansUpdatedEvent = new CustomEvent('plansUpdated', {
                  detail: {
                    action: 'create',
                    planId: newestPlan.id,
                    source: 'chat',
                    setActive: true // Explicitně nastavíme plán jako aktivní
                  }
                });
                console.log('Vyvolávám událost plansUpdated s ID plánu:', newestPlan.id);
                window.dispatchEvent(plansUpdatedEvent);

                // Vyvoláme ještě jednu událost pro aktualizaci zobrazení plánu
                // Použijeme delší timeout, aby se stihly zpracovat všechna změny
                setTimeout(() => {
                  console.log('Vyvolávám událost refreshPlanDisplay pro vynucení aktualizace UI');
                  const refreshEvent = new CustomEvent('refreshPlanDisplay', {
                    detail: {
                      planId: newestPlan.id,
                      action: 'forceRefresh'
                    }
                  });
                  window.dispatchEvent(refreshEvent);
                }, 200);
              }
            } catch (error) {
              console.error('Chyba při načítání plánů z localStorage:', error);
            }
          }
        }, 800);

        // Aktualizace celkových nákladů
        if (isCostEstimationEnabled) {
          setTotalCost(prev => prev + estimatedCost);
          setEstimatedCost(0);
        }

        return; // Ukončíme funkci zde
      }

      // Zpracování dotazu na trasu
      if (routeMatch) {
        let start = { lat: 50.0755, lng: 14.4378, name: 'Praha' };
        let end = { lat: 49.1951, lng: 16.6068, name: 'Brno' };

        // Detekce konkrétních míst pro trasu
        if (pragueMention && brnoMention) {
          start = { lat: 50.0755, lng: 14.4378, name: 'Praha' };
          end = { lat: 49.1951, lng: 16.6068, name: 'Brno' };
        } else if (pragueMention && ostravaMention) {
          start = { lat: 50.0755, lng: 14.4378, name: 'Praha' };
          end = { lat: 49.8209, lng: 18.2625, name: 'Ostrava' };
        } else if (pragueMention && plzenMention) {
          start = { lat: 50.0755, lng: 14.4378, name: 'Praha' };
          end = { lat: 49.7384, lng: 13.3736, name: 'Plzeň' };
        } else if (brnoMention && ostravaMention) {
          start = { lat: 49.1951, lng: 16.6068, name: 'Brno' };
          end = { lat: 49.8209, lng: 18.2625, name: 'Ostrava' };
        }

        // Základní trasa bez geometrie
        const basicRoute = { start, end };

        // Zobrazení zprávy o vyhledávání trasy
        setMessages(prev => [...prev, {
          id: `assistant-searching-${Date.now()}`,
          sender: 'assistant',
          content: `Vyhledávám trasu z ${start.name} do ${end.name}...`,
          timestamp: new Date()
        }]);

        // Asynchronní vyhledání trasy pomocí routingService
        if (!routingService.getApiKey()) {
          // Použijeme testovací klíč pro ukázku
          routingService.setApiKey('5b3ce3597851110001cf6248f8f3f5e5a0a94a5c8e9e7e7e9e7e7e9e');
        }

        // Vyhledání trasy pomocí Promise
        routingService.getRoute(start, end)
          .then(routeResult => {
            // Vytvoření rozšířené trasy s geometrií
            const enhancedRoute = {
              ...basicRoute,
              geometry: routeResult.geometry,
              distance: routeResult.distance,
              duration: routeResult.duration
            };

            // Vytvoření události pro animované zaměření na trasu
            const focusEvent = new CustomEvent('focusOnRoute', {
              detail: {
                route: enhancedRoute,
                animate: true,
                duration: 1.5,
                taskId: `chat-${Date.now()}`,
                taskTitle: `Trasa ${start.name} - ${end.name}`,
                showPath: true
              }
            });

            // Vyvolání události pro zaměření na trasu
            window.dispatchEvent(focusEvent);

            // Formátování vzdálenosti a času
            const formattedDistance = routingService.formatDistance(routeResult.distance);
            const formattedDuration = routingService.formatDuration(routeResult.duration);

            const routeResponse: Message = {
              id: `assistant-${Date.now()}`,
              sender: 'assistant' as 'user' | 'assistant',
              content: `Našel jsem trasu z ${start.name} do ${end.name}. Cesta je dlouhá ${formattedDistance} a trvá přibližně ${formattedDuration}. Trasa je zobrazena na mapě. Chcete tuto trasu přidat do plánu?`,
              timestamp: new Date(),
              route: enhancedRoute
            };

            // Volání callbacku pro zobrazení trasy na mapě
            if (onRouteSelect) {
              onRouteSelect(enhancedRoute);
            }

            // Aktualizace zpráv
            setMessages(prev => [...prev, routeResponse]);

            // Aktualizace celkových nákladů
            if (isCostEstimationEnabled) {
              setTotalCost(prev => prev + estimatedCost);
              setEstimatedCost(0);
            }
          })
          .catch(error => {
            console.error('Chyba při vyhledávání trasy:', error);

            // V případě chyby použijeme základní trasu
            const errorResponse: Message = {
              id: `assistant-${Date.now()}`,
              sender: 'assistant' as 'user' | 'assistant',
              content: `Omlouvám se, ale nepodařilo se mi vyhledat přesnou trasu z ${start.name} do ${end.name}. Zobrazuji alespoň přímou linii mezi těmito body. Chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`,
              timestamp: new Date(),
              route: basicRoute
            };

            // Volání callbacku pro zobrazení základní trasy na mapě
            if (onRouteSelect) {
              onRouteSelect(basicRoute);
            }

            // Aktualizace zpráv
            setMessages(prev => [...prev, errorResponse]);

            // Aktualizace celkových nákladů
            if (isCostEstimationEnabled) {
              setTotalCost(prev => prev + estimatedCost);
              setEstimatedCost(0);
            }
          });

        return; // Ukončíme funkci zde
      }

      // Zpracování dotazu na lokaci
      if (locationMatch || taskLocationMatch) {
        let location = { lat: 50.0811, lng: 14.4280, name: 'Václavské náměstí, Praha' };

        // Detekce konkrétních míst
        if (pragueMention) {
          location = { lat: 50.0755, lng: 14.4378, name: 'Praha' };
        } else if (brnoMention) {
          location = { lat: 49.1951, lng: 16.6068, name: 'Brno' };
        } else if (ostravaMention) {
          location = { lat: 49.8209, lng: 18.2625, name: 'Ostrava' };
        } else if (plzenMention) {
          location = { lat: 49.7384, lng: 13.3736, name: 'Plzeň' };
        } else if (hradecMention) {
          location = { lat: 50.2099, lng: 15.8325, name: 'Hradec Králové' };
        } else if (hodoninMention) {
          location = { lat: 48.8492, lng: 17.1247, name: 'Hodonín' };
        } else if (rohatecMention) {
          location = { lat: 48.8783, lng: 17.1750, name: 'Rohatec' };
        }

        // Vytvoření události pro animované zaměření na lokaci
        const focusEvent = new CustomEvent('focusOnLocation', {
          detail: {
            location,
            zoom: 14,
            animate: true,
            duration: 1.5,
            taskId: `chat-${Date.now()}`,
            taskTitle: `Lokace ${location.name}`
          }
        });

        // Vyvolání události pro zaměření na lokaci
        window.dispatchEvent(focusEvent);

        response = {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          content: `Našel jsem lokaci ${location.name}. Místo je zobrazeno na mapě. Chcete tuto lokaci přidat do plánu?`,
          timestamp: new Date(),
          location
        };

        // Volání callbacku pro zobrazení místa na mapě
        if (onLocationSelect) {
          onLocationSelect(location);
        }

        // Aktualizace zpráv
        setMessages(prev => [...prev, response]);

        // Aktualizace celkových nákladů
        if (isCostEstimationEnabled) {
          setTotalCost(prev => prev + estimatedCost);
          setEstimatedCost(0);
        }

        return; // Ukončíme funkci zde
      }

      // Obecná odpověď (pokud neodpovídá žádnému specifickému typu)
      response = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: `Rozumím vašemu dotazu "${userInput}". Mohu vám pomoci s:
1. Vyhledáváním míst - např. "Kde je Václavské náměstí?"
2. Plánováním tras - např. "Jak se dostanu z Prahy do Brna?"
3. Vytvářením plánů - např. "Vytvoř plán na výlet do Prahy"

Co byste chtěli udělat?`,
        timestamp: new Date()
      };

      // Aktualizace zpráv
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
