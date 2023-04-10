import express from 'express';
require('express-async-errors');
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { CurrentUserRouter, SigninRouter, SignupRouter, SignoutRouter } from './routes';
import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

const PORT = 3000;
const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

// Routes
app.use(SignupRouter);
app.use(SigninRouter);
app.use(SignoutRouter);
app.use(CurrentUserRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

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
