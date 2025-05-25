// import { SubscriptionPlan } from '../components/Subscription/SubscriptionPlans'; 
// Assuming SubscriptionPlan is defined in this file or imported correctly.
// For the purpose of this change, let's define it here if not already.

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  apiLimits: {
    requestsPerDay: number;
    tokensPerMonth: number;
    maxCostPerRequest: number;
  };
  mapFeatures: {
    offlineAccess: boolean;
    customMarkers: boolean;
    routeOptimization: boolean;
    maxSavedLocations: number;
  };
  aiFeatures: {
    models: string[];
    maxContextLength: number;
    priorityProcessing: boolean;
  };
  isPopular?: boolean;
  stripeProductId: string; // User needs to replace with actual Stripe Product ID
  stripePriceId: string;   // User needs to replace with actual Stripe Price ID
}

// Definice typu pro uživatelské předplatné
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'canceled' | 'expired';
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
}

// Definice typu pro historii plateb
export interface PaymentHistory {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  date: Date;
  status: 'successful' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
}

// Definice typu pro využití API
export interface ApiUsage {
  userId: string;
  period: string; // např. '2023-05'
  requestsCount: number;
  tokensCount: number;
  cost: number;
}

// Služba pro správu předplatného
class SubscriptionService {
  // Základní URL pro API
  private baseUrl: string = '/api/subscription';
  
  // Aktuální předplatné uživatele
  private currentSubscription: UserSubscription | null = null;
  
  // Dostupné plány předplatného
  private availablePlans: SubscriptionPlan[] = [];
  
  // Načtení plánů předplatného
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      // V reálné aplikaci by se plány načítaly z API
      // const response = await fetch(`${this.baseUrl}/plans`);
      // if (!response.ok) throw new Error('Nepodařilo se načíst plány předplatného');
      // const data = await response.json();
      // this.availablePlans = data;
      
      // Pro účely ukázky vrátíme statická data
      this.availablePlans = [
        {
          id: 'free',
          name: 'Zdarma',
          price: 0,
          currency: 'CZK',
          interval: 'měsíčně',
          stripeProductId: 'prod_placeholder_free', // User needs to replace with actual Stripe Product ID
          stripePriceId: 'price_placeholder_free',   // User needs to replace with actual Stripe Price ID (or this plan might be managed without Stripe)
          features: [
            'Základní funkce mapy',
            'Omezený počet API požadavků (10/den)',
            'Základní modely AI',
            'Maximálně 10 uložených míst',
            'Obsahuje reklamy'
          ],
          apiLimits: {
            requestsPerDay: 10,
            tokensPerMonth: 10000,
            maxCostPerRequest: 0.05
          },
          mapFeatures: {
            offlineAccess: false,
            customMarkers: false,
            routeOptimization: false,
            maxSavedLocations: 10
          },
          aiFeatures: {
            models: ['Gemini 1.5 Flash'],
            maxContextLength: 2000,
            priorityProcessing: false
          }
        },
        {
          id: 'basic',
          name: 'Základní',
          price: 99,
          currency: 'CZK',
          interval: 'měsíčně',
          stripeProductId: 'prod_placeholder_basic', // User needs to replace with actual Stripe Product ID
          stripePriceId: 'price_placeholder_basic',   // User needs to replace with actual Stripe Price ID
          features: [
            'Rozšířené funkce mapy',
            'Více API požadavků (50/den)',
            'Standardní modely AI',
            'Maximálně 50 uložených míst',
            'Méně reklam'
          ],
          apiLimits: {
            requestsPerDay: 50,
            tokensPerMonth: 50000,
            maxCostPerRequest: 0.20
          },
          mapFeatures: {
            offlineAccess: false,
            customMarkers: true,
            routeOptimization: false,
            maxSavedLocations: 50
          },
          aiFeatures: {
            models: ['Gemini 1.5 Flash', 'GPT-4o-mini'],
            maxContextLength: 4000,
            priorityProcessing: false
          },
          isPopular: true
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 199,
          currency: 'CZK',
          interval: 'měsíčně',
          stripeProductId: 'prod_placeholder_premium', // User needs to replace with actual Stripe Product ID
          stripePriceId: 'price_placeholder_premium',   // User needs to replace with actual Stripe Price ID
          features: [
            'Pokročilé funkce mapy včetně offline přístupu',
            'Vysoký počet API požadavků (200/den)',
            'Prémiové modely AI',
            'Neomezený počet uložených míst',
            'Bez reklam'
          ],
          apiLimits: {
            requestsPerDay: 200,
            tokensPerMonth: 200000,
            maxCostPerRequest: 0.50
          },
          mapFeatures: {
            offlineAccess: true,
            customMarkers: true,
            routeOptimization: true,
            maxSavedLocations: 500
          },
          aiFeatures: {
            models: ['Gemini 1.5 Flash', 'GPT-4o', 'Claude 3'],
            maxContextLength: 8000,
            priorityProcessing: true
          }
        },
        {
          id: 'ultimate',
          name: 'Ultimate',
          price: 499,
          currency: 'CZK',
          interval: 'měsíčně',
          stripeProductId: 'prod_placeholder_ultimate', // User needs to replace with actual Stripe Product ID
          stripePriceId: 'price_placeholder_ultimate',   // User needs to replace with actual Stripe Price ID
          features: [
            'Všechny funkce mapy bez omezení',
            'Neomezený počet API požadavků',
            'Všechny dostupné modely AI',
            'Neomezený počet uložených míst',
            'Prioritní podpora',
            'Bez reklam'
          ],
          apiLimits: {
            requestsPerDay: 1000,
            tokensPerMonth: 1000000,
            maxCostPerRequest: 2.00
          },
          mapFeatures: {
            offlineAccess: true,
            customMarkers: true,
            routeOptimization: true,
            maxSavedLocations: 9999
          },
          aiFeatures: {
            models: ['Gemini 1.5 Flash', 'GPT-4o', 'Claude 3', 'DeepSeek'],
            maxContextLength: 16000,
            priorityProcessing: true
          }
        }
      ];
      
