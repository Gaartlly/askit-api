import { TokenJwtPayload } from './adminMiddleware';
import { NextFunction, Request, Response } from 'express';
import jwt_decode from 'jwt-decode';
import extractBearerToken from '../services/tokenJwtService/extractBearerToken';

export default function moderatorMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Token is missing!' });

    try {
        const { role } = jwt_decode<TokenJwtPayload>(extractBearerToken(req.headers.authorization));
        if (role === 'USER') throw new Error();
        return next();
    } catch (error) {
        return res.status(401).json({ name: 'ModOrAdminOnly', message: 'Only Mod or Admin allowed!' });
    }
}
