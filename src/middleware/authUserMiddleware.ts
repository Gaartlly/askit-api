import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { secretKey } from '../utils/tokenJwtUtil';

export const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) return res.status(401).json({ message: 'Token is missing!' });

    // Bearer token
    const [_, jwtToken] = token.split(' ');

    try {
        jwt.verify(jwtToken, secretKey);
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token!' });
    }
};
