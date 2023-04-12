import mongoose from 'mongoose';

import { app } from './app';

const PORT = 3000;

// Connect DB
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect('mongodb+srv://coursesusr:o2CtZBAFII5WRqtP@courses.6gjsk7h.mongodb.net/auth?retryWrites=true&w=majority');

        console.log('DB online');
    } catch (err) {
        console.error(err);
    }

    app.listen(PORT, () => {
        console.log(`Auth service running on port ${PORT}`);
    });
}

start();
