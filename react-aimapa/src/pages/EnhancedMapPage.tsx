import React, { useState, useEffect } from 'react';
import { ApiKey } from '../components/ApiKeys/EnhancedApiKeyManager';
import EnhancedApiKeyManager from '../components/ApiKeys/EnhancedApiKeyManager';
import EnhancedChatInterface from '../components/Chat/EnhancedChatInterface';
import MapComponent from '../components/MapComponent';
import PlanningPanel from '../components/Planning/PlanningPanel';
import simpleGeminiService from '../services/SimpleGeminiService';
import './EnhancedMapPage.css';

const EnhancedMapPage: React.FC = () => {
  // Stav pro API
  const [apiState, setApiState] = useState<{
    selectedApiKey: ApiKey | null;
    selectedModel: string | null;
    isConnected: boolean;
    lastVerified: Date | null;
  }>({
    selectedApiKey: null,
    selectedModel: null,
    isConnected: false,
    lastVerified: null
  });

  // Stav pro mapu
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.0755, 14.4378]); // Praha
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapProvider, setMapProvider] = useState<string>('google');
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; name?: string }>>([]);
  const [route, setRoute] = useState<{
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  } | null>(null);
  const [planItems, setPlanItems] = useState<Array<{
    id: string;
    type: string;
    title: string;
    location?: { lat: number; lng: number; name?: string };
    route?: {
      start: { lat: number; lng: number; name?: string };
      end: { lat: number; lng: number; name?: string };
      waypoints?: Array<{ lat: number; lng: number; name?: string }>;
    };
  }>>([]);

  // Stav pro UI
  const [showApiManager, setShowApiManager] = useState<boolean>(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [isPlanningVisible, setIsPlanningVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [apiKeyWarning, setApiKeyWarning] = useState<boolean>(true);

  // Stav pro navigaci podle plánu
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [currentNavigationPlan, setCurrentNavigationPlan] = useState<string | undefined>(undefined);
  const [navigationStep, setNavigationStep] = useState<number>(0);

  // Efekt pro detekci mobilního zařízení
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Efekt pro načtení uloženého API klíče
  useEffect(() => {
    // Načtení uloženého API klíče z localStorage
    const savedApiKey = localStorage.getItem('selectedApiKey');
    if (savedApiKey) {
      try {
        const apiKey = JSON.parse(savedApiKey) as ApiKey;
        console.log('Načítám uložený API klíč:', apiKey.name);

        // Nastavení API klíče
        handleApiKeySelect(apiKey);
      } catch (error) {
        console.error('Chyba při načítání uloženého API klíče:', error);
      }
    }
  }, []);

  // Zpracování výběru lokace z chatu
  const handleLocationSelect = (location: { lat: number; lng: number; name?: string }) => {
    setMapCenter([location.lat, location.lng]);
    setMapZoom(15);
    setMarkers([location]);
    setRoute(null);

    // Přepnout na mapu na mobilním zařízení
    if (isMobile) {
      // Zde by bylo přepnutí na mapu v mobilním zobrazení
      console.log('Přepnutí na mapu v mobilním zobrazení');
    }
  };

  // Zpracování výběru trasy z chatu
  const handleRouteSelect = (selectedRoute: {
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  }) => {
    // Nastavit střed mapy mezi počátečním a koncovým bodem
    const centerLat = (selectedRoute.start.lat + selectedRoute.end.lat) / 2;
    const centerLng = (selectedRoute.start.lng + selectedRoute.end.lng) / 2;

    setMapCenter([centerLat, centerLng]);
    setMapZoom(10);
    setMarkers([selectedRoute.start, selectedRoute.end]);
    setRoute(selectedRoute);

    // Přepnout na mapu na mobilním zařízení
    if (isMobile) {
      // Zde by bylo přepnutí na mapu v mobilním zobrazení
      console.log('Přepnutí na mapu v mobilním zobrazení');
    }
  };

  // Zpracování změny poskytovatele mapy
  const handleMapProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMapProvider(e.target.value);
  };

  // Funkce pro výběr API klíče
  const handleApiKeySelect = (apiKey: ApiKey) => {
    console.log('Vybírám API klíč:', apiKey.name, 'isVerified:', apiKey.isVerified);

    setApiState({
      selectedApiKey: apiKey,
      selectedModel: getModelForProvider(apiKey.provider),
      isConnected: apiKey.isVerified,
      lastVerified: new Date()
    });

    console.log('API stav po výběru klíče:', {
      model: getModelForProvider(apiKey.provider),
      isConnected: apiKey.isVerified
    });

    // Uložení API klíče do localStorage pro zachování po reloadu
    localStorage.setItem('selectedApiKey', JSON.stringify(apiKey));
    console.log('API klíč uložen do localStorage');

    setApiKeyWarning(false);
    setShowApiManager(false);
  };

  // Funkce pro ověření API klíče
  const handleApiKeyVerified = (apiKey: ApiKey, isVerified: boolean) => {
    console.log('Ověření API klíče:', apiKey.name, 'isVerified:', isVerified);

    if (apiState.selectedApiKey?.id === apiKey.id) {
      console.log('Aktualizuji stav API pro aktivní klíč');

      setApiState(prev => {
        const newState = {
          ...prev,
          isConnected: isVerified,
          lastVerified: new Date()
        };

        console.log('Nový stav API:', newState);
        return newState;
      });
    } else {
      console.log('Klíč není aktivní, neaktualizuji stav API');
    }
  };

  // Funkce pro odeslání zprávy do chatu
  const handleSendMessage = async (message: string): Promise<string> => {
    if (!apiState.selectedApiKey || !apiState.isConnected) {
      throw new Error('API není připojeno');
    }

    console.log(`Odesílání zprávy pomocí ${apiState.selectedApiKey.provider} API: ${message}`);

    // Kontrola, zda zpráva obsahuje požadavek na zobrazení seznamu úkolů
    const messageLC = message.toLowerCase();
    if (messageLC.includes('seznam úkolů') ||
        messageLC.includes('ukaž úkoly') ||
        messageLC.includes('zobraz úkoly') ||
        messageLC.includes('jaké jsou úkoly') ||
        messageLC.includes('id úkolů') ||
        messageLC.includes('id úkolu')) {
      console.log('Detekován požadavek na zobrazení seznamu úkolů');
      return handleShowTaskList();
    }

    // Kontrola, zda zpráva obsahuje požadavek na přidání lokace k úkolu
    // Různé varianty regulárních výrazů pro zachycení různých způsobů zadání
    const addLocationRegex1 = /přidej\s+(?:lokaci|místo|lokalitu)?\s*([a-zá-žA-ZÁ-Ž\s]+)\s+(?:k|do)\s+(?:úkolu|úkol|tasku)\s+(?:s\s+id:?\s*)?([a-zA-Z0-9\-_]+)/i;
    const addLocationRegex2 = /přidej\s+(?:k|do)\s+(?:úkolu|úkol|tasku)\s+(?:s\s+id:?\s*)?([a-zA-Z0-9\-_]+)\s+(?:lokaci|místo|lokalitu)?\s*([a-zá-žA-ZÁ-Ž\s]+)/i;
    const addLocationRegex3 = /(?:úkol|úkolu|task|tasku)\s+(?:s\s+id:?\s*)?([a-zA-Z0-9\-_]+)\s+(?:přidej|přidat)\s+(?:lokaci|místo|lokalitu)?\s*([a-zá-žA-ZÁ-Ž\s]+)/i;

    let locationMatch = messageLC.match(addLocationRegex1);
    let locationName: string | undefined;
    let taskId: string | undefined;

    if (locationMatch) {
      locationName = locationMatch[1].trim();
      taskId = locationMatch[2].trim();
    } else {
      locationMatch = messageLC.match(addLocationRegex2);
      if (locationMatch) {
        taskId = locationMatch[1].trim();
        locationName = locationMatch[2].trim();
      } else {
        locationMatch = messageLC.match(addLocationRegex3);
        if (locationMatch) {
          taskId = locationMatch[1].trim();
          locationName = locationMatch[2].trim();
        }
      }
    }

    // Jednoduchá detekce pro "dej tam jakoukoliv lokalitu"
    if (!locationMatch && messageLC.includes('dej tam jakoukoliv lokalitu')) {
      // Extrahujeme ID úkolu
      const idMatch = messageLC.match(/(?:úkol|úkolu|task|tasku)\s+(?:s\s+id:?\s*)?([a-zA-Z0-9\-_]+)/i);
      if (idMatch) {
        taskId = idMatch[1].trim();
        locationName = 'praha'; // Výchozí lokace
        // Vytvoříme umělý match pro další zpracování
        const dummyMatch = messageLC.match(/dej tam jakoukoliv lokalitu/);
        locationMatch = dummyMatch;
      }
    }

    if (locationMatch && locationName && taskId) {
      console.log('Detekován požadavek na přidání lokace k úkolu:', locationName, 'k úkolu ID:', taskId);

      // Najdeme plán, který obsahuje úkol s daným ID
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const plans = JSON.parse(savedPlans);
          let foundPlanId = null;

          // Hledání úkolu podle ID
          for (const plan of plans) {
            if (!plan.items || !Array.isArray(plan.items)) continue;

            const taskExists = plan.items.some((item: { id: string }) => item.id === taskId);
            if (taskExists) {
              foundPlanId = plan.id;
              break;
            }
          }

          if (foundPlanId) {
            // Máme ID plánu a úkolu, můžeme přidat lokaci
            if (locationName.toLowerCase().includes('praha')) {
              const praha = {
                lat: 50.0755,
                lng: 14.4378,
                name: "Praha"
              };
              // Definujeme funkci pro přidání lokace k úkolu
              const addLocationToTaskFn = (taskId: string, planId: string, location: { lat: number; lng: number; name?: string }) => {
                // Načtení aktuálních plánů
                const savedPlans = localStorage.getItem('plans');
                if (!savedPlans) {
                  console.error('Žádné plány nebyly nalezeny');
                  return false;
                }

                try {
                  let plans = JSON.parse(savedPlans);

                  // Najdeme plán a úkol
                  const planIndex = plans.findIndex((p: any) => p.id === planId);
                  if (planIndex === -1) {
                    console.error('Plán nebyl nalezen:', planId);
                    return false;
                  }

                  const plan = plans[planIndex];
                  const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);
                  if (taskIndex === -1) {
                    console.error('Úkol nebyl nalezen:', taskId);
                    return false;
                  }

                  // Aktualizace úkolu s novou lokací
                  plan.items[taskIndex] = {
                    ...plan.items[taskIndex],
                    type: 'location',
                    location: location
                  };

                  // Nastavení aktivního indexu na tento úkol
                  plan.activeItemIndex = taskIndex;
                  plan.updatedAt = new Date();
                  plans[planIndex] = plan;

                  // Uložení aktualizovaných plánů
                  localStorage.setItem('plans', JSON.stringify(plans));

                  // Automaticky zaměřit mapu na novou lokaci
                  console.log('Zobrazuji lokaci na mapě po přímém přidání:', location);

                  // Použití setTimeout pro zajištění, že se změny projeví
                  setTimeout(() => {
                    // Vytvoření markeru
                    const newMarker = {
                      lat: location.lat,
                      lng: location.lng,
                      name: location.name || 'Místo'
                    };

                    // Nastavení mapy
                    setMapCenter([location.lat, location.lng]);
                    setMapZoom(15);
                    setMarkers([newMarker]);

                    // Zobrazení panelu plánování, pokud není viditelný
                    if (!isPlanningVisible) {
                      setIsPlanningVisible(true);
                    }

                    // Nastavení aktivního plánu v UI
                    const updatedPlan = plans.find((p: any) => p.id === planId);
                    if (updatedPlan) {
                      console.log('Nastavuji aktivní plán po přidání lokace:', updatedPlan.title);
                      // Dispatch event pro aktualizaci UI - toto pomůže synchronizovat stav mezi komponentami
                      const planUpdatedEvent = new CustomEvent('planUpdated', {
                        detail: {
                          planId: planId,
                          taskId: taskId,
                          taskIndex: taskIndex
                        }
                      });
                      window.dispatchEvent(planUpdatedEvent);
                    }
                  }, 100);

                  return true;
                } catch (error) {
                  console.error('Chyba při přidávání lokace k úkolu:', error);
                  return false;
                }
              };

              const success = addLocationToTaskFn(taskId, foundPlanId, praha);
              if (success) {
                return `Přidal jsem Prahu k úkolu s ID: ${taskId}`;
              }
            } else if (locationName.toLowerCase().includes('hodonín') || locationName.toLowerCase().includes('hodonin')) {
              const hodonin = {
                lat: 48.8492,
                lng: 17.1247,
                name: "Hodonín"
              };
              // Použijeme funkci pro přidání lokace k úkolu
              const addLocationToTaskFn = (taskId: string, planId: string, location: { lat: number; lng: number; name?: string }) => {
                // Načtení aktuálních plánů
                const savedPlans = localStorage.getItem('plans');
                if (!savedPlans) {
                  console.error('Žádné plány nebyly nalezeny');
                  return false;
                }

                try {
                  let plans = JSON.parse(savedPlans);

                  // Najdeme plán a úkol
                  const planIndex = plans.findIndex((p: any) => p.id === planId);
                  if (planIndex === -1) {
                    console.error('Plán nebyl nalezen:', planId);
                    return false;
                  }

                  const plan = plans[planIndex];
                  const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);
                  if (taskIndex === -1) {
                    console.error('Úkol nebyl nalezen:', taskId);
                    return false;
                  }

                  // Aktualizace úkolu s novou lokací
                  plan.items[taskIndex] = {
                    ...plan.items[taskIndex],
                    type: 'location',
                    location: location
                  };

                  // Nastavení aktivního indexu na tento úkol
                  plan.activeItemIndex = taskIndex;
                  plan.updatedAt = new Date();
                  plans[planIndex] = plan;

                  // Uložení aktualizovaných plánů
                  localStorage.setItem('plans', JSON.stringify(plans));

                  // Automaticky zaměřit mapu na novou lokaci
                  console.log('Zobrazuji lokaci na mapě po přímém přidání:', location);

                  // Použití setTimeout pro zajištění, že se změny projeví
                  setTimeout(() => {
                    // Vytvoření markeru
                    const newMarker = {
                      lat: location.lat,
                      lng: location.lng,
                      name: location.name || 'Místo'
                    };

                    // Nastavení mapy
                    setMapCenter([location.lat, location.lng]);
                    setMapZoom(15);
                    setMarkers([newMarker]);

                    // Zobrazení panelu plánování, pokud není viditelný
                    if (!isPlanningVisible) {
                      setIsPlanningVisible(true);
                    }

                    // Nastavení aktivního plánu v UI
                    const updatedPlan = plans.find((p: any) => p.id === planId);
                    if (updatedPlan) {
                      console.log('Nastavuji aktivní plán po přidání lokace:', updatedPlan.title);
                      // Dispatch event pro aktualizaci UI - toto pomůže synchronizovat stav mezi komponentami
                      const planUpdatedEvent = new CustomEvent('planUpdated', {
                        detail: {
                          planId: planId,
                          taskId: taskId,
                          taskIndex: taskIndex
                        }
                      });
                      window.dispatchEvent(planUpdatedEvent);
                    }
                  }, 100);

                  return true;
                } catch (error) {
                  console.error('Chyba při přidávání lokace k úkolu:', error);
                  return false;
                }
              };

              const success = addLocationToTaskFn(taskId, foundPlanId, hodonin);
              if (success) {
                return `Přidal jsem Hodonín k úkolu s ID: ${taskId}`;
              }
            } else {
              // Pokud není specifikována Praha ani Hodonín, použijeme Prahu jako výchozí
              const praha = {
                lat: 50.0755,
                lng: 14.4378,
                name: "Praha"
              };
                            // Použijeme funkci pro přidání lokace k úkolu
              const addLocationToTaskFn = (taskId: string, planId: string, location: { lat: number; lng: number; name?: string }) => {
                // Načtení aktuálních plánů
                const savedPlans = localStorage.getItem('plans');
                if (!savedPlans) {
                  console.error('Žádné plány nebyly nalezeny');
                  return false;
                }

                try {
                  let plans = JSON.parse(savedPlans);

                  // Najdeme plán a úkol
                  const planIndex = plans.findIndex((p: any) => p.id === planId);
                  if (planIndex === -1) {
                    console.error('Plán nebyl nalezen:', planId);
                    return false;
                  }

                  const plan = plans[planIndex];
                  const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);
                  if (taskIndex === -1) {
                    console.error('Úkol nebyl nalezen:', taskId);
                    return false;
                  }

                  // Aktualizace úkolu s novou lokací
                  plan.items[taskIndex] = {
                    ...plan.items[taskIndex],
                    type: 'location',
                    location: location
                  };

                  // Nastavení aktivního indexu na tento úkol
                  plan.activeItemIndex = taskIndex;
                  plan.updatedAt = new Date();
                  plans[planIndex] = plan;

                  // Uložení aktualizovaných plánů
                  localStorage.setItem('plans', JSON.stringify(plans));

                  // Automaticky zaměřit mapu na novou lokaci
                  console.log('Zobrazuji lokaci na mapě po přímém přidání:', location);

                  // Použití setTimeout pro zajištění, že se změny projeví
                  setTimeout(() => {
                    // Vytvoření markeru
                    const newMarker = {
                      lat: location.lat,
                      lng: location.lng,
                      name: location.name || 'Místo'
                    };

                    // Nastavení mapy
                    setMapCenter([location.lat, location.lng]);
                    setMapZoom(15);
                    setMarkers([newMarker]);

                    // Zobrazení panelu plánování, pokud není viditelný
                    if (!isPlanningVisible) {
                      setIsPlanningVisible(true);
                    }

                    // Nastavení aktivního plánu v UI
                    const updatedPlan = plans.find((p: any) => p.id === planId);
                    if (updatedPlan) {
                      console.log('Nastavuji aktivní plán po přidání lokace:', updatedPlan.title);
                      // Dispatch event pro aktualizaci UI - toto pomůže synchronizovat stav mezi komponentami
                      const planUpdatedEvent = new CustomEvent('planUpdated', {
                        detail: {
                          planId: planId,
                          taskId: taskId,
                          taskIndex: taskIndex
                        }
                      });
                      window.dispatchEvent(planUpdatedEvent);
                    }
                  }, 100);

                  return true;
                } catch (error) {
                  console.error('Chyba při přidávání lokace k úkolu:', error);
                  return false;
                }
              };

              const success = addLocationToTaskFn(taskId, foundPlanId, praha);
              if (success) {
                return `Přidal jsem Prahu k úkolu s ID: ${taskId}`;
              }
            }
          }
        } catch (error) {
          console.error('Chyba při hledání úkolu podle ID:', error);
        }
      }
    }

    // Kontrola, zda zpráva obsahuje požadavek na nápovědu o ID úkolů
    if (messageLC.includes('jak přidat') &&
        (messageLC.includes('lokaci') || messageLC.includes('místo') || messageLC.includes('trasu')) &&
        messageLC.includes('úkol')) {
      console.log('Detekován požadavek na nápovědu o přidávání lokací k úkolům');
      return `# Jak přidat lokaci nebo trasu k úkolu

Pro přidání lokace nebo trasy k úkolu máte několik možností:

## 1. Použití ID úkolu
- Napište "seznam úkolů" pro zobrazení všech úkolů a jejich ID
- Pak použijte ID úkolu ve vašem dotazu, např. "přidej Hodonín k úkolu s ID: 1-1"

## 2. Použití názvu úkolu
- Můžete použít název úkolu, např. "přidej Hodonín k úkolu Dokončení vývoje AI Mapy"
- Systém se pokusí najít úkol podle názvu

## 3. Přes panel plánování
- Klikněte na úkol v panelu plánování
- Pak použijte tlačítko "Přidat místo" nebo "Přidat trasu"

## Příklady dotazů
- "přidej Hodonín k úkolu s ID: 1-1"
- "přidej lokaci Praha k úkolu Dokončení vývoje"
- "najdi trasu z Prahy do Brna pro úkol s ID: 1-2"`;
    }

    try {
      // Nastavení API klíče pro Gemini službu, pokud je to Google API klíč
      if (apiState.selectedApiKey.provider === 'google') {
        console.log('Používám Google API klíč:', apiState.selectedApiKey.name);
        console.log('API klíč je ověřený:', apiState.selectedApiKey.isVerified);
        console.log('API klíč je aktivní:', apiState.isConnected);
        simpleGeminiService.setApiKey(apiState.selectedApiKey.key);
      } else {
        throw new Error('Pro tuto funkci je potřeba Google API klíč (Gemini)');
      }

      // Získání kontextu mapy
      const mapContext = {
        center: mapCenter,
        zoom: mapZoom
      };

      // Kontrola, zda zpráva obsahuje požadavek na vytvoření plánu
      const isPlanRequest = message.toLowerCase().includes('plán') ||
                           message.toLowerCase().includes('naplánuj') ||
                           message.toLowerCase().includes('itinerář') ||
                           message.toLowerCase().includes('harmonogram') ||
                           message.toLowerCase().includes('výlet');

      // Odeslání zprávy do Gemini API
      const response = await simpleGeminiService.sendMessage(message, mapContext);
      console.log('Odpověď z Gemini API:', response);

      // Zpracování odpovědi podle typu
      if (response.type === 'location' && response.location) {
        // Přidání markeru na mapu
        const newMarker = {
          lat: response.location.lat,
          lng: response.location.lng,
          name: response.location.name || 'Místo'
        };

        console.log('Nastavuji marker na mapě:', newMarker);

        // Použití setTimeout pro zajištění, že se změny projeví
        setTimeout(() => {
          if (response.location) {
            setMapCenter([response.location.lat, response.location.lng]);
            setMapZoom(13);
            setMarkers([newMarker]);
          }
        }, 100);

        return response.content || `Našel jsem místo ${response.location?.name || ''} na mapě.`;
      }
      else if (response.type === 'route' && response.route) {
        // Nastavení trasy na mapě
        const route = {
          start: response.route.start,
          end: response.route.end,
          waypoints: response.route.waypoints
        };

        // Nastavit střed mapy mezi počátečním a koncovým bodem
        const centerLat = (route.start.lat + route.end.lat) / 2;
        const centerLng = (route.start.lng + route.end.lng) / 2;

        console.log('Nastavuji trasu na mapě:', route);

        // Použití setTimeout pro zajištění, že se změny projeví
        setTimeout(() => {
          setMapCenter([centerLat, centerLng]);
          setMapZoom(10);
          setMarkers([route.start, route.end]);
          setRoute(route);
        }, 100);

        return response.content || `Našel jsem trasu z ${route.start.name || 'počátečního bodu'} do ${route.end.name || 'cílového bodu'}.`;
      }
      else if (response.type === 'plan' && response.plan) {
        // Vytvoření nového plánu z odpovědi AI
        const newPlan = {
          id: Date.now().toString(),
          title: response.plan.title,
          description: response.plan.description || '',
          items: response.plan.items.map((item, index) => ({
            id: `${Date.now()}-${index}`,
            title: item.title,
            description: item.description || '',
            location: item.location,
            time: item.time || '',
            completed: false,
            type: item.type,
            route: item.route
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Uložení plánu do localStorage
        const savedPlans = localStorage.getItem('plans');
        let plans = [];

        if (savedPlans) {
          try {
            plans = JSON.parse(savedPlans);
          } catch (error) {
            console.error('Chyba při načítání plánů:', error);
          }
        }

        plans.push(newPlan);
        localStorage.setItem('plans', JSON.stringify(plans));

        // Zobrazení panelu plánování, pokud není viditelný
        if (!isPlanningVisible) {
          setIsPlanningVisible(true);
        }

        return response.content || `Vytvořil jsem plán "${newPlan.title}" s ${newPlan.items.length} položkami.`;
      }
      // Pokud uživatel požádal o plán, ale odpověď není typu 'plan', zkusíme vytvořit plán explicitně
      else if (isPlanRequest && response.type !== 'plan') {
        console.log('Uživatel požádal o plán, ale odpověď není typu plan. Zkusím vytvořit plán explicitně.');

        // Zkusíme vytvořit plán explicitně
        const planResponse = await handleCreatePlanFromChat(message);
        return planResponse || response.content || `Zpracoval jsem váš dotaz: "${message}".`;
      }
      // Rozpoznání úkolu v textu
      else if (response.type === 'task' && response.taskTitle) {
        console.log('Rozpoznán úkol v textu:', response.taskTitle);

        // Načtení aktuálních plánů
        const savedPlans = localStorage.getItem('plans');
        let plans = [];

        if (savedPlans) {
          try {
            plans = JSON.parse(savedPlans);
          } catch (error) {
            console.error('Chyba při načítání plánů:', error);
          }
        }

        // Pokud neexistuje žádný plán, vytvoříme nový
        if (plans.length === 0) {
          const newPlan = {
            id: Date.now().toString(),
            title: 'Automaticky vytvořený plán',
            description: 'Plán vytvořený z chatu',
            items: [],
            createdAt: new Date(),
            updatedAt: new Date()
          };

          plans.push(newPlan);
        }

        // Seřadíme plány podle data vytvoření (nejnovější první)
        const sortedPlans = [...plans].sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Přidáme úkol do nejnovějšího plánu
        const targetPlan = sortedPlans[0];
        const newItem = {
          id: `${targetPlan.id}-${targetPlan.items.length + 1}`,
          title: response.taskTitle,
          description: response.taskDescription || '',
          time: '',
          completed: false,
          type: 'task'
        };

        targetPlan.items.push(newItem);
        targetPlan.updatedAt = new Date();

        // Aktualizujeme plán v seznamu
        const planIndex = plans.findIndex((p: any) => p.id === targetPlan.id);
        if (planIndex !== -1) {
          plans[planIndex] = targetPlan;
        }

        // Uložíme aktualizované plány
        localStorage.setItem('plans', JSON.stringify(plans));

        // Zobrazíme panel plánování, pokud není viditelný
        if (!isPlanningVisible) {
          setIsPlanningVisible(true);
        }

        return response.content || `Přidal jsem úkol "${response.taskTitle}" do plánu.`;
      }
      // Identifikace existujícího úkolu
      else if (response.type === 'taskIdentification' && response.taskId) {
        console.log('Identifikován existující úkol:', response.taskId);

        // Načtení aktuálních plánů
        const savedPlans = localStorage.getItem('plans');
        if (!savedPlans) {
          return response.content || `Nepodařilo se najít úkol.`;
        }

        try {
          const plans = JSON.parse(savedPlans);

          // Hledání úkolu ve všech plánech
          let foundPlan = null;
          let foundTask = null;

          for (const plan of plans) {
            const task = plan.items.find((item: any) => item.id === response.taskId);
            if (task) {
              foundPlan = plan;
              foundTask = task;
              break;
            }
          }

          if (foundPlan && foundTask) {
            // Zobrazíme panel plánování, pokud není viditelný
            if (!isPlanningVisible) {
              setIsPlanningVisible(true);
            }

            // Pokud má úkol lokaci, zobrazíme ji na mapě
            if (foundTask.type === 'location' && foundTask.location) {
              handleLocationSelect(foundTask.location);
            }
            // Pokud má úkol trasu, zobrazíme ji na mapě
            else if (foundTask.type === 'route' && foundTask.route) {
              handleRouteSelect(foundTask.route);
            }

            return response.content || `Našel jsem úkol "${foundTask.title}" v plánu "${foundPlan.title}".`;
          } else {
            return response.content || `Nepodařilo se najít úkol.`;
          }
        } catch (error) {
          console.error('Chyba při hledání úkolu:', error);
          return `Chyba při hledání úkolu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
        }
      }
      else {
        // Textová odpověď bez mapových dat
        console.log('Textová odpověď bez mapových dat:', response.content);
        return response.content || `Zpracoval jsem váš dotaz: "${message}".`;
      }
    } catch (error) {
      console.error('Chyba při komunikaci s API:', error);
      return `Omlouvám se, ale došlo k chybě při zpracování vašeho dotazu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
    }
  };

  // Funkce pro vymazání chatu
  const handleClearChat = () => {
    // Zde by bylo vymazání historie chatu
    console.log('Vymazání historie chatu');
  };

  // Funkce pro zobrazení seznamu všech úkolů v chatu
  const handleShowTaskList = async (): Promise<string> => {
    console.log('Zobrazení seznamu všech úkolů');

    // Načtení plánů z localStorage
    const savedPlans = localStorage.getItem('plans');
    if (!savedPlans) {
      return 'Žádné plány nebyly nalezeny.';
    }

    try {
      const plans = JSON.parse(savedPlans);

      if (plans.length === 0) {
        return 'Žádné plány nebyly nalezeny.';
      }

      // Vytvoření seznamu úkolů
      let taskList = '### Seznam všech úkolů\n\n';
      taskList += '> Pro přidání lokace k úkolu použijte příkaz: "přidej Hodonín k úkolu s ID: X-Y"\n\n';

      for (const plan of plans) {
        if (!plan.items || !Array.isArray(plan.items) || plan.items.length === 0) continue;

        taskList += `#### Plán: ${plan.title} (ID: \`${plan.id}\`)\n\n`;

        for (const item of plan.items) {
          const itemType = item.type === 'location' ? '📍' :
                          item.type === 'route' ? '🚗' :
                          item.type === 'note' ? '📝' : '✅';

          const itemStatus = item.completed ? '✓' : '○';

          taskList += `${itemStatus} ${itemType} **${item.title}** (ID: \`${item.id}\`)\n`;

          // Přidání popisu, pokud existuje
          if (item.description) {
            taskList += `   📄 Popis: ${item.description}\n`;
          }

          if (item.location) {
            taskList += `   📍 Lokace: ${item.location.name || `${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}`}\n`;
          }

          if (item.route) {
            taskList += `   🚗 Trasa: ${item.route.start.name || 'Počáteční bod'} → ${item.route.end.name || 'Cílový bod'}\n`;
          }

          // Přidání času, pokud existuje
          if (item.time) {
            taskList += `   🕒 Čas: ${item.time}\n`;
          }
        }

        taskList += '\n';
      }

      // Přidání příkladů použití
      taskList += '### Jak přidat lokaci k úkolu\n\n';
      taskList += '1. **Pomocí ID úkolu** (nejspolehlivější způsob):\n';
      taskList += '   - `přidej Hodonín k úkolu s ID: 1-1`\n';
      taskList += '   - `přidej Prahu k úkolu s ID: 1-2`\n\n';
      taskList += '2. **Pomocí názvu úkolu**:\n';
      taskList += '   - `přidej Hodonín k úkolu Dokončení vývoje AI Mapy`\n\n';
      taskList += '3. **Přímo v panelu plánování**:\n';
      taskList += '   - Klikněte na úkol a použijte tlačítko "Přidat místo"\n';

      return taskList;
    } catch (error) {
      console.error('Chyba při načítání plánů:', error);
      return `Chyba při načítání seznamu úkolů: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
    }
  };

  // Funkce pro aktualizaci položek plánu na mapě
  const updatePlanItemsOnMap = (plan: any) => {
    if (!plan || !plan.items || plan.items.length === 0) {
      setPlanItems([]);
      return;
    }

    // Filtrujeme pouze položky s lokací nebo trasou
    const itemsWithLocation = plan.items.filter((item: any) =>
      (item.type === 'location' && item.location) ||
      (item.type === 'route' && item.route)
    );

    console.log('Aktualizuji položky plánu na mapě:', itemsWithLocation.length);
    setPlanItems(itemsWithLocation);
  };

  // Funkce pro spuštění navigace podle plánu
  const handleStartPlanNavigation = (plan: any) => {
    console.log('Spouštím navigaci podle plánu:', plan.title);

    // Aktualizace položek plánu na mapě
    updatePlanItemsOnMap(plan);

    if (plan.activeItemIndex !== undefined && plan.items.length > 0) {
      // Nastavení stavu navigace
      setIsNavigating(true);
      setCurrentNavigationPlan(plan.id);
      setNavigationStep(plan.activeItemIndex);

      // Zobrazení prvního bodu na mapě
      const firstItem = plan.items[plan.activeItemIndex];
      if (firstItem.type === 'location' && firstItem.location) {
        handleLocationSelect(firstItem.location);
      } else if (firstItem.type === 'route' && firstItem.route) {
        handleRouteSelect(firstItem.route);
      }

      // Otevření panelu plánování, pokud není otevřený
      if (!isPlanningVisible) {
        setIsPlanningVisible(true);
      }
    } else {
      // Ukončení navigace
      setIsNavigating(false);
      setCurrentNavigationPlan(undefined);
      setNavigationStep(0);
      setPlanItems([]);
    }
  };

  // Funkce pro navigaci na další krok
  const handleNavigateToNextStep = (plan: any, currentIndex: number) => {
    console.log('Navigace na další krok:', currentIndex + 1);
    setNavigationStep(currentIndex);

    // Zobrazení animace přechodu na mapě
    if (plan.items[currentIndex]) {
      const item = plan.items[currentIndex];
      console.log('Navigace na další krok, zobrazuji položku:', item);

      if (item.type === 'location' && item.location) {
        // Animace přechodu na novou lokaci
        const location = item.location;
        console.log('Zobrazuji lokaci na mapě při navigaci na další krok:', location);

        // Přidání markeru s animací
        const newMarker = {
          lat: location.lat,
          lng: location.lng,
          name: location.name || `Krok ${currentIndex + 1}`
        };

        setMarkers([newMarker]);
        setMapCenter([location.lat, location.lng]);
        setMapZoom(15);
      } else if (item.type === 'route' && item.route) {
        // Animace přechodu na novou trasu
        console.log('Zobrazuji trasu na mapě při navigaci na další krok:', item.route);
        handleRouteSelect(item.route);
      }
    }
  };

  // Funkce pro navigaci na předchozí krok
  const handleNavigateToPrevStep = (plan: any, currentIndex: number) => {
    console.log('Navigace na předchozí krok:', currentIndex + 1);
    setNavigationStep(currentIndex);

    // Zobrazení předchozího bodu na mapě
    if (plan.items[currentIndex]) {
      const item = plan.items[currentIndex];
      console.log('Navigace na předchozí krok, zobrazuji položku:', item);

      if (item.type === 'location' && item.location) {
        console.log('Zobrazuji lokaci na mapě při navigaci na předchozí krok:', item.location);
        handleLocationSelect(item.location);
      } else if (item.type === 'route' && item.route) {
        console.log('Zobrazuji trasu na mapě při navigaci na předchozí krok:', item.route);
        handleRouteSelect(item.route);
      }
    }
  };

  // Funkce pro vytvoření plánu z chatu nebo přidání lokace/trasy k úkolu
  const handleCreatePlanFromChat = async (message: string, taskContext?: any) => {
    if (!apiState.selectedApiKey || !apiState.isConnected) {
      console.error('API není připojeno');
      alert('Pro vytvoření plánu je potřeba připojit API klíč.');
      return;
    }

    // Kontrola, zda se jedná o přidání lokace nebo trasy k úkolu
    let isAddingToTask = taskContext && taskContext.taskId && taskContext.planId;

    // Funkce pro přímé přidání lokace k úkolu (bez nutnosti použití API)
    const addLocationToTask = (taskId: string, planId: string, location: { lat: number; lng: number; name?: string }) => {
      console.log('Přímé přidání lokace k úkolu:', taskId, 'v plánu:', planId);

      // Načtení aktuálních plánů
      const savedPlans = localStorage.getItem('plans');
      if (!savedPlans) {
        console.error('Žádné plány nebyly nalezeny');
        return false;
      }

      try {
        let plans = JSON.parse(savedPlans);

        // Najdeme plán a úkol
        const planIndex = plans.findIndex((p: any) => p.id === planId);
        if (planIndex === -1) {
          console.error('Plán nebyl nalezen:', planId);
          return false;
        }

        const plan = plans[planIndex];
        const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);
        if (taskIndex === -1) {
          console.error('Úkol nebyl nalezen:', taskId);
          return false;
        }

        // Aktualizace úkolu s novou lokací
        plan.items[taskIndex] = {
          ...plan.items[taskIndex],
          type: 'location',
          location: location
        };

        // Nastavení aktivního indexu na tento úkol
        plan.activeItemIndex = taskIndex;
        plan.updatedAt = new Date();
        plans[planIndex] = plan;

        // Uložení aktualizovaných plánů
        localStorage.setItem('plans', JSON.stringify(plans));

        // Aktualizace položek plánu na mapě
        updatePlanItemsOnMap(plan);

        // Automaticky zaměřit mapu na novou lokaci
        console.log('Zobrazuji lokaci na mapě po přímém přidání:', location);

        // Použití setTimeout pro zajištění, že se změny projeví
        setTimeout(() => {
          // Vytvoření markeru
          const newMarker = {
            lat: location.lat,
            lng: location.lng,
            name: location.name || 'Místo'
          };

          // Nastavení mapy
          setMapCenter([location.lat, location.lng]);
          setMapZoom(15);
          setMarkers([newMarker]);

          // Zobrazení panelu plánování, pokud není viditelný
          if (!isPlanningVisible) {
            setIsPlanningVisible(true);
          }

          // Nastavení aktivního plánu v UI
          const updatedPlan = plans.find((p: any) => p.id === planId);
          if (updatedPlan) {
            console.log('Nastavuji aktivní plán po přidání lokace:', updatedPlan.title);
            // Dispatch event pro aktualizaci UI - toto pomůže synchronizovat stav mezi komponentami
            const planUpdatedEvent = new CustomEvent('planUpdated', {
              detail: {
                planId: planId,
                taskId: taskId,
                taskIndex: taskIndex
              }
            });
            window.dispatchEvent(planUpdatedEvent);
          }
        }, 100);

        return true;
      } catch (error) {
        console.error('Chyba při přidávání lokace k úkolu:', error);
        return false;
      }
    };

    // Funkce pro extrakci ID úkolu z textu
    const extractTaskIdFromText = (text: string): string | null => {
      // Hledání ID úkolu ve formátu "ID: X-Y" nebo "ID úkolu: X-Y" nebo "s ID: X-Y"
      const idRegex = /(?:ID:?|ID úkolu:?|s ID:?)\s*([a-zA-Z0-9\-_]+)/i;
      const match = text.match(idRegex);

      if (match && match[1]) {
        return match[1].trim();
      }

      return null;
    };

    // Pokud nemáme kontext úkolu, ale zpráva obsahuje název úkolu, pokusíme se najít úkol podle názvu
    const taskKeywords = [
      "dokončení vývoje jádra ai",
      "dokončení vývoje",
      "vývoj jádra ai",
      "vývoj jádra",
      "jádro ai",
      "dokončení jádra",
      "dokončení vývoje ai mapy"
    ];

    const messageLC = message.toLowerCase();
    const containsTaskKeyword = taskKeywords.some(keyword => messageLC.includes(keyword));

    // Kontrola, zda zpráva obsahuje zmínku o Praze nebo Hodoníně
    const containsPrague = messageLC.includes("praha") || messageLC.includes("prahu") || messageLC.includes("pražský");
    const containsHodonin = messageLC.includes("hodonín") || messageLC.includes("hodonin") || messageLC.includes("hodonína");

    // Extrakce ID úkolu z textu
    const taskIdFromText = extractTaskIdFromText(message);
    console.log('Extrahované ID úkolu z textu:', taskIdFromText);

    // Speciální případ pro "přidej k tomu tu lokaci hodonín do všech těch úkolů v úkolu Dokončení vývoje AI Mapy"
    if (messageLC.includes("přidej k tomu tu lokaci hodonín") &&
        messageLC.includes("dokončení vývoje ai mapy")) {
      console.log('Detekován speciální případ pro přidání Hodonína k úkolu Dokončení vývoje AI Mapy');

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const plans = JSON.parse(savedPlans);

          // Hledání úkolu podle názvu
          let foundPlan = null;
          let foundTask = null;

          for (const plan of plans) {
            if (!plan.items || !Array.isArray(plan.items)) continue;

            for (const item of plan.items) {
              const itemTitleLC = (item.title || '').toLowerCase();

              if (itemTitleLC.includes("dokončení vývoje ai mapy") ||
                  itemTitleLC.includes("dokončení vývoje") ||
                  itemTitleLC.includes("vývoj ai mapy")) {
                foundPlan = plan;
                foundTask = item;
                break;
              }
            }
            if (foundPlan) break;
          }

          // Pokud jsme našli úkol, přidáme k němu Hodonín přímo
          if (foundPlan && foundTask) {
            console.log('Nalezen úkol:', foundTask.title, 'v plánu:', foundPlan.title);

            // Přidání Hodonína k úkolu
            const hodonin = {
              lat: 48.8492,
              lng: 17.1247,
              name: "Hodonín"
            };

                        const success = addLocationToTask(foundTask.id, foundPlan.id, hodonin);

            if (success) {
              // Vrátíme odpověď bez volání API
              return `Přidal jsem Hodonín k úkolu "${foundTask.title}" (ID: ${foundTask.id}).`;
            }
          }
        } catch (error) {
          console.error('Chyba při přímém přidávání Hodonína k úkolu:', error);
        }
      }
    }

    // Pokud máme ID úkolu z textu, pokusíme se najít úkol přímo podle ID
    if (!isAddingToTask && taskIdFromText && (containsPrague || containsHodonin)) {
      console.log('Hledám úkol podle ID:', taskIdFromText);

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const plans = JSON.parse(savedPlans);

          // Hledání úkolu podle ID
          let foundPlan = null;
          let foundTask = null;

          for (const plan of plans) {
            if (!plan.items || !Array.isArray(plan.items)) continue;

            for (const item of plan.items) {
              if (item.id === taskIdFromText) {
                foundPlan = plan;
                foundTask = item;
                break;
              }
            }
            if (foundPlan) break;
          }

          // Pokud jsme našli úkol, přidáme k němu lokaci přímo
          if (foundPlan && foundTask) {
            console.log('Nalezen úkol podle ID:', foundTask.title, 'v plánu:', foundPlan.title);

            // Určení lokace k přidání
            let location;

            if (containsHodonin) {
              // Přidání Hodonína k úkolu
              location = {
                lat: 48.8492,
                lng: 17.1247,
                name: "Hodonín"
              };
              console.log('Přidávám Hodonín k úkolu s ID:', foundTask.id);
            } else {
              // Přidání Prahy k úkolu
              location = {
                lat: 50.0755,
                lng: 14.4378,
                name: "Praha"
              };
              console.log('Přidávám Prahu k úkolu s ID:', foundTask.id);
            }

            const success = addLocationToTask(foundTask.id, foundPlan.id, location);

            if (success) {
              // Vrátíme odpověď bez volání API
              return `Přidal jsem ${location.name} k úkolu "${foundTask.title}" (ID: ${foundTask.id}).`;
            }
          }
        } catch (error) {
          console.error('Chyba při hledání úkolu podle ID:', error);
        }
      }
    }

    // Pokud zpráva obsahuje klíčové slovo úkolu a zmínku o Praze nebo Hodoníně, přidáme lokaci přímo k úkolu
    if (!isAddingToTask && containsTaskKeyword && (containsPrague || containsHodonin)) {
      console.log('Detekována Praha a úkol v textu, pokusím se přímo přidat Prahu k úkolu');

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const plans = JSON.parse(savedPlans);

          // Hledání úkolu podle názvu
          let foundPlan = null;
          let foundTask = null;

          for (const plan of plans) {
            if (!plan.items || !Array.isArray(plan.items)) continue;

            for (const item of plan.items) {
              const itemTitleLC = (item.title || '').toLowerCase();

              // Kontrola, zda název úkolu obsahuje některé z klíčových slov
              if (taskKeywords.some(keyword => itemTitleLC.includes(keyword))) {
                foundPlan = plan;
                foundTask = item;
                break;
              }
            }
            if (foundPlan) break;
          }

          // Pokud jsme našli úkol, přidáme k němu Prahu přímo
          if (foundPlan && foundTask) {
            console.log('Nalezen úkol:', foundTask.title, 'v plánu:', foundPlan.title);

            // Určení lokace k přidání
            let location;

            if (containsHodonin) {
              // Přidání Hodonína k úkolu
              location = {
                lat: 48.8492,
                lng: 17.1247,
                name: "Hodonín"
              };
              console.log('Přidávám Hodonín k úkolu:', foundTask.title);
            } else {
              // Přidání Prahy k úkolu
              location = {
                lat: 50.0755,
                lng: 14.4378,
                name: "Praha"
              };
              console.log('Přidávám Prahu k úkolu:', foundTask.title);
            }

            const success = addLocationToTask(foundTask.id, foundPlan.id, location);

            if (success) {
              // Vrátíme odpověď bez volání API
              return `Přidal jsem ${location.name} k úkolu "${foundTask.title}" (ID: ${foundTask.id}).`;
            }
          }
        } catch (error) {
          console.error('Chyba při přímém přidávání Prahy k úkolu:', error);
        }
      }
    }

    // Standardní vyhledávání úkolu podle názvu
    if (!isAddingToTask && containsTaskKeyword) {
      console.log('Hledám úkol podle klíčových slov v textu:', message);

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const plans = JSON.parse(savedPlans);
          console.log('Načteno plánů:', plans.length);

          // Hledání úkolu podle názvu
          let foundPlan = null;
          let foundTask = null;

          // Nejprve zkusíme najít přesnou shodu
          for (const plan of plans) {
            if (!plan.items || !Array.isArray(plan.items)) continue;

            console.log('Kontroluji plán:', plan.title, 'počet položek:', plan.items.length);

            for (const item of plan.items) {
              const itemTitleLC = (item.title || '').toLowerCase();

              // Kontrola, zda název úkolu obsahuje některé z klíčových slov
              if (taskKeywords.some(keyword => itemTitleLC.includes(keyword))) {
                console.log('Potenciální shoda úkolu:', item.title);
                foundPlan = plan;
                foundTask = item;
                break;
              }
            }
            if (foundPlan) break;
          }

          // Pokud jsme našli úkol, vytvoříme kontext
          if (foundPlan && foundTask) {
            console.log('Nalezen úkol:', foundTask.title, 'v plánu:', foundPlan.title);
            taskContext = {
              taskId: foundTask.id,
              planId: foundPlan.id,
              currentPlan: foundPlan
            };
            isAddingToTask = true;

            // Zobrazíme panel plánování, pokud není viditelný
            if (!isPlanningVisible) {
              setIsPlanningVisible(true);
            }
          } else {
            console.log('Nebyl nalezen žádný odpovídající úkol');
          }
        } catch (error) {
          console.error('Chyba při hledání úkolu podle názvu:', error);
        }
      } else {
        console.log('Žádné plány nebyly nalezeny v localStorage');
      }
    }

    try {
      console.log('Vytváření plánu z chatu:', message);

      // Nastavení API klíče pro Gemini službu
      if (apiState.selectedApiKey.provider === 'google') {
        console.log('Používám Google API klíč pro vytvoření plánu');
        simpleGeminiService.setApiKey(apiState.selectedApiKey.key);
      } else {
        throw new Error('Pro tuto funkci je potřeba Google API klíč (Gemini)');
      }

      // Odeslání požadavku na vytvoření plánu nebo přidání lokace/trasy k úkolu
      console.log('Odesílám požadavek s kontextem úkolu:', taskContext);

      const response = await simpleGeminiService.sendMessage(
        message,
        { center: mapCenter, zoom: mapZoom },
        taskContext
      );

      console.log('Odpověď z AI pro plán:', response);
      console.log('Typ odpovědi:', response.type);
      console.log('Je přidávání k úkolu?', isAddingToTask);

      // Zpracování odpovědi podle typu
      if (response.type === 'plan' && response.plan) {
        // Vytvoření nového plánu z odpovědi AI
        const newPlan = {
          id: Date.now().toString(),
          title: response.plan.title,
          description: response.plan.description || '',
          items: response.plan.items.map((item, index) => ({
            id: `${Date.now()}-${index}`,
            title: item.title,
            description: item.description || '',
            location: item.location,
            time: item.time || '',
            completed: false,
            type: item.type,
            route: item.route
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Uložení plánu do localStorage
        const savedPlans = localStorage.getItem('plans');
        let plans = [];

        if (savedPlans) {
          try {
            plans = JSON.parse(savedPlans);
          } catch (error) {
            console.error('Chyba při načítání plánů:', error);
          }
        }

        plans.push(newPlan);
        localStorage.setItem('plans', JSON.stringify(plans));

        // Zobrazení potvrzení
        alert(`Plán "${newPlan.title}" byl úspěšně vytvořen s ${newPlan.items.length} položkami.`);

        // Zobrazení panelu plánování, pokud není viditelný
        if (!isPlanningVisible) {
          setIsPlanningVisible(true);
        }

        return response.content || `Vytvořil jsem plán "${newPlan.title}" s ${newPlan.items.length} položkami.`;
      }
      // Zpracování přidání lokace k úkolu
      else if (response.type === 'taskLocation' && response.location) {
        console.log('Přidávám lokaci k úkolu. Response taskId:', response.taskId, 'isAddingToTask:', isAddingToTask);

        // Kontrola, zda máme platný kontext úkolu nebo ID úkolu v odpovědi
        if ((!isAddingToTask || !taskContext) && !response.taskId) {
          console.error('Chybí kontext úkolu nebo ID úkolu v odpovědi pro přidání lokace');

          // Pokusíme se najít úkol podle názvu v odpovědi
          const taskTitle = response.content?.match(/úkolu "([^"]+)"/)?.[1];
          if (taskTitle) {
            console.log('Pokus o nalezení úkolu podle názvu z odpovědi:', taskTitle);

            // Načtení plánů z localStorage
            const savedPlans = localStorage.getItem('plans');
            if (savedPlans) {
              try {
                const plans = JSON.parse(savedPlans);

                // Hledání úkolu podle názvu
                let foundPlan = null;
                let foundTask = null;

                for (const plan of plans) {
                  if (!plan.items || !Array.isArray(plan.items)) continue;

                  for (const item of plan.items) {
                    if (item.title.toLowerCase().includes(taskTitle.toLowerCase())) {
                      foundPlan = plan;
                      foundTask = item;
                      break;
                    }
                  }
                  if (foundPlan) break;
                }

                // Pokud jsme našli úkol, vytvoříme kontext
                if (foundPlan && foundTask) {
                  console.log('Nalezen úkol podle názvu z odpovědi:', foundTask.title);
                  taskContext = {
                    taskId: foundTask.id,
                    planId: foundPlan.id,
                    currentPlan: foundPlan
                  };
                  isAddingToTask = true;
                }
              } catch (error) {
                console.error('Chyba při hledání úkolu podle názvu z odpovědi:', error);
              }
            }
          }

          // Pokud stále nemáme kontext úkolu, vrátíme chybu s nápovědou
          if (!isAddingToTask || !taskContext) {
            return response.content || `Nelze jednoznačně určit, ke kterému úkolu chcete přidat lokaci.

Pro přidání lokace k úkolu máte tyto možnosti:

1. **Použijte přesné ID úkolu** (nejspolehlivější způsob):
   - Napište "seznam úkolů" pro zobrazení všech úkolů a jejich ID
   - Pak použijte příkaz: "přidej Hodonín k úkolu s ID: X-Y" (kde X-Y je ID úkolu)

2. **Použijte přesný název úkolu**:
   - Např. "přidej Hodonín k úkolu Dokončení vývoje AI Mapy"
   - Ujistěte se, že název úkolu je přesný

3. **Použijte panel plánování**:
   - Klikněte na úkol v panelu plánování
   - Pak použijte tlačítko "Přidat místo"

Zkuste to znovu s přesným ID úkolu nebo přesným názvem úkolu.`;
          }
        }

        // Získání plánu a úkolu
        let planId: string | undefined, taskId: string | undefined;

        if (response.taskId) {
          // Pokud máme ID úkolu v odpovědi, pokusíme se najít plán
          console.log('Použití ID úkolu z odpovědi:', response.taskId);

          // Načtení plánů z localStorage
          const savedPlans = localStorage.getItem('plans');
          if (savedPlans) {
            try {
              const plans = JSON.parse(savedPlans);

              // Hledání úkolu podle ID
              let foundPlan = null;

              for (const plan of plans) {
                if (!plan.items || !Array.isArray(plan.items)) continue;

                const taskExists = plan.items.some((item: { id: string }) => item.id === response.taskId);
                if (taskExists) {
                  foundPlan = plan;
                  break;
                }
              }

              if (foundPlan) {
                planId = foundPlan.id;
                taskId = response.taskId;
              } else if (taskContext) {
                planId = taskContext.planId;
                taskId = taskContext.taskId;
              } else {
                return response.content || `Nepodařilo se najít úkol s ID: ${response.taskId}.

Zkontrolujte, zda jste zadali správné ID úkolu. Můžete použít příkaz "seznam úkolů" pro zobrazení všech dostupných úkolů a jejich ID.`;
              }
            } catch (error) {
              console.error('Chyba při hledání úkolu podle ID z odpovědi:', error);
              if (taskContext) {
                planId = taskContext.planId;
                taskId = taskContext.taskId;
              } else {
                return `Chyba při hledání úkolu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
              }
            }
          } else if (taskContext) {
            planId = taskContext.planId;
            taskId = taskContext.taskId;
          } else {
            return response.content || `Nepodařilo se najít žádné plány. Nejprve vytvořte plán a úkoly pomocí panelu plánování nebo příkazem "vytvoř plán".`;
          }
        } else if (taskContext) {
          // Použijeme kontext úkolu
          planId = taskContext.planId;
          taskId = taskContext.taskId;
        } else {
          return response.content || `Nepodařilo se určit ID úkolu a plánu. Použijte příkaz "seznam úkolů" pro zobrazení všech dostupných úkolů a jejich ID, a pak zadejte příkaz ve formátu "přidej Hodonín k úkolu s ID: X-Y".`;
        }

        console.log('Použitý planId:', planId, 'taskId:', taskId);

        // Načtení aktuálních plánů
        const savedPlans = localStorage.getItem('plans');
        if (!savedPlans) return response.content;

        try {
          let plans = JSON.parse(savedPlans);

          // Najdeme plán a úkol
          const planIndex = plans.findIndex((p: any) => p.id === planId);
          if (planIndex === -1) return response.content;

          const plan = plans[planIndex];
          const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);
          if (taskIndex === -1) return response.content;

          // Aktualizace úkolu s novou lokací
          plan.items[taskIndex] = {
            ...plan.items[taskIndex],
            type: 'location',
            location: response.location
          };

          // Nastavení aktivního indexu na tento úkol
          plan.activeItemIndex = taskIndex;
          plan.updatedAt = new Date();
          plans[planIndex] = plan;

          // Uložení aktualizovaných plánů
          localStorage.setItem('plans', JSON.stringify(plans));

          // Aktualizace položek plánu na mapě
          updatePlanItemsOnMap(plan);

          // Automaticky zaměřit mapu na novou lokaci
          console.log('Zobrazuji lokaci na mapě po přidání přes API:', response.location);
          setMapCenter([response.location.lat, response.location.lng]);
          setMapZoom(15);
          setMarkers([response.location]);

          // Zobrazení panelu plánování, pokud není viditelný
          if (!isPlanningVisible) {
            setIsPlanningVisible(true);
          }

          return response.content || `Přidal jsem lokaci "${response.location.name}" k úkolu "${plan.items[taskIndex].title}".`;
        } catch (error) {
          console.error('Chyba při aktualizaci úkolu s lokací:', error);
          return `Chyba při přidávání lokace: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
        }
      }
      // Zpracování přidání trasy k úkolu
      else if (response.type === 'taskRoute' && response.route) {
        console.log('Přidávám trasu k úkolu. Response taskId:', response.taskId, 'isAddingToTask:', isAddingToTask);

        // Kontrola, zda máme platný kontext úkolu nebo ID úkolu v odpovědi
        if ((!isAddingToTask || !taskContext) && !response.taskId) {
          console.error('Chybí kontext úkolu nebo ID úkolu v odpovědi pro přidání trasy');

          // Pokusíme se najít úkol podle názvu v odpovědi
          const taskTitle = response.content?.match(/úkolu "([^"]+)"/)?.[1];
          if (taskTitle) {
            console.log('Pokus o nalezení úkolu podle názvu z odpovědi:', taskTitle);

            // Načtení plánů z localStorage
            const savedPlans = localStorage.getItem('plans');
            if (savedPlans) {
              try {
                const plans = JSON.parse(savedPlans);

                // Hledání úkolu podle názvu
                let foundPlan = null;
                let foundTask = null;

                for (const plan of plans) {
                  if (!plan.items || !Array.isArray(plan.items)) continue;

                  for (const item of plan.items) {
                    if (item.title.toLowerCase().includes(taskTitle.toLowerCase())) {
                      foundPlan = plan;
                      foundTask = item;
                      break;
                    }
                  }
                  if (foundPlan) break;
                }

                // Pokud jsme našli úkol, vytvoříme kontext
                if (foundPlan && foundTask) {
                  console.log('Nalezen úkol podle názvu z odpovědi:', foundTask.title);
                  taskContext = {
                    taskId: foundTask.id,
                    planId: foundPlan.id,
                    currentPlan: foundPlan
                  };
                  isAddingToTask = true;
                }
              } catch (error) {
                console.error('Chyba při hledání úkolu podle názvu z odpovědi:', error);
              }
            }
          }

          // Pokud stále nemáme kontext úkolu, vrátíme chybu s nápovědou
          if (!isAddingToTask || !taskContext) {
            return response.content || `Nelze jednoznačně určit, ke kterému úkolu chcete přidat trasu.

Pro přidání trasy k úkolu máte tyto možnosti:

1. **Použijte přesné ID úkolu** (nejspolehlivější způsob):
   - Napište "seznam úkolů" pro zobrazení všech úkolů a jejich ID
   - Pak použijte příkaz: "přidej trasu z Prahy do Hodonína k úkolu s ID: X-Y" (kde X-Y je ID úkolu)

2. **Použijte přesný název úkolu**:
   - Např. "přidej trasu z Prahy do Brna k úkolu Dokončení vývoje AI Mapy"
   - Ujistěte se, že název úkolu je přesný

3. **Použijte panel plánování**:
   - Klikněte na úkol v panelu plánování
   - Pak použijte tlačítko "Přidat trasu"

Zkuste to znovu s přesným ID úkolu nebo přesným názvem úkolu.`;
          }
        }

        // Získání plánu a úkolu
        let planId: string | undefined, taskId: string | undefined;

        if (response.taskId) {
          // Pokud máme ID úkolu v odpovědi, pokusíme se najít plán
          console.log('Použití ID úkolu z odpovědi:', response.taskId);

          // Načtení plánů z localStorage
          const savedPlans = localStorage.getItem('plans');
          if (savedPlans) {
            try {
              const plans = JSON.parse(savedPlans);

              // Hledání úkolu podle ID
              let foundPlan = null;

              for (const plan of plans) {
                if (!plan.items || !Array.isArray(plan.items)) continue;

                const taskExists = plan.items.some((item: { id: string }) => item.id === response.taskId);
                if (taskExists) {
                  foundPlan = plan;
                  break;
                }
              }

              if (foundPlan) {
                planId = foundPlan.id;
                taskId = response.taskId;
              } else if (taskContext) {
                planId = taskContext.planId;
                taskId = taskContext.taskId;
              } else {
                return response.content || `Nepodařilo se najít úkol s ID: ${response.taskId}.

Zkontrolujte, zda jste zadali správné ID úkolu. Můžete použít příkaz "seznam úkolů" pro zobrazení všech dostupných úkolů a jejich ID.`;
              }
            } catch (error) {
              console.error('Chyba při hledání úkolu podle ID z odpovědi:', error);
              if (taskContext) {
                planId = taskContext.planId;
                taskId = taskContext.taskId;
              } else {
                return `Chyba při hledání úkolu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
              }
            }
          } else if (taskContext) {
            planId = taskContext.planId;
            taskId = taskContext.taskId;
          } else {
            return response.content || `Nepodařilo se najít žádné plány. Nejprve vytvořte plán a úkoly pomocí panelu plánování nebo příkazem "vytvoř plán".`;
          }
        } else if (taskContext) {
          // Použijeme kontext úkolu
          planId = taskContext.planId;
          taskId = taskContext.taskId;
        } else {
          return response.content || `Nepodařilo se určit ID úkolu a plánu. Použijte příkaz "seznam úkolů" pro zobrazení všech dostupných úkolů a jejich ID, a pak zadejte příkaz ve formátu "přidej trasu z Prahy do Hodonína k úkolu s ID: X-Y".`;
        }

        console.log('Použitý planId:', planId, 'taskId:', taskId);

        // Načtení aktuálních plánů
        const savedPlans = localStorage.getItem('plans');
        if (!savedPlans) return response.content;

        try {
          let plans = JSON.parse(savedPlans);

          // Najdeme plán a úkol
          const planIndex = plans.findIndex((p: any) => p.id === planId);
          if (planIndex === -1) return response.content;

          const plan = plans[planIndex];
          const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);
          if (taskIndex === -1) return response.content;

          // Aktualizace úkolu s novou trasou
          plan.items[taskIndex] = {
            ...plan.items[taskIndex],
            type: 'route',
            route: response.route
          };

          // Nastavení aktivního indexu na tento úkol
          plan.activeItemIndex = taskIndex;
          plan.updatedAt = new Date();
          plans[planIndex] = plan;

          // Uložení aktualizovaných plánů
          localStorage.setItem('plans', JSON.stringify(plans));

          // Aktualizace položek plánu na mapě
          updatePlanItemsOnMap(plan);

          // Automaticky zaměřit mapu na novou trasu
          console.log('Zobrazuji trasu na mapě po přidání přes API:', response.route);
          const centerLat = (response.route.start.lat + response.route.end.lat) / 2;
          const centerLng = (response.route.start.lng + response.route.end.lng) / 2;
          setMapCenter([centerLat, centerLng]);
          setMapZoom(10);
          setMarkers([response.route.start, response.route.end]);
          setRoute(response.route);

          // Zobrazení panelu plánování, pokud není viditelný
          if (!isPlanningVisible) {
            setIsPlanningVisible(true);
          }

          return response.content || `Přidal jsem trasu z "${response.route.start.name}" do "${response.route.end.name}" k úkolu "${plan.items[taskIndex].title}".`;
        } catch (error) {
          console.error('Chyba při aktualizaci úkolu s trasou:', error);
          return `Chyba při přidávání trasy: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
        }
      }
      else {
        // Pokud odpověď není plán, vrátíme textovou odpověď
        return response.content || `Zpracoval jsem váš dotaz: "${message}", ale nepodařilo se vytvořit plán.`;
      }
    } catch (error) {
      console.error('Chyba při vytváření plánu z chatu:', error);
      alert(`Chyba při vytváření plánu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
      return `Omlouvám se, ale došlo k chybě při vytváření plánu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
    }
  };

  // Pomocná funkce pro získání modelu podle poskytovatele
  const getModelForProvider = (provider: string): string => {
    switch (provider) {
      case 'openai':
        return 'GPT-4';
      case 'google':
        return 'Gemini 1.5 Flash'; // Použijeme Gemini 1.5 Flash - nejnovější dostupný model
      case 'anthropic':
        return 'Claude 3';
      case 'deepseek':
        return 'DeepSeek Coder';
      default:
        return 'Neznámý model';
    }
  };

  // Pomocná funkce pro získání barvy podle poskytovatele
  const getColorForProvider = (provider: string): string => {
    switch (provider) {
      case 'openai':
        return '#2ecc71'; // zelená
      case 'google':
        return '#f39c12'; // oranžová
      case 'anthropic':
        return '#3498db'; // modrá
      case 'deepseek':
        return '#9b59b6'; // fialová
      case 'mapbox':
        return '#e74c3c'; // červená
      default:
        return '#7f8c8d'; // šedá
    }
  };

  return (
    <div className="enhanced-map-page">
      <div className="map-header">
        <div className="map-provider-selector">
          <label htmlFor="map-provider">Poskytovatel mapy:</label>
          <select
            id="map-provider"
            value={mapProvider}
            onChange={handleMapProviderChange}
          >
            <option value="google">Google Maps</option>
            <option value="mapbox">Mapbox</option>
            <option value="mapycz">Mapy.cz</option>
            <option value="openstreetmap">OpenStreetMap</option>
          </select>
        </div>

        <div className="map-actions">
          {apiKeyWarning && (
            <div className="api-key-warning">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Není vybrán žádný API klíč</span>
            </div>
          )}

          <button
            className="api-manager-button"
            onClick={() => setShowApiManager(!showApiManager)}
          >
            <i className="fas fa-key"></i>
            <span>Správa API klíčů</span>
          </button>

          <button
            className="planning-toggle-button"
            onClick={() => setIsPlanningVisible(!isPlanningVisible)}
          >
            <i className={`fas ${isPlanningVisible ? 'fa-calendar-minus' : 'fa-calendar-plus'}`}></i>
            <span>{isPlanningVisible ? 'Skrýt plánování' : 'Zobrazit plánování'}</span>
          </button>

          <button
            className="chat-toggle-button"
            onClick={() => setIsChatVisible(!isChatVisible)}
            disabled={!apiState.selectedApiKey}
          >
            <i className={`fas ${isChatVisible ? 'fa-comment-slash' : 'fa-comment'}`}></i>
            <span>{isChatVisible ? 'Skrýt chat' : 'Zobrazit chat'}</span>
          </button>
        </div>
      </div>

      <div className="map-content">
        {/* Panel plánování */}
        <PlanningPanel
          onSelectLocation={handleLocationSelect}
          onSelectRoute={handleRouteSelect}
          onCreatePlanFromChat={handleCreatePlanFromChat}
          onStartPlanNavigation={handleStartPlanNavigation}
          onNavigateToNextStep={handleNavigateToNextStep}
          onNavigateToPrevStep={handleNavigateToPrevStep}
          visible={isPlanningVisible}
          isNavigating={isNavigating}
          currentNavigationPlan={currentNavigationPlan}
        />

        <div className="map-container">
          <MapComponent
            center={mapCenter}
            zoom={mapZoom}
            provider={mapProvider}
            markers={markers}
            route={route}
            planItems={planItems}
            apiKey={apiState.selectedApiKey?.provider === 'mapbox' ? apiState.selectedApiKey.key : null}
          />

          {/* Informace o aktivním API klíči */}
          {apiState.selectedApiKey && (
            <div className="active-api-info">
              <div className="api-badge" style={{ backgroundColor: getColorForProvider(apiState.selectedApiKey.provider) }}>
                <i className="fas fa-link"></i>
                <span>{apiState.selectedModel}</span>
              </div>
            </div>
          )}
        </div>

        {isChatVisible && (
          <div className="chat-container">
            <EnhancedChatInterface
              selectedApiKey={apiState.selectedApiKey}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
            />
          </div>
        )}
      </div>

      {showApiManager && (
        <div className="api-manager-container">
          <div className="api-manager-overlay" onClick={() => setShowApiManager(false)}></div>
          <div className="api-manager-modal">
            <button className="close-modal-button" onClick={() => setShowApiManager(false)}>
              <i className="fas fa-times"></i>
            </button>
            <EnhancedApiKeyManager
              onSelectApiKey={handleApiKeySelect}
              onApiKeyVerified={handleApiKeyVerified}
              selectedChatModel={apiState.selectedModel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMapPage;
