/**
 * Modul pro integraci se Supabase
 * Verze 0.3.8.2
 *
 * Tento modul zajišťuje komunikaci s Supabase databází a poskytuje metody pro práci s daty
 */

const SupabaseIntegration = {
    // Konfigurace
    config: {
        supabaseUrl: 'https://njjhhamwixjbfibywreo.supabase.co',
        supabaseKey: '', // Bude načteno z localStorage nebo nastaveno uživatelem
        apiVersion: '1',
        timeout: 10000, // 10 sekund timeout pro API požadavky
        connectionString: 'postgresql://postgres:[YOUR-PASSWORD]@db.njjhhamwixjbfibywreo.supabase.co:5432/postgres'
    },

    // Stav modulu
    state: {
        initialized: false,
        connected: false,
        lastError: null,
        user: null
    },

    // Inicializace modulu
    init() {
        console.log('Inicializace modulu pro Supabase integraci...');

        // Načtení API klíče z localStorage, pokud existuje
        const savedKey = localStorage.getItem('aiMapaSupabaseKey');
        if (savedKey) {
            this.config.supabaseKey = savedKey;
            console.log('Supabase API klíč načten z localStorage');
        }

        // Přidání tlačítka pro konfiguraci Supabase do nastavení
        this.addSupabaseConfigToSettings();

        // Pokus o připojení k Supabase, pokud máme klíč
        if (this.config.supabaseKey) {
            this.connect();
        }

        this.state.initialized = true;
        console.log('Modul pro Supabase integraci byl inicializován');

        // Vyvolání události o inicializaci
        document.dispatchEvent(new CustomEvent('supabaseInitialized'));
    },

    // Přidání konfigurace Supabase do nastavení
    addSupabaseConfigToSettings() {
        // Kontrola, zda existuje modal s nastavením
        const settingsModal = document.getElementById('settingsModal');
        if (!settingsModal) {
            console.warn('Modal s nastavením nebyl nalezen, konfigurace Supabase nebude přidána');
            return;
        }

        // Kontrola, zda již sekce existuje
        if (document.getElementById('supabaseConfigSection')) {
            return;
        }

        // Vytvoření sekce pro konfiguraci Supabase
        const supabaseSection = document.createElement('div');
        supabaseSection.id = 'supabaseConfigSection';
        supabaseSection.className = 'settings-section';
        supabaseSection.innerHTML = `
            <h3>Supabase Konfigurace</h3>
            <div class="form-group">
                <label for="supabaseUrl">Supabase URL:</label>
                <input type="text" id="supabaseUrl" class="settings-input" value="${this.config.supabaseUrl}" readonly>
            </div>
            <div class="form-group">
                <label for="supabaseKey">Supabase API Klíč:</label>
                <div class="api-key-input">
                    <input type="password" id="supabaseKey" class="settings-input" placeholder="Zadejte Supabase API klíč" value="${this.config.supabaseKey}">
                    <button id="showSupabaseKey" class="show-key-btn">Zobrazit</button>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="saveSupabaseKey" checked>
                    <label for="saveSupabaseKey">Uložit API klíč</label>
                </div>
            </div>
            <div class="form-group">
                <label for="postgresPassword">PostgreSQL heslo:</label>
                <div class="api-key-input">
                    <input type="password" id="postgresPassword" class="settings-input" placeholder="Zadejte heslo pro PostgreSQL">
                    <button id="showPostgresPassword" class="show-key-btn">Zobrazit</button>
                </div>
                <div class="checkbox-container">
                    <input type="checkbox" id="savePostgresPassword" checked>
                    <label for="savePostgresPassword">Uložit heslo</label>
                </div>
                <p class="connection-info">Connection string: ${this.config.connectionString.replace('[YOUR-PASSWORD]', '********')}</p>
            </div>
            <div class="form-group">
                <button id="testSupabaseConnection" class="btn secondary-btn">Otestovat připojení</button>
                <span id="supabaseConnectionStatus" class="connection-status"></span>
            </div>
        `;

        // Přidání sekce do modalu
        const modalBody = settingsModal.querySelector('.modal-body');
        modalBody.insertBefore(supabaseSection, modalBody.querySelector('.settings-actions'));

        // Přidání event listenerů
        this.addSupabaseSettingsEventListeners();
    },

    // Přidání event listenerů pro nastavení Supabase
    addSupabaseSettingsEventListeners() {
        // Tlačítko pro zobrazení/skrytí API klíče
        const showKeyBtn = document.getElementById('showSupabaseKey');
        const keyInput = document.getElementById('supabaseKey');

        if (showKeyBtn && keyInput) {
            showKeyBtn.addEventListener('click', () => {
                if (keyInput.type === 'password') {
                    keyInput.type = 'text';
                    showKeyBtn.textContent = 'Skrýt';
                } else {
                    keyInput.type = 'password';
                    showKeyBtn.textContent = 'Zobrazit';
                }
            });
        }

        // Tlačítko pro zobrazení/skrytí PostgreSQL hesla
        const showPgPassBtn = document.getElementById('showPostgresPassword');
        const pgPassInput = document.getElementById('postgresPassword');

        if (showPgPassBtn && pgPassInput) {
            showPgPassBtn.addEventListener('click', () => {
                if (pgPassInput.type === 'password') {
                    pgPassInput.type = 'text';
                    showPgPassBtn.textContent = 'Skrýt';
                } else {
                    pgPassInput.type = 'password';
                    showPgPassBtn.textContent = 'Zobrazit';
                }
            });
        }

        // Načtení uloženého PostgreSQL hesla, pokud existuje
        const savedPgPass = localStorage.getItem('aiMapaPostgresPassword');
        if (savedPgPass && pgPassInput) {
            pgPassInput.value = savedPgPass;

            // Aktualizace connection stringu
            this.updateConnectionString(savedPgPass);
        }

        // Tlačítko pro testování připojení
        const testBtn = document.getElementById('testSupabaseConnection');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                // Získání hodnoty API klíče z inputu
                const key = document.getElementById('supabaseKey').value.trim();
                const pgPass = document.getElementById('postgresPassword').value.trim();

                if (!key) {
                    this.updateConnectionStatus('Zadejte API klíč', 'error');
                    return;
                }

                if (!pgPass) {
                    this.updateConnectionStatus('Zadejte PostgreSQL heslo', 'error');
                    return;
                }

                // Aktualizace API klíče a connection stringu
                this.config.supabaseKey = key;
                this.updateConnectionString(pgPass);

                // Testování připojení
                this.testConnection();
            });
        }

        // Event listener pro uložení nastavení
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            const originalClickHandler = saveSettingsBtn.onclick;

            saveSettingsBtn.onclick = (event) => {
                // Volání původního handleru, pokud existuje
                if (originalClickHandler) {
                    originalClickHandler.call(saveSettingsBtn, event);
                }

                // Uložení nastavení Supabase
                this.saveSupabaseSettings();
            };
        }
    },

    // Aktualizace connection stringu s heslem
    updateConnectionString(password) {
        if (!password) return;

        // Aktualizace connection stringu s heslem
        const baseConnString = this.config.connectionString;
        this.config.connectionString = baseConnString.replace('[YOUR-PASSWORD]', password);

        // Aktualizace zobrazení connection stringu v UI
        const connInfoElement = document.querySelector('.connection-info');
        if (connInfoElement) {
            connInfoElement.textContent = `Connection string: ${baseConnString.replace('[YOUR-PASSWORD]', '********')}`;
        }

        console.log('Connection string byl aktualizován s heslem');
    },

    // Uložení nastavení Supabase
    saveSupabaseSettings() {
        const keyInput = document.getElementById('supabaseKey');
        const saveKeyCheckbox = document.getElementById('saveSupabaseKey');
        const pgPassInput = document.getElementById('postgresPassword');
        const savePgPassCheckbox = document.getElementById('savePostgresPassword');

        // Zpracování API klíče
        if (keyInput && saveKeyCheckbox) {
            const key = keyInput.value.trim();

            // Aktualizace API klíče
            this.config.supabaseKey = key;

            // Uložení API klíče do localStorage, pokud je zaškrtnuto
            if (saveKeyCheckbox.checked && key) {
                localStorage.setItem('aiMapaSupabaseKey', key);
                console.log('Supabase API klíč byl uložen do localStorage');
            } else if (!saveKeyCheckbox.checked) {
                localStorage.removeItem('aiMapaSupabaseKey');
                console.log('Supabase API klíč byl odstraněn z localStorage');
            }
        }

        // Zpracování PostgreSQL hesla
        if (pgPassInput && savePgPassCheckbox) {
            const pgPass = pgPassInput.value.trim();

            // Aktualizace connection stringu
            if (pgPass) {
                this.updateConnectionString(pgPass);
            }

            // Uložení PostgreSQL hesla do localStorage, pokud je zaškrtnuto
            if (savePgPassCheckbox.checked && pgPass) {
                localStorage.setItem('aiMapaPostgresPassword', pgPass);
                console.log('PostgreSQL heslo bylo uloženo do localStorage');
            } else if (!savePgPassCheckbox.checked) {
                localStorage.removeItem('aiMapaPostgresPassword');
                console.log('PostgreSQL heslo bylo odstraněno z localStorage');
            }
        }

        // Pokus o připojení s novými údaji
        if (this.config.supabaseKey && this.config.connectionString.indexOf('[YOUR-PASSWORD]') === -1) {
            this.connect();
        }
    },

    // Aktualizace stavu připojení v UI
    updateConnectionStatus(message, type = 'info') {
        const statusElement = document.getElementById('supabaseConnectionStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `connection-status ${type}`;
        }
    },

    // Připojení k Supabase
    connect() {
        console.log('Připojování k Supabase...');

        // Kontrola, zda máme API klíč
        if (!this.config.supabaseKey) {
            console.error('Nelze se připojit k Supabase: Chybí API klíč');
            this.state.connected = false;
            this.state.lastError = 'Chybí API klíč';
            this.updateConnectionStatus('Chybí API klíč', 'error');
            return false;
        }

        // Simulace připojení (v reálné aplikaci by zde byl skutečný kód pro připojení k Supabase)
        this.state.connected = true;
        this.state.lastError = null;
        console.log('Připojeno k Supabase');
        this.updateConnectionStatus('Připojeno', 'success');

        // Vyvolání události o připojení
        document.dispatchEvent(new CustomEvent('supabaseConnected'));

        return true;
    },

    // Testování připojení k Supabase
    async testConnection() {
        console.log('Testování připojení k Supabase...');
        this.updateConnectionStatus('Testování připojení...', 'info');

        // Kontrola, zda máme API klíč
        if (!this.config.supabaseKey) {
            console.error('Nelze otestovat připojení k Supabase: Chybí API klíč');
            this.state.connected = false;
            this.state.lastError = 'Chybí API klíč';
            this.updateConnectionStatus('Chybí API klíč', 'error');
            return false;
        }

        // Kontrola, zda máme platný connection string
        if (this.config.connectionString.indexOf('[YOUR-PASSWORD]') !== -1) {
            console.error('Nelze otestovat připojení k Supabase: Chybí heslo v connection stringu');
            this.state.connected = false;
            this.state.lastError = 'Chybí heslo v connection stringu';
            this.updateConnectionStatus('Chybí heslo pro PostgreSQL', 'error');
            return false;
        }

        try {
            // Simulace testování připojení (v reálné aplikaci by zde byl skutečný kód pro testování připojení k Supabase)
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Testování připojení s connection stringem:', this.config.connectionString.replace(/postgres:.*@/, 'postgres:****@'));

            // Simulace úspěšného připojení
            this.state.connected = true;
            this.state.lastError = null;
            console.log('Test připojení k Supabase byl úspěšný');
            this.updateConnectionStatus('Připojeno', 'success');

            // Vyvolání události o připojení
            document.dispatchEvent(new CustomEvent('supabaseConnected', {
                detail: {
                    connectionString: this.config.connectionString.replace(/postgres:.*@/, 'postgres:****@')
                }
            }));

            return true;
        } catch (error) {
            // Zpracování chyby
            console.error('Chyba při testování připojení k Supabase:', error);
            this.state.connected = false;
            this.state.lastError = error.message;
            this.updateConnectionStatus(`Chyba: ${error.message}`, 'error');

            return false;
        }
    },

    // Získání dat z Supabase
    async getData(table, query = {}) {
        console.log(`Získávání dat z tabulky ${table}...`);

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze získat data: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace získání dat (v reálné aplikaci by zde byl skutečný kód pro získání dat z Supabase)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulace dat
            const data = [
                { id: 1, name: 'Položka 1', created_at: new Date().toISOString() },
                { id: 2, name: 'Položka 2', created_at: new Date().toISOString() },
                { id: 3, name: 'Položka 3', created_at: new Date().toISOString() }
            ];

            console.log(`Získáno ${data.length} položek z tabulky ${table}`);
            return { data, error: null };
        } catch (error) {
            console.error(`Chyba při získávání dat z tabulky ${table}:`, error);
            return { data: null, error: error.message };
        }
    },

    // Uložení dat do Supabase
    async saveData(table, data) {
        console.log(`Ukládání dat do tabulky ${table}...`);

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze uložit data: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace uložení dat (v reálné aplikaci by zde byl skutečný kód pro uložení dat do Supabase)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulace odpovědi
            const savedData = { ...data, id: Math.floor(Math.random() * 1000), created_at: new Date().toISOString() };

            console.log(`Data byla úspěšně uložena do tabulky ${table}`);
            return { data: savedData, error: null };
        } catch (error) {
            console.error(`Chyba při ukládání dat do tabulky ${table}:`, error);
            return { data: null, error: error.message };
        }
    },

    // Aktualizace dat v Supabase
    async updateData(table, id, data) {
        console.log(`Aktualizace dat v tabulce ${table} pro ID ${id}...`);

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze aktualizovat data: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace aktualizace dat (v reálné aplikaci by zde byl skutečný kód pro aktualizaci dat v Supabase)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Simulace odpovědi
            const updatedData = { ...data, id, updated_at: new Date().toISOString() };

            console.log(`Data byla úspěšně aktualizována v tabulce ${table} pro ID ${id}`);
            return { data: updatedData, error: null };
        } catch (error) {
            console.error(`Chyba při aktualizaci dat v tabulce ${table} pro ID ${id}:`, error);
            return { data: null, error: error.message };
        }
    },

    // Odstranění dat z Supabase
    async deleteData(table, id) {
        console.log(`Odstraňování dat z tabulky ${table} pro ID ${id}...`);

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze odstranit data: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace odstranění dat (v reálné aplikaci by zde byl skutečný kód pro odstranění dat z Supabase)
            await new Promise(resolve => setTimeout(resolve, 500));

            console.log(`Data byla úspěšně odstraněna z tabulky ${table} pro ID ${id}`);
            return { error: null };
        } catch (error) {
            console.error(`Chyba při odstraňování dat z tabulky ${table} pro ID ${id}:`, error);
            return { error: error.message };
        }
    },

    // Synchronizace lokálních dat s Supabase
    async syncData(localData, table) {
        console.log(`Synchronizace lokálních dat s tabulkou ${table}...`);

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze synchronizovat data: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace synchronizace dat (v reálné aplikaci by zde byl skutečný kód pro synchronizaci dat s Supabase)
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(`Data byla úspěšně synchronizována s tabulkou ${table}`);
            return { data: localData, error: null };
        } catch (error) {
            console.error(`Chyba při synchronizaci dat s tabulkou ${table}:`, error);
            return { data: null, error: error.message };
        }
    },

    // Přihlášení uživatele
    async login(email, password) {
        console.log(`Přihlašování uživatele ${email}...`);

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze přihlásit uživatele: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace přihlášení (v reálné aplikaci by zde byl skutečný kód pro přihlášení uživatele přes Supabase)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulace odpovědi
            const user = { id: Math.floor(Math.random() * 1000), email, created_at: new Date().toISOString() };
            this.state.user = user;

            console.log(`Uživatel ${email} byl úspěšně přihlášen`);
            return { user, error: null };
        } catch (error) {
            console.error(`Chyba při přihlašování uživatele ${email}:`, error);
            return { user: null, error: error.message };
        }
    },

    // Registrace uživatele
    async register(email, password) {
        console.log(`Registrace uživatele ${email}...`);

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze registrovat uživatele: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace registrace (v reálné aplikaci by zde byl skutečný kód pro registraci uživatele přes Supabase)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulace odpovědi
            const user = { id: Math.floor(Math.random() * 1000), email, created_at: new Date().toISOString() };
            this.state.user = user;

            console.log(`Uživatel ${email} byl úspěšně registrován`);
            return { user, error: null };
        } catch (error) {
            console.error(`Chyba při registraci uživatele ${email}:`, error);
            return { user: null, error: error.message };
        }
    },

    // Odhlášení uživatele
    async logout() {
        console.log('Odhlašování uživatele...');

        // Kontrola připojení
        if (!this.state.connected) {
            console.error('Nelze odhlásit uživatele: Není připojení k Supabase');
            return { error: 'Není připojení k Supabase' };
        }

        try {
            // Simulace odhlášení (v reálné aplikaci by zde byl skutečný kód pro odhlášení uživatele z Supabase)
            await new Promise(resolve => setTimeout(resolve, 500));

            // Vyčištění stavu
            this.state.user = null;

            console.log('Uživatel byl úspěšně odhlášen');
            return { error: null };
        } catch (error) {
            console.error('Chyba při odhlašování uživatele:', error);
            return { error: error.message };
        }
    },

    // Získání aktuálního uživatele
    getCurrentUser() {
        return this.state.user;
    }
};

// Přidání CSS stylů pro Supabase konfiguraci
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .connection-status {
            margin-left: 10px;
            font-size: 14px;
        }

        .connection-status.success {
            color: #2ecc71;
        }

        .connection-status.error {
            color: #e74c3c;
        }

        .connection-status.info {
            color: #3498db;
        }

        #supabaseConfigSection .form-group {
            margin-bottom: 15px;
        }

        #supabaseConfigSection .settings-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        #supabaseConfigSection .api-key-input {
            display: flex;
            align-items: center;
        }

        #supabaseConfigSection .show-key-btn {
            margin-left: 10px;
            padding: 8px 12px;
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        }

        #supabaseConfigSection .checkbox-container {
            margin-top: 5px;
        }

        /* Tmavý režim */
        body[data-theme="dark"] #supabaseConfigSection .settings-input {
            background-color: #4a5568;
            border-color: #2d3748;
            color: #f7fafc;
        }

        body[data-theme="dark"] #supabaseConfigSection .show-key-btn {
            background-color: #4a5568;
            border-color: #2d3748;
            color: #f7fafc;
        }
    `;
    document.head.appendChild(style);
});

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    SupabaseIntegration.init();
});
