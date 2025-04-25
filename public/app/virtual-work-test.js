/**
 * Testovací skript pro ověření načítání modulu virtuální práce
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Testování načítání modulu virtuální práce...');
    
    // Kontrola, zda existuje VirtualWork
    if (typeof VirtualWork !== 'undefined') {
        console.log('VirtualWork modul byl nalezen!');
        console.log('VirtualWork.isInitialized:', VirtualWork.isInitialized);
        
        // Pokus o inicializaci
        try {
            VirtualWork.init();
            console.log('VirtualWork.isInitialized po init():', VirtualWork.isInitialized);
        } catch (error) {
            console.error('Chyba při inicializaci VirtualWork:', error);
        }
    } else {
        console.error('VirtualWork modul nebyl nalezen!');
        
        // Pokus o načtení skriptu
        console.log('Pokus o načtení virtual-work.js...');
        const script = document.createElement('script');
        script.src = 'virtual-work.js';
        script.onload = () => {
            console.log('virtual-work.js byl načten!');
            if (typeof VirtualWork !== 'undefined') {
                console.log('VirtualWork modul je nyní dostupný!');
                VirtualWork.init();
            } else {
                console.error('VirtualWork modul stále není dostupný po načtení skriptu!');
            }
        };
        script.onerror = (error) => {
            console.error('Chyba při načítání virtual-work.js:', error);
        };
        document.head.appendChild(script);
    }
});
