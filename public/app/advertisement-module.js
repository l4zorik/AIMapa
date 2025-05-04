/**
 * Modul pro správu reklam v aplikaci AI Mapa
 * Verze 0.3.8.7
 */

const AdvertisementModule = {
    // Konfigurace
    config: {
        adSlots: {
            mapSidebar: {
                id: 'map-sidebar-ad',
                size: 'medium', // small, medium, large
                refreshRate: 60000, // ms (1 minuta)
                position: 'sidebar'
            },
            mapOverlay: {
                id: 'map-overlay-ad',
                size: 'small',
                refreshRate: 120000, // ms (2 minuty)
                position: 'overlay'
            },
            searchResults: {
                id: 'search-results-ad',
                size: 'small',
                refreshRate: 60000,
                position: 'search'
            },
            fullScreen: {
                id: 'full-screen-ad',
                size: 'large',
                refreshRate: 300000, // ms (5 minut)
                position: 'fullscreen'
            }
        },
        
        // Nastavení reklam podle předplatného
        subscriptionSettings: {
            free: {
                showAds: true,
                adFrequency: 1.0 // 100% reklam
            },
            basic: {
                showAds: true,
                adFrequency: 0.5 // 50% reklam
            },
            premium: {
                showAds: false,
                adFrequency: 0
            },
            ultimate: {
                showAds: false,
                adFrequency: 0
            }
        },
        
        // Testovací reklamy pro vývoj
        testAds: [
            {
                id: 'test-ad-1',
                title: 'Premium předplatné',
                description: 'Získejte přístup ke všem funkcím bez reklam!',
                imageUrl: '/assets/images/ads/premium-ad.jpg',
                targetUrl: '#subscription',
                type: 'internal'
            },
            {
                id: 'test-ad-2',
                title: 'Mapové podklady PRO',
                description: 'Profesionální mapové podklady pro vaše cesty',
                imageUrl: '/assets/images/ads/maps-ad.jpg',
                targetUrl: '#maps-pro',
                type: 'internal'
            },
            {
                id: 'test-ad-3',
                title: 'Cestovní pojištění',
                description: 'Bezpečné cestování s pojištěním na míru',
                imageUrl: '/assets/images/ads/insurance-ad.jpg',
                targetUrl: 'https://example.com/travel-insurance',
                type: 'external'
            }
        ]
    },
    
    // Stav modulu
    state: {
        initialized: false,
        activeAds: {},
        adProviderLoaded: false,
        userSubscription: 'free',
        adBlockerDetected: false,
        adImpressions: 0,
        adClicks: 0,
        lastAdRefresh: {}
    },
    
    // Inicializace modulu
    init() {
        console.log('Inicializace reklamního modulu...');
        
        if (this.state.initialized) {
            console.log('Reklamní modul již byl inicializován');
            return;
        }
        
        // Kontrola předplatného uživatele
        this.checkUserSubscription();
        
        // Vytvoření reklamních slotů
        this.createAdSlots();
        
        // Detekce AdBlockeru
        this.detectAdBlocker();
        
        // Načtení externího poskytovatele reklam (Google AdSense, atd.)
        // V testovacím režimu používáme vlastní reklamy
        if (this.isTestMode()) {
            this.loadTestAds();
        } else {
            this.loadAdProvider();
        }
        
        // Nastavení posluchačů událostí
        this.setupEventListeners();
        
        this.state.initialized = true;
        console.log('Reklamní modul byl úspěšně inicializován');
    },
    
    // Kontrola předplatného uživatele
    checkUserSubscription() {
        // Pokud existuje modul pro předplatné, získáme aktuální předplatné
        if (typeof SubscriptionService !== 'undefined' && SubscriptionService.getCurrentPlan) {
            const currentPlan = SubscriptionService.getCurrentPlan();
            if (currentPlan && this.config.subscriptionSettings[currentPlan.id]) {
                this.state.userSubscription = currentPlan.id;
                console.log(`Zjištěno předplatné uživatele: ${currentPlan.id}`);
            }
        } else if (typeof UserAccounts !== 'undefined' && UserAccounts.state && UserAccounts.state.currentUser) {
            // Alternativně zkusíme získat předplatné z uživatelského účtu
            const subscription = UserAccounts.state.currentUser.subscription || 'free';
            this.state.userSubscription = subscription;
            console.log(`Zjištěno předplatné uživatele z účtu: ${subscription}`);
        } else {
            console.log('Předplatné uživatele nebylo zjištěno, používám výchozí: free');
        }
    },
    
    // Vytvoření reklamních slotů v DOM
    createAdSlots() {
        const subscriptionSettings = this.config.subscriptionSettings[this.state.userSubscription];
        
        // Pokud uživatel nemá zobrazovat reklamy, nepokračujeme
        if (!subscriptionSettings.showAds) {
            console.log('Uživatel má předplatné bez reklam, reklamní sloty nebudou vytvořeny');
            return;
        }
        
        // Vytvoření kontejneru pro reklamy, pokud neexistuje
        let adsContainer = document.getElementById('ads-container');
        if (!adsContainer) {
            adsContainer = document.createElement('div');
            adsContainer.id = 'ads-container';
            document.body.appendChild(adsContainer);
        }
        
        // Vytvoření jednotlivých reklamních slotů
        for (const [slotKey, slotConfig] of Object.entries(this.config.adSlots)) {
            // Náhodně přeskočíme některé reklamy podle frekvence
            if (Math.random() > subscriptionSettings.adFrequency) {
                continue;
            }
            
            // Vytvoření slotu
            const adSlot = document.createElement('div');
            adSlot.id = slotConfig.id;
            adSlot.className = `ad-slot ad-${slotConfig.size} ad-position-${slotConfig.position}`;
            adSlot.innerHTML = `
                <div class="ad-label">Reklama</div>
                <div class="ad-content" id="${slotConfig.id}-content"></div>
                <div class="ad-close" title="Zavřít reklamu">×</div>
            `;
            
            // Přidání slotu do kontejneru
            adsContainer.appendChild(adSlot);
            
            // Přidání posluchače události pro zavření reklamy
            const closeButton = adSlot.querySelector('.ad-close');
            if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.hideAd(slotConfig.id);
                });
            }
            
            // Přidání posluchače události pro kliknutí na reklamu
            adSlot.addEventListener('click', () => {
                this.handleAdClick(slotConfig.id);
            });
            
            // Nastavení časovače pro obnovení reklamy
            this.state.lastAdRefresh[slotConfig.id] = Date.now();
            setInterval(() => {
                this.refreshAd(slotConfig.id);
            }, slotConfig.refreshRate);
            
            console.log(`Vytvořen reklamní slot: ${slotConfig.id}`);
        }
    },
    
    // Načtení testovacích reklam
    loadTestAds() {
        console.log('Načítání testovacích reklam...');
        
        // Pro každý vytvořený slot zobrazíme náhodnou testovací reklamu
        for (const [slotKey, slotConfig] of Object.entries(this.config.adSlots)) {
            const adSlotContent = document.getElementById(`${slotConfig.id}-content`);
            if (adSlotContent) {
                // Výběr náhodné reklamy
                const randomAd = this.getRandomTestAd();
                
                // Zobrazení reklamy
                this.displayAd(slotConfig.id, randomAd);
            }
        }
        
        this.state.adProviderLoaded = true;
    },
    
    // Získání náhodné testovací reklamy
    getRandomTestAd() {
        const randomIndex = Math.floor(Math.random() * this.config.testAds.length);
        return this.config.testAds[randomIndex];
    },
    
    // Načtení externího poskytovatele reklam
    loadAdProvider() {
        console.log('Načítání externího poskytovatele reklam...');
        
        // Zde by byl kód pro načtení Google AdSense nebo jiného poskytovatele
        // Pro účely demonstrace pouze simulujeme načtení
        setTimeout(() => {
            console.log('Externí poskytovatel reklam byl načten');
            this.state.adProviderLoaded = true;
            
            // Načtení reklam do všech slotů
            for (const [slotKey, slotConfig] of Object.entries(this.config.adSlots)) {
                this.refreshAd(slotConfig.id);
            }
        }, 1000);
    },
    
    // Zobrazení reklamy v daném slotu
    displayAd(slotId, adData) {
        const adSlot = document.getElementById(`${slotId}-content`);
        if (!adSlot) return;
        
        // Uložení aktivní reklamy do stavu
        this.state.activeAds[slotId] = adData;
        
        // Vytvoření HTML pro reklamu
        let adHtml = '';
        
        if (adData.imageUrl) {
            adHtml += `<img src="${adData.imageUrl}" alt="${adData.title}" class="ad-image">`;
        }
        
        adHtml += `
            <div class="ad-info">
                <h3 class="ad-title">${adData.title}</h3>
                <p class="ad-description">${adData.description}</p>
            </div>
        `;
        
        // Vložení reklamy do slotu
        adSlot.innerHTML = adHtml;
        
        // Zobrazení slotu
        const parentSlot = document.getElementById(slotId);
        if (parentSlot) {
            parentSlot.style.display = 'block';
        }
        
        // Zaznamenání imprese
        this.trackAdImpression(slotId, adData);
    },
    
    // Skrytí reklamy
    hideAd(slotId) {
        const adSlot = document.getElementById(slotId);
        if (adSlot) {
            adSlot.style.display = 'none';
        }
    },
    
    // Obnovení reklamy v daném slotu
    refreshAd(slotId) {
        console.log(`Obnovení reklamy v slotu: ${slotId}`);
        
        // Kontrola, zda má uživatel zobrazovat reklamy
        const subscriptionSettings = this.config.subscriptionSettings[this.state.userSubscription];
        if (!subscriptionSettings.showAds) {
            this.hideAd(slotId);
            return;
        }
        
        // Aktualizace času poslední obnovy
        this.state.lastAdRefresh[slotId] = Date.now();
        
        if (this.isTestMode()) {
            // V testovacím režimu zobrazíme náhodnou testovací reklamu
            const randomAd = this.getRandomTestAd();
            this.displayAd(slotId, randomAd);
        } else {
            // V produkčním režimu bychom volali API poskytovatele reklam
            // Pro účely demonstrace pouze simulujeme načtení
            setTimeout(() => {
                const mockAd = {
                    id: `external-ad-${Date.now()}`,
                    title: 'Externí reklama',
                    description: 'Toto je ukázková externí reklama',
                    imageUrl: '/assets/images/ads/default-ad.jpg',
                    targetUrl: 'https://example.com',
                    type: 'external'
                };
                
                this.displayAd(slotId, mockAd);
            }, 500);
        }
    },
    
    // Zpracování kliknutí na reklamu
    handleAdClick(slotId) {
        const adData = this.state.activeAds[slotId];
        if (!adData) return;
        
        console.log(`Kliknutí na reklamu: ${adData.title} (${slotId})`);
        
        // Zaznamenání kliknutí
        this.trackAdClick(slotId, adData);
        
        // Otevření cílové URL
        if (adData.type === 'internal') {
            // Interní odkaz - změna stavu aplikace
            if (adData.targetUrl.startsWith('#')) {
                const targetSection = adData.targetUrl.substring(1);
                
                // Zpracování interních odkazů
                if (targetSection === 'subscription' && typeof SubscriptionService !== 'undefined') {
                    SubscriptionService.showSubscriptionPlans();
                } else if (targetSection === 'maps-pro' && typeof MapService !== 'undefined') {
                    MapService.showProMapsOffer();
                } else {
                    console.log(`Neznámý interní odkaz: ${targetSection}`);
                }
            }
        } else {
            // Externí odkaz - otevření v novém okně
            window.open(adData.targetUrl, '_blank');
        }
    },
    
    // Sledování imprese reklamy
    trackAdImpression(slotId, adData) {
        this.state.adImpressions++;
        
        console.log(`Imprese reklamy: ${adData.title} (${slotId})`);
        
        // Zde by byl kód pro odeslání dat o impresi na server
        // Pro účely demonstrace pouze vypisujeme do konzole
    },
    
    // Sledování kliknutí na reklamu
    trackAdClick(slotId, adData) {
        this.state.adClicks++;
        
        console.log(`Kliknutí na reklamu: ${adData.title} (${slotId})`);
        
        // Zde by byl kód pro odeslání dat o kliknutí na server
        // Pro účely demonstrace pouze vypisujeme do konzole
    },
    
    // Detekce AdBlockeru
    detectAdBlocker() {
        // Jednoduchá detekce AdBlockeru
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            if (testAd.offsetHeight === 0) {
                console.log('Detekován AdBlocker');
                this.state.adBlockerDetected = true;
                this.handleAdBlocker();
            }
            
            document.body.removeChild(testAd);
        }, 100);
    },
    
    // Zpracování detekce AdBlockeru
    handleAdBlocker() {
        // Zobrazení upozornění pro uživatele s AdBlockerem
        const adBlockerMessage = document.createElement('div');
        adBlockerMessage.id = 'ad-blocker-message';
        adBlockerMessage.className = 'ad-blocker-message';
        adBlockerMessage.innerHTML = `
            <div class="ad-blocker-content">
                <h3>Detekován AdBlocker</h3>
                <p>Prosím, zvažte vypnutí AdBlockeru pro tuto stránku. Reklamy nám pomáhají financovat vývoj aplikace.</p>
                <p>Alternativně si můžete zakoupit předplatné bez reklam.</p>
                <div class="ad-blocker-actions">
                    <button id="ad-blocker-subscribe">Zobrazit předplatné</button>
                    <button id="ad-blocker-close">Zavřít</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(adBlockerMessage);
        
        // Přidání posluchačů událostí
        document.getElementById('ad-blocker-subscribe').addEventListener('click', () => {
            if (typeof SubscriptionService !== 'undefined') {
                SubscriptionService.showSubscriptionPlans();
            }
            document.body.removeChild(adBlockerMessage);
        });
        
        document.getElementById('ad-blocker-close').addEventListener('click', () => {
            document.body.removeChild(adBlockerMessage);
        });
    },
    
    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Posluchač události pro změnu předplatného
        document.addEventListener('subscriptionChanged', (event) => {
            if (event.detail && event.detail.plan) {
                this.state.userSubscription = event.detail.plan;
                console.log(`Změna předplatného: ${event.detail.plan}`);
                
                // Aktualizace zobrazení reklam podle nového předplatného
                this.updateAdsBasedOnSubscription();
            }
        });
    },
    
    // Aktualizace zobrazení reklam podle předplatného
    updateAdsBasedOnSubscription() {
        const subscriptionSettings = this.config.subscriptionSettings[this.state.userSubscription];
        
        if (!subscriptionSettings.showAds) {
            // Skrytí všech reklam
            for (const [slotKey, slotConfig] of Object.entries(this.config.adSlots)) {
                this.hideAd(slotConfig.id);
            }
            
            console.log('Reklamy byly skryty (předplatné bez reklam)');
        } else {
            // Obnovení všech reklam
            for (const [slotKey, slotConfig] of Object.entries(this.config.adSlots)) {
                // Náhodně přeskočíme některé reklamy podle frekvence
                if (Math.random() <= subscriptionSettings.adFrequency) {
                    this.refreshAd(slotConfig.id);
                } else {
                    this.hideAd(slotConfig.id);
                }
            }
            
            console.log(`Reklamy byly aktualizovány (frekvence: ${subscriptionSettings.adFrequency})`);
        }
    },
    
    // Kontrola, zda jsme v testovacím režimu
    isTestMode() {
        return true; // Pro účely demonstrace vždy používáme testovací režim
    },
    
    // Získání statistik reklam
    getAdStats() {
        return {
            impressions: this.state.adImpressions,
            clicks: this.state.adClicks,
            ctr: this.state.adImpressions > 0 ? (this.state.adClicks / this.state.adImpressions) * 100 : 0
        };
    }
};

// Inicializace modulu po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Kontrola, zda je modul již definován
    if (typeof AdvertisementModule !== 'undefined') {
        AdvertisementModule.init();
    } else {
        console.error('Reklamní modul nebyl nalezen!');
    }
});
