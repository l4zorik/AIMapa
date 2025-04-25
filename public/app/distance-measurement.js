/**
 * Modul pro měření vzdálenosti mezi body na mapě
 * Verze 0.2.8.6.2
 */

const DistanceMeasurement = {
    // Stav měření
    measuring: false,
    
    // Body měření
    measurePoints: [],
    
    // Linie měření
    measureLine: null,
    
    // Marker pro zobrazení vzdálenosti
    distanceMarker: null,
    
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro měření vzdálenosti...');
        
        // Přidání tlačítka pro měření vzdálenosti
        this.createMeasureButton();
        
        console.log('Modul pro měření vzdálenosti byl inicializován');
    },
    
    // Vytvoření tlačítka pro měření vzdálenosti
    createMeasureButton() {
        // Kontrola, zda již tlačítko neexistuje
        if (document.getElementById('measureButton')) {
            return;
        }
        
        // Vytvoření tlačítka
        const measureButton = document.createElement('button');
        measureButton.id = 'measureButton';
        measureButton.className = 'measure-button';
        measureButton.innerHTML = '<i class="icon">📏</i>';
        measureButton.title = 'Měření vzdálenosti';
        
        // Přidání tlačítka do mapy
        const mapControls = document.querySelector('.leaflet-top.leaflet-left');
        if (mapControls) {
            const controlContainer = document.createElement('div');
            controlContainer.className = 'leaflet-control-measure leaflet-bar leaflet-control';
            controlContainer.appendChild(measureButton);
            mapControls.appendChild(controlContainer);
        }
        
        // Přidání event listeneru
        measureButton.addEventListener('click', () => {
            this.toggleMeasuring();
        });
    },
    
    // Přepnutí režimu měření
    toggleMeasuring() {
        this.measuring = !this.measuring;
        
        // Aktualizace stavu tlačítka
        const measureButton = document.getElementById('measureButton');
        if (measureButton) {
            if (this.measuring) {
                measureButton.classList.add('active');
                this.startMeasuring();
            } else {
                measureButton.classList.remove('active');
                this.stopMeasuring();
            }
        }
    },
    
    // Zahájení měření
    startMeasuring() {
        // Zobrazení informace o zahájení měření
        addMessage('Měření vzdálenosti zahájeno. Klikněte na mapu pro přidání bodů měření. Pro ukončení měření klikněte znovu na tlačítko měření.', false);
        
        // Přidání event listeneru pro kliknutí na mapu
        map.on('click', this.handleMapClick, this);
        
        // Změna kurzoru
        document.querySelector('.leaflet-container').style.cursor = 'crosshair';
    },
    
    // Ukončení měření
    stopMeasuring() {
        // Odstranění event listeneru
        map.off('click', this.handleMapClick, this);
        
        // Obnovení kurzoru
        document.querySelector('.leaflet-container').style.cursor = '';
        
        // Vyčištění bodů měření
        this.clearMeasurement();
        
        // Zobrazení informace o ukončení měření
        addMessage('Měření vzdálenosti ukončeno.', false);
    },
    
    // Zpracování kliknutí na mapu
    handleMapClick(e) {
        // Přidání bodu do seznamu
        this.measurePoints.push(e.latlng);
        
        // Vytvoření markeru pro bod
        const marker = L.marker(e.latlng, {
            icon: L.divIcon({
                className: 'measure-point',
                html: `<div class="measure-point-inner"></div>`,
                iconSize: [10, 10]
            })
        }).addTo(map);
        
        // Přidání markeru do seznamu
        if (!this.measureMarkers) {
            this.measureMarkers = [];
        }
        this.measureMarkers.push(marker);
        
        // Aktualizace linie měření
        this.updateMeasureLine();
    },
    
    // Aktualizace linie měření
    updateMeasureLine() {
        // Odstranění existující linie
        if (this.measureLine) {
            map.removeLayer(this.measureLine);
        }
        
        // Odstranění existujícího markeru vzdálenosti
        if (this.distanceMarker) {
            map.removeLayer(this.distanceMarker);
        }
        
        // Pokud máme alespoň dva body, vytvoříme linii
        if (this.measurePoints.length >= 2) {
            // Vytvoření linie
            this.measureLine = L.polyline(this.measurePoints, {
                color: '#FF4500',
                weight: 3,
                opacity: 0.7,
                dashArray: '5, 10'
            }).addTo(map);
            
            // Výpočet celkové vzdálenosti
            let totalDistance = 0;
            for (let i = 1; i < this.measurePoints.length; i++) {
                totalDistance += this.measurePoints[i-1].distanceTo(this.measurePoints[i]);
            }
            
            // Formátování vzdálenosti
            let distanceText = '';
            if (totalDistance < 1000) {
                distanceText = `${Math.round(totalDistance)} m`;
            } else {
                distanceText = `${(totalDistance / 1000).toFixed(2)} km`;
            }
            
            // Vytvoření markeru pro zobrazení vzdálenosti
            const midPoint = this.getMidPoint();
            this.distanceMarker = L.marker(midPoint, {
                icon: L.divIcon({
                    className: 'distance-marker',
                    html: `<div class="distance-marker-inner">${distanceText}</div>`,
                    iconSize: [80, 30]
                })
            }).addTo(map);
            
            // Zobrazení informace o vzdálenosti v chatu
            addMessage(`Naměřená vzdálenost: ${distanceText} (${this.measurePoints.length} bodů)`, false);
        }
    },
    
    // Získání středového bodu pro zobrazení vzdálenosti
    getMidPoint() {
        if (this.measurePoints.length < 2) {
            return null;
        }
        
        // Pro dva body vrátíme střed mezi nimi
        if (this.measurePoints.length === 2) {
            const p1 = this.measurePoints[0];
            const p2 = this.measurePoints[1];
            return L.latLng(
                (p1.lat + p2.lat) / 2,
                (p1.lng + p2.lng) / 2
            );
        }
        
        // Pro více bodů vrátíme střed mezi prvním a posledním bodem
        const p1 = this.measurePoints[0];
        const p2 = this.measurePoints[this.measurePoints.length - 1];
        return L.latLng(
            (p1.lat + p2.lat) / 2,
            (p1.lng + p2.lng) / 2
        );
    },
    
    // Vyčištění měření
    clearMeasurement() {
        // Odstranění bodů
        if (this.measureMarkers) {
            this.measureMarkers.forEach(marker => {
                map.removeLayer(marker);
            });
            this.measureMarkers = [];
        }
        
        // Odstranění linie
        if (this.measureLine) {
            map.removeLayer(this.measureLine);
            this.measureLine = null;
        }
        
        // Odstranění markeru vzdálenosti
        if (this.distanceMarker) {
            map.removeLayer(this.distanceMarker);
            this.distanceMarker = null;
        }
        
        // Vyčištění bodů měření
        this.measurePoints = [];
    },
    
    // Zpracování příkazu z chatu
    processCommand(text) {
        // Kontrola, zda text obsahuje příkaz pro měření vzdálenosti
        const measureCommands = ['měření vzdálenosti', 'změřit vzdálenost', 'měřit vzdálenost', 'vzdálenost'];
        
        for (const command of measureCommands) {
            if (text.toLowerCase().includes(command)) {
                // Aktivace měření vzdálenosti
                if (!this.measuring) {
                    this.toggleMeasuring();
                }
                return true;
            }
        }
        
        return false;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    DistanceMeasurement.init();
});
