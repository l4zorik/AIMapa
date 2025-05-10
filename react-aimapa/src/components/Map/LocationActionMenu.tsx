import React, { useState } from 'react';
import './LocationActionMenu.css';

interface Marker {
  lat: number;
  lng: number;
  name?: string;
}

interface LocationActionMenuProps {
  location: Marker;
  taskId?: string;
  taskTitle?: string;
  onClose: () => void;
  onAddToTask?: (location: Marker) => void;
  onNavigateTo?: (location: Marker) => void;
  onShareLocation?: (location: Marker) => void;
  onEditLocation?: (location: Marker, newName: string) => void;
  onMeasureDistance?: (fromLocation: Marker) => void;
  onShowNearby?: (location: Marker, category: string) => void;
  onRemoveLocation?: (location: Marker) => void;
  position: { x: number; y: number };
}

const LocationActionMenu: React.FC<LocationActionMenuProps> = ({
  location,
  taskId,
  taskTitle,
  onClose,
  onAddToTask,
  onNavigateTo,
  onShareLocation,
  onEditLocation,
  onMeasureDistance,
  onShowNearby,
  onRemoveLocation,
  position
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(location.name || '');
  const [selectedCategory, setSelectedCategory] = useState('restaurant');
  const [showNearbyOptions, setShowNearbyOptions] = useState(false);

  // Kategorie pro vyhledávání v okolí
  const nearbyCategories = [
    { id: 'restaurant', name: 'Restaurace', icon: 'fa-utensils' },
    { id: 'hotel', name: 'Hotely', icon: 'fa-bed' },
    { id: 'parking', name: 'Parkování', icon: 'fa-parking' },
    { id: 'gas_station', name: 'Čerpací stanice', icon: 'fa-gas-pump' },
    { id: 'atm', name: 'Bankomaty', icon: 'fa-money-bill-wave' },
    { id: 'cafe', name: 'Kavárny', icon: 'fa-coffee' },
    { id: 'pharmacy', name: 'Lékárny', icon: 'fa-prescription-bottle-med' },
    { id: 'supermarket', name: 'Supermarkety', icon: 'fa-shopping-cart' }
  ];

  // Funkce pro uložení nového názvu
  const handleSaveName = () => {
    if (onEditLocation) {
      onEditLocation(location, newName);
    }
    setIsEditingName(false);
  };

  // Funkce pro zobrazení okolních míst
  const handleShowNearby = (category: string) => {
    if (onShowNearby) {
      onShowNearby(location, category);
    }
    setShowNearbyOptions(false);
  };

  // Formátování souřadnic
  const formatCoordinate = (coord: number) => {
    return coord.toFixed(6);
  };

  return (
    <div
      className="location-action-menu"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="menu-header">
        <h3>
          {taskTitle ? (
            <>
              <i className="fas fa-map-marker-alt"></i> {taskTitle}
            </>
          ) : (
            <>
              <i className="fas fa-map-marker-alt"></i> Lokace
            </>
          )}
        </h3>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="menu-content">
        {/* Název lokace */}
        <div className="location-name-section">
          {isEditingName ? (
            <div className="edit-name-form">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Zadejte název místa"
                autoFocus
              />
              <div className="edit-name-actions">
                <button onClick={handleSaveName}>
                  <i className="fas fa-check"></i> Uložit
                </button>
                <button onClick={() => setIsEditingName(false)}>
                  <i className="fas fa-times"></i> Zrušit
                </button>
              </div>
            </div>
          ) : (
            <div className="location-name">
              <span>{location.name || 'Nepojmenované místo'}</span>
              {onEditLocation && (
                <button onClick={() => setIsEditingName(true)}>
                  <i className="fas fa-edit"></i>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Souřadnice */}
        <div className="location-coordinates">
          <div className="coordinate">
            <span className="coordinate-label">Lat:</span>
            <span className="coordinate-value">{formatCoordinate(location.lat)}</span>
          </div>
          <div className="coordinate">
            <span className="coordinate-label">Lng:</span>
            <span className="coordinate-value">{formatCoordinate(location.lng)}</span>
          </div>
          <button
            className="copy-coordinates-button"
            onClick={() => {
              const coordText = `${formatCoordinate(location.lat)}, ${formatCoordinate(location.lng)}`;
              navigator.clipboard.writeText(coordText);
              alert('Souřadnice zkopírovány do schránky');
            }}
          >
            <i className="fas fa-copy"></i> Kopírovat
          </button>
        </div>

        {/* Akce s lokací */}
        <div className="location-actions">
          {onNavigateTo && (
            <button className="action-button" onClick={() => onNavigateTo(location)}>
              <i className="fas fa-directions"></i>
              <span>Navigovat</span>
            </button>
          )}

          {onAddToTask && (
            <button className="action-button" onClick={() => onAddToTask(location)}>
              <i className="fas fa-tasks"></i>
              <span>Přidat k úkolu</span>
            </button>
          )}

          {onShareLocation && (
            <button className="action-button" onClick={() => onShareLocation(location)}>
              <i className="fas fa-share-alt"></i>
              <span>Sdílet</span>
            </button>
          )}

          {onMeasureDistance && (
            <button className="action-button" onClick={() => onMeasureDistance(location)}>
              <i className="fas fa-ruler"></i>
              <span>Měřit vzdálenost</span>
            </button>
          )}

          {onShowNearby && (
            <div className="nearby-section">
              <button
                className="action-button"
                onClick={() => setShowNearbyOptions(!showNearbyOptions)}
              >
                <i className="fas fa-search-location"></i>
                <span>Najít v okolí</span>
                <i className={`fas fa-chevron-${showNearbyOptions ? 'up' : 'down'}`}></i>
              </button>

              {showNearbyOptions && (
                <div className="nearby-categories">
                  {nearbyCategories.map(category => (
                    <button
                      key={category.id}
                      className="category-button"
                      onClick={() => handleShowNearby(category.id)}
                    >
                      <i className={`fas ${category.icon}`}></i>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {onRemoveLocation && (
            <button className="action-button remove-button" onClick={() => {
              if (window.confirm(`Opravdu chcete odstranit tento bod${taskId ? ' a jeho přiřazení k úkolu' : ''}?`)) {
                onRemoveLocation(location);
              }
            }}>
              <i className="fas fa-trash"></i>
              <span>Odstranit bod</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationActionMenu;
