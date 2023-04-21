import request from 'supertest';

import { app } from '../../app';

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
            .set('Cookie', global.signup())
            .send({});

        expect(response.status).not.toEqual(401);
    });

    it('Return an error if an invalid title is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup())
            .send({
                title: '',
                price: 10
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup())
            .send({
                price: 10
            })
            .expect(400);
    });

    it('Return an error if an invalid price is provided', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup())
            .send({
                title: 'New Ticket',
                price: -5
            })
            .expect(400);

        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup())
            .send({
                title: 'New Ticket',
            })
            .expect(400);
    });

    it('Create a ticket with valid inputs', async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup())
            .send({
                title: 'New Ticket',
                price: 10
            })
            .expect(201);
    });
});