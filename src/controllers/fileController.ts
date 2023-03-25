import { Response, Request } from 'express';
import cloudinary from '../config/cloudinaryConfig';
import { PrismaClient } from '@prisma/client';
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
 * Upload a file.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    const uploadFileSchema = z.object({
        title: z.string().min(1).max(255),
        path: z.string().min(1),
        postId: z.number().int(),
        commentId: z.number().int(),
    });
    try {
        const postId = await integerValidator.parseAsync(req.body.postId);
        const { title, path, commentId } = uploadFileSchema.parse(req.body);

        const result = await cloudinary.uploader.upload(path, {
            resource_type: 'image',
        });

        const fileUploaded = await prisma.file.create({
            data: {
                title: title,
                path: result.secure_url || result.url,
                postId: postId,
                commentId: commentId,
            },
        });

        res.status(200).json({ message: 'File uploaded!', file: fileUploaded });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all filles.
 *
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllFiles = async (_: Request, res: Response): Promise<void> => {
    try {
        const files = await prisma.file.findMany();

        res.status(200).json({ files: files });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error!' });
    }
};

/**
 * Get a file by id.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getFileById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.fileId);

        const file = await prisma.file.findFirst({
            where: {
                id,
            },
        });

        res.status(200).json(file);
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'File not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Delete a file.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.fileId);

        await prisma.file.delete({
            where: {
                id,
            },
        });

        res.status(200).json({ message: 'File deleted.' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'File not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Update a file.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateFile = async (req: Request, res: Response): Promise<void> => {
    const updateFileSchema = z.object({
        newTitle: z.string().min(1).max(255),
        newPath: z.string().min(1),
    });
    try {
        const id = await integerValidator.parseAsync(req.params.fileId);

        const { newTitle, newPath } = updateFileSchema.parse(req.body);

        const result = await cloudinary.uploader.upload(newPath, {
            resource_type: 'image',
        });

        const fileUpdated = await prisma.file.update({
            where: {
                id,
            },
            data: {
                title: newTitle,
                path: result.secure_url || result.url,
            },
        });

        res.status(200).json({ message: 'File updated!', file: fileUpdated });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'File not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
