/**
 * Modul pro efekty tmavé oblohy a souhvězdí
 * Verze 0.2.8.7.8
 */

const DarkSkyEffects = {
    // Stav modulu
    isInitialized: false,
    darkSkyActive: false,
    constellationsActive: false,

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;

        console.log('Inicializace modulu efektů tmavé oblohy...');

        // Přidání stylů pro animace
        this.addStyles();

        // Kontrola aktuálního režimu
        const darkModeEnabled = document.body.getAttribute('data-theme') === 'dark';
        if (darkModeEnabled) {
            this.addDarkSkyEffect();
        }

        this.isInitialized = true;
        console.log('Modul efektů tmavé oblohy byl inicializován');
    },

    // Přidání stylů pro animace
    addStyles() {
        const style = document.createElement('style');
        style.id = 'dark-sky-style';
        style.textContent = `
            @keyframes twinkle {
                0% { opacity: 0.2; }
                100% { opacity: 1; }
            }

            @keyframes shooting-star {
                0% { transform: translate(0, 0) rotate(45deg) scale(0); opacity: 0; }
                10% { transform: translate(-10px, 10px) rotate(45deg) scale(1); opacity: 1; }
                20% { transform: translate(-20px, 20px) rotate(45deg) scale(1); opacity: 0; }
                100% { transform: translate(-100px, 100px) rotate(45deg) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    },

    // Přidání efektu tmavé oblohy
    addDarkSkyEffect() {
        // Kontrola, zda je efekt již aktivní
        if (this.darkSkyActive) return;

        // Odstranění existujícího efektu, pokud existuje
        this.removeDarkSkyEffect();

        // Vytvoření elementu pro tmavou oblohu
        const darkSky = document.createElement('div');
        darkSky.id = 'dark-sky-effect';
        darkSky.style.position = 'absolute';
        darkSky.style.top = '0';
        darkSky.style.left = '0';
        darkSky.style.width = '100%';
        darkSky.style.height = '100%';
        darkSky.style.pointerEvents = 'none';
        darkSky.style.background = 'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)';
        darkSky.style.zIndex = '1';

        // Přidání hvězd
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            const size = Math.random() * 2 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const opacity = Math.random() * 0.8 + 0.2;
            const animationDuration = Math.random() * 3 + 2;

            star.className = 'star';
            star.style.position = 'absolute';
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.borderRadius = '50%';
            star.style.backgroundColor = 'white';
            star.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.8)';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.opacity = opacity;
            star.style.animation = `twinkle ${animationDuration}s infinite alternate`;

            darkSky.appendChild(star);
        }

        // Přidání souhvězdí
        this.addConstellations(darkSky);

        // Přidání do mapy
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.appendChild(darkSky);

            // Přidání padajících hvězd
            this.startShootingStars(darkSky);

            this.darkSkyActive = true;
        }
    },

    // Přidání souhvězdí
    addConstellations(container) {
        // Definice souhvězdí (zjednodušené verze)
        const constellations = [
            // Velký vůz
            {
                name: 'Velký vůz',
                stars: [
                    { x: 20, y: 30 },
                    { x: 25, y: 28 },
                    { x: 30, y: 25 },
                    { x: 35, y: 22 },
                    { x: 38, y: 28 },
                    { x: 33, y: 32 },
                    { x: 28, y: 35 }
                ],
                lines: [
                    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]
                ]
            },
            // Orion
            {
                name: 'Orion',
                stars: [
                    { x: 70, y: 40 },
                    { x: 75, y: 35 },
                    { x: 73, y: 45 },
                    { x: 77, y: 50 },
                    { x: 72, y: 55 },
                    { x: 68, y: 53 },
                    { x: 65, y: 48 }
                ],
                lines: [
                    [0, 1], [0, 2], [2, 3], [2, 4], [4, 5], [5, 6], [6, 2]
                ]
            },
            // Kasiopeja
            {
                name: 'Kasiopeja',
                stars: [
                    { x: 50, y: 15 },
                    { x: 55, y: 10 },
                    { x: 60, y: 15 },
                    { x: 65, y: 10 },
                    { x: 70, y: 15 }
                ],
                lines: [
                    [0, 1], [1, 2], [2, 3], [3, 4]
                ]
            }
        ];

        // Vytvoření souhvězdí
        constellations.forEach(constellation => {
            const constellationGroup = document.createElement('div');
            constellationGroup.className = 'constellation';
            constellationGroup.style.position = 'absolute';
            constellationGroup.style.width = '100%';
            constellationGroup.style.height = '100%';
            constellationGroup.style.pointerEvents = 'none';

            // Přidání hvězd
            const stars = [];
            constellation.stars.forEach((star, index) => {
                const starElement = document.createElement('div');
                const size = Math.random() * 2 + 2;

                starElement.className = 'constellation-star';
                starElement.style.position = 'absolute';
                starElement.style.width = `${size}px`;
                starElement.style.height = `${size}px`;
                starElement.style.borderRadius = '50%';
                starElement.style.backgroundColor = 'white';
                starElement.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
                starElement.style.left = `${star.x}%`;
                starElement.style.top = `${star.y}%`;
                starElement.style.opacity = 0.8;

                constellationGroup.appendChild(starElement);
                stars.push(starElement);
            });

            // Přidání čar
            constellation.lines.forEach(line => {
                const star1 = constellation.stars[line[0]];
                const star2 = constellation.stars[line[1]];

                const lineElement = document.createElement('div');
                lineElement.className = 'constellation-line';

                // Výpočet délky a úhlu čáry
                const dx = star2.x - star1.x;
                const dy = star2.y - star1.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                lineElement.style.position = 'absolute';
                lineElement.style.width = `${length}%`;
                lineElement.style.height = '1px';
                lineElement.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                lineElement.style.left = `${star1.x}%`;
                lineElement.style.top = `${star1.y}%`;
                lineElement.style.transformOrigin = '0 0';
                lineElement.style.transform = `rotate(${angle}deg)`;

                constellationGroup.appendChild(lineElement);
            });

            container.appendChild(constellationGroup);
        });
    },

    // Přidání padajících hvězd
    startShootingStars(container) {
        this.shootingStarsInterval = setInterval(() => {
            if (!document.getElementById('dark-sky-effect')) {
                clearInterval(this.shootingStarsInterval);
                return;
            }

            const shootingStar = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 20;

            shootingStar.className = 'shooting-star';
            shootingStar.style.position = 'absolute';
            shootingStar.style.width = '50px';
            shootingStar.style.height = '1px';
            shootingStar.style.backgroundColor = 'white';
            shootingStar.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
            shootingStar.style.left = `${x}%`;
            shootingStar.style.top = `${y}%`;
            shootingStar.style.animation = 'shooting-star 2s linear forwards';

            container.appendChild(shootingStar);

            // Odstranění padající hvězdy po animaci
            setTimeout(() => {
                if (shootingStar.parentNode) {
                    shootingStar.parentNode.removeChild(shootingStar);
                }
            }, 2000);
        }, 5000);
    },

    // Odstranění efektu tmavé oblohy
    removeDarkSkyEffect() {
        const darkSky = document.getElementById('dark-sky-effect');
        if (darkSky) {
            darkSky.parentNode.removeChild(darkSky);
        }

        if (this.shootingStarsInterval) {
            clearInterval(this.shootingStarsInterval);
        }

        this.darkSkyActive = false;
    },

    // Přepnutí souhvězdí v režimu glóbusu
    toggleGlobeConstellations() {
        this.constellationsActive = !this.constellationsActive;

        // Kontrola, zda je glóbus režim aktivní
        const globeContainer = document.getElementById('simpleGlobeContainer');
        if (!globeContainer || globeContainer.style.display === 'none') {
            if (typeof addMessage !== 'undefined') {
                addMessage('Nejprve aktivujte režim glóbusu pomocí příkazu "glóbus".', false);
            }
            return false;
        }

        if (this.constellationsActive) {
            // Přidání souhvězdí do glóbusu
            this.addGlobeConstellations();

            if (typeof addMessage !== 'undefined') {
                addMessage('Souhvězdí byla přidána na oblohu glóbusu.', false);
            }

            // Přidání XP za použití souhvězdí
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(10, 'Aktivace souhvězdí na glóbusu');
            }
        } else {
            // Odstranění souhvězdí z glóbusu
            this.removeGlobeConstellations();

            if (typeof addMessage !== 'undefined') {
                addMessage('Souhvězdí byla odstraněna z oblohy glóbusu.', false);
            }
        }

        return true;
    },

    // Přidání souhvězdí do glóbusu
    addGlobeConstellations() {
        // Odstranění existujících souhvězdí
        this.removeGlobeConstellations();

        // Vytvoření kontejneru pro souhvězdí
        const constellationsContainer = document.createElement('div');
        constellationsContainer.id = 'globe-constellations';
        constellationsContainer.style.position = 'absolute';
        constellationsContainer.style.top = '0';
        constellationsContainer.style.left = '0';
        constellationsContainer.style.width = '100%';
        constellationsContainer.style.height = '100%';
        constellationsContainer.style.pointerEvents = 'none';
        constellationsContainer.style.zIndex = '10';
        constellationsContainer.style.background = 'radial-gradient(ellipse at center, rgba(0,10,40,0.4) 0%, rgba(0,10,30,0.95) 100%)';

        // Přidání mlhoviny a galaxie
        const nebula = document.createElement('div');
        nebula.className = 'nebula';
        nebula.style.position = 'absolute';
        nebula.style.width = '40%';
        nebula.style.height = '30%';
        nebula.style.top = '20%';
        nebula.style.left = '30%';
        nebula.style.background = 'radial-gradient(ellipse at center, rgba(100,50,200,0.1) 0%, rgba(50,20,100,0) 70%)';
        nebula.style.borderRadius = '50%';
        nebula.style.filter = 'blur(15px)';
        nebula.style.opacity = '0.6';
        constellationsContainer.appendChild(nebula);

        // Přidání galaxie
        const galaxy = document.createElement('div');
        galaxy.className = 'galaxy';
        galaxy.style.position = 'absolute';
        galaxy.style.width = '25%';
        galaxy.style.height = '15%';
        galaxy.style.top = '10%';
        galaxy.style.left = '65%';
        galaxy.style.background = 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)';
        galaxy.style.borderRadius = '50% 10% 50% 10%';
        galaxy.style.transform = 'rotate(45deg)';
        galaxy.style.filter = 'blur(5px)';
        galaxy.style.opacity = '0.7';
        constellationsContainer.appendChild(galaxy);

        // Přidání hvězd
        for (let i = 0; i < 300; i++) {
            const star = document.createElement('div');
            const size = Math.random();
            let starSize;
            let brightness;

            // Různé velikosti hvězd s různou pravděpodobností
            const sizeRand = Math.random();
            if (sizeRand > 0.98) { // Velmi jasné hvězdy (2%)
                starSize = size * 3 + 2;
                brightness = 1.0;
            } else if (sizeRand > 0.9) { // Jasné hvězdy (8%)
                starSize = size * 2 + 1.5;
                brightness = 0.9;
            } else if (sizeRand > 0.7) { // Středně jasné hvězdy (20%)
                starSize = size * 1.5 + 1;
                brightness = 0.7;
            } else { // Slabé hvězdy (70%)
                starSize = size * 1 + 0.5;
                brightness = 0.5;
            }

            // Hvězdy jsou více soustředěné v oblasti oblohy (ne po celé obrazovce)
            // Použijeme gaussovské rozložení pro přirozenější vzhled
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.random() * 50; // Více hvězd blíže ke středu
            const x = 50 + Math.cos(angle) * distance;
            const y = 40 + Math.sin(angle) * distance * 0.6; // Eliptický tvar

            // Barva hvězdy - různé odstíny
            const colorRand = Math.random();
            let color;
            if (colorRand > 0.9) { // Červené hvězdy (10%)
                color = `rgba(255, ${Math.floor(150 + Math.random() * 50)}, ${Math.floor(150 + Math.random() * 50)}, ${brightness})`;
            } else if (colorRand > 0.8) { // Modravé hvězdy (10%)
                color = `rgba(${Math.floor(200 + Math.random() * 55)}, ${Math.floor(200 + Math.random() * 55)}, 255, ${brightness})`;
            } else if (colorRand > 0.7) { // Nažloutlé hvězdy (10%)
                color = `rgba(255, 255, ${Math.floor(200 + Math.random() * 55)}, ${brightness})`;
            } else { // Bílé hvězdy (70%)
                color = `rgba(255, 255, 255, ${brightness})`;
            }

            const animationDuration = Math.random() * 3 + 2;

            star.className = 'globe-star';
            star.style.position = 'absolute';
            star.style.width = `${starSize}px`;
            star.style.height = `${starSize}px`;
            star.style.borderRadius = '50%';
            star.style.backgroundColor = color;
            star.style.boxShadow = `0 0 ${starSize * 2}px ${color}`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.animation = `twinkle ${animationDuration}s infinite alternate`;

            constellationsContainer.appendChild(star);
        }

        // Přidání souhvězdí
        this.addRealisticConstellations(constellationsContainer);

        // Přidání do glóbusu
        const globeContainer = document.getElementById('simpleGlobeContainer');
        if (globeContainer) {
            globeContainer.appendChild(constellationsContainer);

            // Přidání padajících hvězd
            this.startGlobeShootingStars(constellationsContainer);

            // Přidání názvů souhvězdí s postupným zobrazováním
            setTimeout(() => {
                this.addConstellationLabels(constellationsContainer);
            }, 1500);
        }
    },

    // Přidání názvů souhvězdí
    addConstellationLabels(container) {
        const constellationNames = [
            { name: 'Velký vůz', x: 20, y: 35 },
            { name: 'Orion', x: 70, y: 55 },
            { name: 'Kasiopeja', x: 50, y: 15 },
            { name: 'Lev', x: 85, y: 30 },
            { name: 'Labuť', x: 35, y: 15 }
        ];

        constellationNames.forEach((constellation, index) => {
            setTimeout(() => {
                const label = document.createElement('div');
                label.className = 'constellation-label';
                label.textContent = constellation.name;
                label.style.position = 'absolute';
                label.style.left = `${constellation.x}%`;
                label.style.top = `${constellation.y}%`;
                label.style.color = 'rgba(255, 255, 255, 0.7)';
                label.style.fontSize = '12px';
                label.style.fontFamily = 'Arial, sans-serif';
                label.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.8)';
                label.style.opacity = '0';
                label.style.transition = 'opacity 1s ease';

                container.appendChild(label);

                // Postupné zobrazení názvu
                setTimeout(() => {
                    label.style.opacity = '1';
                }, 100);
            }, index * 500); // Postupné zobrazení názvů
        });
    },

    // Přidání realistických souhvězdí
    addRealisticConstellations(container) {
        // Definice realistických souhvězdí
        const constellations = [
            // Velký vůz (Ursa Major)
            {
                name: 'Velký vůz',
                stars: [
                    { x: 20, y: 30, size: 2.5, name: 'Dubhe' },
                    { x: 25, y: 28, size: 2.3, name: 'Merak' },
                    { x: 30, y: 25, size: 2.4, name: 'Phecda' },
                    { x: 35, y: 22, size: 2.2, name: 'Megrez' },
                    { x: 38, y: 28, size: 2.3, name: 'Alioth' },
                    { x: 33, y: 32, size: 2.4, name: 'Mizar' },
                    { x: 28, y: 35, size: 2.5, name: 'Alkaid' }
                ],
                lines: [
                    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]
                ]
            },
            // Orion
            {
                name: 'Orion',
                stars: [
                    { x: 70, y: 40, size: 3.0, name: 'Betelgeuse' },
                    { x: 75, y: 35, size: 2.2, name: 'Bellatrix' },
                    { x: 73, y: 45, size: 2.0, name: 'Mintaka' },
                    { x: 77, y: 50, size: 2.8, name: 'Rigel' },
                    { x: 72, y: 55, size: 2.3, name: 'Saiph' },
                    { x: 68, y: 53, size: 2.1, name: 'Alnitak' },
                    { x: 65, y: 48, size: 2.2, name: 'Alnilam' }
                ],
                lines: [
                    [0, 1], [0, 2], [2, 3], [2, 4], [4, 5], [5, 6], [6, 2]
                ]
            },
            // Kasiopeja
            {
                name: 'Kasiopeja',
                stars: [
                    { x: 50, y: 15, size: 2.5, name: 'Schedar' },
                    { x: 55, y: 10, size: 2.3, name: 'Caph' },
                    { x: 60, y: 15, size: 2.8, name: 'Gamma Cas' },
                    { x: 65, y: 10, size: 2.2, name: 'Ruchbah' },
                    { x: 70, y: 15, size: 2.4, name: 'Segin' }
                ],
                lines: [
                    [0, 1], [1, 2], [2, 3], [3, 4]
                ]
            },
            // Lev (Leo)
            {
                name: 'Lev',
                stars: [
                    { x: 85, y: 30, size: 2.7, name: 'Regulus' },
                    { x: 90, y: 25, size: 2.2, name: 'Algieba' },
                    { x: 95, y: 30, size: 2.3, name: 'Zosma' },
                    { x: 92, y: 35, size: 2.5, name: 'Denebola' },
                    { x: 88, y: 32, size: 2.1, name: 'Chertan' },
                    { x: 83, y: 27, size: 2.0, name: 'Adhafera' }
                ],
                lines: [
                    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 5], [5, 0]
                ]
            },
            // Labuť (Cygnus)
            {
                name: 'Labuť',
                stars: [
                    { x: 35, y: 15, size: 2.9, name: 'Deneb' },
                    { x: 32, y: 18, size: 2.2, name: 'Sadr' },
                    { x: 29, y: 21, size: 2.3, name: 'Gienah' },
                    { x: 35, y: 22, size: 2.1, name: 'Delta Cyg' },
                    { x: 38, y: 18, size: 2.2, name: 'Albireo' }
                ],
                lines: [
                    [0, 1], [1, 2], [1, 3], [1, 4]
                ]
            }
        ];

        // Vytvoření souhvězdí
        constellations.forEach(constellation => {
            const constellationGroup = document.createElement('div');
            constellationGroup.className = 'constellation';
            constellationGroup.style.position = 'absolute';
            constellationGroup.style.width = '100%';
            constellationGroup.style.height = '100%';
            constellationGroup.style.pointerEvents = 'none';

            // Nejprve přidáme čáry, aby byly pod hvězdami
            constellation.lines.forEach(line => {
                const star1 = constellation.stars[line[0]];
                const star2 = constellation.stars[line[1]];

                const lineElement = document.createElement('div');
                lineElement.className = 'constellation-line';

                // Výpočet délky a úhlu čáry
                const dx = star2.x - star1.x;
                const dy = star2.y - star1.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                lineElement.style.position = 'absolute';
                lineElement.style.width = `${length}%`;
                lineElement.style.height = '1px';
                lineElement.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                lineElement.style.left = `${star1.x}%`;
                lineElement.style.top = `${star1.y}%`;
                lineElement.style.transformOrigin = '0 0';
                lineElement.style.transform = `rotate(${angle}deg)`;
                lineElement.style.boxShadow = '0 0 2px rgba(255, 255, 255, 0.3)';
                lineElement.style.opacity = '0';
                lineElement.style.transition = 'opacity 2s ease';

                constellationGroup.appendChild(lineElement);

                // Postupné zobrazení čáry
                setTimeout(() => {
                    lineElement.style.opacity = '1';
                }, 1000 + Math.random() * 1000);
            });

            // Potom přidáme hvězdy
            constellation.stars.forEach((star, index) => {
                const starElement = document.createElement('div');

                starElement.className = 'constellation-star';
                starElement.style.position = 'absolute';
                starElement.style.width = `${star.size}px`;
                starElement.style.height = `${star.size}px`;
                starElement.style.borderRadius = '50%';
                starElement.style.backgroundColor = 'white';
                starElement.style.boxShadow = `0 0 ${star.size * 1.5}px rgba(255, 255, 255, 0.8)`;
                starElement.style.left = `${star.x}%`;
                starElement.style.top = `${star.y}%`;
                starElement.style.opacity = '0';
                starElement.style.transition = 'opacity 1s ease';
                starElement.style.zIndex = '2';

                // Přidání atributu s názvem hvězdy pro tooltip
                starElement.setAttribute('data-star-name', star.name);

                constellationGroup.appendChild(starElement);

                // Postupné zobrazení hvězdy
                setTimeout(() => {
                    starElement.style.opacity = '1';
                }, 500 + index * 200);

                // Přidání tooltip při najetí myší
                starElement.addEventListener('mouseenter', () => {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'star-tooltip';
                    tooltip.textContent = star.name;
                    tooltip.style.position = 'absolute';
                    tooltip.style.left = `${star.x + 1}%`;
                    tooltip.style.top = `${star.y - 2}%`;
                    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '3px 6px';
                    tooltip.style.borderRadius = '3px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.zIndex = '100';
                    tooltip.style.pointerEvents = 'none';

                    constellationGroup.appendChild(tooltip);

                    starElement.tooltip = tooltip;
                });

                starElement.addEventListener('mouseleave', () => {
                    if (starElement.tooltip) {
                        starElement.tooltip.remove();
                        starElement.tooltip = null;
                    }
                });
            });

            container.appendChild(constellationGroup);
        });
    },

    // Přidání padajících hvězd do glóbusu
    startGlobeShootingStars(container) {
        this.globeShootingStarsInterval = setInterval(() => {
            if (!document.getElementById('globe-constellations')) {
                clearInterval(this.globeShootingStarsInterval);
                return;
            }

            const shootingStar = document.createElement('div');
            const x = Math.random() * 100;
            const y = Math.random() * 20;

            shootingStar.className = 'globe-shooting-star';
            shootingStar.style.position = 'absolute';
            shootingStar.style.width = '50px';
            shootingStar.style.height = '1px';
            shootingStar.style.backgroundColor = 'white';
            shootingStar.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
            shootingStar.style.left = `${x}%`;
            shootingStar.style.top = `${y}%`;
            shootingStar.style.animation = 'shooting-star 2s linear forwards';

            container.appendChild(shootingStar);

            // Odstranění padající hvězdy po animaci
            setTimeout(() => {
                if (shootingStar.parentNode) {
                    shootingStar.parentNode.removeChild(shootingStar);
                }
            }, 2000);
        }, 3000);
    },

    // Odstranění souhvězdí z glóbusu
    removeGlobeConstellations() {
        const constellations = document.getElementById('globe-constellations');
        if (constellations) {
            constellations.parentNode.removeChild(constellations);
        }

        if (this.globeShootingStarsInterval) {
            clearInterval(this.globeShootingStarsInterval);
        }
    },

    // Přepnutí tmavého režimu
    toggleDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const darkModeEnabled = darkModeToggle.checked;

        if (darkModeEnabled) {
            // Zapnutí tmavého režimu
            document.documentElement.style.setProperty('--dark-bg', '#1a1b26');
            document.documentElement.style.setProperty('--card-bg', '#1F2937');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.body.setAttribute('data-theme', 'dark');

            // Přidání efektu tmavé oblohy
            this.addDarkSkyEffect();
        } else {
            // Vypnutí tmavého režimu
            document.documentElement.style.setProperty('--dark-bg', '#f3f4f6');
            document.documentElement.style.setProperty('--card-bg', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#1F2937');
            document.body.removeAttribute('data-theme');

            // Odstranění efektu tmavé oblohy
            this.removeDarkSkyEffect();
        }

        // Aktualizace mapy po změně režimu
        setTimeout(() => {
            if (typeof map !== 'undefined' && map) {
                map.invalidateSize();
            }
        }, 100);
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    DarkSkyEffects.init();

    // Přidání event listeneru pro přepínač tmavého režimu
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            DarkSkyEffects.toggleDarkMode();

            // Informace pro uživatele
            const message = darkModeToggle.checked ?
                'Tmavý režim byl zapnut. Podívejte se na hvězdy a souhvězdí na obloze!' :
                'Tmavý režim byl vypnut.';

            if (typeof addMessage !== 'undefined') {
                addMessage(message, false);
            }

            // Uložení stavu aplikace
            if (typeof saveAppState !== 'undefined') {
                saveAppState();
            }
        });
    }
});
