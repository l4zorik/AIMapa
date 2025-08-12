# AIMapa - Into the known

Interaktivní mapa s AI asistentem, virtuální prací a mnoha dalšími funkcemi.

## Verze 0.3.8.5

Tato verze přináší kompletní reorganizaci kódu, vylepšenou autentizaci s Auth0 a Supabase, a implementaci předplatného pomocí Stripe.

## Popis

AIMapa je webová aplikace, která kombinuje interaktivní mapu s funkcemi umělé inteligence a virtuální práce. Aplikace umožňuje uživatelům:

- Procházet interaktivní mapu s 2D a 3D zobrazením
- Virtuálně pracovat a vydělávat virtuální peníze
- Sledovat body na mapě a ukládat cesty
- Využívat AI asistenta pro navigaci a doporučení
- Spravovat uživatelský profil a statistiky
- Získávat achievementy a odměny
- Sledovat ceny kryptoměn
- Využívat prémiové funkce s předplatným

## Technologie

- **Frontend**: HTML, CSS, JavaScript, Leaflet.js, Three.js
- **Backend**: Node.js, Express.js
- **Databáze**: Supabase (PostgreSQL)
- **Autentizace**: Auth0, Supabase Auth
- **Platby**: Stripe
- **Nasazení**: Netlify

## Struktura projektu

```
AIMapa/
├── public/                     # Veřejné soubory
│   ├── app/                    # Aplikační soubory
│   │   ├── auth/               # Autentizační moduly
│   │   │   ├── auth-service.js # Jednotný autentizační modul
│   │   │   └── user-profile-service.js # Správa uživatelského profilu
│   │   ├── core/               # Základní moduly
│   │   ├── features/           # Funkční moduly
│   │   ├── services/           # Služby
│   │   │   ├── supabase-client.js # Supabase klient
│   │   │   ├── subscription-service.js # Správa předplatného
│   │   │   └── subscription-service-stripe.js # Stripe integrace
│   │   ├── ui/                 # UI komponenty
│   │   └── utils/              # Utility
│   ├── css/                    # CSS soubory
│   ├── img/                    # Obrázky
│   └── index.html              # Hlavní HTML soubor
├── routes/                     # API routy
│   ├── api.js                  # Hlavní API
│   └── stripe.js               # Stripe API
├── supabase/                   # Supabase konfigurace
│   └── migrations/             # SQL migrace
├── tests/                      # Testy
├── .env                        # Konfigurační proměnné
├── package.json                # NPM konfigurace
├── server.js                   # Node.js server
└── README.md                   # Dokumentace
```

## Funkce

- **Mapa**: Interaktivní mapa s možností přidávání bodů, výpočtu tras a zobrazení 3D budov
- **AI Asistent**: Chatovací rozhraní s AI asistentem
- **Virtuální práce**: Systém pro správu virtuálních pracovních úkolů
- **Autentizace**: Jednotný autentizační systém s podporou Auth0 a Supabase
- **Uživatelský profil**: Správa uživatelského profilu, statistik a nastavení
- **Předplatné**: Systém předplatného s integrací Stripe
- **Achievementy**: Systém achievementů a odměn
- **Kryptoměny**: Sledování cen kryptoměn
- **Denní úkoly**: Systém denních úkolů s odměnami

## Autentizace

Aplikace používá jednotný autentizační systém, který integruje Auth0 a Supabase:

1. **Auth0**: Primární poskytovatel autentizace s podporou sociálních přihlášení
2. **Supabase**: Databáze a backend pro ukládání uživatelských dat

## Předplatné

Aplikace nabízí několik úrovní předplatného:

1. **Zdarma**: Základní funkce
2. **Základní**: Rozšířené funkce
3. **Premium**: Pokročilé funkce
4. **Ultimate**: Všechny funkce

## Instalace

1. Naklonujte repozitář:
   ```
   git clone https://github.com/l4zorik/AIMapa.git
   ```

2. Nainstalujte závislosti:
   ```
   cd AIMapa
   npm install
   ```

3. Vytvořte soubor `.env` s konfiguračními proměnnými:
   ```
   PORT=3000

   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key

   # Auth0
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_AUDIENCE=https://your-domain.auth0.com/api/v2/
   AUTH0_CALLBACK_URL=http://localhost:3000
   AUTH0_LOGOUT_URL=http://localhost:3000

   # Stripe
   STRIPE_SECRET_KEY=your-secret-key
   STRIPE_PUBLISHABLE_KEY=your-publishable-key
   STRIPE_WEBHOOK_SECRET=your-webhook-secret
   ```

4. Spusťte aplikaci:
   ```
   npm start
   ```

5. Otevřete aplikaci v prohlížeči:
   ```
   http://localhost:3000
   ```

## Vývoj

Pro vývojový režim s automatickým restartem serveru při změnách:
```
npm run dev
```

## Integrace s Supabase, Auth0 a Stripe

AIMapa je integrována s:
- **Supabase** pro ukládání dat v cloudu
- **Auth0** pro autentizaci uživatelů
- **Stripe** pro zpracování plateb předplatného
- **Netlify** pro automatické nasazení aplikace

## Verze

Aktuální verze: 0.3.8.5

Podrobný seznam změn najdete v souboru [CHANGELOG.md](CHANGELOG.md).

## Autor

Jan Lazorik