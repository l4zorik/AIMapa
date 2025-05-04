# Logování LLM API komunikace

Tato dokumentace popisuje systém logování komunikace s LLM API v aplikaci AIMapa.

## Obsah

1. [Přehled](#přehled)
2. [Konfigurace](#konfigurace)
3. [Formát logů](#formát-logů)
4. [Ukládání logů](#ukládání-logů)
5. [Statistiky](#statistiky)
6. [Příklady použití](#příklady-použití)
7. [Bezpečnostní aspekty](#bezpečnostní-aspekty)

## Přehled

Systém logování LLM API komunikace umožňuje sledovat a analyzovat veškerou komunikaci s jazykovými modely (LLM) v aplikaci AIMapa. Logy obsahují detailní informace o požadavcích, odpovědích a případných chybách, včetně časových značek, latence, využití tokenů a odhadovaných nákladů.

Hlavní funkce:
- Logování požadavků na LLM API
- Logování odpovědí z LLM API
- Logování chyb při komunikaci s LLM API
- Ukládání logů do souboru
- Ukládání logů do Supabase
- Výpočet statistik využití LLM API

## Konfigurace

Systém logování lze konfigurovat pomocí následujících parametrů:

| Parametr | Popis | Výchozí hodnota |
|----------|-------|-----------------|
| `logToConsole` | Zda logovat do konzole | `true` |
| `logToFile` | Zda logovat do souboru | `true` |
| `logToSupabase` | Zda logovat do Supabase | `true` |
| `logDir` | Adresář pro ukládání logů | `./logs` |
| `logLevel` | Úroveň logování (`debug`, `info`, `warn`, `error`) | `info` |
| `logPrompts` | Zda logovat celé prompty | `false` |
| `logResponses` | Zda logovat celé odpovědi | `false` |

Konfigurace pomocí proměnných prostředí:

```
LLM_LOG_LEVEL=debug
LLM_LOG_PROMPTS=true
LLM_LOG_RESPONSES=true
```

## Formát logů

Logy jsou ukládány ve formátu JSON, každý záznam na samostatném řádku. Každý záznam obsahuje následující společné pole:

- `request_id` - Unikátní ID požadavku
- `timestamp` - Časová značka ve formátu ISO 8601
- `type` - Typ záznamu (`request`, `response`, `error`)
- `provider` - Název poskytovatele API
- `model` - Název modelu
- `user_id` - ID uživatele (pokud je k dispozici)
- `conversation_id` - ID konverzace (pokud je k dispozici)

### Záznam požadavku

Záznam požadavku obsahuje navíc:

- `prompt` - Prompt odeslaný na API
- `prompt_length` - Délka promptu
- `options` - Další možnosti požadavku

### Záznam odpovědi

Záznam odpovědi obsahuje navíc:

- `response` - Odpověď z API
- `response_length` - Délka odpovědi
- `usage` - Informace o využití tokenů
- `latency` - Doba odezvy v ms
- `cost` - Cena požadavku
- `from_cache` - Zda byla odpověď získána z cache

### Záznam chyby

Záznam chyby obsahuje navíc:

- `error_message` - Zpráva o chybě
- `error_stack` - Stack trace chyby
- `error_code` - Kód chyby (pokud je k dispozici)

## Ukládání logů

### Ukládání do souboru

Logy jsou ukládány do souboru ve formátu JSON, každý záznam na samostatném řádku. Název souboru obsahuje datum ve formátu `llm-api-YYYY-MM-DD.log`. Soubory jsou ukládány do adresáře specifikovaného v konfiguraci.

### Ukládání do Supabase

Logy jsou ukládány do tabulky `llm_api_logs` v Supabase. Tabulka má následující strukturu:

```sql
CREATE TABLE llm_api_logs (
  id SERIAL PRIMARY KEY,
  request_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  user_id TEXT,
  conversation_id TEXT,
  prompt TEXT,
  prompt_length INTEGER,
  response TEXT,
  response_length INTEGER,
  usage JSONB,
  latency INTEGER,
  cost NUMERIC(10, 6),
  from_cache BOOLEAN,
  error_message TEXT,
  error_stack TEXT,
  error_code TEXT,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexy pro rychlejší vyhledávání
CREATE INDEX llm_api_logs_request_id_idx ON llm_api_logs (request_id);
CREATE INDEX llm_api_logs_user_id_idx ON llm_api_logs (user_id);
CREATE INDEX llm_api_logs_conversation_id_idx ON llm_api_logs (conversation_id);
CREATE INDEX llm_api_logs_timestamp_idx ON llm_api_logs (timestamp);
CREATE INDEX llm_api_logs_provider_model_idx ON llm_api_logs (provider, model);
```

## Statistiky

Systém logování poskytuje následující statistiky:

- `totalRequests` - Celkový počet požadavků
- `totalResponses` - Celkový počet odpovědí
- `totalErrors` - Celkový počet chyb
- `totalCost` - Celková cena
- `averageLatency` - Průměrná latence
- `totalTokens` - Celkový počet tokenů
- `byProvider` - Statistiky podle poskytovatele
- `byModel` - Statistiky podle modelu

## Příklady použití

### Inicializace LLM Service s logováním

```javascript
const LLMService = require('./llm-service');

const llmService = new LLMService({
  provider: 'openai',
  model: 'gpt-4',
  logToConsole: true,
  logToFile: true,
  logToSupabase: true,
  logLevel: 'debug',
  logPrompts: true,
  logResponses: true
});
```

### Získání odpovědi od LLM s logováním

```javascript
const response = await llmService.getCompletion({
  prompt: 'Popiš mi, co je to AIMapa a jaké jsou její hlavní funkce.',
  userId: 'user-123',
  conversationId: 'conv-456'
});
```

### Získání statistik z loggeru

```javascript
const stats = llmService.logger.getStats();
console.log(`Celkem požadavků: ${stats.totalRequests}`);
console.log(`Celková cena: ${stats.totalCost.toFixed(6)} Kč`);
```

## Bezpečnostní aspekty

Při logování komunikace s LLM API je třeba dbát na bezpečnost a ochranu osobních údajů:

1. **Citlivé informace v promptech** - Prompty mohou obsahovat citlivé informace, proto je výchozí nastavení `logPrompts: false`. Pokud je logování promptů povoleno, je třeba zajistit, aby logy byly řádně zabezpečeny.

2. **Přístup k logům** - Logy mohou obsahovat citlivé informace, proto by měl být přístup k nim omezen pouze na oprávněné osoby.

3. **Ukládání logů** - Logy by měly být ukládány v souladu s GDPR a dalšími předpisy na ochranu osobních údajů.

4. **Anonymizace** - V produkčním prostředí je vhodné zvážit anonymizaci logů, například nahrazení skutečných ID uživatelů pseudonymy.

5. **Doba uchovávání** - Je vhodné stanovit dobu uchovávání logů a po jejím uplynutí logy automaticky mazat.

## Testování logování

Pro testování logování lze použít skript `test-logger.js`:

```bash
node llm/test-logger.js "Popiš mi, co je to AIMapa a jaké jsou její hlavní funkce." openai gpt-4
```

Tento skript provede testovací požadavek na LLM API a zobrazí výsledky logování.

---

*Poslední aktualizace: 2025-07-20*
