# Nové achievementy pro verzi 0.3.8.2

Tento dokument obsahuje seznam nových achievementů, které budou přidány ve verzi 0.3.8.2 se zaměřením na mobilní používání a offline režim.

## Achievementy pro mobilní používání

### 1. Mobilní průzkumník
- **Popis**: Používejte aplikaci na mobilním zařízení po dobu 30 minut
- **Ikona**: 📱
- **Kategorie**: Zobrazení
- **Odměna**: 50 XP
- **Implementace**: Detekce typu zařízení a sledování času používání

### 2. Dotykový mistr
- **Popis**: Použijte všechna podporovaná dotyková gesta během jednoho sezení
- **Ikona**: 👆
- **Kategorie**: Zobrazení
- **Odměna**: 75 XP
- **Implementace**: Sledování použitých gest (přiblížení, rotace, posun, klepnutí, dvojité klepnutí, trojité klepnutí)

### 3. Cestovatel s mapou
- **Popis**: Použijte aplikaci na 5 různých místech (s různými GPS souřadnicemi)
- **Ikona**: 🧭
- **Kategorie**: Mapa
- **Odměna**: 100 XP
- **Implementace**: Ukládání unikátních GPS lokací, kde byla aplikace použita

### 4. Mobilní pracant
- **Popis**: Dokončete 3 virtuální práce na mobilním zařízení
- **Ikona**: 💼
- **Kategorie**: Práce
- **Odměna**: 150 XP, 300 Kč
- **Implementace**: Sledování dokončených prací na mobilním zařízení

### 5. Orientační běžec
- **Popis**: Vypočítejte a následujte trasu delší než 2 km na mobilním zařízení
- **Ikona**: 🏃
- **Kategorie**: Mapa
- **Odměna**: 120 XP
- **Implementace**: Sledování vypočítaných tras a pohybu uživatele po trase

## Achievementy pro offline režim

### 6. Offline průkopník
- **Popis**: Aktivujte offline režim a používejte aplikaci bez připojení k internetu
- **Ikona**: 🔌
- **Kategorie**: Nastavení
- **Odměna**: 80 XP
- **Implementace**: Detekce používání v offline režimu

### 7. Datový šetřič
- **Popis**: Stáhněte offline mapy pro 3 různé oblasti
- **Ikona**: 💾
- **Kategorie**: Mapa
- **Odměna**: 100 XP
- **Implementace**: Sledování počtu stažených offline map

### 8. Nezávislý uživatel
- **Popis**: Používejte aplikaci v offline režimu po dobu 2 hodin (kumulativně)
- **Ikona**: 🏝️
- **Kategorie**: Nastavení
- **Odměna**: 150 XP
- **Implementace**: Sledování celkového času používání v offline režimu

### 9. Offline plánovač
- **Popis**: Vytvořte 10 bodů na mapě v offline režimu
- **Ikona**: 📍
- **Kategorie**: Mapa
- **Odměna**: 120 XP
- **Implementace**: Sledování počtu bodů vytvořených v offline režimu

### 10. Synchronizační mistr
- **Popis**: Úspěšně synchronizujte data mezi dvěma zařízeními
- **Ikona**: 🔄
- **Kategorie**: Nastavení
- **Odměna**: 200 XP
- **Implementace**: Detekce úspěšné synchronizace dat mezi zařízeními

## Implementační detaily

Pro implementaci těchto achievementů bude potřeba:

1. **Detekce typu zařízení**:
```javascript
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

2. **Sledování dotykových gest**:
```javascript
const TouchGestureTracker = {
    gestures: {
        tap: false,
        doubleTap: false,
        tripleTap: false,
        pinch: false,
        rotate: false,
        pan: false
    },
    
    trackGesture(gesture) {
        this.gestures[gesture] = true;
        this.checkAllGesturesUsed();
    },
    
    checkAllGesturesUsed() {
        if (Object.values(this.gestures).every(used => used)) {
            // Udělit achievement "Dotykový mistr"
            if (typeof Achievements !== 'undefined') {
                Achievements.awardAchievement('touch-master');
            }
        }
    }
};
```

3. **Sledování GPS lokací**:
```javascript
const LocationTracker = {
    visitedLocations: [],
    
    trackLocation(lat, lng) {
        // Kontrola, zda je lokace dostatečně vzdálená od již navštívených
        const isNewLocation = this.visitedLocations.every(loc => 
            this.calculateDistance(loc.lat, loc.lng, lat, lng) > 0.5 // 0.5 km
        );
        
        if (isNewLocation) {
            this.visitedLocations.push({ lat, lng });
            
            // Kontrola achievementu
            if (this.visitedLocations.length >= 5) {
                // Udělit achievement "Cestovatel s mapou"
                if (typeof Achievements !== 'undefined') {
                    Achievements.awardAchievement('map-traveler');
                }
            }
        }
    },
    
    calculateDistance(lat1, lng1, lat2, lng2) {
        // Implementace výpočtu vzdálenosti mezi dvěma body
        // Haversine formula
    }
};
```

4. **Sledování offline režimu**:
```javascript
const OfflineTracker = {
    offlineStartTime: null,
    totalOfflineTime: 0,
    
    startOfflineTracking() {
        this.offlineStartTime = Date.now();
    },
    
    stopOfflineTracking() {
        if (this.offlineStartTime) {
            const sessionTime = (Date.now() - this.offlineStartTime) / 1000 / 60; // v minutách
            this.totalOfflineTime += sessionTime;
            this.offlineStartTime = null;
            
            // Kontrola achievementu
            if (this.totalOfflineTime >= 120) { // 2 hodiny
                // Udělit achievement "Nezávislý uživatel"
                if (typeof Achievements !== 'undefined') {
                    Achievements.awardAchievement('independent-user');
                }
            }
        }
    }
};
```

## Integrace s existujícím systémem achievementů

Nové achievementy budou integrovány do existujícího systému achievementů v souboru `achievements.js`. Bude potřeba:

1. Přidat nové achievementy do seznamu `achievements`
2. Implementovat nové metody pro sledování specifických aktivit
3. Propojit s moduly pro detekci mobilních zařízení a offline režimu
4. Aktualizovat UI pro zobrazení nových achievementů

## Testování

Pro testování nových achievementů doporučujeme:

1. Testovat na různých mobilních zařízeních (Android, iOS)
2. Testovat s různými verzemi prohlížečů
3. Testovat v režimu letadlo pro simulaci offline režimu
4. Testovat synchronizaci mezi více zařízeními

---

*Poslední aktualizace: 2025-07-08*
