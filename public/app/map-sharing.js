/**
 * Modul pro sdílení aktuálního stavu mapy přes URL
 * Verze 0.2.8.6.2
 */

const MapSharing = {
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro sdílení mapy...');
        
        // Přidání tlačítka pro sdílení mapy
        this.createShareButton();
        
        // Kontrola URL parametrů při načtení stránky
        this.checkUrlParameters();
        
        console.log('Modul pro sdílení mapy byl inicializován');
    },
    
    // Vytvoření tlačítka pro sdílení mapy
    createShareButton() {
        // Kontrola, zda již tlačítko neexistuje
        if (document.getElementById('shareButton')) {
            return;
        }
        
        // Vytvoření tlačítka
        const shareButton = document.createElement('button');
        shareButton.id = 'shareButton';
        shareButton.className = 'share-button';
        shareButton.innerHTML = '<i class="icon">🔗</i>';
        shareButton.title = 'Sdílet mapu';
        
        // Přidání tlačítka do mapy
        const mapControls = document.querySelector('.leaflet-bottom.leaflet-right');
        if (mapControls) {
            const controlContainer = document.createElement('div');
            controlContainer.className = 'leaflet-control-share leaflet-bar leaflet-control';
            controlContainer.appendChild(shareButton);
            mapControls.appendChild(controlContainer);
        }
        
        // Přidání event listeneru
        shareButton.addEventListener('click', () => {
            this.shareMap();
        });
    },
    
    // Sdílení mapy
    shareMap() {
        // Získání aktuálního stavu mapy
        const mapState = this.getMapState();
        
        // Vytvoření URL se stavem mapy
        const shareUrl = this.createShareUrl(mapState);
        
        // Zobrazení modalu pro sdílení
        this.showShareModal(shareUrl);
    },
    
    // Získání aktuálního stavu mapy
    getMapState() {
        // Základní stav mapy
        const mapState = {
            center: {
                lat: map.getCenter().lat.toFixed(6),
                lng: map.getCenter().lng.toFixed(6)
            },
            zoom: map.getZoom(),
            markers: []
        };
        
        // Přidání markerů
        if (markers && markers.length > 0) {
            markers.forEach((marker, index) => {
                const latlng = marker.getLatLng();
                const properties = markerProperties[index] || {};
                
                mapState.markers.push({
                    lat: latlng.lat.toFixed(6),
                    lng: latlng.lng.toFixed(6),
                    name: properties.name || `Bod ${index + 1}`,
                    description: properties.description || ''
                });
            });
        }
        
        return mapState;
    },
    
    // Vytvoření URL pro sdílení
    createShareUrl(mapState) {
        // Zakódování stavu mapy do Base64
        const stateJson = JSON.stringify(mapState);
        const stateBase64 = btoa(encodeURIComponent(stateJson));
        
        // Vytvoření URL
        const url = new URL(window.location.href);
        url.searchParams.set('state', stateBase64);
        
        return url.href;
    },
    
    // Zobrazení modalu pro sdílení
    showShareModal(shareUrl) {
        // Kontrola, zda již modal neexistuje
        if (document.getElementById('shareModal')) {
            return;
        }
        
        // Vytvoření modalu
        const modal = document.createElement('div');
        modal.id = 'shareModal';
        modal.className = 'share-modal';
        
        // Vytvoření obsahu modalu
        modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-modal-header">
                    <h2>Sdílet mapu</h2>
                    <button class="share-modal-close">&times;</button>
                </div>
                <div class="share-modal-body">
                    <p>Zkopírujte následující odkaz pro sdílení aktuálního stavu mapy:</p>
                    <div class="share-url-container">
                        <input type="text" id="shareUrlInput" class="share-url-input" value="${shareUrl}" readonly>
                        <button id="copyShareUrl" class="copy-share-url">Kopírovat</button>
                    </div>
                    <div class="share-options">
                        <h3>Sdílet přes:</h3>
                        <div class="share-buttons">
                            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" class="share-button-facebook">
                                Facebook
                            </a>
                            <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Podívej se na moji mapu v AIMapa!" target="_blank" class="share-button-twitter">
                                Twitter
                            </a>
                            <a href="mailto:?subject=Sdílená mapa z AIMapa&body=Podívej se na moji mapu: ${encodeURIComponent(shareUrl)}" class="share-button-email">
                                E-mail
                            </a>
                            <a href="https://api.whatsapp.com/send?text=Podívej se na moji mapu: ${encodeURIComponent(shareUrl)}" target="_blank" class="share-button-whatsapp">
                                WhatsApp
                            </a>
                        </div>
                    </div>
                    <div class="share-qr-code">
                        <h3>QR kód:</h3>
                        <div id="shareQrCode" class="share-qr-code-image">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}" alt="QR kód pro sdílení mapy">
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
        const closeButton = modal.querySelector('.share-modal-close');
        const copyButton = modal.querySelector('#copyShareUrl');
        const shareUrlInput = modal.querySelector('#shareUrlInput');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.remove('show');
                
                // Odstranění elementu po dokončení animace
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        }
        
        if (copyButton && shareUrlInput) {
            copyButton.addEventListener('click', () => {
                // Kopírování URL do schránky
                shareUrlInput.select();
                document.execCommand('copy');
                
                // Změna textu tlačítka na potvrzení
                copyButton.textContent = 'Zkopírováno!';
                copyButton.classList.add('copied');
                
                // Obnovení textu tlačítka po 2 sekundách
                setTimeout(() => {
                    copyButton.textContent = 'Kopírovat';
                    copyButton.classList.remove('copied');
                }, 2000);
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
        
        // Zobrazení informace o vytvoření odkazu
        addMessage('Odkaz pro sdílení mapy byl vytvořen.', false);
    },
    
    // Kontrola URL parametrů při načtení stránky
    checkUrlParameters() {
        // Získání parametru state z URL
        const urlParams = new URLSearchParams(window.location.search);
        const stateParam = urlParams.get('state');
        
        if (stateParam) {
            try {
                // Dekódování stavu mapy z Base64
                const stateJson = decodeURIComponent(atob(stateParam));
                const mapState = JSON.parse(stateJson);
                
                // Aplikace stavu mapy
                this.applyMapState(mapState);
                
                // Zobrazení informace o načtení sdílené mapy
                addMessage('Byla načtena sdílená mapa.', false);
            } catch (error) {
                console.error('Chyba při načítání sdílené mapy:', error);
                addMessage('Chyba při načítání sdílené mapy.', false);
            }
        }
    },
    
    // Aplikace stavu mapy
    applyMapState(mapState) {
        // Nastavení pohledu mapy
        if (mapState.center && mapState.zoom) {
            map.setView([mapState.center.lat, mapState.center.lng], mapState.zoom);
        }
        
        // Přidání markerů
        if (mapState.markers && mapState.markers.length > 0) {
            // Vyčištění existujících markerů
            if (typeof clearMap === 'function') {
                clearMap();
            }
            
            // Přidání nových markerů
            mapState.markers.forEach(markerData => {
                if (typeof addMarker === 'function') {
                    addMarker(
                        parseFloat(markerData.lat),
                        parseFloat(markerData.lng),
                        markerData.name,
                        markerData.description
                    );
                }
            });
            
            // Výpočet trasy, pokud je více markerů
            if (mapState.markers.length > 1 && typeof calculateRoute === 'function') {
                calculateRoute();
            }
        }
    },
    
    // Zpracování příkazu z chatu
    processCommand(text) {
        // Kontrola, zda text obsahuje příkaz pro sdílení mapy
        const shareCommands = ['sdílet mapu', 'sdílet', 'vytvořit odkaz', 'odkaz na mapu'];
        
        for (const command of shareCommands) {
            if (text.toLowerCase().includes(command)) {
                // Sdílení mapy
                this.shareMap();
                return true;
            }
        }
        
        return false;
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    MapSharing.init();
});
