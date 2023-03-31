import { Response, Request } from 'express';
import { Course, Role, User } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../utils/bcryptUtil';
import { asyncHandler, InternalServerError, UnauthorizedError, formatSuccessResponse } from '../utils/responseHandler';
import validateUserIdentity from '../services/tokenJwtService/validateUserIdentity';
import prismaClient from '../services/prisma/prismaClient';
import integerValidator from '../utils/integerValidator';

interface UserDTO {
    id: number;
    email: string;
    name: string;
    course: Course;
}

/**
 * Get all users.
 *
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users: UserDTO[] = await prismaClient.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            course: true,
            password: false,
            role: false,
            status: false,
        },
        orderBy: {
            name: 'asc',
        },
    });
    res.status(200).json(formatSuccessResponse(users));
});

/**
 * Create a new user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createUserSchema = z.object({
        name: z.string().min(1).max(255),
        email: z
            .string()
            .email()
            .min(1)
            .max(255)
            .refine((val) => val.endsWith('@ufpr.br' || '@inf.ufpr.br')),
        password: z.string().min(8, 'Needs at least 8 characters!').max(255),
        role: z.enum([Role.ADMIN, Role.USER, Role.MOD]),
        status: z.boolean(),
        courseId: z.number(),
    });
    const { name, email, role, status, courseId } = createUserSchema.parse(req.body);
    let { password } = createUserSchema.parse(req.body);

    const hash = await hashPassword(password, 11);

    if (!hashPassword) throw new InternalServerError('Failed to encrypt password!');

    password = hash;

    const user: User = await prismaClient.user.create({
        data: {
            name,
            email,
            password,
            role,
            status,
            courseId,
        },
    });

    res.status(201).json(
        formatSuccessResponse({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                courseId: user.courseId,
            },
        })
    );
});

/**
 * Update a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateUserSchema = z
        .object({
            newName: z.string().min(1).max(255).optional(),
            email: z
                .string()
                .email()
                .refine((val) => val.endsWith('@ufpr.br'))
                .optional(),
            newEmail: z
                .string()
                .email()
                .refine((val) => val.endsWith('@ufpr.br'))
                .optional(),
            newCourseId: z.number().int().optional(),
            password: z.string().min(8).max(255).optional(),
            newPassword: z.string().min(8).max(255).optional(),
        })
        .refine((data) => data.email == data.newEmail || (data.email && data.newEmail), {
            message: 'Email cannot be updated as some data is missing',
            path: ['email', 'newEmail'],
        })
        .refine((data) => data.password == data.newPassword || (data.password && data.newPassword), {
            message: 'Password cannot be updated as some data is missing',
            path: ['password', 'newPassword'],
        });

    const id = await integerValidator.parseAsync(req.body.tagId);
    const { newName, email, newEmail, newCourseId, password, newPassword } = await updateUserSchema.parseAsync(req.body);

    const user: User = await prismaClient.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });

    // validating if the target user of the update is the same as the token
    if (!validateUserIdentity(user.email, req.headers.authorization)) throw new Error('Unauthorized user');

    if (email && email !== user.email) throw new UnauthorizedError('Current email or password is wrong.');

    if (password) {
        const resultComparison = await verifyPassword(password, user.password);
        if (!resultComparison) throw new UnauthorizedError('Current email or password is wrong.');
    }

    const encriptedNewPassword = await hashPassword(newPassword, 11);
    if (!encriptedNewPassword) throw new InternalServerError('Unable to update password!');

    const newUser: User = await prismaClient.user.update({
        where: {
            id,
        },
        data: {
            name: newName,
            email: newEmail,
            password: encriptedNewPassword,
            courseId: newCourseId,
        },
    });

    res.status(200).json(
        formatSuccessResponse({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                courseId: user.courseId,
            },
        })
    );
});


/**
 * Delete a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.userId);

    const user: User = await prismaClient.user.findUniqueOrThrow({
        where: {
            id,
        },
    });

    // validating if the target user of the delete is the same as the token
    if (!validateUserIdentity(user.email, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const deletedUser: User = await prismaClient.user.delete({
        where: {
            id: id,
        },
    });

    res.status(200).json(formatSuccessResponse(deletedUser));
});
