import { Response, Request } from "express";
import { Post, PrismaClient, Role } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const create = async (req: Request, res: Response) => {
	const schema = z.object({
		title: z.string().min(1).max(255),
		description: z.string().min(1).max(255),
		upvotes: z.number().int().default(0),
		downvotes: z.number().int().default(0),
		authorId: z.number().int(),
		tags: z
			.array(
				z.object({
					key: z.string().min(1).max(255),
					category: z.string().min(1).max(255),
				})
			)
			.optional(),
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
		const { title, description, upvotes, downvotes, authorId, tags, files } = schema.parse(req.body);
		const post = await prisma.post.create({
			data: {
				title,
				description,
				upvotes,
				downvotes,
				authorId,
				tags: {
					create: tags,
				},
				files: {
					create: files,
				},
			},
			include: {
				tags: true,
				files: true,
			},
		});
		res.status(200).json({ message: "Post created.", post });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const update = async (req: Request, res: Response) => {
	const { id } = req.params;

	const postSchema = z.object({
		title: z.string().min(1).max(255).optional(),
		description: z.string().min(1).max(255).optional(),
		upvotes: z.number().int().optional(),
		downvotes: z.number().int().optional(),
		authorId: z.number().int().optional(),
		tags: z
			.array(
				z.object({
					key: z.string().min(1).max(255),
					category: z.string().min(1).max(255),
				})
			)
			.optional(),
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
		const { title, description, upvotes, downvotes, authorId, tags, files } = postSchema.parse(req.body);
		const post: Post = await prisma.post.update({
			where: { id: Number(id) },
			data: {
				title,
				description,
				upvotes,
				downvotes,
				authorId,
				tags: {
					deleteMany: {},
					create: tags,
				},
				files: {
					deleteMany: {},
					create: files,
				},
			},
			include: {
				tags: true,
				files: true,
			},
		});
		res.status(200).json({ message: "Post updated.", post });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const index = async (req: Request, res: Response) => {
	try {
		const posts = await prisma.post.findMany({
			include: {
				tags: true,
				files: true,
			},
		});
		res.json(posts);
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const show = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const post = await prisma.post.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				tags: true,
				files: true,
			},
		});
		if (post === null) {
			res.status(404).json({ message: `Post ${id} not found` });
		} else {
			res.json(post);
		}
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};

export const destroy = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const post = await prisma.post.findUnique({ where: { id: Number(id) } });
		if (post) {
			await prisma.post.deleteMany({ where: { id: post.id } });
		}
		res.status(200).json({ message: "Post deleted." });
	} catch (err) {
		res.status(500).json({ message: "Internal server error.", err: err.message });
	}
};
