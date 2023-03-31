import { Response, Request } from 'express';
import { Comment, CommentReaction, ReactionType, User } from '@prisma/client';
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
 * Create a new comment reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdateCommentReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        commentId: z.number(),
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]),
    });

    const { authorId, commentId, type } = createSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const createdCommentReaction: CommentReaction & { author: User; comment: Comment } = await prismaClient.commentReaction.upsert({
        where: {
            authorId_commentId: {
                authorId,
                commentId,
            },
        },
        update: {
            type: type,
        },
        create: {
            type,
            authorId,
            commentId,
        },
        include: {
            author: true,
            comment: true,
        },
    });

    res.status(201).json(formatSuccessResponse(createdCommentReaction));
});

/**
 * Get all comment reactions.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllCommentReactions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const commentReactions: (CommentReaction & { author: User; comment: Comment })[] = await prismaClient.commentReaction.findMany({
        include: {
            author: true,
            comment: true,
        },
    });

    res.status(200).json(formatSuccessResponse(commentReactions));
});

/**
 * Get a comment reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.commentReactionId);

    const commentReaction: CommentReaction & { author: User; comment: Comment } = await prismaClient.commentReaction.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            author: true,
            comment: true,
        },
    });

    if (!validateUserIdentity(commentReaction.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    res.status(200).json(formatSuccessResponse(commentReaction));
});

/**
 * Get all comment reactions from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReactionsByAuthor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    const { authorId } = getSchema.parse(req.body);

    if (!validateUserIdentity(authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const commentReactions: (CommentReaction & { author: User; comment: Comment })[] = await prismaClient.commentReaction.findMany({
        where: {
            authorId,
        },
        include: {
            author: true,
            comment: true,
        },
    });

    res.status(200).json(formatSuccessResponse(commentReactions));
});

/**
 * Delete a comment reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteCommentReaction = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.commentReactionId);

    const commentReaction: CommentReaction = await prismaClient.commentReaction.findUniqueOrThrow({
        where: {
            id,
        },
    });

    if (!validateUserIdentity(commentReaction.authorId, req.headers.authorization)) throw new UnauthorizedError('Unauthorized user');

    const deletedCommentReaction: CommentReaction = await prismaClient.commentReaction.delete({
        where: {
            id,
        },
    });

    res.status(200).json(formatSuccessResponse(deletedCommentReaction));
});
