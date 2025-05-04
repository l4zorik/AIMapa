# Integrace Auth0 a Supabase v AIMapa

Tato dokumentace popisuje, jak je implementována integrace mezi Auth0 a Supabase v aplikaci AIMapa.

## Přehled

AIMapa používá Auth0 pro autentizaci uživatelů a Supabase pro ukládání uživatelských dat a dalších funkcí. Integrace mezi těmito dvěma službami je zajištěna pomocí synchronizačního mechanismu, který udržuje uživatelská data konzistentní mezi oběma systémy.

## Architektura

1. **Auth0** - Poskytuje autentizaci a autorizaci
   - Správa uživatelských účtů
   - Přihlašování a registrace
   - Sociální přihlašování
   - JWT tokeny

2. **Supabase** - Poskytuje databázi a další služby
   - Ukládání uživatelských dat
   - Ukládání aplikačních dat
   - Realtime funkce
   - Storage

3. **Synchronizační vrstva** - Propojuje Auth0 a Supabase
   - Synchronizace uživatelů při přihlášení
   - Aktualizace uživatelských dat

## Implementace

### Tabulka `users` v Supabase

Tabulka `users` v Supabase obsahuje následující sloupce:

- `id` - UUID, primární klíč
- `auth0_id` - ID uživatele v Auth0 (např. `auth0|123456789`)
- `email` - E-mailová adresa uživatele
- `name` - Jméno uživatele
- `picture` - URL profilového obrázku
- `email_verified` - Zda byl e-mail ověřen
- `created_at` - Datum vytvoření záznamu
- `updated_at` - Datum poslední aktualizace
- `last_login` - Datum posledního přihlášení
- `user_metadata` - JSONB, uživatelská metadata
- `app_metadata` - JSONB, aplikační metadata

### Synchronizační třída `SupabaseAuthSync`

Třída `SupabaseAuthSync` v souboru `auth/supabase-auth-sync.js` zajišťuje synchronizaci uživatelů mezi Auth0 a Supabase. Hlavní funkce:

- `syncUser(user)` - Synchronizuje uživatele z Auth0 do Supabase
- `getUserByAuth0Id(auth0Id)` - Získá uživatele z Supabase podle Auth0 ID
- `updateUserMetadata(auth0Id, metadata)` - Aktualizuje uživatelská metadata
- `createSyncMiddleware()` - Vytvoří Express middleware pro automatickou synchronizaci

### Express middleware

V souboru `server.js` je registrován middleware, který automaticky synchronizuje uživatele při každém požadavku:

```javascript
// Inicializace Supabase Auth Sync
const supabaseAuthSync = new SupabaseAuthSync({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
});

// Middleware pro synchronizaci uživatelů mezi Auth0 a Supabase
app.use(supabaseAuthSync.createSyncMiddleware());
```

### API endpointy

V souboru `routes/user.js` jsou implementovány API endpointy pro práci s uživatelskými daty:

- `GET /api/user/profile` - Získá profil přihlášeného uživatele
- `PUT /api/user/profile` - Aktualizuje profil přihlášeného uživatele
- `GET /api/user/settings` - Získá uživatelská nastavení
- `PUT /api/user/settings` - Aktualizuje uživatelská nastavení

### Klientská část

V souboru `public/js/user-profile.js` je implementován JavaScript modul pro práci s uživatelským profilem na klientské straně:

- `loadProfile()` - Načte uživatelský profil ze serveru
- `updateProfile(profileData)` - Aktualizuje uživatelský profil
- `loadSettings()` - Načte uživatelská nastavení
- `updateSettings(settingsData)` - Aktualizuje uživatelská nastavení

## Nastavení

### Auth0

1. Vytvořte aplikaci v Auth0 Dashboard
2. Nastavte Callback URL na `https://vaše-doména.cz/callback`
3. Nastavte Allowed Logout URLs na `https://vaše-doména.cz`
4. Nastavte Allowed Web Origins na `https://vaše-doména.cz`
5. Povolte Connection pro registraci a přihlašování (např. Username-Password-Authentication)

### Supabase

1. Vytvořte projekt v Supabase
2. Spusťte skript `scripts/create-users-table.js` pro vytvoření tabulky `users`
3. Nastavte Row Level Security (RLS) pro tabulku `users`

### Proměnné prostředí

Nastavte následující proměnné prostředí:

```
# Auth0 konfigurace
AUTH0_DOMAIN=váš-tenant.auth0.com
AUTH0_CLIENT_ID=váš-client-id
AUTH0_CLIENT_SECRET=váš-client-secret
AUTH0_CALLBACK_URL=https://vaše-doména.cz/callback
AUTH0_LOGOUT_URL=https://vaše-doména.cz
AUTH0_SCOPE="openid profile email read:users read:user_idp_tokens"
AUTH0_AUDIENCE=https://váš-tenant.auth0.com/api/v2/

# Supabase konfigurace
SUPABASE_URL=https://váš-projekt.supabase.co
SUPABASE_KEY=váš-anon-key
SUPABASE_SERVICE_KEY=váš-service-role-key
```

## Bezpečnostní doporučení

1. **Používejte HTTPS** - Vždy používejte HTTPS pro komunikaci mezi klientem a serverem.
2. **Chraňte API klíče** - Nikdy neukládejte API klíče na klientské straně.
3. **Implementujte Row Level Security (RLS)** - Nastavte RLS v Supabase pro ochranu dat.
4. **Validujte JWT tokeny** - Vždy validujte JWT tokeny z Auth0.
5. **Omezte přístup k API** - Používejte middleware `requiresAuth()` pro ochranu API endpointů.

## Řešení problémů

### Uživatel se nepropaguje do Supabase

1. Zkontrolujte, zda je správně nastavena proměnná prostředí `SUPABASE_SERVICE_KEY`
2. Zkontrolujte, zda je správně nastavena proměnná prostředí `SUPABASE_URL`
3. Zkontrolujte, zda je správně implementován middleware `supabaseAuthSync.createSyncMiddleware()`

### Chyba při aktualizaci uživatelského profilu

1. Zkontrolujte, zda má uživatel oprávnění k aktualizaci svého profilu (RLS)
2. Zkontrolujte, zda jsou správně nastaveny proměnné prostředí
3. Zkontrolujte, zda je uživatel přihlášen

## Další zdroje

- [Auth0 dokumentace](https://auth0.com/docs)
- [Supabase dokumentace](https://supabase.io/docs)
- [Express-OpenID-Connect dokumentace](https://github.com/auth0/express-openid-connect)
- [Supabase JavaScript klient](https://github.com/supabase/supabase-js)
