import { Response, Request } from 'express';
import { CommentReport, Comment, Tag } from '@prisma/client';
import { asyncHandler, formatSuccessResponse, UnauthorizedError } from '../utils/responseHandler';
import validateUserIdentity from '../services/tokenJwtService/validateUserIdentity';
import prismaClient from '../services/prisma/prismaClient';
import { UserWithoutPassword } from '../utils/interfaces';
import { z } from 'zod';

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
 * Create a new or update an existing comment report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdateCommentReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        commentId: z.number(),
        reason: z.string().min(1).max(255),
        tags: z
            .array(
                z.object({
                    key: z.string().min(1).max(255),
                    categoryId: z.number(),
                })
            )
            .optional(),
    });

    const { authorId, commentId, reason, tags = [] } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const createdOrUpdatedCommentReport: CommentReport & { comment: Comment; tags: Tag[]; author: UserWithoutPassword } =
        await prismaClient.commentReport.upsert({
            where: {
                authorId_commentId: {
                    authorId,
                    commentId,
                },
            },
            update: {
                reason: reason,
                tags: {
                    set: [],
                    connectOrCreate: tags.map((tag) => {
                        const { key, categoryId } = tag;
                        return {
                            where: {
                                key_categoryId: {
                                    key,
                                    categoryId,
                                },
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
                                key_categoryId: {
                                    key,
                                    categoryId,
                                },
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
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        course: true,
                        password: false,
                        role: false,
                        status: false,
                    },
                },
                comment: true,
            },
        });

    res.status(200).json(formatSuccessResponse(createdOrUpdatedCommentReport));
});

/**
 * Create a new comment report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createCommentReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        commentId: z.number(),
        reason: z.string().min(1).max(255),
        tags: z
            .array(
                z.object({
                    key: z.string().min(1).max(255),
                    categoryId: z.number(),
                })
            )
            .optional(),
    });

    const { authorId, commentId, reason, tags = [] } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const existingCommentReport = await prismaClient.commentReport.findFirst({
        where: {
            AND: {
                authorId,
                commentId,
            },
        },
    });

    if (existingCommentReport) throw new Error('A report already exists with the same authorId and commentId.');

    const createdCommentReport: CommentReport & { comment: Comment; tags: Tag[]; author: UserWithoutPassword } =
        await prismaClient.commentReport.create({
            data: {
                reason,
                commentId,
                authorId,
                tags: {
                    connectOrCreate: tags.map((tag) => {
                        const { key, categoryId } = tag;
                        return {
                            where: {
                                key_categoryId: {
                                    key,
                                    categoryId,
                                },
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
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        course: true,
                        password: false,
                        role: false,
                        status: false,
                    },
                },
                comment: true,
            },
        });

    res.status(201).json(formatSuccessResponse(createdCommentReport));
});

/**
 * Update an existing comment report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateCommentReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number().optional(),
        commentId: z.number().optional(),
        reason: z.string().min(1).max(255).optional(),
        tags: z
            .array(
                z.object({
                    key: z.string().min(1).max(255),
                    categoryId: z.number(),
                })
            )
            .optional(),
    });

    const id = await integerValidator.parseAsync(req.params.commentReportId);
    const { authorId, commentId, reason, tags = [] } = createSchema.parse(req.body);

    const commentReport = await prismaClient.commentReport.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(commentReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const updatedCommentReport: CommentReport & { comment: Comment; tags: Tag[]; author: UserWithoutPassword } =
        await prismaClient.commentReport.update({
            where: {
                id,
            },
            data: {
                reason,
                commentId,
                authorId,
                tags: {
                    connectOrCreate: tags.map((tag) => {
                        const { key, categoryId } = tag;
                        return {
                            where: {
                                key_categoryId: {
                                    key,
                                    categoryId,
                                },
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
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        course: true,
                        password: false,
                        role: false,
                        status: false,
                    },
                },
                comment: true,
            },
        });

    res.status(200).json(formatSuccessResponse(updatedCommentReport));
});

/**
 * Update a comment report, disconnecting a tag from it.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const disconnectTagFromCommentReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        commentReportId: z.number().int(),
        tagId: z.number().int(),
    });

    const { commentReportId, tagId } = updateSchema.parse(req.body);

    const commentReport: CommentReport = await prismaClient.commentReport.findUniqueOrThrow({
        where: {
            id: commentReportId,
        },
    });

    if (!validateUserIdentity(commentReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const updatedCommentReport: CommentReport & { tags: Tag[] } = await prismaClient.commentReport.update({
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

    res.status(200).json(formatSuccessResponse(updatedCommentReport));
});

/**
 * Get all commentReports.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllCommentReports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const commentReports: (CommentReport & { comment: Comment; tags: Tag[]; author: UserWithoutPassword })[] =
        await prismaClient.commentReport.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        course: true,
                        password: false,
                        role: false,
                        status: false,
                    },
                },
                comment: true,
                tags: true,
            },
        });

    res.status(200).json(formatSuccessResponse(commentReports));
});

/**
 * Get a commentReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.commentReportId);

    const commentReport: CommentReport & { comment: Comment; tags: Tag[]; author: UserWithoutPassword } =
        await prismaClient.commentReport.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        course: true,
                        password: false,
                        role: false,
                        status: false,
                    },
                },
                comment: true,
                tags: true,
            },
        });

    if (!validateUserIdentity(commentReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    res.status(200).json(formatSuccessResponse(commentReport));
});

/**
 * Get all commentReports from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReportsByAuthor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    const { authorId } = getSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const commentReports: (CommentReport & { comment: Comment; tags: Tag[] })[] = await prismaClient.commentReport.findMany({
        where: {
            authorId,
        },
        include: {
            comment: true,
            tags: true,
        },
    });

    res.status(200).json(formatSuccessResponse(commentReports));
});

/**
 * Delete a commentReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteCommentReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.commentReportId);

    const commentReport: CommentReport = await prismaClient.commentReport.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(commentReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const deletedCommentReport: CommentReport = await prismaClient.commentReport.delete({
        where: {
            id,
        },
    });

    res.status(200).json(formatSuccessResponse(deletedCommentReport));
});
