import { prisma } from "../config/prisma";
import type { Journal, JournalRepository } from "../utils/interfaces";
import { Prisma } from "../generated/prisma/client";
import { validateDates } from "../utils/utils";
import { JournalNotFoundError, UnauthorizedAccessError } from "../errors/domain";

export function journalRepository(): JournalRepository {
  async function create(userId: string, content: string): Promise<Journal> {
    return await prisma.journalEntry.create({
      data: {
        userId,
        content,
      },
    });
  }

  async function getOne(journalId: string, userId: string): Promise<Journal> {
    const journal = await prisma.journalEntry.findUnique({
      where: { journalId },
    });
    if (!journal) throw new JournalNotFoundError();
    if (journal.userId != userId) throw new UnauthorizedAccessError();
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

  async function deleteOne(journalId: string, userId: string): Promise<void> {
    const _ = await getOne(journalId, userId);
    await prisma.journalEntry.delete({
      where: { journalId },
    });
  }

  return { create, getOne, getMany, deleteOne };
}
