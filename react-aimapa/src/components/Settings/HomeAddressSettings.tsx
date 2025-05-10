import React, { useState, useEffect } from 'react';
import userSettingsService, { HomeAddress } from '../../services/UserSettingsService';
import geocodingService, { GeocodingResult } from '../../services/GeocodingService';
import geolocationService from '../../services/GeolocationService';
import './HomeAddressSettings.css';

interface HomeAddressSettingsProps {
  onAddressChange?: (address: HomeAddress | undefined) => void;
}

const HomeAddressSettings: React.FC<HomeAddressSettingsProps> = ({ onAddressChange }) => {
  const [address, setAddress] = useState<string>('');
  const [homeAddress, setHomeAddress] = useState<HomeAddress | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState<boolean>(false);

  // Načtení adresy bydliště při inicializaci komponenty
  useEffect(() => {
    const savedHomeAddress = userSettingsService.getHomeAddress();
    if (savedHomeAddress) {
      setHomeAddress(savedHomeAddress);
      setAddress(savedHomeAddress.address);
    }
  }, []);

  // Vyhledání adresy
  const handleSearch = async () => {
    if (!address.trim()) {
      setError('Zadejte adresu pro vyhledání');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSearching(true);
    setSearchResults([]);

    try {
      const results = await geocodingService.searchPlace(address);
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('Adresa nebyla nalezena. Zkuste zadat přesnější adresu.');
      }
    } catch (error) {
      console.error('Chyba při vyhledávání adresy:', error);
      setError('Došlo k chybě při vyhledávání adresy. Zkuste to prosím znovu.');
    } finally {
      setIsSearching(false);
    }
  };

  // Výběr adresy ze seznamu výsledků
  const handleSelectAddress = (result: GeocodingResult) => {
    const newHomeAddress: HomeAddress = {
      address: address,
      displayName: result.displayName,
      lat: result.lat,
      lng: result.lng,
      timestamp: Date.now()
    };

    userSettingsService.setHomeAddress(newHomeAddress);
    setHomeAddress(newHomeAddress);
    setSearchResults([]);
    setSuccess('Adresa bydliště byla úspěšně nastavena');
    
    if (onAddressChange) {
      onAddressChange(newHomeAddress);
    }
  };

  // Použití aktuální polohy jako adresy bydliště
  const handleUseCurrentLocation = async () => {
    setError(null);
    setSuccess(null);
    setIsUsingCurrentLocation(true);

    try {
      const position = await geolocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Získání informací o místě pomocí reverzního geocodingu
      const locationInfo = await geocodingService.reverseGeocode(latitude, longitude);

      const newHomeAddress: HomeAddress = {
        address: 'Moje aktuální poloha',
        displayName: locationInfo.displayName,
        lat: latitude,
        lng: longitude,
        timestamp: Date.now()
      };

      userSettingsService.setHomeAddress(newHomeAddress);
      setHomeAddress(newHomeAddress);
      setAddress(locationInfo.displayName);
      setSuccess('Vaše aktuální poloha byla nastavena jako adresa bydliště');
      
      if (onAddressChange) {
        onAddressChange(newHomeAddress);
      }
    } catch (error) {
      console.error('Chyba při získávání polohy:', error);
      setError('Nepodařilo se získat vaši polohu. Zkontrolujte, zda máte povolené sdílení polohy.');
    } finally {
      setIsUsingCurrentLocation(false);
    }
  };

  // Odstranění adresy bydliště
  const handleRemoveAddress = () => {
    userSettingsService.removeHomeAddress();
    setHomeAddress(undefined);
    setAddress('');
    setSuccess('Adresa bydliště byla odstraněna');
    
    if (onAddressChange) {
      onAddressChange(undefined);
    }
  };

  return (
    <div className="home-address-settings">
      <h3>Adresa bydliště</h3>
      <p className="settings-description">
        Nastavte svou adresu bydliště, která bude použita jako výchozí bod pro plánování tras.
      </p>

      {homeAddress && (
        <div className="current-address">
          <h4>Aktuální adresa bydliště</h4>
          <div className="address-card">
            <div className="address-info">
              <i className="fas fa-home"></i>
              <div className="address-details">
                <div className="address-name">{homeAddress.displayName}</div>
                <div className="address-coordinates">
                  {homeAddress.lat.toFixed(6)}, {homeAddress.lng.toFixed(6)}
                </div>
              </div>
            </div>
            <button 
              className="remove-address-button" 
              onClick={handleRemoveAddress}
              title="Odstranit adresu bydliště"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      )}

      <div className="address-search">
        <div className="input-group">
          <input
            type="text"
            className="address-input"
            placeholder="Zadejte adresu bydliště"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            className="search-button" 
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </div>

        <button 
          className="current-location-button" 
          onClick={handleUseCurrentLocation}
          disabled={isUsingCurrentLocation}
        >
          {isUsingCurrentLocation ? (
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
      </div>

      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <span>{success}</span>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Výsledky vyhledávání</h4>
          <ul className="results-list">
            {searchResults.map((result) => (
              <li key={result.id} className="result-item">
                <div className="result-info">
                  <div className="result-name">{result.displayName}</div>
                  <div className="result-coordinates">
                    {result.lat.toFixed(6)}, {result.lng.toFixed(6)}
                  </div>
                </div>
                <button 
                  className="select-button" 
                  onClick={() => handleSelectAddress(result)}
                >
                  <i className="fas fa-check"></i>
                  <span>Vybrat</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomeAddressSettings;
