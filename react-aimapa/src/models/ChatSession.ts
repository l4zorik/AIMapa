/**
 * Model pro chatové sessions
 * 
 * Tento soubor definuje rozhraní pro chatové sessions a zprávy
 */

// Typy rolí zpráv
export type MessageRole = 'user' | 'assistant' | 'system' | 'error' | 'warning';

/**
 * Rozhraní pro chatovou zprávu
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  metadata?: {
    planRequest?: boolean;
    planCommand?: string;
    planTitle?: string;
    planId?: string;
    [key: string]: any;
  };
}

/**
 * Rozhraní pro chatovou session
 */
export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
  metadata?: {
    planIds?: string[];
    [key: string]: any;
  };
}

/**
 * Rozhraní pro historii chatových sessions
 */
export interface ChatHistory {
  sessions: ChatSession[];
  activeSessionId: string | null;
}

/**
 * Rozhraní pro serializovanou chatovou zprávu (pro ukládání do localStorage)
 */
export interface SerializedChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO string
  metadata?: {
    planRequest?: boolean;
    planCommand?: string;
    planTitle?: string;
    planId?: string;
    [key: string]: any;
  };
}

/**
 * Rozhraní pro serializovanou chatovou session (pro ukládání do localStorage)
 */
export interface SerializedChatSession {
  id: string;
  title: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  messages: SerializedChatMessage[];
  metadata?: {
    planIds?: string[];
    [key: string]: any;
  };
}

/**
 * Rozhraní pro serializovanou historii chatových sessions (pro ukládání do localStorage)
 */
export interface SerializedChatHistory {
  sessions: SerializedChatSession[];
  activeSessionId: string | null;
}

/**
 * Funkce pro serializaci chatové zprávy
 */
export function serializeChatMessage(message: ChatMessage): SerializedChatMessage {
  return {
    ...message,
    timestamp: message.timestamp.toISOString()
  };
}

/**
 * Funkce pro deserializaci chatové zprávy
 */
export function deserializeChatMessage(message: SerializedChatMessage): ChatMessage {
  return {
    ...message,
    timestamp: new Date(message.timestamp)
  };
}

/**
 * Funkce pro serializaci chatové session
 */
export function serializeChatSession(session: ChatSession): SerializedChatSession {
  return {
    ...session,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    messages: session.messages.map(serializeChatMessage)
  };
}

/**
 * Funkce pro deserializaci chatové session
 */
export function deserializeChatSession(session: SerializedChatSession): ChatSession {
  return {
    ...session,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
    messages: session.messages.map(deserializeChatMessage)
  };
}

/**
 * Funkce pro serializaci historie chatových sessions
 */
export function serializeChatHistory(history: ChatHistory): SerializedChatHistory {
  return {
    ...history,
    sessions: history.sessions.map(serializeChatSession)
  };
}

/**
 * Funkce pro deserializaci historie chatových sessions
 */
export function deserializeChatHistory(history: SerializedChatHistory): ChatHistory {
  return {
    ...history,
    sessions: history.sessions.map(deserializeChatSession)
  };
}
