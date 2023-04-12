import request from 'supertest';

import { app } from '../../app';

describe('Test with /api/users/signup handler', () => {
    it('Return a 201 on successful signup', async () => {
        return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pass123'
            })
            .expect(201);
    });
});