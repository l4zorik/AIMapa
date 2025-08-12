# Integrace Supabase a Netlify do AIMapa

Tento dokument popisuje implementaci integrace Supabase a Netlify do aplikace AIMapa pro verzi 0.3.8.4, která umožňuje ukládání dat v cloudu, autentizaci uživatelů, synchronizaci mezi zařízeními a automatické nasazení aplikace.

## Obsah

1. [Přehled](#přehled)
2. [Supabase integrace](#supabase-integrace)
   - [Struktura databáze](#struktura-databáze)
   - [Autentizace uživatelů](#autentizace-uživatelů)
   - [Synchronizace dat](#synchronizace-dat)
   - [Bezpečnost](#bezpečnost)
3. [Netlify integrace](#netlify-integrace)
   - [Konfigurace nasazení](#konfigurace-nasazení)
   - [Proměnné prostředí](#proměnné-prostředí)
   - [Serverless funkce](#serverless-funkce)
4. [Použití v aplikaci](#použití-v-aplikaci)
   - [Přihlášení a registrace](#přihlášení-a-registrace)
   - [Ukládání dat](#ukládání-dat)
   - [Synchronizace mezi zařízeními](#synchronizace-mezi-zařízeními)
5. [Další vývoj](#další-vývoj)

## Přehled

Integrace Supabase a Netlify do aplikace AIMapa přináší následující výhody:

- **Ukládání dat v cloudu**: Uživatelská data jsou ukládána v PostgreSQL databázi Supabase, což umožňuje přístup k datům z různých zařízení.
- **Autentizace uživatelů**: Supabase poskytuje bezpečný systém autentizace s podporou přihlášení pomocí emailu a hesla, a také pomocí sociálních sítí (Google, Facebook, GitHub).
- **Synchronizace dat**: Data jsou automaticky synchronizována mezi zařízeními, což umožňuje plynulý přechod mezi různými zařízeními.
- **Automatické nasazení**: Netlify poskytuje automatické nasazení aplikace při push do hlavní větve, což zjednodušuje proces nasazení.
- **Serverless funkce**: Netlify Functions umožňují vytvářet serverless funkce pro backend logiku bez nutnosti spravovat vlastní server.

## Supabase integrace

### Struktura databáze

V Supabase jsme vytvořili následující tabulky:

1. **users**: Ukládá základní informace o uživatelích (username, email, avatar, level, XP, peníze).
2. **user_stats**: Ukládá statistiky uživatelů (celkové výdělky, počet úkolů, celkový čas práce).
3. **user_settings**: Ukládá nastavení uživatelů (tmavý režim, notifikace, jazyk).
4. **user_achievements**: Ukládá achievementy uživatelů.
5. **virtual_work**: Ukládá informace o virtuální práci uživatelů.
6. **rewards**: Ukládá informace o odměnách uživatelů.
7. **map_points**: Ukládá body na mapě vytvořené uživateli.
8. **tasks**: Ukládá úkoly uživatelů.

### Autentizace uživatelů

Supabase poskytuje kompletní systém autentizace, který jsme integrovali do aplikace AIMapa. Uživatelé se mohou:

- Registrovat pomocí emailu a hesla
- Přihlásit pomocí emailu a hesla
- Přihlásit pomocí sociálních sítí (Google, Facebook, GitHub)
- Resetovat heslo
- Odhlásit se

Implementace je v souboru `public/app/supabase-auth.js`.

### Synchronizace dat

Data jsou automaticky synchronizována mezi lokálním úložištěm a Supabase databází. Synchronizace probíhá:

- Při přihlášení uživatele
- Při odhlášení uživatele
- Při manuálním spuštění synchronizace
- Při změně dat v aplikaci (s možností nastavení intervalu)

Implementace je v souborech `public/app/supabase-client.js` a `public/app/supabase-auth.js`.

### Bezpečnost

Pro zabezpečení dat v Supabase jsme implementovali Row Level Security (RLS) politiky, které zajišťují, že uživatelé mají přístup pouze ke svým vlastním datům. Každá tabulka má nastavené politiky pro:

- SELECT: Uživatelé mohou číst pouze svá vlastní data
- INSERT: Uživatelé mohou vkládat pouze svá vlastní data
- UPDATE: Uživatelé mohou aktualizovat pouze svá vlastní data
- DELETE: Uživatelé mohou mazat pouze svá vlastní data

## Netlify integrace

### Konfigurace nasazení

Konfigurace nasazení na Netlify je definována v souboru `netlify.toml`, který obsahuje:

- Příkaz pro build aplikace
- Adresář, který bude nasazen
- Adresář pro serverless funkce
- Nastavení proměnných prostředí
- Přesměrování a hlavičky

### Proměnné prostředí

Netlify automaticky nastavuje následující proměnné prostředí pro Supabase:

- `SUPABASE_DATABASE_URL`: URL Supabase projektu
- `SUPABASE_SERVICE_ROLE_KEY`: Service role klíč Supabase projektu
- `SUPABASE_ANON_KEY`: Anonymní klíč Supabase projektu
- `SUPABASE_JWT_SECRET`: JWT secret Supabase projektu
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anonymní klíč Supabase projektu pro klientskou stranu
- `NEXT_PUBLIC_SUPABASE_DATABASE_URL`: URL Supabase projektu pro klientskou stranu

Tyto proměnné jsou dostupné v aplikaci přes modul `public/app/netlify-integration.js`.

### Serverless funkce

Netlify Functions umožňují vytvářet serverless funkce pro backend logiku. Tyto funkce mohou být volány z aplikace pomocí modulu `public/app/netlify-integration.js`.

## Použití v aplikaci

### Přihlášení a registrace

Uživatelé se mohou přihlásit nebo registrovat pomocí tlačítka v pravém horním rohu aplikace. Po kliknutí na tlačítko se zobrazí okno s možností přihlášení nebo registrace.

### Ukládání dat

Data jsou automaticky ukládána do Supabase databáze při:

- Přidání nového bodu na mapu
- Dokončení virtuální práce
- Získání achievementu
- Změně nastavení
- Aktualizaci profilu

### Synchronizace mezi zařízeními

Data jsou automaticky synchronizována mezi zařízeními při přihlášení uživatele. Uživatelé mohou také manuálně spustit synchronizaci v nastavení účtu.

## Další vývoj

V budoucích verzích plánujeme:

1. **Rozšíření autentizace**: Přidání dalších poskytovatelů autentizace (Apple, Twitter).
2. **Realtime synchronizace**: Implementace realtime synchronizace dat mezi zařízeními.
3. **Offline režim**: Vylepšení offline režimu s automatickou synchronizací po připojení k internetu.
4. **Serverless funkce**: Vytvoření serverless funkcí pro složitější backend logiku.
5. **Sdílení dat**: Možnost sdílení bodů na mapě a tras s ostatními uživateli.

---

*Poslední aktualizace: 2025-07-10*
