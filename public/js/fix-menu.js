/**
 * Skript pro opravu menu příkazů - odstranění položky Rap a ponechání pouze Systém odměn
 * Verze 1.0.0
 */

// Funkce pro opravu menu příkazů
function fixCommandsMenu() {
    console.log('Opravuji menu příkazů - odstraňuji Rap a ponechávám pouze Systém odměn...');
    
    // Počkáme, až se DOM načte
    document.addEventListener('DOMContentLoaded', () => {
        // Počkáme 1 sekundu, aby se stihlo načíst menu příkazů
        setTimeout(() => {
            // Najdeme všechny položky v menu
            const rapItem = document.querySelector('.command-item[data-command="rap"]');
            
            // Pokud existuje položka Rap, odstraníme ji
            if (rapItem) {
                console.log('Nalezena položka Rap, odstraňuji...');
                rapItem.remove();
                console.log('Položka Rap byla odstraněna');
            } else {
                console.log('Položka Rap nebyla nalezena');
            }
            
            // Najdeme kategorii Zábava
            const funCategory = document.querySelector('.commands-category[data-category="fun"]');
            if (funCategory) {
                // Otevřeme kategorii Zábava
                const header = funCategory.querySelector('.commands-category-header');
                const commandsList = funCategory.querySelector('.commands-list');
                const toggle = funCategory.querySelector('.commands-category-toggle');
                
                if (header && commandsList && toggle) {
                    // Nastavíme kategorii jako otevřenou
                    commandsList.style.display = 'flex';
                    toggle.textContent = '▼';
                    
                    console.log('Kategorie Zábava byla otevřena');
                }
            }
            
            // Přímé přepsání kategorie Zábava v objektu CommandsMenu
            if (typeof CommandsMenu !== 'undefined' && CommandsMenu.categories) {
                const funCategory = CommandsMenu.categories.find(cat => cat.id === 'fun');
                if (funCategory && funCategory.commands) {
                    // Filtrujeme položky - ponecháme pouze Systém odměn
                    funCategory.commands = funCategory.commands.filter(cmd => cmd.id === 'reward-system');
                    console.log('Kategorie Zábava v objektu CommandsMenu byla aktualizována');
                }
            }
            
            console.log('Oprava menu příkazů byla dokončena');
        }, 1000);
    });
}

// Funkce pro přímé přepsání menu příkazů v DOM
function directFixMenu() {
    console.log('Přímé přepsání menu příkazů v DOM...');
    
    // Najdeme všechny položky v menu
    const rapItem = document.querySelector('.command-item[data-command="rap"]');
    
    // Pokud existuje položka Rap, odstraníme ji
    if (rapItem) {
        console.log('Nalezena položka Rap, odstraňuji...');
        rapItem.remove();
        console.log('Položka Rap byla odstraněna');
    } else {
        console.log('Položka Rap nebyla nalezena');
    }
    
    // Najdeme kategorii Zábava
    const funCategory = document.querySelector('.commands-category[data-category="fun"]');
    if (funCategory) {
        // Otevřeme kategorii Zábava
        const header = funCategory.querySelector('.commands-category-header');
        const commandsList = funCategory.querySelector('.commands-list');
        const toggle = funCategory.querySelector('.commands-category-toggle');
        
        if (header && commandsList && toggle) {
            // Nastavíme kategorii jako otevřenou
            commandsList.style.display = 'flex';
            toggle.textContent = '▼';
            
            console.log('Kategorie Zábava byla otevřena');
        }
    }
    
    console.log('Přímé přepsání menu příkazů v DOM bylo dokončeno');
}

// Přidání tlačítka pro ruční opravu menu
function addFixButton() {
    console.log('Přidávám tlačítko pro ruční opravu menu...');
    
    // Vytvoření tlačítka
    const fixButton = document.createElement('button');
    fixButton.id = 'fixMenuButton';
    fixButton.className = 'fix-menu-button';
    fixButton.title = 'Opravit menu příkazů';
    fixButton.innerHTML = '<span class="icon">🔧</span>';
    fixButton.style.position = 'fixed';
    fixButton.style.bottom = '20px';
    fixButton.style.right = '20px';
    fixButton.style.zIndex = '9999';
    fixButton.style.padding = '10px';
    fixButton.style.borderRadius = '50%';
    fixButton.style.backgroundColor = '#3498db';
    fixButton.style.color = 'white';
    fixButton.style.border = 'none';
    fixButton.style.cursor = 'pointer';
    fixButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    
    // Přidání event listeneru
    fixButton.addEventListener('click', () => {
        directFixMenu();
    });
    
    // Přidání tlačítka do dokumentu
    document.body.appendChild(fixButton);
    
    console.log('Tlačítko pro ruční opravu menu bylo přidáno');
}

// Spuštění opravy menu příkazů
fixCommandsMenu();

// Přidání tlačítka pro ruční opravu menu po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Počkáme 2 sekundy, aby se stihlo načíst menu příkazů
    setTimeout(() => {
        addFixButton();
    }, 2000);
});

// Přidání event listeneru pro tlačítko menu příkazů
document.addEventListener('click', (e) => {
    // Pokud bylo kliknuto na tlačítko menu příkazů
    if (e.target.closest('#commandsButton') || e.target.closest('#floatingCommandsButton')) {
        // Počkáme 500ms, aby se stihlo zobrazit menu
        setTimeout(() => {
            directFixMenu();
        }, 500);
    }
});

console.log('Modul opravy menu příkazů byl načten');
