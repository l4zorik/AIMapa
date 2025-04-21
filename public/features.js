/**
 * Rozšířené funkce a nástroje pro AIMapa verze 0.2.9.2
 * Implementace pokročilých funkcí a nástrojů
 */

// Objekt pro správu rozšířených funkcí
const Features = {
    // Konfigurace
    config: {
        enableStarEffect: true,
        enableWeatherEffects: false,
        enableAnimations: true,
        enableSoundEffects: false
    },

    // Inicializace rozšířených funkcí
    init() {
        console.log('Inicializace rozšířených funkcí...');

        // Načtení konfigurace
        this.loadConfig();

        // Inicializace efektů
        if (this.config.enableStarEffect && document.body.classList.contains('globe-mode')) {
            this.initStarEffect();
        }

        console.log('Rozšířené funkce byly inicializovány');
    },

    // Načtení konfigurace
    loadConfig() {
        const savedConfig = localStorage.getItem('aiMapaFeaturesConfig');

        if (savedConfig) {
            try {
                const parsedConfig = JSON.parse(savedConfig);
                this.config = { ...this.config, ...parsedConfig };
                console.log('Konfigurace rozšířených funkcí načtena');
            } catch (error) {
                console.error('Chyba při načítání konfigurace:', error);
            }
        }
    },

    // Uložení konfigurace
    saveConfig() {
        localStorage.setItem('aiMapaFeaturesConfig', JSON.stringify(this.config));
    },

    // Inicializace efektu padajících hvězd
    initStarEffect() {
        // Kontrola, zda již efekt neexistuje
        if (document.getElementById('starCanvas')) {
            return;
        }

        // Vytvoření plátna pro hvězdy
        const canvas = document.createElement('canvas');
        canvas.id = 'starCanvas';
        canvas.className = 'star-canvas';

        // Nastavení velikosti plátna
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Přidání plátna do dokumentu
        document.body.appendChild(canvas);

        // Získání kontextu plátna
        const ctx = canvas.getContext('2d');

        // Vytvoření hvězd
        const stars = [];
        const starCount = 50;

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 3 + 1,
                brightness: Math.random() * 0.5 + 0.5
            });
        }

        // Funkce pro aktualizaci a vykreslení hvězd
        function updateStars() {
            // Vyčištění plátna
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Vykreslení hvězd
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                // Aktualizace pozice
                star.y += star.speed;

                // Pokud hvězda opustí plátno, vrátíme ji na začátek
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }

                // Vykreslení hvězdy
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
                ctx.fill();
            }

            // Opakované volání funkce
            requestAnimationFrame(updateStars);
        }

        // Spuštění animace
        updateStars();

        // Přizpůsobení velikosti plátna při změně velikosti okna
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    },

    // Přepnutí efektu padajících hvězd
    toggleStarEffect() {
        this.config.enableStarEffect = !this.config.enableStarEffect;

        if (this.config.enableStarEffect) {
            this.initStarEffect();
        } else {
            const canvas = document.getElementById('starCanvas');
            if (canvas) {
                canvas.remove();
            }
        }

        // Uložení konfigurace
        this.saveConfig();

        return this.config.enableStarEffect;
    },

    // Přepnutí efektu počasí
    toggleWeatherEffects() {
        this.config.enableWeatherEffects = !this.config.enableWeatherEffects;

        // Implementace efektu počasí bude přidána v budoucí verzi

        // Uložení konfigurace
        this.saveConfig();

        return this.config.enableWeatherEffects;
    },

    // Přepnutí animací
    toggleAnimations() {
        this.config.enableAnimations = !this.config.enableAnimations;

        // Aplikace nastavení na dokument
        if (this.config.enableAnimations) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }

        // Uložení konfigurace
        this.saveConfig();

        return this.config.enableAnimations;
    },

    // Přepnutí zvukových efektů
    toggleSoundEffects() {
        this.config.enableSoundEffects = !this.config.enableSoundEffects;

        // Implementace zvukových efektů bude přidána v budoucí verzi

        // Uložení konfigurace
        this.saveConfig();

        return this.config.enableSoundEffects;
    }
};

// Export objektu pro použití v jiných souborech
window.Features = Features;

// Inicializace rozšířených funkcí po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    Features.init();
});

// Posluchač pro přepnutí do glóbus režimu
document.addEventListener('globeModeToggled', (e) => {
    if (e.detail.isGlobeMode && Features.config.enableStarEffect) {
        Features.initStarEffect();
    }
});