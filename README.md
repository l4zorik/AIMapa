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
- **Databáze**: Supabase (PostgreSQL)
- **Nasazení**: Netlify

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
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

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
- `public/app/` - Moduly aplikace
- `routes/` - API endpointy
- `server.js` - Hlavní soubor serveru
- `package.json` - Konfigurace projektu a závislosti
- `netlify.toml` - Konfigurace nasazení na Netlify

## Integrace s Supabase a Netlify

AIMapa je integrována s Supabase pro ukládání dat v cloudu a autentizaci uživatelů, a s Netlify pro automatické nasazení aplikace. Podrobné informace o integraci najdete v souboru [SUPABASE_NETLIFY_INTEGRATION.md](SUPABASE_NETLIFY_INTEGRATION.md).

## Verze

Aktuální verze: 0.3.8.4

Podrobný seznam změn najdete v souboru [CHANGELOG.md](CHANGELOG.md).

## Autor

Jan Lazorik