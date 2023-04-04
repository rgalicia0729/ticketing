import express from 'express';

import { CurrentUserRouter, SigninRouter, SignupRouter, SignoutRouter } from './routes';

const PORT = 3000;
const app = express();

app.use(express.json());

// Routes
app.use(SignupRouter);
app.use(SigninRouter);
app.use(SignoutRouter);
app.use(CurrentUserRouter);

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
