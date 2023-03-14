import { Response, Request } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, verifyPassword } from '../utils/bcryptUtil';

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (_: Request, res: Response) => {
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
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create user
export const createUser = async (req: Request, res: Response) => {
    try {
        const createUserSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
            role: z.enum([Role.ADMIN, Role.USER]),
            status: z.boolean(),
            course: z.string(),
        });

        const { name, email, role, status, course } = createUserSchema.parse(req.body);
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
                course,
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
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', err: err.message });
    }
};

// Update user name
export const updateUserName = async (req: Request, res: Response) => {
    try {
        const updateUserNameSchema = z.object({
            id: z.number().int(),
            name: z.string().min(1).max(255),
        });

        const { id, name } = updateUserNameSchema.parse(req.body);

        await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        const userUpdated = await prisma.user.update({
            where: {
                id: id,
            },

            data: {
                name: name,
            },
        });

        res.status(200).json({
            message: 'User name updated!',
            user: {
                id: userUpdated.id,
                name: userUpdated.name,
            },
        });
    } catch (error) {
        res.status(400).json({ message: 'Unable to update name!', error: error.message });
    }
};

// Update user password
export const updateUserPassword = async (req: Request, res: Response) => {
    try {
        const updateUserPasswordSchema = z.object({
            id: z.number().int(),
            currentPassword: z.string().min(1).max(255),
            newPassword: z.string().min(1).max(255),
        });

        const { id, currentPassword } = updateUserPasswordSchema.parse(req.body);
        let { newPassword } = updateUserPasswordSchema.parse(req.body);

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        const resultComparison = verifyPassword(currentPassword, user.password);

        if (!resultComparison) throw new Error('Current password is wrong!');

        newPassword = await hashPassword(newPassword, 11);

        const userUpdated = await prisma.user.update({
            where: {
                id: id,
            },

            data: {
                password: newPassword,
            },
        });

        res.status(200).json({
            message: 'User password updated!',
            user: {
                id: userUpdated.id,
                name: userUpdated.name,
            },
        });
    } catch (error) {
        res.status(400).json({ message: 'Unable to update password!', error: error.message });
    }
};

// Update user email
export const updateUserEmail = async (req: Request, res: Response) => {
    try {
        const updateUserEmailSchema = z.object({
            id: z.number().int(),
            currentEmail: z.string().min(1).max(255),
            newEmail: z.string().min(1).max(255),
        });

        const { id, currentEmail, newEmail } = updateUserEmailSchema.parse(req.body);

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        if (user.email !== currentEmail) throw new Error('Current email is wrong!');

        const userUpdated = await prisma.user.update({
            where: {
                id: id,
            },

            data: {
                email: newEmail,
            },
        });

        res.status(200).json({
            message: 'User email updated!',
            user: {
                id: userUpdated.id,
                name: userUpdated.name,
                email: userUpdated.email,
            },
        });
    } catch (error) {
        res.status(400).json({ message: 'Unable to update email!', error: error.message });
    }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        await prisma.user.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        await prisma.user.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({ message: 'User deleted!' });
    } catch (error) {
        res.status(400).json({ message: 'Unable to deleted user!', error: error.message });
    }
};
