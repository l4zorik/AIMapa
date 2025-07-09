/**
 * AIMapa Performance Optimizer
 * Verze 0.3.8.6 - Optimalizace výkonu aplikace
 * 
 * Tento modul optimalizuje výkon aplikace pomocí různých technik:
 * - Lazy loading modulů
 * - Debouncing událostí
 * - Memory management
 * - Resource preloading
 */

class PerformanceOptimizer {
    constructor() {
        this.isInitialized = false;
        this.loadedModules = new Set();
        this.debouncedFunctions = new Map();
        this.observedElements = new WeakMap();
        this.performanceMetrics = {
            loadTime: 0,
            moduleLoadTimes: {},
            memoryUsage: 0,
            renderTime: 0
        };
    }

    /**
     * Inicializace optimalizátoru
     */
    async init() {
        if (this.isInitialized) return;

        console.log('🚀 Inicializace Performance Optimizer...');

        try {
            // Měření času načítání
            this.performanceMetrics.loadTime = performance.now();

            // Nastavení optimalizací
            this.setupLazyLoading();
            this.setupEventOptimization();
            this.setupMemoryManagement();
            this.setupResourcePreloading();
            this.setupIntersectionObserver();

            // Monitoring výkonu
            this.startPerformanceMonitoring();

            this.isInitialized = true;
            console.log('✅ Performance Optimizer inicializován');

        } catch (error) {
            console.error('❌ Chyba při inicializaci Performance Optimizer:', error);
        }
    }

    /**
     * Nastavení lazy loading pro moduly
     */
    setupLazyLoading() {
        // Lazy loading pro méně kritické moduly
        const lazyModules = [
            'CarSales',
            'WeatherLayer',
            'ExportData',
            'FeedbackSurvey',
            'BusinessDataLoader'
        ];

        lazyModules.forEach(moduleName => {
            this.createLazyLoader(moduleName);
        });
    }

    /**
     * Vytvoření lazy loader pro modul
     */
    createLazyLoader(moduleName) {
        Object.defineProperty(window, moduleName, {
            get: () => {
                if (!this.loadedModules.has(moduleName)) {
                    console.log(`📦 Lazy loading modulu: ${moduleName}`);
                    this.loadModule(moduleName);
                }
                return window[`_${moduleName}`];
            },
            configurable: true
        });
    }

    /**
     * Načtení modulu na vyžádání
     */
    async loadModule(moduleName) {
        const startTime = performance.now();
        
        try {
            // Simulace načítání modulu
            await this.loadScript(`app/${moduleName.toLowerCase()}.js`);
            
            this.loadedModules.add(moduleName);
            this.performanceMetrics.moduleLoadTimes[moduleName] = performance.now() - startTime;
            
            console.log(`✅ Modul ${moduleName} načten za ${this.performanceMetrics.moduleLoadTimes[moduleName].toFixed(2)}ms`);
            
        } catch (error) {
            console.error(`❌ Chyba při načítání modulu ${moduleName}:`, error);
        }
    }

    /**
     * Načtení skriptu
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Optimalizace událostí
     */
    setupEventOptimization() {
        // Debouncing pro resize události
        this.addDebouncedEventListener(window, 'resize', () => {
            if (window.map) {
                window.map.invalidateSize();
            }
        }, 250);

        // Throttling pro scroll události
        this.addThrottledEventListener(window, 'scroll', () => {
            this.updateVisibleElements();
        }, 100);

        // Optimalizace mouse move událostí
        this.addThrottledEventListener(document, 'mousemove', (event) => {
            this.handleMouseMove(event);
        }, 16); // 60 FPS
    }

    /**
     * Přidání debounced event listeneru
     */
    addDebouncedEventListener(element, event, callback, delay) {
        const debouncedCallback = this.debounce(callback, delay);
        element.addEventListener(event, debouncedCallback);
        
        const key = `${element.constructor.name}-${event}`;
        this.debouncedFunctions.set(key, debouncedCallback);
    }

    /**
     * Přidání throttled event listeneru
     */
    addThrottledEventListener(element, event, callback, delay) {
        const throttledCallback = this.throttle(callback, delay);
        element.addEventListener(event, throttledCallback);
    }

    /**
     * Debounce funkce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle funkce
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Správa paměti
     */
    setupMemoryManagement() {
        // Automatické čištění paměti každých 5 minut
        setInterval(() => {
            this.cleanupMemory();
        }, 5 * 60 * 1000);

        // Monitoring využití paměti
        if (performance.memory) {
            setInterval(() => {
                this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize;
                this.checkMemoryUsage();
            }, 30000);
        }
    }

    /**
     * Čištění paměti
     */
    cleanupMemory() {
        console.log('🧹 Spouštím čištění paměti...');

        // Vyčištění starých event listenerů
        this.cleanupEventListeners();

        // Vyčištění cache
        this.cleanupCache();

        // Garbage collection hint
        if (window.gc) {
            window.gc();
        }

        console.log('✅ Čištění paměti dokončeno');
    }

