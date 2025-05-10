/**
 * TaskLocationService - Služba pro automatické přiřazování lokalit k úkolům
 * Verze 0.4.2
 *
 * Vylepšená verze s učícím mechanismem a AI integrací
 */

import { PlanItem } from '../components/Planning/PlanningPanel';
import simpleGeminiService from './SimpleGeminiService';

// Typy lokalit
export interface Location {
  lat: number;
  lng: number;
  name?: string;
  description?: string;
  type?: string;
  icon?: string;
}

// Rozhraní pro výsledek přiřazení lokality
export interface LocationAssignmentResult {
  taskId: string;
  taskTitle: string;
  taskDescription?: string;
  assignedLocation: Location;
  accuracy: number; // 0-100%
  confidence: number; // 0-100%
  method: 'ai' | 'keyword' | 'random' | 'user';
  timestamp: number;
}

// Rozhraní pro statistiky přiřazování lokalit
export interface LocationAssignmentStats {
  totalAssignments: number;
  aiAssignments: number;
  keywordAssignments: number;
  randomAssignments: number;
  userAssignments: number;
  averageAccuracy: number;
  averageConfidence: number;
  lastUpdated: number;
}

// Rozhraní pro skryté popisy lokalit
export interface HiddenLocationDescription {
  taskId: string;
  planId: string;
  suggestedLocations: Location[];
  confidence: number; // 0-100%
  keywords: string[];
  timestamp: number;
}

