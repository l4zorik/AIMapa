/**
 * Modul pro reportování bugů
 * Verze 0.3.6.0
 */

const BugReporter = {
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro reportování bugů...');
        
        // Vytvoření tlačítka pro reportování bugů
        this.createBugReportButton();
        
        console.log('Modul pro reportování bugů byl inicializován');
    },
    
    // Vytvoření tlačítka pro reportování bugů
    createBugReportButton() {
        // Kontrola, zda tlačítko již existuje
        if (document.getElementById('bugReportButton')) {
            return;
        }
        
        // Vytvoření tlačítka
        const bugButton = document.createElement('button');
        bugButton.id = 'bugReportButton';
        bugButton.className = 'bug-report-button';
        bugButton.title = 'Nahlásit bug';
        bugButton.innerHTML = '<span class="icon">🔑</span>';
        
        // Přidání tlačítka do dokumentu
        document.body.appendChild(bugButton);
        
        // Přidání event listeneru
        bugButton.addEventListener('click', () => {
            this.showBugReportDialog();
        });
        
        // Přidání stylů pro tlačítko
        const style = document.createElement('style');
        style.textContent = `
            .bug-report-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #3498db;
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                transition: all 0.3s ease;
            }
            
            .bug-report-button:hover {
                background-color: #2980b9;
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            }
            
            .bug-report-dialog {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 300px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                z-index: 9998;
                padding: 15px;
                display: none;
            }
            
            .bug-report-dialog.show {
                display: block;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            .bug-report-dialog h3 {
                margin-top: 0;
                color: #333;
                font-size: 16px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            
            .bug-report-dialog textarea {
                width: 100%;
                height: 100px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 5px;
                resize: none;
                font-family: inherit;
                font-size: 14px;
                margin-bottom: 10px;
            }
            
            .bug-report-dialog .bug-report-actions {
                display: flex;
                justify-content: space-between;
            }
            
            .bug-report-dialog button {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            }
            
            .bug-report-dialog .bug-report-save {
                background-color: #2ecc71;
                color: white;
            }
            
            .bug-report-dialog .bug-report-save:hover {
                background-color: #27ae60;
            }
            
            .bug-report-dialog .bug-report-cancel {
                background-color: #e0e0e0;
                color: #333;
            }
            
            .bug-report-dialog .bug-report-cancel:hover {
                background-color: #bdc3c7;
            }
            
            .bug-list {
                margin-top: 10px;
                max-height: 150px;
                overflow-y: auto;
            }
            
            .bug-list-item {
                padding: 8px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .bug-list-item:last-child {
                border-bottom: none;
            }
            
            .bug-list-item .bug-text {
                flex: 1;
                font-size: 13px;
                color: #555;
            }
            
            .bug-list-item .bug-delete {
                background: none;
                border: none;
                color: #e74c3c;
                cursor: pointer;
                font-size: 16px;
                padding: 0 5px;
            }
            
            .bug-list-item .bug-delete:hover {
                color: #c0392b;
            }
            
            /* Tmavý režim */
            body[data-theme="dark"] .bug-report-dialog {
                background-color: #2d3748;
                color: #f7fafc;
            }
            
            body[data-theme="dark"] .bug-report-dialog h3 {
                color: #f7fafc;
                border-bottom-color: #4a5568;
            }
            
            body[data-theme="dark"] .bug-report-dialog textarea {
                background-color: #4a5568;
                border-color: #2d3748;
                color: #f7fafc;
            }
            
            body[data-theme="dark"] .bug-report-dialog .bug-report-cancel {
                background-color: #4a5568;
                color: #f7fafc;
            }
            
            body[data-theme="dark"] .bug-report-dialog .bug-report-cancel:hover {
                background-color: #718096;
            }
            
            body[data-theme="dark"] .bug-list-item {
                border-bottom-color: #4a5568;
            }
            
            body[data-theme="dark"] .bug-list-item .bug-text {
                color: #e2e8f0;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Zobrazení dialogu pro reportování bugů
    showBugReportDialog() {
        // Kontrola, zda dialog již existuje
        let dialog = document.querySelector('.bug-report-dialog');
        
        if (!dialog) {
            // Vytvoření dialogu
            dialog = document.createElement('div');
            dialog.className = 'bug-report-dialog';
            
            // Načtení uložených bugů
            const savedBugs = this.getSavedBugs();
            
            // Vytvoření obsahu dialogu
            dialog.innerHTML = `
                <h3>Seznam bugů</h3>
                <textarea placeholder="Popis bugu..."></textarea>
                <div class="bug-report-actions">
                    <button class="bug-report-save">Uložit</button>
                    <button class="bug-report-cancel">Zrušit</button>
                </div>
                <div class="bug-list">
                    ${savedBugs.map(bug => `
                        <div class="bug-list-item">
                            <div class="bug-text">${bug}</div>
                            <button class="bug-delete" data-bug="${bug}">×</button>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Přidání dialogu do dokumentu
            document.body.appendChild(dialog);
            
            // Přidání event listenerů
            const saveButton = dialog.querySelector('.bug-report-save');
            const cancelButton = dialog.querySelector('.bug-report-cancel');
            const textarea = dialog.querySelector('textarea');
            const deleteButtons = dialog.querySelectorAll('.bug-delete');
            
            saveButton.addEventListener('click', () => {
                const bugText = textarea.value.trim();
                if (bugText) {
                    this.saveBug(bugText);
                    textarea.value = '';
                    this.showBugReportDialog(); // Aktualizace dialogu
                }
            });
            
            cancelButton.addEventListener('click', () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
            
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const bugText = e.target.getAttribute('data-bug');
                    this.deleteBug(bugText);
                    this.showBugReportDialog(); // Aktualizace dialogu
                });
            });
        }
        
        // Zobrazení dialogu
        dialog.classList.add('show');
    },
    
    // Uložení bugu
    saveBug(bugText) {
        const bugs = this.getSavedBugs();
        bugs.push(bugText);
        localStorage.setItem('aiMapaBugs', JSON.stringify(bugs));
    },
    
    // Odstranění bugu
    deleteBug(bugText) {
        let bugs = this.getSavedBugs();
        bugs = bugs.filter(bug => bug !== bugText);
        localStorage.setItem('aiMapaBugs', JSON.stringify(bugs));
    },
    
    // Získání uložených bugů
    getSavedBugs() {
        const bugsJson = localStorage.getItem('aiMapaBugs');
        return bugsJson ? JSON.parse(bugsJson) : [];
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    BugReporter.init();
});
