# 🤖 AI Agent Quick Reference - AIMapa

> **Rychlá referenční příručka pro AI agenty pracující s AIMapa projektem**

## 🎯 Základní informace

### Projekt struktura
```
AIMapa/
├── public/           # Frontend soubory
│   ├── app/         # JavaScript moduly
│   ├── css/         # Styly
│   └── index.html   # Hlavní stránka
├── routes/          # Backend API
├── docs/            # Dokumentace
└── server.js        # Hlavní server
```

### Klíčové soubory pro agenty
| Soubor | Účel | Priorita |
|--------|------|----------|
| `public/app/voicebot.js` | VoiceBot logika | 🔴 Kritický |
| `public/app/script.js` | Hlavní aplikační logika | 🔴 Kritický |
| `public/index.html` | HTML struktura | 🟡 Důležitý |
| `server.js` | Backend server | 🟡 Důležitý |
| `package.json` | Závislosti a skripty | 🟢 Informativní |

## 🚀 Rychlé příkazy

### Spuštění aplikace
```bash
# Základní spuštění
npm start

# Vývojový režim s auto-reload
npm run dev

# Testování
npm test
```

### Git workflow
```bash
# Stažení nejnovější verze
git pull origin main

# Vytvoření nové větve
git checkout -b feature/nazev-funkce

# Commit změn
git add .
git commit -m "feat: popis změny"

# Push na GitHub
git push origin feature/nazev-funkce
```

## 🎤 VoiceBot - Klíčové informace

### Aktivace VoiceBot
- **UI tlačítko**: Modré tlačítko mikrofonu v pravém horním rohu
- **Klávesová zkratka**: `Ctrl + Shift + V`
- **Programově**: `window.VoiceBot.toggle()`

### Hlavní VoiceBot soubory
```javascript
// Hlavní VoiceBot třída
public/app/voicebot.js

// Pokročilé funkce
public/app/voicebot-advanced.js

// Styly
public/app/voicebot.css

// Test stránka
public/voice-bot-test.html
```

### Základní VoiceBot API
```javascript
// Aktivace/deaktivace
window.VoiceBot.enable()
window.VoiceBot.disable()
window.VoiceBot.toggle()

// Přidání vlastního příkazu
window.VoiceBot.addVoiceCommand("můj příkaz", () => {
    console.log("Vlastní akce");
});

// Syntéza řeči
window.VoiceBot.speak("Text k přečtení");

// Stav VoiceBot
const status = window.VoiceBot.getStatus();
```

## 🗺️ Mapové funkce

### Hlavní mapový objekt
```javascript
// Globální mapa instance
window.map

// Základní operace
map.setView([lat, lng], zoom)
map.zoomIn()
map.zoomOut()

// Přidání markeru
L.marker([lat, lng]).addTo(map)
```

### Hlasové příkazy pro mapu
| Příkaz | Funkce | JavaScript ekvivalent |
|--------|--------|--------------------|
| "přidat bod" | Aktivuje režim přidávání | `document.getElementById('addActivity').click()` |
| "vypočítat trasu" | Vypočítá trasu | `document.getElementById('calculateRoute').click()` |
| "vymazat mapu" | Vymaže body | `document.getElementById('clearMap').click()` |
| "fullscreen" | Fullscreen režim | `document.getElementById('fullscreenButton').click()` |
| "glóbus" | 3D režim | `document.getElementById('toggleGlobeMode').click()` |

## 🔧 Debugging a diagnostika

### Konzole příkazy
```javascript
// Kontrola VoiceBot stavu
console.log(window.VoiceBot.getStatus());

// Seznam hlasových příkazů
console.log(window.VoiceBot.getAvailableCommands());

// Test syntézy řeči
window.VoiceBot.speak("Test hlasového výstupu");

// Kontrola mapy
console.log(window.map);
```

### Časté problémy a řešení

#### VoiceBot nefunguje
```javascript
// 1. Kontrola podpory prohlížeče
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    console.log("✅ Speech API podporováno");
} else {
    console.log("❌ Speech API není podporováno");
}

// 2. Restart VoiceBot
window.VoiceBot.disable();
setTimeout(() => window.VoiceBot.enable(), 1000);
```

#### Mapa se nenačítá
```javascript
// 1. Kontrola Leaflet
if (typeof L !== 'undefined') {
    console.log("✅ Leaflet načten");
} else {
    console.log("❌ Leaflet není načten");
}

// 2. Reinicializace mapy
if (window.map) {
    window.map.invalidateSize();
}
```

## 📝 Úpravy a customizace

### Přidání nového hlasového příkazu
```javascript
// V souboru voicebot.js, metoda setupVoiceCommands()
this.voiceCommands.set('nový příkaz', () => {
    // Vaše logika zde
    this.speak('Nový příkaz byl proveden');
});
```

### Úprava UI
```css
/* V souboru voicebot.css */
.voice-bot-toggle {
    /* Vlastní styly pro tlačítko */
}
```

### Přidání nové mapové funkce
```javascript
// V souboru script.js
function novaMapovaFunkce() {
    // Implementace
}

// Propojení s VoiceBot
window.VoiceBot.addVoiceCommand("nová funkce", novaMapovaFunkce);
```

## 🔄 Update postupy

### Aktualizace VoiceBot
1. **Backup současné verze**
2. **Stažení nové verze z GitHub**
3. **Merge změn**
4. **Test funkcionalit**
5. **Commit a push**

### Testování po změnách
```bash
# Spuštění testů
npm test

# Manuální test VoiceBot
# Otevřít: http://localhost:3000/voice-bot-test.html

# Test hlavní aplikace
# Otevřít: http://localhost:3000
```

## 📊 Monitoring a analytics

### Klíčové metriky
- **VoiceBot usage**: Počet aktivací a příkazů
- **Map interactions**: Počet kliků a navigací
- **Error rate**: Chyby v konzoli
- **Performance**: Rychlost načítání

### Log monitoring
```javascript
// Zapnutí debug módu
localStorage.setItem('debug', 'true');

// Sledování VoiceBot událostí
window.VoiceBot.onCommand = (command) => {
    console.log('VoiceBot příkaz:', command);
};
```

## 🆘 Emergency postupy

### Rychlé opravy
```bash
# Restart serveru
npm start

# Vyčištění cache
npm run clean

# Reinstalace závislostí
rm -rf node_modules
npm install
```

### Rollback na předchozí verzi
```bash
git log --oneline -10  # Najít hash commitu
git checkout <commit-hash>
npm start
```

## 📞 Kontakty a podpora

- **GitHub Issues**: [AIMapa Issues](https://github.com/l4zorik/AIMapa/issues)
- **Dokumentace**: `/docs/` složka
- **Hlavní vývojář**: Jan Lazorik

---

**⚡ Pro agenty**: Tento dokument je optimalizován pro rychlé vyhledávání a řešení problémů. Použijte `Ctrl + F` pro rychlé nalezení informací.
