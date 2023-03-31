import { TokenJwtPayload } from './adminMiddleware';
import { NextFunction, Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import extractBearerToken from '../services/tokenJwtService/extractBearerToken';
import { UnauthorizedError, asyncHandler } from '../utils/responseHandler';

const moderatorMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.headers.authorization;
    if (!token) throw new UnauthorizedError('Token is missing!');

    const { role } = jwt_decode<TokenJwtPayload>(extractBearerToken(req.headers.authorization));
    if (role === 'USER') throw new UnauthorizedError('Unauthorized user.');
    return next();
});

export default moderatorMiddleware;
