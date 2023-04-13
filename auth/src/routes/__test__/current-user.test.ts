import request from 'supertest';

import { app } from '../../app';

describe('Test in /api/users/currentuser', () => {
    it('Responds with details about the current user', async () => {
        const email = 'test@test.com';
        const password = 'pass123';

        const cookie = await global.signup(email, password);

        const currentuserResponse = await request(app)
            .get('/api/users/currentuser')
            .set('Cookie', cookie)
            .send()
            .expect(200);

        expect(currentuserResponse.body.currentUser.email).toBe(email);
    });

    it('Responds with undefined if not authenticated', async () => {
        const response = await request(app)
            .get('/api/users/currentuser')
            .send()
            .expect(200);

        expect(response.body.currentuser).toEqual(undefined);
    });
});