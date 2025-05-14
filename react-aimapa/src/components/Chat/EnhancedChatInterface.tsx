import React, { useState, useEffect, useRef } from 'react';
import './EnhancedChatInterface.css';
import { ApiKey } from '../ApiKeys/EnhancedApiKeyManager';
import simpleGeminiService from '../../services/SimpleGeminiService';
import ApiServices, { ApiService } from '../Services/ApiServices';
import ChatSessionList from './ChatSessionList';
import QuickPlanCreator from './QuickPlanCreator';
import chatSessionService from '../../services/ChatSessionService';
import { ChatSession, ChatMessage as SessionChatMessage, MessageRole } from '../../models/ChatSession';

// Rozhraní pro stav API
interface ApiStatus {
  isConnected: boolean;
  provider: string | null;
  model: string | null;
  keyName: string | null;
  lastVerified: Date | null;
  errorMessage: string | null;
}

// Rozhraní pro vlastnosti komponenty
interface EnhancedChatInterfaceProps {
  selectedApiKey: ApiKey | null;
  onSendMessage: (message: string) => Promise<string>;
  onClearChat: () => void;
  onApiStatusChange?: (status: ApiStatus) => void;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  selectedApiKey,
  onSendMessage,
  onClearChat,
  onApiStatusChange
}) => {
  // Stav pro chatové sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);

  // Stav pro zprávy
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Stav pro API
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    isConnected: false,
    provider: null,
    model: null,
    keyName: null,
    lastVerified: null,
    errorMessage: null
  });

  // Stav pro rychlé vytvoření plánu
  const [quickPlanData, setQuickPlanData] = useState<{
    show: boolean;
    originalCommand: string;
    originalTitle: string;
  }>({
    show: false,
    originalCommand: '',
    originalTitle: ''
  });

  // Stav pro kredit
  const [remainingCredit, setRemainingCredit] = useState<number>(50);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Stav pro služby
  const [showServices, setShowServices] = useState<boolean>(false);

  // Reference pro automatické scrollování
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efekt pro načtení chatových sessions při inicializaci
  useEffect(() => {
    loadChatSessions();

    // Přidání event listeneru pro ukládání aktivní session při zavření okna
    const handleBeforeUnload = () => {
      if (activeSessionId) {
        chatSessionService.setActiveSession(activeSessionId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeSessionId]);

  // Efekt pro aktualizaci stavu API při změně vybraného klíče
  useEffect(() => {
    if (selectedApiKey) {
      const newStatus: ApiStatus = {
        isConnected: selectedApiKey.isVerified,
        provider: selectedApiKey.provider,
        model: getModelForProvider(selectedApiKey.provider),
        keyName: selectedApiKey.name,
        lastVerified: new Date(),
        errorMessage: selectedApiKey.isVerified ? null : 'API klíč není ověřen'
      };

      setApiStatus(newStatus);

      if (onApiStatusChange) {
        onApiStatusChange(newStatus);
      }

      // Přidání systémové zprávy o připojení API
      if (selectedApiKey.isVerified) {
        addSystemMessage(`Připojeno k API: ${selectedApiKey.provider} (${selectedApiKey.name})`);
      } else {
        addWarningMessage(`API klíč ${selectedApiKey.name} není ověřen. Ověřte klíč před použitím.`);
      }
    } else {
      setApiStatus({
        isConnected: false,
        provider: null,
        model: null,
        keyName: null,
        lastVerified: null,
        errorMessage: 'Není vybrán žádný API klíč'
      });

      if (onApiStatusChange) {
        onApiStatusChange({
          isConnected: false,
          provider: null,
          model: null,
          keyName: null,
          lastVerified: null,
          errorMessage: 'Není vybrán žádný API klíč'
        });
      }

      addWarningMessage('Není vybrán žádný API klíč. Vyberte API klíč pro použití chatu.');
    }
  }, [selectedApiKey]);

  // Efekt pro aktualizaci aktivní session při změně activeSessionId
  useEffect(() => {
    if (activeSessionId) {
      const session = sessions.find(s => s.id === activeSessionId);
      if (session) {
        setActiveSession(session);
        setMessages(session.messages);
      }
    } else {
      setActiveSession(null);
      setMessages([]);
    }
  }, [activeSessionId, sessions]);

  // Efekt pro scrollování na konec chatu při nové zprávě
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efekt pro aktualizaci informací o kreditu
  useEffect(() => {
    // Aktualizace informací o kreditu každou sekundu, pokud je připojen Google API
    if (selectedApiKey?.provider === 'google' && apiStatus.isConnected) {
      const interval = setInterval(() => {
        setRemainingCredit(simpleGeminiService.getRemainingCredit());
        setTotalCost(simpleGeminiService.getTotalCost());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedApiKey, apiStatus.isConnected]);

  // Funkce pro načtení chatových sessions
  const loadChatSessions = () => {
    const chatHistory = chatSessionService.getChatHistory();
    setSessions(chatHistory.sessions);

    // Nastavení aktivní session
    if (chatHistory.activeSessionId) {
      console.log(`Načtena aktivní session z historie: ${chatHistory.activeSessionId}`);
      setActiveSessionId(chatHistory.activeSessionId);

      // Explicitně nastavíme aktivní session v service, aby byla uložena do localStorage
      chatSessionService.setActiveSession(chatHistory.activeSessionId);
    } else if (chatHistory.sessions.length > 0) {
      // Pokud není nastavena aktivní session, ale existují sessions, nastavíme nejnovější
      const sortedSessions = [...chatHistory.sessions].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );
      console.log(`Nastavena nejnovější session jako aktivní: ${sortedSessions[0].id}`);
      setActiveSessionId(sortedSessions[0].id);

      // Explicitně nastavíme aktivní session v service, aby byla uložena do localStorage
      chatSessionService.setActiveSession(sortedSessions[0].id);
    } else {
      // Pokud neexistují žádné sessions, vytvoříme novou
      console.log('Neexistují žádné sessions, vytvářím novou');
      createNewSession();
    }
  };

  // Funkce pro vytvoření nové session
  const createNewSession = () => {
    const newSession = chatSessionService.createSession();
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  };

  // Funkce pro přepnutí na jinou session
  const handleSelectSession = (sessionId: string) => {
    if (sessionId === activeSessionId) return;

    chatSessionService.setActiveSession(sessionId);
    setActiveSessionId(sessionId);
  };

  // Funkce pro přejmenování session
  const handleRenameSession = (sessionId: string, newTitle: string) => {
    chatSessionService.updateSessionTitle(sessionId, newTitle);

    // Aktualizace lokálního stavu
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, title: newTitle, updatedAt: new Date() }
        : session
    ));
  };

  // Funkce pro odstranění session
  const handleDeleteSession = (sessionId: string) => {
    chatSessionService.deleteSession(sessionId);
    loadChatSessions(); // Znovu načteme sessions, aby se správně nastavila nová aktivní session
  };

  // Funkce pro získání modelu podle poskytovatele
  const getModelForProvider = (provider: string): string => {
    switch (provider) {
      case 'openai':
        return 'GPT-4';
      case 'google':
        return 'Gemini 1.5 Flash';
      case 'anthropic':
        return 'Claude 3';
      case 'deepseek':
        return 'DeepSeek Coder';
      default:
        return 'Neznámý model';
    }
  };

  // Funkce pro přidání zprávy
  const addMessage = (role: MessageRole, content: string, metadata?: any) => {
    if (!activeSessionId) {
      // Pokud neexistuje aktivní session, vytvoříme novou
      const newSession = chatSessionService.createSession();
      setSessions(prev => [...prev, newSession]);
      setActiveSessionId(newSession.id);

      // Přidáme zprávu do nové session
      const newMessage: SessionChatMessage = {
        id: Date.now().toString(),
        role,
        content,
        timestamp: new Date(),
        metadata
      };

      chatSessionService.addMessageToSession(newSession.id, newMessage);
      setMessages([...newSession.messages, newMessage]);
    } else {
      // Přidáme zprávu do existující session
      const newMessage: SessionChatMessage = {
        id: Date.now().toString(),
        role,
        content,
        timestamp: new Date(),
        metadata
      };

      chatSessionService.addMessageToSession(activeSessionId, newMessage);
      setMessages(prev => [...prev, newMessage]);

      // Aktualizace sessions
      setSessions(prev => prev.map(session =>
        session.id === activeSessionId
          ? {
              ...session,
              messages: [...session.messages, newMessage],
              updatedAt: new Date()
            }
          : session
      ));
    }
  };

  // Pomocné funkce pro přidání zpráv různých typů
  const addUserMessage = (content: string, metadata?: any) => addMessage('user', content, metadata);
  const addAssistantMessage = (content: string, metadata?: any) => addMessage('assistant', content, metadata);
  const addSystemMessage = (content: string, metadata?: any) => addMessage('system', content, metadata);
  const addErrorMessage = (content: string, metadata?: any) => addMessage('error', content, metadata);
  const addWarningMessage = (content: string, metadata?: any) => addMessage('warning', content, metadata);

  // Funkce pro scrollování na konec chatu
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Funkce pro odeslání zprávy
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!selectedApiKey || !apiStatus.isConnected) {
      addErrorMessage('Nelze odeslat zprávu: Není připojen žádný API klíč');
      return;
    }

    const userMessage = inputMessage;
    setInputMessage('');

    // Detekce, zda zpráva obsahuje příkaz pro vytvoření plánu
    const isPlanRequest = userMessage.toLowerCase().includes('vytvoř plán');
    const metadata = isPlanRequest ? { planRequest: true, planCommand: userMessage } : undefined;

    addUserMessage(userMessage, metadata);

    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage);

      // Pokud zpráva obsahovala příkaz pro vytvoření plánu, extrahujeme název plánu
      if (isPlanRequest) {
        const planTitleMatch = userMessage.match(/vytvoř plán\s+["']?([^"']+)["']?/i);
        if (planTitleMatch && planTitleMatch[1]) {
          const planTitle = planTitleMatch[1].trim();
          addAssistantMessage(response, {
            planRequest: true,
            planCommand: userMessage,
            planTitle: planTitle
          });
        } else {
          addAssistantMessage(response);
        }
      } else {
        addAssistantMessage(response);
      }
    } catch (error) {
      console.error('Chyba při odesílání zprávy:', error);
      addErrorMessage(`Chyba při komunikaci s API: ${error}`);

      setApiStatus(prev => ({
        ...prev,
        errorMessage: `Chyba při komunikaci s API: ${error}`
      }));

      if (onApiStatusChange) {
        onApiStatusChange({
          ...apiStatus,
          errorMessage: `Chyba při komunikaci s API: ${error}`
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Funkce pro vymazání chatu
  const handleClearChat = () => {
    if (!activeSessionId) return;

    if (window.confirm('Opravdu chcete vymazat všechny zprávy v této konverzaci?')) {
      chatSessionService.clearSessionMessages(activeSessionId);

      // Aktualizace lokálního stavu
      loadChatSessions();

      // Informování nadřazené komponenty
      onClearChat();
    }
  };

  // Funkce pro zobrazení dialogu pro rychlé vytvoření plánu
  const handleShowQuickPlanCreator = (message: SessionChatMessage) => {
    if (message.metadata?.planCommand && message.metadata?.planTitle) {
      setQuickPlanData({
        show: true,
        originalCommand: message.metadata.planCommand,
        originalTitle: message.metadata.planTitle
      });
    }
  };

  // Funkce pro vytvoření plánu z rychlého dialogu
  const handleQuickPlanCreate = async (command: string) => {
    setQuickPlanData({ show: false, originalCommand: '', originalTitle: '' });
    setInputMessage(command);

    // Automaticky odešleme zprávu
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Funkce pro přepnutí zobrazení služeb
  const toggleServices = () => {
    setShowServices(!showServices);
  };

  // Funkce pro výběr služby
  const handleSelectService = (service: ApiService) => {
    addSystemMessage(`Vybrána služba: ${service.name}`);

    // Přidání informační zprávy o službě
    setTimeout(() => {
      addAssistantMessage(`Aktivoval jsem službu "${service.name}". ${service.description}. Jak vám mohu s touto službou pomoci?`);
    }, 500);
  };

  // Formátování času
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="enhanced-chat-interface">
      <ChatSessionList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={createNewSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
      />

      <div className="chat-header">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white" />
            <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12ZM7 6H17V8H7V6Z" fill="white" />
          </svg>
          AI Chat
        </h2>
        <div className="api-status">
          {apiStatus.isConnected ? (
            <div className="api-connected">
              <span className="status-icon connected">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#2ecc71" />
                </svg>
              </span>
              <div className="status-details">
                <span className="status-model">{apiStatus.model}</span>
                <span className="status-provider">({apiStatus.provider})</span>
              </div>
            </div>
          ) : (
            <div className="api-disconnected">
              <span className="status-icon disconnected">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#e74c3c" />
                </svg>
              </span>
              <span className="status-message">Nepřipojeno</span>
            </div>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="welcome-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10.12h-6.78l2.74-2.82c-2.73-2.7-7.15-2.8-9.88-.1-2.73 2.71-2.73 7.08 0 9.79s7.15 2.71 9.88 0C18.32 15.65 19 14.08 19 12.1h2c0 1.98-.88 4.55-2.64 6.29-3.51 3.48-9.21 3.48-12.72 0-3.5-3.47-3.53-9.11-.02-12.58s9.14-3.47 12.65 0L21 3v7.12zM12.5 8v4.25l3.5 2.08-.72 1.21L11 13V8h1.5z" fill="#3498db" />
              </svg>
            </div>
            <h3>Vítejte v AI Chatu</h3>
            <p>Jsem váš osobní asistent pro navigaci a plánování. Mohu vám pomoci s:</p>
            <ul className="welcome-features">
              <li>Vyhledáváním míst a tras</li>
              <li>Vytvářením plánů a úkolů</li>
              <li>Navigací podle plánu</li>
              <li>Odpověďmi na vaše otázky</li>
            </ul>
            <p>Napište mi zprávu a začněte konverzaci!</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`chat-message ${message.role} ${message.metadata?.planRequest ? 'plan-request' : ''}`}
              onClick={() => message.role === 'user' && message.metadata?.planRequest && handleShowQuickPlanCreator(message)}
            >
              <div className="message-header">
                <span className="message-role">
                  {message.role === 'user' ? 'Vy' :
                   message.role === 'assistant' ? 'AI Asistent' :
                   message.role === 'system' ? 'Systém' :
                   message.role === 'error' ? 'Chyba' : 'Upozornění'}
                </span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-content">{message.content}</div>
              {message.role === 'user' && message.metadata?.planRequest && (
                <div className="message-actions">
                  <button
                    className="quick-plan-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowQuickPlanCreator(message);
                    }}
                    title="Vytvořit podobný plán"
                    aria-label="Vytvořit podobný plán"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                      <path d="M19 13H14.82C14.4 11.84 13.3 11 12 11C10.7 11 9.6 11.84 9.18 13H5C3.9 13 3 13.9 3 15V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15C21 13.9 20.1 13 19 13ZM12 15C12.55 15 13 15.45 13 16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16C11 15.45 11.45 15 12 15ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" fill="currentColor" />
                    </svg>
                  </button>
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
          placeholder="Napište zprávu..."
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
            className="services-button"
            onClick={toggleServices}
            title="Služby využívající API klíč"
            aria-label="Služby využívající API klíč"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 19H16V15H13.32C12.18 17.42 9.72 19 7 19C3.14 19 0 15.86 0 12C0 8.14 3.14 5 7 5C9.72 5 12.18 6.58 13.32 9H22V15H24V19H22ZM18 17H20V13H18V17ZM7 7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17C9.76 17 12 14.76 12 12C12 9.24 9.76 7 7 7ZM7 15C5.34 15 4 13.66 4 12C4 10.34 5.34 9 7 9C8.66 9 10 10.34 10 12C10 13.66 8.66 15 7 15Z" fill="currentColor" />
            </svg>
          </button>

          <button
            className="plan-button"
            onClick={() => {
              if (messages.length > 0) {
                const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
                if (lastUserMessage) {
                  // Vyvolání události pro vytvoření plánu z chatu
                  const createPlanEvent = new CustomEvent('createPlanFromChat', {
                    detail: {
                      query: lastUserMessage.content,
                      source: 'chat'
                    }
                  });
                  window.dispatchEvent(createPlanEvent);
                }
              }
            }}
            disabled={messages.length === 0 || isLoading}
            title="Vytvořit plán z chatu"
            aria-label="Vytvořit plán z chatu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z" fill="currentColor" />
            </svg>
          </button>

          <button
            className="clear-button"
            onClick={handleClearChat}
            disabled={messages.length === 0 || isLoading}
            title="Vymazat historii chatu"
            aria-label="Vymazat historii chatu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor" />
            </svg>
          </button>

          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !apiStatus.isConnected || isLoading}
            title="Odeslat zprávu"
            aria-label="Odeslat zprávu"
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {apiStatus.errorMessage && (
        <div className="api-error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{apiStatus.errorMessage}</span>
        </div>
      )}

      {/* Zobrazení informací o kreditu pro Google API */}
      {selectedApiKey?.provider === 'google' && apiStatus.isConnected && (
        <div className="api-credit-info">
          <div className="credit-bar">
            <div
              className="credit-progress"
              style={{ width: `${(remainingCredit / 50) * 100}%` }}
            ></div>
          </div>
          <div className="credit-text">
            <span>Zbývající kredit: {remainingCredit.toFixed(2)} CZK</span>
            <span>Celkové náklady: {totalCost.toFixed(2)} CZK</span>
          </div>
        </div>
      )}

      {/* Komponenta pro služby */}
      {showServices && (
        <ApiServices
          selectedApiKey={selectedApiKey ? {
            provider: selectedApiKey.provider,
            isVerified: selectedApiKey.isVerified
          } : null}
          onClose={toggleServices}
          onSelectService={handleSelectService}
        />
      )}

      {/* Dialog pro rychlé vytvoření plánu */}
      {quickPlanData.show && (
        <div className="modal-overlay">
          <QuickPlanCreator
            originalCommand={quickPlanData.originalCommand}
            originalTitle={quickPlanData.originalTitle}
            onCreatePlan={handleQuickPlanCreate}
            onCancel={() => setQuickPlanData({ show: false, originalCommand: '', originalTitle: '' })}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedChatInterface;
