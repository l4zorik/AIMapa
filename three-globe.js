// Three.js funkce pro glóbus režim

// Globální proměnné pro Three.js
let threeScene;
let threeCamera;
let threeRenderer;
let threeControls;
let threeGlobe;
let threeAnimationFrame;
let threeMarkers = [];
let threeRoutes = [];

// Inicializace Three.js glóbusu
function initThreeJsGlobe() {
    console.log('Inicializace Three.js glóbusu - začátek');

    try {
        // Kontrola, zda je Three.js dostupný
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js knihovna není načtena');
        }
        console.log('Three.js knihovna je dostupná:', THREE.REVISION);

        // Kontrola, zda existuje kontejner
        const container = document.getElementById('threeGlobeContainer');
        if (!container) {
            throw new Error('Kontejner threeGlobeContainer nebyl nalezen');
        }
        console.log('Kontejner pro Three.js nalezen');

        // Vytvoření scény
        threeScene = new THREE.Scene();
        console.log('Three.js scéna vytvořena');

        // Vytvoření kamery
        const aspect = container.clientWidth / container.clientHeight || 1;
        threeCamera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        threeCamera.position.z = 5;
        console.log('Three.js kamera vytvořena');

        // Vytvoření rendereru
        threeRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        threeRenderer.setSize(container.clientWidth, container.clientHeight);
        threeRenderer.setPixelRatio(window.devicePixelRatio);
        threeRenderer.setClearColor(0x000000, 1);
        console.log('Three.js renderer vytvořen');

        // Přidání rendereru do DOM
        container.innerHTML = '';
        container.appendChild(threeRenderer.domElement);
        console.log('Three.js renderer přidán do DOM');

        // Přidání ovládacích prvků
        if (typeof THREE.OrbitControls === 'undefined') {
            console.warn('THREE.OrbitControls není dostupný, použijeme záložní řešení');
            // Záložní řešení bez OrbitControls
            threeControls = {
                update: function() {},
                enableDamping: true,
                dampingFactor: 0.05,
                rotateSpeed: 0.5,
                minDistance: 2,
                maxDistance: 15
            };
        } else {
            threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
            threeControls.enableDamping = true;
            threeControls.dampingFactor = 0.05;
            threeControls.rotateSpeed = 0.5;
            threeControls.minDistance = 2;
            threeControls.maxDistance = 15;
        }
        console.log('Three.js ovládací prvky vytvořeny');

        // Vytvoření glóbusu
        createGlobe();
        console.log('Three.js glóbus vytvořen');

        // Přidání osvětlení
        addLighting();
        console.log('Three.js osvětlení přidáno');

        // Přidání hvězd na pozadí
        addStarBackground();
        console.log('Three.js hvězdy přidány');

        // Přizpůsobení velikosti při změně velikosti okna
        window.addEventListener('resize', onWindowResize);

        // První vykreslení
        threeRenderer.render(threeScene, threeCamera);
        console.log('Three.js první vykreslení provedeno');

        console.log('Inicializace Three.js glóbusu - dokončeno');
        return true;
    } catch (error) {
        console.error('Chyba při inicializaci Three.js glóbusu:', error);
        return false;
    }
}

