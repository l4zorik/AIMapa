/**
 * RoutingService - Služba pro vyhledávání tras a výpočet cestovních časů
 *
 * Tato služba používá OpenRouteService API pro vyhledávání tras mezi body,
 * které sledují silnice a cesty. Také poskytuje informace o cestovních časech a vzdálenostech.
 */

// Typy pro OpenRouteService API
export interface RoutingPoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface RoutingOptions {
  profile?: 'driving-car' | 'driving-hgv' | 'cycling-regular' | 'cycling-road' | 'cycling-mountain' | 'cycling-electric' | 'foot-walking' | 'foot-hiking' | 'wheelchair';
  preference?: 'fastest' | 'shortest' | 'recommended';
  avoidFeatures?: ('highways' | 'tollways' | 'ferries' | 'fords' | 'steps')[];
}

export interface RouteSegment {
  distance: number; // v metrech
  duration: number; // v sekundách
  instruction: string;
  name: string;
  type: string;
  waypoints: [number, number][]; // body trasy pro tento segment
}

export interface RouteResult {
  geometry: [number, number][]; // body trasy
  distance: number; // celková vzdálenost v metrech
  duration: number; // celkový čas v sekundách
  segments?: RouteSegment[]; // segmenty trasy s instrukcemi
  bbox?: [number, number, number, number]; // hranice trasy [minLng, minLat, maxLng, maxLat]
}

class RoutingService {
  private apiKey: string | null = null;
  private apiUrl = 'https://api.openrouteservice.org/v2/directions';
  private geocodeUrl = 'https://api.openrouteservice.org/geocode/search';

  // Nastavení API klíče
  setApiKey(key: string) {
    console.log('Nastavuji OpenRouteService API klíč:', key.substring(0, 6) + '...');
    this.apiKey = key;

    // Uložení API klíče do localStorage pro zachování po reloadu
    try {
      localStorage.setItem('openRouteServiceApiKey', key);
      console.log('OpenRouteService API klíč uložen do localStorage');
    } catch (error) {
      console.error('Chyba při ukládání OpenRouteService API klíče do localStorage:', error);
    }
  }

  // Získání API klíče
  getApiKey(): string | null {
    // Pokud nemáme API klíč v paměti, zkusíme ho načíst z localStorage
    if (!this.apiKey) {
      try {
        const savedKey = localStorage.getItem('openRouteServiceApiKey');
        if (savedKey) {
          console.log('Načítám OpenRouteService API klíč z localStorage:', savedKey.substring(0, 6) + '...');
          this.apiKey = savedKey;
        }
      } catch (error) {
        console.error('Chyba při načítání OpenRouteService API klíče z localStorage:', error);
      }
    }

    return this.apiKey;
  }

  // Vyhledání trasy mezi dvěma body
  async getRoute(
    start: RoutingPoint,
    end: RoutingPoint,
    options: RoutingOptions = {}
  ): Promise<RouteResult> {
    if (!this.apiKey) {
      throw new Error('API klíč není nastaven');
    }

    try {
      // Nastavení výchozích hodnot
      const profile = options.profile || 'driving-car';
      const preference = options.preference || 'recommended';

      // Vytvoření URL pro API požadavek
      const url = `${this.apiUrl}/${profile}`;

      // Vytvoření těla požadavku
      const body = {
        coordinates: [
          [start.lng, start.lat],
          [end.lng, end.lat]
        ],
        preference: preference,
        instructions: true,
        units: 'km',
        language: 'cs',
        geometry: true,
        format: 'geojson'
      };

      // Přidání vyhýbání se určitým prvkům, pokud jsou specifikovány
      if (options.avoidFeatures && options.avoidFeatures.length > 0) {
        const bodyWithOptions = body as any;
        bodyWithOptions.options = {
          avoid_features: options.avoidFeatures
        };
      }

      // Odeslání požadavku
      console.log(`Odesílám požadavek na ${url} s daty:`, {
        coordinates: body.coordinates,
        preference: body.preference,
        format: body.format
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Chyba API: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();

      // Zpracování odpovědi
      if (!data.features || data.features.length === 0) {
        console.error('Odpověď neobsahuje žádné trasy:', data);
        throw new Error('Odpověď API neobsahuje žádné trasy');
      }

      const route = data.features[0];

      // Kontrola, zda geometrie existuje a má správný formát
      if (!route.geometry || !route.geometry.coordinates || !Array.isArray(route.geometry.coordinates)) {
        console.error('Geometrie trasy má neplatný formát:', route.geometry);
        throw new Error('Geometrie trasy má neplatný formát');
      }

      // Důležité: OpenRouteService vrací souřadnice ve formátu [lng, lat], ale Leaflet očekává [lat, lng]
      // Proto musíme prohodit souřadnice
      const geometry = route.geometry.coordinates.map((coord: number[]) => {
        if (!Array.isArray(coord) || coord.length < 2) {
          console.error('Neplatný formát souřadnice:', coord);
          return [0, 0]; // Fallback pro neplatné souřadnice
        }
        return [coord[1], coord[0]];
      }) as [number, number][];

      console.log('Zpracovávám geometrii trasy z API, počet bodů:', route.geometry.coordinates.length);
      console.log('Převedená geometrie pro Leaflet, počet bodů:', geometry.length);

      const properties = route.properties;

      // Vytvoření výsledku
      const result: RouteResult = {
        geometry: geometry,
        distance: properties.summary.distance * 1000, // převod na metry
        duration: properties.summary.duration, // v sekundách
        bbox: route.bbox ? [route.bbox[0], route.bbox[1], route.bbox[2], route.bbox[3]] : undefined
      };

      // Přidání segmentů trasy, pokud existují
      if (properties.segments && properties.segments.length > 0) {
        result.segments = properties.segments.map((segment: any) => ({
          distance: segment.distance * 1000, // převod na metry
          duration: segment.duration, // v sekundách
          instruction: segment.instruction || '',
          name: segment.name || '',
          type: segment.type || '',
          waypoints: segment.steps.map((step: any) => [step.lat, step.lng])
        }));
      }

      return result;
    } catch (error) {
      console.error('Chyba při vyhledávání trasy:', error);
      throw error;
    }
  }

  // Formátování času trasy do čitelné podoby
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} h ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  }

  // Formátování vzdálenosti do čitelné podoby
  formatDistance(meters: number): string {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    } else {
      return `${Math.round(meters)} m`;
    }
  }
}

// Vytvoření instance služby
const routingService = new RoutingService();
export default routingService;
