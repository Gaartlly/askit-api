import { Response, Request } from 'express';
import { Report, PrismaClient } from '@prisma/client';
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
 * Create a new report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdateReport = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        commentId: z.number().optional(),
        postId: z.number(),
        reason: z.string().min(1).max(255),
    });

    try {
        const { authorId, commentId, postId, reason } = createSchema.parse(req.body);

        const createdReport = await prisma.report.upsert({
            where: {
                authorId_commentId_postId: { authorId, commentId, postId },
            },
            update: {
                reason: reason,
            },
            create: {
                reason: reason,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
                comment: {
                    connect: {
                        id: commentId,
                    },
                },
                post: {
                    connect: {
                        id: postId,
                    },
                },
            },
        });

        res.status(201).json({ message: 'Report created/updated.', report: createdReport });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all reports.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await prisma.report.findMany({
            include: {
                author: true,
                comment: true,
                post: true,
            },
        });

        res.status(200).json({ reports: reports });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.body.reportId);
        const report = await prisma.report.findUnique({
            where: {
                id,
            },
            include: {
                author: true,
                comment: true,
                post: true,
            },
        });

        res.status(200).json({ report: report });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Report not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Delete a report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.body.reportId);
        await prisma.report.delete({ where: { id } });

        res.status(200).json({ message: 'Report deleted.' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Report not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
