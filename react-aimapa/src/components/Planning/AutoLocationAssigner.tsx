/**
 * AutoLocationAssigner - Komponenta pro automatické přiřazování lokalit k úkolům
 * Verze 0.4.2
 */

import React, { useState, useEffect } from 'react';
import taskLocationService from '../../services/TaskLocationService';
import './AutoLocationAssigner.css';

interface AutoLocationAssignerProps {
  planId: string;
  onComplete?: (result: { total: number, updated: number, skipped: number }) => void;
  onCancel?: () => void;
}

const AutoLocationAssigner: React.FC<AutoLocationAssignerProps> = ({
  planId,
  onComplete,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    processed: 0,
    updated: 0,
    skipped: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Funkce pro spuštění automatického přiřazování lokalit
  const startAutoAssign = async () => {
    setIsProcessing(true);
    setError(null);
    setIsComplete(false);

    try {
      // Spuštění automatického přiřazování lokalit
      const result = await taskLocationService.autoAssignLocationsToTasks(
        planId,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );

      // Nastavení výsledku
      setProgress({
        total: result.total,
        processed: result.updated + result.skipped,
        updated: result.updated,
        skipped: result.skipped
      });

      // Nastavení dokončení
      setIsComplete(true);

      // Volání callbacku pro dokončení
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      setError('Chyba při automatickém přiřazování lokalit: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  // Automatické spuštění při načtení komponenty
  useEffect(() => {
    startAutoAssign();
  }, [planId]);

  // Výpočet procenta dokončení
  const completionPercentage = progress.total > 0
    ? Math.round((progress.processed / progress.total) * 100)
    : 0;

  return (
    <div className="auto-location-assigner">
      <div className="auto-location-assigner-header">
        <h3>Automatické přiřazování lokalit</h3>
        {!isComplete && (
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={isComplete}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <div className="auto-location-assigner-content">
        {isProcessing ? (
          <div className="processing-indicator">
            <div className="spinner">
              <i className="fas fa-sync-alt fa-spin"></i>
            </div>
            <p>Probíhá přiřazování lokalit k úkolům...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button className="retry-button" onClick={startAutoAssign}>
              <i className="fas fa-redo"></i> Zkusit znovu
            </button>
          </div>
        ) : isComplete ? (
          <div className="completion-message">
            <i className="fas fa-check-circle"></i>
            <p>Přiřazování lokalit dokončeno!</p>
            <div className="completion-stats">
              <div className="stat">
                <span className="stat-label">Celkem úkolů:</span>
                <span className="stat-value">{progress.total}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Přiřazeno lokalit:</span>
                <span className="stat-value">{progress.updated}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Přeskočeno úkolů:</span>
                <span className="stat-value">{progress.skipped}</span>
              </div>
            </div>
            <button className="close-button" onClick={onCancel}>
              <i className="fas fa-check"></i> Zavřít
            </button>
          </div>
        ) : null}

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {completionPercentage}% dokončeno
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoLocationAssigner;
