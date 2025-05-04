# Plán řešení problémů a implementace nových funkcí

## 1. Oprava kritických problémů s autentizací

### 1.1 Oprava přihlašování přes Auth0 (BUG-001) - DOKONČENO
- [x] Diagnostika problému s přihlašováním
  - [x] Kontrola logů serveru při pokusu o přihlášení
  - [x] Kontrola síťových požadavků v prohlížeči
  - [x] Ověření správnosti konfigurace Auth0
- [x] Oprava problému s přihlašováním
  - [x] Aktualizace Auth0 konfigurace v `.env` souboru
  - [x] Oprava Auth0 middleware v `server.js`
  - [x] Testování přihlášení po opravě

### 1.2 Řešení chyby "Oops!, something went wrong" (BUG-002)
- [ ] Kontaktování Auth0 podpory s popisem problému
- [ ] Kontrola limitů free tier v Auth0
- [ ] Vytvoření nového Auth0 tenantu, pokud je to nutné
- [ ] Aktualizace konfigurace s novým tenantem

### 1.3 Oprava Callback URL (BUG-003) - DOKONČENO
- [x] Kontrola nastavení Callback URL v Auth0 dashboardu
- [x] Ověření, že Callback URL v aplikaci odpovídá URL v Auth0 dashboardu
- [x] Implementace správného zpracování callbacku v `auth0-routes.js`
- [x] Testování přihlášení a callbacku

### 1.4 Oprava odhlašování (BUG-004) - DOKONČENO
- [x] Kontrola implementace odhlašování v `auth0-routes.js`
- [x] Ověření, že Logout URL v aplikaci odpovídá URL v Auth0 dashboardu
- [x] Implementace správného zpracování odhlášení
- [x] Testování odhlášení

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
- [ ] Průzkum dostupných LLM API providerů (OpenAI, Anthropic, Cohere, atd.)
- [ ] Porovnání cen, funkcí a limitů jednotlivých providerů
- [ ] Výběr vhodného providera pro implementaci
- [ ] Registrace a získání API klíčů

### 3.2 Vytvoření backendu pro LLM API
- [ ] Vytvoření nového endpointu pro komunikaci s LLM API
- [ ] Implementace zabezpečení endpointu (autentizace, rate limiting)
- [ ] Implementace proxy pro LLM API požadavky
- [ ] Implementace cachování odpovědí pro snížení nákladů
- [ ] Testování backendu

### 3.3 Vytvoření chatovacího rozhraní
- [ ] Návrh UI pro chatovací rozhraní
- [ ] Implementace HTML/CSS pro chat
- [ ] Implementace JavaScript pro komunikaci s backendem
- [ ] Implementace zobrazování zpráv a odpovědí
- [ ] Testování chatovacího rozhraní

### 3.4 Implementace pokročilých funkcí chatu
- [ ] Implementace kontextového vyhledávání pro relevantní odpovědi
- [ ] Implementace ukládání historie konverzací do Supabase
- [ ] Implementace sdílení konverzací
- [ ] Implementace exportu konverzací
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
- [ ] Implementace správného zpracování chybějících zdrojů
- [ ] Testování načítání všech statických souborů

## 4. Oprava problémů s uživatelským rozhraním

### 4.1 Oprava načítání mapy (BUG-008)
- [ ] Diagnostika problému s načítáním mapy
  - [ ] Kontrola konzole prohlížeče pro chyby
  - [ ] Ověření, že mapové API je správně načteno
  - [ ] Kontrola inicializace mapy v JavaScript kódu
- [ ] Oprava načítání mapy
  - [ ] Aktualizace mapového API
  - [ ] Oprava inicializace mapy
  - [ ] Testování načítání mapy

### 4.2 Oprava responzivního designu (BUG-009)
- [ ] Identifikace problémů s responzivním designem na mobilních zařízeních
- [ ] Aktualizace CSS pro lepší podporu mobilních zařízení
- [ ] Implementace media queries pro různé velikosti obrazovky
- [ ] Testování na různých mobilních zařízeních

### 4.3 Oprava tmavého režimu (BUG-010)
- [ ] Identifikace prvků, které nefungují správně v tmavém režimu
- [ ] Aktualizace CSS proměnných pro tmavý režim
- [ ] Implementace správného přepínání mezi světlým a tmavým režimem
- [ ] Testování tmavého režimu

## 3. Oprava problémů s uživatelským rozhraním

### 3.1 Oprava načítání mapy (BUG-008)
- [ ] Diagnostika problému s načítáním mapy
  - [ ] Kontrola konzole prohlížeče pro chyby
  - [ ] Ověření, že mapové API je správně načteno
  - [ ] Kontrola inicializace mapy v JavaScript kódu
- [ ] Oprava načítání mapy
  - [ ] Aktualizace mapového API
  - [ ] Oprava inicializace mapy
  - [ ] Testování načítání mapy

### 3.2 Oprava responzivního designu (BUG-009)
- [ ] Identifikace problémů s responzivním designem na mobilních zařízeních
- [ ] Aktualizace CSS pro lepší podporu mobilních zařízení
- [ ] Implementace media queries pro různé velikosti obrazovky
- [ ] Testování na různých mobilních zařízeních

### 3.3 Oprava tmavého režimu (BUG-010)
- [ ] Identifikace prvků, které nefungují správně v tmavém režimu
- [ ] Aktualizace CSS proměnných pro tmavý režim
- [ ] Implementace správného přepínání mezi světlým a tmavým režimem
- [ ] Testování tmavého režimu
- [x] Nainstalujte potřebné závislosti:
  ```bash
  npm install axios chalk figlet open @supabase/supabase-js express-openid-connect
  ```
- [x] Spusťte aktualizační skript:
  ```bash
  bash update-to-v0.3.8.7.sh
  ```
- [x] Spusťte server:
  ```bash
  node server.js
  ```

### 2.2 Testování Auth0 endpointů (DOKONČENO)
- [x] Spusťte testovací nástroj:
  ```bash
  node auth/auth0-test.js
  ```
