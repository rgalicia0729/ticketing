import { Router, Request, Response } from 'express';

import { currentUser } from '../middlewares';

const router = Router();

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
    res.status(200).json({ currentUser: req.currentUser });
});

export { router as CurrentUserRouter }
