import { Response, Request } from 'express';
import { PostReaction, PrismaClient, ReactionType } from '@prisma/client';
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
 * Create a new post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createOrUpdatePostReaction = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        authorId: z.number(),
        postId: z.number(),
        type: z.enum([ReactionType.DOWNVOTE, ReactionType.UPVOTE]),
    });

    try {
        const { authorId, postId, type } = createSchema.parse(req.body);

        const createdPostReaction = await prisma.postReaction.upsert({
            where: {
                authorId_postId: { authorId, postId },
            },
            update: {
                type: type,
            },
            create: {
                type,
                authorId,
                postId,
            },
        });

        res.status(201).json({ message: 'Reaction created/updated.', reaction: createdPostReaction });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Get all post reactions.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPostReactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const postReactions = await prisma.postReaction.findMany({
            include: {
                author: true,
                post: true,
            },
        });

        res.status(200).json({ reactions: postReactions });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const postReactionId = await integerValidator.parseAsync(req.params.postReactionId);
        const postReaction = await prisma.postReaction.findUnique({
            where: {
                id: postReactionId,
            },
            include: {
                author: true,
                post: true,
            },
        });

        res.status(200).json({ reaction: postReaction });
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
 * Get all post reactions from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostReactionsByAuthor = async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    try {
        const { authorId } = getSchema.parse(req.body);
        const postReactions = await prisma.postReaction.findMany({
            where: {
                authorId: authorId,
            },
            include: {
                author: true,
                post: true,
            },
        });

        res.status(200).json({ reactions: postReactions });
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
 * Delete a post reaction.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deletePostReaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const postReactionId = await integerValidator.parseAsync(req.params.postReactionId);
        await prisma.postReaction.delete({ where: { id: postReactionId } });

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
