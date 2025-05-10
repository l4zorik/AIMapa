import React, { useState, useEffect, useRef } from 'react';
import geocodingService, { GeocodingResult } from '../../services/GeocodingService';
import geolocationService from '../../services/GeolocationService';
import './LocationSelector.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationSelectorProps {
  onSelectLocation: (location: { lat: number; lng: number; name: string }) => void;
  onCancel: () => void;
  taskTitle?: string;
  initialQuery?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onSelectLocation,
  onCancel,
  taskTitle,
  initialQuery
}) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [loadingUserLocation, setLoadingUserLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Inicializace mapy
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Vytvoření mapy
    const leafletMap = L.map(mapRef.current, {
      center: [50.0755, 14.4378], // Praha jako výchozí
      zoom: 13,
      zoomControl: true,
      attributionControl: true
    });

    // Přidání vrstvy OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 3
    }).addTo(leafletMap);

    // Nastavení události kliknutí na mapu
    leafletMap.on('click', (e) => {
      updateMarkerPosition(e.latlng.lat, e.latlng.lng);
    });

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, []);

  // Aktualizace markeru při změně vybrané lokace
  useEffect(() => {
    if (!map) return;

    // Pokud máme vybranou lokaci, zobrazíme ji na mapě
    if (selectedLocation) {
      map.setView([selectedLocation.lat, selectedLocation.lng], 15);

      // Pokud už existuje marker, aktualizujeme jeho pozici
      if (marker) {
        marker.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      } else {
        // Vytvoření nového přetažitelného markeru
        const newMarker = L.marker([selectedLocation.lat, selectedLocation.lng], {
          draggable: true,
          title: 'Přetáhněte pro změnu pozice',
          icon: L.icon({
            iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(map);

        // Přidání události pro aktualizaci pozice při přetažení
        newMarker.on('dragend', async () => {
          const position = newMarker.getLatLng();
          updateMarkerPosition(position.lat, position.lng);
        });

        setMarker(newMarker);
      }
    }
  }, [map, selectedLocation]);

  // Funkce pro aktualizaci pozice markeru
  const updateMarkerPosition = async (lat: number, lng: number) => {
    try {
      // Získání informací o místě pomocí reverzního geocodingu
      const locationInfo = await geocodingService.reverseGeocode(lat, lng);

      setSelectedLocation({
        lat,
        lng,
        name: locationInfo.name || `Místo (${lat.toFixed(6)}, ${lng.toFixed(6)})`
      });
    } catch (err) {
      console.error('Chyba při získávání informací o místě:', err);

      // I když se nepodařilo získat informace, stále aktualizujeme pozici
      setSelectedLocation({
        lat,
        lng,
        name: `Místo (${lat.toFixed(6)}, ${lng.toFixed(6)})`
      });
    }
  };

  // Načtení výsledků při změně dotazu
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  // Funkce pro vyhledávání míst
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await geocodingService.searchPlace(query);
      setResults(searchResults);
    } catch (err) {
      console.error('Chyba při vyhledávání:', err);
      setError('Nepodařilo se vyhledat místa. Zkuste to prosím znovu.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Funkce pro získání aktuální polohy uživatele
  const handleGetUserLocation = async () => {
    setLoadingUserLocation(true);
    setError(null);

    try {
      const position = await geolocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Získání informací o místě pomocí reverzního geocodingu
      const locationInfo = await geocodingService.reverseGeocode(latitude, longitude);

      const location = {
        lat: latitude,
        lng: longitude,
        name: locationInfo.name || 'Moje poloha'
      };

      setUserLocation(location);

      // Také nastavíme jako vybranou lokaci pro zobrazení na mapě
      setSelectedLocation(location);
    } catch (err) {
      console.error('Chyba při získávání polohy:', err);
      setError('Nepodařilo se získat vaši polohu. Zkontrolujte, zda máte povolené sdílení polohy.');
    } finally {
      setLoadingUserLocation(false);
    }
  };

  // Funkce pro výběr místa
  const handleSelectPlace = (result: GeocodingResult) => {
    const location = {
      lat: result.lat,
      lng: result.lng,
      name: result.name
    };

    // Aktualizace vybrané lokace pro zobrazení na mapě
    setSelectedLocation(location);

    // Volitelně můžeme rovnou potvrdit výběr
    // onSelectLocation(location);
  };

  // Funkce pro výběr aktuální polohy
  const handleSelectUserLocation = () => {
    if (userLocation) {
      // Aktualizace vybrané lokace pro zobrazení na mapě
      setSelectedLocation(userLocation);

      // Volitelně můžeme rovnou potvrdit výběr
      // onSelectLocation(userLocation);
    }
  };

  // Funkce pro potvrzení vybrané lokace
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
    }
  };

  return (
    <div className="location-selector">
      <div className="location-selector-header">
        <h3>Vyberte lokaci{taskTitle ? ` pro úkol "${taskTitle}"` : ''}</h3>
        <button className="close-button" onClick={onCancel}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="location-selector-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Zadejte název místa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-search"></i>}
          </button>
        </div>

        <div className="user-location-container">
          <button
            className="user-location-button"
            onClick={handleGetUserLocation}
            disabled={loadingUserLocation}
          >
            {loadingUserLocation ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Získávám polohu...</span>
              </>
            ) : (
              <>
                <i className="fas fa-location-arrow"></i>
                <span>Použít moji aktuální polohu</span>
              </>
            )}
          </button>

          {userLocation && (
            <div className="user-location-result">
              <div className="location-info">
                <i className="fas fa-map-marker-alt"></i>
                <span>{userLocation.name}</span>
                <small>{userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</small>
              </div>
              <button
                className="select-location-button"
                onClick={handleSelectUserLocation}
              >
                <i className="fas fa-check"></i>
                <span>Vybrat</span>
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Mini mapa pro přetažení markeru */}
        <div className="mini-map-container">
          <div ref={mapRef} className="mini-map"></div>

          {/* Elegantní ukazatel souřadnic */}
          {selectedLocation && (
            <div className="coordinates-display">
              <i className="fas fa-map-pin"></i>
              <span className="coordinates-value">
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </span>
            </div>
          )}

          {/* Nápověda pro přetažení markeru */}
          <div className="draggable-marker-hint">
            <i className="fas fa-hand-pointer"></i>
            <span>Přetáhněte marker pro upřesnění polohy</span>
          </div>
        </div>

        {/* Tlačítko pro potvrzení vybrané lokace */}
        {selectedLocation && (
          <div className="selected-location-container">
            <div className="selected-location-info">
              <i className="fas fa-map-marker-alt"></i>
              <div className="location-details">
                <span className="location-name">{selectedLocation.name}</span>
                <small className="location-coordinates">{selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</small>
              </div>
            </div>
            <button
              className="select-location-button"
              onClick={handleConfirmLocation}
            >
              <i className="fas fa-check"></i>
              <span>Potvrdit výběr</span>
            </button>
          </div>
        )}

        <div className="results-container">
          {results.length > 0 ? (
            <ul className="location-results">
              {results.map((result) => (
                <li key={result.id} className="location-result-item">
                  <div className="location-info">
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="location-details">
                      <span className="location-name">{result.name}</span>
                      <small className="location-address">{result.displayName}</small>
                      <small className="location-coordinates">{result.lat.toFixed(6)}, {result.lng.toFixed(6)}</small>
                    </div>
                  </div>
                  <button
                    className="select-location-button"
                    onClick={() => handleSelectPlace(result)}
                  >
                    <i className="fas fa-map-marker-alt"></i>
                    <span>Zobrazit</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !loading && query && <div className="no-results">Žádné výsledky nenalezeny</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
