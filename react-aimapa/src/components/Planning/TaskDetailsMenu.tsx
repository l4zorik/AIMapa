import React from 'react';
import './TaskDetailsMenu.css';
import { PlanItem } from './PlanningPanel';

// Definice typů pro markery a trasy
interface Marker {
  lat: number;
  lng: number;
  name?: string;
}

interface Route {
  start: Marker;
  end: Marker;
  waypoints?: Marker[];
}

interface TaskDetailsMenuProps {
  item: PlanItem;
  planId: string;
  onClose: () => void;
  onEditItem: (planId: string, itemId: string, updatedFields: Partial<PlanItem>) => void;
  onAddLocationToItem: (planId: string, itemId: string) => Promise<void>;
  onAddRouteToItem: (planId: string, itemId: string) => Promise<void>;
  onRemoveItem: (planId: string, itemId: string) => void;
  onSelectLocation: (location: Marker) => void;
  onSelectRoute: (route: Route) => void;
  onToggleItemComplete: (planId: string, itemId: string) => void;
}

const TaskDetailsMenu: React.FC<TaskDetailsMenuProps> = ({
  item,
  planId,
  onClose,
  onEditItem,
  onAddLocationToItem,
  onAddRouteToItem,
  onRemoveItem,
  onSelectLocation,
  onSelectRoute,
  onToggleItemComplete
}) => {
  // Funkce pro úpravu názvu úkolu
  const handleEditTitle = () => {
    const newTitle = prompt('Zadejte nový název:', item.title);
    if (newTitle) {
      onEditItem(planId, item.id, { title: newTitle });
    }
  };

  // Funkce pro úpravu popisu úkolu
  const handleEditDescription = () => {
    const newDescription = prompt('Zadejte nový popis:', item.description || '');
    if (newDescription !== null) {
      onEditItem(planId, item.id, { description: newDescription });
    }
  };

  // Funkce pro úpravu času úkolu
  const handleEditTime = () => {
    const newTime = prompt('Zadejte nový čas:', item.time || '');
    if (newTime !== null) {
      onEditItem(planId, item.id, { time: newTime });
    }
  };

  // Funkce pro změnu typu úkolu
  const handleChangeType = (type: 'location' | 'task' | 'route' | 'note') => {
    onEditItem(planId, item.id, { type });
  };

  // Funkce pro přidání lokace k úkolu
  const handleAddLocation = () => {
    onAddLocationToItem(planId, item.id);
  };

  // Funkce pro přidání trasy k úkolu
  const handleAddRoute = () => {
    onAddRouteToItem(planId, item.id);
  };

  // Funkce pro zobrazení lokace na mapě
  const handleShowLocation = () => {
    if (item.location) {
      // Vytvoření události pro animované zaměření na lokaci
      const focusEvent = new CustomEvent('focusOnLocation', {
        detail: {
          location: item.location,
          zoom: 16, // Vyšší zoom pro lepší detail
          animate: true, // Animace přechodu
          duration: 1.5, // Délka animace v sekundách
          taskId: item.id, // ID úkolu pro případné další zpracování
          taskTitle: item.title // Název úkolu pro zobrazení
        }
      });

      // Vyvolání události pro zaměření na lokaci
      window.dispatchEvent(focusEvent);

      // Standardní volání pro kompatibilitu
      onSelectLocation(item.location);
    }
  };

  // Funkce pro zobrazení trasy na mapě
  const handleShowRoute = () => {
    if (item.route) {
      // Vytvoření události pro animované zaměření na trasu
      const focusEvent = new CustomEvent('focusOnRoute', {
        detail: {
          route: item.route,
          animate: true, // Animace přechodu
          duration: 1.5, // Délka animace v sekundách
          taskId: item.id, // ID úkolu pro případné další zpracování
          taskTitle: item.title // Název úkolu pro zobrazení
        }
      });

      // Vyvolání události pro zaměření na trasu
      window.dispatchEvent(focusEvent);

      // Standardní volání pro kompatibilitu
      onSelectRoute(item.route);
    }
  };

  // Funkce pro odstranění úkolu
  const handleRemove = () => {
    if (window.confirm(`Opravdu chcete odstranit úkol "${item.title}"?`)) {
      onRemoveItem(planId, item.id);
      onClose();
    }
  };

  // Funkce pro označení úkolu jako dokončený/nedokončený
  const handleToggleComplete = () => {
    onToggleItemComplete(planId, item.id);
  };

  // Funkce pro sdílení lokace
  const handleShareLocation = () => {
    if (item.location) {
      // Vytvoření URL pro sdílení
      const shareUrl = `https://maps.google.com/maps?q=${item.location.lat},${item.location.lng}`;

      // Kopírování URL do schránky
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Odkaz na lokaci byl zkopírován do schránky');
        })
        .catch(err => {
          console.error('Chyba při kopírování do schránky:', err);
          alert(`Odkaz na lokaci: ${shareUrl}`);
        });
    }
  };

  // Funkce pro měření vzdálenosti od lokace úkolu
  const handleMeasureDistance = () => {
    if (item.location) {
      // Vytvoření události pro měření vzdálenosti
      const measureEvent = new CustomEvent('startMeasureDistance', {
        detail: {
          startLocation: item.location,
          taskId: item.id,
          taskTitle: item.title
        }
      });

      // Vyvolání události pro měření vzdálenosti
      window.dispatchEvent(measureEvent);

      // Zavření menu detailů úkolu
      onClose();

      // Informace pro uživatele
      alert('Režim měření vzdálenosti aktivován. Klikněte na cílový bod na mapě.');
    }
  };

  return (
    <div className="task-details-menu">
      <div className="task-details-header">
        <h3>Detaily úkolu</h3>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="task-details-content">
        <div className="task-details-section">
          <div className="task-details-field">
            <label>ID:</label>
            <div className="task-id-value">
              <span>{item.id}</span>
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(item.id);
                  alert('ID zkopírováno do schránky');
                }}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <div className="task-details-field">
            <label>Název:</label>
            <div className="task-field-value">
              <span>{item.title}</span>
              <button className="edit-button" onClick={handleEditTitle}>
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          <div className="task-details-field">
            <label>Popis:</label>
            <div className="task-field-value">
              <span>{item.description || '(žádný popis)'}</span>
              <button className="edit-button" onClick={handleEditDescription}>
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          <div className="task-details-field">
            <label>Čas:</label>
            <div className="task-field-value">
              <span>{item.time || '(žádný čas)'}</span>
              <button className="edit-button" onClick={handleEditTime}>
                <i className="fas fa-edit"></i>
              </button>
            </div>
          </div>

          <div className="task-details-field">
            <label>Typ:</label>
            <div className="task-type-selector">
              <select
                value={item.type}
                onChange={(e) => handleChangeType(e.target.value as 'location' | 'task' | 'route' | 'note')}
              >
                <option value="task">Úkol</option>
                <option value="location">Místo</option>
                <option value="route">Trasa</option>
                <option value="note">Poznámka</option>
              </select>
            </div>
          </div>

          <div className="task-details-field">
            <label>Stav:</label>
            <div className="task-status-toggle">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={handleToggleComplete}
                id="task-complete-checkbox"
              />
              <label htmlFor="task-complete-checkbox">
                {item.completed ? 'Dokončeno' : 'Nedokončeno'}
              </label>
            </div>
          </div>
        </div>

        {/* Sekce pro lokaci */}
        <div className="task-details-section">
          <h4>Lokace</h4>
          {item.location ? (
            <div className="task-location-info">
              <div className="location-name">
                <i className="fas fa-map-marker-alt"></i>
                <span>{item.location.name || `${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}`}</span>
              </div>
              <div className="location-coordinates">
                <span>Lat: {item.location.lat.toFixed(6)}</span>
                <span>Lng: {item.location.lng.toFixed(6)}</span>
              </div>
              <div className="location-actions">
                <button className="show-on-map-button" onClick={handleShowLocation}>
                  <i className="fas fa-eye"></i>
                  <span>Zobrazit na mapě</span>
                </button>
                <button className="share-location-button" onClick={handleShareLocation}>
                  <i className="fas fa-share-alt"></i>
                  <span>Sdílet lokaci</span>
                </button>
                <button className="measure-distance-button" onClick={handleMeasureDistance}>
                  <i className="fas fa-ruler"></i>
                  <span>Měřit vzdálenost</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="task-no-location">
              <p>Žádná lokace není přiřazena</p>
              <button className="add-location-button" onClick={handleAddLocation}>
                <i className="fas fa-plus"></i>
                <span>Přidat lokaci</span>
              </button>
            </div>
          )}
        </div>

        {/* Sekce pro trasu */}
        <div className="task-details-section">
          <h4>Trasa</h4>
          {item.route ? (
            <div className="task-route-info">
              <div className="route-points">
                <div className="route-start">
                  <i className="fas fa-play"></i>
                  <span>{item.route.start.name || `${item.route.start.lat.toFixed(4)}, ${item.route.start.lng.toFixed(4)}`}</span>
                </div>
                <div className="route-end">
                  <i className="fas fa-flag-checkered"></i>
                  <span>{item.route.end.name || `${item.route.end.lat.toFixed(4)}, ${item.route.end.lng.toFixed(4)}`}</span>
                </div>
              </div>
              <button className="show-on-map-button" onClick={handleShowRoute}>
                <i className="fas fa-eye"></i>
                <span>Zobrazit na mapě</span>
              </button>
            </div>
          ) : (
            <div className="task-no-route">
              <p>Žádná trasa není přiřazena</p>
              <button className="add-route-button" onClick={handleAddRoute}>
                <i className="fas fa-plus"></i>
                <span>Přidat trasu</span>
              </button>
            </div>
          )}
        </div>

        <div className="task-details-actions">
          <button className="remove-task-button" onClick={handleRemove}>
            <i className="fas fa-trash"></i>
            <span>Odstranit úkol</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsMenu;
