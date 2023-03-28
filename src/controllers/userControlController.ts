import { Response, Request } from 'express';
import { UserControl, PrismaClient, Role } from '@prisma/client';
import { z } from 'zod';

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
 * Create a new userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createUserControl = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        reason: z.string().min(1).max(255),
        userId: z.number().int(),
    });

    try {
        const { reason, userId } = createSchema.parse(req.body);

        const createdUserControl = await prisma.userControl.create({
            data: {
                reason,
                userId,
            },
        });

        res.status(201).json({ message: 'UserControl created.', userControl: createdUserControl });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Update a userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateUserControl = async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        reason: z.string().min(1).max(255).optional(),
        userId: z.number().int().optional(),
    });

    try {
        const userControlId = await integerValidator.parseAsync(req.params.userControlId);
        const { reason, userId } = updateSchema.parse(req.body);

        const updatedUserControl: UserControl = await prisma.userControl.update({
            where: {
                id: userControlId,
            },
            data: {
                reason,
                userId,
            },
        });

        res.status(200).json({ message: 'UserControl updated.', userControl: updatedUserControl });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'UserControl not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all userControls.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllUserControls = async (req: Request, res: Response): Promise<void> => {
    try {
        const userControls = await prisma.userControl.findMany();

        res.status(200).json({ userControls: userControls });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getUserControl = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.userControlId);
        const userControl = await prisma.userControl.findUnique({
            where: {
                id,
            },
        });

        res.status(200).json({ userControl: userControl });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'UserControl not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Delete a userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteUserControl = async (req: Request, res: Response): Promise<void> => {
    try {
        const userControlId = await integerValidator.parseAsync(req.params.userControlId);
        await prisma.userControl.delete({ where: { id: userControlId } });

        res.status(200).json({ message: 'UserControl deleted.' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'UserControl not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
