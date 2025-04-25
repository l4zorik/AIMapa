# Changelog

Všechny významné změny v projektu AIMapa budou dokumentovány v tomto souboru.

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
