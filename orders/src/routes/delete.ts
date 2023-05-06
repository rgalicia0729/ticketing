import { Router, Request, Response } from 'express';
import { currentUser, requireAuth, NotFoundError, NotAuthorizedError, OrderStatus } from '@rg-ticketing/common';

import { Order } from '../models';

const router = Router();

router.delete('/api/orders/:id', currentUser, requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Canceled;
    await order.save();

    res.status(204).send();
});

export { router as deleteOrderRouter };
