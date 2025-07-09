/**
 * AIMapa VoiceBot Advanced Features
 * Verze 0.3.8.6 - Pokročilé hlasové funkce
 * 
 * Tento modul rozšiřuje základní VoiceBot o pokročilé funkce:
 * - Hlasové ovládání virtuální práce
 * - Hlasové čtení achievementů
 * - Hlasové navigační pokyny
 * - Kontextové hlasové odpovědi
 * - Hlasové ovládání služeb
 */

class VoiceBotAdvanced {
    constructor() {
        this.isInitialized = false;
        this.contextualResponses = new Map();
        this.workflowStates = new Map();
        this.navigationInProgress = false;
        this.currentWorkflow = null;
        
        // Pokročilé hlasové příkazy
        this.advancedCommands = {
            // Virtuální práce
            'začni pracovat': () => this.startWorkWithVoice(),
            'dokončit úkol': () => this.completeTaskWithVoice(),
            'přidat úkol': () => this.addTaskWithVoice(),
            'stav práce': () => this.reportWorkStatus(),
            'pauza v práci': () => this.pauseWork(),
            
            // Achievementy
            'moje úspěchy': () => this.readAchievements(),
            'nové achievementy': () => this.readNewAchievements(),
            'progress': () => this.readProgress(),
            
            // Navigace
            'naviguj do práce': () => this.navigateToWork(),
            'naviguj domů': () => this.navigateHome(),
            'nejbližší restaurace': () => this.findNearestRestaurant(),
            'nejbližší čerpací stanice': () => this.findNearestGasStation(),
            
            // Služby
            'objednej jídlo': () => this.orderFood(),
            'zavolej taxi': () => this.callTaxi(),
            'najdi lékárnu': () => this.findPharmacy(),
            'otevírací doba': () => this.getOpeningHours(),
            
            // Informace
            'počasí': () => this.getWeather(),
            'čas': () => this.getCurrentTime(),
            'datum': () => this.getCurrentDate(),
            'statistiky': () => this.readStatistics()
        };
        
        // Kontextové odpovědi pro různé situace
        this.contextualTemplates = {
            workStart: [
                'Výborně! Začínáme pracovat na {task}. Odhadovaná doba dokončení je {duration} minut.',
                'Spouštím práci {task}. Budu vás informovat o postupu.',
                'Práce {task} byla zahájena. Přeji produktivní práci!'
            ],
            workComplete: [
                'Gratulace! Práce {task} byla úspěšně dokončena. Získali jste {reward}.',
                'Výborná práce! {task} je hotovo. Vaše odměna: {reward}.',
                'Úkol {task} splněn! Odměna {reward} byla přidána.'
            ],
            achievementUnlocked: [
                'Skvělé! Odemkli jste nový achievement: {name}. {description}',
                'Nový úspěch! {name} - {description}. Získáváte {reward} XP.',
                'Achievement odemčen: {name}! {description}'
            ],
            navigationStart: [
                'Navigace spuštěna. Směřujeme do {destination}. Odhadovaná doba cesty: {duration}.',
                'Trasa do {destination} vypočítana. Vzdálenost: {distance}, čas: {duration}.',
                'Začínáme navigaci do {destination}. Sledujte pokyny na mapě.'
            ]
        };
    }

    /**
     * Inicializace pokročilých funkcí
     */
    async init() {
        if (this.isInitialized) return;

        console.log('🚀 Inicializace VoiceBotAdvanced...');

        try {
            // Kontrola dostupnosti základního VoiceBot
            if (!window.VoiceBot || !window.VoiceBot.isInitialized) {
                throw new Error('Základní VoiceBot není inicializován');
            }

            // Rozšíření základních příkazů
            this.extendBasicCommands();
            
            // Nastavení event listenerů pro moduly
            this.setupModuleListeners();
            
            // Inicializace kontextových odpovědí
            this.initContextualResponses();
            
            this.isInitialized = true;
            console.log('✅ VoiceBotAdvanced byl úspěšně inicializován');
            
        } catch (error) {
            console.error('❌ Chyba při inicializaci VoiceBotAdvanced:', error);
        }
    }

    /**
     * Rozšíření základních příkazů
     */
    extendBasicCommands() {
        // Přidání pokročilých příkazů do základního VoiceBot
        Object.assign(window.VoiceBot.voiceCommands, this.advancedCommands);
        
        // Rozšíření AI odpovědí
        const originalGenerateResponse = window.VoiceBot.generateAIResponse;
        window.VoiceBot.generateAIResponse = (input) => {
            return this.generateAdvancedResponse(input) || originalGenerateResponse.call(window.VoiceBot, input);
        };
    }

