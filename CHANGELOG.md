
# Changelog

Všechny významné změny v projektu AIMapa budou dokumentovány v tomto souboru.

## [0.3.8.4] - 2025-07-15 - OPRAVA CONTENT SECURITY POLICY A POVINNÉ PŘIHLAŠOVÁNÍ

### Opravy
- Opraveny problémy s Content Security Policy (CSP) na Netlify
- Přidány chybějící domény do CSP pro načítání externích skriptů a stylů
- Opraveno načítání knihoven z cdn.jsdelivr.net a cesium.com
- Vyřešeny chyby při načítání Three.js a jeho komponent
- Opraveno načítání Cesium.js a jeho stylů
- Odstraněny chyby v konzoli prohlížeče

### Nové funkce
- Implementováno povinné přihlašování pro přístup k aplikaci
- Přidána registrace nových uživatelů s ověřením emailu
- Implementováno odhlašování uživatelů
- Přidána ochrana proti neoprávněnému přístupu k funkcím aplikace
- Vylepšena integrace s Supabase pro správu uživatelských účtů

### Vylepšení
- Optimalizováno načítání externích knihoven
- Přidána podpora pro lokální kopie knihoven pro lepší výkon
- Vylepšena stabilita aplikace při načítání
- Aktualizovány verze ve všech souborech pro konzistenci
- Příprava pro monetizaci aplikace

### Poznámky
- Tato verze je zaměřena na stabilitu a bezpečnost aplikace
- Všechny kritické funkce byly otestovány a fungují správně
- Aplikace je nyní připravena pro monetizaci

## [0.3.8.3] - 2025-07-10 - OPRAVA GLÓBUS REŽIMU A INTEGRACE SUPABASE

### Opravy
- Opraveno přepínání do glóbus režimu, který se nyní správně zobrazuje
- Vylepšena detekce a načítání Globe.gl knihovny
- Přidána podpora pro různé varianty exportu Globe.gl knihovny
- Opraveno zobrazení glóbusu po přepnutí režimu

### Vylepšení
- Dokončena integrace s Supabase pro ukládání dat
- Přidána podpora pro PostgreSQL připojení
- Vylepšena stabilita aplikace při přepínání mezi režimy zobrazení
- Optimalizováno načítání externích knihoven
- Aktualizovány verze ve všech souborech pro konzistenci

### Poznámky
- Tato verze opravuje problém s glóbus režimem, který byl v předchozí verzi
- Všechny kritické funkce byly otestovány a fungují správně

## [0.3.8.2] - 2025-07-08 - OPRAVA INICIALIZACE LEAFLET.JS A PŘÍPRAVA PRO NASAZENÍ

### Opravy
- Opravena inicializace Leaflet.js pro spolehlivé načítání mapy
- Vyřešen problém s chybějícím souborem leaflet_js.js
- Vylepšeno pořadí načítání skriptů pro zajištění správné funkčnosti
- Přidána robustnější detekce a ošetření chyb při inicializaci mapy
- Optimalizováno načítání externích knihoven

### Vylepšení
- Aktualizovány verze ve všech souborech pro konzistenci
- Vylepšena stabilita aplikace pro nasazení na Netlify
- Příprava pro integraci s Supabase

### Poznámky
- Tato verze je určena pro produkční nasazení
- Všechny kritické funkce byly otestovány a fungují správně

## [0.3.8.1] - 2025-07-06 - STABILNÍ VERZE S FUNKČNÍ MAPOU A NODE.JS SERVEREM

### Stabilní funkce
- Plně funkční mapa s Leaflet.js a správnou inicializací
- Spolehlivý Node.js server pro poskytování aplikace
- Funkční systém uživatelských účtů s lokálním přihlašováním
- Stabilní implementace virtuální práce a odměňovacího systému
- Optimalizace pro mobilní zařízení a různé prohlížeče

### Poznámky
- Tato verze je označena jako stabilní a doporučená pro produkční nasazení
- Všechny kritické funkce byly důkladně otestovány a fungují správně
- Verze je připravena pro integraci s Supabase a nasazení na Netlify

## [0.3.8.0] - 2025-07-05 - VYLEPŠENÍ SYSTÉMU XP A DETEKCE NEČINNOSTI

### Nové funkce
- Rozšíření systému XP o nové kategorie a způsoby získávání XP
- Implementace detekce nečinnosti uživatele (5 sekund)
- Přidání nabídky práce při nečinnosti uživatele
- Propojení nabídky práce s dialogem nedokončených prací
- Vylepšení zobrazení stavu financí s kryptoměnami
- Přidání nových kryptoměn do finančního přehledu (ETH, DOGE, XRP)
- Automatické ukládání nedokončené práce při zavření dialogu křížkem nebo tlačítkem "Zrušit"
- Zachování pozice scrollování v menu virtuální práce i po obnovení stránky

### Vylepšení
- Implementace automatické aktualizace kurzů kryptoměn
- Přidání nových achievementů za práci s kryptoměnami
- Vylepšení vizuálního zobrazení XP a úrovní
- Optimalizace výkonu při získávání XP
- Přidání nových kategorií XP pro detailnější statistiky
- Vylepšení vzhledu nedokončených prací pro lepší čitelnost v tmavém režimu
- Přidání detailního zobrazení historie práce včetně seznamu úkolů a jejich stavu

### Opravy
- Opraveno zobrazení stavu financí na mobilních zařízeních
- Vylepšena kompatibilita s různými prohlížeči
- Opraveny drobné chyby v systému XP
- Opravena viditelnost bílých prvků v dialogu nedokončených prací

## [1.0.0] - 2025-07-01 - PRVNÍ OFICIÁLNÍ RELEASE

### Hlavní funkce
- První oficiální stabilní verze aplikace
- Kompletní implementace všech plánovaných funkcí pro verzi 1.0
- Optimalizace výkonu a stability pro produkční nasazení
- Plná podpora pro všechny moderní prohlížeče
- Optimalizace pro mobilní zařízení

### Vylepšení
- Vylepšena celková stabilita aplikace
- Optimalizováno načítání aplikace pro rychlejší start
- Vylepšena správa paměti a výkon při dlouhodobém používání
- Sjednocen design všech dialogů a oken
- Vylepšen responzivní design pro různé velikosti obrazovky
- Aktualizována dokumentace s aktuálními informacemi

### Opravy
- Opraveno zpracování příkazů v menu příkazů
- Opraveny konflikty mezi moduly při zpracování příkazů
- Opraveny chyby v zobrazení na mobilních zařízeních
- Opraveny problémy s kompatibilitou v různých prohlížečích
- Vyřešeny všechny známé chyby z předchozích verzí

## [0.3.7.0] - 2025-06-30 - PŘÍPRAVA NA OSTRÝ RELEASE A PŘIDÁNÍ ACHIEVEMENTŮ

### Nové funkce
- Přidán nový modul pro správu a zobrazení achievementů
- Implementováno 10 základních achievementů v různých kategoriích
- Přidáno zobrazení notifikací o dokončení achievementů
- Implementováno filtrování achievementů podle kategorií
- Přidáno získávání odměn za dokončení achievementů (XP, peníze, quest body)
- Přidána položka "Achievementy" do menu příkazů v kategorii "Služby"

### Vylepšení
- Zahájení přípravy aplikace na ostrý release
- Vylepšení stability a výkonu aplikace
- Optimalizace pro mobilní zařízení
- Testování kompatibility s různými prohlížeči
- Aktualizace verzí ve všech souborech
- Aktualizace dokumentace projektu

### Opravy
- Opraveno zpracování příkazů v menu příkazů
- Opraveny konflikty mezi moduly při zpracování příkazů
- Vylepšena správa paměti a výkon

## [0.3.6.5] - 2025-06-30 - PŘIDÁNÍ SLUŽBY BYDLENÍ

### Nové funkce
- Přidán nový modul pro služby bydlení s nabídkami pronájmů, prodejů a spolubydlení
- Implementovány tři kategorie: Pronájem, Prodej a Spolubydlení
- Přidáno vyhledávání nemovitostí podle názvu, adresy a popisu
- Implementována možnost kontaktování ohledně nemovitosti a přidání do oblíbených
- Přidáno získávání XP za používání služeb bydlení
- Implementována podpora tmavého režimu pro nové prvky

## [0.3.6.4] - 2025-06-29 - PŘIDÁNÍ THC-X DO ODMĚŇOVACÍHO SYSTÉMU

### Nové funkce
- Přidána nová kategorie THC-X marihuana do odměňovacího systému
- Implementovány čtyři varianty THC-X: Light, Medium, Strong a Premium
- Přidáno získávání 60 XP za THC-X odměny
- Implementováno ukládání historie THC-X odměn do localStorage

## [0.3.6.3] - 2025-06-28 - POJMENOVÁNÍ PROJEKTU PŘES CHAT

### Nové funkce
- Implementována možnost pojmenovat projekt přes chatové rozhraní
- Přidána interakce s AI asistentem pro zadání názvu projektu
- Přidáno potvrzení o úspěšném pojmenování projektu v chatu

## [0.3.6.2] - 2025-06-27 - SPRÁVA PROJEKTŮ VE VIRTUÁLNÍ PRÁCI

### Nové funkce
- Přidáno tlačítko "Pojmenovat projekt" vedle tlačítka "Analyzovat problém"
- Implementována možnost pojmenovat projekt a ukládat informace o něm
- Přidáno tlačítko s názvem projektu, které zobrazí detailní informace
- Implementováno zobrazení statistik projektu (celkem úkolů, dokončeno, procenta)
- Přidán přehledný seznam úkolů v informacích o projektu
- Implementováno ukládání a načítání informací o projektu z localStorage

## [0.3.6.1] - 2025-06-26 - VYLEPŠENÍ VIRTUÁLNÍ PRÁCE A ANALÝZA PROBLÉMŮ

### Nové funkce
- Přidána možnost analyzovat problém ve virtuální práci a uložit úkoly jako šablonu
- Implementováno automatické načítání uložených úkolů při spuštění virtuální práce
- Přidáno tlačítko "Analyzovat problém" přímo do pracovního okna
- Implementován drag and drop pro přesouvání úkolů v pracovním okně
- Přidána funkce pro kontrolu, zda na úkolu "AI Mapa" již nepracujeme
- Přidána možnost specifikovat, co je to za konkrétní úkol a proč je důležitý

## [0.3.6.0] - 2025-06-25 - NAČÍTÁNÍ REÁLNÝCH DAT PODNIKŮ Z INTERNETU A EPICKÁ REORGANIZACE SOUBORŮ

### Nové funkce
- Přidán nový modul pro načítání reálných dat podniků z internetu
- Implementováno rozhraní pro výběr oblasti a parametrů načítání
- Přidána podpora pro OpenStreetMap API pro získání aktuálních dat
- Implementováno mapování typů podniků z OSM na vlastní kategorie
- Přidáno zobrazení správných ikon podle typu podniku
- Implementováno získávání XP za načtení dat podniků

### Vylepšení
- Vylepšen systém zobrazování podniků na mapě s přesnějšími ikonami
- Přidána možnost aktualizovat data podniků pro libovolnou oblast
- Implementována podpora tmavého režimu pro nové prvky
- Optimalizováno zobrazení podniků pro lepší přehlednost
- Přidána nová položka do menu příkazů pro načítání dat podniků

### Epická reorganizace souborů
- Kompletně přepracována struktura souborů pro maximální přehlednost
- Všechny soubory aplikace přesunuty do jediného adresáře public/app
- Vyčištěn kořenový adresář projektu od přebytečných souborů
- Aktualizovány všechny odkazy v HTML souborech na nová umístění
- Zjednodušena struktura projektu pro snadnější orientaci a údržbu

### Nové skryté funkce
- Přidána možnost otevřít menu příkazů trojitým kliknutím mimo mapu
- Implementován handler pro detekci trojitého kliknutí s časovým limitem 1 sekundy
- Přidána možnost přesouvat menu příkazů pomocí drag and drop
- Implementováno ukládání pozice menu příkazů mezi relacemi
- Přidáno tlačítko pro reportování bugů v pravém dolním rohu
- Implementován systém pro ukládání seznamu bugů do localStorage

## [0.3.5.7] - 2025-06-21 - VYLEPŠENÍ PROPOJENÍ VIRTUÁLNÍ PRÁCE S ODMĚŇOVACÍM SYSTÉMEM

### Nové funkce
- Přímé propojení dialogu výběru odměny s odměňovacím systémem
- Po kliknutí na "Potvrdit výběr" se automaticky otevře odměňovací systém
- Možnost vybrat si další odměnu (např. kávu) po dokončení práce

### Vylepšení
- Zjednodušený proces získávání odměn za práci
- Plynulejší přechod mezi virtuální prací a odměňovacím systémem
- Vylepšené zprávy při dokončení práce a výběru odměny

## [0.3.5.6] - 2025-06-21 - PROPOJENÍ VIRTUÁLNÍ PRÁCE S ODMĚŇOVACÍM SYSTÉMEM

### Nové funkce
- Propojení virtuální práce s odměňovacím systémem
- Po dokončení práce se automaticky otevře odměňovací systém
- Zobrazení získané odměny z práce v odměňovacím systému
- Možnost vybrat si další odměnu po dokončení práce

### Vylepšení
- Vylepšeno uživatelské rozhraní odměňovacího systému pro zobrazení odměn z práce
- Přidány informace o bonusech za dokončené úkoly
- Přidány informace o úspoře času pro příští práci
- Vylepšeny zprávy při dokončení práce

## [0.3.5.5] - 2025-06-21 - OPRAVA TLAČÍTKA "DOKONČIT PRÁCI A ZÍSKAT ODMĚNU"

### Opravy
- Opravena funkčnost tlačítka "Dokončit práci a získat odměnu" ve virtuální práci
- Přidáno potvrzení při dokončení práce s nedokončenými úkoly
- Vylepšena kontrola dokončení úkolů před ukončením práce

## [0.3.5.4] - 2025-06-21 - PŘIDÁNÍ KATEGORIE SPÁNEK DO ODMĚŇOVACÍHO SYSTÉMU

### Nové funkce
- Přidána nová kategorie "Spánek" do odměňovacího systému
- Přidáno 5 nových typů odměn v kategorii spánek (krátký spánek, dřívější spánek, přispání, víkendový spánek, meditace před spaním)
- Implementováno ukládání historie získaných odměn spánku do localStorage
- Za odměny typu spánek uživatel získává 40 XP (více než běžné odměny, protože je to zdravé)

### Vylepšení
- Vylepšeno filtrování odměn podle kategorií, přidána kategorie "Spánek"
- Vylepšeno formátování hodnot odměn pro kategorii spánek
- Přidáno zobrazení získaných XP u odměn typu spánek

## [0.3.5.3] - 2025-06-21 - DALŠÍ ROZŠÍŘENÍ ODMĚŇOVACÍHO SYSTÉMU

