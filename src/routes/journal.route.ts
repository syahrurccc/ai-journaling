import { Router } from "express";
import { Prisma } from "../generated/prisma/client";
import { idSchema, journalQuerySchema, journalSchema } from "../validations/zodSchemas";
import { prisma } from "../config/prisma";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { content } = journalSchema.parse(req.body);

  const journal = await prisma.journalEntry.create({
    data: {
      userId: req.userId!,
      content
    },
  });
  
  res.status(201).json({
    message: "Entry created",
    journal,
  });
});

router.get("/", requireAuth, async (req, res) => {
  const { from, to } = journalQuerySchema.parse(req.query);
  const userId = req.userId!
  
  const where: Prisma.JournalEntryWhereInput = {
    userId,
    createdAt: {
      ...(from && { gte: new Date(from as string) }),
      ...(to && { lte: new Date(to as string) }),
    },
  };
  
  const journals = await prisma.journalEntry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  
  res.status(200).json(journals);
});

router.get("/:id", requireAuth, async (req, res) => {
  const journalId = idSchema.parse(req.params.id);
  
  const journal = await prisma.journalEntry.findUnique({
    where: {
      id: journalId,
    }
  });
  
  res.status(200).json(journal);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const journalId = idSchema.parse(req.params.id);
  await prisma.journalEntry.delete({
    where: {
      id: journalId,
    }
  });
  
  res.status(201).json({ message: "Entry deleted" })
});

export default router;
