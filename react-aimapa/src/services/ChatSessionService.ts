/**
 * Služba pro správu chatových sessions
 *
 * Tato služba poskytuje metody pro ukládání a načítání chatových sessions z localStorage
 */

import {
  ChatSession,
  ChatMessage,
  ChatHistory,
  SerializedChatHistory,
  serializeChatHistory,
  deserializeChatHistory
} from '../models/ChatSession';

class ChatSessionService {
  private readonly STORAGE_KEY = 'aiMapaChatHistory';
  private readonly LAST_SESSION_KEY = 'aiMapaLastChatSession';

  /**
   * Získání celé historie chatových sessions
   */
  getChatHistory(): ChatHistory {
    try {
      const serializedHistory = localStorage.getItem(this.STORAGE_KEY);
      if (serializedHistory) {
        const history: SerializedChatHistory = JSON.parse(serializedHistory);
        const deserializedHistory = deserializeChatHistory(history);

        // Vždy zkusíme načíst poslední aktivní session z localStorage
        const lastSessionId = this.getLastActiveSessionId();
        if (lastSessionId && deserializedHistory.sessions.some(s => s.id === lastSessionId)) {
          deserializedHistory.activeSessionId = lastSessionId;
          console.log(`Obnovena poslední aktivní chat session: ${lastSessionId}`);
        } else if (deserializedHistory.sessions.length > 0 && !deserializedHistory.activeSessionId) {
          // Pokud není nastavena aktivní session, použijeme nejnovější
          const sortedSessions = [...deserializedHistory.sessions].sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
          );
          deserializedHistory.activeSessionId = sortedSessions[0].id;
          console.log(`Nastavena nejnovější session jako aktivní: ${sortedSessions[0].id}`);

          // Uložíme ji také jako poslední aktivní
          this.setActiveSession(sortedSessions[0].id);
        }

        return deserializedHistory;
      }
    } catch (error) {
      console.error('Chyba při načítání historie chatových sessions:', error);
    }