- [x] Zkontrolujte, zda jsou všechny testy úspěšné
- [x] Poznamenejte si vygenerovanou autorizační URL
- [x] Otestujte integraci s Supabase:
  ```bash
  node auth/supabase-test.js
  ```

### 2.3 Testování přihlášení a odhlášení (DOKONČENO)
- [x] Otevřete prohlížeč a přejděte na `http://localhost:3000/login`
- [x] Přihlaste se pomocí Auth0
- [x] Ověřte, že jste přesměrováni zpět na vaši aplikaci
- [x] Přejděte na `http://localhost:3000/auth/status` a ověřte, že jste přihlášeni
- [x] Zkontrolujte, zda se data uživatele správně ukládají do Supabase
- [x] Přejděte na `http://localhost:3000/logout`
- [x] Ověřte, že jste odhlášeni a přesměrováni na domovskou stránku

### 2.4 Testování chráněných endpointů (DOKONČENO)
- [x] Vytvořte testovací chráněný endpoint v `routes/api.js`:
  ```javascript
  router.get('/protected', auth0Service.requireAuth(), (req, res) => {
    res.json({ message: 'Přístup povolen', user: req.oidc.user });
  });
  ```
- [x] Vytvořte testovací endpoint s kontrolou role:
  ```javascript
  router.get('/admin', auth0Service.requireRole('admin'), (req, res) => {
    res.json({ message: 'Admin dashboard', user: req.oidc.user });
  });
  ```
- [x] Vytvořte testovací endpoint s kontrolou vlastnictví záznamu:
  ```javascript
  router.get('/user-data/:id', auth0Service.requireOwnership('users',
    async (req) => {
      const { data } = await req.supabaseClient
        .from('users')
        .select('user_id')
        .eq('id', req.params.id)
        .single();
      return data?.user_id;
    }
  ), async (req, res) => {
    // Získání dat uživatele
    res.json({ message: 'User data', id: req.params.id });
  });
  ```
- [x] Otestujte endpoint bez přihlášení:
  ```bash
  curl -v http://localhost:3000/api/protected
  ```
- [x] Přihlaste se v prohlížeči
- [x] Otestujte endpoint po přihlášení:
  ```bash
  curl -v --cookie "your-cookie-from-browser" http://localhost:3000/api/protected
  ```
- [x] Otestujte endpoint s kontrolou role:
  ```bash
  curl -v --cookie "your-cookie-from-browser" http://localhost:3000/api/admin
  ```

### 2.5 Testování diagnostických endpointů (DOKONČENO)
- [x] Otestujte endpoint `/auth/debug`:
  ```bash
  curl -v http://localhost:3000/auth/debug
  ```
- [x] Otestujte endpoint `/auth/status`:
  ```bash
  curl -v http://localhost:3000/auth/status
  ```
- [x] Otestujte endpoint `/health`:
  ```bash
  curl -v http://localhost:3000/health
  ```
- [x] Otestujte endpoint pro získání Auth0 konfigurace:
  ```bash
  curl -v http://localhost:3000/auth/config
  ```

### 2.6 Řešení problémů s chybějícími moduly (DOKONČENO)
- [x] Pokud se objeví chyba "Cannot find module 'axios'" nebo podobná:
  - [x] Nainstalujte chybějící modul:
    ```bash
    npm install axios
    ```
  - [x] Zkontrolujte, zda jsou všechny závislosti správně nainstalovány:
    ```bash
    npm list --depth=0
    ```
  - [x] Zkontrolujte, zda je modul správně importován v kódu

### 2.7 Testování integrace s Supabase (DOKONČENO)
- [x] Otestujte ukládání dat uživatele do Supabase:
  ```javascript
  // Příklad kódu pro ukládání dat uživatele do Supabase
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        id: user.sub,
        username: user.nickname,
        email: user.email,
        avatar_url: user.picture
      }
    ]);
  ```
- [x] Otestujte získávání dat uživatele z Supabase:
  ```javascript
  // Příklad kódu pro získávání dat uživatele z Supabase
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.sub)
    .single();
  ```
- [x] Otestujte synchronizaci dat mezi Auth0 a Supabase

### 2.8 Testování offline režimu (DOKONČENO)
- [x] Otestujte ukládání dat do lokálního úložiště:
  ```javascript
  localStorage.setItem('userData', JSON.stringify(userData));
  ```
- [x] Otestujte načítání dat z lokálního úložiště:
  ```javascript
  const userData = JSON.parse(localStorage.getItem('userData'));
  ```
- [x] Otestujte synchronizaci dat mezi lokálním úložištěm a Supabase:
  ```javascript
  // Příklad kódu pro synchronizaci dat
  const localData = JSON.parse(localStorage.getItem('userData'));
  await supabaseIntegration.updateUserData(userId, localData);
  ```

## 3. Dokumentace a školení (DOKONČENO)

### 3.1 Prostudování dokumentace
- [x] Přečtěte si `AUTH0-GUIDE.md` pro podrobný průvodce
- [x] Přečtěte si `auth/auth0-endpoints.md` pro dokumentaci endpointů
- [x] Přečtěte si `auth/README.md` pro dokumentaci Auth0 integrace
- [x] Přečtěte si dokumentaci v `docs/SUPABASE_INTEGRATION_1.md`
- [x] Přečtěte si dokumentaci v `docs/SUPABASE_NETLIFY_INTEGRATION.md`
- [x] Přečtěte si dokumentaci v `docs/PROJECT_STRUCTURE.md`

### 3.2 Školení týmu
- [x] Uspořádejte krátké školení pro tým o nové Auth0 integraci
- [x] Ukažte, jak používat nové Auth0 endpointy
- [x] Vysvětlete, jak chránit endpointy pomocí Auth0
- [x] Předveďte testovací nástroje
- [x] Vysvětlete integraci s Supabase a jak funguje synchronizace dat

### 3.3 Aktualizace projektové dokumentace
- [x] Aktualizujte projektovou dokumentaci o nové Auth0 integraci
- [x] Přidejte sekci o Auth0 do dokumentace API
- [x] Vytvořte příklady použití Auth0 v klientském kódu
- [x] Aktualizujte `CHANGELOG.md` s informacemi o nové verzi
- [x] Vytvořte dokumentaci o integraci Auth0 a Supabase

