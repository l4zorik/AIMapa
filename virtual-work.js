/**
 * Jednoduchý modul pro virtuální práci
 * Verze 0.3.0.15
 */

class VirtualWorkClass {
    constructor() {
        // Základní nastavení
        this.isInitialized = false;
        this.workplaces = [
            {
                id: 'office1',
                name: 'Kancelářská práce',
                type: 'office',
                icon: '💼',
                pay: 1000,
                description: 'Standardní kancelářská práce s počítačem.',
                difficulty: 'easy',
                xp: 20,
                duration: 3
            },
            {
                id: 'tech1',
                name: 'Programování',
                type: 'programming',
                icon: '💻',
                pay: 1500,
                description: 'Vývoj softwaru a webových aplikací.',
                difficulty: 'medium',
                xp: 30,
                duration: 4
            },
            {
                id: 'factory1',
                name: 'Manuální práce',
                type: 'manual',
                icon: '🔨',
                pay: 800,
                description: 'Fyzická práce ve výrobě nebo skladu.',
                difficulty: 'easy',
                xp: 15,
                duration: 2
            },
            {
                id: 'design1',
                name: 'Grafický design',
                type: 'creative',
                icon: '🎨',
                pay: 1200,
                description: 'Tvorba grafiky a vizuálních materiálů.',
                difficulty: 'medium',
                xp: 25,
                duration: 3
            },
            {
                id: 'teaching1',
                name: 'Výuka a školení',
                type: 'education',
                icon: '👨‍🏫',
                pay: 1100,
                description: 'Vzdělávání a předávání znalostí.',
                difficulty: 'medium',
                xp: 25,
                duration: 3
            },
            {
                id: 'medical1',
                name: 'Zdravotnictví',
                type: 'healthcare',
                icon: '⚕️',
                pay: 1800,
                description: 'Práce ve zdravotnictví a péče o pacienty.',
                difficulty: 'hard',
                xp: 40,
                duration: 5
            }
        ];
        this.selectedWorkplace = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        // Historie práce
        this.workHistory = [];

        // Sledování bodů
        this.trackPoints = [];
        this.isTrackingMode = false;

        // Uložené cesty
        this.savedPaths = [];
        this.currentPathMarkers = [];
        this.currentPathLine = null;

        // Existující cesty
        this.existingPathPoints = [];
        this.existingPathLine = null;
    }

    /**
     * Inicializace modulu
     */
    init() {
        if (this.isInitialized) return;

        // Načtení CSS
        this.loadStyles();

        // Načtení uložených cest
        this.loadSavedPaths();

        // Načtení historie práce
        this.loadWorkHistory();

        // Označení jako inicializovaný
        this.isInitialized = true;
        console.log('VirtualWork: Modul byl inicializován');
    }

    /**
     * Načtení uložených cest z localStorage
     */
    loadSavedPaths() {
        try {
            const savedPaths = localStorage.getItem('savedPaths');
            if (savedPaths) {
                this.savedPaths = JSON.parse(savedPaths);
                console.log(`Načteno ${this.savedPaths.length} uložených cest`);
            }
        } catch (error) {
            console.error('Chyba při načítání uložených cest:', error);
            this.savedPaths = [];
        }
    }

    /**
     * Uložení cest do localStorage
     */
    savePaths() {
        try {
            localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
            console.log(`Uloženo ${this.savedPaths.length} cest`);
        } catch (error) {
            console.error('Chyba při ukládání cest:', error);
        }
    }

    /**
     * Načtení historie práce z localStorage
     */
    loadWorkHistory() {
        try {
            const workHistory = localStorage.getItem('workHistory');
            if (workHistory) {
                this.workHistory = JSON.parse(workHistory);
                console.log(`Načteno ${this.workHistory.length} záznamů historie práce`);
            }
        } catch (error) {
            console.error('Chyba při načítání historie práce:', error);
            this.workHistory = [];
        }
    }

    /**
     * Uložení historie práce do localStorage
     */
    saveWorkHistory() {
        try {
            localStorage.setItem('workHistory', JSON.stringify(this.workHistory));
            console.log(`Uloženo ${this.workHistory.length} záznamů historie práce`);
        } catch (error) {
            console.error('Chyba při ukládání historie práce:', error);
        }
    }

    /**
     * Načtení CSS stylů
     */
    loadStyles() {
        // Kontrola, zda již styly existují
        if (document.getElementById('virtual-work-styles')) return;

        // Načtení externího CSS souboru
        const link = document.createElement('link');
        link.id = 'virtual-work-styles';
        link.rel = 'stylesheet';
        link.href = 'virtual-work.css';
        document.head.appendChild(link);
    }

    /**
     * Získání celkového výdělku
     */
    getTotalEarnings() {
        return this.workHistory.reduce((total, work) => total + work.pay, 0);
    }

    /**
     * Získání celkového XP
     */
    getTotalXP() {
        return this.workHistory.reduce((total, work) => total + work.xp, 0);
    }

