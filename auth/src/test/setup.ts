import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../app';

let mongo: any;

declare global {
    var signup: (email: string, password: string) => Promise<string[]>;
}

beforeAll(async () => {
    process.env.JWT_KEY = 'abcd';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany();
    }
});

afterAll(async () => {
    console.log('Before All test');
    if (mongo) {
        await mongo.stop();
    }

    await mongoose.connection.close();
});

global.signup = async (email: string, password: string): Promise<string[]> => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email,
            password
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
}
