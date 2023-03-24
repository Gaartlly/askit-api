import { Response, Request } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../utils/bcryptUtil';
import validateUserIdentity from '../services/tokenJwtService/validateUserIdentity';

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
export const getUsers = async (_: Request, res: Response): Promise<void> => {
    try {
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
        res.status(200).json(users);
    } catch (error) {
        if (error.name === 'AdminOnly') {
            res.status(401).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message || 'Internal server error' });
        }
    }
};

/**
 * Create a new user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const createUserSchema = z.object({
        name: z.string().min(1).max(255),
        email: z
            .string()
            .email()
            .min(1)
            .max(255)
            .refine((val) => val.endsWith('@ufpr.br' || '@inf.ufpr.br')),
        password: z.string().min(8).max(255),
        role: z.enum([Role.ADMIN, Role.USER, Role.MOD]),
        status: z.boolean(),
        courseId: z.number(),
    });
    try {
        const { name, email, role, status, courseId } = createUserSchema.parse(req.body);
        let { password } = createUserSchema.parse(req.body);

        const hash = await hashPassword(password, 11);
        if (!hashPassword) throw new Error('Failed to encrypt password!');
        password = hash;

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role,
                status,
                courseId,
            },
        });

        res.status(201).json({
            message: 'User created!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error });
    }
};

/**
 * Update a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
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
            .refine(
                (data) => {
                    if ((!data.email && data.newEmail) || (data.email && !data.newEmail)) return false;
                    if ((data.password && !data.newPassword) || (!data.password && data.newPassword)) return false;

                    return true;
                },
                {
                    message: 'Email or password cannot be updated as some data is missing',
                }
            );

        const id = await integerValidator.parseAsync(req.params.userId);

        const { newName, email, newEmail, newCourseId, password, newPassword } = await updateUserSchema.parseAsync(req.body);

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        // validating if the target user of the update is the same as the token
        if (!validateUserIdentity(user.email, req.headers.authorization)) throw new Error('Unauthorized user');

        if (email && email !== user.email) throw new Error('Current email or password is wrong.');

        if (password) {
            const resultComparison = await verifyPassword(password, user.password);
            if (!resultComparison) throw new Error('Current email or password is wrong.');
        }

        const encriptedNewPassword = await hashPassword(newPassword, 11);
        if (!encriptedNewPassword) throw new Error('Unable to update password!');

        await prisma.user.update({
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

        res.status(200).json({ message: 'User updated!' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(400).json({ message: 'Unable to update user!' });
        } else {
            res.status(500).json({ message: error.message || 'Unable to update user!' });
        }
    }
};

/**
 * Delete a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = await integerValidator.parseAsync(req.params.userId);

        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: userId,
            },
        });

        // validating if the target user of the delete is the same as the token
        if (!validateUserIdentity(user.email, req.headers.authorization)) throw new Error();

        await prisma.user.delete({
            where: {
                id: userId,
            },
        });

        res.status(200).json({ message: 'User deleted!' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Unable to delete user!' });
        }
    }
};