    /**
     * Nastavení event listenerů pro moduly
     */
    setupModuleListeners() {
        // Poslouchání událostí z VirtualWork
        document.addEventListener('workStarted', (event) => {
            this.handleWorkStarted(event.detail);
        });

        document.addEventListener('workCompleted', (event) => {
            this.handleWorkCompleted(event.detail);
        });

        document.addEventListener('taskCompleted', (event) => {
            this.handleTaskCompleted(event.detail);
        });

        // Poslouchání událostí z Achievements
        document.addEventListener('achievementUnlocked', (event) => {
            this.handleAchievementUnlocked(event.detail);
        });

        // Poslouchání událostí z navigace
        document.addEventListener('routeCalculated', (event) => {
            this.handleRouteCalculated(event.detail);
        });
    }

    /**
     * Inicializace kontextových odpovědí
     */
    initContextualResponses() {
        // Načtení uložených kontextů
        const saved = localStorage.getItem('voicebot-contexts');
        if (saved) {
            try {
                const contexts = JSON.parse(saved);
                this.contextualResponses = new Map(contexts);
            } catch (error) {
                console.error('Chyba při načítání kontextů:', error);
            }
        }
    }

    /**
     * Generování pokročilých odpovědí
     */
    generateAdvancedResponse(input) {
        const lowercaseInput = input.toLowerCase();

        // Kontextové odpovědi na základě aktuálního stavu
        if (this.currentWorkflow) {
            return this.generateWorkflowResponse(input);
        }

        // Specifické dotazy na práci
        if (lowercaseInput.includes('kolik jsem vydělal') || lowercaseInput.includes('výdělek')) {
            return this.getEarningsReport();
        }

        // Dotazy na čas a produktivitu
        if (lowercaseInput.includes('jak dlouho pracuji') || lowercaseInput.includes('doba práce')) {
            return this.getWorkTimeReport();
        }

        // Dotazy na úkoly
        if (lowercaseInput.includes('kolik úkolů') || lowercaseInput.includes('počet úkolů')) {
            return this.getTasksReport();
        }

        // Dotazy na lokaci
        if (lowercaseInput.includes('kde jsem') || lowercaseInput.includes('moje poloha')) {
            return this.getCurrentLocation();
        }

        return null; // Nechá základní VoiceBot zpracovat
    }

    /**
     * Spuštění práce s hlasovým průvodcem
     */
    async startWorkWithVoice() {
        try {
            if (!window.VirtualWork) {
                window.VoiceBot.speak('Modul virtuální práce není dostupný.');
                return;
            }

            // Otevření dialogu práce
            window.VirtualWork.openWorkDialog();
            
            // Hlasový průvodce výběrem práce
            setTimeout(() => {
                window.VoiceBot.speak('Vyberte typ práce. Řekněte například "kancelářská práce" nebo "programování".');
                this.currentWorkflow = 'workSelection';
            }, 1000);

        } catch (error) {
            console.error('Chyba při spuštění práce:', error);
            window.VoiceBot.speak('Nepodařilo se spustit virtuální práci.');
        }
    }

    /**
     * Dokončení úkolu s hlasem
     */
    completeTaskWithVoice() {
        // Implementace dokončení úkolu
        window.VoiceBot.speak('Označuji aktuální úkol jako dokončený.');
        
        // Zde by byla logika pro dokončení úkolu
        if (window.VirtualWork && window.VirtualWork.completeCurrentTask) {
            window.VirtualWork.completeCurrentTask();
        }
    }

    /**
     * Přidání úkolu hlasem
     */
    addTaskWithVoice() {
        window.VoiceBot.speak('Řekněte název nového úkolu.');
        this.currentWorkflow = 'addTask';
        
        // Spuštění naslouchání pro název úkolu
        setTimeout(() => {
            window.VoiceBot.startListening();
        }, 2000);
    }

    /**
     * Hlášení stavu práce
     */
    reportWorkStatus() {
        try {
            // Získání informací o aktuální práci
            const workData = this.getWorkData();
            
            if (!workData.isWorking) {
                window.VoiceBot.speak('Momentálně nepracujete na žádném úkolu.');
                return;
            }

            const message = `Aktuálně pracujete na ${workData.currentTask}. ` +
                          `Dokončeno ${workData.completedTasks} z ${workData.totalTasks} úkolů. ` +
                          `Zbývající čas: ${workData.remainingTime} minut.`;
            
            window.VoiceBot.speak(message);

        } catch (error) {
            console.error('Chyba při hlášení stavu práce:', error);
            window.VoiceBot.speak('Nepodařilo se získat informace o práci.');
        }
    }

    /**
     * Čtení achievementů
     */
    readAchievements() {
        try {
            if (!window.Achievements) {
                window.VoiceBot.speak('Modul achievementů není dostupný.');
                return;
            }

            const achievements = this.getAchievementsData();
            
            if (achievements.total === 0) {
                window.VoiceBot.speak('Zatím nemáte žádné odemčené achievementy.');
                return;
            }

            const message = `Máte odemčeno ${achievements.unlocked} z ${achievements.total} achievementů. ` +
                          `Nejnovější achievement: ${achievements.latest.name}. ` +
                          `Celkem XP z achievementů: ${achievements.totalXP}.`;
            
            window.VoiceBot.speak(message);

        } catch (error) {
            console.error('Chyba při čtení achievementů:', error);
            window.VoiceBot.speak('Nepodařilo se načíst achievementy.');
        }
    }

