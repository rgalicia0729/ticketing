import { Router, Request, Response } from 'express';

import { Ticket } from '../models/tickets';

const router = Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});

    res.status(200).json(tickets);
});

export { router as listTicketRouter }
