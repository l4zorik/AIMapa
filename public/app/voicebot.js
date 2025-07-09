/**
 * AIMapa VoiceBot Module
 * Verze 0.3.8.6 - Nový voicebot systém
 * 
 * Tento modul implementuje kompletní voicebot funkcionalitu včetně:
 * - Rozpoznávání řeči (Speech Recognition)
 * - Syntéza řeči (Text-to-Speech)
 * - Hlasové příkazy pro ovládání mapy
 * - Hlasový chat s AI
 * - Hlasové navigace
 */

class VoiceBot {
    constructor() {
        this.isInitialized = false;
        this.isListening = false;
        this.isSpeaking = false;
        this.recognition = null;
        this.synthesis = null;
        this.currentVoice = null;
        this.volume = 0.8;
        this.rate = 1.0;
        this.pitch = 1.0;
        this.language = 'cs-CZ';
        
        // Hlasové příkazy
        this.voiceCommands = {
            // Mapové příkazy
            'přiblíž': () => this.executeMapCommand('zoomIn'),
            'oddal': () => this.executeMapCommand('zoomOut'),
            'střed': () => this.executeMapCommand('center'),
            'fullscreen': () => this.executeMapCommand('fullscreen'),
            'glóbus': () => this.executeMapCommand('globe'),
            
            // Navigační příkazy
            'vypočítej trasu': () => this.executeNavigationCommand('calculateRoute'),
            'vymaž trasu': () => this.executeNavigationCommand('clearRoute'),
            'najdi místo': () => this.executeNavigationCommand('findPlace'),
            
            // Pracovní příkazy
            'virtuální práce': () => this.executeWorkCommand('openWork'),
            'dokončit práci': () => this.executeWorkCommand('finishWork'),
            'nový úkol': () => this.executeWorkCommand('newTask'),
            
            // Systémové příkazy
            'nápověda': () => this.showHelp(),
            'nastavení': () => this.openSettings(),
            'zavři': () => this.stopListening(),
            'mlč': () => this.stopSpeaking()
        };
        
        // Frázové odpovědi
        this.responses = {
            greeting: [
                'Dobrý den! Jsem váš hlasový asistent AIMapa. Jak vám mohu pomoci?',
                'Ahoj! Říkejte mi, co potřebujete.',
                'Vítejte! Jsem připraven vám pomoci s mapou a navigací.'
            ],
            listening: [
                'Poslouchám...',
                'Říkejte...',
                'Jsem tu pro vás...'
            ],
            notUnderstood: [
                'Promiňte, nerozuměl jsem. Můžete to zopakovat?',
                'Neporozuměl jsem vašemu příkazu. Zkuste to prosím znovu.',
                'Omlouvám se, ale tento příkaz neznám. Řekněte "nápověda" pro seznam příkazů.'
            ],
            error: [
                'Nastala chyba. Zkuste to prosím znovu.',
                'Něco se pokazilo. Můžete zopakovat váš požadavek?'
            ],
            success: [
                'Hotovo!',
                'Příkaz byl proveden.',
                'Úspěšně dokončeno.'
            ]
        };
    }

    /**
     * Inicializace voicebot modulu
     */
    async init() {
        if (this.isInitialized) return;

        console.log('Inicializace VoiceBot modulu...');

        try {
            // Kontrola podpory prohlížeče
            if (!this.checkBrowserSupport()) {
                throw new Error('Prohlížeč nepodporuje hlasové funkce');
            }

            // Inicializace rozpoznávání řeči
            await this.initSpeechRecognition();
            
            // Inicializace syntézy řeči
            await this.initSpeechSynthesis();
            
            // Vytvoření UI
            this.createVoiceBotUI();
            
            // Načtení nastavení
            this.loadSettings();
            
            this.isInitialized = true;
            console.log('VoiceBot byl úspěšně inicializován');
            
            // Uvítací zpráva
            this.speak(this.getRandomResponse('greeting'));
            
        } catch (error) {
            console.error('Chyba při inicializaci VoiceBot:', error);
            this.showError('Nepodařilo se inicializovat hlasové funkce: ' + error.message);
        }
    }

    /**
     * Kontrola podpory prohlížeče
     */
    checkBrowserSupport() {
        const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        const hasSynthesis = 'speechSynthesis' in window;
        
        if (!hasRecognition) {
            console.warn('Prohlížeč nepodporuje rozpoznávání řeči');
        }
        
        if (!hasSynthesis) {
            console.warn('Prohlížeč nepodporuje syntézu řeči');
        }
        
        return hasRecognition && hasSynthesis;
    }

