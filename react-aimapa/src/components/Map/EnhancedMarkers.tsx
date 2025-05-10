/**
 * EnhancedMarkers - Komponenta pro pokročilé zobrazení bodů na mapě
 * Verze 0.4.2
 */

import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import './EnhancedMarkers.css';
import { PlanItem } from '../Planning/PlanningPanel';

// Typy markerů
export type MarkerType = 'default' | 'task' | 'location' | 'route' | 'warning' | 'danger' | 'success' | 'info';

// Typy animací
export type MarkerAnimation = 'none' | 'pulse' | 'bounce' | 'glow' | 'spin' | 'drop' | 'wave' | 'sparkle' | 'pulse-glow' | 'bounce-sparkle' | 'wave-glow';

// Typy tvarů
export type MarkerShape = 'circle' | 'square' | 'diamond' | 'triangle' | 'star' | 'pin' | 'hexagon';

// Typy efektů
export type MarkerEffect = 'none' | 'shadow-pulse' | 'ripple';

// Rozhraní pro vlastnosti markeru
export interface EnhancedMarkerProps {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
  type?: MarkerType;
  animation?: MarkerAnimation;
  shape?: MarkerShape;
  icon?: string;
  color?: string;
  effect?: MarkerEffect;
  isActive?: boolean;
  isCompleted?: boolean;
  isNew?: boolean; // Zda je marker nově přidaný
  onClick?: (marker: L.Marker) => void;
  onDragEnd?: (marker: L.Marker, latlng: L.LatLng) => void;
  popupContent?: React.ReactNode | string;
  draggable?: boolean;
  progress?: number; // Hodnota 0-100 pro zobrazení postupu
  importance?: number; // Hodnota 1-5 pro důležitost bodu
  reward?: number; // Hodnota pro odměnu za dokončení
  isNavigationPoint?: boolean; // Zda je bod součástí navigace
  isActiveNavigationPoint?: boolean; // Zda je bod aktivním bodem navigace
}

// Funkce pro vytvoření HTML pro marker
export const createMarkerHtml = (props: EnhancedMarkerProps): string => {
  // Výchozí hodnoty
  const {
    title = 'Bod na mapě',
    type = 'default',
    animation = 'none',
    shape = 'circle',
    icon = 'fa-map-marker-alt',
    effect = 'none',
    isActive = false,
    isCompleted = false,
    isNew = false,
    isNavigationPoint = false,
    isActiveNavigationPoint = false,
    progress = 0,
    importance = 1,
    reward = 0
  } = props;

  // Určení barvy podle typu
  let color = props.color;
  if (!color) {
    switch (type) {
      case 'task':
        color = 'var(--marker-primary)';
        break;
      case 'location':
        color = 'var(--marker-info)';
        break;
      case 'route':
        color = 'var(--marker-success)';
        break;
      case 'warning':
        color = 'var(--marker-warning)';
        break;
      case 'danger':
        color = 'var(--marker-danger)';
        break;
      case 'success':
        color = 'var(--marker-success)';
        break;
      case 'info':
        color = 'var(--marker-info)';
        break;
      default:
        color = 'var(--marker-primary)';
    }
  }

  // Určení třídy pro tvar
  let shapeClass = '';
  switch (shape) {
    case 'square':
      shapeClass = 'square';
      break;
    case 'diamond':
      shapeClass = 'diamond';
      break;
    case 'triangle':
      shapeClass = 'triangle';
      break;
    case 'star':
      shapeClass = 'star';
      break;
    case 'pin':
      shapeClass = 'pin';
      break;
    case 'hexagon':
      shapeClass = 'hexagon';
      break;
    default:
      shapeClass = '';
  }

  // Určení třídy pro animaci
  let animationClass = '';

  // Prioritizujeme stavy pro animaci
  if (isNew) {
    animationClass = 'pulse-highlight'; // Speciální animace pro nové markery
  } else if (isActive) {
    animationClass = 'bounce'; // Aktivní markery poskakují
  } else {
    // Zpracování kombinovaných animací
    switch (animation) {
      case 'pulse-glow':
        animationClass = 'pulse glow';
        break;
      case 'bounce-sparkle':
        animationClass = 'bounce sparkle';
        break;
      case 'wave-glow':
        animationClass = 'wave glow';
        break;
      default:
        animationClass = animation;
    }
  }

  // Určení třídy pro efekt
  let effectClass = effect;

  // Určení třídy pro stav
  let stateClass = '';
  if (isActive) stateClass += ' active';
  if (isCompleted) stateClass += ' completed';
  if (isNew) stateClass += ' new-marker';
  if (isNavigationPoint) stateClass += ' navigation-point';
  if (isActiveNavigationPoint) stateClass += ' active-navigation-point';

  // Určení stylu pro důležitost
  let importanceStyle = '';
  if (importance > 1) {
    const scale = 1 + (importance - 1) * 0.1; // 1.1, 1.2, 1.3, 1.4 pro důležitost 2, 3, 4, 5
    importanceStyle = `transform: scale(${scale});`;
  }

  // Vytvoření HTML pro marker
  let html = `
    <div class="plan-marker-inner ${animationClass} ${shapeClass} ${stateClass} ${effectClass}"
         style="background-color: ${color}; ${importanceStyle}">
      <i class="fas ${icon}"></i>
  `;

  // Přidání progress baru, pokud je progress > 0
  if (progress > 0) {
    html += `
      <div class="marker-progress-container">
        <div class="marker-progress-bar" style="width: ${progress}%"></div>
      </div>
    `;
  }

  // Přidání odměny, pokud je reward > 0
  if (reward > 0) {
    html += `<div class="marker-reward">+${reward}</div>`;
  }

  // Přidání indikátoru pro nový marker
  if (isNew) {
    html += `<div class="marker-new-indicator"></div>`;
  }

  // Přidání indikátoru pro aktivní marker
  if (isActive) {
    html += `<div class="marker-active-indicator"></div>`;
  }

  // Uzavření divu
  html += `
      <span class="plan-marker-title">${title}</span>
    </div>
  `;

  return html;
};

