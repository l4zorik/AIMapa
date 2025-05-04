# Mapové poskytovatele v AIMapa

Tato dokumentace popisuje implementaci a použití různých mapových poskytovatelů v aplikaci AIMapa, se zaměřením na bezplatné a lokální poskytovatele pro střední Evropu.

## Obsah

1. [Přehled](#přehled)
2. [Dostupní poskytovatelé](#dostupní-poskytovatelé)
3. [Architektura](#architektura)
4. [Použití](#použití)
5. [Přidání nového poskytovatele](#přidání-nového-poskytovatele)
6. [Pokročilé funkce](#pokročilé-funkce)
7. [Offline režim](#offline-režim)
8. [Příklady](#příklady)

## Přehled

AIMapa podporuje různé mapové poskytovatele, což umožňuje uživatelům vybrat si nejvhodnější mapy pro jejich potřeby a lokalitu. Implementace je navržena tak, aby poskytovala jednotné rozhraní pro práci s různými mapovými API, a zároveň umožňovala využít specifické funkce jednotlivých poskytovatelů.

Hlavní výhody použití různých mapových poskytovatelů:

- **Lokální specializace**: Místní poskytovatelé často nabízejí detailnější a přesnější mapy pro konkrétní regiony
- **Specializované mapy**: Turistické, cyklistické a další tematické mapy
- **Rozložení zátěže**: Možnost přepínat mezi poskytovateli v případě výpadku nebo omezení
- **Offline režim**: Možnost stažení mapových dlaždic pro offline použití

## Dostupní poskytovatelé

### OpenStreetMap

- **ID**: `openstreetmap`
- **Popis**: Otevřená mapová data pro celý svět
- **Země**: Celosvětové pokrytí
- **Výhody**: Univerzální pokrytí, otevřená data, aktivní komunita
- **Omezení**: Méně detailů v některých oblastech, základní styly map

### Mapy.cz

- **ID**: `mapycz`
- **Popis**: Nejpopulárnější mapová služba v České republice a na Slovensku
- **Země**: Česká republika, Slovensko
- **Výhody**: Detailní mapy ČR a SR, turistické trasy, panoramatické pohledy, dopravní informace
- **Omezení**: Omezené API, primární zaměření na ČR a SR

### OpenRouteService

- **ID**: `openrouteservice`
- **Popis**: Služba pro plánování tras založená na OpenStreetMap s pokročilými funkcemi
- **Země**: Celosvětové pokrytí, detailnější v Evropě
- **Výhody**: Pokročilé plánování tras, isochrone, matice vzdáleností, optimalizace tras
- **Omezení**: Vyžaduje API klíč, omezení počtu požadavků

### Windy

- **ID**: `windy`
- **Popis**: Služba pro zobrazení počasí a předpovědi s pokročilými funkcemi
- **Země**: Celosvětové pokrytí
- **Výhody**: Detailní předpovědi počasí, animace, různé modely předpovědi
- **Omezení**: Vyžaduje API klíč, primárně zaměřeno na počasí

### Freemap Slovakia

- **ID**: `freemapsk`
- **Popis**: Otevřená mapová služba pro Slovensko s turistickými mapami
- **Země**: Slovensko
- **Výhody**: Detailní turistické a cyklistické mapy Slovenska, fotografie
- **Omezení**: Omezené na Slovensko

### BASemap (Rakousko)

- **ID**: `basemap`
- **Popis**: Oficiální mapová služba Rakouska
- **Země**: Rakousko
- **Výhody**: Detailní mapy Rakouska, oficiální data
- **Omezení**: Omezené na Rakousko

### Geoportal Poland

- **ID**: `geoportalpl`
- **Popis**: Oficiální mapová služba Polska
- **Země**: Polsko
- **Výhody**: Detailní mapy Polska, oficiální data
- **Omezení**: Omezené na Polsko

### GeoData Bavaria

- **ID**: `geodatabavaria`
- **Popis**: Mapová služba pro Bavorsko
- **Země**: Německo (Bavorsko)
- **Výhody**: Detailní mapy Bavorska
- **Omezení**: Omezené na Bavorsko

## Architektura

Architektura mapových poskytovatelů je založena na návrhovém vzoru Facade (fasáda), který poskytuje jednotné rozhraní pro práci s různými mapovými API.

### Hlavní komponenty

1. **MapProviders**: Hlavní modul pro správu mapových poskytovatelů
2. **Poskytovatelé**: Implementace jednotlivých mapových poskytovatelů
3. **Rozhraní**: Jednotné rozhraní pro práci s mapovými poskytovateli

### Struktura souborů

```
public/app/map-providers/
├── map-providers.js         # Hlavní modul
├── openstreetmap-provider.js # Součást map-providers.js
├── mapycz-provider.js       # Mapy.cz poskytovatel
├── openrouteservice-provider.js # OpenRouteService poskytovatel
├── windy-provider.js        # Windy poskytovatel
├── freemapsk-provider.js    # Freemap Slovakia poskytovatel
├── basemap-provider.js      # BASemap poskytovatel (Rakousko)
├── geoportalpl-provider.js  # Geoportal Poland poskytovatel
└── geodatabavaria-provider.js # GeoData Bavaria poskytovatel
```

## Použití

### Inicializace

```javascript
// Inicializace modulu mapových poskytovatelů
MapProviders.init('openstreetmap');

// Inicializace s API klíčem pro konkrétního poskytovatele
if (typeof OpenRouteServiceProvider !== 'undefined') {
    OpenRouteServiceProvider.init('váš-api-klíč');
}
```

### Změna poskytovatele

```javascript
// Změna poskytovatele
MapProviders.setProvider('mapycz');

// Získání nejlepšího poskytovatele pro danou zemi
const bestProvider = MapProviders.getBestProviderForCountry('CZ');
MapProviders.setProvider(bestProvider);
```

### Získání mapových dlaždic

```javascript
// Získání mapových dlaždic
const tileLayer = MapProviders.getTileLayer();

// Použití s Leaflet
L.tileLayer(tileLayer.url, tileLayer.options).addTo(map);
```

### Vyhledávání míst

```javascript
// Vyhledání místa podle názvu
const results = await MapProviders.searchPlace('Praha', {
    limit: 10,
    countryCode: 'CZ'
});

// Zpracování výsledků
results.forEach(result => {
    console.log(`${result.name}: ${result.coordinates}`);
});
```

### Plánování tras

```javascript
// Získání trasy mezi dvěma body
const route = await MapProviders.getRoute(
    [50.0755, 14.4378], // Praha
    [49.1951, 16.6068], // Brno
    {
        profile: 'car',
        instructions: true
    }
);

// Zobrazení trasy na mapě
L.geoJSON(route.geometry).addTo(map);

// Zobrazení instrukcí
route.legs[0].steps.forEach(step => {
    console.log(`${step.instruction} (${step.distance} m)`);
});
```

### Získání počasí

```javascript
// Získání počasí pro bod
const weather = await MapProviders.getWeather([50.0755, 14.4378]);

// Zobrazení aktuálního počasí
console.log(`Teplota: ${weather.current.temperature}°C`);
console.log(`Vítr: ${weather.current.windSpeed} m/s, ${weather.current.windDirection}°`);
```

## Přidání nového poskytovatele

Pro přidání nového poskytovatele je potřeba implementovat následující rozhraní:

```javascript
const NewProvider = {
    name: 'Název poskytovatele',
    description: 'Popis poskytovatele',
    countries: ['XX', 'YY'], // ISO kódy zemí
    attribution: '© Poskytovatel',
    website: 'https://poskytovatel.com/',
    
    // Inicializace poskytovatele
    init: function(apiKey = '') {
        // Inicializace
        return Promise.resolve();
    },
    
    // Získání mapových dlaždic
    getTileLayer: function() {
        return {
            url: 'https://poskytovatel.com/tiles/{z}/{x}/{y}.png',
            options: {
                attribution: this.attribution,
                maxZoom: 19
            }
        };
    },
    
    // Vyhledání místa podle názvu
    searchPlace: async function(query, options = {}) {
        // Implementace
    },
    
    // Získání trasy mezi dvěma body
    getRoute: async function(start, end, options = {}) {
        // Implementace
    },
    
    // Získání informací o místě
    getPlaceInfo: async function(coordinates) {
        // Implementace
    }
    
    // Další metody...
};

// Registrace poskytovatele
MapProviders.registerProvider('newprovider', NewProvider);
```

## Pokročilé funkce

### Isochrone (oblasti dosažitelné v určitém čase)

```javascript
// Získání isochrony (pouze OpenRouteService)
const isochrones = await OpenRouteServiceProvider.getIsochrones(
    [50.0755, 14.4378], // Praha
    {
        range: [300, 600, 900], // 5, 10, 15 minut
        rangeType: 'time',
        profile: 'car'
    }
);

// Zobrazení isochrony na mapě
isochrones.forEach(isochrone => {
    L.geoJSON(isochrone.geometry, {
        style: {
            color: getColorForRange(isochrone.range),
            fillOpacity: 0.2
        }
    }).addTo(map);
});
```

### Optimalizace trasy (problém obchodního cestujícího)

```javascript
// Optimalizace trasy (pouze OpenRouteService)
const optimizedRoute = await OpenRouteServiceProvider.optimizeRoute([
    [50.0755, 14.4378], // Praha
    [49.1951, 16.6068], // Brno
    [49.8175, 18.2625], // Ostrava
    [50.7599, 15.0588]  // Liberec
], {
    profile: 'car'
});

// Zobrazení optimalizované trasy na mapě
L.geoJSON(optimizedRoute.geometry).addTo(map);
```

### Turistické trasy

```javascript
// Získání turistických tras (pouze Freemap Slovakia)
const hikingTrails = await FreemapSlovakiaProvider.getHikingTrails([
    [48.5, 17.0], // Jihozápadní roh
    [49.5, 20.0]  // Severovýchodní roh
]);

// Zobrazení turistických tras na mapě
hikingTrails.forEach(trail => {
    L.geoJSON(trail.geometry, {
        style: {
            color: trail.color,
            weight: 3
        }
    }).addTo(map);
});
```

## Offline režim

AIMapa podporuje offline režim, který umožňuje stažení mapových dlaždic pro offline použití.

```javascript
// Získání offline mapových dlaždic pro oblast
const tiles = await MapProviders.getOfflineTiles(
    [
        [50.0, 14.3], // Jihozápadní roh
        [50.1, 14.5]  // Severovýchodní roh
    ],
    [10, 11, 12, 13] // Úrovně přiblížení
);

// Stažení dlaždic
tiles.forEach(tile => {
    downloadTile(tile.url, tile.x, tile.y, tile.zoom);
});
```

## Příklady

### Zobrazení mapy s automatickým výběrem poskytovatele podle země

```javascript
// Inicializace mapy
const map = L.map('map').setView([50.0755, 14.4378], 10);

// Získání geolokace
navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    // Získání informací o místě
    MapProviders.getPlaceInfo([lat, lon]).then(placeInfo => {
        // Získání kódu země
        const countryCode = placeInfo.address.country_code.toUpperCase();
        
        // Získání nejlepšího poskytovatele pro danou zemi
        const bestProvider = MapProviders.getBestProviderForCountry(countryCode);
        
        // Nastavení poskytovatele
        MapProviders.setProvider(bestProvider);
        
        // Získání mapových dlaždic
        const tileLayer = MapProviders.getTileLayer();
        
        // Přidání vrstvy na mapu
        L.tileLayer(tileLayer.url, tileLayer.options).addTo(map);
        
        // Přesunutí mapy na aktuální polohu
        map.setView([lat, lon], 13);
    });
});
```

### Vyhledávání a zobrazení trasy

```javascript
// Funkce pro vyhledání a zobrazení trasy
async function searchAndShowRoute() {
    // Získání hodnot z formuláře
    const startQuery = document.getElementById('start').value;
    const endQuery = document.getElementById('end').value;
    const profile = document.getElementById('profile').value;
    
    try {
        // Vyhledání výchozího bodu
        const startResults = await MapProviders.searchPlace(startQuery, { limit: 1 });
        if (startResults.length === 0) {
            throw new Error('Výchozí bod nenalezen');
        }
        const start = startResults[0].coordinates;
        
        // Vyhledání cílového bodu
        const endResults = await MapProviders.searchPlace(endQuery, { limit: 1 });
        if (endResults.length === 0) {
            throw new Error('Cílový bod nenalezen');
        }
        const end = endResults[0].coordinates;
        
        // Získání trasy
        const route = await MapProviders.getRoute(start, end, { profile });
        
        // Zobrazení trasy na mapě
        if (routeLayer) {
            map.removeLayer(routeLayer);
        }
        
        routeLayer = L.geoJSON(route.geometry).addTo(map);
        
        // Přizpůsobení zobrazení
        map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
        
        // Zobrazení informací o trase
        document.getElementById('route-info').innerHTML = `
            <p><strong>Vzdálenost:</strong> ${(route.distance / 1000).toFixed(1)} km</p>
            <p><strong>Doba:</strong> ${Math.floor(route.duration / 3600)} h ${Math.floor((route.duration % 3600) / 60)} min</p>
        `;
        
        // Zobrazení instrukcí
        const instructionsHtml = route.legs[0].steps.map(step => `
            <li>${step.instruction} (${(step.distance / 1000).toFixed(1)} km)</li>
        `).join('');
        
        document.getElementById('route-instructions').innerHTML = `
            <ol>${instructionsHtml}</ol>
        `;
    } catch (error) {
        console.error('Chyba při vyhledávání trasy:', error);
        alert(`Chyba: ${error.message}`);
    }
}
```

---

*Poslední aktualizace: 2025-07-20*
