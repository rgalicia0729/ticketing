import request from 'supertest';

import { app } from '../../app';

describe('Test in /api/users/signin handler', () => {
    it('Fails when a email that does not exist is supplied', async () => {
        await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(400);
    });

    it('Fails when an incorrect password is supplied', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);

        await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'pass321'
            })
            .expect(400);
    });

    it('Responds with a cookie when given valid credentials', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);

        const response = await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(200);

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});
