// Funkce pro zobrazení dialogového okna s dostupnými příkazy
function showCommandsDialog() {
    // Vytvoření dialogového okna
    const dialogContainer = document.createElement('div');
    dialogContainer.className = 'commands-dialog';
    dialogContainer.id = 'commandsDialog';

    // Vytvoření hlavičky dialogu
    const dialogHeader = document.createElement('div');
    dialogHeader.className = 'commands-dialog-header';
    dialogHeader.innerHTML = `
        <h3>Dostupné příkazy</h3>
        <button class="close-button" onclick="closeCommandsDialog()">×</button>
    `;
    dialogContainer.appendChild(dialogHeader);

    // Vytvoření obsahu dialogu s příkazy
    const dialogContent = document.createElement('div');
    dialogContent.className = 'commands-dialog-content';

    // Seznam dostupných příkazů
    const commands = [
        {
            id: 'delete-point',
            icon: '🗑️',
            title: 'smazat bod',
            description: 'Smaže vybraný bod z mapy'
        },
        {
            id: 'points-list',
            icon: '📋',
            title: 'seznam bodů',
            description: 'Zobrazí seznam všech bodů na mapě'
        },
        {
            id: 'navigation',
            icon: '🧭',
            title: 'navigace',
            description: 'Spustí navigaci k vybranému bodu'
        },
        {
            id: 'offline-navigation',
            icon: '📱',
            title: 'navigace offline',
            description: 'Navigace bez připojení k internetu',
            premium: true
        },
        {
            id: 'route-without-steps',
            icon: '🚶',
            title: 'trasa bez schodů',
            description: 'Vypočítá trasu s vyhnutím se schodům',
            premium: true
        },
        {
            id: 'opening-hours',
            icon: '🕒',
            title: 'otevírací doba',
            description: 'Zobrazí otevírací dobu nebo hodiny'
        },
        {
            id: 'alexa',
            icon: '🕺',
            title: 'alexa',
            description: 'Informace o klubu Alexa s možností rezervace'
        },
        {
            id: 'weather',
            icon: '☀️',
            title: 'počasí',
            description: 'Zobrazí aktuální (simulované) počasí'
        },
        {
            id: 'transport',
            icon: '🚌',
            title: 'doprava',
            description: 'Informace o veřejné dopravě'
        },
        {
            id: '3d-buildings',
            icon: '🏘️',
            title: '3D budovy',
            description: 'Zobrazit budovy ve 3D režimu',
            premium: true
        },
        {
            id: 'custom-markers',
            icon: '📍',
            title: 'vlastní značky',
            description: 'Použít vlastní ikony pro body na mapě',
            premium: true
        }
    ];

    // Vytvoření položek příkazů
    commands.forEach(command => {
        const commandItem = document.createElement('div');
        commandItem.className = 'command-item';
        commandItem.setAttribute('data-command', command.id);
        commandItem.onclick = function() {
            executeCommand(command.id);
        };

        // Přidání ikony a textu
        commandItem.innerHTML = `
            <div class="command-icon">${command.icon}</div>
            <div class="command-info">
                <div class="command-title">${command.title}</div>
                <div class="command-description">${command.description}</div>
            </div>
            ${command.premium ? '<div class="premium-badge">Premium</div>' : '<div class="command-shortcut">⌘</div>'}
        `;

        dialogContent.appendChild(commandItem);
    });

    // Přidání sekce pro premium verzi
    const premiumSection = document.createElement('div');
    premiumSection.className = 'premium-section';
    premiumSection.innerHTML = `
        <div class="premium-header">
            <div class="premium-icon">⭐</div>
            <h4 class="premium-title">Upgrade na Premium</h4>
        </div>
        <div class="premium-description">
            Získejte přístup ke všem premium funkcím a vylepšete svůj zážitek s mapou.
        </div>
        <div class="premium-features">
            <div class="premium-feature">
                <span class="premium-feature-icon">✔️</span>
                <span>Navigace bez připojení k internetu</span>
            </div>
            <div class="premium-feature">
                <span class="premium-feature-icon">✔️</span>
                <span>Trasy bez schodů pro bezbariérový přístup</span>
            </div>
            <div class="premium-feature">
                <span class="premium-feature-icon">✔️</span>
                <span>Pokročilé 3D budovy a detailní mapy</span>
            </div>
            <div class="premium-feature">
                <span class="premium-feature-icon">✔️</span>
                <span>Vlastní ikony a styly pro body na mapě</span>
            </div>
            <div class="premium-feature">
                <span class="premium-feature-icon">✔️</span>
                <span>Bez reklam a neomezené použití</span>
            </div>
        </div>
        <div class="premium-cta">
            <button class="premium-button" onclick="showPremiumModal()">Získat Premium</button>
        </div>
    `;

    dialogContent.appendChild(premiumSection);

    dialogContainer.appendChild(dialogContent);

    // Přidání dialogu do dokumentu
    document.body.appendChild(dialogContainer);

    // Přidání event listeneru pro zavření dialogu kliknutím mimo dialog
    document.addEventListener('click', closeDialogOnClickOutside);
}

