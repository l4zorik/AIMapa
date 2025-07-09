# 🎤 VoiceBot Integration Guide for AI Agents

> **Kompletní průvodce pro AI agenty pracující s VoiceBot systémem AIMapa**

## 🎯 Přehled VoiceBot architektury

### Hlavní komponenty
```
VoiceBot System
├── voicebot.js           # Hlavní logika (rozpoznávání, syntéza)
├── voicebot-advanced.js  # Pokročilé funkce (kontextové příkazy)
├── voicebot.css         # UI styly a animace
└── voice-bot-test.html  # Testovací rozhraní
```

### Klíčové třídy a objekty
```javascript
// Hlavní VoiceBot instance
window.VoiceBot = new VoiceBot()

// UI komponenty
window.VoiceBotUI = new VoiceBotUI()

// Globální mapa pro integraci
window.map = L.map('map')
```

## 🔧 Programové rozhraní

### Základní VoiceBot API

#### Aktivace a deaktivace
```javascript
// Zapnutí VoiceBot
window.VoiceBot.enable()
// Výstup: Hlasové ovládání bylo zapnuto

// Vypnutí VoiceBot
window.VoiceBot.disable()
// Výstup: Hlasové ovládání bylo vypnuto

// Přepnutí stavu
window.VoiceBot.toggle()

// Kontrola stavu
const isEnabled = window.VoiceBot.isEnabled
const isListening = window.VoiceBot.isListening
```

#### Syntéza řeči
```javascript
// Základní syntéza
window.VoiceBot.speak("Text k přečtení")

// Pokročilé možnosti
window.VoiceBot.speak("Text", {
    lang: 'cs-CZ',
    rate: 1.0,      // Rychlost (0.1 - 10)
    pitch: 1.0,     // Výška hlasu (0 - 2)
    volume: 1.0     // Hlasitost (0 - 1)
})
```

#### Správa hlasových příkazů
```javascript
// Přidání nového příkazu
window.VoiceBot.addVoiceCommand("můj příkaz", () => {
    console.log("Vlastní akce provedena")
    window.VoiceBot.speak("Příkaz byl proveden")
})

// Odstranění příkazu
window.VoiceBot.removeVoiceCommand("můj příkaz")

// Seznam všech příkazů
const commands = window.VoiceBot.getAvailableCommands()
console.log(commands)
```

### Pokročilé funkce

#### Event listenery
```javascript
// Poslouchání VoiceBot událostí
window.VoiceBot.onCommand = (command, result) => {
    console.log(`Příkaz: ${command}, Výsledek: ${result}`)
}

window.VoiceBot.onSpeechStart = () => {
    console.log("Začátek rozpoznávání řeči")
}

window.VoiceBot.onSpeechEnd = () => {
    console.log("Konec rozpoznávání řeči")
}

window.VoiceBot.onError = (error) => {
    console.error("VoiceBot chyba:", error)
}
```

#### Kontextové příkazy
```javascript
// Nastavení kontextu pro lepší rozpoznávání
window.VoiceBot.setContext("mapa", [
    "přidat bod", "vypočítat trasu", "vymazat mapu"
])

window.VoiceBot.setContext("navigace", [
    "přiblíž", "oddal", "střed", "fullscreen"
])
```

## 🗺️ Integrace s mapou

### Mapové příkazy - implementace

#### Základní mapové operace
```javascript
// Přiblížení mapy
window.VoiceBot.addVoiceCommand("přiblíž", () => {
    if (window.map) {
        window.map.zoomIn()
        window.VoiceBot.speak("Mapa byla přiblížena")
    }
})

// Oddálení mapy
window.VoiceBot.addVoiceCommand("oddal", () => {
    if (window.map) {
        window.map.zoomOut()
        window.VoiceBot.speak("Mapa byla oddálena")
    }
})

// Vycentrování mapy
window.VoiceBot.addVoiceCommand("střed", () => {
    if (window.map) {
        // Hodonín - výchozí pozice
        window.map.setView([48.8553, 17.1225], 13)
        window.VoiceBot.speak("Mapa byla vycentrována")
    }
})
```

#### Pokročilé mapové funkce
```javascript
// Přidání bodu na mapu
window.VoiceBot.addVoiceCommand("přidat bod", () => {
    const addButton = document.getElementById('addActivity')
    if (addButton) {
        addButton.click()
        window.VoiceBot.speak("Režim přidávání bodů byl aktivován")
    }
})

// Výpočet trasy
window.VoiceBot.addVoiceCommand("vypočítat trasu", () => {
    const routeButton = document.getElementById('calculateRoute')
    if (routeButton) {
        routeButton.click()
        window.VoiceBot.speak("Vypočítávám trasu mezi body")
    }
})

// Vymazání mapy
window.VoiceBot.addVoiceCommand("vymazat mapu", () => {
    const clearButton = document.getElementById('clearMap')
    if (clearButton) {
        clearButton.click()
        window.VoiceBot.speak("Mapa byla vymazána")
    }
})
```

## 🤖 AI asistent integrace

### Propojení s chat systémem
```javascript
// Odeslání zprávy do AI asistenta
window.VoiceBot.sendToAI = (message) => {
    if (typeof processMessage === 'function') {
        processMessage(message)
        window.VoiceBot.speak("Zpráva byla odeslána do AI asistenta")
    }
}

// Automatické čtení AI odpovědí
const originalAddMessage = window.addMessage
window.addMessage = function(message, isUser, suggestions) {
    // Volání původní funkce
    originalAddMessage(message, isUser, suggestions)
    
    // Pokud je VoiceBot aktivní a zpráva není od uživatele
    if (!isUser && window.VoiceBot && window.VoiceBot.isEnabled) {
        window.VoiceBot.speak(message)
    }
}
```

