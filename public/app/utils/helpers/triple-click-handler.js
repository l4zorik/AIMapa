/**
 * Triple Click Handler
 * Verze 0.3.6.0
 * 
 * Tento skript sleduje trojité kliknutí mimo mapu a otevírá menu příkazů.
 */

// Inicializace počítadla kliknutí
let clickCount = 0;
let lastClickTime = 0;
const TRIPLE_CLICK_TIMEOUT = 1000; // 1 sekunda pro trojité kliknutí

// Funkce pro zpracování kliknutí
function handleDocumentClick(e) {
    // Kontrola, zda kliknutí bylo mimo mapu
    const isMapClick = e.target.closest('#map') || 
                      e.target.closest('.leaflet-container') || 
                      e.target.closest('.leaflet-control-container');
    
    // Pokud bylo kliknutí na mapu, ignorujeme ho
    if (isMapClick) {
        clickCount = 0;
        return;
    }
    
    // Kontrola času od posledního kliknutí
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime > TRIPLE_CLICK_TIMEOUT) {
        // Pokud uplynulo více než 1 sekunda, resetujeme počítadlo
        clickCount = 1;
    } else {
        // Jinak zvýšíme počítadlo
        clickCount++;
    }
    
    // Aktualizace času posledního kliknutí
    lastClickTime = currentTime;
    
    // Pokud jsme dosáhli trojitého kliknutí, otevřeme menu příkazů
    if (clickCount === 3) {
        // Otevření menu příkazů
        if (typeof CommandsMenu !== 'undefined' && CommandsMenu.toggleCommandsMenu) {
            CommandsMenu.toggleCommandsMenu();
        }
        
        // Resetování počítadla
        clickCount = 0;
    }
}

// Přidání event listeneru pro kliknutí na dokument
document.addEventListener('click', handleDocumentClick);

console.log('Triple Click Handler byl inicializován');
