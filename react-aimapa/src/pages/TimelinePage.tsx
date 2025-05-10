/**
 * TimelinePage.tsx
 * Stránka pro zobrazení časové osy plánu
 */

import React, { useState, useEffect } from 'react';
import { TimelinePanel } from '../components/Timeline';
import type { TimelinePlan, TimelineEventType as TimelineEvent } from '../components/Timeline';
import TimelineService from '../services/TimelineService';
import './TimelinePage.css';

const TimelinePage: React.FC = () => {
  const [plan, setPlan] = useState<TimelinePlan | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Efekt pro načtení plánu
  useEffect(() => {
    // Načtení plánu z API
    const loadPlan = async () => {
      setLoading(true);

      try {
        // Získáme plán z API
        const calculatedPlan = await TimelineService.calculateTimeline({
          planId: 'sample-plan',
          startDate: new Date(),
          optimizeFor: 'time',
          transportMode: 'car',
          includeBreaks: true
        });

        setPlan(calculatedPlan);
        setLoading(false);
      } catch (err) {
        console.error('Chyba při načítání plánu:', err);
        setError('Nepodařilo se načíst plán. Zkuste to prosím později.');
        setLoading(false);
      }
    };

    loadPlan();
  }, []);

  // Funkce pro zpracování kliknutí na událost
  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  // Funkce pro aktualizaci aktuálního času
  const handleTimeUpdate = (time: Date) => {
    setCurrentTime(time);
  };

  // Funkce pro zavření detailu události
  const handleCloseEventDetail = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="timeline-page">
      <div className="timeline-page-header">
        <h1>Časová osa</h1>
        <p>Vizualizace plánu v čase</p>
      </div>

      <div className="timeline-page-content">
        {loading ? (
          <div className="timeline-loading">
            <div className="timeline-loading-spinner"></div>
            <p>Načítání časové osy...</p>
          </div>
        ) : error ? (
          <div className="timeline-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Zkusit znovu</button>
          </div>
        ) : (
          <div className="timeline-container">
            <TimelinePanel
              plan={plan}
              onEventClick={handleEventClick}
              onTimeUpdate={handleTimeUpdate}
              autoPlay={false}
              speed={1}
              showControls={true}
            />

            {selectedEvent && (
              <div className="timeline-event-detail">
                <div className="timeline-event-detail-header">
                  <h2>{selectedEvent.title}</h2>
                  <button
                    className="timeline-event-detail-close"
                    onClick={handleCloseEventDetail}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="timeline-event-detail-content">
                  <div className="timeline-event-detail-time">
                    <i className="fas fa-clock"></i>
                    <span>{new Date(selectedEvent.startTime).toLocaleTimeString('cs-CZ')}</span>
                    {selectedEvent.endTime && (
                      <>
                        <span className="separator">-</span>
                        <span>{new Date(selectedEvent.endTime).toLocaleTimeString('cs-CZ')}</span>
                      </>
                    )}
                  </div>

                  {selectedEvent.description && (
                    <div className="timeline-event-detail-description">
                      {selectedEvent.description}
                    </div>
                  )}

                  {selectedEvent.location && (
                    <div className="timeline-event-detail-location">
                      <h3>Lokace</h3>
                      <div className="location-info">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{selectedEvent.location.name || 'Neznámá lokace'}</span>
                      </div>
                      <div className="location-coordinates">
                        <span>Lat: {selectedEvent.location.lat.toFixed(6)}</span>
                        <span>Lng: {selectedEvent.location.lng.toFixed(6)}</span>
                      </div>
                      <button className="show-on-map-button">
                        <i className="fas fa-map"></i>
                        Zobrazit na mapě
                      </button>
                    </div>
                  )}

                  <div className="timeline-event-detail-status">
                    <h3>Status</h3>
                    <div className={`status-badge ${selectedEvent.completed ? 'completed' : 'pending'}`}>
                      {selectedEvent.completed ? 'Dokončeno' : 'Čeká na splnění'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
