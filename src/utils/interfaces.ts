import { Course } from '@prisma/client';

export interface UserWithoutPassword {
    id: number;
    name: string;
    email: string;
    course: Course;
}