// Databáze známých lokalit
const knownLocations: { [key: string]: Location } = {
  // Česká města
  'praha': { lat: 50.0755, lng: 14.4378, name: 'Praha', type: 'city', icon: '🏙️' },
  'brno': { lat: 49.1951, lng: 16.6068, name: 'Brno', type: 'city', icon: '🏙️' },
  'ostrava': { lat: 49.8209, lng: 18.2625, name: 'Ostrava', type: 'city', icon: '🏙️' },
  'plzeň': { lat: 49.7384, lng: 13.3736, name: 'Plzeň', type: 'city', icon: '🏙️' },
  'liberec': { lat: 50.7663, lng: 15.0543, name: 'Liberec', type: 'city', icon: '🏙️' },
  'olomouc': { lat: 49.5938, lng: 17.2508, name: 'Olomouc', type: 'city', icon: '🏙️' },
  'české budějovice': { lat: 48.9747, lng: 14.4744, name: 'České Budějovice', type: 'city', icon: '🏙️' },
  'hradec králové': { lat: 50.2092, lng: 15.8328, name: 'Hradec Králové', type: 'city', icon: '🏙️' },
  'ústí nad labem': { lat: 50.6607, lng: 14.0328, name: 'Ústí nad Labem', type: 'city', icon: '🏙️' },
  'pardubice': { lat: 50.0343, lng: 15.7812, name: 'Pardubice', type: 'city', icon: '🏙️' },
  'zlín': { lat: 49.2248, lng: 17.6627, name: 'Zlín', type: 'city', icon: '🏙️' },
  'havířov': { lat: 49.7797, lng: 18.4375, name: 'Havířov', type: 'city', icon: '🏙️' },
  'kladno': { lat: 50.1429, lng: 14.1014, name: 'Kladno', type: 'city', icon: '🏙️' },
  'most': { lat: 50.5031, lng: 13.6362, name: 'Most', type: 'city', icon: '🏙️' },
  'opava': { lat: 49.9391, lng: 17.9019, name: 'Opava', type: 'city', icon: '🏙️' },
  'frýdek-místek': { lat: 49.6841, lng: 18.3494, name: 'Frýdek-Místek', type: 'city', icon: '🏙️' },
  'karviná': { lat: 49.8543, lng: 18.5420, name: 'Karviná', type: 'city', icon: '🏙️' },
  'jihlava': { lat: 49.3961, lng: 15.5903, name: 'Jihlava', type: 'city', icon: '🏙️' },
  'teplice': { lat: 50.6404, lng: 13.8244, name: 'Teplice', type: 'city', icon: '🏙️' },
  'děčín': { lat: 50.7731, lng: 14.2133, name: 'Děčín', type: 'city', icon: '🏙️' },
  'karlovy vary': { lat: 50.2304, lng: 12.8716, name: 'Karlovy Vary', type: 'city', icon: '🏙️' },
  'hodonín': { lat: 48.8494, lng: 17.1269, name: 'Hodonín', type: 'city', icon: '🏙️' },

  // Zajímavá místa v Praze
  'pražský hrad': { lat: 50.0911, lng: 14.4016, name: 'Pražský hrad', type: 'landmark', icon: '🏰' },
  'karlův most': { lat: 50.0865, lng: 14.4115, name: 'Karlův most', type: 'landmark', icon: '🌉' },
  'staroměstské náměstí': { lat: 50.0880, lng: 14.4208, name: 'Staroměstské náměstí', type: 'landmark', icon: '🏛️' },
  'václavské náměstí': { lat: 50.0793, lng: 14.4293, name: 'Václavské náměstí', type: 'landmark', icon: '🏛️' },
  'petřín': { lat: 50.0830, lng: 14.3980, name: 'Petřín', type: 'landmark', icon: '🏞️' },
  'vyšehrad': { lat: 50.0640, lng: 14.4180, name: 'Vyšehrad', type: 'landmark', icon: '🏰' },
  'letiště václava havla': { lat: 50.1008, lng: 14.2632, name: 'Letiště Václava Havla', type: 'airport', icon: '✈️' },
  'hlavní nádraží': { lat: 50.0830, lng: 14.4350, name: 'Hlavní nádraží', type: 'station', icon: '🚉' },

  // Zajímavá místa v Brně
  'špilberk': { lat: 49.1947, lng: 16.6001, name: 'Špilberk', type: 'landmark', icon: '🏰' },
  'katedrála sv. petra a pavla': { lat: 49.1913, lng: 16.6079, name: 'Katedrála sv. Petra a Pavla', type: 'landmark', icon: '⛪' },
  'brněnské výstaviště': { lat: 49.1865, lng: 16.5788, name: 'Brněnské výstaviště', type: 'landmark', icon: '🏢' },

  // Zajímavá místa v Ostravě
  'dolní vítkovice': { lat: 49.8204, lng: 18.2667, name: 'Dolní Vítkovice', type: 'landmark', icon: '🏭' },
  'zoo ostrava': { lat: 49.8428, lng: 18.2925, name: 'ZOO Ostrava', type: 'landmark', icon: '🦁' },

  // Zajímavá místa v Plzni
  'náměstí republiky plzeň': { lat: 49.7471, lng: 13.3775, name: 'Náměstí Republiky Plzeň', type: 'landmark', icon: '🏛️' },
  'pivovar plzeňský prazdroj': { lat: 49.7477, lng: 13.3881, name: 'Pivovar Plzeňský Prazdroj', type: 'landmark', icon: '🍺' },
  'zoo plzeň': { lat: 49.7577, lng: 13.3620, name: 'ZOO Plzeň', type: 'landmark', icon: '🦁' },

  // Zajímavá místa v Liberci
  'ještěd': { lat: 50.7325, lng: 14.9840, name: 'Ještěd', type: 'landmark', icon: '🗼' },
  'zoo liberec': { lat: 50.7754, lng: 15.0779, name: 'ZOO Liberec', type: 'landmark', icon: '🦁' },

  // Zajímavá místa v Olomouci
  'sloup nejsvětější trojice': { lat: 49.5938, lng: 17.2508, name: 'Sloup Nejsvětější Trojice', type: 'landmark', icon: '🏛️' },

  // Zajímavá místa v Českých Budějovicích
  'náměstí přemysla otakara ii': { lat: 48.9747, lng: 14.4744, name: 'Náměstí Přemysla Otakara II', type: 'landmark', icon: '🏛️' },
  'černá věž': { lat: 48.9747, lng: 14.4744, name: 'Černá věž', type: 'landmark', icon: '🗼' },

  // Zajímavá místa v Karlových Varech
  'kolonáda': { lat: 50.2304, lng: 12.8716, name: 'Kolonáda', type: 'landmark', icon: '🏛️' },

  // Zajímavá místa v Hodoníně
  'masarykovo náměstí': { lat: 48.8494, lng: 17.1269, name: 'Masarykovo náměstí', type: 'landmark', icon: '🏛️' },
  'zoo hodonín': { lat: 48.8494, lng: 17.1269, name: 'ZOO Hodonín', type: 'landmark', icon: '🦁' },
};

