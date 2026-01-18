import { Router } from "express";

import { requireAuth } from "../middleware/requireAuth";
import { idSchema, journalQuerySchema } from "../validations/zodSchemas";
import { areValidDates, formatEntries, isMoreThanAWeekApart, throwErr, toUtcDateOnly } from "../utils/utils";
import { journalRepository } from "../repository/journal.repo";
import { createOllamaProvider } from "../lib/llm/providers/ollama";

const router = Router();
const journalRepo = journalRepository();
const llm = createOllamaProvider();

router.get("/pattern", requireAuth, async (req, res) => {
  const userId = req.userId!;
  if (!req.query) throwErr("Date interval required", 405);
  
  const { from, to, qty } = journalQuerySchema.parse(req.query);
  
  if (areValidDates(from, to)) {
    const journals = await journalRepo.getMany(userId, from, to, qty);
    
    const formatted = formatEntries(journals);
    
    const result = await llm.patternCheck(formatted);
    
    res.status(200).json(result);
  }
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