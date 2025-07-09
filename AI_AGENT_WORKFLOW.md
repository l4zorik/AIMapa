# 🤖 AI Agent Workflow Guide

## 🎯 Kdy použít jaký přístup

### 1. **Direct Push** (Nejrychlejší)
**Použijte pro:**
- Dokumentace updates
- Malé opravy bugů
- CSS/styling změny
- README aktualizace

```bash
git checkout main
git pull origin main
git add .
git commit -m "docs: update VoiceBot commands"
git push origin main
```

### 2. **Auto-merge PR** (Doporučené)
**Použijte pro:**
- Nové funkce do existujících modulů
- Refaktoring kódu
- Přidání testů

```bash
git checkout -b docs/voicebot-improvements
git add .
git commit -m "[auto-merge] feat: improve VoiceBot recognition"
git push origin docs/voicebot-improvements
# GitHub automaticky mergne během 2-3 minut
```

### 3. **Manuální PR** (Pro velké změny)
**Použijte pro:**
- Nové moduly/komponenty
- Breaking changes
- Architektonické změny

```bash
git checkout -b feature/new-ai-module
git add .
git commit -m "feat: add new AI conversation module"
git push origin feature/new-ai-module
# Vytvořte PR manuálně na GitHubu
```

## 🔄 Koordinace mezi agenty

### **Branch naming convention:**
- `docs/` - Dokumentace (auto-merge)
- `fix/` - Opravy bugů (auto-merge)
- `feat/` - Nové funkce (manuální review)
- `refactor/` - Refaktoring (manuální review)

### **Commit message prefixes:**
- `[auto-merge]` - Automatické mergování
- `docs:` - Dokumentace
- `fix:` - Oprava
- `feat:` - Nová funkce
- `refactor:` - Refaktoring

## ⚡ Rychlé příkazy

### Aktualizace dokumentace:
```bash
git checkout main && git pull origin main
# ... změny ...
git add . && git commit -m "docs: update" && git push origin main
```

### Nová funkce s auto-merge:
```bash
git checkout -b feat/quick-feature
# ... změny ...
git add . && git commit -m "[auto-merge] feat: add feature" && git push origin feat/quick-feature
```

### Kontrola stavu:
```bash
git status
git log --oneline -5
git fetch --all
```

## 🛡️ Konflikt prevention

1. **Vždy pull před prací**: `git pull origin main`
2. **Krátké session**: Max 30 minut práce na jednom úkolu
3. **Malé commity**: Max 50 řádků změn
4. **Komunikace**: Použijte GitHub Issues pro koordinaci

## 📊 Monitoring

- **GitHub Actions** automaticky testují každý PR
- **Auto-merge** funguje pouze pro bezpečné změny
- **Slack/Discord notifikace** o všech merge operacích

---
**Aktualizováno**: 2025-01-09 | **Pro AI agenty pracující na AIMapa**
