import { Response, Request } from 'express';
import { Post, PostReaction, ReactionType, User } from '@prisma/client';
import { asyncHandler, formatSuccessResponse } from '../utils/responseHandler';
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
 * Create a new post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdatePostReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        postId: z.number(),
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]),
    });

    const { authorId, postId, type } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const createdPostReaction: PostReaction & { author: User; post: Post } = await prismaClient.postReaction.upsert({
        where: {
            authorId_postId: { authorId, postId },
        },
        update: {
            type,
        },
        create: {
            type,
            authorId,
            postId,
        },
        include: {
            author: true,
            post: true,
        },
    });

    res.status(201).json(formatSuccessResponse(createdPostReaction));
});

/**
 * Get all post reactions.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPostReactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const postReactions: (PostReaction & { author: User; post: Post })[] = await prismaClient.postReaction.findMany({
        include: {
            author: true,
            post: true,
        },
    });

    res.status(200).json(formatSuccessResponse(postReactions));
});

/**
 * Get a post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.postReactionId);

    const postReaction: PostReaction & { author: User; post: Post } = await prismaClient.postReaction.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            author: true,
            post: true,
        },
    });

    if (!validateUserIdentity(postReaction.authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    res.status(200).json(formatSuccessResponse(postReaction));
});

/**
 * Get all post reactions from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReactionsByAuthor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    const { authorId } = getSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const postReactions: (PostReaction & { author: User; post: Post })[] = await prismaClient.postReaction.findMany({
        where: {
            authorId,
        },
        include: {
            author: true,
            post: true,
        },
    });

    res.status(200).json(formatSuccessResponse(postReactions));
});

/**
 * Delete a post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deletePostReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.postReactionId);

    const postReaction = await prismaClient.postReaction.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(postReaction.authorId, req.headers.authorization)) throw new Error('Unauthorized user');

    const deletedPostReaction: PostReaction = await prismaClient.postReaction.delete({
        where: {
            id,
        },
    });

    res.status(200).json(formatSuccessResponse(deletedPostReaction));
});
