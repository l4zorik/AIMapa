/**
 * Modul pro služby jídla a pití
 * Verze 0.2.8.7.8
 */

const FoodServices = {
    // Stav modulu
    isInitialized: false,
    activeService: null,

    // Dostupné služby
    services: {
        food: {
            name: 'Jídlo a pití',
            icon: '🍔',
            description: 'Vyhledá restaurace a bary v okolí',
            items: [
                { id: 'burger', name: 'Hamburger', price: '129 Kč', description: 'Šťavnatý hovězí burger s čedarem a domácí omáčkou', image: 'https://via.placeholder.com/100x100?text=Burger' },
                { id: 'pizza-small', name: 'Pizza Margherita (malá)', price: '149 Kč', description: 'Klasická italská pizza s rajčaty a mozzarellou', image: 'https://via.placeholder.com/100x100?text=Pizza' },
                { id: 'salad', name: 'Caesar salát', price: '119 Kč', description: 'Čerstvý salát s kuřecím masem, krutony a dresinkem', image: 'https://via.placeholder.com/100x100?text=Salad' },
                { id: 'pasta', name: 'Těstoviny Carbonara', price: '139 Kč', description: 'Spaghetti s vajíčkem, slaninou a sýrem pecorino', image: 'https://via.placeholder.com/100x100?text=Pasta' },
                { id: 'beer', name: 'Pivo 0,5l', price: '45 Kč', description: 'Čepované pivo Pilsner Urquell', image: 'https://via.placeholder.com/100x100?text=Beer' },
                { id: 'wine', name: 'Víno 0,2l', price: '65 Kč', description: 'Bílé víno Chardonnay', image: 'https://via.placeholder.com/100x100?text=Wine' }
            ]
        },
        pizza: {
            name: 'Pizza',
            icon: '🍕',
            description: 'Nabídka pizzerií v okolí',
            items: [
                { id: 'margherita', name: 'Pizza Margherita', price: '169 Kč', description: 'Rajčatový základ, mozzarella, bazalka', image: 'https://via.placeholder.com/100x100?text=Margherita' },
                { id: 'salami', name: 'Pizza Salami', price: '189 Kč', description: 'Rajčatový základ, mozzarella, salám', image: 'https://via.placeholder.com/100x100?text=Salami' },
                { id: 'prosciutto', name: 'Pizza Prosciutto', price: '199 Kč', description: 'Rajčatový základ, mozzarella, parmská šunka, rukola', image: 'https://via.placeholder.com/100x100?text=Prosciutto' },
                { id: 'quattro', name: 'Pizza Quattro Formaggi', price: '209 Kč', description: 'Smetanový základ, čtyři druhy sýrů', image: 'https://via.placeholder.com/100x100?text=Quattro' },
                { id: 'hawaii', name: 'Pizza Hawaii', price: '189 Kč', description: 'Rajčatový základ, mozzarella, šunka, ananas', image: 'https://via.placeholder.com/100x100?text=Hawaii' },
                { id: 'diavola', name: 'Pizza Diavola', price: '199 Kč', description: 'Rajčatový základ, mozzarella, pikantní salám, chilli', image: 'https://via.placeholder.com/100x100?text=Diavola' }
            ]
        },
        energyDrink: {
            name: 'Energy drinky',
            icon: '🥤',
            description: 'Nabídka energy drinků z eshopu podpultovky.cz',
            items: [
                { id: 'monster', name: 'Monster Energy 500ml', price: '39 Kč', description: 'Klasický energetický nápoj Monster', image: 'https://via.placeholder.com/100x100?text=Monster' },
                { id: 'redbull', name: 'Red Bull 250ml', price: '35 Kč', description: 'Energetický nápoj Red Bull', image: 'https://via.placeholder.com/100x100?text=RedBull' },
                { id: 'bigshock', name: 'Big Shock! 500ml', price: '29 Kč', description: 'Energetický nápoj Big Shock!', image: 'https://via.placeholder.com/100x100?text=BigShock' },
                { id: 'semtex', name: 'Semtex 500ml', price: '29 Kč', description: 'Energetický nápoj Semtex', image: 'https://via.placeholder.com/100x100?text=Semtex' },
                { id: 'tiger', name: 'Tiger Energy 500ml', price: '25 Kč', description: 'Energetický nápoj Tiger', image: 'https://via.placeholder.com/100x100?text=Tiger' },
                { id: 'rockstar', name: 'Rockstar 500ml', price: '39 Kč', description: 'Energetický nápoj Rockstar', image: 'https://via.placeholder.com/100x100?text=Rockstar' }
            ]
        },
        meat: {
            name: 'Maso',
            icon: '🥩',
            description: 'Nabídka masa - krkovička',
            items: [
                { id: 'krkovicka', name: 'Vepřová krkovička 1kg', price: '159 Kč', description: 'Čerstvá vepřová krkovička s kostí', image: 'https://via.placeholder.com/100x100?text=Krkovicka' },
                { id: 'krkovicka-bez', name: 'Vepřová krkovička bez kosti 1kg', price: '189 Kč', description: 'Čerstvá vepřová krkovička bez kosti', image: 'https://via.placeholder.com/100x100?text=KrkovickaBezKosti' },
                { id: 'krkovicka-plat', name: 'Vepřová krkovička plátky 500g', price: '109 Kč', description: 'Čerstvá vepřová krkovička nakrájená na plátky', image: 'https://via.placeholder.com/100x100?text=KrkovickaPlátky' },
                { id: 'krkovicka-kost', name: 'Uzená krkovička 1kg', price: '199 Kč', description: 'Uzená vepřová krkovička', image: 'https://via.placeholder.com/100x100?text=UzenáKrkovicka' },
                { id: 'krkovicka-mar', name: 'Marinovaná krkovička 500g', price: '119 Kč', description: 'Marinovaná vepřová krkovička na gril', image: 'https://via.placeholder.com/100x100?text=MarinovanáKrkovicka' },
                { id: 'krkovicka-bio', name: 'BIO vepřová krkovička 1kg', price: '259 Kč', description: 'BIO vepřová krkovička z lokálního chovu', image: 'https://via.placeholder.com/100x100?text=BIOKrkovicka' }
            ]
        }
    },

    // Inicializace modulu
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializace modulu služeb jídla a pití...');
        
        // Vytvoření HTML struktury pro služby
        this.createServiceContainers();
        
        // Přidání event listenerů
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Modul služeb jídla a pití byl inicializován');
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
            container.className = 'service-container';
            container.style.display = 'none';
            
            // Vytvoření hlavičky
            const header = document.createElement('div');
            header.className = 'service-header';
            header.innerHTML = `
                <div class="service-title">
                    <span class="service-icon">${service.icon}</span>
                    <h3>${service.name}</h3>
                </div>
                <button class="service-close">&times;</button>
            `;
            
            // Vytvoření obsahu
            const content = document.createElement('div');
            content.className = 'service-content';
            
            // Přidání položek
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'service-items';
            
            service.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'service-item';
                itemElement.dataset.id = item.id;
                
                itemElement.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-description">${item.description}</div>
                        <div class="item-price">${item.price}</div>
                    </div>
                    <button class="item-add-btn" data-id="${item.id}">Přidat</button>
                `;
                
                itemsContainer.appendChild(itemElement);
            });
            
            content.appendChild(itemsContainer);
            
            // Vytvoření košíku
            const cart = document.createElement('div');
            cart.className = 'service-cart';
            cart.innerHTML = `
                <h4>Košík</h4>
                <div class="cart-items"></div>
                <div class="cart-total">Celkem: <span>0 Kč</span></div>
                <button class="cart-order-btn">Objednat</button>
            `;
            
            content.appendChild(cart);
            
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
            if (e.target.matches('.service-close')) {
                this.hideService();
            }
        });
        
        // Event listener pro přidání položky do košíku
        document.addEventListener('click', (e) => {
            if (e.target.matches('.item-add-btn')) {
                const itemId = e.target.dataset.id;
                this.addToCart(itemId);
            }
        });
        
        // Event listener pro objednání
        document.addEventListener('click', (e) => {
            if (e.target.matches('.cart-order-btn')) {
                this.placeOrder();
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
        document.querySelectorAll('.service-container').forEach(container => {
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
                addMessage(`Zobrazuji nabídku: ${this.services[serviceId].name}`, false);
            }
        }
    },

    // Skrytí služby
    hideService() {
        document.querySelectorAll('.service-container').forEach(container => {
            container.style.display = 'none';
        });
        
        this.activeService = null;
    },

    // Přidání položky do košíku
    addToCart(itemId) {
        if (!this.activeService) return;
        
        const service = this.services[this.activeService];
        const item = service.items.find(item => item.id === itemId);
        
        if (!item) return;
        
        // Nalezení košíku
        const container = document.getElementById(`${this.activeService}-service-container`);
        const cartItems = container.querySelector('.cart-items');
        
        // Kontrola, zda položka již v košíku je
        let cartItem = cartItems.querySelector(`.cart-item[data-id="${itemId}"]`);
        
        if (cartItem) {
            // Zvýšení počtu
            const countElement = cartItem.querySelector('.cart-item-count');
            let count = parseInt(countElement.textContent);
            count++;
            countElement.textContent = count;
        } else {
            // Přidání nové položky
            cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.id = itemId;
            cartItem.dataset.price = parseInt(item.price);
            
            cartItem.innerHTML = `
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-controls">
                    <button class="cart-item-minus">-</button>
                    <span class="cart-item-count">1</span>
                    <button class="cart-item-plus">+</button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
            
            // Přidání event listenerů pro tlačítka + a -
            cartItem.querySelector('.cart-item-minus').addEventListener('click', () => {
                this.updateCartItemCount(itemId, -1);
            });
            
            cartItem.querySelector('.cart-item-plus').addEventListener('click', () => {
                this.updateCartItemCount(itemId, 1);
            });
        }
        
        // Aktualizace celkové ceny
        this.updateCartTotal();
    },

    // Aktualizace počtu položek v košíku
    updateCartItemCount(itemId, change) {
        if (!this.activeService) return;
        
        // Nalezení košíku
        const container = document.getElementById(`${this.activeService}-service-container`);
        const cartItem = container.querySelector(`.cart-item[data-id="${itemId}"]`);
        
        if (!cartItem) return;
        
        // Aktualizace počtu
        const countElement = cartItem.querySelector('.cart-item-count');
        let count = parseInt(countElement.textContent);
        count += change;
        
        if (count <= 0) {
            // Odstranění položky
            cartItem.remove();
        } else {
            // Aktualizace počtu
            countElement.textContent = count;
        }
        
        // Aktualizace celkové ceny
        this.updateCartTotal();
    },

    // Aktualizace celkové ceny
    updateCartTotal() {
        if (!this.activeService) return;
        
        // Nalezení košíku
        const container = document.getElementById(`${this.activeService}-service-container`);
        const cartItems = container.querySelectorAll('.cart-item');
        const totalElement = container.querySelector('.cart-total span');
        
        // Výpočet celkové ceny
        let total = 0;
        
        cartItems.forEach(item => {
            const price = parseInt(item.dataset.price);
            const count = parseInt(item.querySelector('.cart-item-count').textContent);
            total += price * count;
        });
        
        // Aktualizace celkové ceny
        totalElement.textContent = `${total} Kč`;
    },

    // Objednání
    placeOrder() {
        if (!this.activeService) return;
        
        // Nalezení košíku
        const container = document.getElementById(`${this.activeService}-service-container`);
        const cartItems = container.querySelectorAll('.cart-item');
        const totalElement = container.querySelector('.cart-total span');
        
        // Kontrola, zda je košík prázdný
        if (cartItems.length === 0) {
            alert('Košík je prázdný');
            return;
        }
        
        // Vytvoření seznamu položek
        const items = [];
        
        cartItems.forEach(item => {
            const id = item.dataset.id;
            const count = parseInt(item.querySelector('.cart-item-count').textContent);
            const name = item.querySelector('.cart-item-name').textContent;
            
            items.push({ id, name, count });
        });
        
        // Získání celkové ceny
        const total = totalElement.textContent;
        
        // Vytvoření zprávy
        let message = `Objednávka z ${this.services[this.activeService].name}:\n`;
        
        items.forEach(item => {
            message += `- ${item.name} (${item.count}x)\n`;
        });
        
        message += `\nCelkem: ${total}`;
        
        // Přidání zprávy do chatu
        if (typeof addMessage !== 'undefined') {
            addMessage(message, true);
        }
        
        // Přidání XP za objednání
        if (typeof UserProgress !== 'undefined') {
            const xpAmount = Math.min(Math.floor(parseInt(total) / 10), 50);
            UserProgress.addXP(xpAmount, 'Objednávka z ' + this.services[this.activeService].name);
        }
        
        // Vyčištění košíku
        container.querySelector('.cart-items').innerHTML = '';
        this.updateCartTotal();
        
        // Skrytí služby
        setTimeout(() => {
            this.hideService();
        }, 2000);
    }
};

