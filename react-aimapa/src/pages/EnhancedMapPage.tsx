import React, { useState, useEffect } from 'react';
import { ApiKey } from '../components/ApiKeys/EnhancedApiKeyManager';
import EnhancedApiKeyManager from '../components/ApiKeys/EnhancedApiKeyManager';
import EnhancedChatInterface from '../components/Chat/EnhancedChatInterface';
import MapComponent from '../components/MapComponent';
import GeminiService from '../services/GeminiService';
import './EnhancedMapPage.css';

const EnhancedMapPage: React.FC = () => {
  // Stav pro API
  const [apiState, setApiState] = useState<{
    selectedApiKey: ApiKey | null;
    selectedModel: string | null;
    isConnected: boolean;
    lastVerified: Date | null;
  }>({
    selectedApiKey: null,
    selectedModel: null,
    isConnected: false,
    lastVerified: null
  });

  // Stav pro mapu
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.0755, 14.4378]); // Praha
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapProvider, setMapProvider] = useState<string>('google');
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; name?: string }>>([]);
  const [route, setRoute] = useState<{
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  } | null>(null);

  // Stav pro UI
  const [showApiManager, setShowApiManager] = useState<boolean>(false);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [apiKeyWarning, setApiKeyWarning] = useState<boolean>(true);

  // Efekt pro detekci mobilního zařízení
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Zpracování výběru lokace z chatu
  const handleLocationSelect = (location: { lat: number; lng: number; name?: string }) => {
    setMapCenter([location.lat, location.lng]);
    setMapZoom(15);
    setMarkers([location]);
    setRoute(null);

    // Přepnout na mapu na mobilním zařízení
    if (isMobile) {
      // Zde by bylo přepnutí na mapu v mobilním zobrazení
      console.log('Přepnutí na mapu v mobilním zobrazení');
    }
  };

  // Zpracování výběru trasy z chatu
  const handleRouteSelect = (selectedRoute: {
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  }) => {
    // Nastavit střed mapy mezi počátečním a koncovým bodem
    const centerLat = (selectedRoute.start.lat + selectedRoute.end.lat) / 2;
    const centerLng = (selectedRoute.start.lng + selectedRoute.end.lng) / 2;

    setMapCenter([centerLat, centerLng]);
    setMapZoom(10);
    setMarkers([selectedRoute.start, selectedRoute.end]);
    setRoute(selectedRoute);

    // Přepnout na mapu na mobilním zařízení
    if (isMobile) {
      // Zde by bylo přepnutí na mapu v mobilním zobrazení
      console.log('Přepnutí na mapu v mobilním zobrazení');
    }
  };

  // Zpracování změny poskytovatele mapy
  const handleMapProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMapProvider(e.target.value);
  };

  // Funkce pro výběr API klíče
  const handleApiKeySelect = (apiKey: ApiKey) => {
    setApiState({
      selectedApiKey: apiKey,
      selectedModel: getModelForProvider(apiKey.provider),
      isConnected: apiKey.isVerified,
      lastVerified: new Date()
    });

    setApiKeyWarning(false);
    setShowApiManager(false);
  };

  // Funkce pro ověření API klíče
  const handleApiKeyVerified = (apiKey: ApiKey, isVerified: boolean) => {
    if (apiState.selectedApiKey?.id === apiKey.id) {
      setApiState(prev => ({
        ...prev,
        isConnected: isVerified,
        lastVerified: new Date()
      }));
    }
  };

  // Funkce pro odeslání zprávy do chatu
  const handleSendMessage = async (message: string): Promise<string> => {
    if (!apiState.selectedApiKey || !apiState.isConnected) {
      throw new Error('API není připojeno');
    }

    console.log(`Odesílání zprávy pomocí ${apiState.selectedApiKey.provider} API: ${message}`);

    try {
      // Nastavení API klíče pro Gemini službu, pokud je to Google API klíč
      if (apiState.selectedApiKey.provider === 'google') {
        GeminiService.setApiKey(apiState.selectedApiKey.key);
      } else {
        throw new Error('Pro tuto funkci je potřeba Google API klíč (Gemini)');
      }

      // Získání kontextu mapy
      const mapContext = {
        center: mapCenter,
        zoom: mapZoom
      };

      // Odeslání zprávy do Gemini API
      const response = await GeminiService.sendMessage(message, mapContext);
      console.log('Odpověď z Gemini API:', response);

      // Zpracování odpovědi podle typu
      if (response.type === 'location' && response.location) {
        // Přidání markeru na mapu
        const newMarker = {
          lat: response.location.lat,
          lng: response.location.lng,
          name: response.location.name || 'Místo'
        };

        setMapCenter([response.location.lat, response.location.lng]);
        setMapZoom(13);
        setMarkers([newMarker]);

        return response.content || `Našel jsem místo ${response.location.name || ''} na mapě.`;
      }
      else if (response.type === 'route' && response.route) {
        // Nastavení trasy na mapě
        const route = {
          start: response.route.start,
          end: response.route.end,
          waypoints: response.route.waypoints
        };

        // Nastavit střed mapy mezi počátečním a koncovým bodem
        const centerLat = (route.start.lat + route.end.lat) / 2;
        const centerLng = (route.start.lng + route.end.lng) / 2;

        setMapCenter([centerLat, centerLng]);
        setMapZoom(10);
        setMarkers([route.start, route.end]);
        setRoute(route);

        return response.content || `Našel jsem trasu z ${route.start.name || 'počátečního bodu'} do ${route.end.name || 'cílového bodu'}.`;
      }
      else {
        // Textová odpověď bez mapových dat
        return response.content || `Zpracoval jsem váš dotaz: "${message}".`;
      }
    } catch (error) {
      console.error('Chyba při komunikaci s API:', error);
      return `Omlouvám se, ale došlo k chybě při zpracování vašeho dotazu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`;
    }
  };

  // Funkce pro vymazání chatu
  const handleClearChat = () => {
    // Zde by bylo vymazání historie chatu
    console.log('Vymazání historie chatu');
  };

  // Pomocná funkce pro získání modelu podle poskytovatele
  const getModelForProvider = (provider: string): string => {
    switch (provider) {
      case 'openai':
        return 'GPT-4';
      case 'google':
        return 'Gemini 1.5 Flash'; // Aktualizováno na Gemini 1.5 Flash
      case 'anthropic':
        return 'Claude 3';
      case 'deepseek':
        return 'DeepSeek Coder';
      default:
        return 'Neznámý model';
    }
  };

  // Pomocná funkce pro získání barvy podle poskytovatele
  const getColorForProvider = (provider: string): string => {
    switch (provider) {
      case 'openai':
        return '#2ecc71'; // zelená
      case 'google':
        return '#f39c12'; // oranžová
      case 'anthropic':
        return '#3498db'; // modrá
      case 'deepseek':
        return '#9b59b6'; // fialová
      case 'mapbox':
        return '#e74c3c'; // červená
      default:
        return '#7f8c8d'; // šedá
    }
  };

  return (
    <div className="enhanced-map-page">
      <div className="map-header">
        <div className="map-provider-selector">
          <label htmlFor="map-provider">Poskytovatel mapy:</label>
          <select
            id="map-provider"
            value={mapProvider}
            onChange={handleMapProviderChange}
          >
            <option value="google">Google Maps</option>
            <option value="mapbox">Mapbox</option>
            <option value="mapycz">Mapy.cz</option>
            <option value="openstreetmap">OpenStreetMap</option>
          </select>
        </div>

        <div className="map-actions">
          {apiKeyWarning && (
            <div className="api-key-warning">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Není vybrán žádný API klíč</span>
            </div>
          )}

          <button
            className="api-manager-button"
            onClick={() => setShowApiManager(!showApiManager)}
          >
            <i className="fas fa-key"></i>
            <span>Správa API klíčů</span>
          </button>

          <button
            className="chat-toggle-button"
            onClick={() => setIsChatVisible(!isChatVisible)}
            disabled={!apiState.selectedApiKey}
          >
            <i className={`fas ${isChatVisible ? 'fa-comment-slash' : 'fa-comment'}`}></i>
            <span>{isChatVisible ? 'Skrýt chat' : 'Zobrazit chat'}</span>
          </button>
        </div>
      </div>

      <div className="map-content">
        <div className="map-container">
          <MapComponent
            center={mapCenter}
            zoom={mapZoom}
            provider={mapProvider}
            markers={markers}
            route={route}
            apiKey={apiState.selectedApiKey?.provider === 'mapbox' ? apiState.selectedApiKey.key : null}
          />

          {/* Informace o aktivním API klíči */}
          {apiState.selectedApiKey && (
            <div className="active-api-info">
              <div className="api-badge" style={{ backgroundColor: getColorForProvider(apiState.selectedApiKey.provider) }}>
                <i className="fas fa-link"></i>
                <span>{apiState.selectedModel}</span>
              </div>
            </div>
          )}
        </div>

        {isChatVisible && (
          <div className="chat-container">
            <EnhancedChatInterface
              selectedApiKey={apiState.selectedApiKey}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
            />
          </div>
        )}
      </div>

      {showApiManager && (
        <div className="api-manager-container">
          <div className="api-manager-overlay" onClick={() => setShowApiManager(false)}></div>
          <div className="api-manager-modal">
            <button className="close-modal-button" onClick={() => setShowApiManager(false)}>
              <i className="fas fa-times"></i>
            </button>
            <EnhancedApiKeyManager
              onSelectApiKey={handleApiKeySelect}
              onApiKeyVerified={handleApiKeyVerified}
              selectedChatModel={apiState.selectedModel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMapPage;
