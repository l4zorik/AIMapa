# 🗺️ AIMapa - Inteligentní mapová aplikace s VoiceBot

> **Nejmodernější webová mapová aplikace s umělou inteligencí a hlasovým ovládáním**

[![Version](https://img.shields.io/badge/version-0.3.8.6-blue.svg)](https://github.com/l4zorik/AIMapa)
[![VoiceBot](https://img.shields.io/badge/VoiceBot-enabled-green.svg)](docs/VOICEBOT_GUIDE.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🌟 Přehled

AIMapa je pokročilá webová aplikace nové generace, která revolučně kombinuje:

### 🎤 **VoiceBot - Hlasové ovládání**
- **50+ českých hlasových příkazů** pro kompletní ovládání
- **Rozpoznávání řeči** s Web Speech API
- **Syntéza řeči** - AI asistent mluví česky
- **Hands-free ovládání** - ideální pro řidiče a handicapované

### 🗺️ **Inteligentní mapování**
- **Interaktivní mapa** s Leaflet.js a OpenStreetMap
- **3D glóbus režim** pro prostorovou orientaci
- **Real-time navigace** s optimalizovanými trasami
- **Offline režim** pro práci bez internetu

### 🤖 **AI asistent**
- **Kontextové odpovědi** na otázky o místech
- **Inteligentní doporučení** tras a služeb
- **Učení z uživatelského chování**
- **Vícejazyčná podpora** (čeština, angličtina)

### 💼 **Virtuální ekonomika**
- **Virtuální práce** s reálnými výdělky
- **Systém achievementů** a odměn
- **Gamifikace** každodenních aktivit
- **Sociální funkce** a žebříčky

### 🛍️ **Integrované služby**
- **Objednání jídla** z místních restaurací
- **Taxi služby** s real-time sledováním
- **Lékařské služby** a emergency kontakty
- **Místní obchody** a otevírací doby

## 🚀 Rychlý start

### Požadavky
- **Node.js** 16+
- **NPM** nebo **Yarn**
- **Moderní prohlížeč** (Chrome, Firefox, Edge, Safari)
- **Mikrofon** (pro VoiceBot)

### Instalace za 3 kroky

```bash
# 1. Stáhněte projekt
git clone https://github.com/l4zorik/AIMapa.git
cd AIMapa

# 2. Nainstalujte závislosti
npm install

# 3. Spusťte aplikaci
npm start
```

**🎉 Hotovo!** Aplikace běží na `http://localhost:3000`

### První spuštění VoiceBot
1. **Klikněte na tlačítko mikrofonu** 🎤 v pravém horním rohu
2. **Povolte přístup k mikrofonu** v prohlížeči
3. **Řekněte "nápověda"** pro seznam příkazů

## 🛠️ Technologie

| Kategorie | Technologie |
|-----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript ES6+, Leaflet.js |
| **Backend** | Node.js, Express.js, RESTful API |
| **Databáze** | Supabase (PostgreSQL), Real-time sync |
| **VoiceBot** | Web Speech API, SpeechRecognition, SpeechSynthesis |
| **Nasazení** | Netlify, GitHub Actions, CDN |
| **Monitoring** | Real-time analytics, Error tracking |

## 📚 Dokumentace

### 🎯 **Pro uživatele**
- 🚀 [**Rychlý start**](docs/user/QUICK_START.md) - Jak začít používat AIMapa
- 🎤 [**VoiceBot průvodce**](docs/user/VOICEBOT_GUIDE.md) - Kompletní hlasové ovládání
- 📱 [**Mobilní aplikace**](docs/user/MOBILE_GUIDE.md) - Používání na telefonu/tabletu
- 🔧 [**Řešení problémů**](docs/user/TROUBLESHOOTING.md) - Časté problémy a řešení

### 👨‍💻 **Pro vývojáře**
- 🏗️ [**Architektura systému**](docs/developer/ARCHITECTURE.md) - Technický přehled
- 🔧 [**Instalace a setup**](docs/developer/INSTALLATION.md) - Vývojové prostředí
- 📝 [**API dokumentace**](docs/developer/API.md) - REST API endpointy
- 🧪 [**Testování**](docs/developer/TESTING.md) - Unit testy a E2E testy

### 🤖 **Pro AI agenty**
- 🎯 [**Agent Quick Reference**](docs/agent/QUICK_REFERENCE.md) - Rychlá referenční příručka
- 🎤 [**VoiceBot Integration**](docs/agent/VOICEBOT_INTEGRATION.md) - Integrace hlasového bota
- 🗺️ [**Map Control Guide**](docs/agent/MAP_CONTROL.md) - Ovládání mapy přes agenta

📖 **[Kompletní dokumentace](docs/README.md)** - Centrální hub pro veškerou dokumentaci

## 🚀 Vývoj

### Vývojový režim
```bash
# Automatický restart při změnách
npm run dev

# Testování
npm test

# Linting a formátování
npm run lint
npm run format
```

### 📁 Struktura projektu
```
AIMapa/
├── 📁 public/              # Frontend soubory
│   ├── 📁 app/            # JavaScript moduly
│   │   ├── 🎤 voicebot.js # VoiceBot systém
│   │   ├── 🗺️ script.js   # Hlavní aplikační logika
│   │   └── 🎨 *.css       # Styly komponent
│   └── 📄 index.html      # Hlavní stránka
├── 📁 routes/             # Backend API endpointy
├── 📁 docs/               # Kompletní dokumentace
│   ├── 👤 user/          # Uživatelská dokumentace
│   ├── 👨‍💻 developer/     # Vývojářská dokumentace
│   └── 🤖 agent/         # Dokumentace pro AI agenty
├── ⚙️ server.js           # Hlavní server
└── 📦 package.json       # Konfigurace a závislosti
```

## 🔄 Verze a changelog

**Aktuální verze**: `0.3.8.6` - VoiceBot Edition

### 🎤 **Nové funkce v 0.3.8.6**
- ✅ **VoiceBot systém** - 50+ českých hlasových příkazů
- ✅ **Web Speech API** - Rozpoznávání a syntéza řeči
- ✅ **Hands-free ovládání** - Kompletní ovládání bez myši
- ✅ **AI integrace** - Hlasová komunikace s asistentem
- ✅ **Mobilní optimalizace** - Podpora pro telefony/tablety
- ✅ **Performance boost** - Rychlejší načítání a responzivita
- ✅ **Kompletní dokumentace** - Pro uživatele, vývojáře i agenty

📋 **[Kompletní changelog](CHANGELOG.md)** - Detailní seznam všech změn

## 🤝 Přispívání

Vítáme příspěvky od komunity!

1. **Fork** repozitáře
2. **Vytvořte feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commitněte změny** (`git commit -m 'Add amazing feature'`)
4. **Pushněte branch** (`git push origin feature/amazing-feature`)
5. **Otevřete Pull Request**

📖 [Contributing Guide](docs/developer/CONTRIBUTING.md) - Detailní návod

## 👨‍💻 Autor a tým

**Hlavní vývojář**: Jan Lazorik
**GitHub**: [@l4zorik](https://github.com/l4zorik)
**Projekt**: [AIMapa](https://github.com/l4zorik/AIMapa)

## 📄 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor pro detaily.