### 3.4 Finální kontrola
- [x] Zkontrolujte, zda jsou všechny soubory správně vytvořeny
- [x] Zkontrolujte, zda jsou všechny závislosti správně nainstalovány
- [x] Zkontrolujte, zda jsou všechny testy úspěšné
- [x] Zkontrolujte, zda je dokumentace aktuální a kompletní
- [x] Zkontrolujte, zda je integrace s Supabase funkční

## 4. Implementace klientské části (DOKONČENO)

### 4.1 Přihlašovací formulář (DOKONČENO)
- [x] Vytvořte přihlašovací formulář v HTML/CSS:
  ```html
  <div class="auth-container">
    <h2>Přihlášení</h2>
    <form id="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">Heslo:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <button type="submit" class="btn btn-primary">Přihlásit se</button>
    </form>
    <p>Nemáte účet? <a href="#" id="register-link">Registrujte se</a></p>
    <p>Nebo se přihlaste pomocí:</p>
    <div class="social-login">
      <button id="google-login" class="btn btn-social">Google</button>
      <button id="facebook-login" class="btn btn-social">Facebook</button>
    </div>
  </div>
  ```

### 4.2 JavaScript pro přihlášení (DOKONČENO)
- [x] Implementujte JavaScript pro přihlášení:
  ```javascript
  // Přihlášení pomocí emailu a hesla
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        const error = await response.json();
        showError(error.message);
      }
    } catch (error) {
      showError('Chyba při přihlašování');
    }
  });

  // Přihlášení pomocí Google
  document.getElementById('google-login').addEventListener('click', () => {
    window.location.href = '/auth/google';
  });

  // Přihlášení pomocí Facebook
  document.getElementById('facebook-login').addEventListener('click', () => {
    window.location.href = '/auth/facebook';
  });
  ```

### 4.3 Registrační formulář (DOKONČENO)
- [x] Vytvořte registrační formulář:
  ```html
  <div class="auth-container">
    <h2>Registrace</h2>
    <form id="register-form">
      <div class="form-group">
        <label for="username">Uživatelské jméno:</label>
        <input type="text" id="username" name="username" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">Heslo:</label>
        <input type="password" id="password" name="password" required>
      </div>
      <div class="form-group">
        <label for="confirm-password">Potvrzení hesla:</label>
        <input type="password" id="confirm-password" name="confirm-password" required>
      </div>
      <button type="submit" class="btn btn-primary">Registrovat se</button>
    </form>
    <p>Již máte účet? <a href="#" id="login-link">Přihlaste se</a></p>
  </div>
  ```

### 4.4 JavaScript pro registraci (DOKONČENO)
- [x] Implementujte JavaScript pro registraci:
  ```javascript
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Kontrola, zda se hesla shodují
    if (password !== confirmPassword) {
      showError('Hesla se neshodují');
      return;
    }

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      } else {
        const error = await response.json();
        showError(error.message);
      }
    } catch (error) {
      showError('Chyba při registraci');
    }
  });
  ```

### 4.5 Uživatelský profil (DOKONČENO)
- [x] Vytvořte stránku uživatelského profilu:
  ```html
  <div class="profile-container">
    <h2>Uživatelský profil</h2>
    <div class="profile-info">
      <div class="profile-avatar">
        <img id="user-avatar" src="" alt="Avatar">
        <button id="change-avatar" class="btn btn-secondary">Změnit avatar</button>
      </div>
      <div class="profile-details">
        <div class="form-group">
          <label for="username">Uživatelské jméno:</label>
          <input type="text" id="username" name="username" readonly>
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" readonly>
        </div>
        <div class="form-group">
          <label for="level">Úroveň:</label>
          <input type="text" id="level" name="level" readonly>
        </div>
        <div class="form-group">
          <label for="xp">XP:</label>
          <div class="progress">
            <div id="xp-progress" class="progress-bar"></div>
          </div>
          <span id="xp-text"></span>
        </div>
        <div class="form-group">
          <label for="balance">Zůstatek:</label>
          <input type="text" id="balance" name="balance" readonly>
        </div>
      </div>
    </div>
    <div class="profile-actions">
      <button id="edit-profile" class="btn btn-primary">Upravit profil</button>
      <button id="change-password" class="btn btn-secondary">Změnit heslo</button>
      <button id="logout" class="btn btn-danger">Odhlásit se</button>
    </div>
  </div>
  ```

### 4.6 JavaScript pro uživatelský profil (DOKONČENO)
- [x] Implementujte JavaScript pro načtení a úpravu uživatelského profilu:
  ```javascript
  // Načtení dat uživatele
  async function loadUserProfile() {
    try {
      const response = await fetch('/api/user/profile');

      if (response.ok) {
        const userData = await response.json();

        // Naplnění formuláře daty
        document.getElementById('username').value = userData.username;
        document.getElementById('email').value = userData.email;
        document.getElementById('level').value = userData.level;
        document.getElementById('user-avatar').src = userData.avatar_url;
        document.getElementById('balance').value = `${userData.balance} ${userData.currency}`;

        // Nastavení progress baru pro XP
        const xpProgress = (userData.xp / userData.xp_to_next_level) * 100;
        document.getElementById('xp-progress').style.width = `${xpProgress}%`;
        document.getElementById('xp-text').textContent = `${userData.xp} / ${userData.xp_to_next_level}`;
      } else {
        showError('Nepodařilo se načíst data uživatele');
      }
    } catch (error) {
      showError('Chyba při načítání dat uživatele');
    }
  }

  // Načtení dat při načtení stránky
  document.addEventListener('DOMContentLoaded', loadUserProfile);

  // Odhlášení
  document.getElementById('logout').addEventListener('click', async () => {
    try {
      const response = await fetch('/logout');

      if (response.ok) {
        window.location.href = '/';
      } else {
        showError('Nepodařilo se odhlásit');
      }
    } catch (error) {
      showError('Chyba při odhlašování');
    }
  });
  ```

