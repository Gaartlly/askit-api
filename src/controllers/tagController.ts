import { Response, Request } from 'express';
import { Tag, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { asyncHandler, formatSuccessResponse } from '../utils/responseHandler';

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

    const createdTag = await prisma.tag.create({
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
        category: z.string().min(1).max(255).optional(),
        postId: z.number().int().optional(),
    });
    const id = await integerValidator.parseAsync(req.params.tagId);
    const { key } = updateSchema.parse(req.body);

    const updatedTag: Tag = await prisma.tag.update({
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
    const tags = await prisma.tag.findMany();
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
    const id = await integerValidator.parseAsync(req.body.tagId);

    const tag = await prisma.tag.findUnique({
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
    const id = await integerValidator.parseAsync(req.body.tagId);

    const deletedTag = await prisma.tag.deleteMany({ 
        where: { 
            id 
        } 
    });

    res.status(200).json(formatSuccessResponse(deletedTag));
});