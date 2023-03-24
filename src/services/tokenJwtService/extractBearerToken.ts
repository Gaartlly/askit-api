export default function extractBearerToken(tokenJwt: string) {
    if (!tokenJwt) throw new Error('Invalid token format');

    if (tokenJwt.includes('Bearer')) {
        const [_, token] = tokenJwt.split(' ');
        return token;
    } else {
        return tokenJwt;
    }
}
