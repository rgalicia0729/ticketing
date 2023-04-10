import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../middlewares';
import { User } from '../models';
import { BadRequestError } from '../errors';
import { Password } from '../services/password';

const router = Router();

router.post(
    '/api/users/signin',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);

        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        // Generate JWT
        const payload = {
            id: existingUser.id,
            email: existingUser.email
        }

        const accessToken = jwt.sign(payload, process.env.JWT_KEY!);

        // Store it on session object
        req.session = {
            jwt: accessToken
        };

        res.status(200).json(existingUser);
    }
);

export { router as SigninRouter }
