import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { any, string, number } from 'zod';

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

const createCommentSchema = z.object({
    text: string(),
    category: string(),
    postId: number(),
    parentCommentId: number().optional(),
    files: any().optional(),
});

const updateCommentSchema = z.object({
    text: string().optional(),
    category: string().optional(),
    postId: number().optional(),
    parentCommentId: number().optional(),
    upvotes: number().optional(),
    downvotes: number().optional(),
    files: any().optional(),
});

/**
 * Get all comments.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments = await prisma.comment.findMany();

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
        const authorId = integerValidator.parse(req.params.authorId);

        const comments = await prisma.comment.findMany({
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
    try {
        const { text, category, files, postId, parentCommentId } = createCommentSchema.parse(req.body);

        const comment = await prisma.comment.create({
            data: {
                text,
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
        const commentId = integerValidator.parse(req.params.commentId);

        const deletedComment = await prisma.comment.delete({
            where: { id: commentId },
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
    try {
        const commentId = integerValidator.parse(req.params.commentId);

        const { text, category, upvotes, downvotes, postId, parentCommentId } = updateCommentSchema.parse(req.body);

        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                text,
                category,
                upvotes,
                downvotes,
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