// Funkce pro vytvoření ikony markeru
export const createMarkerIcon = (props: EnhancedMarkerProps): L.DivIcon => {
  const html = createMarkerHtml(props);

  return L.divIcon({
    className: 'plan-marker',
    html,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });
};

// Funkce pro vytvoření obsahu popup okna
export const createPopupContent = (props: EnhancedMarkerProps): string => {
  if (props.popupContent) {
    return typeof props.popupContent === 'string'
      ? props.popupContent
      : '<div>Vlastní obsah</div>';
  }

  const { title = 'Bod na mapě', description = '', isCompleted = false } = props;

  const completedStatus = isCompleted
    ? '<div class="task-status completed">✓ Dokončeno</div>'
    : '<div class="task-status pending">Čeká na splnění</div>';

  return `
    <div class="task-popup">
      <div class="popup-header">
        <i class="fas fa-map-marker-alt"></i>
        ${title}
      </div>
      <div class="popup-content">
        ${description ? `<div class="popup-section">${description}</div>` : ''}
        <div class="popup-section">
          <div class="popup-section-title">
            <i class="fas fa-map-pin"></i>
            Souřadnice
          </div>
          <div class="popup-item">
            <i class="fas fa-location-arrow"></i>
            ${props.lat.toFixed(6)}, ${props.lng.toFixed(6)}
          </div>
        </div>
        ${completedStatus}
        <div class="popup-actions">
          <button class="popup-button navigate-button" data-lat="${props.lat}" data-lng="${props.lng}">
            <i class="fas fa-directions"></i> Navigovat
          </button>
          <button class="popup-button secondary edit-button" data-lat="${props.lat}" data-lng="${props.lng}">
            <i class="fas fa-edit"></i> Upravit
          </button>
        </div>
      </div>
    </div>
  `;
};

// Funkce pro vytvoření markeru
export const createMarker = (
  map: L.Map,
  props: EnhancedMarkerProps
): L.Marker => {
  // Vytvoření ikony
  const icon = createMarkerIcon(props);

  // Vytvoření markeru
  const marker = L.marker([props.lat, props.lng], {
    icon,
    draggable: props.draggable || false,
    title: props.title || 'Bod na mapě'
  }).addTo(map);

  // Přidání popup okna
  if (props.title || props.description || props.popupContent) {
    const popupContent = createPopupContent(props);
    marker.bindPopup(popupContent, {
      className: 'task-popup',
      closeButton: true,
      closeOnClick: false,
      autoClose: false,
      minWidth: 300,
      maxWidth: 350
    });

    // Přidání event listenerů pro tlačítka v popup okně
    marker.on('popupopen', (e) => {
      const popup = e.popup;
      const container = popup.getElement();

      if (container) {
        // Tlačítko pro navigaci
        const navigateButton = container.querySelector('.navigate-button');
        if (navigateButton) {
          navigateButton.addEventListener('click', () => {
            if (props.onClick) {
              props.onClick(marker);
            }
            popup.close();
          });
        }

        // Tlačítko pro úpravu
        const editButton = container.querySelector('.edit-button');
        if (editButton) {
          editButton.addEventListener('click', () => {
            // Zde by byla implementace úpravy markeru
            popup.close();
          });
        }
      }
    });
  }

  // Přidání event listeneru pro kliknutí
  if (props.onClick) {
    marker.on('click', () => {
      props.onClick!(marker);
    });
  }

  // Přidání event listeneru pro přetažení
  if (props.draggable && props.onDragEnd) {
    marker.on('dragend', (e) => {
      const latlng = marker.getLatLng();
      props.onDragEnd!(marker, latlng);
    });
  }

  return marker;
};

// Funkce pro vytvoření markerů z položek plánu
export const createMarkersFromPlanItems = (
  map: L.Map,
  planItems: PlanItem[],
  onMarkerClick?: (marker: L.Marker, item: PlanItem) => void,
  onMarkerDragEnd?: (marker: L.Marker, latlng: L.LatLng, item: PlanItem) => void
): L.Marker[] => {
  const markers: L.Marker[] = [];

  planItems.forEach(item => {
    if (item.type === 'location' && item.location) {
      // Vytvoření vlastností markeru
      const markerProps: EnhancedMarkerProps = {
        lat: item.location.lat,
        lng: item.location.lng,
        title: item.title,
        description: item.description,
        type: 'task',
        animation: item.isNew ? 'pulse' : item.isActive ? 'bounce' : 'none',
        isActive: item.isActive,
        isCompleted: item.completed,
        draggable: true,
        onClick: (marker) => {
          if (onMarkerClick) {
            onMarkerClick(marker, item);
          }
        },
        onDragEnd: (marker, latlng) => {
          if (onMarkerDragEnd) {
            onMarkerDragEnd(marker, latlng, item);
          }
        }
      };

      // Vytvoření markeru
      const marker = createMarker(map, markerProps);
      markers.push(marker);
    }
  });

  return markers;
};

export default {
  createMarkerHtml,
  createMarkerIcon,
  createPopupContent,
  createMarker,
  createMarkersFromPlanItems
};