      return this.availablePlans;
    } catch (error) {
      console.error('Chyba při načítání plánů předplatného:', error);
      throw error;
    }
  }
  
  // Získání aktuálního předplatného uživatele
  async getCurrentSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      // V reálné aplikaci by se předplatné načítalo z API
      // const response = await fetch(`${this.baseUrl}/users/${userId}/subscription`);
      // if (!response.ok) throw new Error('Nepodařilo se načíst předplatné uživatele');
      // const data = await response.json();
      // this.currentSubscription = data;
      
      // Pro účely ukázky vrátíme statická data
      this.currentSubscription = {
        id: 'sub_123456',
        userId: userId,
        planId: 'free',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dní
        status: 'active',
        autoRenew: true
      };
      
      return this.currentSubscription;
    } catch (error) {
      console.error('Chyba při načítání předplatného uživatele:', error);
      return null;
    }
  }
  
  // Změna předplatného
  async changePlan(userId: string, planId: string): Promise<UserSubscription | null> {
    try {
      // V reálné aplikaci by se předplatné měnilo přes API
      // const response = await fetch(`${this.baseUrl}/users/${userId}/subscription`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ planId })
      // });
      // if (!response.ok) throw new Error('Nepodařilo se změnit předplatné');
      // const data = await response.json();
      // this.currentSubscription = data;
      
      // Pro účely ukázky vrátíme statická data
      this.currentSubscription = {
        id: 'sub_123456',
        userId: userId,
        planId: planId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dní
        status: 'active',
        autoRenew: true
      };
      
      return this.currentSubscription;
    } catch (error) {
      console.error('Chyba při změně předplatného:', error);
      return null;
    }
  }
  
  // Zrušení předplatného
  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      // V reálné aplikaci by se předplatné rušilo přes API
      // const response = await fetch(`${this.baseUrl}/users/${userId}/subscription`, {
      //   method: 'DELETE'
      // });
      // if (!response.ok) throw new Error('Nepodařilo se zrušit předplatné');
      
      // Pro účely ukázky vrátíme true
      if (this.currentSubscription) {
        this.currentSubscription.status = 'canceled';
        this.currentSubscription.autoRenew = false;
      }
      
      return true;
    } catch (error) {
      console.error('Chyba při rušení předplatného:', error);
      return false;
    }
  }
}

// Export instance služby
export default new SubscriptionService();
