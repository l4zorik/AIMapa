import React, { useState, useEffect } from 'react';
import { ApiKey } from '../components/ApiKeys/EnhancedApiKeyManager';
import EnhancedApiKeyManager from '../components/ApiKeys/EnhancedApiKeyManager';
import EnhancedChatInterface from '../components/Chat/EnhancedChatInterface';
import MapComponent from '../components/MapComponent';
import GlobeComponent from '../components/GlobeComponent';
import PlanningPanel, { PlanItem } from '../components/Planning/PlanningPanel';
import EnhancedTaskInfoPanel from '../components/Map/EnhancedTaskInfoPanel';
import TestRunner from '../components/Testing/TestRunner';
import simpleGeminiService from '../services/SimpleGeminiService';
import routingService from '../services/RoutingService';
import geolocationService from '../services/GeolocationService';
import userSettingsService from '../services/UserSettingsService';
import chatSessionService from '../services/ChatSessionService';
import { isLocationWithinDistance } from '../utils/LocationUtils';
import { hasPlanSubtasks, checkAndFixPlansWithoutSubtasks, generateRelevantSubtasks } from '../utils/TaskUtils';
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
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name?: string } | null>(null);
  const [route, setRoute] = useState<{
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  } | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<boolean>(false);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [plans, setPlans] = useState<Array<any>>([]);
  const [selectedTask, setSelectedTask] = useState<PlanItem | null>(null);

  // Stav pro UI
  const [showApiManager, setShowApiManager] = useState<boolean>(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [isPlanningVisible, setIsPlanningVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [apiKeyWarning, setApiKeyWarning] = useState<boolean>(true);
  const [mapKey, setMapKey] = useState<number>(0); // Klíč pro vynucení překreslení mapy
  const [isGlobeMode, setIsGlobeMode] = useState<boolean>(false); // Přepínač mezi 2D mapou a 3D glóbusem

  // Stav pro navigaci podle plánu
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [currentNavigationPlan, setCurrentNavigationPlan] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [navigationStep, setNavigationStep] = useState<number>(0);
  const [showTestRunner, setShowTestRunner] = useState<boolean>(false);

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

  // Efekt pro inicializaci sledování polohy uživatele
  useEffect(() => {
    console.log('Inicializace sledování polohy uživatele');

    // Funkce pro zaměření na aktuální polohu uživatele
    const focusOnUserLocation = async () => {
      try {
        // Získání aktuální polohy uživatele
        const position = await geolocationService.getCurrentPosition();
        const userLocation = geolocationService.positionToLocation(position);
        console.log('Získána aktuální poloha uživatele pro zaměření:', userLocation);

        // Nastavení středu mapy na aktuální polohu uživatele
        setMapCenter([userLocation.lat, userLocation.lng]);

        // Vytvoření události pro zobrazení aktuální polohy na mapě
        const event = new CustomEvent('showUserLocation', {
          detail: {
            location: userLocation,
            zoom: 16
          }
        });
        window.dispatchEvent(event);

        // Uložení aktuální polohy do localStorage pro pozdější použití
        localStorage.setItem('lastUserLocation', JSON.stringify(userLocation));
      } catch (error) {
        console.error('Chyba při získávání polohy uživatele:', error);
      }
    };

    // Zaměření na aktuální polohu uživatele při spuštění
    focusOnUserLocation();

    // Inicializace sledování polohy
    const watchId = geolocationService.watchPosition(
      (position) => {
        // Získání polohy uživatele
        const userLocation = geolocationService.positionToLocation(position);
        console.log('Aktualizována poloha uživatele:', userLocation);

        // Aktualizace polohy na mapě
        // Pokud je zapnutá navigace, sledujeme polohu uživatele
        if (isNavigating) {
          // Nastavení středu mapy na aktuální polohu uživatele
          setMapCenter([userLocation.lat, userLocation.lng]);
        }
        // Pokud není zapnutá navigace a nemáme vybranou žádnou lokaci, zobrazíme aktuální polohu
        else if (!selectedLocation && !selectedRoute) {
          // Nastavení středu mapy na aktuální polohu uživatele
          setMapCenter([userLocation.lat, userLocation.lng]);
        }

        // Uložení aktuální polohy do localStorage pro pozdější použití
        localStorage.setItem('lastUserLocation', JSON.stringify(userLocation));
      },
      (error) => {
        console.error('Chyba při sledování polohy:', error);
      }
    );

    // Přidání posluchače události pro zaměření na aktuální polohu uživatele
    const handleFocusOnUserLocationRequest = () => {
      console.log('Požadavek na zaměření na aktuální polohu uživatele');
      focusOnUserLocation();
    };

    window.addEventListener('focusOnUserLocationRequest', handleFocusOnUserLocationRequest);

    // Ukončení sledování polohy při odmontování komponenty
    return () => {
      geolocationService.clearWatch(watchId);
      window.removeEventListener('focusOnUserLocationRequest', handleFocusOnUserLocationRequest);
    };
  }, [isNavigating, selectedLocation, selectedRoute]);

  // Efekt pro načtení uloženého API klíče a plánů
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

    // Načtení plánů z localStorage
    const savedPlans = localStorage.getItem('plans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        console.log('Načítám uložené plány:', parsedPlans.length);

        // Kontrola a oprava plánů, které nemají podúkoly
        const fixedPlans = checkAndFixPlansWithoutSubtasks(parsedPlans);

        // Pokud byly provedeny opravy, uložíme opravené plány zpět do localStorage
        if (fixedPlans !== parsedPlans) {
          console.log('Byly provedeny opravy plánů, ukládám opravené plány do localStorage');

          // Převedení objektů Date na ISO string pro správné uložení do localStorage
          const plansToSave = fixedPlans.map((plan: any) => ({
            ...plan,
            createdAt: plan.createdAt instanceof Date ? plan.createdAt.toISOString() : plan.createdAt,
            updatedAt: plan.updatedAt instanceof Date ? plan.updatedAt.toISOString() : plan.updatedAt,
            items: plan.items.map((item: any) => ({
              ...item,
              createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt
            }))
          }));

          localStorage.setItem('plans', JSON.stringify(plansToSave));
        }

        setPlans(fixedPlans);
      } catch (error) {
        console.error('Chyba při načítání uložených plánů:', error);
      }
    }

    // Inicializace routingService - načtení API klíče z localStorage
    // Toto je záložní řešení, pokud by se API klíč nenačetl při handleApiKeySelect
    if (!routingService.getApiKey()) {
      console.log('Inicializuji routingService - načítám API klíč z localStorage');
      // Klíč se načte automaticky v getApiKey() metodě
      const apiKey = routingService.getApiKey();
      if (apiKey) {
        console.log('Načten API klíč pro routingService z localStorage');
      } else {
        console.log('Nebyl nalezen žádný API klíč pro routingService v localStorage');
      }
    }
  }, []);

  // Efekt pro automatické přidání místa k úkolu "Najít vhodné místo pro zapálení cigarety"
  useEffect(() => {
    // Funkce pro přidání místa k úkolu pro zapálení cigarety
    const addSmokingLocationToTask = () => {
      const taskId = "1746726897965-0"; // ID úkolu "Najít vhodné místo pro zapálení cigarety"

      console.log('Automatické přidání místa k úkolu pro zapálení cigarety s ID:', taskId);

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (!savedPlans) {
        console.log('Žádné plány nebyly nalezeny v localStorage');
        return;
      }

      try {
        const plans = JSON.parse(savedPlans);

        // Hledání úkolu podle ID
        let foundPlan: any = null;
        let foundTask: any = null;

        for (const plan of plans) {
          if (!plan.items || !Array.isArray(plan.items)) continue;

          for (const item of plan.items) {
            if (item.id === taskId) {
              foundPlan = plan;
              foundTask = item;
              break;
            }
          }
          if (foundPlan) break;
        }

        // Pokud jsme našli úkol, přidáme k němu vhodné místo pro zapálení cigarety
        if (foundPlan && foundTask) {
          console.log('Nalezen úkol pro zapálení cigarety:', foundTask.title, 'v plánu:', foundPlan.title);

          // Pokud úkol již má lokaci, nebudeme ji přepisovat
          if (foundTask.type === 'location' && foundTask.location) {
            console.log('Úkol již má přiřazenou lokaci:', foundTask.location);

            // Zobrazíme lokaci na mapě
            handleLocationSelect(foundTask.location);

            // Nastavíme aktivní plán a úkol
            const taskIndex = foundPlan.items.findIndex((item: any) => item.id === taskId);
            if (taskIndex !== -1) {
              // Dispatch event pro aktualizaci UI
              const planUpdatedEvent = new CustomEvent('planUpdated', {
                detail: {
                  planId: foundPlan.id,
                  taskId: taskId,
                  taskIndex: taskIndex
                }
              });
              window.dispatchEvent(planUpdatedEvent);
            }

            return;
          }

          // Přidání vhodného místa pro zapálení cigarety
          const smokingLocation = {
            lat: 50.0755,
            lng: 14.4378,
            name: "Vhodné místo pro zapálení cigarety - Praha, Václavské náměstí"
          };

          // Použijeme funkci pro přímé přidání lokace k úkolu
          // Načtení aktuálních plánů
          const savedPlans = localStorage.getItem('plans');
          if (!savedPlans) {
            console.error('Žádné plány nebyly nalezeny');
            return;
          }

          try {
            let plans = JSON.parse(savedPlans);

            // Najdeme plán a úkol
            const planIndex = plans.findIndex((p: any) => p.id === foundPlan.id);
            if (planIndex === -1) {
              console.error('Plán nebyl nalezen:', foundPlan.id);
              return;
            }

            const plan = plans[planIndex];
            const taskIndex = plan.items.findIndex((item: any) => item.id === foundTask.id);
            if (taskIndex === -1) {
              console.error('Úkol nebyl nalezen:', foundTask.id);
              return;
            }

            // Aktualizace úkolu s novou lokací
            plan.items[taskIndex] = {
              ...plan.items[taskIndex],
              type: 'location',
              location: smokingLocation
            };

            // Nastavení aktivního indexu na tento úkol
            plan.activeItemIndex = taskIndex;
            plan.updatedAt = new Date();
            plans[planIndex] = plan;

            // Uložení aktualizovaných plánů
            localStorage.setItem('plans', JSON.stringify(plans));

            // Automaticky zaměřit mapu na novou lokaci
            console.log('Zobrazuji lokaci na mapě po přímém přidání:', smokingLocation);

            // Použití setTimeout pro zajištění, že se změny projeví
            setTimeout(() => {
              // Vytvoření markeru
              const newMarker = {
                lat: smokingLocation.lat,
                lng: smokingLocation.lng,
                name: smokingLocation.name || 'Místo'
              };

              // Nastavení mapy
              setMapCenter([smokingLocation.lat, smokingLocation.lng]);
              setMapZoom(15);
              setMarkers([newMarker]);

              // Zobrazení panelu plánování, pokud není viditelný
              if (!isPlanningVisible) {
                setIsPlanningVisible(true);
              }

              // Nastavení aktivního plánu v UI
              const updatedPlan = plans.find((p: any) => p.id === foundPlan.id);
              if (updatedPlan) {
                console.log('Nastavuji aktivní plán po přidání lokace:', updatedPlan.title);
                // Dispatch event pro aktualizaci UI - toto pomůže synchronizovat stav mezi komponentami
                const planUpdatedEvent = new CustomEvent('planUpdated', {
                  detail: {
                    planId: foundPlan.id,
                    taskId: foundTask.id,
                    taskIndex: taskIndex
                  }
                });
                window.dispatchEvent(planUpdatedEvent);
              }
            }, 100);

            console.log('Úspěšně přidáno vhodné místo pro zapálení cigarety k úkolu');
          } catch (error) {
            console.error('Chyba při přidávání lokace k úkolu:', error);
          }
        } else {
          console.log('Úkol pro zapálení cigarety nebyl nalezen');
        }
      } catch (error) {
        console.error('Chyba při automatickém přidávání místa k úkolu pro zapálení cigarety:', error);
      }
    };

    // Spustíme funkci pro přidání místa k úkolu po krátké prodlevě, aby se aplikace stihla načíst
    setTimeout(() => {
      addSmokingLocationToTask();
    }, 1000);
  }, [isPlanningVisible, setMapCenter, setMapZoom, setMarkers]);

  // Zpracování výběru lokace z chatu
  const handleLocationSelect = (location: { lat: number; lng: number; name?: string }) => {
    setMapCenter([location.lat, location.lng]);
    setMapZoom(15);
    setMarkers([location]);
    setRoute(null);
    setSelectedLocation(location);
    setSelectedRoute(false);

    // Přepnout na mapu na mobilním zařízení
    if (isMobile) {
      // Zde by bylo přepnutí na mapu v mobilním zobrazení
      console.log('Přepnutí na mapu v mobilním zobrazení');
    }
  };

  // Zpracování kliknutí na mapu
  const handleMapClick = (latlng: [number, number]) => {
    console.log('Kliknuto na mapu:', latlng);
    // Zde můžete implementovat další funkcionalitu pro kliknutí na mapu

    // Zavřeme informační panel, pokud je otevřený
    if (selectedTask) {
      setSelectedTask(null);
    }
  };

  // Přidání event listeneru pro zavření informačního panelu při kliknutí na mapu
  useEffect(() => {
    const handleMapClicked = () => {
      if (selectedTask) {
        setSelectedTask(null);
      }
    };

    window.addEventListener('mapClicked', handleMapClicked);

    return () => {
      window.removeEventListener('mapClicked', handleMapClicked);
    };
  }, [selectedTask]);

  // Přidání event listeneru pro aktualizaci informačního panelu při změně aktivního úkolu
  useEffect(() => {
    const handlePlanUpdated = (event: CustomEvent) => {
      const { planId, taskIndex, action } = event.detail;

      // Zpracování speciálních akcí
      if (action === 'navigationStopped') {
        console.log('Zpracovávám událost ukončení navigace');
        return;
      }

      // Najdeme plán podle ID
      const plan = plans.find(p => p.id === planId);
      if (plan && taskIndex !== undefined && plan.items[taskIndex]) {
        const item = plan.items[taskIndex];

        // Aktualizace informačního panelu
        if ((item.type === 'location' && item.location) ||
            (item.type === 'route' && item.route)) {
          setSelectedTask(item);
        } else {
          setSelectedTask(null);
        }
      }
    };

    window.addEventListener('planUpdated', handlePlanUpdated as EventListener);

    return () => {
      window.removeEventListener('planUpdated', handlePlanUpdated as EventListener);
    };
  }, [plans]);

  // Zpracování kliknutí na marker úkolu
  const handleTaskMarkerClick = (task: PlanItem, planId?: string) => {
    console.log('Kliknuto na marker úkolu:', task.title, 'planId:', planId);
    // Přidáme planId k úkolu, aby ho mohla použít komponenta EnhancedTaskInfoPanel
    setSelectedTask({
      ...task,
      planId
    });
  };

  // Zpracování výběru trasy z chatu
  const handleRouteSelect = (routeData: {
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  }) => {
    // Nastavit střed mapy mezi počátečním a koncovým bodem
    const centerLat = (routeData.start.lat + routeData.end.lat) / 2;
    const centerLng = (routeData.start.lng + routeData.end.lng) / 2;

    setMapCenter([centerLat, centerLng]);
    setMapZoom(10);
    setMarkers([routeData.start, routeData.end]);
    setRoute(routeData);
    setSelectedLocation(null);
    setSelectedRoute(true);

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

    // Nastavení API klíče pro služby
    if (apiKey.provider === 'google') {
      simpleGeminiService.setApiKey(apiKey.key);

      // Pokud máme Google API klíč, můžeme ho použít i pro OpenRouteService
      // Toto je jen dočasné řešení, v produkci by měl být samostatný klíč pro OpenRouteService
      if (apiKey.isVerified) {
        routingService.setApiKey(apiKey.key);
        console.log('Nastaven API klíč pro routingService');
      }
    } else if (apiKey.provider === 'mapbox') {
      // Pokud máme Mapbox API klíč, můžeme ho použít pro OpenRouteService
      if (apiKey.isVerified) {
        routingService.setApiKey(apiKey.key);
        console.log('Nastaven API klíč pro routingService z Mapbox');
      }
    }

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

    // Kontrola, zda zpráva obsahuje požadavek na spuštění testů
    if (messageLC.includes('spusť testy') ||
        messageLC.includes('spustit testy') ||
        messageLC.includes('otestuj') ||
        messageLC.includes('testování') ||
        messageLC.includes('test lokací') ||
        messageLC.includes('testovat lokace') ||
        messageLC.includes('testovat přesnost')) {
      console.log('Detekován požadavek na spuštění testů');
      setShowTestRunner(true);
      return "Spouštím testovací systém pro ověření přesnosti přiřazování lokalit. Výsledky testů budou zobrazeny v samostatném okně.";
    }

    // Kontrola, zda zpráva obsahuje požadavek na vytvoření nového plánu
    const createPlanRegex = /vytvoř(?:\s+nový)?\s+plán(?:\s+s\s+názvem)?\s+["']?([^"']+)["']?/i;
    const createPlanMatch = messageLC.match(createPlanRegex);

    if (createPlanMatch) {
      const planTitle = createPlanMatch[1].trim();
      console.log('Detekován požadavek na vytvoření nového plánu:', planTitle);

      // Vytvoření nového plánu
      const newPlanId = Date.now().toString();
      const newPlan: any = {
        id: newPlanId,
        title: planTitle,
        description: '',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Kontrola, zda existuje adresa bydliště
      const homeAddress = userSettingsService.getHomeAddress();

      // Pokud máme adresu bydliště, přidáme ji jako první úkol
      if (homeAddress) {
        console.log('Přidávám adresu bydliště jako první úkol v plánu:', planTitle);

        // Vytvoření nového úkolu s adresou bydliště
        const newItemId = `${newPlanId}-1`;
        const newItem = {
          id: newItemId,
          title: "Výchozí bod",
          description: `Automaticky přidaná adresa bydliště: ${homeAddress.displayName}`,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          completed: false,
          type: 'location',
          location: {
            lat: homeAddress.lat,
            lng: homeAddress.lng,
            name: `Domov - ${homeAddress.displayName}`
          }
        };

        // Přidání úkolu do plánu
        newPlan.items.push(newItem);
        newPlan.activeItemIndex = 0;

        // Zobrazení lokace na mapě
        setMapCenter([homeAddress.lat, homeAddress.lng]);
        setMapZoom(15);
        setMarkers([{
          lat: homeAddress.lat,
          lng: homeAddress.lng,
          name: `Domov - ${homeAddress.displayName}`
        }]);
      }

      // Generování relevantních podúkolů na základě názvu plánu
      const subtasks = generateRelevantSubtasks(planTitle, newPlanId);
      console.log('Vygenerované podúkoly pro plán:', subtasks);

      // Přidání podúkolů do plánu
      newPlan.items = [...newPlan.items, ...subtasks];
      console.log('Plán vytvořen s podúkoly:', newPlan.items.length);

      // Přidání plánu do seznamu plánů
      const updatedPlans = [...plans, newPlan];
      setPlans(updatedPlans);

      // Uložení plánů do localStorage - převedení objektů Date na ISO string
      const plansToSave = updatedPlans.map((plan: any) => ({
        ...plan,
        createdAt: plan.createdAt instanceof Date ? plan.createdAt.toISOString() : plan.createdAt,
        updatedAt: plan.updatedAt instanceof Date ? plan.updatedAt.toISOString() : plan.updatedAt,
        items: plan.items.map((item: any) => ({
          ...item,
          createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt
        }))
      }));
      localStorage.setItem('plans', JSON.stringify(plansToSave));

      // Zobrazení panelu plánování
      if (!isPlanningVisible) {
        setIsPlanningVisible(true);
      }

      // Vyvolání události pro aktualizaci UI s ID nového plánu a nastavení jako aktivní
      const plansUpdatedEvent = new CustomEvent('plansUpdated', {
        detail: {
          action: 'create',
          setActive: true, // Přidáno pro nastavení nového plánu jako aktivního
          planId: newPlanId,
          source: 'chat'
        }
      });
      window.dispatchEvent(plansUpdatedEvent);
      console.log('Vyvolána událost plansUpdated pro aktualizaci seznamu plánů po vytvoření plánu z chatu');

      if (homeAddress) {
        return `Vytvořil jsem nový plán s názvem "${planTitle}" s výchozím bodem na vaší adrese bydliště. Plán je nyní aktivní a můžete do něj přidávat další položky.`;
      } else {
        return `Vytvořil jsem nový plán s názvem "${planTitle}". Plán je nyní aktivní a můžete do něj přidávat položky. Pro automatické přidání výchozího bodu nastavte svou adresu bydliště v profilu.`;
      }
    }

    // Kontrola, zda zpráva obsahuje požadavek na přidání položky do plánu
    const addItemRegex = /přidej(?:\s+novou)?\s+položku(?:\s+s\s+názvem)?\s+["']?([^"']+)["']?(?:\s+do\s+plánu(?:\s+s\s+id)?\s+["']?([^"']+)["']?)?/i;
    const addItemMatch = messageLC.match(addItemRegex);

    if (addItemMatch) {
      const itemTitle = addItemMatch[1].trim();
      const planId = addItemMatch[2]?.trim();

      console.log('Detekován požadavek na přidání položky:', itemTitle, 'do plánu:', planId || 'aktivní plán');

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (!savedPlans) {
        return "Nemáte žádné plány. Nejprve vytvořte plán pomocí příkazu 'vytvoř plán [název plánu]'.";
      }

      const parsedPlans = JSON.parse(savedPlans);

      // Najdeme plán, do kterého chceme přidat položku
      let targetPlan;
      if (planId) {
        targetPlan = parsedPlans.find((p: any) => p.id === planId);
        if (!targetPlan) {
          return `Plán s ID ${planId} nebyl nalezen.`;
        }
      } else {
        // Pokud není specifikováno ID plánu, použijeme aktivní plán
        if (parsedPlans.length === 0) {
          return "Nemáte žádné plány. Nejprve vytvořte plán pomocí příkazu 'vytvoř plán [název plánu]'.";
        }

        // Pokud máme aktivní plán, použijeme ho
        if (plans.length > 0) {
          targetPlan = parsedPlans.find((p: any) => p.id === plans[0].id);
        } else {
          // Jinak použijeme první plán v seznamu
          targetPlan = parsedPlans[0];
        }
      }

      // Vytvoření nové položky
      const newItem = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: itemTitle,
        description: '',
        completed: false,
        type: 'task'
      };

      // Přidání položky do plánu
      targetPlan.items.push(newItem);
      targetPlan.updatedAt = new Date();

      // Uložení aktualizovaných plánů do localStorage
      localStorage.setItem('plans', JSON.stringify(parsedPlans));

      // Aktualizace stavu plánů
      setPlans(parsedPlans);

      // Zobrazení panelu plánování
      if (!isPlanningVisible) {
        setIsPlanningVisible(true);
      }

      return `Přidal jsem novou položku "${itemTitle}" do plánu "${targetPlan.title}".`;
    }

    // Kontrola, zda zpráva obsahuje požadavek na automatické přiřazení lokalit
    if (messageLC.includes('přiřaď lokace') ||
        messageLC.includes('přiřadit lokace') ||
        messageLC.includes('přiřaď lokality') ||
        messageLC.includes('přiřadit lokality') ||
        messageLC.includes('přiřaď místa') ||
        messageLC.includes('přiřadit místa') ||
        messageLC.includes('automaticky přiřaď lokace') ||
        messageLC.includes('automaticky přiřadit lokace')) {

      console.log('Detekován požadavek na automatické přiřazení lokalit');

      // Extrahujeme ID plánu, pokud je uvedeno
      const planIdMatch = messageLC.match(/(?:k|do|pro)\s+plán(?:u)?\s+(?:s\s+id)?\s+["']?([a-zA-Z0-9\-_]+)["']?/i);
      let planId: string | undefined = planIdMatch ? planIdMatch[1].trim() : undefined;

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (!savedPlans) {
        return "Nemáte žádné plány. Nejprve vytvořte plán pomocí příkazu 'vytvoř plán [název plánu]'.";
      }

      const parsedPlans = JSON.parse(savedPlans);

      // Najdeme plán, ke kterému chceme přiřadit lokace
      let targetPlan;
      if (planId) {
        targetPlan = parsedPlans.find((p: any) => p.id === planId);
        if (!targetPlan) {
          return `Plán s ID ${planId} nebyl nalezen.`;
        }
      } else {
        // Pokud není specifikováno ID plánu, použijeme aktivní plán
        if (parsedPlans.length === 0) {
          return "Nemáte žádné plány. Nejprve vytvořte plán pomocí příkazu 'vytvoř plán [název plánu]'.";
        }

        // Pokud máme aktivní plán, použijeme ho
        if (plans.length > 0) {
          targetPlan = parsedPlans.find((p: any) => p.id === plans[0].id);
        } else {
          // Jinak použijeme první plán v seznamu
          targetPlan = parsedPlans[0];
        }
      }

      const finalPlanId = targetPlan.id;

      // Spustíme automatické přiřazování lokalit na pozadí
      import('../services/TaskLocationService').then(async (module) => {
        const taskLocationService = module.default;

        try {
          // Zobrazení panelu plánování
          if (!isPlanningVisible) {
            setIsPlanningVisible(true);
          }

          // Spuštění automatického přiřazování lokalit
          const result = await taskLocationService.autoAssignLocationsToTasks(
            finalPlanId,
            (progress) => {
              console.log(`Průběh přiřazování lokalit: ${progress.processed}/${progress.total} (${progress.updated} aktualizováno, ${progress.skipped} přeskočeno)`);
            }
          );

          console.log('Automatické přiřazování lokalit dokončeno:', result);

          // Aktualizace plánů z localStorage
          const updatedPlans = localStorage.getItem('plans');
          if (updatedPlans) {
            try {
              const parsedUpdatedPlans = JSON.parse(updatedPlans);
              setPlans(parsedUpdatedPlans);
            } catch (error) {
              console.error('Chyba při aktualizaci plánů po přiřazení lokalit:', error);
            }
          }
        } catch (error) {
          console.error('Chyba při automatickém přiřazování lokalit:', error);
        }
      });

      return `Spouštím automatické přiřazování lokalit k úkolům v plánu "${targetPlan.title}". Proces bude probíhat na pozadí a výsledky se automaticky projeví v plánu.`;
    }

    // Kontrola, zda zpráva obsahuje požadavek na spuštění navigace
    if (messageLC.includes('spusť navigaci') ||
        messageLC.includes('spustit navigaci') ||
        messageLC.includes('zahájit navigaci') ||
        messageLC.includes('zahaj navigaci') ||
        messageLC.includes('naviguj podle plánu') ||
        messageLC.includes('navigovat podle plánu')) {

      console.log('Detekován požadavek na spuštění navigace');

      // Extrahujeme ID plánu, pokud je uvedeno
      const planIdMatch = messageLC.match(/(?:podle|pro)\s+plán(?:u)?\s+(?:s\s+id)?\s+["']?([a-zA-Z0-9\-_]+)["']?/i);
      let planId: string | undefined = planIdMatch ? planIdMatch[1].trim() : undefined;

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (!savedPlans) {
        return "Nemáte žádné plány. Nejprve vytvořte plán pomocí příkazu 'vytvoř plán [název plánu]'.";
      }

      const parsedPlans = JSON.parse(savedPlans);

      // Najdeme plán, podle kterého chceme navigovat
      let targetPlan;
      if (planId) {
        targetPlan = parsedPlans.find((p: any) => p.id === planId);
        if (!targetPlan) {
          return `Plán s ID ${planId} nebyl nalezen.`;
        }
      } else {
        // Pokud není specifikováno ID plánu, použijeme aktivní plán
        if (parsedPlans.length === 0) {
          return "Nemáte žádné plány. Nejprve vytvořte plán pomocí příkazu 'vytvoř plán [název plánu]'.";
        }

        // Pokud máme aktivní plán, použijeme ho
        if (plans.length > 0) {
          targetPlan = parsedPlans.find((p: any) => p.id === plans[0].id);
        } else {
          // Jinak použijeme první plán v seznamu
          targetPlan = parsedPlans[0];
        }
      }

      // Kontrola, zda plán obsahuje položky s lokacemi
      const hasLocations = targetPlan.items && targetPlan.items.some((item: any) => item.type === 'location' && item.location);

      if (!hasLocations) {
        return `Plán "${targetPlan.title}" neobsahuje žádné položky s lokacemi. Nejprve přiřaďte lokace k úkolům pomocí příkazu 'přiřaď lokace'.`;
      }

      // Spuštění navigace
      setIsNavigating(true);
      setCurrentNavigationPlan(targetPlan.id);
      setNavigationStep(0);

      // Zobrazení panelu plánování
      if (!isPlanningVisible) {
        setIsPlanningVisible(true);
      }

      return `Spouštím navigaci podle plánu "${targetPlan.title}". Navigace je nyní aktivní a můžete procházet jednotlivé body plánu.`;
    }

    // Kontrola, zda zpráva obsahuje požadavek na ukončení navigace
    if (messageLC.includes('ukonči navigaci') ||
        messageLC.includes('ukončit navigaci') ||
        messageLC.includes('zastav navigaci') ||
        messageLC.includes('zastavit navigaci') ||
        messageLC.includes('stop navigace') ||
        messageLC.includes('zastavit navigování')) {

      console.log('Detekován požadavek na ukončení navigace');

      if (!isNavigating) {
        return "Navigace není aktivní. Nejprve spusťte navigaci pomocí příkazu 'spusť navigaci'.";
      }

      // Ukončení navigace
      setIsNavigating(false);
      setCurrentNavigationPlan(undefined);
      setNavigationStep(0);

      return "Navigace byla ukončena.";
    }

    // Kontrola, zda zpráva obsahuje požadavek na zobrazení nápovědy
    if (messageLC.includes('nápověda') ||
        messageLC.includes('pomoc') ||
        messageLC.includes('help') ||
        messageLC.includes('co umíš') ||
        messageLC.includes('jaké příkazy') ||
        messageLC.includes('jaké jsou příkazy') ||
        messageLC.includes('seznam příkazů')) {

      console.log('Detekován požadavek na zobrazení nápovědy');

      return `# Nápověda k příkazům chatu

## Plánování
- **Vytvoření plánu**: "Vytvoř plán [název plánu]"
- **Přidání položky**: "Přidej položku [název položky] do plánu"
- **Přiřazení lokalit**: "Přiřaď lokace k plánu"

## Navigace
- **Spuštění navigace**: "Spusť navigaci podle plánu"
- **Ukončení navigace**: "Ukonči navigaci"

## Testování
- **Spuštění testů**: "Spusť testy" nebo "Testuj přesnost lokalit"

## Ostatní
- **Seznam úkolů**: "Ukaž seznam úkolů"
- **Nápověda**: "Nápověda" nebo "Pomoc"

Všechny tyto příkazy můžete zadávat přirozeným jazykem, systém rozpozná vaše požadavky i v různých formulacích.`;
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

    // Rozšířená detekce pro různé varianty požadavku na přidání lokace
    if (!locationMatch) {
      // Detekce pro "dej tam jakoukoliv lokalitu"
      if (messageLC.includes('dej tam jakoukoliv lokalitu') ||
          messageLC.includes('přidej jakoukoliv lokaci') ||
          messageLC.includes('přidej libovolnou lokaci') ||
          messageLC.includes('přidej místo k úkolu') ||
          messageLC.includes('přidej lokaci k úkolu')) {

        // Extrahujeme ID úkolu
        const idMatch = messageLC.match(/(?:úkol|úkolu|task|tasku)\s+(?:s\s+id:?\s*)?([a-zA-Z0-9\-_]+)/i);
        if (idMatch) {
          taskId = idMatch[1].trim();
          locationName = 'praha'; // Výchozí lokace
          // Vytvoříme umělý match pro další zpracování
          const dummyMatch = messageLC.match(/dej tam jakoukoliv lokalitu/);
          locationMatch = dummyMatch;
          console.log('Detekován požadavek na přidání libovolné lokace k úkolu s ID:', taskId);
        }
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

                  // Pokud máme více než jeden úkol s lokací, vytvoříme trasy mezi nimi
                  const itemsWithLocation = plan.items.filter((item: any) =>
                    item.type === 'location' && item.location
                  );

                  console.log('Počet úkolů s lokací v plánu:', itemsWithLocation.length);

                  // Pokud máme alespoň dva úkoly s lokací, vytvoříme trasu mezi nimi
                  if (itemsWithLocation.length >= 2) {
                    console.log('Vytváření tras mezi lokacemi v plánu');

                    // Seřadíme úkoly podle indexu v plánu
                    const sortedItems = [...itemsWithLocation].sort((a: any, b: any) => {
                      return plan.items.findIndex((item: any) => item.id === a.id) -
                             plan.items.findIndex((item: any) => item.id === b.id);
                    });

                    // Vytvoříme trasy mezi po sobě jdoucími lokacemi
                    for (let i = 0; i < sortedItems.length - 1; i++) {
                      const startItem = sortedItems[i];
                      const endItem = sortedItems[i + 1];

                      // Vytvoříme ID pro trasu
                      const routeId = `route-${startItem.id}-${endItem.id}`;

                      // Zkontrolujeme, zda trasa již existuje
                      const routeExists = plan.items.some((item: any) =>
                        item.id === routeId ||
                        (item.type === 'route' &&
                         item.route &&
                         item.route.start &&
                         item.route.end &&
                         item.route.start.lat === startItem.location.lat &&
                         item.route.start.lng === startItem.location.lng &&
                         item.route.end.lat === endItem.location.lat &&
                         item.route.end.lng === endItem.location.lng)
                      );

                      if (!routeExists) {
                        console.log(`Přidávám trasu mezi ${startItem.title} a ${endItem.title}`);

                        // Vytvoříme novou trasu
                        const newRoute: any = {
                          id: routeId,
                          title: `Trasa: ${startItem.title} → ${endItem.title}`,
                          description: `Trasa mezi body ${startItem.location.name || 'Start'} a ${endItem.location.name || 'Cíl'}`,
                          type: 'route' as 'location' | 'task' | 'route' | 'note',
                          completed: false,
                          route: {
                            start: startItem.location,
                            end: endItem.location
                          }
                        };

                        // Pokud máme API klíč pro routingService, získáme optimalizovanou trasu
                        if (routingService.getApiKey()) {
                          try {
                            console.log('Získávám optimalizovanou trasu pro novou trasu mezi:', startItem.title, 'a', endItem.title);
                            // Získání optimalizované trasy z API (asynchronně)
                            routingService.getRoute(
                              startItem.location,
                              endItem.location
                            ).then(routeResult => {
                              console.log('Získána geometrie trasy z API:', routeResult.geometry);

                              // Přidání geometrie a informací o trase
                              newRoute.route.geometry = routeResult.geometry;
                              newRoute.route.distance = routeResult.distance;
                              newRoute.route.duration = routeResult.duration;

                              // Aktualizace popisu trasy s informacemi o vzdálenosti a času
                              const distance = routingService.formatDistance(routeResult.distance);
                              const duration = routingService.formatDuration(routeResult.duration);
                              newRoute.description = `Trasa mezi body ${startItem.location.name || 'Start'} a ${endItem.location.name || 'Cíl'} (${distance}, ${duration})`;

                              // Aktualizace plánu v localStorage
                              const savedPlans = localStorage.getItem('plans');
                              if (savedPlans) {
                                const plans = JSON.parse(savedPlans);
                                const planIndex = plans.findIndex((p: any) => p.id === plan.id);
                                if (planIndex !== -1) {
                                  plans[planIndex] = plan;
                                  localStorage.setItem('plans', JSON.stringify(plans));
                                  console.log('Uložena aktualizovaná trasa s geometrií do localStorage');

                                  // Vyvoláme událost pro aktualizaci UI
                                  const routeUpdatedEvent = new CustomEvent('planUpdated', {
                                    detail: {
                                      planId: plan.id,
                                      taskId: newRoute.id,
                                      action: 'routeGeometryUpdated'
                                    }
                                  });
                                  window.dispatchEvent(routeUpdatedEvent);
                                }
                              }
                            }).catch(error => {
                              console.error('Chyba při získávání optimalizované trasy:', error);
                            });
                          } catch (error) {
                            console.error('Chyba při získávání optimalizované trasy:', error);
                          }
                        }

                        // Přidáme trasu do plánu hned za cílový bod
                        const endItemIndex = plan.items.findIndex((item: any) => item.id === endItem.id);
                        plan.items.splice(endItemIndex + 1, 0, newRoute);

                        // Tato část kódu je nyní redundantní, protože geometrii trasy získáváme již výše
                        // Ponecháváme ji zde pro zpětnou kompatibilitu, ale v budoucnu by měla být odstraněna
                        /*
                        // Pokud máme API klíč pro routingService, získáme geometrii trasy
                        if (routingService.getApiKey()) {
                          // Asynchronně získáme geometrii trasy
                          routingService.getRoute(startItem.location, endItem.location)
                            .then(routeResult => {
                              // Načteme aktuální plány
                              const currentPlans = localStorage.getItem('plans');
                              if (currentPlans) {
                                try {
                                  const parsedPlans = JSON.parse(currentPlans);
                                  const currentPlanIndex = parsedPlans.findIndex((p: any) => p.id === planId);

                                  if (currentPlanIndex !== -1) {
                                    const currentPlan = parsedPlans[currentPlanIndex];
                                    const routeIndex = currentPlan.items.findIndex((item: any) => item.id === routeId);

                                    if (routeIndex !== -1) {
                                      // Aktualizujeme trasu s geometrií
                                      currentPlan.items[routeIndex].route = {
                                        ...currentPlan.items[routeIndex].route,
                                        geometry: routeResult.geometry,
                                        distance: routeResult.distance,
                                        duration: routeResult.duration
                                      };

                                      // Aktualizujeme popis trasy
                                      const distance = routingService.formatDistance(routeResult.distance);
                                      const duration = routingService.formatDuration(routeResult.duration);
                                      currentPlan.items[routeIndex].description =
                                        `Trasa mezi body ${startItem.location.name || 'Start'} a ${endItem.location.name || 'Cíl'} (${distance}, ${duration})`;

                                      // Uložíme aktualizované plány
                                      parsedPlans[currentPlanIndex] = currentPlan;
                                      localStorage.setItem('plans', JSON.stringify(parsedPlans));

                                      console.log('Trasa aktualizována s geometrií:', routeResult);

                                      // Vyvoláme událost pro aktualizaci UI
                                      const routeUpdatedEvent = new CustomEvent('planUpdated', {
                                        detail: {
                                          planId: planId,
                                          taskId: routeId,
                                          taskIndex: routeIndex
                                        }
                                      });
                                      window.dispatchEvent(routeUpdatedEvent);
                                    }
                                  }
                                } catch (error) {
                                  console.error('Chyba při aktualizaci trasy s geometrií:', error);
                                }
                              }
                            })
                            .catch(error => {
                              console.error('Chyba při získávání geometrie trasy:', error);
                            });
                        }
                        */
                      }
                    }
                  }

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
        const newPlanId = Date.now().toString();
        const newPlan = {
          id: newPlanId,
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

        // Propojení plánu s aktuální chat session
        const activeSessionId = chatSessionService.getLastActiveSessionId();
        if (activeSessionId) {
          chatSessionService.addPlanIdToSession(activeSessionId, newPlanId);
          console.log(`Plán ${newPlanId} propojen s chat session ${activeSessionId}`);
        }

        // Vyvolání události pro informování ostatních komponent o vytvoření plánu
        const planCreatedEvent = new CustomEvent('planCreated', {
          detail: {
            planId: newPlan.id,
            planTitle: newPlan.title,
            source: 'api',
            plan: newPlan,
            chatSessionId: activeSessionId
          }
        });
        window.dispatchEvent(planCreatedEvent);

        console.log('Vyvolána událost planCreated pro nový plán:', newPlan.id);

        // Vynucené překreslení seznamu plánů
        setTimeout(() => {
          // Vyvolání události pro aktualizaci UI
          const plansUpdatedEvent = new CustomEvent('plansUpdated', {
            detail: {
              action: 'create',
              planId: newPlan.id
            }
          });
          window.dispatchEvent(plansUpdatedEvent);

          console.log('Vyvolána událost plansUpdated pro aktualizaci seznamu plánů');
        }, 100);

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

        // Vytvoříme nový plán s úkolem
        const newPlanId = Date.now().toString();
        // Použijeme celý název úkolu jako název plánu bez zkracování
        const planTitle = response.taskTitle;

        // Vytvoření nového plánu
        const newPlan: any = {
          id: newPlanId,
          title: `Plán: ${planTitle}`,
          description: `Plán vytvořený pro úkol: ${response.taskTitle}`,
          items: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Vytvoření nového hlavního úkolu
        const mainItemId = `${newPlanId}-0`;
        const mainItem: any = {
          id: mainItemId,
          title: response.taskTitle,
          description: response.taskDescription || '',
          time: '',
          completed: false,
          type: 'task',
          createdAt: new Date()
        };

        // Přidání úkolu do plánu
        newPlan.items.push(mainItem);
        console.log('Přidán hlavní úkol do plánu:', mainItem);

        // Uložení plánu do localStorage
        plans.push(newPlan);

        try {
          // Převedení objektů Date na ISO string pro správné uložení do localStorage
          const plansToSave = plans.map((plan: any) => ({
            ...plan,
            createdAt: plan.createdAt instanceof Date ? plan.createdAt.toISOString() : plan.createdAt,
            updatedAt: plan.updatedAt instanceof Date ? plan.updatedAt.toISOString() : plan.updatedAt,
            items: plan.items.map((item: any) => ({
              ...item,
              createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt
            }))
          }));

          localStorage.setItem('plans', JSON.stringify(plansToSave));
          console.log('Plán s podúkoly byl úspěšně uložen do localStorage');

          // Kontrola, zda plán obsahuje podúkoly
          if (hasPlanSubtasks(newPlan)) {
            console.log(`Plán "${newPlan.title}" obsahuje ${newPlan.items.length - 1} podúkolů`);
          } else {
            console.warn(`Plán "${newPlan.title}" neobsahuje žádné podúkoly! Zkontrolujte implementaci.`);
          }
        } catch (error) {
          console.error('Chyba při ukládání plánu do localStorage:', error);
        }

        // Propojení plánu s aktuální chat session
        const activeSessionId = chatSessionService.getLastActiveSessionId();
        if (activeSessionId) {
          chatSessionService.addPlanIdToSession(activeSessionId, newPlanId);
          console.log(`Plán ${newPlanId} propojen s chat session ${activeSessionId}`);
        }

        // Aktualizace stavu plánů v aplikaci
        setPlans(plans);

        // Zobrazení panelu plánování, pokud není viditelný
        if (!isPlanningVisible) {
          setIsPlanningVisible(true);
        }

        // Vyvolání události pro aktualizaci UI s ID nového plánu
        const plansUpdatedEvent = new CustomEvent('plansUpdated', {
          detail: {
            action: 'create',
            planId: newPlanId,
            source: 'chat'
          }
        });
        window.dispatchEvent(plansUpdatedEvent);
        console.log('Vyvolána událost plansUpdated pro aktualizaci seznamu plánů po vytvoření plánu z chatu');

        // Vyvolání události pro informování ostatních komponent o vytvoření plánu
        const planCreatedEvent = new CustomEvent('planCreated', {
          detail: {
            planId: newPlanId,
            planTitle: newPlan.title,
            source: 'api',
            plan: newPlan,
            chatSessionId: activeSessionId
          }
        });
        window.dispatchEvent(planCreatedEvent);

        // Automatické zaměření mapy na body plánu
        updatePlanItemsOnMap(newPlan);

        return response.content || `Vytvořil jsem plán "${newPlan.title}" s ${newPlan.items.length} položkami.`;
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
    // Vymazání historie chatu je implementováno v EnhancedChatInterface
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
      setSelectedTask(null);
      return;
    }

    // Filtrujeme pouze položky s lokací nebo trasou
    const itemsWithLocation = plan.items.filter((item: any) =>
      (item.type === 'location' && item.location) ||
      (item.type === 'route' && item.route)
    );

    console.log('Aktualizuji položky plánu na mapě:', itemsWithLocation.length);

    // Přidání informace o aktivním úkolu a nově přidaných úkolech
    const enhancedItems = itemsWithLocation.map((item: any, index: number) => {
      return {
        ...item,
        isActive: index === plan.activeItemIndex,
        isNew: item.createdAt && (Date.now() - new Date(item.createdAt).getTime() < 60000) // Považujeme za nový, pokud byl vytvořen v posledních 60 sekundách
      };
    });

    setPlanItems(enhancedItems);

    // Automatické zaměření mapy na body plánu
    if (enhancedItems.length > 0) {
      focusMapOnPlanItems(enhancedItems, plan);
    }

    // Nastavení vybraného úkolu pro informační panel
    const activeItemIndex = plan.activeItemIndex !== undefined ? plan.activeItemIndex : -1;
    if (activeItemIndex >= 0 && activeItemIndex < plan.items.length) {
      const activeItem = plan.items[activeItemIndex];
      if ((activeItem.type === 'location' && activeItem.location) ||
          (activeItem.type === 'route' && activeItem.route)) {
        setSelectedTask(activeItem);
      } else {
        setSelectedTask(null);
      }
    } else {
      setSelectedTask(null);
    }
  };

  // Funkce pro zaměření mapy na body plánu
  const focusMapOnPlanItems = (items: any[], plan: any) => {
    // Získání všech bodů (lokace a trasy)
    const points: any[] = [];

    items.forEach(item => {
      if (item.type === 'location' && item.location) {
        points.push({
          lat: item.location.lat,
          lng: item.location.lng,
          name: item.location.name || item.title
        });
      } else if (item.type === 'route' && item.route) {
        points.push({
          lat: item.route.start.lat,
          lng: item.route.start.lng,
          name: item.route.start.name || 'Start'
        });
        points.push({
          lat: item.route.end.lat,
          lng: item.route.end.lng,
          name: item.route.end.name || 'Cíl'
        });
      }
    });

    // Pokud nemáme žádné body, zkontrolujeme domovskou adresu
    if (points.length === 0) {
      const homeAddress = userSettingsService.getHomeAddress();
      if (homeAddress) {
        points.push({
          lat: homeAddress.lat,
          lng: homeAddress.lng,
          name: `Domov - ${homeAddress.displayName}`
        });
      }
    }

    // Pokud máme body, zaměříme mapu
    if (points.length > 0) {
      // Pokud máme aktivní úkol s lokací, zaměříme se na něj
      const activeItem = plan.activeItemIndex !== undefined && plan.activeItemIndex >= 0 &&
                         plan.activeItemIndex < items.length ? items[plan.activeItemIndex] : null;

      if (activeItem && activeItem.type === 'location' && activeItem.location) {
        // Zaměření na aktivní úkol
        setMapCenter([activeItem.location.lat, activeItem.location.lng]);
        setMapZoom(15);

        // Nastavení markerů pro všechny body
        setMarkers(points);

        // Pokud máme více než jeden bod, zobrazíme trasu
        if (points.length > 1) {
          calculateAndDisplayRoute(points);
        }
      } else if (activeItem && activeItem.type === 'route' && activeItem.route) {
        // Zaměření na střed trasy
        const centerLat = (activeItem.route.start.lat + activeItem.route.end.lat) / 2;
        const centerLng = (activeItem.route.start.lng + activeItem.route.end.lng) / 2;
        setMapCenter([centerLat, centerLng]);
        setMapZoom(12);

        // Nastavení markerů pro všechny body
        setMarkers(points);

        // Zobrazení trasy
        setRoute(activeItem.route);
      } else {
        // Pokud nemáme aktivní úkol, zaměříme se na první bod
        setMapCenter([points[0].lat, points[0].lng]);

        // Nastavení markerů pro všechny body
        setMarkers(points);

        // Pokud máme více než jeden bod, přizpůsobíme zoom tak, aby byly vidět všechny body
        if (points.length > 1) {
          // Výpočet hranic pro všechny body
          const bounds = calculateBounds(points);

          // Nastavení zoomu podle hranic
          const zoom = calculateZoomLevel(bounds);
          setMapZoom(zoom);

          // Pokud máme více než jeden bod, zobrazíme trasu
          calculateAndDisplayRoute(points);
        } else {
          setMapZoom(15);
        }
      }
    }
  };

  // Funkce pro výpočet hranic pro body
  const calculateBounds = (points: any[]) => {
    let minLat = points[0].lat;
    let maxLat = points[0].lat;
    let minLng = points[0].lng;
    let maxLng = points[0].lng;

    points.forEach(point => {
      minLat = Math.min(minLat, point.lat);
      maxLat = Math.max(maxLat, point.lat);
      minLng = Math.min(minLng, point.lng);
      maxLng = Math.max(maxLng, point.lng);
    });

    return {
      minLat,
      maxLat,
      minLng,
      maxLng
    };
  };

  // Funkce pro výpočet úrovně přiblížení podle hranic
  const calculateZoomLevel = (bounds: any) => {
    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 18;

    const zoom = (mapPx: number, worldPx: number, fraction: number) => {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    };

    const latFraction = (bounds.maxLat - bounds.minLat) / 180;
    const lngFraction = (bounds.maxLng - bounds.minLng) / 360;

    const latZoom = zoom(window.innerHeight, WORLD_DIM.height, latFraction);
    const lngZoom = zoom(window.innerWidth, WORLD_DIM.width, lngFraction);

    // Přidáme malou rezervu pro lepší zobrazení
    return Math.min(Math.min(latZoom, lngZoom) - 1, ZOOM_MAX);
  };

  // Funkce pro výpočet a zobrazení trasy mezi body
  const calculateAndDisplayRoute = async (points: any[]) => {
    if (points.length < 2) return;

    // Pro jednoduchost použijeme první a poslední bod
    const start = points[0];
    const end = points[points.length - 1];

    // Vytvoření základní trasy
    const routeData: any = {
      start: {
        lat: start.lat,
        lng: start.lng,
        name: start.name
      },
      end: {
        lat: end.lat,
        lng: end.lng,
        name: end.name
      },
      // Pokud máme více než dva body, přidáme je jako waypoints
      waypoints: points.length > 2 ? points.slice(1, points.length - 1).map(p => ({
        lat: p.lat,
        lng: p.lng,
        name: p.name
      })) : undefined
    };

    // Zobrazení informace o načítání trasy
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'coordinates-display';
    loadingMessage.innerHTML = `
      <i class="fas fa-route"></i>
      <span>Načítám optimalizovanou trasu po silnicích...</span>
    `;
    document.body.appendChild(loadingMessage);

    try {
      // Pokud máme API klíč pro routingService, získáme optimalizovanou trasu
      if (routingService.getApiKey()) {
        console.log('Získávám optimalizovanou trasu po silnicích');

        // Získání optimalizované trasy z API
        const routeResult = await routingService.getRoute(
          { lat: start.lat, lng: start.lng, name: start.name },
          { lat: end.lat, lng: end.lng, name: end.name }
        );

        // Přidání geometrie a informací o trase
        routeData.geometry = routeResult.geometry;
        routeData.distance = routeResult.distance;
        routeData.duration = routeResult.duration;

        // Aktualizace zprávy o načítání
        loadingMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>Trasa nalezena: ${routingService.formatDistance(routeResult.distance)} (${routingService.formatDuration(routeResult.duration)})</span>
        `;

        console.log('Optimalizovaná trasa získána:', routeResult);
      } else {
        console.log('API klíč pro routingService není nastaven, používám přímou trasu');

        // Aktualizace zprávy o načítání
        loadingMessage.innerHTML = `
          <i class="fas fa-info-circle"></i>
          <span>Používám přímou trasu (chybí API klíč pro optimalizaci)</span>
        `;
      }
    } catch (error) {
      console.error('Chyba při získávání optimalizované trasy:', error);

      // Aktualizace zprávy o načítání v případě chyby
      loadingMessage.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>Chyba při načítání optimalizované trasy - používám přímou trasu</span>
      `;
    } finally {
      // Nastavení trasy
      setRoute(routeData);

      // Odstranění zprávy o načítání po 2 sekundách
      setTimeout(() => {
        if (document.body.contains(loadingMessage)) {
          document.body.removeChild(loadingMessage);
        }
      }, 2000);
    }
  };

  // Funkce pro spuštění nebo ukončení navigace podle plánu
  const handleStartPlanNavigation = (plan: any) => {
    // Kontrola, zda se jedná o ukončení navigace
    if (plan.activeItemIndex === undefined) {
      console.log('Ukončuji navigaci pro plán:', plan.title);

      // Ukončení navigace
      setIsNavigating(false);
      setCurrentNavigationPlan(undefined);
      setNavigationStep(0);

      // Aktualizace položek plánu na mapě bez aktivního indexu
      updatePlanItemsOnMap(plan);

      // Vyvolání události pro aktualizaci UI
      const planUpdatedEvent = new CustomEvent('planUpdated', {
        detail: {
          planId: plan.id,
          action: 'navigationStopped'
        }
      });
      window.dispatchEvent(planUpdatedEvent);

      return;
    }

    console.log('Spouštím navigaci podle plánu:', plan.title);

    // Zajistíme, že plán má nastavený aktivní index
    let updatedPlan = { ...plan };

    // Pokud není nastaven aktivní index nebo je neplatný, nastavíme ho na 0
    if (updatedPlan.activeItemIndex === undefined ||
        updatedPlan.activeItemIndex < 0 ||
        updatedPlan.activeItemIndex >= updatedPlan.items.length) {
      updatedPlan.activeItemIndex = 0;

      // Aktualizace plánu v seznamu plánů
      const updatedPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
      setPlans(updatedPlans);

      // Uložení aktualizovaného plánu do localStorage
      localStorage.setItem('plans', JSON.stringify(updatedPlans));
    }

    // Aktualizace položek plánu na mapě
    updatePlanItemsOnMap(updatedPlan);

    if (updatedPlan.items.length > 0) {
      // Nastavení stavu navigace
      setIsNavigating(true);
      setCurrentNavigationPlan(updatedPlan.id);
      setNavigationStep(updatedPlan.activeItemIndex);

      // Zobrazení aktivního bodu na mapě
      const activeItem = updatedPlan.items[updatedPlan.activeItemIndex];
      if (activeItem.type === 'location' && activeItem.location) {
        handleLocationSelect(activeItem.location);
      } else if (activeItem.type === 'route' && activeItem.route) {
        handleRouteSelect(activeItem.route);
      }

      // Otevření panelu plánování, pokud není otevřený
      if (!isPlanningVisible) {
        setIsPlanningVisible(true);
      }

      // Vyvolání události pro aktualizaci UI
      const planUpdatedEvent = new CustomEvent('planUpdated', {
        detail: {
          planId: updatedPlan.id,
          taskId: activeItem.id,
          taskIndex: updatedPlan.activeItemIndex,
          action: 'navigationStarted'
        }
      });
      window.dispatchEvent(planUpdatedEvent);
    } else {
      // Ukončení navigace, pokud plán nemá žádné položky
      setIsNavigating(false);
      setCurrentNavigationPlan(undefined);
      setNavigationStep(0);
      setPlanItems([]);
    }
  };

  // Funkce pro navigaci na další krok
  const handleNavigateToNextStep = (plan: any, currentIndex: number) => {
    // Výpočet indexu dalšího kroku
    const nextIndex = currentIndex + 1;

    // Kontrola, zda existuje další krok
    if (nextIndex >= plan.items.length) {
      console.log('Dosažen konec plánu, nelze přejít na další krok');
      return;
    }

    console.log('Navigace na další krok:', nextIndex);

    // Aktualizace stavu navigace
    setNavigationStep(nextIndex);

    // Aktualizace aktivního indexu v plánu
    const updatedPlan = { ...plan, activeItemIndex: nextIndex };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p => p.id === plan.id ? updatedPlan : p);
    setPlans(updatedPlans);

    // Uložení aktualizovaného plánu do localStorage
    localStorage.setItem('plans', JSON.stringify(updatedPlans));

    // Zobrazení animace přechodu na mapě
    const nextItem = plan.items[nextIndex];
    console.log('Navigace na další krok, zobrazuji položku:', nextItem);

    if (nextItem.type === 'location' && nextItem.location) {
      // Animace přechodu na novou lokaci
      const location = nextItem.location;
      console.log('Zobrazuji lokaci na mapě při navigaci na další krok:', location);

      // Přidání markeru s animací
      const newMarker = {
        lat: location.lat,
        lng: location.lng,
        name: location.name || `Krok ${nextIndex + 1}`
      };

      setMarkers([newMarker]);
      setMapCenter([location.lat, location.lng]);
      setMapZoom(15);
    } else if (nextItem.type === 'route' && nextItem.route) {
      // Animace přechodu na novou trasu
      console.log('Zobrazuji trasu na mapě při navigaci na další krok:', nextItem.route);
      handleRouteSelect(nextItem.route);
    }

    // Aktualizace položek plánu na mapě
    updatePlanItemsOnMap(updatedPlan);

    // Vyvolání události pro aktualizaci UI
    const planUpdatedEvent = new CustomEvent('planUpdated', {
      detail: {
        planId: plan.id,
        taskId: nextItem.id,
        taskIndex: nextIndex
      }
    });
    window.dispatchEvent(planUpdatedEvent);
  };

  // Funkce pro navigaci na předchozí krok
  const handleNavigateToPrevStep = (plan: any, currentIndex: number) => {
    // Výpočet indexu předchozího kroku
    const prevIndex = currentIndex - 1;

    // Kontrola, zda existuje předchozí krok
    if (prevIndex < 0) {
      console.log('Dosažen začátek plánu, nelze přejít na předchozí krok');
      return;
    }

    console.log('Navigace na předchozí krok:', prevIndex);

    // Aktualizace stavu navigace
    setNavigationStep(prevIndex);

    // Aktualizace aktivního indexu v plánu
    const updatedPlan = { ...plan, activeItemIndex: prevIndex };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p => p.id === plan.id ? updatedPlan : p);
    setPlans(updatedPlans);

    // Uložení aktualizovaného plánu do localStorage
    localStorage.setItem('plans', JSON.stringify(updatedPlans));

    // Zobrazení animace přechodu na mapě
    const prevItem = plan.items[prevIndex];
    console.log('Navigace na předchozí krok, zobrazuji položku:', prevItem);

    if (prevItem.type === 'location' && prevItem.location) {
      // Animace přechodu na novou lokaci
      const location = prevItem.location;
      console.log('Zobrazuji lokaci na mapě při navigaci na předchozí krok:', location);

      // Přidání markeru s animací
      const newMarker = {
        lat: location.lat,
        lng: location.lng,
        name: location.name || `Krok ${prevIndex + 1}`
      };

      setMarkers([newMarker]);
      setMapCenter([location.lat, location.lng]);
      setMapZoom(15);
    } else if (prevItem.type === 'route' && prevItem.route) {
      // Animace přechodu na novou trasu
      console.log('Zobrazuji trasu na mapě při navigaci na předchozí krok:', prevItem.route);
      handleRouteSelect(prevItem.route);
    }

    // Aktualizace položek plánu na mapě
    updatePlanItemsOnMap(updatedPlan);

    // Vyvolání události pro aktualizaci UI
    const planUpdatedEvent = new CustomEvent('planUpdated', {
      detail: {
        planId: plan.id,
        taskId: prevItem.id,
        taskIndex: prevIndex
      }
    });
    window.dispatchEvent(planUpdatedEvent);
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

            // Vyvolání události pro aktualizaci seznamu plánů
            const plansUpdatedEvent = new CustomEvent('plansUpdated', {
              detail: {
                action: 'create',
                planId: planId,
                source: 'chat'
              }
            });
            window.dispatchEvent(plansUpdatedEvent);
            console.log('Vyvolána událost plansUpdated pro aktualizaci seznamu plánů po přidání lokace k úkolu');
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

    // Kontrola, zda zpráva obsahuje zmínku o Praze, Hodoníně nebo Rohatci
    const containsPrague = messageLC.includes("praha") || messageLC.includes("prahu") || messageLC.includes("pražský");
    const containsHodonin = messageLC.includes("hodonín") || messageLC.includes("hodonin") || messageLC.includes("hodonína");
    const containsRohatec = messageLC.includes("rohatec") || messageLC.includes("rohatce") || messageLC.includes("rohatcem");

    // Extrakce ID úkolu z textu
    const taskIdFromText = extractTaskIdFromText(message);
    console.log('Extrahované ID úkolu z textu:', taskIdFromText);

    // Speciální případ pro přidání Hodonína nebo Rohatce ke všem úkolům
    if ((messageLC.includes("přidej") || messageLC.includes("přidat")) &&
        (messageLC.includes("hodonín") || messageLC.includes("rohatec")) &&
        (messageLC.includes("všem úkolům") || messageLC.includes("všechny úkoly") || messageLC.includes("všech úkolů"))) {
      console.log('Detekován požadavek na přidání lokace ke všem úkolům');

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const plans = JSON.parse(savedPlans);

          if (plans.length === 0) {
            return "Nelze přidat Hodonín ke všem úkolům, protože nebyly nalezeny žádné plány.";
          }

          // Určení lokace k přidání
          let locationToAdd;

          if (messageLC.includes("rohatec")) {
            // Přidání Rohatce k úkolům
            locationToAdd = {
              lat: 48.8783,
              lng: 17.1750,
              name: "Rohatec"
            };
            console.log('Přidávám Rohatec ke všem úkolům');
          } else {
            // Přidání Hodonína k úkolům
            locationToAdd = {
              lat: 48.8492,
              lng: 17.1247,
              name: "Hodonín"
            };
            console.log('Přidávám Hodonín ke všem úkolům');
          }

          // Počítadla pro statistiky
          let totalTasks = 0;
          let updatedTasks = 0;
          let skippedTasks = 0;

          // Projdeme všechny plány a úkoly
          for (const plan of plans) {
            if (!plan.items || !Array.isArray(plan.items)) continue;

            for (const item of plan.items) {
              totalTasks++;

              // Přeskočíme úkoly, které již mají lokaci
              if (item.type === 'location' && item.location) {
                console.log(`Úkol "${item.title}" (ID: ${item.id}) již má lokaci, přeskakuji.`);
                skippedTasks++;
                continue;
              }

              // Přidáme lokaci k úkolu
              console.log(`Přidávám ${locationToAdd.name} k úkolu "${item.title}" (ID: ${item.id})`);
              const success = addLocationToTask(item.id, plan.id, locationToAdd);

              if (success) {
                updatedTasks++;
              }
            }
          }

          // Vrátíme odpověď s informací o počtu aktualizovaných úkolů
          if (updatedTasks > 0) {
            return `Přidal jsem ${locationToAdd.name} k ${updatedTasks} úkolům z celkového počtu ${totalTasks} úkolů. ${skippedTasks} úkolů již mělo přiřazenou lokaci.`;
          } else if (skippedTasks === totalTasks) {
            return `Všechny úkoly (${totalTasks}) již mají přiřazenou lokaci. Žádné úkoly nebyly aktualizovány.`;
          } else {
            return `Nepodařilo se přidat ${locationToAdd.name} k žádnému úkolu. Celkový počet úkolů: ${totalTasks}.`;
          }
        } catch (error) {
          console.error(`Chyba při přidávání lokace ke všem úkolům:`, error);
          return `Chyba při přidávání lokace ke všem úkolům: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
        }
      } else {
        return "Nelze přidat lokaci ke všem úkolům, protože nebyly nalezeny žádné plány v localStorage.";
      }
    }

    // Speciální případ pro přidání lokace ke všem úkolům v konkrétním plánu
    if ((messageLC.includes("přidej") || messageLC.includes("přidat")) &&
        (messageLC.includes("hodonín") || messageLC.includes("rohatec")) &&
        (messageLC.includes("všem úkolům v plánu") || messageLC.includes("všechny úkoly v plánu") ||
         messageLC.includes("všech úkolů v plánu") || messageLC.includes("všem úkolům v projektu"))) {
      console.log('Detekován požadavek na přidání lokace ke všem úkolům v konkrétním plánu');

      // Extrahujeme název plánu z textu
      let planName = "";
      const planNameMatch = messageLC.match(/v plánu\s+["']?([^"']+)["']?/i) ||
                           messageLC.match(/v projektu\s+["']?([^"']+)["']?/i);

      if (planNameMatch && planNameMatch[1]) {
        planName = planNameMatch[1].trim();
      } else {
        // Pokud nemáme název plánu, použijeme AI API pro identifikaci plánu
        try {
          // Nastavení API klíče pro Gemini službu
          if (apiState.selectedApiKey && apiState.selectedApiKey.provider === 'google') {
            console.log('Používám Google API klíč pro identifikaci plánu');
            simpleGeminiService.setApiKey(apiState.selectedApiKey.key);

            // Odeslání požadavku na identifikaci plánu
            const response = await simpleGeminiService.sendMessage(
              `Identifikuj název plánu z tohoto textu: "${message}"`,
              { center: mapCenter, zoom: mapZoom }
            );

            if (response.type === 'planIdentification' && response.planName) {
              planName = response.planName;
              console.log('AI identifikoval název plánu:', planName);
            }
          }
        } catch (error) {
          console.error('Chyba při identifikaci plánu pomocí AI:', error);
        }

        if (!planName) {
          return "Nelze přidat Hodonín ke všem úkolům v plánu, protože nebyl specifikován název plánu. Prosím, uveďte název plánu.";
        }
      }

      console.log('Hledám plán s názvem:', planName);

      // Načtení plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const plans = JSON.parse(savedPlans);

          // Hledání plánu podle názvu
          const foundPlan = plans.find((plan: any) =>
            (plan.title || '').toLowerCase().includes(planName.toLowerCase())
          );

          if (!foundPlan) {
            return `Nelze přidat Hodonín ke všem úkolům v plánu, protože plán s názvem "${planName}" nebyl nalezen.`;
          }

          if (!foundPlan.items || !Array.isArray(foundPlan.items) || foundPlan.items.length === 0) {
            return `Plán "${foundPlan.title}" neobsahuje žádné úkoly.`;
          }

          // Určení lokace k přidání
          let locationToAdd;

          if (messageLC.includes("rohatec")) {
            // Přidání Rohatce k úkolům
            locationToAdd = {
              lat: 48.8783,
              lng: 17.1750,
              name: "Rohatec"
            };
            console.log('Přidávám Rohatec ke všem úkolům v plánu:', foundPlan.title);
          } else {
            // Přidání Hodonína k úkolům
            locationToAdd = {
              lat: 48.8492,
              lng: 17.1247,
              name: "Hodonín"
            };
            console.log('Přidávám Hodonín ke všem úkolům v plánu:', foundPlan.title);
          }

          // Počítadla pro statistiky
          let totalTasks = foundPlan.items.length;
          let updatedTasks = 0;
          let skippedTasks = 0;

          // Projdeme všechny úkoly v plánu
          for (const item of foundPlan.items) {
            // Přeskočíme úkoly, které již mají lokaci
            if (item.type === 'location' && item.location) {
              console.log(`Úkol "${item.title}" (ID: ${item.id}) již má lokaci, přeskakuji.`);
              skippedTasks++;
              continue;
            }

            // Přidáme lokaci k úkolu
            console.log(`Přidávám ${locationToAdd.name} k úkolu "${item.title}" (ID: ${item.id})`);
            const success = addLocationToTask(item.id, foundPlan.id, locationToAdd);

            if (success) {
              updatedTasks++;
            }
          }

          // Vrátíme odpověď s informací o počtu aktualizovaných úkolů
          if (updatedTasks > 0) {
            return `Přidal jsem ${locationToAdd.name} k ${updatedTasks} úkolům z celkového počtu ${totalTasks} úkolů v plánu "${foundPlan.title}". ${skippedTasks} úkolů již mělo přiřazenou lokaci.`;
          } else if (skippedTasks === totalTasks) {
            return `Všechny úkoly (${totalTasks}) v plánu "${foundPlan.title}" již mají přiřazenou lokaci. Žádné úkoly nebyly aktualizovány.`;
          } else {
            return `Nepodařilo se přidat ${locationToAdd.name} k žádnému úkolu v plánu "${foundPlan.title}". Celkový počet úkolů: ${totalTasks}.`;
          }
        } catch (error) {
          console.error('Chyba při přidávání lokace ke všem úkolům v plánu:', error);
          return `Chyba při přidávání lokace ke všem úkolům v plánu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
        }
      } else {
        return "Nelze přidat lokaci ke všem úkolům v plánu, protože nebyly nalezeny žádné plány v localStorage.";
      }
    }

    // Speciální případ pro přidání lokace k úkolu "Dokončení vývoje AI Mapy"
    if ((messageLC.includes("přidej") || messageLC.includes("přidat")) &&
        (messageLC.includes("hodonín") || messageLC.includes("rohatec") || messageLC.includes("praha")) &&
        (messageLC.includes("dokončení vývoje ai mapy") || messageLC.includes("dokončení vývoje") || messageLC.includes("vývoj ai mapy"))) {
      console.log('Detekován speciální případ pro přidání lokace k úkolu Dokončení vývoje AI Mapy');

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

          // Pokud jsme našli úkol, přidáme k němu lokaci přímo
          if (foundPlan && foundTask) {
            console.log('Nalezen úkol:', foundTask.title, 'v plánu:', foundPlan.title);

            // Určení lokace k přidání
            let locationToAdd;

            if (messageLC.includes("rohatec")) {
              // Přidání Rohatce k úkolu
              locationToAdd = {
                lat: 48.8783,
                lng: 17.1750,
                name: "Rohatec"
              };
              console.log('Přidávám Rohatec k úkolu:', foundTask.title);
            } else if (messageLC.includes("hodonín") || messageLC.includes("hodonin")) {
              // Přidání Hodonína k úkolu
              locationToAdd = {
                lat: 48.8492,
                lng: 17.1247,
                name: "Hodonín"
              };
              console.log('Přidávám Hodonín k úkolu:', foundTask.title);
            } else {
              // Přidání Prahy k úkolu
              locationToAdd = {
                lat: 50.0755,
                lng: 14.4378,
                name: "Praha"
              };
              console.log('Přidávám Prahu k úkolu:', foundTask.title);
            }

            const success = addLocationToTask(foundTask.id, foundPlan.id, locationToAdd);

            if (success) {
              // Vrátíme odpověď bez volání API
              return `Přidal jsem ${locationToAdd.name} k úkolu "${foundTask.title}" (ID: ${foundTask.id}).`;
            }
          }
        } catch (error) {
          console.error('Chyba při přímém přidávání lokace k úkolu:', error);
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

            if (containsRohatec) {
              // Přidání Rohatce k úkolu
              location = {
                lat: 48.8783,
                lng: 17.1750,
                name: "Rohatec"
              };
              console.log('Přidávám Rohatec k úkolu s ID:', foundTask.id);
            } else if (containsHodonin) {
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

            if (containsRohatec) {
              // Přidání Rohatce k úkolu
              location = {
                lat: 48.8783,
                lng: 17.1750,
                name: "Rohatec"
              };
              console.log('Přidávám Rohatec k úkolu:', foundTask.title);
            } else if (containsHodonin) {
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
        const newPlanId = Date.now().toString();

        // Vytvoření základního plánu
        const newPlan: any = {
          id: newPlanId,
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

        // Automatické generování podúkolů, pokud plán nemá žádné podúkoly
        if (!hasPlanSubtasks(newPlan)) {
          console.log('Plán nemá podúkoly, generuji je automaticky');

          // Generování podúkolů na základě názvu plánu
          const subtasks = generateRelevantSubtasks(newPlan.title, newPlan.id);

          // Přidání podúkolů do plánu
          newPlan.items = [...newPlan.items, ...subtasks];

          console.log('Plán vytvořen s automaticky generovanými podúkoly:', newPlan.items.length);
        } else {
          console.log('Plán vytvořen s položkami:', newPlan.items.length);
        }

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

        // Přidání nového plánu do seznamu plánů
        const updatedPlans = [...plans, newPlan];
        console.log('Aktualizovaný seznam plánů po přidání nového plánu:', updatedPlans.map(p => ({ id: p.id, title: p.title })));

        try {
          // Převedení objektů Date na ISO string pro správné uložení do localStorage
          const plansToSave = updatedPlans.map((plan: any) => ({
            ...plan,
            createdAt: plan.createdAt instanceof Date ? plan.createdAt.toISOString() : plan.createdAt,
            updatedAt: plan.updatedAt instanceof Date ? plan.updatedAt.toISOString() : plan.updatedAt,
            items: plan.items.map((item: any) => ({
              ...item,
              createdAt: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt
            }))
          }));

          localStorage.setItem('plans', JSON.stringify(plansToSave));
          console.log('Plán s podúkoly byl úspěšně uložen do localStorage');

          // Kontrola, zda plán obsahuje podúkoly
          if (hasPlanSubtasks(newPlan)) {
            console.log(`Plán "${newPlan.title}" obsahuje ${newPlan.items.length - 1} podúkolů`);
          } else {
            console.warn(`Plán "${newPlan.title}" neobsahuje žádné podúkoly! Zkontrolujte implementaci.`);
          }
        } catch (error) {
          console.error('Chyba při ukládání plánu do localStorage:', error);
        }

        // Propojení plánu s aktuální chat session
        const activeSessionId = chatSessionService.getLastActiveSessionId();
        if (activeSessionId) {
          chatSessionService.addPlanIdToSession(activeSessionId, newPlanId);
          console.log(`Plán ${newPlanId} propojen s chat session ${activeSessionId}`);
        }

        // Aktualizace stavu plánů v aplikaci - důležité je vytvořit nové pole
        setPlans([...updatedPlans]);

        // Kontrola, zda plán byl skutečně přidán do localStorage
        const checkSavedPlans = localStorage.getItem('plans');
        if (checkSavedPlans) {
          try {
            const parsedPlans = JSON.parse(checkSavedPlans);
            const planExists = parsedPlans.some((p: any) => p.id === newPlanId);

            if (!planExists) {
              console.error(`Plán s ID ${newPlanId} nebyl nalezen v localStorage po uložení!`);
              // Pokusíme se plán znovu přidat
              parsedPlans.push(newPlan);
              localStorage.setItem('plans', JSON.stringify(parsedPlans));
              console.log('Plán byl znovu přidán do localStorage');
            } else {
              console.log(`Plán s ID ${newPlanId} byl úspěšně uložen do localStorage`);
            }
          } catch (error) {
            console.error('Chyba při kontrole uložení plánu:', error);
          }
        }

        // Vyvolání události pro aktualizaci UI s ID nového plánu a nastavení jako aktivní
        const plansUpdatedEvent = new CustomEvent('plansUpdated', {
          detail: {
            action: 'create',
            setActive: true, // Přidáno pro nastavení nového plánu jako aktivního
            planId: newPlanId,
            source: 'chat'
          }
        });
        window.dispatchEvent(plansUpdatedEvent);
        console.log('Vyvolána událost plansUpdated pro aktualizaci seznamu plánů po vytvoření plánu z chatu');

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

          // Získání aktuální polohy uživatele
          let userLocation = null;
          try {
            const position = await geolocationService.getCurrentPosition();
            userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          } catch (error) {
            console.error('Nepodařilo se získat aktuální polohu uživatele:', error);
          }

          // Kontrola, zda je lokace v maximální vzdálenosti 10 km od aktuální polohy uživatele
          if (userLocation && !isLocationWithinDistance(response.location, userLocation, 10)) {
            alert(`Lokace "${response.location.name}" je příliš daleko od vaší aktuální polohy (více než 10 km). Vyberte prosím bližší lokaci.`);
            return `Lokace "${response.location.name}" je příliš daleko od vaší aktuální polohy (více než 10 km). Vyberte prosím lokaci, která je maximálně 10 km od vaší aktuální polohy.`;
          }

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

          // Získání aktuální polohy uživatele
          let userLocation = null;
          try {
            const position = await geolocationService.getCurrentPosition();
            userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
          } catch (error) {
            console.error('Nepodařilo se získat aktuální polohu uživatele:', error);
          }

          // Kontrola, zda je počáteční bod trasy v maximální vzdálenosti 10 km od aktuální polohy uživatele
          if (userLocation && !isLocationWithinDistance(response.route.start, userLocation, 10)) {
            alert(`Počáteční bod trasy "${response.route.start.name}" je příliš daleko od vaší aktuální polohy (více než 10 km). Vyberte prosím bližší počáteční bod.`);
            return `Počáteční bod trasy "${response.route.start.name}" je příliš daleko od vaší aktuální polohy (více než 10 km). Vyberte prosím trasu, jejíž počáteční bod je maximálně 10 km od vaší aktuální polohy.`;
          }

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
            onClick={() => {
              setIsPlanningVisible(!isPlanningVisible);
              // Vynucení překreslení mapy po změně viditelnosti panelu plánování
              setTimeout(() => {
                setMapKey(prev => prev + 1);
              }, 100);
            }}
          >
            <i className={`fas ${isPlanningVisible ? 'fa-calendar-minus' : 'fa-calendar-plus'}`}></i>
            <span>{isPlanningVisible ? 'Skrýt plánování' : 'Zobrazit plánování'}</span>
          </button>

          <button
            className="globe-toggle-button"
            onClick={() => {
              setIsGlobeMode(!isGlobeMode);
              // Vynucení překreslení mapy po změně režimu zobrazení
              setTimeout(() => {
                setMapKey(prev => prev + 1);
              }, 100);
            }}
          >
            <i className={`fas ${isGlobeMode ? 'fa-map' : 'fa-globe'}`}></i>
            <span>{isGlobeMode ? '2D Mapa' : '3D Glóbus'}</span>
          </button>

          <button
            className="chat-toggle-button"
            onClick={() => {
              setIsChatVisible(!isChatVisible);
              // Vynucení překreslení mapy po změně viditelnosti chatu
              setTimeout(() => {
                setMapKey(prev => prev + 1);
              }, 100);
            }}
            disabled={!apiState.selectedApiKey}
          >
            <i className={`fas ${isChatVisible ? 'fa-comment-slash' : 'fa-comment'}`}></i>
            <span>{isChatVisible ? 'Skrýt chat' : 'Zobrazit chat'}</span>
          </button>

          {/* Tlačítko pro spuštění testů bylo odstraněno - nyní se ovládá přes chat */}
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
          {isGlobeMode ? (
            <GlobeComponent
              key={mapKey}
              center={mapCenter}
              zoom={mapZoom}
              markers={markers}
              route={route}
              onMarkerClick={(marker) => handleLocationSelect(marker)}
              onGlobeClick={(latlng) => handleLocationSelect({ lat: latlng[0], lng: latlng[1] })}
            />
          ) : (
            <MapComponent
              key={mapKey}
              center={mapCenter}
              zoom={mapZoom}
              provider={mapProvider}
              markers={markers}
              route={route}
              planItems={planItems}
              apiKey={apiState.selectedApiKey?.provider === 'mapbox' ? apiState.selectedApiKey.key : null}
              onMarkerClick={handleLocationSelect}
              onMapClick={handleMapClick}
              onTaskMarkerClick={handleTaskMarkerClick}
              activePlan={isNavigating && currentNavigationPlan ?
                plans.find(p => p.id === currentNavigationPlan) || null : null}
            />
          )}

          {/* Informační panel o vybraném úkolu */}
          {selectedTask && (
            <EnhancedTaskInfoPanel
              task={selectedTask}
              planId={selectedTask.planId}
              selectedApiKey={apiState.selectedApiKey}
              onClose={() => setSelectedTask(null)}
              onSendMessage={handleSendMessage}
              onUpdateTask={(taskId, updates) => {
                // Najdeme plán, který obsahuje úkol s daným ID
                const savedPlans = localStorage.getItem('plans');
                if (savedPlans) {
                  try {
                    let plans = JSON.parse(savedPlans);
                    let foundPlanId: string | null = null;
                    let foundPlan: any = null;

                    // Hledání úkolu podle ID
                    for (const plan of plans) {
                      if (!plan.items || !Array.isArray(plan.items)) continue;

                      const taskExists = plan.items.some((item: { id: string }) => item.id === taskId);
                      if (taskExists) {
                        foundPlanId = plan.id;
                        foundPlan = plan;
                        break;
                      }
                    }

                    if (foundPlan) {
                      // Aktualizace úkolu
                      const taskIndex = foundPlan.items.findIndex((item: any) => item.id === taskId);
                      if (taskIndex !== -1) {
                        foundPlan.items[taskIndex] = {
                          ...foundPlan.items[taskIndex],
                          ...updates
                        };

                        // Aktualizace plánu v seznamu plánů
                        const updatedPlans = plans.map((p: any) => p.id === foundPlanId ? foundPlan : p);

                        // Uložení aktualizovaných plánů
                        localStorage.setItem('plans', JSON.stringify(updatedPlans));

                        // Aktualizace stavu
                        setPlans(updatedPlans);
                        setSelectedTask({
                          ...selectedTask,
                          ...updates
                        });

                        // Aktualizace položek plánu na mapě
                        updatePlanItemsOnMap(foundPlan);
                      }
                    }
                  } catch (error) {
                    console.error('Chyba při aktualizaci úkolu:', error);
                  }
                }
              }}
              onNavigateToTask={(taskId) => {
                // Najdeme plán, který obsahuje úkol s daným ID
                const savedPlans = localStorage.getItem('plans');
                if (savedPlans) {
                  try {
                    let plans = JSON.parse(savedPlans);
                    let foundPlan = null;

                    // Hledání úkolu podle ID
                    for (const plan of plans) {
                      if (!plan.items || !Array.isArray(plan.items)) continue;

                      const taskExists = plan.items.some((item: { id: string }) => item.id === taskId);
                      if (taskExists) {
                        foundPlan = plan;
                        break;
                      }
                    }

                    if (foundPlan) {
                      // Najdeme index úkolu
                      const taskIndex = foundPlan.items.findIndex((item: any) => item.id === taskId);
                      if (taskIndex !== -1) {
                        // Nastavení aktivního indexu v plánu
                        foundPlan.activeItemIndex = taskIndex;

                        // Spuštění navigace podle plánu
                        handleStartPlanNavigation(foundPlan);
                      }
                    }
                  } catch (error) {
                    console.error('Chyba při navigaci k úkolu:', error);
                  }
                }
              }}
            />
          )}

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

      {showTestRunner && (
        <div className="test-runner-container">
          <div className="test-runner-overlay" onClick={() => setShowTestRunner(false)}></div>
          <div className="test-runner-modal">
            <TestRunner onClose={() => setShowTestRunner(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMapPage;
