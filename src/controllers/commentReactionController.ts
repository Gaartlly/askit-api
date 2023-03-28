import { Response, Request } from 'express';
import { CommentReaction, PrismaClient, ReactionType } from '@prisma/client';
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
 * Create a new comment reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdateCommentReaction = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        commentId: z.number().optional(),
        postId: z.number(),
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]),
    });

    try {
        const { authorId, commentId, postId, type } = createSchema.parse(req.body);

        const createdCommentReaction = await prisma.commentReaction.upsert({
            where: {
                authorId_commentId: { authorId, commentId },
            },
            update: {
                type: type,
            },
            create: {
                type,
                authorId,
                commentId,
            },
        });

        res.status(201).json({ message: 'Reaction created/updated.', reaction: createdCommentReaction });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all comment reactions.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllCommentReactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentReactions = await prisma.commentReaction.findMany({
            include: {
                author: true,
                comment: true,
            },
        });

        res.status(200).json({ reactions: commentReactions });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a comment reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentReactionId = await integerValidator.parseAsync(req.params.commentReactionId);
        const commentReaction = await prisma.commentReaction.findUnique({
            where: {
                id: commentReactionId,
            },
            include: {
                author: true,
                comment: true,
            },
        });

        res.status(200).json({ reaction: commentReaction });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Reaction not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all comment reactions from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentReactionsByAuthor = async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    try {
        const { authorId } = getSchema.parse(req.body);
        const commentReactions = await prisma.commentReaction.findMany({
            where: {
                authorId: authorId,
            },
            include: {
                author: true,
                comment: true,
            },
        });

        res.status(200).json({ reactions: commentReactions });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Reaction not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Delete a comment reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteCommentReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentReactionId = await integerValidator.parseAsync(req.params.commentReactionId);
        await prisma.commentReaction.delete({ where: { id: commentReactionId } });

        res.status(200).json({ message: 'Reaction deleted.' });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Reaction not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
