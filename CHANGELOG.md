# Changelog

Všechny významné změny v projektu AIMapa budou dokumentovány v tomto souboru.

## [0.0.5] - 2025-04-18

### Vylepšeno
- Kompletní redesign tlačítka pro zavření popup okna klubu Alexa
- Vylepšená pozice křížku pro zavření popup okna
- Přidán efekt rotace při najetí myší na křížek
- Vylepšený vzhled popup okna s novým stínem a zaoblením
- Vylepšený vzhled tlačítka "Rezervovat" s animací při najetí myší
- Optimalizace pro tmavý režim s konzistentními barvami
- Vylepšené mezery a zarovnání všech prvků pro lepší symetrii

## [0.0.4] - 2025-04-18

### Přidáno
- Ukládání stavu aplikace do localStorage
- Automatické načtení posledního stavu při opětovném otevření aplikace
- Ukládání všech bodů na mapě včetně jejich vlastností
- Ukládání nastavení aplikace (tmavý režim, barevné schéma, design)

### Vylepšeno
- Kompletní redesign popup okna klubu Alexa pro lepší estetický dojem
- Přidány ikony pro jednotlivé informace (hodnocení, otevírací doba, adresa)
- Sjednocené barevné schéma v celém popup okně
- Optimalizováno chování popup oken při pohybu mapy
- Popup okna nyní zůstávají na svých pozicích při posunu mapy
- Vylepšena responzivita popup oken při změně velikosti obrazovky
- Optimalizováno zobrazení popup oken při různých úrovních zoomu

## [0.0.3] - 2025-04-18

### Opraveno
- Aktualizovány přesné souřadnice klubu Alexa v Rohatci na 48.8871713, 17.1931988
- Opraveno zobrazení popup okna klubu Alexa - nyní se zobrazuje na přesných souřadnicích klubu a zároveň je vycentrováno uprostřed mapy

### Přidáno
- Nový příkaz "oteviracidoba" pro zobrazení otevíracích dob obchodů v Hodoníně
- Podpora pro 2 pobočky Kaufland a 2 pobočky Albert v Hodoníně
- Zobrazení běžných otevíracích dob a speciálních otevíracích dob o svátcích 2025
- Možnost zobrazení obchodů na mapě s přesnými souřadnicemi
- Interaktivní popup okna s detaily o otevíracích dobách

### Vylepšeno
- Optimalizováno zobrazení popup okna pro příkaz "alexa"
- Skrytí markeru při zobrazení popup okna pro lepší vizualizaci
- Automatické zobrazení markeru po zavření popup okna
- Vylepšeno zobrazení popup okna klubu Alexa - nyní se zobrazuje na přesných souřadnicích klubu a zároveň je vycentrováno uprostřed mapy

## [0.0.2] - 2025-04-18

### Vylepšeno
- Optimalizováno zobrazení popup okna pro příkaz "alexa"
- Pevná velikost popup okna (320px šířka) pro lepší čitelnost při různých úrovních zoomu
- Zlepšeno zarovnání popup okna na středu mapy
- Optimalizace obsahu popup okna pro lepší čitelnost
- Přidán event listener pro udržení popup okna viditelného při změně zoomu
- Responzivní design pro mobilní zařízení (280px šířka)
- Implementována funkce pro navigaci na body pomocí příkazů v chatu
- Vylepšeno zobrazení kamery při navigaci na body (offset pro lepší viditelnost popup oken)
- Zvětšena mapa na výšku 600px pro více prostoru
- Upraven poměr sloupců pro čtvercovější tvar mapy
- Přidán příkaz "seznam bodů" nebo "ukaž body" pro zobrazení všech bodů a jejich příkazů
- Vylepšena funkce pro vymazání mapy, aby resetovala také pole markerProperties
- Aktualizovány souřadnice nočního klubu Alexa v Rohatci na přesnou adresu: Na Kopci 1055/54

## [0.0.1] - 2025-04-18

### Přidáno
- Základní mapové rozhraní s využitím Leaflet.js
- Možnost přidávat body na mapu kliknutím
- Automatické propojení bodů s výpočtem vzdálenosti a času cesty
- Popup okna pro body s možností pojmenování a přiřazení příkazu
- Chatovací rozhraní pro interakci s mapou
- Příkazy v chatu pro navigaci na body
- Speciální příkaz "alexa" pro vyhledání nočního klubu v Rohatci
- Formulář pro rezervaci tanečnice v nočním klubu
- Ukazatel souřadnic v levém dolním rohu mapy
- Fullscreen režim pro mapu
- Tmavý režim s optimalizací pro dobrou viditelnost
- Nastavení aplikace dostupné přes ikonu ozubeného kola

### Technické detaily
- Responzivní design pro různé velikosti obrazovek
- Automatické zavírání popup oken po 35 sekundách
- Možnost odstranění jednotlivých bodů
- Přepočítávání trasy při změně bodů
- Optimalizace pro tmavý režim
- Verzování pomocí Git a GitHub

### Poznámky
- První funkční verze aplikace
- Základní funkcionalita pro práci s mapou a body
- Implementace speciálních funkcí pro noční klub v Rohatci
