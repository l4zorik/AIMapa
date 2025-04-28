/**
 * Modul pro reportování bugů
 * Verze 0.3.8.3
 */

const BugReporter = {
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro reportování bugů...');

        // Vytvoření tlačítka pro reportování bugů
        this.createBugReportButton();

        console.log('Modul pro reportování bugů byl inicializován');
    },

    // Vytvoření tlačítka pro reportování bugů
    createBugReportButton() {
        // Kontrola, zda tlačítko již existuje
        if (document.getElementById('bugReportButton')) {
            return;
        }

        // Vytvoření tlačítka
        const bugButton = document.createElement('button');
        bugButton.id = 'bugReportButton';
        bugButton.className = 'bug-report-button';
        bugButton.title = 'Nahlásit bug / Debug konzole';
        bugButton.innerHTML = '<span class="icon">🔵</span>';

        // Přidání tlačítka do dokumentu
        document.body.appendChild(bugButton);

        // Přidání event listeneru
        bugButton.addEventListener('click', () => {
            this.showDebugPopup();
        });

        // Přidání stylů pro tlačítko a debug popup
        const style = document.createElement('style');
        style.textContent = `
            .bug-report-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #3498db;
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                transition: all 0.3s ease;
            }

            .bug-report-button:hover {
                background-color: #2980b9;
                transform: scale(1.1);
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            }

            .bug-report-dialog {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 300px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
                z-index: 9998;
                padding: 15px;
                display: none;
            }

            .bug-report-dialog.show {
                display: block;
                animation: slideUp 0.3s ease;
            }

            /* Debug popup */
            .debug-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                max-width: 800px;
                height: 80%;
                max-height: 600px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                display: none;
            }

            .debug-popup.show {
                display: flex;
                animation: fadeIn 0.3s ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            .debug-popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
            }

            .debug-popup-header h2 {
                margin: 0;
                font-size: 20px;
                color: #333;
            }

            .debug-popup-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #777;
                transition: color 0.2s;
            }

            .debug-popup-close:hover {
                color: #e74c3c;
            }

            .debug-popup-content {
                display: flex;
                flex: 1;
                overflow: hidden;
            }

            .debug-popup-sidebar {
                width: 200px;
                border-right: 1px solid #eee;
                overflow-y: auto;
                padding: 15px 0;
            }

            .debug-popup-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                padding: 15px;
                overflow: hidden;
            }

            .debug-popup-tab {
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.2s;
                font-weight: 500;
            }

            .debug-popup-tab:hover {
                background-color: #f5f5f5;
            }

            .debug-popup-tab.active {
                background-color: #e0f7fa;
                color: #0288d1;
                border-left: 3px solid #0288d1;
            }

            .debug-popup-panel {
                display: none;
                flex-direction: column;
                flex: 1;
                overflow: hidden;
            }

            .debug-popup-panel.active {
                display: flex;
            }

            .debug-popup-input-area {
                display: flex;
                flex-direction: column;
                margin-bottom: 15px;
            }

            .debug-popup-input-area textarea {
                width: 100%;
                height: 120px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                resize: none;
                font-family: monospace;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .debug-popup-input-area .debug-popup-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }

            .debug-popup-input-area button {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            }

            .debug-popup-save {
                background-color: #2ecc71;
                color: white;
            }

            .debug-popup-save:hover {
                background-color: #27ae60;
            }

            .debug-popup-clear {
                background-color: #e74c3c;
                color: white;
            }

            .debug-popup-clear:hover {
                background-color: #c0392b;
            }

            .debug-popup-output {
                flex: 1;
                overflow-y: auto;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                font-family: monospace;
                font-size: 14px;
                background-color: #f9f9f9;
                white-space: pre-wrap;
            }

            .debug-popup-bug-list {
                flex: 1;
                overflow-y: auto;
            }

            .debug-popup-bug-item {
                padding: 10px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }

            .debug-popup-bug-item:last-child {
                border-bottom: none;
            }

            .debug-popup-bug-text {
                flex: 1;
                font-size: 14px;
                color: #555;
                white-space: pre-wrap;
            }

            .debug-popup-bug-actions {
                display: flex;
                gap: 5px;
            }

            .debug-popup-bug-delete {
                background: none;
                border: none;
                color: #e74c3c;
                cursor: pointer;
                font-size: 16px;
                padding: 0 5px;
            }

            .debug-popup-bug-delete:hover {
                color: #c0392b;
            }

            .debug-popup-bug-edit {
                background: none;
                border: none;
                color: #3498db;
                cursor: pointer;
                font-size: 16px;
                padding: 0 5px;
            }

            .debug-popup-bug-edit:hover {
                color: #2980b9;
            }

            .debug-popup-bug-timestamp {
                font-size: 12px;
                color: #999;
                margin-top: 5px;
                display: block;
            }

            /* Tmavý režim */
            body[data-theme="dark"] .debug-popup {
                background-color: #2d3748;
                color: #f7fafc;
            }

            body[data-theme="dark"] .debug-popup-header {
                border-bottom-color: #4a5568;
            }

            body[data-theme="dark"] .debug-popup-header h2 {
                color: #f7fafc;
            }

            body[data-theme="dark"] .debug-popup-close {
                color: #a0aec0;
            }

            body[data-theme="dark"] .debug-popup-close:hover {
                color: #f56565;
            }

            body[data-theme="dark"] .debug-popup-sidebar {
                border-right-color: #4a5568;
            }

            body[data-theme="dark"] .debug-popup-tab:hover {
                background-color: #4a5568;
            }

            body[data-theme="dark"] .debug-popup-tab.active {
                background-color: #2c5282;
                color: #90cdf4;
                border-left-color: #90cdf4;
            }

            body[data-theme="dark"] .debug-popup-input-area textarea {
                background-color: #4a5568;
                border-color: #2d3748;
                color: #f7fafc;
            }

            body[data-theme="dark"] .debug-popup-output {
                background-color: #4a5568;
                border-color: #2d3748;
                color: #f7fafc;
            }

            body[data-theme="dark"] .debug-popup-bug-item {
                border-bottom-color: #4a5568;
            }

            body[data-theme="dark"] .debug-popup-bug-text {
                color: #e2e8f0;
            }

            body[data-theme="dark"] .debug-popup-bug-timestamp {
                color: #a0aec0;
            }

            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .bug-report-dialog h3 {
                margin-top: 0;
                color: #333;
                font-size: 16px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }

            .bug-report-dialog textarea {
                width: 100%;
                height: 100px;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 5px;
                resize: none;
                font-family: inherit;
                font-size: 14px;
                margin-bottom: 10px;
            }

            .bug-report-dialog .bug-report-actions {
                display: flex;
                justify-content: space-between;
            }

            .bug-report-dialog button {
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.2s ease;
            }

            .bug-report-dialog .bug-report-save {
                background-color: #2ecc71;
                color: white;
            }

            .bug-report-dialog .bug-report-save:hover {
                background-color: #27ae60;
            }

            .bug-report-dialog .bug-report-cancel {
                background-color: #e0e0e0;
                color: #333;
            }

            .bug-report-dialog .bug-report-cancel:hover {
                background-color: #bdc3c7;
            }

            .bug-list {
                margin-top: 10px;
                max-height: 150px;
                overflow-y: auto;
            }

            .bug-list-item {
                padding: 8px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .bug-list-item:last-child {
                border-bottom: none;
            }

            .bug-list-item .bug-text {
                flex: 1;
                font-size: 13px;
                color: #555;
            }

            .bug-list-item .bug-delete {
                background: none;
                border: none;
                color: #e74c3c;
                cursor: pointer;
                font-size: 16px;
                padding: 0 5px;
            }

            .bug-list-item .bug-delete:hover {
                color: #c0392b;
            }

            /* Tmavý režim pro původní dialog */
            body[data-theme="dark"] .bug-report-dialog {
                background-color: #2d3748;
                color: #f7fafc;
            }

            body[data-theme="dark"] .bug-report-dialog h3 {
                color: #f7fafc;
                border-bottom-color: #4a5568;
            }

            body[data-theme="dark"] .bug-report-dialog textarea {
                background-color: #4a5568;
                border-color: #2d3748;
                color: #f7fafc;
            }

            body[data-theme="dark"] .bug-report-dialog .bug-report-cancel {
                background-color: #4a5568;
                color: #f7fafc;
            }

            body[data-theme="dark"] .bug-report-dialog .bug-report-cancel:hover {
                background-color: #718096;
            }

            body[data-theme="dark"] .bug-list-item {
                border-bottom-color: #4a5568;
            }

            body[data-theme="dark"] .bug-list-item .bug-text {
                color: #e2e8f0;
            }
        `;

        document.head.appendChild(style);
    },

    // Zobrazení debug popupu
    showDebugPopup() {
        // Kontrola, zda popup již existuje
        let popup = document.querySelector('.debug-popup');

        if (!popup) {
            // Vytvoření popupu
            popup = document.createElement('div');
            popup.className = 'debug-popup';

            // Načtení uložených bugů
            const savedBugs = this.getSavedBugs();

            // Vytvoření obsahu popupu
            popup.innerHTML = `
                <div class="debug-popup-header">
                    <h2>Debug Konzole</h2>
                    <button class="debug-popup-close">&times;</button>
                </div>
                <div class="debug-popup-content">
                    <div class="debug-popup-sidebar">
                        <div class="debug-popup-tab active" data-panel="bugs">Bugy</div>
                        <div class="debug-popup-tab" data-panel="console">Konzole</div>
                        <div class="debug-popup-tab" data-panel="info">Systémové info</div>
                    </div>
                    <div class="debug-popup-main">
                        <!-- Panel pro bugy -->
                        <div class="debug-popup-panel active" data-panel="bugs">
                            <div class="debug-popup-input-area">
                                <textarea placeholder="Popis bugu nebo problému..."></textarea>
                                <div class="debug-popup-actions">
                                    <button class="debug-popup-save">Uložit bug</button>
                                </div>
                            </div>
                            <div class="debug-popup-bug-list">
                                ${savedBugs.map(bug => {
                                    // Rozdělení bugu na text a časové razítko
                                    const parts = bug.split('|TIMESTAMP:');
                                    const bugText = parts[0];
                                    const timestamp = parts.length > 1 ? parts[1] : '';
                                    const formattedDate = timestamp ? new Date(parseInt(timestamp)).toLocaleString() : '';

                                    return `
                                        <div class="debug-popup-bug-item">
                                            <div class="debug-popup-bug-text">
                                                ${bugText}
                                                ${timestamp ? `<span class="debug-popup-bug-timestamp">Přidáno: ${formattedDate}</span>` : ''}
                                            </div>
                                            <div class="debug-popup-bug-actions">
                                                <button class="debug-popup-bug-edit" data-bug="${bug}">✎</button>
                                                <button class="debug-popup-bug-delete" data-bug="${bug}">×</button>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <!-- Panel pro konzoli -->
                        <div class="debug-popup-panel" data-panel="console">
                            <div class="debug-popup-input-area">
                                <textarea placeholder="Zadejte JavaScript kód pro spuštění..."></textarea>
                                <div class="debug-popup-actions">
                                    <button class="debug-popup-clear">Vyčistit konzoli</button>
                                    <button class="debug-popup-execute">Spustit kód</button>
                                </div>
                            </div>
                            <div class="debug-popup-output"></div>
                        </div>

                        <!-- Panel pro systémové informace -->
                        <div class="debug-popup-panel" data-panel="info">
                            <div class="debug-popup-output" id="system-info">
                                Načítání systémových informací...
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Přidání popupu do dokumentu
            document.body.appendChild(popup);

            // Přidání event listenerů
            this.setupDebugPopupEvents(popup);

            // Načtení systémových informací
            this.loadSystemInfo();
        }

        // Zobrazení popupu
        popup.classList.add('show');
    },

    // Nastavení event listenerů pro debug popup
    setupDebugPopupEvents(popup) {
        // Zavření popupu
        const closeButton = popup.querySelector('.debug-popup-close');
        closeButton.addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => {
                popup.remove();
            }, 300);
        });

        // Přepínání mezi panely
        const tabs = popup.querySelectorAll('.debug-popup-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Odstranění aktivní třídy ze všech tabů
                tabs.forEach(t => t.classList.remove('active'));

                // Přidání aktivní třídy na kliknutý tab
                tab.classList.add('active');

                // Skrytí všech panelů
                const panels = popup.querySelectorAll('.debug-popup-panel');
                panels.forEach(p => p.classList.remove('active'));

                // Zobrazení odpovídajícího panelu
                const panelId = tab.getAttribute('data-panel');
                const panel = popup.querySelector(`.debug-popup-panel[data-panel="${panelId}"]`);
                panel.classList.add('active');
            });
        });

        // Uložení bugu
        const bugSaveButton = popup.querySelector('.debug-popup-panel[data-panel="bugs"] .debug-popup-save');
        const bugTextarea = popup.querySelector('.debug-popup-panel[data-panel="bugs"] textarea');

        bugSaveButton.addEventListener('click', () => {
            const bugText = bugTextarea.value.trim();
            if (bugText) {
                this.saveBug(bugText);
                bugTextarea.value = '';
                this.updateBugList(popup);
            }
        });

        // Odstranění bugu
        const deleteButtons = popup.querySelectorAll('.debug-popup-bug-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bugText = e.target.getAttribute('data-bug');
                this.deleteBug(bugText);
                this.updateBugList(popup);
            });
        });

        // Úprava bugu
        const editButtons = popup.querySelectorAll('.debug-popup-bug-edit');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bugData = e.target.getAttribute('data-bug');
                const parts = bugData.split('|TIMESTAMP:');
                const bugText = parts[0];

                // Nastavení textu do textarey
                bugTextarea.value = bugText;
                bugTextarea.focus();

                // Odstranění původního bugu
                this.deleteBug(bugData);
                this.updateBugList(popup);
            });
        });

        // Spuštění kódu v konzoli
        const executeButton = popup.querySelector('.debug-popup-panel[data-panel="console"] .debug-popup-execute');
        const consoleTextarea = popup.querySelector('.debug-popup-panel[data-panel="console"] textarea');
        const consoleOutput = popup.querySelector('.debug-popup-panel[data-panel="console"] .debug-popup-output');

        executeButton.addEventListener('click', () => {
            const code = consoleTextarea.value.trim();
            if (code) {
                try {
                    // Přesměrování console.log
                    const originalConsoleLog = console.log;
                    const originalConsoleError = console.error;
                    const originalConsoleWarn = console.warn;
                    const originalConsoleInfo = console.info;

                    let output = '';

                    console.log = (...args) => {
                        originalConsoleLog(...args);
                        output += args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ') + '\n';
                    };

                    console.error = (...args) => {
                        originalConsoleError(...args);
                        output += '❌ ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ') + '\n';
                    };

                    console.warn = (...args) => {
                        originalConsoleWarn(...args);
                        output += '⚠️ ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ') + '\n';
                    };

                    console.info = (...args) => {
                        originalConsoleInfo(...args);
                        output += 'ℹ️ ' + args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ') + '\n';
                    };

                    // Spuštění kódu
                    const result = eval(code);

                    // Obnovení původních funkcí
                    console.log = originalConsoleLog;
                    console.error = originalConsoleError;
                    console.warn = originalConsoleWarn;
                    console.info = originalConsoleInfo;

                    // Zobrazení výsledku
                    if (result !== undefined) {
                        output += '\nVýsledek: ' + (typeof result === 'object' ? JSON.stringify(result, null, 2) : result);
                    }

                    consoleOutput.textContent = output || 'Kód byl spuštěn bez výstupu.';
                } catch (error) {
                    consoleOutput.textContent = 'Chyba: ' + error.message;
                }
            }
        });

        // Vyčištění konzole
        const clearButton = popup.querySelector('.debug-popup-panel[data-panel="console"] .debug-popup-clear');
        clearButton.addEventListener('click', () => {
            consoleOutput.textContent = '';
        });
    },

    // Aktualizace seznamu bugů
    updateBugList(popup) {
        const bugList = popup.querySelector('.debug-popup-bug-list');
        const savedBugs = this.getSavedBugs();

        bugList.innerHTML = savedBugs.map(bug => {
            // Rozdělení bugu na text a časové razítko
            const parts = bug.split('|TIMESTAMP:');
            const bugText = parts[0];
            const timestamp = parts.length > 1 ? parts[1] : '';
            const formattedDate = timestamp ? new Date(parseInt(timestamp)).toLocaleString() : '';

            return `
                <div class="debug-popup-bug-item">
                    <div class="debug-popup-bug-text">
                        ${bugText}
                        ${timestamp ? `<span class="debug-popup-bug-timestamp">Přidáno: ${formattedDate}</span>` : ''}
                    </div>
                    <div class="debug-popup-bug-actions">
                        <button class="debug-popup-bug-edit" data-bug="${bug}">✎</button>
                        <button class="debug-popup-bug-delete" data-bug="${bug}">×</button>
                    </div>
                </div>
            `;
        }).join('');

        // Přidání event listenerů pro nové tlačítka
        const deleteButtons = bugList.querySelectorAll('.debug-popup-bug-delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bugText = e.target.getAttribute('data-bug');
                this.deleteBug(bugText);
                this.updateBugList(popup);
            });
        });

        // Přidání event listenerů pro tlačítka úpravy
        const editButtons = bugList.querySelectorAll('.debug-popup-bug-edit');
        const bugTextarea = popup.querySelector('.debug-popup-panel[data-panel="bugs"] textarea');

        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bugData = e.target.getAttribute('data-bug');
                const parts = bugData.split('|TIMESTAMP:');
                const bugText = parts[0];

                // Nastavení textu do textarey
                bugTextarea.value = bugText;
                bugTextarea.focus();

                // Odstranění původního bugu
                this.deleteBug(bugData);
                this.updateBugList(popup);
            });
        });
    },

    // Načtení systémových informací
    loadSystemInfo() {
        const systemInfoElement = document.getElementById('system-info');
        if (!systemInfoElement) return;

        // Získání informací o prohlížeči a systému
        const browserInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookiesEnabled: navigator.cookieEnabled,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio,
            localStorage: typeof localStorage !== 'undefined',
            sessionStorage: typeof sessionStorage !== 'undefined',
            online: navigator.onLine
        };

        // Získání informací o aplikaci
        const appInfo = {
            version: '0.3.8.2',
            darkMode: document.body.getAttribute('data-theme') === 'dark',
            mapLoaded: typeof map !== 'undefined',
            modulesLoaded: {
                UserProgress: typeof UserProgress !== 'undefined',
                VirtualWork: typeof VirtualWork !== 'undefined',
                CommandsMenu: typeof CommandsMenu !== 'undefined',
                UpdatesNotification: typeof UpdatesNotification !== 'undefined',
                MoneyIndicator: typeof MoneyIndicator !== 'undefined',
                CryptoFinances: typeof CryptoFinances !== 'undefined',
                Achievements: typeof Achievements !== 'undefined',
                IdleDetection: typeof IdleDetection !== 'undefined'
            }
        };

        // Získání informací o localStorage
        const storageInfo = {};
        if (typeof localStorage !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                try {
                    const value = localStorage.getItem(key);
                    const size = value ? value.length : 0;
                    storageInfo[key] = {
                        size: `${size} B`,
                        type: this.getValueType(value)
                    };
                } catch (e) {
                    storageInfo[key] = {
                        size: 'N/A',
                        type: 'Error: ' + e.message
                    };
                }
            }
        }

        // Formátování informací do HTML
        let html = '<h3>Informace o prohlížeči</h3>';
        html += '<pre>' + JSON.stringify(browserInfo, null, 2) + '</pre>';

        html += '<h3>Informace o aplikaci</h3>';
        html += '<pre>' + JSON.stringify(appInfo, null, 2) + '</pre>';

        html += '<h3>Informace o localStorage</h3>';
        html += '<pre>' + JSON.stringify(storageInfo, null, 2) + '</pre>';

        // Zobrazení informací
        systemInfoElement.innerHTML = html;
    },

    // Pomocná funkce pro určení typu hodnoty
    getValueType(value) {
        if (!value) return 'empty';

        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? 'array' : typeof parsed;
        } catch (e) {
            return 'string';
        }
    },

    // Zobrazení původního dialogu pro reportování bugů (pro zpětnou kompatibilitu)
    showBugReportDialog() {
        // Místo původního dialogu zobrazíme nový debug popup
        this.showDebugPopup();
    },

    // Uložení bugu
    saveBug(bugText) {
        const bugs = this.getSavedBugs();
        // Přidání časového razítka k bugu
        const bugWithTimestamp = bugText + '|TIMESTAMP:' + Date.now();
        bugs.push(bugWithTimestamp);
        localStorage.setItem('aiMapaBugs', JSON.stringify(bugs));
    },

    // Odstranění bugu
    deleteBug(bugText) {
        let bugs = this.getSavedBugs();
        bugs = bugs.filter(bug => bug !== bugText);
        localStorage.setItem('aiMapaBugs', JSON.stringify(bugs));
    },

    // Získání uložených bugů
    getSavedBugs() {
        const bugsJson = localStorage.getItem('aiMapaBugs');
        return bugsJson ? JSON.parse(bugsJson) : [];
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    BugReporter.init();
});
