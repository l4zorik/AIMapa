import { VoiceCommand, VoiceCommandType, VOICE_COMMANDS } from '../types/speech';

// Třída pro zpracování hlasových příkazů
class VoiceCommandService {
  private commands: VoiceCommand[] = [];
  private language: string = 'cs-CZ';

  constructor() {
    this.initializeCommands();
  }

  // Inicializace hlasových příkazů
  private initializeCommands(): void {
    this.commands = [
      // Pozdravy
      {
        pattern: /^(ahoj|hello|hi|dobrý den|dobré ráno|dobrý večer)/i,
        action: VOICE_COMMANDS.GREETING,
        description: 'Pozdrav s AI asistentem',
        examples: ['Ahoj', 'Hello', 'Dobrý den']
      },

      // Plánování
      {
        pattern: /(naplánuj|vytvoř plán|plán|nový plán|přidej plán)/i,
        action: VOICE_COMMANDS.CREATE_PLAN,
        description: 'Vytvoření nového plánu',
        examples: ['Naplánuj výlet do Prahy', 'Vytvoř plán na víkend', 'Nový plán']
      },

      // Vyhledávání lokací
      {
        pattern: /(najdi|vyhledej|kde je|zobraz|ukaž|lokace|místo)/i,
        action: VOICE_COMMANDS.SEARCH_LOCATION,
        description: 'Vyhledání místa na mapě',
        examples: ['Najdi Václavské náměstí', 'Kde je Praha', 'Zobraz Brno']
      },

      // Plánování tras
      {
        pattern: /(trasa|cesta|navigace|jak se dostanu|naplánuj cestu|route)/i,
        action: VOICE_COMMANDS.ROUTE_PLANNING,
        description: 'Plánování trasy mezi místy',
        examples: ['Trasa z Prahy do Brna', 'Jak se dostanu do centra', 'Naplánuj cestu']
      },

      // Ovládání mapy
      {
        pattern: /(mapa|zobraz mapu|přepni na mapu|2d)/i,
        action: VOICE_COMMANDS.SHOW_MAP,
        description: 'Přepnutí na 2D mapu',
        examples: ['Zobraz mapu', 'Přepni na mapu', '2D mapa']
      },

      // Ovládání glóbusu
      {
        pattern: /(glóbus|3d|přepni na glóbus|globe)/i,
        action: VOICE_COMMANDS.SHOW_GLOBE,
        description: 'Přepnutí na 3D glóbus',
        examples: ['Zobraz glóbus', 'Přepni na 3D', 'Globe']
      },

      // Navigace v plánu
      {
        pattern: /(další|next|pokračuj|další krok)/i,
        action: VOICE_COMMANDS.NAVIGATE_NEXT,
        description: 'Přechod na další krok v plánu',
        examples: ['Další', 'Další krok', 'Pokračuj']
      },

      {
        pattern: /(předchozí|previous|zpět|předchozí krok)/i,
        action: VOICE_COMMANDS.NAVIGATE_PREV,
        description: 'Přechod na předchozí krok v plánu',
        examples: ['Předchozí', 'Zpět', 'Předchozí krok']
      },

      // Dokončení úkolu
      {
        pattern: /(dokončeno|hotovo|splněno|complete|done)/i,
        action: VOICE_COMMANDS.COMPLETE_TASK,
        description: 'Označení úkolu jako dokončeného',
        examples: ['Dokončeno', 'Hotovo', 'Splněno']
      },

      // Ovládání zoom
      {
        pattern: /(přiblíž|zoom in|větší|blíž)/i,
        action: VOICE_COMMANDS.ZOOM_IN,
        description: 'Přiblížení mapy',
        examples: ['Přiblíž', 'Zoom in', 'Větší']
      },

      {
        pattern: /(oddal|zoom out|menší|dál)/i,
        action: VOICE_COMMANDS.ZOOM_OUT,
        description: 'Oddálení mapy',
        examples: ['Oddal', 'Zoom out', 'Menší']
      },

      // Centrování mapy
      {
        pattern: /(vycentruj|center|střed|na střed)/i,
        action: VOICE_COMMANDS.CENTER_MAP,
        description: 'Vycentrování mapy',
        examples: ['Vycentruj mapu', 'Na střed', 'Center']
      },

      // Nápověda
      {
        pattern: /(nápověda|pomoc|help|co můžu říct)/i,
        action: VOICE_COMMANDS.HELP,
        description: 'Zobrazení nápovědy',
        examples: ['Nápověda', 'Pomoc', 'Co můžu říct']
      },

      // Zastavení
      {
        pattern: /(stop|konec|přestaň|zastavit|cancel)/i,
        action: VOICE_COMMANDS.STOP_LISTENING,
        description: 'Zastavení naslouchání',
        examples: ['Stop', 'Konec', 'Přestaň']
      }
    ];
  }

  // Zpracování hlasového vstupu
  public processVoiceInput(text: string): { command: VoiceCommandType | null; confidence: number; originalText: string } {
    const normalizedText = this.normalizeText(text);
    
    // Hledání odpovídajícího příkazu
    for (const cmd of this.commands) {
      const match = normalizedText.match(cmd.pattern);
      if (match) {
        // Výpočet confidence na základě délky shody
        const confidence = this.calculateConfidence(match[0], normalizedText);
        
        return {
          command: cmd.action as VoiceCommandType,
          confidence,
          originalText: text
        };
      }
    }

    return {
      command: null,
      confidence: 0,
      originalText: text
    };
  }

