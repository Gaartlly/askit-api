import { Request, Response } from 'express';
import prismaClient from '../services/prisma/prismaClient';
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
 * Get all comments.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await prismaClient.comment.findMany();

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get all comments of a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentsByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
        const authorId = await integerValidator.parseAsync(req.params.authorId);

        const comments = await prismaClient.comment.findMany({
            where: { authorId },
        });

        res.status(200).json(comments);
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error });
        }
    }
};

/**
 * Create a new comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
    const createCommentSchema = z.object({
        authorId: z.number(),
        content: z.string().optional(),
        category: z.string(),
        postId: z.number(),
        parentCommentId: z.number().optional(),
        files: z.any().optional(),
    });
    try {
        const { authorId, content, category, files, postId, parentCommentId } = createCommentSchema.parse(req.body);

        const comment = await prismaClient.comment.create({
            data: {
                authorId,
                content,
                category,
                postId,
                parentCommentId,
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error', error: error });
        }
    }
};

/**
 * Delete a comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.params.commentId);

        const deletedComment = await prismaClient.comment.delete({
            where: { id },
        });

        res.status(200).json(deletedComment);
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Comment not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Update a comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateComment = async (req: Request, res: Response): Promise<void> => {
    const updateCommentSchema = z.object({
        content: z.string().optional(),
        category: z.string().optional(),
        postId: z.number().optional(),
        parentCommentId: z.number().optional(),
        files: z.any().optional(),
    });
    try {
        const id = await integerValidator.parseAsync(req.params.commentId);

        const { content, category, postId, parentCommentId } = updateCommentSchema.parse(req.body);

        const updatedComment = await prismaClient.comment.update({
            where: {
                id,
            },
            data: {
                content,
                category,
                postId,
                parentCommentId,
            },
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else if (error.code === 'P2025') {
            res.status(404).json({ message: 'Comment not found!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
