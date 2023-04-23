import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

const getId = () => new mongoose.Types.ObjectId().toHexString();

describe('Testing on PUT /api/tickets/:id', () => {
    it('Returns a 404 if the provided id does not exists', async () => {
        const userId = getId();
        const userEmail = 'test@test.com';

        const title = 'Update title';
        const price = 25;

        await request(app)
            .put(`/api/tickets/${getId()}`)
            .set('Cookie', global.signup(userId, userEmail))
            .send({
                title,
                price
            })
            .expect(404);
    });

    it('Returns a 401 if the user is not authenticated', async () => {
        const title = 'Update title';
        const price = 25;

        await request(app)
            .put(`/api/tickets/${getId()}`)
            .send({
                title,
                price
            })
            .expect(401);
    });

    it('Returns a 401 if the user does not own the ticket', async () => {
        const userWhoCreates = {
            id: getId(),
            email: 'test1@test.com'
        }

        const createResponse = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signup(userWhoCreates.id, userWhoCreates.email))
            .send({
                title: 'New Ticket',
                price: 20
            })
            .expect(201);

        const userUpdating = {
            id: getId(),
            email: 'test2@test.com'
        }

        await request(app)
            .put(`/api/tickets/${createResponse.body.id}`)
            .set('Cookie', global.signup(userUpdating.id, userUpdating.email))
            .send({
                title: 'New title',
                price: 10
            })
            .expect(401);
    });

    it('Returns a 400 if the user provides an invalid title or price', async () => {
        const cookie = global.signup(getId(), 'test@test.com');

        const createResponse = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: 'New Ticket',
                price: 20
            })
            .expect(201);

        await request(app)
            .put(`/api/tickets/${createResponse.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: '',
                price: 10
            })
            .expect(400);

        await request(app)
            .put(`/api/tickets/${createResponse.body.id}`)
            .set('Cookie', cookie)
            .send({
                title: 'New Title',
                price: -10
            })
            .expect(400);
    });

    it('Updates the ticket provided valid inputs', async () => {
        const cookie = global.signup(getId(), 'test@test.com');

        const createResponse = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: 'New Ticket',
                price: 20
            })
            .expect(201);

        const title = 'New title';
        const price = 31;

        const updateResponse = await request(app)
            .put(`/api/tickets/${createResponse.body.id}`)
            .set('Cookie', cookie)
            .send({
                title,
                price
            })
            .expect(200);

        expect(updateResponse.body.title).toEqual(title);
        expect(updateResponse.body.price).toEqual(price);
    });
});
