// TypeScript typy a konstanty pro voice ovládání

// Export typů pro použití v komponentách
export interface VoiceRecognitionConfig {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export interface VoiceCommand {
  pattern: RegExp;
  action: string;
  description: string;
  examples: string[];
}

export interface VoiceResponse {
  text: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
}

export interface VoiceSynthesisConfig {
  language: string;
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

export interface VoiceControllerState {
  isListening: boolean;
  isSupported: boolean;
  isSpeaking: boolean;
  currentTranscript: string;
  lastCommand: string | null;
  error: string | null;
}

// Konstanty pro voice ovládání
export const VOICE_COMMANDS = {
  GREETING: 'greeting',
  CREATE_PLAN: 'create_plan',
  SEARCH_LOCATION: 'search_location',
  ROUTE_PLANNING: 'route_planning',
  SHOW_MAP: 'show_map',
  SHOW_GLOBE: 'show_globe',
  STOP_LISTENING: 'stop_listening',
  HELP: 'help',
  NAVIGATE_NEXT: 'navigate_next',
  NAVIGATE_PREV: 'navigate_prev',
  COMPLETE_TASK: 'complete_task',
  ZOOM_IN: 'zoom_in',
  ZOOM_OUT: 'zoom_out',
  CENTER_MAP: 'center_map'
} as const;

export type VoiceCommandType = typeof VOICE_COMMANDS[keyof typeof VOICE_COMMANDS];

// Podporované jazyky
export const SUPPORTED_LANGUAGES = {
  'cs-CZ': 'Čeština',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'de-DE': 'Deutsch',
  'fr-FR': 'Français',
  'es-ES': 'Español',
  'it-IT': 'Italiano',
  'pl-PL': 'Polski',
  'sk-SK': 'Slovenčina'
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Error typy
export const VOICE_ERRORS = {
  NOT_SUPPORTED: 'not_supported',
  PERMISSION_DENIED: 'permission_denied',
  NO_SPEECH: 'no_speech',
  NETWORK_ERROR: 'network_error',
  AUDIO_CAPTURE: 'audio_capture',
  UNKNOWN: 'unknown'
} as const;

export type VoiceErrorType = typeof VOICE_ERRORS[keyof typeof VOICE_ERRORS];

// Utility funkce pro použití mimo komponentu
export const speakText = (text: string, lang: string = 'cs-CZ') => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }
};

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
