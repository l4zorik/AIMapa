/**
 * Role Manager pro AIMapa
 * Verze 0.3.8.5
 */

const RoleManager = {
    // Stav
    state: {
        currentUser: null,
        roles: [],
        permissions: []
    },

    // Inicializace
    async init() {
        try {
            // Získání stavu uživatele z Auth0
            if (typeof Auth0Auth !== 'undefined') {
                const { data } = await Auth0Auth.getUser();
                if (data?.user) {
                    this.state.currentUser = data.user;
                    this.state.roles = data.user['https://aimapa.cz/roles'] || ['guest'];
                    this.state.permissions = data.user['https://aimapa.cz/permissions'] || [];
                }
            }

            // Nastavení posluchačů událostí
            this.setupEventListeners();
            
            return true;
        } catch (error) {
            console.error('Chyba při inicializaci Role Manageru:', error);
            return false;
        }
    },

    // Nastavení posluchačů událostí
    setupEventListeners() {
        document.addEventListener('authStateChanged', this.handleAuthStateChange.bind(this));
        document.addEventListener('roleChanged', this.handleRoleChange.bind(this));
    },

    // Handler pro změnu stavu autentizace
    async handleAuthStateChange(event) {
        const { isLoggedIn, user } = event.detail;
        if (isLoggedIn && user) {
            this.state.currentUser = user;
            this.state.roles = user['https://aimapa.cz/roles'] || ['guest'];
            this.state.permissions = user['https://aimapa.cz/permissions'] || [];
            this.updateUI();
        } else {
            this.state.currentUser = null;
            this.state.roles = ['guest'];
            this.state.permissions = [];
            this.updateUI();
        }
    },

    // Handler pro změnu role
    async handleRoleChange(event) {
        const { userId, newRoles } = event.detail;
        if (userId === this.state.currentUser?.sub) {
            try {
                const response = await fetch('/api/user/roles', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ roles: newRoles })
                });

                if (!response.ok) {
                    throw new Error('Nepodařilo se aktualizovat role');
                }

                const data = await response.json();
                this.state.roles = data.roles;
                this.state.permissions = data.permissions;
                this.updateUI();
            } catch (error) {
                console.error('Chyba při aktualizaci rolí:', error);
                this.showError('Nepodařilo se aktualizovat role');
            }
        }
    },

    // Kontrola role
    hasRole(role) {
        return this.state.roles.includes(role) || this.state.roles.includes('admin');
    },

    // Kontrola oprávnění
    hasPermission(permission) {
        return this.state.permissions.includes(permission) || 
               this.state.permissions.includes('write:all') ||
               this.state.roles.includes('admin');
    },

    // Kontrola vlastnictví zdroje
    isOwner(resourceUserId) {
        return this.state.currentUser?.sub === resourceUserId;
    },

    // Aktualizace UI podle rolí a oprávnění
    updateUI() {
        // Aktualizace viditelnosti prvků podle rolí
        document.querySelectorAll('[data-requires-role]').forEach(element => {
            const requiredRole = element.dataset.requiresRole;
            element.style.display = this.hasRole(requiredRole) ? '' : 'none';
        });

        // Aktualizace viditelnosti prvků podle oprávnění
        document.querySelectorAll('[data-requires-permission]').forEach(element => {
            const requiredPermission = element.dataset.requiresPermission;
            element.style.display = this.hasPermission(requiredPermission) ? '' : 'none';
        });

        // Aktualizace uživatelského menu
        this.updateUserMenu();
    },

    // Aktualizace uživatelského menu
    updateUserMenu() {
        const userMenu = document.getElementById('user-menu');
        if (!userMenu) return;

        if (this.state.currentUser) {
            userMenu.innerHTML = `
                <div class="user-info">
                    <img src="${this.state.currentUser.picture}" alt="Avatar" class="avatar">
                    <span>${this.state.currentUser.name}</span>
                </div>
                <div class="user-roles">
                    ${this.state.roles.map(role => `
                        <span class="role-badge ${role}">${role}</span>
                    `).join('')}
                </div>
            `;
        } else {
            userMenu.innerHTML = `
                <button onclick="Auth0Auth.login()">Přihlásit se</button>
            `;
        }
    },

    // Zobrazení chybové zprávy
    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
        setTimeout(() => errorElement.remove(), 3000);
    }
};

// Export pro použití v jiných modulech
window.RoleManager = RoleManager;