### Nové funkce
- Přidány dvě nové kategorie do odměňovacího systému: "Sladkosti" a "Posilovna"
- Přidáno 5 nových typů odměn v kategorii sladkosti (čokoláda, zmrzlina, sušenky, bonbóny, donut)
- Přidáno 5 nových typů odměn v kategorii posilovna (návštěva posilovny, běh, plavání, cyklistika, jóga)
- Implementováno ukládání historie získaných odměn sladkostí a posilovny do localStorage
- Za odměny typu sladkosti uživatel získává 15 XP
- Za odměny typu posilovna uživatel získává 50 XP (více než ostatní kategorie, protože je to zdravé)

### Vylepšení
- Vylepšeno filtrování odměn podle kategorií, přidány kategorie "Sladkosti" a "Posilovna"
- Vylepšeno formátování hodnot odměn pro kategorie sladkosti a posilovna
- Přidáno zobrazení získaných XP u odměn typu sladkosti a posilovna

## [0.3.5.2] - 2025-06-21 - ROZŠÍŘENÍ ODMĚŇOVACÍHO SYSTÉMU O JÍDLO A PITÍ

### Nové funkce
- Přidána nová kategorie "Jídlo a pití" do odměňovacího systému
- Přidáno 6 nových typů odměn v kategorii jídlo a pití (káva, dort, pizza, pivo, víno, večeře)
- Implementováno ukládání historie získaných odměn jídla a pití do localStorage
- Za odměny typu jídlo a pití uživatel získává 25 XP

### Vylepšení
- Vylepšeno filtrování odměn podle kategorií, přidána kategorie "Jídlo a pití"
- Vylepšeno formátování hodnot odměn pro kategorii jídlo a pití
- Přidáno zobrazení získaných XP u odměn typu jídlo a pití

## [0.3.5.1] - 2025-06-21 - SAMOSTATNÝ ODMĚŇOVACÍ SYSTÉM

### Nové funkce
- Implementován samostatný odměňovací systém nezávislý na virtuální práci
- Přidáno 8 různých typů odměn (peníze, XP, úspora času, bitcoin)
- Přidána možnost filtrování odměn podle kategorií
- Vylepšeno uživatelské rozhraní odměňovacího systému

### Vylepšení
- Odměňovací systém je nyní dostupný přímo z menu příkazů bez nutnosti procházet virtuální prací
- Přidány vizuální efekty a animace pro lepší uživatelský zážitek
- Vylepšena podpora tmavého režimu pro odměňovací systém
- Aktualizovány zprávy při otevření odměňovacího systému

### Opravy
- Opraveno zobrazování položky "Systém odměn" v menu příkazů
- Vylepšena kompatibilita s ostatními moduly aplikace

## [0.3.5.0] - 2025-06-20 - FUNKČNÍ SYSTÉM VIRTUÁLNÍ PRÁCE A ODMĚŇOVACÍ SYSTÉM

### Nové funkce
- Plně funkční systém virtuální práce s možností definování vlastních úkolů
- Implementován odměňovací systém s možností výběru typu odměny (peníze, XP, úspora času)
- Přidána položka "Systém odměn" do menu příkazů v kategorii Zábava
- Přidány vizuální efekty pro výběr odměny a zobrazení výsledku

### Vylepšení
- Optimalizován proces dokončení práce a získání odměny
- Vylepšen design odměňovacího systému s animacemi a vizuálními efekty
- Přidána podpora tmavého režimu pro odměňovací systém
- Vylepšeno zobrazení položky "Systém odměn" v menu příkazů

### Opravy
- Opraveno zobrazování položky "Systém odměn" v menu příkazů
- Opraveno tlačítko "Zpět na výběr práce" v dialogu nedokončené práce
- Opraveno tlačítko "Zpět na výběr práce" v pracovním dialogu

## [0.3.4.2] - 2025-06-18 - PŘÍMÁ OPRAVA MENU PŘÍKAZŮ

### Nové funkce
- Přidán nový soubor fix-menu.js pro přímou opravu menu příkazů
- Implementováno přímé odstranění položky "Rap" z DOM struktury menu
- Přidáno tlačítko pro ruční opravu menu v pravém dolním rohu obrazovky

### Opravy
- Vyřešen problém s nezobrazováním položky "Systém odměn" v menu příkazů
- Implementováno spolehlivější řešení pro odstranění položky "Rap" z menu
- Přidána automatická oprava menu při kliknutí na tlačítko menu příkazů

## [0.3.4.1] - 2025-06-17 - ÚPRAVA MENU PŘÍKAZŮ

### Změny
- Odstraněna položka "Rap" z menu příkazů v kategorii Zábava
- Ponechána pouze položka "Systém odměn" v kategorii Zábava
- Odstraněno zpracování příkazu "rap" z kódu

## [0.3.4.0] - 2025-06-16 - ODMĚŇOVACÍ SYSTÉM

### Nové funkce
- Implementován odměňovací systém s možností výběru typu odměny (peníze, XP, úspora času)
- Přidána položka "Systém odměn" do menu příkazů v kategorii Zábava
- Přidány vizuální efekty pro výběr odměny a zobrazení výsledku

### Vylepšení
- Vyčištěn kód od zbytečných souborů pro opravu menu
- Optimalizován proces dokončení práce a získání odměny
- Vylepšen design odměňovacího systému s animacemi a vizuálními efekty
- Přidána podpora tmavého režimu pro odměňovací systém

### Opravy
- Opraveno zobrazování položky "Systém odměn" v menu příkazů
- Opraveno tlačítko "Zpět na výběr práce" v dialogu nedokončené práce
- Opraveno tlačítko "Zpět na výběr práce" v pracovním dialogu

## [0.3.3.6] - 2025-06-14 - PŘIDÁNÍ SAMOSTATNÉHO MODULU PRO OPRAVU MENU

### Nové funkce
- Přidán nový soubor menu-fix.js pro opravu menu příkazů
- Implementována automatická oprava menu po načtení stránky
- Přidán příkaz "opravit menu" pro ruční opravu menu

### Opravy
- Vyřešen problém s nezobrazováním položky "Systém odměn" v menu příkazů
- Implementováno spolehlivější řešení pro přidání položky do kategorie Zábava
- Přidáno automatické otevření kategorie Zábava při opravě menu

## [0.3.3.5] - 2025-06-13 - PŘIDÁNÍ FUNKCE OBNOVENÍ MENU

### Nové funkce
- Přidána funkce pro obnovení menu příkazů
- Přidán příkaz "Obnovit menu" do kategorie Nastavení
- Implementováno automatické otevření kategorie Zábava při obnovení menu

### Opravy
- Opraveno zobrazování položky "Systém odměn" v menu příkazů
- Přidáno automatické obnovení menu při použití příkazu "odměňovací systém"

## [0.3.3.4] - 2025-06-12 - ÚPRAVA SYSTÉMU ODMĚN V MENU PŘÍKAZŮ

### Vylepšení
- Změněn název položky v menu příkazů z "Odměňovací systém" na "Systém odměn"
- Změněna ikona položky z trofeje na kočku (🐱)
- Aktualizovány informativní zprávy při otevření systému odměn
- Přidán symbol kočky do zpráv systému odměn

## [0.3.3.3] - 2025-06-11 - ODMĚŇOVACÍ SYSTÉM V MENU PŘÍKAZŮ

### Nové funkce
- Přidán odměňovací systém do menu příkazů v kategorii zábava
- Implementován příkaz "odměňovací systém" pro rychlý přístup k funkci

### Vylepšení
- Vylepšena integrace odměňovacího systému s ostatními moduly
- Přidány informativní zprávy při otevření odměňovacího systému
- Optimalizováno načítání modulu virtuální práce při použití příkazu

## [0.3.3.2] - 2025-06-10 - ODMĚŇOVACÍ SYSTÉM A OPRAVY

### Nové funkce
- Implementován odměňovací systém s možností výběru typu odměny (peníze, XP, úspora času)
- Přidány vizuální efekty pro výběr odměny a zobrazení výsledku
- Přidána možnost získat různé bonusy podle typu vybrané odměny

### Opravy
- Opraveno tlačítko "Zpět na výběr práce" v dialogu nedokončené práce
- Opraveno tlačítko "Zpět na výběr práce" v pracovním dialogu
- Vylepšeno zobrazení výsledku práce s informací o vybrané odměně

### Vylepšení
- Vylepšen design odměňovacího systému s animacemi a vizuálními efekty
- Přidána podpora tmavého režimu pro odměňovací systém
- Optimalizován proces dokončení práce a získání odměny

## [0.3.3.1] - 2025-06-09 - OPRAVA ZOBRAZENÍ NEDOKONČENÉ PRÁCE

### Opravy
- Opraveno tlačítko "Zobrazit" pro nedokončenou práci, které nyní správně funguje
- Implementováno automatické zobrazení nedokončené práce při otevření dialogu virtuální práce
- Opraveno zobrazení nedokončené práce po návratu z jiných obrazovek
- Vylepšeno ukládání a načítání nedokončené práce

### Vylepšení
- Přidána notifikace o uložení práce s možností rychlého návratu
- Vylepšena podpora tmavého režimu pro notifikace
- Optimalizováno zobrazení seznamu nedokončených prací

## [0.3.3.0] - 2025-06-08 - DRAG AND DROP ÚKOLŮ A UKLÁDÁNÍ NEDOKONČENÉ PRÁCE

### Nové funkce
- Přidána možnost přesouvat úkoly pomocí drag and drop
- Implementováno přidávání nových úkolů během práce
- Přidána možnost uložit nedokončenou práci a vrátit se k ní později
- Přidán banner s informací o nedokončené práci v hlavním menu
- Implementována notifikace o uložené práci

### Vylepšení
- Vylepšen progress bar, který se nyní aktualizuje podle dokončených úkolů
- Přidány vizuální efekty pro přetahování úkolů
- Implementovány vlastní scrollbary pro seznam nedokončených prací
- Vylepšena podpora tmavého režimu pro všechny nové prvky

## [0.3.2.0] - 2025-06-07 - VYLEPŠENÍ DESIGNU DEFINOVÁNÍ ÚKOLŮ

### Nové funkce
- Přidán nový CSS soubor pro definování úkolů s moderním designem
- Implementovány animace pro přidávání nových úkolů
- Přidáno číslování úkolů pro lepší přehlednost
- Implementována změna textu tlačítka "Začít pracovat" podle počtu úkolů

### Vylepšení
- Kompletně přepracován design okna pro definování úkolů
- Vylepšeny styly pro seznam úkolů s animacemi a stíny
- Přidány barevné přechody pro tlačítka a interaktivní prvky
- Implementovány vlastní scrollbary pro lepší uživatelský zážitek
- Vylepšena podpora tmavého režimu pro všechny prvky
- Přidány vizuální efekty pro tlačítka při najetí myší
- Zvětšena velikost písma a tlačítek pro lepší čitelnost

## [0.3.1.0] - 2025-06-06 - PŘEVOD APLIKACE NA NODE.JS A VYLEPŠENÍ VIRTUÁLNÍ PRÁCE

### Nové funkce
- Vytvořena základní struktura Node.js aplikace
- Implementován Express.js server
- Vytvořeny API endpointy pro virtuální práci
- Přesun front-end kódu do adresáře public
- Přidána historie virtuální práce s možností opakování misí
- Implementováno ukládání historie práce na serveru
- Přidáno rozhraní pro zobrazení a výběr předchozích misí
- Kompletně přepracován modul virtuální práce s novým designem a funkcionalitou
- Progress bar se nyní pohybuje POUZE podle dokončených úkolů, nikdy automaticky v čase
- Práce se dokončí pouze po manuálním stisknutí tlačítka "Dokončit práci a získat odměnu"
- Přidáno zvýraznění tlačítka pro dokončení práce s pulzující animací po dokončení všech úkolů
- Přidáno zobrazení úkolů na mapě s možností sledování jejich stavu
- Přidáno výrazné upozornění pro uživatele po dokončení všech úkolů
- Opravena funkce tlačítka "Pracovat znovu" - nyní správně přechází na obrazovku plánování úkolů
- Odstraněno tlačítko "Zrušit práci" pro zjednodušení rozhraní
- Opraveno zobrazení ikonek pracovišť - nyní se zobrazují správně bez přeseknutí
- Prodloužena doba trvání prací pro lepší uživatelský zážitek a více času na dokončení úkolů
- Přidáno sledování celkového času práce - nyní se zobrazuje, jak dlouho práce trvala
- Přidán bonus za dokončené úkoly (až 20% navíc k výdělku a XP)
- Přidáno zobrazení souhrnu dokončených úkolů po skončení práce
- Přidáno tlačítko "Zpět" na obrazovku plánování práce pro návrat k výběru pracoviště

### Vylepšení
- Oddělení klientské a serverové části aplikace
- Příprava na implementaci databáze
- Vylepšená struktura projektu
- Přidána podpora pro environment proměnné
- Vylepšen design historie virtuální práce s podporou tmavého režimu
- Přidána možnost opakovat předchozí mise s jejich úkoly
- Vylepšen design tlačítka pro manuální dokončení práce
- Progress bar nyní zobrazuje procento dokončených úkolů místo automatického postupu v čase
- Vylepšena inicializace progress baru při spuštění práce
- Přidány markery úkolů na mapě s barevným rozlišením dokončených a nedokončených úkolů
- Přidány popup okna s detailními informacemi o úkolech na mapě

## [0.3.0.16] - 2025-06-05 - KOMPLETNÍ PŘEPRACOVÁNÍ MODULU VIRTUÁLNÍ PRÁCE

### Opravy
- Kompletně přepracován modul virtuální práce pro zajištění správného načítání
- Opravena struktura třídy VirtualWorkClass
- Odstraněny syntaktické chyby v kódu
- Přidáno správné exportování modulu
- Opravena funkčnost tlačítka "Dokončit práci a získat odměnu"

### Vylepšení
- Přidána lepší detekce chyb při inicializaci
- Vylepšeno logování pro snadnější diagnostiku problémů
- Přidána podpora pro Node.js (první krok k přechodu na Node.js)

## [0.3.0.15] - 2025-06-04 - OPRAVA CHYBY NAČÍTÁNÍ MODULU VIRTUÁLNÍ PRÁCE

### Opravy
- Opravena syntaktická chyba v souboru virtual-work.js, která způsobovala, že se modul virtuální práce nenačítal
- Odstraněn duplicitní kód pro interval aktualizace progress baru
- Opravena struktura metod v modulu virtuální práce
- Přidán testovací skript pro ověření načítání modulu

## [0.3.0.14] - 2025-06-03 - PŘIDÁNÍ VLASTNÍCH ÚKOLŮ DO VIRTUÁLNÍ PRÁCE

### Nové funkce
- Přidána možnost definovat vlastní úkoly před začátkem práce
- Implementován systém pro manuální označení úkolů jako dokončené během práce
- Přidán bonus za dokončené úkoly (až 20% navíc k výdělku a XP)
- Implementována notifikace o dokončení všech úkolů
- Přidáno zobrazení souhrnu dokončených úkolů po skončení práce

