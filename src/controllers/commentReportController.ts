import { Response, Request } from 'express';
import { CommentReport, PrismaClient } from '@prisma/client';
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
 * Create a new comment report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdateCommentReport = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        commentId: z.number(),
        reason: z.string().min(1).max(255),
        tags: z.array(
            z.object({
                key: z.string().min(1).max(255),
                categoryId: z.number(),
            })
        ),
    });

    try {
        const { authorId, commentId, reason, tags } = createSchema.parse(req.body);

        const createdCommentReport = await prisma.commentReport.upsert({
            where: {
                authorId_commentId: { authorId, commentId },
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
            include: {
                tags: true,
                author: true,
                comment: true,
            },
        });

        res.status(201).json({ message: 'Report created/updated.', report: createdCommentReport });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Update a comment report, disconnecting a tag from it.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const disconnectTagFromCommentReport = async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        commentReportId: z.number().int(),
        tagId: z.number().int(),
    });

    try {
        const { commentReportId, tagId } = updateSchema.parse(req.body);

        const updatedCommentReport: CommentReport = await prisma.commentReport.update({
            where: { id: commentReportId },
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

        res.status(200).json({ message: 'Tag disconnected.', report: updatedCommentReport });
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
 * Get all commentReports.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllCommentReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentReports = await prisma.commentReport.findMany({
            include: {
                author: true,
                comment: true,
                tags: true,
            },
        });

        res.status(200).json({ reports: commentReports });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a commentReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.commentReportId);
        const commentReport = await prisma.commentReport.findUnique({
            where: {
                id,
            },
            include: {
                author: true,
                comment: true,
                tags: true,
            },
        });

        res.status(200).json({ report: commentReport });
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
 * Get all commentReports from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReportsByAuthor = async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    try {
        const { authorId } = getSchema.parse(req.body);
        const commentReport = await prisma.commentReport.findMany({
            where: {
                authorId,
            },
            include: {
                comment: true,
            },
        });

        res.status(200).json({ reports: commentReport });
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
 * Delete a commentReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteCommentReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.commentReportId);
        await prisma.commentReport.delete({ where: { id } });

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
