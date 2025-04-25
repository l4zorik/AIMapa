/**
 * Modul pro našeptávání příkazů při psaní
 * Verze 0.2.8.6.2
 */

const CommandAutocomplete = {
    // Seznam příkazů pro našeptávání
    commands: [
        { text: 'přidej bod', description: 'Přidá nový bod na mapu' },
        { text: 'vypočítej trasu', description: 'Vypočítá trasu mezi body na mapě' },
        { text: 'vymaž mapu', description: 'Odstraní všechny body a trasy z mapy' },
        { text: 'fullscreen', description: 'Přepne aplikaci do režimu celé obrazovky' },
        { text: 'glóbus', description: 'Přepne mapu do 3D glóbusu' },
        { text: 'premium', description: 'Zobrazí informace o premium verzi' },
        { text: 'nastavení', description: 'Otevře dialog nastavení aplikace' },
        { text: 'nápověda', description: 'Zobrazí nápovědu k používání aplikace' },
        { text: 'měření vzdálenosti', description: 'Aktivuje nástroj pro měření vzdálenosti' },
        { text: 'vyhledat', description: 'Vyhledá místo nebo adresu na mapě' },
        { text: 'sdílet mapu', description: 'Vytvoří odkaz pro sdílení aktuálního stavu mapy' },
        { text: 'exportovat data', description: 'Exportuje body a trasy do různých formátů' },
        { text: 'počasí', description: 'Zobrazí vrstvu s aktuálním počasím na mapě' },
        { text: 'alexa', description: 'Zobrazí informace o nočním klubu Alexa' },
        { text: 'oteviracidoba', description: 'Zobrazí otevírací doby obchodů v Hodoníně' }
    ],
    
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro našeptávání příkazů...');
        
        // Přidání našeptávače k chatovému vstupu
        this.setupAutocomplete();
        
        console.log('Modul pro našeptávání příkazů byl inicializován');
    },
    
    // Nastavení našeptávače
    setupAutocomplete() {
        // Získání chatového vstupu
        const chatInput = document.getElementById('chatInput');
        
        if (!chatInput) {
            console.error('Chatový vstup nebyl nalezen');
            return;
        }
        
        // Vytvoření kontejneru pro našeptávač
        const autocompleteContainer = document.createElement('div');
        autocompleteContainer.id = 'autocompleteContainer';
        autocompleteContainer.className = 'autocomplete-container';
        
        // Přidání kontejneru do dokumentu
        chatInput.parentNode.appendChild(autocompleteContainer);
        
        // Přidání event listenerů
        chatInput.addEventListener('input', () => {
            this.updateAutocomplete(chatInput.value);
        });
        
        chatInput.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e);
        });
        
        // Skrytí našeptávače při kliknutí mimo
        document.addEventListener('click', (e) => {
            if (!chatInput.contains(e.target) && !autocompleteContainer.contains(e.target)) {
                autocompleteContainer.style.display = 'none';
            }
        });
    },
    
    // Aktualizace našeptávače podle vstupu
    updateAutocomplete(input) {
        const autocompleteContainer = document.getElementById('autocompleteContainer');
        
        if (!autocompleteContainer) {
            return;
        }
        
        // Pokud je vstup prázdný, skryjeme našeptávač
        if (!input.trim()) {
            autocompleteContainer.style.display = 'none';
            return;
        }
        
        // Filtrování příkazů podle vstupu
        const matchingCommands = this.commands.filter(command => 
            command.text.toLowerCase().includes(input.toLowerCase())
        );
        
        // Pokud nejsou žádné odpovídající příkazy, skryjeme našeptávač
        if (matchingCommands.length === 0) {
            autocompleteContainer.style.display = 'none';
            return;
        }
        
        // Vytvoření HTML pro našeptávač
        let html = '';
        
        matchingCommands.forEach((command, index) => {
            html += `
                <div class="autocomplete-item" data-index="${index}" data-command="${command.text}">
                    <div class="autocomplete-text">${this.highlightMatch(command.text, input)}</div>
                    <div class="autocomplete-description">${command.description}</div>
                </div>
            `;
        });
        
        // Aktualizace obsahu našeptávače
        autocompleteContainer.innerHTML = html;
        
        // Zobrazení našeptávače
        autocompleteContainer.style.display = 'block';
        
        // Přidání event listenerů pro položky našeptávače
        const items = autocompleteContainer.querySelectorAll('.autocomplete-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                this.selectCommand(item.getAttribute('data-command'));
            });
            
            item.addEventListener('mouseover', () => {
                // Odstranění aktivní třídy ze všech položek
                items.forEach(i => i.classList.remove('active'));
                
                // Přidání aktivní třídy k aktuální položce
                item.classList.add('active');
            });
        });
    },
    
    // Zvýraznění odpovídající části textu
    highlightMatch(text, input) {
        const lowerText = text.toLowerCase();
        const lowerInput = input.toLowerCase();
        
        const startIndex = lowerText.indexOf(lowerInput);
        
        if (startIndex === -1) {
            return text;
        }
        
        const endIndex = startIndex + input.length;
        
        return text.substring(0, startIndex) +
               '<span class="highlight">' + text.substring(startIndex, endIndex) + '</span>' +
               text.substring(endIndex);
    },
    
    // Zpracování navigace pomocí klávesnice
    handleKeyNavigation(e) {
        const autocompleteContainer = document.getElementById('autocompleteContainer');
        
        if (!autocompleteContainer || autocompleteContainer.style.display === 'none') {
            return;
        }
        
        const items = autocompleteContainer.querySelectorAll('.autocomplete-item');
        const activeItem = autocompleteContainer.querySelector('.autocomplete-item.active');
        let activeIndex = -1;
        
        if (activeItem) {
            activeIndex = parseInt(activeItem.getAttribute('data-index'));
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                
                // Posun dolů v seznamu
                if (activeIndex < items.length - 1) {
                    if (activeItem) {
                        activeItem.classList.remove('active');
                    }
                    
                    items[activeIndex + 1].classList.add('active');
                    items[activeIndex + 1].scrollIntoView({ block: 'nearest' });
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                
                // Posun nahoru v seznamu
                if (activeIndex > 0) {
                    if (activeItem) {
                        activeItem.classList.remove('active');
                    }
                    
                    items[activeIndex - 1].classList.add('active');
                    items[activeIndex - 1].scrollIntoView({ block: 'nearest' });
                }
                break;
                
            case 'Tab':
            case 'Enter':
                e.preventDefault();
                
                // Výběr aktivní položky
                if (activeItem) {
                    this.selectCommand(activeItem.getAttribute('data-command'));
                } else if (items.length > 0) {
                    // Pokud není žádná položka aktivní, vybereme první
                    this.selectCommand(items[0].getAttribute('data-command'));
                }
                break;
                
            case 'Escape':
                // Skrytí našeptávače
                autocompleteContainer.style.display = 'none';
                break;
        }
    },
    
    // Výběr příkazu
    selectCommand(command) {
        const chatInput = document.getElementById('chatInput');
        const autocompleteContainer = document.getElementById('autocompleteContainer');
        
        if (chatInput && command) {
            // Nastavení hodnoty vstupu
            chatInput.value = command;
            
            // Zaměření vstupu
            chatInput.focus();
            
            // Skrytí našeptávače
            if (autocompleteContainer) {
                autocompleteContainer.style.display = 'none';
            }
        }
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    CommandAutocomplete.init();
});
