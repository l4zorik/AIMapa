# Changelog

Všechny významné změny v projektu budou dokumentovány v tomto souboru.

## [0.4.2] - 2025-06-01

### Přidáno
- Migrace na React s TypeScript pro moderní vývoj frontendu
- Implementována nová struktura projektu s komponentovým přístupem
- Přidána podpora pro správu API klíčů s možností výběru různých poskytovatelů
- Implementován chat komponent, který spolupracuje s mapou
- Přidána podpora pro různé poskytovatele map (OpenStreetMap, Mapy.cz, Google Maps, Mapbox)
- Implementováno zobrazení ceníků a efektivity API poskytovatelů
- Přidána možnost nastavení limitů nákladů pro API volání
- Vytvořena interaktivní mapa s podporou markerů a tras
- Implementována responzivní design pro mobilní i desktopové zobrazení

### Změněno
- Kompletní přepracování architektury frontendu s využitím React a TypeScript
- Vylepšeno uživatelské rozhraní s moderním designem
- Optimalizován výkon aplikace díky virtuálnímu DOM
- Vylepšena typová bezpečnost kódu díky TypeScript
- Zlepšena organizace kódu s využitím komponentového přístupu

### Opraveno
- Vyřešeny problémy s kompatibilitou prohlížečů
- Opraveny problémy s responzivním designem
- Vylepšena přístupnost aplikace

## [0.4.1] - 2025-05-20

### Přidáno
- Přidána podpora pro vlastní doménu www.quicksoft.fun
- Aktualizována konfigurace Auth0 pro novou doménu
- Vylepšena integrace s Netlify pro nasazení na vlastní doménu
- Přidáno automatické přesměrování na HTTPS
- Implementována synchronizace uživatelů mezi Auth0 a Supabase
- Vytvořena tabulka `users` v Supabase pro ukládání uživatelských dat
- Přidány API endpointy pro správu uživatelského profilu
- Implementován klientský modul pro práci s uživatelskými daty
- Vytvořena stránka uživatelského profilu s možností úpravy nastavení
- Přidána dokumentace pro integraci Auth0 a Supabase

### Změněno
- Aktualizovány všechny URL v konfiguraci pro použití nové domény
- Vylepšena Content Security Policy pro podporu nové domény
- Optimalizována konfigurace pro produkční nasazení
- Vylepšena struktura serverové části aplikace
- Rozšířeny API endpointy o podporu uživatelských dat
- Aktualizována dokumentace s informacemi o nové integraci

### Opraveno
- Opraveny problémy s přihlašováním na nové doméně
- Vyřešeny problémy s callback URL pro Auth0
- Opraveny problémy s CORS při volání API z nové domény
- Vyřešeny problémy se synchronizací uživatelských dat

## [0.4.0] - 2023-06-15

### Přidáno
- Rozšířena nabídka LLM modelů o nejnovější modely podle benchmarku ArenaHard
- Přidána podpora pro Qwen3 72B a 32B modely od Alibaba
- Přidána podpora pro OpenAI o1 (GPT-4o) a o3-mini modely
- Přidána podpora pro DeepSeek R1 model
- Přidána podpora pro Grok 3 Beta model od xAI
- Implementováno rozhraní pro správu API klíčů pro všechny poskytovatele (Hugging Face, OpenAI, Groq)
- Přidány informace o výkonu modelů podle benchmarku ArenaHard
- Implementováno mapové rozhraní s vyhledáváním lokací
- Přidána podpora pro zobrazení detailů míst včetně souřadnic
- Vytvořeno uživatelské rozhraní s přihlašováním a správou účtu

### Změněno
- Vylepšeno uživatelské rozhraní pro výběr modelů s kategorizací podle poskytovatele
- Aktualizována konfigurace modelů s přesnějšími informacemi o cenách a výkonu
- Optimalizován výkon mapového rozhraní
- Vylepšena přesnost vyhledávání lokací

## [0.3.9.0] - 2025-05-10

### Přidáno
- Implementována integrace s LLM API pro chatovací funkce
- Přidána podpora pro OpenAI, Anthropic, DeepSeek a Google Gemini modely
- Přidána podpora pro nejnovější modely Gemini 1.5 Flash, Gemini 1.5 Pro, Gemini 2.5 Pro a Gemini 2.5 Flash
- Vytvořeno chatovací rozhraní s podporou Markdown a zvýrazněním syntaxe
- Implementováno cachování LLM odpovědí pro snížení nákladů
- Přidána možnost exportu konverzací do Markdown formátu
- Implementováno kontextové vyhledávání pro relevantnější odpovědi
- Přidána historie konverzací s ukládáním do Supabase
- Implementován systém pro sledování využití API a nákladů

### Změněno
- Vylepšeno uživatelské rozhraní s podporou tmavého režimu
- Optimalizován výkon aplikace při práci s LLM API
- Vylepšena bezpečnost API endpointů s rate limitingem
- Aktualizována dokumentace s informacemi o nových modelech a jejich cenách

### Opraveno
- Opraveny problémy s autentizací při používání chatovacího rozhraní
- Vyřešeny problémy s ukládáním dlouhých konverzací
- Opraveny problémy s odhadem ceny požadavků na LLM API

## [0.3.8.7] - 2025-05-03

### Přidáno
- Vytvořena složka `/auth` pro centralizaci Auth0 souborů a logiky
- Přidán soubor `auth0-endpoints.md` s dokumentací všech Auth0 endpointů
- Implementována `Auth0Service` třída pro lepší správu Auth0 funkcionalit
- Přidán diagnostický endpoint `/auth/debug` pro zobrazení stavu autentizace
- Vytvořen testovací nástroj `auth0-test.js` pro ověření funkčnosti Auth0 endpointů

### Změněno
- Refaktorován kód v `server.js` pro použití nové Auth0 service
- Sjednocen formát všech Auth0 endpointů
- Vylepšena chybová hlášení při problémech s autentizací
- Optimalizována konfigurace Auth0 pro lokální vývoj i produkční prostředí

### Opraveno
- Opraven problém s `req.oidc.login is not a function` chybou
- Vyřešen problém s validací URL v Auth0 konfiguraci
- Opraveno přesměrování po přihlášení a odhlášení
- Vyřešeny problémy s HTTPS požadavky pro lokální vývoj
- Opraveno přihlašování přes Auth0 (BUG-001)
- Opravena Callback URL pro správné přesměrování po přihlášení (BUG-003)
- Opraveno odhlašování z aplikace (BUG-004)
- Odstraněny duplicitní Auth0 routy v server.js (BUG-005)
- Sjednoceny verze ve všech souborech na 0.3.8.7 (BUG-006)
- Opraveny nesprávné cesty k souborům v index.html (BUG-007)
- Vylepšena inicializace komponent v index.html pro lepší odolnost proti chybám

## [0.3.8.6] - Předchozí verze

### Přidáno
- Základní integrace Auth0 pro autentizaci uživatelů
- Implementace Supabase pro ukládání dat
- Přidány API endpointy pro práci s mapou

### Změněno
- Vylepšeno uživatelské rozhraní
- Optimalizován výkon aplikace

### Opraveno
- Různé bugfixy a vylepšení stability
