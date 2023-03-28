import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { secretKey } from '../utils/tokenJwtUtil';
import extractBearerToken from '../services/tokenJwtService/extractBearerToken';

const verifyAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Token is missing!' });

    try {
        const jwtToken = extractBearerToken(token);
        jwt.verify(jwtToken, secretKey);

        return next();
    } catch (error) {
        return res.status(401).json({ message: error.message || 'Invalid token' });
    }
};

export default verifyAuthentication;
