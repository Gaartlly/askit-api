import { Response, Request } from 'express';
import { PostReport, Tag, Post } from '@prisma/client';
import { asyncHandler, formatSuccessResponse, UnauthorizedError } from '../utils/responseHandler';
import prismaClient from '../services/prisma/prismaClient';
import validateUserIdentity from '../services/tokenJwtService/validateUserIdentity';
import { z } from 'zod';
import { UserWithoutPassword } from '../utils/interfaces';

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

const tagSchema = z.object({
    key: z.string().min(1).max(255),
    categoryId: z.number(),
});

const includeFields = {
    tags: true,
    author: {
        select: {
            id: true,
            name: true,
            email: true,
            course: true,
        },
    },
    post: true,
};

/**
 * Create a new or update an existing post report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdatePostReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createOrUpdateSchema = z.object({
        authorId: z.number(),
        postId: z.number(),
        reason: z.string().min(1).max(255),
        tags: z.array(tagSchema).optional(),
    });

    const { authorId, postId, reason, tags = [] } = createOrUpdateSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const createdOrUpdatedPostReport: PostReport & { post: Post; tags: Tag[]; author: UserWithoutPassword } =
        await prismaClient.postReport.upsert({
            where: {
                authorId_postId: {
                    authorId,
                    postId,
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
                postId,
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
            include: includeFields,
        });

    res.status(200).json(formatSuccessResponse(createdOrUpdatedPostReport));
});

/**
 * Create a new post report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createPostReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        postId: z.number(),
        reason: z.string().min(1).max(255),
        tags: z.array(tagSchema).optional(),
    });

    const { authorId, postId, reason, tags = [] } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const existingPostReport = await prismaClient.postReport.findFirst({
        where: {
            AND: {
                authorId,
                postId,
            },
        },
    });

    if (existingPostReport) throw new Error('A report already exists with the same authorId and postId.');

    const createdPostReport: PostReport & { post: Post; tags: Tag[]; author: UserWithoutPassword } = await prismaClient.postReport.create({
        data: {
            reason,
            postId,
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
        include: includeFields,
    });

    res.status(201).json(formatSuccessResponse(createdPostReport));
});

/**
 * Update an existing post report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updatePostReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        reason: z.string().min(1).max(255).optional(),
        tags: z.array(tagSchema).optional(),
    });

    const id = await integerValidator.parseAsync(req.params.postReportId);
    const { reason, tags = [] } = createSchema.parse(req.body);

    const postReport = await prismaClient.postReport.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(postReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const updatedPostReport: PostReport & { post: Post; tags: Tag[]; author: UserWithoutPassword } = await prismaClient.postReport.update({
        where: {
            id,
        },
        data: {
            reason,
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
        include: includeFields,
    });

    res.status(200).json(formatSuccessResponse(updatedPostReport));
});

/**
 * Update a post report, disconnecting a tag from it.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const disconnectTagFromPostReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        postReportId: z.number().int(),
        tagId: z.number().int(),
    });

    const { postReportId, tagId } = updateSchema.parse(req.body);

    const postReport = await prismaClient.postReport.findUniqueOrThrow({
        where: {
            id: postReportId,
        },
    });

    if (!validateUserIdentity(postReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const updatedPostReport: PostReport & { tags: Tag[] } = await prismaClient.postReport.update({
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

    res.status(200).json(formatSuccessResponse(updatedPostReport));
});

/**
 * Get all postReports.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPostReports = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const postReports: (PostReport & { post: Post; author: UserWithoutPassword; tags: Tag[] })[] = await prismaClient.postReport.findMany({
        include: includeFields,
    });

    res.status(200).json(formatSuccessResponse(postReports));
});

/**
 * Get a postReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.postReportId);

    const postReport: PostReport & { post: Post; author: UserWithoutPassword; tags: Tag[] } =
        await prismaClient.postReport.findUniqueOrThrow({
            where: {
                id,
            },
            include: includeFields,
        });

    if (!validateUserIdentity(postReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    res.status(200).json(formatSuccessResponse(postReport));
});

/**
 * Get all postReports from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReportsByAuthor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    const { authorId } = getSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const postReport: (PostReport & { post: Post })[] = await prismaClient.postReport.findMany({
        where: {
            authorId,
        },
        include: {
            post: true,
            tags: true,
        },
    });

    res.status(200).json(formatSuccessResponse(postReport));
});

/**
 * Delete a postReport.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deletePostReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.postReportId);

    const postReport = await prismaClient.postReport.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(postReport.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const deletedPostReport: PostReport = await prismaClient.postReport.delete({ where: { id } });

    res.status(200).json(formatSuccessResponse(deletedPostReport));
});
