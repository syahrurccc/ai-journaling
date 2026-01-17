import { Router } from "express";

import { requireAuth } from "../middleware/requireAuth";
import { idSchema, journalQuerySchema } from "../validations/zodSchemas";
import { formatEntries, isMoreThanAWeekApart, throwErr, toUtcDateOnly } from "../utils/utils";
import { journalRepository } from "../repository/journal.repo";
import { createOllamaProvider } from "../lib/llm/providers/ollama";

const router = Router();
const journalRepo = journalRepository();
const llm = createOllamaProvider();

router.get("/pattern", requireAuth, async (req, res) => {
  const userId = req.userId!;
  if (!req.query) throwErr("Date interval required", 405);
  
  const { from, to } = journalQuerySchema.parse(req.query);
  const today = toUtcDateOnly(new Date());
  
  if (!from) throwErr("Starting date needs to be defined", 400);
  
  if (from && new Date(from) > today) {
    throwErr("Can't be from the future", 400);
  }
  
  if (from && to) {
    const d1 = new Date(from);
    const d2 = new Date(to);
    
    if (d1 > d2) {
      throwErr("Invalid date intervals", 400);
    } else if (isMoreThanAWeekApart(d1, d2)) {
      throwErr("Date intervals can't be more than a week", 400);
    }
  }
  
  const journals = await journalRepo.getMany(userId, from, to);
  
  const formatted = formatEntries(journals);
  
  const result = await llm.patternCheck(formatted);
  
  res.status(200).json(result);
});

router.get("/:id", requireAuth, async (req, res) => {
  const userId = req.userId!;
  const journalId = idSchema.parse(req.params.id);
  
  const journal = await journalRepo.getOne(journalId);
  
  if (!journal) throwErr("Entry does not exist", 400);
  if (journal.userId != userId) throwErr("Unauthorized", 401);
  
  const result = await llm.patternCheck(journal.content);
  
  res.status(200).json(result);
});

router.get("/summarize", requireAuth, async (req, res) => {

});

export default router;