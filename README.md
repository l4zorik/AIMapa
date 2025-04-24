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
- **Databáze**: MongoDB (připraveno pro implementaci)

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
- `routes/` - API endpointy
- `server.js` - Hlavní soubor serveru
- `package.json` - Konfigurace projektu a závislosti

## Verze

Aktuální verze: 0.3.1.0

Podrobný seznam změn najdete v souboru [CHANGELOG.md](CHANGELOG.md).

## Autor

Jan Lazorik