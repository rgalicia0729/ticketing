import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { currentUser, requireAuth, validateRequest, NotFoundError, BadRequestError, OrderStatus } from '@rg-ticketing/common';

import { Order, Ticket } from '../models';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
    '/api/orders',
    currentUser,
    requireAuth,
    [
        body('ticketId')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('ticketId must be provided')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        // Find the ticket the user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new NotFoundError();
        }

        // Make sure that this ticket is not already reserved
        // Run query to look at all orders. Find and order where the ticket
        // is the ticket we just found *and* the order status is *not* cancelled.
        // If we find and order from that means the ticket *is* reserved.
        const isReserved = await ticket.isReserved();

        if (isReserved) {
            throw new BadRequestError('Ticket is already reserved');
        }

        // Calculate an expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await order.save();

        // Publish an event saying that and order was created
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            userId: order.userId,
            version: order.version,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        });

        res.status(201).json(order);
    }
);

export { router as createOrderRouter };