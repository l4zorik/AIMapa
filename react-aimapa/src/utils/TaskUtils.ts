/**
 * Utility funkce pro práci s úkoly a plány
 */

/**
 * Kontroluje, zda plán obsahuje podúkoly
 * @param plan Plán k kontrole
 * @returns True, pokud plán obsahuje podúkoly, jinak false
 */
export const hasPlanSubtasks = (plan: any): boolean => {
  if (!plan || !plan.items || !Array.isArray(plan.items) || plan.items.length <= 1) {
    return false;
  }

  // Plán má podúkoly, pokud má více než jednu položku
  return plan.items.length > 1;
};

/**
 * Kontroluje a opravuje plány, které nemají podúkoly
 * @param plans Pole plánů k kontrole
 * @returns Opravené pole plánů
 */
export const checkAndFixPlansWithoutSubtasks = (plans: any[]): any[] => {
  if (!plans || !Array.isArray(plans)) {
    return plans;
  }

  console.log(`Kontroluji ${plans.length} plánů na přítomnost podúkolů...`);

  // Procházíme všechny plány a kontrolujeme, zda mají podúkoly
  const fixedPlans = plans.map(plan => {
    // Pokud plán nemá podúkoly, vygenerujeme je
    if (!hasPlanSubtasks(plan)) {
      console.log(`Plán "${plan.title}" nemá podúkoly, generuji je...`);

      // Vytvoření kopie plánu
      const fixedPlan = { ...plan };

      // Pokud plán nemá žádné položky, vytvoříme hlavní úkol
      if (!fixedPlan.items || !Array.isArray(fixedPlan.items) || fixedPlan.items.length === 0) {
        fixedPlan.items = [{
          id: `${plan.id}-0`,
          title: plan.title,
          description: `Hlavní úkol pro ${plan.title}`,
          time: '',
          completed: false,
          type: 'task',
          createdAt: new Date()
        }];
      }

      // Generování podúkolů na základě názvu plánu
      const subtasks = generateRelevantSubtasks(plan.title, plan.id);

      // Přidání podúkolů do plánu
      fixedPlan.items = [...fixedPlan.items, ...subtasks];

      console.log(`Vygenerováno ${subtasks.length} podúkolů pro plán "${plan.title}"`);

      return fixedPlan;
    }

    // Pokud plán má podúkoly, vrátíme ho beze změny
    return plan;
  });

  return fixedPlans;
};

/**
 * Generuje relevantní podúkoly na základě obsahu zprávy
 * @param message Obsah zprávy z chatu
 * @param planId ID plánu
 * @returns Pole podúkolů
 */
