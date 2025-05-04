# Vylepšení výpočtu cesty - Automatický výpočet po kliknutí na první bod

Tento dokument popisuje implementaci vylepšení výpočtu cesty v aplikaci AIMapa pro verzi 0.3.8.2, které umožní automatický výpočet celé trasy po kliknutí na první bod.

## Přehled funkcionality

Nová funkcionalita umožní uživatelům:

1. **Zahájit výpočet cesty jediným kliknutím** na první bod trasy
2. **Automaticky propočítat celou trasu** bez nutnosti klikat na tlačítko "Vypočítat trasu"
3. **Zjednodušit uživatelské rozhraní** pro výpočet tras

## Implementace

### 1. Úprava funkce pro výběr bodů na mapě

```javascript
/**
 * Funkce pro výběr bodů na mapě
 * @param {Object} point - Vybraný bod na mapě
 */
function selectPointOnMap(point) {
    // Přidání bodu do seznamu vybraných bodů
    selectedPoints.push(point);
    
    // Přidání markeru na mapu
    addMarkerForSelectedPoint(point);
    
    // Aktualizace seznamu vybraných bodů v UI
    updateSelectedPointsList();
    
    // Pokud je to první bod, zobrazíme informaci o možnosti automatického výpočtu
    if (selectedPoints.length === 1) {
        showAutoCalculateInfo();
    }
    
    // Pokud máme alespoň dva body, aktivujeme tlačítko pro výpočet trasy
    if (selectedPoints.length >= 2) {
        enableCalculateRouteButton();
    }
}
```

### 2. Implementace automatického výpočtu po kliknutí na první bod

```javascript
/**
 * Funkce pro kliknutí na marker bodu
 * @param {Object} marker - Marker bodu na mapě
 * @param {Object} point - Data bodu
 */
function onMarkerClick(marker, point) {
    // Kontrola, zda je bod v seznamu vybraných bodů
    const pointIndex = selectedPoints.findIndex(p => p.id === point.id);
    
    // Pokud je to první bod v seznamu, zahájíme automatický výpočet trasy
    if (pointIndex === 0) {
        // Zobrazení potvrzovacího dialogu
        showConfirmationDialog(
            'Automatický výpočet trasy',
            'Chcete automaticky vypočítat celou trasu přes všechny body?',
            () => {
                // Pokud uživatel potvrdí, zahájíme výpočet
                calculateRouteAutomatically();
            }
        );
    } else {
        // Standardní akce při kliknutí na marker (zobrazení informací o bodu)
        showPointInfo(point);
    }
}

/**
 * Funkce pro automatický výpočet trasy
 */
function calculateRouteAutomatically() {
    // Kontrola, zda máme dostatek bodů pro výpočet trasy
    if (selectedPoints.length < 2) {
        showNotification('Pro výpočet trasy jsou potřeba alespoň dva body.', 'warning');
        return;
    }
    
    // Zobrazení indikátoru načítání
    showLoadingIndicator('Probíhá výpočet trasy...');
    
    // Získání souřadnic všech bodů
    const waypoints = selectedPoints.map(point => [point.lat, point.lng]);
    
    // Výpočet trasy pomocí OpenRouteService API
    calculateRoute(waypoints)
        .then(route => {
            // Zobrazení trasy na mapě
            displayRouteOnMap(route);
            
            // Zobrazení informací o trase
            showRouteInfo(route);
            
            // Skrytí indikátoru načítání
            hideLoadingIndicator();
            
            // Zobrazení notifikace o úspěšném výpočtu
            showNotification('Trasa byla úspěšně vypočítána!', 'success');
            
            // Přidání XP za výpočet trasy
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addExperience(10, 'Automatický výpočet trasy', 'map');
            }
        })
        .catch(error => {
            // Skrytí indikátoru načítání
            hideLoadingIndicator();
            
            // Zobrazení chybové notifikace
            showNotification('Chyba při výpočtu trasy: ' + error.message, 'error');
            
            console.error('Chyba při výpočtu trasy:', error);
        });
}
```

