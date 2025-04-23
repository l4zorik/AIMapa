/**
 * Modul pro systém úkolů a denních questů
 * Verze 0.2.9.5
 */

const TaskSystem = {
    // Stav modulu
    isInitialized: false,

    // Aktuální úkoly
    tasks: [],

    // Denní questy
    dailyQuests: [],

    // Body z questů
    questPoints: 0,

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;

        console.log('Inicializace modulu pro systém úkolů...');

        // Načtení uložených úkolů a bodů z localStorage
        this.loadTasks();

        // Generování denního questu, pokud ještě nebyl vygenerován
        this.generateDailyQuest();

        // Přidání výchozích úkolů, pokud neexistují
        this.addDefaultTasks();

        // Přidání event listenerů
        this.setupEventListeners();

        this.isInitialized = true;
        console.log('Modul pro systém úkolů byl inicializován');
    },

    // Načtení úkolů a bodů z localStorage
    loadTasks() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};

            // Načtení úkolů
            if (appState.tasks) {
                this.tasks = appState.tasks;
            }

            // Načtení denních questů
            if (appState.dailyQuests) {
                this.dailyQuests = appState.dailyQuests;
            }

            // Načtení bodů z questů
            if (appState.questPoints !== undefined) {
                this.questPoints = appState.questPoints;
            }

            console.log('Načteny úkoly a body z localStorage:', this.tasks.length, 'úkolů,', this.questPoints, 'bodů');
        } catch (error) {
            console.error('Chyba při načítání úkolů a bodů:', error);
        }
    },

    // Uložení úkolů a bodů do localStorage
    saveTasks() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};

            // Uložení úkolů
            appState.tasks = this.tasks;

            // Uložení denních questů
            appState.dailyQuests = this.dailyQuests;

            // Uložení bodů z questů
            appState.questPoints = this.questPoints;

            localStorage.setItem('appState', JSON.stringify(appState));
        } catch (error) {
            console.error('Chyba při ukládání úkolů a bodů:', error);
        }
    },

    // Přidání výchozích úkolů
    addDefaultTasks() {
        // Kontrola, zda již existují nějaké úkoly
        if (this.tasks.length === 0) {
            // Přidání výchozího úkolu "sehnat peníze na nájem"
            this.addTask({
                id: 'rent-money',
                title: 'Sehnat peníze na nájem',
                description: 'Potřebuješ sehnat 5000 Kč na zaplacení nájmu do 10 dnů.',
                type: 'main',
                status: 'active',
                progress: 0,
                goal: 5000,
                reward: {
                    xp: 500,
                    questPoints: 100
                },
                location: {
                    lat: 48.8484,
                    lng: 17.1259,
                    name: 'Hodonín'
                },
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dní od nyní
                createdAt: new Date().toISOString()
            });

            console.log('Přidán výchozí úkol "sehnat peníze na nájem"');
        }
    },

    // Generování denního questu
    generateDailyQuest() {
        // Kontrola, zda již existuje denní quest pro dnešní den
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Kontrola, zda již existuje denní quest pro dnešní den
        const existingQuest = this.dailyQuests.find(quest => quest.date === today);

        if (!existingQuest) {
            // Typy denních questů
            const questTypes = [
                {
                    id: 'visit-location',
                    title: 'Navštívit místo',
                    description: 'Navštiv {location} a získej odměnu!',
                    locations: [
                        { name: 'náměstí', lat: 48.8484, lng: 17.1259 },
                        { name: 'park', lat: 48.8534, lng: 17.1289 },
                        { name: 'knihovnu', lat: 48.8464, lng: 17.1279 },
                        { name: 'nádraží', lat: 48.8514, lng: 17.1319 }
                    ],
                    reward: { xp: 50, questPoints: 20 }
                },
                {
                    id: 'find-item',
                    title: 'Najít předmět',
                    description: 'Najdi {item} a získej odměnu!',
                    items: [
                        { name: 'ztracenou peněženku', lat: 48.8494, lng: 17.1269 },
                        { name: 'starý klíč', lat: 48.8504, lng: 17.1249 },
                        { name: 'skrytý poklad', lat: 48.8474, lng: 17.1299 },
                        { name: 'tajemný balíček', lat: 48.8524, lng: 17.1239 }
                    ],
                    reward: { xp: 75, questPoints: 30 }
                },
                {
                    id: 'deliver-package',
                    title: 'Doručit balíček',
                    description: 'Doruč balíček z {start} do {end} a získej odměnu!',
                    routes: [
                        {
                            start: { name: 'pošty', lat: 48.8484, lng: 17.1259 },
                            end: { name: 'knihovny', lat: 48.8464, lng: 17.1279 }
                        },
                        {
                            start: { name: 'obchodu', lat: 48.8504, lng: 17.1249 },
                            end: { name: 'nádraží', lat: 48.8514, lng: 17.1319 }
                        },
                        {
                            start: { name: 'školy', lat: 48.8474, lng: 17.1299 },
                            end: { name: 'parku', lat: 48.8534, lng: 17.1289 }
                        }
                    ],
                    reward: { xp: 100, questPoints: 40 }
                }
            ];

            // Výběr náhodného typu questu
            const randomType = questTypes[Math.floor(Math.random() * questTypes.length)];

            // Vytvoření nového questu podle typu
            let newQuest = {
                id: `daily-quest-${today}`,
                type: randomType.id,
                title: randomType.title,
                status: 'active',
                date: today,
                reward: randomType.reward,
                createdAt: new Date().toISOString()
            };

            // Doplnění specifických údajů podle typu questu
            switch (randomType.id) {
                case 'visit-location':
                    const randomLocation = randomType.locations[Math.floor(Math.random() * randomType.locations.length)];
                    newQuest.description = randomType.description.replace('{location}', randomLocation.name);
                    newQuest.location = randomLocation;
                    break;

                case 'find-item':
                    const randomItem = randomType.items[Math.floor(Math.random() * randomType.items.length)];
                    newQuest.description = randomType.description.replace('{item}', randomItem.name);
                    newQuest.item = {
                        name: randomItem.name,
                        location: { lat: randomItem.lat, lng: randomItem.lng }
                    };
                    break;

                case 'deliver-package':
                    const randomRoute = randomType.routes[Math.floor(Math.random() * randomType.routes.length)];
                    newQuest.description = randomType.description
                        .replace('{start}', randomRoute.start.name)
                        .replace('{end}', randomRoute.end.name);
                    newQuest.route = {
                        start: randomRoute.start,
                        end: randomRoute.end
                    };
                    break;
            }

            // Přidání nového questu do pole
            this.dailyQuests.push(newQuest);

            // Uložení změn
            this.saveTasks();

            console.log('Vygenerován nový denní quest:', newQuest.title);

            // Zobrazení notifikace o novém questu
            if (typeof addMessage !== 'undefined') {
                addMessage(`Nový denní quest: ${newQuest.title} - ${newQuest.description}`, false);
            }

            return newQuest;
        }

        return existingQuest;
    },

    // Přidání nového úkolu
    addTask(task) {
        // Přidání úkolu do pole
        this.tasks.push(task);

        // Uložení změn
        this.saveTasks();

        // Zobrazení notifikace o novém úkolu
        if (typeof addMessage !== 'undefined') {
            addMessage(`Nový úkol: ${task.title} - ${task.description}`, false);
        }

        return task;
    },

    // Aktualizace úkolu
    updateTask(taskId, updates) {
        // Nalezení úkolu podle ID
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
            // Aktualizace úkolu
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates };

            // Uložení změn
            this.saveTasks();

            // Kontrola, zda byl úkol dokončen
            if (updates.status === 'completed' && this.tasks[taskIndex].status === 'completed') {
                this.completeTask(taskId);
            }

            return this.tasks[taskIndex];
        }

        return null;
    },

    // Dokončení úkolu
    completeTask(taskId) {
        // Nalezení úkolu podle ID
        const task = this.tasks.find(task => task.id === taskId);

        if (task && task.status !== 'completed') {
            // Označení úkolu jako dokončeného
            task.status = 'completed';
            task.completedAt = new Date().toISOString();

            // Přidání odměny
            if (task.reward) {
                // Přidání XP
                if (task.reward.xp && typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(task.reward.xp, `Dokončení úkolu: ${task.title}`);
                }

                // Přidání bodů z questů
                if (task.reward.questPoints) {
                    this.questPoints += task.reward.questPoints;

                    // Zobrazení notifikace o získání bodů
                    if (typeof addMessage !== 'undefined') {
                        addMessage(`Získali jste ${task.reward.questPoints} bodů za dokončení úkolu: ${task.title}`, false);
                    }
                }

                // Přidání peněz
                if (task.reward.money && typeof MoneyIndicator !== 'undefined') {
                    MoneyIndicator.addMoney(task.reward.money, `Dokončení úkolu: ${task.title}`);
                }
            }

            // Uložení změn
            this.saveTasks();

            // Zobrazení notifikace o dokončení úkolu
            if (typeof addMessage !== 'undefined') {
                addMessage(`Úkol dokončen: ${task.title}`, false);
            }

            return task;
        }

        return null;
    },

    // Dokončení denního questu
    completeDailyQuest(questId) {
        // Nalezení questu podle ID
        const questIndex = this.dailyQuests.findIndex(quest => quest.id === questId);

        if (questIndex !== -1 && this.dailyQuests[questIndex].status !== 'completed') {
            // Označení questu jako dokončeného
            this.dailyQuests[questIndex].status = 'completed';
            this.dailyQuests[questIndex].completedAt = new Date().toISOString();

            // Přidání odměny
            const quest = this.dailyQuests[questIndex];

            if (quest.reward) {
                // Přidání XP
                if (quest.reward.xp && typeof UserProgress !== 'undefined') {
                    UserProgress.addXP(quest.reward.xp, `Dokončení denního questu: ${quest.title}`);
                }

                // Přidání bodů z questů
                if (quest.reward.questPoints) {
                    this.questPoints += quest.reward.questPoints;

                    // Zobrazení notifikace o získání bodů
                    if (typeof addMessage !== 'undefined') {
                        addMessage(`Získali jste ${quest.reward.questPoints} bodů za dokončení denního questu: ${quest.title}`, false);
                    }
                }
            }

            // Uložení změn
            this.saveTasks();

            // Zobrazení notifikace o dokončení questu
            if (typeof addMessage !== 'undefined') {
                addMessage(`Denní quest dokončen: ${quest.title}`, false);
            }

            return quest;
        }

        return null;
    },

    // Získání aktivních úkolů
    getActiveTasks() {
        return this.tasks.filter(task => task.status === 'active');
    },

    // Získání aktivního denního questu
    getActiveDailyQuest() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        return this.dailyQuests.find(quest => quest.date === today && quest.status === 'active');
    },

    // Zobrazení úkolů na mapě
    showTasksOnMap() {
        // Získání aktivních úkolů
        const activeTasks = this.getActiveTasks();

        // Získání aktivního denního questu
        const activeQuest = this.getActiveDailyQuest();

        // Odstranění existujících markerů úkolů
        if (typeof map !== 'undefined' && typeof taskMarkers !== 'undefined') {
            // Odstranění existujících markerů
            taskMarkers.forEach(marker => marker.remove());
            taskMarkers = [];

            // Přidání markerů pro aktivní úkoly
            activeTasks.forEach(task => {
                if (task.location) {
                    // Vytvoření ikony pro marker
                    const taskIcon = L.divIcon({
                        className: 'task-marker',
                        html: `<div class="task-marker-icon"><i class="task-icon">&#x1F4C8;</i></div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    });

                    // Vytvoření markeru
                    const marker = L.marker([task.location.lat, task.location.lng], { icon: taskIcon })
                        .addTo(map)
                        .bindPopup(`
                            <div class="task-popup">
                                <h3>${task.title}</h3>
                                <p>${task.description}</p>
                                <div class="task-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${(task.progress / task.goal) * 100}%"></div>
                                    </div>
                                    <div class="progress-text">${task.progress} / ${task.goal}</div>
                                </div>
                                <div class="task-reward">
                                    <p>Odměna:</p>
                                    <ul>
                                        ${task.reward.xp ? `<li>${task.reward.xp} XP</li>` : ''}
                                        ${task.reward.questPoints ? `<li>${task.reward.questPoints} bodů</li>` : ''}
                                        ${task.reward.money ? `<li>${task.reward.money} Kč</li>` : ''}
                                    </ul>
                                </div>
                            </div>
                        `);

                    // Přidání markeru do pole
                    taskMarkers.push(marker);
                }
            });

            // Přidání markeru pro aktivní denní quest
            if (activeQuest) {
                let questLocation;

                // Získání lokace podle typu questu
                switch (activeQuest.type) {
                    case 'visit-location':
                        questLocation = activeQuest.location;
                        break;

                    case 'find-item':
                        questLocation = activeQuest.item.location;
                        break;

                    case 'deliver-package':
                        // Zobrazení počáteční lokace
                        questLocation = activeQuest.route.start;

                        // Vytvoření ikony pro cílový marker
                        const endIcon = L.divIcon({
                            className: 'quest-marker',
                            html: `<div class="quest-marker-icon end"><i class="quest-icon">&#x1F3C1;</i></div>`,
                            iconSize: [30, 30],
                            iconAnchor: [15, 30]
                        });

                        // Vytvoření cílového markeru
                        const endMarker = L.marker([activeQuest.route.end.lat, activeQuest.route.end.lng], { icon: endIcon })
                            .addTo(map)
                            .bindPopup(`
                                <div class="quest-popup">
                                    <h3>Cíl doručení</h3>
                                    <p>Doručte balíček do ${activeQuest.route.end.name}</p>
                                </div>
                            `);

                        // Přidání cílového markeru do pole
                        taskMarkers.push(endMarker);
                        break;
                }

                if (questLocation) {
                    // Vytvoření ikony pro marker
                    const questIcon = L.divIcon({
                        className: 'quest-marker',
                        html: `<div class="quest-marker-icon"><i class="quest-icon">&#x2B50;</i></div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 30]
                    });

                    // Vytvoření markeru
                    const marker = L.marker([questLocation.lat, questLocation.lng], { icon: questIcon })
                        .addTo(map)
                        .bindPopup(`
                            <div class="quest-popup">
                                <h3>${activeQuest.title}</h3>
                                <p>${activeQuest.description}</p>
                                <div class="quest-reward">
                                    <p>Odměna:</p>
                                    <ul>
                                        ${activeQuest.reward.xp ? `<li>${activeQuest.reward.xp} XP</li>` : ''}
                                        ${activeQuest.reward.questPoints ? `<li>${activeQuest.reward.questPoints} bodů</li>` : ''}
                                    </ul>
                                </div>
                            </div>
                        `);

                    // Přidání markeru do pole
                    taskMarkers.push(marker);
                }
            }
        }
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro změnu polohy uživatele
        document.addEventListener('userLocationChanged', (e) => {
            // Kontrola, zda existuje poloha uživatele
            if (e.detail && e.detail.lat && e.detail.lng) {
                // Kontrola splnění úkolů a questů na základě polohy
                this.checkTasksCompletion(e.detail);
            }
        });

        // Event listener pro přidání peněz
        document.addEventListener('moneyAdded', (e) => {
            // Kontrola, zda existuje úkol na sehnat peníze na nájem
            const rentTask = this.tasks.find(task => task.id === 'rent-money' && task.status === 'active');

            if (rentTask && e.detail && e.detail.amount) {
                // Aktualizace postupu úkolu
                rentTask.progress += e.detail.amount;

                // Kontrola, zda byl úkol splněn
                if (rentTask.progress >= rentTask.goal) {
                    this.completeTask('rent-money');
                } else {
                    // Uložení změn
                    this.saveTasks();
                }
            }
        });
    },

    // Kontrola splnění úkolů a questů na základě polohy
    checkTasksCompletion(userLocation) {
        // Získání aktivních úkolů
        const activeTasks = this.getActiveTasks();

        // Získání aktivního denního questu
        const activeQuest = this.getActiveDailyQuest();

        // Kontrola splnění úkolů
        activeTasks.forEach(task => {
            // Kontrola, zda úkol má lokaci
            if (task.location) {
                // Výpočet vzdálenosti mezi uživatelem a cílem úkolu
                const distance = this.calculateDistance(
                    userLocation.lat, userLocation.lng,
                    task.location.lat, task.location.lng
                );

                // Kontrola, zda je uživatel dostatečně blízko cíle (100 metrů)
                if (distance <= 0.1) {
                    // Aktualizace úkolu podle typu
                    if (task.type === 'visit-location') {
                        // Dokončení úkolu navštívení lokace
                        this.completeTask(task.id);
                    }
                }
            }
        });

        // Kontrola splnění denního questu
        if (activeQuest) {
            let questLocation;
            let isCompleted = false;

            // Získání lokace podle typu questu
            switch (activeQuest.type) {
                case 'visit-location':
                    questLocation = activeQuest.location;

                    // Výpočet vzdálenosti mezi uživatelem a cílem questu
                    if (questLocation) {
                        const distance = this.calculateDistance(
                            userLocation.lat, userLocation.lng,
                            questLocation.lat, questLocation.lng
                        );

                        // Kontrola, zda je uživatel dostatečně blízko cíle (100 metrů)
                        if (distance <= 0.1) {
                            isCompleted = true;
                        }
                    }
                    break;

                case 'find-item':
                    questLocation = activeQuest.item.location;

                    // Výpočet vzdálenosti mezi uživatelem a předmětem
                    if (questLocation) {
                        const distance = this.calculateDistance(
                            userLocation.lat, userLocation.lng,
                            questLocation.lat, questLocation.lng
                        );

                        // Kontrola, zda je uživatel dostatečně blízko předmětu (50 metrů)
                        if (distance <= 0.05) {
                            isCompleted = true;
                        }
                    }
                    break;

                case 'deliver-package':
                    // Kontrola, zda uživatel již vyzvedl balíček
                    if (!activeQuest.packagePickedUp) {
                        // Výpočet vzdálenosti mezi uživatelem a počáteční lokací
                        const startDistance = this.calculateDistance(
                            userLocation.lat, userLocation.lng,
                            activeQuest.route.start.lat, activeQuest.route.start.lng
                        );

                        // Kontrola, zda je uživatel dostatečně blízko počáteční lokace (100 metrů)
                        if (startDistance <= 0.1) {
                            // Označení balíčku jako vyzvednutého
                            activeQuest.packagePickedUp = true;

                            // Uložení změn
                            this.saveTasks();

                            // Zobrazení notifikace o vyzvednutí balíčku
                            if (typeof addMessage !== 'undefined') {
                                addMessage(`Vyzvedli jste balíček z ${activeQuest.route.start.name}. Nyní ho doručte do ${activeQuest.route.end.name}.`, false);
                            }
                        }
                    } else {
                        // Výpočet vzdálenosti mezi uživatelem a cílovou lokací
                        const endDistance = this.calculateDistance(
                            userLocation.lat, userLocation.lng,
                            activeQuest.route.end.lat, activeQuest.route.end.lng
                        );

                        // Kontrola, zda je uživatel dostatečně blízko cílové lokace (100 metrů)
                        if (endDistance <= 0.1) {
                            isCompleted = true;
                        }
                    }
                    break;
            }

            // Dokončení questu, pokud byl splněn
            if (isCompleted) {
                this.completeDailyQuest(activeQuest.id);
            }
        }
    },

    // Výpočet vzdálenosti mezi dvěma body (v kilometrech)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Poloměr Země v kilometrech
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Vzdálenost v kilometrech
        return distance;
    },

    // Převod stupňů na radiány
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    },

    // Zobrazení dialogu úkolů
    showTasksDialog() {
        // Odstranění existujícího dialogu, pokud existuje
        const existingDialog = document.querySelector('.tasks-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'tasks-dialog';

        // Získání aktivních a dokončených úkolů
        const activeTasks = this.tasks.filter(task => task.status === 'active');
        const completedTasks = this.tasks.filter(task => task.status === 'completed');

        // Získání aktivního denního questu
        const activeQuest = this.getActiveDailyQuest();

        // Získání dokončených denních questů (posledních 5)
        const completedQuests = this.dailyQuests
            .filter(quest => quest.status === 'completed')
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, 5);

        // Vytvoření obsahu dialogu
        dialog.innerHTML = `
            <div class="tasks-dialog-header">
                <h2>Úkoly a denní questy</h2>
                <button class="tasks-dialog-close">&times;</button>
            </div>
            <div class="tasks-dialog-tabs">
                <div class="tasks-dialog-tab active" data-tab="tasks">Úkoly</div>
                <div class="tasks-dialog-tab" data-tab="quests">Denní questy</div>
                <div class="tasks-dialog-tab" data-tab="completed">Dokončené</div>
            </div>
            <div class="tasks-dialog-content">
                <div class="tasks-tab-content active" data-tab-content="tasks">
                    <div class="tasks-list">
                        ${activeTasks.length > 0 ? activeTasks.map(task => this.renderTaskItem(task)).join('') : '<p>Nemáte žádné aktivní úkoly.</p>'}
                    </div>
                </div>
                <div class="tasks-tab-content" data-tab-content="quests">
                    <div class="tasks-list">
                        ${activeQuest ? this.renderQuestItem(activeQuest) : '<p>Dnes nemáte žádný aktivní quest.</p>'}
                        <div class="quest-points">
                            <h3>Body z questů: ${this.questPoints}</h3>
                            <p>Získávejte body za plnění denních questů a úkolů.</p>
                        </div>
                    </div>
                </div>
                <div class="tasks-tab-content" data-tab-content="completed">
                    <div class="tasks-list">
                        ${completedTasks.length > 0 || completedQuests.length > 0 ?
                            [...completedTasks.map(task => this.renderTaskItem(task)),
                             ...completedQuests.map(quest => this.renderQuestItem(quest))].join('') :
                            '<p>Nemáte žádné dokončené úkoly nebo questy.</p>'}
                    </div>
                </div>
            </div>
        `;

        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);

        // Přidání event listenerů
        const closeButton = dialog.querySelector('.tasks-dialog-close');
        const tabs = dialog.querySelectorAll('.tasks-dialog-tab');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.remove();
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech tabů
                tabs.forEach(t => t.classList.remove('active'));

                // Přidání aktivní třídy na kliknutý tab
                tab.classList.add('active');

                // Zobrazení odpovídajícího obsahu
                const tabContents = dialog.querySelectorAll('.tasks-tab-content');
                tabContents.forEach(content => {
                    content.classList.remove('active');

                    if (content.getAttribute('data-tab-content') === tab.getAttribute('data-tab')) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Přidání event listenerů pro lokace
        const locationButtons = dialog.querySelectorAll('.task-location');
        locationButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lat = parseFloat(button.getAttribute('data-lat'));
                const lng = parseFloat(button.getAttribute('data-lng'));

                if (lat && lng && typeof map !== 'undefined') {
                    // Zavření dialogu
                    dialog.remove();

                    // Přesun mapy na lokaci
                    map.setView([lat, lng], 16);

                    // Zobrazení markerů úkolů
                    this.showTasksOnMap();
                }
            });
        });

        // Přidání CSS stylů
        if (!document.querySelector('link[href="task-system.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'task-system.css';
            document.head.appendChild(link);
        }
    },

    // Renderování položky úkolu
    renderTaskItem(task) {
        // Formátování data
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };

        // Výpočet zbývajícího času do deadlinu
        const getRemainingTime = (deadline) => {
            const now = new Date();
            const deadlineDate = new Date(deadline);
            const diffTime = deadlineDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 0) {
                return '<span style="color: #e74c3c;">Vypršelo</span>';
            } else if (diffDays === 1) {
                return '<span style="color: #e74c3c;">Dnes</span>';
            } else if (diffDays <= 3) {
                return `<span style="color: #f39c12;">${diffDays} dny</span>`;
            } else {
                return `${diffDays} dní`;
            }
        };

        return `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''}">
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <div class="task-status ${task.status}">${task.status === 'active' ? 'Aktivní' : 'Dokončeno'}</div>
                </div>
                <div class="task-description">${task.description}</div>
                ${task.goal ? `
                <div class="task-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(task.progress / task.goal) * 100}%"></div>
                    </div>
                    <div class="progress-text">${task.progress} / ${task.goal}</div>
                </div>
                ` : ''}
                <div class="task-reward">
                    <p>Odměna:</p>
                    <ul>
                        ${task.reward.xp ? `<li>${task.reward.xp} XP</li>` : ''}
                        ${task.reward.questPoints ? `<li>${task.reward.questPoints} bodů</li>` : ''}
                        ${task.reward.money ? `<li>${task.reward.money} Kč</li>` : ''}
                    </ul>
                </div>
                <div class="task-footer">
                    ${task.deadline ? `
                    <div class="task-deadline">
                        <i>&#x1F550;</i> ${task.status === 'active' ? getRemainingTime(task.deadline) : formatDate(task.completedAt)}
                    </div>
                    ` : ''}
                    ${task.location ? `
                    <div class="task-location" data-lat="${task.location.lat}" data-lng="${task.location.lng}">
                        <i>&#x1F4CD;</i> ${task.location.name || 'Zobrazit na mapě'}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Renderování položky questu
    renderQuestItem(quest) {
        // Formátování data
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };

        // Získání lokace podle typu questu
        let location = null;

        switch (quest.type) {
            case 'visit-location':
                location = quest.location;
                break;

            case 'find-item':
                location = quest.item.location;
                break;

            case 'deliver-package':
                location = quest.packagePickedUp ? quest.route.end : quest.route.start;
                break;
        }

        return `
            <div class="task-item quest-item ${quest.status === 'completed' ? 'completed' : ''}">
                <div class="task-header">
                    <div class="task-title">${quest.title}</div>
                    <div class="task-status ${quest.status}">${quest.status === 'active' ? 'Aktivní' : 'Dokončeno'}</div>
                </div>
                <div class="task-description">${quest.description}</div>
                <div class="quest-reward">
                    <p>Odměna:</p>
                    <ul>
                        ${quest.reward.xp ? `<li>${quest.reward.xp} XP</li>` : ''}
                        ${quest.reward.questPoints ? `<li>${quest.reward.questPoints} bodů</li>` : ''}
                    </ul>
                </div>
                <div class="task-footer">
                    <div class="task-deadline">
                        <i>&#x1F4C5;</i> ${quest.status === 'active' ? 'Dnes' : formatDate(quest.completedAt)}
                    </div>
                    ${location ? `
                    <div class="task-location" data-lat="${location.lat}" data-lng="${location.lng}">
                        <i>&#x1F4CD;</i> ${location.name || 'Zobrazit na mapě'}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    TaskSystem.init();
});
