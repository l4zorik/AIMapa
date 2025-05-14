// Konfigurace pro mapové služby
export const MAP_CONFIG = {
  // Konfigurace pro OpenRouteService
  openRouteService: {
    apiKey: '5b3ce3597851110001cf6248f8f3f5e5a0a94a5c8e9e7e7e9e7e7e9e', // Testovací API klíč
    baseUrl: 'https://api.openrouteservice.org'
  },

  // Konfigurace pro Mapbox
  mapbox: {
    apiKey: '', // Doplňte svůj API klíč
    baseUrl: 'https://api.mapbox.com'
  },

  // Konfigurace pro Google Maps
  googleMaps: {
    apiKey: '', // Doplňte svůj API klíč
    baseUrl: 'https://maps.googleapis.com'
  },

  // Konfigurace pro Mapy.cz
  mapycz: {
    apiKey: '', // Doplňte svůj API klíč (pokud je potřeba)
    baseUrl: 'https://api.mapy.cz'
  },

  // Výchozí nastavení mapy
  defaultSettings: {
    center: [50.0755, 14.4378], // Praha
    zoom: 13,
    provider: 'openstreetmap',
    minZoom: 3,
    maxZoom: 19
  }
};

export default MAP_CONFIG;