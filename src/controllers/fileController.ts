import { Response, Request } from 'express';
import cloudinary from '../config/cloudinaryConfig';
import { z } from 'zod';
import { asyncHandler, formatSuccessResponse } from '../utils/responseHandler';
import prismaClient from '../services/prisma/prismaClient';
import integerValidator from '../utils/integerValidator';

/** 
 * Upload a file.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const uploadFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const uploadFileSchema = z.object({
        title: z.string().min(1).max(255),
        path: z.string().min(1),
        postId: z.number().int(),
        commentId: z.number().int(),
    });
    const postId = await integerValidator.parseAsync(req.params.postId);
    const { title, path, commentId } = uploadFileSchema.parse(req.body);

    const result = await cloudinary.uploader.upload(path, {
        resource_type: 'image',
    });

        const fileUploaded = await prismaClient.file.create({
            data: {
                title: title,
                path: result.secure_url || result.url,
                postId: postId,
                commentId: commentId,
            },
        });

    res.status(200).json(formatSuccessResponse(fileUploaded));
});

/**
 * Get all filles.
 *
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllFiles = asyncHandler(async (_: Request, res: Response): Promise<void> => {
    const files = await prismaClient.file.findMany();
    res.status(200).json(formatSuccessResponse(files));
});

/**
 * Get a file by id.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getFileById = async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.fileId);

    const file = await prismaClient.file.findFirst({
        where: {
            id,
        },
    });

    res.status(200).json(formatSuccessResponse(file));
};

/**
 * Delete a file.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.fileId);

        const deletedFile = await prismaClient.file.delete({
            where: {
                id,
            },
        });

    res.status(200).json(formatSuccessResponse(deletedFile));
});

/**
 * Update a file.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateFileSchema = z.object({
        newTitle: z.string().min(1).max(255),
        newPath: z.string().min(1),
    });
    const id = await integerValidator.parseAsync(req.params.fileId);

    const { newTitle, newPath } = updateFileSchema.parse(req.body);

    const result = await cloudinary.uploader.upload(newPath, {
        resource_type: 'image',
    });

    const fileUpdated = await prismaClient.file.update({
        where: {
            id,
        },
        data: {
            title: newTitle,
            path: result.secure_url || result.url,
        },
    });

    res.status(200).json(formatSuccessResponse(fileUpdated));
});