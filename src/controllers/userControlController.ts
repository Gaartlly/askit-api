import { Response, Request } from 'express';
import { UserControl } from '@prisma/client';
import { asyncHandler, formatSuccessResponse } from '../utils/responseHandler';
import prismaClient from '../services/prisma/prismaClient';
import { z } from 'zod';
import integerValidator from '../utils/integerValidator';

/**
 * Create a new userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createUserControl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        reason: z.string().min(1).max(255),
        userId: z.number().int(),
    });

    const { reason, userId } = createSchema.parse(req.body);

    const createdUserControl: UserControl = await prismaClient.userControl.create({
        data: {
            reason,
            userId,
        },
    });

    res.status(201).json(formatSuccessResponse(createdUserControl));
});

/**
 * Update a userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updateUserControl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        reason: z.string().min(1).max(255).optional(),
        userId: z.number().int().optional(),
    });

    const userControlId = await integerValidator.parseAsync(req.params.userControlId);
    const { reason, userId } = updateSchema.parse(req.body);

    const updatedUserControl: UserControl = await prismaClient.userControl.update({
        where: {
            id: userControlId,
        },
        data: {
            reason,
            userId,
        },
    });

    res.status(200).json(formatSuccessResponse(updatedUserControl));
});

/**
 * Get all userControls.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllUserControls = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userControls: UserControl[] = await prismaClient.userControl.findMany();

    res.status(200).json(formatSuccessResponse(userControls));
});

/**
 * Get a userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getUserControl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.params.userControlId);
    const userControl: UserControl = await prismaClient.userControl.findUnique({
        where: {
            id,
        },
    });

    res.status(200).json(formatSuccessResponse(userControl));
});

/**
 * Delete a userControl.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deleteUserControl = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userControlId = await integerValidator.parseAsync(req.params.userControlId);
    const userControl: UserControl = await prismaClient.userControl.delete({ where: { id: userControlId } });

    res.status(200).json(formatSuccessResponse(userControl));
});
