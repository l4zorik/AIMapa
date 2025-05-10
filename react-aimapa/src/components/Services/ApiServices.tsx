import React from 'react';
import './ApiServices.css';

// Definice typu pro službu
export interface ApiService {
  id: string;
  name: string;
  description: string;
  icon: string;
  provider: string;
  isAvailable: boolean;
}

// Rozhraní pro vlastnosti komponenty
interface ApiServicesProps {
  selectedApiKey: {
    provider: string;
    isVerified: boolean;
  } | null;
  onClose: () => void;
  onSelectService: (service: ApiService) => void;
}

const ApiServices: React.FC<ApiServicesProps> = ({
  selectedApiKey,
  onClose,
  onSelectService
}) => {
  // Seznam dostupných služeb
  const services: ApiService[] = [
    {
      id: 'map-search',
      name: 'Vyhledávání na mapě',
      description: 'Vyhledávání míst a bodů zájmu na mapě pomocí AI',
      icon: '🔍',
      provider: 'google',
      isAvailable: true
    },
    {
      id: 'route-planning',
      name: 'Plánování tras',
      description: 'Plánování optimálních tras mezi body pomocí AI',
      icon: '🗺️',
      provider: 'google',
      isAvailable: true
    },
    {
      id: 'calendar-planning',
      name: 'Plánování kalendáře',
      description: 'Vytvoření denního nebo týdenního plánu pomocí AI',
      icon: '📅',
      provider: 'google',
      isAvailable: true
    },
    {
      id: 'meal-planning',
      name: 'Plánování jídelníčku',
      description: 'Vytvoření zdravého jídelníčku na míru pomocí AI',
      icon: '🍽️',
      provider: 'google',
      isAvailable: true
    },
    {
      id: 'travel-assistant',
      name: 'Cestovní asistent',
      description: 'Komplexní plánování cest a dovolených pomocí AI',
      icon: '✈️',
      provider: 'google',
      isAvailable: true
    },
    {
      id: 'local-guide',
      name: 'Místní průvodce',
      description: 'Informace o zajímavostech a atrakcích v okolí',
      icon: '🧭',
      provider: 'google',
      isAvailable: true
    }
  ];

  // Filtrování služeb podle poskytovatele API
  const filteredServices = selectedApiKey
    ? services.filter(service => 
        service.provider === selectedApiKey.provider || service.provider === 'any'
      )
    : services;

  // Funkce pro výběr služby
  const handleSelectService = (service: ApiService) => {
    if (!selectedApiKey || !selectedApiKey.isVerified) {
      alert('Pro použití této služby je potřeba ověřený API klíč.');
      return;
    }
    
    onSelectService(service);
    onClose();
  };

  return (
    <div className="api-services-container">
      <div className="api-services-header">
        <h3>Služby využívající API klíč</h3>
        <button className="close-services-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      {!selectedApiKey && (
        <div className="api-services-warning">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Pro využití služeb je potřeba vybrat a ověřit API klíč.</p>
        </div>
      )}
      
      <div className="api-services-grid">
        {filteredServices.map(service => (
          <div 
            key={service.id} 
            className={`api-service-card ${!selectedApiKey || !selectedApiKey.isVerified ? 'disabled' : ''}`}
            onClick={() => handleSelectService(service)}
          >
            <div className="service-icon">{service.icon}</div>
            <h4 className="service-name">{service.name}</h4>
            <p className="service-description">{service.description}</p>
            {(!selectedApiKey || !selectedApiKey.isVerified) && (
              <div className="service-overlay">
                <i className="fas fa-lock"></i>
                <span>Vyžaduje API klíč</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="api-services-footer">
        <p>API klíč je nezbytný pro využití všech služeb</p>
        <p className="api-key-status">
          {selectedApiKey 
            ? `Aktivní klíč: ${selectedApiKey.provider} (${selectedApiKey.isVerified ? 'ověřeno' : 'neověřeno'})`
            : 'Žádný aktivní API klíč'}
        </p>
      </div>
    </div>
  );
};

export default ApiServices;
