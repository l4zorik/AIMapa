// Služba pro správu úložiště plánů
class PlanStorageService {
  private readonly PLANS_KEY = 'plans';
  private readonly PLANS_REMOVED_KEY = 'plans_permanently_removed';
  private readonly PLANS_REMOVED_TIMESTAMP_KEY = 'plans_removed_timestamp';

  // Načtení plánů z localStorage
  getPlans(): any[] {
    try {
      const savedPlans = localStorage.getItem(this.PLANS_KEY);
      if (!savedPlans) {
        return [];
      }
      return JSON.parse(savedPlans);
    } catch (error) {
      console.error('Chyba při načítání plánů:', error);
      return [];
    }
  }

  // Uložení plánů do localStorage
  savePlans(plans: any[]): void {
    try {
      localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans));
    } catch (error) {
      console.error('Chyba při ukládání plánů:', error);
    }
  }

  // Přidání nového plánu
  addPlan(plan: any): void {
    const plans = this.getPlans();
    plans.push(plan);
    this.savePlans(plans);
  }

  // Aktualizace existujícího plánu
  updatePlan(planId: string, updates: any): boolean {
    const plans = this.getPlans();
    const planIndex = plans.findIndex(p => p.id === planId);
    
    if (planIndex === -1) {
      return false;
    }

    plans[planIndex] = { ...plans[planIndex], ...updates };
    this.savePlans(plans);
    return true;
  }

  // Odstranění plánu
  removePlan(planId: string): boolean {
    const plans = this.getPlans();
    const filteredPlans = plans.filter(p => p.id !== planId);
    
    if (filteredPlans.length === plans.length) {
      return false; // Plán nebyl nalezen
    }

    this.savePlans(filteredPlans);
    return true;
  }

  // Odstranění všech plánů
  removeAllPlans(): void {
    localStorage.removeItem(this.PLANS_KEY);
    this.setPlansRemovedFlag();
  }

  // Nastavení příznaku trvalého odstranění
  setPlansRemovedFlag(): void {
    localStorage.setItem(this.PLANS_REMOVED_KEY, 'true');
    localStorage.setItem(this.PLANS_REMOVED_TIMESTAMP_KEY, new Date().toISOString());
  }

  // Kontrola, zda byly plány trvale odstraněny
  werePlansRemoved(): boolean {
    return localStorage.getItem(this.PLANS_REMOVED_KEY) === 'true';
  }

  // Resetování příznaku trvalého odstranění
  resetPlansRemovedFlag(): void {
    localStorage.removeItem(this.PLANS_REMOVED_KEY);
    localStorage.removeItem(this.PLANS_REMOVED_TIMESTAMP_KEY);
  }

  // Získání časového razítka odstranění
  getPlansRemovedTimestamp(): Date | null {
    const timestamp = localStorage.getItem(this.PLANS_REMOVED_TIMESTAMP_KEY);
    return timestamp ? new Date(timestamp) : null;
  }

  // Najití plánu podle ID
  findPlan(planId: string): any | null {
    const plans = this.getPlans();
    return plans.find(p => p.id === planId) || null;
  }

  // Najití úkolu v plánech
  findTask(taskId: string): { plan: any; task: any; taskIndex: number } | null {
    const plans = this.getPlans();
    
    for (const plan of plans) {
      if (!plan.items || !Array.isArray(plan.items)) continue;
      
      const taskIndex = plan.items.findIndex((item: any) => item.id === taskId);
      if (taskIndex !== -1) {
        return {
          plan,
          task: plan.items[taskIndex],
          taskIndex
        };
      }
    }
    
    return null;
  }

  // Aktualizace úkolu
  updateTask(taskId: string, updates: any): boolean {
    const result = this.findTask(taskId);
    if (!result) {
      return false;
    }

    const { plan, taskIndex } = result;
    plan.items[taskIndex] = { ...plan.items[taskIndex], ...updates };
    
    return this.updatePlan(plan.id, plan);
  }

  // Přidání úkolu do plánu
  addTaskToPlan(planId: string, task: any): boolean {
    const plan = this.findPlan(planId);
    if (!plan) {
      return false;
    }

    if (!plan.items) {
      plan.items = [];
    }

    plan.items.push(task);
    return this.updatePlan(planId, plan);
  }

  // Odstranění úkolu z plánu
  removeTaskFromPlan(planId: string, taskId: string): boolean {
    const plan = this.findPlan(planId);
    if (!plan || !plan.items) {
      return false;
    }

    const filteredItems = plan.items.filter((item: any) => item.id !== taskId);
    if (filteredItems.length === plan.items.length) {
      return false; // Úkol nebyl nalezen
    }

    plan.items = filteredItems;
    return this.updatePlan(planId, plan);
  }

  // Vyčištění všech dat
  clearAll(): void {
    localStorage.removeItem(this.PLANS_KEY);
    localStorage.removeItem(this.PLANS_REMOVED_KEY);
    localStorage.removeItem(this.PLANS_REMOVED_TIMESTAMP_KEY);
  }

  // Export plánů
  exportPlans(): string {
    const plans = this.getPlans();
    return JSON.stringify(plans, null, 2);
  }

  // Import plánů
  importPlans(plansJson: string): boolean {
    try {
      const plans = JSON.parse(plansJson);
      if (!Array.isArray(plans)) {
        throw new Error('Neplatný formát dat');
      }
      this.savePlans(plans);
      return true;
    } catch (error) {
      console.error('Chyba při importu plánů:', error);
      return false;
    }
  }

  // Statistiky
  getStats(): {
    totalPlans: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  } {
    const plans = this.getPlans();
    let totalTasks = 0;
    let completedTasks = 0;

    plans.forEach(plan => {
      if (plan.items && Array.isArray(plan.items)) {
        totalTasks += plan.items.length;
        completedTasks += plan.items.filter((item: any) => item.completed).length;
      }
    });

    return {
      totalPlans: plans.length,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks
    };
  }
}

// Singleton instance
const planStorageService = new PlanStorageService();
export default planStorageService;
