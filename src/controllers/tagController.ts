import { Response, Request } from 'express';
import { Tag, PrismaClient, Role } from '@prisma/client';
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
 * Create a new tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createTag = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        key: z.string().min(1).max(255),
        categoryId: z.number().int(),
    });

    try {
        const { key, categoryId } = createSchema.parse(req.body);

        const createdTag = await prisma.tag.create({
            data: {
                key,
                categoryId,
            },
        });

        res.status(201).json({ message: 'Tag created.', tag: createdTag });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Update a tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateTag = async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        key: z.string().min(1).max(255).optional(),
        categoryId: z.number().int().optional(),
    });

    try {
        const tagId = await integerValidator.parseAsync(req.params.tagId);
        const { key, categoryId } = updateSchema.parse(req.body);

        const updatedTag: Tag = await prisma.tag.update({
            where: {
                id: tagId,
            },
            data: {
                key,
                categoryId,
            },
        });

        res.status(200).json({ message: 'Tag updated.', tag: updatedTag });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Tag not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all tags.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllTags = async (req: Request, res: Response): Promise<void> => {
    try {
        const tags = await prisma.tag.findMany();

        res.status(200).json({ tags: tags });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.tagId);
        const tag = await prisma.tag.findUnique({
            where: {
                id,
            },
        });

        res.status(200).json({ tag: tag });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Tag not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Delete a tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const tagId = await integerValidator.parseAsync(req.params.tagId);
        await prisma.tag.delete({ where: { id: tagId } });

        res.status(200).json({ message: 'Tag deleted.' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Tag not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