### Vylepšení uživatelského rozhraní
- Přidán formulář pro zadávání vlastních úkolů s možností přidání a odstranění
- Implementován checklist úkolů s vizuálním označením dokončených úkolů
- Přidány animace a vizuální efekty pro lepší uživatelský zážitek
- Implementována podpora tmavého režimu pro všechny nové prvky
- Vylepšeno zobrazení výsledku práce s informacemi o dokončených úkolech

## [0.3.0.13] - 2025-06-02 - PŘIDÁNÍ TLAČÍTKA PRO MANUÁLNÍ DOKONČENÍ ÚKOLU

### Nové funkce
- Přidáno tlačítko "Dokončit úkol manuálně" pro okamžité dokončení práce
- Implementováno okamžité získání odměny a XP po manuálním dokončení
- Přidáno rozlišení mezi automaticky a manuálně dokončenými úkoly v historii
- Implementována animace pro zvýraznění tlačítka manuálního dokončení

### Vylepšení uživatelského rozhraní
- Přidáno výrazné červené tlačítko pro manuální dokončení s pulzujícím efektem
- Upraveno zobrazení výsledku po manuálním dokončení s odpovídající zprávou
- Implementována podpora tmavého režimu pro nové tlačítko
- Vylepšeny animace a přechody pro plynulejší uživatelský zážitek

## [0.3.0.12] - 2025-06-01 - KOMPLETNÍ REDESIGN OKNA VIRTUÁLNÍ PRÁCE

### Nový design
- Kompletně přepracován design okna virtuální práce s moderním vzhledem
- Přidány animace, přechody a vizuální efekty pro lepší uživatelský zážitek
- Implementován responzivní design s lepším využitím prostoru
- Přidána podpora tmavého režimu pro všechny nové prvky

### Nové funkce
- Přidáno více typů pracovišť (6 různých kategorií) s různými odměnami a obtížností
- Implementováno filtrování pracovišť podle kategorií
- Přidána historie práce s ukládáním do localStorage
- Implementovány statistiky práce (celkový výdělek, počet směn, získané XP)
- Přidán interaktivní progress bar s animací průběhu práce
- Implementován log aktivit během práce podle typu zaměstnání
- Přidáno získávání XP za práci s různými hodnotami podle obtížnosti

### Vylepšení uživatelského rozhraní
- Přidány detailní informace o pracovištích včetně popisu, obtížnosti a doby trvání
- Implementovány kategorie pracovišť s možností filtrování
- Přidány statistiky práce s přehledným zobrazením
- Vylepšeno zobrazení výsledku práce s animacemi a detailními informacemi
- Implementován systém pro zobrazení aktivit během práce

## [0.3.0.11] - 2025-05-31 - VYLEPŠENÍ DETEKCE EXISTUJÍCÍCH CEST A PŘIDÁNÍ TLAČÍTKA PRO VÝPOČET TRASY

### Nové funkce
- Přidáno tlačítko pro výpočet trasy přímo v dialogu sledování bodů
- Implementována automatická aktualizace detekce cest po výpočtu trasy
- Přidán event listener pro zachycení události výpočtu trasy
- Implementována podpora pro vytvoření cesty z existujících markerů

### Vylepšení detekce cest
- Kompletně přepracována detekce existujících cest na mapě
- Přidána podpora pro detekci jakékoliv cesty na mapě (nejen červené přerušované)
- Vylepšena detekce markerů a vytvoření cesty z nich
- Implementována robustnější kontrola existence cesty

### Vylepšení uživatelského rozhraní
- Přidány nové CSS styly pro tlačítko výpočtu trasy
- Vylepšeno zobrazení informací o detekované cestě
- Přidány informativní zprávy o výpočtu trasy a importu cesty
- Implementována lepší vizuální hierarchie prvků v dialogu

## [0.3.0.10] - 2025-05-30 - OPRAVA DETEKCE EXISTUJÍCÍCH CEST V DIALOGU SLEDOVÁNÍ BODŮ

### Opravy
- Opravena detekce existujících cest na mapě v dialogu sledování bodů
- Vylepšena detekce červené přerušované čáry na mapě
- Přidána podpora pro detekci globální proměnné route
- Implementováno lepší zobrazení detekované cesty s informacemi o typu a barvě

### Vylepšení uživatelského rozhraní
- Přidány nové CSS styly pro lepší zobrazení existující cesty
- Vylepšeno zobrazení tlačítka pro import existující cesty
- Přidána animace pro zvýraznění detekované cesty
- Implementována podpora tmavého režimu pro nové prvky

## [0.3.0.9] - 2025-05-29 - ZOBRAZENÍ EXISTUJÍCÍCH CEST V DIALOGU SLEDOVÁNÍ BODŮ

### Nové funkce
- Přidána detekce existujících cest na mapě a jejich zobrazení v dialogu sledování bodů
- Implementována možnost importu existující cesty do systému sledování bodů
- Přidáno zobrazení statistik existující cesty (počet bodů, vzdálenost)
- Implementována funkce pro výpočet vzdálenosti mezi body cesty

### Vylepšení uživatelského rozhraní
- Přidána nová sekce "Aktuální cesta na mapě" v dialogu sledování bodů
- Vylepšeno zobrazení existujících cest s detailními informacemi
- Přidáno tlačítko pro import existující cesty do systému sledování bodů
- Implementována podpora tmavého režimu pro nové prvky

## [0.3.0.8] - 2025-05-28 - VYLEPŠENÝ SYSTÉM FIREM NA MAPĚ A FINANČNÍHO INDIKÁTORU

### Nové funkce
- Přidán systém zobrazení firem a podniků na mapě s detailními informacemi
- Implementováno 8 typů firem (obchody, restaurace, banky, kanceláře, továrny, čerpací stanice, hotely, nemocnice)
- Přidán filtr pro zobrazení/skrytí různých typů firem na mapě
- Vylepšen finanční indikátor s animovanou ikonou dolaru a detailními informacemi
- Přidán rozšířený finanční panel s přehledem všech financí a kryptoměn
- Implementována správa příkazů s možností přidávání, úpravy a deaktivace příkazů
- Přidána možnost vylepšení příkazů pomocí AI

### Vylepšení uživatelského rozhraní
- Vytvořeny moderní a interaktivní markery firem na mapě s barevným rozlišením podle typu
- Přidány detailní popup okna s informacemi o firmách, službách a hodnocení
- Implementován responzivní design pro všechny nové prvky s podporou mobilních zařízení
- Vylepšen design finančního indikátoru s animacemi při přidání/odebrání peněz
- Přidána podpora tmavého režimu pro všechny nové prvky
- Vytvořeno intuitivní rozhraní pro správu příkazů s možností vyhledávání

## [0.3.0.7] - 2025-05-27 - VYLEPŠENÍ ÚKOLŮ S DETAILNÍMI POPISY A SOUŘADNICEMI

### Nové funkce
- Přidána možnost zobrazení všech kroků úkolu na mapě najednou s vyznačenou cestou
- Implementováno zobrazení přesných souřadnic pro každý bod úkolu
- Přidána funkce pro kopírování souřadnic do schránky
- Implementováno číslování bodů podle pořadí na mapě pro lepší orientaci
- Přidána možnost přepínání mezi zobrazením všech kroků a pouze aktivního kroku

### Vylepšení uživatelského rozhraní
- Vylepšeno zobrazení markerů úkolů s čísly kroků a bodů
- Přidány detailní informace o bodech úkolů včetně souřadnic
- Implementováno barevné rozlišení dokončených, aktivních a čekajících kroků
- Přidána animovaná cesta mezi body úkolu s šipkami pro směr postupu
- Vylepšen design popup oken s detailními informacemi o krocích
- Přidána podpora tmavého režimu pro všechny nové prvky

## [0.3.0.6] - 2025-05-26 - ROZŠÍŘENÝ SYSTÉM ÚKOLŮ A KROKŮ

### Nové funkce
- Přidán systém kroků pro úkoly s postupným plněním
- Implementováno zobrazení kroků úkolů na mapě s trasami mezi body
- Přidána podpora pro různé typy kroků (navštívení lokace, vydělání peněz)
- Implementováno automatické postupování mezi kroky úkolů
- Přidány odměny za dokončení jednotlivých kroků úkolů
- Rozšířen úkol "sehnat peníze na nájem" o detailní kroky s postupem

### Vylepšení uživatelského rozhraní
- Vytvořeno přehledné zobrazení kroků úkolů v dialogu úkolů
- Přidány vizuální indikátory pro aktivní, čekající a dokončené kroky
- Implementováno zobrazení odměn za jednotlivé kroky
- Přidány ikony pro různé typy lokací v krocích úkolů
- Vylepšeno zobrazení markerů kroků na mapě s vlastními ikonami
- Přidána podpora tmavého režimu pro všechny nové prvky

## [0.3.0.5] - 2025-05-25 - ZJEDNODUŠENÉ OVĚŘENÍ BODŮ

### Nové funkce
- Přepracováno zobrazení bodů po ověření - nyní se zobrazuje pouze fotka s pojmenováním
- Přidáno ukládání informací o ověřených bodech do localStorage
- Implementována kontrola, zda je bod již ověřený při jeho zaměření
- Přidána možnost úpravy polohy ověřeného bodu přes tlačítko nastavení
- Implementována možnost odstranění ověření bodu pro jeho opětovné ověření

### Vylepšení uživatelského rozhraní
- Vytvořeno jednodušší rozhraní pro ověřené body - pouze fotka s pojmenováním
- Přidáno malé tlačítko nastavení pro případné úpravy ověřeného bodu
- Implementován dialog nastavení s možnostmi úpravy polohy a odstranění ověření
- Přidána podpora tmavého režimu pro všechny nové prvky

## [0.3.0.4] - 2025-05-24 - PŘESNÉ A MODIFIKOVATELNÉ VYHLEDÁVÁNÍ PRÁCE

### Nové funkce
- Přepracováno vyhledávání práce s přesnými výpočty vzdáleností
- Implementováno automatické vyhledání nejbližší práce při použití příkazu "chci jít do práce"
- Přidána možnost přidání nových pracovišť s vlastními parametry
- Implementováno ukládání pracovišť do localStorage pro budoucí použití
- Přidána možnost výběru typu práce (kancelářská, programování, manuální) s různými odměnami
- Implementováno vytváření trasy do práce na mapě

### Vylepšení uživatelského rozhraní
- Vytvořeno moderní rozhraní pro přidání nových pracovišť
- Přidány detailní informace o pracovištích včetně vzdálenosti a času cesty
- Implementováno dynamické generování možností výběru typu práce podle dostupných pracovišť
- Přidána podpora tmavého režimu pro všechny nové prvky
- Vylepšeny animace a přechody pro lepší uživatelský zážitek

## [0.3.0.3] - 2025-05-23 - ZJEDNODUŠENÉ ZOBRAZENÍ FOTKY BODU

### Nové funkce
- Přepracováno zobrazení fotky bodu na jednodušší kompaktní verzi
- Přidáno malé tlačítko nastavení pro případné změny
- Implementováno automatické zavření fotky po 10 sekundách
- Přidána možnost zavřít fotku kliknutím na obrázek

### Vylepšení uživatelského rozhraní
- Vytvořeno minimalistické rozhraní s fotkou a názvem bodu
- Přesunuto zobrazení fotky do pravého dolního rohu obrazovky
- Přidán průhledný overlay s názvem bodu a tlačítkem nastavení
- Implementována animace při zobrazení a skrytí fotky

## [0.3.0.2] - 2025-05-22 - FOTKY BODŮ

### Nové funkce
- Přidáno zobrazení fotky bodu po ověření
- Implementována databáze fotek pro různé typy bodů
- Přidána funkce showPointImage() pro zobrazení fotky bodu s detaily
- Implementováno automatické zobrazení fotky po ověření bodu
- Přidány tlačítka pro navigaci a sdílení bodu

### Vylepšení uživatelského rozhraní
- Vytvořeno moderní rozhraní pro zobrazení fotky bodu
- Přidány detailní informace o bodu včetně souřadnic a adresy
- Implementována podpora tmavého režimu pro dialog s fotkou
- Přidány responzivní styly pro mobilní zařízení

## [0.3.0.1] - 2025-05-21 - VYLEPŠENÍ OVĚŘENÍ BODŮ

### Nové funkce
- Přidáno tlačítko "Ověřit bod" pro rychlé ověření a automatické uložení korekce
- Implementována funkce verifyAndSavePoint() pro ověření a automatické uložení bodu
- Přidáno automatické uložení korekce po ověření bodu bez nutnosti dalšího ukládání
- Implementováno získávání většího množství XP za ověření a automatické uložení korekce

### Vylepšení uživatelského rozhraní
- Redesign popup okna pro korekci bodu s přehlednějším rozložením
- Přidány dvě možnosti korekce: automatické ověření a ruční korekce
- Vylepšeny CSS styly pro popup okno korekce s lepším vizulním oddělením možností
- Rozšířena podpora tmavého režimu pro všechny nové prvky

## [0.3.0.0] - 2025-05-20 - AUTOMATICKÉ OVĚŘENÍ A KOREKCE BODŮ

### Nové funkce
- Přidáno automatické ověření správnosti polohy bodů
- Implementováno automatické přesměrování na správnou polohu při detekci nesprávného bodu
- Přidána možnost ruční korekce polohy bodů přetáhnutím markeru
- Implementováno ukládání korekcí do localStorage pro budoucí použití
- Přidána funkce pro automatické použití uložených korekcí při příštím zaměření bodu
- Implementováno získávání XP za korekci polohy bodu

### Vylepšení uživatelského rozhraní
- Přidáno popup okno s návodem pro korekci polohy bodu
- Implementovány tlačítka pro uložení nebo zrušení korekce
- Přidány notifikace o stavu ověření a korekce bodů
- Vytvořeny CSS styly pro popup okno korekce s podporou tmavého režimu

## [0.2.9.9] - 2025-05-19 - VYHLEDÁVÁNÍ ADRES

### Nové funkce
- Rozšířena funkce "zaměřit bod" o možnost vyhledávání a přesměrování na vlastní adresu
- Přidána záložka "Vlastní adresa" do dialogu pro zaměření bodů
- Implementováno vyhledávání adres s návrhem výsledků
- Přidána možnost vybrat konkrétní výsledek vyhledávání a přejít na něj
- Implementováno získávání většího množství XP za vyhledávání vlastních adres

### Vylepšení designu
- Vytvořeno záložkové rozhraní pro přepínání mezi předdefinovanými body a vlastní adresou
- Přidán formulář pro zadání vlastní adresy s tlačítkem pro vyhledávání
- Implementováno zobrazení výsledků vyhledávání s možností výběru
- Přidána podpora tmavého režimu pro nové prvky

## [0.2.9.8] - 2025-05-18 - ZAMĚŘENÍ SPECIÁLNÍCH BODŮ

