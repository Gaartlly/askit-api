import { NextFunction, Request, Response } from 'express';
import { verifyPassword } from '../utils/bcryptUtil';
import { z } from 'zod';
import generateJwtToken from '../services/tokenJwtService/generateTokenJwt';
import { asyncHandler, formatSuccessResponse, UnauthorizedError } from '../utils/responseHandler';
import prismaClient from '../services/prisma/prismaClient';
import { User } from '@prisma/client';

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errorMessage = 'Email or password incorrect!';

    const userLoginSchema = z.object({
        email: z.string().min(1).max(255).email(),
        password: z.string().min(8).max(255),
    });

    const { email, password } = userLoginSchema.parse(req.body);

    const user: User = await prismaClient.user.findFirst({
        where: {
            email: email,
        },
    });

    if (!user || !(await verifyPassword(password, user.password))) throw new UnauthorizedError(errorMessage);
    
    const tokenJwt: string = await generateJwtToken(user.id, user.role);

    res.status(200).json(formatSuccessResponse({ access_token: tokenJwt }));
});
