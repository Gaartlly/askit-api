import { Response, Request } from 'express';
import { Post, PostReaction, ReactionType } from '@prisma/client';
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

const includeFields = {
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
 * Create a new or update an existing post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdatePostReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createOrUpdateSchema = z.object({
        authorId: z.number(),
        postId: z.number(),
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]),
    });

    const { authorId, postId, type } = createOrUpdateSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const createdOrUpdatedPostReaction: PostReaction & { author: UserWithoutPassword; post: Post } = await prismaClient.postReaction.upsert(
        {
            where: {
                authorId_postId: {
                    authorId,
                    postId,
                },
            },
            update: {
                type: type,
            },
            create: {
                type,
                authorId,
                postId,
            },
            include: includeFields,
        }
    );

    res.status(200).json(formatSuccessResponse(createdOrUpdatedPostReaction));
});

/**
 * Create a new post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createPostReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        postId: z.number(),
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]),
    });

    const { authorId, postId, type } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const existingPostReaction = await prismaClient.postReaction.findFirst({
        where: {
            AND: {
                authorId,
                postId,
            },
        },
    });

    if (existingPostReaction) throw new Error('A reaction already exists with the same authorId and postId.');

    const createdPostReaction: PostReaction & { author: UserWithoutPassword; post: Post } = await prismaClient.postReaction.create({
        data: {
            type,
            authorId,
            postId,
        },
        include: includeFields,
    });

    res.status(201).json(formatSuccessResponse(createdPostReaction));
});

/**
 * Update an existing post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updatePostReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]).optional(),
    });

    const id = await integerValidator.parseAsync(req.params.postReactionId);
    const { type } = updateSchema.parse(req.body);
    const postReaction = await prismaClient.postReaction.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(postReaction.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const updatedPostReaction: PostReaction & { author: UserWithoutPassword; post: Post } = await prismaClient.postReaction.update({
        where: {
            id,
        },
        data: {
            type,
        },
        include: includeFields,
    });

    res.status(200).json(formatSuccessResponse(updatedPostReaction));
});

/**
 * Get all post reactions.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPostReactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const postReactions: (PostReaction & { author: UserWithoutPassword; post: Post })[] = await prismaClient.postReaction.findMany({
        include: includeFields,
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

    const postReaction: PostReaction & { author: UserWithoutPassword; post: Post } = await prismaClient.postReaction.findUniqueOrThrow({
        where: {
            id,
        },
        include: includeFields,
    });

    if (!validateUserIdentity(postReaction.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

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

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const postReactions: (PostReaction & { post: Post })[] = await prismaClient.postReaction.findMany({
        where: {
            authorId,
        },
        include: {
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

    if (!validateUserIdentity(postReaction.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const deletedPostReaction: PostReaction = await prismaClient.postReaction.delete({
        where: {
            id,
        },
    });

    res.status(200).json(formatSuccessResponse(deletedPostReaction));
});
