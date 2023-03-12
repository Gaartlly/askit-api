import bcrypt from "bcrypt";

// Salt rounds = Cost factor. The cost factor controls how much time is needed to calculate a single BCrypt hash.

// Generate hash
export async function hashPassword(password: string, saltRounds: number): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

// Compare hash
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
    return await bcrypt.compare(password, storedHash);
}
