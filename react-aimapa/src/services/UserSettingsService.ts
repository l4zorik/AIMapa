/**
 * UserSettingsService - Služba pro správu uživatelských nastavení
 * 
 * Tato služba poskytuje metody pro ukládání a načítání uživatelských nastavení
 * z localStorage, včetně adresy bydliště uživatele.
 */

import geocodingService, { GeocodingResult } from './GeocodingService';

// Rozhraní pro adresu bydliště
export interface HomeAddress {
  address: string;
  displayName: string;
  lat: number;
  lng: number;
  timestamp: number;
}

// Rozhraní pro uživatelská nastavení
export interface UserSettings {
  homeAddress?: HomeAddress;
  darkMode?: boolean;
  language?: string;
  mapProvider?: string;
  notifications?: boolean;
}

class UserSettingsService {
  private readonly SETTINGS_KEY = 'aiMapaUserSettings';
  
  /**
   * Získání všech uživatelských nastavení
   * @returns Uživatelská nastavení
   */
  getSettings(): UserSettings {
    try {
      const settingsJson = localStorage.getItem(this.SETTINGS_KEY);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
    } catch (error) {
      console.error('Chyba při načítání uživatelských nastavení:', error);
    }
    
    return {};
  }
  
  /**
   * Uložení uživatelských nastavení
   * @param settings Uživatelská nastavení
   */
  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      console.log('Uživatelská nastavení byla uložena');
      
      // Vyvolání události pro informování ostatních komponent
      const event = new CustomEvent('userSettingsUpdated', {
        detail: { settings }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Chyba při ukládání uživatelských nastavení:', error);
    }
  }
  
  /**
   * Aktualizace části uživatelských nastavení
   * @param partialSettings Částečná uživatelská nastavení
   */
  updateSettings(partialSettings: Partial<UserSettings>): void {
    const currentSettings = this.getSettings();
    this.saveSettings({ ...currentSettings, ...partialSettings });
  }
  
  /**
   * Získání adresy bydliště
   * @returns Adresa bydliště nebo undefined, pokud není nastavena
   */
  getHomeAddress(): HomeAddress | undefined {
    const settings = this.getSettings();
    return settings.homeAddress;
  }
  
  /**
   * Nastavení adresy bydliště
   * @param address Adresa bydliště
   */
  setHomeAddress(address: HomeAddress): void {
    this.updateSettings({ homeAddress: address });
  }
  
  /**
   * Vyhledání adresy a její uložení jako adresa bydliště
   * @param addressText Textový popis adresy
   * @returns Promise s výsledkem vyhledávání
   */
  async searchAndSetHomeAddress(addressText: string): Promise<HomeAddress> {
    try {
      // Vyhledání adresy pomocí GeocodingService
      const results = await geocodingService.searchPlace(addressText);
      
      if (results.length === 0) {
        throw new Error('Adresa nebyla nalezena');
      }
      
      // Použití prvního výsledku
      const result = results[0];
      
      // Vytvoření objektu adresy bydliště
      const homeAddress: HomeAddress = {
        address: addressText,
        displayName: result.displayName,
        lat: result.lat,
        lng: result.lng,
        timestamp: Date.now()
      };
      
      // Uložení adresy bydliště
      this.setHomeAddress(homeAddress);
      
      return homeAddress;
    } catch (error) {
      console.error('Chyba při vyhledávání adresy:', error);
      throw error;
    }
  }
  
  /**
   * Odstranění adresy bydliště
   */
  removeHomeAddress(): void {
    const settings = this.getSettings();
    if (settings.homeAddress) {
      delete settings.homeAddress;
      this.saveSettings(settings);
    }
  }
}

// Vytvoření instance služby
const userSettingsService = new UserSettingsService();
export default userSettingsService;