### 3. Přidání vizuální indikace možnosti automatického výpočtu

```javascript
/**
 * Funkce pro zobrazení informace o možnosti automatického výpočtu
 */
function showAutoCalculateInfo() {
    // Vytvoření informačního prvku
    const infoElement = document.createElement('div');
    infoElement.className = 'auto-calculate-info';
    infoElement.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>Tip: Klikněte na první bod pro automatický výpočet celé trasy.</span>
        <button class="close-btn">&times;</button>
    `;
    
    // Přidání informačního prvku do DOM
    document.body.appendChild(infoElement);
    
    // Animace zobrazení
    setTimeout(() => {
        infoElement.classList.add('visible');
    }, 100);
    
    // Automatické skrytí po 5 sekundách
    setTimeout(() => {
        hideAutoCalculateInfo();
    }, 5000);
    
    // Event listener pro tlačítko zavření
    infoElement.querySelector('.close-btn').addEventListener('click', () => {
        hideAutoCalculateInfo();
    });
}

/**
 * Funkce pro skrytí informace o možnosti automatického výpočtu
 */
function hideAutoCalculateInfo() {
    const infoElement = document.querySelector('.auto-calculate-info');
    if (infoElement) {
        infoElement.classList.remove('visible');
        
        // Odstranění prvku po dokončení animace
        setTimeout(() => {
            infoElement.remove();
        }, 300);
    }
}
```

### 4. Přidání vizuální indikace klikatelnosti prvního bodu

```javascript
/**
 * Funkce pro přidání markeru pro vybraný bod
 * @param {Object} point - Vybraný bod
 */
function addMarkerForSelectedPoint(point) {
    // Vytvoření markeru
    const marker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-content ${selectedPoints.length === 1 ? 'first-point' : ''}">${selectedPoints.length}</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    }).addTo(map);
    
    // Přidání event listeneru pro kliknutí na marker
    marker.on('click', () => {
        onMarkerClick(marker, point);
    });
    
    // Přidání markeru do seznamu markerů
    markers.push({
        marker,
        point
    });
    
    // Pokud je to první bod, přidáme speciální efekt pro indikaci klikatelnosti
    if (selectedPoints.length === 1) {
        addClickableEffectToFirstPoint(marker);
    }
}

/**
 * Funkce pro přidání efektu klikatelnosti prvnímu bodu
 * @param {Object} marker - Marker prvního bodu
 */
function addClickableEffectToFirstPoint(marker) {
    // Přidání pulzujícího efektu
    const markerElement = marker.getElement();
    markerElement.classList.add('clickable-marker');
    
    // Přidání tooltipu
    marker.bindTooltip('Klikněte pro automatický výpočet trasy', {
        direction: 'top',
        permanent: false,
        opacity: 0.9,
        className: 'clickable-marker-tooltip'
    });
    
    // Zobrazení tooltipu po 1 sekundě
    setTimeout(() => {
        marker.openTooltip();
        
        // Skrytí tooltipu po 3 sekundách
        setTimeout(() => {
            marker.closeTooltip();
        }, 3000);
    }, 1000);
}
```

### 5. Přidání CSS stylů pro vizuální indikace

```css
/* Styly pro informační prvek o automatickém výpočtu */
.auto-calculate-info {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: rgba(74, 128, 245, 0.9);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;
}

.auto-calculate-info.visible {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

.auto-calculate-info i {
    font-size: 1.2rem;
}

.auto-calculate-info .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
}

/* Styly pro marker prvního bodu */
.marker-content.first-point {
    background-color: #4a80f5;
    color: white;
    font-weight: bold;
}

