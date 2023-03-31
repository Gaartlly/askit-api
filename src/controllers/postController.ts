import { Response, Request } from 'express';
import { z } from 'zod';
import { asyncHandler, formatSuccessResponse } from '../utils/responseHandler';
import prismaClient from '../services/prisma/prismaClient';
import integerValidator from '../utils/integerValidator';
import validateUserIdentity from '../services/tokenJwtService/validateUserIdentity';
import { File, Post, Tag } from '@prisma/client';

/**
 * Create a new post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1).max(255),
        authorId: z.number().int(),
        tags: z.array(
            z.object({
                key: z.string().min(1).max(255),
                categoryId: z.number(),
            })
        ),
    });

    const { title, content, authorId, tags } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const createdPost: Post & { tags: Tag[]; files: File[] } = await prismaClient.post.create({
        data: {
            title,
            content,
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
            files: true,
        },
    });

    res.status(201).json(formatSuccessResponse(createdPost));
});

/**
 * Update a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).max(255).optional(),
        authorId: z.number().int().optional(),
        tags: z
            .array(
                z.object({
                    key: z.string().min(1).max(255),
                    categoryId: z.number(),
                })
            )
            .optional(),
    });

    const id = await integerValidator.parseAsync(req.params.postId);

    const { title, content, authorId, tags } = updateSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const updatedPost: Post & { tags: Tag[]; files: File[] } = await prismaClient.post.update({
        where: { id },
        data: {
            title,
            content,
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
            files: true,
        },
    });

    res.status(200).json(formatSuccessResponse(updatedPost));
});

/**
 * Update a post, disconnecting a tag from it.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const disconnectTagFromPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const disconnectSchema = z.object({
        postId: z.number().int(),
        tagId: z.number().int(),
    });

    const { postId, tagId } = disconnectSchema.parse(req.body);

    const post = await prismaClient.post.findUniqueOrThrow({
        where: {
            id: postId,
        },
    });

    if (!validateUserIdentity(post.authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const updatedPost: Post & { tags: Tag[] } = await prismaClient.post.update({
        where: {
            id: postId,
        },
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

    res.status(200).json(formatSuccessResponse(updatedPost));
});

/**
 * Get all posts.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const posts: (Post & { tags: Tag[]; files: File[] })[] = await prismaClient.post.findMany({
        include: {
            tags: true,
            files: true,
        },
    });

    res.status(200).json(formatSuccessResponse(posts));
});

/**
 * Get a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.postId);

    const post: Post & { tags: Tag[]; files: File[] } = await prismaClient.post.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            tags: true,
            files: true,
        },
    });

    res.status(200).json(formatSuccessResponse(post));
});

/**
 * Get all posts from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostsByAuthor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    const { authorId } = getSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const posts: (Post & { tags: Tag[]; files: File[] })[] = await prismaClient.post.findMany({
        where: {
            authorId,
        },
        include: {
            tags: true,
            files: true,
        },
    });

    res.status(200).json(formatSuccessResponse(posts));
});

/**
 * Delete a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.postId);

    const post = await prismaClient.post.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(post.authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const deletedPost = await prismaClient.post.delete({
        where: {
            id,
        },
    });

    res.status(200).json(formatSuccessResponse(deletedPost));
});
