import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapComponent.css';

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

// Definice typů pro poskytovatele map
type MapProviderType = 'openstreetmap' | 'mapycz' | 'google' | 'mapbox';

interface MapProvider {
  id: MapProviderType;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

// Definice vlastností komponenty
interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  provider?: string;
  markers?: Marker[];
  route?: Route | null;
  apiKey?: string | null; // Přidáno: API klíč pro mapové služby
  onMarkerClick?: (marker: Marker) => void;
  onMapClick?: (latlng: [number, number]) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [50.0755, 14.4378], // Praha
  zoom = 13,
  provider = 'openstreetmap',
  markers = [],
  route = null,
  apiKey = null, // Přidáno: API klíč
  onMarkerClick,
  onMapClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [currentTileLayer, setCurrentTileLayer] = useState<L.TileLayer | null>(null);
  const [currentMarkers, setCurrentMarkers] = useState<L.Marker[]>([]);
  const [currentRoute, setCurrentRoute] = useState<L.Polyline | null>(null);

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
      attributionControl: true
    });

    // Přidání výchozí vrstvy
    const selectedProvider = mapProviders[provider] || mapProviders.openstreetmap;
    const tileLayer = L.tileLayer(selectedProvider.url, {
      attribution: selectedProvider.attribution,
      maxZoom: selectedProvider.maxZoom
    });

    tileLayer.addTo(leafletMap);
    setCurrentTileLayer(tileLayer);

    // Nastavení události kliknutí na mapu
    if (onMapClick) {
      leafletMap.on('click', (e) => {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      });
    }

    setMap(leafletMap);

    // Cleanup při odmontování
    return () => {
      leafletMap.remove();
    };
  }, []);

  // Aktualizace centra a zoomu
  useEffect(() => {
    if (!map) return;

    map.setView(center, zoom);
  }, [map, center, zoom]);

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
      maxZoom: selectedProvider.maxZoom
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
      const marker = L.marker([markerData.lat, markerData.lng]);

      if (markerData.name) {
        marker.bindPopup(markerData.name);
      }

      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick(markerData);
        });
      }

      marker.addTo(map);
      return marker;
    });

    setCurrentMarkers(newMarkers);

    // Otevření popupu prvního markeru, pokud existuje
    if (newMarkers.length > 0) {
      newMarkers[0].openPopup();
    }
  }, [map, markers, onMarkerClick]);

  // Aktualizace trasy
  useEffect(() => {
    if (!map) return;

    // Odstranění aktuální trasy
    if (currentRoute) {
      map.removeLayer(currentRoute);
    }

    // Přidání nové trasy, pokud existuje
    if (route) {
      const routePoints = [
        [route.start.lat, route.start.lng],
        ...(route.waypoints?.map(wp => [wp.lat, wp.lng]) || []),
        [route.end.lat, route.end.lng]
      ] as L.LatLngExpression[];

      const polyline = L.polyline(routePoints, {
        color: '#4285F4',
        weight: 5,
        opacity: 0.7
      }).addTo(map);

      setCurrentRoute(polyline);

      // Přizpůsobení zobrazení trasy
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [map, route]);

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

  return (
    <div className="map-component">
      <div className="map" ref={mapRef}></div>
    </div>
  );
};

export default MapComponent;