/* Pulzující efekt pro klikatelný marker */
.clickable-marker {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Tooltip pro klikatelný marker */
.clickable-marker-tooltip {
    background-color: #4a80f5;
    border: none;
    color: white;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 6px;
}

.clickable-marker-tooltip::before {
    border-top-color: #4a80f5;
}

/* Tmavý režim */
[data-theme="dark"] .auto-calculate-info {
    background-color: rgba(96, 165, 250, 0.9);
}

[data-theme="dark"] .clickable-marker-tooltip {
    background-color: #60a5fa;
}

[data-theme="dark"] .clickable-marker-tooltip::before {
    border-top-color: #60a5fa;
}
```

### 6. Přidání nastavení pro automatický výpočet

```javascript
/**
 * Nastavení pro automatický výpočet trasy
 */
const RouteCalculationSettings = {
    // Výchozí nastavení
    defaults: {
        autoCalculateEnabled: true,
        showConfirmationDialog: true,
        rememberChoice: false
    },
    
    // Aktuální nastavení
    settings: {},
    
    // Inicializace nastavení
    init() {
        // Načtení nastavení z localStorage
        const savedSettings = localStorage.getItem('aiMapaRouteCalculationSettings');
        
        if (savedSettings) {
            try {
                this.settings = JSON.parse(savedSettings);
            } catch (error) {
                console.error('Chyba při načítání nastavení výpočtu trasy:', error);
                this.settings = { ...this.defaults };
            }
        } else {
            this.settings = { ...this.defaults };
        }
    },
    
    // Uložení nastavení
    saveSettings() {
        localStorage.setItem('aiMapaRouteCalculationSettings', JSON.stringify(this.settings));
    },
    
    // Získání nastavení
    getSetting(key) {
        return this.settings[key] !== undefined ? this.settings[key] : this.defaults[key];
    },
    
    // Nastavení hodnoty
    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }
};

// Inicializace nastavení
RouteCalculationSettings.init();
```

### 7. Úprava funkce pro zobrazení potvrzovacího dialogu

```javascript
/**
 * Funkce pro zobrazení potvrzovacího dialogu
 * @param {string} title - Nadpis dialogu
 * @param {string} message - Zpráva dialogu
 * @param {Function} onConfirm - Callback funkce při potvrzení
 * @param {Function} onCancel - Callback funkce při zrušení
 */
function showConfirmationDialog(title, message, onConfirm, onCancel = null) {
    // Kontrola nastavení zobrazení potvrzovacího dialogu
    if (!RouteCalculationSettings.getSetting('showConfirmationDialog')) {
        // Pokud je zobrazení dialogu vypnuto, rovnou potvrdíme akci
        if (onConfirm) onConfirm();
        return;
    }
    
    // Vytvoření dialogu
    const dialog = document.createElement('div');
    dialog.className = 'confirmation-dialog';
    dialog.innerHTML = `
        <div class="confirmation-dialog-content">
            <h3>${title}</h3>
            <p>${message}</p>
            <div class="confirmation-dialog-checkbox">
                <label>
                    <input type="checkbox" id="rememberChoice"> Zapamatovat volbu
                </label>
            </div>
            <div class="confirmation-dialog-buttons">
                <button class="btn btn-secondary cancel-btn">Zrušit</button>
                <button class="btn btn-primary confirm-btn">Potvrdit</button>
            </div>
        </div>
    `;
    
    // Přidání dialogu do DOM
    document.body.appendChild(dialog);
    
    // Animace zobrazení
    setTimeout(() => {
        dialog.classList.add('visible');
    }, 10);
    
    // Event listener pro tlačítko potvrzení
    dialog.querySelector('.confirm-btn').addEventListener('click', () => {
        // Kontrola, zda si uživatel přeje zapamatovat volbu
        const rememberChoice = dialog.querySelector('#rememberChoice').checked;
        
        if (rememberChoice) {
            RouteCalculationSettings.setSetting('showConfirmationDialog', false);
            RouteCalculationSettings.setSetting('rememberChoice', true);
        }
        
        // Zavření dialogu
        closeConfirmationDialog(dialog);
        
        // Volání callback funkce
        if (onConfirm) onConfirm();
    });
    
    // Event listener pro tlačítko zrušení
    dialog.querySelector('.cancel-btn').addEventListener('click', () => {
        // Kontrola, zda si uživatel přeje zapamatovat volbu
        const rememberChoice = dialog.querySelector('#rememberChoice').checked;
        
        if (rememberChoice) {
            RouteCalculationSettings.setSetting('showConfirmationDialog', false);
            RouteCalculationSettings.setSetting('rememberChoice', true);
        }
        
        // Zavření dialogu
        closeConfirmationDialog(dialog);
        
        // Volání callback funkce
        if (onCancel) onCancel();
    });
}

