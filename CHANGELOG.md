# Changelog

Všechny významné změny v projektu budou dokumentovány v tomto souboru.

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