  // Normalizace textu pro lepší rozpoznávání
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .trim()
      // Odstranění diakritiky
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Nahrazení běžných variant
      .replace(/\bprahy\b/g, 'praha')
      .replace(/\bbrna\b/g, 'brno')
      .replace(/\bcestu\b/g, 'cesta')
      .replace(/\btrasu\b/g, 'trasa');
  }

  // Výpočet confidence skóre
  private calculateConfidence(match: string, fullText: string): number {
    const matchLength = match.length;
    const fullLength = fullText.length;
    
    // Základní confidence na základě poměru délky shody
    let confidence = Math.min(matchLength / fullLength, 1.0);
    
    // Bonus pro přesnou shodu na začátku
    if (fullText.startsWith(match)) {
      confidence += 0.2;
    }
    
    // Bonus pro kratší texty (méně šumu)
    if (fullLength <= 20) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }

  // Získání všech dostupných příkazů
  public getAvailableCommands(): VoiceCommand[] {
    return [...this.commands];
  }

  // Získání příkazů podle kategorie
  public getCommandsByCategory(): { [category: string]: VoiceCommand[] } {
    const categories: { [category: string]: VoiceCommand[] } = {
      'Základní': [],
      'Plánování': [],
      'Navigace': [],
      'Ovládání mapy': [],
      'Systém': []
    };

    this.commands.forEach(cmd => {
      switch (cmd.action) {
        case VOICE_COMMANDS.GREETING:
        case VOICE_COMMANDS.HELP:
          categories['Základní'].push(cmd);
          break;
        case VOICE_COMMANDS.CREATE_PLAN:
        case VOICE_COMMANDS.SEARCH_LOCATION:
        case VOICE_COMMANDS.ROUTE_PLANNING:
          categories['Plánování'].push(cmd);
          break;
        case VOICE_COMMANDS.NAVIGATE_NEXT:
        case VOICE_COMMANDS.NAVIGATE_PREV:
        case VOICE_COMMANDS.COMPLETE_TASK:
          categories['Navigace'].push(cmd);
          break;
        case VOICE_COMMANDS.SHOW_MAP:
        case VOICE_COMMANDS.SHOW_GLOBE:
        case VOICE_COMMANDS.ZOOM_IN:
        case VOICE_COMMANDS.ZOOM_OUT:
        case VOICE_COMMANDS.CENTER_MAP:
          categories['Ovládání mapy'].push(cmd);
          break;
        case VOICE_COMMANDS.STOP_LISTENING:
          categories['Systém'].push(cmd);
          break;
      }
    });

    return categories;
  }

  // Nastavení jazyka
  public setLanguage(language: string): void {
    this.language = language;
    // Zde by se mohly načíst příkazy pro jiný jazyk
    if (language === 'en-US') {
      this.initializeEnglishCommands();
    } else {
      this.initializeCommands();
    }
  }

  // Inicializace anglických příkazů
  private initializeEnglishCommands(): void {
    this.commands = [
      {
        pattern: /^(hello|hi|good morning|good evening)/i,
        action: VOICE_COMMANDS.GREETING,
        description: 'Greeting with AI assistant',
        examples: ['Hello', 'Hi', 'Good morning']
      },
      {
        pattern: /(plan|create plan|new plan|make plan)/i,
        action: VOICE_COMMANDS.CREATE_PLAN,
        description: 'Create a new plan',
        examples: ['Plan a trip to Prague', 'Create plan', 'New plan']
      },
      {
        pattern: /(find|search|where is|show|locate)/i,
        action: VOICE_COMMANDS.SEARCH_LOCATION,
        description: 'Search for a location on map',
        examples: ['Find Prague', 'Where is London', 'Show Paris']
      },
      // ... další anglické příkazy
    ];
  }

  // Generování hlasové odpovědi pro příkaz
  public generateVoiceResponse(command: VoiceCommandType, context?: any): string {
    const responses: { [key in VoiceCommandType]: string } = {
      [VOICE_COMMANDS.GREETING]: 'Ahoj! Jsem váš AI asistent pro mapu. Jak vám mohu pomoci?',
      [VOICE_COMMANDS.CREATE_PLAN]: 'Vytvářím nový plán. Řekněte mi, co chcete naplánovat.',
      [VOICE_COMMANDS.SEARCH_LOCATION]: 'Vyhledávám lokaci. Řekněte mi název místa.',
      [VOICE_COMMANDS.ROUTE_PLANNING]: 'Plánovám trasu. Řekněte mi výchozí a cílové místo.',
      [VOICE_COMMANDS.SHOW_MAP]: 'Přepínám na 2D mapu.',
      [VOICE_COMMANDS.SHOW_GLOBE]: 'Přepínám na 3D glóbus.',
      [VOICE_COMMANDS.NAVIGATE_NEXT]: 'Přecházím na další krok.',
      [VOICE_COMMANDS.NAVIGATE_PREV]: 'Přecházím na předchozí krok.',
      [VOICE_COMMANDS.COMPLETE_TASK]: 'Označuji úkol jako dokončený.',
      [VOICE_COMMANDS.ZOOM_IN]: 'Přibližuji mapu.',
      [VOICE_COMMANDS.ZOOM_OUT]: 'Oddaluji mapu.',
      [VOICE_COMMANDS.CENTER_MAP]: 'Centruji mapu.',
      [VOICE_COMMANDS.HELP]: 'Můžete říct například: Naplánuj výlet, Najdi Prahu, Zobraz mapu, nebo Nápověda.',
      [VOICE_COMMANDS.STOP_LISTENING]: 'Zastavuji naslouchání.'
    };

    return responses[command] || 'Příkaz byl rozpoznán.';
  }
}

// Singleton instance
const voiceCommandService = new VoiceCommandService();
export default voiceCommandService;