// Inicializace modulu po načtení dokumentu
document.addEventListener('DOMContentLoaded', () => {
    FoodServices.init();
});

// Přidání CSS stylů
const foodServicesStyles = document.createElement('style');
foodServicesStyles.textContent = `
.service-container {
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

.service-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border-color);
}

.service-title {
    display: flex;
    align-items: center;
}

.service-icon {
    margin-right: 10px;
    font-size: 24px;
}

.service-title h3 {
    margin: 0;
    font-size: 18px;
    color: var(--text-color);
}

.service-close {
    background: none;
    border: none;
    color: var(--text-color);
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
}

.service-content {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.service-items {
    flex: 3;
    padding: 20px;
    overflow-y: auto;
    max-height: calc(80vh - 60px);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
}

.service-item {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease;
}

.service-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.item-image {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
}

.item-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

.item-info {
    flex: 1;
}

.item-name {
    font-weight: bold;
    margin-bottom: 5px;
}

.item-description {
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 10px;
}

.item-price {
    font-weight: bold;
    color: var(--primary-color);
    margin-bottom: 10px;
}

.item-add-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.item-add-btn:hover {
    background-color: var(--primary-color-dark);
}

.service-cart {
    flex: 1;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.1);
    border-left: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
}

.service-cart h4 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 16px;
}

.cart-items {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 15px;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
}

.cart-item-name {
    flex: 2;
    font-size: 14px;
}

.cart-item-price {
    flex: 1;
    text-align: right;
    font-size: 14px;
}

.cart-item-controls {
    display: flex;
    align-items: center;
    margin-left: 10px;
}

.cart-item-minus,
.cart-item-plus {
    background-color: var(--primary-color);
    color: white;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;
}

.cart-item-minus:hover,
.cart-item-plus:hover {
    background-color: var(--primary-color-dark);
}

.cart-item-count {
    margin: 0 8px;
    font-size: 14px;
}

.cart-total {
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 16px;
}

.cart-order-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-weight: bold;
}

.cart-order-btn:hover {
    background-color: var(--primary-color-dark);
}
`;

document.head.appendChild(foodServicesStyles);
