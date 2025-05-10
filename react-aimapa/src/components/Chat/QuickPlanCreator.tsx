import React, { useState, useRef, useEffect } from 'react';
import './QuickPlanCreator.css';

interface QuickPlanCreatorProps {
  originalCommand: string;
  originalTitle: string;
  onCreatePlan: (command: string) => void;
  onCancel: () => void;
}

const QuickPlanCreator: React.FC<QuickPlanCreatorProps> = ({
  originalCommand,
  originalTitle,
  onCreatePlan,
  onCancel
}) => {
  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Automatické zaměření na vstupní pole při zobrazení
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Vytvoření nového příkazu pro plán
  const createNewCommand = (title: string): string => {
    // Nahrazení původního názvu novým názvem v původním příkazu
    return originalCommand.replace(originalTitle, title);
  };

  // Zpracování odeslání formuláře
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      const newCommand = createNewCommand(newTitle.trim());
      onCreatePlan(newCommand);
    }
  };

  // Zpracování klávesových zkratek
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div className="quick-plan-creator">
      <div className="quick-plan-header">
        <h3>Rychlé vytvoření plánu</h3>
        <button className="close-button" onClick={onCancel}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="quick-plan-content">
        <p className="original-command">
          Původní příkaz: <span>{originalCommand}</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="new-plan-title">Zadejte nový název plánu:</label>
            <input
              ref={inputRef}
              id="new-plan-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="např. Výlet do Brna"
              autoComplete="off"
            />
          </div>
          
          <div className="preview">
            <p>Náhled nového příkazu:</p>
            <div className="preview-command">
              {newTitle.trim() 
                ? createNewCommand(newTitle.trim()) 
                : <span className="placeholder">Zadejte název plánu...</span>}
            </div>
          </div>
          
          <div className="actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
            >
              Zrušit
            </button>
            <button 
              type="submit" 
              className="create-button"
              disabled={!newTitle.trim()}
            >
              <i className="fas fa-plus"></i> Vytvořit plán
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickPlanCreator;
