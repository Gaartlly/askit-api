import { Response, Request } from 'express';
import { Tag } from '@prisma/client';
import prismaClient from '../services/prisma/prismaClient';
import { z } from 'zod';
import { asyncHandler, formatSuccessResponse } from '../utils/responseHandler';
import integerValidator from '../utils/integerValidator';

/**
 * Create a new tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createTag = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        key: z.string().min(1).max(255),
        categoryId: z.number().int(),
    });

    const { key, categoryId } = createSchema.parse(req.body);

    const createdTag = await prismaClient.tag.create({
        data: {
            key,
            categoryId
        },
    });

    res.status(201).json(formatSuccessResponse(createdTag));
});

/**
 * Update a tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateTag = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        key: z.string().min(1).max(255).optional(),
    });
    const id = await integerValidator.parseAsync(req.params.tagId);
    const { key } = updateSchema.parse(req.body);

    const updatedTag: Tag = await prismaClient.tag.update({
        where: {
            id
        },
        data: {
            key
        },
    });

    res.status(200).json(formatSuccessResponse(updatedTag));
});

/**
 * Get all tags.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllTags = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const tags = await prismaClient.tag.findMany();
    res.status(200).json(formatSuccessResponse(tags));
});

/**
 * Get a tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getTag = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.tagId);

    const tag = await prismaClient.tag.findUniqueOrThrow({
        where: {
            id
        }
    });
    
    res.status(200).json(formatSuccessResponse(tag));
});

/**
 * Delete a tag.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteTag = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.tagId);

    const deletedTag = await prismaClient.tag.deleteMany({ 
        where: { 
            id 
        } 
    });

    res.status(200).json(formatSuccessResponse(deletedTag));
});