// Funkce pro detekci lokací v textu
export const detectLocationsInText = (text: string): Location[] => {
  if (!text) return [];

  const detectedLocations: Location[] = [];
  const textLower = text.toLowerCase();

  // Procházíme všechny známé lokace a hledáme je v textu
  Object.entries(knownLocations).forEach(([key, location]) => {
    if (textLower.includes(key)) {
      detectedLocations.push(location);
    }
  });

  return detectedLocations;
};

// Funkce pro generování skrytého popisu lokality pomocí AI
export const generateHiddenLocationDescription = async (
  taskId: string,
  planId: string,
  taskTitle: string,
  taskDescription?: string
): Promise<HiddenLocationDescription | null> => {
  try {
    // Kontrola, zda máme API klíč
    if (!simpleGeminiService.getApiKey()) {
      console.warn('Nelze generovat skrytý popis lokality - chybí API klíč');
      return null;
    }

    // Vytvoření dotazu pro AI
    const prompt = `Analyzuj následující úkol a navrhni nejvhodnější lokaci pro jeho splnění.

    Název úkolu: "${taskTitle}"
    ${taskDescription ? `Popis úkolu: "${taskDescription}"` : ''}

    Vrať odpověď ve formátu JSON s těmito vlastnostmi:
    - suggestedLocations: pole navržených lokalit (1-3) s lat, lng, name
    - confidence: číslo 0-100 vyjadřující jistotu návrhu
    - keywords: pole klíčových slov, která vedla k výběru lokality

    Pokud v úkolu není zmíněna žádná lokalita, vrať prázdné pole suggestedLocations a confidence 0.`;

    // Odeslání dotazu na AI
    const response = await simpleGeminiService.sendMessage(prompt, undefined, {
      taskId,
      planId,
      taskTitle,
      taskDescription
    });

    // Zpracování odpovědi
    if (response.type === 'text' && response.content) {
      try {
        // Pokus o extrakci JSON z odpovědi
        const jsonMatch = response.content.match(/\{.*\}/s);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);

          // Vytvoření skrytého popisu lokality
          const hiddenDescription: HiddenLocationDescription = {
            taskId,
            planId,
            suggestedLocations: jsonData.suggestedLocations || [],
            confidence: jsonData.confidence || 0,
            keywords: jsonData.keywords || [],
            timestamp: Date.now()
          };

          // Uložení skrytého popisu do localStorage
          saveHiddenLocationDescription(hiddenDescription);

          return hiddenDescription;
        }
      } catch (error) {
        console.error('Chyba při parsování odpovědi AI:', error);
      }
    }

    // Pokud se nepodařilo získat odpověď z AI, vytvoříme prázdný popis
    const emptyDescription: HiddenLocationDescription = {
      taskId,
      planId,
      suggestedLocations: [],
      confidence: 0,
      keywords: [],
      timestamp: Date.now()
    };

    // Uložení prázdného popisu do localStorage
    saveHiddenLocationDescription(emptyDescription);

    return emptyDescription;
  } catch (error) {
    console.error('Chyba při generování skrytého popisu lokality:', error);
    return null;
  }
};

// Funkce pro uložení skrytého popisu lokality
export const saveHiddenLocationDescription = (description: HiddenLocationDescription): void => {
  try {
    // Načtení existujících popisů
    const savedDescriptions = localStorage.getItem('hiddenLocationDescriptions');
    let descriptions: HiddenLocationDescription[] = [];

    if (savedDescriptions) {
      descriptions = JSON.parse(savedDescriptions);
    }

    // Kontrola, zda již existuje popis pro tento úkol
    const existingIndex = descriptions.findIndex(d => d.taskId === description.taskId);

    if (existingIndex !== -1) {
      // Aktualizace existujícího popisu
      descriptions[existingIndex] = description;
    } else {
      // Přidání nového popisu
      descriptions.push(description);
    }

    // Uložení aktualizovaných popisů
    localStorage.setItem('hiddenLocationDescriptions', JSON.stringify(descriptions));
  } catch (error) {
    console.error('Chyba při ukládání skrytého popisu lokality:', error);
  }
};

