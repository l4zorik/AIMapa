import React, { useState, useEffect } from 'react';
import { ApiKey } from '../components/ApiKeys/ApiKeyManager';
import ApiKeyManager from '../components/ApiKeys/ApiKeyManager';
import ChatComponent from '../components/Chat/ChatComponent';
import MapComponent from '../components/MapComponent';
import './EnhancedMapPage.css';

const EnhancedMapPage: React.FC = () => {
  // Stav pro API klíč
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | undefined>(undefined);
  
  // Stav pro mapu
  const [mapCenter, setMapCenter] = useState<[number, number]>([50.0755, 14.4378]); // Praha
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [mapProvider, setMapProvider] = useState<string>('openstreetmap');
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; name?: string }>>([]);
  const [route, setRoute] = useState<{
    start: { lat: number; lng: number; name?: string };
    end: { lat: number; lng: number; name?: string };
    waypoints?: Array<{ lat: number; lng: number; name?: string }>;
  } | null>(null);
  
  // Stav pro UI
  const [activeTab, setActiveTab] = useState<'map' | 'settings'>('map');
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

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
      setActiveTab('map');
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
      setActiveTab('map');
    }
  };

  // Zpracování změny poskytovatele mapy
  const handleMapProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMapProvider(e.target.value);
  };

  // Zpracování výběru API klíče
  const handleApiKeySelect = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    
    // Přepnout na mapu po výběru API klíče
    setActiveTab('map');
  };

  return (
    <div className="enhanced-map-page">
      <div className="map-page-header">
        <h1>AI Mapa</h1>
        <div className="map-page-tabs">
          <button 
            className={activeTab === 'map' ? 'active' : ''} 
            onClick={() => setActiveTab('map')}
          >
            <i className="fas fa-map-marked-alt"></i> Mapa
          </button>
          <button 
            className={activeTab === 'settings' ? 'active' : ''} 
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i> Nastavení
          </button>
        </div>
      </div>
      
      {activeTab === 'map' && (
        <div className="map-content">
          <div className="map-container">
            <div className="map-controls">
              <div className="map-provider-selector">
                <label htmlFor="map-provider">Poskytovatel mapy:</label>
                <select 
                  id="map-provider" 
                  value={mapProvider}
                  onChange={handleMapProviderChange}
                >
                  <option value="openstreetmap">OpenStreetMap</option>
                  <option value="mapycz">Mapy.cz</option>
                  <option value="google">Google Maps</option>
                  <option value="mapbox">Mapbox</option>
                </select>
              </div>
              
              {selectedApiKey ? (
                <div className="api-key-info">
                  <span className="api-key-label">Aktivní API klíč:</span>
                  <span className="api-key-value">{selectedApiKey.name}</span>
                </div>
              ) : (
                <div className="no-api-key-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Není vybrán žádný API klíč</span>
                </div>
              )}
              
              <button 
                className="toggle-chat-button"
                onClick={() => setIsChatVisible(!isChatVisible)}
              >
                {isChatVisible ? (
                  <>
                    <i className="fas fa-comment-slash"></i> Skrýt chat
                  </>
                ) : (
                  <>
                    <i className="fas fa-comment"></i> Zobrazit chat
                  </>
                )}
              </button>
            </div>
            
            <div className="map-wrapper">
              <MapComponent 
                center={mapCenter}
                zoom={mapZoom}
                provider={mapProvider}
                markers={markers}
                route={route}
              />
            </div>
          </div>
          
          {isChatVisible && (
            <div className="chat-container">
              <ChatComponent 
                apiKey={selectedApiKey}
                onLocationSelect={handleLocationSelect}
                onRouteSelect={handleRouteSelect}
              />
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="settings-content">
          <ApiKeyManager onSelectApiKey={handleApiKeySelect} />
        </div>
      )}
    </div>
  );
};

export default EnhancedMapPage;
