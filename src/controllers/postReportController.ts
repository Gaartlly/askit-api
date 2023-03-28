import { Response, Request } from 'express';
import { PostReport, PrismaClient } from '@prisma/client';
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
 * Create a new post report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdatePostReport = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
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
        const { authorId, postId, reason, tags } = createSchema.parse(req.body);

        const createdPostReport = await prisma.postReport.upsert({
            where: {
                authorId_postId: { authorId, postId },
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

        res.status(201).json({ message: 'Report created/updated.', report: createdPostReport });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Update a post report, disconnecting a tag from it.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const disconnectTagFromPostReport = async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        postReportId: z.number().int(),
        tagId: z.number().int(),
    });

    try {
        const { postReportId, tagId } = updateSchema.parse(req.body);

        const updatedPostReport: PostReport = await prisma.postReport.update({
            where: { id: postReportId },
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

        res.status(200).json({ message: 'Tag disconnected.', report: updatedPostReport });
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
 * Get all postReports.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPostReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const postReports = await prisma.postReport.findMany({
            include: {
                author: true,
                post: true,
            },
        });

        res.status(200).json({ reports: postReports });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a postReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.postReportId);
        const postReport = await prisma.postReport.findUnique({
            where: {
                id,
            },
            include: {
                author: true,
                post: true,
            },
        });

        res.status(200).json({ report: postReport });
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
 * Get all postReports from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReportsByAuthor = async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    try {
        const { authorId } = getSchema.parse(req.body);
        const postReport = await prisma.postReport.findMany({
            where: {
                authorId,
            },
            include: {
                post: true,
            },
        });

        res.status(200).json({ report: postReport });
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
 * Delete a postReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deletePostReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.postReportId);
        await prisma.postReport.delete({ where: { id } });

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
