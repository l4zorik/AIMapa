import React, { useState, useRef, useEffect } from 'react';
import { ChatSession } from '../../models/ChatSession';
import './ChatSessionList.css';
import chatSessionService from '../../services/ChatSessionService';

interface ChatSessionListProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const ChatSessionList: React.FC<ChatSessionListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onRenameSession,
  onDeleteSession
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [sessionPlans, setSessionPlans] = useState<{ [sessionId: string]: string[] }>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Načtení plánů pro každou session
  useEffect(() => {
    const plansMap: { [sessionId: string]: string[] } = {};

    sessions.forEach(session => {
      const planIds = chatSessionService.getPlanIdsForSession(session.id);
      if (planIds.length > 0) {
        plansMap[session.id] = planIds;
      }
    });

    setSessionPlans(plansMap);
  }, [sessions]);

  // Formátování data
  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return 'Dnes';
    } else if (isYesterday) {
      return 'Včera';
    } else {
      return date.toLocaleDateString('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  // Zahájení editace názvu session
  const startEditing = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setNewTitle(currentTitle);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 10);
  };

  // Ukončení editace názvu session
  const finishEditing = () => {
    if (editingSessionId && newTitle.trim()) {
      onRenameSession(editingSessionId, newTitle.trim());
    }
    setEditingSessionId(null);
    setNewTitle('');
  };

  // Zpracování klávesových zkratek při editaci
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditingSessionId(null);
      setNewTitle('');
    }
  };

  // Získání zkráceného názvu session
  const getShortTitle = (title: string, maxLength: number = 25): string => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  // Získání počtu zpráv v session (bez systémových zpráv)
  const getMessageCount = (session: ChatSession): number => {
    return session.messages.filter(msg => msg.role !== 'system').length;
  };

  // Seřazení sessions podle data aktualizace (nejnovější první)
  const sortedSessions = [...sessions].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  // Seskupení sessions podle data
  const groupedSessions: { [key: string]: ChatSession[] } = {};

  sortedSessions.forEach(session => {
    const dateKey = formatDate(session.updatedAt);
    if (!groupedSessions[dateKey]) {
      groupedSessions[dateKey] = [];
    }
    groupedSessions[dateKey].push(session);
  });

  return (
    <div className={`chat-session-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="session-list-header">
        <h3>Historie konverzací</h3>
        <div className="session-list-actions">
          <button
            className="new-session-button"
            onClick={onCreateSession}
            title="Nová konverzace"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            className="toggle-expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Sbalit" : "Rozbalit"}
          >
            <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
        </div>
      </div>

      <div className="session-list-content">
        {Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
          <div key={dateKey} className="session-date-group">
            <div className="session-date-header">{dateKey}</div>
            {dateSessions.map(session => (
              <div
                key={session.id}
                className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="session-info">
                  {editingSessionId === session.id ? (
                    <input
                      ref={inputRef}
                      type="text"
                      className="session-title-input"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={finishEditing}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      <div className="session-title" title={session.title}>
                        {getShortTitle(session.title)}
                      </div>
                      <div className="session-meta">
                        <span className="message-count">
                          {getMessageCount(session)} zpráv
                        </span>
                        {sessionPlans[session.id] && sessionPlans[session.id].length > 0 && (
                          <span className="plan-count" title="Počet plánů vytvořených v této konverzaci">
                            <i className="fas fa-map-marked-alt"></i> {sessionPlans[session.id].length}
                          </span>
                        )}
                        <span className="session-time">
                          {session.updatedAt.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="session-actions">
                  <button
                    className="rename-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(session.id, session.title);
                    }}
                    title="Přejmenovat"
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Opravdu chcete smazat konverzaci "${session.title}"?`)) {
                        onDeleteSession(session.id);
                      }
                    }}
                    title="Smazat"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="empty-sessions">
            <p>Žádné konverzace</p>
            <button className="create-first-session" onClick={onCreateSession}>
              <i className="fas fa-plus"></i> Vytvořit novou konverzaci
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSessionList;