### Nové funkce
- Přidán nový příkaz "zaměřit bod" do kategorie Mapa v menu příkazů
- Implementován dialog pro výběr speciálních bodů na mapě
- Přidáno 10 předdefinovaných speciálních bodů (domů, práce, nájem, nemocnice, nádraží, atd.)
- Implementováno vyhledávání mezi speciálními body
- Přidána funkce pro zaměření a přechod na vybraný bod na mapě
- Implementováno získávání XP za použití funkce zaměření bodu

### Vylepšení designu
- Vytvořeno moderní rozhraní pro výběr speciálních bodů
- Přidány ikony pro jednotlivé typy bodů
- Implementována podpora tmavého režimu pro dialog zaměření bodů
- Přidány animace a přechody pro lepší uživatelský zážitek

## [0.2.9.7] - 2025-05-17 - VIRTUÁLNÍ CESTA DO PRÁCE

### Nové funkce
- Implementována možnost "poslat se do práce" místo fyzického docházení
- Přidány tři typy práce: kancelářská práce, programování a manuální práce
- Každý typ práce má jinou výši odměny (800-1500 Kč za den)
- Vydělané peníze se automaticky započítávají do úkolu "sehnat peníze na nájem"
- Přidáno získávání XP za práci

### Vylepšení designu
- Vytvořeno moderní rozhraní pro výběr typu práce
- Implementována animace práce s informacemi o postupu
- Přidána podpora tmavého režimu pro dialog práce
- Vylepšena interakce s uživatelem při výběru typu práce

## [0.2.9.6] - 2025-05-16 - PRODEJ AUT S FOTKAMI

### Nové funkce
- Vytvořen nový modul pro prodej aut s fotkami a detailními informacemi
- Implementováno moderní rozhraní pro prohlížení nabídky aut s možností filtrování
- Přidány detailní stránky aut s fotogalerií, technickými údaji a výbavou
- Implementována možnost koupit auto, objednat testovací jízdu nebo kontaktovat prodejce
- Přidána kontrola dostatku peněz při nákupu auta
- Implementováno získávání XP za prohlížení a nákup aut

### Vylepšení designu
- Vytvořeny moderní CSS styly pro okno prodeje aut s podporou tmavého režimu
- Přidány animace a přechody pro lepší uživatelský zážitek
- Implementován responzivní design pro různé velikosti obrazovky
- Přidány interaktivní prvky jako filtry, miniatury obrázků a tlačítka akcí

## [0.2.9.5] - 2025-05-15 - SYSTÉM ÚKOLŮ A DENNÍCH QUESTŮ

### Nové funkce
- Přidán systém úkolů a denních questů s možností sledování postupu na mapě
- Implementován první hlavní úkol "Sehnat peníze na nájem" s odměnou XP a bodů
- Přidán systém náhodných denních questů (navštívit místo, najít předmět, doručit balíček)
- Vytvořen přehledný dialog pro zobrazení všech úkolů a questů s možností filtrování
- Přidána nová měna "body z questů" získávaná za plnění úkolů a questů
- Implementováno zobrazení úkolů a questů na mapě pomocí speciálních markerů

### Přidání do menu příkazů
- Přidána nová kategorie "Úkoly" do menu příkazů
- Přidány příkazy pro zobrazení úkolů, denních questů a úkolu na nájem
- Přidán příkaz "prodej aut" pro zobrazení nabídky aut k prodeji
- Implementováno získávání XP za používání nových příkazů

## [0.2.9.4] - 2025-05-14 - ZVĚTŠENÍ MAPY A PŘESUN FINANCÍ DO MENU

### Vylepšení mapy
- Zvětšena velikost mapy z 600px na 850px pro lepší využití prostoru na stránce
- Upraveno rozložení stránky pro větší poměr mapy (4:1 místo 2:1)
- Zvětšen celkový kontejner stránky z 1200px na 1400px pro lepší využití širokých obrazovek
- Optimalizováno zobrazení mapy na mobilních zařízeních (650px výška)
- Vylepšena aktualizace velikosti mapy při změnách režimu a načtení stránky

### Přesun financí do menu příkazů
- Odstraněn samostatný ukazatel financí, který nefungoval správně
- Přidána nová kategorie "Finance" do menu příkazů
- Přidány příkazy pro zobrazení stavu peněz a jednotlivých kryptoměn (Bitcoin, Ethereum, Dogecoin, Ripple)
- Vytvořen nový dialog pro zobrazení financí s větším a přehlednějším designem
- Přidány detailní informace o kryptoměnách včetně aktuální ceny a hodnoty v Kč

### Ostatní vylepšení
- Upraveno ukládání pozice chatu - nyní zůstává na místě, kam ho uživatel přesunul
- Vylepšeno přesouvání prvků - nyní se pohybují 1.5x rychleji pro lepší ovládání

## [0.2.9.3] - 2025-05-13 - PŘESUNUTELNÉ PRVKY ROZHRANÍ

### Nové funkce
- Přidána možnost přesouvat všechny prvky uživatelského rozhraní (chat, ukazatele peněz a bitcoinu)
- Implementován obecný modul pro přesouvatelnost prvků s ukládáním pozic
- Přidána možnost minimalizace chatu a ukazatelů peněz/bitcoinu
- Vylepšen design hlaviček přesunutelných prvků pro lepší uživatelský zážitek

### Vylepšení
- Vylepšen design AI chatu s přidáním hlavičky pro přesouvatelnost
- Optimalizováno zobrazení všech přesunutelných prvků pro různé velikosti obrazovky
- Implementováno automatické ukládání pozic prvků do localStorage
- Přidána kontrola viditelnosti prvků při změně velikosti okna

## [0.2.9.2] - 2025-05-12 - VYLEPŠENÍ UKAZATELŮ PENĚZ A BITCOINU

### Vylepšení
- Vylepšeno uspořádání ukazatelů peněz a bitcoinu pro lepší čitelnost
- Změněno vertikální uspořádání na horizontální pro úsporu místa
- Přidány CSS styly pro lepší zarovnání a zabránění překrývání
- Optimalizováno zobrazení pro různé velikosti obrazovky

## [0.2.9.1] - 2025-05-11 - PŘIDÁNÍ UKAZATELE BITCOINU

### Nové funkce
- Přidán ukazatel bitcoinu vedle ukazatele peněz s výchozí hodnotou 0.05 BTC
- Implementovány metody pro přidávání a odebírání bitcoinu
- Přidáno získávání XP za získání bitcoinu
- Vylepšen design ukazatele peněz a bitcoinu s barevným rozlišením

## [0.2.9] - 2025-05-10 - VYLEPŠENÍ PŘÍSTUPU K NOVINKÁM

### Vylepšení
- Odstraněn zvoneček pro novinky z pravého horního rohu
- Přidána možnost zobrazení novinek přes menu příkazů
- Upravena pozice ukazatele peněz, aby se nepřekrýval s jinými prvky
- Vylepšeno zobrazení souhvězdí na obloze v režimu glóbusu

## [0.2.8.7.8] - 2025-05-09 - FUNKČNÍ PANEL MOŽNOSTÍ VEDLE CHATU

### Nové funkce
- Přidány funkční moduly pro služby jídla a pití (jídlo, pizza, energy drinky, krkovička)
- Přidány funkční moduly pro lékařské služby (lékař, zubař, lékárna)
- Přidán funkční modul pro veřejnou dopravu s vyhledáváním spojení
- Implementováno zobrazení prodejních oken s možností objednávky
- Přidána možnost objednání k lékaři a zubaři
- Přidána možnost nákupu jízdenek na veřejnou dopravu
- Přidán efekt souhvězdí a padajících hvězd v tmavém režimu
- Přidána možnost zobrazení souhvězdí na obloze v režimu glóbusu
- Přidán ukazatel peněz s výchozí hodnotou 500 Kč

### Vylepšení
- Vylepšen design menu příkazů - větší, přehlednější a vizuálně atraktivnější
- Vylepšen tmavý režim s efektem noční oblohy a souhvězdí
- Přidána funkčnost všem tlačítkům v panelu možností
- Přidána položka "Novinky a aktualizace" do menu příkazů
- Vylepšena interakce s uživatelem při použití příkazů
- Optimalizováno zobrazení všech nových oken a dialogů
- Přidáno získávání XP za použití různých služeb
- Přidány skripty pro snadné nahrání na GitHub

### Opravy
- Odstraněn zvoneček pro novinky z pravého horního rohu
- Přidána možnost zobrazení novinek přes menu příkazů
- Upravena pozice ukazatele peněz, aby se nepřekrýval s jinými prvky
- Vylepšeno zobrazení souhvězdí na obloze v režimu glóbusu

## [0.2.8.7.7] - 2025-05-08 - PANEL MOŽNOSTÍ VEDLE CHATU

### Nové funkce
- Přidán panel možností vedle chatu s tlačítkem pro zobrazení/skrytí
- Přidána možnost manuálně vypnout panel možností v nastavení
- Rozšířen panel možností o kategorie a příkazy (mapa, zobrazení, služby, nastavení, zábava)
- Přidáno vyhledávání v panelu možností

### Vylepšení
- Upraven dotazník zpětné vazby, aby se zobrazil pouze jednou
- Vylepšeno ukládání nastavení panelu možností do localStorage
- Optimalizováno zobrazení panelu možností pro různé velikosti obrazovky

### Poznámka
- Tato verze obsahuje pouze základní implementaci panelu možností bez funkčního propojení všech tlačítek

## [0.2.8.7.6] - 2025-05-07 - MENU PŘÍKAZŮ VEDLE CHATU A DOTAZNÍK POUZE JEDNOU

### Nové funkce
- Přidáno menu příkazů vedle chatu s možností zobrazení/skrytí
- Přidána možnost manuálně vypnout menu příkazů v nastavení
- Rozšířeno menu příkazů o nové služby (lékař, zubař, pizza, atd.)
- Přidána nová kategorie "Zábava" s příkazy pro rap a práci

### Vylepšení
- Upraven dotazník zpětné vazby, aby se zobrazil pouze jednou
- Vylepšeno ukládání nastavení menu příkazů do localStorage
- Optimalizováno zobrazení menu příkazů pro různé velikosti obrazovky

## [0.2.8.7.5] - 2025-05-06 - ODSTRANĚNÍ MENU PŘÍKAZŮ

### Odstraněné funkce
- Odstraněno menu příkazů a všechny související soubory (commands-menu.js, commands-menu.css, commands-menu-extensions.css)
- Odstraněny všechny reference na menu příkazů z ostatních souborů
- Odstraněno tlačítko pro zobrazení menu příkazů z chatu

### Opravy a vylepšení
- Optimalizován kód pro lepší výkon bez menu příkazů
- Aktualizována dokumentace projektu

## [0.2.8.7.4] - 2025-05-05 - OPRAVA VÝPOČTU CESTY A MENU PŘÍKAZŮ, PŘIDÁNÍ ROZVÁŽKY PIZZY

### Nové funkce
- Přidána nová funkce rozvážky pizzy do menu příkazů
- Implementováno interaktivní UI pro výběr pizzerie a objednávku
- Přidáno získávání XP za použití funkce rozvážky pizzy

### Opravy a vylepšení
- Optimalizován výpočet cesty pro výrazně lepší výkon
- Snížen timeout pro API volání pro rychlejší odezvu
- Přidána optimalizace počtu bodů pro výpočet trasy
- Vylepšeno vykreslování trasy pomocí optimalizovaných parametrů
- Opravena inicializace menu příkazů při načtení stránky
- Přidáno lepší scrollování v menu příkazů
- Vylepšena podpora pro dotyková zařízení

## [0.2.8.7.3] - 2025-05-03 - VYLEPŠENÍ MENU PŘÍKAZŮ A IKONY AKTUALIZACÍ

### Vylepšení menu příkazů
- Přidáno překrytí při zobrazení menu příkazů
- Menu příkazů nyní zobrazeno uprostřed obrazovky
- Vylepšeny animace a efekty pro menu příkazů

### Přidání ikony aktualizací
- Přidána ikona aktualizací v pravém horním rohu
- Opravena inicializace ikony aktualizací
- Vylepšeno zobrazení informací o aktualizacích

## [0.2.8.7.2] - 2025-05-02 - OPRAVA ZOBRAZENÍ MENU PŘÍKAZŮ

### Opravy chyb
- Opraveno zobrazení menu příkazů z chatu
- Vylepšeno tlačítko pro zobrazení menu příkazů
- Přidány lepší animace a efekty pro menu příkazů
- Opravena inicializace menu příkazů při načtení stránky

## [0.2.8.7.1] - 2025-05-01 - NOVÉ FUNKCE A VYLEPŠENÍ MENU PŘÍKAZŮ

### Nové funkce
- Přidána funkce "Chci jít do práce" pro vytvoření trasy do práce a správu úkolů
- Přidána základní podpora pro rapové akce
- Přidány nové služby: taxi, zubař, lékař a úřad práce

### Vylepšení menu příkazů
- Přidáno funkční scrollování v menu příkazů
- Vylepšen design a organizace menu příkazů
- Opraveno zobrazení menu příkazů z chatu
- Vylepšeno tlačítko pro zobrazení menu příkazů

### Rozšíření systému XP a achievementů
- Přidány nové kategorie XP: Práce a úkoly, Asistenti a služby, Zábava
- Implementováno získávání XP za používání nových funkcí

## [0.2.8.7.0] - 2025-04-30 - VYLEPŠENÍ MENU PŘÍKAZŮ A NOVÉ FUNKCE

### Vylepšení menu příkazů
- Kompletní redesign menu příkazů s moderním a přehledným vzhledem
- Přidány kategorie pro lepší organizaci příkazů
- Implementováno vyhledávání a filtrování příkazů
- Vylepšeny animace a přechody pro plynulejší uživatelský zážitek

### Nové funkce
- Přidán hlasový asistent Alexa pro hlasové ovládání aplikace
- Implementována funkce pro zobrazení otevírací doby obchodů a služeb v okolí
- Přidána možnost filtrování a vyhledávání v otevíracích dobách
- Implementována detekce aktuálně otevřených míst

### Rozšíření systému XP a achievementů
- Přidáno získávání XP za používání nových funkcí
- Implementována nová kategorie XP 'Asistenti a služby'

## [0.2.8.6.9] - 2025-04-29 - VYHLEDÁVÁNÍ SPOJENÍ VEŘEJNOU DOPRAVOU

### Nová funkce vyhledávání spojení
- Přidána funkce pro vyhledávání spojení veřejnou dopravou mezi Hodonínem a Hruškami
- Implementováno zobrazení vlakových a autobusových spojení s reálnými časy
- Přidána automatická aktualizace spojení v pravidelných intervalech
- Zobrazení informací o zpoždění a zrušených spojeních

### Rozšíření systému XP a achievementů
- Přidána nová kategorie XP 'Vyhledávání spojení'
- Přidány nové achievementy za vyhledávání spojení veřejnou dopravou
- Implementováno získávání XP za vyhledávání spojení

