import React, { useState, useEffect, useRef } from 'react';
import './EnhancedTaskInfoPanel.css';
import chatSessionService from '../../services/ChatSessionService';
import { MessageRole } from '../../models/ChatSession';
import { ApiKey } from '../ApiKeys/EnhancedApiKeyManager';

interface EnhancedTaskInfoPanelProps {
  task: {
    id: string;
    title: string;
    description?: string;
    type: 'location' | 'task' | 'route' | 'note';
    location?: {
      lat: number;
      lng: number;
      name?: string;
    };
    route?: {
      start: {
        lat: number;
        lng: number;
        name?: string;
      };
      end: {
        lat: number;
        lng: number;
        name?: string;
      };
    };
    completed?: boolean;
    time?: string;
  };
  planId?: string;
  selectedApiKey: ApiKey | null;
  onClose: () => void;
  onSendMessage: (message: string, context?: any) => Promise<string>;
  onUpdateTask: (taskId: string, updates: any) => void;
  onNavigateToTask: (taskId: string) => void;
}

/**
 * Rozšířená komponenta pro zobrazení informací o úkolu na mapě s integrovaným chatem
 */
const EnhancedTaskInfoPanel: React.FC<EnhancedTaskInfoPanelProps> = ({
  task,
  planId,
  selectedApiKey,
  onClose,
  onSendMessage,
  onUpdateTask,
  onNavigateToTask
}) => {
  // Stav pro chat
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
  }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // Reference pro scrollování
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Funkce pro formátování souřadnic
  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Funkce pro získání ikony podle typu úkolu
  const getTaskIcon = () => {
    switch (task.type) {
      case 'location':
        return 'fa-map-marker-alt';
      case 'task':
        return 'fa-tasks';
      case 'route':
        return 'fa-route';
      case 'note':
        return 'fa-sticky-note';
      default:
        return 'fa-map-marker-alt';
    }
  };

  // Funkce pro získání barvy podle typu úkolu
  const getTaskColor = () => {
    switch (task.type) {
      case 'location':
        return 'var(--marker-info)';
      case 'task':
        return 'var(--marker-primary)';
      case 'route':
        return 'var(--marker-success)';
      case 'note':
        return 'var(--marker-warning)';
      default:
        return 'var(--marker-primary)';
    }
  };
  
  // Efekt pro inicializaci chatu
  useEffect(() => {
    // Přidání uvítací zprávy
    setMessages([
      {
        id: `task-${task.id}-welcome`,
        role: 'system',
        content: `Vítejte v chatu pro úkol "${task.title}". Zde můžete upravit úkol nebo získat další informace.`,
        timestamp: new Date()
      }
    ]);
  }, [task.id, task.title]);
  
  // Efekt pro scrollování na konec chatu
  useEffect(() => {
    if (showChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);
  
  // Funkce pro odeslání zprávy
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    if (!selectedApiKey) {
      addErrorMessage('Nelze odeslat zprávu: Není připojen žádný API klíč');
      return;
    }
    
    const userMessage = inputMessage;
    setInputMessage('');
    
    // Přidání zprávy uživatele
    addUserMessage(userMessage);
    
    setIsLoading(true);
    
    try {
      // Vytvoření kontextu pro API volání
      const context = {
        taskId: task.id,
        planId: planId,
        taskTitle: task.title,
        taskDescription: task.description || '',
        taskType: task.type,
        taskLocation: task.location,
        taskRoute: task.route,
        taskCompleted: task.completed
      };
      
      // Odeslání zprávy s kontextem
      const response = await onSendMessage(userMessage, context);
      
      // Přidání odpovědi asistenta
      addAssistantMessage(response);
    } catch (error) {
      console.error('Chyba při odesílání zprávy:', error);
      addErrorMessage(`Chyba při komunikaci s API: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Funkce pro přidání zprávy
  const addMessage = (role: MessageRole, content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };
  
  // Pomocné funkce pro přidání zpráv různých typů
  const addUserMessage = (content: string) => addMessage('user', content);
  const addAssistantMessage = (content: string) => addMessage('assistant', content);
  const addSystemMessage = (content: string) => addMessage('system', content);
  const addErrorMessage = (content: string) => addMessage('error', content);
  
  // Funkce pro přepnutí zobrazení chatu
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  // Funkce pro označení úkolu jako dokončeného
  const handleToggleComplete = () => {
    onUpdateTask(task.id, { completed: !task.completed });
  };
  
  // Funkce pro úpravu názvu úkolu
  const handleEditTitle = () => {
    const newTitle = prompt('Zadejte nový název úkolu:', task.title);
    if (newTitle && newTitle !== task.title) {
      onUpdateTask(task.id, { title: newTitle });
    }
  };
  
  // Funkce pro úpravu popisu úkolu
  const handleEditDescription = () => {
    const newDescription = prompt('Zadejte nový popis úkolu:', task.description || '');
    if (newDescription !== null) {
      onUpdateTask(task.id, { description: newDescription });
    }
  };
  
  // Formátování času
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`enhanced-task-info-panel ${showChat ? 'with-chat' : ''}`}>
      <div className="task-info-header" style={{ backgroundColor: getTaskColor() }}>
        <i className={`fas ${getTaskIcon()}`}></i>
        <h3>{task.title}</h3>
        <div className="task-info-header-actions">
          <button 
            className="chat-toggle-button" 
            onClick={toggleChat}
            title={showChat ? "Skrýt chat" : "Zobrazit chat"}
          >
            <i className={`fas ${showChat ? 'fa-comment-slash' : 'fa-comment'}`}></i>
          </button>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div className="task-info-content">
        {task.description && (
          <div className="task-info-section">
            <p>{task.description}</p>
          </div>
        )}
        
        {task.time && (
          <div className="task-info-section">
            <div className="task-info-label">
              <i className="fas fa-clock"></i>
              Čas:
            </div>
            <div className="task-info-value">{task.time}</div>
          </div>
        )}
        
        {task.location && (
          <div className="task-info-section">
            <div className="task-info-label">
              <i className="fas fa-map-marker-alt"></i>
              Lokace:
            </div>
            <div className="task-info-value">
              {task.location.name || 'Neznámé místo'}
            </div>
            <div className="task-info-coordinates">
              {formatCoordinates(task.location.lat, task.location.lng)}
            </div>
          </div>
        )}
        
        {task.route && (
          <div className="task-info-section">
            <div className="task-info-label">
              <i className="fas fa-route"></i>
              Trasa:
            </div>
            <div className="task-info-route">
              <div className="route-point">
                <i className="fas fa-play-circle"></i>
                <span>{task.route.start.name || 'Počáteční bod'}</span>
              </div>
              <div className="route-arrow">
                <i className="fas fa-long-arrow-alt-down"></i>
              </div>
              <div className="route-point">
                <i className="fas fa-flag-checkered"></i>
                <span>{task.route.end.name || 'Cílový bod'}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="task-info-section">
          <div className="task-info-label">
            <i className="fas fa-info-circle"></i>
            Stav:
          </div>
          <div 
            className={`task-status ${task.completed ? 'completed' : 'pending'}`}
            onClick={handleToggleComplete}
          >
            {task.completed ? '✓ Dokončeno' : 'Čeká na splnění'}
          </div>
        </div>
      </div>
      
      <div className="task-info-actions">
        <button 
          className="task-info-button primary"
          onClick={() => onNavigateToTask(task.id)}
        >
          <i className="fas fa-directions"></i>
          Navigovat
        </button>
        <button 
          className="task-info-button secondary"
          onClick={handleEditTitle}
        >
          <i className="fas fa-edit"></i>
          Upravit
        </button>
      </div>
      
      {showChat && (
        <div className="task-chat-container">
          <div className="task-chat-messages">
            {messages.map(message => (
              <div key={message.id} className={`task-chat-message ${message.role}`}>
                <div className="message-header">
                  <span className="message-role">
                    {message.role === 'user' ? 'Vy' :
                     message.role === 'assistant' ? 'AI Asistent' :
                     message.role === 'system' ? 'Systém' : 'Chyba'}
                  </span>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-content">{message.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="task-chat-input-container">
            <textarea
              className="task-chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Napište zprávu..."
              disabled={isLoading || !selectedApiKey}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              className="task-chat-send-button"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || !selectedApiKey}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTaskInfoPanel;
