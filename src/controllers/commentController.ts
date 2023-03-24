import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { formatSuccessResponse } from '../utils/responseHandler';
import { asyncHandler } from '../utils/responseHandler';
import { integerValidator } from '../utils/zod';

const prisma = new PrismaClient();


/**
 * Get all comments.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const getAllComments = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const comments = await prisma.comment.findMany();
    res.status(200).json(formatSuccessResponse(comments));
});

/**
 * Get all comments of a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentsByUserId = async (req: Request, res: Response): Promise<void> => {
    const authorId = await integerValidator.parseAsync(req.params.authorId);

    const comments = await prisma.comment.findMany({
        where: { authorId }
    });

    res.status(200).json(formatSuccessResponse(comments));
};

/**
 * Create a new comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
    const createCommentSchema = z.object({
        authorId: z.number(), 
        content: z.string().optional(),
        category: z.string(),
        postId: z.number(),
        parentCommentId: z.number().optional(),
        files: z.any().optional()
    });

    const { authorId, content, category, files, postId, parentCommentId } = createCommentSchema.parse(req.body);

    const comment = await prisma.comment.create({
        data: {
            authorId,
            content,
            category,
            postId,
            parentCommentId,
        },
    });

    res.status(201).json(formatSuccessResponse(comment));
};

/**
 * Delete a comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.commentId);

    const deletedComment = await prisma.comment.delete({
        where: { id },
    });

    res.status(200).json(formatSuccessResponse(deletedComment));
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
        files: z.any().optional()
    });

    const id = await integerValidator.parseAsync(req.params.commentId);

    const { content, category, postId, parentCommentId } = updateCommentSchema.parse(req.body);

    const updatedComment = await prisma.comment.update({
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

    res.status(200).json(formatSuccessResponse(updatedComment));
};
