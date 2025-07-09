# 🧪 Testovací průvodce - AIMapa v0.3.8.6

Tento dokument poskytuje kompletní návod pro testování všech funkcí aplikace AIMapa, zejména nového VoiceBot systému.

## 🚀 Rychlé spuštění testování

### 1. Spuštění nejnovější verze
```bash
# Přepnutí na VoiceBot branch
git checkout feature/voicebot-optimization-v0.3.8.6

# Instalace závislostí (pokud ještě nebyly nainstalovány)
npm install

# Spuštění aplikace
npm start
```

### 2. Testovací odkazy
- **Hlavní aplikace**: http://localhost:3000
- **VoiceBot test stránka**: http://localhost:3000/voicebot-test.html

## 🎤 Testování VoiceBot systému

### Základní kontrola
1. **Otevřete hlavní aplikaci** na http://localhost:3000
2. **Najděte VoiceBot panel** v pravém horním rohu
3. **Ověřte viditelnost** - měli byste vidět panel s nápisem "🎤 VoiceBot"

### Test kompatibility prohlížeče
Navštivte **testovací stránku**: http://localhost:3000/voicebot-test.html

**Co kontrolovat:**
- ✅ Zelená značka = Plná podpora
- ⚠️ Oranžová značka = Částečná podpora  
- ❌ Červená značka = Nepodporováno

**Očekávané výsledky:**
- **Chrome/Edge**: Plná podpora (zelená)
- **Firefox**: Částečná podpora (oranžová)
- **Safari**: Částečná podpora (oranžová)

### Test hlasových příkazů

#### Krok 1: Povolení mikrofonu
1. **Klikněte na zelené tlačítko "Mluvit"**
2. **Povolte mikrofon** když se prohlížeč zeptá
3. **Počkejte na zprávu** "Poslouchám..."

#### Krok 2: Základní příkazy
Zkuste říct následující příkazy **jasně a pomalu**:

**Informační příkazy:**
- **"nápověda"** - Zobrazí seznam všech příkazů
- **"čas"** - Řekne aktuální čas
- **"datum"** - Řekne dnešní datum

**Mapové příkazy:**
- **"přiblíž"** - Přiblíží mapu
- **"oddal"** - Oddálí mapu
- **"střed"** - Vycentruje mapu na Praha

**Systémové příkazy:**
- **"mlč"** - Zastaví mluvení
- **"zavři"** - Zastaví naslouchání

#### Krok 3: Pokročilé příkazy
**Pracovní příkazy:**
- **"virtuální práce"** - Otevře modul práce
- **"stav práce"** - Hlásí aktuální stav

**Služby:**
- **"objednej jídlo"** - Otevře službu jídla
- **"najdi lékárnu"** - Vyhledá lékárny

### Test klávesových zkratek
**Zkuste následující kombinace:**
- **Ctrl + V** - Zapne/vypne VoiceBot
- **Ctrl + F** - Fullscreen režim
- **Ctrl + D** - Tmavý/světlý režim
- **Ctrl + G** - Glóbus režim
- **Escape** - Zavře všechny dialogy

## 🗺️ Testování mapových funkcí

### Základní ovládání mapy
1. **Zoom** - Kolečko myši nebo tlačítka +/-
2. **Posun** - Tažení myší
3. **Fullscreen** - Tlačítko nebo Ctrl+F
4. **Tmavý režim** - Ctrl+D

### Test responzivity
1. **Změňte velikost okna** - Zkontrolujte přizpůsobení
2. **Mobilní simulace** - F12 → Device toolbar
3. **Orientace** - Otočení na mobilním zařízení

## 💼 Testování virtuální práce

### Otevření modulu práce
1. **Hlasový příkaz**: "virtuální práce"
2. **Menu příkazů**: Klik na menu → Práce
3. **Přímé kliknutí**: Tlačítko na mapě

### Test funkcí práce
1. **Výběr typu práce** - Kancelářská, programování, atd.
2. **Definování úkolů** - Přidání vlastních úkolů
3. **Spuštění práce** - Začít pracovat s úkoly
4. **Sledování postupu** - Progress bar a dokončené úkoly

