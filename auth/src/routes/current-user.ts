import { Router, Request, Response } from 'express';

import { currentUser } from '@rg-ticketing/common';

const router = Router();

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
    res.status(200).json({ currentUser: req.currentUser });
});

export { router as CurrentUserRouter }
