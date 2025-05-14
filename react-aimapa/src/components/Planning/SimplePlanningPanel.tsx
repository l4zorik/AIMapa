import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Definice typů
export interface PlanItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  completed: boolean;
  type: 'task' | 'location' | 'route';
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  route?: {
    start: {
      lat: number;
      lng: number;
      name?: string;
    };
    end: {
      lat: number;
      lng: number;
      name?: string;
    };
    geometry?: [number, number][];
    distance?: number;
    duration?: number;
  };
  createdAt?: Date | string;
}

export interface Plan {
  id: string;
  title: string;
  items: PlanItem[];
  createdAt: Date | string;
  updatedAt: Date | string;
  activeItemIndex?: number;
}

interface Location {
  lat: number;
  lng: number;
  name?: string;
}

interface Route {
  start: Location;
  end: Location;
  geometry?: [number, number][];
  distance?: number;
  duration?: number;
}

interface CreatePlanFromChatEvent extends CustomEvent {
  detail: {
    query: string;
    source: string;
    context?: any;
  };
}

interface SimplePlanningPanelProps {
  onSelectLocation?: (location: Location) => void;
  onSelectRoute?: (route: Route) => void;
}

const SimplePlanningPanel: React.FC<SimplePlanningPanelProps> = ({
  onSelectLocation,
  onSelectRoute
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);

  // Efekt pro načtení plánů z localStorage při inicializaci
  useEffect(() => {
    const savedPlans = localStorage.getItem('plans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setPlans(parsedPlans);
        
        // Nastavení posledního plánu jako aktivního
        if (parsedPlans.length > 0) {
          setActivePlan(parsedPlans[parsedPlans.length - 1]);
        }
      } catch (error) {
        console.error('Chyba při načítání plánů z localStorage:', error);
      }
    }
  }, []);

  // Efekt pro poslouchání události vytvoření plánu z chatu
  useEffect(() => {
    // Funkce pro zpracování události vytvoření plánu z chatu
    const handleCreatePlanFromChat = (event: CreatePlanFromChatEvent) => {
      const { query, source } = event.detail;

      console.log(`Vytvářím plán z chatu: "${query}" (zdroj: ${source})`);

      // Vytvoření nového plánu s automatickým názvem odvozeným z dotazu
      const planTitle = query.length > 30
        ? `${query.substring(0, 30)}...`
        : query;

      // Vytvoření nového plánu
      const newPlanId = Date.now().toString();
      const newPlan: Plan = {
        id: newPlanId,
        title: planTitle,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

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
      localStorage.setItem('plans', JSON.stringify(updatedPlans));

      // Aktualizace stavu
      setPlans(updatedPlans);
      setActivePlan(newPlan);

      // Vyvolání události pro aktualizaci UI
      const plansUpdatedEvent = new CustomEvent('plansUpdated', {
        detail: {
          action: 'create',
          planId: newPlanId,
          source: 'chat'
        }
      });
      window.dispatchEvent(plansUpdatedEvent);

      return `Plán "${planTitle}" byl vytvořen.`;
    };

    // Přidání posluchače události
    window.addEventListener('createPlanFromChat', handleCreatePlanFromChat as unknown as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('createPlanFromChat', handleCreatePlanFromChat as unknown as EventListener);
    };
  }, []);

  return (
    <div className="planning-panel">
      <h2>Plány</h2>
      <div className="plans-list">
        {plans.map(plan => (
          <div 
            key={plan.id} 
            className={`plan-item ${activePlan?.id === plan.id ? 'active' : ''}`}
            onClick={() => setActivePlan(plan)}
          >
            <h3>{plan.title}</h3>
            <p>{plan.items.length} položek</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimplePlanningPanel;
