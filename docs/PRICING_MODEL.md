# Cenový model pro LLM API v AIMapa

Tento dokument popisuje cenový model pro využití LLM API (Large Language Model API) v aplikaci AIMapa, včetně marže pro aplikaci a způsobu účtování.

## Obsah

1. [Přehled](#přehled)
2. [Základní ceny API](#základní-ceny-api)
3. [Marže aplikace](#marže-aplikace)
4. [Výpočet ceny požadavku](#výpočet-ceny-požadavku)
5. [Sledování využití a nákladů](#sledování-využití-a-nákladů)
6. [Optimalizace nákladů](#optimalizace-nákladů)
7. [Limity a omezení](#limity-a-omezení)

## Přehled

AIMapa využívá různé LLM API pro poskytování funkcí umělé inteligence, jako je vyhledávání míst, generování odpovědí a další. Každé použití API má svou cenu, která se účtuje podle počtu tokenů (jednotek textu) ve vstupu a výstupu.

Pro zajištění udržitelnosti aplikace a pokrytí provozních nákladů je k základním cenám API přidána marže. Tato marže je transparentně zobrazena uživatelům a slouží k financování vývoje a provozu aplikace.

## Základní ceny API

Základní ceny API jsou stanoveny poskytovateli LLM a liší se podle použitého modelu. Níže jsou uvedeny aktuální ceny pro hlavní používané modely:

### Gemini API (Google)

| Model | Cena za 1K vstupních tokenů (USD) | Cena za 1K výstupních tokenů (USD) |
|-------|-----------------------------------|-----------------------------------|
| Gemini 1.5 Flash | $0.00005 | $0.00015 |
| Gemini 2.5 Pro | $0.000125 | $0.000375 |

### Další podporované modely

| Model | Cena za 1K vstupních tokenů (USD) | Cena za 1K výstupních tokenů (USD) |
|-------|-----------------------------------|-----------------------------------|
| OpenAI o1 (GPT-4o) | $0.00005 | $0.00015 |
| OpenAI o3-mini | $0.00001 | $0.00003 |
| DeepSeek R1 | $0.0001 | $0.0002 |
| Qwen3 72B | $0.0002 | $0.0004 |
| Qwen3 32B | $0.0001 | $0.0002 |
| Grok 3 Beta | $0.0001 | $0.0002 |

## Marže aplikace

K základním cenám API je přidána marže pro pokrytí nákladů na vývoj a provoz aplikace. Aktuální marže je nastavena na **50%** nad základní cenu API.

Příklad výpočtu ceny s marží:
- Základní cena API: 0.0011 Kč za 1000 vstupních tokenů
- Cena s marží: 0.0011 Kč * 1.5 = 0.00165 Kč za 1000 vstupních tokenů

## Výpočet ceny požadavku

Cena každého požadavku na LLM API se počítá podle následujícího vzorce:

```
Cena = (Vstupní tokeny / 1000 * Cena za 1K vstupních tokenů + Výstupní tokeny / 1000 * Cena za 1K výstupních tokenů) * Bezpečnostní rezerva
```

Kde:
- **Vstupní tokeny** je počet tokenů v textu odeslaném do API
- **Výstupní tokeny** je počet tokenů v odpovědi z API
- **Bezpečnostní rezerva** je koeficient (obvykle 1.1, tedy 10% navíc) pro pokrytí případných nepřesností v odhadu počtu tokenů

### Příklad výpočtu

Pro dotaz s 500 vstupními tokeny a 300 výstupními tokeny při použití modelu Gemini 1.5 Flash:

1. Základní cena API:
   - Vstupní cena: (500 / 1000) * $0.00005 * 22 Kč/USD = 0.00055 Kč
   - Výstupní cena: (300 / 1000) * $0.00015 * 22 Kč/USD = 0.00099 Kč
   - Celkem: 0.00154 Kč

2. Cena s marží (50%):
   - Vstupní cena: 0.00055 Kč * 1.5 = 0.000825 Kč
   - Výstupní cena: 0.00099 Kč * 1.5 = 0.001485 Kč
   - Celkem: 0.00231 Kč

3. S bezpečnostní rezervou (10%):
   - Konečná cena: 0.00231 Kč * 1.1 = 0.002541 Kč

## Sledování využití a nákladů

Aplikace sleduje využití API a související náklady pro každého uživatele. Tyto informace zahrnují:

- Celkový počet požadavků
- Celkový počet vstupních a výstupních tokenů
- Celkové náklady (s marží)
- Základní náklady API (bez marže)
- Marži v Kč a procentech

Tyto informace jsou uloženy lokálně a slouží k informování uživatele o jeho využití a nákladech.

## Optimalizace nákladů

Aplikace nabízí několik způsobů, jak optimalizovat náklady na využití LLM API:

1. **Nastavení efektivity vyhledávání**:
   - Vysoká přesnost: Žádná optimalizace, maximální kvalita výsledků
   - Vyvážený režim: Mírná optimalizace promptů pro snížení nákladů
   - Nízká cena: Agresivní optimalizace pro minimalizaci nákladů

2. **Lazy-target architektura**: Postupné zpracování dotazu, které se zastaví, jakmile je nalezena dostatečně přesná odpověď.

3. **Limit ceny na jedno vyhledávání**: Uživatel může nastavit maximální cenu za jedno vyhledávání (výchozí hodnota je 0.01 Kč).

## Limity a omezení

Pro ochranu uživatelů před neočekávanými náklady jsou implementována následující omezení:

1. **Maximální limit výdajů**: 50 Kč celkem (lze změnit v nastavení)
2. **Limit na jedno vyhledávání**: 0.01 Kč (lze změnit v nastavení)
3. **Měsíční reset**: Statistiky využití se resetují po 30 dnech

## Budoucí vývoj

V budoucích verzích aplikace plánujeme:

1. **Dynamická marže**: Různé marže pro různé typy uživatelů (např. nižší marže pro předplatitele)
2. **Množstevní slevy**: Snížení marže při větším objemu využití
3. **Předplatné s kredity**: Možnost zakoupit předplatné s určitým počtem kreditů na využití API
4. **Detailnější reporting**: Podrobnější statistiky a grafy využití API

---

*Poslední aktualizace: 2025-07-20*
