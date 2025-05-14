import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './PlanningPanel.css';
import routingService from '../../services/RoutingService';
import geolocationService from '../../services/GeolocationService';
import geocodingService from '../../services/GeocodingService';
import taskLocationService from '../../services/TaskLocationService';
import userSettingsService, { HomeAddress } from '../../services/UserSettingsService';
import chatSessionService from '../../services/ChatSessionService';
import planStorageService from '../../services/PlanStorageService';
import { ChatSession } from '../../models/ChatSession';
import LocationSelector from '../Location/LocationSelector';
import AutoLocationAssigner from './AutoLocationAssigner';
import LocationAssignmentTester from './LocationAssignmentTester';
import MarqueeTitle from './MarqueeTitle';

// Implementace funkcí pro práci s úkoly a plány
// Kontroluje, zda plán obsahuje podúkoly
const hasPlanSubtasks = (plan: any): boolean => {
  if (!plan || !plan.items || !Array.isArray(plan.items) || plan.items.length <= 1) {
    return false;
  }
  // Plán má podúkoly, pokud má více než jednu položku
  return plan.items.length > 1;
};

// Importujeme funkci pro generování podúkolů z TaskUtils
import { generateRelevantSubtasks as generateSubtasksFromUtils } from '../../utils/TaskUtils';

// Funkce pro kopírování textu do schránky
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert(`ID úkolu zkopírováno do schránky: ${text}`);
    })
    .catch(err => {
      console.error('Chyba při kopírování do schránky:', err);
    });
};

export interface PlanItem {
  id: string;
  title: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  time?: string;
  completed: boolean;
  type: 'location' | 'task' | 'route' | 'note';
  route?: {
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
    geometry?: [number, number][]; // body trasy pro vykreslení
    distance?: number; // vzdálenost v metrech
    duration?: number; // čas v sekundách
  };
  // Přidané vlastnosti pro animace a stavy
  isNew?: boolean;
  isActive?: boolean;
  createdAt?: Date | string;
  planId?: string; // ID plánu, ke kterému úkol patří
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  items: PlanItem[];
  createdAt: Date;
  updatedAt: Date;
  activeItemIndex?: number; // Index aktivní položky pro krokové zobrazení
}

interface PlanningPanelProps {
  onSelectLocation: (location: { lat: number; lng: number; name?: string }) => void;
  onSelectRoute: (route: {
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  }) => void;
  onCreatePlanFromChat: (message: string, taskContext?: any) => any; // Upraveno pro podporu kontextu úkolu
  onStartPlanNavigation: (plan: Plan) => void; // Nová funkce pro spuštění navigace podle plánu
  onNavigateToNextStep: (plan: Plan, currentIndex: number) => void; // Nová funkce pro navigaci na další krok
  onNavigateToPrevStep: (plan: Plan, currentIndex: number) => void; // Nová funkce pro navigaci na předchozí krok
  visible: boolean;
  isNavigating: boolean; // Indikátor, zda probíhá navigace podle plánu
  currentNavigationPlan?: string; // ID aktuálně navigovaného plánu
}

