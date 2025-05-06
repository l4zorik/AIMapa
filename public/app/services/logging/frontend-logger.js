/**
 * Frontend Logger Service
 * Poskytuje rozšířené logování pro frontend komponenty
 * Integruje se se serverovým logováním
 *
 * @version 1.0.0
 */

class FrontendLogger {
  constructor() {
    this.logLevel = 'info'; // default: info, možnosti: debug, info, warn, error
    this.enabled = true;
    this.serverEndpoint = '/api/logs/frontend';
    this.bufferSize = 10; // Počet logů před odesláním na server
    this.logBuffer = [];
    this.componentLoadStatus = new Map();
    this.resourceLoadTimes = new Map();
    this.performanceMetrics = {
      firstContentfulPaint: null,
      domInteractive: null,
      domComplete: null,
      resourceLoadTimes: []
    };

    // Inicializace
    this.init();
  }

  /**
   * Inicializace loggeru
   */
  init() {
    console.log('FrontendLogger: Inicializace...');

    // Nastavení úrovně logování z localStorage nebo config
    this.logLevel = localStorage.getItem('logLevel') || this.logLevel;

    // Detekce produkčního prostředí
    const isProduction = window.location.hostname !== 'localhost' &&
                         window.location.hostname !== '127.0.0.1';

    // V produkčním prostředí nastavíme výchozí úroveň na 'warn', pokud není explicitně nastavena
    if (isProduction && !localStorage.getItem('logLevel')) {
      this.logLevel = 'warn';
    }

    // Nastavení serverového endpointu podle prostředí
    if (isProduction) {
      this.serverEndpoint = 'https://www.quicksoft.fun/api/logs/frontend';
    }

    // Přidání posluchačů událostí
    this.setupEventListeners();

    // Zachycení chyb
    this.setupErrorHandling();

    // Měření výkonu
    this.setupPerformanceMonitoring();

    console.log(`FrontendLogger: Inicializován s úrovní logování: ${this.logLevel} (${isProduction ? 'produkce' : 'vývoj'})`);
  }

  /**
   * Nastavení posluchačů událostí
   */
  setupEventListeners() {
    // Sledování načítání zdrojů
    if (window.performance && window.performance.getEntriesByType) {
      window.addEventListener('load', () => {
        this.collectResourceTimings();
      });
    }

    // Sledování načítání komponent
    document.addEventListener('DOMContentLoaded', () => {
      this.log('info', 'DOM plně načten a zpracován');
      this.checkComponentsLoaded();
    });

    // Periodické odesílání logů na server
    setInterval(() => {
      this.flushLogs();
    }, 10000); // každých 10 sekund
  }

  /**
   * Nastavení zachytávání chyb
   */
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.log('error', `Chyba: ${event.message} v ${event.filename}:${event.lineno}`, {
        stack: event.error ? event.error.stack : null,
        type: 'uncaught'
      });

