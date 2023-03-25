import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { verifyPassword } from '../utils/bcryptUtil';
import { z } from 'zod';
import generateJwtToken from '../services/tokenJwtService/generateTokenJwt';
import { asyncHandler, BadRequestError, formatSuccessResponse, UnauthorizedError } from '../utils/responseHandler';

const prisma = new PrismaClient();

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errorMessage = 'Email or password incorrect!';

    const userLoginSchema = z.object({
        email: z.string().min(1).max(255).email(),
        password: z.string().min(1).max(255),
    });

    const { email, password } = userLoginSchema.parse(req.body);

    const user = await prisma.user.findFirst({
        where: {
            email: email,
        },
    });

    if (!user || !verifyPassword(password, user.password)) 
        throw new UnauthorizedError(errorMessage);

    const tokenJwt = await generateJwtToken(user.id);

    res.status(200).json(formatSuccessResponse({ access_token: tokenJwt }));
});