import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { currentUser, requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@rg-ticketing/common';

import { Ticket } from '../models/tickets';

const router = Router();

router.put(
    '/api/tickets/:id',
    currentUser,
    requireAuth,
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            throw new NotFoundError();
        }

        if (ticket.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        const { title, price } = req.body;

        ticket.set({
            title,
            price
        });

        await ticket.save();

        res.status(200).json(ticket);
    }
);

export { router as updateTicketRouter };
