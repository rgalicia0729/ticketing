import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';

const getCookie = () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const userEmail = 'text@test.com';

    return global.signup(userId, userEmail);
}

describe('Tests on POST /api/tickets', () => {
    it('Has a route handler listening to /api/tickets for post request', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .send({});

        expect(response.status).not.toEqual(404);
    });

    it('Can only be accessed if the user is signed in', async () => {
        await request(app)
            .post('/api/tickets')
            .send({})
            .expect(401);
    });

    it('Returns a status other than 401 if the user is signed in', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({});

        expect(response.status).not.toEqual(401);
    });

    it('Return an error if an invalid title is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({
                title: '',
                price: 10
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({
                price: 10
            })
            .expect(400);
    });

    it('Return an error if an invalid price is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({
                title: 'New Ticket',
                price: -5
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({
                title: 'New Ticket',
            })
            .expect(400);
    });

    it('Create a ticket with valid inputs', async () => {
        let ticket = await Ticket.find({});
        expect(ticket.length).toEqual(0);

        const title = 'New Ticket';
        const price = 20;

        await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({
                title,
                price
            })
            .expect(201);

        ticket = await Ticket.find({});
        expect(ticket.length).toEqual(1);
        expect(ticket[0].title).toEqual(title);
        expect(ticket[0].price).toEqual(price);
    });

    it('Publishes an event', async () => {
        const title = 'New Ticket';
        const price = 20;

        await request(app)
            .post('/api/tickets')
            .set('Cookie', getCookie())
            .send({
                title,
                price
            })
            .expect(201);

        expect(natsWrapper.client.publish).toHaveBeenCalled();
    });
});