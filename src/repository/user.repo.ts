import { prisma } from "../config/prisma";
import { AuthenticationError } from "../errors/domain";
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

  async function findOne(email: string): Promise<User> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AuthenticationError();
    return user;
  }

  return { create, findOne };
}
