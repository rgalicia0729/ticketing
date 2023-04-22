import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser, requireAuth, validateRequest } from '@rg-ticketing/common';

import { Ticket } from '../models/tickets';

const router = Router();

router.post(
    '/api/tickets',
    currentUser,
    requireAuth,
    [
        body('title')
            .trim()
            .not()
            .isEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        });

        await ticket.save();

        res.status(201).json(ticket);
    }
);

export { router as createTicketRouter };
