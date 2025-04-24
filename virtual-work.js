/**
 * Modul pro virtuální práci
 * Verze 0.3.0.4
 */

class VirtualWorkClass {
    constructor() {
        // Základní nastavení
        this.isInitialized = false;
        this.workplaces = [];
        this.selectedWorkplace = null;
        this.selectedTransport = 'walking';
        this.workSettings = {
            hourlyRate: 150,
            hoursPerDay: 8,
            daysPerWeek: 5,
            breakTime: 30,
            startTime: '8:00',
            endTime: '16:30',
            educationLevel: 'high-school',
            experience: 1,
            skills: []
        };
        this.careerLevel = {
            level: 1,
            title: 'Začátečník',
            xpCurrent: 0,
            xpRequired: 100
        };
        this.statistics = {
            totalEarned: 0,
            daysWorked: 0,
            hoursWorked: 0,
            lastWorkDate: null,
            earningHistory: []
        };
        this.transportOptions = {
            walking: { icon: '🚶', name: 'Pěšky', costPerKm: 0, speedKmh: 5 },
            bicycle: { icon: '🚲', name: 'Kolo', costPerKm: 0, speedKmh: 15 },
            bus: { icon: '🚌', name: 'Autobus', costPerKm: 1.5, speedKmh: 30 },
            car: { icon: '🚗', name: 'Auto', costPerKm: 3, speedKmh: 50 },
            taxi: { icon: '🚕', name: 'Taxi', costPerKm: 15, speedKmh: 50 }
        };

        // Pracovní úkoly
        this.workTasks = [
            {
                id: 'task1',
                title: 'Administrativní práce',
                description: 'Zpracování dokumentů, vyřizování emailů a telefonátů',
                duration: 2, // hodiny
                pay: 300,
                difficulty: 'easy',
                icon: '📝',
                type: 'office',
                completed: false
            },
            {
                id: 'task2',
                title: 'Programování webové aplikace',
                description: 'Vývoj nových funkcí pro firemní webovou aplikaci',
                duration: 4,
                pay: 800,
                difficulty: 'medium',
                icon: '💻',
                type: 'programming',
                completed: false
            },
            {
                id: 'task3',
                title: 'Oprava serveru',
                description: 'Diagnostika a oprava firemního serveru',
                duration: 3,
                pay: 600,
                difficulty: 'hard',
                icon: '🔧',
                type: 'programming',
                completed: false
            },
            {
                id: 'task4',
                title: 'Příprava prezentace',
                description: 'Vytvoření prezentace pro klienta',
                duration: 2,
                pay: 400,
                difficulty: 'medium',
                icon: '📊',
                type: 'office',
                completed: false
            },
            {
                id: 'task5',
                title: 'Manuální práce ve skladu',
                description: 'Přerovnání zboží a inventura skladu',
                duration: 5,
                pay: 750,
                difficulty: 'medium',
                icon: '📦',
                type: 'manual',
                completed: false
            },
            {
                id: 'task6',
                title: 'Úklid kanceláří',
                description: 'Kompletní úklid kancelářských prostor',
                duration: 3,
                pay: 450,
                difficulty: 'easy',
                icon: '🧹',
                type: 'manual',
                completed: false
            },
            {
                id: 'task7',
                title: 'Analýza dat',
                description: 'Analýza firemních dat a vytvoření reportu',
                duration: 4,
                pay: 900,
                difficulty: 'hard',
                icon: '📊',
                type: 'office',
                completed: false
            },
            {
                id: 'task8',
                title: 'Vývoj mobilní aplikace',
                description: 'Programování nové mobilní aplikace pro klienta',
                duration: 6,
                pay: 1200,
                difficulty: 'hard',
                icon: '📱',
                type: 'programming',
                completed: false
            }
        ];

        // Vybraný úkol
        this.selectedTask = null;

        // Příkazy
        this.commands = [
            {
                id: 'cmd1',
                name: 'Chci jít do práce',
                description: 'Otevře dialog pro virtuální práci a výdělek peněz',
                category: 'Služby',
                icon: '💼',
                command: 'chci jít do práce',
                status: 'active'
            },
            {
                id: 'cmd2',
                name: 'Zaměřit bod',
                description: 'Zobrazí dialog pro zaměření bodu na mapě',
                category: 'Mapa',
                icon: '🔍',
                command: 'zaměřit bod',
                status: 'active'
            },
            {
                id: 'cmd3',
                name: 'Veřejná doprava',
                description: 'Vyhledá spojení veřejnou dopravou',
                category: 'Služby',
                icon: '🚌',
                command: 'veřejná doprava',
                status: 'active'
            },
            {
                id: 'cmd4',
                name: 'Taxi služby',
                description: 'Zobrazí dostupné taxi služby v okolí',
                category: 'Služby',
                icon: '🚕',
                command: 'taxi',
                status: 'active'
            },
            {
                id: 'cmd5',
                name: 'Jídlo a pití',
                description: 'Vyhledá restaurace a bary v okolí',
                category: 'Služby',
                icon: '🍔',
                command: 'jídlo',
                status: 'active'
            },
            {
                id: 'cmd6',
                name: 'Lékař',
                description: 'Vyhledá lékaře v okolí',
                category: 'Služby',
                icon: '👨‍⚕️',
                command: 'lékař',
                status: 'active'
            },
            {
                id: 'cmd7',
                name: 'Zubař',
                description: 'Vyhledá zubaře v okolí',
                category: 'Služby',
                icon: '🦷',
                command: 'zubař',
                status: 'active'
            },
            {
                id: 'cmd8',
                name: 'Úřad práce',
                description: 'Informace o úřadu práce',
                category: 'Služby',
                icon: '🏢',
                command: 'úřad práce',
                status: 'active'
            },
            {
                id: 'cmd9',
                name: 'Rap',
                description: 'Spustí rapové akce',
                category: 'Zábava',
                icon: '🎤',
                command: 'rap',
                status: 'active'
            },
            {
                id: 'cmd10',
                name: 'Otevírací doba',
                description: 'Zobrazí otevírací doby obchodů v Hodoníně',
                category: 'Služby',
                icon: '🕒',
                command: 'oteviracidoba',
                status: 'active'
            }
        ];
    }

    /**
     * Inicializace modulu
     */
    init() {
        if (this.isInitialized) return;

        // Načtení dat z localStorage
        this.loadData();

        // Přidání CSS
        this.loadStyles();

        // Přidání event listenerů
        this.setupEventListeners();

        // Označení jako inicializovaný
        this.isInitialized = true;

        console.log('VirtualWork: Modul byl inicializován');
    }

