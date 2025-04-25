/**
 * Modul pro export bodů a tras do GPX/KML formátu
 * Verze 0.2.8.6.2
 */

const ExportData = {
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro export dat...');
        
        // Přidání tlačítka pro export dat
        this.createExportButton();
        
        console.log('Modul pro export dat byl inicializován');
    },
    
    // Vytvoření tlačítka pro export dat
    createExportButton() {
        // Kontrola, zda již tlačítko neexistuje
        if (document.getElementById('exportButton')) {
            return;
        }
        
        // Vytvoření tlačítka
        const exportButton = document.createElement('button');
        exportButton.id = 'exportButton';
        exportButton.className = 'export-button';
        exportButton.innerHTML = '<i class="icon">📤</i>';
        exportButton.title = 'Exportovat data';
        
        // Přidání tlačítka do mapy
        const mapControls = document.querySelector('.leaflet-bottom.leaflet-right');
        if (mapControls) {
            const controlContainer = document.createElement('div');
            controlContainer.className = 'leaflet-control-export leaflet-bar leaflet-control';
            controlContainer.appendChild(exportButton);
            mapControls.appendChild(controlContainer);
        }
        
        // Přidání event listeneru
        exportButton.addEventListener('click', () => {
            this.showExportModal();
        });
    },
    
    // Zobrazení modalu pro export
    showExportModal() {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('exportModal')) {
            return;
        }
        
        // Kontrola, zda jsou na mapě nějaké body
        if (!markers || markers.length === 0) {
            addMessage('Na mapě nejsou žádné body k exportu.', false);
            return;
        }
        
        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'exportModal';
        modal.className = 'export-modal';
        
        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="export-modal-content">
                <div class="export-modal-header">
                    <h2>Exportovat data</h2>
                    <button class="export-modal-close">&times;</button>
                </div>
                <div class="export-modal-body">
                    <p>Vyberte formát pro export bodů a tras:</p>
                    <div class="export-options">
                        <button id="exportGpx" class="export-option">
                            <div class="export-option-icon">📁</div>
                            <div class="export-option-info">
                                <div class="export-option-name">GPX</div>
                                <div class="export-option-description">GPS Exchange Format - kompatibilní s většinou GPS zařízení a aplikací</div>
                            </div>
                        </button>
                        <button id="exportKml" class="export-option">
                            <div class="export-option-icon">📁</div>
                            <div class="export-option-info">
                                <div class="export-option-name">KML</div>
                                <div class="export-option-description">Keyhole Markup Language - kompatibilní s Google Earth a Google Maps</div>
                            </div>
                        </button>
                        <button id="exportJson" class="export-option">
                            <div class="export-option-icon">📁</div>
                            <div class="export-option-info">
                                <div class="export-option-name">JSON</div>
                                <div class="export-option-description">JavaScript Object Notation - univerzální formát pro vývojáře</div>
                            </div>
                        </button>
                        <button id="exportCsv" class="export-option">
                            <div class="export-option-icon">📁</div>
                            <div class="export-option-info">
                                <div class="export-option-name">CSV</div>
                                <div class="export-option-description">Comma-Separated Values - kompatibilní s tabulkovými procesory</div>
                            </div>
                        </button>
                    </div>
                    <div class="export-settings">
                        <h3>Nastavení exportu:</h3>
                        <div class="export-setting">
                            <input type="checkbox" id="exportIncludeRoute" checked>
                            <label for="exportIncludeRoute">Zahrnout trasu</label>
                        </div>
                        <div class="export-setting">
                            <input type="checkbox" id="exportIncludeMarkers" checked>
                            <label for="exportIncludeMarkers">Zahrnout body</label>
                        </div>
                        <div class="export-setting">
                            <input type="checkbox" id="exportIncludeProperties" checked>
                            <label for="exportIncludeProperties">Zahrnout vlastnosti bodů (název, popis)</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Přidání modalu do dokumentu
        document.body.appendChild(modal);
        
        // Animace zobrazení
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // Přidání event listenerů
        const closeButton = modal.querySelector('.export-modal-close');
        const exportGpxButton = modal.querySelector('#exportGpx');
        const exportKmlButton = modal.querySelector('#exportKml');
        const exportJsonButton = modal.querySelector('#exportJson');
        const exportCsvButton = modal.querySelector('#exportCsv');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');
                
                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }
        
        if (exportGpxButton) {
            exportGpxButton.addEventListener('click', () => {
                this.exportData('gpx');
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        }
        
        if (exportKmlButton) {
            exportKmlButton.addEventListener('click', () => {
                this.exportData('kml');
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        }
        
        if (exportJsonButton) {
            exportJsonButton.addEventListener('click', () => {
                this.exportData('json');
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        }
        
        if (exportCsvButton) {
            exportCsvButton.addEventListener('click', () => {
                this.exportData('csv');
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            });
        }
        
        // Zavření modalu při kliknutí mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                
                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
    },
    
    // Export dat
    exportData(format) {
        // Získání nastavení exportu
        const includeRoute = document.getElementById('exportIncludeRoute').checked;
        const includeMarkers = document.getElementById('exportIncludeMarkers').checked;
        const includeProperties = document.getElementById('exportIncludeProperties').checked;
        
        // Kontrola, zda je vybrána alespoň jedna možnost
        if (!includeRoute && !includeMarkers) {
            addMessage('Vyberte alespoň jednu možnost pro export.', false);
            return;
        }
        
        // Získání dat pro export
        const exportData = this.prepareExportData(includeMarkers, includeRoute, includeProperties);
        
        // Export dat podle formátu
        switch (format) {
            case 'gpx':
                this.exportGpx(exportData);
                break;
            case 'kml':
                this.exportKml(exportData);
                break;
            case 'json':
                this.exportJson(exportData);
                break;
            case 'csv':
                this.exportCsv(exportData);
                break;
            default:
                addMessage(`Neznámý formát exportu: ${format}`, false);
                break;
        }
    },
    
    // Příprava dat pro export
    prepareExportData(includeMarkers, includeRoute, includeProperties) {
        const data = {
            markers: [],
            route: []
        };
        
        // Přidání markerů
        if (includeMarkers && markers && markers.length > 0) {
            markers.forEach((marker, index) => {
                const latlng = marker.getLatLng();
                const properties = markerProperties[index] || {};
                
                const markerData = {
                    lat: latlng.lat,
                    lng: latlng.lng
                };
                
                // Přidání vlastností, pokud jsou požadovány
                if (includeProperties) {
                    markerData.name = properties.name || `Bod ${index + 1}`;
                    markerData.description = properties.description || '';
                }
                
                data.markers.push(markerData);
            });
        }
        
        // Přidání trasy
        if (includeRoute && currentRoute) {
            // Získání bodů trasy z Leaflet Routing Machine
            const routeCoordinates = currentRoute.getWaypoints().map(wp => wp.latLng);
            
            // Přidání bodů trasy
            routeCoordinates.forEach(coord => {
                data.route.push({
                    lat: coord.lat,
                    lng: coord.lng
                });
            });
        }
        
        return data;
    },
    
    // Export do GPX formátu
    exportGpx(data) {
        // Vytvoření GPX dokumentu
        let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
        gpx += '<gpx version="1.1" creator="AIMapa" xmlns="http://www.topografix.com/GPX/1/1">\n';
        
        // Přidání bodů
        if (data.markers.length > 0) {
            data.markers.forEach(marker => {
                gpx += '  <wpt lat="' + marker.lat + '" lon="' + marker.lng + '">\n';
                if (marker.name) {
                    gpx += '    <name>' + this.escapeXml(marker.name) + '</name>\n';
                }
                if (marker.description) {
                    gpx += '    <desc>' + this.escapeXml(marker.description) + '</desc>\n';
                }
                gpx += '  </wpt>\n';
            });
        }
        
        // Přidání trasy
        if (data.route.length > 0) {
            gpx += '  <trk>\n';
            gpx += '    <name>AIMapa Trasa</name>\n';
            gpx += '    <trkseg>\n';
            
            data.route.forEach(point => {
                gpx += '      <trkpt lat="' + point.lat + '" lon="' + point.lng + '"></trkpt>\n';
            });
            
            gpx += '    </trkseg>\n';
            gpx += '  </trk>\n';
        }
        
        gpx += '</gpx>';
        
        // Stažení GPX souboru
        this.downloadFile(gpx, 'aimapa-export.gpx', 'application/gpx+xml');
        
        // Zobrazení informace o exportu
        addMessage('Data byla exportována do GPX formátu.', false);
    },
    
    // Export do KML formátu
    exportKml(data) {
        // Vytvoření KML dokumentu
        let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
        kml += '<Document>\n';
        kml += '  <name>AIMapa Export</name>\n';
        
        // Styly pro body a trasu
        kml += '  <Style id="markerStyle">\n';
        kml += '    <IconStyle>\n';
        kml += '      <Icon>\n';
        kml += '        <href>http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png</href>\n';
        kml += '      </Icon>\n';
        kml += '    </IconStyle>\n';
        kml += '  </Style>\n';
        
        kml += '  <Style id="routeStyle">\n';
        kml += '    <LineStyle>\n';
        kml += '      <color>ff0000ff</color>\n';
        kml += '      <width>4</width>\n';
        kml += '    </LineStyle>\n';
        kml += '  </Style>\n';
        
        // Přidání bodů
        if (data.markers.length > 0) {
            data.markers.forEach(marker => {
                kml += '  <Placemark>\n';
                kml += '    <styleUrl>#markerStyle</styleUrl>\n';
                if (marker.name) {
                    kml += '    <name>' + this.escapeXml(marker.name) + '</name>\n';
                }
                if (marker.description) {
                    kml += '    <description>' + this.escapeXml(marker.description) + '</description>\n';
                }
                kml += '    <Point>\n';
                kml += '      <coordinates>' + marker.lng + ',' + marker.lat + ',0</coordinates>\n';
                kml += '    </Point>\n';
                kml += '  </Placemark>\n';
            });
        }
        
        // Přidání trasy
        if (data.route.length > 0) {
            kml += '  <Placemark>\n';
            kml += '    <name>AIMapa Trasa</name>\n';
            kml += '    <styleUrl>#routeStyle</styleUrl>\n';
            kml += '    <LineString>\n';
            kml += '      <tessellate>1</tessellate>\n';
            kml += '      <coordinates>\n';
            
            data.route.forEach(point => {
                kml += '        ' + point.lng + ',' + point.lat + ',0\n';
            });
            
            kml += '      </coordinates>\n';
            kml += '    </LineString>\n';
            kml += '  </Placemark>\n';
        }
        
        kml += '</Document>\n';
        kml += '</kml>';
        
        // Stažení KML souboru
        this.downloadFile(kml, 'aimapa-export.kml', 'application/vnd.google-earth.kml+xml');
        
        // Zobrazení informace o exportu
        addMessage('Data byla exportována do KML formátu.', false);
    },
    
    // Export do JSON formátu
    exportJson(data) {
        // Vytvoření JSON dokumentu
        const json = JSON.stringify(data, null, 2);
        
        // Stažení JSON souboru
        this.downloadFile(json, 'aimapa-export.json', 'application/json');
        
        // Zobrazení informace o exportu
        addMessage('Data byla exportována do JSON formátu.', false);
    },
    
    // Export do CSV formátu
    exportCsv(data) {
        // Vytvoření CSV dokumentu
        let csv = 'Type,Name,Description,Latitude,Longitude\n';
        
        // Přidání bodů
        if (data.markers.length > 0) {
            data.markers.forEach(marker => {
                const name = marker.name ? this.escapeCsv(marker.name) : '';
                const description = marker.description ? this.escapeCsv(marker.description) : '';
                csv += `Waypoint,${name},${description},${marker.lat},${marker.lng}\n`;
            });
        }
        
        // Přidání trasy
        if (data.route.length > 0) {
            data.route.forEach((point, index) => {
                csv += `RoutePoint,Point ${index + 1},,${point.lat},${point.lng}\n`;
            });
        }
        
        // Stažení CSV souboru
        this.downloadFile(csv, 'aimapa-export.csv', 'text/csv');
        
        // Zobrazení informace o exportu
        addMessage('Data byla exportována do CSV formátu.', false);
    },
    
    // Stažení souboru
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    },
    
    // Escapování XML znaků
    escapeXml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    },
    
    // Escapování CSV znaků
    escapeCsv(text) {
        if (!text) return '';
        if (text.includes(',') || text.includes('"') || text.includes('\n')) {
            return '"' + text.replace(/"/g, '""') + '"';
        }
        return text;
    },
    
    // Zpracování příkazu z chatu
    processCommand(text) {
        // Kontrola, zda text obsahuje příkaz pro export dat
        const exportCommands = ['exportovat', 'export', 'stáhnout data', 'uložit data', 'uložit body'];
        
        for (const command of exportCommands) {
            if (text.toLowerCase().includes(command)) {
                // Zobrazení modalu pro export
                this.showExportModal();
                return true;
            }
        }
        
        return false;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    ExportData.init();
});
