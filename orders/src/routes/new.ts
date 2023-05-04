import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@rg-ticketing/common';

const router = Router();

router.delete(
    '/api/orders/:id',
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('ticketId must be provided')
    ],
    validateRequest,
    (req: Request, res: Response) => {

    }
);

export { router as createOrderRouter };