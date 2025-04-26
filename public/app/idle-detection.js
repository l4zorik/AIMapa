/**
 * Modul pro detekci nečinnosti uživatele a nabídku práce
 * Verze 0.3.8.0
 */

const IdleDetection = {
    // Konfigurace
    config: {
        idleTime: 5000, // Čas nečinnosti v milisekundách (5 sekund)
        checkInterval: 1000, // Interval kontroly nečinnosti v milisekundách
        xpReward: 10, // XP odměna za reakci na nabídku práce
        moneyReward: 50 // Peněžní odměna za dokončení práce
    },

    // Stav modulu
    state: {
        isIdle: false,
        lastActivity: Date.now(),
        idleTimer: null,
        workOfferShown: false,
        idleCount: 0, // Počet detekcí nečinnosti
        workOffersAccepted: 0, // Počet přijatých nabídek práce
        workCompleted: 0 // Počet dokončených prací
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu detekce nečinnosti...');

        // Přidání event listenerů pro detekci aktivity
        this.addActivityListeners();

        // Spuštění časovače pro kontrolu nečinnosti
        this.startIdleTimer();

        console.log('Modul detekce nečinnosti byl inicializován');
    },

    // Přidání event listenerů pro detekci aktivity
    addActivityListeners() {
        // Seznam událostí, které resetují nečinnost
        const events = [
            'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart',
            'click', 'keydown', 'wheel', 'DOMMouseScroll', 'mousewheel',
            'touchmove', 'MSPointerMove', 'MSPointerDown', 'MSPointerUp'
        ];

        // Přidání event listenerů
        events.forEach(event => {
            document.addEventListener(event, () => this.resetIdleTimer(), { passive: true });
        });

        // Speciální event listener pro detekci aktivity v iframe
        window.addEventListener('message', (event) => {
            if (event.data === 'user-activity') {
                this.resetIdleTimer();
            }
        });
    },

    // Resetování časovače nečinnosti
    resetIdleTimer() {
        this.state.lastActivity = Date.now();

        // Pokud byl uživatel nečinný, zaznamenáme aktivitu
        if (this.state.isIdle) {
            this.state.isIdle = false;
            console.log('Uživatel je opět aktivní');

            // Nabídka práce zůstává zobrazená i po ukončení nečinnosti
            // Uživatel ji musí explicitně zavřít nebo přijmout
        }
    },

    // Spuštění časovače pro kontrolu nečinnosti
    startIdleTimer() {
        // Zrušení existujícího časovače
        if (this.state.idleTimer) {
            clearInterval(this.state.idleTimer);
        }

        // Vytvoření nového časovače
        this.state.idleTimer = setInterval(() => {
            this.checkIdleState();
        }, this.config.checkInterval);
    },

    // Kontrola stavu nečinnosti
    checkIdleState() {
        const now = Date.now();
        const idleTime = now - this.state.lastActivity;

        // Pokud je uživatel nečinný déle než nastavený čas a není již zobrazena nabídka práce
        if (idleTime >= this.config.idleTime && !this.state.isIdle && !this.state.workOfferShown) {
            this.state.isIdle = true;
            this.state.idleCount++;
            console.log('Uživatel je nečinný');

            // Zobrazení nabídky práce
            this.showWorkOffer();
        }
    },

    // Zobrazení nabídky práce
    showWorkOffer() {
        // Kontrola, zda již není zobrazena nabídka práce
        if (this.state.workOfferShown) {
            return;
        }

        // Nastavení příznaku zobrazení nabídky práce
        this.state.workOfferShown = true;

        // Vytvoření elementu pro nabídku práce
        const workOffer = document.createElement('div');
        workOffer.id = 'workOffer';
        workOffer.className = 'work-offer';

        // Generování náhodné práce
        const work = this.getRandomWork();

        // Nastavení obsahu nabídky práce
        workOffer.innerHTML = `
            <div class="work-offer-header">
                <div class="work-offer-title">
                    <i class="icon">💼</i> Nabídka práce
                </div>
                <button class="work-offer-close">&times;</button>
            </div>
            <div class="work-offer-content">
                <div class="work-offer-notification">
                    <i class="icon">ℹ️</i> Tato nabídka zůstane zobrazena, dokud ji nepřijmete nebo nezavřete.
                </div>
                <h3>${work.title}</h3>
                <p>${work.description}</p>
                <div class="work-offer-details">
                    <div class="work-offer-detail">
                        <i class="icon">⏱️</i> Trvání: ${work.duration} min
                    </div>
                    <div class="work-offer-detail">
                        <i class="icon">💰</i> Odměna: ${work.reward} Kč
                    </div>
                    <div class="work-offer-detail">
                        <i class="icon">⭐</i> Odměna XP: ${work.xpReward} XP
                    </div>
                </div>
                <div class="work-offer-actions">
                    <button class="work-offer-accept">Přijmout práci</button>
                    <button class="work-offer-decline">Odmítnout</button>
                </div>
            </div>
        `;

        // Přidání nabídky práce do dokumentu
        document.body.appendChild(workOffer);

        // Animace zobrazení
        setTimeout(() => {
            workOffer.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = workOffer.querySelector('.work-offer-close');
        const acceptButton = workOffer.querySelector('.work-offer-accept');
        const declineButton = workOffer.querySelector('.work-offer-decline');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideWorkOffer();
            });
        }

        if (acceptButton) {
            acceptButton.addEventListener('click', () => {
                this.acceptWork(work);
            });
        }

        if (declineButton) {
            declineButton.addEventListener('click', () => {
                this.hideWorkOffer();
            });
        }
    },

    // Skrytí nabídky práce
    hideWorkOffer() {
        const workOffer = document.getElementById('workOffer');
        if (workOffer) {
            workOffer.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                workOffer.remove();
            }, 300);
        }

        // Resetování příznaku zobrazení nabídky práce
        this.state.workOfferShown = false;
    },

    // Přijetí práce
    acceptWork(work) {
        // Skrytí nabídky práce
        this.hideWorkOffer();

        // Zvýšení počtu přijatých nabídek práce
        this.state.workOffersAccepted++;

        // Přidání XP za přijetí práce
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(this.config.xpReward, 'Přijetí nabídky práce', 'jobs');
        }

        // Kontrola achievementu za přijetí nabídky práce
        this.checkWorkAchievements();

        // Simulace práce
        this.simulateWork(work);
    },

    // Simulace práce
    simulateWork(work) {
        // Vytvoření elementu pro simulaci práce
        const workSimulation = document.createElement('div');
        workSimulation.id = 'workSimulation';
        workSimulation.className = 'work-simulation';

        // Nastavení obsahu simulace práce
        workSimulation.innerHTML = `
            <div class="work-simulation-header">
                <div class="work-simulation-title">
                    <i class="icon">💼</i> ${work.title}
                </div>
                <button class="work-simulation-close">&times;</button>
            </div>
            <div class="work-simulation-content">
                <p>${work.description}</p>
                <div class="work-simulation-progress">
                    <div class="work-simulation-progress-bar">
                        <div class="work-simulation-progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="work-simulation-progress-text">0%</div>
                </div>
                <div class="work-simulation-tasks">
                    ${work.tasks.map((task, index) => `
                        <div class="work-simulation-task" data-task-id="${index}">
                            <input type="checkbox" id="task-${index}" class="work-simulation-task-checkbox">
                            <label for="task-${index}">${task}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="work-simulation-actions">
                    <button class="work-simulation-complete" disabled>Dokončit práci</button>
                </div>
            </div>
        `;

        // Přidání simulace práce do dokumentu
        document.body.appendChild(workSimulation);

        // Animace zobrazení
        setTimeout(() => {
            workSimulation.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = workSimulation.querySelector('.work-simulation-close');
        const completeButton = workSimulation.querySelector('.work-simulation-complete');
        const taskCheckboxes = workSimulation.querySelectorAll('.work-simulation-task-checkbox');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideWorkSimulation();
            });
        }

        if (completeButton) {
            completeButton.addEventListener('click', () => {
                this.completeWork(work);
            });
        }

        // Event listenery pro checkboxy úkolů
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateWorkProgress(work);
            });
        });
    },

    // Aktualizace postupu práce
    updateWorkProgress(work) {
        const workSimulation = document.getElementById('workSimulation');
        if (!workSimulation) return;

        // Získání všech checkboxů úkolů
        const taskCheckboxes = workSimulation.querySelectorAll('.work-simulation-task-checkbox');
        const completeButton = workSimulation.querySelector('.work-simulation-complete');
        const progressFill = workSimulation.querySelector('.work-simulation-progress-fill');
        const progressText = workSimulation.querySelector('.work-simulation-progress-text');

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

    // Skrytí simulace práce
    hideWorkSimulation() {
        const workSimulation = document.getElementById('workSimulation');
        if (workSimulation) {
            workSimulation.classList.remove('show');

            // Odstranění elementu po dokončení animace
            setTimeout(() => {
                workSimulation.remove();
            }, 300);
        }
    },

    // Dokončení práce
    completeWork(work) {
        // Skrytí simulace práce
        this.hideWorkSimulation();

        // Zvýšení počtu dokončených prací
        this.state.workCompleted++;

        // Přidání peněz za dokončení práce
        if (typeof MoneyIndicator !== 'undefined') {
            MoneyIndicator.addMoney(work.reward, `Odměna za práci: ${work.title}`);
        }

        // Přidání XP za dokončení práce
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addExperience(work.xpReward, `Dokončení práce: ${work.title}`, 'work');

            // Přidání XP do statistiky za redukci nečinnosti
            UserProgress.xpStats.byActivity.idleTimeReduced += work.xpReward;
            UserProgress.saveProgress();
        }

        // Kontrola achievementu za dokončení práce
        this.checkWorkAchievements();

        // Zobrazení oznámení o dokončení práce
        this.showWorkCompletionNotification(work);
    },

    // Zobrazení oznámení o dokončení práce
    showWorkCompletionNotification(work) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'work-completion-notification';

        // Nastavení obsahu oznámení
        notification.innerHTML = `
            <div class="work-completion-notification-header">
                <div class="work-completion-notification-title">
                    <i class="icon">✅</i> Práce dokončena
                </div>
                <button class="work-completion-notification-close">&times;</button>
            </div>
            <div class="work-completion-notification-content">
                <h3>${work.title}</h3>
                <p>Úspěšně jste dokončili práci a získali odměnu!</p>
                <div class="work-completion-notification-rewards">
                    <div class="work-completion-notification-reward">
                        <i class="icon">💰</i> ${work.reward} Kč
                    </div>
                    <div class="work-completion-notification-reward">
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
        const closeButton = notification.querySelector('.work-completion-notification-close');
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
    },

    // Kontrola achievementů za práci
    checkWorkAchievements() {
        if (typeof UserProgress === 'undefined') return;

        // Kontrola achievementu za přijetí nabídky práce
        if (this.state.workOffersAccepted === 1) {
            UserProgress.addAchievement('job-seeker', 'Uchazeč o práci', 'Prohlédli jste si nabídky práce');
        } else if (this.state.workOffersAccepted === 5) {
            UserProgress.addAchievement('career-builder', 'Budovatel kariéry', 'Reagovali jste na 5 nabídek práce');
        }

        // Kontrola achievementu za dokončení práce
        if (this.state.workCompleted === 1) {
            UserProgress.addAchievement('professional', 'Profesionál', 'Získali jste práci');
        }

        // Kontrola achievementů za aktivitu a redukci nečinnosti
        if (UserProgress.xpStats.byActivity.idleTimeReduced >= 100) {
            UserProgress.addAchievement('active-user', 'Aktivní uživatel', 'Používali jste aplikaci bez nečinnosti po dobu 10 minut');
        }

        if (this.state.workOffersAccepted >= 5) {
            UserProgress.addAchievement('productivity-master', 'Mistr produktivity', 'Reagovali jste na 5 nabídek práce při nečinnosti');
        }

        if (this.state.workCompleted >= 10) {
            UserProgress.addAchievement('time-optimizer', 'Optimalizátor času', 'Dokončili jste 10 úkolů nabídnutých při nečinnosti');
        }

        if (UserProgress.xpStats.byActivity.idleTimeReduced >= 500) {
            UserProgress.addAchievement('efficiency-expert', 'Expert na efektivitu', 'Získali jste 500 XP za redukci nečinnosti');
        }
    },

    // Získání náhodné práce
    getRandomWork() {
        const works = [
            {
                title: 'Analýza dat',
                description: 'Analyzujte data a vytvořte report pro klienta.',
                duration: 5,
                reward: 150,
                xpReward: 30,
                tasks: [
                    'Stáhnout data z databáze',
                    'Vyčistit a připravit data',
                    'Provést analýzu',
                    'Vytvořit grafy a vizualizace',
                    'Sepsat závěrečný report'
                ]
            },
            {
                title: 'Testování webové aplikace',
                description: 'Otestujte novou webovou aplikaci a nahlaste chyby.',
                duration: 3,
                reward: 100,
                xpReward: 20,
                tasks: [
                    'Otestovat přihlášení a registraci',
                    'Zkontrolovat funkčnost formulářů',
                    'Otestovat responzivní design',
                    'Zkontrolovat kompatibilitu s prohlížeči',
                    'Sepsat report o nalezených chybách'
                ]
            },
            {
                title: 'Překlad dokumentace',
                description: 'Přeložte technickou dokumentaci z angličtiny do češtiny.',
                duration: 4,
                reward: 120,
                xpReward: 25,
                tasks: [
                    'Přečíst a pochopit originální text',
                    'Přeložit úvod a základní koncepty',
                    'Přeložit technické termíny',
                    'Přeložit příklady a ukázky kódu',
                    'Zkontrolovat pravopis a gramatiku'
                ]
            },
            {
                title: 'Návrh loga',
                description: 'Vytvořte logo pro novou společnost v oblasti IT.',
                duration: 6,
                reward: 200,
                xpReward: 40,
                tasks: [
                    'Prozkoumat konkurenci a trendy',
                    'Vytvořit 3 koncepty loga',
                    'Vybrat nejlepší koncept a doladit detaily',
                    'Připravit logo v různých formátech',
                    'Vytvořit jednoduchý brand manuál'
                ]
            },
            {
                title: 'Správa sociálních sítí',
                description: 'Vytvořte a naplánujte příspěvky na sociální sítě pro klienta.',
                duration: 2,
                reward: 80,
                xpReward: 15,
                tasks: [
                    'Vytvořit obsahový plán na týden',
                    'Napsat texty příspěvků',
                    'Vybrat vhodné obrázky a grafiku',
                    'Naplánovat příspěvky',
                    'Připravit report o výkonnosti'
                ]
            },
            {
                title: 'Průzkum trhu',
                description: 'Proveďte průzkum trhu pro nový produkt.',
                duration: 5,
                reward: 150,
                xpReward: 30,
                tasks: [
                    'Definovat cílovou skupinu',
                    'Vytvořit dotazník',
                    'Sbírat a analyzovat data',
                    'Identifikovat klíčové trendy a potřeby',
                    'Sepsat závěrečnou zprávu'
                ]
            },
            {
                title: 'Optimalizace webu',
                description: 'Optimalizujte web pro vyhledávače a zlepšete jeho výkon.',
                duration: 4,
                reward: 130,
                xpReward: 25,
                tasks: [
                    'Analyzovat současný stav webu',
                    'Optimalizovat meta tagy a strukturu',
                    'Zlepšit rychlost načítání',
                    'Optimalizovat obrázky a média',
                    'Vytvořit report o provedených změnách'
                ]
            },
            {
                title: 'Psaní článku',
                description: 'Napište odborný článek na téma umělé inteligence.',
                duration: 3,
                reward: 100,
                xpReward: 20,
                tasks: [
                    'Provést rešerši tématu',
                    'Vytvořit osnovu článku',
                    'Napsat úvod a hlavní část',
                    'Přidat příklady a případové studie',
                    'Zkontrolovat pravopis a formátování'
                ]
            }
        ];

        // Výběr náhodné práce
        return works[Math.floor(Math.random() * works.length)];
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    if (typeof IdleDetection !== 'undefined') {
        console.log('Inicializace IdleDetection...');
        IdleDetection.init();
    } else {
        console.error('IdleDetection modul nebyl nalezen!');
    }
});
