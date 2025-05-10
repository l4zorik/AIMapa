import React, { useEffect, useRef, useState } from 'react';
import './GlobeComponent.css';

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

// Definice vlastností komponenty
interface GlobeComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: Marker[];
  route?: Route | null;
  onMarkerClick?: (marker: Marker) => void;
  onGlobeClick?: (latlng: [number, number]) => void;
}

const GlobeComponent: React.FC<GlobeComponentProps> = ({
  center = [50.0755, 14.4378], // Praha
  zoom = 2.5,
  markers = [],
  route = null,
  onMarkerClick,
  onGlobeClick
}) => {
  const globeRef = useRef<HTMLDivElement>(null);
  const [globe, setGlobe] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Inicializace glóbusu
  useEffect(() => {
    if (!globeRef.current) return;

    // Dynamicky načteme knihovnu Three.js a Globe.GL
    const loadGlobeLibraries = async () => {
      try {
        // Načtení Three.js
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.137.0/build/three.min.js';
        document.head.appendChild(threeScript);

        // Počkáme na načtení Three.js
        await new Promise<void>((resolve) => {
          threeScript.onload = () => resolve();
        });

        // Načtení Globe.GL
        const globeScript = document.createElement('script');
        globeScript.src = 'https://cdn.jsdelivr.net/npm/globe.gl@2.28.4/dist/globe.gl.min.js';
        document.head.appendChild(globeScript);

        // Počkáme na načtení Globe.GL
        await new Promise<void>((resolve) => {
          globeScript.onload = () => resolve();
        });

        // Inicializace glóbusu
        if (typeof (window as any).Globe !== 'undefined') {
          initGlobe();
        } else {
          console.error('Globe.GL nebyla načtena');
        }
      } catch (error) {
        console.error('Chyba při načítání knihoven pro glóbus:', error);
      }
    };

    loadGlobeLibraries();

    // Cleanup při odmontování
    return () => {
      // Zde by bylo čištění glóbusu, pokud by bylo potřeba
    };
  }, []);

  // Funkce pro inicializaci glóbusu
  const initGlobe = () => {
    if (!globeRef.current || typeof (window as any).Globe === 'undefined') return;

    try {
      const Globe = (window as any).Globe;
      
      // Vytvoření instance glóbusu
      const globeInstance = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .width(globeRef.current.clientWidth)
        .height(globeRef.current.clientHeight)
        .pointOfView({ lat: center[0], lng: center[1], altitude: 2.5 })
        .onGlobeClick((coords: any) => {
          if (onGlobeClick) {
            onGlobeClick([coords.lat, coords.lng]);
          }
        });

      // Přidání glóbusu do DOM
      globeInstance(globeRef.current);
      
      // Uložení instance glóbusu
      setGlobe(globeInstance);
      setIsInitialized(true);
      
      console.log('Glóbus byl úspěšně inicializován');
    } catch (error) {
      console.error('Chyba při inicializaci glóbusu:', error);
    }
  };

  // Aktualizace markerů
  useEffect(() => {
    if (!globe || !isInitialized) return;

    try {
      // Konverze markerů do formátu pro Globe.GL
      const points = markers.map(marker => ({
        lat: marker.lat,
        lng: marker.lng,
        name: marker.name || 'Místo',
        color: 'red',
        size: 0.5
      }));

      // Přidání markerů na glóbus
      globe
        .pointsData(points)
        .pointLabel('name')
        .pointColor('color')
        .pointAltitude(0.01)
        .pointRadius('size')
        .onPointClick((point: any) => {
          if (onMarkerClick) {
            onMarkerClick({
              lat: point.lat,
              lng: point.lng,
              name: point.name
            });
          }
        });
    } catch (error) {
      console.error('Chyba při aktualizaci markerů na glóbusu:', error);
    }
  }, [globe, markers, isInitialized, onMarkerClick]);

  // Aktualizace trasy
  useEffect(() => {
    if (!globe || !isInitialized || !route) return;

    try {
      // Vytvoření trasy pro Globe.GL
      const routePoints = [
        { lat: route.start.lat, lng: route.start.lng },
        ...(route.waypoints?.map(wp => ({ lat: wp.lat, lng: wp.lng })) || []),
        { lat: route.end.lat, lng: route.end.lng }
      ];

      // Přidání trasy na glóbus
      globe
        .arcsData([{
          startLat: route.start.lat,
          startLng: route.start.lng,
          endLat: route.end.lat,
          endLng: route.end.lng,
          color: 'rgba(66, 133, 244, 0.8)'
        }])
        .arcColor('color')
        .arcDashLength(0.4)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1500);
    } catch (error) {
      console.error('Chyba při aktualizaci trasy na glóbusu:', error);
    }
  }, [globe, route, isInitialized]);

  // Aktualizace centra a zoomu
  useEffect(() => {
    if (!globe || !isInitialized) return;

    try {
      // Nastavení pohledu na glóbusu
      globe.pointOfView({
        lat: center[0],
        lng: center[1],
        altitude: 2.5 / zoom // Přepočet zoomu na výšku
      });
    } catch (error) {
      console.error('Chyba při aktualizaci pohledu na glóbusu:', error);
    }
  }, [globe, center, zoom, isInitialized]);

  // Přizpůsobení velikosti glóbusu při změně velikosti okna
  useEffect(() => {
    if (!globe || !isInitialized) return;

    const handleResize = () => {
      if (globeRef.current) {
        globe
          .width(globeRef.current.clientWidth)
          .height(globeRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [globe, isInitialized]);

  return (
    <div className="globe-component">
      <div className="globe" ref={globeRef}></div>
      {!isInitialized && (
        <div className="globe-loading">
          <div className="loading-spinner"></div>
          <p>Načítání 3D glóbusu...</p>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
