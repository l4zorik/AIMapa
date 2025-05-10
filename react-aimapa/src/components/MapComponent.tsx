import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';
import './MapMarkers.css';
import routingService from '../services/RoutingService';
import LocationActionMenu from './Map/LocationActionMenu';
import MissionCompletedAnimation from './Map/MissionCompletedAnimation';
import PlanPathAnimation from './Map/PlanPathAnimation';
import { Plan, PlanItem } from './Planning/PlanningPanel';
import EnhancedMarkers from './Map/EnhancedMarkers';

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
  geometry?: [number, number][]; // body trasy pro vykreslení
  distance?: number; // vzdálenost v metrech
  duration?: number; // čas v sekundách
}

// Definice typů pro poskytovatele map
type MapProviderType = 'openstreetmap' | 'mapycz' | 'google' | 'mapbox';

interface MapProvider {
  id: MapProviderType;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

// Používáme PlanItem z importu

// Deklarace pro globální funkce
declare global {
  interface Window {
    handlePathAnimationComplete?: () => void;
    handleMissionCompletedFinished?: () => void;
  }
}

// Definice vlastností komponenty
interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  provider?: string;
  markers?: Marker[];
  route?: Route | null;
  planItems?: PlanItem[]; // Přidáno: Položky plánu pro zobrazení na mapě
  apiKey?: string | null; // Přidáno: API klíč pro mapové služby
  onMarkerClick?: (marker: Marker) => void;
  onMapClick?: (latlng: [number, number]) => void;
  onTaskMarkerClick?: (task: PlanItem, planId?: string) => void; // Přidáno: Handler pro kliknutí na marker úkolu
  activePlan?: Plan | null; // Přidáno: Aktivní plán pro animaci
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [50.0755, 14.4378], // Praha
  zoom = 13,
  provider = 'openstreetmap',
  markers = [],
  route = null,
  planItems = [], // Přidáno: Položky plánu
  apiKey = null, // Přidáno: API klíč
  onMarkerClick,
  onMapClick,
  onTaskMarkerClick,
  activePlan = null // Přidáno: Aktivní plán pro animaci
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [currentTileLayer, setCurrentTileLayer] = useState<L.TileLayer | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<L.Marker[]>([]);
  const [currentRoute, setCurrentRoute] = useState<L.Polyline | null>(null);
  const [planMarkers, setPlanMarkers] = useState<L.Marker[]>([]);
  const [planRoutes, setPlanRoutes] = useState<L.Polyline[]>([]);

