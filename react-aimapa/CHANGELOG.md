# react-aimapa Changelog

## [0.4.3-secret] - 2024-06-01

### Opravy
- Opraveno vytváření úkolů z chatu - nyní se úkoly vytvářejí dynamicky na základě zadaného příkazu
- Odstraněno opakované vytváření úkolu "výlet do Prahy"
- Vylepšen design tlačítka "Skrýt chat" pro lepší uživatelský zážitek

### Technické změny
- Upravena funkce `generateRelevantSubtasks` v `TaskUtils.ts` pro dynamické generování podúkolů
- Opravena funkce `handleCreatePlanFromChat` v `EnhancedMapPage.tsx` pro správné zpracování příkazů z chatu
- Vylepšeno CSS pro tlačítko "Skrýt chat" s animacemi a lepším vizuálním stylem

## [0.4.3] - 2025-05-10 (plánováno)

### Data Fetching Vylepšení
- Integrován TanStack Query (@tanstack/react-query)
  - Implementován QueryClient pro správu stavu a cachování dat
  - Přidána podpora pro efektivní cachování API požadavků
  - Vylepšena správa stavů načítání a chyb v React komponentách
  - Implementovány optimistické updaty pro rychlejší odezvu UI
  - Přidáno prefetching dat pro plynulejší UX
  - Přidána dokumentace pro používání TanStack Query v projektu
  - Všechny změny jsou modulární pro snadné odstranění

### Backend Endpoints
- Implementováno REST API pro lokace
  - GET /api/locations pro seznam lokací
  - POST /api/locations pro nové lokace
  - PATCH /api/locations/:id pro úpravy
  - DELETE /api/locations/:id pro mazání
- Dočasné in-memory úložiště pro vývoj (bude nahrazeno Supabase)

## [0.4.2] - 2024-05-30

### Nové funkce
- Přidána podpora pro Gemini 1.5 Flash API
- Implementována funkce pro automatické vytváření plánů z chatu
- Přidána možnost přidávat lokace k úkolům přímo z chatu
- Implementována funkce pro zobrazení seznamu všech úkolů v chatu

### Vylepšení
- Vylepšeno uživatelské rozhraní pro chat
- Optimalizováno zobrazení plánů a úkolů
- Přidána podpora pro více API poskytovatelů
