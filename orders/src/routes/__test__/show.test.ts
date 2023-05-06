import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models';

describe('Testing on GET /api/orders/:id', () => {
    it('Fetches de order', async () => {
        const ticket = Ticket.build({
            title: 'Concert',
            price: 20
        });
        await ticket.save();

        const user = global.signup(new mongoose.Types.ObjectId().toHexString(), 'test@test.com');

        const { body: createdOrder } = await request(app)
            .post('/api/orders')
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(201);

        const { body: fechedOrder } = await request(app)
            .get(`/api/orders/${createdOrder.id}`)
            .set('Cookie', user)
            .send()
            .expect(200);

        expect(fechedOrder.id).toEqual(createdOrder.id);
    });

    it('Returns an error if one user tries to fetch another users order', async () => {
        const ticket = Ticket.build({
            title: 'Concert',
            price: 20
        });
        await ticket.save();

        const createdUser = global.signup(new mongoose.Types.ObjectId().toHexString(), 'test1@test.com');
        const { body: createdOrder } = await request(app)
            .post('/api/orders')
            .set('Cookie', createdUser)
            .send({ ticketId: ticket.id })
            .expect(201);

        const fechedUser = global.signup(new mongoose.Types.ObjectId().toHexString(), 'test2@test.com');
        await request(app)
            .get(`/api/orders/${createdOrder.id}`)
            .set('Cookie', fechedUser)
            .send()
            .expect(401);
    });
});