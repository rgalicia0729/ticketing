import express from 'express';
require('express-async-errors');
import cookieSession from 'cookie-session';

import { CurrentUserRouter, SigninRouter, SignupRouter, SignoutRouter } from './routes';
import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

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

export { app };