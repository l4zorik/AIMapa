import React from 'react';
import './TaskInfoPanel.css';

interface TaskInfoPanelProps {
  task: {
    id: string;
    title: string;
    description?: string;
    type: 'location' | 'task' | 'route' | 'note';
    location?: {
      lat: number;
      lng: number;
      name?: string;
    };
    route?: {
      start: {
        lat: number;
        lng: number;
        name?: string;
      };
      end: {
        lat: number;
        lng: number;
        name?: string;
      };
    };
    completed?: boolean;
    time?: string;
  };
  onClose: () => void;
}

/**
 * Komponenta pro zobrazení informací o úkolu na mapě
 */
const TaskInfoPanel: React.FC<TaskInfoPanelProps> = ({ task, onClose }) => {
  // Funkce pro formátování souřadnic
  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  // Funkce pro získání ikony podle typu úkolu
  const getTaskIcon = () => {
    switch (task.type) {
      case 'location':
        return 'fa-map-marker-alt';
      case 'task':
        return 'fa-tasks';
      case 'route':
        return 'fa-route';
      case 'note':
        return 'fa-sticky-note';
      default:
        return 'fa-map-marker-alt';
    }
  };

  // Funkce pro získání barvy podle typu úkolu
  const getTaskColor = () => {
    switch (task.type) {
      case 'location':
        return 'var(--marker-info)';
      case 'task':
        return 'var(--marker-primary)';
      case 'route':
        return 'var(--marker-success)';
      case 'note':
        return 'var(--marker-warning)';
      default:
        return 'var(--marker-primary)';
    }
  };

  return (
    <div className="task-info-panel">
      <div className="task-info-header" style={{ backgroundColor: getTaskColor() }}>
        <i className={`fas ${getTaskIcon()}`}></i>
        <h3>{task.title}</h3>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="task-info-content">
        {task.description && (
          <div className="task-info-section">
            <p>{task.description}</p>
          </div>
        )}
        
        {task.time && (
          <div className="task-info-section">
            <div className="task-info-label">
              <i className="fas fa-clock"></i>
              Čas:
            </div>
            <div className="task-info-value">{task.time}</div>
          </div>
        )}
        
        {task.location && (
          <div className="task-info-section">
            <div className="task-info-label">
              <i className="fas fa-map-marker-alt"></i>
              Lokace:
            </div>
            <div className="task-info-value">
              {task.location.name || 'Neznámé místo'}
            </div>
            <div className="task-info-coordinates">
              {formatCoordinates(task.location.lat, task.location.lng)}
            </div>
          </div>
        )}
        
        {task.route && (
          <div className="task-info-section">
            <div className="task-info-label">
              <i className="fas fa-route"></i>
              Trasa:
            </div>
            <div className="task-info-route">
              <div className="route-point">
                <i className="fas fa-play-circle"></i>
                <span>{task.route.start.name || 'Počáteční bod'}</span>
              </div>
              <div className="route-arrow">
                <i className="fas fa-long-arrow-alt-down"></i>
              </div>
              <div className="route-point">
                <i className="fas fa-flag-checkered"></i>
                <span>{task.route.end.name || 'Cílový bod'}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="task-info-section">
          <div className="task-info-label">
            <i className="fas fa-info-circle"></i>
            Stav:
          </div>
          <div className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
            {task.completed ? '✓ Dokončeno' : 'Čeká na splnění'}
          </div>
        </div>
      </div>
      
      <div className="task-info-actions">
        <button className="task-info-button primary">
          <i className="fas fa-directions"></i>
          Navigovat
        </button>
        <button className="task-info-button secondary">
          <i className="fas fa-edit"></i>
          Upravit
        </button>
      </div>
    </div>
  );
};

export default TaskInfoPanel;