// Funkce pro získání skrytého popisu lokality
export const getHiddenLocationDescription = (taskId: string): HiddenLocationDescription | null => {
  try {
    // Načtení existujících popisů
    const savedDescriptions = localStorage.getItem('hiddenLocationDescriptions');

    if (!savedDescriptions) {
      return null;
    }

    const descriptions: HiddenLocationDescription[] = JSON.parse(savedDescriptions);

    // Hledání popisu pro tento úkol
    const description = descriptions.find(d => d.taskId === taskId);

    return description || null;
  } catch (error) {
    console.error('Chyba při získávání skrytého popisu lokality:', error);
    return null;
  }
};

// Funkce pro přidání lokace k úkolu
export const addLocationToTask = (
  taskId: string,
  planId: string,
  location: Location,
  method: 'ai' | 'keyword' | 'random' | 'user' = 'user',
  confidence: number = 100,
  onSuccess?: (updatedTask: PlanItem) => void
): boolean => {
  try {
    // Načtení aktuálních plánů
    const savedPlans = localStorage.getItem('plans');
    if (!savedPlans) {
      console.error('Žádné plány nebyly nalezeny');
      return false;
    }

    const plans = JSON.parse(savedPlans);
    const planIndex = plans.findIndex((p: any) => p.id === planId);

    if (planIndex === -1) {
      console.error(`Plán s ID ${planId} nebyl nalezen`);
      return false;
    }

    const plan = plans[planIndex];
    const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);

    if (taskIndex === -1) {
      console.error(`Úkol s ID ${taskId} nebyl nalezen v plánu ${planId}`);
      return false;
    }

    // Aktualizace úkolu s novou lokací
    plan.items[taskIndex] = {
      ...plan.items[taskIndex],
      type: 'location',
      location: {
        lat: location.lat,
        lng: location.lng,
        name: location.name || 'Neznámé místo'
      }
    };

    // Uložení aktualizovaných plánů
    localStorage.setItem('plans', JSON.stringify(plans));

    // Uložení výsledku přiřazení lokality
    const result: LocationAssignmentResult = {
      taskId,
      taskTitle: plan.items[taskIndex].title,
      taskDescription: plan.items[taskIndex].description,
      assignedLocation: location,
      accuracy: 0, // Bude aktualizováno později při testování
      confidence,
      method,
      timestamp: Date.now()
    };

    // Uložení výsledku do localStorage
    saveLocationAssignmentResult(result);

    // Aktualizace statistik
    updateLocationAssignmentStats(result);

    // Vyvolání události pro aktualizaci UI
    setTimeout(() => {
      // Dispatch event pro aktualizaci UI - toto pomůže synchronizovat stav mezi komponentami
      const planUpdatedEvent = new CustomEvent('planUpdated', {
        detail: {
          planId: planId,
          taskId: taskId,
          taskIndex: taskIndex
        }
      });
      window.dispatchEvent(planUpdatedEvent);

      // Callback pro úspěšné přidání lokace
      if (onSuccess) {
        onSuccess(plan.items[taskIndex]);
      }
    }, 100);

    return true;
  } catch (error) {
    console.error('Chyba při přidávání lokace k úkolu:', error);
    return false;
  }
};

// Funkce pro uložení výsledku přiřazení lokality
export const saveLocationAssignmentResult = (result: LocationAssignmentResult): void => {
  try {
    // Načtení existujících výsledků
    const savedResults = localStorage.getItem('locationAssignmentResults');
    let results: LocationAssignmentResult[] = [];

    if (savedResults) {
      results = JSON.parse(savedResults);
    }

    // Kontrola, zda již existuje výsledek pro tento úkol
    const existingIndex = results.findIndex(r => r.taskId === result.taskId);

    if (existingIndex !== -1) {
      // Aktualizace existujícího výsledku
      results[existingIndex] = result;
    } else {
      // Přidání nového výsledku
      results.push(result);
    }

    // Uložení aktualizovaných výsledků
    localStorage.setItem('locationAssignmentResults', JSON.stringify(results));
  } catch (error) {
    console.error('Chyba při ukládání výsledku přiřazení lokality:', error);
  }
};