### Vylepšení uživatelského rozhraní
- Přidáno tlačítko pro zobrazení spojení při výpočtu trasy mezi Hodonínem a Hruškami
- Implementováno přehledné zobrazení spojení s možností filtrování podle typu dopravy
- Přidány detailní informace o spojeních včetně ceny, nástupiště a dopravce

## [0.2.8.6.8] - 2025-04-28 - ROZŠÍŘENÍ XP SYSTÉMU A NOVÉ FUNKCE

### Rozšíření systému XP a achievementů
- Přidáno získávání XP za interakce s mapou (zobrazování glóbusu, 3D režim, přidávání bodů)
- Přidány nové achievementy za používání různých režimů mapy
- Přidány nové kategorie XP pro lepší sledování zdrojů XP

### Nové funkce
- Přidána funkce hledání práce s nabídkami v okolí
- Implementováno filtrování nabídek práce podle lokality
- Přidána možnost reakce na nabídky práce a získávání XP
- Přidány nové achievementy za hledání práce

### Vylepšení uživatelského rozhraní
- Vylepšena intuitivnost ovládání aplikace
- Přidány vizualizace klikatelnosti prvků
- Rozšířena nabídka příkazů o nové funkce

## [0.2.8.6.7] - 2025-04-27 - VYLEPŠENÍ INTERAKCE S UŽIVATELSKÝM PROFILEM A ZÍSKÁVÁNÍ XP

### Vylepšení uživatelského profilu
- Přidána možnost zobrazit profil kliknutím na ukazatel úrovně v levém horním rohu
- Vylepšena interakce s profilem pomocí vizualizace klikatelnosti (změna kurzoru)

### Nové zdroje získávání XP
- Přidáno získávání XP za každé rozhodnutí uživatele v chatu
- Implementován systém odměňování za delší a propracovanější zprávy (2-5 XP)
- Přidána nová kategorie XP 'Rozhodnutí v chatu' pro lepší sledování zdrojů XP

### Vylepšení uživatelského rozhraní
- Vylepšena intuitivnost ovládání aplikace
- Přidány vizualizace klikatelnosti prvků

## [0.2.8.6.6] - 2025-04-26 - VYLEPŠENÝ UŽIVATELSKÝ PROFIL A STATISTIKY

### Vylepšený uživatelský profil
- Přidány záložky pro různé sekce profilu (Přehled, Statistiky, Achievementy, Historie XP)
- Implementovány detailní statistiky uživatele s vizualizací dat
- Přidány grafy pro sledování postupu a získávání XP
- Přidána historie získaných XP s důvody a časovými údaji

### Nové statistiky a přehledy
- Přidány časové statistiky (denní, týdenní, měsíční aktivita)
- Implementován přehled zdrojů získání XP
- Přidána vizualizace postupu k další úrovni
- Přidán přehled dosažených a nedosažených achievementů

### Vylepšení uživatelského rozhraní
- Přidány animace pro lepší uživatelský zážitek
- Optimalizováno zobrazení pro různé velikosti obrazovky
- Vylepšena podpora tmavého režimu

## [0.2.8.6.5] - 2025-04-25 - NOVÉ FUNKCE PRO NÁKUP ENERGETICKÝCH NÁPOJŮ A KRKOVIČKY

### Nové funkce pro nákup
- Přidána nová funkce pro nákup energetických nápojů z eshopu podpultovky.cz
- Přidána nová funkce pro nákup krkovičky a dalších mas
- Implementován moderní nákupní košík s možností přidávání a odebírání položek
- Přidány detailní informace o produktech včetně obrázků a popisů

### Rozšíření systému XP a achievementů
- Přidány nové achievementy za nákup energetických nápojů a krkovičky
- Přidány XP odměny za návštěvu obchodů a provedení nákupů
- Výše XP odměn závisí na hodnotě nákupu

### Vylepšení uživatelského rozhraní
- Implementováno moderní uživatelské rozhraní pro obchody s energetickými nápoji a krkovičkou
- Přidány animace pro lepší uživatelský zážitek při nakupování
- Optimalizováno zobrazení pro různé velikosti obrazovky
- Přidána podpora tmavého režimu pro nákupní rozhraní

## [0.2.8.6.4] - 2025-04-24 - OPTIMALIZACE VÝPOČTU TRAS A VYLEPŠENÍ SYSTÉMU XP

### Optimalizace výpočtu tras
- Vylepšen výpočet trasy mezi body s optimalizací pro rychlejší odezvu
- Přidán indikátor načítání trasy s animací pro lepší uživatelský zážitek
- Odstraněno automatické přizpůsobení mapy při výpočtu trasy
- Přidáno tlačítko pro zobrazení celé trasy s animací
- Optimalizováno zobrazení dlouhých tras pro lepší výkon

### Vylepšení systému XP a achievementů
- Implementován systém denních bonusů s odměnami za pravidelné přihlášení
- Přidán systém streaků s rostoucími bonusy za každý den v řadě
- Rozšířen systém achievementů s novými kategoriemi a úrovněmi (bronz, stříbro, zlato, platina)
- Přidány XP odměny za získání achievementů
- Implementovány statistiky uživatele pro sledování pokroku

### Opravy a vylepšení UI
- Upraveno umístění prvků UI, aby se nepřekrývaly
- Vylepšeny notifikace o získání XP a achievementů
- Přidány nové animace pro lepší uživatelský zážitek
- Optimalizován výkon aplikace pro plynulejší chod

## [0.2.8.6.3] - 2025-04-23 - NOVÉ FUNKCE PRO MAPU A CHAT

### Nové funkce pro mapu
- Přidán noční režim mapy s tmavým pozadím a zvýrazněnými cestami
- Implementována vrstva s počasím na mapě a widget s aktuálními informacemi
- Přidána funkce pro zobrazení zajímavých míst v okolí (restaurace, hotely, památky)
- Implementován nástroj pro měření vzdálenosti mezi body na mapě
- Přidána funkce pro sdílení aktuální polohy nebo trasy přes URL a QR kód

### Další vylepšení mapy
- Přidána vrstva s dopravními informacemi pro zobrazení aktuální dopravní situace
- Implementována vrstva s turistickými a cyklistickými trasami v okolí
- Přidána funkce pro zobrazení obchodů v okolí s možností online nákupu
- Opraveno vypnutí nočního režimu - nyní se mapa správně vrací do původního stavu
- Vylepšeno uživatelské rozhraní pro práci s mapovými vrstvami
- Přidány tlačítka pro rychlé přepínání mezi různými vrstvami
- Optimalizováno zobrazení všech nových funkcí na mobilních zařízeních

### Exotické funkce a gamifikace
- Přidána funkce pro zobrazení příběhů a legend z aktuální oblasti
- Implementována funkce pro zobrazení místních specialit a gastronomických tipů
- Přidán systém XP a levelů pro gamifikaci aplikace
- Implementován systém achievmentů za objevování nových míst a funkcí
- Přidán profil uživatele s přehledem úrovně a získaných achievmentů
- Implementovány notifikace o získání XP a achievmentů

## [0.2.8.6.1] - 2025-04-22 - VYLEPŠENÍ MENU PŘÍKAZŮ

### Vylepšení menu příkazů
- Vylepšeno zobrazení menu příkazů - nyní se zobrazuje uprostřed obrazovky s poloprůhledným pozadím
- Přidány animace pro plynulé zobrazení a skrytí menu příkazů
- Zvýšen z-index menu příkazů, aby bylo vždy nad ostatními prvky
- Upraveno responzivní zobrazení pro mobilní zařízení
- Přidána nová položka "Premium verze" do menu příkazů
- Implementován modal s nabídkou premium funkcí
- Zajištěno správné fungování menu příkazů ve fullscreen režimu

### Opravy a vylepšení
- Optimalizováno zobrazení menu příkazů na různých velikostech obrazovky
- Vylepšeny animace a přechody pro plynulejší uživatelský zážitek
- Přidány nové CSS styly pro premium modal s atraktivním designem
- Implementována funkce pro zobrazení premium nabídky s výhodami

## [0.2.8.6] - 2025-04-21 - MENU PŘÍKAZŮ VEDLE CHATU

### Přidáno menu příkazů vedle chatu
- Implementováno nové menu příkazů vedle chatu pro rychlý přístup k nejpoužívanějším funkcím
- Přidáno tlačítko pro zobrazení/skrytí menu příkazů
- Vytvořeno přehledné rozhraní s ikonami a popisky příkazů
- Implementována podpora pro různé typy příkazů (přidání bodu, výpočet trasy, nastavení, atd.)
- Přidána možnost spuštění příkazů kliknutím na položku v menu
- Optimalizováno zobrazení menu příkazů ve fullscreen režimu
- Přidány CSS styly pro menu příkazů s podporou tmavého režimu
- Implementována responzivita pro různé velikosti obrazovky

### Přidána ikona pro zobrazení aktualizací
- Implementována ikona v pravém horním rohu pro zobrazení informací o aktualizacích
- Přidáno oznámení o nové verzi s možností zobrazení změn
- Vytvořen systém pro správu a zobrazení oznámení o aktualizacích
- Optimalizováno zobrazení ikony a oznámení pro různé velikosti obrazovky
- Přidána podpora pro tmavý režim

## [0.2.8.5] - 2025-04-20 - OPRAVA INICIALIZACE APLIKACE

### Opravena inicializace aplikace
- Opraven problém s inicializací aplikace, kdy některé funkce a prvky UI nefungovaly správně
- Implementován robustní systém pro zajištění správného pořadí inicializace komponent
- Přidáno ošetření chyb při inicializaci s detailním logováním
- Optimalizován proces načítání aplikace pro rychlejší start
- Vylepšena detekce a řešení konfliktů mezi komponentami při inicializaci

### Vylepšení stability a výkonu
- Optimalizována práce s DOM elementy pro lepší výkon
- Vylepšena správa event listenerů pro prevenci memory leaks
- Implementován systém pro odložené načítání méně důležitých komponent
- Optimalizováno vykreslování UI prvků pro plynulejší uživatelský zážitek
- Vylepšena kompatibilita s různými prohlížeči a zařízeními

## [0.2.8.4] - 2025-04-20 - OPTIMALIZACE VÝPOČTU TRAS A VYLEPŠENÍ SYSTÉMU PŘÍKAZŮ

### Optimalizace výpočtu tras

#### Pokročilé algoritmy pro výpočet tras
- Implementace algoritmu Contraction Hierarchies pro až 100x rychlejší výpočet tras
- Využití více-jádrového zpracování pro paralelní výpočet tras
- Implementace algoritmu A* s heuristikou pro efektivní vyhledávání cest
- Optimalizace datových struktur pro rychlejší přístup k mapovým datům
- Cachování často používaných tras pro okamžité načtení
- Implementace algoritmu pro výpočet tras v reálném čase s aktualizací během pohybu

#### Vylepšené možnosti plánování tras
- Podpora více typů dopravy (auto, kolo, pěšky, veřejná doprava) s optimalizací pro každý typ
- Možnost kombinace různých typů dopravy v jedné trase (multimodální plánování)
- Vyhledávání alternativních tras s různými parametry (nejrychlejší, nejkratší, nejkrásnější)
- Zohlednění aktuální dopravní situace a uzávěrek při výpočtu trasy
- Optimalizace trasy podle výškového profilu pro úsporu energie
- Možnost nastavení průjezdných bodů a vyhnutí se určitým oblastem

#### Integrace s externími službami pro výpočet tras
- Využití Google Directions API pro přesné a aktuální trasy
- Integrace s MapBox Directions API pro alternativní trasy
- Využití OSRM (Open Source Routing Machine) pro rychlé výpočty tras
- Implementace GraphHopper API pro speciální typy tras (cyklo, turistické)
- Automatický výběr nejlepšího API podle typu trasy a dostupnosti
- Záložní systém pro případ výpadku primárního API

#### Vylepšené zobrazení tras
- Barevné rozlišení různých úseků trasy podle typu cesty nebo náročnosti
- Animované zobrazení průběhu trasy s možností přehrávání
- Interaktivní výškový profil trasy s možností přiblížení a zobrazení detailů
- Zobrazení zajímavých bodů podél trasy s možností přidání zastávek
- Detailní navigace krok za krokem s hlasovými pokyny
- 3D zobrazení trasy v glóbus režimu s realistickým terénem

### Vylepšení systému příkazů

#### Inteligentní systém rozpoznávání příkazů
- Implementace pokročilého NLP (Natural Language Processing) pro lepší porozumění přirozenému jazyku
- Automatické rozpoznávání záměru uživatele i při nejednoznačných nebo neúplných příkazech
- Podpora různých variant a synonym pro stejný příkaz (např. "ukazat", "zobrazit", "najdi")
- Automatické opravy překlepů a gramatických chyb v příkazech
- Kontextové rozpoznávání příkazů na základě předchozích interakcí
- Schopnost zpracovat složité příkazy s více parametry a podmínkami

#### Efektivní systém výběru příkazů
- Implementace inteligentního našeptávače příkazů s prediktivním textem
- Zobrazení relevantních příkazů na základě aktuálního kontextu a činnosti uživatele
- Kategorizované menu příkazů s možností rychlého přístupu k často používaným příkazům
- Implementace systému rychlých klávesových zkratek pro nejpoužívanější příkazy
- Kontextové menu příkazů dostupné při kliknutí pravým tlačítkem na různé prvky mapy
- Personalizovaný seznam oblíbených příkazů na základě historie používání

#### Komplexní systém pro seznámení uživatelů s příkazy
- Implementace interaktivního průvodce "Příkazová akademie" pro systematické seznámení s příkazy
- Gamifikovaný systém učení s postupným odemykáním nových příkazů a odměnami za jejich použití
- Interaktivní mapa všech dostupných příkazů s vizualizací jejich vzájemných vztahů
- Systém "Příkaz dne" představující každý den jeden příkaz s detailním popisem a příklady použití
- Automatické detekce nevyužitých příkazů a jejich doporučení uživateli
- Personalizovaný plán učení příkazů na základě uživatelských preferencí a způsobu používání aplikace

#### Interaktivní průvodce a nápověda
- Kontextová nápověda při zadávání příkazů s příklady použití a animovanými ukázkami
- Interaktivní tutoriály pro složitější příkazy s možností přímého vyzkoušení v bezpečném režimu
- Zobrazení tipů a triků pro efektivní používání příkazů v kontextu aktuální činnosti
- Možnost vyhledávání v dokumentaci příkazů přímo z chatovacího rozhraní s okamžitou odpovědí
- Systém zpětné vazby pro vylepšování příkazů na základě uživatelských připomínek
- Interaktivní FAQ s nejčastějšími dotazy ohledně příkazů a jejich použití

