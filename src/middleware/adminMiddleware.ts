import { NextFunction, Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import extractBearerToken from '../services/tokenJwtService/extractBearerToken';
import { UnauthorizedError, asyncHandler } from '../utils/responseHandler';

export interface TokenJwtPayload {
    role: string;
    iat: number;
    exp: number;
    sub: string;
}

const adminMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.headers.authorization;
    if (!token) throw new UnauthorizedError('Token is missing!');

    const { role } = jwt_decode<TokenJwtPayload>(extractBearerToken(req.headers.authorization));
    if (role !== 'ADMIN') throw new UnauthorizedError('Only ADMINS authorized!');
    return next();
});

export default adminMiddleware;
