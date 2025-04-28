/**
 * Modul pro přímou integraci mezi detekcí nečinnosti a virtuální prací
 * Verze 0.3.8.0
 */

const DirectWorkIntegration = {
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro přímou integraci práce...');
        
        // Přidání metody pro přímé spuštění práce s úkoly do VirtualWork
        if (typeof VirtualWork !== 'undefined') {
            // Přidání metody pro přímé spuštění práce s úkoly
            VirtualWork.directStartWork = this.directStartWork.bind(VirtualWork);
            console.log('Metoda directStartWork byla přidána do VirtualWork');
        } else {
            console.error('VirtualWork modul nebyl nalezen!');
        }
    },
    
    // Metoda pro přímé spuštění práce s úkoly
    directStartWork(workplace, tasks) {
        console.log('Přímé spuštění práce s úkoly:', { workplace, tasks });
        
        // Nastavení vybraného pracoviště
        this.selectedWorkplace = workplace;
        
        // Nastavení úkolů
        this.customTasks = tasks.map((task, index) => ({
            id: `task_${Date.now()}_${index}`,
            text: task,
            completed: false
        }));
        
        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog';
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <div class="virtual-work-title">
                    <i class="icon">${workplace.icon}</i> ${workplace.name}
                </div>
                <button class="virtual-work-close">&times;</button>
            </div>
            <div class="virtual-work-content">
                <div class="workplace-info">
                    <div class="workplace-icon">${workplace.icon}</div>
                    <div class="workplace-details">
                        <h3>${workplace.name}</h3>
                        <p>${workplace.description}</p>
                        <div class="workplace-stats">
                            <span class="workplace-pay">💰 ${workplace.pay} Kč</span>
                            <span class="workplace-xp">⭐ ${workplace.xp} XP</span>
                            <span class="workplace-duration">⏱️ ${workplace.duration} min</span>
                        </div>
                    </div>
                </div>
                <div class="work-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">0%</div>
                </div>
                <div class="task-list">
                    ${this.customTasks.map(task => `
                        <div class="task-item" data-task-id="${task.id}">
                            <input type="checkbox" id="${task.id}" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                            <label for="${task.id}">${task.text}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="work-actions">
                    <button class="complete-work-button" disabled>Dokončit práci</button>
                </div>
            </div>
            <div class="virtual-work-actions">
                <button class="virtual-work-btn secondary" id="virtual-work-cancel">Zrušit</button>
                <button class="virtual-work-btn primary" id="virtual-work-complete" disabled>Dokončit práci</button>
            </div>
        `;
        
        // Přidání dialogu do stránky
        document.body.appendChild(dialog);
        
        // Zobrazení dialogu
        setTimeout(() => {
            dialog.classList.add('show');
        }, 10);
        
        // Přidání event listenerů
        this.addWorkEventListeners(dialog);
        
        // Přidání event listeneru pro zavření dialogu
        const closeButton = dialog.querySelector('.virtual-work-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
        }
        
        // Přidání event listeneru pro zrušení práce
        const cancelButton = dialog.querySelector('#virtual-work-cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                dialog.classList.remove('show');
                setTimeout(() => {
                    dialog.remove();
                }, 300);
            });
        }
        
        // Přidání event listenerů pro checkboxy úkolů
        const taskCheckboxes = dialog.querySelectorAll('.task-checkbox');
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateWorkProgress(dialog);
            });
        });
        
        // Přidání event listeneru pro dokončení práce
        const completeButton = dialog.querySelector('#virtual-work-complete');
        if (completeButton) {
            completeButton.addEventListener('click', () => {
                this.completeWork(dialog, workplace);
            });
        }
        
        return dialog;
    },
    
    // Aktualizace postupu práce
    updateWorkProgress(dialog) {
        // Získání všech checkboxů úkolů
        const taskCheckboxes = dialog.querySelectorAll('.task-checkbox');
        const completeButton = dialog.querySelector('#virtual-work-complete');
        const progressFill = dialog.querySelector('.progress-fill');
        const progressText = dialog.querySelector('.progress-text');
        
        // Výpočet postupu
        const totalTasks = taskCheckboxes.length;
        let completedTasks = 0;
        
        taskCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                completedTasks++;
                
                // Aktualizace stavu úkolu v this.customTasks
                const taskId = checkbox.id;
                const task = this.customTasks.find(t => t.id === taskId);
                if (task) {
                    task.completed = true;
                }
            }
        });
        
        const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        // Aktualizace progress baru
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Aktualizace textu postupu
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        // Aktivace/deaktivace tlačítka pro dokončení práce
        if (completeButton) {
            completeButton.disabled = completedTasks < totalTasks;
            
            // Přidání pulzující animace, pokud jsou všechny úkoly dokončeny
            if (completedTasks === totalTasks) {
                completeButton.classList.add('pulse');
            } else {
                completeButton.classList.remove('pulse');
            }
        }
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    if (typeof DirectWorkIntegration !== 'undefined') {
        console.log('Inicializace DirectWorkIntegration...');
        DirectWorkIntegration.init();
    } else {
        console.error('DirectWorkIntegration modul nebyl nalezen!');
    }
});
