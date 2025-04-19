/**
 * Cesium Handler Module
 * 
 * This module encapsulates all Cesium-related functionality for the AIMapa application.
 * It provides a clean interface for initializing and controlling the 3D globe mode.
 */

// Cesium configuration
const CESIUM_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyMjg0MTU3Mn0.XcKpgANiY22ZtIiqSWFmj2XlPQd5HGDA-9N2FAB_5_4';
const BING_MAPS_KEY = 'AhbIRlUQ5NzgKaTXxE6Zf4_ReceZbw7TPkxVoF_C_rPmDU6bPBRQ1SxkQQFW0PO9';

// Module state
let cesiumViewer = null;
let isInitialized = false;
let isGlobeMode = false;
let globeMarkers = [];
let globeRoutes = [];
let mapReference = null;

/**
 * Initialize the Cesium module
 * This should be called once when the application starts
 * @param {Object} map - Reference to the Leaflet map
 * @returns {Promise} - Resolves when initialization is complete
 */
function initialize(map) {
    return new Promise((resolve, reject) => {
        try {
            // Store reference to the map
            mapReference = map;
            
            // Check if Cesium is available
            if (typeof Cesium === 'undefined') {
                throw new Error('Knihovna Cesium není dostupná. Zkontrolujte připojení k internetu.');
            }
            
            // Set Cesium ion access token
            Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;
            
            // Mark as initialized
            isInitialized = true;
            resolve();
        } catch (error) {
            console.error('Chyba při inicializaci Cesium modulu:', error);
            reject(error);
        }
    });
}

/**
 * Create the Cesium Viewer instance
 * @returns {Promise} - Resolves when the viewer is created
 */
function createViewer() {
    return new Promise((resolve, reject) => {
        try {
            // Check if already initialized
            if (!isInitialized) {
                throw new Error('Cesium modul nebyl inicializován. Zavolejte nejprve initialize().');
            }
            
            // Clean up existing viewer if it exists
            if (cesiumViewer) {
                try {
                    cesiumViewer.destroy();
                } catch (e) {
                    console.warn('Chyba při odstraňování předchozího Cesium Vieweru:', e);
                }
                cesiumViewer = null;
            }
            
            // Get reference to the Cesium container
            const cesiumContainer = document.getElementById('cesiumContainer');
            if (!cesiumContainer) {
                throw new Error('Cesium kontejner nebyl nalezen v DOM.');
            }
            
            // Clear the container
            cesiumContainer.innerHTML = '';
            
            // Set container styles
            cesiumContainer.style.display = 'block';
            cesiumContainer.style.width = '100%';
            cesiumContainer.style.height = '100%';
            cesiumContainer.style.position = 'absolute';
            cesiumContainer.style.top = '0';
            cesiumContainer.style.left = '0';
            cesiumContainer.style.zIndex = '1000';
            cesiumContainer.style.backgroundColor = '#000';
            
            // Create the Cesium Viewer with optimized settings
            cesiumViewer = new Cesium.Viewer('cesiumContainer', {
                animation: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                timeline: false,
                navigationHelpButton: false,
                navigationInstructionsInitiallyVisible: false,
                imageryProvider: new Cesium.BingMapsImageryProvider({
                    url: 'https://dev.virtualearth.net',
                    key: BING_MAPS_KEY,
                    mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
                }),
                terrainProvider: Cesium.createWorldTerrain({
                    requestWaterMask: true,
                    requestVertexNormals: true
                }),
                contextOptions: {
                    webgl: {
                        alpha: false,
                        antialias: true,
                        preserveDrawingBuffer: true,
                        failIfMajorPerformanceCaveat: false,
                        depth: true,
                        stencil: false
                    }
                },
                orderIndependentTranslucency: true,
                shadows: false,
                targetFrameRate: 60,
                useBrowserRecommendedResolution: true,
                automaticallyTrackDataSourceClocks: false
            });
            
            // Configure scene for better performance and visuals
            cesiumViewer.scene.globe.enableLighting = true;
            cesiumViewer.scene.skyAtmosphere.show = true;
            cesiumViewer.scene.fog.enabled = false;
            cesiumViewer.scene.globe.depthTestAgainstTerrain = true;
            cesiumViewer.scene.globe.maximumScreenSpaceError = 2.0;
            cesiumViewer.scene.sun.show = true;
            cesiumViewer.scene.moon.show = true;
            
            // Hide Cesium credits
            if (cesiumViewer.cesiumWidget && cesiumViewer.cesiumWidget.creditContainer) {
                cesiumViewer.cesiumWidget.creditContainer.style.display = 'none';
            }
            
            // Add event listeners for better performance
            cesiumViewer.scene.preRender.addEventListener(() => {
                // This ensures the scene is rendered only when needed
                if (isGlobeMode) {
                    cesiumViewer.scene.requestRender();
                }
            });
            
            resolve(cesiumViewer);
        } catch (error) {
            console.error('Chyba při vytváření Cesium Vieweru:', error);
            reject(error);
        }
    });
}

