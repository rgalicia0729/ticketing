import request from 'supertest';

import { app } from '../../app';

describe('Test in /api/users/signout handler', () => {
    it('Return a 200 after signout', async () => {
        await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);

        await request(app)
            .post('/api/users/signout')
            .send({})
            .expect(200);
    });
});