#### Pokročilé uživatelské rozhraní pro příkazy
- Implementace hybridního rozhraní kombinujícího textové příkazy a grafické ovládací prvky
- Dynamické formuláře pro zadávání parametrů příkazů s validací vstupu
- Vizualizace výsledků příkazů pomocí interaktivních grafů a diagramů
- Animované přechody mezi různými stavy příkazů
- Podpora hlasového zadávání příkazů s rozpoznáváním řeči
- Adaptivní rozhraní přizpůsobující se úrovni zkušeností uživatele

#### Hluboká integrace příkazů s mapou a chatem
- Implementace systému "Aktivní mapa" umožňující přímé propojení příkazů s prvky na mapě
- Kontextové příkazy dostupné při interakci s různými prvky mapy (body, trasy, oblasti)
- Vizualizace dostupných příkazů přímo na mapě pomocí interaktivních ikon a zvýraznění
- Systém "Chytrejší chat" s automatickým rozpoznáváním mapových prvků v textu
- Obousměrná synchronizace mezi chatem a mapou - změny v jednom se okamžitě projeví v druhém
- Funkce "Drag & Drop" pro přetáhnutí prvků z mapy do chatu a naopak

#### Interaktivní příkazové centrum
- Implementace centrálního hubu pro správu a objevování všech dostupných příkazů
- Interaktivní 3D vizualizace kategorií příkazů s možností procházení a filtrování
- Systém "Příkazové karty" s detailním popisem, příklady použití a ukázkovými animacemi
- Možnost vytváření vlastních příkazů a maker kombinací existujících příkazů
- Sociální funkce umožňující sdílení užitečných příkazů a maker s ostatními uživateli
- Analytický dashboard zobrazující statistiky používání příkazů a doporučení pro zefektivnění práce

#### Systém postupného učení příkazů
- Implementace víceúrovňového systému učení od základních po pokročilé příkazy
- Interaktivní výukové mise s konkrétními úkoly pro procvičení různých příkazů
- Systém "Učení praxí" automaticky nabízející nápovědu při prvních pokusech o použití nových příkazů
- Pokročilé výukové scénáře simulující reálné situace pro procvičení kombinací příkazů
- Systém certifikací a odznaků za zvládnutí různých skupin příkazů
- Pravidelné výzvy a soutěže motivující k učení a používání nových příkazů

>>>>>>> v0.3.8.3
# Můj osobní plán na vývoj

## Úkol 1
- Naučit se pracovat s WordPressem - základy tvorby webů, instalace pluginů, úprava šablon a práce s redakčním systémem

## Úkol 2
- Dohnat vzdělání v matematice - algebra, geometrie, diferenciální a integrovaný počet
- Dohnat vzdělání ve fyzice - mechanika, elektromagnetismus, termodynamika, kvantová fyzika
- Dohnat vzdělání v chemii - anorganická a organická chemie, biochemie
- Prostudovat programovací jazyky - JavaScript, Python, C++, Java
- Prohloubit znalosti v oblasti IT - databáze, sítě, bezpečnost, cloud computing, umělá inteligence

## Úkol 3
- Koupit všem členům rodiny dům
- Koupit si řidičský průkaz
- Koupit si auto
- Koupit si počítač, který zvládne AI jakobynic

## Úkol 4
- Nastoupit ve středu 23.4.2025 do práce
- Vyřídit papíry na úřad práce (příspěvek na bydlení)
- Domluvit si výplatu před 10.5.2025 (den platby nájmu)
<<<<<<< HEAD

# Changelog

Všechny významné změny v projektu AIMapa budou dokumentovány v tomto souboru.

## [0.2.8.0] - 2025-04-20 - VYLEPŠENÍ AI CHATU S NÁVRHY DALŠÍCH AKCÍ

### Vylepšení AI chatu s návrhy dalších akcí

- Přidány návrhy dalších akcí v chatovacím rozhraní pro rychlejší interakci
- Implementovány klikatelné návrhy akcí pod každou zprávou AI asistenta
- Návrhy akcí se dynamicky mění podle kontextu konverzace a aktuální situace
- Vylepšen design chatovacího rozhraní pro lepší přehlednost a použitelnost
- Optimalizováno zobrazení návrhů akcí v plovoucím chatu ve fullscreen režimu
- Přidány kontextové návrhy pro různé typy dotazů (navigace, body, otevírací doby, atd.)
- Implementována funkce pro generování relevantních návrhů na základě obsahu odpovědi
- Vylepšena uvítací zpráva s návrhy nejpoužívanějších akcí

## [0.2.7.3] - 2025-04-20 - OPTIMALIZACE DLOUHÝCH TRAS NA GLÓBUSU

### Optimalizace dlouhých tras na glóbusu

- Opraveny problémy se zobrazením dlouhých tras na glóbusu (např. z Česka do Číny)
- Přidána optimalizace počtu bodů trasy pro zlepšení výkonu
- Implementováno postupné přidávání segmentů trasy pro plynulejší zobrazení
- Přidáno speciální zpracování tras překračujících 180. poledník
- Implementováno rozdělení dlouhých segmentů na menší části pro lepší vizualizaci
- Přidáno ošetření chyb pro zvýšení stability aplikace

## [0.2.7.2] - 2025-04-20 - ZOBRAZENÍ TRASY Z KLASICKÉ MAPY NA GLÓBUSU

### Zobrazení trasy z klasické mapy na glóbusu

- Přidána funkce pro zobrazení trasy z klasické mapy na glóbusu
- Trasa se nyní automaticky zobrazuje na glóbusu při přepnutí do glóbus režimu
- Trasa se aktualizuje při výpočtu nové trasy, pokud je glóbus režim aktivní
- Podpora pro různé typy tras (přímá trasa, trasa z Leaflet Routing Machine)
- Trasa na glóbusu má odlišnou barvu pro lepší odlišení od tras mezi body

## [0.2.7.1] - 2025-04-20 - VYLEPŠENÍ VIDITELNOSTI TLAČÍTKA PRO NÁVRAT Z GLÓBUS REŽIMU

### Vylepšení viditelnosti tlačítka pro návrat z glóbus režimu

- Vylepšena viditelnost tlačítka pro návrat z glóbus režimu i na malých obrazovkách
- Přidána animace pulzování pro tlačítko návratu z glóbus režimu pro lepší viditelnost
- Zvýšen z-index tlačítka, aby bylo vždy nad ostatními prvky
- Přidán výraznější okraj a stín pro lepší viditelnost tlačítka
- Optimalizováno zobrazení tlačítka na různých velikostech obrazovky

## [0.2.7.0] - 2025-04-20 - VYLEPŠENÍ GLÓBUS REŽIMU

### Vylepšení glóbus režimu

- Přidáno tlačítko pro návrat z glóbus režimu zpět na 2D mapu
- Po aktivaci glóbus režimu se nyní skryje tlačítko pro aktivaci glóbus režimu a zobrazí se tlačítko pro návrat na 2D mapu
- Vylepšeny CSS styly pro tlačítka glóbus režimu
- Optimalizováno přepínání mezi glóbus režimem a 2D mapou

## [0.2.6.5] - 2025-04-20 - OPRAVA GLÓBUS REŽIMU

### Oprava glóbus režimu

- Opraven problém s aktivací glóbus režimu - nyní se aktivuje pouze po kliknutí na tlačítko glóbus
- Přidán přímý odkaz na Globe.gl knihovnu z CDN pro zajištění spolehlivé funkce glóbusu
- Vytvořen nový soubor `globe-simple.js` s jednoduchou implementací Globe.gl
- Odstraněny nepotřebné soubory, které mohly způsobovat konflikty
- Vylepšena inicializace glóbusu s automatickým načtením knihovny z CDN, pokud není dostupná
- Optimalizováno zobrazení glóbusu přes celou plochu mapy
- Přidána funkce `resizeGlobe` pro aktualizaci velikosti glóbusu po jeho zobrazení
- Vylepšeny CSS styly pro glóbus kontejner

## [0.2.5.0] - 2025-04-21 - ZJEDNODUŠENÝ GLÓBUS REŽIM

### Experimentální implementace glóbus režimu

- Pokus o implementaci interaktivního 3D glóbusu s využitím knihovny Three.js
- Vytvoření základního rozhraní pro 3D glóbus
- Implementace základních funkcí pro rotaci a animaci glóbusu
- Pokus o integraci textur Země a mraků
- Implementace základního osvětlení scény
- Přidání hvězdného pozadí pro lepší vizualizaci
- Vytvoření ovládacích prvků pro rotaci a zoom

### Integrace knihovny Globe.gl

- Přidány zdrojové soubory knihovny Globe.gl pro lepší integraci a kontrolu
- Implementována lokální verze knihovny pro zajištění nezávislosti na externích CDN
- Přidány příklady použití Globe.gl pro inspiraci a testování
- Vylepšena detekce a logování pro snadnější ladění glóbus režimu
- Optimalizována inicializace glóbusu pro lepší výkon a stabilitu
- Přidána podpora pro zobrazení bodů a tras na glóbusu

### Identifikované problémy s Three.js implementací

- Zjištěny závažné problémy s kompatibilitou Three.js v různých prohlížečích
- Problémy s načítáním textur z externích zdrojů
- Nestabilita při inicializaci Three.js scény
- Konflikty mezi Leaflet a Three.js knihovnami
- Problémy s výkonem při rotaci a animaci glóbusu
- Nekonzistentní zobrazení v různých prohlížečích
- Problémy s CSS styly a z-indexy při přepínání mezi režimy

### Poučení a plán dalšího vývoje

- Zvážit alternativní přístupy k implementaci 3D glóbusu
- Prozkoumat možnost využití specializovaných knihoven pro 3D glóby (např. WebGL Globe, Globe.GL)
- Zvážit využití Cesium.js s lepší optimalizací
- Implementovat robustnější ošetření chyb při inicializaci 3D režimu
- Vytvořit záložní režim pro případ selhání 3D glóbusu
- Zlepšit izolaci mezi 2D a 3D částmi aplikace pro prevenci konfliktů

## [0.2.4.2] - 2025-04-20 - OPTIMALIZACE VÝKONU A STABILITY

## [0.2.4] - 2025-04-20 - NÁVRAT KE STABILNÍ VERZI

### Návrat k ověřené stabilní verzi

Tato verze představuje návrat k poslední stabilní verzi 0.2.4, která poskytuje spolehlivou funkčnost všech základních funkcí aplikace. Po několika pokusech o opravu problémů v novějších verzích bylo rozhodnuto vrátit se k této ověřené verzi a zachovat dokumentaci o provedených změnách pro případné budoucí využití.

## [0.2.4.2] - 2025-04-20 - OPTIMALIZACE VÝKONU A STABILITY

### Optimalizace výkonu a stability

#### Optimalizace výpočtu trasy
- Implementováno přímé volání OSRM API pro rychlejší výpočet trasy
- Optimalizována konfigurace Leaflet Routing Machine pro lepší výkon
- Snížen časový limit pro zobrazení dočasné přímé trasy z 3 na 2 sekundy
- Přidány další parametry pro optimalizaci výpočtu trasy
- Vylepšeno zpracování chyb při výpočtu trasy
- Implementován systém záložního výpočtu trasy při selhání primární metody
- Optimalizovány síťové požadavky pro rychlejší odezvu
- Vylepšeno vykreslování trasy pro plynulejší zobrazení

#### Optimalizace správy event listenerů
- Implementován systém pro sledování a správu event listenerů
- Přidány funkce pro automatické odstranění event listenerů při odstranění elementů
- Vylepšena detekce a prevence duplicitních event listenerů
- Optimalizována paměťová náročnost při práci s event listenery

#### Optimalizace ukládání a načítání stavu aplikace
- Implementován systém pro rozdělení velkých dat při ukládání do localStorage
- Přidána validace dat při načítání stavu aplikace
- Implementován systém zálohování a obnovy při selhání ukládání/načítání
- Vylepšeno zpracování chyb při práci s localStorage
- Přidána podpora pro verzování stavu aplikace
- Optimalizována velikost ukládaných dat pro lepší výkon

#### Vylepšení stability aplikace
- Implementována robustní validace všech vstupních dat
- Vylepšeno zpracování chyb ve všech částech aplikace
- Přidány mechanismy pro automatickou obnovu při selhání
- Optimalizována práce s pamětí pro prevenci úniků paměti
- Vylepšena kompatibilita s různými prohlížeči

## [0.2.4.1] - 2025-04-20 - STABILNÍ VERZE S DOKUMENTACÍ Z NOUZOVÉ VERZE

### Integrace dokumentace z nouzové verze 0.2.6.4

Tato verze kombinuje stabilitu verze 0.2.4 s dokumentací z nouzové verze 0.2.6.4-emergency. Zachovává funkční kód verze 0.2.4, ale přidává cenné informace o problémech a řešeních z pozdějších verzí.

#### Dokumentace z nouzové verze 0.2.6.4

Nouzová verze 0.2.6.4 představovala radikální řešení pro zajištění základní funkčnosti aplikace. Po mnoha neúspěšných pokusech o opravu původního skriptu bylo vytvořeno zcela nové, minimalistické řešení, které obsahovalo pouze základní funkce pro práci s mapou. Tento přístup eliminoval všechny potenciální zdroje problémů a zajistil stabilní funkčnost aplikace.

#### Klíčové prvky nouzové verze
- Zcela nový soubor `script_new.js` s minimalistickým kódem (pouze 300 řádků oproti původním 4000+)
- Implementace pouze základních funkcí pro zajištění funkčnosti mapy bez zbytečných komplikací
- Odstranění všech pokročilých funkcí, které mohly způsobovat nestabilitu
- Zjednodušené uživatelské rozhraní pro maximální spolehlivost
- Zcela nová architektura kódu s důrazem na jednoduchost a čitelnost

#### Identifikované problémy v předchozích verzích

1. **Problémy s Cesium.js a glóbus režimem**
   - Nesprávné asynchronní načítání Cesium.js knihovny
   - Chyby při inicializaci Cesium Vieweru
   - Konflikty mezi Leaflet a Cesium knihovnami
   - Nesprávné čištění zdrojů při deaktivaci glóbus režimu

2. **Problémy s event listenery**
   - Duplicitní přidávání event listenerů při práci s markery
   - Neodregistrované event listenery při odstranění objektů
   - Konflikty mezi různými event listenery

3. **Problémy s localStorage a správou stavu aplikace**
   - Překročení limitu localStorage při ukládání většího množství dat
   - Nekonzistentní stav aplikace při načítání z localStorage
   - Chybějící validace dat při načítání z localStorage

4. **Problémy s výpočtem trasy**
   - Nestabilita při volání externího API pro výpočet trasy
   - Nesprávné zpracování chyb při výpočtu trasy
   - Problémy s vykreslováním trasy při zoomování a přesouvání mapy

5. **Problémy s CSS a zobrazením**
   - Konflikty stylů mezi Leaflet, Cesium a vlastními komponentami
   - Nesprávné nastavení z-indexů způsobující problémy se zobrazením
   - Problémy s responzivním designem na různých velikostech obrazovky

#### Doporučení pro budoucí vývoj

