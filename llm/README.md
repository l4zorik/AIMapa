# LLM API Integrace

Tato složka obsahuje soubory pro integraci s LLM (Large Language Model) API providery pro implementaci chatovací funkcionality v aplikaci AIMapa.

## Obsah složky

- **llm-service.js** - Hlavní třída pro práci s LLM API
- **llm-routes.js** - Express routy pro LLM API endpointy
- **llm-providers/** - Složka s implementacemi různých LLM API providerů
  - **openai-provider.js** - Implementace OpenAI API
  - **anthropic-provider.js** - Implementace Anthropic API
  - **cohere-provider.js** - Implementace Cohere API
  - **gemini-provider.js** - Implementace Google Gemini API
- **llm-cache.js** - Implementace cachování odpovědí pro snížení nákladů
- **llm-context.js** - Implementace kontextového vyhledávání pro relevantní odpovědi

## Použití

### Inicializace LLM Service

```javascript
const LLMService = require('./llm/llm-service');

// Inicializace LLM service
const llmService = new LLMService({
    provider: 'openai', // nebo 'anthropic', 'cohere'
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4', // nebo 'claude-3-opus', 'command-r'
    temperature: 0.7,
    maxTokens: 1000,
    cache: true,
    cacheExpiration: 3600 // 1 hodina
});
```

### Registrace LLM Routes

```javascript
const createLLMRoutes = require('./llm/llm-routes');

// Registrace LLM routes
app.use('/api/llm', createLLMRoutes(llmService, auth0Service));
```

### Použití LLM Service

```javascript
// Získání odpovědi od LLM
const response = await llmService.getCompletion({
    prompt: 'Jak se dostanu z Prahy do Brna?',
    userId: 'user123',
    conversationId: 'conv456',
    context: {
        location: 'Praha',
        destination: 'Brno',
        transportMode: 'car'
    }
});

console.log(response.text);
```

## Konfigurace

Pro správnou funkci LLM integrace je potřeba nastavit následující proměnné prostředí:

```
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Cohere
COHERE_API_KEY=...

# Gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=1000

# Obecné nastavení
LLM_PROVIDER=openai
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=1000
LLM_CACHE_ENABLED=true
LLM_CACHE_EXPIRATION=3600
LLM_LOG_LEVEL=info
LLM_LOG_PROMPTS=false
LLM_LOG_RESPONSES=false
```

## Testování

Pro testování LLM API můžete použít následující příkazy:

```bash
# Test OpenAI API
node llm/test-openai.js "Jak se dostanu z Prahy do Brna?"

# Test Anthropic API
node llm/test-anthropic.js "Jak se dostanu z Prahy do Brna?"

# Test Cohere API
node llm/test-cohere.js "Jak se dostanu z Prahy do Brna?"

# Test Gemini API
node llm/test-gemini.js "Jak se dostanu z Prahy do Brna?"
```

## Limity a ceny

### OpenAI

- **GPT-4**: $0.03 / 1K tokenů (vstup), $0.06 / 1K tokenů (výstup)
- **GPT-3.5 Turbo**: $0.0015 / 1K tokenů (vstup), $0.002 / 1K tokenů (výstup)
- Limit: 10K tokenů / minutu pro free tier

### Anthropic

- **Claude 3 Opus**: $15 / 1M tokenů (vstup), $75 / 1M tokenů (výstup)
- **Claude 3 Sonnet**: $3 / 1M tokenů (vstup), $15 / 1M tokenů (výstup)
- **Claude 3 Haiku**: $0.25 / 1M tokenů (vstup), $1.25 / 1M tokenů (výstup)
- Limit: Závisí na plánu

### Cohere

- **Command R**: $1 / 1M tokenů (vstup), $2 / 1M tokenů (výstup)
- **Command R+**: $5 / 1M tokenů (vstup), $15 / 1M tokenů (výstup)
- Limit: 5 požadavků / minutu pro free tier

### Gemini

- **Gemini 1.5 Flash**: $0.125 / 1M tokenů (vstup), $0.375 / 1M tokenů (výstup)
- **Gemini 1.5 Pro**: $0.25 / 1M tokenů (vstup), $0.75 / 1M tokenů (výstup)
- **Gemini 2.5 Pro**: $0.35 / 1M tokenů (vstup), $1.05 / 1M tokenů (výstup)
- **Gemini 2.5 Flash**: $0.175 / 1M tokenů (vstup), $0.525 / 1M tokenů (výstup)
- Limit: Závisí na plánu
