# AIMapa

Interaktivní mapa s AI funkcemi a virtuální prací.

## Popis

AIMapa je pokročilá webová aplikace, která kombinuje interaktivní mapu s funkcemi umělé inteligence, virtuální práce a revolučního VoiceBot systému. Aplikace umožňuje uživatelům:

- **🗺️ Interaktivní mapa** - Procházet mapu s pokročilými funkcemi
- **🎤 VoiceBot ovládání** - Kompletní hlasové ovládání všech funkcí
- **💼 Virtuální práce** - Vydělávat virtuální peníze a plnit úkoly
- **🧭 Inteligentní navigace** - AI asistované směrování a vyhledávání
- **🏆 Systém achievementů** - Odemykání úspěchů a sledování postupu
- **🛍️ Služby** - Objednání jídla, taxi, lékařské a další služby
- **🌙 Tmavý režim** - Moderní design s podporou tmavého tématu
- **📱 Mobilní optimalizace** - Plná funkcionalita na všech zařízeních

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

Aktuální verze: 0.3.8.6 - VoiceBot Edition

### 🎤 Nové funkce ve verzi 0.3.8.6

- **VoiceBot systém** - Kompletní hlasové ovládání aplikace
- **Rozpoznávání řeči** - Česká hlasová příkazy
- **Syntéza řeči** - AI asistent mluví česky
- **Hlasové ovládání mapy** - Přiblížení, oddálení, navigace
- **Hlasová virtuální práce** - Spuštění a řízení práce hlasem
- **Hlasové služby** - Objednání jídla, taxi, lékařské služby
- **Optimalizace výkonu** - Rychlejší načítání a lepší responzivita

Podrobný seznam změn najdete v souboru [CHANGELOG.md](CHANGELOG.md).

## Autor

Jan Lazorik