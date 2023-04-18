import { Router, Request, Response } from 'express';

import { currentUser, requireAuth } from '@rg-ticketing/common';

const router = Router();

router.post('/api/tickets', currentUser, requireAuth, (req: Request, res: Response) => {
    res.status(200).json({});
});

export { router as createTicketRouter };
