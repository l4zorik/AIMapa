# Struktura projektu AIMapa

Tento dokument poskytuje přehled souborů v projektu, jejich účel a stav vývoje.

## Klíčové soubory

| Soubor | Verze | Stav | Popis |
|--------|-------|------|-------|
| index.html | 0.2.8.7.4 | Stabilní | Hlavní HTML soubor aplikace |
| script.js | 0.2.8.7.4 | Stabilní | Hlavní JavaScript soubor s logikou aplikace |
| styles.css | 0.2.8.7.4 | Stabilní | Hlavní CSS soubor s definicí stylů |

## Moduly a komponenty

| Soubor | Verze | Stav | Popis |
|--------|-------|------|-------|
| ~~commands-menu.js~~ | 0.2.8.7.4 | Odstraněno | Modul pro menu příkazů vedle chatu - odstraněno v 0.2.8.7.5 |
| ~~commands-menu.css~~ | 0.2.8.7.3 | Odstraněno | Styly pro menu příkazů - odstraněno v 0.2.8.7.5 |
| ~~commands-menu-extensions.css~~ | 0.2.8.7.3 | Odstraněno | Rozšířené styly pro menu příkazů - odstraněno v 0.2.8.7.5 |
| updates-notification.js | 0.2.8.7.4 | Stabilní | Modul pro zobrazení novinek a aktualizací |
| updates-notification.css | 0.2.8.7.4 | Stabilní | Styly pro modul novinek |
| user-progress.js | 0.2.8.7.3 | Stabilní | Modul pro sledování postupu uživatele (XP, úrovně) |
| user-progress.css | 0.2.8.7.3 | Stabilní | Styly pro modul postupu uživatele |
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

### Odstraněné moduly
- Menu příkazů (commands-menu.js) - odstraněno v 0.2.8.7.5

### Nové moduly (ve vývoji)
- Dotazník zpětné vazby (feedback-survey.js) - přidáno ve verzi 0.2.8.7.4

### Plánované moduly (dosud neimplementované)
- Offline režim
- Synchronizace dat s cloudem
- Pokročilé statistiky tras
- Rozšířené možnosti sdílení

## Poznámky k vývoji

1. **Priorita oprav:**
   - ~~Opravy menu příkazů ve fullscreen režimu (dokončeno v 0.2.8.7.4)~~ - Menu příkazů odstraněno v 0.2.8.7.5
   - Optimalizace výkonu při zobrazení 3D budov
   - Vylepšení UX při plánování tras

2. **Priorita nových funkcí:**
   - Dotazník zpětné vazby (implementováno v 0.2.8.7.4)
   - Rozšíření gamifikačních prvků
   - Integrace s dalšími mapovými službami

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
