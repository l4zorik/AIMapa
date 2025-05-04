/**
 * Integrační testy pro Admin API
 */

const request = require('supertest');
const { expect } = require('chai');
const app = require('../../server');
const { createTestUser, cleanupTestUsers } = require('../helpers/auth-helper');
const { setupTestDatabase, cleanupTestDatabase } = require('../helpers/db-helper');

describe('Admin API Integration Tests', () => {
    let testAdmin;
    let testUser;
    let adminToken;
    let userToken;

    before(async () => {
        // Setup testovací databáze
        await setupTestDatabase();

        // Vytvoření testovacích uživatelů
        testAdmin = await createTestUser({
            email: 'admin@test.com',
            role: 'admin'
        });
        testUser = await createTestUser({
            email: 'user@test.com',
            role: 'user'
        });

        // Získání tokenů
        adminToken = await testAdmin.getIdToken();
        userToken = await testUser.getIdToken();
    });

    after(async () => {
        await cleanupTestUsers();
        await cleanupTestDatabase();
    });

    describe('GET /api/admin/metrics', () => {
        it('should return metrics for admin users', async () => {
            const response = await request(app)
                .get('/api/admin/metrics')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('api');
            expect(response.body).to.have.property('users');
            expect(response.body).to.have.property('routes');
        });

        it('should reject non-admin users', async () => {
            const response = await request(app)
                .get('/api/admin/metrics')
                .set('Authorization', `Bearer ${userToken}`);

            expect(response.status).to.equal(403);
        });
    });

    describe('GET /api/admin/performance', () => {
        it('should return API performance data for admin users', async () => {
            const response = await request(app)
                .get('/api/admin/performance')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(endpoint => {
                expect(endpoint).to.have.property('path');
                expect(endpoint).to.have.property('calls');
                expect(endpoint).to.have.property('avg_response_time');
            });
        });
    });

    describe('GET /api/admin/user-activity', () => {
        it('should return user activity data for admin users', async () => {
            const response = await request(app)
                .get('/api/admin/user-activity')
                .query({ days: 7 })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(day => {
                expect(day).to.have.property('day');
                expect(day).to.have.property('unique_users');
                expect(day).to.have.property('total_actions');
            });
        });
    });

    describe('GET /api/admin/route-metrics', () => {
        it('should return route metrics for all users', async () => {
            const response = await request(app)
                .get('/api/admin/route-metrics')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });

        it('should return route metrics for specific user', async () => {
            const response = await request(app)
                .get('/api/admin/route-metrics')
                .query({ userId: testUser.uid })
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            response.body.forEach(metric => {
                expect(metric.user_id).to.equal(testUser.uid);
            });
        });
    });

    describe('GET /api/admin/logs/export', () => {
        it('should export logs in CSV format', async () => {
            const response = await request(app)
                .get('/api/admin/logs/export')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.headers['content-type']).to.equal('text/csv');
            expect(response.headers['content-disposition']).to.include('attachment');
            
            const lines = response.text.split('\n');
            expect(lines[0]).to.include('timestamp');
            expect(lines[0]).to.include('path');
            expect(lines[0]).to.include('method');
        });
    });

    describe('PUT /api/admin/users/:userId/role', () => {
        it('should update user role', async () => {
            const response = await request(app)
                .put(`/api/admin/users/${testUser.uid}/role`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'moderator' });

            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Role byla úspěšně aktualizována');

            // Ověření změny role
            const userResponse = await request(app)
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`);

            const updatedUser = userResponse.body.find(u => u.auth0_id === testUser.uid);
            expect(updatedUser.roles).to.include('moderator');
        });

        it('should reject invalid roles', async () => {
            const response = await request(app)
                .put(`/api/admin/users/${testUser.uid}/role`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ role: 'invalid_role' });

            expect(response.status).to.equal(400);
        });
    });
});