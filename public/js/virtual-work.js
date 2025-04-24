/**
 * AIMapa - Modul pro virtuální práci (klientská část)
 * Verze 0.3.0.16
 */

// Globální objekt virtuální práce
const VirtualWork = {
    // Základní nastavení
    isInitialized: false,
    workplaces: [],
    selectedWorkplace: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    
    // Historie práce
    workHistory: [],
    
    // Sledování bodů
    trackPoints: [],
    isTrackingMode: false,
    
    // Uložené cesty
    savedPaths: [],
    currentPathMarkers: [],
    currentPathLine: null,
    
    // Existující cesty
    existingPathPoints: [],
    existingPathLine: null,
    
    // Inicializace modulu
    init: async function() {
        if (this.isInitialized) return;
        
        console.log('Inicializace modulu VirtualWork...');
        
        try {
            // Načtení pracovišť z API
            await this.loadWorkplaces();
            
            // Načtení uložených cest
            this.loadSavedPaths();
            
            // Načtení historie práce
            this.loadWorkHistory();
            
            // Označení jako inicializovaný
            this.isInitialized = true;
            console.log('VirtualWork: Modul byl inicializován');
        } catch (error) {
            console.error('Chyba při inicializaci modulu VirtualWork:', error);
        }
    },
    
    // Načtení pracovišť z API
    loadWorkplaces: async function() {
        try {
            const response = await fetch('/api/virtual-work/workplaces');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.workplaces = await response.json();
            console.log(`Načteno ${this.workplaces.length} pracovišť`);
        } catch (error) {
            console.error('Chyba při načítání pracovišť:', error);
            
            // Fallback na výchozí pracoviště
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
                }
            ];
        }
    },
    
    // Načtení uložených cest z localStorage
    loadSavedPaths: function() {
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
    },
    
    // Uložení cest do localStorage
    savePaths: function() {
        try {
            localStorage.setItem('savedPaths', JSON.stringify(this.savedPaths));
            console.log(`Uloženo ${this.savedPaths.length} cest`);
        } catch (error) {
            console.error('Chyba při ukládání cest:', error);
        }
    },
    
    // Načtení historie práce z localStorage a API
    loadWorkHistory: async function() {
        try {
            // Nejprve zkusíme načíst z localStorage
            const localHistory = localStorage.getItem('workHistory');
            if (localHistory) {
                this.workHistory = JSON.parse(localHistory);
                console.log(`Načteno ${this.workHistory.length} záznamů historie práce z localStorage`);
            }
            
            // Pak zkusíme načíst z API
            const response = await fetch('/api/virtual-work/work-history');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const apiHistory = await response.json();
            
            // Sloučení historie z API a localStorage
            // V reálné aplikaci by bylo potřeba řešit duplicity a synchronizaci
            this.workHistory = [...this.workHistory, ...apiHistory];
            
            console.log(`Celkem načteno ${this.workHistory.length} záznamů historie práce`);
        } catch (error) {
            console.error('Chyba při načítání historie práce z API:', error);
            // Pokračujeme s daty z localStorage, pokud jsou k dispozici
        }
    },
    
    // Uložení historie práce do localStorage a API
    saveWorkHistory: async function() {
        try {
            // Uložení do localStorage
            localStorage.setItem('workHistory', JSON.stringify(this.workHistory));
            console.log(`Uloženo ${this.workHistory.length} záznamů historie práce do localStorage`);
            
            // V reálné aplikaci by zde bylo ukládání do API
        } catch (error) {
            console.error('Chyba při ukládání historie práce:', error);
        }
    },
    
    // Získání celkového výdělku
    getTotalEarnings: function() {
        return this.workHistory.reduce((total, work) => total + work.pay, 0);
    },
    
    // Získání celkového XP
    getTotalXP: function() {
        return this.workHistory.reduce((total, work) => total + work.xp, 0);
    },
    
    // Přidání peněz a XP
    addMoney: function(amount, xp) {
        // Aktualizace indikátoru peněz
        const moneyElement = document.getElementById('money-amount');
        if (moneyElement) {
            const currentMoney = parseInt(moneyElement.textContent);
            moneyElement.textContent = currentMoney + amount;
        }
        
        // Uložení historie práce
        this.saveWorkHistory();
    },
    
    // Otevření dialogu virtuální práce
    openWorkDialog: function() {
        // Kontrola, zda je dialog již otevřený
        if (document.querySelector('.virtual-work-dialog')) return;
        
        // Kontrola, zda je modul inicializován
        if (!this.isInitialized) {
            console.error('Modul VirtualWork není inicializován');
            return;
        }
        
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
    },
    
    // Nastavení event listenerů pro dialog
    setupDialogEvents: function(dialog) {
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
    },
    
    // Zavření dialogu
    closeDialog: function(dialog) {
        dialog.remove();
    },
    
    // Otevření dialogu pro sledování bodů
    openTrackPointsDialog: function() {
        // Implementace bude přidána v další verzi
        alert('Sledování bodů bude implementováno v další verzi');
    },
    
    // Začátek práce s úkoly
    startWorkWithTasks: function(dialog, workplace) {
        // Implementace bude přidána v další verzi
        alert('Virtuální práce bude implementována v další verzi');
        this.closeDialog(dialog);
    }
};

// Export pro použití v jiných skriptech
window.VirtualWork = VirtualWork;
