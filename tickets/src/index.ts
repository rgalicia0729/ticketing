import mongoose from 'mongoose';

import { app } from './app';

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
