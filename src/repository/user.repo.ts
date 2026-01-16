import { prisma } from "../config/prisma";
import type { User, UserRepository } from "../utils/interfaces";
import { Prisma } from "../generated/prisma/client";
import { throwErr } from "../utils/utils";

export function userRepository(): UserRepository {
  async function doesExist(email: string): Promise<boolean> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async function create(email: string, password: string): Promise<void> {
    await prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }

  async function findOne(email: string): Promise<User | undefined> {
    return await prisma.user.findUnique({ where: { email } });
  }

  return { doesExist, create, findOne };
}