### Kontextové AI příkazy
```javascript
// Specifické AI příkazy
const aiCommands = {
    "alexa": () => window.VoiceBot.sendToAI("alexa"),
    "otevírací doba": () => window.VoiceBot.sendToAI("otevírací doba"),
    "najdi restauraci": () => window.VoiceBot.sendToAI("najdi nejbližší restauraci"),
    "počasí": () => window.VoiceBot.sendToAI("jaké je dnes počasí"),
    "doprava": () => window.VoiceBot.sendToAI("aktuální dopravní situace")
}

// Registrace AI příkazů
Object.entries(aiCommands).forEach(([command, action]) => {
    window.VoiceBot.addVoiceCommand(command, action)
})
```

## 🔧 Debugging a diagnostika

### Debug nástroje pro agenty
```javascript
// Zapnutí debug módu
window.VoiceBot.debugMode = true

// Logování všech příkazů
window.VoiceBot.logCommands = true

// Sledování rozpoznávání řeči
window.VoiceBot.onSpeechResult = (transcript, isFinal) => {
    console.log(`Rozpoznáno: "${transcript}" (finální: ${isFinal})`)
}

// Test všech funkcí
window.VoiceBot.runDiagnostics = () => {
    const tests = [
        () => window.VoiceBot.speak("Test syntézy řeči"),
        () => console.log("Příkazy:", window.VoiceBot.getAvailableCommands()),
        () => console.log("Stav:", window.VoiceBot.getStatus())
    ]
    
    tests.forEach((test, index) => {
        setTimeout(test, index * 2000)
    })
}
```

### Časté problémy a řešení

#### VoiceBot se nespustí
```javascript
// Kontrola podpory prohlížeče
const checkBrowserSupport = () => {
    const hasRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    const hasSynthesis = 'speechSynthesis' in window
    
    console.log("Rozpoznávání řeči:", hasRecognition ? "✅" : "❌")
    console.log("Syntéza řeči:", hasSynthesis ? "✅" : "❌")
    
    return hasRecognition && hasSynthesis
}

// Restart VoiceBot
const restartVoiceBot = () => {
    window.VoiceBot.disable()
    setTimeout(() => {
        window.VoiceBot.enable()
        window.VoiceBot.speak("VoiceBot byl restartován")
    }, 1000)
}
```

#### Špatné rozpoznávání příkazů
```javascript
// Vylepšení rozpoznávání
window.VoiceBot.improveRecognition = () => {
    // Nastavení jazyka
    window.VoiceBot.setLanguage('cs-CZ')
    
    // Zvýšení citlivosti
    if (window.VoiceBot.recognition) {
        window.VoiceBot.recognition.interimResults = true
        window.VoiceBot.recognition.maxAlternatives = 3
    }
    
    // Přidání synonym
    const synonyms = {
        "přiblíž": ["zoom in", "větší", "blíž"],
        "oddal": ["zoom out", "menší", "dál"],
        "střed": ["center", "vycentruj", "domů"]
    }
    
    Object.entries(synonyms).forEach(([main, alts]) => {
        alts.forEach(alt => {
            window.VoiceBot.addVoiceCommand(alt, 
                window.VoiceBot.voiceCommands.get(main))
        })
    })
}
```

## 📊 Performance optimalizace

### Optimalizace pro agenty
```javascript
// Lazy loading VoiceBot
const initVoiceBotWhenNeeded = () => {
    if (!window.VoiceBot) {
        import('./voicebot.js').then(module => {
            window.VoiceBot = new module.VoiceBot()
        })
    }
}

// Batch operace
const batchVoiceCommands = (commands) => {
    commands.forEach(({command, action}) => {
        window.VoiceBot.addVoiceCommand(command, action)
    })
}

// Memory management
const cleanupVoiceBot = () => {
    if (window.VoiceBot) {
        window.VoiceBot.disable()
        window.VoiceBot.recognition = null
        window.VoiceBot.synthesis = null
    }
}
```

## 🚀 Deployment a aktualizace

### Automatické nasazení VoiceBot změn
```javascript
// Kontrola verze VoiceBot
const checkVoiceBotVersion = () => {
    return window.VoiceBot?.version || "unknown"
}

// Hot reload VoiceBot
const reloadVoiceBot = async () => {
    // Uložení stavu
    const wasEnabled = window.VoiceBot?.isEnabled
    
    // Cleanup
    cleanupVoiceBot()
    
    // Reload
    delete window.VoiceBot
    await import('./voicebot.js?v=' + Date.now())
    
    // Restore stav
    if (wasEnabled) {
        window.VoiceBot.enable()
    }
}
```

## 📝 Best practices pro agenty

### 1. Vždy kontrolujte dostupnost
```javascript
if (window.VoiceBot && window.VoiceBot.isEnabled) {
    // VoiceBot operace
}
```

### 2. Graceful degradation
```javascript
const executeCommand = (command) => {
    if (window.VoiceBot) {
        window.VoiceBot.processVoiceCommand(command)
    } else {
        // Fallback na UI kliknutí
        document.getElementById(command)?.click()
    }
}
```

### 3. Error handling
```javascript
try {
    window.VoiceBot.speak("Test")
} catch (error) {
    console.warn("VoiceBot nedostupný:", error)
    // Fallback akce
}
```

---

**🎯 Pro AI agenty**: Tento dokument poskytuje vše potřebné pro efektivní práci s VoiceBot systémem. Použijte jej jako referenci při implementaci nových funkcí nebo řešení problémů.
