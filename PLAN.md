# Plán řešení problémů a implementace nových funkcí

## 1. Oprava kritických problémů s autentizací

### 1.1 Oprava přihlašování přes Auth0 (BUG-001)
- [ ] Diagnostika problému s přihlašováním
  - [ ] Kontrola logů serveru při pokusu o přihlášení
  - [ ] Kontrola síťových požadavků v prohlížeči
  - [ ] Ověření správnosti konfigurace Auth0
- [ ] Oprava problému s přihlašováním
  - [ ] Aktualizace Auth0 konfigurace v `.env` souboru
  - [ ] Oprava Auth0 middleware v `server.js`
  - [ ] Testování přihlášení po opravě

### 1.2 Řešení chyby "Oops!, something went wrong" (BUG-002)
- [ ] Kontaktování Auth0 podpory s popisem problému
- [ ] Kontrola limitů free tier v Auth0
- [ ] Vytvoření nového Auth0 tenantu, pokud je to nutné
- [ ] Aktualizace konfigurace s novým tenantem

### 1.3 Oprava Callback URL (BUG-003)
- [ ] Kontrola nastavení Callback URL v Auth0 dashboardu
- [ ] Ověření, že Callback URL v aplikaci odpovídá URL v Auth0 dashboardu
- [ ] Implementace správného zpracování callbacku v `auth0-routes.js`
- [ ] Testování přihlášení a callbacku

### 1.4 Oprava odhlašování (BUG-004)
- [ ] Kontrola implementace odhlašování v `auth0-routes.js`
- [ ] Ověření, že Logout URL v aplikaci odpovídá URL v Auth0 dashboardu
- [ ] Implementace správného zpracování odhlášení
- [ ] Testování odhlášení

## 2. Oprava problémů s databází

### 2.1 Oprava ukládání dat uživatelů do Supabase (BUG-005)
- [ ] Kontrola implementace ukládání dat v `auth/supabase-integration.js`
- [ ] Ověření, že Supabase klient je správně inicializován
- [ ] Implementace správného ukládání dat uživatelů po přihlášení
- [ ] Testování ukládání dat

### 2.2 Implementace Row Level Security (RLS) politik (BUG-006)
- [ ] Návrh RLS politik pro tabulky v Supabase
- [ ] Implementace RLS politik pro tabulku `users`
- [ ] Implementace RLS politik pro tabulku `user_stats`
- [ ] Implementace RLS politik pro tabulku `user_settings`
- [ ] Testování RLS politik

### 2.3 Oprava synchronizace dat mezi Auth0 a Supabase (BUG-007)
- [ ] Kontrola implementace synchronizace v `auth/supabase-sync.js`
- [ ] Implementace správné synchronizace dat po přihlášení
- [ ] Implementace pravidelné synchronizace dat
- [ ] Testování synchronizace dat

## 3. Implementace LLM API pro chat (BUG-011)

### 3.1 Výběr a integrace LLM API providera
- [x] Průzkum dostupných LLM API providerů (OpenAI, Anthropic, DeepSeek)
- [x] Porovnání cen, funkcí a limitů jednotlivých providerů
- [x] Výběr vhodného providera pro implementaci
- [ ] Registrace a získání API klíčů

### 3.2 Vytvoření backendu pro LLM API
- [x] Vytvoření nového endpointu pro komunikaci s LLM API
- [x] Implementace zabezpečení endpointu (autentizace, rate limiting)
- [x] Implementace proxy pro LLM API požadavky
- [x] Implementace cachování odpovědí pro snížení nákladů
- [ ] Testování backendu

### 3.3 Vytvoření chatovacího rozhraní
- [x] Návrh UI pro chatovací rozhraní
- [x] Implementace HTML/CSS pro chat
- [x] Implementace JavaScript pro komunikaci s backendem
- [x] Implementace zobrazování zpráv a odpovědí
- [ ] Testování chatovacího rozhraní

### 3.4 Implementace pokročilých funkcí chatu
- [x] Implementace kontextového vyhledávání pro relevantní odpovědi
- [x] Implementace ukládání historie konverzací do Supabase
- [x] Implementace sdílení konverzací
- [x] Implementace exportu konverzací
- [ ] Testování pokročilých funkcí

## 4. Implementace monetizace mapy (BUG-014)

### 4.1 Návrh placených funkcí
- [ ] Identifikace funkcí vhodných pro monetizaci
- [ ] Návrh různých úrovní předplatného
- [ ] Návrh zkušební verze zdarma
- [ ] Vytvoření dokumentace placených funkcí

### 4.2 Integrace platební brány
- [ ] Výběr platební brány (Stripe, PayPal, atd.)
- [ ] Registrace a získání API klíčů
- [ ] Implementace backendu pro zpracování plateb
- [ ] Implementace frontendu pro platby
- [ ] Testování platebního procesu

### 4.3 Implementace správy předplatného
- [ ] Implementace ukládání informací o předplatném do Supabase
- [ ] Implementace kontroly předplatného pro přístup k placeným funkcím
- [ ] Implementace notifikací o končícím předplatném
- [ ] Implementace automatického obnovení předplatného
- [ ] Testování správy předplatného

## 5. Implementace funkcí mapy

### 5.1 Implementace přidávání vlastních bodů na mapu (BUG-015)
- [ ] Návrh UI pro přidávání bodů na mapu
- [ ] Implementace frontendu pro přidávání bodů
- [ ] Implementace backendu pro ukládání bodů do Supabase
- [ ] Implementace zobrazování bodů na mapě
- [ ] Testování přidávání bodů

### 5.2 Implementace vytváření vlastních tras (BUG-016, REQ-011)
- [ ] Návrh UI pro vytváření tras
- [ ] Implementace frontendu pro vytváření tras
- [ ] Implementace backendu pro ukládání tras do Supabase
- [ ] Implementace zobrazování tras na mapě
- [ ] Testování vytváření tras

### 5.3 Implementace vyhledávání míst (REQ-012)
- [ ] Integrace s API pro vyhledávání míst (Google Places, Mapbox, atd.)
- [ ] Implementace UI pro vyhledávání
- [ ] Implementace zobrazování výsledků vyhledávání na mapě
- [ ] Testování vyhledávání míst

### 5.4 Implementace offline režimu (BUG-012, REQ-015)
- [ ] Implementace ukládání mapových dlaždic pro offline použití
- [ ] Implementace ukládání bodů a tras pro offline použití
- [ ] Implementace synchronizace dat po obnovení připojení
- [ ] Testování offline režimu

## 6. Testování a dokumentace

### 6.1 Testování všech implementovaných funkcí
- [ ] Vytvoření testovacích scénářů pro všechny funkce
- [ ] Provedení manuálního testování
- [ ] Implementace automatických testů
- [ ] Oprava nalezených chyb

### 6.2 Aktualizace dokumentace
- [ ] Aktualizace uživatelské dokumentace
- [ ] Aktualizace vývojářské dokumentace
- [ ] Aktualizace API dokumentace
- [ ] Vytvoření dokumentace pro nové funkce

### 6.3 Nasazení a monitoring
- [ ] Nasazení nové verze aplikace
- [ ] Implementace monitoringu pro sledování chyb
- [ ] Implementace analytiky pro sledování využití funkcí
- [ ] Vytvoření plánu pro další vylepšení
