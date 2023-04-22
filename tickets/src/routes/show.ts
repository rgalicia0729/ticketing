import { Router, Request, Response } from 'express';
import { NotFoundError } from '@rg-ticketing/common';

import { Ticket } from '../models/tickets';

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    res.status(200).json(ticket);
});

export { router as showTicketRouter };
