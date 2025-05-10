/**
 * TimelineControls.tsx
 * Komponenta pro ovládací prvky časové osy
 */

import React from 'react';
import { formatTime } from './timelineUtils';
import './TimelineControls.css';

interface TimelineControlsProps {
  isPlaying: boolean;
  speed: number;
  currentTime: Date;
  startTime: Date;
  endTime: Date;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (time: Date) => void;
  onReset: () => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  isPlaying,
  speed,
  currentTime,
  startTime,
  endTime,
  onPlayPause,
  onSpeedChange,
  onSeek,
  onReset
}) => {
  // Výpočet procentuálního postupu na časové ose
  const totalDuration = endTime.getTime() - startTime.getTime();
  const elapsed = currentTime.getTime() - startTime.getTime();
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  // Funkce pro změnu pozice na časové ose
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const newTime = new Date(startTime.getTime() + (totalDuration * value / 100));
    onSeek(newTime);
  };

  // Funkce pro skok vpřed/vzad
  const handleSkipForward = () => {
    const newTime = new Date(currentTime.getTime() + 15 * 60 * 1000); // +15 minut
    if (newTime > endTime) {
      onSeek(endTime);
    } else {
      onSeek(newTime);
    }
  };

  const handleSkipBackward = () => {
    const newTime = new Date(currentTime.getTime() - 15 * 60 * 1000); // -15 minut
    if (newTime < startTime) {
      onSeek(startTime);
    } else {
      onSeek(newTime);
    }
  };

  return (
    <div className="timeline-controls">
      <div className="timeline-progress">
        <span className="timeline-time start">{formatTime(startTime, 'time')}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeekChange}
          className="timeline-slider"
        />
        <span className="timeline-time end">{formatTime(endTime, 'time')}</span>
      </div>

      <div className="timeline-buttons">
        <button
          className="timeline-button reset"
          onClick={onReset}
          title="Resetovat"
        >
          <i className="fas fa-undo"></i>
        </button>

        <button
          className="timeline-button skip-backward"
          onClick={handleSkipBackward}
          title="Přeskočit 15 minut zpět"
        >
          <i className="fas fa-backward"></i>
        </button>

        <button
          className="timeline-button play-pause"
          onClick={onPlayPause}
          title={isPlaying ? "Pozastavit" : "Přehrát"}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>

        <button
          className="timeline-button skip-forward"
          onClick={handleSkipForward}
          title="Přeskočit 15 minut vpřed"
        >
          <i className="fas fa-forward"></i>
        </button>

        <div className="timeline-speed-controls">
          <button
            className={`timeline-button speed ${speed === 0.5 ? 'active' : ''}`}
            onClick={() => onSpeedChange(0.5)}
            title="0.5x rychlost"
          >
            0.5x
          </button>

          <button
            className={`timeline-button speed ${speed === 1 ? 'active' : ''}`}
            onClick={() => onSpeedChange(1)}
            title="1x rychlost"
          >
            1x
          </button>

          <button
            className={`timeline-button speed ${speed === 2 ? 'active' : ''}`}
            onClick={() => onSpeedChange(2)}
            title="2x rychlost"
          >
            2x
          </button>

          <button
            className={`timeline-button speed ${speed === 5 ? 'active' : ''}`}
            onClick={() => onSpeedChange(5)}
            title="5x rychlost"
          >
            5x
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimelineControls;
