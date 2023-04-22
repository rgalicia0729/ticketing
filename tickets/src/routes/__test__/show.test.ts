import request from 'supertest';

import { app } from '../../app';

describe('Testing on GET /api/tickets/:id', () => {
    it('Returns a 404 if the ticket is not found', async () => {
        await request(app)
            .get('/api/tickets/5ca1abb6ce037511f000628e')
            .send({})
            .expect(404);
    });

    it('Returns the ticket if the ticket is found', async () => {
        const title = 'New Ticket';
        const price = 20;

        const ticketCreated = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup())
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