export const generateRelevantSubtasks = (message: string, planId: string): any[] => {
  console.log(`Generuji podúkoly na základě zprávy: "${message}"`);

  // Detekce klíčových slov ve zprávě pro generování relevantních podúkolů
  const lowerMessage = message.toLowerCase();

  // Podúkoly pro výlety a cestování
  if (lowerMessage.includes('výlet') || lowerMessage.includes('cesta') || lowerMessage.includes('cestování') ||
      lowerMessage.includes('dovolená') || lowerMessage.includes('návštěva')) {
    return [
      {
        id: `${planId}-1`,
        title: 'Plánování trasy',
        description: 'Naplánování trasy a zastávek',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-2`,
        title: 'Příprava zavazadel',
        description: 'Sbalení všech potřebných věcí',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-3`,
        title: 'Kontrola dopravních prostředků',
        description: 'Zajištění jízdenek nebo kontrola vozidla',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-4`,
        title: 'Rezervace ubytování',
        description: 'Zajištění místa pro přenocování',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      }
    ];
  }

  // Podúkoly pro nalezení bugů v aplikaci
  if (lowerMessage.includes('bug') || lowerMessage.includes('chyb') || lowerMessage.includes('nalezen')) {
    return [
      {
        id: `${planId}-1`,
        title: 'Analýza uživatelského rozhraní',
        description: 'Kontrola vizuálních chyb a problémů s UI',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-2`,
        title: 'Testování funkčnosti mapy',
        description: 'Ověření správného zobrazení a interakce s mapou',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-3`,
        title: 'Kontrola API integrace',
        description: 'Testování komunikace s externími API',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-4`,
        title: 'Ověření ukládání dat',
        description: 'Kontrola správného ukládání a načítání dat z localStorage',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-5`,
        title: 'Testování responzivity',
        description: 'Kontrola zobrazení na různých zařízeních a velikostech obrazovky',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      }
    ];
  }

  // Podúkoly pro města
  if (lowerMessage.includes('praha')) {
    return [
      {
        id: `${planId}-1`,
        title: 'Návštěva Pražského hradu',
        description: 'Prohlídka Pražského hradu a katedrály sv. Víta',
        time: '10:00',
        completed: false,
        type: 'location',
        location: { lat: 50.0911, lng: 14.4016, name: 'Pražský hrad' },
        createdAt: new Date()
      },
      {
        id: `${planId}-2`,
        title: 'Oběd v restauraci',
        description: 'Oběd v restauraci U Fleků',
        time: '13:00',
        completed: false,
        type: 'location',
        location: { lat: 50.0819, lng: 14.4189, name: 'U Fleků' },
        createdAt: new Date()
      },
      {
        id: `${planId}-3`,
        title: 'Karlův most',
        description: 'Procházka po Karlově mostě',
        time: '15:00',
        completed: false,
        type: 'location',
        location: { lat: 50.0865, lng: 14.4112, name: 'Karlův most' },
        createdAt: new Date()
      }
    ];
  }

  if (lowerMessage.includes('brno')) {
    return [
      {
        id: `${planId}-1`,
        title: 'Návštěva hradu Špilberk',
        description: 'Prohlídka hradu a výhled na město',
        time: '10:00',
        completed: false,
        type: 'location',
        location: { lat: 49.1947, lng: 16.6006, name: 'Hrad Špilberk' },
        createdAt: new Date()
      },
      {
        id: `${planId}-2`,
        title: 'Oběd v centru',
        description: 'Oběd v restauraci v centru města',
        time: '13:00',
        completed: false,
        type: 'location',
        location: { lat: 49.1951, lng: 16.6068, name: 'Centrum Brna' },
        createdAt: new Date()
      },
      {
        id: `${planId}-3`,
        title: 'Katedrála sv. Petra a Pavla',
        description: 'Návštěva katedrály na Petrově',
        time: '15:00',
        completed: false,
        type: 'location',
        location: { lat: 49.1912, lng: 16.6077, name: 'Katedrála sv. Petra a Pavla' },
        createdAt: new Date()
      }
    ];
  }

  // Pro získání Lamborghini Aventador
  if (lowerMessage.includes('lamborghini') || lowerMessage.includes('aventador')) {
    return [
      {
        id: `${planId}-1`,
        title: 'Průzkum trhu',
        description: 'Zjištění dostupnosti a cen Lamborghini Aventador',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-2`,
        title: 'Finanční plán',
        description: 'Vytvoření finančního plánu pro nákup',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-3`,
        title: 'Návštěva dealera',
        description: 'Domluvení schůzky a návštěva autorizovaného dealera',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-4`,
        title: 'Testovací jízda',
        description: 'Vyzkoušení vozu před nákupem',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-5`,
        title: 'Dokončení nákupu',
        description: 'Podepsání smlouvy a převzetí vozu',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      }
    ];
  }

  // Pro opravení chyb v AI mapě
  if (lowerMessage.includes('opravení chyby') || lowerMessage.includes('ai mapě')) {
    return [
      {
        id: `${planId}-1`,
        title: 'Identifikace problému',
        description: 'Přesná identifikace a popis chyby v AI mapě',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-2`,
        title: 'Analýza kódu',
        description: 'Prozkoumání relevantních částí kódu',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-3`,
        title: 'Implementace opravy',
        description: 'Provedení potřebných změn v kódu',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-4`,
        title: 'Testování řešení',
        description: 'Ověření, že oprava funguje správně',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-5`,
        title: 'Nasazení změn',
        description: 'Aplikace opravy do produkčního prostředí',
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      }
    ];
  }

  // Pokud zpráva obsahuje "vytvoř úkol", vytvoříme dynamické podúkoly na základě obsahu zprávy
  if (lowerMessage.includes('vytvoř úkol') || lowerMessage.includes('vytvořit úkol')) {
    // Extrahujeme název úkolu ze zprávy
    const taskNameMatch = message.match(/vytvoř(?:it)? úkol[:\s]+(.+?)(?:$|\.|\?)/i);
    const taskName = taskNameMatch ? taskNameMatch[1].trim() : 'Nový úkol';

    console.log('Extrahovaný název úkolu:', taskName);

    // Vytvoříme dynamické podúkoly na základě názvu úkolu
    return [
      {
        id: `${planId}-1`,
        title: `Příprava pro: ${taskName}`,
        description: `Přípravné práce pro úkol: ${taskName}`,
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-2`,
        title: `Realizace: ${taskName}`,
        description: `Hlavní část úkolu: ${taskName}`,
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      },
      {
        id: `${planId}-3`,
        title: `Dokončení: ${taskName}`,
        description: `Finalizace úkolu: ${taskName}`,
        time: '',
        completed: false,
        type: 'task',
        createdAt: new Date()
      }
    ];
  }

  // Pro všechny ostatní typy plánů vrátíme prázdné pole - nebudeme generovat generické podúkoly
  // Tím umožníme, aby AI mohla generovat relevantní podúkoly na základě kontextu
  return [];
};
