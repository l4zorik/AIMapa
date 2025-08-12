# Instrukce pro nahrání verze 0.2.8.7.8 na GitHub

Tato verze obsahuje následující nové soubory a změny:

## Nové soubory:
- `food-services.js` - Modul pro služby jídla a pití
- `medical-services.js` - Modul pro lékařské služby
- `transport-services.js` - Modul pro veřejnou dopravu

## Změněné soubory:
- `index.html` - Přidány odkazy na nové JavaScript soubory
- `commands-menu.js` - Aktualizováno pro podporu nových modulů
- `script.js` - Aktualizována verze
- `feedback-survey.js` - Aktualizována verze
- `CHANGELOG.md` - Přidány informace o nové verzi

## Postup pro nahrání na GitHub:

1. Otevřete GitHub Desktop nebo jiného Git klienta
2. Vytvořte novou větev `v0.2.8.7.8` z větve `v0.2.8.7.7`
3. Commitněte všechny změny s popisem "Version 0.2.8.7.8 - Funkční panel možností vedle chatu"
4. Pushněte změny na GitHub
5. Vytvořte tag `v0.2.8.7.8` pro tento commit
6. Pushněte tag na GitHub

Alternativně můžete použít následující Git příkazy:

```bash
# Přepnutí na větev v0.2.8.7.7
git checkout v0.2.8.7.7

# Vytvoření nové větve v0.2.8.7.8
git checkout -b v0.2.8.7.8

# Přidání všech změn
git add .

# Vytvoření commitu
git commit -m "Version 0.2.8.7.8 - Funkční panel možností vedle chatu"

# Push na GitHub
git push -u origin v0.2.8.7.8

# Vytvoření tagu
git tag v0.2.8.7.8

# Push tagu na GitHub
git push origin v0.2.8.7.8
```

## Shrnutí změn v verzi 0.2.8.7.8:

### Nové funkce:
- Přidány funkční moduly pro služby jídla a pití (jídlo, pizza, energy drinky, krkovička)
- Přidány funkční moduly pro lékařské služby (lékař, zubař, lékárna)
- Přidán funkční modul pro veřejnou dopravu s vyhledáváním spojení
- Implementováno zobrazení prodejních oken s možností objednávky
- Přidána možnost objednání k lékaři a zubaři
- Přidána možnost nákupu jízdenek na veřejnou dopravu

### Vylepšení:
- Přidána funkčnost všem tlačítkům v panelu možností
- Vylepšena interakce s uživatelem při použití příkazů
- Optimalizováno zobrazení všech nových oken a dialogů
- Přidáno získávání XP za použití různých služeb
