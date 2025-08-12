/**
 * AIMapa - AI Asistent
 * Verze 0.3.8.6
 * 
 * Tento soubor obsahuje kód pro AI asistenta
 * a zpracování uživatelských zpráv.
 */

// Globální objekt pro AI asistenta
const AIAssistant = {
    // Stav asistenta
    state: {
        initialized: false,
        chatMessages: null,
        messageInput: null,
        sendButton: null,
        isMinimized: false,
        messageHistory: []
    },
    
    // Inicializace modulu
    init: function() {
        console.log('Inicializace modulu pro AI asistenta...');
        
        // Inicializace chat elementů
        this.initChatElements();
        
        // Nastavení event listenerů
        this.setupEventListeners();
        
        // Nastavení stavu
        this.state.initialized = true;
        
        console.log('Modul pro AI asistenta byl inicializován');
        
        // Přidání uvítací zprávy
        this.addMessage('Vítejte v AI Mapě! Jak vám mohu pomoci? Můžete se mě zeptat na vyhledání trasy, místa nebo informace o dopravě.', false);
    },
    
    // Inicializace chat elementů
    initChatElements: function() {
        console.log('Inicializace chat elementů...');
        
        // Získání referencí na elementy
        this.state.chatMessages = document.getElementById('chatMessages');
        this.state.messageInput = document.getElementById('aiInput');
        this.state.sendButton = document.getElementById('sendMessage');
        
        // Kontrola, zda byly elementy nalezeny
        if (!this.state.chatMessages) {
            console.error('Element pro zprávy chatu nebyl nalezen!');
        }
        
        if (!this.state.messageInput) {
            console.error('Element pro vstup zpráv nebyl nalezen!');
        }
        
        if (!this.state.sendButton) {
            console.error('Element pro tlačítko odeslání nebyl nalezen!');
        }
        
        console.log('Chat elementy byly inicializovány:', {
            chatMessages: !!this.state.chatMessages,
            messageInput: !!this.state.messageInput,
            sendButton: !!this.state.sendButton
        });
    },
    
    // Nastavení event listenerů
    setupEventListeners: function() {
        console.log('Nastavení event listenerů pro AI asistenta...');
        
        // Event listener pro tlačítko odeslání
        if (this.state.sendButton) {
            this.state.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
        
        // Event listener pro vstupní pole (odeslání klávesou Enter)
        if (this.state.messageInput) {
            this.state.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        // Event listener pro tlačítko minimalizace
        const minimizeBtn = document.getElementById('minimizeMainChat');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.toggleMinimize();
            });
        }
    },
    
    // Odeslání zprávy
    sendMessage: function() {
        console.log('Odesílání zprávy...');
        
        // Kontrola, zda je vstupní pole inicializováno
        if (!this.state.messageInput) {
            console.error('Element pro vstup zpráv není inicializován!');
            return;
        }
        
        // Získání textu zprávy
        const message = this.state.messageInput.value.trim();
        
        // Kontrola, zda zpráva není prázdná
        if (!message) {
            console.log('Zpráva je prázdná, nebudu ji odesílat');
            return;
        }
        
        // Přidání zprávy uživatele do chatu
        this.addMessage(message, true);
        
        // Vyčištění vstupního pole
        this.state.messageInput.value = '';
        
        // Zpracování zprávy
        const response = this.processUserInput(message);
        
        // Přidání odpovědi do chatu s malým zpožděním
        setTimeout(() => {
            this.addMessage(response, false);
        }, 500);
    },
    
    // Přidání zprávy do chatu
    addMessage: function(message, isUser = false, suggestions = null) {
        console.log(`Přidání zprávy do chatu: ${isUser ? 'Uživatel' : 'AI'}`);
        
        // Kontrola, zda je element pro zprávy inicializován
        if (!this.state.chatMessages) {
            console.error('Element pro zprávy chatu není inicializován!');
            return;
        }
        
        // Vytvoření kontejneru pro zprávu a případné návrhy
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        // Vytvoření elementu pro zprávu
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
        
        // Zpracování zprávy - nahrazení odřádkování HTML značkami
        const formattedMessage = message.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedMessage;
        
        messageContainer.appendChild(messageDiv);
        
        // Přidání návrhů dalších akcí, pokud existují
        if (!isUser && suggestions && Array.isArray(suggestions) && suggestions.length > 0) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'suggestions-container';
            
            suggestions.forEach(suggestion => {
                const suggestionBtn = document.createElement('button');
                suggestionBtn.className = 'suggestion-btn';
                suggestionBtn.textContent = suggestion;
                suggestionBtn.addEventListener('click', () => {
                    // Při kliknutí na návrh se chová jako by uživatel napsal zprávu
                    this.addMessage(suggestion, true);
                    const response = this.processUserInput(suggestion);
                    setTimeout(() => {
                        this.addMessage(response, false);
                    }, 500);
                });
                suggestionsContainer.appendChild(suggestionBtn);
            });
            
            messageContainer.appendChild(suggestionsContainer);
        }
        
        // Přidání kontejneru do chatu
        this.state.chatMessages.appendChild(messageContainer);
        this.state.chatMessages.scrollTop = this.state.chatMessages.scrollHeight;
        
        // Přidání zprávy do historie
        this.state.messageHistory.push({
            text: message,
            isUser: isUser,
            timestamp: new Date().toISOString()
        });
        
        // Přidání XP za rozhodnutí uživatele
        if (isUser && typeof UserProgress !== 'undefined') {
            // Získání XP za každé rozhodnutí uživatele (2-5 XP)
            const messageLength = message.length;
            let xpAmount = 2; // Základní hodnota XP
            
            // Delší zprávy získávají více XP (až do maxima 5 XP)
            if (messageLength > 20) xpAmount = 3;
            if (messageLength > 50) xpAmount = 4;
            if (messageLength > 100) xpAmount = 5;
            
            // Přidání XP s kategorií 'decisions'
            UserProgress.addXP(xpAmount, 'Rozhodnutí v chatu');
        }
    },
    
    // Zpracování uživatelského vstupu
    processUserInput: function(input) {
        console.log(`Zpracování uživatelského vstupu: ${input}`);
        
        const lowercaseInput = input.toLowerCase().trim();
        
        // Kontrola příkazů pro navigaci na body
        if (typeof markerProperties !== 'undefined') {
            for (let i = 0; i < markerProperties.length; i++) {
                if (markerProperties[i] && lowercaseInput === markerProperties[i].command.toLowerCase()) {
                    return this.navigateToMarker(i);
                }
            }
        }
        
        // Kontrola příkazů pro vyhledávání tras
        if (lowercaseInput.includes('trasa') || 
            lowercaseInput.includes('cesta') || 
            lowercaseInput.includes('navigace') || 
            lowercaseInput.includes('jak se dostat')) {
            
            // Extrakce míst z dotazu
            const fromMatch = input.match(/z\s+([^,]+)(?:\s+do|\s*,)/i);
            const toMatch = input.match(/do\s+([^,]+)(?:\s+z|\s*,|\s*$)/i);
            
            if (fromMatch && toMatch) {
                const from = fromMatch[1].trim();
                const to = toMatch[1].trim();
                
                // Kontrola, zda je k dispozici modul pro vyhledávání tras
                if (typeof RouteSearch !== 'undefined') {
                    // Nastavení hodnot do formuláře
                    const startPointInput = document.getElementById('startPointInput');
                    const endPointInput = document.getElementById('endPointInput');
                    
                    if (startPointInput && endPointInput) {
                        startPointInput.value = from;
                        endPointInput.value = to;
                        
                        // Výpočet trasy
                        RouteSearch.calculateRoute();
                        
                        return `Vyhledávám trasu z ${from} do ${to}...`;
                    }
                }
                
                return `Chcete najít trasu z ${from} do ${to}. Bohužel, modul pro vyhledávání tras není k dispozici.`;
            } else {
                return 'Pro vyhledání trasy potřebuji znát odkud a kam chcete cestovat. Například: "Najdi trasu z Prahy do Brna".';
            }
        }
        
        // Kontrola příkazů pro vyhledávání míst
        if (lowercaseInput.includes('najdi') || 
            lowercaseInput.includes('vyhledej') || 
            lowercaseInput.includes('hledej') || 
            lowercaseInput.includes('kde je')) {
            
            // Kontrola typu místa
            let placeType = 'restaurace'; // Výchozí typ
            
            if (lowercaseInput.includes('restauraci') || lowercaseInput.includes('restaurace') || lowercaseInput.includes('jídlo')) {
                placeType = 'restaurace';
            } else if (lowercaseInput.includes('hotel') || lowercaseInput.includes('ubytování')) {
                placeType = 'hotel';
            } else if (lowercaseInput.includes('kavárnu') || lowercaseInput.includes('kavárna') || lowercaseInput.includes('káva')) {
                placeType = 'kavárna';
            } else if (lowercaseInput.includes('atrakci') || lowercaseInput.includes('atrakce') || lowercaseInput.includes('muzeum') || lowercaseInput.includes('památka')) {
                placeType = 'atrakce';
            }
            
            // Kontrola, zda je k dispozici funkce pro vyhledávání míst
            if (typeof searchPlaceOfInterest === 'function') {
                return searchPlaceOfInterest(placeType);
            }
            
            return `Chcete najít ${placeType}. Bohužel, funkce pro vyhledávání míst není k dispozici.`;
        }
        
        // Kontrola příkazů pro změnu mapového podkladu
        if (lowercaseInput.includes('mapový podklad') || 
            lowercaseInput.includes('typ mapy') || 
            lowercaseInput.includes('změň mapu')) {
            
            // Kontrola typu mapového podkladu
            let mapType = 'roadmap'; // Výchozí typ
            
            if (lowercaseInput.includes('satelit') || lowercaseInput.includes('satelitní')) {
                mapType = 'satellite';
            } else if (lowercaseInput.includes('hybrid') || lowercaseInput.includes('hybridní')) {
                mapType = 'hybrid';
            } else if (lowercaseInput.includes('terén') || lowercaseInput.includes('terénní')) {
                mapType = 'terrain';
            }
            
            // Kontrola, zda je k dispozici modul pro mapové ovládací prvky
            if (typeof MapControls !== 'undefined') {
                MapControls.changeMapType(mapType);
                return `Mapový podklad byl změněn na ${this.getMapTypeName(mapType)}.`;
            }
            
            return `Chcete změnit mapový podklad na ${this.getMapTypeName(mapType)}. Bohužel, modul pro mapové ovládací prvky není k dispozici.`;
        }
        
        // Kontrola příkazů pro glóbus režim
        if (lowercaseInput.includes('glóbus') || 
            lowercaseInput.includes('koule') || 
            lowercaseInput.includes('země') || 
            lowercaseInput.includes('planeta')) {
            
            // Kontrola, zda je k dispozici modul pro mapové ovládací prvky
            if (typeof MapControls !== 'undefined') {
                MapControls.toggleGlobeMode();
                return `Glóbus režim byl ${MapControls.state.globeMode ? 'aktivován' : 'deaktivován'}.`;
            }
            
            return 'Chcete přepnout glóbus režim. Bohužel, modul pro mapové ovládací prvky není k dispozici.';
        }
        
        // Kontrola příkazů pro 3D režim
        if (lowercaseInput.includes('3d') || 
            lowercaseInput.includes('3d režim') || 
            lowercaseInput.includes('budovy')) {
            
            // Kontrola, zda je k dispozici funkce pro přepnutí 3D režimu
            if (typeof toggle3DMode === 'function') {
                toggle3DMode();
                return `3D režim byl ${is3DMode ? 'aktivován' : 'deaktivován'}.`;
            }
            
            return 'Chcete přepnout 3D režim. Bohužel, funkce pro přepnutí 3D režimu není k dispozici.';
        }
        
        // Kontrola příkazů pro fullscreen režim
        if (lowercaseInput.includes('fullscreen') || 
            lowercaseInput.includes('celá obrazovka')) {
            
            // Kontrola, zda je k dispozici proměnná pro fullscreen režim
            if (typeof isFullscreen !== 'undefined') {
                isFullscreen = !isFullscreen;
                
                // Kontrola, zda je k dispozici tlačítko pro fullscreen režim
                const fullscreenButton = document.getElementById('fullscreenButton');
                if (fullscreenButton) {
                    fullscreenButton.click();
                }
                
                return isFullscreen ? 'Přepínám mapu do režimu celé obrazovky.' : 'Vracím mapu do normálního režimu.';
            }
            
            return 'Chcete přepnout fullscreen režim. Bohužel, proměnná pro fullscreen režim není k dispozici.';
        }
        
        // Kontrola příkazů pro nastavení
        if (lowercaseInput.includes('nastavení') || 
            lowercaseInput.includes('settings')) {
            
            // Kontrola, zda je k dispozici element pro nastavení
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) {
                settingsModal.style.display = 'block';
                return 'Otevírám nastavení aplikace.';
            }
            
            return 'Chcete otevřít nastavení aplikace. Bohužel, element pro nastavení není k dispozici.';
        }
        
        // Kontrola příkazů pro tmavý režim
        if (lowercaseInput.includes('tmavý') || 
            lowercaseInput.includes('světlý') || 
            lowercaseInput.includes('režim')) {
            
            // Kontrola, zda je k dispozici funkce pro přepnutí tmavého režimu
            if (typeof toggleDarkMode === 'function') {
                toggleDarkMode();
                return 'Tmavý režim byl přepnut.';
            }
            
            return 'Chcete přepnout tmavý režim. Bohužel, funkce pro přepnutí tmavého režimu není k dispozici.';
        }
        
        // Kontrola příkazů pro seznam bodů
        if (lowercaseInput.includes('seznam bodů') || 
            lowercaseInput.includes('ukaž body')) {
            
            // Kontrola, zda jsou k dispozici markery
            if (typeof markers !== 'undefined' && typeof markerProperties !== 'undefined') {
                if (markers.length === 0) {
                    return 'Na mapě nejsou žádné body.';
                }
                
                let response = 'Seznam bodů na mapě:\n';
                markerProperties.forEach((prop, index) => {
                    if (prop) {
                        response += `${index + 1}. ${prop.name} - příkaz: "${prop.command}"\n`;
                    }
                });
                return response;
            }
            
            return 'Chcete zobrazit seznam bodů. Bohužel, markery nejsou k dispozici.';
        }
        
        // Kontrola příkazů pro pomoc
        if (lowercaseInput.includes('pomoc') || 
            lowercaseInput.includes('help') || 
            lowercaseInput.includes('nápověda')) {
            
            return this.getHelpMessage();
        }
        
        // Kontrola příkazů pro pozdrav
        if (lowercaseInput.includes('ahoj') || 
            lowercaseInput.includes('čau') || 
            lowercaseInput.includes('dobrý den') || 
            lowercaseInput.includes('zdravím')) {
            
            return 'Zdravím! Jak vám mohu pomoci s mapou? Můžete se mě zeptat na vyhledání trasy, místa nebo informace o dopravě.';
        }
        
        // Kontrola příkazů pro poděkování
        if (lowercaseInput.includes('děkuji') || 
            lowercaseInput.includes('díky')) {
            
            return 'Není zač! Jsem tu, abych vám pomohl. Potřebujete ještě něco?';
        }
        
        // Výchozí odpověď
        return 'Omlouvám se, ale nerozumím vašemu dotazu. Můžete se mě zeptat na vyhledání trasy, místa nebo informace o dopravě. Pro více informací napište "pomoc".';
    },
    
    // Navigace na marker
    navigateToMarker: function(index) {
        console.log(`Navigace na marker s indexem ${index}`);
        
        // Kontrola, zda jsou k dispozici markery
        if (typeof markers === 'undefined' || typeof markerProperties === 'undefined') {
            return 'Bohužel, markery nejsou k dispozici.';
        }
        
        // Kontrola, zda je index platný
        if (index < 0 || index >= markers.length || !markers[index]) {
            return 'Bohužel, požadovaný bod nebyl nalezen.';
        }
        
        // Získání markeru a jeho vlastností
        const marker = markers[index];
        const markerProp = markerProperties[index];
        
        // Kontrola, zda je marker platný
        if (!marker) {
            return 'Bohužel, požadovaný bod nebyl nalezen.';
        }
        
        // Kontrola, zda je mapa inicializována
        if (typeof map === 'undefined' || !map) {
            return 'Bohužel, mapa není inicializována.';
        }
        
        // Přiblížení mapy na marker
        map.setView(marker.getLatLng(), 15);
        
        // Otevření popup okna markeru
        marker.openPopup();
        
        // Vrácení odpovědi
        return `Navigace na bod "${markerProp?.name || `Bod ${index + 1}`}" byla úspěšná.`;
    },
    
    // Získání názvu typu mapy
    getMapTypeName: function(type) {
        switch (type) {
            case 'roadmap':
                return 'základní';
            case 'satellite':
                return 'satelitní';
            case 'hybrid':
                return 'hybridní';
            case 'terrain':
                return 'terénní';
            default:
                return type;
        }
    },
    
    // Získání nápovědy
    getHelpMessage: function() {
        return `Nápověda pro AI Mapu:

1. Vyhledávání tras:
   - "Najdi trasu z Prahy do Brna"
   - "Jak se dostat z Ostravy do Plzně"

2. Vyhledávání míst:
   - "Najdi restauraci"
   - "Vyhledej hotel"
   - "Kde je kavárna"

3. Mapové podklady:
   - "Změň mapový podklad na satelitní"
   - "Přepni na terénní mapu"

4. Speciální režimy:
   - "Přepni glóbus režim"
   - "Aktivuj 3D režim"
   - "Přepni fullscreen"

5. Nastavení:
   - "Otevři nastavení"
   - "Přepni tmavý režim"

6. Body na mapě:
   - "Ukaž seznam bodů"
   - Použijte příkazy bodů pro navigaci

Pro přidání bodu na mapu klikněte na mapu a vyplňte formulář.`;
    },
    
    // Přepnutí minimalizace
    toggleMinimize: function() {
        console.log('Přepnutí minimalizace AI asistenta');
        
        // Získání elementů
        const aiAssistant = document.getElementById('aiAssistant');
        const chatContent = aiAssistant?.querySelector('.chat-content');
        const minimizeBtn = document.getElementById('minimizeMainChat');
        
        // Kontrola, zda jsou elementy k dispozici
        if (!aiAssistant || !chatContent || !minimizeBtn) {
            console.error('Elementy pro minimalizaci nejsou k dispozici!');
            return;
        }
        
        // Přepnutí stavu
        this.state.isMinimized = !this.state.isMinimized;
        
        // Aktualizace UI
        if (this.state.isMinimized) {
            // Minimalizovat chat
            aiAssistant.classList.add('minimized');
            chatContent.style.display = 'none';
            minimizeBtn.textContent = '+'; // Symbol plus
            minimizeBtn.title = 'Maximalizovat chat';
        } else {
            // Maximalizovat chat
            aiAssistant.classList.remove('minimized');
            chatContent.style.display = 'flex';
            minimizeBtn.textContent = '−'; // Symbol minus
            minimizeBtn.title = 'Minimalizovat chat';
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    AIAssistant.init();
});

// Export pro použití v jiných skriptech
window.AIAssistant = AIAssistant;
window.addMessage = AIAssistant.addMessage.bind(AIAssistant);
window.processUserInput = AIAssistant.processUserInput.bind(AIAssistant);
