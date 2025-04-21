# AIMapa - Časový Manažer

Interaktivní mapová aplikace s AI asistentem pro správu aktivit a plánování tras.

## Verze 0.2.9.1

Tato verze přináší stabilnější běh aplikace díky přechodu na Node.js platformu.

## Funkce

- Interaktivní mapa s možností přidávání bodů
- Výpočet trasy mezi body
- AI asistent pro pomoc s plánováním
- Fullscreen režim s plovoucím chatem
- Glóbus režim pro 3D zobrazení světa
- Responzivní design

## Instalace a spuštění

### Požadavky
- Node.js (verze 14 nebo vyšší)
- npm (Node Package Manager)

### Postup instalace

1. Naklonujte repozitář:
```
git clone https://github.com/l4zorik/AIMapa.git
```

2. Přejděte do adresáře projektu:
```
cd AIMapa
```

3. Nainstalujte závislosti:
```
npm install
```

4. Spusťte aplikaci:
```
npm start
```

5. Otevřete aplikaci v prohlížeči:
```
http://localhost:3000
```

## Struktura projektu

- `server.js` - Hlavní soubor Node.js serveru
- `public/` - Veřejné soubory dostupné přes webový server
  - `index.html` - Hlavní HTML soubor
  - `styles.css` - Základní styly
  - `modern-ui.css` - Moderní UI styly
  - `fullscreen-fix.css` - Styly pro fullscreen režim
  - `script.js` - Hlavní JavaScript soubor
  - Další JS soubory pro specifické funkce

## Plánované funkce

- Uživatelské účty a přihlašování
- Ukládání aktivit do databáze
- Pokročilé plánování tras
- Mobilní aplikace

## Autor

Jan Lazorík

## Licence

Tento projekt je licencován pod MIT licencí.