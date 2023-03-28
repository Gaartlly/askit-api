import { Response, Request } from 'express';
import { Post, PrismaClient } from '@prisma/client';
import { z } from 'zod';

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
export const createPost = async (req: Request, res: Response): Promise<void> => {
    const createSchema = z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1).max(255),
        authorId: z.number().int(),
        tags: z.array(
            z.object({
                key: z.string().min(1).max(255),
                categoryId: z.number(),
            })
        ),
    });

    try {
        const { title, content, authorId, tags } = createSchema.parse(req.body);
        const createdPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId,
                tags: {
                    connectOrCreate: tags.map((tag) => {
                        const { key, categoryId } = tag;
                        return {
                            where: {
                                key_categoryId: { key, categoryId },
                            },
                            create: {
                                key,
                                categoryId,
                            },
                        };
                    }),
                },
            },
            include: {
                tags: true,
                files: true,
            },
        });

        res.status(201).json({ message: 'Post created.', post: createdPost });
    } catch (error) {
        console.error(error);
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
        content: z.string().min(1).max(255).optional(),
        authorId: z.number().int().optional(),
        tags: z
            .array(
                z.object({
                    key: z.string().min(1).max(255),
                    categoryId: z.number(),
                })
            )
            .optional(),
    });

    try {
        const postId = await integerValidator.parseAsync(req.params.postId);

        const { title, content, authorId, tags } = updateSchema.parse(req.body);

        const updatedPost: Post = await prisma.post.update({
            where: { id: postId },
            data: {
                title,
                content,
                authorId,
                tags: {
                    connectOrCreate: tags.map((tag) => {
                        const { key, categoryId } = tag;
                        return {
                            where: {
                                key_categoryId: { key, categoryId },
                            },
                            create: {
                                key,
                                categoryId,
                            },
                        };
                    }),
                },
            },
            include: {
                tags: true,
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
 * Update a post, disconnecting a tag from it.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const disconnectTagFromPost = async (req: Request, res: Response): Promise<void> => {
    const disconnectSchema = z.object({
        postId: z.number().int(),
        tagId: z.number().int(),
    });

    try {
        const { postId, tagId } = disconnectSchema.parse(req.body);

        const updatedPost: Post = await prisma.post.update({
            where: { id: postId },
            data: {
                tags: {
                    disconnect: {
                        id: tagId,
                    },
                },
            },
            include: {
                tags: true,
            },
        });

        res.status(200).json({ message: 'Tag disconnected.', post: updatedPost });
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
        const posts = await prisma.post.findMany({
            include: {
                tags: true,
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
        const postId = await integerValidator.parseAsync(req.params.postId);

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                tags: true,
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
 * Get all posts from an author.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getPostsByAuthor = async (req: Request, res: Response): Promise<void> => {
    const getSchema = z.object({
        authorId: z.number().int(),
    });

    try {
        const { authorId } = getSchema.parse(req.body);

        const posts = await prisma.post.findMany({
            where: {
                authorId,
            },
            include: {
                tags: true,
                files: true,
            },
        });

        res.status(200).json({ posts: posts });
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
        const id = await integerValidator.parseAsync(req.params.postId);

        const post = await prisma.post.findUnique({ where: { id } });
        if (post) {
            await prisma.post.delete({ where: { id } });
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
