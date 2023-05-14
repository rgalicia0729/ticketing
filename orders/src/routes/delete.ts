import { Router, Request, Response } from 'express';
import { currentUser, requireAuth, NotFoundError, NotAuthorizedError, OrderStatus } from '@rg-ticketing/common';

import { Order } from '../models';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete('/api/orders/:id', currentUser, requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Canceled;
    await order.save();

    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });

    res.status(204).send();
});

export { router as deleteOrderRouter };
