# AIMapa - Testovací framework

Tento adresář obsahuje testovací framework pro aplikaci AIMapa verze 0.3.8.6.

## Struktura testů

Testy jsou rozděleny do několika kategorií:

- **Unit testy** (`/tests/unit/`) - Testy pro ověření jednotlivých komponent a funkcí
- **Integrační testy** (`/tests/integration/`) - Testy pro ověření interakce mezi moduly a externími API
- **End-to-end testy** (`/tests/e2e/`) - Testy pro ověření celého workflow aplikace
- **AI model testy** (`/tests/ai/`) - Testy pro ověření AI modelu a jeho výkonu

## Spuštění testů

### Z příkazové řádky

Pro spuštění všech testů použijte:

```bash
npm test
```

Pro spuštění konkrétní kategorie testů použijte:

```bash
npm run test:unit        # Unit testy
npm run test:integration # Integrační testy
npm run test:e2e         # End-to-end testy
npm run test:ai          # AI model testy
```

### Pomocí skriptů

Pro Linux/macOS:

```bash
./tests/run-tests.sh --all           # Všechny testy
./tests/run-tests.sh --unit          # Unit testy
./tests/run-tests.sh --integration   # Integrační testy
./tests/run-tests.sh --e2e           # End-to-end testy
./tests/run-tests.sh --ai-model      # AI model testy
```

Pro Windows:

```bash
tests\run-tests.bat --all           # Všechny testy
tests\run-tests.bat --unit          # Unit testy
tests\run-tests.bat --integration   # Integrační testy
tests\run-tests.bat --e2e           # End-to-end testy
tests\run-tests.bat --ai-model      # AI model testy
```

### V prohlížeči

Pro spuštění testů v prohlížeči otevřete:

```
http://localhost:3000/tests/
```

nebo

```
http://localhost:3000/tests/browser-test-runner.html
```

## Metriky testů

### Unit testy

- **Úspěšnost** - Počet úspěšných testů / Celkový počet testů

### Integrační testy

- **Úspěšnost** - Počet úspěšných testů / Celkový počet testů

### End-to-end testy

- **Úspěšnost** - Počet úspěšných scénářů / Celkový počet scénářů

### AI model testy

- **Klasifikace míst**
  - Accuracy - Přesnost klasifikace
  - Precision - Přesnost (TP / (TP + FP))
  - Recall - Úplnost (TP / (TP + FN))
  - F1-score - Harmonický průměr precision a recall

- **Predikce času cesty**
  - MAE - Mean Absolute Error (Průměrná absolutní chyba)
  - RMSE - Root Mean Squared Error (Odmocnina z průměrné čtvercové chyby)
  - R² - Koeficient determinace

- **Doporučení míst**
  - Precision@k - Přesnost pro k doporučení
  - NDCG - Normalized Discounted Cumulative Gain

- **Bias a fairness**
  - Equal Opportunity - Rozdíl v recall mezi demografickými skupinami
  - Statistical Parity - Rozdíl v počtu doporučení mezi demografickými skupinami

## Výsledky testů

Výsledky testů jsou ukládány do adresáře `/tests/results/` ve formátu JSON s časovým razítkem.

## Rozšíření testů

Pro přidání nových testů:

1. Vytvořte nový testovací soubor v příslušném adresáři
2. Implementujte testy podle vzoru existujících testů
3. Aktualizujte hlavní testovací skript `run-tests.js`
4. Aktualizujte testovací stránku `browser-test-runner.html`
