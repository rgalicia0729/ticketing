import { Router, Request, Response } from 'express';
import { currentUser, requireAuth, NotFoundError, NotAuthorizedError } from '@rg-ticketing/common';

import { Order } from '../models';

const router = Router();

router.get('/api/orders/:id', currentUser, requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.status(200).json(order);
});

export { router as showOrderRouter };