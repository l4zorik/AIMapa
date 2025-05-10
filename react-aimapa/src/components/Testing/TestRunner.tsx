/**
 * TestRunner - Komponenta pro spouštění testů
 * Verze 0.4.2
 */

import React, { useState } from 'react';
import { runAllTests } from '../../tests/TaskLocationServiceTest';
import './TestRunner.css';

interface TestRunnerProps {
  onClose: () => void;
}

interface TestResult {
  detectResult: { passed: number; failed: number };
  generateResult: { passed: number; failed: number; skipped: number };
  assignResult: { passed: number; failed: number };
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalTests: number;
  successRate: number;
}

const TestRunner: React.FC<TestRunnerProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Funkce pro spuštění testů
  const handleRunTests = async () => {
    setIsRunning(true);
    setTestResult(null);
    setLogs([]);
    setError(null);
    
    // Přepsání console.log pro zachycení výstupu
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    const capturedLogs: string[] = [];
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      capturedLogs.push(message);
      setLogs(prev => [...prev, message]);
      
      originalConsoleLog(...args);
    };
    
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      capturedLogs.push(`ERROR: ${message}`);
      setLogs(prev => [...prev, `ERROR: ${message}`]);
      
      originalConsoleError(...args);
    };
    
    console.warn = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      capturedLogs.push(`WARNING: ${message}`);
      setLogs(prev => [...prev, `WARNING: ${message}`]);
      
      originalConsoleWarn(...args);
    };
    
    try {
      // Spuštění testů
      const result = await runAllTests();
      
      // Nastavení výsledku testů
      setTestResult(result);
    } catch (err) {
      setError('Chyba při spouštění testů: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      // Obnovení původních funkcí console
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      
      setIsRunning(false);
    }
  };

  return (
    <div className="test-runner">
      <div className="test-runner-header">
        <h3>Testování automatického přiřazování lokalit</h3>
        <button className="close-button" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="test-runner-content">
        <div className="test-controls">
          <button 
            className="run-tests-button" 
            onClick={handleRunTests}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Spouštím testy...</span>
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                <span>Spustit testy</span>
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        )}
        
        {testResult && (
          <div className="test-results">
            <h4>Výsledky testů</h4>
            
            <div className="result-summary">
              <div className="result-card">
                <div className="result-header">Celkové výsledky</div>
                <div className="result-content">
                  <div className="result-stat">
                    <span className="stat-label">Úspěšnost:</span>
                    <span className={`stat-value ${testResult.successRate >= 80 ? 'success' : testResult.successRate >= 50 ? 'warning' : 'error'}`}>
                      {testResult.successRate}%
                    </span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Celkem testů:</span>
                    <span className="stat-value">{testResult.totalTests}</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Úspěšné:</span>
                    <span className="stat-value success">{testResult.totalPassed}</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Neúspěšné:</span>
                    <span className="stat-value error">{testResult.totalFailed}</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Přeskočené:</span>
                    <span className="stat-value warning">{testResult.totalSkipped}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-header">Detekce lokací v textu</div>
                <div className="result-content">
                  <div className="result-stat">
                    <span className="stat-label">Úspěšnost:</span>
                    <span className={`stat-value ${testResult.detectResult.passed / (testResult.detectResult.passed + testResult.detectResult.failed) * 100 >= 80 ? 'success' : 'error'}`}>
                      {Math.round(testResult.detectResult.passed / (testResult.detectResult.passed + testResult.detectResult.failed) * 100)}%
                    </span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Úspěšné:</span>
                    <span className="stat-value success">{testResult.detectResult.passed}</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Neúspěšné:</span>
                    <span className="stat-value error">{testResult.detectResult.failed}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-header">Generování skrytých popisů</div>
                <div className="result-content">
                  <div className="result-stat">
                    <span className="stat-label">Úspěšnost:</span>
                    <span className={`stat-value ${testResult.generateResult.passed / (testResult.generateResult.passed + testResult.generateResult.failed) * 100 >= 80 ? 'success' : 'error'}`}>
                      {Math.round(testResult.generateResult.passed / (testResult.generateResult.passed + testResult.generateResult.failed) * 100)}%
                    </span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Úspěšné:</span>
                    <span className="stat-value success">{testResult.generateResult.passed}</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Neúspěšné:</span>
                    <span className="stat-value error">{testResult.generateResult.failed}</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Přeskočené:</span>
                    <span className="stat-value warning">{testResult.generateResult.skipped}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <div className="result-header">Automatické přiřazování</div>
                <div className="result-content">
                  <div className="result-stat">
                    <span className="stat-label">Úspěšnost:</span>
                    <span className={`stat-value ${testResult.assignResult.passed / (testResult.assignResult.passed + testResult.assignResult.failed) * 100 >= 80 ? 'success' : 'error'}`}>
                      {Math.round(testResult.assignResult.passed / (testResult.assignResult.passed + testResult.assignResult.failed) * 100)}%
                    </span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Úspěšné:</span>
                    <span className="stat-value success">{testResult.assignResult.passed}</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-label">Neúspěšné:</span>
                    <span className="stat-value error">{testResult.assignResult.failed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="test-logs">
          <h4>Výstup testů</h4>
          <div className="logs-container">
            {logs.length === 0 ? (
              <p className="no-logs">Žádné logy k zobrazení</p>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`log-line ${
                    log.startsWith('ERROR:') ? 'error' : 
                    log.startsWith('WARNING:') ? 'warning' : 
                    log.includes('✅') ? 'success' :
                    log.includes('❌') ? 'error' :
                    ''
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestRunner;