    // Pokud historie neexistuje nebo došlo k chybě, vytvoříme novou
    return {
      sessions: [],
      activeSessionId: null
    };
  }

  /**
   * Uložení celé historie chatových sessions
   */
  saveChatHistory(history: ChatHistory): void {
    try {
      const serializedHistory = serializeChatHistory(history);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedHistory));
    } catch (error) {
      console.error('Chyba při ukládání historie chatových sessions:', error);
    }
  }

  /**
   * Vytvoření nové chatové session
   */
  createSession(title: string = 'Nová konverzace'): ChatSession {
    const now = new Date();
    const session: ChatSession = {
      id: now.getTime().toString(),
      title,
      createdAt: now,
      updatedAt: now,
      messages: [],
      metadata: {}
    };

    // Přidání uvítací systémové zprávy
    session.messages.push({
      id: `${session.id}-welcome`,
      role: 'system',
      content: 'Vítejte v AI Mapě! Jak vám mohu pomoci s navigací nebo hledáním míst?',
      timestamp: now
    });

    // Přidání session do historie
    const history = this.getChatHistory();
    history.sessions.push(session);
    history.activeSessionId = session.id;
    this.saveChatHistory(history);

    return session;
  }

  /**
   * Získání chatové session podle ID
   */
  getSession(sessionId: string): ChatSession | null {
    const history = this.getChatHistory();
    return history.sessions.find(session => session.id === sessionId) || null;
  }

  /**
   * Získání aktivní chatové session
   */
  getActiveSession(): ChatSession | null {
    const history = this.getChatHistory();
    if (!history.activeSessionId) {
      return null;
    }

    return history.sessions.find(session => session.id === history.activeSessionId) || null;
  }

  /**
   * Nastavení aktivní chatové session
   */
  setActiveSession(sessionId: string): void {
    const history = this.getChatHistory();

    // Kontrola, zda session existuje
    const sessionExists = history.sessions.some(session => session.id === sessionId);
    if (!sessionExists) {
      console.error(`Session s ID ${sessionId} neexistuje`);
      return;
    }

    // Nastavení aktivní session v historii
    history.activeSessionId = sessionId;
    this.saveChatHistory(history);

    // Uložení ID poslední aktivní session do localStorage
    localStorage.setItem(this.LAST_SESSION_KEY, sessionId);
    console.log(`Uložena poslední aktivní chat session: ${sessionId}`);

    // Aktualizace času poslední úpravy session
    const sessionIndex = history.sessions.findIndex(session => session.id === sessionId);
    if (sessionIndex !== -1) {
      history.sessions[sessionIndex].updatedAt = new Date();
      this.saveChatHistory(history);
    }
  }

  /**
   * Získání ID poslední aktivní chatové session
   */
  getLastActiveSessionId(): string | null {
    try {
      return localStorage.getItem(this.LAST_SESSION_KEY);
    } catch (error) {
      console.error('Chyba při načítání ID poslední aktivní chat session:', error);
      return null;
    }
  }

  /**
   * Přidání zprávy do chatové session
   */
  addMessageToSession(sessionId: string, message: ChatMessage): void {
    const history = this.getChatHistory();
    const sessionIndex = history.sessions.findIndex(session => session.id === sessionId);

    if (sessionIndex === -1) {
      console.error(`Session s ID ${sessionId} neexistuje`);
      return;
    }

    // Přidání zprávy do session
    history.sessions[sessionIndex].messages.push(message);
    history.sessions[sessionIndex].updatedAt = new Date();

    // Pokud je zpráva typu 'user' a obsahuje požadavek na plán, uložíme metadata
    if (message.role === 'user' && message.content.toLowerCase().includes('vytvoř plán')) {
      // Zajistíme, že metadata existují
      if (!history.sessions[sessionIndex].metadata) {
        history.sessions[sessionIndex].metadata = {};
      }

      // Bezpečný přístup k metadata
      const metadata = history.sessions[sessionIndex].metadata;
      if (metadata) {
        // Zajistíme, že planIds existují
        if (!metadata.planIds) {
          metadata.planIds = [];
        }

        // Přidáme planId, pokud existuje
        if (message.metadata?.planId && metadata.planIds) {
          metadata.planIds.push(message.metadata.planId);
        }
      }
    }

    this.saveChatHistory(history);
  }

  /**
   * Přidání ID plánu do chatové session
   */
  addPlanIdToSession(sessionId: string, planId: string): void {
    const history = this.getChatHistory();
    const sessionIndex = history.sessions.findIndex(session => session.id === sessionId);

    if (sessionIndex === -1) {
      console.error(`Session s ID ${sessionId} neexistuje`);
      return;
    }

    // Inicializace metadata, pokud neexistuje
    if (!history.sessions[sessionIndex].metadata) {
      history.sessions[sessionIndex].metadata = {};
    }

    // Bezpečný přístup k metadata
    const metadata = history.sessions[sessionIndex].metadata;
    if (metadata) {
      // Inicializace pole planIds, pokud neexistuje
      if (!metadata.planIds) {
        metadata.planIds = [];
      }

      // Přidání ID plánu, pokud ještě není v seznamu
      if (metadata.planIds && !metadata.planIds.includes(planId)) {
        metadata.planIds.push(planId);
        history.sessions[sessionIndex].updatedAt = new Date();
        this.saveChatHistory(history);
        console.log(`Plán ${planId} přidán do session ${sessionId}`);
      }
    }
  }

  /**
   * Získání všech ID plánů spojených s chatovou session
   */
  getPlanIdsForSession(sessionId: string): string[] {
    const session = this.getSession(sessionId);
    if (!session || !session.metadata || !session.metadata.planIds) {
      return [];
    }

    return session.metadata.planIds;
  }

  /**
   * Aktualizace zprávy v chatové session
   */
  updateMessageInSession(sessionId: string, messageId: string, updatedMessage: Partial<ChatMessage>): void {
    const history = this.getChatHistory();
    const sessionIndex = history.sessions.findIndex(session => session.id === sessionId);

    if (sessionIndex === -1) {
      console.error(`Session s ID ${sessionId} neexistuje`);
      return;
    }

    const messageIndex = history.sessions[sessionIndex].messages.findIndex(msg => msg.id === messageId);

    if (messageIndex === -1) {
      console.error(`Zpráva s ID ${messageId} neexistuje v session ${sessionId}`);
      return;
    }

    // Aktualizace zprávy
    history.sessions[sessionIndex].messages[messageIndex] = {
      ...history.sessions[sessionIndex].messages[messageIndex],
      ...updatedMessage
    };

    history.sessions[sessionIndex].updatedAt = new Date();
    this.saveChatHistory(history);
  }

  /**
   * Aktualizace názvu chatové session
   */
  updateSessionTitle(sessionId: string, title: string): void {
    const history = this.getChatHistory();
    const sessionIndex = history.sessions.findIndex(session => session.id === sessionId);

    if (sessionIndex === -1) {
      console.error(`Session s ID ${sessionId} neexistuje`);
      return;
    }

    history.sessions[sessionIndex].title = title;
    history.sessions[sessionIndex].updatedAt = new Date();
    this.saveChatHistory(history);
  }

  /**
   * Odstranění chatové session
   */
  deleteSession(sessionId: string): void {
    const history = this.getChatHistory();
    const sessionIndex = history.sessions.findIndex(session => session.id === sessionId);

    if (sessionIndex === -1) {
      console.error(`Session s ID ${sessionId} neexistuje`);
      return;
    }

    // Odstranění session
    history.sessions.splice(sessionIndex, 1);

    // Pokud byla odstraněna aktivní session, nastavíme jako aktivní nejnovější session
    if (history.activeSessionId === sessionId) {
      if (history.sessions.length > 0) {
        // Seřazení sessions podle data aktualizace (nejnovější první)
        const sortedSessions = [...history.sessions].sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        );
        history.activeSessionId = sortedSessions[0].id;
      } else {
        history.activeSessionId = null;
      }
    }

    this.saveChatHistory(history);
  }

  /**
   * Vymazání všech zpráv v chatové session
   */
  clearSessionMessages(sessionId: string): void {
    const history = this.getChatHistory();
    const sessionIndex = history.sessions.findIndex(session => session.id === sessionId);

    if (sessionIndex === -1) {
      console.error(`Session s ID ${sessionId} neexistuje`);
      return;
    }

    // Ponecháme pouze uvítací systémovou zprávu
    const welcomeMessage = history.sessions[sessionIndex].messages.find(msg => msg.role === 'system');

    if (welcomeMessage) {
      history.sessions[sessionIndex].messages = [welcomeMessage];
    } else {
      // Pokud neexistuje uvítací zpráva, vytvoříme novou
      history.sessions[sessionIndex].messages = [{
        id: `${sessionId}-welcome-${Date.now()}`,
        role: 'system',
        content: 'Vítejte v AI Mapě! Jak vám mohu pomoci s navigací nebo hledáním míst?',
        timestamp: new Date()
      }];
    }

    history.sessions[sessionIndex].updatedAt = new Date();
    this.saveChatHistory(history);
  }
}

// Vytvoření instance služby
const chatSessionService = new ChatSessionService();
export default chatSessionService;
