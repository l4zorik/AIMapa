/**
 * TimelinePanel.tsx
 * Komponenta pro zobrazení časové osy plánu
 */

import React, { useState, useEffect, useRef } from 'react';
import './TimelinePanel.css';
import TimelineEvent from './TimelineEvent';
import TimelineControls from './TimelineControls';
import { formatTime, calculateEventTimes } from './timelineUtils';

// Typy pro časovou osu
export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // v minutách
  type: 'task' | 'travel' | 'break' | 'milestone';
  completed?: boolean;
  color?: string;
  icon?: string;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
}

export interface TimelinePlan {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  events: TimelineEvent[];
}

interface TimelinePanelProps {
  plan?: TimelinePlan;
  onEventClick?: (event: TimelineEvent) => void;
  onTimeUpdate?: (currentTime: Date) => void;
  autoPlay?: boolean;
  speed?: number; // 1 = normální rychlost, 2 = 2x rychleji, 0.5 = 2x pomaleji
  showControls?: boolean;
  compact?: boolean;
}

const TimelinePanel: React.FC<TimelinePanelProps> = ({
  plan,
  onEventClick,
  onTimeUpdate,
  autoPlay = false,
  speed = 1,
  showControls = true,
  compact = false
}) => {
  // Stav pro aktuální čas na časové ose
  const [currentTime, setCurrentTime] = useState<Date>(
    plan?.startDate ? new Date(plan.startDate) : new Date()
  );
  
  // Stav pro přehrávání časové osy
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  
  // Stav pro rychlost přehrávání
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(speed);
  
  // Reference pro animaci
  const animationRef = useRef<number | null>(null);
  
  // Reference pro poslední čas aktualizace
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Vypočítané události s časy
  const [calculatedEvents, setCalculatedEvents] = useState<TimelineEvent[]>([]);
  
  // Efekt pro výpočet časů událostí při změně plánu
  useEffect(() => {
    if (plan && plan.events.length > 0) {
      // Použijeme utilitu pro výpočet časů událostí
      const events = calculateEventTimes(plan);
      setCalculatedEvents(events);
      
      // Nastavíme aktuální čas na začátek plánu
      setCurrentTime(new Date(plan.startDate));
    }
  }, [plan]);
  
  // Efekt pro animaci časové osy
  useEffect(() => {
    if (!isPlaying || !plan) return;
    
    const animate = (timestamp: number) => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTimeRef.current;
      
      // Aktualizujeme čas pouze pokud uplynul dostatečný čas
      if (deltaTime > 50) { // 50ms = 20fps
        // Vypočítáme nový čas na základě rychlosti přehrávání
        const newTime = new Date(currentTime.getTime() + deltaTime * playbackSpeed * 60); // 60 = simulujeme 1 minutu za sekundu
        
        // Kontrola, zda jsme nedosáhli konce plánu
        if (plan.endDate && newTime > plan.endDate) {
          setCurrentTime(new Date(plan.endDate));
          setIsPlaying(false);
        } else {
          setCurrentTime(newTime);
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
        }
        
        lastUpdateTimeRef.current = now;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, playbackSpeed, plan, onTimeUpdate]);
  
  // Funkce pro ovládání přehrávání
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    lastUpdateTimeRef.current = Date.now();
  };
  
  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
  };
  
  const handleSeek = (time: Date) => {
    setCurrentTime(time);
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  };
  
  const handleReset = () => {
    if (plan) {
      setCurrentTime(new Date(plan.startDate));
      if (onTimeUpdate) {
        onTimeUpdate(new Date(plan.startDate));
      }
    }
  };
  
  // Pokud nemáme plán, zobrazíme prázdný stav
  if (!plan) {
    return (
      <div className="timeline-panel empty">
        <div className="timeline-empty-state">
          <i className="fas fa-clock"></i>
          <p>Žádný plán není k dispozici</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`timeline-panel ${compact ? 'compact' : ''}`}>
      <div className="timeline-header">
        <h2>{plan.title}</h2>
        <div className="timeline-date-range">
          <span>{formatTime(plan.startDate, 'date')}</span>
          {plan.endDate && (
            <>
              <span className="separator">-</span>
              <span>{formatTime(plan.endDate, 'date')}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="timeline-current-time">
        <div className="time-indicator">
          <i className="fas fa-clock"></i>
          <span>{formatTime(currentTime, 'datetime')}</span>
        </div>
      </div>
      
      <div className="timeline-events-container">
        <div className="timeline-line"></div>
        
        {calculatedEvents.map((event) => (
          <TimelineEvent
            key={event.id}
            event={event}
            currentTime={currentTime}
            onClick={() => onEventClick && onEventClick(event)}
          />
        ))}
      </div>
      
      {showControls && (
        <TimelineControls
          isPlaying={isPlaying}
          speed={playbackSpeed}
          currentTime={currentTime}
          startTime={plan.startDate}
          endTime={plan.endDate || new Date(plan.startDate.getTime() + 24 * 60 * 60 * 1000)} // Defaultně 24 hodin
          onPlayPause={handlePlayPause}
          onSpeedChange={handleSpeedChange}
          onSeek={handleSeek}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default TimelinePanel;
