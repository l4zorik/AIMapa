/**
 * GeminiService - Služba pro komunikaci s Google Gemini API
 */

// Typy pro Gemini API
export interface GeminiRequest {
  contents: {
    parts: {
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }[];
    role?: string;
  }[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text?: string;
      }[];
      role?: string;
    };
    finishReason: string;
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  }[];
  promptFeedback?: {
    safetyRatings: {
      category: string;
      probability: string;
    }[];
  };
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
}

export interface MapRoute {
  start: MapLocation;
  end: MapLocation;
  waypoints?: MapLocation[];
}

export interface GeminiMapResponse {
  type: 'location' | 'route' | 'text';
  content: string;
  location?: MapLocation;
  route?: MapRoute;
}

class GeminiService {
  private apiKey: string | null = null;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private model = 'gemini-1.5-flash'; // Použijeme Gemini 1.5 Flash - nejnovější dostupný model
  private costPerInputToken = 0.000125; // $0.000125 za 1K vstupních tokenů
  private costPerOutputToken = 0.000375; // $0.000375 za 1K výstupních tokenů
  private maxCost = 50; // Maximální náklady v CZK
  private totalCostCZK = 0; // Celkové náklady v CZK
  private remainingCredit = 50; // Zbývající kredit v CZK

  // Nastavení API klíče
  setApiKey(key: string) {
    console.log('Nastavuji API klíč:', key.substring(0, 6) + '...');
    this.apiKey = key;
  }

  // Získání API klíče
  getApiKey(): string | null {
    return this.apiKey;
  }

  // Nastavení modelu
  setModel(model: string) {
    this.model = model;
  }

  // Získání zbývajícího kreditu
  getRemainingCredit(): number {
    return this.remainingCredit;
  }

  // Získání celkových nákladů
  getTotalCost(): number {
    return this.totalCostCZK;
  }

  // Aktualizace nákladů
  private updateCosts(costUSD: number): void {
    const costCZK = costUSD * 22.5; // Přibližný kurz USD/CZK
    this.totalCostCZK += costCZK;
    this.remainingCredit = Math.max(0, this.maxCost - this.totalCostCZK);
  }

