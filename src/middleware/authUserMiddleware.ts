import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/responseHandler';
import { secretKey } from '../utils/tokenJwtUtil';
import extractBearerToken from '../services/tokenJwtService/extractBearerToken';

const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token)
        throw new UnauthorizedError('Authentication token not found!'); 

    const jwtToken = extractBearerToken(token);
    jwt.verify(jwtToken, secretKey);
    return next();
};

export default verifyAuthentication;
