import { Response, Request } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../utils/bcryptUtil';
import { asyncHandler, InternalServerError, UnauthorizedError } from '../utils/responseHandler';
import { formatSuccessResponse } from '../utils/responseHandler';

const prisma = new PrismaClient();

const integerValidator = z
    .string()
    .refine(
        (value) => {
            return /^\d+$/.test(value);
        },
        {
            message: 'Value must be a valid integer',
        }
    )
    .transform((value) => parseInt(value));

/**
 * Get all users.
 *
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await prisma.user.findMany({
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
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.enum([Role.ADMIN, Role.USER]),
        status: z.boolean(),
        courseId: z.number(),
    });
    const { name, email, role, status, courseId } = createUserSchema.parse(req.body);
    let { password } = createUserSchema.parse(req.body);

    const hash = await hashPassword(password, 11);

    if (!hashPassword) throw new InternalServerError('Failed to encrypt password!');

    password = hash;

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            role,
            status,
            courseId
        },
    });

    res.status(201).json(formatSuccessResponse({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        }
    }));
});

/**
 * Update a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateUserSchema = z.object({
        newName: z.string().min(1).max(255).optional(),
        newRole: z.enum([Role.ADMIN, Role.USER]).optional(),
        email: z.string().email().optional(),
        newEmail: z.string().email().optional(),
        newCourse: z.string().optional(),
        password: z.string().min(1).max(255).optional(),
        newPassword: z.string().min(1).max(255).optional(),
    }).refine((data) => 
        (data.email == data.newEmail) || (data.email && data.newEmail), {
            message: 'Email cannot be updated as some data is missing',
            path: ['email', 'newEmail'],
        }
    ).refine((data) =>
        (data.password == data.newPassword) || (data.password && data.newPassword), {
            message: 'Password cannot be updated as some data is missing',
            path: ['password', 'newPassword']
        }
    );

    const id = await integerValidator.parseAsync(req.params.userId);
    const { newName, email, newEmail, password, newPassword, newRole } = await updateUserSchema.parseAsync(req.body);

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: id,
        },
    });

    if(email && email !== user.email)
        throw new UnauthorizedError('Current email is wrong.');
    
    if(password) {
        const resultComparison = await verifyPassword(password, user.password);

        if(resultComparison)
            throw new UnauthorizedError('Current password is wrong.');
    }

    const userUpdated = await prisma.user.update({
        where: {
            id
        },
        data:{
            name: newName,
            email: newEmail,
            password: newPassword,
            role: newRole
        }
    });

    res.status(200).json(formatSuccessResponse(userUpdated));
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

    const deletedUser = await prisma.user.delete({
        where: {
            id: id
        }
    });

    res.status(200).json(formatSuccessResponse(deletedUser));
});
