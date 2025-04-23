/**
 * Modul pro lékařské služby
 * Verze 0.2.8.7.8
 */

const MedicalServices = {
    // Stav modulu
    isInitialized: false,
    activeService: null,

    // Dostupné služby
    services: {
        doctor: {
            name: 'Lékař',
            icon: '👨‍⚕️',
            description: 'Vyhledá lékaře v okolí',
            providers: [
                { id: 'doctor1', name: 'MUDr. Jan Novák', specialty: 'Praktický lékař', address: 'Masarykovo náměstí 12, Hodonín', phone: '+420 123 456 789', hours: 'Po-Pá: 8:00-16:00', rating: 4.8 },
                { id: 'doctor2', name: 'MUDr. Eva Svobodová', specialty: 'Praktický lékař', address: 'Národní třída 5, Hodonín', phone: '+420 987 654 321', hours: 'Po-Pá: 7:30-15:30', rating: 4.5 },
                { id: 'doctor3', name: 'MUDr. Petr Dvořák', specialty: 'Internista', address: 'Havlíčkova 8, Hodonín', phone: '+420 456 789 123', hours: 'Po-Čt: 8:00-17:00, Pá: 8:00-12:00', rating: 4.9 },
                { id: 'doctor4', name: 'MUDr. Lucie Černá', specialty: 'Pediatr', address: 'Komenského 15, Hodonín', phone: '+420 789 123 456', hours: 'Po-Pá: 7:00-15:00', rating: 4.7 },
                { id: 'doctor5', name: 'MUDr. Martin Veselý', specialty: 'Kardiolog', address: 'Brněnská 22, Hodonín', phone: '+420 321 654 987', hours: 'Po, St, Pá: 8:00-16:00', rating: 4.6 }
            ]
        },
        dentist: {
            name: 'Zubař',
            icon: '🦷',
            description: 'Vyhledá zubaře v okolí',
            providers: [
                { id: 'dentist1', name: 'MDDr. Jana Nováková', specialty: 'Zubní lékař', address: 'Masarykovo náměstí 14, Hodonín', phone: '+420 123 456 780', hours: 'Po-Pá: 8:00-16:00', rating: 4.7 },
                { id: 'dentist2', name: 'MUDr. Tomáš Svoboda', specialty: 'Zubní lékař', address: 'Národní třída 7, Hodonín', phone: '+420 987 654 322', hours: 'Po-Pá: 7:30-15:30', rating: 4.6 },
                { id: 'dentist3', name: 'MDDr. Petra Dvořáková', specialty: 'Ortodontista', address: 'Havlíčkova 10, Hodonín', phone: '+420 456 789 124', hours: 'Po-Čt: 8:00-17:00, Pá: 8:00-12:00', rating: 4.9 },
                { id: 'dentist4', name: 'MUDr. Lukáš Černý', specialty: 'Zubní chirurg', address: 'Komenského 17, Hodonín', phone: '+420 789 123 457', hours: 'Po-Pá: 7:00-15:00', rating: 4.8 },
                { id: 'dentist5', name: 'MDDr. Martina Veselá', specialty: 'Dětský zubař', address: 'Brněnská 24, Hodonín', phone: '+420 321 654 988', hours: 'Po, St, Pá: 8:00-16:00', rating: 4.5 }
            ]
        },
        pharmacy: {
            name: 'Lékárna',
            icon: '💊',
            description: 'Vyhledá lékárny v okolí',
            providers: [
                { id: 'pharmacy1', name: 'Lékárna U Radnice', specialty: 'Lékárna', address: 'Masarykovo náměstí 16, Hodonín', phone: '+420 123 456 781', hours: 'Po-Pá: 7:30-18:00, So: 8:00-12:00', rating: 4.6 },
                { id: 'pharmacy2', name: 'Dr.Max', specialty: 'Lékárna', address: 'Národní třída 9, Hodonín', phone: '+420 987 654 323', hours: 'Po-Ne: 8:00-20:00', rating: 4.4 },
                { id: 'pharmacy3', name: 'Benu', specialty: 'Lékárna', address: 'Havlíčkova 12, Hodonín', phone: '+420 456 789 125', hours: 'Po-Pá: 7:00-19:00, So-Ne: 8:00-18:00', rating: 4.5 },
                { id: 'pharmacy4', name: 'Lékárna Centrum', specialty: 'Lékárna', address: 'Komenského 19, Hodonín', phone: '+420 789 123 458', hours: 'Po-Pá: 7:30-17:30', rating: 4.7 },
                { id: 'pharmacy5', name: 'Lékárna Na Pěší', specialty: 'Lékárna', address: 'Brněnská 26, Hodonín', phone: '+420 321 654 989', hours: 'Po-Pá: 8:00-17:00, So: 8:00-12:00', rating: 4.3 }
            ]
        }
    },

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializace modulu lékařských služeb...');
        
        // Vytvoření HTML struktury pro služby
        this.createServiceContainers();
        
        // Přidání event listenerů
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Modul lékařských služeb byl inicializován');
    },

    // Vytvoření HTML struktury pro služby
    createServiceContainers() {
        // Pro každou službu vytvoříme kontejner
        Object.keys(this.services).forEach(serviceId => {
            const service = this.services[serviceId];
            
            // Kontrola, zda kontejner již existuje
            if (document.getElementById(`${serviceId}-service-container`)) return;
            
            // Vytvoření kontejneru
            const container = document.createElement('div');
            container.id = `${serviceId}-service-container`;
            container.className = 'medical-service-container';
            container.style.display = 'none';
            
            // Vytvoření hlavičky
            const header = document.createElement('div');
            header.className = 'medical-service-header';
            header.innerHTML = `
                <div class="medical-service-title">
                    <span class="medical-service-icon">${service.icon}</span>
                    <h3>${service.name}</h3>
                </div>
                <button class="medical-service-close">&times;</button>
            `;
            
            // Vytvoření obsahu
            const content = document.createElement('div');
            content.className = 'medical-service-content';
            
            // Přidání vyhledávacího pole
            const search = document.createElement('div');
            search.className = 'medical-service-search';
            search.innerHTML = `
                <input type="text" class="medical-search-input" placeholder="Vyhledat ${service.name.toLowerCase()}...">
            `;
            
            content.appendChild(search);
            
            // Přidání poskytovatelů
            const providersContainer = document.createElement('div');
            providersContainer.className = 'medical-providers';
            
            service.providers.forEach(provider => {
                const providerElement = document.createElement('div');
                providerElement.className = 'medical-provider';
                providerElement.dataset.id = provider.id;
                
                // Výpočet počtu hvězdiček
                const fullStars = Math.floor(provider.rating);
                const halfStar = provider.rating % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                
                let starsHtml = '';
                for (let i = 0; i < fullStars; i++) starsHtml += '★';
                if (halfStar) starsHtml += '⯨';
                for (let i = 0; i < emptyStars; i++) starsHtml += '☆';
                
                providerElement.innerHTML = `
                    <div class="provider-header">
                        <div class="provider-name">${provider.name}</div>
                        <div class="provider-rating">${starsHtml} <span>${provider.rating}</span></div>
                    </div>
                    <div class="provider-specialty">${provider.specialty}</div>
                    <div class="provider-address">${provider.address}</div>
                    <div class="provider-hours">${provider.hours}</div>
                    <div class="provider-phone">${provider.phone}</div>
                    <div class="provider-actions">
                        <button class="provider-call-btn" data-phone="${provider.phone}">Zavolat</button>
                        <button class="provider-appointment-btn" data-id="${provider.id}">Objednat se</button>
                    </div>
                `;
                
                providersContainer.appendChild(providerElement);
            });
            
            content.appendChild(providersContainer);
            
            // Sestavení kontejneru
            container.appendChild(header);
            container.appendChild(content);
            
            // Přidání do dokumentu
            document.body.appendChild(container);
        });
    },

    // Nastavení event listenerů
    setupEventListeners() {
        // Event listener pro zavření služby
        document.addEventListener('click', (e) => {
            if (e.target.matches('.medical-service-close')) {
                this.hideService();
            }
        });
        
        // Event listener pro vyhledávání
        document.addEventListener('input', (e) => {
            if (e.target.matches('.medical-search-input')) {
                this.filterProviders(e.target.value);
            }
        });
        
        // Event listener pro volání
        document.addEventListener('click', (e) => {
            if (e.target.matches('.provider-call-btn')) {
                const phone = e.target.dataset.phone;
                this.callProvider(phone);
            }
        });
        
        // Event listener pro objednání
        document.addEventListener('click', (e) => {
            if (e.target.matches('.provider-appointment-btn')) {
                const providerId = e.target.dataset.id;
                this.makeAppointment(providerId);
            }
        });
    },

    // Zobrazení služby
    showService(serviceId) {
        if (!this.services[serviceId]) {
            console.error(`Služba ${serviceId} neexistuje`);
            return;
        }
        
        // Skrytí všech služeb
        document.querySelectorAll('.medical-service-container').forEach(container => {
            container.style.display = 'none';
        });
        
        // Zobrazení požadované služby
        const container = document.getElementById(`${serviceId}-service-container`);
        if (container) {
            container.style.display = 'flex';
            this.activeService = serviceId;
            
            // Přidání XP za použití služby
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(5, 'Použití služby ' + this.services[serviceId].name);
            }
            
            // Přidání zprávy do chatu
            if (typeof addMessage !== 'undefined') {
                addMessage(`Zobrazuji poskytovatele: ${this.services[serviceId].name}`, false);
            }
            
            // Zaměření vyhledávacího pole
            const searchInput = container.querySelector('.medical-search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    },

    // Skrytí služby
    hideService() {
        document.querySelectorAll('.medical-service-container').forEach(container => {
            container.style.display = 'none';
        });
        
        this.activeService = null;
    },

    // Filtrování poskytovatelů
    filterProviders(searchText) {
        if (!this.activeService) return;
        
        searchText = searchText.toLowerCase();
        
        // Nalezení kontejneru
        const container = document.getElementById(`${this.activeService}-service-container`);
        const providers = container.querySelectorAll('.medical-provider');
        
        providers.forEach(provider => {
            const name = provider.querySelector('.provider-name').textContent.toLowerCase();
            const specialty = provider.querySelector('.provider-specialty').textContent.toLowerCase();
            const address = provider.querySelector('.provider-address').textContent.toLowerCase();
            
            const matches = name.includes(searchText) || 
                           specialty.includes(searchText) || 
                           address.includes(searchText);
            
            provider.style.display = matches ? 'block' : 'none';
        });
    },

    // Volání poskytovatele
    callProvider(phone) {
        if (!this.activeService) return;
        
        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(`Volám na číslo: ${phone}`, true);
            
            // Simulace odpovědi
            setTimeout(() => {
                addMessage(`Hovor byl úspěšně spojen. Můžete mluvit.`, false);
            }, 1500);
        }
        
        // Přidání XP za volání
        if (typeof UserProgress !== 'undefined') {
            UserProgress.addXP(10, 'Volání poskytovatele ' + this.services[this.activeService].name);
        }
    },

    // Objednání k poskytovateli
    makeAppointment(providerId) {
        if (!this.activeService) return;
        
        const service = this.services[this.activeService];
        const provider = service.providers.find(p => p.id === providerId);
        
        if (!provider) return;
        
        // Vytvoření formuláře pro objednání
        const appointmentForm = document.createElement('div');
        appointmentForm.className = 'appointment-form';
        appointmentForm.innerHTML = `
            <h4>Objednání k ${provider.name}</h4>
            <div class="form-group">
                <label for="appointment-date">Datum</label>
                <input type="date" id="appointment-date" min="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label for="appointment-time">Čas</label>
                <select id="appointment-time">
                    <option value="8:00">8:00</option>
                    <option value="9:00">9:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                </select>
            </div>
            <div class="form-group">
                <label for="appointment-reason">Důvod návštěvy</label>
                <textarea id="appointment-reason" rows="3"></textarea>
            </div>
            <div class="form-actions">
                <button class="appointment-cancel">Zrušit</button>
                <button class="appointment-confirm">Potvrdit</button>
            </div>
        `;
        
        // Nalezení kontejneru
        const container = document.getElementById(`${this.activeService}-service-container`);
        
        // Odstranění existujícího formuláře
        const existingForm = container.querySelector('.appointment-form');
        if (existingForm) {
            existingForm.remove();
        }
        
        // Přidání formuláře
        container.appendChild(appointmentForm);
        
        // Event listener pro zrušení
        appointmentForm.querySelector('.appointment-cancel').addEventListener('click', () => {
            appointmentForm.remove();
        });
        
        // Event listener pro potvrzení
        appointmentForm.querySelector('.appointment-confirm').addEventListener('click', () => {
            const date = appointmentForm.querySelector('#appointment-date').value;
            const time = appointmentForm.querySelector('#appointment-time').value;
            const reason = appointmentForm.querySelector('#appointment-reason').value;
            
            if (!date) {
                alert('Vyberte datum');
                return;
            }
            
            // Přidání zprávy do chatu
            if (typeof addMessage !== 'undefined') {
                const message = `Objednání k ${provider.name} (${provider.specialty})
Datum: ${date}
Čas: ${time}
${reason ? 'Důvod: ' + reason : ''}

Vaše objednání bylo úspěšně zaregistrováno.`;
                
                addMessage(message, false);
            }
            
            // Přidání XP za objednání
            if (typeof UserProgress !== 'undefined') {
                UserProgress.addXP(20, 'Objednání k poskytovateli ' + service.name);
            }
            
            // Odstranění formuláře
            appointmentForm.remove();
            
            // Skrytí služby
            setTimeout(() => {
                this.hideService();
            }, 2000);
        });
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    MedicalServices.init();
});

