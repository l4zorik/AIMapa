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
                <div class="simple-work-task-selection">
                    <label for="task-selector">Vyberte úkol:</label>
                    <select id="task-selector" class="simple-work-task-selector">
                        <option value="">-- Vyberte úkol --</option>
                        ${work.tasks.map((task, index) => `
                            <option value="${index}">${task}</option>
                        `).join('')}
                    </select>
                    <button class="simple-work-show-task-btn">Zobrazit úkol</button>
                </div>

                <div class="simple-work-task-detail" style="display: none;">
                    <h3 class="simple-work-task-title">Detail úkolu</h3>
                    <div class="simple-work-task-content"></div>
                    <button class="simple-work-back-btn">Zpět na seznam úkolů</button>
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
        const taskSelector = dialog.querySelector('.simple-work-task-selector');
        const showTaskButton = dialog.querySelector('.simple-work-show-task-btn');
        const backButton = dialog.querySelector('.simple-work-back-btn');
        const taskDetail = dialog.querySelector('.simple-work-task-detail');
        const tasksList = dialog.querySelector('.simple-work-tasks');
        const taskSelection = dialog.querySelector('.simple-work-task-selection');

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

        // Event listener pro zobrazení detailu úkolu
        if (showTaskButton) {
            showTaskButton.addEventListener('click', () => {
                const selectedTaskIndex = taskSelector.value;
                if (selectedTaskIndex !== '') {
                    this.showTaskDetail(dialog, work, parseInt(selectedTaskIndex));
                } else {
                    alert('Prosím vyberte úkol ze seznamu');
                }
            });
        }

        // Event listener pro návrat zpět na seznam úkolů
        if (backButton) {
            backButton.addEventListener('click', () => {
                taskDetail.style.display = 'none';
                tasksList.style.display = 'block';
                taskSelection.style.display = 'block';
            });
        }

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

    // Zobrazení detailu úkolu
    showTaskDetail(dialog, work, taskIndex) {
        const taskDetail = dialog.querySelector('.simple-work-task-detail');
        const tasksList = dialog.querySelector('.simple-work-tasks');
        const taskSelection = dialog.querySelector('.simple-work-task-selection');
        const taskContent = dialog.querySelector('.simple-work-task-content');
        const taskTitle = dialog.querySelector('.simple-work-task-title');

        // Získání úkolu podle indexu
        const task = work.tasks[taskIndex];

        if (task) {
            // Nastavení titulku a obsahu úkolu
            taskTitle.textContent = `Úkol: ${task}`;

            // Generování detailního obsahu úkolu
            const taskDetails = this.generateTaskDetails(task, taskIndex);
            taskContent.innerHTML = taskDetails;

            // Zobrazení detailu úkolu a skrytí seznamu úkolů
            taskDetail.style.display = 'block';
            tasksList.style.display = 'none';
            taskSelection.style.display = 'none';
        }
    },

    // Generování detailního obsahu úkolu
    generateTaskDetails(task, taskIndex) {
        // Rozdělení úkolu na slova
        const words = task.split(' ');

        // Generování náhodného počtu kroků (3-5)
        const numSteps = Math.floor(Math.random() * 3) + 3;

        // Generování kroků
        let steps = '';
        for (let i = 0; i < numSteps; i++) {
            // Generování náhodného textu pro krok
            const stepText = this.generateRandomStep(words, i);
            steps += `
                <div class="simple-work-task-step">
                    <div class="simple-work-task-step-number">${i + 1}</div>
                    <div class="simple-work-task-step-text">${stepText}</div>
                </div>
            `;
        }

        // Generování náhodných poznámek
        const notes = this.generateRandomNotes(words);

        // Sestavení detailního obsahu úkolu
        return `
            <div class="simple-work-task-description">
                <p>Tento úkol vyžaduje následující kroky:</p>
            </div>
            <div class="simple-work-task-steps">
                ${steps}
            </div>
            <div class="simple-work-task-notes">
                <h4>Poznámky:</h4>
                <p>${notes}</p>
            </div>
        `;
    },

    // Generování náhodného kroku
    generateRandomStep(words, stepIndex) {
        const stepTemplates = [
            'Nejprve je potřeba {action} {object}.',
            'Poté musíte {action} všechny {object}.',
            'Následně {action} podle {object}.',
            'Dále je nutné {action} s ohledem na {object}.',
            'Nakonec {action} a zkontrolujte {object}.'
        ];

        const actions = [
            'analyzovat', 'zpracovat', 'připravit', 'zkontrolovat', 'optimalizovat',
            'vyhodnotit', 'implementovat', 'testovat', 'dokumentovat', 'prezentovat'
        ];

        // Výběr náhodné šablony
        const template = stepTemplates[stepIndex % stepTemplates.length];

        // Výběr náhodných slov z úkolu nebo z předdefinovaných akcí
        const action = actions[Math.floor(Math.random() * actions.length)];
        const object = words.length > 2 ?
            words[Math.floor(Math.random() * words.length)] + ' ' + words[(Math.floor(Math.random() * words.length) + 1) % words.length] :
            'data';

        // Nahrazení placeholderů
        return template.replace('{action}', action).replace('{object}', object);
    },

    // Generování náhodných poznámek
    generateRandomNotes(words) {
        const noteTemplates = [
            'Nezapomeňte na důkladnou kontrolu výsledků.',
            'Doporučujeme konzultovat postup s vedoucím projektu.',
            'Pro lepší výsledky použijte nejnovější verzi softwaru.',
            'Dbejte na dodržení všech bezpečnostních postupů.',
            'Výsledky zaznamenejte do sdíleného dokumentu.'
        ];

        // Výběr 1-2 náhodných poznámek
        const numNotes = Math.floor(Math.random() * 2) + 1;
        let notes = [];

        for (let i = 0; i < numNotes; i++) {
            const randomIndex = Math.floor(Math.random() * noteTemplates.length);
            notes.push(noteTemplates[randomIndex]);
        }

        return notes.join(' ');
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
