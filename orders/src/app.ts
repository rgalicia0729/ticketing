import express from 'express';
require('express-async-errors');
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rg-ticketing/common';

import {
    listOrderRouter,
    showOrderRouter,
    createOrderRouter,
    deleteOrderRouter
} from './routes';

const app = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

// Routes
app.use(listOrderRouter);
app.use(showOrderRouter);
app.use(createOrderRouter);
app.use(deleteOrderRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };