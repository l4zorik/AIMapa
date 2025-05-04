# Zápisník bugů a problémů

## Kritické problémy

### Autentizace
- **BUG-001**: ✅ Přihlášení nefunguje - uživatelé se nemohou přihlásit přes Auth0 - OPRAVENO
- **BUG-002**: Chyba "Oops!, something went wrong" při přístupu k Auth0 tenantu
- **BUG-003**: ✅ Callback URL nefunguje správně - po přihlášení nedochází k přesměrování zpět do aplikace - OPRAVENO
- **BUG-004**: ✅ Odhlášení nefunguje správně - uživatelé zůstávají přihlášeni i po kliknutí na odhlásit - OPRAVENO
- **BUG-005**: ✅ Duplicitní Auth0 routy v server.js - OPRAVENO
- **BUG-006**: ✅ Nekonzistentní verze v souborech - OPRAVENO
- **BUG-007**: ✅ Nesprávné cesty k souborům v index.html - OPRAVENO

### Externí chyby (ignorovat)
- Chyby v konzoli související s rozšířeními prohlížeče (Exodus, kryptoměnové peněženky)
- Chyba 404 při načítání favicon.ico

### Databáze
- **BUG-005**: Data uživatelů se neukládají do Supabase po přihlášení
- **BUG-006**: Chybí Row Level Security (RLS) politiky v Supabase - bezpečnostní riziko
- **BUG-007**: Synchronizace dat mezi Auth0 a Supabase nefunguje

### Uživatelské rozhraní
- **BUG-008**: Mapa se nenačítá správně - prázdná obrazovka
- **BUG-009**: Responzivní design nefunguje na mobilních zařízeních
- **BUG-010**: Tmavý režim nefunguje správně - některé prvky zůstávají ve světlém režimu

## Střední problémy

### Funkčnost
- **BUG-011**: ✅ Implementace LLM API providera pro chat - DOKONČENO
- **BUG-012**: Offline režim nefunguje - aplikace nefunguje bez připojení k internetu
- **BUG-013**: Automatická synchronizace dat nefunguje
- **BUG-014**: Mapa není monetizována - chybí implementace placených funkcí
- **BUG-015**: Uživatelé nemohou přidávat vlastní body na mapu
- **BUG-016**: Uživatelé nemohou vytvářet vlastní trasy

### Výkon
- **BUG-017**: Pomalé načítání mapy - vysoká latence
- **BUG-018**: Vysoká spotřeba paměti při používání mapy
- **BUG-019**: Aplikace se zasekává při přidávání více bodů na mapu

## Nízké problémy

### Uživatelská zkušenost
- **BUG-020**: Chybí nápověda pro nové uživatele
- **BUG-021**: Nekonzistentní design napříč různými stránkami
- **BUG-022**: Chybí animace pro lepší uživatelskou zkušenost
- **BUG-023**: Nedostatečná zpětná vazba při akcích uživatele

### Dokumentace
- **BUG-024**: Chybí uživatelská dokumentace
- **BUG-025**: Dokumentace API není aktuální
- **BUG-026**: Chybí příklady použití API

## Požadavky na nové funkce

### Chat s LLM
- **REQ-001**: Implementace integrace s LLM API providerem
- **REQ-002**: Vytvoření chatovacího rozhraní
- **REQ-003**: Implementace kontextového vyhledávání pro relevantní odpovědi
- **REQ-004**: Ukládání historie konverzací
- **REQ-005**: Možnost sdílení konverzací

### Monetizace
- **REQ-006**: Implementace placených funkcí
- **REQ-007**: Integrace platební brány
- **REQ-008**: Vytvoření různých úrovní předplatného
- **REQ-009**: Implementace zkušební verze zdarma
- **REQ-010**: Analýza využití placených funkcí

### Mapa
- **REQ-011**: Přidání možnosti vytváření vlastních tras
- **REQ-012**: Implementace vyhledávání míst
- **REQ-013**: Přidání filtrů pro body na mapě
- **REQ-014**: Možnost sdílení bodů a tras
- **REQ-015**: Offline mapy pro použití bez připojení k internetu
