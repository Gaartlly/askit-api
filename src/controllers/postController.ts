import { Response, Request } from 'express';
import { z } from 'zod';
import prismaClient from '../services/prisma/prismaClient';

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
export const createPost = async (req: Request, res: Response): Promise<void> => {
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

    try {
        const post = createSchema.parse(req.body);
        const createdPost = await prismaClient.post.create({
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
        res.status(201).json({ message: 'Post created.', post: createdPost });
    } catch (error) {
        if (error.name === 'ZodError') {
            res.status(400).json({ error: error });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

/**
 * Update a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const updatePost = async (req: Request, res: Response): Promise<void> => {
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

    try {
        const id = await integerValidator.parseAsync(req.body.postId);
        const currentPost = await prismaClient.post.findUnique({
            where: { id },
            include: {
                files: true,
            },
        });

        if (currentPost === null) {
            res.status(404).json({ message: `Post ${id} not found` });
        }

        const currentFilesIds = currentPost.files.map((file) => file.id);
        const newPost = updateSchema.parse(req.body);
        const createdFiles = newPost.files.filter((obj) => obj.id == undefined); //Arquivos que chegam sem id
        const updatedFiles = newPost.files.filter((obj) => obj.id !== undefined); //Arquivos que chegam com id
        const deletedFilesIds = currentFilesIds.filter((id) => !updatedFiles.map((obj) => obj.id).includes(id)); //Arquivos que não estão entre os novos

        await prismaClient.file.deleteMany({ where: { id: { in: deletedFilesIds } } });
        for (const file of updatedFiles) {
            await prismaClient.file.update({ where: { id: file.id }, data: file });
        }

        const updatedPost = await prismaClient.post.update({
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

        res.status(200).json({ message: 'Post updated.', post: updatedPost });
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
 * Get all posts.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await prismaClient.post.findMany({
            include: {
                files: true,
            },
        });
        res.status(200).json({ posts: posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

/**
 * Get a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.body.postId);

        const post = await prismaClient.post.findUnique({
            where: {
                id,
            },
            include: {
                files: true,
            },
        });

        res.status(200).json({ post: post });
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
 * Delete a post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = await integerValidator.parseAsync(req.body.postId);

        const post = await prismaClient.post.findUnique({ where: { id } });
        if (post) {
            await prismaClient.post.deleteMany({ where: { id } });
        }

        res.status(200).json({ message: 'Post deleted.' });
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
