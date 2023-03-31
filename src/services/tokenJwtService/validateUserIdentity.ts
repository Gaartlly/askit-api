import extractBearerToken from './extractBearerToken';
import jwt from 'jsonwebtoken';

export default function validateUserIdentity(userId: number, token: string): boolean {
    const access_token = extractBearerToken(token);

    const sub = jwt.decode(access_token).sub;
    if (!sub) throw new Error('Unauthorized user');

    if (userId !== Number(sub)) return false;
    return true;
}