// Vytvoření glóbusu
function createGlobe() {
    try {
        console.log('Vytváření glóbusu - začátek');

        // Vytvoření textury Země
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = 'anonymous';

        console.log('Načítání textur Země');

        // Jednodušší textury pro rychlejší načtení
        const earthTexture = textureLoader.load(
            'https://cdn.jsdelivr.net/npm/three/examples/textures/planets/earth_atmos_2048.jpg',
            // Callback při úspěšném načtení
            function() { console.log('Textura Země načtena'); },
            // Callback při načítání
            function() { console.log('Načítání textury Země...'); },
            // Callback při chybě
            function(err) { console.error('Chyba při načítání textury Země:', err); }
        );

        // Záložní textura pro případ, že se nepodaří načíst hlavní textura
        earthTexture.name = 'earthTexture';

        // Vytvoření materiálu pro Zemi - jednodušší verze bez bump a specular map
        const earthMaterial = new THREE.MeshPhongMaterial({
            map: earthTexture,
            shininess: 5
        });

        // Vytvoření geometrie pro Zemi
        const earthGeometry = new THREE.SphereGeometry(2, 32, 32); // Snížení počtu segmentů pro lepší výkon

        // Vytvoření meshe pro Zemi
        threeGlobe = new THREE.Mesh(earthGeometry, earthMaterial);

        // Přidání Země do scény
        threeScene.add(threeGlobe);

        // Nastavení rotace
        threeGlobe.rotation.y = Math.PI;

        // Jednodušší mraky
        const cloudsTexture = textureLoader.load(
            'https://cdn.jsdelivr.net/npm/three/examples/textures/planets/earth_clouds_1024.png',
            // Callback při úspěšném načtení
            function() { console.log('Textura mraků načtena'); },
            // Callback při načítání
            function() { console.log('Načítání textury mraků...'); },
            // Callback při chybě
            function(err) { console.error('Chyba při načítání textury mraků:', err); }
        );

        // Přidání vrstvy mraků
        const cloudsGeometry = new THREE.SphereGeometry(2.05, 32, 32);
        const cloudsMaterial = new THREE.MeshPhongMaterial({
            map: cloudsTexture,
            transparent: true,
            opacity: 0.4
        });

        const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        threeScene.add(clouds);

        // Pomalejší rotace mraků
        clouds.rotation.y = Math.PI;

        // Přidání animace mraků
        threeScene.userData.clouds = clouds;

        console.log('Glóbus úspěšně vytvořen');
        return true;
    } catch (error) {
        console.error('Chyba při vytváření glóbusu:', error);
        return false;
    }
}

// Přidání osvětlení
function addLighting() {
    // Ambientní světlo
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    threeScene.add(ambientLight);

    // Směrové světlo (slunce)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(-5, 3, 5);
    threeScene.add(sunLight);

    // Bodové světlo pro zvýraznění
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 3, 5);
    threeScene.add(pointLight);
}

// Přidání hvězd na pozadí
function addStarBackground() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    threeScene.add(stars);
}

// Přizpůsobení velikosti při změně velikosti okna
function onWindowResize() {
    try {
        const container = document.getElementById('threeGlobeContainer');
        if (!container) {
            console.warn('Three.js glóbus kontejner nenalezen při změně velikosti okna');
            return;
        }

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (threeCamera) {
            threeCamera.aspect = width / height;
            threeCamera.updateProjectionMatrix();
        }

        if (threeRenderer) {
            threeRenderer.setSize(width, height);
            // Vynucení nového vykreslení
            if (threeScene && threeCamera) {
                threeRenderer.render(threeScene, threeCamera);
            }
        }

        console.log(`Three.js glóbus přizpůsoben nové velikosti: ${width}x${height}`);
    } catch (error) {
        console.error('Chyba při změně velikosti Three.js glóbusu:', error);
    }
}

// Animační smyčka
function animate() {
    threeAnimationFrame = requestAnimationFrame(animate);

    try {
        // Rotace glóbusu
        if (threeGlobe) {
            threeGlobe.rotation.y += 0.0005;
        }

        // Rotace mraků (pomalejší než glóbus)
        if (threeScene && threeScene.userData.clouds) {
            threeScene.userData.clouds.rotation.y += 0.0003;
        }

        // Aktualizace ovládacích prvků
        if (threeControls) {
            threeControls.update();
        }

        // Vykreslení scény
        if (threeRenderer && threeScene && threeCamera) {
            threeRenderer.render(threeScene, threeCamera);
        }
    } catch (error) {
        console.error('Chyba v animační smyčce:', error);
        // Zastavit animační smyčku při chybě, aby se nezacyklila
        if (threeAnimationFrame) {
            cancelAnimationFrame(threeAnimationFrame);
            threeAnimationFrame = null;
        }
    }
}

// Spuštění animační smyčky
function startThreeAnimation() {
    if (!threeAnimationFrame) {
        animate();
    }
}

// Zastavení animační smyčky
function stopThreeAnimation() {
    if (threeAnimationFrame) {
        cancelAnimationFrame(threeAnimationFrame);
        threeAnimationFrame = null;
    }
}