    /**
     * Navigace do práce
     */
    navigateToWork() {
        try {
            // Získání pracovní lokace
            const workLocation = this.getWorkLocation();
            
            if (!workLocation) {
                window.VoiceBot.speak('Nemáte nastavenou pracovní lokaci. Řekněte "nastavit práci" pro konfiguraci.');
                return;
            }

            // Spuštění navigace
            this.startNavigation(workLocation);
            
            const template = this.getRandomTemplate('navigationStart');
            const message = template
                .replace('{destination}', workLocation.name)
                .replace('{distance}', workLocation.distance)
                .replace('{duration}', workLocation.duration);
            
            window.VoiceBot.speak(message);

        } catch (error) {
            console.error('Chyba při navigaci do práce:', error);
            window.VoiceBot.speak('Nepodařilo se spustit navigaci do práce.');
        }
    }

    /**
     * Objednání jídla hlasem
     */
    orderFood() {
        window.VoiceBot.speak('Otevírám službu objednání jídla. Jaký typ jídla si přejete?');
        this.currentWorkflow = 'orderFood';
        
        // Otevření food services
        if (window.FoodServices && window.FoodServices.openDialog) {
            window.FoodServices.openDialog();
        }
    }

    /**
     * Získání aktuálního času
     */
    getCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('cs-CZ', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        window.VoiceBot.speak(`Aktuální čas je ${timeString}.`);
    }

    /**
     * Získání aktuálního data
     */
    getCurrentDate() {
        const now = new Date();
        const dateString = now.toLocaleDateString('cs-CZ', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        window.VoiceBot.speak(`Dnes je ${dateString}.`);
    }

    /**
     * Čtení statistik
     */
    readStatistics() {
        try {
            const stats = this.getOverallStatistics();
            
            const message = `Vaše statistiky: ` +
                          `Celkem XP: ${stats.totalXP}, ` +
                          `Úroveň: ${stats.level}, ` +
                          `Dokončených prací: ${stats.completedWorks}, ` +
                          `Celkový výdělek: ${stats.totalEarnings} korun, ` +
                          `Odemčených achievementů: ${stats.achievements}.`;
            
            window.VoiceBot.speak(message);

        } catch (error) {
            console.error('Chyba při čtení statistik:', error);
            window.VoiceBot.speak('Nepodařilo se načíst statistiky.');
        }
    }

    /**
     * Zpracování událostí práce
     */
    handleWorkStarted(workData) {
        const template = this.getRandomTemplate('workStart');
        const message = template
            .replace('{task}', workData.task || 'úkolu')
            .replace('{duration}', workData.duration || 'neznámá');
        
        window.VoiceBot.speak(message);
    }

    handleWorkCompleted(workData) {
        const template = this.getRandomTemplate('workComplete');
        const message = template
            .replace('{task}', workData.task || 'úkol')
            .replace('{reward}', workData.reward || 'odměna');
        
        window.VoiceBot.speak(message);
    }

    handleAchievementUnlocked(achievementData) {
        const template = this.getRandomTemplate('achievementUnlocked');
        const message = template
            .replace('{name}', achievementData.name || 'Nový achievement')
            .replace('{description}', achievementData.description || '')
            .replace('{reward}', achievementData.xp || '0');
        
        window.VoiceBot.speak(message);
    }

    /**
     * Pomocné metody pro získání dat
     */
    getWorkData() {
        // Implementace získání dat o práci
        return {
            isWorking: false,
            currentTask: '',
            completedTasks: 0,
            totalTasks: 0,
            remainingTime: 0
        };
    }

    getAchievementsData() {
        // Implementace získání dat o achievementech
        return {
            total: 0,
            unlocked: 0,
            latest: { name: '' },
            totalXP: 0
        };
    }

    getWorkLocation() {
        // Implementace získání pracovní lokace
        return null;
    }

    getOverallStatistics() {
        // Implementace získání celkových statistik
        return {
            totalXP: 0,
            level: 1,
            completedWorks: 0,
            totalEarnings: 0,
            achievements: 0
        };
    }

    getRandomTemplate(category) {
        const templates = this.contextualTemplates[category];
        if (!templates || templates.length === 0) {
            return 'Akce byla provedena.';
        }
        return templates[Math.floor(Math.random() * templates.length)];
    }

    startNavigation(location) {
        // Implementace spuštění navigace
        this.navigationInProgress = true;
    }
}

// Vytvoření globální instance
window.VoiceBotAdvanced = new VoiceBotAdvanced();

// Automatická inicializace po načtení VoiceBot
document.addEventListener('DOMContentLoaded', () => {
    // Čekání na inicializaci základního VoiceBot
    const checkVoiceBot = () => {
        if (window.VoiceBot && window.VoiceBot.isInitialized) {
            setTimeout(() => {
                window.VoiceBotAdvanced.init();
            }, 500);
        } else {
            setTimeout(checkVoiceBot, 500);
        }
    };
    
    checkVoiceBot();
});
