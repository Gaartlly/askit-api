import { NextFunction, Response, Request } from "express";


export class BaseError extends Error {
    statusCode: number;
    constructor(statusCode: number,message: string) {
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