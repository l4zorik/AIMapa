/**
 * TimelineService.ts
 * Služba pro práci s časovou osou
 */

import type { TimelinePlan, TimelineEventType as TimelineEvent } from '../components/Timeline';
import { generateSamplePlan } from '../components/Timeline/timelineUtils';

/**
 * Rozhraní pro parametry výpočtu časové osy
 */
interface TimelineCalculationParams {
  planId: string;
  startDate?: Date;
  endDate?: Date;
  optimizeFor?: 'time' | 'distance' | 'cost';
  transportMode?: 'car' | 'public' | 'walk' | 'bike';
  includeBreaks?: boolean;
  breakDuration?: number; // v minutách
  workingHoursStart?: number; // 0-23
  workingHoursEnd?: number; // 0-23
}

/**
 * Služba pro práci s časovou osou
 */
class TimelineService {
  /**
   * Získá plán podle ID
   * @param planId ID plánu
   * @returns Promise s plánem
   */
  async getPlan(planId: string): Promise<TimelinePlan> {
    // TODO: Implementovat volání API pro získání plánu

    // Pro ukázku vrátíme vygenerovaný plán
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateSamplePlan());
      }, 1000);
    });
  }

  /**
   * Vypočítá časovou osu pro plán
   * @param params Parametry výpočtu
   * @returns Promise s vypočítaným plánem
   */
  async calculateTimeline(params: TimelineCalculationParams): Promise<TimelinePlan> {
    // TODO: Implementovat volání API pro výpočet časové osy

    // Pro ukázku vrátíme vygenerovaný plán
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = generateSamplePlan();

        // Upravíme plán podle parametrů
        if (params.startDate) {
          plan.startDate = new Date(params.startDate);

          // Aktualizujeme časy událostí
          let currentTime = new Date(params.startDate);
          plan.events = plan.events.map(event => {
            const newEvent = { ...event, startTime: new Date(currentTime) };

            if (event.duration) {
              const endTime = new Date(currentTime.getTime() + event.duration * 60 * 1000);
              newEvent.endTime = endTime;
              currentTime = new Date(endTime);
            } else if (event.endTime) {
              const duration = (event.endTime.getTime() - event.startTime.getTime()) / (60 * 1000);
              currentTime = new Date(currentTime.getTime() + duration * 60 * 1000);
              newEvent.endTime = new Date(currentTime);
            } else {
              // Výchozí trvání 30 minut
              currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
              newEvent.endTime = new Date(currentTime);
              newEvent.duration = 30;
            }

            return newEvent;
          });

          // Nastavíme koncové datum plánu
          plan.endDate = new Date(currentTime);
        }

        resolve(plan);
      }, 1500);
    });
  }

  /**
   * Aktualizuje událost v plánu
   * @param planId ID plánu
   * @param eventId ID události
   * @param event Aktualizovaná událost
   * @returns Promise s aktualizovaným plánem
   */
  async updateEvent(planId: string, eventId: string, event: Partial<TimelineEvent>): Promise<TimelinePlan> {
    // TODO: Implementovat volání API pro aktualizaci události

    // Pro ukázku vrátíme vygenerovaný plán s aktualizovanou událostí
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = generateSamplePlan();

        // Najdeme a aktualizujeme událost
        plan.events = plan.events.map(e => {
          if (e.id === eventId) {
            return { ...e, ...event };
          }
          return e;
        });

        resolve(plan);
      }, 1000);
    });
  }

  /**
   * Přidá novou událost do plánu
   * @param planId ID plánu
   * @param event Nová událost
   * @returns Promise s aktualizovaným plánem
   */
  async addEvent(planId: string, event: Omit<TimelineEvent, 'id'>): Promise<TimelinePlan> {
    // TODO: Implementovat volání API pro přidání události

    // Pro ukázku vrátíme vygenerovaný plán s novou událostí
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = generateSamplePlan();

        // Přidáme novou událost
        const newEvent: TimelineEvent = {
          id: `event-${Date.now()}`,
          ...event
        };

        plan.events.push(newEvent);

        resolve(plan);
      }, 1000);
    });
  }

  /**
   * Odstraní událost z plánu
   * @param planId ID plánu
   * @param eventId ID události
   * @returns Promise s aktualizovaným plánem
   */
  async removeEvent(planId: string, eventId: string): Promise<TimelinePlan> {
    // TODO: Implementovat volání API pro odstranění události

    // Pro ukázku vrátíme vygenerovaný plán bez odstraněné události
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = generateSamplePlan();

        // Odstraníme událost
        plan.events = plan.events.filter(e => e.id !== eventId);

        resolve(plan);
      }, 1000);
    });
  }
}

export default new TimelineService();