- Zachovat stabilní verzi 0.2.4 jako základ pro další vývoj
- Při implementaci nových funkcí postupovat postupně a důkladně testovat každou změnu
- Implementovat robustní ošetření chyb ve všech částech aplikace
- Vylepšit správu stavu aplikace s důrazem na konzistenci a validaci dat
- Optimalizovat práci s event listenery pro prevenci úniků paměti a duplicit
- Zvážit alternativní přístupy k implementaci 3D glóbus režimu

Tato verze 0.2.4.1 slouží jako důležitý referenční bod pro budoucí vývoj, kombinující stabilitu původního kódu s cennými poznatky získanými při řešení problémů v pozdějších verzích.

#### Klíčové změny
- Návrat k původnímu skriptu `script.js` místo opravného skriptu `fix.js`
- Zachování všech funkcí stabilní verze 0.2.4
- Zachování dokumentace o provedených změnách v novějších verzích
- Označení verze 0.2.4 jako hlavní stabilní verze pro další vývoj

#### Funkční prvky v této verzi
- Základní zobrazení mapy s OpenStreetMap podklady
- Přidávání bodů na mapu pomocí dvojkliku
- Výpočet trasy mezi body s informacemi o vzdálenosti a čase
- Funkční chat rozhraní s podporou příkazů (alexa, oteviracidoba)
- Funkční 3D glóbus režim v původní implementaci
- Fullscreen režim s plnou funkčností
- Nastavení aplikace (tmavý režim, barevné schéma, design bodů)
- Ukládání stavu aplikace mezi relacemi

#### Poznámky
- Tato verze je označena jako stabilní a funkční
- V případě problémů v budoucích verzích se vždy vracíme k této verzi
- Obsahuje základní funkčnost mapy, chatu a bodů
- Obsahuje funkční 3D glóbus režim v původní implementaci

## [0.1.9] - 2025-04-18

### Změněno
- Odstraněna tlačítka pro 3D a glóbus režim z hlavní stránky
- Tlačítka pro 3D a glóbus režim jsou nyní dostupná pouze ve fullscreen módu
- Vylepšeno zobrazení glóbusu pomocí dalších CSS stylů
- Optimalizována inicializace Cesium Vieweru pro lepší výkon
- Přidána další nastavení scény pro lepší zobrazení glóbusu
- Vylepšeno nastavení pozadí pro lepší kontrast a viditelnost

## [0.1.8] - 2025-04-18

### Opraveno
- Opraven závažný problém s chybějící planetou v 3D glóbus režimu
- Odstraněny hvězdy na pozadí, které rušily zobrazení glóbusu
- Vylepšeno zobrazení markerů na glóbusu pomocí billboardů
- Vylepšeno zobrazení tras mezi body na glóbusu
- Optimalizováno nastavení kamery pro lepší pohled na glóbus
- Přidáno vynucené překreslení glóbusu pro zajištění správného zobrazení
- Vylepšeny CSS styly pro správné zobrazení všech komponent Cesium

## [0.1.7] - 2025-04-18

### Opraveno
- Opraven závažný problém s černou obrazovkou v 3D glóbus režimu
- Aktualizovány CDN odkazy na knihovnu Cesium.js pro lepší kompatibilitu
- Vylepšeny CSS styly pro správné zobrazení 3D glóbusu
- Optimalizována inicializace Cesium Vieweru pro lepší výkon
- Přidáno postupné načítání terénu pro stabilnější zobrazení
- Vylepšena viditelnost a z-index pro správné vrstvení prvků

## [0.1.6] - 2025-04-18

### Přidáno
- Implementován vylepšený 3D glóbus režim pomocí knihovny Cesium.js
- Automatická synchronizace bodů mezi 2D mapou a 3D glóbusem
- Automatická aktualizace glóbusu při přidání nebo přesunutí bodů
- Vylepšené zobrazení bodů na glóbusu s popisky a popup okny
- Implementováno vykreslování tras mezi body na glóbusu
- Vylepšené ovládací prvky pro rotaci, náklon a zoom glóbusu
- Optimalizováno zobrazení glóbusu pro různé velikosti obrazovky
- Přidána podpora pro zobrazení terénu a atmosféry pro realističtější vzhled

### Opraveno
- Opraven problém s nefunkčním 3D glóbusem v předchozí verzi
- Vylepšena stabilita a výkon 3D glóbusu
- Optimalizována paměťová náročnost při práci s 3D glóbusem

## [0.1.5] - 2025-04-18

### Přidáno
- Implementován pokročilý 3D glóbus režim s možností rotace a manipulace s 3D koulí Země
- Přidáno tlačítko pro přepínání do režimu glóbusu
- Implementovány pokročilé ovládací prvky pro rotaci, náklon a zoom glóbusu
- Přidána podpora pro glóbus režim v chatu pomocí příkazů "glóbus", "koule", "země" nebo "planeta"
- Automatické přenášení bodů z 2D mapy na 3D glóbus s popup okny
- Přidáno tlačítko pro glóbus režim do fullscreen módu
- Implementována atmosféra a obloha pro realističtější vzhled glóbusu
- Optimalizováno zobrazení glóbusu pro různé velikosti obrazovky

## [0.1.4] - 2025-04-18

### Přidáno
- Implementován experimentální 3D režim s vizualizací budov pomocí OSM Buildings
- Přidáno tlačítko pro přepínání mezi 2D a 3D režimem
- Přidány ovládací prvky pro rotaci a náklon v 3D režimu
- Implementována podpora pro 3D režim v chatu pomocí příkazů "3d" nebo "budovy"
- Přidáno tlačítko pro 3D režim do fullscreen módu
- Optimalizováno zobrazení 3D budov pro různé úrovně zoomu

## [0.1.3] - 2025-04-18

### Přidáno
- Přidána tlačítka "Přidat aktivitu" a "Vymazat mapu" do fullscreen režimu pro lepší ovládání
- Implementována synchronizace stavu mezi tlačítky v normálním a fullscreen režimu
- Přidány styly pro aktivní stav tlačítek ve fullscreen režimu
- Optimalizováno zobrazení tlačítek pro mobilní zařízení

## [0.1.2] - 2025-04-18

### Vylepšeno
- Upravena pozice plovoucího chatu ve fullscreen režimu - nyní je umístěn vedle tlačítka s lodičkou pro lepší přístupnost
- Optimalizováno umístění chatu při přepínání mezi levou a pravou stranou obrazovky

## [0.1.1] - 2025-04-18

### Opraveno
- Opraven nefunkční chat ve fullscreen režimu
- Přidána chybějící funkce processMessage pro zpracování zpráv z chatu
- Zlepšena synchronizace mezi hlavním a plovoucím chatem
- Optimalizovány event listenery pro odesílání zpráv

## [0.1.0] - 2025-04-18

### Přidáno
- Implementováno omezení zoomu mapy pro zabránění příliš velkému oddálení
- Nastavení minimální úrovně zoomu (minZoom: 2) pro zabránění zobrazení prázdných oblastí
- Nastavení maximální úrovně zoomu (maxZoom: 18) pro optimalizaci zobrazení
- Implementováno omezení pohybu mapy (maxBounds) na celý svět
- Nastavení maxBoundsViscosity na 1.0 pro zabránění posunu mimo hranice mapy
- Optimalizace zobrazení dlaždic s parametrem noWrap pro zabránění opakování mapy horizontálně
- Přidán plovoucí chat do fullscreen režimu s možností minimalizace a přesunutí
- Přidáno tlačítko pro rychlý návrat z fullscreen režimu
- Přidána klávesová zkratka ESC pro opuštění fullscreen režimu
- Implementována synchronizace zpráv mezi hlavním a plovoucím chatem
- Optimalizace vykreslované trasy pro stabilní zobrazení při zoomování

### Vylepšeno
- Zlepšená vizualizace mapy při různých úrovních zoomu
- Odstranění prázdných pruhů na okrajích mapy při maximálním oddálení
- Konzistentní zobrazení mapy při všech úrovních zoomu
- Vylepšený fullscreen režim s plynulými přechody a lepším uživatelským zážitkem
- Optimalizace ovládacích prvků v režimu celé obrazovky
- Vylepšené zobrazení popup oken v režimu celé obrazovky
- Zmenšení velikosti bodů na mapě z 40x40px na 32x32px pro čistší vzhled
- Odstranění efektu levitace bodů pro profesionálnější vzhled
- Optimalizace animací a efektů pro lepší výkon a vizualizaci
- Stabilizace trasy při zoomování a pohybu mapy

## [0.0.9] - 2025-04-18

### Přidáno
- Zcela přepracovaný design bodů na mapě s čísly a barevným rozlišením
- Pokročilé vizualizace bodů s 3D efekty, stíny a gradientovým pozadím
- Animace vznesení (floating) pro všechny body na mapě
- Efekt záře (glow) kolem bodů s pulzováním pro lepší viditelnost
- Efekt lesku (shine) uvnitř bodů pro realističtější vzhled
- Efekt vlny (ripple) kolem bodů pro zvýraznění jejich pozice
- Nová sekce v nastavení pro výběr stylu bodů na mapě
- 5 různých stylů bodů: kruh, čtverec, diamant, pin a hvězda
- Přepínač pro zapnutí/vypnutí animací a efektů bodů
- Ukládání a načítání nastavení bodů při spuštění aplikace

### Odstraněno
- Odstraněna nefunkční sekce "Design aplikace" z nastavení

## [0.0.8] - 2025-04-18

### Přidáno
- Přidán nový favicon pro lepší identifikaci aplikace v prohlížeči

### Změněno
- Změněn název aplikace z "AI Map - Časový Manažer" na "AI Map - Into the known"

## [0.0.7] - 2025-04-18

### Opraveno
- Opraveno chování popup oken při kliknutí na tlačítka - popup okna se nyní nezavírají při kliknutí na tlačítka "Upravit", "Uložit" nebo "Odstranit"
- Vylepšena detekce kliknutí na popup okno a jeho obsah - popup okna se nyní nezavírají při kliknutí kamkoliv do jejich obsahu
- Opraveno chování při přepnutí do režimu úprav - popup okno zůstává otevřené

## [0.0.6] - 2025-04-18

### Přidáno
- Přidávání bodů nyní funguje pomocí dvojkliku místo jednoduchého kliku
- Příkazy v chatu nyní fungují i po smazání bodů
- Možnost obnovení smazaných bodů při navigaci na jejich původní pozici
- Dva režimy zobrazení popup oken bodů: režim úprav a režim prohlížení
- Automatické zavření popup oken po 35 sekundách
- Automatické zavření popup oken při kliknutí kamkoliv mimo ně

### Vylepšeno
- Po uložení bodu se popup okno přepne do prohlížecího režimu místo zavření
- Prohlížecí režim popup okna zobrazuje přehledně všechny informace o bodu
- Přidáno tlačítko "Upravit" pro přepnutí zpět do režimu úprav
- Zobrazení názvu bodu v hlavičce popup okna místo generického "Bod X"
- Vylepšený design popup oken pro lepší uživatelský zážitek
- Skrytý odpočet v popup oknech pro čistší uživatelské rozhraní

## [0.0.5] - 2025-04-18

### Vylepšeno
- Kompletní redesign tlačítka pro zavření popup okna klubu Alexa
- Implementace vlastního tlačítka pro zavření popup okna, aby se nepřekrývalo s VIP odznakem
- Přidán efekt rotace při najetí myší na křížek
- Vylepšený vzhled popup okna s novým stínem a zaoblením
- Vylepšený vzhled tlačítka "Rezervovat" s animací při najetí myší
- Optimalizace pro tmavý režim s konzistentními barvami
- Vylepšené mezery a zarovnání všech prvků pro lepší symetrii

## [0.0.4] - 2025-04-18

### Přidáno
- Ukládání stavu aplikace do localStorage
- Automatické načtení posledního stavu při opětovném otevření aplikace
- Ukládání všech bodů na mapě včetně jejich vlastností
- Ukládání nastavení aplikace (tmavý režim, barevné schéma, design)

### Vylepšeno
- Kompletní redesign popup okna klubu Alexa pro lepší estetický dojem
- Přidány ikony pro jednotlivé informace (hodnocení, otevírací doba, adresa)
- Sjednocené barevné schéma v celém popup okně
- Optimalizováno chování popup oken při pohybu mapy
- Popup okna nyní zůstávají na svých pozicích při posunu mapy
- Vylepšena responzivita popup oken při změně velikosti obrazovky
- Optimalizováno zobrazení popup oken při různých úrovních zoomu

## [0.0.3] - 2025-04-18

### Opraveno
- Aktualizovány přesné souřadnice klubu Alexa v Rohatci na 48.8871713, 17.1931988
- Opraveno zobrazení popup okna klubu Alexa - nyní se zobrazuje na přesných souřadnicích klubu a zároveň je vycentrováno uprostřed mapy

### Přidáno
- Nový příkaz "oteviracidoba" pro zobrazení otevíracích dob obchodů v Hodoníně
- Podpora pro 2 pobočky Kaufland a 2 pobočky Albert v Hodoníně
- Zobrazení běžných otevíracích dob a speciálních otevíracích dob o svátcích 2025
- Možnost zobrazení obchodů na mapě s přesnými souřadnicemi
- Interaktivní popup okna s detaily o otevíracích dobách

### Vylepšeno
- Optimalizováno zobrazení popup okna pro příkaz "alexa"
- Skrytí markeru při zobrazení popup okna pro lepší vizualizaci
- Automatické zobrazení markeru po zavření popup okna
- Vylepšeno zobrazení popup okna klubu Alexa - nyní se zobrazuje na přesných souřadnicích klubu a zároveň je vycentrováno uprostřed mapy

## [0.0.2] - 2025-04-18

### Vylepšeno
- Optimalizováno zobrazení popup okna pro příkaz "alexa"
- Pevná velikost popup okna (320px šířka) pro lepší čitelnost při různých úrovních zoomu
- Zlepšeno zarovnání popup okna na středu mapy
- Optimalizace obsahu popup okna pro lepší čitelnost
- Přidán event listener pro udržení popup okna viditelného při změně zoomu
- Responzivní design pro mobilní zařízení (280px šířka)
- Implementována funkce pro navigaci na body pomocí příkazů v chatu
- Vylepšeno zobrazení kamery při navigaci na body (offset pro lepší viditelnost popup oken)
- Zvětšena mapa na výšku 600px pro více prostoru
- Upraven poměr sloupců pro čtvercovější tvar mapy
- Přidán příkaz "seznam bodů" nebo "ukaž body" pro zobrazení všech bodů a jejich příkazů
- Vylepšena funkce pro vymazání mapy, aby resetovala také pole markerProperties
- Aktualizovány souřadnice nočního klubu Alexa v Rohatci na přesnou adresu: Na Kopci 1055/54

## [0.0.1] - 2025-04-18

