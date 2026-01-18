import { prisma } from "../config/prisma";
import type { Journal, JournalRepository } from "../utils/interfaces";
import { Prisma } from "../generated/prisma/client";
import { validateDates } from "../utils/utils";

export function journalRepository(): JournalRepository {
  async function create(userId: string, content: string): Promise<Journal> {
    return await prisma.journalEntry.create({
      data: {
        userId,
        content,
      },
    });
  }

  async function getOne(id: string): Promise<Journal | null> {
    const journal = await prisma.journalEntry.findUnique({
      where: { id },
    });
    return journal;
  }

  async function getMany(
    userId: string,
    from?: string,
    to?: string,
    qty?: number,
  ): Promise<Journal[]> {
    validateDates(from, to);
    const where: Prisma.JournalEntryWhereInput = {
      userId,
      createdAt: {
        ...(from && { gte: new Date(from) }),
        ...(to && { lte: new Date(to) }),
      },
    };

    const limit = Math.min(qty ?? 5, 10);

    return await prisma.journalEntry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async function deleteOne(id: string): Promise<void> {
    await prisma.journalEntry.delete({
      where: { id },
    });
  }

  return { create, getOne, getMany, deleteOne };
}
