import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@rg-ticketing/common';

import { app } from '../../app';
import { Ticket, Order } from '../../models';
import { natsWrapper } from '../../nats-wrapper';

const getCookie = () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const userEmail = 'text@test.com';

    return global.signup(userId, userEmail);
}

describe('Testing on POST /api/orders', () => {
    it('Returns an error if the ticket does not exists', async () => {
        const ticketId = new mongoose.Types.ObjectId();

        await request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({ ticketId })
            .expect(404);
    });

    it('Returns an error if the ticket is already reserved', async () => {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'Concert',
            price: 20
        });
        await ticket.save();

        const order = Order.build({
            userId: 'lasikdlaksdjf',
            status: OrderStatus.Created,
            expiresAt: new Date(),
            ticket
        });
        await order.save();

        await request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({
                ticketId: ticket.id
            })
            .expect(400);
    });

    it('Reserves a ticket', async () => {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'Concert',
            price: 30
        });
        await ticket.save();

        await request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({ ticketId: ticket.id })
            .expect(201);
    });

    it('Emits an order created event', async () => {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'Concert',
            price: 30
        });
        await ticket.save();

        await request(app)
            .post('/api/orders')
            .set('Cookie', getCookie())
            .send({ ticketId: ticket.id })
            .expect(201);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});