// Přidání CSS stylů
const medicalServicesStyles = document.createElement('style');
medicalServicesStyles.textContent = `
.medical-service-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;
    max-height: 80vh;
    background-color: var(--card-bg);
    border-radius: 10px;
    z-index: 1001;
    display: none;
    flex-direction: column;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.medical-service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
}

.medical-service-title {
    display: flex;
    align-items: center;
}

.medical-service-icon {
    margin-right: 10px;
    font-size: 24px;
}

.medical-service-title h3 {
    margin: 0;
    font-size: 18px;
    color: var(--text-color);
}

.medical-service-close {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.medical-service-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 20px;
}

.medical-service-search {
    margin-bottom: 20px;
}

.medical-search-input {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg-dark);
    color: var(--text-color);
    font-size: 14px;
}

.medical-providers {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.medical-provider {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 15px;
    transition: transform 0.2s ease;
}

.medical-provider:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.provider-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.provider-name {
    font-weight: bold;
    font-size: 16px;
}

.provider-rating {
    color: #FFD700;
    font-size: 14px;
}

.provider-rating span {
    color: var(--text-color);
    margin-left: 5px;
}

.provider-specialty {
    font-size: 14px;
    margin-bottom: 5px;
    color: var(--primary-color);
}

.provider-address, .provider-hours, .provider-phone {
    font-size: 14px;
    margin-bottom: 5px;
    opacity: 0.8;
}

.provider-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.provider-call-btn, .provider-appointment-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex: 1;
}

.provider-call-btn:hover, .provider-appointment-btn:hover {
    background-color: var(--primary-color-dark);
}

.appointment-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 400px;
    background-color: var(--card-bg);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    z-index: 1002;
}

.appointment-form h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
    text-align: center;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
}

.form-group input, .form-group select, .form-group textarea {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg-dark);
    color: var(--text-color);
    font-size: 14px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.appointment-cancel, .appointment-confirm {
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-weight: bold;
}

.appointment-cancel {
    background-color: #6B7280;
    color: white;
}

.appointment-cancel:hover {
    background-color: #4B5563;
}

.appointment-confirm {
    background-color: var(--primary-color);
    color: white;
}

.appointment-confirm:hover {
    background-color: var(--primary-color-dark);
}
`;

document.head.appendChild(medicalServicesStyles);
