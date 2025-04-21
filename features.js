/**
 * Rozšířené funkce pro AIMapa verze 0.2.9.1
 * Implementace schůzek, nákupních seznamů a dalších užitečných funkcí
 */

// Objekt pro správu rozšířených funkcí
const Features = {
    // Inicializace rozšířených funkcí
    init() {
        this.setupStarsBackground();
        this.setupEventListeners();
        this.setupSuggestionIcons();
    },
    
    // Nastavení posluchačů událostí
    setupEventListeners() {
        // Posluchač pro fullscreen režim
        document.addEventListener('fullscreenToggled', (e) => {
            if (e.detail.isFullscreen) {
                this.createStars();
                this.createShootingStars();
            }
        });
        
        // Posluchač pro přidání nové schůzky
        document.addEventListener('appointmentAdded', (e) => {
            this.showAppointmentNotification(e.detail.appointment);
        });
        
        // Posluchač pro přidání nového nákupního seznamu
        document.addEventListener('shoppingListAdded', (e) => {
            this.showShoppingListNotification(e.detail.shoppingList);
        });
    },
    
    // Nastavení ikon pro návrhy v chatu
    setupSuggestionIcons() {
        // Mapování návrhů na ikony
        this.suggestionIcons = {
            'Přidat aktivitu': '📍',
            'Seznam bodů': '📋',
            'Vypočítat trasu': '🗺️',
            'Nastavení': '⚙️',
            'Otevírací doba': '🕒',
            'Alexa': '💃',
            'Glóbus': '🌎',
            'Nová schůzka': '📅',
            'Nový nákupní seznam': '🛒',
            'Zubař': '🦷',
            'Úřad práce': '📝',
            'Profil': '👤',
            'Úspěchy': '🏆'
        };
    },
    
    // Vytvoření hvězd na pozadí pro fullscreen režim
    setupStarsBackground() {
        // Vytvoření kontejneru pro hvězdy
        const starsContainer = document.createElement('div');
        starsContainer.className = 'stars-container';
        document.body.appendChild(starsContainer);
    },
    
    // Vytvoření hvězd
    createStars() {
        const starsContainer = document.querySelector('.stars-container');
        if (!starsContainer) return;
        
        // Vyčištění kontejneru
        starsContainer.innerHTML = '';
        
        // Vytvoření hvězd
        const starCount = 200;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Náhodná velikost hvězdy
            const size = Math.random();
            if (size > 0.8) {
                star.classList.add('large');
            } else if (size > 0.6) {
                star.classList.add('medium');
            }
            
            // Náhodná pozice hvězdy
            star.style.left = `${Math.random() * windowWidth}px`;
            star.style.top = `${Math.random() * windowHeight}px`;
            
            // Náhodná animace pulzování
            if (Math.random() > 0.7) {
                star.style.animation = `pulse ${2 + Math.random() * 3}s infinite`;
            }
            
            starsContainer.appendChild(star);
        }
    },
    
    // Vytvoření padajících hvězd
    createShootingStars() {
        const starsContainer = document.querySelector('.stars-container');
        if (!starsContainer) return;
        
        // Vytvoření padajících hvězd
        const shootingStarCount = 5;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        for (let i = 0; i < shootingStarCount; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';
            
            // Náhodná pozice hvězdy
            shootingStar.style.left = `${Math.random() * windowWidth}px`;
            shootingStar.style.top = `${Math.random() * (windowHeight / 2)}px`;
            
            // Náhodný úhel
            const angle = Math.random() * 60 + 30; // 30-90 stupňů
            shootingStar.style.transform = `rotate(${angle}deg)`;
            
            // Náhodné zpoždění
            shootingStar.style.setProperty('--delay', Math.random() * 15);
            
            starsContainer.appendChild(shootingStar);
        }
        
        // Opakování padajících hvězd každých 15 sekund
        setTimeout(() => {
            if (document.body.classList.contains('fullscreen-mode')) {
                this.createShootingStars();
            }
        }, 15000);
    },
    
    // Přidání ikony k návrhu v chatu
    addIconToSuggestion(suggestion) {
        const icon = this.suggestionIcons[suggestion] || '💬';
        return `<i>${icon}</i> ${suggestion}`;
    },
    
    // Vytvoření nové schůzky
    createAppointment(type, title, date, location, notes) {
        const appointment = {
            id: Date.now().toString(),
            type,
            title,
            date,
            location,
            notes,
            createdAt: new Date().toISOString()
        };
        
        // Přidání schůzky do profilu uživatele
        if (typeof UserProfiles !== 'undefined') {
            UserProfiles.addAppointment(appointment);
        }
        
        // Vyvolání události o přidání schůzky
        document.dispatchEvent(new CustomEvent('appointmentAdded', {
            detail: { appointment }
        }));
        
        return appointment;
    },
    
    // Vytvoření nového nákupního seznamu
    createShoppingList(title, store, items) {
        const shoppingList = {
            id: Date.now().toString(),
            title,
            store,
            items,
            createdAt: new Date().toISOString(),
            completed: false
        };
        
        // Přidání nákupního seznamu do profilu uživatele
        if (typeof UserProfiles !== 'undefined') {
            UserProfiles.addShoppingList(shoppingList);
        }
        
        // Vyvolání události o přidání nákupního seznamu
        document.dispatchEvent(new CustomEvent('shoppingListAdded', {
            detail: { shoppingList }
        }));
        
        return shoppingList;
    },
    
    // Zobrazení oznámení o nové schůzce
    showAppointmentNotification(appointment) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${appointment.type === 'dentist' ? '🦷' : appointment.type === 'job_office' ? '📝' : '📅'}</div>
            <div class="achievement-content">
                <h3>Nová schůzka přidána</h3>
                <h4>${appointment.title}</h4>
                <p>${new Date(appointment.date).toLocaleDateString('cs-CZ')} - ${appointment.location}</p>
            </div>
        `;
        
        // Přidání oznámení do dokumentu
        document.body.appendChild(notification);
        
        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Automatické skrytí po 5 sekundách
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    },
    
    // Zobrazení oznámení o novém nákupním seznamu
    showShoppingListNotification(shoppingList) {
        // Vytvoření elementu pro oznámení
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🛒</div>
            <div class="achievement-content">
                <h3>Nový nákupní seznam</h3>
                <h4>${shoppingList.title}</h4>
                <p>${shoppingList.store} - ${shoppingList.items.length} položek</p>
            </div>
        `;
        
        // Přidání oznámení do dokumentu
        document.body.appendChild(notification);
        
        // Animace zobrazení
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Automatické skrytí po 5 sekundách
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 5000);
    },
    
    // Vytvoření dialogu pro přidání schůzky
    createAppointmentDialog() {
        // Vytvoření elementu pro dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog appointment-dialog';
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Nová schůzka</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Typ schůzky</label>
                        <select id="appointmentType" class="form-select">
                            <option value="dentist">Zubař</option>
                            <option value="job_office">Úřad práce</option>
                            <option value="doctor">Lékař</option>
                            <option value="other">Jiné</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Název</label>
                        <input type="text" id="appointmentTitle" class="form-input" placeholder="Název schůzky">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Datum a čas</label>
                        <input type="datetime-local" id="appointmentDate" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Místo</label>
                        <input type="text" id="appointmentLocation" class="form-input" placeholder="Adresa nebo místo">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Poznámky</label>
                        <textarea id="appointmentNotes" class="form-textarea" placeholder="Další informace"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="cancelAppointment" class="btn btn-ghost">Zrušit</button>
                    <button id="saveAppointment" class="btn btn-primary">Uložit</button>
                </div>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Nastavení posluchačů událostí
        const closeButton = dialog.querySelector('.close-button');
        const cancelButton = dialog.querySelector('#cancelAppointment');
        const saveButton = dialog.querySelector('#saveAppointment');
        
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        cancelButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        saveButton.addEventListener('click', () => {
            const type = dialog.querySelector('#appointmentType').value;
            const title = dialog.querySelector('#appointmentTitle').value;
            const date = dialog.querySelector('#appointmentDate').value;
            const location = dialog.querySelector('#appointmentLocation').value;
            const notes = dialog.querySelector('#appointmentNotes').value;
            
            if (!title || !date || !location) {
                alert('Vyplňte prosím všechna povinná pole.');
                return;
            }
            
            this.createAppointment(type, title, date, location, notes);
            dialog.remove();
        });
        
        // Nastavení výchozího data na aktuální datum a čas
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        dialog.querySelector('#appointmentDate').value = `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    
    // Vytvoření dialogu pro přidání nákupního seznamu
    createShoppingListDialog() {
        // Vytvoření elementu pro dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog shopping-list-dialog';
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Nový nákupní seznam</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Název</label>
                        <input type="text" id="shoppingListTitle" class="form-input" placeholder="Název nákupního seznamu">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Obchod</label>
                        <select id="shoppingListStore" class="form-select">
                            <option value="Kaufland">Kaufland</option>
                            <option value="Albert">Albert</option>
                            <option value="Lidl">Lidl</option>
                            <option value="Tesco">Tesco</option>
                            <option value="Jiný">Jiný</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Položky</label>
                        <div id="shoppingListItems">
                            <div class="shopping-list-item-input">
                                <input type="text" class="form-input item-name" placeholder="Název položky">
                                <input type="number" class="form-input item-quantity" placeholder="Množství" min="1" value="1">
                                <select class="form-select item-unit">
                                    <option value="ks">ks</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="l">l</option>
                                    <option value="ml">ml</option>
                                </select>
                                <button class="btn btn-ghost btn-icon remove-item">×</button>
                            </div>
                        </div>
                        <button id="addShoppingListItem" class="btn btn-outline mt-2">Přidat položku</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="cancelShoppingList" class="btn btn-ghost">Zrušit</button>
                    <button id="saveShoppingList" class="btn btn-primary">Uložit</button>
                </div>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Nastavení posluchačů událostí
        const closeButton = dialog.querySelector('.close-button');
        const cancelButton = dialog.querySelector('#cancelShoppingList');
        const saveButton = dialog.querySelector('#saveShoppingList');
        const addItemButton = dialog.querySelector('#addShoppingListItem');
        
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        cancelButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        // Přidání nové položky do seznamu
        addItemButton.addEventListener('click', () => {
            const itemsContainer = dialog.querySelector('#shoppingListItems');
            const newItem = document.createElement('div');
            newItem.className = 'shopping-list-item-input';
            newItem.innerHTML = `
                <input type="text" class="form-input item-name" placeholder="Název položky">
                <input type="number" class="form-input item-quantity" placeholder="Množství" min="1" value="1">
                <select class="form-select item-unit">
                    <option value="ks">ks</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">l</option>
                    <option value="ml">ml</option>
                </select>
                <button class="btn btn-ghost btn-icon remove-item">×</button>
            `;
            
            itemsContainer.appendChild(newItem);
            
            // Přidání posluchače pro odstranění položky
            newItem.querySelector('.remove-item').addEventListener('click', () => {
                newItem.remove();
            });
        });
        
        // Přidání posluchače pro odstranění první položky
        dialog.querySelector('.remove-item').addEventListener('click', (e) => {
            const itemsContainer = dialog.querySelector('#shoppingListItems');
            if (itemsContainer.children.length > 1) {
                e.target.closest('.shopping-list-item-input').remove();
            }
        });
        
        saveButton.addEventListener('click', () => {
            const title = dialog.querySelector('#shoppingListTitle').value;
            const store = dialog.querySelector('#shoppingListStore').value;
            
            if (!title) {
                alert('Vyplňte prosím název nákupního seznamu.');
                return;
            }
            
            // Získání všech položek
            const itemElements = dialog.querySelectorAll('.shopping-list-item-input');
            const items = [];
            
            itemElements.forEach(itemElement => {
                const name = itemElement.querySelector('.item-name').value;
                const quantity = itemElement.querySelector('.item-quantity').value;
                const unit = itemElement.querySelector('.item-unit').value;
                
                if (name) {
                    items.push({
                        name,
                        quantity,
                        unit,
                        checked: false
                    });
                }
            });
            
            if (items.length === 0) {
                alert('Přidejte prosím alespoň jednu položku do seznamu.');
                return;
            }
            
            this.createShoppingList(title, store, items);
            dialog.remove();
        });
    },
    
    // Zobrazení seznamu schůzek
    showAppointmentsList() {
        if (typeof UserProfiles === 'undefined') return;
        
        const appointments = UserProfiles.getAppointments();
        
        // Vytvoření elementu pro dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog appointments-list-dialog';
        
        let appointmentsHtml = '';
        
        if (appointments.length === 0) {
            appointmentsHtml = '<p class="text-center">Nemáte žádné naplánované schůzky.</p>';
        } else {
            // Seřazení schůzek podle data
            appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Vytvoření HTML pro každou schůzku
            appointmentsHtml = appointments.map(appointment => {
                const date = new Date(appointment.date).toLocaleDateString('cs-CZ');
                const time = new Date(appointment.date).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
                const icon = appointment.type === 'dentist' ? '🦷' : appointment.type === 'job_office' ? '📝' : '📅';
                
                return `
                    <div class="appointment-item" data-id="${appointment.id}">
                        <div class="appointment-icon">${icon}</div>
                        <div class="appointment-details">
                            <div class="appointment-title">${appointment.title}</div>
                            <div class="appointment-date">${date} ${time} - ${appointment.location}</div>
                        </div>
                        <div class="appointment-actions">
                            <button class="appointment-action-btn edit-appointment" title="Upravit">✏️</button>
                            <button class="appointment-action-btn delete-appointment" title="Smazat">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Moje schůzky</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="appointments-container">
                        ${appointmentsHtml}
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="addNewAppointment" class="btn btn-primary">Přidat novou schůzku</button>
                </div>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Nastavení posluchačů událostí
        const closeButton = dialog.querySelector('.close-button');
        const addNewButton = dialog.querySelector('#addNewAppointment');
        
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        addNewButton.addEventListener('click', () => {
            dialog.remove();
            this.createAppointmentDialog();
        });
        
        // Přidání posluchačů pro tlačítka smazání
        dialog.querySelectorAll('.delete-appointment').forEach(button => {
            button.addEventListener('click', (e) => {
                const appointmentId = e.target.closest('.appointment-item').dataset.id;
                if (confirm('Opravdu chcete smazat tuto schůzku?')) {
                    UserProfiles.removeAppointment(appointmentId);
                    e.target.closest('.appointment-item').remove();
                    
                    // Kontrola, zda jsou ještě nějaké schůzky
                    const appointmentsContainer = dialog.querySelector('.appointments-container');
                    if (appointmentsContainer.children.length === 0) {
                        appointmentsContainer.innerHTML = '<p class="text-center">Nemáte žádné naplánované schůzky.</p>';
                    }
                }
            });
        });
    },
    
    // Zobrazení seznamu nákupních seznamů
    showShoppingLists() {
        if (typeof UserProfiles === 'undefined') return;
        
        const shoppingLists = UserProfiles.getShoppingLists();
        
        // Vytvoření elementu pro dialog
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog shopping-lists-dialog';
        
        let shoppingListsHtml = '';
        
        if (shoppingLists.length === 0) {
            shoppingListsHtml = '<p class="text-center">Nemáte žádné nákupní seznamy.</p>';
        } else {
            // Seřazení nákupních seznamů podle data vytvoření
            shoppingLists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Vytvoření HTML pro každý nákupní seznam
            shoppingListsHtml = shoppingLists.map(shoppingList => {
                const itemCount = shoppingList.items.length;
                const completedCount = shoppingList.items.filter(item => item.checked).length;
                
                return `
                    <div class="shopping-list-item" data-id="${shoppingList.id}">
                        <div class="shopping-list-icon">🛒</div>
                        <div class="shopping-list-details">
                            <div class="shopping-list-title">${shoppingList.title}</div>
                            <div class="shopping-list-count">${shoppingList.store} - ${completedCount}/${itemCount} položek</div>
                        </div>
                        <div class="shopping-list-actions">
                            <button class="shopping-list-action-btn view-shopping-list" title="Zobrazit">👁️</button>
                            <button class="shopping-list-action-btn delete-shopping-list" title="Smazat">🗑️</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        dialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Moje nákupní seznamy</h3>
                    <button class="close-button">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="shopping-lists-container">
                        ${shoppingListsHtml}
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="addNewShoppingList" class="btn btn-primary">Přidat nový seznam</button>
                </div>
            </div>
        `;
        
        // Přidání dialogu do dokumentu
        document.body.appendChild(dialog);
        
        // Nastavení posluchačů událostí
        const closeButton = dialog.querySelector('.close-button');
        const addNewButton = dialog.querySelector('#addNewShoppingList');
        
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });
        
        addNewButton.addEventListener('click', () => {
            dialog.remove();
            this.createShoppingListDialog();
        });
        
        // Přidání posluchačů pro tlačítka smazání
        dialog.querySelectorAll('.delete-shopping-list').forEach(button => {
            button.addEventListener('click', (e) => {
                const shoppingListId = e.target.closest('.shopping-list-item').dataset.id;
                if (confirm('Opravdu chcete smazat tento nákupní seznam?')) {
                    UserProfiles.removeShoppingList(shoppingListId);
                    e.target.closest('.shopping-list-item').remove();
                    
                    // Kontrola, zda jsou ještě nějaké nákupní seznamy
                    const shoppingListsContainer = dialog.querySelector('.shopping-lists-container');
                    if (shoppingListsContainer.children.length === 0) {
                        shoppingListsContainer.innerHTML = '<p class="text-center">Nemáte žádné nákupní seznamy.</p>';
                    }
                }
            });
        });
    }
};

// Inicializace rozšířených funkcí po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    Features.init();
});

// Export objektu pro použití v jiných souborech
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Features;
}
