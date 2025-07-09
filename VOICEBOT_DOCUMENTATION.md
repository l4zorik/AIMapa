# VoiceBot Dokumentace - AIMapa v0.3.8.6

Tento dokument popisuje kompletní VoiceBot systém implementovaný v aplikaci AIMapa verze 0.3.8.6.

## Přehled VoiceBot systému

VoiceBot je pokročilý hlasový asistent integrovaný do aplikace AIMapa, který umožňuje uživatelům ovládat aplikaci pomocí hlasových příkazů a komunikovat s AI asistentem přirozeným způsobem.

### Hlavní funkce

1. **Rozpoznávání řeči** - Využívá Web Speech API pro rozpoznávání českých hlasových příkazů
2. **Syntéza řeči** - Převádí text na řeč v českém jazyce
3. **Hlasové ovládání** - Kompletní ovládání aplikace hlasem
4. **AI konverzace** - Přirozená komunikace s AI asistentem
5. **Kontextové odpovědi** - Inteligentní odpovědi na základě aktuální situace

## Podporované hlasové příkazy

### Mapové příkazy
- **"přiblíž"** - Přiblíží mapu
- **"oddal"** - Oddálí mapu  
- **"střed"** - Vycentruje mapu na výchozí pozici
- **"fullscreen"** - Přepne do režimu celé obrazovky
- **"glóbus"** - Přepne do 3D glóbus režimu

### Navigační příkazy
- **"vypočítej trasu"** - Spustí výpočet trasy
- **"vymaž trasu"** - Odstraní aktuální trasu
- **"najdi místo"** - Spustí vyhledávání místa
- **"naviguj do práce"** - Navigace do pracovní lokace
- **"naviguj domů"** - Navigace domů

### Pracovní příkazy
- **"virtuální práce"** - Otevře modul virtuální práce
- **"začni pracovat"** - Spustí práci s hlasovým průvodcem
- **"dokončit práci"** - Dokončí aktuální práci
- **"dokončit úkol"** - Označí úkol jako dokončený
- **"přidat úkol"** - Přidá nový úkol hlasem
- **"stav práce"** - Hlásí aktuální stav práce
- **"pauza v práci"** - Pozastaví práci

### Informační příkazy
- **"moje úspěchy"** - Přečte achievementy
- **"nové achievementy"** - Přečte nové úspěchy
- **"progress"** - Hlásí celkový postup
- **"statistiky"** - Přečte celkové statistiky
- **"čas"** - Řekne aktuální čas
- **"datum"** - Řekne aktuální datum

### Služby
- **"objednej jídlo"** - Otevře službu objednání jídla
- **"zavolej taxi"** - Spustí objednání taxi
- **"najdi lékárnu"** - Najde nejbližší lékárnu
- **"otevírací doba"** - Zobrazí otevírací doby
- **"nejbližší restaurace"** - Najde restaurace v okolí
- **"nejbližší čerpací stanice"** - Najde čerpací stanice

### Systémové příkazy
- **"nápověda"** - Zobrazí seznam příkazů
- **"nastavení"** - Otevře nastavení VoiceBot
- **"zavři"** - Zastaví naslouchání
- **"mlč"** - Zastaví mluvení

## Klávesové zkratky

- **Ctrl + V** - Zapne/vypne VoiceBot
- **Ctrl + F** - Fullscreen režim
- **Ctrl + D** - Tmavý/světlý režim
- **Ctrl + G** - Glóbus režim
- **Escape** - Zavře všechny dialogy

## Technická implementace

### Architektura

VoiceBot systém se skládá ze tří hlavních modulů:

1. **voicebot.js** - Základní VoiceBot funkcionalita
2. **voicebot-advanced.js** - Pokročilé funkce a integrace
3. **voicebot.css** - Styly a animace

### Použité technologie

- **Web Speech API** - Rozpoznávání řeči
- **Speech Synthesis API** - Syntéza řeči
- **Event-driven architektura** - Komunikace mezi moduly
- **CSS Grid a Flexbox** - Responzivní layout
- **CSS Custom Properties** - Dynamické styly

