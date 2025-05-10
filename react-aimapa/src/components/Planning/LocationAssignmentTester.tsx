/**
 * LocationAssignmentTester - Komponenta pro testování přesnosti přiřazování lokalit
 * Verze 0.4.2
 */

import React, { useState, useEffect } from 'react';
import taskLocationService, { LocationAssignmentStats } from '../../services/TaskLocationService';
import './LocationAssignmentTester.css';

interface LocationAssignmentTesterProps {
  planId: string;
  onComplete?: (result: { total: number, tested: number, averageAccuracy: number }) => void;
  onCancel?: () => void;
}

const LocationAssignmentTester: React.FC<LocationAssignmentTesterProps> = ({ 
  planId, 
  onComplete, 
  onCancel 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    processed: 0,
    tested: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState<LocationAssignmentStats | null>(null);
  const [result, setResult] = useState<{ total: number, tested: number, averageAccuracy: number } | null>(null);
  const [isImproving, setIsImproving] = useState(false);
  const [improvements, setImprovements] = useState<any | null>(null);

  // Funkce pro spuštění testování přesnosti
  const startTesting = async () => {
    setIsProcessing(true);
    setError(null);
    setIsComplete(false);
    setResult(null);
    
    try {
      // Spuštění testování přesnosti
      const testResult = await taskLocationService.testLocationAssignmentAccuracy(
        planId,
        (progressUpdate) => {
          setProgress(progressUpdate);
        }
      );
      
      // Nastavení výsledku
      setResult(testResult);
      
      // Nastavení dokončení
      setIsComplete(true);
      
      // Načtení aktuálních statistik
      const currentStats = taskLocationService.getLocationAssignmentStats();
      setStats(currentStats);
      
      // Volání callbacku pro dokončení
      if (onComplete) {
        onComplete(testResult);
      }
    } catch (err) {
      setError('Chyba při testování přesnosti přiřazování lokalit: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  // Funkce pro spuštění vylepšování přiřazování lokalit
  const startImproving = async () => {
    setIsImproving(true);
    
    try {
      // Spuštění vylepšování přiřazování lokalit
      const success = await taskLocationService.improveLocationAssignment();
      
      if (success) {
        // Načtení návrhů na vylepšení
        const savedImprovements = localStorage.getItem('locationAssignmentImprovements');
        if (savedImprovements) {
          setImprovements(JSON.parse(savedImprovements));
        }
      } else {
        setError('Nepodařilo se vylepšit přiřazování lokalit');
      }
    } catch (err) {
      setError('Chyba při vylepšování přiřazování lokalit: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsImproving(false);
    }
  };

  // Automatické spuštění při načtení komponenty
  useEffect(() => {
    // Načtení aktuálních statistik
    const currentStats = taskLocationService.getLocationAssignmentStats();
    setStats(currentStats);
    
    // Načtení návrhů na vylepšení
    const savedImprovements = localStorage.getItem('locationAssignmentImprovements');
    if (savedImprovements) {
      setImprovements(JSON.parse(savedImprovements));
    }
    
    // Spuštění testování
    startTesting();
  }, [planId]);

  // Výpočet procenta dokončení
  const completionPercentage = progress.total > 0 
    ? Math.round((progress.processed / progress.total) * 100) 
    : 0;

  return (
    <div className="location-assignment-tester">
      <div className="location-assignment-tester-header">
        <h3>Testování přesnosti přiřazování lokalit</h3>
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
      
      <div className="location-assignment-tester-content">
        {isProcessing ? (
          <div className="processing-indicator">
            <div className="spinner">
              <i className="fas fa-sync-alt fa-spin"></i>
            </div>
            <p>Probíhá testování přesnosti přiřazování lokalit...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button className="retry-button" onClick={startTesting}>
              <i className="fas fa-redo"></i> Zkusit znovu
            </button>
          </div>
        ) : isComplete && result ? (
          <div className="completion-message">
            <i className="fas fa-check-circle"></i>
            <p>Testování přesnosti dokončeno!</p>
            <div className="completion-stats">
              <div className="stat">
                <span className="stat-label">Celkem úkolů s lokací:</span>
                <span className="stat-value">{result.total}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Otestováno úkolů:</span>
                <span className="stat-value">{result.tested}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Průměrná přesnost:</span>
                <span className="stat-value">{result.averageAccuracy.toFixed(2)}%</span>
              </div>
            </div>
            
            {stats && (
              <div className="stats-container">
                <h4>Celkové statistiky přiřazování lokalit</h4>
                <div className="stats-grid">
                  <div className="stat">
                    <span className="stat-label">Celkem přiřazení:</span>
                    <span className="stat-value">{stats.totalAssignments}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">AI přiřazení:</span>
                    <span className="stat-value">{stats.aiAssignments}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Klíčová slova:</span>
                    <span className="stat-value">{stats.keywordAssignments}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Náhodná:</span>
                    <span className="stat-value">{stats.randomAssignments}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Uživatelská:</span>
                    <span className="stat-value">{stats.userAssignments}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Průměrná přesnost:</span>
                    <span className="stat-value">{stats.averageAccuracy.toFixed(2)}%</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Průměrná jistota:</span>
                    <span className="stat-value">{stats.averageConfidence.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )}
            
            {result.averageAccuracy < 70 && (
              <div className="improvement-section">
                <h4>Vylepšení přiřazování lokalit</h4>
                <p>Průměrná přesnost je nižší než 70%. Můžete spustit automatické vylepšení algoritmu.</p>
                
                {isImproving ? (
                  <div className="processing-indicator">
                    <div className="spinner">
                      <i className="fas fa-sync-alt fa-spin"></i>
                    </div>
                    <p>Probíhá vylepšování algoritmu...</p>
                  </div>
                ) : improvements ? (
                  <div className="improvements-container">
                    <h5>Návrhy na vylepšení</h5>
                    <ul className="improvements-list">
                      {improvements.improvements && improvements.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                    
                    {improvements.newKeywords && improvements.newKeywords.length > 0 && (
                      <>
                        <h5>Nová klíčová slova</h5>
                        <div className="keywords-container">
                          {improvements.newKeywords.map((keyword: string, index: number) => (
                            <span key={index} className="keyword">{keyword}</span>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {improvements.newLocations && improvements.newLocations.length > 0 && (
                      <>
                        <h5>Nové lokality</h5>
                        <ul className="locations-list">
                          {improvements.newLocations.map((location: any, index: number) => (
                            <li key={index}>{location.name} ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : (
                  <button 
                    className="improve-button" 
                    onClick={startImproving}
                    disabled={isImproving}
                  >
                    <i className="fas fa-magic"></i> Vylepšit algoritmus
                  </button>
                )}
              </div>
            )}
            
            <div className="buttons-container">
              <button className="retry-button" onClick={startTesting}>
                <i className="fas fa-redo"></i> Testovat znovu
              </button>
              <button className="close-button" onClick={onCancel}>
                <i className="fas fa-check"></i> Zavřít
              </button>
            </div>
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

export default LocationAssignmentTester;