/**
 * Activate the globe mode
 * @param {Array} markers - Array of Leaflet markers to display on the globe
 * @param {Function} addMessageCallback - Function to display messages to the user
 * @returns {Promise} - Resolves when globe mode is activated
 */
function activateGlobeMode(markers, addMessageCallback) {
    return new Promise(async (resolve, reject) => {
        try {
            // Show loading overlay
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'flex';
            }
            
            // Create viewer if it doesn't exist
            if (!cesiumViewer) {
                await createViewer();
            }
            
            // Get current map center
            const center = mapReference.getCenter();
            
            // Set initial camera position
            cesiumViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 2000000),
                orientation: {
                    heading: 0.0,
                    pitch: -0.5,
                    roll: 0.0
                },
                duration: 2.0,
                complete: function() {
                    // Hide loading overlay
                    if (loadingOverlay) {
                        loadingOverlay.style.display = 'none';
                    }
                    
                    // Add controls
                    addGlobeControls();
                    
                    // Add markers and routes
                    addMarkersToGlobe(markers);
                    addRoutesToGlobe(markers);
                    
                    // Set globe mode flag
                    isGlobeMode = true;
                    
                    // Force render
                    cesiumViewer.scene.requestRender();
                    
                    // Display message to user
                    if (addMessageCallback) {
                        addMessageCallback('Glóbus režim byl aktivován. Nyní můžete vidět Zemi jako 3D kouli. Použijte ovládací prvky pro rotaci a přiblížení.', false);
                    }
                    
                    resolve();
                }
            });
        } catch (error) {
            console.error('Chyba při aktivaci glóbus režimu:', error);
            
            // Hide loading overlay
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.style.display = 'none';
            }
            
            // Display error message
            if (addMessageCallback) {
                addMessageCallback('Nepodařilo se aktivovat glóbus režim. Chyba: ' + error.message, true);
            }
            
            reject(error);
        }
    });
}

/**
 * Deactivate the globe mode
 * @param {Function} addMessageCallback - Function to display messages to the user
 * @returns {Promise} - Resolves when globe mode is deactivated
 */
function deactivateGlobeMode(addMessageCallback) {
    return new Promise((resolve, reject) => {
        try {
            // Remove controls
            removeGlobeControls();
            
            // Clear entities
            if (cesiumViewer) {
                cesiumViewer.entities.removeAll();
                globeMarkers = [];
                globeRoutes = [];
            }
            
            // Hide Cesium container
            const cesiumContainer = document.getElementById('cesiumContainer');
            if (cesiumContainer) {
                cesiumContainer.style.display = 'none';
            }
            
            // Show Leaflet container
            const leafletContainer = document.querySelector('.leaflet-container');
            if (leafletContainer) {
                leafletContainer.style.display = 'block';
            }
            
            // Update map size
            if (mapReference) {
                mapReference.invalidateSize();
            }
            
            // Set globe mode flag
            isGlobeMode = false;
            
            // Display message to user
            if (addMessageCallback) {
                addMessageCallback('Glóbus režim byl deaktivován. Mapa je nyní v klasickém 2D zobrazení.', false);
            }
            
            resolve();
        } catch (error) {
            console.error('Chyba při deaktivaci glóbus režimu:', error);
            
            // Display error message
            if (addMessageCallback) {
                addMessageCallback('Nepodařilo se deaktivovat glóbus režim. Chyba: ' + error.message, true);
            }
            
            reject(error);
        }
    });
}

