/**
 * Utility funkce pro práci s lokacemi a vzdálenostmi
 */

export interface MapLocation {
  lat: number;
  lng: number;
  name?: string;
}

/**
 * Výpočet vzdálenosti mezi dvěma body pomocí Haversine formule
 * @param lat1 Zeměpisná šířka prvního bodu
 * @param lng1 Zeměpisná délka prvního bodu
 * @param lat2 Zeměpisná šířka druhého bodu
 * @param lng2 Zeměpisná délka druhého bodu
 * @returns Vzdálenost v kilometrech
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Poloměr Země v kilometrech
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Vzdálenost v kilometrech
  return distance;
};

/**
 * Převod stupňů na radiány
 * @param deg Stupně
 * @returns Radiány
 */
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Kontrola, zda je lokace v maximální vzdálenosti od aktuální polohy uživatele
 * @param location Lokace k ověření
 * @param userLocation Aktuální poloha uživatele
 * @param maxDistance Maximální povolená vzdálenost v kilometrech (výchozí: 10 km)
 * @returns True, pokud je lokace v povolené vzdálenosti, jinak false
 */
export const isLocationWithinDistance = (
  location: MapLocation,
  userLocation: MapLocation,
  maxDistance: number = 10
): boolean => {
  if (!location || !userLocation) {
    return false;
  }

  const distance = calculateDistance(
    location.lat,
    location.lng,
    userLocation.lat,
    userLocation.lng
  );

  return distance <= maxDistance;
};

/**
 * Formátování vzdálenosti pro zobrazení
 * @param distanceInMeters Vzdálenost v metrech
 * @returns Formátovaný řetězec s jednotkou (m nebo km)
 */
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  } else {
    return `${(distanceInMeters / 1000).toFixed(2)} km`;
  }
};

/**
 * Získání vzdálenosti mezi dvěma lokacemi
 * @param location1 První lokace
 * @param location2 Druhá lokace
 * @returns Vzdálenost v kilometrech
 */
export const getDistanceBetweenLocations = (
  location1: MapLocation,
  location2: MapLocation
): number => {
  return calculateDistance(
    location1.lat,
    location1.lng,
    location2.lat,
    location2.lng
  );
};