// Funkce pro aktualizaci statistik přiřazování lokalit
export const updateLocationAssignmentStats = (result: LocationAssignmentResult): void => {
  try {
    // Načtení existujících statistik
    const savedStats = localStorage.getItem('locationAssignmentStats');
    let stats: LocationAssignmentStats = {
      totalAssignments: 0,
      aiAssignments: 0,
      keywordAssignments: 0,
      randomAssignments: 0,
      userAssignments: 0,
      averageAccuracy: 0,
      averageConfidence: 0,
      lastUpdated: Date.now()
    };

    if (savedStats) {
      stats = JSON.parse(savedStats);
    }

    // Aktualizace statistik
    stats.totalAssignments++;

    switch (result.method) {
      case 'ai':
        stats.aiAssignments++;
        break;
      case 'keyword':
        stats.keywordAssignments++;
        break;
      case 'random':
        stats.randomAssignments++;
        break;
      case 'user':
        stats.userAssignments++;
        break;
    }

    // Aktualizace průměrné přesnosti a jistoty
    const savedResults = localStorage.getItem('locationAssignmentResults');
    if (savedResults) {
      const results: LocationAssignmentResult[] = JSON.parse(savedResults);

      // Výpočet průměrné přesnosti a jistoty
      let totalAccuracy = 0;
      let totalConfidence = 0;

      results.forEach(r => {
        totalAccuracy += r.accuracy;
        totalConfidence += r.confidence;
      });

      stats.averageAccuracy = totalAccuracy / results.length;
      stats.averageConfidence = totalConfidence / results.length;
    }

    stats.lastUpdated = Date.now();

    // Uložení aktualizovaných statistik
    localStorage.setItem('locationAssignmentStats', JSON.stringify(stats));
  } catch (error) {
    console.error('Chyba při aktualizaci statistik přiřazování lokalit:', error);
  }
};

