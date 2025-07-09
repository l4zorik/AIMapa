/**
 * Modul pro zobrazení novinek a aktualizací
 * Verze 0.3.8.5
 */

const UpdatesNotification = {
    // Aktuální verze aplikace
    currentVersion: '0.3.8.6',

    // Informace o aktualizacích
    updates: [
        {
            version: '0.3.8.6',
            date: '2025-07-09',
            title: 'VoiceBot a optimalizace aplikace',
            description: 'Přidán kompletní VoiceBot systém a provedena optimalizace celé aplikace',
            changes: [
                '🎤 Nový VoiceBot systém s rozpoznáváním řeči a syntézou řeči',
                '🗣️ Hlasové ovládání mapy (přiblíž, oddal, střed, fullscreen, glóbus)',
                '🧭 Hlasové navigační příkazy (vypočítej trasu, najdi místo)',
                '💼 Hlasové ovládání virtuální práce a úkolů',
                '🤖 Hlasový AI chat s přirozenou konverzací',
                '📊 Hlasové čtení achievementů a statistik',
                '🍔 Hlasové ovládání služeb (jídlo, taxi, lékařské služby)',
                '⚡ Optimalizace výkonu a vyčištění kódu',
                '🎨 Moderní responzivní design VoiceBot panelu',
                '⌨️ Klávesové zkratky (Ctrl+V, Ctrl+F, Ctrl+D, Ctrl+G)',
                '🌙 Plná podpora tmavého režimu pro VoiceBot',
                '📱 Optimalizace pro mobilní zařízení',
                '♿ Vylepšená přístupnost a podpora screen readerů'
            ]
        },
        {
            version: '0.3.8.5',
            date: '2025-07-20',
            title: 'Oprava formulářů a vylepšení zabezpečení',
            description: 'Oprava problémů s formuláři a vylepšení zabezpečení aplikace',
            changes: [
                'Opraveny chybějící ID a NAME atributy ve formulářích',
                'Přidány chybějící LABEL elementy k formulářovým polím',
                'Vylepšena Content Security Policy (CSP) pro lepší zabezpečení',
                'Přidána podpora pro unsafe-eval v CSP pro správné fungování JavaScriptu',
                'Opraveny problémy s načítáním externích zdrojů',
                'Vylepšena přihlašovací obrazovka a registrace uživatelů',
                'Optimalizace výkonu a opravy drobných chyb',
                'Aktualizace dokumentace a komentářů v kódu'
            ]
        },
        {
            version: '0.3.8.4',
            date: '2025-07-15',
            title: 'Oprava Content Security Policy a povinné přihlašování',
            description: 'Oprava problémů s načítáním externích knihoven a implementace povinného přihlašování',
            changes: [
                'Opraveny problémy s Content Security Policy (CSP) na Netlify',
                'Přidány chybějící domény do CSP pro načítání externích skriptů a stylů',
                'Opraveno načítání knihoven z cdn.jsdelivr.net a cesium.com',
                'Implementováno povinné přihlašování pro přístup k aplikaci',
                'Přidána registrace nových uživatelů s ověřením emailu',
                'Implementováno odhlašování uživatelů',
                'Přidána ochrana proti neoprávněnému přístupu k funkcím aplikace',
                'Vylepšena integrace s Supabase pro správu uživatelských účtů'
            ]
        },
        {
            version: '0.3.8.3',
            date: '2025-07-10',
            title: 'Oprava glóbus režimu a integrace Supabase',
            description: 'Oprava přepínání do glóbus režimu a dokončení integrace Supabase',
            changes: [
                'Opraveno přepínání do glóbus režimu, který se nyní správně zobrazuje',
                'Vylepšena detekce a načítání Globe.gl knihovny',
                'Přidána podpora pro různé varianty exportu Globe.gl knihovny',
                'Dokončena integrace s Supabase pro ukládání dat',
                'Přidána podpora pro PostgreSQL připojení',
                'Vylepšena stabilita aplikace při přepínání mezi režimy zobrazení',
                'Optimalizováno načítání externích knihoven',
                'Aktualizovány verze ve všech souborech pro konzistenci'
            ]
        },
        {
            version: '0.3.8.2',
            date: '2025-07-08',
            title: 'Oprava inicializace Leaflet.js a příprava pro nasazení',
            description: 'Oprava inicializace mapy a příprava aplikace pro produkční nasazení',
            changes: [
                'Opravena inicializace Leaflet.js pro spolehlivé načítání mapy',
                'Vyřešen problém s chybějícím souborem leaflet_js.js',
                'Vylepšeno pořadí načítání skriptů pro zajištění správné funkčnosti',
                'Přidána robustnější detekce a ošetření chyb při inicializaci mapy',
                'Optimalizováno načítání externích knihoven',
                'Aktualizovány verze ve všech souborech pro konzistenci',
                'Vylepšena stabilita aplikace pro nasazení na Netlify',
                'Příprava pro integraci s Supabase'
            ]
        },
        {
            version: '0.3.8.1',
            date: '2025-07-06',
            title: 'Stabilní verze s funkční mapou a Node.js serverem',
            description: 'Stabilní verze aplikace s funkční mapou a Node.js serverem',
            changes: [
                'Plně funkční mapa s Leaflet.js a správnou inicializací',
                'Spolehlivý Node.js server pro poskytování aplikace',
                'Funkční systém uživatelských účtů s lokálním přihlašováním',
                'Stabilní implementace virtuální práce a odměňovacího systému',
                'Optimalizace pro mobilní zařízení a různé prohlížeče'
            ]
        },
        {
            version: '0.3.8.0',
            date: '2025-07-05',
            title: 'Vylepšení systému XP a detekce nečinnosti',
            description: 'Rozšíření systému XP a přidání funkce nabídky práce při nečinnosti uživatele',
            changes: [
                'Rozšíření systému XP o nové kategorie a způsoby získávání XP',
                'Implementace detekce nečinnosti uživatele (5 sekund)',
                'Přidání nabídky práce při nečinnosti uživatele',
                'Propojení nabídky práce s dialogem nedokončených prací',
                'Vylepšení zobrazení stavu financí s kryptoměnami',
                'Přidání nových kryptoměn do finančního přehledu (ETH, DOGE, XRP)',
                'Automatické ukládání nedokončené práce při zavření dialogu křížkem nebo tlačítkem "Zrušit"',
                'Zachování pozice scrollování v menu virtuální práce i po obnovení stránky',
                'Implementace automatické aktualizace kurzů kryptoměn',
                'Přidání nových achievementů za práci s kryptoměnami',
                'Vylepšení vizuálního zobrazení XP a úrovní',
                'Optimalizace výkonu při získávání XP',
                'Přidání nových kategorií XP pro detailnější statistiky',
                'Vylepšení vzhledu nedokončených prací pro lepší čitelnost v tmavém režimu',
                'Přidání detailního zobrazení historie práce včetně seznamu úkolů a jejich stavu',
                'Opravena viditelnost bílých prvků v dialogu nedokončených prací'
            ]
        },
        {
            version: '1.0.0',
            date: '2025-07-01',
            title: 'První oficiální release',
            description: 'První oficiální stabilní verze aplikace s kompletní implementací všech plánovaných funkcí',
            changes: [
                'První oficiální stabilní verze aplikace',
                'Kompletní implementace všech plánovaných funkcí pro verzi 1.0',
                'Optimalizace výkonu a stability pro produkční nasazení',
                'Plná podpora pro všechny moderní prohlížeče',
                'Optimalizace pro mobilní zařízení',
                'Vylepšena celková stabilita aplikace',
                'Optimalizováno načítání aplikace pro rychlejší start',
                'Vylepšena správa paměti a výkon při dlouhodobém používání',
                'Sjednocen design všech dialogů a oken',
                'Vylepšen responzivní design pro různé velikosti obrazovky',
                'Aktualizována dokumentace s aktuálními informacemi',
                'Opraveno zpracování příkazů v menu příkazů',
                'Opraveny konflikty mezi moduly při zpracování příkazů',
                'Opraveny chyby v zobrazení na mobilních zařízeních',
                'Opraveny problémy s kompatibilitou v různých prohlížečích'
            ]
        },
        {
            version: '0.3.7.0',
            date: '2025-06-30',
            title: 'Příprava na ostrý release a přidání achievementů',
            description: 'Zahájení přípravy aplikace na ostrý release a přidání modulu achievementů',
            changes: [
                'Přidán nový modul pro správu a zobrazení achievementů',
                'Implementováno 10 základních achievementů v různých kategoriích',
                'Přidáno zobrazení notifikací o dokončení achievementů',
                'Implementováno filtrování achievementů podle kategorií',
                'Přidáno získávání odměn za dokončení achievementů (XP, peníze, quest body)',
                'Přidána položka "Achievementy" do menu příkazů v kategorii "Služby"',
                'Zahájení přípravy aplikace na ostrý release',
                'Vylepšení stability a výkonu aplikace',
                'Optimalizace pro mobilní zařízení',
                'Testování kompatibility s různými prohlížeči',
                'Aktualizace verzí ve všech souborech',
                'Aktualizace dokumentace projektu'
            ]
        },
        {
            version: '0.3.6.5',
            date: '2025-06-30',
            title: 'Přidání služby Bydlení',
            description: 'Přidán nový modul pro služby bydlení s nabídkami pronájmů, prodejů a spolubydlení',
            changes: [
                'Přidán nový modul pro služby bydlení s nabídkami pronájmů, prodejů a spolubydlení',
                'Implementovány tři kategorie: Pronájem, Prodej a Spolubydlení',
                'Přidáno vyhledávání nemovitostí podle názvu, adresy a popisu',
                'Implementována možnost kontaktování ohledně nemovitosti a přidání do oblíbených',
                'Přidáno získávání XP za používání služeb bydlení',
                'Implementována podpora tmavého režimu pro nové prvky'
            ]
        },
        {
            version: '0.3.6.0',
            date: '2025-06-25',
            title: 'Načítání reálných dat podniků z internetu a epická reorganizace souborů',
            description: 'Přidán modul pro načítání reálných dat podniků z internetu a kompletně přepracována struktura souborů',
            changes: [
                'Přidán nový modul pro načítání reálných dat podniků z internetu',
                'Implementováno rozhraní pro výběr oblasti a parametrů načítání',
                'Přidána podpora pro OpenStreetMap API pro získání aktuálních dat',
                'Implementováno mapování typů podniků z OSM na vlastní kategorie',
                'Kompletně přepracována struktura souborů pro maximální přehlednost',
                'Všechny soubory aplikace přesunuty do jediného adresáře public/app',
                'Přidána možnost otevřít menu příkazů trojitým kliknutím mimo mapu',
                'Přidána možnost přesouvat menu příkazů pomocí drag and drop'
            ]
        },
        {
            version: '0.3.3.0',
            date: '2025-06-08',
            title: 'Drag and drop úkolů a ukládání nedokončené práce',
            description: 'Přidána možnost přesouvat úkoly pomocí drag and drop a ukládat nedokončenou práci',
            changes: [
                'Přidána možnost přesouvat úkoly pomocí drag and drop',
                'Implementováno přidávání nových úkolů během práce',
                'Přidána možnost uložit nedokončenou práci a vrátit se k ní později',
                'Přidán banner s informací o nedokončené práci v hlavním menu',
                'Implementována notifikace o uložené práci',
                'Vylepšen progress bar, který se nyní aktualizuje podle dokončených úkolů',
                'Přidány vizuální efekty pro přetahování úkolů'
            ]
        },
        {
            version: '0.3.2.0',
            date: '2025-06-07',
            title: 'Vylepšení designu definování úkolů',
            description: 'Kompletně přepracovaný design okna pro definování úkolů s moderním vzhledem a animacemi',
            changes: [
                'Přidán nový CSS soubor pro definování úkolů s moderním designem',
                'Implementovány animace pro přidávání nových úkolů',
                'Přidáno číslování úkolů pro lepší přehlednost',
                'Implementována změna textu tlačítka "Začít pracovat" podle počtu úkolů',
                'Vylepšeny styly pro seznam úkolů s animacemi a stíny',
                'Přidány barevné přechody pro tlačítka a interaktivní prvky',
                'Implementovány vlastní scrollbary pro lepší uživatelský zážitek'
            ]
        },
        {
            version: '0.3.0.4',
            date: '2025-05-20',
            title: 'Virtuální cesta do práce',
            description: 'Přidána funkce pro virtuální práci s možností výdělku peněz',
            changes: [
                'Implementována funkce "Virtuální cesta do práce" dostupná přes menu příkazů',
                'Možnost přidávat a spravovat pracoviště s různými typy práce',
                'Výpočet výdělku na základě vzdělání, zkušeností a typu práce',
                'Různé možnosti dopravy do práce s výpočtem nákladů',
                'Statistiky odpracovaných hodin a celkového výdělku',
                'Kariérní postup s úrovněmi a dovednostmi',
                'Integrace s existujícím systémem peněz a XP'
            ]
        },
        {
            version: '0.2.9.3',
            date: '2025-05-13',
            title: 'Přesunutelné prvky rozhraní',
            description: 'Přidána možnost přesouvat všechny prvky uživatelského rozhraní (chat, ukazatele peněz a bitcoinu)',
            changes: [
                'Přidána možnost přesouvat všechny prvky uživatelského rozhraní (chat, ukazatele peněz a bitcoinu)',
                'Implementován obecný modul pro přesouvatelnost prvků s ukládáním pozic',
                'Přidána možnost minimalizace chatu a ukazatelů peněz/bitcoinu',
                'Vylepšen design hlaviček přesunutelných prvků pro lepší uživatelský zážitek'
            ]
        },
        {
            version: '0.2.9.2',
            date: '2025-05-12',
            title: 'Vylepšení ukazatelů peněz a bitcoinu',
            description: 'Vylepšeno uspořádání ukazatelů peněz a bitcoinu pro lepší čitelnost a zabránění překrývání',
            changes: [
                'Vylepšeno uspořádání ukazatelů peněz a bitcoinu pro lepší čitelnost',
                'Změněno vertikální uspořádání na horizontální pro úsporu místa',
                'Přidány CSS styly pro lepší zarovnání a zabránění překrývání',
                'Optimalizováno zobrazení pro různé velikosti obrazovky'
            ]
        },
        {
            version: '0.2.9.1',
            date: '2025-05-11',
            title: 'Přidání ukazatele bitcoinu',
            description: 'Přidán ukazatel bitcoinu vedle ukazatele peněz s výchozí hodnotou 0.05 BTC',
            changes: [
                'Přidán ukazatel bitcoinu vedle ukazatele peněz s výchozí hodnotou 0.05 BTC',
                'Implementovány metody pro přidávání a odebírání bitcoinu',
                'Přidáno získávání XP za získání bitcoinu',
                'Vylepšen design ukazatele peněz a bitcoinu s barevným rozlišením'
            ]
        },
        {
            version: '0.2.9',
            date: '2025-05-10',
            title: 'Vylepšení přístupu k novinkám a aktualizacím',
            description: 'Odstranění zvonečku pro novinky a přidání možnosti zobrazení novinek přes menu příkazů',
            changes: [
                'Odstraněn zvoneček pro novinky z pravého horního rohu',
                'Přidána možnost zobrazení novinek přes menu příkazů',
                'Upravena pozice ukazatele peněz, aby se nepřekrýval s jinými prvky',
                'Vylepšeno zobrazení souhvězdí na obloze v režimu glóbusu'
            ]
        },
        {
            version: '0.2.8.7.4',
            date: '2025-05-04',
            title: 'Oprava menu příkazů ve fullscreen režimu a dotazník zpětné vazby',
            description: 'Kompletní přepracování inicializace menu příkazů a přidání dotazníku zpětné vazby',
            changes: [
                'Přidán dotazník zpětné vazby o používání aplikace',
                'Přidán dialog pro odmítnutí dotazníku s možností uvést důvod',
                'Přidán soubor PROJECT_STRUCTURE.md s přehledem souborů v projektu',
                'Opravena inicializace menu příkazů při načtení stránky',
                'Opravena funkce tlačítka menu příkazů ve fullscreen režimu',
                'Vylepšena detekce fullscreen režimu',
                'Přidáno automatické vytvoření menu příkazů, pokud neexistuje',
                'Přidáno záložní řešení pro případ, že není nalezen chat-input'
            ]
        },
        {
            version: '0.2.8.7.3',
            date: '2025-05-03',
            title: 'Vylepšení menu příkazů a ikony aktualizací',
            description: 'Kompletní přepracování menu příkazů a ikony aktualizací',
            changes: [
                'Přidáno překrytí při zobrazení menu příkazů',
                'Menu příkazů nyní zobrazeno uprostřed obrazovky',
                'Přidána ikona aktualizací v pravém horním rohu',
                'Vylepšeny animace a efekty pro menu příkazů',
                'Opravena inicializace menu příkazů a ikony aktualizací'
            ]
        },
        {
            version: '0.2.8.7.2',
            date: '2025-05-02',
            title: 'Oprava zobrazení menu příkazů',
            description: 'Opraveno zobrazení menu příkazů z chatu a vylepšeny animace',
            changes: [
                'Opraveno zobrazení menu příkazů z chatu',
                'Vylepšeno tlačítko pro zobrazení menu příkazů',
                'Přidány lepší animace a efekty pro menu příkazů',
                'Opravena inicializace menu příkazů při načtení stránky'
            ]
        },
        {
            version: '0.2.8.7.1',
            date: '2025-05-01',
            title: 'Nové funkce a vylepšení menu příkazů',
            description: 'Přidány nové funkce a vylepšeno menu příkazů',
            changes: [
                'Přidána funkce "Chci jít do práce" pro vytvoření trasy do práce a správu úkolů',
                'Přidány nové služby: taxi, zubař, lékař a úřad práce',
                'Přidáno funkční scrollování v menu příkazů',
                'Opraveno zobrazení menu příkazů z chatu',
                'Přidány nové kategorie XP: Práce a úkoly, Asistenti a služby, Zábava',
                'Přidána základní podpora pro rapové akce'
            ]
        },
        {
            version: '0.2.8.7.0',
            date: '2025-04-30',
            title: 'Vylepšení menu příkazů a nové funkce',
            description: 'Kompletní redesign menu příkazů a přidání nových funkcí',
            changes: [
                'Kompletní redesign menu příkazů s kategoriemi a vyhledáváním',
                'Přidán hlasový asistent Alexa pro hlasové ovládání aplikace',
                'Implementována funkce pro zobrazení otevírací doby obchodů a služeb v okolí',
                'Přidána detekce aktuálně otevřených míst s filtrováním podle kategorií',
                'Rozšířen systém XP a achievementů o novou kategorii "Asistenti a služby"'
            ]
        },
        {
            version: '0.2.8.6.9',
            date: '2025-04-29',
            title: 'Vyhledávání spojení veřejnou dopravou',
            description: 'Přidána funkce pro vyhledávání spojení veřejnou dopravou mezi Hodonínem a Hruškami',
            changes: [
                'Implementováno vyhledávání spojení veřejnou dopravou mezi Hodonínem a Hruškami',
                'Zobrazení vlakových a autobusových spojení s reálnými časy',
                'Automatická aktualizace spojení v pravidelných intervalech',
                'Přidány nové achievementy za vyhledávání spojení',
                'Implementována nová kategorie XP "Vyhledávání spojení"'
            ]
        },
        {
            version: '0.2.8.6.3',
            date: '2024-04-23',
            title: 'Nové funkce pro mapu a chat',
            description: 'Přidány exotické funkce a systém XP s achievementy',
            changes: [
                'Přidána funkce pro zobrazení příběhů a legend z aktuální oblasti',
                'Implementována funkce pro zobrazení místních specialit a gastronomických tipů',
                'Přidán systém XP a levelů pro gamifikaci aplikace',
                'Implementován systém achievmentů za objevování nových míst',
                'Přidán profil uživatele s přehledem úrovně a získaných achievmentů'
            ]
        },
        {
            version: '0.2.8.6.1',
            date: '2024-04-22',
            title: 'Vylepšení menu příkazů',
            description: 'Vylepšení zobrazení menu příkazů a přidání premium nabídky',
            changes: [
                'Vylepšeno zobrazení menu příkazů - nyní se zobrazuje uprostřed obrazovky',
                'Přidány animace pro plynulé zobrazení a skrytí menu',
                'Přidána nová položka "Premium verze" do menu příkazů',
                'Implementován modal s nabídkou premium funkcí',
                'Zajištěno správné fungování ve fullscreen režimu'
            ]
        },
        {
            version: '0.2.8.6',
            date: '2024-04-21',
            title: 'Menu příkazů vedle chatu',
            description: 'Přidáno menu příkazů a informace o novinkách',
            changes: [
                'Implementováno nové menu příkazů vedle chatu',
                'Přidáno tlačítko pro zobrazení/skrytí menu příkazů',
                'Přidána ikona v pravém horním rohu pro zobrazení informací o aktualizacích',
                'Vytvořen systém pro správu a zobrazení oznámení o aktualizacích',
                'Optimalizováno zobrazení ve fullscreen režimu'
            ]
        },
        {
            version: '0.2.8.5',
            date: '2024-04-20',
            title: 'Oprava inicializace aplikace',
            description: 'Opravy chyb a stabilizace aplikace',
            changes: [
                'Opraven problém s inicializací aplikace',
                'Implementován robustní systém pro zajištění správného pořadí inicializace',
                'Optimalizována práce s DOM elementy pro lepší výkon',
                'Vylepšena správa event listenerů pro prevenci memory leaks',
                'Vylepšena kompatibilita s různými prohlížeči a zařízeními'
            ]
        },
        {
            version: '0.2.8.4',
            date: '2024-04-20',
            title: 'Optimalizace výpočtu tras a vylepšení systému příkazů',
            description: 'Pokročilé algoritmy pro výpočet tras a inteligentní systém příkazů',
            changes: [
                'Implementace algoritmu Contraction Hierarchies pro rychlejší výpočet tras',
                'Podpora více typů dopravy s optimalizací pro každý typ',
                'Vyhledávání alternativních tras s různými parametry',
                'Implementace pokročilého NLP pro lepší porozumění přirozenému jazyku',
                'Kategorizované menu příkazů s možností rychlého přístupu'
            ]
        },
        {
            version: '0.2.7.4',
            date: '2024-04-20',
            title: 'Vylepšení AI chatu s návrhy dalších akcí',
            description: 'Přidány návrhy dalších akcí v chatovacím rozhraní',
            changes: [
                'Implementovány klikatelné návrhy akcí pod každou zprávou AI asistenta',
                'Návrhy akcí se dynamicky mění podle kontextu konverzace',
                'Vylepšen design chatovacího rozhraní pro lepší přehlednost',
                'Optimalizováno zobrazení návrhů akcí v plovoucím chatu ve fullscreen režimu',
                'Vylepšena uvítací zpráva s návrhy nejpoužívanějších akcí'
            ]
        },
        {
            version: '0.2.7.0',
            date: '2024-04-20',
            title: 'Vylepšení glóbus režimu',
            description: 'Přidáno tlačítko pro návrat z glóbus režimu',
            changes: [
                'Přidáno tlačítko pro návrat z glóbus režimu zpět na 2D mapu',
                'Vylepšeny CSS styly pro tlačítka glóbus režimu',
                'Optimalizováno přepínání mezi glóbus režimem a 2D mapou',
                'Zobrazení trasy z klasické mapy na glóbusu',
                'Optimalizace dlouhých tras na glóbusu'
            ]
        },
        {
            version: '0.2.5.0',
            date: '2024-04-21',
            title: 'Zjednodušený glóbus režim',
            description: 'Experimentální implementace glóbus režimu',
            changes: [
                'Implementace interaktivního 3D glóbusu s využitím knihovny Three.js',
                'Vytvoření základního rozhraní pro 3D glóbus',
                'Implementace základních funkcí pro rotaci a animaci glóbusu',
                'Přidání hvězdného pozadí pro lepší vizualizaci',
                'Integrace knihovny Globe.gl pro lepší zobrazení'
            ]
        },
        {
            version: '0.1.0',
            date: '2024-04-18',
            title: 'Omezení zoomu mapy a fullscreen režim',
            description: 'Vylepšení zobrazení mapy a implementace fullscreen režimu',
            changes: [
                'Implementováno omezení zoomu mapy pro zabránění příliš velkému oddálení',
                'Nastavení hranic mapy pro konzistentní uživatelský zážitek',
                'Přidán plovoucí chat do fullscreen režimu',
                'Přidáno tlačítko pro rychlý návrat z fullscreen režimu',
                'Optimalizace ovládacích prvků v režimu celé obrazovky'
            ]
        },
        {
            version: '0.0.9',
            date: '2024-04-18',
            title: 'Nový design bodů na mapě',
            description: 'Zcela přepracovaný design bodů na mapě',
            changes: [
                'Nový design bodů na mapě s čísly a barevným rozlišením',
                'Pokročilé vizualizace bodů s 3D efekty, stíny a gradientovým pozadím',
                'Animace vznesení (floating) pro všechny body na mapě',
                'Nová sekce v nastavení pro výběr stylu bodů na mapě',
                '5 různých stylů bodů: kruh, čtverec, diamant, pin a hvězda'
            ]
        },
        {
            version: '0.0.1',
            date: '2024-04-18',
            title: 'První verze aplikace',
            description: 'Základní funkce pro práci s mapou a body',
            changes: [
                'Základní mapové rozhraní s využitím Leaflet.js',
                'Možnost přidávat body na mapu kliknutím',
                'Automatické propojení bodů s výpočtem vzdálenosti a času cesty',
                'Chatovací rozhraní pro interakci s mapou',
                'Příkazy v chatu pro navigaci na body'
            ]
        }
    ],

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu novinek...');

        // Vytvoření ikony novinek
        this.createUpdatesIcon();

        // Kontrola, zda je potřeba zobrazit informace o aktualizaci
        this.checkForUpdateNotification();

        console.log('Modul novinek byl inicializován');
    },

    // Vytvoření ikony novinek - funkce odstraněna, ikona se již nezobrazuje
    createUpdatesIcon() {
        // Funkce byla odstraněna, ikona se již nezobrazuje
        // Novinky jsou nyní dostupné pouze přes menu příkazů
        console.log('Ikona novinek byla odstraněna, novinky jsou dostupné přes menu příkazů');
    },

    // Kontrola, zda je potřeba zobrazit informace o aktualizaci
    checkForUpdateNotification() {
        // Získání poslední zobrazené verze z localStorage
        const lastShownVersion = localStorage.getItem('aiMapaLastShownVersion');

        // Pokud je aktuální verze novější než poslední zobrazená, zobrazíme informace o aktualizaci
        if (!lastShownVersion || this.compareVersions(this.currentVersion, lastShownVersion) > 0) {
            // Zobrazení informací o aktualizaci
            this.showUpdateNotification();

            // Uložení aktuální verze jako poslední zobrazené
            localStorage.setItem('aiMapaLastShownVersion', this.currentVersion);
        }
    },

    // Zobrazení informací o aktualizaci
    showUpdateNotification() {
        // Získání informací o aktuální verzi
        const currentVersionInfo = this.updates.find(update => update.version === this.currentVersion);

        if (!currentVersionInfo) {
            return;
        }

        // Odstranění existujícího oznámení, pokud existuje
        const existingNotification = document.querySelector('.update-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'update-notification';

        notification.innerHTML = `
            <div class="update-notification-header">
                <div class="update-notification-title">
                    <i class="icon">🚀</i> Nová verze ${currentVersionInfo.version}
                </div>
                <button class="update-notification-close">&times;</button>
            </div>
            <div class="update-notification-content">
                <h3>${currentVersionInfo.title}</h3>
                <p>${currentVersionInfo.description}</p>
                <ul>
                    ${currentVersionInfo.changes.map(change => `<li>${change}</li>`).join('')}
                </ul>
                <button class="update-notification-details">Zobrazit všechny aktualizace</button>
            </div>
        `;

        // Přidání oznámení do dokumentu
        document.body.appendChild(notification);

        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 1000);

        // Přidání event listenerů
        const closeButton = notification.querySelector('.update-notification-close');
        const detailsButton = notification.querySelector('.update-notification-details');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
        }

        if (detailsButton) {
            detailsButton.addEventListener('click', () => {
                // Zobrazení modalu se všemi aktualizacemi
                this.showUpdatesModal();

                // Zavření oznámení
                notification.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    notification.remove();
                }, 500);
            });
        }
    },

    // Zobrazení modalu s aktualizacemi
    showUpdatesModal() {
        // Odstranění existujícího modalu, pokud existuje
        const existingModal = document.getElementById('updatesModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'updatesModal';
        modal.className = 'updates-modal';

        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="updates-modal-content">
                <div class="updates-modal-header">
                    <h2>Novinky a aktualizace</h2>
                    <button class="updates-modal-close">&times;</button>
                </div>
                <div class="updates-modal-body">
                    <div class="updates-info">
                        <div class="updates-version">
                            <strong>Aktuální verze:</strong> ${this.currentVersion}
                        </div>
                    </div>

                    <div class="updates-list">
                        <h3>Historie aktualizací</h3>
                        <div class="updates-items">
                            ${this.updates.map(update => `
                                <div class="update-item">
                                    <div class="update-header">
                                        <div class="update-version">v${update.version}</div>
                                        <div class="update-date">${update.date}</div>
                                    </div>
                                    <div class="update-title">${update.title}</div>
                                    <div class="update-description">${update.description}</div>
                                    <ul class="update-changes">
                                        ${update.changes.map(change => `<li>${change}</li>`).join('')}
                                    </ul>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Přidání modalu do dokumentu
        document.body.appendChild(modal);

        // Animace zobrazení
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);

        // Přidání event listenerů
        const closeButton = modal.querySelector('.updates-modal-close');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }

        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');

                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    },

    // Porovnání verzí
    compareVersions(version1, version2) {
        const parts1 = version1.split('.').map(Number);
        const parts2 = version2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;

            if (part1 > part2) {
                return 1;
            } else if (part1 < part2) {
                return -1;
            }
        }

        return 0;
    }
};

// Inicializace modulu je nyní přímo v index.html
