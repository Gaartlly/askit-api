import { Response, Request } from "express";
import { Tag, PrismaClient, Role } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
	const createSchema = z.object({
		key: z.string().min(1).max(255),
		category: z.string().min(1).max(255),
		postId: z.number().int(),
	});

	try {
		const tag = createSchema.parse(req.body);
		const createdTag = await prisma.tag.create({
			data: { key: tag.key, category: tag.category, postId: tag.postId },
		});
		res.status(200).json({ message: "Tag created.", tag: createdTag });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const update = async (req: Request, res: Response) => {
	const { id } = req.params;

	const updateSchema = z.object({
		key: z.string().min(1).max(255).optional(),
		category: z.string().min(1).max(255).optional(),
		postId: z.number().int().optional(),
	});

	try {
		const tag = updateSchema.parse(req.body);
		const updatedTag: Tag = await prisma.tag.update({
			where: { id: Number(id) },
			data: { key: tag.key, category: tag.category, postId: tag.postId },
		});
		res.status(200).json({ message: "Tag updated.", tag: updatedTag });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const index = async (req: Request, res: Response) => {
	try {
		const tags = await prisma.tag.findMany();
		res.json({ tags: tags });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const show = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const tag = await prisma.tag.findUnique({
			where: {
				id: Number(id),
			},
		});
		if (tag === null) {
			res.status(404).json({ message: `Tag ${id} not found` });
		} else {
			res.json({ tag: tag });
		}
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const destroy = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const tag = await prisma.tag.findUnique({ where: { id: Number(id) } });
		if (tag) {
			await prisma.tag.deleteMany({ where: { id: tag.id } });
		}
		res.status(200).json({ message: "Tag deleted." });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};
