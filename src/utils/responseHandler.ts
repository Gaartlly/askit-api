import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
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
 * This function is a higher-order function that takes an async middleware function and returns a 
 * wrapped function that catches any errors thrown by the middleware and passes them to the next function.
 * 
 * @param fn 
 * @returns Promise
 */
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);



/**
 * Return the HTTP error code based on the 'error' received.
 * 
 * @param error
 */
const errorCode = async(error:any): Promise<number> => {
    if(error.statusCode)
        return error.statusCode;

    if(error instanceof PrismaClientKnownRequestError || error instanceof PrismaClientUnknownRequestError)
        return 400;

    switch (error.constructor.name) {
        case 'ZodError':
                return 400;
        case 'NotFoundError':
                return 400;
        case 'JsonWebTokenError':
                return 401;
        case 'TokenExpiredError':
                return 401
        case 'NotBeforeError':
                return 401
    }

    return 500;
};

/**
 * 
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export const errorResponse = async (error: any, req: Request, res: Response, next: NextFunction) => {
    const customError: boolean = error.constructor.name === 'NodeError' || error.constructor.name === 'SyntaxError' ? false : true;
    const errorReponseCode = await errorCode(error);

    // Remove '\n' from message. It's necessary because prisma use it in their error messages.
    let message = error.message;
    message = message.replaceAll("\n", "");

    res.status(errorReponseCode).json({
      response: 'Error',
      error: {
        type: customError === false ? 'UnhandledError' : error.constructor.name,
        path: req.path,
        statusCode: errorReponseCode,
        message: message,
        rawError: error
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