// Funkce pro automatické přiřazení lokací ke všem úkolům v plánu
export const autoAssignLocationsToTasks = async (
  planId: string,
  onProgress?: (progress: { total: number, processed: number, updated: number, skipped: number }) => void
): Promise<{ total: number, updated: number, skipped: number }> => {
  try {
    // Načtení aktuálních plánů
    const savedPlans = localStorage.getItem('plans');
    if (!savedPlans) {
      console.error('Žádné plány nebyly nalezeny');
      return { total: 0, updated: 0, skipped: 0 };
    }

    const plans = JSON.parse(savedPlans);
    const planIndex = plans.findIndex((p: any) => p.id === planId);

    if (planIndex === -1) {
      console.error(`Plán s ID ${planId} nebyl nalezen`);
      return { total: 0, updated: 0, skipped: 0 };
    }

    const plan = plans[planIndex];

    // Počítadla pro statistiky
    let total = 0;
    let updated = 0;
    let skipped = 0;

    // Procházíme všechny úkoly v plánu
    if (plan.items && Array.isArray(plan.items)) {
      total = plan.items.length;

      // Použijeme for...of místo forEach, abychom mohli použít await
      for (const item of plan.items) {
        // Přeskočíme úkoly, které již mají lokaci
        if (item.type === 'location' && item.location) {
          console.log(`Úkol "${item.title}" (ID: ${item.id}) již má lokaci, přeskakuji.`);
          skipped++;

          // Aktualizace progress callbacku
          if (onProgress) {
            onProgress({
              total,
              processed: updated + skipped,
              updated,
              skipped
            });
          }

          continue;
        }

        // Nejprve zkontrolujeme, zda existuje skrytý popis lokality
        let hiddenDescription = getHiddenLocationDescription(item.id);

        // Pokud neexistuje skrytý popis, vygenerujeme ho
        if (!hiddenDescription && simpleGeminiService.getApiKey()) {
          console.log(`Generuji skrytý popis lokality pro úkol "${item.title}" (ID: ${item.id})`);
          hiddenDescription = await generateHiddenLocationDescription(
            item.id,
            planId,
            item.title,
            item.description
          );
        }

        // Pokud máme skrytý popis s dostatečnou jistotou a navrženými lokalitami
        if (hiddenDescription &&
            hiddenDescription.confidence >= 70 &&
            hiddenDescription.suggestedLocations.length > 0) {

          // Použijeme první navrženou lokaci
          const locationToAdd = hiddenDescription.suggestedLocations[0];

          // Přidáme lokaci k úkolu
          console.log(`Přidávám AI navrženou lokaci ${locationToAdd.name} k úkolu "${item.title}" (ID: ${item.id})`);
          const success = addLocationToTask(
            item.id,
            planId,
            locationToAdd,
            'ai',
            hiddenDescription.confidence
          );

          if (success) {
            updated++;
          }
        } else {
          // Pokud nemáme skrytý popis nebo má nízkou jistotu, zkusíme detekci klíčových slov
          const titleLocations = detectLocationsInText(item.title);
          const descriptionLocations = item.description ? detectLocationsInText(item.description) : [];

          // Spojení nalezených lokací
          const detectedLocations = [...titleLocations, ...descriptionLocations];

          if (detectedLocations.length > 0) {
            // Použijeme první nalezenou lokaci
            const locationToAdd = detectedLocations[0];

            // Přidáme lokaci k úkolu
            console.log(`Přidávám lokaci ${locationToAdd.name} detekovanou z klíčových slov k úkolu "${item.title}" (ID: ${item.id})`);
            const success = addLocationToTask(
              item.id,
              planId,
              locationToAdd,
              'keyword',
              80
            );

            if (success) {
              updated++;
            }
          } else {
            // Pokud nebyla nalezena žádná lokace, přidáme náhodnou lokaci
            const randomLocationKeys = Object.keys(knownLocations);
            const randomKey = randomLocationKeys[Math.floor(Math.random() * randomLocationKeys.length)];
            const randomLocation = knownLocations[randomKey];

            console.log(`Přidávám náhodnou lokaci ${randomLocation.name} k úkolu "${item.title}" (ID: ${item.id})`);
            const success = addLocationToTask(
              item.id,
              planId,
              randomLocation,
              'random',
              30
            );

            if (success) {
              updated++;
            }
          }
        }

        // Aktualizace progress callbacku
        if (onProgress) {
          onProgress({
            total,
            processed: updated + skipped,
            updated,
            skipped
          });
        }

        // Krátká pauza, aby se UI mohlo aktualizovat
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return { total, updated, skipped };
  } catch (error) {
    console.error('Chyba při automatickém přiřazování lokalit k úkolům:', error);
    return { total: 0, updated: 0, skipped: 0 };
  }
};

// Funkce pro testování přesnosti přiřazování lokalit
export const testLocationAssignmentAccuracy = async (
  planId: string,
  onProgress?: (progress: { total: number, processed: number, tested: number }) => void
): Promise<{ total: number, tested: number, averageAccuracy: number }> => {
  try {
    // Načtení aktuálních plánů
    const savedPlans = localStorage.getItem('plans');
    if (!savedPlans) {
      console.error('Žádné plány nebyly nalezeny');
      return { total: 0, tested: 0, averageAccuracy: 0 };
    }

    const plans = JSON.parse(savedPlans);
    const planIndex = plans.findIndex((p: any) => p.id === planId);

    if (planIndex === -1) {
      console.error(`Plán s ID ${planId} nebyl nalezen`);
      return { total: 0, tested: 0, averageAccuracy: 0 };
    }

    const plan = plans[planIndex];

    // Počítadla pro statistiky
    let total = 0;
    let tested = 0;
    let totalAccuracy = 0;

    // Načtení výsledků přiřazení lokalit
    const savedResults = localStorage.getItem('locationAssignmentResults');
    let results: LocationAssignmentResult[] = [];

    if (savedResults) {
      results = JSON.parse(savedResults);
    }

    // Procházíme všechny úkoly v plánu
    if (plan.items && Array.isArray(plan.items)) {
      // Filtrujeme pouze úkoly s lokací
      const tasksWithLocation = plan.items.filter((item: { type: string; location?: any }) => item.type === 'location' && item.location);
      total = tasksWithLocation.length;

      // Použijeme for...of místo forEach, abychom mohli použít await
      for (const item of tasksWithLocation) {
        // Najdeme výsledek přiřazení pro tento úkol
        const result = results.find(r => r.taskId === item.id);

        if (result) {
          // Testování přesnosti přiřazení
          console.log(`Testování přesnosti přiřazení lokality pro úkol "${item.title}" (ID: ${item.id})`);

          // Pokud máme API klíč, použijeme AI pro testování přesnosti
          if (simpleGeminiService.getApiKey()) {
            try {
              // Vytvoření dotazu pro AI
              const prompt = `Ohodnoť přesnost přiřazení lokality k úkolu.

              Název úkolu: "${item.title}"
              ${item.description ? `Popis úkolu: "${item.description}"` : ''}
              Přiřazená lokalita: "${item.location.name}" (${item.location.lat}, ${item.location.lng})

              Vrať pouze číslo od 0 do 100, které vyjadřuje, jak přesně odpovídá přiřazená lokalita úkolu.
              100 znamená perfektní shodu, 0 znamená naprosto nevhodnou lokaci.
              Nepiš žádný další text, pouze číslo.`;

              // Odeslání dotazu na AI
              const response = await simpleGeminiService.sendMessage(prompt);

              // Zpracování odpovědi
              if (response.type === 'text' && response.content) {
                // Extrakce čísla z odpovědi
                const accuracyMatch = response.content.match(/\d+/);
                if (accuracyMatch) {
                  const accuracy = parseInt(accuracyMatch[0]);

                  // Aktualizace výsledku přiřazení
                  result.accuracy = accuracy;
                  totalAccuracy += accuracy;
                  tested++;

                  // Uložení aktualizovaného výsledku
                  saveLocationAssignmentResult(result);

                  console.log(`Přesnost přiřazení lokality pro úkol "${item.title}": ${accuracy}%`);
                }
              }
            } catch (error) {
              console.error('Chyba při testování přesnosti přiřazení lokality:', error);
            }
          } else {
            // Pokud nemáme API klíč, použijeme jednoduchý algoritmus
            // Pokud byla lokace přiřazena pomocí AI nebo klíčových slov, předpokládáme vyšší přesnost
            let accuracy = 0;

            switch (result.method) {
              case 'ai':
                accuracy = 85;
                break;
              case 'keyword':
                accuracy = 70;
                break;
              case 'user':
                accuracy = 95;
                break;
              case 'random':
                accuracy = 20;
                break;
            }

            // Aktualizace výsledku přiřazení
            result.accuracy = accuracy;
            totalAccuracy += accuracy;
            tested++;

            // Uložení aktualizovaného výsledku
            saveLocationAssignmentResult(result);

            console.log(`Přesnost přiřazení lokality pro úkol "${item.title}": ${accuracy}% (odhadnuto)`);
          }
        }

        // Aktualizace progress callbacku
        if (onProgress) {
          onProgress({
            total,
            processed: tested,
            tested
          });
        }

        // Krátká pauza, aby se UI mohlo aktualizovat
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Výpočet průměrné přesnosti
    const averageAccuracy = tested > 0 ? totalAccuracy / tested : 0;

    // Aktualizace statistik
    const savedStats = localStorage.getItem('locationAssignmentStats');
    if (savedStats) {
      const stats: LocationAssignmentStats = JSON.parse(savedStats);
      stats.averageAccuracy = averageAccuracy;
      stats.lastUpdated = Date.now();
      localStorage.setItem('locationAssignmentStats', JSON.stringify(stats));
    }

    return { total, tested, averageAccuracy };
  } catch (error) {
    console.error('Chyba při testování přesnosti přiřazování lokalit:', error);
    return { total: 0, tested: 0, averageAccuracy: 0 };
  }
};

// Funkce pro získání statistik přiřazování lokalit
export const getLocationAssignmentStats = (): LocationAssignmentStats => {
  try {
    // Načtení existujících statistik
    const savedStats = localStorage.getItem('locationAssignmentStats');

    if (savedStats) {
      return JSON.parse(savedStats);
    }

    // Výchozí statistiky
    return {
      totalAssignments: 0,
      aiAssignments: 0,
      keywordAssignments: 0,
      randomAssignments: 0,
      userAssignments: 0,
      averageAccuracy: 0,
      averageConfidence: 0,
      lastUpdated: Date.now()
    };
  } catch (error) {
    console.error('Chyba při získávání statistik přiřazování lokalit:', error);

    // Výchozí statistiky
    return {
      totalAssignments: 0,
      aiAssignments: 0,
      keywordAssignments: 0,
      randomAssignments: 0,
      userAssignments: 0,
      averageAccuracy: 0,
      averageConfidence: 0,
      lastUpdated: Date.now()
    };
  }
};

// Funkce pro automatické učení a vylepšování přiřazování lokalit
export const improveLocationAssignment = async (): Promise<boolean> => {
  try {
    // Kontrola, zda máme API klíč
    if (!simpleGeminiService.getApiKey()) {
      console.warn('Nelze vylepšit přiřazování lokalit - chybí API klíč');
      return false;
    }

    // Načtení výsledků přiřazení lokalit
    const savedResults = localStorage.getItem('locationAssignmentResults');
    if (!savedResults) {
      console.warn('Nelze vylepšit přiřazování lokalit - chybí výsledky přiřazení');
      return false;
    }

    const results: LocationAssignmentResult[] = JSON.parse(savedResults);

    // Filtrujeme pouze výsledky s nízkou přesností
    const lowAccuracyResults = results.filter(r => r.accuracy < 50);

    if (lowAccuracyResults.length === 0) {
      console.log('Všechny přiřazení lokalit mají dostatečnou přesnost');
      return true;
    }

    console.log(`Nalezeno ${lowAccuracyResults.length} přiřazení lokalit s nízkou přesností`);

    // Vytvoření dotazu pro AI
    const prompt = `Analyzuj následující přiřazení lokalit k úkolům s nízkou přesností a navrhni vylepšení algoritmu.

    Přiřazení s nízkou přesností:
    ${lowAccuracyResults.map(r => `- Úkol: "${r.taskTitle}", Lokalita: "${r.assignedLocation.name}", Přesnost: ${r.accuracy}%, Metoda: ${r.method}`).join('\n')}

    Vrať odpověď ve formátu JSON s těmito vlastnostmi:
    - improvements: pole návrhů na vylepšení algoritmu
    - newKeywords: pole nových klíčových slov, která by měla být přidána do databáze
    - newLocations: pole nových lokalit, které by měly být přidány do databáze (každá s lat, lng, name)

    Zaměř se na konkrétní vylepšení, která by mohla zvýšit přesnost přiřazování lokalit.`;

    // Odeslání dotazu na AI
    const response = await simpleGeminiService.sendMessage(prompt);

    // Zpracování odpovědi
    if (response.type === 'text' && response.content) {
      try {
        // Pokus o extrakci JSON z odpovědi
        const jsonMatch = response.content.match(/\{.*\}/s);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);

          // Výpis návrhů na vylepšení
          if (jsonData.improvements && Array.isArray(jsonData.improvements)) {
            console.log('Návrhy na vylepšení algoritmu:');
            jsonData.improvements.forEach((improvement: string, index: number) => {
              console.log(`${index + 1}. ${improvement}`);
            });
          }

          // Výpis nových klíčových slov
          if (jsonData.newKeywords && Array.isArray(jsonData.newKeywords)) {
            console.log('Nová klíčová slova:');
            jsonData.newKeywords.forEach((keyword: string) => {
              console.log(`- ${keyword}`);
            });
          }

          // Výpis nových lokalit
          if (jsonData.newLocations && Array.isArray(jsonData.newLocations)) {
            console.log('Nové lokality:');
            jsonData.newLocations.forEach((location: any) => {
              console.log(`- ${location.name} (${location.lat}, ${location.lng})`);
            });
          }

          // Uložení návrhů na vylepšení do localStorage
          localStorage.setItem('locationAssignmentImprovements', JSON.stringify({
            improvements: jsonData.improvements || [],
            newKeywords: jsonData.newKeywords || [],
            newLocations: jsonData.newLocations || [],
            timestamp: Date.now()
          }));

          return true;
        }
      } catch (error) {
        console.error('Chyba při parsování odpovědi AI:', error);
      }
    }

    return false;
  } catch (error) {
    console.error('Chyba při vylepšování přiřazování lokalit:', error);
    return false;
  }
};

export default {
  detectLocationsInText,
  addLocationToTask,
  autoAssignLocationsToTasks,
  generateHiddenLocationDescription,
  getHiddenLocationDescription,
  saveLocationAssignmentResult,
  updateLocationAssignmentStats,
  testLocationAssignmentAccuracy,
  getLocationAssignmentStats,
  improveLocationAssignment,
  knownLocations
};