/**
 * Funkce pro zavření potvrzovacího dialogu
 * @param {HTMLElement} dialog - Element dialogu
 */
function closeConfirmationDialog(dialog) {
    dialog.classList.remove('visible');
    
    // Odstranění dialogu po dokončení animace
    setTimeout(() => {
        dialog.remove();
    }, 300);
}
```

### 8. Přidání nastavení do uživatelského rozhraní

```html
<div class="settings-section">
    <h3>Výpočet trasy</h3>
    
    <div class="setting-item">
        <label for="autoCalculateEnabled">Automatický výpočet trasy po kliknutí na první bod:</label>
        <div class="toggle-container">
            <span>Vypnuto</span>
            <label class="switch">
                <input type="checkbox" id="autoCalculateEnabled" checked>
                <span class="slider round"></span>
            </label>
            <span>Zapnuto</span>
        </div>
    </div>
    
    <div class="setting-item">
        <label for="showConfirmationDialog">Zobrazit potvrzovací dialog před automatickým výpočtem:</label>
        <div class="toggle-container">
            <span>Vypnuto</span>
            <label class="switch">
                <input type="checkbox" id="showConfirmationDialog" checked>
                <span class="slider round"></span>
            </label>
            <span>Zapnuto</span>
        </div>
    </div>
</div>
```

```javascript
/**
 * Funkce pro inicializaci nastavení výpočtu trasy v uživatelském rozhraní
 */
function initRouteCalculationSettings() {
    // Získání elementů nastavení
    const autoCalculateEnabledElement = document.getElementById('autoCalculateEnabled');
    const showConfirmationDialogElement = document.getElementById('showConfirmationDialog');
    
    if (!autoCalculateEnabledElement || !showConfirmationDialogElement) return;
    
    // Nastavení počátečních hodnot
    autoCalculateEnabledElement.checked = RouteCalculationSettings.getSetting('autoCalculateEnabled');
    showConfirmationDialogElement.checked = RouteCalculationSettings.getSetting('showConfirmationDialog');
    
    // Event listenery pro změnu nastavení
    autoCalculateEnabledElement.addEventListener('change', () => {
        RouteCalculationSettings.setSetting('autoCalculateEnabled', autoCalculateEnabledElement.checked);
    });
    
    showConfirmationDialogElement.addEventListener('change', () => {
        RouteCalculationSettings.setSetting('showConfirmationDialog', showConfirmationDialogElement.checked);
    });
}

// Inicializace nastavení po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    initRouteCalculationSettings();
});
```

## Testování

Pro ověření správné implementace automatického výpočtu trasy je potřeba provést následující testy:

1. **Základní funkcionalita** - Ověřit, že po kliknutí na první bod se zobrazí potvrzovací dialog a po potvrzení se automaticky vypočítá trasa
2. **Nastavení** - Ověřit, že nastavení automatického výpočtu funguje správně (zapnutí/vypnutí, zapamatování volby)
3. **Vizuální indikace** - Ověřit, že první bod má správnou vizuální indikaci klikatelnosti
4. **Informační prvek** - Ověřit, že se zobrazuje informační prvek o možnosti automatického výpočtu
5. **Mobilní zařízení** - Ověřit, že funkcionalita funguje správně i na mobilních zařízeních

## Závěr

Implementace automatického výpočtu trasy po kliknutí na první bod výrazně zjednoduší uživatelské rozhraní pro výpočet tras v aplikaci AIMapa. Uživatelé budou moci rychleji a intuitivněji vypočítat trasu mezi body, což přispěje k lepšímu uživatelskému zážitku.

---

*Poslední aktualizace: 2025-07-08*
