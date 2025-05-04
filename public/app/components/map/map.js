/**
 * AIMapa - Skript pro mapu
 * Verze 0.3.0.16
 */

// Globální objekt mapy
const Map = {
    // Reference na mapu Leaflet
    map: null,
    
    // Výchozí souřadnice (Praha)
    defaultCoords: {
        lat: 50.0755,
        lng: 14.4378
    },
    
    // Výchozí zoom
    defaultZoom: 13,
    
    // Inicializace mapy
    init: function() {
        console.log('Inicializace mapy...');
        
        // Vytvoření mapy
        this.map = L.map('map').setView([this.defaultCoords.lat, this.defaultCoords.lng], this.defaultZoom);
        
        // Přidání vrstvy OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        // Přidání markerů
        this.addMarkers();
        
        console.log('Mapa byla inicializována');
    },
    
    // Přidání markerů na mapu
    addMarkers: function() {
        // Příklad markerů
        const markers = [
            {
                lat: 50.0755,
                lng: 14.4378,
                title: 'Praha',
                description: 'Hlavní město České republiky'
            },
            {
                lat: 50.0793,
                lng: 14.4293,
                title: 'Václavské náměstí',
                description: 'Jedno z hlavních náměstí v Praze'
            },
            {
                lat: 50.0865,
                lng: 14.4208,
                title: 'Hlavní nádraží',
                description: 'Největší vlakové nádraží v Praze'
            }
        ];
        
        // Přidání markerů na mapu
        markers.forEach(marker => {
            L.marker([marker.lat, marker.lng])
                .addTo(this.map)
                .bindPopup(`<b>${marker.title}</b><br>${marker.description}`);
        });
    },
    
    // Zaměření mapy
    focus: function() {
        // Aktualizace velikosti mapy
        this.map.invalidateSize();
        
        // Zaměření na výchozí souřadnice
        this.map.setView([this.defaultCoords.lat, this.defaultCoords.lng], this.defaultZoom);
    },
    
    // Získání bodů trasy
    getRouteWaypoints: function() {
        // Zde bude v budoucnu získávání bodů trasy z mapy
        return [];
    }
};

// Export pro použití v jiných skriptech
window.Map = Map;
