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

export const create = async (req: Request, res: Response) => {
    const createSchema = z.object({
        key: z.string().min(1).max(255),
        category: z.string().min(1).max(255),
        postId: z.number().int(),
    });

    try {
        const tag = createSchema.parse(req.body);

        const createdTag = await prisma.tag.create({
            data: { key: tag.key, category: tag.category, postId: tag.postId },
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

export const update = async (req: Request, res: Response) => {
    const updateSchema = z.object({
        key: z.string().min(1).max(255).optional(),
        category: z.string().min(1).max(255).optional(),
        postId: z.number().int().optional(),
    });

    try {
        const id = integerValidator.parse(req.body.tagId);
        const tag = updateSchema.parse(req.body);

        const updatedTag: Tag = await prisma.tag.update({
            where: { id },
            data: { key: tag.key, category: tag.category, postId: tag.postId },
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

export const index = async (req: Request, res: Response) => {
    try {
        const tags = await prisma.tag.findMany();

        res.status(200).json({ tags: tags });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

export const show = async (req: Request, res: Response) => {
    try {
        const id = integerValidator.parse(req.body.tagId);
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

export const destroy = async (req: Request, res: Response) => {
    try {
        const id = integerValidator.parse(req.body.tagId);
        await prisma.tag.deleteMany({ where: { id } });

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
