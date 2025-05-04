/**
 * Unit testy pro Role Manager
 */

const { expect } = require('chai');
const sinon = require('sinon');

describe('RoleManager', () => {
    let roleManager;
    
    beforeEach(() => {
        // Reset stavu před každým testem
        roleManager = require('../../public/app/role-manager');
        roleManager.state = {
            currentUser: null,
            roles: [],
            permissions: []
        };
    });

    describe('init()', () => {
        it('should initialize correctly', async () => {
            const mockAuth0Auth = {
                getUser: sinon.stub().resolves({
                    data: {
                        user: {
                            sub: 'auth0|123',
                            'https://aimapa.cz/roles': ['user'],
                            'https://aimapa.cz/permissions': ['read:content']
                        }
                    }
                })
            };
            global.Auth0Auth = mockAuth0Auth;

            const result = await roleManager.init();
            expect(result).to.be.true;
            expect(roleManager.state.roles).to.deep.equal(['user']);
            expect(roleManager.state.permissions).to.deep.equal(['read:content']);
        });
    });

    describe('hasRole()', () => {
        it('should return true for assigned role', () => {
            roleManager.state.roles = ['user', 'moderator'];
            expect(roleManager.hasRole('user')).to.be.true;
            expect(roleManager.hasRole('moderator')).to.be.true;
        });

        it('should return false for unassigned role', () => {
            roleManager.state.roles = ['user'];
            expect(roleManager.hasRole('admin')).to.be.false;
        });

        it('should return true for admin checking any role', () => {
            roleManager.state.roles = ['admin'];
            expect(roleManager.hasRole('user')).to.be.true;
            expect(roleManager.hasRole('moderator')).to.be.true;
        });
    });

    describe('hasPermission()', () => {
        it('should return true for assigned permission', () => {
            roleManager.state.permissions = ['read:content', 'write:own'];
            expect(roleManager.hasPermission('read:content')).to.be.true;
            expect(roleManager.hasPermission('write:own')).to.be.true;
        });

        it('should return false for unassigned permission', () => {
            roleManager.state.permissions = ['read:content'];
            expect(roleManager.hasPermission('write:all')).to.be.false;
        });

        it('should return true for admin checking any permission', () => {
            roleManager.state.roles = ['admin'];
            expect(roleManager.hasPermission('any:permission')).to.be.true;
        });
    });

    describe('handleAuthStateChange()', () => {
        it('should update state on login', () => {
            const event = {
                detail: {
                    isLoggedIn: true,
                    user: {
                        sub: 'auth0|123',
                        'https://aimapa.cz/roles': ['user'],
                        'https://aimapa.cz/permissions': ['read:content']
                    }
                }
            };

            roleManager.handleAuthStateChange(event);
            expect(roleManager.state.currentUser).to.deep.equal(event.detail.user);
            expect(roleManager.state.roles).to.deep.equal(['user']);
            expect(roleManager.state.permissions).to.deep.equal(['read:content']);
        });

        it('should reset state on logout', () => {
            roleManager.state = {
                currentUser: { sub: 'auth0|123' },
                roles: ['user'],
                permissions: ['read:content']
            };

            const event = {
                detail: {
                    isLoggedIn: false,
                    user: null
                }
            };

            roleManager.handleAuthStateChange(event);
            expect(roleManager.state.currentUser).to.be.null;
            expect(roleManager.state.roles).to.deep.equal(['guest']);
            expect(roleManager.state.permissions).to.deep.equal([]);
        });
    });
});