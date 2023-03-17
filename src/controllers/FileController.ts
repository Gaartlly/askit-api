import { Response, Request } from 'express';
import cloudinaryConnection from '../config/cloudinaryConfig';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Upload
export const uploadFile = async (req: Request, res: Response) => {
    try {
        const uploadFileSchema = z.object({
            title: z.string().min(1).max(255),
            path: z.string().min(1),
            postId: z.number().int(),
            commentId: z.number().int(),
        });

        const { title, path, postId, commentId } = uploadFileSchema.parse(req.body);

        const result = await cloudinaryConnection.uploader.upload(path, {
            resource_type: 'image',
        });

        const fileUploaded = await prisma.file.create({
            data: {
                title: title,
                path: result.secure_url || result.url,
                postId: postId,
                commentId: commentId,
            },
        });

        res.status(200).json({ message: 'File uploaded!', file: fileUploaded });
    } catch (error) {
        res.status(400).json({ messageError: error.message });
    }
};

// Get all files
export const getAllFiles = async (_: Request, res: Response) => {
    try {
        const files = await prisma.file.findMany();

        res.status(200).json({ files: files });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error!' });
    }
};

// Get file
export const getFileById = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        const file = await prisma.file.findUniqueOrThrow({
            where: {
                id: id,
            },
        });

        res.status(200).json(file);
    } catch (error) {
        res.status(404).json({ message: 'File not found!' });
    }
};

// Delete file
export const deleteFile = async (req: Request, res: Response) => {
    try {
        const id = +req.params.id;

        await prisma.file.delete({
            where: {
                id: id,
            },
        });

        res.status(200).json({ message: 'File deleted.' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Update file
export const updateFile = async (req: Request, res: Response) => {
    try {
        const updateFileSchema = z.object({
            id: z.number().int(),
            newTitle: z.string().min(1).max(255),
            newPath: z.string().min(1),
        });

        const { id, newTitle, newPath } = updateFileSchema.parse(req.body);

        await prisma.file.findFirstOrThrow({
            where: {
                id: id,
            },
        });

        const result = await cloudinaryConnection.uploader.upload(newPath, {
            resource_type: 'image',
        });

        const fileUpdated = await prisma.file.update({
            where: {
                id: id,
            },
            data: {
                title: newTitle,
                path: result.secure_url || result.url,
            },
        });

        res.status(200).json({ message: 'File updated!', file: fileUpdated });
    } catch (error) {
        res.status(400).json({ messageError: error.message });
    }
};