      // Neblokujeme výchozí zpracování chyby
      return false;
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.log('error', `Neošetřená Promise rejection: ${event.reason}`, {
        reason: event.reason,
        type: 'unhandledrejection'
      });
    });
  }

  /**
   * Nastavení monitorování výkonu
   */
  setupPerformanceMonitoring() {
    if (window.performance) {
      // Použití Performance API pro měření načítání
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const domReadyTime = perfData.domComplete - perfData.domLoading;

          this.performanceMetrics.domInteractive = perfData.domInteractive - perfData.navigationStart;
          this.performanceMetrics.domComplete = perfData.domComplete - perfData.navigationStart;

          this.log('info', `Stránka načtena za ${pageLoadTime}ms, DOM připraven za ${domReadyTime}ms`);

          // Odeslání metrik na server
          this.sendPerformanceMetrics();
        }, 0);
      });

      // Sledování First Contentful Paint pomocí PerformanceObserver, pokud je k dispozici
      if (window.PerformanceObserver) {
        try {
          const paintObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (entry.name === 'first-contentful-paint') {
                this.performanceMetrics.firstContentfulPaint = entry.startTime;
                this.log('info', `First Contentful Paint: ${entry.startTime}ms`);
                paintObserver.disconnect();
              }
            }
          });

          paintObserver.observe({ type: 'paint', buffered: true });
        } catch (e) {
          this.log('warn', 'PerformanceObserver není podporován nebo selhal', e);
        }
      }
    }
  }

  /**
   * Sběr informací o načítání zdrojů
   */
  collectResourceTimings() {
    if (window.performance && window.performance.getEntriesByType) {
      const resources = window.performance.getEntriesByType('resource');

      resources.forEach(resource => {
        const url = resource.name.split('/').pop();
        const loadTime = Math.round(resource.responseEnd - resource.startTime);

        this.resourceLoadTimes.set(url, loadTime);

        this.performanceMetrics.resourceLoadTimes.push({
          name: url,
          type: resource.initiatorType,
          duration: loadTime,
          size: resource.transferSize || 0
        });

        // Logujeme pouze důležité zdroje (JS, CSS)
        if (resource.initiatorType === 'script' || resource.initiatorType === 'link') {
          this.log('debug', `Zdroj načten: ${url} (${loadTime}ms)`);
        }
      });

      // Logujeme pomalé zdroje
      const slowResources = resources
        .filter(r => (r.responseEnd - r.startTime) > 500)
        .map(r => ({
          url: r.name.split('/').pop(),
          time: Math.round(r.responseEnd - r.startTime),
          type: r.initiatorType
        }));

      if (slowResources.length > 0) {
        this.log('warn', 'Pomalé načítání zdrojů:', slowResources);
      }
    }
  }

  /**
   * Kontrola načtení všech komponent
   */
  checkComponentsLoaded() {
    // Kontrola načtení CSS souborů
    const cssFiles = Array.from(document.styleSheets).map(sheet => {
      try {
        return sheet.href ? sheet.href.split('/').pop() : 'inline';
      } catch (e) {
        return 'cross-origin';
      }
    });

    this.log('debug', 'Načtené CSS soubory:', cssFiles);

    // Kontrola načtení JS souborů
    const scripts = Array.from(document.scripts).map(script => {
      return script.src ? script.src.split('/').pop() : 'inline';
    });

    this.log('debug', 'Načtené JS soubory:', scripts);

    // Kontrola viditelných komponent
    setTimeout(() => {
      this.checkVisibleComponents();
    }, 500);
  }

  /**
   * Kontrola viditelných komponent
   */
  checkVisibleComponents() {
    // Seznam klíčových komponent k ověření
    const keyComponents = [
      { selector: '.blog-carousel', name: 'Blog Carousel' },
      { selector: '.product-container', name: 'Product Description' },
      { selector: '.card', name: 'Card Components' },
      { selector: 'form', name: 'Form Components' }
    ];

    keyComponents.forEach(component => {
      const elements = document.querySelectorAll(component.selector);
      const isLoaded = elements.length > 0;

      this.componentLoadStatus.set(component.name, isLoaded);

      if (isLoaded) {
        this.log('info', `Komponenta ${component.name} úspěšně načtena (${elements.length}x)`);
      } else {
        this.log('warn', `Komponenta ${component.name} nebyla nalezena v DOM`);
      }
    });

    // Kontrola viditelnosti komponent (zda jsou v viewportu)
    this.checkComponentVisibility();
  }

  /**
   * Kontrola viditelnosti komponent
   */
  checkComponentVisibility() {
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    // Kontrola viditelnosti carousel
    const carousels = document.querySelectorAll('.blog-carousel');
    carousels.forEach((carousel, index) => {
      const visible = isInViewport(carousel);
      this.log('debug', `Blog Carousel #${index + 1} je ${visible ? 'viditelný' : 'mimo viewport'}`);
    });

    // Kontrola viditelnosti produktu
    const products = document.querySelectorAll('.product-container');
    products.forEach((product, index) => {
      const visible = isInViewport(product);
      this.log('debug', `Product Description #${index + 1} je ${visible ? 'viditelný' : 'mimo viewport'}`);
    });
  }

  /**
   * Logování zprávy
   * @param {string} level - Úroveň logu (debug, info, warn, error)
   * @param {string} message - Zpráva k zalogování
   * @param {object} data - Dodatečná data
   */
  log(level, message, data = null) {
    // Kontrola, zda je logování povoleno pro danou úroveň
    if (!this.isLevelEnabled(level)) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Konzolový výstup
    this.consoleOutput(level, message, data);

    // Přidání do bufferu pro odeslání na server
    this.logBuffer.push(logEntry);

    // Pokud je buffer plný, odešleme logy na server
    if (this.logBuffer.length >= this.bufferSize) {
      this.flushLogs();
    }
  }

  /**
   * Kontrola, zda je daná úroveň logování povolena
   * @param {string} level - Úroveň logu
   * @returns {boolean} - Je povoleno?
   */
  isLevelEnabled(level) {
    if (!this.enabled) return false;

    const levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Výstup do konzole
   * @param {string} level - Úroveň logu
   * @param {string} message - Zpráva
   * @param {object} data - Data
   */
  consoleOutput(level, message, data) {
    const prefix = '[FrontendLogger]';

    switch (level) {
      case 'debug':
        console.debug(prefix, message, data || '');
        break;
      case 'info':
        console.info(prefix, message, data || '');
        break;
      case 'warn':
        console.warn(prefix, message, data || '');
        break;
      case 'error':
        console.error(prefix, message, data || '');
        break;
    }
  }

  /**
   * Odeslání logů na server
   */
  flushLogs() {
    if (this.logBuffer.length === 0) return;

    // Detekce produkčního prostředí
    const isProduction = window.location.hostname !== 'localhost' &&
                         window.location.hostname !== '127.0.0.1';

    // V produkčním prostředí odesíláme pouze warn a error logy
    let logsToSend;
    if (isProduction) {
      logsToSend = this.logBuffer.filter(log =>
        log.level === 'warn' || log.level === 'error'
      );

      // Pokud nemáme žádné logy k odeslání, vyčistíme buffer a skončíme
      if (logsToSend.length === 0) {
        this.logBuffer = [];
        return;
      }
    } else {
      logsToSend = [...this.logBuffer];
    }

    // Vyčistíme buffer
    this.logBuffer = [];

    // Přidáme informaci o prostředí
    const environment = isProduction ? 'production' : 'development';

    fetch(this.serverEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Environment': environment
      },
      body: JSON.stringify({
        logs: logsToSend,
        environment: environment,
        appVersion: '0.4.1'
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (this.isLevelEnabled('debug')) {
        console.debug(`[FrontendLogger] Odesláno ${logsToSend.length} logů na server`, data);
      }
    })
    .catch(error => {
      console.error('[FrontendLogger] Chyba při odesílání logů na server', error);

      // V produkčním prostředí vrátíme do bufferu pouze warn a error logy
      if (isProduction) {
        const criticalLogs = logsToSend.filter(log =>
          log.level === 'error'
        );
        this.logBuffer = [...criticalLogs, ...this.logBuffer];
      } else {
        // Ve vývojovém prostředí vrátíme všechny logy
        this.logBuffer = [...logsToSend, ...this.logBuffer];
      }
    });
  }

  /**
   * Odeslání metrik výkonu na server
   */
  sendPerformanceMetrics() {
    fetch('/api/logs/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.performanceMetrics)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.debug('[FrontendLogger] Metriky výkonu úspěšně odeslány', data);
    })
    .catch(error => {
      console.error('[FrontendLogger] Chyba při odesílání metrik výkonu', error);
    });
  }

  /**
   * Nastavení úrovně logování
   * @param {string} level - Úroveň logu (debug, info, warn, error)
   */
  setLogLevel(level) {
    if (['debug', 'info', 'warn', 'error'].includes(level)) {
      this.logLevel = level;
      localStorage.setItem('logLevel', level);
      console.log(`[FrontendLogger] Úroveň logování nastavena na: ${level}`);
    } else {
      console.error(`[FrontendLogger] Neplatná úroveň logování: ${level}`);
    }
  }

  /**
   * Povolení/zakázání logování
   * @param {boolean} enabled - Je logování povoleno?
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`[FrontendLogger] Logování ${enabled ? 'povoleno' : 'zakázáno'}`);
  }
}

// Vytvoření globální instance
window.frontendLogger = new FrontendLogger();

// Export pro moduly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.frontendLogger;
}