## 🏆 Testování achievementů

### Zobrazení achievementů
1. **Hlasový příkaz**: "moje úspěchy"
2. **Menu příkazů**: Achievementy
3. **Kontrola postupu**: Sledování XP a úrovní

### Test získávání XP
1. **Práce** - Dokončení úkolů
2. **Navigace** - Výpočet tras
3. **Služby** - Používání různých služeb
4. **VoiceBot** - Používání hlasových příkazů

## 🛍️ Testování služeb

### Testování jednotlivých služeb
1. **Jídlo** - Objednání z restaurací
2. **Taxi** - Objednání dopravy
3. **Lékařské** - Vyhledání lékařů
4. **Bydlení** - Hledání ubytování

### Test hlasového ovládání služeb
- **"objednej jídlo"** → Otevře food services
- **"zavolej taxi"** → Spustí taxi službu
- **"najdi lékárnu"** → Vyhledá lékárny

## 🎨 Testování UI/UX

### Tmavý režim
1. **Aktivace**: Ctrl+D nebo nastavení
2. **Kontrola**: Všechny komponenty v tmavém tématu
3. **VoiceBot**: Panel správně přizpůsoben

### Animace a efekty
1. **VoiceBot animace** - Pulzování při naslouchání
2. **Hover efekty** - Tlačítka a interaktivní prvky
3. **Přechody** - Plynulé změny stavů

### Responzivní design
1. **Desktop** - Plná funkcionalita
2. **Tablet** - Přizpůsobené ovládání
3. **Mobil** - Touch-friendly interface

## 🔧 Testování výkonu

### Rychlost načítání
1. **Čas startu** - Měření času do plné funkčnosti
2. **Inicializace VoiceBot** - Rychlost spuštění hlasových funkcí
3. **Responzivita** - Odezva na akce uživatele

### Využití paměti
1. **Otevřete DevTools** (F12)
2. **Performance tab** - Sledování výkonu
3. **Memory tab** - Kontrola využití paměti

## 🐛 Hlášení chyb

### Co sledovat
1. **Chyby v konzoli** - F12 → Console
2. **Nefunkční příkazy** - VoiceBot nereaguje
3. **Vizuální problémy** - Špatné zobrazení
4. **Výkonnostní problémy** - Pomalé načítání

### Jak nahlásit chybu
1. **GitHub Issues**: https://github.com/l4zorik/AIMapa/issues
2. **Uveďte**:
   - Verzi prohlížeče
   - Kroky k reprodukci
   - Očekávané vs. skutečné chování
   - Screenshot/video (pokud možno)

## ✅ Checklist pro kompletní test

### VoiceBot
- [ ] Panel je viditelný
- [ ] Mikrofon funguje
- [ ] Základní příkazy reagují
- [ ] Syntéza řeči funguje
- [ ] Klávesové zkratky fungují

### Mapa
- [ ] Načítání mapy
- [ ] Zoom a posun
- [ ] Fullscreen režim
- [ ] Responzivní design

### Funkce
- [ ] Virtuální práce
- [ ] Achievementy
- [ ] Služby
- [ ] AI chat

### UI/UX
- [ ] Tmavý režim
- [ ] Animace
- [ ] Mobilní optimalizace

### Výkon
- [ ] Rychlé načítání
- [ ] Plynulé animace
- [ ] Bez memory leaks

## 🎯 Očekávané výsledky

### Úspěšný test znamená:
- ✅ VoiceBot reaguje na hlasové příkazy
- ✅ Mapa funguje plynule
- ✅ Všechny služby jsou dostupné
- ✅ UI je responzivní na všech zařízeních
- ✅ Výkon je optimální

### Známé omezení:
- ⚠️ Firefox - pouze syntéza řeči
- ⚠️ Safari - částečná podpora
- ⚠️ Starší prohlížeče - omezená funkcionalita

---

**Pokud narazíte na problémy, neváhejte je nahlásit na [GitHub Issues](https://github.com/l4zorik/AIMapa/issues)!**