  // Stav pro interaktivní menu lokace
  const [selectedLocation, setSelectedLocation] = useState<Marker | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedTaskInfo, setSelectedTaskInfo] = useState<{ id: string; title: string } | null>(null);
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measureStartPoint, setMeasureStartPoint] = useState<Marker | null>(null);

  // Stav pro animace
  const [showPathAnimation, setShowPathAnimation] = useState<boolean>(false);
  const [showMissionCompleted, setShowMissionCompleted] = useState<boolean>(false);
  const [completedPlanTitle, setCompletedPlanTitle] = useState<string>('');

  // Stav pro aktuální polohu uživatele
  const [userLocation, setUserLocation] = useState<Marker | null>(null);
  const [userLocationMarker, setUserLocationMarker] = useState<L.Marker | null>(null);
  const [userLocationAccuracyCircle, setUserLocationAccuracyCircle] = useState<L.Circle | null>(null);

  // Definice poskytovatelů map
  const getMapProviders = (): Record<string, MapProvider> => {
    // Základní URL pro Mapbox s API klíčem
    const mapboxUrl = apiKey && provider === 'mapbox'
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${apiKey}`
      : 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    return {
      openstreetmap: {
        id: 'openstreetmap',
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      },
      mapycz: {
        id: 'mapycz',
        name: 'Mapy.cz',
        url: 'https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}',
        attribution: '&copy; <a href="https://www.seznam.cz">Seznam.cz, a.s.</a>',
        maxZoom: 18
      },
      google: {
        id: 'google',
        name: 'Google Maps',
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        attribution: '&copy; Google Maps',
        maxZoom: 20
      },
      mapbox: {
        id: 'mapbox',
        name: 'Mapbox',
        url: mapboxUrl,
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
        maxZoom: 19
      }
    };
  };

  // Získání poskytovatelů map
  const mapProviders = getMapProviders();

  // Inicializace mapy
  useEffect(() => {
    if (!mapRef.current) return;

    // Inicializace mapy
    const leafletMap = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      attributionControl: true,
      minZoom: 3, // Minimální zoom - omezení příliš velkého oddálení
      maxZoom: 19, // Maximální zoom - omezení příliš velkého přiblížení
      zoomSnap: 0.5, // Plynulejší zoom
      zoomDelta: 0.5, // Menší kroky při zoomu
      wheelPxPerZoomLevel: 120, // Citlivost kolečka myši
      bounceAtZoomLimits: true // Animace při dosažení limitů zoomu
    });

    // Přidání výchozí vrstvy
    const selectedProvider = mapProviders[provider] || mapProviders.openstreetmap;
    const tileLayer = L.tileLayer(selectedProvider.url, {
      attribution: selectedProvider.attribution,
      maxZoom: selectedProvider.maxZoom,
      minZoom: 3, // Minimální zoom pro vrstvu
      noWrap: true, // Zabrání opakování mapy při velkém oddálení
      bounds: [[-90, -180], [90, 180]] // Omezení rozsahu mapy
    });

    tileLayer.addTo(leafletMap);
    setCurrentTileLayer(tileLayer);

    // Nastavení události kliknutí na mapu
    leafletMap.on('click', (e) => {
      // Pokud je aktivní režim měření, zpracujeme kliknutí pro měření
      if (measureMode) {
        handleMapClickInMeasureMode(e.latlng);
      } else {
        // Zavření menu lokace při kliknutí mimo marker
        setSelectedLocation(null);

        // Volání původního handleru, pokud existuje
        if (onMapClick) {
          onMapClick([e.latlng.lat, e.latlng.lng]);
        }

        // Vyvolání události pro zavření informačního panelu
        const mapClickedEvent = new CustomEvent('mapClicked', {
          detail: {
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }
        });
        window.dispatchEvent(mapClickedEvent);
      }
    });

    setMap(leafletMap);

    // Cleanup při odmontování
    return () => {
      leafletMap.remove();
    };
  }, []);

  // Aktualizace centra a zoomu s animací
  useEffect(() => {
    if (!map) return;

    // Použití animace pro přechod na nové centrum a zoom
    map.flyTo(center, zoom, {
      duration: 1.5,  // Doba trvání animace v sekundách
      easeLinearity: 0.25  // Plynulost animace (0-1)
    });
  }, [map, center, zoom]);

  // Poslouchání události pro aktualizaci polohy uživatele
  useEffect(() => {
    if (!map) return;

    const handleUserLocationUpdated = (event: CustomEvent) => {
      const { location, latLng, position } = event.detail;

      console.log('Aktualizuji polohu uživatele na mapě:', location);

      // Aktualizace stavu s polohou uživatele
      setUserLocation(location);

      // Odstranění předchozího markeru a kruhu přesnosti, pokud existují
      if (userLocationMarker) {
        map.removeLayer(userLocationMarker);
      }

      if (userLocationAccuracyCircle) {
        map.removeLayer(userLocationAccuracyCircle);
      }

      // Vytvoření ikony pro marker polohy uživatele
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div class="user-location-marker-inner"><i class="fas fa-map-marker-alt"></i></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      // Vytvoření nového markeru polohy uživatele
      const newMarker = L.marker([location.lat, location.lng], {
        icon: userIcon,
        zIndexOffset: 1000 // Zajistí, že marker bude vždy nahoře
      }).addTo(map);

      // Přidání popupu s informacemi o poloze
      newMarker.bindPopup(`
        <div class="user-location-popup">
          <div class="popup-header">
            <i class="fas fa-map-marker-alt"></i>
            Vaše aktuální poloha
          </div>
          <div class="popup-content">
            <div class="popup-section">
              <div class="popup-item">
                <i class="fas fa-map-pin"></i>
                <span>Souřadnice: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</span>
              </div>
              <div class="popup-item">
                <i class="fas fa-bullseye"></i>
                <span>Přesnost: ${position.coords.accuracy.toFixed(0)} m</span>
              </div>
              <div class="popup-item">
                <i class="fas fa-clock"></i>
                <span>Aktualizováno: ${new Date(position.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      `);

      // Vytvoření kruhu přesnosti
      const accuracyCircle = L.circle([location.lat, location.lng], {
        radius: position.coords.accuracy,
        color: '#e74c3c',
        fillColor: '#e74c3c',
        fillOpacity: 0.1,
        weight: 2,
        opacity: 0.6,
        className: 'accuracy-circle'
      }).addTo(map);

      // Aktualizace stavu s novým markerem a kruhem
      setUserLocationMarker(newMarker);
      setUserLocationAccuracyCircle(accuracyCircle);

      // Zaměření na polohu uživatele, pokud nemáme žádné markery nebo trasy
      // a pokud je to první načtení polohy (userLocation === null)
      if (markers.length === 0 && !route && !userLocation) {
        console.log('Zaměřuji mapu na aktuální polohu uživatele při prvním načtení');

        // Animované zaměření na polohu uživatele
        map.flyTo([location.lat, location.lng], 16, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }
    };

    // Přidání posluchače události
    window.addEventListener('userLocationUpdated', handleUserLocationUpdated as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('userLocationUpdated', handleUserLocationUpdated as EventListener);
    };
  }, [map, userLocationMarker, userLocationAccuracyCircle]);

  // Poslouchání události pro zobrazení polohy uživatele
  useEffect(() => {
    if (!map) return;

    const handleShowUserLocation = (event: CustomEvent) => {
      const { location, zoom } = event.detail;

      if (!location) return;

      // Zaměření mapy na polohu uživatele
      map.flyTo([location.lat, location.lng], zoom || 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    };

    // Přidání posluchače události
    window.addEventListener('showUserLocation', handleShowUserLocation as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('showUserLocation', handleShowUserLocation as EventListener);
    };
  }, [map]);

  // Poslouchání události pro zaměření na lokaci
  useEffect(() => {
    if (!map) return;

    const handleFocusOnLocation = (event: CustomEvent) => {
      const { location, zoom, animate, duration, taskId, taskTitle } = event.detail;

      console.log(`Zaměřuji mapu na lokaci úkolu "${taskTitle}" (ID: ${taskId})`, location);

      if (animate) {
        // Animované zaměření na lokaci
        map.flyTo(
          [location.lat, location.lng],
          zoom || 15,
          {
            duration: duration || 1.5, // Délka animace v sekundách
            easeLinearity: 0.25 // Plynulost animace
          }
        );

        // Přidání dočasného zvýraznění lokace
        const highlightMarker = L.circleMarker([location.lat, location.lng], {
          radius: 30,
          color: '#3498db',
          fillColor: '#3498db',
          fillOpacity: 0.3,
          weight: 2,
          opacity: 0.8
        }).addTo(map);

        // Animace zvýraznění
        const animateHighlight = () => {
          let opacity = 0.8;
          let radius = 30;
          let fillOpacity = 0.3;

          const animation = setInterval(() => {
            opacity -= 0.05;
            radius += 1;
            fillOpacity -= 0.02;

            highlightMarker.setStyle({
              radius,
              opacity,
              fillOpacity
            });

            if (opacity <= 0) {
              clearInterval(animation);
              map.removeLayer(highlightMarker);
            }
          }, 50);
        };

        // Spuštění animace po dokončení přesunu
        setTimeout(animateHighlight, duration * 1000 || 1500);
      } else {
        // Okamžité zaměření bez animace
        map.setView([location.lat, location.lng], zoom || 15);
      }
    };

    // Přidání posluchače události
    window.addEventListener('focusOnLocation', handleFocusOnLocation as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('focusOnLocation', handleFocusOnLocation as EventListener);
    };
  }, [map]);

  // Poslouchání události pro měření vzdálenosti
  useEffect(() => {
    if (!map) return;

    const handleStartMeasureDistance = (event: CustomEvent) => {
      const { startLocation, taskId, taskTitle } = event.detail;

      console.log(`Spouštím měření vzdálenosti od lokace úkolu "${taskTitle}" (ID: ${taskId})`, startLocation);

      // Aktivace režimu měření
      setMeasureMode(true);
      setMeasureStartPoint(startLocation);

      // Přidání markeru pro počáteční bod
      const startMarker = L.marker([startLocation.lat, startLocation.lng], {
        icon: L.divIcon({
          className: 'measure-marker',
          html: '<div class="plan-marker-inner glow" style="background-color: var(--marker-info);"><i class="fas fa-ruler-horizontal"></i><span class="plan-marker-title">Počáteční bod měření</span></div>',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }).addTo(map);

      // Zaměření mapy na počáteční bod
      map.flyTo(
        [startLocation.lat, startLocation.lng],
        16,
        {
          duration: 1.5,
          easeLinearity: 0.25
        }
      );

      // Odstranění markeru po 30 sekundách, pokud uživatel neklikne na druhý bod
      setTimeout(() => {
        if (measureMode && map.hasLayer(startMarker)) {
          map.removeLayer(startMarker);
          setMeasureMode(false);
          setMeasureStartPoint(null);
          alert('Měření vzdálenosti bylo zrušeno z důvodu neaktivity.');
        }
      }, 30000);
    };

    // Přidání posluchače události
    window.addEventListener('startMeasureDistance', handleStartMeasureDistance as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('startMeasureDistance', handleStartMeasureDistance as EventListener);
    };
  }, [map, measureMode]);

  // Poslouchání události pro zaměření na trasu
  useEffect(() => {
    if (!map) return;

    const handleFocusOnRoute = (event: CustomEvent) => {
      const { route, animate, duration, taskId, taskTitle } = event.detail;

      console.log(`Zaměřuji mapu na trasu úkolu "${taskTitle}" (ID: ${taskId})`, route);

      // Vytvoření hranic trasy
      const bounds = L.latLngBounds([
        [route.start.lat, route.start.lng],
        [route.end.lat, route.end.lng]
      ]);

      // Přidání bodů waypoints do hranic, pokud existují
      if (route.waypoints && route.waypoints.length > 0) {
        route.waypoints.forEach((waypoint: Marker) => {
          bounds.extend([waypoint.lat, waypoint.lng]);
        });
      }

      if (animate) {
        // Animované zaměření na trasu
        map.flyToBounds(bounds, {
          padding: [50, 50], // Odsazení od okrajů
          duration: duration || 1.5, // Délka animace v sekundách
          easeLinearity: 0.25 // Plynulost animace
        });

        // Přidání dočasného zvýraznění trasy
        const points = [
          [route.start.lat, route.start.lng],
          ...(route.waypoints?.map((wp: Marker) => [wp.lat, wp.lng]) || []),
          [route.end.lat, route.end.lng]
        ] as L.LatLngExpression[];

        const highlightRoute = L.polyline(points, {
          color: '#9b59b6',
          weight: 8,
          opacity: 0.7,
          dashArray: '10, 10'
        }).addTo(map);

        // Animace zvýraznění
        const animateHighlight = () => {
          let opacity = 0.7;
          let weight = 8;

          const animation = setInterval(() => {
            opacity -= 0.05;
            weight -= 0.5;

            highlightRoute.setStyle({
              weight,
              opacity
            });

            if (opacity <= 0) {
              clearInterval(animation);
              map.removeLayer(highlightRoute);
            }
          }, 100);
        };

        // Spuštění animace po dokončení přesunu
        setTimeout(animateHighlight, duration * 1000 || 1500);
      } else {
        // Okamžité zaměření bez animace
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    // Přidání posluchače události
    window.addEventListener('focusOnRoute', handleFocusOnRoute as EventListener);

    // Odstranění posluchače při odmontování
    return () => {
      window.removeEventListener('focusOnRoute', handleFocusOnRoute as EventListener);
    };
  }, [map]);

  // Aktualizace poskytovatele mapy
  useEffect(() => {
    if (!map) return;

    // Získáme aktualizované poskytovatele map (s aktuálním API klíčem)
    const updatedProviders = getMapProviders();
    const selectedProvider = updatedProviders[provider] || updatedProviders.openstreetmap;

    // Odstranění aktuální vrstvy
    if (currentTileLayer) {
      map.removeLayer(currentTileLayer);
    }

    // Přidání nové vrstvy
    const tileLayer = L.tileLayer(selectedProvider.url, {
      attribution: selectedProvider.attribution,
      maxZoom: selectedProvider.maxZoom,
      minZoom: 3, // Minimální zoom pro vrstvu
      noWrap: true, // Zabrání opakování mapy při velkém oddálení
      bounds: [[-90, -180], [90, 180]] // Omezení rozsahu mapy
    });

    tileLayer.addTo(map);
    setCurrentTileLayer(tileLayer);

    // Zobrazíme informaci o použití API klíče v konzoli
    if (provider === 'mapbox' && apiKey) {
      console.log('Používám Mapbox s API klíčem:', apiKey.substring(0, 6) + '...' + apiKey.substring(apiKey.length - 4));
    }
  }, [map, provider, apiKey]);

  // Aktualizace markerů
  useEffect(() => {
    if (!map) return;

    // Odstranění aktuálních markerů
    currentMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    // Přidání nových markerů
    const newMarkers = markers.map(markerData => {
      // Vytvoření vylepšené vlastní ikony pro marker
      const markerIcon = L.divIcon({
        className: 'plan-marker',
        html: `<div class="plan-marker-inner pulse" style="background-color: var(--marker-primary);">
                <i class="fas fa-map-marker-alt"></i>
                <span class="plan-marker-title">${markerData.name || 'Bod na mapě'}</span>
              </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      // Vytvoření přetažitelného markeru s vlastní ikonou
      const marker = L.marker([markerData.lat, markerData.lng], {
        draggable: true, // Povolení přetažení
        title: 'Přetáhněte pro změnu pozice',
        icon: markerIcon
      });

      if (markerData.name) {
        marker.bindPopup(`
          <div class="marker-popup">
            <div class="popup-header">
              <i class="fas fa-map-marker-alt"></i>
              ${markerData.name}
            </div>
            <div class="popup-content">
              <div class="popup-section">
                <div class="popup-item">
                  <i class="fas fa-map-pin"></i>
                  <span>Souřadnice: ${markerData.lat.toFixed(6)}, ${markerData.lng.toFixed(6)}</span>
                </div>
                <div class="popup-item">
                  <i class="fas fa-info-circle"></i>
                  <span>Přetáhněte marker pro změnu pozice</span>
                </div>
              </div>
            </div>
          </div>
        `);
      }

      // Přidání události kliknutí na marker
      marker.on('click', (e) => {
        // Zavření všech popupů
        map.closePopup();

        // Získání pozice kliknutí pro menu
        const clickPos = e.originalEvent;
        if (clickPos) {
          setMenuPosition({
            x: clickPos.clientX,
            y: clickPos.clientY
          });
        }

        // Nastavení vybrané lokace pro menu
        setSelectedLocation(markerData);

        // Hledání informací o úkolu, pokud marker patří k nějakému úkolu
        const taskInfo = findTaskInfoForLocation(markerData);
        setSelectedTaskInfo(taskInfo);

        // Volání původního handleru, pokud existuje
        if (onMarkerClick) {
          onMarkerClick(markerData);
        }
      });

      // Přidání události pro aktualizaci pozice při přetažení
      marker.on('dragend', async (e) => {
        // Získání nové pozice
        const newPosition = marker.getLatLng();

        // Aktualizace dat markeru
        const updatedMarkerData = {
          ...markerData,
          lat: newPosition.lat,
          lng: newPosition.lng
        };

        // Aktualizace ikony markeru s novými souřadnicemi
        const updatedMarkerIcon = L.divIcon({
          className: 'plan-marker',
          html: `<div class="plan-marker-inner bounce" style="background-color: var(--marker-primary);">
                  <i class="fas fa-map-marker-alt"></i>
                  <span class="plan-marker-title">${markerData.name || 'Bod na mapě'}</span>
                </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        // Aktualizace ikony markeru
        marker.setIcon(updatedMarkerIcon);

        // Aktualizace popup obsahu s novými souřadnicemi
        if (markerData.name) {
          marker.setPopupContent(`
            <div class="marker-popup">
              <div class="popup-header">
                <i class="fas fa-map-marker-alt"></i>
                ${markerData.name}
              </div>
              <div class="popup-content">
                <div class="popup-section">
                  <div class="popup-item">
                    <i class="fas fa-map-pin"></i>
                    <span>Souřadnice: ${newPosition.lat.toFixed(6)}, ${newPosition.lng.toFixed(6)}</span>
                  </div>
                  <div class="popup-item">
                    <i class="fas fa-info-circle"></i>
                    <span>Přetáhněte marker pro změnu pozice</span>
                  </div>
                </div>
              </div>
            </div>
          `);
        }

        // Zobrazení elegantního ukazatele souřadnic
        const coordinatesDisplay = document.createElement('div');
        coordinatesDisplay.className = 'coordinates-display';
        coordinatesDisplay.innerHTML = `
          <i class="fas fa-map-pin"></i>
          <span class="coordinates-value">${newPosition.lat.toFixed(6)}, ${newPosition.lng.toFixed(6)}</span>
        `;

        document.body.appendChild(coordinatesDisplay);

        // Animace ukazatele souřadnic
        setTimeout(() => {
          coordinatesDisplay.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(coordinatesDisplay);
          }, 500);
        }, 2000);

        // Vyvolání události pro informování ostatních komponent o změně pozice
        const event = new CustomEvent('markerPositionUpdated', {
          detail: {
            originalMarker: markerData,
            updatedMarker: updatedMarkerData
          }
        });
        window.dispatchEvent(event);

        // Aktualizace vybrané lokace, pokud je tento marker aktuálně vybrán
        if (selectedLocation && selectedLocation.lat === markerData.lat && selectedLocation.lng === markerData.lng) {
          setSelectedLocation(updatedMarkerData);
        }

        // Volání původního handleru, pokud existuje
        if (onMarkerClick) {
          onMarkerClick(updatedMarkerData);
        }
      });

      marker.addTo(map);
      return marker;
    });

    setCurrentMarkers(newMarkers);

    // Otevření popupu prvního markeru, pokud existuje
    if (newMarkers.length > 0 && !selectedLocation) {
      newMarkers[0].openPopup();
    }
  }, [map, markers, onMarkerClick]);

  // Funkce pro nalezení informací o úkolu podle lokace
  const findTaskInfoForLocation = (location: Marker): { id: string; title: string } | null => {
    // Procházíme všechny položky plánu a hledáme, zda některá obsahuje danou lokaci
    for (const item of planItems) {
      if (item.type === 'location' && item.location) {
        // Porovnáme souřadnice s určitou tolerancí (kvůli zaokrouhlování)
        const latDiff = Math.abs(item.location.lat - location.lat);
        const lngDiff = Math.abs(item.location.lng - location.lng);

        if (latDiff < 0.0001 && lngDiff < 0.0001) {
          return {
            id: item.id,
            title: item.title
          };
        }
      }
    }

    return null;
  };

  // Funkce pro zpracování kliknutí na mapu v režimu měření
  const handleMapClickInMeasureMode = (latlng: L.LatLng) => {
    if (!map || !measureMode) return;

    const clickedPoint: Marker = {
      lat: latlng.lat,
      lng: latlng.lng,
      name: 'Bod měření'
    };

    if (!measureStartPoint) {
      // První bod měření
      setMeasureStartPoint(clickedPoint);

      // Přidání markeru pro počáteční bod
      const startMarker = L.marker([clickedPoint.lat, clickedPoint.lng], {
        icon: L.divIcon({
          className: 'measure-marker',
          html: '<div class="measure-marker-inner start"><i class="fas fa-ruler-horizontal"></i></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);

      // Přidání informace o měření
      alert('Klikněte na druhý bod pro změření vzdálenosti');
    } else {
      // Druhý bod měření - výpočet vzdálenosti
      const startLatLng = L.latLng(measureStartPoint.lat, measureStartPoint.lng);
      const endLatLng = L.latLng(clickedPoint.lat, clickedPoint.lng);

      // Výpočet vzdálenosti v metrech
      const distanceInMeters = startLatLng.distanceTo(endLatLng);

      // Formátování vzdálenosti
      let formattedDistance: string;
      if (distanceInMeters < 1000) {
        formattedDistance = `${Math.round(distanceInMeters)} m`;
      } else {
        formattedDistance = `${(distanceInMeters / 1000).toFixed(2)} km`;
      }

      // Přidání markeru pro koncový bod
      const endMarker = L.marker([clickedPoint.lat, clickedPoint.lng], {
        icon: L.divIcon({
          className: 'measure-marker',
          html: '<div class="plan-marker-inner glow" style="background-color: var(--marker-danger);"><i class="fas fa-ruler-horizontal"></i><span class="plan-marker-title">Koncový bod měření</span></div>',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        })
      }).addTo(map);

      // Přidání čáry mezi body
      const line = L.polyline([
        [measureStartPoint.lat, measureStartPoint.lng],
        [clickedPoint.lat, clickedPoint.lng]
      ], {
        color: '#9b59b6',
        weight: 3,
        opacity: 0.8,
        dashArray: '5, 10'
      }).addTo(map);

      // Přidání popisku s vzdáleností
      const midPoint = L.latLng(
        (measureStartPoint.lat + clickedPoint.lat) / 2,
        (measureStartPoint.lng + clickedPoint.lng) / 2
      );

      const distanceLabel = L.marker(midPoint, {
        icon: L.divIcon({
          className: 'distance-label',
          html: `<div class="distance-label-inner">${formattedDistance}</div>`,
          iconSize: [80, 30],
          iconAnchor: [40, 15]
        })
      }).addTo(map);

      // Zobrazení informace o vzdálenosti
      alert(`Vzdálenost mezi body: ${formattedDistance}`);

      // Resetování režimu měření
      setMeasureMode(false);
      setMeasureStartPoint(null);

      // Vytvoření markeru pro počáteční bod
      const startMarkerObj = L.marker([measureStartPoint.lat, measureStartPoint.lng]);

      // Uložení referencí na markery a čáry
      const measureLayers = {
        startMarker: startMarkerObj,
        endMarker,
        line,
        distanceLabel
      };

      // Odstranění markerů a čáry po 10 sekundách
      setTimeout(() => {
        if (map) {
          if (map.hasLayer(measureLayers.startMarker)) map.removeLayer(measureLayers.startMarker);
          if (map.hasLayer(measureLayers.endMarker)) map.removeLayer(measureLayers.endMarker);
          if (map.hasLayer(measureLayers.line)) map.removeLayer(measureLayers.line);
          if (map.hasLayer(measureLayers.distanceLabel)) map.removeLayer(measureLayers.distanceLabel);
        }
      }, 10000);
    }
  };

  // Aktualizace trasy
  useEffect(() => {
    if (!map) return;

    // Odstranění aktuální trasy
    if (currentRoute) {
      map.removeLayer(currentRoute);
    }

    // Přidání nové trasy, pokud existuje
    if (route) {
      // Zobrazení informace o načítání trasy
      const loadingMessage = document.createElement('div');
      loadingMessage.className = 'coordinates-display';
      loadingMessage.innerHTML = `
        <i class="fas fa-route"></i>
        <span>Načítám trasu z ${route.start.name || 'počátečního bodu'} do ${route.end.name || 'cílového bodu'}...</span>
      `;
      document.body.appendChild(loadingMessage);

      // Funkce pro vykreslení trasy
      const drawRoute = async () => {
        try {
          let routePoints: L.LatLngExpression[] = [];
          let routeInfo = '';

          // Pokud máme již geometrii trasy, použijeme ji
          if (route.geometry && route.geometry.length > 0) {
            console.log('Používám uloženou geometrii trasy:', route.geometry);
            // Ujistíme se, že geometrie je ve správném formátu pro Leaflet
            routePoints = route.geometry.map((coord: [number, number]) =>
              [coord[0], coord[1]] // Ujistíme se, že používáme [lat, lng] formát
            ) as L.LatLngExpression[];

            // Přidání informací o trase, pokud máme vzdálenost a čas
            if (route.distance && route.duration) {
              const distance = routingService.formatDistance(route.distance);
              const duration = routingService.formatDuration(route.duration);
              routeInfo = `<div class="route-info">
                <div><strong>Vzdálenost:</strong> ${distance}</div>
                <div><strong>Čas:</strong> ${duration}</div>
              </div>`;

              // Aktualizace zprávy o načítání
              loadingMessage.innerHTML = `
                <i class="fas fa-route"></i>
                <span>Trasa: ${distance} (${duration})</span>
              `;
            }
          } else {
            // Jinak zkusíme získat trasu z API
            if (routingService.getApiKey()) {
              try {
                // Aktualizace zprávy o načítání
                loadingMessage.innerHTML = `
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Získávám optimální trasu...</span>
                `;

                console.log('Získávám trasu z API pro:', route.start.name, '->', route.end.name);
                const routeResult = await routingService.getRoute(route.start, route.end);
                console.log('Získána geometrie trasy z API:', routeResult.geometry);

                // Aktualizace trasy s geometrií a informacemi
                routePoints = routeResult.geometry.map((coord: [number, number]) =>
                  [coord[0], coord[1]] // Ujistíme se, že používáme [lat, lng] formát
                ) as L.LatLngExpression[];

                // Přidání informací o trase
                const distance = routingService.formatDistance(routeResult.distance);
                const duration = routingService.formatDuration(routeResult.duration);
                routeInfo = `<div class="route-info">
                  <div><strong>Vzdálenost:</strong> ${distance}</div>
                  <div><strong>Čas:</strong> ${duration}</div>
                </div>`;

                // Aktualizace zprávy o načítání
                loadingMessage.innerHTML = `
                  <i class="fas fa-check-circle"></i>
                  <span>Trasa nalezena: ${distance} (${duration})</span>
                `;
              } catch (error) {
                console.error('Chyba při získávání trasy z API:', error);
                // Fallback na přímou trasu
                console.log('Používám přímou trasu jako fallback');
                routePoints = [
                  [route.start.lat, route.start.lng],
                  ...(route.waypoints?.map(wp => [wp.lat, wp.lng]) || []),
                  [route.end.lat, route.end.lng]
                ] as L.LatLngExpression[];

                // Aktualizace zprávy o načítání v případě chyby
                loadingMessage.innerHTML = `
                  <i class="fas fa-exclamation-triangle"></i>
                  <span>Chyba při načítání trasy - použita přímá trasa</span>
                `;
              }
            } else {
              // Fallback na přímou trasu, pokud nemáme API klíč
              console.log('Používám přímou trasu (chybí API klíč)');
              routePoints = [
                [route.start.lat, route.start.lng],
                ...(route.waypoints?.map(wp => [wp.lat, wp.lng]) || []),
                [route.end.lat, route.end.lng]
              ] as L.LatLngExpression[];

              // Aktualizace zprávy o načítání
              loadingMessage.innerHTML = `
                <i class="fas fa-info-circle"></i>
                <span>Použita přímá trasa (chybí API klíč)</span>
              `;
            }
          }

          // Vykreslení stínu trasy pro lepší vizuální efekt
          const shadow = L.polyline(routePoints, {
            color: 'black',
            weight: 8,
            opacity: 0.3,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          // Vykreslení hlavní trasy
          const polyline = L.polyline(routePoints, {
            color: '#4285F4',
            weight: 5,
            opacity: 0.8,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          // Přidání animovaného efektu pro trasu
          const animatedRoute = L.polyline(routePoints, {
            color: 'white',
            weight: 2,
            opacity: 0.6,
            dashArray: '10, 20',
            lineCap: 'round',
            lineJoin: 'round',
            className: 'animated-route'
          }).addTo(map);

          // Přidání markerů pro počáteční a koncový bod
          const startIcon = L.divIcon({
            className: 'route-marker start-marker',
            html: `<div class="plan-marker-inner bounce" style="background-color: var(--marker-success);">
                    <i class="fas fa-play-circle"></i>
                    <span class="plan-marker-title">Start</span>
                  </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          });

          const endIcon = L.divIcon({
            className: 'route-marker end-marker',
            html: `<div class="plan-marker-inner bounce" style="background-color: var(--marker-danger);">
                    <i class="fas fa-flag-checkered"></i>
                    <span class="plan-marker-title">Cíl</span>
                  </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          });

          const startMarker = L.marker([route.start.lat, route.start.lng], { icon: startIcon }).addTo(map);
          const endMarker = L.marker([route.end.lat, route.end.lng], { icon: endIcon }).addTo(map);

          // Přidání popup s informacemi o trase
          if (routeInfo) {
            polyline.bindPopup(`
              <div class="route-popup">
                <div class="popup-header">
                  <i class="fas fa-route"></i>
                  Trasa: ${route.start.name || 'Počáteční bod'} → ${route.end.name || 'Cílový bod'}
                </div>
                <div class="popup-content">
                  ${routeInfo}
                </div>
              </div>
            `);
          }

          // Uložení všech prvků trasy
          setCurrentRoute(polyline);

          // Přizpůsobení zobrazení trasy s animací
          map.flyToBounds(polyline.getBounds(), {
            padding: [50, 50],
            duration: 1.5,
            easeLinearity: 0.25
          });

          // Odstranění zprávy o načítání po 2 sekundách
          setTimeout(() => {
            document.body.removeChild(loadingMessage);
          }, 2000);
        } catch (error) {
          console.error('Chyba při vykreslování trasy:', error);

          // Aktualizace zprávy o načítání v případě chyby
          loadingMessage.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Chyba při vykreslování trasy</span>
          `;

          // Odstranění zprávy po 2 sekundách
          setTimeout(() => {
            document.body.removeChild(loadingMessage);
          }, 2000);
        }
      };

      // Spuštění vykreslení trasy
      drawRoute();
    }
  }, [map, route, routingService]);

  // Zobrazení položek plánu na mapě
  useEffect(() => {
    if (!map) return;

    // Odstranění aktuálních markerů a tras plánu
    planMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    planRoutes.forEach(route => {
      map.removeLayer(route);
    });

    const newPlanMarkers: L.Marker[] = [];
    const newPlanRoutes: L.Polyline[] = [];

    // Přidání nových markerů a tras z položek plánu
    planItems.forEach(item => {
      if (item.type === 'location' && item.location) {
        // Použití EnhancedMarkers pro vytvoření markeru
        const markerProps = {
          lat: item.location.lat,
          lng: item.location.lng,
          title: item.title,
          description: item.description,
          type: item.completed ? 'success' : 'location' as any,
          animation: item.isNew ? 'pulse' : item.isActive ? 'bounce' : 'none' as any,
          shape: 'pin' as any,
          icon: item.completed ? 'fa-check' : 'fa-map-pin',
          isActive: item.isActive,
          isCompleted: item.completed,
          draggable: true,
          onDragEnd: (marker: L.Marker, latlng: L.LatLng) => {
            // Vyvolání události pro aktualizaci polohy markeru
            const markerPositionUpdatedEvent = new CustomEvent('markerPositionUpdated', {
              detail: {
                originalMarker: {
                  lat: item.location!.lat,
                  lng: item.location!.lng
                },
                updatedMarker: {
                  lat: latlng.lat,
                  lng: latlng.lng
                }
              }
            });
            window.dispatchEvent(markerPositionUpdatedEvent);
          }
        };

        // Vytvoření markeru pomocí EnhancedMarkers
        const marker = EnhancedMarkers.createMarker(map, markerProps);

        // Přidání event listeneru pro kliknutí
        marker.on('click', () => {
          // Vyvolání události pro zobrazení detailů úkolu
          const taskClickedEvent = new CustomEvent('taskClicked', {
            detail: {
              taskId: item.id,
              location: item.location
            }
          });
          window.dispatchEvent(taskClickedEvent);

          // Volání handleru pro kliknutí na marker úkolu
          if (onTaskMarkerClick) {
            // Najdeme ID plánu, ke kterému úkol patří
            let planId = undefined;
            try {
              const savedPlans = localStorage.getItem('plans');
              if (savedPlans) {
                const plans = JSON.parse(savedPlans);
                for (const plan of plans) {
                  if (plan.items && plan.items.some((i: any) => i.id === item.id)) {
                    planId = plan.id;
                    break;
                  }
                }
              }
            } catch (error) {
              console.error('Chyba při hledání plánu pro úkol:', error);
            }

            // Předáme úkol a ID plánu do handleru
            onTaskMarkerClick(item, planId);
          }
        });

        newPlanMarkers.push(marker);
      }

      if (item.type === 'route' && item.route) {
        // Funkce pro vykreslení trasy
        const drawPlanRoute = async () => {
          let routePoints: L.LatLngExpression[] = [];
          let routeInfo = '';

          // Pokud máme již geometrii trasy, použijeme ji
          if (item.route?.geometry && item.route.geometry.length > 0) {
            console.log('Používám uloženou geometrii trasy:', item.route.geometry);
            // Ujistíme se, že geometrie je ve správném formátu pro Leaflet
            routePoints = item.route.geometry.map((coord: [number, number]) =>
              [coord[0], coord[1]] // Ujistíme se, že používáme [lat, lng] formát
            ) as L.LatLngExpression[];

            // Přidání informací o trase, pokud máme vzdálenost a čas
            if (item.route.distance && item.route.duration) {
              const distance = routingService.formatDistance(item.route.distance);
              const duration = routingService.formatDuration(item.route.duration);
              routeInfo = `<div class="route-info">
                <div><strong>Vzdálenost:</strong> ${distance}</div>
                <div><strong>Čas:</strong> ${duration}</div>
              </div>`;
            }
          } else {
            // Jinak zkusíme získat trasu z API
            if (item.route && routingService.getApiKey()) {
              try {
                console.log('Získávám trasu z API pro:', item.title);
                const routeResult = await routingService.getRoute(item.route.start, item.route.end);
                console.log('Získána geometrie trasy z API:', routeResult.geometry);

                // Aktualizace trasy s geometrií a informacemi
                routePoints = routeResult.geometry.map((coord: [number, number]) =>
                  [coord[0], coord[1]] // Ujistíme se, že používáme [lat, lng] formát
                ) as L.LatLngExpression[];

                // Přidání informací o trase
                const distance = routingService.formatDistance(routeResult.distance);
                const duration = routingService.formatDuration(routeResult.duration);
                routeInfo = `<div class="route-info">
                  <div><strong>Vzdálenost:</strong> ${distance}</div>
                  <div><strong>Čas:</strong> ${duration}</div>
                </div>`;

                // Uložení geometrie a informací o trase do localStorage
                try {
                  const savedPlans = localStorage.getItem('plans');
                  if (savedPlans) {
                    const plans = JSON.parse(savedPlans);
                    for (const plan of plans) {
                      const routeItem = plan.items.find((i: any) => i.id === item.id);
                      if (routeItem && routeItem.route) {
                        console.log('Ukládám geometrii trasy do localStorage:', routeResult.geometry);
                        routeItem.route.geometry = routeResult.geometry;
                        routeItem.route.distance = routeResult.distance;
                        routeItem.route.duration = routeResult.duration;
                        localStorage.setItem('plans', JSON.stringify(plans));
                        break;
                      }
                    }
                  }
                } catch (error) {
                  console.error('Chyba při ukládání geometrie trasy:', error);
                }
              } catch (error) {
                console.error('Chyba při získávání trasy z API:', error);
                // Fallback na přímou trasu
                if (item.route) {
                  console.log('Používám přímou trasu jako fallback');
                  routePoints = [
                    [item.route.start.lat, item.route.start.lng],
                    ...(item.route.waypoints?.map((wp: Marker) => [wp.lat, wp.lng]) || []),
                    [item.route.end.lat, item.route.end.lng]
                  ] as L.LatLngExpression[];
                }
              }
            } else {
              // Fallback na přímou trasu, pokud nemáme API klíč
              if (item.route) {
                console.log('Používám přímou trasu (chybí API klíč)');
                routePoints = [
                  [item.route.start.lat, item.route.start.lng],
                  ...(item.route.waypoints?.map((wp: Marker) => [wp.lat, wp.lng]) || []),
                  [item.route.end.lat, item.route.end.lng]
                ] as L.LatLngExpression[];
              }
            }
          }

          // Určení barvy a stylu podle stavu dokončení úkolu
          const routeColor = item.completed ? '#27ae60' : '#9b59b6'; // Zelená pro dokončené, fialová pro nedokončené
          const routeWeight = item.completed ? 6 : 5; // Silnější čára pro dokončené trasy
          const routeOpacity = item.completed ? 0.8 : 0.7; // Vyšší neprůhlednost pro dokončené trasy
          const routeDashArray = item.completed ? undefined : '5, 10'; // Plná čára pro dokončené, přerušovaná pro nedokončené

          // Přidání efektu stínu pro trasu
          const shadow = L.polyline(routePoints, {
            color: 'black',
            weight: routeWeight + 2,
            opacity: 0.2,
            dashArray: routeDashArray
          }).addTo(map);

          // Přidání hlavní trasy
          const polyline = L.polyline(routePoints, {
            color: routeColor,
            weight: routeWeight,
            opacity: routeOpacity,
            dashArray: routeDashArray,
            lineCap: 'round',
            lineJoin: 'round',
            className: item.isActive === true ? 'active-route' : ''
          }).addTo(map);

          // Přidání animace pro aktivní trasu
          if (item.isActive === true) {
            // Přidání animace pro aktivní trasu
            const animatedRoute = L.polyline(routePoints, {
              color: 'white',
              weight: 3,
              opacity: 0.6,
              dashArray: '10, 20',
              lineCap: 'round',
              lineJoin: 'round',
              className: 'animated-route'
            }).addTo(map);

            // Přidání do seznamu tras
            newPlanRoutes.push(shadow, animatedRoute);
          } else {
            // Přidání do seznamu tras
            newPlanRoutes.push(shadow);
          }

          const completedStatus = item.completed ? '<span style="color: #27ae60; font-weight: bold;">✓ Dokončeno</span>' : '<span style="color: #3498db;">Nedokončeno</span>';

          // Přidání popup s informacemi o trase
          polyline.bindPopup(`
            <div class="route-popup">
              <div class="popup-header">
                <i class="fas fa-route"></i>
                ${item.title}
              </div>
              <div class="popup-content">
                <div class="popup-section">
                  <div class="popup-section-title">
                    <i class="fas fa-info-circle"></i>
                    Detaily trasy
                  </div>
                  <div class="popup-item">
                    <i class="fas fa-play"></i>
                    <span>Od: ${item.route?.start.name || 'Počáteční bod'}</span>
                  </div>
                  <div class="popup-item">
                    <i class="fas fa-flag"></i>
                    <span>Do: ${item.route?.end.name || 'Cílový bod'}</span>
                  </div>
                  ${item.description ? `
                  <div class="popup-item">
                    <i class="fas fa-align-left"></i>
                    <span>${item.description}</span>
                  </div>
                  ` : ''}
                  <div class="popup-item">
                    <i class="fas fa-clock"></i>
                    <span>Vytvořeno: ${item.createdAt ? new Date(item.createdAt).toLocaleString() : new Date().toLocaleString()}</span>
                  </div>
                  ${completedStatus}
                </div>
                ${routeInfo ? `
                <div class="popup-section">
                  <div class="popup-section-title">
                    <i class="fas fa-tachometer-alt"></i>
                    Informace o cestě
                  </div>
                  <div class="route-info-item">
                    <i class="fas fa-road"></i>
                    <span>${routeInfo.replace(/<div><strong>Vzdálenost:<\/strong> /g, '').replace(/<\/div><div><strong>Čas:<\/strong> /g, '</span></div><div class="route-info-item"><i class="fas fa-clock"></i><span>').replace(/<\/div><\/div>/g, '')}</span>
                  </div>
                </div>
                ` : ''}
                <div class="popup-actions">
                  <button class="popup-button" onclick="window.dispatchEvent(new CustomEvent('toggleTaskComplete', {detail: {taskId: '${item.id}'}}))">
                    ${item.completed ? 'Označit jako nesplněný' : 'Označit jako splněný'}
                  </button>
                  <button class="popup-button secondary" onclick="window.dispatchEvent(new CustomEvent('navigateToLocation', {detail: {lat: ${item.route?.start.lat}, lng: ${item.route?.start.lng}, name: '${item.title}'}}))">
                    Navigovat
                  </button>
                </div>
              </div>
            </div>
          `);

          newPlanRoutes.push(polyline);
        };

        // Spuštění vykreslení trasy
        drawPlanRoute();

        // Přidání markerů pro počáteční a koncový bod trasy
        // Určení barvy podle stavu dokončení úkolu
        const startBgColor = item.completed ? '#27ae60' : '#2ecc71'; // Tmavší zelená pro dokončené
        const endBgColor = item.completed ? '#c0392b' : '#e74c3c'; // Tmavší červená pro dokončené

        // Určení třídy pro animaci
        let animationClass = '';
        if (item.completed) {
          animationClass = 'completed';
        } else if (item.isNew === true) {
          animationClass = 'new';
        } else if (item.isActive === true) {
          animationClass = 'highlight';
        }

        const startIcon = L.divIcon({
          className: 'plan-marker',
          html: `<div class="plan-marker-inner ${animationClass}" style="background-color: ${startBgColor};">
                  <i class="fas ${item.completed ? 'fa-check' : 'fa-play'}"></i>
                  <span class="plan-marker-title">Start: ${item.route.start.name || 'Počáteční bod'}</span>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });

        const endIcon = L.divIcon({
          className: 'plan-marker',
          html: `<div class="plan-marker-inner ${animationClass}" style="background-color: ${endBgColor};">
                  <i class="fas ${item.completed ? 'fa-check' : 'fa-flag'}"></i>
                  <span class="plan-marker-title">Cíl: ${item.route.end.name || 'Cílový bod'}</span>
                </div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30]
        });

        const startMarker = L.marker([item.route.start.lat, item.route.start.lng], {
          icon: startIcon,
          zIndexOffset: item.isActive === true ? 1000 : 0 // Aktivní úkoly budou vždy nahoře
        });

        const endMarker = L.marker([item.route.end.lat, item.route.end.lng], {
          icon: endIcon,
          zIndexOffset: item.isActive === true ? 1000 : 0 // Aktivní úkoly budou vždy nahoře
        });

        startMarker.bindPopup(`
          <div class="task-popup">
            <div class="popup-header" style="background-color: ${startBgColor};">
              <i class="fas fa-play"></i>
              Počáteční bod trasy
            </div>
            <div class="popup-content">
              <div class="popup-section">
                <div class="popup-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${item.route.start.name || 'Počáteční bod'}</span>
                </div>
                <div class="popup-item">
                  <i class="fas fa-map-pin"></i>
                  <span>Souřadnice: ${item.route.start.lat.toFixed(6)}, ${item.route.start.lng.toFixed(6)}</span>
                </div>
              </div>
              <div class="popup-actions">
                <button class="popup-button" onclick="window.dispatchEvent(new CustomEvent('navigateToLocation', {detail: {lat: ${item.route.start.lat}, lng: ${item.route.start.lng}, name: '${item.route.start.name || 'Počáteční bod'}'}}))">
                  Navigovat
                </button>
              </div>
            </div>
          </div>
        `);

        endMarker.bindPopup(`
          <div class="task-popup">
            <div class="popup-header" style="background-color: ${endBgColor};">
              <i class="fas fa-flag"></i>
              Cílový bod trasy
            </div>
            <div class="popup-content">
              <div class="popup-section">
                <div class="popup-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${item.route.end.name || 'Cílový bod'}</span>
                </div>
                <div class="popup-item">
                  <i class="fas fa-map-pin"></i>
                  <span>Souřadnice: ${item.route.end.lat.toFixed(6)}, ${item.route.end.lng.toFixed(6)}</span>
                </div>
              </div>
              <div class="popup-actions">
                <button class="popup-button" onclick="window.dispatchEvent(new CustomEvent('navigateToLocation', {detail: {lat: ${item.route.end.lat}, lng: ${item.route.end.lng}, name: '${item.route.end.name || 'Cílový bod'}'}}))">
                  Navigovat
                </button>
              </div>
            </div>
          </div>
        `);

        startMarker.addTo(map);
        endMarker.addTo(map);

        newPlanMarkers.push(startMarker, endMarker);
      }
    });

    setPlanMarkers(newPlanMarkers);
    setPlanRoutes(newPlanRoutes);

    // Pokud máme položky plánu a žádné hlavní markery nebo trasy,
    // přizpůsobíme zobrazení, aby byly vidět všechny položky plánu
    if (planItems.length > 0 && markers.length === 0 && !route) {
      // Vytvoříme hranice pro všechny položky plánu
      const bounds: L.LatLngBounds[] = [];

      planItems.forEach(item => {
        if (item.type === 'location' && item.location) {
          bounds.push(L.latLngBounds([item.location.lat, item.location.lng], [item.location.lat, item.location.lng]));
        }

        if (item.type === 'route' && item.route) {
          const startPoint = L.latLng(item.route.start.lat, item.route.start.lng);
          const endPoint = L.latLng(item.route.end.lat, item.route.end.lng);

          // Vytvoření hranic pro trasu
          const routeBounds = L.latLngBounds(startPoint, endPoint);

          // Přidání waypointů do hranic, pokud existují
          item.route.waypoints?.forEach(wp => {
            routeBounds.extend(L.latLng(wp.lat, wp.lng));
          });

          bounds.push(routeBounds);
        }
      });

      if (bounds.length > 0) {
        // Vytvoříme jednu hranici, která obsahuje všechny položky
        let allBounds = bounds[0];

        // Přidáme všechny ostatní hranice
        for (let i = 1; i < bounds.length; i++) {
          allBounds = allBounds.extend(bounds[i]);
        }

        // Přizpůsobíme mapu, aby zobrazovala všechny položky
        map.fitBounds(allBounds, { padding: [50, 50] });
      }
    }
  }, [map, planItems, routingService]);

  // Přizpůsobení velikosti mapy při změně velikosti okna
  useEffect(() => {
    if (!map) return;

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  // Funkce pro zpracování navigace na lokaci
  const handleNavigateToLocation = (location: Marker) => {
    if (!map) return;

    // Vytvoření události pro animované zaměření na lokaci
    const focusEvent = new CustomEvent('focusOnLocation', {
      detail: {
        location,
        zoom: 16,
        animate: true,
        duration: 1.5
      }
    });

    // Vyvolání události pro zaměření na lokaci
    window.dispatchEvent(focusEvent);

    // Zavření menu
    setSelectedLocation(null);
  };

  // Funkce pro přidání lokace k úkolu
  const handleAddLocationToTask = (location: Marker) => {
    // Zde by byla implementace přidání lokace k úkolu
    // Pro jednoduchost pouze zobrazíme alert
    alert(`Lokace ${location.name || 'bez názvu'} byla přidána k úkolu`);

    // Zavření menu
    setSelectedLocation(null);
  };

  // Funkce pro sdílení lokace
  const handleShareLocation = (location: Marker) => {
    // Vytvoření URL pro sdílení
    const shareUrl = `https://maps.google.com/maps?q=${location.lat},${location.lng}`;

    // Kopírování URL do schránky
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Odkaz na lokaci byl zkopírován do schránky');
      })
      .catch(err => {
        console.error('Chyba při kopírování do schránky:', err);
        alert(`Odkaz na lokaci: ${shareUrl}`);
      });

    // Zavření menu
    setSelectedLocation(null);
  };

  // Funkce pro úpravu názvu lokace
  const handleEditLocation = (location: Marker, newName: string) => {
    // Zde by byla implementace úpravy názvu lokace
    // Pro jednoduchost pouze zobrazíme alert
    alert(`Název lokace byl změněn na: ${newName}`);

    // Zavření menu
    setSelectedLocation(null);
  };

  // Funkce pro měření vzdálenosti
  const handleMeasureDistance = (fromLocation: Marker) => {
    // Aktivace režimu měření
    setMeasureMode(true);
    setMeasureStartPoint(fromLocation);

    // Informace pro uživatele
    alert('Režim měření vzdálenosti aktivován. Klikněte na cílový bod na mapě.');

    // Zavření menu
    setSelectedLocation(null);
  };

  // Funkce pro zobrazení míst v okolí
  const handleShowNearby = (location: Marker, category: string) => {
    // Zde by byla implementace vyhledávání míst v okolí
    // Pro jednoduchost pouze zobrazíme alert
    alert(`Vyhledávání kategorie "${category}" v okolí lokace ${location.name || 'bez názvu'}`);

    // Zavření menu
    setSelectedLocation(null);
  };

  // Funkce pro odstranění bodu
  const handleRemoveLocation = (location: Marker) => {
    if (!map) return;

    // Potvrzovací dialog před odstraněním bodu
    if (!window.confirm(`Opravdu chcete odstranit bod "${location.name || 'bez názvu'}"?`)) {
      return;
    }

    // Najdeme marker, který chceme odstranit
    const markerToRemove = currentMarkers.find(marker => {
      const markerLatLng = marker.getLatLng();
      return Math.abs(markerLatLng.lat - location.lat) < 0.0001 &&
             Math.abs(markerLatLng.lng - location.lng) < 0.0001;
    });

    // Pokud jsme našli marker, odstraníme ho z mapy
    if (markerToRemove) {
      map.removeLayer(markerToRemove);

      // Aktualizujeme seznam markerů
      setCurrentMarkers(currentMarkers.filter(marker => marker !== markerToRemove));
    }

    // Najdeme informace o úkolu, pokud marker patří k nějakému úkolu
    const taskInfo = findTaskInfoForLocation(location);

    // Pokud marker patří k úkolu, vyvoláme událost pro odstranění lokace z úkolu
    if (taskInfo) {
      console.log('Odstraňuji lokaci z úkolu:', taskInfo);

      // Vyvoláme událost pro odstranění lokace z úkolu
      const event = new CustomEvent('locationRemovedFromTask', {
        detail: {
          taskId: taskInfo.id,
          location: location,
          forceRefresh: true // Přidáme flag pro vynucení aktualizace
        }
      });
      window.dispatchEvent(event);

      // Počkáme chvíli a pak vyvoláme ještě jednu událost pro aktualizaci UI
      setTimeout(() => {
        const refreshEvent = new CustomEvent('refreshPlanDisplay', {
          detail: {
            taskId: taskInfo.id,
            action: 'forceRefresh'
          }
        });
        window.dispatchEvent(refreshEvent);
      }, 300);
    }

    // Vyvoláme událost pro informování ostatních komponent o odstranění markeru
    const event = new CustomEvent('markerRemoved', {
      detail: {
        location: location
      }
    });
    window.dispatchEvent(event);

    // Zobrazení potvrzení o odstranění bodu
    const coordinatesDisplay = document.createElement('div');
    coordinatesDisplay.className = 'coordinates-display';
    coordinatesDisplay.innerHTML = `
      <i class="fas fa-trash-alt"></i>
      <span>Bod "${location.name || 'bez názvu'}" byl odstraněn</span>
    `;

    document.body.appendChild(coordinatesDisplay);

    // Animace ukazatele
    setTimeout(() => {
      coordinatesDisplay.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(coordinatesDisplay);
      }, 500);
    }, 2000);

    // Zavření menu
    setSelectedLocation(null);
  };

  // Efekt pro zobrazení animace cesty plánu a "Mission Completed"
  useEffect(() => {
    if (!map || !activePlan) return;

    // Kontrola, zda jsou všechny úkoly v plánu dokončené
    const allTasksCompleted = activePlan.items.every((item: PlanItem) => item.completed);

    if (allTasksCompleted) {
      // Zobrazení animace cesty plánu
      setShowPathAnimation(true);

      // Po dokončení animace cesty zobrazíme "Mission Completed"
      const handlePathAnimationComplete = () => {
        setShowPathAnimation(false);
        setCompletedPlanTitle(activePlan.title);
        setShowMissionCompleted(true);
      };

      // Funkce pro zpracování ukončení animace "Mission Completed"
      const handleMissionCompletedFinished = () => {
        setShowMissionCompleted(false);
      };

      // Nastavení funkcí pro zpracování ukončení animací
      window.handlePathAnimationComplete = handlePathAnimationComplete;
      window.handleMissionCompletedFinished = handleMissionCompletedFinished;
    }

    return () => {
      // Cleanup
      delete window.handlePathAnimationComplete;
      delete window.handleMissionCompletedFinished;
    };
  }, [map, activePlan]);

  // Funkce pro zaměření na aktuální polohu uživatele
  const handleFocusOnUserLocation = () => {
    // Vytvoření události pro zaměření na aktuální polohu uživatele
    const event = new CustomEvent('focusOnUserLocationRequest');
    window.dispatchEvent(event);
  };

  return (
    <div className="map-component">
      <div className="map" ref={mapRef}></div>

      {/* Tlačítko pro zaměření na aktuální polohu uživatele */}
      <div className="location-button" onClick={handleFocusOnUserLocation}>
        <i className="fas fa-location-arrow"></i>
      </div>

      {/* Interaktivní menu pro lokaci */}
      {selectedLocation && (
        <LocationActionMenu
          location={selectedLocation}
          taskId={selectedTaskInfo?.id}
          taskTitle={selectedTaskInfo?.title}
          onClose={() => setSelectedLocation(null)}
          onAddToTask={handleAddLocationToTask}
          onNavigateTo={handleNavigateToLocation}
          onShareLocation={handleShareLocation}
          onEditLocation={handleEditLocation}
          onMeasureDistance={handleMeasureDistance}
          onShowNearby={handleShowNearby}
          onRemoveLocation={handleRemoveLocation}
          position={menuPosition}
        />
      )}

      {/* Animace cesty plánu */}
      {showPathAnimation && map && activePlan && (
        <PlanPathAnimation
          plan={activePlan}
          map={map}
          onAnimationComplete={() => {
            if (window.handlePathAnimationComplete) {
              window.handlePathAnimationComplete();
            }
          }}
        />
      )}

      {/* Animace "Mission Completed" */}
      {showMissionCompleted && (
        <MissionCompletedAnimation
          planTitle={completedPlanTitle}
          onComplete={() => {
            if (window.handleMissionCompletedFinished) {
              window.handleMissionCompletedFinished();
            }
          }}
        />
      )}
    </div>
  );
};

export default MapComponent;
