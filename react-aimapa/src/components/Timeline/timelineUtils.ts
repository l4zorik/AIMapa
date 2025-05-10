/**
 * timelineUtils.ts
 * Pomocné funkce pro práci s časovou osou
 */

import { TimelinePlan, TimelineEvent } from './TimelinePanel';

/**
 * Formátuje datum a čas podle zadaného formátu
 * @param date Datum k formátování
 * @param format Formát výstupu ('date', 'time', 'datetime')
 * @returns Formátovaný řetězec
 */
export const formatTime = (date: Date, format: 'date' | 'time' | 'datetime' = 'datetime'): string => {
  const options: Intl.DateTimeFormatOptions = {};
  
  if (format === 'date' || format === 'datetime') {
    options.day = '2-digit';
    options.month = '2-digit';
    options.year = 'numeric';
  }
  
  if (format === 'time' || format === 'datetime') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('cs-CZ', options).format(date);
};

/**
 * Formátuje trvání v minutách na čitelný formát
 * @param minutes Počet minut
 * @returns Formátovaný řetězec (např. "1h 30m")
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
};

/**
 * Vypočítá časy událostí v plánu
 * @param plan Plán s událostmi
 * @returns Pole událostí s vypočítanými časy
 */
export const calculateEventTimes = (plan: TimelinePlan): TimelineEvent[] => {
  if (!plan.events || plan.events.length === 0) {
    return [];
  }
  
  // Seřadíme události podle startTime
  const sortedEvents = [...plan.events].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );
  
  // Vypočítáme endTime pro události, které ho nemají
  return sortedEvents.map((event, index) => {
    // Pokud událost nemá endTime, ale má duration, vypočítáme ho
    if (!event.endTime && event.duration) {
      const endTime = new Date(event.startTime.getTime() + event.duration * 60 * 1000);
      return { ...event, endTime };
    }
    
    // Pokud událost nemá endTime ani duration, použijeme startTime následující události
    // nebo přidáme výchozí trvání 30 minut
    if (!event.endTime && !event.duration) {
      let endTime;
      
      if (index < sortedEvents.length - 1) {
        // Použijeme startTime následující události
        endTime = new Date(sortedEvents[index + 1].startTime);
      } else {
        // Přidáme výchozí trvání 30 minut
        endTime = new Date(event.startTime.getTime() + 30 * 60 * 1000);
      }
      
      // Vypočítáme duration
      const duration = Math.round((endTime.getTime() - event.startTime.getTime()) / (60 * 1000));
      
      return { ...event, endTime, duration };
    }
    
    return event;
  });
};

/**
 * Generuje ukázkový plán pro časovou osu
 * @returns Ukázkový plán
 */
export const generateSamplePlan = (): TimelinePlan => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0); // Dnes 9:00
  
  return {
    id: 'sample-plan',
    title: 'Ukázkový denní plán',
    description: 'Toto je ukázkový plán pro demonstraci časové osy',
    startDate,
    events: [
      {
        id: 'event-1',
        title: 'Ranní porada',
        description: 'Diskuze o denních úkolech a prioritách',
        startTime: new Date(startDate.getTime()),
        duration: 30,
        type: 'task',
        location: {
          lat: 50.0755,
          lng: 14.4378,
          name: 'Kancelář'
        }
      },
      {
        id: 'event-2',
        title: 'Cesta na schůzku',
        startTime: new Date(startDate.getTime() + 30 * 60 * 1000),
        duration: 45,
        type: 'travel',
        location: {
          lat: 50.0835,
          lng: 14.4341,
          name: 'Trasa do centra'
        }
      },
      {
        id: 'event-3',
        title: 'Schůzka s klientem',
        description: 'Prezentace nového projektu',
        startTime: new Date(startDate.getTime() + 75 * 60 * 1000),
        duration: 90,
        type: 'task',
        location: {
          lat: 50.0880,
          lng: 14.4208,
          name: 'Kancelář klienta'
        }
      },
      {
        id: 'event-4',
        title: 'Oběd',
        startTime: new Date(startDate.getTime() + 165 * 60 * 1000),
        duration: 60,
        type: 'break',
        location: {
          lat: 50.0793,
          lng: 14.4290,
          name: 'Restaurace U Zlatého Stromu'
        }
      },
      {
        id: 'event-5',
        title: 'Práce na projektu',
        description: 'Implementace nových funkcí',
        startTime: new Date(startDate.getTime() + 225 * 60 * 1000),
        duration: 180,
        type: 'task',
        location: {
          lat: 50.0755,
          lng: 14.4378,
          name: 'Kancelář'
        }
      },
      {
        id: 'event-6',
        title: 'Dokončení denních úkolů',
        startTime: new Date(startDate.getTime() + 405 * 60 * 1000),
        duration: 60,
        type: 'milestone',
        completed: true,
        location: {
          lat: 50.0755,
          lng: 14.4378,
          name: 'Kancelář'
        }
      }
    ]
  };
};