    /**
     * Načtení dat z localStorage
     */
    loadData() {
        // Načtení pracovišť
        const savedWorkplaces = JSON.parse(localStorage.getItem('workplaces')) || [];
        this.workplaces = savedWorkplaces;

        // Načtení statistik
        const savedStats = JSON.parse(localStorage.getItem('virtualWorkStats')) || null;
        if (savedStats) {
            this.statistics = savedStats;
        }

        // Načtení kariérního postupu
        const savedCareer = JSON.parse(localStorage.getItem('virtualWorkCareer')) || null;
        if (savedCareer) {
            this.careerLevel = savedCareer;
        }

        // Načtení nastavení práce
        const savedSettings = JSON.parse(localStorage.getItem('virtualWorkSettings')) || null;
        if (savedSettings) {
            this.workSettings = savedSettings;
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
     * Nastavení event listenerů
     */
    setupEventListeners() {
        // Poslech na události přidání peněz
        document.addEventListener('moneyAdded', (e) => {
            if (e.detail && e.detail.source === 'virtualWork') {
                this.updateStatistics(e.detail.amount);
            }
        });
    }

    /**
     * Otevření dialogu virtuální práce
     */
    openWorkDialog() {
        // Kontrola, zda je dialog již otevřený
        if (document.querySelector('.virtual-work-dialog')) return;

        // Vytvoření dialogu
        const dialog = this.createWorkDialog();
        document.body.appendChild(dialog);

        // Přidání event listenerů
        this.setupDialogEvents(dialog);

        // Animace otevření
        setTimeout(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
    }

    /**
     * Vytvoření dialogu virtuální práce
     */
    createWorkDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog';
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
        dialog.style.transition = 'all 0.3s ease';

        // Základní struktura dialogu
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2><i class="fas fa-briefcase"></i> Virtuální cesta do práce</h2>
                <button class="virtual-work-close">&times;</button>
            </div>

            <div class="virtual-work-tabs">
                <div class="virtual-work-tab active" data-tab="workplace">
                    <i class="fas fa-building"></i> Pracoviště
                </div>
                <div class="virtual-work-tab" data-tab="tasks">
                    <i class="fas fa-tasks"></i> Úkoly
                </div>
                <div class="virtual-work-tab" data-tab="commands">
                    <i class="fas fa-terminal"></i> Příkazy
                </div>
                <div class="virtual-work-tab" data-tab="settings">
                    <i class="fas fa-sliders-h"></i> Nastavení
                </div>
                <div class="virtual-work-tab" data-tab="earnings">
                    <i class="fas fa-money-bill-wave"></i> Výdělek
                </div>
                <div class="virtual-work-tab" data-tab="transport">
                    <i class="fas fa-bus"></i> Doprava
                </div>
                <div class="virtual-work-tab" data-tab="statistics">
                    <i class="fas fa-chart-line"></i> Statistiky
                </div>
                <div class="virtual-work-tab" data-tab="career">
                    <i class="fas fa-award"></i> Kariéra
                </div>
            </div>

            <div class="virtual-work-content">
                <!-- Sekce Pracoviště -->
                <div class="virtual-work-section active" data-section="workplace">
                    ${this.createWorkplaceSection()}
                </div>

                <!-- Sekce Úkoly -->
                <div class="virtual-work-section" data-section="tasks">
                    ${this.createTasksSection()}
                </div>

                <!-- Sekce Příkazy -->
                <div class="virtual-work-section" data-section="commands">
                    ${this.createCommandsSection()}
                </div>

                <!-- Sekce Nastavení -->
                <div class="virtual-work-section" data-section="settings">
                    ${this.createSettingsSection()}
                </div>

                <!-- Sekce Výdělek -->
                <div class="virtual-work-section" data-section="earnings">
                    ${this.createEarningsSection()}
                </div>

                <!-- Sekce Doprava -->
                <div class="virtual-work-section" data-section="transport">
                    ${this.createTransportSection()}
                </div>

                <!-- Sekce Statistiky -->
                <div class="virtual-work-section" data-section="statistics">
                    ${this.createStatisticsSection()}
                </div>

                <!-- Sekce Kariéra -->
                <div class="virtual-work-section" data-section="career">
                    ${this.createCareerSection()}
                </div>
            </div>

            <div class="virtual-work-actions">
                <div class="virtual-work-status">
                    <div class="status-indicator"></div>
                    <div class="status-text">Připraveno k práci</div>
                </div>
                <div class="virtual-work-buttons">
                    <button class="virtual-work-btn secondary" id="virtual-work-cancel">
                        <i class="fas fa-times"></i> Zrušit
                    </button>
                    <button class="virtual-work-btn primary" id="virtual-work-start">
                        <i class="fas fa-play"></i> Začít pracovat
                    </button>
                </div>
            </div>
        `;

        return dialog;
    }

    /**
     * Vytvoření sekce pracoviště
     */
    createWorkplaceSection() {
        // Pokud nemáme žádné pracoviště, zobrazíme výzvu k přidání
        if (this.workplaces.length === 0) {
            return `
                <div class="workplace-empty">
                    <div class="workplace-empty-icon">🏢</div>
                    <h3>Nemáte žádné pracoviště</h3>
                    <p>Přidejte své první pracoviště pro začátek virtuální práce.</p>
                    <button class="virtual-work-btn primary" id="add-workplace-btn">
                        <i class="fas fa-plus"></i> Přidat pracoviště
                    </button>
                </div>
            `;
        }

        // Najdeme nejbližší pracoviště
        const nearestWorkplace = this.findNearestWorkplace();
        this.selectedWorkplace = nearestWorkplace;

        // Ikona podle typu práce
        const icon = nearestWorkplace.type === 'office' ? '💼' :
                     nearestWorkplace.type === 'programming' ? '💻' : '🔨';

        // Typ práce v češtině
        const typeName = nearestWorkplace.type === 'office' ? 'Kancelářská práce' :
                         nearestWorkplace.type === 'programming' ? 'Programování' : 'Manuální práce';

        return `
            <div class="workplace-info">
                <div class="workplace-header">
                    <div class="workplace-icon">${icon}</div>
                    <div class="workplace-title">
                        <h3>${nearestWorkplace.name}</h3>
                        <p>${typeName}</p>
                    </div>
                </div>

                <div class="workplace-details">
                    <div class="workplace-detail">
                        <div class="workplace-detail-label">Vzdálenost</div>
                        <div class="workplace-detail-value">${nearestWorkplace.distance.toFixed(2)} km</div>
                    </div>
                    <div class="workplace-detail">
                        <div class="workplace-detail-label">Denní výdělek</div>
                        <div class="workplace-detail-value">${nearestWorkplace.pay} Kč</div>
                    </div>
                    <div class="workplace-detail">
                        <div class="workplace-detail-label">Hodinová sazba</div>
                        <div class="workplace-detail-value">${Math.round(nearestWorkplace.pay / 8)} Kč/h</div>
                    </div>
                    <div class="workplace-detail">
                        <div class="workplace-detail-label">Adresa</div>
                        <div class="workplace-detail-value">GPS: ${nearestWorkplace.lat.toFixed(5)}, ${nearestWorkplace.lng.toFixed(5)}</div>
                    </div>
                </div>

                <div class="workplace-map" id="workplace-map"></div>

                <div class="workplace-actions" style="margin-top: 15px; text-align: right;">
                    <button class="virtual-work-btn secondary" id="change-workplace-btn">
                        <i class="fas fa-exchange-alt"></i> Změnit pracoviště
                    </button>
                    <button class="virtual-work-btn secondary" id="add-workplace-btn">
                        <i class="fas fa-plus"></i> Přidat nové
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Vytvoření sekce nastavení
     */
    createSettingsSection() {
        return `
            <div class="work-settings">
                <div class="settings-group">
                    <h4><i class="fas fa-money-bill-alt"></i> Finanční nastavení</h4>
                    <div class="settings-row">
                        <div class="settings-field">
                            <label for="hourly-rate">Hodinová sazba</label>
                            <div class="input-with-unit">
                                <input type="number" id="hourly-rate" class="has-unit" value="${this.workSettings.hourlyRate}" min="100" max="1000" step="10">
                                <span class="input-unit">Kč/h</span>
                            </div>
                        </div>
                        <div class="settings-field">
                            <label for="bonus-percentage">Bonus za výkon</label>
                            <div class="input-with-unit">
                                <input type="number" id="bonus-percentage" class="has-unit" value="10" min="0" max="50" step="5">
                                <span class="input-unit">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-group">
                    <h4><i class="fas fa-clock"></i> Pracovní doba</h4>
                    <div class="settings-row">
                        <div class="settings-field">
                            <label for="hours-per-day">Hodin denně</label>
                            <input type="number" id="hours-per-day" value="${this.workSettings.hoursPerDay}" min="1" max="12" step="0.5">
                        </div>
                        <div class="settings-field">
                            <label for="days-per-week">Dnů v týdnu</label>
                            <input type="number" id="days-per-week" value="${this.workSettings.daysPerWeek}" min="1" max="7" step="1">
                        </div>
                    </div>
                    <div class="settings-row">
                        <div class="settings-field">
                            <label for="start-time">Začátek práce</label>
                            <input type="time" id="start-time" value="${this.workSettings.startTime}">
                        </div>
                        <div class="settings-field">
                            <label for="end-time">Konec práce</label>
                            <input type="time" id="end-time" value="${this.workSettings.endTime}">
                        </div>
                        <div class="settings-field">
                            <label for="break-time">Přestávka (min)</label>
                            <input type="number" id="break-time" value="${this.workSettings.breakTime}" min="0" max="120" step="5">
                        </div>
                    </div>
                </div>

                <div class="settings-group">
                    <h4><i class="fas fa-user-graduate"></i> Vzdělání a zkušenosti</h4>
                    <div class="settings-row">
                        <div class="settings-field">
                            <label for="education-level">Úroveň vzdělání</label>
                            <select id="education-level">
                                <option value="elementary" ${this.workSettings.educationLevel === 'elementary' ? 'selected' : ''}>Základní</option>
                                <option value="high-school" ${this.workSettings.educationLevel === 'high-school' ? 'selected' : ''}>Středoškolské</option>
                                <option value="bachelor" ${this.workSettings.educationLevel === 'bachelor' ? 'selected' : ''}>Bakalářské</option>
                                <option value="master" ${this.workSettings.educationLevel === 'master' ? 'selected' : ''}>Magisterské</option>
                                <option value="phd" ${this.workSettings.educationLevel === 'phd' ? 'selected' : ''}>Doktorské</option>
                            </select>
                        </div>
                        <div class="settings-field">
                            <label for="experience-years">Roky zkušeností</label>
                            <input type="number" id="experience-years" value="${this.workSettings.experience}" min="0" max="50" step="1">
                        </div>
                    </div>
                </div>

                <div class="settings-actions" style="margin-top: 20px; text-align: right;">
                    <button class="virtual-work-btn primary" id="save-settings-btn">
                        <i class="fas fa-save"></i> Uložit nastavení
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Vytvoření sekce výdělku
     */
    createEarningsSection() {
        // Výpočet základních hodnot
        const hourlyRate = this.workSettings.hourlyRate;
        const hoursPerDay = this.workSettings.hoursPerDay;
        const daysPerWeek = this.workSettings.daysPerWeek;

        const dailyEarnings = hourlyRate * hoursPerDay;
        const weeklyEarnings = dailyEarnings * daysPerWeek;
        const monthlyEarnings = weeklyEarnings * 4.33; // Průměrný počet týdnů v měsíci
        const yearlyEarnings = monthlyEarnings * 12;

        return `
            <div class="earnings-calculator">
                <div class="calculator-result">
                    <div class="calculator-title">Váš odhadovaný výdělek</div>
                    <div class="calculator-amount">${Math.round(monthlyEarnings).toLocaleString()} Kč</div>
                    <div class="calculator-period">za měsíc</div>

                    <div class="calculator-details">
                        <div class="calculator-detail">
                            <div class="calculator-detail-label">Denně</div>
                            <div class="calculator-detail-value">${Math.round(dailyEarnings).toLocaleString()} Kč</div>
                        </div>
                        <div class="calculator-detail">
                            <div class="calculator-detail-label">Týdně</div>
                            <div class="calculator-detail-value">${Math.round(weeklyEarnings).toLocaleString()} Kč</div>
                        </div>
                        <div class="calculator-detail">
                            <div class="calculator-detail-label">Ročně</div>
                            <div class="calculator-detail-value">${Math.round(yearlyEarnings).toLocaleString()} Kč</div>
                        </div>
                    </div>
                </div>

                <div class="calculator-options">
                    <div class="calculator-slider">
                        <div class="calculator-slider-header">
                            <div class="calculator-slider-label">Hodinová sazba</div>
                            <div class="calculator-slider-value" id="hourly-rate-value">${hourlyRate} Kč/h</div>
                        </div>
                        <input type="range" class="calculator-slider-input" id="hourly-rate-slider"
                               min="100" max="1000" step="10" value="${hourlyRate}">
                        <div class="calculator-slider-marks">
                            <div class="calculator-slider-mark">100 Kč</div>
                            <div class="calculator-slider-mark">400 Kč</div>
                            <div class="calculator-slider-mark">700 Kč</div>
                            <div class="calculator-slider-mark">1000 Kč</div>
                        </div>
                    </div>

                    <div class="calculator-slider">
                        <div class="calculator-slider-header">
                            <div class="calculator-slider-label">Hodin denně</div>
                            <div class="calculator-slider-value" id="hours-per-day-value">${hoursPerDay} h</div>
                        </div>
                        <input type="range" class="calculator-slider-input" id="hours-per-day-slider"
                               min="1" max="12" step="0.5" value="${hoursPerDay}">
                        <div class="calculator-slider-marks">
                            <div class="calculator-slider-mark">1 h</div>
                            <div class="calculator-slider-mark">4 h</div>
                            <div class="calculator-slider-mark">8 h</div>
                            <div class="calculator-slider-mark">12 h</div>
                        </div>
                    </div>

                    <div class="calculator-slider">
                        <div class="calculator-slider-header">
                            <div class="calculator-slider-label">Dnů v týdnu</div>
                            <div class="calculator-slider-value" id="days-per-week-value">${daysPerWeek} dnů</div>
                        </div>
                        <input type="range" class="calculator-slider-input" id="days-per-week-slider"
                               min="1" max="7" step="1" value="${daysPerWeek}">
                        <div class="calculator-slider-marks">
                            <div class="calculator-slider-mark">1</div>
                            <div class="calculator-slider-mark">3</div>
                            <div class="calculator-slider-mark">5</div>
                            <div class="calculator-slider-mark">7</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vytvoření sekce dopravy
     */
    createTransportSection() {
        // Výpočet nákladů na dopravu pro vybrané pracoviště
        const workplace = this.selectedWorkplace;
        let transportOptionsHtml = '';
        let transportCostsHtml = '';

        if (workplace) {
            // Vytvoření možností dopravy
            Object.entries(this.transportOptions).forEach(([key, option]) => {
                const isSelected = key === this.selectedTransport;
                const travelTime = Math.round((workplace.distance / option.speedKmh) * 60); // v minutách
                const cost = Math.round(workplace.distance * option.costPerKm);

                transportOptionsHtml += `
                    <div class="transport-option ${isSelected ? 'selected' : ''}" data-transport="${key}">
                        <div class="transport-icon">${option.icon}</div>
                        <div class="transport-name">${option.name}</div>
                        <div class="transport-detail">${travelTime} min</div>
                    </div>
                `;

                if (isSelected) {
                    transportCostsHtml = `
                        <div class="transport-costs">
                            <h4>Náklady na dopravu</h4>
                            <div class="transport-cost-item">
                                <div class="transport-cost-label">Vzdálenost (jednosměrně)</div>
                                <div class="transport-cost-value">${workplace.distance.toFixed(2)} km</div>
                            </div>
                            <div class="transport-cost-item">
                                <div class="transport-cost-label">Doba cesty (jednosměrně)</div>
                                <div class="transport-cost-value">${travelTime} min</div>
                            </div>
                            <div class="transport-cost-item">
                                <div class="transport-cost-label">Náklady na 1 km</div>
                                <div class="transport-cost-value">${option.costPerKm} Kč</div>
                            </div>
                            <div class="transport-cost-item">
                                <div class="transport-cost-label">Náklady na cestu (jednosměrně)</div>
                                <div class="transport-cost-value">${cost} Kč</div>
                            </div>
                            <div class="transport-cost-total">
                                <div class="transport-cost-label">Denní náklady (tam i zpět)</div>
                                <div class="transport-cost-value">${cost * 2} Kč</div>
                            </div>
                        </div>
                    `;
                }
            });
        }

        return `
            <div class="transport-options">
                <h4>Způsob dopravy do práce</h4>
                <div class="transport-selection">
                    ${transportOptionsHtml}
                </div>

                ${transportCostsHtml}
            </div>
        `;
    }

    /**
     * Vytvoření sekce statistik
     */
    createStatisticsSection() {
        return `
            <div class="work-statistics">
                <div class="statistics-summary">
                    <div class="statistic-card">
                        <div class="statistic-value">${Math.round(this.statistics.totalEarned).toLocaleString()} Kč</div>
                        <div class="statistic-label">Celkový výdělek</div>
                    </div>
                    <div class="statistic-card">
                        <div class="statistic-value">${this.statistics.daysWorked}</div>
                        <div class="statistic-label">Odpracovaných dnů</div>
                    </div>
                    <div class="statistic-card">
                        <div class="statistic-value">${this.statistics.hoursWorked}</div>
                        <div class="statistic-label">Odpracovaných hodin</div>
                    </div>
                    <div class="statistic-card">
                        <div class="statistic-value">${this.statistics.lastWorkDate ? new Date(this.statistics.lastWorkDate).toLocaleDateString() : 'Nikdy'}</div>
                        <div class="statistic-label">Poslední práce</div>
                    </div>
                </div>

                <div class="statistics-chart">
                    <h4>Historie výdělků</h4>
                    <div class="chart-container" id="earnings-chart">
                        <!-- Graf bude vykreslen pomocí JavaScript -->
                        <div style="text-align: center; padding: 50px 0; color: #6c757d;">
                            Graf historie výdělků bude zobrazen zde
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vytvoření sekce příkazů
     */
    createCommandsSection() {
        // Seskupení příkazů podle kategorií
        const commandsByCategory = {};

        this.commands.forEach(cmd => {
            if (!commandsByCategory[cmd.category]) {
                commandsByCategory[cmd.category] = [];
            }
            commandsByCategory[cmd.category].push(cmd);
        });

        // Vytvoření HTML pro každou kategorii a její příkazy
        let categoriesHtml = '';

        Object.entries(commandsByCategory).forEach(([category, commands]) => {
            let commandsHtml = '';

            commands.forEach(cmd => {
                // Stav příkazu
                const statusClass = cmd.status === 'active' ? 'command-active' : 'command-inactive';
                const statusText = cmd.status === 'active' ? 'Aktivní' : 'Neaktivní';

                commandsHtml += `
                    <div class="command-item ${statusClass}" data-command-id="${cmd.id}">
                        <div class="command-icon">${cmd.icon}</div>
                        <div class="command-content">
                            <div class="command-header">
                                <div class="command-name">${cmd.name}</div>
                                <div class="command-status">${statusText}</div>
                            </div>
                            <div class="command-description">${cmd.description}</div>
                            <div class="command-text">Příkaz: <span class="command-code">${cmd.command}</span></div>
                        </div>
                        <div class="command-actions">
                            <button class="command-action-btn toggle-status" title="${cmd.status === 'active' ? 'Deaktivovat' : 'Aktivovat'}">
                                <i class="fas ${cmd.status === 'active' ? 'fa-toggle-on' : 'fa-toggle-off'}"></i>
                            </button>
                            <button class="command-action-btn edit-command" title="Upravit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="command-action-btn improve-command" title="Vylepšit">
                                <i class="fas fa-magic"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            categoriesHtml += `
                <div class="command-category">
                    <div class="category-header">
                        <h4>${category}</h4>
                        <div class="category-count">${commands.length} příkazů</div>
                    </div>
                    <div class="category-commands">
                        ${commandsHtml}
                    </div>
                </div>
            `;
        });

        return `
            <div class="commands-manager">
                <div class="commands-header">
                    <h3>Správa příkazů</h3>
                    <p>Zde můžete spravovat příkazy, které jsou dostupné v aplikaci. Můžete je aktivovat, deaktivovat, upravovat nebo vylepšovat.</p>

                    <div class="commands-actions">
                        <button class="virtual-work-btn primary" id="add-new-command-btn">
                            <i class="fas fa-plus"></i> Přidat nový příkaz
                        </button>
                        <div class="commands-search">
                            <input type="text" id="command-search" placeholder="Hledat příkazy...">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                </div>

                <div class="commands-list">
                    ${categoriesHtml}
                </div>

                <div class="commands-info">
                    <div class="info-icon"><i class="fas fa-info-circle"></i></div>
                    <div class="info-text">
                        <p><strong>Tip:</strong> Kliknutím na tlačítko "Vylepšit" můžete nechat AI navrhnout vylepšení pro daný příkaz.</p>
                        <p>Příkazy, které jsou neaktivní, nebudou dostupné v menu příkazů ani v chatu.</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Vytvoření sekce úkolů
     */
    createTasksSection() {
        // Filtrování úkolů podle typu pracoviště
        let filteredTasks = this.workTasks;

        if (this.selectedWorkplace) {
            filteredTasks = this.workTasks.filter(task => task.type === this.selectedWorkplace.type);
        }

        // Vytvoření HTML pro každý úkol
        let tasksHtml = '';

        if (filteredTasks.length === 0) {
            tasksHtml = `
                <div class="no-tasks-message">
                    <div style="font-size: 48px; margin-bottom: 20px;">📋</div>
                    <h3>Žádné dostupné úkoly</h3>
                    <p>Pro tento typ pracoviště nejsou momentálně k dispozici žádné úkoly.</p>
                </div>
            `;
        } else {
            filteredTasks.forEach(task => {
                // Obtížnost v češtině a barva
                let difficultyText, difficultyColor;

                switch (task.difficulty) {
                    case 'easy':
                        difficultyText = 'Lehká';
                        difficultyColor = '#2ecc71';
                        break;
                    case 'medium':
                        difficultyText = 'Střední';
                        difficultyColor = '#f39c12';
                        break;
                    case 'hard':
                        difficultyText = 'Těžká';
                        difficultyColor = '#e74c3c';
                        break;
                    default:
                        difficultyText = 'Neznámá';
                        difficultyColor = '#95a5a6';
                }

                // Výpočet času ušetřeného virtuální prací
                const realTimeMinutes = task.duration * 60; // Reálný čas v minutách
                const virtualTimeMinutes = 2; // Virtuální čas v minutách
                const savedTimeMinutes = realTimeMinutes - virtualTimeMinutes;

                // Převod na hodiny a minuty
                const savedHours = Math.floor(savedTimeMinutes / 60);
                const savedMinutes = savedTimeMinutes % 60;

                // Formátování ušetřeného času
                let savedTimeText = '';
                if (savedHours > 0) {
                    savedTimeText += `${savedHours} h `;
                }
                savedTimeText += `${savedMinutes} min`;

                // Vytvoření HTML pro úkol
                tasksHtml += `
                    <div class="work-task ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                        <div class="task-icon">${task.icon}</div>
                        <div class="task-content">
                            <div class="task-header">
                                <div class="task-title">${task.title}</div>
                                <div class="task-difficulty" style="color: ${difficultyColor};">${difficultyText}</div>
                            </div>
                            <div class="task-description">${task.description}</div>
                            <div class="task-details">
                                <div class="task-detail">
                                    <div class="task-detail-icon"><i class="fas fa-clock"></i></div>
                                    <div class="task-detail-text">${task.duration} h</div>
                                </div>
                                <div class="task-detail">
                                    <div class="task-detail-icon"><i class="fas fa-money-bill-wave"></i></div>
                                    <div class="task-detail-text">${task.pay} Kč</div>
                                </div>
                                <div class="task-detail">
                                    <div class="task-detail-icon"><i class="fas fa-hourglass-half"></i></div>
                                    <div class="task-detail-text">Ušetříte: ${savedTimeText}</div>
                                </div>
                            </div>
                        </div>
                        <div class="task-action">
                            <button class="virtual-work-btn primary task-select-btn" data-task-id="${task.id}">
                                <i class="fas fa-check"></i> Vybrat
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        // Informace o vybraném úkolu
        let selectedTaskHtml = '';

        if (this.selectedTask) {
            const task = this.workTasks.find(t => t.id === this.selectedTask);

            if (task) {
                // Obtížnost v češtině a barva
                let difficultyText, difficultyColor;

                switch (task.difficulty) {
                    case 'easy':
                        difficultyText = 'Lehká';
                        difficultyColor = '#2ecc71';
                        break;
                    case 'medium':
                        difficultyText = 'Střední';
                        difficultyColor = '#f39c12';
                        break;
                    case 'hard':
                        difficultyText = 'Těžká';
                        difficultyColor = '#e74c3c';
                        break;
                    default:
                        difficultyText = 'Neznámá';
                        difficultyColor = '#95a5a6';
                }

                // Výpočet času ušetřeného virtuální prací
                const realTimeMinutes = task.duration * 60; // Reálný čas v minutách
                const virtualTimeMinutes = 2; // Virtuální čas v minutách
                const savedTimeMinutes = realTimeMinutes - virtualTimeMinutes;

                // Převod na hodiny a minuty
                const savedHours = Math.floor(savedTimeMinutes / 60);
                const savedMinutes = savedTimeMinutes % 60;

                // Formátování ušetřeného času
                let savedTimeText = '';
                if (savedHours > 0) {
                    savedTimeText += `${savedHours} h `;
                }
                savedTimeText += `${savedMinutes} min`;

                selectedTaskHtml = `
                    <div class="selected-task">
                        <h4>Vybraný úkol</h4>
                        <div class="selected-task-content">
                            <div class="selected-task-icon">${task.icon}</div>
                            <div class="selected-task-info">
                                <div class="selected-task-title">${task.title}</div>
                                <div class="selected-task-description">${task.description}</div>
                                <div class="selected-task-details">
                                    <div class="selected-task-detail">
                                        <div class="selected-task-detail-label">Obtížnost</div>
                                        <div class="selected-task-detail-value" style="color: ${difficultyColor};">${difficultyText}</div>
                                    </div>
                                    <div class="selected-task-detail">
                                        <div class="selected-task-detail-label">Doba trvání</div>
                                        <div class="selected-task-detail-value">${task.duration} h</div>
                                    </div>
                                    <div class="selected-task-detail">
                                        <div class="selected-task-detail-label">Odměna</div>
                                        <div class="selected-task-detail-value">${task.pay} Kč</div>
                                    </div>
                                    <div class="selected-task-detail">
                                        <div class="selected-task-detail-label">Ušetřený čas</div>
                                        <div class="selected-task-detail-value">${savedTimeText}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        return `
            <div class="work-tasks">
                ${selectedTaskHtml}

                <h4>Dostupné úkoly</h4>
                <div class="tasks-list">
                    ${tasksHtml}
                </div>
            </div>
        `;
    }

    /**
     * Vytvoření sekce kariéry
     */
    createCareerSection() {
        // Výpočet procenta postupu na další úroveň
        const progressPercent = (this.careerLevel.xpCurrent / this.careerLevel.xpRequired) * 100;

        return `
            <div class="career-progression">
                <div class="career-level">
                    <div class="career-level-icon">${this.careerLevel.level}</div>
                    <div class="career-level-info">
                        <div class="career-level-title">${this.careerLevel.title}</div>
                        <div class="career-level-description">Úroveň ${this.careerLevel.level} - Získejte více zkušeností pro postup na další úroveň</div>

                        <div class="career-progress">
                            <div class="career-progress-bar">
                                <div class="career-progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>
                            <div class="career-progress-text">
                                <div>${this.careerLevel.xpCurrent} XP</div>
                                <div>${this.careerLevel.xpRequired} XP</div>
                            </div>
                        </div>
                    </div>
                </div>

                <h4 style="margin-top: 20px;">Dovednosti</h4>
                <div class="career-skills">
                    <div class="career-skill">
                        <div class="career-skill-name">Komunikace</div>
                        <div class="career-skill-progress">
                            <div class="career-skill-fill" style="width: 65%;"></div>
                        </div>
                        <div class="career-skill-level">
                            <div>Úroveň 3</div>
                            <div>65/100</div>
                        </div>
                    </div>
                    <div class="career-skill">
                        <div class="career-skill-name">Týmová práce</div>
                        <div class="career-skill-progress">
                            <div class="career-skill-fill" style="width: 40%;"></div>
                        </div>
                        <div class="career-skill-level">
                            <div>Úroveň 2</div>
                            <div>40/100</div>
                        </div>
                    </div>
                    <div class="career-skill">
                        <div class="career-skill-name">Odborné znalosti</div>
                        <div class="career-skill-progress">
                            <div class="career-skill-fill" style="width: 80%;"></div>
                        </div>
                        <div class="career-skill-level">
                            <div>Úroveň 4</div>
                            <div>80/100</div>
                        </div>
                    </div>
                    <div class="career-skill">
                        <div class="career-skill-name">Řešení problémů</div>
                        <div class="career-skill-progress">
                            <div class="career-skill-fill" style="width: 55%;"></div>
                        </div>
                        <div class="career-skill-level">
                            <div>Úroveň 3</div>
                            <div>55/100</div>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 20px; text-align: center;">
                    <button class="virtual-work-btn primary" id="career-details-btn">
                        <i class="fas fa-info-circle"></i> Podrobnosti kariéry
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Nastavení event listenerů pro dialog
     */
    setupDialogEvents(dialog) {
        // Zavření dialogu
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#virtual-work-cancel');

        closeBtn.addEventListener('click', () => this.closeWorkDialog(dialog));
        cancelBtn.addEventListener('click', () => this.closeWorkDialog(dialog));

        // Přepínání záložek
        const tabs = dialog.querySelectorAll('.virtual-work-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech záložek
                tabs.forEach(t => t.classList.remove('active'));

                // Přidání aktivní třídy na kliknutou záložku
                tab.classList.add('active');

                // Získání ID sekce
                const sectionId = tab.dataset.tab;

                // Skrytí všech sekcí
                const sections = dialog.querySelectorAll('.virtual-work-section');
                sections.forEach(section => section.classList.remove('active'));

                // Zobrazení vybrané sekce
                const activeSection = dialog.querySelector(`.virtual-work-section[data-section="${sectionId}"]`);
                if (activeSection) {
                    activeSection.classList.add('active');
                }
            });
        });

        // Tlačítko pro přidání pracoviště
        const addWorkplaceBtn = dialog.querySelector('#add-workplace-btn');
        if (addWorkplaceBtn) {
            addWorkplaceBtn.addEventListener('click', () => this.showAddWorkplaceDialog());
        }

        // Tlačítko pro změnu pracoviště
        const changeWorkplaceBtn = dialog.querySelector('#change-workplace-btn');
        if (changeWorkplaceBtn) {
            changeWorkplaceBtn.addEventListener('click', () => this.showChangeWorkplaceDialog());
        }

        // Tlačítko pro uložení nastavení
        const saveSettingsBtn = dialog.querySelector('#save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveWorkSettings(dialog));
        }

        // Slidery v kalkulačce výdělku
        const hourlyRateSlider = dialog.querySelector('#hourly-rate-slider');
        const hoursPerDaySlider = dialog.querySelector('#hours-per-day-slider');
        const daysPerWeekSlider = dialog.querySelector('#days-per-week-slider');

        if (hourlyRateSlider) {
            hourlyRateSlider.addEventListener('input', () => this.updateEarningsCalculator(dialog));
        }

        if (hoursPerDaySlider) {
            hoursPerDaySlider.addEventListener('input', () => this.updateEarningsCalculator(dialog));
        }

        if (daysPerWeekSlider) {
            daysPerWeekSlider.addEventListener('input', () => this.updateEarningsCalculator(dialog));
        }

        // Možnosti dopravy
        const transportOptions = dialog.querySelectorAll('.transport-option');
        transportOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Odstranění výběru ze všech možností
                transportOptions.forEach(opt => opt.classList.remove('selected'));

                // Přidání výběru na kliknutou možnost
                option.classList.add('selected');

                // Uložení vybraného typu dopravy
                this.selectedTransport = option.dataset.transport;

                // Aktualizace sekce dopravy
                this.updateTransportSection(dialog);
            });
        });

        // Tlačítka pro výběr úkolu
        const taskSelectBtns = dialog.querySelectorAll('.task-select-btn');
        taskSelectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const taskId = btn.dataset.taskId;
                this.selectedTask = taskId;

                // Aktualizace sekce úkolů
                const tasksSection = dialog.querySelector('.virtual-work-section[data-section="tasks"]');
                if (tasksSection) {
                    tasksSection.innerHTML = this.createTasksSection();

                    // Znovu přidání event listenerů pro tlačítka výběru úkolu
                    this.setupTaskSelectButtons(dialog);
                }

                // Aktualizace textu tlačítka pro začátek práce
                const startWorkBtn = dialog.querySelector('#virtual-work-start');
                if (startWorkBtn) {
                    startWorkBtn.innerHTML = '<i class="fas fa-play"></i> Začít pracovat na úkolu';
                }
            });
        });

        // Tlačítko pro začátek práce
        const startWorkBtn = dialog.querySelector('#virtual-work-start');
        if (startWorkBtn) {
            startWorkBtn.addEventListener('click', () => this.startVirtualWork(dialog));
        }

        // Tlačítko pro přidání nového příkazu
        const addNewCommandBtn = dialog.querySelector('#add-new-command-btn');
        if (addNewCommandBtn) {
            addNewCommandBtn.addEventListener('click', () => this.showAddCommandDialog());
        }

        // Vyhledávání příkazů
        const commandSearch = dialog.querySelector('#command-search');
        if (commandSearch) {
            commandSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const commandItems = dialog.querySelectorAll('.command-item');

                commandItems.forEach(item => {
                    const name = item.querySelector('.command-name').textContent.toLowerCase();
                    const description = item.querySelector('.command-description').textContent.toLowerCase();
                    const command = item.querySelector('.command-code').textContent.toLowerCase();

                    if (name.includes(searchTerm) || description.includes(searchTerm) || command.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Skrytí/zobrazení kategorií bez viditelných příkazů
                const categories = dialog.querySelectorAll('.command-category');
                categories.forEach(category => {
                    const visibleCommands = category.querySelectorAll('.command-item[style="display: flex;"]').length;
                    const hiddenCommands = category.querySelectorAll('.command-item[style="display: none;"]').length;

                    if (visibleCommands === 0 && hiddenCommands > 0) {
                        category.style.display = 'none';
                    } else {
                        category.style.display = 'block';
                    }
                });
            });
        }

        // Tlačítka pro správu příkazů
        const toggleStatusBtns = dialog.querySelectorAll('.toggle-status');
        const editCommandBtns = dialog.querySelectorAll('.edit-command');
        const improveCommandBtns = dialog.querySelectorAll('.improve-command');

        toggleStatusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandItem = e.target.closest('.command-item');
                const commandId = commandItem.dataset.commandId;
                this.toggleCommandStatus(commandId, dialog);
            });
        });

        editCommandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandItem = e.target.closest('.command-item');
                const commandId = commandItem.dataset.commandId;
                this.showEditCommandDialog(commandId);
            });
        });

        improveCommandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandItem = e.target.closest('.command-item');
                const commandId = commandItem.dataset.commandId;
                this.showImproveCommandDialog(commandId);
            });
        });
    }

    /**
     * Přepnutí stavu příkazu (aktivní/neaktivní)
     */
    toggleCommandStatus(commandId, dialog) {
        // Nalezení příkazu podle ID
        const command = this.commands.find(cmd => cmd.id === commandId);

        if (command) {
            // Přepnutí stavu
            command.status = command.status === 'active' ? 'inactive' : 'active';

            // Aktualizace sekce příkazů
            this.updateCommandsSection(dialog);
        }
    }

    /**
     * Aktualizace sekce příkazů
     */
    updateCommandsSection(dialog) {
        // Nalezení sekce příkazů
        const commandsSection = dialog.querySelector('.virtual-work-section[data-section="commands"]');

        if (commandsSection) {
            // Aktualizace obsahu sekce
            commandsSection.innerHTML = this.createCommandsSection();

            // Znovu přidání event listenerů pro tlačítka správy příkazů
            this.setupCommandButtons(dialog);
        }
    }

    /**
     * Nastavení event listenerů pro tlačítka správy příkazů
     */
    setupCommandButtons(dialog) {
        // Tlačítko pro přidání nového příkazu
        const addNewCommandBtn = dialog.querySelector('#add-new-command-btn');
        if (addNewCommandBtn) {
            addNewCommandBtn.addEventListener('click', () => this.showAddCommandDialog());
        }

        // Vyhledávání příkazů
        const commandSearch = dialog.querySelector('#command-search');
        if (commandSearch) {
            commandSearch.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const commandItems = dialog.querySelectorAll('.command-item');

                commandItems.forEach(item => {
                    const name = item.querySelector('.command-name').textContent.toLowerCase();
                    const description = item.querySelector('.command-description').textContent.toLowerCase();
                    const command = item.querySelector('.command-code').textContent.toLowerCase();

                    if (name.includes(searchTerm) || description.includes(searchTerm) || command.includes(searchTerm)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Skrytí/zobrazení kategorií bez viditelných příkazů
                const categories = dialog.querySelectorAll('.command-category');
                categories.forEach(category => {
                    const visibleCommands = category.querySelectorAll('.command-item[style="display: flex;"]').length;
                    const hiddenCommands = category.querySelectorAll('.command-item[style="display: none;"]').length;

                    if (visibleCommands === 0 && hiddenCommands > 0) {
                        category.style.display = 'none';
                    } else {
                        category.style.display = 'block';
                    }
                });
            });
        }

        // Tlačítka pro správu příkazů
        const toggleStatusBtns = dialog.querySelectorAll('.toggle-status');
        const editCommandBtns = dialog.querySelectorAll('.edit-command');
        const improveCommandBtns = dialog.querySelectorAll('.improve-command');

        toggleStatusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandItem = e.target.closest('.command-item');
                const commandId = commandItem.dataset.commandId;
                this.toggleCommandStatus(commandId, dialog);
            });
        });

        editCommandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandItem = e.target.closest('.command-item');
                const commandId = commandItem.dataset.commandId;
                this.showEditCommandDialog(commandId);
            });
        });

        improveCommandBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const commandItem = e.target.closest('.command-item');
                const commandId = commandItem.dataset.commandId;
                this.showImproveCommandDialog(commandId);
            });
        });
    }

    /**
     * Nastavení event listenerů pro tlačítka výběru úkolu
     */
    setupTaskSelectButtons(dialog) {
        const taskSelectBtns = dialog.querySelectorAll('.task-select-btn');
        taskSelectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const taskId = btn.dataset.taskId;
                this.selectedTask = taskId;

                // Aktualizace sekce úkolů
                const tasksSection = dialog.querySelector('.virtual-work-section[data-section="tasks"]');
                if (tasksSection) {
                    tasksSection.innerHTML = this.createTasksSection();

                    // Znovu přidání event listenerů pro tlačítka výběru úkolu
                    this.setupTaskSelectButtons(dialog);
                }

                // Aktualizace textu tlačítka pro začátek práce
                const startWorkBtn = dialog.querySelector('#virtual-work-start');
                if (startWorkBtn) {
                    startWorkBtn.innerHTML = '<i class="fas fa-play"></i> Začít pracovat na úkolu';
                }
            });
        });
    }

    /**
     * Zavření dialogu virtuální práce
     */
    closeWorkDialog(dialog) {
        // Animace zavření
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';

        // Odstranění dialogu po animaci
        setTimeout(() => {
            dialog.remove();
        }, 300);
    }

    /**
     * Zobrazení dialogu pro přidání nového pracoviště
     */
    showAddWorkplaceDialog() {
        // Kontrola, zda je dialog již otevřený
        if (document.querySelector('.add-workplace-dialog')) return;

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog add-workplace-dialog';
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
        dialog.style.transition = 'all 0.3s ease';
        dialog.style.zIndex = '1200';

        // Základní struktura dialogu
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2><i class="fas fa-plus-circle"></i> Přidat nové pracoviště</h2>
                <button class="virtual-work-close">&times;</button>
            </div>

            <div class="virtual-work-content" style="padding: 25px;">
                <div class="settings-group">
                    <h4><i class="fas fa-building"></i> Základní informace</h4>
                    <div class="settings-row">
                        <div class="settings-field">
                            <label for="workplace-name">Název pracoviště</label>
                            <input type="text" id="workplace-name" placeholder="Např. Kancelář ABC">
                        </div>
                        <div class="settings-field">
                            <label for="workplace-type">Typ práce</label>
                            <select id="workplace-type">
                                <option value="office">Kancelářská práce</option>
                                <option value="programming">Programování</option>
                                <option value="manual">Manuální práce</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="settings-group">
                    <h4><i class="fas fa-map-marker-alt"></i> Umístění</h4>
                    <div class="settings-row">
                        <div class="settings-field">
                            <label>Typ umístění</label>
                            <div style="display: flex; gap: 15px; margin-top: 8px;">
                                <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                                    <input type="radio" name="location-type" value="current" checked>
                                    <span>Aktuální poloha na mapě</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                                    <input type="radio" name="location-type" value="custom">
                                    <span>Vlastní souřadnice</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="settings-row custom-location" style="display: none;">
                        <div class="settings-field">
                            <label for="workplace-lat">Zeměpisná šířka</label>
                            <input type="number" id="workplace-lat" step="0.00001" placeholder="Např. 48.8484">
                        </div>
                        <div class="settings-field">
                            <label for="workplace-lng">Zeměpisná délka</label>
                            <input type="number" id="workplace-lng" step="0.00001" placeholder="Např. 17.1259">
                        </div>
                    </div>
                </div>

                <div class="settings-group">
                    <h4><i class="fas fa-money-bill-wave"></i> Finanční informace</h4>
                    <div class="settings-row">
                        <div class="settings-field">
                            <label for="workplace-pay">Denní výdělek</label>
                            <div class="input-with-unit">
                                <input type="number" id="workplace-pay" class="has-unit" value="1200" min="500" max="10000" step="100">
                                <span class="input-unit">Kč</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="virtual-work-actions">
                <div class="virtual-work-buttons" style="width: 100%; justify-content: flex-end;">
                    <button class="virtual-work-btn secondary" id="add-workplace-cancel">
                        <i class="fas fa-times"></i> Zrušit
                    </button>
                    <button class="virtual-work-btn primary" id="add-workplace-save">
                        <i class="fas fa-save"></i> Přidat pracoviště
                    </button>
                </div>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Animace otevření
        setTimeout(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Přidání event listenerů
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#add-workplace-cancel');
        const saveBtn = dialog.querySelector('#add-workplace-save');
        const locationType = dialog.querySelectorAll('input[name="location-type"]');
        const customLocation = dialog.querySelector('.custom-location');

        // Zavření dialogu
        closeBtn.addEventListener('click', () => this.closeWorkDialog(dialog));
        cancelBtn.addEventListener('click', () => this.closeWorkDialog(dialog));

        // Přepínání typu umístění
        locationType.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'custom') {
                    customLocation.style.display = 'grid';
                } else {
                    customLocation.style.display = 'none';
                }
            });
        });

        // Uložení nového pracoviště
        saveBtn.addEventListener('click', () => {
            // Získání hodnot z formuláře
            const name = dialog.querySelector('#workplace-name').value.trim();
            const type = dialog.querySelector('#workplace-type').value;
            const pay = parseInt(dialog.querySelector('#workplace-pay').value);
            const locationType = dialog.querySelector('input[name="location-type"]:checked').value;

            // Validace
            if (!name) {
                alert('Zadejte název pracoviště');
                return;
            }

            // Získání souřadnic
            let lat, lng;

            if (locationType === 'current') {
                // Použití aktuální polohy
                if (typeof map !== 'undefined') {
                    const center = map.getCenter();
                    lat = center.lat;
                    lng = center.lng;
                } else {
                    // Výchozí poloha pro Hodonín, pokud není dostupná mapa
                    lat = 48.8484;
                    lng = 17.1259;
                }
            } else {
                // Použití vlastních souřadnic
                lat = parseFloat(dialog.querySelector('#workplace-lat').value);
                lng = parseFloat(dialog.querySelector('#workplace-lng').value);

                // Validace souřadnic
                if (isNaN(lat) || isNaN(lng)) {
                    alert('Zadejte platné souřadnice');
                    return;
                }
            }

            // Přidání nového pracoviště
            this.addWorkplace(name, type, lat, lng, pay);

            // Zavření dialogu
            this.closeWorkDialog(dialog);

            // Aktualizace hlavního dialogu
            this.refreshWorkDialog();
        });
    }

    /**
     * Zobrazení dialogu pro změnu pracoviště
     */
    showChangeWorkplaceDialog() {
        // Kontrola, zda je dialog již otevřený
        if (document.querySelector('.change-workplace-dialog')) return;

        // Kontrola, zda máme pracoviště
        if (this.workplaces.length === 0) {
            alert('Nemáte žádné pracoviště k výběru');
            return;
        }

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog change-workplace-dialog';
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
        dialog.style.transition = 'all 0.3s ease';
        dialog.style.zIndex = '1200';

        // Vytvoření seznamu pracovišť
        let workplacesHtml = '';

        this.workplaces.forEach(workplace => {
            // Ikona podle typu práce
            const icon = workplace.type === 'office' ? '💼' :
                         workplace.type === 'programming' ? '💻' : '🔨';

            // Typ práce v češtině
            const typeName = workplace.type === 'office' ? 'Kancelářská práce' :
                             workplace.type === 'programming' ? 'Programování' : 'Manuální práce';

            // Kontrola, zda je pracoviště vybráno
            const isSelected = this.selectedWorkplace && this.selectedWorkplace.id === workplace.id;

            workplacesHtml += `
                <div class="workplace-option ${isSelected ? 'selected' : ''}" data-id="${workplace.id}">
                    <div class="workplace-option-icon">${icon}</div>
                    <div class="workplace-option-info">
                        <div class="workplace-option-name">${workplace.name}</div>
                        <div class="workplace-option-type">${typeName}</div>
                        <div class="workplace-option-pay">${workplace.pay} Kč/den</div>
                        <div class="workplace-option-distance">${workplace.distance.toFixed(2)} km od vás</div>
                    </div>
                </div>
            `;
        });

        // Základní struktura dialogu
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2><i class="fas fa-exchange-alt"></i> Změnit pracoviště</h2>
                <button class="virtual-work-close">&times;</button>
            </div>

            <div class="virtual-work-content" style="padding: 25px;">
                <div class="workplaces-list">
                    ${workplacesHtml}
                </div>

                <div style="margin-top: 20px; text-align: right;">
                    <button class="virtual-work-btn primary" id="add-new-workplace-btn">
                        <i class="fas fa-plus"></i> Přidat nové pracoviště
                    </button>
                </div>
            </div>

            <div class="virtual-work-actions">
                <div class="virtual-work-buttons" style="width: 100%; justify-content: flex-end;">
                    <button class="virtual-work-btn secondary" id="change-workplace-cancel">
                        <i class="fas fa-times"></i> Zrušit
                    </button>
                    <button class="virtual-work-btn primary" id="change-workplace-save">
                        <i class="fas fa-check"></i> Vybrat pracoviště
                    </button>
                </div>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Animace otevření
        setTimeout(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Přidání event listenerů
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#change-workplace-cancel');
        const saveBtn = dialog.querySelector('#change-workplace-save');
        const addNewBtn = dialog.querySelector('#add-new-workplace-btn');
        const workplaceOptions = dialog.querySelectorAll('.workplace-option');

        // Zavření dialogu
        closeBtn.addEventListener('click', () => this.closeWorkDialog(dialog));
        cancelBtn.addEventListener('click', () => this.closeWorkDialog(dialog));

        // Přidání nového pracoviště
        addNewBtn.addEventListener('click', () => {
            this.closeWorkDialog(dialog);
            this.showAddWorkplaceDialog();
        });

        // Výběr pracoviště
        workplaceOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Odstranění výběru ze všech možností
                workplaceOptions.forEach(opt => opt.classList.remove('selected'));

                // Přidání výběru na kliknutou možnost
                option.classList.add('selected');
            });
        });

        // Uložení vybraného pracoviště
        saveBtn.addEventListener('click', () => {
            // Získání vybraného pracoviště
            const selectedOption = dialog.querySelector('.workplace-option.selected');

            if (selectedOption) {
                const workplaceId = selectedOption.dataset.id;
                const workplace = this.workplaces.find(wp => wp.id === workplaceId);

                if (workplace) {
                    this.selectedWorkplace = workplace;

                    // Zavření dialogu
                    this.closeWorkDialog(dialog);

                    // Aktualizace hlavního dialogu
                    this.refreshWorkDialog();
                }
            } else {
                alert('Vyberte pracoviště');
            }
        });
    }

    /**
     * Aktualizace hlavního dialogu
     */
    refreshWorkDialog() {
        // Získání hlavního dialogu
        const mainDialog = document.querySelector('.virtual-work-dialog:not(.add-workplace-dialog):not(.change-workplace-dialog)');

        if (!mainDialog) return;

        // Aktualizace sekce pracoviště
        const workplaceSection = mainDialog.querySelector('.virtual-work-section[data-section="workplace"]');
        if (workplaceSection) {
            workplaceSection.innerHTML = this.createWorkplaceSection();
        }

        // Aktualizace sekce dopravy
        const transportSection = mainDialog.querySelector('.virtual-work-section[data-section="transport"]');
        if (transportSection) {
            transportSection.innerHTML = this.createTransportSection();
        }

        // Přidání event listenerů
        this.setupDialogEvents(mainDialog);
    }

    /**
     * Aktualizace sekce dopravy
     */
    updateTransportSection(dialog) {
        // Aktualizace sekce dopravy
        const transportSection = dialog.querySelector('.virtual-work-section[data-section="transport"]');
        if (transportSection) {
            transportSection.innerHTML = this.createTransportSection();
        }

        // Přidání event listenerů pro možnosti dopravy
        const transportOptions = dialog.querySelectorAll('.transport-option');
        transportOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Odstranění výběru ze všech možností
                transportOptions.forEach(opt => opt.classList.remove('selected'));

                // Přidání výběru na kliknutou možnost
                option.classList.add('selected');

                // Uložení vybraného typu dopravy
                this.selectedTransport = option.dataset.transport;

                // Aktualizace sekce dopravy
                this.updateTransportSection(dialog);
            });
        });
    }

    /**
     * Aktualizace kalkulačky výdělku
     */
    updateEarningsCalculator(dialog) {
        // Získání hodnot ze sliderů
        const hourlyRate = parseInt(dialog.querySelector('#hourly-rate-slider').value);
        const hoursPerDay = parseFloat(dialog.querySelector('#hours-per-day-slider').value);
        const daysPerWeek = parseInt(dialog.querySelector('#days-per-week-slider').value);

        // Aktualizace zobrazených hodnot
        dialog.querySelector('#hourly-rate-value').textContent = `${hourlyRate} Kč/h`;
        dialog.querySelector('#hours-per-day-value').textContent = `${hoursPerDay} h`;
        dialog.querySelector('#days-per-week-value').textContent = `${daysPerWeek} dnů`;

        // Výpočet výdělků
        const dailyEarnings = hourlyRate * hoursPerDay;
        const weeklyEarnings = dailyEarnings * daysPerWeek;
        const monthlyEarnings = weeklyEarnings * 4.33; // Průměrný počet týdnů v měsíci
        const yearlyEarnings = monthlyEarnings * 12;

        // Aktualizace zobrazených výdělků
        dialog.querySelector('.calculator-amount').textContent = `${Math.round(monthlyEarnings).toLocaleString()} Kč`;

        const detailValues = dialog.querySelectorAll('.calculator-detail-value');
        detailValues[0].textContent = `${Math.round(dailyEarnings).toLocaleString()} Kč`;
        detailValues[1].textContent = `${Math.round(weeklyEarnings).toLocaleString()} Kč`;
        detailValues[2].textContent = `${Math.round(yearlyEarnings).toLocaleString()} Kč`;
    }

    /**
     * Uložení nastavení práce
     */
    saveWorkSettings(dialog) {
        // Získání hodnot z formuláře
        const hourlyRate = parseInt(dialog.querySelector('#hourly-rate').value);
        const hoursPerDay = parseFloat(dialog.querySelector('#hours-per-day').value);
        const daysPerWeek = parseInt(dialog.querySelector('#days-per-week').value);
        const breakTime = parseInt(dialog.querySelector('#break-time').value);
        const startTime = dialog.querySelector('#start-time').value;
        const endTime = dialog.querySelector('#end-time').value;
        const educationLevel = dialog.querySelector('#education-level').value;
        const experience = parseInt(dialog.querySelector('#experience-years').value);

        // Validace
        if (isNaN(hourlyRate) || isNaN(hoursPerDay) || isNaN(daysPerWeek) || isNaN(breakTime) || isNaN(experience)) {
            alert('Zadejte platné hodnoty');
            return;
        }

        // Aktualizace nastavení
        this.workSettings = {
            hourlyRate,
            hoursPerDay,
            daysPerWeek,
            breakTime,
            startTime,
            endTime,
            educationLevel,
            experience,
            skills: this.workSettings.skills
        };

        // Uložení nastavení do localStorage
        localStorage.setItem('virtualWorkSettings', JSON.stringify(this.workSettings));

        // Aktualizace kalkulačky výdělku
        const earningsSection = dialog.querySelector('.virtual-work-section[data-section="earnings"]');
        if (earningsSection) {
            earningsSection.innerHTML = this.createEarningsSection();

            // Přidání event listenerů pro slidery
            const hourlyRateSlider = dialog.querySelector('#hourly-rate-slider');
            const hoursPerDaySlider = dialog.querySelector('#hours-per-day-slider');
            const daysPerWeekSlider = dialog.querySelector('#days-per-week-slider');

            if (hourlyRateSlider) {
                hourlyRateSlider.addEventListener('input', () => this.updateEarningsCalculator(dialog));
            }

            if (hoursPerDaySlider) {
                hoursPerDaySlider.addEventListener('input', () => this.updateEarningsCalculator(dialog));
            }

            if (daysPerWeekSlider) {
                daysPerWeekSlider.addEventListener('input', () => this.updateEarningsCalculator(dialog));
            }
        }

        // Zobrazení zprávy o úspěšném uložení
        alert('Nastavení bylo úspěšně uloženo');
    }

    /**
     * Přidání nového pracoviště
     */
    addWorkplace(name, type, lat, lng, pay) {
        // Vytvoření ID pro nové pracoviště
        const id = `${type}${this.workplaces.length + 1}`;

        // Výpočet vzdálenosti od aktuální polohy
        let userLocation;

        if (typeof map !== 'undefined') {
            // Použití středu mapy jako výchozí polohy
            userLocation = map.getCenter();
        } else {
            // Výchozí poloha pro Hodonín, pokud není dostupná mapa
            userLocation = { lat: 48.8484, lng: 17.1259 };
        }

        const distance = this.calculateDistance(
            userLocation.lat, userLocation.lng,
            lat, lng
        );

        // Vytvoření nového pracoviště
        const newWorkplace = {
            id,
            name,
            type,
            lat,
            lng,
            pay,
            distance
        };

        // Přidání nového pracoviště do pole
        this.workplaces.push(newWorkplace);

        // Uložení aktualizovaných pracovišť do localStorage
        localStorage.setItem('workplaces', JSON.stringify(this.workplaces));

        // Nastavení nového pracoviště jako vybraného
        this.selectedWorkplace = newWorkplace;

        // Zobrazení zprávy o přidání nového pracoviště
        if (typeof addMessage !== 'undefined') {
            addMessage(`Přidáno nové pracoviště: ${name}`, false);
        }

        // Přidání XP za přidání nového pracoviště
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(20, 'Přidání nového pracoviště');
        }

        return newWorkplace;
    }

    /**
     * Automatické vyhledání nejbližšího pracoviště
     */
    findNearestWorkplace() {
        // Kontrola, zda máme pracoviště
        if (this.workplaces.length === 0) {
            return null;
        }

        // Získání aktuální polohy uživatele
        let userLocation;

        if (typeof map !== 'undefined') {
            // Použití středu mapy jako výchozí polohy
            userLocation = map.getCenter();
        } else {
            // Výchozí poloha pro Hodonín, pokud není dostupná mapa
            userLocation = { lat: 48.8484, lng: 17.1259 };
        }

        // Výpočet vzdálenosti pro každé pracoviště
        this.workplaces.forEach(workplace => {
            workplace.distance = this.calculateDistance(
                userLocation.lat, userLocation.lng,
                workplace.lat, workplace.lng
            );
        });

        // Seřazení pracovišť podle vzdálenosti
        this.workplaces.sort((a, b) => a.distance - b.distance);

        // Vrácení nejbližšího pracoviště
        return this.workplaces[0];
    }

    /**
     * Výpočet vzdálenosti mezi dvěma body pomocí Haversine formule
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Poloměr Země v km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Vzdálenost v km
        return distance;
    }

    /**
     * Převod stupňů na radiány
     */
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    /**
     * Zahájení virtuální práce
     */
    startVirtualWork(dialog) {
        // Kontrola, zda je vybráno pracoviště
        if (!this.selectedWorkplace) {
            alert('Nejprve vyberte pracoviště');
            return;
        }

        // Aktualizace stavu dialogu
        const statusText = dialog.querySelector('.status-text');
        const statusIndicator = dialog.querySelector('.status-indicator');
        const startButton = dialog.querySelector('#virtual-work-start');

        if (statusText && statusIndicator && startButton) {
            statusText.textContent = 'Probíhá práce...';
            statusIndicator.style.backgroundColor = '#f39c12';
            startButton.disabled = true;
            startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pracuji...';
        }

        // Výpočet doby práce a výdělku
        let workDuration, earnings;

        if (this.selectedTask) {
            // Použití vybraného úkolu
            const task = this.workTasks.find(t => t.id === this.selectedTask);

            if (task) {
                workDuration = task.duration;
                earnings = task.pay;

                // Označení úkolu jako dokončeného
                task.completed = true;
            } else {
                // Pokud úkol nebyl nalezen, použijeme výchozí hodnoty
                workDuration = this.workSettings.hoursPerDay;
                earnings = this.calculateEarnings();
            }
        } else {
            // Pokud není vybrán úkol, použijeme výchozí hodnoty
            workDuration = this.workSettings.hoursPerDay;
            earnings = this.calculateEarnings();
        }

        // Výpočet doby simulace
        const workTimeMs = workDuration * 60 * 60 * 1000; // Převod na milisekundy
        const simulationTime = Math.min(5000, workTimeMs / 1000); // Maximálně 5 sekund

        setTimeout(() => {
            // Přidání peněz
            this.addMoney(earnings);

            // Aktualizace statistik
            this.updateStatistics(earnings);

            // Aktualizace stavu dialogu
            if (statusText && statusIndicator && startButton) {
                statusText.textContent = 'Práce dokončena';
                statusIndicator.style.backgroundColor = '#2ecc71';
                startButton.disabled = false;

                if (this.selectedTask) {
                    startButton.innerHTML = '<i class="fas fa-play"></i> Začít pracovat na úkolu';
                } else {
                    startButton.innerHTML = '<i class="fas fa-play"></i> Začít pracovat';
                }
            }

            // Zobrazení výsledku
            this.showWorkResult(dialog, earnings);

            // Aktualizace sekce statistik
            const statisticsSection = dialog.querySelector('.virtual-work-section[data-section="statistics"]');
            if (statisticsSection) {
                statisticsSection.innerHTML = this.createStatisticsSection();
            }

            // Aktualizace sekce kariéry
            const careerSection = dialog.querySelector('.virtual-work-section[data-section="career"]');
            if (careerSection) {
                careerSection.innerHTML = this.createCareerSection();
            }

            // Aktualizace sekce úkolů, pokud byl vybrán úkol
            if (this.selectedTask) {
                const tasksSection = dialog.querySelector('.virtual-work-section[data-section="tasks"]');
                if (tasksSection) {
                    // Resetování vybraného úkolu
                    this.selectedTask = null;

                    // Aktualizace sekce úkolů
                    tasksSection.innerHTML = this.createTasksSection();

                    // Znovu přidání event listenerů pro tlačítka výběru úkolu
                    this.setupTaskSelectButtons(dialog);
                }
            }
        }, simulationTime);
    }

    /**
     * Výpočet výdělku
     */
    calculateEarnings() {
        // Základní výdělek podle pracoviště
        let earnings = this.selectedWorkplace.pay;

        // Úprava podle vzdělání a zkušeností
        const educationMultiplier = {
            'elementary': 0.8,
            'high-school': 1.0,
            'bachelor': 1.2,
            'master': 1.4,
            'phd': 1.6
        };

        // Bonus za zkušenosti (1% za rok)
        const experienceBonus = 1 + (this.workSettings.experience * 0.01);

        // Aplikace multiplikátorů
        earnings *= educationMultiplier[this.workSettings.educationLevel] || 1;
        earnings *= experienceBonus;

        // Náhodný bonus za výkon (90-110%)
        const performanceMultiplier = 0.9 + (Math.random() * 0.2);
        earnings *= performanceMultiplier;

        // Zaokrouhlení na celé koruny
        return Math.round(earnings);
    }

    /**
     * Přidání peněz
     */
    addMoney(amount) {
        // Kontrola, zda existuje MoneyTracker
        if (typeof MoneyTracker !== 'undefined') {
            MoneyTracker.addMoney(amount, 'Práce');
        } else {
            // Vytvoření události přidání peněz
            const moneyEvent = new CustomEvent('moneyAdded', {
                detail: {
                    amount,
                    source: 'virtualWork'
                }
            });
            document.dispatchEvent(moneyEvent);
        }

        // Přidání XP za práci
        if (typeof UserProgress !== 'undefined') {
            // Výpočet XP - 1 XP za každých 100 Kč
            const xp = Math.round(amount / 100);

            // Typ práce v češtině
            const typeName = this.selectedWorkplace.type === 'office' ? 'Kancelářská práce' :
                             this.selectedWorkplace.type === 'programming' ? 'Programování' : 'Manuální práce';

            UserProgress.addXP(xp, `Práce (${typeName})`);
        }

        // Aktualizace úkolu na nájem, pokud existuje
        if (typeof TaskSystem !== 'undefined') {
            const rentTask = TaskSystem.tasks.find(task => task.id === 'rent-money' && task.status === 'active');
            if (rentTask) {
                // Vytvoření události přidání peněz pro aktualizaci úkolu
                const moneyEvent = new CustomEvent('moneyAdded', { detail: { amount } });
                document.dispatchEvent(moneyEvent);
            }
        }
    }

    /**
     * Aktualizace statistik
     */
    updateStatistics(earnings) {
        // Aktualizace celkového výdělku
        this.statistics.totalEarned += earnings;

        // Aktualizace odpracovaných dnů
        this.statistics.daysWorked += 1;

        // Aktualizace odpracovaných hodin
        this.statistics.hoursWorked += this.workSettings.hoursPerDay;

        // Aktualizace data poslední práce
        this.statistics.lastWorkDate = new Date().toISOString();

        // Přidání záznamu do historie výdělků
        this.statistics.earningHistory.push({
            date: new Date().toISOString(),
            amount: earnings,
            workplace: this.selectedWorkplace.name,
            workplaceType: this.selectedWorkplace.type
        });

        // Omezení historie na posledních 30 záznamů
        if (this.statistics.earningHistory.length > 30) {
            this.statistics.earningHistory = this.statistics.earningHistory.slice(-30);
        }

        // Uložení statistik do localStorage
        localStorage.setItem('virtualWorkStats', JSON.stringify(this.statistics));

        // Aktualizace kariérního postupu
        this.updateCareerProgress(earnings);
    }

    /**
     * Aktualizace kariérního postupu
     */
    updateCareerProgress(earnings) {
        // Přidání XP do kariéry (1 XP za každých 50 Kč)
        const xpGained = Math.round(earnings / 50);
        this.careerLevel.xpCurrent += xpGained;

        // Kontrola, zda došlo k postupu na další úroveň
        if (this.careerLevel.xpCurrent >= this.careerLevel.xpRequired) {
            // Postup na další úroveň
            this.careerLevel.level += 1;
            this.careerLevel.xpCurrent -= this.careerLevel.xpRequired;

            // Výpočet XP potřebných pro další úroveň (o 20% více)
            this.careerLevel.xpRequired = Math.round(this.careerLevel.xpRequired * 1.2);

            // Aktualizace titulu
            this.updateCareerTitle();

            // Zobrazení zprávy o postupu na další úroveň
            if (typeof addMessage !== 'undefined') {
                addMessage(`Gratulujeme! Postoupili jste na kariérní úroveň ${this.careerLevel.level} (${this.careerLevel.title})`, false);
            }
        }

        // Uložení kariérního postupu do localStorage
        localStorage.setItem('virtualWorkCareer', JSON.stringify(this.careerLevel));
    }

    /**
     * Aktualizace kariérního titulu
     */
    updateCareerTitle() {
        // Tituly podle úrovně
        const titles = [
            'Začátečník',
            'Učeň',
            'Praktikant',
            'Asistent',
            'Specialista',
            'Pokročilý specialista',
            'Expert',
            'Senior expert',
            'Vedoucí',
            'Manažer',
            'Senior manažer',
            'Ředitel',
            'Výkonný ředitel',
            'Prezident společnosti',
            'Magnát'
        ];

        // Nastavení titulu podle úrovně
        const titleIndex = Math.min(this.careerLevel.level - 1, titles.length - 1);
        this.careerLevel.title = titles[titleIndex];
    }

    /**
     * Zobrazení výsledku práce
     */
    showWorkResult(dialog, earnings) {
        // Vytvoření dialogu s výsledkem
        const resultDialog = document.createElement('div');
        resultDialog.className = 'virtual-work-dialog work-result-dialog';
        resultDialog.style.opacity = '0';
        resultDialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
        resultDialog.style.transition = 'all 0.3s ease';
        resultDialog.style.zIndex = '1300';

        // Proměnné pro obsah dialogu
        let title, icon, description, hoursWorked;

        // Kontrola, zda byl vybrán úkol
        if (this.selectedTask) {
            const task = this.workTasks.find(t => t.id === this.selectedTask);

            if (task) {
                title = task.title;
                icon = task.icon;
                description = task.description;
                hoursWorked = task.duration;

                // Výpočet času ušetřeného virtuální prací
                const realTimeMinutes = task.duration * 60; // Reálný čas v minutách
                const virtualTimeMinutes = 2; // Virtuální čas v minutách
                const savedTimeMinutes = realTimeMinutes - virtualTimeMinutes;

                // Převod na hodiny a minuty
                const savedHours = Math.floor(savedTimeMinutes / 60);
                const savedMinutes = savedTimeMinutes % 60;

                // Formátování ušetřeného času
                let savedTimeText = '';
                if (savedHours > 0) {
                    savedTimeText += `${savedHours} h `;
                }
                savedTimeText += `${savedMinutes} min`;

                // Základní struktura dialogu pro úkol
                resultDialog.innerHTML = `
                    <div class="virtual-work-header">
                        <h2><i class="fas fa-check-circle"></i> Úkol dokončen</h2>
                        <button class="virtual-work-close">&times;</button>
                    </div>

                    <div class="virtual-work-content" style="padding: 25px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 20px;">${icon}</div>
                        <h3 style="margin-bottom: 5px;">${title}</h3>
                        <p style="color: #6c757d; margin-bottom: 20px;">${description}</p>

                        <div style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                            <div style="font-size: 14px; opacity: 0.8;">Váš výdělek za úkol</div>
                            <div style="font-size: 36px; font-weight: 700; margin: 10px 0;">${earnings.toLocaleString()} Kč</div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px;">
                                <div style="font-size: 14px; color: #6c757d;">Odpracováno</div>
                                <div style="font-size: 20px; font-weight: 600;">${hoursWorked} hodin</div>
                            </div>
                            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px;">
                                <div style="font-size: 14px; color: #6c757d;">Hodinová sazba</div>
                                <div style="font-size: 20px; font-weight: 600;">${Math.round(earnings / hoursWorked)} Kč/h</div>
                            </div>
                        </div>

                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                            <div style="font-size: 14px; color: #6c757d;">Ušetřený čas</div>
                            <div style="font-size: 20px; font-weight: 600;">${savedTimeText}</div>
                        </div>

                        <p style="margin-bottom: 0;">Peníze byly přidány do vašeho účtu. Celkový výdělek: ${Math.round(this.statistics.totalEarned).toLocaleString()} Kč</p>
                    </div>

                    <div class="virtual-work-actions">
                        <div class="virtual-work-buttons" style="width: 100%; justify-content: center;">
                            <button class="virtual-work-btn primary" id="work-result-close">
                                <i class="fas fa-check"></i> OK
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // Pokud úkol nebyl nalezen, použijeme výchozí zobrazení
                this.createDefaultWorkResult(resultDialog, earnings);
            }
        } else {
            // Pokud nebyl vybrán úkol, použijeme výchozí zobrazení
            this.createDefaultWorkResult(resultDialog, earnings);
        }

        // Přidání dialogu do stránky
        document.body.appendChild(resultDialog);

        // Animace otevření
        setTimeout(() => {
            resultDialog.style.opacity = '1';
            resultDialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Přidání event listenerů
        const closeBtn = resultDialog.querySelector('.virtual-work-close');
        const okBtn = resultDialog.querySelector('#work-result-close');

        // Zavření dialogu
        const closeResultDialog = () => {
            // Animace zavření
            resultDialog.style.opacity = '0';
            resultDialog.style.transform = 'translate(-50%, -50%) scale(0.9)';

            // Odstranění dialogu po animaci
            setTimeout(() => {
                resultDialog.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeResultDialog);
        okBtn.addEventListener('click', closeResultDialog);
    }

    /**
     * Vytvoření výchozího dialogu s výsledkem práce
     */
    createDefaultWorkResult(resultDialog, earnings) {
        // Typ práce v češtině
        const typeName = this.selectedWorkplace.type === 'office' ? 'Kancelářská práce' :
                         this.selectedWorkplace.type === 'programming' ? 'Programování' : 'Manuální práce';

        // Ikona podle typu práce
        const icon = this.selectedWorkplace.type === 'office' ? '💼' :
                     this.selectedWorkplace.type === 'programming' ? '💻' : '🔨';

        // Základní struktura dialogu
        resultDialog.innerHTML = `
            <div class="virtual-work-header">
                <h2><i class="fas fa-check-circle"></i> Práce dokončena</h2>
                <button class="virtual-work-close">&times;</button>
            </div>

            <div class="virtual-work-content" style="padding: 25px; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 20px;">${icon}</div>
                <h3 style="margin-bottom: 5px;">${this.selectedWorkplace.name}</h3>
                <p style="color: #6c757d; margin-bottom: 20px;">${typeName}</p>

                <div style="background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <div style="font-size: 14px; opacity: 0.8;">Váš dnešní výdělek</div>
                    <div style="font-size: 36px; font-weight: 700; margin: 10px 0;">${earnings.toLocaleString()} Kč</div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px;">
                        <div style="font-size: 14px; color: #6c757d;">Odpracováno</div>
                        <div style="font-size: 20px; font-weight: 600;">${this.workSettings.hoursPerDay} hodin</div>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 10px;">
                        <div style="font-size: 14px; color: #6c757d;">Hodinová sazba</div>
                        <div style="font-size: 20px; font-weight: 600;">${Math.round(earnings / this.workSettings.hoursPerDay)} Kč/h</div>
                    </div>
                </div>

                <p style="margin-bottom: 0;">Peníze byly přidány do vašeho účtu. Celkový výdělek: ${Math.round(this.statistics.totalEarned).toLocaleString()} Kč</p>
            </div>

            <div class="virtual-work-actions">
                <div class="virtual-work-buttons" style="width: 100%; justify-content: center;">
                    <button class="virtual-work-btn primary" id="work-result-close">
                        <i class="fas fa-check"></i> OK
                    </button>
                </div>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(resultDialog);

        // Animace otevření
        setTimeout(() => {
            resultDialog.style.opacity = '1';
            resultDialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Přidání event listenerů
        const closeBtn = resultDialog.querySelector('.virtual-work-close');
        const okBtn = resultDialog.querySelector('#work-result-close');

        // Zavření dialogu
        const closeResultDialog = () => {
            // Animace zavření
            resultDialog.style.opacity = '0';
            resultDialog.style.transform = 'translate(-50%, -50%) scale(0.9)';

            // Odstranění dialogu po animaci
            setTimeout(() => {
                resultDialog.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeResultDialog);
        okBtn.addEventListener('click', closeResultDialog);
    }
}

    /**
     * Zobrazení dialogu pro přidání nového příkazu
     */
    showAddCommandDialog() {
        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog add-command-dialog';
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
        dialog.style.transition = 'all 0.3s ease';
        dialog.style.zIndex = '1200';

        // Kategorie příkazů
        const categories = [...new Set(this.commands.map(cmd => cmd.category))];
        let categoriesOptions = '';

        categories.forEach(category => {
            categoriesOptions += `<option value="${category}">${category}</option>`;
        });

        // Základní struktura dialogu
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2><i class="fas fa-plus-circle"></i> Přidat nový příkaz</h2>
                <button class="virtual-work-close">&times;</button>
            </div>

            <div class="virtual-work-content" style="padding: 25px;">
                <div class="add-command-form">
                    <div class="form-group">
                        <label for="command-name">Název příkazu</label>
                        <input type="text" id="command-name" placeholder="Např. Zobrazit mapu">
                    </div>

                    <div class="form-group">
                        <label for="command-description">Popis příkazu</label>
                        <textarea id="command-description" placeholder="Popište, co příkaz dělá..."></textarea>
                    </div>

                    <div class="form-group">
                        <label for="command-text">Text příkazu</label>
                        <input type="text" id="command-text" placeholder="Např. mapa">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="command-category">Kategorie</label>
                            <select id="command-category">
                                ${categoriesOptions}
                                <option value="new">+ Nová kategorie</option>
                            </select>
                        </div>

                        <div class="form-group" id="new-category-group" style="display: none;">
                            <label for="new-category">Nová kategorie</label>
                            <input type="text" id="new-category" placeholder="Název nové kategorie">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="command-icon">Ikona</label>
                        <div class="icon-selector">
                            <input type="text" id="command-icon" placeholder="Emoji nebo ikona">
                            <div class="common-icons">
                                <span class="icon-option" data-icon="🗺️">🗺️</span>
                                <span class="icon-option" data-icon="🔍">🔍</span>
                                <span class="icon-option" data-icon="🚗">🚗</span>
                                <span class="icon-option" data-icon="🏠">🏠</span>
                                <span class="icon-option" data-icon="🍔">🍔</span>
                                <span class="icon-option" data-icon="💼">💼</span>
                                <span class="icon-option" data-icon="📱">📱</span>
                                <span class="icon-option" data-icon="⚙️">⚙️</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="virtual-work-actions">
                <div class="virtual-work-buttons">
                    <button class="virtual-work-btn secondary" id="cancel-add-command">
                        <i class="fas fa-times"></i> Zrušit
                    </button>
                    <button class="virtual-work-btn primary" id="save-new-command">
                        <i class="fas fa-save"></i> Uložit příkaz
                    </button>
                </div>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Animace otevření
        setTimeout(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Event listenery
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#cancel-add-command');
        const saveBtn = dialog.querySelector('#save-new-command');
        const categorySelect = dialog.querySelector('#command-category');
        const newCategoryGroup = dialog.querySelector('#new-category-group');
        const iconOptions = dialog.querySelectorAll('.icon-option');

        // Zavření dialogu
        const closeDialog = () => {
            dialog.style.opacity = '0';
            dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';

            setTimeout(() => {
                dialog.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeDialog);
        cancelBtn.addEventListener('click', closeDialog);

        // Zobrazení pole pro novou kategorii
        categorySelect.addEventListener('change', () => {
            if (categorySelect.value === 'new') {
                newCategoryGroup.style.display = 'block';
            } else {
                newCategoryGroup.style.display = 'none';
            }
        });

        // Výběr ikony
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                const icon = option.dataset.icon;
                dialog.querySelector('#command-icon').value = icon;
            });
        });

        // Uložení nového příkazu
        saveBtn.addEventListener('click', () => {
            const name = dialog.querySelector('#command-name').value.trim();
            const description = dialog.querySelector('#command-description').value.trim();
            const command = dialog.querySelector('#command-text').value.trim();
            const icon = dialog.querySelector('#command-icon').value.trim();
            let category = categorySelect.value;

            // Kontrola povinných polí
            if (!name || !description || !command || !icon) {
                alert('Vyplňte prosím všechna povinná pole.');
                return;
            }

            // Kontrola nové kategorie
            if (category === 'new') {
                const newCategory = dialog.querySelector('#new-category').value.trim();
                if (!newCategory) {
                    alert('Zadejte název nové kategorie.');
                    return;
                }
                category = newCategory;
            }

            // Vytvoření nového příkazu
            const newCommand = {
                id: 'cmd' + (this.commands.length + 1),
                name: name,
                description: description,
                category: category,
                icon: icon,
                command: command,
                status: 'active'
            };

            // Přidání příkazu do seznamu
            this.commands.push(newCommand);

            // Aktualizace sekce příkazů
            const mainDialog = document.querySelector('.virtual-work-dialog:not(.add-command-dialog)');
            if (mainDialog) {
                this.updateCommandsSection(mainDialog);
            }

            // Zavření dialogu
            closeDialog();
        });
    }

    /**
     * Zobrazení dialogu pro úpravu příkazu
     */
    showEditCommandDialog(commandId) {
        // Nalezení příkazu podle ID
        const command = this.commands.find(cmd => cmd.id === commandId);

        if (!command) {
            alert('Příkaz nebyl nalezen.');
            return;
        }

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog edit-command-dialog';
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
        dialog.style.transition = 'all 0.3s ease';
        dialog.style.zIndex = '1200';

        // Kategorie příkazů
        const categories = [...new Set(this.commands.map(cmd => cmd.category))];
        let categoriesOptions = '';

        categories.forEach(category => {
            const selected = category === command.category ? 'selected' : '';
            categoriesOptions += `<option value="${category}" ${selected}>${category}</option>`;
        });

        // Základní struktura dialogu
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2><i class="fas fa-edit"></i> Upravit příkaz</h2>
                <button class="virtual-work-close">&times;</button>
            </div>

            <div class="virtual-work-content" style="padding: 25px;">
                <div class="edit-command-form">
                    <div class="form-group">
                        <label for="command-name">Název příkazu</label>
                        <input type="text" id="command-name" value="${command.name}" placeholder="Např. Zobrazit mapu">
                    </div>

                    <div class="form-group">
                        <label for="command-description">Popis příkazu</label>
                        <textarea id="command-description" placeholder="Popište, co příkaz dělá...">${command.description}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="command-text">Text příkazu</label>
                        <input type="text" id="command-text" value="${command.command}" placeholder="Např. mapa">
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="command-category">Kategorie</label>
                            <select id="command-category">
                                ${categoriesOptions}
                                <option value="new">+ Nová kategorie</option>
                            </select>
                        </div>

                        <div class="form-group" id="new-category-group" style="display: none;">
                            <label for="new-category">Nová kategorie</label>
                            <input type="text" id="new-category" placeholder="Název nové kategorie">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="command-icon">Ikona</label>
                        <div class="icon-selector">
                            <input type="text" id="command-icon" value="${command.icon}" placeholder="Emoji nebo ikona">
                            <div class="common-icons">
                                <span class="icon-option" data-icon="🗺️">🗺️</span>
                                <span class="icon-option" data-icon="🔍">🔍</span>
                                <span class="icon-option" data-icon="🚗">🚗</span>
                                <span class="icon-option" data-icon="🏠">🏠</span>
                                <span class="icon-option" data-icon="🍔">🍔</span>
                                <span class="icon-option" data-icon="💼">💼</span>
                                <span class="icon-option" data-icon="📱">📱</span>
                                <span class="icon-option" data-icon="⚙️">⚙️</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="command-status">Stav</label>
                        <select id="command-status">
                            <option value="active" ${command.status === 'active' ? 'selected' : ''}>Aktivní</option>
                            <option value="inactive" ${command.status === 'inactive' ? 'selected' : ''}>Neaktivní</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="virtual-work-actions">
                <div class="virtual-work-buttons">
                    <button class="virtual-work-btn secondary" id="cancel-edit-command">
                        <i class="fas fa-times"></i> Zrušit
                    </button>
                    <button class="virtual-work-btn danger" id="delete-command">
                        <i class="fas fa-trash"></i> Smazat
                    </button>
                    <button class="virtual-work-btn primary" id="save-edited-command">
                        <i class="fas fa-save"></i> Uložit změny
                    </button>
                </div>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Animace otevření
        setTimeout(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Event listenery
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#cancel-edit-command');
        const saveBtn = dialog.querySelector('#save-edited-command');
        const deleteBtn = dialog.querySelector('#delete-command');
        const categorySelect = dialog.querySelector('#command-category');
        const newCategoryGroup = dialog.querySelector('#new-category-group');
        const iconOptions = dialog.querySelectorAll('.icon-option');

        // Zavření dialogu
        const closeDialog = () => {
            dialog.style.opacity = '0';
            dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';

            setTimeout(() => {
                dialog.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeDialog);
        cancelBtn.addEventListener('click', closeDialog);

        // Zobrazení pole pro novou kategorii
        categorySelect.addEventListener('change', () => {
            if (categorySelect.value === 'new') {
                newCategoryGroup.style.display = 'block';
            } else {
                newCategoryGroup.style.display = 'none';
            }
        });

        // Výběr ikony
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                const icon = option.dataset.icon;
                dialog.querySelector('#command-icon').value = icon;
            });
        });

        // Smazání příkazu
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Opravdu chcete smazat příkaz "${command.name}"?`)) {
                // Nalezení indexu příkazu v poli
                const index = this.commands.findIndex(cmd => cmd.id === commandId);

                if (index !== -1) {
                    // Odstranění příkazu z pole
                    this.commands.splice(index, 1);

                    // Aktualizace sekce příkazů
                    const mainDialog = document.querySelector('.virtual-work-dialog:not(.edit-command-dialog)');
                    if (mainDialog) {
                        this.updateCommandsSection(mainDialog);
                    }

                    // Zavření dialogu
                    closeDialog();
                }
            }
        });

        // Uložení upraveného příkazu
        saveBtn.addEventListener('click', () => {
            const name = dialog.querySelector('#command-name').value.trim();
            const description = dialog.querySelector('#command-description').value.trim();
            const commandText = dialog.querySelector('#command-text').value.trim();
            const icon = dialog.querySelector('#command-icon').value.trim();
            const status = dialog.querySelector('#command-status').value;
            let category = categorySelect.value;

            // Kontrola povinných polí
            if (!name || !description || !commandText || !icon) {
                alert('Vyplňte prosím všechna povinná pole.');
                return;
            }

            // Kontrola nové kategorie
            if (category === 'new') {
                const newCategory = dialog.querySelector('#new-category').value.trim();
                if (!newCategory) {
                    alert('Zadejte název nové kategorie.');
                    return;
                }
                category = newCategory;
            }

            // Aktualizace příkazu
            command.name = name;
            command.description = description;
            command.command = commandText;
            command.icon = icon;
            command.category = category;
            command.status = status;

            // Aktualizace sekce příkazů
            const mainDialog = document.querySelector('.virtual-work-dialog:not(.edit-command-dialog)');
            if (mainDialog) {
                this.updateCommandsSection(mainDialog);
            }

            // Zavření dialogu
            closeDialog();
        });
    }

    /**
     * Zobrazení dialogu pro vylepšení příkazu
     */
    showImproveCommandDialog(commandId) {
        // Nalezení příkazu podle ID
        const command = this.commands.find(cmd => cmd.id === commandId);

        if (!command) {
            alert('Příkaz nebyl nalezen.');
            return;
        }

        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'virtual-work-dialog improve-command-dialog';
        dialog.style.opacity = '0';
        dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
        dialog.style.transition = 'all 0.3s ease';
        dialog.style.zIndex = '1200';

        // Základní struktura dialogu
        dialog.innerHTML = `
            <div class="virtual-work-header">
                <h2><i class="fas fa-magic"></i> Vylepšit příkaz</h2>
                <button class="virtual-work-close">&times;</button>
            </div>

            <div class="virtual-work-content" style="padding: 25px;">
                <div class="improve-command-info">
                    <div class="current-command">
                        <h3>Aktuální příkaz</h3>
                        <div class="command-preview">
                            <div class="command-preview-icon">${command.icon}</div>
                            <div class="command-preview-content">
                                <div class="command-preview-name">${command.name}</div>
                                <div class="command-preview-description">${command.description}</div>
                                <div class="command-preview-text">Příkaz: <span class="command-preview-code">${command.command}</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="improvement-options">
                        <h3>Možnosti vylepšení</h3>
                        <p>Vyberte, co byste chtěli na příkazu vylepšit:</p>

                        <div class="improvement-option">
                            <input type="radio" name="improvement-type" id="improve-functionality" value="functionality" checked>
                            <label for="improve-functionality">Vylepšit funkcionalitu</label>
                            <p class="option-description">AI navrhne, jak rozšířit nebo vylepšit funkce příkazu.</p>
                        </div>

                        <div class="improvement-option">
                            <input type="radio" name="improvement-type" id="improve-description" value="description">
                            <label for="improve-description">Vylepšit popis</label>
                            <p class="option-description">AI navrhne lepší a srozumitelnější popis příkazu.</p>
                        </div>

                        <div class="improvement-option">
                            <input type="radio" name="improvement-type" id="improve-name" value="name">
                            <label for="improve-name">Vylepšit název a příkaz</label>
                            <p class="option-description">AI navrhne lepší název a text příkazu pro snazší použití.</p>
                        </div>

                        <div class="improvement-option">
                            <input type="radio" name="improvement-type" id="improve-all" value="all">
                            <label for="improve-all">Vylepšit vše</label>
                            <p class="option-description">AI navrhne komplexní vylepšení celého příkazu.</p>
                        </div>
                    </div>

                    <div class="improvement-notes">
                        <h3>Poznámky k vylepšení</h3>
                        <p>Máte nějaké specifické požadavky na vylepšení? Napište je zde:</p>
                        <textarea id="improvement-notes" placeholder="Např. Chtěl bych, aby příkaz uměl také..."></textarea>
                    </div>
                </div>
            </div>

            <div class="virtual-work-actions">
                <div class="virtual-work-buttons">
                    <button class="virtual-work-btn secondary" id="cancel-improve-command">
                        <i class="fas fa-times"></i> Zrušit
                    </button>
                    <button class="virtual-work-btn primary" id="generate-improvement">
                        <i class="fas fa-magic"></i> Vygenerovat vylepšení
                    </button>
                </div>
            </div>
        `;

        // Přidání dialogu do stránky
        document.body.appendChild(dialog);

        // Animace otevření
        setTimeout(() => {
            dialog.style.opacity = '1';
            dialog.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);

        // Event listenery
        const closeBtn = dialog.querySelector('.virtual-work-close');
        const cancelBtn = dialog.querySelector('#cancel-improve-command');
        const generateBtn = dialog.querySelector('#generate-improvement');

        // Zavření dialogu
        const closeDialog = () => {
            dialog.style.opacity = '0';
            dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';

            setTimeout(() => {
                dialog.remove();
            }, 300);
        };

        closeBtn.addEventListener('click', closeDialog);
        cancelBtn.addEventListener('click', closeDialog);

        // Generování vylepšení
        generateBtn.addEventListener('click', () => {
            const improvementType = dialog.querySelector('input[name="improvement-type"]:checked').value;
            const notes = dialog.querySelector('#improvement-notes').value.trim();

            // Zde by byla implementace generování vylepšení pomocí AI
            // Pro účely demonstrace zobrazíme pouze dialog s informací

            // Odstranění obsahu dialogu
            dialog.querySelector('.virtual-work-content').innerHTML = `
                <div class="improvement-result" style="text-align: center; padding: 20px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">✨</div>
                    <h3>Generuji vylepšení...</h3>
                    <p>Vaše vylepšení se připravuje. Tato funkce bude plně implementována v další verzi aplikace.</p>
                    <div class="loading-spinner" style="margin: 20px auto;">
                        <i class="fas fa-spinner fa-spin fa-3x"></i>
                    </div>
                    <p>Typ vylepšení: <strong>${improvementType}</strong></p>
                    ${notes ? `<p>Vaše poznámky: <em>${notes}</em></p>` : ''}
                </div>
            `;

            // Změna tlačítek
            dialog.querySelector('.virtual-work-actions').innerHTML = `
                <div class="virtual-work-buttons" style="width: 100%; justify-content: center;">
                    <button class="virtual-work-btn primary" id="close-improvement-result">
                        <i class="fas fa-check"></i> OK
                    </button>
                </div>
            `;

            // Přidání event listeneru pro nové tlačítko
            const okBtn = dialog.querySelector('#close-improvement-result');
            okBtn.addEventListener('click', closeDialog);
        });
    }
}

// Vytvoření globální instance třídy VirtualWorkClass
const VirtualWork = new VirtualWorkClass();
