import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketCreatedEvent } from '@rg-ticketing/common';

import { Ticket } from '../../models';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { title, price } = data;

        const ticket = Ticket.build({
            title,
            price
        });
        await ticket.save();

        msg.ack();
    }
}