export const secretKey = Buffer.from(process.env.TOKEN_SECRET_KEY, 'base64').toString('ascii');
