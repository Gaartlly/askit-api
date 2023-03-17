import { Response, Request } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../utils/bcryptUtil';

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
export const getUsers = async (res: Response): Promise<void> => {
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
        res.status(500).json({ message: 'Internal server error' });
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
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.enum([Role.ADMIN, Role.USER]),
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
                courseId
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
    const updateUserSchema = z.object({
        newName: z.string().min(1).max(255).optional(),
        newRole: z.enum([Role.ADMIN, Role.USER]),
        email: z.string().email().optional(),
        newEmail: z.string().email().optional(),
        newCourse: z.string().optional(),
        password: z.string().min(1).max(255).optional(),
        newPassword: z.string().min(1).max(255).optional(),
    }).refine((data) => 
        (data.email && !data.newEmail) || (!data.email && data.newEmail), {
            message: 'Email cannot be updated as some data is missing',
            path: ['email', 'newEmail']
        }
    ).refine((data) =>
        (data.password && !data.newPassword) || (!data.password && data.newPassword), {
            message: 'Password cannot be updated as some data is missing',
            path: ['password', 'password']
        }
    );

    try {
        const id = await integerValidator.parseAsync(req.body.tagId);
        const { newName, email, newEmail, newCourse, password, newPassword, newRole } = await updateUserSchema.parseAsync(req.body);

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        if(email && email !== user.email)
            throw new Error('Current email is wrong.');
            //res.status(400).json({ message: 'Current email is wrong!'})
        
        const resultComparison = await verifyPassword(password, user.password);
        if(password && !resultComparison)
            throw new Error('Current password is wrong.');
            //res.status(400).json({ message: 'Current password is wrong!'})

        await prisma.user.update({
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

        res.status(200).json({ message: 'User updated!' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'User not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

/**
 * Delete a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.body.tagId);

        await prisma.user.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({ message: 'User deleted!' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'User not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
