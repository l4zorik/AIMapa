import React, { useState, useEffect } from 'react';
import './PlanningPanel.css';

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
  };
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
  const [chatInput, setChatInput] = useState<string>('');

  // Funkce pro načtení plánů z localStorage
  const loadPlansFromStorage = () => {
    const savedPlans = localStorage.getItem('plans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        const formattedPlans = parsedPlans.map((plan: any) => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
          updatedAt: new Date(plan.updatedAt)
        }));

        setPlans(formattedPlans);

        // Pokud není aktivní plán nebo byl vytvořen nový plán, nastavíme nejnovější jako aktivní
        if (!activePlan || !formattedPlans.find((p: Plan) => p.id === activePlan.id)) {
          // Seřadíme plány podle data vytvoření (nejnovější první)
          const sortedPlans = [...formattedPlans].sort((a: Plan, b: Plan) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          if (sortedPlans.length > 0) {
            setActivePlan(sortedPlans[0]);
          }
        }

        return formattedPlans;
      } catch (error) {
        console.error('Chyba při načítání plánů:', error);
        return [];
      }
    } else {
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
      setPlans(demoPlans);
      setActivePlan(demoPlans[0]);
      return demoPlans;
    }
  };

  // Načtení plánů při prvním renderování
  useEffect(() => {
    loadPlansFromStorage();
  }, []);

  // Efekt pro pravidelnou kontrolu nových plánů
  useEffect(() => {
    // Kontrola nových plánů každé 2 sekundy
    const intervalId = setInterval(() => {
      loadPlansFromStorage();
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

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

  // Uložení plánů při změně
  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem('plans', JSON.stringify(plans));
    }
  }, [plans]);

  // Vytvoření nového plánu
  const handleCreatePlan = () => {
    if (!newPlanTitle.trim()) return;

    const newPlan: Plan = {
      id: Date.now().toString(),
      title: newPlanTitle,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setPlans([...plans, newPlan]);
    setActivePlan(newPlan);
    setNewPlanTitle('');
    setShowNewPlanForm(false);
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

    setPlans(updatedPlans);
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

      // Pokud jsme nenašli další nedokončenou položku, zkontrolujeme, zda jsou všechny položky dokončené
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
        // Všechny položky jsou dokončené, zobrazíme oznámení
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
            // Najdeme první nedokončený úkol v dalším plánu
            const firstIncompleteItemIndex = nextPlan.items.findIndex(item => !item.completed);

            if (firstIncompleteItemIndex !== -1) {
              const firstIncompleteItem = nextPlan.items[firstIncompleteItemIndex];

              // Aktualizujeme plán s novým aktivním indexem
              const nextPlanWithActiveItem = {
                ...nextPlan,
                activeItemIndex: firstIncompleteItemIndex
              };

              // Aktualizujeme plány
              const plansWithActiveItem = updatedPlans.map(p =>
                p.id === nextPlan.id ? nextPlanWithActiveItem : p
              );

              setPlans(plansWithActiveItem);
              setActivePlan(nextPlanWithActiveItem);

              // Zobrazíme položku na mapě
              if (firstIncompleteItem.type === 'location' && firstIncompleteItem.location) {
                console.log('Přepínám na první nedokončenou položku v dalším plánu s lokací:', firstIncompleteItem.location);
                onSelectLocation(firstIncompleteItem.location);
              } else if (firstIncompleteItem.type === 'route' && firstIncompleteItem.route) {
                console.log('Přepínám na první nedokončenou položku v dalším plánu s trasou:', firstIncompleteItem.route);
                onSelectRoute(firstIncompleteItem.route);
              }
            }
          }
        }
      } else {
        // Nenašli jsme další nedokončenou položku, ale některé položky jsou stále nedokončené
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

    setPlans(updatedPlans);
    setActivePlan(updatedPlans.find(p => p.id === planId) || null);
  };

  // Odstranění plánu
  const handleRemovePlan = (planId: string) => {
    const updatedPlans = plans.filter(plan => plan.id !== planId);
    setPlans(updatedPlans);

    if (activePlan?.id === planId) {
      setActivePlan(updatedPlans.length > 0 ? updatedPlans[0] : null);
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

    setPlans(updatedPlans);
    setActivePlan(updatedPlans.find(p => p.id === planId) || null);

    // Zobrazení položky na mapě
    if (item.type === 'location' && item.location) {
      console.log('Zobrazuji lokaci na mapě po výběru položky:', item.location);
      onSelectLocation(item.location);
    } else if (item.type === 'route' && item.route) {
      console.log('Zobrazuji trasu na mapě po výběru položky:', item.route);
      onSelectRoute(item.route);
    } else {
      console.log('Položka nemá lokaci ani trasu:', item);
    }
  };

  // Spuštění navigace podle plánu
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

    setPlans(updatedPlans);
    setActivePlan(updatedPlan);

    // Zobrazení první položky na mapě
    if (updatedPlan.items.length > 0) {
      const firstItem = updatedPlan.items[0];
      handleSelectItem(firstItem, updatedPlan.id, 0);
    }

    // Spuštění navigace
    onStartPlanNavigation(updatedPlan);
  };

  // Navigace na další krok
  const handleNextStep = (plan: Plan) => {
    if (plan.activeItemIndex === undefined || plan.items.length === 0) return;

    // Výpočet indexu další položky
    const nextIndex = Math.min(plan.activeItemIndex + 1, plan.items.length - 1);

    // Aktualizace plánu
    const updatedPlan = {
      ...plan,
      activeItemIndex: nextIndex
    };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    setPlans(updatedPlans);
    setActivePlan(updatedPlan);

    // Zobrazení další položky na mapě
    const nextItem = updatedPlan.items[nextIndex];
    console.log('Navigace na další krok, zobrazuji položku:', nextItem);
    handleSelectItem(nextItem, updatedPlan.id, nextIndex);

    // Volání funkce pro navigaci na další krok
    onNavigateToNextStep(updatedPlan, nextIndex);
  };

  // Navigace na předchozí krok
  const handlePrevStep = (plan: Plan) => {
    if (plan.activeItemIndex === undefined || plan.items.length === 0) return;

    // Výpočet indexu předchozí položky
    const prevIndex = Math.max(plan.activeItemIndex - 1, 0);

    // Aktualizace plánu
    const updatedPlan = {
      ...plan,
      activeItemIndex: prevIndex
    };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    setPlans(updatedPlans);
    setActivePlan(updatedPlan);

    // Zobrazení předchozí položky na mapě
    const prevItem = updatedPlan.items[prevIndex];
    console.log('Navigace na předchozí krok, zobrazuji položku:', prevItem);
    handleSelectItem(prevItem, updatedPlan.id, prevIndex);

    // Volání funkce pro navigaci na předchozí krok
    onNavigateToPrevStep(updatedPlan, prevIndex);
  };

  // Ukončení navigace
  const handleStopNavigation = (plan: Plan) => {
    // Aktualizace plánu
    const updatedPlan = {
      ...plan,
      activeItemIndex: undefined
    };

    // Aktualizace plánu v seznamu plánů
    const updatedPlans = plans.map(p =>
      p.id === plan.id ? updatedPlan : p
    );

    setPlans(updatedPlans);
    setActivePlan(updatedPlan);

    // Volání funkce pro ukončení navigace
    onStartPlanNavigation(updatedPlan);
  };

  // Vytvoření plánu z chatu
  const handleCreatePlanFromChat = () => {
    if (!chatInput.trim()) return;
    onCreatePlanFromChat(chatInput);
    setChatInput('');
  };

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

  // Přidání lokace k úkolu
  const handleAddLocationToItem = async (planId: string, itemId: string) => {
    // Otevření dialogu pro zadání lokace
    const locationName = prompt('Zadejte název místa nebo popište lokaci pro AI:');
    if (!locationName) return;

    // Získání aktuálního plánu
    const currentPlan = plans.find(p => p.id === planId);
    if (!currentPlan) return;

    // Získání aktuálního úkolu
    const currentItem = currentPlan.items.find(item => item.id === itemId);
    if (!currentItem) return;

    try {
      // Nastavení stavu pro indikaci načítání
      setChatInput(`Hledám lokaci: ${locationName}`);

      // Vytvoření kontextu pro API volání
      const taskContext = {
        taskId: itemId,
        planId: planId,
        currentPlan: currentPlan,
        taskTitle: currentItem.title,
        taskDescription: currentItem.description || ''
      };

      // Vytvoření dotazu pro AI
      const query = `Najdi lokaci "${locationName}" pro úkol "${currentItem.title}" s ID: ${itemId}. Použij toto ID úkolu v odpovědi.`;

      // Získání odpovědi z API
      const response = await onCreatePlanFromChat(query, taskContext);

      // Zpracování odpovědi
      if (response && typeof response === 'string') {
        // Zobrazení odpovědi v chatu
        setChatInput('');

        // Pokud byla lokace úspěšně přidána, zobrazíme ji na mapě
        const updatedPlan = plans.find(p => p.id === planId);
        if (updatedPlan) {
          const updatedItem = updatedPlan.items.find(item => item.id === itemId);
          if (updatedItem && updatedItem.location) {
            // Nastavení aktivního indexu na tento úkol
            const itemIndex = updatedPlan.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
              // Aktualizace plánu s aktivním indexem
              const planWithActiveItem = {
                ...updatedPlan,
                activeItemIndex: itemIndex
              };

              // Aktualizace plánu v seznamu plánů
              const updatedPlans = plans.map(p =>
                p.id === planId ? planWithActiveItem : p
              );

              setPlans(updatedPlans);
              setActivePlan(planWithActiveItem);
            }

            // Zobrazení lokace na mapě
            console.log('Zobrazuji lokaci na mapě po přidání:', updatedItem.location);
            onSelectLocation(updatedItem.location);
          }
        }
      }
    } catch (error) {
      console.error('Chyba při přidávání lokace k úkolu:', error);
      alert(`Chyba při přidávání lokace: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    }
  };

  // Přidání trasy k úkolu
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
      // Nastavení stavu pro indikaci načítání
      setChatInput(`Hledám trasu: ${routeDescription}`);

      // Vytvoření kontextu pro API volání
      const taskContext = {
        taskId: itemId,
        planId: planId,
        currentPlan: currentPlan,
        taskTitle: currentItem.title,
        taskDescription: currentItem.description || ''
      };

      // Vytvoření dotazu pro AI
      const query = `Najdi trasu "${routeDescription}" pro úkol "${currentItem.title}" s ID: ${itemId}. Použij toto ID úkolu v odpovědi.`;

      // Získání odpovědi z API
      const response = await onCreatePlanFromChat(query, taskContext);

      // Zpracování odpovědi
      if (response && typeof response === 'string') {
        // Zobrazení odpovědi v chatu
        setChatInput('');

        // Pokud byla trasa úspěšně přidána, zobrazíme ji na mapě
        const updatedPlan = plans.find(p => p.id === planId);
        if (updatedPlan) {
          const updatedItem = updatedPlan.items.find(item => item.id === itemId);
          if (updatedItem && updatedItem.route) {
            // Nastavení aktivního indexu na tento úkol
            const itemIndex = updatedPlan.items.findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
              // Aktualizace plánu s aktivním indexem
              const planWithActiveItem = {
                ...updatedPlan,
                activeItemIndex: itemIndex
              };

              // Aktualizace plánu v seznamu plánů
              const updatedPlans = plans.map(p =>
                p.id === planId ? planWithActiveItem : p
              );

              setPlans(updatedPlans);
              setActivePlan(planWithActiveItem);
            }

            // Zobrazení trasy na mapě
            console.log('Zobrazuji trasu na mapě po přidání:', updatedItem.route);
            onSelectRoute(updatedItem.route);
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
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`plan-item ${activePlan?.id === plan.id ? 'active' : ''}`}
            onClick={() => setActivePlan(plan)}
          >
            <div className="plan-header">
              <span className="plan-title">{plan.title}</span>
              <span className="plan-items-count">{plan.items.length} položek</span>
            </div>
            <div className="plan-id-row">
              <span
                className="plan-id-badge"
                title="Klikněte pro zkopírování ID plánu"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(plan.id);
                }}
              >
                ID: {plan.id}
              </span>
            </div>
            <button
              className="remove-plan-button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePlan(plan.id);
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      {activePlan && (
        <div className="active-plan">
          <div className="active-plan-header">
            <h3>{activePlan.title}</h3>
            <div className="plan-header-actions">
              {!isNavigating || currentNavigationPlan !== activePlan.id ? (
                <>
                  <button
                    className="add-item-button"
                    onClick={() => handleAddNewItem(activePlan.id)}
                    disabled={isNavigating}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Přidat položku</span>
                  </button>

                  {activePlan.items.length > 0 && (
                    <button
                      className="start-navigation-button"
                      onClick={() => handleStartNavigation(activePlan)}
                    >
                      <i className="fas fa-play"></i>
                      <span>Spustit navigaci</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  className="stop-navigation-button"
                  onClick={() => handleStopNavigation(activePlan)}
                >
                  <i className="fas fa-stop"></i>
                  <span>Ukončit navigaci</span>
                </button>
              )}
            </div>
          </div>

          {activePlan.description && <p className="plan-description">{activePlan.description}</p>}

          {/* Navigační panel pro krokovou navigaci */}
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
                  {item.location ? (
                    <div className="item-location">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{item.location.name || `${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}`}</span>
                    </div>
                  ) : item.type !== 'route' && (
                    <div className="item-add-location">
                      <button
                        className="add-location-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddLocationToItem(activePlan.id, item.id);
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                        <span>Přidat místo</span>
                      </button>
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
                      >
                        <i className="fas fa-route"></i>
                        <span>Přidat trasu</span>
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

      <div className="planning-chat-input">
        <input
          type="text"
          placeholder="Vytvořit plán z chatu..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreatePlanFromChat();
            }
          }}
        />
        <button onClick={handleCreatePlanFromChat}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default PlanningPanel;
