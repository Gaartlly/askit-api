import { Response, Request } from 'express';
import { PostReport, Tag, Post, User } from '@prisma/client';
import { asyncHandler, formatSuccessResponse, UnauthorizedError } from '../utils/responseHandler';
import prismaClient from '../services/prisma/prismaClient';
import validateUserIdentity from '../services/tokenJwtService/validateUserIdentity';
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
 * Create a new post report.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdatePostReport = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

    const { authorId, postId, reason, tags } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const createdPostReport: PostReport & { post: Post; author: User; tags: Tag[] } = await prismaClient.postReport.upsert({
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
        include: {
            tags: true,
            author: true,
            post: true,
        },
    });

    res.status(201).json(formatSuccessResponse(createdPostReport));
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
    const postReports: (PostReport & { post: Post; author: User; tags: Tag[] })[] = await prismaClient.postReport.findMany({
        include: {
            author: true,
            post: true,
            tags: true,
        },
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

    const postReport: PostReport & { post: Post; author: User; tags: Tag[] } = await prismaClient.postReport.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            author: true,
            post: true,
            tags: true,
        },
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