/**
 * Add markers to the globe
 * @param {Array} markers - Array of Leaflet markers
 */
function addMarkersToGlobe(markers) {
    if (!cesiumViewer) {
        console.error('Cesium Viewer není inicializován');
        return;
    }
    
    try {
        // Clear existing markers
        globeMarkers.forEach(entityId => {
            cesiumViewer.entities.removeById(entityId);
        });
        globeMarkers = [];
        
        // Add new markers
        markers.forEach((marker, index) => {
            const position = marker.getLatLng();
            const properties = marker.properties || {};
            const name = properties.name || `Bod ${index + 1}`;
            
            // Create point entity
            const entity = cesiumViewer.entities.add({
                id: `marker-${index}`,
                name: name,
                position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 0),
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: name,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
            });
            
            globeMarkers.push(entity.id);
        });
    } catch (error) {
        console.error('Chyba při přidávání markerů na glóbus:', error);
    }
}

/**
 * Add routes between markers on the globe
 * @param {Array} markers - Array of Leaflet markers
 */
function addRoutesToGlobe(markers) {
    if (!cesiumViewer) {
        console.error('Cesium Viewer není inicializován');
        return;
    }
    
    try {
        // Clear existing routes
        globeRoutes.forEach(entityId => {
            cesiumViewer.entities.removeById(entityId);
        });
        globeRoutes = [];
        
        // If we don't have at least two markers, we can't create a route
        if (markers.length < 2) {
            return;
        }
        
        // Create positions array for the route
        const positions = [];
        markers.forEach(marker => {
            const position = marker.getLatLng();
            positions.push(position.lng, position.lat, 0);
        });
        
        // Create route entity
        const routeEntity = cesiumViewer.entities.add({
            id: 'route',
            name: 'Trasa',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
                width: 5,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: Cesium.Color.BLUE
                }),
                clampToGround: true
            }
        });
        
        globeRoutes.push(routeEntity.id);
    } catch (error) {
        console.error('Chyba při přidávání tras na glóbus:', error);
    }
}

/**
 * Add controls for the globe
 */
function addGlobeControls() {
    // Remove existing controls
    removeGlobeControls();
    
    // Create controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'mapGlobeControls';
    controlsContainer.className = 'map-globe-controls';
    
    // Create zoom in button
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'map-globe-control-btn';
    zoomInBtn.innerHTML = '+';
    zoomInBtn.title = 'Přiblížit';
    zoomInBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            cesiumViewer.camera.zoomIn(1000000);
        }
    });
    
    // Create zoom out button
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'map-globe-control-btn';
    zoomOutBtn.innerHTML = '-';
    zoomOutBtn.title = 'Oddálit';
    zoomOutBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            cesiumViewer.camera.zoomOut(1000000);
        }
    });
    
    // Create rotate left button
    const rotateLeftBtn = document.createElement('button');
    rotateLeftBtn.className = 'map-globe-control-btn';
    rotateLeftBtn.innerHTML = '↶';
    rotateLeftBtn.title = 'Rotovat doleva';
    rotateLeftBtn.addEventListener('click', () => {
        rotateGlobe(-0.1, 0);
    });
    
    // Create rotate right button
    const rotateRightBtn = document.createElement('button');
    rotateRightBtn.className = 'map-globe-control-btn';
    rotateRightBtn.innerHTML = '↷';
    rotateRightBtn.title = 'Rotovat doprava';
    rotateRightBtn.addEventListener('click', () => {
        rotateGlobe(0.1, 0);
    });
    
    // Create tilt up button
    const tiltUpBtn = document.createElement('button');
    tiltUpBtn.className = 'map-globe-control-btn';
    tiltUpBtn.innerHTML = '↑';
    tiltUpBtn.title = 'Naklonit nahoru';
    tiltUpBtn.addEventListener('click', () => {
        rotateGlobe(0, 0.1);
    });
    
    // Create tilt down button
    const tiltDownBtn = document.createElement('button');
    tiltDownBtn.className = 'map-globe-control-btn';
    tiltDownBtn.innerHTML = '↓';
    tiltDownBtn.title = 'Naklonit dolů';
    tiltDownBtn.addEventListener('click', () => {
        rotateGlobe(0, -0.1);
    });
    
    // Create reset view button
    const resetViewBtn = document.createElement('button');
    resetViewBtn.className = 'map-globe-control-btn';
    resetViewBtn.innerHTML = '⟲';
    resetViewBtn.title = 'Resetovat pohled';
    resetViewBtn.addEventListener('click', () => {
        if (cesiumViewer) {
            const center = mapReference.getCenter();
            cesiumViewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, 2000000),
                orientation: {
                    heading: 0.0,
                    pitch: -0.5,
                    roll: 0.0
                },
                duration: 1.0
            });
        }
    });
    
    // Add buttons to container
    controlsContainer.appendChild(zoomInBtn);
    controlsContainer.appendChild(zoomOutBtn);
    controlsContainer.appendChild(rotateLeftBtn);
    controlsContainer.appendChild(rotateRightBtn);
    controlsContainer.appendChild(tiltUpBtn);
    controlsContainer.appendChild(tiltDownBtn);
    controlsContainer.appendChild(resetViewBtn);
    
    // Add container to map
    document.getElementById('map').appendChild(controlsContainer);
}

