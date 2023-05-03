import { Publisher, Subjects, TicketUpdatedEvent } from '@rg-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
