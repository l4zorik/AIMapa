/**
 * Modul pro systém úkolů a denních questů
 * Verze 0.3.0.7
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

    // Aktivní kroky úkolů - sleduje, který krok úkolu je aktuálně aktivní
    activeTaskSteps: {},

    // Viditelné markery úkolů na mapě
    visibleTaskMarkers: {},

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

            // Načtení aktivních kroků úkolů
            if (appState.activeTaskSteps) {
                this.activeTaskSteps = appState.activeTaskSteps;
            }

            // Inicializace aktivních kroků pro úkoly, které je nemají
            this.tasks.forEach(task => {
                if (task.steps && task.steps.length > 0 && !this.activeTaskSteps[task.id]) {
                    this.activeTaskSteps[task.id] = 0; // Nastavení prvního kroku jako aktivního
                }
            });

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

            // Uložení aktivních kroků úkolů
            appState.activeTaskSteps = this.activeTaskSteps;

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
                title: 'EXTRÉMNĚ URGENTNÍ: Sehnat peníze na nájem',
                description: 'EXTRÉMNĚ DŮLEŽITÉ! Potřebuješ sehnat 15000 Kč na zaplacení nájmu do 10 dnů, jinak přijdeš o bydlení! Toto je tvůj nejdůležitější úkol!',
                type: 'critical',
                status: 'active',
                progress: 0,
                goal: 15000,
                reward: {
                    xp: 2000,
                    questPoints: 500
                },
                location: {
                    lat: 48.8484,
                    lng: 17.1259,
                    name: 'Hodonín'
                },
                priority: 'critical',
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dní od nyní
                createdAt: new Date().toISOString(),
                isMainStoryQuest: true, // Označení jako hlavní příběhový úkol
                steps: [
                    {
                        id: 'find-job',
                        title: 'Najít práci',
                        description: 'Najdi si práci, která ti pomůže vydělat peníze na nájem.',
                        status: 'active',
                        locations: [
                            { name: 'Úřad práce', description: 'Najdi nabídky práce na úřadu práce', lat: 48.8464, lng: 17.1279, icon: '🏢' },
                            { name: 'Restaurace U Zlatého lva', description: 'Zeptej se na práci číšníka/číšnice', lat: 48.8494, lng: 17.1269, icon: '🍽️' },
                            { name: 'Taneční klub Hodonín', description: 'Zeptej se na práci v tanečním klubu', lat: 48.8534, lng: 17.1289, icon: '💃' }
                        ],
                        reward: { xp: 50 }
                    },
                    {
                        id: 'work-regularly',
                        title: 'Pravidelně pracuj',
                        description: 'Choď pravidelně do práce, abys vydělal/a dostatek peněz.',
                        status: 'inactive',
                        locations: [],
                        minEarnings: 5000, // Minimální částka, kterou je třeba vydělat pro dokončení tohoto kroku
                        reward: { xp: 100 }
                    },
                    {
                        id: 'find-additional-income',
                        title: 'Najít další zdroj příjmů',
                        description: 'Najdi další způsob, jak vydělat peníze na nájem.',
                        status: 'inactive',
                        locations: [
                            { name: 'Autobazar Hodonín', description: 'Prodej auto pro rychlý zisk', lat: 48.8514, lng: 17.1319, icon: '🚗' }
                        ],
                        reward: { xp: 150 }
                    },
                    {
                        id: 'pay-rent',
                        title: 'Zaplatit nájem',
                        description: 'Zaplať nájem ve výši 15000 Kč.',
                        status: 'inactive',
                        locations: [
                            { name: 'Banka', description: 'Zaplať nájem přes bankovní převod', lat: 48.8484, lng: 17.1259, icon: '🏦' }
                        ],
                        reward: { xp: 200 }
                    }
                ],
                moneyLocations: [
                    { name: 'Autobazar Hodonín', description: 'Prodej auta za 290000-380000 Kč', lat: 48.8514, lng: 17.1319, amount: 290000 },
                    { name: 'Taneční klub Hodonín', description: 'Práce jako tanečnice - 5000 Kč za večer', lat: 48.8534, lng: 17.1289, amount: 5000 },
                    { name: 'Úřad práce', description: 'Podpora v nezaměstnanosti - 3500 Kč měsíčně', lat: 48.8464, lng: 17.1279, amount: 3500 },
                    { name: 'Restaurace U Zlatého lva', description: 'Práce číšníka/číšnice - 150 Kč/hod', lat: 48.8494, lng: 17.1269, amount: 150 }
                ]
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
        // Inicializace kroků úkolu, pokud existují
        if (task.steps && task.steps.length > 0) {
            // Nastavení prvního kroku jako aktivního
            this.activeTaskSteps[task.id] = 0;

            // Nastavení prvního kroku jako aktivního a ostatních jako neaktivních
            task.steps.forEach((step, index) => {
                step.status = index === 0 ? 'active' : 'inactive';
            });
        }

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

    // Získání aktivního kroku úkolu
    getActiveTaskStep(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task || !task.steps || task.steps.length === 0) return null;

        const activeStepIndex = this.activeTaskSteps[taskId] || 0;
        return task.steps[activeStepIndex];
    },

    // Přechod na další krok úkolu
    advanceTaskStep(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (!task || !task.steps || task.steps.length === 0) return false;

        const currentStepIndex = this.activeTaskSteps[taskId] || 0;
        const currentStep = task.steps[currentStepIndex];

        // Označení aktuálního kroku jako dokončeného
        currentStep.status = 'completed';
        currentStep.completedAt = new Date().toISOString();

        // Přidání odměny za krok
        if (currentStep.reward) {
            // Přidání XP
            if (currentStep.reward.xp && typeof UserProgress !== 'undefined') {
                UserProgress.addXP(currentStep.reward.xp, `Dokončení kroku úkolu: ${currentStep.title}`);
            }

            // Přidání peněz
            if (currentStep.reward.money && typeof MoneyIndicator !== 'undefined') {
                MoneyIndicator.addMoney(currentStep.reward.money, `Odměna za krok úkolu: ${currentStep.title}`);
            }
        }

        // Kontrola, zda existuje další krok
        if (currentStepIndex < task.steps.length - 1) {
            // Přechod na další krok
            this.activeTaskSteps[taskId] = currentStepIndex + 1;

            // Aktivace dalšího kroku
            task.steps[currentStepIndex + 1].status = 'active';

            // Uložení změn
            this.saveTasks();

            // Zobrazení notifikace o dokončení kroku
            if (typeof addMessage !== 'undefined') {
                addMessage(`Krok úkolu dokončen: ${currentStep.title}`, false);
                addMessage(`Nový krok úkolu: ${task.steps[currentStepIndex + 1].title}`, false);
            }

            return true;
        } else {
            // Dokončení celého úkolu
            this.completeTask(taskId);
            return true;
        }
    },

    // Dokončení úkolu
    completeTask(taskId) {
        // Nalezení úkolu podle ID
        const task = this.tasks.find(task => task.id === taskId);

        if (task && task.status !== 'completed') {
            // Označení úkolu jako dokončeného
            task.status = 'completed';
            task.completedAt = new Date().toISOString();

            // Označení všech kroků jako dokončených
            if (task.steps && task.steps.length > 0) {
                task.steps.forEach(step => {
                    if (step.status !== 'completed') {
                        step.status = 'completed';
                        step.completedAt = new Date().toISOString();
                    }
                });
            }

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
                // Kontrola, zda úkol má kroky
                if (task.steps && task.steps.length > 0) {
                    // Získání aktivního kroku
                    const activeStepIndex = this.activeTaskSteps[task.id] || 0;
                    const activeStep = task.steps[activeStepIndex];

                    // Kontrola, zda je krok aktivní a má lokace
                    if (activeStep && activeStep.status === 'active' && activeStep.locations && activeStep.locations.length > 0) {
                        // Přidání markerů pro všechny lokace kroku
                        activeStep.locations.forEach((location, index) => {
                            // Vytvoření ikony pro marker s pořadovým číslem
                            const taskIcon = L.divIcon({
                                className: 'task-marker',
                                html: `<div class="task-marker-icon step-marker">
                                    <div class="marker-number">${index + 1}</div>
                                    <i class="task-icon">${location.icon || '📍'}</i>
                                </div>`,
                                iconSize: [40, 40],
                                iconAnchor: [20, 40]
                            });

                            // Vytvoření markeru
                            const marker = L.marker([location.lat, location.lng], { icon: taskIcon })
                                .addTo(map)
                                .bindPopup(`
                                    <div class="task-popup">
                                        <h3>${task.title} - Krok ${activeStepIndex + 1}/${task.steps.length}</h3>
                                        <h4>${activeStep.title}</h4>
                                        <div class="task-step-details">
                                            <p>${activeStep.description}</p>
                                            <div class="location-info">
                                                <p><strong>${location.name}</strong> (Bod ${index + 1}/${activeStep.locations.length})</p>
                                                <p>${location.description}</p>
                                                <div class="coordinates-display">
                                                    <p>Souřadnice: <span class="coordinate-value">${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</span>
                                                    <button class="copy-coordinates-btn" data-lat="${location.lat}" data-lng="${location.lng}">Kopírovat</button></p>
                                                </div>
                                            </div>
                                        </div>
                                        ${task.goal ? `
                                        <div class="task-progress">
                                            <h4>Celkový postup úkolu:</h4>
                                            <div class="progress-bar">
                                                <div class="progress-fill" style="width: ${(task.progress / task.goal) * 100}%"></div>
                                            </div>
                                            <div class="progress-text">${task.progress} / ${task.goal}</div>
                                        </div>
                                        ` : ''}
                                        <div class="task-reward">
                                            <p>Odměna za krok:</p>
                                            <ul>
                                                ${activeStep.reward && activeStep.reward.xp ? `<li>${activeStep.reward.xp} XP</li>` : ''}
                                                ${activeStep.reward && activeStep.reward.money ? `<li>${activeStep.reward.money} Kč</li>` : ''}
                                            </ul>
                                        </div>
                                        <div class="task-actions">
                                            <button class="show-all-steps-btn" data-task-id="${task.id}">Zobrazit všechny body úkolu</button>
                                        </div>
                                    </div>
                                `);

                            // Přidání markeru do pole
                            taskMarkers.push(marker);

                            // Uložení markeru do viditelných markerů
                            if (!this.visibleTaskMarkers[task.id]) {
                                this.visibleTaskMarkers[task.id] = [];
                            }
                            this.visibleTaskMarkers[task.id].push({
                                marker,
                                location,
                                stepIndex: activeStepIndex
                            });
                        });

                        // Vytvoření cesty mezi lokacemi, pokud jich je více
                        if (activeStep.locations.length > 1 && typeof L.Routing !== 'undefined') {
                            // Vytvoření pole bodů pro cestu
                            const waypoints = activeStep.locations.map(loc => L.latLng(loc.lat, loc.lng));

                            // Vytvoření cesty
                            const route = L.Routing.control({
                                waypoints,
                                routeWhileDragging: false,
                                showAlternatives: false,
                                fitSelectedRoutes: false,
                                show: false,
                                lineOptions: {
                                    styles: [
                                        { color: '#3498db', opacity: 0.7, weight: 5 }
                                    ]
                                }
                            }).addTo(map);

                            // Přidání cesty do pole markerů
                            taskMarkers.push(route);
                        }
                    }
                } else if (task.location) {
                    // Zpětná kompatibilita pro úkoly bez kroků
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

        // Event listener pro zobrazení všech kroků úkolu
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('show-all-steps-btn')) {
                const taskId = e.target.dataset.taskId;
                if (taskId && typeof map !== 'undefined') {
                    this.showAllTaskSteps(taskId, map);
                }
            }

            // Event listener pro návrat k aktivnímu kroku
            if (e.target.classList.contains('return-to-active-step-btn')) {
                const taskId = e.target.dataset.taskId;
                if (taskId && typeof map !== 'undefined') {
                    // Odstranění existujících markerů
                    this.removeTaskMarkers();

                    // Zobrazení markerů úkolů
                    this.showTasksOnMap();

                    // Nalezení úkolu podle ID
                    const task = this.tasks.find(task => task.id === taskId);

                    if (task && task.steps && task.steps.length > 0) {
                        // Získání aktivního kroku
                        const activeStepIndex = this.activeTaskSteps[taskId] || 0;
                        const activeStep = task.steps[activeStepIndex];

                        // Kontrola, zda je krok aktivní a má lokace
                        if (activeStep && activeStep.status === 'active' && activeStep.locations && activeStep.locations.length > 0) {
                            // Přizpůsobení mapy tak, aby byly vidět všechny markery aktivního kroku
                            const bounds = L.latLngBounds(activeStep.locations.map(loc => [loc.lat, loc.lng]));
                            map.fitBounds(bounds, { padding: [50, 50] });
                        }
                    }
                }
            }

            // Event listener pro kopírování souřadnic
            if (e.target.classList.contains('copy-coordinates-btn')) {
                const lat = e.target.dataset.lat;
                const lng = e.target.dataset.lng;

                if (lat && lng) {
                    const coordText = `${lat}, ${lng}`;

                    // Kopírování do schránky
                    navigator.clipboard.writeText(coordText)
                        .then(() => {
                            // Změna textu tlačítka na potvrzení
                            const originalText = e.target.textContent;
                            e.target.textContent = 'Zkopírováno!';
                            e.target.style.backgroundColor = '#27ae60';

                            // Vrácení původního textu po 2 sekundách
                            setTimeout(() => {
                                e.target.textContent = originalText;
                                e.target.style.backgroundColor = '';
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Chyba při kopírování souřadnic:', err);

                            // Alternativní metoda kopírování pro starší prohlížeče
                            const textarea = document.createElement('textarea');
                            textarea.value = coordText;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);

                            // Změna textu tlačítka na potvrzení
                            const originalText = e.target.textContent;
                            e.target.textContent = 'Zkopírováno!';
                            e.target.style.backgroundColor = '#27ae60';

                            // Vrácení původního textu po 2 sekundách
                            setTimeout(() => {
                                e.target.textContent = originalText;
                                e.target.style.backgroundColor = '';
                            }, 2000);
                        });
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
            // Kontrola, zda úkol má kroky
            if (task.steps && task.steps.length > 0) {
                // Získání aktivního kroku
                const activeStepIndex = this.activeTaskSteps[task.id] || 0;
                const activeStep = task.steps[activeStepIndex];

                // Kontrola, zda je krok aktivní
                if (activeStep && activeStep.status === 'active') {
                    // Kontrola podle typu kroku
                    if (activeStep.locations && activeStep.locations.length > 0) {
                        // Kontrola, zda je uživatel dostatečně blízko některé z lokací kroku
                        let isNearLocation = false;
                        let nearestLocation = null;
                        let minDistance = Infinity;

                        activeStep.locations.forEach(location => {
                            const distance = this.calculateDistance(
                                userLocation.lat, userLocation.lng,
                                location.lat, location.lng
                            );

                            if (distance < minDistance) {
                                minDistance = distance;
                                nearestLocation = location;
                            }

                            // Kontrola, zda je uživatel dostatečně blízko lokace (100 metrů)
                            if (distance <= 0.1) {
                                isNearLocation = true;
                            }
                        });

                        // Pokud je uživatel blízko některé lokace, dokončíme krok
                        if (isNearLocation) {
                            // Zobrazení notifikace o navštívení lokace
                            if (typeof addMessage !== 'undefined') {
                                addMessage(`Navštívili jste lokaci: ${nearestLocation.name}`, false);
                            }

                            // Dokončení kroku a přechod na další
                            this.advanceTaskStep(task.id);
                        }
                    }

                    // Speciální kontrola pro krok "work-regularly"
                    if (activeStep.id === 'work-regularly' && activeStep.minEarnings) {
                        // Kontrola, zda uživatel vydělal dostatek peněz
                        if (task.progress >= activeStep.minEarnings) {
                            // Dokončení kroku a přechod na další
                            this.advanceTaskStep(task.id);
                        }
                    }
                }
            } else if (task.location) {
                // Zpětná kompatibilita pro úkoly bez kroků
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
                        ${activeTasks.length > 0 ? activeTasks.map(task => this.renderTaskItem(task)).join('') : `
                        <div class="no-tasks-message">
                            <div class="no-tasks-icon">📝</div>
                            <h3>Nemáte žádné aktivní úkoly</h3>
                            <p>Všechny vaše úkoly se zobrazí zde. Dokončené úkoly najdete v záložce "Dokončené".</p>
                        </div>
                        `}
                    </div>
                </div>
                <div class="tasks-tab-content" data-tab-content="quests">
                    <div class="quest-points-container">
                        <div class="quest-points">
                            <div class="quest-points-icon">🔶</div>
                            <div class="quest-points-content">
                                <div class="quest-points-value">${this.questPoints}</div>
                                <div class="quest-points-label">Body z questů</div>
                            </div>
                        </div>
                        <div class="quest-points-info">
                            <p>Získávejte body za plnění denních questů a úkolů. Body můžete využít k odemykání speciálních funkcí a odměn.</p>
                        </div>
                    </div>
                    <div class="tasks-list">
                        ${activeQuest ? this.renderQuestItem(activeQuest) : `
                        <div class="no-quest-message">
                            <div class="no-quest-icon">⭐</div>
                            <h3>Dnes nemáte žádný aktivní quest</h3>
                            <p>Denní questy se obnovují každý den. Přijďte zítra pro nový úkol a odměnu!</p>
                        </div>
                        `}
                    </div>
                </div>
                <div class="tasks-tab-content" data-tab-content="completed">
                    ${completedTasks.length > 0 || completedQuests.length > 0 ? `
                    <div class="completed-header">
                        <h3>Dokončené úkoly a questy</h3>
                        <p>Zde najdete všechny vaše splněné úkoly a denní questy.</p>
                    </div>
                    <div class="tasks-list">
                        ${[...completedTasks.map(task => this.renderTaskItem(task)),
                           ...completedQuests.map(quest => this.renderQuestItem(quest))].join('')}
                    </div>
                    ` : `
                    <div class="no-completed-message">
                        <div class="no-completed-icon">✅</div>
                        <h3>Nemáte žádné dokončené úkoly nebo questy</h3>
                        <p>Dokončené úkoly a questy se zobrazí zde. Splňte nějaký úkol nebo denní quest!</p>
                    </div>
                    `}
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
        const locationButtons = dialog.querySelectorAll('.task-location, .step-location');
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

        // Přidání CSS stylů pro body z questů
        if (!document.querySelector('link[href="task-system-quest-points.css"]')) {
            const questPointsLink = document.createElement('link');
            questPointsLink.rel = 'stylesheet';
            questPointsLink.href = 'task-system-quest-points.css';
            document.head.appendChild(questPointsLink);
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

        // Renderování kroků úkolu
        const renderTaskSteps = () => {
            if (!task.steps || task.steps.length === 0) return '';

            const activeStepIndex = this.activeTaskSteps[task.id] || 0;

            return `
                <div class="task-steps">
                    <h4>Kroky úkolu:</h4>
                    <div class="steps-list">
                        ${task.steps.map((step, index) => {
                            const isActive = index === activeStepIndex && task.status === 'active';
                            const isCompleted = step.status === 'completed' || (task.status === 'completed');

                            return `
                                <div class="step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
                                    <div class="step-number">${index + 1}</div>
                                    <div class="step-content">
                                        <div class="step-header">
                                            <div class="step-title">${step.title}</div>
                                            <div class="step-status">${isCompleted ? 'Dokončeno' : isActive ? 'Aktivní' : 'Čeká'}</div>
                                        </div>
                                        <div class="step-description">${step.description}</div>
                                        ${step.locations && step.locations.length > 0 && isActive ? `
                                            <div class="step-locations">
                                                <p>Navštivte:</p>
                                                <ul>
                                                    ${step.locations.map(loc => `
                                                        <li>
                                                            <span class="step-location" data-lat="${loc.lat}" data-lng="${loc.lng}">
                                                                ${loc.icon || '📍'} ${loc.name}
                                                            </span>
                                                        </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        ` : ''}
                                        ${step.reward ? `
                                            <div class="step-reward">
                                                <p>Odměna za krok:</p>
                                                <ul>
                                                    ${step.reward.xp ? `<li>${step.reward.xp} XP</li>` : ''}
                                                    ${step.reward.money ? `<li>${step.reward.money} Kč</li>` : ''}
                                                </ul>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
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
                ${task.steps && task.steps.length > 0 ? renderTaskSteps() : ''}
                <div class="task-reward">
                    <p>Odměna za dokončení:</p>
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
    },

    // Odstranění markerů úkolů z mapy
    removeTaskMarkers() {
        // Odstranění všech markerů
        Object.keys(this.visibleTaskMarkers).forEach(taskId => {
            const markers = this.visibleTaskMarkers[taskId];
            markers.forEach(markerInfo => {
                if (markerInfo.marker) {
                    markerInfo.marker.remove();
                }
            });
        });

        // Vyčištění pole markerů
        this.visibleTaskMarkers = {};
    },

    // Zobrazení všech kroků úkolu na mapě
    showAllTaskSteps(taskId, map) {
        // Odstranění existujících markerů
        this.removeTaskMarkers();

        // Pole pro ukládání markerů
        const taskMarkers = [];

        // Pole pro ukládání bodů pro vykreslení cesty
        const pathPoints = [];

        // Nalezení úkolu podle ID
        const task = this.tasks.find(task => task.id === taskId);

        if (!task || !task.steps || task.steps.length === 0) {
            console.error('Úkol nebyl nalezen nebo nemá žádné kroky');
            return;
        }

        // Vytvoření markerů pro všechny kroky úkolu
        task.steps.forEach((step, stepIndex) => {
            if (step.locations && step.locations.length > 0) {
                // Přidání markerů pro všechny lokace kroku
                step.locations.forEach((location, locIndex) => {
                    // Vytvoření ikony pro marker s pořadovým číslem
                    const taskIcon = L.divIcon({
                        className: 'task-marker',
                        html: `<div class="task-marker-icon step-marker ${step.status === 'completed' ? 'completed' : step.status === 'active' ? 'active' : 'inactive'}">
                            <div class="marker-step">${stepIndex + 1}</div>
                            <div class="marker-number">${locIndex + 1}</div>
                            <i class="task-icon">${location.icon || '📍'}</i>
                        </div>`,
                        iconSize: [45, 45],
                        iconAnchor: [22, 45]
                    });

                    // Vytvoření markeru
                    const marker = L.marker([location.lat, location.lng], { icon: taskIcon })
                        .addTo(map)
                        .bindPopup(`
                            <div class="task-popup">
                                <h3>${task.title}</h3>
                                <div class="step-status-indicator ${step.status}">
                                    Krok ${stepIndex + 1}/${task.steps.length}: ${step.status === 'completed' ? 'Dokončeno' : step.status === 'active' ? 'Aktivní' : 'Čeká na aktivaci'}
                                </div>
                                <h4>${step.title}</h4>
                                <div class="task-step-details">
                                    <p>${step.description}</p>
                                    <div class="location-info">
                                        <p><strong>${location.name}</strong> (Bod ${locIndex + 1}/${step.locations.length})</p>
                                        <p>${location.description}</p>
                                        <div class="coordinates-display">
                                            <p>Souřadnice: <span class="coordinate-value">${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</span>
                                            <button class="copy-coordinates-btn" data-lat="${location.lat}" data-lng="${location.lng}">Kopírovat</button></p>
                                        </div>
                                    </div>
                                </div>
                                ${step.reward ? `
                                <div class="task-reward">
                                    <p>Odměna za krok:</p>
                                    <ul>
                                        ${step.reward.xp ? `<li>${step.reward.xp} XP</li>` : ''}
                                        ${step.reward.money ? `<li>${step.reward.money} Kč</li>` : ''}
                                    </ul>
                                </div>
                                ` : ''}
                                <div class="task-actions">
                                    <button class="return-to-active-step-btn" data-task-id="${task.id}">Zpět na aktivní krok</button>
                                </div>
                            </div>
                        `);

                    // Přidání markeru do pole
                    taskMarkers.push(marker);

                    // Přidání bodu do pole pro vykreslení cesty
                    pathPoints.push([location.lat, location.lng]);
                });
            }
        });

        // Vykreslení cesty mezi body
        if (pathPoints.length > 1) {
            const taskPath = L.polyline(pathPoints, {
                color: '#3498db',
                weight: 3,
                opacity: 0.7,
                dashArray: '10, 10',
                lineCap: 'round'
            }).addTo(map);

            // Přidání šipek na cestu (pokud je k dispozici plugin L.polylineDecorator)
            if (typeof L.polylineDecorator !== 'undefined') {
                const decorator = L.polylineDecorator(taskPath, {
                    patterns: [
                        {
                            offset: 25,
                            repeat: 50,
                            symbol: L.Symbol.arrowHead({
                                pixelSize: 10,
                                polygon: false,
                                pathOptions: {
                                    color: '#3498db',
                                    weight: 3,
                                    opacity: 0.7
                                }
                            })
                        }
                    ]
                }).addTo(map);

                // Přidání dekorátoru do pole markerů
                taskMarkers.push(decorator);
            }

            // Přidání cesty do pole markerů
            taskMarkers.push(taskPath);
        }

        // Uložení markerů do objektu
        this.visibleTaskMarkers[taskId] = taskMarkers.map(marker => ({ marker }));

        // Přizpůsobení mapy tak, aby byly vidět všechny markery
        if (pathPoints.length > 0) {
            const bounds = L.latLngBounds(pathPoints);
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        return taskMarkers;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    TaskSystem.init();
});
