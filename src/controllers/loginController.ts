import { Request, Response } from 'express';
import { verifyPassword } from '../utils/bcryptUtil';
import { z } from 'zod';
import generateJwtToken from '../services/tokenJwtService/generateTokenJwt';
import prismaClient from '../services/prisma/prismaClient';

export const login = async (req: Request, res: Response) => {
    try {
        const errorMessage = 'Email or password incorrect!';

        const userLoginSchema = z.object({
            email: z.string().min(1).max(255).email(),
            password: z.string().min(1).max(255),
        });

        const { email, password } = userLoginSchema.parse(req.body);

        const user = await prismaClient.user.findFirst({
            where: {
                email: email,
            },
        });

        if (!user) return res.status(400).json({ message: `${errorMessage}` });

        if (!verifyPassword(password, user.password)) return res.status(400).json({ message: `${errorMessage}` });

        const tokenJwt = await generateJwtToken(user.id);

        res.status(200).json({ access_token: tokenJwt });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error!', error: error.message });
    }
};
