/**
 * Jednoduchý modul pro virtuální práci
 * Verze 0.3.1.0
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
                duration: 30
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
                duration: 40
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
                duration: 20
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
                duration: 30
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
                duration: 30
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
                duration: 50
            }
        ];
        this.selectedWorkplace = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };

        // Historie práce
        this.workHistory = [];

        // Úkoly
        this.customTasks = [];

        // Markery úkolů na mapě
        this.taskMarkers = [];
    }

    /**
     * Inicializace modulu
     */
    init() {
        if (this.isInitialized) return;

        // Načtení CSS
        this.loadStyles();

        // Načtení historie práce
        this.loadWorkHistory();

        // Označení jako inicializovaný
        this.isInitialized = true;
        console.log('VirtualWork: Modul byl inicializován');
    }

    /**
     * Načtení CSS stylů
     */
    loadStyles() {
        // Kontrola, zda již styly existují
        if (document.getElementById('virtual-work-styles')) return;

        // Načtení externích CSS souborů
        const virtualWorkStyles = document.createElement('link');
        virtualWorkStyles.id = 'virtual-work-styles';
        virtualWorkStyles.rel = 'stylesheet';
        virtualWorkStyles.href = 'css/virtual-work.css';
        document.head.appendChild(virtualWorkStyles);

        // Načtení CSS pro task-definition
        const taskDefinitionStyles = document.createElement('link');
        taskDefinitionStyles.id = 'task-definition-styles';
        taskDefinitionStyles.rel = 'stylesheet';
        taskDefinitionStyles.href = 'css/task-definition.css';
        document.head.appendChild(taskDefinitionStyles);

        // Načtení CSS pro saved-work
        const savedWorkStyles = document.createElement('link');
        savedWorkStyles.id = 'saved-work-styles';
        savedWorkStyles.rel = 'stylesheet';
        savedWorkStyles.href = 'css/saved-work.css';
        document.head.appendChild(savedWorkStyles);
    }

    /**
     * Načtení historie práce z API
     */
    async loadWorkHistory() {
        try {
            const response = await fetch('/api/virtual-work/work-history');
            if (response.ok) {
                const data = await response.json();
                this.workHistory = data;
                console.log(`Načteno ${this.workHistory.length} záznamů historie práce z API`);
            } else {
                console.error('Chyba při načítání historie práce z API:', response.statusText);
                this.workHistory = [];
            }
        } catch (error) {
            console.error('Chyba při načítání historie práce z API:', error);
            this.workHistory = [];

            // Záložní načtení z localStorage
            try {
                const workHistory = localStorage.getItem('workHistory');
                if (workHistory) {
                    this.workHistory = JSON.parse(workHistory);
                    console.log(`Načteno ${this.workHistory.length} záznamů historie práce z localStorage (záloha)`);
                }
            } catch (localError) {
                console.error('Chyba při načítání historie práce z localStorage:', localError);
            }
        }
    }

    /**
     * Uložení záznamu práce do API
     */
    async saveWorkRecord(workRecord) {
        try {
            const response = await fetch('/api/virtual-work/work-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workRecord)
            });

            if (response.ok) {
                const savedRecord = await response.json();
                console.log('Záznam práce byl úspěšně uložen do API:', savedRecord);

                // Přidání záznamu do lokální historie
                this.workHistory.push(savedRecord);

                // Záložní uložení do localStorage
                try {
                    localStorage.setItem('workHistory', JSON.stringify(this.workHistory));
                } catch (localError) {
                    console.error('Chyba při ukládání historie práce do localStorage:', localError);
                }

                return savedRecord;
            } else {
                console.error('Chyba při ukládání záznamu práce do API:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Chyba při ukládání záznamu práce do API:', error);

            // Záložní uložení do localStorage
            try {
                // Přidání záznamu do lokální historie
                this.workHistory.push(workRecord);
                localStorage.setItem('workHistory', JSON.stringify(this.workHistory));
                console.log('Záznam práce byl uložen do localStorage (záloha)');
                return workRecord;
            } catch (localError) {
                console.error('Chyba při ukládání záznamu práce do localStorage:', localError);
                return null;
            }
        }
    }

    /**
     * Získání detailu záznamu práce podle ID
     */
    async getWorkRecordById(id) {
        try {
            const response = await fetch(`/api/virtual-work/work-history/${id}`);
            if (response.ok) {
                const workRecord = await response.json();
                return workRecord;
            } else {
                console.error('Chyba při načítání detailu záznamu práce:', response.statusText);
                return null;
            }
        } catch (error) {
            console.error('Chyba při načítání detailu záznamu práce:', error);

            // Záložní hledání v lokální historii
            const localRecord = this.workHistory.find(record => record.id === id);
            if (localRecord) {
                console.log('Záznam práce byl nalezen v lokální historii (záloha)');
                return localRecord;
            }

            return null;
        }
    }

    /**
     * Uložení aktuálního stavu práce
     */
    saveWorkProgress(dialog, workplace, startTime) {
        // Výpočet uplynulého času
        const currentTime = new Date();
        const elapsedTimeMs = currentTime - startTime;
        const elapsedMinutes = Math.floor(elapsedTimeMs / 60000);
        const elapsedSeconds = Math.floor((elapsedTimeMs % 60000) / 1000);
        const elapsedTimeFormatted = `${elapsedMinutes}:${elapsedSeconds.toString().padStart(2, '0')}`;

        // Vytvoření záznamu nedokončené práce
        const workProgress = {
            id: `progress_${Date.now()}`,
            workplaceId: workplace.id,
            name: workplace.name,
            icon: workplace.icon,
            startTime: startTime.toISOString(),
            elapsedTime: elapsedTimeFormatted,
            tasks: this.customTasks,
            date: new Date().toISOString(),
            isCompleted: false
        };

        // Uložení záznamu do localStorage
        const savedWork = JSON.parse(localStorage.getItem('aiMapaSavedWork') || '[]');
        savedWork.push(workProgress);
        localStorage.setItem('aiMapaSavedWork', JSON.stringify(savedWork));

        // Odstranění markerů úkolů z mapy
        this.removeTaskMarkersFromMap();

        console.log('Práce byla uložena:', workProgress);
        return workProgress;
    }

    /**
     * Zobrazení notifikace o uložené práci
     */
    showSavedWorkNotification(workplace) {
        // Vytvoření notifikace
        const notification = document.createElement('div');
        notification.className = 'saved-work-notification';
        notification.innerHTML = `
            <div class="saved-work-notification-content">
                <div class="saved-work-notification-icon">${workplace.icon}</div>
                <div class="saved-work-notification-text">
                    <div class="saved-work-notification-title">Práce uložena</div>
                    <div class="saved-work-notification-desc">Vaše práce jako ${workplace.name} byla uložena. Můžete se k ní vrátit později.</div>
                </div>
                <button class="saved-work-notification-close">&times;</button>
            </div>
            <div class="saved-work-notification-actions">
                <button class="saved-work-notification-resume">Pokračovat v práci</button>
            </div>
        `;

        // Přidání notifikace do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Event listener pro zavření notifikace
        const closeBtn = notification.querySelector('.saved-work-notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        // Event listener pro pokračování v práci
        const resumeBtn = notification.querySelector('.saved-work-notification-resume');
        resumeBtn.addEventListener('click', () => {
            // Zavření notifikace
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);

            // Otevření dialogu s nedokončenou prací
            this.showSavedWorkDialog();
        });

        // Automatické zavření notifikace po 10 sekundách
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 10000);
    }

    /**
     * Zobrazení dialogu s nedokončenou prací
     */
    showSavedWorkDialog() {
        // Načtení uložených prací z localStorage
        const savedWork = JSON.parse(localStorage.getItem('aiMapaSavedWork') || '[]');

        // Kontrola, zda existují nějaké uložené práce
        if (savedWork.length === 0) {
            alert('Nemáte žádnou uloženou nedokončenou práci.');
            return;
        }

        // Vytvoření dialogu
        const dialog = this.createDialog('Nedokončená práce');

        // Zobrazení seznamu nedokončených prací
        dialog.querySelector('.virtual-work-content').innerHTML = `
            <div class="saved-work-container">
                <h3>Vaše nedokončené práce</h3>
                <div class="saved-work-list">
                    ${savedWork.map((work, index) => {
                        const date = new Date(work.date);
                        const formattedDate = date.toLocaleDateString('cs-CZ') + ' ' + date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

                        return `
                            <div class="saved-work-item" data-id="${work.id}">
                                <div class="saved-work-icon">${work.icon}</div>
                                <div class="saved-work-info">
                                    <div class="saved-work-name">${work.name}</div>
                                    <div class="saved-work-date">Uloženo: ${formattedDate}</div>
                                    <div class="saved-work-details">
                                        <span class="saved-work-time">⏱️ Odpracováno: ${work.elapsedTime}</span>
                                        <span class="saved-work-tasks">📋 Úkolů: ${work.tasks.length}</span>
                                    </div>
                                </div>
                                <button class="saved-work-resume" title="Pokračovat v práci">▶️</button>
                                <button class="saved-work-delete" title="Odstranit">🗑️</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Přidání tlačítka zpět
        const actionsContainer = dialog.querySelector('.virtual-work-actions');
        actionsContainer.innerHTML = `
            <button class="virtual-work-btn secondary" id="back-to-workplaces-btn">Zpět na výběr práce</button>
        `;

        // Event listener pro tlačítko zpět
        const backBtn = dialog.querySelector('#back-to-workplaces-btn');
        backBtn.addEventListener('click', () => {
            this.openWorkDialog();
        });

        // Event listenery pro tlačítka pokračování
        const resumeButtons = dialog.querySelectorAll('.saved-work-resume');
        resumeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workItem = e.target.closest('.saved-work-item');
                const workId = workItem.dataset.id;

                // Načtení detailu uložené práce
                const workDetail = savedWork.find(work => work.id === workId);
                if (workDetail) {
                    // Najdeme odpovídající pracoviště
                    const workplace = this.workplaces.find(wp => wp.id === workDetail.workplaceId);
                    if (workplace) {
                        // Nastavení vybraného pracoviště
                        this.selectedWorkplace = workplace;

                        // Nastavení úkolů z uložené práce
                        this.customTasks = workDetail.tasks ? [...workDetail.tasks] : [];

                        // Odstranění uložené práce ze seznamu
                        const updatedSavedWork = savedWork.filter(work => work.id !== workId);
                        localStorage.setItem('aiMapaSavedWork', JSON.stringify(updatedSavedWork));

                        // Spuštění práce s úkoly
                        this.startWorkWithTasks(dialog, workplace);
                    }
                }
            });
        });

        // Event listenery pro tlačítka odstranění
        const deleteButtons = dialog.querySelectorAll('.saved-work-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const workItem = e.target.closest('.saved-work-item');
                const workId = workItem.dataset.id;

                // Potvrzení odstranění
                if (confirm('Opravdu chcete odstranit tuto nedokončenou práci?')) {
                    // Odstranění uložené práce ze seznamu
                    const updatedSavedWork = savedWork.filter(work => work.id !== workId);
                    localStorage.setItem('aiMapaSavedWork', JSON.stringify(updatedSavedWork));

                    // Odstranění položky ze seznamu
                    workItem.remove();

                    // Pokud byl seznam vyprázdněn, zobrazíme zprávu
                    if (updatedSavedWork.length === 0) {
                        dialog.querySelector('.saved-work-list').innerHTML = '<p class="no-saved-work">Nemáte žádnou uloženou nedokončenou práci.</p>';
                    }
                }
            });
        });
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
     * Zavření dialogu
     */
    closeDialog(dialog) {
        // Odstranění markerů úkolů z mapy
        this.removeTaskMarkersFromMap();

        // Odstranění dialogu
        if (dialog && dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
        }
    }

    /**
     * Otevření dialogu virtuální práce
     */
    openWorkDialog() {
        // Kontrola, zda je dialog již otevřený
        if (document.querySelector('.virtual-work-dialog')) return;

        // Kontrola, zda existují uložené nedokončené práce
        const savedWork = JSON.parse(localStorage.getItem('aiMapaSavedWork') || '[]');
        const hasSavedWork = savedWork.length > 0;

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog';
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2>Virtuální práce</h2>
                <button class="virtual-work-close">&times;</button>
            </div>
            <div class="virtual-work-content">
                ${hasSavedWork ? `
                    <div class="saved-work-banner">
                        <div class="saved-work-banner-icon">💾</div>
                        <div class="saved-work-banner-text">
                            Máte ${savedWork.length} nedokončen${savedWork.length === 1 ? 'ou práci' : 'é práce'}
                        </div>
                        <button class="saved-work-banner-btn" id="show-saved-work-btn">Zobrazit</button>
                    </div>
                ` : ''}

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
                                <div class="workplace-icon" data-icon="${workplace.icon}"></div>
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

        // Přidání event listeneru pro tlačítko historie
        const historyBtn = dialog.querySelector('#virtual-work-history');
        historyBtn.addEventListener('click', () => {
            this.showWorkHistory(dialog);
        });

        // Přidání event listeneru pro tlačítko zobrazení nedokončené práce
        const showSavedWorkBtn = dialog.querySelector('#show-saved-work-btn');
        if (showSavedWorkBtn) {
            showSavedWorkBtn.addEventListener('click', () => {
                this.showSavedWorkDialog();
            });
        }
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
                        <button id="add-task-btn">Přidat úkol</button>
                    </div>

                    <div class="custom-tasks-actions">
                        <button id="back-to-workplaces-btn">Zpět na výběr práce</button>
                        <button id="skip-tasks-btn">Začít pracovat</button>
                    </div>
                </div>
            `;

            // Inicializace pole pro úkoly
            this.customTasks = [];

            // Přidání event listenerů pro formulář úkolů
            const addTaskBtn = dialog.querySelector('#add-task-btn');
            const newTaskInput = dialog.querySelector('#new-task-input');
            const tasksList = dialog.querySelector('#custom-tasks-list');
            const skipTasksBtn = dialog.querySelector('#skip-tasks-btn');
            const backBtn = dialog.querySelector('#back-to-workplaces-btn');

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

                    // Aktualizace stavu tlačítka pro začátek práce
                    skipTasksBtn.textContent = 'Začít pracovat bez úkolů';
                } else {
                    tasksList.innerHTML = this.customTasks.map((task, index) => `
                        <div class="custom-task-item" data-id="${task.id}" draggable="true">
                            <div class="custom-task-text">${index + 1}. ${task.text}</div>
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

                    // Aktualizace stavu tlačítka pro začátek práce
                    skipTasksBtn.textContent = this.customTasks.length > 0 ? 'Začít pracovat bez úkolů' : 'Začít pracovat';

                    // Implementace drag and drop funkcionality
                    const taskItems = tasksList.querySelectorAll('.custom-task-item');

                    taskItems.forEach(item => {
                        // Drag start
                        item.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData('text/plain', item.dataset.id);
                            item.classList.add('dragging');

                            // Nastavení průhledného obrázku jako drag image
                            const img = new Image();
                            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                            e.dataTransfer.setDragImage(img, 0, 0);
                        });

                        // Drag end
                        item.addEventListener('dragend', () => {
                            item.classList.remove('dragging');
                            taskItems.forEach(i => i.classList.remove('drag-over-top', 'drag-over-bottom'));
                        });

                        // Drag over
                        item.addEventListener('dragover', (e) => {
                            e.preventDefault();
                            const draggingItem = tasksList.querySelector('.dragging');
                            if (draggingItem !== item) {
                                const rect = item.getBoundingClientRect();
                                const midY = rect.top + rect.height / 2;

                                if (e.clientY < midY) {
                                    item.classList.add('drag-over-top');
                                    item.classList.remove('drag-over-bottom');
                                } else {
                                    item.classList.add('drag-over-bottom');
                                    item.classList.remove('drag-over-top');
                                }
                            }
                        });

                        // Drag leave
                        item.addEventListener('dragleave', () => {
                            item.classList.remove('drag-over-top', 'drag-over-bottom');
                        });

                        // Drop
                        item.addEventListener('drop', (e) => {
                            e.preventDefault();
                            const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
                            const targetId = parseInt(item.dataset.id);

                            if (draggedId !== targetId) {
                                // Najít indexy obou úkolů
                                const draggedIndex = this.customTasks.findIndex(task => task.id === draggedId);
                                const targetIndex = this.customTasks.findIndex(task => task.id === targetId);

                                if (draggedIndex !== -1 && targetIndex !== -1) {
                                    // Vyjmout přetahovaný úkol
                                    const [draggedTask] = this.customTasks.splice(draggedIndex, 1);

                                    // Určit novou pozici
                                    let newIndex = targetIndex;
                                    if (draggedIndex < targetIndex && item.classList.contains('drag-over-bottom')) {
                                        newIndex = targetIndex;
                                    } else if (draggedIndex > targetIndex && item.classList.contains('drag-over-top')) {
                                        newIndex = targetIndex;
                                    } else if (draggedIndex < targetIndex) {
                                        newIndex = targetIndex - 1;
                                    }

                                    // Vložit úkol na novou pozici
                                    this.customTasks.splice(newIndex, 0, draggedTask);

                                    // Aktualizovat seznam
                                    updateTasksList();
                                }
                            }

                            item.classList.remove('drag-over-top', 'drag-over-bottom');
                        });
                    });
                }
            };

            // Event listener pro přidání úkolu
            addTaskBtn.addEventListener('click', addNewTask);

            // Event listener pro přidání úkolu po stisknutí Enter
            newTaskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addNewTask();
                }
            });

            // Event listener pro přeskočení definice úkolů
            skipTasksBtn.addEventListener('click', () => {
                this.customTasks = [];
                this.startWorkWithTasks(dialog, workplace);
            });

            // Event listener pro tlačítko zpět
            backBtn.addEventListener('click', () => {
                // Vrátíme se zpět na výběr pracoviště
                this.openWorkDialog();

                // Vybereme znovu stejné pracoviště, pokud existuje
                setTimeout(() => {
                    const dialog = document.querySelector('.virtual-work-dialog');
                    if (dialog && this.selectedWorkplace) {
                        const workplaceItems = dialog.querySelectorAll('.workplace-item');
                        workplaceItems.forEach(item => {
                            if (item.dataset.id === this.selectedWorkplace.id) {
                                item.click();
                            }
                        });
                    }
                }, 100);
            });

            // Inicializace seznamu úkolů
            updateTasksList();

            // Zaměření na input pro rychlé zadávání
            newTaskInput.focus();
        });
    }

    /**
     * Zobrazení historie práce
     */
    showWorkHistory(dialog) {
        // Zobrazení historie práce
        dialog.querySelector('.virtual-work-content').innerHTML = `
            <div class="work-history-container">
                <h3>Historie práce</h3>
                ${this.workHistory.length === 0 ?
                    '<p class="no-history">Zatím nemáte žádnou historii práce.</p>' :
                    `<div class="work-history-list">
                        ${this.workHistory.map((record, index) => {
                            const date = new Date(record.date);
                            const formattedDate = date.toLocaleDateString('cs-CZ') + ' ' + date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

                            return `
                                <div class="work-history-item" data-id="${record.id}">
                                    <div class="work-history-icon" data-icon="${record.icon}"></div>
                                    <div class="work-history-info">
                                        <div class="work-history-name">${record.name}</div>
                                        <div class="work-history-date">${formattedDate}</div>
                                        <div class="work-history-details">
                                            <span class="work-history-pay">💰 ${record.pay} Kč</span>
                                            <span class="work-history-xp">⭐ ${record.xp} XP</span>
                                            <span class="work-history-duration">⏱️ ${record.duration || '?'} min</span>
                                        </div>
                                    </div>
                                    <button class="work-history-repeat" title="Opakovat tuto práci">🔄</button>
                                </div>
                            `;
                        }).join('')}
                    </div>`
                }
            </div>
        `;

        // Přidání event listenerů pro tlačítka opakování
        const repeatButtons = dialog.querySelectorAll('.work-history-repeat');
        repeatButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const historyItem = e.target.closest('.work-history-item');
                const recordId = historyItem.dataset.id;

                // Získání detailu záznamu
                const record = await this.getWorkRecordById(recordId);
                if (record) {
                    // Najdeme odpovídající pracoviště
                    const workplace = this.workplaces.find(wp => wp.id === record.workplaceId);
                    if (workplace) {
                        // Nastavení vybraného pracoviště
                        this.selectedWorkplace = workplace;

                        // Nastavení úkolů z historie
                        this.customTasks = record.tasks ? [...record.tasks] : [];

                        // Resetování stavu dokončení úkolů
                        this.customTasks.forEach(task => task.completed = false);

                        // Spuštění práce s úkoly
                        this.startWorkWithTasks(dialog, workplace);
                    }
                }
            });
        });

        // Přidání tlačítka zpět
        const actionsContainer = dialog.querySelector('.virtual-work-actions');
        actionsContainer.innerHTML = `
            <button class="virtual-work-btn secondary" id="back-to-workplaces-btn">Zpět na výběr práce</button>
        `;

        // Event listener pro tlačítko zpět
        const backBtn = dialog.querySelector('#back-to-workplaces-btn');
        backBtn.addEventListener('click', () => {
            this.openWorkDialog();
        });
    }

    /**
     * Spuštění práce s úkoly
     */
    startWorkWithTasks(dialog, workplace) {
        // Výpočet doby trvání práce v milisekundách (z minut)
        const workDuration = workplace.duration * 60 * 1000; // Převod minut na milisekundy

        // Výpočet počtu kroků pro časovač (1 krok každých 100ms)
        const totalSteps = workDuration / 100;
        let currentStep = 0;

        // Uložení času začátku práce
        const startTime = new Date();
        dialog.setAttribute('data-start-time', startTime.toISOString());

        // Zobrazení pracovního dialogu
        dialog.querySelector('.virtual-work-content').innerHTML = `
            <div class="work-in-progress">
                <div class="work-info">
                    Pracujete jako: ${workplace.name}
                </div>

                <div class="work-progress-info">
                    <span class="work-progress-percent">0%</span>
                    <span class="work-time-remaining">${workplace.duration}:00</span>
                </div>

                <div class="work-progress-container">
                    <div class="work-progress-bar"></div>
                </div>

                <div class="custom-tasks-progress">
                    <h3>Vaše úkoly:</h3>
                    ${this.customTasks.length === 0 ?
                        '<p class="no-tasks">Nemáte definované žádné úkoly.</p>' :
                        `<div class="custom-tasks-checklist">
                            ${this.customTasks.map(task => `
                                <div class="custom-task-check-item" data-id="${task.id}">
                                    <label class="custom-task-check-label">
                                        <input type="checkbox" class="custom-task-checkbox" ${task.completed ? 'checked' : ''}>
                                        <span class="custom-task-check-text">${task.text}</span>
                                    </label>
                                </div>
                            `).join('')}
                        </div>`
                    }
                </div>

                <div class="work-activity-container">
                    <h3>Aktivita:</h3>
                    <div class="work-activity-log">
                        <div class="work-activity-item">Začali jste pracovat jako ${workplace.name}.</div>
                    </div>
                </div>

                <div class="add-task-during-work">
                    <button class="add-task-toggle" id="add-task-toggle">
                        <i>+</i> Přidat nový úkol
                    </button>
                    <div class="add-task-form" id="add-task-form">
                        <div class="custom-tasks-form">
                            <input type="text" id="new-task-input-during-work" placeholder="Zadejte nový úkol..." class="custom-task-input">
                            <button id="add-task-btn-during-work">Přidat úkol</button>
                        </div>
                    </div>
                </div>

                <button class="save-work-btn" id="save-work-btn">
                    <i>💾</i> Uložit práci a vrátit se později
                </button>
            </div>
        `;

        // Přidání tlačítek pro ovládání práce
        const actionsContainer = dialog.querySelector('.virtual-work-actions');
        actionsContainer.innerHTML = `
            <div class="complete-manually-container">
                <button class="virtual-work-btn primary" id="complete-work-btn">Dokončit práci a získat odměnu</button>
            </div>
        `;

        // Získání referencí na elementy
        const progressBar = dialog.querySelector('.work-progress-bar');
        const percentElement = dialog.querySelector('.work-progress-percent');
        const timeRemaining = dialog.querySelector('.work-time-remaining');
        const activityLog = dialog.querySelector('.work-activity-log');
        const completeManuallyContainer = dialog.querySelector('.complete-manually-container');
        const completeBtn = completeManuallyContainer.querySelector('#complete-work-btn');

        // Přidání event listenerů pro checkboxy úkolů
        const checkboxes = dialog.querySelectorAll('.custom-task-checkbox');
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

                    // Aktualizace progress baru podle dokončených úkolů
                    this.updateProgressBarByTasks(dialog, progressBar, percentElement);

                    // Aktualizace markerů úkolů na mapě
                    this.updateTaskMarkersOnMap();
                }
            });
        });

        // Přidání event listeneru pro tlačítko dokončení
        completeBtn.addEventListener('click', () => {
            // Dokončení práce
            this.completeWorkManually(dialog, workplace, progressBar, percentElement, timeRemaining, activityLog, progressInterval);
        });

        // Event listenery pro přidávání úkolů během práce
        const addTaskToggle = dialog.querySelector('#add-task-toggle');
        const addTaskForm = dialog.querySelector('#add-task-form');
        const newTaskInputDuringWork = dialog.querySelector('#new-task-input-during-work');
        const addTaskBtnDuringWork = dialog.querySelector('#add-task-btn-during-work');
        const tasksChecklist = dialog.querySelector('.custom-tasks-checklist');

        // Toggle formuláře pro přidání úkolu
        addTaskToggle.addEventListener('click', () => {
            const isExpanded = addTaskForm.classList.contains('expanded');

            if (isExpanded) {
                addTaskForm.classList.remove('expanded');
                addTaskToggle.classList.remove('expanded');
                addTaskToggle.innerHTML = '<i>+</i> Přidat nový úkol';
            } else {
                addTaskForm.classList.add('expanded');
                addTaskToggle.classList.add('expanded');
                addTaskToggle.innerHTML = '<i>+</i> Zavřít formulář';
                newTaskInputDuringWork.focus();
            }
        });

        // Funkce pro přidání nového úkolu během práce
        const addNewTaskDuringWork = () => {
            const taskText = newTaskInputDuringWork.value.trim();
            if (taskText) {
                // Přidání úkolu do pole
                const taskId = Date.now();
                this.customTasks.push({
                    id: taskId,
                    text: taskText,
                    completed: false
                });

                // Aktualizace seznamu úkolů v checklistu
                if (this.customTasks.length === 1) {
                    // Pokud to byl první úkol, nahradíme zprávu o žádných úkolech
                    dialog.querySelector('.custom-tasks-progress').innerHTML = `
                        <h3>Vaše úkoly:</h3>
                        <div class="custom-tasks-checklist">
                            <div class="custom-task-check-item" data-id="${taskId}">
                                <label class="custom-task-check-label">
                                    <input type="checkbox" class="custom-task-checkbox">
                                    <span class="custom-task-check-text">${taskText}</span>
                                </label>
                            </div>
                        </div>
                    `;
                } else {
                    // Přidání nového úkolu do existujícího seznamu
                    const newTaskItem = document.createElement('div');
                    newTaskItem.className = 'custom-task-check-item';
                    newTaskItem.dataset.id = taskId;
                    newTaskItem.innerHTML = `
                        <label class="custom-task-check-label">
                            <input type="checkbox" class="custom-task-checkbox">
                            <span class="custom-task-check-text">${taskText}</span>
                        </label>
                    `;

                    // Přidání event listeneru pro checkbox
                    const checkbox = newTaskItem.querySelector('.custom-task-checkbox');
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

                            // Aktualizace progress baru podle dokončených úkolů
                            this.updateProgressBarByTasks(dialog, progressBar, percentElement);

                            // Aktualizace markerů úkolů na mapě
                            this.updateTaskMarkersOnMap();
                        }
                    });

                    // Přidání nového úkolu do seznamu
                    dialog.querySelector('.custom-tasks-checklist').appendChild(newTaskItem);
                }

                // Přidání aktivity do logu
                activityLog.innerHTML = `<div class="work-activity-item new-activity">Přidán nový úkol: ${taskText}</div>` + activityLog.innerHTML;

                // Odstranění třídy new-activity po animaci
                setTimeout(() => {
                    const newActivity = activityLog.querySelector('.new-activity');
                    if (newActivity) {
                        newActivity.classList.remove('new-activity');
                    }
                }, 1000);

                // Vyčištění inputu
                newTaskInputDuringWork.value = '';
                newTaskInputDuringWork.focus();

                // Aktualizace progress baru podle dokončených úkolů
                this.updateProgressBarByTasks(dialog, progressBar, percentElement);

                // Aktualizace markerů úkolů na mapě
                this.addTaskMarkersToMap();
            }
        };

        // Event listener pro přidání úkolu během práce
        addTaskBtnDuringWork.addEventListener('click', addNewTaskDuringWork);

        // Event listener pro přidání úkolu po stisknutí Enter
        newTaskInputDuringWork.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addNewTaskDuringWork();
            }
        });

        // Event listener pro tlačítko uložení práce
        const saveWorkBtn = dialog.querySelector('#save-work-btn');
        saveWorkBtn.addEventListener('click', () => {
            // Uložení aktuálního stavu práce
            this.saveWorkProgress(dialog, workplace, startTime);

            // Přidání aktivity do logu
            activityLog.innerHTML = `<div class="work-activity-item new-activity">Práce uložena. Můžete se k ní vrátit později.</div>` + activityLog.innerHTML;

            // Zavření dialogu po krátké prodlevě
            setTimeout(() => {
                this.closeDialog(dialog);

                // Zobrazení notifikace o uložení
                this.showSavedWorkNotification(workplace);
            }, 1500);
        });

        // Přidání markerů úkolů na mapu
        this.addTaskMarkersToMap();

        // Spuštění časovače pro aktualizaci času
        const progressInterval = setInterval(() => {
            // Zvýšení aktuálního kroku
            currentStep++;

            // Výpočet zbývajícího času
            const remainingSteps = totalSteps - currentStep;
            const remainingSeconds = Math.floor(remainingSteps / 10);
            const remainingMinutes = Math.floor(remainingSeconds / 60);
            const remainingSecondsDisplay = remainingSeconds % 60;
            timeRemaining.textContent = `${remainingMinutes}:${remainingSecondsDisplay.toString().padStart(2, '0')}`;

            // Kontrola, zda jsme dosáhli konce času
            if (currentStep >= totalSteps) {
                clearInterval(progressInterval);

                // Přidání poslední aktivity - pouze informace, že čas vypršel, ale práce pokračuje
                activityLog.innerHTML = `<div class="work-activity-item new-activity">Čas vypršel! Dokončete všechny úkoly pro získání odměny.</div>` + activityLog.innerHTML;

                // Zvýraznění informace o dokončení
                const workInfo = dialog.querySelector('.work-info');
                if (workInfo) {
                    workInfo.textContent = 'Čas vypršel! Dokončete všechny úkoly pro získání odměny.';
                    workInfo.style.color = '#f39c12';
                    workInfo.style.fontWeight = 'bold';
                }

                // Kontrola, zda jsou všechny úkoly dokončeny
                const completedTasks = this.customTasks.filter(task => task.completed);
                const completionPercent = this.customTasks.length > 0 ?
                    Math.floor((completedTasks.length / this.customTasks.length) * 100) : 0;

                // Pokud jsou všechny úkoly dokončeny, zvýrazníme tlačítko pro dokončení práce
                if (completionPercent === 100) {
                    // Zvýraznění tlačítka pro dokončení práce
                    if (completeBtn) {
                        completeBtn.classList.add('pulse-animation');
                    }
                }
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

            // Zvýraznění informace o dokončení
            const workInfo = dialog.querySelector('.work-info');
            if (workInfo) {
                workInfo.textContent = 'Všechny úkoly dokončeny! Klikněte na tlačítko "Dokončit práci a získat odměnu" níže.';
                workInfo.style.color = '#27ae60';
                workInfo.style.fontWeight = 'bold';
            }
        }

        return allCompleted;
    }

    /**
     * Aktualizace progress baru podle dokončených úkolů
     */
    updateProgressBarByTasks(dialog, progressBar, percentElement) {
        if (this.customTasks.length === 0) return;

        // Výpočet procenta dokončených úkolů
        const completedTasks = this.customTasks.filter(task => task.completed);
        const completionPercent = Math.floor((completedTasks.length / this.customTasks.length) * 100);

        // Aktualizace progress baru
        progressBar.style.width = `${completionPercent}%`;
        percentElement.textContent = `${completionPercent}%`;

        // Pokud jsou všechny úkoly dokončeny, zobrazíme notifikaci
        if (completionPercent === 100) {
            // Přidání poslední aktivity
            const activityLog = dialog.querySelector('.work-activity-log');
            if (activityLog) {
                activityLog.innerHTML = `<div class="work-activity-item new-activity">Všechny úkoly dokončeny! Nyní můžete dokončit práci a získat odměnu.</div>` + activityLog.innerHTML;

                // Odstranění třídy new-activity po animaci
                setTimeout(() => {
                    const newActivity = activityLog.querySelector('.new-activity');
                    if (newActivity) {
                        newActivity.classList.remove('new-activity');
                    }
                }, 1000);
            }

            // Zvýraznění tlačítka pro dokončení práce
            const completeBtn = dialog.querySelector('#complete-work-btn');
            if (completeBtn) {
                completeBtn.classList.add('pulse-animation');
            }
        }
    }

    /**
     * Přidání markerů úkolů na mapu
     */
    addTaskMarkersToMap() {
        // Kontrola, zda existují úkoly
        if (!this.customTasks || this.customTasks.length === 0) return;

        // Kontrola, zda existuje mapa
        if (!window.map) return;

        // Odstranění existujících markerů
        this.removeTaskMarkersFromMap();

        // Přidání markerů pro každý úkol
        this.customTasks.forEach((task, index) => {
            // Vytvoření náhodné pozice v okolí aktuální pozice mapy
            const center = window.map.getCenter();
            const lat = center.lat + (Math.random() - 0.5) * 0.01;
            const lng = center.lng + (Math.random() - 0.5) * 0.01;

            // Vytvoření ikony markeru
            const icon = L.divIcon({
                className: `task-marker-icon ${task.completed ? 'completed' : ''}`,
                html: `<div class="task-marker-inner">${index + 1}</div>`,
                iconSize: [30, 30]
            });

            // Vytvoření markeru
            const marker = L.marker([lat, lng], {
                icon: icon,
                draggable: false,
                title: task.text
            });

            // Přidání popup s informacemi o úkolu
            marker.bindPopup(`
                <div class="task-popup">
                    <div class="task-popup-header">Úkol #${index + 1}</div>
                    <div class="task-popup-content">${task.text}</div>
                    <div class="task-popup-status">Stav: ${task.completed ? 'Dokončeno ✅' : 'Nedokončeno ❌'}</div>
                </div>
            `);

            // Přidání markeru na mapu
            marker.addTo(window.map);

            // Uložení reference na marker
            this.taskMarkers.push({
                id: task.id,
                marker: marker
            });
        });
    }

    /**
     * Odstranění markerů úkolů z mapy
     */
    removeTaskMarkersFromMap() {
        // Kontrola, zda existují markery
        if (!this.taskMarkers || this.taskMarkers.length === 0) return;

        // Kontrola, zda existuje mapa
        if (!window.map) return;

        // Odstranění markerů z mapy
        this.taskMarkers.forEach(item => {
            window.map.removeLayer(item.marker);
        });

        // Vyčištění pole markerů
        this.taskMarkers = [];
    }

    /**
     * Aktualizace markerů úkolů na mapě
     */
    updateTaskMarkersOnMap() {
        // Kontrola, zda existují markery
        if (!this.taskMarkers || this.taskMarkers.length === 0) return;

        // Kontrola, zda existuje mapa
        if (!window.map) return;

        // Aktualizace markerů podle stavu úkolů
        this.taskMarkers.forEach(item => {
            const task = this.customTasks.find(t => t.id === item.id);
            if (task) {
                // Aktualizace třídy ikony podle stavu úkolu
                const icon = item.marker.getIcon();
                const iconElement = icon.options.html;

                // Vytvoření nové ikony s aktualizovanou třídou
                const newIcon = L.divIcon({
                    className: `task-marker-icon ${task.completed ? 'completed' : ''}`,
                    html: iconElement,
                    iconSize: [30, 30]
                });

                // Nastavení nové ikony
                item.marker.setIcon(newIcon);

                // Aktualizace popup obsahu
                const popupContent = item.marker.getPopup().getContent();
                const newPopupContent = popupContent.replace(
                    task.completed ? 'Nedokončeno ❌' : 'Dokončeno ✅',
                    task.completed ? 'Dokončeno ✅' : 'Nedokončeno ❌'
                );
                item.marker.getPopup().setContent(newPopupContent);
            }
        });
    }

    /**
     * Manuální dokončení práce
     */
    completeWorkManually(dialog, workplace, progressBar, percentElement, timeRemaining, activityLog, progressInterval) {
        // Odstranění markerů úkolů z mapy
        this.removeTaskMarkersFromMap();

        // Výpočet celkového času, který práce trvala
        const startTime = new Date(dialog.getAttribute('data-start-time') || new Date());
        const endTime = new Date();
        const totalTimeMs = endTime - startTime;
        const totalMinutes = Math.floor(totalTimeMs / 60000);
        const totalSeconds = Math.floor((totalTimeMs % 60000) / 1000);
        const totalTimeFormatted = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

        // Uložení celkového času do dialogu pro pozdější použití
        dialog.setAttribute('data-total-time', totalTimeFormatted);

        // Zastavení intervalu
        if (progressInterval) {
            clearInterval(progressInterval);
        }

        // Nastavení progress baru na 100%
        progressBar.style.width = '100%';
        percentElement.textContent = '100%';
        timeRemaining.textContent = '0:00';

        // Výpočet bonusu za dokončené úkoly
        let taskBonus = 0;
        let taskBonusXp = 0;

        if (this.customTasks.length > 0) {
            const completedTasks = this.customTasks.filter(task => task.completed);
            const completionPercent = Math.floor((completedTasks.length / this.customTasks.length) * 100);

            // Bonus až 20% za dokončené úkoly
            taskBonus = Math.floor((workplace.pay * completionPercent * 0.2) / 100);
            taskBonusXp = Math.floor((workplace.xp * completionPercent * 0.2) / 100);
        }

        // Zobrazení výsledku práce
        dialog.querySelector('.virtual-work-content').innerHTML = `
            <div class="work-result">
                <div class="work-result-icon" data-icon="${workplace.icon}"></div>
                <h3>Práce dokončena!</h3>
                <p>Úspěšně jste dokončili práci jako ${workplace.name}.</p>

                <div class="work-result-amount">
                    <span class="work-result-amount-icon">💰</span>
                    <span class="work-result-amount-value">${workplace.pay + taskBonus} Kč</span>
                    ${taskBonus > 0 ? `<span class="work-result-bonus">(+${taskBonus} bonus za úkoly)</span>` : ''}
                </div>

                <div class="work-result-xp">
                    <span class="work-result-xp-icon">⭐</span>
                    <span class="work-result-xp-value">${workplace.xp + taskBonusXp} XP</span>
                    ${taskBonusXp > 0 ? `<span class="work-result-bonus">(+${taskBonusXp} bonus za úkoly)</span>` : ''}
                </div>

                <div class="work-result-time">
                    <span class="work-result-time-icon">⏱️</span>
                    <span class="work-result-time-value">Celkový čas: ${totalTimeFormatted}</span>
                </div>

                ${this.customTasks.length > 0 ? `
                    <div class="work-result-tasks">
                        <h4>Dokončené úkoly:</h4>
                        <div class="work-result-tasks-list">
                            ${this.customTasks.map(task => `
                                <div class="work-result-task-item ${task.completed ? 'completed' : 'incomplete'}">
                                    <span class="work-result-task-status">${task.completed ? '✅' : '❌'}</span>
                                    <span class="work-result-task-text">${task.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        // Přidání tlačítek pro ovládání výsledku
        const actionsContainer = dialog.querySelector('.virtual-work-actions');
        actionsContainer.innerHTML = `
            <button class="virtual-work-btn secondary" id="close-result-btn">Zavřít</button>
            <button class="virtual-work-btn primary" id="virtual-work-again">Pracovat znovu</button>
        `;

        // Přidání event listenerů pro tlačítka
        const closeBtn = dialog.querySelector('#close-result-btn');
        closeBtn.addEventListener('click', () => {
            this.closeDialog(dialog);
        });

        // Přidání event listeneru pro tlačítko "Pracovat znovu"
        dialog.querySelector('#virtual-work-again').addEventListener('click', () => {
            // Zachováme vybrané pracoviště pro opětovné použití
            const savedWorkplace = this.selectedWorkplace;

            if (!savedWorkplace) {
                console.error('Nelze opakovat práci - není vybráno žádné pracoviště');
                return;
            }

            // Nejprve zavřeme aktuální dialog
            this.closeDialog(dialog);

            // Otevřeme nový dialog pro výběr pracoviště
            this.openWorkDialog();

            // Počkáme na vykreslení dialogu a pak simulujeme výběr pracoviště a kliknutí na tlačítko "Začít pracovat"
            setTimeout(() => {
                const newDialog = document.querySelector('.virtual-work-dialog');
                if (newDialog) {
                    // Najdeme položku pracoviště podle ID
                    const workplaceItems = newDialog.querySelectorAll('.workplace-item');
                    let workplaceItem = null;

                    workplaceItems.forEach(item => {
                        if (item.dataset.id === savedWorkplace.id) {
                            workplaceItem = item;
                        }
                    });

                    if (workplaceItem) {
                        // Simulujeme kliknutí na položku pracoviště
                        workplaceItem.click();

                        // Simulujeme kliknutí na tlačítko "Začít pracovat"
                        setTimeout(() => {
                            const startBtn = newDialog.querySelector('#virtual-work-start');
                            if (startBtn && !startBtn.disabled) {
                                startBtn.click();
                            }
                        }, 100);
                    }
                }
            }, 100);
        });

        // Přidání peněz a XP
        if (window.addMoney) {
            window.addMoney(workplace.pay + taskBonus);
        }

        if (window.addXP) {
            window.addXP(workplace.xp + taskBonusXp, 'Práce');
        }

        // Uložení záznamu práce
        const workRecord = {
            id: Date.now().toString(),
            workplaceId: workplace.id,
            name: workplace.name,
            icon: workplace.icon,
            pay: workplace.pay + taskBonus,
            xp: workplace.xp + taskBonusXp,
            duration: totalTimeFormatted,
            date: new Date().toISOString(),
            tasks: this.customTasks
        };

        // Uložení záznamu do API
        this.saveWorkRecord(workRecord);
    }
}

// Vytvoření instance třídy
const VirtualWork = new VirtualWorkClass();

// Inicializace modulu při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    VirtualWork.init();
});

// Přidání tlačítka pro otevření dialogu virtuální práce
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda již tlačítko existuje
    if (document.querySelector('#virtual-work-btn')) return;

    // Vytvoření tlačítka
    const btn = document.createElement('button');
    btn.id = 'virtual-work-btn';
    btn.className = 'map-control-btn';
    btn.innerHTML = '💼';
    btn.title = 'Virtuální práce';

    // Přidání tlačítka do mapy
    const mapControls = document.querySelector('.map-controls');
    if (mapControls) {
        mapControls.appendChild(btn);

        // Přidání event listeneru
        btn.addEventListener('click', () => {
            VirtualWork.openWorkDialog();
        });
    }
});

// Export modulu
window.VirtualWork = VirtualWork;
