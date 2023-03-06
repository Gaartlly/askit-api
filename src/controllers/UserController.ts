import { Response, Request } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const createUserSchema = z.object({
            name:z.string(),
            email:z.string().email(),
            password:z.string(),
            role:z.enum([ Role.ADMIN, Role.USER ]),
            status:z.boolean(),
            course:z.string()
        });

        const { name, email, password, role, status, course  } = createUserSchema.parse(req.body);

        const user = await prisma.user.create({
            data: {
            name,
            email,
            password,
            role,
            status,
            course
            },
        });
  
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error', err: err.message});
    }
};