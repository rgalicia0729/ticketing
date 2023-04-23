import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

describe('Testing on GET /api/tickets/:id', () => {
    it('Returns a 404 if the ticket is not found', async () => {
        const id = new mongoose.Types.ObjectId().toHexString();

        await request(app)
            .get(`/api/tickets/${id}`)
            .send({})
            .expect(404);
    });

    it('Returns the ticket if the ticket is found', async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();
        const userEmail = 'test@test.com';

        const title = 'New Ticket';
        const price = 20;

        const ticketCreated = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup(userId, userEmail))
            .send({
                title,
                price
            })
            .expect(201);

        const findTicket = await request(app)
            .get(`/api/tickets/${ticketCreated.body.id}`)
            .send({})
            .expect(200);

        expect(findTicket.body.title).toEqual(title);
        expect(findTicket.body.price).toEqual(price);
    });
});