    /**
     * Otevření dialogu virtuální práce
     */
    openWorkDialog() {
        // Kontrola, zda je dialog již otevřený
        if (document.querySelector('.virtual-work-dialog')) return;

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog';
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2>Virtuální práce</h2>
                <button class="virtual-work-close">&times;</button>
            </div>
            <div class="virtual-work-content">
                <h3>Vyberte typ práce:</h3>

                <div class="workplace-categories">
                    <button class="category-btn active" data-category="all">Všechny</button>
                    <button class="category-btn" data-category="office">Kancelář</button>
                    <button class="category-btn" data-category="manual">Manuální</button>
                    <button class="category-btn" data-category="creative">Kreativní</button>
                </div>

                <div class="workplace-list">
                    ${this.workplaces.map(workplace => {
                        // Určení obtížnosti
                        const difficultyLabel = {
                            'easy': 'Snadná',
                            'medium': 'Střední',
                            'hard': 'Náročná'
                        }[workplace.difficulty] || '';

                        // Určení barvy obtížnosti
                        const difficultyColor = {
                            'easy': '#27ae60',
                            'medium': '#f39c12',
                            'hard': '#e74c3c'
                        }[workplace.difficulty] || '#777';

                        return `
                            <div class="workplace-item" data-id="${workplace.id}" data-category="${workplace.type}">
                                <div class="workplace-icon">${workplace.icon}</div>
                                <div class="workplace-info">
                                    <div class="workplace-name">${workplace.name}</div>
                                    <div class="workplace-pay">${workplace.pay} Kč / den</div>
                                    <div class="workplace-description">${workplace.description}</div>
                                    <div class="workplace-details">
                                        <span class="workplace-difficulty" style="color: ${difficultyColor}">
                                            ${difficultyLabel}
                                        </span>
                                        <span class="workplace-xp">+${workplace.xp} XP</span>
                                        <span class="workplace-duration">${workplace.duration} min</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="work-stats">
                    <h3>Vaše statistiky práce</h3>
                    <div class="work-stats-grid">
                        <div class="work-stat">
                            <div class="work-stat-value">${this.getTotalEarnings()} Kč</div>
                            <div class="work-stat-label">Celkový výdělek</div>
                        </div>
                        <div class="work-stat">
                            <div class="work-stat-value">${this.workHistory.length}</div>
                            <div class="work-stat-label">Dokončených směn</div>
                        </div>
                        <div class="work-stat">
                            <div class="work-stat-value">${this.getTotalXP()} XP</div>
                            <div class="work-stat-label">Získané zkušenosti</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="virtual-work-actions">
                <button class="virtual-work-btn secondary" id="virtual-work-cancel">Zrušit</button>
                <button class="virtual-work-btn secondary" id="virtual-work-history">Historie</button>
                <button class="virtual-work-btn primary" id="virtual-work-start" disabled>Začít pracovat</button>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Přidání event listenerů
        this.setupDialogEvents(dialog);

        // Přidání event listenerů pro kategorie
        const categoryBtns = dialog.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech tlačítek
                categoryBtns.forEach(b => b.classList.remove('active'));

                // Přidání aktivní třídy na kliknuté tlačítko
                btn.classList.add('active');

                // Filtrování pracovišť podle kategorie
                const category = btn.dataset.category;
                const workplaceItems = dialog.querySelectorAll('.workplace-item');

                workplaceItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    /**
     * Nastavení event listenerů pro dialog
     */
    setupDialogEvents(dialog) {
        // Zavření dialogu
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#virtual-work-cancel');

        closeBtn.addEventListener('click', () => this.closeDialog(dialog));
        cancelBtn.addEventListener('click', () => this.closeDialog(dialog));

        // Výběr pracoviště
        const workplaceItems = dialog.querySelectorAll('.workplace-item');
        const startBtn = dialog.querySelector('#virtual-work-start');

        workplaceItems.forEach(item => {
            item.addEventListener('click', () => {
                // Odstranění výběru ze všech položek
                workplaceItems.forEach(wp => wp.classList.remove('selected'));

                // Přidání výběru na kliknutou položku
                item.classList.add('selected');

                // Uložení vybraného pracoviště
                const workplaceId = item.dataset.id;
                this.selectedWorkplace = this.workplaces.find(wp => wp.id === workplaceId);

                // Povolení tlačítka pro začátek práce
                startBtn.disabled = false;
            });
        });

        // Začátek práce
        startBtn.addEventListener('click', () => {
            if (!this.selectedWorkplace) return;

            // Uložení reference na vybrané pracoviště
            const workplace = this.selectedWorkplace;

            // Zobrazení dialogu pro definování vlastních úkolů
            dialog.querySelector('.virtual-work-content').innerHTML = `
                <div class="custom-tasks-container">
                    <div class="custom-tasks-header">
                        <h3>Definujte vlastní úkoly pro práci: ${workplace.name}</h3>
                        <p>Přidejte úkoly, které chcete během práce splnit. Později je budete moci manuálně označit jako dokončené.</p>
                    </div>

                    <div class="custom-tasks-list" id="custom-tasks-list">
                        <div class="no-tasks">Zatím nejsou definovány žádné úkoly. Přidejte nový úkol pomocí formuláře níže.</div>
                    </div>

                    <div class="custom-tasks-form">
                        <input type="text" id="new-task-input" placeholder="Zadejte nový úkol..." class="custom-task-input">
                        <button id="add-task-btn" class="virtual-work-btn primary">Přidat úkol</button>
                    </div>

                    <div class="custom-tasks-actions">
                        <button id="start-with-tasks-btn" class="virtual-work-btn primary">Začít práci s úkoly</button>
                        <button id="skip-tasks-btn" class="virtual-work-btn secondary">Přeskočit a začít bez úkolů</button>
                    </div>
                </div>
            `;

            // Inicializace pole pro úkoly
            this.customTasks = [];

            // Přidání event listenerů pro formulář úkolů
            const addTaskBtn = dialog.querySelector('#add-task-btn');
            const newTaskInput = dialog.querySelector('#new-task-input');
            const tasksList = dialog.querySelector('#custom-tasks-list');
            const startWithTasksBtn = dialog.querySelector('#start-with-tasks-btn');
            const skipTasksBtn = dialog.querySelector('#skip-tasks-btn');

            // Funkce pro přidání nového úkolu
            const addNewTask = () => {
                const taskText = newTaskInput.value.trim();
                if (taskText) {
                    // Přidání úkolu do pole
                    const taskId = Date.now();
                    this.customTasks.push({
                        id: taskId,
                        text: taskText,
                        completed: false
                    });

                    // Aktualizace seznamu úkolů
                    updateTasksList();

                    // Vyčištění inputu
                    newTaskInput.value = '';
                    newTaskInput.focus();
                }
            };

            // Funkce pro aktualizaci seznamu úkolů
            const updateTasksList = () => {
                if (this.customTasks.length === 0) {
                    tasksList.innerHTML = '<div class="no-tasks">Zatím nejsou definovány žádné úkoly. Přidejte nový úkol pomocí formuláře níže.</div>';
                } else {
                    tasksList.innerHTML = this.customTasks.map(task => `
                        <div class="custom-task-item" data-id="${task.id}">
                            <div class="custom-task-text">${task.text}</div>
                            <button class="custom-task-delete" title="Odstranit úkol">×</button>
                        </div>
                    `).join('');

                    // Přidání event listenerů pro tlačítka odstranění
                    const deleteButtons = tasksList.querySelectorAll('.custom-task-delete');
                    deleteButtons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            const taskItem = e.target.closest('.custom-task-item');
                            const taskId = parseInt(taskItem.dataset.id);

                            // Odstranění úkolu z pole
                            this.customTasks = this.customTasks.filter(task => task.id !== taskId);

                            // Aktualizace seznamu úkolů
                            updateTasksList();
                        });
                    });
                }

                // Aktualizace stavu tlačítka pro začátek práce
                startWithTasksBtn.disabled = this.customTasks.length === 0;
            };

            // Event listener pro přidání úkolu
            addTaskBtn.addEventListener('click', addNewTask);

            // Event listener pro přidání úkolu po stisknutí Enter
            newTaskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addNewTask();
                }
            });

            // Event listener pro začátek práce s úkoly
            startWithTasksBtn.addEventListener('click', () => {
                this.startWorkWithTasks(dialog, workplace);
            });

            // Event listener pro přeskočení definice úkolů
            skipTasksBtn.addEventListener('click', () => {
                this.customTasks = [];
                this.startWorkWithTasks(dialog, workplace);
            });

            // Inicializace seznamu úkolů
            updateTasksList();

            // Zaměření na input pro rychlé zadávání
            newTaskInput.focus();
        });
    }

    /**
     * Zavření dialogu
     */
    closeDialog(dialog) {
        dialog.remove();
    }

    /**
     * Začátek práce s úkoly
     */
    startWorkWithTasks(dialog, workplace) {
        // Výpočet doby trvání práce v milisekundách (z minut)
        const workDuration = workplace.duration * 1000;

        // Výpočet počtu kroků pro progress bar (1 krok každých 100ms)
        const totalSteps = workDuration / 100;
        let currentStep = 0;

        // Změna obsahu dialogu na "probíhá práce" s progress barem a úkoly
        dialog.querySelector('.virtual-work-content').innerHTML = `
            <div class="work-result">
                <div class="work-result-icon">${workplace.icon}</div>
                <h3>Probíhá práce...</h3>
                <p>Pracujete jako <strong>${workplace.name}</strong></p>

                <div class="work-progress-container">
                    <div class="work-progress-bar" id="work-progress-bar"></div>
                </div>

                <div class="work-progress-info">
                    <div class="work-progress-time">Zbývající čas: <span id="work-time-remaining">${workplace.duration}:00</span></div>
                    <div class="work-progress-percent">0%</div>
                </div>

                ${this.customTasks.length > 0 ? `
                <div class="custom-tasks-progress">
                    <h4>Vaše úkoly:</h4>
                    <div class="custom-tasks-checklist" id="custom-tasks-checklist">
                        ${this.customTasks.map(task => `
                            <div class="custom-task-check-item" data-id="${task.id}">
                                <label class="custom-task-checkbox">
                                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                                    <span class="checkmark"></span>
                                </label>
                                <span class="custom-task-check-text">${task.text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="work-activity-log">
                    <div class="work-activity-item">Začínáte pracovat...</div>
                </div>
            </div>
        `;

        // Získání reference na progress bar a další elementy
        const progressBar = dialog.querySelector('#work-progress-bar');
        const timeRemaining = dialog.querySelector('#work-time-remaining');
        const percentElement = dialog.querySelector('.work-progress-percent');
        const activityLog = dialog.querySelector('.work-activity-log');

        // Přidání event listenerů pro checkboxy úkolů
        if (this.customTasks.length > 0) {
            const checkboxes = dialog.querySelectorAll('.task-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const taskItem = e.target.closest('.custom-task-check-item');
                    const taskId = parseInt(taskItem.dataset.id);

                    // Aktualizace stavu úkolu v poli
                    const taskIndex = this.customTasks.findIndex(task => task.id === taskId);
                    if (taskIndex !== -1) {
                        this.customTasks[taskIndex].completed = e.target.checked;

                        // Přidání aktivity do logu
                        if (e.target.checked) {
                            activityLog.innerHTML = `<div class="work-activity-item new-activity">Úkol dokončen: ${this.customTasks[taskIndex].text}</div>` + activityLog.innerHTML;
                        } else {
                            activityLog.innerHTML = `<div class="work-activity-item new-activity">Úkol označen jako nedokončený: ${this.customTasks[taskIndex].text}</div>` + activityLog.innerHTML;
                        }

                        // Odstranění třídy new-activity po animaci
                        setTimeout(() => {
                            const newActivity = activityLog.querySelector('.new-activity');
                            if (newActivity) {
                                newActivity.classList.remove('new-activity');
                            }
                        }, 1000);

                        // Vizuální efekt pro dokončený úkol
                        if (e.target.checked) {
                            taskItem.classList.add('completed');
                        } else {
                            taskItem.classList.remove('completed');
                        }

                        // Kontrola, zda jsou všechny úkoly dokončeny
                        this.checkAllTasksCompleted(dialog);
                    }
                });
            });
        }

        // Pole možných aktivit podle typu práce
        const activities = {
            'office': [
                'Odpovídáte na e-maily...',
                'Účastníte se porady...',
                'Připravujete prezentaci...',
                'Telefonujete s klientem...',
                'Organizujete dokumenty...'
            ],
            'programming': [
                'Píšete kód...',
                'Opravujete chyby...',
                'Testujete aplikaci...',
                'Navrhujete architekturu...',
                'Code review...'
            ],
            'manual': [
                'Přenášíte materiál...',
                'Montujete součástky...',
                'Obsluhujete stroj...',
                'Balíte produkty...',
                'Kontrolujete kvalitu...'
            ],
            'creative': [
                'Vytváříte návrh...',
                'Upravujete grafiku...',
                'Konzultujete s klientem...',
                'Připravujete podklady...',
                'Finalizujete projekt...'
            ],
            'education': [
                'Připravujete materiály...',
                'Vyučujete studenty...',
                'Hodnotíte práce...',
                'Konzultujete se studenty...',
                'Připravujete testy...'
            ],
            'healthcare': [
                'Vyšetřujete pacienta...',
                'Konzultujete diagnózu...',
                'Připravujete léky...',
                'Provádíte zákrok...',
                'Vyplňujete dokumentaci...'
            ]
        };

        // Výběr aktivit pro daný typ práce
        const workActivities = activities[workplace.type] || activities['office'];

        // Přidání tlačítka pro manuální dokončení úkolu
        const skipButtonContainer = document.createElement('div');
        skipButtonContainer.className = 'skip-button-container';
        skipButtonContainer.innerHTML = `
            <button class="virtual-work-btn primary" id="complete-work-manually">Dokončit práci manuálně</button>
        `;
        dialog.querySelector('.work-result').appendChild(skipButtonContainer);

        // Přidání event listeneru pro tlačítko manuálního dokončení
        const completeManuallyBtn = dialog.querySelector('#complete-work-manually');
        completeManuallyBtn.addEventListener('click', () => {
            this.completeWorkManually(dialog, workplace, progressBar, percentElement, timeRemaining, activityLog, progressInterval);
        });

        // Interval pro aktualizaci progress baru
        const progressInterval = setInterval(() => {
            currentStep++;

            // Výpočet procenta dokončení
            const percent = Math.min(Math.floor((currentStep / totalSteps) * 100), 100);

            // Aktualizace progress baru
            progressBar.style.width = `${percent}%`;
            percentElement.textContent = `${percent}%`;

            // Aktualizace zbývajícího času
            const remainingSeconds = Math.max(0, Math.floor((workDuration - (currentStep * 100)) / 1000));
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            // Přidání nové aktivity každých 20%
            if (percent % 20 === 0 && percent > 0 && percent < 100) {
                const randomActivity = workActivities[Math.floor(percent / 20) - 1];
                activityLog.innerHTML = `<div class="work-activity-item new-activity">${randomActivity}</div>` + activityLog.innerHTML;

                // Odstranění třídy new-activity po animaci
                setTimeout(() => {
                    const newActivity = activityLog.querySelector('.new-activity');
                    if (newActivity) {
                        newActivity.classList.remove('new-activity');
                    }
                }, 1000);
            }

            // Kontrola, zda jsme dokončili práci
            if (currentStep >= totalSteps) {
                clearInterval(progressInterval);

                // Přidání poslední aktivity
                activityLog.innerHTML = `<div class="work-activity-item new-activity">Práce dokončena!</div>` + activityLog.innerHTML;

                // Kontrola dokončení úkolů
                const allTasksCompleted = this.checkAllTasksCompleted(dialog);

                // Výpočet výdělku a XP s bonusem za dokončené úkoly
                let earnings = workplace.pay;
                let xp = workplace.xp;

                // Bonus za dokončené úkoly
                if (this.customTasks.length > 0) {
                    const completedTasks = this.customTasks.filter(task => task.completed);
                    const completionRate = completedTasks.length / this.customTasks.length;

                    // Bonus za dokončené úkoly (až 20% navíc)
                    const taskBonus = Math.round(earnings * 0.2 * completionRate);
                    const xpBonus = Math.round(xp * 0.2 * completionRate);

                    earnings += taskBonus;
                    xp += xpBonus;
                }

                // Přidání záznamu do historie práce
                this.workHistory.push({
                    id: Date.now(),
                    workplace: workplace.id,
                    name: workplace.name,
                    pay: earnings,
                    xp: xp,
                    date: new Date().toISOString(),
                    completedManually: false,
                    customTasks: this.customTasks.length > 0 ? this.customTasks.map(task => ({
                        text: task.text,
                        completed: task.completed
                    })) : []
                });

                // Přidání peněz a XP
                this.addMoney(earnings, xp);

                // Krátká pauza před zobrazením výsledku
                setTimeout(() => {
                    // Zobrazení výsledku
                    let resultHTML = `
                        <div class="work-result">
                            <div class="work-result-icon">✅</div>
                            <h3>Práce dokončena!</h3>
                            <div class="work-result-amount">+ ${earnings} Kč</div>
                            <div class="work-result-xp">+ ${xp} XP</div>
                    `;

                    // Přidání informací o úkolech
                    if (this.customTasks.length > 0) {
                        const completedTasks = this.customTasks.filter(task => task.completed);

                        resultHTML += `
                            <div class="tasks-summary">
                                <p>Dokončeno ${completedTasks.length} z ${this.customTasks.length} úkolů</p>
                                ${allTasksCompleted ?
                                    '<div class="all-tasks-completed">Všechny úkoly dokončeny! Získáváte bonus +20%</div>' :
                                    `<div class="tasks-bonus">Bonus za dokončené úkoly: +${Math.round((completedTasks.length / this.customTasks.length) * 20)}%</div>`
                                }
                            </div>
                        `;
                    }

                    resultHTML += `
                            <p>Peníze a zkušenosti byly přidány na váš účet.</p>

                            <div class="work-result-stats">
                                <div class="work-result-stat">
                                    <div class="work-result-stat-label">Celkový výdělek</div>
                                    <div class="work-result-stat-value">${this.getTotalEarnings()} Kč</div>
                                </div>
                                <div class="work-result-stat">
                                    <div class="work-result-stat-label">Celkem směn</div>
                                    <div class="work-result-stat-value">${this.workHistory.length}</div>
                                </div>
                            </div>
                        </div>
                    `;

                    dialog.querySelector('.virtual-work-content').innerHTML = resultHTML;

                    // Změna tlačítek
                    dialog.querySelector('.virtual-work-actions').innerHTML = `
                        <button class="virtual-work-btn secondary" id="virtual-work-close">Zavřít</button>
                        <button class="virtual-work-btn secondary" id="track-points">Sledovat body</button>
                        <button class="virtual-work-btn primary" id="virtual-work-again">Pracovat znovu</button>
                    `;

                    // Přidání event listenerů pro nová tlačítka
                    dialog.querySelector('#virtual-work-close').addEventListener('click', () => this.closeDialog(dialog));
                    dialog.querySelector('#virtual-work-again').addEventListener('click', () => this.openWorkDialog());
                    dialog.querySelector('#track-points').addEventListener('click', () => {
                        this.closeDialog(dialog);
                        this.openTrackPointsDialog();
                    });
                }, 1000);
            }
        }, 100);
    }

    /**
     * Kontrola, zda jsou všechny úkoly dokončeny
     */
    checkAllTasksCompleted(dialog) {
        if (this.customTasks.length === 0) return false;

        const allCompleted = this.customTasks.every(task => task.completed);

        // Pokud jsou všechny úkoly dokončeny, zobrazíme notifikaci
        if (allCompleted) {
            const tasksProgress = dialog.querySelector('.custom-tasks-progress');
            if (tasksProgress && !tasksProgress.querySelector('.tasks-completed-notification')) {
                const notification = document.createElement('div');
                notification.className = 'tasks-completed-notification';
                notification.innerHTML = `
                    <div class="tasks-completed-icon">✅</div>
                    <div class="tasks-completed-text">Všechny úkoly dokončeny!</div>
                `;
                tasksProgress.appendChild(notification);
            }
        }

        return allCompleted;
    }

    /**
     * Přidání peněz a XP
     */
    addMoney(amount, xp) {
        // Kontrola, zda existuje MoneyIndicator
        if (typeof MoneyIndicator !== 'undefined' && MoneyIndicator.addMoney) {
            MoneyIndicator.addMoney(amount);
            console.log(`Přidáno ${amount} Kč do peněženky`);
        } else {
            console.warn('MoneyIndicator není k dispozici, peníze nebyly přidány');
        }

        // Kontrola, zda existuje UserProgress
        if (typeof UserProgress !== 'undefined' && UserProgress.addXP) {
            UserProgress.addXP(xp);
            console.log(`Přidáno ${xp} XP do uživatelského postupu`);
        } else {
            console.warn('UserProgress není k dispozici, XP nebylo přidáno');
        }

        // Uložení historie práce
        this.saveWorkHistory();
    }

    /**
     * Otevření dialogu pro sledování bodů
     */
    openTrackPointsDialog() {
        // Kontrola, zda je dialog již otevřený
        if (document.querySelector('.track-points-dialog')) return;

        // Přidání event listeneru pro aktualizaci detekce existujících cest po výpočtu trasy
        document.addEventListener('routeCalculated', () => {
            console.log("Událost routeCalculated zachycena, aktualizuji detekci existujících cest");
            setTimeout(() => {
                this.detectExistingPaths();
            }, 500);
        });

        // Detekce existujících cest na mapě
        this.detectExistingPaths();

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog track-points-dialog';
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2>Sledování bodů</h2>
                <button class="virtual-work-close">&times;</button>
            </div>
            <div class="virtual-work-content">
                <div class="track-points-controls">
                    <button class="virtual-work-btn ${this.isTrackingMode ? 'secondary' : 'primary'}" id="toggle-tracking">
                        ${this.isTrackingMode ? 'Zastavit sledování' : 'Začít sledování'}
                    </button>
                    <button class="virtual-work-btn secondary" id="clear-points" ${this.trackPoints.length === 0 ? 'disabled' : ''}>
                        Vymazat body
                    </button>
                </div>

                <div class="track-points-list">
                    ${this.trackPoints.length === 0 ?
                        '<p class="no-points">Žádné body ke sledování. Klikněte na "Začít sledování" a pak klikejte na mapu pro přidání bodů.</p>' :
                        this.renderTrackPoints()}
                </div>

                ${this.trackPoints.length >= 2 ? `
                <div class="track-path-controls">
                    <button class="virtual-work-btn primary" id="show-path">Zobrazit cestu</button>
                    <button class="virtual-work-btn secondary" id="save-path">Uložit cestu</button>
                </div>
                ` : ''}

                <div id="path-preview"></div>

                <div class="existing-paths-section">
                    <h3>Aktuální cesta na mapě</h3>
                    <div id="existing-path-preview">
                        <p class="no-points">Vyhledávání existující cesty na mapě...</p>
                    </div>
                    <div class="track-path-controls" style="margin-top: 10px;">
                        <button class="virtual-work-btn primary" id="calculate-route-btn">Vypočítat trasu</button>
                    </div>
                </div>

                <h3 style="margin-top: 20px; border-top: 1px solid #e0e0e0; padding-top: 15px;">Uložené cesty</h3>
                <div class="saved-paths-list">
                    ${this.renderSavedPaths()}
                </div>
            </div>
            <div class="virtual-work-actions">
                <button class="virtual-work-btn secondary" id="track-points-close">Zavřít</button>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Přidání event listenerů
        this.setupTrackPointsDialogEvents(dialog);

        // Přidání event listeneru pro tlačítko výpočtu trasy
        const calculateRouteBtn = dialog.querySelector('#calculate-route-btn');
        if (calculateRouteBtn) {
            calculateRouteBtn.addEventListener('click', () => {
                // Kontrola, zda existuje funkce pro výpočet trasy
                if (typeof calculateRouteFunction === 'function') {
                    // Výpočet trasy
                    calculateRouteFunction();

                    // Aktualizace detekce existujících cest po 1 sekundě
                    setTimeout(() => {
                        this.detectExistingPaths();
                    }, 1000);

                    // Zobrazení zprávy o výpočtu trasy
                    if (typeof addMessage === 'function') {
                        addMessage('Trasa byla vypočítána. Nyní můžete importovat cestu do sledování bodů.', false);
                    }
                } else {
                    console.error("Funkce calculateRouteFunction není definována");

                    // Zobrazení zprávy o chybě
                    if (typeof addMessage === 'function') {
                        addMessage('Nepodařilo se vypočítat trasu. Zkuste to znovu později.', true);
                    }
                }
            });
        }
    }

    /**
     * Vykreslení seznamu sledovaných bodů
     */
    renderTrackPoints() {
        return `
            <div class="track-points-table">
                <div class="track-points-header">
                    <div class="track-point-cell">#</div>
                    <div class="track-point-cell">Souřadnice</div>
                    <div class="track-point-cell">Akce</div>
                </div>
                ${this.trackPoints.map((point, index) => `
                    <div class="track-point-row" data-index="${index}">
                        <div class="track-point-cell">${index + 1}</div>
                        <div class="track-point-cell">${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</div>
                        <div class="track-point-cell">
                            <button class="track-point-action delete" title="Odstranit bod">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Vykreslení seznamu uložených cest
     */
    renderSavedPaths() {
        if (this.savedPaths.length === 0) {
            return '<p class="no-points">Nemáte žádné uložené cesty.</p>';
        }

        return this.savedPaths.map((path, index) => `
            <div class="saved-path-item" data-index="${index}">
                <div class="saved-path-icon">🛣️</div>
                <div class="saved-path-info">
                    <div class="saved-path-name">${path.name}</div>
                    <div class="saved-path-details">
                        ${path.points.length} bodů | ${this.formatDistance(path.distance)} | ${new Date(path.date).toLocaleDateString()}
                    </div>
                </div>
                <div class="saved-path-actions">
                    <button class="saved-path-action show" title="Zobrazit cestu">👁️</button>
                    <button class="saved-path-action delete" title="Smazat cestu">🗑️</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Formátování vzdálenosti
     */
    formatDistance(distance) {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} m`;
        } else {
            return `${distance.toFixed(2)} km`;
        }
    }

    /**
     * Detekce existujících cest na mapě
     */
    detectExistingPaths() {
        // Kontrola, zda existuje funkce pro získání bodů trasy
        if (typeof getRouteWaypoints === 'function') {
            // Získání bodů trasy
            const waypoints = getRouteWaypoints();

            // Aktualizace existujících bodů
            this.existingPathPoints = waypoints;

            // Aktualizace UI
            const existingPathPreview = document.querySelector('#existing-path-preview');
            if (existingPathPreview) {
                if (waypoints.length >= 2) {
                    existingPathPreview.innerHTML = `
                        <div class="existing-path-info">
                            <p>Nalezena existující trasa s ${waypoints.length} body.</p>
                            <button class="virtual-work-btn secondary" id="import-existing-path">Importovat trasu</button>
                        </div>
                    `;

                    // Přidání event listeneru pro import trasy
                    const importBtn = existingPathPreview.querySelector('#import-existing-path');
                    if (importBtn) {
                        importBtn.addEventListener('click', () => {
                            // Import bodů trasy
                            this.trackPoints = [...waypoints];

                            // Aktualizace UI
                            const trackPointsList = document.querySelector('.track-points-list');
                            if (trackPointsList) {
                                trackPointsList.innerHTML = this.renderTrackPoints();
                                this.setupTrackPointsEvents();
                            }

                            // Aktualizace tlačítek
                            const clearBtn = document.querySelector('#clear-points');
                            if (clearBtn) {
                                clearBtn.disabled = this.trackPoints.length === 0;
                            }

                            // Přidání tlačítek pro zobrazení a uložení cesty
                            const trackPathControls = document.querySelector('.track-path-controls');
                            if (!trackPathControls && this.trackPoints.length >= 2) {
                                const controlsContainer = document.createElement('div');
                                controlsContainer.className = 'track-path-controls';
                                controlsContainer.innerHTML = `
                                    <button class="virtual-work-btn primary" id="show-path">Zobrazit cestu</button>
                                    <button class="virtual-work-btn secondary" id="save-path">Uložit cestu</button>
                                `;

                                const trackPointsList = document.querySelector('.track-points-list');
                                if (trackPointsList) {
                                    trackPointsList.insertAdjacentElement('afterend', controlsContainer);
                                    this.setupPathControlsEvents();
                                }
                            }

                            // Zobrazení zprávy o importu
                            if (typeof addMessage === 'function') {
                                addMessage('Trasa byla úspěšně importována do sledování bodů.', false);
                            }
                        });
                    }
                } else {
                    existingPathPreview.innerHTML = `
                        <p class="no-points">Nebyla nalezena žádná existující trasa. Vypočítejte trasu pomocí tlačítka níže.</p>
                    `;
                }
            }
        }
    }

    /**
     * Nastavení event listenerů pro dialog sledování bodů
     */
    setupTrackPointsDialogEvents(dialog) {
        // Zavření dialogu
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#track-points-close');

        closeBtn.addEventListener('click', () => this.closeDialog(dialog));
        cancelBtn.addEventListener('click', () => this.closeDialog(dialog));

        // Přepínání režimu sledování
        const toggleBtn = dialog.querySelector('#toggle-tracking');
        toggleBtn.addEventListener('click', () => {
            this.isTrackingMode = !this.isTrackingMode;
            toggleBtn.textContent = this.isTrackingMode ? 'Zastavit sledování' : 'Začít sledování';
            toggleBtn.className = `virtual-work-btn ${this.isTrackingMode ? 'secondary' : 'primary'}`;

            // Pokud je sledování aktivní, přidáme event listener na mapu
            if (this.isTrackingMode) {
                this.startTrackingPoints();
            } else {
                this.stopTrackingPoints();
            }
        });

        // Vymazání bodů
        const clearBtn = dialog.querySelector('#clear-points');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                // Odstranění markerů z mapy
                this.clearPathFromMap();

                // Vymazání bodů
                this.trackPoints = [];

                // Aktualizace UI
                this.updateTrackPointsDialog(dialog);
            });
        }

        // Nastavení event listenerů pro body
        this.setupTrackPointsEvents();

        // Nastavení event listenerů pro tlačítka cesty
        this.setupPathControlsEvents();
    }

    /**
     * Nastavení event listenerů pro body
     */
    setupTrackPointsEvents() {
        const deleteButtons = document.querySelectorAll('.track-point-action.delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pointRow = e.target.closest('.track-point-row');
                const pointIndex = parseInt(pointRow.dataset.index);

                // Odstranění bodu z pole
                this.trackPoints.splice(pointIndex, 1);

                // Aktualizace UI
                this.updateTrackPointsDialog();

                // Odstranění markeru z mapy
                this.updatePathOnMap();
            });
        });
    }

    /**
     * Nastavení event listenerů pro tlačítka cesty
     */
    setupPathControlsEvents() {
        const showPathBtn = document.querySelector('#show-path');
        const savePathBtn = document.querySelector('#save-path');

        if (showPathBtn) {
            showPathBtn.addEventListener('click', () => {
                this.showPathOnMap();
            });
        }

        if (savePathBtn) {
            savePathBtn.addEventListener('click', () => {
                this.openSavePathDialog();
            });
        }
    }

    /**
     * Aktualizace dialogu sledování bodů
     */
    updateTrackPointsDialog() {
        const trackPointsList = document.querySelector('.track-points-list');
        const clearBtn = document.querySelector('#clear-points');

        if (trackPointsList) {
            if (this.trackPoints.length === 0) {
                trackPointsList.innerHTML = '<p class="no-points">Žádné body ke sledování. Klikněte na "Začít sledování" a pak klikejte na mapu pro přidání bodů.</p>';

                // Odstranění tlačítek pro zobrazení a uložení cesty
                const trackPathControls = document.querySelector('.track-path-controls');
                if (trackPathControls) {
                    trackPathControls.remove();
                }
            } else {
                trackPointsList.innerHTML = this.renderTrackPoints();
                this.setupTrackPointsEvents();

                // Přidání tlačítek pro zobrazení a uložení cesty, pokud máme alespoň 2 body
                if (this.trackPoints.length >= 2) {
                    let trackPathControls = document.querySelector('.track-path-controls');
                    if (!trackPathControls) {
                        const controlsContainer = document.createElement('div');
                        controlsContainer.className = 'track-path-controls';
                        controlsContainer.innerHTML = `
                            <button class="virtual-work-btn primary" id="show-path">Zobrazit cestu</button>
                            <button class="virtual-work-btn secondary" id="save-path">Uložit cestu</button>
                        `;

                        trackPointsList.insertAdjacentElement('afterend', controlsContainer);
                        this.setupPathControlsEvents();
                    }
                } else {
                    // Odstranění tlačítek pro zobrazení a uložení cesty, pokud máme méně než 2 body
                    const trackPathControls = document.querySelector('.track-path-controls');
                    if (trackPathControls) {
                        trackPathControls.remove();
                    }
                }
            }
        }

        if (clearBtn) {
            clearBtn.disabled = this.trackPoints.length === 0;
        }
    }

    /**
     * Začátek sledování bodů na mapě
     */
    startTrackingPoints() {
        // Kontrola, zda existuje mapa
        if (typeof map === 'undefined') {
            console.error('Mapa není k dispozici');
            return;
        }

        // Přidání event listeneru pro kliknutí na mapu
        map.on('click', this.handleMapClick.bind(this));

        // Zobrazení zprávy o začátku sledování
        if (typeof addMessage === 'function') {
            addMessage('Sledování bodů aktivováno. Klikněte na mapu pro přidání bodu.', false);
        }
    }

    /**
     * Konec sledování bodů na mapě
     */
    stopTrackingPoints() {
        // Kontrola, zda existuje mapa
        if (typeof map === 'undefined') {
            console.error('Mapa není k dispozici');
            return;
        }

        // Odstranění event listeneru pro kliknutí na mapu
        map.off('click', this.handleMapClick.bind(this));

        // Zobrazení zprávy o konci sledování
        if (typeof addMessage === 'function') {
            addMessage('Sledování bodů deaktivováno.', false);
        }
    }

    /**
     * Zpracování kliknutí na mapu
     */
    handleMapClick(e) {
        // Přidání bodu do pole
        this.trackPoints.push({
            lat: e.latlng.lat,
            lng: e.latlng.lng
        });

        // Aktualizace UI
        this.updateTrackPointsDialog();

        // Přidání markeru na mapu
        this.updatePathOnMap();
    }

    /**
     * Aktualizace cesty na mapě
     */
    updatePathOnMap() {
        // Kontrola, zda existuje mapa
        if (typeof map === 'undefined') {
            console.error('Mapa není k dispozici');
            return;
        }

        // Odstranění existujících markerů
        this.clearPathFromMap();

        // Přidání nových markerů
        this.currentPathMarkers = this.trackPoints.map((point, index) => {
            const marker = L.marker([point.lat, point.lng], {
                icon: L.divIcon({
                    className: 'track-point-marker',
                    html: `<div class="track-point-marker-inner">${index + 1}</div>`,
                    iconSize: [24, 24]
                })
            }).addTo(map);

            return marker;
        });

        // Přidání čáry spojující body
        if (this.trackPoints.length >= 2) {
            this.currentPathLine = L.polyline(this.trackPoints.map(point => [point.lat, point.lng]), {
                color: '#3498db',
                weight: 3,
                opacity: 0.7,
                dashArray: '5, 10'
            }).addTo(map);
        }
    }

    /**
     * Odstranění cesty z mapy
     */
    clearPathFromMap() {
        // Kontrola, zda existuje mapa
        if (typeof map === 'undefined') {
            console.error('Mapa není k dispozici');
            return;
        }

        // Odstranění markerů
        if (this.currentPathMarkers.length > 0) {
            this.currentPathMarkers.forEach(marker => {
                map.removeLayer(marker);
            });
            this.currentPathMarkers = [];
        }

        // Odstranění čáry
        if (this.currentPathLine) {
            map.removeLayer(this.currentPathLine);
            this.currentPathLine = null;
        }
    }

    /**
     * Zobrazení cesty na mapě
     */
    showPathOnMap() {
        // Kontrola, zda existuje mapa
        if (typeof map === 'undefined') {
            console.error('Mapa není k dispozici');
            return;
        }

        // Kontrola, zda máme alespoň 2 body
        if (this.trackPoints.length < 2) {
            if (typeof addMessage === 'function') {
                addMessage('Pro zobrazení cesty potřebujete alespoň 2 body.', true);
            }
            return;
        }

        // Aktualizace cesty na mapě
        this.updatePathOnMap();

        // Přiblížení mapy na cestu
        const bounds = L.latLngBounds(this.trackPoints.map(point => [point.lat, point.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });

        // Zobrazení zprávy
        if (typeof addMessage === 'function') {
            addMessage('Cesta byla zobrazena na mapě.', false);
        }

        // Výpočet vzdálenosti
        const distance = this.calculatePathDistance();

        // Zobrazení informací o cestě
        const pathPreview = document.querySelector('#path-preview');
        if (pathPreview) {
            pathPreview.innerHTML = `
                <div class="path-preview-info">
                    <div class="path-preview-stat">
                        <div class="path-preview-stat-label">Počet bodů</div>
                        <div class="path-preview-stat-value">${this.trackPoints.length}</div>
                    </div>
                    <div class="path-preview-stat">
                        <div class="path-preview-stat-label">Vzdálenost</div>
                        <div class="path-preview-stat-value">${this.formatDistance(distance)}</div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Výpočet vzdálenosti cesty
     */
    calculatePathDistance() {
        // Kontrola, zda máme alespoň 2 body
        if (this.trackPoints.length < 2) {
            return 0;
        }

        // Výpočet vzdálenosti
        let distance = 0;
        for (let i = 0; i < this.trackPoints.length - 1; i++) {
            const point1 = L.latLng(this.trackPoints[i].lat, this.trackPoints[i].lng);
            const point2 = L.latLng(this.trackPoints[i + 1].lat, this.trackPoints[i + 1].lng);
            distance += point1.distanceTo(point2);
        }

        // Převod na kilometry
        return distance / 1000;
    }

    /**
     * Otevření dialogu pro uložení cesty
     */
    openSavePathDialog() {
        // Kontrola, zda máme alespoň 2 body
        if (this.trackPoints.length < 2) {
            if (typeof addMessage === 'function') {
                addMessage('Pro uložení cesty potřebujete alespoň 2 body.', true);
            }
            return;
        }

        // Výpočet vzdálenosti
        const distance = this.calculatePathDistance();

        // Vytvoření dialogu
        const saveDialog = document.createElement('div');
        saveDialog.className = 'virtual-work-dialog save-path-dialog';
        saveDialog.innerHTML = `
            <div class="virtual-work-header">
                <h2>Uložení cesty</h2>
                <button class="virtual-work-close">&times;</button>
            </div>
            <div class="virtual-work-content">
                <div class="save-path-form">
                    <div class="form-group">
                        <label for="path-name">Název cesty:</label>
                        <input type="text" id="path-name" class="track-path-name-input" placeholder="Zadejte název cesty">
                    </div>

                    <div class="path-preview-info">
                        <div class="path-preview-stat">
                            <div class="path-preview-stat-label">Počet bodů</div>
                            <div class="path-preview-stat-value">${this.trackPoints.length}</div>
                        </div>
                        <div class="path-preview-stat">
                            <div class="path-preview-stat-label">Vzdálenost</div>
                            <div class="path-preview-stat-value">${this.formatDistance(distance)}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="virtual-work-actions">
                <button class="virtual-work-btn secondary" id="cancel-save-path">Zrušit</button>
                <button class="virtual-work-btn primary" id="confirm-save-path">Uložit cestu</button>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(saveDialog);

        // Přidání event listenerů
        const closeBtn = saveDialog.querySelector('.virtual-work-close');
        const cancelBtn = saveDialog.querySelector('#cancel-save-path');
        const confirmBtn = saveDialog.querySelector('#confirm-save-path');
        const nameInput = saveDialog.querySelector('#path-name');

        closeBtn.addEventListener('click', () => this.closeDialog(saveDialog));
        cancelBtn.addEventListener('click', () => this.closeDialog(saveDialog));

        confirmBtn.addEventListener('click', () => {
            const pathName = nameInput.value.trim();

            if (!pathName) {
                if (typeof addMessage === 'function') {
                    addMessage('Zadejte název cesty.', true);
                }
                return;
            }

            // Uložení cesty
            this.savedPaths.push({
                id: Date.now(),
                name: pathName,
                points: [...this.trackPoints],
                distance: distance,
                date: new Date().toISOString()
            });

            // Uložení cest do localStorage
            this.savePaths();

            // Zavření dialogu
            this.closeDialog(saveDialog);

            // Aktualizace seznamu uložených cest
            const savedPathsList = document.querySelector('.saved-paths-list');
            if (savedPathsList) {
                savedPathsList.innerHTML = this.renderSavedPaths();
            }

            // Zobrazení zprávy
            if (typeof addMessage === 'function') {
                addMessage(`Cesta "${pathName}" byla úspěšně uložena.`, false);
            }
        });

        // Zaměření na input pro název
        nameInput.focus();
    }

    /**
     * Manuální dokončení práce
     */
    completeWorkManually(dialog, workplace, progressBar, percentElement, timeRemaining, activityLog, progressInterval) {
        // Zastavení intervalu
        clearInterval(progressInterval);

        // Nastavení progress baru na 100%
        progressBar.style.width = '100%';
        percentElement.textContent = '100%';
        timeRemaining.textContent = '0:00';

        // Přidání poslední aktivity
        activityLog.innerHTML = `<div class="work-activity-item new-activity">Práce dokončena manuálně!</div>` + activityLog.innerHTML;

        // Kontrola dokončení úkolů
        const allTasksCompleted = this.checkAllTasksCompleted(dialog);

        // Výpočet výdělku a XP s bonusem za dokončené úkoly
        let earnings = workplace.pay;
        let xp = workplace.xp;

        // Bonus za dokončené úkoly
        if (this.customTasks.length > 0) {
            const completedTasks = this.customTasks.filter(task => task.completed);
            const completionRate = completedTasks.length / this.customTasks.length;

            // Bonus za dokončené úkoly (až 20% navíc)
            const taskBonus = Math.round(earnings * 0.2 * completionRate);
            const xpBonus = Math.round(xp * 0.2 * completionRate);

            earnings += taskBonus;
            xp += xpBonus;
        }

        // Přidání záznamu do historie práce
        this.workHistory.push({
            id: Date.now(),
            workplace: workplace.id,
            name: workplace.name,
            pay: earnings,
            xp: xp,
            date: new Date().toISOString(),
            completedManually: true,
            customTasks: this.customTasks.map(task => ({
                text: task.text,
                completed: task.completed
            }))
        });

        // Přidání peněz a XP
        this.addMoney(earnings, xp);

        // Krátká pauza před zobrazením výsledku
        setTimeout(() => {
            // Zobrazení výsledku
            let resultHTML = `
                <div class="work-result">
                    <div class="work-result-icon">✅</div>
                    <h3>Práce dokončena manuálně!</h3>
                    <div class="work-result-amount">+ ${earnings} Kč</div>
                    <div class="work-result-xp">+ ${xp} XP</div>
            `;

            // Přidání informací o úkolech
            if (this.customTasks.length > 0) {
                const completedTasks = this.customTasks.filter(task => task.completed);

                resultHTML += `
                    <div class="tasks-summary">
                        <p>Dokončeno ${completedTasks.length} z ${this.customTasks.length} úkolů</p>
                        ${allTasksCompleted ?
                            '<div class="all-tasks-completed">Všechny úkoly dokončeny! Získáváte bonus +20%</div>' :
                            `<div class="tasks-bonus">Bonus za dokončené úkoly: +${Math.round((completedTasks.length / this.customTasks.length) * 20)}%</div>`
                        }
                    </div>
                `;
            }

            resultHTML += `
                    <p>Peníze a zkušenosti byly přidány na váš účet.</p>

                    <div class="work-result-stats">
                        <div class="work-result-stat">
                            <div class="work-result-stat-label">Celkový výdělek</div>
                            <div class="work-result-stat-value">${this.getTotalEarnings()} Kč</div>
                        </div>
                        <div class="work-result-stat">
                            <div class="work-result-stat-label">Celkem směn</div>
                            <div class="work-result-stat-value">${this.workHistory.length}</div>
                        </div>
                    </div>
                </div>
            `;

            dialog.querySelector('.virtual-work-content').innerHTML = resultHTML;

            // Změna tlačítek
            dialog.querySelector('.virtual-work-actions').innerHTML = `
                <button class="virtual-work-btn secondary" id="virtual-work-close">Zavřít</button>
                <button class="virtual-work-btn secondary" id="track-points">Sledovat body</button>
                <button class="virtual-work-btn primary" id="virtual-work-again">Pracovat znovu</button>
            `;

            // Přidání event listenerů pro nová tlačítka
            dialog.querySelector('#virtual-work-close').addEventListener('click', () => this.closeDialog(dialog));
            dialog.querySelector('#virtual-work-again').addEventListener('click', () => this.openWorkDialog());
            dialog.querySelector('#track-points').addEventListener('click', () => {
                this.closeDialog(dialog);
                this.openTrackPointsDialog();
            });
        }, 1000);
    }
}

// Vytvoření instance modulu
const VirtualWork = new VirtualWorkClass();

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializace modulu VirtualWork...');
    VirtualWork.init();
});

// Export modulu
window.VirtualWork = VirtualWork;
