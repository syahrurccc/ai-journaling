import { prisma } from "../config/prisma";
import type { User, UserRepository } from "../utils/interfaces";

export function userRepository(): UserRepository {
  async function create(email: string, password: string): Promise<void> {
    await prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async function findOne(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  return { create, findOne };
}
