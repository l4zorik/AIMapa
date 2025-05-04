/**
 * Unit testy pro Admin Dashboard
 */

const { expect } = require('chai');
const sinon = require('sinon');

describe('AdminDashboard', () => {
    let adminDashboard;
    let fetchStub;
    
    beforeEach(() => {
        // Reset stavu před každým testem
        adminDashboard = require('../../public/app/admin-dashboard');
        adminDashboard.state = {
            metrics: null,
            users: [],
            selectedUser: null,
            loading: false,
            error: null
        };

        // Mock pro fetch API
        fetchStub = sinon.stub(global, 'fetch');
    });

    afterEach(() => {
        fetchStub.restore();
    });

    describe('init()', () => {
        it('should initialize only for admin users', async () => {
            global.RoleManager = {
                hasRole: sinon.stub().returns(false)
            };

            const result = await adminDashboard.init();
            expect(result).to.be.false;
            expect(adminDashboard.state.error).to.not.be.null;
        });

        it('should initialize successfully for admin users', async () => {
            global.RoleManager = {
                hasRole: sinon.stub().withArgs('admin').returns(true)
            };

            fetchStub.resolves({
                ok: true,
                json: () => Promise.resolve({
                    metrics: {},
                    users: []
                })
            });

            const result = await adminDashboard.init();
            expect(result).to.be.true;
            expect(adminDashboard.state.error).to.be.null;
        });
    });

    describe('loadMetrics()', () => {
        beforeEach(() => {
            global.RoleManager = {
                hasRole: sinon.stub().withArgs('admin').returns(true)
            };
        });

        it('should load metrics successfully', async () => {
            const mockMetrics = {
                api: { totalRequests: 100 },
                users: { activeUsers: 50 },
                routes: { totalRoutes: 25 }
            };

            fetchStub.resolves({
                ok: true,
                json: () => Promise.resolve(mockMetrics)
            });

            await adminDashboard.loadMetrics();
            expect(adminDashboard.state.metrics).to.deep.equal(mockMetrics);
            expect(adminDashboard.state.error).to.be.null;
        });

        it('should handle errors when loading metrics', async () => {
            fetchStub.resolves({
                ok: false,
                status: 500
            });

            await adminDashboard.loadMetrics();
            expect(adminDashboard.state.metrics).to.be.null;
            expect(adminDashboard.state.error).to.not.be.null;
        });
    });

    describe('loadUsers()', () => {
        beforeEach(() => {
            global.RoleManager = {
                hasRole: sinon.stub().withArgs('admin').returns(true)
            };
        });

        it('should load users successfully', async () => {
            const mockUsers = [
                { id: 1, name: 'Test User', role: 'user' },
                { id: 2, name: 'Admin User', role: 'admin' }
            ];

            fetchStub.resolves({
                ok: true,
                json: () => Promise.resolve(mockUsers)
            });

            await adminDashboard.loadUsers();
            expect(adminDashboard.state.users).to.deep.equal(mockUsers);
            expect(adminDashboard.state.error).to.be.null;
        });

        it('should handle errors when loading users', async () => {
            fetchStub.resolves({
                ok: false,
                status: 500
            });

            await adminDashboard.loadUsers();
            expect(adminDashboard.state.users).to.deep.equal([]);
            expect(adminDashboard.state.error).to.not.be.null;
        });
    });

    describe('changeUserRole()', () => {
        beforeEach(() => {
            global.RoleManager = {
                hasRole: sinon.stub().withArgs('admin').returns(true)
            };
        });

        it('should change user role successfully', async () => {
            fetchStub.resolves({
                ok: true,
                json: () => Promise.resolve({ message: 'Role updated' })
            });

            const userId = 'auth0|123';
            const newRole = 'moderator';
            
            await adminDashboard.changeUserRole(userId, newRole);
            expect(fetchStub.calledWith(
                `/api/admin/users/${userId}/role`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: newRole })
                }
            )).to.be.true;
        });

        it('should handle errors when changing role', async () => {
            fetchStub.resolves({
                ok: false,
                status: 500
            });

            const userId = 'auth0|123';
            const newRole = 'moderator';
            
            await adminDashboard.changeUserRole(userId, newRole);
            expect(adminDashboard.state.error).to.not.be.null;
        });
    });

    describe('exportLogs()', () => {
        beforeEach(() => {
            global.RoleManager = {
                hasRole: sinon.stub().withArgs('admin').returns(true)
            };
            
            // Mock pro Blob a URL API
            global.Blob = class {
                constructor(content, options) {
                    this.content = content;
                    this.options = options;
                }
            };
            global.URL.createObjectURL = sinon.stub().returns('blob:test');
            global.URL.revokeObjectURL = sinon.stub();
        });

        it('should export logs successfully', async () => {
            const mockCsv = 'timestamp,action,user\n2025-05-03,login,user1';
            fetchStub.resolves({
                ok: true,
                blob: () => Promise.resolve(new Blob([mockCsv]))
            });

            const appendChildSpy = sinon.spy(document.body, 'appendChild');
            const removeSpy = sinon.spy(HTMLElement.prototype, 'remove');

            await adminDashboard.exportLogs();

            expect(appendChildSpy.calledOnce).to.be.true;
            expect(removeSpy.calledOnce).to.be.true;
            expect(adminDashboard.state.error).to.be.null;

            appendChildSpy.restore();
            removeSpy.restore();
        });

        it('should handle errors when exporting logs', async () => {
            fetchStub.resolves({
                ok: false,
                status: 500
            });

            await adminDashboard.exportLogs();
            expect(adminDashboard.state.error).to.not.be.null;
        });
    });
});