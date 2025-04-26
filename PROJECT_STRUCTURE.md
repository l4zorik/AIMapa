# Struktura projektu AIMapa

Tento dokument poskytuje přehled souborů v projektu, jejich účel a stav vývoje.

## Klíčové soubory

| Soubor | Verze | Stav | Popis |
|--------|-------|------|-------|
| index.html | 0.3.7.0 | Stabilní | Hlavní HTML soubor aplikace |
| script.js | 0.3.7.0 | Stabilní | Hlavní JavaScript soubor s logikou aplikace |
| styles.css | 0.3.7.0 | Stabilní | Hlavní CSS soubor s definicí stylů |

## Moduly a komponenty

| Soubor | Verze | Stav | Popis |
|--------|-------|------|-------|
| updates-notification.js | 0.3.7.0 | Stabilní | Modul pro zobrazení novinek a aktualizací |
| updates-notification.css | 0.3.7.0 | Stabilní | Styly pro modul novinek |
| user-progress.js | 0.3.7.0 | Stabilní | Modul pro sledování postupu uživatele (XP, úrovně) |
| user-progress.css | 0.3.7.0 | Stabilní | Styly pro modul postupu uživatele |
| achievements.js | 0.3.7.0 | Stabilní | Modul pro správu a zobrazení achievementů |
| achievements.css | 0.3.7.0 | Stabilní | Styly pro modul achievementů |
| virtual-work.js | 0.3.7.0 | Stabilní | Modul pro virtuální práci |
| virtual-work.css | 0.3.7.0 | Stabilní | Styly pro modul virtuální práce |
| reward-system.js | 0.3.7.0 | Stabilní | Modul pro odměňovací systém |
| reward-system.css | 0.3.7.0 | Stabilní | Styly pro odměňovací systém |
| task-system.js | 0.3.7.0 | Stabilní | Modul pro systém úkolů a denních questů |
| task-system.css | 0.3.7.0 | Stabilní | Styly pro systém úkolů |
| user-progress-extensions.js | 0.2.8.7.3 | Stabilní | Rozšíření modulu postupu uživatele |
| globe-simple.js | 0.2.8.7.3 | Stabilní | Implementace jednoduchého 3D glóbusu |
| transport-connections.js | 0.2.8.7.3 | Stabilní | Modul pro vyhledávání spojení veřejnou dopravou |
| route-utils.css | 0.2.8.7.3 | Stabilní | Styly pro nástroje tras |
| feedback-survey.js | 0.2.8.7.4 | Nový | Modul pro zpětnou vazbu a dotazník o používání aplikace |
| feedback-survey.css | 0.2.8.7.4 | Nový | Styly pro modul zpětné vazby |

## Dokumentace

| Soubor | Poslední aktualizace | Popis |
|--------|---------------------|-------|
| CHANGELOG.md | 0.2.8.7.4 | Historie změn v projektu |
| PROJECT_STRUCTURE.md | 0.2.8.7.4 | Tento dokument - přehled struktury projektu |

## Vývojový stav modulů

### Stabilní moduly (plně funkční)
- Základní mapové funkce (script.js)
- Notifikace o aktualizacích (updates-notification.js)
- Sledování postupu uživatele (user-progress.js)
- Glóbus režim (globe-simple.js)
- Vyhledávání spojení (transport-connections.js)
- Achievementy (achievements.js)
- Virtuální práce (virtual-work.js)
- Odměňovací systém (reward-system.js)
- Systém úkolů a denních questů (task-system.js)
- Služby bydlení (housing-services.js)
- Služby jídla (food-services.js)
- Lékařské služby (medical-services.js)
- Dopravní služby (transport-services.js)
- Načítání reálných dat podniků (business-data-loader.js)

### Plánované moduly (pro verzi 0.4.0)
- Offline režim
- Synchronizace dat s cloudem
- Uživatelské účty a přihlašování
- Pokročilé statistiky tras
- Rozšířené možnosti sdílení

## Poznámky k vývoji

1. **Priorita oprav pro plný release:**
   - Optimalizace výkonu při načítání aplikace
   - Vylepšení správy paměti a výkonu při dlouhodobém používání
   - Testování kompatibility s různými prohlížeči
   - Oprava zpracování příkazů v menu příkazů

2. **Priorita nových funkcí pro verzi 0.4.0:**
   - Implementace databáze MongoDB pro ukládání dat
   - Přidání uživatelských účtů a přihlašování
   - Implementace cloudové synchronizace dat
   - Rozšíření gamifikačních prvků
   - Implementace offline režimu

## Závislosti

### Externí knihovny
- Leaflet.js - mapový engine
- Leaflet Routing Machine - směrování tras
- OSM Buildings - zobrazení 3D budov
- Three.js - 3D vizualizace
- Globe.gl - vizualizace glóbusu
- Cesium - 3D glóbus (ponecháno pro zpětnou kompatibilitu)

### API
- OpenStreetMap - mapové podklady
- OSRM - směrování tras
- OpenRouteService - alternativní směrování tras
