import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models';

const createTicket = async () => {
    const ticket = Ticket.build({
        title: 'Concert',
        price: 20
    });

    await ticket.save();

    return ticket;
};

const createOrder = async (cookie: string[], ticketId: string) => {
    return await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId })
        .expect(201);
}

describe('Testing on GET /api/orders', () => {
    it('Fetches orders for on particular user', async () => {
        const ticketOne = await createTicket();
        const ticketTwo = await createTicket();
        const ticketThree = await createTicket();

        const userOne = global.signup(new mongoose.Types.ObjectId().toHexString(), 'test1@test.com');
        await createOrder(userOne, ticketOne.id);

        const userTwo = global.signup(new mongoose.Types.ObjectId().toHexString(), 'test2@test.com');
        const { body: orderOne } = await createOrder(userTwo, ticketTwo.id);
        const { body: orderTwo } = await createOrder(userTwo, ticketThree.id);

        const response = await request(app)
            .get('/api/orders')
            .set('Cookie', userTwo)
            .send({})
            .expect(200);

        expect(response.body.length).toEqual(2);
        expect(response.body[0].id).toEqual(orderOne.id);
        expect(response.body[1].id).toEqual(orderTwo.id);
        expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
        expect(response.body[1].ticket.id).toEqual(ticketThree.id);
    });
});