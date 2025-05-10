import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { Plan, PlanItem } from '../Planning/PlanningPanel';
import './PlanPathAnimation.css';

interface PlanPathAnimationProps {
  plan: Plan;
  map: L.Map | null;
  onAnimationComplete: () => void;
}

const PlanPathAnimation: React.FC<PlanPathAnimationProps> = ({ plan, map, onAnimationComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [pathPolyline, setPathPolyline] = useState<L.Polyline | null>(null);
  const [pathMarkers, setPathMarkers] = useState<L.Marker[]>([]);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  
  // Funkce pro získání lokací z plánu
  const getLocationsFromPlan = (plan: Plan): { lat: number; lng: number; title: string; id: string }[] => {
    const locations: { lat: number; lng: number; title: string; id: string }[] = [];
    
    // Procházíme všechny položky plánu a hledáme lokace
    plan.items.forEach(item => {
      if (item.type === 'location' && item.location) {
        locations.push({
          lat: item.location.lat,
          lng: item.location.lng,
          title: item.title,
          id: item.id
        });
      } else if (item.type === 'route' && item.route) {
        // Přidáme počáteční bod trasy
        locations.push({
          lat: item.route.start.lat,
          lng: item.route.start.lng,
          title: `${item.title} (start)`,
          id: `${item.id}-start`
        });
        
        // Přidáme koncový bod trasy
        locations.push({
          lat: item.route.end.lat,
          lng: item.route.end.lng,
          title: `${item.title} (cíl)`,
          id: `${item.id}-end`
        });
      }
    });
    
    return locations;
  };
  
  // Efekt pro vytvoření a animaci cesty
  useEffect(() => {
    if (!map) return;
    
    // Získání lokací z plánu
    const locations = getLocationsFromPlan(plan);
    
    if (locations.length < 2) {
      // Pokud nemáme dostatek bodů pro cestu, ukončíme animaci
      onAnimationComplete();
      return;
    }
    
    // Vytvoření bodů pro cestu
    const points = locations.map(loc => L.latLng(loc.lat, loc.lng));
    
    // Vytvoření polyline pro cestu
    const polyline = L.polyline([], {
      color: '#3498db',
      weight: 5,
      opacity: 0.8,
      dashArray: '10, 10',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    
    setPathPolyline(polyline);
    
    // Vytvoření markerů pro body cesty
    const markers = locations.map((loc, index) => {
      const isCompleted = index < currentStep;
      
      // Vytvoření ikony pro marker
      const icon = L.divIcon({
        className: 'plan-path-marker',
        html: `<div class="plan-path-marker-inner ${isCompleted ? 'completed' : ''}" data-index="${index}">
                <span>${index + 1}</span>
              </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      
      // Vytvoření markeru
      const marker = L.marker([loc.lat, loc.lng], { icon, opacity: 0 })
        .bindTooltip(loc.title)
        .addTo(map);
      
      return marker;
    });
    
    setPathMarkers(markers);
    
    // Funkce pro animaci cesty
    const animatePath = () => {
      // Nastavení hranic pro zobrazení všech bodů
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
      
      // Animace markerů a cesty
      let currentIndex = 0;
      const animationInterval = setInterval(() => {
        if (currentIndex >= locations.length) {
          clearInterval(animationInterval);
          
          // Spuštění animace "Mission Completed"
          setTimeout(() => {
            onAnimationComplete();
          }, 1000);
          
          return;
        }
        
        // Aktualizace polyline
        const currentPoints = points.slice(0, currentIndex + 1);
        polyline.setLatLngs(currentPoints);
        
        // Zobrazení aktuálního markeru
        markers[currentIndex].setOpacity(1);
        
        // Animace markeru
        const markerElement = document.querySelector(`.plan-path-marker-inner[data-index="${currentIndex}"]`);
        if (markerElement) {
          markerElement.classList.add('animate');
        }
        
        // Přesun mapy na aktuální bod
        if (currentIndex > 0) {
          map.flyTo(points[currentIndex], map.getZoom(), {
            duration: 1.5,
            easeLinearity: 0.25
          });
        }
        
        // Aktualizace stavu
        setCurrentStep(currentIndex + 1);
        setAnimationProgress((currentIndex + 1) / locations.length * 100);
        
        currentIndex++;
      }, 2000);
      
      // Cleanup při odmontování
      return () => {
        clearInterval(animationInterval);
      };
    };
    
    // Spuštění animace po krátkém zpoždění
    const animationTimeout = setTimeout(animatePath, 500);
    
    // Cleanup při odmontování
    return () => {
      clearTimeout(animationTimeout);
      
      // Odstranění polyline a markerů
      if (map) {
        polyline.removeFrom(map);
        markers.forEach(marker => marker.removeFrom(map));
      }
    };
  }, [map, plan, onAnimationComplete]);
  
  return (
    <div className="plan-path-animation">
      <div className="plan-path-progress">
        <div className="plan-path-progress-bar" style={{ width: `${animationProgress}%` }}></div>
        <div className="plan-path-progress-text">
          {currentStep} / {getLocationsFromPlan(plan).length} bodů
        </div>
      </div>
    </div>
  );
};

export default PlanPathAnimation;
