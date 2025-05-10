/**
 * TimelineEvent.tsx
 * Komponenta pro zobrazení události na časové ose
 */

import React from 'react';
import type { TimelineEvent as TimelineEventType } from './TimelinePanel';
import { formatTime, formatDuration } from './timelineUtils';
import './TimelineEvent.css';

interface TimelineEventProps {
  event: TimelineEventType;
  currentTime: Date;
  onClick?: () => void;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  currentTime,
  onClick
}) => {
  // Určení stavu události (budoucí, aktuální, minulá)
  const isPast = currentTime > (event.endTime || event.startTime);
  const isCurrent = currentTime >= event.startTime &&
                   (!event.endTime || currentTime <= event.endTime);
  const isFuture = currentTime < event.startTime;

  // Výpočet progresu pro aktuální událost
  let progress = 0;
  if (isCurrent && event.endTime) {
    const totalDuration = event.endTime.getTime() - event.startTime.getTime();
    const elapsed = currentTime.getTime() - event.startTime.getTime();
    progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  // Určení barvy podle typu události
  let eventColor = event.color || '';
  if (!eventColor) {
    switch (event.type) {
      case 'task':
        eventColor = '#3498db';
        break;
      case 'travel':
        eventColor = '#2ecc71';
        break;
      case 'break':
        eventColor = '#f39c12';
        break;
      case 'milestone':
        eventColor = '#e74c3c';
        break;
      default:
        eventColor = '#3498db';
    }
  }

  // Určení ikony podle typu události
  let eventIcon = event.icon || '';
  if (!eventIcon) {
    switch (event.type) {
      case 'task':
        eventIcon = 'fa-tasks';
        break;
      case 'travel':
        eventIcon = 'fa-car';
        break;
      case 'break':
        eventIcon = 'fa-coffee';
        break;
      case 'milestone':
        eventIcon = 'fa-flag';
        break;
      default:
        eventIcon = 'fa-calendar-day';
    }
  }

  return (
    <div
      className={`timeline-event ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''} ${event.completed ? 'completed' : ''}`}
      onClick={onClick}
      style={{ '--event-color': eventColor } as React.CSSProperties}
    >
      <div className="timeline-event-marker">
        <div className="timeline-event-dot">
          <i className={`fas ${eventIcon}`}></i>
        </div>
        <div className="timeline-event-line"></div>
      </div>

      <div className="timeline-event-content">
        <div className="timeline-event-header">
          <h3>{event.title}</h3>
          <div className="timeline-event-time">
            <span>{formatTime(event.startTime, 'time')}</span>
            {event.endTime && (
              <>
                <span className="separator">-</span>
                <span>{formatTime(event.endTime, 'time')}</span>
              </>
            )}
          </div>
        </div>

        {event.description && (
          <div className="timeline-event-description">
            {event.description}
          </div>
        )}

        <div className="timeline-event-details">
          {event.duration && (
            <div className="timeline-event-duration">
              <i className="fas fa-clock"></i>
              <span>{formatDuration(event.duration)}</span>
            </div>
          )}

          {event.location && (
            <div className="timeline-event-location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.location.name || `${event.location.lat.toFixed(4)}, ${event.location.lng.toFixed(4)}`}</span>
            </div>
          )}
        </div>

        {isCurrent && event.endTime && (
          <div className="timeline-event-progress-container">
            <div
              className="timeline-event-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEvent;