// Funkce pro zavření dialogového okna
function closeCommandsDialog() {
    const dialog = document.getElementById('commandsDialog');
    if (dialog) {
        dialog.remove();
    }

    // Odstranění event listeneru
    document.removeEventListener('click', closeDialogOnClickOutside);
}

// Funkce pro zavření dialogu kliknutím mimo dialog
function closeDialogOnClickOutside(event) {
    const dialog = document.getElementById('commandsDialog');
    if (dialog && !dialog.contains(event.target) && event.target.id !== 'showCommandsBtn') {
        closeCommandsDialog();
    }
}

// Funkce pro provedení příkazu
function executeCommand(commandId) {
    // Zavření dialogu
    closeCommandsDialog();

    // Provedení příkazu podle ID
    switch (commandId) {
        case 'delete-point':
            if (markers.length > 0) {
                removeMarker(markers.length - 1);
                addMessage('Poslední bod byl odstraněn.', false);
            } else {
                addMessage('Na mapě nejsou žádné body k odstranění.', false);
            }
            break;
        case 'points-list':
            if (markers.length === 0) {
                addMessage('Na mapě nejsou žádné body.', false);
            } else {
                let response = 'Seznam bodů na mapě:\n';
                markerProperties.forEach((prop, index) => {
                    response += `${index + 1}. ${prop.name} - příkaz: "${prop.command}"\n`;
                });
                addMessage(response, false);
            }
            break;
        case 'navigation':
            if (markers.length > 0) {
                navigateToMarker(markers.length - 1);
                addMessage(`Navigace na bod "${markerProperties[markers.length - 1]?.name || `Bod ${markers.length}`}".`, false);
            } else {
                addMessage('Na mapě nejsou žádné body pro navigaci.', false);
            }
            break;
        case 'offline-navigation':
            addMessage('Navigace offline je dostupná pouze pro prémiové uživatele.', false);
            break;
        case 'route-without-steps':
            addMessage('Trasa bez schodů je dostupná pouze pro prémiové uživatele.', false);
            break;
        case 'opening-hours':
            const response = showOpeningHours();
            addMessage(response, false);
            break;
        case 'alexa':
            const alexaResponse = showRohatecClub();
            addMessage(alexaResponse, false);
            break;
        case 'weather':
            addMessage('Aktuální počasí: 21°C, slunečno s občasnou oblačností. Předpověď na zítra: 23°C, slunečno.', false);
            break;
        case 'transport':
            addMessage('Informace o veřejné dopravě: Nejbližší zastávka je "Náměstí" (150m). Nejbližší odjezdy: Bus č. 5 za 5 minut, Bus č. 8 za 12 minut.', false);
            break;
        default:
            addMessage('Tento příkaz není implementován.', false);
    }
}

// CSS styly jsou nyní v souboru styles.css
function addCommandsDialogStyles() {
    // Styly jsou již v souboru styles.css, není potřeba je přidávat dynamicky
    console.log('CSS styly pro dialogové okno příkazů jsou již v souboru styles.css');
}

// Inicializace při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    // Přidání stylů pro dialogové okno
    addCommandsDialogStyles();

    // Přidání tlačítka pro zobrazení příkazů
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) {
        const commandsButton = document.createElement('button');
        commandsButton.id = 'showCommandsBtn';
        commandsButton.className = 'commands-btn';
        commandsButton.innerHTML = '⌘';
        commandsButton.title = 'Zobrazit dostupné příkazy';
        commandsButton.onclick = showCommandsDialog;

        // Vložení tlačítka před tlačítko odeslání
        const sendButton = document.getElementById('sendMessage');
        if (sendButton) {
            chatInput.insertBefore(commandsButton, sendButton);
        } else {
            chatInput.appendChild(commandsButton);
        }
    }
});
