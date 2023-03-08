import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import * as z from 'zod';
import { any, string } from 'zod';

const prisma = new PrismaClient();

const createCommentSchema = z.object({
  text: string(),
  category: string(),
  postId: string(),
  parentCommentId: string(),
  files: any() 
});

/**
 * Get all comments for a particular post.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = parseInt(req.params.postId);
    const comments = await prisma.comment.findMany({
      where: { postId },
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create a new comment.
 *
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 * @returns {Promise<void>}
 */
export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, category, files } = createCommentSchema.parse(req.body); 
    const postId = parseInt(createCommentSchema.parse(req.body).postId);
    const parentCommentId = parseInt(createCommentSchema.parse(req.body).postId);

    const comment =  await prisma.comment.create({
      data:{
          text,
          category,
          postId,
          parentCommentId
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error});
  }
};