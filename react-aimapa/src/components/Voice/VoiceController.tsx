import React, { useState, useEffect, useRef } from 'react';
import './VoiceController.css';

// Typy pro voice ovládání
export interface VoiceCommand {
  command: string;
  action: string;
  confidence: number;
}

export interface VoiceControllerProps {
  onVoiceCommand: (command: string) => void;
  onVoiceText: (text: string) => void;
  isEnabled?: boolean;
  language?: string;
}

// Hlavní komponenta pro voice ovládání
const VoiceController: React.FC<VoiceControllerProps> = ({
  onVoiceCommand,
  onVoiceText,
  isEnabled = true,
  language = 'cs-CZ'
}) => {
  // Stavy komponenty
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Reference na SpeechRecognition
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Kontrola podpory Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthRef.current = speechSynthesis;

      // Inicializace SpeechRecognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      // Event handlery
      recognition.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setError(`Chyba rozpoznávání hlasu: ${event.error}`);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcript = result[0].transcript;

          if (result.isFinal) {
            finalTranscript += transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        // Aktualizace transkriptu
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);

        // Pokud máme finální výsledek, zpracujeme ho
        if (finalTranscript) {
          console.log('Final transcript:', finalTranscript);
          processVoiceInput(finalTranscript.trim());
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Váš prohlížeč nepodporuje rozpoznávání hlasu');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  // Zpracování hlasového vstupu
  const processVoiceInput = (text: string) => {
    const lowerText = text.toLowerCase();

    // Detekce hlasových příkazů
    const commands = [
      { pattern: /^(ahoj|hello|hi)/, action: 'greeting' },
      { pattern: /(naplánuj|vytvoř plán|plán)/, action: 'create_plan' },
      { pattern: /(najdi|vyhledej|kde je)/, action: 'search_location' },
      { pattern: /(trasa|cesta|navigace|jak se dostanu)/, action: 'route_planning' },
      { pattern: /(mapa|zobraz mapu|přepni na mapu)/, action: 'show_map' },
      { pattern: /(glóbus|3d|přepni na glóbus)/, action: 'show_globe' },
      { pattern: /(stop|konec|přestaň)/, action: 'stop_listening' },
      { pattern: /(nápověda|pomoc|help)/, action: 'help' }
    ];

    // Hledání odpovídajícího příkazu
    let commandFound = false;
    for (const cmd of commands) {
      if (cmd.pattern.test(lowerText)) {
        console.log(`Voice command detected: ${cmd.action}`);
        onVoiceCommand(cmd.action);
        commandFound = true;
        break;
      }
    }

    // Pokud nebyl nalezen specifický příkaz, pošleme text do chatu
    if (!commandFound) {
      console.log('Sending voice text to chat:', text);
      onVoiceText(text);
    }

    // Vyčištění transkriptu po zpracování
    setTimeout(() => {
      setTranscript('');
    }, 2000);
  };

  // Spuštění/zastavení naslouchání
  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Text-to-Speech funkce
  const speak = (text: string, lang: string = language) => {
    if (!synthRef.current || isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Zastavení mluvení
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Pokud není podporováno, nezobrazujeme komponentu
  if (!isSupported) {
    return (
      <div className="voice-controller voice-not-supported">
        <p>Rozpoznávání hlasu není v tomto prohlížeči podporováno</p>
      </div>
    );
  }

  return (
    <div className={`voice-controller ${!isEnabled ? 'disabled' : ''}`}>
      {/* Hlavní tlačítko pro voice ovládání */}
      <button
        className={`voice-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
        onClick={toggleListening}
        disabled={!isEnabled}
        title={isListening ? 'Klikněte pro zastavení naslouchání' : 'Klikněte pro spuštění hlasového ovládání'}
      >
        {isListening ? (
          <i className="fas fa-microphone-slash"></i>
        ) : (
          <i className="fas fa-microphone"></i>
        )}
      </button>

      {/* Indikátor stavu */}
      <div className="voice-status">
        {isListening && (
          <div className="listening-indicator">
            <div className="pulse"></div>
            <span>Naslouchám...</span>
          </div>
        )}
        
        {isSpeaking && (
          <div className="speaking-indicator">
            <i className="fas fa-volume-up"></i>
            <span>Mluvím...</span>
            <button onClick={stopSpeaking} className="stop-speaking">
              <i className="fas fa-stop"></i>
            </button>
          </div>
        )}
      </div>

      {/* Zobrazení transkriptu */}
      {transcript && (
        <div className="voice-transcript">
          <div className="transcript-content">
            <strong>Rozpoznaný text:</strong> {transcript}
            {confidence > 0 && (
              <span className="confidence">
                (Jistota: {Math.round(confidence * 100)}%)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Zobrazení chyby */}
      {error && (
        <div className="voice-error">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}
    </div>
  );
};

// Export komponenty a utility funkce pro mluvení
export default VoiceController;
export { VoiceController };

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