/**
 * Remove globe controls
 */
function removeGlobeControls() {
    // Remove globe controls container
    const controlsContainer = document.getElementById('mapGlobeControls');
    if (controlsContainer) {
        controlsContainer.remove();
    }
    
    // Remove rotation controls
    const rotationControls = document.querySelector('.cesium-rotation-controls');
    if (rotationControls) {
        rotationControls.remove();
    }
}

/**
 * Rotate the globe
 * @param {Number} headingChange - Change in heading (horizontal rotation)
 * @param {Number} pitchChange - Change in pitch (vertical tilt)
 */
function rotateGlobe(headingChange, pitchChange) {
    if (!cesiumViewer) return;
    
    const camera = cesiumViewer.camera;
    const heading = camera.heading + headingChange;
    const pitch = camera.pitch + pitchChange;
    
    camera.setView({
        orientation: {
            heading: heading,
            pitch: pitch,
            roll: camera.roll
        }
    });
}

/**
 * Update marker on the globe
 * @param {Number} index - Index of the marker to update
 * @param {Object} marker - Leaflet marker
 */
function updateGlobeMarker(index, marker) {
    if (!cesiumViewer || !isGlobeMode) return;
    
    try {
        const position = marker.getLatLng();
        const properties = marker.properties || {};
        const name = properties.name || `Bod ${index + 1}`;
        
        // Find existing entity
        const entity = cesiumViewer.entities.getById(`marker-${index}`);
        
        if (entity) {
            // Update existing entity
            entity.position = Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 0);
            entity.label.text = name;
        } else {
            // Create new entity
            const newEntity = cesiumViewer.entities.add({
                id: `marker-${index}`,
                name: name,
                position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, 0),
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                },
                label: {
                    text: name,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY
                }
            });
            
            globeMarkers.push(newEntity.id);
        }
        
        // Update routes
        addRoutesToGlobe(markers);
    } catch (error) {
        console.error('Chyba při aktualizaci markeru na glóbusu:', error);
    }
}

/**
 * Check if globe mode is active
 * @returns {Boolean} - True if globe mode is active
 */
function isGlobeModeActive() {
    return isGlobeMode;
}

/**
 * Get the Cesium Viewer instance
 * @returns {Object} - Cesium Viewer instance
 */
function getViewer() {
    return cesiumViewer;
}

/**
 * Clean up resources
 */
function cleanup() {
    if (cesiumViewer) {
        try {
            cesiumViewer.destroy();
        } catch (e) {
            console.warn('Chyba při odstraňování Cesium Vieweru:', e);
        }
        cesiumViewer = null;
    }
    
    isInitialized = false;
    isGlobeMode = false;
    globeMarkers = [];
    globeRoutes = [];
    mapReference = null;
}

// Export public API
window.CesiumHandler = {
    initialize,
    activateGlobeMode,
    deactivateGlobeMode,
    addMarkersToGlobe,
    addRoutesToGlobe,
    updateGlobeMarker,
    isGlobeModeActive,
    getViewer,
    cleanup
};
