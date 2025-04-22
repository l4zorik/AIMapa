/**
 * Modul pro zobrazení aktuálního počasí na mapě
 * Verze 0.2.8.6.2
 */

const WeatherLayer = {
    // Stav vrstvy počasí
    weatherLayerActive: false,
    
    // Vrstva počasí
    weatherLayer: null,
    
    // Aktuální počasí
    currentWeather: null,
    
    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro zobrazení počasí...');
        
        // Přidání tlačítka pro zobrazení počasí
        this.createWeatherButton();
        
        console.log('Modul pro zobrazení počasí byl inicializován');
    },
    
    // Vytvoření tlačítka pro zobrazení počasí
    createWeatherButton() {
        // Kontrola, zda již tlačítko neexistuje
        if (document.getElementById('weatherButton')) {
            return;
        }
        
        // Vytvoření tlačítka
        const weatherButton = document.createElement('button');
        weatherButton.id = 'weatherButton';
        weatherButton.className = 'weather-button';
        weatherButton.innerHTML = '<i class="icon">🌤️</i>';
        weatherButton.title = 'Zobrazit počasí';
        
        // Přidání tlačítka do mapy
        const mapControls = document.querySelector('.leaflet-top.leaflet-right');
        if (mapControls) {
            const controlContainer = document.createElement('div');
            controlContainer.className = 'leaflet-control-weather leaflet-bar leaflet-control';
            controlContainer.appendChild(weatherButton);
            mapControls.appendChild(controlContainer);
        }
        
        // Přidání event listeneru
        weatherButton.addEventListener('click', () => {
            this.toggleWeatherLayer();
        });
    },
    
    // Přepnutí vrstvy počasí
    toggleWeatherLayer() {
        if (this.weatherLayerActive) {
            this.hideWeatherLayer();
        } else {
            this.showWeatherLayer();
        }
    },
    
    // Zobrazení vrstvy počasí
    showWeatherLayer() {
        // Aktualizace stavu tlačítka
        const weatherButton = document.getElementById('weatherButton');
        if (weatherButton) {
            weatherButton.classList.add('active');
        }
        
        // Zobrazení informace o načítání počasí
        addMessage('Načítám data o počasí...', false);
        
        // Přidání vrstvy počasí
        this.addWeatherLayer();
        
        // Aktualizace stavu
        this.weatherLayerActive = true;
    },
    
    // Skrytí vrstvy počasí
    hideWeatherLayer() {
        // Aktualizace stavu tlačítka
        const weatherButton = document.getElementById('weatherButton');
        if (weatherButton) {
            weatherButton.classList.remove('active');
        }
        
        // Odstranění vrstvy počasí
        if (this.weatherLayer) {
            map.removeLayer(this.weatherLayer);
            this.weatherLayer = null;
        }
        
        // Odstranění widgetu počasí
        this.removeWeatherWidget();
        
        // Aktualizace stavu
        this.weatherLayerActive = false;
        
        // Zobrazení informace o skrytí počasí
        addMessage('Vrstva počasí byla skryta.', false);
    },
    
    // Přidání vrstvy počasí
    addWeatherLayer() {
        // Odstranění existující vrstvy
        if (this.weatherLayer) {
            map.removeLayer(this.weatherLayer);
        }
        
        // Přidání vrstvy OpenWeatherMap
        this.weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={apiKey}', {
            layer: 'temp_new',
            apiKey: '9de243494c0b295cca9337e1e96b00e2', // Veřejný API klíč pro demonstrační účely
            maxZoom: 18,
            opacity: 0.7
        }).addTo(map);
        
        // Přidání ovládacího panelu pro výběr vrstvy
        this.addWeatherLayerControl();
        
        // Získání aktuálního počasí pro střed mapy
        this.getWeatherForLocation(map.getCenter());
        
        // Přidání event listeneru pro změnu středu mapy
        map.on('moveend', this.handleMapMove, this);
    },
    
    // Přidání ovládacího panelu pro výběr vrstvy
    addWeatherLayerControl() {
        // Kontrola, zda již panel neexistuje
        if (document.getElementById('weatherLayerControl')) {
            return;
        }
        
        // Vytvoření panelu
        const control = document.createElement('div');
        control.id = 'weatherLayerControl';
        control.className = 'weather-layer-control';
        
        // Vytvoření obsahu panelu
        control.innerHTML = `
            <div class="weather-layer-control-header">
                <h3>Vrstva počasí</h3>
                <button class="weather-layer-control-close">&times;</button>
            </div>
            <div class="weather-layer-control-body">
                <div class="weather-layer-options">
                    <label class="weather-layer-option">
                        <input type="radio" name="weatherLayer" value="temp_new" checked>
                        <span>Teplota</span>
                    </label>
                    <label class="weather-layer-option">
                        <input type="radio" name="weatherLayer" value="precipitation_new">
                        <span>Srážky</span>
                    </label>
                    <label class="weather-layer-option">
                        <input type="radio" name="weatherLayer" value="clouds_new">
                        <span>Oblačnost</span>
                    </label>
                    <label class="weather-layer-option">
                        <input type="radio" name="weatherLayer" value="pressure_new">
                        <span>Tlak</span>
                    </label>
                    <label class="weather-layer-option">
                        <input type="radio" name="weatherLayer" value="wind_new">
                        <span>Vítr</span>
                    </label>
                </div>
                <div class="weather-layer-opacity">
                    <label for="weatherLayerOpacity">Průhlednost:</label>
                    <input type="range" id="weatherLayerOpacity" min="0" max="100" value="70">
                    <span id="weatherLayerOpacityValue">70%</span>
                </div>
            </div>
        `;
        
        // Přidání panelu do dokumentu
        document.body.appendChild(control);
        
        // Přidání event listenerů
        const closeButton = control.querySelector('.weather-layer-control-close');
        const layerOptions = control.querySelectorAll('input[name="weatherLayer"]');
        const opacitySlider = control.querySelector('#weatherLayerOpacity');
        const opacityValue = control.querySelector('#weatherLayerOpacityValue');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideWeatherLayer();
            });
        }
        
        if (layerOptions) {
            layerOptions.forEach(option => {
                option.addEventListener('change', (e) => {
                    if (this.weatherLayer) {
                        // Aktualizace vrstvy
                        map.removeLayer(this.weatherLayer);
                        this.weatherLayer = L.tileLayer('https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={apiKey}', {
                            layer: e.target.value,
                            apiKey: '9de243494c0b295cca9337e1e96b00e2',
                            maxZoom: 18,
                            opacity: opacitySlider.value / 100
                        }).addTo(map);
                    }
                });
            });
        }
        
        if (opacitySlider && opacityValue) {
            opacitySlider.addEventListener('input', (e) => {
                const opacity = e.target.value;
                opacityValue.textContent = opacity + '%';
                
                if (this.weatherLayer) {
                    this.weatherLayer.setOpacity(opacity / 100);
                }
            });
        }
    },
    
    // Odstranění ovládacího panelu pro výběr vrstvy
    removeWeatherLayerControl() {
        const control = document.getElementById('weatherLayerControl');
        if (control) {
            control.remove();
        }
    },
    
    // Zpracování události změny středu mapy
    handleMapMove() {
        if (this.weatherLayerActive) {
            // Získání aktuálního počasí pro nový střed mapy
            this.getWeatherForLocation(map.getCenter());
        }
    },
    
    // Získání aktuálního počasí pro lokaci
    getWeatherForLocation(latlng) {
        // Vytvoření URL pro API požadavek
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latlng.lat}&lon=${latlng.lng}&units=metric&appid=9de243494c0b295cca9337e1e96b00e2`;
        
        // Odeslání požadavku
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Uložení dat o počasí
                this.currentWeather = data;
                
                // Zobrazení widgetu s počasím
                this.showWeatherWidget(data);
                
                // Zobrazení informace o počasí v chatu
                this.displayWeatherInfo(data);
            })
            .catch(error => {
                console.error('Chyba při získávání dat o počasí:', error);
                addMessage('Nepodařilo se získat data o počasí. Zkuste to prosím znovu.', false);
            });
    },
    
    // Zobrazení widgetu s počasím
    showWeatherWidget(weatherData) {
        // Odstranění existujícího widgetu
        this.removeWeatherWidget();
        
        // Kontrola dat
        if (!weatherData || !weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
            return;
        }
        
        // Vytvoření widgetu
        const widget = document.createElement('div');
        widget.id = 'weatherWidget';
        widget.className = 'weather-widget';
        
        // Získání ikony počasí
        const iconCode = weatherData.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        // Formátování dat
        const temp = Math.round(weatherData.main.temp);
        const feelsLike = Math.round(weatherData.main.feels_like);
        const description = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const windSpeed = Math.round(weatherData.wind.speed * 3.6); // m/s na km/h
        const pressure = weatherData.main.pressure;
        const cityName = weatherData.name;
        
        // Vytvoření obsahu widgetu
        widget.innerHTML = `
            <div class="weather-widget-header">
                <h3>${cityName}</h3>
                <button class="weather-widget-close">&times;</button>
            </div>
            <div class="weather-widget-body">
                <div class="weather-widget-main">
                    <img src="${iconUrl}" alt="${description}" class="weather-widget-icon">
                    <div class="weather-widget-temp">${temp}°C</div>
                </div>
                <div class="weather-widget-description">${description}</div>
                <div class="weather-widget-details">
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Pocitově:</span>
                        <span class="weather-widget-detail-value">${feelsLike}°C</span>
                    </div>
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Vlhkost:</span>
                        <span class="weather-widget-detail-value">${humidity}%</span>
                    </div>
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Vítr:</span>
                        <span class="weather-widget-detail-value">${windSpeed} km/h</span>
                    </div>
                    <div class="weather-widget-detail">
                        <span class="weather-widget-detail-label">Tlak:</span>
                        <span class="weather-widget-detail-value">${pressure} hPa</span>
                    </div>
                </div>
            </div>
        `;
        
        // Přidání widgetu do dokumentu
        document.body.appendChild(widget);
        
        // Přidání event listenerů
        const closeButton = widget.querySelector('.weather-widget-close');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                widget.remove();
            });
        }
    },
    
    // Odstranění widgetu s počasím
    removeWeatherWidget() {
        const widget = document.getElementById('weatherWidget');
        if (widget) {
            widget.remove();
        }
    },
    
    // Zobrazení informací o počasí v chatu
    displayWeatherInfo(weatherData) {
        // Kontrola dat
        if (!weatherData || !weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
            return;
        }
        
        // Formátování dat
        const temp = Math.round(weatherData.main.temp);
        const description = weatherData.weather[0].description;
        const cityName = weatherData.name;
        
        // Zobrazení informace v chatu
        addMessage(`Aktuální počasí v ${cityName}: ${temp}°C, ${description}`, false);
    },
    
    // Zpracování příkazu z chatu
    processCommand(text) {
        // Kontrola, zda text obsahuje příkaz pro zobrazení počasí
        const weatherCommands = ['počasí', 'zobrazit počasí', 'ukázat počasí', 'vrstva počasí'];
        
        for (const command of weatherCommands) {
            if (text.toLowerCase().includes(command)) {
                // Aktivace vrstvy počasí
                if (!this.weatherLayerActive) {
                    this.showWeatherLayer();
                } else {
                    // Pokud je vrstva již aktivní, získáme počasí pro střed mapy
                    this.getWeatherForLocation(map.getCenter());
                }
                return true;
            }
        }
        
        return false;
    },
    
    // Čištění při deaktivaci modulu
    cleanup() {
        // Odstranění event listeneru pro změnu středu mapy
        map.off('moveend', this.handleMapMove, this);
        
        // Odstranění vrstvy počasí
        if (this.weatherLayer) {
            map.removeLayer(this.weatherLayer);
            this.weatherLayer = null;
        }
        
        // Odstranění ovládacího panelu
        this.removeWeatherLayerControl();
        
        // Odstranění widgetu
        this.removeWeatherWidget();
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    WeatherLayer.init();
});
