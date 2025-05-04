# Implementační plán krátkodobých cílů

Tento dokument obsahuje konkrétní kroky pro implementaci krátkodobých cílů (0-6 měsíců) definovaných v dokumentu PROGRESS.md. Plán je rozdělen do jednotlivých oblastí a obsahuje konkrétní úkoly, časové odhady a závislosti.

## Frontend

### Přechod na ES6+ a moduly

#### Úkoly:
1. **Analýza současného kódu** (1 týden)
   - Identifikace všech JavaScript souborů
   - Analýza závislostí mezi soubory
   - Identifikace problematických částí kódu

2. **Refaktoring kódu na ES6+** (3 týdny)
   - Přepsání funkcí na arrow funkce
   - Implementace let/const místo var
   - Využití template literals
   - Implementace destructuring
   - Využití spread/rest operátorů

3. **Implementace modulárního systému** (2 týdny)
   - Rozdělení kódu do modulů
   - Implementace import/export
   - Vytvoření struktury modulů

4. **Testování a ladění** (2 týdny)
   - Vytvoření testů pro novou implementaci
   - Testování kompatibility v různých prohlížečích
   - Oprava nalezených chyb

#### Závislosti:
- Žádné externí závislosti

#### Výstupy:
- Modernizovaný JavaScript kód využívající ES6+ funkce
- Modulární struktura kódu
- Dokumentace nové struktury kódu

### Implementace SASS a CSS Modules

#### Úkoly:
1. **Nastavení SASS** (1 týden)
   - Instalace SASS
   - Konfigurace SASS
   - Vytvoření struktury SASS souborů

2. **Migrace CSS na SASS** (2 týdny)
   - Převod existujících CSS souborů na SASS
   - Implementace proměnných pro barvy, fonty, atd.
   - Implementace mixins pro opakující se styly
   - Implementace nested selektorů

3. **Implementace CSS Modules** (2 týdny)
   - Konfigurace CSS Modules
   - Refaktoring stylů pro použití s CSS Modules
   - Implementace lokálních a globálních stylů

4. **Testování a ladění** (1 týden)
   - Testování stylů v různých prohlížečích
   - Optimalizace velikosti CSS souborů
   - Oprava nalezených chyb

#### Závislosti:
- Webpack (pro CSS Modules)

#### Výstupy:
- SASS struktura s proměnnými, mixins a nested selektory
- CSS Modules pro lokální scoping stylů
- Optimalizované CSS soubory

### Implementace Webpack

#### Úkoly:
1. **Nastavení Webpack** (1 týden)
   - Instalace Webpack a potřebných pluginů
   - Vytvoření základní konfigurace
   - Nastavení development a production módů

2. **Konfigurace loaderů** (1 týden)
   - Konfigurace Babel loaderu pro ES6+
   - Konfigurace SASS/CSS loaderů
   - Konfigurace file loaderů pro obrázky a fonty

3. **Optimalizace buildu** (1 týden)
   - Implementace code splitting
   - Minimalizace JavaScript a CSS
   - Optimalizace obrázků
   - Implementace tree shaking

4. **Integrace s vývojovým workflow** (1 týden)
   - Nastavení hot module replacement
   - Konfigurace dev serveru
   - Integrace s linting nástrojem

#### Závislosti:
- Node.js

#### Výstupy:
- Webpack konfigurace pro development a production
- Optimalizovaný build proces
- Dokumentace build procesu

### Základní implementace PWA

#### Úkoly:
1. **Analýza požadavků pro PWA** (1 týden)
   - Identifikace klíčových funkcí pro offline použití
   - Analýza dat, která je potřeba cachovat
   - Definice strategie cachování

2. **Implementace Service Worker** (2 týdny)
   - Vytvoření základního Service Workeru
   - Implementace cachování statických souborů
   - Implementace strategie pro API požadavky

3. **Vytvoření Web App Manifestu** (1 týden)
   - Definice ikon pro různé velikosti
   - Nastavení barev a tématu
   - Konfigurace display módu a orientace

4. **Testování a ladění** (1 týden)
   - Testování offline funkcionality
   - Testování instalace na domovskou obrazovku
   - Oprava nalezených chyb

