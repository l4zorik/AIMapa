/**
 * AIMapa - Hlavní aplikační skript
 * Verze 0.3.0.16
 */

// Globální objekt aplikace
const App = {
    // Inicializace aplikace
    init: function() {
        console.log('Inicializace aplikace AIMapa...');
        
        // Inicializace mapy
        Map.init();
        
        // Inicializace modulu virtuální práce
        VirtualWork.init();
        
        // Inicializace event listenerů
        this.setupEventListeners();
        
        console.log('Aplikace AIMapa byla inicializována');
    },
    
    // Nastavení event listenerů
    setupEventListeners: function() {
        // Otevření mapy
        document.getElementById('open-map').addEventListener('click', function(e) {
            e.preventDefault();
            Map.focus();
        });
        
        // Otevření virtuální práce
        document.getElementById('open-virtual-work').addEventListener('click', function(e) {
            e.preventDefault();
            VirtualWork.openWorkDialog();
        });
        
        // Otevření nastavení
        document.getElementById('open-settings').addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: Implementace nastavení
            alert('Nastavení bude implementováno v další verzi');
        });
        
        // Přepínání menu příkazů
        document.getElementById('toggle-commands').addEventListener('click', function() {
            const commandsList = document.getElementById('commands-list');
            if (commandsList.style.display === 'none') {
                commandsList.style.display = 'block';
            } else {
                commandsList.style.display = 'none';
            }
        });
        
        // Příkazy v menu
        const commandItems = document.querySelectorAll('#commands-list li');
        commandItems.forEach(item => {
            item.addEventListener('click', function() {
                const command = this.dataset.command;
                
                // Zpracování příkazu
                switch (command) {
                    case 'virtual-work':
                        VirtualWork.openWorkDialog();
                        break;
                    case 'track-points':
                        VirtualWork.openTrackPointsDialog();
                        break;
                    default:
                        console.warn('Neznámý příkaz:', command);
                }
                
                // Skrytí menu příkazů
                document.getElementById('commands-list').style.display = 'none';
            });
        });
    }
};

// Inicializace aplikace po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});