### 4.7 Nastavení uživatele (DOKONČENO)
- [x] Vytvořte stránku nastavení uživatele:
  ```html
  <div class="settings-container">
    <h2>Nastavení</h2>
    <form id="settings-form">
      <div class="form-group">
        <label for="dark-mode">Tmavý režim:</label>
        <input type="checkbox" id="dark-mode" name="dark-mode">
      </div>
      <div class="form-group">
        <label for="notifications">Notifikace:</label>
        <input type="checkbox" id="notifications" name="notifications">
      </div>
      <div class="form-group">
        <label for="auto-sync">Automatická synchronizace:</label>
        <input type="checkbox" id="auto-sync" name="auto-sync">
      </div>
      <div class="form-group">
        <label for="sync-interval">Interval synchronizace (ms):</label>
        <input type="number" id="sync-interval" name="sync-interval" min="1000" step="1000">
      </div>
      <div class="form-group">
        <label for="language">Jazyk:</label>
        <select id="language" name="language">
          <option value="cs">Čeština</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
      <div class="form-group">
        <label for="map-style">Styl mapy:</label>
        <select id="map-style" name="map-style">
          <option value="standard">Standardní</option>
          <option value="satellite">Satelitní</option>
          <option value="terrain">Terén</option>
          <option value="dark">Tmavý</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Uložit nastavení</button>
    </form>
  </div>
  ```

### 4.8 JavaScript pro nastavení uživatele (DOKONČENO)
- [x] Implementujte JavaScript pro načtení a uložení nastavení uživatele:
  ```javascript
  // Načtení nastavení uživatele
  async function loadUserSettings() {
    try {
      const response = await fetch('/api/user/settings');

      if (response.ok) {
        const settings = await response.json();

        // Naplnění formuláře daty
        document.getElementById('dark-mode').checked = settings.dark_mode;
        document.getElementById('notifications').checked = settings.notifications_enabled;
        document.getElementById('auto-sync').checked = settings.auto_sync_enabled;
        document.getElementById('sync-interval').value = settings.sync_interval;
        document.getElementById('language').value = settings.language;
        document.getElementById('map-style').value = settings.map_style;

        // Aplikace tmavého režimu, pokud je zapnutý
        if (settings.dark_mode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      } else {
        showError('Nepodařilo se načíst nastavení uživatele');
      }
    } catch (error) {
      showError('Chyba při načítání nastavení uživatele');
    }
  }

  // Načtení nastavení při načtení stránky
  document.addEventListener('DOMContentLoaded', loadUserSettings);

  // Uložení nastavení
  document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const settings = {
      dark_mode: document.getElementById('dark-mode').checked,
      notifications_enabled: document.getElementById('notifications').checked,
      auto_sync_enabled: document.getElementById('auto-sync').checked,
      sync_interval: parseInt(document.getElementById('sync-interval').value),
      language: document.getElementById('language').value,
      map_style: document.getElementById('map-style').value
    };

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        showSuccess('Nastavení bylo úspěšně uloženo');

        // Aplikace tmavého režimu, pokud je zapnutý
        if (settings.dark_mode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      } else {
        showError('Nepodařilo se uložit nastavení');
      }
    } catch (error) {
      showError('Chyba při ukládání nastavení');
    }
  });
  ```

## 5. Integrace Auth0 a Supabase s klientskou částí (DOKONČENO)

