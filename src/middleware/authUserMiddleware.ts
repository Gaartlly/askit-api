import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/responseHandler';
import { secretKey } from '../utils/tokenJwtUtil';

export const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token)
        throw new UnauthorizedError('Authentication token not found!'); 

    // Bearer token
    const [_, jwtToken] = token.split(' ');

    jwt.verify(jwtToken, secretKey);
    return next();
};