### Podporované prohlížeče

- **Chrome/Chromium** - Plná podpora
- **Edge** - Plná podpora
- **Firefox** - Částečná podpora (pouze syntéza řeči)
- **Safari** - Částečná podpora

## Konfigurace a nastavení

### Základní nastavení

VoiceBot lze konfigurovat pomocí následujících parametrů:

```javascript
{
    volume: 0.8,        // Hlasitost (0.0 - 1.0)
    rate: 1.0,          // Rychlost řeči (0.1 - 10.0)
    pitch: 1.0,         // Výška hlasu (0.0 - 2.0)
    language: 'cs-CZ'   // Jazyk
}
```

### Uložení nastavení

Nastavení se automaticky ukládají do localStorage pod klíčem `voicebot-settings`.

## Použití pro vývojáře

### Inicializace

```javascript
// VoiceBot se inicializuje automaticky
// Ruční inicializace:
await window.VoiceBot.init();
```

### Přidání vlastních příkazů

```javascript
// Přidání nového příkazu
window.VoiceBot.voiceCommands['můj příkaz'] = () => {
    console.log('Vlastní příkaz proveden');
    window.VoiceBot.speak('Příkaz byl proveden');
};
```

### Event listenery

```javascript
// Poslouchání událostí VoiceBot
document.addEventListener('voicebotListening', (event) => {
    console.log('VoiceBot naslouchá');
});

document.addEventListener('voicebotSpeaking', (event) => {
    console.log('VoiceBot mluví:', event.detail.text);
});
```

### Programové ovládání

```javascript
// Spuštění naslouchání
window.VoiceBot.startListening();

// Zastavení naslouchání
window.VoiceBot.stopListening();

// Mluvení textu
window.VoiceBot.speak('Ahoj, jak se máte?');

// Zastavení mluvení
window.VoiceBot.stopSpeaking();
```

## Řešení problémů

### Časté problémy

1. **VoiceBot nereaguje na příkazy**
   - Zkontrolujte povolení mikrofonu v prohlížeči
   - Ověřte, že používáte podporovaný prohlížeč
   - Zkuste obnovit stránku

2. **Špatné rozpoznávání řeči**
   - Mluvte jasně a pomalu
   - Zkontrolujte kvalitu mikrofonu
   - Ověřte nastavení jazyka

3. **VoiceBot nemluví**
   - Zkontrolujte hlasitost systému
   - Ověřte nastavení hlasitosti VoiceBot
   - Zkuste jiný hlas v nastavení

### Ladění

Pro ladění VoiceBot použijte konzoli prohlížeče:

```javascript
// Zapnutí debug režimu
window.VoiceBot.debug = true;

// Kontrola stavu
console.log('VoiceBot stav:', {
    isInitialized: window.VoiceBot.isInitialized,
    isListening: window.VoiceBot.isListening,
    isSpeaking: window.VoiceBot.isSpeaking
});
```

## Budoucí vylepšení

### Plánované funkce

1. **Vícejazyčná podpora** - Angličtina, němčina, slovenština
2. **Vlastní hlasové profily** - Personalizace hlasu
3. **Offline režim** - Základní příkazy bez internetu
4. **Hlasové makra** - Složené příkazy
5. **Integrace s externími službami** - Google Assistant, Alexa

### Optimalizace

1. **Lepší rozpoznávání** - Trénování na specifické příkazy
2. **Rychlejší odezva** - Optimalizace zpracování
3. **Menší spotřeba** - Efektivnější algoritmy
4. **Lepší UX** - Intuitivnější ovládání

## Závěr

VoiceBot v AIMapa představuje moderní způsob interakce s mapovou aplikací. Díky pokročilým webovým technologiím poskytuje přirozené a efektivní ovládání všech funkcí aplikace hlasem.

Pro další informace a podporu navštivte [GitHub repozitář](https://github.com/l4zorik/AIMapa) nebo kontaktujte vývojáře.
