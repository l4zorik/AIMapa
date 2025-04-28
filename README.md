# AIMapa

Interaktivní mapa s AI funkcemi a virtuální prací.

## Popis

AIMapa je webová aplikace, která kombinuje interaktivní mapu s funkcemi umělé inteligence a virtuální práce. Aplikace umožňuje uživatelům:

- Procházet interaktivní mapu
- Virtuálně pracovat a vydělávat virtuální peníze
- Sledovat body na mapě a ukládat cesty
- Využívat AI funkce pro navigaci a doporučení

## Technologie

- **Frontend**: HTML, CSS, JavaScript, Leaflet.js
- **Backend**: Node.js, Express.js
- **Databáze**: MongoDB, Supabase (PostgreSQL)

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

3. Vytvořte soubor `.env` s následujícím obsahem:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/aimapa
   SUPABASE_URL=https://njjhhamwixjbfibywreo.supabase.co
   SUPABASE_KEY=your_supabase_key_here
   POSTGRES_CONNECTION=postgresql://postgres:your_password_here@db.njjhhamwixjbfibywreo.supabase.co:5432/postgres
   ```

   Vzorový soubor najdete v `.env.example`.

4. Spusťte aplikaci:
   ```
   npm start
   ```

5. Otevřete prohlížeč a přejděte na adresu `http://localhost:3000`

## Vývoj

Pro vývojový režim s automatickým restartem serveru při změnách:
```
npm run dev
```

## Struktura projektu

- `public/` - Statické soubory (HTML, CSS, klientský JavaScript)
  - `app/` - Moduly aplikace
  - `css/` - Styly
  - `images/` - Obrázky
  - `index.html` - Hlavní HTML soubor
- `routes/` - API endpointy
- `server.js` - Hlavní soubor serveru
- `package.json` - Konfigurace projektu a závislosti
- `.env` - Konfigurační proměnné prostředí
- `netlify.toml` - Konfigurace pro nasazení na Netlify

## Verze

Aktuální verze: 0.3.8.2

Podrobný seznam změn najdete v souboru [CHANGELOG.md](CHANGELOG.md).

## Nasazení

Aplikace je připravena pro nasazení na Netlify. Pro nasazení:

1. Vytvořte účet na [Netlify](https://www.netlify.com/)
2. Propojte svůj GitHub repozitář
3. Nastavte následující proměnné prostředí v Netlify:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `POSTGRES_CONNECTION`

Aplikace je dostupná na adrese: [https://remarkable-cajeta-76cfd9.netlify.app/](https://remarkable-cajeta-76cfd9.netlify.app/)

## Autor

Jan Lazorik