    /**
     * Inicializace rozpoznávání řeči
     */
    async initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            throw new Error('Rozpoznávání řeči není podporováno');
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.language;
        this.recognition.maxAlternatives = 1;

        // Event listenery
        this.recognition.onstart = () => {
            console.log('Rozpoznávání řeči spuštěno');
            this.isListening = true;
            this.updateUI();
            this.speak(this.getRandomResponse('listening'));
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            console.log('Rozpoznaný text:', transcript);
            this.processVoiceCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Chyba rozpoznávání řeči:', event.error);
            this.isListening = false;
            this.updateUI();
            
            if (event.error !== 'no-speech') {
                this.speak(this.getRandomResponse('error'));
            }
        };

        this.recognition.onend = () => {
            console.log('Rozpoznávání řeči ukončeno');
            this.isListening = false;
            this.updateUI();
        };
    }

    /**
     * Inicializace syntézy řeči
     */
    async initSpeechSynthesis() {
        if (!window.speechSynthesis) {
            throw new Error('Syntéza řeči není podporována');
        }

        this.synthesis = window.speechSynthesis;
        
        // Čekání na načtení hlasů
        return new Promise((resolve) => {
            const loadVoices = () => {
                const voices = this.synthesis.getVoices();
                
                // Hledání českého hlasu
                this.currentVoice = voices.find(voice => 
                    voice.lang.startsWith('cs') || 
                    voice.lang.startsWith('sk')
                ) || voices[0];
                
                console.log('Dostupné hlasy:', voices.length);
                console.log('Vybraný hlas:', this.currentVoice?.name || 'Výchozí');
                
                resolve();
            };

            if (this.synthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                this.synthesis.onvoiceschanged = loadVoices;
            }
        });
    }

    /**
     * Vytvoření uživatelského rozhraní
     */
    createVoiceBotUI() {
        // Kontrola, zda UI již existuje
        if (document.getElementById('voicebot-container')) return;

        const container = document.createElement('div');
        container.id = 'voicebot-container';
        container.className = 'voicebot-container';
        
        container.innerHTML = `
            <div class="voicebot-panel">
                <div class="voicebot-header">
                    <span class="voicebot-title">🎤 VoiceBot</span>
                    <button class="voicebot-settings-btn" title="Nastavení">⚙️</button>
                </div>
                <div class="voicebot-controls">
                    <button id="voicebot-listen-btn" class="voicebot-btn voicebot-listen-btn" title="Spustit naslouchání">
                        <span class="voicebot-icon">🎤</span>
                        <span class="voicebot-text">Mluvit</span>
                    </button>
                    <button id="voicebot-stop-btn" class="voicebot-btn voicebot-stop-btn" title="Zastavit mluvení">
                        <span class="voicebot-icon">🔇</span>
                        <span class="voicebot-text">Ticho</span>
                    </button>
                </div>
                <div class="voicebot-status">
                    <span id="voicebot-status-text">Připraven</span>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        
        // Přidání event listenerů
        this.setupEventListeners();
        
        // Načtení CSS
        this.loadVoiceBotCSS();
    }

    /**
     * Nastavení event listenerů
     */
    setupEventListeners() {
        const listenBtn = document.getElementById('voicebot-listen-btn');
        const stopBtn = document.getElementById('voicebot-stop-btn');
        const settingsBtn = document.querySelector('.voicebot-settings-btn');

        if (listenBtn) {
            listenBtn.addEventListener('click', () => {
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            });
        }

        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopSpeaking();
            });
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.openSettings();
            });
        }
    }

    /**
     * Načtení CSS pro VoiceBot
     */
    loadVoiceBotCSS() {
        if (document.getElementById('voicebot-styles')) return;

        const style = document.createElement('style');
        style.id = 'voicebot-styles';
        style.textContent = `
            .voicebot-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                min-width: 200px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            [data-theme="dark"] .voicebot-container {
                background: rgba(30, 30, 30, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: white;
            }

            .voicebot-panel {
                padding: 15px;
            }

            .voicebot-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }

            [data-theme="dark"] .voicebot-header {
                border-bottom-color: rgba(255, 255, 255, 0.1);
            }

            .voicebot-title {
                font-weight: 600;
                font-size: 14px;
            }

            .voicebot-settings-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 6px;
                transition: background-color 0.2s;
            }

            .voicebot-settings-btn:hover {
                background: rgba(0, 0, 0, 0.1);
            }

            [data-theme="dark"] .voicebot-settings-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .voicebot-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }

            .voicebot-btn {
                flex: 1;
                padding: 10px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }

            .voicebot-listen-btn {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
            }

            .voicebot-listen-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            }

            .voicebot-listen-btn.listening {
                background: linear-gradient(135deg, #f44336, #d32f2f);
                animation: pulse 1.5s infinite;
            }

            .voicebot-stop-btn {
                background: linear-gradient(135deg, #ff9800, #f57c00);
                color: white;
            }

            .voicebot-stop-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
            }

            .voicebot-icon {
                font-size: 16px;
            }

            .voicebot-text {
                font-size: 11px;
            }

            .voicebot-status {
                text-align: center;
                font-size: 12px;
                color: #666;
                font-style: italic;
            }

            [data-theme="dark"] .voicebot-status {
                color: #ccc;
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.7; }
                100% { opacity: 1; }
            }

            @media (max-width: 768px) {
                .voicebot-container {
                    top: 10px;
                    right: 10px;
                    min-width: 180px;
                }
                
                .voicebot-panel {
                    padding: 12px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
`;

        document.head.appendChild(style);
    }

    /**
     * Spuštění naslouchání
     */
    startListening() {
        if (!this.recognition || this.isListening) return;

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Chyba při spuštění naslouchání:', error);
            this.speak('Nepodařilo se spustit naslouchání');
        }
    }

    /**
     * Zastavení naslouchání
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    /**
     * Mluvení textu
     */
    speak(text, options = {}) {
        if (!this.synthesis || this.isSpeaking) {
            // Zastavíme aktuální mluvení
            this.stopSpeaking();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.currentVoice;
        utterance.volume = options.volume || this.volume;
        utterance.rate = options.rate || this.rate;
        utterance.pitch = options.pitch || this.pitch;
        utterance.lang = this.language;

        utterance.onstart = () => {
            this.isSpeaking = true;
            this.updateUI();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateUI();
        };

        utterance.onerror = (event) => {
            console.error('Chyba při mluvení:', event.error);
            this.isSpeaking = false;
            this.updateUI();
        };

        this.synthesis.speak(utterance);
    }

    /**
     * Zastavení mluvení
     */
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            this.updateUI();
        }
    }

    /**
     * Zpracování hlasového příkazu
     */
    processVoiceCommand(transcript) {
        console.log('Zpracovávám hlasový příkaz:', transcript);

        // Hledání přesné shody
        for (const [command, action] of Object.entries(this.voiceCommands)) {
            if (transcript.includes(command.toLowerCase())) {
                try {
                    action();
                    this.speak(this.getRandomResponse('success'));
                    return;
                } catch (error) {
                    console.error('Chyba při provádění příkazu:', error);
                    this.speak(this.getRandomResponse('error'));
                    return;
                }
            }
        }

        // Pokud nebyl nalezen přesný příkaz, zkusíme AI chat
        this.processAIChat(transcript);
    }

    /**
     * Zpracování AI chatu
     */
    processAIChat(text) {
        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(`🎤 ${text}`, true);
        }

        // Simulace AI odpovědi
        const response = this.generateAIResponse(text);

        if (typeof addMessage !== 'undefined') {
            addMessage(response, false);
        }

        this.speak(response);
    }

    /**
     * Generování AI odpovědi
     */
    generateAIResponse(input) {
        const lowercaseInput = input.toLowerCase();

        // Mapové dotazy
        if (lowercaseInput.includes('mapa') || lowercaseInput.includes('kde')) {
            return 'Mohu vám pomoci s mapou. Řekněte například "přiblíž", "oddal" nebo "najdi místo".';
        }

        // Pracovní dotazy
        if (lowercaseInput.includes('práce') || lowercaseInput.includes('úkol')) {
            return 'Můžete říct "virtuální práce" pro otevření pracovního modulu nebo "nový úkol" pro vytvoření úkolu.';
        }

        // Navigační dotazy
        if (lowercaseInput.includes('trasa') || lowercaseInput.includes('cesta')) {
            return 'Pro navigaci řekněte "vypočítej trasu" nebo "vymaž trasu". Mohu také najít místa na mapě.';
        }

        // Obecné dotazy
        if (lowercaseInput.includes('pomoc') || lowercaseInput.includes('nápověda')) {
            return 'Jsem váš hlasový asistent. Mohu ovládat mapu, navigaci, virtuální práci a další funkce. Řekněte "nápověda" pro seznam příkazů.';
        }

        // Výchozí odpověď
        return this.getRandomResponse('notUnderstood');
    }

    /**
     * Provedení mapového příkazu
     */
    executeMapCommand(command) {
        switch (command) {
            case 'zoomIn':
                if (window.map) {
                    window.map.zoomIn();
                }
                break;
            case 'zoomOut':
                if (window.map) {
                    window.map.zoomOut();
                }
                break;
            case 'center':
                if (window.map) {
                    window.map.setView([50.0755, 14.4378], 13);
                }
                break;
            case 'fullscreen':
                if (typeof toggleFullscreen !== 'undefined') {
                    toggleFullscreen();
                }
                break;
            case 'globe':
                if (typeof toggleGlobe !== 'undefined') {
                    toggleGlobe();
                }
                break;
        }
    }

    /**
     * Provedení navigačního příkazu
     */
    executeNavigationCommand(command) {
        switch (command) {
            case 'calculateRoute':
                if (typeof calculateRoute !== 'undefined') {
                    calculateRoute();
                }
                break;
            case 'clearRoute':
                if (typeof clearRoute !== 'undefined') {
                    clearRoute();
                }
                break;
            case 'findPlace':
                this.speak('Řekněte název místa, které chcete najít.');
                // Spustíme naslouchání pro název místa
                setTimeout(() => this.startListening(), 1000);
                break;
        }
    }

    /**
     * Provedení pracovního příkazu
     */
    executeWorkCommand(command) {
        switch (command) {
            case 'openWork':
                if (typeof VirtualWork !== 'undefined' && VirtualWork.openWorkDialog) {
                    VirtualWork.openWorkDialog();
                }
                break;
            case 'finishWork':
                // Implementace dokončení práce
                this.speak('Práce byla dokončena.');
                break;
            case 'newTask':
                // Implementace nového úkolu
                this.speak('Vytvářím nový úkol.');
                break;
        }
    }

    /**
     * Zobrazení nápovědy
     */
    showHelp() {
        const helpText = `Dostupné hlasové příkazy:

Mapa: přiblíž, oddal, střed, fullscreen, glóbus
Navigace: vypočítej trasu, vymaž trasu, najdi místo
Práce: virtuální práce, dokončit práci, nový úkol
Systém: nápověda, nastavení, zavři, mlč

Můžete také mluvit přirozeně a já se pokusím porozumět.`;

        this.speak('Zobrazuji nápovědu hlasových příkazů.');

        if (typeof addMessage !== 'undefined') {
            addMessage(helpText, false);
        }
    }

    /**
     * Otevření nastavení
     */
    openSettings() {
        this.speak('Otevírám nastavení hlasového asistenta.');
        // Implementace nastavení bude přidána později
    }

    /**
     * Získání náhodné odpovědi
     */
    getRandomResponse(category) {
        const responses = this.responses[category];
        if (!responses || responses.length === 0) {
            return 'Promiňte, nemám odpověď.';
        }
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Aktualizace UI
     */
    updateUI() {
        const listenBtn = document.getElementById('voicebot-listen-btn');
        const statusText = document.getElementById('voicebot-status-text');

        if (listenBtn) {
            if (this.isListening) {
                listenBtn.classList.add('listening');
                listenBtn.querySelector('.voicebot-text').textContent = 'Naslouchám';
            } else {
                listenBtn.classList.remove('listening');
                listenBtn.querySelector('.voicebot-text').textContent = 'Mluvit';
            }
        }

        if (statusText) {
            if (this.isListening) {
                statusText.textContent = 'Naslouchám...';
            } else if (this.isSpeaking) {
                statusText.textContent = 'Mluvím...';
            } else {
                statusText.textContent = 'Připraven';
            }
        }
    }

    /**
     * Načtení nastavení
     */
    loadSettings() {
        const settings = localStorage.getItem('voicebot-settings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                this.volume = parsed.volume || this.volume;
                this.rate = parsed.rate || this.rate;
                this.pitch = parsed.pitch || this.pitch;
                this.language = parsed.language || this.language;
            } catch (error) {
                console.error('Chyba při načítání nastavení VoiceBot:', error);
            }
        }
    }

    /**
     * Uložení nastavení
     */
    saveSettings() {
        const settings = {
            volume: this.volume,
            rate: this.rate,
            pitch: this.pitch,
            language: this.language
        };
        localStorage.setItem('voicebot-settings', JSON.stringify(settings));
    }

    /**
     * Zobrazení chyby
     */
    showError(message) {
        console.error('VoiceBot Error:', message);
        if (typeof addMessage !== 'undefined') {
            addMessage(`❌ VoiceBot: ${message}`, false);
        }
    }
}

// Globální instance VoiceBot
window.VoiceBot = new VoiceBot();

// Automatická inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Malé zpoždění pro zajištění načtení ostatních modulů
    setTimeout(() => {
        window.VoiceBot.init();
    }, 1000);
});
