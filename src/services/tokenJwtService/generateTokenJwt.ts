import { secretKey } from '../../utils/tokenJwtUtil';
import { sign } from 'jsonwebtoken';
import { InternalServerError } from '../../utils/responseHandler';

const generateJwtToken = async (userId: number) => {
    const expiresIn = 10000; // 20 seconds for tests
    

    const tokenJwt = sign({}, secretKey, {
        subject: `${userId}`,
        expiresIn: expiresIn,
        algorithm: 'HS256',
    });

    if (!tokenJwt) throw new InternalServerError('Unable to create token JWT');

    return tokenJwt;
};

export default generateJwtToken;
