import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const PORT = 3000;

// Connect DB
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.TICKETS_MONGO_URI) {
        throw new Error('TICKETS_MONGO_URI must be defined');
    }

    try {
        await natsWrapper.connect('ticketing', 'abc', 'http://nats-srv:4222');

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        mongoose.set('strictQuery', false);
        await mongoose.connect(`${process.env.TICKETS_MONGO_URI}?retryWrites=true&w=majority`);

        console.log('DB online');
    } catch (err) {
        console.error(err);
    }

    app.listen(PORT, () => {
        console.log(`Auth service running on port ${PORT}`);
    });
}

start();
