/**
 * Modul pro přesouvání prvků uživatelského rozhraní
 * Verze 0.2.9.4
 */

const DraggableElements = {
    // Stav modulu
    isInitialized: false,
    draggableElements: {},

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;

        console.log('Inicializace modulu pro přesouvání prvků...');

        // Načtení uložených pozic prvků
        this.loadElementPositions();

        // Přidání event listenerů
        this.setupEventListeners();

        // Resetování pozice AI chatu při prvním spuštění nové verze
        this.resetAIChatPosition();

        this.isInitialized = true;
        console.log('Modul pro přesouvání prvků byl inicializován');
    },

    // Resetování pozice AI chatu při prvním spuštění nové verze
    resetAIChatPosition() {
        // Kontrola, zda je potřeba resetovat pozici
        const resetVersion = localStorage.getItem('aiChatPositionResetVersion');

        // Pokud již byla pozice resetována v této verzi, nebudeme ji resetovat znovu
        if (resetVersion === '0.2.9.4') {
            console.log('Pozice AI chatu již byla resetována v této verzi, zachovávám uživatelské nastavení.');
            return;
        }

        // Resetování pozice AI chatu pouze při prvním spuštění nové verze
        const aiAssistant = document.getElementById('aiAssistant');
        if (aiAssistant) {
            // Nastavení pozice a velikosti
            aiAssistant.style.top = '20px';
            aiAssistant.style.right = '20px';
            aiAssistant.style.left = '';
            aiAssistant.style.width = '320px';
            aiAssistant.style.maxHeight = '500px';

            // Uložení pozice
            if (aiAssistant.id) {
                this.saveElementPosition(aiAssistant.id, aiAssistant);
            }
        }

        // Uložení informace o resetování pozice v této verzi
        localStorage.setItem('aiChatPositionResetVersion', '0.2.9.4');
    },

    // Povolení/zakázání přesouvání prvku
    setElementDraggable(element, draggable = true) {
        if (!element) return;

        const id = element.id;
        if (!id || !this.draggableElements[id]) return;

        const handle = this.draggableElements[id].handle;

        if (draggable) {
            // Povolení přesouvání
            handle.style.cursor = 'move';
            element.classList.add('draggable-element');
        } else {
            // Zakázání přesouvání
            handle.style.cursor = 'default';
            element.classList.remove('draggable-element');
        }
    },

    // Načtení uložených pozic prvků
    loadElementPositions() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            if (appState.elementPositions) {
                this.elementPositions = appState.elementPositions;
            } else {
                this.elementPositions = {};
            }
        } catch (error) {
            console.error('Chyba při načítání pozic prvků:', error);
            this.elementPositions = {};
        }
    },

    // Uložení pozic prvků
    saveElementPositions() {
        try {
            const appState = JSON.parse(localStorage.getItem('appState')) || {};
            appState.elementPositions = this.elementPositions;
            localStorage.setItem('appState', JSON.stringify(appState));
        } catch (error) {
            console.error('Chyba při ukládání pozic prvků:', error);
        }
    },

    // Přidání možnosti přesouvat prvek
    makeDraggable(element, handle = null, id = null) {
        if (!element) return;

        // Pokud není zadán handle, použijeme celý prvek
        if (!handle) {
            handle = element;
        }

        // Pokud není zadáno ID, použijeme ID prvku nebo vygenerujeme náhodné
        if (!id) {
            id = element.id || 'draggable-' + Math.random().toString(36).substr(2, 9);
            element.id = id;
        }

        // Přidání třídy pro označení přesouvatelného prvku
        element.classList.add('draggable-element');

        // Přidání třídy pro označení úchytu
        if (handle !== element) {
            handle.classList.add('draggable-handle');
        }

        // Proměnné pro sledování pozice
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // Přidání event listeneru pro zahájení přesouvání
        handle.onmousedown = dragMouseDown;

        // Registrace prvku
        this.draggableElements[id] = {
            element: element,
            handle: handle
        };

        // Načtení uložené pozice
        this.applyElementPosition(id, element);

        // Funkce pro zahájení přesouvání
        function dragMouseDown(e) {
            e.preventDefault();

            // Získání pozice kurzoru při spuštění
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Přidání třídy pro označení aktivního přesouvání
            element.classList.add('dragging');

            // Přidání event listenerů pro pohyb a ukončení
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        // Funkce pro přesouvání prvku
        function elementDrag(e) {
            e.preventDefault();

            // Výpočet nové pozice
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Nastavení nové pozice prvku s větším posunem pro rychlejší pohyb
            const moveSpeed = 1.5; // Faktor rychlosti pohybu
            element.style.top = (element.offsetTop - pos2 * moveSpeed) + "px";
            element.style.left = (element.offsetLeft - pos1 * moveSpeed) + "px";

            // Odstranění tříd pro pozici, pokud jsou přítomny
            element.classList.remove('position-left', 'position-right', 'position-top', 'position-bottom');
        }

        // Funkce pro ukončení přesouvání
        function closeDragElement() {
            // Zastavení pohybu při uvolnění tlačítka myši
            document.onmouseup = null;
            document.onmousemove = null;

            // Odstranění třídy pro označení aktivního přesouvání
            element.classList.remove('dragging');

            // Uložení pozice prvku
            DraggableElements.saveElementPosition(id, element);
        }
    },

    // Uložení pozice prvku
    saveElementPosition(id, element) {
        if (!id || !element) return;

        // Uložení pozice do objektu
        this.elementPositions[id] = {
            top: element.style.top,
            left: element.style.left
        };

        // Uložení do localStorage
        this.saveElementPositions();
    },

    // Aplikace uložené pozice prvku
    applyElementPosition(id, element) {
        if (!id || !element || !this.elementPositions[id]) return;

        // Aplikace pozice
        element.style.top = this.elementPositions[id].top;
        element.style.left = this.elementPositions[id].left;
    },

    // Resetování pozice prvku
    resetElementPosition(id) {
        if (!id || !this.draggableElements[id]) return;

        const element = this.draggableElements[id].element;

        // Resetování pozice
        element.style.top = '';
        element.style.left = '';

        // Odstranění pozice z objektu
        delete this.elementPositions[id];

        // Uložení do localStorage
        this.saveElementPositions();
    },

    // Resetování pozic všech prvků
    resetAllElementPositions() {
        // Resetování pozic všech prvků
        Object.keys(this.draggableElements).forEach(id => {
            this.resetElementPosition(id);
        });

        // Zobrazení zprávy o resetování pozic
        if (typeof addMessage !== 'undefined') {
            addMessage('Pozice všech prvků byly resetovány.', false);
        }
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro změnu velikosti okna
        window.addEventListener('resize', () => {
            // Kontrola, zda prvky nejsou mimo viditelnou oblast
            this.checkElementsVisibility();
        });
    },

    // Kontrola viditelnosti prvků
    checkElementsVisibility() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Kontrola všech prvků
        Object.keys(this.draggableElements).forEach(id => {
            const element = this.draggableElements[id].element;
            const rect = element.getBoundingClientRect();

            // Pokud je prvek mimo viditelnou oblast, resetujeme jeho pozici
            if (rect.right < 0 || rect.bottom < 0 || rect.left > windowWidth || rect.top > windowHeight) {
                this.resetElementPosition(id);
            }
        });
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    DraggableElements.init();
});

// Přidání CSS stylů
const draggableElementsStyles = document.createElement('style');
draggableElementsStyles.textContent = `
.draggable-element {
    position: absolute;
    z-index: 1000;
    transition: box-shadow 0.3s ease;
    user-select: none;
}

.draggable-element.dragging {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    opacity: 0.9;
    z-index: 1001;
}

.draggable-handle {
    cursor: move;
}

body[data-theme="dark"] .draggable-element.dragging {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}
`;

document.head.appendChild(draggableElementsStyles);
