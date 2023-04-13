import request from 'supertest';

import { app } from '../../app';

describe('Test in /api/users/signup handler', () => {
    it('Return a 201 on successful signup', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);
    });

    it('Return a 400 with an invalid email', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@',
                password: 'pass123'
            })
            .expect(400);
    });

    it('Return a 400 with an invalid password', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pa'
            })
            .expect(400);
    });

    it('Return a 400 with missing email and password', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pa'
            })
            .expect(400);

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@',
                password: 'pass123'
            })
            .expect(400);
    });

    it('Disallows duplicate emails', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);

        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(400);
    });

    it('Sets a cookie after successful signup', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});