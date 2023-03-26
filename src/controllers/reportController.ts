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
        tags: z.array(
            z.object({
                key: z.string().min(1).max(255),
                categoryId: z.number(),
            })
        ),
    });

    try {
        const { authorId, commentId, postId, reason, tags } = createSchema.parse(req.body);

        const createdReport = await prisma.report.upsert({
            where: {
                authorId_commentId_postId: { authorId, commentId, postId },
            },
            update: {
                reason: reason,
                tags: {
                    set: [],
                    connectOrCreate: tags.map((tag) => {
                        const { key, categoryId } = tag;
                        return {
                            where: {
                                key_categoryId: { key, categoryId },
                            },
                            create: {
                                key,
                                categoryId,
                            },
                        };
                    }),
                },
            },
            create: {
                reason,
                postId,
                commentId,
                authorId,
                tags: {
                    connectOrCreate: tags.map((tag) => {
                        const { key, categoryId } = tag;
                        return {
                            where: {
                                key_categoryId: { key, categoryId },
                            },
                            create: {
                                key,
                                categoryId,
                            },
                        };
                    }),
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
 * Update a report, disconnecting a tag from it.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const disconnectTagFromReport = async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        reportId: z.number().int(),
        tagId: z.number().int(),
    });

    try {
        const { reportId, tagId } = updateSchema.parse(req.body);

        const updatedReport: Report = await prisma.report.update({
            where: { id: reportId },
            data: {
                tags: {
                    disconnect: {
                        id: tagId,
                    },
                },
            },
            include: {
                tags: true,
            },
        });

        res.status(200).json({ message: 'Tag disconnected.', report: updatedReport });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Comment not found!' });
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
        const id = await integerValidator.parseAsync(req.params.reportId);
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
 * Get all reports from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getReportsByAuthor = async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    try {
        const { authorId } = getSchema.parse(req.body);
        const report = await prisma.report.findMany({
            where: {
                authorId,
            },
            include: {
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
        const id = await integerValidator.parseAsync(req.params.reportId);
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
