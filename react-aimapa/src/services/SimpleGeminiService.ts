/**
 * SimpleGeminiService - Zjednodušená služba pro komunikaci s Google Gemini API
 */

// Typy pro Gemini API
export interface GeminiRequest {
  contents: {
    parts: {
      text?: string;
    }[];
    role?: string;
  }[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text?: string;
      }[];
    };
  }[];
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

export interface PlanItem {
  title: string;
  description?: string;
  location?: MapLocation;
  time?: string;
  type: 'location' | 'task' | 'route' | 'note';
  route?: MapRoute;
}

export interface Plan {
  title: string;
  description?: string;
  items: PlanItem[];
}

export interface GeminiMapResponse {
  type: 'location' | 'route' | 'text' | 'plan' | 'taskLocation' | 'taskRoute' | 'task' | 'taskIdentification' | 'planIdentification';
  content: string;
  location?: MapLocation;
  route?: MapRoute;
  plan?: Plan;
  taskId?: string; // ID úkolu, ke kterému se má přidat lokace nebo trasa
  taskTitle?: string; // Název úkolu, který byl rozpoznán v textu
  taskDescription?: string; // Popis úkolu, který byl rozpoznán v textu
  planId?: string; // ID plánu, ke kterému se má přidat úkol
  planName?: string; // Název plánu, který byl rozpoznán v textu
}

class SimpleGeminiService {
  private apiKey: string | null = null;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private model = 'gemini-1.5-flash';
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

