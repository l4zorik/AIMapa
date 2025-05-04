# AIMapa - Kompletní dokumentace

Tato super-dokumentace slouží jako centrální rozcestník pro všechny dokumentační soubory projektu AIMapa. Najdete zde přehled všech dostupných dokumentů, jejich stručný popis a odkazy na ně.

**Aktuální verze aplikace: 0.3.8.7**

## Obsah

1. [Úvod a základní informace](#úvod-a-základní-informace)
2. [Struktura projektu](#struktura-projektu)
3. [Funkce a moduly](#funkce-a-moduly)
4. [Autentizace a uživatelské účty](#autentizace-a-uživatelské-účty)
5. [Monetizace a předplatné](#monetizace-a-předplatné)
6. [Integrace s externími službami](#integrace-s-externími-službami)
7. [Synchronizace dat](#synchronizace-dat)
8. [Offline režim](#offline-režim)
9. [Testování](#testování)
10. [Plány a vývoj](#plány-a-vývoj)
11. [Changelog](#changelog)

## Úvod a základní informace

AIMapa je webová aplikace, která kombinuje interaktivní mapu s funkcemi umělé inteligence a virtuální práce. Aplikace umožňuje uživatelům procházet interaktivní mapu, virtuálně pracovat, využívat AI asistenta, spravovat uživatelský profil a mnoho dalšího.

**Základní dokumenty:**
- [README.md](README.md) - Základní informace o projektu, instalace, technologie
- [CHANGELOG.md](CHANGELOG.md) - Historie změn v projektu

## Struktura projektu

Tato sekce obsahuje informace o struktuře projektu, organizaci souborů a adresářů.

**Dokumenty:**
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailní popis struktury projektu, přehled souborů a jejich účel

## Funkce a moduly

AIMapa obsahuje mnoho funkcí a modulů, které jsou popsány v následujících dokumentech.

**Stabilní moduly:**
- Základní mapové funkce
- Notifikace o aktualizacích
- Sledování postupu uživatele
- Glóbus režim
- Vyhledávání spojení
- Achievementy
- Virtuální práce
- Odměňovací systém
- Systém úkolů a denních questů
- Služby bydlení
- Služby jídla
- Lékařské služby
- Dopravní služby
- Načítání reálných dat podniků

**Dokumenty k jednotlivým funkcím:**
- [REWARD_SYSTEM_HOUSING.md](REWARD_SYSTEM_HOUSING.md) - Dokumentace k rozšíření systému odměn o kategorii bydlení
- [LLM-API-GUIDE.md](LLM-API-GUIDE.md) - Průvodce pro práci s LLM (Large Language Model) API
- [LLM-LOGGING.md](LLM-LOGGING.md) - Dokumentace systému logování komunikace s LLM API
- [MAP-PROVIDERS.md](MAP-PROVIDERS.md) - Dokumentace mapových poskytovatelů pro střední Evropu

## Autentizace a uživatelské účty

AIMapa používá Auth0 a Supabase pro autentizaci a správu uživatelských účtů.

**Dokumenty:**
- [AUTH0-GUIDE.md](AUTH0-GUIDE.md) - Průvodce pro práci s Auth0 autentizací

## Monetizace a předplatné

AIMapa nabízí několik úrovní předplatného a další monetizační funkce.

**Úrovně předplatného:**
1. **Zdarma**: Základní funkce
2. **Základní**: Rozšířené funkce
3. **Premium**: Pokročilé funkce
4. **Ultimate**: Všechny funkce

**Dokumenty:**
- [SUMMARY_MONETIZACE_DRAFT.md](SUMMARY_MONETIZACE_DRAFT.md) - Návrh monetizačního modelu s tokenovým systémem a odměnami
- [PRICING_MODEL.md](PRICING_MODEL.md) - Detailní popis cenového modelu pro LLM API včetně marže

**Implementované monetizační funkce:**
- Předplatné pomocí Stripe
- Mikrotransakce pro nákup prémiových funkcí
- Reklamní systém s různými typy reklam
- Tokenový systém pro měření a účtování využití API

## Integrace s externími službami

AIMapa je integrována s několika externími službami.

**Integrace:**
- **Auth0**: Primární poskytovatel autentizace s podporou sociálních přihlášení
- **Supabase**: Databáze a backend pro ukládání uživatelských dat
- **Stripe**: Platební brána pro zpracování plateb předplatného
- **Netlify**: Automatické nasazení aplikace

## Synchronizace dat

AIMapa podporuje synchronizaci dat mezi zařízeními.

**Dokumenty:**
- [DATA_SYNC_OVERVIEW.md](DATA_SYNC_OVERVIEW.md) - Přehled implementace synchronizace dat mezi zařízeními

## Offline režim

AIMapa podporuje offline režim, který umožňuje používat aplikaci bez připojení k internetu.

**Dokumenty:**
- [OFFLINE_MODE.md](OFFLINE_MODE.md) - Popis implementace offline režimu

## Testování

Tato sekce obsahuje informace o testování aplikace.

**Dokumenty:**
- [TESTING-GUIDE.md](TESTING-GUIDE.md) - Průvodce testováním implementace nového technologického stacku

## Plány a vývoj

Tato sekce obsahuje informace o plánech a vývoji aplikace.

**Dokumenty:**
- [PLAN.md](PLAN.md) - Plán řešení problémů a implementace nových funkcí
- [PROGRESS.md](PROGRESS.md) - Plán technologického rozvoje a přechodu na novější technologie
- [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md) - Konkrétní kroky pro implementaci krátkodobých cílů
- [MIGRATION.md](MIGRATION.md) - Návod na migraci na nový technologický stack

## Changelog

Historie změn v projektu je dokumentována v souboru [CHANGELOG.md](CHANGELOG.md).

**Poslední verze:**
- **0.3.8.7** - Přidání mikrotransakcí, předplatného a reklam
- **0.3.8.6** - Vylepšení dokumentace a stabilizace integrace
- **0.3.8.5** - Kompletní reorganizace kódu, vylepšená autentizace s Auth0 a Supabase, implementace předplatného pomocí Stripe

## Monetizace - Detailní popis

### Předplatné

AIMapa nabízí několik úrovní předplatného:

1. **Zdarma**
   - Základní funkce mapy
   - Omezený počet bodů na mapě (10)
   - Základní virtuální práce
   - Základní statistiky

2. **Základní (99 Kč/měsíc)**
   - Neomezený počet bodů na mapě
   - Rozšířená virtuální práce
   - Základní kryptoměny
   - Detailní statistiky
   - Bez reklam

3. **Premium (199 Kč/měsíc)**
   - Všechny funkce Základního plánu
   - Pokročilé statistiky a grafy
   - Vlastní motivy a barvy
   - Prioritní podpora
   - Rozšířené kryptoměny

4. **Ultimate (399 Kč/měsíc)**
   - Všechny funkce Premium plánu
   - Neomezené body na mapě
   - Neomezené projekty virtuální práce
   - AI asistent pro plánování
   - Přednostní přístup k novým funkcím
   - VIP podpora

### Mikrotransakce

AIMapa umožňuje nákup prémiových funkcí pomocí mikrotransakcí:

1. **Prémiové mapy**
   - Turistické mapy (49 Kč)
   - Satelitní mapy (79 Kč)
   - Offline balíček (99 Kč)

2. **Virtuální měna**
   - 100 kreditů (29 Kč)
   - 500 kreditů (129 Kč)
   - 1000 kreditů (249 Kč)

3. **Speciální funkce**
   - Pokročilé statistiky (69 Kč)
   - Vlastní motivy (39 Kč)
   - Rozšířené API (89 Kč)

### Reklamy

AIMapa obsahuje reklamní systém s různými typy reklam:

1. **Typy reklamních slotů**
   - Postranní panel mapy
   - Překrytí mapy
   - Výsledky vyhledávání
   - Celá obrazovka

2. **Nastavení reklam podle předplatného**
   - Zdarma: 100% reklam
   - Základní: 50% reklam
   - Premium a Ultimate: Bez reklam

3. **Detekce AdBlockeru**
   - Upozornění pro uživatele s AdBlockerem
   - Možnost zakoupení předplatného bez reklam

### Tokenový systém

AIMapa používá tokenový systém pro měření a účtování využití API:

1. **Získávání tokenů**
   - Nákup tokenů
   - Získávání v rámci předplatného
   - Odměnné tokeny za aktivní používání
   - Tokeny za přispívání do komunity

2. **Využití tokenů**
   - Každá akce v API spotřebovává určitý počet tokenů
   - Tokeny slouží jako jednotka pro měření a účtování využití API
   - Možnost výměny odměnných tokenů za kryptoměny

## Implementace monetizace

Monetizační funkce jsou implementovány v následujících souborech:

1. **Předplatné**
   - `public/app/subscription-service.js` - Hlavní modul pro správu předplatného
   - `public/app/services/subscription-service.js` - Služba pro správu předplatného
   - `routes/stripe.js` - API pro integraci se Stripe

2. **Mikrotransakce**
   - `public/app/map-init.js` - Implementace mikrotransakcí v mapě
   - `public/app/monetization.css` - Styly pro monetizační prvky

3. **Reklamy**
   - `public/app/advertisement-module.js` - Modul pro správu reklam
   - `public/app/advertisement-module.css` - Styly pro reklamní prvky

## Závěr

Tato super-dokumentace poskytuje přehled všech dostupných dokumentů projektu AIMapa. Pro detailnější informace o konkrétních tématech navštivte příslušné dokumenty.

**Poslední aktualizace: 2025-07-20**
