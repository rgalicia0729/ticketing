import { ValidationError } from 'express-validator';

import { CustomError } from '.';

export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super();

        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(error => {
            return { message: error.msg, field: error.param };
        });
    }
}