  // Získání seznamu dostupných modelů
  async listModels(): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error('API klíč není nastaven');
    }

    try {
      console.log('Získávám seznam dostupných modelů...');
      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Chyba API: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Odpověď API:', data);

      if (!data.models || !Array.isArray(data.models)) {
        console.log('Neplatná odpověď API, vracím výchozí modely');
        return ['gemini-1.5-flash', 'gemini-1.5-pro', 'embedding-001'];
      }

      // Vrátíme seznam názvů modelů
      const modelNames = data.models.map((model: any) => {
        const fullName = model.name || '';
        const parts = fullName.split('/');
        return parts[parts.length - 1];
      }).filter(Boolean);

      console.log('Nalezené modely:', modelNames);

      if (modelNames.length === 0) {
        console.log('Žádné modely nenalezeny, vracím výchozí modely');
        return ['gemini-1.5-flash', 'gemini-1.5-pro', 'embedding-001'];
      }

      return modelNames;
    } catch (error) {
      console.error('Chyba při získávání seznamu modelů:', error);
      console.log('Vracím výchozí modely po chybě');
      return ['gemini-1.5-flash', 'gemini-1.5-pro', 'embedding-001'];
    }
  }

  // Odeslání zprávy do Gemini API
  async sendMessage(message: string, mapContext?: { center?: [number, number]; zoom?: number }): Promise<GeminiMapResponse> {
    if (!this.apiKey) {
      throw new Error('API klíč není nastaven');
    }

    // Kontrola zbývajícího kreditu
    if (this.remainingCredit <= 0) {
      throw new Error('Vyčerpán kredit pro API volání. Maximální limit je ' + this.maxCost + ' CZK.');
    }

    // Zkusíme získat seznam dostupných modelů a použít první dostupný
    try {
      const models = await this.listModels();
      console.log('Dostupné modely:', models);

      // Zkusíme najít model gemini-1.5-flash
      const geminiFlashModel = models.find(model => model.includes('gemini-1.5-flash'));
      if (geminiFlashModel) {
        console.log('Používám model:', geminiFlashModel);
        this.model = geminiFlashModel;
      }
      // Zkusíme najít model gemini-1.5-pro
      else {
        const geminiProModel = models.find(model => model.includes('gemini-1.5-pro'));
        if (geminiProModel) {
          console.log('Používám model:', geminiProModel);
          this.model = geminiProModel;
        }
        // Zkusíme najít jakýkoliv gemini model
        else {
          const geminiModel = models.find(model => model.includes('gemini'));
          if (geminiModel) {
            console.log('Používám model:', geminiModel);
            this.model = geminiModel;
          }
        }
      }

      // Pokud není k dispozici žádný gemini model, použijeme první dostupný model
      if (!geminiFlashModel && models.length > 0) {
        console.log('Žádný gemini model není k dispozici, používám první dostupný model:', models[0]);
        this.model = models[0];
      }
    } catch (error) {
      console.error('Chyba při získávání seznamu modelů:', error);
      // Pokračujeme s aktuálním modelem
    }

    try {
      // Vytvoření požadavku
      const request: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: `Jsi AI asistent pro mapovou aplikaci. Tvým úkolem je pomáhat s navigací a vyhledáváním míst.

Pokud uživatel hledá konkrétní místo, odpověz ve formátu JSON s typem "location" a souřadnicemi.
Pokud uživatel hledá trasu mezi místy, odpověz ve formátu JSON s typem "route" a souřadnicemi počátečního a cílového bodu.
Pokud uživatel pokládá obecný dotaz, odpověz ve formátu JSON s typem "text" a textovou odpovědí.

Příklady formátů odpovědí:
Pro místo: {"type":"location","content":"Našel jsem Prahu na mapě.","location":{"lat":50.0755,"lng":14.4378,"name":"Praha"}}
Pro trasu: {"type":"route","content":"Zde je trasa z Prahy do Brna.","route":{"start":{"lat":50.0755,"lng":14.4378,"name":"Praha"},"end":{"lat":49.1951,"lng":16.6068,"name":"Brno"}}}
Pro text: {"type":"text","content":"Mohu vám pomoci s vyhledáváním míst nebo plánováním tras."}

${mapContext ? `Aktuální pozice na mapě: ${mapContext.center}, zoom: ${mapContext.zoom}` : ''}

Uživatelský dotaz: ${message}`
              }
            ],
            role: 'user'
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024
        }
      };

      // Odeslání požadavku
      console.log(`Odesílám požadavek na ${this.apiUrl}/${this.model}:generateContent`);
      console.log('Požadavek:', JSON.stringify(request, null, 2));

      const response = await fetch(`${this.apiUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Chyba API: ${errorData.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();

      // Zpracování odpovědi
      const textResponse = data.candidates[0]?.content?.parts[0]?.text || '';

      // Výpočet nákladů
      if (data.usageMetadata) {
        const inputCost = (data.usageMetadata.promptTokenCount / 1000) * this.costPerInputToken;
        const outputCost = (data.usageMetadata.candidatesTokenCount / 1000) * this.costPerOutputToken;
        const totalCost = inputCost + outputCost;

        // Aktualizace nákladů a zbývajícího kreditu
        this.updateCosts(totalCost);

        console.log(`Náklady na API volání: $${totalCost.toFixed(6)} (${(totalCost * 22.5).toFixed(2)} CZK)`);
        console.log(`Celkové náklady: ${this.totalCostCZK.toFixed(2)} CZK, Zbývající kredit: ${this.remainingCredit.toFixed(2)} CZK`);
      }

      try {
        // Pokus o parsování JSON odpovědi
        const jsonResponse = JSON.parse(textResponse) as GeminiMapResponse;
        return jsonResponse;
      } catch (error) {
        // Pokud odpověď není validní JSON, vrátíme textovou odpověď
        return {
          type: 'text',
          content: textResponse
        };
      }
    } catch (error) {
      console.error('Chyba při komunikaci s Gemini API:', error);
      throw error;
    }
  }
}

export default new GeminiService();
