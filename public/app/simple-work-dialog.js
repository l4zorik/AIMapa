/**
 * Jednoduchý modul pro zobrazení dialogu práce
 * Verze 0.3.8.0
 */

const SimpleWorkDialog = {
    // Zobrazení dialogu práce
    showWorkDialog(work) {
        console.log('Zobrazení dialogu práce:', work);
        
        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'simple-work-dialog';
        dialog.innerHTML = `
            <div class="simple-work-header">
                <div class="simple-work-title">
                    <i class="icon">💼</i> ${work.title}
                </div>
                <button class="simple-work-close">&times;</button>
            </div>
            <div class="simple-work-content">
                <div class="simple-work-description">
                    <p>${work.description}</p>
                </div>
                <div class="simple-work-details">
                    <div class="simple-work-detail">
                        <i class="icon">⏱️</i> Trvání: ${work.duration} min
                    </div>
                    <div class="simple-work-detail">
                        <i class="icon">💰</i> Odměna: ${work.reward} Kč
                    </div>
                    <div class="simple-work-detail">
                        <i class="icon">⭐</i> Odměna XP: ${work.xpReward} XP
                    </div>
                </div>
                <div class="simple-work-progress">
                    <div class="simple-work-progress-bar">
                        <div class="simple-work-progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="simple-work-progress-text">0%</div>
                </div>
                <div class="simple-work-tasks">
                    ${work.tasks.map((task, index) => `
                        <div class="simple-work-task" data-task-id="${index}">
                            <input type="checkbox" id="simple-task-${index}" class="simple-work-task-checkbox">
                            <label for="simple-task-${index}">${task}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="simple-work-actions">
                    <button class="simple-work-complete" disabled>Dokončit práci</button>
                </div>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Animace zobrazení
        setTimeout(() => {
            dialog.classList.add('show');
        }, 100);
        
        // Přidání event listenerů
        const closeButton = dialog.querySelector('.simple-work-close');
        const completeButton = dialog.querySelector('.simple-work-complete');
        const taskCheckboxes = dialog.querySelectorAll('.simple-work-task-checkbox');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideWorkDialog(dialog);
            });
        }
        
        if (completeButton) {
            completeButton.addEventListener('click', () => {
                this.completeWork(dialog, work);
            });
        }
        
        // Event listenery pro checkboxy úkolů
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateWorkProgress(dialog);
            });
        });
        
        return dialog;
    },
    
    // Aktualizace postupu práce
    updateWorkProgress(dialog) {
        // Získání všech checkboxů úkolů
        const taskCheckboxes = dialog.querySelectorAll('.simple-work-task-checkbox');
        const completeButton = dialog.querySelector('.simple-work-complete');
        const progressFill = dialog.querySelector('.simple-work-progress-fill');
        const progressText = dialog.querySelector('.simple-work-progress-text');
        
        // Výpočet postupu
        const totalTasks = taskCheckboxes.length;
        let completedTasks = 0;
        
        taskCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                completedTasks++;
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
    },
    
    // Skrytí dialogu práce
    hideWorkDialog(dialog) {
        dialog.classList.remove('show');
        
        // Odstranění elementu po dokončení animace
        setTimeout(() => {
            dialog.remove();
        }, 300);
    },
    
    // Dokončení práce
    completeWork(dialog, work) {
        // Skrytí dialogu
        this.hideWorkDialog(dialog);
        
        // Přidání peněz za dokončení práce
        if (typeof MoneyIndicator !== 'undefined') {
            MoneyIndicator.addMoney(work.reward, `Odměna za práci: ${work.title}`);
        }
        
        // Přidání XP za dokončení práce
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(work.xpReward, `Dokončení práce: ${work.title}`, 'work');
        }
        
        // Zobrazení oznámení o dokončení práce
        this.showCompletionNotification(work);
    },
    
    // Zobrazení oznámení o dokončení práce
    showCompletionNotification(work) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'simple-work-notification';
        
        // Nastavení obsahu oznámení
        notification.innerHTML = `
            <div class="simple-work-notification-header">
                <div class="simple-work-notification-title">
                    <i class="icon">✅</i> Práce dokončena
                </div>
                <button class="simple-work-notification-close">&times;</button>
            </div>
            <div class="simple-work-notification-content">
                <h3>${work.title}</h3>
                <p>Úspěšně jste dokončili práci a získali odměnu!</p>
                <div class="simple-work-notification-rewards">
                    <div class="simple-work-notification-reward">
                        <i class="icon">💰</i> ${work.reward} Kč
                    </div>
                    <div class="simple-work-notification-reward">
                        <i class="icon">⭐</i> ${work.xpReward} XP
                    </div>
                </div>
            </div>
        `;
        
        // Přidání oznámení do dokumentu
        document.body.appendChild(notification);
        
        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Přidání event listeneru pro zavření
        const closeButton = notification.querySelector('.simple-work-notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('show');
                
                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }
        
        // Automatické zavření po 5 sekundách
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                
                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    console.log('SimpleWorkDialog je připraven');
});
