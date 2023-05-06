import { Router, Request, Response } from 'express';
import { currentUser, requireAuth } from '@rg-ticketing/common';

import { Order } from '../models'

const router = Router();

router.get('/api/orders', currentUser, requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    res.status(200).json(orders);
});

export { router as listOrderRouter };