#### Závislosti:
- Webpack (pro generování Service Workeru)

#### Výstupy:
- Základní PWA funkcionalita
- Service Worker pro cachování
- Web App Manifest

## Backend

### Implementace Fastify vedle Express

#### Úkoly:
1. **Analýza současného Express API** (1 týden)
   - Identifikace všech endpointů
   - Analýza middleware
   - Identifikace problematických částí kódu

2. **Nastavení Fastify** (1 týden)
   - Instalace Fastify a potřebných pluginů
   - Vytvoření základní konfigurace
   - Implementace společných middleware

3. **Migrace vybraných endpointů na Fastify** (3 týdny)
   - Identifikace endpointů vhodných pro migraci
   - Implementace endpointů ve Fastify
   - Zajištění kompatibility s existujícím API

4. **Testování a ladění** (2 týdny)
   - Vytvoření testů pro nové endpointy
   - Testování výkonu
   - Oprava nalezených chyb

#### Závislosti:
- Node.js

#### Výstupy:
- Fastify server běžící vedle Express
- Migrace vybraných endpointů
- Dokumentace nové API struktury

### Implementace Redis pro cachování

#### Úkoly:
1. **Nastavení Redis** (1 týden)
   - Instalace a konfigurace Redis
   - Vytvoření klientské knihovny
   - Implementace základních operací

2. **Implementace cachování pro LLM API** (2 týdny)
   - Identifikace vhodných dat pro cachování
   - Implementace cachování odpovědí
   - Nastavení TTL pro různé typy dat

3. **Implementace cachování pro mapové API** (2 týdny)
   - Cachování mapových dlaždic
   - Cachování vyhledávacích dotazů
   - Implementace invalidace cache

4. **Testování a ladění** (1 týden)
   - Testování výkonu s a bez cache
   - Testování správnosti cachovaných dat
   - Oprava nalezených chyb

#### Závislosti:
- Redis server

#### Výstupy:
- Redis integrace pro cachování
- Optimalizované API požadavky
- Dokumentace cachování

## Hosting a infrastruktura

### Migrace na AWS

#### Úkoly:
1. **Nastavení AWS účtu a IAM** (1 týden)
   - Vytvoření AWS účtu
   - Nastavení IAM uživatelů a rolí
   - Implementace bezpečnostních politik

2. **Migrace frontendu na S3 a CloudFront** (2 týdny)
   - Vytvoření S3 bucketu
   - Konfigurace CloudFront distribuce
   - Nastavení HTTPS
   - Implementace CI/CD pro nasazení

3. **Migrace backendu na Lambda** (3 týdny)
   - Refaktoring backendu pro serverless
   - Vytvoření Lambda funkcí
   - Konfigurace API Gateway
   - Implementace CI/CD pro nasazení

4. **Nastavení databáze** (2 týdny)
   - Migrace dat z Supabase do AWS RDS
   - Konfigurace zabezpečení
   - Implementace zálohování

5. **Testování a ladění** (2 týdny)
   - Testování výkonu
   - Testování škálovatelnosti
   - Oprava nalezených chyb

#### Závislosti:
- AWS účet
- Znalost AWS služeb

#### Výstupy:
- Frontend hostovaný na S3 a CloudFront
- Backend běžící na Lambda
- Databáze v AWS RDS
- CI/CD pipeline pro nasazení

### Kontejnerizace aplikace

#### Úkoly:
1. **Vytvoření Dockerfile pro frontend** (1 týden)
   - Vytvoření Dockerfile
   - Optimalizace velikosti image
   - Implementace multi-stage buildu

2. **Vytvoření Dockerfile pro backend** (1 týden)
   - Vytvoření Dockerfile
   - Optimalizace velikosti image
   - Implementace multi-stage buildu

3. **Nastavení Docker Compose** (1 týden)
   - Vytvoření docker-compose.yml
   - Konfigurace služeb
   - Nastavení volumes a networks

4. **Implementace CI/CD s GitHub Actions** (2 týdny)
   - Vytvoření workflow pro build a test
   - Implementace automatického nasazení
   - Nastavení notifikací

