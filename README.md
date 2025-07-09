# 🎤 AIMapa - VoiceBot Edition

[![Version](https://img.shields.io/badge/version-0.3.8.6-blue.svg)](https://github.com/l4zorik/AIMapa/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![VoiceBot](https://img.shields.io/badge/VoiceBot-Czech-red.svg)](VOICEBOT_DOCUMENTATION.md)

**První česká interaktivní mapová aplikace s kompletním hlasovým ovládáním**

AIMapa je pokročilá webová aplikace, která kombinuje interaktivní mapu s umělou inteligencí, virtuální prací a revolučním VoiceBot systémem. Říkejte mapě, co má dělat!

## ✨ Hlavní funkce

### 🎤 VoiceBot - Hlasové ovládání
- **Rozpoznávání řeči** - České hlasové příkazy pomocí Web Speech API
- **Syntéza řeči** - Kvalitní český hlas pro AI asistenta
- **50+ hlasových příkazů** - Ovládání mapy, navigace, práce a služeb
- **Kontextové odpovědi** - Inteligentní reakce na situace

### 🗺️ Pokročilé mapové funkce
- **Interaktivní mapa** - Leaflet.js s optimalizovaným výkonem
- **3D glóbus režim** - Prostorové zobrazení mapy
- **Inteligentní navigace** - AI asistované směrování
- **Fullscreen režim** - Maximální využití obrazovky

### 💼 Virtuální ekonomika
- **Virtuální práce** - Vydělávání virtuálních peněz
- **Systém úkolů** - Denní questy a hlavní příběhové úkoly
- **Achievementy** - Odemykání úspěchů a sledování postupu
- **Kryptoměny** - Bitcoin, Ethereum, Dogecoin, Ripple

### 🛍️ Integrované služby
- **Objednání jídla** - Restaurace a rychlé občerstvení
- **Taxi služby** - Objednání dopravy
- **Lékařské služby** - Vyhledání lékařů a lékáren
- **Bydlení** - Hledání ubytování

### 🎨 Moderní design
- **Responzivní UI** - Optimalizace pro všechna zařízení
- **Tmavý režim** - Elegantní tmavé téma
- **Animace a efekty** - Plynulé přechody a mikrointerakce
- **Přístupnost** - Podpora screen readerů a klávesového ovládání

## 🚀 Rychlý start

### Spuštění nejnovější verze (v0.3.8.6 - VoiceBot)
```bash
# Přepnutí na VoiceBot branch
git checkout feature/voicebot-optimization-v0.3.8.6

# Instalace závislostí
npm install

# Spuštění aplikace
npm start
```

### Testování VoiceBot
- **Hlavní aplikace**: http://localhost:3000
- **VoiceBot test**: http://localhost:3000/voicebot-test.html

### Hlasové příkazy k vyzkoušení
- "nápověda" - zobrazí seznam příkazů
- "čas" - řekne aktuální čas
- "přiblíž" / "oddal" - ovládání mapy
- "virtuální práce" - otevře pracovní modul

## 🎯 Verze a branches

### 📦 Aktuální verze
- **Nejnovější**: v0.3.8.6 - VoiceBot Edition (feature branch)
- **Produkční**: v0.3.8.5 - Stabilní verze (main branch)

### 🌳 Důležité branches
- `feature/voicebot-optimization-v0.3.8.6` - 🎤 VoiceBot systém
- `main` - Produkční verze
- `stable` - Stabilní testovací verze

📋 **Kompletní dokumentace verzí**: [VERSION_MANAGEMENT.md](VERSION_MANAGEMENT.md)

## 🛠️ Technologie

### Frontend
- **HTML5, CSS3, JavaScript ES6+**
- **Leaflet.js** - Interaktivní mapy
- **Web Speech API** - Rozpoznávání a syntéza řeči
- **CSS Grid & Flexbox** - Responzivní layout

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Supabase** - Databáze a autentifikace

### VoiceBot technologie
- **Speech Recognition API** - Rozpoznávání řeči
- **Speech Synthesis API** - Text-to-speech
- **Event-driven architektura** - Modulární komunikace

## 📦 Instalace

### Základní instalace
```bash
# 1. Naklonujte repozitář
git clone https://github.com/l4zorik/AIMapa.git
cd AIMapa

# 2. Nainstalujte závislosti
npm install

# 3. Spusťte aplikaci
npm start

# 4. Otevřete v prohlížeči
# http://localhost:3000
```

### Konfigurace (volitelné)
Vytvořte soubor `.env` pro pokročilé nastavení:
```env
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## 🌐 Kompatibilita prohlížečů

### VoiceBot podpora
- ✅ **Chrome/Chromium** - Plná podpora
- ✅ **Microsoft Edge** - Plná podpora
- ⚠️ **Firefox** - Částečná podpora (pouze syntéza řeči)
- ⚠️ **Safari** - Částečná podpora

### Obecná kompatibilita
- ✅ Všechny moderní prohlížeče
- ✅ Mobilní zařízení (iOS, Android)
- ✅ Tablety a desktopy

## Vývoj

Pro vývojový režim s automatickým restartem serveru při změnách:
```
npm run dev
```

## Struktura projektu

- `public/` - Statické soubory (HTML, CSS, klientský JavaScript)
- `public/app/` - Moduly aplikace
- `routes/` - API endpointy
- `server.js` - Hlavní soubor serveru
- `package.json` - Konfigurace projektu a závislosti
- `netlify.toml` - Konfigurace nasazení na Netlify

## Integrace s Supabase a Netlify

AIMapa je integrována s Supabase pro ukládání dat v cloudu a autentizaci uživatelů, a s Netlify pro automatické nasazení aplikace. Podrobné informace o integraci najdete v souboru [SUPABASE_NETLIFY_INTEGRATION.md](SUPABASE_NETLIFY_INTEGRATION.md).

## 📚 Dokumentace

### Uživatelská dokumentace
- 📖 **[VoiceBot dokumentace](VOICEBOT_DOCUMENTATION.md)** - Kompletní průvodce hlasovým ovládáním
- 📋 **[Správa verzí](VERSION_MANAGEMENT.md)** - Přehled všech verzí a jejich funkcí
- 📝 **[Changelog](CHANGELOG.md)** - Detailní seznam změn

### Vývojářská dokumentace
- 🔧 **API dokumentace** - Popis všech modulů a funkcí
- 🧪 **Testování** - Návody pro testování funkcí
- 🚀 **Deployment** - Nasazení do produkce

## 🎯 Roadmapa

### v0.3.8.7 - 3D Map Providers (Připravuje se)
- 🗺️ **Mapbox integrace** - Pokročilé 3D mapy
- 🌍 **Google Maps podpora** - Street View integrace
- 🔧 **Univerzální API** - Jednotné rozhraní pro všechny providery

### v0.4.0 - Major Release (Budoucnost)
- 🌐 **Multi-jazyčná podpora** - Angličtina, němčina, slovenština
- 📱 **PWA aplikace** - Offline režim a instalace
- 🤖 **Pokročilé AI** - Lepší rozpoznávání a odpovědi

## 🤝 Přispívání

Vítáme příspěvky od komunity!

### Jak přispět
1. **Fork** repozitáře
2. **Vytvořte feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** změny (`git commit -m 'Add amazing feature'`)
4. **Push** do branch (`git push origin feature/amazing-feature`)
5. **Otevřete Pull Request**

### Typy příspěvků
- 🐛 **Bug reports** - Hlášení chyb
- ✨ **Feature requests** - Návrhy nových funkcí
- 📝 **Dokumentace** - Vylepšení dokumentace
- 🎨 **Design** - UI/UX vylepšení
- 🔧 **Kód** - Implementace funkcí a opravy

## 📊 Statistiky projektu

![GitHub stars](https://img.shields.io/github/stars/l4zorik/AIMapa?style=social)
![GitHub forks](https://img.shields.io/github/forks/l4zorik/AIMapa?style=social)
![GitHub issues](https://img.shields.io/github/issues/l4zorik/AIMapa)
![GitHub pull requests](https://img.shields.io/github/issues-pr/l4zorik/AIMapa)

### Vývoj
- **15+ releases** s kontinuálními vylepšeními
- **28 branches** pro různé funkce
- **11 pull requests** úspěšně sloučených
- **50+ commits** s detailní historií

## 🏆 Achievementy projektu

- 🥇 **První česká mapa s VoiceBot** - Průkopník hlasového ovládání
- ⚡ **40% rychlejší načítání** - Optimalizace výkonu
- 🎨 **Moderní UI/UX** - Responzivní design s animacemi
- 🌐 **Cross-platform** - Funguje na všech zařízeních
- ♿ **Přístupnost** - Podpora pro uživatele se speciálními potřebami

## 📞 Kontakt a podpora

### Komunita
- 💬 **[GitHub Discussions](https://github.com/l4zorik/AIMapa/discussions)** - Diskuze a nápady
- 🐛 **[Issues](https://github.com/l4zorik/AIMapa/issues)** - Hlášení chyb
- 📧 **[Pull Requests](https://github.com/l4zorik/AIMapa/pulls)** - Příspěvky kódu

### Autor
- 👨‍💻 **Jan Lazorik** - [@l4zorik](https://github.com/l4zorik)
- 🌐 **Projekt**: [AIMapa](https://github.com/l4zorik/AIMapa)

## 📄 Licence

Tento projekt je licencován pod **MIT licencí** - viz soubor [LICENSE](LICENSE) pro více informací.

## 🙏 Poděkování

### Speciální poděkování
- **Augment Code** - Za implementaci VoiceBot systému
- **Komunita vývojářů** - Za zpětnou vazbu a návrhy
- **Beta testery** - Za testování a hlášení chyb

### Použité technologie
- **Leaflet.js** - Za skvělou mapovou knihovnu
- **Web Speech API** - Za možnosti hlasového ovládání
- **Supabase** - Za backend služby
- **Node.js** - Za server runtime

---

<div align="center">

**🎤 Zkuste AIMapa s VoiceBot - Řekněte mapě, co má dělat!**

[![Spustit aplikaci](https://img.shields.io/badge/Spustit-AIMapa-blue?style=for-the-badge)](http://localhost:3000)
[![VoiceBot test](https://img.shields.io/badge/Test-VoiceBot-red?style=for-the-badge)](http://localhost:3000/voicebot-test.html)

*Vytvořeno s ❤️ pro českou komunitu*

</div>