  // Odeslání zprávy do Gemini API
  async sendMessage(
    message: string,
    mapContext?: { center?: [number, number]; zoom?: number },
    taskContext?: { taskId?: string; planId?: string; currentPlan?: any; taskTitle?: string; taskDescription?: string }
  ): Promise<GeminiMapResponse> {
    if (!this.apiKey) {
      throw new Error('API klíč není nastaven');
    }

    // Kontrola zbývajícího kreditu
    if (this.remainingCredit <= 0) {
      throw new Error('Vyčerpán kredit pro API volání. Maximální limit je ' + this.maxCost + ' CZK.');
    }

    try {
      // Vytvoření požadavku
      const request: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: `Jsi AI asistent pro mapovou aplikaci. Tvým úkolem je pomáhat s navigací, vyhledáváním míst a plánováním.

DŮLEŽITÉ: Tvá odpověď MUSÍ být vždy ve formátu JSON a nic jiného. Nepiš žádný úvod ani vysvětlení mimo JSON.

Pokud uživatel hledá konkrétní místo, odpověz ve formátu JSON s typem "location" a souřadnicemi.
Pokud uživatel hledá trasu mezi místy, odpověz ve formátu JSON s typem "route" a souřadnicemi počátečního a cílového bodu.
Pokud uživatel chce vytvořit plán nebo itinerář, odpověz ve formátu JSON s typem "plan" a strukturovaným plánem.
Pokud uživatel pokládá obecný dotaz, odpověz ve formátu JSON s typem "text" a textovou odpovědí.
Pokud uživatel chce přidat lokaci k úkolu, odpověz ve formátu JSON s typem "taskLocation" a souřadnicemi.
Pokud uživatel chce přidat trasu k úkolu, odpověz ve formátu JSON s typem "taskRoute" a souřadnicemi počátečního a cílového bodu.
Pokud uživatel zmiňuje úkol nebo aktivitu, kterou je třeba udělat, odpověz ve formátu JSON s typem "task" a detaily úkolu.
Pokud uživatel zmiňuje existující úkol a chce ho upravit nebo přepnout na něj, odpověz ve formátu JSON s typem "taskIdentification" a identifikací úkolu.
Pokud je tvým úkolem identifikovat název plánu z textu, odpověz ve formátu JSON s typem "planIdentification" a názvem plánu.

DŮLEŽITÉ: Pokud uživatel zmiňuje, že chce vytvořit nový úkol v novém plánu nebo samostatně (např. "vytvoř nový úkol zvlášť", "vytvoř úkol v novém plánu", "přidej úkol do nové sady"), rozpoznej to jako požadavek na vytvoření nového plánu pro tento úkol a vrať odpověď typu "task" s detaily úkolu.

Příklady formátů odpovědí:
Pro místo: {"type":"location","content":"Našel jsem Prahu na mapě.","location":{"lat":50.0755,"lng":14.4378,"name":"Praha"}}
Pro trasu: {"type":"route","content":"Zde je trasa z Prahy do Brna.","route":{"start":{"lat":50.0755,"lng":14.4378,"name":"Praha"},"end":{"lat":49.1951,"lng":16.6068,"name":"Brno"}}}
Pro plán: {"type":"plan","content":"Vytvořil jsem plán výletu do Prahy.","plan":{"title":"Výlet do Prahy","description":"Jednodenní výlet do Prahy","items":[{"title":"Pražský hrad","description":"Návštěva Pražského hradu","time":"10:00","type":"location","location":{"lat":50.0911,"lng":14.4016,"name":"Pražský hrad"}},{"title":"Oběd","description":"Oběd v restauraci","time":"13:00","type":"task"},{"title":"Karlův most","description":"Procházka po Karlově mostě","time":"15:00","type":"location","location":{"lat":50.0865,"lng":14.4112,"name":"Karlův most"}}]}}
Pro text: {"type":"text","content":"Mohu vám pomoci s vyhledáváním míst nebo plánováním tras."}
Pro lokaci k úkolu: {"type":"taskLocation","content":"Přidal jsem lokaci k úkolu.","location":{"lat":50.0755,"lng":14.4378,"name":"Praha"},"taskId":"123"}
Pro trasu k úkolu: {"type":"taskRoute","content":"Přidal jsem trasu k úkolu.","route":{"start":{"lat":50.0755,"lng":14.4378,"name":"Praha"},"end":{"lat":49.1951,"lng":16.6068,"name":"Brno"}},"taskId":"123"}
Pro nový úkol: {"type":"task","content":"Vytvořil jsem nový úkol.","taskTitle":"Nakoupit potraviny","taskDescription":"Koupit mléko, chléb a ovoce","planId":"456"}
Pro identifikaci úkolu: {"type":"taskIdentification","content":"Našel jsem úkol.","taskId":"123","taskTitle":"Nakoupit potraviny"}
Pro identifikaci plánu: {"type":"planIdentification","content":"Identifikoval jsem plán.","planName":"Výlet do Prahy","planId":"789"}

Pokud uživatel hledá místo, vždy se pokus najít přesné souřadnice a vrátit je v odpovědi.
Pokud uživatel hledá trasu, vždy se pokus najít přesné souřadnice počátečního a cílového bodu.
Pokud uživatel chce vytvořit plán, vždy vytvoř strukturovaný plán s položkami, které mohou obsahovat místa, úkoly nebo trasy.
Pokud uživatel zmiňuje úkol, vždy se pokus identifikovat, zda jde o nový úkol nebo existující úkol.

DŮLEŽITÉ: Pokud uživatel zmiňuje úkol v kontextu plánování (např. "musím nakoupit", "potřebuji zajít", "mám schůzku"), automaticky to rozpoznej jako úkol typu "task" a vrať odpovídající JSON.

DŮLEŽITÉ: Pokud uživatel zmiňuje, že chce vytvořit úkol v novém plánu nebo samostatně (např. "vytvoř nový úkol zvlášť", "vytvoř úkol v novém plánu", "přidej úkol do nové sady"), rozpoznej to jako požadavek na vytvoření nového plánu pro tento úkol.

VELMI DŮLEŽITÉ: Pokud uživatel zmiňuje existující úkol podle názvu (např. "dokončení vývoje jádra AI") a chce k němu přidat místo nebo trasu, musíš to rozpoznat a vrátit odpověď typu "taskLocation" nebo "taskRoute" s příslušnými souřadnicemi.

KRITICKY DŮLEŽITÉ: Pokud je v kontextu úkolu (taskContext) uvedeno ID úkolu, VŽDY ho použij v odpovědi. Pokud uživatel píše o přidání místa k úkolu a je poskytnut taskContext, automaticky vrať odpověď typu "taskLocation" s ID úkolu z kontextu.

ABSOLUTNĚ NEJDŮLEŽITĚJŠÍ: Když je v kontextu úkolu (taskContext) uvedeno ID úkolu (taskId), MUSÍŠ toto ID použít v odpovědi. Nikdy nevymýšlej vlastní ID. Pokud ID úkolu není v kontextu, ale uživatel zadal ID úkolu v dotazu, použij to ID, které zadal uživatel.

DŮLEŽITÉ PRO LOKACE: Když uživatel zmiňuje lokaci, vždy vrať přesné souřadnice. Pro Českou republiku používej tyto souřadnice:
- Praha: {"lat":50.0755,"lng":14.4378,"name":"Praha"}
- Brno: {"lat":49.1951,"lng":16.6068,"name":"Brno"}
- Ostrava: {"lat":49.8209,"lng":18.2625,"name":"Ostrava"}
- Plzeň: {"lat":49.7384,"lng":13.3736,"name":"Plzeň"}
- Liberec: {"lat":50.7663,"lng":15.0543,"name":"Liberec"}
- Olomouc: {"lat":49.5938,"lng":17.2509,"name":"Olomouc"}
- Ústí nad Labem: {"lat":50.6607,"lng":14.0328,"name":"Ústí nad Labem"}
- Hradec Králové: {"lat":50.2099,"lng":15.8325,"name":"Hradec Králové"}
- České Budějovice: {"lat":48.9747,"lng":14.4744,"name":"České Budějovice"}
- Pardubice: {"lat":50.0343,"lng":15.7812,"name":"Pardubice"}
- Zlín: {"lat":49.2248,"lng":17.6627,"name":"Zlín"}
- Havířov: {"lat":49.7797,"lng":18.4375,"name":"Havířov"}
- Kladno: {"lat":50.1429,"lng":14.1080,"name":"Kladno"}
- Most: {"lat":50.5031,"lng":13.6365,"name":"Most"}
- Opava: {"lat":49.9391,"lng":17.9019,"name":"Opava"}
- Frýdek-Místek: {"lat":49.6841,"lng":18.3494,"name":"Frýdek-Místek"}
- Jihlava: {"lat":49.3961,"lng":15.5903,"name":"Jihlava"}
- Karviná: {"lat":49.8543,"lng":18.5414,"name":"Karviná"}
- Teplice: {"lat":50.6404,"lng":13.8244,"name":"Teplice"}
- Děčín: {"lat":50.7731,"lng":14.2133,"name":"Děčín"}
- Hodonín: {"lat":48.8492,"lng":17.1247,"name":"Hodonín"}
- Rohatec: {"lat":48.8783,"lng":17.1750,"name":"Rohatec"}

Příklady zpráv, které by měly být rozpoznány jako přidání lokace k úkolu:
- "přidej místo k dokončení vývoje jádra AI"
- "přidej Prahu k úkolu dokončení vývoje"
- "najdi Brno pro úkol vývoj jádra"
- "přidej lokaci Praha k úkolu"
- "přidej Hodonín k úkolu Dokončení vývoje AI Mapy"
- "přidej místo Hodonín do úkolu s ID: 1-1"
- "přidej lokaci k úkolu"
- "přidej místo k úkolu"
- "přidej jakoukoliv lokaci k úkolu"
- "dej tam jakoukoliv lokalitu"

Příklady zpráv, které by měly být rozpoznány jako vytvoření úkolu v novém plánu:
- "vytvoř nový úkol zvlášť: nakoupit potraviny"
- "přidej úkol do nové sady: zavolat mamince"
- "vytvoř úkol v novém plánu: dokončit projekt"
- "vytvoř samostatný plán pro úkol: vyzvednout balík"
- "přidej nový úkol odděleně: uklidit byt"

Pokud uživatel zmiňuje konkrétní ID úkolu (např. "přidej místo k úkolu s ID: 1-1"), vždy použij toto ID v odpovědi, i když je v kontextu jiné ID.

${mapContext ? `Aktuální pozice na mapě: ${mapContext.center}, zoom: ${mapContext.zoom}` : ''}
${taskContext ? `Kontext úkolu: ID úkolu: ${taskContext.taskId}, ID plánu: ${taskContext.planId}, Název úkolu: "${taskContext.taskTitle || 'Neznámý úkol'}", Popis: "${taskContext.taskDescription || 'Bez popisu'}"` : ''}

Uživatelský dotaz: ${message}

PAMATUJ: Odpověz POUZE validním JSON objektem a nic jiného.`
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
        console.log('Pokus o parsování JSON odpovědi:', textResponse);

        // Odstranění případných přebytečných znaků před a za JSON
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonString = jsonMatch[0];
          console.log('Extrahovaný JSON:', jsonString);

          try {
            const jsonResponse = JSON.parse(jsonString) as GeminiMapResponse;
            console.log('Parsovaná JSON odpověď:', jsonResponse);

            // Validace a doplnění chybějících údajů
            if (jsonResponse.type === 'taskLocation' && !jsonResponse.location) {
              // Pokud chybí lokace, přidáme výchozí (Praha)
              console.log('Chybí lokace v odpovědi typu taskLocation, přidávám výchozí lokaci (Praha)');
              jsonResponse.location = {
                lat: 50.0755,
                lng: 14.4378,
                name: "Praha"
              };
            }

            // Pokud je typ taskLocation a máme kontext úkolu, ale chybí taskId
            if (jsonResponse.type === 'taskLocation' && !jsonResponse.taskId && taskContext?.taskId) {
              console.log('Chybí taskId v odpovědi typu taskLocation, přidávám z kontextu:', taskContext.taskId);
              jsonResponse.taskId = taskContext.taskId;
            }

            // Pokud je typ taskRoute a máme kontext úkolu, ale chybí taskId
            if (jsonResponse.type === 'taskRoute' && !jsonResponse.taskId && taskContext?.taskId) {
              console.log('Chybí taskId v odpovědi typu taskRoute, přidávám z kontextu:', taskContext.taskId);
              jsonResponse.taskId = taskContext.taskId;
            }

            // Pokud je typ task a máme kontext plánu, ale chybí planId
            if (jsonResponse.type === 'task' && !jsonResponse.planId && taskContext?.planId) {
              console.log('Chybí planId v odpovědi typu task, přidávám z kontextu:', taskContext.planId);
              jsonResponse.planId = taskContext.planId;
            }

            // Pokud je typ task, ale nemá taskTitle nebo taskDescription, přidáme výchozí hodnoty
            if (jsonResponse.type === 'task') {
              if (!jsonResponse.taskTitle) {
                console.log('Chybí taskTitle v odpovědi typu task, přidávám výchozí hodnotu');
                jsonResponse.taskTitle = 'Nový úkol';
              }
              if (!jsonResponse.taskDescription) {
                console.log('Chybí taskDescription v odpovědi typu task, přidávám výchozí hodnotu');
                jsonResponse.taskDescription = 'Popis úkolu';
              }
            }

            return jsonResponse;
          } catch (jsonError) {
            console.error('Chyba při parsování JSON:', jsonError);

            // Pokus o opravu JSON
            try {
              // Pokus o odstranění escape znaků a opětovné parsování
              const cleanedJson = jsonString.replace(/\\"/g, '"').replace(/\\n/g, ' ');
              const jsonResponse = JSON.parse(cleanedJson) as GeminiMapResponse;
              console.log('Parsovaná opravená JSON odpověď:', jsonResponse);
              return jsonResponse;
            } catch (cleanError) {
              console.error('Chyba při parsování opraveného JSON:', cleanError);

              // Pokud je v textu zmínka o přidání lokace k úkolu a máme kontext úkolu
              if (message.toLowerCase().includes('přidej') &&
                  (message.toLowerCase().includes('lokaci') || message.toLowerCase().includes('místo')) &&
                  message.toLowerCase().includes('úkol') &&
                  taskContext?.taskId) {
                console.log('Detekován požadavek na přidání lokace k úkolu z kontextu:', taskContext.taskId);

                // Vytvoříme odpověď typu taskLocation s výchozí lokací (Praha)
                return {
                  type: 'taskLocation',
                  content: 'Přidal jsem lokaci k úkolu.',
                  location: {
                    lat: 50.0755,
                    lng: 14.4378,
                    name: "Praha"
                  },
                  taskId: taskContext.taskId
                };
              }

              return {
                type: 'text',
                content: textResponse
              };
            }
          }
        } else {
          console.log('Nenalezen validní JSON v odpovědi');

          // Pokud je v textu zmínka o přidání lokace k úkolu a máme kontext úkolu
          if (message.toLowerCase().includes('přidej') &&
              (message.toLowerCase().includes('lokaci') || message.toLowerCase().includes('místo')) &&
              message.toLowerCase().includes('úkol') &&
              taskContext?.taskId) {
            console.log('Detekován požadavek na přidání lokace k úkolu z kontextu:', taskContext.taskId);

            // Vytvoříme odpověď typu taskLocation s výchozí lokací (Praha)
            return {
              type: 'taskLocation',
              content: 'Přidal jsem lokaci k úkolu.',
              location: {
                lat: 50.0755,
                lng: 14.4378,
                name: "Praha"
              },
              taskId: taskContext.taskId
            };
          }

          return {
            type: 'text',
            content: textResponse
          };
        }
      } catch (error) {
        // Pokud odpověď není validní JSON, vrátíme textovou odpověď
        console.error('Chyba při parsování JSON:', error);

        // Pokud je v textu zmínka o přidání lokace k úkolu a máme kontext úkolu
        if (message.toLowerCase().includes('přidej') &&
            (message.toLowerCase().includes('lokaci') || message.toLowerCase().includes('místo')) &&
            message.toLowerCase().includes('úkol') &&
            taskContext?.taskId) {
          console.log('Detekován požadavek na přidání lokace k úkolu z kontextu po chybě:', taskContext.taskId);

          // Vytvoříme odpověď typu taskLocation s výchozí lokací (Praha)
          return {
            type: 'taskLocation',
            content: 'Přidal jsem lokaci k úkolu.',
            location: {
              lat: 50.0755,
              lng: 14.4378,
              name: "Praha"
            },
            taskId: taskContext.taskId
          };
        }

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

// Vytvoření instance služby
const simpleGeminiService = new SimpleGeminiService();
export default simpleGeminiService;
