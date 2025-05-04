# Průvodce pro práci s LLM API v AIMapa

Tento dokument popisuje, jak používat LLM (Large Language Model) API v aplikaci AIMapa. LLM API umožňuje integraci chatovacích funkcí s různými poskytovateli jazykových modelů jako OpenAI, Anthropic a DeepSeek.

## Obsah

1. [Úvod](#úvod)
2. [Konfigurace](#konfigurace)
3. [Podporovaní poskytovatelé](#podporovaní-poskytovatelé)
4. [API Endpointy](#api-endpointy)
5. [Klientská část](#klientská-část)
6. [Příklady použití](#příklady-použití)
7. [Řešení problémů](#řešení-problémů)
8. [Ceny a limity](#ceny-a-limity)

## Úvod

LLM API v AIMapa poskytuje jednotné rozhraní pro komunikaci s různými poskytovateli jazykových modelů. Toto rozhraní umožňuje:

- Získávání odpovědí od různých jazykových modelů
- Cachování odpovědí pro snížení nákladů
- Kontextové vyhledávání pro relevantnější odpovědi
- Ukládání historie konverzací
- Export konverzací

## Konfigurace

Pro správnou funkci LLM API je potřeba nastavit následující proměnné prostředí v souboru `.env`:

```
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# DeepSeek
DEEPSEEK_API_KEY=...

# Obecné nastavení
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=1000
LLM_CACHE_ENABLED=true
LLM_CACHE_EXPIRATION=3600
```

## Podporovaní poskytovatelé

### OpenAI

OpenAI poskytuje modely jako GPT-4 a GPT-3.5 Turbo. Tyto modely jsou vhodné pro širokou škálu úloh a poskytují vysokou kvalitu odpovědí.

Podporované modely:
- `gpt-4`
- `gpt-3.5-turbo`

### Anthropic

Anthropic poskytuje modely Claude, které jsou známé svou bezpečností a schopností následovat instrukce.

Podporované modely:
- `claude-3-opus-20240229`
- `claude-3-sonnet-20240229`
- `claude-3-haiku-20240307`

### DeepSeek

DeepSeek poskytuje cenově dostupné modely s dobrou kvalitou odpovědí.

Podporované modely:
- `deepseek-chat`
- `deepseek-coder`

## API Endpointy

### GET /api/llm/models

Získání dostupných modelů.

**Požadavek:**
```
GET /api/llm/models
```

**Odpověď:**
```json
{
  "success": true,
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "openai",
      "created": 1687882411
    },
    ...
  ]
}
```

### GET /api/llm/model

Získání informací o aktuálním modelu.

**Požadavek:**
```
GET /api/llm/model
```

**Odpověď:**
```json
{
  "success": true,
  "model": {
    "id": "gpt-4",
    "name": "GPT-4",
    "provider": "openai",
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```

### POST /api/llm/completion

Získání odpovědi od LLM.

**Požadavek:**
```json
{
  "prompt": "Jak se dostanu z Prahy do Brna?",
  "conversationId": "conv-123456789",
  "context": {
    "location": "Praha",
    "destination": "Brno",
    "transportMode": "car",
    "preferences": "Vyhýbat se dálnicím"
  }
}
```

**Odpověď:**
```json
{
  "success": true,
  "response": {
    "text": "Z Prahy do Brna se můžete dostat několika způsoby...",
    "model": "gpt-4",
    "usage": {
      "prompt_tokens": 50,
      "completion_tokens": 150,
      "total_tokens": 200
    },
    "provider": "openai"
  }
}
```

### GET /api/llm/conversations

Získání historie konverzací pro uživatele.

**Požadavek:**
```
GET /api/llm/conversations
```

**Odpověď:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": "conv-123456789",
      "messages": [
        {
          "role": "user",
          "content": "Jak se dostanu z Prahy do Brna?",
          "timestamp": "2025-05-10T12:34:56.789Z"
        },
        {
          "role": "assistant",
          "content": "Z Prahy do Brna se můžete dostat několika způsoby...",
          "timestamp": "2025-05-10T12:35:01.234Z",
          "model": "gpt-4"
        }
      ],
      "model": "gpt-4",
      "updated_at": "2025-05-10T12:35:01.234Z"
    },
    ...
  ]
}
```

### DELETE /api/llm/conversations

Smazání historie konverzací pro uživatele.

**Požadavek:**
```
DELETE /api/llm/conversations
```

nebo

```
DELETE /api/llm/conversations?conversationId=conv-123456789
```

**Odpověď:**
```json
{
  "success": true
}
```

## Klientská část

Pro použití LLM API v klientské části aplikace je k dispozici `ChatClient`, který poskytuje následující funkce:

- `initChatClient()` - Inicializace chat klienta
- `sendMessage(message, context)` - Odeslání zprávy
- `startNewChat()` - Zahájení nového chatu
- `exportChat()` - Export chatu do Markdown formátu
- `setModel(model)` - Nastavení modelu

Příklad použití:

```javascript
// Inicializace
await ChatClient.initChatClient();

// Odeslání zprávy
const response = await ChatClient.sendMessage("Jak se dostanu z Prahy do Brna?", {
  location: "Praha",
  destination: "Brno",
  transportMode: "car"
});

// Zahájení nového chatu
ChatClient.startNewChat();

// Export chatu
ChatClient.exportChat();

// Nastavení modelu
ChatClient.setModel("claude-3-opus-20240229");
```

## Příklady použití

### Základní použití

```javascript
// Inicializace
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Inicializace Auth0 klienta
    await Auth0Client.initAuth0Client();
    
    // Inicializace Supabase klienta
    await SupabaseClient.initSupabaseClient();
    
    // Inicializace chat klienta
    await ChatClient.initChatClient();
    
    // Kontrola, zda je uživatel přihlášen
    const isAuthenticated = await Auth0Client.isAuthenticated();
    
    // Aktualizace UI podle stavu přihlášení
    updateUI(isAuthenticated);
  } catch (error) {
    console.error('Chyba při inicializaci aplikace:', error);
  }
});

// Odeslání zprávy
document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const chatInput = document.getElementById('chat-input-text');
  const message = chatInput.value.trim();
  
  if (message) {
    chatInput.value = '';
    
    // Získání kontextu
    const context = {
      location: document.getElementById('context-location').value,
      destination: document.getElementById('context-destination').value,
      transportMode: document.getElementById('context-transport').value,
      preferences: document.getElementById('context-preferences').value
    };
    
    // Odeslání zprávy
    await ChatClient.sendMessage(message, context);
  }
});
```

### Pokročilé použití

```javascript
// Vlastní zpracování odpovědi
async function sendCustomMessage(message, context) {
  try {
    const response = await fetch('/api/llm/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: message,
        conversationId: 'custom-conv-id',
        context
      })
    });
    
    if (!response.ok) {
      throw new Error(`Chyba při komunikaci se serverem: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Neznámá chyba při získávání odpovědi');
    }
    
    // Vlastní zpracování odpovědi
    const parsedResponse = parseResponse(data.response.text);
    
    // Zobrazení odpovědi
    displayResponse(parsedResponse);
    
    return data.response;
  } catch (error) {
    console.error('Chyba při odesílání zprávy:', error);
    throw error;
  }
}

// Vlastní parsování odpovědi
function parseResponse(text) {
  // Zde může být vlastní logika pro parsování odpovědi
  return text;
}

// Vlastní zobrazení odpovědi
function displayResponse(text) {
  // Zde může být vlastní logika pro zobrazení odpovědi
  console.log(text);
}
```

## Řešení problémů

### Chyba: "API klíč je neplatný"

Zkontrolujte, zda máte správně nastavený API klíč v souboru `.env`. API klíče jsou citlivé na velikost písmen a nesmí obsahovat mezery.

### Chyba: "Model není podporován"

Zkontrolujte, zda používáte podporovaný model pro daného poskytovatele. Seznam podporovaných modelů najdete v sekci [Podporovaní poskytovatelé](#podporovaní-poskytovatelé).

### Chyba: "Překročen limit požadavků"

Poskytovatelé LLM API mají limity na počet požadavků za minutu. Pokud se tato chyba objeví, počkejte chvíli a zkuste to znovu.

### Chyba: "Uživatel není přihlášen"

Pro použití LLM API musí být uživatel přihlášen. Zkontrolujte, zda je uživatel přihlášen pomocí `Auth0Client.isAuthenticated()`.

## Ceny a limity

### OpenAI

- **GPT-4**: $0.03 / 1K tokenů (vstup), $0.06 / 1K tokenů (výstup)
- **GPT-3.5 Turbo**: $0.0015 / 1K tokenů (vstup), $0.002 / 1K tokenů (výstup)
- Limit: 10K tokenů / minutu pro free tier

### Anthropic

- **Claude 3 Opus**: $15 / 1M tokenů (vstup), $75 / 1M tokenů (výstup)
- **Claude 3 Sonnet**: $3 / 1M tokenů (vstup), $15 / 1M tokenů (výstup)
- **Claude 3 Haiku**: $0.25 / 1M tokenů (vstup), $1.25 / 1M tokenů (výstup)
- Limit: Závisí na plánu

### DeepSeek

- **DeepSeek Chat**: $0.5 / 1M tokenů (vstup), $1.5 / 1M tokenů (výstup)
- **DeepSeek Coder**: $0.5 / 1M tokenů (vstup), $1.5 / 1M tokenů (výstup)
- Limit: 5 požadavků / minutu pro free tier

Pro snížení nákladů je implementováno cachování odpovědí. Pokud je stejný dotaz položen vícekrát, odpověď je získána z cache místo volání API.
