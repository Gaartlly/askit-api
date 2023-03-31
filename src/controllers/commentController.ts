import { NextFunction, Request, Response } from 'express';
import prismaClient from '../services/prisma/prismaClient';
import { z } from 'zod';
import { formatSuccessResponse, asyncHandler } from '../utils/responseHandler';
import integerValidator from '../utils/integerValidator';
import { Comment } from '@prisma/client';

/**
 * Get all comments.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllComments = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const comments = await prismaClient.comment.findMany();
    res.status(200).json(formatSuccessResponse(comments));
});

/**
 * Get all comments of a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getCommentsByUserId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authorId = await integerValidator.parseAsync(req.params.userId);

    await prismaClient.user.findUniqueOrThrow({
        where: { id: authorId },
    });

    const comments: Comment[] = await prismaClient.comment.findMany({
        where: { authorId },
    });

    res.status(200).json(formatSuccessResponse(comments));
});

/**
 * Get all comments of a user.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getMyComments = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authorId = await integerValidator.parseAsync(req.params.userId);

    const comments: Comment[] = await prismaClient.comment.findMany({
        where: { authorId },
    });

    res.status(200).json(formatSuccessResponse(comments));
});

/**
 * Create a new comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createCommentSchema = z.object({
        authorId: z.number(),
        content: z.string().optional(),
        category: z.string(),
        postId: z.number(),
        parentCommentId: z.number().optional(),
        files: z.any().optional(),
    });

    const { authorId, content, category, files, postId, parentCommentId } = createCommentSchema.parse(req.body);

    await prismaClient.user.findUniqueOrThrow({
        where: { id: authorId },
    });

    await prismaClient.post.findUniqueOrThrow({
        where: { id: postId },
    });

    const comment: Comment = await prismaClient.comment.create({
        data: {
            authorId,
            content,
            category,
            postId,
            parentCommentId,
        },
    });

    res.status(201).json(formatSuccessResponse(comment));
});

/**
 * Delete a comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
export const deleteComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.commentId);

    const deletedComment: Comment = await prismaClient.comment.delete({
        where: { id },
    });

    res.status(200).json(formatSuccessResponse(deletedComment));
});

/**
 * Update a comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateComment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateCommentSchema = z.object({
        content: z.string().optional(),
        category: z.string().optional(),
        postId: z.number().optional(),
        parentCommentId: z.number().optional(),
        files: z.any().optional(),
    });

    const id = await integerValidator.parseAsync(req.params.commentId);

    const { content, category, postId, parentCommentId } = updateCommentSchema.parse(req.body);

    const updatedComment: Comment = await prismaClient.comment.update({
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
});
