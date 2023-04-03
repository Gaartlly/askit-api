import { Response, Request } from 'express';
import cloudinary from '../config/cloudinaryConfig';
import { z } from 'zod';
import { BadRequestError, asyncHandler, formatSuccessResponse } from '../utils/responseHandler';
import prismaClient from '../services/prisma/prismaClient';
import integerValidator from '../utils/integerValidator';
import { UploadApiResponse } from 'cloudinary';
import { File } from '@prisma/client';

/**
 * Upload a file.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const uploadFile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.query.postId) throw new BadRequestError('Query param error. Need to send postId correctly');
    const postId: number = await integerValidator.parseAsync(req.query.postId);

    let commentId: number;
    if (req.query.commentId) commentId = await integerValidator.parseAsync(req.query.commentId);

    const fileUploaded: File = await prismaClient.file.create({
        data: {
            title: req.file.filename,
            path: req.file.path,
            postId: postId,
            commentId: commentId,
        },
    });

    res.status(200).json(formatSuccessResponse({ file: fileUploaded }));
});

/**
 * Get all filles.
 *
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllFiles = asyncHandler(async (_: Request, res: Response): Promise<void> => {
    const files: File[] = await prismaClient.file.findMany();
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

    const file: File = await prismaClient.file.findFirst({
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

    const deletedFile: File = await prismaClient.file.delete({
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

    const result: UploadApiResponse = await cloudinary.uploader.upload(newPath, {
        resource_type: 'image',
    });

    const fileUpdated: File = await prismaClient.file.update({
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
