import { Response, Request } from 'express';
import { Reaction, PrismaClient, ReactionType } from '@prisma/client';
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
 * Create a new reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdateReaction = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        commentId: z.number().optional(),
        postId: z.number(),
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]),
    });

    try {
        const { authorId, commentId, postId, type } = createSchema.parse(req.body);

        const createdReaction = await prisma.reaction.upsert({
            where: {
                authorId_commentId_postId: { authorId, commentId, postId },
            },
            update: {
                type: type,
            },
            create: {
                type,
                authorId,
                postId,
                commentId,
            },
        });

        res.status(201).json({ message: 'Reaction created/updated.', reaction: createdReaction });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all reactions.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllReactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const reactions = await prisma.reaction.findMany({
            include: {
                author: true,
                comment: true,
                post: true,
            },
        });

        res.status(200).json({ reactions: reactions });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const reactionId = await integerValidator.parseAsync(req.params.reactionId);
        const reaction = await prisma.reaction.findUnique({
            where: {
                id: reactionId,
            },
            include: {
                author: true,
                comment: true,
                post: true,
            },
        });

        res.status(200).json({ reaction: reaction });
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
 * Get all reactions from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getReactionsByAuthor = async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    try {
        const { authorId } = getSchema.parse(req.body);
        const reactions = await prisma.reaction.findMany({
            where: {
                authorId: authorId,
            },
            include: {
                author: true,
                comment: true,
                post: true,
            },
        });

        res.status(200).json({ reactions: reactions });
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
 * Delete a reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const reactionId = await integerValidator.parseAsync(req.params.reactionId);
        await prisma.reaction.delete({ where: { id: reactionId } });

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
