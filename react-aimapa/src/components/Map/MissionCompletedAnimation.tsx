import React, { useEffect, useState, useCallback } from 'react';
import './MissionCompletedAnimation.css';

interface MissionCompletedAnimationProps {
  onComplete: () => void;
  planTitle: string;
  rewardPoints?: number;
  showFireworks?: boolean;
}

const MissionCompletedAnimation: React.FC<MissionCompletedAnimationProps> = ({
  onComplete,
  planTitle,
  rewardPoints = 0,
  showFireworks = true
}) => {
  const [animationStage, setAnimationStage] = useState<number>(0);

  // Funkce pro generování konfet
  const generateConfetti = useCallback(() => {
    const shapes = ['square', 'circle', 'triangle', 'star'];
    const speeds = ['slow', 'medium', 'fast'];
    const colors = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8'];

    return Array.from({ length: 150 }).map((_, i) => {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const speed = speeds[Math.floor(Math.random() * speeds.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const hasGlitter = Math.random() > 0.7; // 30% šance na třpytivý efekt

      return (
        <div
          key={i}
          className={`confetti ${shape} ${speed} ${color} ${hasGlitter ? 'glitter' : ''}`}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      );
    });
  }, []);

  useEffect(() => {
    // Spustíme postupně jednotlivé fáze animace
    const stageTimers = [
      setTimeout(() => setAnimationStage(1), 500),  // Zobrazení textu "Mission"
      setTimeout(() => setAnimationStage(2), 1500), // Zobrazení textu "Completed"
      setTimeout(() => setAnimationStage(3), 2500), // Zobrazení názvu plánu
      setTimeout(() => setAnimationStage(4), 4000), // Zobrazení konfet
      setTimeout(() => onComplete(), 8000)          // Ukončení animace (prodlouženo pro lepší efekt)
    ];

    // Přehrání zvukového efektu
    const audio = new Audio('/sounds/mission-complete.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Zvuk nemohl být přehrán:', err));

    // Přidání vibrací pro mobilní zařízení, pokud jsou podporovány
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 200, 50, 300]);
    }

    // Cleanup při odmontování
    return () => {
      stageTimers.forEach(timer => clearTimeout(timer));
      audio.pause();
      audio.currentTime = 0;
    };
  }, [onComplete]);

  return (
    <div className="mission-completed-container">
      <div className="mission-completed-overlay"></div>

      <div className="mission-completed-content">
        <div className={`mission-text ${animationStage >= 1 ? 'visible' : ''}`}>
          MISSION
        </div>

        <div className={`completed-text ${animationStage >= 2 ? 'visible' : ''}`}>
          COMPLETED
        </div>

        <div className={`plan-title ${animationStage >= 3 ? 'visible' : ''}`}>
          {planTitle}
        </div>

        {rewardPoints > 0 && animationStage >= 3 && (
          <div className="reward-points">
            <span className="reward-icon">🏆</span>
            <span className="reward-value">+{rewardPoints} bodů</span>
          </div>
        )}

        {animationStage >= 4 && (
          <div className="confetti-container">
            {generateConfetti()}
          </div>
        )}

        {showFireworks && animationStage >= 4 && (
          <div className="fireworks-container">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="firework"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  '--explosion-color': `hsl(${Math.random() * 360}, 100%, 50%)`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCompletedAnimation;
