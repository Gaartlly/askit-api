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
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create user
export const createUser = async (req: Request, res: Response) => {
    const createUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        role: z.enum([Role.ADMIN, Role.USER]),
        status: z.boolean(),
        course: z.string(),
    });
    try {
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
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


export const updateUser = async (req: Request, res: Response) => {
    const updateUserSchema = z.object({
        newName: z.string().min(1).max(255).optional(),
        newRole: z.enum([Role.ADMIN, Role.USER]),
        email: z.string().optional(),
        newEmail: z.string().optional(),
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
            return res.status(400).json({ message: 'Current email is wrong!'})
        
        const resultComparison = verifyPassword(password, user.password);
        if(password && !resultComparison)
            return res.status(400).json({ message: 'Current password is wrong!'})

        await prisma.user.update({
            where: {
                id
            },
            data:{
                name: newName,
                email: newEmail,
                course: newCourse,
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

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
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