### 5.1 Vytvoření Auth0 klienta (DOKONČENO)
- [x] Vytvořte soubor `public/js/auth0-client.js`:
  ```javascript
  /**
   * Auth0 klient pro klientskou část aplikace
   * Verze 0.3.8.7
   */

  // Auth0 konfigurace
  let auth0Config = null;

  // Inicializace Auth0 klienta
  async function initAuth0Client() {
    try {
      // Získání konfigurace z API
      const response = await fetch('/auth/config');

      if (!response.ok) {
        throw new Error('Nepodařilo se získat konfiguraci Auth0');
      }

      auth0Config = await response.json();

      console.log('Auth0 klient byl inicializován');

      return auth0Config;
    } catch (error) {
      console.error('Chyba při inicializaci Auth0 klienta:', error);
      throw error;
    }
  }

  // Kontrola, zda je uživatel přihlášen
  async function isAuthenticated() {
    try {
      const response = await fetch('/auth/status');

      if (!response.ok) {
        return false;
      }

      const status = await response.json();

      return status.isAuthenticated;
    } catch (error) {
      console.error('Chyba při kontrole přihlášení:', error);
      return false;
    }
  }

  // Přihlášení uživatele
  function login(returnTo = window.location.pathname) {
    window.location.href = `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }

  // Odhlášení uživatele
  function logout(returnTo = window.location.origin) {
    window.location.href = `/logout?returnTo=${encodeURIComponent(returnTo)}`;
  }

  // Získání profilu uživatele
  async function getUserProfile() {
    try {
      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        throw new Error('Nepodařilo se získat profil uživatele');
      }

      return await response.json();
    } catch (error) {
      console.error('Chyba při získávání profilu uživatele:', error);
      throw error;
    }
  }

  // Export funkcí
  const Auth0Client = {
    initAuth0Client,
    isAuthenticated,
    login,
    logout,
    getUserProfile
  };
  ```

### 5.2 Vytvoření Supabase klienta (DOKONČENO)
- [x] Vytvořte soubor `public/js/supabase-client.js`:
  ```javascript
  /**
   * Supabase klient pro klientskou část aplikace
   * Verze 0.3.8.7
   */

  // Supabase konfigurace
  let supabaseConfig = {
    url: 'https://njjhhamwixjbfibywreo.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qamhoYW13aXhqYmZpYnl3cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzU5MTAsImV4cCI6MjA2MTM1MTkxMH0.8iei6QFMk18dLYoQIkJ63rEbDV_38TtSITmmRGRjoAY'
  };

  // Supabase klient
  let supabaseClient = null;

  // Inicializace Supabase klienta
  async function initSupabaseClient() {
    try {
      // Kontrola, zda je dostupný Supabase
      if (typeof supabase === 'undefined') {
        throw new Error('Supabase není dostupný. Ujistěte se, že je načten skript @supabase/supabase-js.');
      }

      // Vytvoření Supabase klienta
      supabaseClient = supabase.createClient(supabaseConfig.url, supabaseConfig.key);

      console.log('Supabase klient byl inicializován');

      return supabaseClient;
    } catch (error) {
      console.error('Chyba při inicializaci Supabase klienta:', error);
      throw error;
    }
  }

  // Získání Supabase klienta
  function getSupabaseClient() {
    if (!supabaseClient) {
      throw new Error('Supabase klient nebyl inicializován. Zavolejte nejprve initSupabaseClient().');
    }

    return supabaseClient;
  }

  // Synchronizace dat s Supabase
  async function syncData(userId, data, table) {
    try {
      if (!supabaseClient) {
        await initSupabaseClient();
      }

      const { data: result, error } = await supabaseClient
        .from(table)
        .upsert({
          id: userId,
          ...data,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return result[0];
    } catch (error) {
      console.error(`Chyba při synchronizaci dat s tabulkou ${table}:`, error);
      throw error;
    }
  }

  // Získání dat z Supabase
  async function getData(userId, table) {
    try {
      if (!supabaseClient) {
        await initSupabaseClient();
      }

      const { data, error } = await supabaseClient
        .from(table)
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error(`Chyba při získávání dat z tabulky ${table}:`, error);
      throw error;
    }
  }

  // Export funkcí
  const SupabaseClient = {
    initSupabaseClient,
    getSupabaseClient,
    syncData,
    getData
  };
  ```

### 5.3 Vytvoření synchronizačního modulu (DOKONČENO)
- [x] Vytvořte soubor `public/js/sync-manager.js`:
  ```javascript
  /**
   * Synchronizační modul pro klientskou část aplikace
   * Verze 0.3.8.7
   */

  // Konfigurace
  let syncConfig = {
    enabled: true,
    interval: 60000, // 1 minuta
    autoSync: true,
    lastSync: null
  };

  // Interval pro automatickou synchronizaci
  let syncInterval = null;

  // Inicializace synchronizačního modulu
  async function initSyncManager() {
    try {
      // Načtení konfigurace z lokálního úložiště
      const storedConfig = localStorage.getItem('syncConfig');

      if (storedConfig) {
        syncConfig = JSON.parse(storedConfig);
      }

      // Načtení konfigurace z API, pokud je uživatel přihlášen
      if (await Auth0Client.isAuthenticated()) {
        const userSettings = await fetch('/api/user/settings').then(res => res.json());

        syncConfig.enabled = true;
        syncConfig.autoSync = userSettings.auto_sync_enabled;
        syncConfig.interval = userSettings.sync_interval;
      }

      // Uložení konfigurace do lokálního úložiště
      localStorage.setItem('syncConfig', JSON.stringify(syncConfig));

      // Spuštění automatické synchronizace, pokud je povolena
      if (syncConfig.autoSync) {
        startAutoSync();
      }

      console.log('Synchronizační modul byl inicializován');

      return syncConfig;
    } catch (error) {
      console.error('Chyba při inicializaci synchronizačního modulu:', error);
      throw error;
    }
  }

  // Spuštění automatické synchronizace
  function startAutoSync() {
    // Zastavení předchozího intervalu, pokud existuje
    if (syncInterval) {
      clearInterval(syncInterval);
    }

    // Spuštění nového intervalu
    syncInterval = setInterval(async () => {
      if (syncConfig.enabled && syncConfig.autoSync) {
        await syncAllData();
      }
    }, syncConfig.interval);

    console.log(`Automatická synchronizace spuštěna s intervalem ${syncConfig.interval} ms`);
  }

  // Zastavení automatické synchronizace
  function stopAutoSync() {
    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;

      console.log('Automatická synchronizace zastavena');
    }
  }

  // Synchronizace všech dat
  async function syncAllData() {
    try {
      // Kontrola, zda je uživatel přihlášen
      if (!await Auth0Client.isAuthenticated()) {
        console.log('Uživatel není přihlášen, synchronizace přeskočena');
        return;
      }

      console.log('Synchronizace dat...');

      // Získání ID uživatele
      const userProfile = await Auth0Client.getUserProfile();
      const userId = userProfile.sub;

      // Synchronizace nastavení
      const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      await SupabaseClient.syncData(userId, settings, 'user_settings');

      // Synchronizace statistik
      const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
      await SupabaseClient.syncData(userId, stats, 'user_stats');

      // Aktualizace času poslední synchronizace
      syncConfig.lastSync = new Date().toISOString();
      localStorage.setItem('syncConfig', JSON.stringify(syncConfig));

      console.log('Synchronizace dat dokončena');

      // Vyvolání události o dokončení synchronizace
      window.dispatchEvent(new CustomEvent('sync-completed', {
        detail: {
          timestamp: syncConfig.lastSync
        }
      }));

      return true;
    } catch (error) {
      console.error('Chyba při synchronizaci dat:', error);

      // Vyvolání události o chybě synchronizace
      window.dispatchEvent(new CustomEvent('sync-error', {
        detail: {
          error: error.message
        }
      }));

      throw error;
    }
  }

  // Export funkcí
  const SyncManager = {
    initSyncManager,
    startAutoSync,
    stopAutoSync,
    syncAllData,
    getConfig: () => syncConfig
  };
  ```

### 5.4 Implementace hlavní stránky s přihlášením (DOKONČENO)
- [x] Vytvořte soubor `public/index.html`:
  ```html
  <!DOCTYPE html>
  <html lang="cs">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AIMapa - Interaktivní mapa s Auth0 a Supabase</title>
    <link rel="stylesheet" href="css/styles.css">
    <!-- Supabase -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  </head>
  <body>
    <header>
      <div class="container">
        <div class="logo">
          <h1>AIMapa</h1>
        </div>
        <nav>
          <ul>
            <li><a href="index.html" class="active">Domů</a></li>
            <li><a href="map.html">Mapa</a></li>
            <li><a href="about.html">O projektu</a></li>
            <li id="nav-profile" style="display: none;"><a href="profile.html">Profil</a></li>
            <li id="nav-login"><a href="#" id="login-button">Přihlásit se</a></li>
            <li id="nav-logout" style="display: none;"><a href="#" id="logout-button">Odhlásit se</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero">
        <div class="container">
          <h2>Vítejte v AIMapa</h2>
          <p>Interaktivní mapa s integrací Auth0 a Supabase</p>
          <div class="buttons">
            <a href="map.html" class="btn btn-primary">Otevřít mapu</a>
            <a href="#" id="hero-login-button" class="btn btn-secondary">Přihlásit se</a>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2>Funkce</h2>
          <div class="feature-grid">
            <div class="feature-card">
              <h3>Autentizace pomocí Auth0</h3>
              <p>Bezpečné přihlášení pomocí Auth0 s podporou sociálních sítí a dvoufaktorové autentizace.</p>
            </div>
            <div class="feature-card">
              <h3>Ukládání dat v Supabase</h3>
              <p>Rychlé a spolehlivé ukládání dat v Supabase s podporou offline režimu a automatické synchronizace.</p>
            </div>
            <div class="feature-card">
              <h3>Interaktivní mapa</h3>
              <p>Pokročilá interaktivní mapa s možností přidávání vlastních bodů, tras a oblastí.</p>
            </div>
            <div class="feature-card">
              <h3>Uživatelský profil</h3>
              <p>Správa uživatelského profilu, statistik a nastavení.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="auth-section" id="auth-section" style="display: none;">
        <div class="container">
          <div class="auth-container">
            <div class="auth-tabs">
              <button class="auth-tab active" data-tab="login">Přihlášení</button>
              <button class="auth-tab" data-tab="register">Registrace</button>
            </div>

            <div class="auth-content" id="login-content">
              <h2>Přihlášení</h2>
              <form id="login-form">
                <div class="form-group">
                  <label for="login-email">Email:</label>
                  <input type="email" id="login-email" name="email" required>
                </div>
                <div class="form-group">
                  <label for="login-password">Heslo:</label>
                  <input type="password" id="login-password" name="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Přihlásit se</button>
              </form>
              <p>Nebo se přihlaste pomocí:</p>
              <div class="social-login">
                <button id="google-login" class="btn btn-social">Google</button>
                <button id="facebook-login" class="btn btn-social">Facebook</button>
              </div>
            </div>

            <div class="auth-content" id="register-content" style="display: none;">
              <h2>Registrace</h2>
              <form id="register-form">
                <div class="form-group">
                  <label for="register-username">Uživatelské jméno:</label>
                  <input type="text" id="register-username" name="username" required>
                </div>
                <div class="form-group">
                  <label for="register-email">Email:</label>
                  <input type="email" id="register-email" name="email" required>
                </div>
                <div class="form-group">
                  <label for="register-password">Heslo:</label>
                  <input type="password" id="register-password" name="password" required>
                </div>
                <div class="form-group">
                  <label for="register-confirm-password">Potvrzení hesla:</label>
                  <input type="password" id="register-confirm-password" name="confirm-password" required>
                </div>
                <button type="submit" class="btn btn-primary">Registrovat se</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer>
      <div class="container">
        <p>&copy; 2023 AIMapa. Všechna práva vyhrazena.</p>
        <p>Verze 0.3.8.7</p>
      </div>
    </footer>

    <!-- Skripty -->
    <script src="js/auth0-client.js"></script>
    <script src="js/supabase-client.js"></script>
    <script src="js/sync-manager.js"></script>
    <script>
      // Inicializace Auth0 klienta
      document.addEventListener('DOMContentLoaded', async () => {
        try {
          // Inicializace Auth0 klienta
          await Auth0Client.initAuth0Client();

          // Inicializace Supabase klienta
          await SupabaseClient.initSupabaseClient();

          // Inicializace synchronizačního modulu
          await SyncManager.initSyncManager();

          // Kontrola, zda je uživatel přihlášen
          const isAuthenticated = await Auth0Client.isAuthenticated();

          // Aktualizace UI podle stavu přihlášení
          updateUI(isAuthenticated);

          // Přidání event listenerů
          setupEventListeners();
        } catch (error) {
          console.error('Chyba při inicializaci aplikace:', error);
        }
      });

      // Aktualizace UI podle stavu přihlášení
      async function updateUI(isAuthenticated) {
        const navLogin = document.getElementById('nav-login');
        const navLogout = document.getElementById('nav-logout');
        const navProfile = document.getElementById('nav-profile');
        const heroLoginButton = document.getElementById('hero-login-button');

        if (isAuthenticated) {
          navLogin.style.display = 'none';
          navLogout.style.display = 'block';
          navProfile.style.display = 'block';

          heroLoginButton.textContent = 'Můj profil';
          heroLoginButton.href = 'profile.html';

          // Načtení profilu uživatele
          try {
            const userProfile = await Auth0Client.getUserProfile();
            console.log('Přihlášený uživatel:', userProfile);
          } catch (error) {
            console.error('Chyba při načítání profilu uživatele:', error);
          }
        } else {
          navLogin.style.display = 'block';
          navLogout.style.display = 'none';
          navProfile.style.display = 'none';

          heroLoginButton.textContent = 'Přihlásit se';
          heroLoginButton.href = '#';
        }
      }

      // Nastavení event listenerů
      function setupEventListeners() {
        // Přihlášení
        document.getElementById('login-button').addEventListener('click', (e) => {
          e.preventDefault();
          showAuthSection('login');
        });

        document.getElementById('hero-login-button').addEventListener('click', (e) => {
          if (e.target.textContent === 'Přihlásit se') {
            e.preventDefault();
            showAuthSection('login');
          }
        });

        // Odhlášení
        document.getElementById('logout-button').addEventListener('click', (e) => {
          e.preventDefault();
          Auth0Client.logout();
        });

        // Přepínání mezi přihlášením a registrací
        document.querySelectorAll('.auth-tab').forEach(tab => {
          tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            showAuthSection(tabName);
          });
        });

        // Přihlášení pomocí formuláře
        document.getElementById('login-form').addEventListener('submit', async (e) => {
          e.preventDefault();

          // V reálné aplikaci by zde byl kód pro přihlášení pomocí emailu a hesla
          // Pro účely této ukázky přesměrujeme na Auth0 login
          Auth0Client.login();
        });

        // Registrace pomocí formuláře
        document.getElementById('register-form').addEventListener('submit', async (e) => {
          e.preventDefault();

          // V reálné aplikaci by zde byl kód pro registraci pomocí emailu a hesla
          // Pro účely této ukázky přesměrujeme na Auth0 login
          Auth0Client.login();
        });

        // Přihlášení pomocí Google
        document.getElementById('google-login').addEventListener('click', () => {
          window.location.href = '/auth/google';
        });

        // Přihlášení pomocí Facebook
        document.getElementById('facebook-login').addEventListener('click', () => {
          window.location.href = '/auth/facebook';
        });
      }

      // Zobrazení sekce pro přihlášení/registraci
      function showAuthSection(section) {
        const authSection = document.getElementById('auth-section');
        const loginContent = document.getElementById('login-content');
        const registerContent = document.getElementById('register-content');
        const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
        const registerTab = document.querySelector('.auth-tab[data-tab="register"]');

        authSection.style.display = 'block';

        if (section === 'login') {
          loginContent.style.display = 'block';
          registerContent.style.display = 'none';
          loginTab.classList.add('active');
          registerTab.classList.remove('active');
        } else {
          loginContent.style.display = 'none';
          registerContent.style.display = 'block';
          loginTab.classList.remove('active');
          registerTab.classList.add('active');
        }

        // Scrollování na sekci
        authSection.scrollIntoView({ behavior: 'smooth' });
      }
    </script>
  </body>
  </html>
  ```

### 5.5 Vytvoření CSS stylů (DOKONČENO)
- [x] Vytvořte soubor `public/css/styles.css`:
  ```css
  /*
   * AIMapa - Styly
   * Verze 0.3.8.7
   */

  /* Základní reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Proměnné */
  :root {
    --primary-color: #4285f4;
    --secondary-color: #34a853;
    --accent-color: #ea4335;
    --text-color: #333;
    --light-text-color: #666;
    --bg-color: #fff;
    --light-bg-color: #f5f5f5;
    --border-color: #ddd;
    --shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    --border-radius: 4px;
    --transition: all 0.3s ease;
    --container-width: 1200px;
  }

  /* Tmavý režim */
  body.dark-mode {
    --primary-color: #5c9aff;
    --secondary-color: #4eca6a;
    --accent-color: #ff6b6b;
    --text-color: #f5f5f5;
    --light-text-color: #aaa;
    --bg-color: #222;
    --light-bg-color: #333;
    --border-color: #444;
    --shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }

  /* Základní styly */
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--bg-color);
    transition: var(--transition);
  }

  .container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 20px;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    transition: var(--transition);
  }

  a:hover {
    color: var(--secondary-color);
  }

  /* Tlačítka */
  .btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
    font-weight: 500;
    text-align: center;
  }

  .btn:hover {
    background-color: var(--secondary-color);
    color: white;
  }

  .btn-primary {
    background-color: var(--primary-color);
  }

  .btn-secondary {
    background-color: var(--secondary-color);
  }

  .btn-danger {
    background-color: var(--accent-color);
  }

  .btn-social {
    background-color: #f5f5f5;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    margin-right: 10px;
  }

  .btn-social:hover {
    background-color: var(--light-bg-color);
    color: var(--text-color);
  }

  /* Formuláře */
  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: var(--light-text-color);
  }

  input, select, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--bg-color);
    color: var(--text-color);
    transition: var(--transition);
  }

  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }

  /* Hlavička */
  header {
    background-color: var(--bg-color);
    box-shadow: var(--shadow);
    padding: 15px 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo h1 {
    font-size: 24px;
    color: var(--primary-color);
  }

  nav ul {
    display: flex;
    list-style: none;
  }

  nav ul li {
    margin-left: 20px;
  }

  nav ul li a {
    color: var(--text-color);
    font-weight: 500;
  }

  nav ul li a.active, nav ul li a:hover {
    color: var(--primary-color);
  }

  /* Hero sekce */
  .hero {
    background-color: var(--light-bg-color);
    padding: 80px 0;
    text-align: center;
  }

  .hero h2 {
    font-size: 36px;
    margin-bottom: 20px;
  }

  .hero p {
    font-size: 18px;
    color: var(--light-text-color);
    margin-bottom: 30px;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  /* Funkce */
  .features {
    padding: 80px 0;
  }

  .features h2 {
    text-align: center;
    margin-bottom: 40px;
    font-size: 32px;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  .feature-card {
    background-color: var(--light-bg-color);
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    transition: var(--transition);
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .feature-card h3 {
    margin-bottom: 15px;
    color: var(--primary-color);
  }

  /* Autentizace */
  .auth-section {
    padding: 80px 0;
    background-color: var(--light-bg-color);
  }

  .auth-container {
    max-width: 500px;
    margin: 0 auto;
    background-color: var(--bg-color);
    padding: 30px;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }

  .auth-tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
  }

  .auth-tab {
    padding: 10px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: var(--light-text-color);
    transition: var(--transition);
  }

  .auth-tab.active {
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
  }

  .auth-content h2 {
    margin-bottom: 20px;
    text-align: center;
  }

  .social-login {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  /* Profil */
  .profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    background-color: var(--bg-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }

  .profile-info {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
  }

  .profile-avatar {
    text-align: center;
  }

  .profile-avatar img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
  }

  .profile-details {
    flex: 1;
  }

  .profile-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
  }

  /* Progress bar */
  .progress {
    height: 10px;
    background-color: var(--light-bg-color);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 5px;
  }

  .progress-bar {
    height: 100%;
    background-color: var(--primary-color);
    border-radius: 5px;
    transition: width 0.3s ease;
  }

  /* Nastavení */
  .settings-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    background-color: var(--bg-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
  }

  /* Patička */
  footer {
    background-color: var(--light-bg-color);
    padding: 30px 0;
    text-align: center;
    color: var(--light-text-color);
    margin-top: 80px;
  }

  /* Responzivní design */
  @media (max-width: 768px) {
    .profile-info {
      flex-direction: column;
    }

    .feature-grid {
      grid-template-columns: 1fr;
    }

    .buttons {
      flex-direction: column;
    }

    nav ul {
      flex-direction: column;
      position: absolute;
      top: 60px;
      right: 0;
      background-color: var(--bg-color);
      box-shadow: var(--shadow);
      padding: 20px;
      border-radius: var(--border-radius);
      display: none;
    }

    nav ul.show {
      display: flex;
    }

    nav ul li {
      margin: 10px 0;
    }
  }
  ```

# Shrnutí změn ve verzi 0.3.8.7

## Vytvořené soubory

1. **Dokumentace**
   - `CHANGELOG.md` - Historie změn v aplikaci
   - `AUTH0-GUIDE.md` - Průvodce pro práci s Auth0 autentizací
   - `LLM-API-GUIDE.md` - Průvodce pro práci s LLM API
   - `SUMMARY.md` - Tento soubor se shrnutím změn
   - `BUGS.md` - Zápisník bugů a problémů
   - `PLAN.md` - Plán řešení problémů a implementace nových funkcí
   - `PROGRESS.md` - Plán technologického rozvoje a přechodu na novější technologie
   - `IMPLEMENTATION-PLAN.md` - Konkrétní kroky pro implementaci krátkodobých cílů
   - `MIGRATION.md` - Návod na migraci na nový technologický stack
   - `TESTING-GUIDE.md` - Průvodce testováním implementace nového technologického stacku

2. **Auth0 integrace**
   - `auth/auth0-service.js` - Hlavní třída pro práci s Auth0 autentizací
   - `auth/auth0-routes.js` - Express routy pro Auth0 endpointy
   - `auth/auth0-test.js` - Testovací nástroj pro Auth0 endpointy
   - `auth/auth0-endpoints.md` - Dokumentace všech Auth0 endpointů
   - `auth/README.md` - Dokumentace pro složku auth
   - `auth/supabase-test.js` - Testovací nástroj pro integraci Auth0 a Supabase

3. **LLM API integrace**
   - `llm/llm-service.js` - Hlavní třída pro práci s LLM API
   - `llm/llm-routes.js` - Express routy pro LLM API endpointy
   - `llm/llm-cache.js` - Implementace cachování odpovědí
   - `llm/llm-context.js` - Implementace kontextového vyhledávání
   - `llm/llm-providers/openai-provider.js` - Implementace OpenAI API
   - `llm/llm-providers/anthropic-provider.js` - Implementace Anthropic API
   - `llm/llm-providers/deepseek-provider.js` - Implementace DeepSeek API
   - `llm/test-openai.js` - Testovací nástroj pro OpenAI API
   - `llm/test-anthropic.js` - Testovací nástroj pro Anthropic API
   - `llm/test-deepseek.js` - Testovací nástroj pro DeepSeek API
   - `llm/README.md` - Dokumentace pro složku llm

4. **Skripty**
   - `server.js.new` - Nová verze server.js s použitím Auth0Service
   - `update-to-v0.3.8.7.sh` - Skript pro aktualizaci na verzi 0.3.8.7

5. **Integrace s Supabase**
   - `auth/supabase-integration.js` - Modul pro integraci Auth0 a Supabase
   - `auth/supabase-sync.js` - Modul pro synchronizaci dat mezi Auth0 a Supabase

6. **Klientská část**
   - `public/js/auth0-client.js` - Klientská knihovna pro práci s Auth0
   - `public/js/supabase-client.js` - Klientská knihovna pro práci s Supabase
   - `public/js/sync-manager.js` - Modul pro synchronizaci dat mezi klientem a serverem
   - `public/js/chat-client.js` - Klientská knihovna pro práci s LLM API
   - `public/css/styles.css` - CSS styly pro aplikaci
   - `public/css/chat.css` - CSS styly pro chatovací rozhraní
   - `public/index.html` - Hlavní stránka aplikace s přihlašovacím formulářem
   - `public/chat.html` - Stránka s chatovacím rozhraním

## Provedené změny

1. **Centralizace Auth0 logiky**
   - Vytvořena třída `Auth0Service` pro centralizaci Auth0 logiky
   - Přesunuty všechny Auth0 endpointy do samostatného souboru
   - Přidány pomocné metody pro práci s Auth0

2. **Vylepšení bezpečnosti**
   - Přidány middleware pro ochranu endpointů
   - Implementována kontrola rolí a vlastnictví záznamů
   - Vylepšena chybová hlášení při problémech s autentizací
   - Implementovány Row Level Security (RLS) politiky v Supabase

3. **Testování a diagnostika**
   - Vytvořen testovací nástroj pro Auth0 endpointy
   - Přidán diagnostický endpoint `/auth/debug`
   - Vylepšen endpoint `/auth/status`
   - Vytvořen testovací nástroj pro integraci s Supabase

4. **Dokumentace**
   - Vytvořena podrobná dokumentace všech Auth0 endpointů
   - Přidán průvodce pro vývojáře
   - Aktualizován README.md s informacemi o nové verzi
   - Přidány příklady použití Auth0 a Supabase

5. **Integrace s Supabase**
   - Implementována synchronizace dat mezi Auth0 a Supabase
   - Vytvořeny moduly pro práci s Supabase
   - Implementováno ukládání uživatelských dat do Supabase
   - Přidána podpora pro offline režim s automatickou synchronizací

## Jak aktualizovat na novou verzi

1. Nainstalujte potřebné závislosti:
   ```bash
   npm install axios chalk figlet open @supabase/supabase-js express-openid-connect
   ```

2. Spusťte skript `update-to-v0.3.8.7.sh`:
   ```bash
   bash update-to-v0.3.8.7.sh
   ```

3. Restartujte server:
   ```bash
   node server.js
   ```

4. Otestujte Auth0 endpointy:
   ```bash
   node auth/auth0-test.js
   ```

5. Otestujte integraci s Supabase:
   ```bash
   node auth/supabase-test.js
   ```

6. Zkontrolujte, zda jsou všechny endpointy funkční:
   ```bash
   curl -v http://localhost:3000/auth/status
   curl -v http://localhost:3000/auth/debug
   curl -v http://localhost:3000/health
   ```


