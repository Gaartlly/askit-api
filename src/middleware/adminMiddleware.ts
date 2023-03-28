import { NextFunction, Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import extractBearerToken from '../services/tokenJwtService/extractBearerToken';

export interface TokenJwtPayload {
    role: string;
    iat: number;
    exp: number;
    sub: string;
}

export default function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const adminOnlyMsg = 'Only ADMINS authorized!';

    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Token is missing!' });

    try {
        const { role } = jwt_decode<TokenJwtPayload>(extractBearerToken(req.headers.authorization));
        if (role !== 'ADMIN') throw new Error();
        return next();
    } catch (error) {
        return res.status(401).json({ name: 'AdminOnly', message: adminOnlyMsg });
    }
}
