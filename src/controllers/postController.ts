import { Response, Request } from 'express';
import { Post, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { asyncHandler, formatSuccessResponse  } from '../utils/responseHandler';

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
 * Create a new post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        title: z.string().min(1).max(255),
        description: z.string().min(1).max(255),
        upvotes: z.number().int().default(0),
        downvotes: z.number().int().default(0),
        authorId: z.number().int(),
        files: z
            .array(
                z.object({
                    title: z.string().min(1).max(255),
                    path: z.string().min(1).max(255),
                })
            )
            .optional(),
    });

    const post = createSchema.parse(req.body);
    const createdPost = await prisma.post.create({
        data: {
            title: post.title,
            content: post.description,
            authorId: post.authorId,
            //files: {
            //    create: post.files,
            //},
        },
        include: {
            files: true,
        },
    });
    res.status(201).json(formatSuccessResponse(createdPost));
});

/**
 * Update a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updatePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const updateSchema = z.object({
        title: z.string().min(1).max(255).optional(),
        description: z.string().min(1).max(255).optional(),
        upvotes: z.number().int().optional(),
        downvotes: z.number().int().optional(),
        authorId: z.number().int().optional(),
        files: z
            .array(
                z.object({
                    id: z.number().int().optional(),
                    title: z.string().min(1).max(255),
                    path: z.string().min(1).max(255),
                })
            )
            .optional(),
    });

    const id = await integerValidator.parseAsync(req.body.postId);

    const currentPost = await prisma.post.findUniqueOrThrow({
        where: { 
            id 
        },
        include: {
            files: true
        }
    });

    const currentFilesIds = currentPost.files.map((file) => file.id);
    const newPost = updateSchema.parse(req.body);
    const createdFiles = newPost.files.filter((obj) => obj.id == undefined); // Arquivos que chegam sem id
    const updatedFiles = newPost.files.filter((obj) => obj.id !== undefined); //Arquivos que chegam com id
    const deletedFilesIds = currentFilesIds.filter((id) => !updatedFiles.map((obj) => obj.id).includes(id)); //Arquivos que não estão entre os novos

    await prisma.file.deleteMany({ where: { id: { in: deletedFilesIds } } });
    for (const file of updatedFiles) {
        await prisma.file.update({ where: { id: file.id }, data: file });
    }

    const updatedPost: Post = await prisma.post.update({
        where: { id },
        data: {
            title: newPost.title,
            content: newPost.description,
            authorId: newPost.authorId,
            //files: {
            //    createMany: { data: createdFiles },
            //},
        },
        include: {
            files: true,
        },
    });

    res.status(200).json(formatSuccessResponse(updatedPost));
});

/**
 * Get all posts.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPosts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const posts = await prisma.post.findMany({
        include: {
            files: true,
        },
    });

    res.status(200).json(formatSuccessResponse(posts));
});

/**
 * Get a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.body.postId);

    const post = await prisma.post.findUnique({
        where: {
            id
        },
        include: {
            files: true,
        },
    });

    res.status(200).json(formatSuccessResponse(post));
});

/**
 * Delete a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deletePost = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = await integerValidator.parseAsync(req.body.postId);

    const post = await prisma.post.findUniqueOrThrow({ where: { id } });

    res.status(200).json(formatSuccessResponse(post));
});