5. **Testování a ladění** (1 týden)
   - Testování v kontejnerizovaném prostředí
   - Testování CI/CD pipeline
   - Oprava nalezených chyb

#### Závislosti:
- Docker
- GitHub Actions

#### Výstupy:
- Dockerizovaná aplikace
- Docker Compose pro lokální vývoj
- CI/CD pipeline s GitHub Actions

## LLM modely a AI

### Optimalizace nákladů na LLM API

#### Úkoly:
1. **Analýza současného využití LLM API** (1 týden)
   - Analýza počtu požadavků
   - Analýza nákladů
   - Identifikace nejčastějších dotazů

2. **Implementace pokročilého cachování** (2 týdny)
   - Implementace Redis pro cachování odpovědí
   - Nastavení TTL pro různé typy dotazů
   - Implementace invalidace cache

3. **Implementace embeddings pro vyhledávání** (3 týdny)
   - Vytvoření embeddings pro často kladené dotazy
   - Implementace vektorového vyhledávání
   - Integrace s existujícím LLM API

4. **Implementace vlastního fine-tunovaného modelu** (4 týdny)
   - Sběr dat pro fine-tuning
   - Fine-tuning modelu pro často kladené dotazy
   - Integrace modelu do aplikace

5. **Testování a ladění** (2 týdny)
   - Testování přesnosti odpovědí
   - Testování nákladů
   - Oprava nalezených chyb

#### Závislosti:
- Redis
- Vektorová databáze (např. Pinecone)
- Přístup k API pro fine-tuning

#### Výstupy:
- Optimalizované náklady na LLM API
- Rychlejší odpovědi díky cachování
- Vlastní fine-tunovaný model pro často kladené dotazy

### Rozšíření podporovaných modelů

#### Úkoly:
1. **Implementace podpory pro Mistral AI** (2 týdny)
   - Vytvoření providera pro Mistral AI
   - Integrace s existujícím LLM Service
   - Testování a ladění

2. **Implementace podpory pro Llama 3** (2 týdny)
   - Vytvoření providera pro Llama 3
   - Integrace s existujícím LLM Service
   - Testování a ladění

3. **Implementace automatického výběru modelu** (3 týdny)
   - Vytvoření klasifikátoru pro typy dotazů
   - Implementace logiky pro výběr modelu
   - Testování a ladění

4. **Aktualizace UI pro výběr modelu** (1 týden)
   - Aktualizace dropdown menu
   - Implementace informací o modelech
   - Testování a ladění

#### Závislosti:
- Přístup k API Mistral AI
- Přístup k API Llama 3

#### Výstupy:
- Podpora pro Mistral AI a Llama 3
- Automatický výběr modelu podle typu dotazu
- Aktualizované UI pro výběr modelu

## Funkce mapy

### Implementace offline režimu

#### Úkoly:
1. **Analýza požadavků pro offline režim** (1 týden)
   - Identifikace klíčových funkcí pro offline použití
   - Analýza dat, která je potřeba cachovat
   - Definice strategie cachování

2. **Implementace cachování mapových dlaždic** (3 týdny)
   - Implementace Service Workeru pro cachování dlaždic
   - Vytvoření UI pro výběr oblastí k cachování
   - Implementace správy cachovaných oblastí

3. **Implementace offline funkcionality** (3 týdny)
   - Implementace offline vyhledávání
   - Implementace offline navigace
   - Implementace ukládání uživatelských dat

4. **Implementace synchronizace** (2 týdny)
   - Implementace fronty změn
   - Implementace synchronizace po obnovení připojení
   - Implementace řešení konfliktů

5. **Testování a ladění** (2 týdny)
   - Testování offline funkcionality
   - Testování synchronizace
   - Oprava nalezených chyb

#### Závislosti:
- Service Worker
- IndexedDB nebo jiné lokální úložiště

#### Výstupy:
- Offline režim pro mapu
- Cachování mapových dlaždic
- Synchronizace dat po obnovení připojení

### Rozšíření mapových funkcí

#### Úkoly:
1. **Implementace vyhledávání míst** (3 týdny)
   - Integrace s API pro vyhledávání míst
   - Implementace autocomplete
   - Implementace zobrazení výsledků na mapě