const PlanningPanel: React.FC<PlanningPanelProps> = ({
  onSelectLocation,
  onSelectRoute,
  onCreatePlanFromChat,
  onStartPlanNavigation,
  onNavigateToNextStep,
  onNavigateToPrevStep,
  visible,
  isNavigating,
  currentNavigationPlan
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [newPlanTitle, setNewPlanTitle] = useState<string>('');
  const [showNewPlanForm, setShowNewPlanForm] = useState<boolean>(false);
  const [showAutoLocationAssigner, setShowAutoLocationAssigner] = useState<boolean>(false);
  const [showLocationAssignmentTester, setShowLocationAssignmentTester] = useState<boolean>(false);
  const [planChatSessions, setPlanChatSessions] = useState<{ [planId: string]: string[] }>({}); // Mapování plánů na chat sessions

  // Definice typů pro události
  interface CreatePlanFromChatEvent extends CustomEvent {
    detail: {
      query: string;
      source: string;
    };
  }

  interface MarkerPositionUpdatedEvent extends CustomEvent {
    detail: {
      originalMarker: { lat: number; lng: number };
      updatedMarker: { lat: number; lng: number };
    };
  }

  interface PlansUpdatedEvent extends CustomEvent {
    detail: {
      action: 'create' | 'update' | 'delete' | 'refresh';
      planId?: string;
      source?: string;
      setActive?: boolean;
    };
  }

  interface LocationRemovedFromTaskEvent extends CustomEvent {
    detail: {
      taskId: string;
      location: { lat: number; lng: number };
      forceRefresh?: boolean;
    };
  }

  // Funkce pro načtení plánů z localStorage
  const loadPlansFromStorage = () => {
    console.log('Načítám plány pomocí PlanStorageService');

    // Použití centralizované služby pro načtení plánů
    const loadedPlans = planStorageService.loadPlans();

    if (loadedPlans.length > 0) {
      console.log(`Načteno ${loadedPlans.length} plánů z PlanStorageService`);

      // Formátování plánů - převod řetězců na objekty Date
      const formattedPlans = loadedPlans.map((plan: any) => ({
        ...plan,
        createdAt: plan.createdAt ? new Date(plan.createdAt) : new Date(),
        updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : new Date(),
      }));

      console.log('Formátované plány:', formattedPlans);

      // Výpis všech načtených plánů pro debugging
      formattedPlans.forEach((plan, index) => {
        console.log(`Plán ${index + 1}/${formattedPlans.length}: ID=${plan.id}, Název=${plan.title}`);

        // Kontrola, zda plány mají podúkoly
        if (!hasPlanSubtasks(plan)) {
          console.warn(`Plán "${plan.title}" nemá podúkoly! Měl by být opraven při načítání v EnhancedMapPage.`);
        } else {
          console.log(`Plán "${plan.title}" obsahuje ${plan.items.length - 1} podúkolů.`);
        }
      });

      // Aktualizace stavu s novými plány - použijeme funkci, která nezávisí na aktuálním stavu
      setPlans(prevPlans => {
        console.log('Aktualizace stavu plánů - předchozí plány:',
          prevPlans.map(p => ({ id: p.id, title: p.title })));
        return [...formattedPlans];
      });

      // Pokud není aktivní plán nebo byl vytvořen nový plán, nastavíme nejnovější jako aktivní
      if (!activePlan || !formattedPlans.find((p: Plan) => p.id === activePlan.id)) {
        // Seřadíme plány podle data vytvoření (nejnovější první)
        const sortedPlans = [...formattedPlans].sort((a: Plan, b: Plan) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (sortedPlans.length > 0) {
          console.log('Nastavuji aktivní plán:', sortedPlans[0].title);
          setActivePlan(sortedPlans[0]);
        }
      }

      return formattedPlans;
    } else {
      console.log('Žádné plány nebyly načteny, používám ukázkový plán');

      // Ukázkový plán pro demonstraci
      const demoPlans: Plan[] = [
        {
          id: '1',
          title: 'Výlet do Prahy',
          description: 'Plán na víkendový výlet do Prahy',
          items: [
            {
              id: '1-1',
              title: 'Pražský hrad',
              description: 'Návštěva Pražského hradu a katedrály sv. Víta',
              location: { lat: 50.0911, lng: 14.4016, name: 'Pražský hrad' },
              time: '10:00',
              completed: false,
              type: 'location'
            },
            {
              id: '1-2',
              title: 'Oběd v restauraci',
              description: 'Oběd v restauraci U Fleků',
              location: { lat: 50.0819, lng: 14.4189, name: 'U Fleků' },
              time: '13:00',
              completed: false,
              type: 'location'
            },
            {
              id: '1-3',
              title: 'Karlův most',
              description: 'Procházka po Karlově mostě',
              location: { lat: 50.0865, lng: 14.4112, name: 'Karlův most' },
              time: '15:00',
              completed: false,
              type: 'location'
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Uložíme ukázkový plán do localStorage
      planStorageService.savePlans(demoPlans);

      setPlans(demoPlans);
      setActivePlan(demoPlans[0]);
      return demoPlans;
    }
  };

  // Načtení plánů při prvním renderování
  useEffect(() => {
    loadPlansFromStorage();

    // Načtení chat sessions pro každý plán
    const loadChatSessionsForPlans = () => {
      const chatHistory = chatSessionService.getChatHistory();
      const sessionsMap: { [planId: string]: string[] } = {};

      // Procházíme všechna sessions a hledáme plány
      chatHistory.sessions.forEach(session => {
        if (session.metadata?.planIds && session.metadata.planIds.length > 0) {
          // Pro každý plán v session přidáme session do mapy
          session.metadata.planIds.forEach(planId => {
            if (!sessionsMap[planId]) {
              sessionsMap[planId] = [];
            }
            if (!sessionsMap[planId].includes(session.id)) {
              sessionsMap[planId].push(session.id);
            }
          });
        }
      });

      setPlanChatSessions(sessionsMap);
    };

    loadChatSessionsForPlans();
  }, []);

  // Efekt pro poslouchání události aktualizace polohy markeru
  useEffect(() => {
    const handleMarkerPositionUpdated = (event: MarkerPositionUpdatedEvent) => {
      const { originalMarker, updatedMarker } = event.detail;

      // Najdeme všechna úkoly, které mají tuto lokaci
      if (activePlan) {
        let planUpdated = false;

        // Vytvoření kopie aktivního plánu
        const updatedPlan = { ...activePlan };

        // Aktualizace položek plánu
        updatedPlan.items = updatedPlan.items.map(item => {
          // Pokud je položka typu lokace a má stejné souřadnice jako původní marker
          if (item.type === 'location' && item.location &&
              Math.abs(item.location.lat - originalMarker.lat) < 0.0001 &&
              Math.abs(item.location.lng - originalMarker.lng) < 0.0001) {

            // Aktualizace lokace
            planUpdated = true;
            return {
              ...item,
              location: {
                ...item.location,
                lat: updatedMarker.lat,
                lng: updatedMarker.lng
              }
            };
          }

          // Pokud je položka typu trasa, zkontrolujeme počáteční a koncový bod
          if (item.type === 'route' && item.route) {
            let routeUpdated = false;
            const updatedRoute = { ...item.route };

            // Kontrola počátečního bodu
            if (updatedRoute.start &&
                Math.abs(updatedRoute.start.lat - originalMarker.lat) < 0.0001 &&
                Math.abs(updatedRoute.start.lng - originalMarker.lng) < 0.0001) {
              updatedRoute.start = {
                ...updatedRoute.start,
                lat: updatedMarker.lat,
                lng: updatedMarker.lng
              };
              routeUpdated = true;
            }

            // Kontrola koncového bodu
            if (updatedRoute.end &&
                Math.abs(updatedRoute.end.lat - originalMarker.lat) < 0.0001 &&
                Math.abs(updatedRoute.end.lng - originalMarker.lng) < 0.0001) {
              updatedRoute.end = {
                ...updatedRoute.end,
                lat: updatedMarker.lat,
                lng: updatedMarker.lng
              };
              routeUpdated = true;
            }

            // Kontrola waypointů
            if (updatedRoute.waypoints) {
              updatedRoute.waypoints = updatedRoute.waypoints.map(waypoint => {
                if (Math.abs(waypoint.lat - originalMarker.lat) < 0.0001 &&
                    Math.abs(waypoint.lng - originalMarker.lng) < 0.0001) {
                  routeUpdated = true;
                  return {
                    ...waypoint,
                    lat: updatedMarker.lat,
                    lng: updatedMarker.lng
                  };
                }
                return waypoint;
              });
            }

            // Pokud byla trasa aktualizována, vrátíme aktualizovanou položku
            if (routeUpdated) {
              planUpdated = true;
              return {
                ...item,
                route: updatedRoute
              };
            }
          }

          return item;
        });

        // Pokud byl plán aktualizován, aktualizujeme stav
        if (planUpdated) {
          // Aktualizace času poslední změny
          updatedPlan.updatedAt = new Date();

          // Aktualizace plánu v seznamu plánů
          const updatedPlans = plans.map(p =>
            p.id === updatedPlan.id ? updatedPlan : p
          );

          // Aktualizace stavů
          setPlans(updatedPlans);
          setActivePlan(updatedPlan);

          // Uložení aktualizovaných plánů do localStorage
          localStorage.setItem('plans', JSON.stringify(updatedPlans));

          // Zobrazení informace o aktualizaci
          console.log('Poloha markeru byla aktualizována v plánu:', updatedPlan.title);

          // Zobrazení elegantního ukazatele souřadnic
          const coordinatesDisplay = document.createElement('div');
          coordinatesDisplay.className = 'coordinates-display';
          coordinatesDisplay.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Poloha aktualizována: ${updatedMarker.lat.toFixed(6)}, ${updatedMarker.lng.toFixed(6)}</span>
          `;

          document.body.appendChild(coordinatesDisplay);

          // Animace ukazatele souřadnic
          setTimeout(() => {
            coordinatesDisplay.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(coordinatesDisplay);
            }, 500);
          }, 2000);
        }
      }
    };

    // Přidání posluchače události
    window.addEventListener('markerPositionUpdated', handleMarkerPositionUpdated as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('markerPositionUpdated', handleMarkerPositionUpdated as EventListener);
    };
  }, [activePlan, plans]);

  // Efekt pro poslouchání události aktualizace plánu
  useEffect(() => {
    // Funkce pro zpracování události aktualizace plánu
    const handlePlanUpdated = (event: CustomEvent) => {
      console.log('Zachycena událost planUpdated:', event.detail);
      const { planId, taskId, taskIndex } = event.detail;

      // Načtení aktuálních plánů
      const savedPlans = localStorage.getItem('plans');
      if (savedPlans) {
        try {
          const parsedPlans = JSON.parse(savedPlans);
          setPlans(parsedPlans);

          // Najdeme aktualizovaný plán
          const updatedPlan = parsedPlans.find((p: Plan) => p.id === planId);
          if (updatedPlan) {
            console.log('Nastavuji aktivní plán po události planUpdated:', updatedPlan.title);
            setActivePlan(updatedPlan);

            // Pokud máme index úkolu, nastavíme ho jako aktivní
            if (taskIndex !== undefined && updatedPlan.items[taskIndex]) {
              const item = updatedPlan.items[taskIndex];
              console.log('Nastavuji aktivní úkol po události planUpdated:', item.title);

              // Zobrazení položky na mapě
              if (item.type === 'location' && item.location) {
                console.log('Zobrazuji lokaci na mapě po události planUpdated:', item.location);
                onSelectLocation(item.location);
              } else if (item.type === 'route' && item.route) {
                console.log('Zobrazuji trasu na mapě po události planUpdated:', item.route);
                onSelectRoute(item.route);
              }
            }
          }
        } catch (error) {
          console.error('Chyba při zpracování události planUpdated:', error);
        }
      }
    };

    // Přidání posluchače události
    window.addEventListener('planUpdated', handlePlanUpdated as EventListener);

    // Odstranění posluchače při unmount
    return () => {
      window.removeEventListener('planUpdated', handlePlanUpdated as EventListener);
    };
  }, [onSelectLocation, onSelectRoute]);

  // Efekt pro poslouchání události odstranění lokace z úkolu
  useEffect(() => {
    // Funkce pro zpracování události odstranění lokace z úkolu
    const handleLocationRemovedFromTask = (event: LocationRemovedFromTaskEvent) => {
      const { taskId, location, forceRefresh } = event.detail;
      console.log('Zachycena událost locationRemovedFromTask:', { taskId, location, forceRefresh });

      if (!activePlan) return;

      // Najdeme úkol podle ID
      const taskIndex = activePlan.items.findIndex(item => item.id === taskId);
      if (taskIndex === -1) {
        console.error('Úkol nebyl nalezen:', taskId);
        return;
      }

      const task = activePlan.items[taskIndex];

      // Ověříme, zda úkol má lokaci a že se jedná o stejnou lokaci
      if (task.type !== 'location' || !task.location) {
        console.error('Úkol nemá lokaci:', task);
        return;
      }

      // Ověříme, zda se jedná o stejnou lokaci
      const isSameLocation =
        Math.abs(task.location.lat - location.lat) < 0.0001 &&
        Math.abs(task.location.lng - location.lng) < 0.0001;

      if (!isSameLocation) {
        console.error('Lokace úkolu neodpovídá odstraněné lokaci:', { taskLocation: task.location, removedLocation: location });
        return;
      }

      // Vytvoříme zcela nový objekt úkolu bez lokace
      // DŮLEŽITÉ: Nepoužíváme spread operátor, který by mohl zachovat referenci na původní objekt
      const updatedItem: PlanItem = {
        id: task.id,
        title: task.title,
        description: task.description,
        time: task.time,
        completed: task.completed,
        type: 'task'
        // Explicitně NEpřidáváme property location
      };

      console.log('Aktualizovaný úkol po odstranění lokace:', updatedItem);

      // Vytvoříme zcela nový objekt plánu
      const updatedPlan = {
        id: activePlan.id,
        title: activePlan.title,
        description: activePlan.description,
        createdAt: activePlan.createdAt instanceof Date ? activePlan.createdAt : new Date(activePlan.createdAt),
        updatedAt: new Date(),
        activeItemIndex: activePlan.activeItemIndex,
        items: activePlan.items.map((item, index) => {
          if (index === taskIndex) {
            // Pro úkol, který má být aktualizován, použijeme nový objekt bez lokace
            return updatedItem;
          }
          // Pro ostatní úkoly vytvoříme kopie
          return { ...item };
        })
      };

      console.log('Vytvořen nový objekt plánu:', updatedPlan);

      // Vytvoříme zcela nové pole plánů
      const updatedPlans = plans.map(p =>
        p.id === activePlan.id ? updatedPlan : p
      );

      console.log('Aktualizovaný plán po odstranění lokace:', updatedPlan);

      // Aktualizace stavu s novými objekty
      setPlans([...updatedPlans]);
      setActivePlan({...updatedPlan});

      // Uložení aktualizovaných plánů do localStorage
      // Důležité: musíme zajistit, že se location skutečně odstraní z JSON objektu
      // Vytvoříme zcela nové pole plánů s novými objekty
      const plansToSave = updatedPlans.map(p => {
        if (p.id === activePlan.id) {
          // Vytvoříme nový objekt plánu
          return {
            id: p.id,
            title: p.title,
            description: p.description,
            createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
            updatedAt: new Date().toISOString(),
            activeItemIndex: p.activeItemIndex,
            items: p.items.map(item => {
              if (item.id === taskId) {
                // Pro úkol, který má být aktualizován, vytvoříme nový objekt bez lokace
                return {
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  time: item.time,
                  completed: item.completed,
                  type: 'task'
                  // Explicitně NEpřidáváme property location
                };
              }
              // Pro ostatní úkoly vytvoříme kopie
              return { ...item };
            })
          };
        }
        // Pro ostatní plány vytvoříme kopie
        return {
          ...p,
          createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
          updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt
        };
      });

      // Uložíme plány do localStorage a vypíšeme je do konzole pro kontrolu
      console.log('Ukládám plány do localStorage:', plansToSave);
      localStorage.setItem('plans', JSON.stringify(plansToSave));

      // Vyvolání události pro aktualizaci UI
      const planUpdatedEvent = new CustomEvent('planUpdated', {
        detail: {
          planId: activePlan.id,
          taskId: taskId,
          taskIndex: taskIndex,
          action: 'locationRemoved' // Přidáme informaci o typu akce
        }
      });
      window.dispatchEvent(planUpdatedEvent);

      // Vyvoláme ještě jednu událost pro aktualizaci zobrazení úkolu
      // Použijeme delší timeout, aby se stihly zpracovat všechna změny
      setTimeout(() => {
        // Nejprve načteme aktuální plány z localStorage
        const savedPlans = localStorage.getItem('plans');
        if (savedPlans) {
          try {
            const parsedPlans = JSON.parse(savedPlans);

            // Aktualizujeme stav s novými plány
            setPlans([...parsedPlans]);

            // Najdeme aktualizovaný plán
            const refreshedPlan = parsedPlans.find((p: any) => p.id === activePlan.id);
            if (refreshedPlan) {
              console.log('Aktualizuji aktivní plán po timeoutu:', refreshedPlan.title);
              setActivePlan({...refreshedPlan});
            }

            // Vyvoláme událost pro aktualizaci UI
            const refreshEvent = new CustomEvent('refreshPlanDisplay', {
              detail: {
                planId: activePlan.id,
                taskId: taskId,
                action: 'forceRefresh'
              }
            });
            window.dispatchEvent(refreshEvent);
          } catch (error) {
            console.error('Chyba při zpracování plánů z localStorage:', error);
          }
        }
      }, 200);

      // Zobrazení potvrzení o odstranění lokace
      const coordinatesDisplay = document.createElement('div');
      coordinatesDisplay.className = 'coordinates-display';
      coordinatesDisplay.innerHTML = `
        <i class="fas fa-trash-alt"></i>
        <span>Lokace byla odstraněna z úkolu "${task.title}"</span>
      `;

      document.body.appendChild(coordinatesDisplay);

      // Animace ukazatele
      setTimeout(() => {
        coordinatesDisplay.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(coordinatesDisplay);
        }, 500);
      }, 2000);

      console.log(`Lokace byla úspěšně odstraněna z úkolu "${task.title}"`);
    };

    // Přidání posluchače události
    window.addEventListener('locationRemovedFromTask', handleLocationRemovedFromTask as EventListener);

    // Odstranění posluchače při unmount
    return () => {
      window.removeEventListener('locationRemovedFromTask', handleLocationRemovedFromTask as EventListener);
    };
  }, [activePlan, plans]);

  // Efekt pro poslouchání události aktualizace seznamu plánů - ODSTRANĚNO (duplicitní s efektem níže)

  // Efekt pro poslouchání události vytvoření plánu z chatu
  useEffect(() => {
    // Funkce pro zpracování události vytvoření plánu z chatu
    const handleCreatePlanFromChat = async (event: CreatePlanFromChatEvent) => {
      const { query, source } = event.detail;

      console.log(`Vytvářím plán z chatu: "${query}" (zdroj: ${source})`);

      // Vytvoření nového plánu s automatickým názvem odvozeným z dotazu
      const planTitle = query.length > 30
        ? `${query.substring(0, 30)}...`
        : query;

      // Vytvoření nového plánu
      const newPlanId = Date.now().toString();

      // Přidání hlavního úkolu do plánu
      const mainItem = {
        id: `${newPlanId}-0`,
        title: planTitle,
        description: `Hlavní úkol pro ${planTitle}`,
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      };

      // Generování relevantních podúkolů na základě názvu hlavního úkolu
      const subTasks = await generateSubtasksFromUtils(planTitle, newPlanId);
      console.log('Vygenerované podúkoly pro nový plán z chatu:', subTasks);

      const newPlan: Plan = {
        id: newPlanId,
        title: planTitle,
        items: [mainItem, ...subTasks],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Vytvořen nový plán z chatu s podúkoly:', newPlan);

      // Načtení aktuálních plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      let currentPlans = [];

      if (savedPlans) {
        try {
          currentPlans = JSON.parse(savedPlans);
        } catch (error) {
          console.error('Chyba při načítání plánů z localStorage:', error);
        }
      }

      // Přidání plánu do seznamu
      const updatedPlans = [...currentPlans, newPlan];

      // Aktualizace localStorage
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
      } catch (error) {
        console.error('Chyba při ukládání plánu do localStorage:', error);
      }

      // Aktualizace stavu - použijeme funkci, která nezávisí na aktuálním stavu
      setPlans(prevPlans => {
        console.log('Aktualizace stavu plánů po vytvoření nového plánu - předchozí plány:',
          prevPlans.map(p => ({ id: p.id, title: p.title })));
        return updatedPlans;
      });

      // Nastavení nového plánu jako aktivního
      setActivePlan(newPlan);
      console.log('Nastaven nový plán jako aktivní:', newPlan.title);

      // Vyvolání události pro aktualizaci UI
      const plansUpdatedEvent = new CustomEvent('plansUpdated', {
        detail: {
          action: 'create',
          planId: newPlanId,
          source: 'chat',
          setActive: true
        }
      });
      console.log('Vyvolávám událost plansUpdated s ID plánu:', newPlanId);
      window.dispatchEvent(plansUpdatedEvent);

      // Vyvoláme ještě jednu událost pro aktualizaci zobrazení plánu
      // Použijeme delší timeout, aby se stihly zpracovat všechna změny
      setTimeout(() => {
        console.log('Vyvolávám událost refreshPlanDisplay pro vynucení aktualizace UI');
        const refreshEvent = new CustomEvent('refreshPlanDisplay', {
          detail: {
            planId: newPlanId,
            action: 'forceRefresh'
          }
        });
        window.dispatchEvent(refreshEvent);
      }, 200);

      return `Plán "${planTitle}" byl vytvořen s ${newPlan.items.length} položkami.`;
    };

    // Přidání posluchače události
    window.addEventListener('createPlanFromChat', handleCreatePlanFromChat as unknown as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('createPlanFromChat', handleCreatePlanFromChat as unknown as EventListener);
    };
  }, []);

  // Efekt pro poslouchání události aktualizace seznamu plánů
  useEffect(() => {
    // Funkce pro zpracování události aktualizace seznamu plánů
    const handlePlansUpdated = (event: PlansUpdatedEvent) => {
      console.log('Zachycena událost plansUpdated:', event.detail);
      const { action, planId, source, setActive } = event.detail;

      // Uložení aktuálního aktivního plánu, abychom ho mohli obnovit po aktualizaci
      const currentActivePlan = activePlan ? {...activePlan} : null;
      console.log('Aktuální aktivní plán před aktualizací:', currentActivePlan?.title);

      // Načtení aktuálních plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (!savedPlans) {
        console.log('Žádné plány nebyly nalezeny v localStorage');
        return;
      }

      try {
        const parsedPlans = JSON.parse(savedPlans);

        // Výpis všech načtených plánů pro debugging
        console.log(`Načteno ${parsedPlans.length} plánů z localStorage v handlePlansUpdated:`);
        parsedPlans.forEach((plan: Plan, index: number) => {
          console.log(`Plán ${index + 1}/${parsedPlans.length}: ID=${plan.id}, Název=${plan.title}`);
        });

        // Formátování plánů - převod řetězců na objekty Date
        const formattedPlans = parsedPlans.map((plan: any) => ({
          ...plan,
          createdAt: plan.createdAt ? new Date(plan.createdAt) : new Date(),
          updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : new Date(),
        }));

        // Aktualizace stavu s novým polem plánů - použijeme funkci, která nezávisí na aktuálním stavu
        setPlans(prevPlans => {
          // Porovnání předchozích plánů s novými plány
          const prevIds = new Set(prevPlans.map(p => p.id));
          const newIds = new Set(formattedPlans.map((p: Plan) => p.id));

          // Kontrola, zda se plány změnily
          const plansAdded = formattedPlans.filter((p: Plan) => !prevIds.has(p.id));
          const plansRemoved = prevPlans.filter(p => !newIds.has(p.id));

          if (plansAdded.length > 0) {
            console.log('Přidány nové plány:', plansAdded.map((p: Plan) => ({ id: p.id, title: p.title })));
          }

          if (plansRemoved.length > 0) {
            console.log('Odstraněny plány:', plansRemoved.map(p => ({ id: p.id, title: p.title })));
          }

          // Vracíme nové pole plánů
          return [...formattedPlans];
        });

        // Prioritizace nastavení aktivního plánu
        // 1. Pokud je explicitně požadováno nastavení plánu jako aktivního (setActive=true)
        // 2. Pokud se jedná o vytvoření nového plánu z chatu
        // 3. Pokud se jedná o aktualizaci konkrétního plánu
        // 4. Pokud nemáme konkrétní ID plánu, ale zdroj je chat

        // Priorita 1: Explicitní požadavek na nastavení plánu jako aktivního
        if (setActive && planId) {
          const targetPlan = formattedPlans.find((p: Plan) => p.id === planId);
          if (targetPlan) {
            console.log('Explicitní požadavek na nastavení plánu jako aktivního:', targetPlan.title);
            setActivePlan({...targetPlan});

            // Vyvolání události pro aktualizaci UI
            setTimeout(() => {
              const refreshEvent = new CustomEvent('refreshPlanDisplay', {
                detail: {
                  planId: targetPlan.id,
                  action: 'forceRefresh'
                }
              });
              window.dispatchEvent(refreshEvent);
            }, 100);
          }
        }
        // Priorita 2: Vytvoření nového plánu z chatu
        else if (action === 'create' && source === 'chat' && planId) {
          const newPlan = formattedPlans.find((p: Plan) => p.id === planId);
          if (newPlan) {
            console.log('Přidán nový plán z chatu:', newPlan.title);
            setActivePlan({...newPlan});

            // Vyvolání události pro aktualizaci UI - toto pomůže synchronizovat stav mezi komponentami
            setTimeout(() => {
              const refreshEvent = new CustomEvent('refreshPlanDisplay', {
                detail: {
                  planId: newPlan.id,
                  action: 'forceRefresh'
                }
              });
              window.dispatchEvent(refreshEvent);
            }, 100);
          }
        }
        // Priorita 3: Aktualizace konkrétního plánu
        else if ((action === 'refresh' || action === 'update') && planId) {
          const targetPlan = formattedPlans.find((p: Plan) => p.id === planId);
          if (targetPlan) {
            console.log('Nastaven aktivní plán po aktualizaci:', targetPlan.title);
            setActivePlan({...targetPlan});
          }
        }
        // Priorita 4: Zdroj je chat, ale nemáme konkrétní ID plánu
        else if (source === 'chat' || action === 'create') {
          // Seřadíme plány podle data vytvoření (nejnovější první)
          const sortedPlans = [...formattedPlans].sort((a: Plan, b: Plan) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });

          if (sortedPlans.length > 0) {
            const newestPlan = sortedPlans[0];
            console.log('Nastaven nejnovější plán jako aktivní:', newestPlan.title);
            setActivePlan({...newestPlan});
          }
        }

        // Vyvoláme událost pro aktualizaci UI po zpracování všech změn
        setTimeout(() => {
          console.log('Vyvolávám událost refreshUI pro vynucení překreslení seznamu plánů');
          const refreshEvent = new CustomEvent('refreshUI', {
            detail: {
              component: 'planList',
              action: 'forceRefresh'
            }
          });
          window.dispatchEvent(refreshEvent);
        }, 200);
      } catch (error) {
        console.error('Chyba při zpracování události plansUpdated:', error);
      }
    };

    // Přidání posluchače události
    window.addEventListener('plansUpdated', handlePlansUpdated as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('plansUpdated', handlePlansUpdated as EventListener);
    };
  }, []);

  // Efekt pro poslouchání události aktualizace polohy uživatele
  useEffect(() => {
    // Funkce pro zpracování události aktualizace polohy uživatele
    const handleUserLocationUpdated = (event: CustomEvent) => {
      console.log('Zachycena událost userLocationUpdated');

      // Pokud nemáme aktivní plán, není co aktualizovat
      if (!activePlan) return;

      // Získání aktuální polohy uživatele z události
      const { location } = event.detail;

      // Najdeme prvé položku typu 'location' s názvem obsahujícím "Moje aktuální poloha"
      const locationItemIndex = activePlan.items.findIndex(item =>
        item.type === 'location' &&
        item.location &&
        item.title.includes('Moje aktuální poloha')
      );

      if (locationItemIndex !== -1) {
        // Aktualizace položky s aktuální polohou
        const updatedItems = [...activePlan.items];
        updatedItems[locationItemIndex] = {
          ...updatedItems[locationItemIndex],
          location: {
            ...location,
            name: 'Moje aktuální poloha (aktualizováno)'
          }
        };

        // Aktualizace aktivního plánu
        const updatedPlan = {
          ...activePlan,
          items: updatedItems,
          updatedAt: new Date()
        };

        // Aktualizace stavu
        setActivePlan(updatedPlan);

        // Aktualizace plánu v seznamu plánů
        const updatedPlans = plans.map(p =>
          p.id === activePlan.id ? updatedPlan : p
        );

        // Aktualizace stavu a localStorage
        setPlans(updatedPlans);
        localStorage.setItem('plans', JSON.stringify(updatedPlans));

        console.log('Aktualizována poloha uživatele v aktivním plánu');

        // Vyvolání události pro aktualizaci UI
        const planUpdatedEvent = new CustomEvent('planUpdated', {
          detail: {
            planId: activePlan.id,
            taskId: updatedItems[locationItemIndex].id,
            taskIndex: locationItemIndex
          }
        });
        window.dispatchEvent(planUpdatedEvent);
      }
    };

    // Přidání posluchače události
    window.addEventListener('userLocationUpdated', handleUserLocationUpdated as unknown as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('userLocationUpdated', handleUserLocationUpdated as unknown as EventListener);
    };
  }, [activePlan, plans]);

  // Uložení plánů při změně
  useEffect(() => {
    if (plans.length > 0) {
      console.log('Ukládám plány pomocí PlanStorageService po změně stavu plans');
      planStorageService.savePlans(plans);
    }
  }, [plans]);

  // Efekt pro poslouchání události refreshUI
  useEffect(() => {
    const handleRefreshUI = (event: CustomEvent) => {
      const { component, action } = event.detail;
      console.log('Zachycena událost refreshUI:', { component, action });

      if (component === 'planList' && action === 'forceRefresh') {
        // Načtení aktuálních plánů z localStorage
        const savedPlans = localStorage.getItem('plans');
        if (!savedPlans) {
          console.log('Žádné plány nebyly nalezeny v localStorage při refreshUI');
          return;
        }

        try {
          const parsedPlans = JSON.parse(savedPlans);

          // Výpis všech načtených plánů pro debugging
          console.log(`Načteno ${parsedPlans.length} plánů z localStorage v handleRefreshUI:`);
          parsedPlans.forEach((plan: Plan, index: number) => {
            console.log(`Plán ${index + 1}/${parsedPlans.length}: ID=${plan.id}, Název=${plan.title}`);
          });

          // Formátování plánů - převod řetězců na objekty Date
          const formattedPlans = parsedPlans.map((plan: any) => ({
            ...plan,
            createdAt: plan.createdAt ? new Date(plan.createdAt) : new Date(),
            updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : new Date(),
          }));

          // Aktualizace stavu s novým polem plánů
          setPlans([...formattedPlans]);

          console.log('Stav plánů byl aktualizován po události refreshUI');
        } catch (error) {
          console.error('Chyba při zpracování události refreshUI:', error);
        }
      }
    };

    // Přidání posluchače události
    window.addEventListener('refreshUI', handleRefreshUI as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('refreshUI', handleRefreshUI as EventListener);
    };
  }, []);

  // Efekt pro poslouchání události refreshPlanDisplay
  useEffect(() => {
    const handleRefreshPlanDisplay = (event: CustomEvent) => {
      const { planId, taskId, action } = event.detail;
      console.log('Zachycena událost refreshPlanDisplay:', { planId, taskId, action });

      // Načtení aktuálních plánů z localStorage
      const savedPlans = localStorage.getItem('plans');
      if (!savedPlans) {
        console.log('Žádné plány nebyly nalezeny v localStorage při refreshPlanDisplay');
        return;
      }

      try {
        const parsedPlans = JSON.parse(savedPlans);

        // Výpis všech načtených plánů pro debugging
        console.log(`Načteno ${parsedPlans.length} plánů z localStorage v handleRefreshPlanDisplay:`);
        parsedPlans.forEach((plan: Plan, index: number) => {
          console.log(`Plán ${index + 1}/${parsedPlans.length}: ID=${plan.id}, Název=${plan.title}`);
        });

        // Formátování plánů - převod řetězců na objekty Date
        const formattedPlans = parsedPlans.map((plan: any) => ({
          ...plan,
          createdAt: plan.createdAt ? new Date(plan.createdAt) : new Date(),
          updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : new Date(),
        }));

        // Aktualizace stavu s novým polem plánů - použijeme funkci, která nezávisí na aktuálním stavu
        setPlans(prevPlans => {
          // Porovnání předchozích plánů s novými plány
          const prevIds = new Set(prevPlans.map(p => p.id));
          const newIds = new Set(formattedPlans.map((p: Plan) => p.id));

          // Kontrola, zda se plány změnily
          const plansAdded = formattedPlans.filter((p: Plan) => !prevIds.has(p.id));
          const plansRemoved = prevPlans.filter(p => !newIds.has(p.id));

          if (plansAdded.length > 0) {
            console.log('Přidány nové plány při refreshPlanDisplay:', plansAdded.map((p: Plan) => ({ id: p.id, title: p.title })));
          }

          if (plansRemoved.length > 0) {
            console.log('Odstraněny plány při refreshPlanDisplay:', plansRemoved.map(p => ({ id: p.id, title: p.title })));
          }

          // Vracíme nové pole plánů
          return [...formattedPlans];
        });

        // Pokud máme ID plánu, aktualizujeme aktivní plán
        if (planId) {
          const refreshedPlan = formattedPlans.find((p: Plan) => p.id === planId);
          if (refreshedPlan) {
            console.log('Aktualizuji aktivní plán po události refreshPlanDisplay:', refreshedPlan.title);

            // Pokud se jedná o akci odstranění lokace, musíme zajistit, že se lokace skutečně odstraní
            if (action === 'forceRefresh' && taskId) {
              // Najdeme úkol podle ID
              const taskIndex = refreshedPlan.items.findIndex((item: PlanItem) => item.id === taskId);
              if (taskIndex !== -1) {
                // Vytvoříme kopii úkolu bez lokace
                const task = refreshedPlan.items[taskIndex];

                // Vytvoříme nový objekt úkolu bez lokace
                const updatedTask = {
                  id: task.id,
                  title: task.title,
                  description: task.description,
                  time: task.time,
                  completed: task.completed,
                  type: 'task'
                };

                // Aktualizujeme úkol v plánu
                refreshedPlan.items[taskIndex] = updatedTask;

                console.log('Vynucená aktualizace úkolu po odstranění lokace:', updatedTask);
              }
            }

            // Nastavíme aktivní plán
            setActivePlan({...refreshedPlan});

            // Pokud se jedná o akci odstranění lokace, uložíme aktualizovaný plán do localStorage
            if (action === 'forceRefresh') {
              localStorage.setItem('plans', JSON.stringify(formattedPlans));
            }
          } else {
            console.warn(`Plán s ID ${planId} nebyl nalezen při refreshPlanDisplay`);
          }
        } else {
          // Pokud nemáme ID plánu, ale máme plány, nastavíme nejnovější jako aktivní
          if (formattedPlans.length > 0) {
            // Seřadíme plány podle data vytvoření (nejnovější první)
            const sortedPlans = [...formattedPlans].sort((a: Plan, b: Plan) => {
              const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
              const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            });

            const newestPlan = sortedPlans[0];
            console.log('Nastaven nejnovější plán jako aktivní při refreshPlanDisplay:', newestPlan.title);
            setActivePlan({...newestPlan});
          }
        }

        // Vyvoláme událost pro aktualizaci UI po zpracování všech změn
        setTimeout(() => {
          console.log('Vyvolávám událost refreshUI pro vynucení překreslení seznamu plánů');
          const refreshEvent = new CustomEvent('refreshUI', {
            detail: {
              component: 'planList',
              action: 'forceRefresh'
            }
          });
          window.dispatchEvent(refreshEvent);
        }, 200);
      } catch (error) {
        console.error('Chyba při zpracování události refreshPlanDisplay:', error);
      }
    };

    // Přidání posluchače události
    window.addEventListener('refreshPlanDisplay', handleRefreshPlanDisplay as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('refreshPlanDisplay', handleRefreshPlanDisplay as EventListener);
    };
  }, []);

  // Vytvoření nového plánu s automatickým přidáním lokace
  const handleCreatePlan = async () => {
    // Pokud není zadán název plánu, použijeme výchozí název
    const planTitle = newPlanTitle.trim() || `Plán ${new Date().toLocaleDateString()}`;

    // Vytvoření nového plánu
    const newPlanId = Date.now().toString();
    const newPlan: Plan = {
      id: newPlanId,
      title: planTitle,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Přidání hlavního úkolu do plánu
    const mainItem = {
      id: `${newPlanId}-0`,
      title: planTitle,
      description: `Hlavní úkol pro ${planTitle}`,
      time: '',
      completed: false,
      type: 'task',
      createdAt: new Date()
    };

    // Generování relevantních podúkolů na základě názvu hlavního úkolu
    const subTasks = await generateSubtasksFromUtils(planTitle, newPlanId);
    console.log('Vygenerované podúkoly pro nový plán:', subTasks);

    // Přidání hlavního úkolu a podúkolů do plánu
    newPlan.items = [mainItem, ...subTasks];
    console.log('Vytvořen nový plán s podúkoly:', newPlan);

    // Přidání plánu do seznamu
    const updatedPlans = [...plans, newPlan];

    // Uložení do localStorage
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
    } catch (error) {
      console.error('Chyba při ukládání plánu do localStorage:', error);
    }

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po vytvoření nového plánu - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(newPlan);
    setNewPlanTitle('');
    setShowNewPlanForm(false);

    // Automatické přidání prvého úkolu s lokací
    try {
      // Vytvoření nového úkolu
      const newItemId = `${newPlanId}-1`;
      const newItem: PlanItem = {
        id: newItemId,
        title: "První úkol",
        description: "Automaticky vytvořený úkol s lokací",
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        type: 'location',
        completed: false
      };

      // Kontrola, zda existuje adresa bydliště
      const homeAddress = userSettingsService.getHomeAddress();

      // Pokud máme adresu bydliště, použijeme ji jako výchozí lokaci
      if (homeAddress) {
        console.log('Použití adresy bydliště jako výchozí lokace:', homeAddress);

        // Přidání lokace k úkolu
        newItem.location = {
          lat: homeAddress.lat,
          lng: homeAddress.lng,
          name: `Domov - ${homeAddress.displayName}`
        };

        // Aktualizace popisu úkolu
        newItem.description = `Automaticky vytvořený úkol s lokací domova: ${homeAddress.displayName}`;
      }

      // Vytvoření kontextu pro API volání
      const taskContext = {
        taskId: newItemId,
        planId: newPlanId,
        currentPlan: newPlan,
        taskTitle: newItem.title,
        taskDescription: newItem.description || ''
      };

      // Přidání úkolu do plánu
      const planWithItem = {
        ...newPlan,
        items: [...newPlan.items, newItem],
        updatedAt: new Date(),
        activeItemIndex: 0
      };

      // Aktualizace plánů
      const plansWithItem = updatedPlans.map(p =>
        p.id === newPlanId ? planWithItem : p
      );

      setPlans(plansWithItem);
      setActivePlan(planWithItem);

      // Pokud nemáme adresu bydliště, použijeme AI pro přidání lokace
      if (!homeAddress) {
        // Vytvoření dotazu pro AI pro přidání lokace
        const query = `Najdi přesnou lokaci pro plán "${newPlanTitle}" a úkol "${newItem.title}" s ID: ${newItemId}. Použij toto ID úkolu v odpovědi.`;

        // Získání odpovědi z API
        await onCreatePlanFromChat(query, taskContext);
      } else {
        // Pokud máme adresu bydliště, zobrazíme ji na mapě
        if (newItem.location) {
          onSelectLocation(newItem.location);
        }
      }

      // Aktualizace plánu po přidání lokace
      const updatedPlan = plansWithItem.find(p => p.id === newPlanId);
      if (updatedPlan) {
        setActivePlan(updatedPlan);
      }
    } catch (error) {
      console.error('Chyba při automatickém přidávání lokace:', error);
    }
  };

  // Přidání položky do plánu
  const handleAddItem = (planId: string, item: Omit<PlanItem, 'id'>) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        const newItem: PlanItem = {
          ...item,
          id: `${planId}-${plan.items.length + 1}`
        };
        return {
          ...plan,
          items: [...plan.items, newItem],
          updatedAt: new Date()
        };
      }
      return plan;
    });

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po přidání položky - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlans.find(p => p.id === planId) || null);
  };

  // Označení položky jako dokončené
  const handleToggleItemComplete = (planId: string, itemId: string) => {
    // Najdeme plán a aktuální index položky
    const currentPlan = plans.find(p => p.id === planId);
    if (!currentPlan) return;

    const currentItemIndex = currentPlan.items.findIndex(item => item.id === itemId);
    if (currentItemIndex === -1) return;

    // Zjistíme, zda se položka označuje jako dokončená nebo nedokončená
    const isBeingCompleted = !currentPlan.items[currentItemIndex].completed;

    // Aktualizujeme plány
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          items: plan.items.map(item => {
            if (item.id === itemId) {
              return { ...item, completed: !item.completed };
            }
            return item;
          }),
          updatedAt: new Date()
        };
      }
      return plan;
    });

    // Najdeme aktualizovaný plán
    const updatedPlan = updatedPlans.find(p => p.id === planId);
    if (!updatedPlan) {
      setPlans(updatedPlans);
      return;
    }

    // Pokud se položka označila jako dokončená, přepneme na další položku
    if (isBeingCompleted) {
      // Najdeme další nedokončenou položku
      let nextItemIndex = -1;

      // Nejprve zkusíme najít další nedokončenou položku po aktuální
      for (let i = currentItemIndex + 1; i < updatedPlan.items.length; i++) {
        if (!updatedPlan.items[i].completed) {
          nextItemIndex = i;
          break;
        }
      }

      // Pokud jsme nenašli další nedokončenou položku, zkontrolujeme, zda jsou všechna položky dokončené
      const allItemsCompleted = updatedPlan.items.every(item => item.completed);

      if (nextItemIndex !== -1) {
        // Máme další nedokončenou položku, přepneme na ni
        const nextItem = updatedPlan.items[nextItemIndex];

        // Aktualizujeme plán s novým aktivním indexem
        const planWithActiveItem = {
          ...updatedPlan,
          activeItemIndex: nextItemIndex
        };

        // Aktualizujeme plány
        const plansWithActiveItem = updatedPlans.map(p =>
          p.id === planId ? planWithActiveItem : p
        );

        setPlans(plansWithActiveItem);
        setActivePlan(planWithActiveItem);

        // Zobrazíme položku na mapě
        if (nextItem.type === 'location' && nextItem.location) {
          console.log('Přepínám na další nedokončenou položku s lokací:', nextItem.location);
          onSelectLocation(nextItem.location);
        } else if (nextItem.type === 'route' && nextItem.route) {
          console.log('Přepínám na další nedokončenou položku s trasou:', nextItem.route);
          onSelectRoute(nextItem.route);
        }
      } else if (allItemsCompleted) {
        // Všechna položky jsou dokončené, zobrazíme oznámení
        alert('Všechny úkoly v tomto plánu jsou dokončené! 🎉');

        // Zkontrolujeme, zda existují další plány s nedokončenými úkoly
        const otherPlansWithIncompleteTasks = updatedPlans.filter(p =>
          p.id !== planId && p.items.some(item => !item.completed)
        );

        if (otherPlansWithIncompleteTasks.length > 0) {
          // Nabídneme přepnutí na další plán s nedokončenými úkoly
          const nextPlan = otherPlansWithIncompleteTasks[0];
          const confirmSwitch = window.confirm(
            `Všechny úkoly v plánu "${updatedPlan.title}" jsou dokončené. Chcete přepnout na plán "${nextPlan.title}", který obsahuje nedokončené úkoly?`
          );

          if (confirmSwitch) {
            // Najdeme prvé nedokončený úkol v dalším plánu
            const firstIncompleteItemIndex = nextPlan.items.findIndex(item => !item.completed);

            if (firstIncompleteItemIndex !== -1) {
              const firstIncompleteItem = nextPlan.items[firstIncompleteItemIndex];

              // Aktualizace plánu s novým aktivním indexem
              const nextPlanWithActiveItem = {
                ...nextPlan,
                activeItemIndex: firstIncompleteItemIndex
              };

              // Aktualizace plánu v seznamu plánů
              const plansWithActiveItem = updatedPlans.map(p =>
                p.id === nextPlan.id ? nextPlanWithActiveItem : p
              );

              setPlans(plansWithActiveItem);
              setActivePlan(nextPlanWithActiveItem);

              // Zobrazíme položku na mapě
              if (firstIncompleteItem.type === 'location' && firstIncompleteItem.location) {
                console.log('Přepínám na prvé nedokončenou položku v dalším plánu s lokací:', firstIncompleteItem.location);
                onSelectLocation(firstIncompleteItem.location);
              } else if (firstIncompleteItem.type === 'route' && firstIncompleteItem.route) {
                console.log('Přepínám na prvé nedokončenou položku v dalším plánu s trasou:', firstIncompleteItem.route);
                onSelectRoute(firstIncompleteItem.route);
              }
            }
          }
        }
      } else {
        // Nenašli jsme další nedokončenou položku, ale některá položky jsou stále nedokončené
        // Aktualizujeme plány bez změny aktivního indexu
        setPlans(updatedPlans);
        setActivePlan(updatedPlan);
      }
    } else {
      // Položka byla označena jako nedokončená, pouze aktualizujeme plány
      setPlans(updatedPlans);
      setActivePlan(updatedPlan);
    }
  };

  // Odstranění položky z plánu
  const handleRemoveItem = (planId: string, itemId: string) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          items: plan.items.filter(item => item.id !== itemId),
          updatedAt: new Date()
        };
      }
      return plan;
    });

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po odstranění položky - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlans.find(p => p.id === planId) || null);
  };

  // Odstranění plánu
  const handleRemovePlan = (planId: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po odstranění plánu - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });

    if (activePlan?.id === planId) {
      setActivePlan(updatedPlans.length > 0 ? updatedPlans[0] : null);
    }

    // Uložení aktualizovaných plánů pomocí PlanStorageService
    planStorageService.savePlans(updatedPlans);
  };

  // Odstranění všech plánů
  const handleRemoveAllPlans = () => {
    console.log('Požadavek na odstranění všech plánů');

    // Potvrzovací dialog bez zavádějícího varování o nutnosti obnovit stránku
    if (window.confirm('Opravdu chcete odstranit VŠECHNY plány? Tato akce je nevratná!')) {
      console.log('Odstraňuji všechna plány pomocí PlanStorageService...');

      try {
        // Použití centralizované služby pro odstranění všech plánů
        // Nastavíme permanent na false, abychom umožnili vytváření nových plánů bez nutnosti obnovit stránku
        const success = planStorageService.removeAllPlans(false);

        if (!success) {
          console.error('Plány se nepodařilo odstranit!');
          alert('Nepodařilo se odstranit plány. Zkuste to prosím znovu.');
          return;
        }

        // Okamžitá aktualizace stavu aplikace
        setPlans([]);
        setActivePlan(null);

        // Explicitně resetujeme příznak trvalého odstranění plánů, aby bylo možné vytvářet nové plány okamžitě
        planStorageService.resetPlansRemovedFlag();

        // Vyvolání události pro informování ostatních komponent
        const plansRemovedEvent = new CustomEvent('plansRemoved', {
          detail: {
            action: 'removeAll',
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(plansRemovedEvent);

        // Zobrazení potvrzení o úspěšném odstranění
        const successMessage = document.createElement('div');
        successMessage.className = 'coordinates-display';
        successMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>Všechna plány byly úspěšně odstraněny</span>
        `;

        document.body.appendChild(successMessage);

        // Animace potvrzovací zprávy
        setTimeout(() => {
          successMessage.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(successMessage);
          }, 500);
        }, 2000);

        console.log('Všechna plány byly úspěšně odstraněny');
      } catch (error) {
        console.error('Chyba při odstraňování plánů:', error);
        alert('Při odstraňování plánů došlo k chybě: ' + (error instanceof Error ? error.message : 'Neznámá chyba'));
      }
    } else {
      console.log('Odstranění všech plánů bylo zrušeno uživatelem');
    }
  };

  // Výběr položky na mapě
  const handleSelectItem = (item: PlanItem, planId: string, itemIndex: number) => {
    // Nastavení aktivního úkolu v plánu
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          activeItemIndex: itemIndex
        };
      }
      return plan;
    });

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po výběru položky - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlans.find(p => p.id === planId) || null);

    // Zobrazení položky na mapě s vylepšeným zaměřením
    if (item.type === 'location' && item.location) {
      console.log('Zobrazuji lokaci na mapě po výběru položky:', item.location);

      // Vytvoření události pro animované zaměření na lokaci
      const focusEvent = new CustomEvent('focusOnLocation', {
        detail: {
          location: item.location,
          zoom: 16, // Vyšší zoom pro lepší detail
          animate: true, // Animace přechodu
          duration: 1.5, // Délka animace v sekundách
          taskId: item.id, // ID úkolu pro případné další zpracování
          taskTitle: item.title // Název úkolu pro zobrazení
        }
      });

      // Vyvolání události pro zaměření na lokaci
      window.dispatchEvent(focusEvent);

      // Standardní volání pro kompatibilitu
      onSelectLocation(item.location);
    } else if (item.type === 'route' && item.route) {
      console.log('Zobrazuji trasu na mapě po výběru položky:', item.route);

      // Vytvoření události pro animované zaměření na trasu
      const focusEvent = new CustomEvent('focusOnRoute', {
        detail: {
          route: item.route,
          animate: true, // Animace přechodu
          duration: 1.5, // Délka animace v sekundách
          taskId: item.id, // ID úkolu pro případné další zpracování
          taskTitle: item.title // Název úkolu pro zobrazení
        }
      });

      // Vyvolání události pro zaměření na trasu
      window.dispatchEvent(focusEvent);

      // Standardní volání pro kompatibilitu
      onSelectRoute(item.route);
    } else {
      console.log('Položka nemá lokaci ani trasu:', item);
    }

    // Vyvolání události pro aktualizaci UI
    const planUpdatedEvent = new CustomEvent('planUpdated', {
      detail: {
        planId: planId,
        taskId: item.id,
        taskIndex: itemIndex
      }
    });
    window.dispatchEvent(planUpdatedEvent);

    // Detaily úkolu se již nezobrazují
    // Původní kód:
    // if (!isNavigating || currentNavigationPlan !== planId) {
    //   setSelectedTask({ item, planId });
    // }
  };

  // Spuštění navigace podle plánu - bez zobrazení detailů úkolu
  const handleStartNavigation = (plan: Plan) => {
    // Nastavení indexu aktivní položky na 0 (první položka)
    const updatedPlan = {
      ...plan,
      activeItemIndex: 0
    };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po spuštění navigace - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlan);

    // Zobrazení prvého úkolu na mapě bez zobrazení detailů
    if (updatedPlan.items.length > 0) {
      const firstItem = updatedPlan.items[0];

      // Zobrazení prvého úkolu na mapě
      if (firstItem.type === 'location' && firstItem.location) {
        console.log('Zobrazuji lokaci na mapě po spuštění navigace:', firstItem.location);

        // Vytvoření události pro animované zaměření na lokaci
        const focusEvent = new CustomEvent('focusOnLocation', {
          detail: {
            location: firstItem.location,
            zoom: 16, // Vyšší zoom pro lepší detail
            animate: true, // Animace přechodu
            duration: 1.5, // Délka animace v sekundách
            taskId: firstItem.id, // ID úkolu pro případné další zpracování
            taskTitle: firstItem.title // Název úkolu pro zobrazení
          }
        });

        // Vyvolání události pro zaměření na lokaci
        window.dispatchEvent(focusEvent);

        // Standardní volání pro kompatibilitu
        onSelectLocation(firstItem.location);
      } else if (firstItem.type === 'route' && firstItem.route) {
        console.log('Zobrazuji trasu na mapě po spuštění navigace:', firstItem.route);

        // Vytvoření události pro animované zaměření na trasu
        const focusEvent = new CustomEvent('focusOnRoute', {
          detail: {
            route: firstItem.route,
            animate: true, // Animace přechodu
            duration: 1.5, // Délka animace v sekundách
            taskId: firstItem.id, // ID úkolu pro případné další zpracování
            taskTitle: firstItem.title // Název úkolu pro zobrazení
          }
        });

        // Vyvolání události pro zaměření na trasu
        window.dispatchEvent(focusEvent);

        // Standardní volání pro kompatibilitu
        onSelectRoute(firstItem.route);
      }
    }

    // Spuštění navigace
    onStartPlanNavigation(updatedPlan);
  };

  // Navigace na další krok
  const handleNextStep = (plan: Plan) => {
    if (plan.activeItemIndex === undefined || plan.items.length === 0) return;

    // Výpočet indexu další položky
    const nextIndex = Math.min(plan.activeItemIndex + 1, plan.items.length - 1);

    console.log(`Navigace na další krok: z indexu ${plan.activeItemIndex} na index ${nextIndex}`);

    // Kontrola, zda se skutečně posouváme na další položku
    if (nextIndex === plan.activeItemIndex) {
      console.log('Již jsme na poslední položce plánu');
      return;
    }

    // Aktualizace plánu
    const updatedPlan = {
      ...plan,
      activeItemIndex: nextIndex
    };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    // Uložení aktualizovaných plánů do localStorage
    localStorage.setItem('plans', JSON.stringify(updatedPlans));

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po navigaci na další krok - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlan);

    // Zobrazení další položky na mapě
    const nextItem = updatedPlan.items[nextIndex];
    console.log('Navigace na další krok, zobrazuji položku:', nextItem);
    handleSelectItem(nextItem, updatedPlan.id, nextIndex);

    // Vyvolání události pro aktualizaci UI
    const planUpdatedEvent = new CustomEvent('planUpdated', {
      detail: {
        planId: updatedPlan.id,
        taskId: nextItem.id,
        taskIndex: nextIndex
      }
    });
    window.dispatchEvent(planUpdatedEvent);

    // Volání funkce pro navigaci na další krok
    onNavigateToNextStep(updatedPlan, nextIndex);
  };

  // Navigace na předchozí krok
  const handlePrevStep = (plan: Plan) => {
    if (plan.activeItemIndex === undefined || plan.items.length === 0) return;

    // Výpočet indexu předchozí položky
    const prevIndex = Math.max(plan.activeItemIndex - 1, 0);

    console.log(`Navigace na předchozí krok: z indexu ${plan.activeItemIndex} na index ${prevIndex}`);

    // Kontrola, zda se skutečně posouváme na předchozí položku
    if (prevIndex === plan.activeItemIndex) {
      console.log('Již jsme na prvé položce plánu');
      return;
    }

    // Aktualizace plánu
    const updatedPlan = {
      ...plan,
      activeItemIndex: prevIndex
    };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    // Uložení aktualizovaných plánů do localStorage
    localStorage.setItem('plans', JSON.stringify(updatedPlans));

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po navigaci na předchozí krok - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlan);

    // Zobrazení předchozí položky na mapě
    const prevItem = updatedPlan.items[prevIndex];
    console.log('Navigace na předchozí krok, zobrazuji položku:', prevItem);
    handleSelectItem(prevItem, updatedPlan.id, prevIndex);

    // Vyvolání události pro aktualizaci UI
    const planUpdatedEvent = new CustomEvent('planUpdated', {
      detail: {
        planId: updatedPlan.id,
        taskId: prevItem.id,
        taskIndex: prevIndex
      }
    });
    window.dispatchEvent(planUpdatedEvent);

    // Volání funkce pro navigaci na předchozí krok
    onNavigateToPrevStep(updatedPlan, prevIndex);
  };

  // Ukončení navigace
  const handleStopNavigation = (plan: Plan) => {
    console.log('Ukončuji navigaci pro plán:', plan.title);

    // Aktualizace plánu
    const updatedPlan = {
      ...plan,
      activeItemIndex: undefined
    };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    // Uložení aktualizovaných plánů do localStorage
    localStorage.setItem('plans', JSON.stringify(updatedPlans));

    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po ukončení navigace - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlan);

    // Vyvolání události pro aktualizaci UI
    const planUpdatedEvent = new CustomEvent('planUpdated', {
      detail: {
        planId: updatedPlan.id,
        action: 'stopNavigation'
      }
    });
    window.dispatchEvent(planUpdatedEvent);

    // Volání funkce pro ukončení navigace - předáváme plán s undefined activeItemIndex
    // což signalizuje EnhancedMapPage, že má ukončit navigaci
    onStartPlanNavigation(updatedPlan);
  };

  // Funkce pro vytvoření plánu z chatu byla přesunuta do pravého chatu

  // Přidání nové položky do plánu
  const handleAddNewItem = (planId: string) => {
    if (!activePlan) return;

    // Vytvoření nové položky
    const newItem: Omit<PlanItem, 'id'> = {
      title: 'Nový úkol',
      description: 'Popis úkolu',
      time: '12:00',
      completed: false,
      type: 'task'
    };

    handleAddItem(planId, newItem);
  };

  // Stav pro zobrazení modálního okna pro výběr lokace
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [currentTaskForLocation, setCurrentTaskForLocation] = useState<{
    taskId: string;
    taskTitle: string;
    initialQuery?: string;
  } | null>(null);

  // Funkce pro přidání lokace k úkolu pomocí AI
  const handleAddLocationToTask = (taskId: string) => {
    if (!activePlan) {
      alert('Není vybrán žádný aktivní plán');
      return;
    }

    // Získání úkolu podle ID
    const task = activePlan.items.find(item => item.id === taskId);
    if (!task) {
      console.error('Úkol nebyl nalezen:', taskId);
      alert(`Úkol s ID ${taskId} nebyl nalezen`);
      return;
    }

    // Zobrazení informace o probíhající akci
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'coordinates-display';
    loadingMessage.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      <span>Připravuji vyhledávání lokace pro úkol "${task.title}"...</span>
    `;
    document.body.appendChild(loadingMessage);

    // Odstranění zprávy po 2 sekundách
    setTimeout(() => {
      document.body.removeChild(loadingMessage);

      // Otevření modálního okna pro výběr lokace
      setCurrentTaskForLocation({
        taskId,
        taskTitle: task.title,
        initialQuery: task.title // Použijeme název úkolu jako výchozí dotaz
      });
      setShowLocationSelector(true);
    }, 1000);
  };

  // Funkce pro zpracování vybrané lokace
  const handleLocationSelected = (location: { lat: number; lng: number; name: string }) => {
    if (!currentTaskForLocation || !activePlan) return;

    const { taskId } = currentTaskForLocation;

    // Získání úkolu podle ID
    const task = activePlan.items.find(item => item.id === taskId);
    if (!task) {
      console.error('Úkol nebyl nalezen:', taskId);
      setShowLocationSelector(false);
      setCurrentTaskForLocation(null);
      return;
    }

    // Zobrazení informace o přidávání lokace
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'coordinates-display';
    loadingMessage.innerHTML = `
      <i class="fas fa-map-marker-alt"></i>
      <span>Přidávám lokaci "${location.name}" k úkolu "${task.title}"...</span>
    `;

    document.body.appendChild(loadingMessage);

    // Změna typu úkolu na lokaci
    const updatedItem = {
      ...task,
      type: 'location' as const,
      location: {
        lat: location.lat,
        lng: location.lng,
        name: location.name
      }
    };

    // Aktualizace úkolu v plánu
    const updatedPlan = {
      ...activePlan,
      items: activePlan.items.map(item =>
        item.id === taskId ? updatedItem : item
      ),
      updatedAt: new Date()
    };

    // Odstranění zprávy po 2 sekundách
    setTimeout(() => {
      document.body.removeChild(loadingMessage);
    }, 2000);

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === activePlan.id ? updatedPlan : p
    );

    // Aktualizace stavu
    setPlans(prevPlans => {
      console.log('Aktualizace stavu plánů po přidání lokace - předchozí plány:',
        prevPlans.map(p => ({ id: p.id, title: p.title })));
      return updatedPlans;
    });
    setActivePlan(updatedPlan);

    // Uložení aktualizovaných plánů do localStorage
    localStorage.setItem('plans', JSON.stringify(updatedPlans));

    // Nastavení aktivního indexu na tento úkol
    const itemIndex = updatedPlan.items.findIndex(item => item.id === taskId);
    if (itemIndex !== -1) {
      // Aktualizace plánu s aktivním indexem
      const planWithActiveItem = {
        ...updatedPlan,
        activeItemIndex: itemIndex
      };

      // Aktualizace plánu v seznamu plánů
      const plansWithActiveItem = updatedPlans.map(p =>
        p.id === activePlan.id ? planWithActiveItem : p
      );

      setPlans(prevPlans => {
        console.log('Aktualizace stavu plánů po nastavení aktivního indexu - předchozí plány:',
          prevPlans.map(p => ({ id: p.id, title: p.title })));
        return plansWithActiveItem;
      });
      setActivePlan(planWithActiveItem);

      // Uložení aktualizovaných plánů do localStorage
      localStorage.setItem('plans', JSON.stringify(plansWithActiveItem));

      // Vyvolání události pro zaměření na lokaci
      const focusEvent = new CustomEvent('focusOnLocation', {
        detail: {
          location: {
            lat: location.lat,
            lng: location.lng,
            name: location.name
          },
          zoom: 16,
          animate: true,
          duration: 1.5
        }
      });
      window.dispatchEvent(focusEvent);

      // Vyvolání události pro aktualizaci UI
      const planUpdatedEvent = new CustomEvent('planUpdated', {
        detail: {
          planId: activePlan.id,
          taskId: taskId,
          taskIndex: itemIndex
        }
      });
      window.dispatchEvent(planUpdatedEvent);

      // Zobrazení potvrzení
      console.log(`Lokace "${location.name}" byla úspěšně přidána k úkolu "${task.title}"`);
    }

    // Zavření modálního okna
    setShowLocationSelector(false);
    setCurrentTaskForLocation(null);
  };

  // Funkce pro zrušení výběru lokace
  const handleLocationSelectionCancel = () => {
    setShowLocationSelector(false);
    setCurrentTaskForLocation(null);
  };

  // Přidání lokace k úkolu s aktuální polohou uživatele
  const handleAddLocationToItem = async (planId: string, itemId: string) => {
    // Získání aktuálního plánu
    const currentPlan = plans.find(p => p.id === planId);
    if (!currentPlan) return;

    // Získání aktuálního úkolu
    const currentItem = currentPlan.items.find(item => item.id === itemId);
    if (!currentItem) return;

    try {
      // Zobrazení zprávy o získávání polohy
      alert('Získávám vaši aktuální polohu...');

      // Získání aktuální polohy uživatele
      const position = await geolocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Získání informací o místě pomocí reverzního geocodingu
      const locationInfo = await geocodingService.reverseGeocode(latitude, longitude);

      // Vytvoření objektu lokace
      const userLocation = {
        lat: latitude,
        lng: longitude,
        name: locationInfo.name || 'Moje aktuální poloha'
      };

      // Předání lokace do funkce pro zpracování vybrané lokace
      handleLocationSelected(userLocation);

    } catch (error) {
      console.error('Chyba při získávání polohy:', error);
      alert('Nepodařilo se získat vaši polohu. Zkontrolujte, zda máte povolené sdílení polohy.');

      // Pokud se nepodařilo získat polohu, otevřeme modální okno pro výběr lokace
      setCurrentTaskForLocation({
        taskId: itemId,
        taskTitle: currentItem.title
      });
      setShowLocationSelector(true);
    }

    /* Původní implementace níže je nyní nepoužívaná
    if (useCurrentLocation) {
      // Použijeme aktuální polohu uživatele
      try {
        // Import geolocationService
        const geolocationService = (await import('../../services/GeolocationService')).default;

        // Získání aktuální polohy uživatele
        const position = await geolocationService.getCurrentPosition();
        userLocation = geolocationService.positionToLocation(position, 'Moje aktuální poloha');
        locationName = 'Moje aktuální poloha';
        console.log('Získána aktuální poloha uživatele:', userLocation);
      } catch (error) {
        console.error('Nepodařilo se získat polohu uživatele:', error);
        alert('Nepodařilo se získat vaši aktuální polohu. Zadejte prosím lokaci ručně.');

        // Pokud se nepodařilo získat polohu, necháme uživatele zadat lokaci ručně
        locationName = prompt('Zadejte název místa nebo popište lokaci pro AI:') || '';
        if (!locationName) return;
      }
    } else {
      // Otevření dialogu pro zadání lokace
      locationName = prompt('Zadejte název místa nebo popište lokaci pro AI:') || '';
      if (!locationName) return;
    }

    // Získání aktuálního plánu
    const currentPlan = plans.find(p => p.id === planId);
    if (!currentPlan) return;

    // Získání aktuálního úkolu
    const currentItem = currentPlan.items.find(item => item.id === itemId);
    if (!currentItem) return;

    try {
      // Změna typu úkolu na lokaci
      const updatedItem = {
        ...currentItem,
        type: 'location' as const
      };

      // Pokud máme aktuální polohu uživatele, přidáme ji rovnou k úkolu
      if (userLocation) {
        updatedItem.location = userLocation;
      }

      // Aktualizace úkolu v plánu
      const planWithUpdatedItem = {
        ...currentPlan,
        items: currentPlan.items.map(item =>
          item.id === itemId ? updatedItem : item
        ),
        updatedAt: new Date()
      };

      // Aktualizace plánu v seznamu plánů
      const updatedPlans = plans.map(p =>
        p.id === planId ? planWithUpdatedItem : p
      );

      setPlans(updatedPlans);
      setActivePlan(planWithUpdatedItem);

      // Pokud máme aktuální polohu uživatele, zobrazíme ji na mapě
      if (userLocation) {
        // Nastavení aktivního indexu na tento úkol
        const itemIndex = planWithUpdatedItem.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          // Aktualizace plánu s aktivním indexem
          const planWithActiveItem = {
            ...planWithUpdatedItem,
            activeItemIndex: itemIndex
          };

          // Aktualizace plánu v seznamu plánů
          const plansWithActiveItem = updatedPlans.map(p =>
            p.id === planId ? planWithActiveItem : p
          );

          setPlans(plansWithActiveItem);
          setActivePlan(planWithActiveItem);

          // Uložení aktualizovaných plánů do localStorage
          localStorage.setItem('plans', JSON.stringify(plansWithActiveItem));
        }

        // Zobrazení lokace na mapě s animací
        console.log('Zobrazuji aktuální polohu uživatele na mapě:', userLocation);

        // Vytvoření události pro animované zaměření na lokaci
        const focusEvent = new CustomEvent('focusOnLocation', {
          detail: {
            location: userLocation,
            zoom: 16, // Vyšší zoom pro lepší detail
            animate: true, // Animace přechodu
            duration: 1.5, // Délka animace v sekundách
            taskId: itemId, // ID úkolu pro případné další zpracování
            taskTitle: updatedItem.title // Název úkolu pro zobrazení
          }
        });

        // Vyvolání události pro zaměření na lokaci
        window.dispatchEvent(focusEvent);

        // Standardní volání pro kompatibilitu
        onSelectLocation(userLocation);

        // Zobrazení potvrzení
        alert(`Vaše aktuální poloha byla úspěšně přidána k úkolu a zobrazena na mapě.`);

        // Vrátíme se, protože už máme lokaci
        return;
      }

      // Vytvoření kontextu pro API volání
      const taskContext = {
        taskId: itemId,
        planId: planId,
        currentPlan: planWithUpdatedItem,
        taskTitle: updatedItem.title,
        taskDescription: updatedItem.description || ''
      };

      // Vytvoření dotazu pro AI
      const query = `Najdi přesnou lokaci "${locationName}" pro úkol "${updatedItem.title}" s ID: ${itemId}. Použij toto ID úkolu v odpovědi. Vrať přesné souřadnice.`;

      // Zobrazení zprávy o zpracování
      alert(`Hledám lokaci pro "${locationName}". Prosím, počkejte...`);

      // Získání odpovědi z API
      const response = await onCreatePlanFromChat(query, taskContext);

      // Zpracování odpovědi
      if (response && typeof response === 'string') {
        // Pokud byla lokace úspěšně přidána, zobrazíme ji na mapě
        const finalPlan = plans.find(p => p.id === planId);
        if (finalPlan) {
          const finalItem = finalPlan.items.find(item => item.id === itemId);
          if (finalItem && finalItem.location) {
            // Nastavení aktivního indexu na tento úkol
            const itemIndex = finalPlan.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
              // Aktualizace plánu s aktivním indexem
              const planWithActiveItem = {
                ...finalPlan,
                activeItemIndex: itemIndex
              };

              // Aktualizace plánu v seznamu plánů
              const plansWithActiveItem = updatedPlans.map(p =>
                p.id === planId ? planWithActiveItem : p
              );

              setPlans(plansWithActiveItem);
              setActivePlan(planWithActiveItem);
            }

            // Zobrazení lokace na mapě s animací
            console.log('Zobrazuji lokaci na mapě po přidání:', finalItem.location);

            // Vytvoření události pro animované zaměření na lokaci
            const focusEvent = new CustomEvent('focusOnLocation', {
              detail: {
                location: finalItem.location,
                zoom: 16, // Vyšší zoom pro lepší detail
                animate: true, // Animace přechodu
                duration: 1.5, // Délka animace v sekundách
                taskId: finalItem.id, // ID úkolu pro případné další zpracování
                taskTitle: finalItem.title // Název úkolu pro zobrazení
              }
            });

            // Vyvolání události pro zaměření na lokaci
            window.dispatchEvent(focusEvent);

            // Standardní volání pro kompatibilitu
            onSelectLocation(finalItem.location);

            // Zobrazení potvrzení
            alert(`Lokace "${locationName}" byla úspěšně přidána a zobrazena na mapě.`);
          } else {
            alert('Lokace byla přidána, ale nemá všechna potřebná data pro zobrazení na mapě.');
          }
        }
      }
    } catch (error) {
      console.error('Chyba při přidávání lokace k úkolu:', error);
      alert(`Chyba při přidávání lokace: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    }
  };
    */
  };

  // Přidání trasy k úkolu s vylepšeným zobrazením na mapě
  const handleAddRouteToItem = async (planId: string, itemId: string) => {
    // Otevření dialogu pro zadání trasy
    const routeDescription = prompt('Popište trasu (např. "z Prahy do Brna"):');
    if (!routeDescription) return;

    // Získání aktuálního plánu
    const currentPlan = plans.find(p => p.id === planId);
    if (!currentPlan) return;

    // Získání aktuálního úkolu
    const currentItem = currentPlan.items.find(item => item.id === itemId);
    if (!currentItem) return;

    try {
      // Změna typu úkolu na trasu
      const updatedItem = {
        ...currentItem,
        type: 'route' as const
      };

      // Aktualizace úkolu v plánu
      const planWithUpdatedItem = {
        ...currentPlan,
        items: currentPlan.items.map(item =>
          item.id === itemId ? updatedItem : item
        ),
        updatedAt: new Date()
      };

      // Aktualizace plánu v seznamu plánů
      const updatedPlans = plans.map(p =>
        p.id === planId ? planWithUpdatedItem : p
      );

      setPlans(updatedPlans);
      setActivePlan(planWithUpdatedItem);

      // Vytvoření kontextu pro API volání
      const taskContext = {
        taskId: itemId,
        planId: planId,
        currentPlan: planWithUpdatedItem,
        taskTitle: updatedItem.title,
        taskDescription: updatedItem.description || ''
      };

      // Vytvoření dotazu pro AI
      const query = `Najdi přesnou trasu "${routeDescription}" pro úkol "${updatedItem.title}" s ID: ${itemId}. Použij toto ID úkolu v odpovědi. Vrať přesné souřadnice počátečního a cílového bodu.`;

      // Zobrazení zprávy o zpracování
      alert(`Hledám trasu pro "${routeDescription}". Prosím, počkejte...`);

      // Získání odpovědi z API
      const response = await onCreatePlanFromChat(query, taskContext);

      // Zpracování odpovědi
      if (response && typeof response === 'string') {
        // Pokud byla trasa úspěšně přidána, zobrazíme ji na mapě
        const finalPlan = plans.find(p => p.id === planId);
        if (finalPlan) {
          const finalItem = finalPlan.items.find(item => item.id === itemId);
          if (finalItem && finalItem.route) {
            // Nastavení aktivního indexu na tento úkol
            const itemIndex = finalPlan.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
              // Aktualizace plánu s aktivním indexem
              const planWithActiveItem = {
                ...finalPlan,
                activeItemIndex: itemIndex
              };

              // Aktualizace plánu v seznamu plánů
              const plansWithActiveItem = updatedPlans.map(p =>
                p.id === planId ? planWithActiveItem : p
              );

              setPlans(plansWithActiveItem);
              setActivePlan(planWithActiveItem);
            }

            // Zobrazení trasy na mapě s animací
            console.log('Zobrazuji trasu na mapě po přidání:', finalItem.route);

            // Vytvoření události pro animované zaměření na trasu
            const focusEvent = new CustomEvent('focusOnRoute', {
              detail: {
                route: finalItem.route,
                animate: true,
                duration: 1.5,
                taskId: finalItem.id,
                taskTitle: finalItem.title,
                showPath: true // Zobrazit cestu na mapě
              }
            });

            // Vyvolání události pro zaměření na trasu
            window.dispatchEvent(focusEvent);

            // Standardní volání pro kompatibilitu
            onSelectRoute(finalItem.route);

            // Zobrazení potvrzení
            alert(`Trasa "${routeDescription}" byla úspěšně přidána a zobrazena na mapě.`);
          } else {
            alert('Trasa byla přidána, ale nemá všechna potřebná data pro zobrazení na mapě.');
          }
        }
      }
    } catch (error) {
      console.error('Chyba při přidávání trasy k úkolu:', error);
      alert(`Chyba při přidávání trasy: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    }
  };

  // Úprava položky v plánu
  const handleEditItem = (planId: string, itemId: string, updatedFields: Partial<PlanItem>) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        return {
          ...plan,
          items: plan.items.map(item => {
            if (item.id === itemId) {
              // Pokud se mění typ na 'location' a není nastavena lokace, přidáme výchozí lokaci
              if (updatedFields.type === 'location' && !item.location && !updatedFields.location) {
                updatedFields.location = {
                  lat: 50.0755, // Praha jako výchozí lokace
                  lng: 14.4378,
                  name: 'Výchozí lokace'
                };
              }

              // Pokud se mění typ na 'route' a není nastavena trasa, přidáme výchozí trasu
              if (updatedFields.type === 'route' && !item.route && !updatedFields.route) {
                updatedFields.route = {
                  start: {
                    lat: 50.0755, // Praha jako výchozí počáteční bod
                    lng: 14.4378,
                    name: 'Výchozí počáteční bod'
                  },
                  end: {
                    lat: 50.0911, // Pražský hrad jako výchozí cílový bod
                    lng: 14.4016,
                    name: 'Výchozí cílový bod'
                  }
                };
              }

              return { ...item, ...updatedFields };
            }
            return item;
          }),
          updatedAt: new Date()
        };
      }
      return plan;
    });

    setPlans(updatedPlans);
    setActivePlan(updatedPlans.find(p => p.id === planId) || null);

    // Najdeme aktualizovanou položku
    const updatedPlan = updatedPlans.find(p => p.id === planId);
    if (updatedPlan) {
      const updatedItem = updatedPlan.items.find(item => item.id === itemId);
      if (updatedItem) {
        // Pokud se jedná o lokaci nebo trasu, aktualizujeme zobrazení na mapě
        if (updatedItem.type === 'location' && updatedItem.location) {
          console.log('Zobrazuji lokaci na mapě po úpravě:', updatedItem.location);
          onSelectLocation(updatedItem.location);

          // Nastavení aktivního indexu na tento úkol
          const itemIndex = updatedPlan.items.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            // Aktualizace plánu s aktivním indexem
            const planWithActiveItem = {
              ...updatedPlan,
              activeItemIndex: itemIndex
            };

            // Aktualizace plánu v seznamu plánů
            const plansWithActiveItem = updatedPlans.map(p =>
              p.id === planId ? planWithActiveItem : p
            );

            setPlans(plansWithActiveItem);
            setActivePlan(planWithActiveItem);
          }
        } else if (updatedItem.type === 'route' && updatedItem.route) {
          console.log('Zobrazuji trasu na mapě po úpravě:', updatedItem.route);
          onSelectRoute(updatedItem.route);

          // Nastavení aktivního indexu na tento úkol
          const itemIndex = updatedPlan.items.findIndex(item => item.id === itemId);
          if (itemIndex !== -1) {
            // Aktualizace plánu s aktivním indexem
            const planWithActiveItem = {
              ...updatedPlan,
              activeItemIndex: itemIndex
            };

            // Aktualizace plánu v seznamu plánů
            const plansWithActiveItem = updatedPlans.map(p =>
              p.id === planId ? planWithActiveItem : p
            );

            setPlans(plansWithActiveItem);
            setActivePlan(planWithActiveItem);
          }
        }
      }
    }
  };

  return (
    <div className={`planning-panel ${visible ? 'visible' : ''}`}>
      <div className="planning-header">
        <h2>Plánování</h2>
        <div className="planning-actions">
          <button
            className="new-plan-button"
            onClick={() => setShowNewPlanForm(!showNewPlanForm)}
          >
            <i className="fas fa-plus"></i>
            <span>Nový plán</span>
          </button>
        </div>
      </div>

      {showNewPlanForm && (
        <div className="new-plan-form">
          <input
            type="text"
            placeholder="Název plánu"
            value={newPlanTitle}
            onChange={(e) => setNewPlanTitle(e.target.value)}
          />
          <button onClick={handleCreatePlan}>Vytvořit</button>
        </div>
      )}

      <div className="plan-selector">
        <div className="plan-list-header">
          <h3>Seznam plánů</h3>
          {plans.length > 0 && (
            <button
              className="remove-all-plans-button"
              onClick={handleRemoveAllPlans}
              title="Odstranit všechna plány"
            >
              <i className="fas fa-trash-alt"></i>
              <span>Odstranit vše</span>
            </button>
          )}
        </div>
        <div className="plan-list-content">
          {/* Pokud nejsou žádná plány, zobrazíme informaci */}
          {plans.length === 0 ? (
            <div className="no-plans-message">
              <p>Žádná plány nebyly nalezeny</p>
              <p>Vytvořte nový plán pomocí tlačítka "Nový plán" nebo použijte chat</p>
            </div>
          ) : (
            <div className="plan-list-items">
              {plans.map(plan => {
            // Získání zkráceného názvu plánu pro zobrazení
            const displayTitle = plan.title || "Plán bez názvu";

            return (
              <div
                key={plan.id}
                className={`plan-item-new ${activePlan?.id === plan.id ? 'active' : ''}`}
                onClick={() => {
                  console.log('Kliknuto na plán:', plan.title);
                  setActivePlan(plan);

                  // Automatické zobrazení prvé položky plánu na mapě
                  if (plan.items && plan.items.length > 0) {
                    const firstItem = plan.items[0];
                    const itemIndex = 0;

                    // Zobrazení prvé položky na mapě
                    handleSelectItem(firstItem, plan.id, itemIndex);

                    // Aktualizace aktivního indexu v plánu
                    const updatedPlan = {
                      ...plan,
                      activeItemIndex: itemIndex
                    };

                    // Aktualizace plánu v seznamu plánů
                    const updatedPlans = plans.map(p =>
                      p.id === plan.id ? updatedPlan : p
                    );

                    setPlans([...updatedPlans]);
                    setActivePlan({...updatedPlan});

                    // Aktualizace localStorage
                    localStorage.setItem('plans', JSON.stringify(updatedPlans));
                  }
                }}
              >
                {/* Horní část s názvem plánu */}
                <div className="plan-header-new">
                  <div className="plan-title-new">{displayTitle}</div>
                  {planChatSessions[plan.id] && planChatSessions[plan.id].length > 0 && (
                    <div className="plan-chat-sessions" title="Konverzace, ve kterých byl tento plán vytvořen">
                      <i className="fas fa-comments"></i> {planChatSessions[plan.id].length}
                    </div>
                  )}
                </div>

                {/* Spodní část s informacemi */}
                <div className="plan-footer-new">
                  <span className="plan-items-count-new">
                    <i className="fas fa-tasks"></i> {plan.items ? plan.items.length : 0} položek
                    {hasPlanSubtasks(plan) ? (
                      <span className="subtasks-info" title={`Plán obsahuje ${plan.items.length - 1} podúkolů`}>
                        <i className="fas fa-list-ul"></i> {plan.items.length - 1} podúkolů
                      </span>
                    ) : (
                      <span className="subtasks-info warning" title="Plán nemá podúkoly!">
                        <i className="fas fa-exclamation-triangle"></i> Bez podúkolů
                      </span>
                    )}
                  </span>

                  <button
                    className="remove-plan-button-new"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Opravdu chcete odstranit plán "${displayTitle}"?`)) {
                        handleRemovePlan(plan.id);
                      }
                    }}
                  >
                    <i className="fas fa-trash"></i> Odstranit
                  </button>
                </div>
              </div>
            );
          })}
            </div>
          )}
        </div>
      </div>

      {activePlan && (
        <div className="active-plan">
          <div className="active-plan-header">
            <MarqueeTitle title={activePlan.title} />
            <div className="plan-header-actions">
              {!isNavigating || currentNavigationPlan !== activePlan.id ? (
                <>
                  <button
                    className="add-item-button"
                    onClick={() => handleAddNewItem(activePlan.id)}
                    disabled={isNavigating}
                    title="Přidat položku"
                  >
                    <i className="fas fa-plus"></i>
                  </button>

                  {activePlan.items.length > 0 && (
                    <>
                      <button
                        className="auto-location-button"
                        onClick={() => setShowAutoLocationAssigner(true)}
                        disabled={isNavigating}
                        title="Automaticky přiřadit lokace"
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </button>

                      <button
                        className="start-navigation-button"
                        onClick={() => handleStartNavigation(activePlan)}
                        title="Spustit navigaci"
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <button
                  className="stop-navigation-button"
                  onClick={() => handleStopNavigation(activePlan)}
                  title="Ukončit navigaci"
                >
                  <i className="fas fa-stop"></i>
                </button>
              )}
            </div>
          </div>

          {activePlan.description && <p className="plan-description">{activePlan.description}</p>}

          {/* Navigační panel pro krokové zobrazení */}
          {isNavigating && currentNavigationPlan === activePlan.id && activePlan.activeItemIndex !== undefined && (
            <div className="navigation-controls">
              <button
                className="nav-prev-button"
                onClick={() => handlePrevStep(activePlan)}
                disabled={activePlan.activeItemIndex === 0}
              >
                <i className="fas fa-chevron-left"></i>
                <span>Předchozí</span>
              </button>

              <div className="nav-progress">
                <span className="current-step">{activePlan.activeItemIndex + 1}</span>
                <span className="total-steps">/ {activePlan.items.length}</span>
              </div>

              <button
                className="nav-next-button"
                onClick={() => handleNextStep(activePlan)}
                disabled={activePlan.activeItemIndex >= activePlan.items.length - 1}
              >
                <span>Další</span>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}

          {/* Komponenta pro automatické přiřazování lokalit */}
          {showAutoLocationAssigner && (
            <div className="auto-location-assigner-container">
              <AutoLocationAssigner
                planId={activePlan.id}
                onComplete={(result) => {
                  console.log('Automatické přiřazování lokalit dokončeno:', result);
                  setShowAutoLocationAssigner(false);

                  // Aktualizace plánů z localStorage
                  const savedPlans = localStorage.getItem('plans');
                  if (savedPlans) {
                    try {
                      const parsedPlans = JSON.parse(savedPlans);
                      setPlans(parsedPlans);

                      // Aktualizace aktivního plánu
                      const updatedPlan = parsedPlans.find((p: Plan) => p.id === activePlan.id);
                      if (updatedPlan) {
                        setActivePlan(updatedPlan);
                      }
                    } catch (error) {
                      console.error('Chyba při aktualizaci plánů po přiřazení lokalit:', error);
                    }
                  }
                }}
                onCancel={() => setShowAutoLocationAssigner(false)}
              />
            </div>
          )}

          {/* Komponenta pro testování přesnosti přiřazování lokalit */}
          {showLocationAssignmentTester && (
            <div className="location-assignment-tester-container">
              <LocationAssignmentTester
                planId={activePlan.id}
                onComplete={(result) => {
                  console.log('Testování přesnosti přiřazování lokalit dokončeno:', result);

                  // Zobrazení výsledků testování
                  alert(`Testování přesnosti dokončeno!\n\nCelkem úkolů s lokací: ${result.total}\nOtestováno úkolů: ${result.tested}\nPřesnost: ${result.averageAccuracy.toFixed(2)}%`);

                  setShowLocationAssignmentTester(false);
                }}
                onCancel={() => setShowLocationAssignmentTester(false)}
              />
            </div>
          )}

          <div className="plan-items">
            {activePlan.items.length === 0 ? (
              <p className="no-items">Žádné položky v plánu</p>
            ) : (
              activePlan.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`plan-item ${item.completed ? 'completed' : ''} ${isNavigating && currentNavigationPlan === activePlan.id && activePlan.activeItemIndex === index ? 'active-navigation-item' : ''}`}
                  onClick={() => handleSelectItem(item, activePlan.id, index)}
                  data-active={activePlan.activeItemIndex === index ? "true" : "false"}
                >
                  <div className="item-header">
                    <div className="item-id-row">
                      <span
                        className="item-id-badge"
                        title="Klikněte pro zkopírování ID úkolu"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.id);
                        }}
                      >
                        ID: {item.id}
                      </span>
                    </div>
                    <div className="item-title-row">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleToggleItemComplete(activePlan.id, item.id);
                        }}
                      />
                      <h4
                        className="editable-title"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newTitle = prompt('Zadejte nový název:', item.title);
                          if (newTitle) {
                            handleEditItem(activePlan.id, item.id, { title: newTitle });
                          }
                        }}
                      >
                        {item.title}
                      </h4>
                      <div className="item-actions">
                        <button
                          className="edit-item-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newDescription = prompt('Zadejte nový popis:', item.description || '');
                            if (newDescription !== null) {
                              handleEditItem(activePlan.id, item.id, { description: newDescription });
                            }
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="remove-item-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(activePlan.id, item.id);
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                    <div className="item-time-row">
                      {item.time && (
                        <span
                          className="item-time editable-time"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newTime = prompt('Zadejte nový čas:', item.time);
                            if (newTime) {
                              handleEditItem(activePlan.id, item.id, { time: newTime });
                            }
                          }}
                        >
                          <i className="fas fa-clock"></i> {item.time}
                        </span>
                      )}
                      <span className="item-type">{item.type === 'location' ? 'Místo' : item.type === 'route' ? 'Trasa' : 'Úkol'}</span>
                    </div>
                  </div>
                  {item.description && <p className="item-description">{item.description}</p>}

                  {/* Lokace */}
                  {item.location && item.type === 'location' ? (
                    <div className="item-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{item.location.name || `${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}`}</span>
                    </div>
                  ) : item.type !== 'route' && (
                    <div className="item-add-location">
                      <div className="location-buttons">
                        <button
                          className="add-location-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddLocationToItem(activePlan.id, item.id);
                          }}
                          title="Použít aktuální polohu"
                        >
                          <i className="fas fa-location-arrow"></i>
                        </button>
                        <button
                          className="add-location-ai-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddLocationToTask(item.id);
                          }}
                          title="Vyhledat místo pomocí AI"
                        >
                          <i className="fas fa-map-marked-alt"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Trasa */}
                  {item.type === 'route' && item.route ? (
                    <div className="item-route">
                      <i className="fas fa-route"></i>
                      <span>
                        {item.route.start.name || 'Počáteční bod'} → {item.route.end.name || 'Cílový bod'}
                      </span>
                    </div>
                  ) : item.type !== 'location' && !item.location && (
                    <div className="item-add-route">
                      <button
                        className="add-route-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRouteToItem(activePlan.id, item.id);
                        }}
                        title="Přidat trasu"
                      >
                        <i className="fas fa-route"></i>
                      </button>
                    </div>
                  )}

                  {/* Změna typu úkolu */}
                  <div className="item-type-selector">
                    <select
                      value={item.type}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleEditItem(activePlan.id, item.id, { type: e.target.value as 'location' | 'task' | 'route' | 'note' });
                      }}
                    >
                      <option value="task">Úkol</option>
                      <option value="location">Místo</option>
                      <option value="route">Trasa</option>
                      <option value="note">Poznámka</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat input byl odstraněn - nyní se používá pouze pravý chat */}

      {/* Zobrazení detailů úkolu bylo odstraněno */}

      {/* Modální okno pro výběr lokace */}
      {showLocationSelector && currentTaskForLocation && (
        <>
          <div className="location-selector-overlay" onClick={handleLocationSelectionCancel}></div>
          <LocationSelector
            onSelectLocation={handleLocationSelected}
            onCancel={handleLocationSelectionCancel}
            taskTitle={currentTaskForLocation.taskTitle}
            initialQuery={currentTaskForLocation.initialQuery}
          />
        </>
      )}
    </div>
  );
};

export default PlanningPanel;
