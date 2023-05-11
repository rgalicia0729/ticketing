import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@rg-ticketing/common';

import { natsWrapper } from '../../nats-wrapper';
import { TicketUpdatedListener } from '../listeners/ticket-updated-listener';
import { Ticket } from '../../models';

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 10,
    });
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'New Concert',
        price: 999,
        userId: 'ABC',
        version: ticket.version + 1
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg };
}

describe('Testing on ticket-updated-listener', () => {
    it('Finds, updates, and save a ticket', async () => {
        const { msg, data, ticket, listener } = await setup();

        await listener.onMessage(data, msg);

        const updatedTicket = await Ticket.findById(data.id);

        if (updatedTicket) {
            expect(updatedTicket.title).toEqual(data.title);
            expect(updatedTicket.price).toEqual(data.price);
            expect(updatedTicket.version).toEqual(data.version);
        }
    });

    it('acks the message', async () => {
        const { listener, data, msg } = await setup();

        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });
});