2. **Implementace vytváření vlastních tras** (4 týdny)
   - Implementace UI pro vytváření tras
   - Integrace s API pro routování
   - Implementace ukládání tras

3. **Implementace sdílení bodů a tras** (2 týdny)
   - Implementace generování sdílitelných odkazů
   - Implementace QR kódů pro sdílení
   - Implementace importu/exportu dat

4. **Testování a ladění** (2 týdny)
   - Testování vyhledávání
   - Testování vytváření tras
   - Testování sdílení
   - Oprava nalezených chyb

#### Závislosti:
- API pro vyhledávání míst
- API pro routování

#### Výstupy:
- Vyhledávání míst
- Vytváření vlastních tras
- Sdílení bodů a tras

## Podpora zařízení

### Optimalizace pro mobilní zařízení

#### Úkoly:
1. **Analýza současného stavu na mobilních zařízeních** (1 týden)
   - Testování na různých mobilních zařízeních
   - Identifikace problémů s responzivitou
   - Analýza výkonu

2. **Implementace responzivního designu** (3 týdny)
   - Refaktoring CSS pro mobilní zařízení
   - Implementace media queries
   - Optimalizace layoutu pro různé velikosti obrazovek

3. **Implementace touch-friendly ovládacích prvků** (2 týdny)
   - Zvětšení dotykových ploch
   - Implementace swipe gest
   - Optimalizace formulářů pro mobilní zařízení

4. **Optimalizace výkonu** (2 týdny)
   - Optimalizace velikosti stahovaných souborů
   - Implementace lazy loading
   - Optimalizace vykreslování mapy

5. **Testování a ladění** (2 týdny)
   - Testování na různých mobilních zařízeních
   - Testování výkonu
   - Oprava nalezených chyb

#### Závislosti:
- Přístup k různým mobilním zařízením pro testování

#### Výstupy:
- Plně responzivní design
- Touch-friendly ovládací prvky
- Optimalizovaný výkon na mobilních zařízeních

## Časový plán

Celkový časový plán pro implementaci krátkodobých cílů je 6 měsíců. Níže je rozdělen do dvou tříměsíčních fází:

### Fáze 1 (Měsíce 1-3)

#### Měsíc 1:
- Analýza současného kódu a přechod na ES6+
- Nastavení SASS a migrace CSS
- Analýza současného Express API
- Nastavení AWS účtu a IAM

#### Měsíc 2:
- Implementace modulárního systému
- Implementace Webpack
- Migrace vybraných endpointů na Fastify
- Migrace frontendu na S3 a CloudFront

#### Měsíc 3:
- Základní implementace PWA
- Implementace Redis pro cachování
- Migrace backendu na Lambda
- Kontejnerizace aplikace

### Fáze 2 (Měsíce 4-6)

#### Měsíc 4:
- Analýza současného využití LLM API
- Implementace pokročilého cachování
- Implementace podpory pro Mistral AI a Llama 3
- Analýza požadavků pro offline režim

#### Měsíc 5:
- Implementace embeddings pro vyhledávání
- Implementace automatického výběru modelu
- Implementace cachování mapových dlaždic
- Implementace vyhledávání míst

#### Měsíc 6:
- Implementace vlastního fine-tunovaného modelu
- Implementace offline funkcionality a synchronizace
- Implementace vytváření vlastních tras a sdílení
- Optimalizace pro mobilní zařízení

## Závěr

Tento implementační plán poskytuje konkrétní kroky pro dosažení krátkodobých cílů definovaných v dokumentu PROGRESS.md. Plán je rozdělen do jednotlivých oblastí a obsahuje konkrétní úkoly, časové odhady a závislosti.

Implementace tohoto plánu povede k:
- Modernizaci technologického stacku
- Optimalizaci výkonu a nákladů
- Rozšíření funkcí aplikace
- Zlepšení uživatelského zážitku na různých zařízeních

Pravidelné revize a aktualizace tohoto plánu pomohou zajistit úspěšnou implementaci krátkodobých cílů a připravit půdu pro střednědobé a dlouhodobé cíle.
