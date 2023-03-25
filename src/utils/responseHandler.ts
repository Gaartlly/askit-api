import { NextFunction, Response, Request } from "express";

export class BaseError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.name = Error.name;
        Object.setPrototypeOf(this, new.target.prototype);

        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(message: string) {
        super(401, message);
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(404, message);
    }
}

export class InternalServerError extends BaseError {
    constructor(message: string) {
        super(500, message);
    }
}

/**
 * 
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export const errorResponse = (error: any, req: Request, res: Response, next: NextFunction) => {
    const customError: boolean = error.constructor.name === 'NodeError' || error.constructor.name === 'SyntaxError' ? false : true;

    res.status(error.statusCode || 500).json({
      response: 'Error',
      error: {
        type: customError === false ? 'UnhandledError' : error.constructor.name,
        path: req.path,
        statusCode: error.statusCode || 500,
        message: error.message
      }
    });
    next(error);
}

/**
 * 
 * @param data 
 * @returns JSON formated response
 */
export const formatSuccessResponse = (data: any) => {
    return <JSON><unknown>{
        response: 'Successful!',
        data: data
    };
}

/**
 * This function is a higher-order function that takes an async middleware function and returns a 
 * wrapped function that catches any errors thrown by the middleware and passes them to the next function.
 * 
 * @param fn 
 * @returns Promise
 */
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);