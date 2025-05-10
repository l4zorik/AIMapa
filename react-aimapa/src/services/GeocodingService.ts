/**
 * GeocodingService - Služba pro vyhledávání míst a získávání souřadnic
 *
 * Tato služba používá Nominatim API (OpenStreetMap) pro vyhledávání míst podle názvu
 * a získávání informací o místech podle souřadnic.
 */

export interface GeocodingResult {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
  importance: number;
  address?: {
    country?: string;
    state?: string;
    county?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    road?: string;
    houseNumber?: string;
    postcode?: string;
  };
}

export interface GeocodingOptions {
  limit?: number;
  countryCode?: string;
  viewBox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  bounded?: boolean;
  language?: string;
}

class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org';
  private userAgent = 'AIMapa/0.4.2';
  private defaultCountryCode = 'cz'; // Výchozí země - Česká republika
  private defaultLimit = 5;
  private defaultLanguage = 'cs';

  /**
   * Vyhledání místa podle názvu
   * @param query Dotaz pro vyhledávání (název místa)
   * @param options Možnosti vyhledávání
   * @returns Promise s výsledky vyhledávání
   */
  async searchPlace(query: string, options: GeocodingOptions = {}): Promise<GeocodingResult[]> {
    try {
      // Vytvoření parametrů pro API požadavek
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: (options.limit || this.defaultLimit).toString(),
        addressdetails: '1',
        'accept-language': options.language || this.defaultLanguage
      });

      // Přidání kódu země, pokud je specifikován
      if (options.countryCode || this.defaultCountryCode) {
        params.append('countrycodes', options.countryCode || this.defaultCountryCode);
      }

      // Přidání viewBox, pokud je specifikován
      if (options.viewBox) {
        params.append('viewbox', options.viewBox.join(','));
        params.append('bounded', options.bounded ? '1' : '0');
      }

      // Odeslání požadavku
      const response = await fetch(`${this.nominatimUrl}/search?${params.toString()}`, {
        headers: {
          'User-Agent': this.userAgent
        }
      });

      if (!response.ok) {
        throw new Error(`Chyba při vyhledávání: ${response.status} ${response.statusText}`);
      }

      // Zpracování odpovědi
      const data = await response.json();

      // Mapování odpovědi na GeocodingResult
      return data.map((item: any) => ({
        id: item.place_id,
        name: item.name || this.extractNameFromDisplayName(item.display_name),
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        importance: item.importance,
        address: this.mapAddress(item.address)
      }));
    } catch (error) {
      console.error('Chyba při vyhledávání místa:', error);
      throw error;
    }
  }

  /**
   * Získání informací o místě podle souřadnic
   * @param lat Zeměpisná šířka
   * @param lng Zeměpisná délka
   * @param options Možnosti vyhledávání
   * @returns Promise s informacemi o místě
   */
  async reverseGeocode(lat: number, lng: number, options: Partial<GeocodingOptions> = {}): Promise<GeocodingResult> {
    try {
      // Vytvoření parametrů pro API požadavek
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lng.toString(),
        format: 'json',
        addressdetails: '1',
        'accept-language': options.language || this.defaultLanguage
      });

      // Odeslání požadavku
      const response = await fetch(`${this.nominatimUrl}/reverse?${params.toString()}`, {
        headers: {
          'User-Agent': this.userAgent
        }
      });

      if (!response.ok) {
        throw new Error(`Chyba při získávání informací o místě: ${response.status} ${response.statusText}`);
      }

      // Zpracování odpovědi
      const item = await response.json();

      // Mapování odpovědi na GeocodingResult
      return {
        id: item.place_id,
        name: item.name || this.extractNameFromDisplayName(item.display_name),
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        type: item.type,
        importance: item.importance || 0,
        address: this.mapAddress(item.address)
      };
    } catch (error) {
      console.error('Chyba při získávání informací o místě:', error);
      throw error;
    }
  }

  /**
   * Extrahování názvu z display_name
   * @param displayName Celý název místa
   * @returns Zkrácený název místa
   */
  private extractNameFromDisplayName(displayName: string): string {
    // Pokud display_name obsahuje čárku, vezmeme první část
    if (displayName && displayName.includes(',')) {
      return displayName.split(',')[0].trim();
    }
    return displayName || 'Neznámé místo';
  }

  /**
   * Mapování adresy z Nominatim API na strukturovanou adresu
   * @param address Adresa z Nominatim API
   * @returns Strukturovaná adresa
   */
  private mapAddress(address: any): GeocodingResult['address'] {
    if (!address) return {};

    return {
      country: address.country,
      state: address.state,
      county: address.county,
      city: address.city,
      town: address.town,
      village: address.village,
      suburb: address.suburb,
      road: address.road,
      houseNumber: address.house_number,
      postcode: address.postcode
    };
  }
}

// Vytvoření instance služby
const geocodingService = new GeocodingService();
export default geocodingService;
