import { Publisher, Subjects, TicketCreatedEvent } from '@rg-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
