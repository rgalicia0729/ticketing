import { Publisher, OrderCancelledEvent, Subjects } from '@rg-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}