### Přidáno
- Základní mapové rozhraní s využitím Leaflet.js
- Možnost přidávat body na mapu kliknutím
- Automatické propojení bodů s výpočtem vzdálenosti a času cesty
- Popup okna pro body s možností pojmenování a přiřazení příkazu
- Chatovací rozhraní pro interakci s mapou
- Příkazy v chatu pro navigaci na body
- Speciální příkaz "alexa" pro vyhledání nočního klubu v Rohatci
- Formulář pro rezervaci tanečnice v nočním klubu
- Ukazatel souřadnic v levém dolním rohu mapy
- Fullscreen režim pro mapu
- Tmavý režim s optimalizací pro dobrou viditelnost
- Nastavení aplikace dostupné přes ikonu ozubeného kola

### Technické detaily
- Responzivní design pro různé velikosti obrazovek
- Automatické zavírání popup oken po 35 sekundách
- Možnost odstranění jednotlivých bodů
- Přepočítávání trasy při změně bodů
- Optimalizace pro tmavý režim
- Verzování pomocí Git a GitHub

### Poznámky
- První funkční verze aplikace
- Základní funkcionalita pro práci s mapou a body
- Implementace speciálních funkcí pro noční klub v Rohatci

### Vylepšeno
- Interaktivita bodů s pokročilými animacemi při kliknutí:
  - Záblesk (flash) při kliknutí pro okamžitou zpětnou vazbu
  - Rotace a zvětšení s plynulým přechodem
  - Zlatý okraj pro zvýraznění aktivního bodu
  - Pulzující záře pro zvýraznění vybraného bodu
- Interaktivita bodů při přesunutí:
  - Efekt vznesení (levitace) při přesunutí bodu
  - Dynamický stín pod přesouvaným bodem
  - Plynulé přechody mezi stavy s jemným odskočením
  - Postupný návrat do původního stavu po dokončení přesunutí
- Barevné rozlišení bodů s pokročilými gradienty a stíny
- Zobrazení čísel bodů s lepším kontrastem a čitelností
- Optimalizace animací pro plynulý chod i při větším počtu bodů
- Průhledné pozadí s efektem rozmazání pro modální okno nastavení
- Vylepšené styly pro hlavičku, tlačítka a další prvky v nastavení
- Animace a přechodové efekty pro lepší uživatelský zážitek v nastavení
- Speciální animace pro každý typ bodu (rotace hvězdy, vznášení diamantu, atd.)

# Vize a plán vývoje AIMapa - Nejlepší AI Mapový Systém na světě

## Hlavní cíle
- Vytvořit nejintuitivnější a nejpokročilejší AI mapový systém na světě
- Integrovat nejmodernější technologie umělé inteligence pro prediktivní navigaci
- Nabídnout bezkonkurenční uživatelský zážitek s důrazem na jednoduchost a efektivitu
- Vyvinout systém, který se adaptuje na potřeby uživatele a učí se z jeho chování

## Plán vývoje

### Krátkodobé cíle (0-6 měsíců)
- Dokončit základní funkce mapového rozhraní s intuitivním ovládáním
- Vylepšit design všech komponent pro profesionální vzhled
- Implementovat pokročilé chatovací rozhraní s podporou přirozené komunikace
- Optimalizovat výkon aplikace pro všechna zařízení
- Rozšířit databázi bodů zájmu s detailními informacemi

### Střednědobé cíle (6-12 měsíců)
- Implementovat pokročilé AI algoritmy pro predikci tras a dopravních situací
- Vyvinout systém pro automatické rozpoznávání a kategorizaci bodů zájmu
- Integrovat hlasové ovládání s podporou českého jazyka
- Vytvořit systém pro personalizované doporučení míst na základě preferencí uživatele
- Implementovat rozšířenou realitu pro vizualizaci navigačních pokynů

### Dlouhodobé cíle (1-3 roky)
- Vyvinout komplexní ekosystém propojený s dalšími službami (rezervace, recenze, sociální sítě)
- Implementovat autonomní plánování tras s ohledem na počasí, dopravní situaci a preference uživatele
- Vytvořit komunitní platformu pro sdílení bodů zájmu a tras
- Rozšířit podporu pro další jazyky a regiony
- Implementovat pokročilé 3D vizualizace terénu a budov

## Podrobný plán vývoje (Roadmap)

### Verze 0.1.0 (Duben 2025)
#### Mapové funkce
- Implementace omezení zoomu mapy pro zabránění příliš velkému oddálení
- Optimalizace zobrazení mapy při různých úrovních zoomu
- Odstranění prázdných pruhů na okrajích mapy při maximálním oddálení
- Nastavení hranic mapy pro konzistentní uživatelský zážitek
- Optimalizace zobrazení dlaždic s parametrem noWrap
- Stabilizace trasy při zoomování a pohybu mapy
- Zmenšení velikosti bodů na mapě pro čistší vzhled
- Odstranění efektu levitace bodů pro profesionálnější vzhled

#### Fullscreen režim
- Vylepšený fullscreen režim s plynulými přechody
- Přidán plovoucí chat do fullscreen režimu
- Možnost minimalizace a přesunutí chatu v režimu celé obrazovky
- Tlačítko pro rychlý návrat z fullscreen režimu
- Klávesová zkratka ESC pro opuštění fullscreen režimu
- Optimalizace ovládacích prvků v režimu celé obrazovky
- Vylepšené zobrazení popup oken v režimu celé obrazovky

### Verze 0.1.1 (Duben 2025)
#### Opravy a vylepšení
- Opraven nefunkční chat ve fullscreen režimu
- Přidána chybějící funkce processMessage pro zpracování zpráv z chatu
- Zlepšena synchronizace mezi hlavním a plovoucím chatem
- Optimalizovány event listenery pro odesílání zpráv

### Verze 0.1.2 (Duben 2025)
#### Vylepšení uživatelského rozhraní
- Upravena pozice plovoucího chatu ve fullscreen režimu pro lepší přístupnost
- Optimalizováno umístění chatu při přepínání mezi levou a pravou stranou obrazovky

### Verze 0.1.3 (Duben 2025)
#### Vylepšení ovládání ve fullscreen režimu
- Přidána tlačítka "Přidat aktivitu" a "Vymazat mapu" do fullscreen režimu
- Implementována synchronizace stavu mezi tlačítky v normálním a fullscreen režimu
- Optimalizováno zobrazení tlačítek pro různé velikosti obrazovky
- Vylepšena uživatelská přívětivost při práci s mapou v režimu celé obrazovky

### Verze 0.1.4 (Duben 2025)
#### Experimentální 3D režim
- Implementován 3D režim s vizualizací budov pomocí OSM Buildings
- Přidány ovládací prvky pro rotaci a náklon v 3D režimu
- Optimalizováno zobrazení 3D budov pro různé úrovně zoomu
- Implementována podpora pro 3D režim v chatu pomocí příkazů
- Přidáno tlačítko pro 3D režim do hlavního rozhraní i fullscreen módu
- Vylepšena vizualizace mapy s 3D budovami pro lepší orientaci v prostoru

### Verze 0.1.5 (Duben 2025)
#### Pokročilý 3D glóbus
- Implementován pokročilý 3D glóbus režim s možností rotace a manipulace s 3D koulí Země
- Implementovány pokročilé ovládací prvky pro rotaci, náklon a zoom glóbusu
- Přidána podpora pro glóbus režim v chatu pomocí příkazů
- Automatické přenášení bodů z 2D mapy na 3D glóbus s popup okny
- Implementována atmosféra a obloha pro realističtější vzhled glóbusu
- Optimalizováno zobrazení glóbusu pro různé velikosti obrazovky
- Přidáno tlačítko pro glóbus režim do hlavního rozhraní i fullscreen módu

### Verze 0.1.6 (Duben 2025)
#### Vylepšený 3D glóbus s Cesium.js
- Implementován vylepšený 3D glóbus režim pomocí knihovny Cesium.js
- Automatická synchronizace bodů mezi 2D mapou a 3D glóbusem
- Automatická aktualizace glóbusu při přidání nebo přesunutí bodů
- Vylepšené zobrazení bodů na glóbusu s popisky a popup okny
- Implementováno vykreslování tras mezi body na glóbusu
- Vylepšené ovládací prvky pro rotaci, náklon a zoom glóbusu
- Optimalizováno zobrazení glóbusu pro různé velikosti obrazovky
- Přidána podpora pro zobrazení terénu a atmosféry pro realističtější vzhled
- Opraveny problémy s nefunkčním 3D glóbusem v předchozí verzi

### Verze 0.1.7 (Duben 2025)
#### Oprava 3D glóbus režimu
- Opraven závažný problém s černou obrazovkou v 3D glóbus režimu
- Aktualizovány CDN odkazy na knihovnu Cesium.js pro lepší kompatibilitu
- Vylepšeny CSS styly pro správné zobrazení 3D glóbusu
- Optimalizována inicializace Cesium Vieweru pro lepší výkon
- Přidáno postupné načítání terénu pro stabilnější zobrazení
- Vylepšena viditelnost a z-index pro správné vrstvení prvků

### Verze 0.1.8 (Duben 2025)
#### Další vylepšení 3D glóbus režimu
- Opraven závažný problém s chybějící planetou v 3D glóbus režimu
- Odstraněny hvězdy na pozadí, které rušily zobrazení glóbusu
- Vylepšeno zobrazení markerů na glóbusu pomocí billboardů
- Vylepšeno zobrazení tras mezi body na glóbusu
- Optimalizováno nastavení kamery pro lepší pohled na glóbus
- Přidáno vynucené překreslení glóbusu pro zajištění správného zobrazení
- Vylepšeny CSS styly pro správné zobrazení všech komponent Cesium

### Verze 0.1.9 (Duben 2025)
#### Optimalizace uživatelského rozhraní
- Odstraněna tlačítka pro 3D a glóbus režim z hlavní stránky
- Tlačítka pro 3D a glóbus režim jsou nyní dostupná pouze ve fullscreen módu
- Vylepšeno zobrazení glóbusu pomocí dalších CSS stylů
- Optimalizována inicializace Cesium Vieweru pro lepší výkon
- Přidána další nastavení scény pro lepší zobrazení glóbusu
- Vylepšeno nastavení pozadí pro lepší kontrast a viditelnost

#### Plánované funkce pro verzi 0.2.0 (Květen 2025)
- Implementace pokročilého vyhledávání míst s automatickým doplňováním
- Přidání možnosti importu a exportu bodů ve formátech GPX, KML a GeoJSON
- Implementace měření vzdáleností a ploch pomocí nástroje pro kreslení
- Přidání vrstev pro zobrazení počasí, dopravních informací a turistických tras
- Optimalizace výpočtu tras pro různé typy dopravy (auto, kolo, pěšky)
- Kompletní redesign hlavního menu s intuitivními ikonami
- Implementace postranního panelu pro rychlý přístup k oblíbeným místům
- Vylepšení responzivity pro mobilní zařízení a tablety
- Rozšíření sady příkazů pro interakci s mapou
- Implementace kontextového rozpoznávání dotazů v přirozeném jazyce

### Verze 0.2.0 (Srpen 2025)
#### Pokročilé funkce pro práci s body
- Implementace kategorizace bodů s možností filtrování
- Přidání možnosti přidávat fotografie k bodům
- Implementace hodnocení a recenzí pro body zájmu
- Vytvoření systému pro sdílení bodů mezi uživateli
- Implementace časových štítků pro sledování změn v čase

#### Navigace a trasy
- Vylepšení algoritmu pro výpočet optimální trasy
- Implementace alternativních tras s možností porovnání
- Přidání hlasové navigace s pokyny v českém jazyce
- Implementace režimu navigace pro různé typy aktivit (turistika, cyklistika, běh)
- Přidání informací o převýšení a náročnosti trasy

#### Integrace dat
- Propojení s veřejnými databázemi bodů zájmu
- Implementace API pro získávání aktuálních informací o počasí
- Integrace s kalendářem pro plánování cest
- Přidání informací o veřejné dopravě v reálném čase
- Implementace geolokačních služeb pro přesnější určení polohy

### Verze 0.3.0 (Listopad 2025)
#### AI asistent
- Implementace pokročilého AI asistenta pro navigaci
- Vytvoření systému pro predikci cílů na základě historie uživatele
- Implementace personalizovaných doporučení míst
- Přidání kontextového rozpoznávání situace (např. dopravní zácpa, špatné počasí)
- Vytvoření systému pro automatické plánování výletů

#### Offline režim
- Implementace stahování map pro použití offline
- Optimalizace ukládání dat pro minimalizaci využití paměti
- Implementace synchronizace dat po opětovném připojení k internetu
- Přidání offline navigace s omezenými funkcemi
- Vytvoření systému pro prioritizaci dat při stahování

#### Rozšířená realita (AR)
- Implementace základních funkcí AR pro vizualizaci bodů zájmu
- Přidání AR navigace s šipkami v reálném prostředí
- Implementace rozpoznávání objektů pomocí kamery
- Vytvoření systému pro zobrazení informací o budovách a památkách
- Optimalizace AR pro různé světelné podmínky

### Verze 1.0.0 (Březen 2026)
#### Komunitní funkce
- Implementace uživatelských profilů a přátelství
- Vytvoření systému pro sdílení tras a bodů zájmu
- Implementace hodnocení a recenzí míst od komunity
- Přidání možnosti vytvářet veřejné a soukromé skupiny
- Implementace systému pro organizaci skupinových výletů

#### Pokročilá analýza dat
- Implementace statistik o pohybu a aktivitách uživatele
- Vytvoření systému pro analýzu populárních tras a míst
- Implementace prediktivních modelů pro dopravní situace
- Přidání nástrojů pro analýzu výkonů při sportovních aktivitách
- Vytvoření systému pro optimalizaci tras na základě historických dat

#### Ekosystém služeb
- Implementace rezervačního systému pro restaurace, hotely a atrakce
- Integrace s platebními systémy pro nákup vstupenek a služeb
- Vytvoření API pro vývojáře třetích stran
- Implementace pluginů pro rozšíření funkcionality
- Vytvoření systému pro synchronizaci dat mezi různými zařízeními

## Technologické inovace
- Využití pokročilé umělé inteligence k usnadnění navigace člověka na planetě
- Vytvoření inovativního uživatelského prostředí plného AI nástrojů
- Integrace mapového AI systému pro intuitivní a efektivní navigaci
- Implementace pokročilých algoritmů pro predikci a optimalizaci tras
- Využití strojového učení pro adaptaci systému na potřeby uživatele
- Vývoj AI asistentů pro různé typy navigace (městská, přírodní, turistická)
- Implementace pokročilé analýzy geografických dat v reálném čase

## Uživatelský zážitek
- Intuitivní a přehledné rozhraní přizpůsobené všem věkovým kategoriím
- Plynulé přechody mezi různými funkcemi aplikace
- Minimalistický design s důrazem na funkčnost
- Adaptivní rozhraní, které se přizpůsobuje potřebám uživatele
- Bezproblémová integrace s dalšími aplikacemi a službami


=======
>>>>>>> v0.3.8.3
