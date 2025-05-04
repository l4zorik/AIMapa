/**
 * Admin Dashboard pro AIMapa
 * Verze 0.3.8.5
 */

const AdminDashboard = {
    state: {
        metrics: null,
        users: [],
        selectedUser: null,
        loading: false,
        error: null
    },

    async init() {
        try {
            // Kontrola admin oprávnění
            if (!RoleManager.hasRole('admin')) {
                throw new Error('Nedostatečná oprávnění pro přístup k admin dashboardu');
            }

            await this.setupDashboard();
            this.setupEventListeners();
            await this.loadInitialData();
            
            return true;
        } catch (error) {
            console.error('Chyba při inicializaci admin dashboardu:', error);
            this.showError(error.message);
            return false;
        }
    },

    async setupDashboard() {
        const dashboard = document.createElement('div');
        dashboard.id = 'admin-dashboard';
        dashboard.innerHTML = `
            <div class="admin-header">
                <h1>Administrace</h1>
                <div class="admin-actions">
                    <button id="refresh-metrics">Obnovit metriky</button>
                    <button id="export-logs">Exportovat logy</button>
                </div>
            </div>
            <div class="admin-content">
                <div class="metrics-panel">
                    <h2>Metriky aplikace</h2>
                    <div id="metrics-content"></div>
                </div>
                <div class="users-panel">
                    <h2>Správa uživatelů</h2>
                    <div id="users-list"></div>
                </div>
            </div>
            <div id="error-message" class="error-message" style="display: none;"></div>
        `;

        document.body.appendChild(dashboard);
    },

    setupEventListeners() {
        document.getElementById('refresh-metrics')
            .addEventListener('click', () => this.loadMetrics());
        
        document.getElementById('export-logs')
            .addEventListener('click', () => this.exportLogs());

        // Delegace událostí pro uživatelský seznam
        document.getElementById('users-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-user')) {
                const userId = e.target.dataset.userId;
                this.editUser(userId);
            }
            if (e.target.classList.contains('change-role')) {
                const userId = e.target.dataset.userId;
                const role = e.target.dataset.role;
                this.changeUserRole(userId, role);
            }
        });
    },

    async loadInitialData() {
        this.setLoading(true);
        try {
            await Promise.all([
                this.loadMetrics(),
                this.loadUsers()
            ]);
        } catch (error) {
            this.showError('Chyba při načítání dat: ' + error.message);
        } finally {
            this.setLoading(false);
        }
    },

    async loadMetrics() {
        try {
            const response = await fetch('/metrics');
            if (!response.ok) throw new Error('Nepodařilo se načíst metriky');
            
            const metrics = await response.json();
            this.state.metrics = metrics;
            this.renderMetrics();
        } catch (error) {
            this.showError('Chyba při načítání metrik: ' + error.message);
        }
    },

    async loadUsers() {
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Nepodařilo se načíst uživatele');
            
            const users = await response.json();
            this.state.users = users;
            this.renderUsers();
        } catch (error) {
            this.showError('Chyba při načítání uživatelů: ' + error.message);
        }
    },

    async changeUserRole(userId, newRole) {
        try {
            const response = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!response.ok) throw new Error('Nepodařilo se změnit roli uživatele');
            
            await this.loadUsers(); // Obnovení seznamu uživatelů
            this.showSuccess(`Role uživatele byla změněna na ${newRole}`);
        } catch (error) {
            this.showError('Chyba při změně role: ' + error.message);
        }
    },

    async exportLogs() {
        try {
            const response = await fetch('/api/admin/logs/export');
            if (!response.ok) throw new Error('Nepodařilo se exportovat logy');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `aimapa-logs-${new Date().toISOString()}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            this.showError('Chyba při exportu logů: ' + error.message);
        }
    },

    renderMetrics() {
        if (!this.state.metrics) return;

        const metricsContent = document.getElementById('metrics-content');
        const { api, users, routes } = this.state.metrics;

        metricsContent.innerHTML = `
            <div class="metrics-grid">
                <div class="metric-card">
                    <h3>API Metriky</h3>
                    <p>Celkem požadavků: ${api.totalRequests}</p>
                    <p>Průměrná odezva: ${api.avgResponseTime}ms</p>
                    <p>Chybovost: ${api.errorRate}%</p>
                    <h4>Populární endpointy:</h4>
                    <ul>
                        ${Object.entries(api.popularEndpoints)
                            .map(([endpoint, count]) => 
                                `<li>${endpoint}: ${count}x</li>`
                            ).join('')}
                    </ul>
                </div>
                <div class="metric-card">
                    <h3>Uživatelské metriky</h3>
                    <p>Aktivní uživatelé: ${users.activeUsers}</p>
                    <div id="user-activity-chart"></div>
                </div>
                <div class="metric-card">
                    <h3>Metriky tras</h3>
                    <p>Celkem tras: ${routes.totalRoutes}</p>
                    <h4>Poslední aktivita:</h4>
                    <ul>
                        ${routes.recentActivity
                            .map(activity => 
                                `<li>${activity.method} ${activity.path} (${new Date(activity.timestamp).toLocaleString()})</li>`
                            ).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Vykreslení grafu uživatelské aktivity
        this.renderUserActivityChart(users.userActivity);
    },

    renderUsers() {
        const usersList = document.getElementById('users-list');
        usersList.innerHTML = `
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Jméno</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Poslední přihlášení</th>
                        <th>Akce</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.state.users.map(user => `
                        <tr>
                            <td><img src="${user.picture}" alt="Avatar" class="user-avatar"></td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>
                                <select class="role-select" data-user-id="${user.auth0_id}">
                                    ${['admin', 'moderator', 'user'].map(role => `
                                        <option value="${role}" ${user.roles.includes(role) ? 'selected' : ''}>
                                            ${role}
                                        </option>
                                    `).join('')}
                                </select>
                            </td>
                            <td>${new Date(user.last_login).toLocaleString()}</td>
                            <td>
                                <button class="edit-user" data-user-id="${user.auth0_id}">
                                    Upravit
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        // Přidání event listenerů pro změnu role
        document.querySelectorAll('.role-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const userId = e.target.dataset.userId;
                const newRole = e.target.value;
                this.changeUserRole(userId, newRole);
            });
        });
    },

    renderUserActivityChart(activity) {
        // Implementace grafu pomocí Chart.js nebo jiné knihovny
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js není načtena, graf nebude vykreslen');
            return;
        }

        const ctx = document.getElementById('user-activity-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(activity).map(time => 
                    new Date(time).toLocaleString()
                ),
                datasets: [{
                    label: 'Požadavky',
                    data: Object.values(activity).map(data => data.requests),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Unikátní uživatelé',
                    data: Object.values(activity).map(data => data.uniqueUsers),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },

    setLoading(loading) {
        this.state.loading = loading;
        document.getElementById('admin-dashboard').classList.toggle('loading', loading);
    },

    showError(message) {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, 5000);
    },

    showSuccess(message) {
        // Podobné jako showError, ale s jiným stylem
        const successEl = document.createElement('div');
        successEl.className = 'success-message';
        successEl.textContent = message;
        document.body.appendChild(successEl);
        setTimeout(() => {
            successEl.remove();
        }, 3000);
    }
};

// Export pro použití v jiných modulech
window.AdminDashboard = AdminDashboard;