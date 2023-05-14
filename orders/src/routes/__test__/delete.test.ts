import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@rg-ticketing/common';

import { app } from '../../app';
import { Ticket, Order } from '../../models';
import { natsWrapper } from '../../nats-wrapper';

describe('Testing on DELETE /api/orders/:id', () => {
    it('Marks an order as cancelled', async () => {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'Concert',
            price: 20
        });
        await ticket.save();

        const user = global.signup(new mongoose.Types.ObjectId().toHexString(), 'test1@test.com');

        const { body: createdOrder } = await request(app)
            .post('/api/orders')
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(201);

        await request(app)
            .delete(`/api/orders/${createdOrder.id}`)
            .set('Cookie', user)
            .send()
            .expect(204);

        const updatedOrder = await Order.findById(createdOrder.id);

        expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
    });

    it('Emits a order cancelled event', async () => {
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'Concert',
            price: 20
        });
        await ticket.save();

        const user = global.signup(new mongoose.Types.ObjectId().toHexString(), 'test1@test.com');

        const { body: createdOrder } = await request(app)
            .post('/api/orders')
            .set('Cookie', user)
            .send({ ticketId: ticket.id })
            .expect(201);

        await request(app)
            .delete(`/api/orders/${createdOrder.id}`)
            .set('Cookie', user)
            .send()
            .expect(204);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});
