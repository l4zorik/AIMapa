# Changelog

Všechny významné změny v projektu AIMapa budou dokumentovány v tomto souboru.

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
