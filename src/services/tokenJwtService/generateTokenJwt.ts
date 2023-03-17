import { secretKey } from '../../utils/tokenJwtUtil';
import { sign } from 'jsonwebtoken';

const generateJwtToken = async (userId: number) => {
    const expiresIn = 20; // 20 seconds for tests

    const tokenJwt = sign({}, secretKey, {
        subject: `${userId}`,
        expiresIn: expiresIn,
        algorithm: 'HS256',
    });

    if (!tokenJwt) throw new Error('Unable to create token JWT');

    return tokenJwt;
};

export default generateJwtToken;
