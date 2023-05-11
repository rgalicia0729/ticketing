import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@rg-ticketing/common';

import { TicketCreatedListener } from '../listeners/ticket-created-listener';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models';

const setup = () => {
    // Create an instance on the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // Create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

describe('Testing on ticket-created-listener', () => {
    it('Creates and saves a ticket', async () => {
        const { listener, data, msg } = setup();

        // Call the message function with the data object + message object
        await listener.onMessage(data, msg);

        // Write assertions to make sure a ticket was create
        const ticket = await Ticket.findById(data.id);

        expect(ticket).toBeDefined();
        expect(ticket!.title).toEqual(data.title);
        expect(ticket!.price).toEqual(data.price);
    });

    it('acks the message', async () => {
        const { listener, data, msg } = setup();

        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled();
    });
});