// Převod zeměpisných souřadnic na 3D souřadnice
function latLngToVector3(lat, lng, radius = 2) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Přidání markerů na glóbus
function addMarkersToThreeGlobe() {
    try {
        console.log('Přidávání markerů na glóbus - začátek');

        // Odstranění existujících markerů
        clearThreeMarkers();
        console.log('Existující markery odstraněny');

        // Kontrola, zda existuje globální proměnná markers
        if (typeof window.markers === 'undefined' || !Array.isArray(window.markers)) {
            console.warn('Globální proměnná markers není definována nebo není pole');
            return;
        }

        console.log(`Počet markerů k přidání: ${window.markers.length}`);

        // Přidání nových markerů
        window.markers.forEach((marker, index) => {
            try {
                const position = marker.getLatLng();
                console.log(`Marker ${index + 1} pozice:`, position);

                const vector3 = latLngToVector3(position.lat, position.lng);

                // Vytvoření markeru
                const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
                const markerMaterial = new THREE.MeshPhongMaterial({
                    color: 0x8B5CF6,
                    emissive: 0x4B0082,
                    shininess: 30,
                    specular: 0xffffff
                });
                const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);

                // Nastavení pozice
                markerMesh.position.copy(vector3);

                // Přidání do scény
                threeScene.add(markerMesh);

                // Získání názvu markeru z markerProperties
                let markerName = `Bod ${index + 1}`;
                if (typeof window.markerProperties !== 'undefined' &&
                    Array.isArray(window.markerProperties) &&
                    window.markerProperties[index] &&
                    window.markerProperties[index].name) {
                    markerName = window.markerProperties[index].name;
                }

                // Uložení reference
                threeMarkers.push({
                    mesh: markerMesh,
                    index: index,
                    name: markerName
                });

                // Přidání čísla markeru
                addMarkerLabel(vector3, index + 1);

                console.log(`Marker ${index + 1} (${markerName}) přidán na glóbus`);
            } catch (error) {
                console.error(`Chyba při přidávání markeru ${index + 1}:`, error);
            }
        });

        console.log('Přidávání markerů na glóbus - dokončeno');
    } catch (error) {
        console.error('Chyba při přidávání markerů na glóbus:', error);
    }
}

// Přidání popisku k markeru
function addMarkerLabel(position, number) {
    // Vytvoření canvasu pro text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;

    // Nastavení stylu textu
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.beginPath();
    context.arc(32, 32, 16, 0, 2 * Math.PI);
    context.fill();

    context.font = 'bold 24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number.toString(), 32, 32);

    // Vytvoření textury z canvasu
    const texture = new THREE.CanvasTexture(canvas);

    // Vytvoření materiálu
    const material = new THREE.SpriteMaterial({ map: texture });

    // Vytvoření spritu
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.multiplyScalar(1.05); // Mírně nad povrchem
    sprite.scale.set(0.2, 0.2, 1);

    // Přidání do scény
    threeScene.add(sprite);

    // Uložení reference
    threeMarkers.push({ mesh: sprite, isLabel: true });
}

// Přidání tras mezi body na glóbusu
function addRoutesToThreeGlobe() {
    try {
        console.log('Přidávání tras na glóbus - začátek');

        // Kontrola, zda existuje globální proměnná markers
        if (typeof window.markers === 'undefined' || !Array.isArray(window.markers)) {
            console.warn('Globální proměnná markers není definována nebo není pole');
            return;
        }

        // Kontrola, zda máme alespoň dva body
        if (window.markers.length < 2) {
            console.log('Pro vytvoření trasy je potřeba alespoň dva body');
            return;
        }

        console.log(`Počet bodů pro trasy: ${window.markers.length}`);

        // Vytvoření křivky pro trasu
        const curvePoints = [];

        // Přidání bodů do křivky
        window.markers.forEach((marker, index) => {
            try {
                const position = marker.getLatLng();
                const vector3 = latLngToVector3(position.lat, position.lng);
                curvePoints.push(vector3);
                console.log(`Bod ${index + 1} přidán do trasy`);
            } catch (error) {
                console.error(`Chyba při přidávání bodu ${index + 1} do trasy:`, error);
            }
        });

        // Vytvoření křivky
        for (let i = 0; i < curvePoints.length - 1; i++) {
            try {
                const start = curvePoints[i];
                const end = curvePoints[i + 1];

                // Vytvoření obloukové křivky mezi body
                const curveSegment = createCurvedLine(start, end);

                // Přidání do scény
                threeScene.add(curveSegment);

                // Uložení reference
                threeRoutes.push(curveSegment);

                console.log(`Trasa mezi body ${i + 1} a ${i + 2} vytvořena`);
            } catch (error) {
                console.error(`Chyba při vytváření trasy mezi body ${i + 1} a ${i + 2}:`, error);
            }
        }

        console.log('Přidávání tras na glóbus - dokončeno');
    } catch (error) {
        console.error('Chyba při přidávání tras na glóbus:', error);
    }
}

