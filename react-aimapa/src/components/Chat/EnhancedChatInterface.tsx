import React, { useState, useEffect, useRef } from 'react';
import './EnhancedChatInterface.css';
import { ApiKey } from '../ApiKeys/EnhancedApiKeyManager';
import GeminiService from '../../services/GeminiService';

// Typy zpráv
type MessageRole = 'user' | 'assistant' | 'system' | 'error' | 'warning';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

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
  // Stav pro zprávy
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  // Stav pro kredit
  const [remainingCredit, setRemainingCredit] = useState<number>(50);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Reference pro automatické scrollování
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Efekt pro scrollování na konec chatu při nové zprávě
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Efekt pro aktualizaci informací o kreditu
  useEffect(() => {
    // Aktualizace informací o kreditu každou sekundu, pokud je připojen Google API
    if (selectedApiKey?.provider === 'google' && apiStatus.isConnected) {
      const interval = setInterval(() => {
        setRemainingCredit(GeminiService.getRemainingCredit());
        setTotalCost(GeminiService.getTotalCost());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [selectedApiKey, apiStatus.isConnected]);

  // Funkce pro získání modelu podle poskytovatele
  const getModelForProvider = (provider: string): string => {
    switch (provider) {
      case 'openai':
        return 'GPT-4';
      case 'google':
        return 'Gemini Pro';
      case 'anthropic':
        return 'Claude 3';
      case 'deepseek':
        return 'DeepSeek Coder';
      default:
        return 'Neznámý model';
    }
  };

  // Funkce pro přidání zprávy
  const addMessage = (role: MessageRole, content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Pomocné funkce pro přidání zpráv různých typů
  const addUserMessage = (content: string) => addMessage('user', content);
  const addAssistantMessage = (content: string) => addMessage('assistant', content);
  const addSystemMessage = (content: string) => addMessage('system', content);
  const addErrorMessage = (content: string) => addMessage('error', content);
  const addWarningMessage = (content: string) => addMessage('warning', content);

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
    addUserMessage(userMessage);

    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage);
      addAssistantMessage(response);
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
    if (window.confirm('Opravdu chcete vymazat celou historii chatu?')) {
      setMessages([]);
      onClearChat();

      // Přidání systémové zprávy o vymazání chatu
      setTimeout(() => {
        addSystemMessage('Historie chatu byla vymazána');
      }, 100);
    }
  };

  // Formátování času
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="enhanced-chat-interface">
      <div className="chat-header">
        <h2>AI Asistent</h2>
        <div className="api-status">
          {apiStatus.isConnected ? (
            <div className="api-connected">
              <span className="status-icon connected">
                <i className="fas fa-link"></i>
              </span>
              <div className="status-details">
                <span className="status-model">{apiStatus.model}</span>
                <span className="status-provider">{apiStatus.provider}</span>
              </div>
            </div>
          ) : (
            <div className="api-disconnected">
              <span className="status-icon disconnected">
                <i className="fas fa-unlink"></i>
              </span>
              <span className="status-message">Nepřipojeno</span>
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
                   message.role === 'system' ? 'Systém' :
                   message.role === 'error' ? 'Chyba' : 'Upozornění'}
                </span>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
              <div className="message-content">{message.content}</div>
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
            className="clear-button"
            onClick={handleClearChat}
            disabled={messages.length === 0 || isLoading}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !apiStatus.isConnected || isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <i className="fas fa-paper-plane"></i>
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
    </div>
  );
};

export default EnhancedChatInterface;