    /**
     * Vyčištění event listenerů
     */
    cleanupEventListeners() {
        // Odstranění nepoužívaných debounced funkcí
        for (const [key, func] of this.debouncedFunctions) {
            if (typeof func.cancel === 'function') {
                func.cancel();
            }
        }
    }

    /**
     * Vyčištění cache
     */
    cleanupCache() {
        // Vyčištění starých dat z localStorage
        const keys = Object.keys(localStorage);
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dní

        keys.forEach(key => {
            if (key.startsWith('aimapa-cache-')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && (now - data.timestamp) > maxAge) {
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    // Neplatná data - odstraníme
                    localStorage.removeItem(key);
                }
            }
        });
    }

    /**
     * Kontrola využití paměti
     */
    checkMemoryUsage() {
        if (!performance.memory) return;

        const memoryUsage = performance.memory.usedJSHeapSize;
        const memoryLimit = performance.memory.jsHeapSizeLimit;
        const usagePercent = (memoryUsage / memoryLimit) * 100;

        if (usagePercent > 80) {
            console.warn(`⚠️ Vysoké využití paměti: ${usagePercent.toFixed(1)}%`);
            this.cleanupMemory();
        }
    }

    /**
     * Preloading zdrojů
     */
    setupResourcePreloading() {
        // Preload kritických CSS souborů
        this.preloadResource('app/voicebot.css', 'style');
        this.preloadResource('app/virtual-work.css', 'style');

        // Preload fontů
        this.preloadResource('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', 'style');

        // Prefetch méně kritických zdrojů
        this.prefetchResource('app/car-sales.js');
        this.prefetchResource('app/weather-layer.js');
    }

    /**
     * Preload zdroje
     */
    preloadResource(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    }

    /**
     * Prefetch zdroje
     */
    prefetchResource(href) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    }

    /**
     * Nastavení Intersection Observer
     */
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                
                if (entry.isIntersecting) {
                    this.handleElementVisible(element);
                } else {
                    this.handleElementHidden(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
    }

    /**
     * Sledování viditelnosti elementu
     */
    observeElement(element, callback) {
        this.observedElements.set(element, callback);
        this.intersectionObserver.observe(element);
    }

    /**
     * Zpracování viditelného elementu
     */
    handleElementVisible(element) {
        const callback = this.observedElements.get(element);
        if (callback && typeof callback.onVisible === 'function') {
            callback.onVisible(element);
        }
    }

    /**
     * Zpracování skrytého elementu
     */
    handleElementHidden(element) {
        const callback = this.observedElements.get(element);
        if (callback && typeof callback.onHidden === 'function') {
            callback.onHidden(element);
        }
    }

    /**
     * Aktualizace viditelných elementů
     */
    updateVisibleElements() {
        // Optimalizace renderování pouze viditelných elementů
        const visibleElements = document.querySelectorAll('[data-optimize="true"]');
        
        visibleElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !element.dataset.rendered) {
                this.renderElement(element);
                element.dataset.rendered = 'true';
            }
        });
    }

    /**
     * Renderování elementu
     */
    renderElement(element) {
        // Implementace optimalizovaného renderování
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * Zpracování mouse move
     */
    handleMouseMove(event) {
        // Optimalizované zpracování mouse move událostí
        if (this.lastMouseEvent && 
            Math.abs(event.clientX - this.lastMouseEvent.clientX) < 5 &&
            Math.abs(event.clientY - this.lastMouseEvent.clientY) < 5) {
            return; // Ignoruj malé pohyby
        }
        
        this.lastMouseEvent = { clientX: event.clientX, clientY: event.clientY };
    }

    /**
     * Monitoring výkonu
     */
    startPerformanceMonitoring() {
        // Monitoring FPS
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.performanceMetrics.fps = fps;
                
                if (fps < 30) {
                    console.warn(`⚠️ Nízké FPS: ${fps}`);
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);

        // Monitoring dlouhých úloh
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn(`⚠️ Dlouhá úloha: ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    /**
     * Získání metrik výkonu
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            loadedModules: Array.from(this.loadedModules),
            memoryUsage: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };
    }

    /**
     * Optimalizace pro mobilní zařízení
     */
    optimizeForMobile() {
        if (this.isMobileDevice()) {
            // Redukce animací na mobilních zařízeních
            document.body.classList.add('mobile-optimized');
            
            // Snížení kvality renderování
            this.reduceMobileQuality();
            
            // Optimalizace touch událostí
            this.optimizeTouchEvents();
        }
    }

    /**
     * Detekce mobilního zařízení
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Snížení kvality na mobilních zařízeních
     */
    reduceMobileQuality() {
        // Snížení kvality map tiles
        if (window.map) {
            window.map.options.preferCanvas = true;
        }
        
        // Redukce animací
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }

    /**
     * Optimalizace touch událostí
     */
    optimizeTouchEvents() {
        // Passive event listeners pro lepší scroll výkon
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
    }
}

// Vytvoření globální instance
window.PerformanceOptimizer = new PerformanceOptimizer();

// Automatická inicializace
document.addEventListener('DOMContentLoaded', () => {
    window.PerformanceOptimizer.init();
    window.PerformanceOptimizer.optimizeForMobile();
});