// Vytvoření obloukové křivky mezi dvěma body
function createCurvedLine(start, end) {
    // Výpočet středového bodu pro oblouk
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);

    // Normalizace středového bodu na povrch koule
    mid.normalize().multiplyScalar(2 + distance * 0.2);

    // Vytvoření křivky
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

    // Vytvoření geometrie z křivky
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Vytvoření materiálu
    const material = new THREE.LineBasicMaterial({
        color: 0x00aaff,
        linewidth: 2,
        transparent: true,
        opacity: 0.8
    });

    // Vytvoření křivky
    const curveObject = new THREE.Line(geometry, material);

    return curveObject;
}

// Vyčištění markerů a tras
function clearThreeGlobe() {
    try {
        console.log('Vyčišťování glóbusu - začátek');

        // Vyčištění markerů
        clearThreeMarkers();
        console.log('Markery odstraněny');

        // Vyčištění tras
        clearThreeRoutes();
        console.log('Trasy odstraněny');

        // Obnovení glóbusu a mraků
        if (threeScene) {
            // Zachování pouze glóbusu a mraků
            const objectsToKeep = [];

            // Projdeme všechny objekty ve scéně
            threeScene.children.forEach(child => {
                // Pokud je to glóbus nebo mraky, zachováme
                if (child === threeGlobe || (threeScene.userData.clouds && child === threeScene.userData.clouds)) {
                    objectsToKeep.push(child);
                }
            });

            // Odstraníme všechny objekty ze scény
            while (threeScene.children.length > 0) {
                threeScene.remove(threeScene.children[0]);
            }

            // Přidáme zpět glóbus a mraky
            objectsToKeep.forEach(obj => {
                threeScene.add(obj);
            });

            console.log('Scéna vyčištěna, glóbus a mraky zachovány');

            // Přidání osvětlení
            addLighting();
            console.log('Osvětlení obnoveno');
        }

        console.log('Vyčišťování glóbusu - dokončeno');
    } catch (error) {
        console.error('Chyba při čištění glóbusu:', error);
    }
}

// Vyčištění markerů
function clearThreeMarkers() {
    threeMarkers.forEach(marker => {
        threeScene.remove(marker.mesh);
        if (marker.mesh.material) {
            marker.mesh.material.dispose();
        }
        if (marker.mesh.geometry) {
            marker.mesh.geometry.dispose();
        }
    });

    threeMarkers = [];
}

// Vyčištění tras
function clearThreeRoutes() {
    threeRoutes.forEach(route => {
        threeScene.remove(route);
        if (route.material) {
            route.material.dispose();
        }
        if (route.geometry) {
            route.geometry.dispose();
        }
    });

    threeRoutes = [];
}

// Export funkcí do globálního prostoru pro použití v script.js
window.initThreeJsGlobe = initThreeJsGlobe;
window.addMarkersToThreeGlobe = addMarkersToThreeGlobe;
window.addRoutesToThreeGlobe = addRoutesToThreeGlobe;
window.clearThreeGlobe = clearThreeGlobe;
window.startThreeAnimation = startThreeAnimation;
window.stopThreeAnimation = stopThreeAnimation;
