import { Router } from "express";
import { idSchema, journalQuerySchema, journalSchema } from "../validations/zodSchemas";
import { requireAuth } from "../middleware/requireAuth";
import { journalRepository } from "../repository/journal.repo";
import { throwErr } from "../utils/utils";

const router = Router();
const journalRepo = journalRepository();

router.post("/", requireAuth, async (req, res) => {
  const userId = idSchema.parse(req.userId!);
  const { content } = journalSchema.parse(req.body);

  const journal = await journalRepo.create(userId, content);
  
  res.status(201).json({
    message: "Entry created",
    journal,
  });
});

router.get("/", requireAuth, async (req, res) => {
  const userId = idSchema.parse(req.userId!);
  const { from, to, qty } = journalQuerySchema.parse(req.query);
  const journals = journalRepo.getMany(userId, from, to, qty);
  res.status(200).json(journals);
});

router.get("/:id", requireAuth, async (req, res) => {
  const userId = idSchema.parse(req.userId!);
  const journalId = idSchema.parse(req.params.id);
  
  const journal = await journalRepo.getOne(journalId);
  if (!journal) throwErr("Entry does not exist", 400);
  if (journal.userId != userId) throwErr("Unauthorized", 401);
  
  res.status(200).json(journal);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const userId = idSchema.parse(req.userId!);
  const journalId = idSchema.parse(req.params.id);
  
  const journal = await journalRepo.getOne(journalId);
  if (!journal) throwErr("Entry does not exist", 400);
  if (journal.userId != userId) throwErr("Unauthorized", 401);
  journalRepo.deleteOne(journal.id);
  
  res.status(201).json({ message: "Entry deleted" })
});

export default router;
