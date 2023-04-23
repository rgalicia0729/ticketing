import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

const createTicket = () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const userEmail = 'test@test.com';

    const title = 'Title ticket';
    const price = 20;

    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signup(userId, userEmail))
        .send({
            title,
            price
        })
        .expect(201);
}

describe('Testing on GET /api/tickets', () => {
    it('Can fetch a list of tickets', async () => {
        await createTicket();
        await createTicket();
        await createTicket();

        const response = await request(app)
            .get('/api/tickets')
            .send({})
            .expect(200);

        expect(response.body.length).toEqual(3);
    });
});