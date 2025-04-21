// Jednoduchá verze Three.js glóbusu
// Globální proměnné
let threeScene;
let threeCamera;
let threeRenderer;
let threeControls;
let threeGlobe;
let threeAnimationFrame;

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
            alpha: true
        });
        threeRenderer.setSize(container.clientWidth, container.clientHeight);
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
                update: function() {}
            };
        } else {
            threeControls = new THREE.OrbitControls(threeCamera, threeRenderer.domElement);
            threeControls.enableDamping = true;
            threeControls.dampingFactor = 0.05;
            threeControls.rotateSpeed = 0.5;
        }
        console.log('Three.js ovládací prvky vytvořeny');

        // Vytvoření jednoduchého glóbusu
        createSimpleGlobe();
        console.log('Three.js glóbus vytvořen');

        // Přidání osvětlení
        addSimpleLighting();
        console.log('Three.js osvětlení přidáno');

        // Přizpůsobení velikosti při změně velikosti okna
        window.addEventListener('resize', onWindowResize);

        // První vykreslení
        threeRenderer.render(threeScene, threeCamera);
        console.log('Three.js první vykreslení provedeno');

        // Spuštění animační smyčky
        startThreeAnimation();
        console.log('Animační smyčka spuštěna');

        console.log('Inicializace Three.js glóbusu - dokončeno');
        return true;
    } catch (error) {
        console.error('Chyba při inicializaci Three.js glóbusu:', error);
        return false;
    }
}

// Vytvoření jednoduchého glóbusu
function createSimpleGlobe() {
    try {
        // Vytvoření geometrie pro Zemi
        const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
        
        // Vytvoření jednoduchého materiálu pro Zemi
        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244,
            specular: 0xffffff,
            shininess: 30
        });
        
        // Vytvoření meshe pro Zemi
        threeGlobe = new THREE.Mesh(earthGeometry, earthMaterial);
        
        // Přidání Země do scény
        threeScene.add(threeGlobe);
        
        return true;
    } catch (error) {
        console.error('Chyba při vytváření glóbusu:', error);
        return false;
    }
}

// Přidání jednoduchého osvětlení
function addSimpleLighting() {
    // Ambientní světlo
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    threeScene.add(ambientLight);

    // Směrové světlo
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    threeScene.add(directionalLight);
}

// Přizpůsobení velikosti při změně velikosti okna
function onWindowResize() {
    try {
        const container = document.getElementById('threeGlobeContainer');
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (threeCamera) {
            threeCamera.aspect = width / height;
            threeCamera.updateProjectionMatrix();
        }

        if (threeRenderer) {
            threeRenderer.setSize(width, height);
            if (threeScene && threeCamera) {
                threeRenderer.render(threeScene, threeCamera);
            }
        }
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
            threeGlobe.rotation.y += 0.005;
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
        stopThreeAnimation();
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

// Vyčištění scény
function clearThreeGlobe() {
    try {
        // Zastavení animační smyčky
        stopThreeAnimation();
        
        // Odstranění všech objektů ze scény kromě glóbusu
        if (threeScene) {
            const objectsToKeep = [];
            
            // Zachování pouze glóbusu
            if (threeGlobe) {
                objectsToKeep.push(threeGlobe);
            }
            
            // Odstranění všech objektů
            while (threeScene.children.length > 0) {
                threeScene.remove(threeScene.children[0]);
            }
            
            // Přidání zpět glóbusu
            objectsToKeep.forEach(obj => {
                threeScene.add(obj);
            });
            
            // Přidání osvětlení
            addSimpleLighting();
        }
        
        return true;
    } catch (error) {
        console.error('Chyba při čištění glóbusu:', error);
        return false;
    }
}

// Export funkcí do globálního prostoru
window.initThreeJsGlobe = initThreeJsGlobe;
window.startThreeAnimation = startThreeAnimation;
window.stopThreeAnimation = stopThreeAnimation;
window.clearThreeGlobe = clearThreeGlobe;
