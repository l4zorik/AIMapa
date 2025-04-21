/**
 * Rozšířené mapové funkce pro verzi 0.2.9.0
 * Implementace nových mapových podkladů, vyhledávání, kreslení a měření
 */

// Objekt pro správu mapových funkcí
const MapFeatures = {
    // Reference na mapu
    map: null,
    
    // Aktivní mapové vrstvy
    layers: {
        baseLayers: {},
        overlays: {}
    },
    
    // Nástroje pro kreslení a měření
    drawTools: null,
    
    // Vyhledávací nástroje
    searchTools: null,
    
    // Inicializace mapových funkcí
    init(map) {
        this.map = map;
        this.initBaseLayers();
        this.initOverlays();
        this.initDrawTools();
        this.initSearchTools();
        this.initLayerControl();
        this.initClusterMarkers();
    },
    
    // Inicializace základních mapových vrstev
    initBaseLayers() {
        // Standardní OpenStreetMap vrstva
        this.layers.baseLayers["OpenStreetMap"] = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Topografická vrstva
        this.layers.baseLayers["Topografická"] = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
            maxZoom: 17
        });
        
        // Cyklistická vrstva
        this.layers.baseLayers["Cyklistická"] = L.tileLayer('https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=your-api-key', {
            attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        });
        
        // Turistická vrstva
        this.layers.baseLayers["Turistická"] = L.tileLayer('https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=your-api-key', {
            attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        });
        
        // Satelitní vrstva
        this.layers.baseLayers["Satelitní"] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        });
        
        // Tmavá vrstva
        this.layers.baseLayers["Tmavá"] = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });
    },
    
    // Inicializace překryvných vrstev
    initOverlays() {
        // Vrstva s body zájmu - restaurace
        this.layers.overlays["Restaurace"] = L.layerGroup();
        
        // Vrstva s body zájmu - hotely
        this.layers.overlays["Hotely"] = L.layerGroup();
        
        // Vrstva s body zájmu - památky
        this.layers.overlays["Památky"] = L.layerGroup();
        
        // Vrstva s body zájmu - doprava
        this.layers.overlays["Doprava"] = L.layerGroup();
        
        // Vrstva s vlastními body
        this.layers.overlays["Vlastní body"] = L.layerGroup().addTo(this.map);
    },
    
    // Inicializace nástrojů pro kreslení a měření
    initDrawTools() {
        // Přidání Leaflet.Draw pluginu
        this.drawTools = new L.Control.Draw({
            position: 'topright',
            draw: {
                polyline: {
                    shapeOptions: {
                        color: '#6366f1',
                        weight: 4
                    },
                    metric: true,
                    showLength: true
                },
                polygon: {
                    shapeOptions: {
                        color: '#6366f1'
                    },
                    allowIntersection: false,
                    showArea: true
                },
                rectangle: {
                    shapeOptions: {
                        color: '#6366f1'
                    }
                },
                circle: {
                    shapeOptions: {
                        color: '#6366f1'
                    }
                },
                marker: true
            },
            edit: {
                featureGroup: this.layers.overlays["Vlastní body"],
                remove: true
            }
        });
        
        // Přidání nástrojů pro kreslení do mapy
        this.map.addControl(this.drawTools);
        
        // Obsluha události vytvoření nového objektu
        this.map.on('draw:created', (event) => {
            const layer = event.layer;
            
            // Přidání informací o objektu
            if (event.layerType === 'marker') {
                layer.bindPopup('Vlastní bod');
            } else if (event.layerType === 'polyline') {
                const length = this.calculateLength(layer);
                layer.bindPopup(`Délka: ${length.toFixed(2)} km`);
            } else if (event.layerType === 'polygon') {
                const area = this.calculateArea(layer);
                layer.bindPopup(`Plocha: ${area.toFixed(2)} km²`);
            } else if (event.layerType === 'rectangle') {
                const area = this.calculateArea(layer);
                layer.bindPopup(`Plocha: ${area.toFixed(2)} km²`);
            } else if (event.layerType === 'circle') {
                const radius = layer.getRadius() / 1000;
                const area = Math.PI * radius * radius;
                layer.bindPopup(`Poloměr: ${radius.toFixed(2)} km<br>Plocha: ${area.toFixed(2)} km²`);
            }
            
            // Přidání objektu do vrstvy
            this.layers.overlays["Vlastní body"].addLayer(layer);
        });
    },
    
    // Výpočet délky linie v kilometrech
    calculateLength(layer) {
        let length = 0;
        const latlngs = layer.getLatLngs();
        
        for (let i = 0; i < latlngs.length - 1; i++) {
            length += latlngs[i].distanceTo(latlngs[i + 1]);
        }
        
        return length / 1000; // Převod na kilometry
    },
    
    // Výpočet plochy polygonu v kilometrech čtverečních
    calculateArea(layer) {
        return L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) / 1000000; // Převod na kilometry čtvereční
    },
    
    // Inicializace vyhledávacích nástrojů
    initSearchTools() {
        // Přidání Leaflet.Control.Search pluginu
        this.searchTools = new L.Control.Search({
            position: 'topleft',
            layer: this.layers.overlays["Vlastní body"],
            initial: false,
            zoom: 15,
            marker: false,
            textPlaceholder: 'Vyhledat místo...',
            textErr: 'Místo nenalezeno',
            textCancel: 'Zrušit',
            textPlaceholder: 'Vyhledat místo...',
            autoCollapse: true,
            autoType: false,
            minLength: 2
        });
        
        // Přidání vyhledávacích nástrojů do mapy
        this.map.addControl(this.searchTools);
        
        // Vytvoření našeptávače pro vyhledávání
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        }
    },
    
    // Obsluha události zadání textu do vyhledávacího pole
    handleSearchInput(event) {
        const searchText = event.target.value;
        
        if (searchText.length >= 3) {
            // Vyhledání míst pomocí Nominatim API
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`)
                .then(response => response.json())
                .then(data => {
                    this.showSearchResults(data);
                })
                .catch(error => {
                    console.error('Chyba při vyhledávání:', error);
                });
        }
    },
    
    // Zobrazení výsledků vyhledávání
    showSearchResults(results) {
        const searchResultsContainer = document.querySelector('.search-results');
        
        if (!searchResultsContainer) {
            return;
        }
        
        searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<div class="search-result-item">Žádné výsledky nenalezeny</div>';
            return;
        }
        
        results.slice(0, 5).forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = result.display_name;
            
            resultItem.addEventListener('click', () => {
                this.goToLocation(result.lat, result.lon, result.display_name);
                searchResultsContainer.innerHTML = '';
            });
            
            searchResultsContainer.appendChild(resultItem);
        });
    },
    
    // Přesun na vybrané místo
    goToLocation(lat, lon, name) {
        this.map.setView([lat, lon], 15);
        
        // Přidání dočasného markeru
        const marker = L.marker([lat, lon])
            .addTo(this.map)
            .bindPopup(name)
            .openPopup();
        
        // Odstranění markeru po 5 sekundách
        setTimeout(() => {
            this.map.removeLayer(marker);
        }, 5000);
    },
    
    // Inicializace ovládacího prvku pro vrstvy
    initLayerControl() {
        L.control.layers(this.layers.baseLayers, this.layers.overlays, {
            position: 'topright',
            collapsed: true
        }).addTo(this.map);
    },
    
    // Inicializace shlukování markerů
    initClusterMarkers() {
        // Vytvoření clusteru pro markery
        this.markerCluster = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 50,
            iconCreateFunction: function(cluster) {
                const count = cluster.getChildCount();
                let size = 'small';
                
                if (count > 10) {
                    size = 'medium';
                }
                if (count > 100) {
                    size = 'large';
                }
                
                return L.divIcon({
                    html: `<div class="cluster-marker cluster-marker-${size}">${count}</div>`,
                    className: 'custom-cluster-icon',
                    iconSize: L.point(40, 40)
                });
            }
        });
        
        // Přidání clusteru do mapy
        this.map.addLayer(this.markerCluster);
    },
    
    // Přidání markeru do clusteru
    addMarkerToCluster(marker) {
        this.markerCluster.addLayer(marker);
    },
    
    // Načtení bodů zájmu z OpenStreetMap
    loadPointsOfInterest(category, layerName) {
        const bounds = this.map.getBounds();
        const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
        
        // Vytvoření dotazu pro Overpass API
        const query = `
            [out:json];
            node["${category}"]
                (${bbox});
            out body;
        `;
        
        // Odeslání dotazu na Overpass API
        fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        })
            .then(response => response.json())
            .then(data => {
                // Vyčištění vrstvy
                this.layers.overlays[layerName].clearLayers();
                
                // Přidání bodů do vrstvy
                data.elements.forEach(element => {
                    const marker = L.marker([element.lat, element.lon], {
                        icon: this.getPoiIcon(category)
                    });
                    
                    // Vytvoření popupu s informacemi
                    let popupContent = `<div class="poi-popup">`;
                    
                    if (element.tags.name) {
                        popupContent += `<h3>${element.tags.name}</h3>`;
                    } else {
                        popupContent += `<h3>${layerName}</h3>`;
                    }
                    
                    if (element.tags.phone) {
                        popupContent += `<p><strong>Telefon:</strong> ${element.tags.phone}</p>`;
                    }
                    
                    if (element.tags.website) {
                        popupContent += `<p><strong>Web:</strong> <a href="${element.tags.website}" target="_blank">${element.tags.website}</a></p>`;
                    }
                    
                    if (element.tags.opening_hours) {
                        popupContent += `<p><strong>Otevírací doba:</strong> ${element.tags.opening_hours}</p>`;
                    }
                    
                    popupContent += `<div class="poi-actions">
                        <button class="btn btn-sm btn-primary poi-route-btn" data-lat="${element.lat}" data-lon="${element.lon}">Navigovat sem</button>
                        <button class="btn btn-sm btn-outline poi-save-btn" data-lat="${element.lat}" data-lon="${element.lon}" data-name="${element.tags.name || layerName}">Uložit</button>
                    </div>`;
                    
                    popupContent += `</div>`;
                    
                    marker.bindPopup(popupContent);
                    
                    // Přidání markeru do vrstvy
                    this.layers.overlays[layerName].addLayer(marker);
                });
                
                // Přidání vrstvy do mapy, pokud ještě není přidána
                if (!this.map.hasLayer(this.layers.overlays[layerName])) {
                    this.map.addLayer(this.layers.overlays[layerName]);
                }
            })
            .catch(error => {
                console.error(`Chyba při načítání bodů zájmu (${layerName}):`, error);
            });
    },
    
    // Získání ikony pro bod zájmu
    getPoiIcon(category) {
        let iconUrl = '';
        
        switch (category) {
            case 'amenity=restaurant':
                iconUrl = 'icons/restaurant.png';
                break;
            case 'tourism=hotel':
                iconUrl = 'icons/hotel.png';
                break;
            case 'historic=monument':
                iconUrl = 'icons/monument.png';
                break;
            case 'public_transport':
                iconUrl = 'icons/transport.png';
                break;
            default:
                iconUrl = 'icons/marker.png';
        }
        
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24]
        });
    },
    
    // Načtení vlastních GeoJSON dat
    loadGeoJSON(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    style: {
                        color: '#6366f1',
                        weight: 3,
                        opacity: 0.7
                    },
                    pointToLayer: (feature, latlng) => {
                        return L.marker(latlng);
                    },
                    onEachFeature: (feature, layer) => {
                        if (feature.properties && feature.properties.name) {
                            layer.bindPopup(feature.properties.name);
                        }
                    }
                }).addTo(this.layers.overlays["Vlastní body"]);
            })
            .catch(error => {
                console.error('Chyba při načítání GeoJSON dat:', error);
            });
    },
    
    // Vytvoření QR kódu pro sdílení aktuálního pohledu mapy
    createShareQRCode() {
        const center = this.map.getCenter();
        const zoom = this.map.getZoom();
        const url = `https://aimapa.cz/?lat=${center.lat.toFixed(6)}&lng=${center.lng.toFixed(6)}&zoom=${zoom}`;
        
        // Vytvoření QR kódu pomocí Google Charts API
        const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(url)}`;
        
        return {
            url: url,
            qrCodeUrl: qrCodeUrl
        };
    },
    
    // Zobrazení dialogu pro sdílení mapy
    showShareDialog() {
        const shareInfo = this.createShareQRCode();
        
        // Vytvoření dialogu
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog';
        dialog.innerHTML = `
            <div class="share-dialog-content">
                <h3>Sdílet aktuální pohled</h3>
                <div class="share-qr-code">
                    <img src="${shareInfo.qrCodeUrl}" alt="QR kód pro sdílení">
                </div>
                <div class="share-url">
                    <input type="text" value="${shareInfo.url}" readonly>
                    <button class="btn btn-primary copy-url-btn">Kopírovat</button>
                </div>
                <div class="share-social">
                    <button class="btn btn-outline share-facebook-btn">Facebook</button>
                    <button class="btn btn-outline share-twitter-btn">Twitter</button>
                    <button class="btn btn-outline share-email-btn">Email</button>
                </div>
                <button class="btn btn-secondary close-dialog-btn">Zavřít</button>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Obsluha události kopírování URL
        const copyUrlBtn = dialog.querySelector('.copy-url-btn');
        copyUrlBtn.addEventListener('click', () => {
            const urlInput = dialog.querySelector('.share-url input');
            urlInput.select();
            document.execCommand('copy');
            copyUrlBtn.textContent = 'Zkopírováno!';
            setTimeout(() => {
                copyUrlBtn.textContent = 'Kopírovat';
            }, 2000);
        });
        
        // Obsluha události sdílení na Facebooku
        const shareFacebookBtn = dialog.querySelector('.share-facebook-btn');
        shareFacebookBtn.addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareInfo.url)}`, '_blank');
        });
        
        // Obsluha události sdílení na Twitteru
        const shareTwitterBtn = dialog.querySelector('.share-twitter-btn');
        shareTwitterBtn.addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareInfo.url)}&text=Podívej se na tuto mapu!`, '_blank');
        });
        
        // Obsluha události sdílení emailem
        const shareEmailBtn = dialog.querySelector('.share-email-btn');
        shareEmailBtn.addEventListener('click', () => {
            window.location.href = `mailto:?subject=Sdílená mapa&body=Podívej se na tuto mapu: ${shareInfo.url}`;
        });
        
        // Obsluha události zavření dialogu
        const closeDialogBtn = dialog.querySelector('.close-dialog-btn');
        closeDialogBtn.addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
    }
};

// Export objektu pro použití v jiných souborech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapFeatures;
}
