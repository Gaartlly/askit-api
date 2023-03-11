import { Response, Request } from "express";
import { Tag, PrismaClient, Role } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
	const schema = z.object({
		key: z.string().min(1).max(255),
		category: z.string().min(1).max(255),
		postId: z.number().int(),
	});

	try {
		const { key, category, postId } = schema.parse(req.body);
		const tag = await prisma.tag.create({
			data: { key, category, postId },
		});
		res.status(200).json({ message: "Tag created.", tag });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const update = async (req: Request, res: Response) => {
	const { id } = req.params;

	const tagSchema = z.object({
		key: z.string().min(1).max(255).optional(),
		category: z.string().min(1).max(255).optional(),
		postId: z.number().int().optional(),
	});

	try {
		const { key, category, postId } = tagSchema.parse(req.body);
		const tag: Tag = await prisma.tag.update({
			where: { id: Number(id) },
			data: { key, category, postId },
		});
		res.status(200).json({ message: "Tag updated.", tag });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const index = async (req: Request, res: Response) => {
	try {
		const tags = await prisma.tag.findMany();
		res.json(tags);
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
			res.json(tag);
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
